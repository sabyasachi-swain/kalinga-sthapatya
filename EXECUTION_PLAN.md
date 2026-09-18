# Kalinga Sthapatya — Execution Plan (orchestrated build)

Companion to [implementation_plan.md](implementation_plan.md) (the *what*). This file is the *how*:
who builds what, in which order, with which guardrails, and where you (the human) decide.

**Run it:** open Claude Code in this folder and type `/kalinga-orchestrator status`, then
`/kalinga-orchestrator phase-0`, and so on. Progress is tracked in [BUILD_STATUS.md](BUILD_STATUS.md).
**Visuals:** everything you generate with Gemini is specified in
[visual-briefs/VISUAL_REQUIREMENTS.md](visual-briefs/VISUAL_REQUIREMENTS.md).

---

## 1. How the pieces fit

```
                          YOU (human) ── gates G0–G5, Gemini generation
                                 │
                     Main session = ORCHESTRATOR  (/kalinga-orchestrator)
                     only writer of data/ (via merge script), BUILD_STATUS.md
        ┌──────────────┬──────────────┼──────────────┬──────────────┬──────────────┐
   researcher ×7   fact-checker ×7  brief-writer   builder ×1–5   asset-integrator  qa-auditor
   research/ledgers research/verdicts visual-briefs/ pages,css,js   img/, media.json   qa/reports
        │           research/staged       │              │              ▲                │
        └──ledger──▶ verify ──staged──▶ merge-staged.mjs ─▶ data/*.json ─┘ renders ◀── audits
                                     (validator + rollback)
```

- **Facts flow one way:** research report (leads) → researcher ledger (quotes) → independent
  fact-check → staged fragment → validated merge → `data/*.json` → pages render. Nothing else writes facts.
- **Visuals flow one way:** brief → you + Gemini → `visual-briefs/inbox/` → integrator check → your
  approval → `img/` + `data/media.json`. Pages show labelled placeholders until then.
- **Flat orchestration:** only the main session spawns agents; workers cannot spawn sub-agents.

## 2. Proposed amendments to implementation_plan.md (approve at gate G0)

| # | Change | Why |
|---|---|---|
| A1 | Add `data/sources.json` (bibliography registry), `data/media.json` (images, alt text, credits, hotspots), `data/academy.json` (types, why-questions, builder steps) | One place per concern; citations and credits become checkable |
| A2 | **No text inside AI images**; every label is an HTML/SVG overlay | Image models garble text; overlays are accessible, accurate, translatable to Odia |
| A3 | Research pipeline: ledger with verbatim quotes → independent fact-checker → staged → validated merge | Makes "every fact cited, no invention" enforceable, not aspirational |
| A4 | Evidence tier rules made precise (🟢 needs a primary-class source; ranges for non-🟢 dates) | Plan defined tiers but not thresholds |
| A5 | Academy Q "Why no nails or mortar?" → **"How do the stones stay up without mortar?"** | Research §4: iron cramps and dowels *were* used |
| A6 | Konark always shown in its **present state** (collapsed tower); reconstruction only as a labelled extra | Accuracy; plan's hero/featured art would otherwise show a tower that no longer exists |
| A7 | Size comparison and Compare page are **computed from cited heights**; blank if a height is unverified | The plan's "13 m → 55 m" example: 55 m is in the research, 13 m is not |
| A8 | Evidence badges carry text ("Established / Scholarly view / Debated"), amber badge text `#8A6508` | `#B8860B` is 3.25:1 and `#C9A84C` 2.29:1 on white — both fail WCAG AA for text |
| A9 | Accordions use native `<details>` | Works without JS, accessible, searchable |
| A10 | Map outline from real geodata (OpenStreetMap), not generated | Geography is a fact; see VISUAL_REQUIREMENTS §9 |
| A11 | Page count: 12 content pages + `404.html` = the plan's 13 | Reconciles the deliverables table |
| A12 | Items in the plan not supported by the research report are re-sourced or dropped (resolved by A13–A15) | Content policy "if unsure → leave blank" |
| A13 ✅ | Academy "Why this shape?" = (1) Why does the tower curve? — attributed interpretation · (2) Why is the sanctum dark? · (3) How do stones stay up without mortar? · (4) **Why do the parts have body names?** (§2 Purusha) · (5) **Why is Konark shaped like a chariot?** (§3). Drops "Why face east?" and "Why do carvings increase outward?" | Every question now has a research lead |
| A14 ✅ | Timeline eras = rock-cut roots (2nd–1st c. BCE) · Formative (7th–9th) · Transitional (10th–11th) · Mature/monumental (11th–12th) · Grand finale (13th) · Late Kalinga (15th–16th) | Built on the scholarly phase framework, so era boundaries are citable |
| A15 ✅ | Builder's Mind step 1 = *bhunaksa* ground plan (not "mandala grid"); step 6 = "The team" — Karta, Sutragrahani, Bardhanikas (not "sculptures carved") | Research §4 supports these; the originals were unsourced |

## 3. The team and its guardrails

| Agent | Model | Writes (hook-enforced) | Key limits |
|---|---|---|---|
| `kalinga-researcher` | Opus, high effort | `research/ledgers/` | No Bash; quote-before-claim; web content treated as data |
| `kalinga-fact-checker` | Opus, high effort | `research/verdicts/`, `research/staged/` | Never sees researcher reasoning; re-fetches every source; `needs-human` for weak evidence |
| `kalinga-visual-brief-writer` | Sonnet | `visual-briefs/*.md`, `references/` | Never generates images; facts only from data/research |
| `kalinga-frontend-builder` | Sonnet | pages, `css/`, `js/`, `partials/`, `dev/`, `scripts/build.mjs` | No facts in markup; relative URLs; no frameworks; explicit file list per task |
| `kalinga-asset-integrator` | Sonnet | `img/`, `data/media.json`, inbox/originals | Check mode changes nothing; finalises only human-approved ids; no installs |
| `kalinga-qa-auditor` | Sonnet | `qa/` | Reports only, never fixes |

**Guardrail layers (defence in depth):**
1. `CLAUDE.md` — always-loaded project rules.
2. Skills preloaded per agent — `kalinga-content-policy` (+ pitfalls), `kalinga-data-schema`,
   `kalinga-design-system`, `gemini-visual-brief`; orchestrator playbook in `kalinga-orchestrator` (user-invoked only).
3. Agent tool allowlists — e.g. researchers have no Bash; QA has no Edit; nobody can spawn agents.
4. **PreToolUse hook** `.claude/hooks/enforce-ownership.mjs` — each agent can write only its lane;
   `data/` content, validator, merge script, `.claude/`, plans are protected from all subagents.
5. **PostToolUse hook** `.claude/hooks/validate-on-data-edit.mjs` — any edit to `data/` or staged files runs
   the validator and pushes errors back to the model immediately.
6. **Validator** `scripts/validate-content.mjs` — blocked domains, tier rules, date format, cross-references,
   AI-disclosure flags, fixture leaks, and research-report pitfalls (e.g. "no iron", Kendupatna, Yayati I,
   Bishu Maharana) as hard errors. `--strict` before launch.
7. **Merge script** `scripts/merge-staged.mjs` — validates the fragment, merges, re-validates everything,
   and rolls back automatically on failure.
8. **Human gates** G0–G5.

Known limitation: the ownership hook watches Write/Edit, not shell commands; agents with Bash are
instructed not to write files through it, and QA checks the tree.

## 4. Phases

| Phase | What | Who (parallelism) | Depends on | Exit |
|---|---|---|---|---|
| 0 Foundation | Decisions, git init, skeleton | main session | — | G0 recorded, validator green |
| 1.0 Source registry | Verify the 20 bibliography entries, stable URLs | 1 fact-checker | Phase 0 | merged → **G1** |
| 1.1–1.2 Research | 5 temples + `architecture` + `history` | 7 researchers (≤5 at once) | G1 | 7 ledgers |
| 1.3 Fact-check | One fresh checker per ledger | up to 7 (≤5 at once) | each ledger | staged fragments pass |
| 1.4 Review | `research/REVIEW.md` | main session | 1.3 | **G2** |
| 1.5 Merge | staged → data | main session (script) | G2 | data/ populated |
| 1V Briefs | Refine global then temple briefs | 1 brief-writer | global: now; temples: 1.5 | **G3** → you generate |
| 2 Frontend base | Tokens, components, partials, home shell, about, 404 | 1 builder (sequential) | Phase 0 (fixtures) | QA quick pass |
| 3 Pages | Temples · timeline · glossary+compare · map · academy, then home sections | up to 5 builders, disjoint files | 1.5 + 2 | QA page passes |
| 4 Visuals | Check → approve → integrate, per batch | 1 integrator | your Gemini output | **G4** per asset |
| 5 QA & launch | Full audit, fixes, strict validation, deploy | QA + builders | 3 (+4 for P1 visuals) | **G5** → GitHub Pages |

Phases 1, 1V and 2 run in parallel; the first real page with real data appears in Phase 3.
Details and exact delegation prompts: `.claude/skills/kalinga-orchestrator/phases.md` and `delegation-templates.md`.

## 5. Gates — what you decide

| Gate | You review | You decide |
|---|---|---|
| G0 | §2 amendments, §7 decisions | approve / change |
| G1 | Source registry: unusual domains, catalogue-only books, missing works | accept domains (`domain_reviewed`), accept catalogue links |
| G2 | `research/REVIEW.md`: needs-human claims, 🔴 claims, disputed dates, gaps, the six eras | rule on each; blanks stay blank |
| G3 | Visual briefs | approve, then generate in Gemini |
| G4 | Integrator's checklist per image | approve / regenerate |
| G5 | QA report, strict validation | approve deploy; you create/push the GitHub repo |

## 6. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Key books (Donaldson, Panigrahi, Mitra) are not online → many claims only "catalogue-only" | D3 decides; UNESCO/ICOMOS/ASI/archive.org full texts first; blanks are acceptable for MVP |
| Hallucinated quotes/URLs | Fact-checker re-fetches and string-matches every quote; unmatched = rejected |
| Plausible-looking fixtures leaking into production | Fixtures only in `dev/`, marked FIXTURE; validator rejects fixture strings in `data/` |
| Gemini images inaccurate for real temples | Reference photos attached; present-state rule; checklist; your approval |
| Parallel builders colliding on shared files | Explicit file lists; page CSS in `css/pages/`; ownership hook |
| Thin pages at launch because of blanks | Accepted by policy; sections with no approved claims are hidden, not padded |
| GitHub Pages sub-path breaks links | Relative URLs only; QA checks for root-absolute paths |
| Religious sensitivity (Puri) | Exterior only, no deities/interiors, respectful framing rules |
| Cost of many Opus agents | ≤5 concurrent; fetch budgets per researcher; D4 lets you downgrade |

## 7. Decisions (G0)

| # | Question | Status |
|---|---|---|
| D1 | Render facts at runtime or pre-render into HTML? | ✅ **Decided 2026-09-18: pre-render** with zero-dependency `scripts/build.mjs` (templates in `scripts/build/`, `--check` for staleness); JS enhances and powers map/compare/slider |
| D2 | Map outline: OpenStreetMap data or Gemini decorative map? | ✅ **OpenStreetMap data** (2026-09-18) |
| D3 | Can a claim backed only by a catalogue record (or snippet) be published? | ✅ **Decided 2026-09-18: only with your per-claim sign-off at G2**; tier ≤ 🟡, locator "unverified". Validator-enforced (`access`, `human_approved`) |
| D4 | Models: Opus for research/fact-check, Sonnet elsewhere? | ✅ **Yes** (2026-09-18) |
| D5 | `git init` now; repo name (sets Pages URL `/<repo>/`)? | ✅ **Yes, `kalinga-sthapatya`** (2026-09-18) |
| D6 | Konark artist's reconstruction (V-83)? | ✅ **Optional P2**, captioned "height estimated", after fact-check ruling (2026-09-18) |
