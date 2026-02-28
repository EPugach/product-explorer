// ══════════════════════════════════════════════════════════════
//  SEARCH ENGINE — MiniSearch-powered fuzzy search with overlay + ARIA
//  Phase 1: BM25+ scoring, fuzzy matching, prefix search, field boosting
//  CDN fallback: if MiniSearch fails to load, uses substring matching
// ══════════════════════════════════════════════════════════════

import { track, announce } from './utils.js';
import { entitySvg, domainSvg } from './icons.js';

// ── MiniSearch lazy CDN import with fallback ─────────────────
// Loaded lazily in rebuildSearchIndex() to avoid top-level await
// which would block DOMContentLoaded and prevent app initialization.
let MiniSearch = null;
let _useFallback = false;
let _miniSearchLoaded = false;

async function ensureMiniSearch() {
  if (_miniSearchLoaded) return;
  _miniSearchLoaded = true;
  try {
    const mod = await import('https://cdn.jsdelivr.net/npm/minisearch@7.2.0/dist/es/index.min.js');
    MiniSearch = mod.default;
  } catch {
    console.warn('[search] MiniSearch CDN unavailable, using fallback substring search');
    _useFallback = true;
  }
}

// ── Salesforce synonym map ───────────────────────────────────
const SYNONYMS = {
  tdtm:  'table driven trigger management',
  gau:   'general accounting unit',
  rd:    'recurring donation',
  rd2:   'enhanced recurring donation',
  ocr:   'opportunity contact role',
  crlp:  'customizable rollup',
  bdi:   'batch data import',
  bge:   'batch gift entry',
  npsp:  'nonprofit success pack',
  hh:    'household',
  pmt:   'payment',
  opp:   'opportunity',
  lwc:   'lightning web component'
};

// Build reverse map (full term -> abbreviation) for synonym text on documents
const REVERSE_SYNONYMS = {};
for (const [abbr, full] of Object.entries(SYNONYMS)) {
  if (!REVERSE_SYNONYMS[full]) REVERSE_SYNONYMS[full] = [];
  REVERSE_SYNONYMS[full].push(abbr);
}

function expandSynonyms(text) {
  const lower = text.toLowerCase();
  const expansions = [];
  for (const [abbr, full] of Object.entries(SYNONYMS)) {
    if (lower.includes(abbr)) expansions.push(full);
  }
  for (const [full, abbrs] of Object.entries(REVERSE_SYNONYMS)) {
    if (lower.includes(full)) expansions.push(...abbrs);
  }
  return expansions.join(' ');
}

// ── Product data (injected by main.js) ──────────────────────
let PRODUCT_DATA = {};
let _productName = 'Product';
let _packages = {};
export const setProductData = (data, name) => { PRODUCT_DATA = data; if (name) _productName = name; };
export const setPackages = (packages) => { _packages = packages || {}; };

// ── Entity link map (injected by main.js after entities load) ─
let _entityLinkMap = null;   // { name: sourceUrl } for all entities
let _entityLinkNames = null; // sorted longest-first for replacement

export const setEntityLinks = (map) => {
  _entityLinkMap = map;
  // Pre-sort names longest-first to prevent partial matches
  _entityLinkNames = Object.keys(map).sort((a, b) => b.length - a.length);
};

// ── AI search state ─────────────────────────────────────────
let _aiEndpoint = '';
let _aiContext = '';
let _aiDebounceTimer = null;
const _aiSessionCache = new Map();
const AI_CACHE_MAX = 20;

export const setAiConfig = (endpoint, context) => {
  _aiEndpoint = endpoint || '';
  _aiContext = context || '';
};

// ── Navigation callbacks (set after navigation.js loads) ────
let _enterPlanet = null;
let _navigateToCore = null;
let _enterEntity = null;
let _enterAiAnswer = null;

export const setNavigationCallbacks = (enterPlanetFn, navigateToCoreFn, enterEntityFn, enterAiAnswerFn) => {
  _enterPlanet = enterPlanetFn;
  _navigateToCore = navigateToCoreFn;
  _enterEntity = enterEntityFn;
  _enterAiAnswer = enterAiAnswerFn;
};

export let searchResults = [];
export let searchIndex = -1;

export const setSearchIndex = (val) => { searchIndex = val; };

// ── Index data structures ────────────────────────────────────
let _miniSearch = null;       // MiniSearch instance
let _itemsById = new Map();   // numeric id -> {action, icon, color, level, type, planetId, componentId, name, desc}
let _nextId = 0;
let _fallbackIndex = [];      // flat array for substring fallback
let _pendingDocs = [];        // docs waiting for MiniSearch to load

function buildSearchIndex() {
  const docs = [];
  _itemsById = new Map();
  _nextId = 0;
  const fallbackIdx = [];

  for (const [pid, planet] of Object.entries(PRODUCT_DATA)) {
    const baseItem = {
      type: 'planet', id: pid, name: planet.name, desc: planet.description,
      icon: domainSvg(pid, 20), color: planet.color, tags: [], level: _productName || 'Product',
      action: () => { if (_enterPlanet) _enterPlanet(pid); }
    };
    const docId = _nextId++;
    _itemsById.set(docId, baseItem);
    docs.push({
      _id: docId,
      name: planet.name,
      tagsText: '',
      desc: planet.description || '',
      docText: '',
      synonymText: expandSynonyms(planet.name + ' ' + (planet.description || ''))
    });
    fallbackIdx.push(baseItem);

    for (const comp of planet.components) {
      const allTags = [...(comp.tags || []), ...(comp.triggerTags || [])];
      const compItem = {
        type: 'component', id: comp.id, planetId: pid,
        name: comp.name, desc: comp.desc, icon: comp.icon, color: planet.color,
        tags: allTags,
        docText: (comp.docs || []).join(' '),
        level: planet.name,
        action: () => { if (_navigateToCore) _navigateToCore(pid, comp.id); }
      };
      const compDocId = _nextId++;
      _itemsById.set(compDocId, compItem);
      const tagsText = allTags.join(' ');
      const compDocText = (comp.docs || []).join(' ');
      docs.push({
        _id: compDocId,
        name: comp.name,
        tagsText,
        desc: comp.desc || '',
        docText: compDocText,
        synonymText: expandSynonyms(comp.name + ' ' + tagsText + ' ' + (comp.desc || ''))
      });
      fallbackIdx.push(compItem);

      for (const tag of allTags) {
        const tagItem = {
          type: 'tag', id: tag, planetId: pid, componentId: comp.id,
          name: tag, desc: comp.desc, icon: comp.icon, color: planet.color,
          tags: [], level: `${planet.name} > ${comp.name}`,
          action: () => { if (_navigateToCore) _navigateToCore(pid, comp.id); }
        };
        const tagDocId = _nextId++;
        _itemsById.set(tagDocId, tagItem);
        docs.push({
          _id: tagDocId,
          name: tag,
          tagsText: '',
          desc: comp.desc || '',
          docText: '',
          synonymText: expandSynonyms(tag)
        });
        fallbackIdx.push(tagItem);
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
            if (entType === 'class') {
              if (entItem.keyMethods) entTags = entTags.concat(entItem.keyMethods);
              if (entItem.referencedObjects) entTags = entTags.concat(entItem.referencedObjects);
              if (entItem.extends) entTags.push(entItem.extends);
              if (entItem.implements) entTags.push(entItem.implements);
            }
            const flds = entItem.fields || entItem.keyFields;
            if (entType === 'object' && flds) {
              for (const f of flds) {
                entTags.push(f.name);
                if (f.label) entTags.push(f.label);
              }
            }
            if (entType === 'trigger') {
              if (entItem.object) entTags.push(entItem.object);
              if (entItem.events) entTags = entTags.concat(entItem.events);
            }
            if (entType === 'lwc' && entItem.imports) {
              entTags = entTags.concat(entItem.imports);
            }
            if (entType === 'metadata' && flds) {
              for (const f of flds) {
                entTags.push(f.name);
              }
            }

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

            const entItemData = {
              type: entType,
              id: `${entItem.name}:${planetId}:${compId}`,
              planetId,
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
            };

            const entDocId = _nextId++;
            _itemsById.set(entDocId, entItemData);
            const entTagsText = entTags.join(' ');
            const entDocText = docParts.join(' ');
            docs.push({
              _id: entDocId,
              name: entItem.name,
              tagsText: entTagsText,
              desc: entItem.description || '',
              docText: entDocText,
              synonymText: expandSynonyms(entItem.name + ' ' + entTagsText + ' ' + (entItem.description || ''))
            });
            fallbackIdx.push(entItemData);
          }
        }
      }
    }
  }

  return { docs, fallbackIdx };
}

export function rebuildSearchIndex() {
  const { docs, fallbackIdx } = buildSearchIndex();
  _fallbackIndex = fallbackIdx;

  if (MiniSearch && !_useFallback) {
    // MiniSearch already loaded, build index immediately
    _miniSearch = new MiniSearch({
      idField: '_id',
      fields: ['name', 'tagsText', 'desc', 'docText', 'synonymText'],
      storeFields: ['_id'],
      searchOptions: {
        boost: { name: 3, tagsText: 2, desc: 1.5, docText: 1, synonymText: 0.5 },
        fuzzy: 0.2,
        prefix: true
      }
    });
    _miniSearch.addAll(docs);
  } else if (!_useFallback) {
    // MiniSearch not loaded yet, store docs and kick off load
    _pendingDocs = docs;
    ensureMiniSearch().then(() => {
      if (MiniSearch && _pendingDocs.length > 0) {
        _miniSearch = new MiniSearch({
          idField: '_id',
          fields: ['name', 'tagsText', 'desc', 'docText', 'synonymText'],
          storeFields: ['_id'],
          searchOptions: {
            boost: { name: 3, tagsText: 2, desc: 1.5, docText: 1, synonymText: 0.5 },
            fuzzy: 0.2,
            prefix: true
          }
        });
        _miniSearch.addAll(_pendingDocs);
        _pendingDocs = [];
      }
    });
  }
}

// ── Search functions ─────────────────────────────────────────

function searchWithMiniSearch(query) {
  if (!_miniSearch || !query.trim()) return [];

  // Expand query synonyms: if user types "GAU", also search "general accounting unit"
  const q = query.trim();
  const qLower = q.toLowerCase();
  const queries = [q];
  for (const [abbr, full] of Object.entries(SYNONYMS)) {
    if (qLower === abbr || qLower.startsWith(abbr + ' ') || qLower.endsWith(' ' + abbr)) {
      queries.push(q.replace(new RegExp('\\b' + abbr + '\\b', 'gi'), full));
    }
  }

  // Merge results from all query variants
  const scoreMap = new Map(); // docId -> best score
  for (const queryStr of queries) {
    const results = _miniSearch.search(queryStr);
    for (const r of results) {
      const existing = scoreMap.get(r.id);
      if (!existing || r.score > existing) {
        scoreMap.set(r.id, r.score);
      }
    }
  }

  // Sort by score descending, map back to item shape
  const sorted = [...scoreMap.entries()]
    .sort((a, b) => b[1] - a[1]);

  const seen = new Set();
  const deduped = [];
  for (const [docId] of sorted) {
    const item = _itemsById.get(docId);
    if (!item) continue;
    const key = `${item.type}:${item.id}${item.planetId || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push({ ...item, score: scoreMap.get(docId) });
      if (deduped.length >= 50) break;
    }
  }
  return deduped;
}

function searchProductFallback(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const scored = [];
  for (const item of _fallbackIndex) {
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

function searchProduct(query) {
  if (_useFallback || !_miniSearch) return searchProductFallback(query);
  return searchWithMiniSearch(query);
}

// ── AI question detection ────────────────────────────────────

const QUESTION_WORDS = /^(what|how|why|does|is|are|can|will|could|should|would|explain|describe|tell|where|when|which|who)\b/i;

function isQuestion(query) {
  if (!query || query.trim().length < 5) return false;
  const q = query.trim();
  if (q.endsWith('?')) return true;
  if (QUESTION_WORDS.test(q)) return true;
  // 4+ words that aren't all-caps (not an API name like "NPSP_TDTM_HANDLER")
  const words = q.split(/\s+/);
  if (words.length >= 4 && q !== q.toUpperCase()) return true;
  return false;
}

// ── AI answer fetching ───────────────────────────────────────

async function askAi(question) {
  if (!_aiEndpoint) return { error: 'AI not configured' };

  const cacheKey = question.trim().toLowerCase();
  if (_aiSessionCache.has(cacheKey)) {
    return { answer: _aiSessionCache.get(cacheKey), cached: true };
  }

  const searchMatches = searchProduct(question).slice(0, 5).map(r => ({
    name: r.name, type: r.type, desc: r.desc.substring(0, 100)
  }));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(_aiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        question: question.trim(),
        systemContext: _aiContext,
        searchMatches
      })
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.error || `HTTP ${res.status}` };
    }

    const data = await res.json();
    if (data.answer) {
      // Cache with size limit
      if (_aiSessionCache.size >= AI_CACHE_MAX) {
        const firstKey = _aiSessionCache.keys().next().value;
        _aiSessionCache.delete(firstKey);
      }
      _aiSessionCache.set(cacheKey, data.answer);
    }
    return data;
  } catch (err) {
    if (err.name === 'AbortError') return { error: 'Request timed out' };
    return { error: 'Network error' };
  }
}

// ── Highlight ────────────────────────────────────────────────

function highlightMatch(text, query) {
  if (!query) return text;
  // Try exact substring match first
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('(' + escaped + ')', 'gi');
  if (re.test(text)) {
    return text.replace(re, '<span class="sr-match">$1</span>');
  }
  // Fallback: highlight individual query terms (for fuzzy matches)
  const terms = query.trim().split(/\s+/).filter((t) => t.length >= 2);
  if (terms.length === 0) return text;
  const termPattern = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const termRe = new RegExp('(' + termPattern + ')', 'gi');
  return text.replace(termRe, '<span class="sr-match">$1</span>');
}

// ── Entity name linkification ─────────────────────────────────
// Scans escaped text for known entity names and inserts markdown links
// to their GitHub source URLs. Must be called BEFORE formatAiMarkdown()
// so that [name](url) syntax is converted to <a> tags by the markdown parser.
export function linkifyEntityNames(escapedText) {
  if (!_entityLinkMap || !_entityLinkNames || _entityLinkNames.length === 0) return escapedText;

  let result = escapedText;
  const linked = new Set();

  for (const name of _entityLinkNames) {
    if (linked.has(name)) continue;
    if (result.indexOf(name) === -1) continue;

    const url = _entityLinkMap[name];
    // Word-boundary match, first occurrence only
    const re = new RegExp('\\b(' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')\\b');
    const match = result.match(re);
    if (match) {
      result = result.replace(re, `[$1](${url})`);
      linked.add(name);
    }
  }
  return result;
}

// ── AI answer markdown formatting ─────────────────────────────
// Lightweight parser for common markdown patterns in AI responses.
// IMPORTANT: Must be called on ALREADY HTML-ESCAPED text to prevent XSS.
// The input has &amp; &lt; &gt; — we only convert markdown syntax to HTML tags.
//
// Parsing order matters:
// 1. Code blocks (extract to placeholders first, protect inner content)
// 2. Tables (multi-line, before inline formatting mangles pipe chars)
// 3. Headings (before bullets, because # could match bullet patterns)
// 4. Bold → Italic → Inline code → Links → Bullets → Numbered lists
// 5. Restore code blocks from placeholders (last)
export function formatAiMarkdown(escaped) {
  // ── Step 1: Extract code blocks to placeholders ──
  const codeBlocks = [];
  let text = escaped.replace(/(^|\n)```(\w*)\n([\s\S]*?)```/g, (_, pre, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre class="ai-code-block"><code>${code.replace(/\n$/, '')}</code></pre>`);
    return `${pre}\x00CODEBLOCK${idx}\x00`;
  });

  // ── Step 2: Parse tables ──
  text = text.replace(/(^|\n)(\|.+\|)\n(\|[\s:|-]+\|)\n((?:\|.+\|\n?)+)/g, (_, pre, headerRow, _sepRow, bodyBlock) => {
    const parseRow = row => row.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
    const headers = parseRow(headerRow);
    const headHtml = headers.map(h => `<th>${h}</th>`).join('');
    const rows = bodyBlock.trim().split('\n');
    const bodyHtml = rows.map(r => {
      const cells = parseRow(r);
      return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
    }).join('');
    return `${pre}<table class="ai-table"><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
  });

  // ── Step 3: Headings (### before ## before #) ──
  text = text.replace(/(^|\n)###\s+(.+)/g, '$1<h4 class="ai-heading ai-h3">$2</h4>');
  text = text.replace(/(^|\n)##\s+(.+)/g, '$1<h3 class="ai-heading ai-h2">$2</h3>');
  text = text.replace(/(^|\n)#\s+(.+)/g, '$1<h2 class="ai-heading ai-h1">$2</h2>');

  // ── Step 4: Inline formatting ──
  text = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!<\/?)\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" class="ai-link" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/(^|\n)[*-] (.+)/g, '$1<span class="ai-bullet">$2</span>')
    .replace(/(^|\n)(\d+)\. (.+)/g, '$1<span class="ai-bullet"><span class="ai-bullet-num">$2.</span> $3</span>');

  // ── Step 5: Restore code blocks ──
  codeBlocks.forEach((html, i) => { text = text.replace(`\x00CODEBLOCK${i}\x00`, html); });

  return text;
}

// ── AI answer copy helper ────────────────────────────────────
function copyAiAnswer(btn, text) {
  const onSuccess = () => {
    btn.classList.add('copied');
    const prev = btn.textContent;
    btn.textContent = '\u2713 Copied';
    setTimeout(() => { btn.textContent = prev; btn.classList.remove('copied'); }, 1500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => onSuccess());
  } else {
    onSuccess();
  }
}

// NOTE: innerHTML usage is safe here. All search data comes from the trusted
// NPSP data object (app-owned, not user input). The query is escaped via
// highlightMatch's regex escaping. AI answers are from our own Worker.
// aiState: null | { loading: true } | { answer: string } | { error: string }
function renderSearchResults(results, query, aiState) {
  const el = document.getElementById('searchResults');

  // Build AI section HTML
  let aiHtml = '';
  if (aiState) {
    if (aiState.loading) {
      aiHtml = `<div class="ai-section" id="ai-section">` +
        `<div class="ai-header">AI ANSWER</div>` +
        `<div class="ai-card">` +
        `<div class="ai-icon">&#x2728;</div>` +
        `<div class="ai-body">` +
        `<div class="ai-skeleton"><div></div><div></div><div></div></div>` +
        `</div></div></div>`;
    } else if (aiState.answer) {
      // Escape HTML in AI answer (AI-generated content, not app-owned),
      // linkify entity names, then format markdown
      const safeAnswer = aiState.answer.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const formattedAnswer = formatAiMarkdown(linkifyEntityNames(safeAnswer));
      aiHtml = `<div class="ai-section" id="ai-section">` +
        `<div class="ai-header">AI ANSWER<button class="ai-copy-btn" data-ai-copy aria-label="Copy answer">Copy</button></div>` +
        `<div class="ai-card ai-card-clickable" role="button" tabindex="0">` +
        `<div class="ai-icon">&#x2728;</div>` +
        `<div class="ai-body">` +
        `<div class="ai-answer ai-answer-formatted">${formattedAnswer}</div>` +
        `<div class="ai-explore-hint">Click to explore related architecture</div>` +
        `<div class="ai-attribution">Based on ${_productName} product data</div>` +
        `</div></div></div>`;
    } else if (aiState.error) {
      aiHtml = `<div class="ai-section" id="ai-section">` +
        `<div class="ai-error">${aiState.error}</div></div>`;
    }
  }

  if (results.length === 0 && !aiState && query.trim()) {
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
  const resultsHtml = results.map((r, i) => {
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

  // Safe: innerHTML from trusted app-owned data + escaped AI answer
  el.innerHTML = aiHtml + resultsHtml;

  // Prevent mousedown on AI section from closing search overlay
  const aiSection = el.querySelector('.ai-section');
  if (aiSection) {
    aiSection.addEventListener('mousedown', (e) => { e.preventDefault(); });
  }

  // Wire copy button on AI answer card
  const aiCopyBtn = el.querySelector('[data-ai-copy]');
  if (aiCopyBtn && aiState && aiState.answer) {
    const rawAnswer = aiState.answer;
    aiCopyBtn.addEventListener('click', (e) => { e.stopPropagation(); copyAiAnswer(aiCopyBtn, rawAnswer); });
    aiCopyBtn.addEventListener('mousedown', (e) => { e.stopPropagation(); e.preventDefault(); });
  }

  // Make AI card clickable to open AI answer exploration view
  const aiClickable = el.querySelector('.ai-card-clickable');
  if (aiClickable && _enterAiAnswer) {
    const openAiView = () => {
      const currentQuery = query;
      const currentAnswer = aiState && aiState.answer ? aiState.answer : '';
      const currentResults = [...results];
      closeSearch();
      setTimeout(() => { _enterAiAnswer(currentQuery, currentAnswer, currentResults); }, 100);
    };
    aiClickable.addEventListener('click', openAiView);
    aiClickable.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); openAiView(); }
    });
  }

  // Attach event listeners for search results
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
  clearTimeout(_aiDebounceTimer);
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

  // Detect question and trigger AI search
  const shouldAskAi = _aiEndpoint && isQuestion(query);
  renderSearchResults(searchResults, query, shouldAskAi ? { loading: true } : null);

  if (shouldAskAi) {
    clearTimeout(_aiDebounceTimer);
    _aiDebounceTimer = setTimeout(async () => {
      const result = await askAi(query);
      // Only update if search is still showing the same query
      const currentInput = document.getElementById('searchInput');
      if (currentInput && currentInput.value === query) {
        if (result.answer) {
          renderSearchResults(searchResults, query, { answer: result.answer });
          announce('AI answer generated');
        } else if (result.error) {
          renderSearchResults(searchResults, query, { error: result.error });
        }
      }
    }, 600);
  }

  clearTimeout(_searchTrackTimer);
  if (query.length >= 2) {
    _searchTrackTimer = setTimeout(() => {
      track('search_used', { query: query, result_count: searchResults.length, ai: shouldAskAi });
    }, 800);
  }
  // B5: Debounced screen reader announcement for search results
  clearTimeout(_searchAnnounceTimer);
  if (query.length >= 2) {
    _searchAnnounceTimer = setTimeout(() => {
      const count = searchResults.length;
      const msg = count === 0 ? 'No results found' : `${count} result${count !== 1 ? 's' : ''} found`;
      announce(shouldAskAi ? msg + '. Loading AI answer.' : msg);
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
