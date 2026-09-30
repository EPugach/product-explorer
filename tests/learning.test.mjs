// Unit tests for the pure parts of app/js/learning.js (graph + path finder).
// Run: node --test tests/learning.test.mjs   (also part of `npm test`)
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildGraph, shortestPath, hopText } from "../app/js/learning.js";

const DATA = {
  a: { name: "A", connections: [{ planet: "b", desc: "A feeds B" }] },
  b: { name: "B", connections: [{ planet: "c", desc: "B feeds C" }] },
  c: { name: "C", connections: [] },
  d: { name: "D", connections: [{ planet: "ghost", desc: "points at a missing domain" }] },
};

test("graph is undirected and ignores links to unknown domains", () => {
  const g = buildGraph(DATA);
  assert.deepEqual([...g.adj.get("b")].sort(), ["a", "c"]);
  assert.equal(g.adj.has("ghost"), false);
  assert.equal(g.adj.has("d"), false); // its only link was to a missing domain
});

test("shortest path walks connections in either direction", () => {
  const g = buildGraph(DATA);
  assert.deepEqual(shortestPath(g, "a", "c"), ["a", "b", "c"]);
  assert.deepEqual(shortestPath(g, "c", "a"), ["c", "b", "a"]);
  assert.deepEqual(shortestPath(g, "b", "b"), ["b"]);
});

test("unconnected domains return null, not a bogus path", () => {
  const g = buildGraph(DATA);
  assert.equal(shortestPath(g, "a", "d"), null);
});

test("hop text uses the authored sentence, whichever way the hop is walked", () => {
  const g = buildGraph(DATA);
  assert.equal(hopText(g, "a", "b"), "A feeds B");
  assert.equal(hopText(g, "b", "a"), "A feeds B");
});

test("works on every real product's data", async () => {
  const ids = ["npsp", "nonprofitcloud", "revenue", "omnistudio", "educationcloud", "edassh",
    "accountingsubledger", "consumergoods", "lifesciencescloud", "publicsectorsolutions"];
  for (const id of ids) {
    const { PRODUCT } = await import(`../products/${id}/data.js`);
    const g = buildGraph(PRODUCT);
    const keys = Object.keys(PRODUCT);
    // Every path found must be a real chain of adjacent domains with a sentence per hop.
    for (const to of keys.slice(1, 4)) {
      const p = shortestPath(g, keys[0], to);
      if (!p) continue;
      for (let i = 1; i < p.length; i++) {
        assert.ok(g.adj.get(p[i - 1]).has(p[i]), `${id}: ${p[i - 1]}→${p[i]} not adjacent`);
        assert.ok(hopText(g, p[i - 1], p[i]), `${id}: ${p[i - 1]}→${p[i]} has no explanation`);
      }
    }
  }
});
