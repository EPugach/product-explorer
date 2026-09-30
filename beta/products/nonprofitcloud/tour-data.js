export const TOURS = [
  {
    id: 'follow-a-donation',
    title: 'Follow a Donation',
    icon: '\u{1F4B0}',
    desc: 'Trace a gift from initial receipt through processing, designation, and acknowledgment.',
    stops: [
      {
        planet: 'campaigns',
        highlightEdges: ['gift_entry', 'fundraising'],
        admin: {
          title: 'Campaign Launches Outreach',
          body: 'A fundraising campaign is created with a budget, target audience, and timeline. Outreach Source Codes are configured for each channel: email, direct mail, and social media. Each source code combination tracks which message and audience segment produced the best results. Campaign default designations are set so that gifts automatically allocate to the right fund.'
        },
        dev: {
          title: 'Campaign and Source Code Architecture',
          body: 'The Campaign object provides the attribution anchor. OutreachSourceCode child records decompose campaigns into channel, message, and audience dimensions. When gifts arrive, the OutreachSourceCode lookup on GiftTransaction and GiftCommitment enables multi-level attribution reporting. Data Processing Engine aggregates campaign metrics from linked transaction records.'
        }
      },
      {
        planet: 'gift_entry',
        highlightEdges: ['gift_transactions', 'gift_commitments'],
        admin: {
          title: 'Gift Arrives and Is Entered',
          body: 'A donor responds to the campaign with a check in the mail. The gift processor opens the Gift Entry Grid, looks up the donor, enters the amount and payment method, and sets the outreach source code from the reply envelope. If the donor has an existing commitment, the entry matches to the next unpaid transaction. For new recurring gifts, a commitment and schedule are created on the spot.'
        },
        dev: {
          title: 'Gift Entry Processing Pipeline',
          body: 'GiftEntry records are created through the Gift Entry Grid or Gift Entry Window. The grid supports up to 200 rows per batch with configurable GiftBatchTemplate columns. On processing, the system creates GiftTransaction records, links them to GiftCommitment if matched, and applies gift transaction designations using the inheritance hierarchy. The GiftBatch object tracks processing status and error results per entry.'
        }
      },
      {
        planet: 'gift_transactions',
        highlightEdges: ['designations', 'soft_credits'],
        admin: {
          title: 'Transaction Is Processed',
          body: 'The gift transaction record captures the full payment details: amount, received date, payment method (check), and the campaign attribution. The transaction status moves from Pending to Paid. If the donor specified a purpose, the amount is split across designated funds. Otherwise, it goes to the org-wide default designation.'
        },
        dev: {
          title: 'Transaction Object and Status Lifecycle',
          body: 'GiftTransaction has a controlled status lifecycle: Unpaid, Pending, Paid, Failed, Canceled, Written Off, and Fully Refunded. The Gift Vehicle picklist distinguishes cash, check, credit card, stock, wire, and in-kind gifts. GiftTransactionDesignation junction records allocate amounts to GiftDesignation records with percentage splits. PaymentInstrument records store card/ACH details for recurring transactions.'
        }
      },
      {
        planet: 'designations',
        highlightEdges: ['gift_transactions', 'outcomes'],
        admin: {
          title: 'Funds Are Allocated',
          body: 'The donation amount flows to the appropriate gift designation, in this case the Scholarship Fund. The designation record shows updated rollup totals reflecting the new gift. Fund managers can see in real time how close they are to their fundraising target. If the donor did not specify a purpose, the org-wide default designation captures the unrestricted amount.'
        },
        dev: {
          title: 'Designation Hierarchy and Rollups',
          body: 'GiftTransactionDesignation is the source of truth for rollup calculations on GiftDesignation records. The inheritance hierarchy checks designations at five levels: transaction-specific, campaign, commitment, opportunity, then org-wide default. Data Processing Engine calculates rollup fields on designation records. GiftDefaultDesignation records store the inheritance configuration at each level.'
        }
      },
      {
        planet: 'constituents',
        highlightEdges: ['soft_credits', 'households'],
        admin: {
          title: 'Donor Record Updated',
          body: 'The donor\'s Person Account record now reflects the new gift in their giving history. Soft credits are applied to household members and the board member who influenced the donation. The acknowledgment workflow triggers a thank-you letter. The donor\'s Contact Profile updates their recurring donor classification based on their giving pattern.'
        },
        dev: {
          title: 'Constituent 360 and Attribution',
          body: 'The Account record accumulates gift history through related GiftTransaction records. GiftSoftCredit records link the transaction to influenced parties (household members, influencers, tribute honorees) via Account lookups. ContactProfile tracks RecurringDonorType which is automatically updated by Fundraising flows when commitment patterns change. The Timeline component renders a chronological activity view across all related objects.'
        }
      }
    ]
  },
  {
    id: 'building-a-household',
    title: 'Building a Household',
    icon: '\u{1F3E0}',
    desc: 'See how Nonprofit Cloud models households, relationships, and contact information.',
    stops: [
      {
        planet: 'constituents',
        highlightEdges: ['households', 'contact_points'],
        admin: {
          title: 'Creating Individual Records',
          body: 'Two new donors are entering your database: a married couple who made a joint donation. Each person gets a Person Account record that combines their individual details with their contact history. Person Accounts are the foundation of every constituent record in Nonprofit Cloud, replacing the Contact-only model from NPSP.'
        },
        dev: {
          title: 'Person Account Data Model',
          body: 'Person Accounts merge Account and Contact into a single record by enabling the Person Account feature at the org level. The isPersonAccount flag distinguishes individuals from organizations. Each Person Account has a linked Contact record that shares the same RecordId prefix. The ContactProfile child object extends the record with fundraising-specific fields like RecurringDonorType.'
        }
      },
      {
        planet: 'households',
        highlightEdges: ['constituents', 'relationships'],
        admin: {
          title: 'Creating the Household Group',
          body: 'A Party Relationship Group is created with Type set to Household. Both individuals are added as members through Account Contact Relationships, with one designated as Head of Household and the other as Spouse. The household group enables combined giving reports and shared mailing preferences. Membership dates track when people join or leave the household.'
        },
        dev: {
          title: 'Party Relationship Group Architecture',
          body: 'PartyRelationshipGroup is a Business Account with a GroupType picklist. Members are linked via AccountContactRelationship junction records that specify Role, IsActive, StartDate, and EndDate. Unlike NPSP\'s rigid Household Account model, this approach supports overlapping group memberships and time-bound participation. The group account can have its own ContactPointAddress records for household-level mailings.'
        }
      },
      {
        planet: 'relationships',
        highlightEdges: ['households', 'constituents'],
        admin: {
          title: 'Recording Personal Relationships',
          body: 'A Contact Contact Relationship is created between the two individuals with the reciprocal roles Spouse/Spouse. Additional relationships can be added for children, parents, or other family members. The relationship type configuration in Party Role Relationships ensures consistent role labels across your organization. These relationship records surface on each person\'s record page.'
        },
        dev: {
          title: 'Relationship Object Model',
          body: 'ContactContactRelationship links two Contact records with RelatedContactId and ContactId lookups, plus a Role picklist. PartyRoleRelationship metadata defines available roles with forward and reciprocal labels. AccountAccountRelationship handles org-to-org connections with similar structure. All relationship objects support IsActive flags and effective dating for historical tracking.'
        }
      },
      {
        planet: 'contact_points',
        highlightEdges: ['constituents', 'households'],
        admin: {
          title: 'Managing Contact Information',
          body: 'Each family member gets their own Contact Point records for addresses, emails, and phones. The shared home address is entered once and linked to each person. Work emails and cell phones are individual. The IsPrimary flag on each contact point type designates the preferred method for that person. Multiple addresses enable seasonal mailing to vacation homes.'
        },
        dev: {
          title: 'Polymorphic Contact Point Objects',
          body: 'ContactPointAddress, ContactPointEmail, and ContactPointPhone are polymorphic objects linked to Accounts via ParentId. Each supports AddressType/PhoneType/EmailType picklists, IsPrimary flag, and ActiveFromDate/ActiveToDate. These are standard Salesforce Industries objects, not Nonprofit Cloud-specific, which means they work across clouds and comply with GDPR data residency requirements without custom metering.'
        }
      }
    ]
  },
  {
    id: 'recurring-giving-lifecycle',
    title: 'Recurring Giving Lifecycle',
    icon: '\u{1F504}',
    desc: 'Follow a recurring gift from initial commitment through schedule changes and ongoing processing.',
    stops: [
      {
        planet: 'fundraising',
        highlightEdges: ['gift_commitments', 'constituents'],
        admin: {
          title: 'Donor Pledges a Recurring Gift',
          body: 'A major gift officer has cultivated a donor who agrees to give $200 monthly for a year. The officer closes the Opportunity as Won, which signals the need for a formal gift commitment. The opportunity record captures the total expected amount and the campaign that sourced the relationship.'
        },
        dev: {
          title: 'Opportunity to Commitment Pipeline',
          body: 'The Opportunity object uses configurable Sales Processes to define stage sequences for different fundraising types. When an Opportunity is closed-won, the fundraiser creates a linked GiftCommitment record. The commitment\'s OpportunityId lookup maintains the pipeline attribution chain. OpportunityContactRole records track who was involved in securing the commitment.'
        }
      },
      {
        planet: 'gift_commitments',
        highlightEdges: ['gift_transactions', 'designations'],
        admin: {
          title: 'Schedule Is Created',
          body: 'A Gift Commitment record is created with a Gift Commitment Schedule defining monthly installments of $200 starting the 15th of next month. The system automatically generates gift transaction records for each upcoming installment. Default designations from the campaign are inherited by the commitment.'
        },
        dev: {
          title: 'Commitment and Schedule Processing',
          body: 'GiftCommitment has a Status lifecycle: Draft, Active, Paused, Lapsed, Failing, Closed. GiftCommitmentSchedule defines EffectivePeriod, EffectiveInterval, TransactionDay, and effective date range. Fundraising flows automatically set NextTransactionDate and NextTransactionAmount fields, and optionally create the first GiftTransaction if the Create Recurring Schedule Transaction setting is enabled.'
        }
      },
      {
        planet: 'gift_transactions',
        highlightEdges: ['gift_commitments', 'gift_entry'],
        admin: {
          title: 'Monthly Payments Are Tracked',
          body: 'Each month, a gift transaction is generated for the upcoming installment. When the donor\'s payment arrives, the gift processor matches it through Gift Entry. The transaction status updates from Unpaid to Paid. If payments are missed, the system tracks consecutive unpaid transactions and updates the commitment status based on configured thresholds.'
        },
        dev: {
          title: 'Transaction Status Automation',
          body: 'GiftTransaction status progresses through Unpaid, Pending, Paid, Failed, Canceled, or Written Off. Processing flows evaluate LapsedUnpaidTransactionCount and FailingTransactionCount settings to automatically update GiftCommitment status. GiftCommitmentChangeAttributionLog records track every modification to the commitment for audit and attribution purposes.'
        }
      },
      {
        planet: 'gift_commitments',
        highlightEdges: ['campaigns', 'gift_transactions'],
        admin: {
          title: 'Donor Upgrades Their Gift',
          body: 'Six months in, the donor responds to an upgrade campaign and increases their monthly gift to $300. The fundraiser uses the Upgrade/Downgrade action, creates a new schedule with the higher amount, and attributes the change to the upgrade campaign. The Change Attribution Log captures the per-day amount increase.'
        },
        dev: {
          title: 'Schedule Splitting and Attribution',
          body: 'Upgrades create a new GiftCommitmentSchedule with updated amount and effective dates while the original schedule gets an adjusted end date. GiftCommitmentChangeAttributionLog records the ChangePerDayAmount and links to the Campaign and OutreachSourceCode that influenced the upgrade. GiftDefaultDesignations automatically attributes to multiple campaigns by influence ratio.'
        }
      },
      {
        planet: 'designations',
        highlightEdges: ['gift_transactions', 'campaigns'],
        admin: {
          title: 'Impact Over Time',
          body: 'After a year, the designation records show cumulative impact from both the original and upgraded schedules. Campaign attribution shows which outreach effort drove the initial gift and which drove the upgrade. Designation rollup totals update in real time as each transaction is processed, giving fund managers continuous visibility.'
        },
        dev: {
          title: 'Rollup Calculation Pipeline',
          body: 'GiftTransactionDesignation records are the source of truth for designation rollups. Data Processing Engine aggregates amounts, transaction counts, and averages on GiftDesignation records. Campaign-level rollups combine direct GiftTransaction attribution with indirect commitment-level attributions via GiftCommitmentChangeAttributionLog for complete ROI calculation.'
        }
      }
    ]
  },
  {
    id: 'program-to-outcomes',
    title: 'Program to Outcomes',
    icon: '\u{1F4DA}',
    desc: 'Follow a social service program from setup through delivery and impact measurement.',
    stops: [
      {
        planet: 'programs',
        highlightEdges: ['outcomes', 'case_management'],
        admin: {
          title: 'Setting Up a Program',
          body: 'Your organization launches a Job Readiness program for young adults. The program manager creates the Program record, defines Benefits (resume workshops, interview coaching, computer skills training), and sets up Benefit Schedules for recurring sessions. Goal Definitions establish a hierarchy from Secure Employment down to intermediate skills goals.'
        },
        dev: {
          title: 'Program Data Model',
          body: 'The Program object is the top container. Benefit child records link to BenefitType and UnitOfMeasure for service categorization. BenefitSchedule defines recurring session patterns. GoalDefinition supports hierarchical goal structures with Type values: Top Goal, Intermediate Goal, Activity. Each Goal links to Benefits that contribute to achieving it.'
        }
      },
      {
        planet: 'case_management',
        highlightEdges: ['programs', 'constituents'],
        admin: {
          title: 'Intake and Care Planning',
          body: 'A young adult is referred through Case Referral Intake. A case manager administers an initial assessment using the Discovery Framework. Based on results, a personalized Care Plan is created from the Ready for Job Hunting template, assigning the participant to specific benefits and setting individualized goals.'
        },
        dev: {
          title: 'Case and Care Plan Architecture',
          body: 'CaseReferral converts to a Case record via guided intake flows. AssessmentTask stores Discovery Framework results. CarePlan is created from CarePlanTemplate with CarePlanTemplateBenefit and CarePlanTemplateGoal children. Template instantiation creates BenefitAssignment records. InteractionSummary captures ongoing case notes with confidentiality controls.'
        }
      },
      {
        planet: 'programs',
        highlightEdges: ['volunteers', 'constituents'],
        admin: {
          title: 'Service Delivery',
          body: 'The participant attends weekly sessions tracked through Benefit Sessions. Volunteer tutors deliver training. Attendance is recorded on each session, updating disbursement records. Program Cohorts group participants for comparative reporting. Ad hoc disbursements handle walk-in participants at community events.'
        },
        dev: {
          title: 'Disbursement Tracking',
          body: 'BenefitSession records under BenefitSchedule track each delivery instance. Attendance updates flow to BenefitDisbursement records: status changes from Enrolled to Completed/Excused/Absent with DisbursedQuantity adjusted. ProgramEnrollment tracks participant status. ProgramCohort and ProgramCohortMember enable cohort-based analysis.'
        }
      },
      {
        planet: 'outcomes',
        highlightEdges: ['programs', 'grantmaking'],
        admin: {
          title: 'Measuring Impact',
          body: 'Outcome Definitions describe intended results: Employment Rate and Skill Improvement Score. As participants complete the program and find employment, Indicator Results are recorded. Impact reports show 78% of participants secured employment, demonstrating program effectiveness to the board and funders.'
        },
        dev: {
          title: 'Outcome Measurement Framework',
          body: 'OutcomeDefinition records form a hierarchy matching the theory of change. Indicator child records specify measurement methodology, frequency, and targets. IndicatorResult records capture actual data points with timestamps. Einstein Program Benefits Summary produces AI-generated narrative summaries for stakeholder reporting.'
        }
      },
      {
        planet: 'grantmaking',
        highlightEdges: ['outcomes', 'programs'],
        admin: {
          title: 'Grant Reporting',
          body: 'The organization reports back to the funding foundation. Impact data demonstrates that grant funds were used effectively. Designation-level reporting shows how grant money was allocated. The grantee portal provides a streamlined interface for progress reports with outcome data.'
        },
        dev: {
          title: 'Grant Lifecycle Closure',
          body: 'FundingAward records track disbursement schedules and actual payments. Budget line items categorize spending against the approved grant budget. The Experience Cloud portal renders GrantApplication and FundingAward data. Outcome Management integration links indicators to grant reporting requirements for automated evidence collection.'
        }
      }
    ]
  },
  {
    id: 'volunteer-journey',
    title: 'The Volunteer Journey',
    icon: '\u{1F91D}',
    desc: 'Follow a volunteer from recruitment through matching, assignment, and hour tracking.',
    stops: [
      {
        planet: 'volunteers',
        highlightEdges: ['programs', 'constituents'],
        admin: {
          title: 'Creating a Volunteer Initiative',
          body: 'Your organization is planning a community cleanup event. The coordinator creates a Volunteer Initiative with dates, headcount goals, and hour targets. Positions define generic roles (Group Leader, Site Coordinator) and Job Positions customize those roles for this event with location, shifts, and qualifications.'
        },
        dev: {
          title: 'Initiative Hierarchy',
          body: 'VolunteerInitiative supports parent-child relationships (up to 1,000 children per parent). Position records define reusable generic roles. JobPosition links a Position to a specific VolunteerInitiative with Location, OperatingHours, and approval requirements. JobPositionShift defines work periods with start/end times and RecurrenceSchedule.'
        }
      },
      {
        planet: 'constituents',
        highlightEdges: ['volunteers'],
        admin: {
          title: 'Volunteer Profiles',
          body: 'Volunteers are Person Accounts with rich profiles including competencies (first aid, bilingual), examination results (CPR certification, background check), and location availability. This profile data enables intelligent matching to the right positions and shifts.'
        },
        dev: {
          title: 'Volunteer Profile Objects',
          body: 'PersonCompetency links Contact to Competency with proficiency level and dates. PersonExamination links Contact to Examination with score and effective range. PersonLocationAvailability links Account to Location with OperatingHours. All three are queried by the matching engine to find qualified candidates.'
        }
      },
      {
        planet: 'volunteers',
        highlightEdges: ['agentforce', 'action_plans'],
        admin: {
          title: 'Smart Matching and Assignment',
          body: 'The matching tool finds volunteers whose competencies, availability, and location match open shifts. The coordinator reviews candidates and assigns them. Action Plans automate onboarding: send welcome email, complete waiver, attend orientation. The AI volunteer agent assists in the portal.'
        },
        dev: {
          title: 'Matching and Assignment',
          body: 'The matching engine evaluates JobPositionShift requirements against volunteer profile records. Matches are scored by qualification overlap, schedule compatibility, and location proximity. JobPositionAssignment records link volunteers to shifts with Status tracking. Stage Management tracks progress through configurable stages.'
        }
      },
      {
        planet: 'volunteers',
        highlightEdges: ['programs', 'outcomes'],
        admin: {
          title: 'Hour Tracking and Reporting',
          body: 'On event day, shift assignments move to In Progress and then Completed. Hours are calculated from shift times. Reports aggregate volunteer hours by initiative, position, and individual for donor communications and grant reporting.'
        },
        dev: {
          title: 'Shift Metrics and Portal',
          body: 'JobPositionAssignment status progresses through the lifecycle. VolunteerInitiative aggregate fields track TotalVolunteerHours and FulfilledPositionCount. Initiatives with Published flag appear on Experience Cloud portals where guest users can browse and sign up via the Guest Access permission set.'
        }
      }
    ]
  }
];
