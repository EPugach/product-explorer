// ══════════════════════════════════════════════════════════════
//  PARTICLES — Connection flow particles + ambient nebula
// ══════════════════════════════════════════════════════════════

import { hexToRgba } from './utils.js';
import { edges, nodeMap, zoom, panX, panY, hoveredNode } from './physics.js';
import { prefersReducedMotion } from './state.js';

let particleCanvas, particleCtx;
let connectionParticles = [];
let nebulaBlobs = [];
let particlesVisible = true;
const CONNECTION_PARTICLE_COUNT = 3; // per edge
const NEBULA_BLOB_COUNT = 5;

export function initParticles() {
  particleCanvas = document.getElementById('particle-canvas');
  particleCtx = particleCanvas.getContext('2d');
  resizeParticleCanvas();
  initConnectionParticles();
  initNebulaBlobs();
}

export function resizeParticleCanvas() {
  particleCanvas.width = innerWidth * devicePixelRatio;
  particleCanvas.height = innerHeight * devicePixelRatio;
  particleCanvas.style.width = innerWidth + 'px';
  particleCanvas.style.height = innerHeight + 'px';
}

// ── Connection Particles ──
// Small luminous dots traveling along edge bezier paths
function initConnectionParticles() {
  connectionParticles = [];
  for (const e of edges) {
    for (let i = 0; i < CONNECTION_PARTICLE_COUNT; i++) {
      connectionParticles.push({
        edge: e,
        t: Math.random(), // position along path 0..1
        speed: 0.001 + Math.random() * 0.0015,
        size: 1 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.4,
        direction: Math.random() < 0.5 ? 1 : -1
      });
    }
  }
}

function updateConnectionParticles() {
  for (const p of connectionParticles) {
    p.t += p.speed * p.direction;
    if (p.t > 1) { p.t -= 1; }
    if (p.t < 0) { p.t += 1; }
  }
}

function renderConnectionParticles() {
  const ctx = particleCtx;
  const hoverDim = hoveredNode ? 0.3 : 1.0;

  for (const p of connectionParticles) {
    const s = nodeMap[p.edge.source];
    const t = nodeMap[p.edge.target];
    if (!s || !t) continue;

    // Quadratic bezier point at t
    const mx = (s.x + t.x) / 2 + (-(t.y - s.y)) * 0.1;
    const my = (s.y + t.y) / 2 + ((t.x - s.x)) * 0.1;

    const tt = p.t;
    const mt = 1 - tt;
    const x = mt * mt * s.x + 2 * mt * tt * mx + tt * tt * t.x;
    const y = mt * mt * s.y + 2 * mt * tt * my + tt * tt * t.y;

    // Brighten if related to hovered node
    let alpha = p.opacity * hoverDim;
    if (hoveredNode && (p.edge.source === hoveredNode.id || p.edge.target === hoveredNode.id)) {
      alpha = p.opacity * 1.5;
    }

    // Transform to screen coords
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

// ── Nebula Blobs ──
// Large, soft, slow-moving colored washes creating depth
export function initNebulaBlobs() {
  nebulaBlobs = [];
  const colors = document.body.classList.contains('theme-light')
    ? ['#d8edff', '#cce4ff', '#b0d5f7', '#e0e0e0', '#d4e3f5']
    : ['#1e3a8a', '#312e81', '#0c4a6e', '#1e1b4b', '#0f172a'];
  for (let i = 0; i < NEBULA_BLOB_COUNT; i++) {
    nebulaBlobs.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: 200 + Math.random() * 300,
      color: colors[i % colors.length],
      opacity: 0.03 + Math.random() * 0.03,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      phase: Math.random() * Math.PI * 2,
      breathSpeed: 0.003 + Math.random() * 0.005
    });
  }
}

function updateNebulaBlobs() {
  for (const b of nebulaBlobs) {
    b.x += b.vx;
    b.y += b.vy;
    b.phase += b.breathSpeed;

    // Wrap around edges
    if (b.x < -b.radius) b.x = innerWidth + b.radius;
    if (b.x > innerWidth + b.radius) b.x = -b.radius;
    if (b.y < -b.radius) b.y = innerHeight + b.radius;
    if (b.y > innerHeight + b.radius) b.y = -b.radius;
  }
}

function renderNebulaBlobs() {
  const ctx = particleCtx;

  for (const b of nebulaBlobs) {
    const breathScale = 1 + Math.sin(b.phase) * 0.15;
    const r = b.radius * breathScale;

    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
    grad.addColorStop(0, hexToRgba(b.color, b.opacity));
    grad.addColorStop(1, hexToRgba(b.color, 0));

    ctx.beginPath();
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

// ── Combined update + render ──
export function updateParticles() {
  if (!particlesVisible || prefersReducedMotion) return;
  updateConnectionParticles();
  updateNebulaBlobs();
}

export function renderParticles() {
  particleCtx.save();
  particleCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  particleCtx.clearRect(0, 0, innerWidth, innerHeight);

  if (!particlesVisible) { particleCtx.restore(); return; }

  // Nebula behind everything (static blobs still render for ambiance)
  renderNebulaBlobs();

  // Connection particles skipped in reduced motion
  if (!prefersReducedMotion) {
    renderConnectionParticles();
  }

  particleCtx.restore();
}

export function showParticles() { particlesVisible = true; }
export function hideParticles() { particlesVisible = false; }
