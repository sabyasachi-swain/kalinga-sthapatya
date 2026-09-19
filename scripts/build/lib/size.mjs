// Shared "scale drawing" helper for the temple page's "How big is it?" section (design-system
// skill: silhouette + human figure + five-storey building, scaled to cited height_m). Purely a
// rendering helper: every number it draws with is passed in by the caller from an already-approved
// claim (sections.size.height_m) — this file invents nothing.
//
// Renders as one inline SVG (aria-hidden, purely visual) plus a visible text caption list beneath
// it, the same "visual + redundant text list" pattern already used for hotspots.

import { escapeHtml } from "./html.mjs";
import { inlineSvgAsset } from "./components.mjs";

const MAX_BAR_PX = 220;
const BAR_WIDTH_PX = 64;
const GAP_PX = 40;
const MARGIN_PX = 24;
const LABEL_PX = 22; // room under the baseline for each figure's short in-drawing label

// items: [{ heightM: number|null, silhouetteAssetId: string|null, label: string }]
export function scaleDrawing(items, ctx) {
  const knownHeights = items.map((i) => i.heightM).filter((h) => typeof h === "number" && h > 0);
  if (!knownHeights.length) return null;
  const maxM = Math.max(...knownHeights);
  const pxPerM = MAX_BAR_PX / maxM;
  const svgHeight = MARGIN_PX + MAX_BAR_PX + LABEL_PX + MARGIN_PX;
  const svgWidth = items.length * BAR_WIDTH_PX + (items.length - 1) * GAP_PX + MARGIN_PX * 2;
  const baselineY = MARGIN_PX + MAX_BAR_PX;

  let x = MARGIN_PX;
  const shapes = items
    .map((item) => {
      const hasHeight = typeof item.heightM === "number" && item.heightM > 0;
      let shape;
      if (!hasHeight) {
        // Unknown height: a short tick at the baseline instead of a bar — never a guessed height.
        shape = `<rect x="${x}" y="${baselineY - 6}" width="${BAR_WIDTH_PX}" height="6" rx="2" class="scale-drawing__unknown" />`;
      } else {
        const barH = Math.max(item.heightM * pxPerM, 6);
        const y = baselineY - barH;
        const inline = item.silhouetteAssetId ? inlineSvgAsset(item.silhouetteAssetId, ctx) : null;
        if (inline) {
          // Nested <svg>: a valid way to position/scale one whole SVG document inside another
          // while keeping its own internal viewBox for the artwork.
          shape = inline.svg.replace(
            "<svg",
            `<svg x="${x}" y="${y}" width="${BAR_WIDTH_PX}" height="${barH}" preserveAspectRatio="xMidYMax meet"`,
          );
        } else {
          // A soft tinted placeholder shape (never a stock image), not a dashed "under construction" box.
          shape = `<rect x="${x}" y="${y}" width="${BAR_WIDTH_PX}" height="${barH}" rx="6" class="scale-drawing__fallback" />`;
        }
      }
      const label = `<text x="${x + BAR_WIDTH_PX / 2}" y="${baselineY + LABEL_PX - 6}" text-anchor="middle" class="scale-drawing__label">${escapeHtml(
        item.label || "",
      )}</text>`;
      x += BAR_WIDTH_PX + GAP_PX;
      return `${shape}\n${label}`;
    })
    .join("\n");

  return `<svg class="scale-drawing" viewBox="0 0 ${svgWidth} ${svgHeight}" role="img" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
    <line x1="0" y1="${baselineY}" x2="${svgWidth}" y2="${baselineY}" class="scale-drawing__baseline" />
    ${shapes}
  </svg>`;
}

// A short detail line under the drawing for each figure. The label itself is already drawn inside
// the SVG under each shape for sighted readers, so it isn't repeated visibly here — but the SVG is
// aria-hidden (purely decorative), so a screen-reader-only label keeps this list the fully
// readable, accessible version, the same "visual + redundant text" pattern used for hotspots.
export function scaleDrawingCaptions(items) {
  return `<ul class="scale-drawing__captions">
    ${items
      .map(
        (item) =>
          `<li><span class="sr-only">${escapeHtml(item.label)}: </span>${item.detail ? escapeHtml(item.detail) : ""}</li>`,
      )
      .join("\n")}
  </ul>`;
}

// A computed comparison sentence — never written by hand, always derived from the two numbers.
export function heightComparisonSentence(heightM, comparisonM, comparisonLabel) {
  if (typeof heightM !== "number" || typeof comparisonM !== "number" || comparisonM <= 0) return null;
  const ratio = heightM / comparisonM;
  const rounded = Math.round(ratio * 10) / 10;
  if (rounded < 1.15) return `About as tall as ${comparisonLabel}.`;
  return `About ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)} times as tall as ${comparisonLabel}.`;
}

// Difference sentence between two labelled heights (compare page + reused for tests) — taller
// first, with a "times as tall" clause only when the difference is large enough to be meaningful.
export function heightDifferenceSentence(a, b) {
  if (typeof a?.heightM !== "number" || typeof b?.heightM !== "number") return null;
  const tallerFirst = a.heightM >= b.heightM ? [a, b] : [b, a];
  const [taller, shorter] = tallerFirst;
  const diff = taller.heightM - shorter.heightM;
  if (diff < 0.1) return `${escapeHtml(taller.label)} and ${escapeHtml(shorter.label)} are about the same height.`;
  const ratio = taller.heightM / shorter.heightM;
  const timesText = ratio >= 1.15 ? ` — about ${ratio.toFixed(1)}× as tall` : "";
  return `${escapeHtml(taller.label)} is about ${diff.toFixed(1)} m taller than ${escapeHtml(shorter.label)}${timesText}.`;
}
