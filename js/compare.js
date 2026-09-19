// Compare page enhancement: swap either panel when a <select> changes, using the JSON island the
// build already rendered (scripts/build/pages/compare.mjs) — every string here was pre-rendered
// from approved data at build time; this file only rearranges it and does small height arithmetic
// (a computed comparison, not a fact). With this file absent, the server-rendered default pair
// (the first two temples by sort_year) is the whole, fully readable page.

function readData() {
  const el = document.getElementById("compare-data");
  if (!el) return null;
  try {
    return JSON.parse(el.textContent);
  } catch {
    return null;
  }
}

function barColumnHtml(temple, maxM, slot) {
  const heightM = temple ? temple.heightM : null;
  const pct = typeof heightM === "number" && maxM ? Math.max((heightM / maxM) * 100, 4) : null;
  const fill = (temple && temple.silhouetteMarkup) || `<div class="compare-bars__fallback" aria-hidden="true"></div>`;
  const label = escapeForText(temple ? temple.name : "");
  return `<div class="compare-bars__col" data-bar-slot="${slot}">
    <div class="compare-bars__track">
      ${pct !== null ? `<div class="compare-bars__fill" style="height:${pct.toFixed(1)}%">${fill}</div>` : ""}
    </div>
    <p class="compare-bars__label">${label}</p>
  </div>`;
}

// Names come from our own build-time data, but escape defensively anyway before any innerHTML use.
function escapeForText(s) {
  const div = document.createElement("div");
  div.textContent = s || "";
  return div.innerHTML;
}

function differenceSentence(a, b) {
  if (typeof a?.heightM !== "number" || typeof b?.heightM !== "number") {
    return "Height not yet verified for one or both temples — no size comparison yet.";
  }
  const tallerFirst = a.heightM >= b.heightM ? [a, b] : [b, a];
  const [taller, shorter] = tallerFirst;
  const diff = taller.heightM - shorter.heightM;
  if (diff < 0.1) return `${taller.name} and ${shorter.name} are about the same height.`;
  const ratio = taller.heightM / shorter.heightM;
  const timesText = ratio >= 1.15 ? ` — about ${ratio.toFixed(1)}× as tall` : "";
  return `${taller.name} is about ${diff.toFixed(1)} m taller than ${shorter.name}${timesText}.`;
}

function setupCompare() {
  const data = readData();
  const selectA = document.getElementById("compare-select-a");
  const selectB = document.getElementById("compare-select-b");
  const panelA = document.getElementById("compare-panel-a");
  const panelB = document.getElementById("compare-panel-b");
  const bars = document.getElementById("compare-bars");
  const sentenceEl = document.getElementById("compare-sentence");
  if (!data || !selectA || !selectB || !panelA || !panelB) return;

  const byId = new Map(data.temples.map((t) => [t.id, t]));

  function render() {
    const a = byId.get(selectA.value);
    const b = byId.get(selectB.value);
    if (a) panelA.innerHTML = a.panelHtml;
    if (b) panelB.innerHTML = b.panelHtml;

    if (bars) {
      const heights = [a, b].map((t) => t && t.heightM).filter((h) => typeof h === "number");
      const maxM = heights.length ? Math.max(...heights) : null;
      bars.innerHTML = barColumnHtml(a, maxM, "a") + barColumnHtml(b, maxM, "b");
    }
    if (sentenceEl && a && b) sentenceEl.textContent = differenceSentence(a, b);
  }

  selectA.addEventListener("change", render);
  selectB.addEventListener("change", render);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupCompare);
} else {
  setupCompare();
}
