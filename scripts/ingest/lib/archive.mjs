// scripts/ingest/lib/archive.mjs
//
// Versioned, dated archive of fetched Help docs (Workstream B, item 4). Never deletes.
//
// Path: archive/<id>/<YYYY-MM-DD>-<pdfSha8>/  — date + content hash.
//   Council fix (2026-08-09): a date-only path lets two same-day fetches overwrite each
//   other, violating "never delete old versions". Appending the content hash makes the
//   path unique per DISTINCT content per day; a same-content re-fetch resolves to the SAME
//   dir and is an idempotent no-op (never an overwrite of different bytes).
//
// Each snapshot dir holds: <id>.pdf + meta.json
//   { productId, bundleId, fetchedAt, pdfSha256, rawTextSha256, normalizedSha, sourceUrl }
//
// `date` and `fetchedAt` are injected by the caller (pure/testable); the CLI passes real time.

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const sha256hex = (buf) => createHash("sha256").update(buf).digest("hex");

export function snapshotDir(archiveRoot, productId, date, pdfSha256) {
  return path.join(archiveRoot, productId, `${date}-${pdfSha256.slice(0, 8)}`);
}

// Write a snapshot. Idempotent: identical content+date -> same dir, files only written if absent.
// Returns { dir, wrote, pdfSha256 }.
export function writeSnapshot(archiveRoot, productId, { date, fetchedAt, pdfBuffer, rawText, normalizedSha, bundleId, sourceUrl }) {
  const pdfSha256 = sha256hex(pdfBuffer);
  const dir = snapshotDir(archiveRoot, productId, date, pdfSha256);
  const already = fs.existsSync(path.join(dir, `${productId}.pdf`));
  if (!already) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${productId}.pdf`), pdfBuffer);
    const meta = {
      productId, bundleId: bundleId ?? null, fetchedAt: fetchedAt ?? date,
      pdfSha256, rawTextSha256: sha256hex(String(rawText ?? "")),
      normalizedSha: normalizedSha ?? null, sourceUrl: sourceUrl ?? null,
    };
    fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2) + "\n");
  }
  return { dir, wrote: !already, pdfSha256 };
}

// List snapshot meta.json for a product, newest first (dir names sort lexically by date).
export function listSnapshots(archiveRoot, productId) {
  const base = path.join(archiveRoot, productId);
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base)
    .filter((d) => fs.existsSync(path.join(base, d, "meta.json")))
    .sort().reverse()
    .map((d) => JSON.parse(fs.readFileSync(path.join(base, d, "meta.json"), "utf8")));
}

// The most recent snapshot's meta (for change-detection `prev`), or null.
export function latestSnapshot(archiveRoot, productId) {
  return listSnapshots(archiveRoot, productId)[0] ?? null;
}
