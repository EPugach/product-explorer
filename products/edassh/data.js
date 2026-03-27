// ══════════════════════════════════════════════════════════════
//  EDA & Student Success Hub — Domain & Component Data
//  Consumed by the shared rendering engine (app/js/)
// ══════════════════════════════════════════════════════════════

export const PRODUCT = {

// ─── EDA FOUNDATION ──────────────────────────────────────────

accounts_contacts: {
  packages: ['edassh'],
  name: "Accounts & Contacts",
  icon: "\u{1F464}",
  color: "#4d8bff",
  description: "The core identity layer of EDA. Every person is a Contact record linked to a dedicated Administrative Account in a 1:1 model. Address management supports seasonal and default addresses with automated synchronization. Account record types (Educational Institution, University Department, Academic Program, Sports Organization, Business Organization) provide organizational structure across the campus.",
  components: [
    {
      id: "admin-accounts",
      name: "Administrative Accounts",
      icon: "\u{1F4BC}",
      desc: "The 1:1 Account-Contact model where each Contact has a unique Administrative Account. This replaces the traditional B2B Account hierarchy with an education-centric model. Whenever you create a new independent Contact, EDA automatically generates a dedicated Administrative Account as the Contact's container, named using configurable naming conventions such as last name or full name formats.",
      tags: ["Account", "Contact"],
      docs:["In the EDA Account model, the standard Salesforce Account object acts as a container account referred to as the Administrative Account, with a single contact associated with it. The relationship between the Account and Contact is one-to-one, meaning for each contact you create in EDA, you also have a unique Administrative Account. This model is more common in higher education because while family data is still important, it is secondary to data about the student as an independent adult.","The Default Account Model setting specifies your preferred primary account model. Between Administrative and Household, you must pick a favorite. Out of the box, Administrative is the default value. Whenever you create a new independent Contact, an Administrative Account is created automatically as the Contact's container Account. The naming convention can be customized in EDA Settings, with options such as last name only, full name, or custom formats.","Administrative Accounts typically have only one related Contact. If an Administrative Account happens to have more than one Contact, automatic naming uses the name of the primary Contact. Account names are automatically updated whenever the Contact's last name changes. You can run the Update Administrative Account Names Apex job from System Tools in EDA Settings to apply naming format changes to all existing records.","Institutions using Administrative container Accounts for student Contacts who also need to model household membership can create a Household Account record for the household, create parent or guardian Contact records under the household, and then create an Affiliation record to relate the student's Contact to the household Account. This approach preserves the Administrative Account model while still tracking family relationships."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_configure_account_model_settings.htm",
      connections: [{ planet: "affiliations", desc: "Affiliations link Contacts to organizational Accounts" }]
    },
    {
      id: "contact-management",
      name: "Contact Management",
      icon: "\u{1F9D1}",
      desc: "Central Contact records storing biographical data, communication preferences, and demographic information for students, faculty, staff, alumni, and other constituents. EDA augments the standard Contact object with education-specific fields such as Financial Aid Applicant, Primary Language, preferred email and phone settings, and FERPA compliance indicators.",
      tags: ["Contact"],
      docs:["Faculty, staff, administrators, and students are all modeled with the Contact object, which is a standard Salesforce object augmented with education-specific fields. Custom objects in EDA store additional Contact-related data, such as a person's connections on and off campus, notable attributes, the languages they speak, and their affiliation history. When your data model is fully built out, EDA weaves together biographic and demographic data from the Contact object with selected data from Contact-related objects to create a unified student record.","EDA provides preconfigured email fields (University Email, Work Email, Alternate Email) and phone fields (Home Phone, Work Phone, Mobile, Other Phone) to track a Contact's communication preferences. The Preferred Email and Preferred Phone settings designate which field is the Contact's preferred address for communications. By default, all Contacts must have a Preferred Email and Preferred Phone, though this requirement can be changed in EDA Settings.","Because a Contact can play multiple roles at once, such as being an alumni of one program, a current student in another, a tutor, and a sports team member, EDA does not provide Contact record types out of the box. Instead, a Contact's roles with various organizational entities are tracked through Affiliation records, which relate individuals to the departments, programs, and organizations they are connected to."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_contact.htm",
      connections: [{ planet: "relationships", desc: "Relationships track Contact-to-Contact connections" }]
    },
    {
      id: "address-management",
      name: "Address Management",
      icon: "\u{1F4CD}",
      desc: "Multi-address support with seasonal, mailing, home, and other address types. Default address logic automatically syncs the current address to the Contact's mailing fields. EDA synchronizes address data across Address, Contact, and Account records, with special handling for seasonal addresses that automatically become active during their specified date range.",
      tags: ["Address__c"],
      docs:["Students are nomadic: they live in a residence hall one year, off-campus the next, study abroad for a term, and go home for the summer. EDA offers robust address management that allows you to track and manage multiple addresses using the Address object, keep multiple addresses synchronized across related Contact, Account, and Address records, and differentiate addresses among Contacts in a Household. Address records support types including Home, Work, Vacation Residence, and Other, with the ability to create additional custom types.","The seasonal fields on Address records allow you to automatically make an address current for a specified period of time. When a seasonal address is in effect, it becomes the Current Address on the related Contact and Account records, meaning the seasonal Address record syncs to both records and becomes the current mailing and billing address. After the seasonal end date, either another seasonal address takes its place or the default Address record is restored as the Current Address.","Multiple addresses are on by default for Household Accounts and cannot be turned off. They are also on by default for Contacts, Administrative Accounts, and Business Organization Accounts. For Household Accounts, EDA provides specialized synchronization: when you update an address, the change propagates to both the Contact Mailing Address and the Account Billing Address. The Do Not Automatically Update checkbox on a Contact record lets you maintain a separate mailing address for specific household members, such as parents, when a student moves.","Each Address record uses approximately 2 kilobytes of data storage. Over the course of a student's tenure, address data can grow significantly. Administrators should monitor storage usage in Setup and consider deleting old seasonal addresses that are no longer needed, while retaining any addresses relevant to recruiting, admissions, or advancement purposes."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_configure_addresses.htm",
      connections: [{ planet: "tdtm_settings", desc: "TDTM triggers automate address synchronization" }]
    },
    {
      id: "household-accounts",
      name: "Household Accounts",
      icon: "\u{1F3E0}",
      desc: "Household Account model groups related Contacts (family members) under a shared Account. Household naming conventions automatically update when members change. Unlike Administrative Accounts, a Household Account is typically parent to multiple Contacts including the student, parents, guardians, and siblings.",
      tags: ["Account"],
      docs:["A Household Account functions as its name suggests: to represent the household a Contact belongs to. Unlike the Administrative Account's one-to-one relationship, a Household Account is typically a parent to multiple Contacts besides the student, such as parents or guardians, siblings, and other household members. In primary and secondary education, Household Accounts are more common because tracking data about a student's household can be as important as tracking data about students themselves, since family relationships are central to K-12 student success.","Household Account names are automatically generated and updated based on the names of Contacts associated with the Account. You have many naming format options including last name only, full name formats, and family formats. When Automatically Rename Household Accounts is turned on, the Account name updates whenever a new Contact is added, an existing Contact is renamed or deleted, or a Contact moves to another household. Multiple naming formats are available such as Smith Household, John Smith Household, or Smith Family.","When you add a new Contact to a Household Account, EDA automatically populates the new Contact's Mailing Address with the Household Account's address and relates the existing Address record to the new Contact. If you enter a different Mailing Address for the new Contact, EDA creates a new Address record and makes it the default for the Household Account and all household Contacts, unless any Contact has the Do Not Automatically Update checkbox selected."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_custom_admin_and_hh_account_names.htm",
      connections: [{ planet: "relationships", desc: "Relationships between household members" }]
    },
    {
      id: "account-record-types",
      name: "Account Record Types",
      icon: "\u{1F3DB}",
      desc: "Preconfigured Account record types: Educational Institution, University Department, Academic Program, Sports Organization, and Business Organization. Each maps to a distinct organizational entity. Institutions can create additional custom record types as needed, such as for school districts or government agencies.",
      tags: ["Account"],
      docs:["EDA comes preconfigured with Account record types that help distinguish different types of institutional and organizational entities. Educational Institution represents the top-level entity such as the entire university or individual schools within it. University Department represents academic or administrative departments. Academic Program represents degree-granting or credential-granting programs. Sports Organization tracks athletic teams, and Business Organization models external partners such as vendors and internship sponsors.","Account records are organized in tree structures of parent and child records, known as account hierarchies. A typical university hierarchy might have the institution at the top, with administrative departments, academic divisions, schools, and colleges organized underneath. Within each division, further nesting captures departments, programs, and smaller organizational units. This hierarchy enables the Salesforce security and record sharing model to control who can access which data.","If your implementation requires other record types, you are free to create them. For example, a university can create unique record types for Undergraduate Program and Graduate Program, or a K-12 school can create a record type for College Prep Program. When developing a plan for tracking institutional entities, consider whether you need custom Account record types to track entities such as school districts, government agencies, or specific campus organizations."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_account.htm",
      connections: [{ planet: "affiliations", desc: "Affiliation mappings create records based on Account record type" }]
    }
  ],
  dataFlow: [
    "A new student Contact is created with biographical data and communication preferences",
    "EDA automatically generates a dedicated Administrative Account linked 1:1 to the Contact",
    "Address records are created with types (Home, Mailing, Seasonal) and date ranges for seasonal addresses",
    "The default address synchronization trigger copies the current default address to the Contact's standard mailing fields",
    "Account record types classify the Contact's organizational associations across departments, programs, and institutions"
  ],
  connections: [
    { planet: "relationships", desc: "Relationships track personal connections between Contacts" },
    { planet: "affiliations", desc: "Affiliations connect Contacts to organizational Accounts" },
    { planet: "education_history", desc: "Education History tracks prior institutions and achievements" },
    { planet: "behavior", desc: "Behavior incidents reference Contact records" },
    { planet: "student_cases", desc: "Student Record Cases are created for Contacts" },
    { planet: "tdtm_settings", desc: "TDTM triggers automate Account-Contact synchronization" }
  ]
},

relationships: {
  packages: ['edassh'],
  name: "Relationships",
  icon: "\u{1F91D}",
  color: "#ec4899",
  description: "Tracks person-to-person connections between Contacts with automatic reciprocal management. When a relationship is created (e.g., Parent of Student), EDA automatically generates the inverse record (Student of Parent). Also tracks language proficiency across multiple languages per Contact.",
  components: [
    {
      id: "relationship-records",
      name: "Relationship Records",
      icon: "\u{1F465}",
      desc: "Contact-to-Contact relationship tracking with configurable types (Parent, Sibling, Spouse, Advisor, Tutor, Coach) and status indicators. EDA offers a preconfigured set of relationship values that mostly represent familial relationships, while custom values can be created for all types of Contacts including faculty mentors and classroom aides.",
      tags: ["Relationship__c"],
      docs:["The Relationship object tracks how someone is connected to someone else by relating one Contact record to another. EDA offers a preconfigured set of Relationship values that mostly represent familial relationships such as Parent, Grandparent, Guardian, and the like. While they are most relevant for tracking data about students' families and households, you can create custom Relationship values for all types of Contacts. For faculty and staff, consider creating custom values such as Mentor Teacher or Classroom Aide.","When you create one Relationship record, the Reciprocal Relationship feature automatically creates a corresponding record for the other Contact. For example, a Contact might have a Relationship record connecting her as a daughter to a Contact who is her father, and EDA automatically creates a Reciprocal Relationship with a type of Father for the related Contact. This ensures that both sides of every relationship are always tracked without requiring manual duplicate entry.","The values used for Relationships require precise matches everywhere they are used. Mismatched values used in reciprocal settings and as picklist values in the Type field of the Relationship object can cause errors and show as failed checks in Settings Health Check. All values are case-sensitive, must use English API names, and should only be deactivated or edited through EDA Settings to maintain data integrity."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_relationship.htm",
      connections: [{ planet: "accounts_contacts", desc: "Relationships connect two Contact records" }]
    },
    {
      id: "reciprocal-management",
      name: "Reciprocal Management",
      icon: "\u{1F503}",
      desc: "Automatic creation of inverse relationship records. A Relationship Lookup maps each type to its reciprocal (e.g., Parent/Child, Employer/Employee) with gender-specific variants. Two methods are available: List Setting, which uses a preconfigured lookup table, and Value Inversion, which reverses the type string around a delimiter.",
      tags: ["Relationship__c"],
      docs:["The Reciprocal Method setting determines how EDA creates Reciprocal Relationships. The List Setting method uses values in the Reciprocal Settings list to determine the type of reciprocal that is created. For example, if you create a Relationship from a male-gendered Contact record with the Type Son, EDA automatically creates a Reciprocal Relationship of Father on the son's record. Most organizations use List Setting, which is the default method.","The Value Inversion method reverses the Type value on a Relationship record to reflect the reciprocal. For example, a Mother-Daughter type creates a reciprocal of Daughter-Mother. Value Inversion ignores the Reciprocal Settings list entirely. You create picklist values on the Relationship object's Type field for all possible combinations. The delimiter separating the roles is specified in the Relationship_Split custom label and defaults to a hyphen.","Because some Reciprocal Settings values are gender-specific, gender data is involved in determining Type values. The system looks in a Contact's Gender field for Female or Male. If the gender is not yet determined, it checks the Salutation field. If the gender remains undetermined, the Neutral value is used. You can add values to the Female and Male custom labels to support additional gender options, such as adding Trans Woman to the Female custom label."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_configure_relationships_settings.htm",
      connections: [{ planet: "tdtm_settings", desc: "TDTM handlers manage reciprocal creation and updates" }]
    },
    {
      id: "contact-languages",
      name: "Contact Languages",
      icon: "\u{1F30D}",
      desc: "Tracks language proficiency per Contact including fluency level and primary language designation. Supports multilingual campus communities. The Language object stores languages spoken at the institution, while Contact Language records link individuals to specific languages with proficiency details.",
      tags: ["Contact_Language__c", "Language__c"],
      docs:["Tracking the languages spoken by students, staff, and parents, along with their fluency in each, goes a long way toward creating an inclusive environment where people can get support and communication in their preferred languages. The Language object contains records for the languages spoken by your campus population and the languages used for instruction. The Contact Language object tracks an individual Contact's fluency with a language and whether it is the Contact's primary language.","Contact Language records can serve many purposes across different educational contexts. At a university, you might track the primary language for a student and identify an intermediate-level language they are studying. At an international university, you could track an instructor's fluency in multiple languages for staffing courses taught in multiple countries. In K-12 settings, you might identify the primary language for a student's guardian to ensure that family communication is sent in their preferred language."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_contact_language.htm",
      connections: [{ planet: "accounts_contacts", desc: "Languages are associated with Contact records" }]
    },
    {
      id: "relationship-autocreation",
      name: "Relationship Auto-Creation",
      icon: "\u{26A1}",
      desc: "Configurable auto-creation settings that generate Relationship records from Contact lookup fields or Campaign membership. Reduces manual data entry for common relationship patterns. For example, a Referee lookup field on Campaign Member can automatically create Referrer and Referee Relationships between Contacts.",
      tags: ["Relationship__c"],
      docs:["Auto-created Relationships allow a custom Contact lookup field on the Contact or Campaign Member object to automatically create a new Relationship. For example, you can create a Referee lookup field on the Campaign Member object to track the person who introduced someone to your institution, then create an Auto-Create Setting to automatically create Referrer and Referee Relationships between the Contacts. Auto-created Relationships are not available for Leads or Campaign Member objects that reference Leads.","Before adding an Auto-Create setting, you must create a custom Contact lookup field on either the Contact or Campaign Member object, ensure that the Relationship object's Type field has picklist values reflecting the type of Relationship, and if using the List Setting method, ensure that existing Reciprocal Settings reflect the relationship type. By default, if an existing Relationship between two Contacts has the same Type as one that would be auto-created, a duplicate cannot be created, though this behavior can be changed through the Prevent Duplicate Relationships setting."],
      connections: [{ planet: "tdtm_settings", desc: "Auto-creation settings managed through EDA Settings" }]
    }
  ],
  dataFlow: [
    "A staff member creates a Relationship record linking two Contacts with a relationship type",
    "TDTM looks up the reciprocal type in the Relationship Lookup and creates the inverse record automatically",
    "Both Contact records now show the relationship in their Related Lists with the correct directional type",
    "If either relationship is updated or deleted, the reciprocal is automatically synchronized"
  ],
  connections: [
    { planet: "accounts_contacts", desc: "Relationships connect Contact records" },
    { planet: "affiliations", desc: "Affiliations complement relationships with organizational ties" },
    { planet: "tdtm_settings", desc: "TDTM manages reciprocal relationship automation" }
  ]
},

affiliations: {
  packages: ['edassh'],
  name: "Affiliations",
  icon: "\u{1F3E2}",
  color: "#8b5cf6",
  description: "Maps person-to-organization relationships through Affiliation records that connect Contacts to Accounts. Supports primary affiliation designation per Account record type, auto-creation mappings, and bidirectional synchronization with Program Enrollment. Affiliations track roles, status, dates, and department assignments across an institution.",
  components: [
    {
      id: "affiliation-records",
      name: "Affiliation Records",
      icon: "\u{1F4CB}",
      desc: "Contact-to-Account relationship records with role, status (Current/Former), start/end dates, and description. Maps students and staff to departments, programs, and organizations. Affiliations are essential for tracking involvement in activities and organizations, on or off campus, both in the present and in the past.",
      tags: ["Affiliation__c"],
      docs:["The Affiliation object lets you model an affiliation between a Contact and an Account that the person has a meaningful connection with. For a faculty or staff member, an Affiliation record often represents a professional affiliation with an administrative, academic, or operational department. For a student, Affiliations represent academic, social, or professional connections with departments and other on- and off-campus organizations. At this time, an Affiliation cannot be used to relate an Account to another Account.","Affiliations can serve many purposes across educational contexts. At a university, you can track students' Affiliations with an Academic Program like a Biology degree or a Sports Organization like the Women's Soccer Team, as well as faculty Affiliations with University Departments. In K-12 settings, track students' Affiliations with programs like After-School Care and staff Affiliations with Educational Institution Accounts. When a Contact has more than one Affiliation per record type, you can designate one as the Primary Affiliation.","Creating and editing Affiliation records can trigger automatic updates to other Affiliation records. Creating, editing, and deleting Program Enrollment records can also trigger automatic updates to Affiliation records, and vice versa. The specifics depend on your organization's configuration, including the Affiliation Mappings and Table-Driven Trigger Management automation settings in EDA."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_configure_affiliations_settings.htm",
      connections: [{ planet: "accounts_contacts", desc: "Affiliations link Contacts to organizational Accounts" }]
    },
    {
      id: "primary-affiliation",
      name: "Primary Affiliation",
      icon: "\u{2B50}",
      desc: "Each Contact can have one primary Affiliation per Account record type. The primary lookup field on Contact is automatically maintained when Affiliations are created or updated.",
      tags: ["Affiliation__c", "Contact"],
      docs: ["Primary Affiliations represent the main institutional relationship for each Account record type a Contact belongs to. Unlike secondary Affiliations, which track all institutional memberships, the Primary Affiliation is surfaced directly on the Contact record layout through lookup fields, providing an at-a-glance view of a student's main department, program, or organization. Each Contact can have one Primary Affiliation per Account record type, so a student might simultaneously hold a Primary Affiliation to a University Department and to an Academic Program.", "Primary Affiliation fields on Contact are automatically synchronized by the Affiliation Trigger Handler whenever Affiliations are created, updated, or deleted. If a Contact's Affiliation record for a given record type is marked as Primary, EDA writes the linked Account to the corresponding lookup field on the Contact; if the Affiliation is later unmarked or deleted, EDA clears that field. This automation is governed by the Affiliation Trigger Handler setting in EDA Settings and can be disabled if your organization manages Primary Affiliations through an external integration.", "In practice, Primary Affiliations are most valuable in reporting and list views where you need to filter or segment contacts by their main institutional relationship. Advisors reviewing a student record immediately see the student's home department or enrolled program without navigating to the related Affiliations list. Primary Affiliations also drive behavior in other EDA features: Program Enrollment auto-creation checks whether the Academic Program Affiliation is marked primary before triggering enrollment record generation."],
      connections: [{ planet: "accounts_contacts", desc: "Primary Affiliation updates Contact lookup fields" }]
    },
    {
      id: "affiliation-mappings",
      name: "Affiliation Mappings",
      icon: "\u{1F5FA}",
      desc: "Auto-creation mappings that generate Affiliation records when Contacts are associated with Accounts of specific record types. Configurable in EDA Settings. Each mapping links an Account record type to a Primary Affiliation field on the Contact, with optional auto-enrollment settings for Academic Programs.",
      tags: ["Affiliation__c"],
      docs:["The Primary Affiliation fields on a Contact record each map to an Account record type according to the Affiliation Mappings configured in EDA Settings. Default mappings connect Account record types such as Educational Institution, University Department, Academic Program, Business Organization, and Sports Organization to their corresponding Primary Affiliation fields on the Contact page layout. If you use a custom Account record type that corresponds to a Primary Affiliation field, you can create an additional Affiliation mapping to sync their data.","The Academic Program record type is different from other Account record types with Affiliation mappings because it is the only one with Auto-Enrollment settings specified by default. When you create a Primary Affiliation for a Contact with values that match the default Auto-Enrollment Mappings, EDA automatically creates a related Program Enrollment record. This automation is controlled by the Affiliation Trigger Handler and only takes effect if it is enabled.","To guard against an Account record type without an Affiliation mapping, you can enforce record type validation in EDA Settings. This prevents users from creating erroneous Primary Affiliation data on Contact records. As of EDA version 1.114, Affiliation mappings and their related API names are automatically associated, so no additional work is needed to translate these values for multilingual organizations."],
      connections: [{ planet: "tdtm_settings", desc: "Mappings configured through EDA Settings" }]
    },
    {
      id: "enrollment-sync",
      name: "Enrollment Synchronization",
      icon: "\u{1F504}",
      desc: "Bidirectional sync between Program Enrollment and Affiliation records. Creating a Program Enrollment auto-creates a corresponding Affiliation, and vice versa. EDA Settings provide control over how Affiliations are handled when Program Enrollments are deleted or created without existing Affiliations.",
      tags: ["Affiliation__c", "Program_Enrollment__c"],
      docs:["The Program Enrollment object relates a Contact to an Academic Program Account, specifically tracking enrollment data such as dates and status. Program Enrollment serves a more specialized purpose than the Affiliation object, which similarly relates any kind of Contact to any kind of Account. In EDA, Program Enrollments and Affiliations are used in parallel and come preconfigured with automation to keep their data in sync. When a Program Enrollment is created, an Affiliation record is automatically created at the same time.","EDA Settings provide fine-grained control over synchronization behavior. When a Program Enrollment is deleted, you can configure whether the associated Affiliation is also deleted or simply has its status changed. You can also set the role, status, and start/end dates for Affiliations that are automatically created when Program Enrollments are created without existing Affiliations. These settings take effect only if the relevant TDTM Trigger Handlers are enabled.","Students' Program Enrollments can be changeable as they explore their interests and complete prerequisites before committing to an academic plan. If a student changes majors, departments, or even colleges, someone makes sure that the Program Enrollment details are either updated, deleted, or created anew, and EDA automation keeps the corresponding Affiliation details updated as well."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_model_enrollments.htm",
      connections: [{ planet: "academic_programs", desc: "Program Enrollment triggers Affiliation creation" }]
    }
  ],
  dataFlow: [
    "A student Contact is associated with an Academic Program Account through a new Affiliation record",
    "EDA checks the Affiliation Mappings to determine if this is the first Affiliation for this Account record type",
    "If it is the first or is marked as Primary, the Contact's primary Affiliation lookup field is updated automatically",
    "When a corresponding Program Enrollment is created, the sync handler ensures both records stay aligned",
    "Status changes (Current to Former) propagate across related records through TDTM automation"
  ],
  connections: [
    { planet: "accounts_contacts", desc: "Affiliations connect Contacts to Accounts" },
    { planet: "relationships", desc: "Organizational context complements personal relationships" },
    { planet: "academic_programs", desc: "Program Enrollments sync with Affiliations" },
    { planet: "courses", desc: "Course Connections depend on student Affiliations" },
    { planet: "tdtm_settings", desc: "TDTM manages Affiliation automation and sync" }
  ]
},

academic_programs: {
  packages: ['edassh'],
  name: "Academic Programs",
  icon: "\u{1F393}",
  color: "#10b981",
  description: "Manages degree programs, curriculum requirements, and student enrollment. Program Plans define hierarchical requirement structures that map graduation pathways. Plan Requirements nest to represent core courses, electives, concentrations, and prerequisites. Program Enrollment tracks each student's participation and progress through a program.",
  components: [
    {
      id: "program-plans",
      name: "Program Plans",
      icon: "\u{1F4D1}",
      desc: "Hierarchical definitions of academic programs (majors, minors, certificates). Each plan organizes requirements into nested categories like Core Courses, Electives, and Concentrations. Program Plans have a limited shelf life and are typically updated each catalog year as requirements change, with the Is Primary field indicating the current active plan.",
      tags: ["Program_Plan__c"],
      docs:["Several objects that share a theme of programs let you model your institution's academic and other offerings: an Account record type called Academic Program, the Program Plan object, and the Plan Requirement object. Use this set of objects to track how your learning offerings are structured and administered, and what they require for enrollment and completion. Programs can be degree or credential programs, academic support programs, recreational programs, continuing education, and more across the lifelong learning continuum.","The Program Plan object represents a general set of requirements for a specific catalog year. For example, the Biology Catalog Year 2020/2021 represents the set of requirements in effect for students enrolling that year, indicated by the Is Primary field. By the time the institution finalizes its catalog for the next academic year, requirements have usually changed slightly and are captured in a new Program Plan record. This versioning approach allows institutions to track historical requirements alongside current ones.","Plan Requirement records are typically part of a hierarchy. Parent Plan Requirements organize higher-level categories such as Lower Division and Upper Division. Underneath, child Plan Requirements can be nested at multiple levels to detail specifics such as Core Sciences, Mathematics, General Electives, and Service Learning. Different flavors of Plan Requirement records make up the hierarchy: parent or nested, required or optional, and related to a specific Course or unrelated to a specific Course."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_program_plan.htm",
      connections: [{ planet: "pathways", desc: "SSH Pathways provides visual display of Program Plans" }]
    },
    {
      id: "plan-requirements",
      name: "Plan Requirements",
      icon: "\u{2705}",
      desc: "Individual requirements within a Program Plan. Support parent-child nesting for requirement groups (e.g., 'Complete 3 of the following'). Link to specific Courses when applicable. Requirements can be categorized as Required, Optional, or Elective, each with credit hour values and sequencing.",
      tags: ["Plan_Requirement__c"],
      docs:["The Plan Requirement object represents specific requirements such as specific Courses, thesis work, internships, and so on. Plan Requirement records are typically part of a hierarchy where parent Plan Requirements organize higher-level categories and child Plan Requirements can be nested at multiple levels to detail the specifics. A plan might have a Lower Division requirement of 72 units containing Core Sciences, Mathematics, General Electives, and Service Learning sub-requirements.","Different flavors of Plan Requirement records make up the hierarchy: parent or nested, required or optional, and related to a specific Course or unrelated to a specific Course. For example, a Mathematics requirement might have two optional tracks, Applied and Theory, each containing specific course requirements. General Elective requirements might specify a number of units in a category from any qualifying Course rather than linking to specific Course records.","In K-12 and non-degree contexts, Plan Requirements work the same way. An after-school program might organize requirements into After-School Learn, After-School Refuel and Nutrition, and After-School Recreation categories, with optional sub-requirements for specific activities like tutoring, chess, art studio, and basketball. This flexibility makes the Plan Requirement hierarchy suitable for modeling any structured program at any level of education."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_plan_requirement.htm",
      connections: [{ planet: "courses", desc: "Requirements reference specific Course records" }]
    },
    {
      id: "program-enrollment",
      name: "Program Enrollment",
      icon: "\u{1F4DD}",
      desc: "Tracks a student's enrollment in an academic program with admission date, status, GPA, and expected graduation. Auto-syncs with Affiliation records. Students can have multiple Program Enrollments representing their major, minor, concentration, study abroad, and other program participations.",
      tags: ["Program_Enrollment__c"],
      docs:["Program Enrollments track students enrolling in degree programs, other types of academic programs, or programs in general. A Program Enrollment record relates a student Contact to an Academic Program Account record, capturing enrollment dates, status, GPA, expected graduation date, and class standing. Looking at the full list of Program Enrollments on a student's Contact record shows how their interests shape their educational journey, with separate enrollments for their major degree, concentration, minor degree, and specialized study programs.","The Program Enrollment object works in parallel with the Affiliation object, with automation keeping data in sync. When a Program Enrollment is created, a corresponding Affiliation record is created automatically at the same time. Even though the Affiliation connects the same two records, it tracks more general-purpose data and applies to all types of Contacts, not just students. Program Enrollment details are tracked in a separate but related object because they do not apply to all types of Affiliations or all types of Contacts.","Course Connections can be linked to Program Enrollments to track which courses count toward satisfying a Program Plan's requirements. If you create a Course Connection in the context of a Contact's Program Enrollment, the Program Enrollment identifier is automatically filled in. This relationship enables views such as drilling down from a Program Enrollment record to see the Course Connections that count toward the Academic Program's requirements."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_model_program_offerings.htm",
      connections: [{ planet: "affiliations", desc: "Program Enrollment creates corresponding Affiliations" }]
    },
    {
      id: "academic-certifications",
      name: "Academic Certifications",
      icon: "\u{1F3C6}",
      desc: "Tracks degrees, certificates, and credentials awarded to students upon program completion. Links to the Program Plan and Contact for historical recordkeeping. Preconfigured record types include Degree, Diploma, and Certificate to distinguish different types of academic achievements.",
      tags: ["Academic_Certification__c"],
      docs:["An Academic Certification identifies that a person has completed a course of study. It represents a diploma, degree, or academic certificate and is associated with a Contact's Education History record. Examples include a high school diploma, a Bachelor of Arts degree from a university, or a certificate acknowledging completion of a teacher training program. Preconfigured record types include Degree, Diploma, and Certificate.","The Academic Certification object works together with the Credential, Education History, and Program Enrollment objects to give a complete understanding of a student's achievements. You can see that a student earned a degree from a specific institution by completing a program of study. For example, a Contact's Education History section shows the diplomas and degrees previously earned, with each Education History record listing a certification from an educational institution.","Academic Certifications differ from Credentials in an important way. An Academic Certification represents a diploma, degree, or academic certificate earned through completing a course of study, while a Credential represents an industry or organizational achievement such as a badge, non-credit certification, or license. Credentials are associated with a Contact's Attribute record rather than Education History, and represent one-time accomplishments that are not part of an academic program."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_model_certifications_and_credentials.htm",
      connections: [{ planet: "accounts_contacts", desc: "Certifications are awarded to Contact records" }]
    }
  ],
  dataFlow: [
    "An institution defines a Program Plan with nested Plan Requirements representing core courses, electives, and concentrations",
    "A student is enrolled through a Program Enrollment record linked to the Program Plan and Contact",
    "EDA automatically creates a corresponding Affiliation record for the student's department",
    "As the student completes courses, Plan Requirements are tracked against the program structure",
    "Upon completion, an Academic Certification record is created documenting the awarded degree or credential"
  ],
  connections: [
    { planet: "affiliations", desc: "Enrollments sync with organizational Affiliations" },
    { planet: "courses", desc: "Plan Requirements reference Course records" },
    { planet: "pathways", desc: "SSH Pathways visualizes Program Plans for students" },
    { planet: "academic_performance", desc: "Grades track progress toward program completion" },
    { planet: "education_history", desc: "Prior programs feed into Education History" }
  ]
},

courses: {
  packages: ['edassh'],
  name: "Courses & Scheduling",
  icon: "\u{1F4DA}",
  color: "#06b6d4",
  description: "Manages the course lifecycle from catalog definition through term-specific offerings, student and faculty enrollment, and class scheduling. Course Connections link students and instructors to specific offerings with enrollment status tracking. Time Blocks and Schedules organize class meeting patterns across campus facilities.",
  components: [
    {
      id: "course-catalog",
      name: "Course Catalog",
      icon: "\u{1F4D6}",
      desc: "Course definitions with name, code, credit hours, department, and description. Courses exist independently of terms and are reused across multiple offerings. A Course on its own is an abstract idea representing a syllabus of material, always under the purview of a specific department as a child record of that department's Account record.",
      tags: ["Course__c"],
      docs:["A Course on its own is an abstract idea: a class with a syllabus of material typically worth a certain number of credit hours. It is always under the purview of a specific department as a child record of that department's Account record. For example, the Data Science Department might offer Probability Theory Fundamentals nearly every semester as a four-unit course. The Course record captures the catalog-level definition while Course Offerings make it concrete in time and space for a specific term.","While a Course is often related in practice to multiple Academic Programs, each Course record is technically associated with only one Account. The type of related Account can vary by institution. At a university or high school, the related Account often has the Academic Department record type. In K-12 settings, the related Account often has the Educational Institution record type. For cross-listed courses, each collaborating department typically maintains its own Course record and Course Offering record with identical scheduling, credit hours, and instructor details.","Course data is typically imported during implementation from your institution's Student Information System or course catalog. The Course ID field provides a helpful text value for representing Courses in a course catalog, such as ENG-211 or CS-101. Taking the time to add past Courses and Course Offerings during data migration is particularly important as it allows you to represent a student's full course history."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_model_courses_curricula.htm",
      connections: [{ planet: "academic_programs", desc: "Courses fulfill Program Plan requirements" }]
    },
    {
      id: "course-offerings",
      name: "Course Offerings",
      icon: "\u{1F4C5}",
      desc: "Term-specific instances of a Course with capacity, location, start/end dates, and section number. Each offering is linked to a Term and a Course record.",
      tags: ["Course_Offering__c"],
      docs: ["Course Offerings represent a specific section or instance of a Course being delivered in a particular Term. Where a Course record defines the subject matter, learning objectives, and credit hours for an academic subject, a Course Offering captures the operational details: the assigned instructor, physical or virtual location, maximum enrollment capacity, start and end dates, and section number. Multiple offerings for the same Course can exist within a single Term, allowing institutions to run parallel sections with different instructors or schedules.", "Administrators and registrars create Course Offerings by associating them with a parent Course and a Term record. The Capacity field determines how many Enrollment records can be linked to the offering before it is considered full; EDA does not automatically enforce this limit, but it is exposed for use in custom validation rules or automation. Course Offering records also support custom fields and record types, enabling institutions to differentiate between in-person, online, hybrid, and laboratory sections.", "In practice, Course Offerings are the anchor for student enrollment. When a student registers for a class, an Enrollment record is created linking the student Contact to the Course Offering, with a status field tracking progression through pending, enrolled, dropped, or completed states. Reporting on Course Offerings reveals real-time enrollment counts, identifies under-enrolled sections at risk of cancellation, and provides the foundation for academic analytics such as seat utilization and faculty load calculations."],
      connections: [{ planet: "education_history", desc: "Offerings use Facility records for location" }]
    },
    {
      id: "course-connections",
      name: "Course Connections",
      icon: "\u{1F517}",
      desc: "Student and faculty enrollment in Course Offerings. Tracks enrollment status (Current, Former), role (Student, Faculty), and related Program Enrollment. Preconfigured record types distinguish between Student and Faculty connections, with a Primary field available for designating the primary instructor of each offering.",
      tags: ["Course_Connection__c"],
      docs:["Use the Course Connection object to model all of a Contact's connections to a Course Offering. You can use Course Connection record types to specify the nature of a Contact's involvement in a Course Offering. Preconfigured Student and Faculty record types account for most people involved. For Faculty Course Connection records, use the Primary field to specify the primary instructor for a Course Offering. You can also create custom record types such as Teaching Assistant or Staff Support.","For Student Course Connections, it can be useful to know which ones count toward satisfying a Program Plan's requirements. You can use the Program Enrollment field on a Course Connection record to track this relationship. If you create the Course Connection in the context of a Contact's Program Enrollment, such as from the Course Connections related list on the Program Enrollment record, the field is automatically filled in.","Course Connections provide useful views of related data. From a Course Offering record, you can see all the Term Grades issued to students enrolled in that term's offering. From a faculty member's Contact record, you can see the history of their involvement with various Course Offerings and the distribution of their teaching responsibilities. From a student's Contact record, you can scan through their full list of Course Connection records to see their coursework history."],
      connections: [{ planet: "academic_performance", desc: "Course Connections carry grade information" }]
    },
    {
      id: "class-scheduling",
      name: "Class Scheduling",
      icon: "\u{23F0}",
      desc: "Course Offering Schedules define meeting patterns (days, start/end times) for each offering. Time Blocks represent reusable time slot definitions.",
      tags: ["Course_Offering_Schedule__c", "Time_Block__c"],
      docs: ["Class Scheduling in EDA is managed through two related objects: Course Offering Schedules and Time Blocks. A Time Block defines a reusable time slot template with a start time, end time, and descriptive name, such as MWF 9:00-9:50 AM or TR 2:00-3:15 PM. Course Offering Schedules link a specific Course Offering to one or more Time Blocks, along with the days of the week on which the class meets, creating the complete meeting pattern for a section.", "Administrators configure Time Blocks centrally to standardize the scheduling slots available across all departments. Once Time Blocks are established, faculty schedulers select the appropriate block when creating Course Offering Schedules rather than entering raw times manually. This approach prevents scheduling inconsistencies and ensures all meeting patterns conform to institutional standards. Multiple Course Offering Schedules can be created for a single offering to represent complex patterns, such as a lecture on Mondays and Wednesdays with a separate lab session on Fridays.", "In practice, class scheduling data feeds room assignment workflows and faculty workload reporting. Schedule conflicts for students or instructors across their enrolled and assigned offerings can be detected by querying overlapping Course Offering Schedules. Institutions building custom room booking integrations use Time Block and Course Offering Schedule data to determine when each classroom must be available, while the structured meeting pattern data improves student communication by surfacing formatted schedules rather than raw timestamps."],
      connections: [{ planet: "appointments", desc: "Class schedules inform appointment availability" }]
    },
    {
      id: "term-management",
      name: "Term Management",
      icon: "\u{1F4C6}",
      desc: "Academic terms (semesters, quarters, trimesters) with start/end dates and grading period sequences. Supports parent-child hierarchies for nested terms.",
      tags: ["Term__c"],
      docs: ["Terms in EDA represent defined academic periods, such as semesters, quarters, trimesters, or mini-sessions, during which courses are offered and enrollment is tracked. Each Term record stores a name, start date, end date, and an associated grading period sequence that controls when grades are due and when grades become official. Terms are institution-wide records used across all schools or colleges in the organization, ensuring consistent academic calendar data for scheduling and reporting.", "EDA supports parent-child term hierarchies, allowing a full academic year to be the parent of individual semester or quarter terms. This structure is useful for institutions that need to report enrollment at both the annual and sub-period level, or that run programs with non-standard session lengths nested within a primary semester. Administrators create Terms through standard Salesforce record creation; access is governed by standard object-level permissions since there is no dedicated Terms page in EDA Settings.", "In practice, Terms are a prerequisite for creating Course Offerings and for managing Enrollment records. Without a published Term record, course sections cannot be offered and students cannot enroll. End-of-term processes such as grade entry, enrollment status transitions, and academic standing calculations are typically triggered by automation that references the Term's end date. Many institutions also use Term records as filter criteria in list views and reports to scope data to the current or upcoming academic period."],
      connections: [{ planet: "academic_performance", desc: "Terms organize grading periods" }]
    }
  ],
  dataFlow: [
    "An administrator creates Course records in the catalog with credit hours, department, and prerequisites",
    "Each term, Course Offerings are generated linking Courses to specific Terms with capacity and location",
    "Students enroll through Course Connection records that tie a Contact to a Course Offering with status tracking",
    "Faculty are also linked via Course Connections with a Faculty role, enabling class roster management",
    "Course Offering Schedules define meeting patterns using Time Block templates for consistent scheduling"
  ],
  connections: [
    { planet: "academic_programs", desc: "Courses fulfill Plan Requirements" },
    { planet: "academic_performance", desc: "Grades are recorded for Course Connections" },
    { planet: "affiliations", desc: "Course enrollment depends on program Affiliations" },
    { planet: "pathways", desc: "Pathways references Course records for degree planning" },
    { planet: "tdtm_settings", desc: "TDTM manages Term date cascade to Offerings" },
    { planet: "education_history", desc: "Facilities serve as Course Offering locations" },
    { planet: "appointments", desc: "Class schedules inform appointment availability" }
  ]
},

academic_performance: {
  packages: ['edassh'],
  name: "Academic Performance",
  icon: "\u{1F4CA}",
  color: "#f59e0b",
  description: "Tracks student academic outcomes including term grades, standardized test scores, and attendance patterns. Term Grades record performance per course per grading period. Test and Test Score objects manage assessment definitions and individual results. Attendance Events track class participation, absences, and tardiness.",
  components: [
    {
      id: "term-grades",
      name: "Term Grades",
      icon: "\u{1F4DD}",
      desc: "Grade records per Contact per Term. Tracks letter grade, GPA, credit hours attempted/earned, and class rank. Links to Course Connection for course-specific grading. Use the Term Grade object to model students' major grade milestones, building a higher-level overview of performance in individual classes and in their academic track overall.",
      tags: ["Term_Grade__c"],
      docs:["Institutions typically use a learning management system or student information system to record periodic grade assessments such as assignments and exams. With EDA, the focus is on creating a unified 360-degree student profile that complements your other systems rather than replacing them. Use the Term Grade object to model students' major grade milestones so that you can build a higher-level overview of performance in students' individual classes and in their academic track overall.","A Term Grade record captures a student's grade in a Course Offering using your preferred grading scale: letter, numerical, or percentage grade. It can also categorize what the grade represents, such as Pass or Fail. Because Term Grades represent major grade milestones that correspond to multiple grading periods within a Term, a single Course Offering can result in multiple Term Grade records for each student, such as mid-term and final grades.","The Term Grade object has a high degree of relatedness, tying together data from the Contact, Course Offering, Course Connection, and Term objects. This means that after collecting Term Grade data and adding the Term Grade field to page layouts for records such as Course Offering or Contact, it becomes easy to see students' grades in various useful contexts. Setting up reports and dashboards to proactively monitor student progress and performance is a natural next step."],
      connections: [{ planet: "courses", desc: "Grades are recorded for specific Course Connections" }]
    },
    {
      id: "testing",
      name: "Test Definitions",
      icon: "\u{1F4CB}",
      desc: "Standardized assessment definitions (SAT, ACT, GRE, institutional exams) with score ranges, sections, and administration details.",
      tags: ["Test__c"],
      docs: ["Test records in EDA define the metadata for standardized assessments: their name, score range, administered sections, and description. Tests represent the abstract definition of an exam such as the SAT, ACT, GRE, or an institution's own placement exam, rather than a specific administration event. Each Test record can have multiple child Test Section records, which break the assessment into component areas such as SAT Evidence-Based Reading and Writing or SAT Math, each with its own minimum and maximum score range.", "Administrators create Test records to establish the assessment catalog available for tracking student results. Required fields include the Test Name and whether the test is composite (a single total score) or sectioned. For sectioned tests, Test Section records are created as child records of the Test, each specifying the section name and valid score boundaries. This structured definition ensures that Test Score records entered for students can be validated against the expected score range for each section.", "Test records serve primarily as reference data that give Test Score records their context and structure. Admissions teams use them to standardize how standardized test results are captured across all applicants, enabling accurate filtering such as finding all applicants with an ACT Composite above 30 and aggregate reporting on incoming class academic profiles. Institutions that accept multiple versions of an exam may create separate Test records to distinguish legacy and current scoring scales."],
      connections: [{ planet: "education_history", desc: "Tests support admissions and credential evaluation" }]
    },
    {
      id: "test-scores",
      name: "Test Scores",
      icon: "\u{1F4AF}",
      desc: "Individual student results on assessments. Records score value, percentile, test date, and section breakdown. Multiple scores per Test per Contact supported.",
      tags: ["Test_Score__c"],
      docs: ["Test Score records capture individual student results on a specific standardized assessment or section. Each Test Score links to a Contact (the student), a Test or Test Section record (the assessment definition), and stores the actual score value, the test date, and optionally the score percentile. EDA supports multiple Test Score records per Contact per Test, allowing the system to retain every attempt and enabling reporting on highest scores, most recent scores, or score trends over time.", "Test Scores are created through manual data entry by admissions or registrar staff, or through integration with testing agencies and applicant tracking systems. The score field is a numeric value validated against the score range defined on the parent Test Section if applicable. Institutions frequently build custom page layouts that surface Test Score records directly on the Contact or Application record, giving reviewers immediate visibility into academic credentials without navigating to the related list.", "In practice, Test Scores power admissions decision workflows and academic placement logic. Automated rules can check whether a student's highest Math section score meets the minimum threshold for a particular program, placing them into the appropriate orientation track or waiving prerequisite course requirements. Aggregate reporting across Test Score records helps institutions track year-over-year trends in applicant academic preparation, benchmark incoming class profiles, and assess the effectiveness of recruitment in academically competitive markets."],
      connections: [{ planet: "accounts_contacts", desc: "Test Scores belong to Contact records" }]
    },
    {
      id: "attendance-tracking",
      name: "Attendance Tracking",
      icon: "\u{1F4C8}",
      desc: "Attendance Event records for tracking presence, absence, tardy, and excused status per class session. Supports both K-12 daily attendance and higher ed per-class tracking. Absences are often an early warning indicator that a student might need intervention to stay on track for passing a course or graduating.",
      tags: ["Attendance_Event__c"],
      docs:["For attendance management, the Attendance Event object helps you track students' tardiness or absences, reasons for missed attendance, and total participation during a Term. An Attendance Event record is always related to a Contact and always specifies a date. Other details, such as whether the missed attendance is for a specific Course Connection and whether it is unexcused, are optional. If your institution tracks tardiness or partial-day absences, you can also track arrival, departure, and return times.","Changes in a student's attendance might indicate that something is going on in their life that could affect their educational success. Consistent tardiness or absence is an early warning indicator that a student might need intervention to stay on track. At a university, you can track the number of days and reasons a student has missed a specific course. In K-12 settings, track tardiness or absence for a class period or entire day along with the reasons. Any educational institution can determine a student's total participation during a term and generate reports on the frequency of such events.","If you implement behavior management features alongside attendance tracking, the data you gather becomes a powerful tool for continuous monitoring. Use Salesforce reports, dashboards, and data analytics to stay on top of case resolution, detect at-risk behavior patterns, and learn which interventions support student success the most. In Student Success Hub, attendance patterns can trigger automated Alerts that route to the appropriate support staff for follow-up."],
      connections: [{ planet: "alerts", desc: "Attendance patterns can trigger SSH Alerts" }]
    }
  ],
  dataFlow: [
    "Students attend classes tracked through Attendance Event records per Course Offering session",
    "At the end of each grading period, Term Grade records capture letter grades, GPA, and credit hours",
    "Standardized test results are recorded as Test Score records linked to predefined Test definitions",
    "Academic performance data feeds into advisement tools, surfacing students who need intervention",
    "Grade trends and attendance patterns trigger automated Alerts through Student Success Hub"
  ],
  connections: [
    { planet: "courses", desc: "Grades and attendance link to Course Connections and Offerings" },
    { planet: "academic_programs", desc: "Cumulative performance tracks program progress" },
    { planet: "alerts", desc: "Poor performance triggers early intervention Alerts" },
    { planet: "student_cases", desc: "Performance data informs Student Record Cases" },
    { planet: "pathways", desc: "Grade completion drives requirement fulfillment in Pathways" }
  ]
},

education_history: {
  packages: ['edassh'],
  name: "Education History",
  icon: "\u{1F4DC}",
  color: "#a855f7",
  description: "Tracks prior educational experience, professional credentials, student attributes, and campus facilities. Education History records document previous institutions attended, degrees earned, and transfer credits. Credentials track licenses, endorsements, and professional certifications. Attributes capture student support needs and accommodations. Facilities model campus buildings and rooms.",
  components: [
    {
      id: "education-records",
      name: "Education Records",
      icon: "\u{1F3EB}",
      desc: "Prior education tracking for students. Records previous institutions, degrees earned, dates attended, and fields of study. Supports transfer credit evaluation. Education History records are commonly created during admissions to document a student's educational background from applications and supporting documents.",
      tags: ["Education_History__c"],
      docs:["Education History stores information about a Contact's prior educational experience at other institutions. The object captures the institution name, degree type, field of study, dates attended, GPA, and graduation status. For example, when a university receives an applicant's educational history data from their Application, it structures the data in Education History records linking each prior institution to the applicant's Contact record.","Education History records work together with Academic Certification and Program Enrollment objects to give a complete understanding of a student's academic background. Looking at the Education History section of a Contact record, you can see the diplomas and degrees previously earned, with each record listing a certification that was earned from an educational institution. This provides admissions staff with a comprehensive view for evaluating transfer credits and prior academic achievement."],
      connections: [{ planet: "accounts_contacts", desc: "Education History belongs to Contact records" }]
    },
    {
      id: "credentials",
      name: "Credentials",
      icon: "\u{1F4C4}",
      desc: "Professional licenses, certifications, and endorsements held by contacts. Tracks issuing authority, expiration dates, and verification status. Credentials represent industry or organizational achievements such as badges, non-credit certifications, or licenses, and are associated with a Contact's Attribute record.",
      tags: ["Credential__c"],
      docs:["The Credential object represents an industry or organizational achievement that is a one-and-done certification with no academic components. Credentials can be a badge, a non-credit certification, or a license. These records are associated with a Contact's Attribute record using the Credential record type. Examples include a badge issued by your institution for a specific achievement, a teaching certificate issued by a state, or a bus driver's Commercial Driver's License.","Knowing whether a faculty member has the proper credentials to teach a course or knowing whether a student has characteristics that might require additional support can improve your institution's delivery of services. The Attribute object with the Credential record type is especially useful for tracking requirements of certificated or professionally licensed staff, including agency names, expiration dates, and verification status. Some credentials have an International Resource Identifier that uniquely identifies the credential, which can be tracked using a custom Credentialing Identifier field."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_model_certifications_and_credentials.htm",
      connections: [{ planet: "academic_programs", desc: "Credentials may result from program completion" }]
    },
    {
      id: "attributes",
      name: "Attributes",
      icon: "\u{1F3F7}",
      desc: "Flexible tagging system for student characteristics: accommodations, disability services, support needs, financial aid eligibility, and achievement badges. The preconfigured Student Characteristic record type tracks data such as family considerations and Individualized Education Program participation, while the Credential record type tracks professional licenses and certifications.",
      tags: ["Attribute__c"],
      docs:["The Attribute object lets you track students' significant attributes, and faculty and staff members' licenses, certifications, and professional endorsements. Preconfigured record types include Credential for tracking licenses and certifications earned by staff or students, and Student Characteristic for tracking important student characteristics that might affect students' education. You can also create additional record types, such as an Honor record type for students on the Dean's List or graduating with honors.","In university settings, use the Credential record type to track the agency and expiration date of a law professor's State Bar Association license. In K-12 contexts, track characteristics like whether a student is in foster care or qualifies for free lunch, or whether a faculty member has a Multiple Subject Teaching Credential. At any educational institution, track student characteristics like special-needs accommodations, Individualized Education Program participation, and similar support needs."],
      connections: [{ planet: "student_cases", desc: "Attributes inform student support planning" }]
    },
    {
      id: "facilities",
      name: "Facilities",
      icon: "\u{1F3D7}",
      desc: "Campus buildings, classrooms, labs, dormitories, and sports facilities. Supports hierarchy (building > floor > room) and capacity tracking for scheduling. Facility records can track the property type and capacity, the department responsible for a facility, the primary contact, student housing assignments, and class locations.",
      tags: ["Facility__c"],
      docs:["Use the Facility object along with related objects to track data about buildings, lab facilities, dormitories, sports facilities, and other property assets. Example data you can track includes the property type and capacity, the building that a classroom is located within using parent Facility records, the department Account responsible for a Facility, the staff or faculty member who is a Facility's primary contact, the student assigned to a dorm room, and the class location through Course Offering records.","Facility records can be organized in a hierarchy so that you can define in detail how property assets are related, such as a Facility record under a parent Facility record. For example, the RSF Pool might be part of the larger Recreational Sports Facility complex, which is administered by the Office of Real Estate and Facilities. Course Offering Schedule records reference Facility records to track where classes meet, with the ability to specify different facilities for different days of the week when schedule patterns vary."],
      connections: [{ planet: "courses", desc: "Facilities serve as locations for Course Offerings" }]
    }
  ],
  dataFlow: [
    "During admissions, Education History records are created documenting prior institutions and achievements",
    "Credential records capture professional licenses and certifications for faculty and graduate students",
    "Attribute records tag students with accommodations, support needs, and eligibility markers",
    "Facility records define campus locations used for Course Offering assignments and room scheduling",
    "All records contribute to the 360-degree view of a student's academic background and campus context"
  ],
  connections: [
    { planet: "accounts_contacts", desc: "History, credentials, and attributes belong to Contacts" },
    { planet: "academic_programs", desc: "Prior education informs program placement" },
    { planet: "courses", desc: "Facilities provide Course Offering locations" },
    { planet: "student_cases", desc: "Attributes inform student support needs" }
  ]
},

behavior: {
  packages: ['edassh'],
  name: "Behavior & Conduct",
  icon: "\u{1F6A8}",
  color: "#e11d48",
  description: "Tracks behavioral incidents using Cases with specialized Behavior Involvement and Behavior Response objects. Behavior Involvement records identify all parties in an incident with their roles (Witness, Victim, Offender). Behavior Responses document institutional corrective actions, sanctions, and follow-up. Commonly used in K-12 but applicable to higher education conduct systems.",
  components: [
    {
      id: "behavior-incidents",
      name: "Behavior Incidents",
      icon: "\u{1F4C1}",
      desc: "Case records tracking code of conduct violations, disciplinary events, and campus incidents. Each Case captures date, location, type, and severity. EDA custom fields on the standard Case object include Category for classifying the type of event and Location for tracking where it occurred (on campus or off campus).",
      tags: ["Case"],
      docs:["Sometimes student interactions do not meet your institution's behavior expectations. Other times, student actions embody the highest values expressed in a school's honor code. For monitoring both problematic and praiseworthy behavior, use the Case, Contact, Behavior Involvement, and Behavior Response objects as part of an overall behavior management program. EDA custom fields added to the standard Case object track the type of behavior event and when and where it occurred.","Behavior Involvement is a junction object that relates individual Contacts to the behavior event, including the students involved and perhaps a faculty member who witnessed or reported the event. Each involved party is assigned a role such as Perpetrator, Victim, Witness, or Reporter. Another custom object, Behavior Response, tracks the corrective or affirmative responses applied to the Contacts involved, such as referrals to peer mediation programs or assigned community service hours.","If you decide to implement EDA behavior management features, the data you gather becomes a powerful tool for continuous monitoring. Use Salesforce reports, dashboards, and data analytics to stay on top of case resolution, detect at-risk behavior patterns, and learn which interventions support student success the most. In K-12 contexts, behavior tracking is integrated with the K-12 Architecture Kit, while in higher education, it can be used alongside Student Success Hub Alerts for comprehensive student support."],
      connections: [{ planet: "student_cases", desc: "Behavior Cases are related to Student Record Cases" }]
    },
    {
      id: "behavior-involvement",
      name: "Behavior Involvement",
      icon: "\u{1F465}",
      desc: "Records each Contact's involvement in a behavior incident with a specific role (Reporter, Witness, Victim, Offender) and description of their participation. Multiple involvement records per Case allow documenting all parties in an incident, from the students involved to faculty members who witnessed or reported the event.",
      tags: ["Behavior_Involvement__c"],
      docs:["Understanding a student or faculty member's role in a behavior event can help you develop appropriate responses. The Behavior Involvement object is a junction object that relates individual Contacts to a behavior event tracked as a Case. At a university, you might track involvement of a student who is the victim of a theft, a roommate who is the perpetrator, and a Resident Advisor who is the witness or reporter. In K-12 settings, track involvement in bullying incidents with roles for the victim, perpetrator, and faculty witnesses.","Before you create a Behavior Involvement record, you must first create a Case record for the behavior event. From the Case record, you add Behavior Involvement records for each person involved, specifying their Contact name and role. After documenting all involvement, you create Behavior Response records to track post-incident corrective actions for the people involved, such as referrals to peer mediation programs, assigned community service hours, counseling referrals, or other institutional responses."],
      connections: [{ planet: "accounts_contacts", desc: "Involvement records reference Contact records" }]
    },
    {
      id: "behavior-responses",
      name: "Behavior Responses",
      icon: "\u{1F4DD}",
      desc: "Institutional responses to behavior incidents: warnings, suspensions, counseling referrals, community service, and other corrective actions with dates and status. Response records track the type of response, completion status, and any conditions or follow-up requirements assigned to the involved Contacts.",
      tags: ["Behavior_Response__c"],
      docs:["Tracking responses to specific Behavior Involvements, and their statuses, helps ensure that reported behavior events are addressed. At a university, you might track the referral of an incident to authorities for a state offense like a car accident on campus. In K-12 settings, track the probation period for a student whose action goes against the school's code of conduct. Any educational institution can track the number of a certain type of response, such as expulsions or probations, or the number of responses that are in progress or completed.","Behavior Response records are created from the Behavior Involvement record for each individual involved in the incident. You specify the type of response, such as a referral to a peer mediation program, assigned community service hours, or counseling referral. Optional fields capture start and end dates for the response period, status tracking, and descriptive notes about conditions and follow-up requirements. This structured approach to documenting responses creates an audit trail that supports both accountability and student support."],
      connections: [{ planet: "alerts", desc: "Repeated behavior may trigger SSH Alerts" }]
    }
  ],
  dataFlow: [
    "A behavioral incident is reported and documented as a Case record with type and severity classification",
    "Behavior Involvement records are created for each Contact involved, capturing their role in the incident",
    "Administrators determine appropriate responses and create Behavior Response records with corrective actions",
    "TDTM triggers ensure data consistency and cascade updates across related records"
  ],
  connections: [
    { planet: "accounts_contacts", desc: "Behavior records reference Contact records" },
    { planet: "student_cases", desc: "Behavior Cases inform Student Record Cases" },
    { planet: "alerts", desc: "Behavior patterns can trigger student Alerts" },
    { planet: "tdtm_settings", desc: "TDTM automates behavior record management" }
  ]
},

tdtm_settings: {
  packages: ['edassh'],
  name: "TDTM & Settings",
  icon: "\u{2699}",
  color: "#64748b",
  description: "Table-Driven Trigger Management (TDTM) is EDA's automation framework. Over 50 configurable trigger handlers manage data consistency across all EDA objects: Account-Contact sync, address propagation, Affiliation auto-creation, Program Enrollment sync, relationship reciprocals, and more. Each handler can be enabled/disabled, reordered, and filtered without code changes. EDA Settings provide centralized configuration for the entire platform.",
  components: [
    {
      id: "trigger-handlers",
      name: "Trigger Handlers",
      icon: "\u{1F527}",
      desc: "50+ configurable trigger handler records controlling Apex automation. Each handler specifies the object, event (before/after insert/update/delete), class name, and load order. Administrators can enable, disable, reorder, and filter handlers without modifying any code, making it possible to customize automation behavior through configuration alone.",
      tags: ["Trigger_Handler__c"],
      docs:["EDA has a number of automation features available thanks to Table-Driven Trigger Management. It is important to understand which handlers control which behavior to prevent unnecessary data from being created automatically. Key handlers include the Account Individual Accounts handler which creates container Accounts for new Contacts, the Address Contact handler which manages address synchronization, the Contact Preferred handlers which manage email and phone syncing, and the Relationship handler which creates reciprocal relationship records.","Each handler record defines an Apex class to execute on a specific object event such as before insert, after insert, before update, after update, before delete, after delete, or after undelete. Handlers can be enabled or disabled, reordered via load order values, and filtered without modifying Apex code. Over 50 default handlers ship with EDA, covering Account-Contact synchronization, address propagation, Affiliation auto-creation, Program Enrollment sync, and relationship reciprocals.","Administrators should familiarize themselves with the full list of trigger handlers before disabling any automation settings, especially during data migration. During data import, certain handlers such as the delete prevention handlers should be disabled to allow bulk operations. After migration completes, these handlers should be re-enabled. The User Managed checkbox on a handler record indicates whether it was created by an administrator versus shipped with EDA."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_tdtm_overview.htm",
      connections: [{ planet: "accounts_contacts", desc: "Handlers automate Account-Contact operations" }]
    },
    {
      id: "eda-settings",
      name: "EDA Settings",
      icon: "\u{1F3DB}",
      desc: "Centralized configuration panel for EDA behavior: Account model preferences, Affiliation mappings, relationship auto-creation, address defaults, and error handling. Accessible from the Education Cloud Settings page, which provides a single location for all settings, tools, and resources needed to manage your Education Cloud organization.",
      tags: ["Trigger_Handler__c"],
      docs:["In EDA 1.114 (Summer 2021), EDA introduced the Education Cloud Settings page as a single location for all settings, tools, and resources you need to manage your Education Cloud organization. Use Education Cloud Settings to access EDA Settings for org-wide administration of the Account model, contact information, Relationships, Affiliations, Courses and Enrollments, Errors, and system tools. It also provides Settings Health Check to identify configuration inconsistencies and Release Management to review and activate the latest EDA release.","EDA Settings provides detailed configuration for every aspect of the platform. Account Model settings control the default container account type, naming formats for Administrative and Household Accounts, and Lead conversion behavior. Contact Information settings manage preferred email and phone synchronization. Affiliation settings configure primary affiliation mappings and auto-enrollment behavior. Address settings control multiple address support for different account types.","Settings Health Check identifies configuration inconsistencies or errors in EDA Settings and related settings in Setup. This tool helps administrators quickly find mismatches between Relationship reciprocal settings and picklist values, incorrect Affiliation mappings, or disabled trigger handlers that should be active. Running Health Check regularly, especially after configuration changes, helps maintain a healthy and consistent EDA installation."],
      docUrl:"https://help.salesforce.com/s/articleview?id=sfdo.eda_education_cloud_settings.htm",
      connections: [{ planet: "affiliations", desc: "Settings control Affiliation auto-creation mappings" }]
    },
    {
      id: "installation-admin",
      name: "Installation & Administration",
      icon: "\u{1F4E6}",
      desc: "Package installation prerequisites, compatibility requirements, version management, release activation, and health check utilities for EDA administration.",
      tags: ["Trigger_Handler__c"],
      docs: ["Installation Admin encompasses the setup tasks required when first deploying EDA or upgrading to a new version. This includes verifying that prerequisite managed packages are installed at correct versions, enabling necessary platform features such as activities and opportunities, running the EDA Health Check, and activating the TDTM trigger handler records that power EDA automations. Without completing these steps, EDA features may be partially functional or produce errors on record save.", "After installing or upgrading EDA, administrators access the EDA Settings page and run the Health Check utility, which validates that all TDTM handler records exist and are active, that no required custom fields are missing, and that the org's trigger handler configuration matches expected package defaults. The Health Check produces a report of any discrepancies with remediation guidance. Administrators can also reset individual TDTM handler records to their default configuration if custom modifications have caused unexpected behavior.", "Version management is an ongoing responsibility for EDA administrators, particularly in orgs that also run NPSP or other packages sharing object metadata. Before upgrading EDA, administrators should review release notes for breaking changes, check compatibility with any custom TDTM handlers extending EDA classes, and run the Health Check in a sandbox. Post-upgrade, re-running the Health Check confirms that new handler records introduced in the release were successfully created and activated, and that deprecated settings were cleanly migrated."],
      connections: [{ planet: "student_cases", desc: "SSH installation builds on EDA foundation" }]
    },
    {
      id: "data-automation",
      name: "Data Automation Rules",
      icon: "\u{1F504}",
      desc: "Automated data consistency rules managed through TDTM: naming conventions, cascade updates, duplicate prevention, and cross-object synchronization logic.",
      tags: ["Trigger_Handler__c"],
      docs: ["Data Automation in EDA refers to the suite of automated consistency behaviors executed by TDTM trigger handlers when records are created, updated, or deleted. These automations enforce naming conventions such as automatically formatting household account names when Contacts are saved, synchronize data across related objects by updating the Primary Affiliation lookup when an Affiliation changes, cascade updates to child records, and enforce data integrity rules like preventing duplicate academic program enrollments. Each behavior is implemented as a separate TDTM trigger handler that can be enabled or disabled independently.", "Administrators control data automation behavior through the EDA Settings page and, for advanced scenarios, directly through TDTM Trigger Handler records in Setup. The EDA Settings page exposes the most commonly adjusted automations through a guided UI with explanatory text for each option. Trigger Handler records on the TDTM Configuration tab allow administrators to disable individual handlers for testing, adjust load order when multiple handlers affect the same object, or restrict a handler to specific record types. Changes to TDTM configuration should always be tested in a sandbox first.", "In practice, data automation reduces the manual reconciliation work that would otherwise fall to users and administrators. When a student's address changes, cascade update handlers propagate the change to affiliated household records. When an Affiliation is created with IsPrimary checked, the Primary Affiliation lookup handler synchronizes the Contact field without requiring user action. These automations are most impactful in high-volume admission and enrollment cycles where staff would otherwise need to perform repetitive record maintenance tasks across thousands of student records."],
      connections: [{ planet: "courses", desc: "Term date changes cascade to Course Offerings" }]
    }
  ],
  dataFlow: [
    "An administrator opens the EDA Settings page to configure platform behavior and automation rules",
    "Trigger Handler records define which Apex classes run on each object event (insert, update, delete)",
    "When a DML operation fires, the TDTM dispatcher loads the ordered list of active handlers for that object",
    "Each handler executes in sequence, performing data validation, sync, or cascade operations",
    "Administrators can disable, reorder, or add custom handlers without modifying Apex code"
  ],
  connections: [
    { planet: "accounts_contacts", desc: "TDTM automates Account-Contact synchronization" },
    { planet: "affiliations", desc: "Handlers manage Affiliation auto-creation and sync" },
    { planet: "courses", desc: "Term date cascading to Course Offerings" },
    { planet: "relationships", desc: "Reciprocal relationship automation" },
    { planet: "behavior", desc: "TDTM manages behavior record automation" }
  ]
},

// ─── STUDENT SUCCESS HUB ─────────────────────────────────────

student_cases: {
  packages: ['edassh'],
  name: "Student Cases & Teams",
  icon: "\u{1F4C2}",
  color: "#f97316",
  description: "The central hub of Student Success Hub. Every student has a primary Student Record Case that aggregates all support interactions, notes, alerts, success plans, and tasks. Success Teams assign support staff (advisors, counselors, coaches) to students through Case Team Members with configurable access levels. Support Pools provide unassigned departmental groups for services like Career Services or Financial Aid.",
  components: [
    {
      id: "student-record-case",
      name: "Student Record Case",
      icon: "\u{1F4C4}",
      desc: "The unified support record for each student. Aggregates success plans, alerts, tasks, appointments, and notes into a single case providing a 360-degree support view. The Student Snapshot component on the case page highlights essential details at a glance, including item counters for incomplete tasks, unresolved alerts, and upcoming appointments.",
      tags: ["Case"],
      docs:["Every student Contact is related to a single Case that represents the entirety of a student's interactions, activities, and assigned support staff. The standard Salesforce Case object is customized to serve as the Student Record Case, and this record has a related success team, Tasks, Success Plans, Alerts, and more. In higher education organizations, a Student Record Case can also be related to Appointments, Support Pools, and the objects used by Pathways for degree planning.","The Student Snapshot is a Lightning web component that appears on the Student Record Case page and highlights essential details about a student. By default, the higher education Student Snapshot shows the student's name, photo, primary academic program and department, item counters for incomplete tasks, unresolved alerts, and upcoming appointments, as well as the date of the student's last appointment, case status, and FERPA status. The Snapshot is highly customizable with the ability to change headline fields, detail fields, and item counters.","Student Success Hub uses Notes, the enhanced note-taking tool, to allow support staff to create and manage notes that respect students' confidentiality rights. Notes support continuity and provide shared historical context for the student and the success team. Support staff can add Notes to the utility bar for easy access. Custom shortcuts can also be added to the Student Record Case to give staff one-click access to external systems such as Student Information Systems or degree audit tools."],
      connections: [{ planet: "success_plans", desc: "Success Plans are created under Student Record Cases" }]
    },
    {
      id: "success-teams",
      name: "Success Teams",
      icon: "\u{1F46B}",
      desc: "Groups of support staff assigned to individual students via Case Team Members. Each member has a role defining their function (Academic Advisor, Career Coach, Financial Aid Counselor). Members can be individual Users who log in and schedule appointments, or Contacts in secondary support roles such as peer advising, mentoring, or tutoring.",
      tags: ["Case"],
      docs:["Everyone who serves in a support role is considered part of a student's success team. For students, knowing who to ask for help removes a big barrier to seeking support. For support staff and departments, having visibility into and easy access to other success team members helps maintain a strong, informed support network for every student. Success teams leverage the Case, Contact, and User objects.","Every success team member must have a specific case team role. Roles determine more than just the type of membership: they determine whether the member has read, write, or no access to student data. In organizations with student users and a portal, case team roles also determine whether the member is visible to students and are used to associate support staff with the appointment Topics they are available to discuss. In K-12 organizations, roles typically align to job functions such as Counselor, Social Worker, Teacher, and Principal. In higher education, roles typically align to support areas such as Academic, Career, Financial Aid, Health, and Housing.","If support staff often assign the same set of individuals to a success team, predefined case teams can be created. A predefined case team can be assigned in a single action with support roles for each member already specified. When a predefined case team's membership is updated, the changes are reflected on the success teams that use it, keeping data current when personnel changes occur. In addition to manual assignment, Process Builder or flows can be used to automate case team assignment for advanced cases."],
      connections: [{ planet: "student_portal", desc: "Students see their Success Team in the portal" }]
    },
    {
      id: "support-pools",
      name: "Support Pools",
      icon: "\u{1F3CA}",
      desc: "Unassigned support groups representing departments or services (Career Center, Financial Aid, Tutoring). Students can request help from any available pool member. Each Support Pool is backed by a predefined case team and linked to appointment Topics for scheduling through the student portal.",
      tags: ["Support_Pool__c"],
      docs:["Support Pools focus on specific subjects and represent departments or service areas that students can interact with without a pre-assigned advisor. They require a Customer Community Plus or Customer Community Plus Login license. For every department operating as a Support Pool, you create a predefined case team that includes the appropriate members and then create a corresponding Support Pool record that references that team. The Case Team Name field must exactly match the predefined case team's Team Name, otherwise students cannot schedule appointments with the pool.","Support Pools can be combined with queue management for walk-in scenarios. When used together, queues use appointment Topics and Subtopics that are specific to the support department or group. Students can schedule appointments with Support Pool members from the portal, and the same or different members can cover the front desk or handle walk-in traffic. This flexibility lets institutions model a variety of support scenarios ranging from fully scheduled to fully walk-in, or any combination.","It is important to keep predefined case team membership current so that the right support staff members are available for appointment scheduling. If there are no members on a team or the only members are Contacts rather than Users, students will not have any Support Pools available to them. Students can view Support Pool pages in the portal with a dedicated layout that includes a Schedule an Appointment button while excluding administrative actions."],
      connections: [{ planet: "appointments", desc: "Support Pools power queue-based appointment scheduling" }]
    },
    {
      id: "case-team-roles",
      name: "Case Team Roles",
      icon: "\u{1F3AD}",
      desc: "Role definitions controlling access levels (read, write, read-write, or none) for Case Team Members on Student Record Cases. Configurable per institution.",
      tags: ["Case"],
      docs: ["Case Team Roles define the permission levels available when adding staff members to a Student Record Case team. Each role specifies what level of access a team member has to the case: read-only access to view the case and its related records, write access to edit case fields, read/write access for full edit capability, or no access at all. Roles allow institutions to create differentiated access levels such as Case Owner, Reviewer, Collaborator, and Observer that reflect actual institutional support workflows.", "Administrators create Case Team Roles through the standard Salesforce Case Team Roles configuration in Setup, under Feature Settings then Cases. The roles defined here appear as options when adding members to a Student Record Case team. EDA does not ship with predefined roles; each institution configures roles matching its student support staffing model. When creating roles, administrators should consider whether advisors, counselors, financial aid officers, and health services staff all require the same level of case access.", "Case Team Roles are assigned individually when adding a Case Team Member to a specific case, or in bulk through Predefined Teams. The role determines what the team member can see and do on the case record, complementing the user's profile-level permissions. In student success workflows, restricting certain staff to read-only access ensures that case notes and action items remain controlled by the primary advisor while still allowing cross-functional visibility for case coordination."],
      connections: [{ planet: "accounts_contacts", desc: "Team members are Contact/User records" }]
    },
    {
      id: "predefined-teams",
      name: "Predefined Case Teams",
      icon: "\u{1F4CB}",
      desc: "Reusable team templates with preconfigured member-role combinations. Quickly assign standard support teams to new students without individual member selection.",
      tags: ["Case"],
      docs: ["Predefined Teams are reusable case team templates that bundle a set of users and their designated Case Team Roles into a single named group. Instead of manually adding each advisor, counselor, and support specialist to every new Student Record Case, a staff member selects the appropriate Predefined Team and all team members are added simultaneously with their configured access levels. Predefined Teams are especially valuable for institutions with specialized support teams organized by student population, such as first-generation student teams, international student teams, or student-athlete teams.", "Administrators create Predefined Teams in Salesforce Setup under Feature Settings then Cases then Predefined Case Teams. Each template lists the users included and the Case Team Role each user holds. Because Predefined Teams use specific user records rather than roles or groups, they work best for stable, consistent staff groupings rather than frequently changing rosters. When team membership changes, administrators update the template, and the change applies to all future case additions but does not retroactively update cases that already have that team applied.", "In practice, Predefined Teams speed up case creation by eliminating repetitive team assembly. When a new Student Record Case is opened for a first-year student, the advisor selects the First Year Experience Support Team from the Predefined Teams picklist and all relevant staff are added in one step. This reduces case setup time from several minutes of individual additions to a single action, ensuring all cases get the appropriate cross-functional visibility from the moment they are opened."],
      connections: [{ planet: "appointments", desc: "Predefined teams link to appointment Topics" }]
    }
  ],
  dataFlow: [
    "A Student Record Case is created for each student Contact, serving as the unified support hub",
    "Success Team members are assigned through Case Team Members with appropriate roles and access levels",
    "Support Pools are configured for departmental services, allowing any member to respond to requests",
    "As students interact with support services, all activities aggregate under the Student Record Case",
    "Staff access the Case to view the complete picture: success plans, alerts, tasks, appointments, and notes"
  ],
  connections: [
    { planet: "accounts_contacts", desc: "Student Record Cases are created for Contacts" },
    { planet: "success_plans", desc: "Success Plans live under Student Record Cases" },
    { planet: "alerts", desc: "Alerts are linked to Student Record Cases" },
    { planet: "appointments", desc: "Appointments reference Student Record Cases" },
    { planet: "behavior", desc: "Behavior Cases inform the student support picture" },
    { planet: "student_portal", desc: "Students access their Case data through the portal" },
    { planet: "education_history", desc: "Student attributes inform support needs and accommodations" },
    { planet: "academic_performance", desc: "Performance data surfaces in the student support view" }
  ]
},

success_plans: {
  packages: ['edassh'],
  name: "Success Plans",
  icon: "\u{1F3AF}",
  color: "#22c55e",
  description: "Structured goal-setting and task management for students. Success Plans are created from templates and contain predefined or custom tasks. Plan types include Academic, Career, Financial Aid, Health, Housing, and K-12 specific types (Attendance, Behavior). Tasks can be assigned to students or staff with priority, due dates, and completion tracking.",
  components: [
    {
      id: "success-plan-records",
      name: "Success Plan Records",
      icon: "\u{1F4C3}",
      desc: "Goal-oriented plans assigned to students with type classification (Academic, Career, Financial Aid, Health, Housing). Track open/overdue task counts and overall status. Success Plans can be assigned to support staff or, in organizations with student user licenses, directly to students for self-tracking through the portal.",
      tags: ["Success_Plan__c"],
      docs:["Success Plans provide structured goal-setting and task management for student advising. Each Success Plan has a type classification that determines which page layout and record type it uses. Default record types include Academic, Career, Financial Aid, Health, Housing, and in K-12 organizations, additional Attendance and Behavior types. Plans track open and overdue task counts for advisor dashboards, giving staff visibility into the progress of each student's goals.","Success Plans can be created from templates or manually under a Student Record Case. When created from a template, the plan is populated with predefined tasks, descriptions, and default assignee patterns. The plan's status progresses from Not Started through In Progress to Completed or Cancelled. In organizations with student user licenses, tasks within Success Plans can be assigned directly to students, who can then track their progress and mark tasks complete through the portal.","Support staff can use mass actions to create multiple Success Plans for multiple students from selected Alerts, enabling efficient response to patterns across student populations. For example, when a batch of students shows declining academic performance, an advisor can select their Alerts and apply an Academic Improvement Success Plan template to all of them in a single operation, rather than creating plans one at a time."],
      connections: [{ planet: "student_cases", desc: "Plans are created under Student Record Cases" }]
    },
    {
      id: "plan-templates",
      name: "Plan Templates",
      icon: "\u{1F4CB}",
      desc: "Preconfigured Success Plan templates with predefined tasks, descriptions, and default assignees. Accelerate plan creation for common support scenarios. Template record types must match their corresponding Success Plan record types for templates to work correctly.",
      tags: ["Success_Plan_Template__c", "Success_Plan_Template_Task__c"],
      docs:["Success Plan Templates define reusable sets of tasks for common advising scenarios. When a template is applied, it generates a new Success Plan populated with the template's tasks, including default subjects, descriptions, assignee patterns, priority levels, and due date offsets calculated from the plan creation date. Templates are categorized by the same types as Success Plans: Academic, Career, Financial Aid, Health, Housing, and in K-12 organizations, Attendance and Behavior.","It is important that your Success Plan and Success Plan Template record types match, otherwise your templates will not work correctly. Record types for both objects must be assigned to the appropriate support staff, System Administrator, and student profiles. Student Success Hub assigns these record types to the profiles it installs. When creating custom record types, ensure they exist on both the Success Plan and Success Plan Template objects with matching names and page layout assignments."],
      connections: [{ planet: "alerts", desc: "Templates can be applied when responding to Alerts" }]
    },
    {
      id: "task-management",
      name: "Task Management",
      icon: "\u{2705}",
      desc: "Individual tasks within Success Plans or standalone. Assigned to students or staff with priority levels, due dates, and status tracking. Supports both Plan-based and ad-hoc tasks. In organizations with student user licenses, tasks can be assigned directly to students who view and complete them in the portal.",
      tags: ["Task"],
      docs:["Student Success Hub uses the standard Salesforce Task object for individual action items. Tasks can be created as part of a Success Plan or as standalone items, and can be assigned to support staff Users or, in organizations with student user licenses, directly to students. Each Task has a subject, description, priority level, due date, and status. The standard Task statuses include Not Started, In Progress, Completed, Waiting, and Deferred.","Support staff can create Tasks for success team members who are Users, though not for members who are Contacts in secondary support roles. The Team related lists on the student record show team member names, roles, and titles. From the action menu on a team member, staff can create Tasks directly. In the student portal, the dashboard surfaces assigned tasks organized by priority and due date, and students can mark tasks complete as they progress toward their goals."],
      connections: [{ planet: "student_portal", desc: "Students view and complete tasks in the portal" }]
    },
    {
      id: "plan-progress",
      name: "Plan Progress Tracking",
      icon: "\u{1F4C8}",
      desc: "Visual progress indicators showing completed vs. total tasks, overdue items, and plan status. Progress bars and summary counts update in real-time.",
      tags: ["Success_Plan__c"],
      docs: ["Plan Progress provides visual and numeric summaries of a student's advancement through their assigned Success Plan. The system counts all Success Plan Task records linked to the plan, categorizes them by status (complete, in progress, not started, overdue), and displays these counts along with a percentage-complete indicator on the Success Plan record. This allows advisors to assess a student's progress at a glance without reviewing each individual task.", "Progress indicators are computed dynamically from the current state of linked Success Plan Task records. There is no separate configuration required for progress tracking; it is automatically available on every Success Plan. Institutions that want to surface progress information in list views or reports can reference the formula fields or roll-up summary fields that EDA provides on the Success Plan object, or build custom formula fields using the task count and completion data exposed on the object.", "In practice, advisors use plan progress during check-in meetings to quickly identify whether a student is on track or falling behind on assigned action items. Overdue task counts highlight students who may need proactive outreach, while high completion percentages signal students ready to advance to the next phase of their plan. Plan progress data also supports program evaluation: reporting on average completion rates across student cohorts reveals whether success plan templates are realistic and achieving their intended outcomes."],
      connections: [{ planet: "student_portal", desc: "Progress bars display in the student portal" }]
    }
  ],
  dataFlow: [
    "An advisor selects a Success Plan Template matching the student's needs (Academic Improvement, Career Exploration, etc.)",
    "The template generates a Success Plan with predefined tasks, descriptions, and default due dates",
    "The advisor customizes tasks, adds specific assignments, and sets priority levels for the student",
    "Students receive their assigned tasks in the portal and mark them complete as they progress",
    "The advisor monitors plan progress through task counts, status indicators, and overdue notifications"
  ],
  connections: [
    { planet: "student_cases", desc: "Success Plans belong to Student Record Cases" },
    { planet: "alerts", desc: "Plans can be applied as intervention responses to Alerts" },
    { planet: "student_portal", desc: "Students track tasks and progress in the portal" }
  ]
},

alerts: {
  packages: ['edassh'],
  name: "Alerts & Intervention",
  icon: "\u{1F514}",
  color: "#ef4444",
  description: "Early warning system for at-risk students. Support staff raise concerns through Alert records categorized by type (Academic, Career, Financial Aid, Health, Housing, Attendance, Behavior). Alerts support automated assignment rules, mass actions (create Cases, apply Success Plans), and Slack integration through the Student Success Alerts app. Default reason picklists help standardize concern reporting.",
  components: [
    {
      id: "alert-records",
      name: "Alert Records",
      icon: "\u{26A0}",
      desc: "Early warning records raised by faculty, staff, or automated processes. Categorized by type with customizable reason picklists (Grade Concern, Attendance Issue, Academic Integrity). Default record types include Academic, Career, Financial Aid, Health, Housing, and in K-12 settings, additional Attendance and Behavior types.",
      tags: ["Alert__c"],
      docs:["Alert record types determine the types of Alerts that support staff can create. Default record types include Academic, Career, Financial Aid, Health, and Housing for both K-12 and higher education, with additional Attendance and Behavior types available in K-12 organizations. Whether you use the preconfigured record types or create custom record types, they must be assigned to the appropriate support staff and System Administrator profiles with the correct page layout assignments.","Alerts are linked to Student Record Cases and provide the early warning foundation for student intervention. When a faculty member or teaching assistant notices a student struggling, they can raise an Alert through the Student Success Hub app or through the Student Success Alerts Slack app. The Alert is categorized by type with a specific reason selected, and assignment rules route it to the appropriate advisor or support team queue for follow-up.","Mass actions allow support staff to respond to patterns across student populations efficiently. From an Alerts list view, staff can select multiple Alerts and create Cases or apply Success Plan templates in bulk. This capability enables proactive intervention at scale, such as applying an Academic Improvement Plan to all students with grade-related Alerts or creating follow-up cases for students with housing insecurity concerns."],
      connections: [{ planet: "student_cases", desc: "Alerts link to Student Record Cases" }]
    },
    {
      id: "alert-assignment",
      name: "Alert Assignment",
      icon: "\u{1F4E8}",
      desc: "Automated routing of Alerts to appropriate support staff based on assignment rules. Alerts can be assigned to individual advisors, queues, or Success Team members.",
      tags: ["Alert__c"],
      docs: ["Alert Assignment controls how newly generated Alerts are routed to the appropriate advisor or support staff member for follow-up. EDA supports assigning Alerts to individual users, to Salesforce queues, or automatically to the student's Success Team member holding a designated advising role. The assignment method is configurable in EDA Settings under the Alert Settings section, allowing institutions to choose the routing logic that best matches their advising staffing model.", "Administrators configure Alert assignment by specifying a default assignee or assignment rule in EDA Settings. When automatic assignment to a Success Team member is enabled, EDA looks for a Team Member record on the student Contact with the configured role such as Primary Advisor and assigns the Alert to that user. If no matching team member is found, the Alert falls back to the default queue or user configured as the catch-all assignee. Custom automation can extend this logic for complex caseload distribution scenarios.", "In practice, Alert assignment ensures that no Alert lands unnoticed in a generic queue or on an unmonitored record. When early warning indicators trigger Alerts for at-risk students, automatic assignment to the primary advisor means the right person receives immediate notification without manual triage. Assignment-based list views and dashboards give advising supervisors visibility into caseload distribution across their team, enabling them to redistribute Alerts when one advisor is overloaded or unavailable."],
      connections: [{ planet: "student_cases", desc: "Assigned alerts appear on Student Record Cases" }]
    },
    {
      id: "alert-actions",
      name: "Alert Mass Actions",
      icon: "\u{1F3AF}",
      desc: "Bulk operations on multiple Alerts: create Cases, apply Success Plan templates, reassign, or close. Enables efficient response to patterns across student populations.",
      tags: ["Alert__c"],
      docs: ["Alert Actions are bulk operations that advisors and success coordinators can perform on multiple Alert records simultaneously from the EDA Alerts list view. Available actions include creating a Case for one or more students, applying a Success Plan template to generate an action plan, reassigning Alerts to a different advisor or queue, and marking Alerts as closed. These bulk capabilities are essential for managing high volumes of early warning Alerts efficiently, particularly during mid-term grading periods when many students may surface risk indicators at once.", "Alert Actions are exposed as list view buttons on the Alert object and are available to users with the appropriate profile permissions. Administrators can control which actions appear by adjusting the list view button configuration for the Alert object. When creating Cases from Alerts in bulk, EDA optionally links the new Case back to the originating Alert records, preserving the traceability chain from the early warning indicator to the support intervention. Success Plan applications create plan records from a selected template and link them to the student Contact associated with each Alert.", "In practice, Alert Actions enable a coordinated team response when early warning data identifies a cohort of at-risk students. A success coordinator reviewing the Alert queue might select all Alerts flagged for students in a specific program, apply a targeted Success Plan template in one operation, and reassign the resulting action items to program advisors, completing a workflow in minutes that would otherwise require hundreds of individual record edits. The ability to act in bulk turns the Alert list view from a monitoring tool into an active intervention management interface."],
      connections: [{ planet: "success_plans", desc: "Success Plans can be applied as Alert responses" }]
    },
    {
      id: "slack-integration",
      name: "Slack Integration",
      icon: "\u{1F4AC}",
      desc: "Student Success Alerts (SSA) Slack app enables faculty to raise concerns directly in Slack. Alerts flow from Slack into SSH for support staff to act on quickly. Users who have a Salesforce Platform license do not need an additional SSH license, while those without access can use a courtesy Identity license.",
      tags: ["Alert__c"],
      docs:["Student Success Alerts allows support staff such as faculty members or teaching assistants to raise concerns about students in Slack. The SSA Slack app is integrated with Student Success Hub so that support staff receive the alert and can quickly intervene to help students get back on track. The feature requires the Student Success Alerts managed package, which is available through the SSH installation page.","To use Student Success Alerts, all users need the Student Success Alerts Managed Package and Student Success Alerts Slack App permission set licenses, as well as the Student Success Alerts permission set. Users who already have a Salesforce Platform CRM license do not need another SSH license. For users who do not have read and write access to SSH, such as faculty or teaching support staff, a courtesy Identity license can provide the necessary access. The permission set is delivered with the latest managed package release.","Setting up SSA involves connecting Slack to Salesforce, adding the permission set licenses and permission set to users, inviting users to the SSA app, creating Contact records for staff users and students, and configuring how alerts are routed to support staff. Once configured, faculty can raise concerns from their everyday Slack workflow, and the alerts flow seamlessly into the Student Success Hub for advisors and counselors to act on."],
      docUrl:"https://help.salesforce.com/s/articleview?id=slack.slack_apps_enable.htm&type=5",
      connections: [{ planet: "academic_performance", desc: "Performance data triggers faculty alerts in Slack" }]
    }
  ],
  dataFlow: [
    "A faculty member notices a student struggling and raises an Alert through the SSH app or Slack",
    "The Alert is categorized by type (Academic, Attendance, Behavior) with a specific reason selected",
    "Assignment rules route the Alert to the appropriate advisor or support team queue",
    "The advisor reviews the Alert alongside the student's Case data and determines the response",
    "Mass actions allow bulk response: applying Success Plans, creating follow-up tasks, or closing resolved Alerts"
  ],
  connections: [
    { planet: "student_cases", desc: "Alerts are linked to Student Record Cases" },
    { planet: "success_plans", desc: "Success Plans can be triggered by Alert responses" },
    { planet: "academic_performance", desc: "Academic performance drives Alert creation" },
    { planet: "behavior", desc: "Behavior incidents may generate Alerts" },
    { planet: "appointments", desc: "Alerts may result in follow-up appointments" }
  ]
},

appointments: {
  packages: ['edassh'],
  name: "Appointments & Scheduling",
  icon: "\u{1F4C5}",
  color: "#3b82f6",
  description: "Flexible appointment management for advising, check-ins, and group sessions. Supports scheduled, walk-in, and group appointment types across multiple channels (in-person, virtual). Topic hierarchies organize services (Academic, Career, Financial Aid) with subtopics. Staff set availability by location and topic. Queue management handles walk-in flows at front desks and one-stop centers. Email notifications with .ics calendar attachments keep both staff and students informed.",
  components: [
    {
      id: "appointment-scheduling",
      name: "Appointment Scheduling",
      icon: "\u{1F5D3}",
      desc: "Core scheduling engine supporting Scheduled, Walk-In, and Group appointment types. Students book through the portal or staff schedule on behalf of students. Event record types distinguish between staff availability blocks (Support Time), actual appointments (Support Event), and non-support calendar events (Non-Support Event).",
      tags: ["Event"],
      docs:["Student Success Hub makes it easy for both staff and students to manage appointments across multiple channels including in-person, phone, and virtual sessions. The scheduling system uses the standard Salesforce Event object with custom record types: Support Time represents availability blocks that staff designate for appointments, Support Event represents actual scheduled appointments with students, and Non-Support Event represents calendar events unrelated to student support.","Support staff can sync their SSH appointments with their Microsoft or Google work calendars using Salesforce calendar sync tools such as Einstein Activity Capture. This integration ensures that staff availability in SSH reflects their real calendar, preventing double-booking and making it easier to manage time across multiple systems. When appointments are created or changed in SSH, the updates flow to the connected work calendar automatically.","The Appointment Manager is a utility bar component in the Student Success Hub app that consolidates appointment management for support staff. From the Appointment Manager, staff can view their upcoming agenda, create new appointments, check in walk-in students, and see the Attendee Snapshot showing key student details. The component is designed for the console experience and provides quick access to appointment actions without navigating away from other student records."],
      connections: [{ planet: "student_cases", desc: "Appointments reference Student Record Cases" }]
    },
    {
      id: "topic-management",
      name: "Topic Management",
      icon: "\u{1F3F7}",
      desc: "Hierarchical topic structure with parent topics (Academic, Career, Financial Aid) and subtopics (Degree Planning, Grade Concerns). Controls which services appear in scheduling interfaces. Three Topic objects, Role Topic Settings, User Topic Settings, and Queue Topic Settings, combine to organize and surface who is available to meet with students on which topics.",
      tags: ["Topic__c", "Role_Topic_Setting__c", "User_Topic_Setting__c", "Queue_Topic_Setting__c"],
      docs:["Topics provide the service categorization framework for SSH appointment scheduling. The three Topic objects combine to organize and surface who is available to meet with students on which support topics. Role Topic Settings map case team roles to topics, defining which roles can provide advising for specific service categories. User Topic Settings link individual users to topics for fine-grained control. Queue Topic Settings connect Support Pool queues to topics for queue-based routing.","Topic configuration must be completed before assigning success team members to students in organizations that use appointments. When students use the portal's Scheduling Wizard, they see topics organized hierarchically, select the type of support they need, and are shown the appropriate staff members or Support Pools available for that topic. This ensures students are connected with staff who have the right expertise for their specific needs."],
      connections: [{ planet: "student_cases", desc: "Topics align with support team specializations" }]
    },
    {
      id: "availability-management",
      name: "Availability Management",
      icon: "\u{23F0}",
      desc: "Staff set recurring or one-time availability blocks by location and topic. Supports Scheduled Availability, Walk-In Availability, and Group Availability event types.",
      tags: ["Event", "Location__c"],
      docs: ["Availability Management lets staff publish the times and locations when they are open to meet students for advising, tutoring, or counseling appointments. EDA supports three availability types: Scheduled Availability for fixed recurring appointment slots, Walk-In Availability for open-door periods where no booking is required, and Group Availability for sessions where multiple students can attend simultaneously. Each availability record specifies the meeting topics it covers, the maximum number of participants, and the location such as a physical room or virtual meeting link.", "Staff configure their availability by creating Availability records specifying the day of week, start time, end time, recurrence pattern, and topic. Administrators can restrict which topics each staff member can offer, ensuring that specialized resources like financial aid advising or disability services are only bookable with appropriately trained advisors. Global availability settings in EDA Settings control the booking window, which is how far in advance students can book, and the cancellation window, which is the minimum notice required to cancel.", "In practice, availability management is the foundation of the appointment scheduling workflow. When students navigate to the scheduling interface, EDA queries availability records to surface bookable slots. Advisors review their published availability in their personal calendar view, which aggregates all appointment slots and booked sessions. During peak advising periods such as registration week, administrators can extend specific advisors' availability by adding additional time blocks, increasing institutional capacity without hiring additional staff."],
      connections: [{ planet: "student_portal", desc: "Available slots shown in student portal scheduler" }]
    },
    {
      id: "queue-management",
      name: "Queue Management",
      icon: "\u{1F465}",
      desc: "Walk-in queue system for front-desk operations and one-stop centers. Staff check in students, track wait times, and manage the flow of appointments. Queue waiting rooms provide a tablet or kiosk interface where students self-check-in, saving front-desk staff from having to manually add students to the queue.",
      tags: ["Event"],
      docs:["Queue management supports walk-in and one-stop center operations where students arrive without a scheduled appointment. When a student arrives, support staff or front-desk staff use a Support Queue Case record to log the student's request. Sometimes a queue Case results in an appointment, while other times support staff can fulfill the request more simply, such as providing a copy of a transcript. Staff track a student's progress through the queue by updating the Status field on the Support Queue Case.","Queue management can be used with individuals or groups of users. When combined with Support Pools, which is a common support scenario, queues use appointment Topics and Subtopics specific to the support department or group. Multiple support models are possible: an unassigned Support Pool with queue management where the same members handle both scheduled and walk-in appointments, a model where only some members cover the front desk, or a queue-only model where students cannot schedule appointments in the portal.","To take queue management further, institutions can configure queue waiting rooms. A queue waiting room provides an interface on a tablet or kiosk device located in a physical on-site waiting room. When students arrive, they check in on the device, saving support staff or front-desk staff from having to manually add students to the queue. Student Success Hub installs a sample queue and waiting room for a Campus One-Stop in higher education organizations, intended for exploration and ideas rather than production use."],
      connections: [{ planet: "student_cases", desc: "Queue appointments link to Student Record Cases" }]
    },
    {
      id: "appointment-notifications",
      name: "Appointment Notifications",
      icon: "\u{1F4E7}",
      desc: "Automated email notifications for scheduling, rescheduling, and cancellation with configurable .ics calendar attachment support for both staff and students.",
      tags: ["Event"],
      docs: ["Appointment Notifications are automated email communications sent to students and staff when scheduling-related events occur: when a new appointment is booked, when an appointment is rescheduled to a different time, and when an appointment is cancelled. EDA generates these notifications automatically using email templates configured in the EDA Settings Appointment Settings section, eliminating the need for manual follow-up communication after each scheduling action.", "Administrators configure notification behavior by selecting or customizing the email templates used for each notification type in EDA Settings. Templates can include merge fields that pull in the appointment date, time, location, topic, and staff member name. Calendar attachments (.ics files) can optionally be included with booking and reschedule notifications so that both students and staff can add the appointment to their calendar with a single click. The notification system uses Salesforce's standard email infrastructure, respecting organizational email deliverability settings.", "In practice, appointment notifications reduce no-shows and miscommunication by keeping both parties informed automatically. Students receive a booking confirmation immediately after scheduling, and a reschedule notification if the advisor modifies the time. Staff receive their own copy of each notification, ensuring advisors are always aware of new bookings that appear on their schedule without needing to actively monitor a calendar or queue. Where supported, reminder notifications sent before the appointment further reduce no-show rates."],
      connections: [{ planet: "student_portal", desc: "Notifications triggered from portal scheduling" }]
    }
  ],
  dataFlow: [
    "Staff configure availability blocks by location, topic, and appointment type (scheduled, walk-in, group)",
    "Students browse available slots in the portal scheduler, filtered by topic and advisor",
    "Upon booking, a Scheduled Availability event is converted to a Support Event with student details",
    "Email confirmations with .ics attachments are sent to both the student and staff member",
    "For walk-ins, students check in at the front desk and enter a managed queue until an advisor is available"
  ],
  connections: [
    { planet: "student_cases", desc: "Appointments belong to Student Record Cases" },
    { planet: "student_portal", desc: "Students schedule appointments through the portal" },
    { planet: "alerts", desc: "Follow-up appointments may result from Alert responses" },
    { planet: "courses", desc: "Class schedules inform appointment availability windows" }
  ]
},

pathways: {
  packages: ['edassh'],
  name: "Pathways & Degree Planning",
  icon: "\u{1F6E4}",
  color: "#14b8a6",
  description: "Visual degree audit and planning tool built on EDA's Program Plan infrastructure. Students explore program requirements, track completion progress, and create Personal Program Plans mapping their path to graduation. Course Bookmarks let students save courses of interest. Pathways extends EDA's academic structure with an interactive student-facing experience through Lightning components in the portal.",
  components: [
    {
      id: "program-plan-display",
      name: "Program Plan Display",
      icon: "\u{1F4CA}",
      desc: "Visual representation of Program Plans showing hierarchical requirements, completion status, and remaining coursework. Rendered through dedicated Lightning components. Pathways extends EDA's academic structure by providing an interactive student-facing experience for exploring degree requirements and tracking progress.",
      tags: ["Program_Plan__c", "Plan_Requirement__c"],
      docs:["Pathways lets students easily access program information to ask questions and make informed decisions about degree or credential requirements at your institution. The Pathways package installs separately and provides Lightning components that visualize Program Plans in the student portal. Students can explore the hierarchical requirement structure, see which requirements have been fulfilled based on completed Course Connections, and understand what remains for graduation.","The Pathways package is included as a managed package with higher education SSH installations. For organizations that originally installed SSH 2.20 or earlier, Pathways must be installed separately. Once installed, Pathways components are configured in the Experience Cloud portal using Experience Builder. Support staff need specific object and field permissions for Pathways objects, and students need their own set of permissions to interact with Pathways in the portal.","Pathways translations can be managed through Translation Workbench. Because the package has coordinating objects and fields, you can override the labels using the standard Salesforce translation mechanisms. This is especially useful for institutions that serve multilingual student populations and need the degree planning interface to appear in the student's preferred language."],
      docUrl:"https://install.salesforce.org/products/pathways",
      connections: [{ planet: "academic_programs", desc: "Displays EDA Program Plan data" }]
    },
    {
      id: "personal-program-plans",
      name: "Personal Program Plans",
      icon: "\u{1F4DD}",
      desc: "Student-created graduation roadmaps. Students chart their own path by selecting courses and arranging them into future terms, creating a personalized degree timeline.",
      tags: ["Personal_Program_Plan__c", "Personal_Program_Plan_Course__c", "Personal_Program_Plan_Term__c"],
      docs: ["Personal Program Plans allow students to create individualized graduation roadmaps by selecting courses from their program requirements and arranging them into planned future terms. Unlike advisor-assigned plans, Personal Program Plans are student-driven, empowering learners to take ownership of their academic trajectory. Each plan is linked to a student's Program Enrollment record and references the academic program's requirements, giving students a structured framework within the constraints of their degree.", "Students create Personal Program Plans through the Pathways student portal interface, browsing available courses filtered by requirement group, bookmarking courses of interest, and placing them into planned term slots. The system validates that selected courses are appropriate for the planned term and flags any prerequisite conflicts. Administrators control which programs support personal planning through program-level settings, and advisors can lock individual plan records after review to prevent further student modifications.", "In practice, Personal Program Plans shift a portion of the advising workload from synchronous to asynchronous interaction. Students who arrive at advising appointments with a completed draft plan allow advisors to spend meeting time reviewing, refining, and approving the plan rather than building it from scratch. Advisors can access all student-created plans in a list view, review completion status across advisees, and identify students who have not engaged in planning as a signal for proactive outreach."],
      connections: [{ planet: "courses", desc: "Personal plans reference Course records" }]
    },
    {
      id: "course-bookmarks",
      name: "Course Bookmarks",
      icon: "\u{1F516}",
      desc: "Saved course selections for future reference. Students bookmark courses of interest while exploring requirements, building a shortlist for registration planning.",
      tags: ["Course_Bookmark__c"],
      docs: ["Course Bookmarks let students save courses of interest while exploring program requirements, creating a personal shortlist to reference during registration planning and advising conversations. A bookmark links a student Contact to a specific Course record, optionally including a note field where the student can capture why they are interested or which term they intend to take the course. Bookmarks are distinct from planned courses in a Personal Program Plan: they represent candidates under consideration rather than committed selections.", "Students add bookmarks from the course catalog view within the Pathways portal, where each course in the requirement browser has a bookmark toggle. Bookmarks are visible to both the student and their assigned advisors, making them a shared planning artifact rather than a purely private note. Administrators can enable or disable the bookmarking feature per program through EDA Settings, and the maximum number of bookmarks a student can maintain is configurable to prevent excessive shortlisting.", "In practice, Course Bookmarks reduce the friction of moving from requirement exploration to plan construction. During an advising session, the advisor can pull up the student's bookmarks to understand which courses have already captured the student's interest, then help evaluate those options against remaining requirements and scheduling constraints. Bookmarks also serve as a lightweight engagement signal: students who have assembled a substantial bookmark list are actively planning, while those with empty lists may need prompting to begin the exploration process."],
      connections: [{ planet: "courses", desc: "Bookmarks reference Course catalog entries" }]
    },
    {
      id: "requirement-tracking",
      name: "Requirement Tracking",
      icon: "\u{2705}",
      desc: "Progress tracking against Plan Requirements. Maps completed courses to requirements, showing fulfilled vs. remaining items for each requirement group.",
      tags: ["Plan_Requirement__c", "Course_Connection__c"],
      docs: ["Requirement Tracking maps a student's completed coursework to their degree program's graduation requirements, providing a real-time view of what has been fulfilled and what remains. The system reads the student's enrollment history, specifically Enrollment records with a Completed status, compares completed courses against the Plan Requirement records in the student's program, and categorizes each requirement as met, in progress, or unfulfilled. This eliminates the need for manual degree audits and gives students and advisors an always-current view of graduation progress.", "Administrators configure requirements at the program level by creating Plan Requirement records that specify required courses, credit hour minimums, or elective options for each requirement group. Groups can represent distribution requirements, major requirements, elective categories, or institutional general education mandates. The matching logic supports flexible patterns including specific course requirements, credit hour minimums satisfied by any course from a list, and substitution rules where advisor-approved alternatives can fulfill a requirement. Approved substitutions or waivers are recorded on the student's plan to maintain an accurate audit trail.", "In practice, requirement tracking is most impactful during advising sessions and self-service student planning. Advisors reviewing a student's progress dashboard immediately see which requirement groups are complete, partially fulfilled, or unaddressed, without running a manual degree audit. Students using the Pathways portal see the same view and can explore which courses would fulfill each remaining requirement, enabling informed self-advising between appointments. As students approach graduation, requirement tracking data drives the graduation audit process, ensuring all institutional requirements are met before conferring a degree."],
      connections: [{ planet: "academic_performance", desc: "Completed courses with passing grades fulfill requirements" }]
    }
  ],
  dataFlow: [
    "Students access Pathways in the portal to view their Program Plan with hierarchical requirements",
    "The display shows which requirements are fulfilled (based on completed Course Connections) and which remain",
    "Students create a Personal Program Plan, selecting courses from the catalog and arranging them into future terms",
    "Course Bookmarks allow students to save courses of interest while exploring requirement options",
    "Advisors review student plans during appointments and provide guidance on course selection and sequencing"
  ],
  connections: [
    { planet: "academic_programs", desc: "Pathways visualizes EDA Program Plans" },
    { planet: "courses", desc: "Personal plans and bookmarks reference Course records" },
    { planet: "student_portal", desc: "Pathways is accessed through the student portal" },
    { planet: "academic_performance", desc: "Grade completion drives requirement fulfillment" }
  ]
},

student_portal: {
  packages: ['edassh'],
  name: "Student Portal",
  icon: "\u{1F310}",
  color: "#d946ef",
  description: "Mobile-optimized Experience Cloud site providing student self-service access to SSH functionality. Over 12 custom Lightning components deliver appointment scheduling, success plan tracking, task management, success team directory, and degree planning. The portal connects students with their support staff and helps them stay on track with assigned goals. Optional chatbot integration provides proactive task reminders and Q&A through Einstein Bots.",
  components: [
    {
      id: "portal-configuration",
      name: "Portal Configuration",
      icon: "\u{2699}",
      desc: "Experience Cloud site setup including access control, membership, branding, and component placement. Configured through Experience Builder with custom SSH Lightning components. Students experience SSH through a portal optimized for mobile devices, connecting them with their success team and helping them stay on top of assigned goals.",
      tags: ["Event"],
      docs:["In organizations licensed and configured for student users and Experience Cloud sites, students experience Student Success Hub through a portal optimized for mobile devices. The portal connects students with members of their success team, lets them quickly schedule appointments with support staff, and helps students stay on top of their assigned Success Plans and Tasks. You build the portal using Experience Cloud and a combination of standard and custom Lightning components, configuring appropriate site access and membership.","Student Success Hub provides a set of custom Lightning components designed for the portal experience. These include the SSH Appointment Scheduler for viewing upcoming appointments, the SSH Scheduling Wizard for booking new appointments, the SSH Success Plan components for viewing plans and completing tasks, and the SSH User Profile components that display the student's success team and contact information. Each component can be placed and configured in Experience Builder.","The student portal requires either a Customer Community Plus or Customer Community Plus Login license, which can be provisioned through Experience Cloud for Learner Success. When configuring security for the portal, staff and administrators typically have more permissions than students. Student Success Hub provides two sample student profiles, one for each license type, with identical permissions that can be cloned and customized for your institution's needs."],
      connections: [{ planet: "student_cases", desc: "Portal displays Student Record Case data" }]
    },
    {
      id: "scheduling-components",
      name: "Scheduling Components",
      icon: "\u{1F4C5}",
      desc: "SSH Appointment Scheduler and Scheduling Wizard components. Students browse advisor availability, select topics, and book appointments directly from the portal. The redesigned Scheduling Wizard component provides an improved student experience and replaces the previous version which has been deprecated.",
      tags: ["Event", "Topic__c"],
      docs:["The SSH Scheduling Wizard component makes it easy for students to schedule appointments with support staff from the portal. The redesigned component introduced in the Winter 2022 release replaces the previous version, which is deprecated and renamed. To set up the new component, place it on a new page in the portal, specify the API name of the page showing upcoming appointments, and grant students access to the required Apex classes.","The SSH Appointment Scheduler component displays upcoming appointments and provides students with a view of their scheduled meetings. When a student successfully schedules an appointment using the Scheduling Wizard, they are directed to the Appointment Scheduler page to see their upcoming appointments. The SSH User Profile Schedule Button component on the profile page connects to the Scheduling Wizard, providing students with a clear path from viewing their profile to booking their next appointment."],
      connections: [{ planet: "appointments", desc: "Portal components create appointment Events" }]
    },
    {
      id: "student-dashboard",
      name: "Student Dashboard",
      icon: "\u{1F4CA}",
      desc: "Consolidated view of Success Plans with progress bars, assigned Tasks by priority and due date, Success Team member cards, and the Launchpad Agenda showing upcoming events. The portal is optimized for mobile devices and connects students with their support staff while helping them stay on track with assigned goals.",
      tags: ["Success_Plan__c", "Task"],
      docs:["The student portal dashboard surfaces assigned Success Plans with progress indicators, pending tasks organized by priority and due date, upcoming appointments from the Launchpad Agenda component, and Success Team member cards showing who is available to help. The Launchpad Agenda provides a timeline view of upcoming events so students can see at a glance what appointments and deadlines are coming up.","The Student Success Hub app on the staff side consolidates the many data layers that support staff access every day. Whether tracking progress on a Success Plan, viewing and acting on Alerts, or documenting decisions and next steps in Notes, the console-style app helps staff stay organized and on task. The app displays records as tabs and subtabs across the top of the page, offers a split view list on the left, and a utility bar at the bottom for quick access to tools like Notes and the Appointment Manager."],
      connections: [{ planet: "success_plans", desc: "Dashboard displays Success Plan progress" }]
    },
    {
      id: "chatbot",
      name: "Student Chatbot",
      icon: "\u{1F916}",
      desc: "Einstein Bot integration for proactive student engagement. Sends task reminders, answers common questions, and nudges students toward their goals through SMS or web chat. The chatbot uses outbound messages, Process Builder, Omni-Channel, Einstein Bots, and flows to deliver a proactive support experience.",
      tags: ["Contact"],
      docs:["The Student Success Hub chatbot uses outbound messages, Process Builder, Omni-Channel, Einstein Bots, and flows. Set up these components to help students keep up with their tasks. The chatbot can be deployed through SMS text messaging or web chat channels, reaching students through the communication methods they use most frequently. Digital Engagement is required as a paid product for deploying the chatbot through messaging channels.","Before setting up the chatbot, Einstein Bots must be enabled in your organization and the necessary prerequisites met. The chatbot installation includes a separate managed package available through the Student Success Hub installer page. Configuration involves setting up messaging channels, creating a dedicated Experience Cloud site for the chatbot, and customizing the bot dialogs that define conversation flows. The chatbot window's branding can be customized on the Embedded Service Deployment page.","The chatbot is designed for proactive student engagement, sending reminders about overdue tasks and upcoming deadlines. Students can interact with the chatbot to check their task status, get answers to common questions, and receive guidance toward their goals. The conversational interface makes support feel accessible and immediate, encouraging students to stay engaged with their Success Plans even between scheduled advising appointments."],
      docUrl:"https://install.salesforce.org/products/student-success-chatbot/latest",
      connections: [{ planet: "success_plans", desc: "Chatbot reminds students about pending tasks" }]
    }
  ],
  dataFlow: [
    "Students log into the Experience Cloud portal using their personalized URL and credentials",
    "The dashboard surfaces assigned Success Plans, pending tasks, upcoming appointments, and team contacts",
    "Students use the Scheduling Wizard to book appointments by selecting a topic and browsing available slots",
    "Pathways components let students explore degree requirements and create Personal Program Plans",
    "The optional chatbot sends proactive reminders about overdue tasks and upcoming deadlines via SMS or web chat"
  ],
  connections: [
    { planet: "appointments", desc: "Portal provides student-facing scheduling interface" },
    { planet: "success_plans", desc: "Portal displays plans and tasks for student tracking" },
    { planet: "pathways", desc: "Pathways degree planning is accessed through the portal" },
    { planet: "student_cases", desc: "Portal data comes from the Student Record Case" }
  ]
}

};
