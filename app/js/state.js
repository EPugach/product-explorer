// ══════════════════════════════════════════════════════════════
//  STATE — Shared mutable state module
//  B3: Extracted to break circular dependencies between modules.
//  Any state read by multiple modules lives here.
// ══════════════════════════════════════════════════════════════

// ── Product identity (set once at init by main.js) ──
export let productId = '';
export let lsPrefix = '';
export const setProductId = (id) => { productId = id; lsPrefix = id ? id + '-' : ''; };

// ── Tour visual state (read by renderer.js, written by tours.js) ──
export let tourFocusNode = null;          // node id string
export let tourHighlightedEdges = null;   // Set of edge keys like 'donations--contacts'
export let tourStopPlanets = null;        // Set of planet ids in current tour

export const setTourFocusNode = (val) => { tourFocusNode = val; };
export const setTourHighlightedEdges = (val) => { tourHighlightedEdges = val; };
export const setTourStopPlanets = (val) => { tourStopPlanets = val; };

// ── Tour state object (read by main.js, renderer.js; written by tours.js) ──
export const tourState = {
  active: false,
  tourId: null,
  stopIndex: 0,
  mode: 'admin',  // 'admin' or 'dev'
  startTime: 0,
  stopStartTime: 0
};

// ── Keyboard planet focus (written by main.js, read by renderer.js) ──
export let focusedPlanetIndex = -1;
export const setFocusedPlanetIndex = (val) => { focusedPlanetIndex = val; };

// ── Page visibility (written by main.js, read by starfield.js) ──
export let pageHidden = false;
export const setPageHidden = (val) => { pageHidden = val; };

// ── Entity loading state (written by main.js, read by navigation.js) ──
export let entitiesLoaded = false;
export const setEntitiesLoaded = (val) => { entitiesLoaded = val; };

// ── Reduced motion preference (reactive, read by all canvas modules) ──
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
export let prefersReducedMotion = motionQuery.matches;
motionQuery.addEventListener('change', (e) => { prefersReducedMotion = e.matches; });
