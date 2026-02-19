// ══════════════════════════════════════════════════════
// Search Engine — fuzzy match across all NPSP data
// Note: innerHTML usage is safe — content is from the
// hardcoded NPSP data object, not from user input.
// The search query is escaped before use in regex/HTML.
// ══════════════════════════════════════════════════════

let searchResults = [], searchIndex = -1;

function buildSearchIndex() {
  const idx = [];
  for (const [pid, planet] of Object.entries(NPSP)) {
    idx.push({
      type: 'domain', id: pid, name: planet.name, desc: planet.description,
      icon: planet.icon, color: planet.color, tags: [], level: 'Architecture',
      action: () => enterDomain(pid)
    });
    for (const comp of planet.components) {
      const allTags = [...(comp.tags || []), ...(comp.triggerTags || [])];
      idx.push({
        type: 'component', id: comp.id, planetId: pid, name: comp.name,
        desc: comp.desc, icon: comp.icon, color: planet.color, tags: allTags,
        level: planet.name,
        action: () => {
          if (currentDomain !== pid) enterDomain(pid);
          setTimeout(() => enterCore(pid, comp.id), currentDomain !== pid ? 500 : 0);
        }
      });
      for (const tag of allTags) {
        idx.push({
          type: 'tag', id: tag, planetId: pid, componentId: comp.id, name: tag,
          desc: comp.desc, icon: comp.icon, color: planet.color, tags: [],
          level: planet.name + ' > ' + comp.name,
          action: () => {
            if (currentDomain !== pid) enterDomain(pid);
            setTimeout(() => enterCore(pid, comp.id), currentDomain !== pid ? 500 : 0);
          }
        });
      }
    }
  }
  return idx;
}

let fullIndex;

function searchNPSP(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const scored = [];
  for (const item of fullIndex) {
    let score = 0;
    const nm = item.name.toLowerCase(), ds = item.desc.toLowerCase();
    const tgs = item.tags.map(t => t.toLowerCase());
    if (nm === q) score += 100;
    else if (nm.startsWith(q)) score += 80;
    else if (nm.includes(q)) score += 60;
    if (ds.includes(q)) score += 30;
    for (const t of tgs) {
      if (t === q) score += 90;
      else if (t.includes(q)) score += 50;
    }
    if (score > 0) scored.push({ ...item, score });
  }
  scored.sort((a, b) => b.score - a.score);
  const seen = new Set(), deduped = [];
  for (const r of scored) {
    const key = r.type + ':' + r.id + (r.planetId || '');
    if (!seen.has(key)) { seen.add(key); deduped.push(r); if (deduped.length >= 25) break; }
  }
  return deduped;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function highlightMatch(text, query) {
  if (!query) return text;
  const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return text.replace(re, '<span class="sr-match">$1</span>');
}

// Renders search results from hardcoded NPSP data. Query is escaped for safe display.
function renderSearchResults(results, query) {
  const el = document.getElementById('searchResults');
  if (results.length === 0 && query.trim()) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:11px">No results for "' + escapeHtml(query) + '"</div>';
    return;
  }
  el.innerHTML = results.map((r, i) =>
    '<div class="search-result' + (i === searchIndex ? ' active' : '') + '" data-idx="' + i + '" onclick="activateResult(' + i + ')" onmouseenter="searchIndex=' + i + ';highlightActive()">' +
    '<div class="sr-icon" style="background:' + r.color + '22;border:1px solid ' + r.color + '44">' + r.icon + '</div>' +
    '<div class="sr-body"><div class="sr-title">' + highlightMatch(r.name, query) + '</div>' +
    '<div class="sr-path">' + r.level + '</div>' +
    '<div class="sr-desc">' + highlightMatch(r.desc.substring(0, 100), query) + (r.desc.length > 100 ? '...' : '') + '</div></div>' +
    '<span class="sr-level">' + r.type + '</span></div>'
  ).join('');
}

function highlightActive() {
  document.querySelectorAll('.search-result').forEach((el, i) => el.classList.toggle('active', i === searchIndex));
}

function activateResult(idx) {
  const r = searchResults[idx];
  if (r) { closeSearch(); setTimeout(() => r.action(), 100); }
}

function cycleResult(dir) {
  if (searchResults.length === 0) return;
  searchIndex = (searchIndex + dir + searchResults.length) % searchResults.length;
  highlightActive();
  document.getElementById('searchCount').textContent = (searchIndex + 1) + '/' + searchResults.length;
  const active = document.querySelector('.search-result.active');
  if (active) active.scrollIntoView({ block: 'nearest' });
}

function openSearch() {
  const ov = document.getElementById('search-overlay');
  ov.classList.add('open');
  const inp = document.getElementById('searchInput');
  inp.value = '';
  inp.focus();
  searchResults = [];
  searchIndex = -1;
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('searchNav').style.display = 'none';
}

function closeSearch() {
  document.getElementById('search-overlay').classList.remove('open');
}

function initSearch() {
  fullIndex = buildSearchIndex();

  document.getElementById('searchInput').addEventListener('input', function () {
    const q = this.value;
    searchResults = searchNPSP(q);
    searchIndex = searchResults.length > 0 ? 0 : -1;
    renderSearchResults(searchResults, q);
    const nav = document.getElementById('searchNav');
    if (searchResults.length > 0) {
      nav.style.display = 'flex';
      document.getElementById('searchCount').textContent = (searchIndex + 1) + '/' + searchResults.length;
    } else {
      nav.style.display = 'none';
    }
  });

  document.getElementById('searchInput').addEventListener('keydown', function (e) {
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
}
