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
let navHistory = [];

// Transition duration matches CSS --duration-normal
const TRANSITION_MS = 400;

// ── View Transitions ──
function showView(id, dir) {
  document.querySelectorAll('.view-layer').forEach(v => {
    if (v.classList.contains('active')) {
      v.classList.remove('active');
      v.classList.add(dir === 'in' ? 'zoom-out' : 'zoom-in');
      setTimeout(() => v.classList.remove('zoom-out', 'zoom-in'), TRANSITION_MS);
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
  const bc = document.getElementById('breadcrumb');
  let h = '<span class="crumb' + (currentLevel === 'galaxy' ? ' active' : '') +
    '" onclick="navigateTo(\'galaxy\')" role="link" tabindex="0">NPSP</span>';
  if (currentPlanet) {
    h += '<span class="crumb-sep" aria-hidden="true">\u25B8</span><span class="crumb' +
      (currentLevel === 'planet' ? ' active' : '') +
      '" onclick="navigateTo(\'planet\')" role="link" tabindex="0">' + NPSP[currentPlanet].name + '</span>';
  }
  if (currentComponent) {
    const c = NPSP[currentPlanet].components.find(x => x.id === currentComponent);
    if (c) {
      h += '<span class="crumb-sep" aria-hidden="true">\u25B8</span><span class="crumb active">' + c.name + '</span>';
    }
  }
  bc.innerHTML = h;

  // Zoom dots
  document.querySelectorAll('.zoom-dot').forEach((d, i) => {
    d.classList.toggle('active',
      (i === 0 && currentLevel === 'galaxy') ||
      (i === 1 && currentLevel === 'planet') ||
      (i === 2 && currentLevel === 'core')
    );
  });

  // Back button
  document.getElementById('backBtn').classList.toggle('visible', currentLevel !== 'galaxy');

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
}

function enterCore(pid, cid) {
  navHistory.push({ level: currentLevel, planet: currentPlanet, component: currentComponent });
  currentLevel = 'core';
  currentComponent = cid;
  renderCoreView(pid, cid);
  showView('core-view', 'in');
  updateBreadcrumb();
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
}

function navigateTo(level) {
  if (level === currentLevel) return;
  if (level === 'galaxy') {
    currentLevel = 'galaxy';
    currentPlanet = null;
    currentComponent = null;
    setGalaxyCanvasVisible(true);
    showView('galaxy-view', 'out');
    // Restart graph + particle animation
    if (typeof graphSettled !== 'undefined') {
      graphSettled = false;
      requestAnimationFrame(graphTick);
      requestAnimationFrame(particleTick);
    }
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

// ── Render Planet View ──
function renderPlanetView(id) {
  const p = NPSP[id];
  const el = document.getElementById('planet-content');
  el.innerHTML = '<div class="planet-header">' +
    '<div class="planet-header-orb" style="background:' + p.color + ';box-shadow:0 0 20px ' + p.color + '">' + p.icon + '</div>' +
    '<div><h2 style="color:' + p.color + '">' + p.name + '</h2><p>' + p.description + '</p></div></div>' +
    '<div class="component-grid">' +
    p.components.map(function(c, i) {
      return '<div class="component-card" data-component="' + c.id + '" style="--card-accent:' + p.color + ';animation-delay:' + (i * 30) + 'ms" ' +
        'onclick="enterCore(\'' + id + '\',\'' + c.id + '\')" role="button" tabindex="0" ' +
        'onkeydown="if(event.key===\'Enter\')enterCore(\'' + id + '\',\'' + c.id + '\')">' +
        '<h3><span class="icon">' + c.icon + '</span> ' + c.name + '</h3>' +
        '<div class="card-desc">' + c.desc + '</div>' +
        '<div class="card-tags">' +
        (c.tags || []).map(function(t) { return '<span class="card-tag">' + t + '</span>'; }).join('') +
        (c.triggerTags || []).map(function(t) { return '<span class="card-tag trigger">' + t + '</span>'; }).join('') +
        '</div></div>';
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

// ── Render Core View ──
function renderCoreView(pid, cid) {
  const p = NPSP[pid];
  const c = p.components.find(function(x) { return x.id === cid; });
  if (!c) return;
  const el = document.getElementById('core-content');
  let h = '<div class="core-header">' +
    '<span style="font-size:24px">' + c.icon + '</span>' +
    '<div><h2>' + c.name + '</h2><span class="badge">TRIGGER LEVEL</span></div></div>' +
    '<div class="trigger-section" style="animation-delay:0ms">' +
    '<h3>\u{1F4CB} Overview</h3>' +
    '<div class="trigger-desc">' + c.desc + '</div>' +
    '<div class="card-tags">' +
    (c.tags || []).map(function(t) { return '<span class="card-tag">' + t + '</span>'; }).join('') +
    (c.triggerTags || []).map(function(t) { return '<span class="card-tag trigger">' + t + '</span>'; }).join('') +
    '</div></div>';

  if (c.executionFlow) {
    h += '<div class="trigger-section" style="animation-delay:60ms">' +
      '<h3>\u{26A1} Execution Flow</h3>' +
      '<div class="execution-flow">' +
      c.executionFlow.map(function(s, i) {
        return '<div class="exec-step" style="animation-delay:' + (80 + i * 40) + 'ms">' +
          '<span class="step-num">' + (i + 1) + '</span><span>' + s + '</span></div>';
      }).join('') +
      '</div></div>';
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

  el.innerHTML = h;
  switchTab(el.querySelector('.lab-tab.active'), 'pattern');
  document.getElementById('core-view').scrollTop = 0;
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
  var pre = btn.closest('.code-block').querySelector('pre');
  navigator.clipboard.writeText(pre.textContent).then(function() {
    btn.textContent = '\u2713 Copied';
    btn.classList.add('copied');
    setTimeout(function() {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1500);
  });
}
