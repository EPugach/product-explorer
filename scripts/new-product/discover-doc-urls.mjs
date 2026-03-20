#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
//  discover-doc-urls.mjs — Fuzzy-match Salesforce Help articles
//  to Product Explorer components and suggest docUrl values.
//
//  Usage:
//    node scripts/new-product/discover-doc-urls.mjs \
//      --product-slug omnistudio \
//      --help-url "https://help.salesforce.com/s/articleView?id=xcloud.os_omnistudio_standard.htm&type=5"
//
//  Reads:
//    - products/{slug}/data.js  (component definitions)
//    - scripts/new-product/output/{slug}/raw/extracted_text.md  (PDF TOC)
//    - Salesforce Help URL (attempted, falls back to PDF TOC)
//
//  Writes:
//    - scripts/new-product/output/{slug}-doc-urls.json
//
//  Zero npm dependencies. Hand-rolled fuzzy matching.
// ══════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '../..');

// ── CLI Args ─────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--product-slug' && args[i + 1]) {
      parsed.slug = args[++i];
    } else if (args[i] === '--help-url' && args[i + 1]) {
      parsed.helpUrl = args[++i];
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`Usage: node scripts/new-product/discover-doc-urls.mjs \\
  --product-slug <slug> \\
  --help-url <url>`);
      process.exit(0);
    }
  }
  if (!parsed.slug) {
    console.error('Error: --product-slug is required');
    process.exit(1);
  }
  if (!parsed.helpUrl) {
    console.error('Error: --help-url is required');
    process.exit(1);
  }
  return parsed;
}

// ── Tokenizer ────────────────────────────────────────────────

/** Normalize and tokenize a string into lowercase word tokens */
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

/** Remove common stop words that add noise to matching */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
  'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'can',
  'that', 'this', 'these', 'those', 'it', 'its', 'not', 'no',
  'your', 'you', 'how', 'what', 'when', 'where', 'which', 'who',
  'about', 'up', 'use', 'using', 'used'
]);

function tokenizeClean(text) {
  return tokenize(text).filter(t => !STOP_WORDS.has(t));
}

// ── Similarity Functions ─────────────────────────────────────

/** Jaccard coefficient: |intersection| / |union| of two token sets */
function jaccard(tokensA, tokensB) {
  if (tokensA.length === 0 && tokensB.length === 0) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersection = 0;
  for (const t of setA) {
    if (setB.has(t)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Weighted match: boosts score when key terms from component name appear in article */
function weightedMatch(componentTokens, articleTokens, descTokens) {
  // Base Jaccard on component name vs article title
  const nameScore = jaccard(componentTokens, articleTokens);

  // Bonus: Jaccard on component description vs article title
  const descScore = jaccard(descTokens, articleTokens);

  // Containment score: what fraction of component name tokens appear in article
  const nameSet = new Set(componentTokens);
  const articleSet = new Set(articleTokens);
  let nameContained = 0;
  for (const t of nameSet) {
    if (articleSet.has(t)) nameContained++;
  }
  const containment = nameSet.size === 0 ? 0 : nameContained / nameSet.size;

  // Weighted combination: name match is most important, containment second, desc third
  return (nameScore * 0.45) + (containment * 0.35) + (descScore * 0.20);
}

// ── PDF TOC Parser ───────────────────────────────────────────

/**
 * Parse article titles from the extracted PDF text (TOC section).
 * TOC lines look like: "Article Title . . . . . . . . . . . . . . . 42"
 *
 * The TOC is bounded by "CONTENTS" header and the next page marker
 * after the last dotted entry. We only parse within that region to
 * avoid matching body text as article titles.
 */
function parsePdfToc(text) {
  const articles = [];
  const lines = text.split('\n');

  // Find the TOC region: starts after "CONTENTS", ends when we hit
  // a page marker after consecutive non-TOC lines
  let inToc = false;
  let missCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect start of TOC
    if (trimmed === 'CONTENTS') {
      inToc = true;
      continue;
    }

    if (!inToc) continue;

    // Skip page markers and empty lines (they appear within TOC)
    if (trimmed.startsWith('<!--') || trimmed === '') {
      continue;
    }

    // Match TOC pattern: title followed by dots (possibly spaced) and page number
    // PDF TOC uses ". . . . ." (dot-space) pattern or "..." (consecutive dots)
    const tocMatch = trimmed.match(/^(.+?)\s*(?:\.[\s.]*){3,}\s*(\d+)\s*$/);
    if (tocMatch) {
      const title = tocMatch[1].trim();
      const page = parseInt(tocMatch[2], 10);
      // Skip very short titles (likely headers or noise)
      if (title.length > 3) {
        articles.push({ title, page });
      }
      missCount = 0;
      continue;
    }

    // Non-TOC line encountered -- if we see several in a row, TOC is over
    missCount++;
    if (missCount >= 3) {
      break;
    }
  }

  return articles;
}

// ── Web Fetch (attempted) ────────────────────────────────────

/**
 * Attempt to fetch article links from the Salesforce Help page.
 * Salesforce Help is an SPA (Lightning Web Runtime), so static HTML
 * fetch rarely yields article content. Returns empty array on failure.
 */
async function fetchArticleLinks(helpUrl) {
  console.log('\n[web fetch] Attempting to fetch articles from help URL...');
  try {
    const resp = await globalThis.fetch(helpUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProductExplorer/1.0)',
        'Accept': 'text/html,application/xhtml+xml'
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000)
    });

    if (!resp.ok) {
      console.log(`[web fetch] HTTP ${resp.status} - falling back to PDF TOC`);
      return [];
    }

    const html = await resp.text();

    // Try to extract article links from HTML
    const linkPattern = /articleView\?id=([^"&]+)/g;
    const found = new Set();
    let match;
    while ((match = linkPattern.exec(html)) !== null) {
      found.add(match[1]);
    }

    if (found.size > 0) {
      console.log(`[web fetch] Found ${found.size} article IDs in HTML`);
      return [...found].map(id => ({
        title: id.replace(/\./g, ' ').replace(/\.htm$/, ''),
        url: `https://help.salesforce.com/s/articleView?id=${id}&type=5`
      }));
    }

    console.log('[web fetch] No article links in static HTML (SPA detected)');
    return [];
  } catch (err) {
    console.log(`[web fetch] Failed: ${err.message} - falling back to PDF TOC`);
    return [];
  }
}

// ── Product Data Loader ──────────────────────────────────────

async function loadProductComponents(slug) {
  const dataPath = join(ROOT, 'products', slug, 'data.js');
  if (!existsSync(dataPath)) {
    console.error(`Error: products/${slug}/data.js not found`);
    process.exit(1);
  }

  const mod = await import(pathToFileURL(dataPath).href);
  const PRODUCT = mod.PRODUCT;
  if (!PRODUCT) {
    console.error('Error: data.js has no PRODUCT export');
    process.exit(1);
  }

  const components = [];
  for (const [domainId, domain] of Object.entries(PRODUCT)) {
    for (const comp of (domain.components || [])) {
      components.push({
        domainId,
        domainName: domain.name,
        componentId: comp.id,
        componentName: comp.name,
        desc: comp.desc || '',
        existingDocUrl: comp.docUrl || null
      });
    }
  }
  return components;
}

// ── Matching Engine ──────────────────────────────────────────

/**
 * Match articles to components using fuzzy token similarity.
 * Returns best match for each component above a minimum threshold.
 */
function matchArticlesToComponents(articles, components) {
  const MIN_SCORE = 0.08; // minimum to even consider a match
  const matches = {};
  const matchedArticleIndices = new Set();
  const unmatchedComponents = [];

  for (const comp of components) {
    const compNameTokens = tokenizeClean(comp.componentName);
    const compDescTokens = tokenizeClean(comp.desc).slice(0, 30); // limit desc tokens
    const domainTokens = tokenizeClean(comp.domainName);
    const allCompTokens = [...new Set([...compNameTokens, ...domainTokens])];

    let bestScore = 0;
    let bestArticle = null;
    let bestIdx = -1;

    for (let i = 0; i < articles.length; i++) {
      const articleTokens = tokenizeClean(articles[i].title);

      // Primary: component name + domain name vs article title
      const score = weightedMatch(allCompTokens, articleTokens, compDescTokens);

      // Bonus for exact substring containment
      const compNameLower = comp.componentName.toLowerCase();
      const articleLower = articles[i].title.toLowerCase();
      const substringBonus = articleLower.includes(compNameLower) ? 0.25 :
                             compNameLower.includes(articleLower) ? 0.15 : 0;

      const finalScore = Math.min(score + substringBonus, 1.0);

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestArticle = articles[i];
        bestIdx = i;
      }
    }

    if (bestScore >= MIN_SCORE && bestArticle) {
      const confidence = bestScore >= 0.7 ? 'high' :
                         bestScore >= 0.4 ? 'medium' : 'low';

      if (!matches[comp.domainId]) matches[comp.domainId] = {};
      matches[comp.domainId][comp.componentId] = {
        suggestedUrl: bestArticle.url || null,
        articleTitle: bestArticle.title,
        matchConfidence: confidence,
        matchScore: Math.round(bestScore * 1000) / 1000,
        matchReason: `component '${comp.componentName}' [${comp.domainName}] matches article '${bestArticle.title}'`
      };
      matchedArticleIndices.add(bestIdx);
    } else {
      unmatchedComponents.push({
        domainId: comp.domainId,
        componentId: comp.componentId,
        componentName: comp.componentName
      });
    }
  }

  const unmatchedArticles = articles
    .filter((_, i) => !matchedArticleIndices.has(i))
    .map(a => a.title);

  return { matches, unmatchedComponents, unmatchedArticles };
}

// ── Main ─────────────────────────────────────────────────────

const { slug, helpUrl } = parseArgs();

console.log('══════════════════════════════════════════════════');
console.log(`  discover-doc-urls — ${slug}`);
console.log('══════════════════════════════════════════════════');

// 1. Load product components
console.log('\n[load] Reading product data...');
const components = await loadProductComponents(slug);
console.log(`[load] Found ${components.length} components across ${new Set(components.map(c => c.domainId)).size} domains`);

// 2. Attempt web fetch for article links
let articles = await fetchArticleLinks(helpUrl);

// 3. Fall back to PDF TOC if web fetch yields insufficient results
if (articles.length < 5) {
  const tocPath = join(ROOT, 'scripts/new-product/output', slug, 'raw/extracted_text.md');
  if (existsSync(tocPath)) {
    console.log(`\n[pdf toc] Reading extracted text from ${tocPath}...`);
    const tocText = readFileSync(tocPath, 'utf-8');
    const tocArticles = parsePdfToc(tocText);
    console.log(`[pdf toc] Parsed ${tocArticles.length} article titles from TOC`);

    articles = tocArticles.map(a => ({
      title: a.title,
      page: a.page,
      url: null // URLs from PDF TOC are not verifiable
    }));
  } else {
    console.log(`\n[pdf toc] No extracted text found at expected path`);
    console.log(`  Expected: scripts/new-product/output/${slug}/raw/extracted_text.md`);
  }
}

if (articles.length === 0) {
  console.error('\nError: No articles found from web fetch or PDF TOC. Cannot proceed.');
  process.exit(1);
}

// 4. Match articles to components
console.log(`\n[match] Matching ${articles.length} articles to ${components.length} components...`);
const { matches, unmatchedComponents, unmatchedArticles } = matchArticlesToComponents(articles, components);

// 5. Compute summary
const summary = { totalArticles: articles.length, totalComponents: components.length, matched: { high: 0, medium: 0, low: 0 } };
for (const domainMatches of Object.values(matches)) {
  for (const m of Object.values(domainMatches)) {
    summary.matched[m.matchConfidence]++;
  }
}

// 6. Build output
const output = {
  product: slug,
  generated: new Date().toISOString(),
  helpUrl,
  summary,
  matches,
  unmatchedComponents,
  unmatchedArticles: unmatchedArticles.slice(0, 50) // cap to keep output manageable
};

// 7. Write report
const outputPath = join(ROOT, 'scripts/new-product/output', `${slug}-doc-urls.json`);
writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

// 8. Print summary
console.log('\n══════════════════════════════════════════════════');
console.log('  Results');
console.log('══════════════════════════════════════════════════');
console.log(`  Articles found:       ${summary.totalArticles}`);
console.log(`  Components:           ${summary.totalComponents}`);
console.log(`  High confidence:      ${summary.matched.high}`);
console.log(`  Medium confidence:    ${summary.matched.medium}`);
console.log(`  Low confidence:       ${summary.matched.low}`);
console.log(`  Unmatched components: ${unmatchedComponents.length}`);
console.log(`  Unmatched articles:   ${unmatchedArticles.length}`);
console.log(`\n  Output: ${outputPath}`);

// 9. Print match details
console.log('\n── High Confidence Matches ──');
for (const [domainId, domainMatches] of Object.entries(matches)) {
  for (const [compId, m] of Object.entries(domainMatches)) {
    if (m.matchConfidence === 'high') {
      console.log(`  [${domainId}/${compId}] ${m.matchScore.toFixed(3)} <- "${m.articleTitle}"`);
    }
  }
}

console.log('\n── Medium Confidence Matches ──');
for (const [domainId, domainMatches] of Object.entries(matches)) {
  for (const [compId, m] of Object.entries(domainMatches)) {
    if (m.matchConfidence === 'medium') {
      console.log(`  [${domainId}/${compId}] ${m.matchScore.toFixed(3)} <- "${m.articleTitle}"`);
    }
  }
}

console.log('\n── Low Confidence Matches ──');
for (const [domainId, domainMatches] of Object.entries(matches)) {
  for (const [compId, m] of Object.entries(domainMatches)) {
    if (m.matchConfidence === 'low') {
      console.log(`  [${domainId}/${compId}] ${m.matchScore.toFixed(3)} <- "${m.articleTitle}"`);
    }
  }
}

if (unmatchedComponents.length > 0) {
  console.log('\n── Unmatched Components ──');
  for (const c of unmatchedComponents) {
    console.log(`  ${c.domainId}/${c.componentId} (${c.componentName})`);
  }
}

console.log('\nDone.');
