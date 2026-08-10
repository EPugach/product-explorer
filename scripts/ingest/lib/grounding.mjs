// scripts/ingest/lib/grounding.mjs
//
// Programmatic grounding gate (Workstream B, item 4 — the #1 P4 hardening item).
// An LLM-judge verifies EVERY synthesized claim in a domain (NOT a sample — council found,
// and a live run confirmed, that sampling misses specific errors) against the freeze-skeleton
// pipeline's TWO legitimate ground-truth sources:
//   A) the Help-doc chunk retrieved for the domain, and
//   B) the FROZEN committed schema (object/field/relationship names the synthesizer was given).
//
// Conflict semantics (council, 2026-08-09):
//   - GROUNDED     — supported by A or B.
//   - CONTRADICTED — the doc EXPLICITLY conflicts with the claim (doc wins, even if schema
//                    matches). Any contradiction BLOCKS auto-promote.
//   - UNSUPPORTED  — absent from BOTH A and B (genuine invention).
//   - schemaDocMismatch — schema uses a name that DIFFERS from the doc's name for the same
//                    concept (e.g. frozen "Amount" vs doc "CurrentAmount"). Recorded artifact,
//                    NOT counted (pre-existing frozen data; fed to item 5 dev-doc fusion).
//
// Even exhaustive, a clean run does NOT authorize unattended auto-promotion until the gate's
// precision/recall is calibrated — human review stays in-loop (council).

import { chat as defaultChat } from "./gateway.mjs";

export const GROUNDING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["findings", "schemaDocMismatches"],
  properties: {
    findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["claimIndex", "verdict", "source", "evidence"],
        properties: {
          claimIndex: { type: "integer" },
          verdict: { type: "string", enum: ["GROUNDED", "UNSUPPORTED", "CONTRADICTED"] },
          source: { type: "string", enum: ["HELP_DOC", "FROZEN_SCHEMA", "BOTH", "NEITHER"] },
          evidence: { type: "string" },
        },
      },
    },
    schemaDocMismatches: { type: "array", items: { type: "string" } },
  },
};

// Pure, sample-size-agnostic scoring. Any contradiction => blocksPromote.
export function scoreGrounding(findings) {
  const claimsChecked = findings.length;
  const n = (v) => findings.filter((f) => f.verdict === v).length;
  const grounded = n("GROUNDED"), unsupported = n("UNSUPPORTED"), contradicted = n("CONTRADICTED");
  const ratio = claimsChecked ? grounded / claimsChecked : 1;
  let overall;
  if (contradicted > 0) overall = "WEAK";
  else if (ratio >= 0.875) overall = "STRONG";
  else if (ratio >= 0.75) overall = "ADEQUATE";
  else overall = "WEAK";
  return { claimsChecked, grounded, unsupported, contradicted, ratio, overall, blocksPromote: contradicted > 0 };
}

const VERDICTS = new Set(["GROUNDED", "UNSUPPORTED", "CONTRADICTED"]);

// Multi-run CONSENSUS calibration (item 1 — the linchpin). The LLM judge is high-variance:
// the same input can flip a domain between several contradictions and zero across identical runs,
// so a single run is a reliable REVIEW SIGNAL, not a trustworthy AUTO-BLOCKER. Reduce the per-run
// findings arrays it is HANDED to ONE consensus finding per claim: adopt a problem verdict only if
// it REPRODUCES in >= ceil(N/2) runs (CONTRADICTED checked before UNSUPPORTED — it is both more
// severe and the safe/blocking outcome on a tie); otherwise the claim is GROUNDED. Genuine errors
// reproduce; judge noise washes out. The consensus array feeds scoreGrounding UNCHANGED.
//
// `runs` is an array of findings arrays, one per SUCCESSFUL run. Error-filtering and the fail-closed
// quorum are the caller's job (see consensusDomain) — this reducer only tallies what it is given.
// `denomN` is the INTENDED run count the threshold is measured against (defaults to runs.length): a
// contradiction must reproduce in >= ceil(denomN/2) runs. Passing the intended N even when some runs
// errored keeps "reproduced X/N" honest (a lone flag among 2 survivors of 3 is NOT reproduction and
// must not block) and keeps the reported threshold consistent with what is actually applied.
// Each run contributes AT MOST ONE vote per claimIndex (a malformed judge response that double-reports
// a claim can't stuff its own ballot). A washed-out claim carries no borrowed evidence: only a run
// that actually voted the consensus verdict supplies the quote (so a GROUNDED verdict never shows a
// stray contradiction quote, and a CONTRADICTED one always carries a real one for reground). N=1 is
// the identity (ceil(1/2)=1 => one contradiction still blocks — today's behavior).
export function consensusFindings(runs, denomN = runs.length) {
  const threshold = Math.ceil(denomN / 2);
  const byClaim = new Map(); // claimIndex -> { votes, sample: {verdict->finding}, any }
  for (const run of runs) {
    const seen = new Set(); // one vote per claim per run
    for (const f of run || []) {
      if (f?.claimIndex == null || seen.has(f.claimIndex)) continue;
      seen.add(f.claimIndex);
      let e = byClaim.get(f.claimIndex);
      if (!e) { e = { votes: { GROUNDED: 0, UNSUPPORTED: 0, CONTRADICTED: 0 }, sample: {}, any: f }; byClaim.set(f.claimIndex, e); }
      if (VERDICTS.has(f.verdict)) e.votes[f.verdict]++;
      if (!e.sample[f.verdict]) e.sample[f.verdict] = f; // first finding of each verdict — for representative evidence
    }
  }
  const out = [];
  for (const [claimIndex, e] of byClaim) {
    const { votes } = e;
    const verdict = votes.CONTRADICTED >= threshold ? "CONTRADICTED"
      : votes.UNSUPPORTED >= threshold ? "UNSUPPORTED"
      : "GROUNDED";
    const rep = e.sample[verdict]; // only a run that voted the consensus verdict may supply the quote
    out.push({
      claimIndex,
      verdict,
      source: rep ? rep.source : null,
      evidence: rep ? rep.evidence : "",
      claim: e.any.claim,
      ref: e.any.ref,
      votes: { ...votes, runs: denomN },
    });
  }
  out.sort((a, b) => a.claimIndex - b.claimIndex);
  return out;
}

// Fail-CLOSED quorum wrapper around consensusFindings. `runResults` is one entry per attempted run,
// each { findings } on success or { error } on failure. Two independent guards:
//   1. COVERAGE (quorum): require >= ceil(N/2) SUCCESSFUL runs, else the domain is INCONCLUSIVE and
//      the caller must block — never auto-pass a doc audited fewer than a majority of intended times.
//   2. REPRODUCTION: at/above quorum, tally the survivor findings but measure the threshold against the
//      INTENDED N (see consensusFindings). An errored run therefore abstains — a contradiction seen by
//      only a minority of the intended runs washes out whether the shortfall was judge noise OR a gateway
//      error. This is deliberate: below-quorum coverage is already caught by guard 1, so within quorum a
//      non-reproduced flag is correctly treated as noise, and "reproduced X/N" stays honest.
// N defaults to runResults.length (the intended run count).
export function consensusDomain(runResults, N = runResults.length) {
  const okRuns = runResults.filter((r) => !r?.error);
  const runsOk = okRuns.length;
  const runsErrored = N - runsOk;
  if (runsOk < Math.ceil(N / 2)) return { findings: [], runsOk, runsErrored, inconclusive: true };
  // Tally over survivors, but measure reproduction against the INTENDED N (see consensusFindings).
  return { findings: consensusFindings(okRuns.map((r) => r.findings || []), N), runsOk, runsErrored, inconclusive: false };
}

// Every checkable claim in a domain, as an ordered array of { kind, ref, text }.
export function domainClaims(regenData, regenEntities) {
  const claims = [];
  if (regenData?.description) claims.push({ kind: "domain", ref: "description", text: regenData.description });
  (regenData?.dataFlow || []).forEach((s, i) => claims.push({ kind: "dataFlow", ref: `step ${i + 1}`, text: s }));
  for (const c of regenData?.components || []) {
    if (c.desc) claims.push({ kind: "component", ref: `${c.id}.desc`, text: c.desc });
    (c.docs || []).forEach((d, i) => claims.push({ kind: "doc", ref: `${c.id}.docs[${i}]`, text: d }));
  }
  for (const o of regenEntities?.objects || []) {
    if (o.description) claims.push({ kind: "object", ref: o.name, text: o.description });
  }
  for (const m of regenEntities?.metadata || []) {
    if (m.description) claims.push({ kind: "metadata", ref: m.type, text: m.description });
  }
  return claims;
}

// Render the frozen schema (field/relationship names) that object descriptions may cite.
export function frozenSchemaText(regenEntities) {
  const parts = [];
  for (const o of regenEntities?.objects || []) {
    const fields = (o.fields || []).map((f) => f.name).join(", ");
    const rels = (o.relationships || []).map((r) => r.target).join(", ");
    parts.push(`${o.name}: fields[${fields}]${rels ? ` relationships[${rels}]` : ""}`);
  }
  return parts.join("\n");
}

function buildPrompt({ productName, domainName, claims, docChunk, schema }) {
  const numbered = claims.map((c, i) => `${i + 1}. (${c.kind} ${c.ref}) ${c.text}`).join("\n");
  const system =
    `You are an ADVERSARIAL grounding reviewer for AI-synthesized Salesforce product docs. ` +
    `You catch GENUINE invention and factual contradictions — not faithful description of a given schema.\n` +
    `Ground truth has TWO sources: (A) HELP DOC excerpt, (B) FROZEN SCHEMA (object/field/relationship names).\n` +
    `Verify EVERY numbered claim — do NOT sample; return exactly one finding per claim (by claimIndex).\n` +
    `Verdicts:\n` +
    `- GROUNDED: supported by A or B (source HELP_DOC/FROZEN_SCHEMA/BOTH). Object-field enumerations that ` +
    `match the FROZEN SCHEMA are GROUNDED — correct, not a defect.\n` +
    `- CONTRADICTED: the HELP DOC explicitly states something incompatible (doc wins even if schema matches). ` +
    `Watch for wrong named entities (e.g. a claim naming the wrong engine/object/feature vs the doc). Quote the conflict.\n` +
    `- UNSUPPORTED: the claim appears in NEITHER A nor B (source=NEITHER) — genuine invention.\n` +
    `Also list schemaDocMismatches: where the FROZEN SCHEMA uses a name that DIFFERS from the HELP DOC's name ` +
    `for the same concept (e.g. schema "Amount" vs doc "CurrentAmount"). Do NOT count these as verdicts.\n` +
    `Be precise; prefer CONTRADICTED over GROUNDED when the doc names something different for the same thing. ` +
    `Output JSON only, matching the schema.`;
  const prompt =
    `Product: ${productName}\nDomain: ${domainName}\n\n` +
    `CLAIMS TO VERIFY (one finding per number):\n${numbered}\n\n` +
    `(A) HELP DOC excerpt (domain-relevant text used during synthesis):\n<DOC>\n${docChunk}\n</DOC>\n\n` +
    `(B) FROZEN SCHEMA (object/field/relationship names — a legitimate ground-truth source):\n${schema || "(none)"}\n`;
  return { system, prompt };
}

// Judge one domain exhaustively. `chat` is injectable for testing.
export async function groundDomain({ productName, domainName, claims, docChunk, schema, chat = defaultChat, model, maxTokens = 16000 }) {
  const { system, prompt } = buildPrompt({ productName, domainName, claims, docChunk, schema });
  const r = await chat({ model, system, prompt, schema: GROUNDING_SCHEMA, schemaName: "grounding", maxTokens });
  const findings = (r.json?.findings || []).map((f) => ({
    ...f,
    claim: claims[f.claimIndex - 1]?.text ?? `(claim ${f.claimIndex})`,
    ref: claims[f.claimIndex - 1]?.ref,
  }));
  return { findings, schemaDocMismatches: r.json?.schemaDocMismatches || [], usage: r.usage, claimCount: claims.length };
}

export { buildPrompt as _buildPrompt };
