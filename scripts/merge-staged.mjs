#!/usr/bin/env node
// Merge fact-checked fragments from research/staged/ into data/*.json — zero dependencies.
// Only the orchestrator (main session) runs this. Subagents never write data/ content files directly.
//
//   node scripts/merge-staged.mjs research/staged/konark.json [more.json ...]
//   node scripts/merge-staged.mjs --dry-run research/staged/*.json
//
// Each fragment is validated first; after merging, the full validator runs and the
// merge is rolled back if it fails. Items are upserted by id.

import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync, unlinkSync } from "node:fs";
import { resolve, dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "data");
const VALIDATOR = join(ROOT, "scripts", "validate-content.mjs");
const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const files = args.filter((a) => !a.startsWith("--"));

const TARGETS = {
  temples: { file: "temples.json", key: "temples" },
  timeline: { file: "timeline.json", key: "eras" },
  glossary: { file: "glossary.json", key: "terms" },
  elements: { file: "elements.json", key: "elements" },
  academy: { file: "academy.json", key: null }, // uses fragment.collection
  sources: { file: "sources.json", key: "sources" },
};

const validate = (extra) => spawnSync(process.execPath, [VALIDATOR, ...extra], { encoding: "utf8" });
const readJson = (f, fallback) => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : fallback);
const writeJson = (f, v) => writeFileSync(f, JSON.stringify(v, null, 2) + "\n", "utf8");

function upsert(list, items) {
  const out = [...list];
  const report = { added: [], replaced: [] };
  for (const it of items) {
    const i = out.findIndex((x) => x.id === it.id);
    if (i >= 0) { out[i] = it; report.replaced.push(it.id); }
    else { out.push(it); report.added.push(it.id); }
  }
  return [out, report];
}

if (!files.length) {
  console.error("usage: node scripts/merge-staged.mjs [--dry-run] research/staged/<topic>.json ...");
  process.exit(2);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = join(ROOT, "research", "backups", stamp);
const touched = new Set();
const created = new Set();
let failed = false;

for (const f of files) {
  const pre = validate(["--staged", f]);
  if (pre.status !== 0) {
    console.log(`✗ ${f} failed staged validation — not merged\n${pre.stdout}`);
    failed = true;
    continue;
  }
  const frag = JSON.parse(readFileSync(f, "utf8"));
  const t = TARGETS[frag.target];

  // new sources travel with any fragment
  if (frag.sources?.length) {
    const p = join(DATA, "sources.json");
    const doc = readJson(p, { sources: [] });
    const [list, rep] = upsert(doc.sources, frag.sources);
    if (!DRY) { backup(p); writeJson(p, { ...doc, sources: list }); }
    console.log(`  sources.json  +${rep.added.length} ~${rep.replaced.length}`);
  }
  if (frag.target === "sources") { console.log(`✓ ${basename(f)} (sources only)`); continue; }

  const p = join(DATA, t.file);
  const key = t.key || frag.collection;
  const doc = readJson(p, t.key ? { [t.key]: [] } : { temple_types: [], why_questions: [], builder_steps: [] });
  const [list, rep] = upsert(doc[key] || [], frag.items);
  if (!DRY) { backup(p); writeJson(p, { ...doc, [key]: list }); }
  console.log(`✓ ${basename(f)} → ${t.file}:${key}  added [${rep.added}] replaced [${rep.replaced}]`);
}

function backup(p) {
  if (touched.has(p)) return;
  touched.add(p);
  if (!existsSync(p)) { created.add(p); return; }
  mkdirSync(backupDir, { recursive: true });
  copyFileSync(p, join(backupDir, basename(p)));
}

if (DRY) { console.log("\n(dry run — nothing written)"); process.exit(failed ? 1 : 0); }

const post = validate([]);
if (post.status !== 0) {
  console.log(`\nFull validation failed after merge — rolling back.\n${post.stdout}`);
  for (const p of touched) {
    if (created.has(p)) unlinkSync(p);
    else copyFileSync(join(backupDir, basename(p)), p);
  }
  process.exit(1);
}
console.log(`\nMerged. Full validation: PASS. Backups: ${existsSync(backupDir) ? backupDir : "none needed"}`);
process.exit(failed ? 1 : 0);
