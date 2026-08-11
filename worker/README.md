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

## Bindings required (must match the live dashboard exactly)

| Binding | Type | Purpose |
| --- | --- | --- |
| `AI` | Workers AI | Model inference |
| `CACHE` | KV namespace | Per-IP rate limiting (10 req/min) + 24h answer cache, keyed by SHA-256 of the lowercased question |
| `ALLOWED_ORIGINS` | Plaintext var | Comma-separated CORS allow-list |
| `SHEETS_LOG_URL` | Secret | Google Sheets webhook for fire-and-forget answer/feedback logging |

`wrangler.toml` has placeholders for `CACHE`'s namespace id and
`ALLOWED_ORIGINS` — fill in the real values from the dashboard before ever
running `wrangler deploy`, or a deploy will adopt the wrong KV store / origin
list instead of the live one.

## Provenance

Transcribed 2026-08-11 from the Cloudflare dashboard "Edit Code" view — this
is the first time this worker has been under version control. No behavior
changes were made. If the dashboard is edited directly again after this,
re-sync `src/worker.js` from the dashboard so this doesn't silently drift
from what's actually deployed.

## Deploy

```
npx wrangler deploy
```

Only after confirming the bindings above match the live worker.
