# Schema reference

`Claim` = the claim object from SKILL.md. `Claim|null` = claim or intentionally blank.

## sources.json

```json
{ "sources": [{
  "id": "donaldson-1985",                 // kebab-case, author-year
  "type": "book",                         // book|journal-article|primary-text|epigraphy|asi-report|unesco-icomos|government-doc|thesis
  "authors": ["Thomas E. Donaldson"],
  "title": "Hindu Temple Art of Orissa",
  "year": "1985–1987",
  "publisher": "E.J. Brill, Leiden",
  "url": "https://…",                     // https, fetched and confirmed by the agent
  "url_kind": "catalogue",                // doi|publisher|archive|catalogue|official|journal
  "identifiers": { "isbn": "9789004071735", "doi": null },
  "accessed": "2026-09-20",
  "domain_reviewed": false,               // human sets true for hosts not on the trusted list
  "notes": ""
}]}
```

## temples.json

```json
{ "temples": [{
  "id": "mukteshwar",
  "name": "Mukteshvara Temple",
  "name_odia": null,
  "page": "temples/mukteshwar.html",
  "temple_type": "rekha",                 // vimana type: rekha|pidha|khakhara (for filters/icons)
  "era_id": "transitional",               // → timeline.json
  "sort_year": 960,                       // ordering + time-machine slider only; never displayed
  "location": { "place": "Bhubaneswar", "district": "Khordha", "lat": 20.2427, "lng": 85.8413,
                "coord_source": "https://www.openstreetmap.org/…" },
  "one_liner": Claim|null,
  "facts": {                              // all five keys required; null = not yet verified
    "date": Claim|null, "dynasty": Claim|null,
    "height": Claim|null,                 // with "value_m": number
    "deity": Claim|null, "temple_type": Claim|null
  },
  "sections": {                           // accordions; empty array/null → section hidden
    "parts": { "element_ids": ["pista","bada","gandi","mastaka","jagamohana"], "intro": [Claim] } | null,
    "why_built": [Claim],
    "construction": [Claim],
    "special": [Claim],
    "size": { "height_m": number|null, "note": Claim|null },
    "influences": [Claim]
  },
  "media": { "hero": "V-65", "silhouette": "V-66", "parts_diagram": "V-67" },
  "sketchfab": null | { "model_url", "embed_url", "title", "author", "author_url",
                        "license": "CC-BY-4.0", "license_url" }
}]}
```
The "Sources & Evidence" accordion is generated from every source id used in the temple — never hand-written.

## timeline.json

```json
{ "eras": [{
  "id": "transitional", "order": 4, "label": "Experiment and refinement",
  "period": Claim,                        // "c. 10th–11th century CE"
  "headline": "Ornament reaches perfection",   // editorial, no facts; fact-checker reviews wording
  "design_change": [Claim],
  "dynasty": Claim|null,
  "temples": [{ "temple_id": "mukteshwar" }, { "name": "Rajarani Temple", "temple_id": null }],
  "media": "V-23"
}]}
```

## glossary.json

```json
{ "terms": [{
  "id": "gandi", "term": "Gandi", "odia": null,
  "short": Claim|null,                    // one simple line
  "long": [Claim],
  "element_id": "gandi" | null,           // → elements.json
  "temple_ids": ["lingaraj"],
  "see_also": ["bada", "mastaka"]
}]}
```

## elements.json

```json
{ "elements": [{
  "id": "gandi", "name": "Gandi", "plain_name": "The tower",
  "group": "vertical-division",           // vertical-division|mastaka-part|bada-part|structure|plan
  "parent": null,                         // e.g. "mastaka" for "amla"
  "what": Claim|null, "why": Claim|null,
  "temple_ids": ["lingaraj", "jagannath-puri"]
}]}
```

## academy.json

```json
{
  "temple_types": [{ "id": "rekha", "name": "Rekha Deula", "plain_name": "Curved tower temple",
                     "roof_shape": Claim|null, "typical_use": Claim|null, "deity_association": Claim|null,
                     "examples": ["lingaraj"], "media": "V-30" }],
  "why_questions": [{ "id": "why-curve", "order": 1, "question": "Why does the tower curve?",
                      "answer": [Claim], "media": "V-34" }],
  "builder_steps": [{ "id": "step-ground-plan", "order": 1, "title": "Drawing the ground plan",
                      "body": [Claim], "media": "V-40" }]
}
```

## media.json

```json
{ "assets": [{
  "id": "V-33",                           // brief id from visual-briefs/VISUAL_REQUIREMENTS.md, or P-<slug> for photos
  "path": "img/diagrams/exploded-view.webp",
  "kind": "raster",                       // raster|svg
  "status": "placeholder",                // placeholder|delivered|approved|rejected
  "alt": "Exploded view of a rekha temple tower, separated into platform, walls, tower and crown",
  "decorative": false,
  "caption": "AI-generated illustration",
  "width": 1600, "height": 2000,
  "shows_real_temple": false,
  "disclosure_visible": true,
  "credit": { "type": "ai-generated", "tool": "Google Gemini", "brief": "V-33" },
  // or { "type": "cc", "author", "license", "license_url", "source_url" } | { "type": "original-code" }
  "hotspots": [{ "element_id": "gandi", "x": 40, "y": 22, "w": 20, "h": 30 }]   // % of image box
}]}
```
Pages render `status: placeholder` assets as a labelled placeholder box (asset id + alt text), so
the site works before any Gemini image arrives.
