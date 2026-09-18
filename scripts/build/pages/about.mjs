// About page: mission, content policy, methodology, image credits, contact.
// This page's prose is the *site's own policy text*, not a historical fact about temples —
// still, nothing about specific temples/dates is ever hardcoded here.

import { escapeHtml } from "../lib/html.mjs";
import { badge } from "../lib/components.mjs";
import { page } from "../lib/layout.mjs";

const ACCEPTED_SOURCES = [
  ["Academic books", "Published, peer-reviewed academic books on Indian/Odisha architecture and history."],
  ["Peer-reviewed journal articles", "Journal papers with a DOI, from established academic publishers."],
  ["Edited primary texts", "Critical editions of primary texts such as the Silpa Prakasa."],
  ["Published epigraphy", "Inscriptions published in Epigraphia Indica or similar."],
  ["ASI reports", "Archaeological Survey of India reports and monument notices."],
  ["UNESCO / ICOMOS", "World Heritage documentation, State of Conservation reports, mission reports."],
  ["Government archaeology/culture documents", "Used to support a claim, never as its sole source."],
  ["Accepted PhD theses", "Shodhganga-listed theses, used to support a claim, never alone for an “Established” claim."],
];

const REJECTED_SOURCES = [
  "Wikipedia and similar encyclopaedia summaries (used only to find the real source, never cited)",
  "Blogs, Medium, personal or fan sites",
  "News articles and tourism websites",
  "Social media, video platforms, Q&A sites (YouTube, Reddit, Quora, Facebook, Instagram, X)",
  "AI chat output of any kind",
];

const RULES = [
  "Every factual claim carries a clickable source URL.",
  "If a fact cannot be verified against an accepted source, the site leaves it blank rather than guessing.",
  "No invention, no hallucination, no presenting an assumption as fact.",
  "Dates are given as ranges or “c.” estimates unless an inscription or excavation fixes an exact year.",
  "Every historical claim carries an evidence tier badge.",
  "Traditions and legends are labelled as traditions, never presented as architectural fact.",
  "AI assistance in researching and writing this site is disclosed openly, below.",
];

function policySection(ctx) {
  const accepted = ACCEPTED_SOURCES.map(([t, d]) => `<li><strong>${escapeHtml(t)}</strong> — ${escapeHtml(d)}</li>`).join(
    "\n",
  );
  const rejected = REJECTED_SOURCES.map((d) => `<li>${escapeHtml(d)}</li>`).join("\n");
  const rules = RULES.map((r) => `<li>${escapeHtml(r)}</li>`).join("\n");
  const tiers = Object.keys(ctx.config.evidenceTiers)
    .map(
      (tier) =>
        `<li class="policy-tier">${badge(tier, ctx)} <span class="policy-tier__desc">${escapeHtml(
          ctx.config.evidenceTiers[tier].description,
        )}</span></li>`,
    )
    .join("\n");
  return `<section class="section" id="content-policy" aria-labelledby="content-policy-heading">
  <h2 id="content-policy-heading">Content policy</h2>
  <h3>Accepted sources</h3>
  <ul class="policy-list">${accepted}</ul>
  <h3>Never accepted as a citation</h3>
  <ul class="policy-list">${rejected}</ul>
  <h3>Rules</h3>
  <ol class="policy-list">${rules}</ol>
  <h3>Evidence tiers</h3>
  <ul class="policy-list policy-list--tiers">${tiers}</ul>
</section>`;
}

function methodologySection(ctx) {
  return `<section class="section" id="methodology" aria-labelledby="methodology-heading">
  <h2 id="methodology-heading">Methodology</h2>
  <ol class="methodology-steps">
    <li><strong>Research.</strong> A researcher reads accepted sources and records every claim with a
      verbatim quote, the exact page fetched, and how much of the source was actually seen (full text,
      a search snippet, or a catalogue record only).</li>
    <li><strong>Independent fact-check.</strong> A second reviewer, without seeing the researcher's
      reasoning, re-fetches every source and re-checks every quote before a claim is approved,
      revised, rejected, or flagged for a human decision.</li>
    <li><strong>Human review.</strong> A person makes the final call on anything flagged as uncertain,
      and specifically signs off any claim resting only on a catalogue record or a search snippet — such
      claims are marked “source not viewable online” wherever they appear, and can never carry the
      highest evidence tier.</li>
  </ol>
</section>`;
}

function creditsSection(ctx) {
  const assets = (ctx.data.media.assets || []).filter((m) => ["approved", "delivered"].includes(m.status));
  const body = assets.length
    ? `<ul class="credits-list">${assets
        .map((m) => {
          const c = m.credit || {};
          let line;
          if (c.type === "ai-generated") line = `AI-generated with ${escapeHtml(c.tool || "an AI image tool")}.`;
          else if (c.type === "cc" || c.type === "public-domain")
            line = `${escapeHtml(c.author || "Unknown author")} — ${escapeHtml(c.license || "")}${
              c.source_url ? ` (<a href="${escapeHtml(c.source_url)}" rel="noopener noreferrer" target="_blank">source</a>)` : ""
            }`;
          else line = "Original code asset (SVG/CSS).";
          return `<li><span class="credits-list__id">${escapeHtml(m.id)}</span> — ${line}</li>`;
        })
        .join("\n")}</ul>`
    : `<p>Illustrations for this site are still being created and reviewed. Credits will appear here once images are approved.</p>`;
  return `<section class="section" id="credits" aria-labelledby="credits-heading">
  <h2 id="credits-heading">Image credits</h2>
  ${body}
  <p class="credits-disclosure">${escapeHtml(ctx.config.aiDisclosure)}</p>
</section>`;
}

function contactSection(ctx) {
  const parts = [];
  if (ctx.config.repoUrl) {
    parts.push(
      `<p><a href="${escapeHtml(ctx.config.repoUrl)}/issues" rel="noopener noreferrer" target="_blank">Report an error or suggest a temple →</a></p>`,
    );
  }
  if (ctx.config.contactEmail) {
    parts.push(`<p><a href="mailto:${escapeHtml(ctx.config.contactEmail)}">Email us</a></p>`);
  }
  if (!parts.length) return "";
  return `<section class="section" id="contact" aria-labelledby="contact-heading">
  <h2 id="contact-heading">Contact</h2>
  ${parts.join("\n")}
</section>`;
}

export function renderAbout(ctx) {
  const bodyHtml = `
<section class="section page-intro">
  <h1>About Kalinga Sthapatya</h1>
  <p>Kalinga Sthapatya is an educational platform for families and kids to explore the temple
    architecture of Odisha. Every fact on this site is traced to a published, accepted source; where
    we could not verify something, we say so instead of guessing.</p>
</section>
${policySection(ctx)}
${methodologySection(ctx)}
${creditsSection(ctx)}
${contactSection(ctx)}
`;
  return page(ctx, {
    title: "About",
    description: "Our mission, content policy, methodology and image credits.",
    bodyHtml,
  });
}
