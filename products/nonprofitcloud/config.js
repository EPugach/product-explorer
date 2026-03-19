// ══════════════════════════════════════════════════════════════
//  Nonprofit Cloud Product Configuration
//  Metadata consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

export const PACKAGES = {
  nonprofitcloud: { name: 'Nonprofit Cloud', prefix: '', abbr: 'NC', color: '#f59e0b' }
};

export default {
  id: 'nonprofitcloud',
  name: 'Nonprofit Cloud',
  fullName: 'Salesforce Nonprofit Cloud',
  title: 'Nonprofit Cloud Explorer',
  version: "Spring '26",
  description: 'Salesforce Nonprofit Cloud product documentation',
  color: '#f59e0b',
  docUrl: 'https://help.salesforce.com/s/articleView?id=sfdo.nonprofit_cloud.htm&language=en_US&type=5',
  entityTypes: ['objects', 'metadata'],
  localStoragePrefix: 'nonprofitcloud',
  aiWorkerUrl: 'https://npsp-ai-search.epug.workers.dev',
  analytics: {
    gaId: 'G-HJTE1NYP82',
  },
  stats: {
    objects: 73,
    metadata: 4,
    domains: 20,
    components: 78
  },
  physics: {
    weights: {
      // Group 0: Constituent core (upper-left)
      constituents: 95,
      households: 55,
      relationships: 50,
      contact_points: 40,
      security: 25,
      // Group 1: Fundraising pipeline (upper-right)
      fundraising: 90,
      campaigns: 65,
      gift_commitments: 70,
      gift_transactions: 80,
      gift_entry: 60,
      // Group 2: Gift management & infrastructure (lower-left)
      designations: 55,
      soft_credits: 35,
      action_plans: 30,
      agentforce: 35,
      setup: 45,
      // Group 3: Programs & services (lower-right)
      programs: 75,
      case_management: 60,
      outcomes: 40,
      volunteers: 55,
      grantmaking: 50
    },
    foundational: {
      constituents: 2.0,
      fundraising: 1.5,
      setup: 1.3
    },
    groups: {
      // Group 0: Constituent core
      constituents: 0,
      households: 0,
      relationships: 0,
      contact_points: 0,
      security: 0,
      // Group 1: Fundraising pipeline
      fundraising: 1,
      campaigns: 1,
      gift_commitments: 1,
      gift_transactions: 1,
      gift_entry: 1,
      // Group 2: Gift management & infrastructure
      designations: 2,
      soft_credits: 2,
      action_plans: 2,
      agentforce: 2,
      setup: 2,
      // Group 3: Programs & services
      programs: 3,
      case_management: 3,
      outcomes: 3,
      volunteers: 3,
      grantmaking: 3
    },
    groupCenters: [
      { x: 0.25, y: 0.3 },
      { x: 0.75, y: 0.3 },
      { x: 0.25, y: 0.7 },
      { x: 0.75, y: 0.7 }
    ],
    seeds: {
      // Group 0: Constituent core (upper-left quadrant)
      constituents:   { angle: -1.57, ring: 0.3 },
      households:     { angle: -1.05, ring: 0.5 },
      relationships:  { angle: -2.09, ring: 0.5 },
      contact_points: { angle: -0.79, ring: 0.65 },
      security:       { angle: -2.62, ring: 0.8 },
      // Group 1: Fundraising pipeline (upper-right quadrant)
      fundraising:      { angle: 0.0, ring: 0.35 },
      campaigns:        { angle: 0.52, ring: 0.55 },
      gift_commitments: { angle: -0.26, ring: 0.5 },
      gift_transactions:{ angle: 0.26, ring: 0.4 },
      gift_entry:       { angle: -0.52, ring: 0.6 },
      // Group 2: Gift management & infrastructure (lower-left quadrant)
      designations: { angle: 2.36, ring: 0.5 },
      soft_credits: { angle: 2.62, ring: 0.65 },
      action_plans: { angle: 2.88, ring: 0.75 },
      agentforce:   { angle: 2.09, ring: 0.6 },
      setup:        { angle: 3.14, ring: 0.45 },
      // Group 3: Programs & services (lower-right quadrant)
      programs:        { angle: 1.05, ring: 0.4 },
      case_management: { angle: 1.31, ring: 0.55 },
      outcomes:        { angle: 0.79, ring: 0.65 },
      volunteers:      { angle: 1.57, ring: 0.5 },
      grantmaking:     { angle: 1.83, ring: 0.7 }
    }
  }
};
