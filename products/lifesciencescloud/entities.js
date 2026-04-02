export default {
  "account_mgmt": {
    "objects": [
      {
        "name": "Account",
        "type": "standard",
        "domain": "account_mgmt",
        "description": "Represents healthcare professionals (HCPs) and healthcare organizations (HCOs) as person accounts and business accounts respectively. Supports record types for different provider categories and is the central object linking territories, visits, consents, and engagement data.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Account name for the HCP or HCO"
          },
          {
            "name": "RecordTypeId",
            "type": "Lookup",
            "description": "Identifies the account as HCP, HCO, or other provider type"
          },
          {
            "name": "OwnerId",
            "type": "Lookup",
            "description": "User who owns the account record"
          },
          {
            "name": "PersonEmail",
            "type": "Email",
            "description": "Primary email address for person account HCPs"
          },
          {
            "name": "Phone",
            "type": "Phone",
            "description": "Primary phone number for the account"
          },
          {
            "name": "BillingAddress",
            "type": "Text",
            "description": "Billing address fields for the account"
          }
        ],
        "relationships": [
          {
            "target": "ProviderAcctTerritoryInfo",
            "type": "parent",
            "description": "Territory-specific account information and visit tracking"
          },
          {
            "target": "ContactPointAddress",
            "type": "parent",
            "description": "Multiple addresses for different purposes like billing and shipping"
          },
          {
            "target": "ProviderAffiliation",
            "type": "parent",
            "description": "Affiliations between HCPs and HCOs"
          },
          {
            "target": "Visit",
            "type": "parent",
            "description": "Visits scheduled against this account"
          }
        ]
      },
      {
        "name": "ProviderAcctTerritoryInfo",
        "type": "custom",
        "domain": "account_mgmt",
        "description": "Stores territory-specific account information including preferred address, year-to-date visits, next visit, and last visit values. Created automatically by territory alignment batch jobs and used as the primary junction between accounts and territories.",
        "fields": [
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "Reference to the provider account"
          },
          {
            "name": "TerritoryId",
            "type": "Lookup",
            "description": "Reference to the assigned territory"
          },
          {
            "name": "PreferredAddress",
            "type": "Lookup",
            "description": "Territory-specific preferred contact point address"
          },
          {
            "name": "YearToDateVisits",
            "type": "Number",
            "description": "Count of visits made to this account in the current year"
          },
          {
            "name": "NextProviderVisit",
            "type": "DateTime",
            "description": "Date of the next scheduled visit"
          },
          {
            "name": "LastProviderVisit",
            "type": "DateTime",
            "description": "Date of the most recent completed visit"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether the territory-account alignment is active"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "The provider account this territory info belongs to"
          },
          {
            "target": "Territory2",
            "type": "lookup",
            "description": "The territory this account is aligned to"
          },
          {
            "target": "ContactPointAddress",
            "type": "lookup",
            "description": "Preferred address for territory-specific interactions"
          }
        ]
      },
      {
        "name": "ContactPointAddress",
        "type": "standard",
        "domain": "account_mgmt",
        "description": "Manages multiple addresses for HCP and HCO accounts with primary and preferred designations. Supports geolocation data via Google Maps API data integration rules for distance calculations. Used for sample delivery, visit planning, and account search.",
        "fields": [
          {
            "name": "ParentId",
            "type": "Lookup",
            "description": "Reference to the owning account record"
          },
          {
            "name": "IsPrimary",
            "type": "Checkbox",
            "description": "Whether this is the primary address for the account"
          },
          {
            "name": "Street",
            "type": "Text",
            "description": "Street address line"
          },
          {
            "name": "City",
            "type": "Text",
            "description": "City name"
          },
          {
            "name": "PostalCode",
            "type": "Text",
            "description": "Zip or postal code used for territory alignment"
          },
          {
            "name": "Latitude",
            "type": "Number",
            "description": "Geolocation latitude from Google Maps data integration"
          },
          {
            "name": "Longitude",
            "type": "Number",
            "description": "Geolocation longitude from Google Maps data integration"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "The account this address belongs to"
          },
          {
            "target": "ProviderAcctTerritoryInfo",
            "type": "child",
            "description": "Territory info records referencing this as preferred address"
          }
        ]
      },
      {
        "name": "ProviderAffiliation",
        "type": "custom",
        "domain": "account_mgmt",
        "description": "Captures relationships between HCPs and HCOs including role, specialty, and effective date ranges. Affiliation alignment rules automatically associate accounts to territories based on rule criteria for account type, role, and specialty.",
        "fields": [
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The HCP account in the affiliation"
          },
          {
            "name": "HealthcareOrganizationId",
            "type": "Lookup",
            "description": "The HCO account in the affiliation"
          },
          {
            "name": "Role",
            "type": "Text",
            "description": "Role of the HCP at the HCO"
          },
          {
            "name": "EffectiveStartDate",
            "type": "Date",
            "description": "Start date of the affiliation"
          },
          {
            "name": "EffectiveEndDate",
            "type": "Date",
            "description": "End date of the affiliation"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "The HCP account in this affiliation"
          },
          {
            "target": "Account",
            "type": "lookup",
            "description": "The HCO account in this affiliation"
          }
        ]
      },
      {
        "name": "HealthcareProviderSpecialty",
        "type": "standard",
        "domain": "account_mgmt",
        "description": "Records the medical specialties associated with healthcare providers. Used for account search filtering, affiliation alignment rules, and engagement targeting to ensure field reps reach the right providers for their products.",
        "fields": [
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The healthcare provider account"
          },
          {
            "name": "SpecialtyName",
            "type": "Text",
            "description": "Name of the medical specialty"
          },
          {
            "name": "IsPrimary",
            "type": "Checkbox",
            "description": "Whether this is the provider's primary specialty"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "The provider account with this specialty"
          }
        ]
      },
      {
        "name": "ObjectTerritory2Association",
        "type": "standard",
        "domain": "account_mgmt",
        "description": "Standard Salesforce object that maps accounts to territories for the Align Account to Territory batch job. Records are created manually or loaded from external systems and processed by territory management batch jobs to create Provider Account Territory Info records.",
        "fields": [
          {
            "name": "ObjectId",
            "type": "Lookup",
            "description": "The account being assigned to a territory"
          },
          {
            "name": "Territory2Id",
            "type": "Lookup",
            "description": "The territory the account is assigned to"
          },
          {
            "name": "AssociationCause",
            "type": "Picklist",
            "description": "How the association was created (manual or rule-based)"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "The account being mapped to a territory"
          },
          {
            "target": "Territory2",
            "type": "lookup",
            "description": "The territory in the assignment"
          }
        ]
      }
    ],
    "metadata": [
      {
        "type": "TerritoryGeoAssignmentRule",
        "name": "Territory Geo Assignment Rule",
        "fields": {
          "UsageType": "Text",
          "TerritoryId": "Lookup",
          "PostalCode": "Text",
          "BrickCode": "Text"
        },
        "description": "Defines geographic assignment rules for Zip-to-Territory and Brick-to-Territory batch jobs. UsageType is set to ZipToTerritory or BrickToTerritory to control which alignment method is used."
      }
    ]
  },
  "engagement_planning": {
    "objects": [
      {
        "name": "ActivityPlan",
        "type": "custom",
        "domain": "engagement_planning",
        "description": "Represents an omni-channel cycle plan or call plan defining strategies for field representatives' interactions with HCPs. Contains time periods, activity types, goal measures, and review workflows. Supports lifecycle statuses from setup through review to execution.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the activity plan"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Lifecycle status of the plan"
          },
          {
            "name": "PlanType",
            "type": "Picklist",
            "description": "Type of plan such as cycle plan or call plan"
          },
          {
            "name": "StartDate",
            "type": "Date",
            "description": "Start date of the activity plan period"
          },
          {
            "name": "EndDate",
            "type": "Date",
            "description": "End date of the activity plan period"
          }
        ],
        "relationships": [
          {
            "target": "ActivityPlanTerritory",
            "type": "parent",
            "description": "Territory assignments for this activity plan"
          },
          {
            "target": "ProviderActivityGoal",
            "type": "parent",
            "description": "Account-level goals within this plan"
          }
        ]
      },
      {
        "name": "ActivityPlanTerritory",
        "type": "custom",
        "domain": "engagement_planning",
        "description": "Junction object linking activity plans to specific territories. Controls which territories are included in a plan and manages territory-specific validation and sharing rules through dedicated trigger handlers.",
        "fields": [
          {
            "name": "ActivityPlanId",
            "type": "Lookup",
            "description": "Reference to the parent activity plan"
          },
          {
            "name": "TerritoryId",
            "type": "Lookup",
            "description": "Reference to the territory included in the plan"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Status of the territory within the plan"
          }
        ],
        "relationships": [
          {
            "target": "ActivityPlan",
            "type": "lookup",
            "description": "The parent activity plan"
          },
          {
            "target": "Territory2",
            "type": "lookup",
            "description": "The territory assigned to this plan"
          }
        ]
      },
      {
        "name": "ProviderActivityGoal",
        "type": "custom",
        "domain": "engagement_planning",
        "description": "Defines account-level activity targets within an activity plan. Tracks goal measures by activity type (visits, emails, meetings) and product, with support for weighted measures, proration based on working days, and shared territory goals on aligned accounts.",
        "fields": [
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The target account for this goal"
          },
          {
            "name": "ActivityPlanId",
            "type": "Lookup",
            "description": "The parent activity plan"
          },
          {
            "name": "TargetValue",
            "type": "Number",
            "description": "Target number of activities to complete"
          },
          {
            "name": "ActualValue",
            "type": "Number",
            "description": "Actual number of activities completed"
          },
          {
            "name": "ActivityType",
            "type": "Picklist",
            "description": "Type of activity (visit, email, meeting)"
          },
          {
            "name": "ProductId",
            "type": "Lookup",
            "description": "Product associated with this goal"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "The account targeted by this goal"
          },
          {
            "target": "ActivityPlan",
            "type": "lookup",
            "description": "The activity plan containing this goal"
          },
          {
            "target": "LifeSciMarketableProduct",
            "type": "lookup",
            "description": "Product associated with the goal measure"
          }
        ]
      },
      {
        "name": "AccountPlan",
        "type": "custom",
        "domain": "engagement_planning",
        "description": "Represents a strategic engagement plan for a key account with objectives, participants, and action plans. Supports plan hierarchies for both account-level and territory-level business plans. Integrates with goal definitions and assessment tasks for tracking execution.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the account plan"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The key account this plan is for"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status of the account plan"
          },
          {
            "name": "StartDate",
            "type": "Date",
            "description": "Plan start date"
          },
          {
            "name": "EndDate",
            "type": "Date",
            "description": "Plan end date"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "The key account being planned for"
          },
          {
            "target": "AccountPlanObjective",
            "type": "parent",
            "description": "Strategic objectives within this plan"
          },
          {
            "target": "AccountPlanParticipant",
            "type": "parent",
            "description": "Team members participating in the plan"
          }
        ]
      },
      {
        "name": "GoalDefinition",
        "type": "custom",
        "domain": "engagement_planning",
        "description": "Defines reusable goal templates that can be associated with account plans and territory plans. Goal definitions specify the criteria, measures, and action plan template assignments that are instantiated when a plan is created.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the goal definition"
          },
          {
            "name": "Description",
            "type": "LongTextArea",
            "description": "Description of the goal criteria and purpose"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether the goal definition is active"
          }
        ],
        "relationships": [
          {
            "target": "ActionPlanTemplate",
            "type": "child",
            "description": "Action plan templates assigned to this goal via template assignments"
          },
          {
            "target": "GoalAssignment",
            "type": "parent",
            "description": "Instances of this goal definition in specific plans"
          }
        ]
      },
      {
        "name": "AssessmentTask",
        "type": "standard",
        "domain": "engagement_planning",
        "description": "Trackable action items within an action plan that represent specific tasks aligned to plan objectives. Tasks can be categorized, assigned to specific users, and marked complete. Users can add ad-hoc tasks when the action plan template permits it.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the assessment task"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current completion status"
          },
          {
            "name": "Category",
            "type": "Picklist",
            "description": "Category for organizing tasks"
          },
          {
            "name": "ActionPlanId",
            "type": "Lookup",
            "description": "The action plan this task belongs to"
          }
        ],
        "relationships": [
          {
            "target": "ActionPlan",
            "type": "lookup",
            "description": "The parent action plan containing this task"
          }
        ]
      }
    ],
    "metadata": [
      {
        "type": "ActionPlanTemplate",
        "name": "Action Plan Template",
        "fields": {
          "Name": "Text",
          "ActionPlanType": "Text",
          "TargetObjectType": "Text",
          "IsPublished": "Checkbox"
        },
        "description": "Defines reusable strategy templates containing assessment task items for Key Account Management. Templates are published and associated with goal definitions, and instantiated into runtime action plans when added to account or territory plans."
      }
    ]
  },
  "engagement_execution": {
    "objects": [
      {
        "name": "Visit",
        "type": "standard",
        "domain": "engagement_execution",
        "description": "Standard Salesforce object representing a scheduled or completed visit to an account. Has a one-to-one relationship with Provider Visit for Life Sciences-specific extensions. Supports the complete visit lifecycle from planning through engagement to post-visit reporting.",
        "fields": [
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The account being visited"
          },
          {
            "name": "PlaceId",
            "type": "Lookup",
            "description": "Location of the visit"
          },
          {
            "name": "PlannedStartTime",
            "type": "DateTime",
            "description": "Scheduled start time of the visit"
          },
          {
            "name": "PlannedEndTime",
            "type": "DateTime",
            "description": "Scheduled end time of the visit"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Visit status: Planned, In Progress, Completed, Submitted"
          },
          {
            "name": "Channel",
            "type": "Picklist",
            "description": "Communication channel: Face to Face, Video Call, Remote"
          },
          {
            "name": "TerritoryId",
            "type": "Lookup",
            "description": "Territory the visit is associated with"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "The account being visited"
          },
          {
            "target": "ProviderVisit",
            "type": "parent",
            "description": "Life Sciences-specific visit extension"
          },
          {
            "target": "Visitor",
            "type": "parent",
            "description": "Additional users participating in the visit"
          }
        ]
      },
      {
        "name": "ProviderVisit",
        "type": "custom",
        "domain": "engagement_execution",
        "description": "Life Sciences Cloud extension of the standard Visit object with a one-to-one relationship. Stores provider-specific visit details including next visit objectives, product discussions, and custom fields. Supports record types for different visit workflows.",
        "fields": [
          {
            "name": "VisitId",
            "type": "Lookup",
            "description": "Reference to the standard Visit record"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The provider account being visited"
          },
          {
            "name": "NextVisitObjective",
            "type": "LongTextArea",
            "description": "Objectives noted for the next visit"
          },
          {
            "name": "NextVisitObjectiveType",
            "type": "MultiPicklist",
            "description": "Categorized objective types for next visit"
          },
          {
            "name": "Channel",
            "type": "Picklist",
            "description": "Provider visit communication channel"
          }
        ],
        "relationships": [
          {
            "target": "Visit",
            "type": "lookup",
            "description": "The parent visit record"
          },
          {
            "target": "ProviderVisitProdDetailing",
            "type": "parent",
            "description": "Product detailing records for this visit"
          },
          {
            "target": "ProviderVisitProdDiscussion",
            "type": "parent",
            "description": "Product discussion records from this visit"
          }
        ]
      },
      {
        "name": "ProviderVisitProdDetailing",
        "type": "custom",
        "domain": "engagement_execution",
        "description": "Records product detailing activities during a provider visit. Captures which products were discussed, the associated product messages, and the healthcare provider's reactions. Serves as the activity object for product-level activity plan goal tracking.",
        "fields": [
          {
            "name": "ProviderVisitId",
            "type": "Lookup",
            "description": "The provider visit this detailing belongs to"
          },
          {
            "name": "ProductId",
            "type": "Lookup",
            "description": "The product being detailed"
          },
          {
            "name": "ProviderVisitChannel",
            "type": "Picklist",
            "description": "Channel used for this detailing"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The account being detailed to"
          }
        ],
        "relationships": [
          {
            "target": "ProviderVisit",
            "type": "lookup",
            "description": "The parent provider visit"
          },
          {
            "target": "LifeSciMarketableProduct",
            "type": "lookup",
            "description": "The product discussed"
          },
          {
            "target": "ProviderVisitDtlProductMsg",
            "type": "parent",
            "description": "Product messages discussed during detailing"
          }
        ]
      },
      {
        "name": "Inquiry",
        "type": "standard",
        "domain": "engagement_execution",
        "description": "Captures medical inquiries from HCPs including general questions, adverse events, and product quality complaints. Features a configurable workflow with stages from Draft through Responded, with role-based permissions for sales reps and medical science liaisons.",
        "fields": [
          {
            "name": "CaseId",
            "type": "Lookup",
            "description": "Associated case record"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Workflow stage: Draft, Signed, Submitted, Assigned, Responded"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The HCP account that raised the inquiry"
          },
          {
            "name": "OwnerId",
            "type": "Lookup",
            "description": "User responsible for the inquiry"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "The healthcare provider asking the question"
          },
          {
            "target": "InquiryQuestion",
            "type": "parent",
            "description": "Individual questions within the inquiry"
          },
          {
            "target": "SubjectAssignment",
            "type": "parent",
            "description": "Subject matter expert assignments"
          }
        ]
      },
      {
        "name": "MedicalInsight",
        "type": "custom",
        "domain": "engagement_execution",
        "description": "Captures structured observations and insights from field team engagements with HCPs and HCOs. Insights can be associated with accounts, products, and topic tags. Supports user reactions for collaboration and territory-based sharing.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Title of the medical insight"
          },
          {
            "name": "Content",
            "type": "LongTextArea",
            "description": "Detailed content of the insight"
          },
          {
            "name": "SourceType",
            "type": "Picklist",
            "description": "Source of the insight (visit, account, etc.)"
          },
          {
            "name": "VisitId",
            "type": "Lookup",
            "description": "Visit where the insight was captured"
          }
        ],
        "relationships": [
          {
            "target": "MedicalInsightAccount",
            "type": "parent",
            "description": "Accounts associated with this insight"
          },
          {
            "target": "MedicalInsightProduct",
            "type": "parent",
            "description": "Products related to this insight"
          },
          {
            "target": "Visit",
            "type": "lookup",
            "description": "The visit where this insight was captured"
          }
        ]
      },
      {
        "name": "VideoCall",
        "type": "standard",
        "domain": "engagement_execution",
        "description": "Represents a remote video call session using Twilio integration. Stores session details including meeting links, passcodes, and recording references. Supports participant management, screen sharing, and remote signature capture.",
        "fields": [
          {
            "name": "VisitId",
            "type": "Lookup",
            "description": "The visit this video call is associated with"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Call status: Scheduled, In Progress, Completed"
          },
          {
            "name": "SessionKey",
            "type": "Text",
            "description": "Unique session key for the video call"
          },
          {
            "name": "Passcode",
            "type": "Text",
            "description": "Passcode for joining the call"
          }
        ],
        "relationships": [
          {
            "target": "Visit",
            "type": "lookup",
            "description": "The visit this remote session belongs to"
          },
          {
            "target": "VideoCallParticipant",
            "type": "parent",
            "description": "Participants in the video call"
          },
          {
            "target": "VideoCallRecording",
            "type": "parent",
            "description": "Recordings from the session"
          }
        ]
      },
      {
        "name": "CommunicationSubscriptionConsent",
        "type": "standard",
        "domain": "engagement_execution",
        "description": "Stores HCP consent status for specific communication subscriptions and channels. Records opt-in and opt-out preferences with timestamps, enabling compliance with data privacy regulations. Territory-based sharing records are aligned through batch jobs.",
        "fields": [
          {
            "name": "ContactPointId",
            "type": "Lookup",
            "description": "The contact point this consent applies to"
          },
          {
            "name": "CommunicationSubscriptionId",
            "type": "Lookup",
            "description": "The subscription type"
          },
          {
            "name": "ConsentStatus",
            "type": "Picklist",
            "description": "Opt-in or opt-out status"
          },
          {
            "name": "ConsentCapturedDateTime",
            "type": "DateTime",
            "description": "When consent was captured"
          },
          {
            "name": "ConsentCapturedSource",
            "type": "Text",
            "description": "Where consent was captured"
          }
        ],
        "relationships": [
          {
            "target": "CommunicationSubscription",
            "type": "lookup",
            "description": "The subscription this consent relates to"
          },
          {
            "target": "Account",
            "type": "child",
            "description": "The account whose consent is recorded"
          }
        ]
      },
      {
        "name": "Expense",
        "type": "standard",
        "domain": "engagement_execution",
        "description": "Records individual expense line items associated with visits. Captures transaction details including amount, date, type, and system integration status for SAP Concur synchronization. Supports participant allocation for splitting costs across attendees.",
        "fields": [
          {
            "name": "Amount",
            "type": "Currency",
            "description": "Total expense amount"
          },
          {
            "name": "TransactionDate",
            "type": "Date",
            "description": "Date of the expense transaction"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "Account the expense is associated with"
          },
          {
            "name": "RelatedExpenseTypeId",
            "type": "Lookup",
            "description": "Type classification of the expense"
          },
          {
            "name": "ExpenseSystemIntegrationStatus",
            "type": "Picklist",
            "description": "Sync status with Concur"
          },
          {
            "name": "CurrencyIsoCode",
            "type": "Text",
            "description": "Currency of the expense"
          }
        ],
        "relationships": [
          {
            "target": "ExpenseType",
            "type": "lookup",
            "description": "The expense category"
          },
          {
            "target": "ExpenseParticipant",
            "type": "parent",
            "description": "Attendees allocated to this expense"
          },
          {
            "target": "ExpenseReport",
            "type": "child",
            "description": "Expense report containing this expense"
          }
        ]
      },
      {
        "name": "SurveyInvitation",
        "type": "standard",
        "domain": "engagement_execution",
        "description": "Represents a distributed survey instance linked to accounts or territories through Survey Subject records. Supports territory-based, account-based, and product-based sharing strategies. Invitation share records control which users can access and respond to the survey.",
        "fields": [
          {
            "name": "SurveyId",
            "type": "Lookup",
            "description": "The survey being distributed"
          },
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the invitation"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Invitation status"
          }
        ],
        "relationships": [
          {
            "target": "Survey",
            "type": "lookup",
            "description": "The parent survey definition"
          },
          {
            "target": "SurveySubject",
            "type": "parent",
            "description": "Subject records linking invitation to accounts or territories"
          }
        ]
      }
    ],
    "metadata": [
      {
        "type": "ComplianceStatementDef",
        "name": "Compliance Statement Definition",
        "fields": {
          "StatementType": "Text",
          "ModuleType": "Text",
          "StatementText": "LongTextArea"
        },
        "description": "Defines compliance disclaimer text used in medical inquiry workflows and signature capture. Statement types include Disclaimer, and module types include Medical Inquiry. The text appears during workflow actions requiring legal acknowledgment."
      }
    ]
  },
  "intelligent_content": {
    "objects": [
      {
        "name": "Presentation",
        "type": "custom",
        "domain": "intelligent_content",
        "description": "Represents an approved presentation that field users deliver to HCPs during visits. Presentations are uploaded as ZIP files containing HTML pages and managed through the Admin Console with activation dates, territory alignments, and product/message associations. Supports custom presentations assembled from existing pages.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the presentation"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Active or inactive status"
          },
          {
            "name": "ActivationDate",
            "type": "Date",
            "description": "Date the presentation becomes available"
          },
          {
            "name": "ExpirationDate",
            "type": "Date",
            "description": "Date the presentation is no longer available"
          },
          {
            "name": "IsCustom",
            "type": "Checkbox",
            "description": "Whether this is a user-created custom presentation"
          }
        ],
        "relationships": [
          {
            "target": "PresentationPage",
            "type": "parent",
            "description": "Individual pages within this presentation"
          },
          {
            "target": "PresentationLinkedPage",
            "type": "parent",
            "description": "Pages linked to this presentation from the page library"
          },
          {
            "target": "PresentationClickStrmEntry",
            "type": "parent",
            "description": "Engagement metrics tracked during delivery"
          }
        ]
      },
      {
        "name": "PresentationPage",
        "type": "custom",
        "domain": "intelligent_content",
        "description": "Represents an individual page within a presentation containing HTML content, images, or interactive elements. Pages can be marked as mandatory to enforce compliance requirements for key messages, disclaimers, or safety information. Supports topic assignments for filtering.",
        "fields": [
          {
            "name": "PresentationId",
            "type": "Lookup",
            "description": "The presentation this page belongs to"
          },
          {
            "name": "Name",
            "type": "Text",
            "description": "Page name or title"
          },
          {
            "name": "PageNumber",
            "type": "Number",
            "description": "Order of the page in the presentation"
          },
          {
            "name": "IsMandatory",
            "type": "Checkbox",
            "description": "Whether this page must be viewed during delivery"
          }
        ],
        "relationships": [
          {
            "target": "Presentation",
            "type": "lookup",
            "description": "The parent presentation"
          },
          {
            "target": "PresentationPageProduct",
            "type": "parent",
            "description": "Products linked to this page"
          }
        ]
      },
      {
        "name": "PresentationClickStrmEntry",
        "type": "custom",
        "domain": "intelligent_content",
        "description": "Captures engagement metrics during presentation delivery including pages viewed, time spent per page, and navigation paths. Records are created automatically by the presentation player and used for building custom reports and dashboards to optimize content strategy.",
        "fields": [
          {
            "name": "PresentationId",
            "type": "Lookup",
            "description": "The presentation being tracked"
          },
          {
            "name": "PageId",
            "type": "Lookup",
            "description": "The specific page viewed"
          },
          {
            "name": "Duration",
            "type": "Number",
            "description": "Time spent on the page in seconds"
          },
          {
            "name": "VisitId",
            "type": "Lookup",
            "description": "The visit during which the presentation was delivered"
          }
        ],
        "relationships": [
          {
            "target": "Presentation",
            "type": "lookup",
            "description": "The presentation being measured"
          },
          {
            "target": "PresentationPage",
            "type": "lookup",
            "description": "The page that was viewed"
          },
          {
            "target": "Visit",
            "type": "lookup",
            "description": "The visit context for this engagement"
          }
        ]
      },
      {
        "name": "PresentationPageProduct",
        "type": "custom",
        "domain": "intelligent_content",
        "description": "Junction object linking presentation pages to products and product messages. Enables product-based search and filtering in the content library and drives targeted presentation recommendations based on product territory alignments.",
        "fields": [
          {
            "name": "PresentationPageId",
            "type": "Lookup",
            "description": "The presentation page"
          },
          {
            "name": "ProductId",
            "type": "Lookup",
            "description": "The associated product"
          },
          {
            "name": "ProductGuidanceId",
            "type": "Lookup",
            "description": "The associated product message or objective"
          }
        ],
        "relationships": [
          {
            "target": "PresentationPage",
            "type": "lookup",
            "description": "The page linked to this product"
          },
          {
            "target": "LifeSciMarketableProduct",
            "type": "lookup",
            "description": "The product linked to this page"
          },
          {
            "target": "ProductGuidance",
            "type": "lookup",
            "description": "The product guidance linked to this page"
          }
        ]
      },
      {
        "name": "LifeScienceEmail",
        "type": "custom",
        "domain": "intelligent_content",
        "description": "Represents an email sent through the Life Sciences email system with tracking for delivery status, open rates, bounce information, and consent verification. Supports scheduled sending through email jobs, third-party email service integration, and attachment management.",
        "fields": [
          {
            "name": "TemplateId",
            "type": "Lookup",
            "description": "The email template used"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The recipient account"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Delivery status: Preparing, New, Retry, Success, Failed, Canceled"
          },
          {
            "name": "SentDate",
            "type": "DateTime",
            "description": "Date and time the email was sent"
          },
          {
            "name": "FirstOpenedDate",
            "type": "DateTime",
            "description": "First time the recipient opened the email"
          },
          {
            "name": "BouncedDate",
            "type": "DateTime",
            "description": "Date the email bounced"
          },
          {
            "name": "BounceReason",
            "type": "Text",
            "description": "Reason for email bounce"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "The recipient HCP or HCO account"
          },
          {
            "target": "Presentation",
            "type": "lookup",
            "description": "Presentation shared as a link in the email"
          }
        ]
      },
      {
        "name": "TerritoryAcctProdMsgScore",
        "type": "custom",
        "domain": "intelligent_content",
        "description": "Stores Next Best Message scoring data for each account-product-territory combination. Contains total score, rank, and score explainability information in JSON format showing metrics like HCP interest level and recent reactions. Drives recommended messages during visits.",
        "fields": [
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The target account"
          },
          {
            "name": "ProductGuidanceId",
            "type": "Lookup",
            "description": "The product message being scored"
          },
          {
            "name": "TerritoryId",
            "type": "Lookup",
            "description": "The territory context"
          },
          {
            "name": "TotalScore",
            "type": "Number",
            "description": "Calculated recommendation score"
          },
          {
            "name": "Rank",
            "type": "Number",
            "description": "Ranking among messages for this account"
          },
          {
            "name": "ScoreExplainabilityInfo",
            "type": "LongTextArea",
            "description": "JSON with scoring rationale metrics"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "The account this score applies to"
          },
          {
            "target": "ProductGuidance",
            "type": "lookup",
            "description": "The product message being recommended"
          },
          {
            "target": "Territory2",
            "type": "lookup",
            "description": "The territory context for this score"
          }
        ]
      }
    ],
    "metadata": []
  },
  "product_mgmt": {
    "objects": [
      {
        "name": "LifeSciMarketableProduct",
        "type": "custom",
        "domain": "product_mgmt",
        "description": "Represents all sellable and non-sellable (marketable) products in the Life Sciences product hierarchy. Categorized by type including Market, Therapeutic Area, Brand, Product, Indication, and Brand Indication. Uses the Parent Product field for hierarchy relationships. Products of type Product are associated with a Product2 record.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the marketable product"
          },
          {
            "name": "Type",
            "type": "Picklist",
            "description": "Product type: Market, Therapeutic Area, Brand, Product, Indication, Brand Indication"
          },
          {
            "name": "ParentProductId",
            "type": "Lookup",
            "description": "Parent product in the hierarchy"
          },
          {
            "name": "ProductId",
            "type": "Lookup",
            "description": "Associated Product2 record for sellable products"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether the product is currently active"
          },
          {
            "name": "DefaultDistributionQuantity",
            "type": "Number",
            "description": "Default sample distribution quantity"
          },
          {
            "name": "SignatureRequirementLevel",
            "type": "Picklist",
            "description": "Signature requirement: None, Optional, Mandatory"
          }
        ],
        "relationships": [
          {
            "target": "Product2",
            "type": "lookup",
            "description": "Physical sellable product record"
          },
          {
            "target": "LifeSciMarketableProduct",
            "type": "lookup",
            "description": "Parent product in the hierarchy"
          },
          {
            "target": "ProductGuidance",
            "type": "parent",
            "description": "Messages and objectives for this product"
          },
          {
            "target": "ProductTerritoryAvailability",
            "type": "parent",
            "description": "Territory alignment records"
          }
        ]
      },
      {
        "name": "Product2",
        "type": "standard",
        "domain": "product_mgmt",
        "description": "Standard Salesforce product object representing physical, sellable products including order items, promotional items, and samples. Each Product2 record is associated with a Life Science Marketable Product record of type Product. Record types distinguish between different sellable product categories.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Product name"
          },
          {
            "name": "ProductCode",
            "type": "Text",
            "description": "Product code or SKU"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether the product is active"
          },
          {
            "name": "RecordTypeId",
            "type": "Lookup",
            "description": "Record type: Order Item, Promotional Item, or Sample"
          },
          {
            "name": "Family",
            "type": "Picklist",
            "description": "Product family classification"
          }
        ],
        "relationships": [
          {
            "target": "LifeSciMarketableProduct",
            "type": "child",
            "description": "The marketable product record in the hierarchy"
          }
        ]
      },
      {
        "name": "ProductGuidance",
        "type": "custom",
        "domain": "product_mgmt",
        "description": "Represents product messages and objectives used during HCP detailing. Messages contain safety, efficacy, dosage, and side effect information with effective dates, priorities, group sequencing, and HCP reaction tracking. Objectives define product-related goals aligned with business strategies.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the message or objective"
          },
          {
            "name": "ContentText",
            "type": "LongTextArea",
            "description": "Full text content of the message or objective"
          },
          {
            "name": "Type",
            "type": "Picklist",
            "description": "Message or Objective"
          },
          {
            "name": "EffectiveStartDate",
            "type": "Date",
            "description": "Start date for the guidance"
          },
          {
            "name": "EffectiveEndDate",
            "type": "Date",
            "description": "End date for the guidance"
          },
          {
            "name": "Priority",
            "type": "Number",
            "description": "Priority ranking of the message"
          },
          {
            "name": "GroupName",
            "type": "Text",
            "description": "Group name for categorizing messages"
          },
          {
            "name": "GroupSequence",
            "type": "Number",
            "description": "Order of priority within the group"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether the guidance is active"
          },
          {
            "name": "HideReaction",
            "type": "Checkbox",
            "description": "Whether to hide the provider reaction"
          }
        ],
        "relationships": [
          {
            "target": "LifeSciMarketableProduct",
            "type": "lookup",
            "description": "The product this guidance belongs to"
          },
          {
            "target": "PresentationPageProduct",
            "type": "child",
            "description": "Presentation pages linked to this message"
          }
        ]
      },
      {
        "name": "ProductTerritoryAvailability",
        "type": "custom",
        "domain": "product_mgmt",
        "description": "Controls product-to-territory alignment through explicit inclusion, parent-based inheritance, and explicit exclusion. Records are automatically created in Queued status when products are aligned to territories. An invocable action creates detailed availability records for processing.",
        "fields": [
          {
            "name": "ProductId",
            "type": "Lookup",
            "description": "The product being aligned"
          },
          {
            "name": "TerritoryId",
            "type": "Lookup",
            "description": "The territory the product is aligned to"
          },
          {
            "name": "AlignmentType",
            "type": "Picklist",
            "description": "Inclusion, Territory and Subordinates Inclusion, or Territory Exclusion"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Processing status: Queued, Active"
          }
        ],
        "relationships": [
          {
            "target": "LifeSciMarketableProduct",
            "type": "lookup",
            "description": "The product being aligned"
          },
          {
            "target": "Territory2",
            "type": "lookup",
            "description": "The territory in the alignment"
          },
          {
            "target": "ProductTerrDtlAvailability",
            "type": "parent",
            "description": "Detailed availability records for this alignment"
          }
        ]
      },
      {
        "name": "ProductTerrDtlAvailability",
        "type": "custom",
        "domain": "product_mgmt",
        "description": "Provides detailed product territory availability data created by invocable actions from parent ProductTerritoryAvailability records. Represents the final resolved availability of a product in a specific territory after inheritance and exclusion rules are applied.",
        "fields": [
          {
            "name": "ProductTerritoryAvailabilityId",
            "type": "Lookup",
            "description": "Parent availability record"
          },
          {
            "name": "ProductId",
            "type": "Lookup",
            "description": "The available product"
          },
          {
            "name": "TerritoryId",
            "type": "Lookup",
            "description": "The territory where the product is available"
          },
          {
            "name": "IsAvailable",
            "type": "Checkbox",
            "description": "Whether the product is available in this territory"
          }
        ],
        "relationships": [
          {
            "target": "ProductTerritoryAvailability",
            "type": "lookup",
            "description": "The parent alignment record"
          },
          {
            "target": "LifeSciMarketableProduct",
            "type": "lookup",
            "description": "The product"
          },
          {
            "target": "Territory2",
            "type": "lookup",
            "description": "The territory"
          }
        ]
      }
    ],
    "metadata": [
      {
        "type": "LifeSciMetadataRecord",
        "name": "Life Sciences Metadata Record",
        "fields": {
          "Category": "Text",
          "Name": "Text",
          "Value": "LongTextArea",
          "IsActive": "Checkbox"
        },
        "description": "Stores configuration metadata for Life Sciences features including visit record type mappings (AccountProviderVisitRecordTypeMapping), provider visit settings (ProviderVisitSettings), and state license number settings (StateLicenseNumberSettings). Used to configure behavior without code changes."
      }
    ]
  },
  "sample_mgmt": {
    "objects": [
      {
        "name": "ProductItem",
        "type": "standard",
        "domain": "sample_mgmt",
        "description": "Represents the total quantity of a specific product assigned to a user at a particular inventory location. Establishes a one-to-one relationship between a product and a location, where the location represents the sales rep's current inventory on hand. Quantity on hand is automatically updated based on related product batch items.",
        "fields": [
          {
            "name": "Product2Id",
            "type": "Lookup",
            "description": "The product record this item tracks inventory for"
          },
          {
            "name": "LocationId",
            "type": "Lookup",
            "description": "The inventory location associated with the sales rep"
          },
          {
            "name": "QuantityOnHand",
            "type": "Number",
            "description": "Total quantity of the product currently in the rep's possession"
          },
          {
            "name": "QuantityUnitOfMeasure",
            "type": "Picklist",
            "description": "Unit of measure for the quantity, typically Each for samples"
          },
          {
            "name": "SerialNumber",
            "type": "Text",
            "description": "Optional serial number for tracking individual product items"
          }
        ],
        "relationships": [
          {
            "target": "Product2",
            "type": "lookup",
            "description": "Links to the product record being tracked"
          },
          {
            "target": "Location",
            "type": "lookup",
            "description": "Links to the inventory location representing the rep's stock"
          },
          {
            "target": "ProductBatchItem",
            "type": "parent",
            "description": "Product items contain batch-specific quantity breakdowns"
          }
        ]
      },
      {
        "name": "ProductBatchItem",
        "type": "standard",
        "domain": "sample_mgmt",
        "description": "Establishes the relationship between a product, production batch, location, and user. Captures the quantity of samples from a specific batch allocated to a sales rep and helps maintain compliance by tracking allotted and remaining quantities across inventory operations.",
        "fields": [
          {
            "name": "ProductItemId",
            "type": "Lookup",
            "description": "The product item this batch item belongs to"
          },
          {
            "name": "ProductionBatchId",
            "type": "Lookup",
            "description": "The production batch this item is part of"
          },
          {
            "name": "RemainingQuantity",
            "type": "Number",
            "description": "Number of samples remaining in this batch allocation"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether this batch item assignment is currently active"
          },
          {
            "name": "OwnerId",
            "type": "Lookup",
            "description": "The user who owns this batch item inventory"
          }
        ],
        "relationships": [
          {
            "target": "ProductItem",
            "type": "lookup",
            "description": "Links to the parent product item record"
          },
          {
            "target": "ProductionBatch",
            "type": "lookup",
            "description": "Links to the production batch for traceability"
          },
          {
            "target": "LifeSciMarketableProduct",
            "type": "lookup",
            "description": "Links to the marketable product configuration"
          }
        ]
      },
      {
        "name": "ProductionBatch",
        "type": "standard",
        "domain": "sample_mgmt",
        "description": "Represents a manufacturing batch of sample products with unique identification numbers for regulatory traceability. Products are tracked by batch across all inventory operations including counts, transfers, returns, acknowledgments, and disbursements.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "System-generated or custom name for the production batch"
          },
          {
            "name": "Product2Id",
            "type": "Lookup",
            "description": "The product this batch belongs to"
          },
          {
            "name": "UniqueIdentificationNumber",
            "type": "Text",
            "description": "External identifier such as lot number for regulatory tracking"
          },
          {
            "name": "ExpirationDate",
            "type": "Date",
            "description": "Date when this batch expires and should no longer be distributed"
          },
          {
            "name": "QuantityUnitOfMeasure",
            "type": "Picklist",
            "description": "Unit of measure for batch quantities"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether this batch is currently active for distribution"
          }
        ],
        "relationships": [
          {
            "target": "Product2",
            "type": "lookup",
            "description": "Links to the product record this batch represents"
          },
          {
            "target": "ProductBatchItem",
            "type": "parent",
            "description": "Batch contains individual batch item allocations"
          }
        ]
      },
      {
        "name": "InventoryOperation",
        "type": "standard",
        "domain": "sample_mgmt",
        "description": "Records inventory transactions including transfers in and out, returns, adjustments, and disbursements. Each operation captures the type of movement, quantities involved, and status for audit trail purposes. Operations are locked once finalized to preserve data integrity.",
        "fields": [
          {
            "name": "Type",
            "type": "Picklist",
            "description": "Type of operation: Adjustment, Transfer In, Transfer Out, Return, Disbursement"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status of the operation such as Draft, Submitted, or Completed"
          },
          {
            "name": "Quantity",
            "type": "Number",
            "description": "Number of items involved in this operation"
          },
          {
            "name": "ProductBatchItemId",
            "type": "Lookup",
            "description": "The product batch item affected by this operation"
          },
          {
            "name": "LocationId",
            "type": "Lookup",
            "description": "The inventory location where this operation takes place"
          }
        ],
        "relationships": [
          {
            "target": "ProductBatchItem",
            "type": "lookup",
            "description": "Links to the batch item being moved or adjusted"
          },
          {
            "target": "Location",
            "type": "lookup",
            "description": "Links to the inventory location for this operation"
          },
          {
            "target": "InventoryCountAssessment",
            "type": "lookup",
            "description": "Operations may be created during count assessments"
          }
        ]
      },
      {
        "name": "InventoryCountAssessment",
        "type": "standard",
        "domain": "sample_mgmt",
        "description": "Represents a periodic or ad hoc physical inventory verification. Assessors compare actual physical counts against system records, record discrepancies, and create adjustment operations. Supports initial, periodic, ad hoc, and audited assessment types with configurable column visibility.",
        "fields": [
          {
            "name": "Type",
            "type": "Picklist",
            "description": "Assessment type: Ad Hoc, Audited, Initial, or Periodic"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status of the assessment such as Draft, In Progress, or Completed"
          },
          {
            "name": "LocationId",
            "type": "Lookup",
            "description": "The inventory location being assessed"
          },
          {
            "name": "OwnerId",
            "type": "Lookup",
            "description": "The user performing or responsible for this assessment"
          },
          {
            "name": "AssessmentDate",
            "type": "DateTime",
            "description": "When this inventory count was performed"
          }
        ],
        "relationships": [
          {
            "target": "Location",
            "type": "lookup",
            "description": "Links to the location being counted"
          },
          {
            "target": "InventoryCntProdtBatchItem",
            "type": "parent",
            "description": "Assessment contains batch-level count records"
          }
        ]
      },
      {
        "name": "ProductDisbursement",
        "type": "standard",
        "domain": "sample_mgmt",
        "description": "Records the distribution of sample products to healthcare providers during visits. Tracks the quantity disbursed, the receiving provider, and the visit context. Supports resolution workflows for unresolved disbursements where inventory acknowledgment is pending.",
        "fields": [
          {
            "name": "Quantity",
            "type": "Number",
            "description": "Number of samples disbursed to the provider"
          },
          {
            "name": "ProductBatchItemId",
            "type": "Lookup",
            "description": "The batch item from which samples were disbursed"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Status of the disbursement such as Completed or Unresolved"
          },
          {
            "name": "ProviderVisitId",
            "type": "Lookup",
            "description": "The provider visit during which samples were disbursed"
          }
        ],
        "relationships": [
          {
            "target": "ProductBatchItem",
            "type": "lookup",
            "description": "Links to the batch item providing the disbursed samples"
          },
          {
            "target": "ProviderVisit",
            "type": "lookup",
            "description": "Links to the visit record where disbursement occurred"
          }
        ]
      },
      {
        "name": "ProductTransfer",
        "type": "standard",
        "domain": "sample_mgmt",
        "description": "Represents the transfer of sample inventory between users, locations, or back to the warehouse. Tracks source and destination locations, quantities, and approval status. Locked after finalization to prevent modifications to completed transfers.",
        "fields": [
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status such as Draft, Submitted, or Completed"
          },
          {
            "name": "SourceLocationId",
            "type": "Lookup",
            "description": "Location the inventory is being transferred from"
          },
          {
            "name": "DestinationLocationId",
            "type": "Lookup",
            "description": "Location the inventory is being transferred to"
          },
          {
            "name": "Quantity",
            "type": "Number",
            "description": "Number of items being transferred"
          }
        ],
        "relationships": [
          {
            "target": "Location",
            "type": "lookup",
            "description": "Source location for the transfer"
          },
          {
            "target": "Location",
            "type": "lookup",
            "description": "Destination location for the transfer"
          },
          {
            "target": "ProductBatchItem",
            "type": "lookup",
            "description": "Batch item being transferred"
          }
        ]
      },
      {
        "name": "TerritoryProductQuantityAllocation",
        "type": "standard",
        "domain": "sample_mgmt",
        "description": "Controls the quantity of sample products allocated to a specific territory for a defined period. Defines allocated, adjustment, ordered, and maximum disbursement quantities for Drop or Ship distribution types. Updated automatically when visits are submitted.",
        "fields": [
          {
            "name": "Product2Id",
            "type": "Lookup",
            "description": "The sample product being allocated"
          },
          {
            "name": "Territory2Id",
            "type": "Lookup",
            "description": "The territory receiving the allocation"
          },
          {
            "name": "AllocatedQuantity",
            "type": "Number",
            "description": "Total amount allocated to this territory for the period"
          },
          {
            "name": "RemainingQuantity",
            "type": "Number",
            "description": "Amount remaining after disbursements are deducted"
          },
          {
            "name": "AllocationType",
            "type": "Picklist",
            "description": "Distribution method: Drop for in-person or Ship for direct delivery"
          },
          {
            "name": "MaxDisbursementLimitQuantity",
            "type": "Number",
            "description": "Maximum amount a rep can disburse in a single visit"
          }
        ],
        "relationships": [
          {
            "target": "Product2",
            "type": "lookup",
            "description": "Links to the product being allocated"
          },
          {
            "target": "Territory2",
            "type": "lookup",
            "description": "Links to the territory receiving the allocation"
          }
        ]
      }
    ],
    "metadata": [
      {
        "type": "SampleLimitTemplate__mdt",
        "name": "Sample Limit Templates",
        "fields": {
          "TemplateName__c": "Text",
          "TemplateType__c": "Picklist",
          "EnforcementType__c": "Picklist",
          "IsActive__c": "Checkbox",
          "Priority__c": "Number"
        },
        "description": "Defines sample limit rules and enforcement behavior for product-account combinations. Includes generic, country-specific, and custom advanced templates with Error or Warning enforcement types."
      }
    ]
  },
  "common_components": {
    "objects": [
      {
        "name": "AppAlert",
        "type": "standard",
        "domain": "common_components",
        "description": "Represents an in-app notification that can be delivered to sales reps across web and mobile platforms. Supports multiple alert types including announcements, notifications, recommendations, and guided actions. Alerts can be targeted by territory and configured with deep links, action buttons, and tags via JSON-structured additional messages.",
        "fields": [
          {
            "name": "Subject",
            "type": "Text",
            "description": "Title or subject line of the alert"
          },
          {
            "name": "AlertType",
            "type": "Picklist",
            "description": "Type: Announcement, Notification, Recommendation, or Guided Action"
          },
          {
            "name": "DisplayContextType",
            "type": "Picklist",
            "description": "Where alert appears: Global, Object, or Tab"
          },
          {
            "name": "DisplayContextName",
            "type": "Text",
            "description": "API name of the specific object or tab for targeted display"
          },
          {
            "name": "EffectiveStartDate",
            "type": "DateTime",
            "description": "When the alert becomes visible to users"
          },
          {
            "name": "ValidUntilDate",
            "type": "DateTime",
            "description": "When the alert expires and is no longer visible"
          },
          {
            "name": "AdditionalMessage",
            "type": "LongTextArea",
            "description": "JSON structure for deep links, external URLs, action buttons, and tags"
          },
          {
            "name": "IsSilent",
            "type": "Checkbox",
            "description": "Prevents the alert from popping up on mobile while remaining in message pane"
          }
        ],
        "relationships": [
          {
            "target": "AppAlertTerritory",
            "type": "parent",
            "description": "Alert is associated with one or more territories via junction records"
          },
          {
            "target": "AppAlertUserResponse",
            "type": "parent",
            "description": "Tracks user interactions like dismiss or resolve with reason"
          }
        ]
      },
      {
        "name": "AppAlertTerritory",
        "type": "standard",
        "domain": "common_components",
        "description": "Junction object linking an alert (App Alert or Record Alert) to a territory. Controls which users see the alert based on their territory assignments, enabling geographic or organizational targeting of notifications.",
        "fields": [
          {
            "name": "AlertReferenceRecordId",
            "type": "Lookup",
            "description": "The app alert or record alert being associated with a territory"
          },
          {
            "name": "Territory2Id",
            "type": "Lookup",
            "description": "The territory where the alert is sent"
          }
        ],
        "relationships": [
          {
            "target": "AppAlert",
            "type": "lookup",
            "description": "Links to the app alert being targeted to a territory"
          },
          {
            "target": "Territory2",
            "type": "lookup",
            "description": "Links to the territory receiving the alert"
          }
        ]
      },
      {
        "name": "RecordAlert",
        "type": "standard",
        "domain": "common_components",
        "description": "Represents a notification associated with a specific record such as an Account or Healthcare Provider. Can be created manually or triggered automatically using Business Rules Engine. Supports territory-based targeting through App Alert Territories.",
        "fields": [
          {
            "name": "ParentId",
            "type": "Lookup",
            "description": "The record this alert is associated with"
          },
          {
            "name": "Subject",
            "type": "Text",
            "description": "Subject line of the record alert"
          },
          {
            "name": "Description",
            "type": "TextArea",
            "description": "Detailed description of the alert context"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether the record alert is currently active"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "Record alerts can target specific account records"
          },
          {
            "target": "AppAlertTerritory",
            "type": "parent",
            "description": "Territory targeting through junction records"
          }
        ]
      },
      {
        "name": "BusinessLicense",
        "type": "standard",
        "domain": "common_components",
        "description": "Stores healthcare provider license information including state license numbers, state distributor licenses, and DEA numbers. Custom formula fields on this object evaluate license validity for compliance checks during sample distribution.",
        "fields": [
          {
            "name": "LicenseNumber",
            "type": "Text",
            "description": "The license identification number"
          },
          {
            "name": "LicenseType",
            "type": "Picklist",
            "description": "Type of license: SLN, SDL, or DEA"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status of the license"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether the license is currently valid and active"
          },
          {
            "name": "ExpirationDate",
            "type": "Date",
            "description": "Date when the license expires"
          },
          {
            "name": "StateCode",
            "type": "Text",
            "description": "US state code where the license is valid"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "Links to the healthcare provider account holding the license"
          }
        ]
      },
      {
        "name": "LifeScienceTriggerHandler",
        "type": "custom",
        "domain": "common_components",
        "description": "Configuration record that controls the activation and behavior of Life Sciences Customer Engagement trigger handlers. Admins manage trigger handlers from the Admin Console to control automated business logic across samples, visits, territories, and other objects.",
        "fields": [
          {
            "name": "DeveloperName",
            "type": "Text",
            "description": "Unique API name identifying the trigger handler"
          },
          {
            "name": "ObjectApiName",
            "type": "Text",
            "description": "The API name of the object this trigger handler operates on"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether this trigger handler is currently enabled"
          },
          {
            "name": "TriggerCondition",
            "type": "Text",
            "description": "The DML event that fires this handler such as after insert or after update"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "Many trigger handlers operate on account-related objects"
          }
        ]
      }
    ],
    "metadata": [
      {
        "type": "DynamicTreeViewConfig__mdt",
        "name": "Dynamic Tree View Configuration",
        "fields": {
          "ComponentName__c": "Text",
          "ParentObjectConfig__c": "Text",
          "ChildObjectConfig__c": "Text",
          "GrandchildObjectConfig__c": "Text",
          "IsActive__c": "Checkbox"
        },
        "description": "Configures hierarchical tree view components that display related Life Sciences data in expandable parent-child-grandchild structures with search, filtering, and junction object support."
      }
    ]
  },
  "participant_mgmt": {
    "objects": [
      {
        "name": "ResearchStudy",
        "type": "standard",
        "domain": "participant_mgmt",
        "description": "Represents the details of a clinical research study including its design, execution timeline, and oversight. Stores essential information such as study title, status, target enrollment count, and links to protocol documents. Research studies define the inclusion and exclusion criteria used for participant matching and eligibility evaluation.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Display name of the research study"
          },
          {
            "name": "Title",
            "type": "Text",
            "description": "Official title of the research study"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status such as Active, Completed, or Suspended"
          },
          {
            "name": "StartDate",
            "type": "Date",
            "description": "Date the study begins enrolling participants"
          },
          {
            "name": "EndDate",
            "type": "Date",
            "description": "Planned end date of the study"
          },
          {
            "name": "TargetEnrollmentCount",
            "type": "Number",
            "description": "Target number of participants to enroll"
          }
        ],
        "relationships": [
          {
            "target": "CareProgram",
            "type": "lookup",
            "description": "Research study is associated with a care program for extended details"
          },
          {
            "target": "ResearchStudyCandidate",
            "type": "parent",
            "description": "Study contains candidate records for potential participants"
          },
          {
            "target": "ResearchStudyRandomization",
            "type": "parent",
            "description": "Study has randomization configuration for controlled trials"
          }
        ]
      },
      {
        "name": "ResearchStudyCandidate",
        "type": "standard",
        "domain": "participant_mgmt",
        "description": "Represents a potential participant associated with a research study. Tracks the candidate's account, current enrollment status, and evaluation results. Status progresses through stages such as Prescreened, Eligible, Consented, and Enrolled as candidates move through the recruitment and enrollment pipeline.",
        "fields": [
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The patient account associated with this candidate"
          },
          {
            "name": "ResearchStudyId",
            "type": "Lookup",
            "description": "The research study this candidate is associated with"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status in the enrollment pipeline"
          },
          {
            "name": "StatusUpdateReason",
            "type": "TextArea",
            "description": "Reason for the most recent status change"
          }
        ],
        "relationships": [
          {
            "target": "ResearchStudy",
            "type": "lookup",
            "description": "Links to the research study being applied to"
          },
          {
            "target": "Account",
            "type": "lookup",
            "description": "Links to the patient account"
          },
          {
            "target": "ResearchStudyCandidateStatusPeriod",
            "type": "parent",
            "description": "Status history records track duration at each status"
          }
        ]
      },
      {
        "name": "CareProgram",
        "type": "standard",
        "domain": "participant_mgmt",
        "description": "Represents the extended details of a research study or clinical trial program. Care programs define the activities, eligibility rules, and site configurations for participant management. Serves as the anchor for enrollment, consent management, and therapy orchestration.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the care program"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status of the program"
          },
          {
            "name": "StartDate",
            "type": "Date",
            "description": "Program start date"
          },
          {
            "name": "EndDate",
            "type": "Date",
            "description": "Program end date"
          }
        ],
        "relationships": [
          {
            "target": "ResearchStudy",
            "type": "lookup",
            "description": "Links to the associated research study"
          },
          {
            "target": "CareProgramEnrollee",
            "type": "parent",
            "description": "Program contains enrolled participant records"
          },
          {
            "target": "CareProgramEligibilityRule",
            "type": "parent",
            "description": "Program defines eligibility rules for enrollment"
          },
          {
            "target": "CareProgramSite",
            "type": "parent",
            "description": "Program has associated clinical trial sites"
          }
        ]
      },
      {
        "name": "CareProgramEnrollee",
        "type": "standard",
        "domain": "participant_mgmt",
        "description": "Represents a participant enrolled in a care program or clinical trial. Tracks enrollment status, stage, and the participant's progression through the trial. Links to work orders for therapy orchestration and service appointments for scheduling.",
        "fields": [
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The patient account of the enrollee"
          },
          {
            "name": "CareProgramId",
            "type": "Lookup",
            "description": "The care program the participant is enrolled in"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Enrollment status such as Active, Completed, or Withdrawn"
          },
          {
            "name": "EnrollmentDate",
            "type": "Date",
            "description": "Date the participant was enrolled"
          }
        ],
        "relationships": [
          {
            "target": "CareProgram",
            "type": "lookup",
            "description": "Links to the care program for enrollment details"
          },
          {
            "target": "Account",
            "type": "lookup",
            "description": "Links to the patient account"
          },
          {
            "target": "CareProgramEnrolleeWorkOrder",
            "type": "parent",
            "description": "Enrollee has therapy work orders for orchestration"
          }
        ]
      },
      {
        "name": "AuthorizationFormConsent",
        "type": "standard",
        "domain": "participant_mgmt",
        "description": "Records the date and method by which a participant consented to an authorization form. Tracks consent status, the specific form version signed, and links to the digital verification record that validates the consent process.",
        "fields": [
          {
            "name": "ConsentCapturedDateTime",
            "type": "DateTime",
            "description": "When consent was captured from the participant"
          },
          {
            "name": "ConsentCapturedSource",
            "type": "Picklist",
            "description": "How consent was captured such as digital, paper, or verbal"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status of the consent record"
          },
          {
            "name": "AuthorizationFormTextId",
            "type": "Lookup",
            "description": "The specific form text version that was consented to"
          }
        ],
        "relationships": [
          {
            "target": "AuthorizationFormText",
            "type": "lookup",
            "description": "Links to the form text version that was signed"
          },
          {
            "target": "Account",
            "type": "lookup",
            "description": "Links to the consenting participant's account"
          },
          {
            "target": "DigitalVerification",
            "type": "lookup",
            "description": "Links to the verification record validating consent"
          }
        ]
      },
      {
        "name": "EnrollmentEligibilityCriteria",
        "type": "standard",
        "domain": "participant_mgmt",
        "description": "Defines criteria for evaluating patient enrollment eligibility for clinical trials or care programs. Represents both inclusion criteria that candidates must meet and exclusion criteria that disqualify candidates. Linked to care programs through eligibility rule records.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name describing this eligibility criterion"
          },
          {
            "name": "CriteriaType",
            "type": "Picklist",
            "description": "Whether this is an inclusion or exclusion criterion"
          },
          {
            "name": "Description",
            "type": "TextArea",
            "description": "Detailed description of the eligibility criterion"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether this criterion is currently applied"
          }
        ],
        "relationships": [
          {
            "target": "CareProgramEligibilityRule",
            "type": "child",
            "description": "Criteria are linked to care programs through eligibility rules"
          }
        ]
      },
      {
        "name": "ResearchStudyRandomization",
        "type": "standard",
        "domain": "participant_mgmt",
        "description": "Represents the randomization algorithm configuration for a research study. Defines the block size, stratification criteria, and comparison groups used to randomly assign participants to treatment or control arms in controlled clinical trials.",
        "fields": [
          {
            "name": "ResearchStudyId",
            "type": "Lookup",
            "description": "The research study this randomization is configured for"
          },
          {
            "name": "AlgorithmType",
            "type": "Picklist",
            "description": "Type of randomization algorithm used"
          },
          {
            "name": "BlockSize",
            "type": "Number",
            "description": "Size of randomization blocks"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether randomization is currently active for this study"
          }
        ],
        "relationships": [
          {
            "target": "ResearchStudy",
            "type": "lookup",
            "description": "Links to the research study being randomized"
          },
          {
            "target": "ResearchStudyRandomizationBlock",
            "type": "parent",
            "description": "Contains generated randomization blocks"
          },
          {
            "target": "ResearchStudyComparisonGroup",
            "type": "parent",
            "description": "Defines treatment and control comparison groups"
          }
        ]
      }
    ],
    "metadata": [
      {
        "type": "ParticipantManagementSettings__mdt",
        "name": "Participant Management Settings",
        "fields": {
          "IsRecruitmentEnabled__c": "Checkbox",
          "IsRandomizationEnabled__c": "Checkbox",
          "IsCandidateMatchingEnabled__c": "Checkbox",
          "DefaultPreScreeningFlow__c": "Text"
        },
        "description": "Controls which Participant Management features are enabled in the org, including participant recruitment and enrollment, research study randomization, and Einstein Candidate Matching."
      }
    ]
  },
  "site_mgmt": {
    "objects": [
      {
        "name": "CareSiteInvestigatorSearchableField",
        "type": "standard",
        "domain": "site_mgmt",
        "description": "Represents consolidated searchable data about clinical trial investigators associated with sites. Contains fields from multiple source objects aggregated by Data Processing Engine into a single searchable record for criteria-based site and investigator discovery.",
        "fields": [
          {
            "name": "InvestigatorName",
            "type": "Text",
            "description": "Name of the investigator"
          },
          {
            "name": "SiteName",
            "type": "Text",
            "description": "Name of the associated clinical trial site"
          },
          {
            "name": "Specialty",
            "type": "Text",
            "description": "Investigator's medical specialty"
          },
          {
            "name": "YearsOfExperience",
            "type": "Number",
            "description": "Total years of research study experience"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The account record representing the investigator or site"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "Links to the account representing the site or investigator"
          },
          {
            "target": "HealthcareProvider",
            "type": "lookup",
            "description": "Links to the healthcare provider record"
          }
        ]
      },
      {
        "name": "ResearchStudySearchableField",
        "type": "standard",
        "domain": "site_mgmt",
        "description": "Represents a common dataset used as the basis for research study searches. Consolidates multiple fields and values from various objects into a single searchable record, enabling criteria-based filtering and discovery of relevant clinical trials.",
        "fields": [
          {
            "name": "ResearchStudyId",
            "type": "Lookup",
            "description": "The research study this searchable record represents"
          },
          {
            "name": "FieldName",
            "type": "Text",
            "description": "Name of the searchable field"
          },
          {
            "name": "FieldValue",
            "type": "Text",
            "description": "Value of the searchable field"
          },
          {
            "name": "SourceObjectName",
            "type": "Text",
            "description": "API name of the object this field originates from"
          }
        ],
        "relationships": [
          {
            "target": "ResearchStudy",
            "type": "lookup",
            "description": "Links to the research study being searched"
          }
        ]
      },
      {
        "name": "CareProgramSite",
        "type": "standard",
        "domain": "site_mgmt",
        "description": "Represents a clinical trial site associated with a care program. Stores the name, location details, and healthcare facility information for the site where research study activities are conducted. Links to contracts and assessments for site activation tracking.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the care program site"
          },
          {
            "name": "CareProgramId",
            "type": "Lookup",
            "description": "The care program this site belongs to"
          },
          {
            "name": "HealthcareFacilityId",
            "type": "Lookup",
            "description": "The healthcare facility at this site"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status of the site such as Active, Inactive, or Pending"
          }
        ],
        "relationships": [
          {
            "target": "CareProgram",
            "type": "lookup",
            "description": "Links to the care program for this trial site"
          },
          {
            "target": "HealthcareFacility",
            "type": "lookup",
            "description": "Links to the facility record"
          },
          {
            "target": "CareProgramSiteContract",
            "type": "parent",
            "description": "Site has associated contract records"
          }
        ]
      },
      {
        "name": "CareProgramSiteContract",
        "type": "standard",
        "domain": "site_mgmt",
        "description": "Represents the association between a care program site and a contract. Manages clinical trial agreements including non-disclosure agreements before feasibility and clinical trial agreements after site qualification, supporting the full contract lifecycle from authoring to activation.",
        "fields": [
          {
            "name": "CareProgramSiteId",
            "type": "Lookup",
            "description": "The care program site this contract is for"
          },
          {
            "name": "ContractId",
            "type": "Lookup",
            "description": "The contract record managing the agreement"
          },
          {
            "name": "ContractType",
            "type": "Picklist",
            "description": "Type such as NDA, CDA, or Clinical Trial Agreement"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status of the contract"
          }
        ],
        "relationships": [
          {
            "target": "CareProgramSite",
            "type": "lookup",
            "description": "Links to the site this contract covers"
          },
          {
            "target": "Contract",
            "type": "lookup",
            "description": "Links to the Salesforce contract record"
          }
        ]
      },
      {
        "name": "AssessmentEnvelope",
        "type": "standard",
        "domain": "site_mgmt",
        "description": "Represents a container for assessments sent to site investigators during the feasibility evaluation process. Stores information about the envelope, its associated research study, and the set of assessment questions created using Discovery Framework or generative AI.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the assessment envelope"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status of the assessment such as Draft, Sent, or Completed"
          },
          {
            "name": "ResearchStudyId",
            "type": "Lookup",
            "description": "The research study this assessment is for"
          },
          {
            "name": "DueDate",
            "type": "Date",
            "description": "Deadline for completing the assessment"
          }
        ],
        "relationships": [
          {
            "target": "ResearchStudy",
            "type": "lookup",
            "description": "Links to the research study being assessed"
          },
          {
            "target": "AssessmentEnvelopeItem",
            "type": "parent",
            "description": "Envelope contains individual assessment items"
          }
        ]
      },
      {
        "name": "ScoreCategory",
        "type": "standard",
        "domain": "site_mgmt",
        "description": "Represents scoring dimensions used to evaluate and rank sites and investigators. Categories can include clinical trial experience, trial performance metrics, regulatory compliance, and research publications. Scores can be generated using Business Rule Engine, Data 360, or imported from external tools.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the scoring category"
          },
          {
            "name": "Weight",
            "type": "Percent",
            "description": "Relative weight of this category in overall scoring"
          },
          {
            "name": "Description",
            "type": "TextArea",
            "description": "Description of what this category measures"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether this scoring category is currently used"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "Scores are assigned to site or investigator account records"
          }
        ]
      },
      {
        "name": "PartyPublication",
        "type": "standard",
        "domain": "site_mgmt",
        "description": "Stores details about an investigator's published research papers and clinical trial publications. Publication records contribute to investigator scoring and help study managers evaluate research experience and expertise in specific therapeutic areas.",
        "fields": [
          {
            "name": "Title",
            "type": "Text",
            "description": "Title of the publication"
          },
          {
            "name": "PublicationDate",
            "type": "Date",
            "description": "Date the research was published"
          },
          {
            "name": "JournalName",
            "type": "Text",
            "description": "Name of the journal or conference"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The investigator account associated with this publication"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "Links to the investigator's account record"
          }
        ]
      }
    ],
    "metadata": [
      {
        "type": "SiteManagementSettings__mdt",
        "name": "Site Management Settings",
        "fields": {
          "IsSiteManagementEnabled__c": "Checkbox",
          "DefaultSearchConfig__c": "Text",
          "IsSummarizationEnabled__c": "Checkbox",
          "IsAgentforceEnabled__c": "Checkbox"
        },
        "description": "Controls Site Management feature enablement including search configuration, AI-powered summarization for sites and investigators, and Agentforce-powered site selection assistance."
      }
    ]
  },
  "advanced_therapy": {
    "objects": [
      {
        "name": "WorkProcedure",
        "type": "standard",
        "domain": "advanced_therapy",
        "description": "Represents an overall therapy process such as Cell and Gene Therapy. Stores the procedure name, description, reference to a care program, lead time configuration, and the associated orchestration flow API name. Work procedures contain multiple work procedure steps that define the sequence of therapy stages.",
        "fields": [
          {
            "name": "WorkProcedureName",
            "type": "Text",
            "description": "Name of the work procedure such as Cell and Gene Therapy"
          },
          {
            "name": "Description",
            "type": "TextArea",
            "description": "Detailed description of the therapy procedure"
          },
          {
            "name": "ReferenceRecordId",
            "type": "Lookup",
            "description": "The care program or other record this procedure is associated with"
          },
          {
            "name": "LeadTimeUnitType",
            "type": "Picklist",
            "description": "Default unit for lead time: Hours, Days, or Minutes"
          },
          {
            "name": "AssociatedFlowOrchestratorName",
            "type": "Text",
            "description": "API name of the orchestration flow for this procedure"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether this work procedure is currently active"
          }
        ],
        "relationships": [
          {
            "target": "CareProgram",
            "type": "lookup",
            "description": "Links to the care program this therapy is part of"
          },
          {
            "target": "WorkProcedureStep",
            "type": "parent",
            "description": "Procedure contains sequential therapy steps"
          }
        ]
      },
      {
        "name": "WorkType",
        "type": "standard",
        "domain": "advanced_therapy",
        "description": "Represents a specific type of work to be performed as part of a therapy, such as Apheresis or Infusion. Stores the estimated duration, operating hours, and serves as a template for pending tasks. Work types are linked to service territories where they are performed.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the work type such as Apheresis CGT"
          },
          {
            "name": "Description",
            "type": "TextArea",
            "description": "Description of this therapy step"
          },
          {
            "name": "EstimatedDuration",
            "type": "Number",
            "description": "Expected duration of this work type"
          },
          {
            "name": "DurationType",
            "type": "Picklist",
            "description": "Unit of duration: Hours, Days, or Minutes"
          },
          {
            "name": "OperatingHoursId",
            "type": "Lookup",
            "description": "Operating hours during which this work type is available"
          }
        ],
        "relationships": [
          {
            "target": "OperatingHours",
            "type": "lookup",
            "description": "Links to the operating hours for this work type"
          },
          {
            "target": "WorkProcedureStep",
            "type": "child",
            "description": "Work type can be part of multiple work procedures"
          },
          {
            "target": "ServiceTerritoryWorkType",
            "type": "child",
            "description": "Work type performed at specific service territories"
          }
        ]
      },
      {
        "name": "WorkProcedureStep",
        "type": "standard",
        "domain": "advanced_therapy",
        "description": "Links a work type to a work procedure, defining the sequence and lead time for each therapy stage. Stores the sequence number that determines the order of steps and the lead time required before this step can begin after the previous step completes.",
        "fields": [
          {
            "name": "WorkTypeId",
            "type": "Lookup",
            "description": "The work type this step represents"
          },
          {
            "name": "WorkProcedureId",
            "type": "Lookup",
            "description": "The work procedure this step belongs to"
          },
          {
            "name": "SequenceNumber",
            "type": "Number",
            "description": "Order of this step within the procedure"
          },
          {
            "name": "LeadTime",
            "type": "Number",
            "description": "Time required before this step can begin"
          },
          {
            "name": "LeadTimeUnitType",
            "type": "Picklist",
            "description": "Unit for lead time, overrides procedure default if set"
          }
        ],
        "relationships": [
          {
            "target": "WorkProcedure",
            "type": "lookup",
            "description": "Links to the parent work procedure"
          },
          {
            "target": "WorkType",
            "type": "lookup",
            "description": "Links to the work type representing this therapy stage"
          }
        ]
      },
      {
        "name": "ServiceTerritory",
        "type": "standard",
        "domain": "advanced_therapy",
        "description": "Represents a location where therapy work is performed, such as an apheresis center, manufacturing lab, or infusion center. Parent service territories represent the overall organization, while child territories represent specific locations for individual work procedure steps.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the service territory such as Apheresis Center"
          },
          {
            "name": "ParentTerritoryId",
            "type": "Lookup",
            "description": "Parent service territory for the overall work procedure"
          },
          {
            "name": "OperatingHoursId",
            "type": "Lookup",
            "description": "Operating hours for this territory"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether this service territory is currently active"
          }
        ],
        "relationships": [
          {
            "target": "ServiceTerritory",
            "type": "lookup",
            "description": "Child territories reference parent territory for hierarchy"
          },
          {
            "target": "ServiceTerritoryMember",
            "type": "parent",
            "description": "Territory has assigned service resources as members"
          },
          {
            "target": "ServiceTerritoryRelationship",
            "type": "parent",
            "description": "Territory has site-to-site relationships for consecutive steps"
          }
        ]
      },
      {
        "name": "ServiceTerritoryRelationship",
        "type": "standard",
        "domain": "advanced_therapy",
        "description": "Defines site-to-site relationships between service territories for consecutive work procedure steps. Establishes that when a work type is performed at one territory, the next work type should be at a related territory, enabling optimized slot search across the therapy chain.",
        "fields": [
          {
            "name": "ServiceTerritoryId",
            "type": "Lookup",
            "description": "The source service territory"
          },
          {
            "name": "WorkTypeId",
            "type": "Lookup",
            "description": "The work type performed at the source territory"
          },
          {
            "name": "RelatedServiceTerritoryId",
            "type": "Lookup",
            "description": "The destination territory for the next work type"
          }
        ],
        "relationships": [
          {
            "target": "ServiceTerritory",
            "type": "lookup",
            "description": "Source territory in the relationship"
          },
          {
            "target": "ServiceTerritory",
            "type": "lookup",
            "description": "Related territory for the next step"
          },
          {
            "target": "WorkType",
            "type": "lookup",
            "description": "Work type that links the two territories"
          }
        ]
      },
      {
        "name": "ServiceAppointmentGroup",
        "type": "standard",
        "domain": "advanced_therapy",
        "description": "Groups all service appointments for a complete therapy chain. Tracks the overall status of the appointment series including Awaiting Approval, Scheduled, Rescheduled, and Canceled. Only one active group exists at a time per care program enrollee.",
        "fields": [
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Status: Awaiting Approval, Scheduled, Rescheduled, or Canceled"
          },
          {
            "name": "CareProgramEnrolleeId",
            "type": "Lookup",
            "description": "The care program enrollee this appointment group is for"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether this is the currently active appointment group"
          }
        ],
        "relationships": [
          {
            "target": "CareProgramEnrollee",
            "type": "lookup",
            "description": "Links to the patient enrollee"
          },
          {
            "target": "ServiceAppointment",
            "type": "parent",
            "description": "Group contains individual therapy step appointments"
          }
        ]
      },
      {
        "name": "CareProgramEnrolleeWorkOrder",
        "type": "standard",
        "domain": "advanced_therapy",
        "description": "Runtime record generated by therapy orchestration flows representing a therapy stage for a care program enrollee. Tracks the status of stages like apheresis, manufacturing, or infusion as they are initiated, progressed, and completed during the orchestration workflow.",
        "fields": [
          {
            "name": "CareProgramEnrolleeId",
            "type": "Lookup",
            "description": "The enrollee this work order is for"
          },
          {
            "name": "WorkProcedureStepId",
            "type": "Lookup",
            "description": "The work procedure step this stage represents"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Status: Not Started, In Progress, or Completed"
          },
          {
            "name": "StartDate",
            "type": "DateTime",
            "description": "When this therapy stage was initiated"
          }
        ],
        "relationships": [
          {
            "target": "CareProgramEnrollee",
            "type": "lookup",
            "description": "Links to the patient enrollee"
          },
          {
            "target": "WorkProcedureStep",
            "type": "lookup",
            "description": "Links to the therapy stage definition"
          },
          {
            "target": "CareProgramEnrolleeWorkOrderStep",
            "type": "parent",
            "description": "Work order contains substage step records"
          }
        ]
      },
      {
        "name": "CareProgramEnrolleeWorkOrderStep",
        "type": "standard",
        "domain": "advanced_therapy",
        "description": "Runtime record generated by therapy orchestration representing a substage within a therapy stage. Created by the Create Care Program Enrollee Work Order Step invocable action, which also generates assessment tasks based on action plan templates and assigns them to care team members.",
        "fields": [
          {
            "name": "CareProgramEnrolleeWorkOrderId",
            "type": "Lookup",
            "description": "The parent work order this step belongs to"
          },
          {
            "name": "WorkTypeStepId",
            "type": "Lookup",
            "description": "The work type step definition for this substage"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Status: Not Started, In Progress, or Completed"
          },
          {
            "name": "SequenceNumber",
            "type": "Number",
            "description": "Order of this substage within the stage"
          }
        ],
        "relationships": [
          {
            "target": "CareProgramEnrolleeWorkOrder",
            "type": "lookup",
            "description": "Links to the parent therapy stage work order"
          },
          {
            "target": "WorkTypeStep",
            "type": "lookup",
            "description": "Links to the substage definition"
          },
          {
            "target": "AssessmentTask",
            "type": "parent",
            "description": "Step generates assessment tasks for stakeholders"
          }
        ]
      }
    ],
    "metadata": [
      {
        "type": "MultiStepSchedulingSettings__mdt",
        "name": "Multi-Step Scheduling Settings",
        "fields": {
          "IsSchedulerEnabled__c": "Checkbox",
          "MaxWorkTypes__c": "Number",
          "MaxLocationsPerWorkType__c": "Number",
          "UseShiftsForAvailability__c": "Checkbox",
          "UseOperatingHoursWithShifts__c": "Checkbox"
        },
        "description": "Controls Multi-Step Scheduling configuration including Salesforce Scheduler enablement, maximum work types per procedure, location limits per search, and shift versus operating hours availability settings."
      }
    ]
  },
  "care_programs": {
    "objects": [
      {
        "name": "CareProgram",
        "type": "standard",
        "domain": "care_programs",
        "description": "Represents a structured set of activities such as patient therapy, financial assistance, education, wellness, or fitness plans offered to participants by an employer, insurer, or pharmaceutical manufacturer. Each care program defines the program scope, timeline, status, and optional parent-child hierarchy for nested program structures.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Display name of the care program"
          },
          {
            "name": "StartDate",
            "type": "Date",
            "description": "Date when the care program begins accepting enrollees"
          },
          {
            "name": "EndDate",
            "type": "Date",
            "description": "Date when the care program stops accepting new enrollees"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current lifecycle status of the care program such as Active, Inactive, or Completed"
          },
          {
            "name": "Category",
            "type": "Picklist",
            "description": "Program category such as Advanced Therapy that determines available features"
          },
          {
            "name": "Description",
            "type": "LongTextArea",
            "description": "Detailed description of the care program objectives and scope"
          }
        ],
        "relationships": [
          {
            "target": "CareProgram",
            "type": "lookup",
            "description": "Parent program for nested care program hierarchies"
          },
          {
            "target": "CareProgramEnrollee",
            "type": "parent",
            "description": "Participants enrolled in this care program"
          },
          {
            "target": "CareProgramProduct",
            "type": "parent",
            "description": "Products associated with this care program"
          }
        ]
      },
      {
        "name": "CareProgramEnrollee",
        "type": "standard",
        "domain": "care_programs",
        "description": "Represents a patient or participant enrolled in a care program. Tracks enrollment details including the associated account, enrollment location, opt-out status, and whether the patient was at a long-term healthcare facility during enrollment. Supports multiple enrollments in the same program when configured.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Enrollee display name, typically auto-generated"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "Patient account associated with this enrollment"
          },
          {
            "name": "CareProgramId",
            "type": "Lookup",
            "description": "Care program this enrollee is enrolled in"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Enrollment status such as Active, Inactive, or Withdrawn"
          },
          {
            "name": "EnrollmentDate",
            "type": "Date",
            "description": "Date when the participant was enrolled in the care program"
          },
          {
            "name": "OptOutDate",
            "type": "Date",
            "description": "Date when the enrollee opted out of the care program"
          },
          {
            "name": "OptOutReason",
            "type": "Text",
            "description": "Reason the enrollee opted out of the care program"
          }
        ],
        "relationships": [
          {
            "target": "CareProgram",
            "type": "child",
            "description": "The care program this enrollee participates in"
          },
          {
            "target": "Account",
            "type": "lookup",
            "description": "Patient account record for this enrollee"
          },
          {
            "target": "CareProgramEnrolleeProduct",
            "type": "parent",
            "description": "Products and providers associated with this enrollee"
          }
        ]
      },
      {
        "name": "CareProgramProduct",
        "type": "standard",
        "domain": "care_programs",
        "description": "Represents the association between a care program and a specific product such as a medication or medical device. Links products to care programs so enrollees can be associated with specific treatments or offerings during the enrollment process.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Display name for this care program product association"
          },
          {
            "name": "CareProgramId",
            "type": "Lookup",
            "description": "Care program this product is associated with"
          },
          {
            "name": "ProductId",
            "type": "Lookup",
            "description": "Product record representing the medication or device"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Status of this care program product association"
          }
        ],
        "relationships": [
          {
            "target": "CareProgram",
            "type": "child",
            "description": "The care program this product belongs to"
          },
          {
            "target": "Product2",
            "type": "lookup",
            "description": "The product offered through this care program"
          }
        ]
      },
      {
        "name": "CareProgramProvider",
        "type": "standard",
        "domain": "care_programs",
        "description": "Represents the association between a care program and a healthcare provider or facility that delivers services under the program. Links provider accounts to specific care program products and tracks the provider's role and status within the program.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Display name for this provider association"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "Account representing the provider organization"
          },
          {
            "name": "CareProgramProductId",
            "type": "Lookup",
            "description": "Care program product this provider delivers"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Provider status within the care program"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "Provider organization account"
          },
          {
            "target": "CareProgramProduct",
            "type": "lookup",
            "description": "Care program product this provider is associated with"
          },
          {
            "target": "CareProgramHealthcareProvider",
            "type": "parent",
            "description": "Individual practitioners associated with this provider"
          }
        ]
      },
      {
        "name": "CareProgramGoal",
        "type": "standard",
        "domain": "care_programs",
        "description": "Represents a measurable goal associated with a care program, such as reducing sugar intake or achieving specific health metric targets. Goals have defined timelines and status tracking to monitor progress toward program objectives.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Goal name such as Reduce Sugar Intake"
          },
          {
            "name": "CareProgramId",
            "type": "Lookup",
            "description": "Care program this goal belongs to"
          },
          {
            "name": "StartDate",
            "type": "Date",
            "description": "Start date for tracking this goal"
          },
          {
            "name": "EndDate",
            "type": "Date",
            "description": "Target date for achieving this goal"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Current status of the goal"
          }
        ],
        "relationships": [
          {
            "target": "CareProgram",
            "type": "child",
            "description": "The care program this goal is defined for"
          }
        ]
      },
      {
        "name": "ApplicationForm",
        "type": "standard",
        "domain": "care_programs",
        "description": "Represents a financial assistance application submitted on behalf of a care program enrollee. Tracks the application through eligibility evaluation, benefit assignment, and potential appeal workflows when applications are rejected.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Application identifier or display name"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Application status such as Submitted, Approved, or Rejected"
          },
          {
            "name": "ApplicantId",
            "type": "Lookup",
            "description": "The applicant record associated with this application"
          },
          {
            "name": "ProgramId",
            "type": "Lookup",
            "description": "The financial assistance program applied to"
          }
        ],
        "relationships": [
          {
            "target": "Applicant",
            "type": "lookup",
            "description": "The individual applying for financial assistance"
          },
          {
            "target": "Program",
            "type": "lookup",
            "description": "The financial assistance program this application targets"
          },
          {
            "target": "ApplicationFormRelation",
            "type": "parent",
            "description": "Relationships between the application and associated records"
          }
        ]
      },
      {
        "name": "BenefitAssignment",
        "type": "standard",
        "domain": "care_programs",
        "description": "Represents the enrollment and benefit allocation for an individual approved through a financial assistance program. Captures the specific benefits assigned after the application passes eligibility criteria, linking the enrollee to their approved program benefits.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Benefit assignment identifier"
          },
          {
            "name": "ApplicationFormId",
            "type": "Lookup",
            "description": "The approved application that generated this benefit assignment"
          },
          {
            "name": "BenefitId",
            "type": "Lookup",
            "description": "The specific benefit being assigned"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Assignment status such as Active or Expired"
          }
        ],
        "relationships": [
          {
            "target": "ApplicationForm",
            "type": "lookup",
            "description": "The application that resulted in this benefit assignment"
          },
          {
            "target": "Benefit",
            "type": "lookup",
            "description": "The benefit record being assigned to the enrollee"
          },
          {
            "target": "BenefitDisbursement",
            "type": "parent",
            "description": "Disbursement records for this benefit assignment"
          }
        ]
      },
      {
        "name": "BenefitDisbursement",
        "type": "standard",
        "domain": "care_programs",
        "description": "Represents the allocation of an enrollee's benefit that can be monetary or non-monetary with different frequencies. Tracks copay coupon redemptions, reimbursement payments, and other benefit distributions made under a financial assistance program.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Disbursement identifier"
          },
          {
            "name": "BenefitAssignmentId",
            "type": "Lookup",
            "description": "The benefit assignment this disbursement fulfills"
          },
          {
            "name": "Amount",
            "type": "Currency",
            "description": "Monetary value of the disbursement"
          },
          {
            "name": "DisbursementDate",
            "type": "Date",
            "description": "Date when the benefit was disbursed"
          },
          {
            "name": "Type",
            "type": "Picklist",
            "description": "Type of disbursement such as Copay Coupon or Reimbursement"
          }
        ],
        "relationships": [
          {
            "target": "BenefitAssignment",
            "type": "child",
            "description": "The benefit assignment this disbursement belongs to"
          }
        ]
      },
      {
        "name": "AuthorizationForm",
        "type": "standard",
        "domain": "care_programs",
        "description": "Represents a consent form used in care program enrollment. Contains the form's revision number, effective dates, and whether a signature is required. Multiple text versions can be created for different languages and locales.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Name of the authorization form"
          },
          {
            "name": "RevisionNumber",
            "type": "Text",
            "description": "Version or revision number of the form"
          },
          {
            "name": "EffectiveDate",
            "type": "Date",
            "description": "Date when this form version becomes effective"
          },
          {
            "name": "IsSignatureRequired",
            "type": "Checkbox",
            "description": "Whether participant must sign this form"
          },
          {
            "name": "DefaultAuthFormTextId",
            "type": "Lookup",
            "description": "Default text version used when locale-specific text is unavailable"
          }
        ],
        "relationships": [
          {
            "target": "AuthorizationFormText",
            "type": "parent",
            "description": "Text versions of this form for different languages"
          },
          {
            "target": "AuthorizationFormConsent",
            "type": "parent",
            "description": "Consent records captured for this form"
          }
        ]
      }
    ],
    "metadata": [
      {
        "type": "CareProgramEligibilityRule__mdt",
        "name": "Care Program Eligibility Rules",
        "fields": {
          "CareProgramId__c": "Lookup",
          "CriteriaField__c": "Text",
          "CriteriaValue__c": "Text",
          "IsActive__c": "Checkbox"
        },
        "description": "Defines eligibility criteria that determine which participants qualify for enrollment in specific care programs"
      },
      {
        "type": "CareSystemFieldMapping__mdt",
        "name": "Care System Field Mapping",
        "fields": {
          "SourceSystem__c": "Text",
          "TargetObject__c": "Text",
          "ExternalIdField__c": "Text",
          "Role__c": "Text",
          "IsActive__c": "Checkbox"
        },
        "description": "Maps external system fields to Salesforce target entities and attributes for the Care Program Enrollments API"
      }
    ]
  },
  "pharmacy_benefits": {
    "objects": [
      {
        "name": "CareBenefitVerifyRequest",
        "type": "standard",
        "domain": "pharmacy_benefits",
        "description": "Represents a request for verification of pharmacy benefits. Each request is created for a single member plan and includes patient, practitioner, drug, and pharmacy information. Supports both electronic requests sent to clearinghouses via MuleSoft and manual requests where reps contact payers directly.",
        "fields": [
          {
            "name": "Name",
            "type": "AutoNumber",
            "description": "Auto-generated request identifier"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Request status such as Pending, Verified, Partial, Error, or Timed Out"
          },
          {
            "name": "StatusReason",
            "type": "Text",
            "description": "Reason for the current status value"
          },
          {
            "name": "RequestDate",
            "type": "DateTime",
            "description": "Date and time when the verification request was submitted"
          },
          {
            "name": "PrescriberId",
            "type": "Lookup",
            "description": "Healthcare provider who prescribed the medication"
          },
          {
            "name": "ProviderId",
            "type": "Lookup",
            "description": "Healthcare provider organization associated with the request"
          },
          {
            "name": "CoverageBenefitId",
            "type": "Lookup",
            "description": "Coverage benefit record linked to this request"
          },
          {
            "name": "AuthorizedPrescription",
            "type": "Checkbox",
            "description": "Whether the prescription has been authorized"
          }
        ],
        "relationships": [
          {
            "target": "CoverageBenefit",
            "type": "parent",
            "description": "Coverage benefit response linked to this request"
          },
          {
            "target": "HealthcareProvider",
            "type": "lookup",
            "description": "The prescribing or providing healthcare professional"
          },
          {
            "target": "MemberPlan",
            "type": "lookup",
            "description": "Insurance plan being verified for coverage"
          }
        ]
      },
      {
        "name": "CoverageBenefit",
        "type": "standard",
        "domain": "pharmacy_benefits",
        "description": "Represents the pharmacy benefits provided to a patient covered by a purchaser's plan. Stores the verification response including coverage status, final coverage status code, and links to the detailed benefit items that break down copay, coinsurance, and deductible information.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Coverage benefit identifier"
          },
          {
            "name": "CareBenefitVerifyRequestId",
            "type": "Lookup",
            "description": "The verification request that produced this coverage benefit"
          },
          {
            "name": "FinalCoverageStatusCode",
            "type": "Text",
            "description": "Final status code indicating covered, not covered, or covered with restrictions"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Coverage status of this benefit"
          }
        ],
        "relationships": [
          {
            "target": "CareBenefitVerifyRequest",
            "type": "child",
            "description": "The verification request this benefit responds to"
          },
          {
            "target": "CoverageBenefitItem",
            "type": "parent",
            "description": "Specific services and coverage details under this benefit"
          }
        ]
      },
      {
        "name": "CoverageBenefitItem",
        "type": "standard",
        "domain": "pharmacy_benefits",
        "description": "Represents a specific service covered by the insurance plan under a coverage benefit. Each item details a particular type of coverage such as prescription fills or infusion therapy, with associated limits that define copay amounts, deductible thresholds, and out-of-pocket maximums.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Coverage benefit item identifier"
          },
          {
            "name": "CoverageBenefitId",
            "type": "Lookup",
            "description": "Parent coverage benefit this item belongs to"
          },
          {
            "name": "ServiceType",
            "type": "Picklist",
            "description": "Type of service this item covers"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Active or inactive status of this coverage item"
          }
        ],
        "relationships": [
          {
            "target": "CoverageBenefit",
            "type": "child",
            "description": "The parent coverage benefit"
          },
          {
            "target": "CoverageBenefitItemLimit",
            "type": "parent",
            "description": "Limits and expenditure thresholds for this coverage item"
          }
        ]
      },
      {
        "name": "CoverageBenefitItemLimit",
        "type": "standard",
        "domain": "pharmacy_benefits",
        "description": "Tracks details associated with a specific benefit as it relates to expenditures, limits, coverage levels, eligibility, and exclusions. Records copay amounts, coinsurance percentages, deductible thresholds, out-of-pocket maximums, and lifetime limits for pharmacy coverage.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Limit identifier"
          },
          {
            "name": "CoverageBenefitItemId",
            "type": "Lookup",
            "description": "The coverage benefit item this limit applies to"
          },
          {
            "name": "CareLimitTypeId",
            "type": "Lookup",
            "description": "The type of limit such as copay, coinsurance, or deductible"
          },
          {
            "name": "AppliedLimit",
            "type": "Currency",
            "description": "The monetary amount or percentage for this limit"
          }
        ],
        "relationships": [
          {
            "target": "CoverageBenefitItem",
            "type": "child",
            "description": "The coverage item this limit restricts"
          },
          {
            "target": "CareLimitType",
            "type": "lookup",
            "description": "The category of limit being applied"
          }
        ]
      },
      {
        "name": "MemberPlan",
        "type": "standard",
        "domain": "pharmacy_benefits",
        "description": "Represents the details of insurance coverage for a member or subscriber. Stores plan information including the payer, coverage type, effective dates, and member identifiers. Each verification request is associated with a specific member plan to determine which insurance coverage is being checked.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Member plan display name"
          },
          {
            "name": "MemberId",
            "type": "Text",
            "description": "Insurance member identifier"
          },
          {
            "name": "PurchaserPlanId",
            "type": "Lookup",
            "description": "The payer plan this member is enrolled in"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "Patient account associated with this member plan"
          },
          {
            "name": "EffectiveDate",
            "type": "Date",
            "description": "Date when coverage begins"
          },
          {
            "name": "TerminationDate",
            "type": "Date",
            "description": "Date when coverage ends"
          }
        ],
        "relationships": [
          {
            "target": "PurchaserPlan",
            "type": "child",
            "description": "The payer plan that provides this coverage"
          },
          {
            "target": "Account",
            "type": "lookup",
            "description": "The patient account holding this member plan"
          }
        ]
      },
      {
        "name": "PurchaserPlan",
        "type": "standard",
        "domain": "pharmacy_benefits",
        "description": "Represents the payer plan that a purchaser makes available to its members and members' dependents. Stores plan-level details including the insurance organization, plan type, formulary information, and network configuration used during benefits verification.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Plan display name"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "Insurance company account that offers this plan"
          },
          {
            "name": "PlanType",
            "type": "Picklist",
            "description": "Type of plan such as HMO, PPO, or POS"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Plan status such as Active or Inactive"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "Insurance organization offering this plan"
          },
          {
            "target": "MemberPlan",
            "type": "parent",
            "description": "Individual member enrollments in this plan"
          }
        ]
      },
      {
        "name": "Medication",
        "type": "standard",
        "domain": "pharmacy_benefits",
        "description": "Represents detailed information about a medication including drug name, manufacturer, dosage form, and strength. Used in pharmacy benefits verification to identify the specific drug being verified for coverage and to link prescriptions to their formulary status.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Medication name"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Active or inactive status"
          },
          {
            "name": "DosageForm",
            "type": "Picklist",
            "description": "Form of the medication such as tablet, capsule, or injection"
          },
          {
            "name": "Strength",
            "type": "Text",
            "description": "Medication strength such as 10mg or 100ml"
          }
        ],
        "relationships": [
          {
            "target": "MedicationRequest",
            "type": "parent",
            "description": "Prescription requests for this medication"
          }
        ]
      },
      {
        "name": "MedicationRequest",
        "type": "standard",
        "domain": "pharmacy_benefits",
        "description": "Represents a request or order for the supply of a medication, along with information about how it should be administered. Captures fill duration, fill quantity, and initial fill details used during pharmacy benefits verification.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Medication request identifier"
          },
          {
            "name": "MedicationId",
            "type": "Lookup",
            "description": "The medication being requested"
          },
          {
            "name": "FillDurationUnit",
            "type": "Picklist",
            "description": "Unit of measure for the fill duration"
          },
          {
            "name": "FillQuantityUnit",
            "type": "Picklist",
            "description": "Unit of measure for the fill quantity"
          },
          {
            "name": "InitialFillDuration",
            "type": "Number",
            "description": "Duration for the initial medication fill"
          },
          {
            "name": "InitialFillQuantity",
            "type": "Number",
            "description": "Quantity for the initial medication fill"
          }
        ],
        "relationships": [
          {
            "target": "Medication",
            "type": "child",
            "description": "The medication this request is for"
          },
          {
            "target": "CareBenefitVerifyRequest",
            "type": "lookup",
            "description": "Benefits verification request referencing this prescription"
          }
        ]
      },
      {
        "name": "CodeSet",
        "type": "standard",
        "domain": "pharmacy_benefits",
        "description": "Represents standardized life sciences codes in the context of their systems and versions. Code sets define metrics that explain pharmacy benefits coverage status codes such as covered, not covered, or covered with restrictions, aligned with FHIR-CARIN and NCPDP standards.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Code set name"
          },
          {
            "name": "CodeSystem",
            "type": "Text",
            "description": "The coding system this set belongs to"
          },
          {
            "name": "Version",
            "type": "Text",
            "description": "Version of the code system"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Active or inactive status"
          }
        ],
        "relationships": [
          {
            "target": "CoverageBenefit",
            "type": "lookup",
            "description": "Coverage benefits that reference codes from this set"
          }
        ]
      }
    ],
    "metadata": [
      {
        "type": "CareLimitType__mdt",
        "name": "Care Limit Type",
        "fields": {
          "Name__c": "Text",
          "LimitType__c": "Text",
          "Description__c": "LongTextArea"
        },
        "description": "Defines limit types such as copay, coinsurance, deductibles, out-of-pocket max, and lifetime max used in pharmacy benefits verification responses"
      }
    ]
  },
  "medtech": {
    "objects": [
      {
        "name": "SalesAgreement",
        "type": "standard",
        "domain": "medtech",
        "description": "Represents an account-level volume and price agreement for medical device products. Includes multiple products within a single agreement with planned sales quantities, prices, and discounts. Supports schedule frequencies such as one-time, monthly, quarterly, or yearly, enabling compliance monitoring by comparing planned to actual quantities.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Sales agreement name"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "Customer account this agreement is with"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Agreement status such as Draft, Active, or Expired"
          },
          {
            "name": "StartDate",
            "type": "Date",
            "description": "Date when the agreement becomes effective"
          },
          {
            "name": "EndDate",
            "type": "Date",
            "description": "Date when the agreement expires"
          },
          {
            "name": "ScheduleFrequency",
            "type": "Picklist",
            "description": "Schedule frequency such as Monthly, Quarterly, or Yearly"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "Customer account for this sales agreement"
          },
          {
            "target": "SalesAgreementProduct",
            "type": "parent",
            "description": "Products and planned quantities in this agreement"
          }
        ]
      },
      {
        "name": "Visit",
        "type": "standard",
        "domain": "medtech",
        "description": "Represents a visit created by sales teams to fulfill product orders from accounts or perform cycle counts at inventory locations. The visit is the central object in the Intelligent Sales data model, linking visitors, visited parties, visit tasks, and required products. Supports both surgical case visits and cycle count visits determined by work type.",
        "fields": [
          {
            "name": "PlannedVisitStartTime",
            "type": "DateTime",
            "description": "Scheduled start time for the visit"
          },
          {
            "name": "PlannedVisitEndTime",
            "type": "DateTime",
            "description": "Scheduled end time for the visit"
          },
          {
            "name": "ActualVisitStartTime",
            "type": "DateTime",
            "description": "Actual time the visit began"
          },
          {
            "name": "ActualVisitEndTime",
            "type": "DateTime",
            "description": "Actual time the visit ended"
          },
          {
            "name": "VisitorId",
            "type": "Lookup",
            "description": "Primary sales rep assigned to this visit"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "Account being visited"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Visit status such as Planned, In Progress, or Completed"
          },
          {
            "name": "WorkTypeId",
            "type": "Lookup",
            "description": "Work type that determines if this is a surgical case or cycle count visit"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "The hospital or provider account being visited"
          },
          {
            "target": "WorkType",
            "type": "lookup",
            "description": "Determines the visit type and duration properties"
          },
          {
            "target": "Visitor",
            "type": "parent",
            "description": "Sales reps assigned to this visit"
          },
          {
            "target": "ProductRequired",
            "type": "parent",
            "description": "Products required for this visit"
          }
        ]
      },
      {
        "name": "ProductItem",
        "type": "standard",
        "domain": "medtech",
        "description": "Represents a combination of a product, the location of its inventory, and the quantity available at that location. For serialized products, the initial quantity is zero and automatically increments as serialized product records are associated. Provides the foundation for inventory tracking and cycle count verification.",
        "fields": [
          {
            "name": "Product2Id",
            "type": "Lookup",
            "description": "The product this inventory record is for"
          },
          {
            "name": "LocationId",
            "type": "Lookup",
            "description": "Location where this inventory is stored"
          },
          {
            "name": "QuantityOnHand",
            "type": "Number",
            "description": "Current quantity available at this location"
          },
          {
            "name": "QuantityUnitOfMeasure",
            "type": "Picklist",
            "description": "Unit of measure for the quantity"
          }
        ],
        "relationships": [
          {
            "target": "Product2",
            "type": "lookup",
            "description": "The product being tracked"
          },
          {
            "target": "Location",
            "type": "lookup",
            "description": "The inventory location"
          },
          {
            "target": "SerializedProduct",
            "type": "parent",
            "description": "Individual serialized units at this location"
          }
        ]
      },
      {
        "name": "ProductFulfillmentLocation",
        "type": "standard",
        "domain": "medtech",
        "description": "A junction record that ties a sales rep to an inventory, an account, and an account location. Combines a product, the ordering account, the account location, the fulfillment inventory location, and the responsible sales rep. Determines which inventories fulfill orders for specific account and product combinations.",
        "fields": [
          {
            "name": "ProductId",
            "type": "Lookup",
            "description": "The product being fulfilled"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "The account that orders this product"
          },
          {
            "name": "FulfillmentLocationId",
            "type": "Lookup",
            "description": "Location of the fulfilling inventory"
          },
          {
            "name": "AccountLocationId",
            "type": "Lookup",
            "description": "Location of the ordering account"
          },
          {
            "name": "ResponsibleUserId",
            "type": "Lookup",
            "description": "Sales rep responsible for this fulfillment path"
          }
        ],
        "relationships": [
          {
            "target": "Product2",
            "type": "lookup",
            "description": "Product being fulfilled"
          },
          {
            "target": "Account",
            "type": "lookup",
            "description": "Account placing orders"
          },
          {
            "target": "Location",
            "type": "lookup",
            "description": "Inventory and account locations"
          }
        ]
      },
      {
        "name": "ProductTransfer",
        "type": "standard",
        "domain": "medtech",
        "description": "Represents a product transfer requested by sales reps when they have inventory shortfalls for upcoming visits. Captures the source and destination locations, products being transferred, and quantities. Created through the request transfer flow when product availability projections indicate a shortfall.",
        "fields": [
          {
            "name": "SourceLocationId",
            "type": "Lookup",
            "description": "Location transferring the product"
          },
          {
            "name": "DestinationLocationId",
            "type": "Lookup",
            "description": "Location receiving the transferred product"
          },
          {
            "name": "Product2Id",
            "type": "Lookup",
            "description": "Product being transferred"
          },
          {
            "name": "QuantityTransferred",
            "type": "Number",
            "description": "Number of units being transferred"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Transfer status such as Requested, In Transit, or Completed"
          }
        ],
        "relationships": [
          {
            "target": "Location",
            "type": "lookup",
            "description": "Source and destination inventory locations"
          },
          {
            "target": "Product2",
            "type": "lookup",
            "description": "Product being transferred between locations"
          },
          {
            "target": "ProductRequestLineItem",
            "type": "child",
            "description": "Line items linking transfer to the originating request"
          }
        ]
      },
      {
        "name": "SerializedProduct",
        "type": "standard",
        "domain": "medtech",
        "description": "Represents the serial number of an individual product unit and the product item record it is associated with. Each new serialized product associated with a product item automatically increases the product item quantity by one. Supports barcode scanning during cycle counts for efficient inventory verification.",
        "fields": [
          {
            "name": "SerialNumber",
            "type": "Text",
            "description": "Unique serial number for this product unit"
          },
          {
            "name": "ProductItemId",
            "type": "Lookup",
            "description": "Product item record this serial number is associated with"
          },
          {
            "name": "Product2Id",
            "type": "Lookup",
            "description": "The product this serialized unit represents"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Status such as Active, Returned, or Lost"
          }
        ],
        "relationships": [
          {
            "target": "ProductItem",
            "type": "child",
            "description": "The product item inventory record this serial belongs to"
          },
          {
            "target": "Product2",
            "type": "lookup",
            "description": "The product type this serial number represents"
          }
        ]
      },
      {
        "name": "ProductAvailabilityProjection",
        "type": "standard",
        "domain": "medtech",
        "description": "Stores projected availability of products related to upcoming visits and transfer requests. Data is managed automatically by the system and provides sales reps with forward-looking visibility into potential inventory shortfalls and their estimated revenue impact.",
        "fields": [
          {
            "name": "ProductId",
            "type": "Lookup",
            "description": "Product being projected"
          },
          {
            "name": "LocationId",
            "type": "Lookup",
            "description": "Inventory location for the projection"
          },
          {
            "name": "ProjectedQuantity",
            "type": "Number",
            "description": "Projected available quantity"
          },
          {
            "name": "VisitId",
            "type": "Lookup",
            "description": "Visit that may impact availability"
          }
        ],
        "relationships": [
          {
            "target": "Product2",
            "type": "lookup",
            "description": "Product being projected for availability"
          },
          {
            "target": "Visit",
            "type": "lookup",
            "description": "Visit that influences this projection"
          },
          {
            "target": "Location",
            "type": "lookup",
            "description": "Inventory location for this projection"
          }
        ]
      },
      {
        "name": "GenericVisitTask",
        "type": "standard",
        "domain": "medtech",
        "description": "Represents a cycle count or visit task definition record for a specific product. Acts as a template that the system uses to create instance records for specific visits. At execution time, instance records are automatically created based on the definition record and associated with the visit.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Task definition name"
          },
          {
            "name": "TaskType",
            "type": "Picklist",
            "description": "Type of task such as Cycle Count or Order Authorization"
          },
          {
            "name": "IsRequired",
            "type": "Checkbox",
            "description": "Whether this task must be completed before ending the visit"
          },
          {
            "name": "ActionPlanTemplateId",
            "type": "Lookup",
            "description": "Action plan template this task belongs to"
          }
        ],
        "relationships": [
          {
            "target": "ActionPlanTemplate",
            "type": "lookup",
            "description": "Template that includes this task definition"
          },
          {
            "target": "GenericVisitTaskContext",
            "type": "parent",
            "description": "Product contexts associated with this task"
          }
        ]
      }
    ],
    "metadata": [
      {
        "type": "IntelligentSalesSettings__mdt",
        "name": "Intelligent Sales Settings",
        "fields": {
          "IsEnabled__c": "Checkbox",
          "VisitInventoryManagement__c": "Checkbox",
          "ExpiringProductsPage__c": "Checkbox",
          "CycleCountProductsPage__c": "Checkbox"
        },
        "description": "Controls Intelligent Sales feature enablement including visit inventory management, expiring products page, and cycle count products page for the mobile app"
      }
    ]
  },
  "agentforce": {
    "objects": [
      {
        "name": "CareBenefitVerifyRequest",
        "type": "standard",
        "domain": "agentforce",
        "description": "Used by the Pharmacy Benefits Reverification agent as the primary object for tracking benefits reverification workflows. Agent actions draft emails, summarize patient responses, and update verification request status and associated records through this object.",
        "fields": [
          {
            "name": "Name",
            "type": "AutoNumber",
            "description": "Auto-generated request identifier"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Request status updated by agent actions including Pending, Received Confirmation, Verified, or Error"
          },
          {
            "name": "RequestDate",
            "type": "DateTime",
            "description": "Date and time of the verification request"
          },
          {
            "name": "PrescriberId",
            "type": "Lookup",
            "description": "Healthcare provider who prescribed the medication"
          }
        ],
        "relationships": [
          {
            "target": "CoverageBenefit",
            "type": "parent",
            "description": "Coverage benefit records managed by the reverification agent"
          },
          {
            "target": "HealthcareProvider",
            "type": "lookup",
            "description": "Healthcare provider referenced in reverification emails"
          }
        ]
      },
      {
        "name": "CareProgramSite",
        "type": "standard",
        "domain": "agentforce",
        "description": "Represents a clinical trial site associated with a research study through the Site Selection Assistance agent. Study managers use Agentforce to search for and add sites to studies, summarize site information, and send feasibility assessments to site investigators.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Site name"
          },
          {
            "name": "ResearchStudyId",
            "type": "Lookup",
            "description": "Research study this site is associated with"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "Healthcare facility account for this site"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Site status such as Identified, Under Assessment, or Active"
          }
        ],
        "relationships": [
          {
            "target": "ResearchStudy",
            "type": "lookup",
            "description": "The research study this site may participate in"
          },
          {
            "target": "Account",
            "type": "lookup",
            "description": "Healthcare facility serving as the clinical trial site"
          }
        ]
      },
      {
        "name": "ResearchStudy",
        "type": "standard",
        "domain": "agentforce",
        "description": "Represents a clinical research study for which the Site Selection Assistance agent identifies suitable sites and investigators. Study managers use Agentforce to search, filter, summarize, and send feasibility assessments from the research study record page.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Research study name"
          },
          {
            "name": "Description",
            "type": "LongTextArea",
            "description": "Description of the research study objectives"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Study status such as Planning, Active, or Completed"
          },
          {
            "name": "Phase",
            "type": "Picklist",
            "description": "Clinical trial phase such as Phase I, II, III, or IV"
          }
        ],
        "relationships": [
          {
            "target": "CareProgramSite",
            "type": "parent",
            "description": "Sites associated with this research study"
          }
        ]
      }
    ],
    "metadata": []
  },
  "platform_extensions": {
    "objects": [
      {
        "name": "DigitalVerificationSetup",
        "type": "standard",
        "domain": "platform_extensions",
        "description": "Represents a signature trail configuration that sets the number of required electronic signatures and determines whether designated verifiers must sign in sequential or parallel order. Each setup is associated with a reference object and a record action type that triggers trail creation.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Signature trail name"
          },
          {
            "name": "ReferenceObjectApiName",
            "type": "Text",
            "description": "API name of the object this signature trail applies to"
          },
          {
            "name": "VerificationProcessType",
            "type": "Picklist",
            "description": "Sequential or Parallel signing order"
          },
          {
            "name": "VerificationType",
            "type": "Picklist",
            "description": "Number of required signatures"
          },
          {
            "name": "RecordActionType",
            "type": "Picklist",
            "description": "Whether trail is created on record Create or Edit"
          }
        ],
        "relationships": [
          {
            "target": "DigitalVerificationSetupDetail",
            "type": "parent",
            "description": "Individual signature definitions within this trail"
          }
        ]
      },
      {
        "name": "DigitalVerificationSetupDetail",
        "type": "standard",
        "domain": "platform_extensions",
        "description": "Defines individual signature details within a signature trail including the designated verifier, signing order, and pre- and post-signing messages. Verifiers can be assigned by user group or participant role, with ranking determining the signing sequence.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Signature definition name"
          },
          {
            "name": "DigitalVerificationSetupId",
            "type": "Lookup",
            "description": "Parent signature trail"
          },
          {
            "name": "DesignatedVerifierType",
            "type": "Picklist",
            "description": "Whether verifier is a Group or Participant Role"
          },
          {
            "name": "VerifierRank",
            "type": "Picklist",
            "description": "Order of this verifier such as First Verifier or Second Verifier"
          },
          {
            "name": "PreVerificationText",
            "type": "LongTextArea",
            "description": "Message shown to verifier before signing"
          },
          {
            "name": "PostVerificationText",
            "type": "LongTextArea",
            "description": "Message shown to verifier after signing"
          }
        ],
        "relationships": [
          {
            "target": "DigitalVerificationSetup",
            "type": "child",
            "description": "The signature trail this definition belongs to"
          }
        ]
      },
      {
        "name": "DigitalVerification",
        "type": "standard",
        "domain": "platform_extensions",
        "description": "Represents an individual electronic signature record within a signature trail. Captures the signer's action (approve or reject), comments, location, and CRM credential authentication. Provides 21 CFR Part 11-ready functionality for regulated life sciences environments.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Signature record identifier"
          },
          {
            "name": "SigningAction",
            "type": "Picklist",
            "description": "Approve or Reject action taken by the verifier"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Signature status such as Pending, Completed, or Rejected-Open"
          },
          {
            "name": "Comments",
            "type": "LongTextArea",
            "description": "Comments entered by the signer"
          },
          {
            "name": "SignerLocation",
            "type": "Text",
            "description": "Location where the signature was captured"
          },
          {
            "name": "SignatureRequestDate",
            "type": "DateTime",
            "description": "Date when the signature was requested"
          }
        ],
        "relationships": [
          {
            "target": "DigitalVerificationSetupDetail",
            "type": "lookup",
            "description": "The signature definition this record fulfills"
          }
        ]
      },
      {
        "name": "Assessment",
        "type": "standard",
        "domain": "platform_extensions",
        "description": "Stores the header data for an assessment instance. Assessments gather structured health information through industry-standard screeners and surveys powered by the Discovery Framework. Supports both internal assessments and external user assessments through Experience Cloud portals.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Assessment name or identifier"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Assessment status such as Draft, In Progress, or Completed"
          },
          {
            "name": "AssessmentType",
            "type": "Picklist",
            "description": "Type of assessment such as Screener, Survey, or Feasibility"
          },
          {
            "name": "AccountId",
            "type": "Lookup",
            "description": "Account associated with this assessment"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "Patient or organization being assessed"
          },
          {
            "target": "AssessmentQuestion",
            "type": "parent",
            "description": "Questions included in this assessment"
          }
        ]
      },
      {
        "name": "AssessmentQuestion",
        "type": "standard",
        "domain": "platform_extensions",
        "description": "Represents the container object that stores questions for an assessment. Questions can be created manually or generated using Einstein generative AI. Multiple versions can exist for each question through assessment question version records.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Question identifier"
          },
          {
            "name": "QuestionText",
            "type": "LongTextArea",
            "description": "The assessment question text"
          },
          {
            "name": "QuestionType",
            "type": "Picklist",
            "description": "Question type such as Multiple Choice, Text, or Scale"
          },
          {
            "name": "IsRequired",
            "type": "Checkbox",
            "description": "Whether respondent must answer this question"
          }
        ],
        "relationships": [
          {
            "target": "Assessment",
            "type": "child",
            "description": "The assessment this question belongs to"
          },
          {
            "target": "AssessmentQuestionResponse",
            "type": "parent",
            "description": "Responses submitted for this question"
          }
        ]
      },
      {
        "name": "PersonLifeEvent",
        "type": "standard",
        "domain": "platform_extensions",
        "description": "Captures significant events in a patient's life that may impact their healthcare, displayed on the Events and Milestones component. Supports custom life event types with configurable icons, sensitive event hiding, and contextual actions for follow-up care interventions.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Life event name or description"
          },
          {
            "name": "EventType",
            "type": "Picklist",
            "description": "Category of life event"
          },
          {
            "name": "EventDate",
            "type": "Date",
            "description": "Date when the event occurred"
          },
          {
            "name": "PersonId",
            "type": "Lookup",
            "description": "Person account associated with this event"
          },
          {
            "name": "IsSensitive",
            "type": "Checkbox",
            "description": "Whether this event should be hidden from general view"
          }
        ],
        "relationships": [
          {
            "target": "Account",
            "type": "lookup",
            "description": "Patient account this life event belongs to"
          }
        ]
      },
      {
        "name": "ProductCatalog",
        "type": "standard",
        "domain": "platform_extensions",
        "description": "A top-level container for organizing medical device and pharmaceutical products into browsable hierarchies. Available as part of Revenue Cloud's Product Catalog Management for Life Sciences Cloud users, supporting catalog types such as Sales and Service to match business requirements.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Catalog display name"
          },
          {
            "name": "CatalogType",
            "type": "Picklist",
            "description": "Catalog type such as Sales or Service"
          },
          {
            "name": "Description",
            "type": "TextArea",
            "description": "Description of this catalog's purpose"
          },
          {
            "name": "IsActive",
            "type": "Checkbox",
            "description": "Whether this catalog is available for use"
          }
        ],
        "relationships": [
          {
            "target": "ProductCategory",
            "type": "parent",
            "description": "Categories organizing products within this catalog"
          }
        ]
      },
      {
        "name": "DocumentChecklistItem",
        "type": "standard",
        "domain": "platform_extensions",
        "description": "Represents a document item in the Intelligent Document Automation workflow. Tracks patient and member forms through intake, routing, review, and processing stages in a HIPAA-compliant digital workspace. Supports automated routing to queues and OCR data extraction.",
        "fields": [
          {
            "name": "Name",
            "type": "Text",
            "description": "Document checklist item name"
          },
          {
            "name": "DocumentType",
            "type": "Picklist",
            "description": "Type of document such as Consent Form, Insurance Card, or Prescription"
          },
          {
            "name": "Status",
            "type": "Picklist",
            "description": "Processing status such as Received, In Review, or Processed"
          },
          {
            "name": "ParentRecordId",
            "type": "Lookup",
            "description": "Parent record this document is associated with"
          }
        ],
        "relationships": [
          {
            "target": "ContentDocument",
            "type": "lookup",
            "description": "The uploaded document file"
          },
          {
            "target": "Account",
            "type": "lookup",
            "description": "Patient account this document belongs to"
          }
        ]
      }
    ],
    "metadata": []
  }
};
