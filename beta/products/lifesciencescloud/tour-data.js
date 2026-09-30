// ══════════════════════════════════════════════════════════════
//  Life Sciences Cloud — Constellation Stories
//  Guided tours tracing business workflows across domains
// ══════════════════════════════════════════════════════════════

export const TOURS = [
  {
    id: 'pharma-field-visit',
    title: 'The Pharma Field Visit',
    icon: '\u{1F48A}',
    desc: 'Follow a pharmaceutical sales rep from planning through executing an HCP visit with product detailing and sample drops.',
    stops: [
      {
        planet: 'account_mgmt',
        highlightEdges: ['engagement_planning', 'engagement_execution'],
        admin: {
          title: 'Account Territory Alignment',
          body: 'The journey begins with an HCP account aligned to the rep\'s territory. Batch jobs have processed territory alignment rules, creating Provider Account Territory Info records that link the account to the territory. The rep sees the account on their prioritized list with Next Best Customer scores, AI-generated summaries, and recent engagement history. Ratings help the rep identify which accounts deserve the most attention this cycle.'
        },
        dev: {
          title: 'Account and Territory Data Model',
          body: 'The Account object stores HCP records as Person Accounts with RecordTypeId distinguishing providers from organizations. ProviderAcctTerritoryInfo is the junction between Account and Territory2, created by territory alignment batch jobs that process zip code, brick, and explicit mapping rules. ObjectTerritory2Association records control sharing. ContactPointAddress stores multiple addresses with Google Maps geolocation data for distance calculations in Next Best Customer scoring.'
        }
      },
      {
        planet: 'engagement_planning',
        highlightEdges: ['account_mgmt', 'product_mgmt'],
        admin: {
          title: 'Activity Plan Goals and Scheduling',
          body: 'The rep reviews their activity plan, which defines cycle-level goals for visits, emails, and product detailing by territory. Goal measures are prorated based on working days and time off territory entries. The Calendar component shows upcoming visits with best-time recommendations to avoid conflicts. Key Account Management provides structured account plans with objectives and assessment tasks for strategic accounts.'
        },
        dev: {
          title: 'Activity Plan Architecture',
          body: 'ActivityPlan defines omni-channel cycle plans with ActivityPlanTerritory junction records linking plans to territories. ProviderActivityGoal records store target and actual values per product and activity type, with automatic proration based on working day calculations. The plan review workflow transitions plans through Draft, Manager Review, and Approved statuses. GoalDefinition and GoalAssignment records support Key Account Management assessment task tracking.'
        }
      },
      {
        planet: 'engagement_execution',
        highlightEdges: ['intelligent_content', 'sample_mgmt'],
        admin: {
          title: 'Visit Engagement and Detailing',
          body: 'The rep arrives at the HCP\'s office and opens the Visit Engagement Page. They share an approved presentation on a new therapeutic, capture the HCP\'s reactions to product messages, and discuss safety information. Medical Insights are recorded for cross-team sharing. The HCP signs a consent form digitally, and the rep drops samples within regulatory limits. Post-visit reporting captures all detailing and sample activity automatically.'
        },
        dev: {
          title: 'Visit Data Model and Lifecycle',
          body: 'Visit and ProviderVisit follow a one-to-one model with ProviderVisitProdDetailing capturing product-level interactions. PresentationClickStrmEntry records track page views and time during the presentation. CommunicationSubscriptionConsent stores the signed consent with geolocation. Sample disbursement creates ProductDisbursement records validated against ProviderSampleLimit templates. The visit submission triggers goal progress updates on the associated ProviderActivityGoal records.'
        }
      },
      {
        planet: 'intelligent_content',
        highlightEdges: ['engagement_execution', 'product_mgmt'],
        admin: {
          title: 'Content Delivery and Analytics',
          body: 'The presentation delivered during the visit was sourced from the Content Library, which distributes approved content based on territory and product alignments. Next Best Message had recommended specific product messages ranked by HCP interest level. After the visit, email templates with reusable fragments are used for follow-up communications. Engagement metrics from the presentation player feed analytics dashboards for content strategy optimization.'
        },
        dev: {
          title: 'Content and Messaging Platform',
          body: 'Presentation records link to PresentationPage items with PresentationPageProduct associations for product tracking. TerritoryAcctProdMsgScore records power Next Best Message with ranking data and explainability metrics. LifeScienceEmail templates reference CommunicationSubscription records for consent verification before sending. Email Queue scheduled jobs manage delivery cadence with retry logic and bounce tracking through the email analytics pipeline.'
        }
      },
      {
        planet: 'sample_mgmt',
        highlightEdges: ['product_mgmt', 'engagement_execution'],
        admin: {
          title: 'Sample Compliance and Inventory',
          body: 'The sample drop during the visit was validated against sample limit templates that enforce per-account and per-visit quantity caps. The rep\'s inventory was updated automatically, with production batch tracking maintaining full traceability. Territory quantity allocations ensure strategic distribution across the sales force. Periodic inventory count assessments verify that physical stock matches system records for audit compliance.'
        },
        dev: {
          title: 'Sample Inventory Data Model',
          body: 'ProductItem tracks per-user inventory at each location, with ProductBatchItem providing batch-level quantity breakdowns. ProductionBatch stores lot numbers and expiration dates for regulatory traceability. ProviderSampleLimit templates define limits per product, account, and time period. TerritoryProductQuantityAllocation controls territory-level distribution budgets. InventoryCountAssessment records support ad hoc, periodic, and audited count workflows.'
        }
      }
    ]
  },
  {
    id: 'clinical-trial-lifecycle',
    title: 'Clinical Trial Lifecycle',
    icon: '\u{1F52C}',
    desc: 'Trace a clinical trial from site selection through participant enrollment and advanced therapy management.',
    stops: [
      {
        planet: 'site_mgmt',
        highlightEdges: ['agentforce', 'participant_mgmt'],
        admin: {
          title: 'Site Selection and Assessment',
          body: 'A clinical operations team launches a new research study and needs to identify qualified sites. The Site Selection Console provides a centralized workspace for searching sites by investigator experience, therapeutic area, and geographic criteria. Sites receive feasibility assessments through Experience Cloud portals. Agentforce\'s Site Selection Assistance agent accelerates the process by summarizing site profiles and sending assessments in bulk.'
        },
        dev: {
          title: 'Site Management Data Architecture',
          body: 'ServiceTerritory records represent clinical sites with ServiceResource records for investigators. ResearchStudy connects to sites through CareProgramSite junction records. The site scoring system uses configurable algorithms to rank sites by readiness. SiteStageEvent records track lifecycle transitions from Identified through Selected, Activated, and Closed. Interest tags enable flexible categorization for multi-criteria site searching across the portfolio.'
        }
      },
      {
        planet: 'participant_mgmt',
        highlightEdges: ['site_mgmt', 'care_programs'],
        admin: {
          title: 'Participant Recruitment and Enrollment',
          body: 'With sites activated, participant recruitment begins. The Clinical Excellence Console gives coordinators a unified view of recruitment pipelines across sites. Candidate matching algorithms screen potential participants against study criteria. Interested candidates go through a digital consent process with electronic signatures. Once enrolled, participants are tracked through randomization and assigned to treatment arms.'
        },
        dev: {
          title: 'Enrollment and Consent Architecture',
          body: 'CareProgramEnrollee records are created through guided enrollment flows that capture consent via DigitalVerification records. The randomization engine assigns participants to study arms with configurable stratification factors. IndividualStudyArm junction records link enrollees to specific treatment groups. The consent management system supports multi-language AuthorizationFormText with version tracking and digital signature audit trails.'
        }
      },
      {
        planet: 'advanced_therapy',
        highlightEdges: ['site_mgmt', 'care_programs'],
        admin: {
          title: 'Advanced Therapy Orchestration',
          body: 'For cell and gene therapy trials, the advanced therapy module orchestrates complex multi-step treatment processes. Work procedures define the sequence of therapy stages, substages, and tasks across multiple service territories. The scheduler coordinates appointments across collection sites, manufacturing facilities, and infusion centers. Chain of custody tracking ensures biological materials are handled correctly at every stage.'
        },
        dev: {
          title: 'Therapy Task and Scheduling Engine',
          body: 'WorkProcedure defines the therapy blueprint with WorkProcedureStep records for each stage. WorkOrder and WorkOrderStep records represent individual patient therapy instances. The multi-step scheduler uses ServiceTerritory and ServiceResource records to coordinate across locations. ChainOfCustodyItem tracks biological material transfers with timestamp and handler information. CareProgram records with Category set to Advanced Therapy unlock the therapy-specific feature set.'
        }
      },
      {
        planet: 'care_programs',
        highlightEdges: ['pharmacy_benefits', 'platform_extensions'],
        admin: {
          title: 'Care Program Management',
          body: 'Enrolled participants are managed through care programs that track products, providers, and treatment milestones. Program goals define measurable outcomes, and eligibility rules screen new participants. For trials requiring financial support, Financial Assistance Programs automate eligibility determination and benefit disbursement. Program analytics dashboards track enrollment metrics, retention rates, and outcome indicators across the trial portfolio.'
        },
        dev: {
          title: 'Care Program Object Network',
          body: 'CareProgram is the parent record with CareProgramProduct and CareProgramProvider junction records. CareProgramEnrollee tracks enrollment status and opt-out details. CareProgramGoal records define measurable objectives. Financial Assistance uses Applicant, ApplicationForm, BenefitAssignment, and BenefitDisbursement objects with Business Rules Engine integration for automated eligibility. AuthorizationForm and AuthorizationFormConsent manage consent documents across program types.'
        }
      },
      {
        planet: 'pharmacy_benefits',
        highlightEdges: ['care_programs', 'agentforce'],
        admin: {
          title: 'Benefits Verification',
          body: 'For participants needing medication coverage, pharmacy benefits verification confirms insurance eligibility. Reps create electronic verification requests that integrate with clearinghouses via MuleSoft. Coverage details including copay, coinsurance, and deductibles are returned and stored. Einstein generates concise benefit summaries for sharing with patients and providers. Periodic reverification ensures continuous medication access throughout the trial.'
        },
        dev: {
          title: 'FHIR-Aligned Benefits Data Model',
          body: 'CareBenefitVerifyRequest stores verification requests with MemberPlan and PurchaserPlan relationships. CoverageBenefit and CoverageBenefitItem records store detailed plan information with CoverageBenefitItemLimit for expenditure thresholds. The data model follows FHIR-CARIN and NCPDP standards for interoperable data exchange. Medication and MedicationRequest records track prescribed treatments with standardized CodeSet references. Einstein prompt templates power the AI-generated call scripts and benefit summaries.'
        }
      }
    ]
  },
  {
    id: 'medtech-surgical-workflow',
    title: 'MedTech Surgical Workflow',
    icon: '\u{1FA7A}',
    desc: 'Follow a medical device sales cycle from agreement through surgical case fulfillment and inventory management.',
    stops: [
      {
        planet: 'account_mgmt',
        highlightEdges: ['medtech', 'engagement_execution'],
        admin: {
          title: 'Hospital Account Setup',
          body: 'A medical device rep manages relationships with a hospital system. The account profile shows territory-specific information, affiliations between the hospital and its surgical departments, and key contacts including surgeons and procurement managers. Account summarization provides AI-generated overviews of recent engagement history. Ratings help prioritize accounts based on procedure volume and revenue potential.'
        },
        dev: {
          title: 'Account Data for MedTech',
          body: 'The hospital is stored as a business Account with RecordType for HCO. ProviderAffiliation records link surgeon HCPs to the hospital HCO with role and specialty details. ProviderAcctTerritoryInfo connects the hospital to the rep\'s territory with preferred address and visit tracking. HealthcareProviderSpecialty records capture surgeon specializations relevant to the device portfolio.'
        }
      },
      {
        planet: 'medtech',
        highlightEdges: ['account_mgmt', 'product_mgmt'],
        admin: {
          title: 'Sales Agreements and Forecasting',
          body: 'The rep creates a sales agreement with the hospital for planned device volumes at negotiated prices. Monthly schedule frequencies track planned versus actual quantities as orders are booked. Account-level forecasting uses market and account growth factors to project demand. Manager targets are distributed across the team with monthly and quarterly review cadences. Quote-to-agreement conversion automates bidirectional record creation.'
        },
        dev: {
          title: 'Agreement and Forecast Objects',
          body: 'SalesAgreement records store agreement-level terms with SalesAgreementProduct line items for each device. AccountForecast records use configurable horizon and granularity settings for demand projections. AccountManagerTarget distributes revenue and quantity targets across team members. The record conversion screen flow maps fields between Quote and SalesAgreement objects using context definitions. Bell notifications track conversion job completion status.'
        }
      },
      {
        planet: 'engagement_execution',
        highlightEdges: ['medtech', 'sample_mgmt'],
        admin: {
          title: 'Surgical Case Visit Execution',
          body: 'A surgical case visit is scheduled for the rep to bring devices to the operating room. Action plan templates define pre-visit tasks including product preparation and authorization. The rep uses the mobile app to check product availability, detect shortfalls, and request transfers from nearby inventories. During the visit, tasks are completed, orders fulfilled, and cycle counts verified with barcode scanning.'
        },
        dev: {
          title: 'Visit and Inventory Integration',
          body: 'Visit records for surgical cases include Visitor and VisitedParty relationships. ActionPlanTemplate and AssessmentTask define visit task workflows. ProductRequired records flag needed devices with quantity and priority. ProductAvailabilityProjection identifies shortfalls by comparing upcoming visit requirements against ProductItem quantities. ProductTransfer and ProductRequest manage inter-location inventory movements. GenericVisitKeyPerformanceIndicator tracks expected versus actual cycle count quantities.'
        }
      },
      {
        planet: 'product_mgmt',
        highlightEdges: ['medtech', 'intelligent_content'],
        admin: {
          title: 'Device Catalog and Territory Alignment',
          body: 'The medical device product catalog organizes devices by markets, brands, and SKUs through the product hierarchy. Product territory alignments ensure reps only access devices approved for their region. Product messages provide clinical evidence and safety information for surgical consultations. Product priority sorting ensures reps discuss the highest-value devices first during hospital visits.'
        },
        dev: {
          title: 'Product Hierarchy for Devices',
          body: 'LifeSciMarketableProduct creates the hierarchical structure from markets through brands to sellable products. Product2 records represent physical device items with record types for order items versus samples. ProductTerritoryAvailability and ProductTerrDtlAvailability control access by territory with inheritance and exclusion rules. ProductGuidance records store clinical messages and objectives with effective dates and territory associations.'
        }
      }
    ]
  },
  {
    id: 'patient-support-journey',
    title: 'Patient Support Journey',
    icon: '\u{1F49C}',
    desc: 'Follow a patient from enrollment in a support program through financial assistance and pharmacy benefits verification.',
    stops: [
      {
        planet: 'care_programs',
        highlightEdges: ['participant_mgmt', 'platform_extensions'],
        admin: {
          title: 'Program Enrollment',
          body: 'A patient is referred to a pharmaceutical manufacturer\'s patient support program by their prescribing physician. The patient services rep uses a guided enrollment flow to select the program, add the prescribed medication as a care program product, associate the physician as a care program provider, and capture the patient\'s consent with an electronic signature. A membership card is generated for the enrollee.'
        },
        dev: {
          title: 'Enrollment Flow Architecture',
          body: 'The enrollment flow creates a CareProgramEnrollee record linked to the patient Account and the CareProgram. CareProgramProduct and CareProgramProvider junction records associate the treatment and provider. AuthorizationForm and AuthorizationFormConsent records capture digital consent via DigitalVerification. CareProgramEnrollmentCard generates the membership credential. The flow uses Experience Cloud sites for patient-facing enrollment portals.'
        }
      },
      {
        planet: 'platform_extensions',
        highlightEdges: ['care_programs', 'account_mgmt'],
        admin: {
          title: 'Patient Assessment and Documents',
          body: 'After enrollment, the patient completes health assessments through an Experience Cloud portal. Industry-standard screeners gather structured health information using the Discovery Framework. The Advanced Patient Card on the account record shows a consolidated view of the patient\'s program status, medications, and upcoming milestones. Intelligent Document Automation processes uploaded forms with OCR extraction, routing them to the appropriate queue.'
        },
        dev: {
          title: 'Assessment and Document Processing',
          body: 'Assessment records use AssessmentQuestion and AssessmentQuestionResponse for structured data capture. AssessmentIndicatorDefinition supports generative AI question generation. The Advanced Patient Card uses OmniStudio FlexCards with Data Mappers to retrieve and display data from multiple objects. DocumentChecklistItem and ContentDocument records manage form intake. Intelligent Document Reader integrates with Amazon Textract for OCR extraction and field mapping.'
        }
      },
      {
        planet: 'pharmacy_benefits',
        highlightEdges: ['care_programs', 'agentforce'],
        admin: {
          title: 'Benefits Verification and Coverage',
          body: 'The patient services rep initiates a pharmacy benefits verification to confirm the patient\'s insurance coverage for the prescribed medication. An electronic verification request is sent to the clearinghouse, which returns detailed coverage information including copay amounts, coinsurance percentages, deductible status, and out-of-pocket maximums. Einstein generates a call script if manual follow-up with the payer is needed, then produces a concise benefit summary.'
        },
        dev: {
          title: 'Electronic Verification Pipeline',
          body: 'CareBenefitVerifyRequest stores the verification with patient, practitioner, drug, and pharmacy details. MuleSoft Direct integration transmits the request to clearinghouses using NCPDP-aligned formats. CoverageBenefit and CoverageBenefitItem records store the response with CoverageBenefitItemLimit tracking expenditure thresholds. MemberPlan and PurchaserPlan model the patient\'s insurance relationships. Einstein prompt templates generate payer call scripts targeting specific missing coverage fields.'
        }
      },
      {
        planet: 'agentforce',
        highlightEdges: ['pharmacy_benefits', 'site_mgmt'],
        admin: {
          title: 'Automated Reverification',
          body: 'As the patient\'s coverage approaches its reverification date, the Agentforce Pharmacy Reverification agent takes over. The agent drafts a personalized email to the patient with a secure link to update their insurance details. When the patient responds, the agent summarizes the changes, updates the verification request record, and submits a new electronic verification. If the automated process encounters issues, it falls back to manual verification with a notification to the rep.'
        },
        dev: {
          title: 'Agent Flows and Orchestration',
          body: 'The Pharmacy Reverification Agent uses prebuilt flows for email drafting, patient response summarization, and record updates. Agent Topics define the scope of actions available, while Agent Actions map to specific Flow and prompt template executions. OrchestratorRun manages multi-step processes with timeout handling and error recovery. Einstein generative AI compares existing and updated patient details to identify changes. The fallback mechanism creates a task for manual intervention when automated steps fail.'
        }
      }
    ]
  }
];
