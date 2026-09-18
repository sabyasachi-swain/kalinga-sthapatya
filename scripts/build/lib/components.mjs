// Shared server-side render components. Pure functions: (data-shaped args, ctx) -> HTML string.
// No facts are invented here — everything comes from the claim/media objects passed in.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { escapeHtml, classNames, uid } from "./html.mjs";

// ---------------------------------------------------------------------------- evidence badge

export function badge(tier, ctx) {
  const def = ctx.config.evidenceTiers[tier];
  if (!def) return "";
  const tipId = uid("tt");
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

function isClaim(c) {
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
// whether to fall back to unverified()).
export function claim(c, ctx, opts = {}) {
  if (!isClaim(c)) return "";
  const nums = citeNumbers(c, ctx);
  const citeHtml = nums.length
    ? ` <sup class="citation">[${nums.map((n) => `<a href="#source-${n}">${n}</a>`).join(",")}]</sup>`
    : "";
  const accessNote =
    (c.access === "catalogue-only" || c.access === "snippet") && c.human_approved
      ? ` <span class="claim__access-note" title="Nobody has read the full source online; a human editor signed this off.">(source not viewable online)</span>`
      : "";
  const noteHtml = c.note
    ? `<p class="claim__note"><span class="claim__note-label">Note:</span> ${escapeHtml(c.note)}</p>`
    : "";
  const tag = opts.tag || "p";
  return `<${tag} class="${classNames("claim", opts.className)}">
    <span class="claim__text">${escapeHtml(c.text)}</span> ${badge(c.tier, ctx)}${citeHtml}${accessNote}
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

// ---------------------------------------------------------------------------- sources list

export function sourcesList(ctx) {
  if (!ctx.citationOrder.length) return "";
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
  return `<section class="section sources" id="sources" aria-labelledby="sources-heading">
  <h2 id="sources-heading">Sources &amp; evidence</h2>
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
function namespaceSvgIds(svg, prefix) {
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

// Renders a media asset by id from data/media.json.
//   status "approved" -> real <img> (raster) or inlined <svg> (vector), with caption.
//   any other status, or the id missing entirely -> a labelled placeholder box (never crashes).
export function figure(id, ctx, opts = {}) {
  const { aspect = "4 / 3", className = "", decorative = false, figClassName = "" } = opts;
  const asset = id ? ctx.data.mediaById.get(id) : null;

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

  const altAttr = asset.decorative || decorative ? `alt=""` : `alt="${escapeHtml(asset.alt || "")}"`;
  const captionParts = [];
  if (asset.caption) captionParts.push(escapeHtml(asset.caption));
  // Captions in media.json usually already carry the disclosure ("AI-generated illustration/diagram …"); don't repeat it.
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
    return `<figure class="figure ${figClassName} ${className}">${svg}${captionHtml}</figure>`;
  }

  return `<figure class="figure ${figClassName} ${className}">
  <img src="${ctx.assetRel}${escapeHtml(asset.path)}" width="${asset.width || ""}" height="${asset.height || ""}" loading="${
    opts.eager ? "eager" : "lazy"
  }" ${altAttr}>
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
  const items = ctx.config.nav
    .map((item) => {
      const current = ctx.outPath === item.href || (ctx.outPath === "index.html" && item.href === "index.html");
      return `<li><a href="${ctx.rel}${item.href}"${current ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a></li>`;
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
