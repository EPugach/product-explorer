#!/usr/bin/env node
// scripts/ingest/refresh.mjs
//
// One-command refresh (Workstream B, item 4). Ties the item-4 modules into the acceptance flow:
//   fetch-or-reuse  ->  archive (dated)  ->  change-detect  ->  [if changed] synthesize
//   ->  grounding gate  ->  promote (only if gates+grounding pass) or HOLD for review.
//
// Safe by construction: re-synthesizes ONLY on meaningful change; a grounding contradiction
// BLOCKS promotion (held for human review — council: a clean gate is not yet auto-promote-worthy).
//
// Usage: node scripts/ingest/refresh.mjs <id> [--fetch] [--force] [--detect-only] [--promote]
//   --fetch        fetch the PDF headlessly (else reuse the staged input/<id>.pdf)
//   --force        synthesize even if change-detection says unchanged
//   --detect-only  stop after fetch+archive+change-detect (no synthesis) — cheap dry-run
//   --promote      promote scratch->products/<id> IF gates+grounding pass (else always hold)

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

import { extractPdfText } from "./lib/extract.mjs";
import { docFingerprint, detectChange } from "./lib/changedetect.mjs";
import { writeSnapshot, latestSnapshot } from "./lib/archive.mjs";
import { fetchBundlePdf } from "./lib/fetch.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const ARCHIVE_ROOT = path.join(HERE, "archive");
const INPUT_DIR = path.join(HERE, "input");
const log = (...a) => process.stdout.write(a.join(" ") + "\n");

// Date without Date.now()-in-workflow constraints (this is a normal CLI): use the OS date.
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function main() {
  const id = process.argv[2];
  const flag = (f) => process.argv.includes(f);
  if (!id) { process.stderr.write("usage: refresh.mjs <id> [--fetch] [--force] [--detect-only] [--promote]\n"); process.exit(2); }

  const bundles = JSON.parse(fs.readFileSync(path.join(HERE, "bundles.json"), "utf8"));
  const entry = bundles.products?.[id];
  if (!entry) throw new Error(`no bundles.json entry for "${id}"`);

  // 1. Obtain the PDF + its bundle-id.
  let pdfBuffer, bundleId, sourceUrl;
  if (flag("--fetch")) {
    const stems = entry.stems?.length ? entry.stems : [entry.primary].filter(Boolean);
    const r = await fetchBundlePdf({ downloadPage: entry.downloadPage, stems, log });
    ({ pdfBuffer, bundleId, sourceUrl } = r);
    fs.writeFileSync(path.join(INPUT_DIR, `${id}.pdf`), pdfBuffer);
  } else {
    const p = path.join(INPUT_DIR, `${id}.pdf`);
    if (!fs.existsSync(p)) throw new Error(`no staged input/${id}.pdf (pass --fetch to download)`);
    pdfBuffer = fs.readFileSync(p);
    bundleId = entry.lastKnownBundleIds?.[0] || entry.primary || null;
  }

  // 2. Fingerprint + change-detect vs the latest archived snapshot.
  const { text: rawText } = extractPdfText(path.join(INPUT_DIR, `${id}.pdf`), { layout: true });
  const fp = docFingerprint(rawText, bundleId);
  const prev = latestSnapshot(ARCHIVE_ROOT, id);
  const prevFp = prev ? { bundleId: prev.bundleId, normalizedSha: prev.normalizedSha, normalizedLength: prev.normalizedLength ?? 0 } : null;
  const change = detectChange(prevFp, fp);

  // 3. Archive this fetch (dated + content-hash; idempotent; never deletes).
  const snap = writeSnapshot(ARCHIVE_ROOT, id, {
    date: today(), fetchedAt: new Date().toISOString(), pdfBuffer, rawText,
    normalizedSha: fp.normalizedSha, bundleId, sourceUrl,
  });
  log(`[refresh] ${id}: bundle=${bundleId} archived=${snap.wrote ? "new" : "idempotent"} changed=${change.changed}${change.reasons.length ? " (" + change.reasons.join("; ") + ")" : ""}`);

  if (!change.changed && !flag("--force")) { log(`[refresh] ${id}: unchanged — skipping re-synthesis.`); return; }
  if (flag("--detect-only")) { log(`[refresh] ${id}: detect-only — would ${change.changed ? "re-synthesize" : "skip"}.`); return; }

  // 4. Synthesize (only reached when changed or --force).
  log(`[refresh] ${id}: synthesizing…`);
  const synth = spawnSync(process.execPath, [path.join(HERE, "synthesize.mjs"), id], { cwd: REPO_ROOT, stdio: "inherit" });
  if (synth.status !== 0) throw new Error(`synthesize failed (${synth.status})`);

  // 5. Grounding gate (full-doc recall). Blocks promote on any contradiction.
  log(`[refresh] ${id}: grounding…`);
  const ground = spawnSync(process.execPath, [path.join(HERE, "ground.mjs"), id, "--full-doc"], { cwd: REPO_ROOT, stdio: "inherit" });
  const groundingClean = ground.status === 0;

  // 6. Promote or hold.
  if (flag("--promote") && groundingClean) {
    const { promoteBatch } = await import("./lib/promote.mjs");
    const r = promoteBatch(REPO_ROOT, [{ id, scratchDir: path.join(HERE, "scratch", id), okToPromote: true }], { journalPath: path.join(HERE, "scratch", "promote-journal.json") });
    log(`[refresh] ${id}: promoted ${r.promoted.length ? "OK" : "FAILED"} — review git diff + bump DATA_CACHE before deploy.`);
  } else {
    log(`[refresh] ${id}: HELD for review${groundingClean ? "" : " (grounding found contradictions — see grounding-report.md)"}. Not promoted.`);
    if (!groundingClean) process.exitCode = 1;
  }
}

const invokedDirectly = typeof process.argv[1] === "string" && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main().catch((e) => { process.stderr.write(`[refresh] FATAL: ${e.stack || e.message}\n`); process.exit(1); });
