// ══════════════════════════════════════════════════════════════
//  Public Sector Solutions — Constellation Stories (Guided Tours)
//  4 tours tracing key government service workflows
// ══════════════════════════════════════════════════════════════

export const TOURS = [
  {
    id: 'license-application-journey',
    title: 'License Application Journey',
    icon: '\u{1F4DC}',
    desc: 'Follow a business license application from constituent intake through inspections to final issuance.',
    stops: [
      {
        planet: 'experience_cloud',
        highlightEdges: ['licensing_and_permitting', 'common_features'],
        admin: {
          title: 'Constituent Portal Submission',
          body: 'The journey begins when a constituent visits the Licenses and Permits Experience Cloud site. They use the AssessYourLicenseorPermitNeeds Omniscript to understand which authorizations apply to their business type. Once they identify the correct license, they complete the ApplyforBusinessAuthorization guided flow, which walks them through providing business details, uploading supporting documents, and paying application fees. The portal provides a transparent, self-service experience that reduces counter visits and phone calls.'
        },
        dev: {
          title: 'Experience Cloud Site Architecture',
          body: 'The Licenses and Permits site template deploys preconfigured pages with Lightning Web Components for license search, application submission, and inspection history. The ApplyforBusinessAuthorization Omniscript creates a BusinessLicenseApplication record and associates it with RegulatoryAuthority and RegulatoryAuthorizationType objects through the BusRegAuthorizationType junction. Document uploads create DocumentChecklistItem records routed through approval workflows. Integration Procedures map form data to Salesforce objects via OmniStudio Data Mappers.'
        }
      },
      {
        planet: 'licensing_and_permitting',
        highlightEdges: ['common_features', 'setup_and_security', 'inspections'],
        admin: {
          title: 'Application Review and Approval',
          body: 'The submitted application enters the agency review queue, where intake officers and compliance reviewers follow a path-guided workflow showing status progression. Reviewers verify that the applicant meets all regulatory requirements, confirm that supporting documents are complete, and check for any outstanding violations or enforcement actions. The Business Rules Engine automatically calculates application fees based on the authorization type and business details. Applications that meet all criteria advance to the inspection phase.'
        },
        dev: {
          title: 'Approval Process and Fee Calculation',
          body: 'The BusinessLicenseApplication record enters an approval process with entry criteria, approval steps, and final actions for approved or rejected outcomes. Queues distribute applications to reviewers based on RegulatoryAuthority assignment. The Business Rules Engine uses ExpressionSet and DecisionMatrix objects to calculate RegulatoryTrxnFee amounts. BusRegAuthTypeDependency records enforce dependency chains ensuring parent licenses are issued before dependent permits. Action plan templates define checklist tasks for each review stage.'
        }
      },
      {
        planet: 'common_features',
        highlightEdges: ['licensing_and_permitting', 'inspections', 'experience_cloud'],
        admin: {
          title: 'Document Verification and Policy Automation',
          body: 'Common layer tools streamline the review process. Document Checklist Items route uploaded documents like certificates, floor plans, and insurance policies through approval workflows. The Business Rules Engine evaluates regulatory policies to determine whether additional training requirements or inspections are needed. Decision Explainer generates transparency messages showing constituents the reasoning behind fee calculations and regulatory determinations, helping agencies demonstrate equitable and consistent decision-making.'
        },
        dev: {
          title: 'BRE and Document Routing',
          body: 'DocumentChecklistItem records link to the BusinessLicenseApplication with DocumentType classifications for routing. The ExpressionSet evaluates applicant data against DecisionMatrix criteria to determine fee amounts and eligibility. ExplainabilityActionDefinition and ExplainabilityActionVersion objects store templates that format BRE calculation results into human-readable explanations. ActionPlanTemplate records define repeatable task sequences with ActionPlanBaseTemplateAsgn linking template items to specific business process stages.'
        }
      },
      {
        planet: 'inspections',
        highlightEdges: ['licensing_and_permitting', 'common_features', 'experience_cloud'],
        admin: {
          title: 'Compliance Inspection Visit',
          body: 'Once the application passes document review, a compliance officer schedules an onsite inspection visit. Inspectors use the mobile Inspection Management app with calendar integration to conduct assessments at the business location. They evaluate regulatory code compliance using checklists or Dynamic Assessments with conditional logic. If violations are discovered, the inspector records them with severity levels. The constituent can view their inspection history and any violations on the Experience Cloud portal.'
        },
        dev: {
          title: 'Visit and Violation Recording',
          body: 'Visit records are created from the BusinessLicenseApplication record page and linked to InspectionType and RegulatoryCode objects. InspectionAssessmentInd records track individual compliance evaluations against AssessmentIndicatorDefinition criteria. Failed assessments auto-create RegulatoryCodeViolation records linked to ViolationType and the specific regulatory code. ViolationEnforcementAction records trigger ViolationFee Integration Procedures that generate RegulatoryTrxnFee and RegulatoryTrxnFeeItem records for fines.'
        }
      },
      {
        planet: 'licensing_and_permitting',
        highlightEdges: ['experience_cloud', 'setup_and_security', 'crm_analytics'],
        admin: {
          title: 'License Issuance',
          body: 'After all reviews pass and inspections show compliance, the agency issues the license to the constituent. The issued BusinessLicense record can include associated assets and locations through junction objects, verified training requirements, and a QR code email template for verification. The constituent receives notification and can view their active license on the portal. CRM Analytics dashboards track application trends, processing times, and fee revenue to help agency leadership monitor departmental productivity and constituent satisfaction.'
        },
        dev: {
          title: 'Issuance and Analytics Integration',
          body: 'The BusinessLicense record is created with associations to the Person Account via AuthApplicationAsset and AuthApplicationPlace junction objects. Training verification checks PersonExamination records against CourseOffering requirements. The CRM Analytics for Licenses, Permits, and Inspections app provides four dashboards: Compliance Insights, Executive Summary, Department Summary, and Account Insights. These dashboards consume BusinessLicenseApplication, Visit, RegulatoryCodeViolation, and PublicComplaint data to surface trends across the agency.'
        }
      }
    ]
  },

  {
    id: 'benefit-eligibility-disbursement',
    title: 'Benefit Eligibility and Disbursement',
    icon: '\u{1F4B5}',
    desc: 'Follow a constituent applying for monetary benefits through eligibility assessment to receiving assistance.',
    stops: [
      {
        planet: 'experience_cloud',
        highlightEdges: ['benefit_management', 'social_programs'],
        admin: {
          title: 'Benefit Discovery and Application',
          body: 'A constituent visits the Benefit Assistance Experience Cloud site to find programs they may qualify for. The Benefit Finder prescreening tool lets them answer a few questions to see which benefits match their situation before committing to a full application. Once they identify an applicable program like food assistance or housing support, they complete the application guided flow, providing household composition, income details, and supporting documentation. The portal keeps them informed with status updates throughout the process.'
        },
        dev: {
          title: 'Benefit Assistance Site and Prescreening',
          body: 'The Benefit Assistance site template deploys with preconfigured pages for benefit search, application intake, complaint filing, and care plan viewing. The eligibility prescreening uses an OmniScript that evaluates answers against ExpressionSet criteria to show matching BenefitType records. The full application intake uses Discovery Framework AssessmentQuestion objects and OmniStudio Integration Procedures to map form responses to IndividualApplication records. Data Mappers populate effective start and end dates on income and expense data for time-bound eligibility calculations.'
        }
      },
      {
        planet: 'benefit_management',
        highlightEdges: ['common_features', 'experience_cloud', 'social_programs'],
        admin: {
          title: 'Eligibility Determination',
          body: 'The caseworker receives the submitted application and begins the review using a guided flow. The Business Rules Engine automatically evaluates eligibility criteria including household size, income thresholds, citizenship status, and other policy requirements. If the applicant qualifies, the system calculates the benefit amount and frequency. The Decision Explainer feature provides transparent reasoning behind the eligibility decision and amount calculation, which can be shared with the constituent to build trust in government services.'
        },
        dev: {
          title: 'BRE Eligibility and Decision Explainer',
          body: 'The BRE uses a DecisionMatrix that defines income thresholds indexed by household size, and an ExpressionSet that evaluates the matrix results to determine eligibility and calculate benefit amounts. The IndividualApplication record stores assessment responses and effective-dated financial data. ExplainabilityActionDefinition templates format the BRE output into constituent-friendly explanations showing which criteria were met or not met. Caseworkers process applications through an OmniScript guided flow that presents application details, triggers eligibility evaluation, and enables benefit assignment in a single workflow.'
        }
      },
      {
        planet: 'common_features',
        highlightEdges: ['benefit_management', 'social_programs', 'experience_cloud'],
        admin: {
          title: 'Assessment and Documentation',
          body: 'Dynamic Assessments capture detailed applicant information through responsive evaluation forms that adapt based on previous answers. Document Checklist Items ensure all required supporting materials like pay stubs, tax returns, and residency proof are submitted and approved. Interaction Summaries let caseworkers record meeting notes from phone calls or in-person visits, creating a complete audit trail. Action Plans track each step of the benefit determination process with assignable tasks, deadlines, and priorities for the caseworker team.'
        },
        dev: {
          title: 'Discovery Framework and Document Routing',
          body: 'The Discovery Framework deploys Assessment and AssessmentQuestion objects with OmniAssessmentTask records for conditional question flows. Responses are stored via Integration Procedures that map OmniScript data to Salesforce fields. DocumentChecklistItem records with DocumentType classifications route through approval workflows. InteractionSummary records support rich text, attendees, action items, and interest tags with a publish feature that locks summaries as immutable evidence. ActionPlanTemplate and ActionPlanBaseTemplateAsgn define repeatable checklist sequences for each benefit application type.'
        }
      },
      {
        planet: 'provider_management',
        highlightEdges: ['benefit_management', 'experience_cloud', 'social_programs'],
        admin: {
          title: 'Provider Referral for Service Delivery',
          body: 'When the approved benefit involves services like counseling, job training, or healthcare, caseworkers use the provider search tool to find qualified providers near the constituent. The criteria-based search filters providers by specialty, distance, and availability. The caseworker creates a referral through a guided flow that shares relevant constituent information with the selected provider. Providers accept referrals on their own portal, create service schedules, and enroll constituents in benefit sessions for hands-on service delivery.'
        },
        dev: {
          title: 'Provider Search and Referral Architecture',
          body: 'The Data Processing Engine compiles HealthcareProvider and HealthcareFacility data into BenefitPrvdSearchableFld objects for criteria-based search. BenefitSpecialty records map agency BenefitType objects to CareSpecialty and CareProviderFacilitySpecialty records. The referral OmniScript creates Referral records with PDF templates containing client data via Integration Procedures. The Service Provider Portal Experience Cloud template enables providers to process referrals, create BenefitSchedule and BenefitSession records, and record attendance for BenefitDisbursement generation.'
        }
      },
      {
        planet: 'benefit_management',
        highlightEdges: ['social_insurance', 'crm_analytics', 'experience_cloud'],
        admin: {
          title: 'Disbursement and Recertification',
          body: 'Once benefits are assigned, the system manages payment distribution on the configured schedule. Constituents can track their disbursement history and upcoming payments on the portal. Periodically, a batch process identifies benefits due for recertification and notifies constituents through the portal. Constituents complete a recertification guided flow to confirm or update their household and income details. If circumstances change, they can report changes through a dedicated flow that triggers reassessment. CRM Analytics tracks community impact including total disbursements and families served.'
        },
        dev: {
          title: 'Disbursement Engine and Recertification Batch',
          body: 'BenefitAssignment records store approved amounts, frequencies, and durations. BenefitDisbursement and BenefitDisbursementAdj records track actual payments and adjustments. The Data Processing Engine runs batch jobs to identify BenefitAssignment records with pending recertification dates and triggers notification flows. The Change of Circumstances OmniScript creates a new IndividualApplication with updated assessment responses, which re-triggers BRE evaluation for benefit amount adjustment via BenefitAssignmentAdjustment records. The Caseworker Productivity Analytics app surfaces disbursement metrics in the Benefits tab.'
        }
      }
    ]
  },

  {
    id: 'investigative-case-lifecycle',
    title: 'Investigative Case Lifecycle',
    icon: '\u{1F50E}',
    desc: 'Follow a public complaint through screening, investigation, evidence collection, and resolution.',
    stops: [
      {
        planet: 'social_programs',
        highlightEdges: ['investigative_cases', 'inspections', 'common_features'],
        admin: {
          title: 'Complaint Filing and Intake',
          body: 'The process begins when a constituent files a complaint about a health, safety, or welfare concern. They can submit through the Benefit Assistance portal using the FileAComplaint guided flow or through a caseworker-assisted intake. The complaint captures details about the involved parties, the nature of the allegation, and any supporting evidence. Caseworkers conduct a preliminary Dynamic Assessment to evaluate the severity and determine whether the complaint warrants a full investigation, an inspection visit, or a referral to another agency.'
        },
        dev: {
          title: 'Complaint Intake and Assessment',
          body: 'The FileAComplaint OmniScript creates PublicComplaint records with ComplaintParticipant junction records for involved parties. ComplaintCase records link complaints to Case objects for tracking. Dynamic Assessments using Assessment and AssessmentQuestion objects evaluate the complaint through structured questionnaires with conditional logic. The screening process may create Visit records for inspection follow-up or escalate to investigative case management. Caseworkers use InteractionSummary records to document intake conversations with complainants and witnesses.'
        }
      },
      {
        planet: 'investigative_cases',
        highlightEdges: ['common_features', 'einstein_ai', 'agentforce'],
        admin: {
          title: 'Case Investigation and Evidence Collection',
          body: 'The screened complaint becomes an investigative case managed through the Casework Overview console. Investigators review participants, track relationships using the Actionable Relationship Center graph, and conduct structured assessments. Physical and digital evidence is collected with full chain of custody tracking, recording custodian details, storage locations, and verification types. The Agentforce Complaint Management Agent assists officers by summarizing complaint information and finding similar past complaints, while Einstein AI generates notes summaries to help investigators quickly absorb case history.'
        },
        dev: {
          title: 'Casework Overview and Evidence Chain',
          body: 'The Casework Overview is a predefined console record page with CaseParticipant and CaseEpisode tracking. CustodyItem records manage evidence with CustodyChainEntry objects tracking transfers between custodians and CustodyItemRelation linking evidence to cases. CustodyItemRgltyCodeVio connects evidence to specific RegulatoryCodeViolation records. The ARC (Actionable Relationship Center) graph component visualizes entity relationships. Einstein prompt templates generate notes summaries from InteractionSummary records. Agentforce topics use purpose-built flows for complaint summarization and similar complaint detection.'
        }
      },
      {
        planet: 'inspections',
        highlightEdges: ['licensing_and_permitting', 'common_features', 'einstein_ai'],
        admin: {
          title: 'Investigative Site Inspection',
          body: 'When the investigation requires onsite verification, inspectors are dispatched to evaluate compliance with regulatory codes. They use the mobile Inspection app to conduct structured assessments, photograph conditions, and record violations with severity levels. Enforcement actions are created for confirmed violations, which may include fines, remediation requirements, or license suspension. Einstein AI generates prior violation reports from inspection visit history to help inspectors identify patterns and repeated offenses at the same location.'
        },
        dev: {
          title: 'Inspection and Enforcement Pipeline',
          body: 'Visit records are created and linked to the investigative Case via the BusinessLicenseApplication or directly from the case record. InspectionAssessmentInd records evaluate compliance against RegulatoryCode and AssessmentIndicatorDefinition criteria. Failed indicators auto-create RegulatoryCodeViolation records. ViolationEnforcementAction records are created for confirmed violations and trigger Integration Procedures that generate RegulatoryTrxnFee records. Einstein prompt templates for prior violation reports ground on Visit and RegulatoryCodeViolation objects to surface historical patterns for the inspector.'
        }
      },
      {
        planet: 'common_features',
        highlightEdges: ['investigative_cases', 'licensing_and_permitting', 'social_programs'],
        admin: {
          title: 'Proceedings and Decision Transparency',
          body: 'For cases that require legal action, case proceedings are initiated to track court actions, appeals, mediations, or arbitrations. The Business Rules Engine evaluates regulatory policies to determine appropriate enforcement levels and penalties. Decision Explainer provides transparency into how penalties were calculated, ensuring agencies can demonstrate consistent and equitable treatment. Document Checklist Items manage the evidence packages and legal documentation required for proceedings, with published Interaction Summaries serving as locked evidence records.'
        },
        dev: {
          title: 'Proceedings and BRE Integration',
          body: 'CaseProceeding records track legal proceedings with CaseProceedingParticipant, CaseProceedingComplaint, and CaseProceedingInfraction junction objects. CaseProceedingResult records capture outcomes including enforcement actions and remediation requirements. The BRE ExpressionSet evaluates violation severity against DecisionMatrix penalty schedules. ExplainabilityActionDefinition templates format penalty calculations for transparency. DocumentChecklistItem records route evidence packages through approval workflows. InteractionSummary records with publish status become immutable evidence linked to the case timeline.'
        }
      },
      {
        planet: 'investigative_cases',
        highlightEdges: ['crm_analytics', 'setup_and_security', 'experience_cloud'],
        admin: {
          title: 'Case Resolution and Analytics',
          body: 'The investigation concludes with a recorded resolution that may include case proceeding results, enforcement actions, care plans for affected individuals, or case closure. Constituents can request case proceeding deferrals through the portal if needed. The Caseworker Productivity Analytics app provides supervisors with insights into caseload distribution, processing times, and SLA compliance. This data helps agencies identify bottlenecks, balance investigator workloads, and measure the effectiveness of their investigative processes over time.'
        },
        dev: {
          title: 'Resolution and Analytics Pipeline',
          body: 'Case resolution updates the Case status and creates CaseEpisode records documenting the final outcome. Results may generate CarePlan records for affected parties or ViolationEnforcementAction records for regulatory penalties. The Caseworker Productivity Analytics CRM Analytics app uses datasets built from Case, BenefitDisbursement, IndividualApplication, and Referral objects. The Workload Management dashboard provides Summary, SLA Management, Benefits, and Leaderboard tabs. The Case Analytics dashboard embedded on case record pages visualizes time spent in each status against SLA requirements.'
        }
      }
    ]
  },

  {
    id: 'talent-recruitment-pipeline',
    title: 'Talent Recruitment Pipeline',
    icon: '\u{1F4BC}',
    desc: 'Follow a government position from classification and posting through applicant evaluation to hiring.',
    stops: [
      {
        planet: 'talent_recruitment',
        highlightEdges: ['setup_and_security', 'employee_experience', 'data_360'],
        admin: {
          title: 'Position Classification and Requisition',
          body: 'The hiring process starts when HR staff define occupation groups, occupations, and positions with associated pay grades and qualification requirements. Recruiters then create recruitment requisitions as formal requests to fill specific job positions. Each requisition links to the position, assigns a hiring manager as a participant, and enters an approval workflow. The hiring manager reviews and approves the requisition on the Employee Site, confirming the budget, position details, and desired qualifications before the job can be posted publicly.'
        },
        dev: {
          title: 'Position and Requisition Data Model',
          body: 'The classification hierarchy flows from OccupationGroup to Occupation to Position to JobPosition, with PayGrade, PayGradeStep, and PayGradeStepLocation objects supporting location-specific compensation. RecruitmentRequisition records link to JobPosition via the JobPstnRecruitmentRqs junction object. RecruitmentRequisitionPtcp records assign hiring managers and other participants. RecruitmentRequisitionLoc objects define location preferences. Approval processes with entry criteria and multi-step reviews control requisition progression before job posting creation.'
        }
      },
      {
        planet: 'experience_cloud',
        highlightEdges: ['talent_recruitment', 'agentforce'],
        admin: {
          title: 'Career Site Job Posting',
          body: 'Once the requisition is approved, a job posting is drafted with overview, summary, and duties content in multiple languages. The posting is published to the Career Site Experience Cloud template, where job seekers can browse and search for positions matching their qualifications and location preferences. The career site provides a modern, engaging experience where applicants can discover opportunities, learn about the agency mission, and submit applications through guided flows. The Agentforce Recruitment FAQ Agent answers questions from unauthenticated visitors about the hiring process.'
        },
        dev: {
          title: 'Career Site and Search Architecture',
          body: 'RecruitmentPosting records are created from approved RecruitmentRequisition records. RecruitmentContentSection and RecruitmentPostingCntntSect objects store multi-language content sections. The Data Processing Engine compiles posting data into RecruitmentPostingSearchableFld objects for criteria-based search on the career site home page. The Career Site Experience Cloud template deploys with job search, application submission, and application tracking pages. The Recruitment FAQ Agentforce topic uses RAG with the Agentforce Data Library for source-cited answers to guest user questions.'
        }
      },
      {
        planet: 'talent_recruitment',
        highlightEdges: ['common_features', 'agentforce', 'experience_cloud'],
        admin: {
          title: 'Applicant Evaluation and Vetting',
          body: 'Job seekers submit applications through guided flows on the career site. Hiring managers and interviewers receive application form evaluations on the Employee Site, where they use Dynamic Assessment action plans for structured feedback. Compliant data sharing controls ensure evaluators only see the information relevant to their role. Selected applicants advance to vetting evaluations including background checks, health examinations, and reference checks. The Agentforce Candidate Sourcing Agent also helps recruiters find qualified candidates from past applications based on skills and experience.'
        },
        dev: {
          title: 'Evaluation and Vetting Objects',
          body: 'ApplicationFormRelation and ApplicationFormEvalPtcp objects manage the evaluation assignment workflow. Dynamic Assessments with ActionPlanTemplate records define structured evaluation questionnaires for interviewers. VettingEvaluation records track background check, Examination, and PersonExamination outcomes as approved, rejected, or flagged. Compliant Data Sharing governs record visibility between RecruitmentRequisitionPtcp participants. The Candidate Sourcing Agentforce topic filters ApplicationForm records by stage and requisition, creates Lead records, and uses PersonCompetency and PersonExamination data for skill-based matching.'
        }
      },
      {
        planet: 'agentforce',
        highlightEdges: ['talent_recruitment', 'experience_cloud', 'einstein_ai'],
        admin: {
          title: 'AI-Powered Recruitment Assistance',
          body: 'Agentforce agents accelerate the recruitment process across multiple touchpoints. The Job Recommendation Agent on the Applicant Portal provides personalized job suggestions based on applicant profiles, education, work experience, and location preferences. The Candidate Sourcing Agent helps recruiters search past applications and identify qualified candidates for new openings, sending personalized outreach emails. The Complaint Management Agent supports HR intake officers handling employment-related complaints. All agents leverage Einstein generative AI for content generation and summarization.'
        },
        dev: {
          title: 'Agent Topics and RAG Integration',
          body: 'The Job Recommendation Agent uses Einstein Search Retriever with RAG to match RecruitmentPosting records against PartyProfile, PersonEducation, PersonEmployment, and PartyProfileAddress data. The agent is deployed as Embedded Messaging on the Applicant Portal Experience Cloud site. The Candidate Sourcing Agent topics include both standard sourcing that filters ApplicationForm records and skill-based sourcing that evaluates PersonCompetency and PersonExamination records. Agents are created from Employee or Service Agent templates, configured with purpose-built flows and prompt templates, and deployed to Lightning Experience panels or Experience Cloud sites.'
        }
      },
      {
        planet: 'talent_recruitment',
        highlightEdges: ['employee_experience', 'experience_cloud', 'setup_and_security'],
        admin: {
          title: 'Employment Offer and Onboarding',
          body: 'Applicants who pass evaluation and vetting receive tentative employment offers, which are confirmed as final offers after all clearances are verified. The applicant views and accepts the offer on the career site. Accepted offers transition to the Employee Experience domain, where the new hire is created as a Lightning Platform user with appropriate permission sets and access to HR Service. The complete recruitment pipeline from position creation to onboarding is tracked, giving agency leadership visibility into hiring metrics, time-to-fill, and recruitment funnel conversion rates.'
        },
        dev: {
          title: 'Offer Lifecycle and Employee Transition',
          body: 'EmploymentOffer records link to VettingEvaluation records via EmploymentOfferVettingEval to confirm clearance before final offer rollout. Offer status progresses through tentative, final, accepted, and declined stages. Accepted offers trigger employee record creation with Employee2 and PersonEmployment objects. The Employee Experience permission set group grants access to PSS capabilities including dynamic assessments, program management, licensing, and grantmaking. The transition leverages Compliant Data Sharing to control which recruitment data carries forward into the employee record.'
        }
      }
    ]
  }
];
