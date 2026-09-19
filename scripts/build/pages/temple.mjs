// Temple page template — one render function, shared by every temple in data/temples.json
// (registry.mjs adds one page per temple, outPath = temple.page). No facts are hardcoded here:
// every date, height, name-attribution and meaning comes from the temple object passed in.

import { escapeHtml } from "../lib/html.mjs";
import { section, figure, claim, claimsList, unverified, sourcesList, isClaim } from "../lib/components.mjs";
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

// ---------------------------------------------------------------------------- parts accordion

function elementLinkHtml(elementId, ctx) {
  const el = ctx.data.elementsById.get(elementId);
  if (!el) return "";
  const term = (ctx.data.glossary.terms || []).find((t) => t.element_id === elementId);
  const href = term ? `${ctx.rel}glossary.html#term-${escapeHtml(term.id)}` : `${ctx.rel}academy.html#${escapeHtml(elementId)}`;
  return `<li><a href="${href}">${escapeHtml(el.name)}</a></li>`;
}

function partsSection(temple, ctx) {
  const parts = temple.sections?.parts;
  const introHtml = parts ? claimsList(parts.intro, ctx) : "";
  const elementItems = parts ? (parts.element_ids || []).map((id) => elementLinkHtml(id, ctx)).filter(Boolean).join("\n") : "";
  const diagramHtml = parts ? figure(temple.media?.parts_diagram, ctx, { aspect: "3 / 4", figClassName: "temple-parts__figure" }) : "";
  const body = parts ? `${diagramHtml}${introHtml}${elementItems ? `<ul class="temple-parts__list">${elementItems}</ul>` : ""}` : "";
  return section({ id: "parts", heading: "Parts of this temple", body });
}

// ---------------------------------------------------------------------------- simple claim-list accordions

function whyBuiltSection(temple, ctx) {
  return section({ id: "why-built", heading: "Why was it built?", body: claimsList(temple.sections?.why_built, ctx) });
}

function constructionSection(temple, ctx) {
  return section({ id: "construction", heading: "How was it built?", body: claimsList(temple.sections?.construction, ctx) });
}

function specialSection(temple, ctx) {
  return section({ id: "special", heading: "What's special about it?", body: claimsList(temple.sections?.special, ctx) });
}

function influencesSection(temple, ctx) {
  return section({ id: "influences", heading: "What influenced its design?", body: claimsList(temple.sections?.influences, ctx) });
}

// ---------------------------------------------------------------------------- size accordion

function sizeSection(temple, ctx) {
  const size = temple.sections?.size;
  const heightM = typeof size?.height_m === "number" ? size.height_m : null;

  if (heightM === null) {
    return section({
      id: "size",
      heading: "How big is it?",
      force: true,
      body: `<p>${unverified(ctx, "Height not yet verified")}</p>`,
    });
  }

  const items = [
    { heightM, silhouetteAssetId: temple.media?.silhouette, label: temple.name, detail: temple.facts?.height?.value || null },
    { heightM: sizeComparisonAssumptions.humanHeightM, silhouetteAssetId: "V-51", label: "An adult person", detail: `about ${sizeComparisonAssumptions.humanHeightM} m` },
    {
      heightM: sizeComparisonAssumptions.fiveStoreyBuildingM,
      silhouetteAssetId: "V-52",
      label: "A five-storey building",
      detail: `a five-storey building is about ${sizeComparisonAssumptions.fiveStoreyBuildingM} m — shown here for scale`,
    },
  ];
  const drawing = scaleDrawing(items, ctx);
  const captions = scaleDrawingCaptions(items);
  const sentence = heightComparisonSentence(heightM, sizeComparisonAssumptions.fiveStoreyBuildingM, "a five-storey building");
  const sentenceHtml = sentence ? `<p class="scale-drawing__sentence">${escapeHtml(sentence)}</p>` : "";
  const noteHtml = isClaim(size?.note) ? claim(size.note, ctx, { tag: "p", className: "temple-size__note" }) : "";

  return section({
    id: "size",
    heading: "How big is it?",
    force: true,
    body: `<div class="scale-drawing__wrap">${drawing || ""}</div>${captions}${sentenceHtml}${noteHtml}`,
  });
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
    const accordions = [
      partsSection(temple, ctx),
      whyBuiltSection(temple, ctx),
      constructionSection(temple, ctx),
      specialSection(temple, ctx),
      sizeSection(temple, ctx),
      influencesSection(temple, ctx),
    ]
      .filter(Boolean)
      .join("\n");

    const bodyHtml = `
${heroSection(temple, ctx)}
<div class="temple-page-body">
  ${quickFactsStrip(temple, ctx)}
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
    });
  };
}
