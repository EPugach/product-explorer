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
      docs: ["Retail Stores & Locations is the foundational data layer for tracking the physical places where consumer goods are sold. The Retail Store object captures each store's address, geographic coordinates, and parent account relationship, while the In-Store Location object records granular placements like aisles, endcaps, and checkout counters. Retail Location Groups let administrators cluster stores by shared characteristics such as size, region, or product placement strategy, enabling bulk assignment of assortments, promotions, and KPI targets across similar stores.", "Administrators create retail stores from the Consumer Goods app and then define in-store locations and operating hours for each store. The Operating Hours object stores timezone-aware business hours and preferred visit windows, while the Time Slots object specifies start and end times for each day of the week, including the ability to mark non-working days. Starting Spring '21, the Retail Store and Account objects share a Master-Detail relationship, so retail stores inherit sharing rules from their parent account without requiring separate sharing configuration.", "In practice, retail stores serve as the primary targets for visit planning and execution. Field reps navigate to stores, execute assessment tasks, and capture orders against the store's product assortment. Store Products associate individual products to specific retail stores or in-store locations, enabling shelf-level tracking. Store data also feeds into Salesforce Maps for territory visualization and CRM Analytics dashboards for compliance and performance monitoring."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.retail_concept_admin_store_manage.htm&language=en_US",
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
      docs: ["Customer Master Data extends the standard Salesforce Account object with Consumer Goods Cloud-specific capabilities for managing retail business partners. The Account Extension object adds fields for classification, status, pricing configuration, and customer-specific business rules. Customer Templates define reusable blueprints for creating new customer records with pre-configured field values, ensuring consistency across the customer base.", "To set up customer master data in the enhanced model, administrators first create Customer Templates that specify the record type and default field values for new customers. Customers are then created with appropriate roles such as retailer, distributor, wholesaler, or consumer. Account Managers link users to accounts through org units for territory assignment, and Account Receivable records track financial relationships. The Account Extension object stores additional classification and pricing data per sales organization.", "Customer master data integrates with multiple downstream processes. Customer visit settings drive automated visit creation, account conditions define retailer-specific pricing for penny perfect calculations, and account hierarchies determine inheritance of retail activities and product assortments. In the enhanced model, customer data syncs to the offline mobile app so field reps can access complete account information even without network connectivity."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_task_admin_create_customer.htm&type=5&language=en_US",
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
      docs: ["Trade Org Hierarchy models the parent-child relationships between accounts to represent how retailers, distributors, and wholesalers are organized within the consumer goods supply chain. The Account Trade Org Hierarchy object captures these relationships with defined validity periods, making them time-dependent so that organizational changes can be planned and executed on specific dates. Child accounts inherit retail activities, product assortments, and promotions from their parent accounts.", "Administrators configure trade org hierarchies by creating Account Relationship and Sub Account records that link child accounts to parent accounts. Each relationship has a valid-from and valid-to date, allowing hierarchies to evolve over time. The FlattenAccountHierarchyBatch Apex batch process flattens the hierarchy for more uniform access across several areas of the application, and this batch must be run after hierarchy changes.", "In practice, trade org hierarchies enable key account managers to plan at the parent level and have activities cascade down to individual stores. When a promotion or assortment is assigned to a parent account, all child accounts in the hierarchy automatically receive it. This dramatically reduces the effort needed to manage large retail chains where hundreds of stores share the same promotional calendar and product listings."],
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
      docs: ["Sales Organizations are the primary mechanism for multi-market enablement in Consumer Goods Cloud. Each Sales Org represents a distinct business segment that structures data and processes by organizational unit, enabling complete isolation between markets. Master data including customer templates, product templates, assortments, pricing conditions, and visit templates is unique per sales org, so independent business processes can run simultaneously across different geographical territories, product divisions, or account teams.", "Administrators create Sales Organizations from the App Launcher and assign users to them via the Sales Organization User related list. Each user assignment includes a default visit template and default customer that appear when the user creates visits on the mobile device. The sales org also controls language settings, with up to four languages configurable for template descriptions. All template data such as order templates and product templates is translated based on the language fields matching those of the sales organization.", "Sales Organizations serve as the backbone for multi-market deployments where a single Salesforce org supports multiple countries or business units. Product templates, assortments, and pricing conditions all belong to a specific sales org, ensuring that a field rep in Germany sees different products and prices than one in France. The calculation schema determination table routes the penny perfect pricing engine to the correct schema based on the market's sales org."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_admin_concept_sales_org.htm&type=5&language=en_US",
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
      docs: ["Org Units represent the smallest organizational divisions such as departments or branch offices within the consumer goods company. The Org Unit Hierarchy object models internal organizational structure through parent-child relationships between org units, while Org Unit Users map individual sales reps and supervisors to specific territories. This mapping controls which customers a rep can access, which regional promotions they see, and which supervisors oversee their work.", "Administrators build org unit hierarchies from the Consumer Goods app by creating org unit records and establishing parent-child relationships between them. Account Org Unit records link customer accounts to org units, defining which territories serve which customers. Org Unit User records assign sales reps to specific org units with defined roles, and this assignment determines what data syncs to each user's mobile device during the morning synchronization.", "In the enhanced model, org units are essential for territory-based visit planning and data access control. When a field rep creates a visit, only the customers assigned to their org unit are available for selection. Supervisors assigned to parent org units can view and manage data across all child org units, enabling hierarchical oversight. Org units also integrate with Salesforce Maps for territory visualization and boundary management."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_admin_org_units.htm&type=5&language=en_US",
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
      docs: ["Customer Sets group accounts for targeting promotions, pricing conditions, and activities at scale. The Account Set object holds the group definition, while Account Set Account junction records link individual customers to the set. Account Set Managers assign users who can manage the set's membership. Customer sets can be created manually, populated through integration, or built dynamically using segmentation rules that execute SOQL queries against account or org unit hierarchy filters.", "Administrators create customer sets from the Consumer Goods app and populate them using one of three methods. Manual population involves adding individual accounts to the set's related list. Integration-based population uses data loader or API calls to bulk-insert Account Set Account records. Segmentation rules provide the most powerful option: administrators define SOQL-based filter criteria using Segmentation Rule Definition and Segmentation Rule Definition Column records, and the system automatically evaluates these rules to build the customer set membership.", "Customer sets are consumed by multiple downstream features. Promotions can be targeted to customer sets so that only stores in the set receive the promotional pricing. Activities can be assigned to customer sets so that specific surveys or audits are deployed across a defined group of stores. Pricing conditions can reference customer sets for group-level pricing agreements. This segmentation approach eliminates the need to assign promotions, activities, or pricing to each account individually."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_task_admin_create_customer_sets.htm&type=5&language=en_US",
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
      docs: ["Assets & Point of Sale tracks valuable equipment placed at customer locations and secondary product placements used for promotional displays. The standard Asset object records equipment like refrigerators, freezers, and display units, while Asset Templates define the type characteristics such as single door, multi-door, or mini-fridge configurations. Point of Sale (POS) objects represent secondary locations within a store where products are placed for promotion or increased sales, such as shelf displays, sales counters, freezers, or vending machines.", "Administrators set up asset management by creating Asset Templates that define the characteristics for each equipment type, then creating individual Asset records linked to customer accounts. POS Templates define the types of point-of-sale placements available, such as premium beverages or snack shelves. Customer Task Templates configure the follow-up workflows for issues discovered during asset audits, such as repair or replacement requests. Customer Tasks are customer-specific tasks created during asset audits when equipment needs attention.", "During visit execution, field reps perform asset audits to verify the condition of placed equipment and record their findings. If an asset needs repair or replacement, the rep creates a customer task directly from the audit. POS inspections verify that secondary placements are properly maintained and stocked. Asset and POS data captured during visits feeds into CRM Analytics dashboards for tracking equipment utilization, compliance rates, and maintenance costs across the store portfolio."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_task_admin_create_asset_template.htm&type=5&language=en_US",
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
      docs: ["Consumer Goods for Sales & Service enables telesales and service agents to engage with customers for order management, promotions, and issue resolution from the desktop application. Sales Excellence uses OmniScripts to guide agents through retailer contact lists, presenting relevant customer information and enabling order capture without the field rep's mobile app. Service agents receive a 360-degree customer view with identity verification, record alerts, timeline, and complete order history.", "Administrators configure the Sales & Service experience by setting up OmniScript-based guided flows for telesales agents and configuring the Lightning console for service agents. The desktop application provides access to customer master data, order management, and promotion details. Agents can create visits on behalf of customers, review order history, and manage promotional agreements. The Store Cockpit in the enhanced model provides a comprehensive view of store-level data including visits, orders, and performance metrics.", "In practice, this capability bridges the gap between field execution and office-based customer management. Telesales agents use the guided flows to proactively contact retailers about new promotions or replenishment orders, while service agents handle inbound inquiries about order status, delivery issues, or promotional disputes. Both agent types benefit from the same underlying data model that powers field execution, ensuring consistency between phone-based and in-person customer interactions."],
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
      docs: ["Product Master is the core data foundation for all product-related operations in Consumer Goods Cloud. Each product is stored in the standard Product2 object and represents a stock-keeping unit (SKU) or sellable unit. Product Templates define blueprints for creating products with similar characteristics, scoped to a specific sales organization. Product Hierarchies organize the manufacturer's catalog into categories, subcategories, and brands, with both dynamic (parent-child) and static (flattened) hierarchies supported for different access patterns.", "Administrators create Product Templates from the App Launcher, specifying the template name, record type (product or product group), sales org, and whether pricing is required. Products are then created from these templates with attributes like product type, UPC codes, pack size, container type, and product form. Product Parts define parent-child relationships between products for bundled or component products. Units of Measure configure the logistical units for each product, enabling accurate order quantity calculations across different packaging levels. Product master data is typically imported from ERP systems via integration.", "In the enhanced model, the product hierarchy supports up to 6 levels in the dynamic hierarchy and 5 parent levels in the static hierarchy. The static hierarchy is required for optimized access in penny perfect pricing condition searches. Product Managers are assigned as active planners who can create and manage promotions for their product categories. Product images can be uploaded for display in the offline mobile app during surveys and order taking. Products marked as competitor products are relevant for product surveys during store visits."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_task_admin_create_product_templates.htm&type=5&language=en_US",
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
      docs: ["Product Assortments define which products are eligible for sale at specific stores, controlling what field reps can order and what appears in product surveys during visits. In the enhanced model, Assortment Templates act as blueprints for creating product assortments, scoped to a sales organization. Product Listing Modules filter products by category for different store formats, enabling a single assortment definition to adapt to multiple store types.", "Administrators create assortment templates from the Consumer Goods app, then build product assortments by adding products through Product Assortment Product Share records. Listing Modules organize products within the assortment by category. Store Assortments link the assortment to specific accounts or store groups, and Product Assortment Store records manage these associations. In the trade org hierarchy, child accounts inherit assortments from parent accounts, so assigning an assortment to a chain's headquarters automatically makes it available across all locations.", "During visit execution, assortments determine which products appear in the order-taking interface and product surveys. Only products included in a store's active assortment are available for ordering, preventing field reps from placing orders for unauthorized products. Store Products track the association between individual products and retail stores or in-store locations, providing shelf-level granularity for compliance monitoring and planogram audits."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_manage_advanced_product_assortments.htm&type=5&language=en_US",
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
      docs: ["Advanced Promotions manage sellable promotions for temporary price reductions, coupons, and in-store displays. Promotion Templates define the types of promotions available, while individual Promotion records contain the specific terms, validity periods, and target audiences. Tactics are the lowest-level implementable elements of a promotion that control specific pricing behaviors. Each promotion can contain multiple tactics and is linked to products through Tactic Product records.", "Administrators create Promotion Templates that specify the promotion structure and available tactics. Key account managers then create promotions from these templates, configure tactics with specific discount percentages or free product offers, and push promotions to customer hierarchies using Promotion Push Status records. The Promotion Template Hierarchy organizes templates into categories, and the Promotion Template Tactic Template junction establishes which tactic types are available for each promotion type.", "Promotions are pushed to customer hierarchies and linked to customer sets for targeted distribution. During visit execution, field reps see active promotions for each store and can apply promotional pricing to orders. Event-driven activities tied to promotions automatically appear in the visit workflow during the promotion's validity period, ensuring that reps execute the required compliance checks and merchandising tasks. Promotion data feeds into CRM Analytics for tracking execution rates, revenue impact, and ROI."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_admin_promotion_management.htm&type=5&language=en_US",
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
      docs: ["Promotion Hurdles & Rewards define the conditional logic for applying incentives to sellable promotions. Hurdles set the parameters that must be met before rewards are granted, such as minimum order quantities or purchase thresholds. Expressions define the evaluation logic using configurable criteria, and Reward Groups contain the actual incentives that are applied when a hurdle is cleared. This three-tier structure enables complex promotional mechanics like tiered discounts and buy-one-get-one offers.", "Administrators configure hurdles by creating Promotion Hurdle records on a promotion and defining Promotion Hurdle Expression records that specify the evaluation criteria. Each expression references products or product categories and defines threshold values. Reward Groups are linked to hurdles and contain individual Promotion Reward records that specify the incentive type, such as a percentage discount or free product. Promotion Reward Product records link rewards to specific products.", "During order taking in the mobile app or on desktop, the pricing engine evaluates hurdle expressions against the current order contents. When all expressions in a hurdle are satisfied, the associated rewards are automatically applied to qualifying order items. This evaluation happens in real time during penny perfect pricing calculations, ensuring that field reps and customers see the accurate promotional pricing before the order is confirmed."],
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
      docs: ["Sales Folders provide content management capabilities for field reps during customer pitches and store visits. Sales Folder Templates create reusable folder structures that can be linked to customers or org units, organizing promotional materials, product catalogs, and marketing content. Sell Sheets group attachments such as videos, images, and documents into presentable collections that reps can share with store managers during visits.", "Administrators create Sales Folder Templates from the Consumer Goods app, specifying the folder structure and content organization. Individual Sales Folders are then generated from these templates and populated with Sell Sheet records containing file attachments. Promotion Sales Folder junction records link promotions to their supporting sales folder content, ensuring that promotional materials are automatically available alongside the promotion data.", "Sales folder content syncs to the offline mobile app during the morning synchronization, making it available for field reps even without network connectivity. During store visits, reps can access product catalogs, promotional flyers, and training materials directly from the mobile app to support their sales conversations. Attachment size limits apply: the total size of attachments for a mobile device is capped at 500 MB, with individual automatic downloads limited to 3 MB and on-demand downloads up to 40 MB."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_retail_sales_folder_limit.htm&type=5&language=en_US",
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
      docs: ["Pricing & Conditions manages the product and customer price conditions that drive penny perfect order calculations. Product Conditions define base prices for products, Customer Conditions (Account Conditions) set retailer or distributor-specific pricing agreements, and Customer-Specific Product Conditions handle per-account pricing for individual products. Condition Templates define the behavior of conditions and determine whether they reference customers, products, or both.", "Administrators create Condition Templates that specify the condition type, such as a discount or surcharge, and its role in the calculation schema. Pricing conditions are typically imported from ERP systems via integration, though they can also be created manually. The Pricing Condition Template in the penny perfect pricing engine defines how each condition type is evaluated during order calculations, including the search strategy for finding applicable conditions based on key attributes like customer, product hierarchy, and sales org.", "Pricing conditions integrate directly with the penny perfect pricing engine during order taking. When a field rep places an order, the engine traverses the calculation schema, searching for applicable conditions at each step using configured search strategies. Conditions are evaluated in priority order, and the engine supports complex scenarios like multi-market pricing where each sales org maintains its own condition set. Condition data can be synchronized in batches for large-scale updates across the product catalog."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_admin_advanced_pricing.htm&type=5&language=en_US",
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
      docs: ["Visit Templates define the types of customer visits available in Consumer Goods Cloud, such as sales visits, training visits, delivery visits, or phone calls. Each template controls the visit's behavior including GPS tracking settings, geofencing validation at start and completion, visit duration defaults, and which user roles can execute the visit. The meta type field determines the visit icon displayed on mobile devices and classifies the visit for reporting purposes.", "Administrators create visit templates from the App Launcher by specifying the template name, meta type (Call, Delivery Visit, Van Sales, or Phone Call), and activation status. Key configuration options include location capture settings at start, cancel, and completion stages, geolocation validation type (None, Error, or Warning) for geofencing, and whether starting a visit requires check-in. The Limit to One Visit In Progress setting prevents users from executing multiple visits simultaneously. Visit templates also define the available order types and activity configurations for each visit type.", "Visit templates are referenced throughout the visit lifecycle. When a visit is created manually, automatically, or via trip lists, the selected template determines what activities, orders, and assessment tasks are available during execution. In multi-market deployments, each sales org can maintain its own set of visit templates. The default visit template can be configured per user in the Sales Organization User settings, streamlining visit creation on mobile devices."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.retail_concept_admin_whatsvisit.htm&language=en_US",
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
      docs: ["Automatic Visit Creation uses Customer Visit Settings to generate visits without manual scheduling, ensuring optimal coverage of the store portfolio. The Account Visit Setting object stores per-account configuration including visit frequency, preferred days, and time windows. When the automatic visit creation process runs, it reads these settings and generates visit records for each configured account based on the defined schedule.", "Administrators configure automatic visits by creating Account Visit Setting records on customer accounts. Each setting specifies the visit template to use, the frequency of visits (weekly, biweekly, monthly), preferred visit days, and time windows. The system's automated batch process then generates visits according to these parameters, assigning them to the appropriate field rep based on the account's org unit assignment.", "Automatic visit creation significantly reduces the administrative burden of visit planning for large store portfolios. Rather than supervisors manually creating hundreds of visits each week, the system generates them based on predefined rules. This approach works alongside manual visit creation, trip list-based planning, and map-based visit creation to provide a comprehensive set of planning methods. Customer visit settings can be adjusted seasonally to account for changing business needs."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_admin_create_calls_automatically.htm&type=5&language=en_US",
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
      docs: ["Action Plan Templates provide reusable frameworks for standardizing the set of activities performed during store visits. Each template bundles Assessment Task Definitions and Delivery Tasks into a repeatable blueprint that can be associated with stores through StoreActionPlanTemplate junction records. This ensures that every visit to a particular store type follows the same structured workflow, from inventory checks to promotional compliance audits.", "Administrators create Action Plan Templates in the Consumer Goods app, then add Assessment Task Definitions that specify the KPIs to measure and the assessment indicator definitions to use. Delivery Tasks can also be added to templates for visits that include product deliveries. The template is then associated with retail stores or store groups, and when a visit is created, the action plan template's tasks are automatically included in the visit's activity list.", "Action Plan Templates are central to the base model workflow where visits are structured around standardized task lists. In the enhanced model, they complement the more flexible activity and job list system. Supervisors can associate different action plan templates with different store types, ensuring that a flagship store receives a comprehensive audit while a convenience store gets a streamlined check. Templates can be versioned over time as business requirements evolve."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.retail_concept_admin_actionplantemp.htm&language=en_US",
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
      docs: ["Activities & Job Lists provide the enhanced model's flexible framework for defining and assigning data capture tasks during visits. Activities are collections of questions and surveys organized through Job Definition List records, while Job Definition Templates define individual data capture items such as store-related questions or product surveys. Job Templates control the behavior and visibility of activities in the offline mobile app, determining whether an item appears as a question or a survey.", "Administrators create the activity framework in layers. First, Job Templates define the activity behavior. Then, Job Definition Templates specify individual questions with their data types, sourced from the Data Type object. Activity Templates bundle job definition templates into reusable collections and can be marked as standard (ongoing) or event-driven (promotion-linked). Activities are created from templates and assigned to customers, customer sets, or products. Job Lists associate activities with visit templates for specific customers, controlling which activities appear during which visits.", "There are two types of activities. Standard Activities are ongoing to-do lists valid for multiple customers over extended periods, such as daily shelf audits or regular stock checks. Event-Driven Activities are linked to promotions and are only active during the promotion's validity period, automatically appearing in visits when the promotion is running. During visit execution, field reps work through the assigned activities, answering questions and completing surveys that capture store-level and product-level data."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_task_admin_create_activity.htm&type=5&language=en_US",
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
      docs: ["Trip Lists enable supervisors and field reps to plan multi-stop visit sequences for efficient route planning. A trip list defines an ordered sequence of customer visits, allowing the planner to optimize the route based on geography, priority, or business requirements. Visits can be created in bulk from a trip list, reducing the time needed to set up a full day's schedule compared to creating each visit individually.", "Supervisors create trip lists by selecting customers and ordering them into a visit sequence. The system then generates visit records for each customer in the list, using the configured visit template and scheduling parameters. Trip lists can also be created on the mobile app for more dynamic, in-field planning. Additionally, visits can be created from barcode scans for ad-hoc store identification when a rep encounters an unscheduled store.", "Trip lists complement other visit creation methods including automatic visits from customer visit settings, manual visit creation, and map-based planning. When used with Salesforce Maps, trip list routes can be optimized based on driving distance and time, reducing travel overhead. Trip lists are particularly useful for merchandising teams that visit many stores in a single day and need an efficient sequential plan."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_admin_create_calls_trip_lists.htm&type=5&language=en_US",
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
      docs: ["Substitution Management maintains service continuity when field reps are unavailable due to planned or unplanned absences. Substitution records assign a substitute rep to specific customers for a defined time period, ensuring that visits are not missed and customer relationships are maintained. One substitute can cover one or multiple customers, and the system automatically routes visit assignments and data access to the substitute during the coverage period.", "Administrators or supervisors create Substitution records by specifying the absent user, the substitute user, the affected customers, and the validity period. User Settings configure additional parameters for the substitution. During the coverage period, the substitute rep receives the original rep's visit assignments and can access the relevant customer data through the mobile app. The substitution is time-bounded, so access automatically reverts when the coverage period ends.", "Substitution Management ensures that visit frequency targets are maintained even during vacations, sick leave, or territory transitions. Activities such as planning visits and capturing orders continue without interruption. The feature integrates with the visit planning system so that automatically generated visits are routed to the substitute, and with the mobile app sync so that the substitute's device receives the necessary customer data."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_admin_substitutionmanagement.htm&type=5&language=en_US",
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
      docs: ["Assessment Tasks & KPIs form the compliance measurement backbone of retail execution. Assessment Indicator Definitions define KPI metrics with data types including numerical, decimal, text, date-time, and boolean, establishing the measurable attributes for store performance. Assessment Task Definitions bundle these metrics into retail activities that sales managers assign to stores, specifying the name, description, category, and type of each activity.", "Administrators create Assessment Indicator Definitions for each KPI metric, then build Assessment Task Definitions that group related metrics into executable tasks. Retail Store KPIs set target compliance values by associating store groups with assessment indicator definitions, products, and in-store location categories. This allows targets to be defined at scale using commonalities across stores, metrics, promotions, and products. AssessmentTaskIndDefinition junction records link the task definitions to their indicator definitions.", "During visit execution, field reps perform assessment tasks by capturing actual values against the defined KPI targets. Retail Visit KPIs store the actual information recorded during a visit against the defined assessment indicator definitions and target values. The system calculates compliance scores by comparing actual values to targets, providing real-time feedback to the field rep and generating data for performance dashboards. Assessment Task Content Documents can attach supporting evidence such as photos to the captured metrics."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.retail_concept_admin_retailstorekpi.htm&language=en_US",
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
      docs: ["Advanced Orders & Pricing provides full order management during visits including standard pre-orders, return orders, van sales orders, and advertising material orders. The Order object stores order header information, while Order Item records capture individual product lines with quantities and pricing. Order Templates define the characteristics of each order type and the available item types, controlling which products and pricing rules apply.", "The penny perfect pricing engine uses Calculation Schemas to define the sequence of pricing steps, with each step referencing a Pricing Condition Template that specifies the condition type (discount, surcharge, tax). Key Types and Key Attributes define the lookup dimensions for finding applicable pricing conditions, while Search Strategies control how the engine traverses the product and customer hierarchies to find matching conditions. System Numbers generate unique identifiers for orders. User exit customization hooks allow developers to inject custom pricing logic at specific calculation steps.", "During visit execution, field reps open the order-taking interface, select products from the store's assortment, and specify quantities. The pricing engine automatically calculates the order total by applying base prices, customer conditions, product conditions, promotional discounts, and taxes in the configured sequence. AssessmentTaskOrder junction records link orders to assessment tasks for tracking. The order data syncs back to Salesforce for fulfillment processing, and order metrics feed into CRM Analytics dashboards."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_admin_order_management.htm&type=5&language=en_US",
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
      docs: ["Visit Jobs capture the actual responses to questions and product surveys during visit execution. Each Visit Job record stores the data entered by the field rep against a specific Job Definition Template, recording answers to store-related questions like advertising material presence or shelf availability, and product-level survey data like pricing compliance or facing counts. This granular data forms the basis for store-level performance analysis.", "Visit Jobs are created automatically when a field rep starts working on an activity during a visit. The system generates a Visit Job record for each job definition template in the assigned activities, pre-populating reference data from the template. Field Sales Activity records track the broader activity context. Historic Product records maintain a history of which products a rep adds during surveys, enabling quick re-addition of frequently surveyed products in future visits.", "The survey and question data captured in Visit Jobs provides actionable insights for the management team. Aggregated responses reveal trends in product placement, promotional compliance, and competitive activity across the store portfolio. Visit Job data syncs from the mobile app to Salesforce during the completion sync, making it available for reporting and analytics. The offline mobile app supports both store-level questions and product-level surveys with configurable data types including text, numeric, boolean, and picklist responses."],
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
      docs: ["Daily Reports track productive and unproductive time for sales reps throughout the workday. The User Document object stores the daily report header with date and user information, while User Document Activity records capture individual time entries against defined activity categories. Daily Report Templates specify the available activity types and maximum durations, ensuring consistent time tracking across the sales organization.", "Administrators create Daily Report Templates that define the activity categories available for time logging, such as customer visits, research, administrative work, breaks, and travel. Each activity category can have a maximum duration configured to prevent unrealistic time entries. Daily Report Template Activity records link the templates to their available activity categories, and the template is associated with users through their sales org configuration.", "Field reps create and maintain daily reports from the offline mobile app, logging their time against the configured activity categories. The Visit Calendar feature enables reps to create and maintain daily and weekly visit schedules alongside their time entries. Daily report data syncs to Salesforce and integrates with workflows that can automate validation and approval processes. Management teams use the aggregated time data to analyze field force utilization and optimize territory coverage."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_user_daily_report.htm&type=5&language=en_US",
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
      docs: ["Signatures & Approvals provides configurable signature capture for business processes like order confirmations, delivery receipts, contracts, and daily reports. Signature Templates define the signature flow with multiple steps, allowing different roles to sign in sequence. Signature Attributes capture contextual data alongside the signature, such as the signatory's name, order amount, or tour name, providing a complete audit trail.", "Administrators create Signature Templates that specify the number of signing steps and the role required at each step through Signature Flow Step records. Signature Attributes are configured on the template to capture relevant business data at signing time. Approval Codes provide an additional authentication mechanism for critical transactions in the DSD workflow, such as cash handling and delivery confirmations. Signature tasks can be associated with action plan templates for inclusion in visit workflows.", "During visit execution, field reps present the signature capture interface on the mobile device touchscreen at the appropriate point in the workflow. The signatory touches the screen to provide their signature, and the system records it along with the configured attribute values. For delivery visits, signatures confirm receipt of goods and can trigger downstream inventory and financial processes. The captured signature data syncs to Salesforce and is stored as an attachment on the related business record."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_admin_signature_management.htm&type=5&language=en_US",
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
      docs: ["Workflows in Consumer Goods Cloud are reusable automation definitions that drive status transitions and validation logic across multiple business processes. Each Workflow record is scoped to a single business process such as Customer Tasks, Daily Reports, Job Definition Lists (Activities), or Order Promotions. Workflows define the valid states and transitions for their scoped process, ensuring that records follow the correct lifecycle path.", "Administrators create Workflows from the Consumer Goods app and configure Workflow State Transition records that define the allowed status changes. Each transition can include validation logic that must be satisfied before the transition is permitted. The workflow is then referenced by the relevant template object, such as a Customer Task Template or Daily Report Template, linking the automation rules to the specific business process instance.", "Workflows provide governance over the visit execution lifecycle by enforcing consistent business rules across all users and markets. For example, an order workflow might require that all order items have valid pricing before the order can transition to a confirmed state. A daily report workflow might prevent submission if required time entries are missing. The workflow engine evaluates these rules both on the desktop and within the offline mobile app, maintaining data integrity across all execution channels."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_task_admin_create_workflow.htm&type=5&language=en_US",
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
      docs: ["Routes define repeatable delivery, sales, or merchandising trip patterns in Consumer Goods Cloud's Direct Store Delivery (DSD) module. Each route record (cgcloud__Route__c) captures key characteristics such as the assigned warehouse, default driver, and vehicles used for the trip. Route customers (cgcloud__Route_Account__c) specify the ordered sequence of store stops along with the visit type for each stop, giving supervisors full control over the daily itinerary.", "Administrators set up route templates (cgcloud__Route_Template__c) to configure different route types for various markets or business lines. Routes are then created from these templates and assigned to specific warehouses, users, and vehicles. Supervisors can manage the customer stop sequence using drag-and-drop ordering on the route detail page, adjusting the visit order as store priorities or geographic considerations change.", "In daily operations, routes serve as blueprints for generating executable tours. When a tour is created from a route, it inherits the route's customer stops, warehouse assignments, and vehicle details, pre-populating the driver's daily schedule. Route optimization can leverage Salesforce Maps to calculate minimum-travel-time paths between stops, reducing windshield time and improving delivery efficiency."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_task_admin_add_customers_route.htm&type=5&language=en_US",
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
      docs: ["Tours are executable daily trips in the Consumer Goods Cloud DSD workflow, created either from routes or independently via tour templates. Each tour record (cgcloud__Tour__c) represents a specific day's work for a driver, containing an ordered list of customer visits, the assigned vehicle, and the start and end warehouse. Tours bridge the gap between route planning and on-the-ground execution by translating route blueprints into actionable daily schedules.", "Tour templates (cgcloud__Tour_Template__c) configure the operational parameters for tours, including start-of-day and end-of-day activities, vehicle inspection checks, security inspections, and GPS tracking settings. Tour checks (cgcloud__Tour_Check__c) validate vehicle condition attributes such as brakes, lights, and tires at tour start and tour end. Template-based tours also support object references (cgcloud__Tour_Template_Object_Reference__c) that link visit templates and order templates for ad-hoc visit and van-sales order creation.", "During execution, drivers use the mobile app's tour cockpit to manage their daily workflow. At the warehouse, the driver performs pre-tour activities including vehicle inspection and inventory check-out. The driver then proceeds through the ordered customer stops, executing visits, placing or delivering orders, and collecting payments. Upon returning to the warehouse, the driver completes end-of-day check-in, reconciles cash and inventory, and finalizes the tour."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_admin_tour_planning.htm&type=5&language=en_US",
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
      docs: ["Warehouses in Consumer Goods Cloud represent the manufacturer depots from which drivers start their delivery tours. Each warehouse record (cgcloud__Warehouse__c) stores location details including address, geographic coordinates, and associated products and vehicles. Warehouses serve as the physical hub for DSD operations, where products are stocked, vehicles are garaged, and drivers begin and end their daily work.", "To configure warehouses, administrators create warehouse records and associate them with products through warehouse product records (cgcloud__Warehouse_Product__c), which define which items can be shipped from that location. Warehouse users (cgcloud__Warehouse_User__c) control which drivers are authorized to check out inventory from the warehouse. Vehicles are linked to warehouses via vehicle warehouse records (cgcloud__Vehicle_Warehouse__c), ensuring that each depot has its assigned fleet.", "In practice, warehouses are the starting point for every tour. When a driver begins their day, they check out inventory from the warehouse to load their vehicle. The warehouse's product catalog determines what can be loaded, and inventory transactions track every product movement. At the end of the tour, the driver returns to the warehouse for check-in, reconciling delivered quantities, returned products, and collected cash against the original check-out records."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_admin_warehouse_management.htm&type=5&language=en_US",
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
      docs: ["Vehicle records (cgcloud__Vehicle__c) in Consumer Goods Cloud represent the trucks, trailers, and standard cars used to transport goods from warehouses to retail stores. Each vehicle record captures details such as vehicle type (Car Standard, Truck Slow, Truck Fast, or Trailer), identification information, and capacity constraints. Vehicles are essential components of the DSD workflow, linking physical transport assets to routes, tours, and warehouses.", "Vehicles are assigned to warehouses through vehicle warehouse records (cgcloud__Vehicle_Warehouse__c), establishing which vehicles are based at each depot. Vehicle-user assignments ensure that only authorized drivers can operate specific vehicles, maintaining compliance with transport regulations and company policies. Administrators manage the vehicle fleet by creating vehicle records and configuring the appropriate warehouse and user associations.", "During tour execution, the assigned vehicle is recorded on the tour, and drivers perform vehicle inspection checks at tour start and end. These checks validate the condition of critical vehicle components such as brakes, lights, and tires. Vehicle identification and inspection processes are handled through the Consumer Goods Cloud offline mobile app, ensuring that field operations maintain safety standards even when working without network connectivity."],
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
      docs: ["Inventory management in Consumer Goods Cloud provides real-time tracking of product quantities and flow throughout the DSD process. Inventory records (cgcloud__Inventory__c) track product stock, customer quotas, and cash float, with each record anchored to a combination of product name and an anchor entity such as a user, vehicle, or tour. Inventory transactions (cgcloud__Inventory_Transaction__c) capture every movement that changes inventory levels, supporting accurate tracking of distributed and offline shared inventories.", "Administrators configure inventory behavior through inventory control templates (cgcloud__Inventory_Control_Template__c) and inventory transaction templates (cgcloud__Inventory_Transaction_Template__c). Control templates define record types and policies for user, vehicle, and tour assignments, determining how inventory is structured. Transaction templates specify the movement behavior type: addition, withdrawal, balance, or void. These templates ensure consistent inventory handling across all warehouses and tours.", "Each time a driver loads a vehicle, an inventory transaction is created automatically based on the inventory configuration. Transactions are also generated when orders are released during visits, tracking the movement of goods from the vehicle to the customer. At the end of each tour, the driver performs inventory check-in at the warehouse, reconciling actual quantities against expected values. The system supports both store inventory checks and vehicle inventory checks, providing full audit trails for product movements.", "Consumer Goods Cloud also integrates with standard Salesforce inventory objects including ProductTransfer, ProductItem, and Shipment for organizations that need broader supply chain visibility. The recommended archiving strategy is to keep transactional objects below 200 million records to maintain system performance."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_admin_inventory_management.htm&type=5&language=en_US",
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
      docs: ["Order payments in Consumer Goods Cloud handle payment processing for van sales and delivery orders during field visits. Order payment records (cgcloud__Order_Payment__c) capture payment details collected from customers, supporting multiple payment methods including cash, credit card, debit card, and check. Each payment is linked to its originating order and the visit during which it was collected.", "Order payment templates (cgcloud__Order_Payment_Template__c) define the available payment methods and their configuration. These templates are associated with order templates through junction records (cgcloud__Order_Template_Order_Payment_Template__c), controlling which payment options are available for each type of order. Order payment inventory transactions (cgcloud__Order_Payment_Inventory_Transaction__c) link payments to the corresponding inventory movements, ensuring financial and physical reconciliation.", "During visit execution, drivers process payments as part of order finalization. For delivery orders, drivers collect payment upon delivery and the system generates invoices as either cash or credit documents. Cash handling tracks the total payment collection throughout the tour, and at end-of-day, the driver reconciles collected payments against orders delivered. Delivery tasks (DeliveryTask) manage the fulfillment of preordered products, tying the physical delivery to the financial transaction."],
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
      docs: ["The Consumer Goods Cloud offline mobile app is a native mobile application that enables field reps and delivery drivers to perform their full range of activities without requiring continuous network connectivity. The app supports two distinct UI flows: the existing flow for standard visits with assessment tasks, and the new flow supporting offline visit planning, advanced orders, CRM Analytics integration, editable master data, and personal settings adjustment. Core capabilities include attachment handling, barcode scanning, GPS tracking, and Bluetooth device connectivity.", "The mobile app is deployed through a multi-step process. Administrators first design the app using the VS Code Based Modeler, then deploy customizations through deployment packages uploaded via the Sync Management app. Configuration includes setting up mobile themes, permission sets for managed packages, and sync profiles. The app supports both the base and enhanced data models, with the enhanced model enabling advanced features such as offline ordering, penny perfect pricing, and ad-hoc visit creation based on territories.", "Field reps use the app throughout their workday to execute visits, take orders, conduct store audits, manage product surveys, handle asset checks, and complete customer tasks. For DSD operations, the app provides tour and driver cockpits that manage the entire daily workflow from vehicle inspection through order delivery and payment collection. All data captured offline is synchronized with Salesforce when connectivity is available, through configurable sync types including Initial Sync, First-Sync-of-Day, Background Sync, and On-Demand Sync."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_admin_setup_cg_offline_app.htm&type=5&language=en_US",
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
      docs: ["Sync Management configures and monitors the bidirectional data synchronization between Salesforce and Consumer Goods Cloud mobile devices. The system supports multiple sync types: Initial Sync (first-time full download), First-Sync-of-Day (daily delta), Background Sync (periodic automatic updates), On-Demand Sync (manually triggered), and Sync On Resume (when the app returns to the foreground). Each sync type serves a different purpose in keeping field devices current while minimizing data transfer.", "Administrators configure synchronization through the Sync Management app, which provides a centralized interface for managing sync configurations, tracked objects, named queries, and named fetch trees. The app includes monitoring capabilities with sync history views, device health dashboards, and error troubleshooting tools. Sync configurations define which objects and records are synchronized, while sync profiles group these configurations for different user roles such as sales reps, supervisors, or route-based delivery drivers.", "During daily operations, the sync engine ensures that customer master data, product catalogs, visit plans, and order information flow reliably between Salesforce and field devices. When reps capture data offline, the sync process uploads new records and downloads updates from Salesforce. Sync history and device health dashboards give administrators visibility into sync performance, helping them identify and resolve issues such as slow sync times, failed records, or devices that haven't synced recently."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.se_concept_sync_intro.htm&type=5&language=en_US",
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
      docs: ["Tracked objects define which standard or custom Salesforce objects are synchronized to mobile devices as local database tables. Each tracked object configuration (Sync_Tracked_Object_Config__c) specifies an object and includes a SOQL Where clause that controls which records are downloaded to the device. This filtering mechanism ensures that field reps receive only the data relevant to their territory, role, or assignment, optimizing storage and sync performance on mobile devices.", "Tracked object configurations are hierarchical, supporting standard, child, and grandchild levels. This hierarchy maps to the parent-child relationships between Salesforce objects, ensuring that related records are synced together. Each tracked object is associated with a parent sync configuration and scoped by the SOQL query result set. Administrators carefully design tracked object hierarchies to balance data completeness with device storage and sync time constraints.", "In practice, tracked objects form the data backbone of the offline mobile experience. Visit records, order data, customer information, product catalogs, and activity definitions are all configured as tracked objects. When the sync engine runs, it evaluates each tracked object's Where clause against current Salesforce data, downloading new or modified records and removing records that no longer match the filter criteria. This keeps the mobile database current while respecting the data boundaries defined by administrators."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.se_task_sync_map.htm&type=5&language=en_US",
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
      docs: ["Named queries and named fetch trees (NFTs) are advanced sync optimization mechanisms in Consumer Goods Cloud that control how data is fetched and filtered for mobile synchronization. Named queries are SOQL statements that return ID lists used to restrict which records are synced to devices. They support nested queries, allowing complex data relationships to be resolved server-side before sync, reducing the number of records transferred to the device.", "Named fetch trees describe hierarchical object relationships that enable efficient multi-object data fetching in a single API request. Instead of making separate queries for each related object, an NFT traverses the object graph in one operation, dramatically reducing the number of API calls required during sync. NFTs also simplify tracked object Where clauses by encapsulating complex relationship logic in a reusable tree structure.", "Administrators use named queries and NFTs together to optimize sync performance for complex data models. For example, an NFT can fetch a complete store record along with all its related contacts, addresses, visit history, and product assortments in one request. Named queries then filter these results to include only records relevant to the current user's territory or role. This combination is particularly important for large deployments where thousands of field reps sync data simultaneously."],
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
      docs: ["The VS Code Based Modeler enables administrators and developers to design and customize the Consumer Goods Cloud mobile app using Visual Studio Code. Available since Winter '24, the Modeler replaces earlier customization approaches with a modern development workflow based on design contracts: XML files that specify the mobile app's user interface, business processes, data sources, labels, objects, and other model components.", "Setting up the Modeler involves installing the Modeler CLI plugin for Salesforce CLI, downloading the base design contracts from the Sync Management app, and opening them in VS Code. Developers modify the XML design contracts to customize visit execution screens, order forms, activity layouts, and navigation flows. The Modeler supports framework APIs for advanced capabilities including barcode scanning, Bluetooth peripheral management, voice input, and custom print layouts.", "After customizations are complete, developers create deployment packages that bundle all changes into a single artifact. These packages are uploaded through the Sync Management app and pushed to field reps' devices during the next sync cycle. This deployment model allows organizations to iterate on their mobile experience without requiring app store updates, and supports targeting deployments to all users or specific user groups for phased rollouts."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_modeler_parent.htm&type=5&language=en_US",
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
      docs: ["Agentforce for Mobile integrates AI agents into the Consumer Goods Cloud mobile app, providing field reps with on-demand access to account insights, product performance data, and compliance information. The agents work with the Agentforce Employee Agent type and require online connectivity to process requests. When available, agents can answer questions about account revenue, order history, promotional effectiveness, and audit results, helping reps make informed decisions during store visits.", "To enable Agentforce on the mobile app, administrators configure the feature through Sync Configuration settings and ensure that users have the appropriate permissions. The integration leverages the broader Salesforce Agentforce platform, connecting the mobile app to the same AI capabilities available on desktop. The mobile-specific implementation is optimized for field scenarios, providing quick responses to common sales rep questions without requiring navigation away from the current workflow.", "During store visits, reps can invoke Agentforce agents to get product recommendations based on store performance data, review recent order history for the account, check promotion compliance across the territory, and receive suggestions for visit activities. The agents augment field rep knowledge by surfacing relevant data from across the organization, reducing the need for reps to manually search through reports or contact their supervisors for information."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.retail_enable_agentforce_cg_mobile_app.htm&language=en_US",
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
      docs: ["Salesforce Maps integration brings interactive map-based visualization to Consumer Goods Cloud, enabling sales managers and supervisors to view retail stores plotted on maps within their territories. The integration displays store distribution, visit coverage overlays, and compliance heat maps, giving managers a geographic perspective on their retail execution performance. Store locations are derived from Account and RetailStore records with associated Location data.", "Administrators configure Salesforce Maps through the Consumer Goods Cloud setup process, enabling map components on relevant Lightning pages. The integration supports territory views showing store distribution across organizational boundaries, with the ability to overlay visit status and compliance metrics for strategic planning. Map layers can display different data dimensions simultaneously, helping managers identify geographic patterns in store performance.", "In daily operations, sales managers use map views to assess territory coverage, identify stores that haven't been visited recently, and spot geographic clusters of underperforming locations. The map visualization provides context that tabular data cannot, revealing travel efficiency opportunities and territory imbalances. Map views complement the broader Analytics for Consumer Goods dashboards by adding a spatial dimension to territory and store performance analysis."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.retail_concept_admin_setup_sfmaps.htm&type=5&language=en_US",
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
      docs: ["The Nearby Map component is a Lightning component that displays retail stores in proximity to a specific location, helping field reps discover stores for ad-hoc visits. The component integrates with GPS location data from the mobile device to show real-time distance and direction to surrounding retail stores. This is particularly useful for reps who finish a scheduled visit early or encounter a store closure and need to find alternative stops nearby.", "The Nearby Map component works with RetailStore and Location objects, querying stores within a configurable radius of the rep's current position. The component can be added to Lightning pages and is accessible from the Consumer Goods Cloud offline mobile app when GPS is enabled. Store pins on the map display key information such as store name, last visit date, and compliance status, helping reps prioritize which nearby stores to visit.", "Field reps use the Nearby Map to maximize their productive time in the field. When a scheduled visit is completed ahead of time, a rep can check the Nearby Map to find stores within driving distance that may benefit from an unscheduled visit. Selected stores can be targeted for ad-hoc visit creation directly from the map interface, streamlining the transition from discovery to action."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_task_user_create_map_based_visits.htm&type=5&language=en_US",
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
      docs: ["Route optimization in Consumer Goods Cloud calculates the most efficient visit sequences for field reps, minimizing travel time between store stops. The optimization engine considers multiple constraints including store operating hours, expected visit durations, travel distances, and time windows to produce routes that visit the right stores at the right times. This reduces windshield time between stops and ensures that reps spend more of their day executing productive store activities.", "The feature works with Visit, RetailStore, and OperatingHours objects to build optimized sequences. Supervisors define the pool of stores that need to be visited and the optimization engine arranges them into efficient routes, respecting business rules such as preferred visit times and mandatory stop sequences. For DSD operations, route optimization can also be applied to delivery routes, ensuring that delivery drivers follow the most efficient path through their assigned customer stops.", "Optimized routes feed directly into trip list creation and visit planning workflows. Once an optimized sequence is calculated, it can be saved as a trip list and assigned to a rep for execution. The routes sync to mobile devices, where reps see their stops in the recommended order. Over time, route optimization data provides insights into travel patterns and territory design, helping managers identify opportunities to rebalance territories for more equitable workloads."],
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
      docs: ["Map-based visit creation allows supervisors and field reps to create visits by selecting stores directly on the Salesforce Maps interface. This visual approach to visit planning makes it easy to identify unvisited stores, plan geographic coverage, and create visits for specific locations without navigating through list views or individual store records. The feature supports multi-select for batch visit creation, enabling users to draw a selection area on the map and create visits for all stores within it.", "The feature works with Visit and RetailStore objects, displaying stores on the map with visual indicators of their visit status, compliance metrics, and last visit date. Supervisors use the map view to assess territory coverage and identify gaps where stores haven't been visited within their planned cadence. By selecting one or more stores on the map, they can create visits with a single action, specifying visit type, date, and assigned rep.", "Map-based visit creation is especially valuable for territory managers handling large numbers of stores across wide geographic areas. Instead of scrolling through lists of hundreds of stores, managers can zoom into a neighborhood on the map, visually assess which stores need attention, and create visits on the spot. The created visits flow into the standard visit planning pipeline, appearing on reps' mobile devices during the next sync cycle."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_task_user_create_map_based_visits.htm&type=5&language=en_US",
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
      docs: ["Territory visualization displays organizational unit territories and sales organization boundaries on the Salesforce Maps interface. Using org unit (cgcloud__Org_Unit__c) and sales organization (cgcloud__Sales_Organization__c) data, the map renders geographic boundaries that represent each rep's or team's coverage area. RetailStore locations are plotted within these boundaries, providing a complete view of how stores are distributed across the organization's territory structure.", "Managers use territory visualization to balance workloads, identify coverage gaps, and assess whether territory boundaries align with current business needs. The map overlay combines territory boundaries with store-level data such as visit compliance, KPI performance, and last visit date, enabling managers to spot territories with too many or too few stores, uneven compliance rates, or geographic inefficiencies. Org units in Consumer Goods Cloud are dynamic and can be adjusted based on territory realignments or new strategies.", "Territory visualization supports strategic planning by revealing patterns that aren't visible in tabular reports. Managers can see clusters of high-performing stores, corridors with poor visit coverage, and boundary areas where stores might be better served by a neighboring territory. When combined with visit compliance and execution data overlays, territory maps become a powerful tool for ongoing territory optimization and workforce planning."],
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
      docs: ["Customer Master is the foundational data layer for Trade Promotion Management, storing the customer hierarchies, contacts, roles, and relationships that anchor all TPM business processes. Standard Account records are extended with Account Extensions (cgcloud__Account_Extension__c) that hold TPM-specific attributes such as promotion validity dates, account plan type, fund validity periods, and overdraft allowance details. These extensions connect the standard Salesforce account model to the specialized needs of trade promotion workflows.", "Administrators establish customer data through account templates (cgcloud__Account_Template__c) that define the structure and defaults for new accounts. Account relationships (cgcloud__Account_Relationship__c) capture typed connections between customers, such as primary wholesaler or distributor relationships. Trade Org Hierarchies (cgcloud__Account_Trade_Org_Hierarchy__c) define parent-child account relationships that enable promotion planning at headquarter levels with execution cascading down to individual stores. Sub-accounts (cgcloud__Sub_Account__c) represent divisions within a single customer.", "In TPM operations, the customer master determines which promotions can be created for which accounts, how funds are allocated, and how claims are settled. When a KAM creates a promotion, the system uses the customer's account extension to validate promotion dates and overdraft limits. Trade org hierarchies enable push promotions where headquarter-level promotional agreements cascade to child accounts. Account relationships inform payment routing for claims, ensuring that compensation reaches the correct entity in complex retailer structures."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_task_admin_create_customer.htm&type=5&language=en_US",
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
      docs: ["Product Master contains all sellable products, advertising materials, and competitor products organized in hierarchies for Trade Promotion Management. Products are structured by category, subcategory, brand, and flavor through product hierarchy records (cgcloud__Product_Hierarchy__c), enabling promotions to target specific segments of the product catalog. Product conditions (cgcloud__Product_Condition__c) define price types and price lists, while product parts (cgcloud__Product_Part__c) describe bundled bill-of-material (BOM) relationships between products.", "Administrators configure product data through product templates (cgcloud__Product_Template__c) that group products by sales organization, ensuring each market has its own product catalog and pricing structure. Product category shares (cgcloud__Product_Category_Share__c) designate active product managers who are authorized to plan promotions for specific product categories. Product hierarchies are time-dependent, meaning the parent-child relationships between products can change over time to reflect reorganizations or seasonal assortments.", "In promotion planning, products are resolved into tactics through filter expressions that use both hierarchical attributes (category, subcategory, brand) and non-hierarchical attributes. When a KAM creates a tactic, the system resolves the available products based on the promotion template's product level settings and the account's product list. BOM component aggregation allows sales and spend data to roll up from component products to standard products, providing accurate KPI calculations for bundled items."],
      docUrl: "https://help.salesforce.com/s/articleView?language=en_US&id=sf.tpm_concept_admin_product_management.htm&type=5",
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
      docs: ["Sales organizations (cgcloud__Sales_Organization__c) are business segments that structure data and processes by organizational unit in Consumer Goods Cloud, enabling multi-market management within a single Salesforce org. Each sales organization represents a distinct market or business division, and all business templates are scoped to a specific sales org. Records created using those templates are automatically associated with the related organization, ensuring data isolation between markets.", "Administrators create sales organizations and configure market-specific settings including custom calendars, KPI calculation parameters, account product list types, and penny perfect pricing options. Each sales org maintains its own set of business templates for promotions, orders, visits, funds, and assortments. Users are mapped to sales organizations through sales organization user records (cgcloud__Sales_Organization_User__c), which control which markets a user can access and work within.", "In multi-market deployments, sales organizations enable a single Salesforce instance to serve multiple countries or business divisions with different product catalogs, pricing structures, and promotional strategies. A consumer goods manufacturer operating in both the United States and Germany, for example, would create separate sales organizations for each market, each with its own product hierarchies, customer templates, and KPI definitions. Data synchronization processes respect sales org boundaries, ensuring that field reps see only data relevant to their market."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_sales_org_parent.htm&type=5&language=en_US",
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
      docs: ["User management in Trade Promotion Management controls user roles, settings, working parameters, and substitution configurations for all TPM users. Key roles include Key Account Manager (KAM), Business Admin, and Finance Manager, each with distinct permission sets governing their access to promotions, funds, claims, and account plans. User settings (cgcloud__User_Setting__c) personalize each user's experience, including account views, visit calendars, working days, and KPI subsets.", "Administrators configure users through managed and unmanaged permission sets such as TPM Standard User, TPM Promotion Manager, TPM Finance Manager, and TPM Claim Manager. User views (cgcloud__User_View__c) define how account and promotion data is displayed for each user. Working day configurations control the business calendar for each user, affecting promotion scheduling and KPI calculation periods. KPI subset assignments determine which performance indicators each user sees in account plans and promotion P&L views.", "Substitution management ensures business continuity when sales reps are unavailable. Administrators assign substitutes to customers, and when the primary rep is absent, the substitute inherits access to the rep's accounts, visits, and pending promotions. For org unit-based assignments, substitutions are time-dependent, meaning the system automatically activates and deactivates substitute access based on configured date ranges. This prevents gaps in customer coverage during vacations, medical leave, or territory transitions."],
      docUrl: "https://help.salesforce.com/s/articleView?language=en_US&id=sf.tpm_manage_users.htm&type=5",
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
      docs: ["Account sets (cgcloud__Account_Set__c) group customers who perform similar activities such as promotions, pricing, or marketing campaigns. Each account set contains account set account records (cgcloud__Account_Set_Account__c) that link individual customers to the group. Account sets provide a flexible way to target promotions and activities at customer segments without requiring changes to the account hierarchy.", "Account sets can be created through three methods: manual creation by administrators or supervisors, integration through external systems via API, or automatic generation through segmentation rules. Segmentation rules leverage the flatten org unit hierarchy (cgcloud__Flatten_Org_Unit_Hierarchy__c) and Data Cloud integration to build dynamic customer groups based on attributes such as geography, store type, sales volume, or compliance history.", "In promotion workflows, account sets define the customer scope for promotional activities. When a KAM creates a promotion, they can target an account set rather than individual customers, ensuring that the promotion reaches all relevant stores. Account sets also support pricing and assortment decisions, enabling administrators to apply consistent product lists or pricing conditions to groups of similar customers. When customer attributes change, dynamic account sets based on segmentation rules automatically update their membership."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_task_admin_create_customer_sets.htm&type=5&language=en_US",
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
      docs: ["Distribution profiles (cgcloud__Week_Day_Share_Profile__c) store customer-level information about the breakdown of product or category deliveries for each day of the week. Each profile captures how a customer's weekly volume is distributed across individual days, reflecting actual delivery patterns that may vary by product category or customer logistics. This sub-weekly granularity is essential for accurate KPI calculations in Trade Promotion Management.", "Administrators configure distribution profiles when setting up customer data in TPM. Profiles are typically populated based on historical delivery patterns or agreed-upon schedules with retailers. When delivery patterns change mid-week or during promotional periods that shift normal ordering behavior, the weekly profiles can be updated to reflect the new rates. This flexibility ensures that KPI calculations remain accurate even during atypical periods.", "Distribution profiles feed directly into TPM's calculation engine for sub-weekly KPI calculations. When the system calculates promotion uplift, baseline volume, or actual sales for a specific time period, it uses distribution profiles to accurately apportion weekly values to individual days. This is particularly important for promotions that start or end mid-week, where a simple weekly average would overstate or understate the promotional impact. Analytics and reporting systems consume these profiles to provide accurate daily performance views."],
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
      docs: ["Advanced promotions (cgcloud__Promotion__c) are the core records in Consumer Goods Cloud Trade Promotion Management, representing agreements between manufacturers and retailers to increase revenue and market share. Each promotion stores customer anchoring, date ranges, status workflow phases, and supports child promotion hierarchies for complex promotional structures. Promotions encompass mega events, back-to-school campaigns, seasonal activities, and other marketing initiatives that use temporary price reductions, coupons, or in-store displays.", "Business administrators create promotion templates (cgcloud__Promotion_Template__c) that define the available product levels, KPI sets, tactic types, and workflow phases for each type of promotion. KAMs then create promotions from these templates, selecting a customer and configuring the promotion's date ranges and product scope. Products are resolved through filter expressions that use hierarchical attributes (category, brand) and non-hierarchical attributes, automatically determining which products are included in the promotion's tactics.", "Once created, promotions progress through a lifecycle of planning, approval, commitment, execution, and financial close. During planning, KAMs add tactics, link funds, and review KPI projections in the promotion P&L view. The Volume Planning Card and Spend Planning Card provide miniature P&L views for quick KPI assessment. After approval, promotions are published to the Trade Calendar and begin execution. Post-execution, actual values are collected from retailers and KPIs are recalculated, providing a complete picture of promotion effectiveness for analysis and future planning."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_concept_admin_promotion.htm&type=5&language=en_US",
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
      docs: ["Tactics (cgcloud__Tactic__c) represent the specific promotional activities carried out by retailers as part of a promotion. Each tactic is anchored to a promotion and defines a particular type of activity: displays for shelf visibility, temporary price reductions (TPR), advertisements in retailer media, or consumer coupons. Tactic templates (cgcloud__Tactic_Template__c) configure the available tactic types, their KPI subsets, condition settings, and display options for a promotion template.", "Each tactic links to one or more funds that pay for the activity, managed through the Tactic Funds Card. Tactic products (cgcloud__Tactic_Product__c) define which products participate in the tactic, while tactic product conditions (cgcloud__Tactic_Product_Condition__c) store the specific pricing or volume conditions applied. KAMs can include or exclude individual tactics within a promotion, and the system recalculates all KPI values in the promotion summary sheet and Account Plan P&L based on the included tactics.", "In practice, a promotion for a beverage brand might include three tactics: a display tactic for end-cap placement, a TPR tactic offering a 15% discount, and an advertisement tactic for the retailer's weekly circular. Each tactic has its own date range (which can differ from the promotion's overall dates), fund linkage, and KPI targets. The Spend Planning Card on each tactic shows KPIs that help the KAM track planned versus actual spending, while the system synchronizes tactic-level KPIs with the promotion-level P&L view."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_task_add_a_fund_to_a_tactic.htm&type=5&language=en_US",
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
      docs: ["The Trade Calendar is a customizable calendar view that displays events and promotions on a single screen, providing Key Account Managers with a consolidated planning console for trade promotions. The calendar visualizes promotional activities across time periods, helping KAMs identify scheduling gaps, monitor execution progress, and detect overlapping promotions that could create conflicts or cannibalize each other's impact.", "The Trade Calendar is accessed from the App Launcher and integrates directly with promotion records, account plans, and KPI data. KAMs can filter the calendar by customer, product category, time period, and promotion phase to focus on specific aspects of their promotional portfolio. The calendar view's filters are synchronized with the Account Plan P&L view, so when a KAM creates an account plan from the Trade Calendar, the selected filters are automatically applied.", "In daily use, the Trade Calendar serves as the KAM's primary workspace for promotion management. From the calendar, KAMs can create new promotions, open existing ones for editing, review KPI performance for active promotions, and navigate to the Account Plan P&L for financial analysis. The Trade Calendar also surfaces real-time reporting data, showing the live effect of promotion planning changes on account-level KPIs, enabling KAMs to make immediate adjustments to optimize their promotional strategy."],
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
      docs: ["Smart UI is a configurable Lightning Components interface designed to eliminate repetitive click-and-save actions during promotion creation and management. With Smart UI, KAMs can create a complete promotion including the header, tactics, product assignments, and fund linkages in a single Edit mode session, without needing to save and navigate between multiple record pages. This streamlined workflow significantly reduces the time required to set up complex promotions.", "Smart UI reads templates and master data to configure form layouts dynamically based on the promotion template's settings. The interface adapts to show relevant fields, picklists, and related lists based on the selected tactic types and product levels. Validation rules run in real-time during the editing session, alerting KAMs to issues before they save, rather than requiring them to fix problems after each individual save operation.", "In organizations managing hundreds of promotions per year, Smart UI's efficiency gains are substantial. A KAM who previously spent 15-20 minutes creating a promotion with multiple tactics can complete the same task in a fraction of the time. The single-session editing model also reduces errors by maintaining context throughout the creation process, preventing the data inconsistencies that can occur when switching between multiple record pages during promotion setup."],
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
      docs: ["KPI definitions (cgcloud__KPI_Definition__c) define the key performance indicators used across Trade Promotion Management, Account Planning, and Claims. Each KPI is defined as a monetary, volume, or percentage measure with a specific formula, aggregation rules, and time scope. KPI definitions support multiple types including calculated KPIs (formula-based), editable KPIs (manually entered), read KPIs (fetched from processing services), and validation KPIs (formula-based checks against other KPIs).", "KPI sets (cgcloud__KPI_Set__c) group individual KPI definitions and are mapped to business processes through templates. A promotion template references a KPI set to determine which indicators appear in the promotion P&L view. KPIs are configured with time granularity (period or subperiod), object scope (promotion, tactic, payment, funding), and time scope (complete, shipment, in-store, order, or custom). Aggregation settings control how KPI values are rolled up across product hierarchies and time periods, including merge rules and total calculation rules.", "In practice, KPI definitions drive the financial analysis that underpins all TPM decision-making. Common KPIs include planned volume, actual volume, base volume, lift volume, planned spend, actual spend, ROI, and margin percentage. KPI subsets allow administrators to group KPIs by purpose: PromoUI for promotion displays, Baseline Management for editable baseline KPIs, SPC for spend planning card display, and Mid Level Planning. KAMs see their assigned KPI subsets when filtering account plans, and the system calculates values through CG Cloud Processing Services using the defined formulas and aggregation rules."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_concept_permission_sets_users.htm&type=5&language=en_US",
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
      docs: ["Push promotions enable headquarter-level promotions to be distributed down to child accounts in the trade org hierarchy. When a KAM creates a promotion at the parent account level and initiates a push, the system creates child promotions for each eligible account in the hierarchy. Child accounts inherit the promotion's activities, tactics, and product assignments from the parent, allowing centralized planning with distributed execution across retail locations.", "The push process uses the trade org hierarchy structure defined in customer master data (cgcloud__Account_Trade_Org_Hierarchy__c) to determine which child accounts receive the promotion. Promotion push status records (cgcloud__Promotion_Push_Status__c) track the status and statistics for each push process, providing visibility into which child promotions were successfully created and which encountered issues. Administrators can configure whether KPI values are copied, distributed, or left blank during the push process.", "Push promotions are essential for large manufacturers managing national or regional promotional campaigns. A headquarter team can design a back-to-school promotion with specific tactics and KPI targets, then push it to dozens or hundreds of regional accounts in a single operation. Each child promotion inherits the parent's structure but can be independently modified by local KAMs to accommodate regional pricing, store-specific display requirements, or local market conditions. This balances the need for consistent brand strategy with the flexibility required for local execution."],
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
      docs: ["Fund Management is the core budgeting capability within Consumer Goods Cloud Trade Promotion Management that controls how promotional dollars are allocated and tracked. A fund holds money that serves as the promotion budget for either a customer, a customer-category combination, or a customer-brand combination. Finance managers create funds using fund templates that dictate the properties of each fund, including currency, customer anchor, and product anchor. By using these fund types, finance managers can create a variety of funds, each serving a distinct purpose in running promotions, with various customer- and product-anchor combinations.", "To set up Fund Management, an admin first configures fund templates (cgcloud__Fund_Template__c) that define the structural properties of each fund type. A Fund Template links the funds to a tactic or promotion via the tactic template, controlling which promotional activities can draw from the fund. After KAMs (Key Account Managers) receive their sales targets, finance managers allocate budgets to the KAMs by creating fund records (cgcloud__Fund__c) anchored to the appropriate customer and product combinations.", "In day-to-day operations, KAMs link the funds allocated to them to individual promotion tactics and can transfer money from one fund to another as business needs change. Fund balances are debited when promotion tactics are executed and claims are settled. Fund KPIs track budget utilization, committed spend, remaining balance, and overdraft status in real time, giving finance managers and KAMs full visibility into how promotional budgets are being consumed across their accounts."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_concept_admin_fund_management.htm&type=5&language=en_US",
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
      docs: ["Rate-Based Funding (RBF) provides a flexible budgeting mechanism within Consumer Goods Cloud that adjusts promotional budgets based on the latest sales estimates rather than fixed allocations. RBF budgets use actual values for past weeks and planned values for future weeks, making them inherently dynamic. RBFs can be based on product sales volume, revenue percentage, or fixed rates, enabling manufacturers to distribute trade budgets to retailers in a fair-share manner proportional to actual business performance.", "Admins configure RBF using RBF templates (cgcloud__RBF_Template__c) that define characteristics such as the rate type and associated KPI sets. Each RBF record (cgcloud__Rate_Based_Funding__c) stores information about the flexible budget allocated for promotions that are customer- or product-specific. Parent RBF records (cgcloud__Parent_RBF__c) can aggregate multiple child RBFs, enabling hierarchical budget management across regions or product lines.", "In practice, RBF values are recalculated as new sales data comes in, ensuring that promotional budgets reflect current market conditions rather than static annual allocations. KAMs benefit from budgets that automatically adjust to reflect actual performance, while finance managers retain control through the template-driven rate definitions. RBF values are driven by the KPI calculation engine, and the resulting budget figures feed into the account plan P&L and real-time reporting dashboards."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_concept_admin_fund_management.htm&type=5&language=en_US",
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
      docs: ["Multi-Fund Transactions provide the mechanism to create, adjust, transfer, and draw back fund budgets within Consumer Goods Cloud Trade Promotion Management. Each transaction is recorded through a header object (cgcloud__Fund_Transaction_Header__c) with individual transaction rows (cgcloud__Fund_Transaction__c and cgcloud__Fund_Transaction_Row__c) that create corresponding debit and credit entries. This double-entry structure ensures complete auditability of every budget movement across the promotional fund landscape.", "Transaction templates (cgcloud__Fund_Transaction_Template__c) govern the types of transactions available. There are three core transaction types: Initial transactions create new funds and do not require a source fund but can target one or more funds. Adjustment transactions revoke funds from one or more source funds without needing target funds, for example adjusting down a customer-product fund. Transfer transactions move money from a source fund to one or more target funds, such as redistributing budget from a headquarters fund to regional funds.", "In operational workflows, finance managers use initial transactions to allocate annual budgets to KAMs at the start of a fiscal period. As the year progresses, transfer transactions redistribute funds between regional accounts based on shifting business priorities. When claims are settled, the system automatically creates fund transaction rows that debit the appropriate funds. Each transaction maintains full traceability with debit and credit rows, supporting financial reconciliation and compliance reporting."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_concept_admin_fund_management.htm&type=5&language=en_US",
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
      docs: ["Fund KPIs are key performance indicators that track the financial health and utilization of promotional funds in Consumer Goods Cloud. KPI sets associated with funds measure budget utilization, committed spend, remaining balance, and overdraft status. These indicators are defined through KPI Definition objects (cgcloud__KPI_Definition__c) and grouped into KPI Sets (cgcloud__KPI_Set__c) that are mapped to fund templates, ensuring each fund type tracks the appropriate financial measures.", "A KPI set is mapped to a business process by using business templates. For funds, the KPI set is mapped to the fund template, which determines which indicators appear when viewing fund performance. KPIs at a parent fund level are read-only and represent aggregations of all child fund KPIs. This hierarchical aggregation means that managers viewing a regional fund automatically see rolled-up totals from all child funds beneath it.", "Fund KPIs feed into the real-time reporting engine and the account plan P&L view, providing KAMs and finance managers with immediate visibility into budget consumption patterns. When a promotion tactic commits funds or a claim settlement debits a fund balance, the associated KPIs update accordingly. This real-time feedback loop enables proactive budget management, allowing teams to identify overdraft risks and redistribute funds before promotional activities are impacted."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_concept_admin_fund_management.htm&type=5&language=en_US",
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
      docs: ["Claims Processing handles the creation and management of payment records (cgcloud__Payment__c) that specify remuneration to customers for running promotion tactics. After the tactics of a promotion are executed, retailers send payment requests as compensation for the expenses they incurred. Claims can be created manually within TPM or imported from third-party systems such as ERP platforms. The claim type is set using the claim template that is used to create claims, ensuring consistent processing across the organization.", "There are four supported claim types: Deduction, Credit Memo, Check Request, and Invoice-Based. Each type follows a different settlement path through the Accounts Receivable (A/R) and Accounts Payable (A/P) integration. Claim templates (cgcloud__Payment_Template__c) define the properties and KPI sets for each claim type, allowing admins to standardize the claim creation process across different sales organizations and markets.", "In practice, claims are matched against the promotion tactics they compensate, linking each payment to specific promotional activities and their associated funds. When a claim is approved and settled, the system debits the linked fund balances and updates the associated KPIs. Claims data flows into the account plan P&L, providing KAMs with an accurate picture of actual promotional costs versus planned budgets. The accrual engine in Data Cloud can also reconcile claim settlements against calculated promotional liabilities."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_concept_admin_promotion.htm&type=5&language=en_US",
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
      docs: ["Claims Approval provides a structured workflow to validate payment details before settlement, ensuring that claims are properly authorized before fund balances are debited. The approval process uses approval codes (cgcloud__Approval_Code__c) that are tied to user roles and authorization limits, controlling who can approve claims of different values and types. This prevents unauthorized or excessive payments from being processed against promotional funds.", "Approval codes are configured by admins and linked to user settings within each sales organization. Each approval code specifies the maximum value a user can authorize, the claim types they can approve, and any additional validation rules. When a claim enters the approval workflow, the system validates the payment details against the anchored funds, checking for sufficient balance, overdraft limits, and proper customer-fund relationships.", "During daily operations, claims progress through approval stages based on their value and type. Lower-value claims may be auto-approved if they fall within the user's authorization limit, while higher-value claims route to senior approvers. The approval workflow integrates with the broader TPM business process, ensuring that only validated claims proceed to settlement against fund balances and A/R or A/P integration."],
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
      docs: ["Claims Import supports the ingestion of claim records from third-party systems and ERP integrations, enabling manufacturers to process retailer-submitted claims within the TPM framework. Retailers often submit claims externally through their own procurement or accounts receivable systems, and these records need to be matched against the corresponding promotion tactics within Consumer Goods Cloud. This import capability eliminates the need for manual re-entry of claim data that originates outside the Salesforce platform.", "The import process maps external claim data to the TPM Payment object (cgcloud__Payment__c), matching incoming records against customer master data to identify the correct account relationships. Imported claims go through the same validation and approval workflows as manually created claims, ensuring consistent processing regardless of the claim's origin. MuleSoft Direct integration provides a prebuilt API pathway for connecting external ERP systems to Consumer Goods Cloud.", "In practice, retailers may submit hundreds or thousands of claim records at once, particularly for large-scale promotional campaigns. The import mechanism handles batch processing of these records, flagging any claims that cannot be automatically matched to promotion tactics for manual review. This automation significantly reduces the administrative burden on finance teams while maintaining the data integrity required for accurate fund debit tracking and P&L reporting."],
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
      docs: ["Claims KPIs track the financial performance of claim settlement activities within Consumer Goods Cloud Trade Promotion Management. KPI sets associated with claims measure claim values, settlement status, and variance between planned and actual promotion costs. Like other TPM KPIs, claim indicators are defined through KPI Definition objects (cgcloud__KPI_Definition__c) and grouped into KPI Sets (cgcloud__KPI_Set__c) that are mapped to claim templates.", "The KPI set for claims is mapped via the payment template, which determines which indicators are calculated and displayed for each claim type. KPIs can represent monetary, volume, or percentage measures shown in the claim view. For example, actual claim cost versus planned tactic cost, settlement rate, and outstanding claim balance are typical measures. KPIs at parent levels are read-only aggregations of child KPIs, enabling rolled-up visibility across claim portfolios.", "Claims KPIs feed directly into the real-time reporting engine and the account plan P&L, providing immediate visibility into settlement progress and cost variances. When claim actuals are processed, the corresponding KPIs update in real time, allowing KAMs and finance managers to monitor how actual promotional costs compare to planned budgets. This data is critical for next-period planning decisions, helping teams adjust promotional investment strategies based on historical claim patterns."],
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
      docs: ["Customer Business Plans store data for an account and business year combination with one or more product categories, forming the foundation of account-level planning in Consumer Goods Cloud. The Customer Business Plan object (cgcloud__Account_Plan__c) allows KAMs to enter or manually adjust KPI data, with changes cascading to promotions and account plans. This is where management-defined fiscal year targets are broken down to the account level for day-to-day execution.", "To set up Customer Business Plans, admins configure customer templates that determine the KPI sets and product aggregation levels available in the plan. A management team first defines targets to achieve in the current fiscal year based on the team's performance in the previous year. These country- or region-level targets are then broken down and loaded into Customer Business Plans at the account level, giving KAMs a clear picture of what they need to achieve.", "In daily workflow, KAMs use Customer Business Plans to plan promotions against their targets, monitor actual performance versus plan, and adjust KPI values as market conditions change. When KPIs are changed in a Customer Business Plan, the changes reflect in promotions and the account plan P&L. KAMs can download data from account plan P&L and Customer Business Plan scenarios to share insights across product hierarchy levels, enabling collaborative decision-making with management."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_account_plan_cbp_create.htm&type=5&language=en_US",
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
      docs: ["The Account P&L View shows the aggregated KPI for a customer and product combination over a defined timeframe, providing KAMs with a comprehensive profit and loss overview of their accounts. It displays planned versus actual values across promotion, fund, and claim KPIs in a hierarchical grid, enabling managers to see exactly how each account is performing against its targets. The Account P&L serves as the central financial dashboard for trade promotion management at the account level.", "The Account P&L is configured through the customer template and KPI set mappings. Account plans can be created to group different KPIs, aggregate weekly and monthly data, and present a unified financial view. Admins can create separate account plan P&Ls for different business needs, and the view automatically incorporates data from promotions, funds, and claims. Embedded real-time reports can be added to the account plan view for additional analytical context.", "KAMs use the Account P&L view as their primary dashboard for account-level financial performance. Fund allocations, promotional spending, and claim actuals all appear in a single consolidated view, making it straightforward to identify variances between planned and actual performance. The hierarchical grid structure allows users to drill down from top-level account metrics to individual product categories and promotional activities, supporting both high-level oversight and detailed analysis."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_account_plan_create_view.htm&type=5&language=en_US",
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
      docs: ["Scenario Planning enables KAMs to model different promotional investment strategies by downloading data from the account plan P&L and adjusting KPI inputs to observe the impact on profitability. This what-if analysis capability allows teams to compare multiple investment scenarios before committing promotional budgets, reducing the risk of suboptimal spending decisions. Scenarios are created within the Customer Business Plan interface and can be saved for comparison during planning reviews.", "KAMs can create and edit scenarios within the Customer Business Plan interface. Each scenario adjusts KPI values such as planned volume, revenue targets, or promotional spend, and the KPI calculation engine recalculates the resulting P&L impact in real time. Scenarios leverage the same calculation engine as the live account plan, ensuring consistency between modeled and actual results.", "In practice, Scenario Planning is most commonly used during annual planning cycles and mid-year budget reviews. KAMs can model the impact of increasing promotional investment in a particular product category, shifting budget from one tactic type to another, or adjusting volume targets based on market intelligence. The ability to compare scenarios side by side helps management make data-driven decisions about where to allocate limited promotional resources for maximum return."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_cbp_scenario_edit_kpis.htm&type=5&language=en_US",
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
      docs: ["Sub-Account Planning allows organizations to break down account-level planning into more granular segments using sub-account records (cgcloud__Sub_Account__c). Sub-accounts are subsets of accounts whose KPIs aggregate to parent account KPIs in the account plan. For example, a retailer headquarter account might have sub-accounts for supermarkets and hypermarkets, each tracking separate volume and revenue targets.", "Sub-accounts derive their structure from the customer master hierarchy, and their configuration is managed through the same customer template and KPI set framework as the parent account. When KPIs are updated at the sub-account level, the changes automatically roll up to the parent account's P&L view, maintaining consistency across the planning hierarchy. This rollup behavior ensures that headquarter-level visibility is always accurate regardless of how granularly individual sub-accounts are managed.", "In practice, sub-account planning enables KAMs to tailor their promotional strategies for different store formats or channels within a single retailer relationship. A KAM managing a national grocery chain can set distinct volume targets for convenience stores versus large-format stores, plan different tactical mixes for each, and still see a unified P&L at the headquarter level. This granularity supports more precise budget allocation and performance tracking across diverse retail formats."],
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
      docs: ["Manual Inputs allow KAMs to directly enter or adjust KPI values in account plans, overriding the system-calculated values when business knowledge warrants a different figure. Manual input overrides cascade through the P&L calculation, updating all downstream KPIs that depend on the adjusted value. This capability bridges the gap between automated calculations and real-world business intelligence that cannot be captured in formulas alone.", "By default, you can enter up to 5,000 manual inputs for an account plan. However, if this limit is not sufficient, admins can increase the limit for manual inputs to up to 100,000 per account plan. The manual input feature is available within the Customer Business Plan and account plan P&L interfaces, where KAMs can directly edit KPI cells and see the cascading impact on related measures.", "KAMs typically use manual inputs during planning cycles to incorporate market intelligence, competitive insights, or negotiation outcomes that are not reflected in historical data. For example, a KAM might manually adjust volume targets after negotiating a new shelf space agreement with a retailer, or override a revenue forecast based on knowledge of an upcoming competitor product launch. These adjustments are reflected in the KPI calculation engine and update the real-time reporting views accordingly."],
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
      docs: ["Real-Time Reporting (RTR) provides configurable reports that fetch calculation results from CG Cloud Processing Services, giving TPM users up-to-date visibility into promotion and account performance measures. RTR Report Configurations define custom real-time reports that can display account-level and promotion-level measures, enabling KAMs and managers to monitor business performance without waiting for batch reporting cycles. RTR is one of the multiple reporting options available in TPM to analyze data stored in both processing services and Salesforce.", "To configure real-time reporting, admins set up RTR report configurations that specify which measures to display, the data granularity, and the embedding location. Reports can be embedded directly on promotion detail pages, account plan views, and custom Lightning pages using the RTR component. The configuration-driven approach means new reports can be added without code changes, simply by defining the measures and layout in the RTR configuration.", "In daily workflows, KAMs rely on real-time reports to monitor promotion KPIs during active promotional periods, track account plan P&L measures as claims are processed, and identify variances between planned and actual performance. The reports fetch data directly from the processing service, ensuring that the displayed values reflect the most current calculations including any recent save-and-calculate operations. This immediacy makes RTR the preferred reporting method for operational decision-making during active promotional campaigns."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_rtr_concept_configure_rtr.htm&type=5&language=en_US",
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
      docs: ["The KPI Calculation Engine is the central processing service that calculates all key performance indicators within Consumer Goods Cloud Trade Promotion Management, including volume, revenue, cost, and profitability measures. KPIs are defined through KPI Definition objects (cgcloud__KPI_Definition__c) and grouped into KPI Sets (cgcloud__KPI_Set__c) that are mapped to business templates for promotions, account plans, funds, and claims. Each KPI can be one monetary, volume, or percentage measure, and KPI sets group these individual indicators into coherent collections for each business process.", "Business data from Salesforce objects is synchronized with CG Cloud Processing Services using SF Data Sync. Admins can choose changed objects and sync new data with the processing service, running the sync as a batch process, continuously, or at specified times. The processing service then calculates KPIs based on the synchronized data. Calculations run during save-and-calculate operations, batch server processes, and real-time browser updates.", "The KPI engine powers every numerical display in the TPM interface, from promotion summary sheets showing tactic-level costs to the account plan P&L aggregating all promotional activity for an account. When KPI values change in a Customer Business Plan, the changes reflect in promotions and the account plan. The engine supports manual input overrides, recalculating all dependent measures when a KAM adjusts a value. Understanding how KPI values are calculated is essential for correctly interpreting the data displayed across all TPM views."],
      docUrl: "https://help.salesforce.com/s/articleView?language=en_US&id=sf.concept_kpi_configurations.htm&type=5",
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
      docs: ["CRM Analytics Dashboards provide pre-built analytical views for Consumer Goods Cloud Retail Execution, giving sales teams actionable insights into retail business performance. The standard Analytics for Consumer Goods app includes dashboards for Territory, Store Compliance, Product Performance, Sales Rep effectiveness, and Whitespace Analysis. Sales managers can use these dashboards to increase sales, improve store compliance, identify stores at risk, and maximize sales rep effectiveness.", "Deploying CRM Analytics requires enabling CRM Analytics in the org, assigning the appropriate Analytics permission sets, and installing the Analytics for Consumer Goods template app. The Advanced Data Model dashboards add Territory Performance, Sales Manager Insights, and Account Insights views that leverage the enhanced data model for account-level business performance analysis. Admins configure analytics cards in the mobile app to give field reps access to reports and dashboards from within the Consumer Goods offline mobile app.", "Sales reps get store-level insights on visits, sales, compliance, and top-selling products directly through the analytics dashboards. The dashboards can be embedded in Lightning pages, accessed through the CRM Analytics Studio, or viewed through analytics cards on the mobile app. Data refresh scheduling ensures that dashboard content stays current, and sales managers can use the insights to make data-driven decisions about territory assignments, visit priorities, and promotional effectiveness."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.retail_admin_analytics_deploy.htm&type=5&language=en_US",
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
      docs: ["Uplift Prediction uses CRM Analytics and machine learning to predict the incremental sales volume that a promotion will generate, helping KAMs forecast the return on promotional investment before committing budgets. The prediction model analyzes historical promotion data including tactic types, product categories, customer segments, and seasonal patterns to estimate the expected sales uplift for planned promotions. This predictive capability transforms promotion planning from a purely experience-based process into a data-driven one.", "Setting up Uplift Prediction requires CRM Analytics licenses and the TPM Revenue Prediction permission set. Admins configure tactic templates for uplift, create KPI definitions for uplift KPI sets, and set up the CRM Analytics prediction app with appropriate input features and baseline configurations. The prediction model must be trained on sufficient historical promotion data before it can generate reliable uplift estimates.", "KAMs use uplift predictions during the promotion planning process to compare the expected incremental volume across different tactical approaches. When creating or editing a promotion, the predicted uplift volume appears alongside the planned KPIs, enabling data-driven decisions about which tactics to employ and how much budget to allocate. Predicted uplift values also inform account plan targets, helping management set realistic volume goals based on the planned promotional calendar.", "Before predicting uplift, organizations should ensure they have adequate historical promotion data for model training. The prediction accuracy depends on the volume and quality of historical data, and results should be validated against actual promotion outcomes over time. Organizations should review the considerations for predicting uplift documented in the Salesforce help to understand the data requirements and model limitations."],
      docUrl: "https://help.salesforce.com/s/articleView?language=en_US&id=sf.tpm_admin_analytics_tpo.htm&type=5",
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
      docs: ["KPI Export enables organizations to extract TPM KPI data as CSV files for use in downstream systems such as Trade Promotion Effectiveness (TPE) analytics or external data lakes. This capability bridges the gap between the CG Cloud Processing Service where KPIs are calculated and external business intelligence tools or data warehouses that require TPM data for broader analytical purposes. The export function ensures that TPM performance data can be leveraged across the entire enterprise analytics landscape.", "The export process is configured through the TPM administration interface, where admins specify which KPI measures to export, the data granularity, and the export schedule. Exported files contain the calculated KPI values from the processing service, providing a snapshot of promotional performance data that can be ingested by external systems without direct API integration to the processing service. The export can be scheduled to run automatically at regular intervals or triggered on demand as needed.", "Organizations typically use KPI Export when they need to combine TPM data with other business data sources for comprehensive trade promotion effectiveness analysis, when building executive dashboards in external BI tools, or when maintaining a backup of TPM calculation data outside the CG Cloud Processing Service. The CSV format ensures broad compatibility with data integration tools and ETL processes. For organizations also using Data Cloud, the Data 360 Integration provides an alternative pathway for centralizing KPI data without manual CSV handling."],
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
      docs: ["Data 360 Integration centralizes Trade Promotion Management writeback KPIs from package objects and the offcore processing service into Data 360, enhancing visibility and decision-making across the organization. This integration offers a holistic view of product sales, promotional effectiveness, and business trends across various brands, categories, and account hierarchies that goes beyond what standard TPM reporting provides. Data 360 serves as a comprehensive analytics layer for organizations that need cross-domain visibility into their trade promotion data.", "The integration connects the CG Cloud Processing Service KPI data with the Data 360 analytics platform, mapping TPM measures to the Data 360 data model. Admins configure the integration to specify which KPI categories and data dimensions flow into Data 360, ensuring that the analytics platform receives the relevant promotional performance data without unnecessary data volume. The mapping process aligns TPM-specific measures with the broader Data 360 schema, enabling consistent reporting across data sources.", "Business users benefit from Data 360 Integration by gaining access to cross-functional analytics that combine TPM data with other business data sources. Marketing teams can analyze promotional effectiveness alongside brand metrics, finance teams can reconcile promotional spending with broader P&L data, and executives can view promotional performance in the context of overall business trends. The unified data layer supports advanced analytics and reporting use cases that require data from multiple Consumer Goods Cloud domains."],
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
      docs: ["The TPM KAM Agent is an Agentforce Employee Agent specifically configured for Trade Promotion Management Key Account Managers. It supports viewing promotion and account measures, copying promotions, and updating existing promotions using 13 custom actions that interact with the TPM Business Object API workflows. The agent allows KAMs to perform complex TPM tasks through natural language requests rather than navigating multiple screens and menus.", "The KAM Agent is built on the Agentforce platform and uses an Agentforce Employee Agent template. Admins set up the agent by enabling Agentforce, configuring agent topics that group related TPM tasks, and defining context variables that map the user's sales organization, permissions, and data filters to appropriate actions. The agent requires the Agentforce for Consumer Goods Cloud add-on license and consumes Flex Credits and Einstein Requests.", "In daily workflow, a KAM opens the agent interface and submits natural language requests such as asking for promotion performance measures for a specific account, requesting to copy a successful promotion to a new time period, or updating tactic details on an existing promotion. The LLM evaluates the request against configured topics, selects the appropriate custom actions, executes them via the Business Object API, and presents the results with actionable next steps. This significantly reduces the time required for routine TPM tasks."],
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
      docs: ["Agent Actions are the thirteen custom actions that power the TPM KAM Agent, providing specific capabilities for interacting with Consumer Goods Cloud data and workflows. Key actions include Read User Sales Organization, Execute Promotion BO API Workflow, Retrieve Account Measures, Retrieve Promotion Measures, Get Products, Validate TPM Account, and several others that cover the full range of TPM operations a KAM performs. Each action encapsulates a discrete business operation that the agent can invoke based on the user's natural language request.", "Each action is configured as a custom agent action within the Agentforce framework, with defined input parameters, output schemas, and API endpoints. The actions interact with the TPM Business Object API to read data from and write data to CG Cloud objects and the processing service. Admins can customize action configurations and add new actions as business requirements evolve, following Salesforce's standard agent action development patterns.", "The actions work together in orchestrated sequences. For example, when a KAM asks the agent to show promotion performance for a specific account, the agent first executes the Validate TPM Account action to confirm access, then uses Read User Sales Organization to establish context, and finally calls Retrieve Promotion Measures to fetch the data. This orchestration happens automatically based on the LLM's interpretation of the user's request and the configured topic instructions."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ai.copilot_actions_custom.htm&language=en_US",
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
      docs: ["Retail Execution Agents bring Agentforce capabilities to the field sales side of Consumer Goods Cloud, including Customer Service Assistance for handling store inquiries and the Visit Assistant for helping field reps plan and execute store visits. These agents streamline Retail Execution by automating key tasks such as generating account and visit insights, suggesting products and promotions, and creating visits. They are built on the Agentforce platform and operate on both the Consumer Goods Cloud mobile and desktop apps.", "The Customer Service Assistance agent provides AI-driven insights on store performance, compliance, restocks, and visit schedules. It uses account summaries to enhance customer interactions and drives sales through intelligent product recommendations. The Retail Execution Visit Assistant is an autonomous AI agent that helps field reps, supervisors, and other Retail Execution users access and analyze key data and perform tasks related to retail visits directly within their workflow.", "Agentforce for Retail Execution works on the Consumer Goods Cloud mobile and desktop apps but requires online mode on mobile devices. The agents support English (en_US) locale and consume Flex Credits, Einstein Requests, and Data Services Credits. Agents can generate account performance data, retrieve orders by account or visit, get customer tasks, and identify records, making field reps more efficient during store visits.", "Usage of Agentforce impacts credit consumption against Flex Credits, Einstein Requests, and Data Services Credits. Before deployment, organizations should work with their Salesforce account team to confirm license availability and plan credit usage. Agentforce does not work in the Modeler simulator app and requires the Agentforce for Consumer Goods Cloud add-on license."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.retail_agentforce_cg_mobile_app_intro.htm&language=en_US",
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
      docs: ["Agent Topics group related tasks within the Agentforce framework and define how the AI agent interprets and responds to user requests. Each topic contains a set of instructions, associated actions, and scope definitions that guide the LLM in selecting the appropriate actions for a given request. Topics ensure that the agent acts consistently by constraining which capabilities are available for different categories of user interactions.", "Admins configure topics using the Agentforce setup interface, defining the topic name, description, instructions for the LLM, and the set of actions available within that topic. Context variables are defined to map sales organization, user permissions, and data filters to appropriate actions, ensuring that the agent only accesses data and performs operations that the current user is authorized for. Best practices for writing topic instructions are provided in the Agentforce documentation.", "In practice, topics provide the organizational structure that makes the agent reliable and predictable. For example, a TPM topic might group all promotion-related actions together with instructions about when to validate account access, how to handle ambiguous product references, and which measures to present by default. This topic-based architecture ensures that the agent's behavior aligns with business processes and security requirements across different sales organizations and user roles."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ai.copilot_topics.htm&type=5&language=en_US",
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
      docs: ["Einstein Visit Recommendations use machine learning to assist sales managers and field representatives in identifying which stores to visit next, enhancing efficiency and maximizing sales opportunities. The model considers visit frequency, compliance scores, store revenue potential, and time since last visit to generate prioritized store recommendations for each sales rep's territory. This AI-driven approach replaces manual visit prioritization with data-backed suggestions that optimize field rep time allocation.", "Setting up Visit Recommendations requires enabling Einstein for Consumer Goods Cloud, configuring the recommendation model parameters, and scheduling the recommendation generation process. The model trains on historical visit data, compliance metrics, and sales performance to learn patterns that indicate which stores would benefit most from a visit. Admins can configure the weighting of different factors to align recommendations with business priorities.", "Field reps receive prioritized store recommendations through the mobile app and desktop interface, with each recommendation including the factors that drove its priority score. Sales managers can use the recommendations to create visits directly, either individually or in bulk. The Visit Assistant agent can also incorporate these recommendations into its visit planning suggestions, creating a seamless workflow from AI-generated insight to scheduled visit."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.industries_einstein_ed_visit_recommendation.htm&language=en_US",
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
      docs: ["GenAI Health Assessments leverage Einstein generative AI to produce natural language evaluations of account performance, providing managers and field reps with comprehensive summaries that would otherwise require manually reviewing multiple data sources. The feature analyzes store visit data, compliance metrics, and product performance to generate readable health assessments for each account. These assessments surface key performance trends, risk areas, and actionable recommendations in plain language.", "To enable GenAI Health Assessments, admins must turn on Einstein generative AI in Retail Execution Settings from Setup, add the Quick Insights component to the account page layout, and assign the required permission sets to users. The feature uses prompt templates that define what data to analyze and how to structure the assessment output. The Enterprise and Unlimited editions with Consumer Goods Cloud and the required Agentforce add-ons are needed.", "Users generate health assessments by navigating to an account record, finding the Quick Insights section, selecting the health assessment prompt, and clicking Summarize. The AI produces a natural language summary covering key performance trends, risk areas, and recommended actions. Users can provide feedback on the quality of responses to help improve future assessments. The feature requires an online connection as it processes data through the Einstein generative AI service."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_admin_einstein_embeddedai_cg_pilot.htm&language=en_US",
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
      docs: ["Inventory Deviation Detection uses Einstein AI to analyze inventory count data from store visits and warehouse reconciliations, identifying deviations from expected levels. The feature flags out-of-stock risks, overstocking situations, and unusual patterns that require attention, helping field reps and inventory managers proactively address supply chain issues before they impact sales. The analysis compares current inventory counts against expected levels derived from historical patterns, assortment plans, and recent order data.", "The feature is accessible through the Einstein Quick Insights component on warehouse and account objects. Admins enable it by turning on Einstein generative AI in Retail Execution Settings, configuring the Quick Insights component on the appropriate page layouts, and assigning the Direct Store Delivery for Consumer Goods Offline Mobile App permission set. The system compares current inventory counts against expected levels based on historical patterns and current assortment plans.", "Users generate inventory deviation reports by navigating to a warehouse record, finding the Quick Insights section, selecting the inventory deviation prompt, and clicking Summarize. The AI analyzes the post-reconciliation inventory data and produces a summary of significant deviations with contextual explanations. This helps inventory managers quickly identify which products need immediate attention, whether due to unexplained shrinkage, over-delivery, or demand fluctuations that the standard inventory controls did not anticipate."],
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
      docs: ["Quick Insights is the Einstein generative AI component that surfaces AI-generated contextual insights on account, store, warehouse, and product records within Consumer Goods Cloud. It provides at-a-glance summaries of trends, anomalies, and opportunities through a configurable Lightning component that users interact with directly on record pages. The component supports multiple prompt types including health assessments, performance summaries, and inventory deviations.", "Admins configure Quick Insights by enabling Einstein generative AI in the org settings, adding the Einstein Quick Insights component to the desired record page layouts using Lightning App Builder, and selecting which prompt templates are available for each object type. Different prompt templates can be configured for different business needs, and the prompts can be customized to focus on specific data points or analysis perspectives. Permission sets must be assigned to users who need access to the Quick Insights feature.", "In day-to-day use, field reps and managers click on the Quick Insights component on any supported record page to generate an AI summary on demand. The insights are generated in real time using the current data in the system, ensuring relevance. Users can provide thumbs-up or thumbs-down feedback on generated insights, which helps Salesforce improve the AI models over time. The component works on both desktop and mobile interfaces, though it requires an online connection for AI processing."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_task_admin_configure_einstein_summary_component.htm&type=5&language=en_US",
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
      docs: ["The CG Cloud Data Kit is an installable package that deploys data streams to enable Consumer Goods Cloud data to flow into Data Cloud Data Model Objects (DMOs). It includes pre-mapped DLO-to-DMO attribute mappings for accounts, products, promotions, tactics, and store assortments, significantly reducing the setup effort required to integrate CG Cloud with Data Cloud. The Data Kit is the recommended starting point for organizations adopting Data Cloud with their Consumer Goods Cloud deployment.", "Installation of the Data Kit requires the Salesforce Connector to be configured in Data Cloud and the SSOT (Single Source of Truth) package to be at the latest version. The SSOT framework within Data Cloud maintains the Salesforce Standard Data Model across various applications and data sources. After installation, the Data Kit deploys data streams for key CG Cloud objects including Account, Product, Promotion, Tactic, Assortment, AssortmentProduct, and StoreAssortment.", "Once deployed, the data streams continuously ingest CG Cloud object data into Data Cloud, where it becomes available for segmentation, analytics, and activation use cases. The pre-mapped attribute mappings ensure that field-level data flows correctly from the source Salesforce objects into the standardized DMO structure, maintaining data integrity across the integration. Organizations can customize the mappings and add additional data streams as needed beyond the pre-configured set."],
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
      docs: ["Data Model Objects (DMOs) are the standardized data entities maintained within Data Cloud's Single Source of Truth (SSOT) framework. In the Consumer Goods Cloud integration, DLO (Data Lake Object) attributes from CG Cloud objects are mapped to DMO attributes for Account, Product, Promotion, Tactic, and Store Assortment entities. These mappings ensure that CG Cloud data conforms to the Salesforce standard data model when it enters Data Cloud.", "The mapping configuration is managed through the Data Cloud setup interface, where admins can view and customize the attribute-level mappings between source CG Cloud objects and target DMOs. Key source objects include cgcloud__Account_Extension__c for account data, cgcloud__Product_Hierarchy__c for product hierarchies, cgcloud__Promotion__c for promotions, and cgcloud__Tactic__c for tactics. The CG Cloud Data Kit provides initial mappings, but admins can extend them to include custom fields.", "The standardized DMO layer provides a unified data foundation for advanced analytics, segmentation, and cross-org data sharing. Because DMOs follow the Salesforce standard data model, they can be combined with data from other clouds and external sources within Data Cloud, enabling holistic views of customer behavior, product performance, and promotional effectiveness that span beyond the Consumer Goods Cloud boundary. This interoperability is maintained through the SSOT framework that keeps the data model consistent across applications."],
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
      docs: ["Account Segmentation in Data Cloud enables Consumer Goods Cloud users to create customer segments based on data-driven insights, optimizing retail activities and promotional targeting. Segmentation rules can automatically populate account sets (cgcloud__Account_Set__c) for targeted promotion planning, replacing manual account selection with dynamic, data-driven audience creation. Customer sets created through segmentation ensure that promotional campaigns reach the most appropriate store groups based on actual behavioral and performance data.", "Admins configure segmentation rules within the Data Cloud interface, defining criteria based on account attributes, purchase behavior, visit compliance, and other dimensions available through the ingested CG Cloud data. Customer sets can also be created manually or integrated through external systems. The segmentation rules process ingested data to create and maintain customer segments that automatically update as new data flows in.", "In practice, segmentation powers more targeted promotional strategies by grouping stores with similar characteristics or behaviors. For example, a manufacturer might create a segment of high-compliance, high-volume stores for premium promotional tactics, while directing different tactics to stores with low compliance scores that need attention. The ability to base segments on Data Cloud's unified data model means segmentation criteria can incorporate signals from across the entire CG Cloud data landscape."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.cg_concept_admin_customer_target_group_segmentation.htm&type=5&language=en_US",
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
      docs: ["The Accrual Engine calculates the debt incurred for rebate programs, loyalty programs, promotions, and claims within Consumer Goods Cloud. It runs on Data Cloud and consumes Data Cloud compute credits, providing a scalable calculation platform for promotional liability tracking. The engine enables manufacturers to maintain accurate financial provisions for their promotional commitments throughout the fiscal period.", "The Accrual Engine is configured through accrual templates that define the calculation rules, triggering events, and data sources for each accrual type. Admins enable Data Cloud for the org and configure the engine through the TPM administration interface. Promotions are only closed if the Enable Accrual setting is properly configured, and the accrual calculation integrates with the promotion lifecycle management process.", "In financial workflows, the Accrual Engine reconciles calculated promotional liabilities against actual claim settlements. As promotions run and claims are processed, the engine updates accrual balances to reflect the difference between committed promotional spend and settled payments. This gives finance teams an accurate picture of outstanding promotional liabilities at any point in time, supporting financial reporting, period-end close processes, and budget forecasting for future promotional investment."],
      docUrl: "https://help.salesforce.com/s/articleView?id=ind.tpm_concept_accruals_type.htm&type=5&language=en_US",
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
      docs: ["Data Cloud One connects a primary Salesforce org to a companion org, enabling cross-org DMO data visibility through shared data spaces without requiring a separate Data Cloud instance for each org. This capability is particularly valuable for Consumer Goods Cloud deployments that span multiple Salesforce orgs, such as organizations with separate orgs for different regions or business units. The feature eliminates the need for custom data replication or integration development between orgs that need to share analytical data.", "The setup involves configuring a data sharing relationship between the primary org (which has Data Cloud enabled) and the companion org. Once connected, DMO data from the primary org becomes visible in the companion org's data space, enabling analytics and reporting across organizational boundaries. The shared data follows Data Cloud's security and access control model, ensuring that users in the companion org only see data they are authorized to access.", "Organizations use Data Cloud One when they need unified analytics across multiple CG Cloud deployments. For example, a global manufacturer with separate Salesforce orgs for North America and Europe can share promotional performance data through Data Cloud One, enabling global analytics without data replication or custom integration development. The companion org can run analytics on the shared data, create cross-regional segments, and generate consolidated reports."],
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
