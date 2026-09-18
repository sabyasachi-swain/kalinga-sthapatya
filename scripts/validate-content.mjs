#!/usr/bin/env node
// Kalinga Sthapatya content validator — zero dependencies, Node 20+.
// Enforces the content policy on data/*.json (and staged fragments).
//
//   node scripts/validate-content.mjs                  validate data/
//   node scripts/validate-content.mjs --strict         warnings become errors (pre-launch)
//   node scripts/validate-content.mjs --staged <file>  validate one staged fragment
//   node scripts/validate-content.mjs --data-dir <dir> validate another data folder (tests)
//   node scripts/validate-content.mjs --json           machine-readable output
//
// Exit code: 0 = pass, 1 = errors found, 2 = could not run.
// DO NOT weaken rules here to make content pass. Fix the content, or ask the human.

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const opt = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : null);

const DATA_DIR = resolve(ROOT, opt("--data-dir") || "data");
const STAGED = opt("--staged");
const STRICT = flag("--strict");
const AS_JSON = flag("--json");

// ---------------------------------------------------------------- policy tables
const TIERS = ["established", "scholarly", "uncertain"];
const SOURCE_TYPES = [
  "book", "journal-article", "primary-text", "epigraphy",
  "asi-report", "unesco-icomos", "government-doc", "thesis",
];
const PRIMARY_CLASS = ["primary-text", "epigraphy", "asi-report", "unesco-icomos"];
const SINGLE_AUTHORITATIVE_OK = ["asi-report", "unesco-icomos", "epigraphy"];
const URL_KINDS = ["doi", "publisher", "archive", "catalogue", "official", "journal"];

// Never acceptable as a citation (policy: no blogs/news/social/wiki/tourism).
const BLOCKED_DOMAINS = [
  "wikipedia.org", "wikiwand.com", "wikimedia.org", "fandom.com", "blogspot.", "wordpress.com",
  "medium.com", "substack.com", "quora.com", "reddit.com", "facebook.com", "instagram.com",
  "twitter.com", "x.com", "youtube.com", "youtu.be", "pinterest.", "tripadvisor.", "linkedin.com",
  "timesofindia", "hindustantimes", "thehindu.com", "indianexpress", "ndtv.com", "news18",
  "odishatv", "sambadenglish", "newindianexpress", "scroll.in", "thewire.in", "dnaindia",
  "odishatourism.gov.in", "incredibleindia", "holidify", "makemytrip", "britannica.com",
  "chatgpt.com", "gemini.google.com", "claude.ai", "perplexity.ai",
];
// Known scholarly/official hosts. Others produce a warning until a human sets domain_reviewed: true.
const TRUSTED_DOMAINS = [
  "doi.org", "archive.org", "hathitrust.org", "worldcat.org", "books.google.", "jstor.org",
  "brill.com", "cambridge.org", "tandfonline.com", "springer.com", "sciencedirect.com",
  "journals.sagepub.com", "academic.oup.com", "whc.unesco.org", "unesco.org", "icomos.org",
  "asi.nic.in", "indiaculture.gov.in", "odisha.gov.in", "ignca.gov.in", "ignca.nic.in",
  "motilalbanarsidass.com", "wellcomecollection.org", "britishmuseum.org", "loc.gov",
  "catalog.hathitrust.org", "indianculture.gov.in", "dli.ernet.in", "shodhganga.inflibnet.ac.in",
  "researchgate.net", "semanticscholar.org", "persee.fr", "openstreetmap.org",
];

// Content pitfalls taken from the research report's Caveats section.
const PITFALLS = [
  { re: /\bno (iron|metal)\b|without (any )?(iron|metal)/i, level: "error",
    msg: "Contradicts research: Kalinga dry masonry used iron cramps and dowels. Say 'no mortar', not 'no metal'." },
  { re: /kendupatna/i, test: (t) => /konark|konarak/i.test(t) && /date|built|construct/i.test(t), level: "error",
    msg: "Kendupatna plate does not date Konark's construction (research §7 caveat)." },
  { re: /bishu maharana|1,?200 (craftsmen|workers|artisans)|twelve years|12 years/i,
    test: (t, c) => c.tier !== "uncertain" || !/tradition|legend|according to/i.test(t), level: "error",
    msg: "Dharmapada/Bishu Maharana/1,200 workers is tradition: tier must be 'uncertain' and text must say it is tradition." },
  { re: /yayati/i, test: (t, c) => c.tier === "established" || !c.note, level: "error",
    msg: "Yayati I attributions are unproven: use tier scholarly/uncertain and add a note." },
  { re: /\b7,?000\b|\b700\b.*temples/i, test: (t) => !/estimat|tradition|about|around|said/i.test(t), level: "warning",
    msg: "The 700 / 7,000 Bhubaneswar temple counts are estimates; say so." },
  { re: /six horses/i, level: "warning",
    msg: "Scholarship and UNESCO OUV say seven horses; 'six' is an inconsistency in one UNESCO summary." },
  { re: /\b(definitely|undoubtedly|certainly|proves|proven fact|without doubt)\b/i, level: "warning",
    msg: "Overclaiming language; let the evidence tier carry certainty." },
  { re: /\bAD\b|\bBC\b/, level: "warning", msg: "Use CE/BCE, not AD/BC." },
];

const FIXTURE_MARKERS = /\bFIXTURE\b|lorem ipsum|TODO|TBD|\?\?\?/i;
const RESEARCH_REPORT = /Odisha Temple Archtecture research|implementation_plan\.md/i;
const DATE_KEYS = new Set(["date", "period"]);
const MAX_SENTENCE_WORDS = 28;

// ---------------------------------------------------------------- reporting
const errors = [];
const warnings = [];
const err = (where, msg) => errors.push({ where, msg });
const warn = (where, msg) => warnings.push({ where, msg });

function loadJson(file, required = false) {
  if (!existsSync(file)) {
    if (required) err(file, "file not found");
    return null;
  }
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    err(file, `invalid JSON: ${e.message}`);
    return null;
  }
}

const isStr = (v) => typeof v === "string" && v.trim().length > 0;
const isKebab = (v) => typeof v === "string" && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v);
const hostOf = (u) => { try { return new URL(u).hostname.toLowerCase(); } catch { return null; } };

// ---------------------------------------------------------------- sources
function checkSources(list, where) {
  const byId = new Map();
  if (!Array.isArray(list)) { err(where, "sources must be an array"); return byId; }
  list.forEach((s, i) => {
    const w = `${where}[${i}]${s?.id ? ` (${s.id})` : ""}`;
    if (!isKebab(s?.id)) err(w, "source id must be kebab-case, e.g. donaldson-1985");
    else if (byId.has(s.id)) err(w, "duplicate source id");
    else byId.set(s.id, s);
    if (!SOURCE_TYPES.includes(s?.type)) err(w, `type must be one of: ${SOURCE_TYPES.join(", ")}`);
    if (!isStr(s?.title)) err(w, "title required");
    if (!Array.isArray(s?.authors) || !s.authors.length) err(w, "authors[] required (use the institution for UNESCO/ASI)");
    if (!isStr(String(s?.year ?? ""))) err(w, "year required");
    if (!URL_KINDS.includes(s?.url_kind)) err(w, `url_kind must be one of: ${URL_KINDS.join(", ")}`);
    if (!isStr(s?.url)) { err(w, "url required — policy: every citation is clickable"); return; }
    if (!/^https:\/\//.test(s.url)) err(w, "url must be https");
    if (RESEARCH_REPORT.test(s.url) || RESEARCH_REPORT.test(s.title)) err(w, "the local research report / plan is not a citable source");
    const host = hostOf(s.url);
    if (!host) { err(w, "url is not a valid URL"); return; }
    if (BLOCKED_DOMAINS.some((d) => host.includes(d))) err(w, `blocked domain (${host}): news/blog/wiki/tourism/AI sites are not accepted`);
    else if (!TRUSTED_DOMAINS.some((d) => host.includes(d)) && s.domain_reviewed !== true)
      warn(w, `domain ${host} is not on the trusted list — a human must confirm it and set "domain_reviewed": true`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s?.accessed ?? "")) err(w, "accessed date (YYYY-MM-DD) required");
  });
  return byId;
}

// ---------------------------------------------------------------- claims
function sentences(text) {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean);
}

function checkClaim(c, where, key, ctx) {
  if (!isStr(c.text)) err(where, "claim.text required (use null for the whole claim if unverified — never an empty string)");
  const text = c.text || "";
  if (!TIERS.includes(c.tier)) err(where, `tier must be one of: ${TIERS.join(", ")}`);
  if (c.status !== "approved") err(where, `status must be "approved" (got ${JSON.stringify(c.status)}) — only fact-checked claims enter data/`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.checked_on ?? "")) err(where, "checked_on (YYYY-MM-DD) required");

  const refs = Array.isArray(c.sources) ? c.sources : [];
  if (!refs.length) err(where, "at least one source required — if none, set the field to null (leave blank)");
  const seen = new Set();
  const types = [];
  refs.forEach((r, i) => {
    const id = typeof r === "string" ? r : r?.id;
    if (!id) { err(`${where}.sources[${i}]`, "source ref needs an id"); return; }
    if (seen.has(id)) warn(`${where}.sources[${i}]`, `duplicate source ${id}`);
    seen.add(id);
    const src = ctx.sources.get(id);
    if (!src) err(`${where}.sources[${i}]`, `unknown source id "${id}" — add it to data/sources.json first`);
    else {
      types.push(src.type);
      ctx.usedSources.add(id);
    }
    if (typeof r === "object" && !isStr(r.locator)) warn(`${where}.sources[${i}]`, `no locator (page/section) for ${id}`);
  });

  if (c.tier === "established") {
    const primary = types.filter((t) => PRIMARY_CLASS.includes(t)).length;
    if (!primary) err(where, "tier 'established' needs at least one primary-class source (epigraphy, ASI, UNESCO/ICOMOS, primary text)");
    if (seen.size < 2) {
      const soleOk = c.single_authoritative === true && types.length === 1 && SINGLE_AUTHORITATIVE_OK.includes(types[0]) && isStr(c.note);
      if (!soleOk) err(where, "tier 'established' needs 2+ independent sources (or single_authoritative:true + note, only for an ASI/UNESCO/epigraphic record of its own act)");
    }
  }
  if (c.tier === "uncertain" && !isStr(c.note)) err(where, "tier 'uncertain' needs a note summarising the competing views");

  // Decision D3: evidence nobody read in full (catalogue record / search snippet) needs the human's sign-off.
  if (!["full-text", "snippet", "catalogue-only"].includes(c.access))
    err(where, "access required: full-text | snippet | catalogue-only (weakest evidence behind the claim)");
  if (c.access === "catalogue-only" || c.access === "snippet") {
    if (c.tier === "established") err(where, `${c.access} evidence can never be 'established'`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(c.human_approved ?? "")) err(where, `${c.access} evidence needs human_approved (YYYY-MM-DD) from gate G2`);
    if (refs.some((r) => typeof r === "object" && isStr(r.locator) && r.locator !== "unverified"))
      err(where, `${c.access} evidence: locator must be "unverified" (nobody saw the page)`);
  }
  const dateText = isStr(c.value) ? c.value : text;
  if (DATE_KEYS.has(key) && c.tier !== "established" && !/c\.|–|-|century|centuries|ca\.|around|about|circa/i.test(dateText))
    err(where, "non-established dates must be approximate or a range (e.g. 'c. 950–975 CE', 'around 1250 CE')");
  if (DATE_KEYS.has(key) && !/\b(CE|BCE)\b/.test(dateText)) warn(where, "dates should state CE/BCE");

  if (FIXTURE_MARKERS.test(text)) err(where, "placeholder/fixture text found in real data");
  for (const p of PITFALLS) {
    if (p.re.test(text) && (!p.test || p.test(text, c))) (p.level === "error" ? err : warn)(where, p.msg);
  }
  for (const s of sentences(text)) {
    const n = s.split(/\s+/).length;
    if (n > MAX_SENTENCE_WORDS) { warn(where, `sentence of ${n} words — keep it simple for families (≤ ${MAX_SENTENCE_WORDS})`); break; }
  }
}

// A value is a claim if it has tier/sources/status. Walk everything and check each one found.
function walk(node, where, key, ctx) {
  if (node === null || node === undefined) return;
  if (Array.isArray(node)) { node.forEach((n, i) => walk(n, `${where}[${i}]`, key, ctx)); return; }
  if (typeof node !== "object") {
    if (typeof node === "string" && FIXTURE_MARKERS.test(node) && !["id", "path"].includes(key))
      err(where, "placeholder/fixture text found in real data");
    return;
  }
  const looksLikeClaim = "tier" in node || ("text" in node && ("sources" in node || "status" in node));
  if (looksLikeClaim) checkClaim(node, where, key, ctx);
  for (const [k, v] of Object.entries(node)) {
    if (looksLikeClaim && (k === "sources" || k === "text")) continue;
    if (k === "text" && typeof v === "string" && !looksLikeClaim)
      err(`${where}.${k}`, "prose 'text' outside a claim object — wrap it as {text, tier, sources, status, checked_on}");
    walk(v, `${where}.${k}`, k, ctx);
  }
}

// ---------------------------------------------------------------- per-file structure
function ids(list, where, label) {
  const set = new Set();
  (list || []).forEach((it, i) => {
    if (!isKebab(it?.id)) err(`${where}[${i}]`, `${label} id must be kebab-case`);
    else if (set.has(it.id)) err(`${where}[${i}]`, `duplicate ${label} id ${it.id}`);
    else set.add(it.id);
  });
  return set;
}

function checkTemples(doc, ctx) {
  const list = doc?.temples;
  if (!Array.isArray(list)) { err("temples.json", "expected { temples: [] }"); return; }
  ctx.templeIds = ids(list, "temples", "temple");
  list.forEach((t, i) => {
    const w = `temples[${i}] (${t?.id})`;
    if (!isStr(t.name)) err(w, "name required");
    if (!isStr(t.page) || !/^temples\/[a-z0-9-]+\.html$/.test(t.page)) err(w, "page must be temples/<slug>.html");
    if (!["rekha", "pidha", "khakhara"].includes(t.temple_type)) err(w, "temple_type must be rekha|pidha|khakhara");
    if (!Number.isInteger(t.sort_year)) err(w, "sort_year (integer, for ordering only — never displayed) required");
    const loc = t.location || {};
    if (typeof loc.lat !== "number" || typeof loc.lng !== "number") err(w, "location.lat/lng required");
    else if (loc.lat < 17.7 || loc.lat > 22.6 || loc.lng < 81.3 || loc.lng > 87.6) err(w, "coordinates fall outside Odisha");
    if (!isStr(loc.coord_source) || !/^https:\/\//.test(loc.coord_source)) err(w, "location.coord_source (https URL) required");
    for (const f of ["date", "dynasty", "height", "deity", "temple_type"])
      if (!(t.facts && f in t.facts)) err(w, `facts.${f} missing — use null to leave it blank, never omit`);
    const h = t.facts?.height;
    if (h && typeof h.value_m !== "number") err(w, "facts.height.value_m (number, metres) required when height is given");
    const sz = t.sections?.size?.height_m;
    if (sz != null && h?.value_m !== sz) err(w, "sections.size.height_m must equal facts.height.value_m (single source of truth)");
    if (sz != null && !h) err(w, "size comparison needs a cited facts.height");
    for (const el of t.sections?.parts?.element_ids || []) ctx.elementRefs.push([w, el]);
    for (const m of Object.values(t.media || {})) if (m) ctx.mediaRefs.push([w, m]);
    if (t.era_id) ctx.eraRefs.push([w, t.era_id]);
    if (t.sketchfab) {
      const s = t.sketchfab;
      for (const k of ["model_url", "embed_url", "author", "license", "license_url"]) if (!isStr(s[k])) err(`${w}.sketchfab`, `${k} required`);
      if (isStr(s.license) && !/^CC/.test(s.license)) err(`${w}.sketchfab`, "only Creative Commons models may be embedded");
      if (/NC|ND/.test(s.license || "")) warn(`${w}.sketchfab`, "NC/ND licence — fine for embedding, but confirm before any ad monetisation");
    }
    walk(t, `temples.${t.id}`, "temple", ctx);
  });
}

function checkTimeline(doc, ctx) {
  const list = doc?.eras;
  if (!Array.isArray(list)) { err("timeline.json", "expected { eras: [] }"); return; }
  ctx.eraIds = ids(list, "eras", "era");
  list.forEach((e, i) => {
    const w = `eras[${i}] (${e?.id})`;
    if (!Number.isInteger(e.order)) err(w, "order (integer) required");
    if (!isStr(e.label)) err(w, "label required");
    for (const t of e.temples || []) if (t?.temple_id) ctx.templeRefs.push([w, t.temple_id]);
    if (e.media) ctx.mediaRefs.push([w, e.media]);
    walk(e, `eras.${e.id}`, "era", ctx);
  });
}

function checkGlossary(doc, ctx) {
  const list = doc?.terms;
  if (!Array.isArray(list)) { err("glossary.json", "expected { terms: [] }"); return; }
  ids(list, "terms", "term");
  list.forEach((g, i) => {
    const w = `terms[${i}] (${g?.id})`;
    if (!isStr(g.term)) err(w, "term required");
    if (g.short === undefined) err(w, "short missing — null if unverified");
    for (const t of g.temple_ids || []) ctx.templeRefs.push([w, t]);
    if (g.element_id) ctx.elementRefs.push([w, g.element_id]);
    walk(g, `terms.${g.id}`, "term", ctx);
  });
}

function checkElements(doc, ctx) {
  const list = doc?.elements;
  if (!Array.isArray(list)) { err("elements.json", "expected { elements: [] }"); return; }
  ctx.elementIds = ids(list, "elements", "element");
  list.forEach((el, i) => {
    const w = `elements[${i}] (${el?.id})`;
    if (!isStr(el.name)) err(w, "name required");
    if (!isStr(el.plain_name)) err(w, "plain_name (simple English) required");
    for (const t of el.temple_ids || []) ctx.templeRefs.push([w, t]);
    walk(el, `elements.${el.id}`, "element", ctx);
  });
}

function checkAcademy(doc, ctx) {
  if (!doc || typeof doc !== "object") { err("academy.json", "expected an object"); return; }
  for (const col of ["temple_types", "why_questions", "builder_steps"]) {
    const list = doc[col];
    if (!Array.isArray(list)) { err("academy.json", `expected ${col}: []`); continue; }
    ids(list, col, col);
    list.forEach((it, i) => {
      if (it.media) ctx.mediaRefs.push([`${col}[${i}]`, it.media]);
      walk(it, `${col}.${it.id}`, col, ctx);
    });
  }
}

function checkMedia(doc, ctx) {
  const list = doc?.assets;
  if (!Array.isArray(list)) { err("media.json", "expected { assets: [] }"); return; }
  ctx.mediaIds = new Set();
  list.forEach((m, i) => {
    const w = `assets[${i}] (${m?.id})`;
    if (!/^V-[0-9A-Z]+(-[0-9A-Z]+)*$/.test(m?.id || "") && !/^P-[a-z0-9-]+$/.test(m?.id || "")) err(w, "id must be a brief id like V-33 (AI) or P-<slug> (photo)");
    else if (ctx.mediaIds.has(m.id)) err(w, "duplicate media id");
    else ctx.mediaIds.add(m.id);
    if (!isStr(m.path) || !/^img\//.test(m.path)) err(w, "path must be under img/");
    if (!["placeholder", "delivered", "approved", "rejected"].includes(m.status)) err(w, "status must be placeholder|delivered|approved|rejected");
    if (m.decorative !== true && !isStr(m.alt)) err(w, "alt text required (or decorative: true)");
    if (m.status === "approved" && !existsSync(join(ROOT, m.path))) err(w, `approved asset missing on disk: ${m.path}`);
    const c = m.credit || {};
    if (c.type === "ai-generated") {
      if (!isStr(c.tool)) err(w, "credit.tool required for AI-generated images");
      if (m.shows_real_temple && m.disclosure_visible !== true) err(w, "AI image of a real temple must show a visible 'AI-generated illustration' caption");
    } else if (c.type === "cc" || c.type === "public-domain") {
      for (const k of ["author", "license", "source_url"]) if (!isStr(c[k])) err(w, `credit.${k} required`);
    } else if (c.type !== "original-code") err(w, "credit.type must be ai-generated | cc | public-domain | original-code");
    for (const h of m.hotspots || []) {
      ctx.elementRefs.push([w, h.element_id]);
      for (const k of ["x", "y", "w", "h"]) if (typeof h[k] !== "number" || h[k] < 0 || h[k] > 100) err(w, `hotspot ${h.element_id}.${k} must be a percentage 0–100`);
    }
  });
}

// ---------------------------------------------------------------- main
function newCtx(sources) {
  return { sources, usedSources: new Set(), templeRefs: [], elementRefs: [], mediaRefs: [], eraRefs: [],
    templeIds: null, elementIds: null, mediaIds: null, eraIds: null };
}

function crossRefs(ctx) {
  const check = (refs, set, label) => {
    if (!set) return;
    for (const [w, id] of refs) if (!set.has(id)) err(w, `unknown ${label} "${id}"`);
  };
  check(ctx.templeRefs, ctx.templeIds, "temple id");
  check(ctx.elementRefs, ctx.elementIds, "element id");
  check(ctx.mediaRefs, ctx.mediaIds, "media id");
  check(ctx.eraRefs, ctx.eraIds, "era id");
}

const CHECKERS = { temples: checkTemples, timeline: checkTimeline, glossary: checkGlossary, elements: checkElements, academy: checkAcademy, media: checkMedia };

function runData() {
  if (!existsSync(DATA_DIR)) { err(DATA_DIR, "data directory not found"); return; }
  const srcDoc = loadJson(join(DATA_DIR, "sources.json"));
  const sources = checkSources(srcDoc?.sources ?? [], "sources");
  const ctx = newCtx(sources);
  // media first so its ids exist; elements/timeline/temples before cross-refs
  for (const name of ["media", "elements", "timeline", "temples", "glossary", "academy"]) {
    const doc = loadJson(join(DATA_DIR, `${name}.json`));
    if (doc) CHECKERS[name](doc, ctx);
    else warn(`${name}.json`, "not present yet");
  }
  crossRefs(ctx);
  for (const id of sources.keys()) if (!ctx.usedSources.has(id)) warn(`sources (${id})`, "source is never cited");
}

function runStaged(file) {
  const frag = loadJson(resolve(file), true);
  if (!frag) return;
  const w = file;
  if (!["temples", "timeline", "glossary", "elements", "academy", "sources"].includes(frag.target)) {
    err(w, "fragment.target must be temples|timeline|glossary|elements|academy|sources"); return;
  }
  const registry = loadJson(join(DATA_DIR, "sources.json"))?.sources ?? [];
  const merged = [...registry.filter((s) => !(frag.sources || []).some((n) => n.id === s.id)), ...(frag.sources || [])];
  const sources = checkSources(merged, "sources(+staged)");
  const ctx = newCtx(sources);
  if (frag.target === "sources") return;
  const items = frag.items;
  if (!Array.isArray(items) || !items.length) { err(w, "fragment.items must be a non-empty array"); return; }
  const wrap = { temples: { temples: items }, timeline: { eras: items }, glossary: { terms: items }, elements: { elements: items } };
  if (frag.target === "academy") {
    const col = frag.collection;
    if (!["temple_types", "why_questions", "builder_steps"].includes(col)) { err(w, "academy fragments need collection: temple_types|why_questions|builder_steps"); return; }
    ids(items, col, col);
    items.forEach((it) => walk(it, `${col}.${it.id}`, col, ctx));
  } else {
    CHECKERS[frag.target](wrap[frag.target], ctx);
  }
  // cross-refs are checked against the live data folder in the post-merge full run
}

try {
  if (STAGED) runStaged(STAGED);
  else runData();
} catch (e) {
  console.error(`validator crashed: ${e.stack}`);
  process.exit(2);
}

const failing = STRICT ? [...errors, ...warnings] : errors;
if (AS_JSON) {
  console.log(JSON.stringify({ ok: failing.length === 0, strict: STRICT, errors, warnings }, null, 2));
} else {
  const fmt = (x) => `  - ${x.where}: ${x.msg}`;
  if (errors.length) console.log(`ERRORS (${errors.length})\n${errors.map(fmt).join("\n")}`);
  if (warnings.length) console.log(`WARNINGS (${warnings.length})\n${warnings.map(fmt).join("\n")}`);
  console.log(failing.length ? `\nFAIL${STRICT ? " (strict)" : ""}` : `\nPASS — ${errors.length} errors, ${warnings.length} warnings`);
}
process.exit(failing.length ? 1 : 0);
