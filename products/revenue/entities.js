// ══════════════════════════════════════════════════════════════
//  Revenue Cloud Entities — Standard objects & custom metadata
//  Revenue Cloud is a native Salesforce product (no managed packages)
// ══════════════════════════════════════════════════════════════

export default {

  "catalog": {
    "objects": [
      {
        "name": "Product2",
        "type": "standard",
        "domain": "catalog",
        "description": "The core product record that represents anything your organization sells or offers. Each product holds descriptive information like name, code, and family grouping, along with inventory attributes such as stock-keeping unit and quantity unit of measure. Products must be linked to a price book through price book entries before they can appear on quotes or orders.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name shown to sales reps and customers" },
          { "name": "ProductCode", "type": "Text", "description": "Unique code that identifies this product across systems" },
          { "name": "Description", "type": "TextArea", "description": "Detailed description of the product for internal and external use" },
          { "name": "IsActive", "type": "Boolean", "description": "Controls whether the product can be added to new quotes and orders" },
          { "name": "Family", "type": "Picklist", "description": "Logical grouping such as hardware, software, or services" },
          { "name": "QuantityUnitOfMeasure", "type": "Picklist", "description": "Unit used when measuring quantity, such as each, license, or hour" },
          { "name": "StockKeepingUnit", "type": "Text", "description": "Inventory tracking identifier used by warehouse or fulfillment systems" }
        ],
        "relationships": [
          { "target": "PricebookEntry", "type": "parent", "description": "Products are listed in price books through price book entry records" },
          { "target": "ProductCategory", "type": "lookup", "description": "Products can be assigned to categories within a product catalog" }
        ]
      },
      {
        "name": "ProductCatalog",
        "type": "standard",
        "domain": "catalog",
        "description": "A top-level container that organizes products into a browsable hierarchy. Catalogs group categories and their associated products, enabling sales teams and self-service portals to present curated collections of offerings. An organization can maintain multiple catalogs for different channels, regions, or customer segments.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name for this catalog" },
          { "name": "Description", "type": "TextArea", "description": "Purpose or scope of this catalog" },
          { "name": "IsActive", "type": "Boolean", "description": "Whether this catalog is available for use" },
          { "name": "ExternalReference", "type": "Text", "description": "Identifier used to link this catalog to external commerce systems" }
        ],
        "relationships": [
          { "target": "ProductCategory", "type": "parent", "description": "A catalog contains one or more product categories" }
        ]
      },
      {
        "name": "ProductCategory",
        "type": "standard",
        "domain": "catalog",
        "description": "A grouping within a catalog that organizes products into logical sections such as subscriptions, add-ons, or hardware. Categories can be nested to create a multi-level browsing hierarchy. Each category belongs to exactly one catalog and can contain many products.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Category label shown in the catalog hierarchy" },
          { "name": "Description", "type": "TextArea", "description": "Explanation of what this category contains" },
          { "name": "CatalogId", "type": "Lookup", "description": "The catalog this category belongs to" },
          { "name": "ParentCategoryId", "type": "Lookup", "description": "Parent category for building nested hierarchies" },
          { "name": "SortOrder", "type": "Number", "description": "Display order within the parent category or catalog" }
        ],
        "relationships": [
          { "target": "ProductCatalog", "type": "child", "description": "Each category belongs to a single catalog" },
          { "target": "Product2", "type": "parent", "description": "Categories contain products assigned to them" }
        ]
      },
      {
        "name": "ProductAttribute",
        "type": "standard",
        "domain": "catalog",
        "description": "Defines a configurable characteristic of a product, such as color, size, storage capacity, or license tier. Attributes are grouped into attribute sets and attached to products so that sales reps or customers can select specific values during the configuration process. Each attribute specifies its data type and available values.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Human-readable name for this attribute" },
          { "name": "DataType", "type": "Picklist", "description": "The data type of attribute values, such as text, number, or picklist" },
          { "name": "DefaultValue", "type": "Text", "description": "Pre-selected value when no explicit choice is made" },
          { "name": "Sequence", "type": "Number", "description": "Display order of this attribute within its attribute set" },
          { "name": "ProductAttributeSetId", "type": "Lookup", "description": "The attribute set this attribute belongs to" }
        ],
        "relationships": [
          { "target": "ProductAttributeSet", "type": "child", "description": "Each attribute belongs to an attribute set" },
          { "target": "Product2", "type": "lookup", "description": "Attributes are associated with the products they describe" }
        ]
      },
      {
        "name": "ProductAttributeSet",
        "type": "standard",
        "domain": "catalog",
        "description": "A named collection of product attributes that can be assigned to one or more products. Attribute sets allow administrators to define a reusable group of configurable characteristics, such as a set of sizing options or a set of licensing parameters, and apply them consistently across similar products.",
        "fields": [
          { "name": "DeveloperName", "type": "Text", "description": "Unique API name used to reference this attribute set in configuration rules" },
          { "name": "MasterLabel", "type": "Text", "description": "Display label for this attribute set" },
          { "name": "Description", "type": "TextArea", "description": "Explanation of when and how to use this attribute set" }
        ],
        "relationships": [
          { "target": "ProductAttribute", "type": "parent", "description": "An attribute set contains one or more attributes" },
          { "target": "Product2", "type": "lookup", "description": "Attribute sets are assigned to the products they configure" }
        ]
      },
      {
        "name": "ProductRelatedComponent",
        "type": "standard",
        "domain": "catalog",
        "description": "Represents a child product within a product bundle or composite offering. Each related component links a parent product to a child product and specifies quantity, whether the component is optional, and how it contributes to the overall bundle price. This structure enables complex multi-product offerings like a software suite with required and optional add-ons.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name for this component within the bundle" },
          { "name": "ParentProductId", "type": "Lookup", "description": "The parent bundle product that contains this component" },
          { "name": "ChildProductId", "type": "Lookup", "description": "The product that serves as a component of the bundle" },
          { "name": "Quantity", "type": "Number", "description": "Default quantity of this component included in the bundle" },
          { "name": "IsOptional", "type": "Boolean", "description": "Whether the buyer can choose to include or exclude this component" },
          { "name": "IsQuantityEditable", "type": "Boolean", "description": "Whether the buyer can change the default quantity" }
        ],
        "relationships": [
          { "target": "Product2", "type": "child", "description": "Links to the parent bundle product" },
          { "target": "ProductComponentGroup", "type": "child", "description": "Components are organized into groups within the bundle" }
        ]
      },
      {
        "name": "ProductComponentGroup",
        "type": "standard",
        "domain": "catalog",
        "description": "Organizes related components within a product bundle into named groups. For example, a laptop bundle might have groups for processor options, memory options, and storage options. Each group defines constraints such as minimum and maximum selections, controlling how buyers configure the bundle.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Group label displayed during product configuration" },
          { "name": "ProductId", "type": "Lookup", "description": "The bundle product this group belongs to" },
          { "name": "MinQuantity", "type": "Number", "description": "Minimum number of selections a buyer must make from this group" },
          { "name": "MaxQuantity", "type": "Number", "description": "Maximum number of selections allowed from this group" },
          { "name": "Sequence", "type": "Number", "description": "Display order of this group within the bundle configuration" }
        ],
        "relationships": [
          { "target": "Product2", "type": "child", "description": "Each group belongs to one bundle product" },
          { "target": "ProductRelatedComponent", "type": "parent", "description": "A group contains one or more component options" }
        ]
      }
    ]
  },

  "pricing": {
    "objects": [
      {
        "name": "Pricebook2",
        "type": "standard",
        "domain": "pricing",
        "description": "A named collection of prices for products. Every organization has a standard price book that serves as the master list of products and their default prices. Additional custom price books can be created for different channels, regions, currencies, or customer tiers. Each quote and order references a price book to determine which prices apply to that transaction.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name for this price book" },
          { "name": "Description", "type": "TextArea", "description": "Explanation of when to use this price book, such as region or channel" },
          { "name": "IsActive", "type": "Boolean", "description": "Whether this price book can be assigned to new transactions" },
          { "name": "IsStandard", "type": "Boolean", "description": "System flag indicating this is the organization's default price book" }
        ],
        "relationships": [
          { "target": "PricebookEntry", "type": "parent", "description": "A price book contains price entries for each product it lists" },
          { "target": "Quote", "type": "parent", "description": "Quotes reference a price book for line item pricing" },
          { "target": "Order", "type": "parent", "description": "Orders reference a price book for their line item pricing" }
        ]
      },
      {
        "name": "PricebookEntry",
        "type": "standard",
        "domain": "pricing",
        "description": "A single price record that connects a product to a price book at a specific unit price. Every product must have an entry in the standard price book before it can be added to any custom price book. Price book entries support multi-currency pricing when the organization has multiple currencies enabled. Active entries can be used on new transactions; inactive entries are retained for historical records.",
        "fields": [
          { "name": "UnitPrice", "type": "Currency", "description": "The price per unit for this product in this price book" },
          { "name": "UseStandardPrice", "type": "Boolean", "description": "If true, this entry inherits the price from the standard price book" },
          { "name": "IsActive", "type": "Boolean", "description": "Whether this price entry is available for use on new line items" },
          { "name": "Product2Id", "type": "Lookup", "description": "The product this price entry is for" },
          { "name": "Pricebook2Id", "type": "Lookup", "description": "The price book this entry belongs to" },
          { "name": "CurrencyIsoCode", "type": "Text", "description": "ISO currency code when multi-currency is enabled" }
        ],
        "relationships": [
          { "target": "Product2", "type": "child", "description": "Each entry represents one product's price" },
          { "target": "Pricebook2", "type": "child", "description": "Each entry belongs to one price book" }
        ]
      },
      {
        "name": "PriceAdjustmentSchedule",
        "type": "standard",
        "domain": "pricing",
        "description": "Defines a schedule of price adjustments that can be applied to products, such as volume discounts, promotional pricing, or tiered pricing structures. Each schedule contains one or more tiers that specify the adjustment amount or percentage at different quantity or revenue thresholds. Schedules can be reused across multiple products.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Descriptive name for this adjustment schedule" },
          { "name": "Description", "type": "TextArea", "description": "Explanation of the pricing strategy this schedule implements" },
          { "name": "AdjustmentType", "type": "Picklist", "description": "Whether the adjustment is a discount, surcharge, or override" },
          { "name": "AdjustmentMethod", "type": "Picklist", "description": "Whether the adjustment is a percentage or a fixed amount" },
          { "name": "PriceAdjustmentScheduleId", "type": "Lookup", "description": "Self-reference for chaining multiple adjustment schedules" }
        ],
        "relationships": [
          { "target": "PriceAdjustmentTier", "type": "parent", "description": "A schedule contains one or more tiers defining the adjustment at each level" },
          { "target": "Product2", "type": "lookup", "description": "Schedules can be attached to specific products" }
        ]
      },
      {
        "name": "PriceAdjustmentTier",
        "type": "standard",
        "domain": "pricing",
        "description": "A single tier within a price adjustment schedule that defines the adjustment amount or percentage at a specific threshold. For example, a volume discount schedule might have tiers at 10 units (5% off), 50 units (10% off), and 100 units (15% off). Tiers are evaluated in order based on the quantity or value of the transaction.",
        "fields": [
          { "name": "LowerBound", "type": "Number", "description": "Minimum quantity or value threshold where this tier begins" },
          { "name": "UpperBound", "type": "Number", "description": "Maximum quantity or value threshold where this tier ends" },
          { "name": "AdjustmentValue", "type": "Number", "description": "The discount or surcharge amount applied at this tier" },
          { "name": "TierType", "type": "Picklist", "description": "Whether this tier is based on quantity, revenue, or another metric" },
          { "name": "PriceAdjustmentScheduleId", "type": "Lookup", "description": "The schedule this tier belongs to" },
          { "name": "Sequence", "type": "Number", "description": "Evaluation order of this tier within the schedule" }
        ],
        "relationships": [
          { "target": "PriceAdjustmentSchedule", "type": "child", "description": "Each tier belongs to one adjustment schedule" }
        ]
      }
    ]
  },

  "rates": {
    "objects": [
      {
        "name": "RateCard",
        "type": "standard",
        "domain": "rates",
        "description": "A configurable pricing table that maps combinations of attributes to specific rates. Rate cards are used for complex pricing scenarios where the price depends on multiple factors, such as usage type, region, and service tier. Each rate card contains rows with attribute combinations and their corresponding rate values, enabling dynamic price calculation at transaction time.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Descriptive name for this rate card" },
          { "name": "Description", "type": "TextArea", "description": "Explanation of the pricing scenario this rate card addresses" },
          { "name": "Status", "type": "Picklist", "description": "Whether this rate card is draft, active, or retired" },
          { "name": "EffectiveDate", "type": "Date", "description": "Date from which this rate card's prices are applicable" },
          { "name": "ExpirationDate", "type": "Date", "description": "Date after which this rate card is no longer valid" }
        ],
        "relationships": [
          { "target": "Product2", "type": "lookup", "description": "Rate cards can be associated with specific products" },
          { "target": "PricebookEntry", "type": "lookup", "description": "Rate card values can override standard price book pricing" }
        ]
      },
      {
        "name": "RatingProcedure",
        "type": "standard",
        "domain": "rates",
        "description": "Defines the sequence of steps used to calculate a final price from usage or consumption data. A rating procedure processes incoming usage records through a series of evaluation steps that look up rates, apply adjustments, and produce rated output. This is the engine behind metered and consumption-based pricing models where the final charge depends on what was actually used.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Name identifying this rating procedure" },
          { "name": "Description", "type": "TextArea", "description": "Explanation of the pricing calculation this procedure performs" },
          { "name": "Status", "type": "Picklist", "description": "Current lifecycle state of this procedure" },
          { "name": "ProcessingOrder", "type": "Number", "description": "Sequence in which this procedure runs relative to others" }
        ],
        "relationships": [
          { "target": "RateCard", "type": "lookup", "description": "Rating procedures reference rate cards for price lookups" }
        ]
      }
    ]
  },

  "configurator": {
    "objects": [
      {
        "name": "ProductConfigurationRule",
        "type": "standard",
        "domain": "configurator",
        "description": "A rule that controls how products can be configured together in a bundle or transaction. Configuration rules enforce business logic such as requiring certain components when others are selected, preventing incompatible combinations, or automatically adding dependent products. Rules are evaluated during the configuration process to guide buyers toward valid product configurations.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Descriptive name explaining what this rule enforces" },
          { "name": "RuleType", "type": "Picklist", "description": "The type of constraint, such as inclusion, exclusion, or validation" },
          { "name": "SourceProductId", "type": "Lookup", "description": "The product selection that triggers this rule" },
          { "name": "TargetProductId", "type": "Lookup", "description": "The product affected by this rule" },
          { "name": "IsActive", "type": "Boolean", "description": "Whether this rule is currently enforced" },
          { "name": "ErrorMessage", "type": "TextArea", "description": "Message shown when a configuration violates this rule" }
        ],
        "relationships": [
          { "target": "Product2", "type": "lookup", "description": "Rules reference source and target products" },
          { "target": "ProductComponentGroup", "type": "lookup", "description": "Rules can apply to specific component groups within a bundle" }
        ]
      },
      {
        "name": "ProductBundle",
        "type": "standard",
        "domain": "configurator",
        "description": "Represents a composite product offering that combines multiple individual products into a single sellable package. Bundles define the structure of what a buyer can configure, including which components are required and which are optional. The configurator interface presents the bundle structure and guides the buyer through selecting options within each component group.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name for this bundle offering" },
          { "name": "ProductId", "type": "Lookup", "description": "The parent product record this bundle represents" },
          { "name": "BundleType", "type": "Picklist", "description": "Whether this is a static bundle, dynamic bundle, or kit" },
          { "name": "IsConfigurable", "type": "Boolean", "description": "Whether buyers can modify component selections" },
          { "name": "Status", "type": "Picklist", "description": "Lifecycle state of this bundle definition" }
        ],
        "relationships": [
          { "target": "Product2", "type": "child", "description": "Each bundle is based on a parent product record" },
          { "target": "ProductRelatedComponent", "type": "parent", "description": "Bundles contain components that make up the offering" },
          { "target": "ProductComponentGroup", "type": "parent", "description": "Bundle components are organized into selectable groups" }
        ]
      },
      {
        "name": "ConfigurationAttribute",
        "type": "standard",
        "domain": "configurator",
        "description": "Stores the specific attribute value selected during product configuration. When a buyer configures a product and chooses options like storage size, color, or license tier, each selection is captured as a configuration attribute. These records preserve the buyer's choices and flow through to the quote or order line item for fulfillment.",
        "fields": [
          { "name": "AttributeName", "type": "Text", "description": "Name of the attribute being configured" },
          { "name": "AttributeValue", "type": "Text", "description": "The value selected by the buyer for this attribute" },
          { "name": "ProductId", "type": "Lookup", "description": "The product being configured" },
          { "name": "QuoteLineItemId", "type": "Lookup", "description": "The quote line item this configuration applies to" },
          { "name": "Sequence", "type": "Number", "description": "Display order of this attribute in the configuration view" }
        ],
        "relationships": [
          { "target": "Product2", "type": "child", "description": "Configuration attributes reference the product being configured" },
          { "target": "QuoteLineItem", "type": "child", "description": "Selected configurations are stored against quote line items" }
        ]
      }
    ]
  },

  "transactions": {
    "objects": [
      {
        "name": "Quote",
        "type": "standard",
        "domain": "transactions",
        "description": "A formal proposal presented to a customer that itemizes products, quantities, and prices. Quotes capture the terms of a potential deal and can be synced to the parent opportunity for pipeline tracking. Multiple quotes can exist per opportunity, but only one can be the synced quote at a time. Quotes can be converted to orders once the customer accepts the proposal.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Name or number identifying this quote" },
          { "name": "Status", "type": "Picklist", "description": "Current stage such as draft, presented, or accepted" },
          { "name": "ExpirationDate", "type": "Date", "description": "Date after which this quote is no longer valid" },
          { "name": "GrandTotal", "type": "Currency", "description": "Total amount including all line items, taxes, and adjustments" },
          { "name": "TotalPrice", "type": "Currency", "description": "Sum of all line item prices before adjustments" },
          { "name": "AccountId", "type": "Lookup", "description": "The customer account this quote is for" },
          { "name": "OpportunityId", "type": "Lookup", "description": "The opportunity this quote is associated with" },
          { "name": "ContactId", "type": "Lookup", "description": "The primary contact at the customer for this quote" }
        ],
        "relationships": [
          { "target": "QuoteLineItem", "type": "parent", "description": "A quote contains one or more line items detailing products and prices" },
          { "target": "Order", "type": "parent", "description": "An accepted quote can be converted into an order" },
          { "target": "Opportunity", "type": "child", "description": "Each quote is linked to an opportunity for pipeline tracking" }
        ]
      },
      {
        "name": "QuoteLineItem",
        "type": "standard",
        "domain": "transactions",
        "description": "A single line on a quote representing a product, its quantity, and its price. Line items pull pricing from the quote's price book and can have adjustments applied through price adjustment schedules. Each line item tracks both the list price and the net price after any discounts or surcharges have been applied.",
        "fields": [
          { "name": "Product2Id", "type": "Lookup", "description": "The product being quoted on this line" },
          { "name": "Quantity", "type": "Number", "description": "Number of units being quoted" },
          { "name": "UnitPrice", "type": "Currency", "description": "Price per unit after any adjustments" },
          { "name": "ListPrice", "type": "Currency", "description": "Original price per unit from the price book" },
          { "name": "TotalPrice", "type": "Currency", "description": "Extended price calculated as quantity times unit price" },
          { "name": "Discount", "type": "Percent", "description": "Percentage discount applied to this line item" }
        ],
        "relationships": [
          { "target": "Quote", "type": "child", "description": "Each line item belongs to one quote" },
          { "target": "Product2", "type": "lookup", "description": "References the product being quoted" },
          { "target": "PricebookEntry", "type": "lookup", "description": "Price is derived from the price book entry" }
        ]
      },
      {
        "name": "Order",
        "type": "standard",
        "domain": "transactions",
        "description": "A confirmed customer transaction that commits the organization to deliver products or services. Orders are typically created from accepted quotes and represent the contractual agreement between buyer and seller. Once activated, an order flows into fulfillment and billing processes. Orders track the full financial picture including total amount, status, and effective dates.",
        "fields": [
          { "name": "OrderNumber", "type": "Text", "description": "System-generated unique identifier for this order" },
          { "name": "Status", "type": "Picklist", "description": "Current state such as draft, activated, or completed" },
          { "name": "EffectiveDate", "type": "Date", "description": "Date when this order takes effect" },
          { "name": "EndDate", "type": "Date", "description": "Date when this order's term concludes" },
          { "name": "TotalAmount", "type": "Currency", "description": "Total monetary value of all order items" },
          { "name": "AccountId", "type": "Lookup", "description": "The customer account this order is placed for" },
          { "name": "ContractId", "type": "Lookup", "description": "The contract governing this order's terms" },
          { "name": "Pricebook2Id", "type": "Lookup", "description": "The price book used for pricing order items" }
        ],
        "relationships": [
          { "target": "OrderItem", "type": "parent", "description": "An order contains one or more order items" },
          { "target": "FulfillmentOrder", "type": "parent", "description": "Orders are fulfilled through fulfillment order records" },
          { "target": "Contract", "type": "child", "description": "Orders can be governed by a master contract" },
          { "target": "Quote", "type": "child", "description": "Orders can originate from an accepted quote" }
        ]
      },
      {
        "name": "OrderItem",
        "type": "standard",
        "domain": "transactions",
        "description": "A single product line on an order specifying what is being purchased, the quantity, and the agreed price. Order items drive downstream processes including fulfillment, billing schedule creation, and revenue recognition. Each item references the product and price book entry that determine its pricing.",
        "fields": [
          { "name": "Product2Id", "type": "Lookup", "description": "The product being ordered" },
          { "name": "Quantity", "type": "Number", "description": "Number of units ordered" },
          { "name": "UnitPrice", "type": "Currency", "description": "Price per unit for this order line" },
          { "name": "TotalPrice", "type": "Currency", "description": "Extended price calculated as quantity times unit price" },
          { "name": "ServiceDate", "type": "Date", "description": "Date when service or delivery begins for this line item" },
          { "name": "EndDate", "type": "Date", "description": "Date when service or delivery ends for this line item" }
        ],
        "relationships": [
          { "target": "Order", "type": "child", "description": "Each order item belongs to one order" },
          { "target": "Product2", "type": "lookup", "description": "References the product being purchased" },
          { "target": "BillingSchedule", "type": "parent", "description": "Order items can generate billing schedules for recurring charges" }
        ]
      },
      {
        "name": "Contract",
        "type": "standard",
        "domain": "transactions",
        "description": "A legal agreement between the organization and a customer that governs the terms of one or more orders. Contracts define the overall relationship including start date, end date, renewal terms, and payment terms. Amendment and renewal orders reference the contract to maintain a continuous commercial relationship across multiple transaction cycles.",
        "fields": [
          { "name": "ContractNumber", "type": "Text", "description": "System-generated unique identifier for this contract" },
          { "name": "Status", "type": "Picklist", "description": "Current stage such as draft, activated, or expired" },
          { "name": "StartDate", "type": "Date", "description": "Date when the contract term begins" },
          { "name": "EndDate", "type": "Date", "description": "Date when the contract term expires" },
          { "name": "ContractTerm", "type": "Number", "description": "Duration of the contract in months" },
          { "name": "AccountId", "type": "Lookup", "description": "The customer account this contract is with" }
        ],
        "relationships": [
          { "target": "Order", "type": "parent", "description": "A contract can govern multiple orders over its term" },
          { "target": "Account", "type": "child", "description": "Each contract belongs to a customer account" }
        ]
      },
      {
        "name": "OpportunityLineItem",
        "type": "standard",
        "domain": "transactions",
        "description": "A product line item on an opportunity that tracks what is being proposed before a formal quote is created. Opportunity line items feed into the opportunity amount and contribute to pipeline reporting. They serve as the earliest record of product interest in the sales cycle and can be carried forward into quotes and orders.",
        "fields": [
          { "name": "Product2Id", "type": "Lookup", "description": "The product associated with this opportunity line" },
          { "name": "Quantity", "type": "Number", "description": "Number of units the customer is interested in" },
          { "name": "UnitPrice", "type": "Currency", "description": "Proposed price per unit" },
          { "name": "TotalPrice", "type": "Currency", "description": "Extended price for this line item" },
          { "name": "ServiceDate", "type": "Date", "description": "Expected start date for this product or service" },
          { "name": "Description", "type": "TextArea", "description": "Notes about this line item" }
        ],
        "relationships": [
          { "target": "Opportunity", "type": "child", "description": "Each line item belongs to one opportunity" },
          { "target": "Product2", "type": "lookup", "description": "References the product being proposed" },
          { "target": "PricebookEntry", "type": "lookup", "description": "Pricing comes from the opportunity's price book" }
        ]
      }
    ]
  },

  "procedures": {
    "objects": [
      {
        "name": "ExpressionSet",
        "type": "standard",
        "domain": "procedures",
        "description": "A reusable calculation engine that evaluates business logic through a series of steps, conditions, and mathematical expressions. Expression sets power dynamic pricing, eligibility checks, discount calculations, and other decision-making processes throughout the revenue lifecycle. They can reference data from the current transaction, related records, or external sources to produce computed results.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Identifying name for this expression set" },
          { "name": "Description", "type": "TextArea", "description": "Explanation of the business logic this expression set implements" },
          { "name": "Status", "type": "Picklist", "description": "Whether this expression set is draft, active, or deprecated" },
          { "name": "ApiName", "type": "Text", "description": "Unique programmatic name used to invoke this expression set" },
          { "name": "UsageType", "type": "Picklist", "description": "Context where this expression set is used, such as pricing or qualification" }
        ],
        "relationships": [
          { "target": "DecisionTable", "type": "lookup", "description": "Expression sets can reference decision tables for lookup-based logic" }
        ]
      },
      {
        "name": "DecisionTable",
        "type": "standard",
        "domain": "procedures",
        "description": "A table-driven rules engine that maps input conditions to output values. Decision tables provide a spreadsheet-like interface for administrators to define business rules without code. Each row represents a rule with input conditions and output values. The engine evaluates input data against the table rows and returns the matching output. Used for tax determination, discount qualification, territory assignment, and other rule-based decisions.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Identifying name for this decision table" },
          { "name": "Description", "type": "TextArea", "description": "Explanation of the business rules encoded in this table" },
          { "name": "Status", "type": "Picklist", "description": "Whether this table is draft, active, or retired" },
          { "name": "CollectOperator", "type": "Picklist", "description": "How multiple matching rows are resolved, such as first match or collect all" },
          { "name": "SourceObject", "type": "Text", "description": "The object whose data is evaluated against this table's conditions" }
        ],
        "relationships": [
          { "target": "ExpressionSet", "type": "lookup", "description": "Decision tables can be called from expression sets" },
          { "target": "ContextDefinition", "type": "lookup", "description": "Decision tables use context definitions to access input data" }
        ]
      },
      {
        "name": "ContextDefinition",
        "type": "standard",
        "domain": "procedures",
        "description": "Defines the data model available to expression sets, decision tables, and other procedure components during evaluation. A context definition specifies which objects, fields, and relationships are accessible, acting as a contract between the data layer and the business logic layer. This allows procedures to be written against a stable interface even as the underlying data model evolves.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Identifying name for this context definition" },
          { "name": "Description", "type": "TextArea", "description": "Explanation of the data this context makes available" },
          { "name": "Status", "type": "Picklist", "description": "Whether this context definition is draft or active" },
          { "name": "RootEntity", "type": "Text", "description": "The primary object this context is built around" }
        ],
        "relationships": [
          { "target": "DecisionTable", "type": "parent", "description": "Context definitions supply data to decision tables" },
          { "target": "ExpressionSet", "type": "parent", "description": "Context definitions supply data to expression sets" }
        ]
      },
      {
        "name": "BatchProcessJob",
        "type": "standard",
        "domain": "procedures",
        "description": "Represents a scheduled or on-demand batch operation that processes large volumes of records through Revenue Cloud procedures. Batch jobs handle operations like mass price updates, bulk billing schedule generation, periodic usage rating, and end-of-period financial calculations. Each job tracks its execution status, record counts, and any errors encountered during processing.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Identifying name for this batch job" },
          { "name": "JobType", "type": "Picklist", "description": "The type of batch operation, such as billing, rating, or pricing" },
          { "name": "Status", "type": "Picklist", "description": "Current execution state such as queued, processing, completed, or failed" },
          { "name": "TotalRecords", "type": "Number", "description": "Total number of records to be processed" },
          { "name": "ProcessedRecords", "type": "Number", "description": "Number of records successfully processed so far" },
          { "name": "ScheduledDate", "type": "DateTime", "description": "When this batch job is scheduled to run" }
        ],
        "relationships": [
          { "target": "ExpressionSet", "type": "lookup", "description": "Batch jobs can execute expression sets against each record" }
        ]
      }
    ]
  },

  "approvals": {
    "objects": [
      {
        "name": "ProcessInstance",
        "type": "standard",
        "domain": "approvals",
        "description": "Represents a single run of an approval process for a specific record. When a quote, order, or discount requires approval, the system creates a process instance that tracks the overall status and links to the individual approval steps. Administrators define approval processes in Setup to route requests through one or more levels of management review before a transaction can proceed.",
        "fields": [
          { "name": "TargetObjectId", "type": "Lookup", "description": "The record being submitted for approval, such as a quote or order" },
          { "name": "Status", "type": "Picklist", "description": "Overall approval status: pending, approved, rejected, or recalled" },
          { "name": "SubmittedById", "type": "Lookup", "description": "The user who submitted the record for approval" },
          { "name": "CompletedDate", "type": "DateTime", "description": "When the approval process reached a final decision" },
          { "name": "ProcessDefinitionId", "type": "Lookup", "description": "The approval process definition being executed" }
        ],
        "relationships": [
          { "target": "ProcessInstanceStep", "type": "parent", "description": "Each approval instance contains one or more approval steps" },
          { "target": "Quote", "type": "lookup", "description": "Approval processes are commonly applied to quotes requiring management review" },
          { "target": "Order", "type": "lookup", "description": "Orders above certain thresholds may require approval before activation" }
        ]
      },
      {
        "name": "ProcessInstanceStep",
        "type": "standard",
        "domain": "approvals",
        "description": "A single step within an approval process instance, representing one level of review. Each step records who was assigned as the approver, their decision, and any comments they provided. Multi-level approval processes create multiple steps that must be completed in sequence, with each approver either advancing the request to the next level or rejecting it back to the submitter.",
        "fields": [
          { "name": "StepStatus", "type": "Picklist", "description": "Decision at this step: pending, approved, rejected, or reassigned" },
          { "name": "ActorId", "type": "Lookup", "description": "The user or queue assigned to make the decision at this step" },
          { "name": "OriginalActorId", "type": "Lookup", "description": "The originally assigned approver before any reassignment" },
          { "name": "Comments", "type": "TextArea", "description": "Comments provided by the approver explaining their decision" },
          { "name": "CreatedDate", "type": "DateTime", "description": "When this approval step was created" }
        ],
        "relationships": [
          { "target": "ProcessInstance", "type": "child", "description": "Each step belongs to one approval process instance" }
        ]
      },
      {
        "name": "ProcessInstanceWorkitem",
        "type": "standard",
        "domain": "approvals",
        "description": "Represents a pending action item in a user's approval queue. When an approval step is waiting for a decision, the system creates a workitem assigned to the designated approver. The workitem appears in the approver's home page and can be approved, rejected, or reassigned. Once the approver takes action, the workitem is completed and the process moves to the next step or reaches a final decision.",
        "fields": [
          { "name": "ActorId", "type": "Lookup", "description": "The user or queue this workitem is assigned to" },
          { "name": "ProcessInstanceId", "type": "Lookup", "description": "The approval process instance this workitem belongs to" },
          { "name": "OriginalActorId", "type": "Lookup", "description": "The originally assigned actor before any delegation or reassignment" },
          { "name": "CreatedDate", "type": "DateTime", "description": "When this workitem was assigned to the approver" }
        ],
        "relationships": [
          { "target": "ProcessInstance", "type": "child", "description": "Each workitem is part of one approval process instance" }
        ]
      }
    ]
  },

  "orchestrator": {
    "objects": [
      {
        "name": "FulfillmentOrder",
        "type": "standard",
        "domain": "orchestrator",
        "description": "Represents a group of products or services that need to be delivered together as part of an order. Fulfillment orders break down a customer's order into actionable units for the operations team, separating items that ship physically from items that are provisioned digitally. Each fulfillment order tracks its own status, enabling partial fulfillment when some items are ready before others.",
        "fields": [
          { "name": "FulfillmentOrderNumber", "type": "Text", "description": "System-generated unique number for this fulfillment order" },
          { "name": "Status", "type": "Picklist", "description": "Fulfillment state such as allocated, fulfilled, or cancelled" },
          { "name": "AccountId", "type": "Lookup", "description": "The customer account this fulfillment is for" },
          { "name": "OrderId", "type": "Lookup", "description": "The source order being fulfilled" },
          { "name": "FulfilledToName", "type": "Text", "description": "Name of the recipient for physical deliveries" },
          { "name": "Type", "type": "Picklist", "description": "Whether this is a physical shipment, digital provisioning, or service activation" }
        ],
        "relationships": [
          { "target": "FulfillmentOrderLineItem", "type": "parent", "description": "A fulfillment order contains line items specifying what is being fulfilled" },
          { "target": "Order", "type": "child", "description": "Each fulfillment order originates from a customer order" }
        ]
      },
      {
        "name": "FulfillmentOrderLineItem",
        "type": "standard",
        "domain": "orchestrator",
        "description": "A single item within a fulfillment order specifying the product, quantity, and fulfillment details. Each line item maps back to an order item and tracks how much of the ordered quantity is being fulfilled in this batch. Line items carry the pricing information needed for invoicing and revenue recognition upon fulfillment completion.",
        "fields": [
          { "name": "Product2Id", "type": "Lookup", "description": "The product being fulfilled" },
          { "name": "Quantity", "type": "Number", "description": "Number of units included in this fulfillment" },
          { "name": "OrderItemId", "type": "Lookup", "description": "The source order item this line fulfills" },
          { "name": "TotalPrice", "type": "Currency", "description": "Financial value of the fulfilled quantity" },
          { "name": "Type", "type": "Picklist", "description": "Fulfillment type such as ship, deliver, or transfer" }
        ],
        "relationships": [
          { "target": "FulfillmentOrder", "type": "child", "description": "Each line item belongs to one fulfillment order" },
          { "target": "OrderItem", "type": "child", "description": "Maps back to the order item being fulfilled" }
        ]
      },
      {
        "name": "OrderDeliveryGroup",
        "type": "standard",
        "domain": "orchestrator",
        "description": "Groups order items that share the same delivery method and destination. When a customer orders products that ship to different addresses or through different channels, each distinct combination of destination and method becomes a separate delivery group. This enables the orchestration engine to plan and track deliveries independently for each group.",
        "fields": [
          { "name": "OrderId", "type": "Lookup", "description": "The order this delivery group belongs to" },
          { "name": "DeliverToName", "type": "Text", "description": "Recipient name for this delivery group" },
          { "name": "DeliverToStreet", "type": "Text", "description": "Delivery street address" },
          { "name": "DeliverToCity", "type": "Text", "description": "Delivery city" },
          { "name": "DeliveryMethod", "type": "Picklist", "description": "How items in this group are delivered, such as standard shipping or digital" }
        ],
        "relationships": [
          { "target": "Order", "type": "child", "description": "Each delivery group is part of one order" },
          { "target": "FulfillmentOrder", "type": "parent", "description": "Fulfillment orders are created per delivery group" }
        ]
      },
      {
        "name": "OrderAction",
        "type": "standard",
        "domain": "orchestrator",
        "description": "Records a business action performed on an order, such as a new sale, amendment, renewal, or cancellation. Order actions provide an audit trail of every change to an order throughout its lifecycle. Each action captures what changed, when it changed, and the net effect on the order's financial totals. This history is essential for revenue recognition and contract compliance.",
        "fields": [
          { "name": "Type", "type": "Picklist", "description": "The kind of action: new sale, amendment, renewal, suspension, or cancellation" },
          { "name": "OrderId", "type": "Lookup", "description": "The order this action was performed on" },
          { "name": "EffectiveDate", "type": "Date", "description": "Date when this action takes effect" },
          { "name": "StatusCode", "type": "Picklist", "description": "Processing status of this action" }
        ],
        "relationships": [
          { "target": "Order", "type": "child", "description": "Each action references the order it modifies" },
          { "target": "OrderItemAction", "type": "parent", "description": "An order action contains item-level actions detailing what changed" }
        ]
      },
      {
        "name": "AssetAction",
        "type": "standard",
        "domain": "orchestrator",
        "description": "Tracks lifecycle changes to a customer asset that result from order processing. When an order is fulfilled, asset actions record the creation, modification, or retirement of customer assets. This creates a complete history of how each customer's entitlements and owned products have changed over time, supporting accurate renewal and upsell processes.",
        "fields": [
          { "name": "AssetId", "type": "Lookup", "description": "The customer asset affected by this action" },
          { "name": "Type", "type": "Picklist", "description": "The type of change: create, upgrade, downgrade, renew, or cancel" },
          { "name": "Amount", "type": "Currency", "description": "Financial impact of this asset change" },
          { "name": "ActionDate", "type": "Date", "description": "Date when this asset change takes effect" },
          { "name": "Quantity", "type": "Number", "description": "Change in quantity, positive for additions and negative for removals" }
        ],
        "relationships": [
          { "target": "Asset", "type": "child", "description": "Each action references the asset being changed" },
          { "target": "AssetStatePeriod", "type": "parent", "description": "Asset actions generate state periods reflecting the new asset state" }
        ]
      },
      {
        "name": "AssetStatePeriod",
        "type": "standard",
        "domain": "orchestrator",
        "description": "Represents a time period during which a customer asset has a specific state, such as a particular quantity, monthly recurring revenue, or entitlement level. State periods form a timeline of the asset's financial value, enabling accurate revenue recognition, renewal calculations, and customer lifetime value analysis. Each period has a start and end date and captures the asset's monetary value during that window.",
        "fields": [
          { "name": "AssetId", "type": "Lookup", "description": "The asset this state period describes" },
          { "name": "StartDate", "type": "Date", "description": "Beginning of this state period" },
          { "name": "EndDate", "type": "Date", "description": "End of this state period" },
          { "name": "Amount", "type": "Currency", "description": "Total financial value during this period" },
          { "name": "Mrr", "type": "Currency", "description": "Monthly recurring revenue during this period" },
          { "name": "Quantity", "type": "Number", "description": "Asset quantity during this state period" }
        ],
        "relationships": [
          { "target": "Asset", "type": "child", "description": "Each state period belongs to one asset" },
          { "target": "AssetAction", "type": "child", "description": "State periods are created or modified by asset actions" }
        ]
      }
    ]
  },

  "usage": {
    "objects": [
      {
        "name": "UsageSummary",
        "type": "standard",
        "domain": "usage",
        "description": "Aggregates consumption data for a customer over a defined period, such as API calls made, storage consumed, or minutes used. Usage summaries are the foundation of consumption-based billing, collecting metered data that feeds into the rating engine to calculate charges. Each summary covers a specific time window and is linked to the customer's subscription or order item.",
        "fields": [
          { "name": "SummaryStartDate", "type": "Date", "description": "Beginning of the measurement period" },
          { "name": "SummaryEndDate", "type": "Date", "description": "End of the measurement period" },
          { "name": "TotalQuantity", "type": "Number", "description": "Total consumption recorded during this period" },
          { "name": "Status", "type": "Picklist", "description": "Processing state such as new, rated, billed, or invoiced" },
          { "name": "OrderItemId", "type": "Lookup", "description": "The subscription or order line item this usage relates to" },
          { "name": "AccountId", "type": "Lookup", "description": "The customer account this usage belongs to" }
        ],
        "relationships": [
          { "target": "OrderItem", "type": "child", "description": "Usage summaries are tied to a specific order item or subscription" },
          { "target": "BillingSchedule", "type": "lookup", "description": "Rated usage feeds into billing schedules for invoicing" }
        ]
      },
      {
        "name": "UsageQuantity",
        "type": "standard",
        "domain": "usage",
        "description": "An individual consumption record capturing a single usage event or measurement. Usage quantities are the raw metering data points that get aggregated into usage summaries. Each record represents one event, such as a single API call, one hour of compute time, or a data transfer measurement. These granular records provide the audit trail behind aggregated usage totals.",
        "fields": [
          { "name": "UsageDate", "type": "DateTime", "description": "Timestamp when this usage event occurred" },
          { "name": "Quantity", "type": "Number", "description": "The measured amount of consumption" },
          { "name": "UsageType", "type": "Picklist", "description": "Category of consumption such as storage, compute, or transactions" },
          { "name": "UsageSummaryId", "type": "Lookup", "description": "The summary this individual measurement rolls up to" },
          { "name": "ExternalReference", "type": "Text", "description": "Identifier linking this record to the source metering system" }
        ],
        "relationships": [
          { "target": "UsageSummary", "type": "child", "description": "Individual usage records roll up to a usage summary" }
        ]
      }
    ]
  },

  "billing": {
    "objects": [
      {
        "name": "BillingSchedule",
        "type": "standard",
        "domain": "billing",
        "description": "Defines the cadence and terms for billing a customer for an order item. A billing schedule specifies when invoices should be generated, such as monthly on the first or annually on the subscription anniversary. It links the order to the invoicing process and tracks the total amount to be billed across all periods. Billing schedules are the bridge between what was sold and when payments are collected.",
        "fields": [
          { "name": "BillingScheduleNumber", "type": "Text", "description": "System-generated identifier for this billing schedule" },
          { "name": "OrderItemId", "type": "Lookup", "description": "The order line item this schedule bills for" },
          { "name": "TotalAmount", "type": "Currency", "description": "Total amount to be billed across all periods in this schedule" },
          { "name": "Status", "type": "Picklist", "description": "Current state such as active, suspended, or completed" },
          { "name": "BillingFrequency", "type": "Picklist", "description": "How often invoices are generated: monthly, quarterly, or annually" },
          { "name": "NextBillingDate", "type": "Date", "description": "Date when the next invoice will be generated" }
        ],
        "relationships": [
          { "target": "OrderItem", "type": "child", "description": "Each billing schedule is created from an order item" },
          { "target": "Invoice", "type": "parent", "description": "Billing schedules generate invoice records on each billing cycle" },
          { "target": "BillingScheduleGroup", "type": "child", "description": "Schedules can be grouped together for consolidated billing" }
        ]
      },
      {
        "name": "BillingScheduleGroup",
        "type": "standard",
        "domain": "billing",
        "description": "Groups related billing schedules so they can be invoiced together on a single consolidated invoice. When a customer has multiple subscriptions or order items, grouping their billing schedules ensures they receive one invoice covering all charges rather than separate invoices for each item. Groups are typically organized by customer account and billing cycle.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name for this billing group" },
          { "name": "AccountId", "type": "Lookup", "description": "The customer account whose schedules are grouped" },
          { "name": "BillingFrequency", "type": "Picklist", "description": "Common billing frequency for all schedules in this group" },
          { "name": "NextBillingDate", "type": "Date", "description": "Next date when a consolidated invoice will be generated" }
        ],
        "relationships": [
          { "target": "BillingSchedule", "type": "parent", "description": "A group contains one or more billing schedules" },
          { "target": "Account", "type": "child", "description": "Each group is associated with one customer account" }
        ]
      },
      {
        "name": "Invoice",
        "type": "standard",
        "domain": "billing",
        "description": "A financial document requesting payment from a customer for products or services delivered. Invoices are generated from billing schedules and contain line items detailing each charge. They track the total amount due, payment status, and due date. Invoices serve as the primary accounts receivable record and feed into finance transaction entries for accounting purposes.",
        "fields": [
          { "name": "InvoiceNumber", "type": "Text", "description": "Unique number identifying this invoice" },
          { "name": "AccountId", "type": "Lookup", "description": "The customer account being billed" },
          { "name": "TotalAmount", "type": "Currency", "description": "Grand total of all line items on this invoice" },
          { "name": "Balance", "type": "Currency", "description": "Remaining unpaid amount after any payments applied" },
          { "name": "Status", "type": "Picklist", "description": "Current state such as draft, posted, paid, or cancelled" },
          { "name": "InvoiceDate", "type": "Date", "description": "Date the invoice was issued" },
          { "name": "DueDate", "type": "Date", "description": "Date by which payment is expected" }
        ],
        "relationships": [
          { "target": "InvoiceLine", "type": "parent", "description": "An invoice contains one or more line items" },
          { "target": "Payment", "type": "parent", "description": "Payments can be applied to reduce the invoice balance" },
          { "target": "CreditMemo", "type": "lookup", "description": "Credit memos can be applied to offset invoice charges" },
          { "target": "FinanceTransaction", "type": "parent", "description": "Invoice posting creates finance transaction records" }
        ]
      },
      {
        "name": "InvoiceLine",
        "type": "standard",
        "domain": "billing",
        "description": "A single charge on an invoice representing a specific product, service, or adjustment. Each line item details the description, quantity, unit price, and extended amount for one billable item. Line items are generated from billing schedules and carry the product and tax information needed for accurate financial reporting.",
        "fields": [
          { "name": "InvoiceId", "type": "Lookup", "description": "The invoice this line item belongs to" },
          { "name": "Name", "type": "Text", "description": "Description of the charge on this line" },
          { "name": "Quantity", "type": "Number", "description": "Number of units being billed" },
          { "name": "UnitPrice", "type": "Currency", "description": "Price per unit for this line item" },
          { "name": "LineAmount", "type": "Currency", "description": "Total charge for this line before tax" },
          { "name": "TaxAmount", "type": "Currency", "description": "Tax calculated for this line item" },
          { "name": "Product2Id", "type": "Lookup", "description": "The product this charge relates to" }
        ],
        "relationships": [
          { "target": "Invoice", "type": "child", "description": "Each line item belongs to one invoice" },
          { "target": "Product2", "type": "lookup", "description": "References the product being billed" }
        ]
      },
      {
        "name": "CreditMemo",
        "type": "standard",
        "domain": "billing",
        "description": "A financial document that reduces the amount a customer owes. Credit memos are issued for returns, billing errors, service credits, or negotiated adjustments. They can be applied against open invoices to reduce the balance or left as a credit on the customer's account for future invoices. Each credit memo contains line items that detail the individual adjustments.",
        "fields": [
          { "name": "CreditMemoNumber", "type": "Text", "description": "Unique number identifying this credit memo" },
          { "name": "AccountId", "type": "Lookup", "description": "The customer account receiving the credit" },
          { "name": "TotalAmount", "type": "Currency", "description": "Total credit amount across all line items" },
          { "name": "Balance", "type": "Currency", "description": "Remaining credit not yet applied to invoices" },
          { "name": "Status", "type": "Picklist", "description": "Current state such as draft, posted, or applied" },
          { "name": "CreditDate", "type": "Date", "description": "Date this credit memo was issued" }
        ],
        "relationships": [
          { "target": "CreditMemoLine", "type": "parent", "description": "A credit memo contains one or more line items detailing the credits" },
          { "target": "Invoice", "type": "lookup", "description": "Credits can be applied to specific invoices" },
          { "target": "FinanceTransaction", "type": "parent", "description": "Credit memo posting creates finance transaction records" }
        ]
      },
      {
        "name": "CreditMemoLine",
        "type": "standard",
        "domain": "billing",
        "description": "A single adjustment on a credit memo specifying the product, quantity, and credit amount for one item. Credit memo lines correspond to the original invoice lines being credited and carry the same product and tax detail for accurate financial reconciliation.",
        "fields": [
          { "name": "CreditMemoId", "type": "Lookup", "description": "The credit memo this line belongs to" },
          { "name": "Name", "type": "Text", "description": "Description of the credit being issued" },
          { "name": "Quantity", "type": "Number", "description": "Number of units being credited" },
          { "name": "LineAmount", "type": "Currency", "description": "Total credit amount for this line" },
          { "name": "TaxAmount", "type": "Currency", "description": "Tax credit associated with this line" },
          { "name": "Product2Id", "type": "Lookup", "description": "The product being credited" }
        ],
        "relationships": [
          { "target": "CreditMemo", "type": "child", "description": "Each line belongs to one credit memo" },
          { "target": "InvoiceLine", "type": "lookup", "description": "Credits can reference the original invoice line being adjusted" }
        ]
      },
      {
        "name": "DebitMemo",
        "type": "standard",
        "domain": "billing",
        "description": "A financial document that increases the amount a customer owes, used for additional charges that arise after the original invoice was posted. Debit memos cover scenarios like late fees, additional service charges, or billing corrections that increase the balance. They follow the same lifecycle as invoices and contribute to the customer's total accounts receivable.",
        "fields": [
          { "name": "DebitMemoNumber", "type": "Text", "description": "Unique number identifying this debit memo" },
          { "name": "AccountId", "type": "Lookup", "description": "The customer account being charged" },
          { "name": "TotalAmount", "type": "Currency", "description": "Total additional charge across all line items" },
          { "name": "Balance", "type": "Currency", "description": "Remaining unpaid amount on this debit memo" },
          { "name": "Status", "type": "Picklist", "description": "Current state such as draft, posted, or paid" },
          { "name": "DebitDate", "type": "Date", "description": "Date this debit memo was issued" }
        ],
        "relationships": [
          { "target": "DebitMemoLine", "type": "parent", "description": "A debit memo contains one or more charge line items" },
          { "target": "FinanceTransaction", "type": "parent", "description": "Debit memo posting creates finance transaction records" }
        ]
      },
      {
        "name": "DebitMemoLine",
        "type": "standard",
        "domain": "billing",
        "description": "A single charge on a debit memo specifying the product, quantity, and amount for one additional billing item. Debit memo lines detail the individual charges that make up the total debit and carry product and tax information for financial reporting.",
        "fields": [
          { "name": "DebitMemoId", "type": "Lookup", "description": "The debit memo this line belongs to" },
          { "name": "Name", "type": "Text", "description": "Description of the additional charge" },
          { "name": "Quantity", "type": "Number", "description": "Number of units being charged" },
          { "name": "LineAmount", "type": "Currency", "description": "Total charge for this line before tax" },
          { "name": "TaxAmount", "type": "Currency", "description": "Tax calculated for this additional charge" },
          { "name": "Product2Id", "type": "Lookup", "description": "The product this charge relates to" }
        ],
        "relationships": [
          { "target": "DebitMemo", "type": "child", "description": "Each line belongs to one debit memo" }
        ]
      },
      {
        "name": "BillingTreatment",
        "type": "standard",
        "domain": "billing",
        "description": "Defines how a specific product or charge type should be billed over time. Billing treatments control the billing behavior such as whether charges are billed in advance or in arrears, how proration is handled for mid-cycle changes, and what billing frequency to use. They are assigned to order items to determine the billing schedule parameters for each product.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Descriptive label for this billing treatment" },
          { "name": "BillingCycleType", "type": "Picklist", "description": "Whether charges are billed in advance, in arrears, or on consumption" },
          { "name": "BillingFrequency", "type": "Picklist", "description": "How often charges are billed: monthly, quarterly, or annually" },
          { "name": "ProrationType", "type": "Picklist", "description": "How mid-cycle starts and cancellations are prorated" },
          { "name": "BillingPolicyId", "type": "Lookup", "description": "The billing policy governing this treatment's behavior" }
        ],
        "relationships": [
          { "target": "BillingTreatmentItem", "type": "parent", "description": "A treatment contains items specifying product-level billing rules" },
          { "target": "BillingPolicy", "type": "child", "description": "Each treatment follows rules from a billing policy" }
        ]
      },
      {
        "name": "BillingTreatmentItem",
        "type": "standard",
        "domain": "billing",
        "description": "Links a billing treatment to a specific product or product family, specifying the billing rules for that particular item. Treatment items allow different products to have different billing behavior even within the same order, such as billing software licenses monthly in advance while billing professional services in arrears.",
        "fields": [
          { "name": "BillingTreatmentId", "type": "Lookup", "description": "The billing treatment this item belongs to" },
          { "name": "Product2Id", "type": "Lookup", "description": "The specific product this billing rule applies to" },
          { "name": "ProductFamily", "type": "Picklist", "description": "The product family this rule applies to, if not product-specific" },
          { "name": "IsActive", "type": "Boolean", "description": "Whether this treatment item is currently in effect" }
        ],
        "relationships": [
          { "target": "BillingTreatment", "type": "child", "description": "Each item belongs to one billing treatment" },
          { "target": "Product2", "type": "lookup", "description": "References the product with specific billing rules" }
        ]
      },
      {
        "name": "BillingPolicy",
        "type": "standard",
        "domain": "billing",
        "description": "A set of rules that govern how billing is executed across the organization or for a specific business unit. Policies define defaults for invoice generation timing, payment terms, dunning behavior, and revenue recognition rules. Billing treatments reference a policy to inherit these organizational standards while allowing product-level overrides.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Descriptive name for this billing policy" },
          { "name": "Description", "type": "TextArea", "description": "Explanation of when and where this policy applies" },
          { "name": "DefaultPaymentTerms", "type": "Number", "description": "Default number of days from invoice date to due date" },
          { "name": "Status", "type": "Picklist", "description": "Whether this policy is active or inactive" }
        ],
        "relationships": [
          { "target": "BillingTreatment", "type": "parent", "description": "A policy governs one or more billing treatments" }
        ]
      },
      {
        "name": "Payment",
        "type": "standard",
        "domain": "billing",
        "description": "Records a financial transaction where money is received from a customer. Payments are applied to invoices, debit memos, or credit memos to track what has been collected. Each payment records the amount, date, method, and the payment gateway reference if processed electronically. The payment lifecycle includes authorization, capture, and settlement states.",
        "fields": [
          { "name": "PaymentNumber", "type": "Text", "description": "Unique identifier for this payment" },
          { "name": "Amount", "type": "Currency", "description": "Total amount collected in this payment" },
          { "name": "Status", "type": "Picklist", "description": "Processing state such as draft, processed, or applied" },
          { "name": "PaymentDate", "type": "Date", "description": "Date the payment was received or processed" },
          { "name": "AccountId", "type": "Lookup", "description": "The customer account making the payment" },
          { "name": "PaymentMethodId", "type": "Lookup", "description": "The payment method used for this transaction" }
        ],
        "relationships": [
          { "target": "Invoice", "type": "child", "description": "Payments are applied to invoices to reduce the balance" },
          { "target": "PaymentMethod", "type": "child", "description": "Each payment uses a stored payment method" },
          { "target": "FinanceTransaction", "type": "parent", "description": "Payment application creates finance transaction records" }
        ]
      },
      {
        "name": "PaymentMethod",
        "type": "standard",
        "domain": "billing",
        "description": "Stores a customer's payment instrument information such as a credit card, bank account, or digital wallet. Payment methods are tokenized so that sensitive financial data is not stored directly in Salesforce. Each method records the type, last four digits, and expiration for card payments, enabling automated recurring billing without re-entering payment details.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display label for this payment method, such as card ending in 4242" },
          { "name": "PaymentMethodType", "type": "Picklist", "description": "Type of instrument: credit card, bank transfer, or digital wallet" },
          { "name": "AccountId", "type": "Lookup", "description": "The customer account this method belongs to" },
          { "name": "Status", "type": "Picklist", "description": "Whether this method is active, expired, or cancelled" },
          { "name": "ExpirationDate", "type": "Date", "description": "When this payment method expires, if applicable" }
        ],
        "relationships": [
          { "target": "Payment", "type": "parent", "description": "A payment method can be used for multiple payments" },
          { "target": "Account", "type": "child", "description": "Each payment method belongs to a customer account" }
        ]
      },
      {
        "name": "FinanceTransaction",
        "type": "standard",
        "domain": "billing",
        "description": "An accounting journal entry generated by billing events such as invoice posting, payment receipt, credit memo application, or refund processing. Finance transactions provide the general ledger integration point, capturing the debit and credit entries needed for accurate financial reporting. Each transaction references its source document and records the accounts and amounts involved.",
        "fields": [
          { "name": "TransactionDate", "type": "Date", "description": "Date this financial transaction was recorded" },
          { "name": "Amount", "type": "Currency", "description": "Monetary value of this transaction entry" },
          { "name": "TransactionType", "type": "Picklist", "description": "Category such as charge, payment, credit, refund, or adjustment" },
          { "name": "ReferenceEntityId", "type": "Lookup", "description": "The source document that created this transaction, such as an invoice or payment" },
          { "name": "AccountId", "type": "Lookup", "description": "The customer account this transaction relates to" },
          { "name": "FinanceSystemTransactionNumber", "type": "Text", "description": "External reference for reconciliation with the general ledger" }
        ],
        "relationships": [
          { "target": "FinanceBalanceSnapshot", "type": "parent", "description": "Transactions contribute to periodic balance snapshots" },
          { "target": "Invoice", "type": "child", "description": "Invoice posting generates finance transactions" },
          { "target": "Payment", "type": "child", "description": "Payment processing generates finance transactions" }
        ]
      },
      {
        "name": "FinanceBalanceSnapshot",
        "type": "standard",
        "domain": "billing",
        "description": "A point-in-time capture of a customer's financial balances, including total invoiced, total paid, outstanding balance, and credit available. Balance snapshots are generated periodically or on demand to support reporting, aging analysis, and financial close processes. They provide a reliable baseline for calculating accounts receivable metrics without reprocessing every individual transaction.",
        "fields": [
          { "name": "AccountId", "type": "Lookup", "description": "The customer account this snapshot covers" },
          { "name": "SnapshotDate", "type": "Date", "description": "The date this balance snapshot was captured" },
          { "name": "TotalInvoiced", "type": "Currency", "description": "Cumulative amount invoiced through the snapshot date" },
          { "name": "TotalPayments", "type": "Currency", "description": "Cumulative payments received through the snapshot date" },
          { "name": "OutstandingBalance", "type": "Currency", "description": "Amount currently owed by the customer" },
          { "name": "CreditBalance", "type": "Currency", "description": "Available credit from unapplied credit memos" }
        ],
        "relationships": [
          { "target": "Account", "type": "child", "description": "Each snapshot belongs to a customer account" },
          { "target": "FinanceTransaction", "type": "child", "description": "Snapshots are calculated from accumulated finance transactions" }
        ]
      },
      {
        "name": "TaxTreatment",
        "type": "standard",
        "domain": "billing",
        "description": "Defines how taxes are calculated and applied for a product, transaction type, or jurisdiction. Tax treatments specify the tax engine to use, the applicable tax codes, and whether tax is inclusive or exclusive of the line item price. They ensure that invoices carry the correct tax amounts based on the product type and the customer's tax-relevant location.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Descriptive label for this tax treatment" },
          { "name": "TaxEngineId", "type": "Lookup", "description": "The tax calculation engine used by this treatment" },
          { "name": "TaxType", "type": "Picklist", "description": "Category of tax such as sales, VAT, or GST" },
          { "name": "TaxPolicyId", "type": "Lookup", "description": "The tax policy this treatment follows" },
          { "name": "IsActive", "type": "Boolean", "description": "Whether this tax treatment is currently applied" }
        ],
        "relationships": [
          { "target": "InvoiceLine", "type": "lookup", "description": "Tax treatments determine how tax is calculated on invoice lines" },
          { "target": "Product2", "type": "lookup", "description": "Tax treatments can be assigned to specific products" }
        ]
      },
      {
        "name": "LegalEntity",
        "type": "standard",
        "domain": "billing",
        "description": "Represents a legal business entity within the organization that can issue invoices, receive payments, and report financial results. Multi-entity organizations use legal entities to separate billing and revenue by subsidiary, division, or country. Each invoice and financial transaction is associated with the legal entity that owns the customer relationship and is responsible for the revenue.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Official legal name of this business entity" },
          { "name": "CompanyNumber", "type": "Text", "description": "Government registration number for this entity" },
          { "name": "Status", "type": "Picklist", "description": "Whether this entity is active or inactive" },
          { "name": "Country", "type": "Text", "description": "Country where this legal entity is registered" },
          { "name": "CurrencyIsoCode", "type": "Text", "description": "Default currency for this entity's financial transactions" }
        ],
        "relationships": [
          { "target": "Invoice", "type": "parent", "description": "A legal entity issues invoices on behalf of the organization" },
          { "target": "FinanceTransaction", "type": "parent", "description": "Finance transactions are attributed to a legal entity for reporting" }
        ]
      }
    ]
  },

  "agentforce": {
    "objects": [
      {
        "name": "AgentAction",
        "type": "standard",
        "domain": "agentforce",
        "description": "Defines an action that an AI agent can perform within the revenue lifecycle, such as generating a renewal quote, checking invoice status, or recommending a pricing adjustment. Agent actions encapsulate the business logic and permissions needed for the AI to execute revenue operations tasks autonomously or with human-in-the-loop approval. Each action specifies its inputs, outputs, and the conditions under which it can be invoked.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Display name describing what this agent action does" },
          { "name": "ActionType", "type": "Picklist", "description": "Category of action such as query, create, update, or recommend" },
          { "name": "TargetObject", "type": "Text", "description": "The object this action operates on, such as quote or invoice" },
          { "name": "IsActive", "type": "Boolean", "description": "Whether this action is available for agents to invoke" },
          { "name": "Description", "type": "TextArea", "description": "Natural language explanation of what this action does and when to use it" }
        ],
        "relationships": [
          { "target": "Quote", "type": "lookup", "description": "Agent actions can create or modify quotes" },
          { "target": "Order", "type": "lookup", "description": "Agent actions can interact with order records" }
        ]
      }
    ]
  },

  "promotions": {
    "objects": [
      {
        "name": "Promotion",
        "type": "standard",
        "domain": "promotions",
        "description": "A time-bound promotional offer that adjusts pricing for eligible products or customer segments. Promotions define the discount or incentive, the qualifying criteria, and the effective date range. They can be applied automatically during quoting or ordering when the transaction meets the qualification rules, or manually selected by a sales rep. Active promotions appear as available discounts in the pricing engine.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Marketing name for this promotion" },
          { "name": "Description", "type": "TextArea", "description": "Details about the offer and its intended audience" },
          { "name": "StartDate", "type": "Date", "description": "Date when this promotion becomes available" },
          { "name": "EndDate", "type": "Date", "description": "Date when this promotion expires" },
          { "name": "Status", "type": "Picklist", "description": "Current state such as planned, active, or expired" },
          { "name": "DiscountType", "type": "Picklist", "description": "Whether the offer is a percentage discount, fixed amount, or free trial" },
          { "name": "DiscountValue", "type": "Number", "description": "The discount amount or percentage applied by this promotion" }
        ],
        "relationships": [
          { "target": "PromotionTarget", "type": "parent", "description": "A promotion specifies which products or categories are eligible" },
          { "target": "PromotionQualifier", "type": "parent", "description": "Qualifiers define the conditions a transaction must meet" }
        ]
      },
      {
        "name": "PromotionTarget",
        "type": "standard",
        "domain": "promotions",
        "description": "Specifies which products, product categories, or product families are eligible for a promotion's discount. Targets allow a single promotion to apply to a curated set of offerings rather than the entire catalog. Multiple targets can be defined per promotion to cover different products that participate in the same offer.",
        "fields": [
          { "name": "PromotionId", "type": "Lookup", "description": "The promotion this target belongs to" },
          { "name": "TargetType", "type": "Picklist", "description": "Whether the target is a specific product, category, or product family" },
          { "name": "TargetId", "type": "Lookup", "description": "Reference to the specific product or category" },
          { "name": "AdjustmentPercent", "type": "Percent", "description": "Override discount percentage for this specific target, if different from the promotion default" }
        ],
        "relationships": [
          { "target": "Promotion", "type": "child", "description": "Each target belongs to one promotion" },
          { "target": "Product2", "type": "lookup", "description": "Targets can reference specific products" }
        ]
      },
      {
        "name": "PromotionQualifier",
        "type": "standard",
        "domain": "promotions",
        "description": "Defines the conditions a transaction must meet to qualify for a promotion. Qualifiers can be based on order value thresholds, customer segments, specific product combinations, or other business criteria. Multiple qualifiers on a promotion use AND logic, meaning all conditions must be met for the promotion to apply.",
        "fields": [
          { "name": "PromotionId", "type": "Lookup", "description": "The promotion this qualifier belongs to" },
          { "name": "QualifierType", "type": "Picklist", "description": "Type of condition such as minimum amount, customer segment, or product requirement" },
          { "name": "QualifierValue", "type": "Text", "description": "The threshold or value that must be met" },
          { "name": "Operator", "type": "Picklist", "description": "Comparison operator such as equals, greater than, or contains" }
        ],
        "relationships": [
          { "target": "Promotion", "type": "child", "description": "Each qualifier belongs to one promotion" }
        ]
      },
      {
        "name": "PromotionMarketSegment",
        "type": "standard",
        "domain": "promotions",
        "description": "Links a promotion to a specific market segment, controlling which customer groups can receive the promotional offer. Market segments can be defined by industry, company size, geographic region, or customer tier. This enables targeted promotional campaigns that offer different incentives to different audiences.",
        "fields": [
          { "name": "PromotionId", "type": "Lookup", "description": "The promotion this segment assignment belongs to" },
          { "name": "SegmentName", "type": "Text", "description": "Name of the market segment, such as enterprise or small business" },
          { "name": "SegmentCriteria", "type": "TextArea", "description": "Description of the criteria that define membership in this segment" },
          { "name": "IsActive", "type": "Boolean", "description": "Whether this segment is currently eligible for the promotion" }
        ],
        "relationships": [
          { "target": "Promotion", "type": "child", "description": "Each segment assignment belongs to one promotion" }
        ]
      }
    ]
  },

  "intelligence": {
    "objects": [
      {
        "name": "RevenueAnalyticsDataset",
        "type": "standard",
        "domain": "intelligence",
        "description": "A prebuilt analytics dataset that aggregates revenue metrics from across the revenue lifecycle into a queryable format for dashboards and reports. Datasets are refreshed on a schedule and combine data from orders, billing, payments, and usage to provide a unified view of revenue performance. They power out-of-the-box dashboards for metrics like monthly recurring revenue, churn rate, and customer lifetime value.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Identifying name for this analytics dataset" },
          { "name": "DatasetType", "type": "Picklist", "description": "Category of data such as orders, billing, usage, or combined" },
          { "name": "LastRefreshDate", "type": "DateTime", "description": "When this dataset was last refreshed from source data" },
          { "name": "RefreshFrequency", "type": "Picklist", "description": "How often the dataset is refreshed: hourly, daily, or weekly" },
          { "name": "Status", "type": "Picklist", "description": "Current state of the dataset such as active, refreshing, or error" }
        ],
        "relationships": [
          { "target": "Order", "type": "lookup", "description": "Datasets aggregate order data for revenue reporting" },
          { "target": "Invoice", "type": "lookup", "description": "Datasets include billing data for financial analysis" }
        ]
      }
    ]
  },

  "setup": {
    "objects": [
      {
        "name": "RevenueCloudSettings",
        "type": "standard",
        "domain": "setup",
        "description": "The central configuration record that controls organization-wide Revenue Cloud behavior. Settings include which features are enabled, default billing and pricing policies, automation preferences, and integration parameters. Administrators use this object to activate Revenue Cloud capabilities and tune the system to match their business processes. Changes to these settings affect all subsequent transactions.",
        "fields": [
          { "name": "IsBillingEnabled", "type": "Boolean", "description": "Master switch for enabling the billing engine" },
          { "name": "IsUsageBasedPricingEnabled", "type": "Boolean", "description": "Whether consumption-based pricing features are active" },
          { "name": "DefaultPaymentTerms", "type": "Number", "description": "Organization-wide default payment terms in days" },
          { "name": "DefaultBillingFrequency", "type": "Picklist", "description": "Default cadence for new billing schedules" },
          { "name": "TaxEngineId", "type": "Lookup", "description": "The default tax calculation engine for all transactions" }
        ],
        "relationships": [
          { "target": "BillingPolicy", "type": "lookup", "description": "Settings reference the default billing policy" },
          { "target": "LegalEntity", "type": "lookup", "description": "Settings reference the default legal entity for transactions" }
        ]
      },
      {
        "name": "RevenuePermissionSet",
        "type": "standard",
        "domain": "setup",
        "description": "A preconfigured permission set that grants users access to Revenue Cloud objects, fields, and features. Salesforce provides several permission sets for different roles such as billing administrators, sales operations, and finance users. Each permission set bundles the object permissions, field-level security, and feature access needed for a specific job function within the revenue lifecycle.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Name of the permission set, such as Revenue Cloud Admin or Billing User" },
          { "name": "Description", "type": "TextArea", "description": "Explanation of the access level and intended audience" },
          { "name": "License", "type": "Text", "description": "The Salesforce license type required to use this permission set" },
          { "name": "IsActive", "type": "Boolean", "description": "Whether this permission set is currently assignable to users" }
        ],
        "relationships": [
          { "target": "RevenueCloudSettings", "type": "lookup", "description": "Permission sets control who can modify Revenue Cloud settings" }
        ]
      },
      {
        "name": "DataTransferObject",
        "type": "standard",
        "domain": "setup",
        "description": "A configuration record used for migrating data into Revenue Cloud from external systems or legacy Salesforce configurations. Transfer objects define the mapping between source fields and Revenue Cloud fields, handle data transformation rules, and log the results of each migration run. They are used during initial implementation and when integrating with external billing or ERP systems.",
        "fields": [
          { "name": "Name", "type": "Text", "description": "Identifying name for this data transfer configuration" },
          { "name": "SourceSystem", "type": "Text", "description": "Name of the system data is being imported from" },
          { "name": "TargetObject", "type": "Text", "description": "The Revenue Cloud object data is being imported into" },
          { "name": "Status", "type": "Picklist", "description": "Current state of the transfer such as configured, running, or completed" },
          { "name": "LastRunDate", "type": "DateTime", "description": "When this transfer was last executed" }
        ],
        "relationships": [
          { "target": "Order", "type": "lookup", "description": "Data transfers can import order data from external systems" },
          { "target": "Invoice", "type": "lookup", "description": "Data transfers can import historical invoice data" }
        ]
      }
    ]
  }

};
