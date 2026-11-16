# Full-site requirements for the new dycomind.com

**Current version, November 16, 2026.** This is the living copy of the requirements. It starts from Icreon's handoff document (`handoff/reference/full-site-requirements.md`, prepared October 23, 2026, now frozen) and carries every decision made since; the change log at the end lists them. Citations resolve inside `handoff/reference/sources/` (see `handoff/reference/README.md` for the key: *NAV0001*–*FRM0012* Corporate Website requirements; *CC-n* Custom Components list; *Strategy*; *Audit*; *SF* SuccessFactors assessment; *Spec* the Consolidated-direction specification). Template designs are on the template design canvas (T01–T16, with the component inventory page).

## Headline numbers

| | Count | Notes |
| --- | --- | --- |
| **Pages** | **66 page types**, one URL each, plus one page per open requisition, news release and call transcript | 50 pages of the committed future-state sitemap (including the homepage) + 16 pages the strategy and requirements add (the Resource Center index, `resources/`, added Oct 28, 2026; Operating strengths and Our capabilities, added November 3, 2026). Operating-company profiles were removed on November 16, 2026: the directory sends visitors to each company's own website ↗. The call transcript page was added the same day. |
| **Templates** | **16** — 2 built (T01 Homepage, T02 Investors), 14 designed and ready to build | T02 also serves the six investor content pages (stock information, governance, board committees, analyst coverage, shareholder services, FAQs). §2. |
| **Components** | **47 renderings + 15 shared parts.** Built 10 · extend a built rendering 10 · new 20 · required but not yet designed 6 · third-party 1 | The consolidated inventory in §3 replaces the handoff's gap list (C01–C38); each rendering cites the C-numbers it absorbs. |
| **Content** | Migrate as-is **8** · migrate and restructure **31** · pulled from systems **14** · net-new **12** | By page; the non-page content items (shared blocks, facts, company data, testimonials, timeline, notices) are listed in §4.5. |
| **Blocking dependencies** | 6 data dependencies, 7 open decisions that block pages, 3 items open with Dycom from the Investors review | §5. |

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
| `who-we-are/leadership/` | T15 People grid | investor-relations host, executive officers | restructure | CMS people items | MVP | ABT0001 (leadership optional) |
| `who-we-are/business-segments/` | T04 Corporate topic | new | new — Dycom | CMS | MVP | ABT0006, *Strategy* user types 4–5 (may be delivered as a section of `who-we-are/` if Dycom prefers; see D-BS in §5) |
| `sustainability/` | T04 Corporate topic | `/sustainability/` | restructure (four pillars) | CMS + report document | MVP | ABT0004, RES0004 |
| `news/` | T10 Resource listing | investor-relations host, news releases | feed | IR provider feed / CMS | MVP | RES0001, RES0003 |
| `news/{slug}` | T11 Article / news detail | new (releases open on the IR host today) | feed | IR provider feed | MVP | RES0003; D-IR in §5 |
| `how-we-work/safety/` | T04 Corporate topic | `/about-us/safety/` | restructure (accordions + in-page anchors) | CMS | MVP | ABT0003, *Audit* §14 (highest-depth page) |
| `how-we-work/quality/` | T04 Corporate topic | `/about-us/quality/` | restructure | CMS | MVP | *Spec* §4.2 |
| `how-we-work/hazard-recognition/` | T12 Document library | `/hazard-recognition/` | as-is (English and Spanish documents) | DAM | MVP | RES0004–RES0006 |
| `contact/` | T13 Contact & forms | `/contact-us/` | restructure (inquiry-type selector with routing) | Sitecore Forms | MVP | FRM0001–FRM0009, FRM0012; FRM0010 Post MVP |

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
| `companies/` | T06 Company directory | `/about-us/companies/`; `/subsidiaries/` retired | restructure + feed | Company data (structured items); each company card leads to the company's own website ↗ and careers ↗ — there are no profile pages on dycomind.com | MVP (list-view toggle Post MVP) | MAP0001–MAP0005, MAP0007, MAP0008; MAP0006 Post MVP; *Spec* MAP, D12 |
| `suppliers/inventory-terms-of-purchase/` | T14 Legal / long-form | `/inventory-terms-of-purchase/` | as-is | CMS rich text | MVP | *Strategy* user type 11 |
| `suppliers/fleet-terms-of-purchase/` | T14 Legal / long-form | `/fleet-terms-of-purchase/` | as-is | CMS rich text | MVP | *Strategy* user type 11 |
| `suppliers/subcontractor-request/` | T13 Contact & forms | new | new — form | Sitecore Forms | MVP | FRM0011, FRM0002–FRM0003 |

### 1.5 People & careers

| Path | Template | Current-site source | Disposition | Data source | Priority | Requirements |
| --- | --- | --- | --- | --- | --- | --- |
| `careers/` | T07 Careers landing | `/careers-home/` | restructure | CMS, job feed (counts), video component | MVP\* | *Strategy* goals; CC-6, CC-13 |
| `careers/opportunities/` | T08 Job search | external SAP-branded job portal | feed | SuccessFactors feed | MVP\* | *Strategy* "search like a job seeker", "never hit a dead end"; *SF* §6, §8 |
| `careers/opportunities/{id}` | T09 Job detail | external SAP-branded job portal | feed | SuccessFactors feed; apply hand-off to SAP | MVP\* | *Strategy* "decide with confidence", "apply from a phone"; *SF* §7, §13 |
| `careers/trades/` | T04 Corporate topic | new (from the homepage trades chapter) | new — Icreon draft, Dycom to confirm | CMS | MVP\* | *Strategy* user type 2; D9 |
| `careers/why-dycom/` | T04 Corporate topic | new | new — Dycom | CMS, company facts, testimonials | MVP\* | *Strategy* user types 4–5 |
| `careers/students-early-careers/` | T04 Corporate topic | `/life/` (early-career section) | restructure + new | CMS, job feed (filtered) | MVP\* | *Strategy* user type 6 |
| `careers/veterans/` | T04 Corporate topic | new | new — Dycom | CMS, job feed (filtered), job alerts | MVP\* | *Strategy* user type 7 ("net-new") |
| `careers/recruitment-process/` | T04 Corporate topic | `/our-recruitment-process/` | restructure — keep the fraud guidance, add the actual process | CMS | MVP\* | *Strategy* "trust at a glance"; *Audit* §4 observation |
| `careers/life/` | T04 Corporate topic | `/life/` | restructure (assets hosted on a third-party domain today) | CMS, video component | MVP\* | CC-6 (video component lives here), *Audit* §11 |
| `careers/benefits/` | T04 Corporate topic | `/benefits/` | restructure (categories → in-page slider or accordion) | CMS | MVP\* | CC-13, *Audit* §4 |
| `careers/talent-network/` | T13 Contact & forms | external talent-network sign-up | new — form | Sitecore Forms → recruiting system | MVP\* | *Strategy* "never hit a dead end" |
| `careers/employee-handbook/` | T12 Document library | `/handbook/` (third-party embed) | as-is, as a document rather than an embed | DAM | MVP | RES0004–RES0006 |
| `careers/benefit-plan-disclosures/` | T12 Document library | `/benefit-plan-disclosures/` | as-is | DAM / external compliance documents | MVP | RES0004 |

### 1.6 Investors

The Investors overview is built. The six investor content pages use the same T02 frame (interior hero, jump row, sections, Investor resources block, closing band); there is no separate investor-content template. Everything below the overview is content the investor-relations provider holds today; the no-outward-links rule means it must be rendered on-site from a feed or exported snapshot (open decision D-IR, §5).

| Path | Template | Current-site source | Disposition | Data source | Priority | Requirements |
| --- | --- | --- | --- | --- | --- | --- |
| `investors/` | T02 Investors (built; November 16 update applied) | IR hub | restructure — built | IR feed (latest quarter, events, news) | MVP | *Spec* §5.11 IRP-F1–F4; Dycom IR review Nov 11, 2026 |
| `investors/quarterly-reports/` | T12 Document library | IR hub | feed | IR feed / DAM | MVP | RES0004–RES0005 |
| `investors/annual-reports/` | T12 Document library | IR hub | feed | IR feed / DAM | MVP | RES0004–RES0005; CC-23 ("a more elegant version of this page") |
| `investors/sec-filings/` | T12 Document library (filterable) | IR hub | feed | IR / EDGAR feed | MVP | RES0004 |
| `investors/stock-information/` | T02 Investors | IR hub, stock quote and historical lookup | feed | IR market-data feed | MVP | *Spec* IRP (no live market widgets on the overview; see D-IR) |
| `investors/governance/` | T02 Investors | IR hub | restructure | CMS | MVP | — |
| `investors/board-of-directors/` | T15 People grid | IR hub | restructure | CMS people items | MVP | — |
| `investors/board-committees/` | T02 Investors (data table) | IR hub | restructure | CMS | MVP | — |
| `investors/governance-documents/` | T12 Document library | IR hub | as-is | DAM | MVP | RES0004–RES0005 |
| `investors/news/` | T10 Resource listing | IR hub | feed | IR feed | MVP | RES0001; *Strategy* user type 10 |
| `investors/news/{slug}` | T11 Article / news detail | IR hub | feed | IR feed | MVP | RES0003; D-IR |
| `investors/events-presentations/` | T10 Resource listing (timeline variant, Upcoming / Past tabs) | IR hub | feed | IR feed | MVP | — |
| `investors/events-presentations/{event}/transcript/` | T11 Article / news detail (transcript variant: speaker labels, headings, paragraphs) | PDF transcripts on the IR host | feed — HTML, not PDF | Transcript provider (Dycom named Notified) | MVP | Dycom IR review Nov 11, 2026; holding route built for Q2 2027 |
| `investors/analyst-coverage/` | T02 Investors (data table) | IR hub | restructure / feed | CMS or IR feed | MVP | — |
| `investors/shareholder-services/` | T02 Investors | IR hub | restructure (off the menu and the Investor resources block since Nov 16; the page stays in the inventory) | CMS | MVP | — |
| `investors/faqs/` | T02 Investors (accordion) | IR hub | restructure | CMS | MVP | CC-7 |
| `investors/document-request/` | T13 Contact & forms | IR hub | feed / form (off the menu and the Investor resources block since Nov 16; the page stays in the inventory) | Sitecore Forms → IR provider | MVP | FRM0006 |
| `investors/email-alerts/` | T13 Contact & forms | IR hub | feed / form | IR provider alert service | MVP | FRM0006 |
| `investors/contact/` | T13 Contact & forms | IR hub | restructure | Sitecore Forms (Investor inquiry type) | MVP | FRM0001 |

Every page also carries the **results bar** (§3, ResultsBar) for fourteen days after each earnings release, and the Investors menu carries a permanent **Latest results & call replay** link. The Investors menu reads: Overview · Financials & filings (SEC filings · Quarterly reports · Annual reports) · Shareholder resources (Stock information · Analyst coverage · Investor FAQs · Email alerts · Contact Investor Relations) · Governance · News & events.

### 1.7 Utility and system pages

| Path | Template | Current-site source | Disposition | Data source | Priority | Requirements |
| --- | --- | --- | --- | --- | --- | --- |
| `privacy-policy/` | T14 Legal / long-form | `/privacy-policy/` | as-is | CMS rich text | MVP | *Audit* §9 |
| `terms-of-use/` | T14 Legal / long-form | `/terms-of-use/` | as-is | CMS rich text | MVP | *Audit* §9 |
| `404` | T16 System page | new | new — Icreon copy | CMS (popular links), search, job search entry | MVP | NAV0012 |
| `search/` | T16 System page | new | new | Site search index (pages, documents, news) | MVP | NAV0010 |
| `resources/` | T10 Resource listing | new | new — index of documents that keep their own pages under other groups (reports, safety and employee materials, purchasing terms, candidate guides) | Document index across groups | MVP | NAV0001, RES0001 |
| `contact/thank-you/` | T16 System page | new | new — Icreon copy | CMS success message | MVP | FRM0006 |
| `investors/email-alerts/thank-you/` | T16 System page | `/thank-you-for-subscribing/` | restructure (drop the repeated investor-link block; use the shared related-content module) | CMS | MVP | *Audit* §10 |
| `investors/preferences-updated/` | T16 System page | `/preferences-updated/` | restructure (same) | CMS | MVP | *Audit* §10 |

Not carried from the current site: `/subsidiaries/` (no purpose; folds into `companies/`), the duplicate `investors/sec-filing/` address. Executive officers sit under Who we are › Leadership so every audience finds them.

---

## 2. Template catalogue

Templates T03–T16 are designed on the template design canvas (desktop and phone boards, each with its narrative, required and optional blocks, and content sources). Every interior template inherits the **interior-page frame** proven by the Investors overview: site header · interior hero (back link, all-caps H1, overview paragraph, optional listing or fact block on a Signal Green rule) · optional in-page index · numbered section heads · body sections · closing band · footer. "Required" sections appear on every page using the template; "optional" sections are switched on per page in the CMS.

| Code | Template | Status | Section stack (required → optional) | Pages | Composes (built components in **bold**) |
| --- | --- | --- | --- | --- | --- |
| T01 | Homepage | **Built** (Consolidated V2) | **Hero** (full-bleed film) · **Pathways** · **Who we are** (values + facts band) · **Brand video** (film plays in place) · **Our companies** (map + directory, on Civic Blue) · **What we do** (tabs; accordion on phones) · **Four-card column** (on Civic Blue) · **Brand statement** · **Who we build for** · **Lifecycle** (process route; accordion on phones) · **How we work** · **People & careers** (trades + drawer action) · **Investors** · **Resource Center** · **Closing** (intent toggle + inquiry form) · **Footer** (six columns); optional: alert banner, scheduled pop-up | `/` | All homepage chapters; + alert banner, pop-up |
| T02 | Investors | **Built** (Consolidated V2, November 16 update applied) | Overview: photographic interior hero with listing block · unnumbered jump row · Latest financial results (quarter as a green sub-line; three GAAP figures; release documents; one-line call replay) · brand film band · Events (Upcoming / Past tabs) and Investor news · Featured reports · Investor resources (Investors menu group, filtered) · photographic closing band with white space before the footer. Content pages: interior hero · jump row · rich-text sections · optional data table (committees, analyst coverage, stock history) · optional accordion with FAQ schema (FAQs) · optional document list · Investor resources · contact IR closing band | `investors/` + stock information, governance, board committees, analyst coverage, shareholder services, FAQs (7 pages) | InteriorHero, PageIndex, MetricBand, DocumentList, Statement, Video, EventTimeline, ResultList, CoverCards, LinkColumns, RichTextSection, DataTable, Accordion, ClosingBand |
| T03 | Section landing | Designed | Interior hero · group intro · child-page tile grid (the mega-menu columns, as tiles) · shared promotional block ("Connection with Intention" source) · optional: facts counters, featured companies / jobs / news, CTA callout | `who-we-are/`, `what-we-do/`, `companies/` (if separated from the directory), `careers/` (see T07) | **Interior hero**, **pathway/tile cards**, counters, 50/50, CTA callout |
| T04 | Corporate topic | Designed | Interior hero · optional in-page index · rich-text sections with numbered heads · optional: accordion, icon list, 50/50 media block, quote/testimonial, image gallery, video component, timeline, counters, document list, related content, form (placed right/left/top/bottom), CTA callout | values, business segments, sustainability, safety, quality, trades, why Dycom, students & early careers, veterans, recruitment process, life, benefits (19 pages) | **Interior hero**, **in-page index**, **section heads**, accordion, icon list, 50/50, quotes, gallery, video, **timeline**, counters, document list, related content, forms |
| T05 | Service detail | Designed | Interior hero · introduction · capabilities (icons + descriptions) · media (image / video) · operating companies providing this service (tagged list + pre-filtered map) · contact CTA · related careers (job category link + live count); optional: related projects / case studies, trade explainer link | 7 services (+ Building Systems when confirmed) | **Interior hero**, icon list, media block, **company directory** (filtered), **company map** (pre-filtered), CTA callout, **trade rows** + **roles drawer**, related content |
| T06 | Company directory | Designed (the chapter is built) | Interior hero with summary line · filters (operating company, service line, state) + ZIP/city search · map (interaction per D12) · directory grid with alphabetical sort · list-view fallback when the map cannot load · company card · CTA | `companies/` | **Company map**, **directory**, **company card**, **form controls**, **dialog**; + clustering, nearest-first search, fallback message |
| T07 | Careers landing | Designed | Interior hero with job search bar · "where do I fit" guided entry (trades → categories) · filterable video component (Life at Dycom) · benefits slider · why Dycom / testimonials · talent network CTA · recruitment-fraud notice | `careers/` | **Interior hero**, job search bar, **trade rows**, video component, in-page slider, quotes, CTA callout |
| T08 | Job search | Designed | Search bar (role + location first) · filters (trade / category, operating company, state, employment type, travel, remote) · result cards (pay-forward where available) · sort · pagination · zero-result recovery (adjacent roles, nearby companies, talent network) · "Looking for the site?" link to site search | `careers/opportunities/` | **Roles drawer** filters as the model, **form controls**, result card, pagination, empty state |
| T09 | Job detail | Designed | Title · operating company (name, logo, company card leading to its website ↗) · standard facts block (location, employment type, travel, schedule, pay when available, posted date) · description (from feed) · apply hand-off (SAP) · fraud guidance · similar roles · expired-job state | one per requisition | Facts block, **buttons**, cards, empty/expired state |
| T10 | Resource listing | Designed | Interior hero · search bar · filters (content type, topic, service line, operating company, year) · result cards with optional author · pagination; timeline variant for events | `news/`, `investors/news/`, `investors/events-presentations/`, a general Resource Center if Dycom keeps one | **Interior hero**, **cards**, **form controls**, **timeline**, pagination |
| T11 | Article / news detail | Designed | Interior hero (date, optional author block) · article body (semantic HTML, Article structured data) · documents · related content · share; transcript variant (speaker labels, headings) | `news/{slug}`, `investors/news/{slug}`, call transcripts, Resource Center articles | **Interior hero**, article body, document list, related content |
| T12 | Document library | Designed | Interior hero · optional year / type filter · document list (title, file type, size, last updated; PDFs open in a new tab) · optional intro and language variants | hazard recognition, employee handbook, benefit plan disclosures, quarterly reports, annual reports, SEC filings, governance documents (7 pages) | **Interior hero**, document list, **form controls** |
| T13 | Contact & forms | Designed | Interior hero · form with inquiry-type selector (fields and routing change per type) · placement variant (right / left / top / bottom of accompanying content) · inline validation · success message or thank-you redirect · spam protection · analytics events | contact, subcontractor request, talent network, document request, email alerts, contact IR (6 pages) | **Form controls**, **buttons**, forms engine, placement variants |
| T14 | Legal / long-form | Designed | Interior hero with "last updated" · sticky in-page index of numbered clauses · long rich text · print styles | privacy, terms, inventory terms, fleet terms (4 pages) | **Interior hero**, **in-page index**, rich text |
| T15 | People grid | Designed | Interior hero · optional group tabs (executive / board) · people cards (photo, name, title, optional bio dialog) | leadership, board of directors (2 pages) | **Interior hero**, people card, **dialog**, **tabs** |
| T16 | System page | Designed | Short heading and message · site search · popular links · job search entry · related-content module (replaces the repeated investor-link block) | 404, search results, three confirmations (5 pages) | **Section heads**, search, **cards**, **buttons** |

---

## 3. Component inventory

Consolidated on November 16, 2026 from every template on the canvas. One rendering per job: the five search bars became **SearchFilterBar**, the empty states **EmptyState**, the tile sets **TileGrid**, the promo and pillar blocks **FeatureColumns**. The *Refs* column names the requirement and the handoff gap-list numbers (C01–C38) each rendering absorbs. Status: **Built** exists in the site today · **Extend** grows a built rendering · **New** designed on the canvas, not built · **Not designed** required, not yet on the canvas · **Third-party** placed, not designed.

### Global — partial designs on every page

| Rendering | Refs | What & variants | Templates | Data source | Status |
| --- | --- | --- | --- | --- | --- |
| **SiteHeader** | NAV0001–0003 | Six mega-menu groups, phone sheet, language switch, Find a job. Menu spotlight link per group (Investors: Latest results & call replay, permanent). | all | Navigation items | Built |
| **SiteFooter** | NAV0007 | Six columns, phone accordions, utility row, Motion control, cookie preferences. | all | Navigation items | Built |
| **RolesDrawer** | Strategy | Work / where / trade / company filters, results, role view, empty state. | all | Job feed + Trade items | Built |
| **ResultsBar** | Dycom IR review, Nov 11, 2026 | Earnings window: shows above the header on every page for 14 days after a results release; label, one line, Results release and Call replay links; dismissed for the session. | all | IR feed release date | New |
| **AlertBanner** | NAV0008 · CC-3 | Site-wide notice: severity, schedule, dismissible, site targeting. | all | Alert items | Not designed |
| **HomepagePopup** | NAV0009 · CC-5 | Scheduled modal, frequency cap, Esc and × close, focus return. | T01 | Popup items | Not designed |
| **ConsentBanner** | CC-4 | The consent tool's banner and the preferences link. | all | Consent vendor | Third-party |

### Heroes and page navigation

| Rendering | Refs | What & variants | Templates | Data source | Status |
| --- | --- | --- | --- | --- | --- |
| **Hero** | NAV0004 · CC-2 | Homepage: silent film loop or still. Carousel variant (CC-12) only if Dycom opts in. | T01 | Datasource | Built |
| **InteriorHero** | C01 · NAV0011 | Breadcrumb, H1, one sentence. Variants: photo · plain · article · with search bar (jobs, site, resources) · with listing block. Holds the PageIndex. | all interior | Datasource | Extend |
| **PageIndex** | C08 · ABT0003 | In-page navigation: jump row under the hero (numbered or unnumbered — Investors drops the numerals), or sticky 'On this page' list (with print for legal). | T02, T03, T04, T05, T07, T14 | Route sections | Extend |

### Content blocks

| Rendering | Refs | What & variants | Templates | Data source | Status |
| --- | --- | --- | --- | --- | --- |
| **RichTextSection** | C22 · ABT0001 | Numbered section: heading, lede, rich text, tick list. Legal variant: numbered clauses migrated as-is. | T02, T04, T09, T14 | Datasource | New |
| **MediaText** | C18 · CC-17 | 50/50 photo or video beside text; left or right. | T04, T05, T07 | Datasource | New |
| **FeatureColumns** | C17 · CC-11 · CC-19 · ABT0005 | 2–4 columns with the signal mark, a brand pictogram or a photo; light or Civic. Serves the shared promo (Connection with Intention), pillars, capabilities, segments, values, Headway®/Rightway™, why Dycom. | T01, T03, T04, T05, T07 | Datasource or shared item | New |
| **ProcessSteps** | — | Numbered steps, horizontal or stacked. | T04, T05 | Datasource | New |
| **Lifecycle** | — | Five-stage process route with fixed-height panels; tabs on desktop, accordion on phones. Compact route variant for landings. | T01, T03 | Stage items | Built |
| **Statement** | C09 · CC-8 | One sentence set large with the signal mark; quote variant with attribution; call-replay block (one line + two actions). | T01, T02, T04 | Datasource | Extend |
| **MetricBand** | C16 · CC-10 · NAV0006 | Facts over a photo (Company Facts, one source), results metrics under a head with the quarter as a green sub-line, figure strip. | T01, T02, T03, T11 | Company Facts or IR feed | Extend |
| **Accordion** | C07 · CC-7 | Text, links and buttons inside; FAQ schema option (Investor FAQs). | T02, T04 | Child items | New |
| **Video** | C11 · CC-2 · CC-6 | Brand film band (plays in place, muted) — on the homepage and the Investors page, inline video, tagged video library with filters. | T01, T02, T05, T07 | Media library + tags | Extend |
| **InPageSlider** | C14 · CC-13 | Image, video or text slides with title, description and link. | T07 | Child items | New |
| **Notice** | C38 | Short notice with icon: recruitment fraud (shared item), map unavailable, consent blocked. | T06, T07, T09 | Shared item | New |

### Cards and collections

| Rendering | Refs | What & variants | Templates | Data source | Status |
| --- | --- | --- | --- | --- | --- |
| **Pathways** | NAV0005 | Four intent tiles on Civic. | T01 | Child items | Built |
| **TileGrid** | C15 · CC-14 · C21 | Photo tiles, 3–4 up, optionally grouped: child pages (reads the nav group), related content, strength cards with buttons, services. | T01, T03, T04, T05, T11 | Nav group or child items | Extend |
| **LinkColumns** | RES0001 | Titled link groups: investor resources, governance, popular pages, Resource Center. | T02, T12, T15, T16 | Nav group or child items | Built |
| **CoverCards** | CC-23 | Report cards with cover image, label, title, action. | T02, T12 | Documents (DAM) | Built |
| **PeopleGrid** | C36 · ABT0001 | Executive / board tabs, person cards, bio dialog. | T15 | Person items | New |
| **EventTimeline** | C20 · CC-21 | Square-node timeline with Upcoming / Past tabs, split by event date at render; empty Upcoming state points to email alerts. History timeline (ABT0002) extends it. | T02, T10 | IR feed or CMS | Built |

### Search, lists and data

| Rendering | Refs | What & variants | Templates | Data source | Status |
| --- | --- | --- | --- | --- | --- |
| **SearchFilterBar** | C06 · C21 · C31 · C35 · NAV0010 | One search-and-filter bar: query (role + location for jobs), filter selects or year tabs, removable chips, live count, sort. Teaser variant for landings. | T03, T05, T06, T07, T08, T10, T12, T16 | The list it filters | New |
| **ResultList** | C21 · RES0002 | Rows with item templates: news item, search result with snippet, company row. Author on/off. | T02, T03, T10, T16 | IR feed, CMS or search index | Extend |
| **JobList** | C32 | Job result cards: company logo, location, type, travel, posted, trade tag, pay slot when the feed has pay. Compact 'similar roles' variant. | T08, T09 | SuccessFactors feed | New |
| **DocumentList** | C23 · RES0004–0006 | Title, file type, size, date, language tag; aside variant. | T02, T04, T11, T12 | DAM | New |
| **DataTable** | C37 | Responsive table; stacks into labelled blocks on phones (financial statements, board committees, analyst coverage). | T02, T11 | CMS or IR feed | New |
| **EmptyState** | C34 · C38 | Zero results, closed role, page not found: says what happened, then ways forward (similar items, nearby companies, talent network). | T06, T08, T09, T10, T16 | Rendering params | New |
| **ArticleBody** | C22 · RES0003 | Dateline, body, figure strip slot, aside (documents, contact, share); Article schema. | T11 | IR feed or CMS | New |

### Companies and careers

| Rendering | Refs | What & variants | Templates | Data source | Status |
| --- | --- | --- | --- | --- | --- |
| **CompanyMap** | MAP0002–0005 · MAP0009 · C29 · C35 | Atlas + directory + company card; the card leads to the company's own website ↗ and careers ↗. Modes: homepage chapter · full directory with filters · filtered to one service · pre-filtered to one company (for operating-company sites, MAP0009). No map below 768px. | T01, T03, T05, T06 | Company items | Extend |
| **CompanyDirectoryGrid** | MAP0006–0008 | A–Z index, logo rows; the map's accessible list and fallback. | T06 | Company items | New |
| **TradeFinder** | Strategy goal 1 | 'Where do I fit': trades in plain language with open-role counts. | T07 | Trade items + feed counts | New |
| **RelatedCareers** | C30 · SVC0004 | Trades for a service, live count, filtered drawer. | T05 | Trade items + feed | New |
| **JobDetail** | C33 | Facts block, sticky apply hand-off ↗, description sections, trade question, company card, fraud notice. | T09 | SuccessFactors feed (route) | New |

### Forms, closing and layout

| Rendering | Refs | What & variants | Templates | Data source | Status |
| --- | --- | --- | --- | --- | --- |
| **InquiryForm** | C24–C26 · FRM0001–0012 | One forms engine: intent selector, conditional fields, validation, success, routing by type/company/state. Variants: contact, subcontractor, talent network, document request, email alerts. Placement left/right/top/bottom (C25). | T01, T13 | Sitecore Forms | Extend |
| **ContactOptions** | FRM0001 | Other ways to reach us: headquarters, Investor Relations, suppliers, directory. | T13 | Datasource | New |
| **ClosingBand** | C19 · CC-18 | One next step: photo split, photo band or plain Civic; one primary and one secondary action. | T02, T03, T04, T05, T06, T07, T10, T11, T12, T13, T14, T15 | Datasource | Extend |
| **SplitSection** | — | Layout container with two placeholders (main + aside, or two columns). | T02, T11 | — | Built |

### Required, not yet designed

| Rendering | Refs | What & variants | Templates | Data source | Status |
| --- | --- | --- | --- | --- | --- |
| **Testimonials** | C10 · CC-6 | Text and video testimonials, embeddable and on a standalone page. | T04, T07 | Testimonial items | Not designed |
| **ImageGallery** | C12 · CC-9 | Gallery with lightbox. | T04 | Media library | Not designed |
| **SocialFeed** | C27 · CC-16 | Third-party social feed. | T04, T07 | Social accounts | Not designed |
| **BusinessSegments** | C28 · ABT0006 · SVC0005 | Communications / Building Systems — a FeatureColumns or tabs variant once the taxonomy is set. | T03, T04 | Segment items | Not designed |

### Shared parts (not renderings)

| Part | Notes |
| --- | --- |
| Button | Civic · outline · inverse · ghost-inverse; 50px; → or ↗ |
| Link | One underline style; → site pages, ↗ leaving the site |
| SignalMark | The one permitted curve; never an arrow |
| Icon | UI stroke icons + the six brand pictograms |
| Eyebrow | Green caps label |
| SectionHead | H2 + note; optional green index numeral or green sub-line |
| Breadcrumb | NAV0011, on/off in the CMS |
| Tag | Type, language, trade |
| Chip | Removable filter (one style, replaces four) |
| Field | Text, select, textarea, checkbox, square toggle; error text |
| Tabs | Square, green underline (one style, replaces three) |
| Disclosure | Accordion item, footer and phone menu |
| Modal | Dialog and drawer; focus trap and return |
| Pagination | One style, replaces three |
| Share | Copy link, email, print — nothing leaves the site |

### Retired renderings in the current site

Renderings the prototype port uses today that the inventory folds into the ones above as pages are built:

| Rendering | Becomes |
| --- | --- |
| WhoWeAre | Homepage composite → decomposes into RichTextSection + FeatureColumns + MetricBand. |
| ResultsHighlights | Investors composite → MetricBand + DocumentList + Statement. |
| Strengths | → TileGrid (cards with buttons). |
| BrandStatement | → Statement. |
| BrandFilm | → Video (band variant). |
| NewsList | → ResultList (news item). |
| InPageIndex | → PageIndex (jump row). |
| ContactForm | → InquiryForm (dark, intent toggle). |
| ResourceColumns | → LinkColumns. |
| FeaturedReports | → CoverCards. |
| PageNotice | Temporary holding page; removed as pages are built. |

**Totals:** 47 renderings — Built 10 · Extend 10 · New 20 · Not designed 6 · Third-party 1; 15 shared parts.

Third-party surfaces to place but not design: the recruiting chatbot (*Strategy* user type 1), the consent tool (ConsentBanner), the IR provider's alert service (InquiryForm, email alerts variant), the transcript provider.

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

### 4.3 Pulled from systems rather than copied — 14 pages

| Pages | System | Notes |
| --- | --- | --- |
| news, news detail, investors/news, investors/news detail, events & presentations | Investor-relations provider feed | Rendered on-site; see D-IR. |
| quarterly reports, annual reports, SEC filings, stock information | IR provider / EDGAR / market-data feed | Documents via stable DAM or provider URLs (RES0005); the overview shows no live market widgets. |
| email alerts, document request | IR provider services behind on-site forms | Confirmation pages are site pages. |
| call transcripts | Transcript provider (Dycom named Notified) | On-site HTML with headings and speaker labels, not PDFs; gated webcasts and replays still expose title, date, description and duration in the page and in `VideoObject` / `Event` structured data. |
| job search, job detail | SuccessFactors recruiting feed | Structured today: title, ID, URL, created date, city, state, ZIP, country, multi-location, business unit, department / category, facility (company), brand, employment type (`shifttype`), travel, major market, full description. Present in the schema but empty in the sample: compensation, posted date, shift, education, degree, experience, certification. Experience, education, skills, benefits and physical requirements exist only inside the description (*SF* §3–4, §13). |

The company directory also reads from the structured company data rather than page copy; each company card leads to the company's own website ↗.

### 4.4 Net-new — 12 items

| Item | Supplier |
| --- | --- |
| Homepage copy (built; wording to be confirmed) | Icreon draft, Dycom approves |
| Business segments page or section (Communications, Building Systems) | Dycom (segment leads) |
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
| Operating-company data for the directory and map (39 companies): name, logo, aliases, home office and field offices with coordinates, segment, service lines, industries, states served, website and careers URLs | New structured items (no profile pages) | Dycom (each operating company) |
| Results bar: label, one line, release and replay links, release date | Driven by the IR feed; retires 14 days after each release | IR provider; Dycom IR confirms |
| Investors overview hero paragraph | New boilerplate requested in the Nov 11 review; not yet supplied | Dycom IR |
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
| Company → service tagging (D8, SVC0003) | The published directory names companies and home offices only; no company carries its service lines, industries, states served, segment, aliases or logo. | All T05 service pages (companies section), directory filters by service line |
| Company facts source (NAV0006) | Canonical employee, company and office counts and an owner. The prototype uses 20,000+ employees, ~40 companies, incorporated 1969, NYSE: DY. | T01, T03, T04 counters |
| Office locations (MAP0001, MAP0002) | The prototype maps 31 home offices for 39 companies; the strategy counts about 500 field offices. Addresses and coordinates for all of them. | T06 directory, clustering, nearest-first search |
| SuccessFactors fields (SF) | Compensation, posted date, shift, education, experience and certification are empty in the sample; pay-forward cards and "decide with confidence" facts need them structured. Validate population across the whole inventory; request the feed enhancements the assessment lists (§14). | T08 result cards, T09 facts block, T05 live counts |
| Investor-relations feed and market data | Which provider endpoints exist for news, events, filings, documents, stock data and alerts, and whether content may be rendered on-site. | Every Investors page below the overview; news pages; results bar; call transcripts |
| Search index, DAM, consent tool, forms recipients, analytics plan | Sitecore search configuration; DAM with stable URLs and accessibility flagging; consent vendor; routing recipients per inquiry type, company and state; event names for form start / success / error. | T16 search, T12 libraries, C05, T13 forms |

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
| D-IR | Investor content on-site from a feed, or links to the IR host (the strategy's "link to IR microsite" conflicts with the no-outward-links rule) | Static snapshot, inward links | T10/T11/T12 Investors pages, T02 investor content pages, stock information, email alerts, call transcripts |
| D-PRI | Priority of the careers pages the strategy names (MVP\*) | Treated as MVP | Sprint planning for T07–T09, veterans, why Dycom, students, talent network |
| D-SEG | Business segments as a page or a section of Who we are | Listed as a page | T04 vs T03 |

### 5.3 Open with Dycom from the Investors review (November 11, 2026)

| Item | Why it is open | What the site does meanwhile |
| --- | --- | --- |
| New hero boilerplate on the Investors overview | Marked for replacement; no text supplied. | Keeps the current company description. |
| "Whole snapshot" with stock price | A live quote is IR-provider market data and the only live feed on the page; the standing rule is no market widgets on the overview. Needs the D-IR feed decision. | Three GAAP figures from the published results release. |
| Investor resources block on every interior investor page | Confirmed as the direction. | Applied on the overview; the T02 content pages carry it when built. |

Build-team notes from the same review: governance links get link-level analytics events and the Google tag so Dycom can trim the column from usage data; events split Upcoming / Past from event dates at render and never list a past event as upcoming.

---

## Change log

| Date | Change |
| --- | --- |
| November 16, 2026 | **T07 Company profile removed.** Visitors use the company directory (T06) and go on to each operating company's own website ↗; the 39 `companies/{slug}` URLs are gone and company data becomes structured items for the directory and map (§4.5). No rendering was exclusive to the template. |
| November 16, 2026 | **T14 Investor content removed.** Its six pages use the T02 Investors frame; the data table and accordion become T02 uses. |
| November 16, 2026 | **Templates renumbered T01–T16.** Old → new: T08→T07, T09→T08, T10→T09, T11→T10, T12→T11, T13→T12, T15→T13, T16→T14, T17→T15, T18→T16. T01–T06 unchanged. |
| November 16, 2026 | **Component gap list (C01–C38) replaced by the consolidated inventory** (§3): 47 renderings and 15 shared parts. |
| November 16, 2026 | **Investors update applied** (from Dycom's November 11 review; package in `handoff/investors-update-2026-11-16/`): results bar on every page for 14 days after a release; permanent *Latest results & call replay* menu link; *Latest financial results* head with the quarter as a sub-line; unnumbered jump row; brand film band; Upcoming / Past event tabs; Events and News above Featured reports; *Investor resources* columns re-ordered; Document request and Shareholder services off the menu (pages remain); call transcript page added (HTML, not PDF). |
| October 23 – November 3, 2026 | Handoff versions: Resource Center index added (Oct 28); Operating strengths and Our capabilities added (Nov 3). |
