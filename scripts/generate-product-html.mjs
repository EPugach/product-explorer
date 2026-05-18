#!/usr/bin/env node
// Generates <product-id>/index.html for all products from a shared template.
// Reads: products/manifest.js (stats), products/<id>/config.js (metadata), app/js/version.js (cache-bust)
// Usage: node scripts/generate-product-html.mjs

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SITE_BASE = "https://epugach.github.io/product-explorer";

const STAT_ID_MAP = {
  "Apex Classes": "statClasses",
  Triggers: "statTriggers",
  "Custom Objects": "statObjects",
  Objects: "statObjects",
  Domains: "statDomains",
  Components: "statComponents",
  Metadata: "statMetadata",
  Tours: "statTours",
};

async function main() {
  const { PRODUCTS } = await import(
    `file://${join(ROOT, "products/manifest.js")}`
  );
  const { JS_VERSION, CSS_VERSION } = await import(
    `file://${join(ROOT, "app/js/version.js")}`
  );

  for (const entry of PRODUCTS) {
    const cfgModule = await import(
      `file://${join(ROOT, `products/${entry.id}/config.js`)}`
    );
    const cfg = cfgModule.default;
    const gaId = cfg.analytics?.gaId || "G-HJTE1NYP82";

    const html = renderHtml(cfg, entry, JS_VERSION, CSS_VERSION, gaId);
    const outPath = join(ROOT, entry.id, "index.html");
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, "utf-8");
    console.log(`  ✓ ${entry.id}/index.html`);
  }

  console.log(
    `\nGenerated ${PRODUCTS.length} product pages (JS v${JS_VERSION}, CSS v${CSS_VERSION})`,
  );
}

function renderStats(stats) {
  return stats
    .map(([label, value]) => {
      const id = STAT_ID_MAP[label] || `stat${label.replace(/\s+/g, "")}`;
      return `      <div class="stat-item"><div class="stat-value" id="${id}">${value}</div><div class="stat-label">${label}</div></div>`;
    })
    .join("\n");
}

export function renderHtml(cfg, manifestEntry, jsVersion, cssVersion, gaId) {
  const { id, name, fullName } = cfg;
  const title = cfg.title || `${name} Explorer`;
  const version = cfg.version || "";
  const description = `Interactive galaxy-themed visualization of ${fullName}. Explore domains, components, and entities as an interconnected universe.`;
  const versionIndicator = version ? `${name} ${version}` : name;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_BASE}/${id}/">
<meta property="og:site_name" content="${title}">
<meta property="og:image" content="${SITE_BASE}/${id}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${SITE_BASE}/${id}/og-image.png">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="manifest" href="../manifest.json">
<meta name="theme-color" content="${cfg.color || "#4d8bff"}">
<!-- Google tag (gtag.js) -->
<link rel="preconnect" href="https://www.googletagmanager.com">
<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gaId}');
</script>
<link rel="stylesheet" href="../app/css/galaxy.css?v=${cssVersion}">
</head>
<body data-product="${id}">
<a href="#stage" class="skip-link">Skip to content</a>

<!-- Background layers: starfield (z0) > particles (z1) > 3D orbs (z2) > galaxy DOM (z3) -->
<canvas id="starfield" role="presentation" aria-hidden="true"></canvas>
<canvas id="particle-canvas" role="presentation" aria-hidden="true"></canvas>
<canvas id="galaxy-3d" role="presentation" aria-hidden="true"></canvas>

<!-- Galaxy DOM layer: planets + edges (z3) -->
<div class="galaxy-container" id="galaxyContainer"
     role="img" aria-label="Interactive galaxy map of ${name} domains">
  <svg class="galaxy-edges" id="galaxyEdges"></svg>
</div>

<noscript>
  <div style="padding:60px 40px;text-align:center;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#050510;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center">
    <h1 style="font-size:2rem;margin-bottom:16px;letter-spacing:2px">${title}</h1>
    <p style="font-size:1.1rem;color:#94a3b8;margin-bottom:12px">This interactive visualization requires JavaScript to run.</p>
    <p style="font-size:0.95rem;color:#64748b">Explore the domains, components, and entities of ${fullName}.</p>
  </div>
</noscript>

<!-- Navbar -->
<nav id="navbar" aria-label="Navigation">
  <div class="nav-brand" id="nav-brand" style="cursor:pointer" role="button" tabindex="0">${title.toUpperCase()}</div>
  <button id="tour-btn" class="tour-btn" aria-label="Tour">Tour <span class="tour-btn-icon nav-icon-svg" id="tour-icon"></span></button>
  <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme"><span class="nav-icon-svg" id="theme-icon"></span></button>
  <div id="zoom-indicator" aria-hidden="true">
    <span style="font-size:10px;margin-right:4px">ZOOM</span>
    <div class="zoom-dot active" data-z="1"></div>
    <div class="zoom-dot" data-z="2"></div>
    <div class="zoom-dot" data-z="3"></div>
    <div class="zoom-dot" data-z="4"></div>
  </div>
</nav>

<!-- Search scrim -->
<div class="search-scrim" id="searchScrim"></div>

<!-- Floating search dropdown (body-level for clean z-index) -->
<div class="search-drop" id="searchDrop">
  <div class="search-drop-inner">
    <div id="aiSection"></div>
    <div class="search-master-detail" id="searchMasterDetail">
      <div class="search-master" id="searchMaster" role="listbox"
           aria-label="Search results"></div>
      <div class="search-preview" id="searchPreview"></div>
    </div>
    <div class="search-hint">
      <span><kbd>&#8593;&#8595;</kbd> navigate</span>
      <span><kbd>Enter</kbd> open</span>
      <span><kbd>Esc</kbd> close</span>
      <span class="search-hint-ai">&#x2728; AI-powered</span>
    </div>
  </div>
</div>

<!-- Stage -->
<div id="stage">
  <!-- GALAXY VIEW (canvas-based, minimal DOM) -->
  <div id="galaxy-view" class="view-layer active">
    <div class="galaxy-title">
      <h1>${fullName.toUpperCase()}</h1>
      <div class="search-box" id="searchBox">
        <div class="search-shell" id="searchShell">
          <span class="s-icon nav-icon-svg" aria-hidden="true" id="search-icon"></span>
          <input type="text" id="searchInput"
                 placeholder="Search or ask a question about ${name}..."
                 autocomplete="off" spellcheck="false"
                 role="combobox"
                 aria-label="Search or ask a question about ${name}"
                 aria-expanded="false"
                 aria-autocomplete="list"
                 aria-haspopup="listbox"
                 aria-controls="searchMaster">
          <span class="s-ai-badge" aria-hidden="true">&#x2728; AI</span>
          <span class="s-kbd">/</span>
        </div>
      </div>
    </div>
    <div class="galaxy-stats">
${renderStats(manifestEntry.stats)}
    </div>
  </div>

  <!-- PLANET VIEW -->
  <div id="planet-view" class="view-layer">
    <div class="planet-content" id="planet-content"></div>
  </div>

  <!-- CORE VIEW -->
  <div id="core-view" class="view-layer">
    <div class="core-content" id="core-content"></div>
  </div>

  <!-- ENTITY VIEW (Level 4) -->
  <div id="entity-view" class="view-layer">
    <div class="entity-content" id="entity-content"></div>
  </div>

  <!-- SEARCH RESULTS VIEW (Level 5 - ephemeral, replaces AI answer view) -->
  <div id="search-results-view" class="view-layer">
    <div class="search-results-content" id="search-results-content"></div>
  </div>
</div>

<!-- Version indicator -->
<div id="version-indicator" aria-label="Data version">${versionIndicator}</div>

<!-- Feedback button -->
<button class="feedback-btn" id="feedbackBtn" aria-label="Send feedback"><span class="nav-icon-svg" id="feedback-icon"></span></button>

<!-- Help button -->
<button class="help-btn" id="helpBtn" aria-label="Keyboard shortcuts" aria-expanded="false" aria-controls="helpStack"><span class="nav-icon-svg" id="help-icon"></span></button>
<div class="help-stack" id="helpStack" role="dialog" aria-label="Keyboard shortcuts">
  <div class="help-row"><kbd>L</kbd><span>Theme</span></div>
  <div class="help-row"><kbd>/</kbd><kbd>&#8984;K</kbd><span>Search</span></div>
  <div class="help-row"><kbd>ESC</kbd><span>Back</span></div>
  <div class="help-row"><kbd>&larr;&rarr;</kbd><span>Tabs</span></div>
  <div class="help-row"><kbd class="help-tour-icon"></kbd><span>Tour Bus</span></div>
  <div class="help-row"><span class="drag-icon help-drag-icon"></span><span>Drag planets</span></div>
</div>

<!-- Feedback modal -->
<div class="feedback-scrim" id="feedbackScrim"></div>
<div class="feedback-modal" id="feedbackModal" role="dialog" aria-labelledby="feedback-title" aria-modal="true"></div>

<!-- Screen reader announcements -->
<div id="sr-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>

<!-- ES module entry point — loads shared engine which dynamically imports product data -->
<script type="module" src="../app/js/main.js?v=${jsVersion}"></script>
</body>
</html>
`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
