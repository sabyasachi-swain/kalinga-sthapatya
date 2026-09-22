# Coding task prompts (for Gemini or any outside coding model)

Paste **Block C** first, then **one** task prompt. Bring the result back here for review before anything is committed.
Every task below has the same shape: **Objective · Facts you may rely on · Steps · Guardrails · Output format · Acceptance.**

**File ownership:** a task may create or change only the files it lists. Two tasks that own the same file must not run
in parallel. **Run order:** C1 → (C2, C3 in parallel) → C4. C5–C9 are independent of everything.

| Task | What | Owns | Needs first |
|---|---|---|---|
| C1 | Journey component library | `scripts/build/lib/journey.mjs` (new) | — |
| C2 | Journey CSS | `css/pages/temple.css` (rewrite) | nothing (markup contract is inside the prompt) |
| C3 | Journey page JS | `js/templeJourney.js` (new) | nothing (contract is inside the prompt) |
| C4 | Temple page assembly + wiring | `scripts/build/pages/temple.mjs` (rewrite), `scripts/build/journeyWiring.mjs` (new) | C1 merged |
| C5 | Tap-to-enlarge images | `js/imageZoom.js`, `css/components/zoom.css` (both new) | — |
| C6 | Map page | `scripts/build/pages/map.mjs`, `js/map.js`, `css/pages/map.css` (new) | — |
| C7 | Academy page | `scripts/build/pages/academy.mjs`, `js/academy.js`, `css/pages/academy.css` (new) | — |
| C8 | QA probe script | `scripts/qa-probe.mjs` (new) | — |
| C9 | Link + anchor checker | `scripts/check-links.mjs` (new) | — |

---

## Block C — shared context and rules (paste FIRST, every time)

````
ROLE: you are writing production code for "Kalinga Sthapatya", a static educational website about the
temple architecture of Odisha, India, made for families and children (ages about 8–12). It is
pre-rendered by a small Node build script and hosted on GitHub Pages.

NO ASSUMPTIONS RULE (most important)
- Use ONLY the facts given in this prompt. Do not guess the contents of any file you were not shown,
  do not invent function names, CSS variables, data fields, file paths or build steps.
- If something you need is missing, STOP and list your questions under "BLOCKED" instead of guessing.
- If you make any judgement call that this prompt did not decide for you, list it under "DECISIONS I
  MADE" at the end. Never hide it inside the code.
- Do not "improve" the specification, rename the things it names, or add features it did not ask for.

HARD CONSTRAINTS
1. Vanilla only: plain HTML, CSS, JavaScript. No React/Vue/Tailwind/jQuery, no bundler, no TypeScript,
   no CSS preprocessor, no npm packages. The one exception is Leaflet from a CDN, in the map task only.
2. Node 20, ES modules (.mjs, import/export), standard library only.
3. NO FACTS IN CODE. Never write a date, height, dynasty, king, deity, or the meaning of an
   architectural term into HTML, CSS or JS. Those come only from the JSON data at build time.
   Section headings and button labels ("Next stop", "How did they build it?") are fine — they state
   no fact.
4. Every internal URL is RELATIVE and built from the context prefixes given below. Never a leading "/".
5. Accessibility is part of "done": semantic landmarks, exactly one <h1> per page, real <button>/<a>,
   visible :focus-visible rings, tap targets at least 44x44 px, correct ARIA (aria-pressed,
   aria-current, aria-expanded/aria-controls), full keyboard operation, and the page still works with
   JavaScript disabled (JS is enhancement only).
6. Motion: put transitions and animations inside @media (prefers-reduced-motion: no-preference).
   Never autoplay video or audio. Never hijack scrolling.
7. Mobile first: correct at 375 px with NO horizontal page scroll, and at 768 px and 1440 px.
8. Budgets: first load <= 1.2 MB per page; your own JS <= 60 KB unminified per page; <img>/<video>
   always carry width and height; below-the-fold images use loading="lazy".
9. Escape every interpolated value in HTML with the project's escapeHtml() helper.

VERIFIED REPO FACTS (these are true today; rely on them)
  Layout of the repo, relative to its root:
    data/*.json            temples.json, timeline.json, elements.json, glossary.json, academy.json,
                           media.json, sources.json          <- NEVER edit
    scripts/build.mjs      build entry. `node scripts/build.mjs` writes .html into the repo root.
                           `node scripts/build.mjs --check` reports whether output is up to date.
    scripts/build/registry.mjs   one entry per generated page; temple pages are generated per temple
    scripts/build/config.mjs     exports siteConfig and sizeComparisonAssumptions
    scripts/build/lib/     html.mjs, layout.mjs, context.mjs, data.mjs, components.mjs, size.mjs
    scripts/build/pages/   index.mjs, about.mjs, temple.mjs, timeline.mjs, glossary.mjs, compare.mjs,
                           notfound.mjs, comingSoon.mjs, componentsPreview.mjs
    css/style.css, css/pages/{temple,timeline,compare,glossary}.css, js/*.js, img/**
    scripts/validate-content.mjs, scripts/merge-staged.mjs     <- NEVER edit
  Existing exported helpers (signatures exactly as written):
    lib/html.mjs        escapeHtml(str), raw(str), attr(name, value), classNames(...parts), uid(prefix),
                        resetUid()
    lib/layout.mjs      page(ctx, { title, description, bodyHtml, headExtra = "", bodyClassName = "",
                        schema = null, scripts = [] }) -> full HTML document, including the site nav,
                        footer, skip link, css/style.css and the Google Fonts link
    lib/components.mjs  badge(tier, ctx, opts), unverified(ctx, label = "Not yet verified"), isClaim(c),
                        claim(c, ctx, opts), claimsList(list, ctx, opts), hasApprovedClaims(list),
                        factOrUnverified(c, ctx, opts),
                        section({ id, className, heading, level = 2, headingId, body, force = false }),
                        accordionSection({ …same…, subtitle, open = false }),
                        sourcesList(ctx, opts)   // opts.legend = true renders the tier legend
                        inlineSvgAsset(assetId, ctx),
                        figure(id, ctx, opts)    // opts: { aspect = "4 / 3", className, decorative,
                                                 //         figClassName, fallbackAlt, eager }
                                                 // renders a placeholder box unless status is "approved"
                        nav(ctx), footer(ctx)
    lib/size.mjs        scaleDrawing(items, ctx), scaleDrawingCaptions(items),
                        heightComparisonSentence(heightM, comparisonM, comparisonLabel),
                        heightDifferenceSentence(a, b)
  claim() already renders: the claim text, a small coloured tier dot, the citation as <sup
  class="citation">[1,2]</sup>, and the note inside <details class="claim__note"><summary>For curious
  grown-ups</summary>. Do not rebuild any of that.
  Page CSS is linked by the page module itself, e.g.:
    headExtra: `<link rel="stylesheet" href="${ctx.assetRel}css/pages/temple.css">`
  RENDER CONTEXT (ctx), given to every page render function:
    ctx.data        parsed JSON: { temples, timeline, elements, glossary, academy, media, sources }
                    plus ctx.data.mediaById — a Map of media asset id -> asset object
    ctx.config      siteConfig
    ctx.rel         prefix from this page to another PAGE   ("" at the root, "../" in temples/)
    ctx.assetRel    prefix from this page to css/js/img     ("" at the root, "../" in temples/)
    ctx.citations   Map(sourceId -> citation number), shared by claim() and sourcesList()
    A page module exports (ctx) => complete HTML string, normally by returning page(ctx, {...}).
  CSS CUSTOM PROPERTIES that exist in css/style.css :root (use these; do not invent others):
    --accent --accent-hover --bg-card --bg-primary --bg-warm --border --border-strong --content-max
    --evidence-amber --evidence-green --evidence-red --font-body --font-heading --gold --nav-height
    --prose-max --radius-card --radius-pill --shadow-card --shadow-card-hover --shadow-panel
    --space-1 … --space-9 --text-primary --text-secondary --transition-fast --transition-medium
  DATA SHAPES (read-only):
    claim      { text, value (short display form, optional), tier: "established"|"scholarly"|"uncertain",
                 sources: [sourceId], note: string|null }   — a fact may instead be null
    temple     { id, name, name_odia, page ("temples/<id>.html"), temple_type, era_id, sort_year,
                 location { place, district, lat, lng, coord_source },
                 one_liner (claim), facts { date, dynasty, height, deity, … each claim or null },
                 sections { parts: { intro: [claim] }, why_built: [claim], construction: [claim],
                            special: [claim], size: {…}, influences: [claim] },
                 media { hero, silhouette, parts_diagram }  (values are media asset ids),
                 sketchfab: null or an object }
    media asset{ id (e.g. "V-64A"), kind: "raster"|"svg"|"video", path ("img/…"),
                 status: "placeholder"|"delivered"|"approved"|"rejected", alt, caption, width, height,
                 hotspots: [{ element_id, x, y, w, h }] as percentages, credit { type, tool },
                 and sometimes temple_id, role ("build-sequence"|"build-video"), order, label,
                 poster (an asset id), interim: true }
    element    { id, name, plain_name, group, parent, what: claim|null, why: claim|null, temple_ids: [] }
    academy    { temple_types: [], why_questions: [], builder_steps: [] }   — all three may be EMPTY
    timeline   { eras: [ { id, label, period: claim|null, dynasty: claim|null, temples: [templeId],
                 media } ] }

OUTPUT FORMAT (follow exactly)
1. One code block per file, the file path as the first line comment, the COMPLETE final content of
   that file. No diffs, no "…", no TODO, no omitted sections.
2. Then "HOW I VERIFIED": the commands you ran or the reasoning you used.
3. Then "DECISIONS I MADE": every judgement call not decided by this prompt (or "none").
4. Then "BLOCKED": anything you could not do, and what you need (or "none").
5. Touch no file outside the ones the task names. If a rule here makes the task impossible, say so
   rather than breaking the rule.
````

---

## C1 — Journey component library

```
OBJECTIVE
Create scripts/build/lib/journey.mjs: pure render helpers that turn temple data into the markup of a
"guided walk" page. Other tasks depend on this exact markup, so the contract below is fixed.

FACTS YOU MAY RELY ON
- Only Block C plus this prompt. The file is new; nothing imports it yet.
- You may import from ../lib/html.mjs and ../lib/components.mjs (see Block C for their exports).

STEPS
1. Export journeyRail(stops), stops = [{ id, n, title }]:
   <nav class="journey-rail" aria-label="Tour of this temple"><ol class="journey-rail__list">
     <li class="journey-rail__item"><a class="journey-rail__link" href="#ID" data-stop="ID">
       <span class="journey-rail__num" aria-hidden="true">N</span>
       <span class="journey-rail__title">TITLE</span></a></li> … </ol></nav>
   The first link carries aria-current="step".
2. Export journeyStop({ id, n, total, title, narration, tone = "plain", body, next }):
   <section class="journey-stop journey-stop--TONE" id="ID" aria-labelledby="ID-heading">
     <div class="journey-stop__inner">
       <p class="journey-stop__kicker">Stop N of TOTAL</p>
       <h2 class="journey-stop__heading" id="ID-heading">TITLE</h2>
       <p class="journey-stop__narration">NARRATION</p>        (omit when narration is falsy)
       <div class="journey-stop__body">BODY</div>
       <a class="journey-next" href="#NEXT.id">NEXT.label <span aria-hidden="true">↓</span></a>
     </div></section>                                           (omit the link when next is null)
   tone is "plain" or "warm".
3. Export storyCard(claimObj, ctx, { marker = null, className = "" }):
   <article class="story-card CLASSNAME"><p class="story-card__marker" aria-hidden="true">MARKER</p>
     <div class="story-card__body">claim(claimObj, ctx)</div></article>
   Return "" when isClaim(claimObj) is false. Omit the marker <p> when marker is null.
4. Export passport(rows, ctx), rows = [{ label, claim }]:
   <dl class="passport"> per row
     <div class="passport__row"><dt class="passport__label">LABEL</dt>
       <dd class="passport__value">…</dd></div></dl>
   In the value: the claim's `value` if present, else its `text`; then the tier dot and citation that
   claim() produces; then <details class="passport__how"><summary>How do we know?</summary> with the
   claim's full text and its note. A null claim renders unverified(ctx).
   Do NOT nest a <details> inside another <details>.
5. Export partsTour({ stageAssetId, steps }, ctx), steps = [{ elementId, highlight: [svgGroupId],
   heading, definitionClaim, claims: [claim] }]:
   <div class="parts-tour">
     <div class="parts-tour__stage" data-focus="FIRST STEP'S HIGHLIGHT, SPACE SEPARATED">
       <div class="parts-drawing">inlineSvgAsset(stageAssetId, ctx)</div></div>
     <ol class="parts-tour__steps"> per step
       <li class="tour-step" id="part-ELEMENTID" data-highlight="HIGHLIGHT SPACE SEPARATED">
         <p class="tour-step__kicker">Part i of n</p>
         <h3 class="tour-step__heading">HEADING</h3>
         <div class="tour-step__thumb" data-focus="HIGHLIGHT">…a copy of the stage drawing…</div>
         <p class="tour-step__what">definition claim, or unverified(ctx, "What it means: not yet
           verified") when definitionClaim is null</p>
         …storyCard() for each claim… </li></ol></div>
   The per-step thumbnail must show the right highlight with JavaScript disabled, so put the highlight
   in its own data-focus attribute (CSS does the rest in task C2).
6. Export videoFacade(videoAsset, posterAsset, ctx): a click-to-play facade —
   <div class="video-facade" data-video="SRC" data-w="W" data-h="H"> containing the poster <img>
   (width/height set) and <button type="button" class="video-facade__play" aria-label="Play the
   video">, followed by <noscript> with a plain <a href="SRC"> link. Never emit a <video> element and
   never preload. Build SRC as ctx.assetRel + asset.path.
7. Export resolveClaimPath(temple, "sections.special.1"): safe dotted lookup returning the claim or null.
8. Export createRenderLedger() -> { mark(claimObj), report(allClaims) } that tracks rendered claim
   objects by identity (a Set) and reports which approved claims were rendered zero times or more
   than once.

GUARDRAILS
- Pure functions only: no file I/O, no network, no module-level mutable state shared between pages.
- Every function returns "" for null/undefined input instead of throwing.
- Escape all interpolated text; ids must be safe inside a URL fragment.
- Never read data/*.json directly; everything arrives through arguments or ctx.
- Do not strip or alter what claim() returns. Do not restyle it.
- Strip any <style> element coming from an inlined SVG before emitting it.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: `node --check scripts/build/lib/journey.mjs` passes; every exported name
above exists with that exact spelling; markup matches the contract character for character in class
names, attribute names and element order.
```

---

## C2 — Journey CSS

```
OBJECTIVE
Rewrite css/pages/temple.css so a temple page reads as a premium guided walk. Remove every rule for
the old layout (quick-facts strip, accordions, build-sequence switcher); leave nothing unused.

FACTS YOU MAY RELY ON
- The markup contract is fully given in task C1 above; the class names you must style are:
  journey-rail, journey-rail__list/__item/__link/__num/__title; journey-stop, journey-stop--plain,
  journey-stop--warm, journey-stop__inner/__kicker/__heading/__narration/__body; journey-next;
  story-card, story-card__marker/__body; passport, passport__row/__label/__value/__how;
  parts-tour, parts-tour__stage, parts-drawing, parts-tour__steps, tour-step,
  tour-step__kicker/__heading/__thumb/__what; video-facade, video-facade__play;
  temple-hero, temple-hero__figure, temple-hero__card; journey-frame.
- Use only the CSS custom properties listed in Block C. css/style.css already defines them and the
  base typography; do not redefine tokens and do not edit css/style.css.

STEPS
1. Hero: full-bleed image, height clamp(360px, 70vh, 680px), object-fit: cover; a cream card
   overlapping its lower left holding the title block. At <=767px: aspect-ratio 4/3, card below the
   image, overlapping it by about 32px.
2. Journey rail: position: sticky; top: var(--nav-height); about 52px tall; white; bottom border;
   horizontal centred list. The link with aria-current="step" gets a 3px var(--gold) underline and
   stronger colour. At <=767px: four 44px circular number targets plus the current title, no wrap,
   no overflow.
3. Stops: full-bleed alternating bands (journey-stop--warm uses var(--bg-warm)) with the inner content
   capped at var(--content-max) and centred; generous vertical rhythm between blocks.
4. Stop body: CSS grid, 7/5 split (media / text) at >=900px; single column below, media first.
5. journey-frame and figures: 1px var(--border), var(--radius-card), var(--bg-warm) fill, image fills
   the width, caption 0.875rem, centred, var(--text-secondary).
6. story-card: 3px var(--gold) left rule, comfortable padding, consistent gaps when stacked.
7. passport: label above value on mobile, two columns >=768px; the <summary> is a quiet control with a
   44px target and a visible focus ring.
8. Parts tour: >=900px CSS grid with a sticky stage (top: 140px) in the left 5 columns and the steps in
   the right 7 columns, each step min-height: 70vh, and the per-step thumbnails hidden. Below 900px:
   hide the stage, show each step's thumbnail (about 112px) floated beside its heading.
9. Highlight rules, CSS only, driven by data-focus:
   .parts-tour__stage[data-focus~="gandi"] .parts-drawing [id$="-gandi"] (and the same pattern for
   tour-step__thumb[data-focus~="…"]) gets fill: color-mix(in srgb, var(--gold) 35%, transparent) and
   stroke: var(--accent) 5px; groups not focused get opacity: .35. Support these names: pista, pabhaga,
   bada, jangha, gandi, mastaka, jagamohana, vimana-base, wheel.
10. journey-next: pill button, min-height 44px, with a 2px dotted var(--gold) vertical line (::after,
    about 48px) continuing below it.
11. video-facade: 16/9 box, poster covers it, centred round play button at least 56px, strong focus ring.

GUARDRAILS
- No @import, no web fonts, no external URLs, no CSS framework, no !important unless you explain it.
- All transitions inside @media (prefers-reduced-motion: no-preference).
- Nothing may overflow horizontally at 375px; img, svg and video must never exceed their container.
- Do not invent class names that task C1 does not emit; if you need one, list it under DECISIONS.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: every class above has styling; the file is self-contained; no token is
redefined; no rule refers to markup outside the contract.
```

---

## C3 — Journey page JavaScript

```
OBJECTIVE
Create js/templeJourney.js: a small progressive-enhancement script for the temple journey page.

FACTS YOU MAY RELY ON
- The DOM contract from task C1: sections .journey-stop[id]; rail links .journey-rail__link[href="#id"]
  [data-stop]; steps .tour-step[data-highlight]; the stage .parts-tour__stage[data-focus];
  the facade .video-facade[data-video][data-w][data-h] containing button.video-facade__play.
- The page already works without this script; it only adds tracking and playback.

STEPS
1. Rail tracking: with IntersectionObserver (rootMargin "-45% 0px -50% 0px") over .journey-stop, set
   aria-current="step" on the matching rail link and remove it from the others. Change no other DOM.
2. Parts tour: with a second IntersectionObserver over .tour-step, copy the current step's
   data-highlight value into the .parts-tour__stage data-focus attribute, and put class "is-current"
   on that step (removing it elsewhere).
3. Video: when .video-facade__play is activated (click, and Enter/Space come free with a real button),
   replace the facade's contents with <video controls playsinline> using src/width/height from the
   data attributes, then move focus to the video. Add autoplay ONLY when
   matchMedia("(prefers-reduced-motion: reduce)") does not match. Create the element only on that
   user action.
4. Feature-detect IntersectionObserver; when missing, skip steps 1–2 and keep step 3 working.
5. Disconnect both observers on pagehide.

GUARDRAILS
- No dependencies, no globals (wrap in an IIFE or a module-scoped block), no console output.
- Do not change text content, do not add or remove sections, do not touch styles except the documented
  attributes and classes.
- No smooth-scrolling, no scroll hijacking, no preloading of the video.
- Must not throw on a page that has none of these elements.
- Keep the file under 5 KB unminified. ES2019 syntax at most (no optional chaining or ??).

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: `node --check js/templeJourney.js` passes; the script is inert on a page
without journey markup; nothing breaks with JS disabled.
```

---

## C4 — Temple page assembly and wiring

```
OBJECTIVE
Rewrite scripts/build/pages/temple.mjs so every temple page renders as a four-stop journey, and create
scripts/build/journeyWiring.mjs to hold the per-temple wiring.

FACTS YOU MAY RELY ON
- scripts/build/lib/journey.mjs exists with exactly the exports listed in task C1 (journeyRail,
  journeyStop, storyCard, passport, partsTour, videoFacade, resolveClaimPath, createRenderLedger).
  If any of them is missing when you start, stop and report it under BLOCKED.
- temple.mjs is currently imported by scripts/build/registry.mjs as:
    import { renderTemple } from "./pages/temple.mjs";
    render: renderTemple(t)        // t is a temple object
  so it must keep exporting renderTemple(temple) -> (ctx) => html string.
- The old temple.mjs holds a constant ISOMETRIC_BY_TEMPLE_ID mapping temple id -> media asset id.
  Move it unchanged into journeyWiring.mjs and import it back.
- Media wiring lives in media.json: an asset may carry temple_id, role ("build-sequence" with order
  and label, or "build-video" with poster), which is how the build frames and the video are found.
  Look them up through ctx.data.media.assets / ctx.data.mediaById. temples.json has no key for them.

STEPS
1. Hero (not a numbered stop): the temple's media.hero via figure(), and a card with the location
   place, the <h1> name, the one_liner claim, and a link "Start the tour ↓" to the first stop.
2. Build the stops, skipping any whose body would be empty, then number the remaining ones and pass
   the same list to journeyRail so the numbers match:
   a. "Meet the temple" — media: the build-sequence asset with order 2, else the isometric, else the
      hero. Body: storyCards for sections.parts.intro; passport with rows When? = facts.date,
      In whose time? = facts.dynasty, For which god? = facts.deity; the "How tall?" band built from
      facts.height with scaleDrawing/scaleDrawingCaptions/heightComparisonSentence and
      sizeComparisonAssumptions from ../config.mjs; storyCards for sections.why_built if any.
   b. "How it was built" — videoFacade for the build-video asset (poster: its `poster` id, else the
      order-1 frame; skip the facade entirely when there is no video), and numbered storyCards for
      sections.construction.
   c. "The parts" — an opener image (the highest-order build-sequence frame, only when two or more
      exist), then partsTour with stageAssetId = temple.media.parts_diagram and the steps from
      journeyWiring.mjs. Then "More to spot": every sections.special claim not used by a step — the
      first three visible, the rest inside <details> labelled "See N more".
   d. "Its family" — storyCards for sections.influences, plus a "Visit another temple" card linking to
      the temple with the next higher sort_year (wrapping to the first), showing that temple's
      silhouette through inlineSvgAsset and its name.
3. Appendix: sourcesList(ctx, { legend: true }), plus a quiet line naming the fact keys whose value is
   null, e.g. "Still being checked: …", derived from the data, never hardcoded.
4. journeyWiring.mjs exports TEMPLE_TOURS = { templeId: [ { elementId, highlight: [...],
   claimPaths: [...] } ] } and ISOMETRIC_BY_TEMPLE_ID. Fill TEMPLE_TOURS for parasuramesvara only:
     jagamohana -> highlight ["jagamohana"], claimPaths ["sections.special.1","sections.special.2"]
     bada       -> highlight ["bada"],       claimPaths ["sections.special.0"]
     gandi      -> highlight ["gandi","mastaka"], claimPaths ["sections.special.3"]
   Every step's heading and definition come from ctx.data.elements (match by elementId); a temple with
   no entry skips the tour and shows all its special claims in "More to spot".
5. Use createRenderLedger() so every approved claim of the temple renders exactly once; console.warn
   the path of any claim rendered zero or multiple times.
6. Keep working: the page <title>, the meta description, the schema.org
   LandmarksOrHistoricalBuildings block (values only from approved data), the stylesheet link
   `<link rel="stylesheet" href="${ctx.assetRel}css/pages/temple.css">`, scripts:
   ["js/templeJourney.js"] and bodyClassName: "page-temple".

GUARDRAILS
- Headings, kickers and narration are UI copy and must contain NO facts.
- Never read data/*.json from disk; use ctx and the temple argument.
- Never edit data/*.json, scripts/validate-content.mjs, scripts/merge-staged.mjs, registry.mjs,
  lib/*.mjs, or any CSS/JS file. Only the two files this task owns.
- A temple missing a section, a media asset or a tour entry must still render a valid page.
- Do not delete the isometric mapping; move it.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: `node scripts/build.mjs` builds all pages with no error; then
`node scripts/build.mjs --check` prints that everything is up to date; `node
scripts/validate-content.mjs` still passes (it must be unaffected); no claim warning appears for the
five temples.
```

---

## C5 — Tap-to-enlarge images

```
OBJECTIVE
Create js/imageZoom.js and css/components/zoom.css so pictures with small printed labels can be read
on a phone.

FACTS YOU MAY RELY ON
- Some figures on the site are illustrations whose labels are drawn inside the image; at 375px those
  labels become unreadable, which is what this feature fixes.
- The opt-in marker is a data attribute on the figure: <figure data-zoom="true">. I will add that
  attribute myself; assume nothing else about the surrounding markup, except that the figure contains
  one <img> and may contain a <figcaption>.
- css/components/ does not exist yet; create it. I will link the stylesheet myself.

STEPS
1. For every <figure data-zoom="true">, add an activator: a <button type="button"> overlaying the
   image, at least 44x44px, aria-label "Enlarge image", plus a small magnifier affordance.
2. On activation open a modal: use <dialog> with showModal() when supported, otherwise a div with
   role="dialog" aria-modal="true". Show the image at natural size within a scrollable area.
3. Zoom controls: buttons "+" and "−" (and double-click / double-tap) toggling steps between 1x and
   3x; native pinch-zoom must keep working on touch; the image can be panned by dragging or scrolling.
4. Show the figure's caption text in the dialog and reference it with aria-describedby.
5. Trap focus while open; Escape closes; focus returns to the activator; background scrolling locked
   while open and restored after.
6. Without JavaScript nothing changes and nothing is added to the page.
7. Style it in css/components/zoom.css: translucent dark backdrop, image contained in the viewport,
   controls with visible focus rings, usable at 375px, transitions only under prefers-reduced-motion:
   no-preference.

GUARDRAILS
- No dependencies. No globals. Under 4 KB unminified for the JS.
- Do not alter the page's existing markup beyond adding the activator and the dialog.
- Do not change image src or load a second copy of the image at a different resolution.
- Use only the CSS custom properties listed in Block C.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: `node --check js/imageZoom.js` passes; works with keyboard only; does
nothing on pages with no data-zoom figures.
```

---

## C6 — Map page

```
OBJECTIVE
Create scripts/build/pages/map.mjs, js/map.js and css/pages/map.css: a map of the temples with
filters and a time slider. (I will register the page in registry.mjs myself.)

FACTS YOU MAY RELY ON
- Export signature to use: export function renderMap(ctx) { … } returning page(ctx, {...}).
- Every temple in ctx.data.temples.temples has: name, page, temple_type, era_id, sort_year, one_liner
  (claim), media.silhouette, and location { place, district, lat, lng, coord_source }.
- Eras are in ctx.data.timeline.eras with id and label.
- Leaflet is the only third-party library allowed, loaded from a CDN. There is no API key of any kind.

STEPS
1. Render server-side: an <h1>, a short intro (UI copy, no facts), a map container, and a
   keyboard-accessible LIST of the temples (name, place and district, era label, link to the temple
   page). The list is the no-JavaScript fallback and must be complete on its own.
2. Filters as real form controls: era (from timeline.eras) and temple type (from the temples' own
   temple_type values). Filtering must apply to the list and to the map markers alike.
3. A "time machine" <input type="range"> across the span of sort_year values, with aria-valuetext
   reading like "c. 1000 CE", which hides temples built after the selected year.
4. In js/map.js: load Leaflet 1.9.x from a CDN with an integrity (SRI) attribute and
   crossorigin="anonymous", add OpenStreetMap tiles with their required attribution visible, fit the
   view to the temples, and apply the muted look with a CSS filter on the tile pane only.
5. Marker click (and the list's "Show on map" control) opens a preview card: name, place, era label,
   the temple's silhouette, and a "Learn more" link to the temple page. The card must be reachable and
   dismissible by keyboard.
6. If Leaflet fails to load or is blocked, the page keeps working as the list; show no error UI and
   throw no uncaught error.

GUARDRAILS
- Coordinates come only from the data. Never hardcode a coordinate, place name or era label.
- No API keys, no analytics, no third-party fonts or images beyond the OSM tiles.
- Your own script stays under 10 KB unminified (Leaflet itself is exempt from the JS budget).
- The map container must have a fixed aspect or height so the page does not shift as tiles load.
- No horizontal overflow at 375px; controls are at least 44px.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: `node --check` passes for both JS files; the rendered page works fully with
JavaScript disabled; every temple appears exactly once in the list.
```

---

## C7 — Academy page

```
OBJECTIVE
Create scripts/build/pages/academy.mjs, js/academy.js and css/pages/academy.css: the "Architecture
Academy" page, which teaches the temple types, the parts of a temple, why the shapes are as they are,
and how a temple was built. (I will register the page myself.)

FACTS YOU MAY RELY ON
- Export signature: export function renderAcademy(ctx) { … } returning page(ctx, {...}).
- ctx.data.academy = { temple_types: [], why_questions: [], builder_steps: [] } and TODAY ALL THREE
  ARE EMPTY. The page must render correctly with empty arrays and fill itself when they are populated.
- When populated, each item's factual parts are claim objects, to be rendered with claim():
    temple_types : { id, name, plain_name, roof, use, deity, media, examples: [templeId] }
    why_questions: { id, question (UI text), answer (claim), media }
    builder_steps: { id, n, title (UI text), what (claim), media }
  Treat any of these fields as possibly absent or null.
- ctx.data.elements holds { id, name, plain_name, what, why, temple_ids }.
- A media asset may carry hotspots: [{ element_id, x, y, w, h }] as percentages of the image.

STEPS
1. Section A "The three temple types": one card per entry in academy.temple_types (illustration via
   figure(), name, and its claims). Empty array -> a quiet "Still being written" note, and leave the
   section out of the in-page navigation.
2. Section B "Anatomy of a temple": an exploded-view image with absolutely positioned hotspot
   <button>s built from that asset's hotspots (aria-label = the element's name). Selecting one opens
   an info panel (<aside role="dialog" aria-modal="false">) with the element's name, its `what` and
   `why` claims or unverified(ctx), and links to the temples listed in temple_ids. ALSO render the
   same elements as a plain visible list below the image: that list is the no-JS and screen-reader
   path. If the asset has no hotspots, render only the list.
3. Section C "Why this shape?": each why_question as a <details> — the question in the <summary>, the
   answer claim inside.
4. Section D "How was it built?": the builder_steps in order. With JavaScript, a "Next step" control
   moves through them one at a time; without it, all steps are visible in order.
5. Appendix: sourcesList(ctx, { legend: true }).
6. js/academy.js: the hotspot panel (open, close, Escape, focus management, focus returned to the
   hotspot), the step walker, and highlighting the current section in the in-page navigation.

GUARDRAILS
- Invent no content: no explanations, no definitions, no examples. Everything factual comes from the
  data; where data is missing, show the "still being written" note or unverified(ctx).
- The headings and the four section titles are UI copy and may contain no facts.
- js/academy.js under 6 KB unminified; page fully usable without it.
- Hotspot buttons need a 44px minimum hit area even when the hotspot rectangle is smaller.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: the page renders with today's empty arrays and again with sample data you
construct only in your own head for testing (do not commit sample data); `node --check` passes.
```

---

## C8 — QA probe script

```
OBJECTIVE
Create scripts/qa-probe.mjs: a Node 20 script that drives headless Chrome over the built pages and
reports layout faults, so nobody has to eyeball screenshots.

FACTS YOU MAY RELY ON
- The built pages are .html files in the repo root and in temples/. dev/ and partials/ are not pages.
- Chrome is installed; its path may be given by the CHROME environment variable.
- Node 20 standard library only: node:http, node:fs, node:path, node:child_process, node:os.

STEPS
1. Command line: node scripts/qa-probe.mjs [--port 8080] [--widths 1440,375]
   [--pages index.html,temples/konark.html] [--json] [--help]. Default pages: every .html in the repo
   root and temples/.
2. Start a static server for the repo root on the given port with node:http, serving correct content
   types for html, css, js, svg, jpg, png, webp, mp4, json.
3. For each page and width, write a temporary wrapper page (served from the same origin, so the iframe
   is same-origin) containing an <iframe> of that page at that width and an in-page script that
   measures, inside the iframe document:
   a. horizontal overflow (documentElement.scrollWidth > clientWidth), listing offending elements;
   b. any img/svg/video/figure whose rect extends more than 1px beyond its nearest container
      (figure, .card, section, main);
   c. pairs of visible text-bearing elements (p, h1-h4, li, dt, dd, figcaption, .badge, .citation, a)
      whose rects intersect while neither contains the other — for a closed <details>, measure only
      its <summary>;
   d. text under 14px; e. interactive targets under 44x44px; f. text nodes containing "undefined",
   "null" or "NaN"; g. images that failed to load (naturalWidth === 0).
   The script writes its findings as JSON into <pre id="probe-result">.
4. Run Chrome: --headless=new --dump-dom --virtual-time-budget=4000, read the <pre>, parse the JSON.
   Locate Chrome from CHROME, else the usual Windows, macOS and Linux paths; exit with a clear message
   if it cannot be found.
5. Print a per-page, per-width report; write the full JSON to qa/probe-<YYYY-MM-DD>.json. Exit 1 when
   any of categories a, b, f or g has findings; otherwise exit 0.
6. Always stop the server and delete temporary files, including on error or Ctrl+C.

GUARDRAILS
- No npm packages (no Puppeteer). No network access beyond the local server.
- Never modify site files; write only into qa/ and the OS temp directory.
- Keep it one file under 400 lines, with --help text and clear errors.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: running it on this repo prints a report and exits 0 or 1 as specified,
leaves no stray server process, and leaves no temp files behind.
```

---

## C9 — Link and anchor checker

```
OBJECTIVE
Create scripts/check-links.mjs: a Node 20 script validating the generated site's internal links and
image attributes.

FACTS YOU MAY RELY ON
- Generated pages are .html files in the repo root and in temples/; dev/ is excluded.
- Pages use RELATIVE URLs by design, because the site is served from a subpath on GitHub Pages.
- 404.html is the one intended exception: it uses absolute https URLs, because GitHub Pages may serve
  it from any depth.
- No HTML parsing library is available; use carefully scoped regular expressions.

STEPS
1. For every href and src in each page, resolve it relative to that page's own directory and check the
   target file exists on disk.
2. Flag any internal URL starting with "/" (except in 404.html).
3. For anchors ("#id" and "page.html#id"), check that the id exists in the target file.
4. Check every <img> and <video> has width and height attributes, and every <img> has a non-empty alt
   or an empty alt together with aria-hidden="true" or role="presentation".
5. List external http(s) links without fetching them; flag any that are not https.
6. Report duplicate id values within a file, and any file with more than one <h1>.
7. Output a grouped report (file -> findings) plus a summary; support --json and --help; exit 1 when
   any finding exists in steps 1–4 or 6, else 0.

GUARDRAILS
- Standard library only, single file, under 300 lines.
- Read-only: never modify any file.
- No false positives from inline data: URIs, mailto:, tel: or javascript: — skip those schemes.

OUTPUT FORMAT / ACCEPTANCE
As in Block C. Acceptance: running it on the current repo produces a report and a correct exit code;
reported findings can be confirmed by opening the named file.
```
