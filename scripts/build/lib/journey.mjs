// d:\Personal\AI_Experiment\kalinga-sthapatya\scripts\build\lib\journey.mjs
import { escapeHtml, classNames } from "./html.mjs";
import { claim, unverified, isClaim, inlineSvgAsset } from "./components.mjs";

export function journeyRail(stops) {
  if (!stops || !stops.length) return "";
  const itemsHtml = stops.map((stop, i) => {
    const ariaCurrent = i === 0 ? ' aria-current="step"' : "";
    return `<li class="journey-rail__item"><a class="journey-rail__link" href="#${escapeHtml(stop.id)}" data-stop="${escapeHtml(stop.id)}"${ariaCurrent}>
  <span class="journey-rail__num" aria-hidden="true">${escapeHtml(String(stop.n))}</span>
  <span class="journey-rail__title">${escapeHtml(stop.title)}</span>
</a></li>`;
  }).join("");
  return `<nav class="journey-rail" aria-label="Tour of this temple"><ol class="journey-rail__list">
  ${itemsHtml}
</ol></nav>`;
}

export function journeyStop({ id, n, total, title, narration, tone = "plain", body, next }) {
  if (!id) return "";
  const safeId = escapeHtml(id);
  const hId = `${safeId}-heading`;
  const narrationHtml = narration ? `<p class="journey-stop__narration">${escapeHtml(narration)}</p>` : "";
  const nextHtml = next ? `<a class="journey-next" href="#${escapeHtml(next.id)}">${escapeHtml(next.label)} <span aria-hidden="true">↓</span></a>` : "";
  
  return `<section class="journey-stop journey-stop--${escapeHtml(tone)}" id="${safeId}" aria-labelledby="${hId}">
  <div class="journey-stop__inner">
    <p class="journey-stop__kicker">Stop ${escapeHtml(String(n))} of ${escapeHtml(String(total))}</p>
    <h2 class="journey-stop__heading" id="${hId}">${escapeHtml(title)}</h2>
    ${narrationHtml}
    <div class="journey-stop__body">${body || ""}</div>
    ${nextHtml}
  </div>
</section>`;
}

export function storyCard(claimObj, ctx, { marker = null, className = "" } = {}) {
  if (!isClaim(claimObj)) return "";
  const markerHtml = marker !== null ? `<p class="story-card__marker" aria-hidden="true">${escapeHtml(marker)}</p>` : "";
  const cls = classNames("story-card", className);
  return `<article class="${cls}">
  ${markerHtml}
  <div class="story-card__body">${claim(claimObj, ctx)}</div>
</article>`;
}

export function passport(rows, ctx) {
  if (!rows || !rows.length) return "";
  const rowsHtml = rows.map(row => {
    let valHtml = "";
    if (!isClaim(row.claim)) {
      valHtml = unverified(ctx);
    } else {
      const c = row.claim;
      const cNoNote = { ...c, note: null };
      const shortClaim = claim(cNoNote, ctx, { useValue: true });
      const noteHtml = c.note ? `<p>${escapeHtml(c.note)}</p>` : "";
      const howDoWeKnow = `<details class="passport__how"><summary>How do we know?</summary><p>${escapeHtml(c.text)}</p>${noteHtml}</details>`;
      valHtml = `${shortClaim}${howDoWeKnow}`;
    }
    return `<div class="passport__row"><dt class="passport__label">${escapeHtml(row.label)}</dt><dd class="passport__value">${valHtml}</dd></div>`;
  }).join("");
  return `<dl class="passport">${rowsHtml}</dl>`;
}

// The same drawing is inlined once for the stage and once per step thumbnail. Raw ids would then
// appear several times on one page (invalid HTML), so every copy gets its own prefix. The prefix
// also makes the CSS highlight selectors work: they match on the id *suffix* ([id$="-gandi"]).
function namespacedSvg(svg, prefix) {
  const idMap = new Map();
  let out = svg.replace(/\sid="([^"]+)"/g, (_m, id) => {
    const next = `${prefix}-${id}`;
    idMap.set(id, next);
    return ` id="${next}"`;
  });
  for (const [oldId, newId] of idMap) {
    out = out.split(`href="#${oldId}"`).join(`href="#${newId}"`);
    out = out.split(`url(#${oldId})`).join(`url(#${newId})`);
  }
  return out;
}

export function partsTour({ stageAssetId, steps }, ctx) {
  if (!steps || !steps.length) return "";
  const stageDrawingObj = inlineSvgAsset(stageAssetId, ctx);
  let stageDrawingSvg = "";
  if (stageDrawingObj && stageDrawingObj.svg) {
    stageDrawingSvg = stageDrawingObj.svg.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  }

  const firstHighlight = steps[0].highlight ? steps[0].highlight.join(" ") : "";
  const totalSteps = steps.length;
  const firstStepId = `part-${escapeHtml(String(steps[0].elementId))}`;
  const initialHeading = escapeHtml(steps[0].heading);
  
  const stepsHtml = steps.map((step, i) => {
    const kicker = `Part ${i + 1} of ${totalSteps}`;
    const highlightStr = step.highlight ? step.highlight.join(" ") : "";
    
    const defHtml = isClaim(step.definitionClaim) 
      ? claim(step.definitionClaim, ctx) 
      : unverified(ctx, "What it means: not yet verified");
    
    const claimsHtml = (step.claims || []).map(c => storyCard(c, ctx)).join("");
    
    // aria-hidden: the thumbnail repeats the stage drawing, so it is decoration for the step text.
    const thumbSvg = stageDrawingSvg
      ? `<div class="tour-step__thumb" data-focus="${escapeHtml(highlightStr)}" aria-hidden="true">${namespacedSvg(stageDrawingSvg, `thumb${i + 1}`)}</div>`
      : "";

    const prevStep = i > 0 ? steps[i - 1] : null;
    const nextStep = i < totalSteps - 1 ? steps[i + 1] : null;
    const noJsNav = `
  <noscript>
    <nav class="tour-step__no-js-nav" aria-label="Step navigation">
      ${prevStep ? `<a href="#part-${escapeHtml(String(prevStep.elementId))}">← Previous part (${escapeHtml(prevStep.heading)})</a>` : ""}
      ${nextStep ? `<a href="#part-${escapeHtml(String(nextStep.elementId))}">Next part (${escapeHtml(nextStep.heading)}) →</a>` : ""}
    </nav>
  </noscript>`;

    return `<li class="tour-step${i === 0 ? " is-current" : ""}" id="part-${escapeHtml(String(step.elementId))}" data-highlight="${escapeHtml(highlightStr)}">
  <p class="tour-step__kicker">${escapeHtml(kicker)}</p>
  <h3 class="tour-step__heading">${escapeHtml(step.heading)}</h3>
  ${thumbSvg}
  <div class="tour-step__what">${defHtml}</div>
  ${claimsHtml}${noJsNav}
</li>`;
  }).join("");
  
  return `<div class="parts-tour">
  <div class="parts-tour__stage" data-focus="${escapeHtml(firstHighlight)}">
    <div class="parts-drawing">${namespacedSvg(stageDrawingSvg, "stage")}</div>
    <div class="parts-tour__controls" aria-label="Tour controls">
      <p class="parts-tour__progress"><span class="parts-tour__counter">Part 1 of ${totalSteps}</span></p>
      <div class="parts-tour__buttons">
        <button type="button" class="parts-tour__btn parts-tour__btn--prev" aria-label="Previous part" aria-controls="${firstStepId}" disabled>
          <span aria-hidden="true">←</span> Previous
        </button>
        <button type="button" class="parts-tour__btn parts-tour__btn--next" aria-label="Next part" aria-controls="${firstStepId}"${totalSteps <= 1 ? " disabled" : ""}>
          Next <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
    <div class="parts-tour__status sr-only" role="status" aria-live="polite">Part 1 of ${totalSteps}: ${initialHeading}</div>
  </div>
  <ol class="parts-tour__steps">
    ${stepsHtml}
  </ol>
</div>`;
}

export function videoFacade(videoAsset, posterAsset, ctx) {
  if (!videoAsset) return "";
  const src = `${ctx.assetRel}${videoAsset.path}`;
  const w = videoAsset.width || "";
  const h = videoAsset.height || "";
  
  let posterHtml = "";
  if (posterAsset) {
    const pSrc = `${ctx.assetRel}${posterAsset.path}`;
    const pAlt = posterAsset.decorative ? `alt="" aria-hidden="true"` : `alt="${escapeHtml(posterAsset.alt || "")}"`;
    const pW = posterAsset.width || "";
    const pH = posterAsset.height || "";
    const pSizes = "(min-width: 1200px) 700px, (min-width: 900px) 58vw, calc(100vw - 32px)";
    posterHtml = `<img src="${escapeHtml(pSrc)}" width="${escapeHtml(String(pW))}" height="${escapeHtml(String(pH))}" ${pAlt} loading="lazy" decoding="async" sizes="${pSizes}">`;
  }
  
  return `<div class="video-facade" data-video="${escapeHtml(src)}" data-w="${escapeHtml(String(w))}" data-h="${escapeHtml(String(h))}">
  ${posterHtml}
  <button type="button" class="video-facade__play" aria-label="Play the video"></button>
  <noscript><a href="${escapeHtml(src)}">Play video</a></noscript>
</div>`;
}

export function resolveClaimPath(temple, path) {
  if (!temple || !path) return null;
  const parts = path.split(".");
  let current = temple;
  for (const part of parts) {
    if (current == null) return null;
    current = current[part];
  }
  return isClaim(current) ? current : null;
}

export function createRenderLedger() {
  const rendered = new Set();
  const multiple = new Set();
  
  return {
    mark(claimObj) {
      if (isClaim(claimObj)) {
        if (rendered.has(claimObj)) {
          multiple.add(claimObj);
        }
        rendered.add(claimObj);
      }
    },
    report(allClaims) {
      const zero = [];
      for (const c of (allClaims || [])) {
        if (isClaim(c) && !rendered.has(c)) {
          zero.push(c);
        }
      }
      return { 
        zero, 
        multiple: Array.from(multiple) 
      };
    }
  };
}
