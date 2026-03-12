// ══════════════════════════════════════════════════════════════
//  MAIN — Entry point for the shared rendering engine.
//  Reads data-product from <body>, dynamically imports product
//  config + data, wires all modules, and initializes the app.
// ══════════════════════════════════════════════════════════════

import { track, safeLSGet, safeLSSet, announce } from './utils.js';
import {
  tourState,
  pageHidden, setPageHidden,
  entitiesLoaded, setEntitiesLoaded,
  setProductId, lsPrefix,
  prefersReducedMotion
} from './state.js';
import {
  nodes, edges, nodeMap, zoom, panX, panY,
  setZoom, setPanX, setPanY,
  setProductData as setPhysicsData, setTransformCallback,
  initGraph, computeLayout, onGraphResize
} from './physics.js';
import { initParticles, resizeParticleCanvas, updateParticles, renderParticles, setHoveredNode as setParticleHover } from './particles.js';
import {
  initGalaxyDOM, updateGalaxyTransform, updateAllPositions, updatePlanetPosition,
  applyHoverState, clearHoverState, setGalaxyVisible, getSortedPlanetEls, getPlanetEl,
  hideEdgeTooltip
} from './galaxy-renderer.js';
import {
  currentLevel, currentPlanet, currentComponent,
  hashUpdateInProgress, handleHashNavigation,
  enterPlanet, enterEntity, enterSearchResults, navigateToCore, navigateTo, goBack,
  isFlyInAnimating, setAnimationCallbacks, refreshCurrentView, updateBreadcrumb,
  setProductData as setNavData, setProductConfig as setNavConfig,
  setPackages as setNavPackages, rebuildPlanetMeta,
  copyCurrentLink
} from './navigation.js';
import {
  setNavigationCallbacks, rebuildSearchIndex,
  searchResults, searchIndex,
  openSearch, closeSearch, expandSearch, collapseSearch,
  cycleResult, activateResult,
  setProductData as setSearchData,
  setPackages as setSearchPackages,
  setAiConfig, setEntityLinks, setFeedbackEndpoint
} from './search.js';
import {
  initTours, advanceStop, exitTour, setTourAnimationCallbacks, toggleTourPicker,
  setTourData, setProductData as setToursProductData
} from './tours.js';
import { initStarfield, resizeStarfield } from './starfield.js';
import { uiSvg, domainSvg, setDomainPaths } from './icons.js';

// ── Resolve product ID from <body data-product="..."> ──
const productId = document.body.dataset.product || 'npsp';
setProductId(productId);

// ── Resolve base path for product data imports ──
const productsBase = `../../products/${productId}`;

// ── Dynamic product imports ──
let PRODUCT_DATA = {};
let PRODUCT_CONFIG = {};
let PRODUCT_PACKAGES = {};
let _prefixToPkg = {};

async function loadProductData() {
  const [configModule, dataModule] = await Promise.all([
    import(`${productsBase}/config.js?v=24`),
    import(`${productsBase}/data.js?v=24`),
  ]);

  PRODUCT_CONFIG = configModule.default;
  PRODUCT_DATA = dataModule.PRODUCT;
  PRODUCT_PACKAGES = configModule.PACKAGES || {};

  _prefixToPkg = Object.fromEntries(
    Object.entries(PRODUCT_PACKAGES).map(([key, pkg]) => [pkg.prefix, key])
  );

  setPhysicsData(PRODUCT_DATA);
  setNavData(PRODUCT_DATA);
  setNavConfig(PRODUCT_CONFIG);
  setNavPackages(PRODUCT_PACKAGES);
  setSearchData(PRODUCT_DATA, PRODUCT_CONFIG.name);
  setSearchPackages(PRODUCT_PACKAGES);
  setToursProductData(PRODUCT_DATA);

  try {
    const iconsModule = await import(`${productsBase}/icons.js?v=24`);
    setDomainPaths(iconsModule.DOMAIN_PATHS);
  } catch (e) {
    console.warn(`[${productId}] No domain icons found, using defaults`);
  }

  try {
    const tourModule = await import(`${productsBase}/tour-data.js?v=24`);
    setTourData(tourModule.TOURS);
  } catch (e) {
    setTourData([]);
  }

  try {
    const feedbackModule = await import(`${productsBase}/feedback.js?v=24`);
    if (feedbackModule.initFeedback) feedbackModule.initFeedback();
  } catch (e) {}

  try {
    const aiContextMod = await import(`${productsBase}/ai-context.js?v=24`);
    const aiEndpoint = PRODUCT_CONFIG.aiWorkerUrl;
    if (aiEndpoint) {
      setAiConfig(aiEndpoint, aiContextMod.AI_CONTEXT || '');
      setFeedbackEndpoint(aiEndpoint + '/feedback');
    }
  } catch (e) {}

  rebuildPlanetMeta();
}

// ── Wire cross-module callbacks ──
setNavigationCallbacks(enterPlanet, navigateToCore, enterEntity, enterSearchResults);

// Wire physics transform updates to DOM
setTransformCallback(() => {
  updateGalaxyTransform();
});

// ── Theme Toggle ──
const isLightMode = () => document.body.classList.contains('theme-light');

function toggleTheme() {
  document.body.classList.toggle('theme-light');
  const light = isLightMode();
  safeLSSet(lsPrefix + 'theme', light ? 'light' : 'dark');
  // NOTE: innerHTML safe — uiSvg returns trusted app-owned SVG strings
  document.getElementById('theme-icon').innerHTML = uiSvg(light ? 'sun' : 'moon', 18);
  track('theme_change', { theme: light ? 'light' : 'dark' });
}

// ── Package derivation ──
function derivePackage(entityName) {
  for (const [prefix, pkgKey] of Object.entries(_prefixToPkg)) {
    if (entityName.startsWith(prefix)) return pkgKey;
  }
  const keys = Object.keys(PRODUCT_PACKAGES);
  return keys.length > 0 ? keys[0] : null;
}

// ── Merge generated entities into product data ──
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

    if (Object.keys(PRODUCT_PACKAGES).length > 0) {
      for (const key of ENTITY_KEYS) {
        for (const item of (entities[key] || [])) {
          item._package = derivePackage(item.name);
        }
      }
    }

    const claimed = {};
    for (const key of ENTITY_KEYS) {
      claimed[key] = new Set();
    }

    const components = PRODUCT_DATA[domainKey].components;

    const compLwcPrefixes = new Map();
    for (const comp of components) {
      const tagSet = new Set((comp.tags || []).map((t) => t.toLowerCase()));
      const taggedLwcNames = (entities.lwcs || [])
        .filter((l) => tagSet.has(l.name.toLowerCase()))
        .map((l) => l.name.toLowerCase());
      if (taggedLwcNames.length > 0) {
        const prefixes = new Set();
        for (const name of taggedLwcNames) {
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

// ── Page Visibility ──
document.addEventListener('visibilitychange', () => {
  setPageHidden(document.hidden);
  if (!document.hidden && currentLevel === 'galaxy') {
    requestAnimationFrame(particleTick);
  }
});

// ── Single Animation Loop (particles only) ──
function particleTick() {
  if (pageHidden || currentLevel !== 'galaxy') return;
  updateParticles();
  renderParticles();
  requestAnimationFrame(particleTick);
}

// Wire animation callbacks to navigation.js and tours.js
setAnimationCallbacks(particleTick);
setTourAnimationCallbacks(particleTick);

// ── Galaxy DOM Events ──
function setupGalaxyEvents() {
  const container = document.getElementById('galaxyContainer');
  if (!container) return;

  // Track drag state
  let _dragNode = null;
  let _isDragging = false;
  let _isPanning = false;
  let _dragStart = { x: 0, y: 0 };
  let _lastMouse = { x: 0, y: 0 };
  let _hoveredId = null;

  // ── Planet mouseenter/mouseleave for tooltip + dimming ──
  container.addEventListener('mouseover', (e) => {
    const planetDiv = e.target.closest('.planet-node');
    if (!planetDiv || _dragNode || _isPanning) return;
    const id = planetDiv.dataset.domain;
    if (id === _hoveredId) return;
    _hoveredId = id;
    const node = nodeMap[id];
    if (node) {
      hideEdgeTooltip();
      showTooltip(node, e.clientX, e.clientY);
      applyHoverState(id);
      setParticleHover(node);
    }
  });

  container.addEventListener('mouseout', (e) => {
    const planetDiv = e.target.closest('.planet-node');
    if (!planetDiv) return;
    const related = e.relatedTarget;
    if (related && planetDiv.contains(related)) return;
    _hoveredId = null;
    hideTooltip();
    clearHoverState();
    setParticleHover(null);
  });

  // Update tooltip position on mouse move over planet
  container.addEventListener('mousemove', (e) => {
    if (_hoveredId && !_dragNode && !_isPanning) {
      const node = nodeMap[_hoveredId];
      if (node) showTooltip(node, e.clientX, e.clientY);
    }
  });

  // ── Mousedown: start drag or pan ──
  container.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    const planetDiv = e.target.closest('.planet-node');
    _dragStart = { x: e.clientX, y: e.clientY };
    _lastMouse = { x: e.clientX, y: e.clientY };
    _isDragging = false;

    if (planetDiv) {
      const id = planetDiv.dataset.domain;
      _dragNode = nodeMap[id] || null;
      if (_dragNode) {
        _dragNode.fx = _dragNode.x;
        _dragNode.fy = _dragNode.y;
        planetDiv.style.willChange = 'left, top';
        container.classList.add('dragging');
      }
    } else {
      _isPanning = true;
      container.classList.add('dragging');
    }
  });

  // ── Mousemove: drag planet or pan ──
  window.addEventListener('mousemove', (e) => {
    if (_dragNode) {
      const dx = e.clientX - _lastMouse.x;
      const dy = e.clientY - _lastMouse.y;
      // Check total displacement from start to distinguish drag from click
      const totalDx = e.clientX - _dragStart.x;
      const totalDy = e.clientY - _dragStart.y;
      if (Math.abs(totalDx) + Math.abs(totalDy) > 3) _isDragging = true;
      // Convert screen delta to graph space
      _dragNode.x += dx / zoom;
      _dragNode.y += dy / zoom;
      _dragNode.fx = _dragNode.x;
      _dragNode.fy = _dragNode.y;
      updatePlanetPosition(_dragNode);
      hideTooltip();
    } else if (_isPanning) {
      setPanX(panX + e.clientX - _lastMouse.x);
      setPanY(panY + e.clientY - _lastMouse.y);
      updateGalaxyTransform();
      hideTooltip();
    }
    _lastMouse = { x: e.clientX, y: e.clientY };
  });

  // ── Mouseup: end drag/pan, detect click ──
  window.addEventListener('mouseup', () => {
    container.classList.remove('dragging');
    if (_dragNode) {
      // Remove will-change hint from the dragged planet div
      const dragDiv = getPlanetEl(_dragNode.id);
      if (dragDiv) dragDiv.style.willChange = '';
    }
    if (_dragNode && !_isDragging) {
      const node = _dragNode;
      _dragNode.fx = null; _dragNode.fy = null;
      _dragNode = null; _isPanning = false;
      hideTooltip();
      if (tourState.active) return;
      enterPlanet(node.id);
      track('planet_click', { planet: node.id });
      return;
    } else if (_dragNode) {
      track('planet_drag', { planet: _dragNode.id });
      _dragNode.fx = null; _dragNode.fy = null;
    }
    _dragNode = null; _isPanning = false;
  });

  // ── Mouseleave container ──
  container.addEventListener('mouseleave', () => {
    if (_hoveredId) {
      _hoveredId = null;
      hideTooltip();
      clearHoverState();
      setParticleHover(null);
    }
    if (_isPanning) {
      _isPanning = false;
      container.classList.remove('dragging');
    }
  });

  // ── Wheel zoom ──
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const oldZoom = zoom;
    let newZoom = zoom * (e.deltaY < 0 ? 1.1 : 0.9);
    newZoom = Math.max(0.3, Math.min(3, newZoom));
    setZoom(newZoom);
    setPanX(e.clientX - (e.clientX - panX) * (newZoom / oldZoom));
    setPanY(e.clientY - (e.clientY - panY) * (newZoom / oldZoom));
    updateGalaxyTransform();
  }, { passive: false });

  // ── Touch events ──
  let touchStartEl = null;
  let touchStartTime = 0;
  let touchStartPos = { x: 0, y: 0 };
  let lastTouchDist = 0;
  let _touchDragNode = null;
  let _touchIsDragging = false;

  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartEl = e.target.closest('.planet-node');
      touchStartTime = Date.now();
      touchStartPos = { x: touch.clientX, y: touch.clientY };
      _lastMouse = { x: touch.clientX, y: touch.clientY };
      _touchIsDragging = false;

      if (touchStartEl) {
        // Start potential planet drag
        const id = touchStartEl.dataset.domain;
        _touchDragNode = nodeMap[id] || null;
        if (_touchDragNode) {
          _touchDragNode.fx = _touchDragNode.x;
          _touchDragNode.fy = _touchDragNode.y;
          touchStartEl.style.willChange = 'left, top';
        }
        e.preventDefault();
      } else {
        _touchDragNode = null;
      }
    } else if (e.touches.length === 2) {
      // If we were dragging a planet, cancel it on pinch
      if (_touchDragNode) {
        const dragDiv = getPlanetEl(_touchDragNode.id);
        if (dragDiv) dragDiv.style.willChange = '';
        _touchDragNode.fx = null; _touchDragNode.fy = null;
        _touchDragNode = null;
        _touchIsDragging = false;
      }
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist = Math.sqrt(dx * dx + dy * dy);
    }
  }, { passive: false });

  container.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const dx = touch.clientX - _lastMouse.x;
      const dy = touch.clientY - _lastMouse.y;
      const totalDx = touch.clientX - touchStartPos.x;
      const totalDy = touch.clientY - touchStartPos.y;

      if (_touchDragNode) {
        // Dragging a planet
        if (Math.abs(totalDx) + Math.abs(totalDy) > 10) _touchIsDragging = true;
        _touchDragNode.x += dx / zoom;
        _touchDragNode.y += dy / zoom;
        _touchDragNode.fx = _touchDragNode.x;
        _touchDragNode.fy = _touchDragNode.y;
        updatePlanetPosition(_touchDragNode);
        hideTooltip();
      } else {
        // Panning on empty space
        if (Math.abs(totalDx) + Math.abs(totalDy) > 10) {
          touchStartEl = null;
          setPanX(panX + dx);
          setPanY(panY + dy);
          updateGalaxyTransform();
        }
      }
      _lastMouse = { x: touch.clientX, y: touch.clientY };
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
        updateGalaxyTransform();
      }
      lastTouchDist = dist;
      e.preventDefault();
    }
  }, { passive: false });

  container.addEventListener('touchend', () => {
    if (!_touchDragNode && !touchStartEl) {
      _touchIsDragging = false;
      lastTouchDist = 0;
      return;
    }
    if (_touchDragNode) {
      const dragDiv = getPlanetEl(_touchDragNode.id);
      if (dragDiv) dragDiv.style.willChange = '';

      if (!_touchIsDragging) {
        // Tap on planet (no significant drag) -> enter planet
        const id = _touchDragNode.id;
        _touchDragNode.fx = null; _touchDragNode.fy = null;
        _touchDragNode = null;
        _touchIsDragging = false;
        touchStartEl = null;
        lastTouchDist = 0;
        if (tourState.active) return;
        enterPlanet(id);
        track('planet_click', { planet: id });
        return;
      } else {
        track('planet_drag', { planet: _touchDragNode.id, method: 'touch' });
        _touchDragNode.fx = null; _touchDragNode.fy = null;
      }
    } else if (touchStartEl && Date.now() - touchStartTime < 300) {
      // Tap on planet without drag node (fallback)
      const id = touchStartEl.dataset.domain;
      touchStartEl = null;
      lastTouchDist = 0;
      _touchDragNode = null;
      _touchIsDragging = false;
      if (tourState.active) return;
      if (id) {
        enterPlanet(id);
        track('planet_click', { planet: id });
      }
      return;
    }
    touchStartEl = null;
    lastTouchDist = 0;
    _touchDragNode = null;
    _touchIsDragging = false;
  });

  // ── Keyboard planet navigation on container ──
  container.addEventListener('keydown', (e) => {
    if (currentLevel !== 'galaxy') return;
    if (tourState.active) return;

    const sorted = getSortedPlanetEls();
    if (!sorted.length) return;

    const currentFocused = document.activeElement;
    let currentIdx = sorted.findIndex(({ el }) => el === currentFocused);

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        currentIdx = currentIdx < 0 ? 0 : (currentIdx + 1) % sorted.length;
        sorted[currentIdx].el.focus();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        currentIdx = currentIdx < 0 ? sorted.length - 1 : (currentIdx - 1 + sorted.length) % sorted.length;
        sorted[currentIdx].el.focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (currentFocused && currentFocused.dataset && currentFocused.dataset.domain) {
          enterPlanet(currentFocused.dataset.domain);
          track('planet_click', { planet: currentFocused.dataset.domain, method: 'keyboard' });
        }
        return;
      case 'Escape':
        e.preventDefault();
        currentFocused.blur();
        return;
      default:
        return;
    }

    // Announce the focused planet
    const focusedId = sorted[currentIdx].id;
    const desc = PRODUCT_DATA[focusedId] ? PRODUCT_DATA[focusedId].description.substring(0, 80) : '';
    const label = nodeMap[focusedId] ? nodeMap[focusedId].label : focusedId;
    announce(`${label}: ${desc}`);
  });
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
        const drop = document.getElementById('searchDrop');
        const dropOpen = drop.classList.contains('open');
        if (dropOpen && !drop.contains(document.activeElement)) {
          closeSearch();
        } else if (!dropOpen) {
          searchShell.classList.remove('focused');
        }
      }
    }, 150);
  });

  let _arrowUsed = false;

  searchInput.addEventListener('input', () => {
    _arrowUsed = false;
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
      _arrowUsed = false;
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;
      if (_arrowUsed && searchResults.length > 0 && searchIndex >= 0) {
        activateResult(searchIndex);
      } else {
        const currentResults = [...searchResults];
        closeSearch();
        setTimeout(() => { enterSearchResults(query, currentResults, {}); }, 100);
      }
      _arrowUsed = false;
      return;
    }
    const dropOpen = document.getElementById('searchDrop').classList.contains('open');
    if (dropOpen) {
      if (e.key === 'ArrowDown') { e.preventDefault(); _arrowUsed = true; cycleResult(1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); _arrowUsed = true; cycleResult(-1); }
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
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
      track('keyboard_shortcut', { key: 'Cmd+K' });
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
  });
}

// ── Help Button ──
function setupHelpButton() {
  const btn = document.getElementById('helpBtn');
  const stack = document.getElementById('helpStack');
  if (!btn || !stack) return;
  const show = () => { stack.classList.add('visible'); btn.classList.add('pressed'); };
  const hide = () => { stack.classList.remove('visible'); btn.classList.remove('pressed'); };
  const toggle = () => { stack.classList.contains('visible') ? hide() : show(); };
  btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !stack.contains(e.target)) hide();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
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
  updateAllPositions(nodes, edges);
  resizeParticleCanvas();
  resizeStarfield();
}

// ── Popstate handler ──
window.addEventListener('popstate', () => {
  if (!hashUpdateInProgress) {
    handleHashNavigation();
  }
});

// ── Lazy Entity Loading ──
const loadEntities = async () => {
  try {
    const module = await import(`${productsBase}/entities.js?v=24`);
    _entityData = module.default;
    setEntitiesLoaded(true);

    const entityLinks = {};
    for (const domainKey in _entityData) {
      const domain = _entityData[domainKey];
      for (const key of ENTITY_KEYS) {
        for (const item of (domain[key] || [])) {
          if (item.name && item.sourceUrl) {
            entityLinks[item.name] = item.sourceUrl;
          }
        }
      }
    }
    setEntityLinks(entityLinks);

    mergeEntities();
    _entityData = null;
    rebuildSearchIndex();
    buildStats();
    refreshCurrentView();
  } catch (e) {
    console.warn(`[${productId}] Failed to load entity data`, e);
  }
};

// ── First-Visit Onboarding Hint ──
let _onboardingDismiss = null;

function showOnboardingHint() {
  if (_onboardingDismiss) _onboardingDismiss();

  const verb = window.matchMedia('(pointer: coarse)').matches ? 'Tap' : 'Click';
  const hint = document.createElement('div');
  hint.className = 'onboarding-hint';
  hint.setAttribute('role', 'status');

  const primary = document.createElement('div');
  primary.className = 'onboarding-primary';
  primary.textContent = `${verb} any planet to explore the ${PRODUCT_CONFIG.name || 'product'} universe`;
  const secondary = document.createElement('div');
  secondary.className = 'onboarding-secondary';
  secondary.textContent = 'or use the search bar to ask anything';
  hint.appendChild(primary);
  hint.appendChild(secondary);

  document.body.appendChild(hint);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    hint.classList.add('visible');
  }));

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    _onboardingDismiss = null;
    hint.classList.remove('visible');
    safeLSSet(lsPrefix + 'visited', '1');
    setTimeout(() => { if (hint.parentNode) hint.parentNode.removeChild(hint); }, 500);
    clearTimeout(autoHide);
  };

  _onboardingDismiss = dismiss;
  document.addEventListener('click', dismiss, { once: true });
  document.addEventListener('keydown', dismiss, { once: true });
  const autoHide = setTimeout(dismiss, 12000);
}

// ── Init ──
async function init() {
  await loadProductData();

  const lightMode = safeLSGet(lsPrefix + 'theme') === 'light';
  if (lightMode) {
    document.body.classList.add('theme-light');
  }

  // NOTE: innerHTML safe — uiSvg returns trusted app-owned SVG strings
  document.getElementById('search-icon').innerHTML = uiSvg('search', 18);
  document.getElementById('tour-icon').innerHTML = uiSvg('tour', 16);
  document.getElementById('help-icon').innerHTML = uiSvg('help', 18);
  document.getElementById('feedback-icon').innerHTML = uiSvg('feedback', 18);
  document.getElementById('theme-icon').innerHTML = uiSvg(lightMode ? 'sun' : 'moon', 18);

  const helpTourIcon = document.querySelector('.help-tour-icon');
  if (helpTourIcon) helpTourIcon.innerHTML = uiSvg('tour', 14);
  const helpDragIcon = document.querySelector('.help-drag-icon');
  if (helpDragIcon) helpDragIcon.innerHTML = '&#x1F91A;';

  // Build initial state
  mergeEntities();
  rebuildSearchIndex();
  createTooltip();
  initStarfield();

  // Init physics and compute layout to convergence
  initGraph();
  computeLayout();

  // Create DOM planets and edges from settled positions
  initGalaxyDOM(nodes, edges, nodeMap);

  // Init particles (only remaining canvas)
  initParticles();

  setupGalaxyEvents();
  setupKeyboard();
  setupHelpButton();
  updateBreadcrumb();
  buildStats();
  initTours();

  document.getElementById('nav-brand').addEventListener('click', () => navigateTo('galaxy'));
  document.getElementById('nav-brand').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateTo('galaxy'); }
  });

  document.getElementById('tour-btn').addEventListener('click', () => toggleTourPicker());
  document.getElementById('theme-toggle').addEventListener('click', () => toggleTheme());

  // Copy link button in navbar (galaxy view sharing affordance)
  const copyLinkBtn = document.createElement('button');
  copyLinkBtn.className = 'nav-copy-link';
  copyLinkBtn.setAttribute('aria-label', 'Copy link');
  copyLinkBtn.setAttribute('title', 'Copy link');
  // Safe: uiSvg returns trusted app-owned SVG strings (not user input)
  copyLinkBtn.innerHTML = uiSvg('link', 16);
  copyLinkBtn.addEventListener('click', () => copyCurrentLink(copyLinkBtn));
  const zoomIndicator = document.getElementById('zoom-indicator');
  zoomIndicator.parentNode.insertBefore(copyLinkBtn, zoomIndicator);

  window.addEventListener('resize', onResize);
  requestAnimationFrame(particleTick);

  if (!safeLSGet(lsPrefix + 'visited')) {
    showOnboardingHint();
  }

  requestAnimationFrame(() => loadEntities());

  if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '#') {
    handleHashNavigation();
  }
}

document.addEventListener('DOMContentLoaded', init);
