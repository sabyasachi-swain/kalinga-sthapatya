// Site configuration for the static build. Nulls mean "omit that UI" — never invent a value.
// Edit this file to change site-wide settings; do not hardcode these values in templates.

export const siteConfig = {
  siteName: "Kalinga Sthapatya",
  siteNameOdia: "କଳିଙ୍ଗ ସ୍ଥାପତ୍ୟ",
  // Interim tagline — implementation_plan.md's "Explore 1,400 years…" contains an unverified number.
  // Change this in one place once a cited figure exists.
  tagline: "Explore centuries of stone, symmetry, and the sacred",
  description:
    "An interactive educational platform to explore Odisha's temple architecture — every fact cited, every gap left honest.",
  lang: "en",
  // GitHub Pages sub-path site. Used for canonical URLs, Open Graph og:url and sitemap entries only —
  // never for href/src on the page itself (those stay relative).
  siteUrl: "https://sabyasachi-swain.github.io/kalinga-sthapatya/",
  repoUrl: "https://github.com/sabyasachi-swain/kalinga-sthapatya",
  contactEmail: null,
  aiDisclosure:
    "Content on this platform was researched and written with AI assistance. All facts are checked " +
    "against the published academic sources cited on each page. Illustrations are AI-generated " +
    "original artwork unless credited otherwise.",
  nav: [
    { label: "Home", href: "index.html" },
    { label: "Timeline", href: "timeline.html" },
    { label: "Academy", href: "academy.html", soon: true },
    { label: "Map", href: "map.html", soon: true },
    { label: "Compare", href: "compare.html" },
    { label: "Glossary", href: "glossary.html" },
    { label: "About", href: "about.html" },
  ],
  footerLinks: [
    { label: "About", href: "about.html" },
    { label: "Content Policy", href: "about.html#content-policy" },
    { label: "Methodology", href: "about.html#methodology" },
  ],
  evidenceTiers: {
    established: {
      label: "Established",
      icon: "🟢",
      className: "badge--established",
      description:
        "Established: an inscription, excavation, ASI/UNESCO record or primary text states this, and scholars agree.",
    },
    scholarly: {
      label: "Scholarly view",
      icon: "🟡",
      className: "badge--scholarly",
      description:
        "Scholarly view: the consensus of scholars from stylistic or indirect evidence, or a single accepted source.",
    },
    uncertain: {
      label: "Debated",
      icon: "🔴",
      className: "badge--uncertain",
      description:
        "Debated: sources disagree, or this rests on tradition or an estimate. See the note for the competing views.",
    },
  },
};

// A 5-storey building is often used as a size comparison; this assumption must always be shown on
// screen next to any comparison that uses it (design-system skill, "Size comparison").
export const sizeComparisonAssumptions = {
  humanHeightM: 1.7,
  fiveStoreyBuildingM: 15,
};
