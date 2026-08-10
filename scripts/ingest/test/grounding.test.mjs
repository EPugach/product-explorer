// node --test scripts/ingest/test/grounding.test.mjs
//
// Pure-logic tests for the grounding gate's scoring + claim/schema extraction.
// The LLM-judge call itself is integration (validated by running ground.mjs against a
// known contradiction); here we lock the council-hardened SCORING semantics.

import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreGrounding, domainClaims, frozenSchemaText, consensusFindings, consensusDomain } from "../lib/grounding.mjs";

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

// ── Multi-run CONSENSUS calibration (item 1, the linchpin) ─────────────────────
// The LLM judge is high-variance: the same input flips a domain between ~5 contradictions
// and 0 across identical runs. consensusFindings() reduces N raw run-findings to ONE finding
// per claim, counting a problem verdict only if it REPRODUCES in >= ceil(N/2) runs — genuine
// errors reproduce, judge noise washes out. The consensus array feeds the existing scoreGrounding.

// One finding within one run. claimIndex is the stable per-domain identity across runs.
const f = (claimIndex, verdict, extra = {}) => ({
  claimIndex,
  verdict,
  source: verdict === "UNSUPPORTED" ? "NEITHER" : "HELP_DOC",
  evidence: `ev-${claimIndex}-${verdict}`,
  claim: `claim ${claimIndex}`,
  ref: `r${claimIndex}`,
  ...extra,
});

test("consensus N=1 is the identity: a single run's verdicts pass through unchanged", () => {
  const run = [f(1, "GROUNDED"), f(2, "CONTRADICTED"), f(3, "UNSUPPORTED")];
  const c = consensusFindings([run]);
  assert.deepEqual(c.map((x) => x.verdict), ["GROUNDED", "CONTRADICTED", "UNSUPPORTED"]);
  // ceil(1/2)=1, so one contradiction still blocks — exactly today's single-run behavior.
  assert.equal(scoreGrounding(c).blocksPromote, true);
});

test("consensus: a contradiction in only 1 of 3 runs washes out to GROUNDED (does not block)", () => {
  const c = consensusFindings([[f(1, "CONTRADICTED")], [f(1, "GROUNDED")], [f(1, "GROUNDED")]]);
  assert.equal(c.length, 1);
  assert.equal(c[0].verdict, "GROUNDED");
  assert.equal(scoreGrounding(c).blocksPromote, false, "non-reproduced contradiction must not block");
});

test("consensus: a contradiction reproduced in 2 of 3 runs blocks; evidence comes from a contradicting run", () => {
  const c = consensusFindings([
    [f(1, "CONTRADICTED", { evidence: "doc says Data Processing Engine not document" })],
    [f(1, "GROUNDED", { evidence: "looked fine" })],
    [f(1, "CONTRADICTED", { evidence: "doc says Data Processing Engine not document (again)" })],
  ]);
  assert.equal(c[0].verdict, "CONTRADICTED");
  assert.equal(scoreGrounding(c).blocksPromote, true);
  assert.match(c[0].evidence, /Data Processing Engine/, "evidence must come from a run that voted CONTRADICTED");
});

test("consensus: each finding carries a vote breakdown with the run count", () => {
  const c = consensusFindings([[f(1, "CONTRADICTED")], [f(1, "GROUNDED")], [f(1, "CONTRADICTED")]]);
  assert.deepEqual(c[0].votes, { GROUNDED: 1, UNSUPPORTED: 0, CONTRADICTED: 2, runs: 3 });
});

test("consensus: UNSUPPORTED reproduced in 2 of 3 => UNSUPPORTED; 1 of 3 washes out to GROUNDED", () => {
  const reproduced = consensusFindings([[f(1, "UNSUPPORTED")], [f(1, "UNSUPPORTED")], [f(1, "GROUNDED")]]);
  assert.equal(reproduced[0].verdict, "UNSUPPORTED");
  assert.equal(scoreGrounding(reproduced).blocksPromote, false, "unsupported never blocks");
  const noise = consensusFindings([[f(1, "UNSUPPORTED")], [f(1, "GROUNDED")], [f(1, "GROUNDED")]]);
  assert.equal(noise[0].verdict, "GROUNDED");
});

test("consensus: CONTRADICTED wins over UNSUPPORTED when both reach threshold (severe + safe)", () => {
  // N=4, threshold=2: contradicted 2, unsupported 2 — the tie resolves to the blocking verdict.
  const c = consensusFindings([[f(1, "CONTRADICTED")], [f(1, "CONTRADICTED")], [f(1, "UNSUPPORTED")], [f(1, "UNSUPPORTED")]]);
  assert.equal(c[0].verdict, "CONTRADICTED");
});

test("consensus N=5: threshold is 3 (2 of 5 washes out, 3 of 5 blocks)", () => {
  const two = consensusFindings([[f(1, "CONTRADICTED")], [f(1, "CONTRADICTED")], [f(1, "GROUNDED")], [f(1, "GROUNDED")], [f(1, "GROUNDED")]]);
  assert.equal(two[0].verdict, "GROUNDED");
  const three = consensusFindings([[f(1, "CONTRADICTED")], [f(1, "CONTRADICTED")], [f(1, "CONTRADICTED")], [f(1, "GROUNDED")], [f(1, "GROUNDED")]]);
  assert.equal(three[0].verdict, "CONTRADICTED");
});

test("consensus: an empty run (judge returned nothing) contributes no votes; denominator = runs given", () => {
  // consensusFindings reduces the runs it is HANDED (error-filtering/quorum is consensusDomain's job).
  // An empty findings array is a run with zero votes — it still counts toward the denominator.
  const c = consensusFindings([[f(1, "CONTRADICTED")], [f(1, "CONTRADICTED")], []]);
  assert.deepEqual(c[0].votes, { GROUNDED: 0, UNSUPPORTED: 0, CONTRADICTED: 2, runs: 3 });
  assert.equal(c[0].verdict, "CONTRADICTED"); // 2 of 3 >= ceil(3/2)
});

test("consensus: a duplicate claimIndex within ONE run counts as a single vote", () => {
  // A malformed judge response double-reports claim 1; it must not stuff the ballot for its run.
  const c = consensusFindings([[f(1, "CONTRADICTED"), f(1, "CONTRADICTED")], [f(1, "GROUNDED")], [f(1, "GROUNDED")]]);
  assert.equal(c[0].votes.CONTRADICTED, 1, "one run = at most one vote per claim");
  assert.equal(c[0].verdict, "GROUNDED", "1 of 3 washes out despite the in-run duplicate");
});

test("consensus: a washed-out verdict with no supporting run carries no borrowed evidence", () => {
  // 1 CONTRADICTED + 1 UNSUPPORTED at N=3 => neither reaches 2 => GROUNDED, but no run voted GROUNDED.
  const c = consensusFindings([[f(1, "CONTRADICTED")], [f(1, "UNSUPPORTED")], []]);
  assert.equal(c[0].verdict, "GROUNDED");
  assert.equal(c[0].evidence, "", "must not present a contradiction quote on a GROUNDED verdict");
});

test("consensus: findings are ordered by claimIndex and preserve claim text", () => {
  const c = consensusFindings([[f(3, "GROUNDED"), f(1, "GROUNDED"), f(2, "UNSUPPORTED")]]);
  assert.deepEqual(c.map((x) => x.claimIndex), [1, 2, 3]);
  assert.equal(c[0].claim, "claim 1");
});

// ── consensusDomain: quorum policy (fail CLOSED on gateway errors) ─────────────
// The blocker gate must never auto-pass a domain it could not audit. consensusDomain requires
// a quorum of SUCCESSFUL runs (>= ceil(N/2)); below that the domain is INCONCLUSIVE (the caller
// blocks). Above it, consensus runs over the survivors only — an errored run never dilutes the
// tally into a false GROUNDED.
const ok = (findings) => ({ findings });
const err = (msg = "network") => ({ error: msg });

test("consensusDomain: fewer than ceil(N/2) successful runs => INCONCLUSIVE (fail closed)", () => {
  // N=5, 3 errored, 2 ok both CONTRADICTED — old denominator=N logic would wash to GROUNDED (fail open).
  const r = consensusDomain([ok([f(1, "CONTRADICTED")]), ok([f(1, "CONTRADICTED")]), err(), err(), err()], 5);
  assert.equal(r.inconclusive, true);
  assert.equal(r.runsOk, 2);
  assert.equal(r.runsErrored, 3);
});

test("consensusDomain: quorum met => a contradiction reproduced across survivors still blocks", () => {
  // N=3, 1 errored, 2 survivors both CONTRADICTED => quorum(2) met; threshold ceil(3/2)=2; the flag
  // reproduced in 2 of the intended 3 runs (2>=2) => CONTRADICTED.
  const r = consensusDomain([ok([f(1, "CONTRADICTED")]), ok([f(1, "CONTRADICTED")]), err()], 3);
  assert.equal(r.inconclusive, false);
  assert.equal(r.runsOk, 2);
  assert.equal(r.findings[0].verdict, "CONTRADICTED");
});

test("consensusDomain: no errors => plain consensus over all N", () => {
  const r = consensusDomain([ok([f(1, "CONTRADICTED")]), ok([f(1, "GROUNDED")]), ok([f(1, "GROUNDED")])], 3);
  assert.equal(r.inconclusive, false);
  assert.equal(r.runsErrored, 0);
  assert.equal(r.findings[0].verdict, "GROUNDED"); // 1 of 3 washes out
});

test("consensusDomain: threshold measured against INTENDED N, not survivors (no block at 1/2)", () => {
  // N=3, 1 errored, survivors split 1 CONTRADICTED / 1 GROUNDED. Quorum (2) met, but a single flag
  // among survivors is NOT reproduction: threshold is ceil(3/2)=2, so it must stay GROUNDED — never
  // block at "1 of 2". votes.runs reports the intended denominator (3), matching the advertised X/N.
  const r = consensusDomain([ok([f(1, "CONTRADICTED")]), ok([f(1, "GROUNDED")]), err()], 3);
  assert.equal(r.inconclusive, false);
  assert.equal(r.findings[0].verdict, "GROUNDED");
  assert.equal(r.findings[0].votes.runs, 3, "denominator is the intended N, not the survivor count");
});
