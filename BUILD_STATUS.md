# Build Status

Maintained by the orchestrator (main session). Subagents cannot edit this file.

**Current phase:** 1.1 — research wave 1 (konark · lingaraj · history) · **Next gate:** G2 — research review

## Gates

| Gate | Status | Date | Decision / notes |
|---|---|---|---|
| G0 plan amendments, decisions D1–D6 | ✅ approved | 2026-09-18 | A1–A15 approved. D1 pre-render · D2 OpenStreetMap outline · D3 per-claim sign-off for catalogue/snippet evidence · D4 Opus research/fact-check, Sonnet others · D5 git, repo `kalinga-sthapatya` · D6 Konark reconstruction optional P2, captioned |
| G1 source registry | ✅ approved | 2026-09-18 | 23 sources merged; openlibrary.org approved. Items 2–7 below stay open (non-blocking: those works can't be cited until resolved). |
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
- [x] Phase 2 — frontend foundation (2026-09-18, commit 2339a57; verified in headless Chrome 1440px + true 375px)
- [ ] Phase 3 — data-driven pages
- [ ] Phase 4 — visual integration (G4 per asset)
- [ ] Phase 5 — QA, strict validation → G5 → deploy

## G1 open items (human)

1. ~~openlibrary.org~~ approved 2026-09-18.
2. whc.unesco.org/en/list/246 (Konark listing) returns 403 to agents → human opens it in a browser and confirms; then it is registered.
3. Sahoo 2012 *Odisha Review* PDF — site has an expired TLS certificate → human confirms the PDF is reachable, or we drop it.
4. Parida 1999 *Early Temples of Orissa* — no library record found → drop unless the human has a copy/record.
5. Silpa Prakasa revised edition (`baumer-das-das-nd`) — confirm year (2005?) and ISBN 9788120820524.
6. ~~Epigraphia Indica XIII p. 159 author~~ — resolved 2026-09-19: **R. D. Banerji** (byline on the article's first page; real title "Inscriptions in the Udayagiri and Khandagiri caves", not "Minor inscriptions of Kharavela").
7. Donaldson — which volume ISBN 9789004071735 covers.
8. Substitutions accepted by the fact-checker: Percy Brown 1959 printing (1942 copy online is the Islamic volume); Debala Mitra *Bhubaneswar* 1978 4th edition (1958 edition unconfirmed); Debala Mitra *Konarak* via 2003 reprint.

## G2 items collecting (for the human's research review)

- **Era framework (revisits G0 decision A14):** no accessible source uses "Formative / Transitional / Mature"; Percy Brown 1959 (full text) uses Early c. 750–900 / Middle c. 900–1100 / Later c. 1100–1250. Decide: relabel/rebound the eras to a citable framework, or keep labels as our own editorial grouping (stated as such, not attributed to scholars).
- Konark: surviving jagamohana height (Mitra ~39 m vs ASI web 30 m vs Brown 100 ft); collapse timing (1837 vs 1848); sand-fill 1901–1905; Kalapahar (Behera: no reliable evidence); craftsmen 12 vs 16 years (tradition either way).
- Lingaraja: patron (Panigrahi: Yayati II + Uddyota Kesari); height (180 ft vs 128 ft, no ASI figure); natamandira 1099–1104 CE only from Fergusson's rejected king list.
- Dates vs research report: Parasuramesvara (Brown: late 8th c., report c. 650); Mukteshvara (Brown c. 975); Vaital Deul (Brown c. 900); Jagannath (Brown c. 1100 vs 1112).
- Era 6 representative: Kapilesvara temple, Bhubaneswar (Panigrahi, hedged).
- Implementation plan's map/timeline filter labels ("6th–7th, 9th–10th") don't match any sourced periods → Phase 3 derives filters from approved era data.

## Repository

- Remote `origin` = https://github.com/sabyasachi-swain/kalinga-sthapatya.git (empty on 2026-09-18) · future Pages URL https://sabyasachi-swain.github.io/kalinga-sthapatya/
- Pushed to origin/main 2026-09-18 (human-approved).

## Running

- Research wave 1: konark ✅ fact-checked (11 approved, 18 revised, 0 rejected, 0 needs-human; staged passes) · history + lingaraj fact-checks running. Wave 2 next: parasuramesvara, mukteshwar, jagannath-puri, architecture.
- Phase 4 batch 1: review done → visual-briefs/BATCH-1-REVIEW.md. 12 ready, 3 ready-with-notes, 6 good-but-low-res, 10 to regenerate (V-33 text+trident; V-43–45 domes). Waiting on the human.

## Blocked

(none)

## Incidents

- 2026-09-19 ~00:10 IST — second usage-limit stop (reset 04:00). All three ledgers had been saved; fact-check and asset check resumed 05:12.
- 2026-09-18 ~20:35 IST — all three running agents stopped on an account usage limit (reset 22:40). Nothing had been written. Resumed at 23:08 with their context intact.

## Proposals from agents (not yet applied)

(none)
