// ══════════════════════════════════════════════════════════════
//  Revenue Cloud Product Configuration
//  Metadata consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

// Package registry: Revenue Cloud is a native Salesforce product (no managed packages)
export const PACKAGES = {
  core: { name: 'Revenue Cloud Core', prefix: '', abbr: 'RC', color: '#4d8bff' },
};

export default {
  id: 'revenue',
  name: 'Revenue Cloud',
  fullName: 'Salesforce Revenue Cloud',
  title: 'Revenue Cloud Explorer',
  version: 'Spring \'26',
  description: 'End-to-end revenue lifecycle management on Salesforce',
  color: '#4d8bff',
  docUrl: 'https://help.salesforce.com/s/articleView?id=ind.revenue_lifecycle_management.htm&type=5',
  entityTypes: ['objects'],
  localStoragePrefix: 'revenue',
  aiWorkerUrl: 'https://npsp-ai-search.epug.workers.dev',
  analytics: {
    gaId: 'G-HJTE1NYP82',
  },
  stats: {
    objects: 54,
    domains: 14,
    components: 70,
  },
  physics: {
    weights: {
      catalog: 60, pricing: 55, rates: 25, configurator: 40,
      transactions: 80, procedures: 50, approvals: 20,
      orchestrator: 45, usage: 20, billing: 90,
      agentforce: 15, promotions: 15, intelligence: 20, setup: 50
    },
    foundational: { setup: 1.8, procedures: 1.5, catalog: 1.3 },
    groups: {
      transactions: 0, approvals: 0, orchestrator: 0,
      catalog: 1, pricing: 1, rates: 1, configurator: 1, promotions: 1,
      usage: 2, billing: 2,
      procedures: 3, agentforce: 3, intelligence: 3, setup: 3
    },
    groupCenters: [
      { x: 0.35, y: 0.30 },
      { x: 0.20, y: 0.68 },
      { x: 0.75, y: 0.65 },
      { x: 0.80, y: 0.28 },
    ],
    seeds: {
      transactions:  { angle:  0.00, ring: 0.40 },
      approvals:     { angle:  0.40, ring: 0.55 },
      orchestrator:  { angle: -0.30, ring: 0.55 },
      catalog:       { angle:  1.80, ring: 0.55 },
      pricing:       { angle:  2.10, ring: 0.60 },
      rates:         { angle:  2.40, ring: 0.75 },
      configurator:  { angle:  1.50, ring: 0.65 },
      promotions:    { angle:  2.70, ring: 0.80 },
      usage:         { angle: -1.20, ring: 0.65 },
      billing:       { angle: -1.00, ring: 0.55 },
      procedures:    { angle: -0.60, ring: 0.45 },
      agentforce:    { angle: -0.80, ring: 0.75 },
      intelligence:  { angle: -1.50, ring: 0.80 },
      setup:         { angle: -0.40, ring: 0.40 },
    }
  },
};
