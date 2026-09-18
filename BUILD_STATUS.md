# Build Status

Maintained by the orchestrator (main session). Subagents cannot edit this file.

**Current phase:** 1.0 done → waiting at G1 · Phase 2 — Frontend foundation (running) · **Next gate:** G1 — source registry review (see "G1 open items")

## Gates

| Gate | Status | Date | Decision / notes |
|---|---|---|---|
| G0 plan amendments, decisions D1–D6 | ✅ approved | 2026-09-18 | A1–A15 approved. D1 pre-render · D2 OpenStreetMap outline · D3 per-claim sign-off for catalogue/snippet evidence · D4 Opus research/fact-check, Sonnet others · D5 git, repo `kalinga-sthapatya` · D6 Konark reconstruction optional P2, captioned |
| G1 source registry | open | 2026-09-18 | 23 sources merged into data/sources.json (details: research/verdicts/sources.md). Human checks listed below. |
| G2 research review | — | | |
| G3 visual briefs | — | | |
| G4 visual assets | — | | per asset in data/media.json |
| G5 launch | — | | |

## Done (2026-09-18 setup)

- [x] Guardrail tooling: `scripts/validate-content.mjs`, `scripts/merge-staged.mjs` (tested: blocks bad data, rolls back failed merges)
- [x] Hooks: file ownership per agent (19/19 test cases pass), validator on data edits (confirmed live)
- [x] Skills: kalinga-orchestrator, kalinga-content-policy (+pitfalls), kalinga-data-schema (+reference), kalinga-design-system, gemini-visual-brief
- [x] Agents: researcher, fact-checker, visual-brief-writer, frontend-builder, asset-integrator, qa-auditor
- [x] Empty data skeletons in `data/` (validator PASS)
- [x] Visual requirements for Gemini: `visual-briefs/VISUAL_REQUIREMENTS.md`
- [x] `data/media.json` seeded with 48 placeholder entries (integrator). Orchestrator fix: V-24 and V-38 depict Konark → disclosure captions added.

## Phase checklist

- [x] Phase 0 — G0, git init, skeleton (2026-09-18)
- [x] Phase 1.0 — source registry (23 sources merged 2026-09-18) → G1 open
- [ ] Phase 1.1–1.3 — research + fact-check (parasuramesvara · mukteshwar · lingaraj · jagannath-puri · konark · architecture · history)
- [ ] Phase 1.4–1.5 — REVIEW.md → G2 → merge
- [ ] Phase 1V — briefs (global now, temples after 1.5) → G3
- [ ] Phase 2 — frontend foundation
- [ ] Phase 3 — data-driven pages
- [ ] Phase 4 — visual integration (G4 per asset)
- [ ] Phase 5 — QA, strict validation → G5 → deploy

## G1 open items (human)

1. openlibrary.org as catalogue host for `mitra-d-1978` → approve domain?
2. whc.unesco.org/en/list/246 (Konark listing) returns 403 to agents → human opens it in a browser and confirms; then it is registered.
3. Sahoo 2012 *Odisha Review* PDF — site has an expired TLS certificate → human confirms the PDF is reachable, or we drop it.
4. Parida 1999 *Early Temples of Orissa* — no library record found → drop unless the human has a copy/record.
5. Silpa Prakasa revised edition (`baumer-das-das-nd`) — confirm year (2005?) and ISBN 9788120820524.
6. Epigraphia Indica XIII p. 159 — who authored the Udayagiri–Khandagiri inscriptions article (R.D. Banerji vs L.D. Barnett)? Must be checked before citing.
7. Donaldson — which volume ISBN 9789004071735 covers.
8. Substitutions accepted by the fact-checker: Percy Brown 1959 printing (1942 copy online is the Islamic volume); Debala Mitra *Bhubaneswar* 1978 4th edition (1958 edition unconfirmed); Debala Mitra *Konarak* via 2003 reprint.

## Repository

- Remote `origin` = https://github.com/sabyasachi-swain/kalinga-sthapatya.git (empty on 2026-09-18) · future Pages URL https://sabyasachi-swain.github.io/kalinga-sthapatya/
- First push: waiting for the human's go-ahead (outward action).

## Running

- kalinga-frontend-builder → Phase 2 foundation (build script, CSS, JS, index/about/404, dev fixtures)

## Blocked

(none)

## Incidents

- 2026-09-18 ~20:35 IST — all three running agents stopped on an account usage limit (reset 22:40). Nothing had been written. Resumed at 23:08 with their context intact.

## Proposals from agents (not yet applied)

(none)
