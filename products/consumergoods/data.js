export const PRODUCT = {

accounts_stores: {
  packages: ['consumergoods'],
  name: "Accounts & Stores",
  icon: "\u{1F3EA}",
  color: "#38bdf8",
  description: "The foundation of Retail Execution data. Accounts represent retailers, distributors, wholesalers, and consumers. Retail Stores track physical locations where products are sold. The enhanced model adds customer extensions, trade org hierarchies, sales organizations, customer sets, and segmentation rules for multi-market management.",
  components: [
    {
      id: "retail-stores",
      name: "Retail Stores & Locations",
      icon: "\u{1F3EC}",
      desc: "Tracks physical store locations, in-store locations (aisles, endcaps, checkout counters), and retail location groups for clustering stores by size, region, or product placement. Operating hours and time slots define business hours and preferred visit windows for each store.",
      tags: ["RetailStore", "InStoreLocation", "RetailLocationGroup", "OperatingHours", "Location", "TimeSlot", "StoreProduct"],
      connections: [
        { planet: "visit_planning", desc: "Stores are the targets of planned visits" },
        { planet: "products_assortments", desc: "Stores have product assortments and store products" }
      ]
    },
    {
      id: "customer-master",
      name: "Customer Master Data",
      icon: "\u{1F4CB}",
      desc: "Extended account data including customer extensions for classification, status, and pricing configuration. Customer templates define reusable account creation patterns. Account managers link users to accounts through org units for sales territory assignment.",
      tags: ["Account", "cgcloud__Account_Extension__c", "cgcloud__Account_Template__c", "cgcloud__Account_Manager__c", "cgcloud__Account_Receivable__c", "Contact"],
      connections: [
        { planet: "visit_planning", desc: "Customer visit settings drive automated visit creation" },
        { planet: "van_sales", desc: "Customers are delivery recipients on routes" }
      ]
    },
    {
      id: "trade-org-hierarchy",
      name: "Trade Org Hierarchy",
      icon: "\u{1F3D7}",
      desc: "Models parent-child relationships between accounts to represent how retailers, distributors, and wholesalers are organized. Child accounts inherit retail activities and assortments from parent accounts. Hierarchies are time-dependent with defined validity periods.",
      tags: ["cgcloud__Account_Trade_Org_Hierarchy__c", "cgcloud__Account_Relationship__c", "cgcloud__Sub_Account__c"],
      connections: [
        { planet: "products_assortments", desc: "Product assortments inherit through the trade org hierarchy" }
      ]
    },
    {
      id: "sales-organizations",
      name: "Sales Organizations",
      icon: "\u{1F310}",
      desc: "Business segments that structure data and processes by organizational unit for multi-market enablement. Sales orgs can be based on geographical territories, product divisions, or account teams. Master data is unique per sales org, enabling independent business processes across markets.",
      tags: ["cgcloud__Sales_Organization__c", "cgcloud__Sales_Organization_User__c"],
      connections: [
        { planet: "products_assortments", desc: "Product templates and assortments belong to a sales org" },
        { planet: "van_sales", desc: "Warehouses and routes belong to a sales org" }
      ]
    },
    {
      id: "org-units",
      name: "Org Units & Territories",
      icon: "\u{1F5FA}",
      desc: "Organizational units represent the smallest divisions such as departments or branch offices. Org unit hierarchies model internal organizational structure. Org unit users map sales reps and supervisors to specific territories, controlling customer access, regional promotions, and supervisor assignments.",
      tags: ["cgcloud__Org_Unit__c", "cgcloud__Org_Unit_Hierarchy__c", "cgcloud__Org_Unit_User__c", "cgcloud__Account_Org_Unit__c"],
      connections: [
        { planet: "maps_territory", desc: "Org units define territory boundaries for map visualization" },
        { planet: "visit_planning", desc: "Org units determine which reps can create visits for which customers" }
      ]
    },
    {
      id: "customer-sets",
      name: "Customer Sets & Segmentation",
      icon: "\u{1F3AF}",
      desc: "Groups of customers created manually, via integration, or through segmentation rules for targeting promotions, pricing, and activities at scale. Segmentation rules use SOQL queries to dynamically build customer sets based on account or org unit hierarchy filters.",
      tags: ["cgcloud__Account_Set__c", "cgcloud__Account_Set_Account__c", "cgcloud__Account_Set_Manager__c", "cgcloud__Segmentation_Rule__c", "cgcloud__Segmentation_Rule_Def__c", "cgcloud__Segmentation_Rule_Def_Column__c"],
      connections: [
        { planet: "products_assortments", desc: "Customer sets target promotions to specific store groups" },
        { planet: "visit_execution", desc: "Activities can be assigned to customer sets" }
      ]
    },
    {
      id: "assets-pos",
      name: "Assets & Point of Sale",
      icon: "\u{2744}",
      desc: "Tracks valuable equipment placed at customer locations such as refrigerators, freezers, and display units. Asset templates define types (single door, multi-door, kiosk), and asset audits record condition during visits. Point of Sale objects track secondary placements like shelf displays and sales counters used for promotions.",
      tags: ["Asset", "cgcloud__Asset_Audit__c", "cgcloud__Asset_Template__c", "cgcloud__POS__c", "cgcloud__POS_Template__c", "cgcloud__Account_Task__c", "cgcloud__Account_Task_Template__c"],
      connections: [
        { planet: "visit_execution", desc: "Assets are audited and POS is inspected during visit execution" },
        { planet: "mobile_app", desc: "Asset audit and POS inspection happens on mobile devices" }
      ]
    },
    {
      id: "cg-sales-service",
      name: "CG for Sales & Service",
      icon: "\u{1F4DE}",
      desc: "Enables telesales and service agents to engage with customers for orders, promotions, and issue resolution. Sales Excellence uses OmniScripts to guide agents through retailer contact lists. Service agents get a 360-degree customer view with identity verification, record alerts, timeline, and order management capabilities.",
      tags: ["Account", "Contact", "cgcloud__Order__c"],
      connections: [
        { planet: "products_assortments", desc: "Agents suggest products and promotions to customers" },
        { planet: "visit_planning", desc: "Service agents can create visits for customers" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: Admin configures sales organizations, org units, and territory hierarchies for multi-market management",
    "Step 2: Customer master data is created with account extensions, trade org hierarchies, and customer relationships",
    "Step 3: Retail stores are created with in-store locations, operating hours, and location group assignments",
    "Step 4: Customer sets are built via segmentation rules to target promotions and activities to specific store groups",
    "Step 5: Assets and POS displays are placed at customer locations and tracked through audit workflows"
  ],
  connections: [
    { planet: "visit_planning", desc: "Stores and customer settings drive visit creation and scheduling" },
    { planet: "products_assortments", desc: "Stores have product assortments and promotions" },
    { planet: "van_sales", desc: "Accounts are delivery destinations on routes and tours" },
    { planet: "maps_territory", desc: "Stores are visualized on maps by territory" },
    { planet: "mobile_app", desc: "Customer master data syncs to mobile devices" },
    { planet: "visit_execution", desc: "Store and account data is captured and enriched during visits" },
    { planet: "tpm_master_data", desc: "Customer master shares account hierarchies with TPM" },
    { planet: "analytics", desc: "Store-level data powers compliance and performance analytics" },
    { planet: "agentforce", desc: "Agents access store and account data for context" },
    { planet: "einstein_ai", desc: "Store attributes and targets feed Einstein predictions" },
    { planet: "data_cloud", desc: "Store and account data ingested into Data Cloud DMOs" }
  ]
},

products_assortments: {
  packages: ['consumergoods'],
  name: "Products & Assortments",
  icon: "\u{1F4E6}",
  color: "#34d399",
  description: "Manages the product catalog, product hierarchies, assortments, pricing conditions, and advanced promotions. Products are organized by template and hierarchy, with units of measure for order calculations. Assortments define which products are eligible for sale in specific stores. Advanced promotions use tactics, hurdles, and rewards to manage in-store pricing events.",
  components: [
    {
      id: "product-master",
      name: "Product Master",
      icon: "\u{1F4E6}",
      desc: "Core product data including product templates for creating products with similar characteristics, product hierarchies for organizing manufacturer catalogs, product parts for parent-child product relationships, and units of measure for order quantity calculations. Product managers are assigned as active planners for promotions.",
      tags: ["Product2", "cgcloud__Product_Template__c", "cgcloud__Product_Hierarchy__c", "cgcloud__Product_Part__c", "cgcloud__Unit_of_Measure__c", "cgcloud__Product_Category_Share__c", "PriceBook2"],
      connections: [
        { planet: "visit_execution", desc: "Products are surveyed and ordered during visits" },
        { planet: "van_sales", desc: "Products are stocked in warehouses for delivery" }
      ]
    },
    {
      id: "product-assortments",
      name: "Product Assortments",
      icon: "\u{1F4CB}",
      desc: "Defines which products are eligible for sale at specific stores. Assortment templates create reusable assortment definitions scoped to a sales org. Product listing modules filter products by category for different store formats. Store assortments link assortments to accounts, and child accounts inherit from parents in the trade org hierarchy.",
      tags: ["Assortment", "AssortmentProduct", "StoreAssortment", "StoreProduct", "cgcloud__Product_Assortment_Template__c", "cgcloud__Product_Listing_Module__c", "cgcloud__Listing_Module__c", "cgcloud__Product_Assortment_Product_Share__c", "cgcloud__Product_Assortment_Store__c"],
      connections: [
        { planet: "accounts_stores", desc: "Assortments are assigned to stores and accounts" },
        { planet: "visit_execution", desc: "Assortments determine available products during order taking" }
      ]
    },
    {
      id: "advanced-promotions",
      name: "Advanced Promotions",
      icon: "\u{1F3F7}",
      desc: "Sellable promotions for temporary price reductions, coupons, and in-store displays. Promotion templates define types, and tactics control promotion behavior at the lowest level. Promotions are pushed to customer hierarchies and linked to customer sets. Hurdles and expressions evaluate conditions to apply rewards to qualifying orders.",
      tags: ["cgcloud__Promotion__c", "cgcloud__Promotion_Template__c", "cgcloud__Promotion_Template_Hierarchy__c", "cgcloud__Tactic__c", "cgcloud__Tactic_Product__c", "cgcloud__Tactic_Template__c", "cgcloud__Promotion_Push_Status__c", "cgcloud__Promotion_Template_Tactic_Template__c"],
      connections: [
        { planet: "visit_execution", desc: "Promotions are executed and measured during store visits" },
        { planet: "accounts_stores", desc: "Promotions target customer sets and customer hierarchies" }
      ]
    },
    {
      id: "promotion-hurdles",
      name: "Promotion Hurdles & Rewards",
      icon: "\u{1F3C6}",
      desc: "Defines evaluation criteria for applying rewards to sellable promotions. Hurdles set parameters that must be met, expressions define the evaluation logic, and reward groups contain the incentives applied when hurdles are cleared. Rewards can be product-specific discounts or free items.",
      tags: ["cgcloud__Promotion_Hurdle__c", "cgcloud__Promotion_Hurdle_Expression__c", "cgcloud__Promotion_Reward_Group__c", "cgcloud__Promotion_Reward__c", "cgcloud__Promotion_Reward_Product__c"],
      connections: [
        { planet: "visit_execution", desc: "Hurdle evaluation happens during order pricing" }
      ]
    },
    {
      id: "sales-folders",
      name: "Sales Folders",
      icon: "\u{1F4C2}",
      desc: "Content management for sales reps during customer pitches. Sales folder templates create folder structures linked to customers or org units. Sell sheets group attachments like videos, images, and promotional materials. Promotion sales folders link promotions to their supporting content.",
      tags: ["cgcloud__Sales_Folder__c", "cgcloud__Sales_Folder_Template__c", "cgcloud__Sales_Folder_Sell_Sheet__c", "cgcloud__Sell_Sheet__c", "cgcloud__Promotion_Sales_Folder__c"],
      connections: [
        { planet: "mobile_app", desc: "Sales folder content syncs to mobile app for offline access" }
      ]
    },
    {
      id: "pricing-conditions",
      name: "Pricing & Conditions",
      icon: "\u{1F4B0}",
      desc: "Manages product and customer price conditions imported from ERP systems. Customer conditions define retailer or distributor pricing, product conditions set base prices, and customer-specific product conditions handle per-account pricing. Conditions integrate with penny perfect pricing for accurate order calculations.",
      tags: ["cgcloud__Product_Condition__c", "cgcloud__Account_Condition__c", "cgcloud__Account_Specific_Product_Condition__c", "cgcloud__Condition_Template__c"],
      connections: [
        { planet: "visit_execution", desc: "Pricing conditions drive order calculations during visits" },
        { planet: "accounts_stores", desc: "Customer conditions apply per account or customer set" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: Admin creates product templates and builds product hierarchies with units of measure",
    "Step 2: Product assortment templates define authorized product lists per store format using listing modules",
    "Step 3: Key account managers create promotions from templates with tactics, hurdles, and reward groups",
    "Step 4: Promotions are pushed to customer hierarchies and linked to sales folders with supporting content",
    "Step 5: Pricing conditions are imported from ERP and assigned to calculation schemas for penny perfect pricing"
  ],
  connections: [
    { planet: "accounts_stores", desc: "Products and assortments are assigned to stores and accounts" },
    { planet: "visit_execution", desc: "Products are ordered, surveyed, and promoted during visits" },
    { planet: "van_sales", desc: "Products are stocked in warehouses and loaded onto vehicles" },
    { planet: "mobile_app", desc: "Product data and sales folders sync to mobile devices" },
    { planet: "promotions", desc: "Product assortments define available products for TPM promotions" },
    { planet: "data_cloud", desc: "Product and assortment data mapped to Data Cloud DMOs" }
  ]
},

visit_planning: {
  packages: ['consumergoods'],
  name: "Visit Planning",
  icon: "\u{1F4C5}",
  color: "#a78bfa",
  description: "Orchestrates the creation and scheduling of store visits through multiple methods: manual creation, automatic generation from customer visit settings, job lists, trip lists, and map-based planning. Visit templates define visit types (sales, training, delivery, phone call) with configurable GPS tracking, geofencing, and time capture settings.",
  components: [
    {
      id: "visit-templates",
      name: "Visit Templates",
      icon: "\u{1F4DD}",
      desc: "Templates that define customer visit types such as sales visit, training, delivery visit, or phone call. Configure GPS tracking, geofencing validation at start and completion, visit duration defaults, and user role requirements. Templates determine the set of activities and order types available during visit execution.",
      tags: ["cgcloud__Visit_Template__c", "Visit"],
      connections: [
        { planet: "visit_execution", desc: "Visit templates control what activities are available during execution" },
        { planet: "van_sales", desc: "Delivery visit templates are used for DSD tours" }
      ]
    },
    {
      id: "automatic-visits",
      name: "Automatic Visit Creation",
      icon: "\u{2699}",
      desc: "Customer visit settings store the configuration for automated visit planning including visit frequency, preferred days, and time windows. The system generates visits automatically based on these settings, ensuring optimal coverage of the store portfolio without manual scheduling.",
      tags: ["cgcloud__Account_Visit_Setting__c", "Visit"],
      connections: [
        { planet: "accounts_stores", desc: "Visit settings are defined per account" },
        { planet: "maps_territory", desc: "Map-based visit creation uses store locations" }
      ]
    },
    {
      id: "action-plan-templates",
      name: "Action Plan Templates",
      icon: "\u{1F4CB}",
      desc: "Reusable frameworks for scheduling visits where the set of activities remains constant. Action plan templates are associated with stores through StoreActionPlanTemplate and assigned to standard visits. They bundle assessment task definitions and delivery tasks into a repeatable visit blueprint.",
      tags: ["ActionPlanTemplate", "StoreActionPlanTemplate"],
      connections: [
        { planet: "visit_execution", desc: "Action plans define the assessment tasks performed during visits" },
        { planet: "accounts_stores", desc: "Action plan templates are associated with stores" }
      ]
    },
    {
      id: "activities-job-lists",
      name: "Activities & Job Lists",
      icon: "\u{1F4DA}",
      desc: "Activities are lists of questions and surveys for reps to complete during visits. Job definition templates define individual data capture items (questions or surveys). Job templates control activity behavior and visibility on mobile. Activities can be standard (ongoing) or event-driven (promotion-linked). Job lists associate activities with visit templates for specific customers.",
      tags: ["cgcloud__Job_Definition_List__c", "cgcloud__Job_Definition_List_Template__c", "cgcloud__Job_Definition_Template__c", "cgcloud__Job_Template__c", "cgcloud__Job_List__c", "cgcloud__Data_Type__c"],
      connections: [
        { planet: "visit_execution", desc: "Activities and job lists drive data capture during visit execution" },
        { planet: "products_assortments", desc: "Event-driven activities are linked to promotions" }
      ]
    },
    {
      id: "trip-lists",
      name: "Trip Lists & Scheduling",
      icon: "\u{1F5D3}",
      desc: "Trip lists define sequences of customer visits for planning multi-stop routes. Supervisors create trip lists to schedule visits across multiple stores in an optimized sequence. Visits can also be created from barcode scans for ad-hoc store identification on the mobile app.",
      tags: ["Visit", "cgcloud__Visit_Template__c"],
      connections: [
        { planet: "maps_territory", desc: "Trip lists can be optimized using Salesforce Maps routing" },
        { planet: "mobile_app", desc: "Trip lists and ad-hoc visits are created on the mobile app" }
      ]
    },
    {
      id: "substitution-management",
      name: "Substitution Management",
      icon: "\u{1F504}",
      desc: "Maintains service continuity when reps are unavailable. Substitution records manage planned and unplanned absences by assigning substitute reps to specific customers for defined periods. One substitute can cover one or multiple customers, ensuring visits are not missed.",
      tags: ["cgcloud__Substitution__c", "cgcloud__User_Setting__c"],
      connections: [
        { planet: "accounts_stores", desc: "Substitutions are assigned per customer" },
        { planet: "visit_execution", desc: "Substitute reps execute visits on behalf of absent reps" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: Admin creates visit templates defining visit types, GPS settings, and activity configurations",
    "Step 2: Supervisors set up customer visit settings for automatic visit generation based on frequency and timing",
    "Step 3: Activities and job definition templates are created and assigned to visit templates via job lists",
    "Step 4: Visits are created manually, automatically, from job lists, trip lists, or map-based selection",
    "Step 5: Action plan templates bundle assessment tasks and are associated with stores and visits"
  ],
  connections: [
    { planet: "accounts_stores", desc: "Visits target accounts and retail stores" },
    { planet: "visit_execution", desc: "Planned visits are executed by field reps" },
    { planet: "maps_territory", desc: "Map-based visit creation and route optimization" },
    { planet: "mobile_app", desc: "Visit planning and ad-hoc visits available on mobile" },
    { planet: "van_sales", desc: "Delivery visits are planned for DSD tours" },
    { planet: "agentforce", desc: "Visit Assistant supports field rep visit planning" },
    { planet: "einstein_ai", desc: "Einstein recommendations influence visit planning priorities" }
  ]
},

visit_execution: {
  packages: ['consumergoods'],
  name: "Visit Execution",
  icon: "\u{2705}",
  color: "#f472b6",
  description: "The core operational domain where field reps perform retail activities during store visits. Covers assessment tasks and KPIs for compliance measurement, advanced orders with penny perfect pricing, inventory checks, surveys, daily reports, signatures, and workflow automation. Supports both base model (standard visits with action plans) and enhanced model (advanced visits with templates and offline execution).",
  components: [
    {
      id: "assessment-tasks",
      name: "Assessment Tasks & KPIs",
      icon: "\u{1F4CA}",
      desc: "Assessment indicator definitions define KPI metrics (numerical, decimal, text, date-time, boolean) for measuring store performance. Assessment task definitions bundle metrics into retail activities. Retail store KPIs set target compliance values per store group. Retail visit KPIs capture actual values during visits for compliance scoring.",
      tags: ["AssessmentIndicatorDefinition", "AssessmentTask", "AssessmentTaskDefinition", "AssessmentTaskIndDefinition", "RetailStoreKpi", "RetailVisitKpi", "AssessmentTaskContentDocument"],
      connections: [
        { planet: "visit_planning", desc: "Assessment task definitions are bundled into action plan templates" },
        { planet: "accounts_stores", desc: "KPI targets are defined per store group via retail store KPIs" }
      ]
    },
    {
      id: "advanced-orders",
      name: "Advanced Orders & Pricing",
      icon: "\u{1F6D2}",
      desc: "Full order management during visits including standard pre-orders, return orders, van sales orders, and advertising material orders. Order templates define characteristics and available item types. Penny perfect pricing uses calculation schemas, pricing condition templates, key types, and search strategies for precise price calculations with user exit customization hooks.",
      tags: ["cgcloud__Order__c", "cgcloud__Order_Item__c", "cgcloud__Order_Template__c", "cgcloud__Order_Item_Template__c", "AssessmentTaskOrder", "cgcloud__CP_Calculation_Schema__c", "cgcloud__CP_Pricing_Condition_Template__c", "cgcloud__CP_Pricing_Condition__c", "cgcloud__CP_Key_Type__c", "cgcloud__CP_Search_Strategy__c", "cgcloud__CP_Key_Attribute__c", "cgcloud__System_Number__c"],
      connections: [
        { planet: "products_assortments", desc: "Orders use product assortments and pricing conditions" },
        { planet: "van_sales", desc: "Van sales orders are placed during delivery tours" }
      ]
    },
    {
      id: "visit-jobs",
      name: "Visit Jobs & Surveys",
      icon: "\u{1F4DD}",
      desc: "Responses captured during visit execution including answers to store-related questions and product surveys. Visit jobs record data against job definition templates for each activity. Historic products track which products reps add during surveys so they can be quickly added in future visits.",
      tags: ["cgcloud__Visit_Job__c", "cgcloud__Historic_Product__c", "cgcloud__Field_Sales_Activity__c"],
      connections: [
        { planet: "visit_planning", desc: "Visit jobs correspond to activities and job definition templates" },
        { planet: "mobile_app", desc: "Survey responses are captured offline on mobile devices" }
      ]
    },
    {
      id: "daily-reports",
      name: "Daily Reports",
      icon: "\u{1F4C6}",
      desc: "Tracks productive and unproductive time for sales reps throughout the day. Daily report templates define activity categories and maximum durations. Reps log time against activities including customer visits, research, breaks, and travel. Visit Calendar enables reps to create and maintain daily and weekly visit schedules.",
      tags: ["cgcloud__User_Document__c", "cgcloud__User_Document_Activity__c", "cgcloud__User_Document_Template__c", "cgcloud__User_Document_Template_Activity__c"],
      connections: [
        { planet: "mobile_app", desc: "Daily reports are created and maintained on the mobile app" }
      ]
    },
    {
      id: "signatures",
      name: "Signatures & Approvals",
      icon: "\u{1F58A}",
      desc: "Configurable signature capture for business processes like orders, contracts, and daily reports. Signature templates define the flow with multiple signature steps from different roles. Signature attributes capture contextual data like signatory name and order amount. Approval codes authenticate critical DSD transactions.",
      tags: ["cgcloud__Signature__c", "cgcloud__Signature_Template__c", "cgcloud__Signature_Flow_Step__c", "cgcloud__Signature_Attribute__c", "cgcloud__Approval_Code__c"],
      connections: [
        { planet: "van_sales", desc: "Signatures are required for delivery confirmations and cash handling" },
        { planet: "mobile_app", desc: "Signatures are captured on mobile device touchscreens" }
      ]
    },
    {
      id: "workflows",
      name: "Workflows & Automation",
      icon: "\u{1F504}",
      desc: "Reusable workflow definitions that automate business processes across customer tasks, daily reports, activities, and order promotions. Each workflow is scoped to a single business process. Workflows drive status transitions and validation logic for visit-related operations.",
      tags: ["cgcloud__Workflow__c", "cgcloud__KPI_Set__c"],
      connections: [
        { planet: "visit_planning", desc: "Workflows automate visit lifecycle state transitions" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: Field rep starts a visit at a retail store, GPS location is validated against geofencing rules",
    "Step 2: Rep executes assessment tasks capturing KPI values for product placement, shelf compliance, and promotions",
    "Step 3: Orders are placed using product assortments with penny perfect pricing calculating exact amounts",
    "Step 4: Surveys and store-level questions are answered, and signatures are captured for order confirmation",
    "Step 5: Daily reports log productive time, and all visit data syncs back to Salesforce for analytics"
  ],
  connections: [
    { planet: "visit_planning", desc: "Planned visits and activities are executed by field reps" },
    { planet: "products_assortments", desc: "Orders use assortments, promotions drive pricing" },
    { planet: "van_sales", desc: "Delivery orders and inventory updates during DSD execution" },
    { planet: "mobile_app", desc: "Visit execution happens primarily on the offline mobile app" },
    { planet: "accounts_stores", desc: "Visit data enriches account and store records" },
    { planet: "maps_territory", desc: "Visit GPS data and compliance metrics feed territory views" },
    { planet: "analytics", desc: "Visit execution metrics feed CRM Analytics dashboards" },
    { planet: "agentforce", desc: "Retail Execution agents guide in-store task completion" },
    { planet: "einstein_ai", desc: "Visit execution data trains and validates Einstein models" },
    { planet: "data_cloud", desc: "Visit execution data flows into Data Cloud for unified analytics" }
  ]
},

van_sales: {
  packages: ['consumergoods'],
  name: "Van Sales & DSD",
  icon: "\u{1F69A}",
  color: "#fb923c",
  description: "Direct Store Delivery (DSD) and van sales operations covering routes, tours, warehouses, vehicles, and inventory management. Routes define customer stop sequences with assigned warehouses and vehicles. Tours are executable daily trips created from routes or independently. Inventory tracking covers product stock, customer quotas, and cash float with full transaction audit trails.",
  components: [
    {
      id: "routes",
      name: "Routes & Route Management",
      icon: "\u{1F6E3}",
      desc: "Routes define delivery, sales, or merchandising trip patterns with assigned warehouses, default users, and vehicles. Route customers specify the ordered sequence of stops with visit types. Route templates configure route types for different markets. Supervisors manage customer sequences using drag-and-drop ordering.",
      tags: ["cgcloud__Route__c", "cgcloud__Route_Account__c", "cgcloud__Route_Template__c"],
      connections: [
        { planet: "accounts_stores", desc: "Routes contain ordered sequences of customer stops" },
        { planet: "maps_territory", desc: "Route optimization uses map-based distance calculations" }
      ]
    },
    {
      id: "tours",
      name: "Tours & Tour Execution",
      icon: "\u{1F4CD}",
      desc: "Tours are executable daily trips created from routes or independently via tour templates. Tour templates configure start/end day activities, vehicle checks, security inspections, and GPS tracking. Tour checks validate vehicle condition (brakes, lights, tires) at start and end of day. Drivers complete pre-tour and post-tour activities at the warehouse.",
      tags: ["cgcloud__Tour__c", "cgcloud__Tour_Template__c", "cgcloud__Tour_Check__c", "cgcloud__Tour_Template_Tour_Check__c", "cgcloud__Tour_Template_Object_Reference__c"],
      connections: [
        { planet: "visit_execution", desc: "Tours contain ordered visits that are executed sequentially" },
        { planet: "mobile_app", desc: "Tour cockpit and driver cockpit are on the mobile app" }
      ]
    },
    {
      id: "warehouses",
      name: "Warehouses",
      icon: "\u{1F3ED}",
      desc: "Manufacturer depots from which drivers start delivery tours. Warehouses store products, are assigned users (drivers), and have vehicles. Warehouse products define which items can be shipped. Warehouse users control which drivers can check out inventory.",
      tags: ["cgcloud__Warehouse__c", "cgcloud__Warehouse_Product__c", "cgcloud__Warehouse_User__c", "cgcloud__Vehicle_Warehouse__c"],
      connections: [
        { planet: "products_assortments", desc: "Warehouses stock products from the product catalog" },
        { planet: "accounts_stores", desc: "Warehouses belong to sales organizations" }
      ]
    },
    {
      id: "vehicles",
      name: "Vehicles",
      icon: "\u{1F69B}",
      desc: "Vehicle records for trucks, trailers, and standard cars used to transport goods. Vehicle types include Car Standard, Truck Slow, Truck Fast, and Trailer. Vehicles are assigned to warehouses and to specific tours. Vehicle-user assignments ensure only authorized drivers operate each vehicle.",
      tags: ["cgcloud__Vehicle__c", "cgcloud__Vehicle_Warehouse__c"],
      connections: [
        { planet: "mobile_app", desc: "Vehicle identification and inspection happens on mobile" }
      ]
    },
    {
      id: "inventory-management",
      name: "Inventory & Transactions",
      icon: "\u{1F4E5}",
      desc: "Real-time tracking of product quantities and flow. Inventory records track product stock, customer quotas, and cash float. Inventory control templates define record types and policies for user, vehicle, and tour assignments. Transaction templates define movement behavior (addition, withdrawal, balance, void). Transactions are created automatically when orders are released.",
      tags: ["cgcloud__Inventory__c", "cgcloud__Inventory_Transaction__c", "cgcloud__Inventory_Control_Template__c", "cgcloud__Inventory_Transaction_Template__c", "ProductTransfer", "ProductItem", "Shipment"],
      connections: [
        { planet: "visit_execution", desc: "Inventory changes when orders are placed and delivered" },
        { planet: "mobile_app", desc: "Inventory check-out and check-in happens on mobile" }
      ]
    },
    {
      id: "order-payments",
      name: "Order Payments & Invoicing",
      icon: "\u{1F4B3}",
      desc: "Payment processing for van sales and delivery orders. Order payment templates define payment methods (cash, credit card, debit card, check). Invoices are generated as cash or credit documents. Cash handling tracks payment collection and reconciliation during tours. Delivery documents manage preordered product fulfillment.",
      tags: ["cgcloud__Order_Payment__c", "cgcloud__Order_Payment_Template__c", "cgcloud__Order_Payment_Inventory_Transaction__c", "cgcloud__Order_Template_Order_Payment_Template__c", "DeliveryTask"],
      connections: [
        { planet: "visit_execution", desc: "Order payments are processed during visit finalization" },
        { planet: "accounts_stores", desc: "Payment terms are defined per customer relationship" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: Supervisor creates routes with ordered customer stops, assigned warehouses, vehicles, and drivers",
    "Step 2: Tours are generated from routes for specific days, pre-populating visit sequences and driver assignments",
    "Step 3: Driver starts tour at warehouse, performs vehicle inspection, checks out inventory to the truck",
    "Step 4: At each stop, driver executes visits, places or delivers orders, collects payments, captures signatures",
    "Step 5: Driver returns to warehouse, performs end-of-day check-in, reconciles cash, and completes the tour"
  ],
  connections: [
    { planet: "visit_execution", desc: "Van sales orders and deliveries happen during visits" },
    { planet: "products_assortments", desc: "Warehouses stock products; orders use assortments" },
    { planet: "accounts_stores", desc: "Routes serve ordered sequences of customer accounts" },
    { planet: "mobile_app", desc: "DSD operations run on the offline mobile app" },
    { planet: "maps_territory", desc: "Route planning benefits from map visualization" },
    { planet: "visit_planning", desc: "Tour schedules and route stops feed visit planning" },
    { planet: "einstein_ai", desc: "Product velocity insights inform van sales loading" }
  ]
},

mobile_app: {
  packages: ['consumergoods'],
  name: "Mobile & Sync",
  icon: "\u{1F4F1}",
  color: "#22d3ee",
  description: "The Consumer Goods Cloud offline mobile app and its synchronization infrastructure. The mobile app supports full offline visit execution, DSD operations, surveys, orders, and asset management. Sync Management controls bidirectional data flow between Salesforce and mobile devices using tracked objects, named queries, and named fetch trees. VS Code Based Modeler enables app customization.",
  components: [
    {
      id: "offline-mobile-app",
      name: "CG Offline Mobile App",
      icon: "\u{1F4F2}",
      desc: "Native mobile application for field reps supporting full offline operation. Two UI flows: existing (standard visits with assessment tasks) and new (offline visit planning, advanced orders, CRM Analytics, editable master data). Supports attachment handling, barcode scanning, GPS tracking, and Bluetooth device connectivity.",
      tags: ["Visit", "cgcloud__Order__c", "cgcloud__Visit_Job__c"],
      connections: [
        { planet: "visit_execution", desc: "All visit execution happens through the mobile app" },
        { planet: "van_sales", desc: "DSD tour operations run on mobile with driver and tour cockpits" }
      ]
    },
    {
      id: "sync-management",
      name: "Sync Management",
      icon: "\u{1F504}",
      desc: "Configures bidirectional data synchronization between Salesforce and mobile devices. Sync types include Initial Sync, First-Sync-of-Day, Background Sync, On-Demand Sync, and Sync On Resume. The Sync Management app provides configuration, monitoring, sync history, device health dashboards, and error troubleshooting.",
      tags: ["Sync_Config__c", "Sync_Tracked_Object_Config__c"],
      connections: [
        { planet: "accounts_stores", desc: "Customer master data is synced to devices" },
        { planet: "products_assortments", desc: "Product and assortment data syncs to mobile" }
      ]
    },
    {
      id: "tracked-objects",
      name: "Tracked Objects",
      icon: "\u{1F4BE}",
      desc: "Standard or custom objects synced to mobile devices as database tables. Each tracked object has a SOQL Where clause controlling which records sync. Configurations can be hierarchical with Standard, child, and grandchild levels. Tracked objects are associated with a parent configuration and scoped by SOQL query result sets.",
      tags: ["Sync_Tracked_Object_Config__c"],
      connections: [
        { planet: "visit_execution", desc: "Visit and order data tracked for offline access" }
      ]
    },
    {
      id: "named-queries-fetch-trees",
      name: "Named Queries & Fetch Trees",
      icon: "\u{1F333}",
      desc: "Named queries are SOQL statements returning ID lists to restrict synced data, supporting nested queries. Named fetch trees (NFTs) describe hierarchical object relationships for efficient multi-object data fetching in one request. NFTs reduce API calls and simplify tracked object Where clauses for complex data relationships.",
      tags: ["Sync_Named_Fetch_Tree_Nodes__c"],
      connections: [
        { planet: "accounts_stores", desc: "NFTs fetch complete store information in one request" }
      ]
    },
    {
      id: "vs-code-modeler",
      name: "VS Code Based Modeler",
      icon: "\u{1F527}",
      desc: "Design and customize the Consumer Goods Cloud mobile app using Visual Studio Code. Design contracts are XML files specifying UI, processes, objects, data sources, labels, and model components. Deployment packages bundle customizations for upload through the Sync Management app to push changes to field reps.",
      tags: [],
      connections: [
        { planet: "visit_execution", desc: "Modeler customizes visit execution screens and workflows" }
      ]
    },
    {
      id: "agentforce-mobile",
      name: "Agentforce for Mobile",
      icon: "\u{1F916}",
      desc: "AI agents integrated into the Consumer Goods Cloud mobile app for field rep assistance. Agents provide account revenue insights, order history, product performance data, and compliance information from audits. Requires online connectivity and works with the Agentforce Employee Agent type. Enabled through Sync Configuration settings.",
      tags: [],
      connections: [
        { planet: "visit_planning", desc: "Agents suggest visits and provide visit insights" },
        { planet: "visit_execution", desc: "Agents recommend products and promotions during visits" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: Admin configures tracked objects, named queries, and named fetch trees in the Sync Management app",
    "Step 2: Mobile app performs Initial Sync downloading configuration, metadata, and business data to the device",
    "Step 3: Field rep executes visits, orders, surveys, and DSD operations offline throughout the day",
    "Step 4: Background sync or manual sync uploads captured data and downloads updates from Salesforce",
    "Step 5: VS Code Modeler customizations are deployed via deployment packages through Sync Management"
  ],
  connections: [
    { planet: "visit_execution", desc: "Mobile app is the primary platform for visit execution" },
    { planet: "van_sales", desc: "DSD and van sales operations run on mobile devices" },
    { planet: "visit_planning", desc: "Offline visit planning and ad-hoc visit creation on mobile" },
    { planet: "accounts_stores", desc: "Customer master data syncs to and from mobile devices" },
    { planet: "products_assortments", desc: "Product catalogs and sales folders sync to mobile devices" },
    { planet: "agentforce", desc: "Agents are accessible through the mobile app interface" }
  ]
},

maps_territory: {
  packages: ['consumergoods'],
  name: "Maps & Territory",
  icon: "\u{1F5FA}",
  color: "#4ade80",
  description: "Salesforce Maps integration for visualizing and managing retail territories. Provides map-based store visualization, route optimization for field reps, the Nearby Map component for finding stores near a location, and territory-based visit creation. Supports advanced Salesforce Maps features for route planning and travel time optimization.",
  components: [
    {
      id: "salesforce-maps",
      name: "Salesforce Maps Integration",
      icon: "\u{1F30D}",
      desc: "Core integration with Salesforce Maps for visualizing retail stores on interactive maps. Sales managers track stores in their territories with map-based data visualization. Provides territory views showing store distribution, compliance heat maps, and visit coverage overlays.",
      tags: ["RetailStore", "Account", "Location"],
      connections: [
        { planet: "accounts_stores", desc: "Stores and accounts are plotted on maps by location" },
        { planet: "visit_planning", desc: "Maps provide territory context for visit planning decisions" }
      ]
    },
    {
      id: "nearby-map",
      name: "Nearby Map Component",
      icon: "\u{1F4CD}",
      desc: "Lightning component that shows stores near a specific location. Field reps use the nearby map to discover stores in proximity for ad-hoc visits. The component integrates with GPS location data to show real-time distance and direction to surrounding retail stores.",
      tags: ["RetailStore", "Location"],
      connections: [
        { planet: "visit_planning", desc: "Nearby stores can be selected for ad-hoc visit creation" },
        { planet: "mobile_app", desc: "Nearby map works with mobile GPS for location awareness" }
      ]
    },
    {
      id: "route-optimization",
      name: "Route Optimization",
      icon: "\u{1F6A9}",
      desc: "Calculates optimal visit routes with minimum travel time for field reps. Considers store operating hours, visit durations, and travel constraints. Route optimization ensures the right stores are visited at the right time while minimizing windshield time between stops.",
      tags: ["Visit", "RetailStore", "OperatingHours"],
      connections: [
        { planet: "van_sales", desc: "DSD route sequences can be optimized for delivery efficiency" },
        { planet: "visit_planning", desc: "Optimized routes feed into trip list creation" }
      ]
    },
    {
      id: "map-based-visits",
      name: "Map-Based Visit Creation",
      icon: "\u{1F4CC}",
      desc: "Create visits by selecting stores directly on the map interface. Supervisors and reps can visually identify unvisited stores, plan coverage, and create visits for selected locations. Supports multi-select for batch visit creation across a territory region.",
      tags: ["Visit", "RetailStore"],
      connections: [
        { planet: "visit_planning", desc: "Map selections drive visit creation" },
        { planet: "accounts_stores", desc: "Map shows store details and visit history" }
      ]
    },
    {
      id: "territory-visualization",
      name: "Territory Visualization",
      icon: "\u{1F3D9}",
      desc: "Displays org unit territories and sales organization boundaries on the map. Managers visualize rep coverage areas, identify territory gaps, and balance workloads. Territories overlay with store locations, visit status, and compliance metrics for strategic planning.",
      tags: ["cgcloud__Org_Unit__c", "cgcloud__Sales_Organization__c", "RetailStore"],
      connections: [
        { planet: "accounts_stores", desc: "Org units and sales orgs define territory boundaries" },
        { planet: "visit_execution", desc: "Visit compliance and KPI data overlays on territory maps" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: Store locations and territory boundaries are plotted on Salesforce Maps from account and org unit data",
    "Step 2: Managers use map views to assess territory coverage and identify stores needing visits",
    "Step 3: Route optimization calculates minimum-travel-time paths for field rep visit sequences",
    "Step 4: Reps create visits by selecting stores on the map or using the Nearby Map component",
    "Step 5: Optimized routes are assigned to reps and sync to mobile devices for execution"
  ],
  connections: [
    { planet: "visit_planning", desc: "Map-based visit creation and route optimization" },
    { planet: "accounts_stores", desc: "Store locations and territories displayed on maps" },
    { planet: "van_sales", desc: "Route planning for delivery tours" },
    { planet: "visit_execution", desc: "Visit GPS and compliance data feed territory map overlays" }
  ]
},

// ═══════════════════════════════════════════════════
//  TRADE PROMOTION MANAGEMENT PILLAR
// ═══════════════════════════════════════════════════

tpm_master_data: {
  packages: ['consumergoods'],
  name: "TPM Master Data",
  icon: "\u{1F4C1}",
  color: "#fbbf24",
  description: "The foundation of Trade Promotion Management. Master Data encompasses customer hierarchies, product catalogs, sales organizations, and user management. It collects, aggregates, and distributes data consistently across all TPM business processes including promotions, tactics, funds, and claims, with support for multi-market segmentation through sales organizations.",
  components: [
    {
      id: "tpm-customer-master",
      name: "Customer Master",
      icon: "\u{1F465}",
      desc: "Stores customer hierarchies, contacts, roles, and relationships. Account Extensions hold TPM-specific attributes like promotion validity, account plan type, fund validity, and overdraft details. Trade Org Hierarchies define parent-child account relationships for planning at headquarter and store levels.",
      tags: ["Account", "cgcloud__Account_Extension__c", "cgcloud__Account_Relationship__c", "cgcloud__Account_Template__c", "cgcloud__Account_Trade_Org_Hierarchy__c", "cgcloud__Sub_Account__c"],
      connections: [
        { planet: "promotions", desc: "Customer records anchor promotions" },
        { planet: "account_planning", desc: "Accounts drive business plans and P&L views" }
      ]
    },
    {
      id: "tpm-product-master",
      name: "Product Master",
      icon: "\u{1F4E6}",
      desc: "Contains all sellable products, advertising material, and competitor products organized in hierarchies by category, subcategory, brand, and flavor. Product Conditions define price types and price lists. Product Parts describe bundled bill-of-material relationships. Product Templates group products by sales organization.",
      tags: ["Product2", "cgcloud__Product_Hierarchy__c", "cgcloud__Product_Part__c", "cgcloud__Product_Template__c", "cgcloud__Product_Condition__c", "cgcloud__Product_Category_Share__c"],
      connections: [
        { planet: "promotions", desc: "Products are resolved into promotion tactics" },
        { planet: "products_assortments", desc: "Products feed into store assortment lists" }
      ]
    },
    {
      id: "tpm-sales-organizations",
      name: "Sales Organizations",
      icon: "\u{1F3E2}",
      desc: "Business segments that structure data and processes by organizational unit, enabling multi-market management in a single Salesforce org. Each business template is tied to a sales org, and records created using those templates are scoped to the related org.",
      tags: ["cgcloud__Sales_Organization__c"],
      connections: [
        { planet: "promotions", desc: "Sales org scopes promotion templates" },
        { planet: "funds_budgets", desc: "Sales org scopes fund templates" }
      ]
    },
    {
      id: "tpm-user-management",
      name: "User & Substitution",
      icon: "\u{1F464}",
      desc: "Manages TPM user roles (KAM, Business Admin, Finance Manager), user settings for account and promotion views, working days, KPI subsets, and substitution for unavailable sales reps.",
      tags: ["User", "cgcloud__User_Setting__c", "cgcloud__User_View__c"],
      connections: [
        { planet: "promotions", desc: "Users manage and own promotions" },
        { planet: "account_planning", desc: "KAMs own account plans and business plans" }
      ]
    },
    {
      id: "tpm-account-sets",
      name: "Account Sets",
      icon: "\u{1F4CB}",
      desc: "Groups of customers who perform similar activities such as promotions, pricing, or marketing. Account sets can be created manually, integrated through external systems, or built via segmentation rules.",
      tags: ["cgcloud__Account_Set__c", "cgcloud__Account_Set_Account__c"],
      connections: [
        { planet: "promotions", desc: "Account sets define promotion customer scope" },
        { planet: "data_cloud", desc: "Segmentation rules feed account set creation" }
      ]
    },
    {
      id: "distribution-profiles",
      name: "Distribution Profiles",
      icon: "\u{1F4C5}",
      desc: "Stores customer information about the breakdown of product or category deliveries for each day of the week. Weekly profiles are updated when rates change during the week or during mid-week promotions, enabling accurate sub-weekly KPI calculations.",
      tags: ["cgcloud__Week_Day_Share_Profile__c"],
      connections: [
        { planet: "analytics", desc: "Distribution profiles feed sub-weekly KPI calculations" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: ERP system populates accounts, products, and hierarchies via MuleSoft Direct or API integration",
    "Step 2: Admin configures sales organizations and creates business templates scoped to each market",
    "Step 3: Customer extensions, trade org hierarchies, and account relationships are established for each account",
    "Step 4: Product hierarchies, conditions, and assortment templates are configured for promotion resolution",
    "Step 5: SF Data Sync batch process synchronizes master data to CG Cloud Processing Services"
  ],
  connections: [
    { planet: "promotions", desc: "Master data provides customers and products for promotion planning" },
    { planet: "funds_budgets", desc: "Accounts and products anchor fund allocation" },
    { planet: "claims", desc: "Customer master determines claim recipients and payment relationships" },
    { planet: "account_planning", desc: "Account hierarchies structure business plan P&L views" },
    { planet: "accounts_stores", desc: "Customer master shares account hierarchies with Retail Execution" }
  ]
},

promotions: {
  packages: ['consumergoods'],
  name: "Promotions",
  icon: "\u{1F3AF}",
  color: "#f87171",
  description: "The core of Trade Promotion Management. Promotions are agreements between manufacturers and retailers to increase revenue and market share through temporary price reductions, coupons, in-store displays, and advertisements. KAMs plan, run, and monitor promotions with tactics defining the specific activities and their costs.",
  components: [
    {
      id: "advanced-tpm-promotions",
      name: "Advanced Promotions",
      icon: "\u{1F4E2}",
      desc: "Stores promotion records with customer anchoring, date ranges, status workflow, and child promotion hierarchies. Supports mega events, back-to-school campaigns, and seasonal promotions. Products are resolved through filter expressions using hierarchies and non-hierarchical attributes.",
      tags: ["cgcloud__Promotion__c", "cgcloud__Promotion_Attachment__c", "cgcloud__Promotion_Attachment_Link__c"],
      connections: [
        { planet: "funds_budgets", desc: "Promotions consume budget from linked funds" },
        { planet: "claims", desc: "Executed promotions generate retailer claims" }
      ]
    },
    {
      id: "tactics",
      name: "Tactics",
      icon: "\u{1F3AD}",
      desc: "Promotional tasks carried out by retailers: displays for shelf visibility, price reductions, advertisements, and consumer coupons. Each tactic is anchored to a promotion and linked to one or more funds.",
      tags: ["cgcloud__Tactic__c", "cgcloud__Tactic_Template__c", "cgcloud__Tactic_Product__c", "cgcloud__Tactic_Product_Condition__c"],
      connections: [
        { planet: "funds_budgets", desc: "Tactics are linked to funds that pay for them" },
        { planet: "claims", desc: "Claims compensate retailers for executed tactics" }
      ]
    },
    {
      id: "trade-calendar",
      name: "Trade Calendar",
      icon: "\u{1F5D3}",
      desc: "Customizable calendar view displaying events and promotions on a single screen, providing KAMs with a console to plan trade promotions. Helps identify gaps, monitor execution, and visualize overlapping promotions across time periods.",
      tags: ["cgcloud__User_View__c"],
      connections: [
        { planet: "account_planning", desc: "Calendar shows account plan timelines alongside promotions" },
        { planet: "analytics", desc: "Calendar surfaces KPI data for promotion periods" }
      ]
    },
    {
      id: "smart-ui",
      name: "Smart UI",
      icon: "\u{26A1}",
      desc: "Configurable Lightning Components interface that eliminates repetitive click-and-save actions. KAMs can create a full promotion including header, tactics, and product assignments in a single Edit mode session.",
      tags: [],
      connections: [
        { planet: "tpm_master_data", desc: "Smart UI reads templates and master data for form configuration" }
      ]
    },
    {
      id: "kpi-definitions",
      name: "KPI Definitions",
      icon: "\u{1F4CA}",
      desc: "Defines key performance indicators as monetary, volume, or percentage measures shown in promotions, account plans, and claims. KPI Sets group individual KPIs and are mapped to business processes through templates.",
      tags: ["cgcloud__KPI_Definition__c", "cgcloud__KPI_Set__c"],
      connections: [
        { planet: "analytics", desc: "KPI definitions drive real-time reporting and dashboards" },
        { planet: "account_planning", desc: "KPI sets are shared between promotions and account plans" }
      ]
    },
    {
      id: "promotion-push",
      name: "Push Promotions",
      icon: "\u{1F4E4}",
      desc: "Enables headquarter-level promotions to be pushed down to child accounts in the trade org hierarchy. Child accounts inherit promotion activities from their parent, allowing centralized planning with distributed execution.",
      tags: ["cgcloud__Promotion__c", "cgcloud__Account_Trade_Org_Hierarchy__c"],
      connections: [
        { planet: "tpm_master_data", desc: "Push promotions follow the trade org hierarchy structure" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: KAM selects customer and promotion template to create a new promotion",
    "Step 2: Tactics are added with type (display, price reduction, ad) and anchored to product groups",
    "Step 3: Funds are linked to tactics and KPIs are calculated via processing services",
    "Step 4: Promotion is submitted through approval workflow and published to the trade calendar",
    "Step 5: After execution, actual values are collected and KPIs recalculated for P&L analysis"
  ],
  connections: [
    { planet: "tpm_master_data", desc: "Promotions use customer and product master data" },
    { planet: "funds_budgets", desc: "Promotion tactics consume allocated fund budgets" },
    { planet: "claims", desc: "Executed promotions generate claims for retailer compensation" },
    { planet: "account_planning", desc: "Promotion KPIs roll up into account plan P&L" },
    { planet: "analytics", desc: "Promotion performance is tracked via real-time reporting" },
    { planet: "products_assortments", desc: "Product assortments define available products for promotions" },
    { planet: "agentforce", desc: "KAM Agent manages promotion lifecycle" },
    { planet: "data_cloud", desc: "Promotion data feeds accrual calculations and segmentation" }
  ]
},

funds_budgets: {
  packages: ['consumergoods'],
  name: "Funds & Budgets",
  icon: "\u{1F4B0}",
  color: "#c084fc",
  description: "Fund management controls promotional budgets allocated to Key Account Managers. Finance managers create funds for customers, customer-category, or customer-brand combinations. Rate-Based Funding provides flexible budgets tied to sales volumes or revenue percentages, with multi-fund transactions enabling complex budget operations.",
  components: [
    {
      id: "fund-management",
      name: "Fund Management",
      icon: "\u{1F3E6}",
      desc: "Funds hold money allocated for promotional activities. Finance managers create funds using templates that dictate properties like currency, customer anchor, and product anchor.",
      tags: ["cgcloud__Fund__c", "cgcloud__Fund_Template__c"],
      connections: [
        { planet: "promotions", desc: "Funds pay for promotion tactics" },
        { planet: "claims", desc: "Claims settle against fund balances" }
      ]
    },
    {
      id: "rate-based-funding",
      name: "Rate-Based Funding",
      icon: "\u{1F4C8}",
      desc: "Flexible budgets that adjust based on latest estimates: actual values for past weeks and planned values for future weeks. RBFs can be based on product sales volume, revenue percentage, or fixed rates.",
      tags: ["cgcloud__Rate_Based_Funding__c", "cgcloud__RBF_Template__c", "cgcloud__Parent_RBF__c"],
      connections: [
        { planet: "tpm_master_data", desc: "RBFs are anchored to customer and product combinations" },
        { planet: "analytics", desc: "RBF values are driven by KPI calculations" }
      ]
    },
    {
      id: "multi-fund-transactions",
      name: "Multi-Fund Transactions",
      icon: "\u{1F4B1}",
      desc: "Transactions to create, adjust, transfer, and draw back fund budgets. Transfer transactions move money between funds. Each transaction creates debit and credit rows.",
      tags: ["cgcloud__Fund_Transaction_Header__c", "cgcloud__Fund_Transaction__c", "cgcloud__Fund_Transaction_Row__c", "cgcloud__Fund_Transaction_Template__c"],
      connections: [
        { planet: "claims", desc: "Fund transactions record claim settlement debits" },
        { planet: "tpm_master_data", desc: "Transactions scoped by sales organization" }
      ]
    },
    {
      id: "fund-kpis",
      name: "Fund KPIs",
      icon: "\u{1F4CA}",
      desc: "KPI sets track budget utilization, committed spend, remaining balance, and overdraft status. KPIs at parent fund levels are read-only aggregations of child fund KPIs.",
      tags: ["cgcloud__KPI_Definition__c", "cgcloud__KPI_Set__c"],
      connections: [
        { planet: "analytics", desc: "Fund KPIs feed real-time budget reports" },
        { planet: "account_planning", desc: "Fund utilization reflects in account plan P&L" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: Finance manager creates fund using a fund template, anchored to customer and/or product",
    "Step 2: Initial multi-fund transaction allocates budget to the fund with debit/credit rows",
    "Step 3: KAMs link funds to promotion tactics, committing budget against the fund balance",
    "Step 4: Transfer transactions redistribute funds between regional accounts as needed",
    "Step 5: Claims processing debits settled amounts from funds and updates fund KPIs"
  ],
  connections: [
    { planet: "promotions", desc: "Funds provide budgets for promotion tactics" },
    { planet: "tpm_master_data", desc: "Funds are anchored to customer and product master data" },
    { planet: "claims", desc: "Claim settlements debit fund balances" },
    { planet: "account_planning", desc: "Fund allocation aligns with account plan targets" },
    { planet: "analytics", desc: "Fund utilization tracked via KPI reporting" }
  ]
},

claims: {
  packages: ['consumergoods'],
  name: "Claims",
  icon: "\u{1F4DD}",
  color: "#e879f9",
  description: "After promotion tactics are executed, retailers send payment requests (claims) as compensation for expenses incurred. Claims management handles the full settlement lifecycle from creation through approval to payment, integrating with Accounts Receivable and Accounts Payable.",
  components: [
    {
      id: "claims-processing",
      name: "Claims Processing",
      icon: "\u{1F4DD}",
      desc: "Claims (Payment objects) specify remuneration to customers for running promotion tactics. Claim types: Deduction, Credit Memo, Check Request, and Invoice-Based.",
      tags: ["cgcloud__Payment__c", "cgcloud__Payment_Template__c"],
      connections: [
        { planet: "promotions", desc: "Claims compensate retailers for executed promotion tactics" },
        { planet: "funds_budgets", desc: "Claims settle against fund balances" }
      ]
    },
    {
      id: "claims-approval",
      name: "Claims Approval",
      icon: "\u{2705}",
      desc: "Approval workflow validates payment details against anchored funds using approval codes tied to user roles and authorization limits.",
      tags: ["cgcloud__Approval_Code__c"],
      connections: [
        { planet: "tpm_master_data", desc: "Approval codes are tied to user roles and settings" }
      ]
    },
    {
      id: "claims-import",
      name: "Claims Import",
      icon: "\u{1F4E5}",
      desc: "Supports importing claim records from third-party systems and ERP integrations. Retailers submit claims externally, which are matched against promotion tactics.",
      tags: ["cgcloud__Payment__c"],
      connections: [
        { planet: "tpm_master_data", desc: "Imported claims are matched to customer master records" }
      ]
    },
    {
      id: "claims-kpis",
      name: "Claims KPIs",
      icon: "\u{1F4CA}",
      desc: "KPI sets track claim values, settlement status, and variance between planned and actual promotion costs.",
      tags: ["cgcloud__KPI_Definition__c", "cgcloud__KPI_Set__c"],
      connections: [
        { planet: "analytics", desc: "Claim KPIs feed real-time settlement reports" },
        { planet: "account_planning", desc: "Claim actuals reflect in account plan P&L" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: Promotion tactics complete execution and retailers submit payment requests",
    "Step 2: Claims are created (manually or imported) using claim templates that set the type",
    "Step 3: Claims enter approval workflow with validation against fund balances and approval codes",
    "Step 4: Approved claims are settled via AR/AP integration, debiting the linked funds",
    "Step 5: Settlement KPIs update and reflect in account plan P&L and real-time reports"
  ],
  connections: [
    { planet: "promotions", desc: "Claims compensate executed promotion tactics" },
    { planet: "funds_budgets", desc: "Claim settlements debit fund balances" },
    { planet: "tpm_master_data", desc: "Customer relationships determine claim recipients and payers" },
    { planet: "analytics", desc: "Claim KPIs feed into real-time settlement reporting" },
    { planet: "account_planning", desc: "Claim actuals impact account plan profitability" },
    { planet: "data_cloud", desc: "Claim data reconciled with accrual engine calculations" }
  ]
},

account_planning: {
  packages: ['consumergoods'],
  name: "Account Planning",
  icon: "\u{1F4C8}",
  color: "#2dd4bf",
  description: "Account planning provides KAMs with a profit-and-loss overview for each customer and product combination over time. Customer Business Plans store aggregated KPIs that can be manually adjusted, enabling scenario planning and strategic decision-making for sales targets and promotional investment.",
  components: [
    {
      id: "customer-business-plan",
      name: "Customer Business Plans",
      icon: "\u{1F4CB}",
      desc: "Stores data for an account and business year combination with one or more product categories. KAMs can enter or manually adjust KPI data with changes cascading to promotions and account plans.",
      tags: ["cgcloud__Account_Plan__c"],
      connections: [
        { planet: "promotions", desc: "Business plan targets cascade to individual promotions" },
        { planet: "analytics", desc: "Business plan KPIs feed real-time P&L reports" }
      ]
    },
    {
      id: "account-pl",
      name: "Account P&L View",
      icon: "\u{1F4B5}",
      desc: "Shows the aggregated KPI for a customer and product combination for a timeframe. Displays planned versus actual values across promotion, fund, and claim KPIs in a hierarchical grid.",
      tags: ["cgcloud__Account_Plan__c", "cgcloud__KPI_Set__c"],
      connections: [
        { planet: "funds_budgets", desc: "Fund allocations appear in the P&L view" },
        { planet: "claims", desc: "Claim actuals are reflected in the P&L" }
      ]
    },
    {
      id: "scenario-planning",
      name: "Scenario Planning",
      icon: "\u{1F52E}",
      desc: "KAMs can download data from account plan P&L and model different promotional investment strategies. Scenarios enable what-if analysis by adjusting KPI inputs and observing the impact on profitability.",
      tags: ["cgcloud__Account_Plan__c"],
      connections: [
        { planet: "promotions", desc: "Scenarios model promotion investment alternatives" },
        { planet: "analytics", desc: "Scenario KPIs leverage the same calculation engine" }
      ]
    },
    {
      id: "sub-accounts",
      name: "Sub-Account Planning",
      icon: "\u{1F4CA}",
      desc: "Sub-accounts are subsets of accounts whose KPIs aggregate to parent account KPIs. Supports granular planning at store-type level while maintaining rolled-up visibility.",
      tags: ["cgcloud__Sub_Account__c"],
      connections: [
        { planet: "tpm_master_data", desc: "Sub-accounts derive from the customer master hierarchy" }
      ]
    },
    {
      id: "manual-inputs",
      name: "Manual Inputs",
      icon: "\u{270F}\uFE0F",
      desc: "Allows KAMs to manually enter or adjust KPI values in account plans. Manual inputs override calculated values and cascade changes through the P&L.",
      tags: ["cgcloud__Account_Plan__c"],
      connections: [
        { planet: "analytics", desc: "Manual input overrides are reflected in KPI calculations" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: Management defines fiscal year targets by region and product category",
    "Step 2: Targets are broken down to account level and loaded into customer business plans",
    "Step 3: KAMs adjust plan KPIs manually and plan promotions against targets",
    "Step 4: Promotion and claim actuals aggregate up into the account P&L view",
    "Step 5: Variance analysis between planned and actual drives next-period planning decisions"
  ],
  connections: [
    { planet: "promotions", desc: "Promotion KPIs aggregate into account plan P&L" },
    { planet: "funds_budgets", desc: "Fund allocation aligns with account plan investment targets" },
    { planet: "tpm_master_data", desc: "Account hierarchies structure the planning framework" },
    { planet: "claims", desc: "Claim actuals impact account plan profitability metrics" },
    { planet: "analytics", desc: "Account plan KPIs feed real-time reporting dashboards" },
    { planet: "agentforce", desc: "KAM Agent retrieves account performance measures" }
  ]
},

// ═══════════════════════════════════════════════════
//  PLATFORM & ANALYTICS
// ═══════════════════════════════════════════════════

analytics: {
  packages: ['consumergoods'],
  name: "Analytics & Reporting",
  icon: "\u{1F4CA}",
  color: "#60a5fa",
  description: "The unified analytics engine for both Retail Execution and Trade Promotion Management. For TPM, it provides real-time reporting, KPI calculations, and the accrual engine. For Retail Execution, CRM Analytics dashboards cover territory management, store compliance, product performance, and whitespace analysis.",
  components: [
    {
      id: "real-time-reporting",
      name: "Real-Time Reporting",
      icon: "\u{26A1}",
      desc: "RTR Report Configurations define custom real-time reports that fetch calculation results from CG Cloud Processing Services. Supports account-level and promotion-level measures.",
      tags: [],
      connections: [
        { planet: "promotions", desc: "RTR surfaces promotion KPIs in real time" },
        { planet: "account_planning", desc: "RTR shows account plan P&L measures" }
      ]
    },
    {
      id: "kpi-engine",
      name: "KPI Calculation Engine",
      icon: "\u{2699}\uFE0F",
      desc: "The processing service calculates KPIs including volume, revenue, cost, and profitability measures. Calculations run during save-and-calculate, batch server processes, and real-time browser updates.",
      tags: ["cgcloud__KPI_Definition__c", "cgcloud__KPI_Set__c"],
      connections: [
        { planet: "promotions", desc: "Calculates promotion summary sheet KPIs" },
        { planet: "funds_budgets", desc: "Calculates fund utilization and remaining budget" }
      ]
    },
    {
      id: "crm-analytics-dashboards",
      name: "CRM Analytics Dashboards",
      icon: "\u{1F4C9}",
      desc: "Pre-built dashboards for Retail Execution: Territory, Store Compliance, Product Performance, Sales Rep, and Whitespace Analysis. Advanced Data Model dashboards add Territory Performance, Sales Manager Insights, and Account Insights.",
      tags: [],
      connections: [
        { planet: "visit_execution", desc: "Dashboards visualize visit execution metrics" },
        { planet: "accounts_stores", desc: "Store-level metrics power compliance dashboards" }
      ]
    },
    {
      id: "uplift-prediction",
      name: "Uplift Prediction",
      icon: "\u{1F52E}",
      desc: "Uses CRM Analytics and machine learning to predict sales uplift volume from promotions. Helps KAMs forecast incremental volume and optimize promotional investment.",
      tags: [],
      connections: [
        { planet: "promotions", desc: "Predicts uplift volume for planned promotions" },
        { planet: "account_planning", desc: "Predicted uplift informs account plan targets" }
      ]
    },
    {
      id: "kpi-export",
      name: "KPI Export",
      icon: "\u{1F4E4}",
      desc: "Exports TPM KPIs as CSV files for use in downstream systems such as Trade Promotion Effectiveness or external data lakes.",
      tags: [],
      connections: [
        { planet: "data_cloud", desc: "Exported KPIs can be integrated into Data Cloud" }
      ]
    },
    {
      id: "data-360-integration",
      name: "Data 360 Integration",
      icon: "\u{1F310}",
      desc: "Centralizes TPM writeback KPIs from package objects and the processing service into Data 360 for enhanced visibility across brands, categories, and account hierarchies.",
      tags: [],
      connections: [
        { planet: "data_cloud", desc: "Data 360 leverages Data Cloud for unified analytics" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: Business data from promotions, funds, and claims syncs to CG Cloud Processing Services",
    "Step 2: Processing services calculate KPIs (volume, revenue, cost, profitability) in real time",
    "Step 3: Real-time reports fetch calculated measures and display in promotion and account views",
    "Step 4: CRM Analytics dashboards aggregate cross-domain data for territory and compliance insights",
    "Step 5: Uplift prediction models analyze historical data to forecast promotion impact"
  ],
  connections: [
    { planet: "promotions", desc: "Promotion KPIs are calculated and reported" },
    { planet: "account_planning", desc: "Account plan P&L measures flow through the KPI engine" },
    { planet: "visit_execution", desc: "Visit execution metrics feed Retail Execution dashboards" },
    { planet: "accounts_stores", desc: "Store-level data powers compliance and performance analytics" },
    { planet: "data_cloud", desc: "Data Cloud provides unified data platform for advanced analytics" },
    { planet: "funds_budgets", desc: "Fund utilization and budget KPIs are tracked" },
    { planet: "claims", desc: "Claim settlement metrics feed P&L analysis" },
    { planet: "einstein_ai", desc: "Einstein and analytics share the same underlying data platform" }
  ]
},

agentforce: {
  packages: ['consumergoods'],
  name: "Agentforce",
  icon: "\u{1F916}",
  color: "#818cf8",
  description: "AI-powered agents for both Retail Execution and Trade Promotion Management. The TPM KAM Agent helps key account managers view promotion and account measures, copy promotions, and update existing promotions using 13 custom actions. The Retail Execution agents provide customer service assistance and visit planning support.",
  components: [
    {
      id: "kam-agent",
      name: "TPM KAM Agent",
      icon: "\u{1F464}",
      desc: "Agentforce Employee Agent configured for TPM Key Account Managers. Supports viewing promotion and account measures, creating and updating promotions via BO API workflows.",
      tags: [],
      connections: [
        { planet: "promotions", desc: "KAM Agent reads and updates promotion records" },
        { planet: "account_planning", desc: "KAM Agent retrieves account plan measures" }
      ]
    },
    {
      id: "agent-actions",
      name: "Agent Actions",
      icon: "\u{2699}\uFE0F",
      desc: "Thirteen custom actions including Read User Sales Organization, Execute Promotion BO API Workflow, Retrieve Account/Promotion Measures, Get Products, and Validate TPM Account.",
      tags: [],
      connections: [
        { planet: "tpm_master_data", desc: "Actions read sales org, accounts, and products" },
        { planet: "analytics", desc: "Actions retrieve measures from real-time reports" }
      ]
    },
    {
      id: "rex-agents",
      name: "Retail Execution Agents",
      icon: "\u{1F6CD}\uFE0F",
      desc: "Agentforce for Retail Execution includes Customer Service Assistance for handling store inquiries and the Visit Assistant for helping field reps plan and execute store visits.",
      tags: [],
      connections: [
        { planet: "visit_planning", desc: "Visit Assistant helps plan optimal visit routes" },
        { planet: "visit_execution", desc: "Visit Assistant guides in-store task execution" }
      ]
    },
    {
      id: "agent-topics",
      name: "Agent Topics & Context",
      icon: "\u{1F4AC}",
      desc: "Agent topics group related tasks. Context variables ensure the agent acts consistently by mapping sales organization, user permissions, and data filters to appropriate actions.",
      tags: [],
      connections: [
        { planet: "tpm_master_data", desc: "Context variables pull user and sales org settings" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: KAM opens the agent interface and submits a natural language request",
    "Step 2: LLM evaluates the request against configured topics and selects appropriate actions",
    "Step 3: Agent executes custom actions (retrieve measures, get accounts, validate access)",
    "Step 4: Results are formatted and presented to the user with actionable next steps",
    "Step 5: For update actions, agent executes BO API workflows to modify promotion records"
  ],
  connections: [
    { planet: "visit_planning", desc: "Visit Assistant supports field rep visit planning" },
    { planet: "visit_execution", desc: "Retail Execution agents guide in-store task completion" },
    { planet: "accounts_stores", desc: "Agents access store and account data for context" },
    { planet: "promotions", desc: "KAM Agent manages promotion lifecycle" },
    { planet: "account_planning", desc: "KAM Agent retrieves account performance measures" },
    { planet: "mobile_app", desc: "Agents are accessible through the mobile app interface" }
  ]
},

einstein_ai: {
  packages: ['consumergoods'],
  name: "Einstein AI",
  icon: "\u{1F9E0}",
  color: "#facc15",
  description: "Einstein AI capabilities span predictive visit recommendations, generative AI health assessments, inventory deviation detection, and quick insights. Einstein Visit Recommendations use machine learning to suggest optimal store visits based on historical patterns, compliance scores, and business priorities.",
  components: [
    {
      id: "visit-recommendations",
      name: "Visit Recommendations",
      icon: "\u{1F4CD}",
      desc: "Machine learning model that recommends which stores field reps should visit next based on visit frequency, compliance scores, store revenue potential, and time since last visit.",
      tags: ["AiVisitRecommendation"],
      connections: [
        { planet: "visit_planning", desc: "Visit recommendations feed into visit plans" },
        { planet: "accounts_stores", desc: "Store attributes drive recommendation scoring" }
      ]
    },
    {
      id: "genai-health",
      name: "GenAI Health Assessments",
      icon: "\u{1F3E5}",
      desc: "Generative AI analyzes store visit data, compliance metrics, and product performance to produce natural language health assessments for each account.",
      tags: [],
      connections: [
        { planet: "visit_execution", desc: "Visit execution data feeds health assessment models" },
        { planet: "analytics", desc: "Analytics data provides the metrics for AI assessment" }
      ]
    },
    {
      id: "inventory-deviations",
      name: "Inventory Deviation Detection",
      icon: "\u{1F4E6}",
      desc: "Einstein analyzes inventory count data from store visits to detect deviations from expected levels. Flags out-of-stock risks, overstocking, and unusual patterns.",
      tags: [],
      connections: [
        { planet: "visit_execution", desc: "Inventory counts from visits feed deviation analysis" },
        { planet: "van_sales", desc: "Warehouse inventory provides deviation baselines" }
      ]
    },
    {
      id: "quick-insights",
      name: "Quick Insights",
      icon: "\u{1F4A1}",
      desc: "AI-generated contextual insights surfaced on account, store, and product records. Provides at-a-glance summaries of trends, anomalies, and opportunities.",
      tags: [],
      connections: [
        { planet: "analytics", desc: "Quick Insights leverage the same data as analytics dashboards" },
        { planet: "accounts_stores", desc: "Insights surface on account and store records" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: Historical visit, compliance, and sales data is aggregated from CG Cloud objects",
    "Step 2: Einstein ML models train on patterns including visit frequency, compliance scores, and sales velocity",
    "Step 3: Visit recommendations are generated and ranked by priority for each sales rep",
    "Step 4: GenAI produces natural language health assessments and inventory deviation alerts",
    "Step 5: Insights are surfaced in the mobile app and desktop UI for rep and manager action"
  ],
  connections: [
    { planet: "visit_planning", desc: "Einstein recommendations influence visit planning priorities" },
    { planet: "visit_execution", desc: "Visit execution data trains and validates Einstein models" },
    { planet: "accounts_stores", desc: "Store attributes and targets feed Einstein predictions" },
    { planet: "van_sales", desc: "Product velocity insights inform van sales loading" },
    { planet: "analytics", desc: "Einstein and analytics share the same underlying data platform" }
  ]
},

data_cloud: {
  packages: ['consumergoods'],
  name: "Data Cloud",
  icon: "\u{2601}\uFE0F",
  color: "#a3e635",
  description: "Data Cloud integration unifies Consumer Goods Cloud data into a single source of truth using Data Model Objects (DMOs), the CG Cloud Data Kit, and the Accrual Engine. It powers account segmentation, cross-org data sharing via Data Cloud One, and advanced analytics.",
  components: [
    {
      id: "data-kit",
      name: "CG Cloud Data Kit",
      icon: "\u{1F4E6}",
      desc: "Installable package that deploys data streams to enable Consumer Goods Cloud data to flow into Data Cloud DMOs. Includes pre-mapped DLO-to-DMO attribute mappings for accounts, products, promotions, tactics, and store assortments.",
      tags: ["Assortment", "AssortmentProduct", "StoreAssortment"],
      connections: [
        { planet: "tpm_master_data", desc: "Ingests account and product master data into DMOs" },
        { planet: "products_assortments", desc: "Assortment data streams flow into Data Cloud" }
      ]
    },
    {
      id: "dmo-mappings",
      name: "Data Model Objects",
      icon: "\u{1F5C3}\uFE0F",
      desc: "Standardized Data Model Objects maintained via the SSOT framework. DLO attributes from CG Cloud objects are mapped to DMO attributes for Account, Product, Promotion, Tactic, and Store Assortment.",
      tags: ["cgcloud__Account_Extension__c", "cgcloud__Product_Hierarchy__c", "cgcloud__Promotion__c", "cgcloud__Tactic__c"],
      connections: [
        { planet: "analytics", desc: "DMOs provide unified data layer for analytics and dashboards" }
      ]
    },
    {
      id: "segmentation",
      name: "Account Segmentation",
      icon: "\u{1F3AF}",
      desc: "Create customer segments and optimize retail activities using data-driven insights. Segmentation rules can automatically populate account sets for targeted promotion planning.",
      tags: ["cgcloud__Account_Set__c"],
      connections: [
        { planet: "accounts_stores", desc: "Segmentation groups stores by behavior and attributes" },
        { planet: "promotions", desc: "Segments define targeted promotion audiences" }
      ]
    },
    {
      id: "accrual-engine",
      name: "Accrual Engine",
      icon: "\u{1F4B0}",
      desc: "Calculates the debt incurred for rebate programs, loyalty programs, promotions, and claims. Runs on Data Cloud and consumes Data Cloud credits.",
      tags: [],
      connections: [
        { planet: "promotions", desc: "Accruals calculated from promotion commitments" },
        { planet: "claims", desc: "Accruals reconciled against actual claim settlements" }
      ]
    },
    {
      id: "data-cloud-one",
      name: "Data Cloud One",
      icon: "\u{1F517}",
      desc: "Connects the primary Salesforce org to a companion org, allowing cross-org DMO data visibility through shared data spaces without needing a separate Data Cloud instance.",
      tags: [],
      connections: [
        { planet: "analytics", desc: "Companion orgs access shared analytics data" }
      ]
    }
  ],
  dataFlow: [
    "Step 1: CG Cloud Data Kit is installed and data streams are deployed for CG Cloud objects",
    "Step 2: Salesforce Connector ingests objects into Data Cloud with field-level DLO-to-DMO mapping",
    "Step 3: Segmentation rules process ingested data to create customer segments and account sets",
    "Step 4: Accrual Engine calculates promotional liabilities using Data Cloud compute credits",
    "Step 5: Unified DMO data is surfaced through analytics, segmentation, and Data Cloud One sharing"
  ],
  connections: [
    { planet: "accounts_stores", desc: "Store and account data ingested into Data Cloud DMOs" },
    { planet: "products_assortments", desc: "Product and assortment data mapped to DMOs" },
    { planet: "visit_execution", desc: "Visit execution data flows into Data Cloud for unified analytics" },
    { planet: "analytics", desc: "Data Cloud provides the data platform for CRM Analytics" },
    { planet: "promotions", desc: "Promotion data feeds accrual calculations and segmentation" },
    { planet: "claims", desc: "Claim data reconciled with accrual engine calculations" }
  ]
}

};
