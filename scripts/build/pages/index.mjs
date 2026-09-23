// Homepage. Section scaffolds render from data and hide themselves when that data is empty —
// today every data file is still empty, so the page is hero + nav + footer only, which is correct.

import { escapeHtml } from "../lib/html.mjs";
import { section, figure, inlineSvgAsset, claim, factOrUnverified, sourcesList, isClaim } from "../lib/components.mjs";
import { page } from "../lib/layout.mjs";

function heroVisual(ctx) {
  const build = inlineSvgAsset("V-10", ctx);
  const imageFigure = figure("V-11", ctx, { aspect: "16 / 9", figClassName: "hero-image", eager: true, decorative: true });

  if (!build) {
    // No approved build-up line drawing yet: just show the settled illustration slot (real image
    // once approved, placeholder box until then).
    return `<div class="hero-visual" aria-hidden="true">${imageFigure}</div>`;
  }

  let svg = build.svg.replace("<svg", `<svg class="hero-build__svg" aria-hidden="true"`);
  return `<div class="hero-visual hero-visual--building" aria-hidden="true">
    <div class="hero-build">${svg}</div>
    <div class="hero-visual__image">${imageFigure}</div>
  </div>`;
}

function templeTypesSection(ctx) {
  const types = ctx.data.academy.temple_types || [];
  if (!types.length) return "";
  const cards = types
    .map((t) => {
      const media = figure(t.media, ctx, { aspect: "4 / 3", figClassName: "card__figure" });
      // The whole card is clickable via a stretched pseudo-element on .card__link (see css/style.css),
      // but the link itself only wraps the title — an evidence badge below is an interactive <button>,
      // and HTML forbids nesting interactive controls inside an <a>.
      return `<article class="card">
        ${media}
        <h3 class="card__title">
          <a class="card__link" href="${ctx.rel}academy.html#${escapeHtml(t.id)}">${escapeHtml(t.name)}</a>
          <span class="card__subtitle">${escapeHtml(t.plain_name || "")}</span>
        </h3>
        ${claim(t.roof_shape, ctx, { tag: "p" }) || `<p class="claim">${factOrUnverified(t.roof_shape, ctx)}</p>`}
      </article>`;
    })
    .join("\n");
  return section({
    id: "temple-types",
    className: "section--warm",
    heading: "What is Kalinga Architecture?",
    body: `<div class="card-grid">${cards}</div>
    <p class="section__cta"><a href="${ctx.rel}academy.html">Visit the Academy →</a></p>`,
    force: true,
  });
}

function evolutionSection(ctx) {
  const eras = [...(ctx.data.timeline.eras || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (!eras.length) return "";
  // Headline first (it's what a reader scans for), a short period value under it, and no claim
  // notes here — this is a taster grid, not the place to read "why debated"; that's on Timeline.
  const items = eras
    .map((e) => {
      const periodClaim = isClaim(e.period) ? { ...e.period, note: null } : e.period;
      return `<li class="mini-timeline__item">
        <h3 class="mini-timeline__headline">${escapeHtml(e.headline || e.label)}</h3>
        <div class="mini-timeline__period">${factOrUnverified(periodClaim, ctx, { tag: "span", useValue: true })}</div>
      </li>`;
    })
    .join("\n");
  return section({
    id: "evolution-story",
    heading: "The Evolution Story",
    body: `<ol class="mini-timeline">${items}</ol>
    <p class="section__cta"><a href="${ctx.rel}timeline.html">See the full timeline →</a></p>`,
    force: true,
  });
}

function exploreOdishaSection(ctx) {
  const temples = ctx.data.temples.temples || [];
  if (!temples.length) return "";
  const erasById = new Map((ctx.data.timeline.eras || []).map((e) => [e.id, e]));
  const cards = temples
    .map((t) => {
      const media = figure(t.media?.hero, ctx, { aspect: "3 / 2", figClassName: "card__figure" });
      const era = erasById.get(t.era_id);
      const eraLabel = era?.label || "";
      const hookClaim = t.one_liner ? { ...t.one_liner, note: null } : null;
      return `<article class="card">
        ${media}
        <h3 class="card__title">
          <a class="card__link" href="${ctx.rel}${escapeHtml(t.page)}">${escapeHtml(t.name)}</a>
          ${eraLabel ? `<span class="card__subtitle">${escapeHtml(eraLabel)}</span>` : ""}
        </h3>
        ${claim(hookClaim, ctx, { tag: "p", className: "card__hook" })}
      </article>`;
    })
    .join("\n");
  return section({
    id: "explore-odisha",
    className: "section--warm",
    heading: "Explore Odisha",
    body: `<div class="card-grid">${cards}</div>
    <p class="section__cta"><a href="${ctx.rel}map.html">Open the full map →</a></p>`,
    force: true,
  });
}

function featuredTempleSection(ctx) {
  const temple = ctx.data.templesById.get("konark");
  if (!temple) return "";
  const media = figure(temple.media?.hero, ctx, { aspect: "3 / 2", figClassName: "featured-temple__figure" });
  const hook = claim(temple.one_liner, ctx, { tag: "p", className: "featured-temple__hook" });
  return section({
    id: "featured-temple",
    heading: "Featured Temple",
    body: `<div class="featured-temple">
      ${media}
      <div class="featured-temple__body">
        <h3 class="featured-temple__title">${escapeHtml(temple.name)}</h3>
        ${hook}
        <div class="featured-temple__action">
          <a class="button button--primary" href="${ctx.rel}${escapeHtml(temple.page)}">Explore this temple →</a>
        </div>
      </div>
    </div>`,
    force: true,
  });
}

export function renderIndex(ctx) {
  const bodyHtml = `
<div class="hero-band">
  <section class="hero">
    <div class="hero__content">
      <h1 class="hero__title">${escapeHtml(ctx.config.siteName)}<span class="hero__title-odia" lang="or">${escapeHtml(ctx.config.siteNameOdia)}</span></h1>
      <p class="hero__tagline">${escapeHtml(ctx.config.tagline)}</p>
      <div class="hero__actions">
        <a class="button button--primary" href="${ctx.rel}academy.html">Start Exploring</a>
        <a class="button button--secondary" href="${ctx.rel}timeline.html">See the Timeline</a>
      </div>
    </div>
    ${heroVisual(ctx)}
  </section>
</div>
${templeTypesSection(ctx)}
${evolutionSection(ctx)}
${exploreOdishaSection(ctx)}
${featuredTempleSection(ctx)}
${sourcesList(ctx, { legend: true })}
`;

  return page(ctx, {
    title: "Home",
    description: ctx.config.description,
    bodyHtml,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: ctx.config.siteName,
      url: ctx.config.siteUrl,
      description: ctx.config.description,
    },
  });
}
