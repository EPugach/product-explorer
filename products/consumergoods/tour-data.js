export const TOURS = [
  {
    id: 'store-visit-lifecycle',
    title: 'Store Visit Lifecycle',
    icon: '\u{1F3EA}',
    desc: 'Follow a field rep through the complete lifecycle of a retail store visit, from planning to analytics.',
    stops: [
      {
        planet: 'visit_planning',
        highlightEdges: ['accounts_stores', 'maps_territory'],
        admin: {
          title: 'Visit Is Planned',
          body: 'A sales manager creates visit plans for field reps based on customer visit settings that define frequency, preferred days, and time windows. Visit templates specify the type (sales, training, delivery) and configure GPS tracking, geofencing, and available activities. Visits can be generated automatically, created from job lists, or selected on a map.'
        },
        dev: {
          title: 'Visit Planning Architecture',
          body: 'The Visit object is created from cgcloud__Visit_Template__c configurations. cgcloud__Account_Visit_Setting__c stores per-account scheduling rules. Activities are defined through cgcloud__Job_Definition_List__c with nested cgcloud__Job_Definition_Template__c items. ActionPlanTemplate bundles assessment tasks into reusable visit blueprints associated with stores via StoreActionPlanTemplate.'
        }
      },
      {
        planet: 'accounts_stores',
        highlightEdges: ['products_assortments', 'visit_execution'],
        admin: {
          title: 'Store Context Is Loaded',
          body: 'Before the visit begins, the mobile app loads the store context: account details, in-store locations, product assortments, active promotions, and KPI targets. The trade org hierarchy determines which assortments and promotions are inherited from parent accounts. Customer sets target specific activities to this store based on its segmentation group.'
        },
        dev: {
          title: 'Account and Store Data Model',
          body: 'RetailStore links to Account with InStoreLocation records for aisles and endcaps. cgcloud__Account_Extension__c holds CG-specific attributes. cgcloud__Account_Trade_Org_Hierarchy__c defines time-dependent parent-child relationships. StoreAssortment and StoreProduct map product availability. RetailLocationGroup clusters stores for KPI target assignment via RetailStoreKpi.'
        }
      },
      {
        planet: 'visit_execution',
        highlightEdges: ['products_assortments', 'mobile_app'],
        admin: {
          title: 'Rep Executes the Visit',
          body: 'The field rep arrives at the store, GPS validates their location against the geofence, and the visit clock starts. They complete assessment tasks: checking shelf compliance, counting product facings, and verifying promotion displays. Orders are placed using the product assortment with penny perfect pricing. Surveys capture store staff feedback. Signatures confirm order acceptance.'
        },
        dev: {
          title: 'Visit Execution Object Graph',
          body: 'AssessmentTask records are created from AssessmentTaskDefinition templates. AssessmentIndicatorDefinition defines the KPI metric types (numerical, boolean, text). RetailVisitKpi captures actual values against RetailStoreKpi targets. cgcloud__Order__c and cgcloud__Order_Item__c handle order placement with pricing from cgcloud__CP_Calculation_Schema__c. cgcloud__Signature__c captures multi-step approval flows.'
        }
      },
      {
        planet: 'mobile_app',
        highlightEdges: ['visit_execution', 'van_sales'],
        admin: {
          title: 'Data Syncs Back',
          body: 'All visit data was captured offline on the Consumer Goods mobile app. When the rep has connectivity, the sync process uploads completed visits, orders, and survey responses to Salesforce. The Sync Management app controls which objects sync, using tracked objects, named queries, and named fetch trees to optimize data transfer.'
        },
        dev: {
          title: 'Sync Management Infrastructure',
          body: 'Tracked objects define SOQL Where clauses for selective sync. Named fetch trees (NFTs) describe hierarchical object relationships for efficient multi-object fetching. The sync process handles Initial Sync, First-Sync-of-Day, Background Sync, On-Demand Sync, and Sync On Resume modes. VS Code Based Modeler customizes the mobile UI through XML design contracts.'
        }
      },
      {
        planet: 'analytics',
        highlightEdges: ['visit_execution', 'accounts_stores'],
        admin: {
          title: 'Results Are Analyzed',
          body: 'CRM Analytics dashboards surface the visit results. The Territory Dashboard shows overall rep performance. The Store Compliance Dashboard reveals planogram adherence and out-of-stock patterns. Product Performance dashboards track SKU velocity. Managers identify at-risk stores and optimize future visit schedules based on compliance trends.'
        },
        dev: {
          title: 'Analytics Pipeline',
          body: 'CRM Analytics (Tableau CRM) consumes visit, assessment, and order data via dataflows. Pre-built dashboards for both Base and Advanced Data Models provide territory, store, product, and rep views. Einstein Discovery stories identify predictive patterns in compliance data. Embedded dashboard components bring insights directly into Lightning record pages.'
        }
      }
    ]
  },
  {
    id: 'promotion-to-settlement',
    title: 'Promotion to Settlement',
    icon: '\u{1F3AF}',
    desc: 'Trace a trade promotion from planning through execution to claim settlement.',
    stops: [
      {
        planet: 'tpm_master_data',
        highlightEdges: ['promotions', 'account_planning'],
        admin: {
          title: 'Master Data Is Configured',
          body: 'Before promotions can be planned, the foundation must be set: customer hierarchies define headquarter-to-store relationships, product hierarchies organize the manufacturer catalog, and sales organizations segment data by market. Customer templates configure which KPI sets and business processes are available for each account type.'
        },
        dev: {
          title: 'TPM Master Data Foundation',
          body: 'cgcloud__Account_Trade_Org_Hierarchy__c models time-dependent account trees. cgcloud__Product_Hierarchy__c organizes products by category, brand, and flavor. cgcloud__Sales_Organization__c scopes all templates and records to a market. cgcloud__Account_Template__c links KPI sets to business processes. SF Data Sync pushes master data to the CG Cloud Processing Service.'
        }
      },
      {
        planet: 'promotions',
        highlightEdges: ['funds_budgets', 'tpm_master_data'],
        admin: {
          title: 'Promotion Is Planned',
          body: 'A Key Account Manager creates a promotion for a retail chain using a promotion template. Tactics are added: a 20% temporary price reduction on beverages and an in-store display placement. Products are resolved through the product hierarchy. The trade calendar shows how this promotion fits alongside other active campaigns. KPIs calculate expected volume uplift and cost.'
        },
        dev: {
          title: 'Promotion Object Hierarchy',
          body: 'cgcloud__Promotion__c is anchored to an Account with date ranges and status workflow. cgcloud__Tactic__c records define the promotional activities (display, TPR, ad, coupon) with links to cgcloud__Tactic_Template__c. cgcloud__Tactic_Product__c resolves products via filter expressions. cgcloud__KPI_Definition__c and cgcloud__KPI_Set__c calculate volume, revenue, and cost measures via the Processing Service.'
        }
      },
      {
        planet: 'funds_budgets',
        highlightEdges: ['promotions', 'claims'],
        admin: {
          title: 'Budget Is Allocated',
          body: 'The finance manager has allocated a $500K fund for Q2 beverages promotions. The KAM links this fund to the promotion tactics, committing $75K against the balance. The fund dashboard shows remaining budget, committed spend, and overdraft status. Rate-based funding adjusts the budget dynamically based on actual sales volume.'
        },
        dev: {
          title: 'Fund Management Architecture',
          body: 'cgcloud__Fund__c holds the budget, created via cgcloud__Fund_Template__c. cgcloud__Fund_Transaction_Header__c with cgcloud__Fund_Transaction__c and cgcloud__Fund_Transaction_Row__c records track initial allocation, transfers, and drawbacks. cgcloud__Rate_Based_Funding__c adjusts budgets based on actual vs planned KPIs. Fund auto-determination links tactics to the appropriate fund.'
        }
      },
      {
        planet: 'claims',
        highlightEdges: ['funds_budgets', 'analytics'],
        admin: {
          title: 'Claims Are Settled',
          body: 'After the promotion runs, the retailer submits a claim for $72K covering the price reduction and display placement costs. The claim is matched to the promotion tactics, validated against the fund balance, and routed through the approval workflow. The finance manager approves and the claim settles, debiting the fund.'
        },
        dev: {
          title: 'Claims Processing Pipeline',
          body: 'cgcloud__Payment__c is the claims object with types set by cgcloud__Payment_Template__c: Deduction, Credit Memo, Check Request, Invoice-Based. Claims link to tactics for KPI validation. cgcloud__Approval_Code__c controls authorization limits. Settlement debits are recorded as fund transactions. Claim KPIs update the Processing Service for P&L reporting.'
        }
      },
      {
        planet: 'account_planning',
        highlightEdges: ['promotions', 'analytics'],
        admin: {
          title: 'P&L Is Updated',
          body: 'The account plan now reflects the promotion results. The P&L view shows the beverage category with planned vs actual volume, revenue, and trade spend. The KAM can see that the promotion delivered 15% uplift at $72K cost, giving a positive ROI. This informs next quarter planning and budget allocation decisions.'
        },
        dev: {
          title: 'Account Plan Aggregation',
          body: 'cgcloud__Account_Plan__c aggregates KPIs from all promotions, funds, and claims for a customer-product-timeframe combination. The Processing Service runs nightly batch calculations to update aggregated values. Manual inputs allow KAM overrides. Customer Business Plans store editable baseline targets that cascade down to individual promotion KPIs.'
        }
      }
    ]
  },
  {
    id: 'van-sales-route',
    title: 'Van Sales Route',
    icon: '\u{1F69A}',
    desc: 'Follow a delivery driver through a complete Direct Store Delivery tour from warehouse to customer.',
    stops: [
      {
        planet: 'van_sales',
        highlightEdges: ['accounts_stores', 'maps_territory'],
        admin: {
          title: 'Route Is Defined',
          body: 'A supervisor creates a delivery route with 12 customer stops in priority sequence. Each stop has a defined visit type and expected delivery window. The route is assigned a warehouse, vehicle (refrigerated truck), and driver. Tour templates configure the start-of-day and end-of-day activities including vehicle inspection checklists.'
        },
        dev: {
          title: 'Route and Tour Data Model',
          body: 'cgcloud__Route__c contains cgcloud__Route_Account__c junction records in visit order. cgcloud__Tour__c is generated from routes for specific dates. cgcloud__Tour_Template__c configures cgcloud__Tour_Check__c items for vehicle inspection. cgcloud__Vehicle__c links to cgcloud__Warehouse__c via cgcloud__Vehicle_Warehouse__c. cgcloud__Warehouse_Product__c defines available delivery inventory.'
        }
      },
      {
        planet: 'mobile_app',
        highlightEdges: ['van_sales', 'visit_execution'],
        admin: {
          title: 'Driver Starts Tour',
          body: 'The driver opens the mobile app at the warehouse. The Tour Cockpit shows the day schedule with all stops. They perform the vehicle inspection checklist (brakes, lights, tires, temperature), check out inventory from the warehouse to the truck, and verify the cash float. All pre-tour activities are captured offline.'
        },
        dev: {
          title: 'Mobile Tour Cockpit',
          body: 'The Driver Cockpit and Tour Cockpit are UI flows in the CG offline mobile app. cgcloud__Inventory__c tracks product quantities per vehicle. cgcloud__Inventory_Transaction__c records check-out movements with type Addition. cgcloud__Tour_Check__c captures inspection responses. The sync framework uploads completed checks when online.'
        }
      },
      {
        planet: 'visit_execution',
        highlightEdges: ['products_assortments', 'van_sales'],
        admin: {
          title: 'Deliveries Are Made',
          body: 'At each stop, the driver starts a visit, delivers preordered products, and takes additional orders. The penny perfect pricing engine calculates exact amounts including promotional discounts. The customer signs for delivery on the mobile device. Cash or credit invoices are generated. Returns are processed for damaged goods.'
        },
        dev: {
          title: 'DSD Order Execution',
          body: 'cgcloud__Order__c with type Van Sales Order is created per stop. cgcloud__Order_Item__c records reference products from the vehicle inventory. cgcloud__Order_Payment__c captures payment method (cash, credit, check). cgcloud__Inventory_Transaction__c records Withdrawal for delivered items. cgcloud__Signature__c captures delivery confirmation with cgcloud__Signature_Flow_Step__c multi-role approval.'
        }
      },
      {
        planet: 'van_sales',
        highlightEdges: ['mobile_app', 'accounts_stores'],
        admin: {
          title: 'Tour Is Completed',
          body: 'The driver returns to the warehouse and performs end-of-day activities. Remaining truck inventory is checked back in. Cash is reconciled against invoices. Vehicle inspection is completed. The tour status changes to Completed. Any delivery exceptions or customer complaints are logged for supervisor review.'
        },
        dev: {
          title: 'Tour Completion and Reconciliation',
          body: 'End-of-day cgcloud__Tour_Check__c items record final vehicle state. cgcloud__Inventory_Transaction__c records check-in movements (Withdrawal for returns to warehouse, Balance for reconciliation). cgcloud__Order_Payment_Inventory_Transaction__c reconciles cash float. Tour status transitions through the cgcloud__Workflow__c lifecycle. All data syncs to Salesforce on next connectivity.'
        }
      }
    ]
  },
  {
    id: 'ai-driven-execution',
    title: 'AI-Driven Execution',
    icon: '\u{1F9E0}',
    desc: 'See how Einstein AI and Agentforce optimize retail execution with predictive recommendations.',
    stops: [
      {
        planet: 'einstein_ai',
        highlightEdges: ['visit_planning', 'accounts_stores'],
        admin: {
          title: 'Einstein Recommends Visits',
          body: 'Einstein Visit Recommendations analyzes historical visit patterns, compliance scores, store revenue potential, and time since last visit to generate a prioritized list of stores to visit. High-priority stores appear at the top. Reps can accept or dismiss recommendations, and their feedback trains the model over time.'
        },
        dev: {
          title: 'Visit Recommendation Engine',
          body: 'AiVisitRecommendation records are generated by ML models trained on Visit, RetailVisitKpi, and Account data. Recommendation strategies can use Flow, Next Best Action (NBA), or Apex-based approaches. SurveySubject and SurveyInvitation objects support recommendation flows. Admins configure recommendation criteria and scheduling in Setup.'
        }
      },
      {
        planet: 'agentforce',
        highlightEdges: ['visit_execution', 'promotions'],
        admin: {
          title: 'Agentforce Assists the Rep',
          body: 'During the visit, the field rep asks the Agentforce Visit Assistant for account insights. The agent summarizes revenue trends, identifies top-performing products, and suggests promotional opportunities. For TPM users, the KAM Agent can view promotion measures, copy successful promotions, and update existing ones through natural language commands.'
        },
        dev: {
          title: 'Agentforce Action Architecture',
          body: 'Agentforce Employee Agent templates are configured with Topics that group related actions. Context variables map sales organization, user permissions, and account IDs to action inputs. The TPM KAM Agent uses 13 custom Flow-based actions including Retrieve Account Measures, Execute Promotion BO API Workflow, and Validate TPM Account. Mobile integration passes context via process contracts.'
        }
      },
      {
        planet: 'analytics',
        highlightEdges: ['einstein_ai', 'data_cloud'],
        admin: {
          title: 'Insights Drive Decisions',
          body: 'CRM Analytics dashboards show the impact of AI-driven recommendations. Territory dashboards reveal which stores improved after Einstein-recommended visits. Uplift prediction models forecast the incremental revenue from planned promotions. Whitespace analysis identifies distribution gaps where new product placements could drive growth.'
        },
        dev: {
          title: 'Analytics and ML Pipeline',
          body: 'Einstein Discovery stories identify predictive patterns from visit and sales data. Uplift prediction uses cgcloud__KPI_Definition__c values with CRM Analytics dataflows to train ML models. Predictions are surfaced in promotion planning views. Data Cloud DMOs provide the unified data layer that feeds both CRM Analytics dashboards and Einstein models.'
        }
      }
    ]
  },
  {
    id: 'data-cloud-integration',
    title: 'Data Cloud Integration',
    icon: '\u{2601}\uFE0F',
    desc: 'Understand how Data Cloud unifies Consumer Goods data for segmentation, accruals, and analytics.',
    stops: [
      {
        planet: 'data_cloud',
        highlightEdges: ['accounts_stores', 'products_assortments'],
        admin: {
          title: 'Data Kit Is Deployed',
          body: 'The CG Cloud Data Kit is installed, deploying data streams that map Consumer Goods objects into Data Cloud Data Model Objects (DMOs). Account, Product, Promotion, Tactic, Visit, and Store Assortment data flows into a single source of truth. Field-level mappings ensure CG-specific attributes are preserved in the standardized DMO schema.'
        },
        dev: {
          title: 'Data Stream Architecture',
          body: 'The SSOT package provides DLO-to-DMO attribute mappings. Salesforce Connector data streams ingest cgcloud__* objects alongside standard objects (Visit, RetailStore, Product2). Data Lake Objects (DLOs) are transformed into standardized DMOs. The data kit supports both Base and Enhanced model mappings with separate field-level configurations per model.'
        }
      },
      {
        planet: 'accounts_stores',
        highlightEdges: ['data_cloud', 'analytics'],
        admin: {
          title: 'Accounts Are Segmented',
          body: 'Data Cloud segmentation rules analyze ingested account data to create customer segments: high-value stores, at-risk accounts, growth opportunities. These segments automatically populate account sets in Consumer Goods Cloud, enabling targeted promotions and visit planning without manual group maintenance.'
        },
        dev: {
          title: 'Segmentation to Account Sets',
          body: 'Data Cloud segments evaluate DMO data using configurable rules. Segment results are synced back to cgcloud__Account_Set__c and cgcloud__Account_Set_Account__c records. cgcloud__Segmentation_Rule__c and cgcloud__Segmentation_Rule_Def__c define the criteria. Account sets then drive promotion targeting and activity assignment across the CG Cloud platform.'
        }
      },
      {
        planet: 'promotions',
        highlightEdges: ['data_cloud', 'claims'],
        admin: {
          title: 'Accruals Are Calculated',
          body: 'The Accrual Engine runs on Data Cloud to calculate the financial liability from active promotions and pending claims. For each promotion period, accrual rules determine the expected payout based on actual sales vs planned volumes. The accrual output helps finance teams maintain accurate balance sheets without waiting for claim settlement.'
        },
        dev: {
          title: 'Accrual Engine on Data Cloud',
          body: 'Accrual DLOs (accrualrulemeta__dll, accrualinputanchor__dll, accrualrule_ingest__dll, etc.) define calculation rules and inputs. The engine processes promotion and claim data to compute liability amounts stored in accrualoutput__dll. Accrual calculations consume Data Cloud compute credits. Results are reconciled against actual claim settlements for period-end close.'
        }
      }
    ]
  }
];
