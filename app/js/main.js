// ══════════════════════════════════════════════════════════════
//  MAIN — Entry point for the shared rendering engine.
//  Reads data-product from <body>, dynamically imports product
//  config + data, wires all modules, and initializes the app.
// ══════════════════════════════════════════════════════════════

import { track, safeLSGet, safeLSSet, announce } from './utils.js';
import {
  tourState, focusedPlanetIndex, setFocusedPlanetIndex,
  pageHidden, setPageHidden,
  entitiesLoaded, setEntitiesLoaded,
  setProductId, lsPrefix,
  prefersReducedMotion
} from './state.js';
import { initStarfield, pauseStarfield, resumeStarfield, resizeStarfield } from './starfield.js';
import {
  nodes, edges, nodeMap, graphCanvas, zoom, panX, panY,
  hoveredNode, dragNode, isDragging, isPanning, lastMouse, alpha, graphSettled,
  setZoom, setPanX, setPanY, setDragNode, setHoveredNode,
  setIsDragging, setIsPanning, setLastMouse, setAlpha, setGraphSettled,
  setRenderCallbacks, setProductData as setPhysicsData,
  initGraph, simulate, screenToGraph, hitTest, onGraphResize, applyOrbitalDrift
} from './physics.js';
import { initRenderer, renderGraph } from './renderer.js';
import { initParticles, resizeParticleCanvas, updateParticles, renderParticles, initNebulaBlobs } from './particles.js';
import {
  currentLevel, currentPlanet, currentComponent,
  hashUpdateInProgress, handleHashNavigation,
  enterPlanet, enterEntity, navigateToCore, navigateTo, goBack,
  setAnimationCallbacks, refreshCurrentView, updateBreadcrumb,
  setProductData as setNavData, setProductConfig as setNavConfig,
  rebuildPlanetMeta
} from './navigation.js';
import {
  setNavigationCallbacks, rebuildSearchIndex,
  searchResults, searchIndex,
  openSearch, closeSearch, expandSearch, collapseSearch,
  cycleResult, activateResult,
  setProductData as setSearchData
} from './search.js';
import {
  initTours, advanceStop, exitTour, setTourAnimationCallbacks, toggleTourPicker,
  setTourData, setProductData as setToursProductData
} from './tours.js';
import { uiSvg, domainSvg, preloadCanvasIcons, setDomainPaths } from './icons.js';

// ── Resolve product ID from <body data-product="..."> ──
const productId = document.body.dataset.product || 'npsp';
setProductId(productId);

// ── Resolve base path for product data imports ──
// The bootstrap index.html is at /{productId}/index.html
// Products data is at /products/{productId}/
// So from app/js/main.js perspective: ../../products/{productId}/
const productsBase = `../../products/${productId}`;

// ── Dynamic product imports ──
let PRODUCT_DATA = {};
let PRODUCT_CONFIG = {};

async function loadProductData() {
  // Load config and data in parallel (required)
  const [configModule, dataModule] = await Promise.all([
    import(`${productsBase}/config.js`),
    import(`${productsBase}/data.js`),
  ]);

  PRODUCT_CONFIG = configModule.default;
  PRODUCT_DATA = dataModule.PRODUCT;

  // Inject product data into all modules that need it
  setPhysicsData(PRODUCT_DATA);
  setNavData(PRODUCT_DATA);
  setNavConfig(PRODUCT_CONFIG);
  setSearchData(PRODUCT_DATA, PRODUCT_CONFIG.name);
  setToursProductData(PRODUCT_DATA);

  // Load domain icons (required before canvas rendering)
  try {
    const iconsModule = await import(`${productsBase}/icons.js`);
    setDomainPaths(iconsModule.DOMAIN_PATHS);
  } catch (e) {
    console.warn(`[${productId}] No domain icons found, using defaults`);
  }

  // Load tours (optional)
  try {
    const tourModule = await import(`${productsBase}/tour-data.js`);
    setTourData(tourModule.TOURS);
  } catch (e) {
    // Tours are optional; if not found, tour UI will be hidden
    setTourData([]);
  }

  // Load feedback module (optional)
  try {
    const feedbackModule = await import(`${productsBase}/feedback.js`);
    if (feedbackModule.initFeedback) feedbackModule.initFeedback();
  } catch (e) {
    // Feedback is optional
  }

  // Build planet metadata for navigation after icons are set
  rebuildPlanetMeta();
}

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
  safeLSSet(lsPrefix + 'theme', light ? 'light' : 'dark');
  document.getElementById('theme-icon').innerHTML = uiSvg(light ? 'sun' : 'moon', 18);
  initNebulaBlobs();
  renderGraph();
  renderParticles();
  showPresetIndicator(light ? 'Light' : 'Dark');
  track('theme_change', { theme: light ? 'light' : 'dark' });
}

// ── Merge generated entities into product data ──
// Two-pass matching + synthetic infrastructure component for orphans
let _entityData = null;
const ENTITY_KEYS = ['classes', 'objects', 'triggers', 'lwcs', 'metadata'];

function mergeEntities() {
  if (!_entityData) return;
  const ENTITIES = _entityData;
  let totalPass1 = 0, totalPass2 = 0, totalInfra = 0;

  for (const domainKey in ENTITIES) {
    if (!PRODUCT_DATA[domainKey]) continue;
    const entities = ENTITIES[domainKey];
    PRODUCT_DATA[domainKey]._entities = entities;

    // Track which entities are claimed across all passes
    const claimed = {};
    for (const key of ENTITY_KEYS) {
      claimed[key] = new Set();
    }

    const components = PRODUCT_DATA[domainKey].components;

    // ── Pass 1: Tag matching + LWC prefix matching ──
    // Build LWC prefix map from explicitly tagged LWCs per component
    const compLwcPrefixes = new Map();
    for (const comp of components) {
      const tagSet = new Set((comp.tags || []).map((t) => t.toLowerCase()));
      const taggedLwcNames = (entities.lwcs || [])
        .filter((l) => tagSet.has(l.name.toLowerCase()))
        .map((l) => l.name.toLowerCase());
      if (taggedLwcNames.length > 0) {
        // Derive common prefixes (3+ chars) from tagged LWC names
        const prefixes = new Set();
        for (const name of taggedLwcNames) {
          // Use full name as a prefix to match children (e.g. "rd2" matches "rd2Service")
          if (name.length >= 3) prefixes.add(name);
        }
        compLwcPrefixes.set(comp, prefixes);
      }
    }

    for (const comp of components) {
      const tagSet = new Set((comp.tags || []).map((t) => t.toLowerCase()));
      const prefixes = compLwcPrefixes.get(comp);

      comp.entities = {};
      for (const key of ENTITY_KEYS) {
        const items = entities[key] || [];
        const matched = [];
        for (const item of items) {
          if (claimed[key].has(item.name)) continue;
          let isMatch = false;

          if (key === 'classes') {
            isMatch = tagSet.has(item.name.toLowerCase()) || matchesByPrefix(item.name, comp.tags);
          } else if (key === 'triggers') {
            isMatch = tagSet.has(item.object.toLowerCase()) || tagSet.has(item.name.toLowerCase());
          } else if (key === 'lwcs') {
            if (tagSet.has(item.name.toLowerCase())) {
              isMatch = true;
            } else if (prefixes) {
              const lowerName = item.name.toLowerCase();
              for (const pfx of prefixes) {
                if (lowerName.startsWith(pfx) && lowerName.length > pfx.length) {
                  isMatch = true;
                  break;
                }
              }
            }
          } else {
            isMatch = tagSet.has(item.name.toLowerCase());
          }

          if (isMatch) {
            matched.push(item);
            claimed[key].add(item.name);
          }
        }
        comp.entities[key] = matched;
        totalPass1 += matched.length;
      }
    }

    // ── Pass 2: Orphan trigger matching via class-object references ──
    const orphanTriggers = (entities.triggers || []).filter((t) => !claimed.triggers.has(t.name));
    for (const trigger of orphanTriggers) {
      const objName = trigger.object;
      let placed = false;
      for (const comp of components) {
        if (comp._synthetic) continue;
        const compClasses = comp.entities.classes || [];
        const hasRef = compClasses.some((cls) =>
          (cls.referencedObjects && cls.referencedObjects.includes(objName)) ||
          (cls.object && cls.object === objName)
        );
        if (hasRef) {
          comp.entities.triggers.push(trigger);
          claimed.triggers.add(trigger.name);
          totalPass2++;
          placed = true;
          break;
        }
      }
      if (!placed) {
        const objLower = objName.toLowerCase();
        for (const comp of components) {
          if (comp._synthetic) continue;
          const tagSet = new Set((comp.tags || []).map((t) => t.toLowerCase()));
          const tagMatch = [...tagSet].some((t) => t.includes(objLower) || objLower.includes(t.split('_')[0]));
          if (tagMatch) {
            comp.entities.triggers.push(trigger);
            claimed.triggers.add(trigger.name);
            totalPass2++;
            placed = true;
            break;
          }
        }
      }
    }

    // Also try to place orphan LWCs via broader prefix matching in Pass 2
    const orphanLwcs = (entities.lwcs || []).filter((l) => !claimed.lwcs.has(l.name));
    for (const lwc of orphanLwcs) {
      const lowerName = lwc.name.toLowerCase();
      for (const comp of components) {
        if (comp._synthetic) continue;
        const compLwcs = comp.entities.lwcs || [];
        const shares = compLwcs.some((existing) => {
          const existLower = existing.name.toLowerCase();
          const common = commonPrefix(lowerName, existLower);
          return common.length >= 3;
        });
        if (shares) {
          comp.entities.lwcs.push(lwc);
          claimed.lwcs.add(lwc.name);
          totalPass2++;
          break;
        }
      }
    }

    // ── Synthetic Infrastructure component for remaining orphans ──
    const infraEntities = {};
    let infraTotal = 0;
    for (const key of ENTITY_KEYS) {
      const orphans = (entities[key] || []).filter((item) => !claimed[key].has(item.name));
      infraEntities[key] = orphans;
      infraTotal += orphans.length;
    }

    if (infraTotal > 0) {
      const parts = [];
      for (const key of ENTITY_KEYS) {
        if (infraEntities[key].length > 0) {
          parts.push(`${infraEntities[key].length} ${key}`);
        }
      }
      components.push({
        id: '_infra',
        name: 'Infrastructure & Utilities',
        icon: '\u2699\uFE0F',
        desc: `Cross-cutting infrastructure: ${parts.join(', ')}. These entities support the domain but don't map to a single component.`,
        tags: [],
        triggerTags: [],
        _synthetic: true,
        entities: infraEntities
      });
      totalInfra += infraTotal;
    }

    // Update physics node tooltip counts with actual entity data
    if (nodeMap[domainKey]) {
      nodeMap[domainKey].classCount = (entities.classes || []).length;
    }
  }

  console.log(`[${productId}] Entity mapping: Pass 1: ${totalPass1} matched, Pass 2: ${totalPass2} matched, Infrastructure: ${totalInfra} remaining`);
}

function matchesByPrefix(className, tags) {
  if (!tags) return false;
  const classPrefix = className.split('_')[0] + '_';
  return tags.some((t) => t.startsWith(classPrefix));
}

function commonPrefix(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a.slice(0, i);
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
// product data object and physics node properties (app-owned, not user input).
function showTooltip(node, sx, sy) {
  if (!tooltipEl) return;
  tooltipEl.innerHTML =
    `<div class="tt-name" style="color:${node.color}"><span class="icon-svg">${domainSvg(node.id, 18)}</span> ${node.label}</div>` +
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
    if (currentLevel === 'galaxy') {
      resumeStarfield();
    }
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

  // ── Keyboard planet selection ──
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
      const desc = PRODUCT_DATA[planet.id] ? PRODUCT_DATA[planet.id].description.substring(0, 80) : '';
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

  searchInput.addEventListener('input', () => {
    const q = searchInput.value;
    if (q.length > 0) {
      expandSearch(q);
    } else {
      collapseSearch();
    }
  });

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

  document.getElementById('searchScrim').addEventListener('click', () => closeSearch());

  const isTyping = () => {
    const tag = document.activeElement.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && !isTyping()) {
      e.preventDefault();
      openSearch();
      track('keyboard_shortcut', { key: '/' });
    }
    if (e.key === 'Escape' && !isTyping()) {
      if (tourState.active) {
        exitTour();
        track('keyboard_shortcut', { key: 'Escape', context: 'tour' });
        return;
      }
      goBack();
      track('keyboard_shortcut', { key: 'Escape' });
    }
    if ((e.key === 't' || e.key === 'T') && document.activeElement !== searchInput && !isTyping()) {
      cyclePreset();
      track('keyboard_shortcut', { key: 'T' });
    }
    if ((e.key === 'l' || e.key === 'L') && document.activeElement !== searchInput && !isTyping()) {
      toggleTheme();
      track('keyboard_shortcut', { key: 'L' });
    }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
        document.activeElement.tagName !== 'INPUT' &&
        tourState.active) {
      e.preventDefault();
      advanceStop(e.key === 'ArrowRight' ? 1 : -1);
      track('keyboard_shortcut', { key: e.key, context: 'tour' });
      return;
    }
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

  for (const pid in PRODUCT_DATA) {
    domains++;
    const p = PRODUCT_DATA[pid];
    totalComponents += p.components.length;
    if (p._entities) {
      totalClasses += (p._entities.classes || []).length;
      totalTriggers += (p._entities.triggers || []).length;
      totalObjects += (p._entities.objects || []).length;
    }
  }

  const cfg = PRODUCT_CONFIG.stats || {};
  document.getElementById('statClasses').textContent = totalClasses || cfg.classes || '0';
  document.getElementById('statTriggers').textContent = totalTriggers || cfg.triggers || '0';
  document.getElementById('statObjects').textContent = totalObjects || cfg.objects || '0';
  document.getElementById('statDomains').textContent = domains || cfg.domains || '0';
  document.getElementById('statComponents').textContent = totalComponents || cfg.components || '0';
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

// ── Lazy Entity Loading (dynamic import, ES module) ──
const loadEntities = async () => {
  try {
    const module = await import(`${productsBase}/entities.js`);
    _entityData = module.default;
    setEntitiesLoaded(true);
    mergeEntities();
    _entityData = null; // Free memory after merge
    rebuildSearchIndex();
    buildStats();
    refreshCurrentView();
  } catch (e) {
    console.warn(`[${productId}] Failed to load entity data`, e);
  }
};

// ── First-Visit Onboarding Hint ──
function showOnboardingHint() {
  const hint = document.createElement('div');
  hint.className = 'onboarding-hint';
  hint.textContent = `Click any planet to explore the ${PRODUCT_CONFIG.name || 'product'} universe`;
  hint.setAttribute('role', 'status');
  document.body.appendChild(hint);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    hint.classList.add('visible');
  }));

  const dismiss = () => {
    hint.classList.remove('visible');
    safeLSSet(lsPrefix + 'visited', '1');
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
async function init() {
  // Load product data first (config, domains, icons, tours)
  await loadProductData();

  // Restore saved theme
  const lightMode = safeLSGet(lsPrefix + 'theme') === 'light';
  if (lightMode) {
    document.body.classList.add('theme-light');
  }

  // Populate SVG icons in navbar
  document.getElementById('search-icon').innerHTML = uiSvg('search', 16);
  document.getElementById('tour-icon').innerHTML = uiSvg('tour', 16);
  document.getElementById('help-icon').innerHTML = uiSvg('help', 18);
  document.getElementById('feedback-icon').innerHTML = uiSvg('feedback', 18);
  document.getElementById('theme-icon').innerHTML = uiSvg(lightMode ? 'sun' : 'moon', 18);

  // Help panel icons
  const helpTourIcon = document.querySelector('.help-tour-icon');
  if (helpTourIcon) helpTourIcon.innerHTML = uiSvg('tour', 14);
  const helpDragIcon = document.querySelector('.help-drag-icon');
  if (helpDragIcon) helpDragIcon.innerHTML = '&#x1F91A;';

  // Pre-load domain icons for canvas rendering
  await preloadCanvasIcons();

  // Build initial state (entities not loaded yet, mergeEntities is no-op)
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

  // Navbar event listeners
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
  if (!safeLSGet(lsPrefix + 'visited')) {
    showOnboardingHint();
  }

  // Lazy-load entity data after the galaxy is interactive
  requestAnimationFrame(() => loadEntities());

  // Deep link: if URL has a hash, navigate to it after init
  if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '#') {
    handleHashNavigation();
  }
}

document.addEventListener('DOMContentLoaded', init);
