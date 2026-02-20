// ══════════════════════════════════════════════════════════════
//  MAIN — Init, animation loop, canvas events, touch, tooltip
// ══════════════════════════════════════════════════════════════

// ── Tooltip ──
let tooltipEl = null;

function createTooltip() {
  tooltipEl = document.createElement('div');
  tooltipEl.className = 'planet-tooltip';
  tooltipEl.setAttribute('role', 'tooltip');
  document.body.appendChild(tooltipEl);
}

function showTooltip(node, sx, sy) {
  if (!tooltipEl) return;
  tooltipEl.innerHTML = '<div class="tt-name" style="color:' + node.color + '">' + node.icon + ' ' + node.label + '</div>' +
    '<div class="tt-desc">' + node.desc.substring(0, 120) + (node.desc.length > 120 ? '...' : '') + '</div>' +
    '<div class="tt-stats">' +
    '<span><span class="tt-stat-val">' + node.classCount + '</span> classes</span>' +
    '<span><span class="tt-stat-val">' + node.componentCount + '</span> components</span>' +
    '<span><span class="tt-stat-val">' + node.connectionCount + '</span> connections</span>' +
    '</div>';
  tooltipEl.classList.add('visible');
  // Position below and to the right of cursor
  const tx = Math.min(sx + 16, innerWidth - 300);
  const ty = Math.min(sy + 16, innerHeight - 120);
  tooltipEl.style.left = tx + 'px';
  tooltipEl.style.top = ty + 'px';
}

function hideTooltip() {
  if (tooltipEl) tooltipEl.classList.remove('visible');
}

// ── Animation Loops ──
// Graph physics loop (stops when settled)
function graphTick() {
  if (currentLevel !== 'galaxy') return;
  simulate();
  renderGraph();
  if (!graphSettled || dragNode || hoveredNode) {
    requestAnimationFrame(graphTick);
  }
}

// Particle loop (runs indefinitely on galaxy view)
function particleTick() {
  if (currentLevel !== 'galaxy') return;
  updateParticles();
  renderParticles();
  requestAnimationFrame(particleTick);
}

// ── Canvas Events (mouse) ──
function setupCanvasEvents() {
  graphCanvas.addEventListener('mousedown', function(e) {
    var rect = graphCanvas.getBoundingClientRect();
    var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    var node = hitTest(sx, sy);
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

  graphCanvas.addEventListener('mousemove', function(e) {
    var rect = graphCanvas.getBoundingClientRect();
    var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    if (dragNode) {
      var dx = e.clientX - lastMouse.x, dy = e.clientY - lastMouse.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) isDragging = true;
      var pt = screenToGraph(sx, sy);
      dragNode.fx = pt.x; dragNode.fy = pt.y;
      dragNode.x = pt.x; dragNode.y = pt.y;
      hideTooltip();
    } else if (isPanning) {
      panX += e.clientX - lastMouse.x;
      panY += e.clientY - lastMouse.y;
      renderGraph();
      hideTooltip();
    } else {
      var node = hitTest(sx, sy);
      if (node !== hoveredNode) {
        hoveredNode = node;
        graphCanvas.style.cursor = node ? 'pointer' : 'grab';
        if (node) {
          showTooltip(node, e.clientX, e.clientY);
        } else {
          hideTooltip();
        }
        if (!graphSettled || hoveredNode) {
          graphSettled = false;
          requestAnimationFrame(graphTick);
        }
      } else if (node) {
        // Update tooltip position while moving over same node
        showTooltip(node, e.clientX, e.clientY);
      }
    }
    lastMouse = { x: e.clientX, y: e.clientY };
  });

  graphCanvas.addEventListener('mouseup', function() {
    graphCanvas.classList.remove('dragging');
    if (dragNode && !isDragging) {
      dragNode.fx = null; dragNode.fy = null;
      enterPlanet(dragNode.id);
    } else if (dragNode) {
      dragNode.fx = null; dragNode.fy = null;
      alpha = Math.max(alpha, 0.1);
      graphSettled = false;
      requestAnimationFrame(graphTick);
    }
    dragNode = null; isPanning = false;
  });

  graphCanvas.addEventListener('mouseleave', function() {
    if (hoveredNode) { hoveredNode = null; renderGraph(); }
    hideTooltip();
    isPanning = false;
    graphCanvas.classList.remove('dragging');
    if (dragNode) { dragNode.fx = null; dragNode.fy = null; dragNode = null; }
  });

  // Scroll to zoom
  graphCanvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    var rect = graphCanvas.getBoundingClientRect();
    var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    var oldZoom = zoom;
    zoom *= e.deltaY < 0 ? 1.1 : 0.9;
    zoom = Math.max(0.3, Math.min(3, zoom));
    panX = sx - (sx - panX) * (zoom / oldZoom);
    panY = sy - (sy - panY) * (zoom / oldZoom);
    renderGraph();
    renderParticles();
  }, { passive: false });

  // ── Touch events ──
  var touchStartNode = null;
  var touchStartTime = 0;
  var touchStartPos = { x: 0, y: 0 };
  var lastTouchDist = 0;

  graphCanvas.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      var touch = e.touches[0];
      var rect = graphCanvas.getBoundingClientRect();
      var sx = touch.clientX - rect.left, sy = touch.clientY - rect.top;
      touchStartNode = hitTest(sx, sy);
      touchStartTime = Date.now();
      touchStartPos = { x: touch.clientX, y: touch.clientY };
      if (touchStartNode) {
        e.preventDefault();
      }
      lastMouse = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2) {
      // Pinch start
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist = Math.sqrt(dx * dx + dy * dy);
    }
  }, { passive: false });

  graphCanvas.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1) {
      var touch = e.touches[0];
      var dx = touch.clientX - touchStartPos.x;
      var dy = touch.clientY - touchStartPos.y;
      if (Math.abs(dx) + Math.abs(dy) > 10) {
        touchStartNode = null; // Cancel tap
        // Pan
        panX += touch.clientX - lastMouse.x;
        panY += touch.clientY - lastMouse.y;
        renderGraph();
        renderParticles();
      }
      lastMouse = { x: touch.clientX, y: touch.clientY };
      e.preventDefault();
    } else if (e.touches.length === 2) {
      // Pinch zoom
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (lastTouchDist > 0) {
        var scale = dist / lastTouchDist;
        var cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        var cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        var oldZoom = zoom;
        zoom *= scale;
        zoom = Math.max(0.3, Math.min(3, zoom));
        panX = cx - (cx - panX) * (zoom / oldZoom);
        panY = cy - (cy - panY) * (zoom / oldZoom);
        renderGraph();
        renderParticles();
      }
      lastTouchDist = dist;
      e.preventDefault();
    }
  }, { passive: false });

  graphCanvas.addEventListener('touchend', function(e) {
    if (touchStartNode && Date.now() - touchStartTime < 300) {
      enterPlanet(touchStartNode.id);
    }
    touchStartNode = null;
    lastTouchDist = 0;
  });
}

// ── Keyboard Shortcuts ──
function setupKeyboard() {
  // Search input handler
  document.getElementById('searchInput').addEventListener('input', function() {
    var q = this.value;
    searchResults = searchNPSP(q);
    searchIndex = searchResults.length > 0 ? 0 : -1;
    renderSearchResults(searchResults, q);
    var nav = document.getElementById('searchNav');
    if (searchResults.length > 0) {
      nav.style.display = 'flex';
      document.getElementById('searchCount').textContent = (searchIndex + 1) + '/' + searchResults.length;
    } else {
      nav.style.display = 'none';
    }
  });

  // Search keyboard navigation
  document.getElementById('searchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) cycleResult(-1);
      else if (searchResults.length > 0 && searchIndex >= 0) activateResult(searchIndex);
      else cycleResult(1);
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); cycleResult(1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); cycleResult(-1); }
    if (e.key === 'Escape') { closeSearch(); }
  });

  // Click outside search to close
  document.getElementById('search-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeSearch();
  });

  // Global shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && !document.getElementById('search-overlay').classList.contains('open') &&
        document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && !document.getElementById('search-overlay').classList.contains('open')) {
      goBack();
    }
  });

  // Breadcrumb keyboard support
  document.getElementById('breadcrumb').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('crumb')) {
      e.target.click();
    }
  });
}

// ── Build Stats ──
function buildStats() {
  // Canonical NPSP codebase numbers from architecture reference
  document.getElementById('statClasses').textContent = '843';
  document.getElementById('statTriggers').textContent = '26';
  document.getElementById('statObjects').textContent = '65';
  document.getElementById('statDomains').textContent = '18';
  document.getElementById('statComponents').textContent = '55';
}

// ── Resize Handler ──
function onResize() {
  onGraphResize();
  resizeStarfield();
  resizeParticleCanvas();
  renderGraph();
  renderParticles();
}

// ── Init ──
function init() {
  createTooltip();
  initStarfield();
  initGraph();
  initRenderer();
  initParticles();
  setupCanvasEvents();
  setupKeyboard();
  updateBreadcrumb();
  buildStats();
  window.addEventListener('resize', onResize);
  requestAnimationFrame(graphTick);
  requestAnimationFrame(particleTick);
}

document.addEventListener('DOMContentLoaded', init);
