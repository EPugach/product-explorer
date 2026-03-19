// ══════════════════════════════════════════════════════════════
//  Nonprofit Cloud Entities — Objects & Custom Metadata
//  Nonprofit Cloud is a native Salesforce product (no managed packages)
// ══════════════════════════════════════════════════════════════

export default {

  "constituents": {
    "objects": [
      {
        "name": "Account",
        "type": "standard",
        "domain": "constituents",
        "description": "Represents both individual and organizational constituents in Nonprofit Cloud. Person Accounts combine Account and Contact into a single record for individuals such as donors, volunteers, and program participants. Business Accounts model organizations such as foundations, corporate donors, and partner agencies.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Account name; auto-populated from first/last name for Person Accounts" },
          { "name": "RecordTypeId", "type": "Lookup", "description": "Distinguishes Person Accounts from Business Accounts" },
          { "name": "ParentId", "type": "Lookup", "description": "Parent account for modeling organizational hierarchies" },
          { "name": "Type", "type": "Picklist", "description": "Account classification such as Donor, Foundation, Partner, or Vendor" },
          { "name": "BillingAddress", "type": "Text", "description": "Primary billing address compound field" },
          { "name": "Phone", "type": "Phone", "description": "Primary phone number for the account" }
        ],
        "relationships": [
          { "target": "Contact", "type": "parent", "description": "Person Accounts have an associated Contact record that stores individual-specific fields" },
          { "target": "ContactProfile", "type": "parent", "description": "Accounts can have a Contact Profile with extended fundraising attributes" },
          { "target": "AccountContactRelationship", "type": "parent", "description": "Accounts are linked to contacts through Account Contact Relationships for household and organizational membership" },
          { "target": "ContactPointAddress", "type": "parent", "description": "Accounts have one or more contact point addresses" }
        ]
      },
      {
        "name": "Contact",
        "type": "standard",
        "domain": "constituents",
        "description": "Stores individual-specific information for Person Account constituents. In the Person Account model, Contact fields like first name, last name, email, and birthdate are surfaced directly on the Account record. Contact records also serve as the linking point for Contact Contact Relationships and Opportunity Contact Roles.",
        "fields": [
          { "name": "FirstName", "type": "Text", "description": "Individual's first name" },
          { "name": "LastName", "type": "Text", "description": "Individual's last name" },
          { "name": "Email", "type": "Email", "description": "Primary email address" },
          { "name": "Birthdate", "type": "Date", "description": "Date of birth for age-based segmentation and reporting" },
          { "name": "AccountId", "type": "Lookup", "description": "The Account this Contact is associated with" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each Contact belongs to an Account; for Person Accounts this is a one-to-one relationship" },
          { "target": "ContactContactRelationship", "type": "parent", "description": "Contacts participate in interpersonal relationships" },
          { "target": "OpportunityContactRole", "type": "parent", "description": "Contacts are linked to fundraising opportunities through contact roles" }
        ]
      },
      {
        "name": "ContactProfile",
        "type": "custom",
        "domain": "constituents",
        "description": "Extends constituent records with fundraising-specific attributes beyond what standard Account and Contact fields provide. The Contact Profile captures donor classification, recurring donor type, and other profile data that fundraising automation uses to personalize engagement strategies and segment donors for targeted outreach.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated profile identifier" },
          { "name": "AccountId", "type": "Lookup", "description": "The constituent account this profile extends" },
          { "name": "DonorClassification", "type": "Picklist", "description": "Donor segmentation category such as Major Donor, Mid-Level, or Annual Fund" },
          { "name": "RecurringDonorType", "type": "Picklist", "description": "Indicates whether the constituent is a sustaining, lapsed, or prospective recurring donor" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each Contact Profile belongs to a single constituent account" },
          { "target": "GiftCommitment", "type": "lookup", "description": "Contact profiles inform recurring commitment tracking and donor classification" }
        ]
      }
    ]
  },

  "households": {
    "objects": [
      {
        "name": "PartyRelationshipGroup",
        "type": "custom",
        "domain": "households",
        "description": "The container object for modeling households and other constituent group types in Nonprofit Cloud. Each group has a Type field (Household, Affinity Group, etc.), a name, and optional start and end dates for time-bound membership tracking. Groups are Business Accounts linked to members through Account Contact Relationships, replacing NPSP's dedicated Household Account object with a more flexible standard approach.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name for the group, often the household surname" },
          { "name": "Type", "type": "Picklist", "description": "Group classification such as Household, Affinity Group, or Board" },
          { "name": "AccountId", "type": "Lookup", "description": "The Business Account that represents this group" },
          { "name": "StartDate", "type": "Date", "description": "Date when the group was established" },
          { "name": "EndDate", "type": "Date", "description": "Date when the group was dissolved, if applicable" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each group is represented by a Business Account" },
          { "target": "AccountContactRelationship", "type": "parent", "description": "Group membership is tracked through Account Contact Relationship records" }
        ]
      },
      {
        "name": "AccountContactRelationship",
        "type": "standard",
        "domain": "households",
        "description": "Links individual Person Accounts to group or organizational Business Accounts with specific roles and date ranges. In the household context, ACRs track membership roles such as Head of Household, Spouse, or Dependent. Beyond households, ACRs model employment, board membership, volunteer affiliation, and other individual-to-organization connections.",
        "fields": [
          { "name": "AccountId", "type": "Lookup", "description": "The organization or group account" },
          { "name": "ContactId", "type": "Lookup", "description": "The individual contact being linked to the account" },
          { "name": "Roles", "type": "MultiPicklist", "description": "One or more roles the individual holds in the organization (Head of Household, Member, Board Member)" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether the relationship is currently active" },
          { "name": "StartDate", "type": "Date", "description": "Date when the relationship began" },
          { "name": "EndDate", "type": "Date", "description": "Date when the relationship ended, if applicable" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each ACR links to the organization or group account" },
          { "target": "Contact", "type": "child", "description": "Each ACR links to the individual contact" },
          { "target": "PartyRelationshipGroup", "type": "lookup", "description": "ACRs connect individuals to Party Relationship Group households" }
        ]
      }
    ]
  },

  "relationships": {
    "objects": [
      {
        "name": "ContactContactRelationship",
        "type": "custom",
        "domain": "relationships",
        "description": "Models direct relationships between individuals such as spouse, parent-child, sibling, mentor-mentee, and colleague connections. Each record captures two contacts, their reciprocal roles, and an active status. Relationship records appear on both contacts' related lists, giving fundraisers and program staff visibility into personal networks that influence giving and participation.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated relationship identifier" },
          { "name": "ContactId", "type": "Lookup", "description": "The first individual in the relationship" },
          { "name": "RelatedContactId", "type": "Lookup", "description": "The second individual in the relationship" },
          { "name": "RoleId", "type": "Lookup", "description": "The Party Role Relationship defining the type (e.g., Spouse, Parent)" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether the relationship is currently active" },
          { "name": "StartDate", "type": "Date", "description": "Date when the relationship began" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Links to the first individual in the relationship" },
          { "target": "PartyRoleRelationship", "type": "child", "description": "References the party role that defines the relationship type and reciprocal labels" }
        ]
      },
      {
        "name": "AccountAccountRelationship",
        "type": "custom",
        "domain": "relationships",
        "description": "Models relationships between organizations such as corporate affiliations, foundation-grantee connections, partner agency ties, and vendor relationships. Each record captures two accounts, a relationship type, and directional roles. Useful for understanding organizational networks in grantmaking and institutional fundraising.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated relationship identifier" },
          { "name": "AccountId", "type": "Lookup", "description": "The first organization in the relationship" },
          { "name": "RelatedAccountId", "type": "Lookup", "description": "The second organization in the relationship" },
          { "name": "RoleId", "type": "Lookup", "description": "The Party Role Relationship defining the relationship type" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether the organizational relationship is currently active" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Links to the first organization account" },
          { "target": "PartyRoleRelationship", "type": "child", "description": "References the party role defining the relationship type" }
        ]
      },
      {
        "name": "PartyRoleRelationship",
        "type": "custom",
        "domain": "relationships",
        "description": "Metadata object that defines the available relationship types and their reciprocal labels for use in Contact Contact Relationships and Account Account Relationships. Admins configure which relationship roles are available, specifying the forward label, reciprocal label, and applicable object types. This controls the picklist of relationship types staff can select.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Forward-direction label for the relationship (e.g., Parent)" },
          { "name": "ReciprocalLabel", "type": "Text", "description": "Reverse-direction label (e.g., Child)" },
          { "name": "RelationshipType", "type": "Picklist", "description": "Category of relationship (Family, Professional, Community)" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this relationship type is available for selection" }
        ],
        "relationships": [
          { "target": "ContactContactRelationship", "type": "parent", "description": "Party roles are used by Contact Contact Relationships" },
          { "target": "AccountAccountRelationship", "type": "parent", "description": "Party roles are used by Account Account Relationships" }
        ]
      }
    ]
  },

  "contact_points": {
    "objects": [
      {
        "name": "ContactPointAddress",
        "type": "standard",
        "domain": "contact_points",
        "description": "Stores physical mailing and location addresses for constituents using Salesforce's polymorphic Contact Point model. Each address record includes street, city, state, postal code, country, and an address type. The IsPrimary flag designates the preferred mailing address. Multiple addresses per person enable seasonal and multi-location tracking with GDPR-compliant data management.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display label for this address record" },
          { "name": "ParentId", "type": "Lookup", "description": "The Account this address belongs to (polymorphic)" },
          { "name": "AddressType", "type": "Picklist", "description": "Classification such as Home, Work, Vacation, or Other" },
          { "name": "Street", "type": "TextArea", "description": "Street address lines" },
          { "name": "City", "type": "Text", "description": "City name" },
          { "name": "StateCode", "type": "Picklist", "description": "State or province code" },
          { "name": "PostalCode", "type": "Text", "description": "Postal or ZIP code" },
          { "name": "CountryCode", "type": "Picklist", "description": "Country code" },
          { "name": "IsPrimary", "type": "Checkbox", "description": "Whether this is the preferred mailing address" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each address belongs to a constituent account" },
          { "target": "PartyRelationshipGroup", "type": "lookup", "description": "Household members may share addresses through the group" }
        ]
      },
      {
        "name": "ContactPointEmail",
        "type": "standard",
        "domain": "contact_points",
        "description": "Stores email addresses for constituents with support for multiple records per person. Each record captures the email address, a type classification, and a primary designation. Email contact points integrate with campaign communications, acknowledgment workflows, and marketing automation to ensure outreach reaches the correct address.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display label for this email record" },
          { "name": "ParentId", "type": "Lookup", "description": "The Account this email belongs to (polymorphic)" },
          { "name": "EmailAddress", "type": "Email", "description": "The email address" },
          { "name": "EmailType", "type": "Picklist", "description": "Classification such as Personal, Work, or Other" },
          { "name": "IsPrimary", "type": "Checkbox", "description": "Whether this is the preferred email address" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each email belongs to a constituent account" }
        ]
      },
      {
        "name": "ContactPointPhone",
        "type": "standard",
        "domain": "contact_points",
        "description": "Stores phone numbers for constituents with support for multiple records per person. Each record captures the telephone number, a type classification, and a primary designation. Phone contact points support donor outreach, volunteer coordination, and event communication workflows.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display label for this phone record" },
          { "name": "ParentId", "type": "Lookup", "description": "The Account this phone number belongs to (polymorphic)" },
          { "name": "TelephoneNumber", "type": "Phone", "description": "The phone number" },
          { "name": "PhoneType", "type": "Picklist", "description": "Classification such as Home, Mobile, Work, or Fax" },
          { "name": "IsPrimary", "type": "Checkbox", "description": "Whether this is the preferred phone number" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each phone number belongs to a constituent account" }
        ]
      }
    ]
  },

  "fundraising": {
    "objects": [
      {
        "name": "Opportunity",
        "type": "standard",
        "domain": "fundraising",
        "description": "Tracks major gift solicitations, grant proposals, and significant fundraising asks moving through a configurable pipeline. Each opportunity progresses through stages with probability percentages, expected amounts, and close dates. In Nonprofit Cloud, Opportunities represent the cultivation and solicitation phase before gifts are formalized into commitments or transactions.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Descriptive name for the solicitation or proposal" },
          { "name": "Amount", "type": "Currency", "description": "Expected gift amount for the opportunity" },
          { "name": "StageName", "type": "Picklist", "description": "Current pipeline stage (Prospecting, Cultivation, Solicitation, Closed Won)" },
          { "name": "CloseDate", "type": "Date", "description": "Expected or actual close date" },
          { "name": "Probability", "type": "Percent", "description": "Likelihood of winning the opportunity" },
          { "name": "AccountId", "type": "Lookup", "description": "The donor or organization account" },
          { "name": "CampaignId", "type": "Lookup", "description": "The campaign that sourced this opportunity" },
          { "name": "RecordTypeId", "type": "Lookup", "description": "Distinguishes major gifts, grants, planned giving, and other fundraising types" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each opportunity is associated with a donor account" },
          { "target": "Campaign", "type": "child", "description": "Opportunities are sourced from campaigns" },
          { "target": "OpportunityContactRole", "type": "parent", "description": "Opportunities have contact roles identifying involved individuals" },
          { "target": "GiftCommitment", "type": "lookup", "description": "Won opportunities can become gift commitments" }
        ]
      },
      {
        "name": "OpportunityContactRole",
        "type": "standard",
        "domain": "fundraising",
        "description": "Associates multiple constituents with an opportunity and defines each person's role in the solicitation. Roles include Primary Donor, Influencer, Decision Maker, and Soft Credit Recipient. Contact Roles give fundraisers visibility into the network of people involved in a major gift and help track who contributed to winning the opportunity.",
        "fields": [
          { "name": "OpportunityId", "type": "Lookup", "description": "The opportunity this contact role belongs to" },
          { "name": "ContactId", "type": "Lookup", "description": "The individual involved in the opportunity" },
          { "name": "Role", "type": "Picklist", "description": "The person's role (Primary Donor, Influencer, Decision Maker, Soft Credit)" },
          { "name": "IsPrimary", "type": "Checkbox", "description": "Whether this is the primary contact for the opportunity" }
        ],
        "relationships": [
          { "target": "Opportunity", "type": "child", "description": "Each contact role belongs to an opportunity" },
          { "target": "Contact", "type": "child", "description": "Each contact role references an individual" },
          { "target": "GiftSoftCredit", "type": "lookup", "description": "Contact roles can inform soft credit attribution" }
        ]
      }
    ],
    "metadata": [
      {
        "type": "FundraisingSetting__mdt",
        "name": "Fundraising Settings",
        "fields": { "InstallmentExtensionDayCount__c": "Number", "LapsedUnpaidTransactionCount__c": "Number", "FailingTransactionCount__c": "Number", "AutoCloseEnabled__c": "Checkbox" },
        "description": "Configures core fundraising behavior including the installment extension window for matching transactions to commitments, lapsed and failing status thresholds for recurring commitments, and auto-close behavior."
      }
    ]
  },

  "gift_commitments": {
    "objects": [
      {
        "name": "GiftCommitment",
        "type": "custom",
        "domain": "gift_commitments",
        "description": "Represents a donor's promise to give through pledges, recurring donations, or multi-payment gift agreements. Each record captures the commitment type (Recurring or Custom), status lifecycle (Draft, Active, Paused, Lapsed, Failing, Closed), total amount, and links to the donor account, campaign, and originating opportunity. Automated processing flows update commitment status based on transaction payment patterns.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated commitment identifier" },
          { "name": "AccountId", "type": "Lookup", "description": "The donor account making the commitment" },
          { "name": "CommitmentType", "type": "Picklist", "description": "Type of commitment: Recurring or Custom" },
          { "name": "Status", "type": "Picklist", "description": "Lifecycle status: Draft, Active, Paused, Lapsed, Failing, or Closed" },
          { "name": "TotalAmount", "type": "Currency", "description": "Total committed amount across all installments" },
          { "name": "CampaignId", "type": "Lookup", "description": "The campaign that sourced this commitment" },
          { "name": "OpportunityId", "type": "Lookup", "description": "The originating fundraising opportunity" },
          { "name": "StartDate", "type": "Date", "description": "Date when the commitment begins" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each commitment belongs to a donor account" },
          { "target": "GiftCommitmentSchedule", "type": "parent", "description": "Commitments have one or more schedules defining installment patterns" },
          { "target": "GiftTransaction", "type": "parent", "description": "Commitments generate gift transactions for each installment" },
          { "target": "Opportunity", "type": "child", "description": "Commitments can originate from fundraising opportunities" }
        ]
      },
      {
        "name": "GiftCommitmentSchedule",
        "type": "custom",
        "domain": "gift_commitments",
        "description": "Defines the installment pattern for a gift commitment including frequency, interval, day of month, effective dates, and amount per installment. A single commitment can have multiple schedules to handle upgrades, payment method changes, and pause periods. Schedule processing automatically creates gift transactions for each upcoming installment based on the defined pattern.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated schedule identifier" },
          { "name": "GiftCommitmentId", "type": "Lookup", "description": "The parent gift commitment" },
          { "name": "Frequency", "type": "Picklist", "description": "Installment frequency: Monthly, Quarterly, Annually, or Custom" },
          { "name": "InstallmentAmount", "type": "Currency", "description": "Amount per installment payment" },
          { "name": "DayOfMonth", "type": "Number", "description": "Day of the month on which installments are due" },
          { "name": "EffectiveStartDate", "type": "Date", "description": "Date when this schedule becomes active" },
          { "name": "EffectiveEndDate", "type": "Date", "description": "Date when this schedule stops generating transactions" }
        ],
        "relationships": [
          { "target": "GiftCommitment", "type": "child", "description": "Each schedule belongs to a gift commitment" },
          { "target": "PaymentInstrument", "type": "lookup", "description": "Schedules reference the payment method used for installments" }
        ]
      },
      {
        "name": "GiftCommitmentChangeAttributionLog",
        "type": "custom",
        "domain": "gift_commitments",
        "description": "Records every modification to a gift commitment for audit and attribution purposes. When a commitment is upgraded, downgraded, paused, resumed, or otherwise changed, the log captures the change type, per-day amount impact, and the campaign or outreach source code that influenced the change. This enables accurate ROI calculation for campaigns that drive commitment upgrades.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated log entry identifier" },
          { "name": "GiftCommitmentId", "type": "Lookup", "description": "The commitment that was changed" },
          { "name": "ChangeType", "type": "Picklist", "description": "Type of change: Upgrade, Downgrade, Pause, Resume, Payment Method Change" },
          { "name": "PerDayAmountChange", "type": "Currency", "description": "Daily amount impact of the change for ROI calculation" },
          { "name": "CampaignId", "type": "Lookup", "description": "The campaign that influenced this change" },
          { "name": "OutreachSourceCodeId", "type": "Lookup", "description": "The specific outreach source code that drove the change" },
          { "name": "ChangeDate", "type": "DateTime", "description": "Timestamp when the change was made" }
        ],
        "relationships": [
          { "target": "GiftCommitment", "type": "child", "description": "Each log entry references the modified commitment" },
          { "target": "Campaign", "type": "child", "description": "Changes are attributed to campaigns for ROI analysis" }
        ]
      }
    ]
  },

  "gift_transactions": {
    "objects": [
      {
        "name": "GiftTransaction",
        "type": "custom",
        "domain": "gift_transactions",
        "description": "Tracks every received gift and payment as a discrete transaction record in Nonprofit Cloud. Gift Transactions represent one-time donations, installment payments against commitments, in-kind gifts, and matching gifts. Each transaction captures the amount, payment method, gift vehicle, received date, status lifecycle (Unpaid, Pending, Paid, Failed, Canceled, Refunded, Written Off), and acknowledgment tracking.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated transaction identifier" },
          { "name": "AccountId", "type": "Lookup", "description": "The donor account for this transaction" },
          { "name": "Amount", "type": "Currency", "description": "Transaction amount received or expected" },
          { "name": "Status", "type": "Picklist", "description": "Transaction lifecycle: Unpaid, Pending, Paid, Failed, Canceled, Refunded, Written Off" },
          { "name": "GiftReceivedDate", "type": "Date", "description": "Date the gift was received" },
          { "name": "PaymentMethod", "type": "Picklist", "description": "How the donor paid: Credit Card, Check, ACH, Wire, Cash" },
          { "name": "GiftVehicle", "type": "Picklist", "description": "Gift type: Cash, Check, Credit Card, Stock, Wire Transfer, In-Kind" },
          { "name": "GiftCommitmentId", "type": "Lookup", "description": "The commitment this transaction fulfills, if applicable" },
          { "name": "CampaignId", "type": "Lookup", "description": "Campaign attribution for this transaction" },
          { "name": "OutreachSourceCodeId", "type": "Lookup", "description": "Granular outreach source code for attribution" },
          { "name": "AcknowledgmentStatus", "type": "Picklist", "description": "Whether the donor has been thanked: Not Sent, Sent, Failed" },
          { "name": "MatchingEmployerTransactionId", "type": "Lookup", "description": "Links to the corporate matching gift transaction" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each transaction belongs to a donor account" },
          { "target": "GiftCommitment", "type": "child", "description": "Transactions fulfill commitment installments" },
          { "target": "Campaign", "type": "child", "description": "Transactions are attributed to campaigns" },
          { "target": "GiftTransactionDesignation", "type": "parent", "description": "Transactions are allocated to designations through junction records" },
          { "target": "GiftSoftCredit", "type": "parent", "description": "Transactions can have soft credit recipients" }
        ]
      },
      {
        "name": "PaymentInstrument",
        "type": "custom",
        "domain": "gift_transactions",
        "description": "Stores donor payment method information such as credit card last four digits, expiration dates, and ACH bank account details. Payment Instrument records link to gift commitment schedules and enable tracking of which payment method is used for recurring donations. When donors change payment methods, new instrument records are created while preserving historical records.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name for the payment method (e.g., Visa ending 4242)" },
          { "name": "AccountId", "type": "Lookup", "description": "The donor account that owns this payment instrument" },
          { "name": "PaymentType", "type": "Picklist", "description": "Type of payment: Credit Card, ACH, Bank Transfer" },
          { "name": "LastFourDigits", "type": "Text", "description": "Last four digits of the card or account number" },
          { "name": "ExpirationDate", "type": "Date", "description": "Expiration date for credit card instruments" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this payment instrument is currently active" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each payment instrument belongs to a donor account" },
          { "target": "GiftCommitmentSchedule", "type": "lookup", "description": "Payment instruments are linked to commitment schedules for recurring processing" }
        ]
      }
    ]
  },

  "gift_entry": {
    "objects": [
      {
        "name": "GiftEntry",
        "type": "custom",
        "domain": "gift_entry",
        "description": "A staging record that captures gift information before it is processed into a Gift Transaction. Gift entries are created through the single gift entry window, the batch grid, or CSV import. Each entry holds donor, amount, payment method, designation, and soft credit data in a pre-processing state until batch or individual processing creates the final transaction records.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated entry identifier" },
          { "name": "DonorAccountId", "type": "Lookup", "description": "The donor account for this gift entry" },
          { "name": "Amount", "type": "Currency", "description": "Gift amount to be processed" },
          { "name": "PaymentMethod", "type": "Picklist", "description": "How the donor is paying" },
          { "name": "GiftBatchId", "type": "Lookup", "description": "The batch this entry belongs to, if applicable" },
          { "name": "ProcessingStatus", "type": "Picklist", "description": "Entry status: Draft, Ready, Processing, Completed, Failed" },
          { "name": "ProcessingResult", "type": "LongTextArea", "description": "Processing outcome details including any error messages" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each gift entry references a donor account" },
          { "target": "GiftBatch", "type": "child", "description": "Entries are grouped in batches for bulk processing" },
          { "target": "GiftTransaction", "type": "lookup", "description": "Processing creates a gift transaction from each entry" }
        ]
      },
      {
        "name": "GiftBatch",
        "type": "custom",
        "domain": "gift_entry",
        "description": "Groups gift entries for bulk processing with validation and error handling. Each batch has an associated template, expected gift count, and estimated value for reconciliation. Batch processing supports dry runs to test for errors before committing, and partially processed batches identify which entries failed so they can be corrected and reprocessed.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Descriptive name for the batch" },
          { "name": "GiftBatchTemplateId", "type": "Lookup", "description": "The template controlling which fields appear in the batch" },
          { "name": "ExpectedGiftCount", "type": "Number", "description": "Expected number of gifts for reconciliation" },
          { "name": "EstimatedValue", "type": "Currency", "description": "Expected total value for reconciliation" },
          { "name": "Status", "type": "Picklist", "description": "Batch status: Open, Processing, Completed, Partially Processed" },
          { "name": "ProcessedDate", "type": "DateTime", "description": "Timestamp when the batch was processed" }
        ],
        "relationships": [
          { "target": "GiftEntry", "type": "parent", "description": "Batches contain multiple gift entries" },
          { "target": "GiftBatchTemplate", "type": "child", "description": "Each batch uses a template for field configuration" }
        ]
      },
      {
        "name": "GiftBatchTemplate",
        "type": "custom",
        "domain": "gift_entry",
        "description": "Defines the field layout and configuration for gift entry batches and the single gift entry window. Templates control which fields appear, their display order, default values, and whether they are required. Custom templates can be created for different gift entry scenarios such as event registrations, annual fund drives, or memorial gifts.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Template name describing its purpose" },
          { "name": "Description", "type": "LongTextArea", "description": "Explanation of when to use this template" },
          { "name": "FieldConfiguration", "type": "LongTextArea", "description": "JSON configuration of fields, order, and defaults" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this template is available for use" }
        ],
        "relationships": [
          { "target": "GiftBatch", "type": "parent", "description": "Templates are applied to gift batches" }
        ]
      }
    ]
  },

  "designations": {
    "objects": [
      {
        "name": "GiftDesignation",
        "type": "custom",
        "domain": "designations",
        "description": "Represents a named funding purpose that donors can direct their gifts toward, such as General Fund, Scholarship Fund, or Building Campaign. Each designation has an active status and can be set as the org-wide default for unrestricted gifts. Designation records accumulate rollup totals from linked gift transaction designations, providing real-time visibility into how much has been raised for each fund.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Fund or purpose name displayed to donors and staff" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this designation is available for gift allocation" },
          { "name": "IsDefault", "type": "Checkbox", "description": "Whether this is the org-wide default designation for unrestricted gifts" },
          { "name": "TotalAmount", "type": "Currency", "description": "Rollup total of all allocated gift transaction amounts" },
          { "name": "TransactionCount", "type": "Number", "description": "Rollup count of gift transactions allocated to this designation" },
          { "name": "Description", "type": "LongTextArea", "description": "Description of the fund's purpose and restrictions" }
        ],
        "relationships": [
          { "target": "GiftTransactionDesignation", "type": "parent", "description": "Designations receive allocations through gift transaction designation junction records" },
          { "target": "GiftDefaultDesignation", "type": "parent", "description": "Designations can be set as defaults at various levels" }
        ]
      },
      {
        "name": "GiftTransactionDesignation",
        "type": "custom",
        "domain": "designations",
        "description": "Junction object that links gift transactions to gift designations with a percentage or amount allocation. Each gift transaction can have up to 50 designation allocations, enabling split gifts across multiple funds. Transaction designations are the source of truth for calculating gift designation rollup totals and enabling accurate impact reporting by fund.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated allocation identifier" },
          { "name": "GiftTransactionId", "type": "Lookup", "description": "The gift transaction being allocated" },
          { "name": "GiftDesignationId", "type": "Lookup", "description": "The designation receiving the allocation" },
          { "name": "Amount", "type": "Currency", "description": "Dollar amount allocated to this designation" },
          { "name": "Percent", "type": "Percent", "description": "Percentage of the transaction allocated to this designation" }
        ],
        "relationships": [
          { "target": "GiftTransaction", "type": "child", "description": "Each allocation belongs to a gift transaction" },
          { "target": "GiftDesignation", "type": "child", "description": "Each allocation references a gift designation fund" }
        ]
      },
      {
        "name": "GiftDefaultDesignation",
        "type": "custom",
        "domain": "designations",
        "description": "Manages the inheritance hierarchy that automatically assigns designations to gifts when no explicit allocation is provided. Default designations can be set at the campaign, commitment, opportunity, or org-wide level. When a gift is processed, the system checks each level in priority order and allocates unspecified amounts to the appropriate default, ensuring every dollar is tracked.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated default designation identifier" },
          { "name": "GiftDesignationId", "type": "Lookup", "description": "The designation to use as the default" },
          { "name": "ParentRecordId", "type": "Lookup", "description": "The campaign, commitment, or opportunity this default applies to (polymorphic)" },
          { "name": "Priority", "type": "Number", "description": "Priority level in the inheritance hierarchy" }
        ],
        "relationships": [
          { "target": "GiftDesignation", "type": "child", "description": "Each default references a gift designation" },
          { "target": "Campaign", "type": "lookup", "description": "Default designations can be set at the campaign level" },
          { "target": "GiftCommitment", "type": "lookup", "description": "Default designations can be set at the commitment level" }
        ]
      }
    ]
  },

  "soft_credits": {
    "objects": [
      {
        "name": "GiftSoftCredit",
        "type": "custom",
        "domain": "soft_credits",
        "description": "Records attribution for constituents who influenced or facilitated a donation without being the primary donor. Each soft credit links to a gift transaction and a credited account with a credit type such as Influence, Tribute, Solicitation, Household Member, or Matching. Partial amounts can be assigned when multiple people contributed to securing a gift. This consolidated model replaces NPSP's multiple soft credit types.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated soft credit identifier" },
          { "name": "GiftTransactionId", "type": "Lookup", "description": "The gift transaction being credited" },
          { "name": "AccountId", "type": "Lookup", "description": "The constituent account receiving the soft credit" },
          { "name": "CreditType", "type": "Picklist", "description": "Type of credit: Influence, Tribute, Solicitation, Household Member, Matching" },
          { "name": "Amount", "type": "Currency", "description": "Amount of the soft credit, which may be partial" },
          { "name": "Description", "type": "TextArea", "description": "Notes about why this credit was given" }
        ],
        "relationships": [
          { "target": "GiftTransaction", "type": "child", "description": "Each soft credit references a gift transaction" },
          { "target": "Account", "type": "child", "description": "Each soft credit is attributed to a constituent account" },
          { "target": "ContactContactRelationship", "type": "lookup", "description": "Relationships between constituents inform soft credit decisions" }
        ]
      }
    ]
  },

  "campaigns": {
    "objects": [
      {
        "name": "Campaign",
        "type": "standard",
        "domain": "campaigns",
        "description": "Manages fundraising campaigns with status tracking, budgets, expected revenue, and date ranges. Nonprofit Cloud uses a flat campaign structure without hierarchy rollups. Each campaign record serves as an attribution anchor for gift transactions, commitments, and opportunities. Campaign performance metrics aggregate from linked records, giving managers visibility into response rates and total raised.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Campaign name" },
          { "name": "Type", "type": "Picklist", "description": "Campaign type: Appeal, Event, Direct Mail, Digital, Phonathon" },
          { "name": "Status", "type": "Picklist", "description": "Campaign lifecycle: Planned, In Progress, Completed, Aborted" },
          { "name": "StartDate", "type": "Date", "description": "Campaign start date" },
          { "name": "EndDate", "type": "Date", "description": "Campaign end date" },
          { "name": "BudgetedCost", "type": "Currency", "description": "Planned budget for the campaign" },
          { "name": "ExpectedRevenue", "type": "Currency", "description": "Expected total revenue from the campaign" },
          { "name": "ActualCost", "type": "Currency", "description": "Actual cost incurred" }
        ],
        "relationships": [
          { "target": "OutreachSourceCode", "type": "parent", "description": "Campaigns contain outreach source codes for granular attribution" },
          { "target": "GiftTransaction", "type": "parent", "description": "Gift transactions are attributed to campaigns" },
          { "target": "GiftCommitment", "type": "parent", "description": "Gift commitments are linked to campaigns" },
          { "target": "Opportunity", "type": "parent", "description": "Fundraising opportunities are sourced from campaigns" }
        ]
      },
      {
        "name": "OutreachSourceCode",
        "type": "custom",
        "domain": "campaigns",
        "description": "Child records of campaigns that provide granular tracking across channel, message, and audience combinations. Each source code captures which communication channel was used, which specific message or creative was sent, and which audience segment was targeted. Gift transactions and commitments reference source codes for fine-grained attribution beyond the campaign level.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Source code identifier, often a formatted tracking code" },
          { "name": "CampaignId", "type": "Lookup", "description": "The parent campaign" },
          { "name": "Channel", "type": "Picklist", "description": "Communication channel: Email, Direct Mail, Social, Phone, Web" },
          { "name": "Message", "type": "Text", "description": "Specific message or creative identifier" },
          { "name": "Audience", "type": "Text", "description": "Target audience segment description" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this source code is active for attribution" }
        ],
        "relationships": [
          { "target": "Campaign", "type": "child", "description": "Each source code belongs to a campaign" },
          { "target": "GiftTransaction", "type": "parent", "description": "Transactions reference source codes for granular attribution" },
          { "target": "GiftCommitmentChangeAttributionLog", "type": "parent", "description": "Commitment changes reference source codes for ROI tracking" }
        ]
      }
    ]
  },

  "programs": {
    "objects": [
      {
        "name": "Program",
        "type": "custom",
        "domain": "programs",
        "description": "Defines a structured program or service offering that the nonprofit delivers to its constituents. Each program record captures the name, summary, active status, and links to benefits, enrollments, and cohorts. Programs can represent educational initiatives, food distribution, housing assistance, job readiness, health services, or any mission-driven offering.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Program name" },
          { "name": "Summary", "type": "LongTextArea", "description": "Detailed description of the program's purpose and activities" },
          { "name": "Status", "type": "Picklist", "description": "Program lifecycle: Active, Inactive, Planned, Completed" },
          { "name": "StartDate", "type": "Date", "description": "Date when the program begins operations" },
          { "name": "EndDate", "type": "Date", "description": "Date when the program concludes, if applicable" }
        ],
        "relationships": [
          { "target": "Benefit", "type": "parent", "description": "Programs offer specific benefits and services to participants" },
          { "target": "ProgramEnrollment", "type": "parent", "description": "Participants enroll in programs" },
          { "target": "ProgramCohort", "type": "parent", "description": "Programs organize participants into cohorts" },
          { "target": "OutcomeDefinition", "type": "lookup", "description": "Programs are measured against defined outcomes" }
        ]
      },
      {
        "name": "Benefit",
        "type": "custom",
        "domain": "programs",
        "description": "Defines a specific service or good delivered by a program, such as counseling sessions, food packages, job training hours, or educational materials. Each benefit has a type classification, unit of measure, and active status. Benefits link to schedules that define delivery timing and to disbursement records that track actual service delivery volume.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Benefit name describing the service or good" },
          { "name": "ProgramId", "type": "Lookup", "description": "The program that offers this benefit" },
          { "name": "BenefitTypeId", "type": "Lookup", "description": "The type category: Coaching, Distribution, Training, etc." },
          { "name": "UnitOfMeasureId", "type": "Lookup", "description": "The unit used to measure delivery quantity" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this benefit is currently offered" }
        ],
        "relationships": [
          { "target": "Program", "type": "child", "description": "Each benefit belongs to a program" },
          { "target": "BenefitType", "type": "child", "description": "Benefits are classified by type" },
          { "target": "BenefitDisbursement", "type": "parent", "description": "Benefits are delivered through disbursement records" },
          { "target": "BenefitSchedule", "type": "parent", "description": "Benefits have delivery schedules" }
        ]
      },
      {
        "name": "BenefitType",
        "type": "custom",
        "domain": "programs",
        "description": "Categorizes benefits into types such as Coaching, Distribution, Training, Assessment, or Shelter. Benefit types provide a standardized classification system that enables cross-program reporting on service delivery by category. Organizations can create custom benefit types to match their specific service taxonomy.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Type name such as Coaching, Distribution, or Training" },
          { "name": "Description", "type": "LongTextArea", "description": "Explanation of what this benefit type covers" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this type is available for classifying benefits" }
        ],
        "relationships": [
          { "target": "Benefit", "type": "parent", "description": "Benefit types classify one or more benefits across programs" }
        ]
      },
      {
        "name": "UnitOfMeasure",
        "type": "custom",
        "domain": "programs",
        "description": "Defines the measurement unit for tracking benefit delivery quantities such as Hours, Sessions, Meals, Items, or Dollars. Units of measure standardize quantity tracking across benefits and programs, enabling aggregate reporting on total service delivery volume.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Unit name such as Hours, Sessions, Meals, or Items" },
          { "name": "Abbreviation", "type": "Text", "description": "Short form of the unit (e.g., hrs, qty)" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this unit is available for use" }
        ],
        "relationships": [
          { "target": "Benefit", "type": "parent", "description": "Units of measure are assigned to benefits for quantity tracking" }
        ]
      },
      {
        "name": "ProgramEnrollment",
        "type": "custom",
        "domain": "programs",
        "description": "Tracks participant registration and lifecycle status for each program. Each enrollment links a constituent account to a program with a status workflow progressing through Applied, Enrolled, Active, Completed, or Withdrawn. Enrollment records capture dates, notes, and the referral source that led the participant to the program.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated enrollment identifier" },
          { "name": "AccountId", "type": "Lookup", "description": "The participant account" },
          { "name": "ProgramId", "type": "Lookup", "description": "The program the participant is enrolling in" },
          { "name": "Status", "type": "Picklist", "description": "Enrollment status: Applied, Enrolled, Active, Completed, Withdrawn" },
          { "name": "EnrollmentDate", "type": "Date", "description": "Date when the participant enrolled" },
          { "name": "CompletionDate", "type": "Date", "description": "Date when the participant completed or withdrew" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each enrollment references a participant account" },
          { "target": "Program", "type": "child", "description": "Each enrollment references a program" },
          { "target": "ProgramCohort", "type": "lookup", "description": "Enrollees can be assigned to cohorts within the program" }
        ]
      },
      {
        "name": "ProgramCohort",
        "type": "custom",
        "domain": "programs",
        "description": "Groups program participants into cohorts for session management, reporting, and comparative analysis. Cohorts might represent different class sections, intake groups, or geographic groupings. Each cohort has a name, date range, and capacity, enabling staff to manage group-based service delivery and compare outcomes across participant groups.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Cohort name or identifier" },
          { "name": "ProgramId", "type": "Lookup", "description": "The program this cohort belongs to" },
          { "name": "StartDate", "type": "Date", "description": "Cohort start date" },
          { "name": "EndDate", "type": "Date", "description": "Cohort end date" },
          { "name": "Capacity", "type": "Number", "description": "Maximum number of participants in this cohort" }
        ],
        "relationships": [
          { "target": "Program", "type": "child", "description": "Each cohort belongs to a program" },
          { "target": "ProgramCohortMember", "type": "parent", "description": "Cohorts contain member records linking to participants" }
        ]
      },
      {
        "name": "ProgramCohortMember",
        "type": "custom",
        "domain": "programs",
        "description": "Junction object linking a participant to a specific program cohort. Each record captures the member's account, the cohort they belong to, and their membership status. This enables tracking which participants attended which cohort sessions and comparing outcomes across cohort groups.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated member identifier" },
          { "name": "ProgramCohortId", "type": "Lookup", "description": "The cohort this member belongs to" },
          { "name": "AccountId", "type": "Lookup", "description": "The participant account" },
          { "name": "Status", "type": "Picklist", "description": "Membership status: Active, Inactive, Completed" }
        ],
        "relationships": [
          { "target": "ProgramCohort", "type": "child", "description": "Each member record belongs to a cohort" },
          { "target": "Account", "type": "child", "description": "Each member references a participant account" }
        ]
      },
      {
        "name": "BenefitDisbursement",
        "type": "custom",
        "domain": "programs",
        "description": "Records the actual delivery of services and goods to program participants. Each disbursement tracks the beneficiary account, benefit, quantity delivered, date, and status. Ad hoc disbursements handle walk-in recipients not pre-enrolled. Disbursement data feeds outcome measurement and impact reporting.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated disbursement identifier" },
          { "name": "AccountId", "type": "Lookup", "description": "The participant receiving the benefit" },
          { "name": "BenefitId", "type": "Lookup", "description": "The benefit being delivered" },
          { "name": "Quantity", "type": "Number", "description": "Amount delivered in the benefit's unit of measure" },
          { "name": "DisbursementDate", "type": "Date", "description": "Date of service delivery" },
          { "name": "Status", "type": "Picklist", "description": "Delivery status: Scheduled, Delivered, Missed, Canceled" }
        ],
        "relationships": [
          { "target": "Benefit", "type": "child", "description": "Each disbursement delivers a specific benefit" },
          { "target": "Account", "type": "child", "description": "Each disbursement goes to a participant account" },
          { "target": "BenefitSession", "type": "lookup", "description": "Disbursements may be linked to scheduled benefit sessions" }
        ]
      },
      {
        "name": "BenefitSchedule",
        "type": "custom",
        "domain": "programs",
        "description": "Defines when and how often a benefit is delivered to participants. Each schedule specifies a recurrence pattern, start and end dates, and the quantity to be delivered per occurrence. Schedules drive the creation of benefit sessions for group-based service delivery and help staff plan resource allocation.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Schedule name describing the delivery pattern" },
          { "name": "BenefitId", "type": "Lookup", "description": "The benefit this schedule applies to" },
          { "name": "Frequency", "type": "Picklist", "description": "Delivery frequency: Daily, Weekly, Biweekly, Monthly" },
          { "name": "StartDate", "type": "Date", "description": "Schedule start date" },
          { "name": "EndDate", "type": "Date", "description": "Schedule end date" }
        ],
        "relationships": [
          { "target": "Benefit", "type": "child", "description": "Each schedule defines delivery timing for a benefit" },
          { "target": "BenefitSession", "type": "parent", "description": "Schedules generate individual benefit sessions" }
        ]
      },
      {
        "name": "BenefitSession",
        "type": "custom",
        "domain": "programs",
        "description": "Represents a single occurrence of a scheduled benefit delivery, such as one tutoring session, one meal distribution event, or one training class. Sessions track attendance, location, and facilitator information. Attendance updates flow to benefit disbursement records for accurate service delivery tracking.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Session name or date identifier" },
          { "name": "BenefitScheduleId", "type": "Lookup", "description": "The schedule that generated this session" },
          { "name": "SessionDate", "type": "DateTime", "description": "Date and time of the session" },
          { "name": "Location", "type": "Text", "description": "Where the session takes place" },
          { "name": "Status", "type": "Picklist", "description": "Session status: Scheduled, In Progress, Completed, Canceled" }
        ],
        "relationships": [
          { "target": "BenefitSchedule", "type": "child", "description": "Each session is generated from a benefit schedule" },
          { "target": "BenefitDisbursement", "type": "parent", "description": "Session attendance creates disbursement records" }
        ]
      },
      {
        "name": "BenefitAssignment",
        "type": "custom",
        "domain": "programs",
        "description": "Links a specific participant to a benefit they are expected to receive, enabling targeted service delivery tracking. Assignments define which participants are pre-authorized for which benefits, their assigned quantity, and the assignment period. This supports both individual and group-based benefit delivery models.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated assignment identifier" },
          { "name": "AccountId", "type": "Lookup", "description": "The participant assigned to receive this benefit" },
          { "name": "BenefitId", "type": "Lookup", "description": "The benefit the participant is assigned to receive" },
          { "name": "AssignedQuantity", "type": "Number", "description": "Total quantity the participant is expected to receive" },
          { "name": "Status", "type": "Picklist", "description": "Assignment status: Active, Completed, Suspended" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each assignment references a participant account" },
          { "target": "Benefit", "type": "child", "description": "Each assignment references a specific benefit" }
        ]
      },
      {
        "name": "GoalDefinition",
        "type": "custom",
        "domain": "programs",
        "description": "Creates hierarchical goal structures that define desired outcomes for program participants. Top-level goals decompose into intermediate goals, creating a theory of change framework. Goals link to benefits and outcomes, enabling staff to track whether service delivery is translating into measurable impact for participants and communities.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Goal name describing the desired outcome" },
          { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the goal and success criteria" },
          { "name": "ParentGoalId", "type": "Lookup", "description": "Parent goal for hierarchical goal structures" },
          { "name": "TargetDate", "type": "Date", "description": "Date by which the goal should be achieved" },
          { "name": "Status", "type": "Picklist", "description": "Goal status: Not Started, In Progress, Achieved, Not Achieved" }
        ],
        "relationships": [
          { "target": "OutcomeDefinition", "type": "lookup", "description": "Goals connect to outcome definitions for measurement" },
          { "target": "CarePlan", "type": "lookup", "description": "Care plans reference goal definitions for participant-level tracking" },
          { "target": "Program", "type": "lookup", "description": "Goals are associated with programs they measure" }
        ]
      }
    ],
    "metadata": [
      {
        "type": "ProgramManagementSetting__mdt",
        "name": "Program Management Settings",
        "fields": { "AutoEnrollmentEnabled__c": "Checkbox", "DefaultBenefitType__c": "Text", "DisbursementTrackingEnabled__c": "Checkbox", "GoalHierarchyDepth__c": "Number" },
        "description": "Configures program management behavior including automatic enrollment processing, default benefit type for new benefits, disbursement tracking activation, and maximum depth for goal definition hierarchies."
      }
    ]
  },

  "case_management": {
    "objects": [
      {
        "name": "Case",
        "type": "standard",
        "domain": "case_management",
        "description": "The core case management object tracking participant needs, referrals, and service coordination. In Nonprofit Cloud, Cases represent individual participant situations requiring assessment, planning, and follow-up. Each case has a status lifecycle, priority, and links to care plans, assessments, and interaction summaries that document the case management process.",
        "fields": [
          { "name": "CaseNumber", "type": "AutoNumber", "description": "System-generated case identifier" },
          { "name": "Subject", "type": "Text", "description": "Brief description of the case subject" },
          { "name": "Status", "type": "Picklist", "description": "Case lifecycle: New, In Progress, Pending, Closed" },
          { "name": "Priority", "type": "Picklist", "description": "Urgency level: Low, Medium, High, Critical" },
          { "name": "AccountId", "type": "Lookup", "description": "The participant account" },
          { "name": "ContactId", "type": "Lookup", "description": "The participant contact" },
          { "name": "Origin", "type": "Picklist", "description": "How the case was created: Self-Referral, Partner Agency, Internal, Phone" },
          { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the participant's needs" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each case references a participant account" },
          { "target": "CarePlan", "type": "parent", "description": "Cases can have personalized care plans" },
          { "target": "CaseReferral", "type": "parent", "description": "Cases can be created from referrals" },
          { "target": "InteractionSummary", "type": "parent", "description": "Cases have interaction summaries documenting meetings and notes" }
        ]
      },
      {
        "name": "CarePlan",
        "type": "custom",
        "domain": "case_management",
        "description": "A personalized, goal-oriented plan created for a program participant by their case manager. Care plans are built from templates and customized to the participant's specific needs, with pre-configured benefits and goals that can be adjusted. Each plan tracks progress through milestone completion and regular assessment check-ins.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Care plan name describing its focus area" },
          { "name": "AccountId", "type": "Lookup", "description": "The participant account this plan serves" },
          { "name": "CaseId", "type": "Lookup", "description": "The case this care plan addresses" },
          { "name": "CarePlanTemplateId", "type": "Lookup", "description": "The template used as a starting point" },
          { "name": "Status", "type": "Picklist", "description": "Plan status: Draft, Active, Completed, Discontinued" },
          { "name": "StartDate", "type": "Date", "description": "Plan start date" },
          { "name": "EndDate", "type": "Date", "description": "Plan end date" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each care plan serves a participant account" },
          { "target": "Case", "type": "child", "description": "Care plans are linked to cases" },
          { "target": "CarePlanTemplate", "type": "child", "description": "Care plans are built from templates" },
          { "target": "GoalDefinition", "type": "lookup", "description": "Care plans reference goal definitions for tracking progress" }
        ]
      },
      {
        "name": "CarePlanTemplate",
        "type": "custom",
        "domain": "case_management",
        "description": "Defines a reusable care plan starting point with pre-configured benefits and goals for common participant scenarios. Templates standardize care plan creation across case managers while allowing customization for individual needs. Each template specifies which benefits to include, which goals to track, and recommended assessment intervals.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Template name describing the scenario it addresses" },
          { "name": "Description", "type": "LongTextArea", "description": "Detailed description of when to use this template" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this template is available for use" }
        ],
        "relationships": [
          { "target": "CarePlan", "type": "parent", "description": "Templates are used to create care plan instances" },
          { "target": "CarePlanTemplateBenefit", "type": "parent", "description": "Templates include pre-configured benefit assignments" },
          { "target": "CarePlanTemplateGoal", "type": "parent", "description": "Templates include pre-configured goal definitions" }
        ]
      },
      {
        "name": "CarePlanTemplateBenefit",
        "type": "custom",
        "domain": "case_management",
        "description": "Links a benefit to a care plan template, specifying which services should be included when the template is used to create a new care plan. Each record references a benefit and the recommended quantity or duration for the participant. Case managers can adjust these defaults when customizing the plan.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated identifier" },
          { "name": "CarePlanTemplateId", "type": "Lookup", "description": "The parent care plan template" },
          { "name": "BenefitId", "type": "Lookup", "description": "The benefit to include in the plan" },
          { "name": "RecommendedQuantity", "type": "Number", "description": "Suggested delivery quantity for this benefit" }
        ],
        "relationships": [
          { "target": "CarePlanTemplate", "type": "child", "description": "Each template benefit belongs to a care plan template" },
          { "target": "Benefit", "type": "child", "description": "References the benefit to be included" }
        ]
      },
      {
        "name": "CarePlanTemplateGoal",
        "type": "custom",
        "domain": "case_management",
        "description": "Links a goal definition to a care plan template, specifying which outcomes should be tracked when the template creates a new care plan. Each record references a goal definition and includes a target timeframe for achievement. Case managers customize goals during plan creation.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated identifier" },
          { "name": "CarePlanTemplateId", "type": "Lookup", "description": "The parent care plan template" },
          { "name": "GoalDefinitionId", "type": "Lookup", "description": "The goal to include in the plan" },
          { "name": "TargetDays", "type": "Number", "description": "Recommended number of days to achieve this goal" }
        ],
        "relationships": [
          { "target": "CarePlanTemplate", "type": "child", "description": "Each template goal belongs to a care plan template" },
          { "target": "GoalDefinition", "type": "child", "description": "References the goal definition to track" }
        ]
      },
      {
        "name": "CaseReferral",
        "type": "custom",
        "domain": "case_management",
        "description": "Tracks inbound and outbound participant referrals between organizations and internal departments. Inbound referrals from partner agencies, self-referral, or community sources create new cases. Outbound referrals connect participants to external services. Each referral captures the referring party, receiving party, reason, and outcome status.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated referral identifier" },
          { "name": "CaseId", "type": "Lookup", "description": "The case created from or associated with this referral" },
          { "name": "ReferralType", "type": "Picklist", "description": "Direction: Inbound or Outbound" },
          { "name": "ReferringOrganization", "type": "Text", "description": "The organization making the referral" },
          { "name": "Reason", "type": "TextArea", "description": "Why the participant is being referred" },
          { "name": "Status", "type": "Picklist", "description": "Referral status: Pending, Accepted, Declined, Completed" }
        ],
        "relationships": [
          { "target": "Case", "type": "child", "description": "Each referral is linked to a case" },
          { "target": "Account", "type": "lookup", "description": "Referrals reference the participant account" }
        ]
      },
      {
        "name": "AssessmentTask",
        "type": "custom",
        "domain": "case_management",
        "description": "Represents a structured assessment administered to a program participant using the Discovery Framework. Assessment tasks capture evaluation data during intake and throughout participation, generating scores and recommendations that inform care plan adjustments. Results are stored as records linked to the participant's account and case.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Assessment name or type" },
          { "name": "AccountId", "type": "Lookup", "description": "The participant being assessed" },
          { "name": "DiscoveryFrameworkId", "type": "Lookup", "description": "The assessment framework used" },
          { "name": "Status", "type": "Picklist", "description": "Assessment status: Not Started, In Progress, Completed" },
          { "name": "Score", "type": "Number", "description": "Calculated assessment score" },
          { "name": "CompletedDate", "type": "DateTime", "description": "When the assessment was completed" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each assessment is completed for a participant" },
          { "target": "DiscoveryFramework", "type": "child", "description": "Assessments use a configured discovery framework" },
          { "target": "Case", "type": "lookup", "description": "Assessments are linked to participant cases" }
        ]
      },
      {
        "name": "DiscoveryFramework",
        "type": "custom",
        "domain": "case_management",
        "description": "Defines the structure and questions for participant assessments. Each framework specifies the assessment sections, questions, response options, and scoring logic. Discovery Frameworks enable standardized needs evaluations across case managers while supporting different assessment types for intake, periodic review, and program-specific evaluations.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Framework name describing the assessment type" },
          { "name": "Description", "type": "LongTextArea", "description": "Purpose and usage instructions for this framework" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this framework is available for use" },
          { "name": "ScoringMethod", "type": "Picklist", "description": "How scores are calculated: Sum, Average, Weighted" }
        ],
        "relationships": [
          { "target": "AssessmentTask", "type": "parent", "description": "Frameworks are used to create assessment task instances" }
        ]
      },
      {
        "name": "InteractionSummary",
        "type": "custom",
        "domain": "case_management",
        "description": "Captures detailed notes from meetings, conversations, and interactions with program participants, donors, caseworkers, and partners. Each summary includes the interaction type, date, participants, detailed notes, and next steps. Confidentiality controls protect sensitive information from unauthorized access. Notes are searchable and linked to relevant account or case records.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Interaction title or subject" },
          { "name": "AccountId", "type": "Lookup", "description": "The account this interaction relates to" },
          { "name": "InteractionType", "type": "Picklist", "description": "Type: Meeting, Phone Call, Email, Home Visit, Group Session" },
          { "name": "InteractionDate", "type": "DateTime", "description": "When the interaction took place" },
          { "name": "Notes", "type": "RichTextArea", "description": "Detailed notes from the interaction" },
          { "name": "NextSteps", "type": "LongTextArea", "description": "Planned follow-up actions" },
          { "name": "IsConfidential", "type": "Checkbox", "description": "Whether this interaction contains sensitive information requiring restricted access" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each interaction is linked to a constituent account" },
          { "target": "Case", "type": "lookup", "description": "Interactions can be linked to a case for case management context" }
        ]
      }
    ]
  },

  "outcomes": {
    "objects": [
      {
        "name": "OutcomeDefinition",
        "type": "custom",
        "domain": "outcomes",
        "description": "Describes the intended impact or change that programs aim to achieve. Each outcome definition articulates what success looks like, the target population, and the timeframe for measurement. Outcomes form a hierarchy that maps the organization's theory of change from activities to outputs to ultimate impact goals, enabling structured impact measurement.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Outcome name describing the desired impact" },
          { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the outcome and its significance" },
          { "name": "TargetPopulation", "type": "Text", "description": "The group of people this outcome applies to" },
          { "name": "ParentOutcomeId", "type": "Lookup", "description": "Parent outcome for hierarchical theory of change" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this outcome definition is currently tracked" }
        ],
        "relationships": [
          { "target": "Program", "type": "lookup", "description": "Outcomes link to the programs that drive them" },
          { "target": "Indicator", "type": "parent", "description": "Outcomes are measured through indicators" },
          { "target": "GoalDefinition", "type": "lookup", "description": "Outcomes connect to program goals" }
        ]
      },
      {
        "name": "Indicator",
        "type": "custom",
        "domain": "outcomes",
        "description": "Defines a specific metric used to measure progress toward an outcome. Each indicator specifies what to measure, the data collection method, frequency, and target values. Indicators can be quantitative (number of participants employed) or qualitative (participant satisfaction score), and they link to outcome definitions to create a complete measurement framework.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Indicator name describing the metric" },
          { "name": "OutcomeDefinitionId", "type": "Lookup", "description": "The outcome this indicator measures" },
          { "name": "DataType", "type": "Picklist", "description": "Data type: Number, Percent, Currency, Text" },
          { "name": "CollectionFrequency", "type": "Picklist", "description": "How often data is collected: Weekly, Monthly, Quarterly, Annually" },
          { "name": "TargetValue", "type": "Number", "description": "The target value that represents success" },
          { "name": "BaselineValue", "type": "Number", "description": "Starting value before program intervention" }
        ],
        "relationships": [
          { "target": "OutcomeDefinition", "type": "child", "description": "Each indicator measures a specific outcome" },
          { "target": "IndicatorResult", "type": "parent", "description": "Indicators accumulate result data points over time" }
        ]
      },
      {
        "name": "IndicatorResult",
        "type": "custom",
        "domain": "outcomes",
        "description": "Captures an actual measurement data point for an indicator at a specific point in time. Results record the measurement date, value, and collection context. Trending indicator results over time reveals whether programs are achieving their intended outcomes and where adjustments are needed to improve effectiveness.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated result identifier" },
          { "name": "IndicatorId", "type": "Lookup", "description": "The indicator this result measures" },
          { "name": "ResultValue", "type": "Number", "description": "The measured value" },
          { "name": "MeasurementDate", "type": "Date", "description": "Date when the measurement was taken" },
          { "name": "CollectionContext", "type": "TextArea", "description": "Notes about how and where the data was collected" }
        ],
        "relationships": [
          { "target": "Indicator", "type": "child", "description": "Each result belongs to an indicator" },
          { "target": "Program", "type": "lookup", "description": "Results are collected from program activities" }
        ]
      }
    ]
  },

  "volunteers": {
    "objects": [
      {
        "name": "VolunteerInitiative",
        "type": "custom",
        "domain": "volunteers",
        "description": "Defines a volunteer project, event, or ongoing program with start and end dates, headcount goals, and total hours targets. Initiatives support parent-child hierarchies for large programs with sub-initiatives. Each initiative is staffed by job positions with specified shifts. Published initiatives appear on Experience Cloud volunteer portals for self-service signup.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Initiative name" },
          { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the volunteer project" },
          { "name": "StartDate", "type": "Date", "description": "Initiative start date" },
          { "name": "EndDate", "type": "Date", "description": "Initiative end date" },
          { "name": "Status", "type": "Picklist", "description": "Initiative status: Planned, Active, Completed, Canceled" },
          { "name": "TargetVolunteerCount", "type": "Number", "description": "Target number of volunteers needed" },
          { "name": "TargetHours", "type": "Number", "description": "Target total volunteer hours" },
          { "name": "ParentInitiativeId", "type": "Lookup", "description": "Parent initiative for hierarchical structures" },
          { "name": "IsPublished", "type": "Checkbox", "description": "Whether this initiative is visible on the volunteer portal" }
        ],
        "relationships": [
          { "target": "JobPosition", "type": "parent", "description": "Initiatives are staffed by job positions" },
          { "target": "Program", "type": "lookup", "description": "Volunteer initiatives support program delivery" }
        ]
      },
      {
        "name": "Position",
        "type": "custom",
        "domain": "volunteers",
        "description": "Defines a generic volunteer role that can be reused across multiple initiatives. Positions describe the role requirements, qualifications, and general responsibilities. Examples include Tutor, Group Leader, Event Coordinator, and Kitchen Volunteer. Each position can be customized for specific initiatives through Job Position records.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Position title" },
          { "name": "Description", "type": "LongTextArea", "description": "Role description and general responsibilities" },
          { "name": "RequiredQualifications", "type": "LongTextArea", "description": "Qualifications needed for this role" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this position is available for use" }
        ],
        "relationships": [
          { "target": "JobPosition", "type": "parent", "description": "Generic positions are customized as job positions for specific initiatives" },
          { "target": "Competency", "type": "lookup", "description": "Positions may require specific competencies" }
        ]
      },
      {
        "name": "JobPosition",
        "type": "custom",
        "domain": "volunteers",
        "description": "Customizes a generic Position for a specific Volunteer Initiative with shift schedules, location, qualifications, and approval requirements. A Position can be used across multiple initiatives, while each Job Position is specific to one initiative. Job positions define the actual volunteer slots that people sign up for.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Job position name specific to this initiative" },
          { "name": "VolunteerInitiativeId", "type": "Lookup", "description": "The initiative this job position belongs to" },
          { "name": "PositionId", "type": "Lookup", "description": "The generic position this job position instantiates" },
          { "name": "Location", "type": "Text", "description": "Where the volunteer will work" },
          { "name": "RequiresApproval", "type": "Checkbox", "description": "Whether signup requires manager approval" },
          { "name": "HeadcountTarget", "type": "Number", "description": "Number of volunteers needed for this job position" }
        ],
        "relationships": [
          { "target": "VolunteerInitiative", "type": "child", "description": "Each job position belongs to a volunteer initiative" },
          { "target": "Position", "type": "child", "description": "Each job position references a generic position" },
          { "target": "JobPositionShift", "type": "parent", "description": "Job positions have one or more shifts" }
        ]
      },
      {
        "name": "JobPositionShift",
        "type": "custom",
        "domain": "volunteers",
        "description": "Defines a specific work period within a job position with start and end times, recurrence schedules, and capacity limits. Shift management supports recurring schedules for ongoing volunteer roles and tracks filled versus open capacity. Volunteers sign up for specific shifts through assignments.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Shift name or time slot description" },
          { "name": "JobPositionId", "type": "Lookup", "description": "The job position this shift belongs to" },
          { "name": "StartDateTime", "type": "DateTime", "description": "Shift start date and time" },
          { "name": "EndDateTime", "type": "DateTime", "description": "Shift end date and time" },
          { "name": "Capacity", "type": "Number", "description": "Maximum number of volunteers for this shift" },
          { "name": "FilledCount", "type": "Number", "description": "Number of volunteers currently assigned" }
        ],
        "relationships": [
          { "target": "JobPosition", "type": "child", "description": "Each shift belongs to a job position" },
          { "target": "JobPositionAssignment", "type": "parent", "description": "Shifts have volunteer assignments" }
        ]
      },
      {
        "name": "JobPositionAssignment",
        "type": "custom",
        "domain": "volunteers",
        "description": "Links a volunteer to a specific job position shift with status tracking through the assignment lifecycle. Assignments progress through Upcoming, In Progress, Completed, and No Show statuses. Each assignment records actual hours worked and enables volunteer hour reporting and recognition.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated assignment identifier" },
          { "name": "JobPositionShiftId", "type": "Lookup", "description": "The shift this volunteer is assigned to" },
          { "name": "AccountId", "type": "Lookup", "description": "The volunteer's person account" },
          { "name": "Status", "type": "Picklist", "description": "Assignment status: Upcoming, In Progress, Completed, No Show, Canceled" },
          { "name": "ActualHours", "type": "Number", "description": "Actual hours worked by the volunteer" }
        ],
        "relationships": [
          { "target": "JobPositionShift", "type": "child", "description": "Each assignment belongs to a shift" },
          { "target": "Account", "type": "child", "description": "Each assignment references a volunteer account" }
        ]
      },
      {
        "name": "Competency",
        "type": "custom",
        "domain": "volunteers",
        "description": "Defines a skill, qualification, or expertise area that can be required for volunteer positions and tracked for individual volunteers. Competencies include skills like First Aid Certification, Language Proficiency, CDL License, and Background Check Cleared. Competencies feed the volunteer matching algorithm.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Competency name" },
          { "name": "Description", "type": "LongTextArea", "description": "What this competency represents" },
          { "name": "Category", "type": "Picklist", "description": "Competency category: Skill, Certification, License, Background Check" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this competency is actively tracked" }
        ],
        "relationships": [
          { "target": "PersonCompetency", "type": "parent", "description": "Competencies are held by individuals through person competency records" },
          { "target": "Position", "type": "lookup", "description": "Positions may require specific competencies" }
        ]
      },
      {
        "name": "PersonCompetency",
        "type": "custom",
        "domain": "volunteers",
        "description": "Links an individual volunteer to a competency they possess, including the proficiency level, date achieved, and expiration date if applicable. Person competency records are evaluated during volunteer matching to identify qualified candidates for positions that require specific skills or certifications.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated identifier" },
          { "name": "AccountId", "type": "Lookup", "description": "The volunteer who holds this competency" },
          { "name": "CompetencyId", "type": "Lookup", "description": "The competency being recorded" },
          { "name": "ProficiencyLevel", "type": "Picklist", "description": "Proficiency: Beginner, Intermediate, Advanced, Expert" },
          { "name": "DateAchieved", "type": "Date", "description": "When the volunteer earned this competency" },
          { "name": "ExpirationDate", "type": "Date", "description": "When the competency expires, if applicable" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each person competency belongs to a volunteer account" },
          { "target": "Competency", "type": "child", "description": "References the competency definition" }
        ]
      },
      {
        "name": "Examination",
        "type": "custom",
        "domain": "volunteers",
        "description": "Defines a test, certification exam, or screening that volunteers may need to complete. Examinations specify the type of assessment, passing criteria, and validity period. Examples include background checks, safety training exams, and skill assessments used during volunteer onboarding and qualification verification.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Examination name" },
          { "name": "Description", "type": "LongTextArea", "description": "What this examination covers and how it is administered" },
          { "name": "PassingScore", "type": "Number", "description": "Minimum score required to pass" },
          { "name": "ValidityPeriod", "type": "Number", "description": "Number of months the result remains valid" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this examination is currently in use" }
        ],
        "relationships": [
          { "target": "PersonExamination", "type": "parent", "description": "Examinations are taken by individuals through person examination records" }
        ]
      },
      {
        "name": "PersonExamination",
        "type": "custom",
        "domain": "volunteers",
        "description": "Records an individual volunteer's attempt at an examination, capturing the score, pass/fail result, and completion date. Person examination records are evaluated during volunteer matching alongside competencies to verify that candidates meet all position requirements. Expired results can trigger re-examination workflows.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated identifier" },
          { "name": "AccountId", "type": "Lookup", "description": "The volunteer who took the examination" },
          { "name": "ExaminationId", "type": "Lookup", "description": "The examination that was taken" },
          { "name": "Score", "type": "Number", "description": "Score achieved on the examination" },
          { "name": "Passed", "type": "Checkbox", "description": "Whether the volunteer passed" },
          { "name": "CompletedDate", "type": "Date", "description": "Date the examination was completed" },
          { "name": "ExpirationDate", "type": "Date", "description": "Date when this result expires" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each exam result belongs to a volunteer account" },
          { "target": "Examination", "type": "child", "description": "References the examination definition" }
        ]
      },
      {
        "name": "PersonLocationAvailability",
        "type": "custom",
        "domain": "volunteers",
        "description": "Records a volunteer's geographic availability and preferred work locations. Each record specifies an area, address, or radius where the volunteer is willing to serve. Location availability is used by the volunteer matching algorithm alongside competencies and schedule to find the best-fit candidates for location-specific positions.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Location description" },
          { "name": "AccountId", "type": "Lookup", "description": "The volunteer who is available at this location" },
          { "name": "City", "type": "Text", "description": "City where the volunteer is available" },
          { "name": "State", "type": "Text", "description": "State or province" },
          { "name": "MaxDistanceMiles", "type": "Number", "description": "Maximum distance the volunteer is willing to travel" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each location availability belongs to a volunteer account" }
        ]
      }
    ]
  },

  "grantmaking": {
    "objects": [
      {
        "name": "FundingOpportunity",
        "type": "custom",
        "domain": "grantmaking",
        "description": "Creates and publishes grant opportunities that applicants can discover and apply for through Experience Cloud portals. Each opportunity includes eligibility criteria, application deadlines, available funding amount, and required documentation. Published opportunities are visible to external applicant organizations for self-service application submission.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Funding opportunity title" },
          { "name": "Description", "type": "RichTextArea", "description": "Detailed description of the funding opportunity" },
          { "name": "FundingAmount", "type": "Currency", "description": "Total funding available for this opportunity" },
          { "name": "ApplicationDeadline", "type": "DateTime", "description": "Last date to submit applications" },
          { "name": "EligibilityCriteria", "type": "LongTextArea", "description": "Requirements applicants must meet" },
          { "name": "Status", "type": "Picklist", "description": "Opportunity status: Draft, Open, Closed, Awarded" },
          { "name": "IsPublished", "type": "Checkbox", "description": "Whether visible on the grantee portal" }
        ],
        "relationships": [
          { "target": "GrantApplication", "type": "parent", "description": "Funding opportunities receive grant applications" },
          { "target": "Program", "type": "lookup", "description": "Funding opportunities may be tied to specific programs" }
        ]
      },
      {
        "name": "GrantApplication",
        "type": "custom",
        "domain": "grantmaking",
        "description": "Manages the full lifecycle of a grant application from submission through review to award or decline. Applications capture applicant organization information, proposed budget, project narrative, and supporting documents. Multi-stage review workflows route applications through internal evaluators with scoring and comments for informed decision-making.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated application identifier" },
          { "name": "FundingOpportunityId", "type": "Lookup", "description": "The funding opportunity being applied for" },
          { "name": "ApplicantAccountId", "type": "Lookup", "description": "The organization submitting the application" },
          { "name": "RequestedAmount", "type": "Currency", "description": "Amount of funding requested" },
          { "name": "ProjectNarrative", "type": "RichTextArea", "description": "Description of the proposed project" },
          { "name": "Status", "type": "Picklist", "description": "Application status: Draft, Submitted, Under Review, Awarded, Declined" },
          { "name": "SubmittedDate", "type": "DateTime", "description": "When the application was submitted" }
        ],
        "relationships": [
          { "target": "FundingOpportunity", "type": "child", "description": "Each application is for a specific funding opportunity" },
          { "target": "Account", "type": "child", "description": "Applications reference the applicant organization account" },
          { "target": "ApplicationReview", "type": "parent", "description": "Applications are evaluated through review records" },
          { "target": "FundingAward", "type": "parent", "description": "Approved applications receive funding awards" }
        ]
      },
      {
        "name": "ApplicationReview",
        "type": "custom",
        "domain": "grantmaking",
        "description": "Records an internal evaluator's assessment of a grant application. Each review captures the reviewer, numeric scores across evaluation criteria, qualitative comments, and a recommendation (Approve, Decline, Revise and Resubmit). Multiple reviews per application enable panel-based evaluation with aggregated scoring.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated review identifier" },
          { "name": "GrantApplicationId", "type": "Lookup", "description": "The application being reviewed" },
          { "name": "ReviewerId", "type": "Lookup", "description": "The user performing the review" },
          { "name": "Score", "type": "Number", "description": "Numeric evaluation score" },
          { "name": "Comments", "type": "RichTextArea", "description": "Qualitative assessment comments" },
          { "name": "Recommendation", "type": "Picklist", "description": "Reviewer recommendation: Approve, Decline, Revise and Resubmit" }
        ],
        "relationships": [
          { "target": "GrantApplication", "type": "child", "description": "Each review evaluates a specific application" }
        ]
      },
      {
        "name": "Budget",
        "type": "custom",
        "domain": "grantmaking",
        "description": "Tracks proposed and approved budget details for grant applications. Budget records categorize spending by program activity, personnel, overhead, and direct costs. Budgets support line-item detail with justification narratives, enabling grantmakers to evaluate the financial viability and reasonableness of proposed projects.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Budget name or category" },
          { "name": "GrantApplicationId", "type": "Lookup", "description": "The application this budget belongs to" },
          { "name": "Category", "type": "Picklist", "description": "Budget category: Personnel, Direct Costs, Overhead, Travel, Equipment" },
          { "name": "RequestedAmount", "type": "Currency", "description": "Amount requested for this budget line" },
          { "name": "ApprovedAmount", "type": "Currency", "description": "Amount approved for this budget line" },
          { "name": "Justification", "type": "LongTextArea", "description": "Narrative explaining why this cost is necessary" }
        ],
        "relationships": [
          { "target": "GrantApplication", "type": "child", "description": "Each budget belongs to a grant application" },
          { "target": "FundingAward", "type": "lookup", "description": "Approved budgets inform funding award amounts" }
        ]
      },
      {
        "name": "FundingAward",
        "type": "custom",
        "domain": "grantmaking",
        "description": "Represents an approved grant award with the approved amount, disbursement schedule, and reporting requirements. Funding awards are created when grant applications are approved and link to the grantee organization account. Awards track actual disbursements against the approved schedule and trigger outcome reporting requirements.",
        "fields": [
          { "name": "Name", "type": "AutoNumber", "description": "System-generated award identifier" },
          { "name": "GrantApplicationId", "type": "Lookup", "description": "The approved application" },
          { "name": "AccountId", "type": "Lookup", "description": "The grantee organization account" },
          { "name": "AwardAmount", "type": "Currency", "description": "Total approved funding amount" },
          { "name": "AwardDate", "type": "Date", "description": "Date the award was granted" },
          { "name": "Status", "type": "Picklist", "description": "Award status: Active, Completed, Suspended, Terminated" },
          { "name": "DisbursedAmount", "type": "Currency", "description": "Total amount disbursed to date" }
        ],
        "relationships": [
          { "target": "GrantApplication", "type": "child", "description": "Each award results from an approved application" },
          { "target": "Account", "type": "child", "description": "Awards are linked to the grantee organization" },
          { "target": "OutcomeDefinition", "type": "lookup", "description": "Awards require grantees to report on defined outcomes" }
        ]
      }
    ]
  },

  "agentforce": {
    "objects": []
  },

  "action_plans": {
    "objects": [
      {
        "name": "ActionPlan",
        "type": "custom",
        "domain": "action_plans",
        "description": "An instance of an action plan created from a template and applied to a specific record such as an opportunity, case, or volunteer initiative. Each action plan contains generated tasks with calculated due dates and assignments based on the template configuration. Completion tracking shows overall plan progress as tasks are finished.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Action plan name, usually derived from the template" },
          { "name": "ActionPlanTemplateId", "type": "Lookup", "description": "The template used to create this plan" },
          { "name": "TargetId", "type": "Lookup", "description": "The record this plan is applied to (polymorphic: Opportunity, Case, Initiative)" },
          { "name": "Status", "type": "Picklist", "description": "Plan status: Not Started, In Progress, Completed" },
          { "name": "StartDate", "type": "Date", "description": "Date the plan was initiated" },
          { "name": "CompletionPercentage", "type": "Percent", "description": "Percentage of tasks completed" }
        ],
        "relationships": [
          { "target": "ActionPlanTemplate", "type": "child", "description": "Each plan is created from a template" },
          { "target": "ActionPlanItem", "type": "parent", "description": "Plans contain task items to be completed" }
        ]
      },
      {
        "name": "ActionPlanTemplate",
        "type": "custom",
        "domain": "action_plans",
        "description": "Defines a reusable sequence of tasks for common business processes. Each template specifies task items with assignees, due date offsets, priorities, and dependencies. Templates can be created for donor stewardship, volunteer onboarding, program enrollment, case management workflows, and grant review processes.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Template name describing the process" },
          { "name": "Description", "type": "LongTextArea", "description": "Detailed description of when to use this template" },
          { "name": "TargetObjectType", "type": "Picklist", "description": "Object type this template applies to: Opportunity, Case, Initiative" },
          { "name": "IsActive", "type": "Checkbox", "description": "Whether this template is available for use" }
        ],
        "relationships": [
          { "target": "ActionPlan", "type": "parent", "description": "Templates are used to create action plan instances" },
          { "target": "ActionPlanTemplateItem", "type": "parent", "description": "Templates contain template item definitions" }
        ]
      },
      {
        "name": "ActionPlanTemplateItem",
        "type": "custom",
        "domain": "action_plans",
        "description": "Defines a single task within an action plan template. Each item specifies the task name, description, default assignee, priority, number of days until due (offset from plan start), and any dependency on another template item. When an action plan is created from the template, each item generates a corresponding action plan item.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Task name" },
          { "name": "ActionPlanTemplateId", "type": "Lookup", "description": "The parent template" },
          { "name": "Description", "type": "LongTextArea", "description": "Task description and instructions" },
          { "name": "DaysFromStart", "type": "Number", "description": "Number of days from plan start until this task is due" },
          { "name": "Priority", "type": "Picklist", "description": "Task priority: Low, Normal, High" },
          { "name": "DependsOnItemId", "type": "Lookup", "description": "Another template item that must be completed first" }
        ],
        "relationships": [
          { "target": "ActionPlanTemplate", "type": "child", "description": "Each item belongs to a template" }
        ]
      },
      {
        "name": "ActionPlanItem",
        "type": "custom",
        "domain": "action_plans",
        "description": "A generated task instance within an action plan, created from a template item. Each action plan item has a calculated due date, assigned user, priority, and completion status. Items with dependencies are blocked until their predecessor is completed, ensuring tasks execute in the correct sequence.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Task name from the template item" },
          { "name": "ActionPlanId", "type": "Lookup", "description": "The parent action plan" },
          { "name": "AssignedToId", "type": "Lookup", "description": "The user assigned to complete this task" },
          { "name": "DueDate", "type": "Date", "description": "Calculated due date based on plan start and offset" },
          { "name": "Status", "type": "Picklist", "description": "Task status: Not Started, In Progress, Completed" },
          { "name": "Priority", "type": "Picklist", "description": "Task priority: Low, Normal, High" }
        ],
        "relationships": [
          { "target": "ActionPlan", "type": "child", "description": "Each item belongs to an action plan" }
        ]
      },
      {
        "name": "StageDefinition",
        "type": "custom",
        "domain": "action_plans",
        "description": "Defines lifecycle stages for key objects using a configurable stage framework. Stage definitions specify the progression path for volunteer initiatives, job positions, job position assignments, and application forms. Each stage can trigger action plans at transitions, automating follow-up tasks when records advance to new stages.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Stage name" },
          { "name": "ObjectType", "type": "Picklist", "description": "The object this stage applies to: Initiative, Position, Assignment" },
          { "name": "StageOrder", "type": "Number", "description": "Sequential order of this stage in the progression" },
          { "name": "Description", "type": "LongTextArea", "description": "Description of what this stage represents" },
          { "name": "ActionPlanTemplateId", "type": "Lookup", "description": "Template to trigger when a record enters this stage" }
        ],
        "relationships": [
          { "target": "ActionPlanTemplate", "type": "lookup", "description": "Stage transitions can trigger action plan templates" },
          { "target": "VolunteerInitiative", "type": "lookup", "description": "Stages track volunteer initiative lifecycle progress" }
        ]
      }
    ]
  },

  "security": {
    "objects": [
      {
        "name": "PermissionSetGroup",
        "type": "standard",
        "domain": "security",
        "description": "Bundles multiple permission sets into manageable groups for role-based access control. Nonprofit Cloud uses permission set groups to grant users access to specific product areas: Fundraising Access, Program Management, Outcome Management, Grantmaking Manager, and Manage Volunteer Data. This consolidated approach replaces NPSP's fragmented per-package permission model.",
        "fields": [],
        "relationships": []
      },
      {
        "name": "PermissionSetLicense",
        "type": "standard",
        "domain": "security",
        "description": "Controls which Nonprofit Cloud features are available in the org by extending platform capabilities with product-specific licenses. Each product area (Fundraising, Program Management, Volunteer Management, Grantmaking, Outcome Management) has associated permission set licenses that must be assigned to users before the corresponding permission sets take effect.",
        "fields": [],
        "relationships": []
      }
    ]
  },

  "setup": {
    "objects": [],
    "metadata": [
      {
        "type": "NonprofitCloudSetting__mdt",
        "name": "Nonprofit Cloud Settings",
        "fields": { "FundraisingEnabled__c": "Checkbox", "ProgramManagementEnabled__c": "Checkbox", "VolunteerManagementEnabled__c": "Checkbox", "GrantmakingEnabled__c": "Checkbox", "OutcomeManagementEnabled__c": "Checkbox" },
        "description": "Master configuration for enabling and disabling Nonprofit Cloud product areas. Each feature toggle controls whether the corresponding objects, page layouts, and automation are active in the org. Features should be enabled in a sandbox first, as some cannot be disabled once turned on."
      },
      {
        "type": "DataProcessingEngineDefinition__mdt",
        "name": "Data Processing Engine Definitions",
        "fields": { "SourceObject__c": "Text", "TargetObject__c": "Text", "CalculationType__c": "Picklist", "IsActive__c": "Checkbox" },
        "description": "Configures Data Processing Engine batch jobs that power automated rollup calculations across Nonprofit Cloud. DPE definitions specify the source objects to aggregate, target objects to update, and the calculation logic. Used for designation rollup totals, campaign performance metrics, and program enrollment counts."
      }
    ]
  }

};
