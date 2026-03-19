// ══════════════════════════════════════════════════════════════
//  TOUR DATA — Constellation Stories tour definitions
//  Each tour is a sequence of stops with admin & dev narration
// ══════════════════════════════════════════════════════════════

export const TOURS = [
  {
    id: 'prospect-to-graduate',
    title: 'Prospect to Graduate',
    icon: '\u{1F393}',
    desc: 'Follow a prospective student from first inquiry through graduation',
    stops: [
      {
        planet: 'recruitment',
        highlightEdges: ['admissions', 'experience', 'agentforce'],
        admin: {
          title: 'The First Spark of Interest',
          body: 'Every student journey begins with a moment of curiosity. Recruitment captures inquiries from campus tours, website visits, college fairs, and partner referrals. Counselors are assigned by territory to nurture each prospect through targeted campaigns and personalized outreach. Lead scoring models identify the prospects most likely to apply, so the admissions team can focus energy where it matters most.'
        },
        dev: {
          title: 'Lead Capture and Scoring Pipeline',
          body: 'Prospect inquiries create Lead records with source attribution from Campaign Members. Territory assignment rules route leads to counselors based on geographic and demographic criteria. The AI recruitment agent (Agentforce) automates multi-channel outreach sequences using ContactPointEmail and ContactPointPhone records. Lead scoring evaluates engagement signals like event attendance and email click-through to surface high-intent prospects.'
        }
      },
      {
        planet: 'admissions',
        highlightEdges: ['recruitment', 'enrollment', 'financials', 'experience'],
        admin: {
          title: 'Applying for Admission',
          body: 'When a prospect is ready, they submit a formal application. Admissions manages the full application lifecycle: document collection, transcript verification, reviewer assignments, and committee decisions. Applicants track their status through the portal while admissions officers work through review queues in the Admissions Console. Once a decision is rendered, acceptance letters and financial aid packages go out together.'
        },
        dev: {
          title: 'Application Lifecycle Engine',
          body: 'IndividualApplication records progress through configurable status stages. DocumentChecklistItem tracks receipt and verification of transcripts, test scores, and supplemental materials. Review workflows assign applications to committee members with scoring rubrics stored on the application record. The Admissions Agent handles real-time status inquiries through Experience Cloud, reducing staff workload during peak cycles.'
        }
      },
      {
        planet: 'enrollment',
        highlightEdges: ['admissions', 'academics', 'financials', 'appointments'],
        admin: {
          title: 'Enrolling in a Program',
          body: 'Admitted students transition to active enrollment. They are enrolled in their degree program, meet with an advisor to build a learning plan, and register for their first term of courses. The system enforces prerequisites, checks for time conflicts, and manages waitlists when sections fill. Financial holds are checked before registration is confirmed, ensuring account balances are resolved.'
        },
        dev: {
          title: 'Registration and Enrollment Processing',
          body: 'ProgramEnrollment records are created linking the student Person Account to a Program. CourseOfferingParticipant records handle per-term registration against CourseOffering sections. Prerequisite validation queries prior LearningAchievement records. Academic Orders are generated via invocable actions that evaluate enrollment attributes against Product-based fee rules in the term Price Book. Financial hold logic checks outstanding AcademicOrder balances before allowing registration.'
        }
      },
      {
        planet: 'academics',
        highlightEdges: ['enrollment', 'records', 'success'],
        admin: {
          title: 'The Academic Experience',
          body: 'Students progress through courses each term, earning credits and building competencies. Academic Operations maintains the course catalog, schedules offerings with instructors and meeting times, and tracks learning objectives aligned to accreditation standards. Transfer credits from other institutions are evaluated against equivalency rules. Each completed course moves the student closer to meeting their degree requirements.'
        },
        dev: {
          title: 'Course Catalog and Achievement Model',
          body: 'The Course object defines the catalog; CourseOffering instances schedule them per AcademicTerm with instructor assignments and capacity limits. LearningObjective records link to courses for outcome-based assessment. TransferCredit and LearningEquivalency records map external coursework to internal catalog entries. LearningAchievement records capture grades and earned credits that accumulate toward ProgramEnrollment completion thresholds.'
        }
      },
      {
        planet: 'success',
        highlightEdges: ['academics', 'enrollment', 'mentoring', 'appointments'],
        admin: {
          title: 'Crossing the Finish Line',
          body: 'Student Success brings together competency tracking, early alerts, advising, and career development to ensure every student reaches graduation. Advisors monitor academic progress and intervene when students show signs of difficulty. Mentoring relationships provide additional support. Career development planning connects academic achievement to post-graduation goals, so students leave not just with a degree but with a clear professional direction.'
        },
        dev: {
          title: 'Success Tracking and Intervention Framework',
          body: 'PersonCompetency records assess skills against defined frameworks. Academic alert rules evaluate GPA thresholds and engagement signals, generating Case records routed to advisors via CareCoordinator assignments. ServiceAppointment records schedule advising sessions. PersonTrait and PersonAffinity records inform career guidance. The Student Success Agent uses enrollment history and competency data to provide context-aware academic planning recommendations.'
        }
      }
    ]
  },
  {
    id: 'student-financial-journey',
    title: 'Student Financial Journey',
    icon: '\u{1F4B0}',
    desc: 'From application fees through tuition, financial aid, to alumni giving',
    stops: [
      {
        planet: 'admissions',
        highlightEdges: ['financials', 'recruitment', 'experience'],
        admin: {
          title: 'The First Transaction',
          body: 'The financial relationship begins before a student ever enrolls. Application fees are the first charge assessed, and for admitted students, financial aid packaging begins immediately after acceptance. The admissions offer and aid award together determine the net cost that influences a student\'s enrollment decision. Getting this right is critical for yield: the gap between admitted and enrolled students often comes down to affordability.'
        },
        dev: {
          title: 'Application Fee and Aid Origination',
          body: 'Application fee charges are generated as AcademicOrder records linked to IndividualApplication. Upon admission, the financial aid packaging process creates OrderProduct line items representing scholarship and grant awards. Aid awards reference the student\'s Person Account and the specific AcademicTerm. The Applicant Portal in Experience Cloud surfaces net cost calculations so prospective students can make informed enrollment decisions.'
        }
      },
      {
        planet: 'financials',
        highlightEdges: ['enrollment', 'academics', 'admissions', 'experience'],
        admin: {
          title: 'Tuition and Fee Assessment',
          body: 'Once enrolled, tuition and fees are calculated based on the student\'s course load, residency status, program level, and any special fees like lab or technology charges. The institution defines its fee structure using price books tied to academic terms, so rates can be updated annually without disrupting historical records. Payment plans allow students to spread costs across the term, and real-time balance visibility keeps students informed.'
        },
        dev: {
          title: 'Pricing Engine and Order Generation',
          body: 'Product2 records define fee types (tuition per credit, lab fees, technology fees). PricebookEntry records tie fee amounts to specific AcademicTerms via Pricebook2. When a student registers, invocable actions generate AcademicOrder records with OrderProduct line items for each applicable fee. Pricing rules evaluate student attributes like residency status and enrollment intensity. The Student Financials Agent answers billing inquiries by reading order and payment data.'
        }
      },
      {
        planet: 'enrollment',
        highlightEdges: ['financials', 'academics', 'success', 'appointments'],
        admin: {
          title: 'Financial Holds and Registration',
          body: 'Enrollment and finances are tightly coupled. Outstanding balances can place financial holds that block course registration until resolved. Students on payment plans must stay current to maintain registration eligibility. The enrollment status system tracks holds alongside academic standing, giving registrars a complete picture of whether a student can proceed with their next term of courses.'
        },
        dev: {
          title: 'Hold Enforcement and Status Management',
          body: 'ProgramEnrollment status transitions check for active financial holds by querying outstanding AcademicOrder balances. Hold records block CourseOfferingParticipant creation during registration. Enrollment status rules define valid transitions and required conditions, enforcing business logic at the platform level. Payment confirmation events release holds and trigger status recalculation, allowing registration to proceed.'
        }
      },
      {
        planet: 'experience',
        highlightEdges: ['financials', 'admissions', 'alumni'],
        admin: {
          title: 'Self-Service Financial Management',
          body: 'The Student Portal gives students direct access to their financial account: current balance, charge details, payment history, and upcoming due dates. Students can make payments, enroll in payment plans, and view their financial aid awards without visiting the bursar\'s office. This self-service model reduces administrative workload while giving students 24/7 access to their financial information.'
        },
        dev: {
          title: 'Portal Financial Components',
          body: 'Experience Cloud site pages expose AcademicOrder data through Lightning Web Components with permission-based visibility. Payment processing integrates with external payment gateways via API callouts. Financial aid award letters are rendered from OrderProduct records tagged as aid types. The mobile-responsive design ensures critical financial actions like payment submission work seamlessly on any device.'
        }
      },
      {
        planet: 'alumni',
        highlightEdges: ['financials', 'experience', 'analytics'],
        admin: {
          title: 'From Student Debt to Philanthropy',
          body: 'The financial relationship does not end at graduation. Alumni transition from receiving financial aid to becoming donors who fund scholarships for future students. Gift management tracks donations, pledges, and recurring commitments. Fundraising campaigns target alumni segments based on graduation year, giving history, and engagement level. The cycle completes when today\'s alumni gifts become tomorrow\'s financial aid awards.'
        },
        dev: {
          title: 'Advancement Gift Processing',
          body: 'GiftTransaction records capture individual donations with fund designations and payment methods. GiftCommitment records manage multi-year pledges with scheduled payment reminders. Campaign records link fundraising activities to gift outcomes for ROI measurement. The Alumni Portal in Experience Cloud enables online giving with integrated payment processing. Alumni Agent automates personalized outreach based on engagement scoring and giving patterns.'
        }
      }
    ]
  },
  {
    id: 'mentoring-pipeline',
    title: 'The Mentoring Pipeline',
    icon: '\u{1F91D}',
    desc: 'Building mentoring relationships and measuring their impact on student success',
    stops: [
      {
        planet: 'records',
        highlightEdges: ['mentoring', 'enrollment', 'admissions'],
        admin: {
          title: 'The Student Profile Foundation',
          body: 'Effective mentoring starts with knowing the student. Student Records provides the unified learner profile that captures academic interests, career aspirations, demographic background, and personal strengths. When a mentoring program opens enrollment, this rich profile data is what enables the matching engine to pair students with the right mentors. Without complete person records, matching becomes guesswork.'
        },
        dev: {
          title: 'Person Account as Matching Input',
          body: 'Person Account records store the student identity that anchors MentoringProfile creation. ContactRelationship records capture family and household context. PersonEducation records provide academic background. PersonLanguage and PersonEmployment records add diversity and career context. All of these attributes feed into the profile fields that the AI matching engine evaluates when generating mentor-mentee pair recommendations.'
        }
      },
      {
        planet: 'mentoring',
        highlightEdges: ['records', 'success', 'appointments'],
        admin: {
          title: 'Building the Mentoring Relationship',
          body: 'Program administrators design mentoring programs with specific goals: academic tutoring, career coaching, peer support, or alumni guidance. Mentors and mentees create profiles that capture their skills, experience, and availability. The AI-powered matching engine analyzes profiles and suggests optimal pairings based on weighted criteria. Administrators review matches before finalizing, ensuring every pairing has the ingredients for a productive relationship.'
        },
        dev: {
          title: 'Profile Matching and Benefit Assignment',
          body: 'MentoringProgram records define program structure, eligibility, and matching criteria weights. MentoringProfile records for mentors and mentees capture matching-relevant fields configured per program. Einstein comparison algorithms compute profile similarity scores across weighted dimensions. Once pairings are finalized, MentoringBenefit and MentoringBenefitAssignment records track the specific support delivered: tutoring sessions, career advice meetings, and networking introductions.'
        }
      },
      {
        planet: 'success',
        highlightEdges: ['mentoring', 'enrollment', 'academics', 'appointments'],
        admin: {
          title: 'Mentoring Meets Student Success',
          body: 'Mentoring outcomes feed directly into the student success framework. When a mentee improves their GPA, develops a new competency, or gains clarity on career goals, those outcomes are tracked as success metrics. Advisors can see which students have active mentoring relationships and factor that into their support strategies. Early alert systems account for mentoring engagement when assessing student risk levels.'
        },
        dev: {
          title: 'Success Integration Points',
          body: 'MentoringBenefitAssignment completion events update PersonCompetency records when skill-building benefits are delivered. CareCoordinator assignments for advisors reference active mentoring relationships in their caseload views. Academic alert rules incorporate mentoring engagement as a protective factor in risk calculations. PersonTrait and PersonAffinity records are enriched through mentoring interactions, providing advisors with a more complete picture of student development.'
        }
      },
      {
        planet: 'appointments',
        highlightEdges: ['mentoring', 'records', 'success'],
        admin: {
          title: 'Scheduling Mentoring Sessions',
          body: 'The Appointments system provides the scheduling infrastructure that keeps mentoring relationships active. Mentors set their availability windows, and mentees book sessions through the self-service portal. Virtual appointment support means mentoring can happen across distance, not just on campus. Walk-in hours and waitlist management support drop-in tutoring centers where students can get help without a scheduled appointment.'
        },
        dev: {
          title: 'ServiceAppointment Integration',
          body: 'Mentoring sessions are scheduled as ServiceAppointment records linked to both mentor and mentee Person Accounts. ServiceResource records define mentor availability windows and service territories. Virtual appointments generate video conference links embedded in confirmation notifications. Appointment completion triggers follow-up workflows that update MentoringBenefitAssignment records with session outcomes and schedule the next meeting.'
        }
      },
      {
        planet: 'analytics',
        highlightEdges: ['agentforce', 'recruitment', 'financials'],
        admin: {
          title: 'Measuring Mentoring Impact',
          body: 'Education Analytics brings the mentoring story full circle by measuring program effectiveness. Dashboards compare retention and graduation rates for mentored versus non-mentored student populations. Cohort analysis reveals which mentoring program types produce the strongest outcomes. These insights help institutions justify mentoring investments and refine program design for maximum impact on student success.'
        },
        dev: {
          title: 'Analytics Dashboards for Mentoring',
          body: 'CRM Analytics datasets join MentoringBenefitAssignment records with ProgramEnrollment outcomes to calculate mentoring ROI. Cohort comparison dashboards use LearningAchievement and enrollment status data to isolate mentoring effects on retention and GPA. Director Insights pages surface mentoring program KPIs alongside recruitment and financial metrics. Agent performance dashboards track the Student Success Agent\'s effectiveness at connecting at-risk students to mentoring resources.'
        }
      }
    ]
  },
  {
    id: 'data-driven-institution',
    title: 'Data-Driven Institution',
    icon: '\u{1F4CA}',
    desc: 'From data consolidation through AI agents to institutional insights',
    stops: [
      {
        planet: 'data360',
        highlightEdges: ['records'],
        admin: {
          title: 'Unifying the Data Landscape',
          body: 'Most institutions have student data scattered across legacy systems: a separate SIS for academics, a CRM for admissions, spreadsheets for financial aid. Data 360 ingests records from all these sources, standardizes formats, and detects duplicates. Identity resolution ensures the same student does not appear as three different people just because three systems spelled their name differently. This unified foundation is what makes everything else possible.'
        },
        dev: {
          title: 'Data Ingestion and Identity Resolution',
          body: 'DataStream records define source system connections with extraction schedules and field-level mappings. Data type conversions and value translations transform external schemas into the Education Cloud model. IdentityResolutionRuleset and MatchRule records configure duplicate detection using combinations of name, date of birth, email, and student ID. Confidence scoring ranks match quality, and UnifiedIndividual records merge the best data from each source using survivorship rules.'
        }
      },
      {
        planet: 'records',
        highlightEdges: ['data360', 'enrollment', 'admissions', 'success'],
        admin: {
          title: 'The Unified Student Record',
          body: 'Once Data 360 resolves identities, Student Records becomes the single source of truth. Every department sees the same student: admissions sees their application history, registrar sees their enrollment, advisors see their academic progress, and advancement sees their alumni engagement. This eliminates the "which system do I check?" problem that plagues institutions with fragmented data. One record, one truth, accessible everywhere.'
        },
        dev: {
          title: 'Person Account as Universal Anchor',
          body: 'UnifiedIndividual records from Data 360 feed into Person Account creation or enrichment. The Person Account serves as the foreign key anchor for IndividualApplication, ProgramEnrollment, CourseOfferingParticipant, PersonCompetency, GiftTransaction, and every other domain object. ContactPointAddress, ContactPointPhone, and ContactPointEmail provide multi-channel contact data. ContactRelationship records map family structures. This normalized model eliminates the data silos that legacy systems create.'
        }
      },
      {
        planet: 'agentforce',
        highlightEdges: ['admissions', 'success', 'financials', 'alumni'],
        admin: {
          title: 'AI Agents Powered by Clean Data',
          body: 'Unified data is what makes AI agents effective. The Recruitment Agent can reference a prospect\'s complete interaction history. The Admissions Agent can answer status questions accurately because it reads from a single application record. The Student Success Agent can spot at-risk students because it sees enrollment, grades, and engagement in one place. Without the clean, consolidated data from earlier stops, these agents would be guessing instead of knowing.'
        },
        dev: {
          title: 'Agent Data Access Patterns',
          body: 'Each Agentforce agent is configured with education-specific topics and guardrails that scope its data access. The Recruitment Agent queries Lead and Campaign Member records. The Admissions Agent reads IndividualApplication status and DocumentChecklistItem completion. The Success Agent accesses ProgramEnrollment, LearningAchievement, and PersonCompetency records. The Financials Agent reads AcademicOrder and payment data. All agents operate against the unified Person Account, ensuring consistent, accurate responses.'
        }
      },
      {
        planet: 'analytics',
        highlightEdges: ['recruitment', 'financials', 'alumni', 'agentforce'],
        admin: {
          title: 'Institutional Intelligence',
          body: 'Education Analytics transforms the unified data and agent interactions into actionable institutional insights. Directors see enrollment trends, retention rates, and financial health in a single dashboard. Recruitment teams track funnel conversion rates. Advisors monitor at-risk student populations. Financial officers forecast tuition revenue based on admissions pipeline data. Every dashboard is only as good as the data behind it, and that data quality journey started at Data 360.'
        },
        dev: {
          title: 'CRM Analytics Dataset Architecture',
          body: 'CRM Analytics datasets pull from the unified Education Cloud data model, joining cross-domain records through the Person Account anchor. Pre-built dashboard templates for directors, recruiters, and advisors use dataflows that aggregate recruitment, enrollment, success, and financial data. Agent performance metrics from Agentforce feed into monitoring dashboards. Custom report building enables ad-hoc institutional research queries across the entire consolidated dataset.'
        }
      },
      {
        planet: 'experience',
        highlightEdges: ['admissions', 'financials', 'alumni', 'recruitment'],
        admin: {
          title: 'The Data-Powered Student Experience',
          body: 'The journey ends where the student interacts: the portal. Experience Cloud delivers personalized, data-driven experiences to every user. Prospective students see targeted content based on their interests. Enrolled students see their real-time academic progress and financial account. Alumni see giving impact and community connections. Every personalized element on every portal page is powered by the clean, unified, AI-enhanced data pipeline built across the previous stops.'
        },
        dev: {
          title: 'Personalized Portal Rendering',
          body: 'Experience Cloud site pages use Lightning Web Components that query the unified Person Account and its related domain records. Permission-based visibility rules ensure each audience (prospect, student, alumni) sees only relevant data. Agentforce chat widgets embedded in portal pages provide AI-powered self-service. Analytics-driven recommendations surface relevant content, events, and opportunities based on the student\'s profile, enrollment status, and engagement history.'
        }
      }
    ]
  }
];
