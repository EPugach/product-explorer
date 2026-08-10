#!/usr/bin/env node
// scripts/ingest/fetch.mjs
//
// CLI: fetch a product's Help PDF headlessly (item 4). Reads the product->bundle map,
// fetches via the version-matched chromium, validates the artifact, and (with --stage)
// writes input/<id>.pdf and records the live bundle-id back into bundles.json.
//
// Usage: node scripts/ingest/fetch.mjs <id> [--stage]
//   (no --stage: fetch + validate + report only; nothing written)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { fetchBundlePdf } from "./lib/fetch.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const log = (...a) => process.stdout.write(a.join(" ") + "\n");

async function main() {
  const id = process.argv[2];
  const stage = process.argv.includes("--stage");
  if (!id) { process.stderr.write("usage: fetch.mjs <id> [--stage]\n"); process.exit(2); }

  const bundlesPath = path.join(HERE, "bundles.json");
  const bundles = JSON.parse(fs.readFileSync(bundlesPath, "utf8"));
  const entry = bundles.products?.[id];
  if (!entry) throw new Error(`no bundles.json entry for "${id}"`);
  const stems = entry.stems?.length ? entry.stems : (entry.primary ? [entry.primary] : []);
  if (!stems.length) throw new Error(`no bundle stems for "${id}" (resolve its bundle-id first)`);

  const r = await fetchBundlePdf({ downloadPage: entry.downloadPage, stems, log });
  log(`[fetch] ${id}: bundle=${r.bundleId} pages=${r.pages} (${(r.pdfBuffer.length / 1048576).toFixed(1)} MB) file=${r.suggestedFilename}`);

  if (stage) {
    fs.writeFileSync(path.join(HERE, "input", `${id}.pdf`), r.pdfBuffer);
    // record the live full bundle-id (release version may have bumped)
    if (r.bundleId && !(entry.lastKnownBundleIds || []).includes(r.bundleId)) {
      entry.lastKnownBundleIds = [r.bundleId, ...(entry.lastKnownBundleIds || [])].slice(0, 5);
      fs.writeFileSync(bundlesPath, JSON.stringify(bundles, null, 2) + "\n");
    }
    log(`[fetch] staged -> scripts/ingest/input/${id}.pdf; bundles.json updated`);
  } else {
    log(`[fetch] (dry) not staged — pass --stage to write input/${id}.pdf`);
  }
}

const invokedDirectly = typeof process.argv[1] === "string" && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main().catch((e) => { process.stderr.write(`[fetch] FATAL: ${e.stack || e.message}\n`); process.exit(1); });
