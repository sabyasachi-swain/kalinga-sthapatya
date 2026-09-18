// Page registry: every generated page is one entry here. Phase 3 builders add new pages
// (timeline.html, academy.html, map.html, compare.html, glossary.html, temples/*.html) by adding
// an entry to this array and a render() module under scripts/build/pages/ — no other file needs to
// change. `outPath` determines relative URL depth automatically (see lib/context.mjs).

import { renderIndex } from "./pages/index.mjs";
import { renderAbout } from "./pages/about.mjs";
import { renderNotFound } from "./pages/notfound.mjs";

export const pages = [
  { outPath: "index.html", render: renderIndex, sitemap: { priority: "1.0", changefreq: "weekly" } },
  { outPath: "about.html", render: renderAbout, sitemap: { priority: "0.5", changefreq: "monthly" } },
  // 404.html is not a real route: GitHub Pages serves it for any unmatched path *at any depth*
  // (e.g. /kalinga-sthapatya/temples/typo.html), so it cannot use page-relative URLs like every
  // other page — `absolute: true` makes every href/src on it a full https URL. Excluded from the sitemap.
  { outPath: "404.html", render: renderNotFound, sitemap: null, absolute: true },
];
