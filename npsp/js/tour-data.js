// ══════════════════════════════════════════════════════════════
//  TOUR DATA — Constellation Stories tour definitions
//  Each tour is a sequence of stops with admin & dev narration
// ══════════════════════════════════════════════════════════════

export const TOURS = [
  {
    id: 'donation-lifecycle',
    title: 'The Donation Lifecycle',
    icon: '\uD83D\uDCB0',
    desc: 'Follow a donation from creation through naming, rollups, and allocations',
    stops: [
      {
        planet: 'donations',
        highlightEdges: ['contacts'],
        admin: {
          title: 'It Starts With a Gift',
          body: 'When a donor gives, NPSP creates an Opportunity record. The Opportunity is the core donation object, storing amount, date, stage, and donor info. NPSP automatically names it and links it to the right Contact and Account.'
        },
        dev: {
          title: 'Opportunity Insert Triggers',
          body: 'On Opportunity insert, TDTM dispatches to OPP_OpportunityNaming_TDTM (AfterInsert), which queries Household_Naming_Settings__c and constructs the name from Contact/Account data. OPP_OpportunityContactRoles_TDTM then ensures a Primary Contact Role exists.'
        }
      },
      {
        planet: 'tdtm',
        highlightEdges: ['donations', 'contacts'],
        admin: {
          title: 'The Trigger Engine',
          body: 'NPSP uses a single trigger per object, dispatching to handler classes via the Table-Driven Trigger Management (TDTM) framework. This means all automation runs in a controlled sequence, and admins can enable or disable individual handlers from Setup.'
        },
        dev: {
          title: 'TDTM Dispatch Architecture',
          body: 'TDTM_TriggerHandler queries Trigger_Handler__c records ordered by Load_Order__c, instantiates each handler class via Type.forName(), and calls run(). Handlers extend TDTM_Runnable and return a DmlWrapper for batched DML. Recursion is controlled via TDTM_Runnable.Action enum checks.'
        }
      },
      {
        planet: 'contacts',
        highlightEdges: ['donations', 'rollups'],
        admin: {
          title: 'The Donor Record',
          body: 'NPSP organizes donors using the Household Account model. Each Contact belongs to a Household Account, and donations roll up to both levels. Contact Roles on Opportunities connect donors to their gifts, supporting soft credits and acknowledgment letters.'
        },
        dev: {
          title: 'Household and Contact Role Processing',
          body: 'ACCT_IndividualAccounts_TDTM auto-creates Household Accounts for Contacts without one. On Opportunity insert, OPP_OpportunityContactRoles_TDTM creates OCRs. HH_HouseholdNaming handles naming conventions using token-based templates (e.g., {!LastName} Household).'
        }
      },
      {
        planet: 'rollups',
        highlightEdges: ['donations', 'contacts'],
        admin: {
          title: 'The Math: Totals and Summaries',
          body: 'Customizable Rollups (CRLP) calculate totals like Total Donations, Largest Gift, and Last Gift Date. They roll up from Opportunities to Contacts, Accounts, and GAU Allocations. Admins can create custom rollups without code using the NPSP Settings UI.'
        },
        dev: {
          title: 'CRLP Engine Internals',
          body: 'CRLP uses Custom Metadata (Rollup__mdt, Filter_Group__mdt, Filter_Rule__mdt) to define rollups declaratively. The CRLP_RollupProcessor handles incremental vs. full recalculations. Batch jobs (CRLP_Account_BATCH, CRLP_Contact_BATCH) process large orgs in configurable batch sizes.'
        }
      },
      {
        planet: 'allocations',
        highlightEdges: ['donations', 'rollups'],
        admin: {
          title: 'Splitting the Funds',
          body: 'GAU Allocations let you split a single donation across multiple funds or programs (General Accounting Units). You can set default allocations so every gift is automatically tagged, and NPSP ensures allocation percentages always add up correctly.'
        },
        dev: {
          title: 'Allocation Trigger Logic',
          body: 'ALLO_Allocations_TDTM fires on Opportunity and GAU Allocation changes. It enforces percentage/amount validation, creates default allocations from NPSP Settings, and cascades changes to Payment Allocations. The ALLO_AllocationsUtil class handles the reconciliation math.'
        }
      }
    ]
  },
  {
    id: 'recurring-revenue',
    title: 'The Recurring Revenue Engine',
    icon: '\uD83D\uDD04',
    desc: 'How recurring donations create scheduled installments automatically',
    stops: [
      {
        planet: 'recurring',
        highlightEdges: ['donations', 'batch'],
        admin: {
          title: 'Setting Up Recurring Giving',
          body: 'Enhanced Recurring Donations (RD2) let donors commit to ongoing gifts. Each Recurring Donation record stores the schedule (monthly, weekly, custom), amount, and payment method. NPSP automatically creates installment Opportunities based on the schedule.'
        },
        dev: {
          title: 'RD2 Schedule Engine',
          body: 'RD2_ScheduleService parses the Installment_Period__c, Day_of_Month__c, and custom schedule records (RecurringDonationSchedule__c) to project future installments. The RD2_OpportunityMatcher matches projected installments to existing Opportunities using date-window matching.'
        }
      },
      {
        planet: 'batch',
        highlightEdges: ['recurring', 'donations'],
        admin: {
          title: 'Nightly Processing',
          body: 'NPSP runs batch jobs to evaluate Recurring Donations nightly. These jobs check if new installments are due, update statuses, and create Opportunity records for upcoming payments. Admins configure the look-ahead window in NPSP Settings.'
        },
        dev: {
          title: 'Batch Job Architecture',
          body: 'RD2_OpportunityEvaluation_BATCH iterates all active RDs, calling RD2_EvaluationService to compare projected schedules against existing Opps. Missing installments are created, closed ones are marked, and the CurrentYearValue/NextYearValue rollup fields are updated via CRLP.'
        }
      },
      {
        planet: 'donations',
        highlightEdges: ['recurring', 'rollups'],
        admin: {
          title: 'Installments Become Donations',
          body: 'Each installment Opportunity created from a Recurring Donation goes through the same lifecycle as a one-time gift. It gets auto-named, rolls up to Contact and Account totals, and can have GAU Allocations applied. The RD record tracks overall giving progress.'
        },
        dev: {
          title: 'Installment Opportunity Processing',
          body: 'Created installments fire the standard TDTM chain: OPP_OpportunityNaming_TDTM, OPP_OpportunityContactRoles_TDTM, then ALLO_Allocations_TDTM. The nRecurringDonation__c lookup on Opportunity links back to the parent RD for lifecycle tracking.'
        }
      },
      {
        planet: 'elevate',
        highlightEdges: ['recurring', 'donations'],
        admin: {
          title: 'Payment Processing',
          body: 'Salesforce Elevate provides integrated payment processing for online donations. Connected to Recurring Donations, it can automatically charge donors on schedule. Elevate handles PCI compliance, tokenization, and payment status updates back to Salesforce.'
        },
        dev: {
          title: 'Elevate Integration Layer',
          body: 'The PS_IntegrationService class handles REST callouts to the Elevate Payments API. Commitment records in Elevate map 1:1 to RD records. GE_GiftEntryController manages the Elevate widget rendering, and the ElevateTokenizedPaymentMapper handles the secure token exchange.'
        }
      }
    ]
  },
  {
    id: 'data-pipeline',
    title: 'The Data Pipeline',
    icon: '\uD83D\uDD00',
    desc: 'How imported gifts flow through matching, deduplication, and rollups',
    stops: [
      {
        planet: 'bdi',
        highlightEdges: ['donations', 'contacts'],
        admin: {
          title: 'Importing Gift Data',
          body: 'Batch Data Import (BDI) processes incoming gifts in bulk. Whether from a CSV upload or Gift Entry form, BDI matches or creates donor records, creates Opportunities, and applies allocations. It handles deduplication so you do not get double records.'
        },
        dev: {
          title: 'BDI Processing Engine',
          body: 'BDI_DataImport_BATCH processes DataImport__c records through a pipeline: BDI_ContactService matches/creates Contacts, BDI_DonationImportService creates/matches Opportunities using configurable matching rules (ExactMatchByName, BestMatchOrCreate). Field mappings are defined in Data_Import_Field_Mapping__mdt.'
        }
      },
      {
        planet: 'donations',
        highlightEdges: ['bdi', 'contacts'],
        admin: {
          title: 'Matched or Created',
          body: 'BDI either matches the incoming gift to an existing Opportunity (by amount, date, and donor) or creates a new one. The matching rules are configurable, letting you balance between strict deduplication and flexible import. Matched gifts update the existing record rather than creating duplicates.'
        },
        dev: {
          title: 'Donation Matching Logic',
          body: 'BDI_DonationImportService.matchDonation() queries existing Opportunities using the configured BDI_MatchDonations matching strategy. Match rules check Amount, CloseDate (within a configurable window), and Contact/Account lookup. Apex-defined Data_Import_Field_Mapping__mdt controls field-level mapping from DataImport__c to Opportunity.'
        }
      },
      {
        planet: 'contacts',
        highlightEdges: ['bdi', 'donations'],
        admin: {
          title: 'Donor Deduplication',
          body: 'BDI checks if the donor already exists before creating a new Contact. It matches on name, email, and custom fields you configure. When a match is found, the existing record is used. This keeps your database clean and your rollup totals accurate.'
        },
        dev: {
          title: 'Contact Matching Service',
          body: 'BDI_ContactService uses Duplicate Rules (Salesforce standard) and custom BDI matching logic. It queries by FirstName + LastName + Email, then applies the configured Matching_Rule__c. ACCT_IndividualAccounts_TDTM fires to create the Household Account if a new Contact is created.'
        }
      },
      {
        planet: 'rollups',
        highlightEdges: ['donations', 'contacts'],
        admin: {
          title: 'Totals Recalculated',
          body: 'After the import completes, NPSP recalculates all rollup fields. Total Donations, Average Gift, Largest Gift, and more update automatically. If you use custom rollups, those recalculate too. The batch rollup jobs ensure even large imports get accurate totals.'
        },
        dev: {
          title: 'Post-Import Rollup Cascade',
          body: 'After BDI completes, CRLP_RollupProcessor.runRollupsForIds() handles incremental rollups for affected Contacts and Accounts. For large batches, the system defers to CRLP_Account_BATCH and CRLP_Contact_BATCH. The Schedulable_API class coordinates these batch chains to avoid governor limit conflicts.'
        }
      }
    ]
  },
  {
    id: 'donor-intelligence',
    title: 'Donor Intelligence',
    icon: '\uD83E\uDDE0',
    desc: 'How NPSP builds a 360-degree donor profile from credits, affiliations, and levels',
    stops: [
      {
        planet: 'contacts',
        highlightEdges: ['softcredits', 'affiliations'],
        admin: {
          title: 'The Donor Profile',
          body: 'Every donor starts as a Contact in a Household Account. NPSP enriches this record with giving history, relationships, organization affiliations, and engagement data. The Contact becomes a full donor profile that drives segmentation, stewardship, and reporting.'
        },
        dev: {
          title: 'Household Account Model',
          body: 'ACCT_IndividualAccounts_TDTM fires on Contact insert to auto-create a Household Account if none exists. HH_HouseholdNaming builds household name and greetings from member Contact names using configurable token templates ({!LastName} Household). The model supports 1:1, Household, and Organization account types.'
        }
      },
      {
        planet: 'softcredits',
        highlightEdges: ['contacts', 'donations'],
        admin: {
          title: 'Shared Credit for Gifts',
          body: 'Soft Credits let you recognize multiple people for a single donation. A spouse, board member, or solicitor can all receive credit without doubling the amount. NPSP tracks both hard credits (the actual donor) and soft credits (influencers and household members) in rollup totals.'
        },
        dev: {
          title: 'Soft Credit Architecture',
          body: 'Soft credits are driven by OpportunityContactRole records with specific roles (Soft Credit, Household Member, Solicitor). PSC_PartialSoftCredit_TDTM manages Partial_Soft_Credit__c records for amount-specific attribution. Rollup fields like npo02__Soft_Credit_Total__c on Contact are calculated by the CRLP engine using Filter_Group__mdt rules that include soft credit OCR roles.'
        }
      },
      {
        planet: 'affiliations',
        highlightEdges: ['contacts', 'softcredits'],
        admin: {
          title: 'Organization Connections',
          body: 'Affiliations link Contacts to Organizations (employer, board member, volunteer). These connections drive matching gift eligibility, organizational giving attribution, and relationship mapping. A Contact can have multiple affiliations with start/end dates and roles.'
        },
        dev: {
          title: 'Affiliation Trigger Processing',
          body: 'AFFL_Affiliations_TDTM fires on Contact and npe5__Affiliation__c changes. On Contact insert/update, it checks the Primary Affiliation field and creates/updates the corresponding Affiliation record. AFFL_MultiRecordType_TDTM handles auto-creation for multiple account record types. The handler also manages the bidirectional sync between Contact.Primary_Affiliation__c and the primary Affiliation record.'
        }
      },
      {
        planet: 'levels',
        highlightEdges: ['contacts', 'rollups'],
        admin: {
          title: 'Automatic Donor Tiers',
          body: 'Levels auto-segment donors into tiers (Bronze, Silver, Gold) based on giving history. Configure thresholds on any numeric field, and NPSP assigns the matching Level to each Contact or Account. Levels update nightly, keeping donor segments current without manual work.'
        },
        dev: {
          title: 'Level Assignment Engine',
          body: 'LVL_LevelAssign_BATCH runs nightly, querying all Level__c records ordered by Minimum_Amount__c descending. For each target object (Contact/Account), it evaluates the Source_Field__c value against level ranges and writes the result to the Level__c lookup. The batch processes in configurable scope sizes and supports both ascending and descending level hierarchies.'
        }
      },
      {
        planet: 'rollups',
        highlightEdges: ['contacts', 'donations'],
        admin: {
          title: 'The Complete Picture',
          body: 'Customizable Rollups aggregate everything: hard credits, soft credits, household totals, and custom metrics. With over 87 out-of-box rollups, NPSP gives admins full control to create new rollups using filters, fiscal years, and custom date ranges. This is the math that powers donor intelligence.'
        },
        dev: {
          title: 'CRLP Filter and Aggregation',
          body: 'CRLP_RollupProcessor evaluates Rollup__mdt definitions against Filter_Group__mdt and Filter_Rule__mdt criteria. Each rollup specifies a Detail Object, Detail Field, Summary Object, Summary Field, and Operation (SUM, COUNT, AVERAGE, BEST_YEAR, YEARS_DONATED). The engine supports incremental (trigger-based) and full (batch) recalculation modes, with CRLP_ApiService exposing the configuration to Lightning components.'
        }
      }
    ]
  },
  {
    id: 'donor-relationships',
    title: 'Donor Relationships',
    icon: '\uD83E\uDD1D',
    desc: 'Mapping personal connections, addresses, and engagement plans for donor cultivation',
    stops: [
      {
        planet: 'contacts',
        highlightEdges: ['relationships', 'addresses'],
        admin: {
          title: 'Household Members',
          body: 'NPSP groups family members into Household Accounts. Spouses, children, and other household members share an address and appear together in donation acknowledgments. The household model lets you track both individual and family-level giving.'
        },
        dev: {
          title: 'Household Membership Processing',
          body: 'When a Contact is added to a Household Account, HH_HouseholdNaming regenerates the household name and greetings using the Household_Naming_Settings__c configuration. HH_Households_TDTM manages household membership changes, updating naming, merging, and ensuring Contacts moving between households trigger rollup recalculations on both the source and destination Accounts.'
        }
      },
      {
        planet: 'relationships',
        highlightEdges: ['contacts', 'donations'],
        admin: {
          title: 'Contact-to-Contact Links',
          body: 'Relationships connect Contacts to each other: spouse, employer, mentor, referrer, friend. NPSP creates reciprocal relationships automatically. If you mark Alice as Bob\'s spouse, Bob automatically becomes Alice\'s spouse. Related Opportunity Contact Roles can auto-create soft credits based on relationship type.'
        },
        dev: {
          title: 'Reciprocal Relationship Engine',
          body: 'REL_Relationships_TDTM fires on npe4__Relationship__c insert/update/delete. It auto-creates the reciprocal record using Relationship_Lookup__c custom metadata to map types (e.g., "Spouse" <-> "Spouse", "Employer" <-> "Employee"). REL_Relationships_Cm_TDTM syncs changes between the pair. The handler prevents infinite recursion via a static Set<Id> tracking processed records.'
        }
      },
      {
        planet: 'addresses',
        highlightEdges: ['contacts', 'relationships'],
        admin: {
          title: 'Address Management',
          body: 'NPSP supports multiple addresses per household with seasonal scheduling. A donor can have a winter address in Florida and a summer address in Maine, and NPSP automatically switches the default based on date ranges. Address changes push down to all household members.'
        },
        dev: {
          title: 'Address Sync and Scheduling',
          body: 'ADDR_Addresses_TDTM fires on Address__c and Contact changes. It implements bidirectional sync: changes to Contact mailing fields create/update Address__c records, and changes to Address__c push down to household member Contacts. ADDR_Seasonal_SCHED runs nightly to evaluate seasonal address date ranges and swap the default address. ADDR_Validator_BATCH handles optional USPS address verification.'
        }
      },
      {
        planet: 'engagement',
        highlightEdges: ['contacts'],
        admin: {
          title: 'Cultivation Through Engagement',
          body: 'Engagement Plans automate donor cultivation by creating a series of tasks, calls, and emails on a schedule. When a major donor makes their first gift, an Engagement Plan can automatically create follow-up tasks for the development team: thank-you call in 2 days, impact report in 30 days, annual ask in 11 months.'
        },
        dev: {
          title: 'Engagement Plan Task Engine',
          body: 'EP_EngagementPlans_TDTM fires when an Engagement_Plan__c is assigned to a Contact, Account, or Opportunity. It reads Engagement_Plan_Task__c child records and creates Task records with calculated ActivityDates based on the plan\'s offset days. The handler supports dependent task chains where Task B\'s due date is relative to Task A\'s completion. EP_Task_TDTM monitors task completion to trigger dependent task creation.'
        }
      }
    ]
  },
  {
    id: 'admin-framework',
    title: 'The Admin Framework',
    icon: '\u2699\uFE0F',
    desc: 'TDTM dispatch, settings management, error handling, and batch processing',
    stops: [
      {
        planet: 'tdtm',
        highlightEdges: ['settings', 'errors'],
        admin: {
          title: 'One Trigger to Rule Them All',
          body: 'NPSP uses a single Apex trigger per object, dispatching to handler classes via Table-Driven Trigger Management. Admins can enable, disable, or reorder handlers from NPSP Settings without touching code. This architecture makes NPSP predictable and customizable.'
        },
        dev: {
          title: 'TDTM Dispatch Internals',
          body: 'TDTM_TriggerHandler is the entry point for every trigger. It queries active Trigger_Handler__c records filtered by Object__c and Trigger_Action__c, ordered by Load_Order__c. Each handler is instantiated via Type.forName(Class__c) and called with run(). Handlers return DmlWrapper for batched DML. TDTM_Config manages static caches and provides getDefaultRecords() for org initialization.'
        }
      },
      {
        planet: 'settings',
        highlightEdges: ['tdtm', 'errors'],
        admin: {
          title: 'NPSP Settings Hub',
          body: 'The NPSP Settings page is the central control panel. From here, admins configure household naming, payment automation, batch job schedules, address verification, and every feature toggle. Settings are stored in Hierarchy Custom Settings, so they can be overridden per-profile or per-user.'
        },
        dev: {
          title: 'Settings Architecture',
          body: 'UTIL_CustomSettingsFacade provides static getter methods for all NPSP settings objects: npe01__Contacts_And_Orgs_Settings__c, npo02__Households_Settings__c, npe03__Recurring_Donations_Settings__c, npe4__Relationship_Settings__c, npe5__Affiliations_Settings__c, and more. STG_Panel classes implement the NPSP Settings Lightning components. STG_InstallScript runs on package install/upgrade to initialize default settings.'
        }
      },
      {
        planet: 'errors',
        highlightEdges: ['settings', 'tdtm'],
        admin: {
          title: 'Error Visibility',
          body: 'NPSP logs errors to the Error__c custom object and can send error notification emails to admins. When a trigger handler fails, the error is caught, logged with full context (which record, which handler, what operation), and surfaced in the NPSP Settings Error Log tab. No more silent failures.'
        },
        dev: {
          title: 'Error Handling Framework',
          body: 'ERR_Handler wraps all TDTM handler execution in try/catch blocks. On failure, ERR_ExceptionHandler.processException() creates Error__c records with Context_Type__c, Error_Type__c, Full_Message__c, and Stack_Trace__c. ERR_Notifier sends email digests based on Error_Notifications_On__c and Error_Notification_Recipients__c settings. The framework distinguishes between retryable and fatal errors.'
        }
      },
      {
        planet: 'batch',
        highlightEdges: ['tdtm', 'settings'],
        admin: {
          title: 'Scheduled Processing',
          body: 'NPSP runs nightly batch jobs for rollup calculations, recurring donation processing, level assignments, and address updates. Admins configure batch sizes and schedules from NPSP Settings. The batch framework ensures large data volumes are processed without hitting Salesforce governor limits.'
        },
        dev: {
          title: 'Batch Job Orchestration',
          body: 'UTIL_MasterSchedulableHelper manages the nightly batch chain. It implements Database.Batchable and Schedulable, executing batch classes in sequence: CRLP_Account_BATCH, CRLP_Contact_BATCH, RD2_OpportunityEvaluation_BATCH, LVL_LevelAssign_BATCH, and ADDR_Seasonal_SCHED. Each batch class respects configurable scope sizes from Custom Settings and chains to the next batch via Database.executeBatch() in the finish() method.'
        }
      }
    ]
  },
  {
    id: 'payment-processing',
    title: 'Payment Processing',
    icon: '\uD83D\uDCB3',
    desc: 'From gift entry forms through payment processing to final donation records',
    stops: [
      {
        planet: 'giftentry',
        highlightEdges: ['elevate', 'donations'],
        admin: {
          title: 'Capturing Donations',
          body: 'Gift Entry provides a form-based UI for entering donations. Staff can enter single gifts or batch-process multiple donations from a fundraising event. Templates control which fields appear on the form, and field mappings ensure data flows correctly from the entry form to Opportunities and Payments.'
        },
        dev: {
          title: 'Gift Entry Architecture',
          body: 'GE_GiftEntryController manages the Lightning component lifecycle. Gift Entry forms are defined by Gift_Entry_Template__c records with JSON field mappings stored in Template_JSON__c. On save, GE_FormService converts form data into DataImport__c records, which are processed by BDI_DataImport_BATCH. The GE_BatchRunController handles batch gift entry with server-side validation and Elevate payment integration.'
        }
      },
      {
        planet: 'elevate',
        highlightEdges: ['giftentry', 'recurring'],
        admin: {
          title: 'Secure Payment Processing',
          body: 'Salesforce Elevate handles PCI-compliant credit card and ACH processing. Donor payment information is tokenized (never stored in Salesforce), and Elevate manages the actual charge. Payment status updates flow back to Salesforce automatically, updating Payment records and Opportunity stages.'
        },
        dev: {
          title: 'Elevate Integration Services',
          body: 'PS_IntegrationService manages REST callouts to the Elevate Payments API using named credentials. ElevateTokenizedPaymentMapper handles the token exchange for PCI compliance. For recurring gifts, Elevate Commitment records map 1:1 to npe03__Recurring_Donation__c records via CommitmentId__c. GE_PaymentServices orchestrates the widget rendering and payment capture flow within Gift Entry.'
        }
      },
      {
        planet: 'recurring',
        highlightEdges: ['elevate', 'donations'],
        admin: {
          title: 'Scheduled Payments',
          body: 'When Elevate processes recurring gifts, each scheduled charge creates or updates an installment Opportunity in Salesforce. The Recurring Donation record tracks the commitment: amount, frequency, payment method, and status. Donors can update their payment method through Elevate-powered donor portals.'
        },
        dev: {
          title: 'RD-Elevate Payment Sync',
          body: 'RD2_ElevateIntegrationService syncs Recurring Donation changes with Elevate Commitments. On RD update, it calls the Elevate API to modify the payment schedule. RD2_StatusAutomationService monitors incoming payment results from Elevate webhooks and updates RD status (Active, Lapsed, Closed). The RD2_ElevateInformation class provides read-only state for Lightning components displaying Elevate payment details.'
        }
      },
      {
        planet: 'donations',
        highlightEdges: ['recurring', 'giftentry'],
        admin: {
          title: 'The Final Record',
          body: 'Every path leads here. Whether entered through Gift Entry, created by a Recurring Donation schedule, or charged through Elevate, the result is an Opportunity record with linked Payment records. The donation gets auto-named, rolls up to donor totals, and becomes part of the permanent giving record.'
        },
        dev: {
          title: 'Donation Record Finalization',
          body: 'The Opportunity fires the standard TDTM handler chain: OPP_OpportunityNaming_TDTM constructs the name, OPP_OpportunityContactRoles_TDTM creates the OCR, PMT_Payment_TDTM creates the Payment record, and ALLO_Allocations_TDTM applies default GAU Allocations. Each handler returns a DmlWrapper, and TDTM_TriggerHandler batches all pending DML into a single operation at the end of the chain.'
        }
      }
    ]
  },
  {
    id: 'supporter-journey',
    title: 'The Supporter Journey',
    icon: '\uD83E\uDD1D',
    desc: 'How contacts, households, and relationships form the people model that confuses every new admin',
    stops: [
      {
        planet: 'contacts',
        highlightEdges: ['addresses', 'relationships'],
        admin: {
          title: 'A New Supporter Arrives',
          body: 'When you create a new Contact, NPSP automatically creates a Household Account for them. This is the #1 confusion point for new admins: Contacts live inside Household Accounts, not the other way around. The Household model groups family members together for shared addresses, combined giving totals, and joint acknowledgment letters.'
        },
        dev: {
          title: 'Account Model Initialization',
          body: 'ACCT_IndividualAccounts_TDTM fires on Contact insert. It checks npe01__Contacts_And_Orgs_Settings__c.npe01__Account_Processor__c to determine the model (Household, One-to-One, or Individual Bucket). For Household model, it creates an Account with RecordType "Household Account" and triggers HH_HouseholdNaming to build the name using Household_Naming_Settings__c token templates.'
        }
      },
      {
        planet: 'addresses',
        highlightEdges: ['contacts'],
        admin: {
          title: 'Where They Live',
          body: 'NPSP manages addresses at the household level, not the contact level. When you update a Household Account address, it pushes down to all members. Supporters can have seasonal addresses (winter in Florida, summer in Maine) that switch automatically on schedule. This keeps your mailings accurate year-round.'
        },
        dev: {
          title: 'Address Sync Architecture',
          body: 'ADDR_Addresses_TDTM implements bidirectional sync between Address__c and Contact mailing fields. On Address__c insert/update, it pushes to all Contacts in the parent Household. On Contact mailing field change, it creates or updates the corresponding Address__c record. ADDR_Seasonal_SCHED runs nightly to evaluate Start_Date__c and End_Date__c on seasonal addresses and swap the household default.'
        }
      },
      {
        planet: 'relationships',
        highlightEdges: ['contacts', 'affiliations'],
        admin: {
          title: 'Personal Connections',
          body: 'Relationships link one Contact to another: spouse, parent, mentor, referrer. When you create a relationship, NPSP automatically creates the reciprocal. Mark Alice as Bob\'s spouse and Bob becomes Alice\'s spouse. These connections power soft credit automation and help fundraisers understand donor networks.'
        },
        dev: {
          title: 'Reciprocal Relationship Engine',
          body: 'REL_Relationships_TDTM fires on npe4__Relationship__c DML. It reads npe4__Relationship_Settings__c.npe4__Reciprocal_Method__c (List Setting by default) to look up reciprocal types from Relationship_Lookup__c custom metadata. Gender-neutral reciprocals use the "Neutral" field. A static Set<Id> prevents infinite recursion between paired relationship records.'
        }
      },
      {
        planet: 'affiliations',
        highlightEdges: ['contacts', 'relationships'],
        admin: {
          title: 'Organization Ties',
          body: 'Affiliations connect a supporter to organizations: their employer, a board they serve on, a volunteer group. Unlike Relationships (person-to-person), Affiliations are person-to-organization. A Contact can have multiple affiliations with roles and start/end dates, giving your team a full picture of institutional connections.'
        },
        dev: {
          title: 'Affiliation Processing',
          body: 'AFFL_Affiliations_TDTM fires on Contact and npe5__Affiliation__c changes. It manages the bidirectional sync between Contact.Primary_Affiliation__c and the npe5__Primary__c flag on the Affiliation record. AFFL_MultiRecordType_TDTM auto-creates Affiliation records when a Contact is linked to an Organization Account, using Account Record Type to Affiliation mapping rules.'
        }
      },
      {
        planet: 'softcredits',
        highlightEdges: ['contacts', 'donations'],
        admin: {
          title: 'Who Gets Credit',
          body: 'Soft Credits recognize everyone who influenced a gift without double-counting the amount. A spouse gets household member credit, a board member gets solicitor credit, and the original donor keeps the hard credit. NPSP rolls up soft credit totals separately, so you always know both "who gave" and "who helped."'
        },
        dev: {
          title: 'Soft Credit Architecture',
          body: 'Soft credits are driven by OpportunityContactRole records. PSC_PartialSoftCredit_TDTM manages Partial_Soft_Credit__c for amount-specific attribution (when a solicitor deserves credit for a portion). The CRLP engine calculates npo02__Soft_Credit_Total__c and related rollup fields using Filter_Group__mdt rules that include OCR Role values like "Soft Credit" and "Household Member."'
        }
      },
      {
        planet: 'donations',
        highlightEdges: ['contacts', 'softcredits'],
        admin: {
          title: 'The First Gift',
          body: 'When a supporter makes their first donation, everything comes together. NPSP auto-names the Opportunity using the Contact and Household info, creates Contact Roles linking the gift to the donor, and triggers rollup calculations. The supporter\'s record now shows Total Gifts, Largest Gift, First Gift Date, and more.'
        },
        dev: {
          title: 'Donation-to-Contact Binding',
          body: 'On Opportunity insert, OPP_OpportunityContactRoles_TDTM creates the Primary OCR using the Contact lookup. OPP_OpportunityNaming_TDTM queries the Contact and Account to build the Opportunity Name from naming settings. CRLP_RollupProcessor.runRollupsForIds() recalculates Contact and Account rollup fields incrementally, updating npo02__TotalOppAmount__c, npo02__LargestAmount__c, and other summary fields.'
        }
      },
      {
        planet: 'recurring',
        highlightEdges: ['donations', 'contacts'],
        admin: {
          title: 'Becoming a Sustainer',
          body: 'The journey\'s milestone: a one-time donor converts to recurring giving. Enhanced Recurring Donations (RD2) track the schedule, automatically creating installment Opportunities each period. The supporter\'s profile now shows both historical giving and future committed revenue, giving fundraisers a complete picture.'
        },
        dev: {
          title: 'RD2 Commitment Creation',
          body: 'On npe03__Recurring_Donation__c insert, RD2_ScheduleService builds projected installments from Installment_Period__c and Day_of_Month__c. RD2_OpportunityService creates the first installment Opportunity with npe03__Recurring_Donation__c lookup. RD2_OpportunityEvaluation_BATCH runs nightly to create future installments within the configured look-ahead window from npe03__Recurring_Donations_Settings__c.'
        }
      }
    ]
  },
  {
    id: 'behind-the-scenes',
    title: 'Behind the Scenes',
    icon: '\u2699\uFE0F',
    desc: 'The invisible infrastructure that keeps your NPSP org healthy: triggers, errors, batch jobs, and settings',
    stops: [
      {
        planet: 'tdtm',
        highlightEdges: ['settings', 'errors'],
        admin: {
          title: 'The Traffic Controller',
          body: 'NPSP uses one trigger per object, dispatching to handler classes listed in Trigger Handler records. This is your first stop when troubleshooting: go to NPSP Settings and check which handlers are active. Need to temporarily disable automation? Uncheck the Active flag on the handler record instead of modifying code.'
        },
        dev: {
          title: 'TDTM Dispatch Pattern',
          body: 'TDTM_TriggerHandler queries Trigger_Handler__c records filtered by Object__c and Trigger_Action__c (BeforeInsert, AfterUpdate, etc.), ordered by Load_Order__c. Each handler class is instantiated via Type.forName(Class__c) and receives the trigger context. Handlers extend TDTM_Runnable, return DmlWrapper for batched DML, and respect the Active__c and Usernames_to_Exclude__c fields for selective execution.'
        }
      },
      {
        planet: 'errors',
        highlightEdges: ['tdtm', 'settings'],
        admin: {
          title: 'When Things Go Wrong',
          body: 'When a trigger handler fails, NPSP catches the error and logs it to the Error Log (visible in NPSP Settings). Each error record shows which object, which operation, and the full error message. Enable error notification emails so you hear about failures immediately instead of discovering them days later during reconciliation.'
        },
        dev: {
          title: 'Error Capture Pipeline',
          body: 'ERR_Handler wraps every TDTM handler invocation in try/catch. On failure, ERR_ExceptionHandler.processException() creates Error__c records with Context_Type__c (the handler class), Error_Type__c, Full_Message__c, and Stack_Trace__c. ERR_Notifier evaluates Error_Notifications_On__c and Error_Notification_Recipients__c from npe01__Contacts_And_Orgs_Settings__c to send email digests. The framework distinguishes DML exceptions from general Apex exceptions for targeted recovery guidance.'
        }
      },
      {
        planet: 'batch',
        highlightEdges: ['tdtm', 'rollups'],
        admin: {
          title: 'The Overnight Crew',
          body: 'Every night, NPSP runs a chain of batch jobs: recalculate rollups, evaluate recurring donations, assign donor levels, and update seasonal addresses. When rollup totals look wrong, check the batch job status first. Most "data is out of sync" issues resolve after a successful nightly run. You can also trigger rollup recalculation manually from NPSP Settings.'
        },
        dev: {
          title: 'Batch Chain Orchestration',
          body: 'UTIL_MasterSchedulableHelper implements Schedulable and kicks off the nightly chain. Each batch class (CRLP_Account_BATCH, CRLP_Contact_BATCH, RD2_OpportunityEvaluation_BATCH, LVL_LevelAssign_BATCH, ADDR_Seasonal_SCHED) chains to the next via Database.executeBatch() in its finish() method. Scope sizes are configurable per batch class in Custom Settings to balance throughput against governor limits.'
        }
      },
      {
        planet: 'rollups',
        highlightEdges: ['batch', 'settings'],
        admin: {
          title: 'The Calculation Engine',
          body: 'Customizable Rollups (CRLP) replaced the legacy rollup helpers. Defined in Custom Metadata, rollups survive sandbox refreshes and can be deployed via change sets. When a rollup looks wrong, check three things: the Filter Group rules, the batch job status, and whether the rollup is set to incremental or full recalculation mode.'
        },
        dev: {
          title: 'CRLP Metadata Architecture',
          body: 'Rollup definitions live in Rollup__mdt, each specifying Summary_Object__c, Summary_Field__c, Detail_Object__c, Detail_Field__c, and Operation (SUM, COUNT, AVERAGE, BEST_YEAR, YEARS_DONATED, FIRST, LAST). Filter_Group__mdt and Filter_Rule__mdt control which records are included. CRLP_RollupProcessor supports two modes: incremental (trigger-based, processes only changed records) and full (batch-based, reprocesses all records). CRLP_ApiService exposes configuration to Lightning components.'
        }
      },
      {
        planet: 'settings',
        highlightEdges: ['tdtm', 'batch'],
        admin: {
          title: 'The Control Panel',
          body: 'NPSP Settings is where 14+ Custom Settings objects converge into a single admin UI. Household naming formats, payment automation rules, batch schedules, and feature toggles all live here. Settings use Salesforce Hierarchy Custom Settings, meaning you can override values per-profile or per-user for testing without affecting the whole org.'
        },
        dev: {
          title: 'Settings Facade Pattern',
          body: 'UTIL_CustomSettingsFacade provides static getter methods for every settings object: getContactsSettings(), getHouseholdsSettings(), getRecurringDonationsSettings(), and more. Each getter lazy-loads from the hierarchy and caches for the transaction. STG_InstallScript runs on package install/upgrade to create default Trigger_Handler__c records and initialize all Custom Settings. STG_Panel Lightning components read/write settings via STG_PanelController.'
        }
      },
      {
        planet: 'allocations',
        highlightEdges: ['donations', 'settings'],
        admin: {
          title: 'Fund Accounting',
          body: 'GAU Allocations split donations across funds (General Accounting Units). You can set a default allocation so every gift is automatically tagged, or let staff allocate manually. NPSP validates that allocation percentages total 100% and recalculates rollups per GAU so finance teams always know how much each fund received.'
        },
        dev: {
          title: 'Allocation Trigger Logic',
          body: 'ALLO_Allocations_TDTM fires on Opportunity and Allocation__c DML. On Opportunity insert, it creates default Allocation__c records from Allocations_Settings__c if configured. ALLO_AllocationsUtil enforces percentage/amount validation: if percentages are used, they must sum to 100. The handler cascades changes to Payment Allocations and triggers CRLP recalculation on the related General_Accounting_Unit__c records.'
        }
      },
      {
        planet: 'levels',
        highlightEdges: ['rollups', 'batch'],
        admin: {
          title: 'Automatic Donor Tiers',
          body: 'Levels auto-assign donor tiers (Bronze, Silver, Gold, Platinum) based on any numeric rollup field. Define your thresholds in Level records, and the nightly batch job evaluates every Contact and Account against them. Donor segments stay current without manual work, powering stewardship workflows and segmented communications.'
        },
        dev: {
          title: 'Level Assignment Batch',
          body: 'LVL_LevelAssign_BATCH runs nightly as part of the UTIL_MasterSchedulableHelper chain. It queries all Level__c records and groups them by Target__c (Contact or Account). For each target record, it reads the Source_Field__c value (typically a CRLP rollup field like npo02__TotalOppAmount__c) and compares against Minimum_Amount__c and Maximum_Amount__c. The highest matching Level is written to the target\'s Level__c lookup field.'
        }
      }
    ]
  }
];
