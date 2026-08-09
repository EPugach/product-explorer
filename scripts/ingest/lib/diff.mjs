// scripts/ingest/lib/diff.mjs
//
// Structured diff between committed and regenerated product data. Operates on
// PARSED OBJECTS (not text), separating:
//   - structural drift  — fields that are supposed to be FROZEN (ids, names,
//     icons, colors, connections, tags, object/field schemas). ANY drift here
//     is a defect (the merge should have preserved them).
//   - content changes   — the regenerated prose (descriptions, docs, dataFlow).
//     Expected to differ; this is the human-reviewable signal.
//
// Produces a machine summary + a scannable markdown report.

const clip = (s, n = 220) => {
  s = String(s ?? "");
  return s.length > n ? s.slice(0, n) + "…" : s;
};
const jeq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function structuredDiff(committed, generated) {
  const cP = committed.PRODUCT, gP = generated.PRODUCT;
  const cE = committed.ENTITIES, gE = generated.ENTITIES;
  const structuralDrift = [];
  const md = [];
  let domainsChanged = 0, componentsChanged = 0, objectsChanged = 0, docsRegen = 0;

  for (const id of Object.keys(gP)) {
    const c = cP[id], g = gP[id];
    if (!c) { structuralDrift.push(`data.${id}: NEW domain (not in baseline)`); continue; }

    // Frozen structural fields — must be identical.
    for (const k of ["name", "icon", "color", "packages"])
      if (!jeq(c[k], g[k])) structuralDrift.push(`data.${id}.${k} changed (frozen)`);
    if (!jeq(c.connections, g.connections)) structuralDrift.push(`data.${id}.connections changed (frozen)`);

    const domLines = [];
    if (c.description !== g.description)
      domLines.push(`- **description** changed\n    - was: ${clip(c.description)}\n    - now: ${clip(g.description)}`);
    if (!jeq(c.dataFlow, g.dataFlow))
      domLines.push(`- **dataFlow** changed (${(c.dataFlow || []).length} → ${(g.dataFlow || []).length} steps)`);

    // Components — match by frozen id.
    const cById = Object.fromEntries((c.components || []).map((x) => [x.id, x]));
    for (const gc of g.components || []) {
      const cc = cById[gc.id];
      if (!cc) { structuralDrift.push(`data.${id}.${gc.id}: NEW component (not in baseline)`); continue; }
      for (const k of ["name", "icon", "tags", "docUrl", "connections"])
        if (!jeq(cc[k], gc[k])) structuralDrift.push(`data.${id}.${gc.id}.${k} changed (frozen)`);
      const parts = [];
      if (cc.desc !== gc.desc) parts.push("desc");
      if (!jeq(cc.docs, gc.docs)) { parts.push(`docs(${(cc.docs || []).length}→${(gc.docs || []).length})`); docsRegen += (gc.docs || []).length; }
      if (parts.length) {
        componentsChanged++;
        domLines.push(`- component \`${gc.id}\` (${gc.name}): ${parts.join(", ")} regenerated`);
        if (cc.desc !== gc.desc)
          domLines.push(`    - desc was: ${clip(cc.desc)}\n    - desc now: ${clip(gc.desc)}`);
      }
    }

    // Objects — match by frozen name.
    const gEnt = (gE[id] && gE[id].objects) || [];
    const cEnt = (cE[id] && cE[id].objects) || [];
    const cByName = Object.fromEntries(cEnt.map((o) => [o.name, o]));
    for (const go of gEnt) {
      const co = cByName[go.name];
      if (!co) { structuralDrift.push(`entities.${id}.${go.name}: NEW object (not in baseline)`); continue; }
      for (const k of ["type", "domain", "fields", "relationships"])
        if (!jeq(co[k], go[k])) structuralDrift.push(`entities.${id}.${go.name}.${k} changed (frozen)`);
      if (co.description !== go.description) {
        objectsChanged++;
        domLines.push(`- object \`${go.name}\`: description regenerated\n    - was: ${clip(co.description)}\n    - now: ${clip(go.description)}`);
      }
    }

    if (domLines.length) {
      domainsChanged++;
      md.push(`### ${g.name} (\`${id}\`)\n${domLines.join("\n")}`);
    }
  }

  const summary = {
    domainsChanged, componentsChanged, objectsChanged, docsRegen,
    structuralDrift, structuralDriftCount: structuralDrift.length,
  };
  const header =
    `# Regeneration diff vs committed\n\n` +
    `- domains with content changes: **${domainsChanged}**\n` +
    `- components regenerated: **${componentsChanged}**\n` +
    `- object descriptions regenerated: **${objectsChanged}**\n` +
    `- doc paragraphs in output: **${docsRegen}**\n` +
    `- **structural drift (should be 0): ${structuralDrift.length}**` +
    (structuralDrift.length ? `\n\n> ⚠ STRUCTURAL DRIFT DETECTED — the merge failed to freeze:\n${structuralDrift.map((d) => `> - ${d}`).join("\n")}` : " ✓") +
    `\n\n---\n\n`;

  return { summary, markdown: header + md.join("\n\n") + "\n" };
}
