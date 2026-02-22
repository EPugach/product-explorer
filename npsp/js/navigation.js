// ══════════════════════════════════════════════════════════════
//  NAVIGATION — Views, breadcrumbs, state, staggered animations
//  NOTE: All innerHTML usage is safe — content comes from the
//  trusted NPSP data object (app-owned), not user input.
// ══════════════════════════════════════════════════════════════

import { NPSP } from './npsp-data.js';
import { track, announce } from './utils.js';
import { resetZoomPan, setGraphSettled, nodeMap } from './physics.js';
import { pauseStarfield, resumeStarfield } from './starfield.js';
import { domainSvg, entitySvg } from './icons.js?v=3';

// Normalize singular entity type slugs (from old URLs / search) to plural data keys
const ENTITY_TYPE_MAP = { class: 'classes', object: 'objects', trigger: 'triggers', lwc: 'lwcs' };
import { setFocusedPlanetIndex, entitiesLoaded } from './state.js';

const PLANET_META = {};
for (const [k, v] of Object.entries(NPSP)) {
  PLANET_META[k] = { icon: v.icon, color: v.color, svg: domainSvg(k, 20) };
}

export let currentLevel = 'galaxy';
export let currentPlanet = null;
export let currentComponent = null;
let currentEntity = null;
let currentEntityTab = null;
let navHistory = [];

// Animation tick callbacks — set by main.js to avoid circular imports
let _graphTick = null;
let _particleTick = null;
export const setAnimationCallbacks = (graphTickFn, particleTickFn) => {
  _graphTick = graphTickFn;
  _particleTick = particleTickFn;
};

// ── Hash Routing ──
export let hashUpdateInProgress = false;

export const setHash = (hash) => {
  hashUpdateInProgress = true;
  history.pushState(null, '', hash);
  hashUpdateInProgress = false;
};

export const updateDocumentTitle = (level, domainId, componentId, entityName) => {
  const base = 'NPSP Architecture Explorer';
  if (level === 'galaxy' || !domainId) { document.title = base; return; }
  const domain = NPSP[domainId];
  const domainName = domain ? domain.name : domainId;
  if (level === 'planet') { document.title = `${domainName} \u2014 ${base}`; return; }
  if (level === 'core' && componentId) {
    const comp = domain ? domain.components.find((c) => c.id === componentId) : null;
    const compName = comp ? comp.name : componentId;
    document.title = `${compName} \u2014 ${domainName} \u2014 NPSP Explorer`;
    return;
  }
  if (level === 'entity' && entityName) { document.title = `${entityName} \u2014 NPSP Explorer`; return; }
  document.title = base;
};

export const handleHashNavigation = () => {
  const hash = window.location.hash || '#/';
  const path = hash.replace(/^#\/?/, '');
  if (!path) {
    if (currentLevel !== 'galaxy') {
      navHistory = [];
      currentLevel = 'galaxy';
      currentPlanet = null;
      currentComponent = null;
      currentEntity = null;
      resetZoomPan();
      setGalaxyCanvasVisible(true);
      showViewDirect('galaxy-view');
      setGraphSettled(false);
      if (_graphTick) requestAnimationFrame(_graphTick);
      if (_particleTick) requestAnimationFrame(_particleTick);
      updateBreadcrumb();
      updateDocumentTitle('galaxy');
    }
    return;
  }
  const segments = path.split('/');
  if (segments.length === 1) {
    const domainId = segments[0];
    if (!NPSP[domainId]) { setHash('#/'); handleHashNavigation(); return; }
    navHistory = [];
    currentLevel = 'planet'; currentPlanet = domainId; currentComponent = null; currentEntity = null;
    renderPlanetView(domainId); setGalaxyCanvasVisible(false); showViewDirect('planet-view');
    updateBreadcrumb(); updateDocumentTitle('planet', domainId);
  } else if (segments.length === 2) {
    const [domainId, componentId] = segments;
    if (!NPSP[domainId]) { setHash('#/'); handleHashNavigation(); return; }
    const comp = NPSP[domainId].components.find((c) => c.id === componentId);
    if (!comp) { setHash(`#/${domainId}`); handleHashNavigation(); return; }
    navHistory = [{ level: 'galaxy', planet: null, component: null }];
    currentLevel = 'core'; currentPlanet = domainId; currentComponent = componentId; currentEntity = null;
    renderPlanetView(domainId); renderCoreView(domainId, componentId);
    setGalaxyCanvasVisible(false); showViewDirect('core-view');
    updateBreadcrumb(); updateDocumentTitle('core', domainId, componentId);
  } else if (segments.length >= 4) {
    const [domainId, componentId, rawEntityType, ...entityNameParts] = segments;
    const entityType = ENTITY_TYPE_MAP[rawEntityType] || rawEntityType;
    const entityName = decodeURIComponent(entityNameParts.join('/'));
    if (!NPSP[domainId]) { setHash('#/'); handleHashNavigation(); return; }
    const comp = NPSP[domainId].components.find((c) => c.id === componentId);
    if (!comp) { setHash(`#/${domainId}`); handleHashNavigation(); return; }
    navHistory = [
      { level: 'galaxy', planet: null, component: null },
      { level: 'planet', planet: domainId, component: null }
    ];
    currentLevel = 'entity'; currentPlanet = domainId; currentComponent = componentId;
    currentEntity = { type: entityType, name: entityName }; currentEntityTab = entityType;
    renderPlanetView(domainId); renderCoreView(domainId, componentId);
    renderEntityView(domainId, componentId, entityType, entityName);
    setGalaxyCanvasVisible(false); showViewDirect('entity-view');
    updateBreadcrumb(); updateDocumentTitle('entity', domainId, componentId, entityName);
  } else {
    setHash('#/'); handleHashNavigation();
  }
};

function getTransitionMs() {
  const val = getComputedStyle(document.documentElement).getPropertyValue('--transition-duration').trim();
  return parseInt(val) || 700;
}

function showView(id, dir) {
  document.querySelectorAll('.view-layer').forEach((v) => {
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
  document.querySelectorAll('.view-layer').forEach((v) => {
    v.classList.remove('active', 'zoom-out', 'zoom-in');
  });
  document.getElementById(id).classList.add('active');
}

export function setGalaxyCanvasVisible(visible) {
  const graph = document.getElementById('graph-canvas');
  const particle = document.getElementById('particle-canvas');
  if (visible) { graph.classList.remove('hidden'); particle.classList.remove('hidden'); }
  else { graph.classList.add('hidden'); particle.classList.add('hidden'); }
}

function updateBreadcrumb() {
  document.querySelectorAll('.zoom-dot').forEach((d, i) => {
    d.classList.toggle('active',
      (i === 0 && currentLevel === 'galaxy') || (i === 1 && currentLevel === 'planet') ||
      (i === 2 && currentLevel === 'core') || (i === 3 && currentLevel === 'entity'));
  });
  const stats = document.querySelector('.galaxy-stats');
  if (stats) stats.style.display = currentLevel === 'galaxy' ? 'flex' : 'none';
}

export function enterPlanet(id) {
  setFocusedPlanetIndex(-1);
  navHistory.push({ level: currentLevel, planet: currentPlanet, component: currentComponent });
  currentLevel = 'planet'; currentPlanet = id; currentComponent = null;
  renderPlanetView(id); setGalaxyCanvasVisible(false); showView('planet-view', 'in');
  updateBreadcrumb(); setHash(`#/${id}`); updateDocumentTitle('planet', id);
  pauseStarfield();
  const p = NPSP[id];
  if (p) announce(`Viewing ${p.name} domain, ${p.components.length} components`);
  setTimeout(() => {
    const heading = document.querySelector('#planet-content h2');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  }, getTransitionMs() + 50);
}

export function enterCore(pid, cid) {
  navHistory.push({ level: currentLevel, planet: currentPlanet, component: currentComponent });
  currentLevel = 'core'; currentComponent = cid;
  renderCoreView(pid, cid); showView('core-view', 'in'); updateBreadcrumb();
  setHash(`#/${pid}/${cid}`); updateDocumentTitle('core', pid, cid);
  const pData = NPSP[pid];
  const cData = pData ? pData.components.find((x) => x.id === cid) : null;
  if (cData) announce(`Viewing ${cData.name} in ${pData.name}`);
  setTimeout(() => {
    const heading = document.querySelector('#core-content h2');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  }, getTransitionMs() + 50);
}

export function enterEntity(pid, cid, entityType, entityName) {
  navHistory.push({ level: currentLevel, planet: currentPlanet, component: currentComponent, entity: currentEntity, entityTab: currentEntityTab });
  currentLevel = 'entity'; currentEntity = { type: entityType, name: entityName }; currentEntityTab = entityType;
  renderEntityView(pid, cid, entityType, entityName); showView('entity-view', 'in'); updateBreadcrumb();
  setHash(`#/${pid}/${cid}/${entityType}/${encodeURIComponent(entityName)}`);
  updateDocumentTitle('entity', pid, cid, entityName);
  track('entity_view', { type: entityType, name: entityName });
  announce(`Viewing ${entityType}: ${entityName}`);
  setTimeout(() => {
    const heading = document.querySelector('#entity-content h2');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  }, getTransitionMs() + 50);
}

export function navigateToCore(pid, cid) {
  navHistory.push({ level: currentLevel, planet: currentPlanet, component: currentComponent });
  currentLevel = 'core'; currentPlanet = pid; currentComponent = cid;
  renderPlanetView(pid); renderCoreView(pid, cid); setGalaxyCanvasVisible(false);
  showViewDirect('core-view'); updateBreadcrumb();
  setHash(`#/${pid}/${cid}`); updateDocumentTitle('core', pid, cid);
  pauseStarfield();
}

export function navigateTo(level) {
  if (level === currentLevel) return;
  if (level === 'galaxy') {
    currentLevel = 'galaxy'; currentPlanet = null; currentComponent = null;
    resetZoomPan(); setGalaxyCanvasVisible(true); showView('galaxy-view', 'out');
    setGraphSettled(false);
    if (_graphTick) requestAnimationFrame(_graphTick);
    if (_particleTick) requestAnimationFrame(_particleTick);
    setHash('#/'); updateDocumentTitle('galaxy');
    resumeStarfield(); announce('Returned to galaxy overview');
    setTimeout(() => { const canvas = document.getElementById('graph-canvas'); if (canvas) canvas.focus({ preventScroll: true }); }, getTransitionMs() + 50);
  } else if (level === 'planet') {
    currentLevel = 'planet'; currentComponent = null;
    showView('planet-view', 'out'); setHash(`#/${currentPlanet}`); updateDocumentTitle('planet', currentPlanet);
    const pName = currentPlanet && NPSP[currentPlanet] ? NPSP[currentPlanet].name : 'domain';
    announce(`Returned to ${pName} domain`);
    setTimeout(() => { const heading = document.querySelector('#planet-content h2'); if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); } }, getTransitionMs() + 50);
  } else if (level === 'core') {
    currentLevel = 'core'; currentEntity = null;
    showView('core-view', 'out'); setHash(`#/${currentPlanet}/${currentComponent}`);
    updateDocumentTitle('core', currentPlanet, currentComponent);
    announce('Returned to component view');
    setTimeout(() => { const heading = document.querySelector('#core-content h2'); if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); } }, getTransitionMs() + 50);
  }
  updateBreadcrumb();
}

export function goBack() {
  track('back_navigation', { from: currentLevel });
  if (navHistory.length > 0) {
    const prev = navHistory.pop();
    if (prev.level === 'galaxy') navigateTo('galaxy');
    else if (prev.level === 'planet') { currentPlanet = prev.planet; navigateTo('planet'); }
    else if (prev.level === 'core') {
      currentLevel = 'core'; currentPlanet = prev.planet; currentComponent = prev.component; currentEntity = null;
      showView('core-view', 'out'); updateBreadcrumb();
      setHash(`#/${prev.planet}/${prev.component}`); updateDocumentTitle('core', prev.planet, prev.component);
    }
  } else {
    if (currentLevel === 'entity') navigateTo('core');
    else if (currentLevel === 'core') navigateTo('planet');
    else if (currentLevel === 'planet') navigateTo('galaxy');
  }
}

// Refresh current view after entities load (called by main.js)
export function refreshCurrentView() {
  if (currentLevel === 'entity' && currentPlanet && currentComponent && currentEntity) {
    renderEntityView(currentPlanet, currentComponent, currentEntity.type, currentEntity.name);
  } else if (currentLevel === 'planet' && currentPlanet) {
    renderPlanetView(currentPlanet);
  } else if (currentLevel === 'core' && currentPlanet && currentComponent) {
    renderCoreView(currentPlanet, currentComponent);
  }
}

// Update breadcrumb zoom indicators (exported for init)
export { updateBreadcrumb };

// Render helpers use innerHTML with trusted app-owned data (NPSP object).
// No user input is rendered. This is safe and documented.

function renderPlanetView(id) {
  const p = NPSP[id]; const el = document.getElementById('planet-content');
  let domainStats = '';
  if (p._entities) {
    const dc = (p._entities.classes||[]).length, do_ = (p._entities.objects||[]).length;
    const dt = (p._entities.triggers||[]).length, dl = (p._entities.lwcs||[]).length;
    const parts = [];
    if (dc) parts.push(dc+' classes'); if (do_) parts.push(do_+' objects');
    if (dt) parts.push(dt+' triggers'); if (dl) parts.push(dl+' LWCs');
    if (parts.length > 0) domainStats = `<div class="domain-entity-stats">${p.components.length} groups \u00B7 ${parts.join(' \u00B7 ')}</div>`;
  }
  el.innerHTML = `<div class="bc"><span class="bc-link" data-nav="galaxy">NPSP</span><span class="bc-sep">\u276F</span><span class="bc-here">${p.name}</span></div><div class="planet-header"><div class="planet-header-orb" style="background:${p.color};box-shadow:0 0 20px ${p.color}"><span class="icon-svg">${domainSvg(id, 28)}</span></div><div><h2 style="color:${p.color}">${p.name}</h2><p>${p.description}</p></div></div>${domainStats}<div class="component-grid">${p.components.map((c,i) => { let eb=''; if(c.entities){const cn=[]; if(c.entities.classes&&c.entities.classes.length>0)cn.push(`<span class="entity-badge badge-class"><span class="icon-svg">${entitySvg('class',12)}</span> ${c.entities.classes.length}</span>`); if(c.entities.objects&&c.entities.objects.length>0)cn.push(`<span class="entity-badge badge-object"><span class="icon-svg">${entitySvg('object',12)}</span> ${c.entities.objects.length}</span>`); if(c.entities.triggers&&c.entities.triggers.length>0)cn.push(`<span class="entity-badge badge-trigger"><span class="icon-svg">${entitySvg('trigger',12)}</span> ${c.entities.triggers.length}</span>`); if(c.entities.lwcs&&c.entities.lwcs.length>0)cn.push(`<span class="entity-badge badge-lwc"><span class="icon-svg">${entitySvg('lwc',12)}</span> ${c.entities.lwcs.length}</span>`); if(cn.length>0)eb=`<div class="entity-badges">${cn.join('')}</div>`;} return `<div class="component-card" data-component="${c.id}" data-planet="${id}" style="--card-accent:${p.color};animation-delay:${i*30}ms" role="button" tabindex="0"><h3><span class="icon">${c.icon}</span> ${c.name}</h3><div class="card-desc">${c.desc}</div><div class="card-tags">${(c.tags||[]).map(t=>`<span class="card-tag">${t}</span>`).join('')}${(c.triggerTags||[]).map(t=>`<span class="card-tag trigger">${t}</span>`).join('')}</div>${eb}</div>`; }).join('')}</div><div class="data-flow" style="animation-delay:${p.components.length*30+60}ms"><h3>\u{1F500} Data Flow</h3><div class="flow-diagram">${p.dataFlow.map((n,i)=>(i>0?`<span class="flow-arrow">\u2192</span>`:'')+`<span class="flow-node">${n}</span>`).join('')}</div></div><div class="connections-section" style="animation-delay:${p.components.length*30+120}ms"><h3>\u{1F30C} Connected Systems</h3>${p.connections.map(c=>`<div class="connection-item" data-connection-planet="${c.planet}" role="button" tabindex="0"><div class="conn-planet" style="background:${PLANET_META[c.planet]?PLANET_META[c.planet].color:'#64748b'}"><span class="icon-svg">${PLANET_META[c.planet]?PLANET_META[c.planet].svg:''}</span></div><div><strong>${NPSP[c.planet]?NPSP[c.planet].name:c.planet}</strong><div style="color:var(--text-dim);font-size:var(--text-xs);margin-top:2px">${c.desc}</div></div></div>`).join('')}</div>`;
  el.querySelectorAll('[data-nav="galaxy"]').forEach(l=>{l.style.cursor='pointer';l.addEventListener('click',()=>navigateTo('galaxy'));});
  el.querySelectorAll('.component-card').forEach(card=>{const cid=card.dataset.component,pid2=card.dataset.planet;card.addEventListener('click',()=>enterCore(pid2,cid));card.addEventListener('keydown',e=>{if(e.key==='Enter')enterCore(pid2,cid);});});
  el.querySelectorAll('[data-connection-planet]').forEach(item=>{const planetId=item.dataset.connectionPlanet;item.addEventListener('click',()=>enterPlanet(planetId));item.addEventListener('keydown',e=>{if(e.key==='Enter')enterPlanet(planetId);});});
  document.getElementById('planet-view').scrollTop = 0;
}

function renderOverviewTab(c) {
  let h = `<div class="trigger-section" style="animation-delay:0ms"><h3>\u{1F4CB} Overview</h3><div class="trigger-desc">${c.desc}</div><div class="card-tags">${(c.tags||[]).map(t=>`<span class="card-tag">${t}</span>`).join('')}${(c.triggerTags||[]).map(t=>`<span class="card-tag trigger">${t}</span>`).join('')}</div></div>`;
  if (c.executionFlow) h += `<div class="trigger-section" style="animation-delay:60ms"><h3>\u26A1 Execution Flow</h3><div class="execution-flow">${c.executionFlow.map((s,i)=>`<div class="exec-step" style="animation-delay:${80+i*40}ms"><span class="step-num">${i+1}</span><span>${s}</span></div>`).join('')}</div></div>`;
  if (c.docs && c.docs.length > 0) {
    h += `<div class="trigger-section doc-section" style="animation-delay:90ms"><h3>\u{1F4DA} Documentation</h3>${c.docs.map(p=>`<p class="doc-para">${p}</p>`).join('')}`;
    if (c.docUrl) h += `<a class="doc-source-link" href="${c.docUrl}" target="_blank" rel="noopener noreferrer">\u{1F517} View on Salesforce Help \u2197</a>`;
    h += `</div>`;
  }
  if (c.code) h += `<div class="trigger-section" style="animation-delay:120ms"><h3>\u{1F4BB} Source Code Pattern</h3><div class="code-block"><div class="code-header"><span class="lang">${c.code.lang}</span><span>${c.code.title}</span><button class="copy-btn" data-copy-code aria-label="Copy code">Copy</button></div><div class="code-body"><pre>${c.code.body}</pre></div></div></div>`;
  h += `<div class="code-lab" style="animation-delay:180ms"><h3>\u{1F9EA} Code Lab: Explore Further</h3><div class="lab-desc">Related patterns for understanding this component deeper.</div><div class="lab-tabs"><button class="lab-tab active" data-lab-tab="pattern" aria-label="TDTM Pattern">TDTM Pattern</button><button class="lab-tab" data-lab-tab="testing" aria-label="Test Pattern">Test Pattern</button><button class="lab-tab" data-lab-tab="extension" aria-label="Extension Point">Extension Point</button></div><div id="lab-content"></div></div>`;
  return h;
}

function renderCoreView(pid, cid) {
  const p = NPSP[pid]; const c = p.components.find(x=>x.id===cid); if(!c)return;
  const el = document.getElementById('core-content');
  const tabs = [{key:'overview',label:'Overview',count:null}];
  if(c.entities){if(c.entities.classes&&c.entities.classes.length>0)tabs.push({key:'classes',label:'Classes',count:c.entities.classes.length});if(c.entities.objects&&c.entities.objects.length>0)tabs.push({key:'objects',label:'Objects',count:c.entities.objects.length});if(c.entities.triggers&&c.entities.triggers.length>0)tabs.push({key:'triggers',label:'Triggers',count:c.entities.triggers.length});if(c.entities.lwcs&&c.entities.lwcs.length>0)tabs.push({key:'lwcs',label:'LWCs',count:c.entities.lwcs.length});if(c.entities.metadata&&c.entities.metadata.length>0)tabs.push({key:'metadata',label:'Metadata',count:c.entities.metadata.length});}
  let tabBar = '';
  if(tabs.length>1) tabBar = `<div class="entity-tab-bar">${tabs.map(t=>`<button class="entity-tab${t.key==='overview'?' active':''}" data-tab="${t.key}" data-entity-tab-pid="${pid}" data-entity-tab-cid="${cid}">${t.label}${t.count!==null?` <span class="tab-count">${t.count}</span>`:''}</button>`).join('')}</div>`;
  else if(!entitiesLoaded) tabBar = `<div class="entity-loading-hint" style="padding:8px 0;font-size:12px;color:var(--text-dim,#64748b);opacity:0.7">Loading entity data\u2026</div>`;
  el.innerHTML = `<div class="bc"><span class="bc-link" data-nav="galaxy">NPSP</span><span class="bc-sep">\u276F</span><span class="bc-link" data-nav="planet">${p.name}</span><span class="bc-sep">\u276F</span><span class="bc-here">${c.name}</span></div><div class="core-header"><span style="font-size:24px">${c.icon}</span><div><h2>${c.name}</h2><span class="badge">TRIGGER LEVEL</span></div></div>${tabBar}<div id="entity-tab-content">${renderOverviewTab(c)}</div>`;
  el.querySelectorAll('[data-nav="galaxy"]').forEach(l=>{l.style.cursor='pointer';l.addEventListener('click',()=>navigateTo('galaxy'));});
  el.querySelectorAll('[data-nav="planet"]').forEach(l=>{l.style.cursor='pointer';l.addEventListener('click',()=>navigateTo('planet'));});
  el.querySelectorAll('.entity-tab').forEach(tab=>{tab.addEventListener('click',()=>switchEntityTab(tab.dataset.entityTabPid,tab.dataset.entityTabCid,tab.dataset.tab));});
  attachOverviewListeners(el);
  document.getElementById('core-view').scrollTop = 0;
}

function attachOverviewListeners(container) {
  container.querySelectorAll('[data-lab-tab]').forEach(tab=>{tab.addEventListener('click',()=>switchTab(tab,tab.dataset.labTab));});
  container.querySelectorAll('[data-copy-code]').forEach(btn=>{btn.addEventListener('click',()=>copyCode(btn));});
  const labTab = container.querySelector('.lab-tab.active');
  if (labTab && labTab.dataset.labTab) switchTab(labTab, labTab.dataset.labTab);
}

function switchEntityTab(pid, cid, tabKey) {
  track('tab_switch', { tab: tabKey });
  document.querySelectorAll('.entity-tab').forEach(t=>{t.classList.toggle('active',t.dataset.tab===tabKey);});
  const contentEl = document.getElementById('entity-tab-content');
  const p = NPSP[pid]; const c = p.components.find(x=>x.id===cid); if(!c)return;
  if (tabKey === 'overview') { contentEl.innerHTML = renderOverviewTab(c); attachOverviewListeners(contentEl); }
  else { contentEl.innerHTML = renderEntityGrid(c, tabKey, pid); attachEntityGridListeners(contentEl); }
  document.getElementById('core-view').scrollTop = 0;
}

function renderEntityGrid(component, entityType, pid) {
  const entities = (component.entities&&component.entities[entityType])||[];
  if(entities.length===0) return `<div class="trigger-section"><p style="color:var(--text-dim)">No ${entityType} found.</p></div>`;
  const typeConfig = {classes:{icon:entitySvg('class',14),color:'rgba(77,139,255,',badgeClass:'badge-class'},objects:{icon:entitySvg('object',14),color:'rgba(34,197,94,',badgeClass:'badge-object'},triggers:{icon:entitySvg('trigger',14),color:'rgba(239,68,68,',badgeClass:'badge-trigger'},lwcs:{icon:entitySvg('lwc',14),color:'rgba(168,85,247,',badgeClass:'badge-lwc'},metadata:{icon:entitySvg('metadata',14),color:'rgba(245,158,11,',badgeClass:'badge-metadata'}};
  const cfg = typeConfig[entityType]||typeConfig.classes;
  return `<div class="entity-grid">${entities.map((e,i)=>`<div class="entity-card" style="animation-delay:${i*30}ms" data-entity-pid="${pid}" data-entity-cid="${component.id}" data-entity-type="${entityType}" data-entity-name="${e.name.replace(/"/g,'&quot;')}" role="button" tabindex="0"><div class="entity-card-header"><span class="entity-type-icon ${cfg.badgeClass}">${cfg.icon}</span><span class="entity-name">${e.name}</span></div>${e.type?`<span class="entity-type-label">${e.type.replace('_',' ')}</span>`:''}<div class="entity-desc">${(e.description||'No description available.').substring(0,150)}${e.description&&e.description.length>150?'...':''}</div>${e.linesOfCode?`<span class="entity-loc">${e.linesOfCode} lines</span>`:''}${e.fieldCount?`<span class="entity-loc">${e.fieldCount} fields</span>`:''}</div>`).join('')}</div>`;
}

function attachEntityGridListeners(container) {
  container.querySelectorAll('.entity-card').forEach(card=>{
    const {entityPid:pid,entityCid:cid,entityType:type,entityName:name}=card.dataset;
    card.addEventListener('click',()=>enterEntity(pid,cid,type,name));
    card.addEventListener('keydown',e=>{if(e.key==='Enter')enterEntity(pid,cid,type,name);});
  });
}

function findEntityAcrossDomains(entityName, entityType) {
  for (const pid in NPSP) {
    const domain = NPSP[pid];
    for (let ci = 0; ci < domain.components.length; ci++) {
      const comp = domain.components[ci];
      if (comp.entities && comp.entities[entityType]) {
        const match = comp.entities[entityType].find(e=>e.name===entityName);
        if (match) return { pid, cid: comp.id, entity: match };
      }
    }
  }
  return null;
}

function renderEntityView(pid, cid, rawType, entityName) {
  const entityType = ENTITY_TYPE_MAP[rawType] || rawType;
  const p = NPSP[pid]; const c = p.components.find(x=>x.id===cid);
  if (!c||!c.entities) {
    // Entities not loaded yet: show loading indicator
    if (!entitiesLoaded) {
      const el = document.getElementById('entity-content');
      el.innerHTML = `<div class="bc"><span class="bc-link" data-nav="galaxy">NPSP</span><span class="bc-sep">\u276F</span><span class="bc-link" data-nav="planet">${p ? p.name : pid}</span><span class="bc-sep">\u276F</span><span class="bc-here">${entityName}</span></div><div class="entity-loading"><div class="entity-loading-spinner"></div><div class="entity-loading-text">Loading entity data\u2026</div></div>`;
      el.querySelectorAll('[data-nav="galaxy"]').forEach(l=>{l.style.cursor='pointer';l.addEventListener('click',()=>navigateTo('galaxy'));});
      el.querySelectorAll('[data-nav="planet"]').forEach(l=>{l.style.cursor='pointer';l.addEventListener('click',()=>navigateTo('planet'));});
    }
    return;
  }
  const entity = (c.entities[entityType]||[]).find(e=>e.name===entityName);
  if (!entity) {
    const el = document.getElementById('entity-content');
    el.innerHTML = `<div class="bc"><span class="bc-link" data-nav="galaxy">NPSP</span><span class="bc-sep">\u276F</span><span class="bc-link" data-nav="planet">${p.name}</span><span class="bc-sep">\u276F</span><span class="bc-link" data-nav="back">${c.name}</span><span class="bc-sep">\u276F</span><span class="bc-here">${entityName}</span></div><div class="entity-not-found"><div class="entity-not-found-icon">\u{1F50D}</div><div class="entity-not-found-text">${entityName} not found in ${entityType}</div><button class="entity-not-found-back" data-nav="back">\u2190 Back to ${c.name}</button></div>`;
    el.querySelectorAll('[data-nav="galaxy"]').forEach(l=>{l.style.cursor='pointer';l.addEventListener('click',()=>navigateTo('galaxy'));});
    el.querySelectorAll('[data-nav="planet"]').forEach(l=>{l.style.cursor='pointer';l.addEventListener('click',()=>navigateTo('planet'));});
    el.querySelectorAll('[data-nav="back"]').forEach(l=>{l.style.cursor='pointer';l.addEventListener('click',()=>goBack());});
    return;
  }
  const el = document.getElementById('entity-content');
  let h = `<div class="bc"><span class="bc-link" data-nav="galaxy">NPSP</span><span class="bc-sep">\u276F</span><span class="bc-link" data-nav="planet">${p.name}</span><span class="bc-sep">\u276F</span><span class="bc-link" data-nav="back">${c.name}</span><span class="bc-sep">\u276F</span><span class="bc-here">${entity.name}</span></div>`;
  if (entityType==='classes') h+=renderClassDetail(entity);
  else if (entityType==='objects') h+=renderObjectDetail(entity);
  else if (entityType==='triggers') h+=renderTriggerDetail(entity);
  else if (entityType==='lwcs') h+=renderLwcDetail(entity);
  else if (entityType==='metadata') h+=renderMetadataDetail(entity);
  el.innerHTML = h;
  el.querySelectorAll('[data-nav="galaxy"]').forEach(l=>{l.style.cursor='pointer';l.addEventListener('click',()=>navigateTo('galaxy'));});
  el.querySelectorAll('[data-nav="planet"]').forEach(l=>{l.style.cursor='pointer';l.addEventListener('click',()=>navigateTo('planet'));});
  el.querySelectorAll('[data-nav="back"]').forEach(l=>{l.style.cursor='pointer';l.addEventListener('click',()=>goBack());});
  el.querySelectorAll('[data-entity-link]').forEach(l=>{const d=JSON.parse(l.dataset.entityLink);l.addEventListener('click',()=>enterEntity(d.pid,d.cid,d.type,d.name));});
  document.getElementById('entity-view').scrollTop = 0;
}

function renderClassDetail(entity) {
  const typeColors = {tdtm_handler:{bg:'rgba(239,68,68,0.1)',color:'#ef4444',label:'TDTM Handler'},batch:{bg:'rgba(168,85,247,0.1)',color:'#a855f7',label:'Batch Job'},service:{bg:'rgba(34,197,94,0.1)',color:'#22c55e',label:'Service'},utility:{bg:'rgba(245,158,11,0.1)',color:'#f59e0b',label:'Utility'},controller:{bg:'rgba(6,182,212,0.1)',color:'#06b6d4',label:'Controller'},scheduled:{bg:'rgba(124,58,237,0.1)',color:'#7c3aed',label:'Scheduled'},'class':{bg:'rgba(77,139,255,0.1)',color:'#4d8bff',label:'Class'}};
  const tc = typeColors[entity.type]||typeColors['class'];
  let h = `<div class="entity-detail-header"><div class="entity-detail-icon badge-class"><span class="icon-svg">${entitySvg('class',18)}</span></div><div><h2 class="entity-detail-name">${entity.name}</h2><span class="entity-detail-type" style="background:${tc.bg};color:${tc.color}">${tc.label}</span>${entity.linesOfCode?`<span class="entity-detail-meta">${entity.linesOfCode} lines of code</span>`:''}</div></div>`;
  h += `<div class="entity-detail-section"><h3>Description</h3><p>${entity.description||'No description available.'}</p></div>`;
  if (entity.type==='tdtm_handler'&&entity.object) h += `<div class="entity-detail-section"><h3>\u26A1 Trigger Context</h3><div class="entity-detail-table"><div class="edt-row"><span class="edt-label">Object:</span><span>${entity.object}</span></div>${entity.triggerActions?`<div class="edt-row"><span class="edt-label">Events:</span><span>${entity.triggerActions.map(a=>`<span class="card-tag trigger">${a}</span>`).join(' ')}</span></div>`:''}${entity.loadOrder?`<div class="edt-row"><span class="edt-label">Load Order:</span><span>${entity.loadOrder}</span></div>`:''}</div></div>`;
  if (entity.extends) h += `<div class="entity-detail-section"><h3>Inheritance</h3><div class="entity-detail-table"><div class="edt-row"><span class="edt-label">Extends:</span><span class="entity-detail-code">${entity.extends}</span></div>${entity.implements?`<div class="edt-row"><span class="edt-label">Implements:</span><span class="entity-detail-code">${entity.implements}</span></div>`:''}</div></div>`;
  if (entity.keyMethods&&entity.keyMethods.length>0) h += `<div class="entity-detail-section"><h3>Key Methods</h3><div class="entity-methods">${entity.keyMethods.map(m=>`<span class="entity-method">${m}</span>`).join('')}</div></div>`;
  if (entity.referencedObjects&&entity.referencedObjects.length>0) h += `<div class="entity-detail-section"><h3>\u{1F517} Referenced Objects</h3><div class="entity-refs">${entity.referencedObjects.map(refName=>{const found=findEntityAcrossDomains(refName,'objects');if(found)return `<span class="entity-ref badge-object entity-link" data-entity-link='${JSON.stringify({pid:found.pid,cid:found.cid,type:'objects',name:refName})}' role="button" tabindex="0">${refName} \u2197</span>`;return `<span class="entity-ref badge-object">${refName}</span>`;}).join('')}</div></div>`;
  if (entity.sourceUrl) h += `<div class="entity-detail-section"><a class="entity-source-link" href="${entity.sourceUrl}" target="_blank" rel="noopener noreferrer">\u{1F4C4} View Source on GitHub \u2197</a></div>`;
  return h;
}

function renderObjectDetail(entity) {
  let h = `<div class="entity-detail-header"><div class="entity-detail-icon badge-object"><span class="icon-svg">${entitySvg('object',18)}</span></div><div><h2 class="entity-detail-name">${entity.label||entity.name}</h2><span class="entity-detail-meta" style="display:block;margin-top:2px">${entity.name}</span><span class="entity-detail-meta">${entity.fieldCount||0} fields</span></div></div>`;
  h += `<div class="entity-detail-section"><h3>Description</h3><p>${entity.description||'Custom object in the NPSP managed package.'}</p></div>`;
  if (entity.relationships&&entity.relationships.length>0) h += `<div class="entity-detail-section"><h3>\u{1F517} Relationships</h3><div class="entity-detail-table">${entity.relationships.map(r=>`<div class="edt-row"><span class="edt-label">${r.type}:</span><span><span class="entity-detail-code">${r.field}</span> \u2192 ${r.target}</span></div>`).join('')}</div></div>`;
  if (entity.keyFields&&entity.keyFields.length>0) h += `<div class="entity-detail-section"><h3>Fields (${entity.keyFields.length}${entity.keyFields.length>=15?'+':''})</h3><div class="entity-fields-table"><div class="eft-header"><span>Field</span><span>Type</span><span>Description</span></div>${entity.keyFields.map(f=>`<div class="eft-row"><span class="entity-detail-code">${f.name}</span><span class="eft-type">${f.type}</span><span class="eft-desc">${f.desc||f.label||''}</span></div>`).join('')}</div></div>`;
  if (entity.sourceUrl) h += `<div class="entity-detail-section"><a class="entity-source-link" href="${entity.sourceUrl}" target="_blank" rel="noopener noreferrer">\u{1F4C4} View on GitHub \u2197</a></div>`;
  return h;
}

function renderTriggerDetail(entity) {
  let h = `<div class="entity-detail-header"><div class="entity-detail-icon badge-trigger"><span class="icon-svg">${entitySvg('trigger',18)}</span></div><div><h2 class="entity-detail-name">${entity.name}</h2><span class="entity-detail-meta">Trigger on ${entity.object}</span></div></div>`;
  h += `<div class="entity-detail-section"><h3>Description</h3><p>TDTM trigger for the ${entity.object} object. All NPSP triggers follow the one-trigger-per-object pattern, dispatching to registered handler classes via the TDTM framework.</p></div>`;
  if (entity.events&&entity.events.length>0) h += `<div class="entity-detail-section"><h3>\u26A1 Registered Events</h3><div class="entity-methods">${entity.events.map(e=>`<span class="card-tag trigger">${e}</span>`).join('')}</div></div>`;
  if (entity.handlers&&entity.handlers.length>0) h += `<div class="entity-detail-section"><h3>\u{1F517} Handler Chain</h3><p style="margin-bottom:8px;font-size:var(--text-xs);color:var(--text-dim)">Handlers execute in Load_Order__c sequence:</p><div class="trigger-handler-chain">${entity.handlers.map((handler,i)=>{const found=findEntityAcrossDomains(handler,'classes');const hh=found?`<span class="entity-detail-code entity-link" data-entity-link='${JSON.stringify({pid:found.pid,cid:found.cid,type:'classes',name:handler})}' role="button" tabindex="0">${handler} \u2197</span>`:`<span class="entity-detail-code">${handler}</span>`;return `<div class="handler-chain-item"><span class="handler-order">${i+1}</span>${hh}</div>`;}).join('')}</div></div>`;
  if (entity.sourceUrl) h += `<div class="entity-detail-section"><a class="entity-source-link" href="${entity.sourceUrl}" target="_blank" rel="noopener noreferrer">\u{1F4C4} View Source on GitHub \u2197</a></div>`;
  return h;
}

function renderLwcDetail(entity) {
  let h = `<div class="entity-detail-header"><div class="entity-detail-icon badge-lwc"><span class="icon-svg">${entitySvg('lwc',18)}</span></div><div><h2 class="entity-detail-name">${entity.name}</h2><span class="entity-detail-type" style="background:rgba(168,85,247,0.1);color:#a855f7">Lightning Web Component</span></div></div>`;
  h += `<div class="entity-detail-section"><h3>Description</h3><p>${entity.description||'Lightning Web Component in the NPSP managed package.'}</p></div>`;
  if (entity.imports&&entity.imports.length>0) h += `<div class="entity-detail-section"><h3>Imports</h3><div class="entity-methods">${entity.imports.map(imp=>`<span class="entity-method">${imp}</span>`).join('')}</div></div>`;
  if (entity.sourceUrl) h += `<div class="entity-detail-section"><a class="entity-source-link" href="${entity.sourceUrl}" target="_blank" rel="noopener noreferrer">\u{1F4C4} View on GitHub \u2197</a></div>`;
  return h;
}

function renderMetadataDetail(entity) {
  let h = `<div class="entity-detail-header"><div class="entity-detail-icon badge-metadata"><span class="icon-svg">${entitySvg('metadata',18)}</span></div><div><h2 class="entity-detail-name">${entity.name}</h2><span class="entity-detail-type" style="background:rgba(245,158,11,0.1);color:#f59e0b">Custom Metadata Type</span>${entity.recordCount?`<span class="entity-detail-meta">${entity.recordCount} records</span>`:''}</div></div>`;
  h += `<div class="entity-detail-section"><h3>Description</h3><p>${entity.description||'Custom Metadata Type used for NPSP configuration.'}</p></div>`;
  return h;
}

const labPatterns = {
  pattern:{title:'TDTM Handler Pattern',code:'<span class="cm">// Create a custom TDTM handler</span>\n<span class="kw">public class</span> <span class="ty">MyCustomHandler</span>\n  <span class="kw">extends</span> <span class="ty">TDTM_Runnable</span> {\n\n  <span class="kw">public override</span> <span class="ty">DmlWrapper</span> <span class="fn">run</span>(\n    <span class="ty">List&lt;SObject&gt;</span> newList,\n    <span class="ty">List&lt;SObject&gt;</span> oldList,\n    <span class="ty">TDTM_Runnable.Action</span> triggerAction,\n    <span class="ty">Schema.DescribeSObjectResult</span> objResult\n  ) {\n    <span class="kw">if</span> (triggerAction == <span class="ty">Action</span>.AfterInsert) {\n      <span class="kw">for</span> (<span class="ty">SObject</span> record : newList) {\n        <span class="cm">// Custom logic here</span>\n      }\n    }\n    <span class="kw">return null</span>;\n  }\n}\n\n<span class="cm">// Or extend TDTM_RunnableMutable for</span>\n<span class="cm">// handlers that need to mutate records</span>'},
  testing:{title:'Test Pattern for TDTM Handlers',code:'<span class="an">@isTest</span>\n<span class="kw">private class</span> <span class="ty">MyHandler_TEST</span> {\n\n  <span class="an">@testSetup</span>\n  <span class="kw">static void</span> <span class="fn">setup</span>() {\n    <span class="ty">UTIL_UnitTestData_TEST</span>\n      .<span class="fn">createDefaultSettings</span>();\n  }\n\n  <span class="an">@isTest</span>\n  <span class="kw">static void</span> <span class="fn">testHandler</span>() {\n    <span class="ty">Contact</span> c = <span class="ty">UTIL_UnitTestData_TEST</span>\n      .<span class="fn">createTestContact</span>();\n\n    <span class="ty">Test</span>.startTest();\n    <span class="ty">Opportunity</span> opp = <span class="kw">new</span> <span class="ty">Opportunity</span>(\n      ContactId = c.Id,\n      Amount = <span class="nu">100</span>,\n      CloseDate = <span class="ty">Date</span>.today(),\n      StageName = <span class="st">\\\'Closed Won\\\'</span>,\n      Name = <span class="st">\\\'Test\\\'</span>\n    );\n    <span class="kw">insert</span> opp;\n    <span class="ty">Test</span>.stopTest();\n\n    opp = [<span class="kw">SELECT</span> Name <span class="kw">FROM</span> <span class="ty">Opportunity</span>\n           <span class="kw">WHERE</span> Id = :opp.Id];\n    <span class="ty">System</span>.assertNotEquals(\n      <span class="st">\\\'Test\\\'</span>, opp.Name);\n  }\n}'},
  extension:{title:'Extension Point: Custom Logic',code:'<span class="cm">// Extend NPSP without modifying its code</span>\n\n<span class="cm">// Option 1: Custom TDTM handler (recommended)</span>\n<span class="ty">npsp__Trigger_Handler__c</span> handler =\n  <span class="kw">new</span> <span class="ty">npsp__Trigger_Handler__c</span>(\n    npsp__Class__c = <span class="st">\\\'MyCustomHandler\\\'</span>,\n    npsp__Object__c = <span class="st">\\\'Opportunity\\\'</span>,\n    npsp__Trigger_Action__c =\n      <span class="st">\\\'AfterInsert;AfterUpdate\\\'</span>,\n    npsp__Load_Order__c = <span class="nu">99</span>,\n    npsp__Active__c = <span class="kw">true</span>,\n    npsp__User_Managed__c = <span class="kw">true</span>\n      <span class="cm">// Prevents NPSP from overwriting</span>\n  );\n<span class="kw">insert</span> handler;\n\n<span class="cm">// Option 2: Flow / Process Builder</span>\n<span class="cm">// Runs after all TDTM handlers</span>\n\n<span class="cm">// Option 3: Custom Rollup (CMDT)</span>\n<span class="cm">// Via NPSP Settings UI, no code</span>'}
};

function switchTab(tab, type) {
  tab.parentElement.querySelectorAll('.lab-tab').forEach(t=>{t.classList.remove('active');});
  tab.classList.add('active');
  const p = labPatterns[type];
  const labContent = document.getElementById('lab-content');
  labContent.innerHTML = `<div class="code-block"><div class="code-header"><span class="lang">Apex</span><span>${p.title}</span><button class="copy-btn" data-copy-code aria-label="Copy code">Copy</button></div><div class="code-body"><pre>${p.code}</pre></div></div>`;
  labContent.querySelectorAll('[data-copy-code]').forEach(btn=>{btn.addEventListener('click',()=>copyCode(btn));});
}

function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  const text = pre.textContent;
  const onSuccess = () => { btn.textContent = '\u2713 Copied'; btn.classList.add('copied'); setTimeout(()=>{btn.textContent='Copy';btn.classList.remove('copied');},1500); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(()=>{try{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);onSuccess();}catch(e){}});
  } else {
    try{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);onSuccess();}catch(e){}
  }
}
