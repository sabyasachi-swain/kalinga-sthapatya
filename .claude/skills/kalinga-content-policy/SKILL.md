---
name: kalinga-content-policy
description: Content, citation and evidence-tier rules for Kalinga Sthapatya (Odisha temple architecture site). Load before researching, fact-checking, writing, or rendering ANY historical or architectural statement — dates, dynasties, heights, attributions, meanings, construction methods, glossary definitions, visual-brief accuracy notes. Defines accepted sources, the 🟢/🟡/🔴 tiers, the "leave it blank" rule, simple-English voice for families, and known pitfalls from the research report.
---

# Kalinga Sthapatya — Content Policy

This site teaches families and kids about Odisha's temples. Being wrong in public, in the voice of
an "educational" site, is the worst failure mode. **A blank field is always better than an unverified one.**

## The five non-negotiables

1. **Every factual claim is a claim object with a source.** No prose fact exists outside
   `{text, tier, sources, status, checked_on}` in `data/*.json`. HTML never hardcodes facts.
2. **Only accepted sources** (table below). Never cite something you did not open yourself.
3. **If you cannot verify it, leave it `null`.** Do not soften it into a hedge sentence, do not
   paraphrase a guess, do not "fill in" from general knowledge. Record the gap instead.
4. **Tier every claim** (🟢 established / 🟡 scholarly / 🔴 uncertain) using the decision table.
5. **Traditions are labelled as traditions.** Legends, temple lore, chronicles of disputed
   reliability → tier `uncertain`, and the sentence itself says "According to tradition…".

## Accepted sources

| Accept (source `type`) | Examples |
|---|---|
| `book` — published academic book | Donaldson 1985–87; Panigrahi 1961; Behera 1993; Percy Brown 1942 |
| `journal-article` — peer-reviewed | JSTOR / Brill / Cambridge / T&F articles, reviews with DOI |
| `primary-text` — edited primary text | *Silpa Prakasa* (Boner & Rath Sarma 1966; Baumer et al. 2005); N.K. Bose 1932 |
| `epigraphy` — published inscription | *Epigraphia Indica* volumes; published copper-plate readings |
| `asi-report` — Archaeological Survey of India | Debala Mitra, *Bhubaneswar* (1958), *Konarak* (1968); ASI monument notices |
| `unesco-icomos` | whc.unesco.org/en/list/246; SOC reports; ICOMOS mission reports |
| `government-doc` — govt archaeology/culture publications | *Odisha Review* articles (supporting only — never the sole source of a 🟢 claim) |
| `thesis` — accepted PhD thesis (Shodhganga) | supporting only, tier 🟡 at most |

**Never accepted as a citation:** Wikipedia/Wikiwand (use only to find the real source), blogs,
Medium, news sites, tourism sites (incl. odishatourism.gov.in), YouTube, social media, Quora/Reddit,
encyclopaedia summaries, AI chat output, **and the local file `Odisha Temple Archtecture research.md`**.
That report is a *map to sources*, not a source: every claim taken from it must be traced to the
original work it names, and opened there. The validator blocks these domains and the report by name.

**URL rule.** Every source needs a clickable https URL. When a book is not online, link the most
authoritative record of it, in this order: DOI → publisher page → archive.org / HathiTrust full
text → WorldCat / library catalogue record. Set `url_kind` honestly (`catalogue` means the reader
can find the book, not read it). **Never construct or guess a URL** — only URLs you fetched and
saw resolve to the right work.

## Evidence tiers — decision table

| Tier | Badge text | Use when | Hard requirements (validator-enforced) |
|---|---|---|---|
| `established` 🟢 | "Established" | Inscription, excavation, ASI/UNESCO record, or primary text states it, AND scholarship agrees | ≥1 primary-class source (epigraphy, ASI, UNESCO/ICOMOS, primary text) + ≥2 sources total. Single source allowed only for an ASI/UNESCO/epigraphic record of its own act (`single_authoritative: true` + `note`), e.g. "UNESCO inscribed Konark in 1984". |
| `scholarly` 🟡 | "Scholarly view" | Consensus of scholars from stylistic/indirect evidence; or only one accepted source | ≥1 source. Dates must be ranges / "c." |
| `uncertain` 🔴 | "Debated" | Competing hypotheses, tradition/legend, estimates | ≥1 source + `note` summarising the competing views. Dates as ranges. |

Tie-breakers: when two tiers seem possible, choose the **lower** certainty. Stylistic dating is never 🟢.
A popular claim repeated everywhere is still 🟡 or 🔴 unless a primary source anchors it.

## "Leave it blank" mechanics

- Set the field to `null` (never `""`, never omit the key — the validator requires the key).
- Add the gap to your ledger's `gaps[]` with what you searched and where.
- The site renders `null` as a quiet "Not yet verified — see our content policy" line, never as a guess.
- A section with zero approved claims is hidden, not padded.

## Writing voice (families and kids)

- Plain English, short sentences. Aim ≤ 20 words per sentence; the validator warns above 28.
- First use of any Odia/Sanskrit term: term + plain meaning in brackets — "the *gandi* (tower)".
  Every such term must exist in `glossary.json` (or be added to the researcher's gaps).
- Concrete comparisons are welcome **only if computed from cited numbers** ("about as tall as an
  18-storey building" requires a cited height; the builder computes, the writer does not guess).
- Dates: `c. 950–975 CE`, `11th century CE`, `2nd–1st century BCE`. Always CE/BCE, never AD/BC.
  Exact years only for 🟢 inscription-dated facts (Brahmesvara 1058/1060 CE; Ananta Vasudeva 1278 CE).
- Heights: metres first, feet in brackets, "about" unless measured by ASI: "about 55 m (180 ft)".
- Respectful religious framing: "Hindus believe…", "In temple tradition…", "Scholars interpret this
  as…". Never mock or debunk beliefs; never present a belief as architectural fact.
- Symbolic meanings (Mount Meru, womb-chamber, cosmic person) are **interpretations** → at most 🟡,
  phrased "Scholars such as Kramrisch explain…" with the scholar cited.
- No overclaiming words: definitely, undoubtedly, proves, certainly (validator warns).
- Kid-appropriate: describe mithuna/erotic sculpture only in neutral scholarly terms
  ("carvings of couples, which scholars link to fertility symbolism"), never in detail.

## Anti-hallucination rules for agents

- **Quote before you claim.** Every researcher claim carries a verbatim `quote` (≤ 40 words) from a
  page you fetched, plus `fetched_url` and `access` (`full-text` | `snippet` | `catalogue-only`).
- `catalogue-only` means you proved the book exists but did **not** see the supporting text. Such a
  claim is approved automatically only if a second, full-text accepted source supports it (then its
  `access` is `full-text`). Otherwise the fact-checker marks it `needs-human`, and it is published
  **only if the human signs it off at gate G2** (decision D3): then `access: "catalogue-only"`,
  `human_approved: "<date>"`, tier at most `scholarly`, locator `"unverified"`. The same applies to `snippet`.
- Never cite page numbers you did not see. Use `locator: "unverified"` rather than inventing one.
- Never merge two scholars' views into one sentence without citing both.
- If sources disagree, you do not pick a winner: tier `uncertain`, `note` lists who says what.
- Numbers from the research report's Caveats section are estimates/traditions — see pitfalls.

## Known pitfalls (from the research report) — read [pitfalls.md](pitfalls.md)

The short list: iron cramps WERE used (dry masonry ≠ "no metal"); Kendupatna plate does not date
Konark; Yayati I attributions are unproven; 700/7,000 Bhubaneswar temples are estimates; 1,200
craftsmen / 12 years / Bishu Maharana is tradition; seven horses not six; Konark's main tower has
collapsed; Silpa Prakasa's date is debated. Several of these are validator-enforced.

## AI disclosure (use verbatim on About page and footer)

> Content on this platform was researched and written with AI assistance. All facts are checked
> against the published academic sources cited on each page. Illustrations are AI-generated
> original artwork unless credited otherwise.

Every AI-generated image of a real temple carries a visible caption "AI-generated illustration".
