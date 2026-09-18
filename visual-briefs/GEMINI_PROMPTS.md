# Gemini Prompts — Kalinga Sthapatya

Copy-paste prompts for **every** visual on the site. Each prompt is complete on its own — style,
scene, accuracy rules and exclusions are written out in full. Asset ids match
[VISUAL_REQUIREMENTS.md](VISUAL_REQUIREMENTS.md) (the checklist) and `data/media.json` (the site registry).

---

## 0. Before you start

### Which Gemini to use
| Prompt marked | Use | Settings |
|---|---|---|
| **IMAGE** | Gemini's image-generation model (Gemini app → create image, or Google AI Studio with an image-capable Gemini model) | Set the **aspect ratio** given. Use the highest resolution offered (2K/4K) for heroes and the exploded view. |
| **SVG** | Gemini's regular text model (the "Pro"/thinking one is best for code) | Paste the prompt; save the reply as a `.svg` file. If it wraps the code in ``` fences, delete the fences. |

### Attachments
- **Style anchor:** after you approve **V-00**, attach it to every *recognizable-style* prompt (marked "Attach V-00").
  After you approve **V-11**, attach it to every *artistic-style* prompt (marked "Attach V-11").
- **Reference photos:** temple prompts say which views to attach. Use your own photos or public-domain /
  CC-licensed ones and note each in `references/REFERENCES.md`. Gemini follows attached photos much better
  than descriptions — for real temples, the photo is what makes it accurate.

### Saving
Save into `visual-briefs/inbox/` with the id first: `V-33_exploded-view.png`, `V-13_icon-rekha.svg`, …
Only the `V-NN_` prefix matters. Then tell Claude `/kalinga-orchestrator phase-4`.

### Order (so styles stay consistent)
1. **Batch 1 — anchors:** V-00, V-11, V-10, V-01
2. **Batch 2 — generic set:** V-13–15, V-30–32, V-33, V-34–38, V-40–45, V-50–52, V-20–24, V-03
3. **Batch 3 — real temples** (with reference photos): V-60s, V-65s, V-70s, V-75s, V-80s, V-12
4. **Later / on hold:** V-25, V-83

### Fix-up prompts (reply to Gemini in the same chat)
- *Text crept in:* "Keep the image exactly the same, but remove every letter, number, symbol or mark that looks like writing, anywhere in the picture."
- *People/cars appeared:* "Keep everything else identical; remove all people, animals and vehicles and fill the space with the same ground surface."
- *Tower looks like a cone or pyramid:* "Keep composition and style. The main tower must curve like a sugar-loaf: nearly vertical sides at the bottom that bend inward more and more toward the top, ending under a large flattened ribbed disc — not a straight-sided cone."
- *Looks South-Indian / Mughal / Thai:* "This is Odisha (Kalinga) architecture: no domes, no onion shapes, no gopuram gateway towers, no pointed arches, no gold spires. Keep the curved ribbed tower and the stepped-tier hall roof."
- *Proportions drift from the photo:* "Match the attached photograph's proportions exactly: <e.g. the hall should be lower / the tower taller and narrower>. Keep the painting style."
- *Style drifts:* "Match the colour palette, light direction and brushwork of the first attached image exactly."
- *SVG problems:* "Return the SVG again with: exactly viewBox='…', no width/height attributes, no <text>, no transforms on groups, all ids as listed, and nothing outside the <svg> element."

### Rules baked into every prompt (why they're there)
- **No text in images** — the website adds labels itself (accurate, accessible, translatable to Odia later).
- **No people / deities / interiors / explicit carvings** — audience includes kids; respect for living temples.
- **Real temples in present-day state** — e.g. Konark's main tower has collapsed and must not be drawn standing.

---

## 1. Brand & landing

### V-00 · Style anchor (reference only, not on the site)
**IMAGE · 4:3 · save as `V-00_style-anchor.png`**
```
Create a detailed painted architectural illustration in digital gouache of a single, generic Hindu
temple in the classic Kalinga style of Odisha, India — not any specific real temple.

The temple has two connected parts standing on a low stone platform. On the right, the sanctum tower
(rekha deula): a tall, solid stone tower whose sides rise almost vertically and then curve steadily
inward toward the top like a sugar-loaf. Its surface is divided into vertical ribbed projections, and
horizontal bands mark storeys up its height. Near the summit sits a large, flattened, ribbed
circular stone disc, and above that a small dome-shaped cap and a pot-shaped finial. On the left, joined
to the tower, a lower square assembly hall whose roof is a stepped pyramid made of several stacked
horizontal stone tiers, crowned by a bell-shaped element, a smaller ribbed disc and a pot finial.

Materials: weathered grey-brown and ochre sandstone for the temple, a darker laterite red-brown for the
platform. Walls show fine carved mouldings and ornament that read as texture from this distance.

View: three-quarter view from the front-left at eye level, whole temple in frame with space around it.
Setting: a small, clean stone courtyard with a strip of lawn, one or two coconut palms far to the side,
clear pale-blue morning sky with light haze. Soft warm morning light from the left, gentle shadows.

Style: painterly but architecturally precise, calm and inviting, suitable for a family education
website. Palette leans on laterite red, sandstone ochre, khondalite grey-brown and warm cream light.

The image must contain no text of any kind — no letters, numbers, labels, signatures, watermarks or
logos — and no people, animals, vehicles, modern signs, power lines, domes, onion shapes, or South
Indian gopuram gateways.
```

### V-01 · Logo mark
**SVG · save as `V-01_logo.svg`**
```
Write a single, valid, minimal SVG logo mark. Output only the SVG code, nothing else.

Canvas: viewBox="0 0 64 64", no width or height attributes.
Subject: the silhouette of an Odisha (Kalinga) rekha temple tower, as one solid shape:
- a short rectangular base from about x=18 to x=46, y=50 to y=58;
- above it the tower: starts 26 units wide at y=50 and rises to y=16, its left and right edges almost
  vertical at first and then curving smoothly inward (convex, like a sugar-loaf), ending about 12 units
  wide at the top;
- on top, a flattened ellipse-like ribbed disc (about 18 wide, 5 tall) centred at x=32, y=13, with 5–7
  small vertical notches along its edge to suggest ribs;
- above the disc a small dome cap and a tiny pot-shaped finial reaching y=4.
Everything filled with fill="currentColor", one group with id="logo". Perfectly symmetrical around x=32.
Keep it bold and simple so it still reads at 16×16 pixels.
Do not use <text>, <image>, <style>, <script>, filters, gradients, transforms, or external references.
Round coordinates to 1 decimal place.
```

### V-03 · Social share image (Open Graph)
**IMAGE · 16:9 (Claude crops to 1200×630) · save as `V-03_og.png` · Attach V-11**
```
Create a wide, warm flat-vector editorial illustration for a website's social-media preview image,
matching the attached illustration's style exactly.

Composition: the right half shows a gentle skyline of three stylised Kalinga (Odisha) temple towers of
different heights standing on low platforms — each tower curving inward toward the top like a
sugar-loaf, with vertical ribs and a flattened ribbed disc near the top; the tallest in the middle.
Soft layered silhouettes of coconut palms and low hills behind them. The entire left half is calm,
empty cream sky with a faint warm glow of sunrise at the far left edge. Keep important content away
from the top and bottom 10% (it will be cropped).

Style: flat vector shapes with subtle paper-grain texture; limited palette of laterite red #A0522D,
deep sienna #8B4513, sandstone gold #C9A84C, khondalite brown-grey #6B5B4E, cream #FBF7F0 and charcoal
#1A1A1A. Soft light from the left. Calm, elegant, generous empty space.

No text of any kind, no letters, numbers, logos, watermarks or frames. No people, animals or vehicles.
```

### V-10 · Hero "temple builds itself" line drawing
**SVG · save as `V-10_hero-build.svg`**
```
Write a single valid SVG line drawing of a Kalinga (Odisha) style Hindu temple, to be animated on a
website so it "draws itself" layer by layer. Output only the SVG code.

Canvas: viewBox="0 0 1200 800", no width/height attributes. Leave the left 40% (x < 480) empty.
All drawing is outline strokes: every <path> has fill="none" stroke="currentColor" stroke-width="2"
stroke-linecap="round" stroke-linejoin="round" and pathLength="1". Fewer than 80 paths in total.
Use these groups, in exactly this document order, with these ids:

1. id="layer-ground": one horizontal ground line from x=500 to x=1180 at y=720, plus 2–3 short
   tufts of grass strokes.
2. id="layer-pista": the platform — a low wide rectangle-like plinth from x=560 to x=1140, y=690 to
   y=720, with one horizontal moulding line and a short flight of steps at the left end.
3. id="layer-bada": the wall section of the sanctum, centred at x=930, from y=560 to y=690, about 170
   wide, with its face broken into projecting vertical bands and 5 horizontal moulding lines (base
   mouldings, lower wall, middle band, upper wall, top cornice).
4. id="layer-gandi": the tower above the wall, from y=560 up to y=170, starting 170 wide and curving
   smoothly inward (convex sugar-loaf profile — nearly vertical at the bottom, bending in toward the
   top) to about 70 wide; show 4–5 vertical rib lines following the curve and 8–10 short horizontal
   storey lines, with tiny disc shapes at the corners of every second storey.
5. id="layer-mastaka": the crown on top: a recessed neck, a large flattened ribbed disc about 110 wide
   and 26 tall (draw 8–10 small vertical ribs on it), a dome-shaped cap, a pot-shaped finial, and a thin
   staff with a small plain triangular pennant, reaching y=70.
6. id="layer-jagamohana": the assembly hall to the left of the tower, from x=620 to x=830, wall from
   y=600 to y=690, roof as a stepped pyramid of 5–6 horizontal tiers each slightly narrower than the one
   below, topped by a bell shape, a small ribbed disc and a pot finial at about y=420.

Proportions must look elegant and architecturally plausible. No <text>, <image>, <style>, <script>,
filters, gradients, fills, clipPaths, transforms or external references. Round coordinates to 1 decimal.
```

### V-11 · Hero illustration (landing page)
**IMAGE · 16:9 · highest resolution · save as `V-11_hero.png` · Attach V-00**
```
Create a warm flat-vector editorial illustration for the hero banner of a family education website
about Odisha's temple architecture. Use the temple in the attached image as the subject, simplified
into flat-vector style — the same silhouette: a tall sugar-loaf curved tower with vertical ribs and a
flattened ribbed disc near the top, and a lower hall with a stepped pyramid roof of stacked tiers,
standing on a low platform.

Composition: the temple sits in the right 55% of the frame, slightly below centre, large and
confident. Behind it, soft layered silhouettes of coconut palms and gentle distant hills in paler
tones. The left 45% of the frame is open, calm cream sky with a soft warm sunrise glow at the far
left edge — this area must stay empty because the website places its headline there.

Style: flat vector shapes with subtle paper-grain texture, clean edges, a few decorative carved-pattern
details on the temple rendered as simple shapes. Palette strictly: laterite red #A0522D, deep sienna
#8B4513, sandstone gold #C9A84C, khondalite brown-grey #6B5B4E, cream #FBF7F0, charcoal #1A1A1A.
Soft morning light from the left, long gentle shadows to the right. Calm, dignified, welcoming.

No text of any kind — no letters, numbers, logos, watermarks, frames or borders. No people, animals,
birds, vehicles, flags with writing, or modern buildings.
```

### V-12 · Featured temple: Konark (artistic)
**IMAGE · 3:2 · save as `V-12_konark-featured.png` · Attach V-11 + 2 Konark reference photos (south-east view; close-up of one wheel)**
```
Create a warm flat-vector editorial illustration of the Konark Sun Temple in Odisha AS IT STANDS
TODAY, in the style of the first attached illustration, with the proportions taken from the attached
photographs.

What must be shown: the great surviving assembly hall (jagamohana) — a massive square building whose
roof is a pyramid of stacked horizontal stone tiers in groups, rising to a crowning finial — standing
on a very tall platform that is carved to look like a gigantic chariot. Along the side of the
platform, a row of huge carved stone wheels with spokes. At the front (east) end, near the steps,
weathered stone horse statues as if pulling the chariot. Behind the hall, where the main tower once
stood, only a low ruined stone base remains — the main tower is NOT standing.

Setting: open lawns and a few trees, clear morning sky, sunrise light from the left (east).
Style: flat vector shapes with subtle paper-grain texture; palette of laterite red #A0522D, sienna
#8B4513, sandstone gold #C9A84C, khondalite brown-grey #6B5B4E, cream #FBF7F0, charcoal #1A1A1A.

Do not draw a complete tall tower behind the hall. No sand, no scaffolding, no people, animals,
vehicles, signs, or text of any kind (no letters, numbers, watermarks).
```

### V-13 · V-14 · V-15 · Temple-type icons
**SVG · save as `V-13_icon-rekha.svg`, `V-14_icon-pidha.svg`, `V-15_icon-khakhara.svg`**
```
Write three separate, valid SVG icons as a consistent set — output the three SVG documents one after
another, with nothing else. Each: viewBox="0 0 48 48", no width/height, outline style with
fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round",
4 units of padding, optically centred, same visual weight, readable at 24 px. One group per icon with
id="icon".

Icon 1 — REKHA temple (Odisha curvilinear tower): a small rectangular base, above it a tall tower whose
sides rise nearly vertically and curve inward toward the top like a sugar-loaf, two vertical rib lines
inside, and on top a flattened disc (drawn as a wide low ellipse) with a tiny pot finial.

Icon 2 — PIDHA temple (stepped-pyramid roof): a square wall block, above it 4 horizontal roof tiers
stacked like steps, each narrower than the one below, forming a pyramid, topped by a small bell shape
and a tiny disc.

Icon 3 — KHAKHARA temple (barrel-vault roof): an oblong wall block clearly wider than it is tall, with
a roof shaped like a half-cylinder / upturned boat running along its length (seen from the long side),
with 2–3 small finials along the ridge.

No <text>, fills, gradients, transforms, filters or external references. Round to 1 decimal.
```

---

## 2. Timeline — era silhouettes

### V-20 … V-24 · Five era silhouettes (V-25 is on hold)
**SVG · save as `V-20_era-1.svg` … `V-24_era-5.svg`**
```
Write five separate, valid SVG silhouettes that form a consistent set for a timeline of Odisha temple
architecture. Output the five SVG documents one after another, nothing else.

Every file: viewBox="0 0 400 400", no width/height, solid shapes with fill="currentColor", a flat
ground line at y=380 (the shape's base sits on it), centred horizontally, bold and simple, no
interior detail thinner than 3 units. Schematic, not to scale, but each era a little taller and more
complex than the previous one (except era 5, explained below). One group id="structure" per file.
No <text>, strokes (except where stated), gradients, transforms, filters or external references.

1 (Rock-cut roots, 2nd–1st century BCE): a low, wide rocky hill (irregular top edge, x 40–360,
  highest point y≈250) with a cave front cut into it: a flat-roofed verandah with 4 square pillars
  and dark rectangular cell doorways behind (use fill-rule evenodd cut-outs).
2 (Formative temples, 7th–9th century): a small temple — on the right a modest curved sugar-loaf
  tower (height to y≈190) with a flattened disc on top; on the left, attached, a low rectangular hall
  with an almost flat roof.
3 (Transitional, 10th–11th century): a temple with a curved tower (to y≈150) and attached hall whose
  roof is a stepped pyramid of 4 tiers, plus, standing separately in front on the left, a small
  free-standing arched stone gateway (two pillars and a rounded arch).
4 (Mature / monumental, 11th–12th century): a very tall curved tower (to y≈40) with a large flattened
  disc, and three lower halls in a row in front of it to the left, each with a stepped-tier roof,
  getting lower toward the left.
5 (Grand finale, 13th century — Konark as it stands today): a massive hall with a tall stepped
  pyramid roof of stacked tiers (to y≈120), on a tall platform; along the platform's side a row of 4
  large wheels shown as circles with spokes cut out; at the front left 2 small horse shapes. Its main
  tower has collapsed, so draw only a low ruined stump on the right. ALSO add a second group
  id="ghost-vimana" containing only a dashed outline (fill="none" stroke="currentColor"
  stroke-width="2" stroke-dasharray="6 6") of a tall curved sugar-loaf tower rising from the stump to
  y≈20 — it represents the estimated original tower.
```

### V-25 · Era 6 — Late Kalinga (ON HOLD)
Wait until research names a representative 15th–16th-century temple. Then use this template:
```
Write one valid SVG silhouette matching a set of timeline silhouettes: viewBox="0 0 400 400", no
width/height, fill="currentColor", ground line at y=380, centred, bold and simple, group
id="structure", no text/gradients/transforms. Subject: <representative temple named by research>,
traced from the attached photograph's outline, simplified to a clean silhouette.
```

---

## 3. Architecture Academy

### V-30 · Rekha deula (type card)
**IMAGE · 4:3 · save as `V-30_type-rekha.png` · Attach V-00**
```
Create a detailed painted architectural illustration (digital gouache), matching the attached image's
painting style, lighting and colours exactly, of one generic Odisha REKHA DEULA — a temple whose
defining feature is a tall curvilinear tower. Not any specific real temple.

Show the tower alone on a small stone platform: square in plan, its walls divided into projecting
vertical bands; the lower wall section with horizontal carved mouldings; above it the tower rising
with nearly vertical sides that curve steadily inward toward the top like a sugar-loaf, with vertical
ribs and horizontal storey bands; at the summit a large flattened ribbed stone disc, a dome-shaped
cap and a pot-shaped finial with a small plain flag.

Composition: centred, three-quarter view from slightly above eye level, the whole building visible
with even margins. Background: plain flat warm cream (#FBF7F0), no scenery, only a soft contact shadow.
Soft morning light from the upper left.

No text, letters, numbers or watermarks. No people, animals, trees or other buildings.
```

### V-31 · Pidha deula (type card)
**IMAGE · 4:3 · save as `V-31_type-pidha.png` · Attach V-30**
```
Create a painted architectural illustration matching the attached image EXACTLY in painting style,
camera angle, lighting, platform, background and scale, but showing one generic Odisha PIDHA DEULA
instead: a square stone hall with carved walls whose roof is a pyramid of horizontal stone platforms
(pidhas) stacked in tiers, each tier slightly smaller than the one below, arranged in two or three
groups separated by recessed bands; crowned by a bell-shaped element, a flattened ribbed disc, a small
cap and a pot-shaped finial. Plain flat warm cream background (#FBF7F0), soft contact shadow.
No text, letters, numbers, watermarks, people, animals, trees or other buildings.
```

### V-32 · Khakhara deula (type card)
**IMAGE · 4:3 · save as `V-32_type-khakhara.png` · Attach V-30**
```
Create a painted architectural illustration matching the attached image EXACTLY in painting style,
camera angle, lighting, platform, background and scale, but showing one generic Odisha KHAKHARA DEULA
instead: a temple on an oblong (rectangular, longer than wide) plan, with carved walls, whose roof is
a barrel vault — a long, rounded, wagon-roof shape like an upturned boat or a halved pumpkin running
along the length of the building, with small finials along its ridge. Plain flat warm cream
background (#FBF7F0), soft contact shadow.
No text, letters, numbers, watermarks, people, animals, trees or other buildings.
```

### V-33 · Exploded view of a temple ⭐
**IMAGE · 4:5 portrait · highest resolution · save as `V-33_exploded-view.png`**
```
Create a high-quality 3D architectural render of an Odisha (Kalinga) rekha temple tower shown as an
EXPLODED VIEW: its parts pulled apart vertically along one central axis, floating one above the other
with clear white gaps between them, like a museum model. Three-quarter view from slightly above, pure
white background, soft studio lighting from the upper left, subtle soft shadows under each piece.
Realistic carved stone: grey-brown khondalite for the temple, darker red-brown laterite for the platform.

From the BOTTOM of the image to the TOP, in this order and roughly in these vertical positions:
1. Bottom 12% of the image: the PLATFORM — a low, wide laterite stone plinth with a simple moulding.
2. From about 12% to 35% (from the bottom): the WALL SECTION — a square stone block whose faces are
   broken into projecting vertical bands, clearly divided into FIVE stacked horizontal zones: at the
   base a band of layered mouldings; a tall lower wall zone with carved niches; a narrow middle band of
   mouldings; an upper wall zone; and a top cornice band.
3. From about 35% to 70%: the TOWER — rising from the wall with nearly vertical sides that curve steadily
   inward toward the top like a sugar-loaf; each face has five vertical projections (a wide central one
   and two on each side), and horizontal storey divisions marked by small ribbed discs at the corners.
4. Top 30%: the CROWN pieces, each separated by a gap, stacked in order: a recessed round neck; a large,
   flattened, ribbed stone disc (like a giant gear-edged cushion); a dome-shaped cap; a pot-shaped
   finial; and at the very top a small plain metal emblem on a short staff with a plain cloth flag.

All pieces are centred on the same vertical axis. The whole composition fills the frame with a small
white margin. No text, labels, arrows, numbers, lines or watermarks anywhere. No people, no background
scenery, no second building.
```
*If Gemini merges pieces:* "Keep everything, but increase the empty white gaps between every separated
part so each floats clearly apart."

### V-34 · Why does the tower curve?
**SVG · save as `V-34_why-curve.svg`**
```
Write one valid SVG educational diagram. Output only the SVG code.
viewBox="0 0 800 500", no width/height. Flat two-tone: shapes in fill="currentColor" at opacity 0.85
and accent elements in #C9A84C. Background transparent. Ground line at y=460.

Left half (centred at x=220): a stylised mountain peak — a tall, steep, slightly concave mountain with
a rounded summit, rising from y=460 to y=60, about 300 wide at the base (group id="mountain").
Right half (centred at x=580): side profile of an Odisha rekha temple tower of the same height: a short
wall base, then a tower with nearly vertical sides curving inward toward the top like a sugar-loaf,
topped by a flattened ribbed disc and a pot finial (group id="tower").
Over the tower, trace its curved outer profile as a thick accent line (stroke="#C9A84C"
stroke-width="6" fill="none") in group id="curve", and draw the same curve faintly (dashed) over the
mountain's flank in group id="curve-echo", showing the resemblance.
No <text>, transforms, filters, gradients or external references. Round to 1 decimal.
```

### V-35 · Why is the sanctum dark?
**SVG · save as `V-35_why-dark.svg`**
```
Write one valid SVG educational diagram. Output only the SVG code.
viewBox="0 0 800 500", no width/height. Flat style: walls in fill="currentColor", accent #C9A84C.

A simple vertical CROSS-SECTION through an Odisha temple sanctum, as if cut in half:
- group id="walls": very thick stone walls (each about 90 wide) on both sides of a square inner
  chamber, rising into a tower whose inner space narrows upward through corbelled (stepped-in) stone
  courses, then solid masonry up to a curved outer tower profile and crown.
- group id="sanctum": the inner chamber, a square about 200×200 at ground level, filled very dark
  (#1A1A1A).
- one small doorway through the left wall at floor level.
- group id="light": a single soft wedge of light (fill="#C9A84C" opacity 0.5) entering only through
  the doorway and fading across the chamber floor; everything else inside stays dark.
No <text>, people, deity figures, transforms, filters or external references. Round to 1 decimal.
```

### V-36 · Why do the parts have body names?
**SVG · save as `V-36_why-body.svg`**
```
Write one valid SVG educational diagram. Output only the SVG code.
viewBox="0 0 800 500", no width/height. Flat style, fill="currentColor" plus accent #C9A84C.

Left (centred x=250): the front elevation of an Odisha rekha temple, from y=460 up to y=40, split into
three stacked groups: id="temple-bada" (the lower wall section, bottom 30% of its height),
id="temple-gandi" (the curved sugar-loaf tower, middle 50%), id="temple-mastaka" (the crown: neck,
flattened ribbed disc, cap, pot finial, top 20%).
Right (centred x=580): a simple, friendly, neutral human figure outline seated cross-legged, the SAME
total height, split into three groups aligned to the same bands: id="body-lower" (crossed legs and
hips), id="body-torso" (torso and arms), id="body-head" (neck and head). No face details, no
clothing, no religious attributes.
Between them draw three faint horizontal dashed guide lines (stroke="#C9A84C", stroke-dasharray="8 6")
at the two band boundaries and the top, in group id="guides".
No <text>, transforms, filters or external references. Round to 1 decimal.
```

### V-37 · How do the stones stay up without mortar?
**SVG · save as `V-37_how-stones.svg`**
```
Write one valid SVG educational diagram. Output only the SVG code.
viewBox="0 0 800 500", no width/height. Flat style: stone blocks fill="currentColor" at opacity 0.8
with thin light joint lines; iron parts in #6B5B4E with a darker outline; accent #C9A84C.

Show a cut-away detail of dry stone masonry (no mortar):
- group id="blocks": 5 horizontal courses of large rectangular dressed stone blocks, laid in a
  staggered bond, precise tight joints.
- group id="corbel": on the right side, the courses step inward one above another (corbelling), each
  course projecting a little beyond the one below it toward the centre, as in a tower's interior.
- group id="cramp": on the top of one course, a simple flat iron cramp (a plain bar with its two ends
  turned down) set into matching recesses across the joint between two neighbouring blocks, shown
  slightly lifted above its slot with a dashed outline of the slot. Keep its shape plain and generic.
- group id="dowel": a short vertical iron pin passing through the joint between two courses, shown
  partly exposed in a cut-away.
No <text>, arrows, people, transforms, filters or external references. Round to 1 decimal.
```

### V-38 · Why is Konark shaped like a chariot?
**SVG · save as `V-38_why-chariot.svg`**
```
Write one valid SVG educational diagram. Output only the SVG code.
viewBox="0 0 800 500", no width/height. Flat style: fill="currentColor" plus accent #C9A84C.
Ground line at y=440.

A schematic SIDE ELEVATION of the Konark Sun Temple imagined as a chariot:
- group id="platform": a long, tall platform from x=180 to x=720, y=330 to y=440, with a moulded top edge.
- group id="wheels": 6 large wheels spaced along the platform's side, each a circle about 70 across
  with a hub and 8 spokes (cut-outs with fill-rule evenodd), their bottoms touching the ground line.
- group id="horses": at the left (front/east) end, 3 overlapping simple horse silhouettes in a
  galloping pose, as if pulling the platform, facing left.
- the building on the platform: a hall whose roof is a stepped pyramid of stacked tiers rising to
  y≈90, and behind it on the right only a low ruined stump (the main tower is not standing) — part of
  group id="platform".
- group id="sun": a rising sun (half circle with short rays, fill="#C9A84C") low on the far left
  horizon, in front of the horses.
No <text>, people, deity figures, transforms, filters or external references. Round to 1 decimal.
```

### V-40 … V-45 · Builder's Mind — six construction steps
Generate **V-40 first**, approve it, then attach it to every later step so the camera and site match.
Tiny faceless figures are allowed in this series only.

**V-40 · The ground plan** — IMAGE · 16:9 · `V-40_step-1.png` · Attach V-00
```
Create a detailed painted illustration (digital gouache), matching the attached image's painting
style, colours and light, showing the FIRST step of building an Odisha temple, long ago.

Scene: a flat, levelled site of bare earth on open land with a few coconut palms at the edges. On the
ground, the square outline of the future temple's floor plan is marked out with taut cords stretched
between wooden pegs, including the stepped projections of the walls on each side. Beside the marked
plan, neat rows of stone blocks already cut to size wait on the ground, sorted by shape. A few
simple wooden tools and coils of cord lie nearby. Two or three tiny, faceless human figures in
simple period clothing stand far off, only for scale.

Camera: elevated three-quarter view from the south-east, as if from a low hill, the whole site in
view. Leave the centre-top of the frame open (the building will rise there in later steps).
Soft morning light from the left. No text, letters, numbers, watermarks, modern tools, machines or vehicles.
```

**V-41 · The platform rises** — IMAGE · 16:9 · `V-41_step-2.png` · Attach V-40
```
Keep EXACTLY the same site, camera position, framing, painting style and light as the attached image.
Change only this: on the marked plan, the temple's platform has now been built — several courses of
dark red-brown laterite stone blocks, fitted tightly without mortar, forming a low solid plinth with
a simple moulded edge. Some stone rows on the ground are used up. Wooden rollers lie beside a block
being moved. Tiny faceless figures for scale only. No text, watermarks, machines or modern objects.
```

**V-42 · The walls go up** — IMAGE · 16:9 · `V-42_step-3.png` · Attach V-41
```
Keep EXACTLY the same site, camera, framing, style and light as the attached image. Change only this:
on the platform, the square sanctum wall section now stands to full wall height, built of grey-brown
stone blocks fitted without mortar, its faces broken into projecting vertical bands and divided into
five stacked horizontal zones (base mouldings, lower wall, a band of mouldings, upper wall, top
cornice) — carving only roughly blocked out. Large stone blocks are being moved on wooden rollers
toward it. Tiny faceless figures for scale. No text, watermarks, machines or modern objects.
```

**V-43 · The tower curves upward** — IMAGE · 16:9 · `V-43_step-4.png` · Attach V-42
```
Keep EXACTLY the same site, camera, framing, style and light as the attached image. Change only this:
the tower is now half built above the walls, its courses of stone stepping gradually inward so the
sides begin to curve toward the top. A long, gently sloping earthen ramp leans against one side of
the tower, up which a large stone block is being hauled on rollers. Tiny faceless figures for scale.
No text, watermarks, scaffolding of steel, machines or modern objects.
```

**V-44 · The crown is placed** — IMAGE · 16:9 · `V-44_step-5.png` · Attach V-43
```
Keep EXACTLY the same site, camera, framing, style and light as the attached image. Change only this:
the tower is complete with its full sugar-loaf curve, and the earthen ramp is lower. At the summit, a
great flattened, ribbed circular stone disc is being lowered into place with ropes and a wooden
pulley frame. The dome cap and pot-shaped finial wait beside it. Tiny faceless figures for scale.
No text, watermarks, machines or modern objects.
```

**V-45 · The team** — IMAGE · 16:9 · `V-45_step-6.png` · Attach V-44
```
Keep EXACTLY the same site, camera, framing, style and light as the attached image. Change only this:
the ramp is gone and the temple stands complete, carvings finished, with a smaller stepped-roof hall
beginning in front. In the foreground, three small groups of simple, faceless figures in plain period
clothing: on the left, a patron standing with two attendants; in the centre, a master
architect holding an unrolled plan and gesturing toward the temple; on the right, masons with
chisels and mallets shaping a stone block. Keep the figures small and simple, no faces, no jewellery
or royal clichés, no deity images. No text, watermarks, machines or modern objects.
```

---

## 4. Map & scale helpers

### V-50 · Map marker
**SVG · save as `V-50_marker.svg`**
```
Write one valid SVG map pin. Output only the SVG code. viewBox="0 0 32 40", no width/height.
group id="pin": a classic teardrop map-pin shape, fill="currentColor", round head centred at (16,15)
with radius 13, tapering to a sharp point exactly at (16,40).
group id="glyph": inside the round head, a small white (fill="#FFFFFF") silhouette of an Odisha
temple tower — tiny base, sugar-loaf curved tower, flattened disc on top — about 14 tall, centred at (16,15).
No <text>, transforms, filters or external references. Round to 1 decimal.
```

### V-51 · Human figure for scale
**SVG · save as `V-51_human.svg`**
```
Write one valid SVG silhouette. Output only the SVG code. viewBox="0 0 60 170", no width/height
(1 unit = 1 cm). group id="figure": a neutral, friendly adult standing upright, front view, arms
relaxed at the sides, simple rounded shapes, fill="currentColor". Feet exactly on y=170, top of the
head exactly at y=0, centred at x=30. No face details, no clothing details, no <text>, no transforms.
```

### V-52 · Five-storey building for scale
**SVG · save as `V-52_building.svg`**
```
Write one valid SVG silhouette. Output only the SVG code. viewBox="0 0 120 1500", no width/height
(1 unit = 1 cm, so the building is 15 m tall). group id="building": a plain modern five-storey
apartment block, front view, fill="currentColor", base exactly on y=1500, flat roof exactly at y=0,
spanning x=0 to x=120. Cut out (fill-rule="evenodd") a regular grid of windows: 5 floors × 3 windows,
plus a door at the bottom centre. No <text>, transforms or external references.
```

---

## 5. Temple pages

Each temple has **four** visuals: a hero painting, a silhouette (for Compare and size scaling), a parts
diagram (each part becomes clickable on the site), and an isometric view (the plan's fallback where no
free Sketchfab 3D model exists).

**Reference photos to collect for every temple:** (A) full exterior three-quarter view from the east or
south-east; (B) straight side elevation; (C) the top of the tower/roof; (D) if available, a published
ground plan drawing (ASI or a book). Use A for the hero, B for the silhouette and parts diagram, A+D
for the isometric.

**Shared rules for all temple images:** present-day state; exterior only; no people, deities, idols,
interiors, festival crowds, vehicles, modern signs, wires or flags with writing; carvings read as
ornamental texture; no text of any kind.

### Parasuramesvara Temple, Bhubaneswar

**V-60 · Hero** — IMAGE · 16:9 · highest res · `V-60_parasuramesvara-hero.png` · Attach V-00 + photos A, C
```
Create a detailed painted architectural illustration (digital gouache) of the Parasuramesvara Temple
in Bhubaneswar, Odisha, exactly as it stands today, matching the painting style, colours and light of
the first attached image, and the building's proportions, outline and details from the attached
photographs.

This is a small, early temple (7th-century period): a modest curvilinear rekha tower rising over the
sanctum, and attached in front of it a low rectangular hall — the earliest Odishan temple to have
such a hall. Follow the photographs exactly for the hall's roof form, the number of storeys and
projections on the tower, the crowning elements, and the density of the carved ornament; do not add
anything not visible in the photos.

View: three-quarter view from the east/south-east at eye level, the whole temple in frame with some
space around it. Setting: clean stone paving and a little lawn as in the photos, clear pale morning
sky, soft light from the left, gentle shadows. Stone colour as in the photos.

No text, letters, numbers or watermarks. No people, animals, vehicles, signs, wires or flags with writing.
```

**V-61 · Silhouette** — SVG · `V-61_parasuramesvara-silhouette.svg` · Attach photo B
```
Write one valid SVG silhouette of the temple in the attached side-elevation photograph (the
Parasuramesvara Temple, Bhubaneswar). Output only the SVG code.
viewBox="0 0 1000 1000", no width/height. Trace the building's outer outline from the photo as a
single solid shape (fill="currentColor") in group id="structure": ground at y=1000, the highest point
of the temple exactly at y=0, keep the true proportions of the photo (do not stretch; centre it
horizontally and leave empty space at the sides if it is narrower). Simplify small carvings into a
clean outline but keep the tower's curve, the steps in the roofline and the crown shape faithful.
No <text>, transforms, filters or external references. Round to 1 decimal.
```

**V-62 · Parts diagram** — SVG · `V-62_parasuramesvara-parts.svg` · Attach photo B
```
Write one valid SVG line-drawing elevation of the temple in the attached photograph (the
Parasuramesvara Temple, Bhubaneswar). Output only the SVG code.
viewBox="0 0 1000 1000", no width/height, ground at y=980, proportions true to the photo.
Style: clean outlines stroke="currentColor" stroke-width="3" fill="#FBF7F0", plus a few simplified
moulding and rib lines at stroke-width="1.5".
Put each architectural part in its own group with exactly these ids, so each can be highlighted:
id="bada" (the sanctum's lower wall section), id="gandi" (the curved tower body), id="mastaka"
(everything above the tower: neck, ribbed disc, cap, finial), id="jagamohana" (the attached hall,
walls and roof), and id="pista" ONLY if a distinct platform is visible in the photo.
The groups must not overlap each other. No <text>, transforms, filters or external references.
```

**V-63 · Isometric view** — IMAGE · 1:1 · `V-63_parasuramesvara-isometric.png` · Attach V-00 + photos A, D
```
Create a clean ISOMETRIC architectural illustration (true isometric projection, 30° angles, no
perspective) of the Parasuramesvara Temple in Bhubaneswar, based strictly on the attached photograph
and ground plan. Show the whole temple as a neat model on a small square base of paving: the curved
rekha tower over the sanctum and the attached low rectangular hall in front, with the arrangement,
roof forms and proportions exactly as in the references. Soft, even light from the upper left, gentle
shadows, natural stone colours, painted-illustration finish matching the first attached image.
Plain warm cream background (#FBF7F0). No text, labels, arrows, people, trees or watermarks.
```

### Mukteshvara Temple, Bhubaneswar

**V-65 · Hero** — IMAGE · 16:9 · highest res · `V-65_mukteshvara-hero.png` · Attach V-00 + photos A (showing the arch), C
```
Create a detailed painted architectural illustration (digital gouache) of the Mukteshvara Temple in
Bhubaneswar, Odisha, exactly as it stands today, matching the painting style, colours and light of the
first attached image and the proportions and details of the attached photographs.

This is a small, exquisitely carved temple (10th-century period), often called a "miniature gem". It
must show its famous FREE-STANDING carved stone arched gateway (torana) in front of the temple, and
behind it the temple itself: a curvilinear rekha tower over the sanctum and an attached hall in front.
Follow the photographs exactly for the hall's roof, the arch's shape and decoration, the tower's
projections and crowning elements, and the surrounding enclosure; add nothing not visible in the photos.

View: three-quarter view from the east/south-east at eye level, with the arch clearly visible in the
foreground-left and the temple behind. Clean paving, a little lawn, clear morning sky, soft light from
the left. No text, letters, numbers, watermarks, people, animals, vehicles, signs, wires or flags with writing.
```

**V-66 · Silhouette** — SVG · `V-66_mukteshvara-silhouette.svg` · Attach photo B
*Use the V-61 prompt, replacing "the Parasuramesvara Temple, Bhubaneswar" with "the Mukteshvara Temple,
Bhubaneswar". Trace the temple only (leave the free-standing arch out of the silhouette).*

**V-67 · Parts diagram** — SVG · `V-67_mukteshvara-parts.svg` · Attach photo B (with the arch)
*Use the V-62 prompt, replacing the temple name with "the Mukteshvara Temple, Bhubaneswar", and add
to the list of groups:* `id="torana" (the free-standing arched gateway in front, drawn at its true position and size relative to the temple)`.

**V-68 · Isometric view** — IMAGE · 1:1 · `V-68_mukteshvara-isometric.png` · Attach V-00 + photos A, D
*Use the V-63 prompt with the name "the Mukteshvara Temple in Bhubaneswar" and describe:*
"the curved rekha tower over the sanctum, the attached hall in front, and the free-standing carved
arched gateway (torana) standing in front of the hall, all positioned exactly as in the references".

### Lingaraja Temple, Bhubaneswar

**V-70 · Hero** — IMAGE · 16:9 · highest res · `V-70_lingaraja-hero.png` · Attach V-00 + photos A, C
```
Create a detailed painted architectural illustration (digital gouache) of the Lingaraja Temple in
Bhubaneswar, Odisha, exactly as it stands today, seen from outside its compound wall (as from the
public viewing point), matching the painting style, colours and light of the first attached image and
the proportions and details of the attached photographs.

This is the mature Kalinga style at monumental scale (11th-century period). The great curvilinear
rekha tower over the sanctum, about 55 m tall, dominates everything. In front of it, in one straight
line, stand three lower halls: the assembly hall (jagamohana), the dance hall (natamandira) and the
hall of offerings (bhogamandapa), their stepped-tier roofs getting lower toward the front. Smaller
shrines and the enclosing compound wall as shown in the photographs. Follow the photos exactly for all
roof forms, the tower's profile and the crowning elements; add nothing not in the photos.

View: elevated three-quarter view, whole main temple in frame. Clear morning sky, soft light from the
left. No text, letters, numbers, watermarks, people, crowds, animals, vehicles, signs, wires or flags with writing.
```

**V-71 · Silhouette** — SVG · `V-71_lingaraja-silhouette.svg` · Attach photo B
*Use the V-61 prompt with "the Lingaraja Temple, Bhubaneswar"; trace the main temple with its three
halls in a row, not the compound wall or the smaller shrines.*

**V-72 · Parts diagram** — SVG · `V-72_lingaraja-parts.svg` · Attach photo B
*Use the V-62 prompt with "the Lingaraja Temple, Bhubaneswar" and these groups:* `pista` (only if
visible), `bada`, `gandi`, `mastaka`, `jagamohana`, `natamandira`, `bhogamandapa` — *the four structures
in a row, left to right as in the photo.*

**V-73 · Isometric view** — IMAGE · 1:1 · `V-73_lingaraja-isometric.png` · Attach V-00 + photos A, D
*Use the V-63 prompt with "the Lingaraja Temple in Bhubaneswar", describing:* "the tall curved rekha
tower and the three halls — jagamohana, natamandira, bhogamandapa — in one line in front of it, as in
the references; show the immediate courtyard paving only, not the whole compound".

### Jagannath Temple, Puri

**V-75 · Hero** — IMAGE · 16:9 · highest res · `V-75_jagannath-hero.png` · Attach V-00 + photos A, C (exterior only)
```
Create a detailed painted architectural illustration (digital gouache) of the Jagannath Temple in
Puri, Odisha, as it stands today, seen from OUTSIDE its enclosure wall, matching the painting style,
colours and light of the first attached image and the proportions and details of the attached
exterior photographs.

Show the architecture only: the very tall curvilinear rekha tower over the sanctum and the lower halls
in a row in front of it with stepped-tier roofs, rising above the outer enclosure wall. The emblem and
flag at the very top, the colour of the surfaces, the enclosure wall and gateways exactly as in the
photographs; add nothing not visible in them.

Respect: this is a living temple. Do not show deities, idols, the interior, rituals, festival crowds,
chariots or any people. View: three-quarter exterior view from the east, clear morning sky, soft light
from the left. No text, letters, numbers, watermarks, animals, vehicles, signs or wires.
```

**V-76 · Silhouette** — SVG · `V-76_jagannath-silhouette.svg` · Attach photo B
*Use the V-61 prompt with "the Jagannath Temple, Puri"; trace the main tower and halls, not the
enclosure wall.*

**V-77 · Parts diagram** — SVG · `V-77_jagannath-parts.svg` · Attach photo B
*Use the V-62 prompt with "the Jagannath Temple, Puri" and groups:* `bada`, `gandi`, `mastaka`,
`jagamohana`, `natamandira`, `bhogamandapa`.

**V-78 · Isometric view** — IMAGE · 1:1 · `V-78_jagannath-isometric.png` · Attach V-00 + photos A, D
*Use the V-63 prompt with "the Jagannath Temple in Puri", describing:* "the tall curved main tower and
the halls in a row in front of it, as in the references; exterior only, no enclosure crowds, no deities".

### Konark Sun Temple

**V-80 · Hero** — IMAGE · 16:9 · highest res · `V-80_konark-hero.png` · Attach V-00 + photos A, close-up of a wheel, the horses
```
Create a detailed painted architectural illustration (digital gouache) of the Konark Sun Temple in
Odisha EXACTLY AS IT STANDS TODAY, matching the painting style, colours and light of the first attached
image and the proportions and details of the attached photographs.

Show: the surviving great assembly hall (jagamohana), about 39 m tall — a massive square building whose
roof is a pyramid of stacked horizontal stone tiers in groups, with a crowning finial — standing on a
very tall platform carved to look like a colossal chariot. Along the side of the platform, a row of
huge, intricately carved stone wheels with spokes (the temple has 24 wheels in all). At the front
(east) end by the stairs, the weathered stone horse statues that pull the chariot, in the damaged
state shown in the photos. Behind the hall, where the main tower once stood, only its low ruined base
remains. Weathered dark grey-brown stone as in the photos.

The main tower must NOT be shown standing. No sand, scaffolding or repair works.
View: three-quarter view from the south-east, whole temple in frame, open lawns, clear sky, soft
morning light from the left (east). No text, letters, numbers, watermarks, people, animals, vehicles,
signs, wires or flags with writing.
```

**V-81 · Silhouette** — SVG · `V-81_konark-silhouette.svg` · Attach photo B
```
Write one valid SVG silhouette of the Konark Sun Temple as it stands today, traced from the attached
side-elevation photograph. Output only the SVG code. viewBox="0 0 1000 1000", no width/height.
group id="structure": the surviving hall and platform (with the wheels as round shapes along the
platform side and the ruined base of the collapsed tower) as a solid shape, fill="currentColor",
ground at y=1000, true proportions of the photo.
group id="ghost-vimana": a dashed outline only (fill="none" stroke="currentColor" stroke-width="3"
stroke-dasharray="12 10") of the ESTIMATED original tower rising from the ruined base: a curved
sugar-loaf rekha tower whose top reaches y=0, i.e. about 1.8 times the height of the surviving hall
(roughly 70 m versus 39 m — an estimate). Scale the surviving structure so the ghost tower's top is at
y=0. No <text>, transforms, filters or external references. Round to 1 decimal.
```

**V-82 · Parts diagram** — SVG · `V-82_konark-parts.svg` · Attach photo B
```
Write one valid SVG line-drawing elevation of the Konark Sun Temple as it stands today, from the
attached side-elevation photograph. Output only the SVG code. viewBox="0 0 1000 1000", no
width/height, ground at y=980, proportions true to the photo. Clean outlines stroke="currentColor"
stroke-width="3" fill="#FBF7F0", simplified details at stroke-width="1.5".
Groups with exactly these ids, not overlapping: id="pista" (the chariot-shaped platform, excluding the
wheels), id="wheel" (ONE representative wheel on the platform side, drawn in more detail — the other
wheels belong to "pista"), id="jagamohana" (the surviving hall with its stepped-tier roof),
id="vimana-base" (the low ruined base of the collapsed main tower), id="horses" (the horse statues
at the front). No <text>, transforms, filters or external references.
```

**V-84 · Isometric view** — IMAGE · 1:1 · `V-84_konark-isometric.png` · Attach V-00 + photos A, D
*Use the V-63 prompt with "the Konark Sun Temple as it stands today", describing:* "the chariot-shaped
platform with its carved wheels along both long sides, the horse statues at the east end, the surviving
stepped-pyramid hall, and only the ruined base where the main tower stood — the main tower must not be
shown standing".

### V-83 · Konark artist's reconstruction (ON HOLD — wait for the fact-checker's ruling on height)
**IMAGE · 16:9 · `V-83_konark-reconstruction.png` · Attach V-80**
```
Using the attached illustration as the base (same style, camera, light and setting), create an
ARTIST'S RECONSTRUCTION of the Konark Sun Temple as it may have looked when complete: keep the
chariot platform, wheels, horses and assembly hall exactly as they are, and add behind the hall the
original main sanctum tower — a curvilinear rekha tower rising about 1.8 times the height of the hall
(scholars estimate roughly 70 m), with vertical ribs, storey bands and a large flattened ribbed disc
and finial on top, in the same stone. Everything complete and undamaged. No text, people, animals or watermarks.
```
The site will caption it "Artist's reconstruction — the original height is estimated".
