// scripts/ingest/lib/extract.mjs
//
// PDF → text extraction for the ingestion pipeline.
//
// Uses `pdftotext` (poppler) — a system binary already on PATH on this box, so
// there is NO npm dependency to install (which the corp WDAC/DNS lockdown would
// block). This is deliberately not a model-native PDF ingestion: extracting
// clean text locally is cheaper, controllable, and keeps the doc out of the
// model context until we've chunked it.
//
// Exposes:
//   extractPdfText(pdfPath, opts) -> { text, pages, pageCount, sha256 }
//   splitSections(text)          -> [{ heading, level, body }]  (heuristic)
//
// CLI:  node scripts/ingest/lib/extract.mjs <pdf> [--raw] [--sections]

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";

/**
 * Extract text from a PDF via poppler's pdftotext.
 * @param {string} pdfPath
 * @param {object} [opts]
 * @param {boolean} [opts.layout=true] - preserve physical layout (-layout).
 *        Better for tables/columns; set false for pure reading-order prose.
 * @returns {{text:string, pages:string[], pageCount:number, sha256:string}}
 */
export function extractPdfText(pdfPath, { layout = true } = {}) {
  if (!fs.existsSync(pdfPath)) throw new Error(`PDF not found: ${pdfPath}`);
  const sha256 = createHash("sha256")
    .update(fs.readFileSync(pdfPath))
    .digest("hex");

  const args = [];
  if (layout) args.push("-layout");
  args.push("-enc", "UTF-8", "-eol", "unix", "-nopgbrk", "-q", pdfPath, "-");
  // -nopgbrk suppresses the \f page breaks in output; we re-derive pages with a
  // separate pass below so callers get both the clean stream and page slices.
  const res = spawnSync("pdftotext", args, {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  if (res.error) {
    throw new Error(
      `pdftotext failed to spawn (${res.error.code || res.error.message}). ` +
        `Is poppler on PATH?`,
    );
  }
  if (res.status !== 0) {
    throw new Error(`pdftotext exited ${res.status}: ${(res.stderr || "").trim()}`);
  }
  const text = normalize(res.stdout);

  // Second pass WITH page breaks to slice pages (cheap; pdftotext is fast).
  const pageArgs = ["-enc", "UTF-8", "-eol", "unix", "-q", pdfPath, "-"];
  if (layout) pageArgs.unshift("-layout");
  const pageRes = spawnSync("pdftotext", pageArgs, {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  const pages =
    pageRes.status === 0
      ? pageRes.stdout.split("\f").map(normalize)
      : [text];

  return { text, pages, pageCount: pages.length, sha256 };
}

/** Normalize whitespace: trim trailing spaces, collapse >2 blank lines. */
function normalize(s) {
  return s
    .replace(/[ \t]+\n/g, "\n") // trailing spaces
    .replace(/\n{3,}/g, "\n\n") // runs of blank lines
    .trim();
}

/**
 * Heuristic section splitter. Salesforce Help PDFs render headings as short
 * standalone lines (often Title Case, no trailing period) separated by blank
 * lines. This is a coarse pass to give the synthesizer navigable chunks; the
 * synthesizer also gets the full text, so a missed boundary is not fatal.
 * @returns {{heading:string, body:string}[]}
 */
export function splitSections(text) {
  const lines = text.split("\n");
  const sections = [];
  let cur = { heading: "(preamble)", body: [] };
  const isHeading = (ln, prev, next) => {
    const t = ln.trim();
    if (t.length < 3 || t.length > 80) return false;
    if (/[.:;,]$/.test(t)) return false; // sentences end in punctuation
    if (prev.trim() !== "" ) return false; // headings follow a blank line
    if (next.trim() === "") return false; // and precede content
    // Mostly Title Case / not a full sentence
    const words = t.split(/\s+/);
    if (words.length > 10) return false;
    return /^[A-Z0-9]/.test(t);
  };
  for (let i = 0; i < lines.length; i++) {
    const prev = i > 0 ? lines[i - 1] : "";
    const next = i < lines.length - 1 ? lines[i + 1] : "";
    if (isHeading(lines[i], prev, next)) {
      if (cur.body.join("").trim()) sections.push({ heading: cur.heading, body: cur.body.join("\n").trim() });
      cur = { heading: lines[i].trim(), body: [] };
    } else {
      cur.body.push(lines[i]);
    }
  }
  if (cur.body.join("").trim()) sections.push({ heading: cur.heading, body: cur.body.join("\n").trim() });
  return sections;
}

// ── CLI ────────────────────────────────────────────────────────────────────
import { pathToFileURL } from "node:url";
const invokedDirectly =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  const args = process.argv.slice(2);
  const pdf = args.find((a) => !a.startsWith("--"));
  const layout = !args.includes("--raw");
  const showSections = args.includes("--sections");
  if (!pdf) {
    process.stderr.write("Usage: node extract.mjs <pdf> [--raw] [--sections]\n");
    process.exit(2);
  }
  const { text, pageCount, sha256 } = extractPdfText(pdf, { layout });
  process.stdout.write(
    `pages=${pageCount}  chars=${text.length}  ~tokens≈${Math.round(text.length / 4)}  sha256=${sha256.slice(0, 12)}…\n`,
  );
  if (showSections) {
    const secs = splitSections(text);
    process.stdout.write(`sections=${secs.length}\n`);
    for (const s of secs.slice(0, 40)) {
      process.stdout.write(`  • ${s.heading}  (${s.body.length} chars)\n`);
    }
  } else {
    process.stdout.write("\n--- first 60 lines ---\n");
    process.stdout.write(text.split("\n").slice(0, 60).join("\n") + "\n");
  }
}
