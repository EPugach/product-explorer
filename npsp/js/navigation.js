// ══════════════════════════════════════════════════════════════
//  NAVIGATION — Views, breadcrumbs, state, staggered animations
// ══════════════════════════════════════════════════════════════

const PLANET_META = {};
for (const [k, v] of Object.entries(NPSP)) {
  PLANET_META[k] = { icon: v.icon, color: v.color };
}

let currentLevel = 'galaxy';
let currentPlanet = null;
let currentComponent = null;
let currentEntity = null;        // {type, name}
let currentEntityTab = null;     // which tab was active
let navHistory = [];

// ── Hash Routing ──
// Flag to prevent popstate handler from re-navigating when we push state
let hashUpdateInProgress = false;

const setHash = (hash) => {
  hashUpdateInProgress = true;
  history.pushState(null, '', hash);
  hashUpdateInProgress = false;
};

// Update document.title based on current navigation state
const updateDocumentTitle = (level, domainId, componentId, entityName) => {
  const base = 'NPSP Architecture Explorer';
  if (level === 'galaxy' || !domainId) {
    document.title = base;
    return;
  }
  const domain = NPSP[domainId];
  const domainName = domain ? domain.name : domainId;
  if (level === 'planet') {
    document.title = `${domainName} \u2014 ${base}`;
    return;
  }
  if (level === 'core' && componentId) {
    const comp = domain ? domain.components.find(c => c.id === componentId) : null;
    const compName = comp ? comp.name : componentId;
    document.title = `${compName} \u2014 ${domainName} \u2014 NPSP Explorer`;
    return;
  }
  if (level === 'entity' && entityName) {
    document.title = `${entityName} \u2014 NPSP Explorer`;
    return;
  }
  document.title = base;
};

// Parse the current hash and navigate to the corresponding view
const handleHashNavigation = () => {
  const hash = window.location.hash || '#/';
  const path = hash.replace(/^#\/?/, '');
  if (!path) {
    // Galaxy view
    if (currentLevel !== 'galaxy') {
      navHistory = [];
      currentLevel = 'galaxy';
      currentPlanet = null;
      currentComponent = null;
      currentEntity = null;
      resetZoomPan();
      setGalaxyCanvasVisible(true);
      showViewDirect('galaxy-view');
      if (typeof graphSettled !== 'undefined') {
        graphSettled = false;
        requestAnimationFrame(graphTick);
        requestAnimationFrame(particleTick);
      }
      updateBreadcrumb();
      updateDocumentTitle('galaxy');
    }
    return;
  }

  const segments = path.split('/');

  if (segments.length === 1) {
    // Domain view: #/domainId
    const domainId = segments[0];
    if (!NPSP[domainId]) {
      // Invalid domain, fall back to galaxy
      setHash('#/');
      handleHashNavigation();
      return;
    }
    navHistory = [];
    currentLevel = 'planet';
    currentPlanet = domainId;
    currentComponent = null;
    currentEntity = null;
    renderPlanetView(domainId);
    setGalaxyCanvasVisible(false);
    showViewDirect('planet-view');
    updateBreadcrumb();
    updateDocumentTitle('planet', domainId);

  } else if (segments.length === 2) {
    // Component view: #/domainId/componentId
    const [domainId, componentId] = segments;
    if (!NPSP[domainId]) {
      setHash('#/');
      handleHashNavigation();
      return;
    }
    const comp = NPSP[domainId].components.find(c => c.id === componentId);
    if (!comp) {
      setHash(`#/${domainId}`);
      handleHashNavigation();
      return;
    }
    navHistory = [{ level: 'galaxy', planet: null, component: null }];
    currentLevel = 'core';
    currentPlanet = domainId;
    currentComponent = componentId;
    currentEntity = null;
    renderPlanetView(domainId);
    renderCoreView(domainId, componentId);
    setGalaxyCanvasVisible(false);
    showViewDirect('core-view');
    updateBreadcrumb();
    updateDocumentTitle('core', domainId, componentId);

  } else if (segments.length >= 4) {
    // Entity view: #/domainId/componentId/entityType/entityName
    const [domainId, componentId, entityType, ...entityNameParts] = segments;
    const entityName = decodeURIComponent(entityNameParts.join('/'));
    if (!NPSP[domainId]) {
      setHash('#/');
      handleHashNavigation();
      return;
    }
    const comp = NPSP[domainId].components.find(c => c.id === componentId);
    if (!comp) {
      setHash(`#/${domainId}`);
      handleHashNavigation();
      return;
    }
    navHistory = [
      { level: 'galaxy', planet: null, component: null },
      { level: 'planet', planet: domainId, component: null }
    ];
    currentLevel = 'entity';
    currentPlanet = domainId;
    currentComponent = componentId;
    currentEntity = { type: entityType, name: entityName };
    currentEntityTab = entityType;
    renderPlanetView(domainId);
    renderCoreView(domainId, componentId);
    renderEntityView(domainId, componentId, entityType, entityName);
    setGalaxyCanvasVisible(false);
    showViewDirect('entity-view');
    updateBreadcrumb();
    updateDocumentTitle('entity', domainId, componentId, entityName);

  } else {
    // Unknown format (3 segments), fall back to galaxy
    setHash('#/');
    handleHashNavigation();
  }
};

// Read transition duration from CSS custom property
function getTransitionMs() {
  var val = getComputedStyle(document.documentElement)
    .getPropertyValue('--transition-duration').trim();
  return parseInt(val) || 700;
}

// ── View Transitions ──
function showView(id, dir) {
  document.querySelectorAll('.view-layer').forEach(v => {
    if (v.classList.contains('active')) {
      v.classList.remove('active');
      v.classList.add(dir === 'in' ? 'zoom-out' : 'zoom-in');
      setTimeout(() => v.classList.remove('zoom-out', 'zoom-in'), getTransitionMs());
    }
  });
  const t = document.getElementById(id);
  t.classList.remove('zoom-out', 'zoom-in');
  t.classList.add(dir === 'in' ? 'zoom-in' : 'zoom-out');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    t.classList.remove('zoom-out', 'zoom-in');
    t.classList.add('active');
  }));
}

function showViewDirect(id) {
  document.querySelectorAll('.view-layer').forEach(v => {
    v.classList.remove('active', 'zoom-out', 'zoom-in');
  });
  document.getElementById(id).classList.add('active');
}

// ── Canvas visibility ──
function setGalaxyCanvasVisible(visible) {
  const graph = document.getElementById('graph-canvas');
  const particle = document.getElementById('particle-canvas');
  if (visible) {
    graph.classList.remove('hidden');
    particle.classList.remove('hidden');
  } else {
    graph.classList.add('hidden');
    particle.classList.add('hidden');
  }
}

// ── Breadcrumb ──
function updateBreadcrumb() {
  // Zoom dots
  document.querySelectorAll('.zoom-dot').forEach((d, i) => {
    d.classList.toggle('active',
      (i === 0 && currentLevel === 'galaxy') ||
      (i === 1 && currentLevel === 'planet') ||
      (i === 2 && currentLevel === 'core') ||
      (i === 3 && currentLevel === 'entity')
    );
  });

  // Stats bar visibility
  const stats = document.querySelector('.galaxy-stats');
  if (stats) {
    stats.style.display = currentLevel === 'galaxy' ? 'flex' : 'none';
  }
}

// ── Navigation Actions ──
function enterPlanet(id) {
  navHistory.push({ level: currentLevel, planet: currentPlanet, component: currentComponent });
  currentLevel = 'planet';
  currentPlanet = id;
  currentComponent = null;
  renderPlanetView(id);
  setGalaxyCanvasVisible(false);
  showView('planet-view', 'in');
  updateBreadcrumb();
  setHash(`#/${id}`);
  updateDocumentTitle('planet', id);
}

function enterCore(pid, cid) {
  navHistory.push({ level: currentLevel, planet: currentPlanet, component: currentComponent });
  currentLevel = 'core';
  currentComponent = cid;
  renderCoreView(pid, cid);
  showView('core-view', 'in');
  updateBreadcrumb();
  setHash(`#/${pid}/${cid}`);
  updateDocumentTitle('core', pid, cid);
}

function enterEntity(pid, cid, entityType, entityName) {
  navHistory.push({
    level: currentLevel,
    planet: currentPlanet,
    component: currentComponent,
    entity: currentEntity,
    entityTab: currentEntityTab
  });
  currentLevel = 'entity';
  currentEntity = { type: entityType, name: entityName };
  currentEntityTab = entityType;
  renderEntityView(pid, cid, entityType, entityName);
  showView('entity-view', 'in');
  updateBreadcrumb();
  setHash(`#/${pid}/${cid}/${entityType}/${encodeURIComponent(entityName)}`);
  updateDocumentTitle('entity', pid, cid, entityName);
  if (typeof track === 'function') track('entity_view', { type: entityType, name: entityName });
}

function navigateToCore(pid, cid) {
  navHistory.push({ level: currentLevel, planet: currentPlanet, component: currentComponent });
  currentLevel = 'core';
  currentPlanet = pid;
  currentComponent = cid;
  renderPlanetView(pid);
  renderCoreView(pid, cid);
  setGalaxyCanvasVisible(false);
  showViewDirect('core-view');
  updateBreadcrumb();
  setHash(`#/${pid}/${cid}`);
  updateDocumentTitle('core', pid, cid);
}

function navigateTo(level) {
  if (level === currentLevel) return;
  if (level === 'galaxy') {
    currentLevel = 'galaxy';
    currentPlanet = null;
    currentComponent = null;
    resetZoomPan();
    setGalaxyCanvasVisible(true);
    showView('galaxy-view', 'out');
    // Restart graph + particle animation
    if (typeof graphSettled !== 'undefined') {
      graphSettled = false;
      requestAnimationFrame(graphTick);
      requestAnimationFrame(particleTick);
    }
    setHash('#/');
    updateDocumentTitle('galaxy');
  } else if (level === 'planet') {
    currentLevel = 'planet';
    currentComponent = null;
    showView('planet-view', 'out');
    setHash(`#/${currentPlanet}`);
    updateDocumentTitle('planet', currentPlanet);
  } else if (level === 'core') {
    currentLevel = 'core';
    currentEntity = null;
    showView('core-view', 'out');
    setHash(`#/${currentPlanet}/${currentComponent}`);
    updateDocumentTitle('core', currentPlanet, currentComponent);
  }
  updateBreadcrumb();
}

function goBack() {
  if (typeof track === 'function') track('back_navigation', { from: currentLevel });
  if (navHistory.length > 0) {
    const prev = navHistory.pop();
    if (prev.level === 'galaxy') {
      navigateTo('galaxy');
    } else if (prev.level === 'planet') {
      currentPlanet = prev.planet;
      navigateTo('planet');
    } else if (prev.level === 'core') {
      currentLevel = 'core';
      currentPlanet = prev.planet;
      currentComponent = prev.component;
      currentEntity = null;
      showView('core-view', 'out');
      updateBreadcrumb();
      setHash(`#/${prev.planet}/${prev.component}`);
      updateDocumentTitle('core', prev.planet, prev.component);
    }
  } else {
    if (currentLevel === 'entity') navigateTo('core');
    else if (currentLevel === 'core') navigateTo('planet');
    else if (currentLevel === 'planet') navigateTo('galaxy');
  }
}

// ── Render Planet View ──
function renderPlanetView(id) {
  const p = NPSP[id];
  const el = document.getElementById('planet-content');

  // Domain-level entity counts
  var domainStats = '';
  if (p._entities) {
    var dc = (p._entities.classes || []).length;
    var do_ = (p._entities.objects || []).length;
    var dt = (p._entities.triggers || []).length;
    var dl = (p._entities.lwcs || []).length;
    var parts = [];
    if (dc) parts.push(dc + ' classes');
    if (do_) parts.push(do_ + ' objects');
    if (dt) parts.push(dt + ' triggers');
    if (dl) parts.push(dl + ' LWCs');
    if (parts.length > 0) {
      domainStats = '<div class="domain-entity-stats">' +
        p.components.length + ' groups \u00B7 ' + parts.join(' \u00B7 ') +
        '</div>';
    }
  }

  el.innerHTML = '<div class="bc">' +  // eslint-disable-line -- data is app-owned, not user input
    '<span class="bc-link" onclick="navigateTo(\'galaxy\')">NPSP</span>' +
    '<span class="bc-sep">\u276F</span>' +
    '<span class="bc-here">' + p.name + '</span></div>' +
    '<div class="planet-header">' +
    '<div class="planet-header-orb" style="background:' + p.color + ';box-shadow:0 0 20px ' + p.color + '">' + p.icon + '</div>' +
    '<div><h2 style="color:' + p.color + '">' + p.name + '</h2><p>' + p.description + '</p></div></div>' +
    domainStats +
    '<div class="component-grid">' +
    p.components.map(function(c, i) {
      var entityBadges = '';
      if (c.entities) {
        var counts = [];
        if (c.entities.classes && c.entities.classes.length > 0)
          counts.push('<span class="entity-badge badge-class">{ } ' + c.entities.classes.length + '</span>');
        if (c.entities.objects && c.entities.objects.length > 0)
          counts.push('<span class="entity-badge badge-object">\u{1F5C3} ' + c.entities.objects.length + '</span>');
        if (c.entities.triggers && c.entities.triggers.length > 0)
          counts.push('<span class="entity-badge badge-trigger">\u26A1 ' + c.entities.triggers.length + '</span>');
        if (c.entities.lwcs && c.entities.lwcs.length > 0)
          counts.push('<span class="entity-badge badge-lwc">\u{1F9E9} ' + c.entities.lwcs.length + '</span>');
        if (counts.length > 0)
          entityBadges = '<div class="entity-badges">' + counts.join('') + '</div>';
      }
      return '<div class="component-card" data-component="' + c.id + '" style="--card-accent:' + p.color + ';animation-delay:' + (i * 30) + 'ms" ' +
        'onclick="enterCore(\'' + id + '\',\'' + c.id + '\')" role="button" tabindex="0" ' +
        'onkeydown="if(event.key===\'Enter\')enterCore(\'' + id + '\',\'' + c.id + '\')">' +
        '<h3><span class="icon">' + c.icon + '</span> ' + c.name + '</h3>' +
        '<div class="card-desc">' + c.desc + '</div>' +
        '<div class="card-tags">' +
        (c.tags || []).map(function(t) { return '<span class="card-tag">' + t + '</span>'; }).join('') +
        (c.triggerTags || []).map(function(t) { return '<span class="card-tag trigger">' + t + '</span>'; }).join('') +
        '</div>' + entityBadges + '</div>';
    }).join('') +
    '</div>' +
    '<div class="data-flow" style="animation-delay:' + (p.components.length * 30 + 60) + 'ms">' +
    '<h3>\u{1F500} Data Flow</h3>' +
    '<div class="flow-diagram">' +
    p.dataFlow.map(function(n, i) {
      return (i > 0 ? '<span class="flow-arrow">\u2192</span>' : '') + '<span class="flow-node">' + n + '</span>';
    }).join('') +
    '</div></div>' +
    '<div class="connections-section" style="animation-delay:' + (p.components.length * 30 + 120) + 'ms">' +
    '<h3>\u{1F30C} Connected Systems</h3>' +
    p.connections.map(function(c) {
      return '<div class="connection-item" onclick="enterPlanet(\'' + c.planet + '\')" role="button" tabindex="0" ' +
        'onkeydown="if(event.key===\'Enter\')enterPlanet(\'' + c.planet + '\')">' +
        '<div class="conn-planet" style="background:' + (PLANET_META[c.planet] ? PLANET_META[c.planet].color : '#64748b') + '">' +
        (PLANET_META[c.planet] ? PLANET_META[c.planet].icon : '\u{2B50}') + '</div>' +
        '<div><strong>' + (NPSP[c.planet] ? NPSP[c.planet].name : c.planet) + '</strong>' +
        '<div style="color:var(--text-dim);font-size:var(--text-xs);margin-top:2px">' + c.desc + '</div></div></div>';
    }).join('') +
    '</div>';
  document.getElementById('planet-view').scrollTop = 0;
}

// ── Render Overview Tab (extracted from core view body) ──
function renderOverviewTab(c) {
  var h = '<div class="trigger-section" style="animation-delay:0ms">' +
    '<h3>\u{1F4CB} Overview</h3>' +
    '<div class="trigger-desc">' + c.desc + '</div>' +
    '<div class="card-tags">' +
    (c.tags || []).map(function(t) { return '<span class="card-tag">' + t + '</span>'; }).join('') +
    (c.triggerTags || []).map(function(t) { return '<span class="card-tag trigger">' + t + '</span>'; }).join('') +
    '</div></div>';

  if (c.executionFlow) {
    h += '<div class="trigger-section" style="animation-delay:60ms">' +
      '<h3>\u26A1 Execution Flow</h3>' +
      '<div class="execution-flow">' +
      c.executionFlow.map(function(s, i) {
        return '<div class="exec-step" style="animation-delay:' + (80 + i * 40) + 'ms">' +
          '<span class="step-num">' + (i + 1) + '</span><span>' + s + '</span></div>';
      }).join('') +
      '</div></div>';
  }

  if (c.docs && c.docs.length > 0) {
    h += '<div class="trigger-section doc-section" style="animation-delay:90ms">' +
      '<h3>\u{1F4DA} Documentation</h3>' +
      c.docs.map(function(p) { return '<p class="doc-para">' + p + '</p>'; }).join('');
    if (c.docUrl) {
      h += '<a class="doc-source-link" href="' + c.docUrl + '" target="_blank" rel="noopener noreferrer">' +
        '\u{1F517} View on Salesforce Help \u2197</a>';
    }
    h += '</div>';
  }

  if (c.code) {
    h += '<div class="trigger-section" style="animation-delay:120ms">' +
      '<h3>\u{1F4BB} Source Code Pattern</h3>' +
      '<div class="code-block"><div class="code-header">' +
      '<span class="lang">' + c.code.lang + '</span>' +
      '<span>' + c.code.title + '</span>' +
      '<button class="copy-btn" onclick="copyCode(this)" aria-label="Copy code">Copy</button>' +
      '</div><div class="code-body"><pre>' + c.code.body + '</pre></div></div></div>';
  }

  h += '<div class="code-lab" style="animation-delay:180ms">' +
    '<h3>\u{1F9EA} Code Lab: Explore Further</h3>' +
    '<div class="lab-desc">Related patterns for understanding this component deeper.</div>' +
    '<div class="lab-tabs">' +
    '<button class="lab-tab active" onclick="switchTab(this,\'pattern\')" aria-label="TDTM Pattern">TDTM Pattern</button>' +
    '<button class="lab-tab" onclick="switchTab(this,\'testing\')" aria-label="Test Pattern">Test Pattern</button>' +
    '<button class="lab-tab" onclick="switchTab(this,\'extension\')" aria-label="Extension Point">Extension Point</button>' +
    '</div><div id="lab-content"></div></div>';

  return h;
}

// ── Render Core View ──
function renderCoreView(pid, cid) {
  const p = NPSP[pid];
  const c = p.components.find(function(x) { return x.id === cid; });
  if (!c) return;
  const el = document.getElementById('core-content');

  // Build tab data
  var tabs = [{key: 'overview', label: 'Overview', count: null}];
  if (c.entities) {
    if (c.entities.classes && c.entities.classes.length > 0)
      tabs.push({key: 'classes', label: 'Classes', count: c.entities.classes.length});
    if (c.entities.objects && c.entities.objects.length > 0)
      tabs.push({key: 'objects', label: 'Objects', count: c.entities.objects.length});
    if (c.entities.triggers && c.entities.triggers.length > 0)
      tabs.push({key: 'triggers', label: 'Triggers', count: c.entities.triggers.length});
    if (c.entities.lwcs && c.entities.lwcs.length > 0)
      tabs.push({key: 'lwcs', label: 'LWCs', count: c.entities.lwcs.length});
    if (c.entities.metadata && c.entities.metadata.length > 0)
      tabs.push({key: 'metadata', label: 'Metadata', count: c.entities.metadata.length});
  }

  // Tab bar HTML (only show if there are entity tabs beyond Overview)
  var tabBar = '';
  if (tabs.length > 1) {
    tabBar = '<div class="entity-tab-bar">' +
      tabs.map(function(t) {
        return '<button class="entity-tab' + (t.key === 'overview' ? ' active' : '') +
          '" data-tab="' + t.key + '" onclick="switchEntityTab(\'' + pid + '\',\'' + cid + '\',\'' + t.key + '\')">' +
          t.label + (t.count !== null ? ' <span class="tab-count">' + t.count + '</span>' : '') +
          '</button>';
      }).join('') + '</div>';
  }

  // Header + breadcrumb + tab bar + content
  let h = '<div class="bc">' +
    '<span class="bc-link" onclick="navigateTo(\'galaxy\')">NPSP</span>' +
    '<span class="bc-sep">\u276F</span>' +
    '<span class="bc-link" onclick="navigateTo(\'planet\')">' + p.name + '</span>' +
    '<span class="bc-sep">\u276F</span>' +
    '<span class="bc-here">' + c.name + '</span></div>' +
    '<div class="core-header">' +
    '<span style="font-size:24px">' + c.icon + '</span>' +
    '<div><h2>' + c.name + '</h2><span class="badge">TRIGGER LEVEL</span></div></div>' +
    tabBar +
    '<div id="entity-tab-content">' +
    renderOverviewTab(c) +
    '</div>';

  el.innerHTML = h;
  // Init Code Lab if on overview
  var labTab = el.querySelector('.lab-tab.active');
  if (labTab) switchTab(labTab, 'pattern');
  document.getElementById('core-view').scrollTop = 0;
}

// ── Switch Entity Tab ──
function switchEntityTab(pid, cid, tabKey) {
  if (typeof track === 'function') track('tab_switch', { tab: tabKey });
  // Update active tab styling
  document.querySelectorAll('.entity-tab').forEach(function(t) {
    t.classList.toggle('active', t.dataset.tab === tabKey);
  });

  var contentEl = document.getElementById('entity-tab-content');
  var p = NPSP[pid];
  var c = p.components.find(function(x) { return x.id === cid; });
  if (!c) return;

  if (tabKey === 'overview') {
    contentEl.innerHTML = renderOverviewTab(c);
    var labTab = contentEl.querySelector('.lab-tab.active');
    if (labTab) switchTab(labTab, 'pattern');
  } else {
    contentEl.innerHTML = renderEntityGrid(c, tabKey, pid);
  }

  document.getElementById('core-view').scrollTop = 0;
}

// ── Render Entity Grid ──
function renderEntityGrid(component, entityType, pid) {
  var entities = (component.entities && component.entities[entityType]) || [];
  if (entities.length === 0) {
    return '<div class="trigger-section"><p style="color:var(--text-dim)">No ' + entityType + ' found.</p></div>';
  }

  var typeConfig = {
    classes:  { icon: '{ }', color: 'rgba(77,139,255,', badgeClass: 'badge-class' },
    objects:  { icon: '\u{1F5C3}', color: 'rgba(34,197,94,', badgeClass: 'badge-object' },
    triggers: { icon: '\u26A1', color: 'rgba(239,68,68,', badgeClass: 'badge-trigger' },
    lwcs:     { icon: '\u{1F9E9}', color: 'rgba(168,85,247,', badgeClass: 'badge-lwc' },
    metadata: { icon: '\u2699', color: 'rgba(245,158,11,', badgeClass: 'badge-metadata' }
  };
  var cfg = typeConfig[entityType] || typeConfig.classes;

  return '<div class="entity-grid">' +
    entities.map(function(e, i) {
      return '<div class="entity-card" style="animation-delay:' + (i * 30) + 'ms" ' +
        'onclick="enterEntity(\'' + pid + '\',\'' + component.id + '\',\'' + entityType + '\',\'' + e.name.replace(/'/g, "\\'") + '\')" ' +
        'role="button" tabindex="0" ' +
        'onkeydown="if(event.key===\'Enter\')enterEntity(\'' + pid + '\',\'' + component.id + '\',\'' + entityType + '\',\'' + e.name.replace(/'/g, "\\'") + '\')">' +
        '<div class="entity-card-header">' +
        '<span class="entity-type-icon ' + cfg.badgeClass + '">' + cfg.icon + '</span>' +
        '<span class="entity-name">' + e.name + '</span>' +
        '</div>' +
        (e.type ? '<span class="entity-type-label">' + e.type.replace('_', ' ') + '</span>' : '') +
        '<div class="entity-desc">' + (e.description || 'No description available.').substring(0, 150) +
        (e.description && e.description.length > 150 ? '...' : '') + '</div>' +
        (e.linesOfCode ? '<span class="entity-loc">' + e.linesOfCode + ' lines</span>' : '') +
        (e.fieldCount ? '<span class="entity-loc">' + e.fieldCount + ' fields</span>' : '') +
        '</div>';
    }).join('') +
    '</div>';
}

// ── Cross-Domain Entity Lookup ──
function findEntityAcrossDomains(entityName, entityType) {
  for (var pid in NPSP) {
    var domain = NPSP[pid];
    for (var ci = 0; ci < domain.components.length; ci++) {
      var comp = domain.components[ci];
      if (comp.entities && comp.entities[entityType]) {
        var match = comp.entities[entityType].find(function(e) { return e.name === entityName; });
        if (match) return { pid: pid, cid: comp.id, entity: match };
      }
    }
  }
  return null;
}

// ── Render Entity View (Level 4 detail) ──
function renderEntityView(pid, cid, entityType, entityName) {
  var p = NPSP[pid];
  var c = p.components.find(function(x) { return x.id === cid; });
  if (!c || !c.entities) return;

  var entity = (c.entities[entityType] || []).find(function(e) { return e.name === entityName; });
  if (!entity) return;

  var el = document.getElementById('entity-content');

  // Breadcrumb
  var h = '<div class="bc">' +
    '<span class="bc-link" onclick="navigateTo(\'galaxy\')">NPSP</span>' +
    '<span class="bc-sep">\u276F</span>' +
    '<span class="bc-link" onclick="navigateTo(\'planet\')">' + p.name + '</span>' +
    '<span class="bc-sep">\u276F</span>' +
    '<span class="bc-link" onclick="goBack()">' + c.name + '</span>' +
    '<span class="bc-sep">\u276F</span>' +
    '<span class="bc-here">' + entity.name + '</span></div>';

  // Render based on entity type
  if (entityType === 'classes') {
    h += renderClassDetail(entity);
  } else if (entityType === 'objects') {
    h += renderObjectDetail(entity);
  } else if (entityType === 'triggers') {
    h += renderTriggerDetail(entity);
  } else if (entityType === 'lwcs') {
    h += renderLwcDetail(entity);
  } else if (entityType === 'metadata') {
    h += renderMetadataDetail(entity);
  }

  el.innerHTML = h;
  document.getElementById('entity-view').scrollTop = 0;
}

// ── Apex Class Detail Renderer ──
function renderClassDetail(entity) {
  var typeColors = {
    tdtm_handler: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'TDTM Handler' },
    batch: { bg: 'rgba(168,85,247,0.1)', color: '#a855f7', label: 'Batch Job' },
    service: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', label: 'Service' },
    utility: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'Utility' },
    controller: { bg: 'rgba(6,182,212,0.1)', color: '#06b6d4', label: 'Controller' },
    scheduled: { bg: 'rgba(124,58,237,0.1)', color: '#7c3aed', label: 'Scheduled' },
    'class': { bg: 'rgba(77,139,255,0.1)', color: '#4d8bff', label: 'Class' }
  };
  var tc = typeColors[entity.type] || typeColors['class'];

  var h = '<div class="entity-detail-header">' +
    '<div class="entity-detail-icon badge-class">{ }</div>' +
    '<div>' +
    '<h2 class="entity-detail-name">' + entity.name + '</h2>' +
    '<span class="entity-detail-type" style="background:' + tc.bg + ';color:' + tc.color + '">' + tc.label + '</span>' +
    (entity.linesOfCode ? '<span class="entity-detail-meta">' + entity.linesOfCode + ' lines of code</span>' : '') +
    '</div></div>';

  // Description
  h += '<div class="entity-detail-section">' +
    '<h3>Description</h3>' +
    '<p>' + (entity.description || 'No description available.') + '</p>' +
    '</div>';

  // TDTM handler context
  if (entity.type === 'tdtm_handler' && entity.object) {
    h += '<div class="entity-detail-section">' +
      '<h3>\u26A1 Trigger Context</h3>' +
      '<div class="entity-detail-table">' +
      '<div class="edt-row"><span class="edt-label">Object:</span><span>' + entity.object + '</span></div>' +
      (entity.triggerActions ? '<div class="edt-row"><span class="edt-label">Events:</span><span>' +
        entity.triggerActions.map(function(a) {
          return '<span class="card-tag trigger">' + a + '</span>';
        }).join(' ') + '</span></div>' : '') +
      (entity.loadOrder ? '<div class="edt-row"><span class="edt-label">Load Order:</span><span>' + entity.loadOrder + '</span></div>' : '') +
      '</div></div>';
  }

  // Inheritance
  if (entity.extends) {
    h += '<div class="entity-detail-section">' +
      '<h3>Inheritance</h3>' +
      '<div class="entity-detail-table">' +
      '<div class="edt-row"><span class="edt-label">Extends:</span><span class="entity-detail-code">' + entity.extends + '</span></div>' +
      (entity.implements ? '<div class="edt-row"><span class="edt-label">Implements:</span><span class="entity-detail-code">' + entity.implements + '</span></div>' : '') +
      '</div></div>';
  }

  // Key methods
  if (entity.keyMethods && entity.keyMethods.length > 0) {
    h += '<div class="entity-detail-section">' +
      '<h3>Key Methods</h3>' +
      '<div class="entity-methods">' +
      entity.keyMethods.map(function(m) {
        return '<span class="entity-method">' + m + '</span>';
      }).join('') +
      '</div></div>';
  }

  // Referenced objects
  if (entity.referencedObjects && entity.referencedObjects.length > 0) {
    h += '<div class="entity-detail-section">' +
      '<h3>\u{1F517} Referenced Objects</h3>' +
      '<div class="entity-refs">' +
      entity.referencedObjects.map(function(refName) {
        var found = findEntityAcrossDomains(refName, 'objects');
        if (found) {
          return '<span class="entity-ref badge-object entity-link" ' +
            'onclick="enterEntity(\'' + found.pid + '\',\'' + found.cid + '\',\'objects\',\'' + refName.replace(/'/g, "\\'") + '\')" ' +
            'role="button" tabindex="0">' + refName + ' \u2197</span>';
        }
        return '<span class="entity-ref badge-object">' + refName + '</span>';
      }).join('') +
      '</div></div>';
  }

  // Source link
  if (entity.sourceUrl) {
    h += '<div class="entity-detail-section">' +
      '<a class="entity-source-link" href="' + entity.sourceUrl + '" target="_blank" rel="noopener noreferrer">' +
      '\u{1F4C4} View Source on GitHub \u2197</a></div>';
  }

  return h;
}

// ── Object Detail Renderer ──
function renderObjectDetail(entity) {
  var h = '<div class="entity-detail-header">' +
    '<div class="entity-detail-icon badge-object">\u{1F5C3}</div>' +
    '<div>' +
    '<h2 class="entity-detail-name">' + (entity.label || entity.name) + '</h2>' +
    '<span class="entity-detail-meta" style="display:block;margin-top:2px">' + entity.name + '</span>' +
    '<span class="entity-detail-meta">' + (entity.fieldCount || 0) + ' fields</span>' +
    '</div></div>';

  h += '<div class="entity-detail-section">' +
    '<h3>Description</h3>' +
    '<p>' + (entity.description || 'Custom object in the NPSP managed package.') + '</p>' +
    '</div>';

  if (entity.relationships && entity.relationships.length > 0) {
    h += '<div class="entity-detail-section">' +
      '<h3>\u{1F517} Relationships</h3>' +
      '<div class="entity-detail-table">' +
      entity.relationships.map(function(r) {
        return '<div class="edt-row">' +
          '<span class="edt-label">' + r.type + ':</span>' +
          '<span><span class="entity-detail-code">' + r.field + '</span> \u2192 ' + r.target + '</span></div>';
      }).join('') +
      '</div></div>';
  }

  if (entity.keyFields && entity.keyFields.length > 0) {
    h += '<div class="entity-detail-section">' +
      '<h3>Fields (' + entity.keyFields.length + (entity.keyFields.length >= 15 ? '+' : '') + ')</h3>' +
      '<div class="entity-fields-table">' +
      '<div class="eft-header"><span>Field</span><span>Type</span><span>Description</span></div>' +
      entity.keyFields.map(function(f) {
        return '<div class="eft-row">' +
          '<span class="entity-detail-code">' + f.name + '</span>' +
          '<span class="eft-type">' + f.type + '</span>' +
          '<span class="eft-desc">' + (f.desc || f.label || '') + '</span></div>';
      }).join('') +
      '</div></div>';
  }

  if (entity.sourceUrl) {
    h += '<div class="entity-detail-section">' +
      '<a class="entity-source-link" href="' + entity.sourceUrl + '" target="_blank" rel="noopener noreferrer">' +
      '\u{1F4C4} View on GitHub \u2197</a></div>';
  }

  return h;
}

// ── Trigger Detail Renderer ──
function renderTriggerDetail(entity) {
  var h = '<div class="entity-detail-header">' +
    '<div class="entity-detail-icon badge-trigger">\u26A1</div>' +
    '<div>' +
    '<h2 class="entity-detail-name">' + entity.name + '</h2>' +
    '<span class="entity-detail-meta">Trigger on ' + entity.object + '</span>' +
    '</div></div>';

  h += '<div class="entity-detail-section">' +
    '<h3>Description</h3>' +
    '<p>TDTM trigger for the ' + entity.object + ' object. All NPSP triggers follow the one-trigger-per-object pattern, dispatching to registered handler classes via the TDTM framework.</p>' +
    '</div>';

  if (entity.events && entity.events.length > 0) {
    h += '<div class="entity-detail-section">' +
      '<h3>\u26A1 Registered Events</h3>' +
      '<div class="entity-methods">' +
      entity.events.map(function(e) {
        return '<span class="card-tag trigger">' + e + '</span>';
      }).join('') +
      '</div></div>';
  }

  if (entity.handlers && entity.handlers.length > 0) {
    h += '<div class="entity-detail-section">' +
      '<h3>\u{1F517} Handler Chain</h3>' +
      '<p style="margin-bottom:8px;font-size:var(--text-xs);color:var(--text-dim)">Handlers execute in Load_Order__c sequence:</p>' +
      '<div class="trigger-handler-chain">' +
      entity.handlers.map(function(handler, i) {
        return '<div class="handler-chain-item">' +
          '<span class="handler-order">' + (i + 1) + '</span>' +
          (function() {
            var found = findEntityAcrossDomains(handler, 'classes');
            if (found) {
              return '<span class="entity-detail-code entity-link" ' +
                'onclick="enterEntity(\'' + found.pid + '\',\'' + found.cid + '\',\'classes\',\'' + handler.replace(/'/g, "\\'") + '\')" ' +
                'role="button" tabindex="0">' + handler + ' \u2197</span>';
            }
            return '<span class="entity-detail-code">' + handler + '</span>';
          })() +
          '</div>';
      }).join('') +
      '</div></div>';
  }

  if (entity.sourceUrl) {
    h += '<div class="entity-detail-section">' +
      '<a class="entity-source-link" href="' + entity.sourceUrl + '" target="_blank" rel="noopener noreferrer">' +
      '\u{1F4C4} View Source on GitHub \u2197</a></div>';
  }

  return h;
}

// ── LWC Detail Renderer ──
function renderLwcDetail(entity) {
  var h = '<div class="entity-detail-header">' +
    '<div class="entity-detail-icon badge-lwc">\u{1F9E9}</div>' +
    '<div>' +
    '<h2 class="entity-detail-name">' + entity.name + '</h2>' +
    '<span class="entity-detail-type" style="background:rgba(168,85,247,0.1);color:#a855f7">Lightning Web Component</span>' +
    '</div></div>';

  h += '<div class="entity-detail-section">' +
    '<h3>Description</h3>' +
    '<p>' + (entity.description || 'Lightning Web Component in the NPSP managed package.') + '</p>' +
    '</div>';

  if (entity.imports && entity.imports.length > 0) {
    h += '<div class="entity-detail-section">' +
      '<h3>Imports</h3>' +
      '<div class="entity-methods">' +
      entity.imports.map(function(i) {
        return '<span class="entity-method">' + i + '</span>';
      }).join('') +
      '</div></div>';
  }

  if (entity.sourceUrl) {
    h += '<div class="entity-detail-section">' +
      '<a class="entity-source-link" href="' + entity.sourceUrl + '" target="_blank" rel="noopener noreferrer">' +
      '\u{1F4C4} View on GitHub \u2197</a></div>';
  }

  return h;
}

// ── Metadata Detail Renderer ──
function renderMetadataDetail(entity) {
  var h = '<div class="entity-detail-header">' +
    '<div class="entity-detail-icon badge-metadata">\u2699</div>' +
    '<div>' +
    '<h2 class="entity-detail-name">' + entity.name + '</h2>' +
    '<span class="entity-detail-type" style="background:rgba(245,158,11,0.1);color:#f59e0b">Custom Metadata Type</span>' +
    (entity.recordCount ? '<span class="entity-detail-meta">' + entity.recordCount + ' records</span>' : '') +
    '</div></div>';

  h += '<div class="entity-detail-section">' +
    '<h3>Description</h3>' +
    '<p>' + (entity.description || 'Custom Metadata Type used for NPSP configuration.') + '</p>' +
    '</div>';

  return h;
}

// ── Code Lab Patterns ──
const labPatterns = {
  pattern: {
    title: 'TDTM Handler Pattern',
    code: '<span class="cm">// Create a custom TDTM handler</span>\n<span class="kw">public class</span> <span class="ty">MyCustomHandler</span>\n  <span class="kw">extends</span> <span class="ty">TDTM_Runnable</span> {\n\n  <span class="kw">public override</span> <span class="ty">DmlWrapper</span> <span class="fn">run</span>(\n    <span class="ty">List&lt;SObject&gt;</span> newList,\n    <span class="ty">List&lt;SObject&gt;</span> oldList,\n    <span class="ty">TDTM_Runnable.Action</span> triggerAction,\n    <span class="ty">Schema.DescribeSObjectResult</span> objResult\n  ) {\n    <span class="kw">if</span> (triggerAction == <span class="ty">Action</span>.AfterInsert) {\n      <span class="kw">for</span> (<span class="ty">SObject</span> record : newList) {\n        <span class="cm">// Custom logic here</span>\n      }\n    }\n    <span class="kw">return null</span>;\n  }\n}\n\n<span class="cm">// Or extend TDTM_RunnableMutable for</span>\n<span class="cm">// handlers that need to mutate records</span>'
  },
  testing: {
    title: 'Test Pattern for TDTM Handlers',
    code: '<span class="an">@isTest</span>\n<span class="kw">private class</span> <span class="ty">MyHandler_TEST</span> {\n\n  <span class="an">@testSetup</span>\n  <span class="kw">static void</span> <span class="fn">setup</span>() {\n    <span class="ty">UTIL_UnitTestData_TEST</span>\n      .<span class="fn">createDefaultSettings</span>();\n  }\n\n  <span class="an">@isTest</span>\n  <span class="kw">static void</span> <span class="fn">testHandler</span>() {\n    <span class="ty">Contact</span> c = <span class="ty">UTIL_UnitTestData_TEST</span>\n      .<span class="fn">createTestContact</span>();\n\n    <span class="ty">Test</span>.startTest();\n    <span class="ty">Opportunity</span> opp = <span class="kw">new</span> <span class="ty">Opportunity</span>(\n      ContactId = c.Id,\n      Amount = <span class="nu">100</span>,\n      CloseDate = <span class="ty">Date</span>.today(),\n      StageName = <span class="st">\\\'Closed Won\\\'</span>,\n      Name = <span class="st">\\\'Test\\\'</span>\n    );\n    <span class="kw">insert</span> opp;\n    <span class="ty">Test</span>.stopTest();\n\n    opp = [<span class="kw">SELECT</span> Name <span class="kw">FROM</span> <span class="ty">Opportunity</span>\n           <span class="kw">WHERE</span> Id = :opp.Id];\n    <span class="ty">System</span>.assertNotEquals(\n      <span class="st">\\\'Test\\\'</span>, opp.Name);\n  }\n}'
  },
  extension: {
    title: 'Extension Point: Custom Logic',
    code: '<span class="cm">// Extend NPSP without modifying its code</span>\n\n<span class="cm">// Option 1: Custom TDTM handler (recommended)</span>\n<span class="ty">npsp__Trigger_Handler__c</span> handler =\n  <span class="kw">new</span> <span class="ty">npsp__Trigger_Handler__c</span>(\n    npsp__Class__c = <span class="st">\\\'MyCustomHandler\\\'</span>,\n    npsp__Object__c = <span class="st">\\\'Opportunity\\\'</span>,\n    npsp__Trigger_Action__c =\n      <span class="st">\\\'AfterInsert;AfterUpdate\\\'</span>,\n    npsp__Load_Order__c = <span class="nu">99</span>,\n    npsp__Active__c = <span class="kw">true</span>,\n    npsp__User_Managed__c = <span class="kw">true</span>\n      <span class="cm">// Prevents NPSP from overwriting</span>\n  );\n<span class="kw">insert</span> handler;\n\n<span class="cm">// Option 2: Flow / Process Builder</span>\n<span class="cm">// Runs after all TDTM handlers</span>\n\n<span class="cm">// Option 3: Custom Rollup (CMDT)</span>\n<span class="cm">// Via NPSP Settings UI, no code</span>'
  }
};

function switchTab(tab, type) {
  tab.parentElement.querySelectorAll('.lab-tab').forEach(function(t) { t.classList.remove('active'); });
  tab.classList.add('active');
  var p = labPatterns[type];
  document.getElementById('lab-content').innerHTML = '<div class="code-block"><div class="code-header">' +
    '<span class="lang">Apex</span><span>' + p.title + '</span>' +
    '<button class="copy-btn" onclick="copyCode(this)" aria-label="Copy code">Copy</button>' +
    '</div><div class="code-body"><pre>' + p.code + '</pre></div></div>';
}

function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  const text = pre.textContent;

  const onSuccess = () => {
    btn.textContent = '\u2713 Copied';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1500);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
      // Fallback: legacy execCommand copy
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        onSuccess();
      } catch (e) {
        // Silently fail if both methods unavailable
      }
    });
  } else {
    // No clipboard API available, try legacy
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      onSuccess();
    } catch (e) {
      // Silently fail
    }
  }
}
