# Research prompts — all topics (with guardrails)

For use in any deep-research tool (Gemini Deep Research, ChatGPT, Perplexity…) **or** as briefs for our
`kalinga-researcher` agent. Whatever an outside tool returns is **LEADS ONLY** — it is never cited. Save each result
as `research/leads/<topic-id>.md` (or .docx); our researcher → fact-checker pipeline verifies every line against the
real source before anything reaches the site.

**How to run one topic:** paste **Block G (guardrails)** first, then the topic prompt. One topic per run.
Priority: ★★★ = the site needs it now · ★★ = next · ★ = nice to have.

| # | Topic id | Feeds | Priority | Status (2026-09-19) |
|---|---|---|---|---|
| T1 | `parasuramesvara` | temple page | ★★★ | done + supplement ledger (needs fact-check) |
| T2 | `mukteshwar` | temple page | ★★★ | fact-checked; gaps + story "wow" details |
| T3 | `lingaraj` | temple page | ★★★ | fact-checked; height blank; gaps |
| T4 | `jagannath-puri` | temple page | ★★★ | fact-checked; gaps |
| T5 | `konark` | temple page | ★★★ | fact-checked; gaps |
| A1 | `anatomy-terms` | glossary, elements, image labels | ★★★ | ledger (59) not fact-checked |
| A2 | `temple-types` | academy A, home cards | ★★★ | not started |
| A3 | `why-this-shape` | academy C | ★★ | not started |
| A4 | `how-it-was-built` | academy D, temple "how built" | ★★★ | not started |
| A5 | `materials-quarries` | temple "how built" | ★★ | partial |
| H1 | `eras-dynasties` | timeline | ★★ | fact-checked (6 eras); dynasty profiles missing |
| H2 | `temple-family` | "Its family", timeline examples | ★★ | not started |
| S1 | `sculpture-for-kids` | "Look closer" details | ★★ | not started |
| S2 | `conservation` | temple "saved" stories | ★ | partial |
| M1 | `map-locations` | map page | ★★ | not started |
| C1 | `size-measurements` | compare page, "How big" | ★★ | partial |
| L1 | `temples-today` | temple pages (living temple, visiting) | ★ | not started |

---

## Block G — guardrails (paste FIRST, every time)

```
You are a research assistant for a children's educational website about the temple architecture of
Odisha (Kalinga), India. Accuracy matters more than completeness. Follow these rules strictly.

ACCEPTED SOURCES ONLY: academic books from university or scholarly presses; peer-reviewed journal
articles; edited primary texts (e.g. Silpa Prakasa, Epigraphia Indica); inscriptions as published by
epigraphists; Archaeological Survey of India (ASI) reports, ASI Annual Reports, ASI/IGNCA monument
documentation; UNESCO World Heritage / ICOMOS documents; Government of Odisha archaeology publications.
Prefer works with a full text you can open (archive.org, Digital Library of India, JSTOR, publisher sites).
Good starting works: K. C. Panigrahi, Archaeological Remains at Bhubaneswar (1961); Percy Brown, Indian
Architecture (Buddhist and Hindu Periods) (1959); N. K. Bose, Canons of Orissan Architecture (1932);
R. L. Mitra, The Antiquities of Orissa (1875/1880); M. M. Ganguly, Orissa and Her Remains (1912);
J. Fergusson, History of Indian and Eastern Architecture (1876/1910); Debala Mitra, Bhubaneswar and
Konarak; T. E. Donaldson, Hindu Temple Art of Orissa (1985–87); K. S. Behera, Temples of Orissa;
Boner & Rath Sarma, Silpa Prakasa (1966); Boner, Rath Sarma & Das, New Light on the Sun Temple of
Konarka (1972); S. Kramrisch, The Hindu Temple (1946); J. C. Harle (1986); UNESCO WHC ref. 246.

FORBIDDEN AS SOURCES: Wikipedia or any wiki mirror, blogs, WordPress/Blogspot, news sites, tourism and
travel sites, temple or trust websites, Scribd, SlideShare, dokumen.pub, wisdomlib or other copies of
books (find the original scan instead), YouTube, social media, other AI tools, undated PDFs with no author.
You may use them only to FIND an accepted source — never cite them.

EVIDENCE RULES:
1. Every claim needs: an EXACT verbatim quote (copied, not paraphrased) + full bibliographic details +
   page number (or scan leaf number, labelled as such) + a URL to the full text you actually read.
2. If you only saw a search snippet, catalogue entry or abstract, mark it "SNIPPET ONLY".
3. NEVER invent or "reconstruct" a quote, page number, URL, date, measurement or author. If you cannot
   find it, write "NOT FOUND" — a gap is a good answer.
4. When sources disagree, give EVERY view with its own quote; do not pick a winner and do not average.
5. Label each claim: ESTABLISHED (inscription / excavation / ASI-UNESCO record, and scholars agree),
   SCHOLARLY (a scholar's reading of style or indirect evidence), or DEBATED/TRADITION (sources disagree,
   or it comes from legend, chronicle or estimate).
6. Measurements: give the exact figure and unit as printed, who measured it, and how (if stated).
7. Keep the source's wording for Odia/Sanskrit terms and give the spelling it uses.

KNOWN TRAPS (do not repeat these errors): "no metal was used" is false — dry masonry with iron cramps
and dowels; "Formative / Transitional / Mature" era labels are not from any accessible source; Lingaraja
was attributed to Yayati II and Uddyota Kesari (Panigrahi), not Yayati I; Jagannath "started 1112" and
"completed under Anangabhima III" are unsupported; Konark's main tower has COLLAPSED — the standing
building is the porch hall (jagamohana); 1,200 craftsmen / 12 years / Bishu Maharana / Dharmapada are
tradition; "700 of 7,000 temples" is a traditional estimate; Parasuramesvara's date is debated (c. 650 vs
late 8th century vs 9th century). Do not state a general "temples face east" rule.

SKIP (do not research): sexual/erotic sculpture, devadasi, urdhva-linga, communal or invasion narratives,
caste, anything that attacks or ranks religions or communities, living-temple access disputes.

OUTPUT FORMAT (exactly):
A) A table, one claim per row: | # | Claim (one plain sentence) | Exact quote | Source (author, title,
   publisher, year, edition) | Page / leaf | URL | Label (ESTABLISHED/SCHOLARLY/DEBATED/TRADITION) |
   SNIPPET ONLY? |
B) "Conflicts": each disagreement, with all views and quotes.
C) "Not found": every question you could not answer from accepted sources.
D) "Sources consulted": full list, marking which you opened in full text.
Plain English, no storytelling, no conclusions beyond the quotes.
```

---

## Temple prompts (T1–T5) — use the template, then add the temple-specific block

### Template (paste after Block G, replace `<TEMPLE>`)

```
TOPIC: <TEMPLE>, Odisha. Answer each question separately (numbered), following the rules above.
1. Date: when was it built? Every view with its quote. Is there any foundation inscription?
2. Patron and dynasty: who built it, or in whose reign? How certain is it?
3. Deity: to whom is it dedicated? Is worship still continuing (living temple)?
4. Temple type (rekha / pidha / khakhara) of each building, and the plan (triratha, pancharatha, …).
5. Parts: list every building (deul/vimana, jagamohana, natamandira, bhogamandapa, others) and every part
   of the main tower from base to top, using the source's terms.
6. Height and dimensions: tower height, lengths, platform, enclosure — figure, unit, who measured, how.
7. Orientation: which way does the main entrance face?
8. Materials: stone types used for each part, and quarry sources if stated.
9. Construction: methods, iron cramps, corbelling, ramps, repairs, later additions.
10. Special features: the 5–10 most remarkable things to notice (carvings, inscriptions, unique elements) —
    the kind of details a child would find amazing, each with its quote.
11. Why built here: any sourced statement about the site, the patron's purpose, or earlier shrines.
12. Influences: which earlier temples it follows, which later temples it influenced, comparisons made by scholars.
13. Inscriptions on or about the temple: what they say, published where (e.g. Epigraphia Indica volume/page).
14. Conservation history: damage, collapse, repairs (PWD, ASI), dates and what changed.
15. Location: town/locality, district; an OpenStreetMap node/way URL for the temple (for coordinates only).
```

### T1 Parasuramesvara (Bhubaneswar) — remaining gaps only
```
Focus on what is still open: names of the three base (pabhaga) mouldings for THIS temple (sources differ:
Ganguly gives Pada, Kumuda, Basanta; others say khura, kumbha, pata — quote each); whether the tower (gandi)
is triratha or pancharatha; positions of the hall's windows and doors; a definition of the vajra-mastaka /
chaitya medallion; what the 1898–1903 repair replaced at the sanctum doorway; the height (Brown 44 ft vs
IGNCA 12.80 m — any ASI measured drawing?). Ignore political "victory pillar" theories.
```

### T2 Mukteshvara (Bhubaneswar)
```
Also: the torana (arched gateway) — date relative to the temple and what it is carved with; the
"gem of Odisha" description (who said it, exact words); the interior carvings (unusual for Odisha); the
pidha jagamohana as an early example; the tank/enclosure; the date debate (Brown c. 975, Panigrahi 950–975,
others); the height (currently ~10.5 m — confirm source and method).
```

### T3 Lingaraja (Bhubaneswar)
```
Also: the height (sources give 128 ft, 160–165 ft, ~180 ft — find any ASI measurement); the four halls
(deul, jagamohana, natamandira, bhogamandapa) and which were added later, with dates; the patron
(Yayati II, completed by Uddyota Kesari — Panigrahi) and competing views; the enclosure and subsidiary
shrines (how many, which ones notable); Harihara worship (as described by scholars, no theology claims).
```

### T4 Jagannath (Puri)
```
Also: the height (Ganguly 1912 survey 214.67 ft; Fergusson and Mitra 192 ft; Brown ~200 ft) — any ASI
measurement; Chodaganga as patron and the dating evidence (inscriptions, Kendupatna plates — what they
really say); the walls (how many; Brown says three); the four buildings; the Nilachakra on top; the
temple kitchen as architecture (only structural facts). Skip origin-of-cult theories.
```

### T5 Konark (Sun Temple)
```
Also: the chariot design (number of wheels and horses — quote ASI/UNESCO and scholars; one UNESCO summary
says six horses); the wheels as sundials (is this in any accepted source, or popular myth?); the collapsed
main tower (original height estimates and who made them; collapse date/cause debate); the 1901–1904
sand-filling of the jagamohana and its recent removal (ASI sources only); the Natamandira; the
magnetic-lodestone legend (is it only legend? say so); khondalite and chlorite use; UNESCO criteria.
```

---

## A1 — Anatomy and terms (`anatomy-terms`) ★★★
```
TOPIC: the vocabulary of Kalinga (Odisha) temple architecture, as defined in N. K. Bose, Canons of
Orissan Architecture (1932), the Silpa Prakasa, Panigrahi 1961, Brown 1959, Donaldson, Kramrisch.
For EACH term give: spelling(s) used by the source, a one-sentence definition quoted from the source,
the part of the temple it names, and the body-part meaning if the source gives one.
Terms: deul/deula, vimana, rekha deul, pidha deul, khakhara deul, jagamohana, natamandira (natamandapa),
bhogamandapa, pista, bada, pabhaga (and its mouldings: khura, kumbha, pata, kani, basanta — whichever the
source lists), jangha (tala jangha, upara jangha), bandhana, baranda, gandi, bhumi / bhumi-amla, paga,
raha, kanika, anuratha, anuraha, triratha / pancharatha / saptaratha, mastaka, beki, amla / amalaka,
khapuri, kalasa, ayudha, dhvaja, pidha, ghanta, garbhagriha, antarala, torana, gavaksha, vajra-mastaka,
jhapa-simha, gaja-simha, dopichha lion, kirtimukha, naga/nagi pillars, parshvadevata, navagraha panel.
Also: the "body" metaphor — do sources describe the temple as a human body (pada, jangha, gandi, mastaka)
or as the Cosmic Being (Purusha)? Quote exactly.
```

## A2 — The three temple types (`temple-types`) ★★★
```
TOPIC: the three Odisha temple types — rekha deul, pidha deul, khakhara deul.
For each: roof/tower shape (quoted description); how it is used (sanctum vs hall); which deities it is
associated with (e.g. is khakhara associated with Shakti/goddess temples? quote, and note exceptions);
2–3 clearly identified examples with dates as the source gives them (e.g. Vaital Deul, Varahi at
Chaurasi, Mukteshvara jagamohana); how the types combine in one temple (rekha sanctum + pidha hall).
Is the three-type classification from the Silpa texts, from Bose, or from modern scholars? Quote.
```

## A3 — "Why this shape?" (`why-this-shape`) ★★
```
TOPIC: explanations given by scholars for the design of Odisha temples. For each question, give every
sourced explanation with its quote and say whether it is a scholar's interpretation or stated in a text:
1. Why does the tower curve? (Mount Meru / cosmic mountain — who says so, exact words.)
2. Why is the sanctum (garbhagriha) small and dark? ("womb chamber" — which source, exact words.)
3. Why do the parts have body names (pada, jangha, gandi, mastaka)? (Purusha / Cosmic Being — quote.)
4. How do the stones stay up without mortar? (dry masonry, corbelling, counterweights, iron cramps and
   dowels — quote engineering descriptions.)
5. Why is Konark shaped like a chariot? (Surya's chariot — quote.)
Do NOT answer with general Hindu philosophy from non-accepted sources; interpretations must be attributed.
```

## A4 — How it was built (`how-it-was-built`) ★★★
```
TOPIC: how Kalinga temples were built, step by step, from accepted sources (Bose 1932, Silpa Prakasa,
Panigrahi 1961, Brown 1959, Behera, Boner et al. 1972 on the Baya Chakada palm-leaf records of Konark).
Answer each: 1. the ground plan (bhunaksa?) and how stones were pre-cut to it; 2. foundations and the
platform (pista); 3. raising the walls (bada) and its mouldings; 4. building the curved tower (gandi) —
corbelling, how the curve was set out; 5. placing the crown (mastaka) — how heavy stones were lifted
(earth/sand ramps? which sources say so, for which temples); 6. iron cramps and dowels — where, how many
(Konark records?); 7. the team: karta (patron), sutragrahani / mahapatra (master architect), bardhanikas
(masons), carvers — their titles as given in the sources; 8. tools; 9. quarrying and transport of stone
(river, rafts, rollers — sourced only); 10. how long building took (only sourced figures; mark tradition).
Separate clearly: general method vs evidence for a specific temple.
```

## A5 — Materials and quarries (`materials-quarries`) ★★
```
TOPIC: stones used in Odisha temples — khondalite, laterite, chlorite, sandstone (Athgarh and others).
For each: what it is (geological description as quoted), where it was quarried (named places), which
temples and which parts use it, how it weathers, why builders chose it. Include any published geological
studies (peer-reviewed) on Konark, Lingaraja, Jagannath, Mukteshvara, Parasuramesvara.
```

## H1 — Eras and dynasties (`eras-dynasties`) ★★
```
TOPIC: the dynasties connected with Odisha temple building, 2nd c. BCE–16th c. CE: Mahameghavahana
(Kharavela, Udayagiri–Khandagiri caves), Shailodbhava, Bhauma-Kara, Somavamshi (Kesari), Eastern Ganga,
Suryavamshi Gajapati. For each: dates of rule as given by the source; capital(s); religion(s) of the kings
as described; temples securely linked by inscription vs attributed by style; one notable fact for
children. Also: how scholars divide the building history into periods (Brown's Early/Middle/Later with
dates; Panigrahi's groups; Donaldson's phases) — quote each scheme exactly.
```

## H2 — The temple family (`temple-family`) ★★
```
TOPIC: short profiles of Bhubaneswar/Odisha temples that explain how the style developed, for "related
temples" links: Satrughnesvara group, Bharatesvara, Lakshmanesvara, Vaital Deul, Sisiresvara, Markandesvara,
Rajarani, Brahmesvara (inscription 1058/1060), Ananta Vasudeva (inscription 1278), Kapilesvara, Varahi
(Chaurasi), Chausath Yogini (Hirapur). For each: type, date as the source gives it (with evidence type),
one feature that shows the style changing, which of our 5 temples it is compared with (quote).
```

## S1 — Sculpture children will notice (`sculpture-for-kids`) ★★
```
TOPIC: recognisable sculptural themes on Odisha temples that a child can spot, with where to see them
(which temple, which wall): planet-god panels (eight vs nine grahas and why that matters for dating);
Saptamatrikas (Seven Mothers); dikpalas (guardians of the directions); parshvadevatas in the wall niches
(Ganesha, Kartikeya, Parvati/Durga); lions (gaja-simha, jhapa-simha, dopichha); naga/nagi pillars;
kirtimukha; animal friezes (elephants, horses); musicians and dancers; Konark's wheels and horses.
Quote descriptions. Skip erotic/sexual sculpture entirely.
```

## S2 — Conservation and survival (`conservation`) ★
```
TOPIC: how Odisha's temples were damaged, repaired and protected: Bengal PWD repairs 1898–1903 (M. H.
Arnott — Parasuramesvara and others; what was changed); Konark jagamohana sand-filling 1901–1904 and the
recent removal by ASI; ASI protection status (centrally protected monuments); UNESCO inscription of
Konark (1984) and ICOMOS monitoring (2000); weathering of khondalite. ASI Annual Reports, Epigraphia
Indica notes, ICOMOS/UNESCO documents only. No news sites.
```

## M1 — Map locations (`map-locations`) ★★
```
TOPIC: locations for an interactive map. For each temple (Parasuramesvara, Mukteshvara, Lingaraja,
Jagannath Puri, Konark, plus the H2 temples): locality, town, district; the OpenStreetMap node or way URL
for the temple itself (coordinates will be read from OSM, not invented); ASI monument listing number if
the temple is ASI-protected (from ASI lists). Do not give coordinates from tourism sites.
```

## C1 — Sizes and measurements (`size-measurements`) ★★
```
TOPIC: measured sizes of the five temples for a size-comparison page. For each: tower height, total
length, platform/enclosure size — exact figures and units as printed, who measured, how (survey,
estimate), and date of measurement. Prefer ASI measured drawings, IGNCA/ASI documentation forms, and
surveyors (e.g. Ganguly 1912). Show all conflicting figures side by side. Never convert or round —
we do that.
```

## L1 — Temples today (`temples-today`) ★
```
TOPIC: the present status of the five temples, factually: is worship ongoing; who manages it (ASI,
temple administration under state law — name the act only if an official source says so); whether
non-Hindus may enter (only from an official/ASI source, stated neutrally); UNESCO/ASI protection; visiting
facts only from ASI/government pages. No festival stories, no religious claims.
```
