// Page registry: every generated page is one entry here. Phase 3 builders add new pages
// (timeline.html, academy.html, map.html, compare.html, glossary.html, temples/*.html) by adding
// an entry to this array and a render() module under scripts/build/pages/ — no other file needs to
// change. `outPath` determines relative URL depth automatically (see lib/context.mjs).

import { renderIndex } from "./pages/index.mjs";
import { renderAbout } from "./pages/about.mjs";
import { renderNotFound } from "./pages/notfound.mjs";
import { comingSoon } from "./pages/comingSoon.mjs";

// Placeholders until Phase 3 builds the real pages (kept out of the sitemap). Replace, don't add.
const stubs = [
  { outPath: "timeline.html", title: "Timeline", promise: "Follow how Odisha's temple design changed across the centuries, era by era." },
  { outPath: "academy.html", title: "Architecture Academy", promise: "Learn the three temple types, take a temple apart piece by piece, and see how one was built." },
  { outPath: "map.html", title: "Temple Map", promise: "Find the temples on a map of Odisha and travel through time with the slider." },
  { outPath: "compare.html", title: "Compare Temples", promise: "Put two temples side by side and see how they differ." },
  { outPath: "glossary.html", title: "Glossary", promise: "Look up the Odia and Sanskrit words used for every part of a temple." },
].map((s) => ({ outPath: s.outPath, render: comingSoon(s), sitemap: null }));

export const pages = [
  { outPath: "index.html", render: renderIndex, sitemap: { priority: "1.0", changefreq: "weekly" } },
  { outPath: "about.html", render: renderAbout, sitemap: { priority: "0.5", changefreq: "monthly" } },
  // 404.html is not a real route: GitHub Pages serves it for any unmatched path *at any depth*
  // (e.g. /kalinga-sthapatya/temples/typo.html), so it cannot use page-relative URLs like every
  // other page — `absolute: true` makes every href/src on it a full https URL. Excluded from the sitemap.
  { outPath: "404.html", render: renderNotFound, sitemap: null, absolute: true },
  ...stubs,
];
