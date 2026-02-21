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
        tags: allTags,
        docText: (comp.docs || []).join(' '),
        level: planet.name,
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
      // Index entities (classes, objects, triggers, lwcs, metadata)
      var ents = comp.entities;
      if (ents) {
        var entityTypes = [
          { key: 'classes', type: 'class', icon: '{ }', color: '#4d8bff' },
          { key: 'objects', type: 'object', icon: '\u{1F5C3}', color: '#22c55e' },
          { key: 'triggers', type: 'trigger', icon: '\u26A1', color: '#ef4444' },
          { key: 'lwcs', type: 'lwc', icon: '\u{1F9E9}', color: '#a855f7' },
          { key: 'metadata', type: 'metadata', icon: '\u{1F4CB}', color: '#f59e0b' }
        ];
        for (var ei = 0; ei < entityTypes.length; ei++) {
          var et = entityTypes[ei];
          var arr = ents[et.key] || [];
          for (var ai = 0; ai < arr.length; ai++) {
            (function(entType, entItem, planetId, compId, planetName, compName) {
              var entTags = [];
              // Classes: methods + referenced objects + extends + implements
              if (entType === 'class') {
                if (entItem.keyMethods) entTags = entTags.concat(entItem.keyMethods);
                if (entItem.referencedObjects) entTags = entTags.concat(entItem.referencedObjects);
                if (entItem.extends) entTags.push(entItem.extends);
                if (entItem.implements) entTags.push(entItem.implements);
              }
              // Objects: field names and labels
              if (entType === 'object' && entItem.keyFields) {
                for (var fi = 0; fi < entItem.keyFields.length; fi++) {
                  entTags.push(entItem.keyFields[fi].name);
                  if (entItem.keyFields[fi].label) entTags.push(entItem.keyFields[fi].label);
                }
              }
              // Triggers: object + events
              if (entType === 'trigger') {
                if (entItem.object) entTags.push(entItem.object);
                if (entItem.events) entTags = entTags.concat(entItem.events);
              }
              // LWCs: imports
              if (entType === 'lwc' && entItem.imports) {
                entTags = entTags.concat(entItem.imports);
              }
              // Metadata: field names
              if (entType === 'metadata' && entItem.keyFields) {
                for (var mi = 0; mi < entItem.keyFields.length; mi++) {
                  entTags.push(entItem.keyFields[mi].name);
                }
              }
              // Build docText for fuzzy matching
              var docParts = [entItem.description || ''];
              if (entItem.extends) docParts.push('extends ' + entItem.extends);
              if (entItem.implements) docParts.push('implements ' + entItem.implements);
              if (entItem.keyMethods) docParts.push(entItem.keyMethods.join(' '));
              if (entItem.referencedObjects) docParts.push(entItem.referencedObjects.join(' '));
              if (entItem.keyFields) {
                docParts.push(entItem.keyFields.map(function(f) {
                  return f.name + ' ' + (f.label || '') + ' ' + (f.type || '');
                }).join(' '));
              }
              idx.push({
                type: entType,
                id: entItem.name + ':' + planetId + ':' + compId,
                planetId: planetId,
                componentId: compId,
                name: entItem.name,
                desc: entItem.description || '',
                icon: et.icon,
                color: et.color,
                tags: entTags,
                docText: docParts.join(' '),
                level: planetName + ' > ' + compName,
                action: function() {
                  navigateToCore(planetId, compId);
                  setTimeout(function() {
                    enterEntity(planetId, compId, entType, entItem.name);
                  }, 100);
                }
              });
            })(et.type, arr[ai], pid, comp.id, planet.name, comp.name);
          }
        }
      }
    }
  }
  return idx;
}

let fullIndex = buildSearchIndex();

function rebuildSearchIndex() {
  fullIndex = buildSearchIndex();
}

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
    const dt = (item.docText || '').toLowerCase();
    if (dt.includes(q)) score += 20;
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
      if (deduped.length >= 50) break;
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
  // Note: all search data comes from the trusted NPSP data object, not user input.
  // The query is escaped via highlightMatch's regex escaping. This is safe.
  var typeColors = {
    planet: '#4d8bff', component: '#4d8bff', tag: '#64748b',
    'class': '#4d8bff', object: '#22c55e', trigger: '#ef4444',
    lwc: '#a855f7', metadata: '#f59e0b'
  };
  el.innerHTML = results.map(function(r, i) {
    var typeColor = typeColors[r.type] || '#64748b';
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
      '<span class="sr-type" style="background:' + typeColor + '22;color:' + typeColor + ';border:1px solid ' + typeColor + '44">' + r.type + '</span>' +
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
    if (typeof track === 'function') track('search_result_click', { name: r.name, type: r.type });
    closeSearch();
    setTimeout(function() { r.action(); }, 100);
  }
}

function cycleResult(dir) {
  if (searchResults.length === 0) return;
  searchIndex = (searchIndex + dir + searchResults.length) % searchResults.length;
  highlightActive();
  const active = document.querySelector('.search-result.active');
  if (active) active.scrollIntoView({ block: 'nearest' });
}

function openSearch() {
  document.getElementById('searchInput').focus();
}

function closeSearch() {
  var shell = document.getElementById('searchShell');
  var drop = document.getElementById('searchDrop');
  var scrim = document.getElementById('searchScrim');
  shell.classList.remove('expanded', 'focused');
  drop.classList.remove('open');
  scrim.classList.remove('visible');
  searchResults = [];
  searchIndex = -1;
  document.getElementById('searchInput').value = '';
  document.getElementById('searchInput').blur();
  document.getElementById('searchResults').textContent = '';
}

var _searchTrackTimer = null;
function expandSearch(query) {
  var shell = document.getElementById('searchShell');
  var drop = document.getElementById('searchDrop');
  var scrim = document.getElementById('searchScrim');
  shell.classList.remove('focused');
  shell.classList.add('expanded');
  drop.classList.add('open');
  scrim.classList.add('visible');
  searchResults = searchNPSP(query);
  searchIndex = searchResults.length > 0 ? 0 : -1;
  renderSearchResults(searchResults, query);
  clearTimeout(_searchTrackTimer);
  if (query.length >= 2 && typeof track === 'function') {
    _searchTrackTimer = setTimeout(function() {
      track('search_used', { query: query, result_count: searchResults.length });
    }, 800);
  }
}

function collapseSearch() {
  var shell = document.getElementById('searchShell');
  var drop = document.getElementById('searchDrop');
  var scrim = document.getElementById('searchScrim');
  shell.classList.remove('expanded');
  shell.classList.add('focused');
  drop.classList.remove('open');
  scrim.classList.remove('visible');
  searchResults = [];
  searchIndex = -1;
  document.getElementById('searchResults').textContent = '';
}
