# Galaxy Explorer UX Improvements Design

**Date:** 2026-02-19
**Status:** Approved
**Output:** `npsp/` directory (multi-file split from `index.html`)

## Summary

Seven improvements to the Galaxy Explorer, built as a new `npsp/` directory with split HTML/CSS/JS files. Original `index.html` stays untouched.

## Changes

### 1. Navigation Branding

- Remove `.logo` div from navbar (redundant "NPSP GALAXY EXPLORER" text)
- Breadcrumb root changes from "Galaxy" to "NPSP"
- Path becomes: `NPSP > Donations > Payment Processing`
- Internal state variable `currentLevel="galaxy"` unchanged

### 2. Hero Text Positioning

- `#galaxy-view` padding-top: 50px to 70px
- `.galaxy-title` margin-bottom: 8px to 40px
- Hero text sits in upper third of viewport, planets in lower two-thirds
- Clear visual separation between text and planet map

### 3. Search Click-Outside-to-Close

- Click handler on `#search-overlay` background
- `if (e.target === overlay) closeSearch()`
- ESC key and ESC button still work

### 4. Proportional Font Scaling (~20%)

| Element | Old | New |
|---------|-----|-----|
| Planet labels | 9px | 11px |
| Planet descriptions | 8px | 10px |
| Galaxy subtitle | 9px | 11px |
| Galaxy description | 11px | 13px |
| Galaxy title h1 | 24px | 28px |
| Breadcrumbs | 12px | 14px |
| Search input | 16px | 18px |
| Search button | 10px | 12px |
| Component card h3 | 12px | 14px |
| Card descriptions | 10px | 12px |
| Tags | 8px | 10px |
| Code body | 10px | 12px |
| Zoom indicator | 11px | 13px |
| Help hint | 9px | 11px |

### 5. Search-to-Level-3 Bug Fix

**Root cause:** `activateResult()` calls `enterPlanet()` then `setTimeout(enterCore, 900ms)`. The 800ms CSS zoom transition hasn't settled when the core view starts, causing both views to show simultaneously.

**Fix:** New `navigateToCore(pid, cid)` function that:
- Sets state directly: `currentLevel="core"`, `currentPlanet=pid`, `currentComponent=cid`
- Renders planet view silently (for back-navigation context)
- Shows only core view with a single zoom transition
- No intermediate planet-view animation

### 6. Star Anti-Gravity Effect

- Each star gets `baseX, baseY` (original position)
- Track mouse via `mousemove` on canvas
- Stars within ~80px of cursor: calculate repulsion vector, drift away (max 15-20px)
- Stars beyond 80px: unaffected
- When cursor leaves: stars lerp back to base position (factor ~0.02)
- 350 stars, negligible performance impact

### 7. File Structure

```
npsp/
  index.html              # HTML skeleton, script tags
  css/
    galaxy.css            # All styles (dark theme, nav, views, responsive)
  js/
    npsp-data.js          # NPSP knowledge base + labPatterns
    starfield.js          # Canvas starfield + mouse anti-gravity
    navigation.js         # Views, breadcrumbs, state, enterPlanet, enterCore, navigateToCore
    search.js             # Search engine, overlay, activateResult
    main.js               # Init, event listeners, keyboard shortcuts
```

Script load order: `npsp-data.js` then `starfield.js` then `navigation.js` then `search.js` then `main.js`.

## Implementation Sequence

1. Create directory structure and HTML skeleton
2. Extract and split CSS into `galaxy.css` (with font scaling applied)
3. Extract NPSP data into `npsp-data.js`
4. Build `starfield.js` with anti-gravity effect
5. Build `navigation.js` with branding changes + level-3 bug fix
6. Build `search.js` with click-outside-to-close
7. Build `main.js` to wire everything together
8. Verify all 7 ISC criteria pass
