// ══════════════════════════════════════════════════════════════
//  Education Cloud Product Configuration
//  Metadata consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

export const PACKAGES = {
  educationcloud: { name: 'Education Cloud', prefix: '', abbr: 'EC', color: '#10b981' }
};

export default {
  id: 'educationcloud',
  name: 'Education Cloud',
  fullName: 'Salesforce Education Cloud',
  title: 'Education Cloud Explorer',
  version: "Spring '26",
  description: "Education Cloud connects institutions across recruitment, admissions, and student success for a unified view of every learner\u2019s journey.",
  color: '#10b981',
  docUrl: 'https://help.salesforce.com/s/articleView?id=sfdo.education_cloud.htm&language=en_US&type=5',
  entityTypes: ['objects', 'metadata'],
  localStoragePrefix: 'educationcloud',
  aiWorkerUrl: 'https://npsp-ai-search.epug.workers.dev',
  analytics: {
    gaId: 'G-HJTE1NYP82',
  },
  stats: {
    objects: 54,
    metadata: 6,
    domains: 14,
    components: 68
  },
  physics: {
    weights: {
      records: 90,
      enrollment: 85,
      academics: 75,
      admissions: 70,
      financials: 65,
      recruitment: 60,
      success: 55,
      alumni: 40,
      mentoring: 30,
      appointments: 25,
      analytics: 20,
      experience: 18,
      agentforce: 15,
      data360: 12
    },
    foundational: {
      records: 2.0,
      academics: 1.5,
      enrollment: 1.3
    },
    groups: {
      recruitment: 0,
      admissions: 0,
      academics: 0,
      enrollment: 0,
      records: 0,
      success: 1,
      mentoring: 1,
      appointments: 1,
      financials: 2,
      alumni: 2,
      analytics: 3,
      agentforce: 3,
      experience: 3,
      data360: 3
    },
    groupCenters: [
      { x: 0.35, y: 0.30 },
      { x: 0.20, y: 0.68 },
      { x: 0.75, y: 0.65 },
      { x: 0.80, y: 0.28 }
    ],
    seeds: {
      records:      { angle:  0.00, ring: 0.35 },
      enrollment:   { angle:  0.40, ring: 0.45 },
      academics:    { angle: -0.30, ring: 0.45 },
      admissions:   { angle:  0.80, ring: 0.55 },
      recruitment:  { angle:  1.20, ring: 0.60 },
      success:      { angle:  1.80, ring: 0.55 },
      mentoring:    { angle:  2.10, ring: 0.70 },
      appointments: { angle:  2.40, ring: 0.75 },
      financials:   { angle: -1.00, ring: 0.55 },
      alumni:       { angle: -1.30, ring: 0.70 },
      analytics:    { angle: -0.50, ring: 0.65 },
      agentforce:   { angle: -0.70, ring: 0.75 },
      experience:   { angle: -1.60, ring: 0.80 },
      data360:      { angle: -2.00, ring: 0.80 }
    }
  }
};
