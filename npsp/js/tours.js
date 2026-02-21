// ══════════════════════════════════════════════════════════════
//  TOURS — Constellation Stories guided learning tours
//  State management, camera orchestration, UI rendering
// ══════════════════════════════════════════════════════════════

var tourState = {
  active: false,
  tourId: null,
  stopIndex: 0,
  mode: 'admin',  // 'admin' or 'dev'
  startTime: 0,
  stopStartTime: 0
};

// Tour visual state (read by renderer.js and physics.js)
var tourHighlightedEdges = null;   // Set of edge keys like 'donations--contacts'
var tourFocusNode = null;          // node id string
var tourStopPlanets = null;        // Set of planet ids in current tour

function initTours() {
  // Restore mode preference
  var saved = localStorage.getItem('npsp-tour-mode');
  if (saved === 'dev' || saved === 'admin') tourState.mode = saved;

  // Create tour picker dropdown container
  var picker = document.createElement('div');
  picker.id = 'tour-picker';
  picker.className = 'tour-picker';
  picker.innerHTML = renderTourPicker();
  document.body.appendChild(picker);

  // Create narration card container
  var card = document.createElement('div');
  card.id = 'tour-card';
  card.className = 'tour-card';
  document.body.appendChild(card);

  // Close picker when clicking outside
  document.addEventListener('click', function(e) {
    var picker = document.getElementById('tour-picker');
    var btn = document.getElementById('tour-btn');
    if (picker && btn && !picker.contains(e.target) && !btn.contains(e.target)) {
      picker.classList.remove('open');
    }
  });
}

function renderTourPicker() {
  return TOURS.map(function(t) {
    return '<div class="tour-picker-item" onclick="startTour(\'' + t.id + '\')" role="button" tabindex="0">' +
      '<div class="tour-picker-icon">' + t.icon + '</div>' +
      '<div class="tour-picker-info">' +
      '<div class="tour-picker-title">' + t.title + '</div>' +
      '<div class="tour-picker-desc">' + t.desc + '</div>' +
      '<div class="tour-picker-meta">' + t.stops.length + ' stops</div>' +
      '</div></div>';
  }).join('');
}

function toggleTourPicker() {
  var picker = document.getElementById('tour-picker');
  if (picker) {
    picker.classList.toggle('open');
    if (picker.classList.contains('open')) {
      if (typeof track === 'function') track('tour_picker_open', {});
    }
  }
}

function startTour(tourId) {
  var tour = TOURS.find(function(t) { return t.id === tourId; });
  if (!tour) return;

  // Close picker
  var picker = document.getElementById('tour-picker');
  if (picker) picker.classList.remove('open');

  // If not on galaxy view, navigate there first
  if (typeof currentLevel !== 'undefined' && currentLevel !== 'galaxy') {
    navigateTo('galaxy');
  }

  // Ensure galaxy canvas is visible
  if (typeof setGalaxyCanvasVisible === 'function') {
    setGalaxyCanvasVisible(true);
  }

  // Build set of all planets in this tour
  tourStopPlanets = new Set();
  for (var i = 0; i < tour.stops.length; i++) {
    tourStopPlanets.add(tour.stops[i].planet);
  }

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
  var card = document.getElementById('tour-card');
  if (card) {
    card.classList.add('visible');
  }

  if (typeof track === 'function') track('tour_start', {
    tour_id: tourId,
    tour_title: tour.title,
    total_stops: tour.stops.length
  });
}

function goToStop(index) {
  var tour = TOURS.find(function(t) { return t.id === tourState.tourId; });
  if (!tour || index < 0 || index >= tour.stops.length) return;

  // Track time on previous stop
  var now = Date.now();
  if (tourState.stopStartTime && index !== tourState.stopIndex) {
    var timeOnStop = Math.round((now - tourState.stopStartTime) / 1000);
    if (typeof track === 'function') track('tour_stop_view', {
      tour_id: tourState.tourId,
      stop_index: tourState.stopIndex,
      planet: tour.stops[tourState.stopIndex] ? tour.stops[tourState.stopIndex].planet : '',
      time_on_stop_seconds: timeOnStop
    });
  }
  tourState.stopStartTime = now;

  tourState.stopIndex = index;
  var stop = tour.stops[index];

  // Fire completion event when reaching the last stop
  if (index === tour.stops.length - 1) {
    var totalDuration = Math.round((now - tourState.startTime) / 1000);
    if (typeof track === 'function') track('tour_complete', {
      tour_id: tourState.tourId,
      tour_title: tour.title,
      total_stops: tour.stops.length,
      duration_seconds: totalDuration
    });
  }

  // Set tour focus node for dimming
  tourFocusNode = stop.planet;

  // Build highlighted edges set
  tourHighlightedEdges = new Set();
  if (stop.highlightEdges) {
    for (var i = 0; i < stop.highlightEdges.length; i++) {
      var key = [stop.planet, stop.highlightEdges[i]].sort().join('--');
      tourHighlightedEdges.add(key);
    }
  }

  // Animate camera to planet
  var node = nodeMap[stop.planet];
  if (node && typeof animatePanTo === 'function') {
    animatePanTo(node, 800, 1.4);
  }

  // Ensure rendering continues
  if (typeof graphSettled !== 'undefined') {
    graphSettled = false;
    if (typeof graphTick === 'function') requestAnimationFrame(graphTick);
    if (typeof particleTick === 'function') requestAnimationFrame(particleTick);
  }

  // Update narration card
  renderNarrationCard(tour, stop, index);
}

function advanceStop(direction) {
  if (!tourState.active) return;
  var tour = TOURS.find(function(t) { return t.id === tourState.tourId; });
  if (!tour) return;

  var newIndex = tourState.stopIndex + direction;
  if (newIndex < 0 || newIndex >= tour.stops.length) return;

  goToStop(newIndex);
  if (typeof track === 'function') track('tour_navigate', { tour: tourState.tourId, stop: newIndex, direction: direction > 0 ? 'next' : 'prev' });
}

function exitTour() {
  // Capture analytics before clearing state
  var tour = TOURS.find(function(t) { return t.id === tourState.tourId; });
  var totalStops = tour ? tour.stops.length : 0;
  var duration = Math.round((Date.now() - tourState.startTime) / 1000);
  var stopsViewed = tourState.stopIndex + 1;
  var completed = stopsViewed === totalStops;
  var exitTourId = tourState.tourId;

  // Track time on final stop
  if (tourState.stopStartTime && tour) {
    var timeOnStop = Math.round((Date.now() - tourState.stopStartTime) / 1000);
    if (typeof track === 'function') track('tour_stop_view', {
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
  tourHighlightedEdges = null;
  tourFocusNode = null;
  tourStopPlanets = null;

  // Exit immersive mode: restore galaxy chrome
  document.body.classList.remove('tour-active');

  // Hide narration card
  var card = document.getElementById('tour-card');
  if (card) card.classList.remove('visible');

  // Reset camera
  if (typeof resetZoomPan === 'function') resetZoomPan();

  // Force re-render to clear dimming
  if (typeof graphSettled !== 'undefined') {
    graphSettled = false;
    if (typeof graphTick === 'function') requestAnimationFrame(graphTick);
    if (typeof particleTick === 'function') requestAnimationFrame(particleTick);
  }

  if (typeof track === 'function') track('tour_exit', {
    tour_id: exitTourId,
    total_stops: totalStops,
    stops_viewed: stopsViewed,
    completed: completed,
    duration_seconds: duration
  });
}

function setTourMode(mode) {
  tourState.mode = mode;
  localStorage.setItem('npsp-tour-mode', mode);

  // Re-render current card content without camera movement
  if (tourState.active) {
    var tour = TOURS.find(function(t) { return t.id === tourState.tourId; });
    if (tour) {
      renderNarrationCard(tour, tour.stops[tourState.stopIndex], tourState.stopIndex);
    }
  }

  if (typeof track === 'function') track('tour_mode_change', { mode: mode });
}

function renderNarrationCard(tour, stop, index) {
  var card = document.getElementById('tour-card');
  if (!card) return;

  var content = stop[tourState.mode];
  var isFirst = index === 0;
  var isLast = index === tour.stops.length - 1;
  var planetData = typeof NPSP !== 'undefined' ? NPSP[stop.planet] : null;
  var planetColor = planetData ? planetData.color : '#4d8bff';

  // Progress dots
  var dots = '';
  for (var i = 0; i < tour.stops.length; i++) {
    dots += '<span class="tour-dot' + (i === index ? ' active' : '') +
      (i < index ? ' completed' : '') + '"></span>';
  }

  // NOTE: All content is app-owned data from tour-data.js, not user input
  card.innerHTML =
    '<div class="tour-card-header">' +
      '<div class="tour-card-title-row">' +
        '<span class="tour-card-planet-icon" style="color:' + planetColor + '">' +
          (planetData ? planetData.icon : '') +
        '</span>' +
        '<h3 class="tour-card-title">' + content.title + '</h3>' +
      '</div>' +
      '<div class="tour-mode-toggle">' +
        '<button class="tour-mode-btn' + (tourState.mode === 'admin' ? ' active' : '') +
          '" onclick="setTourMode(\'admin\')">Admin</button>' +
        '<button class="tour-mode-btn' + (tourState.mode === 'dev' ? ' active' : '') +
          '" onclick="setTourMode(\'dev\')">Dev</button>' +
      '</div>' +
      '<button class="tour-exit-btn" onclick="exitTour()" aria-label="Exit tour">\u2715</button>' +
    '</div>' +
    '<div class="tour-card-body">' +
      '<p>' + content.body + '</p>' +
    '</div>' +
    '<div class="tour-card-footer">' +
      '<button class="tour-nav-btn' + (isFirst ? ' disabled' : '') +
        '" onclick="advanceStop(-1)"' + (isFirst ? ' disabled' : '') + '>\u2190 Prev</button>' +
      '<div class="tour-progress">' +
        '<div class="tour-dots">' + dots + '</div>' +
        '<span class="tour-counter">' + (index + 1) + ' / ' + tour.stops.length + '</span>' +
      '</div>' +
      '<button class="tour-nav-btn' + (isLast ? ' disabled' : '') +
        '" onclick="advanceStop(1)"' + (isLast ? ' disabled' : '') + '>Next \u2192</button>' +
    '</div>';
}
