// ══════════════════════════════════════════════════════════════
//  SEARCH ENGINE — Fuzzy search with overlay + ARIA
// ══════════════════════════════════════════════════════════════

let searchResults = [];
let searchIndex = -1;

function buildSearchIndex() {
  const idx = [];
  for (const [pid, planet] of Object.entries(NPSP)) {
    idx.push({
      type: 'planet', id: pid, name: planet.name, desc: planet.description,
      icon: planet.icon, color: planet.color, tags: [], level: 'NPSP',
      action: () => enterPlanet(pid)
    });
    for (const comp of planet.components) {
      const allTags = [...(comp.tags || []), ...(comp.triggerTags || [])];
      idx.push({
        type: 'component', id: comp.id, planetId: pid,
        name: comp.name, desc: comp.desc, icon: comp.icon, color: planet.color,
        tags: allTags, level: planet.name,
        action: () => navigateToCore(pid, comp.id)
      });
      for (const tag of allTags) {
        idx.push({
          type: 'tag', id: tag, planetId: pid, componentId: comp.id,
          name: tag, desc: comp.desc, icon: comp.icon, color: planet.color,
          tags: [], level: planet.name + ' > ' + comp.name,
          action: () => navigateToCore(pid, comp.id)
        });
      }
    }
  }
  return idx;
}

const fullIndex = buildSearchIndex();

function searchNPSP(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const scored = [];
  for (const item of fullIndex) {
    let score = 0;
    const nm = item.name.toLowerCase();
    const ds = item.desc.toLowerCase();
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
  const seen = new Set();
  const deduped = [];
  for (const r of scored) {
    const key = r.type + ':' + r.id + (r.planetId || '');
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(r);
      if (deduped.length >= 25) break;
    }
  }
  return deduped;
}

function highlightMatch(text, query) {
  if (!query) return text;
  const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return text.replace(re, '<span class="sr-match">$1</span>');
}

function renderSearchResults(results, query) {
  const el = document.getElementById('searchResults');
  if (results.length === 0 && query.trim()) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:var(--text-sm)">No results for "' +
      query.replace(/</g, '&lt;') + '"</div>';
    return;
  }
  el.innerHTML = results.map(function(r, i) {
    return '<div class="search-result' + (i === searchIndex ? ' active' : '') + '" ' +
      'data-idx="' + i + '" onclick="activateResult(' + i + ')" ' +
      'onmouseenter="searchIndex=' + i + ';highlightActive()" ' +
      'role="option" aria-selected="' + (i === searchIndex) + '">' +
      '<div class="sr-icon" style="background:' + r.color + '22;border:1px solid ' + r.color + '44">' + r.icon + '</div>' +
      '<div class="sr-body">' +
      '<div class="sr-title">' + highlightMatch(r.name, query) + '</div>' +
      '<div class="sr-path">' + r.level + '</div>' +
      '<div class="sr-desc">' + highlightMatch(r.desc.substring(0, 100), query) + (r.desc.length > 100 ? '...' : '') + '</div>' +
      '</div>' +
      '<span class="sr-level">' + r.type + '</span></div>';
  }).join('');
}

function highlightActive() {
  document.querySelectorAll('.search-result').forEach(function(el, i) {
    el.classList.toggle('active', i === searchIndex);
    el.setAttribute('aria-selected', i === searchIndex);
  });
}

function activateResult(idx) {
  const r = searchResults[idx];
  if (r) {
    closeSearch();
    setTimeout(function() { r.action(); }, 100);
  }
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
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-label', 'Search NPSP architecture');
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
