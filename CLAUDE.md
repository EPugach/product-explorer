# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Product Explorer: a multi-product platform for interactive galaxy-themed architecture visualizations of Salesforce products. Currently features NPSP (Nonprofit Success Pack). Deployed via GitHub Pages.

**Live URLs:**
- Landing page: https://epugach.github.io/product-explorer/
- NPSP Explorer: https://epugach.github.io/product-explorer/npsp/

**Repo:** git@github-epugach:EPugach/product-explorer.git (SSH as EPugach, gh CLI as akpuggy)

## Project Structure

```
product-explorer/
  index.html              Landing page (product picker)
  npsp/                   NPSP bootstrap (thin HTML, favicon, og-image)
    index.html            Loads shared engine with data-product="npsp"
  app/                    Shared rendering engine
    css/galaxy.css        Dark space theme, all layout and styling
    fonts/                Shared web fonts (Bricolage Grotesque)
    js/
      main.js             Orchestrator: reads data-product, dynamic imports
      navigation.js       View transitions, breadcrumbs, renderers
      search.js           Fuzzy search with overlay
      physics.js          Force-directed graph layout
      renderer.js         Canvas renderer (planets, connections, focus ring)
      starfield.js        Starfield background animation
      particles.js        Particle effects
      tours.js            Constellation Stories tour engine
      state.js            Shared mutable state (productId, lsPrefix, etc.)
      icons.js            SVG icon system (UI + entity icons shared, domain icons per-product)
      utils.js            Shared utilities (safeLSGet, safeLSSet, announce, track)
  products/               Per-product data
    npsp/
      config.js           Product metadata (name, colors, version, stats)
      data.js             Domains + components (export const PRODUCT = {...})
      entities.js         Entity details (lazy-loaded ~860KB)
      icons.js            Domain icon SVG paths (18 domains)
      tour-data.js        Guided tour definitions (9 tours)
      ai-context.js       AI search context (~32K tokens, sent to worker)
      feedback.js         Feedback modal with Google Sheets backend
  scripts/                Tooling (all gitignored)
    validate-product.mjs  Validates product data contract
    generate-ai-context.mjs  Generates ai-context.js from product data
```

Additional gitignored dirs: `env/`, `_workspace/`, `reference/`, `docs/plans/`

## Multi-Product Architecture

### How It Works

1. Each product has a thin `{productId}/index.html` with `<body data-product="{id}">`
2. It loads `../app/js/main.js` which reads `data-product` attribute
3. `main.js` dynamically imports from `../../products/{productId}/` (config, data, entities, icons, tours, feedback)
4. Data is injected into shared engine modules via setter functions (dependency injection pattern)

### Adding a New Product

1. Create `products/{id}/config.js`, `data.js`, `entities.js` following the data contract
2. Create `{id}/index.html` bootstrap (copy from npsp/index.html, change data-product and meta tags)
3. Add product card to root `index.html` PRODUCTS array
4. Update `.gitignore` to track the new product bootstrap
5. Validate: `node scripts/validate-product.mjs {id}`

### Data Contract

Every product must provide `config.js` and `data.js`. See `scripts/validate-product.mjs` for the full schema. Key exports:
- `config.js`: `export default { id, name, fullName, title, version, color, entityTypes, ... }`
- `data.js`: `export const PRODUCT = { [domainId]: { name, icon, color, description, components, dataFlow, connections } }`
- `entities.js` (optional): `export default { [domainId]: { classes?, objects?, triggers?, lwcs?, metadata? } }`
- `faq.js` (optional): `export const FAQ = [{ id, q, a, tags, domains }]`

### Dependency Injection Pattern

Shared engine modules use setter functions instead of direct imports:
- `physics.js`: `setProductData(data)`
- `navigation.js`: `setProductData(data)`, `setProductConfig(config)`, `rebuildPlanetMeta()`
- `search.js`: `setProductData(data, productName)`, `rebuildSearchIndex()`, `setFaqData(faq)`
- `tours.js`: `setTourData(tours)`, `setProductData(data)`
- `icons.js`: `setDomainPaths(paths)`
- `state.js`: `setProductId(id)` (sets productId and lsPrefix)

## Running Locally

```bash
python -m http.server 8000
# Landing page: http://localhost:8000/
# NPSP Explorer: http://localhost:8000/npsp/
```

No build step, no dependencies.

## Git Workflow

- SSH push works via `github-epugach` host alias
- `gh` CLI is authenticated as `akpuggy` (different account, can't manage Pages API)
- GitHub Pages: Settings > Pages > main branch, / root (EPugach account)

## Git Tracking

**Rule: Only track files needed to serve the GitHub Pages site.** Build scripts, Cloudflare Workers, tooling, and generated artifacts live in gitignored directories. The `.gitignore` uses an allowlist pattern (`*` then `!` negations).

**Tracked (allowlist):**
- `index.html` (root landing page)
- `app/` (shared rendering engine: CSS, JS, fonts)
- `products/` (per-product data: config, data, entities, icons, tours, feedback, ai-context)
- `npsp/index.html`, `npsp/favicon.svg`, `npsp/og-image.png` (product bootstrap)
- `.gitignore`, `README.md`, `CLAUDE.md`

**NOT tracked (lives on disk only):**
- `scripts/` (build tools, validators, data generators)
- `workers/` (Cloudflare Worker code, deployed separately)
- `docs/`, `_workspace/`, `reference/` (plans, session artifacts, external material)
- `npsp/fonts/` (duplicate; shared CSS resolves fonts from `app/fonts/` via relative path)
- Old `npsp/js/`, `npsp/css/` (pre-restructure copies, superseded by `app/js/` and `app/css/`)

**Gotcha: `.gitignore` doesn't untrack already-committed files.** If a file was committed before being gitignored, run `git rm --cached <file>` to stop tracking it. Always verify with `git ls-files` after restructures.

## Decisions Made

- **Multi-product architecture (2026-02-26).** Restructured from single-product NPSP to shared engine + per-product data. Preserves existing NPSP URLs.
- **No 3D rotation.** Was implemented but reverted. The 2D-to-3D transform didn't look like real 3D rendering.
- **Code Lab removed (2026-02-23).** Generic code snippets removed. Infrastructure (`labPatterns`, `switchTab`, `copyCode`) retained in `navigation.js`. To re-enable: add component-specific `codeLab` data to product data files.
- **Roadmap badges (2026-02-26).** Status badges on domain/component views showing lifecycle (Active Development, Beta, Stable, Maintenance, Deprecated). Data in `products/{id}/config.js` `roadmap` object. Summary bar in galaxy view.
- **Animated data flow scenarios (2026-02-26).** Playable particle animations tracing business processes across galaxy. Engine in `app/js/scenarios.js`, data in `products/{id}/scenario-data.js`. 3 NPSP scenarios: Follow a Donation, Recurring Revenue Engine, The TDTM Chain.
- **FAQ Q&A pairs (2026-02-27).** 200 curated Q&A pairs in `products/npsp/faq.js` with separate MiniSearch index. "Suggested Answers" cards appear above regular search results. Domain badge links navigate to domains.
- **Full Search Results Page (2026-02-28).** Pressing Enter in search opens a full-page results view with AI answer at top (for questions) and search result cards below. Replaces the old AI answer exploration view. Arrow+Enter in overlay still navigates to the highlighted result. Clicking results in overlay still navigates directly. Re-search supported on the page. Ephemeral (no hash route). ESC/back returns to previous view.
- **AI model upgrade (2026-02-28).** Switched from `llama-3.1-8b-instruct` to `llama-4-scout-17b-16e-instruct` (Llama 4 Scout 17B MoE). Better answer quality, ~1.6s latency. ~385 free queries/day. See "AI Model Management" section for all evaluated options.
- **Question logging to Google Sheets (2026-02-28).** Fire-and-forget `ctx.waitUntil()` POST to Apps Script. Logs question, hashed IP, cached status, answer preview. No PII.
- **AI answer feedback (2026-02-28).** Thumbs up/down buttons on AI answer cards (overlay + full results page). Thumbs down reveals reason chips + optional text. Feedback logged to same Google Sheet (Rating/Reason/Comment columns). Worker `/feedback` endpoint.

## AI Search Worker

Endpoint: `https://npsp-ai-search.epug.workers.dev`. Deploy: `CLOUDFLARE_API_TOKEN=<token> npx wrangler deploy` (from `workers/ai-search/`). Full reference: `docs/ai-search-worker.md`.

## Architecture Notes

### Navigation Model

```
Galaxy (all domains) -> Domain Detail (components grid) -> Component Detail (code, execution flows) -> Entity Detail
                                                                                                                     \-> Search Results (ephemeral, from Enter)
```

Hash routing: `#/`, `#/{domainId}`, `#/{domainId}/{componentId}`, `#/{domainId}/{componentId}/{entityType}/{entityName}`

### Entity Matching

Two-pass entity matching in `main.js` (`mergeEntities()`):
- Pass 1: Tag matching + LWC prefix matching
- Pass 2: Orphan triggers via class `referencedObjects`, orphan LWCs via `commonPrefix()`
- Remaining orphans go into synthetic `_infra` component per domain

### Known Issue: Browser/Proxy Cache

ES module imports are cached independently. Always bump `?v=N` params when changing files. Dynamic imports in `main.js` use cache-bust params for product data files.

**Critical: Never add `?v=N` to static `import from` statements.** Static imports across shared engine files must all use the same bare URL (e.g., `import { foo } from './icons.js'`). Adding `?v=N` to a static import creates a separate module instance, causing a split module bug where `setDomainPaths()` updates one instance while `getCanvasIcon()` reads from another (empty) one. This has broken icons twice. Cache-busting for static imports is handled by the `?v=N` on the entry `<script>` tag in the bootstrap HTML.
