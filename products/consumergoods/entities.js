// ══════════════════════════════════════════════════════════════
//  Consumer Goods Cloud Entities — All Domains
//  cgcloud managed package namespace (cgcloud__*__c)
//
//  Dedup rule: each object appears in exactly ONE domain.
//  Objects shared across domains are placed in their primary domain.
//  Standard objects (no cgcloud__ prefix) use type: "standard".
//  Custom cgcloud__ objects use type: "custom".
// ══════════════════════════════════════════════════════════════

export default {

  // ═══════════════════════════════════════════════════
  //  RETAIL EXECUTION PILLAR
  // ═══════════════════════════════════════════════════

  // ─────────────────────────────────────────────────
  //  ACCOUNTS & STORES
  // ─────────────────────────────────────────────────

  accounts_stores: {
    objects: [
      {
        name: "Account",
        type: "standard",
        domain: "accounts_stores",
        description: "Stores information about retail business partners including retailers, distributors, wholesalers, and consumers. The main object in the Enhanced data model, linked directly to customer extensions, managers, contacts, and POS, and indirectly to assets, org units, and customer sets through junction objects.",
        fields: [
          { name: "Name", type: "Text", description: "Account name identifying the retail business partner" },
          { name: "Type", type: "Picklist", description: "Account classification such as Retailer, Distributor, Wholesaler, or Consumer" },
          { name: "BillingAddress", type: "Text", description: "Primary billing address compound field for payment processing" },
          { name: "ShippingAddress", type: "Text", description: "Primary shipping address compound field for delivery" },
          { name: "ParentId", type: "Lookup", description: "Parent account for store hierarchy relationships" },
          { name: "OwnerId", type: "Lookup", description: "User assigned as the account owner" }
        ],
        relationships: [
          { target: "RetailStore", type: "parent", description: "Accounts have one or more associated retail store locations" },
          { target: "cgcloud__Account_Extension__c", type: "parent", description: "Accounts are extended with classification, status, and pricing configuration" },
          { target: "cgcloud__Account_Trade_Org_Hierarchy__c", type: "parent", description: "Accounts participate in trade org hierarchies as parent or child" },
          { target: "Contact", type: "parent", description: "Accounts have primary and additional contacts" }
        ]
      },
      {
        name: "Contact",
        type: "standard",
        domain: "accounts_stores",
        description: "Holds details of the primary contact (store manager or buyers) associated with a retail store and additional contacts related to an account. Stores names, photos, and phone numbers for customer relationship management.",
        fields: [
          { name: "FirstName", type: "Text", description: "Contact first name" },
          { name: "LastName", type: "Text", description: "Contact last name" },
          { name: "Email", type: "Email", description: "Contact email address" },
          { name: "Phone", type: "Phone", description: "Contact phone number" },
          { name: "AccountId", type: "Lookup", description: "The account this contact is associated with" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each contact belongs to an account representing a retail business partner" }
        ]
      },
      {
        name: "RetailStore",
        type: "standard",
        domain: "accounts_stores",
        description: "Stores information about each physical store where products are stored and sold. Central to Retail Execution as the location where visits, assessments, and deliveries take place. Each retail store is associated with an account and can have in-store locations, operating hours, and KPI targets.",
        fields: [
          { name: "Name", type: "Text", description: "Store name for identification" },
          { name: "AccountId", type: "Lookup", description: "The account that owns this retail store" },
          { name: "RetailLocationGroupId", type: "Lookup", description: "Store group for clustering by size, region, or product placement" },
          { name: "OperatingHoursId", type: "Lookup", description: "Business hours and preferred visit hours for this store" },
          { name: "Latitude", type: "Number", description: "Geographic latitude for map visualization and geofencing" },
          { name: "Longitude", type: "Number", description: "Geographic longitude for map visualization and geofencing" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each retail store belongs to a business account" },
          { target: "InStoreLocation", type: "parent", description: "Stores contain multiple in-store locations like aisles and endcaps" },
          { target: "RetailLocationGroup", type: "child", description: "Stores can be grouped for shared management" },
          { target: "RetailStoreKpi", type: "parent", description: "KPI targets are defined for stores via store groups" }
        ]
      },
      {
        name: "InStoreLocation",
        type: "standard",
        domain: "accounts_stores",
        description: "Information about in-store locations such as aisles, endcaps, and checkout counters. Used for granular product placement tracking and KPI measurement at specific positions within a retail store.",
        fields: [
          { name: "Name", type: "Text", description: "Location name such as Aisle 5 or Checkout Counter 1" },
          { name: "RetailStoreId", type: "Lookup", description: "The retail store containing this location" },
          { name: "Category", type: "Picklist", description: "Category classification for product placement grouping" },
          { name: "Type", type: "Picklist", description: "Location type such as Aisle, Endcap, or Checkout Counter" }
        ],
        relationships: [
          { target: "RetailStore", type: "child", description: "Each in-store location belongs to a retail store" },
          { target: "StoreProduct", type: "parent", description: "Products can be associated with specific in-store locations" }
        ]
      },
      {
        name: "RetailLocationGroup",
        type: "standard",
        domain: "accounts_stores",
        description: "Groups retail stores into clusters based on aspects such as size, location, or part of a retail chain. Simplifies management by allowing shared KPI targets, assortments, and activities across stores with common features.",
        fields: [
          { name: "Name", type: "Text", description: "Group name such as Large Format or Urban Convenience" },
          { name: "Description", type: "TextArea", description: "Description of the group criteria" },
          { name: "Type", type: "Picklist", description: "Group classification type" }
        ],
        relationships: [
          { target: "RetailStore", type: "parent", description: "Groups contain multiple retail stores" },
          { target: "RetailStoreKpi", type: "parent", description: "KPI targets can be set at the store group level" }
        ]
      },
      {
        name: "OperatingHours",
        type: "standard",
        domain: "accounts_stores",
        description: "Stores information related to timezone and time slots for store business hours and preferred visit hours. Used to schedule visits within appropriate windows and validate visit timing against store availability.",
        fields: [
          { name: "Name", type: "Text", description: "Operating hours name such as Standard Business Hours" },
          { name: "TimeZone", type: "Picklist", description: "Timezone for the operating hours schedule" },
          { name: "Description", type: "TextArea", description: "Description of the operating hours configuration" }
        ],
        relationships: [
          { target: "RetailStore", type: "parent", description: "Operating hours are assigned to retail stores" },
          { target: "TimeSlot", type: "parent", description: "Operating hours contain multiple time slots for each day" }
        ]
      },
      {
        name: "Location",
        type: "standard",
        domain: "accounts_stores",
        description: "Represents geographic locations used for store positioning, map visualization, and geofencing validation during visit check-in and check-out. Integrates with Salesforce Maps for territory visualization.",
        fields: [
          { name: "Name", type: "Text", description: "Location name" },
          { name: "Latitude", type: "Number", description: "Geographic latitude coordinate" },
          { name: "Longitude", type: "Number", description: "Geographic longitude coordinate" },
          { name: "LocationType", type: "Picklist", description: "Type of location such as Store, Warehouse, or Office" }
        ],
        relationships: [
          { target: "RetailStore", type: "lookup", description: "Locations are associated with retail stores for geographic positioning" }
        ]
      },
      {
        name: "TimeSlot",
        type: "standard",
        domain: "accounts_stores",
        description: "Stores time information for each day of the week within an operating hours record. Defines business start and end times and marks nonworking days. Used to determine preferred visit windows for field reps.",
        fields: [
          { name: "DayOfWeek", type: "Picklist", description: "Day of the week this time slot applies to" },
          { name: "StartTime", type: "DateTime", description: "Business start time for the day" },
          { name: "EndTime", type: "DateTime", description: "Business end time for the day" },
          { name: "OperatingHoursId", type: "Lookup", description: "Parent operating hours record" }
        ],
        relationships: [
          { target: "OperatingHours", type: "child", description: "Each time slot belongs to an operating hours record" }
        ]
      },
      {
        name: "StoreProduct",
        type: "standard",
        domain: "accounts_stores",
        description: "Tracks all products that are sold at a store or eligible for sale at a store. Associates a product with a retail store or a specific in-store location for product placement and compliance monitoring.",
        fields: [
          { name: "RetailStoreId", type: "Lookup", description: "The retail store where the product is placed" },
          { name: "ProductId", type: "Lookup", description: "The product being tracked at this store" },
          { name: "InStoreLocationId", type: "Lookup", description: "Specific in-store location for the product" },
          { name: "IsActive", type: "Checkbox", description: "Whether the product is currently active at this store" }
        ],
        relationships: [
          { target: "RetailStore", type: "child", description: "Each store product record links to a retail store" },
          { target: "Product2", type: "child", description: "Each store product record references a product" },
          { target: "InStoreLocation", type: "child", description: "Products can be placed at specific in-store locations" }
        ]
      },
      {
        name: "Asset",
        type: "standard",
        domain: "accounts_stores",
        description: "Tracks valuable equipment placed at customer locations such as refrigerators, freezers, and display units. Manufacturers can regularly audit assets to evaluate their condition and raise customer tasks for repair or replacement.",
        fields: [
          { name: "Name", type: "Text", description: "Asset name or serial number" },
          { name: "AccountId", type: "Lookup", description: "Customer account where the asset is placed" },
          { name: "Status", type: "Picklist", description: "Current asset status such as Active, Needs Repair, or Replaced" },
          { name: "InstallDate", type: "Date", description: "Date the asset was installed at the customer location" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Assets are placed at customer account locations" },
          { target: "cgcloud__Asset_Audit__c", type: "parent", description: "Assets are audited during store visits" },
          { target: "cgcloud__Asset_Template__c", type: "child", description: "Assets are created from asset templates" }
        ]
      },
      {
        name: "cgcloud__Account_Extension__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Additional account information such as account classification, status, complex pricing configuration, and account roles. Customer extension details are used during retail execution workflows such as visits and promotions.",
        fields: [
          { name: "cgcloud__Account__c", type: "Lookup", description: "Parent account this extension belongs to" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization scoping this extension" },
          { name: "cgcloud__Status__c", type: "Picklist", description: "Customer status such as Active, Inactive, or Blocked" },
          { name: "cgcloud__Classification__c", type: "Picklist", description: "Customer classification for segmentation" },
          { name: "cgcloud__Account_Role__c", type: "Picklist", description: "Role of the account such as Orderer, Payer, or Ship-To" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each extension record belongs to an account" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Extensions are scoped to a sales organization" }
        ]
      },
      {
        name: "cgcloud__Account_Template__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Template defining reusable patterns for creating accounts with consistent settings. Templates standardize account creation across markets and ensure required fields, roles, and configurations are pre-populated.",
        fields: [
          { name: "Name", type: "Text", description: "Template name for identification" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales org this template belongs to" },
          { name: "cgcloud__Description__c", type: "TextArea", description: "Description of the template purpose" },
          { name: "cgcloud__Active__c", type: "Checkbox", description: "Whether this template is active for use" }
        ],
        relationships: [
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Templates are scoped to a sales organization" },
          { target: "Account", type: "lookup", description: "Accounts are created from templates" }
        ]
      },
      {
        name: "cgcloud__Account_Manager__c",
        type: "custom",
        domain: "accounts_stores",
        description: "User assignments for an account using org units. Customer managers handle order placement, visit creation, customer relationships, and team activities. Used to create account team members through the EffectiveAccountManagerSyncBatch process.",
        fields: [
          { name: "cgcloud__Account__c", type: "Lookup", description: "The account being managed" },
          { name: "cgcloud__Org_Unit__c", type: "Lookup", description: "Org unit through which the user manages this account" },
          { name: "cgcloud__User__c", type: "Lookup", description: "The user assigned as account manager" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Start date of the management assignment" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "End date of the management assignment" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each manager assignment links to an account" },
          { target: "cgcloud__Org_Unit__c", type: "child", description: "Manager assignments reference an org unit for territory-based access" }
        ]
      },
      {
        name: "cgcloud__Account_Receivable__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Customer information about invoices, debit notes, and credit notes. Tracks the financial relationship between the manufacturer and the customer for order payment reconciliation and credit management.",
        fields: [
          { name: "cgcloud__Account__c", type: "Lookup", description: "The customer account for this receivable" },
          { name: "cgcloud__Amount__c", type: "Currency", description: "Receivable amount" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Type such as Invoice, Debit Note, or Credit Note" },
          { name: "cgcloud__Due_Date__c", type: "Date", description: "Payment due date" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each receivable belongs to a customer account" }
        ]
      },
      {
        name: "cgcloud__Account_Trade_Org_Hierarchy__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Represents how various accounts under a parent customer account are organized and related to each other. Models retailer, distributor, and wholesaler hierarchies. Child accounts inherit retail activities from parent accounts. Relationships are time-dependent with defined validity periods.",
        fields: [
          { name: "cgcloud__Parent_Account__c", type: "Lookup", description: "Parent account in the hierarchy" },
          { name: "cgcloud__Child_Account__c", type: "Lookup", description: "Child account in the hierarchy" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Start date of the hierarchical relationship" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "End date of the hierarchical relationship" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization scoping this hierarchy" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Links parent and child accounts in a hierarchy" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Hierarchies are scoped to a sales organization" }
        ]
      },
      {
        name: "cgcloud__Account_Relationship__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Specifies the relationship between two customers such as Bill To, Delivery Recipient, Payee, Payer, or Wholesaler. A customer can have many relationships of the same type but only one primary relationship per type.",
        fields: [
          { name: "cgcloud__Account__c", type: "Lookup", description: "Source account in the relationship" },
          { name: "cgcloud__Related_Account__c", type: "Lookup", description: "Target account in the relationship" },
          { name: "cgcloud__Relationship_Type__c", type: "Picklist", description: "Type such as Bill To, Delivery Recipient, Payee, Payer, or Wholesaler" },
          { name: "cgcloud__Is_Primary__c", type: "Checkbox", description: "Whether this is the primary relationship of its type" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each relationship links two accounts" }
        ]
      },
      {
        name: "cgcloud__Sub_Account__c",
        type: "custom",
        domain: "accounts_stores",
        description: "A subset of accounts whose KPIs add to the parent account KPIs in the account plan. For example, volume for supermarkets or hypermarkets. Subaccounts are used primarily in account planning.",
        fields: [
          { name: "cgcloud__Account__c", type: "Lookup", description: "Parent account this sub-account rolls up to" },
          { name: "cgcloud__Sub_Account__c", type: "Lookup", description: "The sub-account record" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Sub-account type such as Supermarket or Hypermarket" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Sub-accounts belong to a parent account" }
        ]
      },
      {
        name: "cgcloud__Sales_Organization__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Business segments used to structure data and business processes by organizational unit. Enables multi-market management in a single Salesforce org. Segmentation can be based on geographical territories, product divisions, or account teams.",
        fields: [
          { name: "Name", type: "Text", description: "Sales organization name" },
          { name: "cgcloud__Description__c", type: "TextArea", description: "Description of the business segment" },
          { name: "cgcloud__Active__c", type: "Checkbox", description: "Whether this sales org is active" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Segmentation type such as Geographic, Product, or Account Team" }
        ],
        relationships: [
          { target: "cgcloud__Sales_Organization_User__c", type: "parent", description: "Users are assigned to sales organizations" },
          { target: "cgcloud__Account_Extension__c", type: "parent", description: "Account extensions are scoped to sales orgs" }
        ]
      },
      {
        name: "cgcloud__Sales_Organization_User__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Association between Sales Organization and User. A user mapped to a sales org can access data and work on business processes such as activities, visits, or orders in the Consumer Goods offline mobile app.",
        fields: [
          { name: "cgcloud__Sales_Organization__c", type: "Lookup", description: "The sales organization" },
          { name: "cgcloud__User__c", type: "Lookup", description: "The user assigned to this sales org" },
          { name: "cgcloud__Active__c", type: "Checkbox", description: "Whether this assignment is active" }
        ],
        relationships: [
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Each assignment links to a sales organization" }
        ]
      },
      {
        name: "cgcloud__Org_Unit__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Smallest units of an organization such as departments or branch offices. Controls customer data synchronization, regional sales folders, regional promotions through customer segmentation, and customer master access rights.",
        fields: [
          { name: "Name", type: "Text", description: "Org unit name such as NTO California" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization this org unit belongs to" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Org level type such as Sales or Service" },
          { name: "cgcloud__Active__c", type: "Checkbox", description: "Whether this org unit is active" }
        ],
        relationships: [
          { target: "cgcloud__Org_Unit_Hierarchy__c", type: "parent", description: "Org units participate in hierarchical structures" },
          { target: "cgcloud__Org_Unit_User__c", type: "parent", description: "Users are assigned to org units" },
          { target: "cgcloud__Account_Org_Unit__c", type: "parent", description: "Org units are linked to customer accounts" }
        ]
      },
      {
        name: "cgcloud__Org_Unit_Hierarchy__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Information on how an organization is internally organized and the relationships between org units. For example, NTO Bay Area Sales Org under NTO California Sales Org. Enables hierarchical territory management.",
        fields: [
          { name: "cgcloud__Parent_Org_Unit__c", type: "Lookup", description: "Parent org unit in the hierarchy" },
          { name: "cgcloud__Child_Org_Unit__c", type: "Lookup", description: "Child org unit in the hierarchy" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Start date of the hierarchical relationship" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "End date of the hierarchical relationship" }
        ],
        relationships: [
          { target: "cgcloud__Org_Unit__c", type: "child", description: "Links parent and child org units" }
        ]
      },
      {
        name: "cgcloud__Org_Unit_User__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Users such as sales reps or supervisors assigned to each org unit. Users can have different management relationships such as sales or service based on the management type set.",
        fields: [
          { name: "cgcloud__Org_Unit__c", type: "Lookup", description: "The org unit this user is assigned to" },
          { name: "cgcloud__User__c", type: "Lookup", description: "The assigned user" },
          { name: "cgcloud__Management_Type__c", type: "Picklist", description: "Management relationship type such as Sales, Service, or Admin" },
          { name: "cgcloud__Active__c", type: "Checkbox", description: "Whether this assignment is active" }
        ],
        relationships: [
          { target: "cgcloud__Org_Unit__c", type: "child", description: "Each user assignment links to an org unit" }
        ]
      },
      {
        name: "cgcloud__Account_Org_Unit__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Represents the relationship between customers and org units. The sales org of the customer and the org unit must be the same. Multiple org units can be added to a customer if validity periods or org unit types differ.",
        fields: [
          { name: "cgcloud__Account__c", type: "Lookup", description: "The customer account" },
          { name: "cgcloud__Org_Unit__c", type: "Lookup", description: "The org unit linked to this customer" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Start date of the relationship" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "End date of the relationship" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Links a customer account to an org unit" },
          { target: "cgcloud__Org_Unit__c", type: "child", description: "Links an org unit to a customer account" }
        ]
      },
      {
        name: "cgcloud__Account_Set__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Set of customers who perform similar tasks such as promotions, pricing, or activities. Can be created manually, via integration, or through segmentation rules. Used for targeting promotions and activities at groups of stores.",
        fields: [
          { name: "Name", type: "Text", description: "Customer set name" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization this set belongs to" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Set creation type: Manual, Integration, or Segmentation" }
        ],
        relationships: [
          { target: "cgcloud__Account_Set_Account__c", type: "parent", description: "Customer sets contain member accounts" },
          { target: "cgcloud__Account_Set_Manager__c", type: "parent", description: "Customer sets have assigned managers" },
          { target: "cgcloud__Segmentation_Rule__c", type: "parent", description: "Segmentation rules populate customer sets" }
        ]
      },
      {
        name: "cgcloud__Account_Set_Account__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Junction object that assigns a customer to a customer set. Enables group-level targeting for promotions, pricing, and activities.",
        fields: [
          { name: "cgcloud__Account_Set__c", type: "Lookup", description: "The customer set" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "The customer account added to the set" }
        ],
        relationships: [
          { target: "cgcloud__Account_Set__c", type: "child", description: "Membership in a customer set" },
          { target: "Account", type: "child", description: "The account that is a member of the set" }
        ]
      },
      {
        name: "cgcloud__Account_Set_Manager__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Association between a customer set and a user. Used for sharing rules for promotions and for assigning a user to manage a customer set.",
        fields: [
          { name: "cgcloud__Account_Set__c", type: "Lookup", description: "The customer set being managed" },
          { name: "cgcloud__User__c", type: "Lookup", description: "The user assigned as set manager" }
        ],
        relationships: [
          { target: "cgcloud__Account_Set__c", type: "child", description: "Each manager assignment links to a customer set" }
        ]
      },
      {
        name: "cgcloud__Segmentation_Rule__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Associates a Segmentation Rule Definition and Account with a Customer Set. Required to dynamically create customer sets based on SOQL filter criteria.",
        fields: [
          { name: "cgcloud__Account_Set__c", type: "Lookup", description: "Target customer set to populate" },
          { name: "cgcloud__Segmentation_Rule_Def__c", type: "Lookup", description: "The rule definition containing the filter criteria" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "Account context for the rule" }
        ],
        relationships: [
          { target: "cgcloud__Account_Set__c", type: "child", description: "Rules populate customer sets" },
          { target: "cgcloud__Segmentation_Rule_Def__c", type: "child", description: "Rules reference a definition with SOQL criteria" }
        ]
      },
      {
        name: "cgcloud__Segmentation_Rule_Def__c",
        type: "custom",
        domain: "accounts_stores",
        description: "SOQL query with filter criteria to create customer sets. Defines whether accounts are filtered based on the account or org unit hierarchy.",
        fields: [
          { name: "Name", type: "Text", description: "Rule definition name" },
          { name: "cgcloud__Filter_Type__c", type: "Picklist", description: "Whether to filter by Account or Org Unit Hierarchy" },
          { name: "cgcloud__SOQL_Query__c", type: "LongTextArea", description: "The SOQL query defining the filter criteria" }
        ],
        relationships: [
          { target: "cgcloud__Segmentation_Rule_Def_Column__c", type: "parent", description: "Definitions contain column specifications" },
          { target: "cgcloud__Segmentation_Rule__c", type: "parent", description: "Definitions are used by segmentation rules" }
        ]
      },
      {
        name: "cgcloud__Segmentation_Rule_Def_Column__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Defines fields and their attributes such as Field Type, Field Default, and Field Default Digits in the Segmentation Rule Definition. Specifies columns available for filtering in customer set segmentation.",
        fields: [
          { name: "cgcloud__Segmentation_Rule_Def__c", type: "Lookup", description: "Parent rule definition" },
          { name: "cgcloud__Field_Name__c", type: "Text", description: "API name of the field to filter on" },
          { name: "cgcloud__Field_Type__c", type: "Picklist", description: "Data type of the field" }
        ],
        relationships: [
          { target: "cgcloud__Segmentation_Rule_Def__c", type: "child", description: "Each column belongs to a rule definition" }
        ]
      },
      {
        name: "cgcloud__Asset_Audit__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Information about the condition of an asset at the customer location. Sales reps verify the asset condition during store visits and can raise a customer task for repair or replacement.",
        fields: [
          { name: "cgcloud__Asset__c", type: "Lookup", description: "The asset being audited" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "Customer account where the asset is located" },
          { name: "cgcloud__Status__c", type: "Picklist", description: "Audit result status such as OK, Needs Repair, or Replace" },
          { name: "cgcloud__Audit_Date__c", type: "Date", description: "Date the audit was performed" }
        ],
        relationships: [
          { target: "Asset", type: "child", description: "Each audit record belongs to an asset" },
          { target: "Account", type: "child", description: "Audits reference the customer location" }
        ]
      },
      {
        name: "cgcloud__Asset_Template__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Characteristics required to create an asset of a specific type. For example, single doors, multiple doors, or mini-fridges are templates for asset-type refrigerators.",
        fields: [
          { name: "Name", type: "Text", description: "Template name such as Single Door Fridge or Display Kiosk" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Asset category type" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization for this template" }
        ],
        relationships: [
          { target: "Asset", type: "parent", description: "Templates define characteristics for creating assets" }
        ]
      },
      {
        name: "cgcloud__POS__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Location within the retail store other than the primary shelf where users place products for promotion or to increase sales. Examples include shelf, sales counter, freezer, or vending machine.",
        fields: [
          { name: "Name", type: "Text", description: "POS display name" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "Customer account where the POS is located" },
          { name: "cgcloud__POS_Template__c", type: "Lookup", description: "Template defining the POS type" },
          { name: "cgcloud__Status__c", type: "Picklist", description: "Current POS status" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "POS displays are placed at customer locations" },
          { target: "cgcloud__POS_Template__c", type: "child", description: "POS records are created from templates" }
        ]
      },
      {
        name: "cgcloud__POS_Template__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Template that creates and defines the type of Point of Sale. Examples include premium beverages or snack shelves.",
        fields: [
          { name: "Name", type: "Text", description: "Template name such as Premium Beverages or Snack Shelves" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "POS category type" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization for this template" }
        ],
        relationships: [
          { target: "cgcloud__POS__c", type: "parent", description: "Templates define characteristics for POS records" }
        ]
      },
      {
        name: "cgcloud__Account_Task__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Customer-specific tasks such as repair, replacement, or service for an asset created during asset audits. Tracks follow-up actions needed at customer locations.",
        fields: [
          { name: "cgcloud__Account__c", type: "Lookup", description: "Customer account the task is for" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Task type such as Complaint, Service, or Repair" },
          { name: "cgcloud__Status__c", type: "Picklist", description: "Task status such as Open, In Progress, or Completed" },
          { name: "cgcloud__Due_Date__c", type: "Date", description: "Due date for task completion" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each task belongs to a customer account" },
          { target: "cgcloud__Account_Task_Template__c", type: "child", description: "Tasks are created from templates" }
        ]
      },
      {
        name: "cgcloud__Account_Task_Template__c",
        type: "custom",
        domain: "accounts_stores",
        description: "Template to create various types of customer tasks such as complaint or service. Defines the task type and default values for standardized customer task creation.",
        fields: [
          { name: "Name", type: "Text", description: "Template name" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Task type this template creates" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization for this template" }
        ],
        relationships: [
          { target: "cgcloud__Account_Task__c", type: "parent", description: "Templates define characteristics for customer tasks" }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────
  //  PRODUCTS & ASSORTMENTS
  // ─────────────────────────────────────────────────

  products_assortments: {
    objects: [
      {
        name: "Product2",
        type: "standard",
        domain: "products_assortments",
        description: "Each product record constitutes a stock-keeping unit (SKU) or sellable unit. Products have related information such as product parts, conditions, units of measure, product managers, and warehouses.",
        fields: [
          { name: "Name", type: "Text", description: "Product name" },
          { name: "ProductCode", type: "Text", description: "Unique product code or SKU" },
          { name: "IsActive", type: "Checkbox", description: "Whether the product is active for sale" },
          { name: "Family", type: "Picklist", description: "Product family for categorization" },
          { name: "Description", type: "TextArea", description: "Product description" }
        ],
        relationships: [
          { target: "cgcloud__Product_Template__c", type: "child", description: "Products are created from product templates" },
          { target: "cgcloud__Product_Hierarchy__c", type: "parent", description: "Products participate in product hierarchies" },
          { target: "AssortmentProduct", type: "parent", description: "Products are included in assortments" }
        ]
      },
      {
        name: "Assortment",
        type: "standard",
        domain: "products_assortments",
        description: "Products grouped for a specific purpose such as eligibility for sale in a specific store. One assortment can have products from various categories.",
        fields: [
          { name: "Name", type: "Text", description: "Assortment name" },
          { name: "Description", type: "TextArea", description: "Description of the assortment purpose" },
          { name: "StartDate", type: "Date", description: "Validity start date" },
          { name: "EndDate", type: "Date", description: "Validity end date" }
        ],
        relationships: [
          { target: "AssortmentProduct", type: "parent", description: "Assortments contain assortment products" },
          { target: "StoreAssortment", type: "parent", description: "Assortments are assigned to stores" }
        ]
      },
      {
        name: "AssortmentProduct",
        type: "standard",
        domain: "products_assortments",
        description: "Products part of an assortment based on their saleability. Products are grouped by validity period. Top-selling products can be marked as favorites.",
        fields: [
          { name: "AssortmentId", type: "Lookup", description: "Parent assortment" },
          { name: "ProductId", type: "Lookup", description: "The product included in this assortment" },
          { name: "IsActive", type: "Checkbox", description: "Whether this product is active in the assortment" }
        ],
        relationships: [
          { target: "Assortment", type: "child", description: "Each assortment product belongs to an assortment" },
          { target: "Product2", type: "child", description: "Each assortment product references a product" }
        ]
      },
      {
        name: "StoreAssortment",
        type: "standard",
        domain: "products_assortments",
        description: "Association of an assortment to an account, trade organization, or store. Child accounts inherit the assortment list of the parent in the trade org hierarchy.",
        fields: [
          { name: "AssortmentId", type: "Lookup", description: "The assortment being assigned" },
          { name: "AccountId", type: "Lookup", description: "Account or trade org this assortment is assigned to" }
        ],
        relationships: [
          { target: "Assortment", type: "child", description: "Links an assortment to a store or account" },
          { target: "Account", type: "child", description: "Assortments are assigned to accounts" }
        ]
      },
      {
        name: "Promotion",
        type: "standard",
        domain: "products_assortments",
        description: "Standard Salesforce promotional activities that are either part of a campaign or targeted promotions at retail stores. Used in the base model for simple promotion tracking.",
        fields: [
          { name: "Name", type: "Text", description: "Promotion name" },
          { name: "StartDate", type: "Date", description: "Promotion start date" },
          { name: "EndDate", type: "Date", description: "Promotion end date" },
          { name: "Status", type: "Picklist", description: "Promotion status" }
        ],
        relationships: [
          { target: "Account", type: "lookup", description: "Promotions can target specific accounts" }
        ]
      },
      {
        name: "PriceBook2",
        type: "standard",
        domain: "products_assortments",
        description: "Stores information on the price of a product through price book entries. Each product is tied to a price book record that stores its list price.",
        fields: [
          { name: "Name", type: "Text", description: "Price book name" },
          { name: "IsActive", type: "Checkbox", description: "Whether this price book is active" },
          { name: "IsStandard", type: "Checkbox", description: "Whether this is the standard price book" }
        ],
        relationships: [
          { target: "Product2", type: "lookup", description: "Price books contain price entries for products" }
        ]
      },
      {
        name: "cgcloud__Product_Template__c",
        type: "custom",
        domain: "products_assortments",
        description: "Template to create products with similar characteristics. Products are grouped by the sales org assigned to the product template.",
        fields: [
          { name: "Name", type: "Text", description: "Template name" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization this template belongs to" },
          { name: "cgcloud__Active__c", type: "Checkbox", description: "Whether this template is active" }
        ],
        relationships: [
          { target: "Product2", type: "parent", description: "Products are created from this template" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Templates are scoped to a sales org" }
        ]
      },
      {
        name: "cgcloud__Product_Hierarchy__c",
        type: "custom",
        domain: "products_assortments",
        description: "Represents how a manufacturer's products are organized. Creates relationships between product groups or between a product group and products. Defines child and parent products by category, brand, and flavor.",
        fields: [
          { name: "cgcloud__Parent__c", type: "Lookup", description: "Parent product or group in the hierarchy" },
          { name: "cgcloud__Child__c", type: "Lookup", description: "Child product or group in the hierarchy" },
          { name: "cgcloud__Level__c", type: "Picklist", description: "Hierarchy level such as Category, Brand, or SKU" }
        ],
        relationships: [
          { target: "Product2", type: "child", description: "Hierarchy nodes reference products" }
        ]
      },
      {
        name: "cgcloud__Product_Part__c",
        type: "custom",
        domain: "products_assortments",
        description: "Holds details of the bill-of-material relationship between two products. Describes the number of child products under a parent product. The result is a single composite product.",
        fields: [
          { name: "cgcloud__Parent_Product__c", type: "Lookup", description: "Parent product in the BOM" },
          { name: "cgcloud__Child_Product__c", type: "Lookup", description: "Child product in the BOM" },
          { name: "cgcloud__Quantity__c", type: "Number", description: "Quantity of child products in the parent" }
        ],
        relationships: [
          { target: "Product2", type: "child", description: "Links parent and child products" }
        ]
      },
      {
        name: "cgcloud__Unit_of_Measure__c",
        type: "custom",
        domain: "products_assortments",
        description: "Unit of measure for each product used to calculate product quantities during order taking. Supports flexible quantity measurement for different product types.",
        fields: [
          { name: "Name", type: "Text", description: "Unit name such as Case, Each, or Pallet" },
          { name: "cgcloud__Product__c", type: "Lookup", description: "Product this unit applies to" },
          { name: "cgcloud__Conversion_Factor__c", type: "Number", description: "Conversion factor relative to base unit" },
          { name: "cgcloud__Is_Base__c", type: "Checkbox", description: "Whether this is the base unit of measure" }
        ],
        relationships: [
          { target: "Product2", type: "child", description: "Each unit of measure belongs to a product" }
        ]
      },
      {
        name: "cgcloud__Product_Category_Share__c",
        type: "custom",
        domain: "products_assortments",
        description: "A product's active product manager who can plan promotions. Associates users with product categories for promotion planning responsibility.",
        fields: [
          { name: "cgcloud__Product__c", type: "Lookup", description: "Product or product category" },
          { name: "cgcloud__User__c", type: "Lookup", description: "Product manager user" },
          { name: "cgcloud__Active__c", type: "Checkbox", description: "Whether this assignment is active" }
        ],
        relationships: [
          { target: "Product2", type: "child", description: "Associates a product manager with a product" }
        ]
      },
      {
        name: "cgcloud__Product_Assortment_Template__c",
        type: "custom",
        domain: "products_assortments",
        description: "Template to create a product assortment. Product assortments are grouped by the sales org assigned to the template.",
        fields: [
          { name: "Name", type: "Text", description: "Template name" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization for this template" },
          { name: "cgcloud__Active__c", type: "Checkbox", description: "Whether this template is active" }
        ],
        relationships: [
          { target: "Assortment", type: "parent", description: "Assortments are created from templates" }
        ]
      },
      {
        name: "cgcloud__Product_Listing_Module__c",
        type: "custom",
        domain: "products_assortments",
        description: "Filters products based on product categories and module definitions of the store. Differentiates between store formats from a trade org chain.",
        fields: [
          { name: "cgcloud__Assortment__c", type: "Lookup", description: "Parent product assortment" },
          { name: "cgcloud__Listing_Module__c", type: "Lookup", description: "The listing module definition" },
          { name: "cgcloud__Product__c", type: "Lookup", description: "Product filtered by this module" }
        ],
        relationships: [
          { target: "cgcloud__Listing_Module__c", type: "child", description: "References a listing module definition" },
          { target: "Product2", type: "child", description: "Filters specific products within assortments" }
        ]
      },
      {
        name: "cgcloud__Listing_Module__c",
        type: "custom",
        domain: "products_assortments",
        description: "Defines listing module types such as Small, Medium, Large, X-Large, Kiosk, or Gas Station. Filters products by category during order-taking to match store formats.",
        fields: [
          { name: "Name", type: "Text", description: "Module name such as Small, Large, Kiosk, or Gas Station" },
          { name: "cgcloud__Description__c", type: "TextArea", description: "Description of the module format" }
        ],
        relationships: [
          { target: "cgcloud__Product_Listing_Module__c", type: "parent", description: "Listing modules are used in product listing module records" }
        ]
      },
      {
        name: "cgcloud__Product_Assortment_Product_Share__c",
        type: "custom",
        domain: "products_assortments",
        description: "Association of product categories with a product assortment. Used to assign product categories to an assortment.",
        fields: [
          { name: "cgcloud__Assortment__c", type: "Lookup", description: "Parent product assortment" },
          { name: "cgcloud__Product_Category__c", type: "Lookup", description: "Product category being shared" }
        ],
        relationships: [
          { target: "Assortment", type: "child", description: "Links product categories to assortments" }
        ]
      },
      {
        name: "cgcloud__Product_Assortment_Store__c",
        type: "custom",
        domain: "products_assortments",
        description: "Store assignments to a valid product assortment done via a batch process representing the listing finding.",
        fields: [
          { name: "cgcloud__Assortment__c", type: "Lookup", description: "The product assortment" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "The store account assigned" }
        ],
        relationships: [
          { target: "Assortment", type: "child", description: "Links stores to assortments" },
          { target: "Account", type: "child", description: "Store accounts assigned to assortments" }
        ]
      },
      {
        name: "cgcloud__Promotion__c",
        type: "custom",
        domain: "products_assortments",
        description: "Advanced sellable promotions representing agreements between a manufacturer and customer to increase revenue through temporary price reductions, coupons, or in-store displays. Created from promotion templates by KAMs.",
        fields: [
          { name: "Name", type: "Text", description: "Promotion name" },
          { name: "cgcloud__Promotion_Template__c", type: "Lookup", description: "Template used to create this promotion" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "Target customer account" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Promotion start date" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "Promotion end date" },
          { name: "cgcloud__Status__c", type: "Picklist", description: "Promotion lifecycle status" }
        ],
        relationships: [
          { target: "cgcloud__Promotion_Template__c", type: "child", description: "Promotions are created from templates" },
          { target: "Account", type: "child", description: "Promotions target customer accounts" },
          { target: "cgcloud__Tactic__c", type: "parent", description: "Promotions contain tactics" }
        ]
      },
      {
        name: "cgcloud__Promotion_Template__c",
        type: "custom",
        domain: "products_assortments",
        description: "Determines the type of promotion a KAM creates. Business admins create templates that KAMs use to create multiple promotions.",
        fields: [
          { name: "Name", type: "Text", description: "Template name" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization for this template" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Promotion type such as TPR, Coupon, or Display" }
        ],
        relationships: [
          { target: "cgcloud__Promotion__c", type: "parent", description: "Templates create promotions" },
          { target: "cgcloud__Promotion_Template_Tactic_Template__c", type: "parent", description: "Templates define available tactic types" }
        ]
      },
      {
        name: "cgcloud__Promotion_Template_Hierarchy__c",
        type: "custom",
        domain: "products_assortments",
        description: "Template to create promotion hierarchies for extending or pushing promotions at different levels in customer hierarchies.",
        fields: [
          { name: "cgcloud__Parent_Template__c", type: "Lookup", description: "Parent promotion template" },
          { name: "cgcloud__Child_Template__c", type: "Lookup", description: "Child promotion template" }
        ],
        relationships: [
          { target: "cgcloud__Promotion_Template__c", type: "child", description: "Links parent and child promotion templates" }
        ]
      },
      {
        name: "cgcloud__Tactic__c",
        type: "custom",
        domain: "products_assortments",
        description: "Lowest level of task to perform as a step in running a promotion. Controls promotion behavior at the execution level with associated tactic products.",
        fields: [
          { name: "cgcloud__Promotion__c", type: "Lookup", description: "Parent promotion" },
          { name: "cgcloud__Tactic_Template__c", type: "Lookup", description: "Template defining tactic behavior" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Tactic validity start" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "Tactic validity end" }
        ],
        relationships: [
          { target: "cgcloud__Promotion__c", type: "child", description: "Each tactic belongs to a promotion" },
          { target: "cgcloud__Tactic_Product__c", type: "parent", description: "Tactics have associated products" }
        ]
      },
      {
        name: "cgcloud__Tactic_Product__c",
        type: "custom",
        domain: "products_assortments",
        description: "Products of a promotion at a tactic level with details such as quantities and hurdle classification.",
        fields: [
          { name: "cgcloud__Tactic__c", type: "Lookup", description: "Parent tactic" },
          { name: "cgcloud__Product__c", type: "Lookup", description: "Product included in this tactic" },
          { name: "cgcloud__Quantity__c", type: "Number", description: "Target quantity for this product" }
        ],
        relationships: [
          { target: "cgcloud__Tactic__c", type: "child", description: "Each tactic product belongs to a tactic" },
          { target: "Product2", type: "child", description: "References a product from the catalog" }
        ]
      },
      {
        name: "cgcloud__Tactic_Template__c",
        type: "custom",
        domain: "products_assortments",
        description: "Template to create a tactic. Controls promotion behavior. Templates define the tactic type and default settings.",
        fields: [
          { name: "Name", type: "Text", description: "Template name" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Tactic type" }
        ],
        relationships: [
          { target: "cgcloud__Tactic__c", type: "parent", description: "Templates create tactics" }
        ]
      },
      {
        name: "cgcloud__Promotion_Push_Status__c",
        type: "custom",
        domain: "products_assortments",
        description: "Status and statistics for each push process for promotions. Tracks how promotions cascade through customer hierarchies.",
        fields: [
          { name: "cgcloud__Promotion__c", type: "Lookup", description: "Promotion being pushed" },
          { name: "cgcloud__Status__c", type: "Picklist", description: "Push status such as Pending, In Progress, or Complete" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "Target account for the push" }
        ],
        relationships: [
          { target: "cgcloud__Promotion__c", type: "child", description: "Push status belongs to a promotion" }
        ]
      },
      {
        name: "cgcloud__Promotion_Template_Tactic_Template__c",
        type: "custom",
        domain: "products_assortments",
        description: "Association between Promotion Template and Tactic Template. Defines which tactic types are available for a promotion template.",
        fields: [
          { name: "cgcloud__Promotion_Template__c", type: "Lookup", description: "Parent promotion template" },
          { name: "cgcloud__Tactic_Template__c", type: "Lookup", description: "Available tactic template" }
        ],
        relationships: [
          { target: "cgcloud__Promotion_Template__c", type: "child", description: "Links to a promotion template" },
          { target: "cgcloud__Tactic_Template__c", type: "child", description: "Links to a tactic template" }
        ]
      },
      {
        name: "cgcloud__Promotion_Hurdle__c",
        type: "custom",
        domain: "products_assortments",
        description: "Parameters evaluated to assign a reward to a sellable promotion. Hurdles define criteria that must be met before rewards are applied.",
        fields: [
          { name: "cgcloud__Promotion__c", type: "Lookup", description: "Parent promotion" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Hurdle evaluation type" },
          { name: "cgcloud__Threshold__c", type: "Number", description: "Minimum threshold to clear the hurdle" }
        ],
        relationships: [
          { target: "cgcloud__Promotion__c", type: "child", description: "Each hurdle belongs to a promotion" },
          { target: "cgcloud__Promotion_Hurdle_Expression__c", type: "parent", description: "Hurdles contain evaluation expressions" }
        ]
      },
      {
        name: "cgcloud__Promotion_Hurdle_Expression__c",
        type: "custom",
        domain: "products_assortments",
        description: "Defines the evaluation criteria for applying rewards to a sellable promotion. Expressions specify the logic for hurdle condition evaluation.",
        fields: [
          { name: "cgcloud__Promotion_Hurdle__c", type: "Lookup", description: "Parent hurdle" },
          { name: "cgcloud__Operator__c", type: "Picklist", description: "Comparison operator" },
          { name: "cgcloud__Value__c", type: "Text", description: "Comparison value" }
        ],
        relationships: [
          { target: "cgcloud__Promotion_Hurdle__c", type: "child", description: "Each expression belongs to a hurdle" }
        ]
      },
      {
        name: "cgcloud__Promotion_Reward_Group__c",
        type: "custom",
        domain: "products_assortments",
        description: "A group of rewards assigned to a sellable promotion. Rewards are assigned based on the results of promotion hurdles and expressions.",
        fields: [
          { name: "cgcloud__Promotion__c", type: "Lookup", description: "Parent promotion" },
          { name: "cgcloud__Name__c", type: "Text", description: "Reward group name" }
        ],
        relationships: [
          { target: "cgcloud__Promotion__c", type: "child", description: "Each reward group belongs to a promotion" },
          { target: "cgcloud__Promotion_Reward__c", type: "parent", description: "Reward groups contain individual rewards" }
        ]
      },
      {
        name: "cgcloud__Promotion_Reward__c",
        type: "custom",
        domain: "products_assortments",
        description: "Details of rewards applicable for a reward group. Rewards are determined based on promotion hurdle and expression results.",
        fields: [
          { name: "cgcloud__Reward_Group__c", type: "Lookup", description: "Parent reward group" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Reward type such as Discount or Free Item" },
          { name: "cgcloud__Value__c", type: "Number", description: "Reward value or discount amount" }
        ],
        relationships: [
          { target: "cgcloud__Promotion_Reward_Group__c", type: "child", description: "Each reward belongs to a reward group" },
          { target: "cgcloud__Promotion_Reward_Product__c", type: "parent", description: "Rewards can have associated products" }
        ]
      },
      {
        name: "cgcloud__Promotion_Reward_Product__c",
        type: "custom",
        domain: "products_assortments",
        description: "Products assigned to a promotion reward for product-specific discounts or free items.",
        fields: [
          { name: "cgcloud__Promotion_Reward__c", type: "Lookup", description: "Parent reward" },
          { name: "cgcloud__Product__c", type: "Lookup", description: "Rewarded product" }
        ],
        relationships: [
          { target: "cgcloud__Promotion_Reward__c", type: "child", description: "Each reward product belongs to a reward" },
          { target: "Product2", type: "child", description: "References a product from the catalog" }
        ]
      },
      {
        name: "cgcloud__Sales_Folder__c",
        type: "custom",
        domain: "products_assortments",
        description: "Details of a sales folder used to manage and publish content supporting sales reps during pitches. Can be linked to a customer or org unit.",
        fields: [
          { name: "Name", type: "Text", description: "Sales folder name" },
          { name: "cgcloud__Sales_Folder_Template__c", type: "Lookup", description: "Template used to create this folder" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "Customer account linked to this folder" }
        ],
        relationships: [
          { target: "cgcloud__Sales_Folder_Template__c", type: "child", description: "Folders are created from templates" },
          { target: "cgcloud__Sales_Folder_Sell_Sheet__c", type: "parent", description: "Folders contain sell sheets" },
          { target: "cgcloud__Promotion_Sales_Folder__c", type: "parent", description: "Folders can be linked to promotions" }
        ]
      },
      {
        name: "cgcloud__Sales_Folder_Template__c",
        type: "custom",
        domain: "products_assortments",
        description: "Template to create a sales folder. Defines structure and defaults for sales folder creation across markets.",
        fields: [
          { name: "Name", type: "Text", description: "Template name" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization for this template" }
        ],
        relationships: [
          { target: "cgcloud__Sales_Folder__c", type: "parent", description: "Templates create sales folders" }
        ]
      },
      {
        name: "cgcloud__Sales_Folder_Sell_Sheet__c",
        type: "custom",
        domain: "products_assortments",
        description: "Association between Sales Folder and Sell Sheet. Links sell sheets with promotional content to sales folders.",
        fields: [
          { name: "cgcloud__Sales_Folder__c", type: "Lookup", description: "Parent sales folder" },
          { name: "cgcloud__Sell_Sheet__c", type: "Lookup", description: "Sell sheet with content" }
        ],
        relationships: [
          { target: "cgcloud__Sales_Folder__c", type: "child", description: "Links a sell sheet to a sales folder" },
          { target: "cgcloud__Sell_Sheet__c", type: "child", description: "References a sell sheet" }
        ]
      },
      {
        name: "cgcloud__Sell_Sheet__c",
        type: "custom",
        domain: "products_assortments",
        description: "Groups attachments in sales folders. For example, one sell sheet for Halloween videos, one for Christmas pictures, and another for 4th of July videos.",
        fields: [
          { name: "Name", type: "Text", description: "Sell sheet name such as Halloween Promo or Christmas Display" },
          { name: "cgcloud__Description__c", type: "TextArea", description: "Description of the content group" }
        ],
        relationships: [
          { target: "cgcloud__Sales_Folder_Sell_Sheet__c", type: "parent", description: "Sell sheets are linked to folders through junctions" }
        ]
      },
      {
        name: "cgcloud__Promotion_Sales_Folder__c",
        type: "custom",
        domain: "products_assortments",
        description: "Association between Promotion and Sales Folder. Links sales folders with promotions for field rep content access.",
        fields: [
          { name: "cgcloud__Promotion__c", type: "Lookup", description: "The promotion being supported" },
          { name: "cgcloud__Sales_Folder__c", type: "Lookup", description: "The sales folder with content" }
        ],
        relationships: [
          { target: "cgcloud__Promotion__c", type: "child", description: "Links to a promotion" },
          { target: "cgcloud__Sales_Folder__c", type: "child", description: "Links to a sales folder" }
        ]
      },
      {
        name: "cgcloud__Product_Condition__c",
        type: "custom",
        domain: "products_assortments",
        description: "Conditions that determine a product's price for orders. Supports multiple conditions per product based on price type, price list type, and value.",
        fields: [
          { name: "cgcloud__Product__c", type: "Lookup", description: "Product this condition applies to" },
          { name: "cgcloud__Condition_Template__c", type: "Lookup", description: "Template defining condition behavior" },
          { name: "cgcloud__Value__c", type: "Currency", description: "Price or discount value" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Condition validity start date" }
        ],
        relationships: [
          { target: "Product2", type: "child", description: "Each condition applies to a product" },
          { target: "cgcloud__Condition_Template__c", type: "child", description: "Conditions are defined by templates" }
        ]
      },
      {
        name: "cgcloud__Account_Condition__c",
        type: "custom",
        domain: "products_assortments",
        description: "Customer reference conditions for an account such as consumer price or percentage discount. Can be imported from ERP systems.",
        fields: [
          { name: "cgcloud__Account__c", type: "Lookup", description: "Customer account" },
          { name: "cgcloud__Condition_Template__c", type: "Lookup", description: "Template defining condition behavior" },
          { name: "cgcloud__Value__c", type: "Currency", description: "Condition value" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each condition belongs to a customer account" },
          { target: "cgcloud__Condition_Template__c", type: "child", description: "Conditions reference a template" }
        ]
      },
      {
        name: "cgcloud__Account_Specific_Product_Condition__c",
        type: "custom",
        domain: "products_assortments",
        description: "Product-specific condition for an account such as fixed discounts on customer sets and products. Enables per-account product pricing.",
        fields: [
          { name: "cgcloud__Account__c", type: "Lookup", description: "Customer account" },
          { name: "cgcloud__Product__c", type: "Lookup", description: "Product this condition applies to" },
          { name: "cgcloud__Value__c", type: "Currency", description: "Condition value" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Condition is specific to an account" },
          { target: "Product2", type: "child", description: "Condition is specific to a product" }
        ]
      },
      {
        name: "cgcloud__Condition_Template__c",
        type: "custom",
        domain: "products_assortments",
        description: "Defines the behavior of conditions with reference to customers or products. Based on reference type, creates customer, product, or customer-specific product conditions.",
        fields: [
          { name: "Name", type: "Text", description: "Template name" },
          { name: "cgcloud__Reference_Type__c", type: "Picklist", description: "Type: Customer, Product, or Customer-Product" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization" }
        ],
        relationships: [
          { target: "cgcloud__Product_Condition__c", type: "parent", description: "Templates define product conditions" },
          { target: "cgcloud__Account_Condition__c", type: "parent", description: "Templates define customer conditions" }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────
  //  VISIT PLANNING
  // ─────────────────────────────────────────────────

  visit_planning: {
    objects: [
      {
        name: "Visit",
        type: "standard",
        domain: "visit_planning",
        description: "Tracks information related to a field rep's visit to a retail store. Can be a standard scheduled visit or an ad-hoc visit. Visits are the core operational unit of Retail Execution.",
        fields: [
          { name: "AccountId", type: "Lookup", description: "Customer account being visited" },
          { name: "PlannedVisitStartTime", type: "DateTime", description: "Scheduled start time" },
          { name: "PlannedVisitEndTime", type: "DateTime", description: "Scheduled end time" },
          { name: "ActualVisitStartTime", type: "DateTime", description: "Actual start time at check-in" },
          { name: "Status", type: "Picklist", description: "Visit status such as Planned, In Progress, Completed, or Abandoned" },
          { name: "VisitorId", type: "Lookup", description: "The field rep performing the visit" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each visit is for a specific customer account" },
          { target: "AssessmentTask", type: "parent", description: "Visits contain assessment tasks to execute" },
          { target: "cgcloud__Visit_Template__c", type: "child", description: "Advanced visits are created from templates" }
        ]
      },
      {
        name: "ActionPlanTemplate",
        type: "standard",
        domain: "visit_planning",
        description: "Reusable framework for scheduling visits with a constant set of activities. Bundles assessment task definitions and delivery tasks into a repeatable visit blueprint.",
        fields: [
          { name: "Name", type: "Text", description: "Action plan template name" },
          { name: "Description", type: "TextArea", description: "Template description" },
          { name: "IsActive", type: "Checkbox", description: "Whether this template is active" }
        ],
        relationships: [
          { target: "StoreActionPlanTemplate", type: "parent", description: "Action plan templates are associated with stores" },
          { target: "AssessmentTaskDefinition", type: "parent", description: "Templates bundle assessment task definitions" }
        ]
      },
      {
        name: "StoreActionPlanTemplate",
        type: "standard",
        domain: "visit_planning",
        description: "Association of an action plan template with a retail store. Controls which activities are available for visits at specific stores.",
        fields: [
          { name: "ActionPlanTemplateId", type: "Lookup", description: "The action plan template" },
          { name: "RetailStoreId", type: "Lookup", description: "The retail store" }
        ],
        relationships: [
          { target: "ActionPlanTemplate", type: "child", description: "Links an action plan template to a store" },
          { target: "RetailStore", type: "child", description: "Links a store to an action plan template" }
        ]
      },
      {
        name: "cgcloud__Visit_Template__c",
        type: "custom",
        domain: "visit_planning",
        description: "Template to create customer visit types such as sales visit, training, delivery visit, or phone call. Configures GPS tracking, geofencing, visit duration, and available activities.",
        fields: [
          { name: "Name", type: "Text", description: "Visit type name" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization" },
          { name: "cgcloud__GPS_Tracking__c", type: "Checkbox", description: "Whether GPS tracking is enabled" },
          { name: "cgcloud__Geofencing__c", type: "Checkbox", description: "Whether geofencing validation is required" },
          { name: "cgcloud__Duration_Default__c", type: "Number", description: "Default visit duration in minutes" }
        ],
        relationships: [
          { target: "Visit", type: "parent", description: "Advanced visits are created from templates" },
          { target: "cgcloud__Job_List__c", type: "parent", description: "Job lists associate activities with visit templates" }
        ]
      },
      {
        name: "cgcloud__Account_Visit_Setting__c",
        type: "custom",
        domain: "visit_planning",
        description: "Account configuration settings for automated visit planning. Stores visit frequency, preferred days, and time windows for each customer.",
        fields: [
          { name: "cgcloud__Account__c", type: "Lookup", description: "Customer account" },
          { name: "cgcloud__Visit_Template__c", type: "Lookup", description: "Visit type to create" },
          { name: "cgcloud__Frequency__c", type: "Picklist", description: "Visit frequency such as Weekly or Monthly" },
          { name: "cgcloud__Preferred_Day__c", type: "Picklist", description: "Preferred day of the week" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Visit settings belong to a customer account" },
          { target: "cgcloud__Visit_Template__c", type: "child", description: "Settings reference a visit template" }
        ]
      },
      {
        name: "cgcloud__Job_Definition_List__c",
        type: "custom",
        domain: "visit_planning",
        description: "List of questions and surveys to answer during a visit. Activities can be standard (ongoing) or event-driven (linked to a promotion).",
        fields: [
          { name: "Name", type: "Text", description: "Activity name" },
          { name: "cgcloud__Job_Definition_List_Template__c", type: "Lookup", description: "Template used to create this activity" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Standard or Event-Driven" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Activity validity start" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "Activity validity end" }
        ],
        relationships: [
          { target: "cgcloud__Job_Definition_List_Template__c", type: "child", description: "Activities are created from templates" },
          { target: "cgcloud__Job_List__c", type: "parent", description: "Activities are associated with visit templates via job lists" }
        ]
      },
      {
        name: "cgcloud__Job_Definition_List_Template__c",
        type: "custom",
        domain: "visit_planning",
        description: "Template to create an activity for a visit. Indicates whether activities are standard or event-driven and contains a pre-configured list of job definition templates.",
        fields: [
          { name: "Name", type: "Text", description: "Activity template name" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Standard or Event-Driven" }
        ],
        relationships: [
          { target: "cgcloud__Job_Definition_List__c", type: "parent", description: "Templates create activities" },
          { target: "cgcloud__Job_Definition_Template__c", type: "parent", description: "Templates contain job definition templates" }
        ]
      },
      {
        name: "cgcloud__Job_Definition_Template__c",
        type: "custom",
        domain: "visit_planning",
        description: "Information gathered for a store or products configured as jobs. Jobs can be questions (store-related) or surveys (product-related).",
        fields: [
          { name: "Name", type: "Text", description: "Job definition template name" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Question or Survey type" },
          { name: "cgcloud__Data_Type__c", type: "Lookup", description: "Answer format data type" },
          { name: "cgcloud__Product_Reference__c", type: "Checkbox", description: "Whether this is a survey (product) vs question (store)" }
        ],
        relationships: [
          { target: "cgcloud__Data_Type__c", type: "child", description: "References a data type for answer format" },
          { target: "cgcloud__Job_Definition_List_Template__c", type: "child", description: "Job definitions belong to activity templates" }
        ]
      },
      {
        name: "cgcloud__Job_Template__c",
        type: "custom",
        domain: "visit_planning",
        description: "Template defining behavior and visibility of activities in the offline mobile app. Determines whether an activity is a question or survey.",
        fields: [
          { name: "Name", type: "Text", description: "Job template name" },
          { name: "cgcloud__Product_Reference__c", type: "Checkbox", description: "Product surveys vs store questions" },
          { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization" }
        ],
        relationships: [
          { target: "cgcloud__Job_Definition_Template__c", type: "lookup", description: "Job templates control behavior of job definition templates" }
        ]
      },
      {
        name: "cgcloud__Job_List__c",
        type: "custom",
        domain: "visit_planning",
        description: "Associates an activity with a visit template for a particular customer. Created mainly for event-driven activities.",
        fields: [
          { name: "cgcloud__Job_Definition_List__c", type: "Lookup", description: "The activity" },
          { name: "cgcloud__Visit_Template__c", type: "Lookup", description: "The visit template" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "The customer account" }
        ],
        relationships: [
          { target: "cgcloud__Job_Definition_List__c", type: "child", description: "Links an activity to a visit-customer combo" },
          { target: "cgcloud__Visit_Template__c", type: "child", description: "Links to a visit template" }
        ]
      },
      {
        name: "cgcloud__Data_Type__c",
        type: "custom",
        domain: "visit_planning",
        description: "Specifies the answer format for activity questions: Decimal, String, Toggle, or Date. Controls data capture and validation during visits.",
        fields: [
          { name: "Name", type: "Text", description: "Data type name" },
          { name: "cgcloud__Type__c", type: "Picklist", description: "Data type such as Decimal, String, Toggle, or Date" }
        ],
        relationships: [
          { target: "cgcloud__Job_Definition_Template__c", type: "parent", description: "Data types are used by job definition templates" }
        ]
      },
      {
        name: "cgcloud__Historic_Product__c",
        type: "custom",
        domain: "visit_planning",
        description: "Association between an account and a product. Stores products added during surveys for quick retrieval in future visits.",
        fields: [
          { name: "cgcloud__Account__c", type: "Lookup", description: "Customer account" },
          { name: "cgcloud__Product__c", type: "Lookup", description: "Previously surveyed product" },
          { name: "cgcloud__Last_Used__c", type: "DateTime", description: "Last time this product was surveyed" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Historic products belong to an account" },
          { target: "Product2", type: "child", description: "References a product" }
        ]
      },
      {
        name: "cgcloud__Substitution__c",
        type: "custom",
        domain: "visit_planning",
        description: "Manages planned and unplanned absence of sales reps. Assigns substitute reps to customers for specific periods. One substitute can cover multiple customers.",
        fields: [
          { name: "cgcloud__User__c", type: "Lookup", description: "Original user being substituted" },
          { name: "cgcloud__Substitute_User__c", type: "Lookup", description: "Substitute user" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "Customer account" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Substitution start" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "Substitution end" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Customer substitutions reference an account" }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────
  //  VISIT EXECUTION
  // ─────────────────────────────────────────────────

  visit_execution: {
    objects: [
      { name: "AssessmentIndicatorDefinition", type: "standard", domain: "visit_execution", description: "Stores KPI metrics. The key attribute is the data type (numerical, decimal, text, date-time, or boolean). KPIs are building blocks for assessment tasks and compliance.", fields: [{ name: "Name", type: "Text", description: "KPI name" }, { name: "DataType", type: "Picklist", description: "Data type" }], relationships: [{ target: "AssessmentTaskIndDefinition", type: "parent", description: "Indicators link to task definitions" }, { target: "RetailStoreKpi", type: "parent", description: "Indicators define KPI targets" }] },
      { name: "AssessmentTask", type: "standard", domain: "visit_execution", description: "The actual activity a field rep performs during a store visit. Records observation results against assessment indicator definitions.", fields: [{ name: "VisitId", type: "Lookup", description: "Visit during which this task is performed" }, { name: "AssessmentTaskDefinitionId", type: "Lookup", description: "Definition of the task" }, { name: "Status", type: "Picklist", description: "Task completion status" }], relationships: [{ target: "Visit", type: "child", description: "Each task belongs to a visit" }, { target: "AssessmentTaskDefinition", type: "child", description: "Tasks are based on definitions" }] },
      { name: "AssessmentTaskDefinition", type: "standard", domain: "visit_execution", description: "Each retail activity defined by a sales manager. Stores name, description, category, and type of task.", fields: [{ name: "Name", type: "Text", description: "Task definition name" }, { name: "Category", type: "Picklist", description: "Task category" }, { name: "Type", type: "Picklist", description: "Task type" }], relationships: [{ target: "AssessmentTask", type: "parent", description: "Definitions create assessment tasks" }, { target: "AssessmentTaskIndDefinition", type: "parent", description: "Definitions link to indicators" }] },
      { name: "AssessmentTaskIndDefinition", type: "standard", domain: "visit_execution", description: "Association of assessment task and assessment indicator definition. Links KPI metrics to specific task definitions.", fields: [{ name: "AssessmentTaskDefinitionId", type: "Lookup", description: "Task definition" }, { name: "AssessmentIndDefinitionId", type: "Lookup", description: "Indicator definition" }], relationships: [{ target: "AssessmentTaskDefinition", type: "child", description: "Links to a task definition" }, { target: "AssessmentIndicatorDefinition", type: "child", description: "Links to an indicator" }] },
      { name: "RetailStoreKpi", type: "standard", domain: "visit_execution", description: "Defines key metrics for products, categories, promotions, and assets in retail stores. Associates store groups with indicators and defines compliance targets.", fields: [{ name: "RetailStoreId", type: "Lookup", description: "Retail store or store group" }, { name: "AssessmentIndDefinitionId", type: "Lookup", description: "Indicator being measured" }, { name: "TargetValue", type: "Number", description: "Expected compliance target" }], relationships: [{ target: "RetailStore", type: "child", description: "KPIs are set for stores" }, { target: "AssessmentIndicatorDefinition", type: "child", description: "KPIs reference indicators" }] },
      { name: "RetailVisitKpi", type: "standard", domain: "visit_execution", description: "Stores actual values captured during a visit against defined KPI targets. Enables compliance scoring.", fields: [{ name: "VisitId", type: "Lookup", description: "Visit during which the value was captured" }, { name: "RetailStoreKpiId", type: "Lookup", description: "KPI target being measured" }, { name: "ActualValue", type: "Number", description: "Actual observed value" }], relationships: [{ target: "Visit", type: "child", description: "Each visit KPI belongs to a visit" }, { target: "RetailStoreKpi", type: "child", description: "Measured against store KPI targets" }] },
      { name: "AssessmentTaskContentDocument", type: "standard", domain: "visit_execution", description: "Junction object associating content documents to visits, tasks, promotions, or planograms.", fields: [{ name: "AssessmentTaskId", type: "Lookup", description: "Assessment task" }, { name: "ContentDocumentId", type: "Lookup", description: "Content document" }], relationships: [{ target: "AssessmentTask", type: "child", description: "Documents attach to tasks" }] },
      { name: "AssessmentTaskOrder", type: "standard", domain: "visit_execution", description: "An order activity that a sales rep performs during a visit. Links order-taking to the assessment task framework.", fields: [{ name: "AssessmentTaskId", type: "Lookup", description: "Assessment task" }, { name: "VisitId", type: "Lookup", description: "Visit" }], relationships: [{ target: "AssessmentTask", type: "child", description: "Links to assessment tasks" }, { target: "Visit", type: "child", description: "Orders during visits" }] },
      { name: "DeliveryTask", type: "standard", domain: "visit_execution", description: "Delivery tasks in an action plan template. Associated with shipments to define products for delivery during visits.", fields: [{ name: "ActionPlanTemplateId", type: "Lookup", description: "Action plan template" }, { name: "ShipmentId", type: "Lookup", description: "Associated shipment" }, { name: "Status", type: "Picklist", description: "Delivery task status" }], relationships: [{ target: "ActionPlanTemplate", type: "child", description: "Tasks belong to action plan templates" }, { target: "Shipment", type: "child", description: "Tasks reference shipments" }] },
      { name: "cgcloud__Visit_Job__c", type: "custom", domain: "visit_execution", description: "Responses to questions or surveys captured during visit execution. Records data against job definition templates.", fields: [{ name: "cgcloud__Visit__c", type: "Lookup", description: "Visit" }, { name: "cgcloud__Job_Definition_Template__c", type: "Lookup", description: "Question or survey template" }, { name: "cgcloud__Value__c", type: "Text", description: "Response value" }, { name: "cgcloud__Product__c", type: "Lookup", description: "Product for surveys" }], relationships: [{ target: "Visit", type: "child", description: "Each visit job belongs to a visit" }, { target: "cgcloud__Job_Definition_Template__c", type: "child", description: "Responses reference the template" }] },
      { name: "cgcloud__Order__c", type: "custom", domain: "visit_execution", description: "Header details of an advanced order with references to visit, customer, order type, and delivery date. Supports pre-orders, returns, van sales orders, and advertising material orders.", fields: [{ name: "cgcloud__Visit__c", type: "Lookup", description: "Visit" }, { name: "cgcloud__Account__c", type: "Lookup", description: "Customer account" }, { name: "cgcloud__Order_Template__c", type: "Lookup", description: "Order template" }, { name: "cgcloud__Delivery_Date__c", type: "Date", description: "Expected delivery date" }, { name: "cgcloud__Status__c", type: "Picklist", description: "Order status" }, { name: "cgcloud__Total_Amount__c", type: "Currency", description: "Total order amount" }], relationships: [{ target: "Visit", type: "child", description: "Orders placed during visits" }, { target: "Account", type: "child", description: "Orders belong to accounts" }, { target: "cgcloud__Order_Item__c", type: "parent", description: "Orders contain items" }, { target: "cgcloud__Order_Template__c", type: "child", description: "Orders from templates" }] },
      { name: "cgcloud__Order_Item__c", type: "custom", domain: "visit_execution", description: "Order line item with quantities, unit of measure, promotion, and pricing for products.", fields: [{ name: "cgcloud__Order__c", type: "Lookup", description: "Parent order" }, { name: "cgcloud__Product__c", type: "Lookup", description: "Product" }, { name: "cgcloud__Quantity__c", type: "Number", description: "Ordered quantity" }, { name: "cgcloud__Net_Amount__c", type: "Currency", description: "Net amount after pricing" }], relationships: [{ target: "cgcloud__Order__c", type: "child", description: "Each item belongs to an order" }, { target: "Product2", type: "child", description: "Items reference products" }] },
      { name: "cgcloud__Order_Template__c", type: "custom", domain: "visit_execution", description: "Predefined templates for orders: standard, return, and advertising material. Specifies basic order characteristics.", fields: [{ name: "Name", type: "Text", description: "Template name" }, { name: "cgcloud__Type__c", type: "Picklist", description: "Order type" }, { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization" }], relationships: [{ target: "cgcloud__Order__c", type: "parent", description: "Templates create orders" }, { target: "cgcloud__Order_Item_Template__c", type: "parent", description: "Templates define item types" }] },
      { name: "cgcloud__Order_Item_Template__c", type: "custom", domain: "visit_execution", description: "Template defining order item behavior. Examples: standard, return, or free items.", fields: [{ name: "Name", type: "Text", description: "Item template name" }, { name: "cgcloud__Type__c", type: "Picklist", description: "Item type" }], relationships: [{ target: "cgcloud__Order_Template__c", type: "child", description: "Item templates belong to order templates" }] },
      { name: "cgcloud__User_Document__c", type: "custom", domain: "visit_execution", description: "Daily report tracking time for activities done by a sales rep for the day.", fields: [{ name: "cgcloud__User__c", type: "Lookup", description: "Sales rep" }, { name: "cgcloud__Date__c", type: "Date", description: "Report date" }, { name: "cgcloud__User_Document_Template__c", type: "Lookup", description: "Template" }, { name: "cgcloud__Status__c", type: "Picklist", description: "Report status" }], relationships: [{ target: "cgcloud__User_Document_Activity__c", type: "parent", description: "Reports contain activity entries" }, { target: "cgcloud__User_Document_Template__c", type: "child", description: "Reports from templates" }] },
      { name: "cgcloud__User_Document_Activity__c", type: "custom", domain: "visit_execution", description: "Activities against which the sales rep logs time in a daily report.", fields: [{ name: "cgcloud__User_Document__c", type: "Lookup", description: "Parent report" }, { name: "cgcloud__Activity_Type__c", type: "Picklist", description: "Activity type" }, { name: "cgcloud__Duration__c", type: "Number", description: "Time in minutes" }], relationships: [{ target: "cgcloud__User_Document__c", type: "child", description: "Each entry belongs to a report" }] },
      { name: "cgcloud__User_Document_Template__c", type: "custom", domain: "visit_execution", description: "Template to create daily reports with workflow, platform, and max duration configuration.", fields: [{ name: "Name", type: "Text", description: "Template name" }, { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization" }, { name: "cgcloud__Max_Duration__c", type: "Number", description: "Max activity duration" }], relationships: [{ target: "cgcloud__User_Document__c", type: "parent", description: "Templates create reports" }] },
      { name: "cgcloud__Signature__c", type: "custom", domain: "visit_execution", description: "Signature with attributes such as signatory name, order, tour, and user. Associates with signature templates and flow steps.", fields: [{ name: "cgcloud__Signature_Template__c", type: "Lookup", description: "Signature template" }, { name: "cgcloud__Signature_Flow_Step__c", type: "Lookup", description: "Flow step" }, { name: "cgcloud__User__c", type: "Lookup", description: "Capturing user" }, { name: "cgcloud__Order__c", type: "Lookup", description: "Associated order" }], relationships: [{ target: "cgcloud__Signature_Template__c", type: "child", description: "Signatures follow templates" }, { target: "cgcloud__Order__c", type: "child", description: "Signatures for orders" }] },
      { name: "cgcloud__Signature_Template__c", type: "custom", domain: "visit_execution", description: "Template defining signature characteristics such as description, location, attribute set, and sales org.", fields: [{ name: "Name", type: "Text", description: "Template name" }, { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization" }], relationships: [{ target: "cgcloud__Signature__c", type: "parent", description: "Templates create signatures" }, { target: "cgcloud__Signature_Flow_Step__c", type: "parent", description: "Templates define the flow" }] },
      { name: "cgcloud__Signature_Flow_Step__c", type: "custom", domain: "visit_execution", description: "Sequence of required signatures associated with a signature template. Defines ordered steps such as customer then driver.", fields: [{ name: "cgcloud__Signature_Template__c", type: "Lookup", description: "Parent template" }, { name: "cgcloud__Step_Number__c", type: "Number", description: "Step sequence" }, { name: "cgcloud__Role__c", type: "Picklist", description: "Required role" }], relationships: [{ target: "cgcloud__Signature_Template__c", type: "child", description: "Each step belongs to a template" }] },
      { name: "cgcloud__Signature_Attribute__c", type: "custom", domain: "visit_execution", description: "Attribute and value for a signature such as Name, Customer ID, and Amount shown during order-taking.", fields: [{ name: "cgcloud__Signature__c", type: "Lookup", description: "Parent signature" }, { name: "cgcloud__Attribute_Name__c", type: "Text", description: "Attribute name" }, { name: "cgcloud__Attribute_Value__c", type: "Text", description: "Attribute value" }], relationships: [{ target: "cgcloud__Signature__c", type: "child", description: "Each attribute belongs to a signature" }] },
      { name: "cgcloud__Workflow__c", type: "custom", domain: "visit_execution", description: "Reusable workflow definitions for Customer Tasks, Daily Reports, Job Definition Lists, and Order Promotions. Drives status transitions and validation.", fields: [{ name: "Name", type: "Text", description: "Workflow name" }, { name: "cgcloud__Type__c", type: "Picklist", description: "Business process type" }, { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization" }], relationships: [{ target: "cgcloud__Order__c", type: "lookup", description: "Workflows automate order lifecycle" }] },

      { name: "cgcloud__Field_Sales_Activity__c", type: "custom", domain: "visit_execution", description: "An event or promotion to perform an activity to promote a product. Contains multiple job definition lists mapped to customers and visit templates.", fields: [{ name: "Name", type: "Text", description: "Activity name" }, { name: "cgcloud__Promotion__c", type: "Lookup", description: "Associated promotion" }, { name: "cgcloud__Valid_From__c", type: "Date", description: "Validity start" }], relationships: [{ target: "cgcloud__Promotion__c", type: "child", description: "Activities link to promotions" }, { target: "cgcloud__Job_Definition_List__c", type: "parent", description: "Activities contain job definition lists" }] },
      { name: "cgcloud__System_Number__c", type: "custom", domain: "visit_execution", description: "Defines the structure of order or invoice numbers. Creates and assigns new numbers for each order.", fields: [{ name: "Name", type: "Text", description: "System number name" }, { name: "cgcloud__Prefix__c", type: "Text", description: "Number prefix" }, { name: "cgcloud__Length__c", type: "Number", description: "Total number length" }], relationships: [{ target: "cgcloud__Order__c", type: "lookup", description: "System numbers generate identifiers" }] },
      { name: "cgcloud__Approval_Code__c", type: "custom", domain: "visit_execution", description: "Approval codes for DSD to authenticate critical transactions such as inventory check-out or cash check-in.", fields: [{ name: "cgcloud__User__c", type: "Lookup", description: "User" }, { name: "cgcloud__Code__c", type: "Text", description: "Approval code" }, { name: "cgcloud__Valid_From__c", type: "Date", description: "Validity start" }], relationships: [{ target: "cgcloud__Tour__c", type: "lookup", description: "Codes used during tour operations" }] }
    ]
  },

  // ─────────────────────────────────────────────────
  //  VAN SALES & DSD
  // ─────────────────────────────────────────────────

  van_sales: {
    objects: [
      { name: "Shipment", type: "standard", domain: "van_sales", description: "Represents the transport of inventory. Tracks shipments from warehouses to customer locations.", fields: [{ name: "ShipmentNumber", type: "AutoNumber", description: "Unique shipment identifier" }, { name: "Status", type: "Picklist", description: "Shipment status" }, { name: "ExpectedDeliveryDate", type: "Date", description: "Expected delivery date" }], relationships: [{ target: "DeliveryTask", type: "parent", description: "Shipments link to delivery tasks" }, { target: "ProductTransfer", type: "parent", description: "Shipments contain product transfers" }] },
      { name: "ProductTransfer", type: "standard", domain: "van_sales", description: "Represents inventory transfer between locations. Tracks product movement for DSD operations.", fields: [{ name: "ProductId", type: "Lookup", description: "Product" }, { name: "QuantitySent", type: "Number", description: "Quantity transferred" }, { name: "SourceLocationId", type: "Lookup", description: "Source location" }, { name: "DestinationLocationId", type: "Lookup", description: "Destination location" }], relationships: [{ target: "Product2", type: "child", description: "Transfers reference products" }, { target: "Shipment", type: "child", description: "Transfers are part of shipments" }] },
      { name: "ProductItem", type: "standard", domain: "van_sales", description: "Inventory assigned to a location. For van sales, this is a moving location (vehicle). Tracks quantity on hand.", fields: [{ name: "ProductId", type: "Lookup", description: "The product" }, { name: "LocationId", type: "Lookup", description: "Location (vehicle or warehouse)" }, { name: "QuantityOnHand", type: "Number", description: "Current quantity" }], relationships: [{ target: "Product2", type: "child", description: "Items reference products" }, { target: "Location", type: "child", description: "Items at locations" }] },
      { name: "cgcloud__Route__c", type: "custom", domain: "van_sales", description: "Defines delivery, sales, or merchandising trip patterns with warehouse, default user, and vehicle assignments. Customers are in a specific sequence.", fields: [{ name: "Name", type: "Text", description: "Route name" }, { name: "cgcloud__Route_Template__c", type: "Lookup", description: "Route template" }, { name: "cgcloud__Warehouse__c", type: "Lookup", description: "Starting warehouse" }, { name: "cgcloud__Default_User__c", type: "Lookup", description: "Default driver" }, { name: "cgcloud__Vehicle__c", type: "Lookup", description: "Assigned vehicle" }], relationships: [{ target: "cgcloud__Route_Account__c", type: "parent", description: "Routes contain customer stops" }, { target: "cgcloud__Tour__c", type: "parent", description: "Tours from routes" }, { target: "cgcloud__Warehouse__c", type: "child", description: "Routes start from warehouses" }] },
      { name: "cgcloud__Route_Account__c", type: "custom", domain: "van_sales", description: "Association between Route and Account. Specifies ordered customer stops with visit types.", fields: [{ name: "cgcloud__Route__c", type: "Lookup", description: "Parent route" }, { name: "cgcloud__Account__c", type: "Lookup", description: "Customer account" }, { name: "cgcloud__Sequence__c", type: "Number", description: "Stop order" }, { name: "cgcloud__Visit_Template__c", type: "Lookup", description: "Visit type for this stop" }], relationships: [{ target: "cgcloud__Route__c", type: "child", description: "Each stop belongs to a route" }, { target: "Account", type: "child", description: "Each stop targets an account" }] },
      { name: "cgcloud__Route_Template__c", type: "custom", domain: "van_sales", description: "Template to set up route types for different markets.", fields: [{ name: "Name", type: "Text", description: "Template name" }, { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization" }, { name: "cgcloud__Type__c", type: "Picklist", description: "Route type" }], relationships: [{ target: "cgcloud__Route__c", type: "parent", description: "Templates create routes" }] },
      { name: "cgcloud__Tour__c", type: "custom", domain: "van_sales", description: "Tour details including date, notes, vehicle, and route. Created from a route or independently. Represents a single day's trip.", fields: [{ name: "cgcloud__Route__c", type: "Lookup", description: "Source route" }, { name: "cgcloud__Tour_Template__c", type: "Lookup", description: "Tour template" }, { name: "cgcloud__Date__c", type: "Date", description: "Tour date" }, { name: "cgcloud__Vehicle__c", type: "Lookup", description: "Assigned vehicle" }, { name: "cgcloud__User__c", type: "Lookup", description: "Driver" }, { name: "cgcloud__Status__c", type: "Picklist", description: "Tour status" }], relationships: [{ target: "cgcloud__Route__c", type: "child", description: "Tours can be from routes" }, { target: "cgcloud__Tour_Template__c", type: "child", description: "Tours follow templates" }, { target: "Visit", type: "parent", description: "Tours contain visits" }] },
      { name: "cgcloud__Tour_Template__c", type: "custom", domain: "van_sales", description: "Template to create tours with sales org, start/end day guidance, vehicle check settings, and signature flow.", fields: [{ name: "Name", type: "Text", description: "Template name" }, { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization" }, { name: "cgcloud__Vehicle_Check_Required__c", type: "Checkbox", description: "Vehicle checks required" }], relationships: [{ target: "cgcloud__Tour__c", type: "parent", description: "Templates create tours" }, { target: "cgcloud__Tour_Template_Tour_Check__c", type: "parent", description: "Templates define tour checks" }, { target: "cgcloud__Tour_Template_Object_Reference__c", type: "parent", description: "Templates reference objects" }] },
      { name: "cgcloud__Tour_Check__c", type: "custom", domain: "van_sales", description: "Security checks during a tour such as brakes, headlights, work gloves, and safety jacket.", fields: [{ name: "Name", type: "Text", description: "Check name" }, { name: "cgcloud__Type__c", type: "Picklist", description: "Check type" }, { name: "cgcloud__Required__c", type: "Checkbox", description: "Whether mandatory" }], relationships: [{ target: "cgcloud__Tour_Template_Tour_Check__c", type: "parent", description: "Checks linked to templates through junctions" }] },
      { name: "cgcloud__Tour_Template_Tour_Check__c", type: "custom", domain: "van_sales", description: "Junction between tour template and tour check. Defines which checks are relevant for a template.", fields: [{ name: "cgcloud__Tour_Template__c", type: "Lookup", description: "Tour template" }, { name: "cgcloud__Tour_Check__c", type: "Lookup", description: "Tour check" }], relationships: [{ target: "cgcloud__Tour_Template__c", type: "child", description: "Links check to template" }, { target: "cgcloud__Tour_Check__c", type: "child", description: "Links template to check" }] },
      { name: "cgcloud__Tour_Template_Object_Reference__c", type: "custom", domain: "van_sales", description: "Adds object references to tour templates for ad-hoc visit creation and van-sales order templates.", fields: [{ name: "cgcloud__Tour_Template__c", type: "Lookup", description: "Parent template" }, { name: "cgcloud__Object_Type__c", type: "Picklist", description: "Referenced object type" }], relationships: [{ target: "cgcloud__Tour_Template__c", type: "child", description: "References belong to a template" }] },
      { name: "cgcloud__Vehicle__c", type: "custom", domain: "van_sales", description: "Vehicle carrying goods from warehouse to stores. Types: Car Standard, Truck Slow, Truck Fast, Trailer.", fields: [{ name: "Name", type: "Text", description: "Vehicle name or license plate" }, { name: "cgcloud__Type__c", type: "Picklist", description: "Vehicle type" }, { name: "cgcloud__Capacity__c", type: "Number", description: "Cargo capacity" }], relationships: [{ target: "cgcloud__Vehicle_Warehouse__c", type: "parent", description: "Vehicles assigned to warehouses" }, { target: "cgcloud__Tour__c", type: "parent", description: "Vehicles assigned to tours" }] },
      { name: "cgcloud__Vehicle_Warehouse__c", type: "custom", domain: "van_sales", description: "Association between Vehicle and Warehouse. Assigns vehicles to warehouses for fleet management.", fields: [{ name: "cgcloud__Vehicle__c", type: "Lookup", description: "The vehicle" }, { name: "cgcloud__Warehouse__c", type: "Lookup", description: "The warehouse" }], relationships: [{ target: "cgcloud__Vehicle__c", type: "child", description: "Links vehicle to warehouse" }, { target: "cgcloud__Warehouse__c", type: "child", description: "Links warehouse to vehicle" }] },
      { name: "cgcloud__Warehouse__c", type: "custom", domain: "van_sales", description: "Manufacturer depot with address, products, and vehicles. Starting point for delivery tours.", fields: [{ name: "Name", type: "Text", description: "Warehouse name" }, { name: "cgcloud__Sales_Org__c", type: "Lookup", description: "Sales organization" }, { name: "cgcloud__Address__c", type: "Text", description: "Warehouse address" }], relationships: [{ target: "cgcloud__Warehouse_Product__c", type: "parent", description: "Warehouses stock products" }, { target: "cgcloud__Warehouse_User__c", type: "parent", description: "Warehouses have users" }, { target: "cgcloud__Route__c", type: "parent", description: "Routes start from warehouses" }] },
      { name: "cgcloud__Warehouse_Product__c", type: "custom", domain: "van_sales", description: "Products stored in a warehouse. Defines which items can be shipped for delivery.", fields: [{ name: "cgcloud__Warehouse__c", type: "Lookup", description: "Parent warehouse" }, { name: "cgcloud__Product__c", type: "Lookup", description: "Stored product" }], relationships: [{ target: "cgcloud__Warehouse__c", type: "child", description: "Each record belongs to a warehouse" }, { target: "Product2", type: "child", description: "References a product" }] },
      { name: "cgcloud__Warehouse_User__c", type: "custom", domain: "van_sales", description: "Association between Warehouse and User. Assigns drivers to warehouses for inventory access.", fields: [{ name: "cgcloud__Warehouse__c", type: "Lookup", description: "The warehouse" }, { name: "cgcloud__User__c", type: "Lookup", description: "The driver or user" }], relationships: [{ target: "cgcloud__Warehouse__c", type: "child", description: "Links a user to a warehouse" }] },
      { name: "cgcloud__Inventory__c", type: "custom", domain: "van_sales", description: "Tracks quantities and flow of goods in real time. Can be product stock, customer quota, or cash flow. Assigned to tour, vehicle, users, or accounts.", fields: [{ name: "cgcloud__Product__c", type: "Lookup", description: "Product" }, { name: "cgcloud__Quantity__c", type: "Number", description: "Current quantity" }, { name: "cgcloud__Type__c", type: "Picklist", description: "Product Stock, Customer Quota, or Cash Float" }, { name: "cgcloud__Tour__c", type: "Lookup", description: "Tour assignment" }], relationships: [{ target: "cgcloud__Tour__c", type: "child", description: "Inventory assigned to a tour" }, { target: "cgcloud__Inventory_Transaction__c", type: "parent", description: "Changes tracked through transactions" }] },
      { name: "cgcloud__Inventory_Transaction__c", type: "custom", domain: "van_sales", description: "Transaction for every inventory change trigger. Supports accurate tracking of distributed and offline shared inventories.", fields: [{ name: "cgcloud__Inventory__c", type: "Lookup", description: "Parent inventory" }, { name: "cgcloud__Inventory_Transaction_Template__c", type: "Lookup", description: "Transaction template" }, { name: "cgcloud__Quantity__c", type: "Number", description: "Transaction quantity" }, { name: "cgcloud__Type__c", type: "Picklist", description: "Addition, Withdrawal, Balance, or Void" }], relationships: [{ target: "cgcloud__Inventory__c", type: "child", description: "Each transaction belongs to inventory" }, { target: "cgcloud__Inventory_Transaction_Template__c", type: "child", description: "Transactions follow templates" }] },
      { name: "cgcloud__Inventory_Control_Template__c", type: "custom", domain: "van_sales", description: "Template to manage inventories for an order. Defines record types and policies for user, vehicle, and tour assignments.", fields: [{ name: "Name", type: "Text", description: "Template name" }, { name: "cgcloud__Type__c", type: "Picklist", description: "Inventory control type" }], relationships: [{ target: "cgcloud__Inventory__c", type: "parent", description: "Templates define inventory policies" }] },
      { name: "cgcloud__Inventory_Transaction_Template__c", type: "custom", domain: "van_sales", description: "Template defining transaction type (addition, withdrawal, balance, or void) for inventory transactions.", fields: [{ name: "Name", type: "Text", description: "Template name" }, { name: "cgcloud__Type__c", type: "Picklist", description: "Transaction type" }], relationships: [{ target: "cgcloud__Inventory_Transaction__c", type: "parent", description: "Templates define transaction behavior" }] },
      { name: "cgcloud__Order_Payment__c", type: "custom", domain: "van_sales", description: "Payment information including amounts and payment type for an order. Supports cash, credit card, debit card, and check.", fields: [{ name: "cgcloud__Order__c", type: "Lookup", description: "Order" }, { name: "cgcloud__Order_Payment_Template__c", type: "Lookup", description: "Payment template" }, { name: "cgcloud__Gross_Amount__c", type: "Currency", description: "Gross amount" }, { name: "cgcloud__Payment_Type__c", type: "Picklist", description: "Payment type" }], relationships: [{ target: "cgcloud__Order__c", type: "child", description: "Each payment belongs to an order" }, { target: "cgcloud__Order_Payment_Template__c", type: "child", description: "Payments follow templates" }] },
      { name: "cgcloud__Order_Payment_Template__c", type: "custom", domain: "van_sales", description: "Template to define payment methods for orders during van sales.", fields: [{ name: "Name", type: "Text", description: "Template name" }, { name: "cgcloud__Type__c", type: "Picklist", description: "Payment method type" }], relationships: [{ target: "cgcloud__Order_Payment__c", type: "parent", description: "Templates define payment behavior" }] },
      { name: "cgcloud__Order_Payment_Inventory_Transaction__c", type: "custom", domain: "van_sales", description: "Links payment templates to inventory templates for DSD financial reconciliation.", fields: [{ name: "cgcloud__Order_Payment_Template__c", type: "Lookup", description: "Payment template" }, { name: "cgcloud__Inventory_Control_Template__c", type: "Lookup", description: "Inventory template" }], relationships: [{ target: "cgcloud__Order_Payment_Template__c", type: "child", description: "Links payment to inventory" }] },
      { name: "cgcloud__Order_Template_Order_Payment_Template__c", type: "custom", domain: "van_sales", description: "Associates Order Template with Order Payment Template for correct payment options during order finalization.", fields: [{ name: "cgcloud__Order_Template__c", type: "Lookup", description: "Order template" }, { name: "cgcloud__Order_Payment_Template__c", type: "Lookup", description: "Payment template" }], relationships: [{ target: "cgcloud__Order_Template__c", type: "child", description: "Links order to payment template" }] }
    ]
  },

  // ─────────────────────────────────────────────────
  //  MOBILE & SYNC
  //  No unique objects. Mobile app uses objects from
  //  other domains. Sync config objects are internal.
  // ─────────────────────────────────────────────────

  mobile_app: {
    objects: []
  },

  // ─────────────────────────────────────────────────
  //  MAPS & TERRITORY
  //  No unique objects. Uses RetailStore, Account,
  //  Location, cgcloud__Org_Unit__c from other domains.
  // ─────────────────────────────────────────────────

  maps_territory: {
    objects: []
  },

  // ═══════════════════════════════════════════════════
  //  TRADE PROMOTION MANAGEMENT PILLAR
  // ═══════════════════════════════════════════════════

  // ─────────────────────────────────────────────────
  //  TPM MASTER DATA
  //  Objects unique to TPM master data management.
  //  Skipped: Account, Product2, User, Assortment,
  //  cgcloud__Account_Extension__c, cgcloud__Account_Template__c,
  //  cgcloud__Account_Relationship__c, cgcloud__Account_Trade_Org_Hierarchy__c,
  //  cgcloud__Sub_Account__c, cgcloud__Sales_Organization__c,
  //  cgcloud__Product_Hierarchy__c, cgcloud__Product_Part__c,
  //  cgcloud__Product_Template__c, cgcloud__Product_Condition__c,
  //  cgcloud__Product_Category_Share__c, cgcloud__Product_Assortment_Template__c,
  //  cgcloud__Account_Set__c, cgcloud__Account_Set_Account__c,
  //  cgcloud__User_Setting__c, cgcloud__User_View__c
  //  (all in REx domains: accounts_stores, products_assortments)
  // ─────────────────────────────────────────────────

  tpm_master_data: {
    objects: [
      {
        name: "cgcloud__Week_Day_Share_Profile__c",
        type: "custom",
        domain: "tpm_master_data",
        description: "Stores customer information about the breakdown of product or category deliveries for each day of the week. Weekly profiles are updated when rates change during the week or during mid-week promotions, enabling accurate sub-weekly KPI calculations for TPM reporting.",
        fields: [
          { name: "Name", type: "Text", description: "Auto-generated profile name or identifier" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "The customer account this distribution profile belongs to" },
          { name: "cgcloud__Product_Hierarchy__c", type: "Lookup", description: "The product category this profile applies to" },
          { name: "cgcloud__Monday_Share__c", type: "Percent", description: "Percentage of weekly delivery allocated to Monday" },
          { name: "cgcloud__Tuesday_Share__c", type: "Percent", description: "Percentage of weekly delivery allocated to Tuesday" },
          { name: "cgcloud__Wednesday_Share__c", type: "Percent", description: "Percentage of weekly delivery allocated to Wednesday" },
          { name: "cgcloud__Thursday_Share__c", type: "Percent", description: "Percentage of weekly delivery allocated to Thursday" },
          { name: "cgcloud__Friday_Share__c", type: "Percent", description: "Percentage of weekly delivery allocated to Friday" },
          { name: "cgcloud__Saturday_Share__c", type: "Percent", description: "Percentage of weekly delivery allocated to Saturday" },
          { name: "cgcloud__Sunday_Share__c", type: "Percent", description: "Percentage of weekly delivery allocated to Sunday" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Start date for this distribution profile's validity" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "End date for this distribution profile's validity" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each distribution profile belongs to a specific customer account" },
          { target: "cgcloud__Product_Hierarchy__c", type: "lookup", description: "Profile applies to deliveries for a specific product category in the hierarchy" }
        ]
      },
      {
        name: "cgcloud__Promotion_Attachment__c",
        type: "custom",
        domain: "tpm_master_data",
        description: "Stores file attachments for promotions supporting formats including PDF, Word, Excel, PowerPoint, images (PNG, JPEG, GIF, BMP, TIFF), audio (WAV, MP3), video (AVI, MKV, MPG, MPEG), and ZIP archives. Each file can have a maximum size of 25 MB.",
        fields: [
          { name: "Name", type: "Text", description: "Display name of the attachment file" },
          { name: "cgcloud__File_Type__c", type: "Picklist", description: "File format type (pdf, docx, xlsx, pptx, png, jpg, etc.)" },
          { name: "cgcloud__File_Size__c", type: "Number", description: "Size of the attachment file in bytes" },
          { name: "cgcloud__Description__c", type: "Text", description: "Optional description of the attachment content" }
        ],
        relationships: [
          { target: "cgcloud__Promotion_Attachment_Link__c", type: "parent", description: "Attachments are linked to promotions through junction records" }
        ]
      },
      {
        name: "cgcloud__Promotion_Attachment_Link__c",
        type: "custom",
        domain: "tpm_master_data",
        description: "Junction object that creates the many-to-many relationship between promotions and promotion attachments. Allows a single attachment to be shared across multiple promotions and a single promotion to have multiple attachments.",
        fields: [
          { name: "cgcloud__Promotion__c", type: "MasterDetail", description: "Reference to the promotion record" },
          { name: "cgcloud__Promotion_Attachment__c", type: "MasterDetail", description: "Reference to the promotion attachment record" }
        ],
        relationships: [
          { target: "cgcloud__Promotion__c", type: "child", description: "Links to the promotion that uses this attachment" },
          { target: "cgcloud__Promotion_Attachment__c", type: "child", description: "Links to the attachment file record" }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────
  //  PROMOTIONS
  //  Skipped: cgcloud__Promotion__c, cgcloud__Tactic__c,
  //  cgcloud__Tactic_Template__c, cgcloud__Tactic_Product__c
  //  (all in products_assortments domain for REx)
  // ─────────────────────────────────────────────────

  promotions: {
    objects: [
      {
        name: "cgcloud__Tactic_Product_Condition__c",
        type: "custom",
        domain: "promotions",
        description: "Conditions generated from tactics at each product level based on a set configuration. These conditions are used in both promotions and account plans to calculate KPIs such as planned cost, planned revenue, and price reductions at the product level.",
        fields: [
          { name: "Name", type: "Text", description: "Auto-generated condition identifier" },
          { name: "cgcloud__Tactic__c", type: "Lookup", description: "The tactic that generated this product condition" },
          { name: "cgcloud__Product__c", type: "Lookup", description: "The product this condition applies to" },
          { name: "cgcloud__Condition_Type__c", type: "Picklist", description: "Type of condition (percentage rebate, absolute rebate, fixed amount)" },
          { name: "cgcloud__Value__c", type: "Currency", description: "Monetary value or rate for the condition" },
          { name: "cgcloud__Percent__c", type: "Percent", description: "Percentage value when condition type is percentage-based" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Start date of the condition's validity period" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "End date of the condition's validity period" }
        ],
        relationships: [
          { target: "cgcloud__Tactic__c", type: "child", description: "Each tactic product condition is generated from a specific tactic" },
          { target: "Product2", type: "lookup", description: "Condition applies to a specific product in the promotion" }
        ]
      },
      {
        name: "cgcloud__KPI_Definition__c",
        type: "custom",
        domain: "promotions",
        description: "Defines individual key performance indicators used to measure business performance across promotions, account plans, funds, and claims. Each KPI is a single monetary, volume, or percentage measure such as actual volume, base volume, target revenue, planned cost, or gross margin. KPI definitions are the building blocks assembled into KPI Sets.",
        fields: [
          { name: "Name", type: "Text", description: "Display name of the KPI (e.g., Actual Volume, Target Revenue, Gross Margin)" },
          { name: "cgcloud__KPI_Type__c", type: "Picklist", description: "Measure type: Monetary, Volume, or Percentage" },
          { name: "cgcloud__Technical_Name__c", type: "Text", description: "System-internal technical identifier for the KPI" },
          { name: "cgcloud__Description__c", type: "Text", description: "Business description explaining what the KPI measures" },
          { name: "cgcloud__Aggregation_Level__c", type: "Picklist", description: "Level at which the KPI is calculated (Product, Category, Account)" },
          { name: "cgcloud__Is_Editable__c", type: "Checkbox", description: "Whether users can manually enter or adjust this KPI value" },
          { name: "cgcloud__Is_Read_Only__c", type: "Checkbox", description: "Whether the KPI is calculated by the system and cannot be edited" },
          { name: "cgcloud__Sales_Organization__c", type: "Lookup", description: "Sales organization this KPI definition belongs to" }
        ],
        relationships: [
          { target: "cgcloud__KPI_Set__c", type: "lookup", description: "KPI definitions are grouped into KPI Sets for use in business processes" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "KPI definitions are scoped to a specific sales organization" }
        ]
      },
      {
        name: "cgcloud__KPI_Set__c",
        type: "custom",
        domain: "promotions",
        description: "A named collection of individual KPI definitions mapped to a business process through templates. For example, the list of KPIs shown in an account plan is based on the KPI set selected in the customer template. For funds, the KPI set is mapped via the fund template. KPIs at parent levels are read-only aggregations of all child KPIs.",
        fields: [
          { name: "Name", type: "Text", description: "Display name of the KPI set (e.g., Promotion KPIs, Fund KPIs, Account Plan KPIs)" },
          { name: "cgcloud__Technical_Name__c", type: "Text", description: "System-internal technical identifier for the KPI set" },
          { name: "cgcloud__Description__c", type: "Text", description: "Description of the business process this KPI set serves" },
          { name: "cgcloud__Sales_Organization__c", type: "Lookup", description: "Sales organization this KPI set belongs to" }
        ],
        relationships: [
          { target: "cgcloud__KPI_Definition__c", type: "parent", description: "A KPI set contains one or more KPI definitions" },
          { target: "cgcloud__Account_Template__c", type: "lookup", description: "KPI sets are assigned to customer templates to drive account plan KPIs" },
          { target: "cgcloud__Fund_Template__c", type: "lookup", description: "KPI sets are assigned to fund templates to drive fund KPIs" },
          { target: "cgcloud__Payment_Template__c", type: "lookup", description: "KPI sets are assigned to claim templates to drive claim KPIs" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "KPI sets are scoped to a specific sales organization" }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────
  //  FUNDS & BUDGETS
  //  All objects here are unique to TPM fund management.
  // ─────────────────────────────────────────────────

  funds_budgets: {
    objects: [
      {
        name: "cgcloud__Fund__c",
        type: "custom",
        domain: "funds_budgets",
        description: "Holds money allocated for promotional activities. A fund can be created for a customer, a customer-category combination, or a customer-brand combination. Finance managers create funds using templates that dictate properties like currency, customer anchor, and product anchor. Funds are linked to tactics that consume the budget.",
        fields: [
          { name: "Name", type: "Text", description: "Display name of the fund" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "The customer account this fund is allocated to" },
          { name: "cgcloud__Fund_Template__c", type: "Lookup", description: "Template that defines the fund's type and properties" },
          { name: "cgcloud__Currency__c", type: "Picklist", description: "Currency of the fund amount" },
          { name: "cgcloud__Budget__c", type: "Currency", description: "Total budget amount allocated to this fund" },
          { name: "cgcloud__Committed__c", type: "Currency", description: "Amount committed to promotion tactics" },
          { name: "cgcloud__Remaining__c", type: "Currency", description: "Remaining balance available for new commitments" },
          { name: "cgcloud__Overdraft_Allowed__c", type: "Checkbox", description: "Whether spending can exceed the allocated budget" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Start date of the fund's validity period" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "End date of the fund's validity period" },
          { name: "cgcloud__Status__c", type: "Picklist", description: "Fund lifecycle status (Draft, Active, Closed)" },
          { name: "cgcloud__Sales_Organization__c", type: "Lookup", description: "Sales organization this fund belongs to" },
          { name: "cgcloud__Product_Hierarchy__c", type: "Lookup", description: "Product category or brand anchor for the fund" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each fund is allocated to a specific customer account" },
          { target: "cgcloud__Fund_Template__c", type: "child", description: "Fund inherits properties from its template" },
          { target: "cgcloud__Tactic__c", type: "lookup", description: "Tactics are linked to funds that pay for them" },
          { target: "cgcloud__Payment__c", type: "lookup", description: "Claims settle against fund balances" },
          { target: "cgcloud__Fund_Transaction__c", type: "parent", description: "Funds have transaction records for budget movements" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Funds are scoped to a sales organization" }
        ]
      },
      {
        name: "cgcloud__Fund_Template__c",
        type: "custom",
        domain: "funds_budgets",
        description: "Template to create various types of funds. The template dictates the properties of a fund such as currency, customer anchor, and product anchor. A fund template links funds to tactics or promotions via the tactic template. Each template is tied to a sales organization.",
        fields: [
          { name: "Name", type: "Text", description: "Template display name" },
          { name: "cgcloud__Technical_Name__c", type: "Text", description: "System-internal technical identifier" },
          { name: "cgcloud__Fund_Type__c", type: "Picklist", description: "Type of fund created from this template (Customer, Customer-Category, Customer-Brand)" },
          { name: "cgcloud__Currency__c", type: "Picklist", description: "Default currency for funds created from this template" },
          { name: "cgcloud__KPI_Set__c", type: "Lookup", description: "KPI set that drives fund performance measures" },
          { name: "cgcloud__Sales_Organization__c", type: "Lookup", description: "Sales organization this template is scoped to" },
          { name: "cgcloud__Overdraft_Allowed__c", type: "Checkbox", description: "Whether funds created from this template allow overdraft" }
        ],
        relationships: [
          { target: "cgcloud__Fund__c", type: "parent", description: "Template creates fund records with inherited properties" },
          { target: "cgcloud__KPI_Set__c", type: "lookup", description: "KPI set determines which KPIs are tracked for funds" },
          { target: "cgcloud__Tactic_Template__c", type: "lookup", description: "Fund template is linked to tactic templates for budget allocation" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Templates are scoped to a sales organization" }
        ]
      },
      {
        name: "cgcloud__Fund_Transaction_Header__c",
        type: "custom",
        domain: "funds_budgets",
        description: "Header record for multi-fund transactions that create, adjust, transfer, or draw back fund budgets. Transaction types are Initial (create funds without source), Adjustment (revoke from source funds), Transfer (move from source to targets), and Drawback (consolidate from multiple sources to one target). The type is determined by the fund template.",
        fields: [
          { name: "Name", type: "Text", description: "Transaction header display name or auto-generated identifier" },
          { name: "cgcloud__Transaction_Type__c", type: "Picklist", description: "Type of transaction: Initial, Adjustment, Transfer, or Drawback" },
          { name: "cgcloud__Fund_Transaction_Template__c", type: "Lookup", description: "Template that determines transaction characteristics" },
          { name: "cgcloud__Status__c", type: "Picklist", description: "Transaction lifecycle status (Draft, Submitted, Approved, Posted)" },
          { name: "cgcloud__Total_Amount__c", type: "Currency", description: "Total monetary amount of the transaction" },
          { name: "cgcloud__Sales_Organization__c", type: "Lookup", description: "Sales organization this transaction belongs to" },
          { name: "cgcloud__Transaction_Date__c", type: "Date", description: "Date the transaction was created or posted" }
        ],
        relationships: [
          { target: "cgcloud__Fund_Transaction__c", type: "parent", description: "Header contains individual fund transaction line items" },
          { target: "cgcloud__Fund_Transaction_Template__c", type: "child", description: "Transaction type and properties inherited from template" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Transactions are scoped to a sales organization" }
        ]
      },
      {
        name: "cgcloud__Fund_Transaction__c",
        type: "custom",
        domain: "funds_budgets",
        description: "Individual fund transaction line items carried out for each fund. Transactions can initialize, adjust, or transfer funds for promotions. Each transaction references a source or target fund and creates corresponding debit and credit transaction rows.",
        fields: [
          { name: "Name", type: "Text", description: "Transaction line item identifier" },
          { name: "cgcloud__Fund_Transaction_Header__c", type: "MasterDetail", description: "Parent transaction header record" },
          { name: "cgcloud__Fund__c", type: "Lookup", description: "The fund this transaction applies to" },
          { name: "cgcloud__Amount__c", type: "Currency", description: "Monetary amount of this individual transaction" },
          { name: "cgcloud__Transaction_Direction__c", type: "Picklist", description: "Whether this is a source (debit) or target (credit) transaction" }
        ],
        relationships: [
          { target: "cgcloud__Fund_Transaction_Header__c", type: "child", description: "Each transaction belongs to a transaction header" },
          { target: "cgcloud__Fund__c", type: "lookup", description: "Transaction applies to a specific fund" },
          { target: "cgcloud__Fund_Transaction_Row__c", type: "parent", description: "Each transaction creates debit and credit rows" }
        ]
      },
      {
        name: "cgcloud__Fund_Transaction_Row__c",
        type: "custom",
        domain: "funds_budgets",
        description: "Indicates the flow of money for fund transactions. For each transaction, the system creates a debit transaction row and a credit transaction row, providing a complete audit trail of fund budget movements.",
        fields: [
          { name: "Name", type: "Text", description: "Row identifier" },
          { name: "cgcloud__Fund_Transaction__c", type: "MasterDetail", description: "Parent fund transaction record" },
          { name: "cgcloud__Row_Type__c", type: "Picklist", description: "Debit or Credit" },
          { name: "cgcloud__Amount__c", type: "Currency", description: "Monetary amount for this row" },
          { name: "cgcloud__Fund__c", type: "Lookup", description: "The fund being debited or credited" }
        ],
        relationships: [
          { target: "cgcloud__Fund_Transaction__c", type: "child", description: "Each row belongs to a specific fund transaction" },
          { target: "cgcloud__Fund__c", type: "lookup", description: "Row debits or credits a specific fund" }
        ]
      },
      {
        name: "cgcloud__Fund_Transaction_Template__c",
        type: "custom",
        domain: "funds_budgets",
        description: "Template to create multi-fund transactions. The template dictates the characteristics of a transaction such as type (Initial, Adjustment, Transfer, Drawback), KPI set, and anchor type. Templates are tied to a sales organization.",
        fields: [
          { name: "Name", type: "Text", description: "Template display name" },
          { name: "cgcloud__Technical_Name__c", type: "Text", description: "System-internal technical identifier" },
          { name: "cgcloud__Transaction_Type__c", type: "Picklist", description: "Default transaction type: Initial, Adjustment, Transfer, or Drawback" },
          { name: "cgcloud__KPI_Set__c", type: "Lookup", description: "KPI set for tracking transaction-related measures" },
          { name: "cgcloud__Sales_Organization__c", type: "Lookup", description: "Sales organization this template is scoped to" }
        ],
        relationships: [
          { target: "cgcloud__Fund_Transaction_Header__c", type: "parent", description: "Template creates transaction header records" },
          { target: "cgcloud__KPI_Set__c", type: "lookup", description: "KPI set determines measures tracked for transactions" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Templates are scoped to a sales organization" }
        ]
      },
      {
        name: "cgcloud__Rate_Based_Funding__c",
        type: "custom",
        domain: "funds_budgets",
        description: "Stores details of flexible budgets allocated for promotions that are customer- or product-specific. The flexibility of fund value is based on the latest estimates: actual values for past weeks and planned values for current and future weeks. RBFs can be based on product sales volume (cases shipped), a specific percentage of product revenue, or a fixed rate per product or product group.",
        fields: [
          { name: "Name", type: "Text", description: "RBF record display name" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "The customer account this RBF is anchored to" },
          { name: "cgcloud__RBF_Template__c", type: "Lookup", description: "Template that defines RBF characteristics and rate type" },
          { name: "cgcloud__Rate_Type__c", type: "Picklist", description: "Basis for flexible budget: Volume, Revenue Percentage, or Fixed Rate" },
          { name: "cgcloud__Rate__c", type: "Number", description: "The rate value (amount per unit, percentage, or fixed rate)" },
          { name: "cgcloud__Fund__c", type: "Lookup", description: "The fund that this RBF populates with flexible budget" },
          { name: "cgcloud__Product_Hierarchy__c", type: "Lookup", description: "Product category or group this RBF applies to" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Start date of the RBF validity period" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "End date of the RBF validity period" },
          { name: "cgcloud__Parent_RBF__c", type: "Lookup", description: "Parent RBF for hierarchical budget distribution" },
          { name: "cgcloud__Sales_Organization__c", type: "Lookup", description: "Sales organization this RBF belongs to" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "RBFs are anchored to customer accounts" },
          { target: "cgcloud__RBF_Template__c", type: "child", description: "RBF inherits rate type and KPI sets from its template" },
          { target: "cgcloud__Fund__c", type: "lookup", description: "RBF populates a fund with flexible budget amounts" },
          { target: "cgcloud__Parent_RBF__c", type: "lookup", description: "Child RBFs receive funds distributed from a parent RBF" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "RBFs are scoped to a sales organization" }
        ]
      },
      {
        name: "cgcloud__RBF_Template__c",
        type: "custom",
        domain: "funds_budgets",
        description: "Template to create Rate-Based Funding records. An RBF inherits its characteristics such as rate type, KPI sets, and product anchor configuration from the RBF template. Templates are scoped to a sales organization.",
        fields: [
          { name: "Name", type: "Text", description: "Template display name" },
          { name: "cgcloud__Technical_Name__c", type: "Text", description: "System-internal technical identifier" },
          { name: "cgcloud__Rate_Type__c", type: "Picklist", description: "Default rate type: Volume, Revenue Percentage, or Fixed Rate" },
          { name: "cgcloud__KPI_Set__c", type: "Lookup", description: "KPI set for tracking RBF-related measures" },
          { name: "cgcloud__Sales_Organization__c", type: "Lookup", description: "Sales organization this template is scoped to" }
        ],
        relationships: [
          { target: "cgcloud__Rate_Based_Funding__c", type: "parent", description: "Template creates RBF records with inherited properties" },
          { target: "cgcloud__KPI_Set__c", type: "lookup", description: "KPI set determines which measures are tracked for RBFs" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Templates are scoped to a sales organization" }
        ]
      },
      {
        name: "cgcloud__Parent_RBF__c",
        type: "custom",
        domain: "funds_budgets",
        description: "Links child accounts that receive funds from a parent account's Rate-Based Funding. The parent RBF distributes budget to child RBFs based on the trade org hierarchy, enabling fair-share distribution of the trade budget to retailers at different levels of the account hierarchy.",
        fields: [
          { name: "Name", type: "Text", description: "Parent RBF link identifier" },
          { name: "cgcloud__Parent_Rate_Based_Funding__c", type: "MasterDetail", description: "The parent RBF that distributes budget" },
          { name: "cgcloud__Child_Rate_Based_Funding__c", type: "Lookup", description: "The child RBF receiving distributed budget" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "The child account receiving the fund distribution" }
        ],
        relationships: [
          { target: "cgcloud__Rate_Based_Funding__c", type: "child", description: "Links a child RBF to its parent for hierarchical budget distribution" },
          { target: "Account", type: "lookup", description: "The child account in the distribution hierarchy" }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────
  //  CLAIMS
  //  Skipped: cgcloud__Approval_Code__c (in visit_execution
  //  signatures domain for DSD)
  // ─────────────────────────────────────────────────

  claims: {
    objects: [
      {
        name: "cgcloud__Payment__c",
        type: "custom",
        domain: "claims",
        description: "Specifies the remuneration given to customers for running promotion tactics. In TPM, this object represents claims — payment requests from retailers as compensation for executing promotional activities. Claim types include Deduction, Credit Memo, Check Request, and Invoice-Based, determined by the claim template used during creation. Claims integrate with Accounts Receivable and Accounts Payable for settlement.",
        fields: [
          { name: "Name", type: "Text", description: "Claim record display name or auto-generated identifier" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "The customer account submitting or receiving the claim" },
          { name: "cgcloud__Payment_Template__c", type: "Lookup", description: "Template that defines the claim type and properties" },
          { name: "cgcloud__Claim_Type__c", type: "Picklist", description: "Type of claim: Deduction, Credit Memo, Check Request, or Invoice-Based" },
          { name: "cgcloud__Amount__c", type: "Currency", description: "Total claim amount requested" },
          { name: "cgcloud__Approved_Amount__c", type: "Currency", description: "Amount approved after validation" },
          { name: "cgcloud__Status__c", type: "Picklist", description: "Claim lifecycle status (Draft, Submitted, Approved, Settled, Rejected)" },
          { name: "cgcloud__Promotion__c", type: "Lookup", description: "The promotion this claim is associated with" },
          { name: "cgcloud__Tactic__c", type: "Lookup", description: "The specific tactic this claim compensates" },
          { name: "cgcloud__Fund__c", type: "Lookup", description: "The fund that this claim settles against" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Start date of the claim period" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "End date of the claim period" },
          { name: "cgcloud__Sales_Organization__c", type: "Lookup", description: "Sales organization this claim belongs to" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each claim is submitted by or paid to a customer account" },
          { target: "cgcloud__Payment_Template__c", type: "child", description: "Claim type and properties inherited from the template" },
          { target: "cgcloud__Promotion__c", type: "lookup", description: "Claim is associated with an executed promotion" },
          { target: "cgcloud__Tactic__c", type: "lookup", description: "Claim compensates a specific promotion tactic" },
          { target: "cgcloud__Fund__c", type: "lookup", description: "Claim settlement debits the linked fund balance" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Claims are scoped to a sales organization" }
        ]
      },
      {
        name: "cgcloud__Payment_Template__c",
        type: "custom",
        domain: "claims",
        description: "Template to create claims and set the claim type that determines how the retailer is paid for promotions. The template dictates claim properties including the payment method, KPI set for tracking claim measures, and approval workflow configuration. Each template is tied to a sales organization.",
        fields: [
          { name: "Name", type: "Text", description: "Template display name" },
          { name: "cgcloud__Technical_Name__c", type: "Text", description: "System-internal technical identifier" },
          { name: "cgcloud__Claim_Type__c", type: "Picklist", description: "Default claim type: Deduction, Credit Memo, Check Request, or Invoice-Based" },
          { name: "cgcloud__KPI_Set__c", type: "Lookup", description: "KPI set for tracking claim-related measures" },
          { name: "cgcloud__Sales_Organization__c", type: "Lookup", description: "Sales organization this template is scoped to" },
          { name: "cgcloud__Approval_Required__c", type: "Checkbox", description: "Whether claims created from this template require approval" }
        ],
        relationships: [
          { target: "cgcloud__Payment__c", type: "parent", description: "Template creates claim records with inherited properties" },
          { target: "cgcloud__KPI_Set__c", type: "lookup", description: "KPI set determines which measures are tracked for claims" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Templates are scoped to a sales organization" }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────
  //  ACCOUNT PLANNING
  // ─────────────────────────────────────────────────

  account_planning: {
    objects: [
      {
        name: "cgcloud__Account_Plan__c",
        type: "custom",
        domain: "account_planning",
        description: "Stores data for an account and business year combination with one or more product categories, forming the Customer Business Plan. KAMs can enter or manually adjust KPI data in the account plan, with changes cascading to promotions. The account plan provides a P&L overview showing planned versus actual values across promotion, fund, and claim KPIs in a hierarchical grid.",
        fields: [
          { name: "Name", type: "Text", description: "Account plan display name" },
          { name: "cgcloud__Account__c", type: "Lookup", description: "The customer account this plan covers" },
          { name: "cgcloud__Account_Template__c", type: "Lookup", description: "Customer template that determines the KPI set and product aggregation level" },
          { name: "cgcloud__Business_Year__c", type: "Text", description: "Fiscal year this plan covers" },
          { name: "cgcloud__Product_Hierarchy__c", type: "Lookup", description: "Product category this plan segment covers" },
          { name: "cgcloud__Status__c", type: "Picklist", description: "Plan lifecycle status (Draft, Active, Closed)" },
          { name: "cgcloud__Valid_From__c", type: "Date", description: "Start date of the planning period" },
          { name: "cgcloud__Valid_Thru__c", type: "Date", description: "End date of the planning period" },
          { name: "cgcloud__Sales_Organization__c", type: "Lookup", description: "Sales organization this plan belongs to" },
          { name: "cgcloud__KPI_Set__c", type: "Lookup", description: "KPI set inherited from the customer template" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each account plan belongs to a specific customer account" },
          { target: "cgcloud__Account_Template__c", type: "child", description: "Account template determines plan KPIs and aggregation level" },
          { target: "cgcloud__Promotion__c", type: "lookup", description: "Promotion KPIs aggregate into the account plan P&L" },
          { target: "cgcloud__Fund__c", type: "lookup", description: "Fund allocations are reflected in the account plan" },
          { target: "cgcloud__Payment__c", type: "lookup", description: "Claim actuals impact account plan profitability" },
          { target: "cgcloud__KPI_Set__c", type: "lookup", description: "KPI set defines the measures shown in the P&L view" },
          { target: "cgcloud__Sales_Organization__c", type: "child", description: "Plans are scoped to a sales organization" }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────
  //  ANALYTICS & REPORTING
  //  No unique Salesforce objects. Uses KPI objects from
  //  the promotions domain and processing service
  //  calculations. RTR configurations are custom metadata.
  // ─────────────────────────────────────────────────

  analytics: {
    objects: [],
    metadata: [
      {
        type: "cgcloud__RTR_Report_Configuration__mdt",
        name: "RTR Report Configuration",
        fields: {
          "cgcloud__Report_Name__c": "Text",
          "cgcloud__Report_Type__c": "Picklist",
          "cgcloud__KPI_Set__c": "Text",
          "cgcloud__Aggregation_Level__c": "Picklist",
          "cgcloud__Is_Active__c": "Checkbox"
        },
        description: "Custom metadata type for configuring Real-Time Reporting definitions. Each configuration specifies a report name, type (Account-level or Promotion-level), the KPI set to display, and the aggregation level. RTR configurations fetch calculation results from CG Cloud Processing Services."
      }
    ]
  },

  // ─────────────────────────────────────────────────
  //  AGENTFORCE
  //  No unique Salesforce objects. Agent configuration
  //  uses standard Agentforce platform objects.
  // ─────────────────────────────────────────────────

  agentforce: {
    objects: []
  },

  // ─────────────────────────────────────────────────
  //  EINSTEIN AI
  // ─────────────────────────────────────────────────

  einstein_ai: {
    objects: [
      {
        name: "AiVisitRecommendation",
        type: "standard",
        domain: "einstein_ai",
        description: "Einstein-generated recommendations suggesting which stores field reps should visit next. The machine learning model analyzes historical visit frequency, compliance scores, store revenue potential, and time since last visit to rank stores by visit priority. Recommendations are surfaced in the mobile app and desktop UI for reps and managers to act on.",
        fields: [
          { name: "Name", type: "Text", description: "System-generated recommendation identifier" },
          { name: "AccountId", type: "Lookup", description: "The account (store) being recommended for a visit" },
          { name: "OwnerId", type: "Lookup", description: "The field rep this recommendation is generated for" },
          { name: "Score", type: "Number", description: "Priority score calculated by the ML model (higher = more urgent)" },
          { name: "RecommendationReason", type: "Text", description: "Human-readable explanation of why this store was recommended" },
          { name: "LastVisitDate", type: "Date", description: "Date of the most recent visit to this store" },
          { name: "ComplianceScore", type: "Percent", description: "Store's current compliance score from recent assessments" },
          { name: "CreatedDate", type: "DateTime", description: "When the recommendation was generated by the model" }
        ],
        relationships: [
          { target: "Account", type: "child", description: "Each recommendation targets a specific store account" },
          { target: "User", type: "child", description: "Recommendation is assigned to a specific field rep" },
          { target: "Visit", type: "lookup", description: "May link to a visit created from this recommendation" }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────
  //  DATA CLOUD
  //  No unique CG-specific Salesforce objects.
  //  Data Cloud uses Data Model Objects (DMOs) which
  //  are native to the Data Cloud platform, not custom
  //  Salesforce objects. The CG Cloud Data Kit deploys
  //  data streams and DLO-to-DMO mappings.
  // ─────────────────────────────────────────────────

  data_cloud: {
    objects: []
  }

};
