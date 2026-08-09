// scripts/ingest/lib/render.mjs
//
// Serialize the in-memory PRODUCT (data.js) and ENTITIES (entities.js) objects
// back to ESM source text. The requirement is LOSSLESS round-trip (parse ->
// render -> parse yields a deep-equal object), not byte-parity with the
// committed hand-authored formatting — the diff-vs-committed gate compares
// PARSED OBJECTS, so formatting is irrelevant to it. Output is clean and
// consistent, with icons re-encoded as \u{...} escapes to match the sibling
// files' look on the deployed site.

// JSON.stringify gives a valid JS string/array literal (double-quoted, proper
// escaping, non-ASCII preserved). Used for all text and plain arrays.
const js = (v) => JSON.stringify(v);

// Re-encode an emoji/icon string as \u{CODEPOINT} escapes (iterates by code
// point, so ZWJ sequences become multiple \u{...} — matching the committed files).
const uni = (s) =>
  '"' + [...String(s)].map((c) => `\\u{${c.codePointAt(0).toString(16).toUpperCase()}}`).join("") + '"';

// Generic object literal: serialize EVERY key (so no key is ever silently
// dropped, whatever the product's schema), unquoted identifier keys, with a
// top-level string `icon` re-encoded as \u{...}. Nested arrays/objects go
// through JSON.stringify, which is lossless.
function lit(o) {
  const parts = Object.entries(o).map(([k, v]) =>
    k === "icon" && typeof v === "string" ? `${k}:${uni(v)}` : `${k}:${js(v)}`,
  );
  return `{${parts.join(",")}}`;
}

/** Render the data.js source for a PRODUCT object. */
export function renderDataJs(PRODUCT) {
  const blocks = Object.entries(PRODUCT).map(([id, d]) => {
    const lines = Object.entries(d).map(([k, v]) => {
      if (k === "components" && Array.isArray(v)) {
        const comps = v.map((c) => `    ${lit(c)}`).join(",\n");
        return `  components: [\n${comps}\n  ]`;
      }
      if (k === "icon" && typeof v === "string") return `  icon: ${uni(v)}`;
      return `  ${k}: ${js(v)}`;
    });
    return `${id}: {\n${lines.join(",\n")}\n}`;
  });
  return `export const PRODUCT = {\n\n${blocks.join(",\n\n")}\n\n};\n`;
}

/** Render the entities.js source for an ENTITIES object. Emits ALL keys of each
 *  domain entry (objects, metadata, and code entities like classes/triggers/lwcs
 *  on OSS products) so nothing is dropped. */
export function renderEntitiesJs(ENTITIES) {
  const blocks = Object.entries(ENTITIES).map(([id, e]) => {
    const lines = Object.entries(e).map(([k, v]) => {
      if (Array.isArray(v)) {
        const items = v.map((it) => `      ${js(it)}`).join(",\n");
        return `    ${js(k)}: [\n${items}\n    ]`;
      }
      return `    ${js(k)}: ${js(v)}`;
    });
    return `  ${js(id)}: {\n${lines.join(",\n")}\n  }`;
  });
  return `export default {\n\n${blocks.join(",\n\n")}\n\n};\n`;
}

/** Render both files (icons in data.js only; entities has none). */
export function renderProduct(PRODUCT, ENTITIES) {
  return { dataJs: renderDataJs(PRODUCT), entitiesJs: renderEntitiesJs(ENTITIES) };
}
