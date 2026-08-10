#!/usr/bin/env node
// scripts/ingest/reground.mjs
//
// Grounding-gate-in-loop CORRECTOR (Workstream B, item 4). Reads an existing grounding.json
// (from `ground.mjs --full-doc`) and regenerates each CONTRADICTED domain with:
//   - the FULL doc as context (full recall — the correct fact the model missed is usually
//     outside the domain's retrieval chunk; that is the root cause of the contradiction), and
//   - the gate's own findings injected as corrective feedback (claim + evidence quotes the
//     correct term), via synthDomain({ feedback }).
// Then re-renders scratch. Re-run `ground.mjs <id> --full-doc` afterward to confirm.
//
// Usage: node scripts/ingest/reground.mjs <id> [--domains a,b] [--model <id>] [--max-tokens N]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { extractPdfText } from "./lib/extract.mjs";
import { synthDomain, mergeDomainData, mergeDomainEntities } from "./synthesize.mjs";
import { renderDataJs, renderEntitiesJs } from "./lib/render.mjs";
import { buildContext, buildFile } from "../generate-ai-context.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const log = (...a) => process.stdout.write(a.join(" ") + "\n");
const imp = (f) => import(pathToFileURL(f).href);

async function main() {
  const id = process.argv[2];
  const arg = (f) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : null; };
  if (!id) { process.stderr.write("usage: reground.mjs <id> [--domains a,b] [--model m]\n"); process.exit(2); }
  const model = arg("--model") || undefined;
  const maxTokens = +(arg("--max-tokens") || 24000);
  const onlyDomains = arg("--domains")?.split(",");

  const scratchDir = path.join(HERE, "scratch", id);
  const gpath = path.join(scratchDir, "grounding.json");
  if (!fs.existsSync(gpath)) throw new Error(`no grounding.json — run: node scripts/ingest/ground.mjs ${id} --full-doc`);
  const grounding = JSON.parse(fs.readFileSync(gpath, "utf8"));

  // Group contradictions by domain.
  const byDomain = {};
  for (const c of grounding.contradictions || []) (byDomain[c.domain] ||= []).push(c);
  let domains = Object.keys(byDomain);
  if (onlyDomains) domains = domains.filter((d) => onlyDomains.includes(d));
  if (!domains.length) { log(`[reground] ${id}: no contradicted domains to correct.`); return; }

  const { PRODUCT } = await imp(path.join(scratchDir, "data.js"));
  const ENTITIES = (await imp(path.join(scratchDir, "entities.js"))).default;
  const config = (await imp(path.join(REPO_ROOT, "products", id, "config.js"))).default;
  const productName = config?.name || id;
  const docTxt = path.join(scratchDir, "_doctext.txt");
  const fullText = fs.existsSync(docTxt) ? fs.readFileSync(docTxt, "utf8") : extractPdfText(path.join(HERE, "input", `${id}.pdf`), { layout: true }).text;
  const manifest = { productSummary: `${productName} — Salesforce product knowledge graph.`, glossary: [] };

  log(`[reground] ${id}: correcting ${domains.length} contradicted domain(s): ${domains.join(", ")}`);
  for (const d of domains) {
    const feedback = byDomain[d].map((c, i) => `${i + 1}. WRONG: ${c.claim}\n   CORRECT (from docs): ${c.evidence}`).join("\n");
    log(`[reground] ${d}: ${byDomain[d].length} contradiction(s) — regenerating with full doc + feedback…`);
    const { regen } = await synthDomain({
      domainId: d, domain: PRODUCT[d], ent: ENTITIES[d], docText: fullText, manifest, model, maxTokens, productName, feedback,
    });
    PRODUCT[d] = mergeDomainData(PRODUCT[d], regen);
    ENTITIES[d] = mergeDomainEntities(ENTITIES[d], regen);
  }

  // Re-render the whole product (corrected domains merged in).
  fs.writeFileSync(path.join(scratchDir, "data.js"), renderDataJs(PRODUCT));
  fs.writeFileSync(path.join(scratchDir, "entities.js"), renderEntitiesJs(ENTITIES));
  fs.writeFileSync(path.join(scratchDir, "ai-context.js"), buildFile(id, buildContext(config, PRODUCT, ENTITIES)));
  log(`[reground] ${id}: re-rendered scratch. VERIFY: node scripts/ingest/ground.mjs ${id} --full-doc`);
}

const invokedDirectly = typeof process.argv[1] === "string" && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main().catch((e) => { process.stderr.write(`[reground] FATAL: ${e.stack || e.message}\n`); process.exit(1); });
