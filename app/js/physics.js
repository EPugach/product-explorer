// ══════════════════════════════════════════════════════════════
//  PHYSICS — Force-directed graph engine
//  Adapted from galaxy-v2 with touch support + responsive sizing
// ══════════════════════════════════════════════════════════════

import { prefersReducedMotion } from './state.js';

// Product data is injected by main.js via setProductData()
let PRODUCT_DATA = {};
export const setProductData = (data) => { PRODUCT_DATA = data; };

// ── Exported mutable state ──
// These are read by renderer.js, particles.js, and main.js.
// We export setter functions so other modules can mutate them.
export let nodes = [];
export let edges = [];
export let nodeMap = {};
export let graphCanvas, graphCtx, canvasW, canvasH;
export let zoom = 1, panX = 0, panY = 0;
export let dragNode = null, hoveredNode = null;
export let isDragging = false, isPanning = false;
export let lastMouse = { x: 0, y: 0 };
export let alpha = 1.0, graphSettled = false;

// Setters for mutable state that other modules need to write
export const setZoom = (v) => { zoom = v; };
export const setPanX = (v) => { panX = v; };
export const setPanY = (v) => { panY = v; };
export const setDragNode = (v) => { dragNode = v; };
export const setHoveredNode = (v) => { hoveredNode = v; };
export const setIsDragging = (v) => { isDragging = v; };
export const setIsPanning = (v) => { isPanning = v; };
export const setLastMouse = (v) => { lastMouse = v; };
export const setAlpha = (v) => { alpha = v; };
export const setGraphSettled = (v) => { graphSettled = v; };

// ── Render callbacks ──
// Set by main.js after all modules load to break circular import with renderer/particles.
let _renderGraph = null;
let _renderParticles = null;
export const setRenderCallbacks = (renderGraphFn, renderParticlesFn) => {
  _renderGraph = renderGraphFn;
  _renderParticles = renderParticlesFn;
};

// Node sizing: weighted by codebase complexity
const CODEBASE_WEIGHT = {
  recurring: 89, rollups: 76, bdi: 66, settings: 64, donations: 50, batch: 45,
  contacts: 39, allocations: 28, errors: 22, addresses: 20, giftentry: 19,
  elevate: 14, engagement: 12, softcredits: 8, relationships: 6, levels: 6,
  tdtm: 15, affiliations: 4
};
const FOUNDATIONAL = { tdtm: 2.5, settings: 1.3, errors: 1.2 };

// ── Cluster layout: data-driven domain groupings ──
// Groups from .plans/data-audit-connection-summary.md (audited connection density)
// Centers use normalized coords (0-1), scaled to canvas in simulate()
const DOMAIN_GROUPS = {
  // Group 0: Core Transaction (upper-center) — highest connectivity
  donations: 0, contacts: 0, recurring: 0, softcredits: 0,
  // Group 1: Data Processing (lower-left)
  rollups: 1, batch: 1, allocations: 1, levels: 1,
  // Group 2: Data Entry & Integration (lower-right)
  bdi: 2, giftentry: 2, elevate: 2,
  // Group 3: Framework & Support (right)
  tdtm: 3, settings: 3, errors: 3,
  relationships: 3, addresses: 3, affiliations: 3, engagement: 3
};

const GROUP_CENTERS = [
  { x: 0.45, y: 0.38 },  // 0: Core Transaction — upper center
  { x: 0.25, y: 0.62 },  // 1: Data Processing — lower left
  { x: 0.70, y: 0.62 },  // 2: Data Entry — lower right
  { x: 0.75, y: 0.38 },  // 3: Framework — right
];

const GROUP_GRAVITY = 0.20;  // Tuned up from 0.10 — 0.10 was too subtle visually

// Responsive radius range
function getRadiusRange() {
  const small = Math.min(canvasW, canvasH) < 600;
  return small ? { min: 18, range: 16 } : { min: 28, range: 24 };
}

export function calcRadius(key) {
  const d = PRODUCT_DATA[key];
  const cw = CODEBASE_WEIGHT[key] || 5;
  const compW = d.components.length * 10;
  const connW = d.connections.length * 3;
  const mult = FOUNDATIONAL[key] || 1.0;
  const raw = (cw + compW + connW) * mult;

  const scores = Object.keys(PRODUCT_DATA).map((k) => {
    const dd = PRODUCT_DATA[k];
    return ((CODEBASE_WEIGHT[k] || 5) + dd.components.length * 10 + dd.connections.length * 3) * (FOUNDATIONAL[k] || 1.0);
  });
  const mn = Math.min(...scores), mx = Math.max(...scores);
  const { min, range } = getRadiusRange();
  return min + ((raw - mn) / (mx - mn)) * range;
}

// Intentional initial layout: seed positions near group centers for faster convergence
const LAYOUT_SEED = {
  // Group 0: Core Transaction (upper-center, angles ~-0.3 to 0.8)
  donations:     { angle:  0.00, ring: 0.45 },
  contacts:      { angle:  0.50, ring: 0.50 },
  recurring:     { angle:  0.25, ring: 0.65 },
  softcredits:   { angle: -0.25, ring: 0.60 },
  // Group 1: Data Processing (lower-left, angles ~1.5 to 2.5)
  rollups:       { angle:  1.60, ring: 0.65 },
  batch:         { angle:  2.00, ring: 0.70 },
  allocations:   { angle:  1.80, ring: 0.80 },
  levels:        { angle:  2.30, ring: 0.85 },
  // Group 2: Data Entry & Integration (lower-right, angles ~-1.0 to -1.8)
  bdi:           { angle: -1.20, ring: 0.70 },
  giftentry:     { angle: -1.50, ring: 0.75 },
  elevate:       { angle: -1.00, ring: 0.80 },
  // Group 3: Framework & Support (right, angles ~-0.4 to -2.5)
  tdtm:          { angle: -0.50, ring: 0.40 },
  settings:      { angle: -0.70, ring: 0.45 },
  errors:        { angle: -0.90, ring: 0.50 },
  relationships: { angle:  0.80, ring: 0.85 },
  addresses:     { angle: -2.30, ring: 0.75 },
  affiliations:  { angle:  0.70, ring: 0.80 },
  engagement:    { angle: -1.80, ring: 0.85 },
};

export function initGraph() {
  graphCanvas = document.getElementById('graph-canvas');
  graphCtx = graphCanvas.getContext('2d');
  resizeGraphCanvas();

  const keys = Object.keys(PRODUCT_DATA);
  const cx = canvasW / 2, cy = (200 + canvasH - 80) / 2;
  const spreadX = canvasW * 0.38;   // wide horizontal
  const spreadY = canvasH * 0.18;   // flat vertical
  const tilt = -0.26;               // ~15 degree tilt

  nodes = keys.map((key) => {
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
      pulsePhase: Math.random() * Math.PI * 2,
      breathPhase: Math.random() * Math.PI * 2,
      entranceDelay: 0,
      entranceAlpha: 0
    };
  });

  // Stagger entrance
  nodes.forEach((n, i) => {
    n.entranceDelay = i * 50;
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
  graphSettled = false;
}

export function resizeGraphCanvas() {
  const w = innerWidth, h = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  graphCanvas.width = w * dpr;
  graphCanvas.height = h * dpr;
  graphCanvas.style.width = w + 'px';
  graphCanvas.style.height = h + 'px';
  canvasW = w;
  canvasH = h;
}

export function simulate() {
  if (alpha < 0.001) { graphSettled = true; return; }
  alpha *= 0.992;

  // N-body repulsion
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      let dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const minDist = a.radius + b.radius + 160;
      const force = (minDist * minDist) / (dist * dist) * 2.0 * alpha;
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
    const idealLen = Math.min(canvasW, canvasH) < 600 ? 160 : 260;
    const force = (dist - idealLen) * 0.04 * alpha;
    const fx = (dx / dist) * force, fy = (dy / dist) * force;
    s.vx += fx; s.vy += fy;
    t.vx -= fx; t.vy -= fy;
  }

  // Anisotropic centering gravity (weaker x to spread, stronger y to keep flat)
  const cx = canvasW / 2, cy = (200 + canvasH - 80) / 2;
  for (const n of nodes) {
    n.vx += (cx - n.x) * 0.005 * alpha;   // weaker x: let them spread
    n.vy += (cy - n.y) * 0.015 * alpha;   // stronger y: keep band flat
  }

  // Group gravity — weak pull toward cluster center
  for (const n of nodes) {
    const g = DOMAIN_GROUPS[n.id];
    if (g === undefined) continue;
    const center = GROUP_CENTERS[g];
    const targetX = center.x * canvasW;
    const targetY = center.y * canvasH;
    n.vx += (targetX - n.x) * GROUP_GRAVITY * alpha;
    n.vy += (targetY - n.y) * GROUP_GRAVITY * alpha;
  }

  // Integration with friction
  for (const n of nodes) {
    if (n.fx !== null) { n.x = n.fx; n.vx = 0; }
    else { n.vx *= 0.6; n.x += n.vx; }
    if (n.fy !== null) { n.y = n.fy; n.vy = 0; }
    else { n.vy *= 0.6; n.y += n.vy; }

    // Boundary clamping (top: below title area, bottom: above stats bar)
    const margin = n.radius + 20;
    const topBound = Math.max(margin, 200);
    n.x = Math.max(margin, Math.min(canvasW - margin, n.x));
    n.y = Math.max(topBound, Math.min(canvasH - margin - 100, n.y));
  }
}

export function screenToGraph(sx, sy) {
  return { x: (sx - panX) / zoom, y: (sy - panY) / zoom };
}

export function hitTest(sx, sy) {
  const { x, y } = screenToGraph(sx, sy);
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    const dx = x - n.x, dy = y - n.y;
    if (dx * dx + dy * dy < n.radius * n.radius * 1.4) return n;
  }
  return null;
}

// Recalculate radii and spring lengths on resize
export function onGraphResize() {
  resizeGraphCanvas();
  nodes.forEach((n) => { n.radius = calcRadius(n.id); });
  alpha = Math.max(alpha, 0.3);
  graphSettled = false;
}

// ── Zoom-to-planet animation ──
let zoomAnimId = null;

export function animateZoomTo(node, duration, callback) {
  const startZoom = zoom, startPanX = panX, startPanY = panY;

  // Target: zoom centered on planet
  const targetZoom = Math.min(canvasW / (node.radius * 6), 3);
  const targetPanX = canvasW / 2 - node.x * targetZoom;
  const targetPanY = canvasH / 2 - node.y * targetZoom;

  const startTime = performance.now();

  // Skip animation for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (callback) callback();
    return;
  }

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    // Ease-out cubic for smooth deceleration
    const e = 1 - Math.pow(1 - t, 3);

    zoom = startZoom + (targetZoom - startZoom) * e;
    panX = startPanX + (targetPanX - startPanX) * e;
    panY = startPanY + (targetPanY - startPanY) * e;

    if (_renderGraph) _renderGraph();
    if (_renderParticles) _renderParticles();

    if (t < 1) {
      zoomAnimId = requestAnimationFrame(step);
    } else {
      zoomAnimId = null;
      if (callback) callback();
    }
  }

  if (zoomAnimId) cancelAnimationFrame(zoomAnimId);
  zoomAnimId = requestAnimationFrame(step);
}

export function animatePanTo(node, duration, targetZoomLevel, callback) {
  const startZoom = zoom, startPanX = panX, startPanY = panY;

  // Target: center on planet at specified zoom level (e.g. 1.4x)
  const targetZoom = targetZoomLevel || 1.4;
  const targetPanX = canvasW / 2 - node.x * targetZoom;
  const targetPanY = canvasH / 2 - node.y * targetZoom;

  const startTime = performance.now();

  // Skip animation for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    zoom = targetZoom;
    panX = targetPanX;
    panY = targetPanY;
    if (_renderGraph) _renderGraph();
    if (_renderParticles) _renderParticles();
    if (callback) callback();
    return;
  }

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    // Ease-out cubic for smooth deceleration
    const e = 1 - Math.pow(1 - t, 3);

    zoom = startZoom + (targetZoom - startZoom) * e;
    panX = startPanX + (targetPanX - startPanX) * e;
    panY = startPanY + (targetPanY - startPanY) * e;

    if (_renderGraph) _renderGraph();
    if (_renderParticles) _renderParticles();

    if (t < 1) {
      zoomAnimId = requestAnimationFrame(step);
    } else {
      zoomAnimId = null;
      if (callback) callback();
    }
  }

  if (zoomAnimId) cancelAnimationFrame(zoomAnimId);
  zoomAnimId = requestAnimationFrame(step);
}

export function resetZoomPan() {
  if (zoomAnimId) { cancelAnimationFrame(zoomAnimId); zoomAnimId = null; }
  zoom = 1; panX = 0; panY = 0;
}

// ── Cinematic fly-in: zoom camera into a planet ──
export function animateFlyIn(node, duration, onProgress, callback) {
  const startZoom = zoom, startPanX = panX, startPanY = panY;
  const targetZoom = Math.min(canvasW / (node.radius * 4), 5);
  const targetPanX = canvasW / 2 - node.x * targetZoom;
  const targetPanY = canvasH / 2 - node.y * targetZoom;
  const startTime = performance.now();

  if (prefersReducedMotion) {
    if (onProgress) onProgress(1);
    if (callback) callback();
    return;
  }

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const e = 1 - Math.pow(1 - t, 3);
    zoom = startZoom + (targetZoom - startZoom) * e;
    panX = startPanX + (targetPanX - startPanX) * e;
    panY = startPanY + (targetPanY - startPanY) * e;
    if (onProgress) onProgress(e);
    if (_renderGraph) _renderGraph();
    if (_renderParticles) _renderParticles();
    if (t < 1) { zoomAnimId = requestAnimationFrame(step); }
    else { zoomAnimId = null; if (callback) callback(); }
  }

  if (zoomAnimId) cancelAnimationFrame(zoomAnimId);
  zoomAnimId = requestAnimationFrame(step);
}

// ── Cinematic fly-out: zoom camera back to galaxy overview ──
export function animateFlyOut(duration, onProgress, callback) {
  const startZoom = zoom, startPanX = panX, startPanY = panY;
  const startTime = performance.now();

  if (prefersReducedMotion) {
    zoom = 1; panX = 0; panY = 0;
    if (onProgress) onProgress(1);
    if (_renderGraph) _renderGraph();
    if (_renderParticles) _renderParticles();
    if (callback) callback();
    return;
  }

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const e = 1 - Math.pow(1 - t, 3);
    zoom = startZoom + (1 - startZoom) * e;
    panX = startPanX - startPanX * e;
    panY = startPanY - startPanY * e;
    if (onProgress) onProgress(e);
    if (_renderGraph) _renderGraph();
    if (_renderParticles) _renderParticles();
    if (t < 1) { zoomAnimId = requestAnimationFrame(step); }
    else { zoomAnimId = null; if (callback) callback(); }
  }

  if (zoomAnimId) cancelAnimationFrame(zoomAnimId);
  zoomAnimId = requestAnimationFrame(step);
}

// ── Orbital Drift with Realistic Physics ──
const ORBIT_SPEED = 0.00002;        // ~0.07 deg/sec
const SOLVER_ITERATIONS = 3;        // Gauss-Seidel passes for cascade resolution
const VELOCITY_DAMPING = 0.97;      // floaty zero-gravity decay (~1.5s)
const COLLISION_GAP = 4;            // min px gap between surfaces
const REPULSION_RANGE = 40;         // soft repulsion buffer zone (px)
const REPULSION_STRENGTH_ORBIT = 0.12;    // quadratic ramp force
const RESTITUTION = 0.1;            // near-inelastic, gentle nudge
const WALL_BOUNCE = 0.1;            // soft wall reflection

export function applyOrbitalDrift() {
  if (!graphSettled || dragNode || prefersReducedMotion) return;
  const cx = canvasW / 2, cy = (200 + canvasH - 80) / 2;
  const cosA = Math.cos(ORBIT_SPEED), sinA = Math.sin(ORBIT_SPEED);

  // 1. Rotate all planets (orbital motion)
  for (const n of nodes) {
    const dx = n.x - cx, dy = n.y - cy;
    n.x = cx + dx * cosA - dy * sinA;
    n.y = cy + dx * sinA + dy * cosA;
  }

  // 2. Soft repulsion field (preventive force before contact)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const contactDist = a.radius + b.radius + COLLISION_GAP;
      const bufferDist = contactDist + REPULSION_RANGE;

      if (dist >= bufferDist) continue;

      // Quadratic ramp: zero at buffer edge, max at contact
      const t = Math.max(0, 1 - (dist - contactDist) / (bufferDist - contactDist));
      const force = t * t * REPULSION_STRENGTH_ORBIT;

      const nx = dx / dist, ny = dy / dist;

      // Inverse-mass weighting (mass = radius^2, area-proportional)
      const wA = 1 / (a.radius * a.radius);
      const wB = 1 / (b.radius * b.radius);
      const wSum = wA + wB;

      a.vx -= nx * force * (wA / wSum);
      a.vy -= ny * force * (wA / wSum);
      b.vx += nx * force * (wB / wSum);
      b.vy += ny * force * (wB / wSum);
    }
  }

  // 3. Integrate velocities
  for (const n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
  }

  // 4. Iterative constraint projection (Gauss-Seidel, fixes cascading overlaps)
  for (let iter = 0; iter < SOLVER_ITERATIONS; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const minDist = a.radius + b.radius + COLLISION_GAP;

        if (dist >= minDist) continue;

        const nx = dx / dist, ny = dy / dist;
        const overlap = minDist - dist;

        // Mass-weighted position correction
        const wA = 1 / (a.radius * a.radius);
        const wB = 1 / (b.radius * b.radius);
        const wSum = wA + wB;

        a.x -= nx * overlap * (wA / wSum);
        a.y -= ny * overlap * (wA / wSum);
        b.x += nx * overlap * (wB / wSum);
        b.y += ny * overlap * (wB / wSum);

        // Elastic impulse (only when approaching)
        const relVelN = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (relVelN < 0) {
          const impulse = -(1 + RESTITUTION) * relVelN / wSum;
          a.vx -= nx * impulse * wA;
          a.vy -= ny * impulse * wA;
          b.vx += nx * impulse * wB;
          b.vy += ny * impulse * wB;
        }
      }
    }
  }

  // 5. Damping + velocity cap + boundary reflection
  const MAX_SPEED = 0.5;
  for (const n of nodes) {
    n.vx *= VELOCITY_DAMPING;
    n.vy *= VELOCITY_DAMPING;
    const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
    if (speed > MAX_SPEED) {
      const scale = MAX_SPEED / speed;
      n.vx *= scale;
      n.vy *= scale;
    }

    const margin = n.radius + 20;
    const topBound = Math.max(margin, 200);
    const bottomBound = canvasH - margin - 100;

    if (n.x < margin)            { n.x = margin;          n.vx = Math.abs(n.vx) * WALL_BOUNCE; }
    else if (n.x > canvasW - margin) { n.x = canvasW - margin; n.vx = -Math.abs(n.vx) * WALL_BOUNCE; }
    if (n.y < topBound)          { n.y = topBound;         n.vy = Math.abs(n.vy) * WALL_BOUNCE; }
    else if (n.y > bottomBound)  { n.y = bottomBound;      n.vy = -Math.abs(n.vy) * WALL_BOUNCE; }
  }
}
