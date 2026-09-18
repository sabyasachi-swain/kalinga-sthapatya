# Source registry verdicts — Phase 1.0

Checked on 2026-09-18. Input: the Bibliography table of the research report (20 entries), plus Kramrisch 1946 and the UNESCO Konark documents.
Fragment: `research/staged/sources.json` has 23 source objects. Staged validator: PASS, 0 errors, 1 warning (openlibrary.org).

## Registry

| # | Work (report entry) | Found? | id | url_kind | Full text online? | Notes |
|---|---|---|---|---|---|---|
| 1 | Donaldson, *Hindu Temple Art of Orissa*, 1985–87 | Yes | donaldson-1985 | catalogue (Google Books) | No, snippet view | The record shows ISBN 9789004071735 but labels it "Volume 12, Part 2"; check the vol./set ISBN. brill.com/view/title/2581 returned 403. |
| 2 | *Silpa Prakasa*, Boner & Rath Sarma, Brill 1966 | Yes | boner-rath-sarma-1966 | catalogue (WorldCat) | No | HathiTrust 000561641 returned 403. The report's review DOIs are for reviews, not the edition. |
| 3 | *Silpa Prakasa*, Baumer / R.P. Das / S. Das, 2005 | Partly | baumer-das-das-nd | publisher | No | The Motilal page confirms the edition, editors and IGNCA, but shows **no year and no ISBN**. 2005 and 9788120820524 appear only on retailer sites. mlbd.in page 404; RKMVERI catalogue refused connection. **Human: confirm year/ISBN, then rename the id.** |
| 4 | Panigrahi, *Archaeological Remains at Bhubaneswar*, 1961 | Yes | panigrahi-1961 | archive | **Yes** | The title page confirms Orient Longmans, ©1961. The archive.org metadata says 1960 (wrong). |
| 5a | R. Mitra, *Antiquities of Orissa* Vol. I, 1875 | Yes | mitra-r-1875 | archive | **Yes** | The report's archive.org lead (dli.2015.44126) is Vol. II only; Vol. I is dli.2015.38323. |
| 5b | R. Mitra, *Antiquities of Orissa* Vol. II, 1880 | Yes | mitra-r-1880 | archive | **Yes** | The scan is a 1963 reprint of the 1880 edition (W. Newman & Co.). Page numbers may differ. |
| 6 | Ganguly, *Orissa and Her Remains*, 1912 | Yes | ganguly-1912 | archive | **Yes** | The "(Puri District)" subtitle was not seen in the metadata. |
| 7a | Fergusson, *History of Indian and Eastern Architecture*, 1876 | Yes | fergusson-1876 | archive | **Yes** | John Murray, London, 1876. |
| 7b | Fergusson rev. Burgess & Spiers, 1910 | Yes | fergusson-1910 | catalogue (Wellcome) | Yes (digitised; marked "In copyright") | 2 vols, J. Murray, 1910. |
| 8 | Percy Brown, *Indian Architecture (Buddhist and Hindu Periods)*, 1942 | Yes, **1959 printing** | brown-1959 | archive | **Yes** | The 1942 first edition was not found online. Archive item dli.2015.16883 (1942) is the **Islamic Period** volume, per its OCR title page, so it is not usable. The 1971 printing is borrow-only. |
| 9 | Debala Mitra, *Bhubaneswar* (ASI), 1958 | Partly, **1978 4th ed.** | mitra-d-1978 | catalogue (Open Library) | No | The 1958 first edition was not confirmed in any fetched catalogue (only bookseller listings). The Heidelberg HEIDI catalogue refused connection. |
| 10 | Debala Mitra, *Konarak* (ASI), 1968 | Yes, **2003 printing** | mitra-d-2003 | archive | **Yes** | The 1968 first date comes from Open Library's work list. The record mentions a 1976 2nd edition. |
| 11 | N.K. Bose, *Canons of Orissan Architecture*, 1932 | Yes | bose-1932 | archive | **Yes** | Public domain. |
| 12 | K.S. Behera, *Temples of Orissa*, 1993 | Yes | behera-1993 | catalogue (Google Books) | No | Orissa Sahitya Akademi, 1993, 111 pp. No ISBN shown. |
| 13 | K.S. Behera, *Konark: The Black Pagoda*, 2005 | Yes | behera-2005 | archive | **Yes** | ISBN 8123012365 confirmed in the archive.org metadata. |
| 14 | Boner, Rath Sarma & Das, *New Light on the Sun Temple of Konarka*, 1972 | Yes | boner-rath-sarma-das-1972 | archive | Borrow-only (lending library) | Chowkhamba Sanskrit Series Office, 1972, 482 pp. |
| 15 | R.P. Mohapatra, *Archaeology in Orissa*, 1986 | Yes (Vol. 1) | mohapatra-1986 | catalogue (Google Books) | No | The ISBN recorded is Vol. 1's (9788170183471). The set ISBN was not confirmed. |
| 16 | A.N. Parida, *Early Temples of Orissa*, 1999 | **No** | — | — | — | See "Not verified" below. |
| 17 | A. Sahoo, *Odisha Review*, May 2012 | **No** | — | — | — | See "Not verified" below. |
| 18 | UNESCO WHC list 246 | **No** (host 403) | — | — | — | Stand-ins registered: unesco-konarak-summary (unesco.org) and asi-konarak-whs (asi.nic.in). See below. |
| 19 | ICOMOS 2000 mission / SOC | Yes, record only | icomos-2000; unesco-whc-2000 | official | Mission report: **No** (file not found). Bureau decision 24 BUR IV.B.65: **Yes** | soc/2434 returned 403. Decisions page 5825 is used for the SOC record. |
| 20 | R.D. Banerji, Epigraphia Indica XIII | Yes, **volume level** | konow-thomas-1915 | archive | **Yes** | The volume is registered under its editors. The article attribution is unclear: one OCR reads "R. D. Banerjii, p. 159"; another scan places "Lionel D. Barnett" next to it. **Confirm on p. 159.** The title "Minor inscriptions of Kharavela" was not seen. |
| + | Kramrisch, *The Hindu Temple*, 1946 | Yes | kramrisch-1946 | archive | **Yes** (Vols I and II) | Vol. II URL is in the notes. |
| + | UNESCO Konark nomination file / ICOMOS 1984 Advisory Body Evaluation | **No** (host 403) | — | — | — | See below. |
| + | UNESCO.org summary page, Konark | Yes | unesco-konarak-summary | official | Yes | Stand-in for list/246: states 1984, criteria (i)(iii)(vi), ref. 246. |
| + | ASI World Heritage page, Konarak | Yes | asi-konarak-whs | official | Yes | Mentions seven horses and "presumably over 68 m" sikhara (an estimate). |

## Not verified (not in staged data)

| Work | What was tried | Why not included |
|---|---|---|
| A.N. Parida, *Early Temples of Orissa* (1999) | Web searches restricted to worldcat.org, books.google.com, archive.org, hathitrust.org and openlibrary.org; a general search; Shodhganga handle 10603/128730 (a thesis with the same title) | Only retailer listings (Amazon, AbeBooks, Flipkart) were found. Shodhganga returned an "Access Denied" (Anubis bot-protection) page. The Heidelberg Odisha bibliography lists it, but no record URL was obtained. **Human: find a catalogue record or Shodhganga PDF.** |
| A. Sahoo, "General Introduction to Odishan Temple Architecture", *Odisha Review* May 2012 | Fetched magazines.odisha.gov.in/Orissareview/2012/May/engpdf/39-43.pdf and the lowercase variant | Both failed: **"certificate has expired"** (TLS). The content was not seen. A Scribd copy exists but Scribd is not an accepted host. **Human: open it in a browser, check the title and author, then add it.** |
| UNESCO WHC list page, whc.unesco.org/en/list/246 | Fetched /en/list/246, /en/list/246/, /fr/list/246, /en/list/246/documents and /documents/ at several points in the run | **HTTP 403 every time (blocked by host), needs human check.** Other whc.unesco.org pages did load (documents/140288, decisions/5825), so this looks like bot filtering, not a dead page. |
| UNESCO nomination file and ICOMOS 1984 Advisory Body Evaluation for Konark | Searches for the documents list; tried whc.unesco.org/document/162851 and /document/164621 (ids from search results) | 403. The document id for the 1984 evaluation was never seen, so no URL could be recorded. I did not guess the "advisory_body_evaluation/246.pdf" pattern. **Human: open whc.unesco.org/en/list/246/documents in a browser.** |
| UNESCO SOC page, whc.unesco.org/en/soc/2434 | Fetched twice | 403. Covered by the decision page instead (unesco-whc-2000). |
| Brill title page for Donaldson (brill.com/view/title/2581) | Fetched | 403. The Google Books record was used instead. |
| HathiTrust catalogue records (000561641 Silpa Prakasa; 001254393 Panigrahi) | Fetched | 403. WorldCat and archive.org were used instead. |

## Hosts for human review at gate G1

- **openlibrary.org** (mitra-d-1978). An Internet Archive project, but not on the validator's trusted list. It is the only warning from the validator.
- All other registered hosts are on the trusted list: archive.org, books.google.co.in, search.worldcat.org, wellcomecollection.org, www.motilalbanarsidass.com, whc.unesco.org, www.unesco.org, asi.nic.in.
- Not registered, for information: magazines.odisha.gov.in (expired TLS certificate), shodhganga.inflibnet.ac.in (bot-protection page), katalog.ub.uni-heidelberg.de and lib.rkmvu.ac.in (connection refused).

## Cautions for researchers

- Years and ids reflect the edition actually seen: brown-1959 (not 1942), mitra-d-2003 (Konarak; first published 1968), mitra-d-1978 (Bhubaneswar 4th ed.; 1958 not confirmed). Cite page numbers from these editions only.
- For konow-thomas-1915, confirm the author of "No. 13" on p. 159 before attributing it to R.D. Banerji.
- unesco-konarak-summary: UNESCO's short text says "six horses". This is a known pitfall; use seven with the ASI and scholarly sources.
- Borrow-only and catalogue-only works (Donaldson, Silpa Prakasa 1966 and 2005, Behera 1993, Mohapatra, Debala Mitra *Bhubaneswar*, Boner et al. 1972) can only support `catalogue-only` or `snippet` claims unless someone reads the actual pages.
