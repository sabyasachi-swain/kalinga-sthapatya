# Temple page as a journey — decided spec (2026-09-19, design agent; human asked for it, build NOT started)

Human feedback: page "not cohesive, not premium, info far apart, headache… should feel like a JOURNEY:
this is the temple → how it was built → the different parts. Keep it brief. Arrange the images."
First target: `temples/parasuramesvara.html`; everything generic so the other 4 temples reuse it.

## Structure (one guided walk; 12-col grid ≤1200px, 32px gap; 375px = 1 col, image → text)
0. **Arrive (hero)** — full-bleed V-60 (`height: clamp(360px,70vh,680px)`, cover, object-position 65% 50%;
   375px: 4/3, 72% 50%). Cream card overlapping bottom-left: kicker `location.place`, H1 `name`,
   `one_liner` claim, button "Start the tour ↓" (#stop-meet). Drop the period pill (date lives in passport).
1. **Meet the temple** (white) — narration (no facts) "First, say hello…". Left 7 cols image (Meet frame),
   right 5 cols: story card `sections.parts.intro.*` + **Temple passport** (When? = facts.date,
   In whose time? = facts.dynasty, For which god? = facts.deity: value + tier dot + [n]; "How do we know?"
   `<details>` holds text + note as plain "For grown-ups:" paragraph — no nested details).
   Full-width "How tall?" band: existing scale drawing (V-61+V-51+V-52, ≤360px) + facts.height + computed sentence.
   Null facts → "Still being checked" line in the Sources appendix. `why_built` claims (other temples) = cards here.
2. **How it was built** (warm) — left 7: video V-64V 16:9 click-to-play facade (poster V-64A; `preload` never);
   right 5: numbered story cards `sections.construction.*`.
3. **The parts** (white) — opener = exploded frame (V-64C now; V-64D annotated later), ≤960px centred.
   Guided tour: desktop ≥900px sticky stage (V-62 inlined, ~440px, top 140px) + steps (min-height 70vh);
   IntersectionObserver sets `data-focus` → highlight SVG groups (others opacity .35). Mobile: no sticky stage,
   each step has a 112px static-highlight thumbnail (works without JS). Step = kicker "Part n of N", H3 =
   elements.json name, muted definition (or "What it means: not yet verified"), wired claim cards.
   Parasuramesvara wiring: 1 jagamohana (special.1, special.2) · 2 bada (special.0, base claim) · 3 gandi+mastaka
   (special.3). Unwired `special` → "More to spot" (3 visible, rest in "See N more").
4. **Its family** (warm) — `sections.influences.*` as 3-col cards + "Visit another temple" card (next higher
   sort_year; its silhouette 96px + name).
Appendix: "Where our facts come from" — sourcesList(legend) + "Still being checked: …" from null facts.

## Cohesion devices
- Sticky **journey rail** under the nav (`nav.journey-rail > ol`, 4 numbered anchors, 52px, aria-current="step",
  gold underline; 375px: four 44px number circles + current title). `scroll-padding-top: 132px` on temple pages.
- "Next stop ↓" pill at each stop end + 2px dotted gold "path" line into the next stop.
- One frame style `.journey-frame` (8px radius, 1px border, warm fill, locked ratio, 14px caption; interim assets
  add "Draft picture: its labels are not checked yet."). One card style `.story-card` (3px gold left rule).
- Cut: quick-facts strip (→ passport), accordions (→ stops), build tab switcher + js/buildSequence.js,
  V-63 on this page (keep as Meet fallback for others), "Look closer" merged into the tour; Sketchfab → "Explore in 3D" details.

## Brevity
~3 min, ≤450 words on the main path; ≤130 words/stop; ≤40 words/card; notes & fact texts collapsed.
Reshapes for fact-checker (no new facts): split parts.intro.0 (two parts | base = 3 mouldings);
trim construction.1 ≤40 words; split influences.2 (Aihole | pot-and-leaf pillars → bada step);
split influences.0 (lesson book | later halls one door → jagamohana step); optional trim special.0.
(Re-plan the wiring after the parasuramesvara-2 claims are merged — many new "wow" claims.)

## Implementation
- NEW `scripts/build/lib/journey.mjs` (journeyRail, journeyStop, storyCard, passport, partsTour, videoFacade,
  resolveClaimPath, render ledger: every approved claim rendered exactly once — warn / fail in --check).
- NEW `scripts/build/journeyWiring.mjs` (per-temple tour arrays; move ISOMETRIC_BY_TEMPLE_ID here). No schema change.
- REWRITE `scripts/build/pages/temple.mjs` → hero → rail → meet → build → parts → family → sources; empty stops dropped.
  Media chosen generically by media.json `temple_id` + `role` (build-sequence order 1..n, build-video + poster).
- `components.mjs`: claim() noteMode, claimValue(), figure() interim caption + srcset, inlineSvgAsset({stripStyle}).
- REWRITE `css/pages/temple.css` (~300 lines); motion only under prefers-reduced-motion: no-preference.
- NEW `js/templeJourney.js` (~4 KB): rail observer, tour observer, video facade. Delete js/buildSequence.js.
- V-62 SVG's inline `<style>` leaks global `.outline/.detail` → strip, scope under `.parts-drawing`.

## Acceptance
1440: hero fills first screen with H1+hook+CTA; rail tracks stops; 7/5 grids, no empty right band; tour highlight
moves hall → wall → tower; page ≤5,500px. 375: no overflow; rail targets ≥44px; tour thumbs correct without JS;
page ≤9,000px. Both: all claims render exactly once with dot + [n]; no facts in template copy; works without JS;
keyboard order sane, focus not under sticky bars; reduced motion respected; `node scripts/build.mjs --check` clean.
