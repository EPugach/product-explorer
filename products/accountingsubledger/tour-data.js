// ══════════════════════════════════════════════════════════════
//  Accounting Subledger — Constellation Stories (Guided Tours)
//  4 tours tracing key business workflows across domains
// ══════════════════════════════════════════════════════════════

export const TOURS = [

  {
    id: 'source-to-journal',
    title: 'Source to Journal',
    icon: '\u{1F4D2}',
    desc: 'Follow a donation from CRM source record through the subledger pipeline to a completed Transaction Journal entry.',
    stops: [
      {
        planet: 'source_objects',
        highlightEdges: ['accounting_sets', 'job_engine'],
        admin: {
          title: 'Where It All Starts',
          body: 'Every accounting entry begins with a source record in your CRM. This could be an Opportunity representing a donation pledge, a Payment record, or any other object that tracks financial activity. The source data model defines how these records connect: a primary object like Opportunity links to secondary objects like Payments, and optionally to deeper levels for complex data hierarchies.'
        },
        dev: {
          title: 'Source Object Hierarchy',
          body: 'The Accounting Set references source objects by API name across up to four levels (Primary, Secondary, Tertiary, Quaternary). Field mappings use dot notation to traverse the hierarchy. The engine evaluates lookup relationships between levels during job processing, so the relationship fields between objects must be correctly configured in the Accounting Set.'
        }
      },
      {
        planet: 'accounting_sets',
        highlightEdges: ['source_objects', 'transaction_journals', 'fund_accounting'],
        admin: {
          title: 'Configuring the Translation',
          body: 'The Accounting Set is where you define the rules for turning CRM data into accounting entries. You select Revenue or Expense type, map which source fields contain the amount, payment status, fund name, and GL code, and optionally set criteria to filter which records to process. This is a one-time setup that runs automatically on every subsequent job.'
        },
        dev: {
          title: 'Field Mapping Architecture',
          body: 'Each Accounting Set stores field-level mappings as references to source object field API names. Required mappings include OverallAmountField, PaymentPaidCheckbox, PaymentPaidDateField, FundNameField, FundAllocationAmountField, and GLCodeField. The GenerateExpectedRevenue checkbox controls whether Allocation-type journals are created for committed but unpaid records.'
        }
      },
      {
        planet: 'job_engine',
        highlightEdges: ['accounting_sets', 'transaction_journals', 'revenue_recognition'],
        admin: {
          title: 'Running the Subledger Job',
          body: 'When you run the subledger job, either manually or on a schedule, it processes all source records that match your Accounting Set criteria. The first run processes everything; subsequent runs only pick up changes. You can monitor results in Batch Management records that show how many journals were created and whether any errors occurred.'
        },
        dev: {
          title: 'Processing Engine Execution',
          body: 'Jobs execute through either the Data Processing Engine (CRM Analytics-based) or Data 360 (Cloud Data Platform). The engine traverses the source object hierarchy, evaluates each record against the Accounting Set field mappings, determines the accounting state (Committed, Uncommitted, Paid, Written-Off), and generates the appropriate journal type. Incremental processing on subsequent runs uses change tracking to identify modified source records.'
        }
      },
      {
        planet: 'transaction_journals',
        highlightEdges: ['fund_accounting', 'data_export'],
        admin: {
          title: 'The Accounting Entry',
          body: 'The end result is a Transaction Journal record with balanced debits and credits, GL codes that map to your external accounting system, fund names for allocation tracking, and date fields that document the financial timeline. These records are ready for export to your accounting system via reports, CSV files, or API integration.'
        },
        dev: {
          title: 'Journal Record Structure',
          body: 'Each TransactionJournal record contains JournalType (Allocation, Payment, or Transaction), DebitAmount, CreditAmount, GLCode, FundName, and four date fields (CommittedDate, DueDate, PaymentDate, TransactionDate). The IsReversal flag distinguishes adjustment records. Lookup relationships to AccountingSet and BatchManagement provide full traceability back to the configuration and job that produced each entry.'
        }
      }
    ]
  },

  {
    id: 'fund-allocation-flow',
    title: 'Fund Allocation Flow',
    icon: '\u{1F3E6}',
    desc: 'Trace how a multi-fund donation splits across fund accounts and generates per-fund journal entries.',
    stops: [
      {
        planet: 'fund_accounting',
        highlightEdges: ['accounting_sets', 'transaction_journals'],
        admin: {
          title: 'Understanding Fund Accounts',
          body: 'Nonprofit and higher education organizations often need to track funds separately. A donor might give $10,000 with $6,000 designated for the General Fund and $4,000 for the Building Fund. Each fund has its own GL code that maps to a specific account in the external general ledger. The Accounting Subledger handles this multi-fund split automatically.'
        },
        dev: {
          title: 'Fund Data Architecture',
          body: 'Fund tracking relies on two key fields mapped through the Accounting Set: FundNameField and FundAllocationAmountField. These typically reference fields on a secondary source object (like a GAU Allocation or Designation record) that holds the per-fund split amounts. The GL code is either on the fund allocation record or derived from the fund name through GL Code field mapping.'
        }
      },
      {
        planet: 'accounting_sets',
        highlightEdges: ['fund_accounting', 'source_objects'],
        admin: {
          title: 'Mapping Fund Fields',
          body: 'In your Accounting Set, you map the Fund Name and Fund Account Allocation Amount fields to point to the source records that hold fund-level detail. For a 2-object model, the primary object is the opportunity and the secondary object holds the fund allocations. The GL Code field mapping tells the system which general ledger account each fund corresponds to.'
        },
        dev: {
          title: 'Multi-Object Fund Resolution',
          body: 'When processing a source record with fund allocations, the engine iterates over the secondary (or deeper) objects that contain per-fund amounts. For each fund allocation child record, a separate TransactionJournal entry is created with the allocation-specific FundName, amount, and GLCode. The JournalType for these entries depends on the accounting state: Allocation for committed/expected, Payment for paid amounts.'
        }
      },
      {
        planet: 'transaction_journals',
        highlightEdges: ['fund_accounting', 'adjustments'],
        admin: {
          title: 'Per-Fund Journal Entries',
          body: 'For our $10,000 donation example, the subledger creates separate journal entries for each fund: one set of debit/credit entries for the $6,000 General Fund allocation and another set for the $4,000 Building Fund allocation. Each entry carries its own GL code, making it straightforward to reconcile fund balances in your external accounting system.'
        },
        dev: {
          title: 'Journal Generation Per Fund',
          body: 'Each fund allocation produces its own TransactionJournal record(s) with DebitAmount and CreditAmount reflecting the allocation amount. If the source record is Committed with expected revenue enabled, Allocation-type records are created per fund. When marked as Paid, Payment-type records replace or supplement the allocations. The FundName field on each journal provides the grouping key for fund-level reporting.'
        }
      },
      {
        planet: 'data_export',
        highlightEdges: ['transaction_journals', 'fund_accounting'],
        admin: {
          title: 'Fund-Level Reporting',
          body: 'With fund-specific journal entries, you can run reports that show the total debits and credits per fund, making it easy to track restricted versus unrestricted fund balances. CSV exports include the GL code and fund name on every row, so your external accounting system can import fund-level data directly into the appropriate general ledger accounts.'
        },
        dev: {
          title: 'Export and Reconciliation',
          body: 'Reports on the TransactionJournal object can be filtered and grouped by FundName and GLCode to produce fund-level summaries. The immutable reversal pattern means fund reallocation changes are fully traceable: original allocations, reversal records, and new corrected allocations all appear in the export data. Integration tools must handle these reversal pairs when importing into external systems.'
        }
      }
    ]
  },

  {
    id: 'adjustment-lifecycle',
    title: 'The Adjustment Lifecycle',
    icon: '\u{1F504}',
    desc: 'See how changes to source data trigger the reversal pattern to maintain an immutable audit trail.',
    stops: [
      {
        planet: 'source_objects',
        highlightEdges: ['job_engine', 'accounting_sets'],
        admin: {
          title: 'When Data Changes',
          body: 'After the subledger has generated journal entries, someone updates the original source record. Maybe a pledge amount increases from $5,000 to $7,500, or a donation gets reallocated from the General Fund to the Scholarship Fund. These changes need to flow through to the accounting data without losing the history of what was previously recorded.'
        },
        dev: {
          title: 'Change Detection',
          body: 'The subledger engine uses incremental processing to detect changes in source records. On each job run, it compares current source field values against the values that were used to generate existing journal records. When a mapped field value has changed (amount, fund name, payment status, etc.), the engine triggers the reversal pattern for the affected journal records.'
        }
      },
      {
        planet: 'adjustments',
        highlightEdges: ['transaction_journals', 'job_engine', 'setup'],
        admin: {
          title: 'The Reversal Pattern',
          body: 'Instead of editing or deleting existing journal records, the system creates reversal entries. For the pledge increase from $5,000 to $7,500: first, a reversal record negates the original $5,000 entry (creating a -$5,000 entry), then a new record is created for $7,500. The original entry, the reversal, and the new entry all remain in the system as a complete audit trail.'
        },
        dev: {
          title: 'Reversal Record Mechanics',
          body: 'The reversal pattern produces TransactionJournal records with IsReversal=true and negative DebitAmount/CreditAmount values that exactly offset the original records. The new corrected records are then created with updated field values. The Skip Reversal Logic setting on AccountingSetting can bypass reversal generation for performance, but loses the paired audit trail. All three records (original, reversal, corrected) reference the same BatchManagement record for the job run that processed the adjustment.'
        }
      },
      {
        planet: 'revenue_recognition',
        highlightEdges: ['adjustments', 'transaction_journals'],
        admin: {
          title: 'State Transitions',
          body: 'Some changes affect the accounting state itself. When a committed pledge is marked as paid, the system transitions from generating expected revenue (Allocation records) to actual revenue (Payment records). When an amount is written off, adjustment records cancel the expected revenue. Each state transition may trigger reversals of the previous state\'s journal entries and creation of new entries matching the new state.'
        },
        dev: {
          title: 'State-Driven Adjustments',
          body: 'State transitions are detected by evaluating the Payment Paid Checkbox and Written-Off Checkbox fields mapped in the Accounting Set. A transition from Committed to Paid triggers reversal of Allocation records and creation of Payment records. A transition to Written-Off creates adjustment journals that cancel the expected revenue. The engine handles compound changes (amount change plus state change) in a single job run.'
        }
      },
      {
        planet: 'data_export',
        highlightEdges: ['adjustments', 'transaction_journals'],
        admin: {
          title: 'Exporting the Full Picture',
          body: 'When you export journal data, the reversal records are included alongside the originals and corrections. Your external accounting system receives the complete audit trail, so auditors can trace every change from the original entry through each adjustment. The net effect of originals plus reversals always equals the current correct amount.'
        },
        dev: {
          title: 'Integration Considerations',
          body: 'Integration tools must be designed to handle reversal record pairs. Filtering by IsReversal allows systems to process only net-new records or to include the full audit trail. Date-range filters on TransactionDate help scope exports to specific accounting periods. Middleware connectors should map GL codes and fund names to the external system\'s chart of accounts and process reversals as adjustment entries rather than deletes.'
        }
      }
    ]
  },

  {
    id: 'month-end-close',
    title: 'Month-End Close Process',
    icon: '\u{1F4C5}',
    desc: 'Walk through the monthly accounting close cycle from job scheduling to final reconciliation.',
    stops: [
      {
        planet: 'setup',
        highlightEdges: ['job_engine', 'accounting_sets'],
        admin: {
          title: 'Preparing for Close',
          body: 'Before month-end close, verify that your Accounting Settings are configured correctly. Check that the right processing engine is selected, review whether Skip Reversal Logic is appropriate for your audit requirements, and confirm that all users who need to run or monitor jobs have the correct permission sets assigned. Ensure Data Pipelines is enabled and healthy.'
        },
        dev: {
          title: 'Pre-Close Configuration Check',
          body: 'Programmatically verify AccountingSetting field values before triggering the close job. Check that ProcessingEngine matches the organization\'s licensing (Data 360 requires Enterprise+). Verify permission set assignments for users in the close workflow. If using Data 360, confirm the data stream sync has completed before job execution to avoid stale source data.'
        }
      },
      {
        planet: 'job_engine',
        highlightEdges: ['accounting_sets', 'transaction_journals', 'adjustments'],
        admin: {
          title: 'Running the Close Job',
          body: 'Trigger the subledger job for the accounting period being closed. The job processes all source record changes since the last run, generating new journal entries and reversal pairs for any modifications. Monitor the Batch Management record to confirm successful completion and check for any processing errors that need attention before finalizing the period.'
        },
        dev: {
          title: 'Close Job Execution',
          body: 'The close job can be triggered via the Run Subledger Job flow action or through a scheduled Flow. Set the Accounting Record Start Date to the beginning of the close period. The BatchManagement record provides TotalRecordsProcessed, JournalsCreated, ErrorCount, and ErrorDetails. For large organizations, the first close job of a new Accounting Set processes all historical records, which can be a significant data operation.'
        }
      },
      {
        planet: 'transaction_journals',
        highlightEdges: ['fund_accounting', 'data_export'],
        admin: {
          title: 'Reviewing Generated Journals',
          body: 'After the job completes, review the generated Transaction Journal records for the period. Check that journal totals by fund and GL code match expected amounts. Look for any reversal records that indicate source data changed during the period. Verify that all committed pledges have the appropriate allocation records and all payments have matching payment journal entries.'
        },
        dev: {
          title: 'Journal Validation Queries',
          body: 'Run validation queries on TransactionJournal filtering by BatchManagementId for the close job run. Aggregate DebitAmount and CreditAmount by GLCode and FundName to verify balance. Check that sum of debits equals sum of credits across the full period. Identify orphaned reversals (reversals without corresponding new records) which may indicate processing errors.'
        }
      },
      {
        planet: 'data_export',
        highlightEdges: ['transaction_journals', 'fund_accounting'],
        admin: {
          title: 'Export and Reconcile',
          body: 'Export the period\'s journal entries via report, CSV, or API integration to your external accounting system. GL codes map each entry to the correct ledger account, and fund names enable fund-level reporting. Reconcile the exported totals against source system totals and external ledger balances. Once reconciliation confirms accuracy, the accounting period can be closed.'
        },
        dev: {
          title: 'Automated Export Pipeline',
          body: 'For organizations with automated close processes, build an API integration that queries TransactionJournal records by TransactionDate range and BatchManagementId. Transform the output to match the external accounting system\'s import format, mapping GLCode to chart of accounts entries. Include reversal records as journal adjustment entries. Schedule the export to run after the close job completes successfully.'
        }
      }
    ]
  }

];
