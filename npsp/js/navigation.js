// ══════════════════════════════════════════════════════════════
//  NAVIGATION — Views, breadcrumbs, state management
// ══════════════════════════════════════════════════════════════

const PLANET_META = {};
for (const [k, v] of Object.entries(NPSP)) {
  PLANET_META[k] = { icon: v.icon, color: v.color };
}

let currentLevel = 'galaxy';
let currentPlanet = null;
let currentComponent = null;
let navHistory = [];

// ── Dynamic Connections ──
function renderConnections() {
  const svg = document.getElementById('galaxy-svg');
  svg.querySelectorAll('line').forEach(l => l.remove());
  const map = document.getElementById('galaxy-map');
  const mapRect = map.getBoundingClientRect();
  const svgW = 1100, svgH = 600;
  const scaleX = svgW / mapRect.width, scaleY = svgH / mapRect.height;
  const centers = {};
  document.querySelectorAll('.planet[data-planet]').forEach(el => {
    const id = el.dataset.planet;
    const sz = parseFloat(getComputedStyle(el).getPropertyValue('--size'));
    const left = parseFloat(el.style.left);
    const top = parseFloat(el.style.top);
    centers[id] = { x: left + sz / 2, y: top + sz / 2 };
  });
  const drawn = new Set();
  for (const [pid, planet] of Object.entries(NPSP)) {
    if (!centers[pid]) continue;
    for (const conn of planet.connections) {
      const tid = conn.planet;
      if (!centers[tid]) continue;
      const key = [pid, tid].sort().join('--');
      if (drawn.has(key)) continue;
      drawn.add(key);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', centers[pid].x);
      line.setAttribute('y1', centers[pid].y);
      line.setAttribute('x2', centers[tid].x);
      line.setAttribute('y2', centers[tid].y);
      line.dataset.from = pid;
      line.dataset.to = tid;
      svg.appendChild(line);
    }
  }
}

function highlightConnections(planetId) {
  document.querySelectorAll('#galaxy-svg line').forEach(line => {
    if (!planetId) {
      line.classList.remove('highlighted', 'dimmed');
      return;
    }
    if (line.dataset.from === planetId || line.dataset.to === planetId) {
      line.classList.add('highlighted');
      line.classList.remove('dimmed');
    } else {
      line.classList.add('dimmed');
      line.classList.remove('highlighted');
    }
  });
}

// ── View Transitions ──
function showView(id, dir) {
  document.querySelectorAll('.view-layer').forEach(v => {
    if (v.classList.contains('active')) {
      v.classList.remove('active');
      v.classList.add(dir === 'in' ? 'zoom-out' : 'zoom-in');
      setTimeout(() => v.classList.remove('zoom-out', 'zoom-in'), 800);
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

// Direct jump to a view without animation (for search navigation)
function showViewDirect(id) {
  document.querySelectorAll('.view-layer').forEach(v => {
    v.classList.remove('active', 'zoom-out', 'zoom-in');
  });
  const t = document.getElementById(id);
  t.classList.add('active');
}

function updateBreadcrumb() {
  const bc = document.getElementById('breadcrumb');
  let h = '<span class="crumb' + (currentLevel === 'galaxy' ? ' active' : '') +
    '" onclick="navigateTo(\'galaxy\')">NPSP</span>';
  if (currentPlanet) {
    h += '<span class="crumb-sep">\u25B8</span><span class="crumb' +
      (currentLevel === 'planet' ? ' active' : '') +
      '" onclick="navigateTo(\'planet\')">' + NPSP[currentPlanet].name + '</span>';
  }
  if (currentComponent) {
    const c = NPSP[currentPlanet].components.find(x => x.id === currentComponent);
    if (c) {
      h += '<span class="crumb-sep">\u25B8</span><span class="crumb active">' + c.name + '</span>';
    }
  }
  bc.innerHTML = h;

  document.querySelectorAll('.zoom-dot').forEach((d, i) => {
    d.classList.toggle('active',
      (i === 0 && currentLevel === 'galaxy') ||
      (i === 1 && currentLevel === 'planet') ||
      (i === 2 && currentLevel === 'core')
    );
  });

  document.getElementById('backBtn').classList.toggle('visible', currentLevel !== 'galaxy');
}

function enterPlanet(id) {
  navHistory.push({ level: currentLevel, planet: currentPlanet, component: currentComponent });
  currentLevel = 'planet';
  currentPlanet = id;
  currentComponent = null;
  renderPlanetView(id);
  showView('planet-view', 'in');
  updateBreadcrumb();
}

function enterCore(pid, cid) {
  navHistory.push({ level: currentLevel, planet: currentPlanet, component: currentComponent });
  currentLevel = 'core';
  currentComponent = cid;
  renderCoreView(pid, cid);
  showView('core-view', 'in');
  updateBreadcrumb();
}

// Direct navigation to core (skips intermediate planet animation)
// Used by search to avoid the level-2/level-3 overlap bug
function navigateToCore(pid, cid) {
  navHistory.push({ level: currentLevel, planet: currentPlanet, component: currentComponent });
  currentLevel = 'core';
  currentPlanet = pid;
  currentComponent = cid;
  // Render planet view silently (for back-navigation context)
  renderPlanetView(pid);
  renderCoreView(pid, cid);
  showViewDirect('core-view');
  updateBreadcrumb();
}

function navigateTo(level) {
  if (level === currentLevel) return;
  if (level === 'galaxy') {
    currentLevel = 'galaxy';
    currentPlanet = null;
    currentComponent = null;
    showView('galaxy-view', 'out');
  } else if (level === 'planet') {
    currentLevel = 'planet';
    currentComponent = null;
    showView('planet-view', 'out');
  }
  updateBreadcrumb();
}

function goBack() {
  if (navHistory.length > 0) {
    const p = navHistory.pop();
    if (p.level === 'galaxy') {
      navigateTo('galaxy');
    } else if (p.level === 'planet') {
      currentPlanet = p.planet;
      navigateTo('planet');
    }
  } else {
    if (currentLevel === 'core') navigateTo('planet');
    else if (currentLevel === 'planet') navigateTo('galaxy');
  }
}

// ── Render Planet ──
function renderPlanetView(id) {
  const p = NPSP[id];
  const el = document.getElementById('planet-content');
  el.innerHTML = `<div class="planet-header"><div class="planet-header-orb" style="background:${p.color};box-shadow:0 0 20px ${p.color}">${p.icon}</div><div><h2 style="color:${p.color}">${p.name}</h2><p>${p.description}</p></div></div><div class="component-grid">${p.components.map(c => `<div class="component-card" data-component="${c.id}" style="--card-accent:${p.color}" onclick="enterCore('${id}','${c.id}')"><h3><span class="icon">${c.icon}</span> ${c.name}</h3><div class="card-desc">${c.desc}</div><div class="card-tags">${(c.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('')}${(c.triggerTags || []).map(t => `<span class="card-tag trigger">${t}</span>`).join('')}</div></div>`).join('')}</div><div class="data-flow"><h3>\u{1F500} Data Flow</h3><div class="flow-diagram">${p.dataFlow.map((n, i) => (i > 0 ? '<span class="flow-arrow">\u2192</span>' : '') + `<span class="flow-node">${n}</span>`).join('')}</div></div><div class="connections-section"><h3>\u{1F30C} Connected Systems</h3>${p.connections.map(c => `<div class="connection-item" onclick="enterPlanet('${c.planet}')"><div class="conn-planet" style="background:${PLANET_META[c.planet]?.color || '#64748b'}">${PLANET_META[c.planet]?.icon || '\u{2B50}'}</div><div><strong>${NPSP[c.planet]?.name || c.planet}</strong><div style="color:var(--text-dim);font-size:11px;margin-top:2px">${c.desc}</div></div></div>`).join('')}</div>`;
  document.getElementById('planet-view').scrollTop = 0;
}

// ── Render Core ──
function renderCoreView(pid, cid) {
  const p = NPSP[pid];
  const c = p.components.find(x => x.id === cid);
  if (!c) return;
  const el = document.getElementById('core-content');
  let h = `<div class="core-header"><span style="font-size:24px">${c.icon}</span><div><h2>${c.name}</h2><span class="badge">TRIGGER LEVEL</span></div></div><div class="trigger-section"><h3>\u{1F4CB} Overview</h3><div class="trigger-desc">${c.desc}</div><div class="card-tags">${(c.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('')}${(c.triggerTags || []).map(t => `<span class="card-tag trigger">${t}</span>`).join('')}</div></div>`;
  if (c.executionFlow) {
    h += `<div class="trigger-section"><h3>\u{26A1} Execution Flow</h3><div class="execution-flow">${c.executionFlow.map((s, i) => `<div class="exec-step"><span class="step-num">${i + 1}</span><span>${s}</span></div>`).join('')}</div></div>`;
  }
  if (c.code) {
    h += `<div class="trigger-section"><h3>\u{1F4BB} Source Code Pattern</h3><div class="code-block"><div class="code-header"><span class="lang">${c.code.lang}</span><span>${c.code.title}</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div><div class="code-body"><pre>${c.code.body}</pre></div></div></div>`;
  }
  h += `<div class="code-lab"><h3>\u{1F9EA} Code Lab: Explore Further</h3><div class="lab-desc">Related patterns for understanding this component deeper.</div><div class="lab-tabs"><button class="lab-tab active" onclick="switchTab(this,'pattern')">TDTM Pattern</button><button class="lab-tab" onclick="switchTab(this,'testing')">Test Pattern</button><button class="lab-tab" onclick="switchTab(this,'extension')">Extension Point</button></div><div id="lab-content"></div></div>`;
  el.innerHTML = h;
  switchTab(el.querySelector('.lab-tab.active'), 'pattern');
  document.getElementById('core-view').scrollTop = 0;
}

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
  tab.parentElement.querySelectorAll('.lab-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const p = labPatterns[type];
  document.getElementById('lab-content').innerHTML = `<div class="code-block"><div class="code-header"><span class="lang">Apex</span><span>${p.title}</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div><div class="code-body"><pre>${p.code}</pre></div></div>`;
}

function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  navigator.clipboard.writeText(pre.textContent).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 1500);
  });
}
