// ══════════════════════════════════════════════════════════════
//  TEMPLATES — Tagged template helper + shared HTML builders
//  Provides readable multi-line templates without a framework.
// ══════════════════════════════════════════════════════════════

export function html(strings, ...values) {
  let result = "";
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      const val = values[i];
      if (Array.isArray(val)) result += val.join("");
      else if (val == null || val === false) {
        /* skip */
      } else result += String(val);
    }
  }
  return result;
}

export function esc(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function breadcrumb(items) {
  return html`<div class="bc">
    ${items.map((item, i) => {
      const sep = i > 0 ? html`<span class="bc-sep">❯</span>` : "";
      if (item.nav)
        return html`${sep}<span class="bc-link" data-nav="${item.nav}"
            >${item.label}</span
          >`;
      return html`${sep}<span class="bc-here">${item.label}</span>`;
    })}
  </div>`;
}

export function wireNavLinks(el, callbacks) {
  el.querySelectorAll('[data-nav="galaxy"]').forEach((l) => {
    l.style.cursor = "pointer";
    l.addEventListener("click", () => callbacks.galaxy());
  });
  el.querySelectorAll('[data-nav="planet"]').forEach((l) => {
    l.style.cursor = "pointer";
    l.addEventListener("click", () => callbacks.planet());
  });
  el.querySelectorAll('[data-nav="back"]').forEach((l) => {
    l.style.cursor = "pointer";
    l.addEventListener("click", () => callbacks.back());
  });
}

export function wireClickAndEnter(el, selector, handler) {
  el.querySelectorAll(selector).forEach((item) => {
    item.addEventListener("click", () => handler(item));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handler(item);
    });
  });
}
