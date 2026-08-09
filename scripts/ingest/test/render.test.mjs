// node --test scripts/ingest/test/render.test.mjs
//
// render.mjs must be LOSSLESS: parse committed -> render -> re-import yields a
// deep-equal object. Tested across every product (varied shapes: with/without
// metadata, 3-object to 154-object) so the serializer is trusted before it
// writes synthesized data.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadProduct } from "../lib/baseline.mjs";
import { renderDataJs, renderEntitiesJs } from "../lib/render.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRATCH = path.join(HERE, "..", "scratch");
fs.mkdirSync(SCRATCH, { recursive: true });

const IDS = [
  "npsp", "revenue", "omnistudio", "educationcloud", "nonprofitcloud",
  "edassh", "accountingsubledger", "consumergoods", "lifesciencescloud",
  "publicsectorsolutions",
];

async function importFresh(file, body) {
  fs.writeFileSync(file, body, "utf8");
  // Cache-bust with a query so repeated imports in one process re-read.
  return import(pathToFileURL(file).href + `?t=${body.length}`);
}

for (const id of IDS) {
  test(`render round-trip is lossless: ${id}`, async () => {
    const { PRODUCT, ENTITIES } = await loadProduct(id);

    const dataMod = await importFresh(
      path.join(SCRATCH, `_rt_${id}_data.mjs`),
      renderDataJs(PRODUCT),
    );
    assert.deepEqual(dataMod.PRODUCT, PRODUCT, `${id} data.js round-trip`);

    const entMod = await importFresh(
      path.join(SCRATCH, `_rt_${id}_entities.mjs`),
      renderEntitiesJs(ENTITIES),
    );
    assert.deepEqual(entMod.default, ENTITIES, `${id} entities.js round-trip`);
  });
}
