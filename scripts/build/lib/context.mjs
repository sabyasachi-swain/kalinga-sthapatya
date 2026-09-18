// Per-page render context: URL prefixes and the citation ledger that claim()/sourcesList() share
// while a single page is being built.
//
// Two different prefixes are needed because --out can point somewhere other than the project root
// (e.g. dev/preview/), while every generated page still lives at the same *relative* position to
// every other generated page:
//   - `rel`      page -> page (nav, footer, "see the timeline", etc.) — depends only on outPath's
//                own depth, since all pages are written together under the same --out.
//   - `assetRel` page -> real static asset (css/, js/, img/) — depends on where the page actually
//                lands on disk (outDir + outPath) relative to the project root, since css/js/img
//                are never copied into --out, only read from their real location.
//
// `absolute: true` (404.html only — GitHub Pages can serve it from any depth) makes both prefixes
// the full siteUrl instead, so every href/src becomes a complete, working https URL.

import { relative, dirname, resolve } from "node:path";

export function relPrefix(outPath) {
  const depth = outPath.split("/").length - 1;
  return depth > 0 ? "../".repeat(depth) : "";
}

function assetRelPrefix(outDir, outPath, projectRoot) {
  const pageDir = resolve(outDir, dirname(outPath));
  const rel = relative(pageDir, projectRoot).replace(/\\/g, "/");
  return rel === "" ? "" : `${rel}/`;
}

export function createContext({ data, outPath, outDir, projectRoot, config, absolute = false }) {
  return {
    data,
    config,
    outPath,
    rel: absolute ? config.siteUrl : relPrefix(outPath),
    assetRel: absolute ? config.siteUrl : assetRelPrefix(outDir ?? projectRoot, outPath, projectRoot),
    projectRoot,
    citations: new Map(), // sourceId -> citation number (order of first use on this page)
    citationOrder: [],
  };
}
