// ══════════════════════════════════════════════════════════════
//  PHYSICS — Force-directed graph engine
//  Runs simulation to convergence, provides settled node positions.
//  No canvas state — rendering handled by galaxy-renderer.js (DOM/SVG).
// ══════════════════════════════════════════════════════════════

import { prefersReducedMotion } from './state.js';

// Product data is injected by main.js via setProductData()
let PRODUCT_DATA = {};
let _radiusCache = null;
export const setProductData = (data) => { PRODUCT_DATA = data; _radiusCache = null; };

// ── Exported mutable state ──
export let nodes = [];
export let edges = [];
export let nodeMap = {};
export let layoutW = 0, layoutH = 0;
export let zoom = 1, panX = 0, panY = 0;

// Setters for mutable state that other modules need to write
export const setZoom = (v) => { zoom = v; };
export const setPanX = (v) => { panX = v; };
export const setPanY = (v) => { panY = v; };

// ── Transform update callback ──
// Set by main.js — called by animation functions to update CSS transform
let _onTransformUpdate = null;
export const setTransformCallback = (fn) => { _onTransformUpdate = fn; };

let alpha = 1.0;

// Node sizing: weighted by codebase complexity
const CODEBASE_WEIGHT = {
  recurring: 89, rollups: 76, bdi: 66, settings: 64, donations: 50, batch: 45,
  contacts: 39, allocations: 28, errors: 22, addresses: 20, giftentry: 19,
  elevate: 14, engagement: 12, softcredits: 8, relationships: 6, levels: 6,
  tdtm: 15, affiliations: 4
};
const FOUNDATIONAL = { tdtm: 2.5, settings: 1.3, errors: 1.2 };

// ── Cluster layout: data-driven domain groupings ──
const DOMAIN_GROUPS = {
  donations: 0, contacts: 0, recurring: 0, softcredits: 0,
  rollups: 1, batch: 1, allocations: 1, levels: 1,
  bdi: 2, giftentry: 2, elevate: 2,
  tdtm: 3, settings: 3, errors: 3,
  relationships: 3, addresses: 3, affiliations: 3, engagement: 3
};

const GROUP_CENTERS = [
  { x: 0.40, y: 0.30 },
  { x: 0.18, y: 0.65 },
  { x: 0.75, y: 0.68 },
  { x: 0.82, y: 0.30 },
];

const GROUP_GRAVITY = 0.20;

// Responsive radius range
function getRadiusRange() {
  const small = Math.min(layoutW, layoutH) < 600;
  return small ? { min: 18, range: 16 } : { min: 28, range: 24 };
}

function _computeRadiusScale() {
  const scores = Object.keys(PRODUCT_DATA).map((k) => {
    const dd = PRODUCT_DATA[k];
    return ((CODEBASE_WEIGHT[k] || 5) + dd.components.length * 10 + dd.connections.length * 3) * (FOUNDATIONAL[k] || 1.0);
  });
  _radiusCache = { mn: Math.min(...scores), mx: Math.max(...scores) };
}

export function calcRadius(key) {
  const d = PRODUCT_DATA[key];
  const cw = CODEBASE_WEIGHT[key] || 5;
  const compW = d.components.length * 10;
  const connW = d.connections.length * 3;
  const mult = FOUNDATIONAL[key] || 1.0;
  const raw = (cw + compW + connW) * mult;

  if (!_radiusCache) _computeRadiusScale();
  const { mn, mx } = _radiusCache;
  const { min, range } = getRadiusRange();
  return min + ((raw - mn) / (mx - mn)) * range;
}

// Intentional initial layout: seed positions near group centers for faster convergence
const LAYOUT_SEED = {
  donations:     { angle:  0.00, ring: 0.45 },
  contacts:      { angle:  0.50, ring: 0.50 },
  recurring:     { angle:  0.25, ring: 0.65 },
  softcredits:   { angle: -0.25, ring: 0.60 },
  rollups:       { angle:  1.60, ring: 0.65 },
  batch:         { angle:  2.00, ring: 0.70 },
  allocations:   { angle:  1.80, ring: 0.80 },
  levels:        { angle:  2.30, ring: 0.85 },
  bdi:           { angle: -1.20, ring: 0.70 },
  giftentry:     { angle: -1.50, ring: 0.75 },
  elevate:       { angle: -1.00, ring: 0.80 },
  tdtm:          { angle: -0.50, ring: 0.40 },
  settings:      { angle: -0.70, ring: 0.45 },
  errors:        { angle: -0.90, ring: 0.50 },
  relationships: { angle:  0.80, ring: 0.85 },
  addresses:     { angle: -2.30, ring: 0.75 },
  affiliations:  { angle:  0.70, ring: 0.80 },
  engagement:    { angle: -1.80, ring: 0.85 },
};

export function initGraph(w, h) {
  layoutW = w || innerWidth;
  layoutH = h || innerHeight;

  const keys = Object.keys(PRODUCT_DATA);
  const cx = layoutW / 2, cy = (200 + layoutH - 80) / 2;
  const spreadX = layoutW * 0.42;
  const spreadY = layoutH * 0.25;
  const tilt = -0.26;

  nodes = keys.map((key, i) => {
    const seed = LAYOUT_SEED[key] || { angle: Math.random() * Math.PI * 2, ring: 0.7 };
    return {
      id: key,
      label: PRODUCT_DATA[key].name,
      icon: PRODUCT_DATA[key].icon,
      color: PRODUCT_DATA[key].color,
      desc: PRODUCT_DATA[key].description,
      componentCount: PRODUCT_DATA[key].components.length,
      classCount: CODEBASE_WEIGHT[key] || 0,
      connectionCount: PRODUCT_DATA[key].connections.length,
      radius: calcRadius(key),
      x: cx + (Math.cos(seed.angle) * spreadX * seed.ring) * Math.cos(tilt)
             - (Math.sin(seed.angle) * spreadY * seed.ring) * Math.sin(tilt)
             + (Math.random() - 0.5) * 20,
      y: cy + (Math.cos(seed.angle) * spreadX * seed.ring) * Math.sin(tilt)
             + (Math.sin(seed.angle) * spreadY * seed.ring) * Math.cos(tilt)
             + (Math.random() - 0.5) * 20,
      vx: 0, vy: 0,
      fx: null, fy: null,
      breathPhase: Math.random() * Math.PI * 2,
      entranceDelay: i * 50,
      entranceAlpha: 0
    };
  });

  nodeMap = {};
  nodes.forEach((n) => { nodeMap[n.id] = n; });

  // Build edges from connections
  const edgeSet = new Set();
  edges = [];
  for (const n of nodes) {
    for (const conn of PRODUCT_DATA[n.id].connections) {
      const key = [n.id, conn.planet].sort().join('--');
      if (!edgeSet.has(key) && nodeMap[conn.planet]) {
        edgeSet.add(key);
        edges.push({ source: n.id, target: conn.planet, label: conn.desc });
      }
    }
  }

  alpha = 1.0;
}

function simulate() {
  if (alpha < 0.001) return;
  alpha *= 0.992;

  // N-body repulsion
  const labelPad = 15; // half of ~30px label zone below each planet
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      let dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const minDist = (a.radius + labelPad) + (b.radius + labelPad) + 220;
      const force = (minDist * minDist) / (dist * dist) * 2.5 * alpha;
      const fx = (dx / dist) * force, fy = (dy / dist) * force;
      a.vx -= fx; a.vy -= fy;
      b.vx += fx; b.vy += fy;
    }
  }

  // Spring attraction along edges
  for (const e of edges) {
    const s = nodeMap[e.source], t = nodeMap[e.target];
    if (!s || !t) continue;
    let dx = t.x - s.x, dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const idealLen = Math.min(layoutW, layoutH) < 600 ? 160 : 260;
    const force = (dist - idealLen) * 0.04 * alpha;
    const fx = (dx / dist) * force, fy = (dy / dist) * force;
    s.vx += fx; s.vy += fy;
    t.vx -= fx; t.vy -= fy;
  }

  // Anisotropic centering gravity
  const cx = layoutW / 2, cy = (200 + layoutH - 80) / 2;
  for (const n of nodes) {
    n.vx += (cx - n.x) * 0.003 * alpha;
    n.vy += (cy - n.y) * 0.010 * alpha;
  }

  // Group gravity
  for (const n of nodes) {
    const g = DOMAIN_GROUPS[n.id];
    if (g === undefined) continue;
    const center = GROUP_CENTERS[g];
    const targetX = center.x * layoutW;
    const targetY = center.y * layoutH;
    n.vx += (targetX - n.x) * GROUP_GRAVITY * alpha;
    n.vy += (targetY - n.y) * GROUP_GRAVITY * alpha;
  }

  // Integration with friction
  for (const n of nodes) {
    if (n.fx !== null) { n.x = n.fx; n.vx = 0; }
    else { n.vx *= 0.6; n.x += n.vx; }
    if (n.fy !== null) { n.y = n.fy; n.vy = 0; }
    else { n.vy *= 0.6; n.y += n.vy; }

    const margin = n.radius + 20;
    const bottomMargin = n.radius + 50; // extra 30px for label below planet
    const topBound = Math.max(margin, 200);
    n.x = Math.max(margin, Math.min(layoutW - margin, n.x));
    n.y = Math.max(topBound, Math.min(layoutH - bottomMargin - 100, n.y));
  }
}

// Run simulation to convergence synchronously, return settled positions
export function computeLayout(w, h) {
  layoutW = w || innerWidth;
  layoutH = h || innerHeight;

  // Recalculate radii for new dimensions
  nodes.forEach((n) => { n.radius = calcRadius(n.id); });

  alpha = 1.0;
  let iterations = 0;
  while (alpha >= 0.001 && iterations < 500) {
    simulate();
    iterations++;
  }
}

// Resize handler: recompute layout for new dimensions
export function onGraphResize(w, h) {
  computeLayout(w || innerWidth, h || innerHeight);
}

// ── Zoom-to-planet animation ──
let zoomAnimId = null;

export function animatePanTo(node, duration, targetZoomLevel, callback) {
  const startZoom = zoom, startPanX = panX, startPanY = panY;
  const targetZoom = targetZoomLevel || 1.4;
  const targetPanX = layoutW / 2 - node.x * targetZoom;
  const targetPanY = layoutH / 2 - node.y * targetZoom;
  const startTime = performance.now();

  if (prefersReducedMotion) {
    zoom = targetZoom;
    panX = targetPanX;
    panY = targetPanY;
    if (_onTransformUpdate) _onTransformUpdate();
    if (callback) callback();
    return;
  }

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const e = 1 - Math.pow(1 - t, 3);
    zoom = startZoom + (targetZoom - startZoom) * e;
    panX = startPanX + (targetPanX - startPanX) * e;
    panY = startPanY + (targetPanY - startPanY) * e;
    if (_onTransformUpdate) _onTransformUpdate();
    if (t < 1) { zoomAnimId = requestAnimationFrame(step); }
    else { zoomAnimId = null; if (callback) callback(); }
  }

  if (zoomAnimId) cancelAnimationFrame(zoomAnimId);
  zoomAnimId = requestAnimationFrame(step);
}

export function cancelPanAnimation() {
  if (zoomAnimId) { cancelAnimationFrame(zoomAnimId); zoomAnimId = null; }
}

export function resetZoomPan() {
  cancelPanAnimation();
  zoom = 1; panX = 0; panY = 0;
}
