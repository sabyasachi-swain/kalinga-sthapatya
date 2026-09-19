// Glossary page: searchable, alphabetised list of architectural terms (glossary.json). The search
// input and A–Z buttons are progressive enhancement (js/glossary.js) — with JS off, the page is
// simply the full list of native <details> accordions, fully readable and find-in-page-able.

import { escapeHtml } from "../lib/html.mjs";
import { claim, claimsList, unverified, sourcesList, isClaim } from "../lib/components.mjs";
import { page } from "../lib/layout.mjs";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function firstLetter(term) {
  const c = (term || "").trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : "#";
}

function searchText(term) {
  return [term.term, term.odia, term.short?.text].filter(Boolean).join(" ").toLowerCase();
}

function templesListHtml(term, ctx) {
  const items = (term.temple_ids || [])
    .map((id) => {
      const t = ctx.data.templesById.get(id);
      return t ? `<li><a href="${ctx.rel}${escapeHtml(t.page)}">${escapeHtml(t.name)}</a></li>` : "";
    })
    .filter(Boolean)
    .join("\n");
  return items ? `<div class="term-card__temples"><h4>Seen at</h4><ul>${items}</ul></div>` : "";
}

function seeAlsoHtml(term, ctx, byId) {
  const items = (term.see_also || [])
    .map((id) => {
      const other = byId.get(id);
      return other ? `<li><a href="${ctx.rel}glossary.html#term-${escapeHtml(other.id)}">${escapeHtml(other.term)}</a></li>` : "";
    })
    .filter(Boolean)
    .join("\n");
  return items ? `<div class="term-card__see-also"><h4>See also</h4><ul>${items}</ul></div>` : "";
}

function termCard(term, ctx, byId) {
  const shortHtml = isClaim(term.short)
    ? claim(term.short, ctx, { tag: "p", className: "term-card__short" })
    : `<p class="term-card__short">${unverified(ctx)}</p>`;
  const longHtml = claimsList(term.long, ctx);
  const odiaHtml = term.odia ? ` <span lang="or" class="term-card__odia">${escapeHtml(term.odia)}</span>` : "";
  const elementLink = term.element_id
    ? `<p class="term-card__element"><a href="${ctx.rel}academy.html#${escapeHtml(term.element_id)}">See this part in the Academy →</a></p>`
    : "";

  return `<li class="term-card" data-search="${escapeHtml(searchText(term))}" data-letter="${escapeHtml(firstLetter(term.term))}">
    <details id="term-${escapeHtml(term.id)}">
      <summary>${escapeHtml(term.term)}${odiaHtml}</summary>
      ${shortHtml}
      ${longHtml}
      ${templesListHtml(term, ctx)}
      ${seeAlsoHtml(term, ctx, byId)}
      ${elementLink}
    </details>
  </li>`;
}

function emptyState(ctx) {
  return `<div class="glossary-empty">
    <p>We don't have enough checked terms yet. Our researchers are still working through the
    accepted sources — see our <a href="${ctx.rel}about.html#methodology">methodology</a>.</p>
  </div>`;
}

export function renderGlossary(ctx) {
  const terms = [...(ctx.data.glossary.terms || [])].sort((a, b) => a.term.localeCompare(b.term));
  const byId = new Map(terms.map((t) => [t.id, t]));
  const lettersPresent = new Set(terms.map((t) => firstLetter(t.term)));

  const controlsHtml = terms.length
    ? `<div class="glossary-controls">
        <div class="glossary-search">
          <label for="glossary-search-input">Search terms</label>
          <input type="search" id="glossary-search-input" placeholder="e.g. gandi, tower, deity…" autocomplete="off">
        </div>
        <div class="glossary-alphabet" role="group" aria-label="Filter by first letter">
          <button type="button" class="glossary-alphabet__btn" data-letter="" aria-pressed="true">All</button>
          ${ALPHABET.map(
            (l) =>
              `<button type="button" class="glossary-alphabet__btn" data-letter="${l}" aria-pressed="false"${
                lettersPresent.has(l) ? "" : " disabled"
              }>${l}</button>`,
          ).join("\n")}
        </div>
        <p class="glossary-count" id="glossary-count" aria-live="polite">${terms.length} term${terms.length === 1 ? "" : "s"} shown</p>
      </div>
      <ul class="glossary-list" id="glossary-list">
        ${terms.map((t) => termCard(t, ctx, byId)).join("\n")}
      </ul>`
    : emptyState(ctx);

  const bodyHtml = `
<section class="section page-intro">
  <h1>Glossary</h1>
  <p>The Odia and Sanskrit words used for the parts of a Kalinga temple, in plain English.</p>
</section>
<section class="glossary" aria-label="Architectural terms">
  ${controlsHtml}
</section>
${sourcesList(ctx, { legend: true })}
`;

  return page(ctx, {
    title: "Glossary",
    description: "A searchable glossary of the Odia and Sanskrit words used for Odisha's temple architecture.",
    bodyHtml,
    headExtra: `<link rel="stylesheet" href="${ctx.assetRel}css/pages/glossary.css">`,
    scripts: ["js/glossary.js"],
  });
}
