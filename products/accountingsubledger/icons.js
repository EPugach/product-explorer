// ══════════════════════════════════════════════════════════════
//  Accounting Subledger — Domain Icon SVG Paths
//  Keys must match domain IDs in data.js
//  SVG paths assume viewBox="0 0 24 24", stroke-width 1.5px
// ══════════════════════════════════════════════════════════════

export const DOMAIN_PATHS = {

  // Transaction Journals — open book/ledger
  transaction_journals:
    '<path d="M4 19.5A2.5 2.5 0 016.5 17H20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M9 7h6M9 11h4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',

  // Accounting Sets — gear with document
  accounting_sets:
    '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
    '<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',

  // Fund Accounting — bank/institution
  fund_accounting:
    '<path d="M3 21h18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M5 21V7l7-4 7 4v14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M9 21v-6h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',

  // Revenue Recognition — trending up chart
  revenue_recognition:
    '<path d="M23 6l-9.5 9.5-5-5L1 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M17 6h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',

  // Job Engine — server/processing
  job_engine:
    '<rect x="2" y="2" width="20" height="8" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
    '<rect x="2" y="14" width="20" height="8" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
    '<circle cx="6" cy="6" r="1" fill="currentColor" stroke="none"/>' +
    '<circle cx="6" cy="18" r="1" fill="currentColor" stroke="none"/>',

  // Data Adjustments — refresh/cycle arrows
  adjustments:
    '<path d="M1 4v6h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M23 20v-6h-6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',

  // Data Export — upload/export arrow
  data_export:
    '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M17 8l-5-5-5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M12 3v12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',

  // Source Data Models — database/layers
  source_objects:
    '<ellipse cx="12" cy="5" rx="9" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
    '<path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
    '<path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" fill="none" stroke="currentColor" stroke-width="1.5"/>',

  // Setup & Security — shield with lock
  setup:
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M12 11v3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
    '<circle cx="12" cy="10" r="1" fill="currentColor" stroke="none"/>'

};
