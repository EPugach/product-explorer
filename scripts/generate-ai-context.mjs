#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
//  generate-ai-context.mjs — Generates distilled AI context from product data
//  Usage: node scripts/generate-ai-context.mjs <productId>
//  Output: products/<productId>/ai-context.js
//
//  Pulls from: config.js, data.js, entities.js
//  Target: ~25-30K tokens of structured markdown for LLM ingestion
//  Model: Llama 4 Scout 17B (131K context window)
// ══════════════════════════════════════════════════════════════

const EXPLORER_BASE = 'https://epugach.github.io/product-explorer';

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
let totalFields = 0;

// ── Helper: first N sentences of a string ──
function firstSentences(text, n) {
  if (!text) return '';
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.slice(0, n).join(' ').trim();
}

// ── Helper: truncate string to max length ──
function truncate(text, max) {
  if (!text || text.length <= max) return text || '';
  return text.substring(0, max - 3) + '...';
}

// ── Token tracking ──
const sectionTokens = {};
let sectionStart = 0;
function trackSection(name, ctx) {
  const len = ctx.length - sectionStart;
  sectionTokens[name] = Math.round(len / 4);
  sectionStart = ctx.length;
}

// ══════════════════════════════════════════════════════════════
//  BUILD CONTEXT
// ══════════════════════════════════════════════════════════════

let context = `You are an expert on Salesforce ${config.fullName || config.name} (${config.id.toUpperCase()}) ${config.version || ''}.
Answer questions based ONLY on the following product knowledge. If the question is not about ${config.id.toUpperCase()} or you are unsure, say so clearly. Keep answers concise (2-4 sentences).
When mentioning domains or components, include markdown links using the URLs from the Links section below.

## Domains (${domainEntries.length})
`;

for (const [id, domain] of domainEntries) {
  const desc = firstSentences(domain.description, 2);
  context += `- **${domain.name}** (${id}): ${desc}\n`;
}
trackSection('Domains', context);

// ── Components: full descriptions ──
context += `\n## Key Components (${totalComponents})\n`;

for (const [id, domain] of domainEntries) {
  for (const comp of (domain.components || [])) {
    const desc = firstSentences(comp.desc, 2);
    context += `- **${comp.name}** [${domain.name}]: ${desc}\n`;
  }
}
trackSection('Components', context);

// ── Apex Classes: two-tier approach ──
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
  trackSection('Apex Classes', context);

  // ── Lightning Web Components: name + description ──
  let totalLWCs = 0;
  const lwcLines = [];

  for (const [domainId, types] of Object.entries(entities)) {
    const lwcs = types.lwcs || [];
    if (lwcs.length === 0) continue;
    totalLWCs += lwcs.length;

    const domainName = PRODUCT[domainId]?.name || domainId;
    for (const lwc of lwcs) {
      const desc = truncate(firstSentences(lwc.description, 1), 120);
      lwcLines.push(`- ${lwc.name} [${domainName}]: ${desc}`);
    }
  }

  if (totalLWCs > 0) {
    context += `\n## Lightning Web Components (${totalLWCs})\n`;
    context += lwcLines.join('\n') + '\n';
  }
  trackSection('LWCs', context);

  // ── Custom Objects: name + label + short description ──
  let totalObjects = 0;
  const objLines = [];
  const fieldSections = [];

  for (const [domainId, types] of Object.entries(entities)) {
    const objects = types.objects || [];
    if (objects.length === 0) continue;
    totalObjects += objects.length;

    for (const obj of objects) {
      let desc = firstSentences(obj.description, 1);
      if (desc.length > 80) desc = desc.substring(0, 77) + '...';
      objLines.push(`- ${obj.name} (${obj.label || ''}): ${desc}`);

      // Collect fields for the fields section
      const fields = obj.fields || [];
      if (fields.length > 0) {
        totalFields += fields.length;
        const fieldLines = fields.map(f => {
          const fdesc = truncate(f.desc, 40);
          return `  - ${f.name} (${f.type || ''}): ${fdesc}`;
        });
        fieldSections.push(`### ${obj.name} (${fields.length} fields)\n${fieldLines.join('\n')}`);
      }
    }
  }

  if (totalObjects > 0) {
    context += `\n## Custom Objects (${totalObjects})\n`;
    context += objLines.join('\n') + '\n';
  }
  trackSection('Objects', context);

  // ── Object Fields ──
  if (totalFields > 0) {
    context += `\n## Custom Object Fields (${totalFields} fields across ${totalObjects} objects)\n`;
    context += fieldSections.join('\n') + '\n';
  }
  trackSection('Object Fields', context);

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
  trackSection('Triggers', context);

  // ── Custom Metadata Types ──
  let totalMetadata = 0;
  const metaLines = [];

  for (const [domainId, types] of Object.entries(entities)) {
    const metadata = types.metadata || [];
    if (metadata.length === 0) continue;
    totalMetadata += metadata.length;

    for (const md of metadata) {
      const desc = truncate(firstSentences(md.description, 1), 120);
      metaLines.push(`- ${md.name} (${md.recordCount || 0} records): ${desc}`);
    }
  }

  if (totalMetadata > 0) {
    context += `\n## Custom Metadata Types (${totalMetadata})\n`;
    context += metaLines.join('\n') + '\n';
  }
  trackSection('Metadata', context);
}

// ── Glossary ──
context += `
## Glossary
TDTM = Table-Driven Trigger Management, GAU = General Accounting Unit, RD2 = Enhanced Recurring Donations v2, OCR = Opportunity Contact Role, CRLP = Customizable Rollups, BDI = Batch Data Import, BGE = Batch Gift Entry, NPSP = Nonprofit Success Pack, HH = Household, PMT = Payment, OPP = Opportunity, LWC = Lightning Web Component, ADDR = Address Management, AFFL = Affiliations, REL = Relationships, ERR = Error Handling, UTIL = Utilities, CMDT = Custom Metadata Type, DML = Data Manipulation Language, SOQL = Salesforce Object Query Language
`;
trackSection('Glossary', context);

// ── Data Flow Connections ──
context += `## Data Flow Connections\n`;

for (const [id, domain] of domainEntries) {
  if (domain.connections && domain.connections.length > 0) {
    const conns = domain.connections.map(c => `${c.planet}: ${c.desc}`).join('; ');
    context += `- ${domain.name} connects to: ${conns}\n`;
  }
}
trackSection('Data Flows', context);

// ── Links Reference ──
const explorerUrl = `${EXPLORER_BASE}/${productId}`;
context += `\n## Links\nUse these URLs when mentioning domains or components:\n`;

for (const [id, domain] of domainEntries) {
  context += `- [${domain.name}](${explorerUrl}/#/${id})\n`;
}
if (config.repoUrl) {
  context += `- [${config.id.toUpperCase()} Source Code](${config.repoUrl})\n`;
}
trackSection('Links', context);

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
      acc.metadata += (types.metadata || []).length;
      return acc;
    }, { classes: 0, lwcs: 0, objects: 0, triggers: 0, metadata: 0 })
  : null;

console.log(`\nGenerated ${outputPath}`);
console.log(`${domainEntries.length} domains, ${totalComponents} components`);
if (entityCounts) {
  console.log(`${entityCounts.classes} classes, ${entityCounts.lwcs} LWCs, ${entityCounts.objects} objects (${entityCounts.objects > 0 ? totalFields + ' fields' : '0 fields'}), ${entityCounts.triggers} triggers, ${entityCounts.metadata} metadata types`);
}

console.log(`\nToken breakdown:`);
for (const [name, count] of Object.entries(sectionTokens)) {
  console.log(`  ${name.padEnd(20)} ${count.toLocaleString().padStart(6)}`);
}
console.log(`  ${'─'.repeat(26)}`);
console.log(`  ${'Total'.padEnd(20)} ${tokens.toLocaleString().padStart(6)}`);

if (tokens > 40000) {
  console.warn(`\n⚠️  Context exceeds 40K tokens. Consider condensing.`);
} else if (tokens > 30000) {
  console.warn(`\n⚠️  Context is above 30K tokens. Monitor answer quality.`);
}
