// ══════════════════════════════════════════════════════════════
//  RENDERER — Canvas rendering for galaxy graph
//  Radial gradient orbs, bezier edges, glow, labels
// ══════════════════════════════════════════════════════════════

import { hexToRgba, lightenColor, darkenColor } from './utils.js';
import {
  nodes, edges, nodeMap, graphCtx, canvasW, canvasH,
  zoom, panX, panY, hoveredNode
} from './physics.js';
import {
  tourFocusNode, tourHighlightedEdges, tourStopPlanets,
  focusedPlanetIndex, prefersReducedMotion
} from './state.js';
import { getCanvasIcon } from './icons.js';

const _light = () => document.body.classList.contains('theme-light');

let entranceStart = 0;

export function initRenderer() {
  entranceStart = performance.now();
}

// Compute bezier control point for an edge
function edgeBezier(s, t) {
  const mx = (s.x + t.x) / 2;
  const my = (s.y + t.y) / 2;
  const dx = t.x - s.x;
  const dy = t.y - s.y;
  return { mx: mx + (-dy * 0.1), my: my + (dx * 0.1) };
}

// ── Fly-in state (set by navigation during cinematic zoom) ──
let flyInTarget = null;     // node id being flown into (null = normal render)
let flyInProgress = 0;      // 0-1 animation progress

export function setFlyInState(target, progress) {
  flyInTarget = target;
  flyInProgress = progress;
}

export function renderGraph() {
  const now = performance.now();
  const elapsed = now - entranceStart;
  const ctx = graphCtx;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.save();
  ctx.translate(panX, panY);
  ctx.scale(zoom, zoom);

  // ── Edges ──
  for (const e of edges) {
    const s = nodeMap[e.source], t = nodeMap[e.target];
    if (!s || !t) continue;

    // Entrance fade for edges
    const edgeAlpha = Math.min(1, Math.max(0, (elapsed - 400) / 600));
    if (edgeAlpha <= 0) continue;

    // Fly-in fade: edges fade out during cinematic zoom
    let flyFade = 1;
    if (flyInTarget) {
      const connected = e.source === flyInTarget || e.target === flyInTarget;
      flyFade = connected
        ? Math.max(0, 1 - flyInProgress * 1.5)   // connected edges fade slower
        : Math.max(0, 1 - flyInProgress * 2.5);   // unrelated edges fade fast
    }
    if (flyFade <= 0) continue;

    const isHL = hoveredNode && (e.source === hoveredNode.id || e.target === hoveredNode.id);
    const edgeKey = [e.source, e.target].sort().join('--');
    const isTourEdge = tourHighlightedEdges && tourHighlightedEdges.has(edgeKey);
    const { mx, my } = edgeBezier(s, t);

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.quadraticCurveTo(mx, my, t.x, t.y);

    if (isTourEdge) {
      const tourColor = nodeMap[tourFocusNode] ? nodeMap[tourFocusNode].color : '#88bbff';
      ctx.globalAlpha = 0.8 * edgeAlpha * flyFade;
      ctx.strokeStyle = tourColor;
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.shadowColor = tourColor;
      ctx.shadowBlur = 12;
    } else if (tourHighlightedEdges) {
      ctx.globalAlpha = 0.04 * edgeAlpha * flyFade;
      ctx.strokeStyle = _light() ? 'rgba(1,118,211,0.15)' : 'rgba(100,140,255,0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 5]);
    } else if (hoveredNode) {
      ctx.globalAlpha = (isHL ? 0.6 : 0.04) * edgeAlpha * flyFade;
      ctx.strokeStyle = isHL ? (_light() ? '#0176d3' : '#88bbff') : (_light() ? 'rgba(1,118,211,0.15)' : 'rgba(100,140,255,0.2)');
      ctx.lineWidth = isHL ? 2 : 1;
      ctx.setLineDash([6, 5]);
    } else {
      ctx.globalAlpha = 0.45 * edgeAlpha * flyFade;
      ctx.strokeStyle = _light() ? 'rgba(1,118,211,0.4)' : 'rgba(100,140,255,0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // Edge label on hover
    if (isHL && zoom > 0.6) {
      const perpX = -(t.y - s.y) * 0.1;
      const perpY = (t.x - s.x) * 0.1;
      ctx.font = '9px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = _light() ? '#444444' : '#64748b';
      ctx.textAlign = 'center';
      const lbl = e.label.length > 40 ? e.label.substring(0, 40) + '...' : e.label;
      ctx.fillText(lbl, mx + perpX * 0.4, my + perpY * 0.4 - 5);
    }
  }

  // ── Pre-compute per-node rendering values ──
  const nodeRender = [];
  for (const n of nodes) {
    const nodeElapsed = elapsed - n.entranceDelay;
    if (nodeElapsed < 0) continue;
    n.entranceAlpha = Math.min(1, nodeElapsed / 400);
    const entranceScale = 0.5 + n.entranceAlpha * 0.5;

    const isH = hoveredNode && hoveredNode.id === n.id;
    const sc = (isH ? 1.1 : 1) * entranceScale;

    // Breathing oscillation (delta-time based, two frequencies for organic feel)
    const breathe = prefersReducedMotion ? 1.0
      : Math.sin(now * 0.001 + n.breathPhase) * 0.03 + 1.0;
    const r = n.radius * sc * breathe;

    const dimFactor = tourFocusNode
      ? (tourStopPlanets && tourStopPlanets.has(n.id) ? 1 : 0.15)
      : (hoveredNode && !isH ? 0.3 : 1);

    // Fly-in fade: non-target nodes fade out during cinematic zoom
    let flyFade = 1;
    if (flyInTarget) {
      flyFade = n.id === flyInTarget ? 1 : Math.max(0, 1 - flyInProgress * 2);
    }

    // Glow opacity with breathing (separate frequency from radius breathing)
    const glowBreath = prefersReducedMotion ? 1.0
      : 0.9 + Math.sin(now * 0.0008 + n.breathPhase) * 0.1;

    nodeRender.push({ n, isH, r, dimFactor, flyFade, glowBreath });
  }

  // ── Nodes Pass 1: Glow layers (additive blending) ──
  ctx.globalCompositeOperation = 'lighter';
  for (const { n, isH, r, dimFactor, flyFade, glowBreath } of nodeRender) {
    const alpha = n.entranceAlpha * dimFactor * flyFade * glowBreath;
    if (alpha <= 0) continue;

    // Outer halo (atmospheric glow)
    const outerR = (isH ? 3.5 : 2.5) * r;
    const outerAlpha = (isH ? 0.12 : 0.08) * alpha;
    const outerGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, outerR);
    outerGrad.addColorStop(0, hexToRgba(n.color, outerAlpha));
    outerGrad.addColorStop(1, hexToRgba(n.color, 0));
    ctx.beginPath();
    ctx.arc(n.x, n.y, outerR, 0, Math.PI * 2);
    ctx.fillStyle = outerGrad;
    ctx.fill();

    // Mid glow (concentrated light)
    const midR = 1.6 * r;
    const midAlpha = (isH ? 0.25 : 0.15) * alpha;
    const midGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, midR);
    midGrad.addColorStop(0, hexToRgba(n.color, midAlpha));
    midGrad.addColorStop(1, hexToRgba(n.color, 0));
    ctx.beginPath();
    ctx.arc(n.x, n.y, midR, 0, Math.PI * 2);
    ctx.fillStyle = midGrad;
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';

  // ── Nodes Pass 2: Core orbs, icons, labels (normal blending) ──
  for (const { n, isH, r, dimFactor, flyFade } of nodeRender) {
    const combinedAlpha = n.entranceAlpha * dimFactor * flyFade;
    if (combinedAlpha <= 0) continue;

    // Radial gradient orb (no shadowBlur — glow handled by pass 1)
    const grad = ctx.createRadialGradient(
      n.x - r * 0.15, n.y - r * 0.15, 0,
      n.x, n.y, r
    );
    grad.addColorStop(0, lightenColor(n.color, 40));
    grad.addColorStop(0.5, n.color);
    grad.addColorStop(1, darkenColor(n.color, 30));

    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.globalAlpha = combinedAlpha;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Ring outline
    ctx.strokeStyle = _light()
      ? `rgba(1,118,211,${(isH ? 0.5 : 0.2) * combinedAlpha})`
      : `rgba(180,200,255,${(isH ? 0.5 : 0.15) * combinedAlpha})`;
    ctx.lineWidth = isH ? 2 : 1;
    ctx.stroke();

    // SVG icon
    const iconImg = getCanvasIcon(n.id);
    if (iconImg) {
      const iconSize = r * 1.0;
      ctx.globalAlpha = combinedAlpha;
      ctx.drawImage(iconImg, n.x - iconSize / 2, n.y - iconSize / 2, iconSize, iconSize);
      ctx.globalAlpha = 1;
    } else {
      ctx.font = Math.round(r * 0.6) + "px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = combinedAlpha;
      ctx.fillText(n.icon, n.x, n.y);
      ctx.globalAlpha = 1;
    }

    // Label
    const labelAlpha = n.entranceAlpha * flyFade * (tourFocusNode
      ? (tourStopPlanets && tourStopPlanets.has(n.id) ? 0.9 : 0.1)
      : (hoveredNode && !isH ? 0.2 : 0.9));
    if (labelAlpha > 0) {
      const labelSize = Math.min(canvasW, canvasH) < 600 ? 9 : 10;
      ctx.font = `600 ${labelSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = isH ? (_light() ? '#181818' : '#e2e8f0') : (_light() ? '#444444' : '#94a3b8');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.globalAlpha = labelAlpha;
      ctx.fillText(n.label.toUpperCase(), n.x, n.y + r + 8);
      ctx.globalAlpha = 1;
    }

    // Class count subtitle on hover
    if (isH && flyFade > 0.5) {
      ctx.font = '9px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = _light() ? '#444444' : '#64748b';
      ctx.fillText(`${n.classCount} classes`, n.x, n.y + r + 22);
    }
  }

  // ── Keyboard focus ring (keeps shadowBlur — only one node, acceptable cost) ──
  if (focusedPlanetIndex >= 0) {
    const sorted = [...nodes].sort((a, b) => a.x - b.x);
    const focusedNode = sorted[focusedPlanetIndex];
    if (focusedNode) {
      const fr = focusedNode.radius + 8;
      const pulseAlpha = prefersReducedMotion ? 0.7 : 0.6 + Math.sin(now * 0.0024) * 0.2;
      ctx.save();
      ctx.strokeStyle = focusedNode.color || '#4d8bff';
      ctx.lineWidth = 3;
      ctx.shadowColor = focusedNode.color || '#4d8bff';
      ctx.shadowBlur = 15;
      ctx.globalAlpha = pulseAlpha;
      ctx.beginPath();
      ctx.arc(focusedNode.x, focusedNode.y, fr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 25;
      ctx.globalAlpha = pulseAlpha * 0.5;
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.restore();
  ctx.restore();
}
