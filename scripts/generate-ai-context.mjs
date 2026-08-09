#!/usr/bin/env node
// scripts/generate-ai-context.mjs
//
// Deterministically regenerates products/<id>/ai-context.js from that
// product's config.js + data.js + entities.js. This is the AI worker's
// grounding context (the string every ai-context.js exports as AI_CONTEXT).
//
// It is a PURE transform: no network, no model, no randomness. Given the same
// three input files it always produces the same bytes. That property is what
// makes it verifiable — `--check` regenerates and diffs against the committed
// file, so we can prove the generator is faithful before trusting it on
// freshly-synthesized data files.
//
// Usage:
//   node scripts/generate-ai-context.mjs <productId>            # write products/<id>/ai-context.js
//   node scripts/generate-ai-context.mjs <productId> --stdout   # print, don't write
//   node scripts/generate-ai-context.mjs <productId> --check    # diff vs committed; exit 1 on mismatch
//
// Importable: buildContext(config, PRODUCT, ENTITIES) -> body string;
//             buildFile(id, body) -> full file text.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..");
const SITE_BASE = "https://epugach.github.io/product-explorer";

// ── Formatting primitives ────────────────────────────────────────────────

/**
 * Reduce a multi-sentence description to its first sentence (inclusive of the
 * terminal period). Used in the Domains, Key Components, Key Objects, and
 * Custom Metadata sections, where only the lead sentence is surfaced.
 */
export function firstSentence(text) {
  if (!text) return "";
  const i = text.indexOf(". ");
  if (i !== -1) return text.slice(0, i + 1);
  return text; // single sentence (already ends in "." or has no boundary)
}

// ── Section builders ─────────────────────────────────────────────────────
// Each returns an array of lines (no leading/trailing blanks); the assembler
// inserts exactly one blank line between sections.

function domainName(PRODUCT, domainId) {
  return PRODUCT[domainId] ? PRODUCT[domainId].name : domainId;
}

/**
 * Build the AI_CONTEXT body string from the three product data structures.
 * Pure: identical inputs -> identical output.
 */
export function buildContext(config, PRODUCT, ENTITIES) {
  const domainIds = Object.keys(PRODUCT);
  const idUpper = config.id.toUpperCase();

  // Counts are computed from the live data (not copied from config.stats) so
  // the header numbers stay correct after any regeneration.
  const nDomains = domainIds.length;
  let nComponents = 0;
  for (const d of domainIds) nComponents += (PRODUCT[d].components || []).length;
  let nObjects = 0;
  let nMetadata = 0;
  for (const d of domainIds) {
    const e = ENTITIES[d] || {};
    nObjects += (e.objects || []).length;
    nMetadata += (e.metadata || []).length;
  }

  const out = [];

  // Intro (3 lines). Note: the template literally prefixes "Salesforce " to
  // config.fullName, which for products whose fullName already begins with
  // "Salesforce" yields a doubled prefix — reproduced faithfully.
  out.push(
    `You are an expert on Salesforce ${config.fullName} (${idUpper}) ${config.version}.`,
    `Answer questions based ONLY on the following product knowledge. If the question is not about ${idUpper} or you are unsure, say so clearly. Keep answers concise (2-4 sentences).`,
    `When mentioning domains or components, include markdown links using the URLs from the Links section below.`,
  );

  const section = (lines) => {
    out.push("");
    for (const l of lines) out.push(l);
  };

  // ## Domains (N)
  {
    const lines = [`## Domains (${nDomains})`];
    for (const id of domainIds) {
      const d = PRODUCT[id];
      lines.push(`- **${d.name}** (${id}): ${firstSentence(d.description)}`);
    }
    section(lines);
  }

  // ## Key Components (N)
  {
    const lines = [`## Key Components (${nComponents})`];
    for (const id of domainIds) {
      const d = PRODUCT[id];
      for (const c of d.components || []) {
        const lead = firstSentence(c.desc);
        const extra = c.docs && c.docs.length ? ` ${c.docs[0]}` : "";
        lines.push(`- **${c.name}** [${d.name}]: ${lead}${extra}`);
      }
    }
    section(lines);
  }

  // ## Key Objects (N)  — grouped by domain, domains with 0 objects skipped
  {
    const lines = [`## Key Objects (${nObjects})`];
    for (const id of domainIds) {
      const objs = (ENTITIES[id] && ENTITIES[id].objects) || [];
      if (!objs.length) continue;
      lines.push(`### ${PRODUCT[id].name}`);
      for (const o of objs) {
        lines.push(`- **${o.name}**: ${firstSentence(o.description)}`);
      }
    }
    section(lines);
  }

  // ## Custom Metadata Types (N) — grouped by domain, domains with 0 skipped.
  // The whole section is omitted when the product has no metadata types at all
  // (products like OmniStudio / Public Sector Solutions), matching the source
  // generator — no empty "## Custom Metadata Types (0)" header.
  if (nMetadata > 0) {
    const lines = [`## Custom Metadata Types (${nMetadata})`];
    for (const id of domainIds) {
      const md = (ENTITIES[id] && ENTITIES[id].metadata) || [];
      if (!md.length) continue;
      lines.push(`### ${PRODUCT[id].name}`);
      for (const m of md) {
        lines.push(`- **${m.type}** (${m.name}): ${firstSentence(m.description)}`);
      }
    }
    section(lines);
  }

  // ## Object Fields — flat, per-object (domain order), objects with 0 fields skipped
  {
    const lines = ["## Object Fields"];
    for (const id of domainIds) {
      const objs = (ENTITIES[id] && ENTITIES[id].objects) || [];
      for (const o of objs) {
        const fields = o.fields || [];
        if (!fields.length) continue;
        lines.push(`### ${o.name} (${fields.length} fields)`);
        for (const f of fields) {
          lines.push(`- ${f.name} (${f.type}): ${f.description}`);
        }
      }
    }
    section(lines);
  }

  // ## Object Relationships — flat list (domain order, object order, rel order)
  {
    const lines = ["## Object Relationships"];
    for (const id of domainIds) {
      const objs = (ENTITIES[id] && ENTITIES[id].objects) || [];
      for (const o of objs) {
        for (const r of o.relationships || []) {
          lines.push(`- ${o.name} -> ${r.target} (${r.type}): ${r.description}`);
        }
      }
    }
    section(lines);
  }

  // ## Cross-Domain Connections — each undirected domain pair once.
  // data.js stores connections redundantly on both endpoints (A lists B and
  // B lists A); the context surfaces each edge a single time, from the earlier
  // domain in iteration order, using that domain's description.
  {
    const lines = ["## Cross-Domain Connections"];
    const seen = new Set();
    for (const id of domainIds) {
      const d = PRODUCT[id];
      for (const c of d.connections || []) {
        const key = [id, c.planet].sort().join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        lines.push(`- ${d.name} <-> ${domainName(PRODUCT, c.planet)}: ${c.desc}`);
      }
    }
    section(lines);
  }

  // ## Data Flows — grouped by domain, numbered steps
  {
    const lines = ["## Data Flows"];
    for (const id of domainIds) {
      const d = PRODUCT[id];
      lines.push(`### ${d.name}`);
      (d.dataFlow || []).forEach((step, i) => lines.push(`${i + 1}. ${step}`));
    }
    section(lines);
  }

  // ## Links
  {
    const lines = ["## Links", "Use these URLs when mentioning domains or components:"];
    for (const id of domainIds) {
      lines.push(`- [${PRODUCT[id].name}](${SITE_BASE}/${config.id}/#/${id})`);
    }
    section(lines);
  }

  // The committed body ends with a trailing newline (after the last Links line).
  return out.join("\n") + "\n";
}

/**
 * Wrap the body string in the ai-context.js module scaffold.
 *
 * The file's physical lines use CRLF to match the committed artifacts (the
 * repo is Windows-authored), so regenerating is churn-free and the diff-vs-
 * committed gate is a true byte match. The AI_CONTEXT value's *internal*
 * newlines stay as "\n" — JSON.stringify emits them as the two-char escape,
 * so CRLF-joining the four physical lines never touches them.
 */
export function buildFile(id, body) {
  return (
    [
      `// Auto-generated by scripts/generate-ai-context.mjs`,
      `// Source: products/${id}/config.js + data.js + entities.js`,
      `// Do not edit manually. Regenerate with: node scripts/generate-ai-context.mjs ${id}`,
      `export const AI_CONTEXT = ${JSON.stringify(body)};`,
    ].join("\r\n") + "\r\n"
  );
}

/** Load the three product modules and produce the full ai-context.js text. */
export async function generate(id, { root = REPO_ROOT } = {}) {
  const dir = path.join(root, "products", id);
  const imp = async (name) =>
    import(pathToFileURL(path.join(dir, name)).href);
  const config = (await imp("config.js")).default;
  const { PRODUCT } = await imp("data.js");
  const ENTITIES = (await imp("entities.js")).default;
  const body = buildContext(config, PRODUCT, ENTITIES);
  return buildFile(id, body);
}

// ── CLI ──────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const id = args.find((a) => !a.startsWith("--"));
  const check = args.includes("--check");
  const stdout = args.includes("--stdout");
  if (!id) {
    process.stderr.write(
      "Usage: node scripts/generate-ai-context.mjs <productId> [--check|--stdout]\n",
    );
    process.exit(2);
  }

  const text = await generate(id);
  const target = path.join(REPO_ROOT, "products", id, "ai-context.js");

  if (stdout) {
    process.stdout.write(text);
    return;
  }

  if (check) {
    const committed = fs.existsSync(target)
      ? fs.readFileSync(target, "utf8")
      : "";
    if (committed === text) {
      process.stdout.write(`OK: ${id}/ai-context.js matches generator output byte-for-byte (${text.length} bytes)\n`);
      return;
    }
    // Compare EOL-normalized so a stray CRLF/LF difference can't mask (or
    // impersonate) a real content divergence.
    const strip = (s) => s.replace(/\r\n/g, "\n");
    if (strip(committed) === strip(text)) {
      process.stderr.write(
        `MISMATCH (EOL only): ${id}/ai-context.js content is identical but line endings differ.\n`,
      );
      process.exit(1);
    }
    const a = strip(committed).split("\n");
    const b = strip(text).split("\n");
    const n = Math.max(a.length, b.length);
    let firstDiff = -1;
    for (let i = 0; i < n; i++) {
      if (a[i] !== b[i]) { firstDiff = i; break; }
    }
    process.stderr.write(
      `MISMATCH (content): ${id}/ai-context.js differs from generator output.\n` +
        `  committed: ${committed.length} bytes, ${a.length} content lines\n` +
        `  generated: ${text.length} bytes, ${b.length} content lines\n`,
    );
    if (firstDiff !== -1) {
      process.stderr.write(
        `  first content diff at line ${firstDiff + 1}:\n` +
          `    committed: ${JSON.stringify(a[firstDiff])}\n` +
          `    generated: ${JSON.stringify(b[firstDiff])}\n`,
      );
    }
    process.exit(1);
  }

  fs.writeFileSync(target, text, "utf8");
  process.stdout.write(`Wrote ${target} (${text.length} bytes)\n`);
}

// Run only when invoked directly (not when imported by tests).
const invokedDirectly =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  main().catch((err) => {
    process.stderr.write(`[generate-ai-context] ${err.stack || err.message}\n`);
    process.exit(1);
  });
}
