// d:\Personal\AI_Experiment\kalinga-sthapatya\scripts\build\pages\temple.mjs
import { escapeHtml } from "../lib/html.mjs";
import { figure, claim, sourcesList, isClaim, unverified, inlineSvgAsset, namespaceSvgIds } from "../lib/components.mjs";
import { page } from "../lib/layout.mjs";
import { scaleDrawing, scaleDrawingCaptions, heightComparisonSentence } from "../lib/size.mjs";
import { sizeComparisonAssumptions } from "../config.mjs";
import { journeyRail, journeyStop, storyCard, passport, partsTour, videoFacade, resolveClaimPath, createRenderLedger } from "../lib/journey.mjs";
import { TEMPLE_TOURS, ISOMETRIC_BY_TEMPLE_ID } from "../journeyWiring.mjs";

function extractAllClaims(temple) {
  const claims = [];
  function walk(obj, path) {
    if (isClaim(obj)) {
      claims.push({ path, claim: obj });
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => walk(v, `${path}.${i}`));
    } else if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        walk(v, path ? `${path}.${k}` : k);
      }
    }
  }
  walk(temple, '');
  return claims;
}

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

export function renderTemple(temple) {
  return function renderTemplePage(ctx) {
    const ledger = createRenderLedger();
    const assets = ctx.data.media.assets || [];
    
    if (isClaim(temple.one_liner)) ledger.mark(temple.one_liner);

    // --- STOP 1: Meet the temple ---
    let meetMediaHtml = "";
    const buildSeq2 = assets.find(a => a.temple_id === temple.id && a.role === "build-sequence" && a.order === 2 && a.status === "approved");
    const isoId = temple.media?.isometric || ISOMETRIC_BY_TEMPLE_ID[temple.id];
    const heroId = temple.media?.hero;
    
    if (buildSeq2) meetMediaHtml = figure(buildSeq2.id, ctx, { figClassName: "journey-frame" });
    else if (isoId) meetMediaHtml = figure(isoId, ctx, { figClassName: "journey-frame" });
    else if (heroId) meetMediaHtml = figure(heroId, ctx, { figClassName: "journey-frame" });

    const introCards = (temple.sections?.parts?.intro || []).map(c => {
      ledger.mark(c);
      return storyCard(c, ctx);
    }).join("");
    
    const pRows = [
      { label: "When?", claim: temple.facts?.date },
      { label: "In whose time?", claim: temple.facts?.dynasty },
      { label: "For which god?", claim: temple.facts?.deity },
      { label: "Temple type?", claim: temple.facts?.temple_type }
    ];
    pRows.forEach(r => ledger.mark(r.claim));
    const passportHtml = passport(pRows, ctx);

    let heightBand = "";
    const heightC = temple.facts?.height;
    if (isClaim(heightC)) {
      ledger.mark(heightC);
      const heightM = temple.sections?.size?.height_m;
      if (typeof heightM === "number") {
        const items = [
          { heightM, silhouetteAssetId: temple.media?.silhouette, label: temple.name, detail: heightC.value || null },
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
        heightBand = `<div class="temple-size">${drawing ? `<div class="scale-drawing__wrap">${drawing}</div>` : ""}${captions}${sentenceHtml}</div>`;
        
        const noteC = temple.sections?.size?.note;
        if (isClaim(noteC)) {
          ledger.mark(noteC);
          heightBand += claim(noteC, ctx, { tag: "p", className: "temple-size__note" });
        }
      }
    }

    const whyCards = (temple.sections?.why_built || []).map(c => {
      ledger.mark(c);
      return storyCard(c, ctx);
    }).join("");

    const meetBody = `${meetMediaHtml ? `<div>${meetMediaHtml}</div>` : ""}<div class="journey-stop__text">${introCards}${passportHtml}${whyCards}</div>${heightBand ? `<div class="journey-stop__full">${heightBand}</div>` : ""}`;
    
    // --- STOP 2: How it was built ---
    let howMediaHtml = "";
    const videoAsset = assets.find(a => a.temple_id === temple.id && a.role === "build-video" && a.status === "approved");
    if (videoAsset) {
      let posterId = videoAsset.poster;
      if (!posterId) {
        const frame1 = assets.find(a => a.temple_id === temple.id && a.role === "build-sequence" && a.order === 1 && a.status === "approved");
        posterId = frame1 ? frame1.id : null;
      }
      const posterAsset = posterId ? ctx.data.mediaById.get(posterId) : null;
      howMediaHtml = videoFacade(videoAsset, posterAsset, ctx);
    }
    const constrCards = (temple.sections?.construction || []).map((c, i) => {
      ledger.mark(c);
      return storyCard(c, ctx, { marker: `Step ${i + 1}` });
    }).join("");
    const howBody = `${howMediaHtml ? `<div>${howMediaHtml}</div>` : ""}<div class="journey-stop__text">${constrCards}</div>`;

    // --- STOP 3: The parts ---
    const buildFrames = assets.filter(a => a.temple_id === temple.id && a.role === "build-sequence" && a.status === "approved").sort((a,b) => (b.order||0) - (a.order||0));
    let partsMediaHtml = "";
    if (buildFrames.length >= 2) {
      partsMediaHtml = figure(buildFrames[0].id, ctx, { figClassName: "journey-frame" });
    }

    let tourHtml = "";
    const tourData = TEMPLE_TOURS[temple.id];
    const usedSpecialClaims = new Set();
    
    if (tourData) {
      const steps = tourData.map(td => {
        const el = ctx.data.elementsById.get(td.elementId);
        const claims = td.claimPaths.map(p => {
          const c = resolveClaimPath(temple, p);
          if (isClaim(c)) {
            ledger.mark(c);
            usedSpecialClaims.add(c);
          }
          return c;
        }).filter(isClaim);
        
        return {
          elementId: td.elementId,
          highlight: td.highlight,
          heading: el ? el.name : td.elementId,
          definitionClaim: el ? el.what : null,
          claims
        };
      });
      tourHtml = partsTour({ stageAssetId: temple.media?.parts_diagram, steps }, ctx);
    }

    const allSpecial = temple.sections?.special || [];
    const unusedSpecial = allSpecial.filter(c => isClaim(c) && !usedSpecialClaims.has(c));
    let moreHtml = "";
    if (unusedSpecial.length > 0) {
      unusedSpecial.forEach(c => ledger.mark(c));
      const first3 = unusedSpecial.slice(0, 3).map(c => storyCard(c, ctx)).join("");
      const rest = unusedSpecial.slice(3).map(c => storyCard(c, ctx)).join("");
      moreHtml = `<div class="more-to-spot">
        <h3>More to spot</h3>
        ${first3}
        ${rest ? `<details><summary>See ${unusedSpecial.length - 3} more</summary>${rest}</details>` : ""}
      </div>`;
    }
    const partsBodyHtml = `${partsMediaHtml ? `<div class="journey-stop__full">${partsMediaHtml}</div>` : ""}${tourHtml ? `<div class="journey-stop__full">${tourHtml}</div>` : ""}${moreHtml ? `<div class="journey-stop__full">${moreHtml}</div>` : ""}`;

    // --- STOP 4: Its family ---
    const inflCards = (temple.sections?.influences || []).map(c => {
      ledger.mark(c);
      return storyCard(c, ctx);
    }).join("");

    const allTemples = [...ctx.data.temples.temples].sort((a,b) => a.sort_year - b.sort_year);
    const myIdx = allTemples.findIndex(t => t.id === temple.id);
    const nextTemple = allTemples[(myIdx + 1) % allTemples.length];
    
    const nextSilhouette = inlineSvgAsset(nextTemple?.media?.silhouette, ctx);
    const nextHtml = nextTemple ? `<div class="next-temple-card">
      <h3>Visit another temple</h3>
      <a href="${ctx.rel}${nextTemple.page}">${escapeHtml(nextTemple.name)}</a>
      ${nextSilhouette ? namespaceSvgIds(nextSilhouette.svg, "next-temple") : ""}
    </div>` : "";
    
    const familyBody = `<div class="journey-stop__full journey-family">${inflCards}${nextHtml}</div>`;

    // --- Aggregate Stops ---
    const possibleStops = [
      { id: "meet", title: "Meet the temple", body: meetBody, tone: "plain", hasContent: meetMediaHtml || introCards || passportHtml || heightBand || whyCards },
      { id: "how", title: "How it was built", body: howBody, tone: "warm", hasContent: howMediaHtml || constrCards },
      { id: "parts", title: "The parts", body: partsBodyHtml, tone: "plain", hasContent: partsMediaHtml || tourHtml || moreHtml },
      { id: "family", title: "Its family", body: familyBody, tone: "warm", hasContent: inflCards || nextHtml }
    ];
    
    const activeStops = possibleStops.filter(s => s.hasContent);
    const total = activeStops.length;
    
    activeStops.forEach((s, i) => {
      s.n = i + 1;
      s.total = total;
      s.next = i < total - 1 ? { id: activeStops[i+1].id, label: "Next stop" } : null;
    });

    const railStops = activeStops.map(s => ({ id: s.id, n: s.n, title: s.title }));
    const railHtml = journeyRail(railStops);
    
    const stopsHtml = activeStops.map(s => journeyStop(s)).join("");

    // --- Hero ---
    const heroHtml = figure(temple.media?.hero, ctx, { figClassName: "temple-hero__figure", eager: true, aspect: "16 / 9" });
    const oneLinerHtml = isClaim(temple.one_liner) ? claim(temple.one_liner, ctx, { tag: "p" }) : "";
    const placeHtml = temple.location?.place ? `<p class="temple-hero__kicker">${escapeHtml(temple.location.place)}</p>` : "";
    const firstStopId = activeStops.length > 0 ? activeStops[0].id : "";
    const heroSectionHtml = `<section class="temple-hero">
  ${heroHtml}
  <div class="temple-hero__card">
    ${placeHtml}
    <h1>${escapeHtml(temple.name)}</h1>
    ${oneLinerHtml}
    ${firstStopId ? `<a href="#${escapeHtml(firstStopId)}">Start the tour ↓</a>` : ""}
  </div>
</section>`;

    // --- Appendix ---
    const unverifiedKeys = [];
    if (temple.facts) {
      for (const [k, v] of Object.entries(temple.facts)) {
        if (v === null) unverifiedKeys.push(k);
      }
    }
    const FACT_LABELS = { date: "when it was built", dynasty: "who built it", height: "how tall it is", deity: "which god it is for", temple_type: "temple type" };
    const unverifiedHtml = unverifiedKeys.length > 0
      ? `<p class="unverified-appendix">Still being checked: ${escapeHtml(unverifiedKeys.map((k) => FACT_LABELS[k] || k.replace(/_/g, " ")).join(", "))}.</p>`
      : "";
    const appendixHtml = `${sourcesList(ctx, { legend: true })}${unverifiedHtml}`;

    const bodyHtml = `
${heroSectionHtml}
${railHtml}
${stopsHtml}
${appendixHtml}
`;

    const allClaimsMap = extractAllClaims(temple);
    const { zero, multiple } = ledger.report(allClaimsMap.map(x => x.claim));
    
    zero.forEach(c => {
      const entry = allClaimsMap.find(x => x.claim === c);
      console.warn(`[${temple.id}] Claim rendered ZERO times: ${entry?.path}`);
    });
    multiple.forEach(c => {
      const entry = allClaimsMap.find(x => x.claim === c);
      console.warn(`[${temple.id}] Claim rendered MULTIPLE times: ${entry?.path}`);
    });

    return page(ctx, {
      title: temple.name,
      description: isClaim(temple.one_liner) ? temple.one_liner.text : `${temple.name} — a temple of Odisha.`,
      bodyHtml,
      headExtra: `<link rel="stylesheet" href="${ctx.assetRel}css/pages/temple.css">`,
      schema: templeSchema(temple, ctx),
      scripts: ["js/templeJourney.js"],
      bodyClassName: "page-temple"
    });
  };
}
