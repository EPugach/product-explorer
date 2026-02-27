// ══════════════════════════════════════════════════════════════
//  NPSP Product Configuration
//  Metadata consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

// Package registry: NPSP installs as 6 managed packages
export const PACKAGES = {
  cumulus: { name: 'Nonprofit Success Pack', prefix: 'npsp__',  abbr: 'Cumulus', color: '#4d8bff' },
  npe01:   { name: 'Contacts & Organizations', prefix: 'npe01__', abbr: 'C&O',     color: '#10b981' },
  npo02:   { name: 'Households',               prefix: 'npo02__', abbr: 'HH',      color: '#f59e0b' },
  npe03:   { name: 'Recurring Donations',      prefix: 'npe03__', abbr: 'RD',      color: '#ef4444' },
  npe4:    { name: 'Relationships',            prefix: 'npe4__',  abbr: 'REL',     color: '#8b5cf6' },
  npe5:    { name: 'Affiliations',             prefix: 'npe5__',  abbr: 'AFFL',    color: '#ec4899' },
};

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
