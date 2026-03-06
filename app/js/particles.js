// ══════════════════════════════════════════════════════════════
//  PARTICLES — Directional connection flow along edge bezier paths
//  Single canvas, single rAF loop (driven by main.js particleTick).
//  Renders behind DOM planets (z-index 1 vs z-index 3).
// ══════════════════════════════════════════════════════════════

import { hexToRgba } from './utils.js';
import { edges, nodeMap, zoom, panX, panY } from './physics.js';
import { prefersReducedMotion } from './state.js';

// Hover state set by main.js when a planet is hovered
let hoveredNode = null;
export const setHoveredNode = (node) => { hoveredNode = node; };

let particleCanvas, particleCtx;
let connectionParticles = [];
let particlesVisible = true;
const CONNECTION_PARTICLE_COUNT = 3; // per edge

export function initParticles() {
  particleCanvas = document.getElementById('particle-canvas');
  particleCtx = particleCanvas.getContext('2d');
  resizeParticleCanvas();
  initConnectionParticles();
}

export function resizeParticleCanvas() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  particleCanvas.width = innerWidth * dpr;
  particleCanvas.height = innerHeight * dpr;
  particleCanvas.style.width = innerWidth + 'px';
  particleCanvas.style.height = innerHeight + 'px';
}

// ── Connection Particles ──
// Small luminous dots traveling along edge bezier paths, source -> target
function initConnectionParticles() {
  connectionParticles = [];
  for (const e of edges) {
    for (let i = 0; i < CONNECTION_PARTICLE_COUNT; i++) {
      connectionParticles.push({
        edge: e,
        t: Math.random(),               // position along path 0..1 (source..target)
        speed: 0.001 + Math.random() * 0.0015,
        size: 1 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.4
      });
    }
  }
}

function updateConnectionParticles() {
  for (const p of connectionParticles) {
    p.t += p.speed;
    if (p.t > 1) { p.t -= 1; }         // wrap: directional source -> target
  }
}

// Quadratic bezier control point — same math as galaxy-renderer.js edgeBezier()
function edgeBezier(s, t) {
  const mx = (s.x + t.x) / 2 + (-(t.y - s.y) * 0.1);
  const my = (s.y + t.y) / 2 + ((t.x - s.x) * 0.1);
  return { mx, my };
}

function renderConnectionParticles() {
  const ctx = particleCtx;
  const hoverDim = hoveredNode ? 0.3 : 1.0;

  for (const p of connectionParticles) {
    const s = nodeMap[p.edge.source];
    const t = nodeMap[p.edge.target];
    if (!s || !t) continue;

    // Quadratic bezier point at parametric t
    const { mx, my } = edgeBezier(s, t);
    const tt = p.t;
    const mt = 1 - tt;
    const x = mt * mt * s.x + 2 * mt * tt * mx + tt * tt * t.x;
    const y = mt * mt * s.y + 2 * mt * tt * my + tt * tt * t.y;

    // Hover: brighten connected edges (1.5x), dim others (0.3x)
    let alpha = p.opacity * hoverDim;
    if (hoveredNode && (p.edge.source === hoveredNode.id || p.edge.target === hoveredNode.id)) {
      alpha = p.opacity * 1.5;
    }

    // Transform to screen coords (particle canvas is NOT inside .galaxy-container)
    const sx = x * zoom + panX;
    const sy = y * zoom + panY;

    ctx.beginPath();
    ctx.arc(sx, sy, p.size * zoom, 0, Math.PI * 2);

    // Use source node color
    const color = s.color || '#4d8bff';
    ctx.fillStyle = hexToRgba(color, alpha);
    ctx.fill();
  }
}

// ── Combined update + render ──
export function updateParticles() {
  if (!particlesVisible || prefersReducedMotion) return;
  updateConnectionParticles();
}

export function renderParticles() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  particleCtx.save();
  particleCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  particleCtx.clearRect(0, 0, innerWidth, innerHeight);

  if (!particlesVisible) { particleCtx.restore(); return; }

  // Connection particles skipped in reduced motion
  if (!prefersReducedMotion) {
    renderConnectionParticles();
  }

  particleCtx.restore();
}

export function showParticles() { particlesVisible = true; }
export function hideParticles() { particlesVisible = false; }
