---
name: gemini-visual-brief
description: How to write, maintain and check visual briefs for images the human will generate with Google Gemini (Claude never generates images for this project). Covers the brief template, the global style block, no-text-in-images rule, accuracy checklists for real temples, deliverable specs, file naming, and acceptance checks when assets come back. Load when editing visual-briefs/, planning any illustration/diagram/icon/SVG, or integrating a delivered image.
---

# Gemini Visual Briefs

**Division of labour.** The human generates every visual with Gemini. Claude agents only:
(1) write briefs in `visual-briefs/VISUAL_REQUIREMENTS.md`, (2) build pages that show labelled
placeholders until assets arrive, (3) check and integrate delivered files. Claude never draws
illustrations, icons or decorative SVG art itself, and never substitutes a stock/web image.

Exception (flag to the human, don't decide alone): **map geography** must come from real boundary
data, not generation — see brief M-01 in the requirements file.

## Two Gemini modes — say which one in every brief

- **Image mode** (Gemini image model): raster PNG. For illustrations, heroes, exploded view, step series.
- **Code mode** (Gemini text model writing SVG): for silhouettes, icons, markers, the hero build-up SVG,
  diagrams with exact geometry. The brief specifies viewBox, ids, and "output only the SVG".

## Rules every brief follows

1. **No text in images.** No letters, labels, numbers, signatures, watermarks, or Odia script inside any
   raster. All labels are HTML overlays (accessibility, translation, accuracy — image models garble text).
2. **Accuracy from sources, not imagination.** Temple-specific details come only from verified data or the
   research report's cited sections, and are listed as a checklist. Anything unknown says
   "match the attached reference photos" — never invent features.
3. **Reference photos are attached by the human.** Each temple brief lists what reference views are needed.
   Prefer the human's own photos or public-domain/CC0 images; record source + licence in
   `visual-briefs/references/REFERENCES.md`.
4. **Present state unless labelled.** Real temples are drawn as they stand today (Konark: collapsed main
   tower, surviving jagamohana). Reconstructions are separate briefs, captioned "Artist's reconstruction".
5. **Respect and audience.** No people or crowds, no deity idols or sanctum interiors (especially Puri
   Jagannath — exterior only), no explicit sculpture; carvings read as ornament texture at this scale.
   No flags with legible text, no modern signage, cars, wires, tourists.
6. **One consistent style** — paste the Global Style Block into every image-mode prompt and attach the
   approved style anchor (V-00) once it exists.
7. **Deliverable spec** is explicit: mode, aspect ratio, min resolution, background, file name.
8. **Every brief has an acceptance checklist** the integrator can verify by looking at the file.

## Brief template (copy for new assets)

```markdown
### V-NN — <short name>            Priority: P1|P2   Status: draft|ready|sent|delivered|approved
- **Used on:** <page / section>          - **Data link:** <media.json id / element ids / temple id>
- **Mode:** Image | Code (SVG)          - **Deliver as:** `visual-briefs/inbox/V-NN_<slug>.<png|svg>`
- **Size/ratio:** <e.g. 16:9, ≥ 2400 px wide>   - **Background:** <white / transparent / scene>
- **Must show:** <bullets — each factual bullet cites its source (data claim id or research §)>
- **Must NOT show:** <bullets>
- **Reference photos to attach:** <views needed>
- **Prompt (paste into Gemini):**
  > <Global Style Block> + <asset-specific prompt>
- **Acceptance checklist:** [ ] no text  [ ] ratio/size  [ ] matches must-show  [ ] no must-not  [ ] style matches V-00
- **Alt text (draft):** <one sentence, ≤ 125 chars>
```

## Acceptance (integrator)

When a file lands in `visual-briefs/inbox/`: open it (Read tool shows images), run the brief's checklist,
check dimensions/format, and report pass/fail per item **to the orchestrator, who asks the human to approve**.
Only after approval: convert to WebP (keep SVG as SVG, optimise), move original to
`visual-briefs/originals/`, place output under `img/…`, update `data/media.json` (`status`, `width`,
`height`, `alt`, `credit`, hotspots). Never "fix" an image by editing its content; request a regeneration.
