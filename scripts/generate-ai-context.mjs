#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
//  generate-ai-context.mjs — Generates distilled AI context from product data
//  Usage: node scripts/generate-ai-context.mjs <productId>
//  Output: products/<productId>/ai-context.js
//
//  Pulls from: config.js, data.js, entities.js
//  Target: ~10-12K tokens of structured markdown for LLM ingestion
// ══════════════════════════════════════════════════════════════

const productId = process.argv[2];
if (!productId) {
  console.error('Usage: node scripts/generate-ai-context.mjs <productId>');
  process.exit(1);
}

const dataModule = await import(`../products/${productId}/data.js`);
const configModule = await import(`../products/${productId}/config.js`);

const PRODUCT = dataModule.PRODUCT;
const config = configModule.default;

// Try to load entities (optional)
let entities = null;
try {
  const entModule = await import(`../products/${productId}/entities.js`);
  entities = entModule.default;
} catch {
  console.warn(`No entities.js found for ${productId}, skipping entity sections`);
}

const domainEntries = Object.entries(PRODUCT);
const totalComponents = domainEntries.reduce((sum, [, d]) => sum + (d.components || []).length, 0);

// ── Helper: first N sentences of a string ──
function firstSentences(text, n) {
  if (!text) return '';
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.slice(0, n).join(' ').trim();
}

// ══════════════════════════════════════════════════════════════
//  BUILD CONTEXT
// ══════════════════════════════════════════════════════════════

let context = `You are an expert on Salesforce ${config.fullName || config.name} (${config.id.toUpperCase()}) ${config.version || ''}.
Answer questions based ONLY on the following product knowledge. If the question is not about ${config.id.toUpperCase()} or you are unsure, say so clearly. Keep answers concise (2-4 sentences).

## Domains (${domainEntries.length})
`;

for (const [id, domain] of domainEntries) {
  const desc = firstSentences(domain.description, 2);
  context += `- **${domain.name}** (${id}): ${desc}\n`;
}

// ── Components: full descriptions + execution flows ──
context += `\n## Key Components (${totalComponents})\n`;

for (const [id, domain] of domainEntries) {
  for (const comp of (domain.components || [])) {
    // Full description (up to 2 sentences)
    const desc = firstSentences(comp.desc, 2);
    context += `- **${comp.name}** [${domain.name}]: ${desc}\n`;
  }
}

// ── Apex Classes: two-tier approach ──
// Tier 1 (>300 LOC): name + description + refs (these are the substantial classes)
// Tier 2 (<=300 LOC): name-only list per domain (compact, but AI knows they exist)
const KEY_CLASS_THRESHOLD = 500;

if (entities) {
  let totalClasses = 0;
  let keyClassCount = 0;
  const keyClassSections = [];
  const compactSections = [];

  for (const [domainId, types] of Object.entries(entities)) {
    const classes = types.classes || [];
    if (classes.length === 0) continue;
    totalClasses += classes.length;

    const domainName = PRODUCT[domainId]?.name || domainId;
    const keyClasses = classes.filter(c => c.linesOfCode > KEY_CLASS_THRESHOLD);
    const otherClasses = classes.filter(c => c.linesOfCode <= KEY_CLASS_THRESHOLD);

    if (keyClasses.length > 0) {
      keyClassCount += keyClasses.length;
      const lines = keyClasses.map(cls => {
        const desc = firstSentences(cls.description, 1);
        const refs = (cls.referencedObjects || []).slice(0, 3);
        const refStr = refs.length > 0 ? ` [refs: ${refs.join(', ')}]` : '';
        return `  - ${cls.name} (${cls.linesOfCode} LOC): ${desc}${refStr}`;
      });
      keyClassSections.push(`### ${domainName}\n${lines.join('\n')}`);
    }

    if (otherClasses.length > 0) {
      compactSections.push(`- ${domainName}: ${otherClasses.length} additional classes`);
    }
  }

  if (totalClasses > 0) {
    context += `\n## Key Apex Classes (${keyClassCount} of ${totalClasses} total, >${KEY_CLASS_THRESHOLD} LOC)\n`;
    context += keyClassSections.join('\n') + '\n';
    context += `\n## Other Apex Classes by Domain\n`;
    context += compactSections.join('\n') + '\n';
  }

  // ── Lightning Web Components: names grouped by domain ──
  let totalLWCs = 0;
  const lwcSections = [];

  for (const [domainId, types] of Object.entries(entities)) {
    const lwcs = types.lwcs || [];
    if (lwcs.length === 0) continue;
    totalLWCs += lwcs.length;

    const domainName = PRODUCT[domainId]?.name || domainId;
    lwcSections.push(`- ${domainName}: ${lwcs.map(l => l.name).join(', ')}`);
  }

  if (totalLWCs > 0) {
    context += `\n## Lightning Web Components (${totalLWCs})\n`;
    context += lwcSections.join('\n') + '\n';
  }

  // ── Custom Objects: name + label + short description ──
  let totalObjects = 0;
  const objLines = [];

  for (const [domainId, types] of Object.entries(entities)) {
    const objects = types.objects || [];
    if (objects.length === 0) continue;
    totalObjects += objects.length;

    for (const obj of objects) {
      // Truncate description to ~80 chars
      let desc = firstSentences(obj.description, 1);
      if (desc.length > 80) desc = desc.substring(0, 77) + '...';
      objLines.push(`- ${obj.name} (${obj.label || ''}): ${desc}`);
    }
  }

  if (totalObjects > 0) {
    context += `\n## Custom Objects (${totalObjects})\n`;
    context += objLines.join('\n') + '\n';
  }

  // ── Triggers ──
  let totalTriggers = 0;
  const triggerLines = [];

  for (const [domainId, types] of Object.entries(entities)) {
    const triggers = types.triggers || [];
    if (triggers.length === 0) continue;
    totalTriggers += triggers.length;

    for (const trig of triggers) {
      const events = (trig.events || []).join(', ');
      const handlers = (trig.handlers || []).slice(0, 3).join(', ');
      triggerLines.push(`- ${trig.name} on ${trig.object || '?'} (${events}) → ${handlers}`);
    }
  }

  if (totalTriggers > 0) {
    context += `\n## Triggers (${totalTriggers})\n`;
    context += triggerLines.join('\n') + '\n';
  }
}

// ── Glossary ──
context += `
## Glossary
TDTM = Table-Driven Trigger Management, GAU = General Accounting Unit, RD2 = Enhanced Recurring Donations v2, OCR = Opportunity Contact Role, CRLP = Customizable Rollups, BDI = Batch Data Import, BGE = Batch Gift Entry, NPSP = Nonprofit Success Pack, HH = Household, PMT = Payment, OPP = Opportunity, LWC = Lightning Web Component, ADDR = Address Management, AFFL = Affiliations, REL = Relationships, ERR = Error Handling, UTIL = Utilities, CMDT = Custom Metadata Type, DML = Data Manipulation Language, SOQL = Salesforce Object Query Language
`;

// ── Data Flow Connections ──
context += `## Data Flow Connections\n`;

for (const [id, domain] of domainEntries) {
  if (domain.connections && domain.connections.length > 0) {
    const conns = domain.connections.map(c => `${c.planet}: ${c.desc}`).join('; ');
    context += `- ${domain.name} connects to: ${conns}\n`;
  }
}

// ══════════════════════════════════════════════════════════════
//  WRITE OUTPUT
// ══════════════════════════════════════════════════════════════

const outputPath = new URL(`../products/${productId}/ai-context.js`, import.meta.url).pathname;
const fileContent = `// Auto-generated by scripts/generate-ai-context.mjs
// Do not edit manually. Regenerate with: node scripts/generate-ai-context.mjs ${productId}
export const AI_CONTEXT = ${JSON.stringify(context)};
`;

const fs = await import('fs');
fs.writeFileSync(outputPath, fileContent, 'utf-8');

const tokens = Math.round(context.length / 4); // rough token estimate
const entityCounts = entities
  ? Object.values(entities).reduce((acc, types) => {
      acc.classes += (types.classes || []).length;
      acc.lwcs += (types.lwcs || []).length;
      acc.objects += (types.objects || []).length;
      acc.triggers += (types.triggers || []).length;
      return acc;
    }, { classes: 0, lwcs: 0, objects: 0, triggers: 0 })
  : null;

console.log(`\nGenerated ${outputPath}`);
console.log(`${domainEntries.length} domains, ${totalComponents} components`);
if (entityCounts) {
  console.log(`${entityCounts.classes} classes, ${entityCounts.lwcs} LWCs, ${entityCounts.objects} objects, ${entityCounts.triggers} triggers`);
}
console.log(`~${context.length.toLocaleString()} chars, ~${tokens.toLocaleString()} tokens`);

if (tokens > 16000) {
  console.warn(`\n⚠️  Context exceeds 16K tokens. Consider condensing for optimal LLM quality.`);
} else if (tokens > 12000) {
  console.warn(`\n⚠️  Context is above 12K tokens. Monitor answer quality.`);
}
