// Temple page template — one render function, shared by every temple in data/temples.json
// (registry.mjs adds one page per temple, outPath = temple.page). No facts are hardcoded here:
// every date, height, name-attribution and meaning comes from the temple object passed in.

import { escapeHtml } from "../lib/html.mjs";
import { accordionSection, figure, claim, claimsList, unverified, sourcesList, isClaim } from "../lib/components.mjs";
import { page } from "../lib/layout.mjs";
import { scaleDrawing, scaleDrawingCaptions, heightComparisonSentence } from "../lib/size.mjs";
import { sizeComparisonAssumptions } from "../config.mjs";

// Convention-only lookup: the isometric illustration for each temple, keyed by temple id. These
// are asset *ids* (wiring — the same kind of thing as V-51/V-52 in config.mjs), not facts about a
// temple. temples.json's `media` object doesn't have an `isometric` key yet; this table fills the
// gap until the schema grows one, without touching data/. A temple's own `media.isometric`, if
// ever added to the data, always wins over this table.
const ISOMETRIC_BY_TEMPLE_ID = {
  parasuramesvara: "V-63",
  mukteshwar: "V-68",
  lingaraj: "V-73",
  "jagannath-puri": "V-78",
  konark: "V-84",
};

function templeIsometricId(temple) {
  return temple.media?.isometric || ISOMETRIC_BY_TEMPLE_ID[temple.id] || null;
}

// ---------------------------------------------------------------------------- hero

function heroSection(temple, ctx) {
  const heroFigure = figure(temple.media?.hero, ctx, {
    aspect: "16 / 9",
    figClassName: "temple-hero__figure",
    eager: true,
    fallbackAlt: `${temple.name} — hero illustration`,
  });
  const dateClaim = temple.facts?.date;
  const periodHtml =
    isClaim(dateClaim) && (dateClaim.value || dateClaim.text)
      ? `<p class="temple-hero__period">${escapeHtml(dateClaim.value || dateClaim.text)}</p>`
      : "";
  const oneLinerHtml = isClaim(temple.one_liner)
    ? claim(temple.one_liner, ctx, { tag: "p", className: "temple-hero__hook" })
    : `<p class="temple-hero__hook">${unverified(ctx)}</p>`;

  return `<section class="temple-hero">
    ${heroFigure}
    <div class="temple-hero__body">
      <h1>${escapeHtml(temple.name)}</h1>
      ${periodHtml}
      ${oneLinerHtml}
    </div>
  </section>`;
}

// ---------------------------------------------------------------------------- quick facts

function quickFactsStrip(temple, ctx) {
  const rows = [
    ["Dynasty", temple.facts?.dynasty],
    ["Date", temple.facts?.date],
    ["Height", temple.facts?.height],
    ["Deity", temple.facts?.deity],
    ["Temple type", temple.facts?.temple_type],
  ];
  const items = rows
    .map(([label, c]) => {
      const value = isClaim(c) ? claim(c, ctx, { tag: "span", useValue: true }) : unverified(ctx);
      return `<div class="quick-facts__item"><dt>${escapeHtml(label)}</dt><dd>${value}</dd></div>`;
    })
    .join("\n");
  return `<dl class="quick-facts" aria-label="Quick facts">${items}</dl>`;
}

// ---------------------------------------------------------------------------- 3D / isometric

function visual3dBlock(temple, ctx) {
  const sketchfab = temple.sketchfab;
  if (sketchfab && sketchfab.embed_url) {
    const authorHtml = sketchfab.author_url
      ? `<a href="${escapeHtml(sketchfab.author_url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(sketchfab.author || "the model's author")}</a>`
      : escapeHtml(sketchfab.author || "the model's author");
    const licenseHtml = sketchfab.license_url
      ? `<a href="${escapeHtml(sketchfab.license_url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(sketchfab.license || "its licence")}</a>`
      : escapeHtml(sketchfab.license || "");
    // Native <details> + loading="lazy": closed by default, so the browser has nothing laid out
    // to measure distance-from-viewport against and does not fetch the iframe until the reader
    // opens the panel — a "click-to-load facade" that needs no JavaScript at all.
    return `<div class="sketchfab-embed">
      <details>
        <summary>Load interactive 3D model${sketchfab.title ? ` — “${escapeHtml(sketchfab.title)}”` : ""}</summary>
        <iframe title="${escapeHtml(temple.name)} — interactive 3D model" loading="lazy" src="${escapeHtml(sketchfab.embed_url)}" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen></iframe>
      </details>
      <p class="sketchfab-embed__credit">3D model by ${authorHtml}, licensed ${licenseHtml}.
        <a href="${escapeHtml(sketchfab.model_url)}" rel="noopener noreferrer" target="_blank">View on Sketchfab →</a></p>
    </div>`;
  }
  const isoId = templeIsometricId(temple);
  if (isoId) {
    return `<div class="temple-isometric">${figure(isoId, ctx, {
      aspect: "4 / 3",
      figClassName: "temple-isometric__figure",
      fallbackAlt: `${temple.name} — isometric illustration`,
    })}</div>`;
  }
  return "";
}

// ---------------------------------------------------------------------------- see how it's built

// Generic "build sequence" block, driven entirely by data/media.json — any temple with 2+ approved
// `role:"build-sequence"` assets gets this section; nothing here is temple-specific. First used by
// Parasuramesvara (V-64A/B/C + V-64V).
function buildSequenceAssets(temple, ctx) {
  const assets = ctx.data.media.assets || [];
  const frames = assets
    .filter((a) => a.temple_id === temple.id && a.role === "build-sequence" && a.status === "approved")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const video = assets.find((a) => a.temple_id === temple.id && a.role === "build-video" && a.status === "approved") || null;
  return { frames, video };
}

function buildSequenceSection(temple, ctx) {
  const { frames, video } = buildSequenceAssets(temple, ctx);
  if (frames.length < 2) return "";

  const first = frames[0];
  const aspectStyle = first.width && first.height ? ` style="aspect-ratio:${first.width} / ${first.height}"` : "";

  const tabs = frames
    .map(
      (f, i) =>
        `<button type="button" class="build-sequence__tab" data-frame-index="${i}" aria-pressed="${i === 0 ? "true" : "false"}">${escapeHtml(
          f.label || `View ${i + 1}`,
        )}</button>`,
    )
    .join("\n");

  const frameFigures = frames
    .map(
      (f, i) => `<figure class="build-sequence__frame${i === 0 ? " is-active" : ""}" data-frame-index="${i}">
        <img src="${ctx.assetRel}${escapeHtml(f.path)}" width="${f.width || ""}" height="${f.height || ""}" loading="${
          i === 0 ? "eager" : "lazy"
        }" alt="${escapeHtml(f.alt || "")}">
        <figcaption>AI-generated illustration</figcaption>
      </figure>`,
    )
    .join("\n");

  let videoHtml = "";
  if (video) {
    const posterAsset = video.poster ? ctx.data.mediaById.get(video.poster) : null;
    const posterAttr = posterAsset ? ` poster="${ctx.assetRel}${escapeHtml(posterAsset.path)}"` : "";
    videoHtml = `<div class="build-sequence__video">
      <video controls preload="none" playsinline${posterAttr} width="${video.width || ""}" height="${video.height || ""}">
        <source src="${ctx.assetRel}${escapeHtml(video.path)}" type="video/mp4">
      </video>
      <p class="build-sequence__video-caption">AI-generated animation</p>
    </div>`;
  }

  return `<section class="section section--warm build-sequence" id="build-sequence" aria-labelledby="build-sequence-heading">
    <h2 id="build-sequence-heading">See how it's built</h2>
    <div class="build-sequence__card">
      <div class="build-sequence__switcher" role="group" aria-label="Choose a view of the build sequence">
        ${tabs}
      </div>
      <div class="build-sequence__frames" data-build-sequence-frames${aspectStyle}>
        ${frameFigures}
      </div>
    </div>
    ${videoHtml}
  </section>`;
}

// ---------------------------------------------------------------------------- parts accordion

// Parts pills only link somewhere real: to the glossary term for that element, if one exists yet.
// The Academy doesn't exist as a page yet, so we never link to an anchor that isn't there —
// unlinked parts render as plain (non-interactive) chips instead.
function elementChipHtml(elementId, ctx) {
  const el = ctx.data.elementsById.get(elementId);
  if (!el) return "";
  const term = (ctx.data.glossary.terms || []).find((t) => t.element_id === elementId);
  if (term) {
    return `<li><a class="temple-parts__chip temple-parts__chip--link" href="${ctx.rel}glossary.html#term-${escapeHtml(term.id)}">${escapeHtml(el.name)}</a></li>`;
  }
  return `<li><span class="temple-parts__chip">${escapeHtml(el.name)}</span></li>`;
}

function partsBody(temple, ctx) {
  const parts = temple.sections?.parts;
  if (!parts) return "";
  const introHtml = claimsList(parts.intro, ctx);
  const elementItems = (parts.element_ids || []).map((id) => elementChipHtml(id, ctx)).filter(Boolean).join("\n");
  const diagramHtml = figure(temple.media?.parts_diagram, ctx, { aspect: "3 / 4", figClassName: "temple-parts__figure" });
  const textHtml = `${introHtml}${elementItems ? `<ul class="temple-parts__list">${elementItems}</ul>` : ""}`;
  return `<div class="temple-parts__layout"><div class="temple-parts__text">${textHtml}</div>${diagramHtml}</div>`;
}

// ---------------------------------------------------------------------------- size accordion

function sizeBody(temple, ctx) {
  const size = temple.sections?.size;
  const heightM = typeof size?.height_m === "number" ? size.height_m : null;

  if (heightM === null) {
    return `<p>${unverified(ctx, "Height not yet verified")}</p>`;
  }

  const items = [
    { heightM, silhouetteAssetId: temple.media?.silhouette, label: temple.name, detail: temple.facts?.height?.value || null },
    {
      heightM: sizeComparisonAssumptions.humanHeightM,
      silhouetteAssetId: "V-51",
      label: "An adult person",
      detail: `about ${sizeComparisonAssumptions.humanHeightM} m`,
    },
    {
      heightM: sizeComparisonAssumptions.fiveStoreyBuildingM,
      silhouetteAssetId: "V-52",
      label: "A five-storey building",
      detail: `about ${sizeComparisonAssumptions.fiveStoreyBuildingM} m (an assumed height, shown for scale)`,
    },
  ];
  const drawing = scaleDrawing(items, ctx);
  const captions = scaleDrawingCaptions(items);
  const sentence = heightComparisonSentence(heightM, sizeComparisonAssumptions.fiveStoreyBuildingM, "a five-storey building");
  const sentenceHtml = sentence ? `<p class="scale-drawing__sentence">${escapeHtml(sentence)}</p>` : "";
  const noteHtml = isClaim(size?.note) ? claim(size.note, ctx, { tag: "p", className: "temple-size__note" }) : "";

  return `<div class="scale-drawing__wrap">${drawing || ""}</div>${captions}${sentenceHtml}${noteHtml}`;
}

// ---------------------------------------------------------------------------- schema.org

function templeSchema(temple, ctx) {
  const canonical = (() => {
    try {
      return new URL(temple.page, ctx.config.siteUrl).toString();
    } catch {
      return null;
    }
  })();
  const schema = {
    "@context": "https://schema.org",
    "@type": "LandmarksOrHistoricalBuildings",
    name: temple.name,
  };
  if (canonical) schema.url = canonical;
  if (isClaim(temple.one_liner)) schema.description = temple.one_liner.text;
  if (temple.location?.place) {
    schema.address = {
      "@type": "PostalAddress",
      addressLocality: temple.location.place,
      addressRegion: temple.location.district || undefined,
      addressCountry: "IN",
    };
  }
  if (typeof temple.location?.lat === "number" && typeof temple.location?.lng === "number") {
    schema.geo = { "@type": "GeoCoordinates", latitude: temple.location.lat, longitude: temple.location.lng };
  }
  return schema;
}

// ---------------------------------------------------------------------------- page

export function renderTemple(temple) {
  return function renderTemplePage(ctx) {
    // Each accordion is built from a plain body string first, so we can tell which ones actually
    // have approved content and open only the first of those (design-system Accordion: "first one
    // open"), whichever section that turns out to be for a given temple.
    // Chapter-style headings + a short subtitle (UI copy only — no facts) so the page reads like a
    // story to page through, not a research report.
    const accordionDefs = [
      { id: "parts", heading: "Meet the temple", subtitle: "The pieces that make it up, from base to top.", body: partsBody(temple, ctx) },
      { id: "why-built", heading: "Why was it built?", subtitle: "The story behind it.", body: claimsList(temple.sections?.why_built, ctx) },
      { id: "construction", heading: "How did they build it?", subtitle: "Stone, tools and centuries-old methods.", body: claimsList(temple.sections?.construction, ctx) },
      { id: "special", heading: "Look closer: the wow details", subtitle: "The details worth a second look.", body: claimsList(temple.sections?.special, ctx) },
      { id: "size", heading: "How big is it?", subtitle: "See it next to a person and a building.", body: sizeBody(temple, ctx), force: true },
      { id: "influences", heading: "Its temple family", subtitle: "Other temples that shaped its design.", body: claimsList(temple.sections?.influences, ctx) },
    ];
    const visibleAccordions = accordionDefs.filter((d) => d.force || (d.body && d.body.trim()));
    const accordions = visibleAccordions
      .map((d, i) => accordionSection({ ...d, open: i === 0 }))
      .filter(Boolean)
      .join("\n");

    const bodyHtml = `
${heroSection(temple, ctx)}
<div class="temple-page-body">
  ${quickFactsStrip(temple, ctx)}
</div>
${buildSequenceSection(temple, ctx)}
<div class="temple-page-body">
  ${visual3dBlock(temple, ctx)}
  <div class="temple-accordions">
    ${accordions}
  </div>
</div>
${sourcesList(ctx, { legend: true })}
`;

    return page(ctx, {
      title: temple.name,
      description: isClaim(temple.one_liner) ? temple.one_liner.text : `${temple.name} — a temple of Odisha.`,
      bodyHtml,
      headExtra: `<link rel="stylesheet" href="${ctx.assetRel}css/pages/temple.css">`,
      schema: templeSchema(temple, ctx),
      scripts: ["js/buildSequence.js"],
    });
  };
}
