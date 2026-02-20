// ══════════════════════════════════════════════════════════════
//  PHYSICS — Force-directed graph engine
//  Adapted from galaxy-v2 with touch support + responsive sizing
// ══════════════════════════════════════════════════════════════

let nodes = [], edges = [], nodeMap = {};
let graphCanvas, graphCtx, canvasW, canvasH;
let zoom = 1, panX = 0, panY = 0;
let dragNode = null, hoveredNode = null;
let isDragging = false, isPanning = false;
let lastMouse = { x: 0, y: 0 };
let alpha = 1.0, graphSettled = false;

// Node sizing: weighted by codebase complexity
const CODEBASE_WEIGHT = {
  recurring: 89, rollups: 76, bdi: 66, settings: 64, donations: 50, batch: 45,
  contacts: 39, allocations: 28, errors: 22, addresses: 20, giftentry: 19,
  elevate: 14, engagement: 12, softcredits: 8, relationships: 6, levels: 6,
  tdtm: 15, affiliations: 4
};
const FOUNDATIONAL = { tdtm: 2.5, settings: 1.3, errors: 1.2 };

// Responsive radius range
function getRadiusRange() {
  const small = Math.min(canvasW, canvasH) < 600;
  return small ? { min: 18, range: 16 } : { min: 28, range: 24 };
}

function calcRadius(key) {
  const d = NPSP[key];
  const cw = CODEBASE_WEIGHT[key] || 5;
  const compW = d.components.length * 10;
  const connW = d.connections.length * 3;
  const mult = FOUNDATIONAL[key] || 1.0;
  const raw = (cw + compW + connW) * mult;

  const scores = Object.keys(NPSP).map(k => {
    const dd = NPSP[k];
    return ((CODEBASE_WEIGHT[k] || 5) + dd.components.length * 10 + dd.connections.length * 3) * (FOUNDATIONAL[k] || 1.0);
  });
  const mn = Math.min(...scores), mx = Math.max(...scores);
  const { min, range } = getRadiusRange();
  return min + ((raw - mn) / (mx - mn)) * range;
}

// Intentional initial layout: arrange domains in a meaningful pattern
const LAYOUT_SEED = {
  donations:     { angle: -1.2, ring: 0.7 },
  contacts:      { angle: -2.2, ring: 0.8 },
  recurring:     { angle: -0.3, ring: 0.8 },
  rollups:       { angle: -0.8, ring: 0.5 },
  softcredits:   { angle: -2.8, ring: 0.9 },
  allocations:   { angle: 0.3, ring: 0.9 },
  tdtm:          { angle: -1.8, ring: 0.4 },
  batch:         { angle: 0.0, ring: 0.6 },
  relationships: { angle: -2.5, ring: 0.7 },
  addresses:     { angle: -2.0, ring: 0.7 },
  affiliations:  { angle: 0.6, ring: 0.8 },
  engagement:    { angle: -3.0, ring: 0.9 },
  bdi:           { angle: -1.5, ring: 0.8 },
  giftentry:     { angle: -0.5, ring: 0.8 },
  levels:        { angle: 0.8, ring: 0.9 },
  errors:        { angle: -2.3, ring: 0.6 },
  settings:      { angle: -1.0, ring: 0.6 },
  elevate:       { angle: 0.4, ring: 0.7 }
};

function initGraph() {
  graphCanvas = document.getElementById('graph-canvas');
  graphCtx = graphCanvas.getContext('2d');
  resizeGraphCanvas();

  const keys = Object.keys(NPSP);
  const cx = canvasW / 2, cy = (200 + canvasH - 80) / 2;
  const spread = Math.min(canvasW, canvasH) * 0.24;

  nodes = keys.map(key => {
    const seed = LAYOUT_SEED[key] || { angle: Math.random() * Math.PI * 2, ring: 0.7 };
    return {
      id: key,
      label: NPSP[key].name,
      icon: NPSP[key].icon,
      color: NPSP[key].color,
      desc: NPSP[key].description,
      componentCount: NPSP[key].components.length,
      classCount: CODEBASE_WEIGHT[key] || 0,
      connectionCount: NPSP[key].connections.length,
      radius: calcRadius(key),
      x: cx + Math.cos(seed.angle) * spread * seed.ring + (Math.random() - 0.5) * 30,
      y: cy + Math.sin(seed.angle) * spread * seed.ring + (Math.random() - 0.5) * 30,
      vx: 0, vy: 0,
      fx: null, fy: null,
      pulsePhase: Math.random() * Math.PI * 2,
      entranceDelay: 0,
      entranceAlpha: 0
    };
  });

  // Stagger entrance
  nodes.forEach((n, i) => {
    n.entranceDelay = i * 50;
  });

  nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  // Build edges from connections
  const edgeSet = new Set();
  edges = [];
  for (const n of nodes) {
    for (const conn of NPSP[n.id].connections) {
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

function resizeGraphCanvas() {
  const w = innerWidth, h = innerHeight;
  graphCanvas.width = w * devicePixelRatio;
  graphCanvas.height = h * devicePixelRatio;
  graphCanvas.style.width = w + 'px';
  graphCanvas.style.height = h + 'px';
  canvasW = w;
  canvasH = h;
}

function simulate() {
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
    const idealLen = Math.min(canvasW, canvasH) < 600 ? 160 : 240;
    const force = (dist - idealLen) * 0.04 * alpha;
    const fx = (dx / dist) * force, fy = (dy / dist) * force;
    s.vx += fx; s.vy += fy;
    t.vx -= fx; t.vy -= fy;
  }

  // Centering gravity (offset down to avoid title area)
  const cx = canvasW / 2, cy = (200 + canvasH - 80) / 2;
  for (const n of nodes) {
    n.vx += (cx - n.x) * 0.008 * alpha;
    n.vy += (cy - n.y) * 0.008 * alpha;
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

function screenToGraph(sx, sy) {
  return { x: (sx - panX) / zoom, y: (sy - panY) / zoom };
}

function hitTest(sx, sy) {
  const { x, y } = screenToGraph(sx, sy);
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    const dx = x - n.x, dy = y - n.y;
    if (dx * dx + dy * dy < n.radius * n.radius * 1.4) return n;
  }
  return null;
}

// Recalculate radii and spring lengths on resize
function onGraphResize() {
  resizeGraphCanvas();
  nodes.forEach(n => { n.radius = calcRadius(n.id); });
  alpha = Math.max(alpha, 0.3);
  graphSettled = false;
}
