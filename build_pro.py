#!/usr/bin/env python3
"""
Build the professional NPSP Architecture Explorer from the scaffold + NPSP data.

Usage:
  python build_pro.py              # Builds npsp-professional.html + galaxy-v2 data
  python build_pro.py --check      # Verify all output files have required components

This script:
1. Reads the NPSP data object from index.html (the galaxy version)
2. Reads the labPatterns code lab data from index.html
3. Injects both into the npsp-professional.html scaffold along with the
   force-directed graph engine, theme toggle, navigation, and search code
4. Writes the NPSP data + labPatterns to galaxy-v2/js/npsp-data.js

Re-run this script after modifying the NPSP data in index.html to sync
all versions with the latest data.
"""
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
INDEX = os.path.join(BASE, 'index.html')
PRO = os.path.join(BASE, 'npsp-professional.html')
V2_DATA = os.path.join(BASE, 'galaxy-v2', 'js', 'npsp-data.js')

def extract_npsp_data(lines):
    """Extract the NPSP data object from index.html lines."""
    start = None
    for i, line in enumerate(lines):
        if 'const NPSP' in line and '=' in line and '{' in line:
            start = i
            break
    if start is None:
        raise ValueError("Could not find 'const NPSP = {' in index.html")

    # Find the closing '};' by tracking brace depth
    depth = 0
    end = start
    for i in range(start, len(lines)):
        for ch in lines[i]:
            if ch == '{': depth += 1
            elif ch == '}': depth -= 1
        if depth == 0:
            end = i + 1
            break

    return ''.join(lines[start:end])

def extract_lab_patterns(lines):
    """Extract the labPatterns object from index.html."""
    for line in lines:
        if 'labPatterns' in line and '={' in line.replace(' ', ''):
            return line
    return "const labPatterns={};\n"

def build():
    # Read index.html
    with open(INDEX, 'r', encoding='utf-8') as f:
        idx_lines = f.readlines()

    npsp_data = extract_npsp_data(idx_lines)
    lab_patterns = extract_lab_patterns(idx_lines)

    # Read scaffold
    with open(PRO, 'r', encoding='utf-8') as f:
        scaffold = f.read()

    # Build the JS code
    js = npsp_data + "\n" + JS_ENGINE + "\n" + lab_patterns + "\n" + JS_TAIL

    # Replace the script section
    script_start = scaffold.find("<script>")
    script_end = scaffold.find("</script>", script_start)
    if script_start == -1 or script_end == -1:
        raise ValueError("Could not find <script>...</script> in scaffold")

    result = scaffold[:script_start] + "<script>\n" + js + "\n</script>" + scaffold[script_end + len("</script>"):]

    with open(PRO, 'w', encoding='utf-8') as f:
        f.write(result)

    print(f"Built {PRO} ({len(result):,} chars)")

    # Sync galaxy-v2 data file
    v2_dir = os.path.dirname(V2_DATA)
    if os.path.isdir(v2_dir):
        v2_content = (
            '// NPSP Knowledge Base - 16 Feature Domains, 843 classes\n'
            '// This file is auto-generated. Edit the NPSP object in index.html\n'
            '// then run: python build_pro.py to sync all versions.\n\n'
            + npsp_data + '\n\n'
            'const PLANET_META = {};\n'
            'for (const [k,v] of Object.entries(NPSP)) { PLANET_META[k] = {icon:v.icon, color:v.color}; }\n\n'
            + lab_patterns + '\n'
        )
        with open(V2_DATA, 'w', encoding='utf-8') as f:
            f.write(v2_content)
        print(f"Built {V2_DATA} ({len(v2_content):,} chars)")

    return result

def check(content=None):
    if content is None:
        with open(PRO, 'r', encoding='utf-8') as f:
            content = f.read()

    checks = [
        'const NPSP', 'initGraph', 'simulate', 'render()', 'toggleTheme',
        'calcRadius', 'enterDomain', 'renderDomainView', 'renderCoreView',
        'searchNPSP', 'labPatterns', 'data-theme', '--sf-blue', '--sf-indigo',
        'Salesforce Sans', 'CODEBASE_WEIGHT', 'setupCanvasEvents'
    ]
    ok = True
    for c in checks:
        found = c in content
        status = "OK" if found else "MISSING"
        if not found:
            ok = False
        print(f"  {c}: {status}")
    print(f"\n{'All checks passed' if ok else 'Some checks FAILED'}")
    return ok


# === JS ENGINE CODE (everything between NPSP data and labPatterns) ===
JS_ENGINE = r"""
const PLANET_META = {};
for (const [k,v] of Object.entries(NPSP)) { PLANET_META[k] = {icon:v.icon, color:v.color}; }

// == THEME ==
const cachedColors = {};
function readCSSColors() {
  const s = getComputedStyle(document.documentElement);
  cachedColors.bg = s.getPropertyValue('--graph-bg').trim();
  cachedColors.text = s.getPropertyValue('--text-primary').trim();
  cachedColors.textSec = s.getPropertyValue('--text-secondary').trim();
  cachedColors.textDim = s.getPropertyValue('--text-dim').trim();
  cachedColors.accent = s.getPropertyValue('--accent').trim();
  cachedColors.conn = s.getPropertyValue('--connection-color').trim();
  cachedColors.border = s.getPropertyValue('--border-color').trim();
  cachedColors.panel = s.getPropertyValue('--bg-panel').trim();
}
function initTheme() {
  const saved = localStorage.getItem('npsp-pro-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(); readCSSColors();
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('npsp-pro-theme', next);
  updateThemeIcon(); readCSSColors();
}
function updateThemeIcon() {
  const theme = document.documentElement.getAttribute('data-theme');
  document.getElementById('themeToggle').textContent = theme === 'light' ? '\u{1F319}' : '\u{2600}';
}
function toggleLegend() { document.getElementById('legend-panel').classList.toggle('open'); }

// == NODE SIZING ==
const CODEBASE_WEIGHT = {
  recurring:89,rollups:76,bdi:66,settings:64,donations:50,batch:45,contacts:39,
  allocations:28,errors:22,addresses:20,giftentry:19,elevate:14,engagement:12,
  softcredits:8,relationships:6,levels:6,tdtm:15,affiliations:4
};
const FOUNDATIONAL = {tdtm:2.5,settings:1.3,errors:1.2};
function calcRadius(key) {
  const d=NPSP[key],cw=CODEBASE_WEIGHT[key]||5,compW=d.components.length*10,connW=d.connections.length*3,mult=FOUNDATIONAL[key]||1.0;
  const raw=(cw+compW+connW)*mult;
  const scores=Object.keys(NPSP).map(k=>{const dd=NPSP[k];return((CODEBASE_WEIGHT[k]||5)+dd.components.length*10+dd.connections.length*3)*(FOUNDATIONAL[k]||1.0);});
  const mn=Math.min(...scores),mx=Math.max(...scores);
  return 28+((raw-mn)/(mx-mn))*24;
}

// == FORCE GRAPH ==
let nodes=[],edges=[],nodeMap={};
let canvas,ctx,canvasW,canvasH;
let zoom=1,panX=0,panY=0;
let dragNode=null,hoveredNode=null;
let isDragging=false,isPanning=false;
let lastMouse={x:0,y:0};
let alpha=1.0,graphSettled=false;

function initGraph() {
  canvas=document.getElementById('graph-canvas');
  ctx=canvas.getContext('2d');
  resizeCanvas();
  const keys=Object.keys(NPSP);
  const cx=canvasW/2,cy=canvasH/2;
  nodes=keys.map((key,i)=>{
    const angle=(i/keys.length)*Math.PI*2;
    const spread=Math.min(canvasW,canvasH)*0.3;
    return {id:key,label:NPSP[key].name,icon:NPSP[key].icon,color:NPSP[key].color,radius:calcRadius(key),
      x:cx+Math.cos(angle)*spread+(Math.random()-0.5)*60,
      y:cy+Math.sin(angle)*spread+(Math.random()-0.5)*60,
      vx:0,vy:0,fx:null,fy:null};
  });
  nodeMap={};nodes.forEach(n=>nodeMap[n.id]=n);
  const edgeSet=new Set();
  for(const n of nodes){for(const conn of NPSP[n.id].connections){
    const key=[n.id,conn.planet].sort().join('--');
    if(!edgeSet.has(key)&&nodeMap[conn.planet]){edgeSet.add(key);edges.push({source:n.id,target:conn.planet,label:conn.desc});}
  }}
  alpha=1.0;graphSettled=false;requestAnimationFrame(tick);
}
function resizeCanvas(){
  const rect=canvas.parentElement.getBoundingClientRect();
  canvas.width=rect.width*devicePixelRatio;canvas.height=rect.height*devicePixelRatio;
  canvas.style.width=rect.width+'px';canvas.style.height=rect.height+'px';
  ctx.scale(devicePixelRatio,devicePixelRatio);
  canvasW=rect.width;canvasH=rect.height;
}
function simulate(){
  if(alpha<0.001){graphSettled=true;return;}
  alpha*=0.99;
  for(let i=0;i<nodes.length;i++){for(let j=i+1;j<nodes.length;j++){
    const a=nodes[i],b=nodes[j];let dx=b.x-a.x,dy=b.y-a.y;
    const dist=Math.sqrt(dx*dx+dy*dy)||1;const minDist=a.radius+b.radius+80;
    const force=(minDist*minDist)/(dist*dist)*1.5*alpha;
    const fx=(dx/dist)*force,fy=(dy/dist)*force;
    a.vx-=fx;a.vy-=fy;b.vx+=fx;b.vy+=fy;
  }}
  for(const e of edges){
    const s=nodeMap[e.source],t=nodeMap[e.target];if(!s||!t)continue;
    let dx=t.x-s.x,dy=t.y-s.y;const dist=Math.sqrt(dx*dx+dy*dy)||1;
    const force=(dist-180)*0.04*alpha;
    const fx=(dx/dist)*force,fy=(dy/dist)*force;
    s.vx+=fx;s.vy+=fy;t.vx-=fx;t.vy-=fy;
  }
  const cx=canvasW/2,cy=canvasH/2;
  for(const n of nodes){n.vx+=(cx-n.x)*0.008*alpha;n.vy+=(cy-n.y)*0.008*alpha;}
  for(const n of nodes){
    if(n.fx!==null){n.x=n.fx;n.vx=0;}else{n.vx*=0.6;n.x+=n.vx;}
    if(n.fy!==null){n.y=n.fy;n.vy=0;}else{n.vy*=0.6;n.y+=n.vy;}
    n.x=Math.max(n.radius+10,Math.min(canvasW-n.radius-10,n.x));
    n.y=Math.max(n.radius+10,Math.min(canvasH-n.radius-10,n.y));
  }
}
function render(){
  ctx.save();ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  ctx.clearRect(0,0,canvasW,canvasH);
  ctx.save();ctx.translate(panX,panY);ctx.scale(zoom,zoom);
  const fontFam=getComputedStyle(document.body).fontFamily;
  for(const e of edges){
    const s=nodeMap[e.source],t=nodeMap[e.target];if(!s||!t)continue;
    const isHL=hoveredNode&&(e.source===hoveredNode.id||e.target===hoveredNode.id);
    ctx.beginPath();
    const mx=(s.x+t.x)/2,my=(s.y+t.y)/2,dx=t.x-s.x,dy=t.y-s.y;
    const perpX=-dy*0.1,perpY=dx*0.1;
    ctx.moveTo(s.x,s.y);ctx.quadraticCurveTo(mx+perpX,my+perpY,t.x,t.y);
    if(hoveredNode){ctx.globalAlpha=isHL?0.8:0.08;ctx.strokeStyle=isHL?(cachedColors.accent||'#0176D3'):(cachedColors.conn||'rgba(1,118,211,0.35)');ctx.lineWidth=isHL?2.5:1;}
    else{ctx.globalAlpha=0.5;ctx.strokeStyle=cachedColors.conn||'rgba(1,118,211,0.35)';ctx.lineWidth=1.5;}
    ctx.stroke();ctx.globalAlpha=1;
    if(isHL&&zoom>0.5){
      ctx.font='9px '+fontFam;ctx.fillStyle=cachedColors.textDim||'#706E6B';ctx.textAlign='center';
      const lbl=e.label.length>35?e.label.substring(0,35)+'...':e.label;
      ctx.fillText(lbl,mx+perpX*0.5,my+perpY*0.5-4);
    }
  }
  for(const n of nodes){
    const isH=hoveredNode&&hoveredNode.id===n.id;
    const sc=isH?1.1:1,r=n.radius*sc;
    ctx.shadowColor=n.color;ctx.shadowBlur=isH?16:8;
    ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);ctx.fillStyle=n.color;
    if(hoveredNode&&!isH)ctx.globalAlpha=0.4;ctx.fill();ctx.globalAlpha=1;ctx.shadowBlur=0;
    ctx.strokeStyle=cachedColors.panel||'#FFFFFF';ctx.lineWidth=2.5;ctx.stroke();
    ctx.font=Math.round(r*0.65)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';
    if(hoveredNode&&!isH)ctx.globalAlpha=0.4;ctx.fillText(n.icon,n.x,n.y);ctx.globalAlpha=1;
    ctx.font='600 11px '+fontFam;ctx.fillStyle=cachedColors.text||'#181818';ctx.textAlign='center';ctx.textBaseline='top';
    if(hoveredNode&&!isH)ctx.globalAlpha=0.3;ctx.fillText(n.label,n.x,n.y+r+6);ctx.globalAlpha=1;
  }
  ctx.restore();ctx.restore();
}
function tick(){
  if(currentLevel!=='graph')return;
  simulate();render();
  if(!graphSettled||dragNode||hoveredNode)requestAnimationFrame(tick);
}
function screenToGraph(sx,sy){return{x:(sx-panX)/zoom,y:(sy-panY)/zoom};}
function hitTest(sx,sy){const{x,y}=screenToGraph(sx,sy);for(let i=nodes.length-1;i>=0;i--){const n=nodes[i],dx=x-n.x,dy=y-n.y;if(dx*dx+dy*dy<n.radius*n.radius*1.3)return n;}return null;}
function setupCanvasEvents(){
  canvas.addEventListener('mousedown',e=>{
    const rect=canvas.getBoundingClientRect();const sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    const node=hitTest(sx,sy);
    if(node&&e.button===0){dragNode=node;node.fx=node.x;node.fy=node.y;isDragging=false;alpha=Math.max(alpha,0.3);graphSettled=false;requestAnimationFrame(tick);}
    else if(e.button===0){isPanning=true;}
    lastMouse={x:e.clientX,y:e.clientY};
  });
  canvas.addEventListener('mousemove',e=>{
    const rect=canvas.getBoundingClientRect();const sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    if(dragNode){const dx=e.clientX-lastMouse.x,dy=e.clientY-lastMouse.y;if(Math.abs(dx)+Math.abs(dy)>3)isDragging=true;const{x,y}=screenToGraph(sx,sy);dragNode.fx=x;dragNode.fy=y;dragNode.x=x;dragNode.y=y;}
    else if(isPanning){panX+=e.clientX-lastMouse.x;panY+=e.clientY-lastMouse.y;render();}
    else{const node=hitTest(sx,sy);if(node!==hoveredNode){hoveredNode=node;canvas.style.cursor=node?'pointer':'grab';if(!graphSettled||hoveredNode){graphSettled=false;requestAnimationFrame(tick);}}}
    lastMouse={x:e.clientX,y:e.clientY};
  });
  canvas.addEventListener('mouseup',e=>{
    if(dragNode&&!isDragging){dragNode.fx=null;dragNode.fy=null;enterDomain(dragNode.id);}
    else if(dragNode){dragNode.fx=null;dragNode.fy=null;alpha=Math.max(alpha,0.1);graphSettled=false;requestAnimationFrame(tick);}
    dragNode=null;isPanning=false;
  });
  canvas.addEventListener('mouseleave',()=>{if(hoveredNode){hoveredNode=null;render();}isPanning=false;if(dragNode){dragNode.fx=null;dragNode.fy=null;dragNode=null;}});
  canvas.addEventListener('wheel',e=>{
    e.preventDefault();const rect=canvas.getBoundingClientRect();
    const sx=e.clientX-rect.left,sy=e.clientY-rect.top;
    const oldZoom=zoom;zoom*=e.deltaY<0?1.1:0.9;zoom=Math.max(0.3,Math.min(3,zoom));
    panX=sx-(sx-panX)*(zoom/oldZoom);panY=sy-(sy-panY)*(zoom/oldZoom);render();
  },{passive:false});
  window.addEventListener('resize',()=>{resizeCanvas();render();});
}

// == NAVIGATION ==
let currentLevel='graph',currentDomain=null,currentComponent=null,navHistory=[];
function showView(id){
  document.querySelectorAll('.view-layer').forEach(v=>{if(v.classList.contains('active')){v.classList.remove('active');v.classList.add('slide-out');setTimeout(()=>v.classList.remove('slide-out'),400);}});
  document.getElementById(id).classList.add('active');
  if(id==='graph-view'){graphSettled=false;alpha=Math.max(alpha,0.01);requestAnimationFrame(tick);}
}
function updateBreadcrumb(){
  const bc=document.getElementById('breadcrumb');
  let h='<span class="crumb'+(currentLevel==='graph'?' active':'')+'" onclick="navigateTo(\'graph\')">Architecture</span>';
  if(currentDomain){h+='<span class="crumb-sep">\u25B8</span><span class="crumb'+(currentLevel==='domain'?' active':'')+'" onclick="navigateTo(\'domain\')">'+NPSP[currentDomain].name+'</span>';}
  if(currentComponent){const c=NPSP[currentDomain].components.find(x=>x.id===currentComponent);if(c)h+='<span class="crumb-sep">\u25B8</span><span class="crumb active">'+c.name+'</span>';}
  bc.innerHTML=h;
  document.getElementById('backBtn').classList.toggle('visible',currentLevel!=='graph');
}
function enterDomain(id){navHistory.push({level:currentLevel,domain:currentDomain,component:currentComponent});currentLevel='domain';currentDomain=id;currentComponent=null;renderDomainView(id);showView('domain-view');updateBreadcrumb();}
function enterCore(did,cid){navHistory.push({level:currentLevel,domain:currentDomain,component:currentComponent});currentLevel='core';currentComponent=cid;renderCoreView(did,cid);showView('core-view');updateBreadcrumb();}
function navigateTo(level){if(level===currentLevel)return;if(level==='graph'){currentLevel='graph';currentDomain=null;currentComponent=null;showView('graph-view');}else if(level==='domain'){currentLevel='domain';currentComponent=null;showView('domain-view');}updateBreadcrumb();}
function goBack(){if(navHistory.length>0){const p=navHistory.pop();if(p.level==='graph')navigateTo('graph');else if(p.level==='domain'){currentDomain=p.domain;navigateTo('domain');}}else{if(currentLevel==='core')navigateTo('domain');else if(currentLevel==='domain')navigateTo('graph');}}

// == RENDER DOMAIN ==
function renderDomainView(id){
  const p=NPSP[id],el=document.getElementById('domain-content');
  el.innerHTML='<div class="domain-header"><div class="domain-header-icon" style="background:'+p.color+'22;border:2px solid '+p.color+'">'+p.icon+'</div><div><h2 style="color:'+p.color+'">'+p.name+'</h2><p>'+p.description+'</p></div></div>'+
  '<div class="component-grid">'+p.components.map(c=>'<div class="component-card" style="--card-accent:'+p.color+'" onclick="enterCore(\''+id+'\',\''+c.id+'\')"><h3><span class="icon">'+c.icon+'</span> '+c.name+'</h3><div class="card-desc">'+c.desc+'</div><div class="card-tags">'+(c.tags||[]).map(t=>'<span class="card-tag">'+t+'</span>').join('')+(c.triggerTags||[]).map(t=>'<span class="card-tag trigger">'+t+'</span>').join('')+'</div></div>').join('')+'</div>'+
  '<div class="data-flow"><h3>Data Flow</h3><div class="flow-diagram">'+p.dataFlow.map((n,i)=>(i>0?'<span class="flow-arrow">\u2192</span>':'')+('<span class="flow-node">'+n+'</span>')).join('')+'</div></div>'+
  '<div class="connections-section"><h3>Connected Systems</h3>'+p.connections.map(c=>'<div class="connection-item" onclick="enterDomain(\''+c.planet+'\')"><div class="conn-planet" style="background:'+(PLANET_META[c.planet]?.color||'#64748b')+'22;border:1px solid '+(PLANET_META[c.planet]?.color||'#64748b')+'">'+(PLANET_META[c.planet]?.icon||'\u2B50')+'</div><div><strong>'+(NPSP[c.planet]?.name||c.planet)+'</strong><div>'+c.desc+'</div></div></div>').join('')+'</div>';
  document.getElementById('domain-view').scrollTop=0;
}

// == RENDER CORE ==
function renderCoreView(pid,cid){
  const p=NPSP[pid],c=p.components.find(x=>x.id===cid);if(!c)return;
  const el=document.getElementById('core-content');
  let h='<div class="core-header"><span style="font-size:22px">'+c.icon+'</span><div><h2>'+c.name+'</h2><span class="badge">TRIGGER LEVEL</span></div></div>';
  h+='<div class="trigger-section"><h3>Overview</h3><div class="trigger-desc">'+c.desc+'</div><div class="card-tags">'+(c.tags||[]).map(t=>'<span class="card-tag">'+t+'</span>').join('')+(c.triggerTags||[]).map(t=>'<span class="card-tag trigger">'+t+'</span>').join('')+'</div></div>';
  if(c.executionFlow)h+='<div class="trigger-section"><h3>Execution Flow</h3><div class="execution-flow">'+c.executionFlow.map((s,i)=>'<div class="exec-step"><span class="step-num">'+(i+1)+'</span><span>'+s+'</span></div>').join('')+'</div></div>';
  if(c.code)h+='<div class="trigger-section"><h3>Source Code Pattern</h3><div class="code-block"><div class="code-header"><span class="lang">'+c.code.lang+'</span><span>'+c.code.title+'</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div><div class="code-body"><pre>'+c.code.body+'</pre></div></div></div>';
  h+='<div class="code-lab"><h3>Code Lab: Explore Further</h3><div class="lab-desc">Related patterns for understanding this component deeper.</div><div class="lab-tabs"><button class="lab-tab active" onclick="switchTab(this,\'pattern\')">TDTM Pattern</button><button class="lab-tab" onclick="switchTab(this,\'testing\')">Test Pattern</button><button class="lab-tab" onclick="switchTab(this,\'extension\')">Extension Point</button></div><div id="lab-content"></div></div>';
  el.innerHTML=h;switchTab(el.querySelector('.lab-tab.active'),'pattern');document.getElementById('core-view').scrollTop=0;
}
"""

# === JS TAIL CODE (after labPatterns - switchTab, copyCode, search, init) ===
JS_TAIL = r"""
function switchTab(tab,type){tab.parentElement.querySelectorAll('.lab-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');const p=labPatterns[type];document.getElementById('lab-content').innerHTML='<div class="code-block"><div class="code-header"><span class="lang">Apex</span><span>'+p.title+'</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div><div class="code-body"><pre>'+p.code+'</pre></div></div>';}
function copyCode(btn){const pre=btn.closest('.code-block').querySelector('pre');navigator.clipboard.writeText(pre.textContent).then(()=>{btn.textContent='Copied!';setTimeout(()=>btn.textContent='Copy',1500)});}

// == SEARCH ENGINE ==
let searchResults=[],searchIndex=-1;
function buildSearchIndex(){const idx=[];for(const[pid,planet] of Object.entries(NPSP)){idx.push({type:'planet',id:pid,name:planet.name,desc:planet.description,icon:planet.icon,color:planet.color,tags:[],level:'Architecture',action:()=>enterDomain(pid)});for(const comp of planet.components){const allTags=[...(comp.tags||[]),...(comp.triggerTags||[])];idx.push({type:'component',id:comp.id,planetId:pid,name:comp.name,desc:comp.desc,icon:comp.icon,color:planet.color,tags:allTags,level:planet.name,action:()=>{if(currentDomain!==pid)enterDomain(pid);setTimeout(()=>enterCore(pid,comp.id),currentDomain!==pid?500:0)}});for(const tag of allTags){idx.push({type:'tag',id:tag,planetId:pid,componentId:comp.id,name:tag,desc:comp.desc,icon:comp.icon,color:planet.color,tags:[],level:planet.name+' > '+comp.name,action:()=>{if(currentDomain!==pid)enterDomain(pid);setTimeout(()=>enterCore(pid,comp.id),currentDomain!==pid?500:0)}})}}}return idx}
const fullIndex=buildSearchIndex();
function searchNPSP(query){if(!query.trim())return[];const q=query.toLowerCase();const scored=[];for(const item of fullIndex){let score=0;const nm=item.name.toLowerCase(),ds=item.desc.toLowerCase(),tgs=item.tags.map(t=>t.toLowerCase());if(nm===q)score+=100;else if(nm.startsWith(q))score+=80;else if(nm.includes(q))score+=60;if(ds.includes(q))score+=30;for(const t of tgs){if(t===q)score+=90;else if(t.includes(q))score+=50}if(score>0)scored.push({...item,score})}scored.sort((a,b)=>b.score-a.score);const seen=new Set,deduped=[];for(const r of scored){const key=r.type+':'+r.id+(r.planetId||'');if(!seen.has(key)){seen.add(key);deduped.push(r);if(deduped.length>=25)break}}return deduped}
function highlightMatch(text,query){if(!query)return text;const re=new RegExp('('+query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');return text.replace(re,'<span class="sr-match">$1</span>')}
function renderSearchResults(results,query){const el=document.getElementById('searchResults');if(results.length===0&&query.trim()){el.innerHTML='<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:11px">No results for "'+query.replace(/</g,'&lt;')+'"</div>';return}el.innerHTML=results.map((r,i)=>'<div class="search-result'+(i===searchIndex?' active':'')+'" data-idx="'+i+'" onclick="activateResult('+i+')" onmouseenter="searchIndex='+i+';highlightActive()"><div class="sr-icon" style="background:'+r.color+'22;border:1px solid '+r.color+'44">'+r.icon+'</div><div class="sr-body"><div class="sr-title">'+highlightMatch(r.name,query)+'</div><div class="sr-path">'+r.level+'</div><div class="sr-desc">'+highlightMatch(r.desc.substring(0,100),query)+(r.desc.length>100?'...':'')+'</div></div><span class="sr-level">'+r.type+'</span></div>').join('')}
function highlightActive(){document.querySelectorAll('.search-result').forEach((el,i)=>el.classList.toggle('active',i===searchIndex))}
function activateResult(idx){const r=searchResults[idx];if(r){closeSearch();setTimeout(()=>r.action(),100)}}
function cycleResult(dir){if(searchResults.length===0)return;searchIndex=(searchIndex+dir+searchResults.length)%searchResults.length;highlightActive();document.getElementById('searchCount').textContent=(searchIndex+1)+'/'+searchResults.length;const active=document.querySelector('.search-result.active');if(active)active.scrollIntoView({block:'nearest'})}
function openSearch(){const ov=document.getElementById('search-overlay');ov.classList.add('open');const inp=document.getElementById('searchInput');inp.value='';inp.focus();searchResults=[];searchIndex=-1;document.getElementById('searchResults').innerHTML='';document.getElementById('searchNav').style.display='none'}
function closeSearch(){document.getElementById('search-overlay').classList.remove('open')}
document.getElementById('searchInput').addEventListener('input',function(){const q=this.value;searchResults=searchNPSP(q);searchIndex=searchResults.length>0?0:-1;renderSearchResults(searchResults,q);const nav=document.getElementById('searchNav');if(searchResults.length>0){nav.style.display='flex';document.getElementById('searchCount').textContent=(searchIndex+1)+'/'+searchResults.length}else{nav.style.display='none'}});
document.getElementById('searchInput').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();if(e.shiftKey)cycleResult(-1);else if(searchResults.length>0&&searchIndex>=0)activateResult(searchIndex);else cycleResult(1)}if(e.key==='ArrowDown'){e.preventDefault();cycleResult(1)}if(e.key==='ArrowUp'){e.preventDefault();cycleResult(-1)}if(e.key==='Escape'){closeSearch()}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!document.getElementById('search-overlay').classList.contains('open')&&document.activeElement.tagName!=='INPUT'){e.preventDefault();openSearch()}if(e.key==='Escape'&&!document.getElementById('search-overlay').classList.contains('open')){goBack()}});

// == INIT ==
initTheme();
initGraph();
setupCanvasEvents();
updateBreadcrumb();
"""

if __name__ == '__main__':
    if '--check' in sys.argv:
        check()
    else:
        content = build()
        check(content)
