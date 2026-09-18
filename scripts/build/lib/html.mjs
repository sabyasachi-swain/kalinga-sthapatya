// Tiny HTML string helpers. No templating engine — this project has zero runtime deps.

export function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// For text that is allowed to already contain a few safe inline tags produced by our own
// components (e.g. <em>gandi</em> glossary emphasis). Use sparingly and only with trusted input.
export function raw(str) {
  return str || "";
}

export function attr(name, value) {
  if (value === null || value === undefined || value === false) return "";
  if (value === true) return ` ${name}`;
  return ` ${name}="${escapeHtml(value)}"`;
}

export function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

let uidCounter = 0;
export function uid(prefix) {
  uidCounter += 1;
  return `${prefix}-${uidCounter}`;
}

export function resetUid() {
  uidCounter = 0;
}
