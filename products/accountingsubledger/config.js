// ══════════════════════════════════════════════════════════════
//  Accounting Subledger Product Configuration
//  Metadata consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

export const PACKAGES = {
  accountingsubledger: { name: 'Accounting Subledger', prefix: '', abbr: 'AS', color: '#ec4899' }
};

export default {
  id: 'accountingsubledger',
  name: 'Accounting Subledger',
  fullName: 'Salesforce Accounting Subledger',
  title: 'Accounting Subledger Explorer',
  version: "Spring '26",
  description: 'Salesforce Accounting Subledger product documentation',
  color: '#ec4899',
  docUrl: 'https://help.salesforce.com/s/articleView?id=sfdo.accounting_subledger.htm&language=en_US&type=5',
  entityTypes: ['objects', 'metadata'],
  localStoragePrefix: 'accountingsubledger',
  aiWorkerUrl: 'https://npsp-ai-search.epug.workers.dev',
  analytics: {
    gaId: 'G-HJTE1NYP82',
  },
  stats: {
    objects: 6,
    metadata: 9,
    domains: 9,
    components: 35
  },
  physics: {
    weights: {
      transaction_journals: 90,
      accounting_sets: 80,
      job_engine: 70,
      fund_accounting: 60,
      revenue_recognition: 55,
      setup: 50,
      source_objects: 45,
      adjustments: 40,
      data_export: 30
    },
    foundational: {
      transaction_journals: 2.0,
      accounting_sets: 1.5
    },
    groups: {
      transaction_journals: 0, fund_accounting: 0,
      accounting_sets: 1, source_objects: 1,
      job_engine: 2, revenue_recognition: 2, adjustments: 2,
      data_export: 3, setup: 3
    },
    groupCenters: [
      { x: 0.30, y: 0.35 },
      { x: 0.70, y: 0.30 },
      { x: 0.25, y: 0.70 },
      { x: 0.75, y: 0.70 }
    ],
    seeds: {
      transaction_journals: { angle:  0.00, ring: 0.35 },
      accounting_sets:      { angle:  1.80, ring: 0.45 },
      fund_accounting:      { angle: -0.80, ring: 0.50 },
      revenue_recognition:  { angle:  0.80, ring: 0.55 },
      job_engine:           { angle: -0.40, ring: 0.45 },
      adjustments:          { angle:  1.20, ring: 0.65 },
      data_export:          { angle: -1.50, ring: 0.75 },
      source_objects:       { angle:  2.40, ring: 0.65 },
      setup:                { angle: -0.20, ring: 0.70 }
    }
  }
};
