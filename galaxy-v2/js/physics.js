// ══════════════════════════════════════════════════════
// Force-Directed Graph Physics Engine
// ══════════════════════════════════════════════════════

// State
let nodes = [], edges = [], nodeMap = {};
let graphCanvas, graphCtx, canvasW, canvasH;
let zoom = 1, panX = 0, panY = 0;
let dragNode = null, hoveredNode = null;
let isDragging = false, isPanning = false;
let lastMouse = { x: 0, y: 0 };
let alpha = 1.0, graphSettled = false;

// Node sizing
const CODEBASE_WEIGHT = {
  recurring: 89, rollups: 76, bdi: 66, settings: 64, donations: 50, batch: 45,
  contacts: 39, allocations: 28, errors: 22, addresses: 20, giftentry: 19,
  elevate: 14, engagement: 12, softcredits: 8, relationships: 6, levels: 6,
  tdtm: 15, affiliations: 4
};
const FOUNDATIONAL = { tdtm: 2.5, settings: 1.3, errors: 1.2 };

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
  return 28 + ((raw - mn) / (mx - mn)) * 24;
}

function initGraph() {
  graphCanvas = document.getElementById('graph-canvas');
  graphCtx = graphCanvas.getContext('2d');
  resizeGraphCanvas();

  const keys = Object.keys(NPSP);
  const cx = canvasW / 2, cy = canvasH / 2;

  nodes = keys.map((key, i) => {
    const angle = (i / keys.length) * Math.PI * 2;
    const spread = Math.min(canvasW, canvasH) * 0.3;
    return {
      id: key,
      label: NPSP[key].name,
      icon: NPSP[key].icon,
      color: NPSP[key].color,
      radius: calcRadius(key),
      x: cx + Math.cos(angle) * spread + (Math.random() - 0.5) * 60,
      y: cy + Math.sin(angle) * spread + (Math.random() - 0.5) * 60,
      vx: 0, vy: 0, fx: null, fy: null,
      pulsePhase: Math.random() * Math.PI * 2
    };
  });

  nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);

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
  alpha *= 0.99;

  // N-body repulsion
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      let dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const minDist = a.radius + b.radius + 80;
      const force = (minDist * minDist) / (dist * dist) * 1.5 * alpha;
      const fx = (dx / dist) * force, fy = (dy / dist) * force;
      a.vx -= fx; a.vy -= fy;
      b.vx += fx; b.vy += fy;
    }
  }

  // Spring attraction (edges)
  for (const e of edges) {
    const s = nodeMap[e.source], t = nodeMap[e.target];
    if (!s || !t) continue;
    let dx = t.x - s.x, dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = (dist - 180) * 0.04 * alpha;
    const fx = (dx / dist) * force, fy = (dy / dist) * force;
    s.vx += fx; s.vy += fy;
    t.vx -= fx; t.vy -= fy;
  }

  // Centering gravity
  const cx = canvasW / 2, cy = canvasH / 2;
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

    // Boundary clamping
    n.x = Math.max(n.radius + 10, Math.min(canvasW - n.radius - 10, n.x));
    n.y = Math.max(n.radius + 10, Math.min(canvasH - n.radius - 10, n.y));
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
    if (dx * dx + dy * dy < n.radius * n.radius * 1.3) return n;
  }
  return null;
}
