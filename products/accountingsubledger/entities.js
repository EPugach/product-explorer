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
        "description": "The core output record of Accounting Subledger. Each Transaction Journal record represents a single accounting entry with debit and credit amounts, GL codes, fund names, and date information. Records are categorized by Journal Type: Allocation (expected revenue/expense by fund), Payment (paid amounts by fund), or Transaction (consolidated paid amounts). Journals are immutable once created; changes are handled through reversal record pairs.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "Auto-generated unique identifier for each journal record" },
          { "name": "JournalType", "type": "Picklist", "description": "Categorizes the record as Allocation, Payment, or Transaction" },
          { "name": "DebitAmount", "type": "Currency", "description": "The transaction amount on the debit side of the double entry" },
          { "name": "CreditAmount", "type": "Currency", "description": "The transaction amount on the credit side of the double entry" },
          { "name": "GLCode", "type": "Text", "description": "General ledger account identifier mapping to external accounting system" },
          { "name": "FundName", "type": "Text", "description": "Fund account destination for this journal entry" },
          { "name": "CommittedDate", "type": "Date", "description": "Date when the source record became committed" },
          { "name": "DueDate", "type": "Date", "description": "Scheduled arrival date for allocation records with due date grouping" },
          { "name": "PaymentDate", "type": "Date", "description": "Date when the source amount was marked as paid" },
          { "name": "TransactionDate", "type": "Date", "description": "Date when revenue or expense was first expected, received, or adjusted" },
          { "name": "PaymentMethod", "type": "Picklist", "description": "Payment type such as cash, check, credit card, or ACH" },
          { "name": "AccountingSetId", "type": "Lookup", "description": "Reference to the Accounting Set that generated this journal record" },
          { "name": "BatchManagementId", "type": "Lookup", "description": "Reference to the Batch Management record for the job run that created this entry" },
          { "name": "IsReversal", "type": "Checkbox", "description": "Indicates this record is a reversal entry negating a previous journal" }
        ],
        "relationships": [
          { "target": "AccountingSet", "type": "lookup", "description": "Links each journal record to the Accounting Set configuration that produced it" },
          { "target": "BatchManagement", "type": "lookup", "description": "Links each journal record to the job execution that created it" }
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
        "description": "Defines the behavior rules for each Transaction Journal type (Allocation, Payment, Transaction). Controls whether fund-level detail is generated, the debit/credit direction for each type, and which accounting states trigger record creation."
      }
    ]
  },

  "accounting_sets": {
    "objects": [
      {
        "name": "AccountingSet",
        "type": "standard",
        "domain": "accounting_sets",
        "description": "The central configuration object that defines how source CRM data maps to Transaction Journal records. Each Accounting Set specifies a Revenue or Expense type, the source object hierarchy (2 to 4 levels deep), and field-by-field mappings for amounts, dates, fund names, GL codes, payment status, and optional custom fields. Criteria settings on the set filter which source records are eligible for processing.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name identifying this accounting set configuration" },
          { "name": "SetType", "type": "Picklist", "description": "Revenue or Expense, determining debit/credit direction" },
          { "name": "PrimaryObject", "type": "Text", "description": "API name of the primary source object in the hierarchy" },
          { "name": "SecondaryObject", "type": "Text", "description": "API name of the secondary source object, if applicable" },
          { "name": "TertiaryObject", "type": "Text", "description": "API name of the tertiary source object for 3+ level models" },
          { "name": "QuaternaryObject", "type": "Text", "description": "API name of the quaternary source object for 4-level models" },
          { "name": "OverallAmountField", "type": "Text", "description": "Source field containing the total transaction amount" },
          { "name": "PaymentPaidCheckbox", "type": "Text", "description": "Source field indicating payment received status" },
          { "name": "PaymentPaidDateField", "type": "Text", "description": "Source field containing the payment date" },
          { "name": "FundNameField", "type": "Text", "description": "Source field containing the fund name or designation" },
          { "name": "FundAllocationAmountField", "type": "Text", "description": "Source field containing the per-fund allocation amount" },
          { "name": "GLCodeField", "type": "Text", "description": "Source field mapping to the general ledger code" },
          { "name": "WrittenOffCheckbox", "type": "Text", "description": "Source field indicating write-off status" },
          { "name": "GenerateExpectedRevenue", "type": "Checkbox", "description": "Enables Allocation record generation for committed, unpaid amounts" },
          { "name": "PaymentScheduledDateField", "type": "Text", "description": "Source field for expected payment date, enabling due date grouping" },
          { "name": "TransactionDateField", "type": "Text", "description": "Optional override for the Transaction Date on generated journals" },
          { "name": "IsActive", "type": "Checkbox", "description": "Controls whether this set is included in subledger job processing" }
        ],
        "relationships": [
          { "target": "TransactionJournal", "type": "parent", "description": "Each Accounting Set can produce many Transaction Journal records" },
          { "target": "AccountingSetting", "type": "lookup", "description": "Set behavior is influenced by organization-wide Accounting Settings" }
        ]
      },
      {
        "name": "AccountingFieldMapping",
        "type": "standard",
        "domain": "accounting_sets",
        "description": "Defines custom field mappings between source object fields and Transaction Journal custom fields. Each mapping record pairs a source field API name with a target journal field, enabling organization-specific data to flow into the accounting output beyond the standard field set. Field mappings are associated with an Accounting Set and processed during journal generation.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name for this field mapping" },
          { "name": "SourceFieldApiName", "type": "Text", "description": "API name of the field on the source object to read from" },
          { "name": "TargetFieldApiName", "type": "Text", "description": "API name of the custom field on Transaction Journal to write to" },
          { "name": "SourceObjectLevel", "type": "Picklist", "description": "Which level of the object hierarchy this field comes from" },
          { "name": "AccountingSetId", "type": "Lookup", "description": "The Accounting Set this mapping belongs to" }
        ],
        "relationships": [
          { "target": "AccountingSet", "type": "child", "description": "Each field mapping belongs to one Accounting Set" },
          { "target": "TransactionJournal", "type": "lookup", "description": "Mapping populates custom fields on generated journal records" }
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
        "description": "Provides predefined field mapping templates that accelerate Accounting Set configuration. Templates define common source-to-journal field patterns for standard use cases like donation tracking, payment processing, and expense recording. Administrators select a template as a starting point and customize mappings as needed."
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
        "description": "Stores reusable criteria rule definitions that can be applied to Accounting Sets for source record filtering. Each criteria record defines a field-level condition with an operator and value. Multiple criteria combine with AND/OR logic to create complex filtering rules that control which source records generate journal entries."
      }
    ]
  },

  "fund_accounting": {
    "objects": [
      {
        "name": "FundAccount",
        "type": "standard",
        "domain": "fund_accounting",
        "description": "Represents a fund account that receives allocations from financial transactions. Fund accounts are identified by their fund name and associated GL code, enabling organizations to track restricted, unrestricted, and designated funds separately. Each fund account maps to a specific account in the external general ledger system through its GL code.",
        "fields": [
          { "name": "FundName", "type": "Text", "description": "Display name of the fund such as General Fund or Building Fund" },
          { "name": "GLCode", "type": "Text", "description": "General ledger code linking this fund to the external accounting system" },
          { "name": "FundType", "type": "Picklist", "description": "Classification as Restricted, Unrestricted, or Temporarily Restricted" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this fund account is currently accepting allocations" },
          { "name": "Description", "type": "TextArea", "description": "Purpose and restrictions associated with this fund" }
        ],
        "relationships": [
          { "target": "TransactionJournal", "type": "parent", "description": "Fund accounts appear on journal records as the fund allocation destination" }
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
        "description": "Defines default fund allocation behavior when source records do not specify explicit fund designations. Rules control how undesignated amounts are allocated to default funds, how multi-fund splits are calculated, and which GL codes are assigned when explicit mapping is absent."
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
        "description": "Defines the journal generation rules for each accounting state (Committed, Uncommitted, Paid, Written-Off). Each rule specifies which journal types are created when a source record enters that state, controlling the transition between accrual and cash accounting behaviors."
      }
    ]
  },

  "job_engine": {
    "objects": [
      {
        "name": "BatchManagement",
        "type": "standard",
        "domain": "job_engine",
        "description": "Tracks the execution history and results of each Accounting Subledger job run. Each Batch Management record captures the job start time, completion time, processing engine used, total source records evaluated, successful journal records created, error count, and detailed error messages. Provides administrators with monitoring and troubleshooting capabilities for subledger processing.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "Auto-generated unique identifier for each batch execution record" },
          { "name": "JobStartTime", "type": "DateTime", "description": "Timestamp when the subledger job began processing" },
          { "name": "JobEndTime", "type": "DateTime", "description": "Timestamp when the subledger job completed" },
          { "name": "Status", "type": "Picklist", "description": "Execution status: Queued, Processing, Completed, or Failed" },
          { "name": "TotalRecordsProcessed", "type": "Number", "description": "Count of source records evaluated during this job run" },
          { "name": "JournalsCreated", "type": "Number", "description": "Count of Transaction Journal records successfully generated" },
          { "name": "ErrorCount", "type": "Number", "description": "Count of source records that failed processing" },
          { "name": "ErrorDetails", "type": "LongTextArea", "description": "Detailed error messages for records that failed processing" },
          { "name": "ProcessingEngine", "type": "Picklist", "description": "Which engine was used: Data Processing Engine or Data 360" },
          { "name": "AccountingRecordStartDate", "type": "Date", "description": "The start date filter applied to source records for this run" }
        ],
        "relationships": [
          { "target": "TransactionJournal", "type": "parent", "description": "Each batch run produces multiple Transaction Journal records" },
          { "target": "AccountingSetting", "type": "lookup", "description": "Job execution uses organization-wide Accounting Settings" }
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
        "description": "Configures the available processing engines for subledger job execution. Defines the Data Processing Engine (CRM Analytics-based, available on all eligible editions) and Data 360 (Cloud Data Platform-based, Enterprise Edition and above). Includes engine-specific batch size limits and incremental processing capabilities."
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
        "description": "Controls how the reversal pattern operates for data adjustments. The Skip Reversal Logic setting reduces processing overhead by not creating paired reversal records for certain change scenarios. Payment method change tracking determines whether payment type changes trigger journal adjustments. Audit trail settings control the level of detail preserved in reversal records."
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
        "description": "Defines reusable source object model templates for common CRM data hierarchies. Templates specify the standard 2-object, 3-object, and 4-object model patterns along with the default relationship fields that connect each level. Accelerates Accounting Set configuration by providing pre-built source object hierarchy patterns."
      }
    ]
  },

  "setup": {
    "objects": [
      {
        "name": "AccountingSetting",
        "type": "standard",
        "domain": "setup",
        "description": "Stores organization-wide configuration for Accounting Subledger behavior. This singleton object holds system-level toggles that affect all Accounting Sets and job processing, including the processing engine selection, reversal logic behavior, payment method tracking, and due date grouping for expected revenue records. Changes to these settings take effect on the next subledger job run.",
        "fields": [
          { "name": "SkipReversalLogic", "type": "Checkbox", "description": "When enabled, reduces processing by not creating paired reversal records for certain adjustments" },
          { "name": "ProcessingEngine", "type": "Picklist", "description": "Selects Data Processing Engine or Data 360 for job execution" },
          { "name": "TrackPaymentMethodChanges", "type": "Checkbox", "description": "Enables journal adjustments when payment method changes on source records" },
          { "name": "EnableDueDateGrouping", "type": "Checkbox", "description": "Groups expected revenue allocations by due date on the Transaction Journal" },
          { "name": "DefaultTransactionDate", "type": "Picklist", "description": "Controls whether Transaction Date defaults to job run date or source record date" }
        ],
        "relationships": [
          { "target": "BatchManagement", "type": "parent", "description": "Accounting Settings influence all batch job executions" },
          { "target": "AccountingSet", "type": "parent", "description": "Organization settings affect all Accounting Set processing behavior" }
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
        "description": "Defines the four graduated permission sets that control Accounting Subledger access. Access Accounting Subledger Growth (read-only), Data Pipelines Base User (processing setup), Run Accounting Subledger Job (job execution), and Manage Accounting Subledger (full admin). Each level includes specific object permissions and field-level security assignments."
      }
    ]
  }

};
