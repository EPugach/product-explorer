// ══════════════════════════════════════════════════════════════
//  Life Sciences Cloud Product Configuration
//  Metadata consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

export const PACKAGES = {
  core: { name: 'Life Sciences Cloud', prefix: '', abbr: 'LSC', color: '#f97316' },
  addon: { name: 'Life Sciences Cloud Add-on', prefix: '', abbr: 'LSC+', color: '#65A30D' }
};

export default {
  id: 'lifesciencescloud',
  name: 'Life Sciences Cloud',
  fullName: 'Salesforce Life Sciences Cloud',
  title: 'Life Sciences Cloud Explorer',
  version: "Spring '26",
  description: 'Interactive architecture visualization of Salesforce Life Sciences Cloud covering Customer Engagement, Clinical Engagement, Patient Engagement, MedTech Commercial, and Agentforce.',
  color: '#f97316',
  docUrl: 'https://help.salesforce.com/s/articleView?id=ind.admin_life_sciences.htm&language=en_US&type=5',
  entityTypes: ['objects', 'metadata'],
  localStoragePrefix: 'lifesciencescloud',
  aiWorkerUrl: 'https://npsp-ai-search.epug.workers.dev',
  feedbackScriptUrl: 'https://script.google.com/macros/s/AKfycbzLUgLAV3oFvnwaTwlTDq0-rIc3x3pb26U-IVfXtYjGBCsM-HAz7AycVaOX2hBCxxrHkg/exec',
  analytics: {
    gaId: 'G-HJTE1NYP82',
  },
  stats: {
    objects: 104,
    metadata: 13,
    domains: 15,
    components: 95
  },
  physics: {
    weights: {
      account_mgmt: 90,
      engagement_planning: 75,
      engagement_execution: 85,
      intelligent_content: 65,
      product_mgmt: 60,
      sample_mgmt: 55,
      common_components: 50,
      participant_mgmt: 60,
      site_mgmt: 50,
      advanced_therapy: 55,
      care_programs: 70,
      pharmacy_benefits: 60,
      medtech: 55,
      agentforce: 40,
      platform_extensions: 35
    },
    foundational: {
      account_mgmt: 2.0,
      engagement_execution: 1.5,
      care_programs: 1.3
    },
    groups: {
      // 0 = Customer Engagement Core
      account_mgmt: 0,
      engagement_planning: 0,
      engagement_execution: 0,
      intelligent_content: 0,
      product_mgmt: 0,
      sample_mgmt: 0,
      common_components: 0,
      // 1 = Clinical Engagement
      participant_mgmt: 1,
      site_mgmt: 1,
      // 2 = Patient Engagement
      advanced_therapy: 2,
      care_programs: 2,
      pharmacy_benefits: 2,
      // 3 = MedTech + AI + Platform
      medtech: 3,
      agentforce: 3,
      platform_extensions: 3
    },
    groupCenters: [
      { x: 0.35, y: 0.25 },
      { x: 0.80, y: 0.25 },
      { x: 0.25, y: 0.75 },
      { x: 0.75, y: 0.75 }
    ],
    seeds: {
      // Group 0: Customer Engagement Core (spread across top-left quadrant)
      account_mgmt:        { angle: -1.2, ring: 0.35 },
      engagement_planning: { angle: -0.6, ring: 0.45 },
      engagement_execution:{ angle: -0.2, ring: 0.35 },
      intelligent_content: { angle: 0.2,  ring: 0.50 },
      product_mgmt:        { angle: -1.8, ring: 0.50 },
      sample_mgmt:         { angle: -2.2, ring: 0.55 },
      common_components:   { angle: 0.6,  ring: 0.55 },
      // Group 1: Clinical Engagement (top-right)
      participant_mgmt:    { angle: 0.9,  ring: 0.45 },
      site_mgmt:           { angle: 1.3,  ring: 0.50 },
      // Group 2: Patient Engagement (bottom-left)
      advanced_therapy:    { angle: -2.6, ring: 0.55 },
      care_programs:       { angle: 2.5,  ring: 0.40 },
      pharmacy_benefits:   { angle: 2.9,  ring: 0.55 },
      // Group 3: MedTech + AI + Platform (bottom-right)
      medtech:             { angle: 1.8,  ring: 0.55 },
      agentforce:          { angle: 2.2,  ring: 0.65 },
      platform_extensions: { angle: 1.5,  ring: 0.70 }
    }
  }
};
