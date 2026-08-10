#!/usr/bin/env node
// scripts/ingest/schema-audit.mjs
//
// Schema-vs-doc reconcile REPORT (Workstream B, item 5B). Deterministic + read-only — no model,
// no gateway (so it's immune to the grounding gate's nondeterminism). For each committed object
// field, checks whether the field name appears in the doc corpus (Help, or Help+Dev if a dev
// guide is staged/fused), trying common label variants. Fields found in NEITHER doc are
// schema-vs-doc gaps: either the committed schema uses a name the docs don't (rename candidate)
// or the field is genuinely undocumented. FIXING these un-freezes the schema — that stays a human
// decision; this only SURFACES them.
//
// Usage: node scripts/ingest/schema-audit.mjs <id>

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { extractPdfText } from "./lib/extract.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const log = (...a) => process.stdout.write(a.join(" ") + "\n");

// Candidate spellings a docs writer might use for an API field name. Docs use prose labels, not
// API names, so we try: the raw name, a Pascal/camel + ALL-CAPS-run split ("GLCode" -> "GL Code",
// "AccountingSetId" -> "Accounting Set Id"), and the same with trailing Id/Field/Checkbox/Value
// dropped ("OverallAmountField" -> "Overall Amount", "PaymentPaidCheckbox" -> "Payment Paid").
function splitCase(s) {
  return s.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}
function variants(name) {
  const base = name.replace(/__c$|__mdt$/i, "");
  const trimmed = base.replace(/(Id|Field|Checkbox|Value|Code|Date)$/,"");
  const out = [base, splitCase(base), splitCase(trimmed)];
  return [...new Set(out.map((s) => s.toLowerCase().trim()).filter((s) => s.length >= 3))];
}

async function main() {
  const id = process.argv[2];
  if (!id) { process.stderr.write("usage: schema-audit.mjs <id>\n"); process.exit(2); }

  const ENTITIES = (await import(pathToFileURL(path.join(REPO_ROOT, "products", id, "entities.js")).href)).default;

  // Doc corpus: the fused scratch _doctext.txt if present, else Help(+Dev) from input/.
  let corpus;
  const scratchDoc = path.join(HERE, "scratch", id, "_doctext.txt");
  if (fs.existsSync(scratchDoc)) corpus = fs.readFileSync(scratchDoc, "utf8");
  else {
    corpus = extractPdfText(path.join(HERE, "input", `${id}.pdf`), { layout: true }).text;
    const dev = path.join(HERE, "input", `${id}-dev.pdf`);
    if (fs.existsSync(dev)) corpus += "\n" + extractPdfText(dev, { layout: true }).text;
  }
  const hay = corpus.toLowerCase();
  const fused = /===== DEVELOPER GUIDE =====/.test(corpus);

  const rows = [];
  let totalFields = 0, missing = 0;
  for (const [domainId, ent] of Object.entries(ENTITIES)) {
    for (const o of ent.objects || []) {
      for (const f of o.fields || []) {
        totalFields++;
        const found = variants(f.name).some((v) => v.length >= 3 && hay.includes(v));
        if (!found) { missing++; rows.push({ domainId, object: o.name, field: f.name }); }
      }
    }
  }

  const report = [
    `# Schema-vs-doc audit — ${id}${fused ? " (Help+Dev fused corpus)" : " (Help only)"}`,
    ``,
    `- object fields checked: **${totalFields}**`,
    `- **not found in docs: ${missing}** (${totalFields ? Math.round((missing / totalFields) * 100) : 0}%)`,
    ``,
    `> Fields whose name (or a common label variant) does not appear in the corpus. Each is a`,
    `> rename candidate (schema uses a name the docs don't) or a genuinely undocumented field.`,
    `> Fixing = un-freezing the committed schema — a human decision (item 5B).`,
    ``,
    missing ? rows.map((r) => `- \`${r.object}.${r.field}\`  (${r.domainId})`).join("\n") : "_all committed fields are documented_",
    ``,
  ].join("\n");
  const out = path.join(HERE, "scratch", id, "schema-doc-audit.md");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, report);
  log(`[schema-audit] ${id}: ${missing}/${totalFields} fields not found in ${fused ? "Help+Dev" : "Help"} corpus → ${path.relative(REPO_ROOT, out)}`);
}

const invokedDirectly = typeof process.argv[1] === "string" && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main().catch((e) => { process.stderr.write(`[schema-audit] FATAL: ${e.message}\n`); process.exit(1); });
