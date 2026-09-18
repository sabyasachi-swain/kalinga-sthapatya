# Delegation templates

Fill the `<…>` slots. Keep prompts self-contained: subagents start cold.

## Researcher (one topic)

```
Topic: <topic id> (<temple name or scope>).
Scope — find accepted-source evidence for these fields: <list, e.g. facts.date, facts.dynasty,
facts.height, facts.deity, facts.temple_type, one_liner, sections.why_built, construction, special,
influences, parts.element_ids, location (lat/lng + OpenStreetMap URL), sketchfab (CC models only)>.
Leads: "Odisha Temple Archtecture research.md" §<sections> and its bibliography — leads only, open the originals.
Known pitfalls for this topic: <from pitfalls.md>.
Registry: cite ids from data/sources.json; put new sources in new_sources[].
Output: research/ledgers/<topic>.json exactly per kalinga-data-schema ledger format.
Budget: stop after ~<40> fetches; unresolved fields go to gaps[].
Final message: counts (claims, by proposed tier), gaps, sources you could not access.
```

## Fact-checker (one ledger)

```
Verify research/ledgers/<topic>.json independently. You have not seen the researcher's reasoning; don't guess it.
For every claim: re-fetch each evidence URL, confirm the quote appears (quote_check), confirm the source
is accepted and in data/sources.json or new_sources, confirm the tier per the decision table, check pitfalls.
Write research/verdicts/<topic>.json, then research/staged/<topic>.json containing ONLY approved/revised
claims assembled into complete <target> items (<target/collection>). Unverified fields → null.
Run: node scripts/validate-content.mjs --staged research/staged/<topic>.json — must PASS.
Final message: verdict counts, every needs-human claim (one line each), validator result.
```

## Visual brief writer

```
Update visual-briefs/VISUAL_REQUIREMENTS.md for: <asset ids or "temple briefs V-60+">.
Use only verified facts from data/*.json (cite claim path) or research-report sections (cite §).
Follow the gemini-visual-brief template; keep the Global Style Block unchanged unless asked.
Add needed reference-photo views; list candidate public-domain/CC sources in visual-briefs/references/REFERENCES.md
(URL + licence, verified by fetching).
Final message: which briefs changed, any fact you needed but could not find (left as "match reference photos").
```

## Frontend builder

```
Build: <pages/components>. Files you own for this task: <exact list>. Do not touch other files.
Data: render from data/*.json (<which>); until populated use dev/fixtures/*.json (fake, clearly marked).
Media: render from data/media.json; placeholder component for status "placeholder".
Constraints: kalinga-design-system (relative URLs, no facts in markup, a11y, reduced motion, budgets).
Verify: serve locally (npx serve . or python -m http.server) and check the page loads with no console errors;
keyboard-walk every interactive element.
Final message: files changed, what you verified and how, known gaps.
```

## Asset integrator

```
Process files in visual-briefs/inbox/. For each: identify brief id from filename, open it, run the brief's
acceptance checklist, check size/format. Report pass/fail per item. DO NOT move or convert anything yet.
```
(after G4)
```
Finalise approved assets: <ids>. Convert/optimise, place under img/..., move originals to
visual-briefs/originals/, update data/media.json (status approved, width, height, alt, credit, hotspots <if V-33/V-67…>).
Run node scripts/validate-content.mjs. Final message: files placed, media.json entries changed.
```

## QA auditor

```
Audit: <quick pass: pages X,Y | full pre-launch audit>. Serve the site locally. Write qa/reports/<yyyy-mm-dd>-<scope>.md.
Report findings by severity with file:line and a reproduction step. Do not fix anything.
```
