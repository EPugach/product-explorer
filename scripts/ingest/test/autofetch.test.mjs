// node --test scripts/ingest/test/autofetch.test.mjs
//
// Tests for the item-4 change-detection + archive core. The council's sharpest catch:
// Salesforce Help PDFs carry a daily "Last Updated" stamp, so a raw hash would falsely
// trigger re-synthesis every day. The normalized fingerprint must ignore that.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { normalizeDocText, docFingerprint, detectChange } from "../lib/changedetect.mjs";
import { writeSnapshot, listSnapshots, latestSnapshot, snapshotDir } from "../lib/archive.mjs";

const DOC_A = `Omnistudio\n\n            Last Updated:2026.08.09\n© Copyright 2000-2026 salesforce.com\n\nFlexCards are declarative UI.\n`;
const DOC_A_NEXTDAY = `Omnistudio\n\n            Last Updated:2026.08.10\n© Copyright 2000-2027 salesforce.com\n\nFlexCards are declarative UI.\n`;
const DOC_B = `Omnistudio\n\n            Last Updated:2026.08.09\n© Copyright 2000-2026 salesforce.com\n\nFlexCards are declarative UI. NEW: Data Mappers added.\n`;

test("normalizeDocText strips the volatile Last Updated + copyright lines", () => {
  const n = normalizeDocText(DOC_A);
  assert.ok(!/Last Updated/i.test(n), "Last Updated stripped");
  assert.ok(!/Copyright/i.test(n), "copyright stripped");
  assert.ok(/FlexCards are declarative UI/.test(n), "real content kept");
});

test("volatile-only change (next day, same content) does NOT trigger re-synthesis", () => {
  const a = docFingerprint(DOC_A, "tdta-xcloud-omnistudio-262-0-0-production");
  const b = docFingerprint(DOC_A_NEXTDAY, "tdta-xcloud-omnistudio-262-0-0-production");
  assert.equal(a.normalizedSha, b.normalizedSha, "normalized hash identical across days");
  assert.notEqual(a.rawSha256, b.rawSha256, "raw hash differs (diagnostic only)");
  assert.equal(detectChange(a, b).changed, false, "no re-synthesis on volatile-only change");
});

test("real content change triggers re-synthesis", () => {
  const a = docFingerprint(DOC_A, "tdta-xcloud-omnistudio-262-0-0-production");
  const b = docFingerprint(DOC_B, "tdta-xcloud-omnistudio-262-0-0-production");
  const r = detectChange(a, b);
  assert.equal(r.changed, true);
  assert.match(r.reasons.join(" "), /normalized doc text changed/);
});

test("bundle-id (release) change triggers re-synthesis even if text identical", () => {
  const a = docFingerprint(DOC_A, "tdta-xcloud-omnistudio-262-0-0-production");
  const b = docFingerprint(DOC_A, "tdta-xcloud-omnistudio-264-0-0-production");
  const r = detectChange(a, b);
  assert.equal(r.changed, true);
  assert.match(r.reasons.join(" "), /bundle-id changed/);
});

test("no prior archive => changed (first fetch)", () => {
  assert.equal(detectChange(null, docFingerprint(DOC_A, "x")).changed, true);
});

test("archive: same-day same-content is idempotent; same-day different-content does not overwrite", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pe-arch-"));
  try {
    const bufA = Buffer.from("PDFBYTES-A");
    const bufB = Buffer.from("PDFBYTES-B");
    const common = { date: "2026-08-09", fetchedAt: "2026-08-09T10:00:00Z", rawText: DOC_A, normalizedSha: "n1", bundleId: "bid", sourceUrl: "u" };
    const r1 = writeSnapshot(root, "omnistudio", { ...common, pdfBuffer: bufA });
    const r2 = writeSnapshot(root, "omnistudio", { ...common, pdfBuffer: bufA }); // identical
    const r3 = writeSnapshot(root, "omnistudio", { ...common, pdfBuffer: bufB, rawText: DOC_B }); // diff same day
    assert.equal(r1.wrote, true, "first write");
    assert.equal(r2.wrote, false, "idempotent no-op on identical re-fetch");
    assert.equal(r1.dir, r2.dir, "identical content -> same dir");
    assert.notEqual(r1.dir, r3.dir, "different content same day -> different dir (no overwrite)");
    assert.equal(listSnapshots(root, "omnistudio").length, 2, "two distinct snapshots preserved");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("latestSnapshot returns the newest by date", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pe-arch-"));
  try {
    writeSnapshot(root, "p", { date: "2026-08-01", pdfBuffer: Buffer.from("old"), rawText: "x", bundleId: "b1" });
    writeSnapshot(root, "p", { date: "2026-08-09", pdfBuffer: Buffer.from("new"), rawText: "y", bundleId: "b2" });
    assert.equal(latestSnapshot(root, "p").bundleId, "b2");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
