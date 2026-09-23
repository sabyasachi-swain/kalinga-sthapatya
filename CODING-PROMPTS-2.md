# Coding task prompts — round 2

Same rules as round 1: paste **Block C** from `CODING-PROMPTS.md` first, then **one** task. Each task keeps the
shape **Objective · Facts you may rely on · Steps · Guardrails · Output format · Acceptance**.

**New in round 2 — two checkers now exist in the repo, and every task must pass them:**
- `node scripts/check-links.mjs` → must exit 0 (broken links, duplicate ids, missing alt/width/height).
- `node scripts/qa-probe.mjs --port 8099 --pages <the pages you touched>` → no findings in categories
  A (horizontal overflow), B (media out of its container), F (undefined/null text) or G (broken images).
- `node scripts/build.mjs && node scripts/build.mjs --check && node scripts/validate-content.mjs` must all pass.

| Task | What | Owns | Priority |
|---|---|---|---|
| C10 | Put the map and academy pages live | `scripts/build/registry.mjs`, `scripts/build/config.mjs` | ★★★ |
| C11 | Wire up tap-to-enlarge | `scripts/build/lib/components.mjs`, `scripts/build/pages/temple.mjs` | ★★★ |
| C12 | Accessibility pass on shared components | `css/style.css`, `scripts/build/lib/components.mjs` | ★★★ |
| C13 | Build snapshot tests | `scripts/test-build.mjs` (new), `test/snapshots/*` (new) | ★★★ |
| C14 | Parts-tour controls and progress | `scripts/build/lib/journey.mjs`, `js/templeJourney.js`, `css/pages/temple.css` | ★★ |
| C15 | Timeline page in the journey style | `scripts/build/pages/timeline.mjs`, `css/pages/timeline.css` | ★★ |
| C16 | Home page as the front door | `scripts/build/pages/index.mjs`, `css/style.css` | ★★ |
| C17 | Glossary that works with empty data | `scripts/build/pages/glossary.mjs`, `js/glossary.js`, `css/pages/glossary.css` | ★ |
| C18 | Images: responsive sizes and priorities | `scripts/build/lib/components.mjs`, `css/style.css` | ★ |

---

## C10 — Put the map and academy pages live

```
OBJECTIVE
The map and academy pages were written but are not generated: registry.mjs still emits "coming soon"
stubs for map.html and academy.html. Wire the real pages in and drop the "Soon" tags for them.

FACTS YOU MAY RELY ON
- scripts/build/pages/map.mjs exports renderMap(ctx); scripts/build/pages/academy.mjs exports
  renderAcademy(ctx). Both return a full page via page(ctx, {...}).
- scripts/build/registry.mjs currently holds a STUBS array with map.html and academy.html, rendered by
  comingSoon(s), and getPages(data) returns the page list. Entries carry { outPath, render, sitemap }.
- scripts/build/config.mjs holds siteConfig, including the nav link list; nav entries for Academy, Map
  and Glossary currently render a small "Soon" tag.
- data/academy.json has three EMPTY arrays today, so the academy page renders its "still being written"
  state. That is expected and must stay correct.
- css/pages/map.css, css/pages/academy.css, js/map.js and js/academy.js already exist.

STEPS
1. Import renderMap and renderAcademy in registry.mjs and replace their stub entries with real pages.
   Give each a sitemap entry (priority 0.7 for the map, 0.8 for academy, changefreq monthly).
2. Delete the now-unused STUBS entries for these two pages. If STUBS becomes empty, remove it and the
   comingSoon import — but do not delete pages/comingSoon.mjs itself.
3. In config.mjs, remove the "Soon" marker from the Academy and Map nav entries. Leave Glossary's,
   because data/glossary.json is still empty.
4. Rebuild and confirm both pages carry their stylesheet link and script, and that every internal link
   to them resolves.

GUARDRAILS
- Change only the two named files. Do not edit the page modules, the CSS or the JS.
- Do not add facts anywhere. Do not touch data/*.json.
- Keep 404.html's special handling in registry.mjs exactly as it is.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: `node scripts/build.mjs` writes map.html and academy.html (15 pages total),
`--check` is clean, `node scripts/check-links.mjs` exits 0, and
`node scripts/qa-probe.mjs --port 8099 --pages map.html,academy.html` reports nothing in A, B, F or G.
```

---

## C11 — Wire up tap-to-enlarge

```
OBJECTIVE
js/imageZoom.js and css/components/zoom.css exist but nothing uses them. Make illustrations whose
labels are drawn inside the picture open in the zoom dialog, on the temple pages.

FACTS YOU MAY RELY ON
- js/imageZoom.js enhances any <figure data-zoom="true"> that contains one <img>; without JS the figure
  is unchanged. css/components/zoom.css styles the dialog.
- figure(id, ctx, opts) in scripts/build/lib/components.mjs renders media assets; its opts today are
  { aspect, className, decorative, figClassName, fallbackAlt, eager }. It renders a <figure> whose
  class list starts with "figure".
- A media asset in data/media.json may carry `interim: true`. Those are the pictures with labels drawn
  into them, which are exactly the ones that need enlarging. Assets are read through ctx.data.mediaById.
- scripts/build/pages/temple.mjs calls figure() for the hero, the "meet" media and the parts opener.
- Page stylesheets are linked per page through headExtra; scripts through the page()'s `scripts` array.

STEPS
1. Add a `zoom` option to figure(): when true (or when the asset has interim: true), add
   data-zoom="true" to the <figure>. Default false so no other page changes.
2. In temple.mjs, pass zoom: true for the "meet" media and the parts opener, and add
   "js/imageZoom.js" to the page's scripts plus a stylesheet link for css/components/zoom.css.
3. Make sure the zoom activator is not added twice if a figure is rendered inside another enhanced
   figure, and that the caption still reads "AI-generated illustration".

GUARDRAILS
- Do not change how any other page calls figure(); the new option must be opt-in.
- Do not alter the placeholder path (assets that are not "approved" must still render the placeholder box).
- The visible AI-disclosure caption must remain visible in the page AND inside the dialog.
- No new dependencies; keep the added markup minimal.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: temple pages show an "Enlarge image" control on the annotated figures;
keyboard only: Tab to it, Enter opens, Escape closes, focus returns; `check-links` exits 0; the probe
reports nothing new in A, B, F or G.
```

---

## C12 — Accessibility pass on shared components

```
OBJECTIVE
Fix the accessibility findings the QA probe reports across every page: text under 14px and interactive
targets under 44x44 px.

FACTS YOU MAY RELY ON
- Run `node scripts/qa-probe.mjs --port 8099` to see the current findings, categories D and E.
- Known offenders today: span.nav__soon (11.2px), span.badge__icon (11.9px), a.nav__logo (28px tall),
  button.badge__trigger--dot (22x22), citation links inside <sup class="citation"> (about 8-22px),
  and some summary elements (about 25px tall).
- The evidence dot and the citation number sit inline inside running text, so they cannot simply become
  44px boxes: use padding plus a transparent hit area (for example an ::after overlay or
  padding with negative margin) that does not change the visible design or the line height.
- span.sr-only is visually hidden text; its font size does not matter. Leave it alone.
- The design system requires: minimum 14px text, 44x44 px targets, visible :focus-visible rings.

STEPS
1. Raise every visible font size to at least 14px (0.875rem), keeping the visual hierarchy.
2. Give every interactive element an effective 44x44 px hit area without changing the layout: the dot
   badge, citation links, nav links, the logo, and summary controls.
3. Check the focus ring is visible on each of them against both the white and the warm background.
4. Re-run the probe on at least index.html, temples/parasuramesvara.html, timeline.html and compare.html
   and get categories D and E to zero (or explain any remaining entry).

GUARDRAILS
- Visual design must not shift: no bigger badges, no re-flowed paragraphs, no changed line spacing.
- Only css/style.css and lib/components.mjs. Do not touch page modules or page CSS.
- Do not remove the tier dots or citations; they are required by the content policy.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: probe categories D and E are empty for those four pages; build, --check,
validate-content and check-links all pass; screenshots at 1440 and 375 look unchanged.
```

---

## C13 — Build snapshot tests

```
OBJECTIVE
Create scripts/test-build.mjs: a regression test for the build, so silent breakages (a CSS class that
no longer exists, a section that stops rendering, a claim that renders twice) fail loudly.

FACTS YOU MAY RELY ON
- Node 20's built-in test runner is available: `node --test`. No npm packages.
- `node scripts/build.mjs --data dev/fixtures --out dev/preview` builds the pages from the fixture data
  in dev/fixtures/ into dev/preview/ (dev/preview is git-ignored).
- The fixture data exercises: null facts, all three evidence tiers, placeholder and approved media.
- scripts/build/lib/journey.mjs exports the journey helpers; pages/temple.mjs exports renderTemple.

STEPS
1. Write tests that build the fixture site into a temp directory and assert, per generated page:
   - the page has exactly one <h1>, a <title>, a meta description;
   - no "undefined", "null" or "NaN" text in rendered content;
   - every id is unique;
   - every class the CSS relies on is present at least once on the temple page: journey-rail,
     journey-stop, journey-stop__full, story-card, passport, parts-tour, tour-step, journey-frame,
     video-facade, scale-drawing__wrap, more-to-spot, next-temple-card;
   - every claim of a fixture temple renders exactly once (count its unique text);
   - no internal URL starts with "/" except in 404.html.
2. Add unit tests for the journey helpers: each returns "" for null input; journeyRail marks only the
   first stop with aria-current; passport renders unverified() for a null claim; resolveClaimPath
   returns null for a missing path; createRenderLedger reports zero-rendered and double-rendered claims.
3. Store any golden files under test/snapshots/ and make updating them a documented one-liner
   (for example `node scripts/test-build.mjs --update`).
4. Print a clear summary and exit non-zero on failure.

GUARDRAILS
- No npm packages, no test framework beyond node:test and node:assert.
- Tests must not write into the repo root, data/ or temples/ — use dev/preview or a temp dir.
- Tests must not depend on the real data/*.json content (that changes as research lands); use fixtures.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: `node --test scripts/test-build.mjs` (or `node scripts/test-build.mjs`)
passes on the current repo, and fails if you temporarily delete a section from temple.mjs.
```

---

## C14 — Parts-tour controls and progress

```
OBJECTIVE
Make the parts tour usable without scrolling games: explicit Previous/Next controls, a visible
"Part n of N" progress state, and a clear highlighted state on the current step.

FACTS YOU MAY RELY ON
- partsTour() in scripts/build/lib/journey.mjs emits: .parts-tour > .parts-tour__stage[data-focus] and
  ol.parts-tour__steps > li.tour-step[data-highlight][id="part-<elementId>"], each step containing
  .tour-step__kicker, .tour-step__heading, .tour-step__thumb[data-focus][aria-hidden], .tour-step__what.
- js/templeJourney.js already copies data-highlight to the stage's data-focus with an
  IntersectionObserver and adds class is-current to the current step.
- The highlight itself is pure CSS: the stage and thumbnails carry data-focus, the SVG groups are
  matched by id suffix (for example [id$="-gandi"]).
- The page must remain fully usable with JavaScript disabled.

STEPS
1. In journey.mjs, add Previous/Next controls to the tour (real <button>s, 44px targets, correct
   aria-controls) plus a live region announcing "Part n of N: <heading>". Without JS these controls
   must either be absent or be plain in-page links to the next/previous step id.
2. In templeJourney.js, wire the controls: move to the previous/next step, set the stage focus, scroll
   the step into view (no smooth scrolling under prefers-reduced-motion), keep aria state in sync, and
   disable Previous on the first step and Next on the last.
3. In temple.css, give .tour-step.is-current a clear but calm emphasis, and make sure the sticky stage
   and the controls do not collide at 900-1100px widths.
4. Verify the highlight actually changes: at each step a different SVG group is gold and the rest are
   dimmed.

GUARDRAILS
- Keep the existing class and attribute contract; other code depends on it.
- No facts in any label; "Part 2 of 3" and the element name from the data are fine.
- Keep js/templeJourney.js under 8 KB unminified.
- Do not break the no-JS path or the mobile thumbnails.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: keyboard-only walk through all steps works; the probe reports nothing new;
with JS disabled the tour still lists every step with its own highlighted thumbnail.
```

---

## C15 — Timeline page in the journey style

```
OBJECTIVE
Bring timeline.html up to the visual standard of the new temple pages: the eras should read as a
sequence with a clear sense of movement through time, not as a row of equal boxes.

FACTS YOU MAY RELY ON
- scripts/build/pages/timeline.mjs renders the page today; css/pages/timeline.css styles it.
- ctx.data.timeline.eras: [{ id, label, period: claim|null, dynasty: claim|null, temples: [templeId],
  media }]. Era labels are UI-safe strings already in the data.
- Temple links come from ctx.data.templesById (id -> temple with name and page).
- The components in Block C are available, including claim(), figure() and sourcesList().
- The site's earlier review found the timeline cards stretched to the tallest card, era art rendered
  as a solid near-black silhouette, and the horizontal scroller gave no affordance.

STEPS
1. Redesign the era sequence: each era shows its label, period, dynasty, its art, and the temples of
   that era as links. Cards align to the top, keep a consistent height rhythm, and the art is tinted
   rather than solid black.
2. Give the horizontal track a clear affordance at >=1024px (edge fade plus Previous/Next buttons that
   are hidden when the track is a vertical stack), and keyboard support (arrow keys move between eras).
3. Below 1024px it becomes a vertical sequence with a visible connecting line, same rhythm as the
   temple journey.
4. Keep every claim's tier dot and citation, and the sources appendix.

GUARDRAILS
- No facts in markup: labels, periods, dynasties all come from the data; a null value renders unverified().
- Do not change data/*.json or the shared components.
- Respect prefers-reduced-motion; never hijack vertical scrolling.
- No horizontal page overflow at 375px (the era track may scroll inside its own container).

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: build/--check/validate/check-links pass; probe clean in A, B, F, G at 1440
and 375; every era and every temple link renders exactly once.
```

---

## C16 — Home page as the front door

```
OBJECTIVE
Make index.html feel like the entrance to the site: a strong hero, a clear "what is this" section, and
obvious routes into the timeline, the temples and the academy.

FACTS YOU MAY RELY ON
- scripts/build/pages/index.mjs renders the page; most of its styling lives in css/style.css.
- The page already renders: hero, "temple types", "evolution story" (from timeline eras), "explore
  Odisha" (temple list), a featured temple, and now a sources list at the end.
- Temples come from ctx.data.temples.temples (name, page, one_liner, media.hero, sort_year, era_id).
- Approved hero images exist for all five temples; .card/.card-grid styles already exist in css/style.css.
- The site tagline and names are in siteConfig (UI copy, not facts).

STEPS
1. Rework the hero: larger type, the tagline, and two clear actions; the hero illustration must not
   crowd the text at 375px.
2. Turn "Explore Odisha" into image cards (hero image, name, its era label, one-line hook), using the
   existing card styles, with the whole card clickable through a stretched link.
3. Fix the evolution story: heading first, then the period; no notes in the summary view; a 3x2 grid at
   desktop and a vertical list on mobile, with no orphan column.
4. Keep the featured temple, but make its hook and call to action stronger.
5. Keep every fact a claim with its dot and citation, and keep the sources list at the end.

GUARDRAILS
- No facts in markup. Card hooks must come from the data (one_liner), never written by hand.
- Use existing tokens and card components; do not invent a second card system.
- Images need width/height and lazy loading below the fold; the hero image stays eager.
- Do not change other pages.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: build/--check/validate/check-links pass; probe clean in A, B, F, G at both
widths; the home page's first screen shows title, tagline and a call to action at 375px and 1440px.
```

---

## C17 — Glossary that works with empty data

```
OBJECTIVE
Make glossary.html useful the moment terms land in the data, and honest while it is empty.

FACTS YOU MAY RELY ON
- data/glossary.json is { terms: [] } today — EMPTY. The page must render a clear "being written"
  state and must not pretend to have content.
- When filled, a term is expected to carry: id, term, plain_name, short (claim|null), what (claim|null),
  element_id, temple_ids, see_also.
- ctx.data.elements holds the element names; ctx.data.templesById maps temple ids to temples.
- scripts/build/pages/glossary.mjs and css/pages/glossary.css exist; there is no js/glossary.js yet.
- The nav still marks Glossary as "Soon"; leave that to whoever fills the data.

STEPS
1. Render: an A-Z jump bar, a client-side search box, and the terms as an accessible definition list,
   each with its claims, tier dots, citations, and links to related elements and temples.
2. Search and A-Z filtering happen in js/glossary.js on already-rendered markup: no data fetching, and
   the full list must be present for a visitor without JavaScript.
3. Announce result counts in a live region; "no results" is a visible message, not an empty page.
4. With zero terms: a short explanation of what will appear, no empty search UI.

GUARDRAILS
- Never write a definition into the code: definitions come from the data or show unverified().
- js/glossary.js under 5 KB unminified, no dependencies.
- Keep the page usable at 375px; the A-Z bar must not overflow (wrap or scroll inside its own box).

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: with today's empty data the page renders the honest empty state and passes
check-links and the probe; with a handful of test terms (not committed) search and A-Z work by keyboard.
```

---

## C18 — Images: responsive sizes and priorities

```
OBJECTIVE
Cut the page weight and stop layout shift by serving images at sensible sizes and priorities.

FACTS YOU MAY RELY ON
- figure() in scripts/build/lib/components.mjs renders approved raster assets as <img> with width and
  height from data/media.json, and an `eager` option exists.
- There is NO image processing tool available in this project (no sharp, no ImageMagick, no npm), so you
  cannot generate resized files. Assume only the single file each asset already points at.
- Asset widths vary: hero images are about 1376px wide, build frames 1200px, isometrics 1024px.
- The performance budget: 1.2 MB first load per page; no layout shift (CLS < 0.1).

STEPS
1. Add a `sizes` attribute to rendered images that matches how the CSS actually lays them out (for
   example full width on mobile, about 7/12 of 1200px in a two-column stop), so the browser picks
   sensible decoding sizes.
2. Set fetchpriority="high" on the hero image and loading="lazy" plus decoding="async" for everything
   below the fold; make sure only one image per page is eager.
3. Reserve space for every image and video (width/height or aspect-ratio) so nothing shifts as it loads;
   the video facade poster included.
4. Document, in a comment, exactly which srcset widths should be generated later, so a future task can
   add them when image tooling exists.

GUARDRAILS
- Do not add srcset entries pointing at files that do not exist.
- Do not change any image file or data/media.json.
- Keep the placeholder rendering path untouched.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: build/--check/check-links pass; the probe shows no category G (broken
images); every <img> still has width and height; exactly one eager image per page.
```
