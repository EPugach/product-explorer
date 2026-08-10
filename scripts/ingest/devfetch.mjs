#!/usr/bin/env node
// scripts/ingest/devfetch.mjs
//
// CLI: fetch a product's Atlas Developer-Guide PDF (item 5, dev-doc fusion). Reads the product's
// `devSlug` from bundles.json and downloads the guide (plain HTTPS, no browser). With --stage,
// writes input/<id>-dev.pdf — the second synthesis source alongside the Help PDF.
//
// Usage: node scripts/ingest/devfetch.mjs <id> [--stage] [--release 262]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { fetchDevGuide } from "./lib/devfetch.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const log = (...a) => process.stdout.write(a.join(" ") + "\n");

function main() {
  const id = process.argv[2];
  const stage = process.argv.includes("--stage");
  const ri = process.argv.indexOf("--release");
  const release = ri > 0 ? process.argv[ri + 1] : "262";
  if (!id) { process.stderr.write("usage: devfetch.mjs <id> [--stage] [--release 262]\n"); process.exit(2); }

  const bundles = JSON.parse(fs.readFileSync(path.join(HERE, "bundles.json"), "utf8"));
  const entry = bundles.products?.[id];
  if (!entry) throw new Error(`no bundles.json entry for "${id}"`);
  if (!entry.devSlug) throw new Error(`no devSlug for "${id}" — resolve its Atlas dev-guide slug (developer.salesforce.com/docs) and add it to bundles.json`);

  const r = fetchDevGuide({ slug: entry.devSlug, release, log });
  log(`[devfetch] ${id}: dev guide ${entry.devSlug} (${r.pages} pages) from ${r.url}`);
  if (stage) {
    fs.writeFileSync(path.join(HERE, "input", `${id}-dev.pdf`), r.pdfBuffer);
    log(`[devfetch] staged -> scripts/ingest/input/${id}-dev.pdf`);
  } else {
    log(`[devfetch] (dry) not staged — pass --stage to write input/${id}-dev.pdf`);
  }
}

const invokedDirectly = typeof process.argv[1] === "string" && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) { try { main(); } catch (e) { process.stderr.write(`[devfetch] FATAL: ${e.message}\n`); process.exit(1); } }
