# Product Explorer

There's a gap between the people who build software and the people who need to understand it. Source code tells the whole story, but it's written in a language most stakeholders don't speak.

Product Explorer closes that gap. It reads the codebase and renders it as an interactive visual system you can navigate, search, and explore without writing a single query.

## What You Get

For admins, consultants, and implementation teams:
- See how features connect without tracing code paths
- Understand dependencies before making configuration changes
- Explore guided tours that walk through architectural stories
- Search across every entity, field, and method in one place

For developers and architects:
- Execution flows and code samples for every component
- Complete entity data: classes, objects, triggers, LWCs, metadata
- Cross-domain connection maps showing system interactions
- AI-generated descriptions covering purpose, behavior, and architectural role

## Available Products

### NPSP (Salesforce Nonprofit Success Pack)

> **[Launch the NPSP Explorer](https://epugach.github.io/product-explorer/npsp/)**

The Salesforce Nonprofit Success Pack powers thousands of nonprofit organizations. This explorer maps its entire architecture:

| | |
|---|---|
| Domains | 18 feature areas across 4 clusters |
| Components | 55 functional groups |
| Entities | 534 classes, objects, triggers, LWCs, metadata |
| Connections | 86 cross-domain dependencies |
| Tours | 9 guided constellation stories |
| Source | SalesforceFoundation/NPSP repository |

Entity data extracted from the Cumulus repository and enriched with AI-generated descriptions covering purpose, behavior, and architectural role.

## Navigation

| Action | How |
|--------|-----|
| Explore a domain | Click any planet on the galaxy view |
| View a component | Click a component card within a domain |
| Browse entities | Switch tabs (Classes, Objects, Triggers, LWCs, Metadata) |
| View entity detail | Click any entity card |
| Search | Press `/` or click the search icon |
| Go back | Press `ESC` or click breadcrumbs |
| Switch tabs | `Left` / `Right` arrow keys (on component view) |
| Change transitions | Press `T` to cycle Gentle / Cinematic / Snappy |
| Rearrange planets | Drag any planet on the galaxy view |
| Zoom | Scroll wheel or pinch on touch devices |

## Architecture

```
Galaxy View (all domains)
  -> Domain View (component groups)
    -> Component View (overview, code, entity tabs)
      -> Entity Detail (methods, fields, handlers)
```

No build step. No dependencies. No frameworks. Pure HTML, CSS, and ES modules.
