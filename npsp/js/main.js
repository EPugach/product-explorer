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

// ── Init ──
initStarfield();
renderConnections();
updateBreadcrumb();
