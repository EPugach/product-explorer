// scripts/ingest/lib/promote.mjs
//
// Atomic promotion of synthesized scratch output to products/<id>/ (Workstream B, item 4).
//
// Council (2026-08-09): per-product scratch->products rename is not cross-product atomic; a
// crash mid-loop leaves partial state. Two mitigations here:
//   1. Per-product atomicity — write each file to a temp path in the SAME dir, then rename
//      (atomic on one volume), so a product's {data,entities,ai-context}.js never appear
//      half-updated.
//   2. Two-phase batch — STAGE all eligible products' temps first; only if every stage
//      succeeds do we rename-commit them all (a short window). A batch journal records
//      planned/committed products so a crash is diagnosable; products/ is git-tracked, so
//      `git checkout -- products/<id>` is the real rollback (never run git from here).
//
// A product is only eligible if the caller says gates+grounding passed (okToPromote).

import fs from "node:fs";
import path from "node:path";

const FILES = ["data.js", "entities.js", "ai-context.js"];

// Stage one product's files as siblings temp copies; return the temp->final rename plan.
function stageProduct(repoRoot, id, scratchDir) {
  const destDir = path.join(repoRoot, "products", id);
  if (!fs.existsSync(destDir)) throw new Error(`no committed product dir for ${id}`);
  const plan = [];
  try {
    for (const f of FILES) {
      const src = path.join(scratchDir, f);
      if (!fs.existsSync(src)) throw new Error(`scratch missing ${id}/${f}`);
      const finalPath = path.join(destDir, f);
      const tmpPath = path.join(destDir, `.${f}.promote-tmp`);
      fs.copyFileSync(src, tmpPath);
      plan.push({ tmpPath, finalPath });
    }
  } catch (err) {
    // Clean this product's own partial temps before propagating (it may throw mid-loop).
    for (const { tmpPath } of plan) fs.rmSync(tmpPath, { force: true });
    throw err;
  }
  return plan;
}

// items: [{ id, scratchDir, okToPromote }]. journalPath optional.
// Returns { promoted:[id], skipped:[{id,reason}], failed:[{id,error}] }.
export function promoteBatch(repoRoot, items, { journalPath } = {}) {
  const eligible = items.filter((it) => it.okToPromote);
  const skipped = items.filter((it) => !it.okToPromote).map((it) => ({ id: it.id, reason: it.reason || "gate/grounding not passed" }));
  const journal = { startedAt: null, planned: eligible.map((e) => e.id), staged: [], committed: [], failed: [] };
  const writeJournal = () => { if (journalPath) fs.writeFileSync(journalPath, JSON.stringify(journal, null, 2) + "\n"); };

  // Phase 1 — stage every eligible product's temps. Abort the whole batch on any failure.
  const plans = [];
  try {
    for (const e of eligible) {
      plans.push({ id: e.id, plan: stageProduct(repoRoot, e.id, e.scratchDir) });
      journal.staged.push(e.id);
    }
  } catch (err) {
    for (const p of plans) for (const { tmpPath } of p.plan) fs.rmSync(tmpPath, { force: true }); // clean temps
    journal.failed.push({ phase: "stage", error: String(err) });
    writeJournal();
    return { promoted: [], skipped, failed: [{ id: "(batch)", error: String(err) }] };
  }

  // Phase 2 — commit all staged renames (short window). Record per product.
  const promoted = [], failed = [];
  for (const { id, plan } of plans) {
    try {
      for (const { tmpPath, finalPath } of plan) fs.renameSync(tmpPath, finalPath);
      promoted.push(id); journal.committed.push(id); writeJournal();
    } catch (err) {
      for (const { tmpPath } of plan) fs.rmSync(tmpPath, { force: true });
      failed.push({ id, error: String(err) }); journal.failed.push({ id, error: String(err) }); writeJournal();
    }
  }
  return { promoted, skipped, failed };
}

export { stageProduct as _stageProduct, FILES as PROMOTE_FILES };
