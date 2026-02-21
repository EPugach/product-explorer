// ══════════════════════════════════════════════════════════════
//  MAIN — Init, animation loop, canvas events, touch, tooltip
// ══════════════════════════════════════════════════════════════

// ── Analytics helper ──
function track(event, params) {
  if (typeof gtag === 'function') gtag('event', event, params || {});
}

// ── Safe localStorage wrapper (Safari private browsing throws) ──
function safeLSGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function safeLSSet(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* silent */ } }

// ── Screen Reader Announcements ──
const announce = (text) => {
  const el = document.getElementById('sr-announcer');
  if (el) {
    el.textContent = '';
    void el.offsetHeight; // Force reflow so screen reader registers the change
    el.textContent = text;
  }
};

// ── Theme Toggle ──
function isLightMode() { return document.body.classList.contains('theme-light'); }

function toggleTheme() {
  document.body.classList.toggle('theme-light');
  var light = isLightMode();
  safeLSSet('npsp-theme', light ? 'light' : 'dark');
  document.getElementById('theme-toggle').textContent = light ? '\u2600' : '\u263D';
  initNebulaBlobs();
  renderGraph();
  renderParticles();
  showPresetIndicator(light ? 'Light' : 'Dark');
  track('theme_change', { theme: light ? 'light' : 'dark' });
}

// ── Merge generated entities into NPSP data ──
function mergeEntities() {
  if (typeof NPSP_ENTITIES === 'undefined') return;
  for (var domainKey in NPSP_ENTITIES) {
    if (!NPSP[domainKey]) continue;
    var entities = NPSP_ENTITIES[domainKey];
    // Attach domain-level entity counts
    NPSP[domainKey]._entities = entities;
    // Map entities to individual component groups by tag matching
    for (var ci = 0; ci < NPSP[domainKey].components.length; ci++) {
      var comp = NPSP[domainKey].components[ci];
      var tags = (comp.tags || []).map(function(t) { return t.toLowerCase(); });
      var tagSet = {};
      for (var ti = 0; ti < tags.length; ti++) tagSet[tags[ti]] = true;
      comp.entities = {
        classes: (entities.classes || []).filter(function(c) {
          return tagSet[c.name.toLowerCase()] || matchesByPrefix(c.name, comp.tags);
        }),
        objects: (entities.objects || []).filter(function(o) {
          return tagSet[o.name.toLowerCase()];
        }),
        triggers: (entities.triggers || []).filter(function(t) {
          return tagSet[t.object.toLowerCase()] || tagSet[t.name.toLowerCase()];
        }),
        lwcs: (entities.lwcs || []).filter(function(l) {
          return tagSet[l.name.toLowerCase()];
        }),
        metadata: (entities.metadata || []).filter(function(m) {
          return tagSet[m.name.toLowerCase()];
        })
      };
    }
  }
}

function matchesByPrefix(className, tags) {
  if (!tags) return false;
  var classPrefix = className.split('_')[0] + '_';
  for (var i = 0; i < tags.length; i++) {
    if (tags[i].startsWith(classPrefix)) return true;
  }
  return false;
}

// ── Keyboard Planet Focus (B7) ──
let focusedPlanetIndex = -1; // -1 means no planet focused

const getSortedPlanets = () => {
  return [...nodes].sort((a, b) => a.x - b.x);
};

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

// ── Page Visibility — pause all animation when tab is hidden ──
let pageHidden = false;

document.addEventListener('visibilitychange', () => {
  pageHidden = document.hidden;
  if (document.hidden) {
    if (typeof pauseStarfield === 'function') pauseStarfield();
  } else {
    // Resume starfield only if on galaxy view
    if (currentLevel === 'galaxy' && typeof resumeStarfield === 'function') {
      resumeStarfield();
    }
    // Restart graph + particle loops if on galaxy view
    if (currentLevel === 'galaxy') {
      graphSettled = false;
      requestAnimationFrame(graphTick);
      requestAnimationFrame(particleTick);
    }
  }
});

// ── Animation Loops ──
// Graph physics loop (stops when settled)
function graphTick() {
  if (pageHidden || currentLevel !== 'galaxy') return;
  simulate();
  applyOrbitalDrift();
  renderGraph();
  requestAnimationFrame(graphTick);
}

// Particle loop (runs indefinitely on galaxy view)
function particleTick() {
  if (pageHidden || currentLevel !== 'galaxy') return;
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
      var node = dragNode;
      dragNode.fx = null; dragNode.fy = null;
      dragNode = null; isPanning = false;
      hideTooltip();
      if (tourState && tourState.active) return; // Prevent click-through during tour
      enterPlanet(node.id);
      track('planet_click', { planet: node.id });
      return;
    } else if (dragNode) {
      track('planet_drag', { planet: dragNode.id });
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
      var node = touchStartNode;
      touchStartNode = null;
      lastTouchDist = 0;
      if (tourState && tourState.active) return; // Prevent click-through during tour
      enterPlanet(node.id);
      track('planet_click', { planet: node.id });
      return;
    }
    touchStartNode = null;
    lastTouchDist = 0;
  });

  // ── B7: Keyboard planet selection ──
  graphCanvas.addEventListener('keydown', (e) => {
    if (currentLevel !== 'galaxy') return;
    if (tourState && tourState.active) return;

    const sorted = getSortedPlanets();
    if (!sorted.length) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        focusedPlanetIndex = (focusedPlanetIndex + 1) % sorted.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        focusedPlanetIndex = (focusedPlanetIndex - 1 + sorted.length) % sorted.length;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedPlanetIndex >= 0) {
          const planet = sorted[focusedPlanetIndex];
          focusedPlanetIndex = -1;
          enterPlanet(planet.id);
          track('planet_click', { planet: planet.id, method: 'keyboard' });
        }
        return;
      case 'Escape':
        e.preventDefault();
        focusedPlanetIndex = -1;
        graphCanvas.blur();
        renderGraph();
        return;
      default:
        return;
    }

    // Announce the focused planet
    if (focusedPlanetIndex >= 0) {
      const planet = sorted[focusedPlanetIndex];
      const desc = NPSP[planet.id] ? NPSP[planet.id].description.substring(0, 80) : '';
      announce(`${planet.label}: ${desc}`);
      // Re-render to show focus ring
      graphSettled = false;
      requestAnimationFrame(graphTick);
    }
  });
}

// ── Transition Presets ──
var PRESETS = ['', 'transition-cinematic', 'transition-snappy'];
var PRESET_NAMES = ['Gentle', 'Cinematic', 'Snappy'];
var presetIndex = 0;

function cyclePreset() {
  document.body.classList.remove('transition-cinematic', 'transition-snappy');
  presetIndex = (presetIndex + 1) % PRESETS.length;
  if (PRESETS[presetIndex]) document.body.classList.add(PRESETS[presetIndex]);
  showPresetIndicator(PRESET_NAMES[presetIndex]);
  track('transition_change', { preset: PRESET_NAMES[presetIndex] });
}

function showPresetIndicator(name) {
  var el = document.getElementById('preset-indicator');
  if (!el) {
    el = document.createElement('div');
    el.id = 'preset-indicator';
    document.body.appendChild(el);
  }
  el.textContent = 'Transition: ' + name;
  el.classList.add('visible');
  clearTimeout(el._timer);
  el._timer = setTimeout(function() { el.classList.remove('visible'); }, 1500);
}

// ── Keyboard Shortcuts ──
function setupKeyboard() {
  var searchInput = document.getElementById('searchInput');
  var searchShell = document.getElementById('searchShell');

  // Search input focus/blur
  searchInput.addEventListener('focus', function() {
    if (this.value.length > 0) {
      expandSearch(this.value);
    } else {
      searchShell.classList.add('focused');
    }
  });

  searchInput.addEventListener('blur', function() {
    setTimeout(function() {
      if (document.activeElement !== searchInput) {
        var dropOpen = document.getElementById('searchDrop').classList.contains('open');
        if (dropOpen) {
          closeSearch();
        } else {
          searchShell.classList.remove('focused');
        }
      }
    }, 150);
  });

  // Search input handler
  searchInput.addEventListener('input', function() {
    var q = this.value;
    if (q.length > 0) {
      expandSearch(q);
    } else {
      collapseSearch();
    }
  });

  // Search keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeSearch();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0 && searchIndex >= 0) activateResult(searchIndex);
    }
    var dropOpen = document.getElementById('searchDrop').classList.contains('open');
    if (dropOpen) {
      if (e.key === 'ArrowDown') { e.preventDefault(); cycleResult(1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); cycleResult(-1); }
    }
  });

  // Click scrim to close search
  document.getElementById('searchScrim').addEventListener('click', function() {
    closeSearch();
  });

  // Global shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && document.activeElement !== searchInput &&
        document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      openSearch();
      track('keyboard_shortcut', { key: '/' });
    }
    if (e.key === 'Escape' && document.activeElement.tagName !== 'INPUT') {
      if (tourState && tourState.active) {
        exitTour();
        track('keyboard_shortcut', { key: 'Escape', context: 'tour' });
        return;
      }
      goBack();
      track('keyboard_shortcut', { key: 'Escape' });
    }
    if ((e.key === 't' || e.key === 'T') && document.activeElement !== searchInput &&
        document.activeElement.tagName !== 'INPUT') {
      cyclePreset();
      track('keyboard_shortcut', { key: 'T' });
    }
    if ((e.key === 'l' || e.key === 'L') && document.activeElement !== searchInput &&
        document.activeElement.tagName !== 'INPUT') {
      toggleTheme();
      track('keyboard_shortcut', { key: 'L' });
    }
    // Tour navigation with left/right arrows
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
        document.activeElement.tagName !== 'INPUT' &&
        tourState && tourState.active) {
      e.preventDefault();
      advanceStop(e.key === 'ArrowRight' ? 1 : -1);
      track('keyboard_shortcut', { key: e.key, context: 'tour' });
      return;
    }
    // Tab navigation with left/right arrows (when on core view)
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
        document.activeElement.tagName !== 'INPUT' &&
        currentLevel === 'core') {
      var tabs = document.querySelectorAll('.entity-tab');
      if (tabs.length > 1) {
        var activeIdx = Array.from(tabs).findIndex(function(t) { return t.classList.contains('active'); });
        if (e.key === 'ArrowLeft' && activeIdx > 0) {
          tabs[activeIdx - 1].click();
        } else if (e.key === 'ArrowRight' && activeIdx < tabs.length - 1) {
          tabs[activeIdx + 1].click();
        }
      }
    }
  });
}

// ── Help Button ──
function setupHelpButton() {
  var btn = document.getElementById('helpBtn');
  var stack = document.getElementById('helpStack');
  if (!btn || !stack) return;
  function show() { stack.classList.add('visible'); btn.classList.add('pressed'); }
  function hide() { stack.classList.remove('visible'); btn.classList.remove('pressed'); }
  btn.addEventListener('mousedown', function(e) { e.preventDefault(); show(); });
  document.addEventListener('mouseup', hide);
  btn.addEventListener('touchstart', function(e) { e.preventDefault(); show(); }, { passive: false });
  document.addEventListener('touchend', hide);
  document.addEventListener('touchcancel', hide);
}

// ── Build Stats ──
function buildStats() {
  var totalClasses = 0, totalTriggers = 0, totalObjects = 0;
  var totalComponents = 0, domains = 0;

  for (var pid in NPSP) {
    domains++;
    var p = NPSP[pid];
    totalComponents += p.components.length;
    if (p._entities) {
      totalClasses += (p._entities.classes || []).length;
      totalTriggers += (p._entities.triggers || []).length;
      totalObjects += (p._entities.objects || []).length;
    }
  }

  // Use actual counts if entities are loaded, otherwise fallback to canonical
  document.getElementById('statClasses').textContent = totalClasses || '843';
  document.getElementById('statTriggers').textContent = totalTriggers || '26';
  document.getElementById('statObjects').textContent = totalObjects || '65';
  document.getElementById('statDomains').textContent = domains || '18';
  document.getElementById('statComponents').textContent = totalComponents || '55';
}

// ── Resize Handler ──
function onResize() {
  onGraphResize();
  resizeStarfield();
  resizeParticleCanvas();
  renderGraph();
  renderParticles();
}

// ── Popstate handler (browser back/forward buttons) ──
window.addEventListener('popstate', () => {
  if (!hashUpdateInProgress) {
    handleHashNavigation();
  }
});

// ── Lazy Entity Loading ──
let entitiesLoaded = false;

const loadEntities = () => {
  const script = document.createElement('script');
  script.src = 'js/npsp-entities.js?v=4';
  script.onload = () => {
    entitiesLoaded = true;
    mergeEntities();
    rebuildSearchIndex();
    buildStats();
    refreshCurrentViewIfNeeded();
  };
  script.onerror = () => {
    console.warn('Failed to load entity data');
  };
  document.head.appendChild(script);
};

// If user is viewing a component/planet when entities finish loading, refresh it
const refreshCurrentViewIfNeeded = () => {
  if (currentLevel === 'planet' && currentPlanet) {
    renderPlanetView(currentPlanet);
  } else if (currentLevel === 'core' && currentPlanet && currentComponent) {
    renderCoreView(currentPlanet, currentComponent);
  }
};

// ── Init ──
function init() {
  // Restore saved theme
  if (safeLSGet('npsp-theme') === 'light') {
    document.body.classList.add('theme-light');
    document.getElementById('theme-toggle').textContent = '\u2600';
  }
  // mergeEntities() is a no-op here since NPSP_ENTITIES isn't loaded yet
  mergeEntities();
  rebuildSearchIndex();
  createTooltip();
  initStarfield();
  initGraph();
  initRenderer();
  initParticles();
  setupCanvasEvents();
  setupKeyboard();
  setupHelpButton();
  updateBreadcrumb();
  buildStats();
  initTours();
  window.addEventListener('resize', onResize);
  requestAnimationFrame(graphTick);
  requestAnimationFrame(particleTick);

  // Lazy-load entity data (780KB) after the galaxy is interactive
  requestAnimationFrame(() => loadEntities());

  // Deep link: if URL has a hash, navigate to it after init
  if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '#') {
    handleHashNavigation();
  }
}

document.addEventListener('DOMContentLoaded', init);
