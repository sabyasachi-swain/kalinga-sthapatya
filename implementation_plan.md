# Kalinga Sthapatya — Final Implementation Plan

> **କଳିଙ୍ଗ ସ୍ଥାପତ୍ୟ** — *The Architecture of Kalinga*
> An interactive educational platform to explore Odisha's temple architecture.

---

## All Decisions (from our brainstorming)

| Decision | What We Agreed |
|---|---|
| **Name** | Kalinga Sthapatya (କଳିଙ୍ଗ ସ୍ଥାପତ୍ୟ) |
| **Audience** | General public, families, kids — curiosity-driven, not academic |
| **Language** | Simple English. No jargon without explanation. Odia later. |
| **Visual theme** | Clean, white/light, good contrast. Objects pop against background. |
| **Landing page** | Temple silhouette builds itself (animation) → reveals hero + tagline + CTA |
| **Navigation** | Top navigation bar + footer |
| **Exploded view style** | Rendered/realistic with comprehensive labels (hybrid of Style A + B) |
| **Temple illustrations** | Artistic/stylized for hero & backgrounds; Recognizable for temple pages |
| **3D models** | Embed Sketchfab CC models where available; isometric illustrations otherwise |
| **Content policy** | Every fact cited with clickable URL. Sources: research papers, books, ASI reports only. No blogs/news. If unsure → leave blank. AI-assisted disclosure. |
| **Temple page content** | Deep but hidden in accordion sections (click heading → details expand) |
| **Map interaction** | Click temple dot → preview card slides in on right → "Learn More" to full page |
| **Timeline** | Design evolution as the story. Each era shows: design change → example temples → dynasty |
| **Homepage map** | Mini preview map on homepage + full map on dedicated page |
| **Kid features** | Simple language throughout. Quiz/fun facts deferred to later. |
| **5 MVP temples** | Parasuramesvara, Mukteshwar, Lingaraj, Jagannath Puri, Konark |
| **Hosting** | GitHub Pages (free). Migrate later if needed. |
| **Tech stack** | Vanilla HTML/CSS/JS + JSON data files. No frameworks. |

---

## Project Structure

```
kalinga-sthapatya/
├── index.html                  ← Landing page
├── timeline.html               ← Interactive timeline
├── academy.html                ← Architecture Academy
├── map.html                    ← Full interactive map
├── compare.html                ← Temple comparison tool
├── glossary.html               ← Searchable glossary
├── about.html                  ← About, methodology, content policy, AI disclosure
├── temples/
│   ├── parasuramesvara.html
│   ├── mukteshwar.html
│   ├── lingaraj.html
│   ├── jagannath-puri.html
│   └── konark.html
├── css/
│   └── style.css
├── js/
│   ├── main.js                 ← Nav, shared interactions, accordion component
│   ├── timeline.js
│   ├── map.js
│   ├── academy.js              ← Exploded view, builder's mind
│   ├── glossary.js
│   └── compare.js
├── data/
│   ├── temples.json            ← All temple data
│   ├── glossary.json           ← Architectural terms
│   ├── timeline.json           ← Historical phases
│   └── elements.json           ← Architectural elements
├── img/
│   ├── hero/                   ← Landing page artwork (artistic style)
│   ├── temples/                ← Temple illustrations (recognizable style)
│   ├── diagrams/               ← Exploded view, anatomy diagrams (rendered + labels)
│   └── icons/                  ← UI icons, temple type icons
├── sitemap.xml
└── README.md
```

---

## Page-by-Page Plan

### 1. 🏠 Landing Page (`index.html`)

**First impression — must hook visitors immediately.**

| Section | Content | Interaction |
|---|---|---|
| **Hero** | Animated temple silhouette that builds itself (3-4 sec SVG animation) → settles into artistic illustration + tagline: *"Explore 1,400 years of stone, symmetry, and the sacred"* | "Start Exploring" button |
| **"What is Kalinga Architecture?"** | 3 cards: Rekha Deula, Pidha Deula, Khakhara Deula — each with icon, name, one-line description | Click → goes to Academy |
| **"The Evolution Story"** | Mini timeline showing 4 key moments: First temples → Gem of Odisha → Monumental scale → Grand finale | "See Full Timeline" link |
| **"Explore Odisha"** | Mini map — Odisha outline with 5 temple dots | "Open Full Map" link |
| **Featured Temple** | One temple highlight (Konark) with artistic illustration + 2-sentence hook | "Explore This Temple" link |
| **Footer** | About, Content Policy, Sources, "Built with ❤️ for Odisha heritage", AI disclosure |

**SEO**: Semantic HTML5, meta description, Open Graph tags, schema.org/WebSite structured data.

---

### 2. ⏳ Timeline Page (`timeline.html`)

**Story: How temple design evolved across centuries.**

6 era sections, each containing:

```
ERA CARD
├── Period (e.g., "9th–10th Century CE")
├── Design Change headline (e.g., "Ornamentation reaches perfection")
├── What changed in the architecture (2-3 sentences)
├── Dynasty responsible (e.g., Somavamshi / Keshari)
├── Key temples built (clickable → temple pages)
├── Temple silhouette illustration showing the style
└── Sources cited
```

**Layout**: Horizontal scrollable on desktop (left to right = old to new). Vertical on mobile.
**Visual**: Temple silhouettes grow taller and more complex as you scroll right.

---

### 3. 🏛️ Architecture Academy (`academy.html`)

**The educational core — four sections on one scrollable page.**

#### Section A: "The Three Temple Types"
Three cards side by side:
- Rekha Deula (curvilinear tower)
- Pidha Deula (stepped pyramid)
- Khakhara Deula (barrel vault)

Each card shows: illustration, name, roof shape, typical use, deity association.

#### Section B: "Anatomy of a Temple" — Exploded View ⭐
The hybrid rendered exploded view illustration (rendered + detailed labels).
- On the page as a large, prominent image
- Clickable hotspots on each labeled part
- Click a part → info panel slides in from the side with: name, what it is, why it's there, where to see it

#### Section C: "Why This Shape?" ⭐
5 accordion cards — question visible, click to expand the answer:

| Question | Answer Summary |
|---|---|
| "Why does the tower curve?" | Represents Mount Meru, the cosmic axis |
| "Why is the sanctum dark?" | Garbhagriha = womb chamber |
| "Why do carvings increase outward?" | Outer = material world, inner = formless divine |
| "Why no nails or mortar?" | Interlocking dry-stone engineering |
| "Why face east?" | Solar alignment, cosmic order |

Each answer includes: simple explanation + diagram + cited source.

#### Section D: "How Was It Built?" — Builder's Mind ⭐
Step-by-step illustrated sequence (click "Next Step" to advance):

1. Ground plan laid using mandala grid → explain the geometry
2. Pista (platform) rises → explain foundation engineering
3. Bada (walls) go up → explain the five horizontal moldings
4. Gandi (tower) curves upward → explain how they achieved the curve
5. Mastaka (crown) placed → explain the symbolic meaning
6. Sculptures carved → explain who did the carving

Each step: illustration + 2-3 sentence explanation + source.

---

### 4. 🗺️ Map Page (`map.html`)

**Interactive Odisha map with temples as clickable locations.**

| Feature | Details |
|---|---|
| **Map library** | Leaflet.js with OpenStreetMap tiles (free, no API key) |
| **Temple markers** | Custom icons (small temple silhouette) at GPS coordinates |
| **Click interaction** | Click marker → preview card slides in on right side with: name, period, type, illustration, "Learn More" button |
| **Filters** | Filter by era (6th–7th, 9th–10th, etc.) and by type (Rekha/Pidha/Khakhara) |
| **Time Machine slider** | Drag through centuries → markers appear/disappear by construction date |
| **Styling** | Muted, earth-toned map tiles to match site aesthetic |

---

### 5. 🏛️ Temple Pages (5 pages in `temples/`)

**Each temple page uses the same template with accordion sections.**

User lands on the page and sees:
- **Hero**: AI-generated recognizable illustration + temple name + period badge + one-liner
- **Quick Facts bar**: Dynasty | Date | Height | Deity | Temple Type — in a clean horizontal strip

Below that, **accordion sections** (headings visible, click to expand):

| Accordion Heading | Content When Expanded |
|---|---|
| **📐 Parts of This Temple** | Annotated diagram showing which parts this temple has (Vimana, Jagamohana, etc.) with click-to-learn on each |
| **❓ Why Was It Built?** | Patron's story, motivation, why this location was chosen (2-3 paragraphs) |
| **🔨 How Was It Constructed?** | Materials used, stone type, quarry source, construction technique, labor |
| **✨ What's Special About It?** | 2-3 unique features that set this temple apart from others |
| **📏 How Big Is It?** | Size comparison illustration — temple next to a human figure and a 5-story building |
| **🔗 What Influenced Its Design?** | Link to earlier temples, what design elements were carried forward or changed |
| **📜 Sources & Evidence** | Full bibliography with clickable URLs, evidence tier badges (🟢/🟡) |

**All content is citable. Sections left blank if evidence is insufficient.**

---

### 6. 🔀 Compare Page (`compare.html`)

- Two dropdown selectors: "Temple A" and "Temple B"
- Side-by-side display showing: silhouette, height, period, dynasty, type, key features
- Highlight differences (e.g., "Tower grew from 13m to 55m over 400 years")
- Data-driven from `temples.json`

---

### 7. 📖 Glossary Page (`glossary.html`)

- Searchable list of 20+ architectural terms
- Each term: name, simple one-line definition, which temples feature it
- Search bar at top + alphabet filter (A–Z)
- Click any term → expands to show full explanation

---

### 8. ℹ️ About Page (`about.html`)

| Section | Content |
|---|---|
| **About Kalinga Sthapatya** | Mission, what this platform is |
| **Content Policy** | Full policy: citation rules, accepted sources, no invention, AI disclosure |
| **Methodology** | How content was researched, evidence tier system (🟢🟡🔴) |
| **Image Credits** | Attribution for all CC-licensed images, AI-generated disclosure |
| **Contact** | How to report errors or suggest temples |

---

## Visual Design System

### Color Palette (Light/Clean Theme)

| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#FFFFFF` | Page background |
| `--bg-warm` | `#FBF7F0` | Section backgrounds (subtle warmth) |
| `--text-primary` | `#1A1A1A` | Headings, body text |
| `--text-secondary` | `#6B5B4E` | Captions, secondary info |
| `--accent` | `#A0522D` | CTA buttons, active states, links |
| `--accent-hover` | `#8B4513` | Button hover states |
| `--gold` | `#C9A84C` | Highlights, selected elements, badges |
| `--border` | `#E5DDD0` | Card borders, dividers |
| `--bg-card` | `#FFFFFF` | Card backgrounds |
| `--evidence-green` | `#2D7A3A` | 🟢 Established evidence |
| `--evidence-amber` | `#B8860B` | 🟡 Scholarly interpretation |
| `--evidence-red` | `#C0392B` | 🔴 Uncertain |

### Typography
- **Headings**: Playfair Display (serif, Google Fonts — free)
- **Body**: Inter (sans-serif, Google Fonts — free)
- **Labels/Annotations**: Inter 600 weight, small caps

### Components
- **Accordion** — Click heading to expand/collapse content sections
- **Card** — White background, subtle border, rounded corners, hover shadow
- **Badge** — Small colored pill for evidence tiers, periods, temple types
- **Tooltip** — Hover/tap for quick term definitions
- **Button** — Laterite red (`#A0522D`), white text, rounded
- **Nav bar** — White, sticky, logo + links, hamburger menu on mobile

---

## Content Policy (Built Into the Website)

```
KALINGA STHAPATYA CONTENT POLICY
═══════════════════════════════════════

✅ ACCEPTED SOURCES
   Research papers (peer-reviewed journals)
   Published academic books
   ASI (Archaeological Survey of India) reports
   Government archaeological documentation

❌ NOT ACCEPTED
   News articles, blogs, social media
   Wikipedia (except as starting point for finding real sources)
   Unverified websites

📏 RULES
   1. Every factual claim has a clickable citation URL
   2. If we cannot verify → we leave it blank
   3. No invention, no hallucination, no assumptions presented as fact
   4. Dates given as ranges (e.g., "c. 10th century CE")
   5. Evidence tier badge on every historical claim:
      🟢 Established — epigraphy, archaeology, primary texts
      🟡 Scholarly — consensus based on indirect evidence
      🔴 Uncertain — competing hypotheses, insufficient evidence
   6. AI-assisted content creation is disclosed on the About page

🤖 AI DISCLOSURE
   "Content on this platform was researched and written with AI assistance.
    All facts are verified against published academic sources cited on each page.
    Illustrations are AI-generated original artwork."
```

---

## Research Approach

For each temple, I will:

1. **Search academic sources** — Google Scholar, JSTOR, ResearchGate for published papers
2. **Cross-reference with ASI data** — Archaeological Survey of India reports and records
3. **Verify dates and attributions** — Use at least 2 independent sources per claim
4. **Document evidence gaps** — If only one source or uncertain, mark with 🟡 or leave blank
5. **Compile bibliography** — Every temple page gets a full source list with clickable links
6. **Generate illustrations** — AI-generated, clearly marked as such

---

## Image Strategy

| Type | Style | Used Where |
|---|---|---|
| **Artistic/stylized illustrations** | Flat vector, warm earth tones, decorative | Landing hero, section backgrounds, atmosphere |
| **Recognizable depictions** | Detailed, accurate, labeled | Individual temple pages |
| **Rendered exploded views** | Realistic textures + comprehensive labels | Academy (anatomy section) |
| **SVG diagrams** | Clean code-drawn vectors | Temple types, floor plans, comparison overlays |
| **Wikimedia Commons photos** | CC-licensed with attribution | Where available, supplementary |
| **Sketchfab 3D embeds** | CC-licensed interactive models | Temple pages where models exist |

---

## Verification Plan

### Before Launch
- [ ] Every page loads correctly in Chrome, Firefox, Safari, Edge
- [ ] Responsive: test at 375px (mobile), 768px (tablet), 1440px (desktop)
- [ ] All navigation links work
- [ ] All accordion sections expand/collapse
- [ ] Map loads, markers appear, popup cards work
- [ ] Timeline scrolls, era cards expand
- [ ] Glossary search filters correctly
- [ ] Every factual claim has a cited source
- [ ] All images have alt text
- [ ] Keyboard navigation works (Tab through all interactive elements)
- [ ] SEO: meta tags, sitemap.xml, Open Graph preview
- [ ] Lighthouse score > 90 for Performance

### Accessibility
- [ ] WCAG AA color contrast on all text
- [ ] `prefers-reduced-motion` respected (static fallbacks for animations)
- [ ] Screen reader: ARIA labels on interactive elements
- [ ] Skip navigation link for keyboard users

---

## What's NOT in MVP (Phase 2+)

| Feature | Phase |
|---|---|
| Proper 3D models (Three.js + custom models) | Phase 2 |
| "Walk Through" first-person mode | Phase 2 |
| "Decode the Temple" quiz game | Phase 2 |
| "Fun Facts" badges for kids | Phase 2 |
| Ambient soundscapes | Phase 2 |
| "Original Colors" toggle | Phase 2 |
| More than 5 temples | Phase 2 |
| Odia language support | Phase 2 |
| Field Guide / PWA mode | Phase 3 |
| User notebook / bookmarks | Phase 3 |
| Google AdSense integration | After SEO ranking established |
| Custom domain setup | After MVP is validated |

---

## Estimated Deliverables

| Item | Count |
|---|---|
| HTML pages | 13 |
| JavaScript files | 6 |
| CSS file | 1 |
| JSON data files | 4 |
| AI-generated illustrations | ~15–20 (hero, temples, diagrams) |
| SVG diagrams | ~5–8 |
| Total | A complete, deployable static website |

---

> **Ready to build?** Once you approve this plan, I'll start with the landing page and design system, then work through each page systematically.
