// ══════════════════════════════════════════════════════════════
//  Public Sector Solutions Product Configuration
//  Metadata consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

export const PACKAGES = {
  core: { name: 'Public Sector Solutions', prefix: '', abbr: 'PSS', color: '#14b8a6' }
};

export default {
  id: 'publicsectorsolutions',
  name: 'Public Sector Solutions',
  fullName: 'Salesforce Public Sector Solutions',
  title: 'Public Sector Solutions Explorer',
  version: "Spring '26",
  description: 'Salesforce Public Sector Solutions product documentation',
  color: '#14b8a6',
  entityTypes: ['objects', 'metadata'],
  localStoragePrefix: 'publicsectorsolutions',
  aiWorkerUrl: 'https://npsp-ai-search.epug.workers.dev',
  analytics: {
    gaId: 'G-HJTE1NYP82',
  },
  docUrl: 'https://help.salesforce.com/s/articleView?id=ind.psc_admin_concept_psc_welcom.htm&type=5',
  stats: {
    objects: 138,
    domains: 18,
    components: 92
  },
  physics: {
    weights: {
      setup_and_security: 40, common_features: 75, licensing_and_permitting: 85,
      inspections: 65, social_programs: 70, benefit_management: 80,
      social_insurance: 55, provider_management: 50, investigative_cases: 60,
      talent_recruitment: 65, agentforce: 45, einstein_ai: 35,
      data_360: 30, experience_cloud: 55, crm_analytics: 30,
      emergency_and_assets: 35, employee_experience: 40, grantmaking: 60
    },
    foundational: {
      common_features: 2.0,
      licensing_and_permitting: 1.5,
      benefit_management: 1.3
    },
    groups: {
      setup_and_security: 3, common_features: 0, licensing_and_permitting: 0, inspections: 0,
      social_programs: 1, benefit_management: 1, social_insurance: 1, provider_management: 1,
      investigative_cases: 2, talent_recruitment: 2, agentforce: 3, einstein_ai: 3,
      data_360: 3, experience_cloud: 2, crm_analytics: 3,
      emergency_and_assets: 2, employee_experience: 2, grantmaking: 1
    },
    groupCenters: [
      { x: 0.30, y: 0.30 },
      { x: 0.70, y: 0.30 },
      { x: 0.30, y: 0.70 },
      { x: 0.70, y: 0.70 }
    ],
    seeds: {
      setup_and_security:       { angle: -2.80, ring: 0.80 },
      common_features:          { angle:  0.00, ring: 0.30 },
      licensing_and_permitting:  { angle:  0.60, ring: 0.35 },
      inspections:              { angle:  1.20, ring: 0.50 },
      social_programs:          { angle: -0.80, ring: 0.40 },
      benefit_management:       { angle: -0.40, ring: 0.35 },
      social_insurance:         { angle: -1.20, ring: 0.55 },
      provider_management:      { angle: -1.60, ring: 0.60 },
      investigative_cases:      { angle:  2.00, ring: 0.55 },
      talent_recruitment:       { angle:  2.50, ring: 0.50 },
      agentforce:               { angle: -2.20, ring: 0.65 },
      einstein_ai:              { angle: -2.50, ring: 0.75 },
      data_360:                 { angle:  3.00, ring: 0.80 },
      experience_cloud:         { angle:  1.60, ring: 0.60 },
      crm_analytics:            { angle: -3.00, ring: 0.85 },
      emergency_and_assets:     { angle:  2.80, ring: 0.70 },
      employee_experience:      { angle:  1.80, ring: 0.75 },
      grantmaking:              { angle: -0.10, ring: 0.55 }
    }
  }
};
