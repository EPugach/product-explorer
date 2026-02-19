# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NPSP Architecture Explorer — interactive web applications that visualize the Salesforce Nonprofit Success Pack (NPSP) architecture. Two versions exist:

1. **Galaxy Version** (`index.html`) — Dark-themed space visualization with 16 feature domains as explorable planets, canvas starfield background, 3D zoom transitions.
2. **Professional Version** (`npsp-professional.html`) — Salesforce-branded force-directed graph with light/dark theme toggle, official Salesforce colors and typography.

Both share the same NPSP data object (16 domains, 42 components, code samples, execution flows) and the same 3-level navigation model.

## Running the Application

Open either HTML file directly in a browser, or serve locally:

```bash
python -m http.server 8000
# Visit http://localhost:8000/index.html          (galaxy)
# Visit http://localhost:8000/npsp-professional.html (professional)
```

There is no build step, no package manager, no external dependencies.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Galaxy version — the original space-themed explorer |
| `npsp-professional.html` | Salesforce-branded professional version with force-directed graph |
| `build_pro.py` | Build script — syncs NPSP data from `index.html` into the professional version |
| `CLAUDE.md` | This file — project documentation and editing guidelines |

## Build Script

The professional version gets its NPSP data from `index.html`. After editing domain data in `index.html`, re-run:

```bash
python build_pro.py          # Rebuild professional version from latest data
python build_pro.py --check  # Verify all components are present
```

The script extracts the `NPSP` object and `labPatterns` from `index.html` and injects them into the professional version's scaffold along with the force-directed graph engine, theme toggle, navigation, and search code.

## Architecture

### Galaxy Version (`index.html`)

Single HTML file with three embedded sections:

1. **CSS (~280 lines)** — Dark-themed UI with CSS custom properties, glassmorphism panels, 3D zoom transitions. Color tokens defined as `--accent-*` and `--text-*` on `:root`.

2. **HTML** — Three-layer stage (`#galaxy-view`, `#planet-view`, `#core-view`) with fixed navbar, canvas starfield, full-screen search overlay, dynamically-rendered SVG connection lines.

3. **JavaScript (~500 lines)** — Contains:
   - **`NPSP` object** — Knowledge base with 16 domain keys, each containing name, icon, color, description, components array, dataFlow, and connections.
   - **`renderConnections()`** — Dynamically generates SVG connection lines from NPSP data, with hover highlighting.
   - **Rendering functions** — `renderPlanetView()`, `renderCoreView()` build DOM for drill-down views.
   - **Navigation state** — `currentLevel`, `currentPlanet`, `currentComponent` with history stack.
   - **Search engine** — Fuzzy-matches against names, descriptions, tags, class names. `/` shortcut.
   - **Starfield** — Canvas animation with 350 twinkling stars.

### Professional Version (`npsp-professional.html`)

Single HTML file (~109K chars):

1. **CSS (~400 lines)** — Dual theme system via `[data-theme="light"]`/`[data-theme="dark"]` CSS variable sets. Salesforce brand colors (#0176D3, #5867E8, #EAF5FE). Salesforce Sans with system font fallback.

2. **HTML** — Navbar with Salesforce cloud logo, breadcrumbs, theme toggle, search, legend panel. Three-layer stage with canvas graph view.

3. **JavaScript (~900 lines)** — Contains:
   - **Same `NPSP` object** as galaxy version (synced via `build_pro.py`).
   - **Force-directed graph engine** — Pure JS physics simulation (repulsion, spring attraction, centering, alpha cooling). Canvas rendering with quadratic bezier edges.
   - **Node sizing** — Weighted formula: `(classCount + componentCount*10 + connectionCount*3) * foundationalMultiplier`, normalized to 28-52px radius. TDTM gets 2.5x multiplier as foundational framework.
   - **Interactions** — Click to explore, drag to rearrange, scroll to zoom, click+drag background to pan, hover to highlight connections.
   - **Theme toggle** — Light/dark mode persisted in `localStorage`.
   - **Same navigation, search, domain/core views** as galaxy version, restyled.

### Navigation Model (Both Versions)

```
Overview (16 domains) → Domain Detail (components grid) → Core Detail (code samples, execution flows)
```

- Click a domain node → drill into domain detail
- Click a component card → drill into core code view
- ESC or breadcrumb → navigate back
- `/` → opens search overlay

### Node Sizing (Proportionate to Codebase Complexity)

Planet/node sizes reflect actual NPSP codebase scale:

| Domain | Classes | Size | Notes |
|--------|---------|------|-------|
| Recurring Donations | 89 | Largest | Most complex subsystem |
| Rollups (CRLP) | 76 | Very large | Architecturally sophisticated |
| BDI (Data Import) | 66 | Large | Critical import engine |
| Settings | 64 | Large | 14+ custom settings objects |
| Donations | 50 | Large | Core domain, 6 components |
| TDTM | 15 | Medium-large | Foundational (2.5x multiplier) |
| Affiliations | 4 | Smallest | 1 component |
| Levels | 6 | Smallest | 1 component |

### Data Structure Pattern

Each domain in the `NPSP` object follows this shape:

```javascript
{
  name: String,
  icon: String (emoji),
  color: String (CSS color),
  description: String,
  components: [{ id, name, icon, desc, tags, triggerTags, code, executionFlow }],
  dataFlow: [String],
  connections: [{ planet: String, desc: String }]
}
```

### Salesforce Brand Colors (Professional Version)

| Token | Hex | Usage |
|-------|-----|-------|
| Salesforce Blue | #0176D3 | Primary accent (light mode) |
| Indigo | #5867E8 | Primary accent (dark mode) |
| Cloud Blue | #EAF5FE | Light backgrounds |
| Charcoal | #181818 | Primary text (light mode) |
| Hot Orange | #D83A00 | Trigger tags, alerts |
| Green | #41B658 | Success states |

## Editing Guidelines

- **NPSP data**: Edit the `NPSP` object in `index.html`. Adding a new domain key auto-creates a new node in both versions.
- **After data changes**: Run `python build_pro.py` to sync the professional version.
- **Galaxy styling**: Edit CSS in `index.html`. Use `--accent-*` and `--text-*` variables.
- **Professional styling**: Edit CSS in `npsp-professional.html`. Use `--sf-*` brand variables and `[data-theme]` selectors.
- **Connection lines**: Galaxy version generates them dynamically from `connections` arrays. Professional version renders them via force graph edges.
- **Search index**: Built dynamically from the `NPSP` object at page load — no manual maintenance.
- **Node sizes**: Galaxy version uses inline `--size` CSS variables. Professional version calculates via `calcRadius()` using `CODEBASE_WEIGHT` and `FOUNDATIONAL` multiplier maps.
