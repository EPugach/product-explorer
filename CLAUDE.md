# Product Explorer

Static site, vanilla JS (ESM modules), no framework, no bundler.
Deploys from `main` to GitHub Pages auto on push.
Production: https://epugach.github.io/product-explorer/

## Build & Deploy

- `npm run build:html` — regenerates the 10 per-product `<id>/index.html`
  files from `scripts/generate-product-html.mjs`. Run after any change to
  the generator template OR after bumping `JS_VERSION` / `CSS_VERSION` in
  `app/js/version.js` (those are baked into each HTML's script tags).
- **Never hand-edit `npsp/index.html`** etc. — auto-generated artifacts.
- No local dev server. Test on deployed Pages URL after push (or by
  serving `code/` with any static file server).

## Cache Versioning (3 coordinated knobs)

When shipping JS or CSS changes, bump ALL THREE:

- `JS_VERSION` / `CSS_VERSION` in `app/js/version.js` (browser HTTP cache,
  surfaces as `?v=N` on script/link tags after `npm run build:html`)
- `SHELL_VERSION` in `sw.js` (the **only** knob that actually invalidates
  the SW shell cache — `cacheFirst` uses `ignoreSearch:true`, so `?v=N`
  queries don't evict cached JS/CSS files served by the SW)
- Re-run `npm run build:html`
- SW upgrade requires user to close all tabs + reopen (or DevTools →
  Application → Service Workers → Update). A single reload won't swap.

Adding a new file under `app/js/` or `app/css/` or `app/vendor/`?
Add it to `SHELL_URLS` in `sw.js`.

## .gitignore is allowlist-based

Top of `.gitignore` is `*` (ignore everything) followed by `!path` lines
for kept files. New files at root or in tracked dirs are auto-ignored
unless explicitly allowlisted.

## Galaxy Architecture (per-product pages only — not on root index.html)

Hybrid WebGL + DOM rendering. **Don't break the separation:**

- `#galaxy-3d` canvas (z:2): WebGL Three.js spheres, cosmetic only,
  `pointer-events: none`. Owned by `app/js/galaxy-3d.js`.
- `.galaxy-container` (z:3): transparent DOM `.planet-node` divs as hit
  zones. Owns input, accessibility, drag, pan, keyboard nav, labels,
  icons. Owned by `app/js/pointer-events.js` + `app/js/galaxy-renderer.js`.
- Both layers read positions from `nodeMap` in `app/js/physics.js`.

When adding visuals (bloom, materials, particles): WebGL layer.
When adding interaction (gestures, hover, click): DOM layer + pointer-events.js.
Never reimplement input on the WebGL canvas — would re-open accessibility
and pointer-event bugs already fixed in commit `1565252`.

Init failure fallback: `body.no-webgl` class triggers CSS that restores
flat radial-gradient planets. Preserve this path.

## Physics two-mode rule

`simulate({ collisionOnly })` in `app/js/physics.js` runs in two modes:

- **Layout** (default, used by `computeLayout()` once at startup): full
  force-directed model — long-range `+220` repulsion + edge springs +
  centering + group gravity. Produces the settled initial layout.
- **collisionOnly** (used by `nudgePhysics()` during drag): contact-only
  collision (`minDist = r1+r2+labelPad`, no long-range), NOT alpha-scaled,
  no homing forces. Drag-time interaction.

Don't mix them. Long-range repulsion at runtime causes cascade-spread
across the whole graph. Alpha-scaling collision causes stuck overlaps
(collision is a geometric constraint, not a relaxation force).

## Three.js vendoring (`app/vendor/`)

r158+ splits the build into entry + core. **Both required:**

- `three.0.NNN.min.js` — versioned entry (re-exports from core)
- `three.core.min.js` — actual implementation, exact filename (entry's
  relative import is hardcoded `./three.core.min.js`)

When upgrading: fetch both via
`curl https://unpkg.com/three@0.NNN.0/build/three.module.min.js -o app/vendor/three.0.NNN.min.js`
and `... three.core.min.js -o app/vendor/three.core.min.js`. Add both to
`SHELL_URLS`, bump SHELL_VERSION. Sanity-check:
`grep -oE 'from"[^"]+"' app/vendor/three.0.NNN.min.js` should show only
`./three.core.min.js`.

## Council debates

For non-trivial design decisions (architecture, physics tuning, multi-way
tradeoffs), invoke `/council:ask-council` and run a debate.mjs round.
Saved its bacon twice this session — caught alpha-scaled collision flaw
and recommended all-pairs-contact-only over source-only collision.
Cost: ~$1/debate. Worth it for anything > 50 lines of net change.
