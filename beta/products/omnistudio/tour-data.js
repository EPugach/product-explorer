// ══════════════════════════════════════════════════════════════
//  TOUR DATA — Constellation Stories tour definitions
//  Each tour is a sequence of stops with admin & dev narration
// ══════════════════════════════════════════════════════════════

export const TOURS = [
  {
    id: 'build-guided-process',
    title: 'Build a Guided Process',
    icon: '\u{1F9ED}',
    desc: 'Building an end-to-end guided digital experience from data layer to UI and deployment on Experience Cloud',
    stops: [
      {
        planet: 'datamappers',
        highlightEdges: ['integration'],
        admin: {
          title: 'Start With the Data',
          body: 'Every guided process starts with data. DataRaptors (now Data Mappers) let you pull information from Salesforce objects without writing code. You define which fields to extract, and the mapper builds the JSON payload your process will use. Think of it as setting up the information pipeline before building the screen.'
        },
        dev: {
          title: 'DataRaptor Extract Configuration',
          body: 'DataRaptors use DRBundle__c metadata records to define extract, transform, and load operations. An Extract type queries sObjects using filter criteria on DRMapItem__c records, building a nested JSON output. The DataRaptorController dispatches to DataRaptorExtractService which constructs dynamic SOQL from the configured field mappings and relationship paths.'
        }
      },
      {
        planet: 'integration',
        highlightEdges: ['datamappers', 'omniscripts'],
        admin: {
          title: 'Orchestrate Behind the Scenes',
          body: 'Integration Procedures run server-side logic that combines multiple data lookups, calculations, and external API calls into a single callable action. They execute faster than OmniScripts because they run entirely on the server. Admins chain together DataRaptors, HTTP actions, and conditional logic without writing Apex.'
        },
        dev: {
          title: 'Integration Procedure Engine',
          body: 'Integration Procedures are compiled into a single Apex transaction using the OmniProcess__c and Element__c metadata objects. Each element (DataRaptor Action, HTTP Action, Set Values, Conditional Block) is serialized into a JSON-based execution plan. The IntegrationProcedureService caches compiled procedures and supports remote actions, REST endpoints, and invocable method entry points.'
        }
      },
      {
        planet: 'omniscripts',
        highlightEdges: ['integration', 'flexcards'],
        admin: {
          title: 'Build the User Experience',
          body: 'OmniScripts are the guided wizards your users interact with. Each step presents a screen with fields, choices, and instructions. OmniScripts call Integration Procedures to fetch and save data, validate inputs in real time, and branch to different paths based on user selections. No code needed for multi-step forms.'
        },
        dev: {
          title: 'OmniScript Runtime Architecture',
          body: 'OmniScripts are stored as OmniProcess__c records with child Element__c records defining steps, fields, and actions. The OmniScript LWC runtime interprets the JSON definition at render time, supporting conditional visibility, data binding expressions, and custom LWC overrides. The data JSON flows through each step, accumulating user input and server responses into a single payload for final save.'
        }
      },
      {
        planet: 'flexcards',
        highlightEdges: ['omniscripts', 'experience'],
        admin: {
          title: 'Surface Key Information',
          body: 'FlexCards display data in compact, interactive cards that can launch OmniScripts. Agents and customers see relevant information at a glance, with action buttons for guided processes. FlexCards pull data through Integration Procedures and can be embedded in record pages, portals, or other FlexCards for a layered UI.'
        },
        dev: {
          title: 'FlexCard Rendering Engine',
          body: 'FlexCards are defined in OmniUiCard__c metadata with child OmniUiCardElement__c records for layout. The FlexCard LWC component calls its configured data source (Integration Procedure, DataRaptor, Apex, or SOQL) on initialization. Child elements support conditional rendering, custom LWC slots, and flyout actions. Cards compile to optimized LWC bundles for deployment.'
        }
      },
      {
        planet: 'experience',
        highlightEdges: ['flexcards', 'omniscripts'],
        admin: {
          title: 'Deliver to Your Audience',
          body: 'OmniStudio components are designed for Experience Cloud portals and digital channels. FlexCards and OmniScripts drop directly into Experience Builder pages, giving customers self-service access to guided processes. The same components work on agent desktops and customer portals with responsive layouts.'
        },
        dev: {
          title: 'Experience Cloud Integration',
          body: 'OmniStudio LWC components expose design attributes for Experience Builder configuration. The OmniscriptActionLauncher and FlexCardContainer components handle context injection from the portal user session. Guest user access requires exposed Integration Procedures with cacheable flags. The OmniStudio runtime respects Community User context for record access and sharing rules.'
        }
      }
    ]
  },
  {
    id: 'data-pipeline',
    title: 'The Data Pipeline',
    icon: '\u{1F500}',
    desc: 'How data flows from Salesforce objects through transformation, formulas, and server-side orchestration into guided processes',
    stops: [
      {
        planet: 'datamappers',
        highlightEdges: ['formulas', 'integration'],
        admin: {
          title: 'Extract and Transform',
          body: 'Data Mappers (DataRaptors) are the entry point for all data operations. They extract records from Salesforce, transform field values between formats, and load data back into objects. A single mapper can pull from multiple related objects and reshape the data into the structure your processes expect.'
        },
        dev: {
          title: 'DataRaptor Operations',
          body: 'DataRaptors operate in three modes: Extract (SOQL-based reads building JSON), Transform (JSON-to-JSON reshaping using input/output paths), and Load (JSON-to-sObject DML with upsert support). DRMapItem__c records define field-level mappings with formula expressions, default values, and lookup relationships. The DataRaptorBulkProcessor handles batch operations for high-volume transforms.'
        }
      },
      {
        planet: 'formulas',
        highlightEdges: ['datamappers', 'integration'],
        admin: {
          title: 'Calculate and Validate',
          body: 'OmniStudio formulas let you calculate values, validate inputs, and transform data within your processes. Formula expressions work inside OmniScripts, FlexCards, and Data Mappers, giving you Excel-like computation without code. You can concatenate fields, calculate dates, apply conditional logic, and format output.'
        },
        dev: {
          title: 'Formula Expression Engine',
          body: 'The OmniStudio formula engine evaluates merge expressions using a custom parser that supports arithmetic, string operations, date math, and conditional ternary logic. Formulas reference the data JSON using dot-notation paths. Inside Integration Procedures, Set Values elements use the same expression engine. The OmniFormulaService class compiles expressions into an AST for efficient repeated evaluation during batch processing.'
        }
      },
      {
        planet: 'integration',
        highlightEdges: ['datamappers', 'omniscripts'],
        admin: {
          title: 'Server-Side Orchestration',
          body: 'Integration Procedures tie everything together on the server. They call Data Mappers to read and write data, apply formulas through Set Values elements, make HTTP callouts to external systems, and return structured results. A single Integration Procedure can replace dozens of Apex triggers and workflow rules.'
        },
        dev: {
          title: 'Integration Procedure Execution',
          body: 'Integration Procedures compile to a sequential element chain executed by IntegrationProcedureService. Each element type has a dedicated handler: DataRaptorAction calls DataRaptorService, HTTPAction uses Named Credentials for callouts, SetValues evaluates formulas, and ConditionalBlock gates execution paths. The execution context maintains a shared data JSON that elements read from and write to using configurable input/output paths.'
        }
      },
      {
        planet: 'omniscripts',
        highlightEdges: ['integration', 'datamappers'],
        admin: {
          title: 'Consume the Data',
          body: 'OmniScripts are the final consumer of your data pipeline. They call Integration Procedures to fetch pre-processed data, display it to users in guided steps, collect input, and send it back through the pipeline for saving. The entire round trip from data extraction to user interaction to save happens without a single line of code.'
        },
        dev: {
          title: 'OmniScript Data Binding',
          body: 'OmniScripts bind to Integration Procedures via DataRaptor Action and Integration Procedure Action elements. The data JSON is the central state object, populated by server responses and user input. Element-level binding uses JSON path expressions with support for array iteration, conditional branching on data values, and merge field expressions in display text and labels.'
        }
      }
    ]
  },
  {
    id: 'deploy-across-orgs',
    title: 'Deploy Across Orgs',
    icon: '\u{1F4E6}',
    desc: 'Taking OmniStudio components from development through testing, packaging, and deployment to production',
    stops: [
      {
        planet: 'omniscripts',
        highlightEdges: ['deployment', 'config'],
        admin: {
          title: 'Build in Development',
          body: 'Development starts in a sandbox where admins and developers build OmniScripts, FlexCards, Integration Procedures, and Data Mappers. Each component is versioned within OmniStudio, so you can iterate on new versions without breaking the active one. The Version Management UI lets you activate, deactivate, and compare versions.'
        },
        dev: {
          title: 'OmniProcess Version Control',
          body: 'OmniStudio components are stored as OmniProcess__c records with IsActive__c and VersionNumber__c fields. The OmniStudio IDE uses CustomMetadata-based definitions that can be version-controlled. The OmniStudio Migration Tool serializes component trees into JSON bundles, capturing all child Element__c records, data source configurations, and LWC custom overrides.'
        }
      },
      {
        planet: 'testing',
        highlightEdges: ['omniscripts', 'deployment'],
        admin: {
          title: 'Validate Before Promoting',
          body: 'OmniStudio includes a testing framework to validate processes before deployment. You can preview OmniScripts with test data, simulate Integration Procedure calls, and verify Data Mapper output. Testing in a sandbox catches issues early, ensuring your guided processes work correctly before reaching production.'
        },
        dev: {
          title: 'Testing Framework',
          body: 'OmniStudio components support the OmniStudio Test Framework for automated validation. Integration Procedures can be tested via REST endpoint invocation with mock data payloads. OmniScript previews render the full LWC runtime with debug mode enabled, logging data JSON state changes per step. DataRaptor test execution validates SOQL generation and field mapping accuracy against sample records.'
        }
      },
      {
        planet: 'deployment',
        highlightEdges: ['testing', 'config'],
        admin: {
          title: 'Package and Promote',
          body: 'OmniStudio provides dedicated deployment tools to move components between orgs. The OmniStudio Migration Tool exports components as JSON files that can be imported into the target org. You can also use Change Sets, Metadata API, or the IDX Workbench for deployment. Each method handles the dependency chain automatically.'
        },
        dev: {
          title: 'Migration and Deployment Tooling',
          body: 'The OmniStudio Migration Tool exports OmniProcess__c, OmniUiCard__c, and DRBundle__c records with full dependency resolution. The IDX Build Tool compiles OmniStudio definitions into deployable LWC bundles for production-optimized rendering. Metadata API deployments require the VlocityDatapack format. The deployment pipeline handles activation sequencing to avoid broken references during cutover.'
        }
      },
      {
        planet: 'config',
        highlightEdges: ['deployment', 'omniscripts'],
        admin: {
          title: 'Configure for Production',
          body: 'After deployment, you configure the production org: activate the correct component versions, set up Named Credentials for external APIs, verify permission sets, and configure caching for Integration Procedures. The Configuration Console shows component health status and flags missing dependencies.'
        },
        dev: {
          title: 'Post-Deployment Configuration',
          body: 'Production configuration involves activating OmniProcess__c versions via IsActive__c flags, setting up VlocitySystemInterface custom settings, and configuring OmniStudio caching through OmniStudioSettings metadata. Named Credential references in HTTP Action elements must map to the target org credentials. The OmniStudio Health Check tool validates all component dependencies and reports broken references.'
        }
      }
    ]
  },
  {
    id: 'ai-powered-service',
    title: 'AI-Powered Service',
    icon: '\u{1F916}',
    desc: 'How Agentforce uses OmniStudio components to power AI agent interactions with real-time data and engagement tracking',
    stops: [
      {
        planet: 'agentforce',
        highlightEdges: ['integration', 'flexcards'],
        admin: {
          title: 'The AI Agent',
          body: 'Agentforce uses AI to handle customer interactions autonomously. When a customer asks a question or needs help, the AI agent understands the request and triggers the right OmniStudio components to fulfill it. Agents can look up account information, start guided processes, and resolve issues without human intervention.'
        },
        dev: {
          title: 'Agentforce Action Binding',
          body: 'Agentforce agents invoke OmniStudio components through Agent Actions backed by Integration Procedures and OmniScripts. The AgentForce runtime maps natural language intents to configured Action definitions, which specify the target Integration Procedure, required input parameters, and output handling. Topic-based routing determines which OmniStudio process to invoke based on the classified customer intent.'
        }
      },
      {
        planet: 'integration',
        highlightEdges: ['agentforce', 'datamappers'],
        admin: {
          title: 'Fetch Real-Time Data',
          body: 'When an AI agent needs information, Integration Procedures retrieve it instantly. Customer account details, order status, case history, and product information are all fetched through server-side procedures. The agent gets structured, up-to-date data to inform its responses and decisions.'
        },
        dev: {
          title: 'Agent Data Retrieval Layer',
          body: 'Agentforce invokes Integration Procedures via the InvocableMethod entry point, passing context variables from the agent session. The Integration Procedure chains DataRaptor Extracts for sObject queries and HTTP Actions for external service calls. Response JSON is returned to the agent runtime, which uses it for grounding LLM responses with real Salesforce data. Cacheable IPs reduce latency for frequently accessed data.'
        }
      },
      {
        planet: 'flexcards',
        highlightEdges: ['integration', 'omniscripts'],
        admin: {
          title: 'Present to the Customer',
          body: 'FlexCards display the information AI agents retrieve in a clean, visual format. When an agent surfaces account details or recommendations, FlexCards render them as interactive cards within the chat or service interface. Customers see structured information rather than raw text, with action buttons to proceed.'
        },
        dev: {
          title: 'Card Rendering in Agent Context',
          body: 'FlexCards render within the Agentforce messaging UI via the FlexCardContainer LWC component. The agent runtime injects data JSON into the card context, and the FlexCard definition controls layout, conditional elements, and action buttons. Actions on cards can launch OmniScripts for guided resolution flows. The card rendering pipeline supports responsive breakpoints for chat widget dimensions.'
        }
      },
      {
        planet: 'analytics',
        highlightEdges: ['agentforce', 'integration'],
        admin: {
          title: 'Track and Improve',
          body: 'Analytics dashboards track how AI agents perform: resolution rates, average handling time, customer satisfaction, and which OmniStudio processes are triggered most. This data helps you optimize your guided processes and tune the AI agent for better outcomes over time.'
        },
        dev: {
          title: 'Engagement Analytics Pipeline',
          body: 'OmniStudio interaction data flows into OmniAnalytics objects tracking process completion rates, step abandonment, and average duration. Agentforce metrics are captured via ConversationEntry and AgentAction records. CRM Analytics dashboards query these objects using SAQL datasets. Integration Procedure execution logs provide latency and error rate metrics for performance optimization.'
        }
      },
      {
        planet: 'omniscripts',
        highlightEdges: ['agentforce', 'flexcards'],
        admin: {
          title: 'Guided Resolution',
          body: 'When an AI agent determines that a customer needs a guided process, it launches an OmniScript. The customer walks through a step-by-step flow to update their address, file a claim, or configure a product. The AI agent can pre-fill fields with context from the conversation, making the process faster and reducing errors.'
        },
        dev: {
          title: 'Agent-Launched OmniScript Flow',
          body: 'Agentforce launches OmniScripts via the OmniscriptActionLauncher with pre-populated data JSON from the agent conversation context. The OmniScript runtime receives prefill parameters through URL query strings or Lightning message channel events. On completion, the OmniScript save action posts results back to the agent session via a platform event, allowing the agent to confirm resolution and update case records.'
        }
      }
    ]
  }
];
