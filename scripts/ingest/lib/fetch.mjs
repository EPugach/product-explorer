// scripts/ingest/lib/fetch.mjs
//
// Headless Help-PDF fetch (Workstream B, item 4). Reuses the EXISTING chromium that
// playwright-core@1.59.1 is version-matched to (revision 1217) — no browser download, no
// unsigned-binary execution, no corp-control workaround (council + handoff constraint).
//
// Council-hardened (2026-08-09/10):
//   - Chromium is DISCOVERED via playwright-core's version-matched executablePath, with a
//     glob fallback that ALERTS on version drift (never a silent hardcoded path).
//   - Anonymous SF-Help session (no SSO / no credentials) in a single context per run.
//   - The CURRENT full bundle-id is resolved live from the page href (release versions bump),
//     so change-detection compares real ids.
//   - Downloaded artifact is VALIDATED: expected host, %PDF magic bytes, min size, and a real
//     pdftotext parse — a fetch failure (SSO redirect / wrong artifact) throws loudly and is
//     never mistaken for "content unchanged".

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { chromium } from "playwright-core";
import { extractPdfText } from "./extract.mjs";

const OK_HOSTS = [/help\.salesforce\.com$/, /zoominsoftware\.io$/, /\.zoominsoftware\.io$/];

// Resolve the version-matched chromium; alert (in the returned `source`) on drift.
export function resolveChromium() {
  const expected = chromium.executablePath();
  if (expected && fs.existsSync(expected)) return { path: expected, source: `version-matched (${path.basename(path.dirname(path.dirname(expected)))})` };
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(os.homedir(), "AppData", "Local", "ms-playwright");
  const cands = fs.existsSync(base) ? fs.readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse() : [];
  for (const c of cands) {
    const p = path.join(base, c, "chrome-win64", "chrome.exe");
    if (fs.existsSync(p)) return { path: p, source: `DRIFT: using ${c}, expected ${path.basename(path.dirname(path.dirname(expected || "?")))}` };
  }
  throw new Error(`no chromium found (expected ${expected || "<none>"}; is playwright-core installed + the browser present?)`);
}

// Fetch one product's bundle PDF from its downloadPage by matching any of `stems`.
// Returns { pdfBuffer, bundleId, sourceUrl, finalUrl, suggestedFilename, pages }.
export async function fetchBundlePdf({ downloadPage, stems, log = () => {}, timeoutMs = 120000 }) {
  const chrome = resolveChromium();
  log(`[fetch] chromium ${chrome.source}`);
  if (chrome.source.startsWith("DRIFT")) log(`[fetch] WARN ${chrome.source}`);
  const browser = await chromium.launch({ headless: true, executablePath: chrome.path });
  try {
    const ctx = await browser.newContext({ acceptDownloads: true });
    const page = await ctx.newPage();
    await page.goto(downloadPage, { waitUntil: "domcontentloaded", timeout: 60000 });

    let sel = null, href = null;
    for (const stem of stems) {
      const s = `a[href*="${stem}"][href*="/pdf"]`;
      const loc = page.locator(s).first();
      await loc.waitFor({ state: "attached", timeout: 30000 }).catch(() => {});
      if (await loc.count()) { sel = s; href = await loc.getAttribute("href"); break; }
    }
    if (!href) throw new Error(`no "Download as PDF" link for stems [${stems.join(", ")}] on ${downloadPage}`);
    const bundleId = (href.match(/bundle\/([^/]+)\/pdf/) || [])[1] || null;

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: timeoutMs }),
      page.locator(sel).first().click(),
    ]);
    const finalUrl = download.url();
    const host = (() => { try { return new URL(finalUrl).host; } catch { return ""; } })();
    if (!OK_HOSTS.some((re) => re.test(host))) throw new Error(`download from unexpected host: ${host} (${finalUrl})`);

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pe-fetch-"));
    const tmp = path.join(tmpDir, `${bundleId || "download"}.pdf`);
    await download.saveAs(tmp);
    try {
      const buf = fs.readFileSync(tmp);
      const isPdf = buf.length > 1000 && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46;
      if (!isPdf) throw new Error(`artifact is not a PDF (${buf.length} bytes) from ${finalUrl}`);
      const { pageCount } = extractPdfText(tmp, { layout: true });
      if (!pageCount || pageCount < 1) throw new Error(`artifact did not parse as a PDF (0 pages)`);
      log(`[fetch] ${bundleId}: ${(buf.length / 1048576).toFixed(1)} MB, ${pageCount} pages, host ${host}`);
      return { pdfBuffer: buf, bundleId, sourceUrl: href, finalUrl, suggestedFilename: download.suggestedFilename(), pages: pageCount };
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  } finally {
    await browser.close();
  }
}
