# Parasuramesvara — annotated images for Gemini / DALL·E (2026-09-19, finalised 2026-09-25)

**Status: READY TO GENERATE.** Labels re-verified by the orchestrator on 2026-09-26: every body text is a contiguous phrase from claim `text`/`value`; headings are verbatim phrases too, except the numbering prefixes and the scale device "You are here!". The `parasuramesvara-2` fact-check is merged (commit `a7813cf`):
`data/temples.json` → `parasuramesvara` gained 20 verified claims, and `data/elements.json` →
`bada` and `pabhaga` now have verified `what` definitions. Every label below was checked letter
by letter against that merged data on **2026-09-25** (see `research/verdicts/parasuramesvara-2.md`
for the fact-checker's reasoning). Labels that did not match word-for-word were rewritten from the
data; the list of changes is in the "What changed on 2026-09-25" section at the end.

**Human decision (2026-09-19):** for this temple, images carry detailed annotations (overrides the
"no text in images" rule for these briefs only). Every label below is taken **word for word** from
the fact-checked text in `data/temples.json` (`parasuramesvara`) or `data/elements.json` (`bada`,
`pabhaga`) → do **not** add, change or "improve" any label. Short labels are an exact phrase lifted
from a claim's `text` (trimmed at the start/end only — never re-worded, never a word inserted).

Anything not listed here must NOT be labelled. Banned terms — none of these appear in verified
`text`/`value` fields for this temple, only in researcher notes, so they must never be rendered as
a label: **amalaka, amla, bhumi, adhisthana, beki, khapuri, kalasa/kalasha, gandi, dhwaja,
garbhagriha, vimana, jangha, baranda, kanika, raha, ratha, pancharatha, tri-anga, pancha-anga,
dikpala, Saptamatrika, Pasupata, Shailodbhava, Parashara/Parasara, Nagari, Aihole, Gupta, Ganesha,
Kartikeya, Virabhadra, Lakulisa, Seven Mothers, Ketu** (any date, king name, or meaning not spelled
out below). The last several are real, verified facts about this temple (see "Facts we did not use"
below) — they are banned only from these six *images*, because there is no callout slot for them
without exceeding the 6-callout limit or matching the camera angle. They may be used in later briefs.

Delivery: drop files in `supporting-artifacts/parsurameswar-temple/` named `V-64A.png` … `V-64F.png`.
We check every label letter by letter before publishing.

---

## Shared style block (paste at the start of EVERY prompt)

```
Style: warm, premium educational illustration for a children's museum book. Realistic sandstone
(warm ochre-brown laterite/sandstone), soft morning light, pale sky, clean light-stone ground,
no people, no vehicles, no modern objects. Landscape 4:3, at least 1600×1200 px.
Annotation style: numbered callouts. Each callout = a small round number badge (1, 2, 3…) on the
building, a thin dark-brown leader line, and a cream label card with a dark-brown heading in a
clean serif font and one short line of body text in a simple sans-serif font. Big, readable text:
headings at least 4% of image height. Maximum 6 callouts. Labels sit in the empty sky/ground
areas, never covering the carving they point to. Render the label text EXACTLY as written in
quotes below — same spelling, same capitals, nothing extra. No title, no footer, no logo,
no watermark, no other text anywhere.
Temple: the Parasuramesvara Temple, Bhubaneswar, Odisha — a SMALL early temple with just two
parts: (1) a holy room with a short, sturdy, heavy-shouldered curved tower, topped by a very wide
ribbed round crowning stone, with a small rounded water-pot shape above that (this pot-shaped top
was added when the temple was repaired long ago, but it is there today — include it); (2) in front
of it, a rectangular porch hall whose middle roof is raised higher than the rest, with stone
windows carved with holes (stone lattice). Every surface richly carved.
Do NOT add lion figures anywhere on the temple. (Some lions on the real temple were added during a
later repair and are not part of the original design — simplest and safest is to leave them out.)
Do NOT show the small windows in the raised middle roof as open or glowing with light — they were
blocked up after a repair. Either omit them or show them as plain closed stone at this scale.
```

---

## V-64A — "Meet the temple" (the whole temple, assembled) · journey stop 1

Camera: three-quarter view from the front-left, the porch hall nearest, tower behind it.
Callouts (exactly these):
1. "Holy room (deul)" — "With its tower."  → point at the tower's lower body
2. "Porch hall (jagamohana)" — "A hall with pillars." → porch hall
3. "Crowning stone" — "A very wide crowning stone with ribs around it." → the round ribbed top
4. "Middle roof" — "Raised higher than the rest." → raised centre of hall roof
5. "Stone windows" — "Carved with holes." → a lattice window
6. "Base (pabhaga)" — "Three shaped bands of stone." → the bottom mouldings of the wall

Must show: the wide ribbed crowning stone with a small water-pot shape above it (see style block).
Must NOT show: lion figures; open/lit windows in the raised roof.
Sources: `temples.json → parasuramesvara.sections.parts.intro[0]` (holy room, porch hall, base);
`…special` (sanctuary/tower, crowning stone, raised roof, stone windows) — see full text in
"What changed" below.

## V-64B — "How big is it?" (side view with measurements) · journey stop 1

Camera: straight side elevation (no perspective), tower on the right, porch hall on the left,
a simple dimension line under the whole temple and a vertical dimension line beside the tower.
A small adult figure (silhouette, 1.7 m) standing next to the hall for scale.
Callouts (exactly these):
1. vertical line beside tower: "Tower: about 13 m (44 ft) tall"
2. horizontal line under the temple: "Tower and hall together: about 15 m (48 ft) long"
3. next to the person: "You are here!" (a scale device, not a fact about the temple — not sourced
   to the data, kept only so the reader understands the silhouette is for scale)
4. "Holy room (deul)" → tower
5. "Porch hall (jagamohana)" → hall
6. next to the hall's low wall: "Its walls are only about 2 m (7 ft) high"

Sources: `temples.json → parasuramesvara.facts.height` (callouts 1, 2); `…special` porch-hall-size
claim, "Its walls are only about 2 m (7 ft) high" (callout 6, new — this detail was verified in the
2026-09-25 fact-check and had no image slot before).

## V-64C — "How did they build it?" (construction diagram) · journey stop 2

Two panels side by side, same stone style, cut-away/diagram look (like a museum diagram).
Left panel: a corner of the temple wall shown as big stone blocks stacked with NO cement,
one block lifted slightly to show its shaped, interlocking edge.
Callouts:
1. "Big, heavy stones" — "No cement at all."
2. "Weight and careful balance" — "Each stone stays in place by its own weight."
3. "Edges that lock into each other" — "Help hold them together."
Right panel: a doorway seen from the front; above the flat stone beam over the door, stones are
stepped inwards from both sides to form a hollow arch with an empty space inside.
Arrows show weight flowing around the empty space, down the sides.
Callouts:
4. "Stepped stones" — "Inwards to make a hollow arch."
5. "Empty space" — "Kept heavy weight off the stone beams."
6. "Stone beams" — "Above the door."

No ramp panel: a third, earth-ramp panel was considered (see verdict) but is left out of this image
— it would need its own callouts and push the image past the 6-callout limit. If the human wants
it, it should be a separate brief (e.g. V-64G), and its label must say this is the general
Bhubaneswar method, not evidence found at this temple: "Most Bhubaneswar temples seem to have been
built this way", earth (not sand). Do not add a ramp to V-64C itself.

Sources: `temples.json → parasuramesvara.sections.construction[0]` (dry masonry, weight, locking
edges) and `construction[1]` (stepped stones, empty space, stone beams above the door).

## V-64D — "The parts, from bottom to top" (exploded view) · journey stop 3

Same temple as V-64A, same camera. Pull the temple apart vertically into floating layers with
thin dotted guide lines, bottom to top: base → wall → tower body → crowning stone; the porch
hall split into base → walls → raised roof. ONE crowning stone only (do not repeat it).
Do not invent inner beams or hidden structures.
Callouts (exactly these):
1. "1 · Base (pabhaga)" — "Three shaped bands of stone."
2. "2 · Wall (bada)" — "The upright wall of a temple, below the tower."
3. "3 · Tower" — "Short and sturdy, with heavy shoulders."
4. "4 · Crowning stone" — "A very wide crowning stone with ribs around it."
5. "Middle roof" — "Raised higher than the rest."
6. "Stone windows" — "Carved with holes."

Must show: the crowning stone with its small water-pot top (present-day state, see style block).
Must NOT show: lion figures anywhere in the exploded layers; open/lit small windows in the raised
porch-hall roof layer (they are blocked up today — leave this layer as plain carved stone).
Sources: `elements.json → bada.what`, `elements.json → pabhaga.what`; `temples.json →
parasuramesvara.sections.parts.intro[0]`, `…special` (tower shape, crowning stone, raised roof),
`…influences` (wall pillars — see note below, not used as a label here but available).

## V-64E — "Look closer: the planet gods" (close-up) · tour, holy-room doorway

Camera: close-up, straight on, of the carved stone slab above the doorway of the holy room:
a row of EIGHT small seated planet-god figures, each with a short carved inscription beside it
(render the inscriptions as illegible carved marks, NOT readable letters).
Callouts:
1. "Planet gods" — "Each with its name cut into the stone beside it."
2. "One is missing!" — "Ketu, the ninth planet god, is left out." → point at the empty end of the row

Sources: `temples.json → parasuramesvara.sections.special` (planet-gods claim, includes the Ketu
sentence word for word).

## V-64F — "Look closer: the porch hall" (close-up) · tour, porch hall

Camera: close-up of the porch hall's WEST side: the west doorway in the centre, flanked by its two
carved stone window screens, with the box-shaped hall's pillared interior glimpsed through the open
door (six pillars visible in two rows of three). Above, a long carved band with a parade of horses
and elephants marching in a row. Lower down, carved panels with small figures (story scenes — no
specific identifiable gods).
Callouts:
1. "Pillars" — "Six pillars stand in two rows of three." → the pillars seen through the doorway
2. "Stone window screens" — "Carvings of young dancers and musicians form their holes." → one screen
3. "West door" — "The front of the hall faces west." → the central doorway
4. "A parade" — "Rows of horses and elephants march along." → the upper band
5. "Other panels" — "Tell stories of the gods." → the lower panels

Must show: TWO stone window screens, one on each side of the west door (not one, not on a different
wall); the pillars are plain square shafts (no bases), not carved/decorated columns.
Must NOT show: any readable letters/figures identifiable as specific named gods in the story panels.
Sources: `temples.json → parasuramesvara.sections.special` (pillars-and-hall-size claim, the two
stone window screens claim, the west/south doors claim, the animal-parade-and-panels claim — all
word for word above).

---

## Video (optional)

Keep the current 10 s video. If you re-export: silent, 1280×720, ≤ 3 MB, and no text.

## Facts we did not use in these six images (available for later briefs)

These are verified, word-for-word available in `data/temples.json → parasuramesvara`, but have no
callout slot here without exceeding 6 callouts per image or without a matching camera angle. Listed
so the human/orchestrator can plan a follow-up brief instead of losing track of them:
- The wall's three-strip plan: "Its wall steps out in three upright strips. The middle strip juts
  forward, between two corner strips." (`facts.temple_type`) — needs a plan/top-down or side-on shot.
- Flat pillars on the wall "topped with a carved pot and leaves" (`sections.influences`).
- The Seven Mothers row on the hall's north wall; the eight guardians of the directions in a row of
  panels on the hall; Lakulisa with his four pupils on the temple's front (`sections.special`).
- No raised platform — the floor is level with the ground (`sections.special`).
- The big central niches with Ganesha and Kartikeya, the only two original images still in place
  (`sections.special`).
- The untidy join where the hall covers some of the tower's carving (`sections.special`).

## What changed on 2026-09-25 (letter-by-letter re-check against the merged data)

Every existing label was compared word for word with `data/temples.json` (`parasuramesvara`) and
`data/elements.json` (`bada`, `pabhaga`). Labels that did not match were rewritten using only words
already present in the cited `text`. No label below adds a term, date, king or meaning the data does
not contain.

**Unchanged (already word for word):** "Holy room (deul)" / "With its tower.";
"Base (pabhaga)" / "Three shaped bands of stone."; "Tower" / "Short and sturdy, with heavy
shoulders."; "Tower: about 13 m (44 ft) tall"; "Tower and hall together: about 15 m (48 ft) long";
V-64E's "Ketu, the ninth planet god, is left out." body.

**Fixed (word(s) not in the source text, now corrected):**
- V-64A #2 / V-64D wording: "A hall with pillars, in front of the holy room." → **"A hall with
  pillars."** ("in front of the holy room" reordered the sentence; the plain contiguous phrase is
  safer.)
- V-64A #3, V-64D #4 "Crowning stone": "Very wide, with ribs **all** around." → **"Very wide, with
  ribs around it."** ("all" was not in the source: "a very wide crowning stone with ribs around it".)
- V-64A #4 "Middle roof": "**Higher than the rest of the roof.**" → **"Raised higher than the
  rest."** (source: "Its middle roof is raised higher than the rest." — "of the roof" was invented.)
- V-64A #5, V-64D #6 "Stone windows": "Carved with holes **to let daylight in**." → **"Carved with
  holes."** (source says "let the daylight in", not "to let daylight in"; trimmed to the safe
  contiguous phrase.)
- V-64C #1: "No cement!" / "Big, heavy stones **stacked dry**." → **"Big, heavy stones" / "No cement
  at all."** ("stacked dry" was invented; the source never uses either word.)
- V-64C #2: "Each stone **is held** in place by its own weight." → **"Each stone stays in place by
  its own weight."** (source says "stays", not "is held".)
- V-64C #3: "**Shaped edges fit into each other.**" → **"Lock into each other."** ("shaped" and "fit"
  were invented; source says "Edges that lock into each other".)
- V-64C #4: "**Each row sticks out a little more than the one below.**" → **"Inwards, to make a
  hollow arch."** (the old body was a wholly invented description of corbelling; the source only
  says stones were "stepped ... inwards to make a hollow arch".)
- V-64C #5: "**Hollow space**" / "Keeps heavy weight off **the beam**." → **"Empty space" / "Kept
  heavy weight off the stone beams."** (source says "the empty space", not "hollow space"; says
  "the stone beams", not "the beam"; and "kept", not "keeps".)
- V-64C #6: "Stone beam" / "The **flat** stone **over** the door." → **"Stone beams" / "Above the
  door."** ("flat" was invented; source says "above the door", not "over the door"; source is
  plural, "the stone beams".)
- V-64D #2: "Wall" / "Flat pillars topped with a carved pot and leaves." → **"Wall (bada)" / "The
  upright wall of a temple, below the tower."** — upgraded to the newly verified `bada.what`
  definition, as instructed. (The old body was accurate to `sections.influences` but is now better
  sourced by the element definition; the pillar/pot/leaf detail is listed under "Facts we did not
  use" above in case a later brief wants it instead.)
- V-64D #5: "Porch hall roof" / "**The middle part is raised higher.**" → **"Raised higher than the
  rest."** (same fix as V-64A #4: "of the roof"/"part" wording was invented.)
- V-64E #1: "Each one **has** its name **carved** beside it." → **"Each with its name cut into the
  stone beside it."** (source says "cut into the stone", not "carved"; says "each with", not "each
  one has".)
- V-64E #2 heading: "**Someone** is missing!" → **"One is missing!"** (source: "But one is missing!"
  — "Someone" was not the word used.)
- V-64F: reworked. "Stone window" (the generic lattice-window callout, shared with V-64A/D) is
  dropped from this close-up in favour of the newly verified, more specific **"Stone window
  screens"** callout (source: "two stone window screens", "Carvings of young dancers and musicians
  form their holes."). Added **"Pillars"** ("Six pillars stand in two rows of three.") and **"West
  door"** ("The front of the hall faces west.") — both newly verified 2026-09-25 and previously had
  no image. "Other panels": "**Carvings that tell** stories of the gods." → **"Tell stories of the
  gods."** ("Carvings that tell" was invented; source: "other panels tell stories of the gods.")
  "A parade" is unchanged (already word for word).

**Verdict rulings applied (visual instructions, not label text):**
- Crown: the throat, ribbed disc and cap were rebuilt around 1898–1903 and a water-pot top was
  added; images may show the pot (added to the shared style block). Lion figures were added in the
  same repairs — the shared style block now says not to draw them at all, so no image risks showing
  them as original carving.
- Raised hall roof: its small clerestory windows were blocked up after the repairs — the shared
  style block and V-64A/V-64D now say not to show them open or glowing. The separate "Stone windows"
  / "Stone window screens" callouts are Brown's perforated windows, a different feature, unaffected.
- Construction: no ramp panel added to V-64C (see that section); if one is added later it must use
  the general-Bhubaneswar wording and earth, never claim evidence at this specific temple.

## Interim images already published — baked labels that do NOT match this brief

`V-64A`, `V-64B` and `V-64C` in `data/media.json` are marked `interim: true` with a review note that
their baked-in labels are not sourced. Having now checked the actual files
(`img/temples/v-64a-parasuramesvara-assembled.jpg`, `v-64b-parasuramesvara-separated.jpg`,
`v-64c-parasuramesvara-exploded.jpg`), every baked label uses wording and terms that are **not** in
the verified data and are on the banned-term list above. None of these match the finalised brief:

- **"JAGAMOHANA" — "Assembly hall in front of the sanctum with a pidha roof and ornate carvings."**
  ("sanctum", "pidha roof" — not this temple's verified text; correct label is "Porch hall
  (jagamohana)" / "A hall with pillars.")
- **"VIMANA (DEULA)" — "Main sanctum (garbhagriha) with rekha deul spire, richly carved with
  architectural motifs."** ("vimana", "garbhagriha", "rekha deul" — all banned terms, none verified
  for this temple; correct label is "Holy room (deul)" / "With its tower.")
- A red flag (dhwaja) on top of the tower — not a verified fact for this temple, and not in any
  brief.
- Footer text "Parsurameswara Temple | Bhubaneswar, Odisha" — briefs require NO text/footer/logo.
- V-64C only, additional baked labels, all unverified/banned: **"Pidha Roof"**, **"Ceiling Beams"**,
  **"Wall Panels"**, **"Adhisthana (Base Platform)"**, **"Dhwaja (Flag)"**, **"Kalasha"**,
  **"Amalaka"**, **"Beki"**, **"Gandi"**, **"Bhumi"**, **"Pabhaga"** (this last one is a real,
  verified term, but its body "Moulded base platform" is not word for word from the data — the
  verified label is "Base (pabhaga)" / "Three shaped bands of stone.").

**Recommendation to the orchestrator:** pull V-64A, V-64B and V-64C to placeholders until they are
regenerated from this finalised brief. None of the three interim files' baked labels survive the
letter-by-letter check, and several use terms this project has explicitly not verified for this
temple (vimana, garbhagriha, rekha deul, adhisthana, amalaka, beki, gandi, bhumi, kalasha, dhwaja).

## Acceptance (what we check when files arrive)

- Every label spelled exactly as above; nothing extra (no title, footer, watermark, flag names).
- Two-part temple; short heavy tower; ONE wide ribbed crowning stone with a small water-pot top;
  raised middle hall roof (small windows blocked/absent, not open or glowing); lattice windows.
- No lion figures anywhere.
- V-64B: dimension numbers exactly "about 13 m (44 ft)", "about 15 m (48 ft)" and "about 2 m (7 ft)".
- V-64D: the wall layer is labelled "Wall (bada)", not just "Wall".
- V-64F: exactly two stone window screens flanking one central (west) door; six plain square pillars
  in two rows of three visible through it; no readable god identities in the lower story panels.
- Labels readable when the image is shown 375 px wide (if not, we add tap-to-enlarge).
