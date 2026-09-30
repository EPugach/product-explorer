import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const generator = read("scripts/generate-product-html.mjs");
const templates = read("app/js/templates.js");
const search = read("app/js/search.js");
const icons = read("app/js/icons.js");
const css = read("app/css/galaxy.css");

const checks = [
  [generator.includes('role="region" aria-label="Interactive galaxy map'), "galaxy is a labeled region"],
  [generator.includes('<main id="stage" tabindex="-1">'), "skip target is a focusable main"],
  [generator.includes('aria-hidden="true" inert'), "generated hidden UI starts inert"],
  [templates.includes('<nav class="bc" aria-label="Breadcrumb">'), "breadcrumbs use nav"],
  [templates.includes('<a class="bc-link"'), "breadcrumb controls are anchors"],
  [search.includes('input?.setAttribute("aria-activedescendant"'), "combobox owns active descendant"],
  [icons.includes('aria-hidden="true" focusable="false"'), "shared SVG icons are decorative"],
  [!css.includes('transition: all var(--transition-duration)'), "view transitions list properties"],
];

const failures = checks.filter(([passed]) => !passed);
for (const [passed, label] of checks) console.log(`${passed ? "PASS" : "FAIL"} ${label}`);
if (failures.length) process.exitCode = 1;
