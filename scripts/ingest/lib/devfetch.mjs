// scripts/ingest/lib/devfetch.mjs
//
// Fetch an Atlas Developer-Guide PDF (Workstream B, item 5 — dev-doc fusion). Unlike the Help
// bundles (Zoomin, token-gated, needs a browser), Atlas dev guides are plain HTTPS GETs of a
// PDF at a predictable URL:
//   https://resources.docs.salesforce.com/<release>/latest/en-us/sfdc/pdf/<slug>.pdf
// so this uses `curl` (a system binary, like pdftotext — no npm dep, no browser). The download
// is validated (%PDF magic + a real pdftotext parse) so a 404/error page fails loudly.
//
// Why fusion: the grounding gate found the Help PDF lacks object field-level detail (e.g.
// FundAccount.FundType/IsActive) — that lives in the Dev Guide. Fusing Help ∪ Dev grounds the
// object descriptions that were otherwise unverifiable.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { extractPdfText } from "./extract.mjs";

// The release matches the Help bundle release tag (e.g. Help bundle "...-262-0-0-..." -> release "262").
export function devGuideUrl(slug, release = "262") {
  return `https://resources.docs.salesforce.com/${release}/latest/en-us/sfdc/pdf/${slug}.pdf`;
}

export function fetchDevGuide({ slug, release = "262", log = () => {} }) {
  if (!slug) throw new Error("devfetch: slug required");
  const url = devGuideUrl(slug, release);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pe-dev-"));
  const tmp = path.join(tmpDir, `${slug}.pdf`);
  try {
    // -k: the corp TLS proxy re-signs with a CA curl may not trust; content is validated below.
    // --fail: non-2xx (e.g. a 404 slug) errors instead of saving an error page.
    const r = spawnSync("curl", ["-sSL", "-k", "--fail", "-o", tmp, url], { encoding: "utf8" });
    if (r.status !== 0) throw new Error(`curl failed (status ${r.status}) for ${url}: ${(r.stderr || "").slice(0, 200)}`);
    const buf = fs.readFileSync(tmp);
    const isPdf = buf.length > 1000 && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46;
    if (!isPdf) throw new Error(`dev guide is not a PDF (${buf.length} bytes) from ${url}`);
    const { pageCount } = extractPdfText(tmp, { layout: true });
    if (!pageCount || pageCount < 1) throw new Error(`dev guide did not parse (0 pages) from ${url}`);
    log(`[devfetch] ${slug}: ${(buf.length / 1048576).toFixed(1)} MB, ${pageCount} pages`);
    return { pdfBuffer: buf, url, pages: pageCount };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}
