# AI Search: How It Works and How to Update It

## What Is This?

The Product Explorer has an AI-powered search feature. When someone types a question (like "What is TDTM?"), it sends the question to a small AI model (Llama 3.1) running on Cloudflare's servers. The AI reads a "cheat sheet" about NPSP and answers based on that.

That cheat sheet is the file `products/npsp/ai-context.js`. It contains a compressed summary of all the NPSP knowledge: domains, components, Apex classes, LWCs, custom objects, triggers, and data flows.

## When to Regenerate

Regenerate the AI context whenever you update the product data files:

- `products/npsp/data.js` (domains, components, descriptions)
- `products/npsp/entities.js` (Apex classes, LWCs, objects, triggers)
- `products/npsp/config.js` (product metadata)

If you don't regenerate after changing these files, the AI will answer based on old information.

## How to Regenerate (3 Steps)

### Step 1: Open a terminal

Open a terminal and navigate to the project folder:

```
cd ~/projects/product-explorer
```

### Step 2: Run the generator

```
node scripts/generate-ai-context.mjs npsp
```

You should see output like:

```
Generated /home/pai/projects/product-explorer/products/npsp/ai-context.js
18 domains, 55 components
534 classes, 122 LWCs, 64 objects, 26 triggers
~53,685 chars, ~13,421 tokens
```

If you see a warning about exceeding 16K tokens, the context may be too large and answer quality could suffer. Ask Pai for help trimming it.

### Step 3: Bump the cache version

After regenerating, you need to bump the `?v=N` number so browsers load the new file instead of a cached old one.

In these two files, find all `?v=13` and change to `?v=14` (or whatever the next number is):

- `app/js/main.js`
- `npsp/index.html`

Or just ask Pai to do it: "Bump the cache version in product-explorer."

### Then push to GitHub

```
git add products/npsp/ai-context.js app/js/main.js npsp/index.html
git commit -m "chore: regenerate AI context with latest data"
git push
```

The site updates automatically via GitHub Pages.

## How the AI Search Works (Overview)

```
User types a question
        |
        v
Browser runs MiniSearch (local fuzzy search)
        |
        v
If it looks like a question, browser sends to Cloudflare Worker:
  - The question
  - The AI context (cheat sheet)
  - Top 5 search matches
  - Top 3 FAQ matches (if any)
        |
        v
Cloudflare Worker sends it all to Llama 3.1 8B
        |
        v
AI generates an answer (cached for 24 hours)
        |
        v
Answer shown in the search dropdown
```

## Key Files

| File | What It Does |
|------|-------------|
| `products/npsp/ai-context.js` | The AI's "cheat sheet" (auto-generated, don't edit by hand) |
| `scripts/generate-ai-context.mjs` | The script that generates the cheat sheet from product data |
| `workers/ai-search/worker.js` | The Cloudflare Worker that talks to the AI model |
| `app/js/search.js` | Client-side search logic (sends questions to the worker) |

## Free Tier Limits

- Cloudflare Workers AI: 10,000 neurons/day (roughly 1,000+ queries)
- Rate limit: 10 requests per minute per visitor
- Cache: Answers cached 24 hours (same question = instant, no neurons used)

## Troubleshooting

**AI gives wrong/outdated answers:** Regenerate the context (Step 1-3 above).

**AI stops responding:** Check Cloudflare dashboard. You may have hit the daily neuron limit. Resets at midnight UTC.

**"Network error" in search:** The Cloudflare Worker may be down. Check `https://npsp-ai-search.epug.workers.dev` directly.
