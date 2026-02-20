// ══════════════════════════════════════════════════════════════
//  MAIN — Init, event listeners, keyboard shortcuts
// ══════════════════════════════════════════════════════════════

// ── Planet hover connections ──
document.querySelectorAll('.planet[data-planet]').forEach(el => {
  el.addEventListener('mouseenter', () => highlightConnections(el.dataset.planet));
  el.addEventListener('mouseleave', () => highlightConnections(null));
});

// ── Search input handler ──
document.getElementById('searchInput').addEventListener('input', function() {
  const q = this.value;
  searchResults = searchNPSP(q);
  searchIndex = searchResults.length > 0 ? 0 : -1;
  renderSearchResults(searchResults, q);
  const nav = document.getElementById('searchNav');
  if (searchResults.length > 0) {
    nav.style.display = 'flex';
    document.getElementById('searchCount').textContent = `${searchIndex + 1}/${searchResults.length}`;
  } else {
    nav.style.display = 'none';
  }
});

// ── Search keyboard navigation ──
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

// ── Click outside search overlay to close ──
document.getElementById('search-overlay').addEventListener('click', function(e) {
  if (e.target === this) {
    closeSearch();
  }
});

// ── Global keyboard shortcuts ──
document.addEventListener('keydown', e => {
  if (e.key === '/' && !document.getElementById('search-overlay').classList.contains('open') &&
      document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    openSearch();
  }
  if (e.key === 'Escape' && !document.getElementById('search-overlay').classList.contains('open')) {
    goBack();
  }
});

// ── 3D Galaxy Rotation ──
(function() {
  const map = document.getElementById('galaxy-map');
  if (!map) return;

  let isDragging = false;
  let startX = 0, startY = 0;
  let rotX = 0, rotY = 0;
  let dragStarted = false;
  const THRESHOLD = 3;
  const MAX_X = 60;
  let springRAF = null;

  function applyTransform() {
    map.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  map.addEventListener('mousedown', function(e) {
    if (e.target.closest('.planet')) return;
    isDragging = true;
    dragStarted = false;
    startX = e.clientX;
    startY = e.clientY;
    if (springRAF) { cancelAnimationFrame(springRAF); springRAF = null; }
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!dragStarted) {
      if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
      dragStarted = true;
      map.classList.add('dragging');
      map.style.willChange = 'transform';
    }
    rotY = Math.max(-180, Math.min(180, dx * 0.3));
    rotX = Math.max(-MAX_X, Math.min(MAX_X, -dy * 0.3));
    applyTransform();
  });

  function springBack() {
    rotX *= 0.88;
    rotY *= 0.88;
    if (Math.abs(rotX) < 0.1 && Math.abs(rotY) < 0.1) {
      rotX = 0; rotY = 0;
      applyTransform();
      map.style.willChange = '';
      springRAF = null;
      return;
    }
    applyTransform();
    springRAF = requestAnimationFrame(springBack);
  }

  document.addEventListener('mouseup', function() {
    if (!isDragging) return;
    isDragging = false;
    map.classList.remove('dragging');
    if (dragStarted) {
      springRAF = requestAnimationFrame(springBack);
    }
  });
})();

// ── Init ──
initStarfield();
renderConnections();
updateBreadcrumb();
