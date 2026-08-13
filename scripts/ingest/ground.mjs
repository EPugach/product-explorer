#!/usr/bin/env node
// scripts/ingest/ground.mjs
//
// Programmatic grounding gate CLI (Workstream B, item 4 — P4 #1). Audits a synthesized
// product (scratch by default, or --committed) domain-by-domain: for each domain it
// retrieves the same Help-doc chunk synthesis used, gathers the regenerated prose, and
// asks an LLM judge to verify claims against Help doc UNION frozen schema (see lib/grounding.mjs).
//
// The LLM judge is HIGH-VARIANCE (item 1 — the linchpin finding): the same input flips a
// domain between several contradictions and zero across identical runs. So a single run is a
// reliable REVIEW SIGNAL, not a trustworthy AUTO-BLOCKER. Pass --runs N (odd, e.g. 3) to run
// each domain N times and take CONSENSUS: a claim is CONTRADICTED only if it reproduces in
// >= ceil(N/2) runs (genuine errors reproduce; judge noise washes out). Any consensus-CONTRADICTED
// claim => exit 1 (blocks promote). Even a clean consensus run is human-in-loop until calibrated.
//
// Usage: node scripts/ingest/ground.mjs <id> [--committed] [--pdf <path>] [--model <id>]
//        [--concurrency N] [--runs N] [--domains a,b,c] [--full-doc] [--out <dir>]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { extractPdfText, splitSections } from "./lib/extract.mjs";
import { retrieveForDomain } from "./synthesize.mjs";
import { groundDomain, scoreGrounding, domainClaims, frozenSchemaText, consensusDomain } from "./lib/grounding.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const log = (...a) => process.stdout.write(a.join(" ") + "\n");

function parseArgs(argv) {
  const a = { concurrency: 4, runs: 1 };
  a.id = argv[2];
  for (let i = 3; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--committed") a.committed = true;
    else if (k === "--pdf") a.pdf = argv[++i];
    else if (k === "--model") a.model = argv[++i];
    else if (k === "--concurrency") a.concurrency = +argv[++i];
    else if (k === "--runs") a.runs = +argv[++i];
    else if (k === "--domains") a.domains = argv[++i].split(",");
    else if (k === "--full-doc") a.fullDoc = true;
    else if (k === "--out") a.out = argv[++i];
  }
  return a;
}

async function importModule(file) {
  return import(pathToFileURL(file).href);
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
  }));
  return out;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.id) { process.stderr.write("usage: ground.mjs <id> [--committed] [--pdf p] [--model m]\n"); process.exit(2); }

  const srcDir = args.committed
    ? path.join(REPO_ROOT, "products", args.id)
    : path.join(HERE, "scratch", args.id);
  const outDir = args.out || srcDir;

  const { PRODUCT } = await importModule(path.join(srcDir, "data.js"));
  const ENTITIES = (await importModule(path.join(srcDir, "entities.js"))).default;
  const config = (await importModule(path.join(REPO_ROOT, "products", args.id, "config.js"))).default;
  const productName = config?.name || args.id;

  // Doc text: prefer a dumped _doctext.txt in the scratch dir, else extract from the PDF.
  let fullText;
  const docTxt = path.join(HERE, "scratch", args.id, "_doctext.txt");
  if (fs.existsSync(docTxt)) fullText = fs.readFileSync(docTxt, "utf8");
  else {
    const pdf = args.pdf || path.join(HERE, "input", `${args.id}.pdf`);
    fullText = extractPdfText(pdf, { layout: true }).text;
  }
  const sections = splitSections(fullText);

  let domainIds = Object.keys(PRODUCT);
  if (args.domains) domainIds = domainIds.filter((d) => args.domains.includes(d));
  if (!Number.isInteger(args.runs) || args.runs < 1) {
    process.stderr.write(`[ground] --runs must be a positive integer (got ${args.runs})\n`); process.exit(2);
  }
  const N = args.runs;
  const threshold = Math.ceil(N / 2);
  if (N > 1 && N % 2 === 0) log(`[ground] note: --runs ${N} is even — a tie (${threshold}/${N}) blocks; an ODD --runs gives a true strict-majority consensus.`);
  log(`[ground] ${args.id} — ${domainIds.length} domains × ${N} run(s)${N > 1 ? ` (consensus ≥${threshold}/${N})` : ""}, model ${args.model || "default"}, doc ${fullText.length} chars`);

  const line = (d) => log(`  ${d.blocksPromote ? "✗" : (d.overall === "STRONG" ? "✓" : "•")} ${d.id}: ${d.overall} (${d.grounded}/${d.claimsChecked}${d.contradicted ? `, ${d.contradicted} CONTRADICTED` : ""})`);
  const nG = (arr) => arr.filter((f) => f.verdict === "GROUNDED").length;

  // --full-doc = full recall (council #5): each domain is judged against the WHOLE doc, so a
  // contradiction whose supporting text lives outside the domain's retrieval chunk is still
  // caught (e.g. a wrong engine name). Done PER DOMAIN (not one giant all-domains call) so each
  // request stays within the gateway timeout even on very large docs — a single all-domains pass
  // over a ~957K-token doc (400+ claims) times out. Lower concurrency in full-doc mode: each call
  // ships the whole doc, so fewer in flight avoids gateway overload.
  const conc = args.fullDoc ? Math.min(args.concurrency, 2) : args.concurrency;

  // Per-domain retrieval inputs are identical across the N runs — compute once.
  const inputs = Object.fromEntries(domainIds.map((id) => [id, {
    docChunk: args.fullDoc ? fullText : retrieveForDomain(sections, fullText, PRODUCT[id], ENTITIES[id]),
    claims: domainClaims(PRODUCT[id], ENTITIES[id]),
    schema: frozenSchemaText(ENTITIES[id]),
  }]));

  // Consensus (item 1): flatten to domainIds × N independent tasks under ONE global concurrency
  // cap (no nested pools — outer×inner would silently blow past `conc`, overloading the gateway on
  // full-doc runs that each ship the whole doc). Then group by domain and reduce to consensus.
  // Domains with nothing to audit (0 claims) never get a gateway task — handled trivially below.
  const tasks = domainIds.filter((id) => inputs[id].claims.length > 0).flatMap((id) => Array.from({ length: N }, (_, r) => ({ id, r })));
  const runResults = await pool(tasks, conc, async ({ id, r }) => {
    const { docChunk, claims, schema } = inputs[id];
    try {
      const { findings, schemaDocMismatches } = await groundDomain({
        productName, domainName: PRODUCT[id].name, claims, docChunk, schema, model: args.model,
      });
      if (N > 1) log(`  · ${id} [run ${r + 1}/${N}]: ${scoreGrounding(findings).overall} (${nG(findings)}/${findings.length})`);
      return { id, findings, schemaDocMismatches };
    } catch (e) {
      log(`  ! ${id} [run ${r + 1}/${N}]: gate error ${String(e).split("\n")[0]}`);
      return { id, findings: [], schemaDocMismatches: [], error: String(e) };
    }
  });

  const perDomain = domainIds.map((id) => {
    const rs = runResults.filter((x) => x.id === id);        // N attempts (empty for a 0-claim domain)
    const schemaDocMismatches = [...new Set(rs.flatMap((x) => x.schemaDocMismatches || []))]; // union across runs
    // A domain with nothing to audit is trivially grounded — no gateway run was spawned for it.
    if (inputs[id].claims.length === 0) {
      const d = { id, name: PRODUCT[id].name, ...scoreGrounding([]), findings: [], schemaDocMismatches, runsOk: 0, runsErrored: 0 };
      line(d); return d;
    }
    // Fail CLOSED: if fewer than the quorum of runs succeeded, the domain is INCONCLUSIVE and blocks
    // (never auto-pass a doc we could not audit ≥threshold times — a flaky gateway must not read as clean).
    const { findings, runsOk, runsErrored, inconclusive } = consensusDomain(rs, N);
    if (inconclusive) {
      const first = String(rs.find((x) => x.error)?.error || "gateway errors").split("\n")[0];
      log(`  ✗ ${id}: INCONCLUSIVE — only ${runsOk}/${N} run(s) succeeded (need ≥${threshold}); blocking (${first}).`);
      return { id, name: PRODUCT[id].name, error: `inconclusive: ${runsOk}/${N} runs succeeded`, findings: [], schemaDocMismatches, contradicted: 0, blocksPromote: true, claimsChecked: 0, grounded: 0, overall: "INCONCLUSIVE", runsOk, runsErrored };
    }
    const d = { id, name: PRODUCT[id].name, ...scoreGrounding(findings), findings, schemaDocMismatches, runsOk, runsErrored };
    line(d);
    if (runsErrored) log(`    ⚠ ${id}: ${runsErrored}/${N} run(s) errored — consensus over ${runsOk} survivor(s).`);
    return d;
  });

  const allFindings = perDomain.flatMap((d) => d.findings || []);
  const agg = scoreGrounding(allFindings);
  const contradictions = perDomain.flatMap((d) => (d.findings || []).filter((f) => f.verdict === "CONTRADICTED").map((f) => ({ domain: d.id, ...f })));
  const mismatches = perDomain.flatMap((d) => (d.schemaDocMismatches || []).map((m) => `[${d.id}] ${m}`));
  const blocksPromote = perDomain.some((d) => d.blocksPromote);
  const inconclusive = perDomain.filter((d) => d.overall === "INCONCLUSIVE").map((d) => d.id);
  // Any un-auditable domain makes the whole run INCONCLUSIVE — never let the grounded-ratio overall
  // (STRONG/ADEQUATE/WEAK) mask a domain we could not audit. Consumers reading aggregate.overall see it too.
  const overallStatus = inconclusive.length ? "INCONCLUSIVE" : agg.overall;

  const report = [
    `# Grounding report — ${args.id} (${args.committed ? "committed" : "scratch"})`,
    ``,
    `- domains audited: **${domainIds.length}**  |  runs per domain: **${N}**${N > 1 ? `  |  consensus threshold: **≥${threshold}/${N}**` : ""}`,
    `- claims checked: **${agg.claimsChecked}**  |  grounded: **${agg.grounded}**  |  unsupported: **${agg.unsupported}**  |  contradicted: **${agg.contradicted}**`,
    `- overall: **${overallStatus}**  |  blocks auto-promote: **${blocksPromote ? "YES" : "no"}**`,
    inconclusive.length ? `- **⚠ INCONCLUSIVE (too few successful runs — re-run before trusting):** ${inconclusive.join(", ")}` : ``,
    ``,
    N > 1
      ? `> Consensus of **${N}** runs — a claim counts as CONTRADICTED only if it reproduced in ≥${threshold} runs (the LLM judge is high-variance; single-run noise washes out). Still a review signal: human stays in-loop until the gate's precision/recall is calibrated.`
      : `> **Single run** — the LLM judge is high-variance; re-run with \`--runs 3\` for a consensus verdict. A clean run does NOT authorize unattended auto-promotion (human review in-loop).`,
    ``,
    `## Contradictions (must fix before adopt)`,
    contradictions.length ? contradictions.map((c) => `- **[${c.domain}]** ${c.claim}${c.votes ? ` _(CONTRADICTED ${c.votes.CONTRADICTED}/${c.votes.runs})_` : ""}\n  - ${c.evidence}`).join("\n") : "_none_",
    ``,
    `## Schema-vs-doc mismatches (pre-existing frozen data — item 5)`,
    mismatches.length ? mismatches.map((m) => `- ${m}`).join("\n") : "_none_",
    ``,
    `## Per-domain`,
    perDomain.map((d) => `- ${d.id}: ${d.overall} (${d.grounded}/${d.claimsChecked}${d.contradicted ? `, ${d.contradicted} contradicted` : ""}${d.runsErrored ? `, ${d.runsErrored}/${N} runs errored` : ""})`).join("\n"),
    ``,
  ].join("\n");

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "grounding-report.md"), report);
  fs.writeFileSync(path.join(outDir, "grounding.json"), JSON.stringify({ id: args.id, runs: N, consensusThreshold: threshold, aggregate: { ...agg, overall: overallStatus }, blocksPromote, inconclusiveDomains: inconclusive, contradictions, schemaDocMismatches: mismatches, perDomain }, null, 2));

  log(`\n[ground] ${args.id}: ${overallStatus} — ${agg.grounded}/${agg.claimsChecked} grounded, ${agg.contradicted} contradicted${N > 1 ? ` (consensus ≥${threshold}/${N})` : ""}. blocksPromote=${blocksPromote}`);
  log(`  report → ${path.relative(REPO_ROOT, path.join(outDir, "grounding-report.md"))}`);
  if (blocksPromote) process.exitCode = 1;
}

const invokedDirectly = typeof process.argv[1] === "string" && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main().catch((e) => { process.stderr.write(`[ground] FATAL: ${e.stack || e.message}\n`); process.exit(1); });
