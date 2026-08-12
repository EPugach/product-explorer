# npsp-ai-search Worker

Cloudflare Worker backing the AI search feature across all Product Explorer
products. Every `products/*/config.js` points `aiWorkerUrl` at this same
deployed worker (`https://npsp-ai-search.epug.workers.dev`).

## Contract

- `POST /` — `{ question, systemContext, faqMatches?, searchMatches }` ->
  `{ answer, cached }`. `faqMatches` is accepted but currently unused — no
  client sends it.
- `POST /feedback` — `{ question, rating: "up"|"down", reason?, comment? }`
  -> `{ ok: true }`.

## Model

`@cf/meta/llama-4-scout-17b-16e-instruct` — Meta's Llama 4 Scout (MoE,
131K context window on Cloudflare). `max_tokens: 400`, `temperature: 0.3`.

## Bindings required (confirmed live 2026-08-11 via `wrangler versions view <id> --json`)

| Binding | Type | Purpose |
| --- | --- | --- |
| `AI` | Workers AI | Model inference |
| `CACHE` | KV namespace (`b36b0f495c5b4faab3863a19ddd7d53d`) | Per-IP rate limiting (10 req/min) + 24h answer cache, keyed by SHA-256 of the lowercased question |
| `ALLOWED_ORIGINS` | Plaintext var | `https://epugach.github.io,http://localhost:8000,http://localhost:3000` |
| `SHEETS_LOG_URL` | **Plaintext var** (not a secret — corrected from this file's first draft) | Google Sheets webhook for fire-and-forget answer/feedback logging |

`wrangler.toml` carries `CACHE`'s real namespace id and `ALLOWED_ORIGINS`'
real value — both confirmed safe to commit (an internal resource id and a
CORS allow-list, neither is a credential).

### Open question: SHEETS_LOG_URL is deliberately NOT in wrangler.toml

The live worker stores `SHEETS_LOG_URL` as a plaintext environment variable,
not a Cloudflare secret. Its actual value is a working Google Apps Script
webhook URL (`https://script.google.com/macros/s/.../exec`) — Apps Script
"exec" endpoints are typically callable by anyone who has the URL. This repo
is **public**, so committing that value here would hand write access to the
Sheets log to anyone who reads the repo (spam rows at minimum; worse
depending on what the Apps Script does beyond appending rows).

Two ways to close this out — pick one before this var is ever added to git:

1. **Convert it to a real Cloudflare secret** (`wrangler secret put
   SHEETS_LOG_URL`) — fixes the live worker's own exposure (it currently
   shows in plaintext to anyone with dashboard/API read access, e.g. via
   `wrangler versions view --json`) and lets `wrangler.toml` document the var
   name without ever storing the value in git. Requires a live mutation —
   confirm before running.
2. **Leave it live as-is**, but keep the value out of `wrangler.toml`
   entirely and set it locally only via `.dev.vars` (gitignored) when
   deploying. Doesn't fix the live-side exposure, only keeps it out of git
   history going forward.

## Provenance

Transcribed 2026-08-11 from the Cloudflare dashboard "Edit Code" view, then
cross-checked against the live deployment's bindings via
`wrangler versions view <id> --json` (`CACHE`, `ALLOWED_ORIGINS`,
`SHEETS_LOG_URL`, `AI`, and `compatibility_date: 2024-12-01` all confirmed).
Direct API retrieval of the raw script content (to diff byte-for-byte) was
blocked — the Cloudflare `/workers/scripts/:name/content` endpoint rejects
OAuth-scheme tokens ("Method not allowed for this authentication scheme"),
unlike the metadata/bindings endpoints used above. Confidence in
`src/worker.js`'s fidelity rests on the dashboard "Edit Code" paste itself
being the live source, transcribed line-for-line (only esbuild's cosmetic
`__name`/`__defProp` naming shims were dropped — no behavioral change).

This worker has not been redeployed since 2026-02-28 (8 versions that day,
`last_deployed_from: "wrangler"` on the latest — it was originally deployed
via wrangler from somewhere, then presumably hand-edited in the dashboard
since, though the deployment log shows no further deploys after that day).
If the dashboard is edited directly again after this, re-sync `src/worker.js`
from the dashboard so this doesn't silently drift from what's actually
deployed.

## Deploy

```
npx wrangler deploy
```

Only after confirming the bindings above match the live worker.
