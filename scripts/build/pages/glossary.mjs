// Glossary page: searchable, alphabetised list of architectural terms (glossary.json).
// With JS off, the page is simply the full accessible definition list.
// With zero terms (today), it renders an honest "being written" state without empty search UI.

import { escapeHtml } from "../lib/html.mjs";
import { claim, claimsList, unverified, sourcesList, isClaim } from "../lib/components.mjs";
import { page } from "../lib/layout.mjs";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function firstLetter(term) {
  const c = (term || "").trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : "#";
}

function searchText(term) {
  const parts = [
    term.term,
    term.plain_name,
    term.odia,
    term.short?.text,
    term.what?.text,
    ...(Array.isArray(term.long) ? term.long.map((c) => c?.text) : []),
  ];
  return parts.filter(Boolean).join(" ").toLowerCase();
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
      const label = other ? other.term : id;
      return `<li><a href="#term-${escapeHtml(id)}">${escapeHtml(label)}</a></li>`;
    })
    .filter(Boolean)
    .join("\n");
  return items ? `<div class="term-card__see-also"><h4>See also</h4><ul>${items}</ul></div>` : "";
}

function termCard(term, ctx, byId) {
  const shortClaim = isClaim(term.short) ? term.short : null;
  const whatClaim = isClaim(term.what) ? term.what : null;

  const shortHtml = shortClaim
    ? claim(shortClaim, ctx, { tag: "p", className: "term-card__short" })
    : "";
  const whatHtml = whatClaim
    ? claim(whatClaim, ctx, { tag: "p", className: "term-card__what" })
    : "";
  const longHtml = term.long ? claimsList(term.long, ctx, { className: "term-card__long" }) : "";
  const fallbackHtml = !shortHtml && !whatHtml && !longHtml
    ? `<p class="term-card__unverified">${unverified(ctx)}</p>`
    : "";

  const plainNameHtml = term.plain_name
    ? ` <span class="term-card__plain">(${escapeHtml(term.plain_name)})</span>`
    : "";
  const odiaHtml = term.odia
    ? ` <span lang="or" class="term-card__odia">${escapeHtml(term.odia)}</span>`
    : "";

  let elementLink = "";
  if (term.element_id) {
    const el =
      ctx.data.elementsById?.get(term.element_id) ||
      (ctx.data.elements?.elements || []).find((e) => e.id === term.element_id);
    const elName = el?.name || term.element_id;
    elementLink = `<p class="term-card__element"><a href="${ctx.rel}academy.html#${escapeHtml(term.element_id)}">See ${escapeHtml(elName)} in the Academy →</a></p>`;
  }

  return `<div class="term-card" id="term-${escapeHtml(term.id)}" data-search="${escapeHtml(searchText(term))}" data-letter="${escapeHtml(firstLetter(term.term))}">
    <dt class="term-card__term">
      <dfn class="term-card__name">${escapeHtml(term.term)}</dfn>${plainNameHtml}${odiaHtml}
    </dt>
    <dd class="term-card__def">
      ${shortHtml}
      ${whatHtml}
      ${longHtml}
      ${fallbackHtml}
      ${templesListHtml(term, ctx)}
      ${seeAlsoHtml(term, ctx, byId)}
      ${elementLink}
    </dd>
  </div>`;
}

function emptyState(ctx) {
  return `<div class="glossary-empty">
    <p class="lead">We are currently compiling and verifying architectural terms for Kalinga temple architecture.</p>
    <p>A searchable A–Z glossary of Odia and Sanskrit terms — describing the parts, shapes, and features of Odisha's temples — will appear here once each definition is verified against published academic sources.</p>
    <p>In the meantime, you can explore the <a href="${ctx.rel}timeline.html">Timeline</a> or visit the <a href="${ctx.rel}academy.html">Academy</a> to see temple structures in detail. Read about our research and fact-checking standards in our <a href="${ctx.rel}about.html#methodology">methodology</a>.</p>
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
        <p class="glossary-count" id="glossary-count" aria-live="polite" aria-atomic="true">${terms.length} term${terms.length === 1 ? "" : "s"} shown</p>
        <div class="glossary-no-results" id="glossary-no-results" hidden>
          <p>No matching terms found. Try clearing your search or picking another letter.</p>
          <button type="button" class="button button--secondary" id="glossary-reset-btn">Clear search</button>
        </div>
      </div>
      <dl class="glossary-list" id="glossary-list">
        ${terms.map((t) => termCard(t, ctx, byId)).join("\n")}
      </dl>`
    : emptyState(ctx);

  const bodyHtml = `
<section class="section page-intro">
  <h1>Glossary</h1>
  <p class="lead">The Odia and Sanskrit words used for the parts of a Kalinga temple, in plain English.</p>
</section>
<section class="section glossary" aria-label="Architectural terms">
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
