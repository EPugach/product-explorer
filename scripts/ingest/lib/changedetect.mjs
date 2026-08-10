// scripts/ingest/lib/changedetect.mjs
//
// Decide whether a freshly-fetched Help doc differs MEANINGFULLY from the archived
// one, so we re-synthesize only on real change (Workstream B, item 4).
//
// Signals (council-hardened, 2026-08-09):
//   - bundleId       — coarse key; the release version is IN the bundle id
//                      (e.g. "…-262-0-0-production"). A change is always meaningful.
//   - normalizedSha  — fine key over the doc TEXT after stripping VOLATILE boilerplate
//                      (the daily "Last Updated:YYYY.MM.DD" stamp, the copyright-year
//                      line, form feeds, bare page numbers, whitespace runs). This is
//                      what actually drives re-synthesis.
//   - rawSha256      — DIAGNOSTIC ONLY. Salesforce Help PDFs carry a per-day "Last
//                      Updated" timestamp, so the raw hash changes daily even when the
//                      content is identical — it must NEVER be a re-synthesis trigger.
//
// Trigger rule (explicit boolean, per council): changed = bundleIdChanged OR normalizedShaChanged.

import { createHash } from "node:crypto";

const sha256 = (s) => createHash("sha256").update(s).digest("hex");

// Strip volatile boilerplate that changes without the content changing.
export function normalizeDocText(text) {
  return String(text ?? "")
    .replace(/Last Updated:\s*\d{4}[.\-/]\d{2}[.\-/]\d{2}/gi, "") // daily stamp
    .replace(/©\s*Copyright[^\n]*/gi, "")                          // copyright-year line
    .replace(/\f/g, "\n")                                          // form feeds
    .replace(/^\s*\d+\s*$/gm, "")                                  // bare page numbers
    .replace(/[ \t]+/g, " ")                                       // collapse intra-line ws
    .replace(/\n{3,}/g, "\n\n")                                    // collapse blank runs
    .trim();
}

// Build the comparable fingerprint for a doc. `rawText` is the pdftotext output.
export function docFingerprint(rawText, bundleId) {
  const normalized = normalizeDocText(rawText);
  return {
    bundleId: bundleId ?? null,
    normalizedSha: sha256(normalized),
    rawSha256: sha256(String(rawText ?? "")), // diagnostic only
    normalizedLength: normalized.length,
  };
}

// prev/next are docFingerprint() outputs. prev === null means no prior archive.
export function detectChange(prev, next) {
  if (!prev) return { changed: true, reasons: ["no prior archive (first fetch)"] };
  const reasons = [];
  if (prev.bundleId !== next.bundleId)
    reasons.push(`bundle-id changed: ${prev.bundleId} -> ${next.bundleId}`);
  if (prev.normalizedSha !== next.normalizedSha)
    reasons.push(`normalized doc text changed (len ${prev.normalizedLength} -> ${next.normalizedLength})`);
  // rawSha256 divergence with identical normalizedSha == volatile-only change => NOT a trigger.
  return { changed: reasons.length > 0, reasons };
}
