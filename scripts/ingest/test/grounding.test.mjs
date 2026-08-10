// node --test scripts/ingest/test/grounding.test.mjs
//
// Pure-logic tests for the grounding gate's scoring + claim/schema extraction.
// The LLM-judge call itself is integration (validated by running ground.mjs against a
// known contradiction); here we lock the council-hardened SCORING semantics.

import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreGrounding, domainClaims, frozenSchemaText } from "../lib/grounding.mjs";

const g = (v, source = "HELP_DOC") => ({ claim: "c", verdict: v, source, evidence: "e" });

test("all grounded => STRONG, does not block promote", () => {
  const s = scoreGrounding(Array.from({ length: 8 }, () => g("GROUNDED")));
  assert.equal(s.overall, "STRONG");
  assert.equal(s.blocksPromote, false);
});

test("a single CONTRADICTED forces WEAK and blocks promote (doc wins)", () => {
  const findings = [...Array.from({ length: 7 }, () => g("GROUNDED")), g("CONTRADICTED")];
  const s = scoreGrounding(findings);
  assert.equal(s.overall, "WEAK");
  assert.equal(s.blocksPromote, true, "any contradiction blocks auto-promote");
});

test("schema-sourced grounding counts as grounded (freeze-skeleton is legitimate)", () => {
  const s = scoreGrounding(Array.from({ length: 8 }, () => g("GROUNDED", "FROZEN_SCHEMA")));
  assert.equal(s.overall, "STRONG");
});

test("6/8 grounded, 0 contradicted => ADEQUATE; 5/8 => WEAK", () => {
  const mk = (nG) => [...Array.from({ length: nG }, () => g("GROUNDED")), ...Array.from({ length: 8 - nG }, () => g("UNSUPPORTED"))];
  assert.equal(scoreGrounding(mk(6)).overall, "ADEQUATE");
  assert.equal(scoreGrounding(mk(5)).overall, "WEAK");
  assert.equal(scoreGrounding(mk(6)).blocksPromote, false, "unsupported (not contradicted) does not block");
});

test("domainClaims enumerates every checkable claim (no sampling)", () => {
  const data = { description: "Domain desc", dataFlow: ["step A"], components: [{ id: "c1", name: "C1", desc: "comp desc", docs: ["para one"] }] };
  const ent = { objects: [{ name: "Obj1", description: "obj desc", fields: [], relationships: [] }] };
  const claims = domainClaims(data, ent);
  const texts = claims.map((c) => c.text);
  assert.ok(Array.isArray(claims));
  assert.deepEqual(texts, ["Domain desc", "step A", "comp desc", "para one", "obj desc"]);
  assert.equal(claims.find((c) => c.kind === "object").ref, "Obj1");
});

test("frozenSchemaText renders object field + relationship names", () => {
  const ent = { objects: [{ name: "Acct", fields: [{ name: "Amount" }, { name: "GiftDate" }], relationships: [{ target: "Contact" }] }] };
  const s = frozenSchemaText(ent);
  assert.match(s, /Acct: fields\[Amount, GiftDate\] relationships\[Contact\]/);
});
