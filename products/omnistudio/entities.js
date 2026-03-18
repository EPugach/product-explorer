// ══════════════════════════════════════════════════════════════
//  OmniStudio Entities — Standard objects & custom metadata
//  OmniStudio is a Salesforce managed package for guided
//  digital experiences and low-code integration
// ══════════════════════════════════════════════════════════════

export default {

  "omniscripts": {
    "objects": [
      {
        "name": "OmniProcess",
        "type": "standard",
        "domain": "omniscripts",
        "description": "Stores OmniScript and Integration Procedure definitions. Both tool types share this single sObject, differentiated by the IsIntegrationProcedure flag. Each record represents a versioned process definition containing the full configuration for a guided flow or server-side procedure. Active versions are compiled into optimized bundles for runtime execution.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name identifying this OmniScript or Integration Procedure" },
          { "name": "Type", "type": "Text", "description": "Primary classification grouping related processes together" },
          { "name": "SubType", "type": "Text", "description": "Secondary classification within the type for finer categorization" },
          { "name": "Language", "type": "Text", "description": "Language code for the process definition, enabling multi-language support" },
          { "name": "VersionNumber", "type": "Number", "description": "Numeric version identifier allowing multiple versions of the same process" },
          { "name": "IsActive", "type": "Checkbox", "description": "Controls whether this version is the active runtime version for its type and subtype" },
          { "name": "IsIntegrationProcedure", "type": "Checkbox", "description": "When true, this record is an Integration Procedure rather than an OmniScript" },
          { "name": "IsWebCompEnabled", "type": "Checkbox", "description": "Indicates the process is compiled as a Lightning Web Component rather than Aura" },
          { "name": "RequiredPermission", "type": "Text", "description": "Custom permission required for a user to execute this process" },
          { "name": "ResponseCacheType", "type": "Picklist", "description": "Caching strategy for Integration Procedure responses such as session or org-level" },
          { "name": "PropertySetConfig", "type": "LongTextArea", "description": "JSON configuration blob storing all process-level settings and element definitions" },
          { "name": "Description", "type": "TextArea", "description": "Human-readable description of the process purpose and behavior" },
          { "name": "CustomJavaScript", "type": "LongTextArea", "description": "Custom JavaScript code injected into the OmniScript runtime for advanced logic" }
        ],
        "relationships": [
          { "target": "OmniProcessElement", "type": "parent", "description": "An OmniProcess contains one or more elements that define its steps, inputs, and actions" },
          { "target": "OmniProcessCompilation", "type": "parent", "description": "Active processes have compiled bundles stored for optimized runtime execution" },
          { "target": "OmniProcessTransientData", "type": "parent", "description": "Long-running processes can store temporary data between sessions" },
          { "target": "OmniscriptSavedSession", "type": "parent", "description": "Users can save in-progress OmniScript sessions for later resumption" }
        ]
      },
      {
        "name": "OmniProcessElement",
        "type": "standard",
        "domain": "omniscripts",
        "description": "Represents an individual element within an OmniScript or Integration Procedure, such as a step, input field, action element, or grouping block. Elements are arranged hierarchically with sequence numbers and levels to define the flow structure. Each element's behavior, validation, and data mapping are stored in its PropertySetConfig JSON.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Unique element name used for data binding and referencing within the process" },
          { "name": "Type", "type": "Picklist", "description": "Element type such as Step, Text Input, Data Racoon Action, Set Values, or Block" },
          { "name": "SequenceNumber", "type": "Number", "description": "Determines the order of this element within its parent step or block" },
          { "name": "Level", "type": "Number", "description": "Nesting depth of the element in the process hierarchy, starting at zero for top-level steps" },
          { "name": "Description", "type": "TextArea", "description": "Optional description of the element purpose for documentation" },
          { "name": "PropertySetConfig", "type": "LongTextArea", "description": "JSON configuration containing element-specific settings such as data source, validation, and conditional visibility" },
          { "name": "IsActive", "type": "Checkbox", "description": "Controls whether this element is included in the active process version" },
          { "name": "EmbeddedOmniScriptKey", "type": "Text", "description": "Type/SubType/Language key referencing another OmniScript embedded within this element" }
        ],
        "relationships": [
          { "target": "OmniProcess", "type": "child", "description": "Each element belongs to a single OmniProcess parent record" },
          { "target": "OmniProcessElement", "type": "lookup", "description": "Elements can reference a parent element for hierarchical nesting within steps and blocks" }
        ]
      },
      {
        "name": "OmniProcessCompilation",
        "type": "standard",
        "domain": "omniscripts",
        "description": "Stores the compiled and activated bundle for an OmniScript or Integration Procedure. When an admin activates a process version, the platform pre-compiles all element configurations, merge fields, and data mappings into a single optimized payload. This compiled form is loaded at runtime to avoid re-processing the element tree on every execution.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Auto-generated name identifying the compilation record" },
          { "name": "OmniProcessId", "type": "Lookup", "description": "Reference to the parent OmniProcess this compilation was generated from" },
          { "name": "Status", "type": "Picklist", "description": "Compilation status such as Active, Superseded, or Error" },
          { "name": "CompilationData", "type": "LongTextArea", "description": "The full compiled JSON payload used by the runtime engine" },
          { "name": "CompiledDate", "type": "DateTime", "description": "Timestamp when this compilation was generated" }
        ],
        "relationships": [
          { "target": "OmniProcess", "type": "child", "description": "Each compilation record is generated from a single OmniProcess version" }
        ]
      },
      {
        "name": "OmniProcessTransientData",
        "type": "standard",
        "domain": "omniscripts",
        "description": "Temporarily stores data for long-running OmniScript and Integration Procedure processes that span multiple sessions or require asynchronous processing. Transient data records hold intermediate payloads between execution steps, enabling processes to pause and resume without losing state. Records are automatically purged after their expiration date.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Identifier for this transient data record" },
          { "name": "OmniProcessId", "type": "Lookup", "description": "The OmniProcess this transient data is associated with" },
          { "name": "DataPayload", "type": "LongTextArea", "description": "JSON blob containing the intermediate process data" },
          { "name": "ExpirationDate", "type": "DateTime", "description": "Date and time after which this transient data is eligible for cleanup" },
          { "name": "Status", "type": "Picklist", "description": "Current state of the transient data such as Active, Consumed, or Expired" },
          { "name": "InstanceId", "type": "Text", "description": "Unique execution instance identifier linking this data to a specific process run" }
        ],
        "relationships": [
          { "target": "OmniProcess", "type": "child", "description": "Each transient data record belongs to a single OmniProcess" }
        ]
      },
      {
        "name": "OmniscriptSavedSession",
        "type": "standard",
        "domain": "omniscripts",
        "description": "Captures saved OmniScript session data so users can resume interrupted processes at a later time. When a user clicks Save for Later during an OmniScript flow, all entered data and current step position are serialized into this record. The user can return and pick up exactly where they left off, with all prior inputs restored.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Auto-generated name for the saved session record" },
          { "name": "OmniProcessId", "type": "Lookup", "description": "The OmniScript process this saved session belongs to" },
          { "name": "DataPayload", "type": "LongTextArea", "description": "Serialized JSON of all form inputs and data collected up to the save point" },
          { "name": "UserId", "type": "Lookup", "description": "The user who saved this session" },
          { "name": "Status", "type": "Picklist", "description": "Session state such as In Progress, Resumed, or Completed" },
          { "name": "LastSavedPage", "type": "Text", "description": "Step name or page index where the user left off" },
          { "name": "CreatedDate", "type": "DateTime", "description": "Timestamp when the session was first saved" },
          { "name": "ExpirationDate", "type": "DateTime", "description": "Date after which this saved session is no longer resumable" }
        ],
        "relationships": [
          { "target": "OmniProcess", "type": "child", "description": "Each saved session belongs to a single OmniScript process" }
        ]
      }
    ],
    "metadata": []
  },

  "flexcards": {
    "objects": [
      {
        "name": "OmniUiCard",
        "type": "standard",
        "domain": "flexcards",
        "description": "Stores FlexCard definitions including layout configuration, data source bindings, and action settings. FlexCards are reusable UI components that display contextual information from one or more data sources in a compact, branded card format. They can be embedded in Lightning pages, OmniScripts, or other FlexCards to compose rich, data-driven interfaces without custom code.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Unique name identifying this FlexCard definition" },
          { "name": "Author", "type": "Text", "description": "Name of the admin or developer who created this FlexCard" },
          { "name": "Description", "type": "TextArea", "description": "Human-readable description of the card purpose and data it displays" },
          { "name": "IsActive", "type": "Checkbox", "description": "Controls whether this FlexCard version is available for use in pages and flows" },
          { "name": "VersionNumber", "type": "Number", "description": "Numeric version allowing multiple iterations of the same card definition" },
          { "name": "PropertySetConfig", "type": "LongTextArea", "description": "JSON configuration storing layout, styling, conditional visibility, and action definitions" },
          { "name": "DataSourceConfig", "type": "LongTextArea", "description": "JSON defining the data sources such as SOQL queries, Integration Procedures, or REST calls" },
          { "name": "ChildCardKeys", "type": "Text", "description": "Comma-separated keys referencing child FlexCards embedded within this card" },
          { "name": "SampleDataSourceResponse", "type": "LongTextArea", "description": "Sample JSON response used in the FlexCard designer preview mode" }
        ],
        "relationships": [
          { "target": "OmniUiCard", "type": "lookup", "description": "FlexCards can embed child FlexCards via ChildCardKeys for composable interfaces" },
          { "target": "OmniProcess", "type": "lookup", "description": "FlexCards can invoke OmniScripts as actions or use Integration Procedures as data sources" }
        ]
      }
    ],
    "metadata": []
  },

  "integration": {
    "objects": [],
    "metadata": []
  },

  "datamappers": {
    "objects": [
      {
        "name": "OmniDataTransformation",
        "type": "standard",
        "domain": "datamappers",
        "description": "Defines a Data Mapper configuration for reading, writing, and transforming Salesforce data in bulk or record-by-record operations. Each Data Mapper specifies a type determining its behavior: Extract reads data via SOQL, Load writes data via DML, Transform reshapes JSON structures, and Turbo Extract uses optimized read paths for large datasets. Data Mappers are typically called from Integration Procedures or OmniScripts.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name for this Data Mapper definition" },
          { "name": "InterfaceName", "type": "Text", "description": "Unique API identifier used to invoke this Data Mapper from Integration Procedures" },
          { "name": "Type", "type": "Picklist", "description": "Operation type: Extract, Load, Transform, or Turbo Extract" },
          { "name": "IsActive", "type": "Checkbox", "description": "Controls whether this Data Mapper version is available for execution" },
          { "name": "Description", "type": "TextArea", "description": "Human-readable explanation of what data this mapper reads, writes, or transforms" },
          { "name": "OverrideKey", "type": "Text", "description": "Key allowing runtime selection between multiple implementations of the same interface" },
          { "name": "PreviewOtherData", "type": "LongTextArea", "description": "Sample input data used for previewing the transformation in the designer" },
          { "name": "TargetOutputDocumentIdentifier", "type": "Text", "description": "Identifier for the output document template when generating documents" },
          { "name": "SynchronousProcessThreshold", "type": "Number", "description": "Record count threshold above which processing switches to asynchronous mode" }
        ],
        "relationships": [
          { "target": "OmniDataTransformationItem", "type": "parent", "description": "A Data Mapper contains one or more items defining individual field mappings and formulas" },
          { "target": "OmniProcess", "type": "lookup", "description": "Data Mappers are invoked from Integration Procedures and OmniScripts as action elements" }
        ]
      },
      {
        "name": "OmniDataTransformationItem",
        "type": "standard",
        "domain": "datamappers",
        "description": "Represents an individual field mapping, formula, or filter configuration within a Data Mapper. Each item defines how a specific source field maps to a target field, including any transformations, filters, or formula calculations applied during the mapping. Items are processed in order based on their MappingOrder to build the complete data transformation pipeline.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Name identifying this mapping item within the Data Mapper" },
          { "name": "InputObjectName", "type": "Text", "description": "Source object API name from which data is read" },
          { "name": "InputFieldName", "type": "Text", "description": "Source field API name on the input object" },
          { "name": "OutputObjectName", "type": "Text", "description": "Target object API name to which data is written" },
          { "name": "OutputFieldName", "type": "Text", "description": "Target field API name on the output object" },
          { "name": "TransformValuesMappings", "type": "LongTextArea", "description": "JSON defining value transformations such as picklist mappings or formula expressions" },
          { "name": "FilterGroup", "type": "Number", "description": "Numeric group identifier for combining multiple filter conditions with AND/OR logic" },
          { "name": "FilterOperator", "type": "Text", "description": "Comparison operator for filtering such as equals, contains, or greater than" },
          { "name": "FilterValue", "type": "Text", "description": "The value to compare against when this item acts as a filter condition" },
          { "name": "DomainObjectFieldType", "type": "Text", "description": "Salesforce field type of the target field for proper type casting during load operations" },
          { "name": "MappingOrder", "type": "Number", "description": "Execution sequence determining the order in which mapping items are processed" }
        ],
        "relationships": [
          { "target": "OmniDataTransformation", "type": "child", "description": "Each mapping item belongs to a single parent Data Mapper definition" }
        ]
      }
    ],
    "metadata": []
  },

  "config": {
    "objects": [
      {
        "name": "OmniElectronicSignatureTemplate",
        "type": "standard",
        "domain": "config",
        "description": "Stores DocuSign electronic signature template configurations used within OmniScript flows for legally binding e-signatures. Each template defines the envelope structure, document list, and recipient routing rules that govern the signing ceremony. OmniScripts reference these templates through dedicated e-signature action elements to embed signing workflows directly into guided processes.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name identifying this signature template" },
          { "name": "TemplateId", "type": "Text", "description": "External DocuSign template identifier linking to the signing configuration" },
          { "name": "EnvelopeDocuments", "type": "LongTextArea", "description": "JSON defining the documents included in the signing envelope" },
          { "name": "RecipientSettings", "type": "LongTextArea", "description": "JSON configuring signer roles, routing order, and authentication requirements" },
          { "name": "IsActive", "type": "Checkbox", "description": "Controls whether this template is available for use in OmniScript flows" },
          { "name": "Description", "type": "TextArea", "description": "Human-readable explanation of the signing scenario this template supports" }
        ],
        "relationships": [
          { "target": "OmniProcess", "type": "lookup", "description": "OmniScript processes reference signature templates through e-signature action elements" }
        ]
      },
      {
        "name": "OmniInteractionConfig",
        "type": "custom_setting",
        "domain": "config",
        "description": "A custom setting that stores global configuration key-value pairs controlling OmniStudio runtime behavior across the organization. Administrators use these settings to toggle features, set default values, and customize platform behavior without deploying code. Common configurations include enabling LWC compilation, setting cache durations, and controlling debug logging levels.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Record name for identifying this configuration entry" },
          { "name": "Key", "type": "Text", "description": "Configuration key used by the runtime engine to look up this setting" },
          { "name": "Value", "type": "LongTextArea", "description": "The configuration value, which may be a simple string, number, or JSON structure" },
          { "name": "Label", "type": "Text", "description": "Human-readable label displayed in the OmniStudio Settings interface" },
          { "name": "Description", "type": "TextArea", "description": "Explanation of what this configuration controls and its valid values" }
        ],
        "relationships": [
          { "target": "OmniProcess", "type": "lookup", "description": "Configuration settings affect the runtime behavior of all OmniScript and IP executions" }
        ]
      }
    ],
    "metadata": []
  },

  "analytics": {
    "objects": [
      {
        "name": "OmniAnalyticsTrackingDef",
        "type": "standard",
        "domain": "analytics",
        "description": "Defines tracking event configurations for OmniAnalytics engagement monitoring. Each record specifies what user interactions to capture, such as step completions, button clicks, or field changes within OmniScripts and FlexCards. The tracking definitions feed into analytics dashboards that help administrators understand user behavior, identify drop-off points, and optimize guided experiences.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Name identifying this tracking event definition" },
          { "name": "TrackingGroup", "type": "Text", "description": "Logical grouping for organizing related tracking events in analytics views" },
          { "name": "EventType", "type": "Text", "description": "The type of user interaction tracked such as click, submit, navigation, or error" },
          { "name": "ComponentType", "type": "Picklist", "description": "The OmniStudio component type being tracked: OmniScript, FlexCard, or Integration Procedure" },
          { "name": "IsActive", "type": "Checkbox", "description": "Controls whether this tracking definition is currently collecting data" },
          { "name": "TrackingConfiguration", "type": "LongTextArea", "description": "JSON defining detailed tracking rules, filters, and data capture specifications" }
        ],
        "relationships": [
          { "target": "OmniProcess", "type": "lookup", "description": "Tracking definitions monitor user interactions within specific OmniScript processes" }
        ]
      }
    ],
    "metadata": []
  },

  "deployment": {
    "objects": [
      {
        "name": "OmniDataPack",
        "type": "standard",
        "domain": "deployment",
        "description": "Represents a bundled collection of OmniStudio components packaged for cross-org deployment and version control. DataPacks capture the complete definition of OmniScripts, FlexCards, Data Mappers, and their dependencies into a single transportable unit. They enable administrators to export configurations from a development org and import them into staging or production environments while preserving all inter-component references.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name identifying this DataPack bundle" },
          { "name": "Type", "type": "Picklist", "description": "The primary component type contained in this pack such as OmniScript, FlexCard, or DataRaptor" },
          { "name": "Status", "type": "Picklist", "description": "Deployment status such as Ready, Deployed, Error, or Superseded" },
          { "name": "DataPackData", "type": "LongTextArea", "description": "Serialized JSON containing the complete component definitions and dependency graph" },
          { "name": "Description", "type": "TextArea", "description": "Human-readable summary of what components this DataPack contains" },
          { "name": "SourceOrg", "type": "Text", "description": "Org identifier from which this DataPack was originally exported" },
          { "name": "Version", "type": "Text", "description": "Version label for tracking iterations of the same component bundle" }
        ],
        "relationships": [
          { "target": "OmniProcess", "type": "lookup", "description": "DataPacks reference OmniScript and Integration Procedure definitions they contain" },
          { "target": "OmniUiCard", "type": "lookup", "description": "DataPacks reference FlexCard definitions included in the bundle" },
          { "target": "OmniDataTransformation", "type": "lookup", "description": "DataPacks reference Data Mapper definitions included in the bundle" }
        ]
      }
    ],
    "metadata": []
  },

  "formulas": {
    "objects": [],
    "metadata": []
  },

  "lwc": {
    "objects": [],
    "metadata": []
  },

  "experience": {
    "objects": [],
    "metadata": []
  },

  "agentforce": {
    "objects": [],
    "metadata": []
  },

  "testing": {
    "objects": [],
    "metadata": []
  }

};
