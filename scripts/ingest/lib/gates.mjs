// scripts/ingest/lib/gates.mjs
//
// Objective, deterministic gates the synthesized data files must pass before a
// human ever reviews them (council verdict #2: "objective gates + human
// review", temperature 0). Three gates:
//
//   validateSchema  — the shape the rendering engine + generate-ai-context rely on
//   checkIntegrity  — referential integrity: every cross-reference resolves
//   checkCoverage   — counts within tolerance of the frozen baseline
//
// Each returns { ok, errors:[], warnings:[] }. Errors fail the gate; warnings
// are advisory (e.g. a tag pointing at a platform object we don't model).

const isStr = (v) => typeof v === "string" && v.length > 0;
const isArr = Array.isArray;

// ── Gate 1: schema shape ────────────────────────────────────────────────────

export function validateSchema(PRODUCT, ENTITIES) {
  const errors = [];
  const E = (msg) => errors.push(msg);

  if (!PRODUCT || typeof PRODUCT !== "object") {
    return { ok: false, errors: ["data.js PRODUCT is not an object"], warnings: [] };
  }
  for (const [id, d] of Object.entries(PRODUCT)) {
    const at = `data.${id}`;
    if (!isArr(d.packages)) E(`${at}.packages must be an array`);
    if (!isStr(d.name)) E(`${at}.name must be a non-empty string`);
    if (!isStr(d.icon)) E(`${at}.icon must be a non-empty string`);
    if (!isStr(d.color) || !/^#[0-9a-fA-F]{3,8}$/.test(d.color))
      E(`${at}.color must be a hex color`);
    if (!isStr(d.description)) E(`${at}.description must be a non-empty string`);
    if (!isArr(d.components)) E(`${at}.components must be an array`);
    if (!isArr(d.dataFlow)) E(`${at}.dataFlow must be an array`);
    if (!isArr(d.connections)) E(`${at}.connections must be an array`);
    for (const c of d.components || []) {
      const cat = `${at}.components[${c && c.id}]`;
      if (!c || typeof c !== "object") { E(`${cat} not an object`); continue; }
      if (!isStr(c.id)) E(`${cat}.id must be a non-empty string`);
      if (!isStr(c.name)) E(`${cat}.name must be a non-empty string`);
      if (!isStr(c.icon)) E(`${cat}.icon must be a non-empty string`);
      if (!isStr(c.desc)) E(`${cat}.desc must be a non-empty string`);
      if (!isArr(c.tags)) E(`${cat}.tags must be an array`);
      if (!isArr(c.docs)) E(`${cat}.docs must be an array`);
      if (!isArr(c.connections)) E(`${cat}.connections must be an array`);
      if (c.docUrl !== undefined && !isStr(c.docUrl)) E(`${cat}.docUrl must be a string when present`);
      for (const cn of c.connections || [])
        if (!cn || !isStr(cn.planet) || !isStr(cn.desc)) E(`${cat}.connections entry needs {planet,desc}`);
    }
    for (const cn of d.connections || [])
      if (!cn || !isStr(cn.planet) || !isStr(cn.desc)) E(`${at}.connections entry needs {planet,desc}`);
    for (const step of d.dataFlow || [])
      if (!isStr(step)) E(`${at}.dataFlow entries must be strings`);
  }

  if (!ENTITIES || typeof ENTITIES !== "object") {
    E("entities.js default export is not an object");
  } else {
    for (const [id, e] of Object.entries(ENTITIES)) {
      const at = `entities.${id}`;
      if (!isArr(e.objects)) E(`${at}.objects must be an array`);
      if (e.metadata !== undefined && !isArr(e.metadata)) E(`${at}.metadata must be an array when present`);
      for (const o of e.objects || []) {
        const oat = `${at}.objects[${o && o.name}]`;
        if (!isStr(o.name)) E(`${oat}.name must be a non-empty string`);
        if (!isStr(o.type)) E(`${oat}.type must be a non-empty string`);
        if (!isStr(o.description)) E(`${oat}.description must be a non-empty string`);
        if (!isArr(o.fields)) E(`${oat}.fields must be an array`);
        if (!isArr(o.relationships)) E(`${oat}.relationships must be an array`);
        for (const f of o.fields || [])
          if (!isStr(f.name) || !isStr(f.type) || !isStr(f.description))
            E(`${oat}.fields entry needs {name,type,description}`);
        for (const r of o.relationships || [])
          if (!isStr(r.target) || !isStr(r.type) || !isStr(r.description))
            E(`${oat}.relationships entry needs {target,type,description}`);
      }
      for (const m of e.metadata || []) {
        const mat = `${at}.metadata[${m && m.type}]`;
        if (!isStr(m.type)) E(`${mat}.type must be a non-empty string`);
        if (!isStr(m.name)) E(`${mat}.name must be a non-empty string`);
        if (!isStr(m.description)) E(`${mat}.description must be a non-empty string`);
        if (!m.fields || typeof m.fields !== "object") E(`${mat}.fields must be an object`);
      }
    }
  }

  return { ok: errors.length === 0, errors, warnings: [] };
}

// ── Gate 2: referential integrity ──────────────────────────────────────────

export function checkIntegrity(PRODUCT, ENTITIES) {
  const errors = [];
  const warnings = [];
  const domainIds = new Set(Object.keys(PRODUCT));
  const objectNames = new Set();
  for (const e of Object.values(ENTITIES || {}))
    for (const o of e.objects || []) objectNames.add(o.name);

  for (const [id, d] of Object.entries(PRODUCT)) {
    // Every connection planet must be a real domain (breaks galaxy nav otherwise).
    for (const cn of d.connections || [])
      if (!domainIds.has(cn.planet))
        errors.push(`data.${id}.connections -> unknown planet "${cn.planet}"`);
    for (const c of d.components || []) {
      for (const cn of c.connections || [])
        if (!domainIds.has(cn.planet))
          errors.push(`data.${id}.${c.id}.connections -> unknown planet "${cn.planet}"`);
      // tags reference entity object names; some legitimately point at platform
      // objects we don't model — advisory, not fatal.
      for (const t of c.tags || [])
        if (!objectNames.has(t))
          warnings.push(`data.${id}.${c.id}.tags -> "${t}" is not a modeled entity object`);
    }
  }

  // entity.domain should match its container; relationship targets are advisory.
  for (const [id, e] of Object.entries(ENTITIES || {})) {
    for (const o of e.objects || []) {
      if (o.domain && o.domain !== id)
        errors.push(`entities.${id}.${o.name}.domain = "${o.domain}" (expected "${id}")`);
      for (const r of o.relationships || [])
        if (!objectNames.has(r.target))
          warnings.push(`entities.${id}.${o.name} -> relationship target "${r.target}" not modeled`);
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

// ── Gate 2b: physics keys cover exactly the domain set ──────────────────────
// config.physics.{weights,groups,seeds} are keyed by domain ID; a missing or
// extra key silently corrupts the galaxy layout.

export function checkPhysics(config, PRODUCT) {
  const errors = [];
  const domainIds = Object.keys(PRODUCT).sort();
  for (const map of ["weights", "groups", "seeds"]) {
    const keys = Object.keys((config.physics && config.physics[map]) || {}).sort();
    const missing = domainIds.filter((k) => !keys.includes(k));
    const extra = keys.filter((k) => !domainIds.includes(k));
    if (missing.length) errors.push(`config.physics.${map} missing: ${missing.join(", ")}`);
    if (extra.length) errors.push(`config.physics.${map} has stale keys: ${extra.join(", ")}`);
  }
  return { ok: errors.length === 0, errors, warnings: [] };
}

// ── Gate 3: coverage vs baseline ────────────────────────────────────────────

export function checkCoverage(baseline, PRODUCT, ENTITIES, { tolerance = 0 } = {}) {
  const errors = [];
  const warnings = [];
  const domainIds = Object.keys(PRODUCT);
  let nComponents = 0;
  for (const id of domainIds) nComponents += (PRODUCT[id].components || []).length;
  let nObjects = 0, nMetadata = 0;
  for (const e of Object.values(ENTITIES || {})) {
    nObjects += (e.objects || []).length;
    nMetadata += (e.metadata || []).length;
  }
  const actual = { domains: domainIds.length, components: nComponents, objects: nObjects, metadata: nMetadata };
  const base = baseline.counts;
  const deltas = {};

  for (const k of Object.keys(base)) {
    const b = base[k], a = actual[k] ?? 0;
    deltas[k] = a - b;
    const allowed = Math.ceil(b * tolerance);
    if (a < b - allowed) errors.push(`coverage: ${k} ${a} < baseline ${b} (tolerance ${tolerance})`);
    // Growth beyond tolerance is a warning in additive mode, not an error.
    if (a > b + allowed && tolerance > 0) warnings.push(`coverage: ${k} grew ${a} vs baseline ${b} (net-new)`);
    if (a > b && tolerance === 0) errors.push(`coverage: ${k} ${a} > baseline ${b} but net-new is disabled (tolerance 0)`);
  }

  // In frozen-skeleton mode (tolerance 0) the ID SETS must be identical, not
  // just the counts — catches a rename that keeps the count constant.
  if (tolerance === 0) {
    const curDomains = new Set(domainIds);
    for (const id of baseline.domainIds)
      if (!curDomains.has(id)) errors.push(`coverage: baseline domain "${id}" missing`);
    for (const id of domainIds)
      if (!baseline.domainNames[id]) errors.push(`coverage: domain "${id}" is not in the frozen baseline`);
    for (const id of domainIds) {
      if (!baseline.componentIds[id]) continue;
      const baseSet = new Set(baseline.componentIds[id]);
      for (const c of PRODUCT[id].components || [])
        if (!baseSet.has(c.id)) errors.push(`coverage: ${id} component id "${c.id}" not in frozen baseline`);
      for (const bid of baseline.componentIds[id])
        if (!(PRODUCT[id].components || []).some((c) => c.id === bid))
          errors.push(`coverage: ${id} baseline component "${bid}" missing`);
    }
  }

  return { ok: errors.length === 0, errors, warnings, deltas, actual };
}

// ── Runner ──────────────────────────────────────────────────────────────────

export function runGates(baseline, config, PRODUCT, ENTITIES, { tolerance = 0 } = {}) {
  const results = {
    schema: validateSchema(PRODUCT, ENTITIES),
    integrity: checkIntegrity(PRODUCT, ENTITIES),
    physics: checkPhysics(config, PRODUCT),
    coverage: checkCoverage(baseline, PRODUCT, ENTITIES, { tolerance }),
  };
  const ok = Object.values(results).every((r) => r.ok);
  return { ok, results };
}
