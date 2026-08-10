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
