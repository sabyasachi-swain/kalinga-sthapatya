---
name: kalinga-design-system
description: Frontend rules for Kalinga Sthapatya — vanilla HTML/CSS/JS on GitHub Pages, design tokens, typography, components (accordion, card, badge, tooltip, info panel, hotspots, placeholders), accessibility, motion, performance budgets, and how pages render facts from data/*.json. Load before writing or reviewing any HTML, CSS, JS, SVG markup, or page template.
---

# Kalinga Sthapatya — Design System & Frontend Rules

## Stack guardrails

- Vanilla HTML5 + CSS + ES modules. **No frameworks, no bundlers, no npm runtime deps.**
  Allowed third-party code: Leaflet (map page only, pinned exact version + SRI hash, from cdnjs or unpkg),
  Google Fonts. Anything else → ask the orchestrator.
- **Pre-render (decision D1, 2026-09-18).** `node scripts/build.mjs` (zero deps, templates in
  `scripts/build/`) bakes all text content from `data/*.json` and the shared nav/footer partials into the
  committed HTML of every page. Pages are complete and readable with JS off.
  JS only *enhances*: accordion hash-open, tooltips, info panels, hotspots, timeline navigation, glossary
  search, and the data-driven widgets (map, compare, time-machine slider) which load `data/*.json` at runtime.
- `node scripts/build.mjs --check` exits non-zero if any generated page is stale — run it before handing
  work back; QA runs it too. Never hand-edit generated regions; change the template or the data.
- **GitHub Pages serves from a sub-path** (`/<repo>/`). Use **relative URLs only** —
  `css/style.css` from root pages, `../css/style.css` from `temples/`. Never `/css/...`.
- Runtime `fetch()` of JSON (map/compare) fails on `file://`. Develop with `npx serve .` or `python -m http.server`.
- **No facts in HTML or JS.** Every date, height, name-attribution, meaning comes from `data/*.json`.
  Static copy allowed in HTML: navigation, headings, UI labels, the site's own policy text.
- Render `null` facts as `<span class="unverified">Not yet verified</span>` linking to
  `about.html#content-policy`. Hide sections with no approved claims.
- Every rendered claim shows its evidence badge and a citation link (superscript number → Sources list).

## Tokens (`css/style.css`, `:root`)

| Token | Value | Use | Contrast note |
|---|---|---|---|
| `--bg-primary` | `#FFFFFF` | page | |
| `--bg-warm` | `#FBF7F0` | alternating sections | |
| `--text-primary` | `#1A1A1A` | body, headings | 17.4:1 |
| `--text-secondary` | `#6B5B4E` | captions | 6.5:1 on white ✓ |
| `--accent` | `#A0522D` | links, buttons (white text 5.6:1 ✓) | |
| `--accent-hover` | `#8B4513` | hover | 7.1:1 ✓ |
| `--gold` | `#C9A84C` | **decoration only** (rules, selected outlines, badge backgrounds with dark text) | 2.3:1 — **never text on white** |
| `--border` | `#E5DDD0` | card borders/dividers only | 1.35:1 — form controls need `--border-strong` |
| `--border-strong` | `#8C7B6B` | inputs, focus-visible outlines | ≥3:1 ✓ |
| `--evidence-green` | `#2D7A3A` | 🟢 badge | 5.3:1 ✓ |
| `--evidence-amber` | `#8A6508` | 🟡 badge text (plan's `#B8860B` is 3.25:1 — fails AA; keep it only as a tint/background) | 5.3:1 ✓ |
| `--evidence-red` | `#C0392B` | 🔴 badge | 5.4:1 ✓ |

Spacing scale 4/8/12/16/24/32/48/64/96px; radius 8px cards, 999px pills; max content width 1200px, prose 68ch.
Theme: light only for MVP (plan decision). Still set explicit `background` on `body`.

## Typography

- Headings: Playfair Display (600/700). Body: Inter (400/600). Labels: Inter 600, small-caps, letter-spacing .04em.
- Load via one Google Fonts request with `display=swap`, `preconnect`; only the weights above.
- Odia text (later phase): reserve `font-family` fallback `"Noto Sans Oriya"`; set `lang="or"` on Odia spans now.
- Body 18px/1.6 (kids and older readers); never below 14px for any text.

## Components (all keyboard- and screen-reader-accessible)

- **Accordion** — native `<details><summary>`; JS only to enhance (open via URL hash, "expand all").
  Works with JS disabled; find-in-page works.
- **Card** — `<article>`; whole-card link via a single `<a>` with stretched pseudo-element, not nested links.
- **Evidence badge** — `<span class="badge badge--scholarly">` with **text** ("Established" / "Scholarly view" /
  "Debated") + icon; colour is never the only signal. Tooltip explains the tier.
- **Tooltip / term** — glossary terms rendered as `<button class="term" aria-describedby>`; tap to toggle on
  touch, Esc closes. Content from glossary.json `short`.
- **Info panel** (Academy hotspots, map preview card) — `<aside role="dialog" aria-modal="false" aria-labelledby>`,
  moves focus to its heading, Esc/close returns focus to the trigger. Slides in from the right on desktop,
  bottom sheet on mobile.
- **Hotspots** — `<button>`s absolutely positioned in % over the image from `media.json` hotspots, each with
  `aria-label` = element name. Also render the same list as a visible text list below the image.
- **Image placeholder** — for `media.json` status `placeholder`: a bordered box with the correct aspect ratio,
  the asset id and alt text ("Illustration coming soon: V-33 …"). Never a stock image or a random photo.
- **AI caption** — every AI image of a real temple has a visible `<figcaption>` "AI-generated illustration".
- **Buttons** — `--accent` bg, white text, 44×44px minimum target, visible `:focus-visible` ring (`--border-strong`, 3px).
- **Nav** — sticky white bar, logo + 6 links, hamburger `<button aria-expanded aria-controls>` below 768px,
  skip-link "Skip to content" as first focusable element. Current page `aria-current="page"`.
- **Footer** — About, Content Policy, Sources, AI disclosure line, "Built with ❤️ for Odisha heritage".

## Motion

- Hero build animation: CSS/SVG stroke + opacity keyed by layer ids in the hero SVG (V-10), 3–4 s, plays once.
- `@media (prefers-reduced-motion: reduce)`: show the final frame immediately; no scroll-linked motion anywhere.
- Timeline: horizontal `scroll-snap` on ≥1024px, vertical stack below; arrow-key and button navigation;
  never hijack vertical scroll.

## Page-specific notes

- **Map**: Leaflet + OSM tiles with visible attribution; muted look via CSS filter on the tile pane only.
  Provide a keyboard-usable list of temples beside/below the map (same data). Time-machine slider is an
  `<input type="range">` with `aria-valuetext` ("c. 1000 CE"), filtering by `sort_year`.
- **Compare**: silhouettes (V-xx silhouette SVGs) scaled from cited `height_m` only; if either height is null,
  show "Height not yet verified" and do not draw the scale bar. Difference sentences are computed, not written.
- **Size comparison**: human figure (V-51, 1.7 m) and 5-storey building (V-52, height from a cited/stated
  assumption shown on screen, e.g. "a 5-storey building is about 15 m") scaled against `height_m`.
- **Temple pages**: identical template; quick-facts strip from `facts`; accordion order fixed per plan.

## SEO & metadata

Semantic landmarks, one `<h1>` per page, unique `<title>` and meta description, Open Graph + Twitter card
(image V-03), schema.org `WebSite` on home and `LandmarksOrHistoricalBuildings` on temple pages — schema
values filled **only** from approved data. `sitemap.xml`, `robots.txt`, canonical URLs, `lang="en"`.

## Budgets (checked by qa-auditor)

Lighthouse ≥ 90 performance / ≥ 95 accessibility on mobile profile · first-load page weight ≤ 1.2 MB
(excluding map tiles) · images WebP with `width`/`height`, `loading="lazy"` below the fold, `srcset` for
heroes · JS per page ≤ 60 KB unminified (Leaflet excluded) · no layout shift from fonts or images (CLS < 0.1).

## Browser support

Last 2 versions of Chrome, Firefox, Safari (incl. iOS), Edge. Test widths 375, 768, 1440.
