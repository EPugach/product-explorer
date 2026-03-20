// ══════════════════════════════════════════════════════════════
//  Accounting Subledger Entities — Objects & Custom Metadata
//  Native Salesforce product (no managed package prefix)
// ══════════════════════════════════════════════════════════════

export default {

  "transaction_journals": {
    "objects": [
      {
        "name": "TransactionJournal",
        "type": "standard",
        "domain": "transaction_journals",
        "description": "The core output record of Accounting Subledger. Each Transaction Journal record represents a single accounting entry with debit and credit amounts, GL codes, fund names, and date information. Records are categorized by Journal Type: Allocation (expected revenue/expense by fund), Payment (paid amounts by fund), or Transaction (consolidated paid amounts). Journals are immutable once created; changes are handled through reversal record pairs that preserve a complete audit trail. Accounting Subledger does not support manual creation of transaction journal records.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "Auto-generated unique identifier for each journal record" },
          { "name": "JournalType", "type": "Picklist", "description": "Categorizes the record as Allocation (expected revenue by fund), Payment (paid amounts by fund), or Transaction (consolidated paid amounts). Salesforce recommends not editing or deleting journal types to prevent processing errors" },
          { "name": "DebitAmount", "type": "Currency", "description": "The transaction amount on the debit side of the double entry. Debits increase balances for revenue and asset accounts and decrease balances for expense and liability accounts" },
          { "name": "CreditAmount", "type": "Currency", "description": "The transaction amount on the credit side of the double entry. Credits increase balances for expense and liability accounts and decrease balances for revenue and asset accounts" },
          { "name": "GLCode", "type": "Text", "description": "General ledger account identifier mapping to external accounting system. Automatically set based on journal type, accounting set type, and debit/credit direction using payment method, fund name, or default account codes" },
          { "name": "FundName", "type": "Text", "description": "Fund account destination for this journal entry. Pulled from the source record through the accounting set fund name field mapping, limited to 100 characters" },
          { "name": "CommittedDate", "type": "Date", "description": "Date when the source record became committed, set when the Generate Expected Revenue/Expense checkbox is first selected on the source record" },
          { "name": "DueDate", "type": "Date", "description": "Scheduled arrival date for allocation records. Populated only when grouping cash flows by due date is enabled on the associated accounting set, copied from the related record's scheduled date" },
          { "name": "PaymentDate", "type": "Date", "description": "Date when the source amount was marked as paid, as indicated in the field mapped to the accounting set's Payment Paid Date" },
          { "name": "TransactionDate", "type": "Date", "description": "Date when revenue or expense was first expected, received, or adjusted. Also known as the Booking Date in page layouts. Defaults to the job run date unless overridden through a transaction date field mapping on the accounting set" },
          { "name": "PaymentMethod", "type": "Picklist", "description": "Payment type such as cash, check, credit card, or ACH. Not populated by default; administrators must add picklist values matching their source object payment methods. Used as the GL code on the debit side for revenue-type journals" },
          { "name": "AccountingSetId", "type": "Lookup", "description": "Reference to the Accounting Set that generated this journal record, linking each entry to the configuration that produced it" },
          { "name": "BatchManagementId", "type": "Lookup", "description": "Reference to the Batch Management record for the job run that created this entry, providing traceability from journal records to specific job executions" },
          { "name": "IsReversal", "type": "Checkbox", "description": "Indicates this record is a reversal entry negating a previous journal. Reversal records have the same value as the original but with the sign flipped: positive becomes negative and negative becomes positive" },
          { "name": "ExternalTransactionId", "type": "Text", "description": "External transaction identifier for mapping journal entries to records in external accounting systems" },
          { "name": "CheckReferenceNumber", "type": "Text", "description": "Check or reference number recorded when the source record was marked as paid or written off. Source data must be 40 characters or fewer to avoid subledger job errors" },
          { "name": "AccrualJournalEntry", "type": "Checkbox", "description": "Indicates whether this journal record was generated through accrual accounting for committed amounts" },
          { "name": "WriteOffJournalEntry", "type": "Checkbox", "description": "Indicates the journal record was generated for a written-off amount, where the revenue was promised but not received" },
          { "name": "Comment", "type": "Text", "description": "Free-text field for additional notes or context about the journal entry" },
          { "name": "FundAccountValue", "type": "Text", "description": "The fund account value associated with this journal entry, used alongside the GL code for fund-level reporting and reconciliation" }
        ],
        "relationships": [
          { "target": "AccountingSet", "type": "lookup", "description": "Links each journal record to the Accounting Set configuration that produced it" },
          { "target": "BatchManagement", "type": "lookup", "description": "Links each journal record to the job execution that created it, enabling auditors to trace any journal entry back to its processing run" }
        ]
      }
    ],
    "metadata": [
      {
        "type": "JournalTypeConfig__mdt",
        "name": "Journal Type Configuration",
        "fields": {
          "TypeName__c": "Text",
          "DebitCreditBehavior__c": "Picklist",
          "RequiresFundAllocation__c": "Checkbox",
          "GeneratedOnCommit__c": "Checkbox",
          "GeneratedOnPayment__c": "Checkbox"
        },
        "description": "Defines the behavior rules for each Transaction Journal type (Allocation, Payment, Transaction). Controls whether fund-level detail is generated, the debit/credit direction for each type, and which accounting states trigger record creation. Salesforce recommends not editing or deleting journal types to prevent processing errors. In sandbox orgs, administrators may need to create journal type records via anonymous Apex if they are not already present."
      }
    ]
  },

  "accounting_sets": {
    "objects": [
      {
        "name": "AccountingSet",
        "type": "standard",
        "domain": "accounting_sets",
        "description": "The central configuration object that defines how source CRM data maps to Transaction Journal records. Each Accounting Set specifies a Revenue or Expense type, the source object hierarchy (1 to 4 levels deep), and field-by-field mappings for amounts, dates, fund names, GL codes, payment status, and optional custom fields. Criteria settings on the set filter which source records are eligible for processing. Only admin users can activate and deactivate accounting sets, and the object model cannot be changed after activation.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name identifying this accounting set configuration, such as Application Fees, Invoices, or Incoming Gift Transactions" },
          { "name": "SetType", "type": "Picklist", "description": "Revenue or Expense, determining debit/credit direction for generated journals. Revenue type debits asset accounts and credits revenue accounts; Expense type credits asset accounts and debits expense accounts. Should be verified with the accounting team and not changed after generating journals" },
          { "name": "PrimaryObject", "type": "Text", "description": "API name of the primary source object in the hierarchy. Can be any standard or custom object such as Opportunity, Invoice, or a custom Application Fee object" },
          { "name": "SecondaryObject", "type": "Text", "description": "API name of the secondary source object. Must have a lookup or master-detail relationship to the primary object. In two-object models, serves as the fund object; in three-object models, represents fund allocations" },
          { "name": "TertiaryObject", "type": "Text", "description": "API name of the tertiary source object for 3+ level models. Must have a lookup or master-detail relationship to both the primary and secondary objects" },
          { "name": "QuaternaryObject", "type": "Text", "description": "API name of the quaternary source object for 4-level models. Serves as the fund object and must have a lookup relationship to the tertiary object" },
          { "name": "OverallAmountField", "type": "Text", "description": "Source field containing the total transaction amount. The mapping varies by object model depth, with additional allocation amounts required in three- and four-object models" },
          { "name": "PaymentPaidCheckbox", "type": "Text", "description": "Source field indicating payment received status. When selected, tells Accounting Subledger the record has been paid and should generate payment-type journals" },
          { "name": "PaymentPaidDateField", "type": "Text", "description": "Source field containing the payment date. Must have a value when either Payment is Paid or Written-Off is selected on the source record" },
          { "name": "FundNameField", "type": "Text", "description": "Source field containing the fund name or designation, used as the GL code on generated journals. Must have a value on the source object, limited to 100 characters" },
          { "name": "FundAllocationAmountField", "type": "Text", "description": "Source field containing the per-fund allocation amount, used in three- and four-object models where transactions are split across multiple fund accounts" },
          { "name": "GLCodeField", "type": "Text", "description": "Source field mapping to the general ledger code. GL codes are automatically determined based on journal type and accounting set type, drawing from payment method, fund name, or default account codes" },
          { "name": "WrittenOffCheckbox", "type": "Text", "description": "Source field indicating write-off status. When selected, generates journals similar to paid records but marked as written off, indicating revenue was not received" },
          { "name": "GenerateExpectedRevenue", "type": "Checkbox", "description": "Enables Allocation record generation for committed, unpaid amounts. When enabled, the accounting set creates journals for pledged amounts not yet paid, supporting accrual accounting" },
          { "name": "PaymentScheduledDateField", "type": "Text", "description": "Source field for expected payment date, enabling due date grouping on allocation records. Must have a value on the source object when expected revenue generation is enabled" },
          { "name": "TransactionDateField", "type": "Text", "description": "Optional override for the Transaction Date on generated journals. When not mapped, the transaction date defaults to the job run date. In the four-object model, a secondary object transaction date can also be mapped" },
          { "name": "IsActive", "type": "Checkbox", "description": "Controls whether this set is included in subledger job processing. Only admin users can activate and deactivate sets, and the object model cannot be changed after activation" },
          { "name": "AccountingRecordStartDate", "type": "Date", "description": "Filters source records so only those with a primary object created date on or after this date are processed" },
          { "name": "RunOrder", "type": "Number", "description": "Determines the sequence in which accounting sets execute during a job run. Processed in ascending order, with empty run orders processed last" },
          { "name": "DefaultAccruedAccountCode", "type": "Text", "description": "GL code for the accounting system's default accrual account, used on allocation-type journal records for expected revenue and expense" },
          { "name": "DefaultWriteOffAccountCode", "type": "Text", "description": "GL code for the accounting system's written-off payments account, used when source records are marked as written off" },
          { "name": "ExpectedCashFlowGrouping", "type": "Picklist", "description": "Controls whether allocation records are grouped by fund account alone or by both fund account and due date. Changes do not impact existing records" },
          { "name": "PaidCashFlowGrouping", "type": "Picklist", "description": "Determines detail level for paid journals: Group by Summary splits only credits/debits by fund, Group by Fund Account splits all records by fund. Changing this impacts existing records" },
          { "name": "CheckReferenceNumberField", "type": "Text", "description": "Source field for the check or reference number recorded when a record is marked paid or written off. Source value must be 40 characters or fewer" }
        ],
        "relationships": [
          { "target": "TransactionJournal", "type": "parent", "description": "Each Accounting Set can produce many Transaction Journal records across multiple job runs" },
          { "target": "AccountingSetting", "type": "lookup", "description": "Set behavior is influenced by organization-wide Accounting Settings such as Skip Reversal Logic and processing engine selection" }
        ]
      },
      {
        "name": "AccountingFieldMapping",
        "type": "standard",
        "domain": "accounting_sets",
        "description": "Defines custom field mappings between source object fields and Transaction Journal custom fields. Each mapping record pairs a source field with a target journal field, enabling organization-specific data to flow into the accounting output beyond the standard field set. Up to 10 mappings per accounting set are supported. Mappings cannot be edited or deleted while the accounting set is active, and two mapping behaviors are available: point-in-time (captures value once) and current-value (tracks ongoing changes).",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name for this field mapping" },
          { "name": "SourceFieldApiName", "type": "Text", "description": "API name of the field on the source object to read from. Must be of a compatible data type with the target field" },
          { "name": "TargetFieldApiName", "type": "Text", "description": "API name of the custom field on Transaction Journal to write to. Cannot be used in another mapping within the same accounting set" },
          { "name": "SourceObjectLevel", "type": "Picklist", "description": "Which level of the object hierarchy this field comes from (primary, secondary, tertiary, or quaternary)" },
          { "name": "AccountingSetId", "type": "Lookup", "description": "The Accounting Set this mapping belongs to" },
          { "name": "MappingBehavior", "type": "Picklist", "description": "Point-in-time copies the value once at creation and ignores subsequent changes. Current-value copies the initial value and creates reversals when the source value is updated. Some objects like Fund do not support current-value" }
        ],
        "relationships": [
          { "target": "AccountingSet", "type": "child", "description": "Each field mapping belongs to one Accounting Set. Deleting the set via API or changing its object model also deletes related mappings" },
          { "target": "TransactionJournal", "type": "lookup", "description": "Mapping populates custom fields on generated journal records during job execution" }
        ]
      }
    ],
    "metadata": [
      {
        "type": "FieldMappingTemplate__mdt",
        "name": "Field Mapping Template",
        "fields": {
          "TemplateName__c": "Text",
          "SourceFieldPattern__c": "Text",
          "TargetFieldPattern__c": "Text",
          "DataTransformation__c": "Picklist",
          "IsRequired__c": "Checkbox"
        },
        "description": "Provides predefined field mapping templates that accelerate Accounting Set configuration. Templates define common source-to-journal field patterns for standard use cases like donation tracking, payment processing, and expense recording. Compatible data types are enforced: checkbox to checkbox, currency to currency or number, date to date, picklist to picklist or text, and reference to email, phone, reference, or text."
      },
      {
        "type": "CriteriaConfiguration__mdt",
        "name": "Criteria Configuration",
        "fields": {
          "FieldApiName__c": "Text",
          "Operator__c": "Picklist",
          "Value__c": "Text",
          "LogicalOperator__c": "Picklist"
        },
        "description": "Stores reusable criteria rule definitions that can be applied to Accounting Sets for source record filtering. Each criteria record defines a field-level condition with an operator and value. Three logic modes combine criteria: All Conditions Are Met (AND), Any Condition Is Met (OR), or No Conditions Are Met (exclude matching). Certain fields and data types including address, geolocation, encrypted string, and URL are not available for criteria."
      }
    ]
  },

  "fund_accounting": {
    "objects": [
      {
        "name": "FundAccount",
        "type": "standard",
        "domain": "fund_accounting",
        "description": "Represents a fund account that receives allocations from financial transactions. Fund accounts are identified by their fund name and associated GL code, enabling organizations to track restricted, unrestricted, and designated funds separately. In the two-object model, the fund object stores shared fund information referenced by multiple transactions. In the three- and four-object models, fund allocations specify amounts designated to each fund account.",
        "fields": [
          { "name": "FundName", "type": "Text", "description": "Display name of the fund such as General Fund, Building Fund, or Athletics Scholarships Fund. Used as the GL code on journal records and must be 100 characters or fewer" },
          { "name": "GLCode", "type": "Text", "description": "General ledger code linking this fund to the external accounting system. Configurable to match the accounting software's account naming, such as Pledges Receivable" },
          { "name": "FundType", "type": "Picklist", "description": "Classification as Restricted, Unrestricted, or Temporarily Restricted, enabling compliance with financial reporting standards for nonprofit and educational organizations" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this fund account is currently accepting allocations. Inactive funds are excluded from new transaction processing" },
          { "name": "Description", "type": "TextArea", "description": "Purpose and restrictions associated with this fund, helping data entry users understand which fund to select for each transaction" }
        ],
        "relationships": [
          { "target": "TransactionJournal", "type": "parent", "description": "Fund accounts appear on journal records as the fund allocation destination, with each fund generating separate journal entries" }
        ]
      }
    ],
    "metadata": [
      {
        "type": "FundAllocationRule__mdt",
        "name": "Fund Allocation Rule",
        "fields": {
          "AllocationMethod__c": "Picklist",
          "DefaultFundName__c": "Text",
          "DefaultGLCode__c": "Text",
          "SplitBehavior__c": "Picklist"
        },
        "description": "Defines default fund allocation behavior when source records do not specify explicit fund designations. Rules control how undesignated amounts are allocated to default funds, how multi-fund splits are calculated, and which GL codes are assigned when explicit mapping is absent. Total allocation amounts should equal the parent record amount to ensure consistency."
      }
    ]
  },

  "revenue_recognition": {
    "objects": [],
    "metadata": [
      {
        "type": "AccountingStateRule__mdt",
        "name": "Accounting State Rule",
        "fields": {
          "StateName__c": "Text",
          "GeneratesAllocation__c": "Checkbox",
          "GeneratesPayment__c": "Checkbox",
          "GeneratesTransaction__c": "Checkbox",
          "RequiresCommitment__c": "Checkbox"
        },
        "description": "Defines the journal generation rules for each accounting state (Committed, Uncommitted, Paid, Written-Off). Committed state generates journals for scheduled, paid, and written-off payments. Uncommitted state generates journals only for paid or written-off payments. The state is determined by the Generate Expected Revenue/Expense checkbox on the source record, making it the key switch between accrual and cash accounting behavior."
      }
    ]
  },

  "job_engine": {
    "objects": [
      {
        "name": "BatchManagement",
        "type": "standard",
        "domain": "job_engine",
        "description": "Tracks the execution history and results of each Accounting Subledger job run. Each Batch Management record captures the job start time, completion time, processing engine used, total source records evaluated, successful journal records created, error count, and detailed error messages. When the job finds a discrepancy it cannot correct, it logs failed records here. Provides administrators with monitoring and troubleshooting capabilities, including traceability from journal records back to the specific job that created them.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "Auto-generated unique identifier for each batch execution record" },
          { "name": "JobStartTime", "type": "DateTime", "description": "Timestamp when the subledger job began processing" },
          { "name": "JobEndTime", "type": "DateTime", "description": "Timestamp when the subledger job completed. Jobs can take up to two hours or more to finish" },
          { "name": "Status", "type": "Picklist", "description": "Execution status lifecycle: Queued (waiting to start), Processing (actively running), Completed (finished successfully), or Failed (unrecoverable error)" },
          { "name": "TotalRecordsProcessed", "type": "Number", "description": "Count of source records evaluated during this job run. The first run processes all eligible records, which can significantly increase data usage" },
          { "name": "JournalsCreated", "type": "Number", "description": "Count of Transaction Journal records successfully generated during this run" },
          { "name": "ErrorCount", "type": "Number", "description": "Count of source records that failed processing. Common causes include field value size mismatches, missing required fields, and Data Processing Engine errors" },
          { "name": "ErrorDetails", "type": "LongTextArea", "description": "Detailed error messages for records that failed processing, including field-level information about the failure cause" },
          { "name": "ProcessingEngine", "type": "Picklist", "description": "Which engine was used: Data Processing Engine (CRM Analytics) or Data 360 (Cloud Data Platform)" },
          { "name": "AccountingRecordStartDate", "type": "Date", "description": "The start date filter applied to source records for this run, limiting processing to records created on or after this date" }
        ],
        "relationships": [
          { "target": "TransactionJournal", "type": "parent", "description": "Each batch run produces multiple Transaction Journal records, providing a complete traceability chain from job execution to individual journal entries" },
          { "target": "AccountingSetting", "type": "lookup", "description": "Job execution uses organization-wide Accounting Settings including processing engine selection and reversal logic configuration" }
        ]
      }
    ],
    "metadata": [
      {
        "type": "ProcessingEngineConfig__mdt",
        "name": "Processing Engine Configuration",
        "fields": {
          "EngineName__c": "Text",
          "EngineType__c": "Picklist",
          "RequiredEdition__c": "Text",
          "MaxBatchSize__c": "Number",
          "SupportsIncremental__c": "Checkbox"
        },
        "description": "Configures the available processing engines for subledger job execution. Data Processing Engine is built on CRM Analytics and available on all eligible editions. Data 360 is built on Cloud Data Platform, available in Enterprise, Unlimited, and Developer Editions with Data 360 and Accounting Subledger Growth add-on. Engine selection is organization-wide and requires deactivating and reactivating accounting sets when changed. Jobs should not exceed 30 hours per month total."
      }
    ]
  },

  "adjustments": {
    "objects": [],
    "metadata": [
      {
        "type": "ReversalBehavior__mdt",
        "name": "Reversal Behavior Configuration",
        "fields": {
          "SkipReversalLogic__c": "Checkbox",
          "TrackPaymentMethodChanges__c": "Checkbox",
          "CreateAuditTrail__c": "Checkbox",
          "ReversalRecordPrefix__c": "Text"
        },
        "description": "Controls how the reversal pattern operates for data adjustments. Skip Reversal Logic reduces processing time by treating reversals as adjustments and current-value field mappings as point-in-time mappings, while also ignoring secondary object mappings in three-object models and tertiary objects in four-object models. Must be enabled before activating accounting sets, and existing sets require deactivation and reactivation to take effect. Payment method change tracking enables journal adjustments when the payment type changes on source records."
      }
    ]
  },

  "data_export": {
    "objects": [],
    "metadata": []
  },

  "source_objects": {
    "objects": [],
    "metadata": [
      {
        "type": "ObjectModelConfig__mdt",
        "name": "Object Model Configuration",
        "fields": {
          "ModelDepth__c": "Number",
          "PrimaryObjectType__c": "Text",
          "SecondaryObjectType__c": "Text",
          "TertiaryObjectType__c": "Text",
          "RelationshipField__c": "Text"
        },
        "description": "Defines reusable source object model templates for common CRM data hierarchies. Four model depths are supported: one-object for all-in-one records, two-object for separate fund information, three-object for fund allocation splitting, and four-object for complex structures with multiple payments rolling up to a single record. Each deeper object must have a lookup or master-detail relationship to the level above. An object can only be used once per accounting set."
      }
    ]
  },

  "setup": {
    "objects": [
      {
        "name": "AccountingSetting",
        "type": "standard",
        "domain": "setup",
        "description": "Stores organization-wide configuration for Accounting Subledger behavior. This singleton object holds system-level toggles that affect all Accounting Sets and job processing, including the processing engine selection, reversal logic behavior, transaction journal creation master switch, payment method tracking, and due date grouping for expected revenue records. Changes to these settings take effect on the next subledger job run. Transaction journal creation is off by default and should not be enabled before the implementation is complete and tested.",
        "fields": [
          { "name": "SkipReversalLogic", "type": "Checkbox", "description": "When enabled, reduces processing by treating reversals as adjustments and current-value mappings as point-in-time. Ignores secondary object mappings in three-object models and tertiary objects in four-object models. Must be enabled before activating accounting sets; existing sets require deactivation and reactivation" },
          { "name": "ProcessingEngine", "type": "Picklist", "description": "Selects Data Processing Engine (CRM Analytics) or Data 360 (Cloud Data Platform) for job execution. Organization-wide setting that requires deactivating and reactivating all accounting sets when changed" },
          { "name": "TrackPaymentMethodChanges", "type": "Checkbox", "description": "Enables journal adjustments when payment method changes on source records, generating new journals with the updated method and reclass records for previously generated data" },
          { "name": "EnableDueDateGrouping", "type": "Checkbox", "description": "Groups expected revenue allocations by due date on the Transaction Journal, splitting allocation records by both fund account and scheduled payment date" },
          { "name": "DefaultTransactionDate", "type": "Picklist", "description": "Controls whether Transaction Date defaults to job run date or source record date when no explicit transaction date field is mapped on the accounting set" },
          { "name": "TransactionJournalCreation", "type": "Checkbox", "description": "Master switch that enables or disables all journal generation. Off by default. Should not be turned on until the implementation is complete and tested in a sandbox" },
          { "name": "DataCloudRuntime", "type": "Checkbox", "description": "Enables Data 360 as the organization-wide processing engine. Requires Data Cloud setup, connector permissions, and object permission updates before enabling" }
        ],
        "relationships": [
          { "target": "BatchManagement", "type": "parent", "description": "Accounting Settings influence all batch job executions through processing engine selection and behavior toggles" },
          { "target": "AccountingSet", "type": "parent", "description": "Organization settings affect all Accounting Set processing behavior, including reversal logic and journal creation" }
        ]
      }
    ],
    "metadata": [
      {
        "type": "PermissionSetConfig__mdt",
        "name": "Permission Set Configuration",
        "fields": {
          "PermissionSetName__c": "Text",
          "AccessLevel__c": "Picklist",
          "IncludesJobExecution__c": "Checkbox",
          "IncludesSetManagement__c": "Checkbox",
          "IncludesSettingsAccess__c": "Checkbox"
        },
        "description": "Defines the four graduated permission sets that control Accounting Subledger access. Access Accounting Subledger Growth provides view access to journal records. Data Pipelines Base User enables data processing features required for journal generation. Run Accounting Subledger Job allows triggering manual and scheduled jobs. Manage Accounting Subledger grants full administrative control over accounting sets, settings, and configuration. Users are created with the Salesforce or Salesforce Platform user license."
      }
    ]
  }

};
