// ══════════════════════════════════════════════════════════════
//  OmniStudio Product Configuration
//  Metadata consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

export const PACKAGES = {
  omnistudio: { name: 'OmniStudio', prefix: '', abbr: 'OS', color: '#8b5cf6' }
};

export default {
  id: 'omnistudio',
  name: 'OmniStudio',
  fullName: 'Salesforce OmniStudio',
  title: 'OmniStudio Explorer',
  version: "Spring '26",
  description: 'Low-code suite for building guided digital experiences with OmniScripts, FlexCards, Data Mappers, and Integration Procedures',
  color: '#8b5cf6',
  entityTypes: ['objects', 'metadata'],
  localStoragePrefix: 'omnistudio',
  aiWorkerUrl: 'https://npsp-ai-search.epug.workers.dev',
  analytics: {
    gaId: 'G-HJTE1NYP82',
  },
  stats: {
    objects: 12,
    metadata: 0,
    domains: 12,
    components: 51,
  },
  physics: {
    weights: {
      omniscripts: 95, integration: 80, datamappers: 70, flexcards: 65,
      formulas: 55, config: 45, deployment: 40,
      analytics: 30, experience: 25, lwc: 20, testing: 18, agentforce: 15
    },
    foundational: { config: 2.0, formulas: 1.5, datamappers: 1.3 },
    groups: {
      omniscripts: 0, flexcards: 0, integration: 0, datamappers: 0,
      formulas: 1, lwc: 1, config: 1,
      experience: 2, agentforce: 2, analytics: 2,
      testing: 3, deployment: 3
    },
    groupCenters: [
      { x: 0.35, y: 0.32 },
      { x: 0.20, y: 0.70 },
      { x: 0.75, y: 0.68 },
      { x: 0.80, y: 0.30 },
    ],
    seeds: {
      omniscripts:  { angle:  0.00, ring: 0.35 },
      flexcards:    { angle:  0.60, ring: 0.50 },
      integration:  { angle: -0.40, ring: 0.45 },
      datamappers:  { angle:  0.30, ring: 0.60 },
      formulas:     { angle:  1.80, ring: 0.60 },
      lwc:          { angle:  2.20, ring: 0.75 },
      config:       { angle:  1.50, ring: 0.50 },
      experience:   { angle: -1.20, ring: 0.65 },
      agentforce:   { angle: -1.50, ring: 0.75 },
      analytics:    { angle: -1.00, ring: 0.70 },
      testing:      { angle: -0.60, ring: 0.70 },
      deployment:   { angle: -0.80, ring: 0.60 },
    }
  },
};
