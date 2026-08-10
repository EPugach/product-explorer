// node --test scripts/ingest/test/promote.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { promoteBatch, PROMOTE_FILES } from "../lib/promote.mjs";

function scaffold() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pe-promote-"));
  const scratchBase = fs.mkdtempSync(path.join(os.tmpdir(), "pe-scratch-"));
  for (const id of ["p1", "p2"]) {
    const pd = path.join(root, "products", id);
    fs.mkdirSync(pd, { recursive: true });
    for (const f of PROMOTE_FILES) fs.writeFileSync(path.join(pd, f), `OLD ${id} ${f}`);
    const sd = path.join(scratchBase, id);
    fs.mkdirSync(sd, { recursive: true });
    for (const f of PROMOTE_FILES) fs.writeFileSync(path.join(sd, f), `NEW ${id} ${f}`);
  }
  return { root, scratchBase };
}
const read = (root, id, f) => fs.readFileSync(path.join(root, "products", id, f), "utf8");
const tempsLeft = (root, id) => fs.readdirSync(path.join(root, "products", id)).filter((n) => n.includes(".promote-tmp"));

test("promoteBatch: eligible promoted, ineligible skipped, no temps left", () => {
  const { root, scratchBase } = scaffold();
  try {
    const journalPath = path.join(root, "journal.json");
    const r = promoteBatch(root, [
      { id: "p1", scratchDir: path.join(scratchBase, "p1"), okToPromote: true },
      { id: "p2", scratchDir: path.join(scratchBase, "p2"), okToPromote: false, reason: "contradiction" },
    ], { journalPath });
    assert.deepEqual(r.promoted, ["p1"]);
    assert.equal(r.skipped[0].id, "p2");
    assert.equal(read(root, "p1", "data.js"), "NEW p1 data.js", "p1 promoted");
    assert.equal(read(root, "p2", "data.js"), "OLD p2 data.js", "p2 untouched");
    assert.equal(tempsLeft(root, "p1").length, 0, "no temp files remain");
    assert.ok(fs.existsSync(journalPath), "journal written");
    assert.deepEqual(JSON.parse(fs.readFileSync(journalPath, "utf8")).committed, ["p1"]);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("promoteBatch: a missing scratch file aborts the whole batch atomically (no product changed, no temps)", () => {
  const { root, scratchBase } = scaffold();
  try {
    fs.rmSync(path.join(scratchBase, "p2", "entities.js")); // make p2 incomplete
    const r = promoteBatch(root, [
      { id: "p1", scratchDir: path.join(scratchBase, "p1"), okToPromote: true },
      { id: "p2", scratchDir: path.join(scratchBase, "p2"), okToPromote: true },
    ], {});
    assert.equal(r.promoted.length, 0, "batch aborted — nothing promoted");
    assert.equal(read(root, "p1", "data.js"), "OLD p1 data.js", "p1 NOT changed (staging aborted before commit)");
    assert.equal(tempsLeft(root, "p1").length, 0, "staged temps cleaned up");
    assert.equal(tempsLeft(root, "p2").length, 0);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
