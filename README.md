# NPSP Architecture Explorer

> **[Launch the Explorer](https://epugach.github.io/product-explorer/npsp/)**

An interactive visualization of the Salesforce Nonprofit Success Pack architecture. Explore 18 domains, 843 Apex classes, 65 custom objects, 26 triggers, Lightning Web Components, and custom metadata types in one navigable interface.

## What You Can Explore

- **18 feature domains** mapped as an interactive galaxy: Donations, Recurring Giving, TDTM Framework, Rollups, Batch Data Import, and more
- **55 component groups** with execution flows, code samples, and trigger chains
- **753 individual entities** including classes, objects, triggers, LWCs, and metadata types with AI-generated descriptions
- **Cross-domain connections** showing how systems depend on and interact with each other
- **Deep search** across every entity name, field, method, referenced object, and trigger event

## Navigation

| Action | How |
|--------|-----|
| Explore a domain | Click any planet on the galaxy view |
| View a component | Click a component card within a domain |
| Browse entities | Switch tabs (Classes, Objects, Triggers, LWCs, Metadata) |
| View entity detail | Click any entity card |
| Search | Press `/` or click the search bar |
| Go back | Press `ESC` or click breadcrumbs |
| Switch tabs | `Left` / `Right` arrow keys (on component view) |
| Change transitions | Press `T` to cycle Gentle / Cinematic / Snappy |
| Rearrange planets | Drag any planet on the galaxy view |
| Zoom | Scroll wheel or pinch on touch devices |

## Architecture

```
Galaxy View (18 domains)
  -> Domain View (component groups)
    -> Component View (overview, code, entity tabs)
      -> Entity Detail (class methods, object fields, trigger handlers)
```

### File Structure

```
npsp/
  index.html          # HTML skeleton, planet positions, script loading
  favicon.svg         # App icon
  css/
    galaxy.css        # Dark space theme, all layout and styling
  js/
    npsp-data.js      # NPSP domain data (18 domains, 55 components)
    npsp-entities.js  # Entity data (753 classes, objects, triggers, LWCs, metadata)
    starfield.js      # Twinkling stars canvas animation
    physics.js        # Force-directed graph layout
    renderer.js       # Canvas rendering for planets and connections
    particles.js      # Particle effects along connection lines
    navigation.js     # View transitions, breadcrumbs, entity renderers
    search.js         # Fuzzy search engine
    main.js           # Init, events, keyboard shortcuts
```

## Running Locally

```bash
git clone https://github.com/EPugach/product-explorer.git
cd product-explorer
python3 -m http.server 8000
# Open http://localhost:8000/npsp/
```

No build step, no dependencies, no frameworks.

## Data Generation

Entity data (classes, objects, triggers, LWCs, metadata types) was extracted from the [Cumulus repository](https://github.com/SalesforceFoundation/NPSP) and enriched with AI-generated descriptions using a build script. The 753 entity descriptions cover purpose, behavior, and architectural role within the NPSP codebase.

## Why This Exists

NPSP powers thousands of nonprofit organizations on Salesforce, but understanding how 843 Apex classes, 26 triggers, and 65 custom objects connect and interact is a challenge that documentation alone doesn't solve. This explorer makes that complexity navigable by visualizing the architecture as an interactive system.
