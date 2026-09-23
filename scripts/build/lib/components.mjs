// Shared server-side render components. Pure functions: (data-shaped args, ctx) -> HTML string.
// No facts are invented here — everything comes from the claim/media objects passed in.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { escapeHtml, classNames, uid } from "./html.mjs";

// ---------------------------------------------------------------------------- evidence badge

// `opts.dot`: the quiet, inline form used on every claim (a small coloured dot right before its
// citation) instead of the big "Scholarly view"/"Debated" pill — the pill stays for the tier
// legend (Sources section, About) where readers need the full explanation once, not on every
// sentence. Colour is never the only signal even in dot mode: the icon/label are still read by
// screen readers, and the tooltip always gives the tier name in words.
export function badge(tier, ctx, opts = {}) {
  const def = ctx.config.evidenceTiers[tier];
  if (!def) return "";
  const tipId = uid("tt");
  if (opts.dot) {
    return `<span class="badge badge--dot ${def.className}">
    <button type="button" class="badge__trigger badge__trigger--dot" aria-expanded="false" aria-describedby="${tipId}">
      <span class="badge__icon" aria-hidden="true">${def.icon}</span><span class="sr-only">${escapeHtml(def.label)}</span>
    </button>
    <span class="badge__tooltip" role="tooltip" id="${tipId}">${escapeHtml(def.description)}</span>
  </span>`;
  }
  return `<span class="badge ${def.className}">
    <button type="button" class="badge__trigger" aria-expanded="false" aria-describedby="${tipId}">
      <span class="badge__icon" aria-hidden="true">${def.icon}</span><span class="badge__label">${escapeHtml(def.label)}</span>
    </button>
    <span class="badge__tooltip" role="tooltip" id="${tipId}">${escapeHtml(def.description)}</span>
  </span>`;
}

// ---------------------------------------------------------------------------- unverified fallback

export function unverified(ctx, label = "Not yet verified") {
  return `<span class="unverified">${escapeHtml(label)} — see our <a href="${ctx.rel}about.html#content-policy">content policy</a>.</span>`;
}

// ---------------------------------------------------------------------------- claims + citations

export function isClaim(c) {
  return !!c && typeof c === "object" && typeof c.text === "string";
}

function citeNumbers(claim, ctx) {
  const nums = [];
  for (const ref of claim.sources || []) {
    const id = typeof ref === "string" ? ref : ref?.id;
    if (!id) continue;
    if (!ctx.citations.has(id)) {
      ctx.citations.set(id, ctx.citations.size + 1);
      ctx.citationOrder.push(id);
    }
    nums.push(ctx.citations.get(id));
  }
  return nums;
}

// Renders one claim as a sentence + badge + citation. Returns "" for null/empty (caller decides
// whether to fall back to unverified()). `opts.useValue`: prefer the claim's short `value` display
// string (e.g. "c. 1250 CE") over its full `text` sentence — for compact strips/cards; falls back
// to `text` when no `value` is present, so nothing is ever blanked out.
export function claim(c, ctx, opts = {}) {
  if (!isClaim(c)) return "";
  const nums = [...citeNumbers(c, ctx)].sort((a, b) => a - b);
  const citeHtml = nums.length
    ? ` <sup class="citation">[${nums.map((n) => `<a href="#source-${n}">${n}</a>`).join(",")}]</sup>`
    : "";
  const accessNote =
    (c.access === "catalogue-only" || c.access === "snippet") && c.human_approved
      ? ` <span class="claim__access-note" title="Nobody has read the full source online; a human editor signed this off.">(source not viewable online)</span>`
      : "";
  // Notes often carry fact-checker/reviewer working language ("Never use for size comparisons.").
  // We can't rewrite the text here (it's data), so it's hidden behind a closed disclosure by
  // default — a reader who wants the "why" can open it; nobody is shown reviewer language first.
  const noteHtml = c.note
    ? `<details class="claim__note"><summary>For curious grown-ups</summary><p>${escapeHtml(c.note)}</p></details>`
    : "";
  const tag = opts.tag || "p";
  const displayText = opts.useValue && c.value ? c.value : c.text;
  return `<${tag} class="${classNames("claim", opts.className)}">
    <span class="claim__text">${escapeHtml(displayText)}</span><span class="claim__meta">${badge(c.tier, ctx, { dot: true })}${citeHtml}</span>${accessNote}
  </${tag}>${noteHtml}`;
}

// Renders a list of claims (a section's body); each null entry is skipped (not padded).
export function claimsList(list, ctx, opts = {}) {
  const arr = Array.isArray(list) ? list : [list];
  return arr
    .map((c) => claim(c, ctx, opts))
    .filter(Boolean)
    .join("\n");
}

export function hasApprovedClaims(list) {
  const arr = Array.isArray(list) ? list : [list];
  return arr.some(isClaim);
}

// A single fact (e.g. facts.date): renders the claim, or the unverified fallback if null.
export function factOrUnverified(c, ctx, opts = {}) {
  return isClaim(c) ? claim(c, ctx, opts) : unverified(ctx, opts.unverifiedLabel);
}

// ---------------------------------------------------------------------------- section wrapper

// Hides itself (returns "") when there is no approved content. `body` is pre-rendered HTML;
// pass claims so the component can decide, or pass force:true for sections that render their own
// emptiness message (rare).
export function section({ id, className, heading, level = 2, headingId, body, force = false }) {
  if (!force && (!body || !body.trim())) return "";
  const hId = headingId || `${id}-heading`;
  return `<section class="${classNames("section", className)}" id="${id}" aria-labelledby="${hId}">
  <h${level} id="${hId}">${escapeHtml(heading)}</h${level}>
  ${body}
</section>`;
}

// Native <details>/<summary> accordion for a group of claims (design-system "Accordion"
// component). Keeps a real heading (nested inside <summary>, which is valid flow content) so the
// page outline and find-in-page both still work; `open` renders the first section expanded.
// Hides itself when there is no approved content, same rule as section().
export function accordionSection({ id, className, heading, subtitle, level = 2, headingId, body, open = false, force = false }) {
  if (!force && (!body || !body.trim())) return "";
  const hId = headingId || `${id}-heading`;
  const subtitleHtml = subtitle ? `<span class="accordion-section__subtitle">${escapeHtml(subtitle)}</span>` : "";
  return `<details class="${classNames("accordion-section", className)}" id="${id}"${open ? " open" : ""}>
  <summary><span class="accordion-section__heading-group"><h${level} id="${hId}">${escapeHtml(heading)}</h${level}>${subtitleHtml}</span></summary>
  <div class="accordion-section__body">${body}</div>
</details>`;
}

// ---------------------------------------------------------------------------- sources list

// `opts.legend`: prepend a short legend explaining the three evidence-tier badges, for pages
// (temple, timeline, glossary, compare) where readers meet badges before visiting About.
export function sourcesList(ctx, opts = {}) {
  if (!ctx.citationOrder.length) return "";
  const legendHtml = opts.legend
    ? `<ul class="sources-legend">
      ${Object.keys(ctx.config.evidenceTiers)
        .map(
          (tier) =>
            `<li>${badge(tier, ctx)} <span class="sources-legend__desc">${escapeHtml(ctx.config.evidenceTiers[tier].description)}</span></li>`,
        )
        .join("\n")}
    </ul>`
    : "";
  const items = ctx.citationOrder
    .map((id, i) => {
      const n = i + 1;
      const src = ctx.data.sourcesById.get(id);
      if (!src) return `<li id="source-${n}">Unknown source “${escapeHtml(id)}”.</li>`;
      const authors = (src.authors || []).join(", ");
      const kindNote =
        src.url_kind === "catalogue"
          ? " (library catalogue record — the book itself may not be online)"
          : src.url_kind === "archive"
            ? " (full text, archived copy)"
            : "";
      return `<li id="source-${n}">${escapeHtml(authors)}. <cite>${escapeHtml(src.title)}</cite>${
        src.publisher ? `, ${escapeHtml(src.publisher)}` : ""
      } (${escapeHtml(String(src.year))}). <a href="${escapeHtml(src.url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(
        src.url,
      )}</a>${kindNote}</li>`;
    })
    .join("\n");
  return `<section class="section section--warm sources" id="sources" aria-labelledby="sources-heading">
  <h2 id="sources-heading">Sources &amp; evidence</h2>
  ${legendHtml}
  <ol class="sources-list">
    ${items}
  </ol>
</section>`;
}

// ---------------------------------------------------------------------------- figure / placeholder

function placeholderBox({ id, alt, aspect, className }) {
  const label = alt ? `Illustration coming soon: ${id} — ${alt}` : `Illustration coming soon: ${id}`;
  return `<div class="placeholder ${className || ""}" style="aspect-ratio:${aspect}" role="img" aria-label="${escapeHtml(
    label,
  )}">
  <span class="placeholder__icon" aria-hidden="true">🖼</span>
  <span class="placeholder__text">${escapeHtml(label)}</span>
</div>`;
}

// Reads an approved SVG media asset and returns its inline markup (or null). Shared by figure(),
// nav's logo mark and the homepage hero build-up.
export function inlineSvgAsset(assetId, ctx) {
  const asset = assetId ? ctx.data.mediaById.get(assetId) : null;
  if (!asset || asset.status !== "approved" || asset.kind !== "svg") return null;
  const absPath = join(ctx.projectRoot, asset.path);
  if (!existsSync(absPath)) return null;
  const svg = readSvgInline(absPath);
  return svg ? { asset, svg } : null;
}

function readSvgInline(absPath) {
  try {
    const raw = readFileSync(absPath, "utf8");
    const match = raw.match(/<svg[\s\S]*<\/svg>/i);
    return match ? match[0] : null;
  } catch {
    return null;
  }
}

// If the same content figure (e.g. a temple silhouette used on both its own page and a timeline
// card) is inlined more than once on a page, its internal ids would collide. Namespace them.
// Not used for the hero build-up or nav logo mark: those are guaranteed single-instance per page
// and the hero's CSS animation depends on its exact, stable group ids (layer-ground, etc).
export function namespaceSvgIds(svg, prefix) {
  const idMap = new Map();
  svg = svg.replace(/\sid="([^"]+)"/g, (_m, id) => {
    const next = `${prefix}-${id}`;
    idMap.set(id, next);
    return ` id="${next}"`;
  });
  for (const [oldId, newId] of idMap) {
    svg = svg.split(`href="#${oldId}"`).join(`href="#${newId}"`);
    svg = svg.split(`url(#${oldId})`).join(`url(#${newId})`);
  }
  return svg;
}

// ============================================================================
// Future Responsive Image Breakpoints (srcset documentation)
// When build tooling (e.g. sharp, squoosh, or an npm pipeline) is introduced,
// generate the following srcset variants for approved raster assets:
//
// 1. Hero illustrations & full-bleed headers (source width ~1376px, e.g. V-11, V-40..V-80):
//    - 400w  : mobile 1x (375px viewport with padding)
//    - 750w  : mobile 2x / tablet 1x portrait
//    - 1050w : desktop 1x / tablet 2x
//    - 1376w : desktop 2x high-DPI (native source width)
//
// 2. Journey frames & architectural construction sequences (source width ~1200px, e.g. V-64A..C):
//    - 360w  : mobile 1x
//    - 700w  : desktop two-column 1x (~7/12 of 1200px container) / mobile 2x
//    - 1050w : desktop two-column 1.5x
//    - 1200w : desktop two-column 2x (native source width)
//
// 3. Isometric architectural diagrams (source width ~1024px, e.g. V-63, V-68, V-78):
//    - 380w  : mobile 1x / compact card
//    - 760w  : mobile 2x / desktop 1x
//    - 1024w : high-DPI desktop (native source width)
//
// 4. Temple cards, era cards, type cards (rendered at 260px - 380px desktop, full-width mobile):
//    - 320w  : mobile 1x
//    - 640w  : mobile 2x / desktop 1x
//    - 960w  : desktop 2x
// ============================================================================

// Computes layout-appropriate sizes attribute based on CSS placement.
// Matches CSS grid/flex widths across breakpoints so browsers allocate exact decoding buffers.
export function defaultSizes(opts = {}) {
  const fig = opts.figClassName || "";
  const cls = opts.className || "";
  if (fig.includes("temple-hero__figure")) {
    return "100vw";
  }
  if (fig.includes("card__figure") || fig.includes("era-card__figure") || cls.includes("card")) {
    return "(min-width: 1200px) 380px, (min-width: 640px) 50vw, calc(100vw - 32px)";
  }
  if (fig.includes("featured-temple__figure")) {
    return "(min-width: 1200px) 560px, (min-width: 800px) 50vw, calc(100vw - 32px)";
  }
  // Two-column journey stops, hero image in grid, and general figures default to two-column desktop / full mobile:
  return "(min-width: 1200px) 700px, (min-width: 900px) 58vw, calc(100vw - 32px)";
}

// Renders a media asset by id from data/media.json.
//   status "approved" -> real <img> (raster) or inlined <svg> (vector), with caption.
//   any other status, or the id missing entirely -> a labelled placeholder box (never crashes).
export function figure(id, ctx, opts = {}) {
  const { aspect = "4 / 3", className = "", decorative = false, figClassName = "", zoom = false } = opts;
  const asset = id ? ctx.data.mediaById.get(id) : null;
  const shouldZoom = zoom || (asset && asset.interim === true);

  if (!asset) {
    return `<figure class="figure ${figClassName}">${placeholderBox({ id: id || "unknown", alt: opts.fallbackAlt, aspect, className })}</figure>`;
  }

  if (asset.status !== "approved") {
    return `<figure class="figure ${figClassName}">${placeholderBox({
      id: asset.id,
      alt: asset.alt,
      aspect: asset.width && asset.height ? `${asset.width} / ${asset.height}` : aspect,
      className,
    })}</figure>`;
  }

  const zoomAttr = shouldZoom ? ' data-zoom="true"' : '';

  // A decorative image is hidden from assistive tech as well as given an empty alt, so screen
  // readers skip it instead of announcing an unnamed image.
  const altAttr =
    asset.decorative || decorative ? `alt="" aria-hidden="true"` : `alt="${escapeHtml(asset.alt || "")}"`;
  const captionParts = [];
  if (asset.caption) captionParts.push(escapeHtml(asset.caption));
  // Captions in media.json usually already carry the disclosure ("AI-generated illustration/diagram —"); don't repeat it.
  if (asset.disclosure_visible && !/AI-generated/i.test(asset.caption || "")) captionParts.push("AI-generated illustration");
  const captionHtml = captionParts.length
    ? `<figcaption>${captionParts.join(" — ")}</figcaption>`
    : "";

  if (asset.kind === "svg") {
    const absPath = join(ctx.projectRoot, asset.path);
    const inline = existsSync(absPath) ? readSvgInline(absPath) : null;
    if (!inline) {
      return `<figure class="figure ${figClassName}">${placeholderBox({ id: asset.id, alt: asset.alt, aspect, className })}</figure>`;
    }
    // Ensure the inline SVG carries width/height/role for a11y and layout stability.
    let svg = namespaceSvgIds(inline, uid(`svg-${asset.id}`));
    if (!/width=/.test(svg) && asset.width) svg = svg.replace("<svg", `<svg width="${asset.width}"`);
    if (!/height=/.test(svg) && asset.height) svg = svg.replace("<svg", `<svg height="${asset.height}"`);
    if (asset.decorative || decorative) svg = svg.replace("<svg", `<svg aria-hidden="true"`);
    else svg = svg.replace("<svg", `<svg role="img" aria-label="${escapeHtml(asset.alt || "")}"`);
    return `<figure class="figure ${figClassName} ${className}"${zoomAttr}>${svg}${captionHtml}</figure>`;
  }

  const sizesVal = opts.sizes || defaultSizes(opts);
  const sizesAttr = sizesVal ? ` sizes="${escapeHtml(sizesVal)}"` : "";
  const loadingAttr = opts.eager
    ? 'loading="eager" fetchpriority="high"'
    : 'loading="lazy" decoding="async"';

  return `<figure class="figure ${figClassName} ${className}"${zoomAttr}>
  <img src="${ctx.assetRel}${escapeHtml(asset.path)}" width="${asset.width || ""}" height="${asset.height || ""}" ${loadingAttr}${sizesAttr} ${altAttr}>
  ${captionHtml}
</figure>`;
}

// ---------------------------------------------------------------------------- nav + footer

function logoMark(ctx) {
  const asset = ctx.data.mediaById.get("V-01");
  if (asset && asset.status === "approved" && asset.kind === "svg") {
    const absPath = join(ctx.projectRoot, asset.path);
    const inline = existsSync(absPath) ? readSvgInline(absPath) : null;
    if (inline) return inline.replace("<svg", `<svg class="nav__logo-mark" aria-hidden="true"`);
  }
  return "";
}

export function nav(ctx) {
  const glossaryEmpty = !(ctx.data.glossary.terms || []).length;
  const items = ctx.config.nav
    .map((item) => {
      const current = ctx.outPath === item.href || (ctx.outPath === "index.html" && item.href === "index.html");
      const isSoon = item.soon || (item.href === "glossary.html" && glossaryEmpty);
      const soonTag = isSoon ? ` <span class="nav__soon">Soon</span>` : "";
      return `<li><a href="${ctx.rel}${item.href}"${current ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}${soonTag}</a></li>`;
    })
    .join("\n");
  return `<header class="site-header">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <nav class="nav" aria-label="Primary">
    <a class="nav__logo" href="${ctx.rel}index.html">
      ${logoMark(ctx)}
      <span class="nav__logo-text">${escapeHtml(ctx.config.siteName)}</span>
    </a>
    <button type="button" class="nav__toggle" aria-expanded="false" aria-controls="primary-menu">
      <span class="sr-only">Menu</span>
      <span class="nav__toggle-icon" aria-hidden="true"></span>
    </button>
    <ul class="nav__menu" id="primary-menu">
      ${items}
    </ul>
  </nav>
</header>`;
}

export function footer(ctx) {
  const links = ctx.config.footerLinks
    .map((l) => `<li><a href="${ctx.rel}${l.href}">${escapeHtml(l.label)}</a></li>`)
    .join("\n");
  const contact = ctx.config.contactEmail
    ? `<p class="site-footer__contact"><a href="mailto:${escapeHtml(ctx.config.contactEmail)}">Contact us</a></p>`
    : "";
  return `<footer class="site-footer">
  <div class="site-footer__inner">
    <nav aria-label="Footer">
      <ul class="site-footer__links">
        ${links}
      </ul>
    </nav>
    ${contact}
    <p class="site-footer__disclosure">${escapeHtml(ctx.config.aiDisclosure)}</p>
    <p class="site-footer__tagline">Built with ❤️ for Odisha heritage.</p>
  </div>
</footer>`;
}
