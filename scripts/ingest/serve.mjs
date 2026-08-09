#!/usr/bin/env node
// scripts/ingest/serve.mjs
//
// Local admin UI for the ingestion pipeline (Workstream B, P3). Zero-dep Node
// server (node:http + child_process). LOCAL ONLY — binds 127.0.0.1, no auth,
// single user. Lets you: see each product's doc freshness + last synth, run a
// synthesis with live progress, review the structured diff, and adopt the
// result into products/<id>/ (the review-gated write).
//
// Run:  node scripts/ingest/serve.mjs   [--port 8940]
// Then open http://127.0.0.1:8940/

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const SCRATCH = path.join(HERE, "scratch");
const INPUT = path.join(HERE, "input");
const PRODUCTS_DIR = path.join(REPO_ROOT, "products");

const argPort = process.argv.indexOf("--port");
const PORT = argPort !== -1 ? parseInt(process.argv[argPort + 1], 10) : 8940;

// Guard against concurrent same-product runs (EventSource can reconnect).
const running = new Set();

async function loadManifest() {
  const mod = await import(pathToFileURL(path.join(PRODUCTS_DIR, "manifest.js")).href);
  return mod.PRODUCTS || [];
}

function readJsonSafe(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
}

function productStatus(prod) {
  const id = prod.id;
  const pdf = path.join(INPUT, `${id}.pdf`);
  const prov = readJsonSafe(path.join(SCRATCH, id, "provenance.json"));
  return {
    id,
    name: prod.name,
    fullName: prod.fullName,
    hasPdf: fs.existsSync(pdf),
    pdfSize: fs.existsSync(pdf) ? fs.statSync(pdf).size : 0,
    hasScratch: !!prov,
    lastSynth: prov?.generatedAt || null,
    gatesOk: prov?.gates?.ok ?? null,
    driftCount: prov?.diff?.structuralDriftCount ?? null,
    model: prov?.model || null,
    diff: prov?.diff || null,
  };
}

// ── tiny response helpers ──
const send = (res, code, body, type = "text/plain; charset=utf-8") => {
  res.writeHead(code, { "content-type": type });
  res.end(body);
};
const sendJson = (res, obj, code = 200) => send(res, code, JSON.stringify(obj), "application/json");

function serveSse(req, res, id) {
  if (!id) return sendJson(res, { error: "id required" }, 400);
  if (running.has(id)) return sendJson(res, { error: `already running: ${id}` }, 409);
  const pdf = path.join(INPUT, `${id}.pdf`);
  if (!fs.existsSync(pdf)) return sendJson(res, { error: `no PDF staged at input/${id}.pdf` }, 400);

  running.add(id);
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
  });
  const ev = (type, data) => res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
  ev("start", { id });

  const child = spawn(process.execPath, [path.join(HERE, "synthesize.mjs"), id], {
    cwd: REPO_ROOT,
    env: process.env,
  });
  let buf = "";
  const pump = (chunk) => {
    buf += chunk.toString();
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const line of lines) if (line.trim()) ev("log", { line });
  };
  child.stdout.on("data", pump);
  child.stderr.on("data", (c) => {
    // synthesize logs progress on stdout; stderr is warnings/errors + the TLS notice
    const s = c.toString();
    if (!/NODE_TLS_REJECT|trace-warnings/.test(s)) for (const line of s.split("\n")) if (line.trim()) ev("log", { line: line });
  });
  child.on("close", (code) => {
    if (buf.trim()) ev("log", { line: buf });
    running.delete(id);
    const prov = readJsonSafe(path.join(SCRATCH, id, "provenance.json"));
    ev("done", { code, ok: code === 0, provenance: prov });
    res.end();
  });
  req.on("close", () => {
    if (!child.killed) child.kill();
    running.delete(id);
  });
}

function adopt(id, res) {
  const dir = path.join(SCRATCH, id);
  const prov = readJsonSafe(path.join(dir, "provenance.json"));
  if (!prov) return sendJson(res, { error: `no synthesis output for ${id}` }, 400);
  if (!prov.gates?.ok) return sendJson(res, { error: `gates did not pass for ${id}; refusing to adopt` }, 400);
  if ((prov.diff?.structuralDriftCount ?? 0) > 0) return sendJson(res, { error: `structural drift detected; refusing to adopt` }, 400);
  const files = ["data.js", "entities.js", "ai-context.js"];
  for (const f of files) {
    const src = path.join(dir, f);
    if (!fs.existsSync(src)) return sendJson(res, { error: `missing ${f} in scratch` }, 400);
  }
  for (const f of files) fs.copyFileSync(path.join(dir, f), path.join(PRODUCTS_DIR, id, f));
  sendJson(res, { ok: true, id, adopted: files, note: "Copied to products/. Review `git diff` + the diff-report, then commit + coordinate a cache-version bump before deploy." });
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (u.pathname === "/" || u.pathname === "/index.html") {
      return send(res, 200, fs.readFileSync(path.join(HERE, "ui.html"), "utf8"), "text/html; charset=utf-8");
    }
    if (u.pathname === "/api/products") {
      const manifest = await loadManifest();
      return sendJson(res, manifest.map(productStatus));
    }
    if (u.pathname === "/api/diff") {
      const p = path.join(SCRATCH, u.searchParams.get("id") || "", "diff-report.md");
      return fs.existsSync(p) ? send(res, 200, fs.readFileSync(p, "utf8"), "text/markdown; charset=utf-8") : send(res, 404, "no diff yet");
    }
    if (u.pathname === "/api/provenance") {
      const p = path.join(SCRATCH, u.searchParams.get("id") || "", "provenance.json");
      return fs.existsSync(p) ? send(res, 200, fs.readFileSync(p, "utf8"), "application/json") : send(res, 404, "{}");
    }
    if (u.pathname === "/api/synthesize") {
      return serveSse(req, res, u.searchParams.get("id"));
    }
    if (u.pathname === "/api/adopt" && req.method === "POST") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        let id;
        try { id = JSON.parse(body).id; } catch { return sendJson(res, { error: "bad body" }, 400); }
        adopt(id, res);
      });
      return;
    }
    send(res, 404, "not found");
  } catch (err) {
    send(res, 500, `error: ${err.message}`);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  process.stdout.write(`\n  Ingest admin UI → http://127.0.0.1:${PORT}/\n  (local only; Ctrl-C to stop)\n\n`);
});
