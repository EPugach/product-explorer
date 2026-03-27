// ══════════════════════════════════════════════════════════════
//  Consumer Goods Cloud Product Configuration
//  Metadata consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

export const PACKAGES = {
  consumergoods: { name: 'Consumer Goods Cloud', prefix: 'cgcloud__', abbr: 'RCG', color: '#06b6d4' }
};

export default {
  id: 'consumergoods',
  name: 'Consumer Goods Cloud',
  fullName: 'Salesforce Consumer Goods Cloud',
  title: 'Consumer Goods Cloud Explorer',
  version: "Spring '26",
  description: 'A unified industry CRM platform for consumer goods manufacturers, distributors, and retailers. Combines Retail Execution for store visits, assessments, and DSD delivery with Trade Promotion Management for planning, budgeting, and settling promotional activities. Powered by Agentforce AI, Einstein recommendations, Data Cloud integration, and CRM Analytics.',
  color: '#06b6d4',
  docUrl: 'https://help.salesforce.com/s/products/consumergoods?language=en_US',
  entityTypes: ['objects', 'metadata'],
  localStoragePrefix: 'consumergoods',
  aiWorkerUrl: 'https://npsp-ai-search.epug.workers.dev',
  analytics: {
    gaId: 'G-HJTE1NYP82',
  },
  stats: {
    objects: 154,
    metadata: 1,
    domains: 16,
    components: 87
  },
  physics: {
    weights: {
      // Group 0: Retail Execution core (upper-left)
      accounts_stores: 90,
      products_assortments: 75,
      visit_planning: 70,
      visit_execution: 95,
      // Group 1: Retail Execution operational (upper-right)
      van_sales: 60,
      mobile_app: 50,
      maps_territory: 35,
      // Group 2: Trade Promotion Management (lower-left)
      tpm_master_data: 65,
      promotions: 85,
      funds_budgets: 55,
      claims: 45,
      account_planning: 50,
      // Group 3: Platform & Analytics (lower-right)
      analytics: 60,
      agentforce: 40,
      einstein_ai: 35,
      data_cloud: 30
    },
    foundational: {
      accounts_stores: 2.0,
      visit_execution: 1.5,
      promotions: 1.5
    },
    groups: {
      // Group 0: Retail Execution core
      accounts_stores: 0,
      products_assortments: 0,
      visit_planning: 0,
      visit_execution: 0,
      // Group 1: Retail Execution operational
      van_sales: 1,
      mobile_app: 1,
      maps_territory: 1,
      // Group 2: Trade Promotion Management
      tpm_master_data: 2,
      promotions: 2,
      funds_budgets: 2,
      claims: 2,
      account_planning: 2,
      // Group 3: Platform & Analytics
      analytics: 3,
      agentforce: 3,
      einstein_ai: 3,
      data_cloud: 3
    },
    groupCenters: [
      { x: 0.25, y: 0.3 },
      { x: 0.75, y: 0.3 },
      { x: 0.25, y: 0.7 },
      { x: 0.75, y: 0.7 }
    ],
    seeds: {
      // Group 0: Retail Execution core (upper-left quadrant)
      accounts_stores:      { angle: -1.57, ring: 0.3 },
      products_assortments: { angle: -1.05, ring: 0.5 },
      visit_planning:       { angle: -2.09, ring: 0.5 },
      visit_execution:      { angle: -0.79, ring: 0.35 },
      // Group 1: Retail Execution operational (upper-right quadrant)
      van_sales:       { angle: 0.0, ring: 0.45 },
      mobile_app:      { angle: 0.52, ring: 0.55 },
      maps_territory:  { angle: -0.26, ring: 0.7 },
      // Group 2: Trade Promotion Management (lower-left quadrant)
      tpm_master_data: { angle: 2.62, ring: 0.45 },
      promotions:      { angle: 2.09, ring: 0.35 },
      funds_budgets:   { angle: 2.88, ring: 0.6 },
      claims:          { angle: 3.14, ring: 0.65 },
      account_planning:{ angle: 2.36, ring: 0.55 },
      // Group 3: Platform & Analytics (lower-right quadrant)
      analytics:   { angle: 1.05, ring: 0.4 },
      agentforce:  { angle: 0.52, ring: 0.6 },
      einstein_ai: { angle: 1.57, ring: 0.55 },
      data_cloud:  { angle: 1.31, ring: 0.7 }
    }
  }
};
