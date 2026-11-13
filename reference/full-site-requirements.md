# 01 — Full-site requirements for the new dycomind.com

Prepared October 23, 2026. Citations resolve inside `sources/` (see `README.md` for the key: *NAV0001*–*FRM0012* Corporate Website requirements; *CC-n* Custom Components list; *Strategy*; *Audit*; *SF* SuccessFactors assessment; *Spec* the Consolidated-direction specification). Paths of built pieces are relative to the packaged prototypes.

## Headline numbers

| | Count | Notes |
| --- | --- | --- |
| **Pages** | **66 page types** → **104 fixed URLs** plus one job-detail page per open requisition | 50 pages of the committed future-state sitemap (including the homepage) + 16 pages the strategy and requirements add (the Resource Center index, `resources/`, was added to the Consolidated V2 navigation from review feedback on Oct 28, 2026; Operating strengths and Our capabilities were added from Dycom's homepage content v0.1 on November 3, 2026). The 103 counts the 39 operating-company profiles individually. |
| **Templates** | **18** — 2 built, 16 to design | Built: Homepage, Investors overview (the interior-page template). |
| **Components** | **13 component families + 2 patterns built; 38 to design**, of which 19 extend a built component and 19 are new | Built list in §3.1; gap list in §3.2. |
| **Content** | Migrate as-is **8** · migrate and restructure **31** · pulled from systems **13** · net-new **12 page types + 39 company profiles** | By page; the non-page content items (shared blocks, facts, testimonials, timeline, notices) are listed in §4.5. |
| **Blocking dependencies** | 6 data dependencies, 7 open decisions that block pages | §5. |

Priority uses the Corporate Website requirements' MVP / Post MVP column wherever a requirement exists. Pages the strategy calls for that have no numbered requirement yet are marked **MVP\*** ("named by the strategy; priority to be confirmed in the requirements register"). No careers-section requirements document was among the inputs; job search and job detail rows cite the strategy's experience goals and the SuccessFactors assessment.

---

## 1. Page inventory

Template codes are defined in §2. "Current-site source" is the dycomind.com URL the audit recorded (or the investor-relations host for Investors pages); "new" means no page exists today. Disposition: **as-is** (migrate without restructuring), **restructure** (migrate into the new template and shared sources), **feed** (content comes from a system, not copied), **new** (to be written or sourced).

### 1.1 Homepage

| Path | Template | Current-site source | Disposition | Data source | Priority | Requirements |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | T01 Homepage (built) | `/` | new — built | CMS (chapters), company facts, company data, job feed (count), investor feed (latest items) | MVP | NAV0001–NAV0009, ABT0005, ABT0006 (segments copy in Who we are), MAP0002–MAP0004, *Spec* §4–5 |

### 1.2 Who we are

| Path | Template | Current-site source | Disposition | Data source | Priority | Requirements |
| --- | --- | --- | --- | --- | --- | --- |
| `who-we-are/` | T03 Section landing | `/about-us/` | restructure | CMS, company facts, shared blocks | MVP | ABT0001, ABT0005, ABT0006, NAV0006 |
| `who-we-are/operating-strengths/` | T04 Corporate topic | new | new — Dycom (destination of the homepage's "Scale is Local" card, content v0.1) | CMS | MVP | *Content v0.1* four-card column; D17 |
| `who-we-are/values/` | T04 Corporate topic | `/about-us/` (vision, mission, values) and `/life/` (values repeated) | restructure — one source for values | CMS | MVP | ABT0001, *Audit* §5, §7 |
| `who-we-are/leadership/` | T17 People grid | investor-relations host, executive officers | restructure | CMS people items | MVP | ABT0001 (leadership optional) |
| `who-we-are/business-segments/` | T04 Corporate topic | new | new — Dycom | CMS | MVP | ABT0006, *Strategy* user types 4–5 (may be delivered as a section of `who-we-are/` if Dycom prefers; see D-BS in §5) |
| `sustainability/` | T04 Corporate topic | `/sustainability/` | restructure (four pillars) | CMS + report document | MVP | ABT0004, RES0004 |
| `news/` | T11 Resource listing | investor-relations host, news releases | feed | IR provider feed / CMS | MVP | RES0001, RES0003 |
| `news/{slug}` | T12 Article / news detail | new (releases open on the IR host today) | feed | IR provider feed | MVP | RES0003; D-IR in §5 |
| `how-we-work/safety/` | T04 Corporate topic | `/about-us/safety/` | restructure (accordions + in-page anchors) | CMS | MVP | ABT0003, *Audit* §14 (highest-depth page) |
| `how-we-work/quality/` | T04 Corporate topic | `/about-us/quality/` | restructure | CMS | MVP | *Spec* §4.2 |
| `how-we-work/hazard-recognition/` | T13 Document library | `/hazard-recognition/` | as-is (English and Spanish documents) | DAM | MVP | RES0004–RES0006 |
| `contact/` | T15 Contact & forms | `/contact-us/` | restructure (inquiry-type selector with routing) | Sitecore Forms | MVP | FRM0001–FRM0009, FRM0012; FRM0010 Post MVP |

### 1.3 What we do

| Path | Template | Current-site source | Disposition | Data source | Priority | Requirements |
| --- | --- | --- | --- | --- | --- | --- |
| `what-we-do/` | T03 Section landing | `/what-we-do/` | restructure | CMS services | MVP | SVC0001 |
| `what-we-do/capabilities/` | T04 Corporate topic | new | new — Dycom (destination of the homepage's "Built to Deliver" card, content v0.1) | CMS | MVP | *Content v0.1* four-card column; D17 |
| `what-we-do/engineering/` | T05 Service detail | `/what-we-do/engineering/` | restructure (Office / Field subsections) | CMS, tagged companies, job counts | MVP | SVC0002–SVC0004 |
| `what-we-do/project-management/` | T05 Service detail | `/what-we-do/project-management/` | restructure (thin today; optional sections off) | same | MVP | SVC0002–SVC0004 |
| `what-we-do/wireline-construction/` | T05 Service detail | `/what-we-do/wireline-construction/` | restructure (Fiber, Underground, Aerial, Splicing, Inside Plant; video) | same | MVP | SVC0002–SVC0004 |
| `what-we-do/wireless-construction/` | T05 Service detail | `/what-we-do/wireless-construction/` | restructure (turnkey, site builds, small cell, …) | same | MVP | SVC0002–SVC0004 |
| `what-we-do/fulfillment/` | T05 Service detail | `/what-we-do/fulfillment/` | restructure (video) | same | MVP | SVC0002–SVC0004 |
| `what-we-do/locating/` | T05 Service detail | `/what-we-do/locating/` | restructure (video) | same | MVP | SVC0002–SVC0004 |
| `what-we-do/maintenance-restoration/` | T05 Service detail | `/what-we-do/maintenance-restoration/` | restructure | same | MVP | SVC0002–SVC0004 |
| Building Systems service pages | T05 Service detail | new | new — Dycom | CMS | Pending ("Need Discussion") | SVC0005 |

### 1.4 Our companies

| Path | Template | Current-site source | Disposition | Data source | Priority | Requirements |
| --- | --- | --- | --- | --- | --- | --- |
| `companies/` | T06 Company directory | `/about-us/companies/`; `/subsidiaries/` retired | restructure + feed | Company data (structured items) | MVP (list-view toggle Post MVP) | MAP0001–MAP0005, MAP0007, MAP0008; MAP0006 Post MVP; *Spec* MAP, D12 |
| `companies/{slug}` × 39 | T07 Company profile | new | new — Dycom per company | Company data, job feed (by facility/brand), map pre-filtered | MVP | MAP0001, MAP0007, MAP0009, SVC0003 |
| `suppliers/inventory-terms-of-purchase/` | T16 Legal / long-form | `/inventory-terms-of-purchase/` | as-is | CMS rich text | MVP | *Strategy* user type 11 |
| `suppliers/fleet-terms-of-purchase/` | T16 Legal / long-form | `/fleet-terms-of-purchase/` | as-is | CMS rich text | MVP | *Strategy* user type 11 |
| `suppliers/subcontractor-request/` | T15 Contact & forms | new | new — form | Sitecore Forms | MVP | FRM0011, FRM0002–FRM0003 |

### 1.5 People & careers

| Path | Template | Current-site source | Disposition | Data source | Priority | Requirements |
| --- | --- | --- | --- | --- | --- | --- |
| `careers/` | T08 Careers landing | `/careers-home/` | restructure | CMS, job feed (counts), video component | MVP\* | *Strategy* goals; CC-6, CC-13 |
| `careers/opportunities/` | T09 Job search | external SAP-branded job portal | feed | SuccessFactors feed | MVP\* | *Strategy* "search like a job seeker", "never hit a dead end"; *SF* §6, §8 |
| `careers/opportunities/{id}` | T10 Job detail | external SAP-branded job portal | feed | SuccessFactors feed; apply hand-off to SAP | MVP\* | *Strategy* "decide with confidence", "apply from a phone"; *SF* §7, §13 |
| `careers/trades/` | T04 Corporate topic | new (from the homepage trades chapter) | new — Icreon draft, Dycom to confirm | CMS | MVP\* | *Strategy* user type 2; D9 |
| `careers/why-dycom/` | T04 Corporate topic | new | new — Dycom | CMS, company facts, testimonials | MVP\* | *Strategy* user types 4–5 |
| `careers/students-early-careers/` | T04 Corporate topic | `/life/` (early-career section) | restructure + new | CMS, job feed (filtered) | MVP\* | *Strategy* user type 6 |
| `careers/veterans/` | T04 Corporate topic | new | new — Dycom | CMS, job feed (filtered), job alerts | MVP\* | *Strategy* user type 7 ("net-new") |
| `careers/recruitment-process/` | T04 Corporate topic | `/our-recruitment-process/` | restructure — keep the fraud guidance, add the actual process | CMS | MVP\* | *Strategy* "trust at a glance"; *Audit* §4 observation |
| `careers/life/` | T04 Corporate topic | `/life/` | restructure (assets hosted on a third-party domain today) | CMS, video component | MVP\* | CC-6 (video component lives here), *Audit* §11 |
| `careers/benefits/` | T04 Corporate topic | `/benefits/` | restructure (categories → in-page slider or accordion) | CMS | MVP\* | CC-13, *Audit* §4 |
| `careers/talent-network/` | T15 Contact & forms | external talent-network sign-up | new — form | Sitecore Forms → recruiting system | MVP\* | *Strategy* "never hit a dead end" |
| `careers/employee-handbook/` | T13 Document library | `/handbook/` (third-party embed) | as-is, as a document rather than an embed | DAM | MVP | RES0004–RES0006 |
| `careers/benefit-plan-disclosures/` | T13 Document library | `/benefit-plan-disclosures/` | as-is | DAM / external compliance documents | MVP | RES0004 |

### 1.6 Investors

The Investors overview is built. Everything below it is content the investor-relations provider holds today; the no-outward-links rule means it must be rendered on-site from a feed or exported snapshot (open decision D-IR, §5).

| Path | Template | Current-site source | Disposition | Data source | Priority | Requirements |
| --- | --- | --- | --- | --- | --- | --- |
| `investors/` | T02 Investors overview (built) | IR hub | restructure — built | IR feed (latest quarter, events, news) | MVP | *Spec* §5.11 IRP-F1–F4 |
| `investors/quarterly-reports/` | T13 Document library | IR hub | feed | IR feed / DAM | MVP | RES0004–RES0005 |
| `investors/annual-reports/` | T13 Document library | IR hub | feed | IR feed / DAM | MVP | RES0004–RES0005; CC-23 ("a more elegant version of this page") |
| `investors/sec-filings/` | T13 Document library (filterable) | IR hub | feed | IR / EDGAR feed | MVP | RES0004 |
| `investors/stock-information/` | T14 Investor content | IR hub, stock quote and historical lookup | feed | IR market-data feed | MVP | *Spec* IRP (no live market widgets on the overview; see D-IR) |
| `investors/governance/` | T14 Investor content | IR hub | restructure | CMS | MVP | — |
| `investors/board-of-directors/` | T17 People grid | IR hub | restructure | CMS people items | MVP | — |
| `investors/board-committees/` | T14 Investor content (data table) | IR hub | restructure | CMS | MVP | — |
| `investors/governance-documents/` | T13 Document library | IR hub | as-is | DAM | MVP | RES0004–RES0005 |
| `investors/news/` | T11 Resource listing | IR hub | feed | IR feed | MVP | RES0001; *Strategy* user type 10 |
| `investors/news/{slug}` | T12 Article / news detail | IR hub | feed | IR feed | MVP | RES0003; D-IR |
| `investors/events-presentations/` | T11 Resource listing (timeline variant) | IR hub | feed | IR feed | MVP | — |
| `investors/analyst-coverage/` | T14 Investor content (data table) | IR hub | restructure / feed | CMS or IR feed | MVP | — |
| `investors/shareholder-services/` | T14 Investor content | IR hub | restructure | CMS | MVP | — |
| `investors/faqs/` | T14 Investor content (accordion) | IR hub | restructure | CMS | MVP | CC-7 |
| `investors/document-request/` | T15 Contact & forms | IR hub | feed / form | Sitecore Forms → IR provider | MVP | FRM0006 |
| `investors/email-alerts/` | T15 Contact & forms | IR hub | feed / form | IR provider alert service | MVP | FRM0006 |
| `investors/contact/` | T15 Contact & forms | IR hub | restructure | Sitecore Forms (Investor inquiry type) | MVP | FRM0001 |

### 1.7 Utility and system pages

| Path | Template | Current-site source | Disposition | Data source | Priority | Requirements |
| --- | --- | --- | --- | --- | --- | --- |
| `privacy-policy/` | T16 Legal / long-form | `/privacy-policy/` | as-is | CMS rich text | MVP | *Audit* §9 |
| `terms-of-use/` | T16 Legal / long-form | `/terms-of-use/` | as-is | CMS rich text | MVP | *Audit* §9 |
| `404` | T18 System page | new | new — Icreon copy | CMS (popular links), search, job search entry | MVP | NAV0012 |
| `search/` | T18 System page | new | new | Site search index (pages, documents, news) | MVP | NAV0010 |
| `resources/` | T11 Resource listing | new | new — index of documents that keep their own pages under other groups (reports, safety and employee materials, purchasing terms, candidate guides) | Document index across groups | MVP | NAV0001, RES0001 |
| `contact/thank-you/` | T18 System page | new | new — Icreon copy | CMS success message | MVP | FRM0006 |
| `investors/email-alerts/thank-you/` | T18 System page | `/thank-you-for-subscribing/` | restructure (drop the repeated investor-link block; use the shared related-content module) | CMS | MVP | *Audit* §10 |
| `investors/preferences-updated/` | T18 System page | `/preferences-updated/` | restructure (same) | CMS | MVP | *Audit* §10 |

Not carried from the current site: `/subsidiaries/` (no purpose; folds into `companies/`), the duplicate `investors/sec-filing/` address. Executive officers sit under Who we are › Leadership so every audience finds them.

---

## 2. Template catalogue

Every interior template inherits the **interior-page frame** proven by the Investors overview: site header · interior hero (back link, all-caps H1, overview paragraph, optional listing or fact block on a Signal Green rule) · optional in-page index · numbered section heads · body sections · closing band · footer. "Required" sections appear on every page using the template; "optional" sections are switched on per page in the CMS.

| Code | Template | Status | Section stack (required → optional) | Pages | Composes (built components in **bold**) |
| --- | --- | --- | --- | --- | --- |
| T01 | Homepage | **Built** (Consolidated V2) | **Hero** (full-bleed film) · **Pathways** · **Who we are** (values + facts band) · **Brand video** (film plays in place) · **Our companies** (map + directory, on Civic Blue) · **What we do** (tabs; accordion on phones) · **Four-card column** (on Civic Blue) · **Brand statement** · **Who we build for** · **Lifecycle** (process route; accordion on phones) · **How we work** · **People & careers** (trades + drawer action) · **Investors** · **Resource Center** · **Closing** (intent toggle + inquiry form) · **Footer** (six columns); optional: alert banner, scheduled pop-up | `/` | All homepage chapters; + alert banner, pop-up |
| T02 | Investors overview | **Built** (Consolidated V2) | Photographic interior hero with listing block · in-page index · results band over photography · document list · report cards with cover slots · timeline · news list · resource columns (Investors group) · photographic closing band | `investors/` | **Interior hero**, **in-page index**, **section heads**, **cards**, **timeline**, **Resource Center**, **closing**, **footer** |
| T03 | Section landing | To design | Interior hero · group intro · child-page tile grid (the mega-menu columns, as tiles) · shared promotional block ("Connection with Intention" source) · optional: facts counters, featured companies / jobs / news, CTA callout | `who-we-are/`, `what-we-do/`, `companies/` (if separated from the directory), `careers/` (see T08) | **Interior hero**, **pathway/tile cards**, counters, 50/50, CTA callout |
| T04 | Corporate topic | To design | Interior hero · optional in-page index · rich-text sections with numbered heads · optional: accordion, icon list, 50/50 media block, quote/testimonial, image gallery, video component, timeline, counters, document list, related content, form (placed right/left/top/bottom), CTA callout | values, business segments, sustainability, safety, quality, trades, why Dycom, students & early careers, veterans, recruitment process, life, benefits (19 pages) | **Interior hero**, **in-page index**, **section heads**, accordion, icon list, 50/50, quotes, gallery, video, **timeline**, counters, document list, related content, forms |
| T05 | Service detail | To design | Interior hero · introduction · capabilities (icons + descriptions) · media (image / video) · operating companies providing this service (tagged list + pre-filtered map) · contact CTA · related careers (job category link + live count); optional: related projects / case studies, trade explainer link | 7 services (+ Building Systems when confirmed) | **Interior hero**, icon list, media block, **company directory** (filtered), **company map** (pre-filtered), CTA callout, **trade rows** + **roles drawer**, related content |
| T06 | Company directory | To design (the chapter is built; the page is not) | Interior hero with summary line · filters (operating company, service line, state) + ZIP/city search · map (interaction per D12) · directory grid with alphabetical sort · list-view fallback when the map cannot load · company card · CTA | `companies/` | **Company map**, **directory**, **company card**, **form controls**, **dialog**; + clustering, nearest-first search, fallback message |
| T07 | Company profile | To design | Profile header (name, logo, aliases, home office, segment, industries, states served, website ↗) · description · service lines (links to T05) · locations (map instance pre-filtered to this company + address list) · open roles at this company (feed) · related companies at the same location · contact this company | 39 operating companies | **Company card** (expanded), **company map** (pre-filtered), **trade rows** / **roles drawer**, cards, forms |
| T08 | Careers landing | To design | Interior hero with job search bar · "where do I fit" guided entry (trades → categories) · filterable video component (Life at Dycom) · benefits slider · why Dycom / testimonials · talent network CTA · recruitment-fraud notice | `careers/` | **Interior hero**, job search bar, **trade rows**, video component, in-page slider, quotes, CTA callout |
| T09 | Job search | To design | Search bar (role + location first) · filters (trade / category, operating company, state, employment type, travel, remote) · result cards (pay-forward where available) · sort · pagination · zero-result recovery (adjacent roles, nearby companies, talent network) · "Looking for the site?" link to site search | `careers/opportunities/` | **Roles drawer** filters as the model, **form controls**, result card, pagination, empty state |
| T10 | Job detail | To design | Title · operating company (name, logo, link to T07) · standard facts block (location, employment type, travel, schedule, pay when available, posted date) · description (from feed) · apply hand-off (SAP) · fraud guidance · similar roles · expired-job state | one per requisition | Facts block, **buttons**, cards, empty/expired state |
| T11 | Resource listing | To design | Interior hero · search bar · filters (content type, topic, service line, operating company, year) · result cards with optional author · pagination; timeline variant for events | `news/`, `investors/news/`, `investors/events-presentations/`, a general Resource Center if Dycom keeps one | **Interior hero**, **cards**, **form controls**, **timeline**, pagination |
| T12 | Article / news detail | To design | Interior hero (date, optional author block) · article body (semantic HTML, Article structured data) · documents · related content · share | `news/{slug}`, `investors/news/{slug}`, Resource Center articles | **Interior hero**, article body, document list, related content |
| T13 | Document library | To design | Interior hero · optional year / type filter · document list (title, file type, size, last updated; PDFs open in a new tab) · optional intro and language variants | hazard recognition, employee handbook, benefit plan disclosures, quarterly reports, annual reports, SEC filings, governance documents (7 pages) | **Interior hero**, document list, **form controls** |
| T14 | Investor content | To design | Interior hero · in-page index · rich-text sections · data table (committees, analyst coverage, stock history) · accordion (FAQs) · document list · contact IR CTA | stock information, governance, board committees, analyst coverage, shareholder services, FAQs (6 pages) | **Interior hero**, **in-page index**, data table, accordion, document list, CTA |
| T15 | Contact & forms | To design | Interior hero · form with inquiry-type selector (fields and routing change per type) · placement variant (right / left / top / bottom of accompanying content) · inline validation · success message or thank-you redirect · spam protection · analytics events | contact, subcontractor request, talent network, document request, email alerts, contact IR (6 pages) | **Form controls**, **buttons**, forms engine, placement variants |
| T16 | Legal / long-form | To design | Interior hero with "last updated" · sticky in-page index of numbered clauses · long rich text · print styles | privacy, terms, inventory terms, fleet terms (4 pages) | **Interior hero**, **in-page index**, rich text |
| T17 | People grid | To design | Interior hero · optional group tabs (executive / board) · people cards (photo, name, title, optional bio dialog) | leadership, board of directors (2 pages) | **Interior hero**, people card, **dialog**, **tabs** |
| T18 | System page | To design | Short heading and message · site search · popular links · job search entry · related-content module (replaces the repeated investor-link block) | 404, search results, three confirmations (5 pages) | **Section heads**, search, **cards**, **buttons** |

---

## 3. Component gap list

### 3.1 Built today (in the Design System)

| Family | What exists | Where documented |
| --- | --- | --- |
| Buttons & actions | Primary / outline / inverse, 50px icon button | `design-system/components/buttons/` |
| Links & arrows | One inline-link style, `→` / `↗` semantics, text link with arrow | `components/links/` |
| Header & navigation | Sticky header, six mega-menus (Resource Center added in V2), overview link that jumps on the homepage, Find a job action, phone sheet with accordions | `components/header/` |
| Hero | Full-bleed film with poster, still variant, stepped signal motif, green eyebrow, highlight word | `components/hero/` |
| Section headers | Heading band, numbered section heads with dated note, interior hero with listing block | `components/section-headers/` |
| Tabs | Fixed-height tab set (three tabs, built for six); accordion on phones | `components/tabs/` |
| Process route | Five-stage route with stage nodes, services involved and previous/next; accordion on phones | `components/process-route/` |
| Cards | Pathway tiles, investor tiles, resource groups, metric tiles, document / report cards, trade rows | `components/cards/` |
| Roles drawer | Right-hand drawer with work / location / trade / company filters | `components/roles-drawer/` |
| Dialog | Square modal with sticky head and focus trap; drawer and nav variants | `components/dialog/` |
| Form controls | Text input, select with plain chevron, labels | `components/forms/` |
| Footer | Five sitemap columns, utility links, Motion control | `components/footer/` |
| Company map | Still atlas, square markers with pulse, searchable directory, company card; five interaction models under *Undecided interactions* | `components/company-map/`, `explorations/company-map/` |
| Pattern: directory + map chapter | Heading band · map + directory · company card · chapter footer | `patterns/directory-map/` |
| Pattern: closing & intents | One H2, intent toggle, routed action, footer | `patterns/closing/` |
| Pattern: brand bands | Brand video band (film plays in place, muted until asked), four-card column on Civic Blue, brand statement band | `patterns/brand-bands/` |

Also built inside the Investors overview and reusable: in-page index with numbered jumps, square-node timeline, dated news list.

### 3.2 To design

"Extends" names the built component the new one grows from; "new" means nothing in the system covers it yet.

| # | Component | Required by | Extends / new | Used by templates |
| --- | --- | --- | --- | --- |
| C01 | Interior page header variants (no listing block; with image; with fact block; with search bar) | SVC0002, ABT0001, T08–T16 | Extends interior hero | T03–T18 |
| C02 | Breadcrumb (CMS on/off) | NAV0011 | New | all interior |
| C03 | Site-wide alert / notification banner (severity, schedule, dismissible, site targeting) | NAV0008, CC-3 | New | T01, all |
| C04 | Scheduled homepage pop-up (frequency capping, page targeting, Escape and × close, focus return) | NAV0009, CC-5 | Extends dialog | T01 |
| C05 | Cookie / consent banner and preferences link | CC-4, NAV0007 | New (consent tooling) | all |
| C06 | Site search: header entry, results list, "Looking for jobs?" cross-link | NAV0010, NAV0012 | Extends form controls | T18, header |
| C07 | Accordion (text, images, buttons inside) | ABT0003, CC-7 | Extends the phone-sheet accordion | T04, T14 |
| C08 | In-page anchor navigation (sticky variant) | ABT0003 | Extends Investors in-page index | T04, T14, T16 |
| C09 | Quotes / callouts with image or video | CC-8 | New | T04, T08 |
| C10 | Testimonials — text and video, embeddable and on a standalone page | CC-6 | New | T04, T08 |
| C11 | Filterable video component (tag and filter; auto-placement by relevance) | CC-2, CC-6 | New | T04 (Life), T08 |
| C12 | Image gallery | CC-9 | New | T04 |
| C13 | Carousel / hero slider | NAV0004, CC-12 | Extends hero (film / still) | T01 (if Dycom opts in) |
| C14 | In-page slider (image / video / text-only slides with title, description, link) | CC-13 | New | T04 (Benefits), T08 |
| C15 | Media–text–link card, horizontally stackable; any image slot accepts video | CC-14 | Extends cards | T03, T04, T11 |
| C16 | Counters / company facts (one shared source) | NAV0006, CC-10 | Extends Who we are facts row | T01, T03, T04 |
| C17 | Icons with descriptions and icon bullet lists (SVG) | CC-11, CC-19, CC-20, SVC0002 | New | T04, T05 |
| C18 | 50/50 media block | CC-17 | New | T03, T04 |
| C19 | CTA callout | CC-18 | Extends closing band | T03–T05, T08 |
| C20 | History / timeline (CMS-managed) | ABT0002, CC-21 | Extends Investors timeline | T04 (Who we are) |
| C21 | Resource listing with search and filters (type, topic, service line, company) and optional author | RES0001, RES0002, CC-22 | Extends Resource Center + cards | T11 |
| C22 | Article body (semantic HTML, Article structured data, sitemap and answer-engine index) | RES0003 | New | T12 |
| C23 | Document list (title, file type, size, last updated; new tab; stable DAM URLs; accessibility flag) | RES0004–RES0006, CC-23 | Extends document cards | T13, T04, T14 |
| C24 | Forms engine: inquiry-type switching, routing by type / company / state, hidden origin fields, inline validation, success / redirect, bot check, analytics events, retention | FRM0001–FRM0009, FRM0012 | Extends form controls | T15 |
| C25 | Form placement variants (right / left / top / bottom of content) | FRM0005, CC-15 | New layout pattern | T04, T05, T15 |
| C26 | Subcontractor request, talent network, email alerts and document request forms | FRM0011, *Strategy* | Extends C24 | T15 |
| C27 | Social media feed | CC-16 | New (third-party) | T04, T08 |
| C28 | Business segments section (Communications / Building Systems) | ABT0006 | Extends tabs or 50/50 | T03, T04 |
| C29 | Operating companies for a service (tagged list + pre-filtered map instance) | SVC0003, MAP0009 | Extends directory and map | T05, T07 |
| C30 | Related careers block (job category link + live count) | SVC0004 | Extends trade rows + roles drawer | T05, T07 |
| C31 | Job search bar and filters (role + location first; plain-language categories; company; type; travel; remote) | *Strategy* goals 1–2; *SF* §8 | Extends roles drawer filters | T08, T09 |
| C32 | Job result card (title, company, location, type, travel, pay when available, posted) | *Strategy* goal 3; *SF* §6 | New | T09, T07, T10 |
| C33 | Job detail facts block, apply hand-off and fraud guidance | *Strategy* goals 3–4, 6; *SF* §7 | New | T10 |
| C34 | Zero-result and expired-job recovery (adjacent roles, nearby companies, talent network) | *Strategy* goal 5 | New | T09, T10 |
| C35 | Map additions: clustering, ZIP / city nearest-first, filters by company / service / state, list-view fallback and consent-blocked message, pre-filtered instance | MAP0002–MAP0009 | Extends company map (the *near you* and *street map* models already prove search-by-place and clustering) | T06, T07, T05 |
| C36 | People card and grid (photo, name, title, bio dialog) | ABT0001 | New | T17 |
| C37 | Data table (responsive) | board committees, analyst coverage, stock history | New | T14 |
| C38 | Pagination / load more; related-content module; empty and error states (map failure, search zero, form error) | RES0001, MAP0008, FRM0006 | New pattern set | T09, T11, T12, T18 |

Third-party surfaces to place but not design: the recruiting chatbot (*Strategy* user type 1), the consent tool (C05), the IR provider's alert service (T15).

---

## 4. Content migration matrix

### 4.1 Migrate as-is — 8 pages

Privacy policy · Terms of use · Inventory terms of purchase · Fleet terms of purchase · Benefit plan disclosures · Employee handbook (as a document, replacing the third-party embed) · Hazard recognition (English and Spanish documents) · Governance documents. Plus the Sustainability report document on the restructured Sustainability page. Legal pages keep their "last updated" dates (*Audit* §9).

### 4.2 Migrate and restructure into templates — 31 pages

| Area | Pages | What changes |
| --- | --- | --- |
| About | who-we-are, values, leadership, sustainability, safety, quality, contact (7) | About content splits into landing + topic pages; the repeated "Connection with Intention" (Safety, People, Our Reach) block becomes **one shared source** placed where needed (ABT0005); the values list appears once (today it is on About and Life); the employee and company counts are reconciled to the single company-facts source — the audit found 20,000 and 21,000 employees and "approximately 40" and "41" companies in use at once (NAV0006, *Audit* §6); Safety is rebuilt with accordions and in-page anchors; the contact form gains the inquiry-type selector and routing. |
| Services | what-we-do + 7 services (8) | One service template with optional sections so deep services (Wireline, Wireless) show more and thin ones (Project management) less; each page gains tagged companies and related careers; existing service videos move into the media section. |
| Companies | companies (1) | The companies page and the retired Subsidiaries page merge into the directory; company copy becomes structured items (MAP0001). |
| Careers | careers, recruitment process, life, benefits, students & early careers (5) | Careers landing re-centres on search and "where do I fit"; the recruitment-process page keeps its fraud guidance and gains the real process; Life gets the filterable video component and loses the externally hosted assets; Benefits categories move into a slider or accordion; the early-career content on Life becomes its own page. |
| Investors | investors overview (built), governance, board of directors, board committees, shareholder services, FAQs, analyst coverage, contact IR (8) | Investor-relations pages are rebuilt on-site in the interior template; FAQs become an accordion; committees and coverage become data tables. |
| System | thank-you-for-subscribing, preferences-updated (2) | The shared investor-links block is replaced by the related-content module. |

### 4.3 Pulled from systems rather than copied — 13 pages

| Pages | System | Notes |
| --- | --- | --- |
| news, news detail, investors/news, investors/news detail, events & presentations | Investor-relations provider feed | Rendered on-site; see D-IR. |
| quarterly reports, annual reports, SEC filings, stock information | IR provider / EDGAR / market-data feed | Documents via stable DAM or provider URLs (RES0005); the overview shows no live market widgets. |
| email alerts, document request | IR provider services behind on-site forms | Confirmation pages are site pages. |
| job search, job detail | SuccessFactors recruiting feed | Structured today: title, ID, URL, created date, city, state, ZIP, country, multi-location, business unit, department / category, facility (company), brand, employment type (`shifttype`), travel, major market, full description. Present in the schema but empty in the sample: compensation, posted date, shift, education, degree, experience, certification. Experience, education, skills, benefits and physical requirements exist only inside the description (*SF* §3–4, §13). |

The company directory and every company profile also read from the structured company data rather than page copy.

### 4.4 Net-new — 14 page types + 39 company profiles

| Item | Supplier |
| --- | --- |
| Homepage copy (built; wording to be confirmed) | Icreon draft, Dycom approves |
| Business segments page or section (Communications, Building Systems) | Dycom (segment leads) |
| 39 operating-company profiles: description, aliases, logo, industries, states served, offices with coordinates, careers link, segment | Dycom (each operating company), via the structured company data |
| Subcontractor request page and form | Icreon (form), Dycom (routing recipients) |
| Explore the trades (explainers per trade) | Icreon draft from the homepage trades chapter; Dycom confirms |
| Why Dycom | Dycom (talent marketing) |
| Veterans | Dycom (talent marketing), Icreon structure |
| Talent network page and form | Icreon (form), Dycom recruiting system owner (destination) |
| 404, search results, contact thank-you | Icreon |
| Resource Center index (`resources/`): one searchable list of the documents filed under the other groups | Icreon (structure from the V2 homepage resource columns), Dycom confirms the groups |
| Students & early careers (the net-new half) | Dycom |
| Operating strengths (`who-we-are/operating-strengths/`) and Our capabilities (`what-we-do/capabilities/`): the two pages the homepage's four-card column leads to | Dycom (content v0.1 names the destinations; copy to follow) |
| Building Systems service pages | Dycom, once the taxonomy is confirmed |

### 4.5 Content items that are not pages

| Item | Status | Supplier |
| --- | --- | --- |
| Shared promotional block ("Connection with Intention": Safety, People, Our Reach) | Consolidate from the repeated copy into one source | Icreon consolidates, Dycom approves |
| Company facts (employees, operating companies, field offices, founded, listing) | Reconcile the conflicting values | Dycom confirms the owner and values |
| Testimonials (text and video) | New | Dycom |
| History / timeline entries | New | Dycom |
| Community notices | New (Resource Center topic) | Dycom (operating companies) |
| Social feed accounts | Configuration | Dycom |
| Hero film and stills | Built with the existing brand film and library | — |
| Recruitment-fraud guidance | Migrate from the current recruitment-process page | Dycom |
| Service capability icons (SVG) | New | Icreon |
| Resource Center wording | Open decision D11 | Dycom |
| System-page copy (empty states, errors, success messages) | New | Icreon |

---

## 5. Dependencies and open decisions

### 5.1 Data the build needs that does not exist yet

| Dependency | What is missing | Pages blocked |
| --- | --- | --- |
| Company → service tagging (D8, SVC0003) | The published directory names companies and home offices only; no company carries its service lines, industries, states served, segment, aliases or logo. | All T05 service pages (companies section), T07 profiles, directory filters by service line |
| Company facts source (NAV0006) | Canonical employee, company and office counts and an owner. The prototype uses 20,000+ employees, ~40 companies, incorporated 1969, NYSE: DY. | T01, T03, T04 counters |
| Office locations (MAP0001, MAP0002) | The prototype maps 31 home offices for 39 companies; the strategy counts about 500 field offices. Addresses and coordinates for all of them. | T06 directory, T07 profiles, clustering, nearest-first search |
| SuccessFactors fields (SF) | Compensation, posted date, shift, education, experience and certification are empty in the sample; pay-forward cards and "decide with confidence" facts need them structured. Validate population across the whole inventory; request the feed enhancements the assessment lists (§14). | T09 result cards, T10 facts block, T05 / T07 live counts |
| Investor-relations feed and market data | Which provider endpoints exist for news, events, filings, documents, stock data and alerts, and whether content may be rendered on-site. | Every Investors page below the overview; news pages |
| Search index, DAM, consent tool, forms recipients, analytics plan | Sitecore search configuration; DAM with stable URLs and accessibility flagging; consent vendor; routing recipients per inquiry type, company and state; event names for form start / success / error. | T18 search, T13 libraries, C05, T15 forms |

### 5.2 Open decisions and the pages they block

| ID | Decision | Default in the prototype | Blocks |
| --- | --- | --- | --- |
| D1–D7 | Button shape, arrow meaning, secondary homepage sections, hero media, casing, map interaction depth, green proportion | Square · `→`/`↗` · compact How we work, no Meet the people · film with still variant · all-caps H1+H2 · hover + click · accent only | Nothing (defaults are implemented); each is a token or component switch |
| D8 | Capability tiles → companies doing that work | Tabs link to the map | T05 companies section, directory service filter |
| D9 | Trade tiles → explainer content | No link | `careers/trades/` depth; Resource Center topics |
| D10 | "Networks in everyday life" as an interior section | Cut | A possible T04 page |
| D11 | Resource Center wording | Component kept, wording pending | Resource Center on T01 and T02 |
| D12 | Company map interaction | Atlas & directory; four alternatives built | T06 directory page, C35 map additions, MAP0005–MAP0009; the phone rule and no-auto-movement rule if a live map is chosen |
| D-BS | Building Systems taxonomy (SVC0005) | Not represented | Building Systems service pages, business segments content |
| D-CF | Company facts owner and values | Static figures | C16 counters everywhere |
| D-IR | Investor content on-site from a feed, or links to the IR host (the strategy's "link to IR microsite" conflicts with the no-outward-links rule) | Static snapshot, inward links | T11/T12/T13/T14 Investors pages, stock information, email alerts |
| D-PRI | Priority of the careers pages the strategy names (MVP\*) | Treated as MVP | Sprint planning for T08–T10, veterans, why Dycom, students, talent network |
| D-SEG | Business segments as a page or a section of Who we are | Listed as a page | T04 vs T03 |
