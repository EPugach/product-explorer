// ══════════════════════════════════════════════════════════════
//  NPSP Product Configuration
//  Metadata consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

export default {
  id: 'npsp',
  name: 'NPSP',
  fullName: 'Nonprofit Success Pack',
  title: 'NPSP Explorer',
  version: '3.x',
  description: 'The most widely adopted nonprofit technology on Salesforce',
  color: '#4d8bff',
  repoUrl: 'https://github.com/SalesforceFoundation/NPSP',
  entityTypes: ['classes', 'objects', 'triggers', 'lwcs', 'metadata'],
  localStoragePrefix: 'npsp',
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
};
