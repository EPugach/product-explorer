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
      desc: "The 1:1 Account-Contact model where each Contact has a unique Administrative Account. This replaces the traditional B2B Account hierarchy with an education-centric model.",
      tags: ["Account", "Contact"],
      connections: [{ planet: "affiliations", desc: "Affiliations link Contacts to organizational Accounts" }]
    },
    {
      id: "contact-management",
      name: "Contact Management",
      icon: "\u{1F9D1}",
      desc: "Central Contact records storing biographical data, communication preferences, and demographic information for students, faculty, staff, alumni, and other constituents.",
      tags: ["Contact"],
      connections: [{ planet: "relationships", desc: "Relationships track Contact-to-Contact connections" }]
    },
    {
      id: "address-management",
      name: "Address Management",
      icon: "\u{1F4CD}",
      desc: "Multi-address support with seasonal, mailing, home, and other address types. Default address logic automatically syncs the current address to the Contact's mailing fields.",
      tags: ["Address__c"],
      connections: [{ planet: "tdtm_settings", desc: "TDTM triggers automate address synchronization" }]
    },
    {
      id: "household-accounts",
      name: "Household Accounts",
      icon: "\u{1F3E0}",
      desc: "Household Account model groups related Contacts (family members) under a shared Account. Household naming conventions automatically update when members change.",
      tags: ["Account"],
      connections: [{ planet: "relationships", desc: "Relationships between household members" }]
    },
    {
      id: "account-record-types",
      name: "Account Record Types",
      icon: "\u{1F3DB}",
      desc: "Preconfigured Account record types: Educational Institution, University Department, Academic Program, Sports Organization, and Business Organization. Each maps to a distinct organizational entity.",
      tags: ["Account"],
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
      desc: "Contact-to-Contact relationship tracking with configurable types (Parent, Sibling, Spouse, Advisor, Tutor, Coach) and status indicators.",
      tags: ["Relationship__c"],
      connections: [{ planet: "accounts_contacts", desc: "Relationships connect two Contact records" }]
    },
    {
      id: "reciprocal-management",
      name: "Reciprocal Management",
      icon: "\u{1F503}",
      desc: "Automatic creation of inverse relationship records. A Relationship Lookup maps each type to its reciprocal (e.g., Parent/Child, Employer/Employee) with gender-specific variants.",
      tags: ["Relationship__c"],
      connections: [{ planet: "tdtm_settings", desc: "TDTM handlers manage reciprocal creation and updates" }]
    },
    {
      id: "contact-languages",
      name: "Contact Languages",
      icon: "\u{1F30D}",
      desc: "Tracks language proficiency per Contact including fluency level and primary language designation. Supports multilingual campus communities.",
      tags: ["Contact_Language__c", "Language__c"],
      connections: [{ planet: "accounts_contacts", desc: "Languages are associated with Contact records" }]
    },
    {
      id: "relationship-autocreation",
      name: "Relationship Auto-Creation",
      icon: "\u{26A1}",
      desc: "Configurable auto-creation settings that generate Relationship records from Contact lookup fields. Reduces manual data entry for common relationship patterns.",
      tags: ["Relationship__c"],
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
      desc: "Contact-to-Account relationship records with role, status (Current/Former), start/end dates, and description. Maps students and staff to departments, programs, and organizations.",
      tags: ["Affiliation__c"],
      connections: [{ planet: "accounts_contacts", desc: "Affiliations link Contacts to organizational Accounts" }]
    },
    {
      id: "primary-affiliation",
      name: "Primary Affiliation",
      icon: "\u{2B50}",
      desc: "Each Contact can have one primary Affiliation per Account record type. The primary lookup field on Contact is automatically maintained when Affiliations are created or updated.",
      tags: ["Affiliation__c", "Contact"],
      connections: [{ planet: "accounts_contacts", desc: "Primary Affiliation updates Contact lookup fields" }]
    },
    {
      id: "affiliation-mappings",
      name: "Affiliation Mappings",
      icon: "\u{1F5FA}",
      desc: "Auto-creation mappings that generate Affiliation records when Contacts are associated with Accounts of specific record types. Configurable in EDA Settings.",
      tags: ["Affiliation__c"],
      connections: [{ planet: "tdtm_settings", desc: "Mappings configured through EDA Settings" }]
    },
    {
      id: "enrollment-sync",
      name: "Enrollment Synchronization",
      icon: "\u{1F504}",
      desc: "Bidirectional sync between Program Enrollment and Affiliation records. Creating a Program Enrollment auto-creates a corresponding Affiliation, and vice versa.",
      tags: ["Affiliation__c", "Program_Enrollment__c"],
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
      desc: "Hierarchical definitions of academic programs (majors, minors, certificates). Each plan organizes requirements into nested categories like Core Courses, Electives, and Concentrations.",
      tags: ["Program_Plan__c"],
      connections: [{ planet: "pathways", desc: "SSH Pathways provides visual display of Program Plans" }]
    },
    {
      id: "plan-requirements",
      name: "Plan Requirements",
      icon: "\u{2705}",
      desc: "Individual requirements within a Program Plan. Support parent-child nesting for requirement groups (e.g., 'Complete 3 of the following'). Link to specific Courses when applicable.",
      tags: ["Plan_Requirement__c"],
      connections: [{ planet: "courses", desc: "Requirements reference specific Course records" }]
    },
    {
      id: "program-enrollment",
      name: "Program Enrollment",
      icon: "\u{1F4DD}",
      desc: "Tracks a student's enrollment in an academic program with admission date, status, GPA, and expected graduation. Auto-syncs with Affiliation records.",
      tags: ["Program_Enrollment__c"],
      connections: [{ planet: "affiliations", desc: "Program Enrollment creates corresponding Affiliations" }]
    },
    {
      id: "academic-certifications",
      name: "Academic Certifications",
      icon: "\u{1F3C6}",
      desc: "Tracks degrees, certificates, and credentials awarded to students upon program completion. Links to the Program Plan and Contact for historical recordkeeping.",
      tags: ["Academic_Certification__c"],
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
      desc: "Course definitions with name, code, credit hours, department, and description. Courses exist independently of terms and are reused across multiple offerings.",
      tags: ["Course__c"],
      connections: [{ planet: "academic_programs", desc: "Courses fulfill Program Plan requirements" }]
    },
    {
      id: "course-offerings",
      name: "Course Offerings",
      icon: "\u{1F4C5}",
      desc: "Term-specific instances of a Course with capacity, location, start/end dates, and section number. Each offering is linked to a Term and a Course record.",
      tags: ["Course_Offering__c"],
      connections: [{ planet: "education_history", desc: "Offerings use Facility records for location" }]
    },
    {
      id: "course-connections",
      name: "Course Connections",
      icon: "\u{1F517}",
      desc: "Student and faculty enrollment in Course Offerings. Tracks enrollment status (Current, Former), role (Student, Faculty), and related Program Enrollment.",
      tags: ["Course_Connection__c"],
      connections: [{ planet: "academic_performance", desc: "Course Connections carry grade information" }]
    },
    {
      id: "class-scheduling",
      name: "Class Scheduling",
      icon: "\u{23F0}",
      desc: "Course Offering Schedules define meeting patterns (days, start/end times) for each offering. Time Blocks represent reusable time slot definitions.",
      tags: ["Course_Offering_Schedule__c", "Time_Block__c"],
      connections: [{ planet: "appointments", desc: "Class schedules inform appointment availability" }]
    },
    {
      id: "term-management",
      name: "Term Management",
      icon: "\u{1F4C6}",
      desc: "Academic terms (semesters, quarters, trimesters) with start/end dates and grading period sequences. Supports parent-child hierarchies for nested terms.",
      tags: ["Term__c"],
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
      desc: "Grade records per Contact per Term. Tracks letter grade, GPA, credit hours attempted/earned, and class rank. Links to Course Connection for course-specific grading.",
      tags: ["Term_Grade__c"],
      connections: [{ planet: "courses", desc: "Grades are recorded for specific Course Connections" }]
    },
    {
      id: "testing",
      name: "Test Definitions",
      icon: "\u{1F4CB}",
      desc: "Standardized assessment definitions (SAT, ACT, GRE, institutional exams) with score ranges, sections, and administration details.",
      tags: ["Test__c"],
      connections: [{ planet: "education_history", desc: "Tests support admissions and credential evaluation" }]
    },
    {
      id: "test-scores",
      name: "Test Scores",
      icon: "\u{1F4AF}",
      desc: "Individual student results on assessments. Records score value, percentile, test date, and section breakdown. Multiple scores per Test per Contact supported.",
      tags: ["Test_Score__c"],
      connections: [{ planet: "accounts_contacts", desc: "Test Scores belong to Contact records" }]
    },
    {
      id: "attendance-tracking",
      name: "Attendance Tracking",
      icon: "\u{1F4C8}",
      desc: "Attendance Event records for tracking presence, absence, tardy, and excused status per class session. Supports both K-12 daily attendance and higher ed per-class tracking.",
      tags: ["Attendance_Event__c"],
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
      desc: "Prior education tracking for students. Records previous institutions, degrees earned, dates attended, and fields of study. Supports transfer credit evaluation.",
      tags: ["Education_History__c"],
      connections: [{ planet: "accounts_contacts", desc: "Education History belongs to Contact records" }]
    },
    {
      id: "credentials",
      name: "Credentials",
      icon: "\u{1F4C4}",
      desc: "Professional licenses, certifications, and endorsements held by contacts. Tracks issuing authority, expiration dates, and verification status.",
      tags: ["Credential__c"],
      connections: [{ planet: "academic_programs", desc: "Credentials may result from program completion" }]
    },
    {
      id: "attributes",
      name: "Attributes",
      icon: "\u{1F3F7}",
      desc: "Flexible tagging system for student characteristics: accommodations, disability services, support needs, financial aid eligibility, and achievement badges.",
      tags: ["Attribute__c"],
      connections: [{ planet: "student_cases", desc: "Attributes inform student support planning" }]
    },
    {
      id: "facilities",
      name: "Facilities",
      icon: "\u{1F3D7}",
      desc: "Campus buildings, classrooms, labs, dormitories, and sports facilities. Supports hierarchy (building > floor > room) and capacity tracking for scheduling.",
      tags: ["Facility__c"],
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
      desc: "Case records tracking code of conduct violations, disciplinary events, and campus incidents. Each Case captures date, location, type, and severity.",
      tags: ["Case"],
      connections: [{ planet: "student_cases", desc: "Behavior Cases are related to Student Record Cases" }]
    },
    {
      id: "behavior-involvement",
      name: "Behavior Involvement",
      icon: "\u{1F465}",
      desc: "Records each Contact's involvement in a behavior incident with a specific role (Reporter, Witness, Victim, Offender) and description of their participation.",
      tags: ["Behavior_Involvement__c"],
      connections: [{ planet: "accounts_contacts", desc: "Involvement records reference Contact records" }]
    },
    {
      id: "behavior-responses",
      name: "Behavior Responses",
      icon: "\u{1F4DD}",
      desc: "Institutional responses to behavior incidents: warnings, suspensions, counseling referrals, community service, and other corrective actions with dates and status.",
      tags: ["Behavior_Response__c"],
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
      desc: "50+ configurable trigger handler records controlling Apex automation. Each handler specifies the object, event (before/after insert/update/delete), class name, and load order.",
      tags: ["Trigger_Handler__c"],
      connections: [{ planet: "accounts_contacts", desc: "Handlers automate Account-Contact operations" }]
    },
    {
      id: "eda-settings",
      name: "EDA Settings",
      icon: "\u{1F3DB}",
      desc: "Centralized configuration panel for EDA behavior: Account model preferences, Affiliation mappings, relationship auto-creation, address defaults, and error handling.",
      tags: ["Trigger_Handler__c"],
      connections: [{ planet: "affiliations", desc: "Settings control Affiliation auto-creation mappings" }]
    },
    {
      id: "installation-admin",
      name: "Installation & Administration",
      icon: "\u{1F4E6}",
      desc: "Package installation prerequisites, compatibility requirements, version management, release activation, and health check utilities for EDA administration.",
      tags: ["Trigger_Handler__c"],
      connections: [{ planet: "student_cases", desc: "SSH installation builds on EDA foundation" }]
    },
    {
      id: "data-automation",
      name: "Data Automation Rules",
      icon: "\u{1F504}",
      desc: "Automated data consistency rules managed through TDTM: naming conventions, cascade updates, duplicate prevention, and cross-object synchronization logic.",
      tags: ["Trigger_Handler__c"],
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
      desc: "The unified support record for each student. Aggregates success plans, alerts, tasks, appointments, and notes into a single case providing a 360-degree support view.",
      tags: ["Case"],
      connections: [{ planet: "success_plans", desc: "Success Plans are created under Student Record Cases" }]
    },
    {
      id: "success-teams",
      name: "Success Teams",
      icon: "\u{1F46B}",
      desc: "Groups of support staff assigned to individual students via Case Team Members. Each member has a role defining their function (Academic Advisor, Career Coach, Financial Aid Counselor).",
      tags: ["Case"],
      connections: [{ planet: "student_portal", desc: "Students see their Success Team in the portal" }]
    },
    {
      id: "support-pools",
      name: "Support Pools",
      icon: "\u{1F3CA}",
      desc: "Unassigned support groups representing departments or services (Career Center, Financial Aid, Tutoring). Students can request help from any available pool member.",
      tags: ["Support_Pool__c"],
      connections: [{ planet: "appointments", desc: "Support Pools power queue-based appointment scheduling" }]
    },
    {
      id: "case-team-roles",
      name: "Case Team Roles",
      icon: "\u{1F3AD}",
      desc: "Role definitions controlling access levels (read, write, read-write, or none) for Case Team Members on Student Record Cases. Configurable per institution.",
      tags: ["Case"],
      connections: [{ planet: "accounts_contacts", desc: "Team members are Contact/User records" }]
    },
    {
      id: "predefined-teams",
      name: "Predefined Case Teams",
      icon: "\u{1F4CB}",
      desc: "Reusable team templates with preconfigured member-role combinations. Quickly assign standard support teams to new students without individual member selection.",
      tags: ["Case"],
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
      desc: "Goal-oriented plans assigned to students with type classification (Academic, Career, Financial Aid, Health, Housing). Track open/overdue task counts and overall status.",
      tags: ["Success_Plan__c"],
      connections: [{ planet: "student_cases", desc: "Plans are created under Student Record Cases" }]
    },
    {
      id: "plan-templates",
      name: "Plan Templates",
      icon: "\u{1F4CB}",
      desc: "Preconfigured Success Plan templates with predefined tasks, descriptions, and default assignees. Accelerate plan creation for common support scenarios.",
      tags: ["Success_Plan_Template__c", "Success_Plan_Template_Task__c"],
      connections: [{ planet: "alerts", desc: "Templates can be applied when responding to Alerts" }]
    },
    {
      id: "task-management",
      name: "Task Management",
      icon: "\u{2705}",
      desc: "Individual tasks within Success Plans or standalone. Assigned to students or staff with priority levels, due dates, and status tracking. Supports both Plan-based and ad-hoc tasks.",
      tags: ["Task"],
      connections: [{ planet: "student_portal", desc: "Students view and complete tasks in the portal" }]
    },
    {
      id: "plan-progress",
      name: "Plan Progress Tracking",
      icon: "\u{1F4C8}",
      desc: "Visual progress indicators showing completed vs. total tasks, overdue items, and plan status. Progress bars and summary counts update in real-time.",
      tags: ["Success_Plan__c"],
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
      desc: "Early warning records raised by faculty, staff, or automated processes. Categorized by type with customizable reason picklists (Grade Concern, Attendance Issue, Academic Integrity).",
      tags: ["Alert__c"],
      connections: [{ planet: "student_cases", desc: "Alerts link to Student Record Cases" }]
    },
    {
      id: "alert-assignment",
      name: "Alert Assignment",
      icon: "\u{1F4E8}",
      desc: "Automated routing of Alerts to appropriate support staff based on assignment rules. Alerts can be assigned to individual advisors, queues, or Success Team members.",
      tags: ["Alert__c"],
      connections: [{ planet: "student_cases", desc: "Assigned alerts appear on Student Record Cases" }]
    },
    {
      id: "alert-actions",
      name: "Alert Mass Actions",
      icon: "\u{1F3AF}",
      desc: "Bulk operations on multiple Alerts: create Cases, apply Success Plan templates, reassign, or close. Enables efficient response to patterns across student populations.",
      tags: ["Alert__c"],
      connections: [{ planet: "success_plans", desc: "Success Plans can be applied as Alert responses" }]
    },
    {
      id: "slack-integration",
      name: "Slack Integration",
      icon: "\u{1F4AC}",
      desc: "Student Success Alerts (SSA) Slack app enables faculty to raise concerns directly in Slack. Alerts flow from Slack into SSH for support staff to act on quickly.",
      tags: ["Alert__c"],
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
      desc: "Core scheduling engine supporting Scheduled, Walk-In, and Group appointment types. Students book through the portal or staff schedule on behalf of students.",
      tags: ["Event"],
      connections: [{ planet: "student_cases", desc: "Appointments reference Student Record Cases" }]
    },
    {
      id: "topic-management",
      name: "Topic Management",
      icon: "\u{1F3F7}",
      desc: "Hierarchical topic structure with parent topics (Academic, Career, Financial Aid) and subtopics (Degree Planning, Grade Concerns). Controls which services appear in scheduling interfaces.",
      tags: ["Topic__c", "Role_Topic_Setting__c", "User_Topic_Setting__c", "Queue_Topic_Setting__c"],
      connections: [{ planet: "student_cases", desc: "Topics align with support team specializations" }]
    },
    {
      id: "availability-management",
      name: "Availability Management",
      icon: "\u{23F0}",
      desc: "Staff set recurring or one-time availability blocks by location and topic. Supports Scheduled Availability, Walk-In Availability, and Group Availability event types.",
      tags: ["Event", "Location__c"],
      connections: [{ planet: "student_portal", desc: "Available slots shown in student portal scheduler" }]
    },
    {
      id: "queue-management",
      name: "Queue Management",
      icon: "\u{1F465}",
      desc: "Walk-in queue system for front-desk operations and one-stop centers. Staff check in students, track wait times, and manage the flow of appointments.",
      tags: ["Event"],
      connections: [{ planet: "student_cases", desc: "Queue appointments link to Student Record Cases" }]
    },
    {
      id: "appointment-notifications",
      name: "Appointment Notifications",
      icon: "\u{1F4E7}",
      desc: "Automated email notifications for scheduling, rescheduling, and cancellation with configurable .ics calendar attachment support for both staff and students.",
      tags: ["Event"],
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
      desc: "Visual representation of Program Plans showing hierarchical requirements, completion status, and remaining coursework. Rendered through dedicated Lightning components.",
      tags: ["Program_Plan__c", "Plan_Requirement__c"],
      connections: [{ planet: "academic_programs", desc: "Displays EDA Program Plan data" }]
    },
    {
      id: "personal-program-plans",
      name: "Personal Program Plans",
      icon: "\u{1F4DD}",
      desc: "Student-created graduation roadmaps. Students chart their own path by selecting courses and arranging them into future terms, creating a personalized degree timeline.",
      tags: ["Personal_Program_Plan__c", "Personal_Program_Plan_Course__c", "Personal_Program_Plan_Term__c"],
      connections: [{ planet: "courses", desc: "Personal plans reference Course records" }]
    },
    {
      id: "course-bookmarks",
      name: "Course Bookmarks",
      icon: "\u{1F516}",
      desc: "Saved course selections for future reference. Students bookmark courses of interest while exploring requirements, building a shortlist for registration planning.",
      tags: ["Course_Bookmark__c"],
      connections: [{ planet: "courses", desc: "Bookmarks reference Course catalog entries" }]
    },
    {
      id: "requirement-tracking",
      name: "Requirement Tracking",
      icon: "\u{2705}",
      desc: "Progress tracking against Plan Requirements. Maps completed courses to requirements, showing fulfilled vs. remaining items for each requirement group.",
      tags: ["Plan_Requirement__c", "Course_Connection__c"],
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
      desc: "Experience Cloud site setup including access control, membership, branding, and component placement. Configured through Experience Builder with custom SSH Lightning components.",
      tags: ["Event"],
      connections: [{ planet: "student_cases", desc: "Portal displays Student Record Case data" }]
    },
    {
      id: "scheduling-components",
      name: "Scheduling Components",
      icon: "\u{1F4C5}",
      desc: "SSH Appointment Scheduler and Scheduling Wizard components. Students browse advisor availability, select topics, and book appointments directly from the portal.",
      tags: ["Event", "Topic__c"],
      connections: [{ planet: "appointments", desc: "Portal components create appointment Events" }]
    },
    {
      id: "student-dashboard",
      name: "Student Dashboard",
      icon: "\u{1F4CA}",
      desc: "Consolidated view of Success Plans with progress bars, assigned Tasks by priority and due date, Success Team member cards, and the Launchpad Agenda showing upcoming events.",
      tags: ["Success_Plan__c", "Task"],
      connections: [{ planet: "success_plans", desc: "Dashboard displays Success Plan progress" }]
    },
    {
      id: "chatbot",
      name: "Student Chatbot",
      icon: "\u{1F916}",
      desc: "Einstein Bot integration for proactive student engagement. Sends task reminders, answers common questions, and nudges students toward their goals through SMS or web chat.",
      tags: ["Contact"],
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
