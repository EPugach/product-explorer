# NPSP Architecture Explorer

**An interactive deep-dive into the Salesforce Nonprofit Success Pack.**

> [**Launch the Explorer**](https://epugach.github.io/npsp-explorer/npsp/)

## What is this?

NPSP powers thousands of nonprofit organizations on Salesforce. But understanding how it actually works, how 843 Apex classes, 26 triggers, and 65 custom objects connect and interact, is a different challenge entirely.

This explorer lets you see NPSP from the inside out. Not the marketing docs. Not the admin guides. The actual architecture: how triggers fire, how data flows between domains, how the code connects at every level.

## What you'll find

- **16 feature domains** mapped as an interactive galaxy: Donations, Recurring Giving, TDTM, Rollups, BDI, and more
- **42 components** with real Apex code samples, execution flows, and trigger chains
- **Connection mapping** showing how domains depend on and interact with each other
- **Fuzzy search** across every trigger, class, object, and concept (press `/`)

## How to explore

1. Click any planet to drill into that domain
2. Click a component card to see the code, execution flow, and trigger tags
3. Use breadcrumbs or ESC to navigate back
4. Press `/` to search across the entire architecture

## Built with

Pure HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies. Just open and explore.

## Why this exists

NPSP is a complex product with deep interdependencies and interconnections across its many domains. Understanding how it all fits together requires seeing the connections that documentation doesn't always show.

This explorer was built to make that complexity a bit more navigable.
