// ══════════════════════════════════════════════════════════════
//  GALAXY RENDERER — DOM planets + SVG edges
//  Replaces canvas-based renderer with DOM elements for GPU
//  acceleration, native events, and accessibility.
// ══════════════════════════════════════════════════════════════

import { lightenColor, darkenColor } from './utils.js';
import { domainSvg } from './icons.js';
import { zoom, panX, panY, layoutW, layoutH } from './physics.js';
import { prefersReducedMotion, tourState } from './state.js';

let _container = null;
let _edgesSvg = null;
let _planetEls = {};   // domainId -> div element
let _edgeEls = [];     // { el, source, target }
let _nodeMap = {};

// ── Transition state management ──
let _isTransitioning = false;
let _transitionTimer = null;
let _transitionEndHandler = null;

// ── Bezier control point (ported from renderer.js) ──
function edgeBezier(s, t) {
  const mx = (s.x + t.x) / 2 + (-(t.y - s.y) * 0.1);
  const my = (s.y + t.y) / 2 + ((t.x - s.x) * 0.1);
  return { mx, my };
}

// ── Build DOM planets and SVG edges ──
// NOTE: All innerHTML usage here is safe. Content comes from trusted
// product data (app-owned config/data.js files), not user input.
export function initGalaxyDOM(nodes, edges, nodeMap) {
  _nodeMap = nodeMap;
  _container = document.getElementById('galaxyContainer');
  _edgesSvg = document.getElementById('galaxyEdges');
  if (!_container || !_edgesSvg) return;

  // Clear any existing content
  _container.querySelectorAll('.planet-node').forEach(el => el.remove());
  // Safe: clearing SVG children only (no user input)
  _edgesSvg.innerHTML = '';
  _edgesSvg.style.setProperty('--zoom', zoom);
  _planetEls = {};
  _edgeEls = [];

  // Create SVG edges first (behind planets in DOM order)
  for (const e of edges) {
    const s = nodeMap[e.source], t = nodeMap[e.target];
    if (!s || !t) continue;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add('galaxy-edge');
    path.dataset.source = e.source;
    path.dataset.target = e.target;
    _updateEdgePathZoomed(path, s, t);
    _edgesSvg.appendChild(path);

    // Invisible hit area for hover detection (wider stroke)
    const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    hitPath.classList.add('galaxy-edge-hit');
    hitPath.dataset.source = e.source;
    hitPath.dataset.target = e.target;
    _updateEdgePathZoomed(hitPath, s, t);
    _edgesSvg.appendChild(hitPath);

    _edgeEls.push({ el: path, hitEl: hitPath, source: e.source, target: e.target, desc: e.label || '' });
  }

  // Wire edge hover events
  _edgesSvg.addEventListener('mouseover', (ev) => {
    if (tourState.active) return;
    const hit = ev.target.closest('.galaxy-edge-hit');
    if (!hit) return;
    const edge = _edgeEls.find(e => e.hitEl === hit);
    if (edge && edge.desc) _showEdgeTooltip(edge, ev.clientX, ev.clientY);
  });
  _edgesSvg.addEventListener('mouseout', (ev) => {
    const hit = ev.target.closest('.galaxy-edge-hit');
    if (!hit) return;
    _hideEdgeTooltip();
  });
  _edgesSvg.addEventListener('mousemove', (ev) => {
    if (_edgeTooltip && _edgeTooltip.classList.contains('visible')) {
      _positionEdgeTooltip(ev.clientX, ev.clientY);
    }
  });

  // Create planet divs
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const div = document.createElement('div');
    div.className = 'planet-node';
    div.dataset.domain = n.id;
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', `${n.label}: ${n.desc.substring(0, 80)}`);
    div.style.setProperty('--planet-color', n.color);
    div.style.setProperty('--planet-r', `${n.radius * zoom}px`);
    div.style.setProperty('--zoom', zoom);
    div.style.setProperty('--planet-light', lightenColor(n.color, 40));
    div.style.setProperty('--planet-dark', darkenColor(n.color, 30));
    div.style.setProperty('--entrance-i', i);
    div.style.left = `${n.x * zoom + panX}px`;
    div.style.top = `${n.y * zoom + panY}px`;

    // Icon (safe: domainSvg returns trusted app-owned SVG from icons.js)
    const iconMarkup = domainSvg(n.id, Math.round(n.radius * 0.9));
    if (iconMarkup) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'planet-icon';
      iconSpan.innerHTML = iconMarkup;
      div.appendChild(iconSpan);
    }

    // Label
    const label = document.createElement('span');
    label.className = 'planet-label';
    label.textContent = n.label;
    div.appendChild(label);

    _container.appendChild(div);
    _planetEls[n.id] = div;
  }
}

// Zoomed variant: applies zoom + pan to edge path coordinates
function _updateEdgePathZoomed(pathEl, s, t) {
  const { mx, my } = edgeBezier(s, t);
  const sx = s.x * zoom + panX, sy = s.y * zoom + panY;
  const tx = t.x * zoom + panX, ty = t.y * zoom + panY;
  const cmx = mx * zoom + panX, cmy = my * zoom + panY;
  pathEl.setAttribute('d', `M${sx},${sy} Q${cmx},${cmy} ${tx},${ty}`);
}

// ── Transform (position-based zoom/pan for crisp text) ──
// Instead of CSS scale() on the container (which rasterizes at 1x then
// stretches the bitmap), we recalculate every planet's left/top/size and
// every SVG edge path at the zoomed coordinates.  With ~18 planets and
// ~50 edges this is trivially fast and keeps text/gradients sharp.
//
// CSS transform on .galaxy-container is reserved ONLY for animated
// fly-in/fly-out transitions (where brief blur during 600ms is fine).
export function updateGalaxyTransform() {
  if (!_container) return;

  // Update planet positions, sizes, and zoom factor for text scaling
  for (const [id, div] of Object.entries(_planetEls)) {
    const node = _nodeMap[id];
    if (!node) continue;
    div.style.left = `${node.x * zoom + panX}px`;
    div.style.top = `${node.y * zoom + panY}px`;
    div.style.setProperty('--planet-r', `${node.radius * zoom}px`);
    div.style.setProperty('--zoom', zoom);
  }

  // Update SVG edge paths with zoomed coordinates
  for (const e of _edgeEls) {
    const s = _nodeMap[e.source], t = _nodeMap[e.target];
    if (s && t) {
      _updateEdgePathZoomed(e.el, s, t);
      if (e.hitEl) _updateEdgePathZoomed(e.hitEl, s, t);
    }
  }

  // Scale SVG edge container to match zoom (stroke-width, dash patterns)
  if (_edgesSvg) {
    _edgesSvg.style.setProperty('--zoom', zoom);
  }
}

// CSS-transform variant: used ONLY for animated transitions (tour-pan)
// where we need the browser's CSS transition engine to interpolate.
export function updateGalaxyTransformCSS() {
  if (!_container) return;
  _container.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
}

// Sync positions after a CSS transition ends — call this to "bake" the
// CSS transform back into individual positions and clear the transform.
export function bakeTransformToPositions() {
  if (!_container) return;
  _container.style.transform = '';
  updateGalaxyTransform();
}

// ── Position updates ──
export function updatePlanetPosition(node) {
  const div = _planetEls[node.id];
  if (div) {
    div.style.left = `${node.x * zoom + panX}px`;
    div.style.top = `${node.y * zoom + panY}px`;
    div.style.setProperty('--planet-r', `${node.radius * zoom}px`);
    div.style.setProperty('--zoom', zoom);
  }
  // Update connected edges with zoomed coordinates
  for (const e of _edgeEls) {
    if (e.source === node.id || e.target === node.id) {
      const s = _nodeMap[e.source], t = _nodeMap[e.target];
      if (s && t) {
        _updateEdgePathZoomed(e.el, s, t);
        if (e.hitEl) _updateEdgePathZoomed(e.hitEl, s, t);
      }
    }
  }
}

export function updateAllPositions(nodes, edges) {
  for (const n of nodes) {
    const div = _planetEls[n.id];
    if (div) {
      div.style.left = `${n.x * zoom + panX}px`;
      div.style.top = `${n.y * zoom + panY}px`;
      div.style.setProperty('--planet-r', `${n.radius * zoom}px`);
      div.style.setProperty('--zoom', zoom);
    }
  }
  for (const e of _edgeEls) {
    const s = _nodeMap[e.source], t = _nodeMap[e.target];
    if (s && t) {
      _updateEdgePathZoomed(e.el, s, t);
      if (e.hitEl) _updateEdgePathZoomed(e.hitEl, s, t);
    }
  }
}

// ── Hover state ──
export function applyHoverState(planetId) {
  for (const [id, el] of Object.entries(_planetEls)) {
    el.classList.toggle('dimmed', id !== planetId);
    el.classList.toggle('hovered', id === planetId);
  }
  const connectedIds = new Set();
  for (const e of _edgeEls) {
    const connected = e.source === planetId || e.target === planetId;
    e.el.classList.toggle('edge-connected', connected);
    e.el.classList.toggle('dimmed', !connected);
    if (connected) {
      connectedIds.add(e.source);
      connectedIds.add(e.target);
    }
  }
  for (const id of connectedIds) {
    const el = _planetEls[id];
    if (el && id !== planetId) {
      el.classList.remove('dimmed');
      el.classList.add('connected');
    }
  }
}

export function clearHoverState() {
  for (const el of Object.values(_planetEls)) {
    el.classList.remove('dimmed', 'hovered', 'connected');
  }
  for (const e of _edgeEls) {
    e.el.classList.remove('edge-connected', 'dimmed');
  }
  _hideEdgeTooltip();
}

// ── Tour dimming ──
export function applyTourDimming(focusPlanet, stopPlanets, highlightedEdges) {
  for (const [id, el] of Object.entries(_planetEls)) {
    el.classList.toggle('dimmed', !(stopPlanets && stopPlanets.has(id)));
  }
  for (const e of _edgeEls) {
    const edgeKey = [e.source, e.target].sort().join('--');
    const isHighlighted = highlightedEdges && highlightedEdges.has(edgeKey);
    e.el.classList.toggle('tour-edge', isHighlighted);
    e.el.classList.toggle('dimmed', !isHighlighted);
  }
}

export function clearTourDimming() {
  for (const el of Object.values(_planetEls)) {
    el.classList.remove('dimmed');
  }
  for (const e of _edgeEls) {
    e.el.classList.remove('tour-edge', 'dimmed');
  }
}

// ── Search highlight ──
export function highlightPlanet(planetId) {
  const el = _planetEls[planetId];
  if (!el) return;
  el.classList.add('highlight-pulse');
  setTimeout(() => el.classList.remove('highlight-pulse'), 1500);
}

// ── Reset galaxy to clean resting state ──
// Safety net: forcefully clears all transition artifacts.
// Call at the START of every fly-in/fly-out and on any direct galaxy navigation.
export function resetGalaxyState() {
  if (!_container) return;

  // Cancel any in-progress transition
  if (_transitionTimer) {
    clearTimeout(_transitionTimer);
    _transitionTimer = null;
  }
  if (_transitionEndHandler) {
    _container.removeEventListener('transitionend', _transitionEndHandler);
    _transitionEndHandler = null;
  }

  // Strip all transition classes
  _container.classList.remove('fly-in', 'fly-out');

  // Force-clear inline styles that transitions set
  _container.style.transform = '';
  _container.style.opacity = '';
  _container.style.pointerEvents = '';

  // Ensure container is interactive
  _container.classList.remove('hidden');

  // Reset particle canvas
  const particle = document.getElementById('particle-canvas');
  if (particle) {
    particle.style.opacity = '';
    particle.style.transition = '';
    particle.classList.remove('hidden');
  }

  _isTransitioning = false;
}

// ── Visibility ──
export function setGalaxyVisible(visible) {
  if (_container) {
    _container.classList.toggle('hidden', !visible);
    if (visible) {
      // Ensure pointer-events and opacity are clean when showing
      _container.style.pointerEvents = '';
      _container.style.opacity = '';
    }
  }
  const particle = document.getElementById('particle-canvas');
  if (particle) {
    particle.classList.toggle('hidden', !visible);
    if (visible) particle.style.opacity = '';
  }
}

// ── Fly-in: zoom galaxy container into a planet ──
// Returns immediately for reduced motion; otherwise animates with CSS transitions.
// Uses resetGalaxyState() as safety net, _isTransitioning guard, and setTimeout fallback.
export function flyIntoPlanet(node, callback) {
  if (!_container || !node) {
    if (callback) callback();
    return;
  }

  const particle = document.getElementById('particle-canvas');

  if (prefersReducedMotion) {
    resetGalaxyState();
    _container.classList.add('hidden');
    if (particle) { particle.classList.add('hidden'); particle.style.opacity = ''; }
    if (callback) callback();
    return;
  }

  // Cancel any in-progress transition before starting
  if (_isTransitioning) resetGalaxyState();
  _isTransitioning = true;

  // Fade out particle canvas over 300ms (independent of container transition)
  if (particle) {
    particle.style.transition = 'opacity 300ms ease';
    particle.style.opacity = '0';
  }

  // Calculate CSS transform to center+scale so the planet fills ~60% of viewport.
  // Positions are already baked with zoom/pan, so use screen coords for the planet.
  const screenX = node.x * zoom + panX;
  const screenY = node.y * zoom + panY;
  const targetScale = Math.min(layoutW, layoutH) / (node.radius * zoom * 2) * 0.6;
  const scale = Math.min(targetScale, 8);
  const tx = layoutW / 2 - screenX * scale;
  const ty = layoutH / 2 - screenY * scale;

  // Ensure clean starting state (no leftover classes/styles)
  _container.classList.remove('fly-in', 'fly-out', 'hidden');
  _container.style.transform = '';
  _container.style.opacity = '';
  _container.style.pointerEvents = 'none'; // Prevent clicks during fly-in

  // Force reflow so the browser registers the starting state
  void _container.offsetHeight;

  // Add fly-in transition class and apply target transform
  _container.classList.add('fly-in');
  _container.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  _container.style.opacity = '0';

  // Fly-in CSS transition durations: transform 600ms, opacity 200ms delayed 400ms
  // Total: 600ms. Fallback at 600 + 150 = 750ms.
  const FLY_IN_FALLBACK_MS = 750;
  let completed = false;

  function completeFlyIn() {
    if (completed) return;
    completed = true;
    _isTransitioning = false;

    if (_transitionTimer) { clearTimeout(_transitionTimer); _transitionTimer = null; }
    if (_transitionEndHandler) {
      _container.removeEventListener('transitionend', _transitionEndHandler);
      _transitionEndHandler = null;
    }

    _container.classList.remove('fly-in');
    _container.classList.add('hidden');
    _container.style.transform = '';
    _container.style.opacity = '';
    _container.style.pointerEvents = '';
    if (particle) {
      particle.classList.add('hidden');
      particle.style.opacity = '';
      particle.style.transition = '';
    }
    if (callback) callback();
  }

  _transitionEndHandler = function onEnd(e) {
    // Complete on transform end (it finishes last with 600ms duration)
    if (e.target !== _container) return;
    if (e.propertyName === 'transform' || e.propertyName === 'opacity') {
      completeFlyIn();
    }
  };
  _container.addEventListener('transitionend', _transitionEndHandler);

  // Fallback timeout in case transitionend doesn't fire
  _transitionTimer = setTimeout(completeFlyIn, FLY_IN_FALLBACK_MS);
}

// ── Fly-out: zoom galaxy container back from a planet ──
// Uses resetGalaxyState() as safety net, _isTransitioning guard, and setTimeout fallback.
export function flyOutFromPlanet(node, callback) {
  if (!_container) {
    if (callback) callback();
    return;
  }

  const particle = document.getElementById('particle-canvas');

  if (prefersReducedMotion || !node) {
    resetGalaxyState();
    if (callback) callback();
    return;
  }

  // Cancel any in-progress transition before starting
  if (_isTransitioning) resetGalaxyState();
  _isTransitioning = true;

  // Position container at the zoomed-in state (matching where fly-in ended).
  // Positions are baked with zoom/pan, so use screen coords for the planet.
  const screenX = node.x * zoom + panX;
  const screenY = node.y * zoom + panY;
  const targetScale = Math.min(layoutW, layoutH) / (node.radius * zoom * 2) * 0.6;
  const scale = Math.min(targetScale, 8);
  const tx = layoutW / 2 - screenX * scale;
  const ty = layoutH / 2 - screenY * scale;

  // Set starting position (zoomed-in, transparent)
  _container.classList.remove('hidden', 'fly-in', 'fly-out');
  _container.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  _container.style.opacity = '0';
  _container.style.pointerEvents = 'none'; // Prevent clicks during fly-out

  // Show particle canvas (faded) so it fades in with the fly-out
  if (particle) {
    particle.classList.remove('hidden');
    particle.style.transition = 'opacity 600ms ease';
    particle.style.opacity = '0';
  }

  // Force reflow so browser registers the starting state
  void _container.offsetHeight;

  // Add fly-out transition class and animate to identity
  _container.classList.add('fly-out');
  _container.style.transform = '';
  _container.style.opacity = '';
  if (particle) particle.style.opacity = '';

  // Fly-out CSS transition: transform 800ms, opacity 200ms
  // Total: 800ms. Fallback at 800 + 150 = 950ms.
  const FLY_OUT_FALLBACK_MS = 950;
  let completed = false;

  function completeFlyOut() {
    if (completed) return;
    completed = true;
    _isTransitioning = false;

    if (_transitionTimer) { clearTimeout(_transitionTimer); _transitionTimer = null; }
    if (_transitionEndHandler) {
      _container.removeEventListener('transitionend', _transitionEndHandler);
      _transitionEndHandler = null;
    }

    _container.classList.remove('fly-out');
    _container.style.transform = '';
    _container.style.opacity = '';
    _container.style.pointerEvents = '';
    if (particle) {
      particle.style.opacity = '';
      particle.style.transition = '';
    }
    if (callback) callback();
  }

  _transitionEndHandler = function onEnd(e) {
    if (e.target !== _container) return;
    if (e.propertyName === 'transform') {
      completeFlyOut();
    }
  };
  _container.addEventListener('transitionend', _transitionEndHandler);

  // Fallback timeout in case transitionend doesn't fire
  _transitionTimer = setTimeout(completeFlyOut, FLY_OUT_FALLBACK_MS);
}

// ── Edge Tooltip ──
let _edgeTooltip = null;

function _createEdgeTooltip() {
  _edgeTooltip = document.createElement('div');
  _edgeTooltip.className = 'edge-tooltip';
  _edgeTooltip.setAttribute('role', 'tooltip');
  document.body.appendChild(_edgeTooltip);
}

// Safe: all content (node labels, colors, descriptions) from trusted product data, not user input
function _showEdgeTooltip(edgeData, x, y) {
  if (!_edgeTooltip) _createEdgeTooltip();
  const sNode = _nodeMap[edgeData.source];
  const tNode = _nodeMap[edgeData.target];
  if (!sNode || !tNode) return;
  // NOTE: innerHTML safe here, same pattern as planet tooltip. All data is app-owned.
  _edgeTooltip.innerHTML =
    `<div class="et-planets"><span style="color:${sNode.color}">${sNode.label}</span> <span class="et-arrow">\u2194</span> <span style="color:${tNode.color}">${tNode.label}</span></div>` +
    `<div class="et-desc">${edgeData.desc}</div>`;
  _edgeTooltip.classList.add('visible');
  _positionEdgeTooltip(x, y);
}

export function hideEdgeTooltip() {
  _hideEdgeTooltip();
}

function _hideEdgeTooltip() {
  if (_edgeTooltip) _edgeTooltip.classList.remove('visible');
}

function _positionEdgeTooltip(x, y) {
  if (!_edgeTooltip) return;
  const tx = Math.min(x + 16, innerWidth - 280);
  const ty = Math.min(y + 16, innerHeight - 80);
  _edgeTooltip.style.left = `${tx}px`;
  _edgeTooltip.style.top = `${ty}px`;
}

// ── Get planet element (for focus) ──
export function getPlanetEl(id) {
  return _planetEls[id] || null;
}

// ── Get all planet elements sorted by x position ──
export function getSortedPlanetEls() {
  return Object.entries(_planetEls)
    .sort(([, a], [, b]) => parseFloat(a.style.left) - parseFloat(b.style.left))
    .map(([id, el]) => ({ id, el }));
}
