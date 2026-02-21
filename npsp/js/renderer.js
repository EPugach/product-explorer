// ══════════════════════════════════════════════════════════════
//  RENDERER — Canvas rendering for galaxy graph
//  Radial gradient orbs, bezier edges, glow, labels
// ══════════════════════════════════════════════════════════════

var _light = function() { return document.body.classList.contains('theme-light'); };

let renderFrame = 0;
let entranceStart = 0;

function initRenderer() {
  entranceStart = performance.now();
}

function lightenColor(hex, pct) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, r + Math.round((255 - r) * pct / 100));
  g = Math.min(255, g + Math.round((255 - g) * pct / 100));
  b = Math.min(255, b + Math.round((255 - b) * pct / 100));
  return `rgb(${r},${g},${b})`;
}

function darkenColor(hex, pct) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, Math.round(r * (1 - pct / 100)));
  g = Math.max(0, Math.round(g * (1 - pct / 100)));
  b = Math.max(0, Math.round(b * (1 - pct / 100)));
  return `rgb(${r},${g},${b})`;
}

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Compute bezier control point for an edge
function edgeBezier(s, t) {
  const mx = (s.x + t.x) / 2;
  const my = (s.y + t.y) / 2;
  const dx = t.x - s.x;
  const dy = t.y - s.y;
  return { mx: mx + (-dy * 0.1), my: my + (dx * 0.1) };
}

function renderGraph() {
  renderFrame++;
  const elapsed = performance.now() - entranceStart;
  const ctx = graphCtx;

  ctx.save();
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
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

    const isHL = hoveredNode && (e.source === hoveredNode.id || e.target === hoveredNode.id);
    const edgeKey = [e.source, e.target].sort().join('--');
    const isTourEdge = tourHighlightedEdges && tourHighlightedEdges.has(edgeKey);
    const { mx, my } = edgeBezier(s, t);

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.quadraticCurveTo(mx, my, t.x, t.y);

    if (isTourEdge) {
      // Tour highlighted edge: solid, bright, thick
      var tourColor = nodeMap[tourFocusNode] ? nodeMap[tourFocusNode].color : '#88bbff';
      ctx.globalAlpha = 0.8 * edgeAlpha;
      ctx.strokeStyle = tourColor;
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.shadowColor = tourColor;
      ctx.shadowBlur = 12;
    } else if (tourHighlightedEdges) {
      // Tour is active but this edge is not highlighted: very dim
      ctx.globalAlpha = 0.04 * edgeAlpha;
      ctx.strokeStyle = _light() ? 'rgba(1,118,211,0.15)' : 'rgba(100,140,255,0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 5]);
    } else if (hoveredNode) {
      ctx.globalAlpha = (isHL ? 0.6 : 0.04) * edgeAlpha;
      ctx.strokeStyle = isHL ? (_light() ? '#0176d3' : '#88bbff') : (_light() ? 'rgba(1,118,211,0.15)' : 'rgba(100,140,255,0.2)');
      ctx.lineWidth = isHL ? 2 : 1;
      ctx.setLineDash([6, 5]);
    } else {
      ctx.globalAlpha = 0.25 * edgeAlpha;
      ctx.strokeStyle = _light() ? 'rgba(1,118,211,0.35)' : 'rgba(100,140,255,0.3)';
      ctx.lineWidth = 1;
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

  // ── Nodes ──
  for (const n of nodes) {
    // Staggered entrance animation
    const nodeElapsed = elapsed - n.entranceDelay;
    if (nodeElapsed < 0) continue;
    n.entranceAlpha = Math.min(1, nodeElapsed / 400);
    const entranceScale = 0.5 + n.entranceAlpha * 0.5;

    const isH = hoveredNode && hoveredNode.id === n.id;
    const sc = (isH ? 1.1 : 1) * entranceScale;
    const r = n.radius * sc;

    // Pulse glow
    const pulse = Math.sin(renderFrame * 0.015 + n.pulsePhase) * 0.25 + 0.75;

    // Glow shadow
    ctx.shadowColor = n.color;
    ctx.shadowBlur = (isH ? 30 : 16) * pulse;

    // Radial gradient orb
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
    const dimFactor = tourFocusNode
      ? (tourStopPlanets && tourStopPlanets.has(n.id) ? 1 : 0.15)
      : (hoveredNode && !isH ? 0.3 : 1);
    ctx.globalAlpha = n.entranceAlpha * dimFactor;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Ring outline
    ctx.strokeStyle = _light() ? `rgba(1,118,211,${(isH ? 0.5 : 0.2) * n.entranceAlpha})` : `rgba(180,200,255,${(isH ? 0.5 : 0.15) * n.entranceAlpha})`;
    ctx.lineWidth = isH ? 2 : 1;
    ctx.stroke();

    // Emoji icon
    ctx.font = Math.round(r * 0.6) + "px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = n.entranceAlpha * dimFactor;
    ctx.fillText(n.icon, n.x, n.y);
    ctx.globalAlpha = 1;

    // Label
    const labelSize = Math.min(canvasW, canvasH) < 600 ? 9 : 10;
    ctx.font = `600 ${labelSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillStyle = isH ? (_light() ? '#181818' : '#e2e8f0') : (_light() ? '#444444' : '#94a3b8');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.globalAlpha = n.entranceAlpha * (tourFocusNode
      ? (tourStopPlanets && tourStopPlanets.has(n.id) ? 0.9 : 0.1)
      : (hoveredNode && !isH ? 0.2 : 0.9));
    ctx.fillText(n.label.toUpperCase(), n.x, n.y + r + 8);
    ctx.globalAlpha = 1;

    // Class count subtitle on hover
    if (isH) {
      ctx.font = `9px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = _light() ? '#444444' : '#64748b';
      ctx.fillText(`${n.classCount} classes`, n.x, n.y + r + 22);
    }
  }

  ctx.restore();
  ctx.restore();
}
