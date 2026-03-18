// ══════════════════════════════════════════════════════════════
//  Revenue Cloud Tour Data — Constellation Stories tour definitions
//  Each tour is a sequence of stops with admin & dev narration
// ══════════════════════════════════════════════════════════════

export const TOURS = [
  {
    id: 'quote-to-cash',
    title: 'Quote to Cash',
    icon: '\uD83D\uDCB0',
    desc: 'Follow a deal from product selection through quoting, ordering, and billing',
    stops: [
      {
        planet: 'catalog',
        highlightEdges: ['pricing'],
        admin: {
          title: 'It Starts With a Product',
          body: 'Everything begins in the Product Catalog. Admins define products, organize them into categories, and assign attributes like size, region, or tier. Products can be standalone or bundled together as composite offerings. The catalog is the single source of truth for what your company sells.'
        },
        dev: {
          title: 'Product2 and Catalog Objects',
          body: 'Products live on the Product2 standard object. ProductCategory and ProductCatalog organize the hierarchy. ProductAttribute and ProductAttributeSet define configurable dimensions. ProductRelatedComponent and ProductComponentGroup handle bundle composition. Pricing procedures query these objects to resolve the correct price book entry.'
        }
      },
      {
        planet: 'pricing',
        highlightEdges: ['catalog', 'transactions'],
        admin: {
          title: 'Setting the Right Price',
          body: 'Price books assign prices to products for different scenarios: standard retail, partner discounts, or region-specific pricing. Pricing procedures calculate the final price by applying adjustments, discounts, and tiered pricing rules in a defined sequence called the price waterfall. AI-powered pricing can suggest optimal prices based on historical data.'
        },
        dev: {
          title: 'Price Waterfall Execution',
          body: 'Pricebook2 and PricebookEntry set base prices. PriceAdjustmentSchedule and PriceAdjustmentTier define volume and tiered discounts. Pricing procedures execute the price waterfall: list price, then adjustments, then floor/ceiling enforcement. Contract pricing overrides standard prices for specific accounts. The pricing engine is invoked during quote and order line item creation.'
        }
      },
      {
        planet: 'transactions',
        highlightEdges: ['pricing', 'approvals', 'orchestrator'],
        admin: {
          title: 'Building the Deal',
          body: 'Sales reps create quotes, add line items from the product catalog, and configure quantities and terms. The line editor shows real-time pricing as items are added. Quotes can be amended or renewed for existing subscriptions. Once approved, quotes convert to orders that kick off the fulfillment process.'
        },
        dev: {
          title: 'Quote and Order Processing',
          body: 'Quote and QuoteLineItem store deal configuration. On approval, quote data maps to Order and OrderItem records. Amendments create new OrderAction records that track changes to existing subscriptions. The transaction engine coordinates with pricing procedures for real-time price calculation and with approval workflows for deal sign-off.'
        }
      },
      {
        planet: 'orchestrator',
        highlightEdges: ['transactions', 'billing'],
        admin: {
          title: 'Fulfilling the Order',
          body: 'Revenue Orchestrator breaks complex orders into manageable fulfillment steps. Each step can be assigned to a different team or system. As steps complete, assets are created to represent what the customer now owns. The fulfillment workspace gives operations teams a single view of all pending work.'
        },
        dev: {
          title: 'Order Decomposition Pipeline',
          body: 'OrderAction records decompose into FulfillmentOrder and FulfillmentOrderLineItem records. Each fulfillment order tracks status independently. On completion, AssetAction and AssetStatePeriod records are created to represent the customer entitlement. OrderDeliveryGroup handles physical goods grouping. The orchestration engine supports both synchronous and asynchronous step execution.'
        }
      },
      {
        planet: 'billing',
        highlightEdges: ['orchestrator', 'intelligence'],
        admin: {
          title: 'Getting Paid',
          body: 'Billing schedules define when and how customers are charged. Invoices are generated automatically based on billing policies. The system supports subscriptions, one-time charges, and usage-based billing. Payments are tracked and reconciled, and credit or debit notes handle adjustments after the fact.'
        },
        dev: {
          title: 'Billing Schedule to Invoice Pipeline',
          body: 'BillingSchedule and BillingScheduleGroup define charge timing. BillingPolicy controls invoice generation rules. Invoice and InvoiceLine records are created by the billing engine. Payment and PaymentMethod track collections. FinanceTransaction and FinanceBalanceSnapshot provide the financial ledger. CreditMemo and DebitMemo handle post-invoice adjustments.'
        }
      }
    ]
  },
  {
    id: 'subscription-lifecycle',
    title: 'Subscription Lifecycle',
    icon: '\uD83D\uDD04',
    desc: 'See how subscriptions are created, billed, amended, and renewed',
    stops: [
      {
        planet: 'transactions',
        highlightEdges: ['pricing'],
        admin: {
          title: 'Starting a Subscription',
          body: 'A subscription begins when a sales rep creates a quote with recurring products. The quote specifies the billing frequency, contract term, and start date. Once the quote is approved and contracted, it becomes an active subscription that the billing engine will process on schedule.'
        },
        dev: {
          title: 'Subscription Data Model',
          body: 'Recurring products on QuoteLineItem records carry billing frequency and term metadata. On contract creation, Order and OrderItem records are generated with subscription-specific fields. The ContractId on Order links back to the master agreement. Amendment and renewal actions create child OrderAction records that modify the subscription state.'
        }
      },
      {
        planet: 'billing',
        highlightEdges: ['transactions', 'usage'],
        admin: {
          title: 'Recurring Charges',
          body: 'The billing engine creates invoices based on the subscription schedule. Monthly, quarterly, or annual invoices are generated automatically. For usage-based subscriptions, metered consumption is added to the next invoice. Billing policies control proration, rounding, and tax calculation.'
        },
        dev: {
          title: 'Billing Engine Execution',
          body: 'BillingSchedule records drive the invoice cadence. BillingTreatment and BillingTreatmentItem define how each order item is billed. The billing engine evaluates BillingPolicy to determine proration rules and tax treatment. Invoice generation creates Invoice, InvoiceLine, and associated FinanceTransaction records in a single transaction.'
        }
      },
      {
        planet: 'usage',
        highlightEdges: ['billing', 'rates'],
        admin: {
          title: 'Tracking Consumption',
          body: 'For usage-based products, the system tracks how much of a resource the customer consumes. Usage records can come from external systems via API or be entered manually. Grants define included quantities, and overage handling determines what happens when customers exceed their allowance.'
        },
        dev: {
          title: 'Usage Metering Pipeline',
          body: 'UsageSummary aggregates raw consumption data. UsageQuantity tracks per-period consumption against grants. Rating procedures convert raw usage into billable amounts using rate cards. The usage engine feeds into the billing engine during invoice generation, attaching metered charges to the next billing cycle.'
        }
      },
      {
        planet: 'transactions',
        highlightEdges: ['orchestrator', 'billing'],
        admin: {
          title: 'Amendments and Renewals',
          body: 'When customers need to change their subscription, sales reps create amendments. Adding seats, changing tiers, or removing products all flow through the amendment process. At the end of a contract term, renewals create a new subscription period. Both amendments and renewals preserve the billing and fulfillment history.'
        },
        dev: {
          title: 'Amendment and Renewal Processing',
          body: 'Amendments create new OrderAction records with action type Add, Remove, or Modify against existing OrderItem records. The orchestrator processes these changes and updates AssetStatePeriod records. Renewals generate a new Order linked to the same Contract with updated terms. Billing schedules are adjusted or replaced based on the amendment type.'
        }
      }
    ]
  },
  {
    id: 'pricing-deep-dive',
    title: 'Pricing Engine Deep Dive',
    icon: '\uD83C\uDFF7\uFE0F',
    desc: 'Trace how prices are calculated from catalog through the price waterfall',
    stops: [
      {
        planet: 'catalog',
        highlightEdges: ['pricing', 'configurator'],
        admin: {
          title: 'Defining What You Sell',
          body: 'The product catalog is where pricing starts. Each product can have multiple attributes that affect its price, like region, tier, or contract length. Products can be sold individually or as part of a configured bundle. The catalog structure determines which pricing rules apply.'
        },
        dev: {
          title: 'Product Data Foundation',
          body: 'Product2 records carry the base product definition. ProductAttribute and ProductAttributeSet define configurable dimensions that pricing procedures reference. ProductComponentGroup structures bundles, and each ProductRelatedComponent can have its own pricing behavior (included, optional, or independently priced).'
        }
      },
      {
        planet: 'pricing',
        highlightEdges: ['catalog', 'rates'],
        admin: {
          title: 'The Price Waterfall',
          body: 'The price waterfall is the sequence of adjustments that transform a list price into a final price. It starts with the base price from a price book, then applies volume discounts, promotional adjustments, contract-specific overrides, and floor/ceiling rules. Each step in the waterfall is configurable and auditable.'
        },
        dev: {
          title: 'Pricing Procedure Execution',
          body: 'Pricing procedures define the waterfall as an ordered sequence of price elements. Each element can reference PriceAdjustmentSchedule for tiered discounts or PriceAdjustmentTier for volume breaks. Contract pricing lookups check for account-specific overrides. The procedure engine supports conditional branching and can invoke external pricing services.'
        }
      },
      {
        planet: 'rates',
        highlightEdges: ['pricing', 'usage'],
        admin: {
          title: 'Rate-Based Pricing',
          body: 'Rate cards define per-unit prices for consumption-based products. Different rates can apply based on volume tiers, time of use, or customer segment. Rating procedures convert raw usage quantities into monetary amounts. Rate adjustments handle discounts and surcharges on top of base rates.'
        },
        dev: {
          title: 'Rate Card Resolution',
          body: 'RateCard objects define rate schedules with effective dates. Rating procedures match usage records against rate card lines based on qualifying criteria (volume tier, time window, customer attributes). Rate adjustments are applied as post-processing steps after the base rate is resolved. The output feeds into billing as a rated charge amount.'
        }
      },
      {
        planet: 'promotions',
        highlightEdges: ['pricing'],
        admin: {
          title: 'Promotions and Discounts',
          body: 'Promotions offer time-limited discounts, bundled deals, or special pricing for targeted customer segments. Promotion rules define eligibility criteria, and promotional pricing adjusts the price waterfall during the promotion period. Multiple promotions can stack based on configured priority rules.'
        },
        dev: {
          title: 'Promotion Evaluation',
          body: 'Promotion records define the offer with effective dates and target segments via PromotionMarketSegment. PromotionTarget identifies which products qualify. PromotionQualifier sets eligibility rules. During pricing procedure execution, active promotions inject adjustment elements into the price waterfall at their configured priority position.'
        }
      },
      {
        planet: 'transactions',
        highlightEdges: ['pricing'],
        admin: {
          title: 'Prices on the Deal',
          body: 'All pricing calculations culminate when a sales rep builds a quote. The line editor shows the full price breakdown for each item: list price, discounts applied, promotional adjustments, and the net price. Reps can see the margin impact of every pricing decision before submitting for approval.'
        },
        dev: {
          title: 'Real-Time Price Calculation',
          body: 'When line items are added to a Quote, the transaction engine invokes the pricing procedure synchronously. QuoteLineItem records store the resolved price waterfall (list price, adjustment amount, net price). Each pricing element is auditable through the price waterfall detail. On order conversion, the resolved prices are transferred to OrderItem records.'
        }
      }
    ]
  },
  {
    id: 'order-fulfillment',
    title: 'Order Fulfillment',
    icon: '\uD83D\uDCE6',
    desc: 'Walk through approval, decomposition, fulfillment, and revenue recognition',
    stops: [
      {
        planet: 'transactions',
        highlightEdges: ['approvals'],
        admin: {
          title: 'Submitting the Order',
          body: 'After a quote is finalized, it needs approval before becoming an order. The approval process routes the deal to the right approvers based on discount level, deal size, or product mix. Sales managers can approve, reject, or request changes through the approval app or email notifications.'
        },
        dev: {
          title: 'Quote to Order Conversion',
          body: 'Quote approval triggers the standard ProcessInstance and ProcessInstanceStep workflow. On final approval, the quote-to-order conversion creates Order and OrderItem records. ContractId is set when the order is contracted. OrderAction records are created for each line item action (Add, for new subscriptions).'
        }
      },
      {
        planet: 'approvals',
        highlightEdges: ['transactions'],
        admin: {
          title: 'The Approval Process',
          body: 'Advanced Approvals provides flexible routing based on deal attributes. Approval rules define thresholds and conditions. Multiple approvers can be required in parallel or sequence. The approval app gives approvers a mobile-friendly interface with full deal context, and auto-escalation ensures deals do not get stuck.'
        },
        dev: {
          title: 'Approval Engine Architecture',
          body: 'Approval rules evaluate against Quote or Order fields to determine required approvers. ProcessInstance records track the approval lifecycle. Step routing supports serial, parallel, and conditional paths. The approval engine integrates with the standard Salesforce approval framework but adds Revenue Cloud-specific features like approval matrices and delegation rules.'
        }
      },
      {
        planet: 'orchestrator',
        highlightEdges: ['transactions', 'billing'],
        admin: {
          title: 'Breaking Down the Order',
          body: 'The orchestrator decomposes a single order into multiple fulfillment tasks. A software license might be provisioned immediately while hardware ships from a warehouse. Each fulfillment step tracks its own status, and the orchestrator coordinates dependencies between steps.'
        },
        dev: {
          title: 'Decomposition and Fulfillment',
          body: 'Order decomposition creates FulfillmentOrder records from OrderItem groups. Each FulfillmentOrderLineItem maps back to its source OrderItem. Fulfillment steps can be synchronous (API provisioning) or asynchronous (manual warehouse pick). On step completion, AssetAction records create or update Asset records representing customer entitlements.'
        }
      },
      {
        planet: 'billing',
        highlightEdges: ['orchestrator'],
        admin: {
          title: 'Triggering Billing',
          body: 'Once an order is fulfilled, billing begins. The billing engine uses the order terms to create billing schedules and generate invoices. For milestone-based billing, invoices are triggered by fulfillment events. The finance team can review and approve invoices before they are sent to customers.'
        },
        dev: {
          title: 'Fulfillment to Billing Bridge',
          body: 'Fulfilled OrderItem records trigger BillingSchedule creation based on BillingPolicy rules. BillingTreatment maps order items to billing behavior (one-time, recurring, usage). Invoice generation is either event-driven (on fulfillment) or schedule-driven (periodic batch). FinanceTransaction records provide the double-entry accounting ledger.'
        }
      },
      {
        planet: 'intelligence',
        highlightEdges: ['billing'],
        admin: {
          title: 'Revenue Visibility',
          body: 'Revenue Intelligence dashboards give finance and operations teams real-time visibility into revenue performance. Dashboards show billing metrics, outstanding invoices, and revenue trends. The operations console highlights issues that need attention, like failed payments or stalled fulfillment steps.'
        },
        dev: {
          title: 'Analytics Data Model',
          body: 'Revenue dashboards query FinanceTransaction and FinanceBalanceSnapshot for financial metrics. Invoice aging reports aggregate Invoice records by status and due date. The operations console surfaces records with error states across the fulfillment and billing pipeline, using list views and reports built on standard Revenue Cloud objects.'
        }
      }
    ]
  },
  {
    id: 'usage-based-billing',
    title: 'Usage-Based Billing',
    icon: '\uD83D\uDCCA',
    desc: 'Trace metered consumption from tracking through rating to invoicing',
    stops: [
      {
        planet: 'catalog',
        highlightEdges: ['pricing'],
        admin: {
          title: 'Defining Usage Products',
          body: 'Usage-based products are defined in the catalog with a consumption model. Admins specify the unit of measure (API calls, storage GB, compute hours) and whether the product includes a baseline grant. The product definition links to rate cards that determine per-unit pricing.'
        },
        dev: {
          title: 'Usage Product Configuration',
          body: 'Product2 records for usage products carry QuantityUnitOfMeasure and usage-specific attributes. ProductAttribute sets define the metering dimensions. The product links to rate card configurations that the rating engine uses to convert raw usage into billable amounts during the billing cycle.'
        }
      },
      {
        planet: 'usage',
        highlightEdges: ['rates', 'billing'],
        admin: {
          title: 'Tracking Consumption',
          body: 'Usage records capture how much of a resource each customer consumes. Records can flow in from external metering systems via API, or be entered manually for services like consulting hours. Grants define included quantities that customers can use before overage charges apply. Usage summaries aggregate raw records into billable periods.'
        },
        dev: {
          title: 'Usage Ingestion Pipeline',
          body: 'Raw usage data is ingested as UsageQuantity records via the Usage API or bulk data load. UsageSummary aggregates quantities per billing period per subscription. Grant balances are tracked and decremented as usage accrues. When consumption exceeds the grant, the overage quantity is flagged for rating and billing.'
        }
      },
      {
        planet: 'rates',
        highlightEdges: ['usage', 'pricing'],
        admin: {
          title: 'Rating the Usage',
          body: 'Rate cards convert raw usage quantities into monetary amounts. Tiered rate cards charge different per-unit prices as volume increases. Time-of-use rates charge differently based on when consumption occurs. Rating procedures apply the appropriate rate card and produce a rated charge for the billing engine.'
        },
        dev: {
          title: 'Rating Engine Processing',
          body: 'Rating procedures match UsageSummary records against RateCard and rate card line objects. Tiered pricing resolves through rate card lines ordered by quantity threshold. The rating output is a billable charge amount attached to the usage summary. Rate adjustments (discounts, surcharges) are applied as post-processing before the charge flows to billing.'
        }
      },
      {
        planet: 'billing',
        highlightEdges: ['usage'],
        admin: {
          title: 'Usage on the Invoice',
          body: 'Rated usage charges appear on the customer invoice alongside any fixed subscription fees. The invoice shows a breakdown of consumption by period and the applied rate. Usage charges can be billed in arrears (after consumption) or in advance (based on estimated usage with true-up later).'
        },
        dev: {
          title: 'Usage Charge to Invoice',
          body: 'The billing engine pulls rated usage charges from UsageSummary during invoice generation. InvoiceLine records are created for each usage charge with quantity, unit price, and total amount. BillingTreatment for usage items specifies arrears or advance billing behavior. Finance transactions record the revenue recognition for usage charges.'
        }
      },
      {
        planet: 'intelligence',
        highlightEdges: ['billing'],
        admin: {
          title: 'Consumption Analytics',
          body: 'Revenue Intelligence shows usage patterns and trends across your customer base. Dashboards highlight customers approaching their grant limits, usage spikes that may indicate upsell opportunities, and consumption forecasts based on historical patterns. Operations teams can proactively engage customers before overages become a billing surprise.'
        },
        dev: {
          title: 'Usage Analytics Queries',
          body: 'Usage analytics aggregate UsageSummary and UsageQuantity records across time periods. Grant utilization reports compare consumed quantities against allocated grants. Trend analysis uses historical usage data to forecast future consumption. These reports feed into the Revenue Intelligence dashboards alongside billing and revenue metrics.'
        }
      }
    ]
  }
];
