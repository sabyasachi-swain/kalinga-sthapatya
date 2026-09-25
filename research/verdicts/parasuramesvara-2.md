# Parasuramesvara-2: fact-check summary (2026-09-25)

**Counts:** 35 claims. 2 approved, 29 revised, 4 rejected, 0 needs-human.

**Staged:**
- `research/staged/parasuramesvara-2.json`: the complete `parasuramesvara` object. Validator: PASS, 0 errors, 0 warnings.
- `research/staged/parasuramesvara-2-elements.json`: `bada` and `pabhaga`, with `what` filled and `temple_ids: ["parasuramesvara"]`. Validator: PASS, 0 errors, 0 warnings.

## Source availability

- **The IGNCA form could not be fetched.** `ignca.gov.in/asi_reports/Orkhurda145.pdf` refused the connection three times (ECONNREFUSED). Every IGNCA quote is therefore marked `not-fetchable`, and none was used. IGNCA is **not** in any fragment's `sources[]`.
- **Every archive.org quote the claims rely on was found.** This covers Panigrahi 1961, Brown 1959, Bose 1932, Ganguly 1912 and Mitra 2003.
- **The outside lead in `anatomy-terms.md` is wrong.** It says the Bose sub-part definitions do not exist, but they are in Bose:
  - leaf 133: foot, shin and the crowning mouldings
  - leaf 143: early temples have a three-part wall
  - leaf 163: the five moulding names
  - leaf 287: jangha = "shin"
  - leaf 290: the pabhaga glossary entry

## Rejected

- **028 (sandstone and laterite):** the only source is IGNCA, which could not be fetched.
- **033 (height of 12.8 m):** rests on IGNCA only. The existing Brown figure of 44 ft (13.4 m) is unchanged.
- **034 (size of the compound):** the only source is IGNCA.
- **035 (living temple, linga in a yonipitha):** rests on IGNCA only. Panigrahi's sentence gives the god's name in the 11th century, not what is worshipped today.

## Key rulings

- **001 and 002 (earth ramps; tower built before the hall):** these are Panigrahi's *general* account of how Bhubaneswar's temples were built.
  - The text now says "Most temples in Bhubaneswar seem to have been built this way" and "in Bhubaneswar the tower usually came first".
  - The notes say Panigrahi does not name this temple, and that the ramp he identifies on the ground belongs to the Lingaraja.
  - He writes of earth, not sand.
- **009 (three mouldings in the base):** published as a count only.
  - Ganguly 1912 (leaves 158 and 359) is added as a second source to the existing `parts.intro[0]` claim.
  - A note explains that the names are disputed.
- **013 (plan type):** `facts.temple_type` is now "triratha (three-strip plan)". Ganguly calls this temple's vimana triratha twice (leaves 149 and 359).
  - "Rekha" and the "pancharatha hint" both came from IGNCA only, so they were dropped.
  - No source seen calls any part of this temple pancharatha.
- **007 (a simpler wall):** the text says the wall is simpler than the usual five-part wall and gives no number of parts. Ganguly counts 2 and Bose's scheme would give 3.
  - `bada` is added to `parts.element_ids`.
- **027 (orientation):** the temple facing west could not go in `facts.orientation`, which is not a schema key. It is carried in special claim 019 instead: "The front of the hall faces west" (Ganguly leaf 356).

## Claims with no schema slot

| Claim | Field in the ledger | What was done |
|---|---|---|
| 006 | `glossary.trianga-bada.short` | The fact is folded into `elements.bada.what`. "tri-anga" appears in the note only. |
| 010 | `elements.jangha.what` | Approved but not staged. |
| 011 | `elements.mastaka.parts` | Tier lowered to scholarly. Not staged. Bose leaf 107 is cited in construction claim 031. |
| 012 | `elements.raha.kanika` | Tier lowered to scholarly. Used only as a supporting source for `facts.temple_type`. |
| 027 | `facts.orientation` | Carried in special claim 019, as above. |

## Effects on the annotated-image briefs (V-64A–F)

- **V-64B:** the height label "about 13 m (44 ft)" is unchanged.
- **V-64A and V-64D:** the label "Base (pabhaga) — three shaped bands" is unchanged and now has two sources.
- **The crown (V-64A #3, V-64D #4):** Ganguly says the throat, the ribbed disc (amla) and the cap were rebuilt around 1898–1903, and a new water-pot top (kalasa) was added.
  - The label can stay.
  - Images may show a kalasa, because one exists after the repairs.
  - Lion figures on the temple were added during the repairs. Do not present them as original.
- **The raised hall roof (V-64A #4, V-64D #5):** Ganguly says its small clerestory windows were blocked up after the restoration. Do not show open, light-filled clerestory windows.
  - The "Stone windows" callout is a different feature: Brown's perforated windows. It is unaffected.
- **V-64C (construction diagram):** the two panels (dry masonry, corbel arch) are unaffected.
  - If a ramp panel is added, it must be labelled as the general Bhubaneswar method ("Most Bhubaneswar temples seem to have been built this way") with earth ramps, not sand.
  - It must not suggest there is evidence of a ramp at this temple.

## Orchestrator review (2026-09-25)

- Structure checked by matching every existing claim by text: all 16 existing parasuramesvara claims are present; 11 unchanged in place, 4 reordered, parts.intro[0] gained the Ganguly source and a naming note. No field dropped. 20 new claims.
- special[16]: "Experts think the temple was first named after Parashara" → "It may first have been named after Parashara". The naming rests on Panigrahi's "reasons to believe" (after Ghosh's reading), a single view; the claim is tier uncertain.
- facts.temple_type "triratha (three-strip plan)" accepted: it follows the plan-type usage of three other temples. The field is inconsistent across temples (Konark stores a building type) - pre-existing, to be resolved with the anatomy research.
