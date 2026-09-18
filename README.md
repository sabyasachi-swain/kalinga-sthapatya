# Kalinga Sthapatya (କଳିଙ୍ଗ ସ୍ଥାପତ୍ୟ)

A static, accessible, fast educational website about Odisha's temple architecture. Vanilla
HTML/CSS/JS + JSON data files, hosted on GitHub Pages. See [`implementation_plan.md`](implementation_plan.md)
for what is being built and [`EXECUTION_PLAN.md`](EXECUTION_PLAN.md) for how.

## How the site is built

**Decision D1 (pre-render):** `node scripts/build.mjs` is a zero-dependency Node script that reads
`data/*.json` and writes complete, readable static HTML pages. JavaScript (`js/main.js`) only
*enhances* what is already in the markup — every page works with JS disabled.

Templates and shared components live in `scripts/build/`:

```
scripts/build.mjs            CLI entry point
scripts/build/config.mjs     site-wide settings (name, tagline, nav, evidence tier text, etc.)
scripts/build/registry.mjs   the list of pages to build — add a page here + a pages/*.mjs module
scripts/build/lib/           data loading, HTML helpers, shared components, the page shell
scripts/build/pages/         one render() function per page
```

**Never hand-edit a generated `*.html` file** — every one starts with a comment saying so. Change
the template in `scripts/build/` or the data in `data/*.json` instead.

## Commands

```bash
node scripts/build.mjs                              # build data/ -> repo root (production)
node scripts/build.mjs --data <dir> --out <dir>      # build any data dir to any output dir
node scripts/build.mjs --data dev/fixtures --out dev/preview   # the only allowed fixture build
node scripts/build.mjs --check                       # exit 1 and list any stale committed page

node scripts/validate-content.mjs                    # validate data/ against the content policy
node scripts/validate-content.mjs --strict           # warnings become errors (pre-launch)
```

Run `node scripts/build.mjs --check` before committing — it rebuilds every page in memory and
fails if a committed page doesn't match what the templates + data would produce.

## Local preview

`data/*.json` is read at build time (baked into the HTML), but the map/compare/timeline widgets
(Phase 3) also `fetch()` JSON at runtime, which fails on `file://`. Serve the folder instead:

```bash
npx serve .
# or
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Adding a page (Phase 3+)

1. Add a `render(ctx)` function under `scripts/build/pages/your-page.mjs`, using the shared
   components in `scripts/build/lib/components.mjs` (`claim`, `figure`, `section`, `badge`,
   `unverified`, `sourcesList`, `nav`, `footer`) and the `page()` shell in `lib/layout.mjs`.
2. Add one entry to the array in `scripts/build/registry.mjs` — `outPath` determines the file's
   final location and its relative-URL depth automatically (e.g. `temples/foo.html` gets `../`
   prefixes for `css/`, `js/`, other pages).
3. Run `node scripts/build.mjs`.

Page-specific CSS (Phase 3) lives in `css/pages/<page>.css`, included only from that page's
`<head>`, not in the shared `css/style.css`.

## Content rules (see the `kalinga-content-policy` skill for the full version)

- Every fact lives in `data/*.json` as a cited claim object. HTML/JS never hardcode a date, height,
  dynasty or meaning. A `null` fact renders as "Not yet verified", never a guess.
- Only accepted sources may be cited (academic books, peer-reviewed papers, edited primary texts,
  epigraphy, ASI, UNESCO/ICOMOS, government archaeology docs) — never Wikipedia, blogs, news,
  tourism sites or AI output.
- `data/` is only ever changed via `node scripts/merge-staged.mjs` (orchestrator). Frontend work
  reads `data/`, never writes it.

## Dev fixtures and the component gallery

`dev/fixtures/*.json` mirror the real data schema with obviously fake content ("FIXTURE Temple A",
"lorem ipsum…") for building and QA-ing components without touching real data. See
[`dev/README.md`](dev/README.md).

## Accessibility & performance

Semantic landmarks, one `<h1>` per page, a skip link, keyboard-accessible accordions/tooltips/info
panels, `prefers-reduced-motion` support, relative URLs only (this site is served from a GitHub
Pages sub-path). See the `kalinga-design-system` skill for the full token/component reference and
performance budgets.
