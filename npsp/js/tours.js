// ══════════════════════════════════════════════════════════════
//  TOURS — Constellation Stories guided learning tours
//  State management, camera orchestration, UI rendering
// ══════════════════════════════════════════════════════════════

import { TOURS } from './tour-data.js';
import { NPSP } from './npsp-data.js';
import { domainSvg } from './icons.js?v=3';
import { safeLSGet, safeLSSet, track, announce } from './utils.js';
import { animatePanTo, resetZoomPan, nodeMap, setGraphSettled } from './physics.js';
import {
  tourState,
  setTourFocusNode, setTourHighlightedEdges, setTourStopPlanets
} from './state.js';
import {
  currentLevel, navigateTo, setGalaxyCanvasVisible,
  setHash, updateDocumentTitle
} from './navigation.js';

// Animation callbacks set by main.js to break circular dependency
let _graphTick = null;
let _particleTick = null;

export const setTourAnimationCallbacks = (graphTickFn, particleTickFn) => {
  _graphTick = graphTickFn;
  _particleTick = particleTickFn;
};

function restartAnimation() {
  setGraphSettled(false);
  if (_graphTick) requestAnimationFrame(_graphTick);
  if (_particleTick) requestAnimationFrame(_particleTick);
}

export function initTours() {
  // Restore mode preference
  const saved = safeLSGet('npsp-tour-mode');
  if (saved === 'dev' || saved === 'admin') tourState.mode = saved;

  // Create tour picker dropdown container
  const picker = document.createElement('div');
  picker.id = 'tour-picker';
  picker.className = 'tour-picker';
  picker.setAttribute('role', 'dialog');
  picker.setAttribute('aria-label', 'Choose a tour');
  // NOTE: innerHTML usage is safe here. All content is from trusted TOURS
  // data object (app-owned tour-data.js), not user input.
  picker.innerHTML = renderTourPicker();
  document.body.appendChild(picker);

  // Attach event listeners for tour picker items
  picker.querySelectorAll('[data-tour-id]').forEach((el) => {
    el.addEventListener('click', () => startTour(el.dataset.tourId));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startTour(el.dataset.tourId); }
    });
  });

  // Focus trap: Tab cycles within picker, Escape closes it
  picker.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      picker.classList.remove('open');
      const btn = document.getElementById('tour-btn');
      if (btn) btn.focus();
      return;
    }
    if (e.key === 'Tab') {
      const items = picker.querySelectorAll('[data-tour-id]');
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Create narration card container
  const card = document.createElement('div');
  card.id = 'tour-card';
  card.className = 'tour-card';
  document.body.appendChild(card);

  // Close picker when clicking outside, return focus to tour button
  document.addEventListener('click', (e) => {
    const pickerEl = document.getElementById('tour-picker');
    const btn = document.getElementById('tour-btn');
    if (pickerEl && btn && !pickerEl.contains(e.target) && !btn.contains(e.target)) {
      if (pickerEl.classList.contains('open')) {
        pickerEl.classList.remove('open');
        btn.focus();
      }
    }
  });
}

function renderTourPicker() {
  return TOURS.map((t) =>
    `<div class="tour-picker-item" data-tour-id="${t.id}" role="button" tabindex="0">` +
      `<div class="tour-picker-icon">${t.icon}</div>` +
      `<div class="tour-picker-info">` +
        `<div class="tour-picker-title">${t.title}</div>` +
        `<div class="tour-picker-desc">${t.desc}</div>` +
        `<div class="tour-picker-meta">${t.stops.length} stops</div>` +
      `</div></div>`
  ).join('');
}

export function toggleTourPicker() {
  const picker = document.getElementById('tour-picker');
  if (!picker) return;
  const wasOpen = picker.classList.contains('open');
  picker.classList.toggle('open');

  if (!wasOpen) {
    // Opening: focus first tour item
    track('tour_picker_open', {});
    const first = picker.querySelector('[data-tour-id]');
    if (first) requestAnimationFrame(() => first.focus());
  } else {
    // Closing: return focus to tour button
    const btn = document.getElementById('tour-btn');
    if (btn) btn.focus();
  }
}

// Note: window.toggleTourPicker no longer needed
// since inline onclick was replaced with addEventListener in main.js

function startTour(tourId) {
  const tour = TOURS.find((t) => t.id === tourId);
  if (!tour) return;

  // Close picker
  const picker = document.getElementById('tour-picker');
  if (picker) picker.classList.remove('open');

  // If not on galaxy view, navigate there first
  if (currentLevel !== 'galaxy') {
    navigateTo('galaxy');
  }

  // Ensure galaxy canvas is visible
  setGalaxyCanvasVisible(true);

  // Build set of all planets in this tour
  const stopPlanets = new Set();
  for (const stop of tour.stops) {
    stopPlanets.add(stop.planet);
  }
  setTourStopPlanets(stopPlanets);

  // Set tour state
  tourState.active = true;
  tourState.tourId = tourId;
  tourState.stopIndex = 0;
  tourState.startTime = Date.now();
  tourState.stopStartTime = Date.now();

  // Go to first stop
  goToStop(0);

  // Immersive mode: hide galaxy chrome
  document.body.classList.add('tour-active');

  // Show narration card
  const card = document.getElementById('tour-card');
  if (card) card.classList.add('visible');

  track('tour_start', {
    tour_id: tourId,
    tour_title: tour.title,
    total_stops: tour.stops.length
  });
}

function goToStop(index) {
  const tour = TOURS.find((t) => t.id === tourState.tourId);
  if (!tour || index < 0 || index >= tour.stops.length) return;

  // Track time on previous stop
  const now = Date.now();
  if (tourState.stopStartTime && index !== tourState.stopIndex) {
    const timeOnStop = Math.round((now - tourState.stopStartTime) / 1000);
    track('tour_stop_view', {
      tour_id: tourState.tourId,
      stop_index: tourState.stopIndex,
      planet: tour.stops[tourState.stopIndex] ? tour.stops[tourState.stopIndex].planet : '',
      time_on_stop_seconds: timeOnStop
    });
  }
  tourState.stopStartTime = now;
  tourState.stopIndex = index;
  const stop = tour.stops[index];

  // Fire completion event when reaching the last stop
  if (index === tour.stops.length - 1) {
    const totalDuration = Math.round((now - tourState.startTime) / 1000);
    track('tour_complete', {
      tour_id: tourState.tourId,
      tour_title: tour.title,
      total_stops: tour.stops.length,
      duration_seconds: totalDuration
    });
  }

  // Set tour focus node for dimming
  setTourFocusNode(stop.planet);

  // Build highlighted edges set
  const highlightedEdges = new Set();
  if (stop.highlightEdges) {
    for (const edge of stop.highlightEdges) {
      const key = [stop.planet, edge].sort().join('--');
      highlightedEdges.add(key);
    }
  }
  setTourHighlightedEdges(highlightedEdges);

  // Animate camera to planet
  const node = nodeMap[stop.planet];
  if (node) {
    animatePanTo(node, 800, 1.4);
  }

  // Ensure rendering continues
  restartAnimation();

  // Update narration card
  renderNarrationCard(tour, stop, index);

  // B5: Screen reader announcement for tour stop
  const planetName = NPSP[stop.planet] ? NPSP[stop.planet].name : stop.planet;
  announce(`Tour stop ${index + 1} of ${tour.stops.length}: ${planetName}`);
}

export function advanceStop(direction) {
  if (!tourState.active) return;
  const tour = TOURS.find((t) => t.id === tourState.tourId);
  if (!tour) return;

  const newIndex = tourState.stopIndex + direction;
  if (newIndex < 0 || newIndex >= tour.stops.length) return;

  goToStop(newIndex);
  track('tour_navigate', { tour: tourState.tourId, stop: newIndex, direction: direction > 0 ? 'next' : 'prev' });
}

export function exitTour() {
  // Capture analytics before clearing state
  const tour = TOURS.find((t) => t.id === tourState.tourId);
  const totalStops = tour ? tour.stops.length : 0;
  const duration = Math.round((Date.now() - tourState.startTime) / 1000);
  const stopsViewed = tourState.stopIndex + 1;
  const completed = stopsViewed === totalStops;
  const exitTourId = tourState.tourId;

  // Track time on final stop
  if (tourState.stopStartTime && tour) {
    const timeOnStop = Math.round((Date.now() - tourState.stopStartTime) / 1000);
    track('tour_stop_view', {
      tour_id: exitTourId,
      stop_index: tourState.stopIndex,
      planet: tour.stops[tourState.stopIndex] ? tour.stops[tourState.stopIndex].planet : '',
      time_on_stop_seconds: timeOnStop
    });
  }

  tourState.active = false;
  tourState.tourId = null;
  tourState.stopIndex = 0;
  tourState.startTime = 0;
  tourState.stopStartTime = 0;

  // Clear visual state
  setTourHighlightedEdges(null);
  setTourFocusNode(null);
  setTourStopPlanets(null);

  // Exit immersive mode: restore galaxy chrome
  document.body.classList.remove('tour-active');

  // Hide narration card
  const card = document.getElementById('tour-card');
  if (card) card.classList.remove('visible');

  // Reset camera
  resetZoomPan();

  // Reset hash to galaxy view
  setHash('#/');
  updateDocumentTitle('galaxy');

  // Force re-render to clear dimming
  restartAnimation();

  track('tour_exit', {
    tour_id: exitTourId,
    total_stops: totalStops,
    stops_viewed: stopsViewed,
    completed: completed,
    duration_seconds: duration
  });
}

function setTourMode(mode) {
  tourState.mode = mode;
  safeLSSet('npsp-tour-mode', mode);

  // Re-render current card content without camera movement
  if (tourState.active) {
    const tour = TOURS.find((t) => t.id === tourState.tourId);
    if (tour) {
      renderNarrationCard(tour, tour.stops[tourState.stopIndex], tourState.stopIndex);
    }
  }

  track('tour_mode_change', { mode });
}

function renderNarrationCard(tour, stop, index) {
  const card = document.getElementById('tour-card');
  if (!card) return;

  const content = stop[tourState.mode];
  const isFirst = index === 0;
  const isLast = index === tour.stops.length - 1;
  const planetData = NPSP[stop.planet] || null;
  const planetColor = planetData ? planetData.color : '#4d8bff';

  // Progress dots
  let dots = '';
  for (let i = 0; i < tour.stops.length; i++) {
    dots += `<span class="tour-dot${i === index ? ' active' : ''}${i < index ? ' completed' : ''}"></span>`;
  }

  // NOTE: All content is app-owned data from tour-data.js, not user input.
  card.innerHTML =
    `<div class="tour-card-header">` +
      `<div class="tour-card-title-row">` +
        `<span class="tour-card-planet-icon" style="color:${planetColor}">` +
          `${planetData ? '<span class="icon-svg">' + domainSvg(stop.planet, 20) + '</span>' : ''}` +
        `</span>` +
        `<h3 class="tour-card-title">${content.title}</h3>` +
      `</div>` +
      `<div class="tour-mode-toggle">` +
        `<button class="tour-mode-btn${tourState.mode === 'admin' ? ' active' : ''}" data-tour-mode="admin">Admin</button>` +
        `<button class="tour-mode-btn${tourState.mode === 'dev' ? ' active' : ''}" data-tour-mode="dev">Dev</button>` +
      `</div>` +
      `<button class="tour-exit-btn" data-tour-exit aria-label="Exit tour">\u2715</button>` +
    `</div>` +
    `<div class="tour-card-body">` +
      `<p>${content.body}</p>` +
    `</div>` +
    `<div class="tour-card-footer">` +
      `<button class="tour-nav-btn${isFirst ? ' disabled' : ''}" data-tour-prev${isFirst ? ' disabled' : ''}>\u2190 Prev</button>` +
      `<div class="tour-progress">` +
        `<div class="tour-dots">${dots}</div>` +
        `<span class="tour-counter">${index + 1} / ${tour.stops.length}</span>` +
      `</div>` +
      `<button class="tour-nav-btn${isLast ? ' disabled' : ''}" data-tour-next${isLast ? ' disabled' : ''}>Next \u2192</button>` +
    `</div>`;

  // Attach event listeners for narration card controls
  card.querySelectorAll('[data-tour-mode]').forEach((btn) => {
    btn.addEventListener('click', () => setTourMode(btn.dataset.tourMode));
  });
  const exitBtn = card.querySelector('[data-tour-exit]');
  if (exitBtn) exitBtn.addEventListener('click', () => exitTour());
  const prevBtn = card.querySelector('[data-tour-prev]');
  if (prevBtn) prevBtn.addEventListener('click', () => advanceStop(-1));
  const nextBtn = card.querySelector('[data-tour-next]');
  if (nextBtn) nextBtn.addEventListener('click', () => advanceStop(1));
}
