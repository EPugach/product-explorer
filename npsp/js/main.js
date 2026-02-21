// ══════════════════════════════════════════════════════════════
//  MAIN — Entry point module. Imports everything, wires callbacks,
//  handles canvas events, keyboard, tooltip, theme, init.
// ══════════════════════════════════════════════════════════════

import { NPSP } from './npsp-data.js';
import { track, safeLSGet, safeLSSet, announce } from './utils.js';
import {
  tourState, focusedPlanetIndex, setFocusedPlanetIndex,
  pageHidden, setPageHidden,
  entitiesLoaded, setEntitiesLoaded,
  prefersReducedMotion
} from './state.js';
import { initStarfield, pauseStarfield, resumeStarfield, resizeStarfield } from './starfield.js';
import {
  nodes, edges, nodeMap, graphCanvas, zoom, panX, panY,
  hoveredNode, dragNode, isDragging, isPanning, lastMouse, alpha, graphSettled,
  setZoom, setPanX, setPanY, setDragNode, setHoveredNode,
  setIsDragging, setIsPanning, setLastMouse, setAlpha, setGraphSettled,
  setRenderCallbacks,
  initGraph, simulate, screenToGraph, hitTest, onGraphResize, applyOrbitalDrift
} from './physics.js';
import { initRenderer, renderGraph } from './renderer.js';
import { initParticles, resizeParticleCanvas, updateParticles, renderParticles, initNebulaBlobs } from './particles.js';
import {
  currentLevel, currentPlanet, currentComponent,
  hashUpdateInProgress, handleHashNavigation,
  enterPlanet, enterEntity, navigateToCore, navigateTo, goBack,
  setAnimationCallbacks, refreshCurrentView, updateBreadcrumb
} from './navigation.js';
import {
  setNavigationCallbacks, rebuildSearchIndex,
  searchResults, searchIndex,
  openSearch, closeSearch, expandSearch, collapseSearch,
  cycleResult, activateResult
} from './search.js';
import { initTours, advanceStop, exitTour, setTourAnimationCallbacks, toggleTourPicker } from './tours.js';

// ── Wire cross-module callbacks ──
// physics.js needs render functions from renderer.js and particles.js
setRenderCallbacks(renderGraph, renderParticles);

// search.js needs navigation functions
setNavigationCallbacks(enterPlanet, navigateToCore, enterEntity);

// ── Theme Toggle ──
const isLightMode = () => document.body.classList.contains('theme-light');

function toggleTheme() {
  document.body.classList.toggle('theme-light');
  const light = isLightMode();
  safeLSSet('npsp-theme', light ? 'light' : 'dark');
  document.getElementById('theme-toggle').textContent = light ? '\u2600' : '\u263D';
  initNebulaBlobs();
  renderGraph();
  renderParticles();
  showPresetIndicator(light ? 'Light' : 'Dark');
  track('theme_change', { theme: light ? 'light' : 'dark' });
}

// Note: window.toggleTheme and window.navigateTo no longer needed
// since inline onclick handlers were replaced with addEventListener

// ── Merge generated entities into NPSP data ──
function mergeEntities() {
  if (typeof window.NPSP_ENTITIES === 'undefined') return;
  const NPSP_ENTITIES = window.NPSP_ENTITIES;
  for (const domainKey in NPSP_ENTITIES) {
    if (!NPSP[domainKey]) continue;
    const entities = NPSP_ENTITIES[domainKey];
    // Attach domain-level entity counts
    NPSP[domainKey]._entities = entities;
    // Map entities to individual component groups by tag matching
    for (const comp of NPSP[domainKey].components) {
      const tagSet = new Set((comp.tags || []).map((t) => t.toLowerCase()));
      comp.entities = {
        classes: (entities.classes || []).filter((c) =>
          tagSet.has(c.name.toLowerCase()) || matchesByPrefix(c.name, comp.tags)
        ),
        objects: (entities.objects || []).filter((o) =>
          tagSet.has(o.name.toLowerCase())
        ),
        triggers: (entities.triggers || []).filter((t) =>
          tagSet.has(t.object.toLowerCase()) || tagSet.has(t.name.toLowerCase())
        ),
        lwcs: (entities.lwcs || []).filter((l) =>
          tagSet.has(l.name.toLowerCase())
        ),
        metadata: (entities.metadata || []).filter((m) =>
          tagSet.has(m.name.toLowerCase())
        )
      };
    }
  }
}

function matchesByPrefix(className, tags) {
  if (!tags) return false;
  const classPrefix = className.split('_')[0] + '_';
  return tags.some((t) => t.startsWith(classPrefix));
}

// ── Tooltip ──
let tooltipEl = null;

function createTooltip() {
  tooltipEl = document.createElement('div');
  tooltipEl.className = 'planet-tooltip';
  tooltipEl.setAttribute('role', 'tooltip');
  document.body.appendChild(tooltipEl);
}

// NOTE: innerHTML usage is safe here. All tooltip data comes from the trusted
// NPSP data object and physics node properties (app-owned, not user input).
function showTooltip(node, sx, sy) {
  if (!tooltipEl) return;
  tooltipEl.innerHTML =
    `<div class="tt-name" style="color:${node.color}">${node.icon} ${node.label}</div>` +
    `<div class="tt-desc">${node.desc.substring(0, 120)}${node.desc.length > 120 ? '...' : ''}</div>` +
    `<div class="tt-stats">` +
      `<span><span class="tt-stat-val">${node.classCount}</span> classes</span>` +
      `<span><span class="tt-stat-val">${node.componentCount}</span> components</span>` +
      `<span><span class="tt-stat-val">${node.connectionCount}</span> connections</span>` +
    `</div>`;
  tooltipEl.classList.add('visible');
  const tx = Math.min(sx + 16, innerWidth - 300);
  const ty = Math.min(sy + 16, innerHeight - 120);
  tooltipEl.style.left = `${tx}px`;
  tooltipEl.style.top = `${ty}px`;
}

function hideTooltip() {
  if (tooltipEl) tooltipEl.classList.remove('visible');
}

// ── Page Visibility — pause all animation when tab is hidden ──
document.addEventListener('visibilitychange', () => {
  setPageHidden(document.hidden);
  if (document.hidden) {
    pauseStarfield();
  } else {
    // Resume starfield only if on galaxy view
    if (currentLevel === 'galaxy') {
      resumeStarfield();
    }
    // Restart graph + particle loops if on galaxy view
    if (currentLevel === 'galaxy') {
      setGraphSettled(false);
      requestAnimationFrame(graphTick);
      requestAnimationFrame(particleTick);
    }
  }
});

// ── Animation Loops ──
function graphTick() {
  if (pageHidden || currentLevel !== 'galaxy') return;
  simulate();
  applyOrbitalDrift();
  renderGraph();
  requestAnimationFrame(graphTick);
}

function particleTick() {
  if (pageHidden || currentLevel !== 'galaxy') return;
  updateParticles();
  renderParticles();
  requestAnimationFrame(particleTick);
}

// Wire animation callbacks to navigation.js and tours.js
setAnimationCallbacks(graphTick, particleTick);
setTourAnimationCallbacks(graphTick, particleTick);

// ── Keyboard Planet Focus helpers ──
const getSortedPlanets = () => [...nodes].sort((a, b) => a.x - b.x);

// ── Canvas Events (mouse) ──
function setupCanvasEvents() {
  const canvas = graphCanvas;

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    const node = hitTest(sx, sy);
    if (node && e.button === 0) {
      setDragNode(node);
      node.fx = node.x; node.fy = node.y;
      setIsDragging(false);
      setAlpha(Math.max(alpha, 0.3));
      setGraphSettled(false);
      canvas.classList.add('dragging');
      requestAnimationFrame(graphTick);
    } else if (e.button === 0) {
      setIsPanning(true);
      canvas.classList.add('dragging');
    }
    setLastMouse({ x: e.clientX, y: e.clientY });
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    if (dragNode) {
      const dx = e.clientX - lastMouse.x, dy = e.clientY - lastMouse.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) setIsDragging(true);
      const pt = screenToGraph(sx, sy);
      dragNode.fx = pt.x; dragNode.fy = pt.y;
      dragNode.x = pt.x; dragNode.y = pt.y;
      hideTooltip();
    } else if (isPanning) {
      setPanX(panX + e.clientX - lastMouse.x);
      setPanY(panY + e.clientY - lastMouse.y);
      renderGraph();
      hideTooltip();
    } else {
      const node = hitTest(sx, sy);
      if (node !== hoveredNode) {
        setHoveredNode(node);
        canvas.style.cursor = node ? 'pointer' : 'grab';
        if (node) {
          showTooltip(node, e.clientX, e.clientY);
        } else {
          hideTooltip();
        }
        if (!graphSettled || hoveredNode) {
          setGraphSettled(false);
          requestAnimationFrame(graphTick);
        }
      } else if (node) {
        showTooltip(node, e.clientX, e.clientY);
      }
    }
    setLastMouse({ x: e.clientX, y: e.clientY });
  });

  canvas.addEventListener('mouseup', () => {
    canvas.classList.remove('dragging');
    if (dragNode && !isDragging) {
      const node = dragNode;
      dragNode.fx = null; dragNode.fy = null;
      setDragNode(null); setIsPanning(false);
      hideTooltip();
      if (tourState.active) return;
      enterPlanet(node.id);
      track('planet_click', { planet: node.id });
      return;
    } else if (dragNode) {
      track('planet_drag', { planet: dragNode.id });
      dragNode.fx = null; dragNode.fy = null;
      setAlpha(Math.max(alpha, 0.1));
      setGraphSettled(false);
      requestAnimationFrame(graphTick);
    }
    setDragNode(null); setIsPanning(false);
  });

  canvas.addEventListener('mouseleave', () => {
    if (hoveredNode) { setHoveredNode(null); renderGraph(); }
    hideTooltip();
    setIsPanning(false);
    canvas.classList.remove('dragging');
    if (dragNode) { dragNode.fx = null; dragNode.fy = null; setDragNode(null); }
  });

  // Scroll to zoom
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    const oldZoom = zoom;
    let newZoom = zoom * (e.deltaY < 0 ? 1.1 : 0.9);
    newZoom = Math.max(0.3, Math.min(3, newZoom));
    setZoom(newZoom);
    setPanX(sx - (sx - panX) * (newZoom / oldZoom));
    setPanY(sy - (sy - panY) * (newZoom / oldZoom));
    renderGraph();
    renderParticles();
  }, { passive: false });

  // ── Touch events ──
  let touchStartNode = null;
  let touchStartTime = 0;
  let touchStartPos = { x: 0, y: 0 };
  let lastTouchDist = 0;

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const sx = touch.clientX - rect.left, sy = touch.clientY - rect.top;
      touchStartNode = hitTest(sx, sy);
      touchStartTime = Date.now();
      touchStartPos = { x: touch.clientX, y: touch.clientY };
      if (touchStartNode) e.preventDefault();
      setLastMouse({ x: touch.clientX, y: touch.clientY });
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist = Math.sqrt(dx * dx + dy * dy);
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartPos.x;
      const dy = touch.clientY - touchStartPos.y;
      if (Math.abs(dx) + Math.abs(dy) > 10) {
        touchStartNode = null;
        setPanX(panX + touch.clientX - lastMouse.x);
        setPanY(panY + touch.clientY - lastMouse.y);
        renderGraph();
        renderParticles();
      }
      setLastMouse({ x: touch.clientX, y: touch.clientY });
      e.preventDefault();
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastTouchDist > 0) {
        const scale = dist / lastTouchDist;
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const oldZoom = zoom;
        let newZoom = zoom * scale;
        newZoom = Math.max(0.3, Math.min(3, newZoom));
        setZoom(newZoom);
        setPanX(cx - (cx - panX) * (newZoom / oldZoom));
        setPanY(cy - (cy - panY) * (newZoom / oldZoom));
        renderGraph();
        renderParticles();
      }
      lastTouchDist = dist;
      e.preventDefault();
    }
  }, { passive: false });

  canvas.addEventListener('touchend', () => {
    if (touchStartNode && Date.now() - touchStartTime < 300) {
      const node = touchStartNode;
      touchStartNode = null;
      lastTouchDist = 0;
      if (tourState.active) return;
      enterPlanet(node.id);
      track('planet_click', { planet: node.id });
      return;
    }
    touchStartNode = null;
    lastTouchDist = 0;
  });

  // ── B7: Keyboard planet selection ──
  canvas.addEventListener('keydown', (e) => {
    if (currentLevel !== 'galaxy') return;
    if (tourState.active) return;

    const sorted = getSortedPlanets();
    if (!sorted.length) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        setFocusedPlanetIndex((focusedPlanetIndex + 1) % sorted.length);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        setFocusedPlanetIndex((focusedPlanetIndex - 1 + sorted.length) % sorted.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedPlanetIndex >= 0) {
          const planet = sorted[focusedPlanetIndex];
          setFocusedPlanetIndex(-1);
          enterPlanet(planet.id);
          track('planet_click', { planet: planet.id, method: 'keyboard' });
        }
        return;
      case 'Escape':
        e.preventDefault();
        setFocusedPlanetIndex(-1);
        canvas.blur();
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
      setGraphSettled(false);
      requestAnimationFrame(graphTick);
    }
  });
}

// ── Transition Presets ──
const PRESETS = ['', 'transition-cinematic', 'transition-snappy'];
const PRESET_NAMES = ['Gentle', 'Cinematic', 'Snappy'];
let presetIndex = 0;

function cyclePreset() {
  document.body.classList.remove('transition-cinematic', 'transition-snappy');
  presetIndex = (presetIndex + 1) % PRESETS.length;
  if (PRESETS[presetIndex]) document.body.classList.add(PRESETS[presetIndex]);
  showPresetIndicator(PRESET_NAMES[presetIndex]);
  track('transition_change', { preset: PRESET_NAMES[presetIndex] });
}

function showPresetIndicator(name) {
  let el = document.getElementById('preset-indicator');
  if (!el) {
    el = document.createElement('div');
    el.id = 'preset-indicator';
    document.body.appendChild(el);
  }
  el.textContent = `Transition: ${name}`;
  el.classList.add('visible');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('visible'), 1500);
}

// ── Keyboard Shortcuts ──
function setupKeyboard() {
  const searchInput = document.getElementById('searchInput');
  const searchShell = document.getElementById('searchShell');

  // Search input focus/blur
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.length > 0) {
      expandSearch(searchInput.value);
    } else {
      searchShell.classList.add('focused');
    }
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => {
      if (document.activeElement !== searchInput) {
        const dropOpen = document.getElementById('searchDrop').classList.contains('open');
        if (dropOpen) {
          closeSearch();
        } else {
          searchShell.classList.remove('focused');
        }
      }
    }, 150);
  });

  // Search input handler
  searchInput.addEventListener('input', () => {
    const q = searchInput.value;
    if (q.length > 0) {
      expandSearch(q);
    } else {
      collapseSearch();
    }
  });

  // Search keyboard navigation
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeSearch();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0 && searchIndex >= 0) activateResult(searchIndex);
    }
    const dropOpen = document.getElementById('searchDrop').classList.contains('open');
    if (dropOpen) {
      if (e.key === 'ArrowDown') { e.preventDefault(); cycleResult(1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); cycleResult(-1); }
    }
  });

  // Click scrim to close search
  document.getElementById('searchScrim').addEventListener('click', () => closeSearch());

  // Global shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput &&
        document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      openSearch();
      track('keyboard_shortcut', { key: '/' });
    }
    if (e.key === 'Escape' && document.activeElement.tagName !== 'INPUT') {
      if (tourState.active) {
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
        tourState.active) {
      e.preventDefault();
      advanceStop(e.key === 'ArrowRight' ? 1 : -1);
      track('keyboard_shortcut', { key: e.key, context: 'tour' });
      return;
    }
    // Tab navigation with left/right arrows (when on core view)
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
        document.activeElement.tagName !== 'INPUT' &&
        currentLevel === 'core') {
      const tabs = document.querySelectorAll('.entity-tab');
      if (tabs.length > 1) {
        const activeIdx = Array.from(tabs).findIndex((t) => t.classList.contains('active'));
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
  const btn = document.getElementById('helpBtn');
  const stack = document.getElementById('helpStack');
  if (!btn || !stack) return;
  const show = () => { stack.classList.add('visible'); btn.classList.add('pressed'); };
  const hide = () => { stack.classList.remove('visible'); btn.classList.remove('pressed'); };
  btn.addEventListener('mousedown', (e) => { e.preventDefault(); show(); });
  document.addEventListener('mouseup', hide);
  btn.addEventListener('touchstart', (e) => { e.preventDefault(); show(); }, { passive: false });
  document.addEventListener('touchend', hide);
  document.addEventListener('touchcancel', hide);
}

// ── Build Stats ──
function buildStats() {
  let totalClasses = 0, totalTriggers = 0, totalObjects = 0;
  let totalComponents = 0, domains = 0;

  for (const pid in NPSP) {
    domains++;
    const p = NPSP[pid];
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
const loadEntities = () => {
  const script = document.createElement('script');
  script.src = 'js/npsp-entities.js?v=4';
  script.onload = () => {
    setEntitiesLoaded(true);
    mergeEntities();
    rebuildSearchIndex();
    buildStats();
    refreshCurrentView();
  };
  script.onerror = () => {
    console.warn('Failed to load entity data');
  };
  document.head.appendChild(script);
};

// ── First-Visit Onboarding Hint ──
function showOnboardingHint() {
  const hint = document.createElement('div');
  hint.className = 'onboarding-hint';
  hint.textContent = 'Click any planet to explore the NPSP universe';
  hint.setAttribute('role', 'status');
  document.body.appendChild(hint);

  // Show after a brief delay for entrance stagger
  requestAnimationFrame(() => requestAnimationFrame(() => {
    hint.classList.add('visible');
  }));

  const dismiss = () => {
    hint.classList.remove('visible');
    safeLSSet('npsp-visited', '1');
    setTimeout(() => { if (hint.parentNode) hint.parentNode.removeChild(hint); }, 500);
    document.removeEventListener('click', dismiss);
    document.removeEventListener('keydown', dismiss);
    clearTimeout(autoHide);
  };

  document.addEventListener('click', dismiss, { once: true });
  document.addEventListener('keydown', dismiss, { once: true });
  const autoHide = setTimeout(dismiss, 6000);
}

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

  // Navbar event listeners (replaced inline onclick from index.html)
  document.getElementById('nav-brand').addEventListener('click', () => navigateTo('galaxy'));
  document.getElementById('nav-brand').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateTo('galaxy'); }
  });
  document.getElementById('tour-btn').addEventListener('click', () => toggleTourPicker());
  document.getElementById('theme-toggle').addEventListener('click', () => toggleTheme());

  window.addEventListener('resize', onResize);
  requestAnimationFrame(graphTick);
  requestAnimationFrame(particleTick);

  // Show first-visit onboarding hint
  if (!safeLSGet('npsp-visited')) {
    showOnboardingHint();
  }

  // Lazy-load entity data (780KB) after the galaxy is interactive
  requestAnimationFrame(() => loadEntities());

  // Deep link: if URL has a hash, navigate to it after init
  if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '#') {
    handleHashNavigation();
  }
}

document.addEventListener('DOMContentLoaded', init);
