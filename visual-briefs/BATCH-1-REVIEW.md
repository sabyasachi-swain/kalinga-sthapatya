# Batch 1 review — 31 Gemini assets (2026-09-19)

Checked by the asset integrator against each brief; the two most serious findings (V-33 text/trident,
V-43–45 domes) were confirmed by the orchestrator by viewing the images. Nothing has been moved or
published. Your decisions go in the last column; then tell Claude "finalise batch 1".

## Summary

| Group | Assets | What's needed |
|---|---|---|
| ✅ Ready to approve | V-01, V-10, V-13, V-14, V-15, V-20, V-21, V-23, V-34, V-36, V-38, V-50 | Just your OK |
| ✅ Approve with a small note | V-03 (soft sun glow on the "empty" side — fine), V-22 (roof tiers look spiky), V-24 (horses very abstract) | Your OK, or regenerate if the note bothers you |
| 🟡 Good content, **low resolution** | V-00, V-11, V-30, V-31, V-40, V-41 | Decision R below |
| 🔴 Regenerate | V-32, V-33, V-35, V-37, V-42, V-43, V-44, V-45, V-51, V-52 | Fix prompts below |

## Decision R — resolution

Every raster came out at Gemini's standard size (1376×768 for 16:9, 1200×896 for 4:3, 896×1200 portrait).
The briefs asked for ≥2048 px (≥2400 for the hero, ≥2000×2500 for the exploded view).

- **Option 1 (recommended):** accept these sizes for cards, step images and diagrams (they display at
  ≤900 px wide on the site — sharp enough), but re-export the **hero V-11** and the **exploded view V-33**
  at 2K if your Gemini offers it (the "Pro"/"thinking" image model in the Gemini app, or Google AI Studio's
  resolution setting). The hero is full-width and V-33 is zoomed for hotspots, so those two benefit.
- **Option 2:** accept everything as delivered for the MVP; revisit later.
- **Option 3:** re-export everything at 2K+ (most work, sharpest result).

## Fix prompts (paste into Gemini)

**V-33 · Exploded view — MUST regenerate** (text in image, trident, crown pieces fused, wall zones unclear).
Start a **new chat**, paste the full V-33 prompt from GEMINI_PROMPTS.md, then add:
```
Critical corrections — follow exactly:
1. The image must contain NO words at all. Do not write "CROWN", "TOWER", "WALL SECTION", "PLATFORM"
   or any other label, letter or number anywhere. Leave the white background completely empty.
2. The crown pieces must ALL be separate and floating with clear white gaps between each one, bottom
   to top: a short round neck; the large flattened ribbed disc; the dome-shaped cap; the pot finial;
   the staff with the flag. No two crown pieces may touch.
3. The wall section must clearly show FIVE stacked horizontal zones from bottom to top: a band of
   layered base mouldings; a tall lower wall zone with niches; a narrow band of mouldings; an upper
   wall zone; a projecting top cornice.
4. On the staff, use a small plain flat metal plate shape — NOT a trident, NOT any weapon.
5. Portrait 4:5, highest resolution available.
```

**V-43, V-44, V-45 · Builder steps — MUST regenerate** (tower drawn as a round dome with corner cupolas —
Buddhist-stupa/Mughal look, not Kalinga). In the chat where you made V-42, attach **V-42** and **V-00**:
```
Keep EXACTLY the same site, camera, framing, style and light as the first attached image.
Important: the tower must have the same shape as the tower in the second attached image — a tall
Kalinga rekha tower, about two and a half times as tall as it is wide, with nearly vertical sides at
the bottom that curve steadily inward toward the top like a sugar-loaf, with vertical ribbed
projections. It is NOT a dome, NOT hemispherical, and there are NO small domed cupolas at the corners.
```
Then add the step-specific line:
- V-43: `The tower is half built: only its lower part stands, its courses stepping gradually inward. A long earthen ramp leans against one side; a stone block is hauled up it on wooden log rollers. No wheeled carts anywhere.`
- V-44: `The tower is complete to its full curved height; at its summit the great flattened ribbed stone disc is being lowered into place with ropes and a wooden pulley frame. No wheeled carts anywhere.`
- V-45: `The ramp is gone and the finished temple stands complete with its curved tower. In the foreground: a patron with two attendants, a master architect holding an unrolled plan, and masons shaping a stone block — small faceless figures.`

**V-42 · Walls go up** — minor: a wheeled cart instead of rollers. Reply in its chat:
```
Keep everything identical, but replace the wheeled cart with a large stone block resting on several
round wooden logs used as rollers, pushed by the small figures. No wheels anywhere in the image.
```

**V-32 · Khakhara card** — camera angle differs from V-30/V-31. New chat, attach **V-30**, paste the V-32
prompt, then add: `Match the attached image's camera height, three-quarter angle, distance, platform size and shadow direction exactly. Carvings should read as fine ornamental texture.`

**V-35 · Why is the sanctum dark? (SVG)** — reply in its chat:
```
Rebuild the SVG: the walls must be one solid shape with a single fully enclosed dark rectangular
inner chamber, connected to the outside only by one small doorway at floor level on the left — no
other gaps or notches anywhere in the silhouette. Use only two colours: currentColor and #C9A84C
(the dark chamber may use currentColor at full opacity). Keep group ids walls, sanctum, light.
```

**V-37 · Stones without mortar (SVG)** — reply in its chat:
```
Return the same SVG, but put the stepped-in courses on the right side into their own group
<g id="corbel">…</g>. Keep blocks, cramp and dowel groups as they are.
```

**V-51 · Human figure (SVG)** — reply: `Scale the figure vertically so the top of the head is exactly at y=0 and the feet exactly at y=170. Keep everything else.`

**V-52 · Building (SVG)** — reply: `Merge the building outline and all windows and the door into ONE <path> with fill-rule="evenodd" so the windows are real holes. Keep roof at y=0 and base at y=1500.`

## Also check yourself
- Zoom into the **four corners** of V-11, V-33 and V-40–V-45 for any small Gemini watermark (the reviewer
  couldn't pixel-inspect).
- V-30/V-31/V-32 show small carved figures in niches — that's normal temple ornament and not explicit;
  the reviewer flagged it only because the brief said "texture". Recommended: accept.

## Your decisions

| Item | Decision |
|---|---|
| Approve the 12 ready assets | |
| Approve V-03, V-22, V-24 as they are | |
| Resolution: option 1 / 2 / 3 | |
| Conversion: install Pillow for WebP (smaller files) / keep JPEG | |
