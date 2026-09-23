// scripts/build/pages/timeline.mjs
// Timeline page: how temple design changed, era by era (timeline.json, ordered by `order`).
// Horizontal scroll-snap on wide screens, a plain vertical stack below and with JS off — CSS does
// the layout switch, js/timeline.js only adds button/arrow-key navigation, never hijacks scroll.

import { escapeHtml } from "../lib/html.mjs";
import { claim, claimsList, figure, unverified, sourcesList, isClaim } from "../lib/components.mjs";
import { page } from "../lib/layout.mjs";

function templesListHtml(era, ctx) {
  const items = (era.temples || [])
    .map((t) => {
      if (t.temple_id) {
        const temple = ctx.data.templesById.get(t.temple_id);
        if (temple) {
          return `<li><a href="${ctx.rel}${escapeHtml(temple.page)}">${escapeHtml(temple.name)}</a></li>`;
        }
      }
      return t.name ? `<li><span class="era-card__temple-item">${escapeHtml(t.name)}</span></li>` : "";
    })
    .filter(Boolean)
    .join("\n");
  return items
    ? `<div class="era-card__temples-wrap"><h3 class="era-card__temples-heading">Temples from this era</h3><ul class="era-card__temples">${items}</ul></div>`
    : "";
}

function eraCard(era, ctx, index, total) {
  const headingId = `era-${escapeHtml(era.id)}-heading`;
  const figureHtml = figure(era.media, ctx, { aspect: "4 / 3", figClassName: "era-card__figure" });
  const periodHtml = isClaim(era.period)
    ? claim(era.period, ctx, { tag: "p", className: "era-card__period" })
    : `<p class="era-card__period">${unverified(ctx)}</p>`;
  const dynastyHtml = isClaim(era.dynasty)
    ? claim(era.dynasty, ctx, { tag: "p", className: "era-card__dynasty" })
    : `<p class="era-card__dynasty">${unverified(ctx)}</p>`;
  const headlineHtml = era.headline ? `<p class="era-card__headline">${escapeHtml(era.headline)}</p>` : "";
  const designHtml = claimsList(era.design_change, ctx);
  const temples = templesListHtml(era, ctx);
  const kicker = `Era ${index + 1} of ${total}`;

  return `<li class="era-card" id="era-${escapeHtml(era.id)}">
    <article aria-labelledby="${headingId}">
      <header class="era-card__header">
        <p class="era-card__kicker">${escapeHtml(kicker)}</p>
        <h2 class="era-card__heading" id="${headingId}">${escapeHtml(era.label)}</h2>
        ${periodHtml}
        ${dynastyHtml}
      </header>
      ${figureHtml}
      <div class="era-card__body">
        ${headlineHtml}
        ${designHtml}
        ${temples}
      </div>
    </article>
  </li>`;
}

function emptyState(ctx) {
  return `<div class="timeline-empty">
    <p>We don't have enough checked facts yet to tell this story era by era. Our researchers are
    still working through the accepted sources — see our <a href="${ctx.rel}about.html#methodology">methodology</a>.</p>
  </div>`;
}

export function renderTimeline(ctx) {
  const eras = [...(ctx.data.timeline.eras || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const timelineBody = eras.length
    ? `<div class="timeline-nav" role="group" aria-label="Scroll the timeline">
        <button type="button" class="button button--secondary timeline-nav__prev" data-timeline-prev>
          <span aria-hidden="true">←</span> Earlier
        </button>
        <button type="button" class="button button--secondary timeline-nav__next" data-timeline-next>
          Later <span aria-hidden="true">→</span>
        </button>
      </div>
      <ol class="timeline-track" id="timeline-track" tabindex="0" aria-label="Temple design eras, oldest to newest">
        ${eras.map((e, i) => eraCard(e, ctx, i, eras.length)).join("\n")}
      </ol>`
    : emptyState(ctx);

  const bodyHtml = `
<section class="section page-intro">
  <h1>How temple design changed</h1>
  <p>Follow Odisha's temples era by era — what changed, who built it, and which temples still show it.</p>
</section>
<section class="timeline" aria-label="Temple design eras">
  ${timelineBody}
</section>
${sourcesList(ctx, { legend: true })}
`;

  return page(ctx, {
    title: "Timeline",
    description: "How Odisha's temple design changed across the centuries, era by era.",
    bodyHtml,
    headExtra: `<link rel="stylesheet" href="${ctx.assetRel}css/pages/timeline.css">`,
    scripts: ["js/timeline.js"],
  });
}
