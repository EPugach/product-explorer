# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NPSP Galaxy Explorer — a single-file interactive web application that visualizes the Salesforce Nonprofit Success Pack (NPSP) architecture. It presents 16 feature domains as an explorable galaxy with drill-down into components, Apex code patterns, and data flows.

## Running the Application

Open `index.html` directly in a browser, or serve it locally:

```bash
python -m http.server 8000
# Visit http://localhost:8000
```

There is no build step, no package manager, no dependencies, and no test suite.

## Architecture

The entire application lives in a single `index.html` file with three embedded sections:

1. **CSS (~275 lines)** — Dark-themed UI with CSS custom properties, glassmorphism panels, 3D zoom transitions, and responsive layout. All color tokens defined as `--accent-*` and `--text-*` CSS variables on `:root`.

2. **HTML** — Three-layer stage (`#galaxy-view`, `#planet-view`, `#core-view`) with a fixed navbar (breadcrumbs, search, zoom indicator), a canvas-based starfield background, and a full-screen search overlay.

3. **JavaScript (~450 lines)** — Contains:
   - **`npsp` object** — The knowledge base. A large data structure with 16 domain keys (e.g., `donations`, `tdtm`, `rollups`), each containing name, icon, color, description, an array of components (with details, code samples, execution flows), dataFlow paths, and connections to other domains.
   - **Rendering functions** — `renderGalaxy()`, `renderPlanet(key)`, `renderCore(key, idx)` build DOM for each zoom level.
   - **Navigation state** — `currentView` (`'galaxy'`/`'planet'`/`'core'`), `currentPlanet`, `currentCore` track position. `zoomTo(level)` handles CSS transform transitions between views.
   - **Search engine** — Indexes planets, components, and tags. Fuzzy-matches against name, description, tags, and class names. Triggered by `/` keyboard shortcut.
   - **Starfield** — Canvas animation rendering 350 parallax stars.

### Navigation Model

```
Galaxy (16 planets) → Planet (2–7 components per domain) → Core (code samples, execution flows)
```

- Click a planet → zooms to planet view
- Click a component card → zooms to core detail view
- ESC or breadcrumb → zooms back out
- `/` → opens search overlay

### Data Structure Pattern

Each domain in the `npsp` object follows this shape:

```javascript
{
  name: String,
  icon: String (emoji),
  color: String (CSS color),
  description: String,
  components: [{ name, description, details, code, flow }],
  dataFlow: [String],
  connections: [String] // keys of other domains
}
```

## Editing Guidelines

- All changes go in `index.html` — there are no other source files.
- When adding a new NPSP domain, add a key to the `npsp` object following the existing shape, and it will automatically appear as a new planet.
- CSS variables are defined on `:root`; use them instead of hardcoded colors.
- The search index is built dynamically from the `npsp` object at page load — no manual index maintenance needed.
- Domain connections are rendered as SVG lines in galaxy view; updating the `connections` array is sufficient.
