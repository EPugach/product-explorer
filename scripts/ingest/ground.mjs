#!/usr/bin/env node
// scripts/ingest/ground.mjs
//
// Programmatic grounding gate CLI (Workstream B, item 4 — P4 #1). Audits a synthesized
// product (scratch by default, or --committed) domain-by-domain: for each domain it
// retrieves the same Help-doc chunk synthesis used, gathers the regenerated prose, and
// asks an LLM judge to verify claims against Help doc UNION frozen schema (see lib/grounding.mjs).
//
// Any CONTRADICTED claim => exit 1 (blocks promote). A clean run is a SPOT-CHECK, not a
// guarantee — human review stays in-loop (council).
//
// Usage: node scripts/ingest/ground.mjs <id> [--committed] [--pdf <path>] [--model <id>]
//        [--concurrency N] [--domains a,b,c] [--out <dir>]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { extractPdfText, splitSections } from "./lib/extract.mjs";
import { retrieveForDomain } from "./synthesize.mjs";
import { groundDomain, scoreGrounding, domainClaims, frozenSchemaText } from "./lib/grounding.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const log = (...a) => process.stdout.write(a.join(" ") + "\n");

function parseArgs(argv) {
  const a = { concurrency: 4 };
  a.id = argv[2];
  for (let i = 3; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--committed") a.committed = true;
    else if (k === "--pdf") a.pdf = argv[++i];
    else if (k === "--model") a.model = argv[++i];
    else if (k === "--concurrency") a.concurrency = +argv[++i];
    else if (k === "--domains") a.domains = argv[++i].split(",");
    else if (k === "--full-doc") a.fullDoc = true;
    else if (k === "--out") a.out = argv[++i];
  }
  return a;
}

async function importModule(file) {
  return import(pathToFileURL(file).href);
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
  }));
  return out;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.id) { process.stderr.write("usage: ground.mjs <id> [--committed] [--pdf p] [--model m]\n"); process.exit(2); }

  const srcDir = args.committed
    ? path.join(REPO_ROOT, "products", args.id)
    : path.join(HERE, "scratch", args.id);
  const outDir = args.out || srcDir;

  const { PRODUCT } = await importModule(path.join(srcDir, "data.js"));
  const ENTITIES = (await importModule(path.join(srcDir, "entities.js"))).default;
  const config = (await importModule(path.join(REPO_ROOT, "products", args.id, "config.js"))).default;
  const productName = config?.name || args.id;

  // Doc text: prefer a dumped _doctext.txt in the scratch dir, else extract from the PDF.
  let fullText;
  const docTxt = path.join(HERE, "scratch", args.id, "_doctext.txt");
  if (fs.existsSync(docTxt)) fullText = fs.readFileSync(docTxt, "utf8");
  else {
    const pdf = args.pdf || path.join(HERE, "input", `${args.id}.pdf`);
    fullText = extractPdfText(pdf, { layout: true }).text;
  }
  const sections = splitSections(fullText);

  let domainIds = Object.keys(PRODUCT);
  if (args.domains) domainIds = domainIds.filter((d) => args.domains.includes(d));
  log(`[ground] ${args.id} — ${domainIds.length} domains, model ${args.model || "default"}, doc ${fullText.length} chars`);

  const line = (d) => log(`  ${d.blocksPromote ? "✗" : (d.overall === "STRONG" ? "✓" : "•")} ${d.id}: ${d.overall} (${d.grounded}/${d.claimsChecked}${d.contradicted ? `, ${d.contradicted} CONTRADICTED` : ""})`);

  // --full-doc = full recall (council #5): each domain is judged against the WHOLE doc, so a
  // contradiction whose supporting text lives outside the domain's retrieval chunk is still
  // caught (e.g. a wrong engine name). Done PER DOMAIN (not one giant all-domains call) so each
  // request stays within the gateway timeout even on very large docs — a single all-domains pass
  // over a ~957K-token doc (400+ claims) times out. Lower concurrency in full-doc mode: each call
  // ships the whole doc, so fewer in flight avoids gateway overload.
  const conc = args.fullDoc ? Math.min(args.concurrency, 2) : args.concurrency;
  const perDomain = await pool(domainIds, conc, async (id) => {
    const docChunk = args.fullDoc ? fullText : retrieveForDomain(sections, fullText, PRODUCT[id], ENTITIES[id]);
    const claims = domainClaims(PRODUCT[id], ENTITIES[id]);
    const schema = frozenSchemaText(ENTITIES[id]);
    try {
      const { findings, schemaDocMismatches } = await groundDomain({
        productName, domainName: PRODUCT[id].name, claims, docChunk, schema, model: args.model,
      });
      const d = { id, name: PRODUCT[id].name, ...scoreGrounding(findings), findings, schemaDocMismatches };
      line(d); return d;
    } catch (e) {
      log(`  ! ${id}: gate error ${String(e).split("\n")[0]}`);
      return { id, name: PRODUCT[id].name, error: String(e), findings: [], contradicted: 0, blocksPromote: false, claimsChecked: 0, grounded: 0, overall: "ERROR" };
    }
  });

  const allFindings = perDomain.flatMap((d) => d.findings || []);
  const agg = scoreGrounding(allFindings);
  const contradictions = perDomain.flatMap((d) => (d.findings || []).filter((f) => f.verdict === "CONTRADICTED").map((f) => ({ domain: d.id, ...f })));
  const mismatches = perDomain.flatMap((d) => (d.schemaDocMismatches || []).map((m) => `[${d.id}] ${m}`));
  const blocksPromote = perDomain.some((d) => d.blocksPromote);

  const report = [
    `# Grounding report — ${args.id} (${args.committed ? "committed" : "scratch"})`,
    ``,
    `- domains audited: **${domainIds.length}**`,
    `- claims checked: **${agg.claimsChecked}**  |  grounded: **${agg.grounded}**  |  unsupported: **${agg.unsupported}**  |  contradicted: **${agg.contradicted}**`,
    `- overall: **${agg.overall}**  |  blocks auto-promote: **${blocksPromote ? "YES" : "no"}**`,
    ``,
    `> Sample-based spot-check, not exhaustive — a clean run does NOT authorize auto-promotion (human review in-loop).`,
    ``,
    `## Contradictions (must fix before adopt)`,
    contradictions.length ? contradictions.map((c) => `- **[${c.domain}]** ${c.claim}\n  - ${c.evidence}`).join("\n") : "_none_",
    ``,
    `## Schema-vs-doc mismatches (pre-existing frozen data — item 5)`,
    mismatches.length ? mismatches.map((m) => `- ${m}`).join("\n") : "_none_",
    ``,
    `## Per-domain`,
    perDomain.map((d) => `- ${d.id}: ${d.overall} (${d.grounded}/${d.claimsChecked}${d.contradicted ? `, ${d.contradicted} contradicted` : ""})`).join("\n"),
    ``,
  ].join("\n");

  fs.writeFileSync(path.join(outDir, "grounding-report.md"), report);
  fs.writeFileSync(path.join(outDir, "grounding.json"), JSON.stringify({ id: args.id, aggregate: agg, blocksPromote, contradictions, schemaDocMismatches: mismatches, perDomain }, null, 2));

  log(`\n[ground] ${args.id}: ${agg.overall} — ${agg.grounded}/${agg.claimsChecked} grounded, ${agg.contradicted} contradicted. blocksPromote=${blocksPromote}`);
  log(`  report → ${path.relative(REPO_ROOT, path.join(outDir, "grounding-report.md"))}`);
  if (blocksPromote) process.exitCode = 1;
}

const invokedDirectly = typeof process.argv[1] === "string" && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main().catch((e) => { process.stderr.write(`[ground] FATAL: ${e.stack || e.message}\n`); process.exit(1); });
