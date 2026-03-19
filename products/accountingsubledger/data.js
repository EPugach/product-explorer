// ══════════════════════════════════════════════════════════════
//  Accounting Subledger — Domains & Components
//  9 domains, 35 components
// ══════════════════════════════════════════════════════════════

export const PRODUCT = {

transaction_journals: {
  packages: ['accountingsubledger'],
  name: "Transaction Journals",
  icon: "\u{1F4D2}",
  color: "#3b82f6",
  description: "The core output of Accounting Subledger. Transaction Journal records store double-entry accounting data in a standardized format ready for export to external accounting systems. Each journal record contains debit and credit amounts, dates, GL codes, and fund names. Three journal types exist: Allocation records for expected revenue and expense with fund splits, Payment records for paid amounts broken down by fund account, and Transaction records for consolidated paid amounts without fund detail.",
  components: [
    {id:"journal-types",name:"Journal Types",icon:"\u{1F4CB}",desc:"Three record types categorize each Transaction Journal entry. Allocation records track expected revenue or expense split by fund account for committed pledges. Payment records capture paid amounts broken down by individual fund allocations. Transaction records store whole, unallocated amounts for paid records when fund-level detail is not needed.",tags:["TransactionJournal"],connections:[{planet:"fund_accounting",desc:"Journal types determine fund allocation detail level"},{planet:"revenue_recognition",desc:"Accounting states control which journal types are generated"}]},
    {id:"debit-credit-entries",name:"Debit and Credit Entries",icon:"\u{2696}",desc:"Every Transaction Journal record follows double-entry accounting principles with balanced debit and credit amounts. Debit Amount and Credit Amount fields ensure each financial event has offsetting entries that maintain the accounting equation. The debit/credit direction varies by journal type: expected revenue increases the debit side while fund account allocations increase the credit side.",tags:["TransactionJournal"],connections:[{planet:"adjustments",desc:"Reversals create negative debit/credit pairs"},{planet:"data_export",desc:"Debit/credit entries export to general ledger"}]},
    {id:"journal-dates",name:"Journal Date Fields",icon:"\u{1F4C5}",desc:"Four date fields on Transaction Journal records track the financial timeline. Committed Date marks when a source record becomes committed. Due Date captures the scheduled arrival for allocation records. Payment Date records when an amount is marked as paid. Transaction Date indicates when revenue or expense was first expected, received, or adjusted.",tags:["TransactionJournal"],connections:[{planet:"revenue_recognition",desc:"Accounting states set which date fields are populated"},{planet:"job_engine",desc:"Job run date serves as default Transaction Date"}]},
    {id:"custom-field-mapping",name:"Custom Field Extensions",icon:"\u{1F527}",desc:"Administrators can add custom fields to Transaction Journal records to capture additional reporting dimensions beyond the standard field set. Custom fields are mapped from source object fields through Accounting Set configuration, enabling product-specific or organization-specific data to flow into the accounting output. Character limits on text fields must be respected during mapping.",tags:["TransactionJournal","AccountingFieldMapping"],connections:[{planet:"accounting_sets",desc:"Custom fields are mapped through Accounting Set configuration"}]}
  ],
  dataFlow: [
    "Subledger job evaluates source records against Accounting Set criteria",
    "Journal type is determined based on payment status and fund allocation",
    "Debit and credit amounts are calculated for each eligible record",
    "Date fields are populated based on accounting state and source dates",
    "Custom field values are mapped from source records through set configuration",
    "Transaction Journal records are created and available for reporting and export"
  ],
  connections: [
    {planet:"accounting_sets",desc:"Accounting Sets define how source data maps to journal fields"},
    {planet:"fund_accounting",desc:"Fund allocations determine per-fund journal entries"},
    {planet:"revenue_recognition",desc:"Accounting states control journal generation rules"},
    {planet:"adjustments",desc:"Reversals modify existing journal records"},
    {planet:"data_export",desc:"Journal records are the primary export content"},
    {planet:"job_engine",desc:"Subledger jobs create journal records"},
    {planet:"setup",desc:"Permission sets control journal read access"}
  ]
},

accounting_sets: {
  packages: ['accountingsubledger'],
  name: "Accounting Sets",
  icon: "\u{2699}",
  color: "#8b5cf6",
  description: "The configuration engine of Accounting Subledger. An Accounting Set defines how source CRM data transforms into accounting-ready Transaction Journal records by mapping source object fields to journal fields. Each set specifies the source object hierarchy, field mappings for amounts, dates, fund names, GL codes, and payment status, plus optional criteria for filtering which records to process. Sets come in two types: Revenue and Expense.",
  components: [
    {id:"set-configuration",name:"Set Configuration",icon:"\u{1F4DD}",desc:"Each Accounting Set is configured as either Revenue or Expense type, determining the debit/credit direction for generated journals. The set defines which source objects to process, how deep the object hierarchy goes, and which fields carry the key financial data. Revenue sets track incoming funds like donations and payments, while Expense sets track outgoing costs.",tags:["AccountingSet"],connections:[{planet:"source_objects",desc:"Set configuration defines the source object hierarchy"},{planet:"transaction_journals",desc:"Sets determine journal structure and field mappings"}]},
    {id:"field-mappings",name:"Field Mappings",icon:"\u{1F517}",desc:"The heart of an Accounting Set: field-level configuration that maps source CRM fields to Transaction Journal fields. Required mappings include Overall Amount, Payment Paid Checkbox, Payment Paid Date, Fund Name, Fund Account Allocation Amount, and GL Code. Optional mappings cover Payment Scheduled Date, Transaction Date override, Written-Off Checkbox, and Payment Method.",tags:["AccountingSet","AccountingFieldMapping"],connections:[{planet:"transaction_journals",desc:"Field mappings populate journal record values"},{planet:"fund_accounting",desc:"Fund name and GL code mappings drive fund tracking"}]},
    {id:"criteria-settings",name:"Criteria Settings",icon:"\u{1F50D}",desc:"Optional record-level filtering that controls which source records an Accounting Set processes. Criteria settings define conditions on source object fields that must be met for a record to generate journals. Record type filters further narrow processing to specific record types. These filters prevent irrelevant source records from creating unwanted journal entries.",tags:["AccountingSet"],connections:[{planet:"source_objects",desc:"Criteria evaluate fields on source objects"},{planet:"job_engine",desc:"Job processing respects criteria settings during execution"}]},
    {id:"expected-revenue-config",name:"Expected Revenue Configuration",icon:"\u{1F4C8}",desc:"Controls whether an Accounting Set generates Allocation-type journal records for committed but unpaid amounts. When the Generate Expected Revenue or Expense checkbox is enabled, the set creates journals for pledged amounts not yet paid, supporting accrual accounting. The Payment Scheduled Date field mapping enables due date grouping for expected amounts.",tags:["AccountingSet"],connections:[{planet:"revenue_recognition",desc:"Expected revenue ties to committed accounting state"},{planet:"fund_accounting",desc:"Expected amounts generate per-fund allocation records"}]}
  ],
  dataFlow: [
    "Administrator creates an Accounting Set and selects Revenue or Expense type",
    "Source objects are configured with primary, secondary, and optional deeper levels",
    "Field mappings connect source CRM fields to Transaction Journal fields",
    "Optional criteria and record type filters narrow which records to process",
    "Expected revenue toggle enables or disables accrual journal generation",
    "Completed Accounting Set is ready for subledger job execution"
  ],
  connections: [
    {planet:"transaction_journals",desc:"Accounting Sets define journal field mappings"},
    {planet:"source_objects",desc:"Sets reference source object hierarchies"},
    {planet:"fund_accounting",desc:"Fund name and GL code field mappings"},
    {planet:"revenue_recognition",desc:"Expected revenue configuration"},
    {planet:"job_engine",desc:"Jobs execute against accounting sets"},
    {planet:"setup",desc:"Set configuration requires admin permissions"}
  ]
},

fund_accounting: {
  packages: ['accountingsubledger'],
  name: "Fund Accounting",
  icon: "\u{1F3E6}",
  color: "#10b981",
  description: "Manages the fund-level financial tracking that enables organizations to report on restricted, unrestricted, and designated funds. GL codes identify general ledger accounts in external accounting systems, while fund names and designations track how payments and pledges are allocated across organizational funds. Fund allocations allow a single payment to split across multiple fund accounts, each generating separate journal entries.",
  components: [
    {id:"gl-codes",name:"GL Code Management",icon:"\u{1F4CA}",desc:"General ledger codes serve as the bridge between Salesforce accounting data and external accounting systems. Each GL code identifies a specific account in the general ledger, such as revenue accounts, expense accounts, or asset accounts. GL codes are mapped through Accounting Set field configuration and appear on every Transaction Journal record.",tags:["TransactionJournal"],connections:[{planet:"data_export",desc:"GL codes map journal entries to external ledger accounts"},{planet:"accounting_sets",desc:"GL code field is mapped in accounting set configuration"}]},
    {id:"fund-allocations",name:"Fund Allocations",icon:"\u{1F4B0}",desc:"Enables splitting a single payment or pledge across multiple fund accounts. Each fund allocation specifies the fund name and the amount designated to that fund. When subledger jobs run, separate journal entries are created for each fund allocation, providing granular financial tracking. This is essential for nonprofit organizations tracking donor-restricted funds separately from general operating funds.",tags:["TransactionJournal"],connections:[{planet:"transaction_journals",desc:"Fund allocations generate per-fund journal entries"},{planet:"revenue_recognition",desc:"Committed amounts create allocation records per fund"}]},
    {id:"fund-names",name:"Fund Name Tracking",icon:"\u{1F3F7}",desc:"Fund names identify the destination or source fund for each financial transaction. Common fund names include General Fund, Building Fund, Scholarship Fund, and Program-Specific Funds. Fund names are pulled from source object fields through Accounting Set mappings and recorded on Transaction Journal records for reporting and reconciliation.",tags:["TransactionJournal"],connections:[{planet:"accounting_sets",desc:"Fund name field is configured in accounting set mappings"},{planet:"data_export",desc:"Fund names enable fund-level reporting in accounting systems"}]},
    {id:"payment-methods",name:"Payment Methods",icon:"\u{1F4B3}",desc:"Tracks the type of payment used for each financial transaction, such as cash, check, credit card, ACH, or wire transfer. Payment method data flows from source records through the Accounting Set field mapping to Transaction Journal records. When payment method tracking is enabled, changes to the payment method on source records trigger journal adjustments.",tags:["TransactionJournal"],connections:[{planet:"adjustments",desc:"Payment method changes trigger reversal and re-creation"},{planet:"accounting_sets",desc:"Payment method field mapping configured in accounting sets"}]}
  ],
  dataFlow: [
    "Source record specifies fund name and GL code for the transaction",
    "Accounting Set maps fund and GL code fields from source objects",
    "If multiple fund allocations exist, each gets separate journal entries",
    "GL codes tag each journal entry with the external ledger account",
    "Payment method is recorded for transaction classification",
    "Fund-level journal entries are available for reporting and export"
  ],
  connections: [
    {planet:"transaction_journals",desc:"Fund allocations drive per-fund journal entries"},
    {planet:"accounting_sets",desc:"Fund name and GL code field mappings"},
    {planet:"source_objects",desc:"Fund data often resides on secondary source objects"},
    {planet:"revenue_recognition",desc:"Committed amounts create fund allocation records"},
    {planet:"adjustments",desc:"Fund reallocation triggers journal reversals"},
    {planet:"data_export",desc:"Fund data enables restricted fund reporting"}
  ]
},

revenue_recognition: {
  packages: ['accountingsubledger'],
  name: "Revenue Recognition",
  icon: "\u{1F4C8}",
  color: "#f59e0b",
  description: "Controls the accounting state lifecycle that determines when and how Transaction Journal records are generated. Four states govern the process: Committed (revenue promised, waiting on payment), Uncommitted (revenue not yet promised), Paid (payment received), and Written-Off (amount canceled). The distinction between accrual and cash accounting methods determines whether journals are created at commitment or only upon receipt of payment.",
  components: [
    {id:"accounting-states",name:"Accounting States",icon:"\u{1F504}",desc:"The four-state model that governs Transaction Journal generation. Committed state means revenue or expense is promised and waiting on payment, generating journals for both scheduled and paid amounts. Uncommitted state generates journals only for paid or written-off amounts. Paid state creates debit/credit payment entries. Written-Off state creates adjustment journal records for canceled amounts.",tags:["TransactionJournal","AccountingSet"],connections:[{planet:"transaction_journals",desc:"States determine which journal types are created"},{planet:"accounting_sets",desc:"Accounting sets configure state-related field mappings"}]},
    {id:"accrual-accounting",name:"Accrual Accounting",icon:"\u{1F4C5}",desc:"Records revenue and expenses when they are committed or promised, regardless of when payment is received. Under accrual accounting, a pledge generates Allocation journal records immediately upon commitment, tracking the expected revenue across fund accounts. This method is essential for nonprofit organizations with multi-year pledges and for matching revenue recognition with the period in which it was earned.",tags:["TransactionJournal"],connections:[{planet:"transaction_journals",desc:"Accrual method generates Allocation-type journal records"},{planet:"fund_accounting",desc:"Accrual records create fund-level allocation entries"}]},
    {id:"cash-accounting",name:"Cash Accounting",icon:"\u{1F4B5}",desc:"Records revenue and expenses only when payment is actually received or made. Under cash accounting, no journals are generated for pledges or commitments until the amount is marked as paid. This simpler method tracks only actual cash flow and is used by organizations that do not need to match revenue to the period in which it was earned.",tags:["TransactionJournal"],connections:[{planet:"transaction_journals",desc:"Cash method generates only Payment and Transaction journals"},{planet:"job_engine",desc:"Job processing checks payment status for cash accounting"}]},
    {id:"expected-revenue",name:"Expected Revenue and Expense",icon:"\u{1F52E}",desc:"Manages scheduled future payments for committed amounts. When expected revenue generation is enabled on an Accounting Set, the subledger creates Allocation records for each scheduled payment date. These records track the anticipated receipt of funds by due date and fund account, enabling organizations to forecast cash flow and track pledge fulfillment progress.",tags:["TransactionJournal","AccountingSet"],connections:[{planet:"accounting_sets",desc:"Expected revenue toggle on Accounting Set enables this feature"},{planet:"fund_accounting",desc:"Expected amounts are allocated across fund accounts"}]}
  ],
  dataFlow: [
    "Source record is evaluated against Accounting Set to determine accounting state",
    "Committed records check if expected revenue generation is enabled",
    "If accrual accounting: Allocation records are generated for committed amounts",
    "If cash accounting: records wait until payment is received",
    "Paid records generate Payment or Transaction journal entries",
    "Written-off amounts create adjustment journal records"
  ],
  connections: [
    {planet:"transaction_journals",desc:"States control journal type generation"},
    {planet:"accounting_sets",desc:"State field mappings configured in accounting sets"},
    {planet:"fund_accounting",desc:"States interact with fund allocation records"},
    {planet:"source_objects",desc:"Source record fields determine accounting states"},
    {planet:"adjustments",desc:"State changes trigger reversal patterns"},
    {planet:"job_engine",desc:"Jobs evaluate accounting states during processing"}
  ]
},

job_engine: {
  packages: ['accountingsubledger'],
  name: "Job Engine",
  icon: "\u{1F5A5}",
  color: "#ef4444",
  description: "The processing backbone that executes Accounting Subledger jobs to generate Transaction Journal records. Jobs run against configured Accounting Sets, evaluating source records and creating journal entries based on field mappings and accounting state rules. Two processing engines are supported: Data Processing Engine (CRM Analytics-based) and Data 360 (Cloud Data Platform). Jobs can be triggered manually or scheduled through Flow Builder, with Batch Management records tracking execution history.",
  components: [
    {id:"subledger-jobs",name:"Subledger Job Execution",icon:"\u{25B6}",desc:"The primary execution mechanism for generating Transaction Journal records. Each job run processes source records against one or more Accounting Sets, applying field mappings, criteria filters, and accounting state rules. The first job run processes all eligible source records, while subsequent runs process only records that changed since the last execution.",tags:["BatchManagement"],connections:[{planet:"accounting_sets",desc:"Jobs execute against accounting set configurations"},{planet:"transaction_journals",desc:"Jobs create transaction journal records"}]},
    {id:"batch-management",name:"Batch Management",icon:"\u{1F4CA}",desc:"Tracks the execution history, status, and results of each subledger job run. Batch Management records capture job start and end times, total records processed, success and failure counts, and error details. This monitoring capability enables administrators to verify successful job completion and troubleshoot processing failures.",tags:["BatchManagement"],connections:[{planet:"setup",desc:"Administrators monitor job health through batch records"}]},
    {id:"processing-engines",name:"Processing Engines",icon:"\u{2699}",desc:"Two alternative engines power subledger job execution. Data Processing Engine (DPE) is the established option built on CRM Analytics, suitable for most organizations. Data 360 is the modern alternative built on Salesforce Cloud Data Platform, offering enhanced capabilities for Enterprise Edition and above. Both engines produce identical Transaction Journal output.",tags:["BatchManagement","AccountingSetting"],connections:[{planet:"setup",desc:"Engine selection configured in Accounting Settings"}]},
    {id:"job-scheduling",name:"Job Scheduling",icon:"\u{23F0}",desc:"Enables automated, recurring execution of subledger jobs through Salesforce Flow Builder. Administrators create scheduled flows that trigger the Run Subledger Job action on a defined cadence, typically weekly or monthly to align with accounting close cycles. Manual execution is available for ad-hoc processing needs.",tags:["BatchManagement"],connections:[{planet:"setup",desc:"Scheduling configured through Flow Builder by administrators"},{planet:"adjustments",desc:"Scheduled jobs pick up source record changes for reversals"}]}
  ],
  dataFlow: [
    "Administrator triggers job manually or scheduled flow initiates execution",
    "Job identifies eligible source records based on Accounting Set criteria",
    "Processing engine evaluates each record against field mappings and state rules",
    "Transaction Journal records are generated for qualifying source records",
    "Batch Management record captures execution results and any errors",
    "Next job run processes only records changed since previous execution"
  ],
  connections: [
    {planet:"transaction_journals",desc:"Jobs generate transaction journal records"},
    {planet:"accounting_sets",desc:"Jobs execute against accounting set configurations"},
    {planet:"revenue_recognition",desc:"Jobs evaluate accounting states during processing"},
    {planet:"adjustments",desc:"Subsequent jobs detect changes and create reversals"},
    {planet:"setup",desc:"Job scheduling and engine configuration"},
    {planet:"source_objects",desc:"Jobs traverse source object hierarchies"}
  ]
},

adjustments: {
  packages: ['accountingsubledger'],
  name: "Data Adjustments",
  icon: "\u{1F504}",
  color: "#f97316",
  description: "Handles post-generation modifications to accounting data through an immutable reversal pattern. When source record data changes after journal records have been created, the next subledger job run generates reversal entries (negative amounts) paired with new corrected entries. This approach maintains a complete audit trail while ensuring journal totals reflect current source data. Adjustments cover amount changes, fund reallocation, payment status updates, and payment method changes.",
  components: [
    {id:"reversal-pattern",name:"Reversal Pattern",icon:"\u{21C4}",desc:"The core mechanism for handling changes: original journal record (positive amount) plus reversal record (negative amount) equals zero net impact. New corrected records are then created with updated values. This pattern maintains an immutable audit trail where no journal record is ever deleted or modified in place.",tags:["TransactionJournal"],connections:[{planet:"transaction_journals",desc:"Reversals create paired positive/negative journal entries"},{planet:"data_export",desc:"Reversal records appear in exported journal data"}]},
    {id:"amount-changes",name:"Amount Adjustments",icon:"\u{1F4B1}",desc:"When the overall amount on a source record changes after journals have been generated, the next job run creates reversal entries for the original amount and new entries with the updated amount. This covers pledge amount increases, partial write-downs, and corrections to previously recorded amounts.",tags:["TransactionJournal"],connections:[{planet:"job_engine",desc:"Next job run detects amount changes and creates reversals"},{planet:"revenue_recognition",desc:"Amount changes may affect accounting state"}]},
    {id:"fund-reallocation",name:"Fund Reallocation",icon:"\u{1F500}",desc:"When fund allocations on a source record change, such as shifting a donation from the General Fund to the Building Fund, reversal records cancel the original fund allocation entries and new entries are created with the updated fund assignments. This ensures fund-level reporting always reflects current allocation intent.",tags:["TransactionJournal"],connections:[{planet:"fund_accounting",desc:"Fund reallocation updates fund-level journal entries"},{planet:"job_engine",desc:"Next job run processes fund allocation changes"}]},
    {id:"payment-status-changes",name:"Payment and Write-Off Changes",icon:"\u{1F4DD}",desc:"When a source record's payment status changes, such as marking a pledge as paid or writing off an uncollectible amount, new journal entries are created to reflect the updated financial state. The Skip Reversal Logic setting in Accounting Settings can reduce processing overhead for these adjustment scenarios at the cost of a less detailed audit trail.",tags:["TransactionJournal","AccountingSetting"],connections:[{planet:"revenue_recognition",desc:"Payment status changes trigger state transitions"},{planet:"setup",desc:"Skip Reversal Logic setting affects processing behavior"}]}
  ],
  dataFlow: [
    "Source record data changes after initial journal generation",
    "Next subledger job run detects the change on the source record",
    "Reversal entries are created to negate the original journal records",
    "New corrected journal entries are generated with updated values",
    "Original and reversal records remain as immutable audit trail",
    "Journal totals now reflect the current source record state"
  ],
  connections: [
    {planet:"transaction_journals",desc:"Reversals create paired journal entries"},
    {planet:"job_engine",desc:"Jobs detect changes and generate reversals"},
    {planet:"fund_accounting",desc:"Fund reallocation adjusts fund-level entries"},
    {planet:"revenue_recognition",desc:"State changes trigger adjustment processing"},
    {planet:"data_export",desc:"Exported data includes reversal record pairs"},
    {planet:"setup",desc:"Skip Reversal Logic configuration"}
  ]
},

data_export: {
  packages: ['accountingsubledger'],
  name: "Data Export",
  icon: "\u{1F4E4}",
  color: "#06b6d4",
  description: "Provides mechanisms for getting Transaction Journal data out of Salesforce and into external accounting systems. Export options include standard Salesforce reports, CSV file generation, API-based custom integrations, and third-party middleware connectors. Direct automatic posting to accounting systems is not supported for legal compliance reasons. All export approaches leverage the standardized journal format with GL codes that map to external ledger accounts.",
  components: [
    {id:"journal-reports",name:"Journal Reports",icon:"\u{1F4CA}",desc:"Standard Salesforce reports built on the Transaction Journal object provide the primary data access mechanism. Report Builder enables filtering by date range, journal type, fund name, GL code, and any other journal field. Common report types include period-end journal summaries, fund balance reports, and GL account reconciliation.",tags:["TransactionJournal"],connections:[{planet:"transaction_journals",desc:"Reports query Transaction Journal records"},{planet:"fund_accounting",desc:"Fund-level reports group journals by fund name and GL code"}]},
    {id:"csv-export",name:"CSV Export",icon:"\u{1F4C4}",desc:"Exports journal data as CSV files from Salesforce reports for import into external accounting systems. This is the most common export method for organizations that process journal entries in batch. The standardized GL code and fund name fields serve as the mapping keys that connect Salesforce data to the corresponding accounts in the external general ledger.",tags:["TransactionJournal"],connections:[{planet:"transaction_journals",desc:"CSV files contain journal record field values"}]},
    {id:"system-integration",name:"System Integration",icon:"\u{1F517}",desc:"Custom integration approaches for organizations needing automated or near-real-time data flow to external accounting systems. Options include Salesforce API-based integrations that query Transaction Journal records programmatically, and third-party middleware platforms with pre-built connectors. Integration design must account for reversal records and the immutable audit trail pattern.",tags:["TransactionJournal"],connections:[{planet:"transaction_journals",desc:"Integrations read from Transaction Journal records"},{planet:"adjustments",desc:"Integrations must handle reversal record pairs"}]}
  ],
  dataFlow: [
    "Transaction Journal records are generated by subledger job processing",
    "Accounting staff run reports filtered by period, fund, or GL code",
    "Reports are exported as CSV or accessed via API integration",
    "GL codes map journal entries to external ledger accounts",
    "Exported data is imported into the external accounting system",
    "Reconciliation confirms journal totals match external ledger"
  ],
  connections: [
    {planet:"transaction_journals",desc:"Journal records are the export data source"},
    {planet:"fund_accounting",desc:"GL codes bridge Salesforce to external ledger"},
    {planet:"adjustments",desc:"Exported data includes reversal record pairs"}
  ]
},

source_objects: {
  packages: ['accountingsubledger'],
  name: "Source Data Models",
  icon: "\u{1F5C3}",
  color: "#ec4899",
  description: "Defines the multi-object architecture that connects CRM source records to the Accounting Subledger processing pipeline. Source objects are the origin data: Opportunities, Payments, Accounts, and other CRM records that contain the financial data to be transformed into journals. The object model supports 2-level, 3-level, and 4-level hierarchies, enabling complex source data relationships where child records nest within parents across up to four levels.",
  components: [
    {id:"object-hierarchy",name:"Object Model Hierarchy",icon:"\u{1F3D7}",desc:"Accounting Sets support three levels of source data complexity. The 2-object model connects a Primary to a Secondary object (e.g., Opportunity to Payment). The 3-object model adds a Tertiary level (e.g., Account to Opportunity to Payment). The 4-object model adds a Quaternary level for deeply nested relationships.",tags:["AccountingSet"],connections:[{planet:"accounting_sets",desc:"Object hierarchy configured in Accounting Set setup"},{planet:"job_engine",desc:"Jobs traverse the configured object hierarchy"}]},
    {id:"primary-sources",name:"Primary Source Objects",icon:"\u{1F4CB}",desc:"The top-level CRM objects that serve as the entry point for subledger processing. Common primary objects include Opportunity for revenue tracking, Account for organizational grouping, and custom objects specific to the organization. The primary object typically holds the overall amount, commitment status, and key classification fields.",tags:["AccountingSet"],connections:[{planet:"accounting_sets",desc:"Primary object selected in Accounting Set configuration"},{planet:"revenue_recognition",desc:"Primary object fields drive accounting state determination"}]},
    {id:"secondary-sources",name:"Secondary and Deeper Objects",icon:"\u{1F4C2}",desc:"Child objects in the source hierarchy that provide detail-level financial data. Secondary objects commonly hold payment records, fund allocation details, and individual transaction amounts. Tertiary and quaternary objects enable even deeper nesting for complex data models. Field mappings in Accounting Sets can reference fields at any level of the hierarchy.",tags:["AccountingSet"],connections:[{planet:"fund_accounting",desc:"Fund allocation amounts often come from secondary objects"},{planet:"accounting_sets",desc:"Deeper objects configured in accounting set hierarchy"}]},
    {id:"source-criteria",name:"Source Record Filtering",icon:"\u{1F50D}",desc:"Controls which source records are eligible for subledger processing through criteria settings and record type filters. Criteria settings define field-level conditions on source objects that must be met for a record to generate journals. Record type filters narrow processing to specific record types. These filters are configured on the Accounting Set and applied during job execution.",tags:["AccountingSet"],connections:[{planet:"accounting_sets",desc:"Criteria settings configured on the Accounting Set"},{planet:"job_engine",desc:"Jobs apply source criteria during record evaluation"}]}
  ],
  dataFlow: [
    "Administrator selects primary source object on Accounting Set",
    "Secondary, tertiary, and quaternary objects are configured as needed",
    "Field mappings reference fields at each level of the hierarchy",
    "Criteria settings and record type filters narrow eligible records",
    "Subledger job traverses the object hierarchy during processing",
    "Source record field values flow through mappings into journal records"
  ],
  connections: [
    {planet:"accounting_sets",desc:"Source objects configured in Accounting Set setup"},
    {planet:"job_engine",desc:"Jobs traverse source object hierarchies"},
    {planet:"fund_accounting",desc:"Fund data often resides on secondary source objects"},
    {planet:"revenue_recognition",desc:"Source fields determine accounting states"}
  ]
},

setup: {
  packages: ['accountingsubledger'],
  name: "Setup & Security",
  icon: "\u{1F512}",
  color: "#64748b",
  description: "Configuration and access control for Accounting Subledger. The Accounting Setting object holds system-wide configuration toggles like Skip Reversal Logic and Data 360 runtime selection. Four permission sets control access levels from read-only journal viewing to full administrative control. Data Pipelines must be enabled as a prerequisite, and user management ensures the right teams have appropriate access to subledger functionality.",
  components: [
    {id:"permission-sets",name:"Permission Sets",icon:"\u{1F6E1}",desc:"Four graduated permission levels control access. Access Accounting Subledger Growth provides read-only access for accountants viewing journals. Data Pipelines Base User enables processing setup. Run Accounting Subledger Job allows triggering manual and scheduled job execution. Manage Accounting Subledger grants full administrative control over accounting sets, settings, and configuration.",tags:["AccountingSetting"],connections:[{planet:"job_engine",desc:"Run Job permission required for job execution"},{planet:"accounting_sets",desc:"Manage permission required for set configuration"}]},
    {id:"accounting-settings",name:"Accounting Settings",icon:"\u{2699}",desc:"System-wide configuration stored in the Accounting Setting object. Key settings include Skip Reversal Logic (reduces processing for adjustments at the cost of less detailed audit trail), Data 360 Runtime selection (chooses between DPE and Data 360 processing engines), and configuration toggles for payment method tracking and due date grouping on expected revenue records.",tags:["AccountingSetting"],connections:[{planet:"job_engine",desc:"Engine selection and processing behavior configured here"},{planet:"adjustments",desc:"Skip Reversal Logic affects adjustment processing"}]},
    {id:"data-pipelines",name:"Data Pipelines Setup",icon:"\u{1F528}",desc:"Data Pipelines is a prerequisite platform feature that must be enabled before Accounting Subledger can function. It provides the underlying data processing infrastructure used by both the Data Processing Engine and Data 360 runtime options. Setup includes enabling the feature, configuring data pipeline permissions, and verifying connectivity between CRM data and the processing layer.",tags:["AccountingSetting"],connections:[{planet:"job_engine",desc:"Data Pipelines powers the subledger processing engines"}]},
    {id:"edition-requirements",name:"Edition and Licensing",icon:"\u{1F4DC}",desc:"Accounting Subledger requires Enterprise, Performance, Unlimited, or Developer Edition with the Accounting Subledger add-on license. Data 360 runtime requires Enterprise Edition or above with additional Cloud Data Platform licensing. Understanding edition requirements is critical for deployment planning and determines which processing engines and features are available.",tags:["AccountingSetting"],connections:[{planet:"job_engine",desc:"Edition determines which processing engines are available"}]}
  ],
  dataFlow: [
    "Administrator enables Data Pipelines prerequisite feature",
    "Permission sets are assigned to users based on their role",
    "Accounting Settings are configured for the organization",
    "Processing engine is selected: DPE or Data 360",
    "Skip Reversal Logic and other toggles are set as needed",
    "System is ready for Accounting Set creation and job execution"
  ],
  connections: [
    {planet:"accounting_sets",desc:"Admin permissions required for set management"},
    {planet:"job_engine",desc:"Engine and processing configuration"},
    {planet:"adjustments",desc:"Reversal logic settings"},
    {planet:"transaction_journals",desc:"Read-only permissions for journal access"}
  ]
}

};
