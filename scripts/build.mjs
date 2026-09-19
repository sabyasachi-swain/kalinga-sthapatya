#!/usr/bin/env node
// Kalinga Sthapatya static site builder — zero dependencies, Node 20+.
// Reads data/*.json (decision D1: pre-render) and writes complete, readable static HTML pages;
// JS only enhances what is already in the markup.
//
//   node scripts/build.mjs                              build data/ -> repo root (production)
//   node scripts/build.mjs --data <dir> --out <dir>      build another data dir to another output dir
//   node scripts/build.mjs --data dev/fixtures --out dev/preview   the only allowed fixture build
//   node scripts/build.mjs --check                       exit 1 and list any stale committed page
//
// Templates and components live in scripts/build/ — never hand-edit a generated page.

import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { resolve, relative, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadData } from "./build/lib/data.mjs";
import { createContext } from "./build/lib/context.mjs";
import { siteConfig } from "./build/config.mjs";
import { getPages } from "./build/registry.mjs";
import { renderComponentsPreview } from "./build/pages/componentsPreview.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const out = { data: "data", out: ".", check: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--data") out.data = argv[++i];
    else if (argv[i] === "--out") out.out = argv[++i];
    else if (argv[i] === "--check") out.check = true;
    else {
      console.error(`Unknown argument: ${argv[i]}`);
      process.exit(2);
    }
  }
  return out;
}

function relToRoot(p) {
  const rel = relative(ROOT, resolve(ROOT, p)).replace(/\\/g, "/");
  return rel === "" ? "." : rel;
}

function isUnderDev(relPath) {
  return relPath === "dev" || relPath.startsWith("dev/");
}

function buildPages(dataDir, outDir) {
  const data = loadData(dataDir);
  const pageList = getPages(data);
  const built = new Map(); // outPath -> html
  for (const p of pageList) {
    const ctx = createContext({
      data,
      outPath: p.outPath,
      outDir,
      projectRoot: ROOT,
      config: siteConfig,
      // 404.html: GitHub Pages serves this file for a missing URL at ANY depth, so relative
      // css/js/nav links would break depending on where the visitor was. Every href/src on this
      // page alone is a full https URL instead.
      absolute: !!p.absolute,
    });
    built.set(p.outPath, p.render(ctx));
  }
  return { data, built, pageList };
}

function buildSitemap(pageList) {
  const urls = pageList
    .filter((p) => p.sitemap)
    .map((p) => {
      const loc = new URL(p.outPath, siteConfig.siteUrl).toString();
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${p.sitemap.changefreq}</changefreq>\n    <priority>${p.sitemap.priority}</priority>\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobots() {
  const sitemapUrl = new URL("sitemap.xml", siteConfig.siteUrl).toString();
  return `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`;
}

function writeOut(outDir, outPath, content) {
  const dest = join(outDir, outPath);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, content, "utf8");
}

function runCheck(args) {
  // --check always validates against the real, committed data/ and the real page locations,
  // regardless of any --out override (there is nothing else sensible to "check").
  const { built, pageList } = buildPages(resolve(ROOT, args.data), ROOT);
  const sitemap = buildSitemap(pageList);
  const robots = buildRobots();
  const stale = [];

  for (const [outPath, html] of built) {
    const committed = join(ROOT, outPath);
    if (!existsSync(committed) || readFileSync(committed, "utf8") !== html) stale.push(outPath);
  }
  const sitemapPath = join(ROOT, "sitemap.xml");
  if (!existsSync(sitemapPath) || readFileSync(sitemapPath, "utf8") !== sitemap) stale.push("sitemap.xml");
  const robotsPath = join(ROOT, "robots.txt");
  if (!existsSync(robotsPath) || readFileSync(robotsPath, "utf8") !== robots) stale.push("robots.txt");

  if (stale.length) {
    console.error(`STALE — run "node scripts/build.mjs" to regenerate:\n${stale.map((s) => `  - ${s}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`OK — ${built.size} generated page(s) + sitemap.xml + robots.txt are up to date.`);
}

function runBuild(args) {
  const dataRel = relToRoot(args.data);
  const outRel = relToRoot(args.out);

  const usesFixtures = dataRel === "dev/fixtures" || dataRel.startsWith("dev/fixtures/");
  if (usesFixtures && !isUnderDev(outRel)) {
    console.error(
      `Refusing to build fixtures ("--data ${args.data}") to "${args.out}". ` +
        `Fixtures must only ever build under dev/ — try "--out dev/preview".`,
    );
    process.exit(1);
  }

  const dataDir = resolve(ROOT, args.data);
  const outDir = resolve(ROOT, args.out);
  const { data, built, pageList } = buildPages(dataDir, outDir);

  for (const [outPath, html] of built) writeOut(outDir, outPath, html);
  writeOut(outDir, "sitemap.xml", buildSitemap(pageList));
  writeOut(outDir, "robots.txt", buildRobots());

  // The component QA gallery only ever builds into a dev/ output directory, never into production.
  if (isUnderDev(outRel)) {
    const ctx = createContext({ data, outPath: "components.html", outDir, projectRoot: ROOT, config: siteConfig });
    writeOut(outDir, "components.html", renderComponentsPreview(ctx));
  }

  console.log(`Built ${built.size} page(s) + sitemap.xml + robots.txt to ${outRel}`);
}

const args = parseArgs(process.argv.slice(2));
if (args.check) runCheck(args);
else runBuild(args);
