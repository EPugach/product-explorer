// Build a self-contained beta copy of the site into <outDir> (default: ./beta).
// Usage: node scripts/build-beta.mjs <outDir>
//
// Published at https://epugach.github.io/product-explorer/beta/ alongside the
// live site. Everything in the app uses relative paths, so a copy works as-is;
// the transforms below only keep beta from interfering with production:
//   · beta/sw.js is a pass-through worker (no caching) scoped to /beta/, so the
//     live site's cache-first worker never serves stale beta files, and beta
//     never deletes the live site's caches. It also clears any /beta/ entries
//     the live worker cached before beta's worker took over.
//   · noindex on every page; Google Analytics removed (keeps live stats clean).
//   · a small "Beta" tag so it's always clear which version you're on.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { PRODUCTS } from "../products/manifest.js";

const root = resolve(import.meta.dirname, "..");
const out = resolve(process.argv[2] || join(root, "beta"));
if (out === root) throw new Error("Refusing to build beta into the repo root");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const f of ["index.html", "manifest.json", "icon-512.png"]) cpSync(join(root, f), join(out, f));
for (const d of ["app", "products"]) cpSync(join(root, d), join(out, d), { recursive: true });
for (const { id } of PRODUCTS) {
  mkdirSync(join(out, id), { recursive: true });
  for (const f of readdirSync(join(root, id))) cpSync(join(root, id, f), join(out, id, f));
}

writeFileSync(
  join(out, "sw.js"),
  `// Beta service worker: pass-through (no caching) so beta always shows the latest build.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Remove /beta/ entries the live site's worker may have cached earlier.
      // Only beta URLs are touched; the live site's own entries stay.
      for (const name of await caches.keys()) {
        const cache = await caches.open(name);
        for (const req of await cache.keys()) {
          if (new URL(req.url).pathname.includes("/beta/")) await cache.delete(req);
        }
      }
      await self.clients.claim();
    })(),
  );
});
`,
);

const TAG =
  `<a href="https://epugach.github.io/product-explorer/" title="Beta — go to the live site" ` +
  `style="position:fixed;left:12px;bottom:12px;z-index:99999;font:700 11px/1 system-ui,sans-serif;` +
  `letter-spacing:.08em;text-transform:uppercase;color:#03111f;background:#ffd166;` +
  `padding:6px 9px;border-radius:6px;text-decoration:none;box-shadow:0 2px 10px rgba(0,0,0,.35)">Beta</a>`;
const SW_REGISTER =
  `<script>if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(()=>{});</script>`;

const pages = [join(out, "index.html"), ...PRODUCTS.map(({ id }) => join(out, id, "index.html"))];
for (const file of pages) {
  if (!existsSync(file)) continue;
  let html = readFileSync(file, "utf8");
  html = html.replace(/<!-- Google tag \(gtag\.js\) -->[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/, "");
  html = html.replace(/<link rel="preconnect" href="https:\/\/www\.googletagmanager\.com">\s*/, "");
  html = html.replace("<head>", `<head>\n<meta name="robots" content="noindex, nofollow">`);
  // The landing page doesn't register a worker in production; beta's must, or the
  // live worker would control /beta/ and cache its files.
  const extra = file === join(out, "index.html") ? SW_REGISTER : "";
  html = html.replace("</body>", `${TAG}${extra}\n</body>`);
  writeFileSync(file, html);
}

const leftovers = pages.filter((f) => existsSync(f) && readFileSync(f, "utf8").includes("googletagmanager"));
if (leftovers.length) throw new Error(`Analytics not stripped from: ${leftovers.join(", ")}`);
console.log(`Beta built into ${out} (${pages.length} pages)`);
