// ══════════════════════════════════════════════════════
// Galaxy-Styled Graph Renderer
// ══════════════════════════════════════════════════════

let renderFrame = 0;

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

function renderGraph() {
  renderFrame++;
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
    const isHL = hoveredNode && (e.source === hoveredNode.id || e.target === hoveredNode.id);

    const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
    const dx = t.x - s.x, dy = t.y - s.y;
    const perpX = -dy * 0.1, perpY = dx * 0.1;

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.quadraticCurveTo(mx + perpX, my + perpY, t.x, t.y);

    if (hoveredNode) {
      ctx.globalAlpha = isHL ? 0.7 : 0.06;
      ctx.strokeStyle = isHL ? '#88bbff' : 'rgba(100,140,255,0.25)';
      ctx.lineWidth = isHL ? 2 : 1;
    } else {
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = 'rgba(100,140,255,0.25)';
      ctx.lineWidth = 1.2;
    }
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Edge label on hover + zoom
    if (isHL && zoom > 0.5) {
      ctx.font = '9px "SF Mono", "Fira Code", monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      const lbl = e.label.length > 35 ? e.label.substring(0, 35) + '...' : e.label;
      ctx.fillText(lbl, mx + perpX * 0.5, my + perpY * 0.5 - 4);
    }
  }

  // ── Nodes ──
  for (const n of nodes) {
    const isH = hoveredNode && hoveredNode.id === n.id;
    const sc = isH ? 1.12 : 1;
    const r = n.radius * sc;

    // Pulse glow
    const pulse = Math.sin(renderFrame * 0.02 + n.pulsePhase) * 0.3 + 0.7;

    // Glow shadow
    ctx.shadowColor = n.color;
    ctx.shadowBlur = (isH ? 28 : 18) * pulse;

    // Radial gradient orb
    const grad = ctx.createRadialGradient(
      n.x - r * 0.15, n.y - r * 0.15, 0,
      n.x, n.y, r
    );
    grad.addColorStop(0, lightenColor(n.color, 35));
    grad.addColorStop(0.5, n.color);
    grad.addColorStop(1, darkenColor(n.color, 25));

    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    if (hoveredNode && !isH) ctx.globalAlpha = 0.35;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Ring outline
    ctx.strokeStyle = `rgba(180,200,255,${isH ? 0.5 : 0.2})`;
    ctx.lineWidth = isH ? 2 : 1.5;
    ctx.stroke();

    // Emoji icon
    ctx.font = Math.round(r * 0.65) + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (hoveredNode && !isH) ctx.globalAlpha = 0.35;
    ctx.fillText(n.icon, n.x, n.y);
    ctx.globalAlpha = 1;

    // Label
    ctx.font = '600 10px "SF Mono", "Fira Code", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    if (hoveredNode && !isH) ctx.globalAlpha = 0.25;
    ctx.fillText(n.label.toUpperCase(), n.x, n.y + r + 8);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
  ctx.restore();
}
