# Phase playbooks

Each phase: entry gate → tasks (agent, parallel group) → outputs → exit criteria.
Topic ids used for research: `parasuramesvara`, `mukteshwar`, `lingaraj`, `jagannath-puri`, `konark`,
`architecture` (types, elements, glossary, academy), `history` (timeline eras, dynasties).

## Phase 0 — Foundation (main session; ~1 session)

Entry: user has read EXECUTION_PLAN.md.
1. G0: walk the user through amendments A1–A12 and decisions D1–D5; record answers in BUILD_STATUS.md.
2. With approval: `git init`, `.gitignore` (research/backups/, qa/reports/*.html, node_modules/), first commit.
3. Folder skeleton per implementation_plan.md + additions (already partly present).
4. Confirm `node scripts/validate-content.mjs` passes on empty data.
Exit: gate G0 recorded; repo committed; validator green.

## Phase 1 — Research & fact-check

**1.0 Source registry** — 1 × `kalinga-fact-checker` (foreground).
Input: bibliography table of the research report. Output: `research/staged/sources.json`
(`target: "sources"`), `research/verdicts/sources.md` (which entries found, URL kind, which not found).
Then: merge (`node scripts/merge-staged.mjs research/staged/sources.json`) → **G1** (show unusual
domains, catalogue-only books, missing items).

**1.1 Temple research** — 5 × `kalinga-researcher` in parallel (background), one per temple topic.
Output: `research/ledgers/<temple>.json`.

**1.2 Cross-cutting research** — 2 × `kalinga-researcher` (`architecture`, `history`), may run with 1.1
(max 5 concurrent total → start them as temple researchers finish). Fixed scope (decided at G0):
- `history` — the six eras: (1) rock-cut roots 2nd–1st c. BCE, (2) Formative 7th–9th c., (3) Transitional
  10th–11th c., (4) Mature/monumental 11th–12th c., (5) Grand finale 13th c. (Konark, Ananta Vasudeva),
  (6) Late Kalinga 15th–16th c. (Gajapatis). Cite the phase framework itself (Behera 1993, Parida 1999,
  Mohapatra 1986, Sahoo 2012) and each era's period, design change, dynasty, example temples. Also find a
  sourced representative temple for era 6 (needed for its silhouette brief).
- `architecture` — three temple types; elements (pista, bada + five bada parts, gandi, paga/ratha, bhumi-amla,
  mastaka parts, jagamohana, natamandira, bhogamandapa, torana); glossary (20+ terms); Academy
  "Why this shape?" set: (1) why the tower curves — attributed interpretation, (2) why the sanctum is dark,
  (3) how stones stay up without mortar — iron cramps/dowels, counterpoise, corbelling, (4) why the parts
  have body names — Purusha analogy, (5) why Konark is shaped like a chariot; Builder's Mind steps:
  bhunaksa ground plan → laterite platform → bada → gandi (corbelling, ramps/rollers/pulleys) → mastaka →
  "the team" (Karta, Sutragrahani, Bardhanikas); the ayudha concept (generic — differs per deity).

**1.3 Fact-check** — 1 × `kalinga-fact-checker` per finished ledger (fresh instance, background).
Output: `research/verdicts/<topic>.json` + `research/staged/<topic>.json` (approved/revised only).
The architecture topic produces several staged files (elements, glossary, academy-*).

**1.4 Review pack** — you write `research/REVIEW.md`: per topic counts (approved/revised/rejected/
needs-human), every needs-human claim with its evidence, every 🔴 claim, all gaps, disputed dates.
→ **G2**. Apply the user's rulings by asking the fact-checker to update staged files (never edit claims yourself).

**1.5 Merge** — `node scripts/merge-staged.mjs --dry-run research/staged/*.json`, then real merge
(order: sources → elements → timeline → temples → glossary → academy). Validator must pass.
Exit: data/ populated, validator green, BUILD_STATUS updated.

## Phase 1V — Visual briefs (parallel with Phase 1 and 2)

1. `kalinga-visual-brief-writer` refines global briefs (V-00…V-52) — can start immediately.
2. After Phase 1.5, it refines temple briefs (V-60+) with verified facts and reference-photo lists.
→ **G3**: user reviews, then generates with Gemini and drops files into `visual-briefs/inbox/`.

## Phase 2 — Frontend foundation (parallel with Phase 1; uses dev fixtures)

1 × `kalinga-frontend-builder` (sequential — shared CSS):
tokens + base CSS, partials (nav/footer) + `scripts/build.mjs` pre-renderer (decision D1: bakes data
into HTML, `--check` mode for staleness; templates in `scripts/build/`), `js/main.js`
(nav, accordion enhancement, tooltip, info panel, placeholder + evidence badge + citation renderers),
`index.html` shell, `about.html` (policy text from CLAUDE.md/content-policy, not invented), `404.html`,
`dev/fixtures/*.json` (obviously fake: "FIXTURE Temple A").
→ `kalinga-qa-auditor` quick pass (a11y + links on built pages).
Exit: design system renders; components work keyboard-only; QA quick pass clean.

## Phase 3 — Data-driven pages (after Phase 1.5 and Phase 2)

Parallel builders with disjoint files (page CSS in `css/pages/<page>.css`):
- B1: temple template + 5 temple pages
- B2: `timeline.html` + `js/timeline.js`
- B3: `glossary.html` + `compare.html` + their JS
- B4: `map.html` + `js/map.js`
- B5: `academy.html` + `js/academy.js`
Then 1 builder: home page sections (mini timeline, mini map, featured temple), `sitemap.xml`, `robots.txt`.
After each: qa-auditor page pass; fix loop max 2 rounds per page.

## Phase 4 — Visual integration (continuous, as assets arrive)

On user signal "assets in inbox": 1 × `kalinga-asset-integrator` → checklist report per file → **G4** →
integrator finalises approved files. Rejected → brief-writer adds a "regeneration note" to the brief.

## Phase 5 — QA & launch

1. `kalinga-qa-auditor` full audit (checklist in its definition) → `qa/reports/<date>-full.md`.
2. Builders fix; auditor re-checks (max 3 rounds; then escalate).
3. `node scripts/validate-content.mjs --strict` must pass.
4. **G5**: present report; on approval, walk the user through GitHub repo + Pages (user runs or approves each push).
