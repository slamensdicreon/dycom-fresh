# Dycom — Final Design Direction

## Project brief for the team building the new dycomind.com

Prepared by Icreon (Chief Experience Officer's office), November 6, 2026.

This brief accompanies the packaged Final Design Direction: the approved homepage, global navigation, Investors overview page and Design System for the new dycomind.com. It describes Dycom, the story the homepage tells and why, what Dycom's own documents taught us, the rules the build must keep, and what is still open. It does not retell how the design was arrived at; the direction in this package is the one Dycom's leadership chose, and it is the only one that should be built.

**Contents**

1. What is being built
2. About Dycom — what matters for the site
3. What we learned from Dycom's documents
4. The homepage narrative, chapter by chapter
5. Navigation, footer and the Investors page
6. Brand and product rules in force
7. Data and content behind the prototype — what is real, what is placeholder
8. Open items for Dycom
9. What is in this package and how to run it

---

## 1. What is being built

Dycom is replatforming dycomind.com onto SitecoreAI as a shared digital experience platform — design system, content model, component library, integration layer, analytics and multi-brand governance — that its operating-company sites will later inherit. The strategy names a corporate launch of February 1, 2027 and the first operating-company launches on May 30, 2027.

The Final Design Direction covers the first slice of that site:

- **The homepage**, with ten chapters that move a visitor from "who is Dycom" to "find the company near me" to "let's get to work".
- **The global navigation** — six mega-menu groups (Who we are · What we do · Our companies · People & careers · Resource Center · Investors), the phone menu and the footer — which is the *future-state sitemap*: every page of the current site placed once, under the group a visitor would look for it in.
- **The Investors overview page**, the template for interior pages.
- **The roles drawer** and the **company map with its directory and company card**, the two interactions every careers and "near me" action leads to.
- **The Design System** that documents all of it with live, rendered examples: foundations (colour, type, shape, spacing, the signal mark, imagery, motion), components, patterns, templates and the site plan.

Everything else in the sitemap — about pages, service pages, careers pages, the Resource Center listing, the Investors sub-pages — is specified in the requirements document in `reference/` but not built. In the prototype those links open a short "This page is currently unavailable" notice.

---

## 2. About Dycom — what matters for the site

**The company.** Dycom Industries, Inc. (NYSE: DY), incorporated in 1969 and headquartered in Palm Beach Gardens, Florida, is a U.S. specialty contractor that engineers, builds, locates and maintains telecommunications and digital infrastructure. It works through a federated portfolio of roughly forty independently branded operating companies, more than 20,000 employees and hundreds of field offices across all fifty states. Its stated purpose is *to connect America*; its tagline is *The People Connecting America®*; its values are People, Safety, Integrity, Innovation, Customer Focus and Sustainability.

**The lines of work.** Dycom describes what it builds as wireline construction, wireless construction, electrical contracting and engineering — the four lines the homepage now names. Beneath them sit the seven service lines the current site lists: engineering, utility locating, wireline construction, wireless construction, fulfillment (in-home and drop installation), maintenance and restoration, and project management. Dycom speaks of serving customers *across the full project lifecycle*, from design and permitting through construction to maintenance and emergency restoration.

**How Dycom works.** Two programmes recur in everything Dycom publishes and both belong in the site's vocabulary: **Headway®**, the safety management system (job-task safety assessment before work starts, training and mentoring, hazard recognition, stop-work authority without reprisal), and **Rightway™**, the quality management system (planning, controls, training, review, continuous improvement). Sustainability is framed as three pillars — Safety, People, Environment — underpinned by governance, risk management and ethical business practice.

**The core tension the site has to resolve.** Dycom is one public company with one investor story, but candidates are hired by — and customers contract with — dozens of local operating companies with their own names, logos and territories. The site has to make national scale a source of trust while keeping the local company visible and credited. The phrase Dycom itself chose for this, and the homepage headline, is **"Scale is Local."**

**Business needs the site serves** (from Dycom's Digital Experience Strategy): fill hundreds of open, mostly field and skilled-trade roles faster; present one brand-consistent front door through to the application hand-off; connect operating-company identity and footprint to job search; establish a platform foundation the remaining operating companies can inherit; let marketing publish and govern without IT; communicate the growth story; retire the legacy WordPress estate.

**Experience goals** (same source): find where I fit · search like a job seeker · decide with confidence (consistent job facts: pay, schedule, travel, physical requirements, benefits, employer) · apply from a phone · never hit a dead end · trust at a glance · consistent everywhere.

**Audiences.** The strategy defines thirteen user types. The corporate site serves directly: entry-level field candidates, skilled-trade candidates, engineering and design candidates, project and operations professionals, corporate professionals, students and early-career candidates, veterans, current employees, customers and prospects, investors and analysts, suppliers and subcontractors, community members, and content authors. The homepage routes the four largest intents in one band — Career Seekers, Customers, Investors, Communities — and the closing form asks "What brings you here?" with the same four answers.

**Brand.** Dycom's brand guidelines (2026) give the site its palette and type: **Civic Blue** `#041054` leads; **Signal Green** `#00B609` is the single accent; **San Joaquin Gray** `#354846` is body text; **Fargo Gray** `#C1C6C8` is rules and borders; **Paper** `#F4F5F7` and white are backgrounds; **Spenser Blue** `#2F96D1` is reserved for the Pathways brand. Headlines are **Fjalla One**, all caps; everything else is **Geist**. The **signal mark** — the stepped quarter-arc "D" — is the brand's one permitted curve; everything else is square. A 2026 brand launch film and a 48-frame photography library of real Dycom crews, materials, networks and places were produced alongside the guidelines, and both are used on the site.

---

## 3. What we learned from Dycom's documents

Dycom supplied the following during discovery and review. Each shaped the direction in a specific way; the detail lives in the documents themselves (copied into `reference/sources/`).

| Document | What it told us | How it shaped the design |
| --- | --- | --- |
| **Digital Experience Strategy and Functional Requirements** | The platform ambition (SitecoreAI, multi-brand), the launch dates, the business needs, the seven experience goals, the thirteen user types, and the scale-versus-local tension. | The homepage leads with the company and the work, not with a job board; the four-intent pathway band and the four-intent closing form; the roles drawer as the single careers action; the company map as the way to make "local" concrete. |
| **Corporate Website requirements** (NAV, ABT, SVC, MAP, RES, FRM) | Numbered requirements with MVP / post-MVP priority: a primary-navigation Resource Center with a searchable listing; company facts from one managed source; shared promotional blocks authored once; a company map with ZIP/city search, list fallback and a pre-filtered mode for operating-company sites; inquiry forms by audience. | Resource Center became the sixth navigation group and a footer column; the facts band reads from one list; the map carries city / state / ZIP search with distance ranking, "Use my location" and a directory that stands in for the map on phones. |
| **Website Content Audit** (28 pages of the current site) | The same corporate block ("Connection with Intention") repeated on most pages; company facts that conflict page to page (20,000 vs 21,000 employees; "approximately 40" vs "41" companies); operating companies named on one page only and disconnected from careers; the handbook in a third-party embed; a recruitment-process page that is a fraud warning rather than a process. | Every current page was placed once in the future-state sitemap; the operating companies are a homepage chapter with the careers action inside each company card; facts are stated once; the content migration matrix in the requirements says which pages migrate, restructure, come from systems or are new. |
| **SuccessFactors recruiting feed assessment** (XML feed vs API) | Which job facts the feed provides as structured fields today and which are buried in free-text descriptions. | The roles drawer's filters — work, location, trade, company — were limited to facts a feed can supply; roles in the prototype are sample data in code and are labelled "open roles" in the interface, never as a live service. |
| **Custom Components and Configuration** (24 components the platform must provide) | The client's own component inventory for Sitecore. | The component gap list in the requirements document maps each of the 24 to a built Design System component or names it as a gap to design. |
| **Brand Guidelines** | Colour values, type faces, the signal mark and its rules, photographic direction. | The whole visual system — and the correction of earlier prototypes that had used off-brand greens, italics, rounded shapes and the mark as an arrow. |
| **Brand launch film and photography library** (October 2026 shoot, 48 frames) | Real Dycom people and places, graded to the brand. | The hero's silent looping film, the "Our people at work" film chapter, and every photograph on the site. Nothing is stock. |
| **Homepage content template v0.1** (November 2026) | Dycom's own copy for the homepage: hero, pathways, Who we are, the facts, the companies introduction, the four strengths cards, the lifecycle stages, the form. | Applied word for word where supplied; where the template left a blank (brand statement, SEO fields) the prototype carries a stated placeholder, listed in §8. |
| **Two rounds of positioned review comments** (October and November 2026) | Structural preferences and rejections from Dycom's marketing lead and reviewers. | The chapters that are on the page, their order, the "What we build" block beside Who we are, the four lines of work, the company logos on the company card, proximity search on the map, and the chapters held back for now (§8). |

Three further lessons were not in any single document but came from working with all of them:

- **Dycom's facts need an owner.** The audit, the current site, the content template and the investor materials disagree on employee and company counts. The prototype uses *20,000+ employees · ~40 operating companies · 50 states · NYSE: DY* and the requirements ask for a single managed source. The build should not hard-code these anywhere.
- **The operating companies are the product.** Everything a visitor wants — a job, a crew, a contact — is delivered by an operating company. The map, directory and company card are therefore the centre of the homepage, and the company card leads with the operating company's own logo.
- **Only outward-facing copy belongs on the page.** No "sample", "prototype" or requirement language is visible anywhere; provenance lives in code comments and in documents like this one.

---

## 4. The homepage narrative, chapter by chapter

The homepage is one continuous argument: *Dycom is the people connecting America; its strength is that it is local everywhere; here is the company near you; here is how the work is done; tell us what you need.* Each chapter below names its job, its copy as built, and the interaction it carries. Copy marked **(Dycom)** is from Dycom's content template; the rest was written by Icreon from Dycom's published material and is open to Dycom's edit.

### 4.1 Header

Sticky and white. Logo left; the six groups centre-right; a bare globe for the language switch (English / Español, visual only in the prototype); the **Find a job** primary action, which opens the roles drawer. Each group opens a mega panel: an introduction and the group's overview link on the left, two to four titled link columns on the right. On the homepage the overview link doubles as the jump to the group's chapter.

### 4.2 Hero — "Scale is Local"

A full-bleed silent film loop of Dycom crews (poster image for reduced motion and slow connections), the eyebrow **Digital infrastructure leader**, the H1 **Scale is Local** with "Local" in Signal Green, and the sentence **"Dycom combines local expertise, national capability, and the skilled people to deliver critical infrastructure America depends on."** (Dycom). Two actions: **Explore our companies** and **Who we are**. The hero states the thesis; it is not a job search.

### 4.3 Pathways — four intents

A Civic Blue band with four tiles in Dycom's wording (Dycom): **Career Seekers** — Explore career opportunities across our family of companies · **Customers** — Learn more about our solutions and services · **Investors** — Find the latest news, reports and events · **Communities** — See how we're supporting locally and nationally. Career Seekers opens the roles drawer; Customers jumps to What we build; Investors goes to the Investors page; Communities jumps to the closing form.

### 4.4 Who we are · What we build

A light chapter in two columns.

Left — **Who we are** / **The people connecting America.** / "Dycom delivers solutions that build, connect, power, and sustain the digital and critical infrastructure that connects America and its essential industries, for today and tomorrow. Our scale is local: we combine national reach and resources with the regional knowledge and expertise of our 40 operating companies to partner with our customers and execute complex work across the full project lifecycle." (Dycom)

Right — **What we build** / **Our work keeps America connected.** / "From the smallest town to the largest city, Dycom companies deliver for the telecommunications, utility industries and critical infrastructure." followed by the four lines of work on green rules: **Wireline construction · Wireless construction · Electrical contracting · Engineering**. Dycom asked for the work to be at the top of the page and for the lines to carry titles only.

Beneath both, the **facts band** over a crew photograph: **50 states** National coverage · **20,000+** Skilled employees · **~40** Operating companies · **NYSE: DY** New York Stock Exchange.

### 4.5 Our people at work — the brand film

The 2026 brand launch film in its own band, led by its poster frame with the eyebrow **Our people at work** and the caption **"The people and work behind America's infrastructure."** It plays in place, muted until the visitor turns sound on; nothing autoplays with sound. This is the film's only home on the page.

### 4.6 Our companies — the map and directory

The centre of the page, on Civic Blue. **Scale is local. Capability is national.** / "Dycom's family of companies have over 500 field offices across the U.S. Select a location below to learn more about area operating companies." (Dycom)

- A halftone atlas of the United States with a plain square marker on each operating company's home office. The map never moves on its own; hovering a marker or a directory row reveals the company; clicking opens the **company card**.
- A search box — **city, state, ZIP or company** — beside the map. A place that is not itself an office ranks the directory by distance ("nearest to Houston, TX first", with miles per row), draws a dashed origin ring, and zooms the same drawing to frame the origin and its five nearest offices; **Whole country** resets. **Use my location** does the same from the browser's location. On phones the map is not rendered and the ranked directory alone carries the chapter.
- The **company card** leads with the operating company's own logo, then name, home office, website and careers links (the only links on the site that leave it, marked ↗), and **View open roles**, which opens the roles drawer filtered to that company.

### 4.7 The four strengths

Four photo cards on a white band (no heading of their own), headlines and copy as supplied (Dycom), each with an outline button to a future-state page: **Scale is Local** (→ Operating Strengths) · **Built to Deliver** (→ Our Capabilities) · **Where Skill Meets Scale** (→ Careers) · **Shaping What's Next** (→ Resource Center).

### 4.8 Brand statement

One sentence set large on Civic Blue, with the signal mark above it: **"We work in partnership with customers across the full project lifecycle, advantaged by a highly skilled workforce operating in all 50 states."** Dycom's template left the statement blank; this sentence is taken from Dycom's own company description and stands until Dycom supplies the statement.

### 4.9 Expertise for the entire lifecycle

**Expertise for the entire lifecycle** / "Dycom provides the scale to manage your entire infrastructure lifecycle and the agility to deploy specialized services at any stage…" (Dycom). Five stages as a process route — **Design & engineering · Locate & prepare · Build & connect · Maintain & restore · Maintain & respond** — each with a photograph, a paragraph and the services involved. All panels stay mounted so the block never changes height when the stage changes; on phones the route becomes an accordion.

### 4.10 Let's get to work — the closing form

**Let's get to work.** / **What brings you here?** A square toggle of four intents — Customer or project, Careers, Supplier, Community — and an inquiry form for the chosen one: name and email, then the intent's own fields (project location and type of work; trade and location; what you supply and region; location of the work and topic). The Careers intent opens the roles drawer instead of sending. If a company was selected on the map, the Customer prompt names it. The prototype does not send anything; the confirmation state is designed.

### 4.11 Footer

Civic Blue. The approved Dycom logo (reversed: green mark, white wordmark) with the line **"Behind the work that connects America."**; six columns mirroring the navigation groups in header order; a utility row with the © year, Privacy policy, Terms of use and a **Motion** control that turns all non-essential motion off for the whole site.

### Chapters built but held back

Four chapters exist in the code and the Design System but are not shown on the homepage at Dycom's request, pending the interior pages that will carry their content: the **What we do** capability tabs (Plan & design / Build & connect / Maintain & protect), **How we work** (Headway® and Rightway™), **People & careers** (the trades explainer and "Find your kind of work"), the **Investors** band and the **Resource Center** index. A photographic **What we build** band also exists; Dycom asked for the work to live beside Who we are instead. All are one-line switches in `src/v2/presentation.ts`.

---

## 5. Navigation, footer and the Investors page

**The sitemap is the future state, not the current one.** Header, phone menu and footer link only to pages of the new site; nothing links to the current dycomind.com, its investor-relations host or its careers portal. The six groups and their pages are listed in the Design System's *Site plan* page and in the requirements document; the source of truth in code is `src/v2/site.ts`. The Resource Center group re-lists documents filed elsewhere (corporate reports, safety and employee documents, supplier terms) because the requirements ask for one searchable document index.

**The Investors page** is the interior-page template: a Civic hero with the listing block and Dycom's investor overview sentence; an in-page index; numbered sections for the latest quarter (fiscal 2027 second quarter, ended August 1, 2026, published August 26, 2026 — contract revenues, net income and diluted earnings per share from the results release), featured reports, events and presentations, investor news, governance and shareholder resources; and a closing band for email alerts and Investor Relations contact. It is a static snapshot of the official investor hub as rechecked on October 19, 2026 — no quotes or live market data — and every document card links to an internal page rather than the IR host, in keeping with the no-outward-links rule.

---

## 6. Brand and product rules in force

These are the rules Dycom confirmed during review. They are also written into the Design System; this is the short list.

**Brand**

- Civic Blue leads; Signal Green is the only accent (highlight word, focus rings, active bars, the map pulse, chapter labels) and never a section fill — aim for under 10% of any viewport. No other greens, no browns, no coloured shadows.
- Square by rule: no circles, dots, pills or rounded corners on cards, images, buttons, inputs, dialogs, drawers, tabs or markers. The signal mark is the only curve.
- The signal mark is a motif, never an arrow, caret or dropdown indicator. Menus and selects use a plain chevron. The map carries no signal marks; office markers are plain squares with a square green "location pulse".
- Fjalla One for H1 and H2, all caps; Geist for everything else (Medium on Civic Blue); no italics; nothing below 13px; body 17px desktop / 16px mobile.
- One square button in three fills (Civic, outline, inverse), 48–52px tall. `→` for in-page jumps and site pages, `↗` only when leaving the site; no arrows in navigation or footer lists.
- Highlight bars draw in over about 0.4s and retract the same way; reduced-motion and the footer Motion control remove all of it.
- Real Dycom photography only, square-cornered; the hero film is silent.

**Product**

- No outward links except operating-company websites and careers pages in the company card.
- Navigation is the future-state sitemap; in-page jumps exist only inside the homepage body.
- Every careers action opens the roles drawer (work, location, trade, company filters). Roles are sample data in code; the interface says "open roles".
- Tab and process panels never change height when the selection changes.
- No internal commentary in visitor copy: no disclaimers, requirement IDs or "sample" labels.
- Company facts and shared promotional blocks come from one managed source each.
- No map below 768px; the directory carries the chapter. The map never pans or zooms on its own; proximity zoom happens only in response to a search or "Use my location".
- Shared offices are never called out (no counts or "shares this location" lists).
- "telecommunications", never "telecom", in body copy; no eyebrows above H2s except in the three chapters that change voice (hero, Who we are, the film).
- Breakpoints ≥1280 desktop · 768–1279 tablet · ≤767 mobile; Dycom reviews at 1440 and 390.
- 44×44 touch targets, visible Signal Green focus, full keyboard operation of tabs, dialogs and drawers with focus trap and return, AA contrast, nothing conveyed by colour alone.

---

## 7. Data and content behind the prototype — what is real, what is placeholder

| On the site | In the prototype | In the build |
| --- | --- | --- |
| Operating companies, home offices, coordinates, websites, careers links | Dycom's official company directory as published in autumn 2026 — 39 companies with home offices; one company (Texstar Enterprises) is held back at Dycom's request pending a legal question | A managed company list owned by Dycom; the pre-filtered map for operating-company sites comes from the same list |
| Company logos | Each company's own website header logo, harvested November 5, 2026, trimmed and sized; one company has none and shows the signal mark | Logos supplied and governed by Dycom; the card must keep working without one |
| Open roles | Sample roles in code (`src/v2/jobs.ts`), including twelve corporate roles under "Dycom Industries (corporate)", which appears only in the roles drawer and never on the map | The SuccessFactors feed or API; filter only on fields the feed provides |
| Company facts | Static: 50 states · 20,000+ · ~40 · NYSE: DY | One managed source |
| Photography and film | 48 web renditions (2000px and 1000px WebP) and the brand film, included in `site/media/` and the brand package | A media library; the catalogue (`photos.ts`) names every frame and its alt text |
| Investors figures | Static snapshot of the fiscal 2027 Q2 release and the IR hub, October 19, 2026 | Investor Relations provider feed, subject to the outward-link decision in §8 |
| Inquiry form | Designed states; no submission | Sitecore forms or the CRM Dycom chooses, routed by intent |
| Language switch | Visual only | Translation belongs to the platform |
| Future-state pages | "This page is currently unavailable" notice | Built to the templates in the requirements |

---

## 8. Open items for Dycom

Each has a stated default in the prototype; none is settled.

1. **Brand statement copy** — the band carries a sentence from Dycom's company description until the statement arrives.
2. **SEO fields** — page title "Home | Dycom"; description, keywords and OG image to be supplied.
3. **Texstar Enterprises** — held back from the map, directory and roles at Dycom's request ("remove for now, legal"); confirm whether this covers the company entirely and for how long.
4. **Employee count wording** — "20,000+" is used; Dycom's review asked for "20K"; confirm the canonical figure and owner of all company facts.
5. **Lifecycle stages 4 and 5** — "Maintain & restore" sits beside "Maintain & respond" and stage 4's description still describes testing after construction; rename or merge.
6. **"Over 500 field offices"** — the copy says field offices; the map plots home offices (39). Supply field-office locations if the map should match, or confirm the wording.
7. **Operating Strengths and Our Capabilities** — new pages added to the sitemap as destinations of the strengths cards; confirm.
8. **"Scale is Local"** appears in the hero, the first strengths card, the map heading and the Our companies menu — intentional?
9. **Electrical contracting** is now a line of work on the homepage; should it join the What we do tabs and the services menu, and is there a Building Systems taxonomy to follow?
10. **Held-back chapters** (§4, "Chapters built but held back") — confirm which return with the interior pages.
11. **Investor content** — the strategy asks for an IR-provider feed with links to the IR microsite; the no-outward-links rule conflicts. Dycom and Investor Relations to decide.
12. **Form profile labels** — Careers / Community were left as they were; say if they should follow the pathway names (Career Seekers / Communities).
13. **Earlier design decisions still formally open** — button shape (square), arrow meaning, hero media (film with still variant), casing below H1, map interaction depth, proportion of green, whether capability tiles link to the companies doing that work, trade explainer links, and the Resource Center wording. The prototype's choice for each is the one shown.

---

## 9. What is in this package and how to run it

```
Dycom-Final-Design-Direction/
├── README.md                         start here
├── brief/                            this document (Markdown and PDF)
├── site/                             the built site — open it in a browser
│   ├── index.html, assets/           homepage at /, Investors at /investors/, Design System at /design-system/
│   ├── media/                        photography renditions and company logos
│   └── serve.mjs                     zero-dependency static server (node serve.mjs)
├── screenshots/                      full-page captures at 1440 and 390
├── source/                           the source code (pnpm workspace)
│   ├── artifacts/dycom-concept-05/   the site: src/v2/ (Final Design Direction), src/design-system/
│   ├── lib/dycom-brand/              brand package: styles, fonts, films, logos, photo catalogue, router, shared sections
│   ├── lib/dycom-network-map/        company directory, geometry, sample roles, proximity gazetteer, logo catalogue
│   └── lib/review-access-react/      the review gate (not rendered in the standalone build)
└── reference/                        requirements, specification, content record and Dycom's source documents
```

**To view the site:** `cd site && node serve.mjs` (Node 18 or later), then open `http://localhost:8080/`. Any static server that falls back to `index.html` for unknown paths works. The site is a single-page application; opening `index.html` directly from the file system will not work because browsers block module scripts over `file://`.

**To run from source:** see `source/README.md`. In short: `pnpm install`, then `PORT=5173 BASE_PATH=/ VITE_DYCOM_STANDALONE=1 VITE_DYCOM_MEDIA_BASE=/media/ pnpm --filter @workspace/dycom-concept-05 dev` after copying `site/media` into `source/artifacts/dycom-concept-05/public/media`. The same variables with `vite build` reproduce `site/`.

**Where things live in the code** (all under `source/artifacts/dycom-concept-05/src/v2/` unless noted):

| Piece | File |
| --- | --- |
| Chapter order and held-back chapters | `Home.tsx`, `presentation.ts` |
| Homepage copy, facts, strengths, lifecycle stages, form intents | `content.ts` |
| Future-state sitemap, menu groups, footer columns | `site.ts` |
| Hero, header, chapters, footer | `components/Hero.tsx`, `components/SiteHeader.tsx`, `components/sections.tsx` |
| Company map, directory, search, company card | `components/CompanyNetwork.tsx`; data in `lib/dycom-network-map/src/` (`companies.ts`, `presentation.ts` for held-back companies, `proximity.ts`, `logos.ts`) |
| Roles drawer and sample roles | `components/RolesDrawer.tsx`, `jobs.ts` |
| Investors page | `Investors.tsx`, `investors.ts` |
| Photography catalogue | `photos.ts` (mirrors `lib/dycom-brand/src/photos.ts`) |
| Styles | `_group.css`, `ConsolidatedV2.css`, `investors-v2.css`; shared tokens in `lib/dycom-brand/src/styles/brand.css` |
| Design System | `../design-system/` (pages, live examples, site plan) |
