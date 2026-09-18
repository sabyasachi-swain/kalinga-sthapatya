---
name: kalinga-data-schema
description: JSON contracts for Kalinga Sthapatya — data/*.json (temples, timeline, glossary, elements, academy, sources, media), the research pipeline files (research/ledgers, research/verdicts, research/staged), and how the validator and merge script enforce them. Load before reading, writing, rendering, or merging any of these files.
---

# Kalinga Sthapatya — Data Contracts

Single source of truth: **all facts live in `data/*.json`; HTML/JS only render them.**
Full field reference with examples: [schema-reference.md](schema-reference.md).

## Files and who writes them

| File | Holds | Written by |
|---|---|---|
| `data/sources.json` | Bibliography registry `{sources:[…]}` | merge script only |
| `data/temples.json` | 5 MVP temples `{temples:[…]}` | merge script only |
| `data/timeline.json` | Eras `{eras:[…]}` | merge script only |
| `data/glossary.json` | Terms `{terms:[…]}` | merge script only |
| `data/elements.json` | Architectural parts `{elements:[…]}` | merge script only |
| `data/academy.json` | `{temple_types, why_questions, builder_steps}` | merge script only |
| `data/media.json` | Image registry, alt text, credits, hotspots `{assets:[…]}` | asset-integrator |
| `research/ledgers/<topic>.json` | Researcher's raw claims + quotes + gaps | researcher |
| `research/verdicts/<topic>.json` | Fact-checker verdict per claim | fact-checker |
| `research/staged/<topic>.json` | Approved claims in final data shape | fact-checker |

`sources.json`, `academy.json` and `media.json` are additions to implementation_plan.md (see
EXECUTION_PLAN.md §2). The ownership hook blocks subagents from writing outside their lane.

## The claim object (the heart of everything)

```json
{
  "text": "Built around 950–975 CE.",
  "value": "c. 950–975 CE",
  "tier": "scholarly",
  "sources": [{ "id": "brown-1942", "locator": "ch. 20" }, { "id": "panigrahi-1961", "locator": "p. 57" }],
  "note": "Brown: c. 950; Panigrahi: 966 CE.",
  "access": "full-text",
  "status": "approved",
  "checked_on": "2026-09-20"
}
```

- `text` — the sentence shown to readers (simple English). Required.
- `value` — optional short display value for fact strips (`facts.*`). `value_m` (number) for heights.
- `tier` — `established` | `scholarly` | `uncertain`. Rules in kalinga-content-policy.
- `sources[]` — ids from `data/sources.json` + `locator` (page/section; `"unverified"` if not seen).
- `note` — required for `uncertain`; competing views, who says what.
- `single_authoritative` — only for an ASI/UNESCO/epigraphic record of its own act.
- `access` — required: the **weakest** evidence behind the claim — `full-text` | `snippet` | `catalogue-only`.
- `human_approved` — `YYYY-MM-DD`; **required** when `access` is `snippet` or `catalogue-only` (decision D3:
  the human signs off each such claim at gate G2). Such claims can never be `established`, and every
  locator must be `"unverified"`. Validator-enforced.
- `status` — must be `"approved"` in `data/` and `research/staged/`.
- Unverified → the whole field is `null`. Never `""`, never omit the key.

Any object with `tier`, or `text` + `sources`/`status`, is treated as a claim and fully validated.
A bare `"text"` string outside a claim object is an error.

## Pipeline formats (research → data)

**Ledger** `research/ledgers/<topic>.json` (researcher):
```json
{ "topic": "konark", "run_on": "2026-09-20",
  "claims": [{
    "cid": "konark-003", "field": "facts.date",
    "text": "Built around 1250 CE by Narasimhadeva I.", "proposed_tier": "scholarly",
    "evidence": [{ "source_id": "unesco-246", "fetched_url": "https://whc.unesco.org/en/list/246",
      "access": "full-text", "locator": "Brief synthesis",
      "quote": "built by King Narasimha I (1238-1264)" }],
    "conflicts": "Palm-leaf chronicles give 1246–1258.", "notes": "" }],
  "new_sources": [ /* full source objects not yet in data/sources.json */ ],
  "gaps": [{ "field": "facts.height", "searched": ["ASI Konarak 1968 (catalogue only)"], "why_blank": "no full-text source seen" }] }
```

**Verdict** `research/verdicts/<topic>.json` (fact-checker):
```json
{ "topic": "konark", "checked_on": "2026-09-21",
  "verdicts": [{ "cid": "konark-003", "verdict": "approved | revised | rejected | needs-human",
    "tier": "scholarly", "reason": "Quote found verbatim at fetched_url.",
    "revised_text": null, "quote_check": "found | not-found | not-fetchable" }] }
```

**Staged fragment** `research/staged/<topic>.json` (fact-checker) — final data shape:
```json
{ "target": "temples", "items": [ { /* complete temple object */ } ], "sources": [ /* new sources */ ] }
```
`target` ∈ temples | timeline | glossary | elements | academy | sources. Academy fragments add
`"collection": "temple_types" | "why_questions" | "builder_steps"`. Items are upserted by `id`,
so a fragment must contain the **complete** item, not a patch.

## Commands

```
node scripts/validate-content.mjs                  # validate data/ (runs automatically via hook)
node scripts/validate-content.mjs --staged <file>  # validate one staged fragment
node scripts/validate-content.mjs --strict         # pre-launch: warnings are errors
node scripts/merge-staged.mjs [--dry-run] <files>  # orchestrator only; validates, merges, rolls back on failure
```

## Guardrails

- Never edit `scripts/validate-content.mjs` or `scripts/merge-staged.mjs` to make content pass.
  If a rule seems wrong, stop and report it to the orchestrator, who asks the human.
- Never write placeholder/fixture text ("FIXTURE", "lorem ipsum", "TODO", "TBD") into `data/`.
  Dev fixtures live in `dev/fixtures/` and are clearly fake.
- `sort_year` is for ordering/filters only and is never displayed.
- `sections.size.height_m` must equal `facts.height.value_m`; size comparisons are computed from it.
- IDs are kebab-case and stable forever (URLs and cross-references depend on them).
