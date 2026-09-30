// ══════════════════════════════════════════════════════════════
//  LEARNING — the exploration layer (redesign 2026-09, Phase 5)
//  Everything here is built from data every product already has:
//  domain `connections` (with plain-English desc), `dataFlow`, tours.
//    · Explored map  — which domains you've opened (localStorage, per product)
//    · Path finder   — shortest chain between two domains, each hop narrated
//    · Follow data   — step through a domain's data flow one stage at a time
//    · Missions      — completed-tour tracking for the tour picker
//  Pure logic is exported separately from DOM wiring so it can be tested.
// ══════════════════════════════════════════════════════════════

import { esc } from "./templates.js";
import { safeLSGet, safeLSSet } from "./utils.js";

// ── Pure: graph + shortest path ──────────────────────────────
// Undirected adjacency from each domain's connections; keeps the text for
// both directions so a hop can be narrated whichever way it's walked.
export function buildGraph(data) {
  const adj = new Map();
  const text = new Map();
  const add = (a, b, desc) => {
    if (!data[a] || !data[b] || a === b) return;
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    adj.get(a).add(b);
    adj.get(b).add(a);
    if (desc && !text.has(`${a}>${b}`)) text.set(`${a}>${b}`, desc);
  };
  for (const [id, d] of Object.entries(data)) for (const c of d.connections || []) add(id, c.planet, c.desc);
  return { adj, text };
}

// BFS shortest path; returns [id, ...] or null. Ties break by id order, so the
// result is deterministic for the same data.
export function shortestPath(graph, from, to) {
  if (from === to) return [from];
  if (!graph.adj.has(from) || !graph.adj.has(to)) return null;
  const prev = new Map([[from, null]]);
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift();
    for (const nb of [...graph.adj.get(cur)].sort()) {
      if (prev.has(nb)) continue;
      prev.set(nb, cur);
      if (nb === to) {
        const path = [to];
        for (let p = cur; p != null; p = prev.get(p)) path.unshift(p);
        return path;
      }
      queue.push(nb);
    }
  }
  return null;
}

// The sentence that explains one hop, preferring the direction walked.
export function hopText(graph, a, b) {
  return graph.text.get(`${a}>${b}`) || graph.text.get(`${b}>${a}`) || "";
}

// ── Pure: explored / missions state ──────────────────────────
export function loadSet(prefix, key) {
  try { return new Set(JSON.parse(safeLSGet(prefix + key) || "[]")); } catch { return new Set(); }
}
export function saveSet(prefix, key, set) {
  safeLSSet(prefix + key, JSON.stringify([...set]));
}

// ── DOM wiring ───────────────────────────────────────────────
let _data = {}, _prefix = "", _graph = null, _explored = new Set(), _missions = new Set();
let _onFocusPath = () => {}, _onClearPath = () => {}, _enterPlanet = () => {};

export function initLearning({ data, prefix, onFocusPath, onClearPath, enterPlanet }) {
  _data = data;
  _prefix = prefix;
  _graph = buildGraph(data);
  // Drop stored ids for domains that no longer exist, so the count can't exceed the total.
  _explored = new Set([...loadSet(prefix, "explored")].filter((id) => data[id]));
  saveSet(prefix, "explored", _explored);
  _missions = loadSet(prefix, "missions");
  _onFocusPath = onFocusPath || _onFocusPath;
  _onClearPath = onClearPath || _onClearPath;
  _enterPlanet = enterPlanet || _enterPlanet;
  mountExploredStat();
  mountPathFinder();
}

// Explored map ─────────────────────────────────────────────────
export function markExplored(id) {
  if (!_data[id] || _explored.has(id)) return;
  _explored.add(id);
  saveSet(_prefix, "explored", _explored);
  renderExploredStat();
}
function mountExploredStat() {
  const strip = document.querySelector(".galaxy-stats");
  if (!strip || document.getElementById("statExplored")) return;
  const item = document.createElement("div");
  item.className = "stat-item stat-explored";
  item.innerHTML = `<div class="stat-value" id="statExplored"></div><div class="stat-label">Explored</div>`;
  strip.appendChild(item);
  renderExploredStat();
}
function renderExploredStat() {
  const el = document.getElementById("statExplored");
  if (!el) return;
  const total = Object.keys(_data).length;
  el.innerHTML = `${_explored.size}<span aria-hidden="true">/</span><span class="sr-only"> of </span>${total}`;
}

// Missions ─────────────────────────────────────────────────────
export function isMissionDone(tourId) { return _missions.has(tourId); }
export function completeMission(tourId) {
  _missions.add(tourId);
  saveSet(_prefix, "missions", _missions);
}

// Path finder ──────────────────────────────────────────────────
function mountPathFinder() {
  const title = document.querySelector("#galaxy-view .galaxy-title");
  if (!title || document.getElementById("pathFinder")) return;
  const ids = Object.keys(_data).sort((a, b) => _data[a].name.localeCompare(_data[b].name));
  const opts = ids.map((id) => `<option value="${esc(id)}">${esc(_data[id].name)}</option>`).join("");
  const wrap = document.createElement("div");
  wrap.id = "pathFinder";
  wrap.className = "path-finder";
  wrap.innerHTML = `
    <button type="button" class="pf-toggle" aria-expanded="false" aria-controls="pfPanel">How does it connect?</button>
    <div class="pf-panel" id="pfPanel" hidden>
      <label>From <select id="pfFrom">${opts}</select></label>
      <label>to <select id="pfTo">${opts}</select></label>
      <button type="button" class="pf-go" id="pfGo">Show the path</button>
      <button type="button" class="pf-clear" id="pfClear" hidden>Clear</button>
      <ol class="pf-steps" id="pfSteps" aria-live="polite"></ol>
    </div>`;
  title.appendChild(wrap);
  const toggle = wrap.querySelector(".pf-toggle"), panel = wrap.querySelector(".pf-panel");
  const to = wrap.querySelector("#pfTo");
  if (ids.length > 1) to.value = ids[ids.length - 1];
  toggle.addEventListener("click", () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (!open) clearPath();
  });
  wrap.querySelector("#pfGo").addEventListener("click", () => showPath(wrap.querySelector("#pfFrom").value, to.value));
  wrap.querySelector("#pfClear").addEventListener("click", clearPath);
}

export function showPath(from, to) {
  const steps = document.getElementById("pfSteps");
  if (!steps || !_data[from] || !_data[to]) return;
  document.getElementById("pfClear").hidden = false;
  if (from === to) {
    steps.innerHTML = `<li class="pf-none">Pick two different domains.</li>`;
    _onClearPath();
    return;
  }
  const path = shortestPath(_graph, from, to);
  if (!path) {
    steps.innerHTML = `<li class="pf-none">${esc(_data[from].name)} and ${esc(_data[to].name)} aren't connected in this product's map.</li>`;
    _onClearPath();
    return;
  }
  steps.innerHTML = path
    .map((id, i) => {
      const hop = i > 0 ? `<span class="pf-why">${esc(hopText(_graph, path[i - 1], id))}</span>` : "";
      return `<li>${hop}<button type="button" class="pf-stop" data-go="${esc(id)}">${esc(_data[id].name)}</button></li>`;
    })
    .join("");
  steps.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => _enterPlanet(b.dataset.go)));
  _onFocusPath(new Set(path), path);
}

function clearPath() {
  const steps = document.getElementById("pfSteps");
  if (steps) steps.innerHTML = "";
  const c = document.getElementById("pfClear");
  if (c) c.hidden = true;
  _onClearPath();
}

// Follow the data ──────────────────────────────────────────────
// Upgrades a rendered .data-flow block with Play/step controls. Each stage
// lights in turn with a one-line caption; reduced motion steps manually.
export function enhanceDataFlow(container, reduced) {
  const flow = container.querySelector(".data-flow");
  if (!flow || flow.querySelector(".df-controls")) return;
  const nodes = [...flow.querySelectorAll(".flow-node")];
  if (nodes.length < 2) return;
  const bar = document.createElement("div");
  bar.className = "df-controls";
  bar.innerHTML = `
    <button type="button" class="df-play">${reduced ? "Step through" : "Follow the data"}</button>
    <span class="df-caption" aria-live="polite"></span>`;
  const heading = flow.querySelector("h3");
  if (heading) heading.after(bar);
  else flow.prepend(bar);
  const btn = bar.querySelector(".df-play"), cap = bar.querySelector(".df-caption");
  let i = -1, timer = 0;
  const show = (k) => {
    nodes.forEach((n, j) => {
      n.classList.toggle("df-on", j === k);
      n.classList.toggle("df-done", j < k);
    });
    const r = nodes[k].getBoundingClientRect();
    if (r.top < 60 || r.bottom > innerHeight - 20)
      nodes[k].scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
    // Stages are either short names ("Payment") or full sentences (docs-only
    // products). The node itself is highlighted; the caption just says where
    // you are, so it never duplicates or mangles a sentence.
    const name = nodes[k].textContent.replace(/^\d+/, "").trim().replace(/[.]+$/, "");
    const short = name.length <= 40;
    cap.textContent = short
      ? (k === 0 ? `It starts with ${name}.` : k === nodes.length - 1 ? `…and ends at ${name}.` : `Then ${name}.`)
      : `Step ${k + 1} of ${nodes.length}${k === nodes.length - 1 ? " — the end of the flow." : ""}`;
  };
  const stop = () => { clearInterval(timer); timer = 0; btn.textContent = reduced ? "Step through" : "Replay"; };
  btn.addEventListener("click", () => {
    if (reduced) {
      i = (i + 1) % nodes.length;
      show(i);
      btn.textContent = i === nodes.length - 1 ? "Start over" : "Next step";
      return;
    }
    if (timer) return stop(); // second click while playing = pause
    i = 0;
    show(0);
    btn.textContent = "Pause";
    timer = setInterval(() => {
      // The domain view re-renders on navigation; stop if these nodes left the page.
      if (!flow.isConnected) return stop();
      i++;
      if (i >= nodes.length) return stop();
      show(i);
    }, 1400);
  });
}
