# Product Explorer — 10-Point Improvement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve code quality, testability, accessibility, and maintainability of the product-explorer codebase across 10 identified areas without breaking the zero-build, no-framework architecture.

**Architecture:** Vanilla JS ES modules, no build step, no bundler. Product data is loaded via dynamic imports. Each product lives in `products/<id>/` with config, data, entities, icons, tours, feedback, and ai-context modules. The shared rendering engine lives in `app/js/`. Products are served as static HTML pages from `<product-id>/index.html`. Tests will use a vendored lightweight test runner (no npm install required for end users).

**Tech Stack:** Vanilla JS (ES2022+), ES modules, CSS custom properties, HTML5, optional MiniSearch (vendored)

**Repo root:** `C:\SFProjects\20-projects\product-explorer\code`

---

## File Structure Overview

### New Files
- `app/js/version.js` — Single source of truth for cache-bust version
- `app/js/templates.js` — Tagged template literal helper + HTML builder utilities
- `app/js/pointer-events.js` — Unified pointer event handling (replaces mouse+touch in main.js)
- `app/vendor/minisearch.7.2.0.js` — Vendored MiniSearch ES module
- `products/manifest.js` — Shared product registry (stats, metadata, paths)
- `tests/runner.html` — Browser-based test harness (opens in browser, no Node required)
- `tests/test-utils.js` — Minimal assertion library
- `tests/merge-entities.test.js` — Tests for entity assignment heuristics
- `tests/search.test.js` — Tests for search indexing and fuzzy matching
- `tests/navigation-state.test.js` — Tests for navigation state machine

### Modified Files
- `app/js/main.js` — Remove dead code, extract pointer events, use version.js
- `app/js/navigation.js` — Extract templates, remove dead `labPatterns`/`switchTab`
- `app/js/search.js` — Import vendored MiniSearch, add AI timeout
- `app/css/galaxy.css` — Add focus-visible styles, colorblind-safe badge patterns
- `index.html` — Import product grid from manifest.js
- `<product-id>/index.html` (all 10) — Update CSS version ref to use new scheme

---

## Task 1: Extract VERSION Constant

**Files:**
- Create: `app/js/version.js`
- Modify: `app/js/main.js` (lines 66-113, all `?v=26` references)

- [ ] **Step 1: Create version module**

```js
// app/js/version.js
export const VERSION = 27;
export const v = `?v=${VERSION}`;
```

- [ ] **Step 2: Update main.js imports to use version module**

Replace the dynamic import section in `app/js/main.js` (lines 65-117). Find all occurrences of `?v=26` and replace with template literal using imported `v`:

```js
// At top of main.js, add import:
import { v } from './version.js';

// Then replace all dynamic imports, e.g.:
// BEFORE:
//   import(`${productsBase}/config.js?v=26`)
// AFTER:
//   import(`${productsBase}/config.js${v}`)
```

There are exactly 7 occurrences of `?v=26` in main.js:
1. `config.js?v=26` (line 67)
2. `data.js?v=26` (line 68)
3. `icons.js?v=26` (line 89)
4. `tour-data.js?v=26` (line 97)
5. `feedback.js?v=26` (line 102)
6. `ai-context.js?v=26` (line 108)
7. `entities.js?v=26` (line 895)

- [ ] **Step 3: Update CSS version references in product HTML files**

Each `<product-id>/index.html` has `<link rel="stylesheet" href="../app/css/galaxy.css?v=27">`. Leave these as-is for now (CSS doesn't use ES imports). Document in version.js:

```js
// app/js/version.js
// JS module cache-bust version. Increment on any change to app/js/ or products/ JS.
// CSS version is managed separately in each product's index.html <link> tag.
export const VERSION = 27;
export const v = `?v=${VERSION}`;
```

- [ ] **Step 4: Verify the app still loads**

Open `npsp/index.html` in a browser. Confirm the galaxy renders and entities load (check console for `[npsp] Entity mapping:` log).

- [ ] **Step 5: Commit**

```bash
git add app/js/version.js app/js/main.js
git commit -m "refactor: extract VERSION constant from hardcoded ?v=26 cache busters"
```

---

## Task 2: Remove Dead Code

**Files:**
- Modify: `app/js/navigation.js` (remove lines ~996-1009)

- [ ] **Step 1: Verify dead code is unreferenced**

Search the codebase for `labPatterns` and `switchTab`:

```bash
grep -rn "labPatterns\|switchTab" app/js/ products/
```

Expected: only hits in `navigation.js` itself (definition + internal reference). No external callers.

- [ ] **Step 2: Remove `labPatterns` object and `switchTab` function**

Delete from `navigation.js` the following (approximately lines 996-1009):

```js
// DELETE THIS ENTIRE BLOCK:
const labPatterns = { ... };

function switchTab(tab, type) { ... }
```

The `labPatterns` object is ~50 lines of hardcoded Apex code strings. The `switchTab` function is ~6 lines. Both are dead — the "Code Lab section removed" comment at line 761 confirms this.

- [ ] **Step 3: Verify no runtime errors**

Open `npsp/index.html`, navigate to a component (e.g., Donations > Opportunity Management), switch between tabs. Confirm no console errors.

- [ ] **Step 4: Commit**

```bash
git add app/js/navigation.js
git commit -m "chore: remove dead labPatterns and switchTab code"
```

---

## Task 3: Vendor MiniSearch

**Files:**
- Create: `app/vendor/minisearch.7.2.0.js`
- Modify: `app/js/search.js` (lines 17-27)

- [ ] **Step 1: Download MiniSearch ES module**

```bash
curl -o app/vendor/minisearch.7.2.0.js "https://cdn.jsdelivr.net/npm/minisearch@7.2.0/dist/es/index.min.js"
```

- [ ] **Step 2: Update search.js to import from vendor with CDN fallback**

Replace lines 17-27 in `app/js/search.js`:

```js
// BEFORE:
async function ensureMiniSearch() {
  if (_miniSearchLoaded) return;
  _miniSearchLoaded = true;
  try {
    const mod = await import('https://cdn.jsdelivr.net/npm/minisearch@7.2.0/dist/es/index.min.js');
    MiniSearch = mod.default;
  } catch {
    console.warn('[search] MiniSearch CDN unavailable, using fallback substring search');
    _useFallback = true;
  }
}

// AFTER:
async function ensureMiniSearch() {
  if (_miniSearchLoaded) return;
  _miniSearchLoaded = true;
  try {
    // Prefer local vendored copy (no network dependency, matches "no dependencies" philosophy)
    const mod = await import('../vendor/minisearch.7.2.0.js');
    MiniSearch = mod.default;
  } catch {
    // Fallback: try CDN if vendored file is missing (e.g., dev without vendor/)
    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/minisearch@7.2.0/dist/es/index.min.js');
      MiniSearch = mod.default;
    } catch {
      console.warn('[search] MiniSearch unavailable, using fallback substring search');
      _useFallback = true;
    }
  }
}
```

- [ ] **Step 3: Verify search works**

Open `npsp/index.html`, press `/`, type "recurring donation". Confirm results appear with fuzzy matching (not just substring).

- [ ] **Step 4: Commit**

```bash
git add app/vendor/minisearch.7.2.0.js app/js/search.js
git commit -m "feat: vendor MiniSearch locally, CDN as fallback"
```

---

## Task 4: Add AI Search Error Boundary / Timeout

**Files:**
- Modify: `app/js/search.js` (the `askAi` function)

- [ ] **Step 1: Locate the askAi function**

Search for `export async function askAi` or `export function askAi` in search.js. It makes a fetch to `_aiEndpoint`.

- [ ] **Step 2: Add timeout wrapper with user-facing error state**

Wrap the fetch call with an AbortController timeout:

```js
export async function askAi(query) {
  if (!_aiEndpoint) return { error: 'AI search not configured for this product.' };

  const cacheKey = query.trim().toLowerCase();
  if (_aiSessionCache.has(cacheKey)) return { answer: _aiSessionCache.get(cacheKey) };

  // Dedup inflight requests
  if (_aiInflight.has(cacheKey)) return _aiInflight.get(cacheKey);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  const promise = (async () => {
    try {
      const res = await fetch(_aiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query, context: _aiContext }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!res.ok) {
        return { error: 'AI service temporarily unavailable. Try again later.' };
      }

      const data = await res.json();
      const answer = data.answer || data.response || '';
      if (answer) {
        _aiSessionCache.set(cacheKey, answer);
        if (_aiSessionCache.size > AI_CACHE_MAX) {
          const first = _aiSessionCache.keys().next().value;
          _aiSessionCache.delete(first);
        }
      }
      return answer ? { answer } : { error: 'No answer available for this question.' };
    } catch (e) {
      clearTimeout(timeout);
      if (e.name === 'AbortError') {
        return { error: 'AI search timed out. Try a simpler question.' };
      }
      return { error: 'AI search unavailable. Results shown below.' };
    } finally {
      _aiInflight.delete(cacheKey);
    }
  })();

  _aiInflight.set(cacheKey, promise);
  return promise;
}
```

- [ ] **Step 3: Verify timeout behavior**

Open DevTools Network tab, set throttling to "Offline", trigger an AI search. Confirm the skeleton is replaced with a user-friendly error message after ~15s (or immediately if offline).

- [ ] **Step 4: Commit**

```bash
git add app/js/search.js
git commit -m "feat: add 15s timeout and error boundary to AI search"
```

---

## Task 5: Accessibility Improvements

**Files:**
- Modify: `app/css/galaxy.css`
- Modify: `app/js/galaxy-renderer.js` (focus-visible on planets)

- [ ] **Step 1: Add focus-visible styles for planet nodes**

Append to `app/css/galaxy.css`:

```css
/* ── Accessibility: keyboard focus indicators ── */
.planet-node:focus-visible {
  outline: 2px solid var(--glow-primary, #4d8bff);
  outline-offset: 4px;
  border-radius: 50%;
}

.component-card:focus-visible,
.entity-card:focus-visible,
.connection-item:focus-visible,
[data-sr-idx]:focus-visible {
  outline: 2px solid var(--glow-primary, #4d8bff);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Add pattern differentiation to entity badges for colorblind users**

Append to `app/css/galaxy.css`:

```css
/* ── Colorblind-safe entity badges: add shape/pattern indicators ── */
.entity-badge.badge-class::before { content: "C"; }
.entity-badge.badge-object::before { content: "O"; }
.entity-badge.badge-trigger::before { content: "T"; }
.entity-badge.badge-lwc::before { content: "L"; }
.entity-badge.badge-metadata::before { content: "M"; }

.entity-badge::before {
  display: inline-block;
  width: 14px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  font-size: 9px;
  font-weight: 700;
  border-radius: 3px;
  margin-right: 3px;
  background: currentColor;
  color: var(--bg-primary, #0a0a1a);
}
```

- [ ] **Step 3: Ensure planet nodes have tabindex in galaxy-renderer.js**

Check `app/js/galaxy-renderer.js` `initGalaxyDOM` function. Each planet div should already have `tabindex="0"`. Verify:

```js
// In initGalaxyDOM, the planet creation loop should include:
planetDiv.setAttribute('tabindex', '0');
planetDiv.setAttribute('role', 'button');
planetDiv.setAttribute('aria-label', `${node.label}: ${node.desc.substring(0, 60)}`);
```

If `aria-label` is missing, add it.

- [ ] **Step 4: Test keyboard navigation**

Open `npsp/index.html`, press Tab until focus reaches the galaxy container, then use arrow keys. Confirm:
- Focus ring is visible around each planet
- Screen reader announces planet name and description
- Entity badges are distinguishable without color alone

- [ ] **Step 5: Commit**

```bash
git add app/css/galaxy.css app/js/galaxy-renderer.js
git commit -m "a11y: add focus-visible indicators and colorblind-safe badge labels"
```

---

## Task 6: Refactor Pointer Events

**Files:**
- Create: `app/js/pointer-events.js`
- Modify: `app/js/main.js` (remove `setupGalaxyEvents`, import new module)

- [ ] **Step 1: Create pointer-events.js with unified input handling**

This replaces the ~300-line `setupGalaxyEvents()` function in main.js. The Pointer Events API unifies mouse, touch, and pen into one code path.

```js
// app/js/pointer-events.js
import { nodeMap, zoom, panX, panY, setZoom, setPanX, setPanY } from './physics.js';
import { updateGalaxyTransform, updatePlanetPosition, applyHoverState, clearHoverState, getSortedPlanetEls, getPlanetEl, hideEdgeTooltip } from './galaxy-renderer.js';
import { tourState } from './state.js';
import { track } from './utils.js';

export function setupPointerEvents({ enterPlanet, showTooltip, hideTooltip, setParticleHover }) {
  const container = document.getElementById('galaxyContainer');
  if (!container) return;

  let dragNode = null;
  let isDragging = false;
  let isPanning = false;
  let startPos = { x: 0, y: 0 };
  let lastPos = { x: 0, y: 0 };
  let hoveredId = null;
  let activePointerId = null;

  // ── Hover (pointer-specific, not captured) ──
  container.addEventListener('pointerover', (e) => {
    const planet = e.target.closest('.planet-node');
    if (!planet || dragNode || isPanning) return;
    const id = planet.dataset.domain;
    if (id === hoveredId) return;
    hoveredId = id;
    const node = nodeMap[id];
    if (node) {
      hideEdgeTooltip();
      showTooltip(node, e.clientX, e.clientY);
      applyHoverState(id);
      setParticleHover(node);
    }
  });

  container.addEventListener('pointerout', (e) => {
    const planet = e.target.closest('.planet-node');
    if (!planet) return;
    const related = e.relatedTarget;
    if (related && planet.contains(related)) return;
    hoveredId = null;
    hideTooltip();
    clearHoverState();
    setParticleHover(null);
  });

  container.addEventListener('pointermove', (e) => {
    if (hoveredId && !dragNode && !isPanning) {
      const node = nodeMap[hoveredId];
      if (node) showTooltip(node, e.clientX, e.clientY);
    }
  });

  // ── Down: start drag or pan ──
  container.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (activePointerId !== null) return; // single-pointer only for drag/pan

    activePointerId = e.pointerId;
    container.setPointerCapture(e.pointerId);

    const planet = e.target.closest('.planet-node');
    startPos = { x: e.clientX, y: e.clientY };
    lastPos = { x: e.clientX, y: e.clientY };
    isDragging = false;

    if (planet) {
      const id = planet.dataset.domain;
      dragNode = nodeMap[id] || null;
      if (dragNode) {
        dragNode.fx = dragNode.x;
        dragNode.fy = dragNode.y;
        planet.style.willChange = 'left, top';
        container.classList.add('dragging');
      }
    } else {
      isPanning = true;
      container.classList.add('dragging');
    }
  });

  // ── Move: drag planet or pan ──
  container.addEventListener('pointermove', (e) => {
    if (e.pointerId !== activePointerId) return;
    if (!dragNode && !isPanning) return;

    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    const totalDx = e.clientX - startPos.x;
    const totalDy = e.clientY - startPos.y;

    if (dragNode) {
      if (Math.abs(totalDx) + Math.abs(totalDy) > 5) isDragging = true;
      dragNode.x += dx / zoom;
      dragNode.y += dy / zoom;
      dragNode.fx = dragNode.x;
      dragNode.fy = dragNode.y;
      updatePlanetPosition(dragNode);
      hideTooltip();
    } else if (isPanning) {
      setPanX(panX + dx);
      setPanY(panY + dy);
      updateGalaxyTransform();
      hideTooltip();
    }
    lastPos = { x: e.clientX, y: e.clientY };
  });

  // ── Up: end drag/pan, detect tap ──
  container.addEventListener('pointerup', (e) => {
    if (e.pointerId !== activePointerId) return;
    container.releasePointerCapture(e.pointerId);
    activePointerId = null;
    container.classList.remove('dragging');

    if (dragNode) {
      const div = getPlanetEl(dragNode.id);
      if (div) div.style.willChange = '';

      if (!isDragging) {
        const id = dragNode.id;
        dragNode.fx = null; dragNode.fy = null;
        dragNode = null; isPanning = false;
        hideTooltip();
        if (!tourState.active) {
          enterPlanet(id);
          track('planet_click', { planet: id });
        }
        return;
      }
      track('planet_drag', { planet: dragNode.id });
      dragNode.fx = null; dragNode.fy = null;
    }

    dragNode = null;
    isPanning = false;
  });

  // ── Pointer cancel (system took over) ──
  container.addEventListener('pointercancel', (e) => {
    if (e.pointerId !== activePointerId) return;
    activePointerId = null;
    container.classList.remove('dragging');
    if (dragNode) {
      const div = getPlanetEl(dragNode.id);
      if (div) div.style.willChange = '';
      dragNode.fx = null; dragNode.fy = null;
    }
    dragNode = null; isPanning = false;
  });

  // ── Leave container ──
  container.addEventListener('pointerleave', (e) => {
    if (hoveredId && !dragNode) {
      hoveredId = null;
      hideTooltip();
      clearHoverState();
      setParticleHover(null);
    }
  });

  // ── Wheel zoom (unchanged from mouse-only) ──
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const oldZoom = zoom;
    let newZoom = zoom * (e.deltaY < 0 ? 1.1 : 0.9);
    newZoom = Math.max(0.3, Math.min(3, newZoom));
    setZoom(newZoom);
    setPanX(e.clientX - (e.clientX - panX) * (newZoom / oldZoom));
    setPanY(e.clientY - (e.clientY - panY) * (newZoom / oldZoom));
    updateGalaxyTransform();
  }, { passive: false });

  // ── Pinch-to-zoom (two-finger gesture via touch events — pointer events
  //    don't easily support multi-touch zoom, so we keep this as a supplement) ──
  let lastTouchDist = 0;
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist = Math.sqrt(dx * dx + dy * dy);
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastTouchDist > 0) {
        const scale = dist / lastTouchDist;
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const oldZoom = zoom;
        let newZoom = Math.max(0.3, Math.min(3, zoom * scale));
        setZoom(newZoom);
        setPanX(cx - (cx - panX) * (newZoom / oldZoom));
        setPanY(cy - (cy - panY) * (newZoom / oldZoom));
        updateGalaxyTransform();
      }
      lastTouchDist = dist;
      e.preventDefault();
    }
  }, { passive: false });

  container.addEventListener('touchend', () => { lastTouchDist = 0; });
}
```

- [ ] **Step 2: Update main.js to use new module**

Remove the entire `setupGalaxyEvents()` function from main.js (~lines 396-675). Replace with:

```js
import { setupPointerEvents } from './pointer-events.js';

// In init(), replace setupGalaxyEvents() call with:
setupPointerEvents({ enterPlanet, showTooltip, hideTooltip, setParticleHover: setParticleHover });
```

Also remove the now-unused `window.addEventListener('mousemove', ...)` and `window.addEventListener('mouseup', ...)` listeners that were attached globally.

- [ ] **Step 3: Add touch-action CSS to prevent browser gestures conflicting**

Add to `app/css/galaxy.css`:

```css
.galaxy-container {
  touch-action: none; /* Let pointer events handle all gestures */
}
```

- [ ] **Step 4: Test on desktop and mobile**

- Desktop: drag planets, pan empty space, scroll-zoom, click to enter
- Mobile (or DevTools device emulation): tap to enter, drag planets, pinch-zoom, pan

- [ ] **Step 5: Commit**

```bash
git add app/js/pointer-events.js app/js/main.js app/css/galaxy.css
git commit -m "refactor: replace mouse+touch handlers with Pointer Events API"
```

---

## Task 7: Create Product Manifest

**Files:**
- Create: `products/manifest.js`
- Modify: `index.html` (replace hardcoded PRODUCTS array)

- [ ] **Step 1: Create products/manifest.js**

Extract the product metadata currently hardcoded in `index.html` (the PRODUCTS array at line 475) into a shared module:

```js
// products/manifest.js
// Single source of truth for product metadata.
// Consumed by: index.html (landing page grid), product configs, scripts.
export const PRODUCTS = [
  {
    id: 'npsp',
    name: 'NPSP',
    fullName: 'Nonprofit Success Pack',
    stats: [
      ['Apex Classes', 534],
      ['Triggers', 26],
      ['Custom Objects', 64],
      ['Domains', 18],
      ['Components', 65],
      ['Tours', 9]
    ]
  },
  {
    id: 'revenue',
    name: 'Revenue Cloud',
    fullName: 'Salesforce Revenue Cloud',
    stats: [
      ['Objects', 54],
      ['Domains', 14],
      ['Components', 70],
      ['Tours', 5]
    ]
  },
  {
    id: 'omnistudio',
    name: 'OmniStudio',
    fullName: 'Salesforce OmniStudio',
    stats: [
      ['Objects', 12],
      ['Domains', 12],
      ['Components', 51],
      ['Tours', 4]
    ]
  },
  {
    id: 'educationcloud',
    name: 'Education Cloud',
    fullName: 'Salesforce Education Cloud',
    stats: [
      ['Objects', 54],
      ['Metadata', 6],
      ['Domains', 14],
      ['Components', 68],
      ['Tours', 4]
    ]
  },
  {
    id: 'nonprofitcloud',
    name: 'Nonprofit Cloud',
    fullName: 'Salesforce Nonprofit Cloud',
    stats: [
      ['Objects', 73],
      ['Metadata', 4],
      ['Domains', 20],
      ['Components', 78],
      ['Tours', 5]
    ]
  },
  {
    id: 'edassh',
    name: 'EDA & SSH',
    fullName: 'Salesforce EDA & Student Success Hub',
    stats: [
      ['Objects', 45],
      ['Metadata', 4],
      ['Domains', 15],
      ['Components', 63],
      ['Tours', 5]
    ]
  },
  {
    id: 'accountingsubledger',
    name: 'Accounting Subledger',
    fullName: 'Salesforce Accounting Subledger',
    stats: [
      ['Objects', 6],
      ['Metadata', 9],
      ['Domains', 9],
      ['Components', 35],
      ['Tours', 4]
    ]
  },
  {
    id: 'consumergoods',
    name: 'Consumer Goods Cloud',
    fullName: 'Salesforce Consumer Goods Cloud',
    stats: [
      ['Objects', 154],
      ['Metadata', 1],
      ['Domains', 16],
      ['Components', 87],
      ['Tours', 5]
    ]
  },
  {
    id: 'lifesciencescloud',
    name: 'Life Sciences Cloud',
    fullName: 'Salesforce Life Sciences Cloud',
    stats: [
      ['Objects', 104],
      ['Metadata', 13],
      ['Domains', 15],
      ['Components', 95],
      ['Tours', 4]
    ]
  },
  {
    id: 'publicsectorsolutions',
    name: 'Public Sector Solutions',
    fullName: 'Salesforce Public Sector Solutions',
    stats: [
      ['Objects', 138],
      ['Domains', 18],
      ['Components', 92],
      ['Tours', 4]
    ]
  }
];
```

- [ ] **Step 2: Update index.html to import from manifest**

Replace the inline `<script>` block (lines 474-638) in `index.html` with:

```html
<script type="module">
  import { PRODUCTS } from './products/manifest.js';

  const grid = document.getElementById('productGrid');
  for (const p of PRODUCTS) {
    const card = document.createElement('a');
    card.href = p.id + '/';
    card.className = 'product-card';

    const info = document.createElement('div');
    info.className = 'product-info';

    const name = document.createElement('div');
    name.className = 'product-name';
    name.textContent = p.name;

    const full = document.createElement('div');
    full.className = 'product-fullname';
    full.textContent = p.fullName;

    const stats = document.createElement('div');
    stats.className = 'product-stats';

    for (const [label, value] of p.stats) {
      const span = document.createElement('span');
      span.className = 'product-stat';
      const strong = document.createElement('strong');
      strong.textContent = value;
      span.appendChild(strong);
      span.appendChild(document.createTextNode(' ' + label));
      stats.appendChild(span);
    }

    info.appendChild(name);
    info.appendChild(full);
    info.appendChild(stats);

    const cta = document.createElement('span');
    cta.className = 'product-cta';
    cta.textContent = 'Launch Explorer →';

    card.appendChild(info);
    card.appendChild(cta);
    grid.appendChild(card);
  }
</script>
```

- [ ] **Step 3: Verify landing page renders**

Open `index.html` in browser. Confirm all 10 product cards appear with correct stats and links.

- [ ] **Step 4: Commit**

```bash
git add products/manifest.js index.html
git commit -m "refactor: extract product registry into shared manifest module"
```

---

## Task 8: Extract Navigation Templates

**Files:**
- Create: `app/js/templates.js`
- Modify: `app/js/navigation.js`

- [ ] **Step 1: Create templates.js with html tagged template helper**

```js
// app/js/templates.js
// Lightweight tagged template helper for readable HTML construction.
// No framework, no virtual DOM — just string concatenation with structure.

/**
 * Tagged template that joins arrays and strips leading whitespace.
 * Usage: html`<div>${items.map(i => html`<span>${i}</span>`)}</div>`
 */
export function html(strings, ...values) {
  let result = '';
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      const val = values[i];
      if (Array.isArray(val)) {
        result += val.join('');
      } else if (val == null || val === false) {
        // Skip nulls/false (conditional rendering)
      } else {
        result += String(val);
      }
    }
  }
  return result;
}

/**
 * Escape HTML entities in user-facing strings.
 * Use for any content that could theoretically contain < > & " characters.
 */
export function esc(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Breadcrumb builder — generates consistent breadcrumb HTML.
 */
export function breadcrumb(items) {
  return html`<div class="bc">${items.map((item, i) => {
    const sep = i > 0 ? html`<span class="bc-sep">&#x276F;</span>` : '';
    if (item.nav) {
      return html`${sep}<span class="bc-link" data-nav="${item.nav}">${item.label}</span>`;
    }
    return html`${sep}<span class="bc-here">${item.label}</span>`;
  })}</div>`;
}
```

- [ ] **Step 2: Refactor renderPlanetView to use templates.js**

In `navigation.js`, import the new helpers:

```js
import { html, esc, breadcrumb } from './templates.js';
```

Then replace the dense single-line `renderPlanetView` template (line ~744) with structured multi-line version using `html` tagged templates. The logic stays the same, but HTML is now readable:

```js
function renderPlanetView(id) {
  const p = PRODUCT_DATA[id];
  const el = document.getElementById('planet-content');

  const domainStats = buildDomainStats(p);
  const domainPkgHtml = buildDomainPackages(p);
  const cardHtml = p.components.map((c, i) => renderComponentCard(c, i, id, p)).join('');
  const connectionsHtml = p.connections.map(c => renderConnectionItem(c)).join('');
  const flowHtml = p.dataFlow.map((n, i) =>
    (i > 0 ? '<span class="flow-arrow">→</span>' : '') +
    `<span class="flow-node">${n}</span>`
  ).join('');

  el.innerHTML = html`
    ${breadcrumb([
      { label: PRODUCT_CONFIG.name || 'Home', nav: 'galaxy' },
      { label: p.name }
    ])}
    <div class="planet-header">
      <div class="planet-header-orb" style="background:${p.color};box-shadow:0 0 20px ${p.color}">
        <span class="icon-svg">${domainSvg(id, 28)}</span>
      </div>
      <div>
        <h2 style="color:${p.color}">${p.name}</h2>
        <p>${p.description}</p>
        ${domainPkgHtml}
      </div>
    </div>
    ${domainStats}
    <div class="component-grid">${cardHtml}</div>
    <div class="data-flow" style="animation-delay:${p.components.length * 30 + 60}ms">
      <h3>\u{1F500} Data Flow</h3>
      <div class="flow-diagram">${flowHtml}</div>
    </div>
    <div class="connections-section" style="animation-delay:${p.components.length * 30 + 120}ms">
      <h3>\u{1F30C} Connected Systems</h3>
      ${connectionsHtml}
    </div>
  `;

  wireNavListeners(el);
  wireComponentCards(el);
  wireConnectionItems(el);
  document.getElementById('planet-view').scrollTop = 0;
}
```

Extract the event-wiring into helper functions to avoid duplication:

```js
function wireNavListeners(el) {
  el.querySelectorAll('[data-nav="galaxy"]').forEach(l => {
    l.style.cursor = 'pointer';
    l.addEventListener('click', () => navigateTo('galaxy'));
  });
  el.querySelectorAll('[data-nav="planet"]').forEach(l => {
    l.style.cursor = 'pointer';
    l.addEventListener('click', () => navigateTo('planet'));
  });
  el.querySelectorAll('[data-nav="back"]').forEach(l => {
    l.style.cursor = 'pointer';
    l.addEventListener('click', () => goBack());
  });
}

function wireComponentCards(el) {
  el.querySelectorAll('.component-card').forEach(card => {
    const cid = card.dataset.component;
    const pid = card.dataset.planet;
    card.addEventListener('click', () => enterCore(pid, cid));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') enterCore(pid, cid); });
  });
}

function wireConnectionItems(el) {
  el.querySelectorAll('[data-connection-planet]').forEach(item => {
    const planetId = item.dataset.connectionPlanet;
    item.addEventListener('click', () => enterPlanet(planetId));
    item.addEventListener('keydown', e => { if (e.key === 'Enter') enterPlanet(planetId); });
  });
}
```

- [ ] **Step 3: Refactor remaining render functions similarly**

Apply the same pattern to `renderCoreView`, `renderEntityView`, `renderSearchResultsPage`. Each should:
1. Use `html` tagged template for the main template
2. Call shared `wireNavListeners(el)` instead of inline querySelectorAll
3. Keep the same DOM output (don't change class names or structure)

This is the largest single step. Do it incrementally — one render function at a time, testing between each.

- [ ] **Step 4: Verify all views render correctly**

Navigate through: Galaxy → Planet → Component → Entity → Back to Galaxy. Confirm:
- All breadcrumbs work
- Component cards, entity cards, connection items are clickable
- Search results page renders with AI answers
- No console errors

- [ ] **Step 5: Commit**

```bash
git add app/js/templates.js app/js/navigation.js
git commit -m "refactor: extract HTML templates into structured tagged-template helpers"
```

---

## Task 9: Add Test Coverage

**Files:**
- Create: `tests/runner.html`
- Create: `tests/test-utils.js`
- Create: `tests/merge-entities.test.js`
- Create: `tests/search.test.js`
- Create: `tests/navigation-state.test.js`

- [ ] **Step 1: Create minimal test harness**

```html
<!-- tests/runner.html -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Product Explorer Tests</title>
<style>
  body { font-family: monospace; background: #1a1a2e; color: #e2e8f0; padding: 24px; }
  .pass { color: #22c55e; } .fail { color: #ef4444; } .suite { margin: 16px 0; }
  h2 { color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155; padding-bottom: 4px; }
  pre { background: #0f0f23; padding: 8px; border-radius: 4px; overflow-x: auto; }
</style>
</head>
<body>
<h1>Product Explorer Tests</h1>
<div id="results"></div>
<script type="module">
  import { runSuite, reportAll } from './test-utils.js';
  import './merge-entities.test.js';
  import './search.test.js';
  import './navigation-state.test.js';

  // Report after all modules loaded
  setTimeout(() => reportAll(document.getElementById('results')), 100);
</script>
</body>
</html>
```

- [ ] **Step 2: Create test utilities**

```js
// tests/test-utils.js
const suites = [];
let currentSuite = null;

export function describe(name, fn) {
  currentSuite = { name, tests: [], passed: 0, failed: 0 };
  suites.push(currentSuite);
  fn();
  currentSuite = null;
}

export function it(name, fn) {
  const test = { name, error: null };
  try {
    fn();
    test.passed = true;
    currentSuite.passed++;
  } catch (e) {
    test.passed = false;
    test.error = e.message;
    currentSuite.failed++;
  }
  currentSuite.tests.push(test);
}

export function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected))
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toContain(item) {
      if (!actual.includes(item)) throw new Error(`Expected array to contain ${JSON.stringify(item)}`);
    },
    toBeGreaterThan(n) {
      if (!(actual > n)) throw new Error(`Expected ${actual} > ${n}`);
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected truthy, got ${JSON.stringify(actual)}`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected falsy, got ${JSON.stringify(actual)}`);
    },
    toHaveLength(n) {
      if (actual.length !== n) throw new Error(`Expected length ${n}, got ${actual.length}`);
    }
  };
}

export function reportAll(container) {
  let html = '';
  let totalPassed = 0, totalFailed = 0;
  for (const suite of suites) {
    html += `<div class="suite"><h2>${suite.name}</h2>`;
    for (const t of suite.tests) {
      const icon = t.passed ? '✓' : '✗';
      const cls = t.passed ? 'pass' : 'fail';
      html += `<div class="${cls}">${icon} ${t.name}</div>`;
      if (t.error) html += `<pre>${t.error}</pre>`;
    }
    html += `</div>`;
    totalPassed += suite.passed;
    totalFailed += suite.failed;
  }
  html = `<p><strong>${totalPassed} passed, ${totalFailed} failed</strong></p>` + html;
  container.innerHTML = html;
}
```

- [ ] **Step 3: Write merge-entities tests**

```js
// tests/merge-entities.test.js
import { describe, it, expect } from './test-utils.js';

// Inline the pure functions from main.js that we want to test
function matchesByPrefix(className, tags) {
  if (!tags) return false;
  const classPrefix = className.split('_')[0] + '_';
  return tags.some((t) => t.startsWith(classPrefix));
}

function commonPrefix(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a.slice(0, i);
}

describe('matchesByPrefix', () => {
  it('matches class with matching tag prefix', () => {
    expect(matchesByPrefix('CRLP_RollupDonation', ['CRLP_Rollup', 'other'])).toBe(true);
  });

  it('does not match unrelated prefix', () => {
    expect(matchesByPrefix('BDI_DataImport', ['CRLP_Rollup', 'UTIL_Currency'])).toBe(false);
  });

  it('returns false for null tags', () => {
    expect(matchesByPrefix('Any_Class', null)).toBe(false);
  });

  it('returns false for empty tags', () => {
    expect(matchesByPrefix('Any_Class', [])).toBe(false);
  });
});

describe('commonPrefix', () => {
  it('finds shared prefix between LWC names', () => {
    expect(commonPrefix('geFormRenderer', 'geFormField')).toBe('geForm');
  });

  it('returns empty for no shared prefix', () => {
    expect(commonPrefix('abc', 'xyz')).toBe('');
  });

  it('handles identical strings', () => {
    expect(commonPrefix('same', 'same')).toBe('same');
  });

  it('handles one string being prefix of other', () => {
    expect(commonPrefix('ab', 'abc')).toBe('ab');
  });
});
```

- [ ] **Step 4: Write search tests**

```js
// tests/search.test.js
import { describe, it, expect } from './test-utils.js';

// Inline the synonym expansion logic from search.js
const SYNONYMS = {
  tdtm: 'table driven trigger management',
  gau: 'general accounting unit',
  rd: 'recurring donation',
  lwc: 'lightning web component'
};

function expandSynonyms(text) {
  const lower = text.toLowerCase();
  const expansions = [];
  for (const [abbr, full] of Object.entries(SYNONYMS)) {
    if (lower.includes(abbr)) expansions.push(full);
  }
  return expansions.join(' ');
}

describe('expandSynonyms', () => {
  it('expands TDTM abbreviation', () => {
    const result = expandSynonyms('tdtm handler');
    expect(result.includes('table driven trigger management')).toBe(true);
  });

  it('expands LWC abbreviation', () => {
    const result = expandSynonyms('lwc components');
    expect(result.includes('lightning web component')).toBe(true);
  });

  it('returns empty for no matches', () => {
    expect(expandSynonyms('hello world')).toBe('');
  });

  it('is case-insensitive', () => {
    const result = expandSynonyms('TDTM');
    expect(result.includes('table driven trigger management')).toBe(true);
  });

  it('expands multiple synonyms in one query', () => {
    const result = expandSynonyms('tdtm and lwc');
    expect(result.includes('table driven trigger management')).toBe(true);
    expect(result.includes('lightning web component')).toBe(true);
  });
});
```

- [ ] **Step 5: Write navigation state tests**

```js
// tests/navigation-state.test.js
import { describe, it, expect } from './test-utils.js';

// Test the URL hash parsing logic (extracted from navigation.js handleHashNavigation)
function parseHash(hash) {
  const path = hash.replace(/^#\/?/, '');
  if (!path) return { level: 'galaxy' };
  const segments = path.split('/');
  if (segments.length === 1) return { level: 'planet', domainId: segments[0] };
  if (segments.length === 2) return { level: 'core', domainId: segments[0], componentId: segments[1] };
  if (segments.length >= 4) {
    const [domainId, componentId, entityType, ...nameParts] = segments;
    return { level: 'entity', domainId, componentId, entityType, entityName: decodeURIComponent(nameParts.join('/')) };
  }
  return { level: 'galaxy' };
}

describe('parseHash', () => {
  it('parses empty hash as galaxy', () => {
    expect(parseHash('#/')).toEqual({ level: 'galaxy' });
  });

  it('parses single segment as planet', () => {
    expect(parseHash('#/donations')).toEqual({ level: 'planet', domainId: 'donations' });
  });

  it('parses two segments as core (component)', () => {
    expect(parseHash('#/donations/opportunity-management')).toEqual({
      level: 'core', domainId: 'donations', componentId: 'opportunity-management'
    });
  });

  it('parses four+ segments as entity', () => {
    const result = parseHash('#/donations/opportunity-management/classes/OPP_DonationService');
    expect(result.level).toBe('entity');
    expect(result.domainId).toBe('donations');
    expect(result.componentId).toBe('opportunity-management');
    expect(result.entityType).toBe('classes');
    expect(result.entityName).toBe('OPP_DonationService');
  });

  it('handles encoded entity names', () => {
    const result = parseHash('#/tdtm/framework/classes/UTIL_UnitTestData%2FTEST');
    expect(result.entityName).toBe('UTIL_UnitTestData/TEST');
  });

  it('parses hash without leading slash', () => {
    expect(parseHash('#donations')).toEqual({ level: 'planet', domainId: 'donations' });
  });
});
```

- [ ] **Step 6: Run tests in browser**

Open `tests/runner.html` in a browser. Confirm all tests pass (green checkmarks).

- [ ] **Step 7: Commit**

```bash
git add tests/
git commit -m "test: add browser-based test suite for core heuristics"
```

---

## Task 10: Export Pure Functions for Testability

**Files:**
- Modify: `app/js/main.js` (export `matchesByPrefix`, `commonPrefix`)

- [ ] **Step 1: Export the pure utility functions from main.js**

At the bottom of main.js, add named exports for the functions that tests import:

```js
// Exported for testing — pure functions with no side effects
export { matchesByPrefix, commonPrefix };
```

Alternatively, since the tests currently inline these functions (avoiding import path issues with the test harness), this step is optional. If you want tests to import directly from main.js, the test files need to handle the side effects of main.js loading (DOM dependencies). The inline approach is simpler for now.

- [ ] **Step 2: Verify tests still pass**

Open `tests/runner.html` again. All green.

- [ ] **Step 3: Commit (if changes made)**

```bash
git add app/js/main.js
git commit -m "refactor: export pure utility functions for testability"
```

---

## Execution Order

Tasks are ordered by dependency:

1. **Task 1** (VERSION constant) — foundation, no deps
2. **Task 2** (Remove dead code) — no deps
3. **Task 3** (Vendor MiniSearch) — no deps
4. **Task 4** (AI timeout) — no deps
5. **Task 5** (Accessibility) — no deps
6. **Task 7** (Product manifest) — no deps
7. **Task 6** (Pointer events) — no deps, but test after Task 5 CSS
8. **Task 8** (Templates) — depends on Task 2 (dead code removed first)
9. **Task 9** (Tests) — depends on Tasks 1-8 being stable
10. **Task 10** (Export functions) — depends on Task 9

Tasks 1-7 are fully independent and can be executed in parallel by separate agents.

---

## Verification Checklist

After all tasks complete:

- [ ] Open `index.html` — all 10 product cards render from manifest
- [ ] Open `npsp/index.html` — galaxy loads, planets render, entities load
- [ ] Navigate: Galaxy → Planet → Component → Entity → Back (all levels)
- [ ] Search: press `/`, type "recurring donation", confirm fuzzy results
- [ ] AI search: ask a question, confirm timeout message if offline
- [ ] Keyboard: Tab through planets, press Enter to enter, Escape to go back
- [ ] Touch: emulate mobile in DevTools, tap/drag/pinch-zoom
- [ ] Theme: press `L`, confirm light mode toggle
- [ ] Tours: click Tour button, navigate stops
- [ ] Tests: open `tests/runner.html`, all green
- [ ] Console: no errors on any navigation path
