// scripts/ingest/lib/baseline.mjs
//
// Loads a committed product's data files and derives the IMMUTABLE-ID registry.
//
// The council's decisive constraint for ingestion: existing domain IDs,
// component IDs, entity object names, and the connection graph are FIXED —
// regenerating them breaks hardcoded UI refs, connections, and (critically)
// the galaxy physics config in config.js, which is keyed by domain ID. This
// module produces the registry that synthesis takes as frozen input and that
// the gates check against.

import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..", ".."); // scripts/ingest/lib -> repo root

/** Load a product's config (default), data (PRODUCT), entities (default). */
export async function loadProduct(id, { root = REPO_ROOT } = {}) {
  const dir = path.join(root, "products", id);
  const imp = async (name) => import(pathToFileURL(path.join(dir, name)).href);
  const config = (await imp("config.js")).default;
  const { PRODUCT } = await imp("data.js");
  const ENTITIES = (await imp("entities.js")).default;
  return { config, PRODUCT, ENTITIES };
}

/**
 * Derive the immutable-ID registry from the three parsed structures.
 * Everything here is a hard constraint that synthesis must preserve verbatim.
 */
export function buildRegistry(config, PRODUCT, ENTITIES) {
  const domainIds = Object.keys(PRODUCT);
  const domainNames = {};
  const componentIds = {};
  const allComponentIds = new Set();
  const objectNames = {};
  const allObjectNames = new Set();
  const metadataTypes = {};
  const connectionGraph = {};

  for (const id of domainIds) {
    const d = PRODUCT[id];
    domainNames[id] = d.name;
    componentIds[id] = (d.components || []).map((c) => c.id);
    for (const cid of componentIds[id]) allComponentIds.add(cid);
    connectionGraph[id] = (d.connections || []).map((c) => c.planet);

    const e = ENTITIES[id] || {};
    objectNames[id] = (e.objects || []).map((o) => o.name);
    for (const n of objectNames[id]) allObjectNames.add(n);
    metadataTypes[id] = (e.metadata || []).map((m) => m.type);
  }

  // Galaxy physics is keyed by domain ID across four parallel maps.
  const physics = config.physics || {};
  const physicsKeys = {
    weights: Object.keys(physics.weights || {}),
    groups: Object.keys(physics.groups || {}),
    seeds: Object.keys(physics.seeds || {}),
  };

  let nComponents = 0;
  for (const id of domainIds) nComponents += componentIds[id].length;
  let nObjects = 0;
  let nMetadata = 0;
  for (const id of domainIds) {
    nObjects += objectNames[id].length;
    nMetadata += metadataTypes[id].length;
  }

  return {
    productId: config.id,
    domainIds,
    domainNames,
    componentIds,
    allComponentIds,
    objectNames,
    allObjectNames,
    metadataTypes,
    connectionGraph,
    physicsKeys,
    counts: {
      domains: domainIds.length,
      components: nComponents,
      objects: nObjects,
      metadata: nMetadata,
    },
    // config.stats is what the UI + manifest advertise; kept for the coverage gate.
    stats: config.stats || {},
  };
}

/** Convenience: load + build registry in one call. */
export async function loadRegistry(id, opts) {
  const { config, PRODUCT, ENTITIES } = await loadProduct(id, opts);
  return { registry: buildRegistry(config, PRODUCT, ENTITIES), config, PRODUCT, ENTITIES };
}
