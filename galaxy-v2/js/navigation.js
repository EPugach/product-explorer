// ══════════════════════════════════════════════════════
// Navigation — Views, breadcrumbs, drill-down, renderers
// Note: innerHTML usage is safe here — all content comes
// from the hardcoded NPSP data object, not user input.
// ══════════════════════════════════════════════════════

let currentLevel = 'galaxy', currentDomain = null, currentComponent = null;
let navHistory = [];

function showView(id, direction) {
  const layers = document.querySelectorAll('.view-layer');
  layers.forEach(v => {
    if (v.classList.contains('active')) {
      v.classList.remove('active');
      if (direction === 'in') v.classList.add('zoom-out');
      else if (direction === 'out') v.classList.add('zoom-in');
      setTimeout(() => { v.classList.remove('zoom-out', 'zoom-in'); }, 800);
    }
  });

  const target = document.getElementById(id);
  if (direction === 'in') target.classList.add('zoom-in');
  else if (direction === 'out') target.classList.add('zoom-out');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.classList.remove('zoom-in', 'zoom-out');
      target.classList.add('active');
    });
  });

  // Canvas visibility
  const isGalaxy = id === 'galaxy-view';
  graphCanvas.style.opacity = isGalaxy ? '1' : '0';
  graphCanvas.style.pointerEvents = isGalaxy ? 'auto' : 'none';
  particleCanvas.style.opacity = isGalaxy ? '1' : '0';

  if (isGalaxy) {
    showParticles();
    graphSettled = false;
    alpha = Math.max(alpha, 0.01);
    requestAnimationFrame(graphTick);
  } else {
    hideParticles();
  }
}

function updateBreadcrumb() {
  const bc = document.getElementById('breadcrumb');
  // Safe: all values come from hardcoded NPSP object
  let h = '<span class="crumb' + (currentLevel === 'galaxy' ? ' active' : '') + '" onclick="navigateTo(\'galaxy\')">Galaxy</span>';
  if (currentDomain) {
    h += '<span class="crumb-sep">\u25B8</span><span class="crumb' + (currentLevel === 'domain' ? ' active' : '') + '" onclick="navigateTo(\'domain\')">' + NPSP[currentDomain].name + '</span>';
  }
  if (currentComponent) {
    const c = NPSP[currentDomain].components.find(x => x.id === currentComponent);
    if (c) h += '<span class="crumb-sep">\u25B8</span><span class="crumb active">' + c.name + '</span>';
  }
  bc.innerHTML = h; // eslint-disable-line -- hardcoded data only
  document.getElementById('backBtn').classList.toggle('visible', currentLevel !== 'galaxy');
}

function enterDomain(id) {
  navHistory.push({ level: currentLevel, domain: currentDomain, component: currentComponent });
  currentLevel = 'domain';
  currentDomain = id;
  currentComponent = null;
  renderDomainView(id);
  showView('domain-view', 'in');
  updateBreadcrumb();
}

function enterCore(did, cid) {
  navHistory.push({ level: currentLevel, domain: currentDomain, component: currentComponent });
  currentLevel = 'core';
  currentComponent = cid;
  renderCoreView(did, cid);
  showView('core-view', 'in');
  updateBreadcrumb();
}

function navigateTo(level) {
  if (level === currentLevel) return;
  if (level === 'galaxy') {
    currentLevel = 'galaxy'; currentDomain = null; currentComponent = null;
    showView('galaxy-view', 'out');
  } else if (level === 'domain') {
    currentLevel = 'domain'; currentComponent = null;
    showView('domain-view', 'out');
  }
  updateBreadcrumb();
}

function goBack() {
  if (navHistory.length > 0) {
    const p = navHistory.pop();
    if (p.level === 'galaxy') navigateTo('galaxy');
    else if (p.level === 'domain') { currentDomain = p.domain; navigateTo('domain'); }
  } else {
    if (currentLevel === 'core') navigateTo('domain');
    else if (currentLevel === 'domain') navigateTo('galaxy');
  }
}

// ── Render Domain View ──
// All content rendered below comes from the hardcoded NPSP data object (npsp-data.js).
// No user-supplied input is interpolated into the HTML.
function renderDomainView(id) {
  const p = NPSP[id], el = document.getElementById('domain-content');
  el.innerHTML =
    '<div class="planet-header"><div class="planet-header-orb" style="background:' + p.color + '22;border:2px solid ' + p.color + '">' + p.icon + '</div>' +
    '<div><h2 style="color:' + p.color + '">' + p.name + '</h2><p>' + p.description + '</p></div></div>' +
    '<div class="component-grid">' + p.components.map(c =>
      '<div class="component-card" style="--card-accent:' + p.color + '" onclick="enterCore(\'' + id + '\',\'' + c.id + '\')">' +
      '<h3><span class="icon">' + c.icon + '</span> ' + c.name + '</h3>' +
      '<div class="card-desc">' + c.desc + '</div>' +
      '<div class="card-tags">' +
      (c.tags || []).map(t => '<span class="card-tag">' + t + '</span>').join('') +
      (c.triggerTags || []).map(t => '<span class="card-tag trigger">' + t + '</span>').join('') +
      '</div></div>'
    ).join('') + '</div>' +
    '<div class="data-flow"><h3>Data Flow</h3><div class="flow-diagram">' +
    p.dataFlow.map((n, i) => (i > 0 ? '<span class="flow-arrow">\u2192</span>' : '') + '<span class="flow-node">' + n + '</span>').join('') +
    '</div></div>' +
    '<div class="connections-section"><h3>Connected Systems</h3>' +
    p.connections.map(c =>
      '<div class="connection-item" onclick="enterDomain(\'' + c.planet + '\')">' +
      '<div class="conn-planet" style="background:' + (PLANET_META[c.planet]?.color || '#64748b') + '22;border:1px solid ' + (PLANET_META[c.planet]?.color || '#64748b') + '">' +
      (PLANET_META[c.planet]?.icon || '\u2B50') + '</div>' +
      '<div><strong>' + (NPSP[c.planet]?.name || c.planet) + '</strong><div>' + c.desc + '</div></div></div>'
    ).join('') + '</div>';
  document.getElementById('domain-view').scrollTop = 0;
}

// ── Render Core View ──
function renderCoreView(pid, cid) {
  const p = NPSP[pid], c = p.components.find(x => x.id === cid);
  if (!c) return;
  const el = document.getElementById('core-content');
  let h = '<div class="core-header"><span style="font-size:22px">' + c.icon + '</span><div><h2>' + c.name + '</h2><span class="badge">TRIGGER LEVEL</span></div></div>';
  h += '<div class="trigger-section"><h3>Overview</h3><div class="trigger-desc">' + c.desc + '</div><div class="card-tags">' +
    (c.tags || []).map(t => '<span class="card-tag">' + t + '</span>').join('') +
    (c.triggerTags || []).map(t => '<span class="card-tag trigger">' + t + '</span>').join('') + '</div></div>';
  if (c.executionFlow) {
    h += '<div class="trigger-section"><h3>Execution Flow</h3><div class="execution-flow">' +
      c.executionFlow.map((s, i) => '<div class="exec-step"><span class="step-num">' + (i + 1) + '</span><span>' + s + '</span></div>').join('') + '</div></div>';
  }
  if (c.code) {
    h += '<div class="trigger-section"><h3>Source Code Pattern</h3><div class="code-block"><div class="code-header"><span class="lang">' + c.code.lang + '</span><span>' + c.code.title + '</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div><div class="code-body"><pre>' + c.code.body + '</pre></div></div></div>';
  }
  h += '<div class="code-lab"><h3>Code Lab: Explore Further</h3><div class="lab-desc">Related patterns for understanding this component deeper.</div><div class="lab-tabs"><button class="lab-tab active" onclick="switchTab(this,\'pattern\')">TDTM Pattern</button><button class="lab-tab" onclick="switchTab(this,\'testing\')">Test Pattern</button><button class="lab-tab" onclick="switchTab(this,\'extension\')">Extension Point</button></div><div id="lab-content"></div></div>';
  el.innerHTML = h;
  switchTab(el.querySelector('.lab-tab.active'), 'pattern');
  document.getElementById('core-view').scrollTop = 0;
}

function switchTab(tab, type) {
  tab.parentElement.querySelectorAll('.lab-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const p = labPatterns[type];
  document.getElementById('lab-content').innerHTML =
    '<div class="code-block"><div class="code-header"><span class="lang">Apex</span><span>' + p.title + '</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div><div class="code-body"><pre>' + p.code + '</pre></div></div>';
}

function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  navigator.clipboard.writeText(pre.textContent).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 1500);
  });
}
