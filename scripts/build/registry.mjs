// Page registry: every generated page is one entry here. `getPages(data)` is a function (not a
// static array) because the temple pages are data-driven — one per temple in data/temples.json,
// outPath taken from each temple's own `page` field — so the list must be rebuilt per data source
// (real data/ vs dev/fixtures, which have different temples). Everything else is still static.
// `outPath` determines relative URL depth automatically (see lib/context.mjs).

import { renderIndex } from "./pages/index.mjs";
import { renderAbout } from "./pages/about.mjs";
import { renderNotFound } from "./pages/notfound.mjs";
import { renderTemple } from "./pages/temple.mjs";
import { renderTimeline } from "./pages/timeline.mjs";
import { renderGlossary } from "./pages/glossary.mjs";
import { renderCompare } from "./pages/compare.mjs";
import { renderMap } from "./pages/map.mjs";
import { renderAcademy } from "./pages/academy.mjs";

export function getPages(data) {
  const templePages = (data.temples.temples || []).map((t) => ({
    outPath: t.page,
    render: renderTemple(t),
    sitemap: { priority: "0.8", changefreq: "monthly" },
  }));

  return [
    { outPath: "index.html", render: renderIndex, sitemap: { priority: "1.0", changefreq: "weekly" } },
    { outPath: "about.html", render: renderAbout, sitemap: { priority: "0.5", changefreq: "monthly" } },
    { outPath: "timeline.html", render: renderTimeline, sitemap: { priority: "0.7", changefreq: "monthly" } },
    { outPath: "glossary.html", render: renderGlossary, sitemap: { priority: "0.6", changefreq: "monthly" } },
    { outPath: "compare.html", render: renderCompare, sitemap: { priority: "0.6", changefreq: "monthly" } },
    { outPath: "map.html", render: renderMap, sitemap: { priority: "0.7", changefreq: "monthly" } },
    { outPath: "academy.html", render: renderAcademy, sitemap: { priority: "0.8", changefreq: "monthly" } },
    ...templePages,
    // 404.html is not a real route: GitHub Pages serves it for any unmatched path *at any depth*
    // (e.g. /kalinga-sthapatya/temples/typo.html), so it cannot use page-relative URLs like every
    // other page — `absolute: true` makes every href/src on it a full https URL. Excluded from the sitemap.
    { outPath: "404.html", render: renderNotFound, sitemap: null, absolute: true },
  ];
}
