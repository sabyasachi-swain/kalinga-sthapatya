// Compare page: two temples side by side. A default pair (first two temples by sort_year) is
// fully server-rendered so the page works with JS off; js/compare.js swaps either side using an
// embedded JSON island of pre-rendered, already-approved fragments (built here, never re-fetched
// or re-derived client-side) — see design-system skill "Compare" + implementation notes §A7.

import { escapeHtml } from "../lib/html.mjs";
import { claim, claimsList, unverified, sourcesList, inlineSvgAsset, isClaim } from "../lib/components.mjs";
import { page } from "../lib/layout.mjs";
import { heightDifferenceSentence } from "../lib/size.mjs";

function templeHeightM(temple) {
  return typeof temple?.sections?.size?.height_m === "number" ? temple.sections.size.height_m : null;
}

function silhouetteMarkup(temple, ctx) {
  const id = temple.media?.silhouette;
  const inline = id ? inlineSvgAsset(id, ctx) : null;
  if (!inline) return null;
  return inline.svg.replace("<svg", `<svg width="100%" height="100%" preserveAspectRatio="xMidYMax meet"`);
}

function factRow(label, c, ctx) {
  const value = isClaim(c) ? claim(c, ctx, { tag: "span", useValue: true }) : unverified(ctx);
  return `<div class="compare-panel__fact"><dt>${escapeHtml(label)}</dt><dd>${value}</dd></div>`;
}

function panelHtml(temple, ctx) {
  const facts = `<dl class="compare-panel__facts">
    ${factRow("Date", temple.facts?.date, ctx)}
    ${factRow("Dynasty", temple.facts?.dynasty, ctx)}
    ${factRow("Height", temple.facts?.height, ctx)}
    ${factRow("Deity", temple.facts?.deity, ctx)}
    ${factRow("Temple type", temple.facts?.temple_type, ctx)}
  </dl>`;
  const specialClaims = (temple.sections?.special || []).slice(0, 3);
  const specialHtml = claimsList(specialClaims, ctx);
  return `<a class="compare-panel__link" href="${ctx.rel}${escapeHtml(temple.page)}">${escapeHtml(temple.name)}</a>
    ${facts}
    ${specialHtml ? `<div class="compare-panel__special"><h3>What's special</h3>${specialHtml}</div>` : ""}`;
}

function barsHtml(templeA, templeB, ctx) {
  const heights = [templeA, templeB].map(templeHeightM).filter((h) => typeof h === "number");
  const maxM = heights.length ? Math.max(...heights) : null;

  function column(temple, slot) {
    const heightM = temple ? templeHeightM(temple) : null;
    const pct = typeof heightM === "number" && maxM ? Math.max((heightM / maxM) * 100, 4) : null;
    const markup = temple ? silhouetteMarkup(temple, ctx) : null;
    const fillContent = markup || `<div class="compare-bars__fallback" aria-hidden="true"></div>`;
    return `<div class="compare-bars__col" data-bar-slot="${slot}">
      <div class="compare-bars__track">
        ${pct !== null ? `<div class="compare-bars__fill" style="height:${pct.toFixed(1)}%">${fillContent}</div>` : ""}
      </div>
      <p class="compare-bars__label">${temple ? escapeHtml(temple.name) : ""}</p>
    </div>`;
  }

  return `<div class="compare-bars" id="compare-bars" aria-hidden="true">${column(templeA, "a")}${column(templeB, "b")}</div>`;
}

function templeOptionsHtml(temples, selectedId) {
  return temples
    .map((t) => `<option value="${escapeHtml(t.id)}"${t.id === selectedId ? " selected" : ""}>${escapeHtml(t.name)}</option>`)
    .join("\n");
}

// Escapes "<" so the embedded JSON payload can never be mistaken for markup (e.g. a stray
// "</script>" inside pre-rendered fragment HTML) — a standard technique for JSON-in-<script>.
function safeJsonForScript(obj) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

function emptyState(ctx) {
  return `<section class="section page-intro">
  <h1>Compare temples</h1>
  <p>We need at least two temples with checked facts before this tool can compare them side by
  side. Come back once more research has been checked — see our
  <a href="${ctx.rel}about.html#methodology">methodology</a>.</p>
</section>`;
}

export function renderCompare(ctx) {
  const temples = [...(ctx.data.temples.temples || [])].sort((a, b) => (a.sort_year ?? 0) - (b.sort_year ?? 0));

  if (temples.length < 2) {
    return page(ctx, {
      title: "Compare",
      description: "Compare two Odisha temples side by side.",
      bodyHtml: emptyState(ctx),
    });
  }

  // Render every temple's panel fragment up front, so citations from every temple that JS could
  // swap in (not just the default pair) are collected before the shared sources list is built.
  const panels = new Map();
  const silhouettes = new Map();
  for (const t of temples) {
    panels.set(t.id, panelHtml(t, ctx));
    silhouettes.set(t.id, silhouetteMarkup(t, ctx));
  }

  const defaultA = temples[0];
  const defaultB = temples[1];

  const islandTemples = temples.map((t) => ({
    id: t.id,
    name: t.name,
    heightM: templeHeightM(t),
    panelHtml: panels.get(t.id),
    silhouetteMarkup: silhouettes.get(t.id),
  }));

  const heightA = templeHeightM(defaultA);
  const heightB = templeHeightM(defaultB);
  const sentenceHtml =
    heightA !== null && heightB !== null
      ? heightDifferenceSentence({ heightM: heightA, label: defaultA.name }, { heightM: heightB, label: defaultB.name })
      : unverified(ctx, "Height not yet verified for one or both temples — no size comparison yet");

  const bodyHtml = `
<section class="section page-intro">
  <h1>Compare temples</h1>
  <p>Pick two temples to see them side by side — height, date, dynasty, deity and what makes each one special.</p>
</section>
<section class="section compare" aria-label="Temple comparison">
  <form class="compare-form" aria-label="Choose temples to compare">
    <div class="compare-form__field">
      <label for="compare-select-a">Temple A</label>
      <select id="compare-select-a">${templeOptionsHtml(temples, defaultA.id)}</select>
    </div>
    <div class="compare-form__field">
      <label for="compare-select-b">Temple B</label>
      <select id="compare-select-b">${templeOptionsHtml(temples, defaultB.id)}</select>
    </div>
  </form>

  ${barsHtml(defaultA, defaultB, ctx)}
  <p class="compare-sentence" id="compare-sentence" aria-live="polite">${sentenceHtml}</p>

  <div class="compare-panels">
    <div class="compare-panel" id="compare-panel-a">${panels.get(defaultA.id)}</div>
    <div class="compare-panel" id="compare-panel-b">${panels.get(defaultB.id)}</div>
  </div>
</section>
${sourcesList(ctx, { legend: true })}
<script type="application/json" id="compare-data">${safeJsonForScript({ temples: islandTemples })}</script>
`;

  return page(ctx, {
    title: "Compare",
    description: "Compare two Odisha temples side by side — height, date, dynasty and what makes each special.",
    bodyHtml,
    headExtra: `<link rel="stylesheet" href="${ctx.assetRel}css/pages/compare.css">`,
    scripts: ["js/compare.js"],
  });
}
