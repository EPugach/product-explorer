// ══════════════════════════════════════════════════════════════
//  DOC MAPPING — Links documentation files to components
//  Key format: "domain.componentId"
//  Value: array of doc paths relative to Documentation/
// ══════════════════════════════════════════════════════════════

var DOC_MAPPING = {
  // ── Donations & Payments ──
  "donations.opp-naming": [
    "Manage_Donations_and_Other_Gift_Types/index.md"
  ],
  "donations.payments": [
    "Configure_NPSP_Installation/Configure_Opportunity_Payments_in_NPSP.md",
    "Manage_Donations_and_Other_Gift_Types/index.md"
  ],
  "donations.donor-stats": [
    "Manage_Donations_and_Other_Gift_Types/index.md"
  ],
  "donations.matching-gifts": [
    "Configure_NPSP_Installation/Configure_Matching_Gifts.md"
  ],
  "donations.contact-roles": [
    "Manage_Donations_and_Other_Gift_Types/index.md"
  ],
  "donations.cascade-delete": [],

  // ── Contacts & Households ──
  "contacts.household-model": [
    "Manage_NPSP_Constituents/index.md"
  ],
  "contacts.hh-naming": [
    "Manage_NPSP_Constituents/index.md"
  ],
  "contacts.contact-merge": [
    "Manage_NPSP_Constituents/index.md"
  ],
  "contacts.acct-merge": [
    "Manage_NPSP_Constituents/index.md"
  ],

  // ── Recurring Donations (RD2) ──
  "recurring.rd2-engine": [
    "Configure_NPSP_Installation/Configure_Recurring_Donations.md"
  ],
  "recurring.rd2-status": [
    "Configure_NPSP_Installation/Configure_Recurring_Donations.md"
  ],
  "recurring.rd2-schedule": [
    "Configure_NPSP_Installation/Configure_Recurring_Donations.md"
  ],
  "recurring.rd2-batch": [
    "Configure_NPSP_Installation/Configure_Recurring_Donations.md"
  ],
  "recurring.rd2-elevate": [
    "Configure_NPSP_Installation/Configure_Recurring_Donations.md"
  ],

  // ── Customizable Rollups ──
  "rollups.crlp-engine": [
    "Configure_NPSP_Installation/Configure_Customizable_Rollups.md",
    "NPSP_Packaged_Rollups/index.md"
  ],
  "rollups.crlp-batch": [
    "Configure_NPSP_Installation/Configure_Customizable_Rollups.md"
  ],
  "rollups.crlp-cmdt": [
    "Configure_NPSP_Installation/Configure_Customizable_Rollups.md"
  ],

  // ── Soft Credits ──
  "softcredits.opp-softcredit": [
    "Configure_NPSP_Installation/Configure_Automated_and_Manual_Soft_Credits.md"
  ],
  "softcredits.partial-softcredit": [
    "Configure_NPSP_Installation/Configure_Automated_and_Manual_Soft_Credits.md"
  ],

  // ── Donation Allocations ──
  "allocations.gau": [
    "Configure_NPSP_Installation/Configure_Donation_Allocations.md"
  ],
  "allocations.alloc-engine": [
    "Configure_NPSP_Installation/Configure_Donation_Allocations.md"
  ],
  "allocations.alloc-multi": [
    "Configure_NPSP_Installation/Configure_Donation_Allocations.md"
  ],

  // ── TDTM Framework ──
  "tdtm.tdtm-dispatcher": [
    "Configure_NPSP_Installation/Advanced_NPSP_Configurations.md"
  ],
  "tdtm.tdtm-config": [
    "Configure_NPSP_Installation/Advanced_NPSP_Configurations.md"
  ],
  "tdtm.tdtm-recursion": [
    "Configure_NPSP_Installation/Advanced_NPSP_Configurations.md"
  ],

  // ── Batch Processing ──
  "batch.batch-framework": [
    "Ongoing_NPSP_Administration/index.md"
  ],
  "batch.rd-batch": [
    "Ongoing_NPSP_Administration/index.md"
  ],
  "batch.legacy-batches": [
    "Legacy_NPSP_Documentation/index.md"
  ],
  "batch.other-batches": [
    "Ongoing_NPSP_Administration/index.md"
  ],

  // ── Relationships ──
  "relationships.rel-engine": [
    "Configure_NPSP_Installation/Manage_Relationships_Settings.md"
  ],
  "relationships.rel-contact": [
    "Configure_NPSP_Installation/Manage_Relationships_Settings.md"
  ],
  "relationships.rel-campaign": [
    "Configure_NPSP_Installation/Manage_Relationships_Settings.md"
  ],

  // ── Address Management ──
  "addresses.addr-engine": [
    "Configure_NPSP_Installation/Configure_Address_Management.md"
  ],
  "addresses.addr-contact": [
    "Configure_NPSP_Installation/Configure_Address_Management.md"
  ],
  "addresses.addr-verify": [
    "Configure_NPSP_Installation/Configure_Address_Management.md"
  ],

  // ── Affiliations ──
  "affiliations.affil-engine": [
    "Manage_NPSP_Constituents/index.md"
  ],

  // ── Engagement Plans ──
  "engagement.ep-engine": [
    "Configure_NPSP_Installation/Configure_Engagement_Plans.md"
  ],
  "engagement.ep-tasks": [
    "Configure_NPSP_Installation/Configure_Engagement_Plans.md"
  ],

  // ── Batch Data Import ──
  "bdi.bdi-engine": [
    "Configure_NPSP_Installation/Configure_Batch_Data_Import.md",
    "NPSP_Import_Data/index.md"
  ],
  "bdi.bdi-mapping": [
    "Configure_NPSP_Installation/Configure_NPSP_Data_Importer.md"
  ],
  "bdi.bdi-triggers": [
    "Configure_NPSP_Installation/Configure_Batch_Data_Import.md"
  ],

  // ── Gift Entry ──
  "giftentry.ge-form": [
    "Configure_NPSP_Installation/Configure_Gift_Entry.md"
  ],
  "giftentry.ge-batch": [
    "Configure_NPSP_Installation/Configure_Gift_Entry.md"
  ],
  "giftentry.ge-templates": [
    "Configure_NPSP_Installation/Configure_Gift_Entry.md"
  ],

  // ── Levels & Tiers ──
  "levels.level-engine": [
    "Configure_NPSP_Installation/Configure_Levels.md"
  ],

  // ── Error Handling ──
  "errors.err-handler": [
    "Ongoing_NPSP_Administration/index.md"
  ],
  "errors.err-notifier": [
    "Ongoing_NPSP_Administration/index.md"
  ],
  "errors.err-record": [
    "Ongoing_NPSP_Administration/index.md"
  ],

  // ── Settings & Configuration ──
  "settings.custom-settings": [
    "Configure_NPSP_Installation/Configure_Your_NPSP_Organization.md",
    "Configure_NPSP_Installation/Configure_NPSP_Features_Overview.md"
  ],
  "settings.settings-ui": [
    "Configure_NPSP_Installation/Configure_Your_NPSP_Organization.md",
    "Learn_About_NPSP/index.md"
  ],
  "settings.health-check": [
    "Configure_NPSP_Installation/Install_or_Upgrade_NPSP.md",
    "Get_Started_with_Salesforce_for_Nonprofits/index.md"
  ],

  // ── Elevate Integration ──
  "elevate.ps-integration": [
    "Configure_NPSP_Installation/Configure_Gift_Entry.md"
  ],
  "elevate.ps-lwc": [
    "Configure_NPSP_Installation/Configure_Gift_Entry.md"
  ]
};

// Cross-cutting docs mapped to closest component
DOC_MAPPING["settings.custom-settings"] = DOC_MAPPING["settings.custom-settings"].concat([
  "NPSP_Feature_Telemetry/index.md",
  "GDPR_for_NPSP/index.md",
  "Configure_NPSP_Installation/Optional_NPSP_Customizations.md"
]);
DOC_MAPPING["settings.settings-ui"] = DOC_MAPPING["settings.settings-ui"].concat([
  "Salesforce_Fundamentals_for_NPSP/index.md"
]);
DOC_MAPPING["rollups.crlp-engine"] = DOC_MAPPING["rollups.crlp-engine"].concat([
  "NPSP_Reporting_and_Analytics/index.md",
  "Configure_NPSP_Installation/Configure_Reports_and_Dashboards.md"
]);
DOC_MAPPING["engagement.ep-engine"] = DOC_MAPPING["engagement.ep-engine"].concat([
  "NPSP_Manage_Campaigns/index.md",
  "Manage_NPSP_Programs/index.md"
]);

// Search metadata: title + path for search index (no full content fetch needed)
var DOC_SEARCH_META = [
  { title: "Learn About NPSP", path: "Learn_About_NPSP/index.md", domain: "settings", component: "settings-ui" },
  { title: "Get Started with Salesforce for Nonprofits", path: "Get_Started_with_Salesforce_for_Nonprofits/index.md", domain: "settings", component: "health-check" },
  { title: "Salesforce Fundamentals for NPSP", path: "Salesforce_Fundamentals_for_NPSP/index.md", domain: "settings", component: "settings-ui" },
  { title: "NPSP Objects and Fields", path: "NPSP_Objects_and_Fields/index.md", domain: "settings", component: "custom-settings" },
  { title: "NPSP Feature Telemetry", path: "NPSP_Feature_Telemetry/index.md", domain: "settings", component: "custom-settings" },
  { title: "NPSP Packaged Rollups", path: "NPSP_Packaged_Rollups/index.md", domain: "rollups", component: "crlp-engine" },
  { title: "NPSP Workflow Diagrams", path: "NPSP_Workflow_Diagrams/index.md", domain: "tdtm", component: "tdtm-dispatcher" },
  { title: "NPSP Entity Relationship Diagram", path: "NPSP_Entity_Relationship_Diagram/index.md", domain: "settings", component: "custom-settings" },
  { title: "Install or Upgrade NPSP", path: "Configure_NPSP_Installation/Install_or_Upgrade_NPSP.md", domain: "settings", component: "health-check" },
  { title: "Configure Your NPSP Organization", path: "Configure_NPSP_Installation/Configure_Your_NPSP_Organization.md", domain: "settings", component: "custom-settings" },
  { title: "Configure NPSP Features Overview", path: "Configure_NPSP_Installation/Configure_NPSP_Features_Overview.md", domain: "settings", component: "custom-settings" },
  { title: "Configure Acknowledge Donations by Email", path: "Configure_NPSP_Installation/Configure_Acknowledge_Donations_by_Email.md", domain: "donations", component: "opp-naming" },
  { title: "Configure Address Management", path: "Configure_NPSP_Installation/Configure_Address_Management.md", domain: "addresses", component: "addr-engine" },
  { title: "Configure Automated and Manual Soft Credits", path: "Configure_NPSP_Installation/Configure_Automated_and_Manual_Soft_Credits.md", domain: "softcredits", component: "opp-softcredit" },
  { title: "Configure Batch Data Import", path: "Configure_NPSP_Installation/Configure_Batch_Data_Import.md", domain: "bdi", component: "bdi-engine" },
  { title: "Configure Campaigns", path: "Configure_NPSP_Installation/Configure_Campaigns.md", domain: "engagement", component: "ep-engine" },
  { title: "Configure Customizable Rollups", path: "Configure_NPSP_Installation/Configure_Customizable_Rollups.md", domain: "rollups", component: "crlp-engine" },
  { title: "Configure NPSP Data Importer", path: "Configure_NPSP_Installation/Configure_NPSP_Data_Importer.md", domain: "bdi", component: "bdi-mapping" },
  { title: "Configure Donation Allocations", path: "Configure_NPSP_Installation/Configure_Donation_Allocations.md", domain: "allocations", component: "gau" },
  { title: "Configure Engagement Plans", path: "Configure_NPSP_Installation/Configure_Engagement_Plans.md", domain: "engagement", component: "ep-engine" },
  { title: "Configure Levels", path: "Configure_NPSP_Installation/Configure_Levels.md", domain: "levels", component: "level-engine" },
  { title: "Configure Gift Entry", path: "Configure_NPSP_Installation/Configure_Gift_Entry.md", domain: "giftentry", component: "ge-form" },
  { title: "Configure Grants", path: "Configure_NPSP_Installation/Configure_Grants.md", domain: "donations", component: "opp-naming" },
  { title: "Configure In-Kind Gifts", path: "Configure_NPSP_Installation/Configure_In-Kind_Gifts.md", domain: "donations", component: "opp-naming" },
  { title: "Configure Leads", path: "Configure_NPSP_Installation/Configure_Leads.md", domain: "contacts", component: "household-model" },
  { title: "Configure Matching Gifts", path: "Configure_NPSP_Installation/Configure_Matching_Gifts.md", domain: "donations", component: "matching-gifts" },
  { title: "Configure Memberships", path: "Configure_NPSP_Installation/Configure_Memberships.md", domain: "donations", component: "opp-naming" },
  { title: "Configure Tribute Gifts", path: "Configure_NPSP_Installation/Configure_Tribute_Gifts.md", domain: "donations", component: "opp-naming" },
  { title: "Configure Opportunity Payments in NPSP", path: "Configure_NPSP_Installation/Configure_Opportunity_Payments_in_NPSP.md", domain: "donations", component: "payments" },
  { title: "Configure Recurring Donations", path: "Configure_NPSP_Installation/Configure_Recurring_Donations.md", domain: "recurring", component: "rd2-engine" },
  { title: "Manage Relationships Settings", path: "Configure_NPSP_Installation/Manage_Relationships_Settings.md", domain: "relationships", component: "rel-contact" },
  { title: "Configure Reports and Dashboards", path: "Configure_NPSP_Installation/Configure_Reports_and_Dashboards.md", domain: "rollups", component: "crlp-engine" },
  { title: "Advanced NPSP Configurations", path: "Configure_NPSP_Installation/Advanced_NPSP_Configurations.md", domain: "tdtm", component: "tdtm-dispatcher" },
  { title: "Optional NPSP Customizations", path: "Configure_NPSP_Installation/Optional_NPSP_Customizations.md", domain: "settings", component: "custom-settings" },
  { title: "Import Data into NPSP", path: "NPSP_Import_Data/index.md", domain: "bdi", component: "bdi-engine" },
  { title: "Ongoing NPSP Administration", path: "Ongoing_NPSP_Administration/index.md", domain: "batch", component: "batch-framework" },
  { title: "Manage NPSP Constituents", path: "Manage_NPSP_Constituents/index.md", domain: "contacts", component: "household-model" },
  { title: "Manage Donations and Other Gift Types", path: "Manage_Donations_and_Other_Gift_Types/index.md", domain: "donations", component: "opp-naming" },
  { title: "Manage NPSP Programs", path: "Manage_NPSP_Programs/index.md", domain: "engagement", component: "ep-engine" },
  { title: "Manage Campaigns in NPSP", path: "NPSP_Manage_Campaigns/index.md", domain: "engagement", component: "ep-engine" },
  { title: "NPSP Reporting and Analytics", path: "NPSP_Reporting_and_Analytics/index.md", domain: "rollups", component: "crlp-engine" },
  { title: "GDPR for NPSP", path: "GDPR_for_NPSP/index.md", domain: "settings", component: "custom-settings" },
  { title: "Legacy NPSP Documentation", path: "Legacy_NPSP_Documentation/index.md", domain: "batch", component: "legacy-batches" }
];
