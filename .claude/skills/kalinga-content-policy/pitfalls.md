# Known pitfalls and disputed facts

Derived from `Odisha Temple Archtecture research.md` (sections 3, 4, 7, 12, Caveats). Each row says
what to do. The research report is a lead list, not a citation: open the named works yourself.

## Claims the plan or popular sources get wrong

| Pitfall | Correct handling | Enforced |
|---|---|---|
| "No nails or mortar / no metal" | Dry (mortar-less) masonry **with iron cramps and dowels**, balanced by counterpoise and corbelling. Academy question should read "How do the stones stay up without mortar?" | validator error on "no iron/metal" |
| Kendupatna copper-plate dates Konark | It is a genealogical grant of Narasimhadeva II. It supports the Chodaganga attribution for **Puri**, not Konark's construction date. Konark's date rests on the palm-leaf chronicles (Boner, Rath Sarma & Das 1972), style, and Narasimhadeva I's reign. | validator error |
| Yayati attributions | **Corrected 2026-09-19 from Panigrahi 1961 (full text):** Panigrahi credits **Mukteshvara to Yayati I** and **Lingaraja to Yayati II, completed by Uddyota Kesari** — the research report's "Yayati I built Lingaraja" is a misreading. All Yayati attributions stay 🟡/🔴 with a note, never 🟢. | validator error if 🟢 or no note (regex matches any "Yayati") |
| 1,200 craftsmen, 12 years, Bishu Maharana, Dharmapada legend | Tradition. Tier 🔴, sentence says "According to tradition…". | validator error |
| "700 surviving of 7,000" temples in Bhubaneswar | Traditional/estimated figures, not audited counts. Say "hundreds of temples survive; tradition speaks of thousands" or cite with "estimated". | validator warning |
| Konark "six horses" | Scholarship and UNESCO's OUV statement: seven horses; one UNESCO summary says six. Use seven, cite, note the inconsistency if asked. | validator warning |
| Konark shown/described as a complete tower | The main vimana has **collapsed**; the surviving structure is the pidha **jagamohana** (about 39 m / 128 ft). Original tower height (~70 m / 229 ft) is an **estimate** (Harle: "must have stood to some 225 feet") → 🔴. | brief + fact-check |
| Konark collapse date/cause stated as fact | Debated: poor khondalite, incompletion, Kalapahad 1568 (Madala Panji tradition), lightning; final fall variously late 16th c. or 1837. Tier 🔴. | fact-check |
| "13 m → 55 m" tower growth (plan's compare example) | 55 m for Lingaraja is in the research (c. 55 m). **13 m for Parasuramesvara is not** — must be sourced or the example removed. | fact-check |
| "Built by the Keshari dynasty" | Somavamshis are also called Kesaris; use "Somavamshi (Kesari)" consistently. | style |
| Lingaraja height "c. 55 m" | **Found 2026-09-19:** Panigrahi gives both "about 180 feet" and "128 feet high"; Fergusson "over 180 ft"; no ASI measurement located. Never publish as measured; 🔴 at most, or blank. | fact-check |
| Lingaraja natamandira "c. 1099–1104 CE" | Traceable only to Fergusson 1876, who used the traditional Kesari king list that Panigrahi calls "wholly wrong"; Panigrahi puts the added halls "apparently during the Ganga period". 🔴 at most. | fact-check |
| Era framework "Formative / Transitional / Mature" | **Found 2026-09-19:** no accessible source uses these labels; Percy Brown 1959 (full text) uses Early c. 750–900 / Middle c. 900–1100 / Later c. 1100–1250. Pending the human's ruling at G2. | G2 |
| Single exact dates for stylistically dated temples | Parasuramesvara: **Panigrahi c. 650 CE** (leaves 67, 80, 175) vs **Brown "towards the end of the eighth century"** vs Mitra 9th c. vs Fergusson c. 500 — 🔴 with all views · Mukteshvara c. 950–975 CE (**Brown 1959: "probably built about A.D. 975"** — the report's "Brown c. 950" is wrong; Panigrahi 966) · Rajarani c. 1000 CE (disputed, 11th–12th c. range) · Lingaraja c. 1000–1100 CE · Konark c. 1250 CE (chronicles 1246–1258) | validator date-range rule |
| Silpa Prakasa date | Most likely 9th–10th c. (Boner favoured later, nearer Konark). Tier 🔴 when dated. | fact-check |
| Silpa Prakasa "Kamagarbha = Varahi, Chaurasi" | Boner's hypothesis, not certainty. Tier 🔴. | fact-check |
| Mandala grid ground plan (Builder's Mind step 1) | **Decided 2026-09-18:** step 1 is about the *bhunaksa* ground plan the masons pre-cut stones to (research §4). A mandala/yantra layer may be added only if a source (e.g. Silpa Prakasa yantras, Kramrisch) is found and approved. | fact-check |
| Builder's Mind step 6 "sculptures carved" | **Decided:** step 6 is "The team" — Karta (patron), Sutragrahani/Mahapatra (master architect), Bardhanikas (masons) (research §4). Whether carving happened before or after placing stones is unsourced — do not state it. | fact-check |
| "Temples face east" as a rule | **Decided:** question dropped. Orientation is covered by "Why is Konark shaped like a chariot?" (Surya, chariot of the Sun — research §3, §8). Do not state a general east-facing rule without a source. | fact-check |
| "Carvings increase outward: outer = material world, inner = formless divine" | **Decided:** question dropped; replaced by "Why do the parts have body names?" (bada/gandi/mastaka as the Cosmic Being/Purusha — research §2). | — |
| Tower curve = Mount Meru | Kept as an **attributed interpretation**: 🟡 at most, "Scholars such as … explain…". | fact-check |
| Timeline era boundaries | **Decided at G2 (2026-09-19):** six eras with descriptive, non-scholarly labels (Rock-cut roots · First temples · Experiment & refinement · Monumental scale · Grand finale · Late Kalinga); each era's `period` is a cited claim (mostly Brown 1959). Never call them "Formative/Transitional/Mature". | fact-check |

## Firm anchors (still cite the originals)

- Brahmesvara: inscription (now lost, recorded) — 18th regnal year of Udyotakesari = 1058 CE (some sources 1060); built by his mother Kolavati Devi.
- Ananta Vasudeva: inscription in the British Museum — Saka 1200 = 1278 CE; Queen Chandrika.
- Puri Jagannath: Chodaganga (r. 1078–1150). **Not found in any accessible source (2026-09-19):** the 1112 CE start and "completed under Anangabhima III" — Panigrahi says "Chodaganga and his successor Anangabhima in the twelfth century"; Brown c. 1100, consecrated 1118.
- Konark: UNESCO inscription 1984, ref. 246, criteria (i)(iii)(vi); Narasimhadeva I (r. 1238–1264).
- Jagamohana sand-fill 1901–1904; 1996–97 subsidence; ICOMOS mission Feb 2000; ASI/IIT-Madras sand removal (track via ASI releases only — no news sites).
- Materials: khondalite (body, sculpture; weathers), laterite (foundations, cores), chlorite (door frames, icons; most durable); Athgarh sandstone around Bhubaneswar.
- Organisation of labour per silpa literature: Karta (patron), Sutragrahani / Mahapatra (master architect), Bardhanikas (masons), bhunaksa (ground plan).

## Facts the MVP pages need that the research report does NOT contain

Researchers must find accepted sources or leave these `null`:
heights of Parasuramesvara, Mukteshvara, Jagannath Puri; deity details beyond the report; GPS
coordinates (use OpenStreetMap node URL as `coord_source`); Mukteshvara/Parasuramesvara structural
part lists; stone quarry sources per temple; "why this location" narratives; Sketchfab CC models.
