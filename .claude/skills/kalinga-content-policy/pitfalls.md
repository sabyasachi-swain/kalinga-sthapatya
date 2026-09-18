# Known pitfalls and disputed facts

Derived from `Odisha Temple Archtecture research.md` (sections 3, 4, 7, 12, Caveats). Each row says
what to do. The research report is a lead list, not a citation: open the named works yourself.

## Claims the plan or popular sources get wrong

| Pitfall | Correct handling | Enforced |
|---|---|---|
| "No nails or mortar / no metal" | Dry (mortar-less) masonry **with iron cramps and dowels**, balanced by counterpoise and corbelling. Academy question should read "How do the stones stay up without mortar?" | validator error on "no iron/metal" |
| Kendupatna copper-plate dates Konark | It is a genealogical grant of Narasimhadeva II. It supports the Chodaganga attribution for **Puri**, not Konark's construction date. Konark's date rests on the palm-leaf chronicles (Boner, Rath Sarma & Das 1972), style, and Narasimhadeva I's reign. | validator error |
| Yayati I built Mukteshvara / Lingaraja | Panigrahi's attribution; most scholars do not accept it as proven. Tier 🟡 or 🔴 with a note. | validator error if 🟢 or no note |
| 1,200 craftsmen, 12 years, Bishu Maharana, Dharmapada legend | Tradition. Tier 🔴, sentence says "According to tradition…". | validator error |
| "700 surviving of 7,000" temples in Bhubaneswar | Traditional/estimated figures, not audited counts. Say "hundreds of temples survive; tradition speaks of thousands" or cite with "estimated". | validator warning |
| Konark "six horses" | Scholarship and UNESCO's OUV statement: seven horses; one UNESCO summary says six. Use seven, cite, note the inconsistency if asked. | validator warning |
| Konark shown/described as a complete tower | The main vimana has **collapsed**; the surviving structure is the pidha **jagamohana** (about 39 m / 128 ft). Original tower height (~70 m / 229 ft) is an **estimate** (Harle: "must have stood to some 225 feet") → 🔴. | brief + fact-check |
| Konark collapse date/cause stated as fact | Debated: poor khondalite, incompletion, Kalapahad 1568 (Madala Panji tradition), lightning; final fall variously late 16th c. or 1837. Tier 🔴. | fact-check |
| "13 m → 55 m" tower growth (plan's compare example) | 55 m for Lingaraja is in the research (c. 55 m). **13 m for Parasuramesvara is not** — must be sourced or the example removed. | fact-check |
| "Built by the Keshari dynasty" | Somavamshis are also called Kesaris; use "Somavamshi (Kesari)" consistently. | style |
| Single exact dates for stylistically dated temples | Parasuramesvara c. 650 CE (Panigrahi; others early 8th c.; Fergusson c. 500) · Mukteshvara c. 950–975 CE (Brown c. 950; Panigrahi 966) · Rajarani c. 1000 CE (disputed, 11th–12th c. range) · Lingaraja c. 1000–1100 CE · Konark c. 1250 CE (chronicles 1246–1258) | validator date-range rule |
| Silpa Prakasa date | Most likely 9th–10th c. (Boner favoured later, nearer Konark). Tier 🔴 when dated. | fact-check |
| Silpa Prakasa "Kamagarbha = Varahi, Chaurasi" | Boner's hypothesis, not certainty. Tier 🔴. | fact-check |
| Mandala grid ground plan (Builder's Mind step 1) | **Decided 2026-09-18:** step 1 is about the *bhunaksa* ground plan the masons pre-cut stones to (research §4). A mandala/yantra layer may be added only if a source (e.g. Silpa Prakasa yantras, Kramrisch) is found and approved. | fact-check |
| Builder's Mind step 6 "sculptures carved" | **Decided:** step 6 is "The team" — Karta (patron), Sutragrahani/Mahapatra (master architect), Bardhanikas (masons) (research §4). Whether carving happened before or after placing stones is unsourced — do not state it. | fact-check |
| "Temples face east" as a rule | **Decided:** question dropped. Orientation is covered by "Why is Konark shaped like a chariot?" (Surya, chariot of the Sun — research §3, §8). Do not state a general east-facing rule without a source. | fact-check |
| "Carvings increase outward: outer = material world, inner = formless divine" | **Decided:** question dropped; replaced by "Why do the parts have body names?" (bada/gandi/mastaka as the Cosmic Being/Purusha — research §2). | — |
| Tower curve = Mount Meru | Kept as an **attributed interpretation**: 🟡 at most, "Scholars such as … explain…". | fact-check |
| Timeline era boundaries | **Decided:** six eras built on the scholarly Formative / Transitional / Mature phases (Behera, Parida, Mohapatra; Sahoo 2012 summary) plus rock-cut roots, Konark finale, late Kalinga. Each era's `period` is a cited claim. | fact-check |

## Firm anchors (still cite the originals)

- Brahmesvara: inscription (now lost, recorded) — 18th regnal year of Udyotakesari = 1058 CE (some sources 1060); built by his mother Kolavati Devi.
- Ananta Vasudeva: inscription in the British Museum — Saka 1200 = 1278 CE; Queen Chandrika.
- Puri Jagannath: Chodaganga (r. 1078–1150); 1134–35 CE donative inscription; completed under Anangabhima III (r. c. 1211–1238).
- Konark: UNESCO inscription 1984, ref. 246, criteria (i)(iii)(vi); Narasimhadeva I (r. 1238–1264).
- Jagamohana sand-fill 1901–1904; 1996–97 subsidence; ICOMOS mission Feb 2000; ASI/IIT-Madras sand removal (track via ASI releases only — no news sites).
- Materials: khondalite (body, sculpture; weathers), laterite (foundations, cores), chlorite (door frames, icons; most durable); Athgarh sandstone around Bhubaneswar.
- Organisation of labour per silpa literature: Karta (patron), Sutragrahani / Mahapatra (master architect), Bardhanikas (masons), bhunaksa (ground plan).

## Facts the MVP pages need that the research report does NOT contain

Researchers must find accepted sources or leave these `null`:
heights of Parasuramesvara, Mukteshvara, Jagannath Puri; deity details beyond the report; GPS
coordinates (use OpenStreetMap node URL as `coord_source`); Mukteshvara/Parasuramesvara structural
part lists; stone quarry sources per temple; "why this location" narratives; Sketchfab CC models.
