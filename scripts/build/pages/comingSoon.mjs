// Temporary "coming soon" pages for nav targets that Phase 3 has not built yet, so the navigation
// never 404s. Purely navigational — describes what the page will offer, states no facts.
// Phase 3 replaces each registry entry with the real page module.

import { page } from "../lib/layout.mjs";
import { escapeHtml } from "../lib/html.mjs";

export function comingSoon({ title, promise }) {
  return function renderComingSoon(ctx) {
    const bodyHtml = `
<section class="section page-intro coming-soon">
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(promise)}</p>
  <p>This page is being built. Every fact on it will be checked against published sources before it appears.</p>
  <p><a class="button button--primary" href="${ctx.rel}index.html">Back to the homepage</a>
     <a class="button" href="${ctx.rel}about.html#methodology">How we check facts</a></p>
</section>
`;
    return page(ctx, { title, description: `${title} — coming soon on Kalinga Sthapatya.`, bodyHtml });
  };
}
