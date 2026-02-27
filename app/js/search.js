// ══════════════════════════════════════════════════════════════
//  SEARCH ENGINE — Fuzzy search with overlay + ARIA
// ══════════════════════════════════════════════════════════════

import { track, announce } from './utils.js';
import { entitySvg, domainSvg } from './icons.js';

// Product data is injected by main.js via setProductData()
let PRODUCT_DATA = {};
let _productName = 'Product';
let _packages = {};
export const setProductData = (data, name) => { PRODUCT_DATA = data; if (name) _productName = name; };
export const setPackages = (packages) => { _packages = packages || {}; };

// Navigation functions are set via setNavigationCallbacks after navigation.js loads
let _enterPlanet = null;
let _navigateToCore = null;
let _enterEntity = null;

export const setNavigationCallbacks = (enterPlanetFn, navigateToCoreFn, enterEntityFn) => {
  _enterPlanet = enterPlanetFn;
  _navigateToCore = navigateToCoreFn;
  _enterEntity = enterEntityFn;
};

export let searchResults = [];
export let searchIndex = -1;

export const setSearchIndex = (val) => { searchIndex = val; };

function buildSearchIndex() {
  const idx = [];
  for (const [pid, planet] of Object.entries(PRODUCT_DATA)) {
    idx.push({
      type: 'planet', id: pid, name: planet.name, desc: planet.description,
      icon: domainSvg(pid, 20), color: planet.color, tags: [], level: _productName || 'Product',
      action: () => { if (_enterPlanet) _enterPlanet(pid); }
    });
    for (const comp of planet.components) {
      const allTags = [...(comp.tags || []), ...(comp.triggerTags || [])];
      idx.push({
        type: 'component', id: comp.id, planetId: pid,
        name: comp.name, desc: comp.desc, icon: comp.icon, color: planet.color,
        tags: allTags,
        docText: (comp.docs || []).join(' '),
        level: planet.name,
        action: () => { if (_navigateToCore) _navigateToCore(pid, comp.id); }
      });
      for (const tag of allTags) {
        idx.push({
          type: 'tag', id: tag, planetId: pid, componentId: comp.id,
          name: tag, desc: comp.desc, icon: comp.icon, color: planet.color,
          tags: [], level: `${planet.name} > ${comp.name}`,
          action: () => { if (_navigateToCore) _navigateToCore(pid, comp.id); }
        });
      }
      // Index entities (classes, objects, triggers, lwcs, metadata)
      const ents = comp.entities;
      if (ents) {
        const entityTypes = [
          { key: 'classes', type: 'class', icon: entitySvg('class', 14), color: '#4d8bff' },
          { key: 'objects', type: 'object', icon: entitySvg('object', 14), color: '#22c55e' },
          { key: 'triggers', type: 'trigger', icon: entitySvg('trigger', 14), color: '#ef4444' },
          { key: 'lwcs', type: 'lwc', icon: entitySvg('lwc', 14), color: '#a855f7' },
          { key: 'metadata', type: 'metadata', icon: entitySvg('metadata', 14), color: '#f59e0b' }
        ];
        for (const et of entityTypes) {
          const arr = ents[et.key] || [];
          for (const entItem of arr) {
            const entType = et.type;
            const planetId = pid;
            const compId = comp.id;
            const planetName = planet.name;
            const compName = comp.name;

            let entTags = [];
            // Classes: methods + referenced objects + extends + implements
            if (entType === 'class') {
              if (entItem.keyMethods) entTags = entTags.concat(entItem.keyMethods);
              if (entItem.referencedObjects) entTags = entTags.concat(entItem.referencedObjects);
              if (entItem.extends) entTags.push(entItem.extends);
              if (entItem.implements) entTags.push(entItem.implements);
            }
            // Objects: field names and labels
            const flds = entItem.fields || entItem.keyFields;
            if (entType === 'object' && flds) {
              for (const f of flds) {
                entTags.push(f.name);
                if (f.label) entTags.push(f.label);
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
            if (entType === 'metadata' && flds) {
              for (const f of flds) {
                entTags.push(f.name);
              }
            }
            // Build docText for fuzzy matching
            const docParts = [entItem.description || ''];
            if (entItem._package && _packages[entItem._package]) {
              docParts.push(_packages[entItem._package].name);
            }
            if (entItem.extends) docParts.push('extends ' + entItem.extends);
            if (entItem.implements) docParts.push('implements ' + entItem.implements);
            if (entItem.keyMethods) docParts.push(entItem.keyMethods.join(' '));
            if (entItem.referencedObjects) docParts.push(entItem.referencedObjects.join(' '));
            if (flds) {
              docParts.push(flds.map((f) =>
                `${f.name} ${f.label || ''} ${f.type || ''}`
              ).join(' '));
            }
            idx.push({
              type: entType,
              id: `${entItem.name}:${planetId}:${compId}`,
              planetId: planetId,
              componentId: compId,
              name: entItem.name,
              desc: entItem.description || '',
              icon: et.icon,
              color: et.color,
              tags: entTags,
              docText: docParts.join(' '),
              level: `${planetName} > ${compName}`,
              action: () => {
                if (_navigateToCore) _navigateToCore(planetId, compId);
                setTimeout(() => {
                  if (_enterEntity) _enterEntity(planetId, compId, et.key, entItem.name);
                }, 100);
              }
            });
          }
        }
      }
    }
  }
  return idx;
}

let fullIndex = [];

export function rebuildSearchIndex() {
  fullIndex = buildSearchIndex();
}

function searchProduct(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const scored = [];
  for (const item of fullIndex) {
    let score = 0;
    const nm = item.name.toLowerCase();
    const ds = item.desc.toLowerCase();
    const tgs = item.tags.map((t) => t.toLowerCase());
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
    const key = `${r.type}:${r.id}${r.planetId || ''}`;
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

// NOTE: innerHTML usage is safe here. All search data comes from the trusted
// NPSP data object (app-owned, not user input). The query is escaped via
// highlightMatch's regex escaping.
function renderSearchResults(results, query) {
  const el = document.getElementById('searchResults');
  if (results.length === 0 && query.trim()) {
    el.textContent = '';
    const noResults = document.createElement('div');
    noResults.style.cssText = 'text-align:center;padding:24px;color:var(--text-dim);font-size:var(--text-sm)';
    noResults.textContent = 'No results for "' + query + '"';
    el.appendChild(noResults);
    return;
  }
  const typeColors = {
    planet: '#4d8bff', component: '#4d8bff', tag: '#64748b',
    'class': '#4d8bff', object: '#22c55e', trigger: '#ef4444',
    lwc: '#a855f7', metadata: '#f59e0b'
  };
  // Safe: all data is from trusted NPSP data object, not user input
  el.innerHTML = results.map((r, i) => {
    const typeColor = typeColors[r.type] || '#64748b';
    return `<div class="search-result${i === searchIndex ? ' active' : ''}" ` +
      `data-idx="${i}" data-search-result="${i}" ` +
      `role="option" aria-selected="${i === searchIndex}">` +
      `<div class="sr-icon" style="background:${r.color}22;border:1px solid ${r.color}44">${r.icon}</div>` +
      `<div class="sr-body">` +
      `<div class="sr-title">${highlightMatch(r.name, query)}</div>` +
      `<div class="sr-path">${r.level}</div>` +
      `<div class="sr-desc">${highlightMatch(r.desc.substring(0, 100), query)}${r.desc.length > 100 ? '...' : ''}</div>` +
      `</div>` +
      `<span class="sr-type" style="background:${typeColor}22;color:${typeColor};border:1px solid ${typeColor}44">${r.type}</span>` +
      `<span class="sr-level">${r.type}</span></div>`;
  }).join('');

  // Attach event listeners instead of inline onclick/onmouseenter
  el.querySelectorAll('[data-search-result]').forEach((resultEl) => {
    const idx = parseInt(resultEl.dataset.searchResult, 10);
    resultEl.addEventListener('click', () => activateResult(idx));
    resultEl.addEventListener('mouseenter', () => {
      searchIndex = idx;
      highlightActive();
    });
  });
}

export function highlightActive() {
  document.querySelectorAll('.search-result').forEach((el, i) => {
    el.classList.toggle('active', i === searchIndex);
    el.setAttribute('aria-selected', i === searchIndex);
  });
}

export function activateResult(idx) {
  const r = searchResults[idx];
  if (r) {
    track('search_result_click', { name: r.name, type: r.type });
    closeSearch();
    setTimeout(() => { r.action(); }, 100);
  }
}

export function cycleResult(dir) {
  if (searchResults.length === 0) return;
  searchIndex = (searchIndex + dir + searchResults.length) % searchResults.length;
  highlightActive();
  const active = document.querySelector('.search-result.active');
  if (active) active.scrollIntoView({ block: 'nearest' });
}

export function openSearch() {
  document.getElementById('searchInput').focus();
}

export function closeSearch() {
  const shell = document.getElementById('searchShell');
  const drop = document.getElementById('searchDrop');
  const scrim = document.getElementById('searchScrim');
  shell.classList.remove('expanded', 'focused');
  drop.classList.remove('open');
  scrim.classList.remove('visible');
  searchResults = [];
  searchIndex = -1;
  document.getElementById('searchInput').value = '';
  document.getElementById('searchInput').blur();
  document.getElementById('searchResults').textContent = '';
}

let _searchTrackTimer = null;
let _searchAnnounceTimer = null;

export function expandSearch(query) {
  const shell = document.getElementById('searchShell');
  const drop = document.getElementById('searchDrop');
  const scrim = document.getElementById('searchScrim');
  shell.classList.remove('focused');
  shell.classList.add('expanded');
  drop.classList.add('open');
  scrim.classList.add('visible');
  searchResults = searchProduct(query);
  searchIndex = searchResults.length > 0 ? 0 : -1;
  renderSearchResults(searchResults, query);
  clearTimeout(_searchTrackTimer);
  if (query.length >= 2) {
    _searchTrackTimer = setTimeout(() => {
      track('search_used', { query: query, result_count: searchResults.length });
    }, 800);
  }
  // B5: Debounced screen reader announcement for search results
  clearTimeout(_searchAnnounceTimer);
  if (query.length >= 2) {
    _searchAnnounceTimer = setTimeout(() => {
      const count = searchResults.length;
      announce(count === 0 ? 'No results found' : `${count} result${count !== 1 ? 's' : ''} found`);
    }, 500);
  }
}

export function collapseSearch() {
  const shell = document.getElementById('searchShell');
  const drop = document.getElementById('searchDrop');
  const scrim = document.getElementById('searchScrim');
  shell.classList.remove('expanded');
  shell.classList.add('focused');
  drop.classList.remove('open');
  scrim.classList.remove('visible');
  searchResults = [];
  searchIndex = -1;
  document.getElementById('searchResults').textContent = '';
}
