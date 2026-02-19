// ══════════════════════════════════════════════════════
// Main — Init + animation loop + canvas events
// ══════════════════════════════════════════════════════

function graphTick() {
  if (currentLevel !== 'galaxy') return;
  simulate();
  renderGraph();
  updateParticles();
  renderParticles();
  if (!graphSettled || dragNode || hoveredNode) requestAnimationFrame(graphTick);
}

function setupCanvasEvents() {
  graphCanvas.addEventListener('mousedown', e => {
    const rect = graphCanvas.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    const node = hitTest(sx, sy);
    if (node && e.button === 0) {
      dragNode = node;
      node.fx = node.x; node.fy = node.y;
      isDragging = false;
      alpha = Math.max(alpha, 0.3);
      graphSettled = false;
      graphCanvas.classList.add('dragging');
      requestAnimationFrame(graphTick);
    } else if (e.button === 0) {
      isPanning = true;
      graphCanvas.classList.add('dragging');
    }
    lastMouse = { x: e.clientX, y: e.clientY };
  });

  graphCanvas.addEventListener('mousemove', e => {
    const rect = graphCanvas.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    if (dragNode) {
      const dx = e.clientX - lastMouse.x, dy = e.clientY - lastMouse.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) isDragging = true;
      const { x, y } = screenToGraph(sx, sy);
      dragNode.fx = x; dragNode.fy = y;
      dragNode.x = x; dragNode.y = y;
    } else if (isPanning) {
      panX += e.clientX - lastMouse.x;
      panY += e.clientY - lastMouse.y;
      renderGraph();
    } else {
      const node = hitTest(sx, sy);
      if (node !== hoveredNode) {
        hoveredNode = node;
        graphCanvas.style.cursor = node ? 'pointer' : 'grab';
        if (!graphSettled || hoveredNode) {
          graphSettled = false;
          requestAnimationFrame(graphTick);
        }
      }
    }
    lastMouse = { x: e.clientX, y: e.clientY };
  });

  graphCanvas.addEventListener('mouseup', e => {
    graphCanvas.classList.remove('dragging');
    if (dragNode && !isDragging) {
      dragNode.fx = null; dragNode.fy = null;
      enterDomain(dragNode.id);
    } else if (dragNode) {
      dragNode.fx = null; dragNode.fy = null;
      alpha = Math.max(alpha, 0.1);
      graphSettled = false;
      requestAnimationFrame(graphTick);
    }
    dragNode = null; isPanning = false;
  });

  graphCanvas.addEventListener('mouseleave', () => {
    if (hoveredNode) { hoveredNode = null; renderGraph(); }
    isPanning = false;
    graphCanvas.classList.remove('dragging');
    if (dragNode) { dragNode.fx = null; dragNode.fy = null; dragNode = null; }
  });

  graphCanvas.addEventListener('wheel', e => {
    e.preventDefault();
    const rect = graphCanvas.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    const oldZoom = zoom;
    zoom *= e.deltaY < 0 ? 1.1 : 0.9;
    zoom = Math.max(0.3, Math.min(3, zoom));
    panX = sx - (sx - panX) * (zoom / oldZoom);
    panY = sy - (sy - panY) * (zoom / oldZoom);
    renderGraph();
  }, { passive: false });

  window.addEventListener('resize', () => {
    resizeGraphCanvas();
    resizeStarfield();
    resizeParticleCanvas();
    renderGraph();
  });
}

function setupKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !document.getElementById('search-overlay').classList.contains('open') && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && !document.getElementById('search-overlay').classList.contains('open')) {
      goBack();
    }
  });
}

function buildStats() {
  const domains = Object.keys(NPSP).length;
  let components = 0, connections = 0, classes = 0;
  for (const p of Object.values(NPSP)) {
    components += p.components.length;
    connections += p.connections.length;
  }
  for (const w of Object.values(CODEBASE_WEIGHT)) classes += w;
  document.getElementById('statDomains').textContent = domains;
  document.getElementById('statComponents').textContent = components;
  document.getElementById('statConnections').textContent = connections;
  document.getElementById('statClasses').textContent = classes;
}

// ── Init ──
function init() {
  initStarfield();
  initGraph();
  initParticles();
  setupCanvasEvents();
  initSearch();
  setupKeyboard();
  updateBreadcrumb();
  buildStats();
  requestAnimationFrame(graphTick);
}

document.addEventListener('DOMContentLoaded', init);
