// 404 page. GitHub Pages serves this file automatically for unmatched paths on the project's
// sub-path domain. Purely navigational — no facts involved.

import { page } from "../lib/layout.mjs";

export function renderNotFound(ctx) {
  const bodyHtml = `
<section class="section page-intro not-found">
  <h1>Page not found</h1>
  <p>We couldn't find that page. It may have moved, or the address may have a typo.</p>
  <p><a class="button button--primary" href="${ctx.rel}index.html">Go to the homepage</a></p>
  <ul class="not-found__links">
    <li><a href="${ctx.rel}academy.html">Architecture Academy</a></li>
    <li><a href="${ctx.rel}timeline.html">Timeline</a></li>
    <li><a href="${ctx.rel}map.html">Map</a></li>
    <li><a href="${ctx.rel}about.html">About</a></li>
  </ul>
</section>
`;
  return page(ctx, {
    title: "Page not found",
    description: "The page you were looking for could not be found.",
    bodyHtml,
  });
}
