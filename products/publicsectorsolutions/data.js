// ══════════════════════════════════════════════════════════════
//  Public Sector Solutions — Domains & Components
//  18 domains
// ══════════════════════════════════════════════════════════════

export const PRODUCT = {


setup_and_security: {
  packages: ['core'],
  name: "Setup & Security",
  icon: "\u{1F512}",
  color: "#64748b",
  description: "Foundation layer for Public Sector Solutions covering initial Salesforce platform configuration, person account setup, user profiles, permission sets, roles, and security controls. Enables person accounts to represent individual constituents, configures contacts to multiple accounts for complex relationships, and establishes field audit trail for compliance. Includes Salesforce Shield integration for platform encryption, event monitoring, and FedRAMP-authorized Government Cloud compliance.",
  components: [
    {
      id: "person-accounts",
      name: "Person Accounts",
      icon: "\u{1F464}",
      desc: "Combines Account and Contact fields into a single record to represent individual constituents who apply for licenses, permits, programs, benefits, grants, and services. Supports duplicate management and single-step sharing for streamlined constituent data management.",
      tags: ["PersonAccount", "AccountAccountRelation"],
      docs:["Person Accounts in Public Sector Solutions combine Account and Contact fields into a single record to represent individual constituents. This model uses the standard Account object with a Person Account record type, enabling duplicate management and single-step sharing. Constituents who apply for licenses, permits, programs, benefits, grants, and services are represented as person accounts, while businesses use standard business accounts.","Enabling Person Accounts is a permanent change that cannot be reversed. Before enabling, administrators must verify that the Account object has at least one record type and that user profiles with Read permission on Accounts also have Read permission on Contacts. The org-wide default sharing for Contacts must be set to Controlled by Parent, or sharing settings for both Accounts and Contacts must be set to Private.","Person accounts can be associated with multiple businesses using the Account Contact Relation object, which is enabled through the Contacts to Multiple Accounts feature. This is particularly important when constituents apply for multiple licenses or permits across different business accounts, or when using party relationship groups to represent households and family units."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_task_admin_configure_person_acct.htm&type=5&language=en_US",connections: [
        { planet: "licensing_and_permitting", desc: "Person accounts represent individual license applicants" },
        { planet: "benefit_management", desc: "Person accounts are created for benefit applicants" },
        { planet: "social_programs", desc: "Person accounts link to care plans and referrals" }
      ]
    },
    {
      id: "profiles-and-permissions",
      name: "Profiles & Permission Sets",
      icon: "\u{1F511}",
      desc: "Defines user profiles for intake officers, reviewers, inspectors, and compliance officers. Permission set groups bundle access by persona, including sets for licensing officers, caseworkers, benefit management, investigative case management, and talent recruitment.",
      tags: ["PermissionSet", "PermissionSetGroup"],
      docs:["Public Sector Solutions provides a layered security model with user profiles, permission sets, permission set licenses, and permission set groups. Profiles are created by cloning the Standard User profile for each agency role, such as Compliance Officer, Intake Officer, Inspection Manager, and Inspector. Permission sets extend profile access to specific PSS features like Industries Visit, Dynamic Assessment Access, and Evidence Management.","Permission set groups bundle related permission sets by user persona for simplified assignment. PSS includes groups such as Licensing_Permitting_Officer, Benefit_Management_Caseworker, Investigative_Case_Management_Officer, Talent_Recruitment_Management_Specialist, Grantmaking_Manager, Social_Program_Management_Caseworker, Employee_Experience_User, and Public_Sector_Solutions_Admin. Each group provides all necessary permissions for that role's workflows.","Role hierarchies control data access based on job responsibilities and reporting structure. Each role can view, edit, and report on all data owned by or shared with roles below it in the hierarchy. For example, the Inspector role reports to the Inspection Manager, who reports to the Compliance Officer, ensuring appropriate visibility at each organizational level."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_admin_concept_psc_permsets.htm&type=5&language=en_US",connections: [
        { planet: "common_features", desc: "Permission sets control access to common layer components" },
        { planet: "licensing_and_permitting", desc: "Public Sector Access permission set required for licensing objects" },
        { planet: "inspections", desc: "Industries Visit permission set required for inspections" }
      ]
    },
    {
      id: "field-audit-trail",
      name: "Field Audit Trail",
      icon: "\u{1F4DC}",
      desc: "Extends field history retention for over 50 Public Sector Solutions objects including BusinessLicenseApplication, BenefitAssignment, IndividualApplication, CarePlan, and RegulatoryCode. Enables agencies to comply with strict data retention and audit requirements.",
      tags: ["FieldHistoryRetentionPolicy"],
      docs:["Field Audit Trail in Public Sector Solutions extends the retention period for archived field history data across over 50 PSS objects. This enables agencies to comply with strict data retention and audit requirements by tracking and auditing changes to records such as BusinessLicenseApplication, BenefitAssignment, IndividualApplication, CarePlan, and RegulatoryCode.","The feature covers objects spanning all PSS functional areas including licensing (BusinessLicenseApplication, BusRegAuthorizationType), benefits (BenefitAssignment, BenefitDisbursement, BenefitDisbursementAdj), inspections (InspectionAssessmentInd, ViolationEnforcementAction), investigative cases (CaseProceeding, CustodyItemRelation), recruitment (RecruitmentRequisition, EmploymentOffer, JobPosition), and social programs (CarePlan, GoalAssignment, PublicComplaint).","Administrators configure field history retention policies on objects that have Field Audit Trail enabled. This is done by defining the period for retaining and managing historical field data within Salesforce. The policies determine how long changes to specific fields are stored and available for compliance reporting and audit inquiries."],connections: [
        { planet: "licensing_and_permitting", desc: "Tracks changes to license applications and regulatory records" },
        { planet: "benefit_management", desc: "Audits benefit assignment and disbursement changes" },
        { planet: "inspections", desc: "Monitors inspection assessment and violation record changes" }
      ]
    },
    {
      id: "shield-encryption",
      name: "Salesforce Shield",
      icon: "\u{1F6E1}",
      desc: "Safeguards sensitive constituent data with platform encryption at rest, event monitoring for usage tracking, and compliance with government security standards including FedRAMP authorization and EU Hyperforce Operating Zone for data residency.",
      tags: ["ShieldPlatformEncryption", "EventMonitoring"],
      docs:["Salesforce Shield for Public Sector Solutions provides three core security capabilities: Platform Encryption, Event Monitoring, and compliance with government security standards. Platform Encryption encrypts sensitive data at rest, protecting personally identifiable information (PII) while maintaining critical app functionality such as search, workflow, and validation rules.","Event Monitoring provides detailed performance, security, and usage data for all Salesforce apps. Every interaction is tracked and accessible via API, allowing agencies to see who is accessing critical business data, when, and from where. This data can be imported into visualization tools like Analytics, Splunk, or New Relic for comprehensive security monitoring.","Public Sector Solutions compliance is achieved through Government Cloud offerings for US agencies, which have been granted FedRAMP authorization. For European Union agencies, the Salesforce Hyperforce EU Operating Zone provides local storage and processing options along with security measures that reduce regulatory risk and protect consumer data."],connections: [
        { planet: "common_features", desc: "Shield protects data across all common layer components" },
        { planet: "experience_cloud", desc: "Encryption extends to constituent-facing portal data" }
      ]
    }
  ],
  dataFlow: [
    "Enable person accounts and configure record types for individual constituents",
    "Create user profiles by cloning Standard User for each agency role",
    "Assign permission sets and permission set groups based on user persona",
    "Configure field audit trail retention policies on tracked objects",
    "Set organization-wide sharing defaults and role hierarchies",
    "Enable Salesforce Shield for platform encryption and event monitoring"
  ],
  connections: [
    { planet: "common_features", desc: "Security settings control access to common layer components" },
    { planet: "licensing_and_permitting", desc: "Permission sets and person accounts required for licensing" },
    { planet: "inspections", desc: "User roles and permissions control inspector access" },
    { planet: "benefit_management", desc: "Permission set groups define caseworker access to benefits" },
    { planet: "social_programs", desc: "Person accounts and permissions enable social program management" },
    { planet: "experience_cloud", desc: "Shield and sharing settings extend to constituent portals" }
  ,
    { planet: "provider_management", desc: "Permission configuration for provider network access" },
    { planet: "investigative_cases", desc: "Security profiles for investigative caseworkers" },
    { planet: "talent_recruitment", desc: "User profiles for recruiters and HR specialists" },
    { planet: "agentforce", desc: "Agent configuration requires admin permissions" },
    { planet: "einstein_ai", desc: "AI feature enablement and user permissions" },
    { planet: "data_360", desc: "Data governance and access control policies" },
    { planet: "crm_analytics", desc: "Analytics permission sets and dashboard access" },
    { planet: "employee_experience", desc: "Employee user profiles and HR permissions" }
  ]
},

common_features: {
  packages: ['core'],
  name: "Common Features",
  icon: "\u{1F9E9}",
  color: "#8b5cf6",
  description: "The industry common layer providing no-code and low-code components used across all Public Sector Solutions apps. Includes Action Plans for task tracking, Business Rules Engine for policy automation, Decision Explainer for transparency, Document Checklist Items for approval routing, Discovery Framework for conditional data collection, OmniStudio integration for guided forms, and Interaction Summaries for meeting notes. These tools streamline intake, assessment, delivery, and monitoring phases of government service workflows.",
  components: [
    {
      id: "action-plans",
      name: "Action Plans",
      icon: "\u{1F4CB}",
      desc: "Tracks tasks and checklist items for business processes with assignable priorities, deadlines, and owners. Templates define repeatable inspection tasks, assessment tasks, document review steps, and volunteer activities across licensing, benefit, and emergency workflows.",
      tags: ["ActionPlan", "ActionPlanTemplate", "ActionPlanBaseTemplateAsgn", "ActionPlanTemplateAssignment"],
      docs:["Action Plans in Public Sector Solutions create structured task lists for business processes with assignable priorities, deadlines, and owners. Templates define repeatable workflows for inspection visits, assessment execution, document review steps, and volunteer activities. Action Plans are used across licensing, benefit management, investigative case management, grantmaking, and emergency response workflows.","Action Plan templates support multiple target objects including BusinessLicenseApplication, IndividualApplication, CarePlan, PublicComplaint, FundingAwardRequirement, CustodyItem, and Visit. When creating a template, administrators select an Action Plan Type such as Assessment Execution for Dynamic Assessments, then add generic assessment tasks, signature tasks, and standard task items to the template.","The Action Plan List component is added to Lightning record pages to enable users to create action plans from specific records. When a template is published, caseworkers, inspectors, and other staff can create instances of it from target object records. The items tab displays omni assessment tasks, signature tasks, and checklist items that staff members complete during their workflow."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_configure_use_action_plans.htm&type=5&language=en_US",connections: [
        { planet: "inspections", desc: "Action plan templates define inspection visit tasks" },
        { planet: "benefit_management", desc: "Action plans track benefit eligibility determination steps" },
        { planet: "social_programs", desc: "Action plans support care plan task tracking" }
      ]
    },
    {
      id: "business-rules-engine",
      name: "Business Rules Engine",
      icon: "\u{2699}",
      desc: "Automates policy decisions and calculations using expression sets and decision matrices. Determines program eligibility, calculates application fees, computes benefit amounts, and evaluates licensing requirements based on configurable business rules.",
      tags: ["ExpressionSet", "DecisionMatrix"],
      docs:["The Business Rules Engine (BRE) in Public Sector Solutions automates policy decisions and calculations using expression sets and decision matrices. Expression sets define the logic for evaluating conditions, while decision matrices store lookup data such as income thresholds, fee schedules, and eligibility criteria. BRE is used to determine program eligibility, calculate application fees, compute benefit amounts, and evaluate licensing requirements.","For benefit management, BRE uses expression set templates like PSSExpCloud_PrescreeningForBenefits to evaluate prescreening eligibility, PSSExpCloud_CalculateBenefitAmount to compute benefit amounts based on household size and income, and PSSExpCloud_MemberBenefitEligibility to check individual member eligibility based on citizenship status. Decision matrices define thresholds and point systems that feed into these calculations.","BRE also powers complaint resolution priority calculation through the Calculate Public Complaint Score expression set template. When a complaint is created or updated, a record-triggered flow calls a subflow that determines priority and completeness levels, then the expression set calculates a weighted resolution priority on a 100-point scale using configurable decision matrix values."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_set_up_business_rules_engine.htm&type=5&language=en_US",connections: [
        { planet: "benefit_management", desc: "Calculates benefit eligibility and amounts" },
        { planet: "licensing_and_permitting", desc: "Automatically calculates application fees" },
        { planet: "social_programs", desc: "Evaluates program eligibility criteria" }
      ]
    },
    {
      id: "decision-explainer",
      name: "Decision Explainer",
      icon: "\u{1F4A1}",
      desc: "Provides transparency into Business Rules Engine calculation results through explainability message templates. Helps agencies ensure compliance, detect fraud, and demonstrate equitable distribution of benefits by showing the reasoning behind eligibility determinations and fee calculations.",
      tags: ["ExplainabilityActionDefinition", "ExplainabilityActionVersion"],
      docs:["Decision Explainer provides transparency into Business Rules Engine calculations by generating human-readable explanations of eligibility determinations and fee calculations. It uses explainability message templates, explainability action definitions, and explainability action versions to structure how calculation results are communicated to constituents and caseworkers.","For benefit management, Decision Explainer is configured with an explainability action definition labeled BenefitApplicationLogs that references a business process type and application subtype definition. The Action Log Schema Type is set to Expression Set, linking it to the benefit amount calculation expression set. Explainability action versions are then created and activated to enable the feature.","Decision Explainer can display reasoning on Experience Cloud sites, allowing constituents to understand why they were approved or denied for benefits, how their benefit amount was calculated, and what criteria were evaluated. Administrators modify expression set version configurations to show rule explanations to external users through the portal."],connections: [
        { planet: "benefit_management", desc: "Explains benefit eligibility and amount decisions to constituents" },
        { planet: "licensing_and_permitting", desc: "Shows reasoning behind fee calculations and license decisions" },
        { planet: "experience_cloud", desc: "Decision explanations displayed on constituent portal" }
      ]
    },
    {
      id: "document-management",
      name: "Document Management",
      icon: "\u{1F4C4}",
      desc: "Routes constituent-submitted documents through approval workflows using document checklist items and types. Includes Intelligent Document Automation for OCR extraction from handwritten forms and Intelligent Form Reader for accurate digital record creation from paper applications.",
      tags: ["DocumentChecklistItem", "DocumentType"],
      docs:["Document Management in Public Sector Solutions uses Document Checklist Items and Document Types to route constituent-submitted documents through approval workflows. Document checklist items track required supporting materials for license applications, benefit applications, investigative cases, and grant submissions, ensuring all necessary documentation is collected before processing.","The feature includes Intelligent Document Automation for OCR extraction from handwritten forms and Intelligent Form Reader for creating accurate digital records from paper applications. These capabilities help agencies digitize paper-based processes and reduce manual data entry when constituents submit physical documents.","Document Tracking and Approvals integrates with Action Plans to include document checklist items as tasks within workflow templates. When an action plan template is created for application review or grant management, document checklist items can be added to ensure that applicants submit all required supporting documents before the review process proceeds."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_set_up_document_tracking_approvals.htm&type=5&language=en_US",connections: [
        { planet: "licensing_and_permitting", desc: "Routes supporting documents for license applications" },
        { planet: "benefit_management", desc: "Manages benefit application supporting documentation" },
        { planet: "investigative_cases", desc: "Tracks evidence documents for investigative cases" }
      ]
    },
    {
      id: "dynamic-assessments",
      name: "Dynamic Assessments",
      icon: "\u{1F4DD}",
      desc: "Builds responsive evaluation forms using Discovery Framework and OmniStudio that support conditional logic, file attachments, compliance status tracking, and digital signatures. Used for inspections, investigations, program eligibility evaluations, and grantmaking assessments.",
      tags: ["Assessment", "AssessmentQuestion", "OmniAssessmentTask", "AssessmentIndicatorDefinition"],
      docs:["Dynamic Assessments in Public Sector Solutions use the Discovery Framework and OmniStudio to build responsive evaluation forms with conditional logic, file attachments, compliance status tracking, and digital signatures. Assessment questions are organized into categories like Fire Safety Inspection, Roof Inspection, and Public Safety Complaint, and are added to Omni Assessment Tasks that structure the evaluation workflow.","The assessment workflow involves creating assessment question categories, building individual questions with supported data types (Checkbox, Date, DateTime, Decimal, Integer, Multi-select, Radio, Select, Text, Text Area, Time), relating questions to regulatory codes and violation types, creating omni assessment tasks, building Omniscripts with conditional logic, and publishing action plan templates. The Compliance Status field on Assessment Question Response can auto-create regulatory code violation records when set to Fail.","Dynamic Assessments support migration between orgs using Metadata APIs. The ActionPlanTemplate, AssessmentQuestion, and OmniScript metadata types enable retrieval and deployment of assessment configurations. Administrators must enable Omnistudio Metadata API support and Discovery Framework import/export before migration, and the manifest file must include active versions of all assessment questions from associated omni assessment tasks."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_setup_use_dynamic_assessments.htm&type=5&language=en_US",connections: [
        { planet: "inspections", desc: "Powers complex regulatory compliance evaluations during visits" },
        { planet: "benefit_management", desc: "Captures applicant information for benefit eligibility assessment" },
        { planet: "social_programs", desc: "Conducts complaint investigations and client assessments" }
      ]
    },
    {
      id: "interaction-summaries",
      name: "Interaction Summaries",
      icon: "\u{1F4AC}",
      desc: "Enables caseworkers and case managers to capture detailed meeting notes with rich text, attendees, action items, interest tags, and file attachments. Supports publishing to lock summaries as evidence and compliant data sharing for privacy control.",
      tags: ["InteractionSummary", "Interaction"],
      docs:["Interaction Summaries in Public Sector Solutions enable caseworkers and case managers to capture detailed meeting notes with rich text formatting, attendees, action items, interest tags, and file attachments. The enhanced interaction note interface provides a seamless way to create notes, add interaction details, and share them with other users for collaborative case management.","Summaries support a publishing workflow that locks them as evidence, preventing further modifications to maintain data integrity for compliance purposes. Compliant data sharing controls enable privacy management, ensuring that sensitive interaction details are only visible to authorized personnel within the agency.","Interaction Summaries are used across multiple PSS functional areas including social program management for documenting caseworker conversations with constituents on care plans, benefit management for recording review meetings and phone conversations, and investigative case management for capturing witness interviews and investigation notes."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_interaction_summaries_overview.htm&type=5&language=en_US",connections: [
        { planet: "social_programs", desc: "Records caseworker interactions with constituents on care plans" },
        { planet: "benefit_management", desc: "Documents benefit review meetings and phone conversations" },
        { planet: "investigative_cases", desc: "Captures witness interviews and investigation notes" }
      ]
    },
    {
      id: "omnistudio-integration",
      name: "OmniStudio Integration",
      icon: "\u{26A1}",
      desc: "Provides Omniscripts for guided application flows, Integration Procedures for data mapping, FlexCards for contextual displays, and Data Mappers for populating records from forms. Powers constituent-facing application forms on Experience Cloud sites across all PSS apps.",
      tags: ["OmniProcess", "OmniProcessElement"],
      docs:["OmniStudio Integration in Public Sector Solutions provides Omniscripts for guided application flows, Integration Procedures for data mapping, FlexCards for contextual record page displays, and Data Mappers for populating Salesforce records from form submissions. These components power constituent-facing application forms on Experience Cloud sites across all PSS apps.","Key Omniscripts include BenefitAssistance/AssessEligibility for benefit prescreening, CaseProceeding/ComplaintIntake for investigative case complaint filing, and application forms for licensing and permitting. Each Omniscript uses type and subtype combinations as unique identifiers, supports reusable embedded components, and can include conditional logic and signature elements.","OmniStudio requires enabling Standard Omnistudio Runtime by disabling the Managed Package Runtime setting. The OmniStudio Admin permission set is assigned to administrators who build and configure components, while the OmniStudio User permission set is assigned to end users who interact with deployed flows. FlexCards are used extensively in the Casework Overview console for investigative case management."],connections: [
        { planet: "licensing_and_permitting", desc: "Omniscripts power license and permit application flows" },
        { planet: "benefit_management", desc: "OmniStudio drives benefit application intake and review flows" },
        { planet: "experience_cloud", desc: "Omniscript components deploy to Experience Cloud sites" }
      ]
    }
  ],
  dataFlow: [
    "Configure Action Plan templates with tasks for each business process type",
    "Build expression sets and decision matrices in Business Rules Engine for policy automation",
    "Set up Discovery Framework questions and omni assessment tasks for evaluations",
    "Deploy Omniscript guided flows for application intake on Experience Cloud sites",
    "Route submitted documents through checklist approval workflows",
    "Enable Interaction Summaries and Timeline for caseworker constituent engagement"
  ],
  connections: [
    { planet: "setup_and_security", desc: "Permission sets control access to common layer components" },
    { planet: "licensing_and_permitting", desc: "Common tools automate license application review and approval" },
    { planet: "inspections", desc: "Action plans and assessments structure inspection visits" },
    { planet: "benefit_management", desc: "BRE and assessments automate benefit eligibility determination" },
    { planet: "social_programs", desc: "Interaction summaries and assessments support social casework" },
    { planet: "experience_cloud", desc: "OmniStudio components power constituent portal experiences" },
    { planet: "agentforce", desc: "Agentforce AI agents leverage common features for automation" }
  ,
    { planet: "social_insurance", desc: "OmniStudio flows power social insurance claim intake" },
    { planet: "investigative_cases", desc: "Action Plans and Document Checklists for investigations" },
    { planet: "talent_recruitment", desc: "Dynamic Assessments used in applicant evaluation" },
    { planet: "emergency_and_assets", desc: "Action Plans for emergency response coordination" },
    { planet: "grantmaking", desc: "Business Rules Engine and Document Checklists for grants" }
  ]
},

licensing_and_permitting: {
  packages: ['core'],
  name: "Licensing & Permitting",
  icon: "\u{1F4DC}",
  color: "#3b82f6",
  description: "Manages the full lifecycle of business and individual license and permit applications from intake through issuance. Defines regulatory authorities, authorization types, business types, and their mapping through junction objects. Supports dynamic application forms on Experience Cloud, automated approval processes with queues and paths, fee calculation through Business Rules Engine, training requirements for professional licenses, and Experience Cloud portals for constituent self-service.",
  components: [
    {
      id: "regulatory-authorities",
      name: "Regulatory Authorities",
      icon: "\u{1F3DB}",
      desc: "Represents government departments or agencies responsible for licensing, regulating, and providing oversight to specific industries. Examples include Department of Motor Vehicles, Board of Barbering & Cosmetology, and Department of Building Inspection.",
      tags: ["RegulatoryAuthority", "RegulatoryAuthorizationType", "BusinessType", "BusRegAuthorizationType"],
      docs:["Regulatory Authorities in Public Sector Solutions represent government departments or agencies responsible for licensing, regulating, and providing oversight to specific industries. Examples include Department of Motor Vehicles, Board of Barbering and Cosmetology, and Department of Building Inspection. Each authority is configured with regulatory authorization types that define the licenses and permits it issues.","The data model uses junction objects to establish relationships between authorities, authorization types, and business types. The BusRegAuthorizationType junction object connects Business Types to Regulatory Authorization Types, mapping which licenses are required for different business categories. BusRegAuthTypeDependency defines dependency chains between permits, ensuring parent licenses are issued before dependent ones.","Regulatory authorities also define the regulatory codes that inspectors evaluate during compliance visits. Each code represents a specific compliance standard, and Assessment Indicator Definitions linked to codes provide the measurable criteria that inspectors check during inspections."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_concept_admin_licensingandpermitting.htm&type=5&language=en_US",connections: [
        { planet: "inspections", desc: "Regulatory authorities define inspection compliance standards" },
        { planet: "common_features", desc: "Business Rules Engine automates regulatory determinations" }
      ]
    },
    {
      id: "license-applications",
      name: "License Applications",
      icon: "\u{1F4E8}",
      desc: "Stores applicant information for business license and individual authorization requests. Supports record types for distinct application statuses, approval processes, and categories. Omniscript templates create applications when constituents submit forms on Experience Cloud sites.",
      tags: ["BusinessLicenseApplication", "IndividualApplication", "PreliminaryApplicationRef"],
      docs:["License Applications in Public Sector Solutions store applicant information using the BusinessLicenseApplication object for business licenses and the IndividualApplication object for individual authorizations. Applications support record types for distinct statuses and categories, enabling agencies to track different types of licenses such as Fire Permits, Building Permits, and Reopening Permits through the same workflow.","Omniscript templates create application records when constituents submit forms on Experience Cloud sites. The application intake process captures constituent information through guided flows, and applications enter approval queues where reviewers process them using path-guided workflows. Document checklists track required supporting materials, and Business Rules Engine calculates associated fees.","Application record types are also used for usage-based pricing tracking. Administrators configure application record types by mapping usage types (such as Public Sector Application Forms or Benefit Assistance) to specific record type names on the BusinessLicenseApplication or IndividualApplication objects, helping agencies monitor processing volumes and associated costs."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_create_record_type_for_each_license.htm&type=5&language=en_US",connections: [
        { planet: "common_features", desc: "Document checklists and action plans manage application review" },
        { planet: "inspections", desc: "Applications trigger inspection visits for compliance verification" },
        { planet: "experience_cloud", desc: "Constituents submit applications through Experience Cloud portal" }
      ]
    },
    {
      id: "authorization-types",
      name: "Authorization Types & Dependencies",
      icon: "\u{1F517}",
      desc: "Maps business types to required regulatory authorization types through junction objects. Defines dependency chains between permits so parent licenses are issued before dependent ones, such as requiring a business license before a fire permit.",
      tags: ["BusRegAuthorizationType", "BusRegAuthTypeDependency", "RegAuthorizationTypeProduct"],
      docs:["Authorization Types and Dependencies in Public Sector Solutions map business types to required regulatory authorization types through junction objects. The BusRegAuthorizationType junction object creates many-to-many relationships between Business Types and Regulatory Authorization Types, defining which licenses or permits are required for different business categories such as salon licenses or food service permits.","The BusRegAuthTypeDependency object establishes dependency chains between permits, ensuring that parent licenses are issued before dependent ones. For example, a business license may be required before a fire permit can be issued. This hierarchical structure enforces proper sequencing in the licensing workflow and prevents dependent permits from being approved prematurely.","The RegAuthorizationTypeProduct junction object links authorization types to products, enabling the Permits component on Experience Cloud sites to display required authorizations for each business type. Constituents can see all the licenses they need to apply for based on their business category."],connections: [
        { planet: "inspections", desc: "Authorization types determine required inspection types" },
        { planet: "experience_cloud", desc: "Permits component shows required authorizations on portal" }
      ]
    },
    {
      id: "regulatory-fees",
      name: "Regulatory Transaction Fees",
      icon: "\u{1F4B0}",
      desc: "Manages fees associated with license applications, inspections, and regulatory code violations. Fee records contain line items with individual amounts, statuses, and due dates. Business Rules Engine can automatically calculate processing fees based on authorization type and establishment details.",
      tags: ["RegulatoryTrxnFee", "RegulatoryTrxnFeeItem"],
      docs:["Regulatory Transaction Fees in Public Sector Solutions manage the financial aspects of licensing, inspections, and enforcement actions. The RegulatoryTrxnFee object stores fee records associated with applications, while RegulatoryTrxnFeeItem contains individual line items with amounts, statuses, and due dates for each fee component.","Business Rules Engine can automatically calculate processing fees based on authorization type and establishment details. Expression sets and decision matrices define the fee calculation logic, allowing agencies to set variable fee schedules based on business type, application category, or inspection results without manual calculation.","Fees are generated from multiple sources: application processing fees during license submission, violation fees from inspection enforcement actions, and regulatory compliance fees. Integration Procedures automate fee generation when enforcement actions are created, linking the fee records back to the originating violations and license applications."],connections: [
        { planet: "inspections", desc: "Violations and enforcement actions generate regulatory fees" },
        { planet: "common_features", desc: "Business Rules Engine calculates fee amounts automatically" },
        { planet: "experience_cloud", desc: "Fee payment history displayed on constituent portal" }
      ]
    },
    {
      id: "approval-process",
      name: "Approval Process",
      icon: "\u{2705}",
      desc: "Automates review workflows with paths that visualize application status progression, queues that distribute applications to reviewers, and multi-step approval processes with entry criteria, approval steps, and final actions for approved or rejected applications.",
      tags: ["ApprovalProcess"],
      docs:["The Approval Process in Public Sector Solutions automates review workflows for license and permit applications. Paths visualize application status progression through configurable stages, while queues distribute applications to available reviewers. Multi-step approval processes include entry criteria, approval steps, and final actions that execute when applications are approved or rejected.","Approval processes are configured with record-based entry criteria that determine which applications enter the workflow. Each step can specify approvers by role, queue, or specific user, and can include approval and rejection actions such as field updates, email alerts, and outbound messages. Path components on record pages give reviewers visual context about where each application stands in the review cycle.","For investigative cases, approval processes extend to case proceeding deferral requests. Constituents submit deferral requests through an Omniscript form on the Benefit Assistance portal, and caseworkers use a configured approval process on the Case object to review and approve or deny the extension requests."],connections: [
        { planet: "common_features", desc: "Action plans and record alerts support approval workflow steps" },
        { planet: "setup_and_security", desc: "User roles and queues control reviewer assignment" }
      ]
    },
    {
      id: "license-issuance",
      name: "License Issuance",
      icon: "\u{1F4C3}",
      desc: "Completes the licensing lifecycle by issuing business licenses after all reviews and inspections pass. Supports asset and location associations through AuthApplicationAsset and AuthApplicationPlace junction objects, training requirement verification, and QR code email templates for issued licenses.",
      tags: ["BusinessLicense", "AuthApplicationAsset", "AuthApplicationPlace"],
      docs:["License Issuance in Public Sector Solutions completes the licensing lifecycle by creating BusinessLicense records after all reviews and inspections pass. The issuance process verifies that training requirements have been met, inspection results are satisfactory, and all document checklists are complete before the license is granted to the applicant.","Junction objects AuthApplicationAsset and AuthApplicationPlace associate issued licenses with specific assets and locations. This enables agencies to track which physical assets or business locations are covered by each license, supporting location-based compliance verification and asset-based licensing scenarios such as parking lot permits or equipment certifications.","Issued licenses can include QR code email templates that are sent to applicants upon approval. The license record is associated with the person account that holds it, appearing in related lists on the account page. This provides a complete view of all licenses held by a constituent in one location."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_license_permit_site_prerequisites.htm&language=en_US&type=5",connections: [
        { planet: "inspections", desc: "License issuance requires passing inspection results" },
        { planet: "setup_and_security", desc: "Person accounts hold issued licenses in related lists" }
      ]
    }
  ],
  dataFlow: [
    "Configure regulatory authorities, authorization types, and business type mappings",
    "Constituent submits application through OmniScript guided flow on Experience Cloud site",
    "Application enters approval queue and reviewers process using path-guided workflow",
    "Business Rules Engine calculates fees and document checklists track required documents",
    "Inspector conducts compliance visit and records results on the application",
    "Approved application results in license issuance to the constituent"
  ],
  connections: [
    { planet: "setup_and_security", desc: "Person accounts and permissions required for licensing workflows" },
    { planet: "common_features", desc: "BRE, action plans, and documents automate application processing" },
    { planet: "inspections", desc: "License applications require compliance inspections before issuance" },
    { planet: "experience_cloud", desc: "Constituent portal enables self-service license applications" },
    { planet: "crm_analytics", desc: "Analytics provides insights into licensing productivity and trends" },
    { planet: "agentforce", desc: "AI agents assist with application processing and constituent questions" }
  ,
    { planet: "einstein_ai", desc: "AI summaries for license application review" },
    { planet: "emergency_and_assets", desc: "Emergency permits and temporary authorizations" }
  ]
},

inspections: {
  packages: ['core'],
  name: "Inspections",
  icon: "\u{1F50D}",
  color: "#ef4444",
  description: "Manages onsite and virtual compliance inspections from scheduling through violation enforcement. Defines regulatory codes with assessment indicator definitions that inspectors evaluate during visits. Supports both fixed-checklist inspections and complex Dynamic Assessments with conditional logic. Records violations linked to regulatory codes, creates enforcement actions, and generates regulatory transaction fees. Includes the Inspection Management desktop and mobile app with calendar integration for visit scheduling.",
  components: [
    {
      id: "inspection-types-setup",
      name: "Inspection Types & Codes",
      icon: "\u{1F4CB}",
      desc: "Defines regulatory codes as compliance standards established by authorities, assessment indicator definitions as specific evaluation measures, and inspection types that represent categories of inspections required for different licenses and permits.",
      tags: ["InspectionType", "RegulatoryCode", "RegulatoryCodeAssessmentInd", "AssessmentIndicatorDefinition"],
      docs:["Inspection Types and Codes in Public Sector Solutions define the regulatory compliance framework that inspectors evaluate during visits. Regulatory codes represent compliance standards established by authorities, such as fire codes, building codes, and health regulations. Each code includes details like subject, description, type, effective date, and the issuing regulatory authority.","Assessment Indicator Definitions are specific evaluation measures linked to regulatory codes through the RegulatoryCodeAssessmentInd junction object. These definitions specify exactly what inspectors must check during a visit, such as whether fire extinguishers are present or whether a cosmetology license is properly displayed. Each indicator can be associated with violation types through the ViolationTypeAssessmentInd junction object.","Inspection Types represent categories of inspections required for different licenses and permits. Administrators create types for scenarios like Fire Safety Inspection, Electrical Inspection, and Solar Permit inspection. These types organize the regulatory codes and assessment indicators that apply to each category of compliance evaluation."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_admin_concept_configureinspections.htm&type=5&language=en_US",connections: [
        { planet: "licensing_and_permitting", desc: "Regulatory codes define compliance standards for license types" },
        { planet: "common_features", desc: "Assessment indicator definitions link to Dynamic Assessment questions" }
      ]
    },
    {
      id: "visit-management",
      name: "Visit Management",
      icon: "\u{1F4C5}",
      desc: "Schedules and manages onsite inspection visits with calendar integration. Compliance officers assign visits to inspectors, who conduct assessments using action plan templates with checklists, assessment tasks, and optional signature capture on mobile devices.",
      tags: ["Visit", "Visitor", "InspectionAssessmentInd"],
      docs:["Visit Management in Public Sector Solutions schedules and tracks onsite inspection visits using Salesforce Calendar integration. Compliance officers assign visits to inspectors by checking their availability through user list views on the Calendar. The Industries Visit permission set is required for all users who work with visit records.","During visits, inspectors conduct assessments using action plan templates that contain checklists, omni assessment tasks, and optional signature capture on mobile devices. The Visit object records details about the inspection including date, assigned inspector, location, and associated application. Visits can be created directly from license application record pages using a configured action button.","The Inspection Management app provides a mobile-friendly interface for inspectors conducting field visits. Calendar visits are enabled through Visit Calendar Settings in Setup, allowing compliance officers and inspectors to see scheduled visits as calendar events and manage their inspection schedules efficiently."],connections: [
        { planet: "licensing_and_permitting", desc: "Visits created from license application record pages" },
        { planet: "common_features", desc: "Action plan templates define visit tasks and assessment steps" }
      ]
    },
    {
      id: "violation-recording",
      name: "Violation Recording",
      icon: "\u{26A0}",
      desc: "Records regulatory code violations discovered during inspections with severity levels and compliance status. Violations auto-create when Dynamic Assessment questions receive a Fail compliance status. Links violations to the specific regulatory codes and assessment indicators that were evaluated.",
      tags: ["RegulatoryCodeViolation", "ViolationType", "ViolationTypeAssessmentInd"],
      docs:["Violation Recording in Public Sector Solutions captures regulatory code violations discovered during inspections with severity levels and compliance status tracking. The RegulatoryCodeViolation object stores violation details including the specific regulatory code that was violated, the assessment indicator that was evaluated, and the severity classification.","Violations are automatically created when Dynamic Assessment questions receive a Fail compliance status. The Assessment Question Response object has a lookup relationship with regulatory code violations, and when the Compliance Status picklist value Fail is configured as a violation trigger, Public Sector Solutions automatically creates the corresponding violation record without manual intervention.","Each violation is linked to the specific regulatory codes and assessment indicators that were evaluated during the inspection. The ViolationType object categorizes violations by health and safety, structural, environmental, or other classifications, while severity levels such as Major Violation and Minor Violation help agencies prioritize enforcement actions."],connections: [
        { planet: "licensing_and_permitting", desc: "Violations affect license application approval decisions" },
        { planet: "common_features", desc: "Dynamic Assessments auto-create violations on compliance failure" }
      ]
    },
    {
      id: "enforcement-actions",
      name: "Enforcement Actions",
      icon: "\u{2696}",
      desc: "Tracks corrective and punitive actions resulting from inspection violations including fines, suspension, revocation, and remediation requirements. Links enforcement actions to regulatory transaction fees for automated fee generation through Integration Procedures.",
      tags: ["ViolationEnforcementAction"],
      docs:["Enforcement Actions in Public Sector Solutions track corrective and punitive measures resulting from inspection violations. The ViolationEnforcementAction object records actions such as fines, license suspension, license revocation, and remediation requirements. Each enforcement action is linked to the originating regulatory code violation for complete audit trail tracking.","Integration Procedures automate the generation of regulatory transaction fees when enforcement actions are created. This ensures that financial penalties associated with violations are properly recorded and linked to the enforcement action, the violation, and the original inspection visit, creating a complete chain of accountability.","Severe violations discovered during inspections may escalate to investigative cases when the circumstances warrant further investigation. The enforcement action record provides the bridge between the inspection workflow and the investigative case management process, carrying forward all relevant violation and regulatory code details."],connections: [
        { planet: "licensing_and_permitting", desc: "Enforcement actions generate regulatory transaction fees" },
        { planet: "investigative_cases", desc: "Severe violations may escalate to investigative cases" }
      ]
    },
    {
      id: "inspection-history",
      name: "Inspection History & Portal",
      icon: "\u{1F4CA}",
      desc: "Provides the Inspection History component on Experience Cloud sites showing constituents inspection details, inspector observations, violations, and enforcement actions. Supports the Hierarchical View component for unified cascading views of visits, violations, and fees on application pages.",
      tags: ["Visit", "RegulatoryCodeViolation", "ViolationEnforcementAction"],
      docs:["The Inspection History component displays on Experience Cloud sites to show constituents their inspection details, inspector observations, violations, and enforcement actions. This transparency allows businesses and individuals to review their compliance record and understand any outstanding issues related to their licenses and permits.","The Hierarchical View component provides a unified cascading view of visits, violations, and fees on application pages. This Lightning web component gives inspectors, caseworkers, and reviewers quick access to related records without navigating through successive tabs and related lists, streamlining the review process for complex inspection chains.","Inspection history data feeds into CRM Analytics dashboards that track compliance trends, violation patterns, and enforcement action statistics across the agency. The Compliance Insights dashboard monitors inspection impact on violations, while the Account Insights dashboard shows the status of applications, licenses, complaints, and violations per account."],connections: [
        { planet: "experience_cloud", desc: "Inspection history displayed on constituent portal" },
        { planet: "licensing_and_permitting", desc: "Hierarchical view shows inspection chain on license applications" }
      ]
    }
  ],
  dataFlow: [
    "Create regulatory codes and assessment indicator definitions for compliance standards",
    "Build action plan templates with assessment tasks for each inspection type",
    "Schedule visit and assign inspector through Salesforce Calendar integration",
    "Inspector evaluates assessment indicators and records compliance status onsite",
    "Failed indicators automatically create regulatory code violation records",
    "Enforcement actions and regulatory transaction fees generated for violations"
  ],
  connections: [
    { planet: "licensing_and_permitting", desc: "Inspections verify compliance for license and permit applications" },
    { planet: "common_features", desc: "Action plans and Dynamic Assessments structure inspection workflows" },
    { planet: "setup_and_security", desc: "Industries Visit permission set required for inspection users" },
    { planet: "experience_cloud", desc: "Inspection history component displays on constituent portal" },
    { planet: "social_programs", desc: "Complaints trigger inspection visits to investigate welfare concerns" },
    { planet: "agentforce", desc: "AI agent automates post-visit summaries and enforcement identification" },
    { planet: "crm_analytics", desc: "Analytics provides insights into inspection trends and compliance rates" }
  ,
    { planet: "einstein_ai", desc: "AI-generated inspection summaries and reports" },
    { planet: "emergency_and_assets", desc: "Emergency inspections during crisis events" }
  ]
},

social_programs: {
  packages: ['core'],
  name: "Social Programs",
  icon: "\u{1F91D}",
  color: "#f59e0b",
  description: "Manages nonfinancial social services for individuals and families facing hardship. Defines programs with related benefits for specific social care areas like job readiness, child welfare, housing services, and refugee settlement. Supports complaint intake and incident tracking, case referral processing, goal-based care planning, and constituent enrollment in programs and benefits. Caseworkers create personalized care plans from templates that include goals, benefits, and action items to help constituents achieve positive outcomes.",
  components: [
    {
      id: "programs-and-enrollment",
      name: "Programs & Enrollment",
      icon: "\u{1F4D6}",
      desc: "Defines high-level social programs with summaries and related benefits representing specific services like counseling, workshops, and training courses. Enables constituent enrollment in programs and assignment of benefits to support well-being goals.",
      tags: ["PublicProgram", "ProgramEnrollment", "Benefit", "BenefitType"],
      docs:["Programs and Enrollment in Public Sector Solutions define high-level social programs that agencies provide to support the well-being of constituents. Programs are created using the PublicProgram object with summaries describing their purpose, such as job readiness, youth development, refugee settlement, housing services, or child welfare. Each program has related benefits representing specific services like counseling sessions, workshops, and training courses.","Benefits are created with associated BenefitType, specifying the process type (Public Sector), type (Service), and category. Benefit schedules define session frequencies and quantities, such as eight 50-minute family counseling sessions or one 8-hour workshop. The ProgramEnrollment object tracks constituent participation in programs, linking person accounts to the programs and benefits they are enrolled in.","The enrollment workflow involves caseworkers using care plans to enroll constituents in programs and assign them benefits. Programs and benefits work together with goal definitions to create measurable outcomes for participants, ensuring that services are aligned with the agency's mission to help constituents achieve positive results."],connections: [
        { planet: "benefit_management", desc: "Financial benefit programs complement social program services" },
        { planet: "common_features", desc: "Action plans track enrollment and program delivery tasks" }
      ]
    },
    {
      id: "goals-and-outcomes",
      name: "Goals & Outcomes",
      icon: "\u{1F3AF}",
      desc: "Creates hierarchical goal definitions with top goals and intermediate goals for achieving positive constituent outcomes. Goal assignments link specific goals to care plan participants with tracking for progress and completion status.",
      tags: ["GoalDefinition", "GoalAssignment"],
      docs:["Goals and Outcomes in Public Sector Solutions create hierarchical goal definitions with top goals and intermediate goals for achieving positive constituent outcomes. The GoalDefinition object supports types such as Top Goal and Intermediate Goal, enabling agencies to define layered objectives like reuniting a family within six months as a top goal, with emotional safety and financial stability as intermediate goals.","Goal assignments link specific goals to care plan participants using the GoalAssignment object, which tracks progress and completion status for each assigned goal. Caseworkers monitor goal achievement through interaction summaries and timeline views, updating status as participants progress through their care plans.","Goals are defined at the program level and connected to benefits through the goal definition relationship on the Benefit object. When care plan templates are created, template goals are added alongside template benefits, providing a standardized approach to outcome measurement that caseworkers customize for each individual situation."],connections: [
        { planet: "common_features", desc: "Interaction summaries document goal progress conversations" },
        { planet: "einstein_ai", desc: "AI insights help assess program effectiveness and outcomes" }
      ]
    },
    {
      id: "care-plans",
      name: "Care Plans",
      icon: "\u{1F4C2}",
      desc: "Delivers personalized support by enrolling constituents in programs and assigning benefits through structured care plans. Templates standardize approaches for common scenarios, with template benefits and template goals that caseworkers customize for each individual situation.",
      tags: ["CarePlan", "CarePlanTemplate", "CarePlanTemplateBenefit", "CarePlanTemplateGoal"],
      docs:["Care Plans in Public Sector Solutions deliver personalized support by enrolling constituents in programs and assigning benefits through structured plans. The CarePlan object stores the individualized plan, while CarePlanTemplate objects provide standardized approaches for common scenarios such as child welfare, housing assistance, or refugee settlement. Template benefits and template goals are added to templates and then customized for each constituent.","Caseworkers create care plans based on intake officer screening results and dynamic assessment findings. The care plan includes comprehensive long-term or intermediary goals and concrete action items to help clients achieve positive outcomes. Caseworkers can edit care plans to add or remove benefits and goals as appropriate for each family's unique situation.","Care plans integrate with provider management for referrals to external service providers and with benefit management for assigning monetary benefits to eligible participants. The Assessment List component and Action Plan List component on care plan record pages support Dynamic Assessments and structured task tracking within the context of each individual's plan."],connections: [
        { planet: "common_features", desc: "Dynamic Assessments inform care plan creation decisions" },
        { planet: "provider_management", desc: "Care plans include referrals to service providers" },
        { planet: "benefit_management", desc: "Care plans assign monetary benefits to eligible participants" }
      ]
    },
    {
      id: "referral-intake",
      name: "Case Referral Intake",
      icon: "\u{1F4E9}",
      desc: "Screens referral requests from other agencies and organizations, creates cases, and enables case managers to prioritize and assign cases to caseworkers for assessment. Supports screening for job training, housing, nutrition, and elder care programs.",
      tags: ["Referral", "Case"],
      docs:["Case Referral Intake in Public Sector Solutions screens referral requests from other agencies and organizations, creates cases, and enables case managers to prioritize and assign them to caseworkers for assessment. The feature supports screening for job training, housing, nutrition, and elder care programs, handling the initial triage of constituents who need social support services.","Intake agents use OmniScript guided flows to quickly capture referral details, including the referring agency, constituent information, and the nature of the need. The Referral object stores the referral record and links to the resulting Case object. Case managers then prioritize cases and hand them off to caseworkers for further assessment and care plan creation.","Case Referral Intake is enabled through the Program and Case Management settings in Setup by turning on the Create and manage referrals setting. The Case Referral permission set must be assigned to users who work with referrals, and the feature integrates with the benefit management workflow for constituents who need financial assistance alongside social program services."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_admin_constituent_relationships.htm&type=5&language=en_US",connections: [
        { planet: "provider_management", desc: "Referrals connect constituents with service providers" },
        { planet: "common_features", desc: "OmniScript guided flows capture referral intake details" }
      ]
    },
    {
      id: "complaint-processing",
      name: "Complaint Management",
      icon: "\u{1F4E2}",
      desc: "Processes public complaints about health, safety, and well-being concerns through guided intake flows. Captures complainant details, involved parties, and incident specifics. Caseworkers conduct Dynamic Assessments to evaluate allegations and determine follow-up actions including investigative cases.",
      tags: ["PublicComplaint", "ComplaintCase", "ComplaintParticipant"],
      docs:["Complaint Management in Public Sector Solutions processes public complaints about health, safety, and well-being concerns through guided intake flows. The PublicComplaint object stores complaint details including incident information and reporter details, while ComplaintCase and ComplaintParticipant objects track the people involved and their roles in the complaint.","Constituents can file complaints online through Experience Cloud sites, and legally mandated reporters such as teachers can also submit complaints. Intake agents capture complaints through phone or in-person interactions using the complaint intake guided flow, which quickly gathers critical details about the people involved, their roles, and the nature of the issue.","When caseworkers review complaints, they conduct Dynamic Assessments to evaluate the allegations and determine follow-up actions. After screening, the complaint reviewer can create an investigative case for further inquiry or a standard case to provide support, care plans, and benefits to improve the constituents' circumstances. Complaint severity and follow-up actions are recorded as assessment responses."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_admin_case_management.htm&type=5&language=en_US",connections: [
        { planet: "inspections", desc: "Complaints may trigger inspection visits to investigate concerns" },
        { planet: "investigative_cases", desc: "Screened complaints can escalate to investigative cases" },
        { planet: "common_features", desc: "Guided intake flows and assessments support complaint processing" }
      ]
    }
  ],
  dataFlow: [
    "Create social programs with benefit types, benefits, and goal definitions",
    "Intake officer receives complaint or referral and screens using guided flow",
    "Caseworker conducts Dynamic Assessment to evaluate circumstances and needs",
    "Care plan created from template with assigned goals, programs, and benefits",
    "Constituent enrolled in programs and benefits through the care plan",
    "Caseworker monitors progress through interaction summaries and timeline"
  ],
  connections: [
    { planet: "common_features", desc: "Assessments, action plans, and interaction summaries power social casework" },
    { planet: "benefit_management", desc: "Financial benefit assistance complements social program services" },
    { planet: "setup_and_security", desc: "Person accounts and permissions enable program management" },
    { planet: "inspections", desc: "Complaints may require inspection visits for investigation" },
    { planet: "investigative_cases", desc: "Complaints escalate to investigative cases when needed" },
    { planet: "provider_management", desc: "Care plans include referrals to external service providers" },
    { planet: "experience_cloud", desc: "Constituents file complaints and referrals through portal" }
  ,
    { planet: "social_insurance", desc: "Social insurance claims link to program enrollment" },
    { planet: "emergency_and_assets", desc: "Emergency assistance programs for crisis response" },
    { planet: "grantmaking", desc: "Grant-funded programs and benefit delivery" }
  ]
},

benefit_management: {
  packages: ['core'],
  name: "Benefit Management",
  icon: "\u{1F4B5}",
  color: "#10b981",
  description: "Accelerates monetary assistance for individuals, families, and organizations through configurable benefit programs. Manages the complete benefit lifecycle from eligibility prescreening through application intake, automated eligibility determination using Business Rules Engine, benefit assignment, disbursement scheduling, change of circumstances reporting, and periodic recertification. Supports benefit types like social insurance, tax benefits, subsidies, food and housing assistance, and direct cash assistance with Experience Cloud self-service portals.",
  components: [
    {
      id: "benefit-types-config",
      name: "Benefit Types & Configuration",
      icon: "\u{2699}",
      desc: "Defines benefit types with process categories and service classifications, and creates specific benefits with associated programs and goal definitions. Includes benefit schedules that specify session frequencies, quantities, and timeframes for service delivery.",
      tags: ["BenefitType", "Benefit", "BenefitItemCode"],
      docs:["Benefit Types and Configuration in Public Sector Solutions define the structure for monetary assistance programs. The BenefitType object specifies process categories and service classifications, while the Benefit object creates specific assistance offerings with associated programs and goal definitions. BenefitItemCode objects provide additional classification for benefit line items.","Configuration involves enabling Program and Benefit Management in Setup, which activates the ability to create and manage programs, benefits, and goals. Benefit Disbursement Settings must also be enabled to support payment distribution. Administrators create benefit types with categories such as social insurance, tax benefits, subsidies, food assistance, housing assistance, and direct cash assistance.","Benefit schedules specify session frequencies, quantities, and timeframes for service delivery. For example, a family counseling benefit might have a schedule of eight 50-minute sessions, while a job training workshop might be configured as a single 8-hour session. These schedules drive the enrollment and attendance tracking within provider management."],connections: [
        { planet: "social_programs", desc: "Benefits link to programs and goal definitions for outcomes tracking" },
        { planet: "common_features", desc: "Business Rules Engine references benefit types for eligibility rules" }
      ]
    },
    {
      id: "benefit-application-intake",
      name: "Application Intake",
      icon: "\u{1F4E5}",
      desc: "Captures constituent information through Discovery Framework assessment questions and OmniScript guided flows. Stores responses in Salesforce objects using Integration Procedures and Data Mappers, with effective dates for income and expense data to support eligibility calculations.",
      tags: ["IndividualApplication", "Assessment", "AssessmentQuestion"],
      docs:["Application Intake for Benefit Management uses Discovery Framework assessment questions and OmniStudio guided flows to capture constituent information. Public Sector Solutions provides a Discovery Framework template (Public Sector Benefit Management) that includes assessment questions, Omniscripts, Integration Procedures, and Data Mappers designed for a sample Low Income Home Energy Assistance Program (LIHEAP) that can be customized for other benefit programs.","The intake process stores assessment question responses in Salesforce objects using Integration Procedures and Data Mappers, with effective start and end dates for income and expense data to support time-sensitive eligibility calculations. The IndividualApplication object stores the application record, and assessment responses capture household composition, income sources, and expense details.","Constituents access the application through the Benefit Finder on the Benefit Assistance Experience Cloud site, which uses the BenefitAssistance/AssessEligibility Omniscript for prescreening eligibility. The prescreening flow evaluates basic criteria using Business Rules Engine and directs eligible constituents to the full application form."],connections: [
        { planet: "common_features", desc: "Discovery Framework and OmniStudio power application forms" },
        { planet: "experience_cloud", desc: "Benefit Finder and application forms on constituent portal" }
      ]
    },
    {
      id: "eligibility-determination",
      name: "Eligibility Determination",
      icon: "\u{2696}",
      desc: "Automates benefit eligibility checks using Business Rules Engine decision matrices and expression sets. Evaluates household size, income thresholds, citizenship status, and other criteria. Decision Explainer provides transparency into eligibility decisions and benefit amount calculations for constituents.",
      tags: ["ExpressionSet", "DecisionMatrix"],
      docs:["Eligibility Determination in Benefit Management automates benefit eligibility checks using Business Rules Engine decision matrices and expression sets. The PrescreeningForBenefits_PovertyGuideline decision matrix defines income thresholds based on household size, while the CalculateBenefitAmount_NetIncomePointsTable matrix calculates benefit amounts using household size and income-based point systems.","Expression set templates drive the calculation logic: PSSExpCloud_PrescreeningForBenefits evaluates initial eligibility, PSSExpCloud_CalculateBenefitAmount computes the benefit amount, and PSSExpCloud_MemberBenefitEligibility checks individual member eligibility based on criteria like US citizenship status. Each expression set version has configurable date ranges and rank numbers for version management.","Decision Explainer provides transparency into eligibility decisions by generating human-readable explanations of how eligibility was determined and benefit amounts were calculated. The BenefitApplicationLogs explainability action definition links to the benefit amount expression set, and constituents can view these explanations on the Experience Cloud portal to understand the reasoning behind their application outcomes."],connections: [
        { planet: "common_features", desc: "BRE and Decision Explainer automate and explain eligibility decisions" },
        { planet: "experience_cloud", desc: "Eligibility prescreening available on constituent portal" }
      ]
    },
    {
      id: "benefit-assignment",
      name: "Benefit Assignment",
      icon: "\u{1F4CB}",
      desc: "Assigns approved benefits to eligible applicants with specified amounts, frequencies, and duration. Supports benefit assignment adjustments when circumstances change, and tracks recertification status with configurable due dates and reminder periods.",
      tags: ["BenefitAssignment", "BenefitAssignmentAdjustment", "BenefitScheduleAssignment"],
      docs:["Benefit Assignment in Public Sector Solutions assigns approved benefits to eligible applicants with specified amounts, frequencies, and duration. The BenefitAssignment object records the assignment details, while BenefitAssignmentAdjustment tracks changes when circumstances change. BenefitScheduleAssignment links assignments to specific delivery schedules.","Caseworkers process benefit assignments through guided OmniScript flows that launch from the individual application record page. The flow enables caseworkers to check benefit eligibility, review application details, and assign benefits to eligible applicants. Adjustments can be made when constituents report changes of circumstances that affect their eligibility or benefit amounts.","Recertification tracking is built into the assignment with configurable due dates and reminder periods. The Data Processing Engine runs batch jobs to identify pending assignments that require recertification, and constituents are notified through flows to complete recertification on the Experience Cloud portal before their benefits expire."],connections: [
        { planet: "social_programs", desc: "Care plans trigger benefit assignment to enrolled constituents" },
        { planet: "common_features", desc: "Caseworker guided flow processes assignment and adjustments" }
      ]
    },
    {
      id: "benefit-disbursement",
      name: "Benefit Disbursement",
      icon: "\u{1F4B8}",
      desc: "Manages payment distribution for assigned benefits with automatic and manual disbursement options. Tracks disbursement amounts, frequencies, and adjustment records. Supports benefit schedules with sessions that define delivery timeframes and quantities.",
      tags: ["BenefitDisbursement", "BenefitDisbursementAdj", "BenefitSchedule", "BenefitSession"],
      docs:["Benefit Disbursement manages payment distribution for assigned benefits using the BenefitDisbursement object with automatic and manual disbursement options. The BenefitDisbursementAdj object tracks disbursement adjustments, and BenefitSchedule and BenefitSession objects define delivery timeframes and quantities for scheduled payments.","Disbursements can be configured for automatic creation on a recurring schedule or triggered manually by caseworkers. Each disbursement record tracks the amount, frequency, payment date, and status. The disbursement engine supports both direct monetary payments and service delivery tracking through benefit sessions that define when and how services are provided.","Benefit Disbursement Settings must be enabled in the Program and Benefit Management Settings in Setup. The Benefit Disbursement Access permission set is assigned to caseworkers and other users who need to create and manage disbursement records. Notification flows alert constituents of disbursement status changes through the Experience Cloud portal."],connections: [
        { planet: "social_insurance", desc: "Disbursement engine shared with social insurance payments" },
        { planet: "common_features", desc: "Notification flows alert constituents of disbursement status" }
      ]
    },
    {
      id: "benefit-recertification",
      name: "Recertification & Changes",
      icon: "\u{1F504}",
      desc: "Enables periodic recertification through Data Processing Engine batch jobs that identify pending assignments. Supports change of circumstances reporting through guided flows where constituents update household, income, and expense details with supporting documentation.",
      tags: ["IndividualApplication", "BenefitAssignment"],
      docs:["Recertification and Changes in Public Sector Solutions enable periodic benefit recertification through Data Processing Engine batch jobs that identify assignments pending renewal. Constituents access recertification through the Experience Cloud portal, where a guided flow shows them benefits pending recertification and allows them to review previously provided information, confirm or update details, upload supporting documents, and submit their recertification application.","Change of Circumstances reporting is supported through a separate guided flow on the Experience Cloud site. Constituents report changes in household composition, income, or expenses that may affect their eligibility or benefit amount. Caseworkers review the changes using a guided flow that processes benefit assignment adjustments based on the updated information.","The recertification workflow involves caseworkers processing applications through guided flows that check whether the recertification is complete and accurate, correct details based on supporting documentation, and accept or deny the application. Upon approval, caseworkers renew or adjust benefit amounts to match the constituent's current eligibility status."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_benefit_assistance_comm_settings.htm&language=en_US&type=5",connections: [
        { planet: "experience_cloud", desc: "Recertification and change of circumstances flows on portal" },
        { planet: "common_features", desc: "Data Processing Engine and OmniStudio power recertification workflows" }
      ]
    }
  ],
  dataFlow: [
    "Configure benefit types, benefits, eligibility criteria, and decision matrices",
    "Constituent finds applicable benefits through eligibility prescreening on portal",
    "Application intake captures household, income, and expense details via guided flow",
    "Business Rules Engine evaluates eligibility and calculates benefit amounts automatically",
    "Caseworker reviews application using guided flow and assigns benefits to eligible applicants",
    "Benefits disbursed on schedule with periodic recertification to maintain eligibility"
  ],
  connections: [
    { planet: "common_features", desc: "BRE, assessments, and OmniStudio automate benefit workflows" },
    { planet: "social_programs", desc: "Social programs and care plans connect to benefit assignment" },
    { planet: "setup_and_security", desc: "Permission set groups define caseworker and constituent access" },
    { planet: "experience_cloud", desc: "Constituent portal enables self-service benefit applications" },
    { planet: "social_insurance", desc: "Social insurance extends benefit management with policy-based enrollment" },
    { planet: "provider_management", desc: "Provider networks deliver assigned benefit services" },
    { planet: "crm_analytics", desc: "Analytics provides insights into benefit distribution and caseloads" }
  ,
    { planet: "einstein_ai", desc: "AI-assisted eligibility determination and case notes" },
    { planet: "data_360", desc: "Unified constituent data for benefit eligibility" },
    { planet: "employee_experience", desc: "Employee benefits through HR service integration" },
    { planet: "grantmaking", desc: "Grant-funded benefit programs and disbursements" }
  ]
},


social_insurance: {
  packages: ['core'],
  name: "Social Insurance",
  icon: "\u{1F3E5}",
  color: "#06b6d4",
  description: "Manages publicly supported social insurance programs that provide financial assistance and protection to constituents experiencing life events such as retirement, workplace injury, or illness. Covers the full lifecycle from policy enrollment and contribution tracking through claims filing, review, and benefit disbursement. Includes workers' compensation flows, care barrier identification, and guided claim intake via Experience Cloud sites using OmniStudio components.",
  components: [
    {
      id: "insurance-policies",
      name: "Insurance Policies",
      icon: "\u{1F4DC}",
      desc: "Defines social insurance policies and manages constituent enrollment. Tracks policy details, relates person accounts to policies, and records contributions using the Insurance Policy Transaction object.",
      tags: ["InsurancePolicy", "InsurancePolicyTransaction", "Program", "BenefitType", "Benefit"],
      docs:["Insurance Policies in Public Sector Solutions define social insurance programs that provide financial assistance to constituents experiencing life events such as retirement, workplace injury, or illness. The InsurancePolicy object stores policy details and manages constituent enrollment, while InsurancePolicyTransaction records track contributions made by employers and employees over time.","Policies are linked to programs and benefit types, connecting the social insurance framework with the broader benefit management system. When constituents enroll in a policy, their person account is related to the policy record, and contributions are tracked through insurance policy transactions that record payment amounts, dates, and sources.","Social insurance programs are configured through the Program and Benefit Management settings, using the same foundation as other PSS benefit programs. Administrators define the policy parameters including coverage types, eligibility criteria, and contribution requirements, then publish the policies for constituent enrollment through Experience Cloud sites."],connections: [
        { planet: "benefit_management", desc: "Insurance policies link to benefit programs and disbursements" },
        { planet: "social_programs", desc: "Social insurance programs are configured through program management" }
      ]
    },
    {
      id: "claims-management",
      name: "Claims Management",
      icon: "\u{1F4CB}",
      desc: "Stores claim details when constituents file for social insurance benefits. Tracks claim participants, claim items, and approval status. After review, approved claims generate care plans for benefit delivery.",
      tags: ["Claim", "ClaimItem", "ClaimParticipant"],
      docs:["Claims Management stores and processes social insurance benefit claims using the Claim, ClaimItem, and ClaimParticipant objects. When constituents file for benefits after experiencing a covered life event, the claim record captures all relevant details including the type of claim, involved parties, supporting documentation, and the specific items being claimed.","Claim participants are tracked separately to record the roles of each person involved in the claim, such as the claimant, employer, witnesses, and healthcare providers. ClaimItem objects store individual line items within a claim, allowing agencies to break down complex claims into discrete components that can be individually reviewed and adjudicated.","After review, approved claims generate care plans for benefit delivery. The claim approval status drives the creation of benefit assignments and goal assignments, connecting the insurance claim process to the broader care plan and benefit disbursement workflows in Public Sector Solutions."],connections: [
        { planet: "benefit_management", desc: "Approved claims create benefit assignments and care plans" },
        { planet: "experience_cloud", desc: "Constituents file and track claims through Experience Cloud sites" }
      ]
    },
    {
      id: "workers-compensation",
      name: "Workers' Compensation",
      icon: "\u{1F6E1}",
      desc: "Captures compensation coverage classes representing categories of work employees perform. Tracks payment requests and contribution amounts that employers and employees make to workers' compensation policies.",
      tags: ["WorkerCompensationCoverageClass", "PaymentRequest", "PaymentRequestLine"],
      docs:["Workers' Compensation in Public Sector Solutions captures compensation coverage classes representing categories of work that employees perform. The WorkerCompensationCoverageClass object defines these categories, enabling agencies to classify different types of employment and their associated risk levels for workers' compensation purposes.","Payment requests and contribution amounts that employers and employees make to workers' compensation policies are tracked through the PaymentRequest and PaymentRequestLine objects. These records maintain a financial history of contributions, enabling agencies to verify coverage status and calculate benefit entitlements when claims are filed.","Injured workers who file compensation claims are referred to healthcare providers for treatment through the provider management system. The integration between workers' compensation and provider management ensures that claimants receive appropriate care while the agency tracks the costs and outcomes of treatment."],connections: [
        { planet: "provider_management", desc: "Injured workers are referred to healthcare providers for treatment" },
        { planet: "experience_cloud", desc: "File a Claim and Respond to Claim flows run on Experience Cloud" }
      ]
    },
    {
      id: "claim-guided-flows",
      name: "Claim Guided Flows",
      icon: "\u{1F9ED}",
      desc: "OmniStudio-powered guided flows for workers' compensation claims. The File a Claim flow captures injury details and creates claim records. The Respond to Claim flow lets employers verify filed claims and provide additional information.",
      tags: ["IndividualApplication"],
      docs:["Claim Guided Flows provide OmniStudio-powered intake experiences for workers' compensation claims. The File a Claim flow captures injury details from the injured worker including the nature of the injury, circumstances, date, and location, then creates the corresponding claim records in Salesforce. The Respond to Claim flow allows employers to verify filed claims and provide additional information.","Both flows are hosted on the Benefit Assistance Experience Cloud site, making them accessible to constituents and employers through the self-service portal. The flows use Discovery Framework templates to power the assessment questions that capture claim details, ensuring consistent and complete information collection across all claim submissions.","The guided flow architecture leverages OmniStudio components including Omniscripts for the form logic, Integration Procedures for data mapping, and Data Mappers for populating Salesforce objects from form responses. The IndividualApplication object stores the claim application record, linking it to the broader benefit management workflow."],connections: [
        { planet: "experience_cloud", desc: "Guided flows are hosted on the Benefit Assistance Experience Cloud site" },
        { planet: "common_features", desc: "Discovery Framework templates power the claim assessment questions" }
      ]
    },
    {
      id: "care-barriers",
      name: "Care Barriers",
      icon: "\u{26A0}",
      desc: "Identifies obstacles that make it difficult for constituents to access care or services. Uses diagnostic code sets to map medical conditions to care barrier types, and relates barriers to care plans for resolution.",
      tags: ["Codeset", "CodesetBundle", "CareBarrier", "CareBarrierType", "CarePlan", "CarePlanDetail"],
      docs:["Care Barriers identify obstacles that make it difficult for constituents to access care or services. The CareBarrier and CareBarrierType objects classify barriers such as transportation limitations, language barriers, financial constraints, or health conditions that impede a constituent's ability to participate in assigned programs and receive benefits.","Diagnostic code sets using the Codeset and CodesetBundle objects map medical conditions to care barrier types, enabling caseworkers to systematically identify health-related barriers when reviewing claims. This structured approach ensures that barrier identification is consistent and based on established medical coding standards.","Care barriers are related to care plans through CarePlanDetail objects, enabling caseworkers to document identified barriers and plan resolution strategies. Resolution may involve provider referrals for specialized services, benefit assignment adjustments, or modifications to the care plan to accommodate the constituent's specific circumstances."],connections: [
        { planet: "benefit_management", desc: "Care barriers inform benefit assignments and goal assignments" },
        { planet: "provider_management", desc: "Care barrier resolution may involve provider referrals" }
      ]
    }
  ],
  dataFlow: [
    "Administrators configure social insurance programs, benefit types, and insurance policies",
    "Constituents enroll in policies and contributions are tracked via Insurance Policy Transactions",
    "Injured workers or eligible constituents file claims through guided flows on Experience Cloud",
    "Claim reviewers assess claims, verify participant details, and record approval status",
    "Approved claims generate care plans with benefit assignments and goal assignments",
    "Care barriers are identified and addressed through provider referrals and benefit disbursements"
  ],
  connections: [
    { planet: "benefit_management", desc: "Approved claims generate benefit assignments and disbursements" },
    { planet: "social_programs", desc: "Insurance programs are managed through program and benefit settings" },
    { planet: "provider_management", desc: "Claimants are referred to providers for care delivery" },
    { planet: "experience_cloud", desc: "Claim filing and tracking via Benefit Assistance site" },
    { planet: "common_features", desc: "Discovery Framework powers claim assessment templates" }
  ]
},

provider_management: {
  packages: ['core'],
  name: "Provider Management",
  icon: "\u{1F3E5}",
  color: "#ec4899",
  description: "Builds and manages a network of service providers that government agencies collaborate with to serve constituents. Covers provider recruitment with facility and specialty tracking, criteria-based provider search powered by the Data Processing Engine, guided referral flows for caseworkers, and a provider Experience Cloud portal for processing referrals, managing service delivery, and tracking benefit sessions and attendance.",
  components: [
    {
      id: "provider-registry",
      name: "Provider Registry",
      icon: "\u{1F4C7}",
      desc: "Captures provider details including healthcare providers, facilities, practitioner-facility associations, and specialties. Maps agency benefits to provider specialties using the Benefit Specialty object for searchability.",
      tags: ["HealthcareProvider", "HealthcareFacility", "HealthcarePractitionerFacility", "CareSpecialty", "CareProviderFacilitySpecialty", "HealthcareProviderSpecialty"],
      docs:["The Provider Registry captures detailed information about service providers using the HealthcareProvider, HealthcareFacility, and HealthcarePractitionerFacility objects. Providers are registered with their specialties through CareSpecialty and HealthcareProviderSpecialty, and facilities are linked to their available specialties via the CareProviderFacilitySpecialty object.","Agency benefits are mapped to provider specialties using the BenefitSpecialty object, creating a searchable link between the services an agency administers and the providers qualified to deliver them. This mapping is essential for the criteria-based provider search feature, enabling caseworkers to quickly find providers that match a constituent's specific benefit needs.","The registry supports the full provider lifecycle from recruitment through ongoing management. Provider details include contact information, credentials, facility locations, and the specialties they offer. This data forms the foundation for provider search, referral workflows, and the Service Provider Portal on Experience Cloud."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_provider_search.htm&type=5&language=en_US",connections: [
        { planet: "social_insurance", desc: "Insurance claimants are matched with qualified providers" },
        { planet: "benefit_management", desc: "Provider specialties are mapped to agency benefit types" }
      ]
    },
    {
      id: "provider-search",
      name: "Provider Search",
      icon: "\u{1F50D}",
      desc: "Criteria-based search and filter framework that compiles provider data into the Benefit Provider Searchable Field object via Data Processing Engine. Supports distance filters, picklist criteria, and configurable search result actions.",
      tags: ["BenefitPrvdSearchableFld", "BenefitSpecialty", "BenefitAsgntProviderLoc"],
      docs:["Provider Search in Public Sector Solutions uses a criteria-based search and filter framework powered by the Data Processing Engine. The BenefitPrvdSearchableFld object stores compiled provider data that has been processed into a searchable format, enabling fast and flexible searches across provider networks based on specialty, location, and other criteria.","The Data Processing Engine compiles provider data from multiple source objects into the Benefit Provider Searchable Field object, creating a denormalized search index that supports distance filters, picklist criteria, and configurable search result actions. Caseworkers access provider search from the Benefit Assignments related list on constituent records.","Search results display matching providers with their facilities, specialties, and distance from the constituent. Configurable actions on search results allow caseworkers to directly initiate referral workflows from the search interface, streamlining the process of connecting constituents with appropriate service providers."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_provider_search.htm&type=5&language=en_US",connections: [
        { planet: "benefit_management", desc: "Provider search is accessible from the Benefit Assignments related list" },
        { planet: "crm_analytics", desc: "Data Processing Engine definitions power the searchable object" }
      ]
    },
    {
      id: "provider-referrals",
      name: "Provider Referrals",
      icon: "\u{1F4E8}",
      desc: "OmniStudio-powered guided flow for caseworkers to share constituent information with providers. Creates referral records per provider, attaches PDF templates with client data, and supports authorization workflows.",
      tags: ["Referral"],
      docs:["Provider Referrals use an OmniStudio-powered guided flow that enables caseworkers to share constituent information with selected service providers. The flow creates Referral records for each provider, attaches PDF templates containing client data, and initiates authorization workflows to ensure proper approval before services begin.","Referrals originate from care plans and benefit assignments, connecting the social program and benefit management workflows to the provider network. When a caseworker identifies a constituent need that can be fulfilled by an external provider, the referral flow captures the required information and routes it to the appropriate provider through the system.","Providers receive and process referral requests through the Service Provider Portal on Experience Cloud. The portal allows providers to review referral details, accept or decline referrals, request authorization from the referring agency, and begin the service delivery process once approved."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_provider_referral_flow.htm&type=5&language=en_US",connections: [
        { planet: "social_programs", desc: "Referrals originate from case plans and benefit assignments" },
        { planet: "experience_cloud", desc: "Providers process referral requests through the provider portal" }
      ]
    },
    {
      id: "service-delivery",
      name: "Service Delivery",
      icon: "\u{2705}",
      desc: "Tracks benefit sessions, schedules, and attendance for services delivered by providers. Providers create schedules submitted for caseworker approval, then enroll constituents in sessions and record attendance.",
      tags: ["BenefitSession", "BenefitSchedule", "BenefitDisbursement"],
      docs:["Service Delivery tracks benefit sessions, schedules, and attendance for services delivered by providers. Providers create BenefitSchedule records that define when and how often services are offered, then submit these schedules for caseworker approval. Once approved, constituents are enrolled in BenefitSession records that track individual service delivery events.","Attendance tracking records whether constituents participate in scheduled sessions, providing agencies with data on service utilization and constituent engagement. Providers enter attendance information through the Service Provider Portal, and the data flows back to the benefit management system for disbursement processing and outcome tracking.","Service delivery creates BenefitDisbursement records that document the actual delivery of services, linking provider sessions to the benefit assignment and payment infrastructure. This integration ensures that payments to providers are tied to verified service delivery and that agencies can audit the full chain from referral to service completion."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_provider_service_delivery_workflow.htm&type=5&language=en_US",connections: [
        { planet: "benefit_management", desc: "Service delivery creates benefit disbursement records" },
        { planet: "experience_cloud", desc: "Providers track delivery and attendance through the provider portal" }
      ]
    },
    {
      id: "provider-portal",
      name: "Provider Portal",
      icon: "\u{1F310}",
      desc: "Experience Cloud site built from the Service Provider Portal template with preconfigured pages for clients, schedules, and attendance. Providers can process referrals, enroll clients, track service delivery, and manage their own information.",
      tags: [],
      docs:["The Provider Portal is an Experience Cloud site built from the Service Provider Portal template with preconfigured pages for managing clients, schedules, and attendance. Providers can process incoming referral requests, enroll clients in service sessions, track service delivery progress, and manage their own organizational information through the portal.","Access to the Provider Portal is controlled through partner community user profiles and permission sets. The Social_Program_Management_Provider permission set group bundles the required permissions for provider users, ensuring they have access to the referral, scheduling, and attendance features while maintaining appropriate data boundaries.","The portal provides a collaborative environment between agencies and their provider networks. Providers can view assigned constituents, schedule sessions, record attendance, and report on service outcomes, while caseworkers maintain oversight through approval workflows and delivery tracking dashboards."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_service_provider_portal.htm&type=5&language=en_US",connections: [
        { planet: "experience_cloud", desc: "Provider portal is built on Experience Cloud with the Service Provider Portal template" },
        { planet: "setup_and_security", desc: "Partner community user profiles and permission sets control provider access" }
      ]
    }
  ],
  dataFlow: [
    "Administrators register providers, facilities, and specialties in the Provider Management data model",
    "Data Processing Engine compiles provider data into the Benefit Provider Searchable Field object",
    "Caseworkers search for providers matching constituent needs using criteria-based search",
    "Referrals are created through the guided flow, sharing constituent details with selected providers",
    "Providers accept referrals and request authorization on the provider portal",
    "Caseworkers authorize referrals, providers create schedules and enroll constituents in sessions"
  ],
  connections: [
    { planet: "benefit_management", desc: "Provider specialties map to benefits and disbursements" },
    { planet: "social_insurance", desc: "Insurance claimants are referred to healthcare providers" },
    { planet: "social_programs", desc: "Caseworkers refer program participants to providers" },
    { planet: "experience_cloud", desc: "Provider portal and referral flows on Experience Cloud" },
    { planet: "setup_and_security", desc: "Permission sets control provider access and sharing" }
  ]
},

investigative_cases: {
  packages: ['core'],
  name: "Investigative Case Management",
  icon: "\u{1F50E}",
  color: "#f97316",
  description: "Provides a comprehensive framework for managing investigative cases from complaint intake through resolution. Supports complaint filing, screening, case creation, evidence collection with chain of custody tracking, case proceedings for legal matters, and resolution recording. Includes the Casework Overview console with Actionable Relationship Center graphs, Dynamic Assessments, Timeline, and OmniStudio-powered guided flows for complaint intake and evidence management.",
  components: [
    {
      id: "complaint-intake",
      name: "Complaint Intake",
      icon: "\u{1F4DD}",
      desc: "Captures complaint details through guided OmniScript flows on the Benefit Assistance portal. Creates public complaint records with assessment responses, regulatory code references, and custody item relations for digital evidence.",
      tags: ["ComplaintCase", "ComplaintParticipant"],
      docs:["Complaint Intake for Investigative Case Management captures complaint details through guided OmniScript flows on the Benefit Assistance Experience Cloud portal. The CaseProceeding/ComplaintIntake Omniscript uses a Discovery Framework sample template (Public Sector Justice and Investigative Case Management) that includes assessment questions and sub-Omniscripts for regulatory code details, participant details, and allegation specifics.","When a constituent submits a complaint, Public Sector Solutions automatically creates a public complaint record with incident and reporter details, assessment question responses storing regulatory codes and allegations, and custody item relations for any digital evidence files attached to the complaint. The ComplaintCase and ComplaintParticipant objects track case associations and involved parties.","The complaint intake setup requires enabling case proceedings and evidence management, deploying the Discovery Framework sample template, and activating the CaseProceeding/ComplaintIntake, CaseProceeding/Allegations, CaseProceeding/ParticipantDetails, and CaseProceeding/RCVDetails Omniscripts. Sharing settings must be configured for Assessment, Regulatory Authority, and other objects to enable portal users to submit complaints."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_complaint_intake_judicial_investigative_cases.htm&type=5&language=en_US",connections: [
        { planet: "experience_cloud", desc: "Complaint forms are hosted on the Benefit Assistance Experience Cloud site" },
        { planet: "agentforce", desc: "Agentforce agents assist constituents in filing complaints" }
      ]
    },
    {
      id: "case-investigation",
      name: "Case Investigation",
      icon: "\u{1F575}",
      desc: "Provides Casework Overview, a predefined console record page for managing case data. Investigators can review participants, track relationships via ARC graphs, conduct Dynamic Assessments, and capture interaction summaries.",
      tags: ["CaseParticipant", "CaseEpisode"],
      docs:["Case Investigation provides the Casework Overview, a predefined console record page that serves as the central hub for managing investigative case data. Investigators can review case participants, track relationships through Actionable Relationship Center (ARC) graphs, conduct Dynamic Assessments, capture interaction summaries, and view a chronological timeline of case activities.","The CaseParticipant object tracks individuals involved in a case with their roles, while CaseEpisode records mark significant events and milestones in the investigation. ARC graphs on the Case Relationships and Case Participants tabs show visual representations of the relationships between different participants, including group membership for organized entities like defense counsel.","Timeline configuration is enabled as a one-time setup that provides investigators with a chronological view of past, ongoing, and upcoming activities. The timeline integrates Action Plans, Assessments, Case Participants, Custody Item Relations, and Regulatory Code Violations as related objects, giving investigators a comprehensive view of all case-related activity."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_investigative_case_management_prerequisites.htm&type=5&language=en_US",connections: [
        { planet: "common_features", desc: "Dynamic Assessments and Action Plans power investigation workflows" },
        { planet: "einstein_ai", desc: "Einstein generates case notes summaries for investigators" }
      ]
    },
    {
      id: "case-proceedings",
      name: "Case Proceedings",
      icon: "\u{2696}",
      desc: "Tracks criminal and civil legal proceedings including court actions, appeals, mediations, and arbitrations. Records proceeding participants with roles, infractions linked to regulatory code violations, and case proceeding results.",
      tags: ["CaseProceeding", "CaseProceedingComplaint", "CaseProceedingInfraction", "CaseProceedingParticipant", "CaseProceedingResult"],
      docs:["Case Proceedings track criminal and civil legal proceedings associated with investigative cases. The CaseProceeding object records court actions, appeals, mediations, and arbitrations, while CaseProceedingComplaint links proceedings to originating complaints. CaseProceedingInfraction records tie infractions to regulatory code violations that were discovered during investigation.","CaseProceedingParticipant tracks the roles of individuals in proceedings, such as defense counsel, prosecutors, judges, and witnesses. CaseProceedingResult records the outcomes of proceedings, capturing enforcement actions, rulings, or care plans that result from the legal process. The Add Participants quick action uses an Omniscript to help caseworkers find and assign case participants to proceedings.","Constituents can request case proceeding deferrals through the Benefit Assistance portal using the CaseProceeding/ServiceRequest Omniscript. Service Process Studio creates a case record for the deferral request, and the Defer a Case Proceeding flow updates proceeding dates when the request is approved through a configured approval process on the Case object."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_set_up_case_participants_addition_case_proceeding.htm&type=5&language=en_US",connections: [
        { planet: "common_features", desc: "Regulatory codes and enforcement actions link to proceedings" },
        { planet: "experience_cloud", desc: "Constituents can request case proceeding deferrals through the portal" }
      ]
    },
    {
      id: "evidence-custody",
      name: "Evidence & Chain of Custody",
      icon: "\u{1F50F}",
      desc: "Manages physical and digital evidence as custody items with chain of custody tracking. Records custodian details, custody sites, verification types, and links evidence to regulatory code violations. Guided flow simplifies evidence collection.",
      tags: ["CustodyItem", "CustodyChainEntry", "CustodyItemRelation", "CustodyItemRgltyCodeVio"],
      docs:["Evidence and Chain of Custody manages physical and digital evidence as custody items with full chain of custody tracking. The CustodyItem object stores evidence details including name, category, description, and status. CustodyChainEntry records track the possession history of each item, documenting custodian details, custody sites, and verification types.","The CustodyItemRelation object links custody items to cases and case proceedings, while CustodyItemRgltyCodeVio connects evidence to specific regulatory code violations. The guided flow in the Custody Items tab of Casework Overview simplifies evidence collection by allowing investigators to add a custody item, specify custodian details, and select related regulatory code violations in a single workflow.","Evidence Management is enabled through the Evidence Management Settings in Setup and requires the Evidence Management permission set for investigators and caseworkers. When custody items are created independently rather than through the guided flow, manual custody item relation records must be created to link the evidence to its associated case or case proceeding."],connections: [
        { planet: "common_features", desc: "Custody items link to regulatory code violations" },
        { planet: "setup_and_security", desc: "Evidence Management permission set controls access to custody objects" }
      ]
    },
    {
      id: "casework-analytics",
      name: "Caseworker Productivity Analytics",
      icon: "\u{1F4CA}",
      desc: "CRM Analytics app providing insights into case trends, caseload distribution, and case processing times. Helps supervisors monitor investigator workloads and identify bottlenecks in case resolution.",
      tags: [],
      docs:["Caseworker Productivity Analytics provides a CRM Analytics app with insights into case trends, caseload distribution, and case processing times. The Workload Management Analytics dashboard includes four tabs: Summary for caseload trends and distribution, SLA Management for stage transition tracking, Benefits for community impact metrics, and Leaderboard for caseworker performance comparison.","The analytics setup requires enabling CRM Analytics, assigning admin and user permission sets, installing the Caseworker Productivity app, and reviewing data requirements for dashboards. The guided setup assistant is available from Setup under Program and Benefits Management, selecting Set Up Caseworker Productivity Analytics.","A separate Case Analytics dashboard is embedded on the case record page showing how many days a case has spent in each status and the total processing time. This helps caseworkers and managers ensure they meet service-level agreement requirements by visualizing the case lifecycle timing and identifying cases at risk of SLA violations."],connections: [
        { planet: "crm_analytics", desc: "Caseworker Productivity dashboards are built on CRM Analytics" },
        { planet: "setup_and_security", desc: "Analytics access requires CRM Analytics enablement and permissions" }
      ]
    },
    {
      id: "complaint-assessments",
      name: "Complaint Assessments",
      icon: "\u{1F4CB}",
      desc: "Enables incident managers to perform preliminary complaint assessments and supports investigators with case and risk evaluations. Uses Dynamic Assessments with action plan templates containing structured assessment question checklists.",
      tags: [],
      docs:["Complaint Assessments enable incident managers to perform preliminary complaint evaluations and support investigators with case and risk assessments. The assessments use Dynamic Assessment capabilities with action plan templates containing structured question checklists tailored to complaint intake and investigation scenarios.","Assessment setup involves creating assessment questions based on complaint scenarios, defining omni assessment tasks to organize questions, and creating action plan templates that serve as checklists. For preliminary complaint assessment, the target object is Public Complaint, while case and risk evaluations use Case as the target object. Case managers create action plans from these templates for each evaluation.","Agentforce assists complaint management officers with AI-powered summaries of complaint information, identification of similar past complaints, flagging of potential regulatory code violations, compliance assessment administration, and automated notification of relevant parties. These AI capabilities help officers process high volumes of complaints more efficiently."],connections: [
        { planet: "common_features", desc: "Discovery Framework and Dynamic Assessments power evaluation workflows" },
        { planet: "agentforce", desc: "Agentforce assists complaint management officers with AI-powered summaries" }
      ]
    }
  ],
  dataFlow: [
    "Constituents or intake officers file complaints through guided flows or the Benefit Assistance portal",
    "Incident managers screen complaints using Dynamic Assessments and create case records",
    "Investigators manage cases through Casework Overview, collecting evidence and tracking custody chains",
    "Caseworkers initiate case proceedings for legal matters, recording participants, infractions, and rulings",
    "Case proceeding results are recorded as enforcement actions, case episodes, or care plans",
    "Caseworker Productivity Analytics provides insights into case trends and processing times"
  ],
  connections: [
    { planet: "common_features", desc: "Regulatory codes, Dynamic Assessments, and Action Plans support investigations" },
    { planet: "experience_cloud", desc: "Complaint intake and proceeding deferrals via Benefit Assistance site" },
    { planet: "agentforce", desc: "AI agents assist with complaint intake and case summarization" },
    { planet: "einstein_ai", desc: "Einstein generates notes summaries for case managers" },
    { planet: "crm_analytics", desc: "Caseworker Productivity Analytics dashboards" },
    { planet: "setup_and_security", desc: "Permission sets control access to investigation features" }
  ,
    { planet: "social_programs", desc: "Complaints trigger program referrals and assessments" },
    { planet: "data_360", desc: "Cross-agency case data unification" }
  ]
},

talent_recruitment: {
  packages: ['core'],
  name: "Talent Recruitment Management",
  icon: "\u{1F4BC}",
  color: "#a855f7",
  description: "Transforms public sector recruitment with a console app for recruiters and HR specialists, an employee site for hiring managers and interviewers, and a career site for job seekers. Covers the full hiring lifecycle from occupation and position classification through requisition management, job posting, applicant evaluation with Dynamic Assessments, vetting procedures, and employment offers. Uses Criteria-Based Search and Filter, OmniStudio guided flows, and compliant data sharing.",
  components: [
    {
      id: "position-classification",
      name: "Position Classification",
      icon: "\u{1F3DB}",
      desc: "Defines occupation groups, occupations, and positions with pay grades and qualification requirements. Job positions represent specific instances held by employees, with pay grade steps varying by location.",
      tags: ["JobPosition", "JobPositionPayGrade", "Position", "PositionPayGrade", "PayGrade", "PayGradeStep", "PayGradeStepLocation", "Occupation", "OccupationGroup"],
      docs:["Position Classification in Talent Recruitment Management defines the organizational structure for public sector roles. The hierarchy starts with OccupationGroup, which contains Occupation definitions, which in turn have Position records. Each Position has associated PositionPayGrade records, and specific job instances are tracked as JobPosition records with JobPositionPayGrade for location-specific compensation.","Pay grades are managed through the PayGrade, PayGradeStep, and PayGradeStepLocation objects, enabling agencies to define compensation scales that vary by geographic location. This granular pay structure supports government pay banding systems where the same position may have different salary ranges depending on the duty station.","Position classifications define qualification requirements for each role, which feed into the recruitment workflow. When requisitions are created, they reference the position's requirements and pay grade to ensure that job postings accurately reflect the qualifications needed and the compensation offered for each opening."],connections: [
        { planet: "employee_experience", desc: "Position classifications define employee roles and compensation" },
        { planet: "data_360", desc: "Position and pay data integrates with Data 360 for workforce analytics" }
      ]
    },
    {
      id: "requisition-management",
      name: "Requisition Management",
      icon: "\u{1F4C4}",
      desc: "Creates recruitment requisitions as formal requests to fill job positions. Links requisitions to job positions, assigns hiring manager participants, and supports approval workflows before job posting creation.",
      tags: ["RecruitmentRequisition", "RecruitmentRequisitionLoc", "RecruitmentRequisitionPtcp", "JobPstnRecruitmentRqs"],
      docs:["Requisition Management creates formal requests to fill job positions using the RecruitmentRequisition object. Requisitions are linked to job positions through the JobPstnRecruitmentRqs junction object, and RecruitmentRequisitionPtcp records track participants such as hiring managers who are assigned to the requisition. RecruitmentRequisitionLoc associates requisitions with specific duty locations.","Requisitions follow an approval workflow before job postings can be created. Hiring managers review and approve requisitions through the Employee Site on Experience Cloud, and the approval process ensures that position requirements, budget authorization, and organizational need are verified before recruitment begins.","The requisition serves as the link between organizational planning and active recruitment. Once approved, requisitions generate job postings that are published on the Career Site. The requisition record maintains the connection between the position being filled, the job posting, and all resulting applications throughout the hiring process."],connections: [
        { planet: "setup_and_security", desc: "Approval processes control requisition review workflows" },
        { planet: "experience_cloud", desc: "Hiring managers review requisitions on the employee site" }
      ]
    },
    {
      id: "job-postings",
      name: "Job Postings",
      icon: "\u{1F4E2}",
      desc: "Drafts and publishes job postings for approved requisitions. Recruitment content sections store overview, summary, and duties content in multiple languages. Data Processing Engine populates the Job Posting Searchable Field for career site search.",
      tags: ["RecruitmentPosting", "RecruitmentPostingCntntSect", "RecruitmentContentSection"],
      docs:["Job Postings in Talent Recruitment Management are drafted and published for approved requisitions using the RecruitmentPosting object. RecruitmentContentSection and RecruitmentPostingCntntSect objects store multilingual content including overview, summary, and duties sections that describe the position to potential applicants.","The Data Processing Engine populates the Job Posting Searchable Field for the Career Site search, creating a searchable index that job seekers use to find positions matching their skills and preferences. This criteria-based search framework supports distance filters, keyword search, and configurable result displays on the public career portal.","Job postings include posting keywords that feed into the Einstein Search Retriever for the Job Recommendation Agent. The Agentforce Job Recommendation agent uses RAG to match recruitment postings to applicant profiles based on education, work experience, competencies, and location preferences, providing personalized job suggestions through the Applicant Portal chat interface."],connections: [
        { planet: "experience_cloud", desc: "Job postings are published on the career site for applicants" },
        { planet: "agentforce", desc: "Agentforce recommends matching job postings to applicants" }
      ]
    },
    {
      id: "applicant-evaluation",
      name: "Applicant Evaluation",
      icon: "\u{1F9D1}",
      desc: "Manages the application screening, evaluation, and hiring decision process. Creates application form evaluations for hiring managers and interviewers, with Dynamic Assessment action plans for structured feedback. Supports compliant data sharing between participants.",
      tags: ["ApplicationFormRelation", "ApplicationFormEvalPtcp"],
      docs:["Applicant Evaluation manages the screening, assessment, and hiring decision process for job applications. The ApplicationFormRelation object links application forms to recruitment postings and requisitions, while ApplicationFormEvalPtcp tracks evaluation participants including hiring managers and interviewers who are assigned to review specific applications.","Dynamic Assessment action plans provide structured evaluation questionnaires for hiring managers and interviewers. The assessments capture standardized feedback on applicant qualifications, interview performance, and fit for the position. Compliant data sharing ensures that evaluation results are only visible to authorized participants in the hiring process.","The Application Screening agent topic in Agentforce assists recruiters by generating structured summaries of application forms that include applicant overview, work experience, qualifications, education, examinations, certifications, competencies, and vetting outcomes. Recruiters can use the agent to summarize applications and share shortlisted candidates with hiring managers for further review."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_recruitment_multi_section_applications.htm&type=5&language=en_US",connections: [
        { planet: "common_features", desc: "Dynamic Assessments power applicant evaluation questionnaires" },
        { planet: "agentforce", desc: "Agentforce summarizes applications and assists with screening" }
      ]
    },
    {
      id: "vetting-evaluations",
      name: "Vetting Evaluations",
      icon: "\u{1F50D}",
      desc: "Administers background checks, health examinations, reference checks, and other vetting procedures for selected applicants. Uses Dynamic Assessments with action plan templates specific to each vetting type, tracking outcomes as approved, rejected, or flagged.",
      tags: ["VettingEvaluation", "Examination", "PersonExamination", "CourseOffering"],
      docs:["Vetting Evaluations administer background checks, health examinations, reference checks, and other vetting procedures for selected applicants. The VettingEvaluation object tracks each evaluation with outcomes recorded as approved, rejected, or flagged. The Examination and PersonExamination objects store examination details and individual results, while CourseOffering manages training requirements.","Dynamic Assessments with action plan templates are used for each vetting type, providing structured checklists that evaluators follow to ensure consistent and thorough background screening. The assessment captures results for employment verification, education verification, criminal background checks, reference checks, and other job-specific evaluations.","The Skill-Based Candidate Sourcing agent topic in Agentforce leverages examination and competency data from vetting records. PersonCompetency and PersonExamination objects provide the skill and qualification data that the agent uses to match candidates to job requirements, enabling recruiters to find qualified candidates based on verified skills and certifications."],connections: [
        { planet: "setup_and_security", desc: "Vetting requires specialized permission sets and security controls" },
        { planet: "agentforce", desc: "Skill-Based Candidate Sourcing uses examination and competency data" }
      ]
    },
    {
      id: "employment-offers",
      name: "Employment Offers",
      icon: "\u{1F4E9}",
      desc: "Creates tentative and final employment offers for applicants who pass evaluation and vetting. Links offers to vetting evaluations to confirm clearance before final offer rollout. Tracks offer type, status, and acceptance.",
      tags: ["EmploymentOffer", "EmploymentOfferVettingEval"],
      docs:["Employment Offers create tentative and final offers for applicants who pass evaluation and vetting stages. The EmploymentOffer object tracks offer details including type, status, compensation, and acceptance. The EmploymentOfferVettingEval junction object links offers to completed vetting evaluations, confirming that all required clearances are obtained before the final offer is extended.","The offer workflow supports a two-stage process: tentative offers are created pending final vetting completion, and final offers are rolled out after all background checks, health examinations, and reference checks are cleared. Offer status tracking enables HR specialists to monitor the progression from tentative to final offer and through to acceptance or decline.","Applicants can view employment offers on the Career Site Experience Cloud portal, where they can review offer details and respond. Accepted offers transition the applicant into the employee lifecycle, leading to record creation in the Employee Experience system and the initiation of onboarding processes."],connections: [
        { planet: "employee_experience", desc: "Accepted offers lead to employee record creation and onboarding" },
        { planet: "experience_cloud", desc: "Applicants view employment offers on the career site" }
      ]
    },
    {
      id: "recruitment-search",
      name: "Recruitment Search",
      icon: "\u{1F50E}",
      desc: "Criteria-based search experiences for recruiters and job seekers. Compiles job application data and job posting data into searchable objects via Data Processing Engine definitions. Configurable search criteria, result fields, and actions.",
      tags: [],
      docs:["Recruitment Search provides criteria-based search experiences for both recruiters and job seekers. The Data Processing Engine compiles job application data and job posting data into searchable objects, creating searchable field records that support fast filtering by criteria such as skills, location, education, and experience level.","For job seekers, the Career Site home page features a search interface powered by the Criteria-Based Search and Filter framework. Applicants can search for positions matching their qualifications and preferences, with configurable search criteria, result fields, and actions that agencies can customize to match their recruitment process.","For recruiters, the search framework enables searching across the applicant pool to find candidates matching specific requisition requirements. The searchable objects consolidate data from multiple source records into a single indexed format, supporting the same criteria-based filtering capabilities used in provider search and other PSS search features."],connections: [
        { planet: "experience_cloud", desc: "Job posting search is available on the career site home page" },
        { planet: "common_features", desc: "Criteria-Based Search and Filter framework powers all recruitment search" }
      ]
    }
  ],
  dataFlow: [
    "HR staff define occupation groups, occupations, positions, pay grades, and job positions",
    "Recruiters create requisitions, link them to job positions, and submit for hiring manager approval",
    "Approved requisitions generate job postings published on the career site via Data Processing Engine",
    "Job seekers search, apply, and submit applications through guided flows on the career site",
    "Hiring managers and interviewers evaluate applicants using Dynamic Assessments on the employee site",
    "HR specialists conduct vetting evaluations and roll out employment offers to cleared applicants"
  ],
  connections: [
    { planet: "experience_cloud", desc: "Career site for applicants and employee site for hiring managers" },
    { planet: "agentforce", desc: "AI agents assist with candidate sourcing and application screening" },
    { planet: "common_features", desc: "Dynamic Assessments and Criteria-Based Search power recruitment" },
    { planet: "employee_experience", desc: "Accepted offers lead to employee onboarding" },
    { planet: "setup_and_security", desc: "Compliant data sharing controls access to recruitment records" },
    { planet: "data_360", desc: "Applicant and employee data unifies in Data 360 for analytics" }
  ]
},

agentforce: {
  packages: ['core'],
  name: "Agentforce",
  icon: "\u{1F916}",
  color: "#6366f1",
  description: "AI-powered agents built on the Agentforce platform that assist public sector caseworkers, recruiters, and constituents. Includes pre-built agent topics for candidate sourcing from past applications and skills, job recommendation for applicants, recruitment FAQ assistance, complaint intake automation, and complaint management summarization. Agents leverage Einstein Search Retrievers, prompt templates, and purpose-built flows to deliver contextual AI assistance.",
  components: [
    {
      id: "candidate-sourcing-agent",
      name: "Candidate Sourcing Agent",
      icon: "\u{1F50D}",
      desc: "Helps recruiters find qualified candidates from past applications. Filters applications by stage and requisition, creates candidate leads, and sends personalized outreach emails. Includes both standard and skill-based sourcing topics.",
      tags: ["ApplicationForm", "ApplicationFormRelation", "Lead", "PartyProfile", "PersonCompetency", "PersonExamination"],
      docs:["The Candidate Sourcing Agent helps recruiters find qualified candidates from past applications. It includes two agent topics: Candidate Sourcing, which filters applications by stage and requisition to identify potential matches, and Skill-Based Candidate Sourcing, which uses PersonCompetency and PersonExamination data to match candidates by specific skills and certifications.","The agent's workflow includes getting relevant application forms or skill IDs, retrieving candidate accounts that match the criteria, creating Lead records for shortlisted candidates, and sending personalized outreach emails with links to the career site. The Email Candidate Leads flow uses the Send Email action with a configurable email template that includes the career site URL.","Key flows include Get Relevant Application Forms for filtering by stage and requisition, Get Candidate Accounts for Given Skills for skill matching, Create Candidate Leads for lead generation, and Get Exam and Competency Details for Skills which uses an Einstein Search Retriever with an ensemble retriever combining Competency and Examination object indexes."],connections: [
        { planet: "talent_recruitment", desc: "Sources candidates from recruitment requisitions and past applications" },
        { planet: "experience_cloud", desc: "Outreach emails link candidates to the career site" }
      ]
    },
    {
      id: "job-recommendation-agent",
      name: "Job Recommendation Agent",
      icon: "\u{2B50}",
      desc: "AI assistant on the Applicant Portal that provides personalized job recommendations based on applicant profiles, education, work experience, and location preferences. Uses Einstein Search Retriever with RAG to match recruitment postings.",
      tags: ["RecruitmentPosting", "PartyProfileAddress", "PersonEducation", "PersonEmployment"],
      docs:["The Job Recommendation Agent is an AI-powered assistant deployed on the Applicant Portal via Embedded Messaging. It provides personalized job recommendations based on applicant profiles including education (PersonEducation), work experience (PersonEmployment), competencies (PersonCompetency), and location preferences (PartyProfileAddress with type Current).","The agent uses Einstein Search Retriever with Retrieval Augmented Generation (RAG) to find matching RecruitmentPosting records. The Find Matching Recruitment Postings prompt template uses the configured retriever with applicant keywords as search input. The Get Recommended Job Positions flow orchestrates the recommendation process and formats results as clickable cards with title, location, skill match, and application links.","Additional actions include Get User's Current City which retrieves the applicant's location from their Party Profile Address record, and Get Matching Job Locations which filters postings by distance from the applicant's city. The agent requires credential-based user verification in the Embedded Messaging component to identify logged-in applicants and access their profile data."],connections: [
        { planet: "talent_recruitment", desc: "Recommends matching recruitment postings to applicants" },
        { planet: "experience_cloud", desc: "Deployed as Embedded Messaging on the Applicant Portal" }
      ]
    },
    {
      id: "recruitment-faq-agent",
      name: "Recruitment FAQ Agent",
      icon: "\u{2753}",
      desc: "Answers candidate questions about agency culture, hiring timelines, and mission statements using RAG with the Agentforce Data Library. Designed for unauthenticated guest users on the career portal with source citation grounding.",
      tags: [],
      docs:["The Recruitment FAQ Agent answers candidate questions about agency culture, hiring timelines, and mission statements using Retrieval Augmented Generation (RAG) with the Agentforce Data Library. The agent is designed for unauthenticated guest users on the public career portal, providing generic information without accessing personal applicant data.","The agent uses a single action, Answer General Company Questions, which leverages Data Cloud's RAG capabilities to search through uploaded policy manuals, FAQ documents, and mission statements in the Agentforce Data Library. Results include Source Citations showing the specific document and section used to generate each answer, ensuring transparency and traceability.","Setup requires uploading agency recruitment policy documents to a new Data Library, creating an agent from the Agentforce Service Agent template with the Recruitment FAQ topic, and deploying it via Embedded Messaging on the career portal with an inbound Omni-Channel flow. The system must fully index uploaded documents before the agent can use them for answering questions."],connections: [
        { planet: "talent_recruitment", desc: "Assists applicants with recruitment-related questions" },
        { planet: "experience_cloud", desc: "Available to guest users on the career portal" }
      ]
    },
    {
      id: "complaint-intake-agent",
      name: "Complaint Intake Agent",
      icon: "\u{1F4AC}",
      desc: "Guides constituents through filing complaints on the self-service portal. Checks agency authority, extracts complaint details, detects duplicate submissions, generates AI summaries for review, and sends email acknowledgments.",
      tags: ["PublicComplaint"],
      docs:["The Complaint Intake Agent guides constituents through filing complaints on the self-service portal using a conversational interface. The agent checks whether the agency has authority to handle the complaint (Check Complaint Authority action), extracts complaint details, detects duplicate submissions by checking unresolved complaints (Get Constituent's Unresolved Complaints), and generates AI summaries for constituent review.","The agent's conversation flow begins with a brief issue description, authority verification, detailed information gathering, AI-generated complaint summary for review and correction, duplicate detection, final confirmation, complaint record creation (Create Complaint action), and email acknowledgment (Email Complaint Acknowledgment). The Summarize Complaint for Constituent action uses generative AI to create an interactive preview.","Safety handling requires configuring an Inappropriate_Content topic that intercepts sensitive complaints involving violence, abuse, or illegal activity and routes them to the Escalation topic for human handoff. The agent's authority-checking capability is powered by policy manuals uploaded to an Agentforce Data Library, with the retriever ID configured in the topic instructions."],connections: [
        { planet: "investigative_cases", desc: "Creates complaint records that feed into investigative case management" },
        { planet: "experience_cloud", desc: "Deployed on the Benefit Assistance self-service site" }
      ]
    },
    {
      id: "complaint-management-agent",
      name: "Complaint Management Agent",
      icon: "\u{1F4C3}",
      desc: "Assists complaint intake officers in handling high volumes by summarizing complaint information, finding similar past complaints, flagging potential regulatory code violations, administering compliance assessments, and notifying relevant parties.",
      tags: [],
      docs:["The Complaint Management Agent assists complaint intake officers in handling high volumes through two agent topics: Complaint Resolution and Complaint-to-Case Conversion. The Complaint Resolution topic helps officers prioritize complaints using calculated resolution priority scores, summarize complaint information, find similar past complaints, identify regulatory code breaches, and notify relevant parties.","The Complaint-to-Case Conversion topic streamlines the process of converting public complaints into official investigative cases. The agent finds similar open cases with common perpetrators, links complaints to existing cases or creates new ones, and transfers participants, custody items, and regulatory code violations from the complaint to the linked case record.","Complaint resolution priority is calculated using a Business Rules Engine expression set (Calculate Public Complaint Score) that evaluates priority and completeness levels on a 100-point weighted scale. The Update Complaint Summary and Resolution Priority flow triggers when complaints are created or modified, automatically calculating and storing the resolution priority for officer review."],connections: [
        { planet: "investigative_cases", desc: "Supports intake officers in screening and assessing complaints" },
        { planet: "einstein_ai", desc: "Leverages Einstein generative AI for complaint summarization" }
      ]
    }
  ],
  dataFlow: [
    "Administrators enable Agentforce and configure agent topics with purpose-built flows and prompt templates",
    "Einstein Search Retrievers are configured to index relevant objects for RAG-powered responses",
    "Agents are created from Employee or Service Agent templates and assigned relevant topics",
    "Permission sets are created and assigned to grant users access to specific agents",
    "Agents are deployed to Lightning Experience panels or Experience Cloud sites via Embedded Messaging",
    "Users interact with agents through conversational utterances to source candidates, file complaints, or get recommendations"
  ],
  connections: [
    { planet: "talent_recruitment", desc: "Candidate sourcing and job recommendation agents support recruitment" },
    { planet: "investigative_cases", desc: "Complaint intake and management agents support investigations" },
    { planet: "experience_cloud", desc: "Agents are deployed on Experience Cloud portals" },
    { planet: "einstein_ai", desc: "Agents use Einstein generative AI for summaries and content generation" },
    { planet: "setup_and_security", desc: "Agent access is controlled through permission sets" }
  ,
    { planet: "common_features", desc: "Agent actions leverage Business Rules Engine and OmniStudio" },
    { planet: "licensing_and_permitting", desc: "Application Assistance agent for permit inquiries" },
    { planet: "inspections", desc: "Inspection scheduling and status agent topics" },
    { planet: "employee_experience", desc: "IT Service agent for employee self-service" }
  ]
},

einstein_ai: {
  packages: ['core'],
  name: "Einstein Generative AI",
  icon: "\u{1F9E0}",
  color: "#2563eb",
  description: "Einstein generative AI features for Public Sector Solutions that provide AI-powered summaries, comparisons, and content generation across multiple functional areas. Built-in prompt templates and template-triggered flows generate application history overviews, household overviews, license compliance summaries, prior violation reports, funding award summaries, notes summaries, and program benefits summaries. Uses grounding data from Salesforce objects with the Einstein Summary component on record pages.",
  components: [
    {
      id: "benefit-ai-features",
      name: "Benefit Management AI",
      icon: "\u{1F4C8}",
      desc: "Generates application history overviews showing key dates, status, and assessment outlines. Compares application versions to identify changes in constituent responses. Creates household overviews summarizing member details, income, and benefits.",
      tags: ["IndividualApplication", "Assessment", "BenefitAssignment", "BenefitDisbursement"],
      docs:["Benefit Management AI generates application history overviews showing key dates, application status, and assessment outlines for caseworkers reviewing benefit applications. The feature uses prompt templates and template-triggered flows that analyze grounding data from IndividualApplication, Assessment, BenefitAssignment, and BenefitDisbursement objects.","Application version comparison identifies changes between constituent submissions, helping caseworkers spot updates to responses and supporting documentation. Household overviews summarize member details, income sources, expenses, and currently assigned benefits, providing a comprehensive snapshot of the applicant's financial situation for eligibility review.","The Einstein Summary component is added to relevant record pages with the appropriate prompt templates. Users invoke AI features from the record page, and Einstein analyzes related object data to generate summaries that can be reviewed, edited, copied, and saved to designated record fields for future reference. All features are limited to 100 related records as grounding data."],connections: [
        { planet: "benefit_management", desc: "AI features summarize benefit applications and household data" },
        { planet: "social_programs", desc: "Program enrollment data grounds the household overview" }
      ]
    },
    {
      id: "compliance-ai-features",
      name: "Compliance & Inspection AI",
      icon: "\u{1F50D}",
      desc: "Generates license compliance summaries showing expired permits, pending verifications, outstanding violations, and regulatory fees. Creates prior violation reports from inspection visit history to identify repeated violations and focus areas.",
      tags: ["BusinessLicense", "RegulatoryCodeViolation", "Visit"],
      docs:["Compliance and Inspection AI generates license compliance summaries that show expired permits, pending verifications, outstanding violations, and regulatory fees for a given account or license holder. The feature analyzes data from BusinessLicense, RegulatoryCodeViolation, and Visit objects to create comprehensive compliance profiles that help licensing officers make informed decisions.","Prior violation reports summarize inspection visit history to identify repeated violations and focus areas for future inspections. By analyzing historical Visit and RegulatoryCodeViolation data, the AI highlights patterns of noncompliance, helping compliance officers prioritize enforcement actions and allocate inspection resources more effectively.","Both features use the Einstein Summary component on record pages with purpose-built prompt templates. Administrators enable Einstein generative AI, assign the Prompt Template Manager permission set, and configure the summary components on the appropriate record pages. Generated reports can be saved to record fields for auditing and compliance documentation purposes."],connections: [
        { planet: "licensing_and_permitting", desc: "License compliance summaries analyze permit and license data" },
        { planet: "inspections", desc: "Prior violation reports summarize inspection visit histories" }
      ]
    },
    {
      id: "grantmaking-ai-features",
      name: "Grantmaking AI",
      icon: "\u{1F4B0}",
      desc: "Generates board versions of grant applications for reviewer consumption and funding award summaries showing milestone progress, requirement fulfillment, and disbursement status. Helps program officers make informed funding decisions.",
      tags: ["FundingAward", "FundingOpportunity", "FundingDisbursement"],
      docs:["Grantmaking AI generates board versions of grant applications for reviewer consumption, transforming detailed application data into concise summaries suitable for review committees and board members. The feature analyzes FundingOpportunity and ApplicationForm data to produce structured overviews that highlight key application elements.","Funding award summaries show milestone progress, requirement fulfillment, and disbursement status for active grants. By analyzing FundingAward, FundingAwardRequirement, and FundingDisbursement data, the AI provides program officers with a comprehensive view of grant performance to support informed funding decisions and identify awards that may need attention.","The AI features support the full grant lifecycle from application review through post-award monitoring. Board versions help streamline the application evaluation process, while funding award summaries ensure ongoing oversight of grant recipients' progress against their commitments and deliverables."],connections: [
        { planet: "grantmaking", desc: "AI features summarize grant applications and funding awards" },
        { planet: "agentforce", desc: "Agentforce agents can leverage Einstein AI for grant-related queries" }
      ]
    },
    {
      id: "case-notes-ai",
      name: "Notes & Program Summaries",
      icon: "\u{1F4DD}",
      desc: "Einstein Notes Summary helps case managers quickly absorb constituent information from interaction summaries. Program Benefits Summary drafts program progress updates for stakeholders. Both features are limited to 100 related records as grounding data.",
      tags: ["InteractionSummary"],
      docs:["Einstein Notes Summary helps case managers quickly absorb constituent information from interaction summaries. The feature analyzes InteractionSummary records related to a case or constituent, synthesizing key details from multiple interactions into a cohesive summary that saves case managers time when reviewing complex cases with extensive interaction histories.","Program Benefits Summary drafts program progress updates for stakeholders by analyzing benefit enrollment, disbursement, and outcome data. The summaries describe how programs are performing and what benefits have been delivered, helping program managers communicate progress to leadership, funding bodies, and other stakeholders.","Both features are limited to 100 related records as grounding data and use the Einstein Summary component on record pages. Users can edit and copy generated content before saving it to designated fields. The Prompt Template Manager permission set is required for administrators who configure the AI features, while standard users need appropriate prompt template access permissions."],connections: [
        { planet: "investigative_cases", desc: "Notes summaries support investigative case management" },
        { planet: "social_programs", desc: "Program summaries describe benefit program progress to stakeholders" }
      ]
    }
  ],
  dataFlow: [
    "Administrators enable Einstein generative AI and assign permission sets including Prompt Template Manager",
    "Einstein Summary components are added to relevant record pages with appropriate prompt templates",
    "Users invoke AI features from record pages, and Einstein analyzes grounding data from related objects",
    "Generated summaries, comparisons, or reports are displayed for review with edit and copy options",
    "Users can save AI-generated content to designated record fields for future reference"
  ],
  connections: [
    { planet: "benefit_management", desc: "Application history and household overviews for benefit management" },
    { planet: "licensing_and_permitting", desc: "License compliance summaries for permit tracking" },
    { planet: "inspections", desc: "Prior violation reports for inspection management" },
    { planet: "investigative_cases", desc: "Notes summaries for investigative case managers" },
    { planet: "grantmaking", desc: "Board versions and funding award summaries for grantmaking" },
    { planet: "agentforce", desc: "Agentforce agents leverage Einstein AI capabilities" },
    { planet: "setup_and_security", desc: "Einstein generative AI requires specific permission sets and add-on licenses" }
  ,
    { planet: "data_360", desc: "Data Cloud provides grounding data for AI models" }
  ]
},


data_360: {
  packages: ['core'],
  name: "Data 360",
  icon: "\u{1F300}",
  color: "#0d9488",
  description: "Integrates Public Sector Solutions data with external data sources through the Salesforce Data Cloud platform to create comprehensive constituent and employee profiles. Data 360 provides predefined data streams, data model object mappings, and a PSS Data Kit that maps over 100 PSS objects to the Data Cloud data model. Agencies can unify eligibility data from multiple systems, aggregate applicant history with employee performance data, and consolidate investigative case information from other agencies for efficient analysis and AI-driven insights.",
  components: [
    {id:"pss-data-kit",name:"PSS Data Kit",icon:"\u{1F4E6}",desc:"A prebuilt package of Data Cloud components including data model objects and data streams that maps PSS objects to the Data Cloud data model. Install the data kit in the Data Cloud org to access predefined object mappings and deploy data streams for near real-time data ingestion from Public Sector Solutions.",tags:["Account","Contact","Individual"],docs:["The PSS Data Kit is a prebuilt package of Data Cloud components that maps Public Sector Solutions objects to the Data Cloud data model. The kit includes data model objects and data streams that enable near real-time data ingestion from PSS orgs. Installing the data kit in the Data Cloud org provides predefined object mappings that streamline the integration process.","Setup begins with assigning Data 360 Architect and Data 360 User permission sets, then connecting the Salesforce org to Data Cloud through the Standard Connections interface. The PSS Data Kit maps over 100 PSS objects including Account, Contact, Individual, IndividualApplication, BenefitDisbursement, Case, and Visit to corresponding Data Cloud data model objects.","The data kit supports multiple PSS functional areas by providing mappings for benefit management, social programs, investigative cases, licensing, inspections, and talent recruitment objects. After installation, administrators configure object and field permissions for PSS objects in the Data Cloud Salesforce Connector to control which data flows into Data Cloud."],connections:[{planet:"setup_and_security",desc:"Requires Data Cloud Admin permissions and connector setup"},{planet:"benefit_management",desc:"Maps benefit and application objects for eligibility analysis"}]},
    {id:"data-streams-mapping",name:"Data Streams & Mapping",icon:"\u{1F504}",desc:"Predefined data streams that enable near real-time data flow from PSS orgs to Data Cloud. Each stream maps source objects like IndividualApplication, BenefitDisbursement, Case, and Visit to corresponding Data Cloud model objects. Streams can be extended or customized to include additional fields and objects.",tags:["IndividualApplication","BenefitDisbursement","Case","Visit"],docs:["Data Streams and Mapping enable near real-time data flow from PSS orgs to Data Cloud through predefined data streams. Each stream maps source objects like IndividualApplication, BenefitDisbursement, Case, and Visit to corresponding Data Cloud model objects. Streams can be extended or customized to include additional fields and objects beyond the default mappings.","Data stream deployment is managed through the Data Cloud interface where administrators create new data streams, select the Salesforce CRM source, choose the connected org, and select the appropriate data bundle (such as the Grantmaking Data Bundle or PSS Data Bundle). The streams are deployed to a selected Data Space and begin ingesting data immediately.","The predefined streams cover the core PSS data model, but agencies can create additional streams for custom objects or fields that are specific to their implementation. This extensibility ensures that Data Cloud captures all relevant agency data for unified analysis, AI-driven insights, and comprehensive constituent profiles."],connections:[{planet:"social_programs",desc:"Streams ingest program enrollment and referral data for analysis"},{planet:"investigative_cases",desc:"Aggregates case and complaint data from multiple agencies"}]},
    {id:"external-data-ingestion",name:"External Data Ingestion",icon:"\u{1F310}",desc:"Connects external data sources to Data Cloud using prebuilt connectors, the Ingestion API, or MuleSoft. Enables agencies to bring in past case and complaint data from other agencies, employee performance history from HR systems, and eligibility data from external benefit systems for unified analysis.",tags:["Account","Contact"],docs:["External Data Ingestion connects data sources outside Salesforce to Data Cloud using prebuilt connectors, the Ingestion API, or MuleSoft integration. This capability enables agencies to bring in past case and complaint data from other agencies, employee performance history from external HR systems, and eligibility data from external benefit management systems.","The integration supports multiple external platforms including Marketing Cloud, Commerce Cloud, Snowflake, Amazon S3, and Google Cloud Storage through the Connectors Guidance in Data Cloud. Each connector type has specific configuration requirements, but all feed into the unified Data Cloud model for analysis alongside native PSS data.","External data ingestion is particularly valuable for cross-agency investigations where case data from multiple jurisdictions needs to be consolidated, workforce analytics that combine applicant history with employee performance from external HR systems, and provider credentialing where external provider data needs to be matched with internal records."],connections:[{planet:"talent_recruitment",desc:"Aggregates applicant history with employee performance from external HR systems"},{planet:"provider_management",desc:"Ingests provider data from external credentialing systems"}]},
    {id:"analytics-ai-insights",name:"Analytics & AI-Driven Insights",icon:"\u{1F4A1}",desc:"Leverages unified data profiles for predictive modeling, resource optimization, and personalized service delivery. Includes data unification for comprehensive constituent profiles, segmentation for targeted outreach, and AI model integration for proactive engagement with constituents and employees.",tags:["Account","Contact","Individual"],docs:["Analytics and AI-Driven Insights leverage unified Data Cloud profiles for predictive modeling, resource optimization, and personalized service delivery. Data unification creates comprehensive constituent profiles by merging records from multiple sources, resolving duplicates, and building a single view of each individual across all agency interactions.","Segmentation capabilities enable targeted outreach by grouping constituents based on shared characteristics, needs, or risk factors. Agencies can create segments for proactive engagement, such as identifying constituents who may be eligible for additional benefits or those at risk of losing coverage due to upcoming recertification deadlines.","AI model integration through Einstein AI uses the unified data to power predictive insights and generative summaries. The enriched profiles feed into CRM Analytics dashboards for deeper analysis, and the combined internal and external data provides the grounding context needed for accurate AI predictions and personalized constituent interactions."],connections:[{planet:"einstein_ai",desc:"Unified data powers Einstein AI predictions and generative summaries"},{planet:"crm_analytics",desc:"Enriched data feeds CRM Analytics dashboards for deeper insights"}]}
  ],
  dataFlow: [
    "Connect PSS Salesforce org to Data Cloud and install the PSS Data Kit",
    "Enable object and field permissions for PSS objects in the Data Cloud Salesforce Connector",
    "Deploy predefined data streams to begin near real-time data ingestion",
    "Connect external data sources using prebuilt connectors or Ingestion API",
    "Unify source profiles and create comprehensive constituent and employee records",
    "Apply AI models and segmentation for predictive insights and personalized services"
  ],
  connections: [
    {planet:"setup_and_security",desc:"Data Cloud configuration and connector permissions"},
    {planet:"benefit_management",desc:"Unifies eligibility data from multiple benefit systems"},
    {planet:"investigative_cases",desc:"Aggregates case data from multiple agencies for analysis"},
    {planet:"talent_recruitment",desc:"Combines applicant and employee performance data"},
    {planet:"einstein_ai",desc:"Unified data enhances AI predictions and summaries"},
    {planet:"crm_analytics",desc:"Enriched profiles power analytics dashboards"},
    {planet:"grantmaking",desc:"Grantmaking data bundle maps grant objects to Data Cloud"}
  ]
},

experience_cloud: {
  packages: ['core'],
  name: "Experience Cloud",
  icon: "\u{1F310}",
  color: "#d946ef",
  description: "Provides constituent-facing and employee-facing portals built on Experience Cloud site templates. Public Sector Solutions includes seven prebuilt templates: Benefit Assistance for benefit applications and complaint intake, Licenses and Permits for license lifecycle management, Career Site for job seekers, Emergency Response Site for crisis assistance, Employee Site for hiring managers and interviewers, Grantmaking for funding opportunity applications and reviews, and Service Provider Portal for provider collaboration. Each template includes preconfigured pages, Lightning components, and permission sets.",
  components: [
    {id:"benefit-assistance-site",name:"Benefit Assistance Site",icon:"\u{1F3E5}",desc:"An Experience Cloud site template where constituents can apply for benefits, view and file complaints, access care plans and tasks, and report changes of circumstances. Also serves as the complaint intake portal for justice and investigative case management use cases.",tags:["IndividualApplication","PublicComplaint","CarePlan"],docs:["The Benefit Assistance Site is an Experience Cloud template where constituents can apply for benefits, view and file complaints, access care plans and tasks, and report changes of circumstances. The site also serves as the complaint intake portal for justice and investigative case management use cases, hosting the CaseProceeding/ComplaintIntake Omniscript.","Key features include the Benefit Finder for prescreening eligibility, benefit application forms powered by OmniStudio, complaint filing through guided flows, change of circumstances reporting, benefit recertification, and care plan visibility. The site integrates with the Agentforce Complaint Intake Agent for AI-assisted complaint filing and the Job Recommendation Agent for recruitment scenarios.","The site requires configuration of sharing settings for objects like Assessment, Assessment Question, Omni Data Transformation, Regulatory Authority, and Regulatory Authorization Type to enable community users to access the necessary data. The Benefit_Management_Constituent and Investigative_Case_Management_Constituent permission set groups provide appropriate access levels for portal users."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_benefit_assistance_comm_settings.htm&language=en_US&type=5",connections:[{planet:"benefit_management",desc:"Constituents submit benefit applications through the portal"},{planet:"social_programs",desc:"Portal displays program enrollment and care plan information"}]},
    {id:"licenses-permits-site",name:"Licenses & Permits Site",icon:"\u{1F4DC}",desc:"Enables constituents to assess license or permit needs, apply for and renew licenses and permits, search for license or permit holders, file and view complaints, and review their inspection history. Provides self-service for the full licensing lifecycle.",tags:["BusinessLicenseApplication","BusinessLicense","PublicComplaint"],docs:["The Licenses and Permits Site enables constituents to assess license or permit needs, apply for and renew licenses and permits, search for license holders, file and view complaints, and review their inspection history. The site provides self-service capabilities for the full licensing lifecycle from initial application through renewal.","The site template includes preconfigured pages for BusinessLicenseApplication submission, BusinessLicense viewing, PublicComplaint filing, and inspection history display. The Permits component shows required authorizations based on business type, and the Inspection History component provides transparency into past visits, violations, and enforcement actions.","The Licensing_Permitting_Constituent permission set group provides portal users with access to licensing objects and features. The site integrates with OmniStudio guided flows for application submission and with Business Rules Engine for fee calculation, creating a seamless self-service experience for constituents managing their regulatory compliance."],connections:[{planet:"licensing_and_permitting",desc:"Self-service portal for the full license and permit lifecycle"},{planet:"inspections",desc:"Constituents can view their inspection history through the portal"}]},
    {id:"career-and-employee-sites",name:"Career & Employee Sites",icon:"\u{1F464}",desc:"Two templates supporting talent recruitment: the Career Site lets job seekers search and apply for positions matching their preferences and track applications, while the Employee Site enables hiring managers and interviewers to review requisitions, approve job postings, and evaluate assigned applicants.",tags:["RecruitmentPosting","RecruitmentRequisition","JobPosition"],docs:["Career and Employee Sites comprise two Experience Cloud templates supporting talent recruitment. The Career Site lets job seekers search for positions using the criteria-based search framework, view detailed job postings, apply through guided OmniScript flows, and track their application status. The Employee Site enables hiring managers to review requisitions, approve job postings, and evaluate assigned applicants.","The Career Site includes the Job Recommendation Agent deployed via Embedded Messaging, providing AI-powered job suggestions based on applicant profiles. The Recruitment FAQ Agent is also available for unauthenticated guest users to answer questions about agency culture and hiring processes. Data Processing Engine populates searchable fields that power the career site search experience.","The Employee Site provides hiring managers and interviewers with a user-friendly interface to evaluate applicants using Dynamic Assessments. The Talent_Recruitment_Management_Hiring_Manager permission set group controls access for hiring managers, while Talent_Recruitment_Management_Employee covers interviewers and internal applicants."],connections:[{planet:"talent_recruitment",desc:"Public-facing job search and internal hiring manager workflows"},{planet:"employee_experience",desc:"Employee portal integrates with HR Service and PSS capabilities"}]},
    {id:"grantmaking-site",name:"Grantmaking Site",icon:"\u{1F4B8}",desc:"A portal where grantmakers post and manage funding opportunities and grantseekers apply for and report on grants. External reviewers can assess applications through the site. Includes preconfigured Grantmaking objects, budget management components, and outcome reporting.",tags:["FundingOpportunity","ApplicationForm","FundingAward"],docs:["The Grantmaking Site is an Experience Cloud portal where grant makers post and manage funding opportunities and grant seekers apply for and report on grants. External reviewers can assess applications through the site using Form Framework workspaces. The template includes preconfigured Grantmaking objects, budget management components, and outcome reporting features.","Grant seekers discover funding opportunities, submit applications with proposed budgets using the Budget component, upload supporting documents, and report on grant outcomes through the portal. The Application Form object with Form Framework supports multiphase and multi-section application forms with conditional logic powered by OmniStudio.","The Grantmaking for Experience Cloud permission set provides site users with access to Grantmaking objects and features. Compliant Data Sharing enables grant seekers to add collaborators for application assistance, grant managers to restrict private funding opportunities to specific applicants, and grantees to be added as collaborators for funding award management."],connections:[{planet:"grantmaking",desc:"Online portal for the full grant application and reporting lifecycle"}]},
    {id:"emergency-provider-sites",name:"Emergency & Provider Sites",icon:"\u{26A1}",desc:"Two specialized templates: the Emergency Response Site highlights emergency programs and allows constituents to request permits and assistance during crises, while the Service Provider Portal enables providers to process referral requests, track service delivery, manage their information, and collaborate with agencies.",tags:["Visit","Referral"],docs:["Emergency and Provider Sites are two specialized Experience Cloud templates. The Emergency Response Site highlights emergency programs and services available during crises, allowing constituents to request permits for building access, apply for assistance programs like food delivery services, and receive real-time incident updates and emergency program information.","The Service Provider Portal enables providers to process incoming referral requests, track service delivery and attendance, manage their organizational information, and collaborate with agencies. The portal includes preconfigured pages for client management, schedule creation, and attendance recording, all built on the Provider Management data model.","Both sites use preconfigured Lightning components and permission sets tailored to their specific use cases. The Emergency Response Site integrates with licensing workflows for emergency permit applications and with the mobile Inspection app for compliance verification, while the Provider Portal connects to the benefit management system for disbursement tracking."],connections:[{planet:"emergency_and_assets",desc:"Emergency portal for crisis-time applications and assistance"},{planet:"provider_management",desc:"Providers manage referrals and service delivery through the portal"}]}
  ],
  dataFlow: [
    "Administrator selects an Experience Cloud site template matching the agency use case",
    "Template deploys preconfigured pages, Lightning components, and permission sets",
    "Site is customized with agency branding, content, and workflow rules",
    "Constituents or employees access the portal to submit applications and track status",
    "Portal data flows into PSS objects for processing by caseworkers and administrators"
  ],
  connections: [
    {planet:"licensing_and_permitting",desc:"Self-service license and permit applications"},
    {planet:"benefit_management",desc:"Constituent portal for benefit applications and complaints"},
    {planet:"talent_recruitment",desc:"Career site for job seekers and employee site for hiring managers"},
    {planet:"grantmaking",desc:"Grant application portal for seekers and reviewers"},
    {planet:"emergency_and_assets",desc:"Emergency response portal for crisis assistance"},
    {planet:"provider_management",desc:"Service provider collaboration portal"},
    {planet:"employee_experience",desc:"Employee portal for HR service and PSS capabilities"}
  ]
},

crm_analytics: {
  packages: ['core'],
  name: "CRM Analytics",
  icon: "\u{1F4CA}",
  color: "#84cc16",
  description: "Prebuilt analytics apps and dashboards that provide intelligent insights into licensing, permitting, inspections, caseloads, and community impact. Public Sector Solutions includes the Analytics for Licenses, Permits, and Inspections app with compliance, executive, department, and account insights dashboards, and the Caseworker Productivity app with workload management, SLA tracking, benefit disbursement, and case analytics. All dashboards support standard and custom objects, external data, and up to 10 billion rows with CRM Analytics Plus.",
  components: [
    {id:"license-permit-analytics",name:"License, Permit & Inspection Analytics",icon:"\u{1F50D}",desc:"Four dashboards providing agency-wide insights: Compliance Insights tracks inspection impact on violations, Executive Summary monitors application trends and fee revenue, Department Summary identifies applications and inspections needing attention, and Account Insights shows the status of applications, licenses, complaints, and violations per account.",tags:["BusinessLicenseApplication","Visit","RegulatoryCodeViolation","PublicComplaint"],docs:["License, Permit and Inspection Analytics provides four dashboards in the Analytics for Licenses, Permits, and Inspections CRM Analytics app. Compliance Insights tracks inspection impact on violations, Executive Summary monitors application trends and fee revenue, Department Summary identifies applications and inspections needing attention, and Account Insights shows the status of applications, licenses, complaints, and violations per account.","The dashboards support both standard and custom objects and can process up to 10 billion rows with CRM Analytics Plus. Users can filter by caseworker, time period, ZIP code, or department to focus on specific segments of their licensing and inspection operations. The analytics integrate data from BusinessLicenseApplication, Visit, RegulatoryCodeViolation, and PublicComplaint objects.","Deployment involves assigning CRM Analytics Plus Admin and User permission sets, creating analytics apps from prebuilt templates, sharing with appropriate users, and configuring data sync schedules. Field-level security must be configured for the Analytics Cloud Integration User to ensure the correct data flows into analytics datasets."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_lpi_analytics_deploy_and_use.htm&type=5&language=en_US",connections:[{planet:"licensing_and_permitting",desc:"Dashboards visualize license application trends and fee revenue"},{planet:"inspections",desc:"Compliance and inspection trend analytics across the agency"}]},
    {id:"caseworker-productivity",name:"Caseworker Productivity Analytics",icon:"\u{1F4C8}",desc:"The Workload Management Analytics dashboard provides four tabs: Summary for caseload trends and distribution, SLA Management for stage transition tracking, Benefits for community impact including disbursements and care plans served, and Leaderboard for caseworker performance comparison. Uses PSS Benefit Management and PSS Workload Management datasets.",tags:["Case","BenefitDisbursement","IndividualApplication","Referral"],docs:["Caseworker Productivity Analytics provides the Workload Management Analytics dashboard with four tabs for comprehensive caseload management. The Summary tab shows caseload trends and distribution across caseworkers, SLA Management tracks stage transitions and processing timeframes, Benefits measures community impact through disbursement amounts and care plans served, and Leaderboard compares caseworker performance metrics.","The dashboards use PSS Benefit Management and PSS Workload Management datasets that aggregate data from Case, BenefitDisbursement, IndividualApplication, and Referral objects. The analytics track benefit disbursement amounts, number of care plans served, case distribution by status and caseworker, and processing time metrics that help supervisors identify bottlenecks.","The Caseworker Productivity app serves both benefit management and investigative case management scenarios. For benefit cases, it tracks disbursement patterns and community impact. For investigative cases, it monitors case processing times and caseload balance across investigators, supporting data-driven resource allocation decisions."],connections:[{planet:"benefit_management",desc:"Tracks benefit disbursement amounts and community impact"},{planet:"social_programs",desc:"Monitors program enrollment and case distribution metrics"}]},
    {id:"case-analytics",name:"Case Analytics",icon:"\u{23F1}",desc:"A dashboard embedded on the case record page that shows how many days a case has spent in each status and the total processing time. Helps caseworkers and managers ensure they meet service-level agreement requirements by visualizing case lifecycle timing.",tags:["Case"],docs:["Case Analytics provides a dashboard embedded directly on the case record page that visualizes how many days a case has spent in each status and the total processing time. This record-level view helps caseworkers and managers quickly assess whether individual cases are progressing within expected timeframes or approaching SLA violations.","The dashboard draws data from the Case object's status history to calculate time spent in each lifecycle stage. By showing the progression from creation through investigation to resolution, the analytics help identify cases that have stalled at particular stages and may need intervention or reassignment.","Case Analytics is particularly valuable for investigative case management where SLA compliance is critical. Supervisors can use the processing time data to identify patterns in case handling, compare performance across caseworkers, and make informed decisions about resource allocation and process improvements."],connections:[{planet:"investigative_cases",desc:"Tracks investigative case processing time and SLA compliance"},{planet:"benefit_management",desc:"Monitors benefit case processing duration against SLAs"}]},
    {id:"analytics-setup",name:"Analytics Setup & Data Sync",icon:"\u{2699}",desc:"Configuration infrastructure for deploying and maintaining analytics apps, including permission set assignment for admins and users, CRM Analytics enablement, field-level security configuration for the Analytics Cloud Integration User, and data refresh scheduling to keep dashboards current with the latest PSS data.",tags:["Account","Case","Visit"],docs:["Analytics Setup and Data Sync provides the configuration infrastructure for deploying and maintaining CRM Analytics apps in Public Sector Solutions. The setup process includes enabling CRM Analytics in the org, assigning CRM Analytics Plus Admin and User permission sets, configuring field-level security for the Analytics Cloud Integration User, and scheduling data refresh cycles.","The Analytics Cloud Integration User is a system user that accesses PSS objects to populate analytics datasets. Administrators must configure field-level security to ensure this user can read all fields needed for dashboard calculations. Without proper field access, dashboards may show incomplete or inaccurate data.","Data refresh scheduling keeps analytics datasets current with the latest PSS data. Recipes process PSS objects into analytics datasets, and these recipes run on configured schedules to ensure dashboards reflect recent changes. Data Cloud integration can further enrich analytics datasets with external data for deeper cross-system insights."],connections:[{planet:"setup_and_security",desc:"Analytics permission sets and CRM Analytics enablement"},{planet:"data_360",desc:"Data Cloud integration enriches analytics datasets"}]}
  ],
  dataFlow: [
    "Administrator assigns CRM Analytics Plus Admin and User permission sets",
    "Analytics apps are created from prebuilt templates and shared with users",
    "Data sync and recipes process PSS objects into analytics datasets",
    "Dashboards surface trends, KPIs, and insights across licensing, caseloads, and benefits",
    "Users filter dashboards by caseworker, time period, ZIP code, or department"
  ],
  connections: [
    {planet:"licensing_and_permitting",desc:"License, permit, and inspection trend dashboards"},
    {planet:"inspections",desc:"Compliance and violation enforcement analytics"},
    {planet:"benefit_management",desc:"Caseworker productivity and community impact metrics"},
    {planet:"investigative_cases",desc:"Workload management and case processing analytics"},
    {planet:"setup_and_security",desc:"Permission sets and CRM Analytics enablement"},
    {planet:"data_360",desc:"Enriched Data Cloud data powers deeper analytics"}
  ]
},

emergency_and_assets: {
  packages: ['core'],
  name: "Emergency & Assets",
  icon: "\u{1F6A8}",
  color: "#dc2626",
  description: "Manages emergency program responses and physical asset tracking for public sector agencies. The emergency management capability enables agencies to create Experience Cloud sites for crisis response, providing constituents with emergency program information, incident updates, permit applications, and assistance programs like food delivery services. Inspectors use the mobile Inspection app to verify site compliance with health and safety ordinances. Businesses can request critical supplies and permits through the portal to protect employee and customer safety.",
  components: [
    {id:"emergency-program-mgmt",name:"Emergency Program Management",icon:"\u{26A0}",desc:"Creates Experience Cloud sites highlighting emergency programs and services available to public agencies, hospitals, and constituents during crises. Allows constituents to request permits for building access and apply for assistance programs. Responders use the Inspection app to deliver emergency services efficiently.",tags:["Visit","Visitor"],docs:["Emergency Program Management creates Experience Cloud sites highlighting emergency programs and services available during crises. Constituents can request permits for building access, apply for assistance programs such as food delivery services, and access real-time incident updates. Public agencies, hospitals, and community organizations use the portal to coordinate emergency response efforts.","The feature integrates with licensing workflows for emergency permit applications. When businesses need to resume operations during an emergency, they submit permit requests through the portal that are routed through the standard licensing approval process. Responders and inspectors use the mobile Inspection app to deliver emergency services and verify compliance efficiently.","Emergency program information is published through the Emergency Response Site Experience Cloud template, which provides preconfigured pages for program listings, application forms, and status tracking. The site can be rapidly deployed during a crisis to provide constituents with centralized access to all available emergency assistance."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_concept_emergency_program_management.htm&type=5&language=en_US",connections:[{planet:"experience_cloud",desc:"Emergency Response Site template for constituent self-service"},{planet:"licensing_and_permitting",desc:"Emergency permit applications processed through licensing workflows"}]},
    {id:"emergency-inspections",name:"Emergency Inspections",icon:"\u{1F50E}",desc:"After emergency permits are approved, inspectors use the mobile Inspection app to verify that sites comply with local health and safety ordinances. Businesses requesting permits during emergencies are subject to on-site verification before operations can resume.",tags:["Visit"],docs:["Emergency Inspections use the mobile Inspection app to verify that sites comply with local health and safety ordinances after emergency permits are approved. Businesses requesting operational permits during emergencies are subject to on-site verification before they can resume operations, ensuring that employee and customer safety standards are maintained even during crisis conditions.","The emergency inspection workflow leverages the standard inspection framework, using Visit records, action plan templates, and assessment indicators configured for emergency-specific compliance requirements. Inspectors access their assignments through the mobile Inspection Management app, which supports offline data capture and signature collection.","Inspection results feed back into the emergency permit approval workflow. If a site fails to meet health and safety requirements, the permit remains pending until violations are corrected and a follow-up inspection confirms compliance. This integration ensures that emergency operations do not compromise public safety standards."],connections:[{planet:"inspections",desc:"Emergency inspection visits leverage the standard inspection framework"},{planet:"licensing_and_permitting",desc:"Inspection results feed back into permit approval workflows"}]},
    {id:"crisis-resource-mgmt",name:"Crisis Resource Management",icon:"\u{1F4E6}",desc:"Enables businesses and agencies to request critical supplies during emergencies to ensure the health and safety of employees and customers. Tracks resource requests, allocation of supplies, and distribution through the portal, helping coordinate emergency logistics across multiple agencies.",tags:["Visitor","Visit"],docs:["Crisis Resource Management enables businesses and agencies to request critical supplies during emergencies to ensure the health and safety of employees and customers. The feature tracks resource requests, allocation of supplies, and distribution through the Emergency Response portal, helping coordinate emergency logistics across multiple agencies and service areas.","Action plans coordinate emergency resource distribution tasks, providing structured workflows for intake, approval, fulfillment, and delivery of requested supplies. The Visitor and Visit objects track access to emergency distribution sites and record resource allocation activities, creating an audit trail of emergency response actions.","Emergency assistance programs managed through crisis resource management operate alongside regular benefit programs in the social programs framework. This integration allows agencies to leverage existing program infrastructure for emergency response while maintaining separate tracking and reporting for crisis-specific activities."],connections:[{planet:"common_features",desc:"Action plans coordinate emergency resource distribution tasks"},{planet:"social_programs",desc:"Emergency assistance programs managed alongside regular benefit programs"}]},
    {id:"site-location-tracking",name:"Site & Location Tracking",icon:"\u{1F4CD}",desc:"Uses polygons and visit records to define geographic boundaries for emergency zones, track visitor access to restricted areas, and manage site-level information for emergency operations. Supports mapping of affected areas and coordination of field responders across multiple locations.",tags:["Polygon","Visit","Visitor"],docs:["Site and Location Tracking uses Polygon objects to define geographic boundaries for emergency zones and restricted areas. Visit and Visitor records track access to these zones, enabling agencies to monitor who enters emergency areas and coordinate field responder activities across multiple locations during crisis response operations.","The geographic boundary capabilities support mapping of affected areas, defining emergency zone perimeters, and visualizing the spatial extent of crisis events. Maps and timeline components display emergency site data, providing responders and coordinators with visual context for their response activities.","Location-based inspection scheduling uses geographic data to assign inspectors to emergency zones based on proximity and jurisdiction. This ensures efficient deployment of inspection resources during emergencies when multiple sites may need simultaneous compliance verification and safety assessments."],connections:[{planet:"inspections",desc:"Location-based inspection scheduling for emergency zones"},{planet:"common_features",desc:"Maps and timeline components visualize emergency site data"}]}
  ],
  dataFlow: [
    "Agency creates an Emergency Response Experience Cloud site during a crisis",
    "Constituents and businesses submit permit requests and assistance applications through the portal",
    "Emergency permits are routed through licensing workflows for approval",
    "Inspectors use the mobile Inspection app to verify site compliance with safety ordinances",
    "Resource requests are tracked and supplies distributed to affected areas",
    "Emergency zones are mapped using polygons and field responders are coordinated"
  ],
  connections: [
    {planet:"experience_cloud",desc:"Emergency Response Site template for crisis portals"},
    {planet:"licensing_and_permitting",desc:"Emergency permit applications and approvals"},
    {planet:"inspections",desc:"On-site inspections for emergency compliance verification"},
    {planet:"social_programs",desc:"Emergency assistance programs for affected constituents"},
    {planet:"common_features",desc:"Action plans and maps for emergency coordination"}
  ]
},

employee_experience: {
  packages: ['core'],
  name: "Employee Experience",
  icon: "\u{1F465}",
  color: "#78716c",
  description: "Provides government employees with the same quality of support as external constituents by combining Public Sector Solutions capabilities with HR Service and Agentforce IT Service. Employees access benefits management, grants management, inspections, licensing, provider management, and talent recruitment through prebuilt Experience Cloud site templates and permission sets. HR Service handles employee queries and service requests, while IT Service delivers standardized support across Slack, Microsoft Teams, email, and chat channels using AI and process automation.",
  components: [
    {id:"hr-service-integration",name:"HR Service Integration",icon:"\u{1F4BC}",desc:"HR Service creates a positive work environment by enabling agencies to efficiently address employee queries and service requests. Employees are created as Lightning Platform users with access to the Case object. HR Service is a comprehensive redesign of Work.com, and agencies on Work.com are recommended to migrate.",tags:["Employee2","Employment","Case"],docs:["HR Service Integration creates a positive work environment by enabling agencies to efficiently address employee queries and service requests. Employees are created as Lightning Platform users with access to the Case object for submitting HR requests. HR Service is a comprehensive redesign of Work.com, and agencies on Work.com are recommended to migrate to the new platform.","The integration uses the Employee2 and Employment objects to represent employee records and their employment details. Case management infrastructure is shared with constituent-facing processes, allowing the same workflow engine to handle both internal HR requests and external constituent service cases.","Lightning Platform license and permission set assignment for employees is managed through the setup process. The Employee Experience for Public Sector add-on provides the licensing needed to give employees access to both HR Service capabilities and the broader Public Sector Solutions functionality."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_employee_experience_for_pss.htm&type=5&language=en_US",connections:[{planet:"common_features",desc:"Case management infrastructure shared with constituent-facing processes"},{planet:"setup_and_security",desc:"Lightning Platform license and permission set assignment for employees"}]},
    {id:"it-service-integration",name:"Agentforce IT Service",icon:"\u{1F5A5}",desc:"Delivers instant, personalized, and consistent IT support across multiple channels including Slack, Microsoft Teams, Experience Cloud, email, and chat. Tracks and manages incidents, processes service requests, and handles problems, changes, and releases using AI and human agents. Some features are restricted in Government Cloud environments.",tags:["Case","Employee2"],docs:["Agentforce IT Service delivers instant, personalized, and consistent IT support across multiple channels including Slack, Microsoft Teams, Experience Cloud, email, and chat. The service tracks and manages incidents, processes service requests, and handles problems, changes, and releases using a combination of AI agents and human support staff.","AI agents handle routine IT support requests automatically, reducing the burden on IT staff for common issues like password resets, software access requests, and system status inquiries. Einstein AI powers incident classification and service request routing, ensuring that complex issues are escalated to the appropriate human agents.","Some IT Service features are restricted in Government Cloud environments due to security and compliance requirements. The Case and Employee2 objects provide the foundation for tracking IT incidents and service requests, integrating with the broader employee experience through a unified support portal."],connections:[{planet:"agentforce",desc:"AI agents handle routine IT support requests automatically"},{planet:"einstein_ai",desc:"AI-powered incident classification and service request routing"}]},
    {id:"employee-portal-access",name:"Employee Portal & Permissions",icon:"\u{1F511}",desc:"Prebuilt Employee Experience permission set group provides access to dynamic assessments, program and case management, investigative case proceedings, criteria-based search, evidence management, licensing, grantmaking, and outcome management. Three Experience Cloud templates serve employees: Licenses and Permits, Employee Site for Recruitment, and Employee Portal.",tags:["PersonEmployment","Employee2"],docs:["Employee Portal and Permissions provide access to PSS capabilities through the prebuilt Employee Experience permission set group. This group includes permissions for dynamic assessments, program and case management, investigative case proceedings, criteria-based search, evidence management, licensing, grantmaking, and outcome management.","Three Experience Cloud templates serve employees: Licenses and Permits for internal licensing needs, Employee Site for Recruitment for hiring managers and interviewers, and the Employee Portal for general PSS access. These templates are preconfigured with the components and page layouts needed for employee self-service workflows.","The permission set group uses PersonEmployment and Employee2 objects to manage employee identity and access. Employee portal users can access the same PSS features as external constituents, including benefit applications, complaint filing, and program enrollment, but through employee-specific Experience Cloud sites with appropriate branding and navigation."],connections:[{planet:"experience_cloud",desc:"Employee-facing portals built on Experience Cloud site templates"},{planet:"talent_recruitment",desc:"Employee site for hiring managers and interviewer evaluations"}]},
    {id:"employee-pss-capabilities",name:"Employee PSS Capabilities",icon:"\u{2699}",desc:"Government employees can access the full range of PSS applications: apply for and enroll in agency benefits, apply for education and research grants, conduct internal audits and compliance inspections, obtain licenses and certifications, find training and counseling providers, and participate in the hiring process as internal candidates.",tags:["PersonEmployment","Employment","Employee2"],docs:["Employee PSS Capabilities enable government employees to access the full range of Public Sector Solutions applications as internal users. Employees can apply for and enroll in agency benefits, apply for education and research grants, conduct internal audits and compliance inspections, obtain licenses and certifications, find training and counseling providers, and participate in the hiring process as internal candidates.","The PersonEmployment, Employment, and Employee2 objects connect employee records to the broader PSS data model. This integration means that employees interact with the same benefit programs, grantmaking processes, and licensing workflows as external constituents, but with appropriate internal permissions and streamlined internal processes.","The Employee Experience for Public Sector add-on is required to access these capabilities. The add-on provides the Employee Service platform combined with PSS functionality, enabling agencies to streamline HR, legal, ethics, procurement, and other internal government processes while providing employees with a unified workspace for all their service needs."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.psc_employee_experience_for_pss.htm&type=5&language=en_US",connections:[{planet:"benefit_management",desc:"Employees apply for and enroll in agency benefit programs"},{planet:"grantmaking",desc:"Employees apply for education, research, and other grants"}]}
  ],
  dataFlow: [
    "Employees are created as Lightning Platform users with appropriate permission sets",
    "HR Service and IT Service are configured with Employee Experience add-on",
    "Employee Experience Cloud sites are deployed for licensing, recruitment, and general portal access",
    "Employees access PSS capabilities including benefits, grants, inspections, and provider management",
    "AI-powered agents handle routine HR and IT queries across Slack, Teams, email, and chat"
  ],
  connections: [
    {planet:"experience_cloud",desc:"Employee-facing portals for HR, IT, and PSS capabilities"},
    {planet:"talent_recruitment",desc:"Internal candidates and hiring manager workflows"},
    {planet:"benefit_management",desc:"Employee benefit enrollment and management"},
    {planet:"grantmaking",desc:"Employee grant applications for education and research"},
    {planet:"agentforce",desc:"AI agents for employee HR and IT support"},
    {planet:"setup_and_security",desc:"Lightning Platform licensing and permission set configuration"}
  ]
},

grantmaking: {
  packages: ['core'],
  name: "Grantmaking",
  icon: "\u{1F3C6}",
  color: "#f472b6",
  description: "Manages the full grant lifecycle from funding opportunity creation through disbursement and outcome measurement. Built on the Salesforce platform and shared with Nonprofit Cloud, Grantmaking provides a 360-degree view of stakeholders, online application portals via Experience Cloud, budget management with category and period tracking, application review workspaces with Form Framework, automated recurring requirements and disbursements, and outcome measurement through Outcome Management integration. Supports both grant maker administration and grant seeker self-service experiences.",
  components: [
    {id:"funding-opportunities",name:"Funding Opportunities",icon:"\u{1F4E2}",desc:"Grant makers create and publish funding opportunities that include application details, descriptions, instructions, budget templates, and application timelines. Opportunities can be public or restricted to specific applicants using Compliant Data Sharing. The Grantmaking Experience Cloud template displays opportunities for grant seekers to browse and apply.",tags:["FundingOpportunity"],docs:["Funding Opportunities in Grantmaking are created by grant makers to define grant programs that seekers can apply for. The FundingOpportunity object stores application details, descriptions, instructions, budget templates, and application timelines. Opportunities can be public or restricted to specific applicants using Compliant Data Sharing for private funding programs.","The Grantmaking Experience Cloud template displays funding opportunities for grant seekers to browse and apply. Grant makers publish opportunities with associated action plan templates that define the application sections, review process, and required documentation. The Grantmaking: Apply for Funding Opportunity Using Application Form flow generates application forms for each opportunity.","Einstein generative AI can create board versions of grant applications for reviewer consumption, transforming detailed application data into concise summaries suitable for review committees. This AI integration helps streamline the evaluation process when multiple reviewers need to assess large volumes of applications."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.grmk_grantmaking.htm&type=5&language=en_US",connections:[{planet:"experience_cloud",desc:"Funding opportunities published on the Grantmaking Experience Cloud site"},{planet:"einstein_ai",desc:"Einstein generates board versions of grant applications for review"}]},
    {id:"grant-budget-management",name:"Budget Management",icon:"\u{1F4B0}",desc:"Manages complex budgets broken down by category and period with planned and actual amounts. Budget categories define spending areas like Personnel, Supplies, and Indirect Costs, while budget periods define the time intervals. The Budget Lightning component provides an easy-to-use grid for entering planned amounts and tracking actual expenditures with automatic variance calculation.",tags:["Budget","BudgetAllocation"],docs:["Budget Management in Grantmaking handles complex budgets broken down by category and period with planned and actual amounts. Budget categories define spending areas like Personnel, Supplies, and Indirect Costs, while budget periods define time intervals for tracking. The Budget Lightning component provides an easy-to-use grid for entering planned amounts and tracking actual expenditures with automatic variance calculation.","The Budget component supports two states: budgetPlanning for the application phase where applicants enter planned amounts with an optional Submit button, and actualsReporting for the post-award phase where planned amounts become read-only and grantees enter actual expenditures. The component uses the API name runtime_industries_budget:budget for OmniStudio automation.","Budget components are added to both the Budget page layout and the Application Form page layout to provide a consistent budgeting experience. The Funding Opportunity field on the application form links the budget to the specific grant program. Grant seekers submit proposed budgets through the Experience Cloud portal alongside their applications."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.grmk_grantmaking.htm&type=5&language=en_US",connections:[{planet:"common_features",desc:"Budget tracking integrates with action plan milestones and document checklists"},{planet:"experience_cloud",desc:"Grant seekers enter and track budgets through the Experience Cloud portal"}]},
    {id:"grant-applications-reviews",name:"Applications & Reviews",icon:"\u{1F4DD}",desc:"Manages grant applications using the Application Form object with Form Framework for multi-phase, multi-section forms. Review workspaces allow internal and external reviewers to enter feedback and ratings. Batch assignment flows assign multiple applications to reviewers at once, and Compliant Data Sharing controls record visibility for applicants and collaborators.",tags:["ApplicationForm","ApplicationFormRelation","ApplicationFormEvaluation","ApplicationFormEvalPtcp"],docs:["Applications and Reviews manage grant applications using the ApplicationForm object with Form Framework for multiphase, multi-section forms. Application render methods map to OmniStudio or flow-based forms, and application stage definitions bundle editable and read-only versions into complete form sections. Published action plan templates with Application Form as the target define the intake structure.","Review workspaces are created on the ApplicationFormEvaluation object using Form Framework, providing reviewers with structured forms to enter feedback and ratings. The Grantmaking: Assign Application Form Evaluations in Batch flow enables grant managers to assign multiple applications to reviewers at once. Compliant Data Sharing controls record visibility for applicants, collaborators, and reviewers.","The Share Application Reviews flow template works with Stage Management to automatically share application form evaluations and related records with specified reviewers when applications enter specific review stages. This automation ensures that reviewers receive access to application data at the right time in the review process without manual intervention."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.grmk_grantmaking.htm&type=5&language=en_US",connections:[{planet:"common_features",desc:"Action plan templates manage repeatable review and approval tasks"},{planet:"einstein_ai",desc:"Einstein summarizes application history and compares application versions"}]},
    {id:"funding-awards",name:"Funding Awards",icon:"\u{1F3C5}",desc:"Tracks the details of awarded grants including amount, contract timeframe, and budget allocation. Award requirements define reporting milestones and deliverables with automated recurring creation via Flow Builder. Award amendments handle changes to grant terms. Recipients track upcoming deadlines and report progress through the Experience Cloud portal.",tags:["FundingAward","FundingAwardRequirement"],docs:["Funding Awards track the details of awarded grants using the FundingAward object including amount, contract timeframe, and budget allocation. FundingAwardRequirement objects define reporting milestones and deliverables that grant recipients must fulfill. Automated recurring requirement creation through Flow Builder streamlines the setup of periodic reporting obligations.","Award amendments handle changes to grant terms after the initial award is made. Stage Management automates award lifecycle transitions, guiding awards through stages with specific entry and exit criteria to ensure regulatory compliance and consistent processing. Recipients track upcoming deadlines and submit progress reports through the Experience Cloud portal.","Einstein AI generates funding award summaries showing milestone progress, requirement fulfillment, and disbursement status. These AI-generated summaries help program officers quickly assess grant performance across their portfolio and identify awards that may need attention or intervention."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.grmk_grantmaking.htm&type=5&language=en_US",connections:[{planet:"experience_cloud",desc:"Grant recipients track awards and submit reports through the portal"},{planet:"common_features",desc:"Stage Management automates award lifecycle transitions"}]},
    {id:"grant-disbursements",name:"Disbursements",icon:"\u{1F4B8}",desc:"Manages the schedule and execution of funding disbursements from awarded grants. Automated recurring disbursement creation through Flow Builder streamlines payment scheduling. Each disbursement can include budget allocations linking payments to specific budget categories, and disbursement records feed into financial tracking and reporting.",tags:["PaymentRequest","PaymentRequestLine"],docs:["Grant Disbursements manage the schedule and execution of funding payments from awarded grants using PaymentRequest and PaymentRequestLine objects. Automated recurring disbursement creation through Flow Builder streamlines payment scheduling, allowing grant managers to set up periodic payments that are automatically created based on the award terms.","Each disbursement can include budget allocations linking payments to specific budget categories, ensuring that funds are distributed according to the approved budget plan. Disbursement records feed into financial tracking and reporting, providing a complete audit trail from award to payment.","Document checklists ensure that required materials accompany disbursement requests before payments are processed. This integration with the document management system ensures that grant recipients submit all necessary reports, receipts, and supporting documentation before funds are released."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.grmk_grantmaking.htm&type=5&language=en_US",connections:[{planet:"benefit_management",desc:"Disbursement patterns shared with benefit disbursement infrastructure"},{planet:"common_features",desc:"Document checklists ensure required materials accompany disbursement requests"}]},
    {id:"grant-outcomes",name:"Outcome Management",icon:"\u{1F4CF}",desc:"Uses Outcome Management to define measurable impact strategies, collect indicator data, and track grant progress against time-bound targets. Grantees propose and demonstrate project impact through the Experience Cloud site using the Create Indicator Results component. Grant makers evaluate applications against their impact strategy and communicate results to stakeholders.",tags:["FundingAward","FundingAwardRequirement"],docs:["Outcome Management for Grantmaking defines measurable impact strategies, collects indicator data, and tracks grant progress against time-bound targets. Grant makers set up impact strategies that define what success looks like for their funding programs, then create indicators that measure specific outcomes aligned with those strategies.","Grantees propose and demonstrate project impact through the Experience Cloud site using the Create Indicator Results component. Progress reports on the FundingAwardRequirement object are created using Form Framework, providing a structured way for recipients to report on budget usage and outcomes. The actualsReporting budget state allows grantees to enter actual expenditure amounts alongside their planned budget.","Grant makers evaluate applications against their impact strategy and communicate results to stakeholders. Outcome indicators are shared across grant and social program measurement, enabling agencies to track the combined impact of grant funding and direct service delivery on constituent outcomes."],docUrl:"https://help.salesforce.com/s/articleView?id=ind.grmk_grantmaking.htm&type=5&language=en_US",connections:[{planet:"social_programs",desc:"Outcome indicators shared across grant and social program measurement"},{planet:"experience_cloud",desc:"Grantees report outcomes and indicator results through the portal"}]}
  ],
  dataFlow: [
    "Grant maker creates a funding opportunity with application instructions and budget template",
    "Grant seekers discover opportunities on the Experience Cloud site and submit applications with budgets",
    "Applications are assigned to reviewers in batch and evaluated through Form Framework workspaces",
    "Approved applications generate funding awards with requirements and disbursement schedules",
    "Disbursements are created on a recurring schedule and linked to budget allocations",
    "Grantees report outcomes and indicator results against the impact strategy"
  ],
  connections: [
    {planet:"experience_cloud",desc:"Grant seeker and reviewer portal for applications and reporting"},
    {planet:"common_features",desc:"Action plans, document checklists, and stage management for grant workflows"},
    {planet:"einstein_ai",desc:"AI-generated application summaries, award summaries, and board versions"},
    {planet:"benefit_management",desc:"Shared disbursement and outcome measurement patterns"},
    {planet:"social_programs",desc:"Grant outcome indicators aligned with program goals"},
    {planet:"data_360",desc:"Grantmaking data bundle maps objects to Data Cloud for unified analytics"},
    {planet:"employee_experience",desc:"Employees apply for education and research grants"}
  ]
},

};
