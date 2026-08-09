// node --test scripts/ingest/test/gates.test.mjs
//
// Golden + negative tests for the ingestion gates. The committed Nonprofit
// Cloud data is the known-good fixture: it must PASS every gate. Deliberately
// corrupted copies must FAIL — a gate that never rejects is worthless.

import { test } from "node:test";
import assert from "node:assert/strict";
import { loadRegistry } from "../lib/baseline.mjs";
import {
  runGates, validateSchema, checkIntegrity, checkCoverage, checkPhysics,
} from "../lib/gates.mjs";

const ID = "nonprofitcloud";

test("baseline registry counts match config.stats", async () => {
  const { registry, config } = await loadRegistry(ID);
  assert.equal(registry.counts.domains, config.stats.domains, "domains");
  assert.equal(registry.counts.components, config.stats.components, "components");
  assert.equal(registry.counts.objects, config.stats.objects, "objects");
  assert.equal(registry.counts.metadata, config.stats.metadata, "metadata");
});

test("committed data passes ALL gates (tolerance 0)", async () => {
  const { registry, config, PRODUCT, ENTITIES } = await loadRegistry(ID);
  const { ok, results } = runGates(registry, config, PRODUCT, ENTITIES, { tolerance: 0 });
  assert.equal(results.schema.errors.length, 0, "schema: " + results.schema.errors.slice(0, 3).join(" | "));
  assert.equal(results.integrity.errors.length, 0, "integrity: " + results.integrity.errors.slice(0, 3).join(" | "));
  assert.equal(results.physics.errors.length, 0, "physics: " + results.physics.errors.slice(0, 3).join(" | "));
  assert.equal(results.coverage.errors.length, 0, "coverage: " + results.coverage.errors.slice(0, 3).join(" | "));
  assert.ok(ok, "all gates pass");
});

test("integrity: a dangling connection planet is caught", async () => {
  const { PRODUCT, ENTITIES } = await loadRegistry(ID);
  const bad = structuredClone(PRODUCT);
  bad.constituents.connections.push({ planet: "does_not_exist", desc: "bogus" });
  const r = checkIntegrity(bad, ENTITIES);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("does_not_exist")), "reports the dangling planet");
});

test("coverage (frozen): a renamed component id is caught even at constant count", async () => {
  const { registry, PRODUCT, ENTITIES } = await loadRegistry(ID);
  const bad = structuredClone(PRODUCT);
  bad.constituents.components[0].id = "renamed-id"; // same count, different id
  const r = checkCoverage(registry, bad, ENTITIES, { tolerance: 0 });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("renamed-id") || e.includes("missing")), "reports the id drift");
});

test("coverage (frozen): a dropped domain is caught", async () => {
  const { registry, PRODUCT, ENTITIES } = await loadRegistry(ID);
  const bad = structuredClone(PRODUCT);
  delete bad.grantmaking;
  const rC = checkCoverage(registry, bad, ENTITIES, { tolerance: 0 });
  assert.equal(rC.ok, false, "coverage flags the missing domain");
});

test("physics: a stale/missing physics key is caught", async () => {
  const { config, PRODUCT } = await loadRegistry(ID);
  const badCfg = structuredClone(config);
  delete badCfg.physics.weights.grantmaking;
  const r = checkPhysics(badCfg, PRODUCT);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("grantmaking")), "reports the missing physics key");
});

test("schema: a component missing required fields is caught", async () => {
  const { PRODUCT, ENTITIES } = await loadRegistry(ID);
  const bad = structuredClone(PRODUCT);
  bad.constituents.components.push({ name: "No Id Component" }); // missing id/icon/desc/...
  const r = validateSchema(bad, ENTITIES);
  assert.equal(r.ok, false);
  assert.ok(r.errors.length > 0, "reports schema errors");
});
