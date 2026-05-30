#!/usr/bin/env node
// Guard: every `icon:` value across all products/*/data.js must resolve to an
// inline <svg> via iconHtml() — never render as a raw emoji/string.
// Run: node scripts/check-icons.mjs   (exit 1 if any icon falls through)
import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { iconHtml } from "../app/js/icons.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS = join(ROOT, "products");

// Walk any object/array, collecting every value held under a key named "icon".
function collectIcons(node, out) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const v of node) collectIcons(v, out);
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k === "icon" && typeof v === "string" && v) out.add(v);
    else if (v && typeof v === "object") collectIcons(v, out);
  }
}

const icons = new Set();
for (const id of readdirSync(PRODUCTS, { withFileTypes: true })) {
  if (!id.isDirectory()) continue;
  const dataPath = join(PRODUCTS, id.name, "data.js");
  let mod;
  try {
    mod = await import(pathToFileURL(dataPath).href);
  } catch {
    continue; // no data.js in this folder
  }
  for (const exported of Object.values(mod)) collectIcons(exported, icons);
}

const unresolved = [];
for (const value of icons) {
  const html = iconHtml(value);
  if (!/^<svg/.test(html)) unresolved.push(value);
}

console.log(`Checked ${icons.size} distinct icon values across products.`);
if (unresolved.length) {
  console.log(`\n✗ ${unresolved.length} did NOT resolve to an <svg>:`);
  for (const v of unresolved) {
    const cp = [...v].map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase()).join(" ");
    console.log(`   ${JSON.stringify(v)}  (${cp})`);
  }
  process.exit(1);
}
console.log("✓ All icon values resolve to inline SVG.");
