// ══════════════════════════════════════════════════════════════
//  GALAXY RENDERER — DOM planets + SVG edges
//  Replaces canvas-based renderer with DOM elements for GPU
//  acceleration, native events, and accessibility.
// ══════════════════════════════════════════════════════════════

import { lightenColor, darkenColor } from './utils.js';
import { domainSvg } from './icons.js';
import { zoom, panX, panY } from './physics.js';

let _container = null;
let _edgesSvg = null;
let _planetEls = {};   // domainId -> div element
let _edgeEls = [];     // { el, source, target }
let _nodeMap = {};

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
  _edgesSvg.innerHTML = '';
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
    _updateEdgePath(path, s, t);
    _edgesSvg.appendChild(path);
    _edgeEls.push({ el: path, source: e.source, target: e.target });
  }

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
    div.style.setProperty('--planet-r', `${n.radius}px`);
    div.style.setProperty('--planet-light', lightenColor(n.color, 40));
    div.style.setProperty('--planet-dark', darkenColor(n.color, 30));
    div.style.setProperty('--entrance-i', i);
    div.style.left = `${n.x}px`;
    div.style.top = `${n.y}px`;

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

function _updateEdgePath(pathEl, s, t) {
  const { mx, my } = edgeBezier(s, t);
  pathEl.setAttribute('d', `M${s.x},${s.y} Q${mx},${my} ${t.x},${t.y}`);
}

// ── Transform ──
export function updateGalaxyTransform() {
  if (!_container) return;
  _container.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
}

// ── Position updates ──
export function updatePlanetPosition(node) {
  const div = _planetEls[node.id];
  if (div) {
    div.style.left = `${node.x}px`;
    div.style.top = `${node.y}px`;
  }
  // Update connected edges
  for (const e of _edgeEls) {
    if (e.source === node.id || e.target === node.id) {
      const s = _nodeMap[e.source], t = _nodeMap[e.target];
      if (s && t) _updateEdgePath(e.el, s, t);
    }
  }
}

export function updateAllPositions(nodes, edges) {
  for (const n of nodes) {
    const div = _planetEls[n.id];
    if (div) {
      div.style.left = `${n.x}px`;
      div.style.top = `${n.y}px`;
      div.style.setProperty('--planet-r', `${n.radius}px`);
    }
  }
  for (const e of _edgeEls) {
    const s = _nodeMap[e.source], t = _nodeMap[e.target];
    if (s && t) _updateEdgePath(e.el, s, t);
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

// ── Visibility ──
export function setGalaxyVisible(visible) {
  if (_container) {
    _container.classList.toggle('hidden', !visible);
  }
  const particle = document.getElementById('particle-canvas');
  if (particle) {
    particle.classList.toggle('hidden', !visible);
  }
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
