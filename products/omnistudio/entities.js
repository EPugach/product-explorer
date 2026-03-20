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
        "description": "Stores OmniScript and Integration Procedure definitions. Both tool types share this single sObject, differentiated by the IsIntegrationProcedure flag. Each record represents a versioned process definition containing the full configuration for a guided flow or server-side procedure. The unique identifier for OmniScripts is Type + SubType + Language (which becomes the compiled LWC name), while Integration Procedures use Type + SubType joined by an underscore. Active versions are compiled into optimized bundles stored in OmniProcessCompilation records for runtime execution. Read access to this object is required for end users to view OmniStudio components.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name identifying this OmniScript or Integration Procedure. For OmniScripts, the name is separate from the Type/SubType/Language unique key" },
          { "name": "Type", "type": "Text", "description": "Primary classification grouping related processes together. For OmniScripts, must start with a letter and contain only alphanumeric characters without spaces or underscores. For Integration Procedures, can contain letters, numbers, and special characters but no spaces" },
          { "name": "SubType", "type": "Text", "description": "Secondary classification within the type. Combined with Type (and Language for OmniScripts), creates the unique identifier. Must be alphanumeric with no spaces or underscores for OmniScripts. Combined Type, SubType, and Language must not exceed 60 characters" },
          { "name": "Language", "type": "Text", "description": "Language code for the process definition. Standard values include English and Multi-Language. Multi-Language enables a single OmniScript to render in multiple languages using custom label translations. Requires Translation Workbench to be enabled" },
          { "name": "VersionNumber", "type": "Number", "description": "Numeric version identifier allowing multiple versions of the same process. Increments automatically when creating new versions. Only one version per Type/SubType/Language combination can be active at a time" },
          { "name": "IsActive", "type": "Checkbox", "description": "Controls whether this version is the active runtime version for its Type/SubType/Language combination. Setting to true triggers compilation and deactivates any previously active version. Must not be set to true during import operations" },
          { "name": "IsIntegrationProcedure", "type": "Checkbox", "description": "When true, this record is an Integration Procedure (server-side orchestration with no UI). When false, it is an OmniScript (guided user interface). Both types share the same object but have different designer experiences and capabilities" },
          { "name": "IsWebCompEnabled", "type": "Checkbox", "description": "Indicates the process is compiled as a Lightning Web Component for LWC runtime. On standard runtime with Managed Package Runtime disabled, this is the default compilation mode" },
          { "name": "RequiredPermission", "type": "Text", "description": "Custom permission API name required for a user to execute this process. When set, only users with this custom permission assigned through their profile or permission set can run the OmniScript or Integration Procedure" },
          { "name": "ResponseCacheType", "type": "Picklist", "description": "Caching strategy for Integration Procedure responses. Values include None (no caching), Session (user-specific cache, max 8 hours), and Org (shared cache, max 48 hours). Applies only to Integration Procedures. Minimum cache TTL is 5 minutes" },
          { "name": "PropertySetConfig", "type": "LongTextArea", "description": "JSON configuration blob storing all process-level settings including element definitions, styling options, navigation labels, save behavior, conditional logic, and custom properties. Creating a new version triggers a class that adds any missing JSON properties to this field" },
          { "name": "Description", "type": "TextArea", "description": "Human-readable description of the process purpose and behavior. Optional but recommended for documentation and searchability in the list view" },
          { "name": "CustomJavaScript", "type": "LongTextArea", "description": "Custom JavaScript code injected into the OmniScript runtime for advanced logic. Used for scenarios where declarative configuration is insufficient. Applies to OmniScripts only, not Integration Procedures" }
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
        "description": "Represents an individual element within an OmniScript or Integration Procedure, such as a step, input field, action element, or grouping block. Elements are arranged hierarchically with sequence numbers and levels to define the flow structure. Each element's behavior, validation rules, data mappings, conditional visibility, and styling are stored in its PropertySetConfig JSON. Read access to this object is required for end users to view OmniStudio components. Element types include Steps, Groups (Edit Block, Action Block, Radio Group), Inputs (18 types), Display elements, Functions, Actions, and embedded OmniScripts.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Unique element name used for data binding and merge field references within the process. The name becomes the JSON key in the OmniScript data model. Must be unique within its parent scope" },
          { "name": "Type", "type": "Picklist", "description": "Element type determining its behavior. Values include Step, Text, Number, Currency, Date, Time, Email, URL, Telephone, Password, TextArea, Select, Multi-Select, Lookup, Checkbox, Radio, Range, File, Image, Signature, Disclosure, Formula, Aggregate, Messaging, Text Block, DataRaptor Extract Action, DataRaptor Post Action, DataRaptor Transform Action, Integration Procedure Action, Remote Action, HTTP Action, Email Action, DocuSign Envelope Action, DocuSign Signature Action, Navigate Action, Set Values, Set Errors, Edit Block, Action Block, Custom LWC, and OmniScript" },
          { "name": "SequenceNumber", "type": "Number", "description": "Determines the order of this element within its parent step or block. Elements are processed sequentially by this number. Reordering in the designer updates these values automatically" },
          { "name": "Level", "type": "Number", "description": "Nesting depth of the element in the process hierarchy. Level 0 for top-level steps and actions placed directly on the canvas. Level 1 for elements within steps. Level 2 for elements nested within blocks inside steps. Increases with each nesting layer" },
          { "name": "Description", "type": "TextArea", "description": "Optional description of the element purpose for documentation. Visible to designers but not displayed to end users. Useful for explaining complex conditional logic or action configuration to other administrators" },
          { "name": "PropertySetConfig", "type": "LongTextArea", "description": "JSON configuration containing all element-specific settings including data source references, validation rules, conditional visibility expressions, default values, label text, help text, required status, error messages, styling options, and action parameters. The structure varies by element type" },
          { "name": "IsActive", "type": "Checkbox", "description": "Controls whether this element is included in the active process version. Inactive elements are preserved in the definition but excluded from compilation and runtime execution" },
          { "name": "EmbeddedOmniScriptKey", "type": "Text", "description": "Type/SubType/Language key referencing another OmniScript embedded within this element, for example accountCreateEnglish. Used when the element type is OmniScript to specify which child OmniScript to embed. The referenced OmniScript must be activated separately" }
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
        "description": "Stores the compiled and activated bundle for an OmniScript or Integration Procedure. When an admin activates a process version, the platform pre-compiles all element configurations, merge fields, and data mappings into a single optimized payload. This compiled form is loaded at runtime to avoid re-processing the element tree on every execution. With the standard designer and standard runtime, activation is instant and no separate LWC generation is needed. Read access to this object is required for end users to view compiled OmniStudio components.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Auto-generated name identifying the compilation record, typically derived from the parent OmniProcess Type and SubType" },
          { "name": "OmniProcessId", "type": "Lookup", "description": "Reference to the parent OmniProcess this compilation was generated from. Each activation creates a new compilation record linked to the specific version" },
          { "name": "Status", "type": "Picklist", "description": "Compilation lifecycle status. Active indicates this is the current runtime version. Superseded means a newer compilation replaced it. Error indicates the activation failed due to invalid element references or configuration issues" },
          { "name": "CompilationData", "type": "LongTextArea", "description": "The full compiled JSON payload containing all pre-processed element configurations, resolved merge fields, and validated data bindings. This payload is loaded directly by the runtime engine without additional processing" },
          { "name": "CompiledDate", "type": "DateTime", "description": "Timestamp when this compilation was generated. Useful for auditing when versions were activated and tracking deployment timelines" }
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
        "description": "Stores FlexCard definitions including layout configuration, data source bindings, state conditions, action settings, and custom CSS. FlexCards are reusable UI components that display contextual information from one or more data sources in a compact, branded card format. The unique identifier is the combination of Name and Author. Names can only contain letters, numbers, and underscores, must begin with a letter, and cannot use reserved words (Action, Flyout, FlyoutType, Data-element-label, Data-action-key, Tracking-obj, Parent-Mergefields). Read access is required for end users to view FlexCard components.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Unique name identifying this FlexCard definition. Combined with Author to form the unique identifier. Can only contain letters, numbers, and underscores. Must begin with a letter, cannot end with an underscore or contain two consecutive underscores. Cannot use reserved words" },
          { "name": "Author", "type": "Text", "description": "Name of the admin or developer who created this FlexCard. Combined with Name to form the unique identifier in the org. Follows the same character restrictions as Name" },
          { "name": "Description", "type": "TextArea", "description": "Human-readable description of the card purpose and the data it displays. Visible in the list view and designer for documentation purposes" },
          { "name": "IsActive", "type": "Checkbox", "description": "Controls whether this FlexCard version is available for use in Lightning pages, Experience Cloud sites, and OmniScript embeds. Only one version per Name/Author combination can be active at a time" },
          { "name": "VersionNumber", "type": "Number", "description": "Numeric version allowing multiple iterations of the same card definition. Recommended limit is 10 versions per FlexCard. Only the last modified version appears in the list view" },
          { "name": "PropertySetConfig", "type": "LongTextArea", "description": "JSON configuration storing the complete card definition including element layout (using a 12-column grid), styling rules, conditional visibility expressions, state definitions with their conditions, action configurations (OmniScript launch, navigation, flyout, set values, events), and responsive breakpoints for different device sizes" },
          { "name": "DataSourceConfig", "type": "LongTextArea", "description": "JSON defining the data sources that feed the card. Supported types include Integration Procedures (recommended for production), SOQL queries (for simple single-object scenarios), Apex class methods, REST API endpoints, and Streaming API sources (runtime only, not in standard designer). Each source maps response fields to card elements through data binding" },
          { "name": "ChildCardKeys", "type": "Text", "description": "Comma-separated keys referencing child FlexCards embedded within this parent card. Recommended limit is 7 child cards per parent. Each child receives the parent's data context through the Parent.attr variable. Supports 1 recursive FlexCard maximum" },
          { "name": "SampleDataSourceResponse", "type": "LongTextArea", "description": "Sample JSON response used in the FlexCard designer preview mode. Allows designers to preview the card layout with representative data without connecting to live data sources. Useful during initial design before Integration Procedures are built" }
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
        "description": "Defines a Data Mapper configuration for reading, writing, and transforming Salesforce data. Each Data Mapper specifies a type determining its behavior: Extract reads data via SOQL, Load writes data via DML, Transform reshapes JSON structures (including DocuSign template mapping), and Turbo Extract uses optimized read paths for large datasets. The standard designer creates Data Mappers up to 6 times faster than the managed package designer with simplified mapping functionality and visual connections between objects. Read access is required for end users. Data Mappers can be invoked from OmniScripts, Integration Procedures, Apex classes (via ConnectApi with up to 60% better performance), REST APIs, and Salesforce Flows.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name for this Data Mapper definition. Separate from the InterfaceName API identifier" },
          { "name": "InterfaceName", "type": "Text", "description": "Unique API identifier used to invoke this Data Mapper from Integration Procedures, OmniScripts, Apex, and REST APIs. Must be unique across the org. Can contain letters, numbers, and dashes but no spaces. This is the name referenced in action element configurations" },
          { "name": "Type", "type": "Picklist", "description": "Operation type determining behavior. Extract reads data via SOQL queries. Load writes data via DML insert or upsert operations. Transform reshapes JSON structures without database access (also supports DocuSign output type). Turbo Extract uses an optimized read path for high-volume data retrieval" },
          { "name": "IsActive", "type": "Checkbox", "description": "Controls whether this Data Mapper version is available for execution. Only one version per InterfaceName can be active at a time. Activation makes this version the live one referenced by calling components" },
          { "name": "Description", "type": "TextArea", "description": "Human-readable explanation of what data this mapper reads, writes, or transforms. Visible in the list view for documentation and searchability" },
          { "name": "OverrideKey", "type": "Text", "description": "Key allowing runtime selection between multiple implementations of the same interface. Enables A/B testing or environment-specific Data Mapper versions without changing the calling component configuration" },
          { "name": "PreviewOtherData", "type": "LongTextArea", "description": "Sample input JSON data used for previewing the transformation in the designer. Allows testing field mappings and formula expressions without connecting to live data sources or running actual queries" },
          { "name": "TargetOutputDocumentIdentifier", "type": "Text", "description": "DocuSign template ID for Transform Data Mappers with DocuSign output type. When set, the mapper fetches the template's field definitions and enables mapping from input JSON to DocuSign custom fields (Text, Radio Button, Checkbox tabs)" },
          { "name": "SynchronousProcessThreshold", "type": "Number", "description": "Record count threshold above which a Load Data Mapper switches to asynchronous batch Apex processing. When the bulkUpload parameter is true, records exceeding this threshold are processed in batch mode to avoid governor limits on large data loads" }
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
        "description": "A custom setting accessible from Setup that stores global configuration key-value pairs controlling OmniStudio runtime behavior across the organization. Administrators create records to toggle features, set default values, and customize platform behavior without deploying code. Key security settings (ApexClassCheck, EnforceDMFLSAndDataEncryption, EnableQueryWithFLS) were enabled by default starting February 2026. Other common settings include DocuSignAccountId, DocuSignNamedCredential, EnableLightningRTE, SkipUserProfileOnOSLoad, and RetainDesignerSettingOnUpgrade.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Record name for identifying this configuration entry. Often matches the Label field. Common values include ApexClassCheck, DocuSignAccountId, DocuSignNamedCredential, EnableLightningRTE, SkipUserProfileOnOSLoad, RetainDesignerSettingOnUpgrade, EnforceDMFLSAndDataEncryption, EnableQueryWithFLS" },
          { "name": "Key", "type": "Text", "description": "Configuration key used by the runtime engine to look up this setting. Auto-populated from the Name field. Used internally by OmniStudio components to query applicable configuration at execution time" },
          { "name": "Value", "type": "LongTextArea", "description": "The configuration value. For boolean toggles like ApexClassCheck, the value is the string true or false. For DocuSignAccountId, the value is the API Account ID from the DocuSign Apps and Keys page. For DocuSignNamedCredential, the value is the Salesforce Named Credential name (typically DocuSign)" },
          { "name": "Label", "type": "Text", "description": "Human-readable label displayed in the Omni Interaction Configuration list view in Setup. Typically matches the Name field. This is the value administrators see when browsing existing configuration records" },
          { "name": "Description", "type": "TextArea", "description": "Optional explanation of what this configuration controls and its valid values. Useful for documenting the purpose and expected behavior of each setting for other administrators" }
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
          { "name": "Type", "type": "Picklist", "description": "The primary component type contained in this pack such as OmniScript, FlexCard, or Data Mapper" },
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
