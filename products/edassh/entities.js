// ══════════════════════════════════════════════════════════════
//  EDA & Student Success Hub Entities — Objects & Custom Metadata
//  Entity types: objects, metadata
// ══════════════════════════════════════════════════════════════

export default {

  "accounts_contacts": {
    "objects": [
      {
        "name": "Account",
        "type": "standard",
        "domain": "accounts_contacts",
        "description": "Represents organizational entities in EDA using the Administrative Account model. Each Contact has a dedicated 1:1 Administrative Account. Additional Account record types include Educational Institution, University Department, Academic Program, Sports Organization, and Business Organization for modeling campus structures. Accounts are organized in hierarchies of parent and child records to model your institution's entities. The default account model determines the type of container Account created automatically for every new independent Contact, the naming convention for those Accounts, and your options for managing address data.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Account name; auto-generated for Administrative Accounts from the linked Contact name" },
          { "name": "RecordTypeId", "type": "Lookup", "description": "Distinguishes Administrative, Academic Program, Educational Institution, University Department, Business Organization, Sports Organization, and Household record types" },
          { "name": "ParentId", "type": "Lookup", "description": "Parent Account for modeling institutional hierarchies such as University > College > Department" },
          { "name": "Primary_Contact__c", "type": "Lookup", "description": "The Contact record linked to this Administrative Account in the 1:1 model" },
          { "name": "School_Code__c", "type": "Text", "description": "Institutional identification code (FICE, IPEDS, CEEB) for Educational Institution accounts" },
          { "name": "BillingAddress", "type": "Text", "description": "Primary billing address compound field for the account" }
        ],
        "relationships": [
          { "target": "Contact", "type": "parent", "description": "Administrative Accounts have a 1:1 relationship with their Contact record" },
          { "target": "Affiliation__c", "type": "parent", "description": "Organizational Accounts receive Affiliation records linking Contacts to departments, programs, and institutions" },
          { "target": "Address__c", "type": "parent", "description": "Accounts can have multiple Address records with seasonal and default logic" }
        ]
      },
      {
        "name": "Contact",
        "type": "standard",
        "domain": "accounts_contacts",
        "description": "The core person record in EDA representing students, faculty, staff, alumni, and other campus constituents. Each Contact is linked to a dedicated Administrative Account. Contact records serve as the hub for relationships, affiliations, program enrollments, course connections, and all SSH interactions. EDA augments the standard Contact object with education-specific fields such as Financial Aid Applicant, Primary Language, preferred email and phone settings, FERPA and HIPAA compliance indicators, and multiple primary affiliation lookup fields mapped to organizational Accounts.",
        "fields": [
          { "name": "FirstName", "type": "Text", "description": "Contact's first name" },
          { "name": "LastName", "type": "Text", "description": "Contact's last name" },
          { "name": "Email", "type": "Email", "description": "Primary email address, often the institutional email" },
          { "name": "Preferred_Email__c", "type": "Picklist", "description": "Selects which email field (University, Work, Alternate) is copied to the standard Email field" },
          { "name": "Primary_Organization__c", "type": "Lookup", "description": "Primary organizational Affiliation Account for this Contact" },
          { "name": "Primary_Educational_Institution__c", "type": "Lookup", "description": "Primary Educational Institution Affiliation Account" },
          { "name": "Primary_Department__c", "type": "Lookup", "description": "Primary University Department Affiliation Account" },
          { "name": "Primary_Academic_Program__c", "type": "Lookup", "description": "Primary Academic Program Affiliation Account" },
          { "name": "UniversityEmail__c", "type": "Email", "description": "University-issued email address" },
          { "name": "WorkEmail__c", "type": "Email", "description": "Work or employer email address" },
          { "name": "AlternateEmail__c", "type": "Email", "description": "Alternate or personal email address" },
          { "name": "WorkPhone__c", "type": "Phone", "description": "Work phone number" },
          { "name": "Current_Address__c", "type": "Lookup", "description": "Reference to the active default Address record" },
          { "name": "Primary_Language__c", "type": "Text", "description": "Contact's primary language for communication preferences" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each Contact belongs to a dedicated Administrative Account in the 1:1 model" },
          { "target": "Relationship__c", "type": "parent", "description": "Contacts participate in person-to-person relationships with reciprocal tracking" },
          { "target": "Affiliation__c", "type": "parent", "description": "Contacts are affiliated with organizational Accounts through Affiliation records" },
          { "target": "Program_Enrollment__c", "type": "parent", "description": "Contacts enroll in academic programs" },
          { "target": "Course_Connection__c", "type": "parent", "description": "Contacts connect to Course Offerings as students or faculty" },
          { "target": "Address__c", "type": "parent", "description": "Contacts have multiple addresses with default synchronization" }
        ]
      },
      {
        "name": "Address__c",
        "type": "custom",
        "domain": "accounts_contacts",
        "description": "Multi-address support for Contacts and Accounts. Stores street, city, state, country, and zip with address type classification (Home, Work, Mailing, Seasonal, Other). Supports seasonal addresses with start/end month and default address designation that automatically syncs to the Contact's standard mailing fields through TDTM triggers. Each Address record uses approximately 2 kilobytes of data storage. EDA synchronizes address data across Address, Contact, and Account records, with special handling for Household Accounts where the Billing Address stays in sync with Contact Mailing Addresses.",
        "fields": [
          { "name": "MailingStreet__c", "type": "TextArea", "description": "Street address lines" },
          { "name": "MailingCity__c", "type": "Text", "description": "City name" },
          { "name": "MailingState__c", "type": "Text", "description": "State or province" },
          { "name": "MailingPostalCode__c", "type": "Text", "description": "Postal or zip code" },
          { "name": "MailingCountry__c", "type": "Text", "description": "Country name or ISO code" },
          { "name": "Address_Type__c", "type": "Picklist", "description": "Classification: Home, Work, Mailing, Seasonal, Other" },
          { "name": "Default_Address__c", "type": "Checkbox", "description": "When checked, this address is synced to the Contact's standard mailing fields" },
          { "name": "Seasonal_Start_Month__c", "type": "Text", "description": "Month when a seasonal address becomes active" },
          { "name": "Seasonal_Start_Day__c", "type": "Text", "description": "Day when a seasonal address becomes active" },
          { "name": "Seasonal_End_Month__c", "type": "Text", "description": "Month when a seasonal address becomes inactive" },
          { "name": "Seasonal_End_Day__c", "type": "Text", "description": "Day when a seasonal address becomes inactive" },
          { "name": "Parent_Contact__c", "type": "Lookup", "description": "The Contact this address belongs to" },
          { "name": "Parent_Account__c", "type": "Lookup", "description": "The Account this address belongs to" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Addresses belong to a Contact record, with default sync to mailing fields" },
          { "target": "Account", "type": "child", "description": "Addresses can also belong to an Account record for organizational addresses" }
        ]
      }
    ]
  },

  "relationships": {
    "objects": [
      {
        "name": "Relationship__c",
        "type": "custom",
        "domain": "relationships",
        "description": "Tracks person-to-person connections between two Contact records with automatic reciprocal management. When a Relationship is created (e.g., Parent of Student), EDA's TDTM framework generates the inverse record (Student of Parent). Supports configurable relationship types, status tracking, and auto-creation from Contact lookup fields. Two reciprocal methods are available: List Setting uses a preconfigured lookup table with gender-specific variants, while Value Inversion reverses the type string around a configurable delimiter.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The source Contact in the relationship" },
          { "name": "RelatedContact__c", "type": "Lookup", "description": "The target Contact in the relationship" },
          { "name": "Type__c", "type": "Picklist", "description": "Relationship type: Parent, Child, Sibling, Spouse, Partner, Advisor, Tutor, Coach, Friend, etc." },
          { "name": "Status__c", "type": "Picklist", "description": "Relationship status: Current or Former" },
          { "name": "Description__c", "type": "TextArea", "description": "Free-text description of the relationship context" },
          { "name": "ReciprocalRelationship__c", "type": "Lookup", "description": "Reference to the automatically created inverse Relationship record" },
          { "name": "SYSTEM_AccountContactRelationship__c", "type": "Checkbox", "description": "System flag indicating this relationship was auto-created" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Source Contact in the relationship" },
          { "target": "Contact", "type": "child", "description": "Related Contact in the relationship (target)" }
        ]
      },
      {
        "name": "Contact_Language__c",
        "type": "custom",
        "domain": "relationships",
        "description": "Junction object linking a Contact to a Language record with proficiency details. Tracks which languages a Contact speaks, their fluency level, and whether it is their primary language. Supports multilingual campus communities and communication preferences.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The Contact who speaks this language" },
          { "name": "Language__c", "type": "Lookup", "description": "Reference to the Language record" },
          { "name": "Fluency__c", "type": "Picklist", "description": "Proficiency level: Beginner, Intermediate, Advanced, Fluent, Native" },
          { "name": "Primary_Language__c", "type": "Checkbox", "description": "Whether this is the Contact's primary language" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Contact Language belongs to a Contact record" },
          { "target": "Language__c", "type": "child", "description": "References the Language definition record" }
        ]
      },
      {
        "name": "Language__c",
        "type": "custom",
        "domain": "relationships",
        "description": "Reference table of languages available for Contact Language assignments. Stores the language name and ISO code. Pre-populated with common languages and extensible for institutional needs.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Language name (e.g., English, Spanish, Mandarin)" },
          { "name": "Language_Code__c", "type": "Text", "description": "ISO 639-1 language code (e.g., en, es, zh)" },
          { "name": "Description__c", "type": "TextArea", "description": "Optional description or notes about the language" }
        ],
        "relationships": [
          { "target": "Contact_Language__c", "type": "parent", "description": "Languages are referenced by Contact Language junction records" }
        ]
      }
    ]
  },

  "affiliations": {
    "objects": [
      {
        "name": "Affiliation__c",
        "type": "custom",
        "domain": "affiliations",
        "description": "Maps person-to-organization relationships by connecting a Contact to an Account. Supports primary affiliation designation per Account record type, auto-creation mappings based on Account record type, and bidirectional synchronization with Program Enrollment. Tracks role, status, dates, and department assignment across institutional entities. Affiliations are essential for tracking involvement in activities and organizations, on or off campus, both in the present and in the past. The Academic Program record type is unique in having Auto-Enrollment settings that automatically create Program Enrollment records.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The Contact affiliated with the organization" },
          { "name": "Account__c", "type": "Lookup", "description": "The organizational Account (Department, Program, Institution)" },
          { "name": "Role__c", "type": "Picklist", "description": "Role within the organization: Student, Faculty, Staff, Alumnus, etc." },
          { "name": "Status__c", "type": "Picklist", "description": "Affiliation status: Current or Former" },
          { "name": "Primary__c", "type": "Checkbox", "description": "Whether this is the primary Affiliation for its Account record type" },
          { "name": "StartDate__c", "type": "Date", "description": "Date the affiliation began" },
          { "name": "EndDate__c", "type": "Date", "description": "Date the affiliation ended, if applicable" },
          { "name": "Description__c", "type": "TextArea", "description": "Additional context about the affiliation" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each Affiliation links a Contact to an organizational Account" },
          { "target": "Account", "type": "child", "description": "Affiliations connect to organizational Accounts (departments, programs, institutions)" },
          { "target": "Program_Enrollment__c", "type": "lookup", "description": "Affiliations sync bidirectionally with Program Enrollment records" }
        ]
      }
    ]
  },

  "academic_programs": {
    "objects": [
      {
        "name": "Program_Plan__c",
        "type": "custom",
        "domain": "academic_programs",
        "description": "Defines an academic program such as a major, minor, certificate, or concentration. Program Plans contain hierarchical Plan Requirements that map out the full graduation pathway. Each plan links to an Account of type Academic Program and specifies credit hour requirements, program status, and description.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Program name (e.g., Bachelor of Science in Computer Science)" },
          { "name": "Account__c", "type": "Lookup", "description": "The Academic Program Account this plan belongs to" },
          { "name": "Description__c", "type": "LongTextArea", "description": "Detailed description of the program's goals and structure" },
          { "name": "Total_Required_Credits__c", "type": "Number", "description": "Total credit hours required to complete the program" },
          { "name": "Status__c", "type": "Picklist", "description": "Program status: Active, Inactive, Archived" },
          { "name": "Start_Date__c", "type": "Date", "description": "Date when the program became available to students" },
          { "name": "End_Date__c", "type": "Date", "description": "Date when the program is no longer accepting new enrollments" },
          { "name": "Is_Primary__c", "type": "Checkbox", "description": "Whether this is the primary program plan for the Academic Program Account" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each Program Plan belongs to an Academic Program Account" },
          { "target": "Plan_Requirement__c", "type": "parent", "description": "Program Plans contain nested Plan Requirements defining the curriculum" },
          { "target": "Program_Enrollment__c", "type": "parent", "description": "Students enroll in Program Plans through Program Enrollment records" }
        ]
      },
      {
        "name": "Plan_Requirement__c",
        "type": "custom",
        "domain": "academic_programs",
        "description": "Individual requirements within a Program Plan. Supports parent-child nesting for requirement groups (e.g., Core Courses containing specific course requirements, or Electives requiring N-of-M completion). Can link directly to Course records for specific course requirements or serve as containers for sub-requirements.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Requirement name (e.g., Core Mathematics, General Electives)" },
          { "name": "Program_Plan__c", "type": "Lookup", "description": "The Program Plan this requirement belongs to" },
          { "name": "Parent_Plan_Requirement__c", "type": "Lookup", "description": "Parent requirement for hierarchical nesting" },
          { "name": "Category__c", "type": "Picklist", "description": "Requirement category: Required, Optional, Elective" },
          { "name": "Credits__c", "type": "Number", "description": "Credit hours this requirement satisfies" },
          { "name": "Course__c", "type": "Lookup", "description": "Specific Course record that fulfills this requirement" },
          { "name": "Sequence__c", "type": "Number", "description": "Sort order within the parent requirement or program plan" },
          { "name": "Description__c", "type": "TextArea", "description": "Additional instructions or notes about the requirement" }
        ],
        "relationships": [
          { "target": "Program_Plan__c", "type": "child", "description": "Each requirement belongs to a Program Plan" },
          { "target": "Plan_Requirement__c", "type": "lookup", "description": "Requirements can nest under parent requirements for grouping" },
          { "target": "Course__c", "type": "lookup", "description": "Requirements may reference a specific Course record" }
        ]
      },
      {
        "name": "Program_Enrollment__c",
        "type": "custom",
        "domain": "academic_programs",
        "description": "Tracks a student's enrollment in an academic program. Records admission date, enrollment status, GPA, expected graduation date, and class standing. Bidirectionally syncs with Affiliation records through TDTM automation so that creating a Program Enrollment auto-creates the corresponding Affiliation.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The student Contact enrolled in the program" },
          { "name": "Account__c", "type": "Lookup", "description": "The Academic Program Account for this enrollment" },
          { "name": "Program_Plan__c", "type": "Lookup", "description": "The specific Program Plan the student is following" },
          { "name": "Admission_Date__c", "type": "Date", "description": "Date the student was admitted to the program" },
          { "name": "Start_Date__c", "type": "Date", "description": "Date the student began the program" },
          { "name": "End_Date__c", "type": "Date", "description": "Actual end date of enrollment" },
          { "name": "Expected_Graduation_Date__c", "type": "Date", "description": "Projected graduation date" },
          { "name": "Enrollment_Status__c", "type": "Picklist", "description": "Status: Current, Former, Leave of Absence, Graduated, Withdrawn" },
          { "name": "GPA__c", "type": "Number", "description": "Cumulative GPA within this program" },
          { "name": "Class_Standing__c", "type": "Picklist", "description": "Class level: Freshman, Sophomore, Junior, Senior, Graduate" },
          { "name": "Affiliation__c", "type": "Lookup", "description": "The synced Affiliation record for this enrollment" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each enrollment belongs to a student Contact" },
          { "target": "Account", "type": "child", "description": "Enrollment links to the Academic Program Account" },
          { "target": "Program_Plan__c", "type": "child", "description": "Enrollment follows a specific Program Plan" },
          { "target": "Affiliation__c", "type": "lookup", "description": "Auto-synced Affiliation record for the program enrollment" }
        ]
      },
      {
        "name": "Academic_Certification__c",
        "type": "custom",
        "domain": "academic_programs",
        "description": "Records degrees, certificates, diplomas, and other academic credentials awarded to students upon program completion. Links to the Contact, the granting Account (institution or program), and optionally the Program Plan. Captures conferral date, certification type, and status.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The student Contact who received the certification" },
          { "name": "Account__c", "type": "Lookup", "description": "The institution or program Account granting the certification" },
          { "name": "Certification_Type__c", "type": "Picklist", "description": "Type: Bachelor's Degree, Master's Degree, Doctoral Degree, Certificate, Diploma" },
          { "name": "Status__c", "type": "Picklist", "description": "Status: Awarded, In Progress, Revoked" },
          { "name": "Conferral_Date__c", "type": "Date", "description": "Date the certification was officially conferred" },
          { "name": "Description__c", "type": "TextArea", "description": "Details about the certification such as major, concentration, or honors" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Certifications are awarded to a student Contact" },
          { "target": "Account", "type": "child", "description": "Certifications are granted by an institutional Account" },
          { "target": "Program_Plan__c", "type": "lookup", "description": "Optionally links to the completed Program Plan" }
        ]
      }
    ]
  },

  "courses": {
    "objects": [
      {
        "name": "Course__c",
        "type": "custom",
        "domain": "courses",
        "description": "Course catalog definition representing a course independent of any specific term or offering. Contains the course name, code, credit hours, department, description, and prerequisites. Courses are reused across multiple term-specific Course Offerings.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Course title (e.g., Introduction to Computer Science)" },
          { "name": "Course_ID__c", "type": "Text", "description": "Catalog course code (e.g., CS 101)" },
          { "name": "Account__c", "type": "Lookup", "description": "The University Department Account offering this course" },
          { "name": "Credit_Hours__c", "type": "Number", "description": "Number of credit hours awarded upon completion" },
          { "name": "Description__c", "type": "LongTextArea", "description": "Course description including objectives and prerequisites" },
          { "name": "Extended_Description__c", "type": "LongTextArea", "description": "Detailed course content and learning outcomes" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Courses belong to a University Department Account" },
          { "target": "Course_Offering__c", "type": "parent", "description": "Courses have multiple term-specific offerings" },
          { "target": "Plan_Requirement__c", "type": "parent", "description": "Courses are referenced by Plan Requirements" }
        ]
      },
      {
        "name": "Course_Offering__c",
        "type": "custom",
        "domain": "courses",
        "description": "A term-specific instance of a Course with capacity, location, start and end dates, and section number. Each offering links to a Course (catalog definition), a Term, and optionally a Facility. Students and faculty connect through Course Connection records.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Auto-generated offering name or section identifier" },
          { "name": "Course__c", "type": "Lookup", "description": "The Course catalog record this offering is based on" },
          { "name": "Term__c", "type": "Lookup", "description": "The academic Term this offering takes place in" },
          { "name": "Facility__c", "type": "Lookup", "description": "The campus Facility where the class meets" },
          { "name": "Section_ID__c", "type": "Text", "description": "Section number or identifier (e.g., 001, A, Evening)" },
          { "name": "Capacity__c", "type": "Number", "description": "Maximum enrollment capacity for the section" },
          { "name": "Start_Date__c", "type": "Date", "description": "Start date of the offering within the term" },
          { "name": "End_Date__c", "type": "Date", "description": "End date of the offering within the term" }
        ],
        "relationships": [
          { "target": "Course__c", "type": "child", "description": "Each offering is an instance of a Course catalog record" },
          { "target": "Term__c", "type": "child", "description": "Each offering belongs to an academic Term" },
          { "target": "Facility__c", "type": "lookup", "description": "Offerings may reference a campus Facility for location" },
          { "target": "Course_Connection__c", "type": "parent", "description": "Students and faculty are linked through Course Connections" },
          { "target": "Course_Offering_Schedule__c", "type": "parent", "description": "Meeting patterns defined by Course Offering Schedules" }
        ]
      },
      {
        "name": "Course_Connection__c",
        "type": "custom",
        "domain": "courses",
        "description": "Junction object enrolling a Contact in a Course Offering as either a Student or Faculty member. Tracks enrollment status (Current, Former), grade, credits attempted and earned, and links to the student's Program Enrollment for program-level tracking.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The student or faculty Contact" },
          { "name": "Course_Offering__c", "type": "Lookup", "description": "The Course Offering this connection is for" },
          { "name": "Program_Enrollment__c", "type": "Lookup", "description": "The student's Program Enrollment for program-level tracking" },
          { "name": "Record_Type__c", "type": "Picklist", "description": "Role in the offering: Student or Faculty" },
          { "name": "Status__c", "type": "Picklist", "description": "Enrollment status: Current, Former, Withdrawn" },
          { "name": "Credits_Attempted__c", "type": "Number", "description": "Credit hours attempted in this course" },
          { "name": "Credits_Earned__c", "type": "Number", "description": "Credit hours earned upon completion" },
          { "name": "Grade__c", "type": "Text", "description": "Letter grade or grade notation received" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each Course Connection links to a student or faculty Contact" },
          { "target": "Course_Offering__c", "type": "child", "description": "Each connection belongs to a specific Course Offering" },
          { "target": "Program_Enrollment__c", "type": "lookup", "description": "Optionally linked to the student's Program Enrollment" }
        ]
      },
      {
        "name": "Course_Offering_Schedule__c",
        "type": "custom",
        "domain": "courses",
        "description": "Defines the meeting pattern for a Course Offering: which days of the week the class meets and at what times. Links to a Time Block for reusable time slot definitions. Multiple schedules per offering support complex meeting patterns (e.g., MWF lecture + T lab).",
        "fields": [
          { "name": "Course_Offering__c", "type": "Lookup", "description": "The Course Offering this schedule applies to" },
          { "name": "Time_Block__c", "type": "Lookup", "description": "The Time Block defining start and end times" },
          { "name": "Facility__c", "type": "Lookup", "description": "The facility where this particular session meets" },
          { "name": "Monday__c", "type": "Checkbox", "description": "Class meets on Monday" },
          { "name": "Tuesday__c", "type": "Checkbox", "description": "Class meets on Tuesday" },
          { "name": "Wednesday__c", "type": "Checkbox", "description": "Class meets on Wednesday" },
          { "name": "Thursday__c", "type": "Checkbox", "description": "Class meets on Thursday" },
          { "name": "Friday__c", "type": "Checkbox", "description": "Class meets on Friday" },
          { "name": "Saturday__c", "type": "Checkbox", "description": "Class meets on Saturday" },
          { "name": "Sunday__c", "type": "Checkbox", "description": "Class meets on Sunday" }
        ],
        "relationships": [
          { "target": "Course_Offering__c", "type": "child", "description": "Each schedule belongs to a specific Course Offering" },
          { "target": "Time_Block__c", "type": "child", "description": "References a Time Block for the meeting time window" },
          { "target": "Facility__c", "type": "lookup", "description": "Optionally specifies a different facility for this schedule" }
        ]
      },
      {
        "name": "Time_Block__c",
        "type": "custom",
        "domain": "courses",
        "description": "Reusable time slot definitions for class scheduling. Defines a start time and end time that can be referenced by multiple Course Offering Schedules. Standardizes scheduling across the institution (e.g., Period 1: 8:00-9:15, Period 2: 9:30-10:45).",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Time block name (e.g., Period 1, Morning Slot A)" },
          { "name": "Start_Time__c", "type": "DateTime", "description": "Start time of the time block" },
          { "name": "End_Time__c", "type": "DateTime", "description": "End time of the time block" }
        ],
        "relationships": [
          { "target": "Course_Offering_Schedule__c", "type": "parent", "description": "Time Blocks are referenced by Course Offering Schedules" }
        ]
      },
      {
        "name": "Term__c",
        "type": "custom",
        "domain": "courses",
        "description": "Academic terms such as semesters, quarters, trimesters, or summer sessions. Supports parent-child hierarchies for nested terms (e.g., Academic Year > Fall Semester). Term dates cascade to child Course Offerings through TDTM automation when modified.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Term name (e.g., Fall 2026, Spring Quarter 2026)" },
          { "name": "Account__c", "type": "Lookup", "description": "The Educational Institution Account this term belongs to" },
          { "name": "Parent_Term__c", "type": "Lookup", "description": "Parent term for hierarchical nesting (Academic Year > Semester)" },
          { "name": "Start_Date__c", "type": "Date", "description": "First day of the term" },
          { "name": "End_Date__c", "type": "Date", "description": "Last day of the term" },
          { "name": "Type__c", "type": "Picklist", "description": "Term type: Semester, Quarter, Trimester, Summer, Intersession" },
          { "name": "Grading_Period__c", "type": "Checkbox", "description": "Whether this term is a grading period for Term Grade generation" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each term belongs to an Educational Institution Account" },
          { "target": "Term__c", "type": "lookup", "description": "Terms can nest under parent terms for hierarchical structures" },
          { "target": "Course_Offering__c", "type": "parent", "description": "Terms contain multiple Course Offerings" }
        ]
      }
    ]
  },

  "academic_performance": {
    "objects": [
      {
        "name": "Term_Grade__c",
        "type": "custom",
        "domain": "academic_performance",
        "description": "Records a student's academic performance for a specific Term. Captures letter grade, numeric GPA, credits attempted and earned, class rank, and term-level grade point calculations. Links to Contact, Term, Course Connection, and Course Offering for full grade context.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The student Contact this grade belongs to" },
          { "name": "Term__c", "type": "Lookup", "description": "The academic Term this grade covers" },
          { "name": "Course_Connection__c", "type": "Lookup", "description": "The specific Course Connection this grade is for" },
          { "name": "Course_Offering__c", "type": "Lookup", "description": "The Course Offering this grade is associated with" },
          { "name": "Letter_Grade__c", "type": "Text", "description": "Letter grade received (A, B+, C, etc.)" },
          { "name": "Grade_Points__c", "type": "Number", "description": "Numeric grade points for GPA calculation" },
          { "name": "Credits_Attempted__c", "type": "Number", "description": "Credit hours attempted in this term" },
          { "name": "Credits_Earned__c", "type": "Number", "description": "Credit hours earned in this term" },
          { "name": "GPA__c", "type": "Number", "description": "Term GPA calculated from grade points and credit hours" },
          { "name": "Result__c", "type": "Picklist", "description": "Outcome: Pass, Fail, Incomplete, Withdrawn, Audit" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each grade belongs to a student Contact" },
          { "target": "Term__c", "type": "child", "description": "Each grade is tied to an academic Term" },
          { "target": "Course_Connection__c", "type": "lookup", "description": "Optionally linked to the specific Course Connection" },
          { "target": "Course_Offering__c", "type": "lookup", "description": "Optionally linked to the Course Offering" }
        ]
      },
      {
        "name": "Test__c",
        "type": "custom",
        "domain": "academic_performance",
        "description": "Defines a standardized assessment or exam (SAT, ACT, GRE, TOEFL, institutional placement tests). Contains the test name, maximum score, score ranges for sections, and administration details. Test records are reusable definitions referenced by individual Test Score records.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Test name (e.g., SAT, ACT, GRE General, Placement Math)" },
          { "name": "Description__c", "type": "LongTextArea", "description": "Description of the assessment including purpose and format" },
          { "name": "Maximum_Score__c", "type": "Number", "description": "Maximum possible score for the overall test" }
        ],
        "relationships": [
          { "target": "Test_Score__c", "type": "parent", "description": "Tests are referenced by individual Test Score records" }
        ]
      },
      {
        "name": "Test_Score__c",
        "type": "custom",
        "domain": "academic_performance",
        "description": "An individual student's result on a standardized assessment. Records the score value, percentile, test date, and section details. Multiple Test Score records per student per Test are supported for retakes and section-level scores.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The student Contact who took the test" },
          { "name": "Test__c", "type": "Lookup", "description": "The Test definition this score is for" },
          { "name": "Score__c", "type": "Number", "description": "Numeric score achieved" },
          { "name": "Percentile__c", "type": "Percent", "description": "Percentile rank relative to other test takers" },
          { "name": "Test_Date__c", "type": "Date", "description": "Date the test was administered" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each score belongs to a student Contact" },
          { "target": "Test__c", "type": "child", "description": "Each score references a Test definition" }
        ]
      },
      {
        "name": "Attendance_Event__c",
        "type": "custom",
        "domain": "academic_performance",
        "description": "Records attendance for a specific class session or school day. Captures attendance type (Present, Absent, Tardy, Excused), date, reason, and associated Course Connection. Supports both daily attendance (K-12) and per-class session tracking (higher education).",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The student Contact this attendance record is for" },
          { "name": "Course_Connection__c", "type": "Lookup", "description": "The Course Connection for per-class attendance tracking" },
          { "name": "Course_Offering__c", "type": "Lookup", "description": "The Course Offering the attendance pertains to" },
          { "name": "Date__c", "type": "Date", "description": "Date of the attendance event" },
          { "name": "Type__c", "type": "Picklist", "description": "Attendance status: Present, Absent, Tardy, Excused Absence, Excused Tardy" },
          { "name": "Reason__c", "type": "TextArea", "description": "Reason for absence or tardiness" },
          { "name": "Start_Time__c", "type": "DateTime", "description": "Start time for time-based attendance tracking" },
          { "name": "End_Time__c", "type": "DateTime", "description": "End time for time-based attendance tracking" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each attendance event belongs to a student Contact" },
          { "target": "Course_Connection__c", "type": "lookup", "description": "Linked to the student's Course Connection for the class" },
          { "target": "Course_Offering__c", "type": "lookup", "description": "Attendance is tracked per Course Offering session" }
        ]
      }
    ]
  },

  "education_history": {
    "objects": [
      {
        "name": "Education_History__c",
        "type": "custom",
        "domain": "education_history",
        "description": "Records a Contact's prior educational experience at other institutions. Captures the institution name, degree type, field of study, dates attended, GPA, and graduation status. Used for admissions evaluation, transfer credit assessment, and historical recordkeeping.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The Contact whose education history is recorded" },
          { "name": "Account__c", "type": "Lookup", "description": "The Educational Institution Account for the prior school" },
          { "name": "Degree_Earned__c", "type": "Picklist", "description": "Degree type: High School Diploma, Associate's, Bachelor's, Master's, Doctoral, Certificate" },
          { "name": "Field_of_Study__c", "type": "Text", "description": "Major, concentration, or field of study" },
          { "name": "Start_Date__c", "type": "Date", "description": "Date attendance began at the prior institution" },
          { "name": "End_Date__c", "type": "Date", "description": "Date attendance ended at the prior institution" },
          { "name": "GPA__c", "type": "Number", "description": "Grade point average at the prior institution" },
          { "name": "Class_Rank__c", "type": "Text", "description": "Class rank or standing at the prior institution" },
          { "name": "Graduation_Date__c", "type": "Date", "description": "Date of graduation or degree conferral" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Education History belongs to a Contact record" },
          { "target": "Account", "type": "child", "description": "References the Educational Institution Account for the prior school" }
        ]
      },
      {
        "name": "Credential__c",
        "type": "custom",
        "domain": "education_history",
        "description": "Tracks professional licenses, certifications, endorsements, and other credentials held by a Contact. Records the issuing authority, effective and expiration dates, verification status, and credential type. Used for faculty qualifications, graduate student professional requirements, and staff certifications.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The Contact who holds this credential" },
          { "name": "Name", "type": "Text", "description": "Credential name (e.g., CPA, RN License, Teaching Certificate)" },
          { "name": "Credential_Type__c", "type": "Picklist", "description": "Type: License, Certification, Endorsement, Professional Membership" },
          { "name": "Issuing_Authority__c", "type": "Text", "description": "Organization or body that issued the credential" },
          { "name": "Effective_Date__c", "type": "Date", "description": "Date the credential became effective" },
          { "name": "Expiration_Date__c", "type": "Date", "description": "Date the credential expires, if applicable" },
          { "name": "Status__c", "type": "Picklist", "description": "Verification status: Active, Expired, Pending, Revoked" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each credential belongs to a Contact record" }
        ]
      },
      {
        "name": "Attribute__c",
        "type": "custom",
        "domain": "education_history",
        "description": "Flexible tagging system for Contact characteristics and support needs. Captures accommodations (extended test time, note-takers), disability services, financial aid eligibility, athlete status, veteran status, and other institutional attributes. Each attribute has a type, value, start date, and optional end date.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The Contact this attribute applies to" },
          { "name": "Attribute_Type__c", "type": "Picklist", "description": "Category: Accommodation, Disability Service, Financial Aid, Achievement, Cohort, Custom" },
          { "name": "Subject_Account__c", "type": "Lookup", "description": "The Account providing or associated with this attribute" },
          { "name": "Start_Date__c", "type": "Date", "description": "Date the attribute became effective" },
          { "name": "End_Date__c", "type": "Date", "description": "Date the attribute expired or was removed" },
          { "name": "Description__c", "type": "TextArea", "description": "Details about the attribute and any special instructions" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each attribute belongs to a Contact record" },
          { "target": "Account", "type": "lookup", "description": "Optionally references the Account providing the service or attribute" }
        ]
      },
      {
        "name": "Facility__c",
        "type": "custom",
        "domain": "education_history",
        "description": "Campus buildings, classrooms, laboratories, dormitories, and other physical spaces. Supports a parent-child hierarchy (Campus > Building > Floor > Room) and capacity tracking. Used by Course Offerings for class location assignment and by SSH Appointments for meeting locations.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Facility name (e.g., Science Hall, Room 101, Smith Auditorium)" },
          { "name": "Facility_Type__c", "type": "Picklist", "description": "Type: Building, Classroom, Laboratory, Auditorium, Dormitory, Office, Library" },
          { "name": "Account__c", "type": "Lookup", "description": "The Educational Institution or Department Account this facility belongs to" },
          { "name": "Parent_Facility__c", "type": "Lookup", "description": "Parent facility for hierarchical nesting (Building > Room)" },
          { "name": "Capacity__c", "type": "Number", "description": "Maximum occupancy for scheduling purposes" },
          { "name": "Description__c", "type": "TextArea", "description": "Notes about the facility including equipment, accessibility, and features" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each facility belongs to an institutional Account" },
          { "target": "Facility__c", "type": "lookup", "description": "Facilities can nest under parent facilities for hierarchical modeling" },
          { "target": "Course_Offering__c", "type": "parent", "description": "Facilities serve as locations for Course Offerings" }
        ]
      }
    ]
  },

  "behavior": {
    "objects": [
      {
        "name": "Behavior_Involvement__c",
        "type": "custom",
        "domain": "behavior",
        "description": "Records each Contact's involvement in a behavioral incident Case. Captures the individual's role (Reporter, Witness, Victim, Offender), a description of their participation, and the link to the parent Case. Multiple involvement records per Case allow documenting all parties in an incident.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The Contact involved in the incident" },
          { "name": "Case__c", "type": "Lookup", "description": "The behavior incident Case this involvement is linked to" },
          { "name": "Role__c", "type": "Picklist", "description": "Role in the incident: Reporter, Witness, Victim, Offender" },
          { "name": "Description__c", "type": "LongTextArea", "description": "Description of the individual's involvement and relevant details" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each involvement record references a Contact" },
          { "target": "Case", "type": "child", "description": "Each involvement belongs to a behavior incident Case" }
        ]
      },
      {
        "name": "Behavior_Response__c",
        "type": "custom",
        "domain": "behavior",
        "description": "Documents institutional responses and corrective actions for behavioral incidents. Captures the response type (Warning, Suspension, Counseling Referral, Community Service, Expulsion), status, assigned administrator, start and end dates, and any conditions or follow-up requirements.",
        "fields": [
          { "name": "Case__c", "type": "Lookup", "description": "The behavior incident Case this response addresses" },
          { "name": "Contact__c", "type": "Lookup", "description": "The Contact (typically the offender) receiving this response" },
          { "name": "Type__c", "type": "Picklist", "description": "Response type: Warning, Suspension, Counseling Referral, Community Service, Probation, Expulsion" },
          { "name": "Status__c", "type": "Picklist", "description": "Status: Pending, In Progress, Completed, Appealed" },
          { "name": "Start_Date__c", "type": "Date", "description": "Date the response action begins" },
          { "name": "End_Date__c", "type": "Date", "description": "Date the response action ends" },
          { "name": "Description__c", "type": "LongTextArea", "description": "Details about the response, conditions, and follow-up requirements" }
        ],
        "relationships": [
          { "target": "Case", "type": "child", "description": "Each response belongs to a behavior incident Case" },
          { "target": "Contact", "type": "child", "description": "Each response is directed at a specific Contact" }
        ]
      }
    ]
  },

  "tdtm_settings": {
    "objects": [
      {
        "name": "Trigger_Handler__c",
        "type": "custom",
        "domain": "tdtm_settings",
        "description": "Configuration records controlling EDA's Table-Driven Trigger Management automation. Each handler defines an Apex class to execute on a specific object event (before/after insert/update/delete/undelete). Handlers can be enabled or disabled, reordered via load order, and filtered without modifying Apex code. Over 50 default handlers ship with EDA.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name for the trigger handler" },
          { "name": "Class__c", "type": "Text", "description": "Fully qualified Apex class name to execute" },
          { "name": "Object__c", "type": "Text", "description": "API name of the Salesforce object this handler runs on" },
          { "name": "Trigger_Action__c", "type": "MultiPicklist", "description": "Events that trigger execution: BeforeInsert, AfterInsert, BeforeUpdate, AfterUpdate, BeforeDelete, AfterDelete, AfterUndelete" },
          { "name": "Active__c", "type": "Checkbox", "description": "Whether this handler is currently enabled" },
          { "name": "Load_Order__c", "type": "Number", "description": "Execution priority (lower numbers run first)" },
          { "name": "Filter_Field__c", "type": "Text", "description": "Optional field API name to filter which records trigger this handler" },
          { "name": "Filter_Value__c", "type": "Text", "description": "Value that the filter field must match for the handler to execute" },
          { "name": "Asynchronous__c", "type": "Checkbox", "description": "Whether the handler executes asynchronously (queueable)" },
          { "name": "User_Managed__c", "type": "Checkbox", "description": "Whether the handler was created by an admin vs. shipped with EDA" }
        ],
        "relationships": [
          { "target": "Account", "type": "lookup", "description": "Handlers reference standard and custom objects across the EDA data model" },
          { "target": "Contact", "type": "lookup", "description": "Many handlers operate on Contact-related events" },
          { "target": "Affiliation__c", "type": "lookup", "description": "Affiliation handlers manage auto-creation and primary designation" }
        ]
      }
    ],
    "metadata": [
      {
        "type": "Hierarchy_Settings__c",
        "name": "EDA Hierarchy Settings",
        "fields": {
          "Account_Processor__c": "Text",
          "Accounts_to_Delete__c": "Text",
          "Automatic_Household_Naming__c": "Checkbox",
          "Reciprocal_Method__c": "Text",
          "Store_Errors__c": "Checkbox",
          "Disable_Error_Handling__c": "Checkbox",
          "Default_Account_Model__c": "Text",
          "Household_Account_Naming_Format__c": "Text",
          "Admin_Account_Naming_Format__c": "Text",
          "Affiliation_Record_Type_Enforced__c": "Checkbox"
        },
        "description": "EDA hierarchy settings controlling the Account model (Administrative vs. Household), naming conventions, error handling, reciprocal relationship method, and Affiliation record type enforcement. The primary configuration object for EDA platform behavior."
      },
      {
        "type": "Affl_Mappings__c",
        "name": "Affiliation Mappings",
        "fields": {
          "Account_Record_Type__c": "Text",
          "Primary_Affl_Field__c": "Text",
          "Auto_Program_Enrollment__c": "Checkbox",
          "Auto_Program_Enrollment_Status__c": "Text",
          "Auto_Program_Enrollment_Role__c": "Text"
        },
        "description": "Maps Account record types to Contact lookup fields for primary Affiliation auto-population. Also controls whether creating an Affiliation auto-creates a Program Enrollment record with specified status and role values."
      },
      {
        "type": "Relationship_Lookup__c",
        "name": "Relationship Lookups",
        "fields": {
          "Name__c": "Text",
          "Female__c": "Text",
          "Male__c": "Text",
          "Neutral__c": "Text",
          "Active__c": "Checkbox"
        },
        "description": "Reciprocal relationship type mappings used by TDTM to auto-generate inverse Relationship records. Each lookup defines the reciprocal type for Male, Female, and Neutral gender variants (e.g., Father maps to Son/Daughter/Child)."
      },
      {
        "type": "Relationship_Auto_Create__c",
        "name": "Relationship Auto-Create Settings",
        "fields": {
          "Object__c": "Text",
          "Field__c": "Text",
          "Relationship_Type__c": "Text",
          "Campaign_Types__c": "Text"
        },
        "description": "Configuration for auto-creating Relationship records from Contact lookup fields or Campaign membership. Specifies which object and field triggers auto-creation and what relationship type to assign."
      }
    ]
  },

  "student_cases": {
    "objects": [
      {
        "name": "Case",
        "type": "standard",
        "domain": "student_cases",
        "description": "The standard Salesforce Case object repurposed as the Student Record Case in SSH. Each student has a primary Case that serves as the unified hub aggregating success plans, alerts, tasks, appointments, and notes. Case Team Members represent the student's Success Team with configurable role-based access. Also used for behavior incident tracking in the EDA Behavior & Conduct domain. The Student Snapshot component on the Case page highlights essential details at a glance including student name, photo, primary program, and item counters for incomplete tasks, unresolved alerts, and upcoming appointments.",
        "fields": [
          { "name": "ContactId", "type": "Lookup", "description": "The student Contact this Case belongs to" },
          { "name": "AccountId", "type": "Lookup", "description": "The organizational Account associated with this Case" },
          { "name": "Subject", "type": "Text", "description": "Case subject line identifying the student and purpose" },
          { "name": "Description", "type": "LongTextArea", "description": "Detailed description of the student's support situation" },
          { "name": "Status", "type": "Picklist", "description": "Case status: New, Working, Escalated, Closed" },
          { "name": "Priority", "type": "Picklist", "description": "Priority level: High, Medium, Low" },
          { "name": "RecordTypeId", "type": "Lookup", "description": "Distinguishes Student Record Cases from Behavior Cases and standard Cases" },
          { "name": "Type", "type": "Picklist", "description": "Case type: Student Record, Behavior Incident, Academic, Administrative" },
          { "name": "Origin", "type": "Picklist", "description": "How the case was created: Web, Email, Phone, Internal" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each Case belongs to a student Contact" },
          { "target": "Account", "type": "child", "description": "Cases are associated with organizational Accounts" },
          { "target": "Success_Plan__c", "type": "parent", "description": "Student Record Cases contain Success Plans" },
          { "target": "Alert__c", "type": "parent", "description": "Alerts are linked to Student Record Cases" },
          { "target": "Behavior_Involvement__c", "type": "parent", "description": "Behavior Cases have involvement records" },
          { "target": "Behavior_Response__c", "type": "parent", "description": "Behavior Cases have response records" }
        ]
      },
      {
        "name": "Support_Pool__c",
        "type": "custom",
        "domain": "student_cases",
        "description": "Represents unassigned departmental support groups in Student Success Hub. Support Pools model services like Career Center, Financial Aid Office, Tutoring Center, and Health Services. Students can request help from any available pool member without needing a specific advisor assignment. Pools are linked to Topics for appointment scheduling. Each Support Pool is backed by a predefined case team, and the Case Team Name field must exactly match the predefined team's name for appointment scheduling to work in the portal.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Pool name (e.g., Career Center, Financial Aid Office, Academic Tutoring)" },
          { "name": "Description__c", "type": "LongTextArea", "description": "Description of the services provided by this support pool" },
          { "name": "Active__c", "type": "Checkbox", "description": "Whether this pool is currently accepting requests" },
          { "name": "Queue_Id__c", "type": "Lookup", "description": "Salesforce Queue used for case assignment routing" }
        ],
        "relationships": [
          { "target": "Topic__c", "type": "lookup", "description": "Support Pools are linked to Topics for appointment scheduling" },
          { "target": "Case", "type": "lookup", "description": "Cases can be routed to Support Pool queues" }
        ]
      }
    ]
  },

  "success_plans": {
    "objects": [
      {
        "name": "Success_Plan__c",
        "type": "custom",
        "domain": "success_plans",
        "description": "Structured goal-setting and task management record for student advising. Each Success Plan has a type (Academic, Career, Financial Aid, Health, Housing, Attendance, Behavior), a status, and contains Tasks. Plans are created from templates or manually under a Student Record Case. Tracks open and overdue task counts for advisor dashboards. Plans can be assigned to support staff or, in organizations with student user licenses, directly to students for self-tracking through the portal. Mass actions allow staff to create multiple plans for multiple students from selected Alerts.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Plan name describing the goal (e.g., Fall GPA Improvement Plan)" },
          { "name": "Case__c", "type": "Lookup", "description": "The Student Record Case this plan belongs to" },
          { "name": "Contact__c", "type": "Lookup", "description": "The student Contact this plan is for" },
          { "name": "Type__c", "type": "Picklist", "description": "Plan type: Academic, Career, Financial Aid, Health, Housing, Attendance, Behavior" },
          { "name": "Status__c", "type": "Picklist", "description": "Plan status: Not Started, In Progress, Completed, Cancelled" },
          { "name": "Start_Date__c", "type": "Date", "description": "Date the plan was activated" },
          { "name": "End_Date__c", "type": "Date", "description": "Target completion date for the plan" },
          { "name": "Description__c", "type": "LongTextArea", "description": "Detailed description of the plan's goals and expectations" },
          { "name": "Open_Tasks__c", "type": "Number", "description": "Roll-up count of tasks with status not equal to Completed" },
          { "name": "Overdue_Tasks__c", "type": "Number", "description": "Roll-up count of tasks past their due date" },
          { "name": "Template__c", "type": "Lookup", "description": "The Success Plan Template this plan was generated from, if applicable" }
        ],
        "relationships": [
          { "target": "Case", "type": "child", "description": "Each Success Plan belongs to a Student Record Case" },
          { "target": "Contact", "type": "child", "description": "Each plan is assigned to a student Contact" },
          { "target": "Task", "type": "parent", "description": "Plans contain Tasks representing individual action items" },
          { "target": "Success_Plan_Template__c", "type": "lookup", "description": "Plans may be generated from a reusable template" }
        ]
      },
      {
        "name": "Success_Plan_Template__c",
        "type": "custom",
        "domain": "success_plans",
        "description": "Reusable template for creating Success Plans with predefined task sets. Administrators define templates for common advising scenarios (Academic Improvement, Career Exploration, Financial Aid Review) with default tasks, descriptions, and assignee patterns. Applying a template generates a new Success Plan populated with the template's tasks.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Template name (e.g., Academic Improvement Template, Career Exploration)" },
          { "name": "Type__c", "type": "Picklist", "description": "Plan type category: Academic, Career, Financial Aid, Health, Housing" },
          { "name": "Description__c", "type": "LongTextArea", "description": "Description of the template's purpose and when to use it" },
          { "name": "Active__c", "type": "Checkbox", "description": "Whether this template is available for use" }
        ],
        "relationships": [
          { "target": "Success_Plan_Template_Task__c", "type": "parent", "description": "Templates contain predefined task definitions" },
          { "target": "Success_Plan__c", "type": "parent", "description": "Templates generate Success Plan instances" }
        ]
      },
      {
        "name": "Success_Plan_Template_Task__c",
        "type": "custom",
        "domain": "success_plans",
        "description": "Predefined task definitions within a Success Plan Template. Each template task specifies a subject, description, default assignee pattern (Student, Advisor, Specific User), priority, and due date offset from plan creation. When a template is applied, these definitions become actual Task records.",
        "fields": [
          { "name": "Success_Plan_Template__c", "type": "Lookup", "description": "The parent template this task definition belongs to" },
          { "name": "Subject__c", "type": "Text", "description": "Task subject line (e.g., Schedule advising appointment, Complete FAFSA)" },
          { "name": "Description__c", "type": "LongTextArea", "description": "Detailed task instructions and expectations" },
          { "name": "Priority__c", "type": "Picklist", "description": "Default priority: High, Normal, Low" },
          { "name": "Days_After_Creation__c", "type": "Number", "description": "Number of days after plan creation to set as the due date" },
          { "name": "Assigned_To__c", "type": "Picklist", "description": "Default assignee pattern: Student, Advisor, Case Owner" },
          { "name": "Sequence__c", "type": "Number", "description": "Sort order within the template" }
        ],
        "relationships": [
          { "target": "Success_Plan_Template__c", "type": "child", "description": "Each task definition belongs to a template" }
        ]
      },
      {
        "name": "Task",
        "type": "standard",
        "domain": "success_plans",
        "description": "Standard Salesforce Task object used for individual action items within Success Plans or standalone. Tasks are assigned to students or staff with subject, description, priority, due date, and status. In SSH, Tasks appear on the student dashboard, in the student portal, and are tracked against Success Plan progress. The chatbot sends reminders for overdue tasks.",
        "fields": [
          { "name": "Subject", "type": "Text", "description": "Task subject line describing the action item" },
          { "name": "Description", "type": "LongTextArea", "description": "Detailed instructions or context for the task" },
          { "name": "WhoId", "type": "Lookup", "description": "The Contact this task is related to" },
          { "name": "WhatId", "type": "Lookup", "description": "The related record (Success Plan, Case, etc.)" },
          { "name": "OwnerId", "type": "Lookup", "description": "The User or Queue assigned to complete this task" },
          { "name": "Status", "type": "Picklist", "description": "Task status: Not Started, In Progress, Completed, Waiting, Deferred" },
          { "name": "Priority", "type": "Picklist", "description": "Priority level: High, Normal, Low" },
          { "name": "ActivityDate", "type": "Date", "description": "Due date for the task" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Tasks are related to student Contacts" },
          { "target": "Success_Plan__c", "type": "child", "description": "Tasks belong to Success Plans through the WhatId field" },
          { "target": "Case", "type": "child", "description": "Tasks can also relate to Cases through WhatId" }
        ]
      }
    ]
  },

  "alerts": {
    "objects": [
      {
        "name": "Alert__c",
        "type": "custom",
        "domain": "alerts",
        "description": "Early warning records in Student Success Hub for flagging at-risk students. Support staff or automated processes create Alerts categorized by type (Academic, Career, Financial Aid, Health, Housing, Attendance, Behavior) with customizable reason picklists. Alerts are linked to Student Record Cases and support assignment rules, mass actions, and Slack integration through the Student Success Alerts app. Default record types must be assigned to the appropriate support staff and System Administrator profiles. Mass actions enable bulk operations including creating Cases and applying Success Plan templates from selected Alerts.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The student Contact this alert is about" },
          { "name": "Case__c", "type": "Lookup", "description": "The Student Record Case this alert is linked to" },
          { "name": "Type__c", "type": "Picklist", "description": "Alert type: Academic, Career, Financial Aid, Health, Housing, Attendance, Behavior" },
          { "name": "Reason__c", "type": "Picklist", "description": "Specific reason: Grade Concern, Attendance Issue, Academic Integrity, Financial Difficulty, Housing Insecurity, Health Concern" },
          { "name": "Status__c", "type": "Picklist", "description": "Alert status: New, In Progress, Resolved, Closed" },
          { "name": "Priority__c", "type": "Picklist", "description": "Priority level: High, Medium, Low" },
          { "name": "Description__c", "type": "LongTextArea", "description": "Detailed description of the concern" },
          { "name": "Raised_By__c", "type": "Lookup", "description": "The User who raised the alert (faculty, staff, or automated)" },
          { "name": "Assigned_To__c", "type": "Lookup", "description": "The User or Queue the alert is assigned to for follow-up" },
          { "name": "Resolution_Notes__c", "type": "LongTextArea", "description": "Notes documenting how the alert was resolved" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each alert pertains to a student Contact" },
          { "target": "Case", "type": "child", "description": "Alerts are linked to Student Record Cases" },
          { "target": "Success_Plan__c", "type": "lookup", "description": "Alerts may trigger the creation of Success Plans as an intervention" }
        ]
      }
    ]
  },

  "appointments": {
    "objects": [
      {
        "name": "Event",
        "type": "standard",
        "domain": "appointments",
        "description": "Standard Salesforce Event object used for appointment management in Student Success Hub. Event records represent scheduled appointments, walk-in visits, group sessions, and staff availability blocks. SSH extends Events with custom record types: Support Time represents staff availability blocks, Support Event represents actual scheduled appointments, and Non-Support Event represents calendar events unrelated to student support. Staff can sync their SSH appointments with Microsoft or Google work calendars using Einstein Activity Capture.",
        "fields": [
          { "name": "Subject", "type": "Text", "description": "Appointment subject or title" },
          { "name": "WhoId", "type": "Lookup", "description": "The student Contact this appointment is with" },
          { "name": "OwnerId", "type": "Lookup", "description": "The staff User who owns the availability or appointment" },
          { "name": "StartDateTime", "type": "DateTime", "description": "Appointment or availability start date and time" },
          { "name": "EndDateTime", "type": "DateTime", "description": "Appointment or availability end date and time" },
          { "name": "RecordTypeId", "type": "Lookup", "description": "Event type: Scheduled Availability, Walk-In Availability, Group Availability, Support Event" },
          { "name": "Location", "type": "Text", "description": "Meeting location or virtual meeting link" },
          { "name": "Description", "type": "LongTextArea", "description": "Notes or agenda for the appointment" },
          { "name": "WhatId", "type": "Lookup", "description": "Related record: Case, Account, or other object" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Events are related to student Contacts through WhoId" },
          { "target": "Case", "type": "child", "description": "Appointment Events are linked to Student Record Cases through WhatId" },
          { "target": "Topic__c", "type": "lookup", "description": "Appointments are categorized by Topic for service alignment" },
          { "target": "Location__c", "type": "lookup", "description": "Appointments may reference SSH Location records" }
        ]
      },
      {
        "name": "Topic__c",
        "type": "custom",
        "domain": "appointments",
        "description": "Hierarchical service categorization for SSH appointment scheduling. Top-level topics (Academic, Career, Financial Aid, Health) contain subtopics (Degree Planning, Resume Review, FAFSA Assistance). Topics control which services appear in the student portal scheduler and which staff are available for each service through Role, User, and Queue Topic Settings. Topic configuration must be completed before assigning success team members to students in organizations that use appointments, as the three Topic objects combine to organize who is available to meet with students on which support topics.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Topic name (e.g., Academic Advising, Career Exploration)" },
          { "name": "Parent_Topic__c", "type": "Lookup", "description": "Parent topic for hierarchical nesting of service categories" },
          { "name": "Description__c", "type": "LongTextArea", "description": "Description of the service or category" },
          { "name": "Active__c", "type": "Checkbox", "description": "Whether this topic is available in scheduling interfaces" },
          { "name": "Sort_Order__c", "type": "Number", "description": "Display order in the topic list" }
        ],
        "relationships": [
          { "target": "Topic__c", "type": "lookup", "description": "Topics nest under parent topics for hierarchical categorization" },
          { "target": "Role_Topic_Setting__c", "type": "parent", "description": "Role-based settings determine which roles can advise on this topic" },
          { "target": "User_Topic_Setting__c", "type": "parent", "description": "User settings specify individual staff availability for this topic" },
          { "target": "Queue_Topic_Setting__c", "type": "parent", "description": "Queue settings link Support Pool queues to this topic" }
        ]
      },
      {
        "name": "Role_Topic_Setting__c",
        "type": "custom",
        "domain": "appointments",
        "description": "Maps a Case Team Role to a Topic, defining which support roles can provide advising for specific service categories. For example, the Academic Advisor role might be linked to Academic Advising and Degree Planning topics. Controls staff availability in the scheduling interface.",
        "fields": [
          { "name": "Topic__c", "type": "Lookup", "description": "The Topic this role setting applies to" },
          { "name": "Role__c", "type": "Text", "description": "The Case Team Role name that can advise on this topic" },
          { "name": "Active__c", "type": "Checkbox", "description": "Whether this role-topic mapping is active" }
        ],
        "relationships": [
          { "target": "Topic__c", "type": "child", "description": "Each setting links a role to a specific Topic" }
        ]
      },
      {
        "name": "User_Topic_Setting__c",
        "type": "custom",
        "domain": "appointments",
        "description": "Links an individual User to a Topic, specifying that the user is available to advise on this service category. Overrides or supplements Role-based settings for fine-grained control of which staff appear as available for specific appointment types.",
        "fields": [
          { "name": "Topic__c", "type": "Lookup", "description": "The Topic this user setting applies to" },
          { "name": "User__c", "type": "Lookup", "description": "The User available for this topic" },
          { "name": "Active__c", "type": "Checkbox", "description": "Whether this user-topic mapping is active" }
        ],
        "relationships": [
          { "target": "Topic__c", "type": "child", "description": "Each setting links a user to a specific Topic" }
        ]
      },
      {
        "name": "Queue_Topic_Setting__c",
        "type": "custom",
        "domain": "appointments",
        "description": "Links a Salesforce Queue (representing a Support Pool) to a Topic. Enables queue-based appointment routing where students select a service topic and are routed to the next available member of the associated Support Pool queue.",
        "fields": [
          { "name": "Topic__c", "type": "Lookup", "description": "The Topic this queue setting applies to" },
          { "name": "Queue_Id__c", "type": "Lookup", "description": "The Salesforce Queue linked to this topic" },
          { "name": "Active__c", "type": "Checkbox", "description": "Whether this queue-topic mapping is active" }
        ],
        "relationships": [
          { "target": "Topic__c", "type": "child", "description": "Each setting links a queue to a specific Topic" },
          { "target": "Support_Pool__c", "type": "lookup", "description": "Queues represent Support Pool groups" }
        ]
      },
      {
        "name": "Location__c",
        "type": "custom",
        "domain": "appointments",
        "description": "SSH-specific location records for appointment meeting places. Distinct from EDA Facility records, Locations represent advising offices, one-stop centers, virtual meeting rooms, and other spaces where SSH appointments take place. Supports walk-in queue management at physical front-desk locations.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Location name (e.g., Advising Center Room 200, Virtual Meeting Room)" },
          { "name": "Type__c", "type": "Picklist", "description": "Location type: Office, One-Stop Center, Virtual, Walk-In Center" },
          { "name": "Address__c", "type": "TextArea", "description": "Physical address or building and room information" },
          { "name": "Active__c", "type": "Checkbox", "description": "Whether this location is currently available for appointments" },
          { "name": "Virtual_Meeting_Link__c", "type": "URL", "description": "URL for virtual meeting locations (Zoom, Teams, etc.)" }
        ],
        "relationships": [
          { "target": "Event", "type": "parent", "description": "Locations are referenced by appointment Events" }
        ]
      }
    ]
  },

  "pathways": {
    "objects": [
      {
        "name": "Personal_Program_Plan__c",
        "type": "custom",
        "domain": "pathways",
        "description": "A student-created graduation roadmap within SSH Pathways. Students chart their path by selecting courses and arranging them into future terms, creating a personalized timeline to degree completion. Each Personal Program Plan links to a Contact, a Program Plan, and contains term-based course selections.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The student Contact who created this plan" },
          { "name": "Program_Plan__c", "type": "Lookup", "description": "The Program Plan this personal plan is based on" },
          { "name": "Name", "type": "Text", "description": "Plan name given by the student or auto-generated" },
          { "name": "Status__c", "type": "Picklist", "description": "Plan status: Draft, Active, Archived" },
          { "name": "Created_Date__c", "type": "Date", "description": "Date the personal plan was created" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each personal plan belongs to a student Contact" },
          { "target": "Program_Plan__c", "type": "child", "description": "Based on an institutional Program Plan" },
          { "target": "Personal_Program_Plan_Course__c", "type": "parent", "description": "Contains course selections for specific terms" },
          { "target": "Personal_Program_Plan_Term__c", "type": "parent", "description": "Contains term-level groupings for the plan" }
        ]
      },
      {
        "name": "Personal_Program_Plan_Course__c",
        "type": "custom",
        "domain": "pathways",
        "description": "An individual course selection within a student's Personal Program Plan. Links a Course to a specific term slot in the plan. Tracks whether the course has been completed, is in progress, or is planned for the future.",
        "fields": [
          { "name": "Personal_Program_Plan__c", "type": "Lookup", "description": "The parent Personal Program Plan" },
          { "name": "Course__c", "type": "Lookup", "description": "The selected Course catalog record" },
          { "name": "Personal_Program_Plan_Term__c", "type": "Lookup", "description": "The term slot this course is planned for" },
          { "name": "Status__c", "type": "Picklist", "description": "Status: Planned, In Progress, Completed, Dropped" },
          { "name": "Plan_Requirement__c", "type": "Lookup", "description": "The Plan Requirement this course selection fulfills" }
        ],
        "relationships": [
          { "target": "Personal_Program_Plan__c", "type": "child", "description": "Each course selection belongs to a Personal Program Plan" },
          { "target": "Course__c", "type": "child", "description": "References a Course catalog record" },
          { "target": "Personal_Program_Plan_Term__c", "type": "child", "description": "Grouped into a specific term within the plan" },
          { "target": "Plan_Requirement__c", "type": "lookup", "description": "Maps to the requirement this course satisfies" }
        ]
      },
      {
        "name": "Personal_Program_Plan_Term__c",
        "type": "custom",
        "domain": "pathways",
        "description": "A term-level grouping within a Personal Program Plan. Represents a future semester or quarter where the student plans to take specific courses. Contains credit hour totals and status for the planned term.",
        "fields": [
          { "name": "Personal_Program_Plan__c", "type": "Lookup", "description": "The parent Personal Program Plan" },
          { "name": "Term__c", "type": "Lookup", "description": "The academic Term this grouping represents" },
          { "name": "Name", "type": "Text", "description": "Term label (e.g., Fall 2027, Spring 2028)" },
          { "name": "Total_Credits__c", "type": "Number", "description": "Total credit hours planned for this term" },
          { "name": "Sequence__c", "type": "Number", "description": "Sort order within the Personal Program Plan timeline" }
        ],
        "relationships": [
          { "target": "Personal_Program_Plan__c", "type": "child", "description": "Each term grouping belongs to a Personal Program Plan" },
          { "target": "Term__c", "type": "lookup", "description": "References the academic Term" },
          { "target": "Personal_Program_Plan_Course__c", "type": "parent", "description": "Contains the courses planned for this term" }
        ]
      },
      {
        "name": "Course_Bookmark__c",
        "type": "custom",
        "domain": "pathways",
        "description": "Saved course selections that students bookmark while exploring degree requirements in Pathways. Students create bookmarks for courses they are interested in taking, building a shortlist for registration planning before committing to a Personal Program Plan.",
        "fields": [
          { "name": "Contact__c", "type": "Lookup", "description": "The student Contact who bookmarked this course" },
          { "name": "Course__c", "type": "Lookup", "description": "The bookmarked Course catalog record" },
          { "name": "Notes__c", "type": "TextArea", "description": "Student's notes about why they bookmarked this course" },
          { "name": "Created_Date__c", "type": "Date", "description": "Date the bookmark was created" }
        ],
        "relationships": [
          { "target": "Contact", "type": "child", "description": "Each bookmark belongs to a student Contact" },
          { "target": "Course__c", "type": "child", "description": "References a Course catalog record" }
        ]
      }
    ]
  },

  "student_portal": {
    "objects": []
  }

};
