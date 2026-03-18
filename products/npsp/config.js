// ══════════════════════════════════════════════════════════════
//  NPSP Product Configuration
//  Metadata consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

// Package registry: NPSP installs as 6 managed packages
export const PACKAGES = {
  cumulus: { name: 'Nonprofit Success Pack', prefix: 'npsp__',  abbr: 'Cumulus', color: '#4d8bff' },
  npe01:   { name: 'Contacts & Organizations', prefix: 'npe01__', abbr: 'C&O',     color: '#10b981' },
  npo02:   { name: 'Households',               prefix: 'npo02__', abbr: 'HH',      color: '#f59e0b' },
  npe03:   { name: 'Recurring Donations',      prefix: 'npe03__', abbr: 'RD',      color: '#ef4444' },
  npe4:    { name: 'Relationships',            prefix: 'npe4__',  abbr: 'REL',     color: '#8b5cf6' },
  npe5:    { name: 'Affiliations',             prefix: 'npe5__',  abbr: 'AFFL',    color: '#ec4899' },
};

export default {
  id: 'npsp',
  name: 'NPSP',
  fullName: 'Nonprofit Success Pack',
  title: 'NPSP Explorer',
  version: '3.x',
  description: 'The most widely adopted nonprofit technology on Salesforce',
  color: '#4d8bff',
  repoUrl: 'https://github.com/SalesforceFoundation/NPSP',
  docUrl: 'https://help.salesforce.com/s/articleView?id=sfdo.NPSP_Documentation.htm&type=5',
  entityTypes: ['classes', 'objects', 'triggers', 'lwcs', 'metadata'],
  localStoragePrefix: 'npsp',
  aiWorkerUrl: 'https://npsp-ai-search.epug.workers.dev',
  analytics: {
    gaId: 'G-HJTE1NYP82',
  },
  stats: {
    classes: 843,
    triggers: 26,
    objects: 65,
    domains: 18,
    components: 55,
  },
  physics: {
    weights: {
      recurring: 89, rollups: 76, bdi: 66, settings: 64, donations: 50, batch: 45,
      contacts: 39, allocations: 28, errors: 22, addresses: 20, giftentry: 19,
      elevate: 14, engagement: 12, softcredits: 8, relationships: 6, levels: 6,
      tdtm: 15, affiliations: 4
    },
    foundational: { tdtm: 2.5, settings: 1.3, errors: 1.2 },
    groups: {
      donations: 0, contacts: 0, recurring: 0, softcredits: 0,
      rollups: 1, batch: 1, allocations: 1, levels: 1,
      bdi: 2, giftentry: 2, elevate: 2,
      tdtm: 3, settings: 3, errors: 3,
      relationships: 3, addresses: 3, affiliations: 3, engagement: 3
    },
    groupCenters: [
      { x: 0.40, y: 0.30 },
      { x: 0.18, y: 0.65 },
      { x: 0.75, y: 0.68 },
      { x: 0.82, y: 0.30 },
    ],
    seeds: {
      donations:     { angle:  0.00, ring: 0.45 },
      contacts:      { angle:  0.50, ring: 0.50 },
      recurring:     { angle:  0.25, ring: 0.65 },
      softcredits:   { angle: -0.25, ring: 0.60 },
      rollups:       { angle:  1.60, ring: 0.65 },
      batch:         { angle:  2.00, ring: 0.70 },
      allocations:   { angle:  1.80, ring: 0.80 },
      levels:        { angle:  2.30, ring: 0.85 },
      bdi:           { angle: -1.20, ring: 0.70 },
      giftentry:     { angle: -1.50, ring: 0.75 },
      elevate:       { angle: -1.00, ring: 0.80 },
      tdtm:          { angle: -0.50, ring: 0.40 },
      settings:      { angle: -0.70, ring: 0.45 },
      errors:        { angle: -0.90, ring: 0.50 },
      relationships: { angle:  0.80, ring: 0.85 },
      addresses:     { angle: -2.30, ring: 0.75 },
      affiliations:  { angle:  0.70, ring: 0.80 },
      engagement:    { angle: -1.80, ring: 0.85 },
    }
  },
};
