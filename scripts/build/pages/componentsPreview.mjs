// Dev-only component gallery for QA. Only ever built to dev/preview/ (see scripts/build.mjs),
// using dev/fixtures/*.json. Never linked from production pages, never built to the repo root.

import { escapeHtml } from "../lib/html.mjs";
import { badge, claim, unverified, section, figure, sourcesList } from "../lib/components.mjs";
import { page } from "../lib/layout.mjs";

export function renderComponentsPreview(ctx) {
  const temple = ctx.data.templesById.get("fixture-temple-a");

  const badges = Object.keys(ctx.config.evidenceTiers)
    .map((tier) => `<li>${badge(tier, ctx)}</li>`)
    .join("\n");

  const claimsDemo = `
    <h3>Established</h3>
    ${claim(temple.facts.date, ctx)}
    <h3>Scholarly</h3>
    ${claim(temple.facts.dynasty, ctx)}
    <h3>Debated (with note)</h3>
    ${claim(temple.facts.deity, ctx)}
    <h3>Catalogue-only + human_approved</h3>
    ${claim(temple.facts.temple_type, ctx)}
    <h3>Null fact → unverified</h3>
    <p>${unverified(ctx)}</p>
  `;

  const figuresDemo = `
    <h3>Approved SVG (inline)</h3>
    ${figure("V-FIX1", ctx, { aspect: "1 / 1", className: "preview-figure" })}
    <h3>Approved raster</h3>
    ${figure("V-FIX2", ctx, { aspect: "4 / 3", className: "preview-figure" })}
    <h3>Placeholder status</h3>
    ${figure("V-FIX3", ctx, { aspect: "4 / 3", className: "preview-figure" })}
    <h3>Rejected status (still renders as placeholder)</h3>
    ${figure("V-FIX4", ctx, { aspect: "4 / 3", className: "preview-figure" })}
    <h3>Delivered status (not yet approved)</h3>
    ${figure("V-FIX5", ctx, { aspect: "4 / 3", className: "preview-figure" })}
    <h3>CC-licensed photo</h3>
    ${figure("P-fixture-cc-photo", ctx, { aspect: "3 / 2", className: "preview-figure" })}
    <h3>Missing id entirely (never crashes)</h3>
    ${figure("V-DOES-NOT-EXIST", ctx, { aspect: "4 / 3", className: "preview-figure" })}
  `;

  const buttonsDemo = `
    <button class="button button--primary" type="button">Primary button</button>
    <button class="button button--secondary" type="button">Secondary button</button>
  `;

  const cardDemo = `
    <div class="card-grid">
      <article class="card">
        ${figure("V-FIX2", ctx, { aspect: "4 / 3", figClassName: "card__figure" })}
        <h3 class="card__title"><a class="card__link" href="#components">FIXTURE Card Title</a></h3>
        <p>Lorem ipsum card body text for layout QA only. ${badge("scholarly", ctx)}</p>
      </article>
    </div>
  `;

  const accordionDemo = `
    <details id="fixture-accordion">
      <summary>FIXTURE accordion heading (click, or open via #fixture-accordion)</summary>
      <p>Lorem ipsum accordion body content, revealed on expand. Works with JavaScript disabled.</p>
    </details>
  `;

  const tooltipDemo = `<p>Evidence badges above are also the tooltip/term component: click or focus + Enter opens the
    explanation, Esc closes it.</p>`;

  const infoPanelDemo = `
    <button type="button" class="button button--secondary" data-panel-open="fixture-panel">Open info panel</button>
    <aside id="fixture-panel" class="info-panel" role="dialog" aria-modal="false" aria-labelledby="fixture-panel-heading" hidden>
      <div class="info-panel__inner">
        <button type="button" class="info-panel__close" data-panel-close="fixture-panel" aria-label="Close">×</button>
        <h3 id="fixture-panel-heading">FIXTURE Info Panel</h3>
        <p>Lorem ipsum panel content. Focus moves here on open, and returns to the trigger button on close.</p>
      </div>
    </aside>
  `;

  const hotspotDemo = `
    <div class="hotspot-demo">
      <div class="hotspot-demo__figure">
        ${figure("V-FIX2", ctx, { aspect: "4 / 3" })}
        <button type="button" class="hotspot" style="left:30%;top:20%;width:40%;height:30%" aria-label="FIXTURE Gandi-like Part">
        </button>
      </div>
      <ul class="hotspot-demo__list">
        <li><button type="button" class="hotspot-list-item">FIXTURE Gandi-like Part</button></li>
      </ul>
    </div>
  `;

  const bodyHtml = `
<section class="section page-intro">
  <h1>Component gallery (dev preview)</h1>
  <p>Built from <code>dev/fixtures/*.json</code> — everything on this page is obviously fake and is
    never part of the production build. Use this page to QA every shared component in isolation.</p>
</section>
${section({ id: "badges", heading: "Evidence badges", body: `<ul class="badge-list">${badges}</ul>`, force: true })}
${section({ id: "claims", heading: "Claims + citations", body: claimsDemo, force: true })}
${section({ id: "figures", heading: "Figures / placeholders", body: figuresDemo, force: true })}
${section({ id: "buttons", heading: "Buttons", body: buttonsDemo, force: true })}
${section({ id: "cards", heading: "Cards", body: cardDemo, force: true })}
${section({ id: "accordion", heading: "Accordion (native details)", body: accordionDemo, force: true })}
${section({ id: "tooltip", heading: "Tooltip", body: tooltipDemo, force: true })}
${section({ id: "info-panel", heading: "Info panel", body: infoPanelDemo, force: true })}
${section({ id: "hotspots", heading: "Hotspots", body: hotspotDemo, force: true })}
${sourcesList(ctx)}
`;

  return page(ctx, {
    title: "Component gallery",
    description: "Dev-only QA gallery of every shared component, rendered from fixture data.",
    bodyHtml,
  });
}
