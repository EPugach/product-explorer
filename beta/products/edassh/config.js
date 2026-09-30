// ══════════════════════════════════════════════════════════════
//  EDA & Student Success Hub Product Configuration
//  Metadata consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

export const PACKAGES = {
  edassh: { name: 'EDA & Student Success Hub', prefix: '', abbr: 'E&SSH', color: '#ef4444' }
};

export default {
  id: 'edassh',
  name: 'EDA & Student Success Hub',
  fullName: 'Salesforce EDA & Student Success Hub',
  title: 'EDA & Student Success Hub Explorer',
  version: "Spring '26",
  docUrl: 'https://help.salesforce.com/s/articleView?id=sfdo.education_data_architecture.htm&language=en_US&type=5',
  description: 'Education Data Architecture provides the foundational data model for higher education on Salesforce, while Student Success Hub adds advising, alerts, and success planning to support student persistence and completion.',
  color: '#ef4444',
  entityTypes: ['objects', 'metadata'],
  localStoragePrefix: 'edassh',
  aiWorkerUrl: 'https://npsp-ai-search.epug.workers.dev',
  analytics: {
    gaId: 'G-HJTE1NYP82',
  },
  stats: {
    objects: 45,
    metadata: 4,
    domains: 15,
    components: 63
  },
  physics: {
    weights: {
      accounts_contacts: 95,
      relationships: 55,
      affiliations: 65,
      academic_programs: 80,
      courses: 75,
      academic_performance: 60,
      education_history: 40,
      behavior: 30,
      tdtm_settings: 50,
      student_cases: 90,
      success_plans: 70,
      alerts: 65,
      appointments: 60,
      pathways: 45,
      student_portal: 55
    },
    foundational: {
      accounts_contacts: 2.0,
      student_cases: 1.8,
      academic_programs: 1.3
    },
    groups: {
      accounts_contacts: 0,
      relationships: 0,
      affiliations: 0,
      education_history: 0,
      academic_programs: 1,
      courses: 1,
      academic_performance: 1,
      pathways: 1,
      student_cases: 2,
      success_plans: 2,
      alerts: 2,
      appointments: 2,
      tdtm_settings: 3,
      behavior: 3,
      student_portal: 3
    },
    groupCenters: [
      { x: 0.30, y: 0.28 },
      { x: 0.75, y: 0.28 },
      { x: 0.25, y: 0.72 },
      { x: 0.75, y: 0.72 }
    ],
    seeds: {
      accounts_contacts:    { angle:  0.00, ring: 0.30 },
      relationships:        { angle:  0.60, ring: 0.55 },
      affiliations:         { angle: -0.40, ring: 0.50 },
      education_history:    { angle:  1.00, ring: 0.70 },
      academic_programs:    { angle:  1.50, ring: 0.40 },
      courses:              { angle:  1.80, ring: 0.55 },
      academic_performance: { angle:  2.20, ring: 0.65 },
      pathways:             { angle:  2.60, ring: 0.75 },
      student_cases:        { angle: -1.20, ring: 0.35 },
      success_plans:        { angle: -1.60, ring: 0.50 },
      alerts:               { angle: -0.80, ring: 0.55 },
      appointments:         { angle: -2.00, ring: 0.65 },
      tdtm_settings:        { angle:  3.00, ring: 0.70 },
      behavior:             { angle: -2.80, ring: 0.80 },
      student_portal:       { angle: -2.40, ring: 0.75 }
    }
  }
};
