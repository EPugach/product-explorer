// ══════════════════════════════════════════════════════════════
//  NPSP AI Search Worker — Cloudflare Workers AI
//  Accepts questions, returns AI-generated answers grounded in
//  NPSP product knowledge. Uses KV for caching, per-IP rate limiting.
//  Logs questions to Google Sheets via Apps Script (fire-and-forget).
// ══════════════════════════════════════════════════════════════

export default {
  async fetch(request, env, ctx) {
    // CORS preflight
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
    const corsOrigin = allowed.includes(origin) ? origin : '';
    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, corsHeaders);
    }

    // Route: /feedback
    const url = new URL(request.url);
    if (url.pathname === '/feedback') {
      return handleFeedback(request, env, ctx, corsHeaders);
    }

    try {
      const body = await request.json();
      const { question, systemContext, faqMatches, searchMatches } = body;
      if (!question || typeof question !== 'string' || question.trim().length < 3) {
        return json({ error: 'Invalid question' }, 400, corsHeaders);
      }

      const q = question.trim().substring(0, 300); // Cap length

      // Rate limit: 10 requests per minute per IP
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rateLimitKey = `rate:${ip}:${Math.floor(Date.now() / 60000)}`;
      const rateCount = parseInt(await env.CACHE.get(rateLimitKey) || '0', 10);
      if (rateCount >= 10) {
        return json({ error: 'Rate limit exceeded. Try again in a minute.' }, 429, corsHeaders);
      }
      await env.CACHE.put(rateLimitKey, String(rateCount + 1), { expirationTtl: 120 });

      // Cache check
      const qHash = await sha256(q.toLowerCase());
      const cacheKey = `answer:${qHash}`;
      const cached = await env.CACHE.get(cacheKey);
      if (cached) {
        const ipHash = (await sha256(ip)).substring(0, 8);
        // Log to Google Sheets (fire-and-forget, non-blocking)
        ctx.waitUntil(logToSheets(env, q, ipHash, true, cached.substring(0, 200)));
        return json({ answer: cached, cached: true }, 200, corsHeaders);
      }

      // Build prompt
      const faqContext = (faqMatches || []).slice(0, 3)
        .map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n');
      const searchContext = (searchMatches || []).slice(0, 5)
        .map(s => `- ${s.name} (${s.type}): ${s.desc}`).join('\n');

      const messages = [
        {
          role: 'system',
          content: (systemContext || 'You are an expert on Salesforce NPSP.') +
            '\n\nIMPORTANT: Only answer based on the provided context. If the question is not about NPSP or you are unsure, say so. Keep answers concise (2-4 sentences).' +
            '\n\nWhen referencing specific Apex classes, triggers, LWCs, or custom objects, always use their exact technical names (e.g. CRLP_RollupProcessor_SVC, PMT_PaymentCreator). The application will automatically create links to source code on GitHub. Never say you don\'t have links to code.' +
            (faqContext ? `\n\n## Relevant Q&A\n${faqContext}` : '') +
            (searchContext ? `\n\n## Relevant Components\n${searchContext}` : '')
        },
        { role: 'user', content: q }
      ];

      const response = await env.AI.run('@cf/meta/llama-4-scout-17b-16e-instruct', {
        messages,
        max_tokens: 400,
        temperature: 0.3,
      });

      const answer = (response.response || '').trim();
      if (!answer) {
        return json({ error: 'No answer generated' }, 500, corsHeaders);
      }

      // Cache for 24 hours
      await env.CACHE.put(cacheKey, answer, { expirationTtl: 86400 });

      // Log to Google Sheets (fire-and-forget, non-blocking)
      const ipHash = (await sha256(ip)).substring(0, 8);
      ctx.waitUntil(logToSheets(env, q, ipHash, false, answer.substring(0, 200)));

      return json({ answer, cached: false }, 200, corsHeaders);
    } catch (err) {
      console.error('AI search error:', err);
      return json({ error: 'Internal error' }, 500, corsHeaders);
    }
  }
};

// ── Feedback endpoint ──────────────────────────────────────
async function handleFeedback(request, env, ctx, corsHeaders) {
  try {
    const body = await request.json();
    const { question, rating, reason, comment } = body;

    if (!question || typeof question !== 'string' || question.trim().length < 3) {
      return json({ error: 'Invalid question' }, 400, corsHeaders);
    }
    if (rating !== 'up' && rating !== 'down') {
      return json({ error: 'Invalid rating' }, 400, corsHeaders);
    }

    // Rate limit: same 10/min/IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimitKey = `rate:${ip}:${Math.floor(Date.now() / 60000)}`;
    const rateCount = parseInt(await env.CACHE.get(rateLimitKey) || '0', 10);
    if (rateCount >= 10) {
      return json({ error: 'Rate limit exceeded' }, 429, corsHeaders);
    }
    await env.CACHE.put(rateLimitKey, String(rateCount + 1), { expirationTtl: 120 });

    const ipHash = (await sha256(ip)).substring(0, 8);
    const q = question.trim().substring(0, 300);
    const safeReason = (reason || '').substring(0, 100);
    const safeComment = (comment || '').substring(0, 500);

    ctx.waitUntil(logToSheets(env, q, ipHash, null, null, {
      type: 'feedback',
      rating,
      reason: safeReason,
      comment: safeComment
    }));

    return json({ ok: true }, 200, corsHeaders);
  } catch (err) {
    console.error('Feedback error:', err);
    return json({ error: 'Internal error' }, 500, corsHeaders);
  }
}

// Fire-and-forget POST to Google Sheets via Apps Script
async function logToSheets(env, question, ipHash, cached, answerPreview, feedback) {
  const url = env.SHEETS_LOG_URL;
  if (!url) return; // Skip if not configured
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      question,
      ipHash,
      cached,
      answerPreview
    };
    if (feedback) {
      payload.type = feedback.type;
      payload.rating = feedback.rating;
      payload.reason = feedback.reason;
      payload.comment = feedback.comment;
    }
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    // Silent fail — logging should never break the main response
  }
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}
