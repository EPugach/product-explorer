// ══════════════════════════════════════════════════════════════
//  RELATION MAP — an entity's direct neighbours as a small SVG graph
//  The entity sits in the centre; objects it relates to / references
//  sit on a ring around it, each a real link to that entity's page
//  when it exists in this product. Works for docs-only products
//  (object relationships) and code-derived ones (class references).
//  Pure SVG + DOM: no WebGL, keyboard- and screen-reader-accessible.
// ══════════════════════════════════════════════════════════════

import { esc } from "./templates.js";

const MAX = 10; // more than this reads as a hairball; the full list stays below

// Collect { name, kind, label } neighbours from whatever the entity carries.
export function neighboursOf(entity) {
  const out = new Map();
  const add = (name, kind, label) => {
    if (!name || name === entity.name || out.has(name)) return;
    out.set(name, { name, kind, label });
  };
  for (const r of entity.relationships || []) add(r.target, "object", r.type || "related");
  for (const o of entity.referencedObjects || []) add(o, "object", "references");
  if (entity.object) add(entity.object, "object", "runs on");
  for (const h of entity.handlers || []) add(typeof h === "string" ? h : h.name, "class", "handler");
  return [...out.values()];
}

// Returns SVG markup, or "" when there's nothing meaningful to draw.
// resolve(name, kind) → { pid, cid, type, name } | null  (makes a node clickable)
export function renderRelationMap(entity, color, resolve) {
  const all = neighboursOf(entity);
  if (all.length === 0) return "";
  const ns = all.slice(0, MAX);
  // Height scales with neighbour count so a 1-2 neighbour map isn't a mostly-empty panel.
  const few = ns.length <= 2;
  const W = 560, H = few ? (ns.length === 1 ? 120 : 180) : ns.length > 6 ? 300 : 240;
  const cx = W / 2, cy = few && ns.length === 1 ? H - 34 : H / 2;
  const rx = W * 0.36, ry = H * 0.36;
  const nodes = ns.map((n, i) => {
    // 1-2 neighbours: stack them above/below the centre so long names can't collide sideways.
    if (few) return { ...n, x: cx, y: i === 0 ? 26 : H - 26, link: resolve(n.name, n.kind) };
    const a = -Math.PI / 2 + (i / ns.length) * Math.PI * 2;
    return { ...n, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, link: resolve(n.name, n.kind) };
  });
  const edges = nodes
    .map((n) => {
      // Slight curve so labels on the line don't sit on top of each other.
      const mx = (cx + n.x) / 2 + (n.y - cy) * 0.12, my = (cy + n.y) / 2 - (n.x - cx) * 0.12;
      return `<path class="rm-edge" d="M${cx},${cy} Q${mx.toFixed(1)},${my.toFixed(1)} ${n.x.toFixed(1)},${n.y.toFixed(1)}"/>` +
        `<text class="rm-edge-label" x="${mx.toFixed(1)}" y="${(my - 4).toFixed(1)}">${esc(n.label)}</text>`;
    })
    .join("");
  const nodeEls = nodes
    .map((n) => {
      const label = n.name.length > 26 ? n.name.slice(0, 25) + "…" : n.name;
      const w = 22 + label.length * 7.4;
      // Keep the pill inside the viewBox even for long names near the edge.
      const x0 = Math.max(4, Math.min(W - w - 4, n.x - w / 2));
      const body =
        `<rect x="${x0.toFixed(1)}" y="${(n.y - 14).toFixed(1)}" width="${w.toFixed(1)}" height="28" rx="14"/>` +
        `<text x="${(x0 + w / 2).toFixed(1)}" y="${(n.y + 4).toFixed(1)}">${esc(label)}</text>` +
        (label !== n.name ? `<title>${esc(n.name)}</title>` : "");
      return n.link
        ? `<g class="rm-node rm-link" role="link" tabindex="0" aria-label="Open ${esc(n.name)}" data-entity-link='${esc(JSON.stringify(n.link))}'>${body}</g>`
        : `<g class="rm-node" aria-label="${esc(n.name)} (not mapped in this product)">${body}</g>`;
    })
    .join("");
  const more = all.length > MAX ? `<text class="rm-more" x="${W - 8}" y="${H - 8}">+${all.length - MAX} more below</text>` : "";
  const cw = 30 + entity.name.length * 8.2;
  return `<div class="relation-map" style="--rm-color:${color}">
    <h3 class="rm-title">How it connects</h3>
    <svg viewBox="0 0 ${W} ${H}" role="group" aria-label="${esc(entity.name)} and ${all.length} related entities">
      ${edges}
      <g class="rm-center" aria-hidden="true">
        <rect x="${(cx - cw / 2).toFixed(1)}" y="${cy - 17}" width="${cw.toFixed(1)}" height="34" rx="17"/>
        <text x="${cx}" y="${cy + 5}">${esc(entity.name)}</text>
      </g>
      ${nodeEls}
      ${more}
    </svg>
  </div>`;
}
