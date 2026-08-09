// scripts/ingest/lib/gateway.mjs
//
// Zero-dependency client for the Salesforce Express LLM gateway, targeting the
// OpenAI-compatible /chat/completions endpoint with strict json_schema output.
//
// Why not reuse bin/llm-gateway.mjs (the vault's helper)? That one hits the
// Anthropic /v1/messages shape with string-only content and no structured
// output. Synthesis needs response_format: json_schema (strict) so the model is
// forced to emit shape-valid data at generation time — the objective schema
// gate, enforced up front. Same gateway, same SFR_EXPRESS_KEY, no new spend.
//
// Auth: SFR_EXPRESS_KEY from env, else the canonical .env fallback (matching
// bin/llm-gateway.mjs).
//
// Corp TLS: the SFDC internal CA isn't in Node's trust store. We set
// NODE_TLS_REJECT_UNAUTHORIZED=0 if unset — the established convention on this
// box (bin/llm-gateway.mjs, council). Scoped to this dev-only tool; document if
// rotating to NODE_EXTRA_CA_CERTS.

import fs from "node:fs";

const CHAT_URL =
  "https://eng-ai-model-gateway.sfproxy.devx-preprod.aws-esvc1-useast2.aws.sfdc.cl/chat/completions";
const ENV_FALLBACK = "C:\\SFProjects\\20-projects\\sf-api-gateway\\.env";
const DEFAULT_MODEL = "gpt-5.6-sol"; // 1.05M ctx, json_schema, reasoning — fits the whole doc
const DEFAULT_TIMEOUT_MS = 180_000;

let _key = null;
function getKey() {
  if (_key) return _key;
  if (process.env.SFR_EXPRESS_KEY) return (_key = process.env.SFR_EXPRESS_KEY);
  if (fs.existsSync(ENV_FALLBACK)) {
    for (const line of fs.readFileSync(ENV_FALLBACK, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*SFR_EXPRESS_KEY\s*=\s*(.+?)\s*$/);
      if (m) return (_key = m[1].replace(/^["'](.*)["']$/, "$1"));
    }
  }
  throw new Error(`SFR_EXPRESS_KEY not set (env or ${ENV_FALLBACK})`);
}

function ensureTls() {
  if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

/**
 * One chat completion. Pass `schema` (a JSON Schema object) to force strict
 * json_schema output; the parsed object is returned as `.json`.
 *
 * @param {object} o
 * @param {string} [o.model]
 * @param {string} [o.system]
 * @param {string} o.prompt
 * @param {object} [o.schema]      JSON Schema for response_format json_schema
 * @param {string} [o.schemaName]  name for the json_schema (default "output")
 * @param {number} [o.maxTokens]
 * @param {number} [o.temperature] OMITTED by default. Reasoning models
 *        (gpt-5.6-sol) reject any value but their default (1); only pass this
 *        for models that support it (opus/sonnet/haiku) when you want temp 0.
 * @param {number} [o.timeoutMs]
 * @returns {Promise<{text:string, json:any|null, finish:string, usage:object, latencyMs:number, model:string}>}
 */
export async function chat(o) {
  const {
    model = DEFAULT_MODEL,
    system,
    prompt,
    schema,
    schemaName = "output",
    maxTokens = 16000,
    temperature,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = o;
  if (!prompt) throw new Error("chat: prompt required");
  ensureTls();
  const key = getKey();

  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  const payload = { model, messages, max_completion_tokens: maxTokens };
  if (typeof temperature === "number") payload.temperature = temperature;
  if (schema) {
    payload.response_format = {
      type: "json_schema",
      json_schema: { name: schemaName, schema, strict: true },
    };
  }

  const ac = new AbortController();
  const tm = setTimeout(() => ac.abort(), timeoutMs);
  const start = Date.now();
  let res;
  try {
    res = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(payload),
      signal: ac.signal,
    });
  } catch (err) {
    if (err.name === "AbortError") throw new Error(`chat: timeout after ${timeoutMs}ms`);
    throw new Error(`chat: network error: ${err.message}`);
  } finally {
    clearTimeout(tm);
  }
  const latencyMs = Date.now() - start;
  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = raw?.error?.message || raw?.message || res.statusText;
    throw new Error(`chat: HTTP ${res.status} ${detail} (${latencyMs}ms)`);
  }

  const choice = raw?.choices?.[0] || {};
  const text = choice.message?.content ?? "";
  const finish = choice.finish_reason ?? "?";
  let json = null;
  if (schema) {
    try { json = JSON.parse(text); }
    catch { throw new Error(`chat: response was not valid JSON despite json_schema (finish=${finish}, ${text.length} chars)`); }
  }
  return { text, json, finish, usage: raw.usage || {}, latencyMs, model: raw.model || model };
}

// CLI smoke test: node scripts/ingest/lib/gateway.mjs --probe [--model <id>]
import { pathToFileURL } from "node:url";
const invokedDirectly =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  const args = process.argv.slice(2);
  const model = args.includes("--model") ? args[args.indexOf("--model") + 1] : DEFAULT_MODEL;
  if (args.includes("--probe")) {
    // Structured-output probe: forces json_schema so we confirm the whole path.
    const schema = {
      type: "object",
      additionalProperties: false,
      required: ["ok", "product"],
      properties: { ok: { type: "boolean" }, product: { type: "string" } },
    };
    const r = await chat({
      model,
      prompt: 'Return {"ok":true,"product":"nonprofitcloud"} exactly.',
      schema,
      maxTokens: 200,
    });
    process.stdout.write(
      JSON.stringify({ ok: true, model: r.model, finish: r.finish, json: r.json, latencyMs: r.latencyMs, usage: r.usage }, null, 2) + "\n",
    );
  } else {
    process.stderr.write("Usage: node gateway.mjs --probe [--model <id>]\n");
    process.exit(2);
  }
}
