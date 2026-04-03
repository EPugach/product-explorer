// ══════════════════════════════════════════════════════════════
//  Public Sector Solutions Entities — Objects
//  Native Salesforce product (no managed package prefix)
// ══════════════════════════════════════════════════════════════

export default {

"setup_and_security": {
  "objects": [
    {
      "name": "RegulatoryAuthority",
      "type": "standard",
      "domain": "setup_and_security",
      "description": "Represents a government department or agency responsible for licensing, regulating, and overseeing specific industries. Examples include the Department of Motor Vehicles, Board of Barbering and Cosmetology, and Department of Building Inspection. Regulatory authorities own the regulatory codes and authorization types that define compliance standards for businesses and individuals.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the regulatory authority, such as Department of Building Inspection" },
        { "name": "Description", "type": "LongTextArea", "description": "Summary of the authority's jurisdiction, responsibilities, and scope of oversight" },
        { "name": "AuthorityType", "type": "Picklist", "description": "Categorizes the authority by function such as Licensing, Inspection, or Regulatory Enforcement" },
        { "name": "Status", "type": "Picklist", "description": "Indicates whether the regulatory authority is active or inactive" },
        { "name": "JurisdictionLevel", "type": "Picklist", "description": "Geographic scope of the authority such as Federal, State, County, or Municipal" }
      ],
      "relationships": [
        { "target": "RegulatoryAuthorizationType", "type": "parent", "description": "Owns the authorization types (licenses and permits) that this authority issues" },
        { "target": "RegulatoryCode", "type": "parent", "description": "Owns the regulatory codes that define compliance standards within this authority's jurisdiction" }
      ]
    },
    {
      "name": "BusinessType",
      "type": "standard",
      "domain": "setup_and_security",
      "description": "Defines categories of businesses that operate within a jurisdiction and require specific licenses and permits. Business types are mapped to regulatory authorization types through the BusRegAuthorizationType junction object, establishing which permits each type of business must obtain. Used in the Permits Lightning web component to show required authorizations for a business.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the business type such as Salon, Restaurant, or Construction Contractor" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the business category and its regulatory requirements" },
        { "name": "Status", "type": "Picklist", "description": "Indicates whether the business type is actively tracked by the regulatory authority" },
        { "name": "IndustryCode", "type": "Text", "description": "Industry classification code such as NAICS or SIC code associated with this business type" }
      ],
      "relationships": [
        { "target": "BusRegAuthorizationType", "type": "parent", "description": "Maps this business type to required regulatory authorization types through junction records" }
      ]
    },
    {
      "name": "AccountAccountRelation",
      "type": "standard",
      "domain": "setup_and_security",
      "description": "Establishes relationships between account records to model complex organizational structures in public sector workflows. Enables contacts to be associated with multiple accounts, supporting scenarios like a business owner who has multiple licensed establishments or an individual who is both an applicant and an employer. Field Audit Trail is enabled on this object for compliance tracking.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this account-to-account relationship" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the primary account in the relationship" },
        { "name": "RelatedAccountId", "type": "Lookup", "description": "Reference to the related account in the relationship" },
        { "name": "RelationshipType", "type": "Picklist", "description": "Type of relationship such as Parent, Subsidiary, Partner, or Affiliated" },
        { "name": "StartDate", "type": "Date", "description": "Date when the relationship between the two accounts became effective" },
        { "name": "EndDate", "type": "Date", "description": "Date when the relationship ended or is expected to end" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the primary account in the relationship" },
        { "target": "Account", "type": "lookup", "description": "Links to the related account in the relationship" }
      ]
    },
    {
      "name": "ContactContactRelation",
      "type": "standard",
      "domain": "setup_and_security",
      "description": "Tracks relationships between individual contacts in Public Sector Solutions to model family, household, and professional connections. Supports caseworkers in understanding constituent networks for social programs, benefit management, and investigative cases. Field Audit Trail is enabled on this object to comply with data retention requirements.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this contact-to-contact relationship" },
        { "name": "ContactId", "type": "Lookup", "description": "Reference to the first contact in the relationship" },
        { "name": "RelatedContactId", "type": "Lookup", "description": "Reference to the second contact in the relationship" },
        { "name": "RelationshipType", "type": "Picklist", "description": "Nature of the relationship such as Spouse, Parent, Child, Sibling, or Guardian" },
        { "name": "IsActive", "type": "Checkbox", "description": "Indicates whether this contact relationship is currently active" }
      ],
      "relationships": [
        { "target": "Contact", "type": "lookup", "description": "Links to the first contact in the relationship" },
        { "target": "Contact", "type": "lookup", "description": "Links to the second related contact in the relationship" }
      ]
    },
    {
      "name": "PartyRelationshipGroup",
      "type": "standard",
      "domain": "setup_and_security",
      "description": "Defines groups of individuals such as households, trusts, or legal entities that are managed as a collective unit for public sector services. Enables agencies to deliver support services tailored to the group, such as household-level benefit calculations or family-based care plan assignments. Groups are displayed in the Actionable Relationship Center component for visual relationship management.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name for the relationship group such as Smith Household or Doe Family Trust" },
        { "name": "GroupType", "type": "Picklist", "description": "Category of the group such as Household, Trust, Legal Entity, or Organization" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the group's composition and purpose" },
        { "name": "Status", "type": "Picklist", "description": "Indicates whether the group is actively tracked" }
      ],
      "relationships": [
        { "target": "PartyRoleRelation", "type": "parent", "description": "Contains member records defining who belongs to the group and their roles" }
      ]
    },
    {
      "name": "PartyRoleRelation",
      "type": "standard",
      "domain": "setup_and_security",
      "description": "Assigns individuals to party relationship groups with specific roles, establishing membership in households, trusts, or other organizational units. Roles define the individual's function within the group such as Head of Household, Dependent, Beneficiary, or Trustee. Used by benefit management to calculate household-level eligibility and by social programs for family-based care plans.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Descriptive name for this role assignment within the group" },
        { "name": "PartyRelationshipGroupId", "type": "Lookup", "description": "Reference to the party relationship group this member belongs to" },
        { "name": "RelatedAccountId", "type": "Lookup", "description": "Reference to the account representing the individual in this group" },
        { "name": "RoleType", "type": "Picklist", "description": "The role this individual plays in the group such as Head of Household, Dependent, or Guardian" },
        { "name": "StartDate", "type": "Date", "description": "Date when the individual became a member of the group" },
        { "name": "EndDate", "type": "Date", "description": "Date when the individual's membership in the group ended" }
      ],
      "relationships": [
        { "target": "PartyRelationshipGroup", "type": "lookup", "description": "Links this member to the party relationship group they belong to" },
        { "target": "Account", "type": "lookup", "description": "Identifies the individual account assigned to this group role" }
      ]
    }
  ]
},

"common_features": {
  "objects": [
    {
      "name": "ActionPlanBaseTemplateAsgn",
      "type": "standard",
      "domain": "common_features",
      "description": "Links an action plan template to a base template, enabling template inheritance and reuse across different business processes. Base template assignments allow agencies to standardize common task sequences for inspections, benefit reviews, and social program workflows while allowing domain-specific customization. Field Audit Trail is enabled on this object.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Descriptive name for this base template assignment" },
        { "name": "ActionPlanTemplateId", "type": "Lookup", "description": "Reference to the action plan template being assigned to a base template" },
        { "name": "BaseTemplateId", "type": "Lookup", "description": "Reference to the base template that serves as the foundation for this assignment" },
        { "name": "IsActive", "type": "Checkbox", "description": "Indicates whether this base template assignment is currently active" }
      ],
      "relationships": [
        { "target": "ActionPlanTemplate", "type": "lookup", "description": "Links to the specific action plan template used in this assignment" }
      ]
    },
    {
      "name": "ActionPlanTemplateAssignment",
      "type": "standard",
      "domain": "common_features",
      "description": "Associates an action plan template with a specific record type or object, defining which template is used when creating action plans from a particular context. Controls which inspection types, license applications, benefit reviews, or social program workflows use which set of predefined tasks and checklists. Field Audit Trail is enabled on this object for compliance.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this template-to-record type assignment" },
        { "name": "ActionPlanTemplateId", "type": "Lookup", "description": "Reference to the action plan template being assigned" },
        { "name": "TargetObjectType", "type": "Text", "description": "API name of the object this template applies to such as BusinessLicenseApplication or Visit" },
        { "name": "RecordTypeId", "type": "Lookup", "description": "Reference to the specific record type this template is assigned to, if applicable" }
      ],
      "relationships": [
        { "target": "ActionPlanTemplate", "type": "lookup", "description": "Links to the action plan template used for this assignment" }
      ]
    },
    {
      "name": "DocumentChecklistItem",
      "type": "standard",
      "domain": "common_features",
      "description": "Tracks constituent-submitted documents through approval workflows for license applications, benefit requests, and investigative evidence. Each checklist item represents a required document with status tracking, review dates, and links to the parent record. Supports Intelligent Document Automation for OCR extraction from handwritten forms and Intelligent Form Reader for creating digital records from paper applications.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the document checklist item such as Proof of Identity or Business Registration Certificate" },
        { "name": "ParentRecordId", "type": "Lookup", "description": "Reference to the parent record this document supports, such as a license application or benefit application" },
        { "name": "DocumentTypeId", "type": "Lookup", "description": "Reference to the document type that categorizes this checklist item" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the document such as Required, Submitted, Under Review, Approved, or Rejected" },
        { "name": "ReviewDate", "type": "Date", "description": "Date when the document was last reviewed by a caseworker or intake officer" },
        { "name": "Comments", "type": "LongTextArea", "description": "Reviewer comments or notes about the submitted document" }
      ],
      "relationships": [
        { "target": "DocumentType", "type": "lookup", "description": "Classifies this checklist item by document category for routing and validation" },
        { "target": "BusinessLicenseApplication", "type": "lookup", "description": "Links to a license application when this document supports a licensing workflow" }
      ]
    },
    {
      "name": "OmniAssessmentTask",
      "type": "standard",
      "domain": "common_features",
      "description": "Represents a single evaluation task within a Dynamic Assessment that inspectors, investigators, and caseworkers complete during visits or reviews. Each task contains assessment questions displayed through OmniStudio components, with Compliance Status tracking and automatic violation creation on failure. Tasks appear in the Assessment List component on record pages for care plans, license applications, public complaints, and visits.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Descriptive name for the assessment task such as Fire Safety Inspection or Income Verification" },
        { "name": "AssessmentId", "type": "Lookup", "description": "Reference to the parent assessment this task belongs to" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the task such as Not Started, In Progress, or Completed" },
        { "name": "ActionPlanId", "type": "Lookup", "description": "Reference to the action plan that contains this assessment task" },
        { "name": "ComplianceStatus", "type": "Picklist", "description": "Overall compliance result: Pass, Fail, NA, or Issue" }
      ],
      "relationships": [
        { "target": "Assessment", "type": "lookup", "description": "Links to the parent assessment record containing this task" },
        { "target": "ActionPlan", "type": "lookup", "description": "Associates this assessment task with the action plan driving the workflow" }
      ]
    },
    {
      "name": "Assessment",
      "type": "standard",
      "domain": "common_features",
      "description": "Stores the results of a Discovery Framework or Dynamic Assessment evaluation conducted on a constituent, application, or site. Assessments capture structured responses to assessment questions and are used across Public Sector Solutions for benefit eligibility prescreening, inspection compliance evaluations, complaint investigations, and grantmaking reviews. Records link to accounts, cases, and care plans.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Descriptive name identifying this assessment instance" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the constituent account being assessed" },
        { "name": "CaseId", "type": "Lookup", "description": "Reference to the case record associated with this assessment" },
        { "name": "Status", "type": "Picklist", "description": "Current status such as In Progress, Completed, or Archived" },
        { "name": "AssessmentType", "type": "Picklist", "description": "Category of assessment such as Eligibility, Compliance, Investigation, or Intake" },
        { "name": "CompletedDate", "type": "DateTime", "description": "Date and time when the assessment was completed" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links the assessment to the constituent being evaluated" },
        { "target": "Case", "type": "lookup", "description": "Associates this assessment with a specific case for investigation or intake" }
      ]
    },
    {
      "name": "AssessmentQuestion",
      "type": "standard",
      "domain": "common_features",
      "description": "Defines individual questions used in Discovery Framework and Dynamic Assessment evaluations. Questions specify data types (Checkbox, Date, DateTime, Decimal, Integer, Multi-select, Radio, Select, Text, Text Area, Time), categories for logical grouping, and can be related to regulatory codes and violation types for inspection compliance. Active questions are reusable across multiple Omniscript assessment forms.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Short name for the assessment question such as Fire Extinguishers Present or Area of Establishment" },
        { "name": "QuestionText", "type": "LongTextArea", "description": "The full text of the question displayed to the assessor or constituent" },
        { "name": "DataType", "type": "Picklist", "description": "Response data type: Checkbox, Date, DateTime, Decimal, Integer, Multi-select, Radio, Select, Text, Text Area, or Time" },
        { "name": "Category", "type": "Picklist", "description": "Logical grouping for the question such as Demographic, Financial, Fire Safety Inspection, or Public Safety Complaint" },
        { "name": "IsActive", "type": "Checkbox", "description": "Indicates whether this question is available for use in Omniscript forms" },
        { "name": "ResponseValues", "type": "LongTextArea", "description": "Allowed response values for Radio, Multi-select, and Select data types, entered on separate lines" }
      ],
      "relationships": [
        { "target": "AssessmentQuestionVersion", "type": "parent", "description": "Contains versioned instances of this question for tracking changes over time" },
        { "target": "RegulatoryCodeUse", "type": "parent", "description": "Links question versions to applicable regulatory codes for inspection compliance" }
      ]
    },
    {
      "name": "AssessmentQuestionResponse",
      "type": "standard",
      "domain": "common_features",
      "description": "Stores an individual response to an assessment question within a completed assessment. Captures the response value, compliance status for regulatory evaluations, and a lookup to any resulting regulatory code violation. When an inspector selects Fail for Compliance Status on a question tied to a regulatory code, Public Sector Solutions automatically creates a violation record.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Auto-generated name for this response record" },
        { "name": "AssessmentId", "type": "Lookup", "description": "Reference to the parent assessment containing this response" },
        { "name": "AssessmentQuestionId", "type": "Lookup", "description": "Reference to the question being answered" },
        { "name": "ResponseValue", "type": "Text", "description": "The actual response provided by the assessor or constituent" },
        { "name": "ComplianceStatus", "type": "Picklist", "description": "Regulatory compliance result: Pass, Fail, NA, or Issue" },
        { "name": "ResponseValueScore", "type": "Number", "description": "Numeric score assigned to this response for quantitative evaluations" }
      ],
      "relationships": [
        { "target": "Assessment", "type": "lookup", "description": "Links this response to its parent assessment" },
        { "target": "AssessmentQuestion", "type": "lookup", "description": "Identifies which question this response answers" },
        { "target": "RegulatoryCodeViolation", "type": "lookup", "description": "Links to the violation record automatically created when compliance status is Fail" }
      ]
    },
    {
      "name": "AssessmentQuestionVersion",
      "type": "standard",
      "domain": "common_features",
      "description": "Represents a versioned instance of an assessment question, allowing agencies to track changes to question text, response values, and configuration over time while maintaining historical assessment data integrity. Versions are linked to regulatory code uses and violation type uses through related lists, enabling inspectors to see applicable codes and violation types during Dynamic Assessments.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Version identifier for this assessment question instance" },
        { "name": "AssessmentQuestionId", "type": "Lookup", "description": "Reference to the parent assessment question" },
        { "name": "VersionNumber", "type": "Number", "description": "Sequential version number for this question version" },
        { "name": "IsActive", "type": "Checkbox", "description": "Indicates whether this version is the currently active version of the question" }
      ],
      "relationships": [
        { "target": "AssessmentQuestion", "type": "lookup", "description": "Links back to the parent assessment question this version belongs to" },
        { "target": "RegulatoryCodeUse", "type": "child", "description": "Regulatory code use records associate this question version with applicable compliance codes" }
      ]
    },
    {
      "name": "InteractionSummary",
      "type": "standard",
      "domain": "common_features",
      "description": "Captures detailed meeting notes and interaction records created by caseworkers, case managers, and other staff. Supports rich text content, attendees, action items, interest tags for categorization, and file attachments. Notes can be published to lock them as official evidence and shared with specific users through compliant data sharing. Available on cases, care plans, benefits, goals, complaints, referrals, and accounts.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Title or subject of the interaction summary" },
        { "name": "InteractionId", "type": "Lookup", "description": "Reference to the parent interaction record" },
        { "name": "NoteContent", "type": "RichTextArea", "description": "Rich text body containing meeting notes, observations, and action items" },
        { "name": "InteractionNotePublished", "type": "Checkbox", "description": "When true, the note is locked and cannot be further edited, serving as official evidence" },
        { "name": "InteractionType", "type": "Picklist", "description": "Type of interaction such as Phone Call, In-Person Meeting, Home Visit, or Email" },
        { "name": "InteractionDate", "type": "DateTime", "description": "Date and time when the interaction took place" }
      ],
      "relationships": [
        { "target": "Interaction", "type": "lookup", "description": "Links to the parent interaction record that groups related summaries" },
        { "target": "Account", "type": "lookup", "description": "Associates the interaction summary with the constituent's account" }
      ]
    }
  ]
},

"licensing_and_permitting": {
  "objects": [
    {
      "name": "BusinessLicenseApplication",
      "type": "standard",
      "domain": "licensing_and_permitting",
      "description": "Stores application records when businesses submit requests for licenses and permits through Experience Cloud portal Omniscript forms. Supports multiple record types for different application categories and statuses, queue-based routing to reviewers, path-guided approval workflows, and hierarchical views of related visits, violations, and fees. Field Audit Trail is enabled for compliance.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Application identifier or name" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the business account submitting the application" },
        { "name": "ApplicationStatus", "type": "Picklist", "description": "Current status in the approval workflow: Submitted, Under Review, Pending Inspection, Approved, Denied" },
        { "name": "ApplicationType", "type": "Picklist", "description": "Type of license or permit being applied for" },
        { "name": "SubmittedDate", "type": "DateTime", "description": "Date and time when the application was submitted through the portal" },
        { "name": "RegulatoryAuthorizationTypeId", "type": "Lookup", "description": "Reference to the authorization type being requested" },
        { "name": "RegulatoryAuthorityId", "type": "Lookup", "description": "Reference to the regulatory authority that oversees this license type" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links the application to the business account of the applicant" },
        { "target": "RegulatoryAuthorizationType", "type": "lookup", "description": "Identifies the specific license or permit type requested" },
        { "target": "RegulatoryAuthority", "type": "lookup", "description": "Associates the application with the issuing regulatory authority" },
        { "target": "BusinessLicense", "type": "child", "description": "When approved, the application results in an issued business license record" }
      ]
    },
    {
      "name": "BusinessLicense",
      "type": "standard",
      "domain": "licensing_and_permitting",
      "description": "Represents an issued license or permit granted to a business or individual after all reviews and inspections are completed and approved. Supports asset and location associations through junction objects, training requirement verification, and QR code email templates for verification. The license record is created from an approved BusinessLicenseApplication and contains effective dates and renewal information.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name or license number for the issued license" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the account that holds this license" },
        { "name": "LicenseType", "type": "Picklist", "description": "Category of the issued license such as Business, Professional, or Occupational" },
        { "name": "Status", "type": "Picklist", "description": "Current status: Active, Suspended, Revoked, or Expired" },
        { "name": "EffectiveDate", "type": "Date", "description": "Date when the license becomes effective" },
        { "name": "ExpirationDate", "type": "Date", "description": "Date when the license expires and requires renewal" },
        { "name": "RegulatoryAuthorizationTypeId", "type": "Lookup", "description": "Reference to the authorization type this license represents" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links the license to the business or individual account that holds it" },
        { "target": "RegulatoryAuthorizationType", "type": "lookup", "description": "Identifies the specific type of regulatory authorization this license represents" },
        { "target": "BusinessLicenseApplication", "type": "lookup", "description": "Links back to the application that resulted in this license issuance" }
      ]
    },
    {
      "name": "RegulatoryAuthorizationType",
      "type": "standard",
      "domain": "licensing_and_permitting",
      "description": "Defines a specific type of license or permit issued by a regulatory authority, such as a Salon Establishment License or Fire Permit. Contains the authorization category, associated regulatory authority, and products or services covered. Mapped to business types through BusRegAuthorizationType junction objects, and supports dependency chains through BusRegAuthTypeDependency to enforce prerequisite licensing.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the authorization type such as Salon Establishment License or Fire Permit" },
        { "name": "RegulatoryAuthorityId", "type": "Lookup", "description": "Reference to the regulatory authority that issues this type of authorization" },
        { "name": "AuthorizationCategory", "type": "Picklist", "description": "Broad category such as Business License, Individual License, or Permit" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of what this authorization covers and its requirements" },
        { "name": "Status", "type": "Picklist", "description": "Whether this authorization type is currently active and available for applications" }
      ],
      "relationships": [
        { "target": "RegulatoryAuthority", "type": "lookup", "description": "Links to the authority responsible for issuing this type of authorization" },
        { "target": "BusRegAuthorizationType", "type": "parent", "description": "Junction records mapping this authorization type to applicable business types" }
      ]
    },
    {
      "name": "BusRegAuthorizationType",
      "type": "standard",
      "domain": "licensing_and_permitting",
      "description": "Junction object creating a many-to-many relationship between business types and regulatory authorization types. Establishes which licenses and permits are required for each category of business. Displayed in the Permits Lightning web component on Experience Cloud sites to show constituents the authorizations they need to obtain. Field Audit Trail is enabled for compliance tracking.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Auto-generated name combining the business type and authorization type" },
        { "name": "BusinessTypeId", "type": "Lookup", "description": "Reference to the business type that requires this authorization" },
        { "name": "RegulatoryAuthorizationTypeId", "type": "Lookup", "description": "Reference to the regulatory authorization type required for this business type" },
        { "name": "IsRequired", "type": "Checkbox", "description": "Indicates whether this authorization is mandatory for the business type" }
      ],
      "relationships": [
        { "target": "BusinessType", "type": "lookup", "description": "Links to the business type that requires this specific authorization" },
        { "target": "RegulatoryAuthorizationType", "type": "lookup", "description": "Links to the regulatory authorization type required by this business type" }
      ]
    },
    {
      "name": "BusRegAuthTypeDependency",
      "type": "standard",
      "domain": "licensing_and_permitting",
      "description": "Defines prerequisite chains between business regulatory authorization types, ensuring that dependent permits cannot be issued until parent authorizations are obtained. For example, requiring a business license before a fire permit can be issued. Dependencies are displayed in the Permits component on Experience Cloud sites so constituents can understand the order in which they must apply for authorizations.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this dependency relationship" },
        { "name": "BusRegAuthorizationTypeId", "type": "Lookup", "description": "Reference to the parent authorization type that must be obtained first" },
        { "name": "DependentBusRegAuthorizationTypeId", "type": "Lookup", "description": "Reference to the dependent authorization type that requires the parent" },
        { "name": "DependencyType", "type": "Picklist", "description": "Type of dependency such as Prerequisite or Corequisite" }
      ],
      "relationships": [
        { "target": "BusRegAuthorizationType", "type": "lookup", "description": "Links to the parent authorization type that must be obtained first" },
        { "target": "BusRegAuthorizationType", "type": "lookup", "description": "Links to the dependent authorization type requiring the parent" }
      ]
    },
    {
      "name": "RegulatoryTrxnFee",
      "type": "standard",
      "domain": "licensing_and_permitting",
      "description": "Manages fees associated with license applications, inspections, and regulatory code violations. Contains the overall fee status, due date, and links to the parent application or enforcement action. Business Rules Engine can automatically calculate fee amounts based on authorization type and establishment details. Constituents view their fee payment history on the Experience Cloud site through custom list view pages.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Identifier for the regulatory transaction fee" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the account responsible for paying this fee" },
        { "name": "Status", "type": "Picklist", "description": "Current fee status: Due, Paid, Waived, or Overdue" },
        { "name": "EffectiveDateTime", "type": "DateTime", "description": "Date and time from when the transaction fee is applicable" },
        { "name": "DueDateTime", "type": "DateTime", "description": "Date and time by which the fee must be paid" },
        { "name": "Comments", "type": "LongTextArea", "description": "Context or explanation for the fee" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the account responsible for this fee" },
        { "target": "BusinessLicenseApplication", "type": "lookup", "description": "Associates the fee with a specific license application" },
        { "target": "RegulatoryTrxnFeeItem", "type": "parent", "description": "Contains line items that break down the fee into individual amounts" }
      ]
    },
    {
      "name": "RegulatoryTrxnFeeItem",
      "type": "standard",
      "domain": "licensing_and_permitting",
      "description": "Represents an individual line item within a regulatory transaction fee, breaking down the total fee into specific charges such as application fees, inspection fees, or additional processing fees. Each item has its own amount, status, and descriptive comments to provide transparency into fee composition for both agency staff and constituents.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name describing the fee line item such as Application Fee or Inspection Fee" },
        { "name": "RegulatoryTrxnFeeId", "type": "Lookup", "description": "Reference to the parent regulatory transaction fee" },
        { "name": "Amount", "type": "Currency", "description": "The monetary amount for this individual fee line item" },
        { "name": "Status", "type": "Picklist", "description": "Status of this line item: Pending, Paid, or Waived" },
        { "name": "Comments", "type": "LongTextArea", "description": "Additional context or description for this fee item" }
      ],
      "relationships": [
        { "target": "RegulatoryTrxnFee", "type": "lookup", "description": "Links this line item to the parent regulatory transaction fee" }
      ]
    },
    {
      "name": "AuthApplicationAsset",
      "type": "standard",
      "domain": "licensing_and_permitting",
      "description": "Junction object that associates assets such as vehicles, equipment, or facilities with a business license application or issued license. Enables agencies to track which specific assets are covered under a license or permit, supporting scenarios like fleet vehicle registrations or equipment certifications. Field Audit Trail is enabled on this object.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this asset-to-application association" },
        { "name": "BusinessLicenseApplicationId", "type": "Lookup", "description": "Reference to the license application this asset is associated with" },
        { "name": "AssetId", "type": "Lookup", "description": "Reference to the asset record linked to the application" },
        { "name": "Status", "type": "Picklist", "description": "Status of the asset association such as Active, Pending, or Removed" }
      ],
      "relationships": [
        { "target": "BusinessLicenseApplication", "type": "lookup", "description": "Links the asset to a specific license application" },
        { "target": "Asset", "type": "lookup", "description": "Links to the asset record covered by the license" }
      ]
    },
    {
      "name": "AuthApplicationPlace",
      "type": "standard",
      "domain": "licensing_and_permitting",
      "description": "Junction object that associates physical locations with a business license application or issued license. Tracks which premises or establishments are covered under a specific authorization, supporting multi-location businesses and site-specific permits such as building permits or food service licenses. Field Audit Trail is enabled for audit compliance.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this place-to-application association" },
        { "name": "BusinessLicenseApplicationId", "type": "Lookup", "description": "Reference to the license application this location is associated with" },
        { "name": "PlaceId", "type": "Lookup", "description": "Reference to the location or address record linked to the application" },
        { "name": "Status", "type": "Picklist", "description": "Status of the location association" }
      ],
      "relationships": [
        { "target": "BusinessLicenseApplication", "type": "lookup", "description": "Links the location to a specific license application" },
        { "target": "Location", "type": "lookup", "description": "Links to the physical location record covered by the license" }
      ]
    },
    {
      "name": "RegAuthorizationTypeProduct",
      "type": "standard",
      "domain": "licensing_and_permitting",
      "description": "Junction object that maps regulatory authorization types to specific products or services that are covered under the authorization. Enables agencies to define which goods or services a particular license type permits the holder to provide or sell, supporting product-level compliance tracking and enforcement.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this authorization-to-product mapping" },
        { "name": "RegulatoryAuthorizationTypeId", "type": "Lookup", "description": "Reference to the regulatory authorization type" },
        { "name": "ProductId", "type": "Lookup", "description": "Reference to the product or service covered by this authorization" },
        { "name": "Status", "type": "Picklist", "description": "Whether this product association is currently active" }
      ],
      "relationships": [
        { "target": "RegulatoryAuthorizationType", "type": "lookup", "description": "Links to the authorization type that covers this product" },
        { "target": "Product2", "type": "lookup", "description": "Links to the specific product or service permitted under the authorization" }
      ]
    },
    {
      "name": "PreliminaryApplicationRef",
      "type": "standard",
      "domain": "licensing_and_permitting",
      "description": "Stores preliminary application reference data created when constituents start but have not yet completed a license or permit application. Used by OmniStudio guided flows to save partial application data including Omniscript saved sessions, enabling applicants to return and complete their submission later. Also created by social insurance claim flows to link claims with their applications.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Reference identifier for the preliminary application" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the constituent account that started the application" },
        { "name": "ApplicationType", "type": "Picklist", "description": "Type of application being drafted such as Business License or Individual License" },
        { "name": "Status", "type": "Picklist", "description": "Current status: Draft, Submitted, or Abandoned" },
        { "name": "SavedSessionId", "type": "Text", "description": "Reference to the Omniscript saved session for resuming the application" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the constituent who initiated the preliminary application" },
        { "target": "BusinessLicenseApplication", "type": "lookup", "description": "Links to the final application record once submitted" }
      ]
    },
    {
      "name": "AuthLocationAccessSchedule",
      "type": "standard",
      "domain": "licensing_and_permitting",
      "description": "Defines scheduled access windows for licensed locations, specifying when inspectors or compliance officers can visit a business establishment. Tracks day of week, start and end times, and any access restrictions. Used to coordinate inspection scheduling with licensed business operating hours. Field Audit Trail is enabled on this object.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this access schedule entry" },
        { "name": "AuthApplicationPlaceId", "type": "Lookup", "description": "Reference to the authorized application place this schedule applies to" },
        { "name": "DayOfWeek", "type": "Picklist", "description": "Day of the week for this access window" },
        { "name": "StartTime", "type": "DateTime", "description": "Start time of the access window" },
        { "name": "EndTime", "type": "DateTime", "description": "End time of the access window" }
      ],
      "relationships": [
        { "target": "AuthApplicationPlace", "type": "lookup", "description": "Links to the authorized location this access schedule belongs to" }
      ]
    }
  ]
},

"inspections": {
  "objects": [
    {
      "name": "InspectionType",
      "type": "standard",
      "domain": "inspections",
      "description": "Defines categories of inspections required for different licenses, permits, and compliance programs. Each inspection type specifies the regulatory authority, applicable assessment indicators, and the action plan template used to create the checklist for inspectors. Inspection types are linked to regulatory authorization types to determine which inspections are needed for specific license applications. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the inspection type such as Fire Safety Inspection or Health Code Inspection" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of what this inspection covers and its compliance standards" },
        { "name": "RegulatoryAuthorityId", "type": "Lookup", "description": "Reference to the regulatory authority that mandates this inspection type" },
        { "name": "Status", "type": "Picklist", "description": "Whether this inspection type is currently active" },
        { "name": "InspectionFrequency", "type": "Picklist", "description": "How often this inspection must be conducted: Annual, Semi-Annual, Quarterly, or On-Demand" }
      ],
      "relationships": [
        { "target": "RegulatoryAuthority", "type": "lookup", "description": "Links to the authority that mandates and oversees this inspection type" },
        { "target": "InspectionAssessmentInd", "type": "parent", "description": "Contains the assessment indicators used during this type of inspection" }
      ]
    },
    {
      "name": "InspectionAssessmentInd",
      "type": "standard",
      "domain": "inspections",
      "description": "Links assessment indicator definitions to inspection types, establishing which specific evaluation measures are used during a particular category of inspection. Acts as a junction between InspectionType and AssessmentIndicatorDefinition, enabling configurable inspection checklists that can vary by inspection category. Field Audit Trail is enabled on this object.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this inspection assessment indicator link" },
        { "name": "InspectionTypeId", "type": "Lookup", "description": "Reference to the inspection type this indicator belongs to" },
        { "name": "AssessmentIndicatorDefinitionId", "type": "Lookup", "description": "Reference to the assessment indicator definition used in this inspection" },
        { "name": "SortOrder", "type": "Number", "description": "Display order of this indicator within the inspection checklist" }
      ],
      "relationships": [
        { "target": "InspectionType", "type": "lookup", "description": "Links to the inspection type that includes this assessment indicator" },
        { "target": "AssessmentIndicatorDefinition", "type": "lookup", "description": "Links to the specific assessment measure used during inspections" }
      ]
    },
    {
      "name": "RegulatoryCode",
      "type": "standard",
      "domain": "inspections",
      "description": "Represents a specific compliance standard or regulation established by a regulatory authority. Includes the code number, subject area, effective dates, and a detailed description of the requirement. Regulatory codes are linked to assessment questions through RegulatoryCodeUse junction records, enabling inspectors to see applicable codes during Dynamic Assessments. Violations reference these codes to document which standards were not met.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Code identifier such as 19.05 Fire Code or Section 14.3 Food Safety" },
        { "name": "Subject", "type": "Text", "description": "Subject area of the regulatory code such as Fire Prevention, Food Safety, or Building Safety" },
        { "name": "Description", "type": "LongTextArea", "description": "Full text of the regulatory requirement including specific compliance criteria" },
        { "name": "Type", "type": "Picklist", "description": "Classification of the code such as Section, Subsection, or Amendment" },
        { "name": "EffectiveFrom", "type": "Date", "description": "Date when this regulatory code became effective" },
        { "name": "RegulatoryAuthorityId", "type": "Lookup", "description": "Reference to the authority that established this code" }
      ],
      "relationships": [
        { "target": "RegulatoryAuthority", "type": "lookup", "description": "Links to the regulatory authority that owns and enforces this code" },
        { "target": "RegulatoryCodeViolation", "type": "parent", "description": "Violations created when inspections find non-compliance with this code" }
      ]
    },
    {
      "name": "RegulatoryCodeAssessmentInd",
      "type": "standard",
      "domain": "inspections",
      "description": "Junction object that links regulatory codes to assessment indicator definitions, establishing which compliance measures correspond to which regulatory standards. Enables the inspection framework to associate specific evaluation criteria with the codes they verify, creating a traceable chain from code to assessment to compliance result. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this regulatory code to assessment indicator link" },
        { "name": "RegulatoryCodeId", "type": "Lookup", "description": "Reference to the regulatory code being assessed" },
        { "name": "AssessmentIndicatorDefinitionId", "type": "Lookup", "description": "Reference to the assessment indicator used to evaluate this code" },
        { "name": "Status", "type": "Picklist", "description": "Whether this link is currently active" }
      ],
      "relationships": [
        { "target": "RegulatoryCode", "type": "lookup", "description": "Links to the regulatory compliance code being measured" },
        { "target": "AssessmentIndicatorDefinition", "type": "lookup", "description": "Links to the assessment indicator that evaluates compliance with this code" }
      ]
    },
    {
      "name": "RegulatoryCodeUse",
      "type": "standard",
      "domain": "inspections",
      "description": "Junction object creating a many-to-many relationship between assessment question versions and regulatory codes. When assessment questions are related to codes, inspectors see the applicable regulatory code while conducting assessment tasks during Dynamic Assessments. This enables compliance-aware evaluations where each question maps to the specific standard being verified.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this regulatory code use record" },
        { "name": "AssessmentQuestionVersionId", "type": "Lookup", "description": "Reference to the assessment question version linked to this code" },
        { "name": "RegulatoryCodeId", "type": "Lookup", "description": "Reference to the regulatory code linked to this assessment question" },
        { "name": "Status", "type": "Picklist", "description": "Whether this code use record is active" }
      ],
      "relationships": [
        { "target": "AssessmentQuestionVersion", "type": "lookup", "description": "Links to the versioned assessment question that evaluates this code" },
        { "target": "RegulatoryCode", "type": "lookup", "description": "Links to the regulatory code that this question assesses" }
      ]
    },
    {
      "name": "RegulatoryCodeViolation",
      "type": "standard",
      "domain": "inspections",
      "description": "Records a specific regulatory code violation discovered during an inspection visit. Violations are automatically created when Dynamic Assessment questions receive a Fail compliance status, or manually entered by inspectors. Contains severity, compliance status, the related regulatory code, and links to the assessment response that triggered the violation. Violations drive enforcement actions and regulatory transaction fees.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Description or identifier for this violation" },
        { "name": "RegulatoryCodeId", "type": "Lookup", "description": "Reference to the regulatory code that was violated" },
        { "name": "Severity", "type": "Picklist", "description": "Severity level: Minor Violation, Major Violation, or Critical Violation" },
        { "name": "ComplianceStatus", "type": "Picklist", "description": "Current compliance status: Open, Remediated, or Closed" },
        { "name": "VisitId", "type": "Lookup", "description": "Reference to the inspection visit where this violation was identified" },
        { "name": "DateIdentified", "type": "Date", "description": "Date when the violation was first identified" }
      ],
      "relationships": [
        { "target": "RegulatoryCode", "type": "lookup", "description": "Links to the specific code that was violated" },
        { "target": "Visit", "type": "lookup", "description": "Links to the inspection visit where this violation was discovered" },
        { "target": "ViolationEnforcementAction", "type": "parent", "description": "Contains enforcement actions taken in response to this violation" }
      ]
    },
    {
      "name": "ViolationEnforcementAction",
      "type": "standard",
      "domain": "inspections",
      "description": "Tracks corrective and punitive actions resulting from inspection violations including fines, license suspension, revocation, and remediation requirements. Links enforcement actions to regulatory transaction fees for automated fee generation through Integration Procedures. Enforcement actions are displayed in the Inspection History component on Experience Cloud sites for constituent visibility.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name or description of the enforcement action" },
        { "name": "RegulatoryCodeViolationId", "type": "Lookup", "description": "Reference to the violation that triggered this enforcement action" },
        { "name": "ActionType", "type": "Picklist", "description": "Type of enforcement action: Fine, Warning, Suspension, Revocation, or Remediation Required" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the enforcement action: Pending, Active, Completed, or Appealed" },
        { "name": "DueDate", "type": "Date", "description": "Date by which the enforcement action must be completed or remediated" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the enforcement action and its requirements" }
      ],
      "relationships": [
        { "target": "RegulatoryCodeViolation", "type": "lookup", "description": "Links to the violation that prompted this enforcement action" },
        { "target": "RegulatoryTrxnFee", "type": "child", "description": "Fee records automatically generated for this enforcement action" }
      ]
    },
    {
      "name": "ViolationType",
      "type": "standard",
      "domain": "inspections",
      "description": "Defines categories of violations that can be recorded during inspections, such as Health and Safety, Fire Code, or Environmental violations. Violation types are linked to assessment question versions through ViolationTypeAssessmentInd junction records, so inspectors can record the appropriate violation category during Dynamic Assessments. Each violation type specifies a severity level and description.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the violation type such as Fire extinguishers not present or Expired food storage" },
        { "name": "Type", "type": "Picklist", "description": "Broad classification such as Health and Safety, Fire Code, or Environmental" },
        { "name": "Severity", "type": "Picklist", "description": "Default severity level: Minor Violation, Major Violation, or Critical Violation" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of what constitutes this type of violation" }
      ],
      "relationships": [
        { "target": "RegulatoryCodeViolation", "type": "parent", "description": "Violations reference this type to categorize the nature of the non-compliance" }
      ]
    },
    {
      "name": "Visit",
      "type": "standard",
      "domain": "inspections",
      "description": "Represents an onsite or virtual inspection visit scheduled by a compliance officer and conducted by an inspector. Visits are created from license application record pages and include calendar integration for scheduling. During the visit, inspectors complete assessment tasks from action plan templates, record compliance results, and capture signatures on mobile devices. Visits appear in the Inspection History component on Experience Cloud sites.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name or identifier for the visit" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the business account being visited" },
        { "name": "PlannedVisitStartTime", "type": "DateTime", "description": "Scheduled start date and time for the inspection visit" },
        { "name": "PlannedVisitEndTime", "type": "DateTime", "description": "Scheduled end date and time for the inspection visit" },
        { "name": "ActualVisitStartTime", "type": "DateTime", "description": "Actual start time recorded by the inspector" },
        { "name": "Status", "type": "Picklist", "description": "Current status: Planned, In Progress, Completed, or Cancelled" },
        { "name": "InspectionTypeId", "type": "Lookup", "description": "Reference to the type of inspection being conducted" },
        { "name": "VisitorId", "type": "Lookup", "description": "Reference to the inspector conducting the visit" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the business account being inspected" },
        { "target": "InspectionType", "type": "lookup", "description": "Identifies the category of inspection being conducted" },
        { "target": "Visitor", "type": "lookup", "description": "Links to the inspector record for the person conducting the visit" },
        { "target": "BusinessLicenseApplication", "type": "lookup", "description": "Associates the visit with the license application requiring inspection" }
      ]
    },
    {
      "name": "Visitor",
      "type": "standard",
      "domain": "inspections",
      "description": "Represents an inspector or compliance officer who conducts onsite visits for regulatory inspections. Captures the visitor's user record, qualifications, and availability. Visitors are assigned to visits through the Visit object and use the Inspection Management mobile app with calendar integration for scheduling and conducting inspections.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Full name of the inspector or visitor" },
        { "name": "UserId", "type": "Lookup", "description": "Reference to the Salesforce user record of the inspector" },
        { "name": "Status", "type": "Picklist", "description": "Current availability status: Available, On Assignment, or Inactive" },
        { "name": "Specialization", "type": "Text", "description": "Areas of inspection expertise such as Fire Safety, Health, or Building Code" }
      ],
      "relationships": [
        { "target": "User", "type": "lookup", "description": "Links to the Salesforce user record for the inspector" },
        { "target": "Visit", "type": "child", "description": "Visits assigned to this inspector" }
      ]
    }
  ]
},

"social_programs": {
  "objects": [
    {
      "name": "PublicProgram",
      "type": "standard",
      "domain": "social_programs",
      "description": "Defines high-level social programs that government agencies offer to constituents facing hardship, covering areas like job readiness, child welfare, housing services, and refugee settlement. Each program includes a summary, related benefits for specific services, and goal definitions for measuring outcomes. Constituents are enrolled in programs through care plans and the ProgramEnrollment object.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the social program such as Job Readiness Program or Child Welfare Services" },
        { "name": "Description", "type": "LongTextArea", "description": "Summary of the program's purpose, eligibility requirements, and available services" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the program: Active, Inactive, or Pilot" },
        { "name": "ProgramCategory", "type": "Picklist", "description": "Category such as Housing, Employment, Child Welfare, Elder Care, or Nutrition" },
        { "name": "StartDate", "type": "Date", "description": "Date when the program became available to constituents" },
        { "name": "EndDate", "type": "Date", "description": "Date when the program is scheduled to end, if applicable" }
      ],
      "relationships": [
        { "target": "Benefit", "type": "parent", "description": "Contains the specific benefits available under this program" },
        { "target": "ProgramEnrollment", "type": "parent", "description": "Tracks constituent enrollment records for this program" }
      ]
    },
    {
      "name": "CarePlan",
      "type": "standard",
      "domain": "social_programs",
      "description": "Delivers personalized support to constituents by structuring their enrolled programs, assigned benefits, and tracked goals into a single comprehensive plan. Care plans are created from templates that standardize approaches for common scenarios. Caseworkers customize each plan for individual situations, adding goals, program enrollments, and benefit assignments. Used across social programs, benefit management, and social insurance for coordinated service delivery.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name for the care plan" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the constituent account this care plan serves" },
        { "name": "CarePlanTemplateId", "type": "Lookup", "description": "Reference to the template used to create this care plan" },
        { "name": "Status", "type": "Picklist", "description": "Current status: Draft, Active, On Hold, Completed, or Closed" },
        { "name": "StartDate", "type": "Date", "description": "Date when the care plan became active for the constituent" },
        { "name": "EndDate", "type": "Date", "description": "Expected or actual end date for the care plan" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the constituent receiving services under this care plan" },
        { "target": "CarePlanTemplate", "type": "lookup", "description": "Links to the template that defined the initial structure of this care plan" },
        { "target": "GoalAssignment", "type": "parent", "description": "Contains goal assignments tracking constituent progress toward defined outcomes" }
      ]
    },
    {
      "name": "CarePlanTemplate",
      "type": "standard",
      "domain": "social_programs",
      "description": "Provides reusable templates that standardize care plan creation for common social program scenarios. Templates include predefined benefits, goals, and task sequences that caseworkers can customize for each constituent's situation. Template benefits specify which assistance programs are typically included, and template goals define the expected outcomes. Field Audit Trail is enabled for this object.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name for the care plan template such as Refugee Settlement Plan or Elder Care Plan" },
        { "name": "Description", "type": "LongTextArea", "description": "Description of the scenarios and populations this template is designed for" },
        { "name": "Status", "type": "Picklist", "description": "Whether this template is Active, Draft, or Retired" },
        { "name": "Category", "type": "Picklist", "description": "Category of care this template addresses such as Housing, Employment, or Health" }
      ],
      "relationships": [
        { "target": "CarePlanTemplateBenefit", "type": "parent", "description": "Contains the default benefits included in care plans created from this template" },
        { "target": "CarePlanTemplateGoal", "type": "parent", "description": "Contains the default goals included in care plans created from this template" }
      ]
    },
    {
      "name": "CarePlanTemplateBenefit",
      "type": "standard",
      "domain": "social_programs",
      "description": "Links a specific benefit to a care plan template, defining which assistance services are automatically included when a care plan is created from the template. Template benefits can be customized or removed by caseworkers on individual care plans. Field Audit Trail is enabled on this object for change tracking.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this template benefit association" },
        { "name": "CarePlanTemplateId", "type": "Lookup", "description": "Reference to the parent care plan template" },
        { "name": "BenefitId", "type": "Lookup", "description": "Reference to the benefit included in this template" },
        { "name": "SortOrder", "type": "Number", "description": "Display order of this benefit within the template" }
      ],
      "relationships": [
        { "target": "CarePlanTemplate", "type": "lookup", "description": "Links to the care plan template this benefit belongs to" },
        { "target": "Benefit", "type": "lookup", "description": "Links to the specific benefit included in the template" }
      ]
    },
    {
      "name": "CarePlanTemplateGoal",
      "type": "standard",
      "domain": "social_programs",
      "description": "Links a goal definition to a care plan template, establishing which outcomes are expected when a care plan is created from the template. Template goals provide the initial framework for tracking constituent progress and can be customized for each individual care plan. Field Audit Trail is enabled on this object.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this template goal association" },
        { "name": "CarePlanTemplateId", "type": "Lookup", "description": "Reference to the parent care plan template" },
        { "name": "GoalDefinitionId", "type": "Lookup", "description": "Reference to the goal definition included in this template" },
        { "name": "SortOrder", "type": "Number", "description": "Display order of this goal within the template" }
      ],
      "relationships": [
        { "target": "CarePlanTemplate", "type": "lookup", "description": "Links to the care plan template this goal belongs to" },
        { "target": "GoalDefinition", "type": "lookup", "description": "Links to the specific goal definition included in the template" }
      ]
    },
    {
      "name": "GoalDefinition",
      "type": "standard",
      "domain": "social_programs",
      "description": "Creates hierarchical goal structures with top-level goals and intermediate goals for achieving positive constituent outcomes. Goals define measurable targets such as securing employment, achieving housing stability, or completing a training program. Used in care plan templates and assigned to individual constituents through GoalAssignment records. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the goal such as Secure Employment or Complete GED Program" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the goal and the criteria for measuring success" },
        { "name": "ParentGoalDefinitionId", "type": "Lookup", "description": "Reference to a parent goal for creating hierarchical goal trees" },
        { "name": "GoalType", "type": "Picklist", "description": "Classification such as Top Goal, Intermediate Goal, or Milestone" },
        { "name": "Status", "type": "Picklist", "description": "Whether this goal definition is Active, Draft, or Retired" }
      ],
      "relationships": [
        { "target": "GoalDefinition", "type": "lookup", "description": "Self-referential link to a parent goal for hierarchical structures" },
        { "target": "GoalAssignment", "type": "parent", "description": "Contains assignments linking this goal to individual constituents" }
      ]
    },
    {
      "name": "GoalAssignment",
      "type": "standard",
      "domain": "social_programs",
      "description": "Links a specific goal definition to a care plan participant, tracking individual progress toward achieving the defined outcome. Records completion status, progress notes, and target dates. Goal assignments connect to care barriers through GoalAssignmentDetail records in social insurance workflows, enabling agencies to address obstacles that prevent goal achievement. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this goal assignment" },
        { "name": "GoalDefinitionId", "type": "Lookup", "description": "Reference to the goal being assigned" },
        { "name": "CarePlanId", "type": "Lookup", "description": "Reference to the care plan this goal is part of" },
        { "name": "Status", "type": "Picklist", "description": "Progress status: Not Started, In Progress, Achieved, or Discontinued" },
        { "name": "TargetDate", "type": "Date", "description": "Target date for achieving this goal" },
        { "name": "CompletedDate", "type": "Date", "description": "Actual date when the goal was achieved" }
      ],
      "relationships": [
        { "target": "GoalDefinition", "type": "lookup", "description": "Links to the goal definition being tracked" },
        { "target": "CarePlan", "type": "lookup", "description": "Links to the care plan containing this goal assignment" }
      ]
    },
    {
      "name": "Referral",
      "type": "standard",
      "domain": "social_programs",
      "description": "Records case referral requests from other agencies, organizations, or caseworkers. Referrals are screened during intake, and cases are created for accepted referrals. The provider referral guided flow creates one referral record per provider when caseworkers share constituent information. Supports authorization workflows where providers request approval before delivering services. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Identifier for the referral record" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the constituent account being referred" },
        { "name": "ReferralType", "type": "Picklist", "description": "Type of referral such as Job Training, Housing, Nutrition, or Elder Care" },
        { "name": "Status", "type": "Picklist", "description": "Current status: Pending, Accepted, In Progress, Completed, or Declined" },
        { "name": "ReferringOrganization", "type": "Text", "description": "Name of the organization or agency making the referral" },
        { "name": "AuthorizationStatus", "type": "Picklist", "description": "Authorization status for provider referrals: Requested, Authorized, or Denied" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the constituent being referred for services" },
        { "target": "Case", "type": "lookup", "description": "Links to the case created from this referral" },
        { "target": "CarePlan", "type": "lookup", "description": "Links to the care plan associated with this referral" }
      ]
    },
    {
      "name": "PublicComplaint",
      "type": "standard",
      "domain": "social_programs",
      "description": "Captures complaints filed by constituents about health, safety, and well-being concerns through guided OmniScript intake flows on Experience Cloud sites. Records complainant details, involved parties, incident specifics, and associated regulatory codes. Caseworkers conduct Dynamic Assessments on complaints to evaluate allegations and determine follow-up actions. Screened complaints can escalate to investigative cases. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Identifier for the public complaint" },
        { "name": "ComplainantAccountId", "type": "Lookup", "description": "Reference to the account of the person filing the complaint" },
        { "name": "Status", "type": "Picklist", "description": "Current status: Filed, Under Review, Investigated, Resolved, or Dismissed" },
        { "name": "ComplaintType", "type": "Picklist", "description": "Category such as Health, Safety, Welfare, Environmental, or Consumer" },
        { "name": "IncidentDate", "type": "Date", "description": "Date when the incident being complained about occurred" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the complaint and the circumstances" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the complainant's account" },
        { "target": "ComplaintCase", "type": "child", "description": "Investigative cases created from screened complaints" }
      ]
    },
    {
      "name": "ProgramEnrollment",
      "type": "standard",
      "domain": "social_programs",
      "description": "Tracks a constituent's enrollment in a specific public program, recording the enrollment date, status, and associated care plan. Enables agencies to monitor which constituents are actively participating in which programs and track enrollment duration for reporting and outcome measurement purposes.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this program enrollment record" },
        { "name": "PublicProgramId", "type": "Lookup", "description": "Reference to the public program the constituent is enrolled in" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the constituent account enrolled in the program" },
        { "name": "EnrollmentDate", "type": "Date", "description": "Date when the constituent was enrolled in the program" },
        { "name": "Status", "type": "Picklist", "description": "Enrollment status: Active, Completed, Withdrawn, or Waitlisted" },
        { "name": "CarePlanId", "type": "Lookup", "description": "Reference to the care plan through which enrollment occurred" }
      ],
      "relationships": [
        { "target": "PublicProgram", "type": "lookup", "description": "Links to the social program the constituent is enrolled in" },
        { "target": "Account", "type": "lookup", "description": "Links to the constituent's account" },
        { "target": "CarePlan", "type": "lookup", "description": "Links to the care plan that initiated this enrollment" }
      ]
    }
  ]
},

"benefit_management": {
  "objects": [
    {
      "name": "IndividualApplication",
      "type": "standard",
      "domain": "benefit_management",
      "description": "Stores application records for individual benefit assistance requests, social insurance claims, and individual license applications. Supports multiple record types for different application categories including Benefit Assistance. Captures constituent information through Discovery Framework assessment questions and OmniScript guided flows, with effective dates for income and expense data to support Business Rules Engine eligibility calculations. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Application identifier or name" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the individual constituent's person account" },
        { "name": "ApplicationStatus", "type": "Picklist", "description": "Current status: Submitted, Under Review, Approved, Denied, or Pending Recertification" },
        { "name": "RecordTypeId", "type": "Lookup", "description": "Record type distinguishing Benefit Assistance from other application types" },
        { "name": "SubmittedDate", "type": "DateTime", "description": "Date and time when the application was submitted" },
        { "name": "ApplicationType", "type": "Picklist", "description": "Type of application such as Benefit Assistance, Individual License, or Social Insurance Claim" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the individual constituent's person account" },
        { "target": "BenefitAssignment", "type": "parent", "description": "Contains benefit assignments made to the applicant after approval" },
        { "target": "Claim", "type": "child", "description": "Social insurance claim records linked to this individual application" }
      ]
    },
    {
      "name": "Benefit",
      "type": "standard",
      "domain": "benefit_management",
      "description": "Represents a specific assistance service available under a benefit type and associated program, such as a housing voucher, food assistance payment, or counseling session. Benefits are assigned to eligible applicants through BenefitAssignment records and can include goal definitions for outcome tracking. Used in care plan templates to define default assistance packages.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the benefit such as Housing Assistance Voucher or Food Assistance Monthly Payment" },
        { "name": "BenefitTypeId", "type": "Lookup", "description": "Reference to the parent benefit type this benefit belongs to" },
        { "name": "ProgramId", "type": "Lookup", "description": "Reference to the associated public program" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of what this benefit provides and eligibility criteria" },
        { "name": "Status", "type": "Picklist", "description": "Whether this benefit is currently Active, Inactive, or Deprecated" },
        { "name": "Amount", "type": "Currency", "description": "Standard monetary amount for this benefit, if applicable" }
      ],
      "relationships": [
        { "target": "BenefitType", "type": "lookup", "description": "Links to the benefit type that categorizes this benefit" },
        { "target": "PublicProgram", "type": "lookup", "description": "Links to the program this benefit is part of" },
        { "target": "BenefitAssignment", "type": "parent", "description": "Contains assignments of this benefit to eligible constituents" }
      ]
    },
    {
      "name": "BenefitType",
      "type": "standard",
      "domain": "benefit_management",
      "description": "Categorizes benefits by process category and service classification, such as Social Insurance, Tax Benefits, Subsidies, Food Assistance, Housing Assistance, or Direct Cash Assistance. Benefit types contain the individual benefits available for assignment and are referenced by Business Rules Engine expression sets and decision matrices for eligibility determination calculations.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the benefit type such as Food Assistance or Housing Voucher" },
        { "name": "ProcessCategory", "type": "Picklist", "description": "High-level classification: Social Insurance, Tax Benefits, Subsidies, or Direct Assistance" },
        { "name": "ServiceClassification", "type": "Text", "description": "Detailed service classification for reporting and eligibility matching" },
        { "name": "Description", "type": "LongTextArea", "description": "Description of this category of benefits and general eligibility criteria" },
        { "name": "Status", "type": "Picklist", "description": "Whether this benefit type is Active or Inactive" }
      ],
      "relationships": [
        { "target": "Benefit", "type": "parent", "description": "Contains the specific benefits categorized under this type" }
      ]
    },
    {
      "name": "BenefitAssignment",
      "type": "standard",
      "domain": "benefit_management",
      "description": "Assigns an approved benefit to an eligible applicant with specified amount, frequency, and duration. Tracks recertification status with configurable due dates and reminder periods. Supports adjustments through BenefitAssignmentAdjustment records when circumstances change. Caseworkers process assignments through guided flows and can search for providers from the Benefit Assignments related list. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Identifier for this benefit assignment" },
        { "name": "BenefitId", "type": "Lookup", "description": "Reference to the benefit being assigned" },
        { "name": "IndividualApplicationId", "type": "Lookup", "description": "Reference to the individual application that was approved" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the constituent receiving the benefit" },
        { "name": "Amount", "type": "Currency", "description": "Monetary amount assigned for this benefit" },
        { "name": "Frequency", "type": "Picklist", "description": "Disbursement frequency: Weekly, Bi-Weekly, Monthly, Quarterly, or One-Time" },
        { "name": "Status", "type": "Picklist", "description": "Assignment status: Active, Suspended, Completed, or Pending Recertification" },
        { "name": "RecertificationDueDate", "type": "Date", "description": "Date by which the constituent must recertify eligibility" }
      ],
      "relationships": [
        { "target": "Benefit", "type": "lookup", "description": "Links to the specific benefit being assigned" },
        { "target": "IndividualApplication", "type": "lookup", "description": "Links to the approved application" },
        { "target": "Account", "type": "lookup", "description": "Links to the constituent receiving this benefit" },
        { "target": "BenefitDisbursement", "type": "parent", "description": "Contains disbursement records tracking payments made for this assignment" }
      ]
    },
    {
      "name": "BenefitAssignmentAdjustment",
      "type": "standard",
      "domain": "benefit_management",
      "description": "Records adjustments to an existing benefit assignment when a constituent's circumstances change, such as household size, income level, or employment status. Captures the reason for adjustment, new amount, effective date, and supporting documentation. Created through change of circumstances reporting guided flows where constituents update their details with supporting evidence. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Identifier for this adjustment record" },
        { "name": "BenefitAssignmentId", "type": "Lookup", "description": "Reference to the benefit assignment being adjusted" },
        { "name": "AdjustmentReason", "type": "Picklist", "description": "Reason for the adjustment such as Income Change, Household Change, or Recertification" },
        { "name": "NewAmount", "type": "Currency", "description": "Revised benefit amount after the adjustment" },
        { "name": "EffectiveDate", "type": "Date", "description": "Date when the adjustment takes effect" }
      ],
      "relationships": [
        { "target": "BenefitAssignment", "type": "lookup", "description": "Links to the benefit assignment being modified" }
      ]
    },
    {
      "name": "BenefitDisbursement",
      "type": "standard",
      "domain": "benefit_management",
      "description": "Tracks individual payment distributions for an assigned benefit. Each disbursement records the amount, date, and status of a payment. Supports both automatic scheduled disbursements and manual one-time payments. In the provider management workflow, disbursement records are created when providers enroll constituents in benefit sessions, tracking attendance and service delivery quantities. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Identifier for this disbursement record" },
        { "name": "BenefitAssignmentId", "type": "Lookup", "description": "Reference to the benefit assignment this disbursement fulfills" },
        { "name": "Amount", "type": "Currency", "description": "Monetary amount disbursed in this payment" },
        { "name": "DisbursementDate", "type": "Date", "description": "Date when the disbursement was made" },
        { "name": "Status", "type": "Picklist", "description": "Disbursement status: Pending, Completed, Failed, or Cancelled" },
        { "name": "DisbursedQuantity", "type": "Number", "description": "Quantity of service units delivered for session-based benefits" }
      ],
      "relationships": [
        { "target": "BenefitAssignment", "type": "lookup", "description": "Links to the benefit assignment this disbursement is for" },
        { "target": "BenefitSession", "type": "lookup", "description": "Links to the session record for provider-delivered benefits" }
      ]
    },
    {
      "name": "BenefitDisbursementAdj",
      "type": "standard",
      "domain": "benefit_management",
      "description": "Records adjustments to benefit disbursement records when payment corrections, clawbacks, or supplemental payments are needed. Captures the original disbursement, adjustment reason, and the corrected amount. Provides an audit trail for all financial changes to disbursement records. Field Audit Trail is enabled on this object for compliance.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Identifier for the disbursement adjustment" },
        { "name": "BenefitDisbursementId", "type": "Lookup", "description": "Reference to the original disbursement being adjusted" },
        { "name": "AdjustmentAmount", "type": "Currency", "description": "Amount of the adjustment, positive for supplements or negative for clawbacks" },
        { "name": "AdjustmentReason", "type": "Picklist", "description": "Reason for the adjustment such as Overpayment, Underpayment, or Correction" },
        { "name": "EffectiveDate", "type": "Date", "description": "Date when the disbursement adjustment takes effect" }
      ],
      "relationships": [
        { "target": "BenefitDisbursement", "type": "lookup", "description": "Links to the original disbursement record being adjusted" }
      ]
    },
    {
      "name": "BenefitSchedule",
      "type": "standard",
      "domain": "benefit_management",
      "description": "Defines delivery schedules for benefits provided through service providers, specifying session frequencies, quantities, and timeframes. Providers create schedules from the Schedules page on the provider Experience Cloud site and submit them to caseworkers for approval. When approved, the schedule generates BenefitSession records for each service instance.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this benefit schedule" },
        { "name": "BenefitAssignmentId", "type": "Lookup", "description": "Reference to the benefit assignment this schedule delivers" },
        { "name": "Frequency", "type": "Picklist", "description": "How often sessions occur: Daily, Weekly, Bi-Weekly, or Monthly" },
        { "name": "SessionQuantity", "type": "Number", "description": "Total number of sessions in this schedule" },
        { "name": "StartDate", "type": "Date", "description": "Start date for the schedule" },
        { "name": "EndDate", "type": "Date", "description": "End date for the schedule" },
        { "name": "Status", "type": "Picklist", "description": "Schedule status: Draft, Submitted, Approved, or Rejected" }
      ],
      "relationships": [
        { "target": "BenefitAssignment", "type": "lookup", "description": "Links to the benefit assignment this schedule fulfills" },
        { "target": "BenefitSession", "type": "parent", "description": "Contains individual session records generated from this schedule" }
      ]
    },
    {
      "name": "BenefitScheduleAssignment",
      "type": "standard",
      "domain": "benefit_management",
      "description": "Associates a benefit schedule with a specific constituent assignment, tracking which schedule is being used to deliver benefits to which enrollee. Enables multiple schedules per benefit assignment and supports caseworker review and approval of provider-submitted schedules before sessions are created.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this schedule assignment" },
        { "name": "BenefitScheduleId", "type": "Lookup", "description": "Reference to the benefit schedule being assigned" },
        { "name": "BenefitAssignmentId", "type": "Lookup", "description": "Reference to the benefit assignment this schedule serves" },
        { "name": "Status", "type": "Picklist", "description": "Assignment status: Active, Paused, or Completed" }
      ],
      "relationships": [
        { "target": "BenefitSchedule", "type": "lookup", "description": "Links to the benefit schedule" },
        { "target": "BenefitAssignment", "type": "lookup", "description": "Links to the benefit assignment receiving this schedule" }
      ]
    },
    {
      "name": "BenefitItemCode",
      "type": "standard",
      "domain": "benefit_management",
      "description": "Maps a benefit to a code set or code set bundle, representing a distinct service variation that a provider offers. For example, a nursing care benefit may have item codes for weekday nursing, weekend nursing, and specialized nursing. Enables granular tracking of benefit variations for provider matching, session scheduling, and service delivery reporting.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this benefit item code" },
        { "name": "BenefitId", "type": "Lookup", "description": "Reference to the benefit this code maps to" },
        { "name": "CodesetId", "type": "Lookup", "description": "Reference to the code set representing the service variation" },
        { "name": "CodesetBundleId", "type": "Lookup", "description": "Reference to the code set bundle if multiple codes are grouped" },
        { "name": "Status", "type": "Picklist", "description": "Whether this item code is Active or Inactive" }
      ],
      "relationships": [
        { "target": "Benefit", "type": "lookup", "description": "Links to the benefit this code categorizes" },
        { "target": "Codeset", "type": "lookup", "description": "Links to the code set representing the service variation" }
      ]
    }
  ]
},

"social_insurance": {
  "objects": [
    {
      "name": "Claim",
      "type": "standard",
      "domain": "social_insurance",
      "description": "Stores claim details when constituents file for social insurance benefits such as workers' compensation, retirement pensions, or disability insurance. Claims are created through guided OmniScript flows on Experience Cloud sites, capturing injury details, employment information, and supporting documentation. After review, approved claims generate care plans with benefit assignments and goal assignments for the claimant.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Claim identifier or reference number" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the claimant's person account" },
        { "name": "ClaimType", "type": "Picklist", "description": "Type of insurance claim such as Workers Compensation, Disability, or Retirement" },
        { "name": "Status", "type": "Picklist", "description": "Claim status: Filed, Under Review, Approved, Denied, or Closed" },
        { "name": "FiledDate", "type": "DateTime", "description": "Date and time when the claim was filed" },
        { "name": "ApprovalStatus", "type": "Picklist", "description": "Approval disposition: Pending, Approved, or Denied" },
        { "name": "InsurancePolicyId", "type": "Lookup", "description": "Reference to the insurance policy under which this claim is filed" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the claimant's person account" },
        { "target": "InsurancePolicy", "type": "lookup", "description": "Links to the insurance policy associated with the claim" },
        { "target": "ClaimItem", "type": "parent", "description": "Contains line items detailing specific claim elements" },
        { "target": "ClaimParticipant", "type": "parent", "description": "Contains participants related to this claim" }
      ]
    },
    {
      "name": "ClaimItem",
      "type": "standard",
      "domain": "social_insurance",
      "description": "Captures details of specific items related to a social insurance claim, such as individual medical treatments, lost wages, or rehabilitation services. Each item represents a discrete component of the claim with its own amount, category, and status, enabling granular review and approval of claim elements.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Description of the claim item such as Medical Treatment or Lost Wages" },
        { "name": "ClaimId", "type": "Lookup", "description": "Reference to the parent claim this item belongs to" },
        { "name": "Amount", "type": "Currency", "description": "Monetary amount for this claim item" },
        { "name": "ItemCategory", "type": "Picklist", "description": "Category such as Medical, Rehabilitation, Lost Wages, or Other" },
        { "name": "Status", "type": "Picklist", "description": "Item status: Submitted, Under Review, Approved, or Denied" }
      ],
      "relationships": [
        { "target": "Claim", "type": "lookup", "description": "Links to the parent claim this item is part of" }
      ]
    },
    {
      "name": "ClaimParticipant",
      "type": "standard",
      "domain": "social_insurance",
      "description": "Relates constituents to a social insurance claim with specific participation roles. Tracks the claimant, employer representative, medical providers, and other parties involved in the claim. The File a Claim and Respond to Claim OmniScript flows create participant records automatically when claims are filed and responded to.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this claim participant" },
        { "name": "ClaimId", "type": "Lookup", "description": "Reference to the claim this participant is related to" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the participant's account" },
        { "name": "Role", "type": "Picklist", "description": "Role in the claim such as Claimant, Employer, Medical Provider, or Witness" },
        { "name": "Status", "type": "Picklist", "description": "Participation status: Active or Inactive" }
      ],
      "relationships": [
        { "target": "Claim", "type": "lookup", "description": "Links to the claim this participant is involved in" },
        { "target": "Account", "type": "lookup", "description": "Links to the participant's account record" }
      ]
    },
    {
      "name": "Codeset",
      "type": "standard",
      "domain": "social_insurance",
      "description": "Stores diagnostic codes for medical conditions and service classifications used in social insurance claims and provider management. Represents distinct services a provider offers or variations of a benefit that caseworkers can assign. Code sets are mapped to care barrier types for medical conditions and to benefits through BenefitItemCode records for service delivery tracking.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the code set such as ICD-10 Diagnosis Code or Service Category Code" },
        { "name": "Code", "type": "Text", "description": "The diagnostic or service code value" },
        { "name": "Description", "type": "LongTextArea", "description": "Description of what this code represents" },
        { "name": "CodeSystem", "type": "Picklist", "description": "Classification system such as ICD-10, CPT, or Custom" },
        { "name": "Status", "type": "Picklist", "description": "Whether this code set is Active or Inactive" }
      ],
      "relationships": [
        { "target": "CodesetBundle", "type": "lookup", "description": "Links to the code set bundle that groups this code with related codes" },
        { "target": "BenefitItemCode", "type": "child", "description": "Maps this code set to specific benefits for service variation tracking" }
      ]
    },
    {
      "name": "CodesetBundle",
      "type": "standard",
      "domain": "social_insurance",
      "description": "Groups related code sets into bundles for organized management of diagnostic and service classification codes. Enables agencies to package multiple code sets together for a single benefit or service category. For example, a nursing care bundle might include weekday nursing, weekend nursing, and specialized nursing code sets. Bundles are referenced by BenefitItemCode records.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the code set bundle such as Nursing Care Bundle or Physical Therapy Bundle" },
        { "name": "Description", "type": "LongTextArea", "description": "Description of the code sets grouped in this bundle and their purpose" },
        { "name": "Status", "type": "Picklist", "description": "Whether this bundle is Active or Inactive" },
        { "name": "BundleType", "type": "Picklist", "description": "Classification of the bundle such as Diagnostic, Service, or Treatment" }
      ],
      "relationships": [
        { "target": "Codeset", "type": "parent", "description": "Contains the individual code sets grouped within this bundle" }
      ]
    }
  ]
},

"provider_management": {
  "objects": [
    {
      "name": "HealthcareProvider",
      "type": "standard",
      "domain": "provider_management",
      "description": "Represents an organization or individual that provides specialized services to constituents in the government agency's provider network. Providers are recruited and verified through credential inspection and facility certification before being made available for caseworker referrals. Details include the provider name, type, credentials, and verification status. Mapped to specialties through HealthcareProviderSpecialty records.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the healthcare provider such as City Counseling Center or Dr. Smith Physical Therapy" },
        { "name": "ProviderType", "type": "Picklist", "description": "Type of provider such as Individual Practitioner, Group Practice, or Organization" },
        { "name": "Status", "type": "Picklist", "description": "Verification status: Pending, Certified, Suspended, or Decertified" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the provider's business account in Salesforce" },
        { "name": "CredentialNumber", "type": "Text", "description": "Professional credential or license number of the provider" },
        { "name": "CredentialExpirationDate", "type": "Date", "description": "Expiration date for the provider's credential or certification" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the provider's business account" },
        { "target": "HealthcareProviderSpecialty", "type": "parent", "description": "Contains specialty records defining this provider's areas of expertise" },
        { "target": "HealthcarePractitionerFacility", "type": "parent", "description": "Tracks which facilities this provider practices at" }
      ]
    },
    {
      "name": "HealthcareFacility",
      "type": "standard",
      "domain": "provider_management",
      "description": "Represents a physical location where service providers deliver care to constituents, such as clinics, counseling centers, rehabilitation facilities, or training centers. Facilities are inspected and certified by the agency before being included in the provider network. Practitioners are associated with facilities through HealthcarePractitionerFacility junction records.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the facility such as Downtown Rehabilitation Center or Northside Counseling Clinic" },
        { "name": "FacilityType", "type": "Picklist", "description": "Category of facility such as Clinic, Hospital, Rehabilitation Center, or Training Center" },
        { "name": "Status", "type": "Picklist", "description": "Certification status: Active, Pending Inspection, or Decertified" },
        { "name": "Address", "type": "Text", "description": "Street address of the facility" },
        { "name": "LocationId", "type": "Lookup", "description": "Reference to the Salesforce Location record for geolocation" }
      ],
      "relationships": [
        { "target": "Location", "type": "lookup", "description": "Links to the geographic location record for distance-based provider search" },
        { "target": "HealthcarePractitionerFacility", "type": "parent", "description": "Contains records linking practitioners to this facility" },
        { "target": "CareProviderFacilitySpecialty", "type": "parent", "description": "Tracks which specialties are offered at this facility" }
      ]
    },
    {
      "name": "HealthcarePractitionerFacility",
      "type": "standard",
      "domain": "provider_management",
      "description": "Junction object that associates individual healthcare practitioners with the facilities where they provide services. Enables the provider registry to track which practitioners work at which locations, supporting provider search by facility and distance-based referral matching. Each record links a provider to a facility with an effective date range.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this practitioner-facility association" },
        { "name": "HealthcareProviderId", "type": "Lookup", "description": "Reference to the healthcare provider (practitioner)" },
        { "name": "HealthcareFacilityId", "type": "Lookup", "description": "Reference to the facility where the practitioner works" },
        { "name": "StartDate", "type": "Date", "description": "Date when the practitioner began working at this facility" },
        { "name": "EndDate", "type": "Date", "description": "Date when the practitioner stopped working at this facility, if applicable" }
      ],
      "relationships": [
        { "target": "HealthcareProvider", "type": "lookup", "description": "Links to the practitioner provider record" },
        { "target": "HealthcareFacility", "type": "lookup", "description": "Links to the facility where services are delivered" }
      ]
    },
    {
      "name": "CareSpecialty",
      "type": "standard",
      "domain": "provider_management",
      "description": "Defines a type of specialized service that providers can offer, such as grief counseling, physical therapy, occupational therapy, or substance abuse treatment. Care specialties are linked to providers through HealthcareProviderSpecialty records and to facilities through CareProviderFacilitySpecialty records, enabling criteria-based provider search matching.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the care specialty such as Grief Counseling or Physical Therapy" },
        { "name": "Description", "type": "LongTextArea", "description": "Description of the specialty and the types of services it covers" },
        { "name": "SpecialtyCategory", "type": "Picklist", "description": "Broad category such as Mental Health, Physical Rehabilitation, or Vocational Training" },
        { "name": "Status", "type": "Picklist", "description": "Whether this specialty is actively available in the provider network" }
      ],
      "relationships": [
        { "target": "HealthcareProviderSpecialty", "type": "child", "description": "Provider records linked to this specialty" },
        { "target": "CareProviderFacilitySpecialty", "type": "child", "description": "Facility records offering this specialty" }
      ]
    },
    {
      "name": "CareProviderFacilitySpecialty",
      "type": "standard",
      "domain": "provider_management",
      "description": "Junction object linking care specialties to healthcare facilities, establishing which specialized services are available at each location. Used by the criteria-based provider search framework to match constituent needs with facilities that offer the required specialties within a specified distance. Enables caseworkers to filter search results by specialty and location.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this facility-specialty link" },
        { "name": "HealthcareFacilityId", "type": "Lookup", "description": "Reference to the facility offering this specialty" },
        { "name": "CareSpecialtyId", "type": "Lookup", "description": "Reference to the care specialty available at this facility" },
        { "name": "Status", "type": "Picklist", "description": "Whether this specialty is currently offered at the facility" }
      ],
      "relationships": [
        { "target": "HealthcareFacility", "type": "lookup", "description": "Links to the facility where this specialty is offered" },
        { "target": "CareSpecialty", "type": "lookup", "description": "Links to the specialty offered at this facility" }
      ]
    },
    {
      "name": "HealthcareProviderSpecialty",
      "type": "standard",
      "domain": "provider_management",
      "description": "Junction object associating healthcare providers with their areas of specialization. Enables the provider registry to track which providers have expertise in which care specialties, supporting targeted referral matching where caseworkers need providers with specific qualifications to serve constituent needs.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this provider-specialty association" },
        { "name": "HealthcareProviderId", "type": "Lookup", "description": "Reference to the healthcare provider" },
        { "name": "CareSpecialtyId", "type": "Lookup", "description": "Reference to the care specialty the provider is qualified in" },
        { "name": "Status", "type": "Picklist", "description": "Whether this specialty is actively offered by the provider" }
      ],
      "relationships": [
        { "target": "HealthcareProvider", "type": "lookup", "description": "Links to the provider with this specialty" },
        { "target": "CareSpecialty", "type": "lookup", "description": "Links to the care specialty the provider offers" }
      ]
    },
    {
      "name": "BenefitSpecialty",
      "type": "standard",
      "domain": "provider_management",
      "description": "Maps agency benefits to provider specialties, enabling provider search to match constituent benefit assignments with providers who can deliver those specific services. When a caseworker searches for providers from the Benefit Assignments related list, the search framework uses benefit specialty mappings to show only qualified providers. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this benefit-to-specialty mapping" },
        { "name": "BenefitId", "type": "Lookup", "description": "Reference to the agency benefit" },
        { "name": "CareSpecialtyId", "type": "Lookup", "description": "Reference to the provider specialty that can deliver this benefit" },
        { "name": "Status", "type": "Picklist", "description": "Whether this mapping is currently active" }
      ],
      "relationships": [
        { "target": "Benefit", "type": "lookup", "description": "Links to the agency benefit that requires this provider specialty" },
        { "target": "CareSpecialty", "type": "lookup", "description": "Links to the specialty needed to deliver the benefit" }
      ]
    },
    {
      "name": "BenefitAsgntProviderLoc",
      "type": "standard",
      "domain": "provider_management",
      "description": "Associates a benefit assignment with a specific provider location, tracking where a constituent receives benefit services. Created when caseworkers select a provider from search results for a benefit assignment. Enables the provider portal to display enrolled clients and facilitates service delivery tracking at the facility level. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this assignment-provider-location link" },
        { "name": "BenefitAssignmentId", "type": "Lookup", "description": "Reference to the benefit assignment being served" },
        { "name": "HealthcareFacilityId", "type": "Lookup", "description": "Reference to the provider facility where services are delivered" },
        { "name": "HealthcareProviderId", "type": "Lookup", "description": "Reference to the provider delivering the service" },
        { "name": "Status", "type": "Picklist", "description": "Status of the provider-location assignment: Active, Completed, or Transferred" }
      ],
      "relationships": [
        { "target": "BenefitAssignment", "type": "lookup", "description": "Links to the benefit assignment being fulfilled at this location" },
        { "target": "HealthcareFacility", "type": "lookup", "description": "Links to the facility where the benefit is being delivered" },
        { "target": "HealthcareProvider", "type": "lookup", "description": "Links to the provider delivering the benefit" }
      ]
    },
    {
      "name": "BenefitPrvdSearchableFld",
      "type": "standard",
      "domain": "provider_management",
      "description": "Compiled searchable object that aggregates provider data from multiple provider management objects into a single flat record for efficient criteria-based search. Populated by the Data Processing Engine definition which runs periodically to synchronize data. Contains provider name, facility location, specialties, and distances for search filtering and sorting. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Auto-generated name for the searchable record" },
        { "name": "ProviderName", "type": "Text", "description": "Name of the provider for display in search results" },
        { "name": "FacilityName", "type": "Text", "description": "Name of the facility for display in search results" },
        { "name": "SpecialtyName", "type": "Text", "description": "Name of the provider's specialty" },
        { "name": "Address", "type": "Text", "description": "Facility address for distance-based search filtering" },
        { "name": "Distance", "type": "Number", "description": "Calculated distance from search origin for proximity filtering" }
      ],
      "relationships": [
        { "target": "HealthcareProvider", "type": "lookup", "description": "Links back to the source provider record" },
        { "target": "HealthcareFacility", "type": "lookup", "description": "Links back to the source facility record" }
      ]
    },
    {
      "name": "BenefitSession",
      "type": "standard",
      "domain": "provider_management",
      "description": "Represents a single instance of service delivery within a benefit schedule. Sessions are created when caseworkers approve provider-submitted benefit schedules, and providers use the provider portal to enroll constituents in sessions and track attendance. Each session creates a corresponding BenefitDisbursement record when the constituent is enrolled, enabling delivery and payment tracking.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this session" },
        { "name": "BenefitScheduleId", "type": "Lookup", "description": "Reference to the benefit schedule this session belongs to" },
        { "name": "SessionDate", "type": "DateTime", "description": "Date and time when the session is scheduled" },
        { "name": "Status", "type": "Picklist", "description": "Session status: Scheduled, Completed, Cancelled, or No-Show" },
        { "name": "AttendanceStatus", "type": "Picklist", "description": "Constituent attendance status: Present, Absent, or Excused" },
        { "name": "Quantity", "type": "Number", "description": "Quantity of service units delivered in this session" }
      ],
      "relationships": [
        { "target": "BenefitSchedule", "type": "lookup", "description": "Links to the benefit schedule containing this session" },
        { "target": "BenefitDisbursement", "type": "child", "description": "Disbursement record created when a constituent is enrolled in this session" }
      ]
    }
  ]
},

"investigative_cases": {
  "objects": [
    {
      "name": "ComplaintCase",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Represents an investigative case created from a screened public complaint. Links the original complaint to the case investigation, establishing the complaint as the basis for the case. Captures the screening results, case assignment, and the relationship between complaint and investigative proceedings. Used in the Casework Overview console for complaint management officers. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Identifier for the complaint case link" },
        { "name": "PublicComplaintId", "type": "Lookup", "description": "Reference to the original public complaint" },
        { "name": "CaseId", "type": "Lookup", "description": "Reference to the investigative case created from the complaint" },
        { "name": "ScreeningResult", "type": "Picklist", "description": "Result of the complaint screening: Substantiated, Unsubstantiated, or Pending" },
        { "name": "Status", "type": "Picklist", "description": "Status of the complaint-to-case link: Active, Closed, or Transferred" }
      ],
      "relationships": [
        { "target": "PublicComplaint", "type": "lookup", "description": "Links to the original public complaint that was screened" },
        { "target": "Case", "type": "lookup", "description": "Links to the investigative case created from the complaint" }
      ]
    },
    {
      "name": "ComplaintParticipant",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Records individuals involved in a public complaint with their specific roles, such as complainant, respondent, witness, or alleged victim. Captures participant details and their relationship to the complaint for investigation tracking. Displayed in the Casework Overview Actionable Relationship Center graphs. Field Audit Trail is enabled on this object.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this complaint participant" },
        { "name": "PublicComplaintId", "type": "Lookup", "description": "Reference to the complaint this participant is associated with" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the participant's account record" },
        { "name": "Role", "type": "Picklist", "description": "Role in the complaint: Complainant, Respondent, Witness, or Alleged Victim" },
        { "name": "Status", "type": "Picklist", "description": "Participation status: Active or Inactive" }
      ],
      "relationships": [
        { "target": "PublicComplaint", "type": "lookup", "description": "Links to the complaint this participant is involved in" },
        { "target": "Account", "type": "lookup", "description": "Links to the participant's account" }
      ]
    },
    {
      "name": "CaseProceeding",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Tracks criminal and civil legal proceedings including court actions, appeals, mediations, and arbitrations related to investigative cases. Records the proceeding type, venue, scheduled dates, and outcome. Links to participants with roles, infractions from regulatory code violations, and proceeding results. Managed through the Casework Overview console. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name or docket number of the case proceeding" },
        { "name": "CaseId", "type": "Lookup", "description": "Reference to the investigative case this proceeding belongs to" },
        { "name": "ProceedingType", "type": "Picklist", "description": "Type of proceeding: Court Action, Appeal, Mediation, Arbitration, or Hearing" },
        { "name": "Status", "type": "Picklist", "description": "Current status: Scheduled, In Progress, Completed, Dismissed, or Adjourned" },
        { "name": "ScheduledDate", "type": "DateTime", "description": "Scheduled date and time for the proceeding" },
        { "name": "Venue", "type": "Text", "description": "Court or venue where the proceeding takes place" }
      ],
      "relationships": [
        { "target": "Case", "type": "lookup", "description": "Links to the investigative case associated with this proceeding" },
        { "target": "CaseProceedingResult", "type": "parent", "description": "Contains the results or outcomes of this proceeding" },
        { "target": "CaseProceedingInfraction", "type": "parent", "description": "Contains infractions linked to regulatory code violations" }
      ]
    },
    {
      "name": "CaseProceedingComplaint",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Junction object linking case proceedings to the public complaints that led to the legal action. Establishes the connection between a specific proceeding and the original complaint, enabling investigators to trace the chain from complaint through investigation to legal resolution. Field Audit Trail is enabled on this object.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this proceeding-complaint link" },
        { "name": "CaseProceedingId", "type": "Lookup", "description": "Reference to the case proceeding" },
        { "name": "PublicComplaintId", "type": "Lookup", "description": "Reference to the public complaint linked to this proceeding" },
        { "name": "Status", "type": "Picklist", "description": "Status of the link: Active or Resolved" }
      ],
      "relationships": [
        { "target": "CaseProceeding", "type": "lookup", "description": "Links to the case proceeding" },
        { "target": "PublicComplaint", "type": "lookup", "description": "Links to the original complaint" }
      ]
    },
    {
      "name": "CaseProceedingInfraction",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Links specific infractions to case proceedings, connecting regulatory code violations to the legal actions taken in response. Each infraction record identifies the violation, its severity, and the proceeding addressing it. Enables prosecutors and investigators to build their case by documenting which regulatory standards were breached. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this infraction record" },
        { "name": "CaseProceedingId", "type": "Lookup", "description": "Reference to the case proceeding where this infraction is addressed" },
        { "name": "RegulatoryCodeViolationId", "type": "Lookup", "description": "Reference to the regulatory code violation constituting this infraction" },
        { "name": "Severity", "type": "Picklist", "description": "Severity classification of the infraction" },
        { "name": "Status", "type": "Picklist", "description": "Current status: Open, Adjudicated, or Dismissed" }
      ],
      "relationships": [
        { "target": "CaseProceeding", "type": "lookup", "description": "Links to the proceeding addressing this infraction" },
        { "target": "RegulatoryCodeViolation", "type": "lookup", "description": "Links to the regulatory code violation that constitutes this infraction" }
      ]
    },
    {
      "name": "CaseProceedingParticipant",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Records individuals and their roles in case proceedings, such as defendant, plaintiff, prosecutor, defense counsel, judge, or witness. Tracks participant involvement across the legal process from filing through resolution. Displayed in the Casework Overview Actionable Relationship Center graphs alongside case participants. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this proceeding participant" },
        { "name": "CaseProceedingId", "type": "Lookup", "description": "Reference to the case proceeding" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the participant's account" },
        { "name": "Role", "type": "Picklist", "description": "Role in the proceeding: Defendant, Plaintiff, Prosecutor, Defense Counsel, Judge, or Witness" },
        { "name": "Status", "type": "Picklist", "description": "Participation status: Active, Excused, or Withdrawn" }
      ],
      "relationships": [
        { "target": "CaseProceeding", "type": "lookup", "description": "Links to the case proceeding this participant is involved in" },
        { "target": "Account", "type": "lookup", "description": "Links to the participant's account record" }
      ]
    },
    {
      "name": "CaseProceedingResult",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Records the outcomes or rulings from case proceedings, such as guilty verdicts, dismissals, settlements, penalties, or remediation orders. Each result captures the disposition, date, and any enforcement actions or care plans resulting from the ruling. Multiple results can be recorded per proceeding to track different charges or issues. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this proceeding result" },
        { "name": "CaseProceedingId", "type": "Lookup", "description": "Reference to the case proceeding this result belongs to" },
        { "name": "Disposition", "type": "Picklist", "description": "Outcome such as Guilty, Not Guilty, Dismissed, Settled, or Continued" },
        { "name": "ResultDate", "type": "Date", "description": "Date when the result was rendered" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the ruling, penalties, or remediation orders" }
      ],
      "relationships": [
        { "target": "CaseProceeding", "type": "lookup", "description": "Links to the case proceeding that produced this result" }
      ]
    },
    {
      "name": "CaseParticipant",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Records individuals involved in an investigative case with their specific roles such as victim, suspect, witness, investigator, or caseworker. Participants are displayed in the Casework Overview Actionable Relationship Center graphs to visualize case relationships. Supports group representation for related participants through the group membership feature. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this case participant" },
        { "name": "CaseId", "type": "Lookup", "description": "Reference to the investigative case" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the participant's account" },
        { "name": "Role", "type": "Picklist", "description": "Role in the case: Victim, Suspect, Witness, Investigator, or Caseworker" },
        { "name": "Status", "type": "Picklist", "description": "Participation status: Active, Inactive, or Protected" }
      ],
      "relationships": [
        { "target": "Case", "type": "lookup", "description": "Links to the investigative case this participant is involved in" },
        { "target": "Account", "type": "lookup", "description": "Links to the participant's account record" }
      ]
    },
    {
      "name": "CaseEpisode",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Tracks distinct phases or episodes within an investigative case lifecycle, such as initial investigation, evidence collection, prosecution, and resolution. Case episodes enable investigators to organize case activity into meaningful segments and track the progression of the investigation. Available as a related list on case records in the Casework Overview console. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the case episode such as Initial Investigation or Prosecution Phase" },
        { "name": "CaseId", "type": "Lookup", "description": "Reference to the investigative case this episode belongs to" },
        { "name": "EpisodeType", "type": "Picklist", "description": "Type of episode: Investigation, Evidence Collection, Prosecution, or Resolution" },
        { "name": "Status", "type": "Picklist", "description": "Episode status: Active, Completed, or On Hold" },
        { "name": "StartDate", "type": "Date", "description": "Date when this episode began" },
        { "name": "EndDate", "type": "Date", "description": "Date when this episode ended" }
      ],
      "relationships": [
        { "target": "Case", "type": "lookup", "description": "Links to the investigative case this episode is part of" }
      ]
    },
    {
      "name": "CustodyItem",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Manages physical and digital evidence collected during investigations, recorded as custody items. Each item includes a description, status, custody site location, and verification type. The Add Evidence Omniscript guided flow simplifies evidence collection by creating custody items and linking them to cases. Evidence Management must be enabled in Setup for this object to be available.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name or description of the custody item such as Surveillance Video or Physical Evidence Sample" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the evidence item" },
        { "name": "Status", "type": "Picklist", "description": "Current status: In Custody, Released, Disposed, or Transferred" },
        { "name": "CustodySite", "type": "Text", "description": "Location where the evidence is stored or maintained" },
        { "name": "VerificationType", "type": "Picklist", "description": "Method used to verify the evidence: Visual, Forensic, Digital, or Testimonial" },
        { "name": "CollectedDate", "type": "DateTime", "description": "Date and time when the evidence was collected" }
      ],
      "relationships": [
        { "target": "CustodyChainEntry", "type": "parent", "description": "Contains chain of custody entries tracking evidence transfers" },
        { "target": "CustodyItemRelation", "type": "parent", "description": "Links this evidence to investigative cases" },
        { "target": "CustodyItemRgltyCodeVio", "type": "parent", "description": "Links this evidence to regulatory code violations" }
      ]
    },
    {
      "name": "CustodyChainEntry",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Records each transfer of custody for an evidence item, maintaining a complete chain of custody audit trail. Each entry captures the custodian receiving the item, the transfer date, the reason for transfer, and the location. This ensures evidence integrity and admissibility by documenting every person and location that handled the evidence. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this chain of custody entry" },
        { "name": "CustodyItemId", "type": "Lookup", "description": "Reference to the custody item being transferred" },
        { "name": "CustodianId", "type": "Lookup", "description": "Reference to the user or contact receiving custody" },
        { "name": "TransferDate", "type": "DateTime", "description": "Date and time when the custody transfer occurred" },
        { "name": "TransferReason", "type": "Text", "description": "Reason for the custody transfer such as Lab Analysis or Court Presentation" },
        { "name": "Location", "type": "Text", "description": "Physical location where the item is stored after transfer" }
      ],
      "relationships": [
        { "target": "CustodyItem", "type": "lookup", "description": "Links to the custody item being tracked through this chain entry" }
      ]
    },
    {
      "name": "CustodyItemRelation",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Junction object linking custody items (evidence) to investigative cases, establishing which evidence belongs to which investigation. Enables multiple pieces of evidence to be associated with a single case and a single piece of evidence to be relevant to multiple cases. Displayed in the Timeline component on case records. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this custody item to case link" },
        { "name": "CustodyItemId", "type": "Lookup", "description": "Reference to the custody item (evidence)" },
        { "name": "CaseId", "type": "Lookup", "description": "Reference to the investigative case" },
        { "name": "RelationType", "type": "Picklist", "description": "Type of relationship such as Primary Evidence, Supporting Evidence, or Reference" },
        { "name": "Status", "type": "Picklist", "description": "Status of the evidence-case link: Active, Superseded, or Removed" }
      ],
      "relationships": [
        { "target": "CustodyItem", "type": "lookup", "description": "Links to the evidence item" },
        { "target": "Case", "type": "lookup", "description": "Links to the investigative case" }
      ]
    },
    {
      "name": "CustodyItemRgltyCodeVio",
      "type": "standard",
      "domain": "investigative_cases",
      "description": "Junction object linking custody items (evidence) to regulatory code violations, documenting which pieces of evidence support or relate to specific violations. The Add Evidence guided flow creates these records automatically when investigators collect evidence related to a known violation. Enables building a traceable evidence chain from violation to custody. Field Audit Trail is enabled.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name identifying this evidence-to-violation link" },
        { "name": "CustodyItemId", "type": "Lookup", "description": "Reference to the custody item (evidence)" },
        { "name": "RegulatoryCodeViolationId", "type": "Lookup", "description": "Reference to the regulatory code violation this evidence relates to" },
        { "name": "Status", "type": "Picklist", "description": "Status of the link: Active or Superseded" }
      ],
      "relationships": [
        { "target": "CustodyItem", "type": "lookup", "description": "Links to the evidence item" },
        { "target": "RegulatoryCodeViolation", "type": "lookup", "description": "Links to the regulatory code violation" }
      ]
    }
  ]
},

"talent_recruitment": {
  "objects": [
    {
      "name": "JobPosition",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "A specific instance of a position in the organization held by an individual employee. Job positions link to positions, pay grades, and recruitment requisitions, representing the concrete role a person fills within a department. HR staff use job positions to track headcount and initiate recruitment when vacancies arise.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name identifying the job position such as Financial Auditor in Public Welfare" },
        { "name": "PositionId", "type": "Lookup", "description": "Reference to the position classification that defines the functional role" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the job position such as Vacant, Filled, or Abolished" },
        { "name": "DepartmentName", "type": "Text", "description": "Name of the department or organizational unit where this job position exists" },
        { "name": "EmployeeId", "type": "Lookup", "description": "Reference to the employee currently holding this job position" },
        { "name": "StartDate", "type": "Date", "description": "Date when this job position became active or was created" }
      ],
      "relationships": [
        { "target": "Position", "type": "lookup", "description": "Links to the position classification defining the functional role and qualifications" },
        { "target": "JobPositionPayGrade", "type": "parent", "description": "Parent of pay grade assignments that define compensation for this job position" },
        { "target": "JobPstnRecruitmentRqs", "type": "parent", "description": "Parent of junction records linking this job position to recruitment requisitions" }
      ]
    },
    {
      "name": "JobPositionPayGrade",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Junction object matching a job position with a specific pay grade. This linkage determines the salary range and pay steps applicable to the employee holding the position. Multiple pay grades can be associated with a single job position to reflect different compensation structures.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the job position pay grade assignment" },
        { "name": "JobPositionId", "type": "Lookup", "description": "Reference to the job position being assigned a pay grade" },
        { "name": "PayGradeId", "type": "Lookup", "description": "Reference to the pay grade assigned to this job position" }
      ],
      "relationships": [
        { "target": "JobPosition", "type": "lookup", "description": "Links to the specific job position being compensated" },
        { "target": "PayGrade", "type": "lookup", "description": "Links to the pay grade defining the salary range" }
      ]
    },
    {
      "name": "Position",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "A functional role in an occupation that has specific duties and responsibilities and requires specific skills and qualifications. Positions represent the abstract role definition (such as Accountant or Financial Auditor) from which concrete job positions are instantiated when employees are assigned.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the position such as Accountant or Performance Auditor" },
        { "name": "OccupationId", "type": "Lookup", "description": "Reference to the occupation classification this position belongs to" },
        { "name": "ScheduleType", "type": "Picklist", "description": "Work schedule classification such as Full-time or Part-time" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of duties, responsibilities, and requirements for this position" }
      ],
      "relationships": [
        { "target": "Occupation", "type": "lookup", "description": "Links to the occupation category this position belongs to" },
        { "target": "PositionPayGrade", "type": "parent", "description": "Parent of pay grade assignments that define compensation ranges for this position" },
        { "target": "JobPosition", "type": "parent", "description": "Parent of concrete job position instances derived from this position" }
      ]
    },
    {
      "name": "PositionPayGrade",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Junction object matching a position with a pay grade. This defines the standard compensation range for a functional role before it is instantiated as a job position. Agencies use position pay grades to establish baseline salary structures across their workforce classification system.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the position pay grade assignment" },
        { "name": "PositionId", "type": "Lookup", "description": "Reference to the position being assigned a pay grade" },
        { "name": "PayGradeId", "type": "Lookup", "description": "Reference to the pay grade assigned to this position" }
      ],
      "relationships": [
        { "target": "Position", "type": "lookup", "description": "Links to the functional role being compensated" },
        { "target": "PayGrade", "type": "lookup", "description": "Links to the pay grade defining the salary band" }
      ]
    },
    {
      "name": "PayGrade",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "A pay band or salary range for a set of positions that have similar responsibilities and require similar competencies. In the US federal government, this maps to General Schedule grades (GS1 through GS15). Pay grades contain pay grade steps that represent incremental pay increases within the band.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the pay grade such as GS-12 or Grade 7" },
        { "name": "MinimumPay", "type": "Currency", "description": "Minimum salary or hourly rate for this pay grade" },
        { "name": "MaximumPay", "type": "Currency", "description": "Maximum salary or hourly rate for this pay grade" },
        { "name": "Description", "type": "LongTextArea", "description": "Description of the pay grade including applicable positions and responsibilities" }
      ],
      "relationships": [
        { "target": "PayGradeStep", "type": "parent", "description": "Parent of pay grade steps that define incremental increases within this band" },
        { "target": "PositionPayGrade", "type": "parent", "description": "Parent of junction records linking this grade to positions" }
      ]
    },
    {
      "name": "PayGradeStep",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "A pay increase within a pay grade representing an incremental step in compensation. For example, each grade in the US General Schedule has approximately ten steps, with each step representing roughly a 3% increase in pay. Steps reward tenure and performance within the same grade level.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the pay grade step such as Step 5 or Step 10" },
        { "name": "PayGradeId", "type": "Lookup", "description": "Reference to the parent pay grade this step belongs to" },
        { "name": "StepAmount", "type": "Currency", "description": "The salary or hourly rate at this step level" },
        { "name": "StepNumber", "type": "Number", "description": "Ordinal number of this step within the pay grade" }
      ],
      "relationships": [
        { "target": "PayGrade", "type": "lookup", "description": "Links to the parent pay grade this step belongs to" },
        { "target": "PayGradeStepLocation", "type": "parent", "description": "Parent of location-specific pay step adjustments" }
      ]
    },
    {
      "name": "PayGradeStepLocation",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "A location-specific pay adjustment for a pay grade step. Pay steps can vary from one region to another to match differences in cost of living. Agencies use this object to implement locality pay tables where the same grade and step yield different compensation amounts depending on the geographic area.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name identifying the location-specific pay step" },
        { "name": "PayGradeStepId", "type": "Lookup", "description": "Reference to the parent pay grade step" },
        { "name": "LocationName", "type": "Text", "description": "Name of the geographic locality or region for this pay adjustment" },
        { "name": "AdjustedAmount", "type": "Currency", "description": "The locality-adjusted salary or hourly rate at this step" }
      ],
      "relationships": [
        { "target": "PayGradeStep", "type": "lookup", "description": "Links to the pay grade step being adjusted for this location" }
      ]
    },
    {
      "name": "Occupation",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "A category of work that requires similar skills, knowledge, or qualifications in a specialized field. Examples include Accounting, Auditing, and Budget Analysis. Occupations group related positions and belong to broader occupation groups, forming the foundation of the agency's workforce classification hierarchy.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the occupation such as Accounting or Budget Analysis" },
        { "name": "OccupationGroupId", "type": "Lookup", "description": "Reference to the parent occupation group" },
        { "name": "Status", "type": "Picklist", "description": "Whether this occupation is Active or Inactive" },
        { "name": "Description", "type": "LongTextArea", "description": "Description of the skills, knowledge, and qualifications required" }
      ],
      "relationships": [
        { "target": "OccupationGroup", "type": "lookup", "description": "Links to the broader occupation group this category belongs to" },
        { "target": "Position", "type": "parent", "description": "Parent of positions that represent functional roles within this occupation" }
      ]
    },
    {
      "name": "OccupationGroup",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "A broad category of related occupations that require similar functions, skills, or equipment. For example, Professional and Administrative Occupations in Accounting, Auditing, and Budgeting. Occupation groups form the top level of the workforce classification hierarchy used to organize and manage talent across the agency.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the occupation group such as Professional and Administrative Occupations" },
        { "name": "Status", "type": "Picklist", "description": "Whether this occupation group is Active or Inactive" },
        { "name": "Description", "type": "LongTextArea", "description": "Description of the broad category including the types of occupations it encompasses" }
      ],
      "relationships": [
        { "target": "Occupation", "type": "parent", "description": "Parent of occupation categories grouped under this classification" }
      ]
    },
    {
      "name": "RecruitmentRequisition",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "A formal request to fill a specific job position, created by recruiters in collaboration with hiring managers. Requisitions track vacancy type, default posting language, and approval status. They serve as the gatekeeping record between identifying a hiring need and publishing a job posting on the career site.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name or title of the recruitment requisition" },
        { "name": "VacancyType", "type": "Picklist", "description": "Type of vacancy such as Full-time or Part-time" },
        { "name": "DefaultPostingLanguage", "type": "Picklist", "description": "Default language for job postings such as English or Espanol" },
        { "name": "Status", "type": "Picklist", "description": "Approval and processing status of the requisition" },
        { "name": "HiringManagerId", "type": "Lookup", "description": "Reference to the hiring manager responsible for this requisition" }
      ],
      "relationships": [
        { "target": "JobPstnRecruitmentRqs", "type": "parent", "description": "Parent of junction records linking this requisition to job positions" },
        { "target": "RecruitmentRequisitionLoc", "type": "parent", "description": "Parent of location records specifying where the vacancy exists" },
        { "target": "RecruitmentRequisitionPtcp", "type": "parent", "description": "Parent of participant records tracking hiring managers and interviewers" },
        { "target": "RecruitmentPosting", "type": "parent", "description": "Parent of job postings created from this requisition" }
      ]
    },
    {
      "name": "RecruitmentRequisitionLoc",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Specifies a geographic location associated with a recruitment requisition, indicating where the vacancy exists. A single requisition can have multiple locations when the same role is open across different offices or regions, enabling location-based job search on the career site.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the requisition location record" },
        { "name": "RecruitmentRequisitionId", "type": "Lookup", "description": "Reference to the parent recruitment requisition" },
        { "name": "LocationName", "type": "Text", "description": "Name or address of the location where the vacancy exists" }
      ],
      "relationships": [
        { "target": "RecruitmentRequisition", "type": "lookup", "description": "Links to the parent requisition this location belongs to" }
      ]
    },
    {
      "name": "RecruitmentRequisitionPtcp",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Tracks a participant in the recruitment requisition process such as a hiring manager or interviewer. Participants are assigned specific roles and access levels through Compliant Data Sharing, controlling which requisition records they can view and edit during the hiring workflow.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the requisition participant" },
        { "name": "RecruitmentRequisitionId", "type": "Lookup", "description": "Reference to the recruitment requisition this participant is associated with" },
        { "name": "ParticipantRole", "type": "Picklist", "description": "Role of the participant such as Hiring Manager or Interviewer" },
        { "name": "UserId", "type": "Lookup", "description": "Reference to the Salesforce user participating in the requisition" }
      ],
      "relationships": [
        { "target": "RecruitmentRequisition", "type": "lookup", "description": "Links to the requisition this participant is involved with" }
      ]
    },
    {
      "name": "JobPstnRecruitmentRqs",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Junction object linking a job position to a recruitment requisition, establishing which vacancy the requisition aims to fill. This relationship enables tracking of multiple requisitions for a single position across different hiring cycles and supports the Skill-Based Candidate Sourcing agent topic.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the junction record" },
        { "name": "JobPositionId", "type": "Lookup", "description": "Reference to the job position being recruited for" },
        { "name": "RecruitmentRequisitionId", "type": "Lookup", "description": "Reference to the recruitment requisition for this job position" }
      ],
      "relationships": [
        { "target": "JobPosition", "type": "lookup", "description": "Links to the job position the requisition aims to fill" },
        { "target": "RecruitmentRequisition", "type": "lookup", "description": "Links to the recruitment requisition for this position" }
      ]
    },
    {
      "name": "RecruitmentPosting",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "A published job posting for an approved recruitment requisition, visible on the career site or external portals. Postings contain structured content sections for overview, summary, and duties in multiple languages. The Data Processing Engine populates a searchable field to enable full-text search for job seekers on the career site.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Title of the job posting as displayed to applicants" },
        { "name": "RecruitmentRequisitionId", "type": "Lookup", "description": "Reference to the approved requisition this posting is based on" },
        { "name": "CandidateSourceKey", "type": "Picklist", "description": "Where the posting is published such as Career Site or External Portal" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the posting: Active, Draft, Inactive, or Waiting for Approval" },
        { "name": "PostingDate", "type": "Date", "description": "Date when this posting was published on the career site" },
        { "name": "SearchableField", "type": "LongTextArea", "description": "Compiled searchable content populated by the Data Processing Engine for career site search" }
      ],
      "relationships": [
        { "target": "RecruitmentRequisition", "type": "lookup", "description": "Links to the approved requisition this posting advertises" },
        { "target": "RecruitmentPostingCntntSect", "type": "parent", "description": "Parent of content section records containing posting details" }
      ]
    },
    {
      "name": "RecruitmentPostingCntntSect",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Links a recruitment posting to a content section, associating specific content blocks with a job posting. This junction enables the same content section to be reused across multiple postings and supports multilingual content by associating sections in different languages with the same posting.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the posting content section link" },
        { "name": "RecruitmentPostingId", "type": "Lookup", "description": "Reference to the parent recruitment posting" },
        { "name": "RecruitmentContentSectionId", "type": "Lookup", "description": "Reference to the reusable content section" }
      ],
      "relationships": [
        { "target": "RecruitmentPosting", "type": "lookup", "description": "Links to the job posting this content section belongs to" },
        { "target": "RecruitmentContentSection", "type": "lookup", "description": "Links to the reusable content block" }
      ]
    },
    {
      "name": "RecruitmentContentSection",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "A reusable block of content for job postings that stores overview, summary, or duties text in a specific language. Content sections can be shared across multiple postings through the RecruitmentPostingCntntSect junction. Recruiters create sections in multiple languages to support multilingual career sites.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the content section" },
        { "name": "Language", "type": "Picklist", "description": "Language of the content such as English or Espanol" },
        { "name": "Status", "type": "Picklist", "description": "Whether this content section is Active or Inactive" },
        { "name": "Type", "type": "Picklist", "description": "Category of content: Overview, Summary, or Duties" },
        { "name": "Content", "type": "RichTextArea", "description": "The actual content text displayed in the job posting" }
      ],
      "relationships": [
        { "target": "RecruitmentPostingCntntSect", "type": "parent", "description": "Parent of junction records linking this section to job postings" }
      ]
    },
    {
      "name": "ApplicationFormRelation",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Represents a relationship between an application form and a related record such as an applicant, evaluator, or hiring manager. In the talent recruitment context, this tracks which participants are associated with each job application. Compliant Data Sharing uses these relations to control record visibility between recruiters, hiring managers, and applicants.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the application form relation" },
        { "name": "ApplicationFormId", "type": "Lookup", "description": "Reference to the application form this relation belongs to" },
        { "name": "RelatedRecordId", "type": "Lookup", "description": "Reference to the related record such as a person account or user" },
        { "name": "Role", "type": "Picklist", "description": "Role of the related party such as Applicant, Evaluator, or Collaborator" }
      ],
      "relationships": [
        { "target": "ApplicationForm", "type": "lookup", "description": "Links to the parent application form" }
      ]
    },
    {
      "name": "ApplicationFormEvalPtcp",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Tracks a participant in an application form evaluation, such as a hiring manager or interviewer assigned to review a specific applicant. Evaluation participants receive Dynamic Assessment action plans with structured feedback questionnaires. Compliant Data Sharing controls which evaluation records each participant can access.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the evaluation participant" },
        { "name": "ApplicationFormEvaluationId", "type": "Lookup", "description": "Reference to the application form evaluation this participant belongs to" },
        { "name": "ParticipantId", "type": "Lookup", "description": "Reference to the user or contact participating in the evaluation" },
        { "name": "Role", "type": "Picklist", "description": "Role of the participant such as Hiring Manager or Interviewer" }
      ],
      "relationships": [
        { "target": "ApplicationFormEvaluation", "type": "lookup", "description": "Links to the application form evaluation being participated in" }
      ]
    },
    {
      "name": "VettingEvaluation",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Administers background checks, health examinations, reference checks, and other vetting procedures for selected applicants. Each vetting evaluation tracks the outcome (Approved, Conditionally Approved, Flagged for Review, Pending, or Rejected) and status (Not Started, In Progress, Complete). Dynamic Assessments with action plan templates structure each vetting type.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name identifying the vetting evaluation" },
        { "name": "Outcome", "type": "Picklist", "description": "Result of the vetting: Approved, Conditionally Approved, Flagged for Review, Pending, or Rejected" },
        { "name": "Status", "type": "Picklist", "description": "Processing status: Not Started, In Progress, or Complete" },
        { "name": "ApplicationFormId", "type": "Lookup", "description": "Reference to the application form being vetted" },
        { "name": "VettingType", "type": "Picklist", "description": "Category of vetting such as Background Check, Health Examination, or Reference Check" }
      ],
      "relationships": [
        { "target": "EmploymentOfferVettingEval", "type": "parent", "description": "Parent of junction records linking this vetting to employment offers" }
      ]
    },
    {
      "name": "Examination",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Represents a formal examination or certification test that applicants can complete as part of the recruitment or vetting process. Examinations are used by the Skill-Based Candidate Sourcing agent to identify candidates with specific skills and qualifications. The Einstein Search Retriever indexes examination data for RAG-powered agent responses.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the examination or certification test" },
        { "name": "Description", "type": "LongTextArea", "description": "Description of what the examination covers and its requirements" },
        { "name": "Status", "type": "Picklist", "description": "Whether this examination is active and available for use" }
      ],
      "relationships": [
        { "target": "PersonExamination", "type": "parent", "description": "Parent of records tracking which individuals have completed this examination" }
      ]
    },
    {
      "name": "PersonExamination",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Tracks an individual's completion of an examination, linking a person account to an examination record with results and dates. The Skill-Based Candidate Sourcing agent queries person examination records to find candidates whose qualifications match job posting requirements.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the person examination record" },
        { "name": "PersonId", "type": "Lookup", "description": "Reference to the person account who took the examination" },
        { "name": "ExaminationId", "type": "Lookup", "description": "Reference to the examination that was completed" },
        { "name": "CompletionDate", "type": "Date", "description": "Date when the person completed the examination" },
        { "name": "Result", "type": "Picklist", "description": "Outcome of the examination such as Pass, Fail, or Pending" }
      ],
      "relationships": [
        { "target": "Examination", "type": "lookup", "description": "Links to the examination that was completed" }
      ]
    },
    {
      "name": "CourseOffering",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Represents a scheduled training course or educational offering available to applicants and employees. Course offerings support professional development requirements and vetting procedures that require completion of specific training programs before employment offers can be finalized.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name or title of the course offering" },
        { "name": "StartDate", "type": "Date", "description": "Date when the course offering begins" },
        { "name": "EndDate", "type": "Date", "description": "Date when the course offering ends" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the course such as Scheduled, In Progress, or Completed" }
      ],
      "relationships": [
        { "target": "Examination", "type": "lookup", "description": "Links to an examination associated with this training course" }
      ]
    },
    {
      "name": "EmploymentOffer",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "A tentative or final employment offer extended to an applicant who has passed evaluation and vetting stages. HR specialists create tentative offers first, then confirm with final offers after all vetting evaluations clear. The offer tracks type (Tentative or Final), status, and links to the applicant's vetting evaluations.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name or reference for the employment offer" },
        { "name": "Type", "type": "Picklist", "description": "Type of offer: Tentative or Final" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the offer such as Pending, Accepted, or Declined" },
        { "name": "ApplicationFormId", "type": "Lookup", "description": "Reference to the application form this offer is based on" },
        { "name": "OfferDate", "type": "Date", "description": "Date when the employment offer was extended to the applicant" }
      ],
      "relationships": [
        { "target": "EmploymentOfferVettingEval", "type": "parent", "description": "Parent of junction records linking this offer to vetting evaluation results" }
      ]
    },
    {
      "name": "EmploymentOfferVettingEval",
      "type": "standard",
      "domain": "talent_recruitment",
      "description": "Junction object linking an employment offer to a vetting evaluation, confirming that the applicant has cleared the required vetting before the final offer is issued. HR specialists use this to verify that all background checks, health examinations, and reference checks are complete before rolling out the final employment offer.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the offer-vetting junction record" },
        { "name": "EmploymentOfferId", "type": "Lookup", "description": "Reference to the employment offer" },
        { "name": "VettingEvaluationId", "type": "Lookup", "description": "Reference to the vetting evaluation linked to this offer" }
      ],
      "relationships": [
        { "target": "EmploymentOffer", "type": "lookup", "description": "Links to the employment offer requiring vetting clearance" },
        { "target": "VettingEvaluation", "type": "lookup", "description": "Links to the vetting evaluation confirming applicant clearance" }
      ]
    }
  ]
},

"agentforce": {
  "objects": [
    {
      "name": "ApplicationForm",
      "type": "standard",
      "domain": "agentforce",
      "description": "The standard application tracking object used across Nonprofit Cloud and Industries for managing applications from intake through decision. In the Agentforce context, the Candidate Sourcing agent filters and retrieves application forms to find qualified candidates from past applicants. Supports compliant data sharing, stage management, and Form Framework for multi-section forms.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name or reference number for the application form" },
        { "name": "Stage", "type": "Picklist", "description": "Current stage such as New, Details Validated, Evaluation Complete, Vetting Complete, Rejected, Approved, or Offered" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the person account of the applicant" },
        { "name": "FundingOpportunityId", "type": "Lookup", "description": "Reference to the funding opportunity being applied for, if applicable" },
        { "name": "SubmittedDate", "type": "Date", "description": "Date when the application was submitted" }
      ],
      "relationships": [
        { "target": "ApplicationFormRelation", "type": "parent", "description": "Parent of relation records linking participants to this application" },
        { "target": "ApplicationFormEvaluation", "type": "parent", "description": "Parent of evaluation records for reviewing this application" }
      ]
    },
    {
      "name": "Lead",
      "type": "standard",
      "domain": "agentforce",
      "description": "Standard Salesforce lead object used by the Candidate Sourcing agent to create candidate leads from past applicants. When the agent identifies qualified candidates for a recruitment posting, it creates lead records combining the recruitment posting name with the candidate's name. The Email Candidate Leads flow sends personalized outreach to these leads.",
      "fields": [
        { "name": "FirstName", "type": "Text", "description": "First name of the candidate lead" },
        { "name": "LastName", "type": "Text", "description": "Last name of the candidate lead" },
        { "name": "Email", "type": "Email", "description": "Email address for outreach communications" },
        { "name": "Title", "type": "Text", "description": "Job title combining recruitment posting name and candidate name" },
        { "name": "Status", "type": "Picklist", "description": "Lead status such as New, Contacted, or Qualified" }
      ],
      "relationships": [
        { "target": "RecruitmentPosting", "type": "lookup", "description": "Links to the recruitment posting this candidate lead was sourced for" }
      ]
    },
    {
      "name": "PartyProfile",
      "type": "standard",
      "domain": "agentforce",
      "description": "Represents an applicant's profile on the career site, containing personal information, preferences, and qualifications. Job seekers create profiles through a guided flow that captures data used to personalize job recommendations, build the talent pool, and prefill future applications. The Candidate Sourcing agent uses party profiles to assess candidate suitability.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the party profile" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the person account this profile belongs to" },
        { "name": "ProfileType", "type": "Picklist", "description": "Type of profile such as Applicant or Employee" }
      ],
      "relationships": [
        { "target": "PartyProfileAddress", "type": "parent", "description": "Parent of address records storing location preferences" },
        { "target": "PersonEducation", "type": "parent", "description": "Parent of education history records" },
        { "target": "PersonCompetency", "type": "parent", "description": "Parent of competency records tracking skills and expertise" }
      ]
    },
    {
      "name": "PersonCompetency",
      "type": "standard",
      "domain": "agentforce",
      "description": "Tracks a specific skill, subject matter expertise, or competency held by a person. The Skill-Based Candidate Sourcing agent queries person competencies alongside person examinations to find candidates matching job requirements. Competency categories include Communication, Leadership, and Technical.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the competency or skill" },
        { "name": "PersonId", "type": "Lookup", "description": "Reference to the person account holding this competency" },
        { "name": "Category", "type": "Picklist", "description": "Category of competency such as Communication, Leadership, or Technical" },
        { "name": "ProficiencyLevel", "type": "Picklist", "description": "Skill proficiency level such as Beginner, Intermediate, Advanced, or Expert" }
      ],
      "relationships": [
        { "target": "PartyProfile", "type": "lookup", "description": "Links to the party profile this competency belongs to" }
      ]
    },
    {
      "name": "PartyProfileAddress",
      "type": "standard",
      "domain": "agentforce",
      "description": "Stores location and address preferences for an applicant's party profile. The Job Recommendation agent uses these addresses along with distance preferences to match applicants with nearby job postings. Supports multiple addresses per profile for flexible location-based recommendations.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the address record" },
        { "name": "PartyProfileId", "type": "Lookup", "description": "Reference to the parent party profile" },
        { "name": "Street", "type": "Text", "description": "Street address of the applicant" },
        { "name": "City", "type": "Text", "description": "City name" },
        { "name": "State", "type": "Text", "description": "State or province" },
        { "name": "PostalCode", "type": "Text", "description": "Postal or ZIP code" }
      ],
      "relationships": [
        { "target": "PartyProfile", "type": "lookup", "description": "Links to the party profile this address belongs to" }
      ]
    },
    {
      "name": "PersonEducation",
      "type": "standard",
      "domain": "agentforce",
      "description": "Records an individual's educational background including degrees, institutions, and fields of study. The Job Recommendation agent uses education data from person profiles to match applicants with relevant job postings. Education records are also used to prefill application forms when job seekers apply through the career site.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name or title of the education record" },
        { "name": "PersonId", "type": "Lookup", "description": "Reference to the person account this education record belongs to" },
        { "name": "InstitutionName", "type": "Text", "description": "Name of the educational institution" },
        { "name": "DegreeType", "type": "Picklist", "description": "Type of degree such as Bachelor, Master, or Doctorate" },
        { "name": "FieldOfStudy", "type": "Text", "description": "Major or field of study" }
      ],
      "relationships": [
        { "target": "PartyProfile", "type": "lookup", "description": "Links to the party profile this education record belongs to" }
      ]
    },
    {
      "name": "PublicComplaint",
      "type": "standard",
      "domain": "agentforce",
      "description": "Records a complaint filed by a constituent through the self-service portal or intake officer. In the Agentforce context, the Complaint Intake agent automates complaint filing by checking agency authority, extracting details, detecting duplicates, and generating AI summaries. The Complaint Management agent assists officers with high-volume complaint screening.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated complaint reference number" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the complaint such as New, Under Review, or Resolved" },
        { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the complaint provided by the constituent" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the person account of the complainant" },
        { "name": "ComplaintDate", "type": "Date", "description": "Date when the complaint was filed" }
      ],
      "relationships": [
        { "target": "ComplaintCase", "type": "parent", "description": "Parent of complaint case records linking this complaint to investigative cases" }
      ]
    }
  ]
},

"einstein_ai": {
  "objects": [
    {
      "name": "FundingDisbursement",
      "type": "standard",
      "domain": "einstein_ai",
      "description": "Tracks the execution of a funding disbursement from an awarded grant. In the Einstein AI context, disbursement records serve as grounding data for AI-generated funding award summaries showing milestone progress, requirement fulfillment, and disbursement status. Einstein generative AI analyzes disbursement patterns to help program officers make informed funding decisions.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the disbursement record" },
        { "name": "FundingAwardId", "type": "Lookup", "description": "Reference to the funding award this disbursement belongs to" },
        { "name": "Amount", "type": "Currency", "description": "The monetary amount of this disbursement" },
        { "name": "DisbursementDate", "type": "Date", "description": "Date when the disbursement was executed" },
        { "name": "Status", "type": "Picklist", "description": "Status of the disbursement such as Scheduled, Completed, or Cancelled" }
      ],
      "relationships": [
        { "target": "FundingAward", "type": "lookup", "description": "Links to the funding award this disbursement is part of" }
      ]
    },
    {
      "name": "InteractionSummary",
      "type": "standard",
      "domain": "einstein_ai",
      "description": "Captures detailed meeting notes with rich text, attendees, action items, interest tags, and file attachments from caseworker interactions with constituents. Einstein Notes Summary helps case managers quickly absorb constituent information from interaction summaries. Summaries can be published to lock them as evidence records with compliant data sharing for privacy control.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Title or subject of the interaction summary" },
        { "name": "SummaryContent", "type": "RichTextArea", "description": "Rich text content of the meeting notes and interaction details" },
        { "name": "InteractionDate", "type": "DateTime", "description": "Date and time when the interaction occurred" },
        { "name": "IsPublished", "type": "Checkbox", "description": "Indicates whether the summary has been published and locked as evidence" },
        { "name": "ParentRecordId", "type": "Lookup", "description": "Reference to the parent record such as a case or care plan" }
      ],
      "relationships": [
        { "target": "Interaction", "type": "lookup", "description": "Links to the parent interaction record" }
      ]
    }
  ]
},

"data_360": {
  "objects": [
    {
      "name": "Individual",
      "type": "standard",
      "domain": "data_360",
      "description": "Represents an individual person record in Salesforce used for data privacy and consent management. In the Data 360 context, Individual records are mapped through the PSS Data Kit to Data Cloud model objects, enabling profile unification across multiple data sources. The data kit maps over 100 PSS objects to create comprehensive constituent profiles.",
      "fields": [
        { "name": "FirstName", "type": "Text", "description": "First name of the individual" },
        { "name": "LastName", "type": "Text", "description": "Last name of the individual" },
        { "name": "ConsentStatus", "type": "Picklist", "description": "Current data consent status for privacy compliance" },
        { "name": "BirthDate", "type": "Date", "description": "Date of birth of the individual" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the account record for this individual" },
        { "target": "Contact", "type": "lookup", "description": "Links to the contact record for this individual" }
      ]
    },
    {
      "name": "Account",
      "type": "standard",
      "domain": "data_360",
      "description": "The standard Salesforce Account object used in Data 360 as a core mapping target for constituent and organization data. Data streams map Account data alongside person accounts into Data Cloud model objects for near real-time ingestion. External data sources like HR systems and other agencies connect through the Ingestion API to enrich account profiles.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the account or organization" },
        { "name": "Type", "type": "Picklist", "description": "Account type such as Person Account, Business, or Agency" },
        { "name": "BillingCity", "type": "Text", "description": "City of the account's billing address" },
        { "name": "BillingState", "type": "Text", "description": "State of the account's billing address" }
      ],
      "relationships": [
        { "target": "Contact", "type": "parent", "description": "Parent of contacts associated with this account" },
        { "target": "Individual", "type": "lookup", "description": "Links to the individual record for data privacy management" }
      ]
    },
    {
      "name": "Contact",
      "type": "standard",
      "domain": "data_360",
      "description": "The standard Salesforce Contact object mapped through Data 360 data streams to Data Cloud for unified constituent profiles. Contact records from the PSS org flow through predefined data streams for near real-time ingestion. External data sources like credentialing systems and HR platforms merge contact information to create comprehensive 360-degree profiles.",
      "fields": [
        { "name": "FirstName", "type": "Text", "description": "First name of the contact" },
        { "name": "LastName", "type": "Text", "description": "Last name of the contact" },
        { "name": "Email", "type": "Email", "description": "Email address of the contact" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the parent account" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the parent account this contact belongs to" },
        { "target": "Individual", "type": "lookup", "description": "Links to the individual record for privacy management" }
      ]
    }
  ]
},

"experience_cloud": {
  "objects": [
    {
      "name": "CarePlan",
      "type": "standard",
      "domain": "experience_cloud",
      "description": "Represents a care plan for a constituent, visible through the Benefit Assistance Experience Cloud site. Constituents can view their care plans, access associated tasks, and report changes of circumstances through the self-service portal. Care plans aggregate benefits, goals, referrals, and action items into a unified view of the services a constituent is receiving.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the care plan" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the person account this care plan belongs to" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the care plan such as Active, On Hold, or Completed" },
        { "name": "StartDate", "type": "Date", "description": "Date when the care plan became active" },
        { "name": "EndDate", "type": "Date", "description": "Expected or actual end date of the care plan" }
      ],
      "relationships": [
        { "target": "Referral", "type": "parent", "description": "Parent of referral records for service provider coordination" }
      ]
    },
    {
      "name": "Referral",
      "type": "standard",
      "domain": "experience_cloud",
      "description": "Tracks a referral for services from one agency or provider to another. In the Experience Cloud context, providers process referral requests, track service delivery, and manage their information through the Service Provider Portal. The Emergency Response Site also displays referrals for crisis-time assistance programs.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated referral reference number" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the referral such as Pending, Accepted, In Progress, or Completed" },
        { "name": "ReferralType", "type": "Picklist", "description": "Category of referral such as Medical, Social Services, or Housing" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the constituent's account" },
        { "name": "ProviderId", "type": "Lookup", "description": "Reference to the service provider receiving the referral" }
      ],
      "relationships": [
        { "target": "CarePlan", "type": "lookup", "description": "Links to the care plan this referral supports" }
      ]
    }
  ]
},

"crm_analytics": {
  "objects": [
    {
      "name": "Case",
      "type": "standard",
      "domain": "crm_analytics",
      "description": "The standard Salesforce Case object used across CRM Analytics dashboards for caseworker productivity, workload management, and SLA tracking. The Case Analytics dashboard embedded on case record pages shows how many days a case has spent in each status and total processing time. Cases also feed into the Workload Management Analytics dashboard for caseload distribution metrics.",
      "fields": [
        { "name": "CaseNumber", "type": "AutoNumber", "description": "Auto-generated unique case reference number" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the case such as New, In Progress, Escalated, or Closed" },
        { "name": "Priority", "type": "Picklist", "description": "Priority level such as High, Medium, or Low" },
        { "name": "OwnerId", "type": "Lookup", "description": "Reference to the user or queue assigned to this case" },
        { "name": "CreatedDate", "type": "DateTime", "description": "Date and time when the case was created" },
        { "name": "ClosedDate", "type": "DateTime", "description": "Date and time when the case was closed" }
      ],
      "relationships": [
        { "target": "Account", "type": "lookup", "description": "Links to the account this case belongs to" },
        { "target": "Contact", "type": "lookup", "description": "Links to the contact who reported or is associated with this case" }
      ]
    }
  ]
},

"emergency_and_assets": {
  "objects": [
    {
      "name": "Polygon",
      "type": "standard",
      "domain": "emergency_and_assets",
      "description": "Defines a geographic boundary for emergency zones, restricted areas, and inspection regions. Polygons are used to map affected areas during crises, coordinate field responders across multiple locations, and establish boundaries for location-based inspection scheduling. Agencies create polygons to visually represent emergency zones on maps and track visitor access to restricted areas.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the geographic boundary or zone" },
        { "name": "Description", "type": "LongTextArea", "description": "Description of the polygon's purpose and the area it covers" },
        { "name": "Status", "type": "Picklist", "description": "Current status such as Active, Inactive, or Archived" },
        { "name": "PolygonType", "type": "Picklist", "description": "Classification such as Emergency Zone, Restricted Area, or Inspection Region" }
      ],
      "relationships": [
        { "target": "Visit", "type": "parent", "description": "Parent of visit records for inspections and emergency operations within this zone" }
      ]
    },
    {
      "name": "Visit",
      "type": "standard",
      "domain": "emergency_and_assets",
      "description": "Represents an on-site visit for emergency inspections, resource delivery, or compliance verification within emergency zones. After emergency permits are approved, inspectors use the mobile Inspection app to verify site compliance with local health and safety ordinances. Visit records track the location, timing, and outcomes of emergency field operations.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated visit reference number" },
        { "name": "Status", "type": "Picklist", "description": "Visit status such as Planned, In Progress, Completed, or Cancelled" },
        { "name": "VisitDate", "type": "DateTime", "description": "Scheduled or actual date and time of the visit" },
        { "name": "AccountId", "type": "Lookup", "description": "Reference to the account or location being visited" },
        { "name": "PolygonId", "type": "Lookup", "description": "Reference to the geographic zone this visit is within" }
      ],
      "relationships": [
        { "target": "Polygon", "type": "lookup", "description": "Links to the emergency zone or geographic boundary" },
        { "target": "Visitor", "type": "parent", "description": "Parent of visitor records tracking personnel at this site" }
      ]
    },
    {
      "name": "Visitor",
      "type": "standard",
      "domain": "emergency_and_assets",
      "description": "Tracks a person visiting a site for emergency operations, inspections, or resource distribution. Visitor records manage access to restricted areas during emergencies, track inspector assignments to specific sites, and coordinate field responder deployments across multiple locations.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name of the visitor or field responder" },
        { "name": "VisitId", "type": "Lookup", "description": "Reference to the visit this person is associated with" },
        { "name": "VisitorType", "type": "Picklist", "description": "Type of visitor such as Inspector, Responder, or Constituent" },
        { "name": "CheckInTime", "type": "DateTime", "description": "Time when the visitor checked in at the site" },
        { "name": "Address", "type": "Text", "description": "Address associated with the visitor" }
      ],
      "relationships": [
        { "target": "Visit", "type": "lookup", "description": "Links to the visit this person is associated with" }
      ]
    }
  ]
},

"employee_experience": {
  "objects": [
    {
      "name": "Employee2",
      "type": "standard",
      "domain": "employee_experience",
      "description": "Represents a government employee record within the Employee Experience framework. Employees are created as Lightning Platform users with access to PSS capabilities including benefits, grants, inspections, licensing, and provider management. HR Service uses Employee2 records for addressing employee queries and service requests, while IT Service tracks incidents and processes service requests.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Full name of the employee" },
        { "name": "EmployeeNumber", "type": "Text", "description": "Unique employee identifier within the agency" },
        { "name": "Status", "type": "Picklist", "description": "Current employment status such as Active, On Leave, or Terminated" },
        { "name": "DepartmentName", "type": "Text", "description": "Name of the department the employee belongs to" },
        { "name": "HireDate", "type": "Date", "description": "Date when the employee was hired" }
      ],
      "relationships": [
        { "target": "Employment", "type": "parent", "description": "Parent of employment records capturing role and schedule details" },
        { "target": "PersonEmployment", "type": "parent", "description": "Parent of person employment records linking to work experience" }
      ]
    },
    {
      "name": "Employment",
      "type": "standard",
      "domain": "employee_experience",
      "description": "Captures the employment details of an employee within the organization, including their employment type, schedule type, status, and start date. HR specialists create employment records through screen flows when onboarding new hires. Employment types include Contractors, Civilian Employee, and Military Employee, with schedule types of Full-time or Part-time.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name or reference for the employment record" },
        { "name": "EmployeeId", "type": "Lookup", "description": "Reference to the Employee2 record" },
        { "name": "EmploymentType", "type": "Picklist", "description": "Type of employment: Contractors, Civilian Employee, or Military Employee" },
        { "name": "ScheduleType", "type": "Picklist", "description": "Work schedule: Full-time or Part-time" },
        { "name": "Status", "type": "Picklist", "description": "Employment status: Active, Resigned, or Terminated" },
        { "name": "StartDate", "type": "Date", "description": "Date when the employment began" }
      ],
      "relationships": [
        { "target": "Employee2", "type": "lookup", "description": "Links to the employee record this employment belongs to" }
      ]
    },
    {
      "name": "PersonEmployment",
      "type": "standard",
      "domain": "employee_experience",
      "description": "Tracks work experience details for a person, linking to the Employee2 record and capturing employment history. Job seekers provide work experience through guided flows on the career site, and this data prefills applications. The Employee Experience permission set group grants access to PersonEmployment along with other PSS capabilities for government employees.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name for the person employment record" },
        { "name": "PersonId", "type": "Lookup", "description": "Reference to the person account" },
        { "name": "EmployerName", "type": "Text", "description": "Name of the employer or organization" },
        { "name": "JobTitle", "type": "Text", "description": "Title of the position held" },
        { "name": "StartDate", "type": "Date", "description": "Start date of this employment" },
        { "name": "EndDate", "type": "Date", "description": "End date of this employment, blank if current" }
      ],
      "relationships": [
        { "target": "Employee2", "type": "lookup", "description": "Links to the employee record if this person is a current employee" }
      ]
    }
  ]
},

"grantmaking": {
  "objects": [
    {
      "name": "FundingOpportunity",
      "type": "standard",
      "domain": "grantmaking",
      "description": "Represents a grant funding opportunity created and published by a grant maker. Funding opportunities include application details, descriptions, instructions, budget templates, and application timelines. Opportunities can be public or restricted to specific applicants using Compliant Data Sharing. The Grantmaking Experience Cloud template displays funding opportunities for grant seekers to browse and apply.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Title of the funding opportunity" },
        { "name": "Description", "type": "RichTextArea", "description": "Detailed description of the funding opportunity and eligibility criteria" },
        { "name": "ApplicationInstructions", "type": "RichTextArea", "description": "Instructions for applicants on how to apply" },
        { "name": "BudgetTemplateId", "type": "Lookup", "description": "Reference to the budget template for applicant budget proposals" },
        { "name": "Status", "type": "Picklist", "description": "Publication status such as Draft, Published, or Closed" },
        { "name": "TotalFundingAmount", "type": "Currency", "description": "Total amount of funding available through this opportunity" }
      ],
      "relationships": [
        { "target": "ApplicationForm", "type": "parent", "description": "Parent of application form records submitted by grant seekers" },
        { "target": "FundingAward", "type": "parent", "description": "Parent of funding awards granted through this opportunity" },
        { "target": "Budget", "type": "lookup", "description": "Links to the budget template for this funding opportunity" }
      ]
    },
    {
      "name": "FundingAward",
      "type": "standard",
      "domain": "grantmaking",
      "description": "Tracks the details of an awarded grant including amount, contract timeframe, and budget allocation. Award requirements define reporting milestones and deliverables with automated recurring creation via Flow Builder. Award amendments handle changes to grant terms. Recipients track upcoming deadlines and report progress through the Experience Cloud portal.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name or reference for the funding award" },
        { "name": "FundingOpportunityId", "type": "Lookup", "description": "Reference to the funding opportunity this award was granted from" },
        { "name": "Amount", "type": "Currency", "description": "Total monetary amount awarded" },
        { "name": "ContractStartDate", "type": "Date", "description": "Start date of the award contract timeframe" },
        { "name": "ContractEndDate", "type": "Date", "description": "End date of the award contract timeframe" },
        { "name": "Status", "type": "Picklist", "description": "Current status of the award such as Active, Completed, or Amended" },
        { "name": "BudgetId", "type": "Lookup", "description": "Reference to the budget tracking how funds are spent" }
      ],
      "relationships": [
        { "target": "FundingOpportunity", "type": "lookup", "description": "Links to the funding opportunity this award was granted from" },
        { "target": "FundingAwardRequirement", "type": "parent", "description": "Parent of requirement records defining milestones and deliverables" },
        { "target": "FundingDisbursement", "type": "parent", "description": "Parent of disbursement records tracking payment execution" },
        { "target": "Budget", "type": "lookup", "description": "Links to the budget tracking expenditures for this award" }
      ]
    },
    {
      "name": "FundingAwardRequirement",
      "type": "standard",
      "domain": "grantmaking",
      "description": "Defines a reporting milestone or deliverable required for a funding award. Requirements can be created individually or in bulk using the Create Recurring Funding Award Requirements flow. Each requirement has a scheduled date and can use Form Framework for structured progress report forms. Requirements track grant recipient accountability and compliance.",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Name or title of the requirement" },
        { "name": "FundingAwardId", "type": "Lookup", "description": "Reference to the parent funding award" },
        { "name": "ScheduledDate", "type": "Date", "description": "Due date for this requirement" },
        { "name": "Status", "type": "Picklist", "description": "Completion status such as Pending, Submitted, Approved, or Overdue" },
        { "name": "RequirementType", "type": "Picklist", "description": "Type of requirement such as Financial Report, Progress Report, or Final Report" }
      ],
      "relationships": [
        { "target": "FundingAward", "type": "lookup", "description": "Links to the funding award this requirement belongs to" }
      ]
    },
    {
      "name": "Budget",
      "type": "standard",
      "domain": "grantmaking",
      "description": "Manages complex grant budgets broken down by category and time period with planned and actual amounts. The Budget Lightning component provides an easy-to-use grid for entering planned amounts and tracking actual expenditures with automatic variance calculation. Budgets support two states: Budget Planning (editable planned amounts) and Actuals Reporting (read-only planned with editable actuals).",
      "fields": [
        { "name": "Name", "type": "Text", "description": "Display name of the budget" },
        { "name": "Amount", "type": "Currency", "description": "Total budget amount" },
        { "name": "StartDate", "type": "Date", "description": "Start date of the budget period" },
        { "name": "EndDate", "type": "Date", "description": "End date of the budget period" },
        { "name": "Status", "type": "Picklist", "description": "Current state such as Planning, Submitted, or Approved" },
        { "name": "FundingOpportunityId", "type": "Lookup", "description": "Reference to the funding opportunity this budget is associated with" }
      ],
      "relationships": [
        { "target": "FundingOpportunity", "type": "lookup", "description": "Links to the funding opportunity this budget template belongs to" },
        { "target": "BudgetAllocation", "type": "parent", "description": "Parent of allocation records tracking actual expenditures" },
        { "target": "FundingAward", "type": "parent", "description": "Parent of funding awards using this budget for expenditure tracking" }
      ]
    },
    {
      "name": "BudgetAllocation",
      "type": "standard",
      "domain": "grantmaking",
      "description": "Tracks actual budget expenditures against planned amounts at the category and period level. Budget allocations can be related to the budget overall or to specific budget category values, providing granular tracking of how grant funds are spent. Allocations are created by grant recipients through the Experience Cloud portal or by administrators in CRM.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the budget allocation" },
        { "name": "BudgetId", "type": "Lookup", "description": "Reference to the parent budget" },
        { "name": "Amount", "type": "Currency", "description": "Actual amount spent for this allocation" },
        { "name": "CategoryName", "type": "Text", "description": "Budget category this allocation belongs to such as Personnel or Supplies" },
        { "name": "PeriodName", "type": "Text", "description": "Budget period this allocation covers such as Q1 or Q2" }
      ],
      "relationships": [
        { "target": "Budget", "type": "lookup", "description": "Links to the parent budget this allocation tracks spending against" }
      ]
    },
    {
      "name": "ApplicationFormEvaluation",
      "type": "standard",
      "domain": "grantmaking",
      "description": "Represents a review or evaluation of a grant application form by an internal or external reviewer. Evaluations are created in batch using the Grantmaking: Assign Application Form Evaluations in Batch flow. Reviewers enter feedback and ratings through Form Framework workspaces. Compliant Data Sharing controls record visibility between applicants, reviewers, and grant managers.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the evaluation" },
        { "name": "ApplicationFormId", "type": "Lookup", "description": "Reference to the application form being evaluated" },
        { "name": "ReviewerId", "type": "Lookup", "description": "Reference to the user or contact performing the review" },
        { "name": "Decision", "type": "Picklist", "description": "Reviewer's decision such as Approve or Reject" },
        { "name": "Rating", "type": "Number", "description": "Numerical rating assigned by the reviewer" },
        { "name": "Comments", "type": "LongTextArea", "description": "Reviewer's written feedback and notes" }
      ],
      "relationships": [
        { "target": "ApplicationForm", "type": "lookup", "description": "Links to the application form being evaluated" },
        { "target": "ApplicationFormEvalPtcp", "type": "parent", "description": "Parent of participant records tracking who is involved in this evaluation" }
      ]
    },
    {
      "name": "PaymentRequest",
      "type": "standard",
      "domain": "grantmaking",
      "description": "Manages a request for disbursement payment from an awarded grant. Payment requests formalize the financial transaction process and can include multiple payment request lines for different budget categories. Automated recurring disbursement creation through Flow Builder streamlines payment scheduling from the funding award page.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the payment request" },
        { "name": "FundingAwardId", "type": "Lookup", "description": "Reference to the funding award this payment request belongs to" },
        { "name": "Amount", "type": "Currency", "description": "Total amount requested for disbursement" },
        { "name": "RequestDate", "type": "Date", "description": "Date when the payment request was submitted" },
        { "name": "Status", "type": "Picklist", "description": "Processing status such as Submitted, Approved, Paid, or Rejected" }
      ],
      "relationships": [
        { "target": "FundingAward", "type": "lookup", "description": "Links to the funding award this payment request is drawn from" },
        { "target": "PaymentRequestLine", "type": "parent", "description": "Parent of line item records breaking down the payment by category" }
      ]
    },
    {
      "name": "PaymentRequestLine",
      "type": "standard",
      "domain": "grantmaking",
      "description": "A line item within a payment request that breaks down the requested disbursement by budget category or expense type. Payment request lines provide granular tracking of how disbursed funds are allocated across different budget categories, enabling detailed financial reporting and reconciliation against the grant budget.",
      "fields": [
        { "name": "Name", "type": "AutoNumber", "description": "Auto-generated identifier for the payment request line" },
        { "name": "PaymentRequestId", "type": "Lookup", "description": "Reference to the parent payment request" },
        { "name": "Amount", "type": "Currency", "description": "Amount for this line item" },
        { "name": "CategoryName", "type": "Text", "description": "Budget category this line item belongs to" },
        { "name": "Description", "type": "Text", "description": "Description of the expense or purpose of this line item" }
      ],
      "relationships": [
        { "target": "PaymentRequest", "type": "lookup", "description": "Links to the parent payment request this line item belongs to" }
      ]
    }
  ]
},

};
