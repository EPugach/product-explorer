// ══════════════════════════════════════════════════════════════
//  TOUR DATA — Constellation Stories tour definitions
//  Each tour is a sequence of stops with admin & dev narration
// ══════════════════════════════════════════════════════════════

export const TOURS = [
  {
    id: 'student-data-foundation',
    title: 'Student Data Foundation',
    icon: '\u{1F464}',
    desc: 'How EDA builds a 360-degree student identity from person accounts, relationships, affiliations, and education history',
    stops: [
      {
        planet: 'accounts_contacts',
        highlightEdges: ['relationships', 'affiliations'],
        admin: {
          title: 'Every Student Starts Here',
          body: 'When a new student arrives, EDA creates a Contact record paired with a dedicated Administrative Account in a 1:1 model. This is fundamentally different from standard Salesforce where multiple contacts share one account. Each person gets their own account, storing biographical data, communication preferences, and demographic information. Address records support multiple types (Home, Mailing, Seasonal) with automatic synchronization to Contact mailing fields.'
        },
        dev: {
          title: 'The 1:1 Account-Contact Model',
          body: 'On Contact insert, TDTM dispatches to handlers that auto-create an Administrative Account with a 1:1 lookup. The Account record type system (Educational Institution, University Department, Academic Program, Sports Organization, Business Organization) provides organizational taxonomy. Address__c records support seasonal date ranges, and TDTM trigger handlers synchronize the default address to Contact standard mailing fields automatically. The Household Account model groups family members under a shared Account with auto-naming conventions.'
        }
      },
      {
        planet: 'relationships',
        highlightEdges: ['accounts_contacts', 'tdtm_settings'],
        admin: {
          title: 'Mapping Personal Connections',
          body: 'Relationships track person-to-person connections: parent, sibling, spouse, advisor, tutor, coach. When staff create a relationship, EDA automatically generates the reciprocal record. Mark a Contact as a student\'s parent, and the student automatically appears as the parent\'s child. This bidirectional management eliminates duplicate data entry and keeps family networks accurate. Language proficiency tracking supports multilingual campus communities.'
        },
        dev: {
          title: 'Reciprocal Relationship Engine',
          body: 'Relationship__c records connect two Contact lookups with a Type picklist. On insert, TDTM looks up the reciprocal type in Relationship_Lookup__c custom metadata (e.g., Parent maps to Child, Employer maps to Employee) with gender-specific variants. The handler creates the inverse Relationship__c record automatically. A static recursion guard prevents infinite loops when the reciprocal fires its own trigger. Contact_Language__c tracks fluency level and primary language designation per Contact.'
        }
      },
      {
        planet: 'affiliations',
        highlightEdges: ['accounts_contacts', 'academic_programs'],
        admin: {
          title: 'Connecting People to Organizations',
          body: 'Affiliations map students and staff to departments, programs, and organizations through Contact-to-Account relationships. Each affiliation tracks a role, status (Current or Former), and date range. A student can have affiliations with the Computer Science department, the Chess Club, and a work-study program simultaneously. Primary affiliation designation ensures the most relevant organizational tie appears on the Contact record. When a Program Enrollment is created, a corresponding Affiliation appears automatically.'
        },
        dev: {
          title: 'Affiliation Auto-Creation and Sync',
          body: 'Affiliation__c records link Contact to Account with Role__c, Status__c, and Start/End Date fields. Affiliation Mappings in EDA Settings define auto-creation rules by Account record type. When a Contact is associated with an Academic Program Account, the mapping creates the Affiliation automatically. Bidirectional sync between Program_Enrollment__c and Affiliation__c ensures both records stay aligned. The primary affiliation lookup on Contact is maintained through TDTM handlers that evaluate the Primary__c flag per Account record type.'
        }
      },
      {
        planet: 'education_history',
        highlightEdges: ['accounts_contacts', 'academic_programs'],
        admin: {
          title: 'Prior Education and Credentials',
          body: 'Education History captures prior institutions attended, degrees earned, and transfer credits for incoming students. Credential records track professional licenses, certifications, and endorsements with issuing authority and expiration dates. The Attributes system provides flexible tagging for accommodations, disability services, financial aid eligibility, and achievement markers. Together, these records paint a complete picture of who the student is before they even enroll.'
        },
        dev: {
          title: 'The Student Background Model',
          body: 'Education_History__c records document prior institutions (linked to Account records of type Educational Institution), degrees, dates attended, and fields of study. Credential__c tracks professional certifications with verification status and expiration logic. Attribute__c is a flexible tagging object for student characteristics that informs Case-based support planning. Facility__c models the campus hierarchy (building, floor, room) with capacity tracking used by Course Offering scheduling. All records roll up to the Contact for a 360-degree view.'
        }
      },
      {
        planet: 'tdtm_settings',
        highlightEdges: ['accounts_contacts', 'affiliations'],
        admin: {
          title: 'The Automation Engine',
          body: 'Table-Driven Trigger Management is the backbone that makes all of this work automatically. Over 50 configurable trigger handlers manage data consistency across every EDA object: account-contact synchronization, address propagation, affiliation auto-creation, relationship reciprocals, and more. Administrators can enable, disable, or reorder any handler from the EDA Settings page without touching a line of code. This is what transforms a collection of objects into a living, self-maintaining data model.'
        },
        dev: {
          title: 'TDTM Dispatch Architecture',
          body: 'Trigger_Handler__c records define the handler class, target object, event (BeforeInsert, AfterUpdate, etc.), load order, and active flag. When a DML operation fires, the TDTM dispatcher queries active handlers ordered by Load_Order__c, instantiates each class, and executes in sequence. Handlers perform validation, cross-object sync, and cascade operations. Custom handlers can be added alongside EDA defaults. EDA Settings exposes a centralized configuration panel for Account model preferences, Affiliation mappings, relationship auto-creation rules, and address defaults.'
        }
      }
    ]
  },
  {
    id: 'course-enrollment-journey',
    title: 'Course Enrollment Journey',
    icon: '\u{1F4DA}',
    desc: 'Trace a student from program enrollment through course registration, grading, and degree planning',
    stops: [
      {
        planet: 'academic_programs',
        highlightEdges: ['affiliations', 'courses'],
        admin: {
          title: 'Defining the Degree Path',
          body: 'Academic Programs define what a student is working toward. Program Plans lay out hierarchical requirements: core courses, electives, concentrations, and prerequisites all nested into a structured graduation pathway. When a student enrolls in a program, a Program Enrollment record tracks their admission date, status, GPA, and expected graduation. EDA automatically creates a corresponding Affiliation record linking the student to their department.'
        },
        dev: {
          title: 'Program Plan Hierarchy',
          body: 'Program_Plan__c records define degree programs (majors, minors, certificates). Plan_Requirement__c supports parent-child self-referencing for nested requirement groups (e.g., "Complete 3 of the following 5 courses"). Each requirement can link to a specific Course__c record. Program_Enrollment__c tracks a student\'s participation with lookups to both the Program_Plan__c and Contact. On enrollment insert, TDTM fires the Affiliation sync handler, creating an Affiliation__c record for the student\'s department Account.'
        }
      },
      {
        planet: 'courses',
        highlightEdges: ['academic_programs', 'academic_performance'],
        admin: {
          title: 'From Catalog to Classroom',
          body: 'Courses exist as catalog definitions with credit hours, department, and descriptions. Each term, Course Offerings are created linking a Course to a specific Term with capacity, location, and section number. Students enroll through Course Connections, which track enrollment status and role. Faculty are also linked via Course Connections with a Faculty role. Class scheduling uses Time Blocks and Offering Schedules to define meeting patterns across campus facilities.'
        },
        dev: {
          title: 'The Course Connection Model',
          body: 'Course__c is the reusable catalog entry. Course_Offering__c is the term-specific instance, linked to a Term__c and optionally to a Facility__c for location. Course_Connection__c is the junction object linking a Contact to a Course_Offering__c with Record_Type (Student or Faculty), Status__c (Current, Former), and a lookup to Program_Enrollment__c. Course_Offering_Schedule__c defines meeting patterns using Time_Block__c templates. TDTM handles Term date cascading to child Course Offerings when Term dates change.'
        }
      },
      {
        planet: 'academic_performance',
        highlightEdges: ['courses', 'alerts'],
        admin: {
          title: 'Tracking Academic Outcomes',
          body: 'Term Grades capture letter grades, GPA, and credit hours per student per grading period. Attendance Events track presence, absence, tardiness, and excused status for each class session. Standardized test scores (SAT, ACT, GRE) are recorded with percentile breakdowns. All of this performance data feeds into the Student Success Hub, surfacing students who need intervention before they fall too far behind.'
        },
        dev: {
          title: 'Grade and Attendance Objects',
          body: 'Term_Grade__c records link to Contact and Term__c, storing letter grade, GPA value, credit hours attempted and earned, and class rank. Attendance_Event__c records track per-session participation with Contact and Course_Offering__c lookups. Test__c defines assessment templates (score ranges, sections), while Test_Score__c records individual results per Contact. Performance data aggregation drives Alert creation through SSH automation rules, connecting academic tracking to the intervention pipeline.'
        }
      },
      {
        planet: 'pathways',
        highlightEdges: ['academic_programs', 'courses'],
        admin: {
          title: 'Visualizing the Path to Graduation',
          body: 'Pathways is the student-facing degree audit and planning tool. Students explore their program requirements, see which courses they have completed and which remain, and create Personal Program Plans mapping their path to graduation term by term. Course Bookmarks let students save courses of interest while exploring options. Advisors review these plans during appointments to guide course selection and ensure students stay on track.'
        },
        dev: {
          title: 'Pathways Lightning Components',
          body: 'Pathways renders Program_Plan__c and Plan_Requirement__c data through dedicated Lightning components in the Experience Cloud portal. Requirement fulfillment is calculated by matching completed Course_Connection__c records (with passing Term_Grade__c) against Plan_Requirement__c entries. Personal_Program_Plan__c lets students arrange future Course__c selections into Personal_Program_Plan_Term__c slots. Course_Bookmark__c provides a lightweight save-for-later mechanism. All components are mobile-optimized for the student portal experience.'
        }
      }
    ]
  },
  {
    id: 'advising-workflow',
    title: 'Advising Workflow',
    icon: '\u{1F4C2}',
    desc: 'Follow a student through case creation, success planning, appointment scheduling, and portal self-service',
    stops: [
      {
        planet: 'student_cases',
        highlightEdges: ['accounts_contacts', 'success_plans'],
        admin: {
          title: 'The Student Support Hub',
          body: 'Every student gets a Student Record Case that serves as the unified hub for all support interactions. Success Teams assign advisors, counselors, and coaches through Case Team Members with configurable access levels. Support Pools represent departmental services like Career Services or Financial Aid where any available staff member can respond. The Case aggregates everything: success plans, alerts, tasks, appointments, and notes into a single 360-degree support view.'
        },
        dev: {
          title: 'Case Team Architecture',
          body: 'The Student Record Case is a standard Case record with a specific record type. Case Team Members link User records to the Case with CaseTeamRole assignments controlling read/write access granularity. Support_Pool__c records represent unassigned departmental groups. Predefined Case Teams provide reusable team templates with preconfigured member-role combinations for rapid onboarding. The Case serves as the parent record for Success_Plan__c, Alert__c, Task, and Event records through standard and custom lookups.'
        }
      },
      {
        planet: 'success_plans',
        highlightEdges: ['student_cases', 'student_portal'],
        admin: {
          title: 'Goal-Setting and Task Management',
          body: 'An advisor selects a Success Plan Template matching the student\'s situation: Academic Improvement, Career Exploration, Financial Aid Planning, or any custom type. The template generates a plan with predefined tasks, descriptions, and default due dates. The advisor customizes assignments, sets priority levels, and kicks off the plan. Students see their tasks in the portal with progress bars showing how far along they are. Overdue items are flagged automatically.'
        },
        dev: {
          title: 'Template-Driven Plan Generation',
          body: 'Success_Plan_Template__c records define reusable plan structures. Success_Plan_Template_Task__c child records specify default tasks with descriptions, assignee types, and relative due date offsets. On template application, the system creates a Success_Plan__c record under the Student Record Case and generates Task records from the template tasks. Success_Plan__c tracks aggregate metrics: open task count, overdue task count, and overall status. Plan types include Academic, Career, Financial Aid, Health, Housing, Attendance, and Behavior.'
        }
      },
      {
        planet: 'appointments',
        highlightEdges: ['student_cases', 'student_portal'],
        admin: {
          title: 'Scheduling the Meeting',
          body: 'Advisors set availability blocks by location, topic, and appointment type: scheduled, walk-in, or group sessions. Topics organize services hierarchically: Academic advising has subtopics like Degree Planning and Grade Concerns. Students browse available slots in the portal, filtered by topic and advisor. Walk-in queues manage front-desk flow at one-stop centers. Email confirmations with calendar attachments keep everyone on the same page.'
        },
        dev: {
          title: 'Availability and Event Model',
          body: 'Staff availability is stored as Event records with specific record types (Scheduled Availability, Walk-In Availability, Group Availability). Topic__c records form a parent-child hierarchy. Role_Topic_Setting__c, User_Topic_Setting__c, and Queue_Topic_Setting__c control which topics appear for which staff and locations. When a student books, the availability Event is converted to a Support Event with Contact and Case lookups. Location__c records define physical or virtual meeting spaces. Automated email notifications use configurable templates with .ics attachment generation.'
        }
      },
      {
        planet: 'student_portal',
        highlightEdges: ['appointments', 'success_plans'],
        admin: {
          title: 'The Student Experience',
          body: 'The Student Portal is a mobile-optimized Experience Cloud site where students manage their own support journey. The dashboard shows assigned Success Plans with progress bars, pending tasks by priority, upcoming appointments, and Success Team contact cards. The Scheduling Wizard walks students through booking an appointment by topic. An optional Einstein Bot chatbot sends proactive reminders about overdue tasks and upcoming deadlines via SMS or web chat.'
        },
        dev: {
          title: 'Experience Cloud Components',
          body: 'Over 12 custom Lightning Web Components power the portal: SSH Appointment Scheduler, Scheduling Wizard, Success Plan tracker, Task list, Success Team directory, and Launchpad Agenda. Components query data through the Student Record Case context, using the logged-in user\'s Contact to resolve the Case lookup. Portal configuration happens in Experience Builder with custom SSH components placed on pages. Einstein Bot integration uses the standard Bot Builder framework with custom dialog flows for task reminders and FAQ responses.'
        }
      }
    ]
  },
  {
    id: 'early-alert-response',
    title: 'Early Alert Response',
    icon: '\u{1F514}',
    desc: 'How declining academic performance triggers alerts and drives intervention through success plans and advising',
    stops: [
      {
        planet: 'academic_performance',
        highlightEdges: ['courses', 'alerts'],
        admin: {
          title: 'Warning Signs Emerge',
          body: 'The early alert process begins when academic performance data reveals a student in trouble. Declining grades, missed classes, and poor test scores all paint a picture. Attendance Events track absences and tardiness per class session. Term Grades show a downward GPA trend. The data is there, but without a system to surface it, at-risk students slip through the cracks. This is where Student Success Hub automation changes the game.'
        },
        dev: {
          title: 'Performance Data Aggregation',
          body: 'Attendance_Event__c records accumulate per Course_Offering__c, providing absence counts that can trigger Flow-based or Process Builder automation. Term_Grade__c records capture per-term GPA on the Contact, enabling trend analysis across grading periods. Test_Score__c results feed into admissions and placement decisions. The critical integration point is the connection to Alert__c: automated rules can evaluate attendance thresholds, GPA drops, or grade flags and fire Alert creation without manual faculty intervention.'
        }
      },
      {
        planet: 'alerts',
        highlightEdges: ['student_cases', 'success_plans'],
        admin: {
          title: 'Raising the Alarm',
          body: 'Faculty can raise Alert records manually through the SSH app or directly in Slack using the Student Success Alerts integration. Each Alert is categorized by type (Academic, Attendance, Behavior, Financial Aid) with a specific reason selected from customizable picklists. Assignment rules automatically route the Alert to the right advisor or support team queue. Mass actions let staff respond to patterns across an entire student population: apply Success Plan templates, create Cases, or reassign in bulk.'
        },
        dev: {
          title: 'Alert Routing and Assignment',
          body: 'Alert__c records carry Type__c, Reason__c (customizable picklist), and lookups to Contact and Case. Assignment rules (configured through standard Salesforce or custom logic) evaluate Alert attributes and route to User or Queue. The Student Success Alerts Slack app uses the Slack API to create Alert__c records from Slack message actions, mapping channel context to the student Contact. Mass action processing uses batch Apex to apply Success_Plan_Template__c across multiple Alert__c records in a single operation.'
        }
      },
      {
        planet: 'success_plans',
        highlightEdges: ['student_cases', 'alerts'],
        admin: {
          title: 'Building the Intervention Plan',
          body: 'The advisor responds to the Alert by applying a Success Plan Template. An Academic Improvement plan might include tasks like "Meet with professor during office hours," "Attend tutoring sessions twice weekly," and "Complete missed assignments by Friday." Each task gets an assignee, priority, and due date. The plan creates structure and accountability around the intervention. Progress is tracked through task completion, giving both the student and advisor visibility into whether things are improving.'
        },
        dev: {
          title: 'Alert-to-Plan Pipeline',
          body: 'From the Alert__c detail page, advisors can apply a Success_Plan_Template__c directly. The system creates a Success_Plan__c record under the student\'s Case, generates Task records from Success_Plan_Template_Task__c definitions, and calculates due dates from the template\'s relative offset values. The Alert__c status is updated to reflect the response. Success_Plan__c.Status__c transitions through Open, In Progress, and Completed as tasks are resolved. Overdue task counts on the plan record enable dashboard reporting on intervention effectiveness.'
        }
      },
      {
        planet: 'student_cases',
        highlightEdges: ['success_plans', 'appointments'],
        admin: {
          title: 'The Unified Support View',
          body: 'The Student Record Case now shows the full intervention story: the original Alert that flagged the concern, the Success Plan created in response, and all associated tasks. The advisor can see whether the student is completing assigned tasks or falling further behind. Notes, prior alerts, and previous plans provide historical context. If the student has multiple alerts from different sources, they all aggregate here, preventing fragmented support where the left hand does not know what the right hand is doing.'
        },
        dev: {
          title: 'Case as Aggregation Point',
          body: 'The Student Record Case aggregates related records through multiple lookups: Alert__c.Case__c, Success_Plan__c.Case__c, Task.WhatId, and Event.WhatId. Related lists on the Case layout surface all support activity. Case Team Members provide role-based access so the advisor sees planning tools while the financial aid counselor sees aid-specific data. The Case\'s unified view is the key architectural decision: rather than scattering support data across disconnected objects, everything converges on a single parent record per student.'
        }
      },
      {
        planet: 'appointments',
        highlightEdges: ['student_cases', 'alerts'],
        admin: {
          title: 'Following Up in Person',
          body: 'The intervention often includes a follow-up appointment. The advisor checks their availability and schedules a meeting with the student, or the student books through the portal. The appointment is linked to the Student Record Case, so when the advisor opens the meeting, they have the full context: the alert, the success plan, and the task progress. Walk-in queues at advising centers handle students who need immediate help. After the meeting, the advisor updates the plan and notes next steps.'
        },
        dev: {
          title: 'Appointment-Case Integration',
          body: 'Appointments are Event records with a WhatId pointing to the Student Record Case. Topic__c on the Event links to the service category (Academic Advising, Tutoring, Financial Aid). Availability management ensures the advisor has open slots matching the needed topic. The appointment creation flow can be triggered from the Alert response, pre-populating the student Contact and Case lookups. Queue management for walk-ins uses a custom Event status field to track check-in, waiting, in-progress, and completed states. Post-appointment, advisors update Task records and Success_Plan__c status directly from the Case.'
        }
      }
    ]
  },
  {
    id: 'student-self-service',
    title: 'Student Self-Service',
    icon: '\u{1F310}',
    desc: 'How students use the portal to schedule appointments, plan their degree, and track their own success',
    stops: [
      {
        planet: 'student_portal',
        highlightEdges: ['appointments', 'success_plans'],
        admin: {
          title: 'The Student Dashboard',
          body: 'Students log into the Experience Cloud portal and land on a personalized dashboard. They see their assigned Success Plans with visual progress bars, pending tasks sorted by priority and due date, upcoming appointments, and contact cards for their Success Team members. The Launchpad Agenda shows what is coming up this week. The optional chatbot greets returning students and nudges them about overdue tasks. This is not a passive information display; it is an action-oriented hub where students manage their own success.'
        },
        dev: {
          title: 'Portal Component Architecture',
          body: 'The Experience Cloud site uses a custom theme with over 12 SSH Lightning Web Components. The Student Dashboard component queries Success_Plan__c and Task records through the logged-in user\'s Contact-to-Case relationship. Success Team cards resolve from CaseTeamMember records. The Launchpad Agenda queries upcoming Events where WhoId matches the student Contact. Einstein Bot integration uses the Bot Builder framework with custom Apex actions that query Task and Event records for proactive outreach via SMS or web chat channels.'
        }
      },
      {
        planet: 'appointments',
        highlightEdges: ['student_portal', 'student_cases'],
        admin: {
          title: 'Booking an Appointment',
          body: 'The Scheduling Wizard guides students through booking step by step. First, they select a topic (Academic Advising, Career Planning, Financial Aid). Then they see available advisors and time slots filtered by their selection. They pick a slot, add a note about what they need help with, and confirm. An email with a calendar attachment goes to both the student and advisor. For urgent needs, students can check in to a walk-in queue at the advising center and wait for the next available staff member.'
        },
        dev: {
          title: 'Scheduling Wizard Flow',
          body: 'The SSH Scheduling Wizard LWC renders Topic__c records in a hierarchical picker. Selected topics filter available Event records by matching User_Topic_Setting__c and Role_Topic_Setting__c against staff availability Events. Time slot display respects Location__c capacity and existing bookings. On confirmation, the Scheduling Wizard converts a Scheduled Availability Event into a Support Event with the student Contact as WhoId and the Student Record Case as WhatId. Automated email notifications fire through a configurable template with .ics attachment generation for calendar integration.'
        }
      },
      {
        planet: 'pathways',
        highlightEdges: ['academic_programs', 'student_portal'],
        admin: {
          title: 'Planning the Degree',
          body: 'Through the Pathways section of the portal, students explore their program requirements in a visual layout. They see which requirements are fulfilled by completed courses and which remain. Students create Personal Program Plans, arranging future courses into upcoming terms to map their path to graduation. Course Bookmarks let them save interesting electives while exploring. Advisors review these plans during appointments, offering guidance on course sequencing, prerequisite chains, and workload balance.'
        },
        dev: {
          title: 'Pathways Data Resolution',
          body: 'Pathways LWC components resolve the student\'s Program_Enrollment__c to load the associated Program_Plan__c and its Plan_Requirement__c tree. Requirement fulfillment is calculated by joining Course_Connection__c records (where Status equals Former and the associated Term_Grade__c indicates a passing grade) against Plan_Requirement__c Course lookups. Personal_Program_Plan__c records let students create custom plans with Personal_Program_Plan_Term__c and Personal_Program_Plan_Course__c junction records. Course_Bookmark__c provides lightweight save operations without enrollment commitment.'
        }
      },
      {
        planet: 'success_plans',
        highlightEdges: ['student_portal', 'student_cases'],
        admin: {
          title: 'Tracking Progress and Completing Tasks',
          body: 'The portal displays each assigned Success Plan with a progress bar showing completed versus total tasks. Students view task details including description, priority, and due date. They mark tasks as complete directly in the portal as they accomplish each goal. Overdue tasks are highlighted so nothing slips through. The advisor sees the same progress in real-time on their side, creating shared accountability. When all tasks in a plan are complete, the plan status updates automatically, and the student can see their achievement.'
        },
        dev: {
          title: 'Task Completion Flow',
          body: 'The Success Plan tracker LWC queries Success_Plan__c records where Case__c matches the student\'s Student Record Case. Child Task records are displayed with Status, Priority, and ActivityDate fields. When a student marks a Task complete through the portal, a Lightning Data Service update sets Status to Completed and CompletedDateTime. The Success_Plan__c record\'s rollup fields (open task count, overdue count) recalculate. Plan status transitions are managed by automation: when all child Tasks reach Completed status, the plan Status__c updates to Completed. Real-time refresh uses Lightning Message Service for cross-component communication.'
        }
      }
    ]
  }
];
