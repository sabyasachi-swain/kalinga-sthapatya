# Anatomy terms: fact-check summary (2026-09-26)

**Counts:** 68 claims. 37 approved, 31 revised, 0 rejected, 0 needs-human.

## Staged fragments

| File | What it holds | Validator |
|---|---|---|
| `research/staged/anatomy-terms-glossary.json` | 46 glossary terms, registered sources only | PASS, 0 errors, 0 warnings |
| `research/staged/anatomy-terms-elements.json` | 10 complete elements (all but `pabhaga`) | PASS, 0 errors, 0 warnings |
| `research/staged/anatomy-terms-glossary-mitra1960.json` | Optional. A fuller `khakhara-deula` plus the `mitra-d-1960` source | PASS, 0 errors, 0 warnings |

- **The optional fragment needs the human's approval first.** Merge it only after the human approves registering `mitra-d-1960`.
- **Merge order matters.** The optional fragment replaces `khakhara-deula` by id, so it must go after the main glossary fragment.

## Behera 2005 glossary pairings

- **How they were checked:** the search-inside API gives each hit's position on the page. A headword and its definition printed on the same line share the same top coordinate.
- **Confirmed:** 20 pairings.
- **Dropped:** 3.
  - **Bandhana:** the headword could not be found. The claim is kept on Bose, Behera's main text and Mitra.
  - **Mastaka:** the OCR merges three headwords into one line.
  - **"Topmost moulding" on leaf 166:** the headword was not found. The basanta gap stays open.

## Rulings the orchestrator asked for

- **`bada.what`: revised.**
  - The old sentence "Some walls have five parts instead, but the oldest temples use three" is too absolute.
  - Bose bases it on the Bhubaneswar temples he dates early by inscription or style. Authors also count the parts of single early walls differently.
  - New ending: "In many later temples, an extra band splits the middle part in two, making five parts. Early temples mostly have the simpler three-part wall."
  - This matches the glossary entries `bada` and `trianga-bada`.
  - Mitra 2003's "as in all Orissa temples" is about Konark and the fully developed temples; it is recorded in the note.
  - anat-043 was raised from uncertain to scholarly.
- **`pabhaga`:** unchanged and not staged. `checked_on` stays 2026-09-25.
- **Plan order follows the sources.** The anuraha is next to the raha; the anuratha is next to the kanika. Mitra 2003 leaf 26 states this directly.
- **Saptanga:** no source describes a seven-part wall. Not staged.
- **Coined names are labelled honestly.**
  - `mastaka`: a scholarly long line says the name is modern.
  - `trianga-bada`: a scholarly long line says the same. Bose: "a name coined to denote a three-segmented" bara.
- **Jangha:** "shin" (Bose) and "thigh" (Mitra, Behera) are given side by side. The tier is uncertain and no side is picked. anat-029 now says "leg" instead of "shin".
- **Khakhara and goddesses:** tier uncertain. Behera says "used for Devi worship". Brown, re-checked on leaf 240, calls the Vaital Deul "a Siva temple".
- **Konark-only elements:** `horses`, `wheel` and `vimana-base` each open with "belongs to one temple only: Konark".
  - Brown 1959 leaf 217 is a second source, so each is established.
  - `wheel.why` (the twelve months) stays scholarly.

## Source needing human approval

- **`mitra-d-1960`:** Debala Mitra, "Four Little-Known Khakhara Temples of Orissa", *Journal of the Asiatic Society*, Vol. II, 1960.
- **Confirmed:**
  - the byline "By Debala Mitra"
  - the volume, from the archive.org record and the running head
  - the start page: scan leaf 9 is printed p. 1
- **Not confirmed:** the end page and the series number.
- **Adris Banerji:** no evidence of him as an author.
- **Only these claims depend on it:** anat-010 (timber/bamboo origin), anat-011 (kakharu gourd) and the fuller anat-012. They appear only in the optional fragment.
- **Registered sources replaced it everywhere else.** Examples: Bose leaf 100 for rarity and miniatures; Bose leaf 143 for three-part walls.

## Gaps and leads

- **Terms not staged for lack of evidence:**
  - basanta: no definition found
  - saptanga bada: no source
  - konaka: a spelling seen in no source
- **Khura lead:** Behera's glossary, leaf 169, has a confirmed pairing: "'hoof'; lowermost moulding with a shaped profile used in the pitha or pabhaga of a temple." It is not a ledger claim, so it is not staged. Researcher lead.
- **Pidha-mundi:** Mitra 2003 leaf 101 and Behera leaf 127 define it. It is not a ledger claim.

## Links (temple_ids)

- **Based on evidence verified this run:**
  - rekha-deula: Konark, Puri, Mukteshvara
  - pidha-deula: Konark, Mukteshvara
  - natamandira and bhogamandapa: Lingaraja, Puri, plus Konark for natamandira only
  - torana: Mukteshvara
  - khakhara-mundi: Konark
- **Based on existing verified temple claims:**
  - triratha: Parasuramesvara
  - pancharatha: Lingaraja, Mukteshvara, Puri
- **Saptaratha is not linked to Konark.** Mitra calls parts of Konark both pancha-ratha and sapta-ratha.
