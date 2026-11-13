# Dycom Concept 05 — Requirements & Specification

**Status:** Draft v1 for the Final Review build · **Prepared:** October 22, 2026 · **Owner:** Icreon (CXO office)
**Inputs:** 74 review pins + 2 replies left by Carly Avery, Jillian Carter and Hillary Flanagan on Concepts 01–04 (Oct 20–21, 2026); the synthesis report `generated-artifacts/dycom-feedback-synthesis.html`; the four concept codebases as reviewed (unchanged since Oct 19, 2026); the Dycom brand assets in `attached_assets/Dycom_Design_System_*.zip`.

Pin numbers (`#nn`) are the review-workspace pin IDs and are the evidence for every requirement. "Shall" statements are requirements; "Recommended" statements are Icreon's proposed resolution of an open client decision and must be confirmed at the Final Review.

---

## 1. Purpose and scope

Concept 05 is a brand-new homepage and navigation system for dycomind.com that consolidates everything the Dycom team said they liked across the four concepts and removes everything they rejected. It is not a fifth stylistic direction; it is the client's own specification, assembled.

**In scope (this phase):** homepage, global header/navigation (desktop + mobile), footer, the component system those surfaces need, and — added Oct 22, 2026 at the user's direction — the Investors overview page (§5.11), built from the client's investor feedback. Desktop (1440/1280) and mobile (390) layouts.

**Out of scope:** all other internal pages, live job feeds or application submission, CMS integration, the review workspace itself, and the presentation deck. **No outward links (client instruction, Oct 22 2026):** Concept 05 is the future dycomind.com, so nothing links to the current site, its IR host or its careers portal; destinations outside this phase are internal site paths that the preview renders unavailable. The only external links are operating companies' own websites and careers pages in the company card. Sample roles, counts and office data remain illustrative in the codebase, but the page carries no reviewer-facing notes about it (client instruction, Oct 22 2026): the UI says “open roles” and shows no disclaimers.

## 2. Design principles derived from the feedback

| # | Principle | Evidence |
| --- | --- | --- |
| P1 | **Structure comes from Concept 04.** Navigation, operating-companies layout, work tabs, process component, resources and the intent/audience selector are the client's favorites. | #32 #78 #39 #64 #81 #41 #42 #45 #87 |
| P2 | **The front door is the business, not the job board.** Lead with who Dycom is, what it does and where; careers is a strong utility lower on the page. | #14 #85 #78 #86 |
| P3 | **The brand system is the dominant correction.** Shapes, color and type were corrected on every concept; they are system rules, not per-section fixes. | 12 shape pins · 12 color pins · 7 type pins |
| P4 | **Fewer, better sections.** Merge repetitive components, cut informational-only blocks, one closing next step. | #82 #70 #76 #71 #86 |
| P5 | **Legibility over density.** Nothing small, nothing italic, nothing buried as a text link that should be a button. | #46 #49 #66 #43 #44 |

## 3. Brand system requirements (global)

### 3.1 Shape language — BR-S

- **BR-S1** No circles, dots, pills, ovals or rounded corners shall appear as decorative or structural elements: no circular video stamps, orbit rings, dotted backgrounds, pill buttons, rounded image corners or rounded cards. (#13 #18 #20 #30 #34 #38 #40 #48 #53 #61 #67 #84)
- **BR-S2** The brand motif is the **signal mark**: the Dycom "D" built from three nested quarter-arcs (`logo-mark-*.png` in the design-system assets; the SVG in Concept 02's `SignalLogo.tsx` is an acceptable vector form). Every graphic accent — section markers, bullets, icon style, loading/playing indicators — shall derive from the quarter-arc stepped geometry of that mark. Exceptions (user rules, Oct 22 2026): map pins are plain squares with an animated location pulse, and arrows, carets and dropdown indicators are plain glyphs — the signal is a motif, never an arrow. (#13 #18 #38 #40 #53 #30)
- **BR-S3** All containers (cards, images, buttons, inputs, dialogs, drawers, tabs) shall have square corners (`border-radius: 0`). (#61 #67)
- **BR-S4** The signal motif may be used at large scale as a cropping/mask device on hero or section media *only* in its stepped quarter-arc form, never as a plain circle. (#34 #53)

### 3.2 Color — BR-C

Palette (from the concept token files, which mirror the brand guide):

| Token | Hex | Role in Concept 05 |
| --- | --- | --- |
| Civic Blue | `#041054` | **Primary.** Headlines, primary buttons, nav text, footer background, dark sections. |
| Signal Green | `#00B609` | **Secondary accent only.** The exact brand green; headline highlight word, focus rings, active states, the hover ring on the map, small markers. Target ≤10% of any viewport. |
| San Joaquin Gray | `#354846` | Body copy, secondary text. |
| Fargo Gray | `#C1C6C8` | Rules, borders, disabled states. |
| Paper | `#F4F5F7` / white | Page and card backgrounds. |
| Spenser Blue | `#2F96D1` | **Reserved** for Pathways-brand references only; never for headlines or UI. |

- **BR-C1** Blue leads; green supports. No section shall read as "green" overall (no green section backgrounds, no large green fills). (#72 #68 #37 #73)
- **BR-C2** Only the brand green shall be used; no off-brand greens, no "dulled" or desaturated blues, no brown, tan or faded secondary tones. (#68 #55 #58 #60)
- **BR-C3** No colored drop shadows, glows or tinted bars that are not part of the brand. Shadows, where needed, are neutral and subtle. (#27 #74)
- **BR-C4** Light blue (Spenser) appears only when the Pathways brand is referenced. (#51)
- **BR-C5** Text on color shall meet WCAG AA; blue-on-green combinations are prohibited. (#22)

### 3.3 Typography — BR-T

- **BR-T1** Display typeface: **Fjalla One** for H1 and H2. (#54)
- **BR-T2** H1 is set in **all caps**. Recommended: H2 also all caps in Fjalla One; H3 and below in the body typeface, sentence case. One casing rule applied everywhere — no mixed casing from header to header. (#31 #24 #57) *Open decision D5.*
- **BR-T3** Body typeface: **Geist** (per the Dycom Brand Guidelines "Type" section; supersedes the earlier DM Sans note — the brand pairs Fjalla One with Geist). No italics anywhere, including emphasis within headlines. (#66)
- **BR-T4** Minimum sizes: body 17px desktop / 16px mobile; supporting copy and captions 14px; nothing below 13px. Line length ≤ 70 characters. (#46 #49 #19 #76)
- **BR-T5** Headline scale: H1 56–72px desktop (smaller than Concept 01's), H2 40–52px, H3 24–28px. (#83 #26)

### 3.4 Buttons, links and arrows — BR-B

- **BR-B1** Button shape: **square-cornered** (Recommended; *open decision D1* — Jillian asked for pills #22 #35, Hillary's reply kept square open). One shape for the whole system.
- **BR-B2** Variants: primary (Civic Blue fill, white text), secondary (Civic Blue outline), inverse (white on dark). Height 48–52px, horizontal padding 24px, label 15–16px medium weight, no heavy or oversized buttons. (#22)
- **BR-B3** Any text link that performs a primary action (open roles, view results, see resources) shall be a button, not a small inline link. (#43 #44)
- **BR-B4** Arrow semantics (Recommended; *open decision D2*): `→` = in-page jump, next step or another page of this site, on buttons, cards and body text links; navigation and footer lists carry no arrows; `↗` (up-right) = leaves the site (operating-company websites only); no decorative arrows; nothing carries an arrow that does nothing. Dropdown and select indicators are a plain downward chevron that rotates when open (user rule, Oct 22 2026, superseding #38 #40: the signal is never used as an arrow). (#57 #70 #38 #40)
- **BR-B5** Hover/active highlight motion (user direction, Oct 22 2026): the Signal Green bar on buttons, nav triggers, mega-menu links, pathway cards, stage nodes, trade rows and intent tabs **draws in** (left→right, or top→bottom on vertical bars) over ~0.4s with a soft ease-out and retracts the same way; it never snaps on. Arrows on pathway cards and trade rows nudge 4px on hover. On touch devices (`hover: none`) a tap leaves no bar behind. Dialogs and drawers animate in and out (drawers slide from the right over 0.4s, dialogs fade/rise over 0.32s, backdrop fades; exit ≈0.26s before the dialog actually closes); accordion panels animate height and opacity open (0.38s) and closed (0.3s) with the chevron rotating on the same curve. Reduced motion and the page's Motion-off control disable all of it.

### 3.5 Imagery and media — BR-M

- **BR-M1** Photography: real Dycom field work and communities (existing brand library: crew, construction, community, career, safety, worker, wireless). No illustration, no orbs, no road graphics, no isometric scenes. (#15 #59)
- **BR-M2** Images are square-cornered; the only permitted mask is the signal motif (BR-S4).
- **BR-M3** Hero carries silent looping video with a poster; a still-image variant of the hero must be supported by the same layout. (#50 #83) *Open decision D4.*

## 4. Information architecture and navigation

### 4.1 Global header — NAV

- **NAV-1** Base: Concept 04 header (both reviewers' favorite). Sticky, light, logo left, groups center/right, primary action right. (#32 #78)
- **NAV-2** Groups and labels: **Who we are** (renamed from "About" #78) · **What we do** · **Our companies** · **People & careers** · **Investors** (a full group, no longer a plain link). Primary action: **Find a job** (opens the roles drawer). Order: Who we are, What we do, Our companies, People & careers, Investors.
- **NAV-3** Each group opens a mega panel: intro line, explainer copy and an "overview" text link to the group's landing page on the left; 2–4 titled link columns on the right (Jillian's reply on #32). Panel content is editable, including intro text. (#33) Below 1280px the intro becomes a full-width top row so four columns still fit.
- **NAV-4** Navigation is the **future-state sitemap** (user instruction, Oct 22 2026): every page of the current dycomind.com, organized once under the five groups (see §4.2). Header, mobile sheet and footer link only to site pages; they never anchor into homepage chapters. In-page jumps remain only inside the homepage body (pathway tiles, chapter buttons). (#36)
- **NAV-5** Dropdown indicator and any arrows follow BR-B4; square corners; no pill search field.
- **NAV-6** Mobile: full-height sheet whose top bar is the site header's exact size and layout (logo left, close control where the menu button was — no jump when opening) with the same five groups as accordions holding **only the titled link columns** (no intro, description or overview link — user direction, Oct 22 2026); the open group is marked only by its rotated chevron and the revealed columns (a vertical green bar was tried and removed — user direction, Oct 22 2026); Find a job as a full-width primary button; keyboard navigable, closes on selection.
- **NAV-8** Navigation and footer lists carry no arrows; the group's overview text link carries `→` per BR-B4.

### 4.2 Future-state sitemap — SITE

All pages of the current dycomind.com (page sitemap, Sept 2026) placed once by audience intent. Paths are relative to the site root; pages outside this phase are rendered unavailable in the preview. Source of truth: `src/lib/site.ts`.

| Group | Landing | Columns and pages (current-site source in parentheses) |
| --- | --- | --- |
| Who we are | `who-we-are/` (about-us) | **About Dycom:** Purpose & values (about-us), Leadership (investors/executive-officers), Sustainability (sustainability), News (news-release) · **How we work:** Headway® safety (about-us/safety), RIGHTWAY™ quality (about-us/quality), Hazard recognition (hazard-recognition), Contact (contact-us) |
| What we do | `what-we-do/` | **Plan & design:** Engineering, Project management · **Build & connect:** Wireline construction, Wireless construction, Fulfillment · **Maintain & protect:** Utility locating, Maintenance & restoration (all seven what-we-do/* pages) |
| Our companies | `companies/` (about-us/companies) | **Find a company:** Company directory, Contact a company · **Suppliers:** Inventory terms of purchase, Fleet terms of purchase |
| People & careers | `careers/` (careers-home) | **Join us:** Open roles (opportunities), Explore the trades (new, from the homepage trades chapter), Our recruitment process · **Life at Dycom:** Life & development (life), Benefits · **For employees:** Employee handbook (handbook), Benefit plan disclosures |
| Investors | `investors/` | **Financials & filings:** Quarterly reports, Annual reports, SEC filings, Stock information (stock-quote-historical-price-lookup) · **Governance:** Governance overview, Board of directors, Board committees, Governance documents · **News & events:** Investor news, Events & presentations, Analyst coverage · **Shareholder resources:** Shareholder services, Investor FAQs, Document request, Email alerts (sign-up-for-investor-email-alerts), Contact Investor Relations (contact-ir) |
| Utility | — | Privacy policy, Terms of use |

Not carried: `investors/sec-filing/` (duplicate of SEC filings). Executive officers sit under Who we are › Leadership rather than Investors so leadership is found by every audience.

### 4.3 Homepage chapter order — IA

| # | Chapter | Anchor | Source component | Purpose |
| --- | --- | --- | --- | --- |
| 1 | Hero | `#top` | C01 above-the-fold structure | Who Dycom is, in one line, with film |
| 2 | Pathways | `#pathways` | C01 pathways bar + C04 intent selector, merged | Route four audiences in one component |
| 3 | Who we are | `#who-we-are` | New, short | Company, purpose, values in 60 words |
| 4 | Our companies | `#companies` | C04 layout + C02 map texture/hover | Operating companies map, cards, directory |
| 5 | What we do | `#what-we-do` | C04 tabs + C04 process component | Work, in three tabs, then the five-stage route |
| 6 | How we work | `#how-we-work` | C04 safety section, retitled and compacted | Headway® and RIGHTWAY™ |
| 7 | People & careers | `#careers` | C02 side drawer, demoted; C04 careers copy | Careers utility, trades, open roles |
| 8 | Investors & resources | `#investors` | C02 investors layout + C04 Resource Center | Investor hand-off and resource groups |
| 9 | Closing | `#contact` | One closing next step | Contact |
| 10 | Footer | — | C01 footer | Site map |

The "Meet the people" standalone section (#86) and the large "safety and employees" information block (#71) are removed; their useful links move into chapters 7 and 8 (*open decision D3*).

## 5. Section specifications

Each section lists: requirement IDs, functional requirements (F), visual requirements (V), content (C), and acceptance criteria (AC).

### 5.1 Hero — HERO

Base: Concept 01's above-the-fold ("my favorite above-the-fold look" #83): headline + video + the pathways bar directly beneath.

- **HERO-F1** Layout: headline block and video side by side on desktop (headline left, media right, media ≥ 48% width); stacked on mobile with the headline *smaller* so the video is visible without scrolling. (#83 #26)
- **HERO-F2** Media: silent loop with poster (`hero-loop.mp4`/`hero-poster.webp`), pause/play control, respects reduced motion; "See our people at work" opens the full brand film in a square-cornered dialog. Still-image variant supported (BR-M3).
- **HERO-V1** Headline in Fjalla One, all caps, Civic Blue with one highlight word in Signal Green — Concept 04's blue + green treatment. (#31)
- **HERO-V2** Remove Concept 01's circular video stamp and nested rounded signal frame; replace with the signal mark at large scale (stepped quarter-arcs) as the media accent. (#48 #53 #30)
- **HERO-V3** Remove the colored/navy bar's non-brand treatment; the pathways bar beneath the hero is restyled per 5.2. (#74)
- **HERO-C1** Headline (working): "BEHIND THE WORK THAT CONNECTS **AMERICA**." Supporting line: "Engineering, construction and maintenance for the nation's networks, delivered by local operating companies working to one standard." Primary button: "Explore our companies" (→ #companies). Secondary: "What we do" (→ #what-we-do).
- **AC** Headline ≤ 2 lines at 1280; video visible above the fold at 390×844; no circular element in the hero; headline color sampled = `#041054` + `#00B609`.

### 5.2 Pathways — PATH

Merges Concept 01's four-route strip ("first look" #77) with Concept 04's "What brings you here?" intent selector (#42) into one component directly under the hero.

- **PATH-F1** Four audiences, each a square tile with label, one-line detail and `→`: **Customers & partners** (→ #what-we-do), **Job seekers** (→ #careers), **Investors** (→ #investors), **Communities & suppliers** (→ #contact).
- **PATH-F2** Selecting a tile is a single in-page jump (no multi-state panel is required on the homepage; the intent panel from Concept 04 lives in the closing section).
- **PATH-V1** Civic Blue band, white type, Signal Green hover/active edge; no light blue; tiles square; labels Fjalla One all caps 18–20px; details 15px.
- **AC** Four tiles fit on one row at ≥1024, 2×2 at 600–1023, 1 column below; each tile keyboard focusable with visible focus ring.

### 5.3 Who we are — WHO

New, short chapter answering "lead with the general business" (#14 #85) and the "Who we are" label (#78).

- **WHO-C1** One H2 (e.g. "THE PEOPLE CONNECTING AMERICA.") plus ≤ 60 words: incorporated 1969, specialty contracting for telecommunications infrastructure and utilities, 20,000+ employees, operating companies with their own names and local relationships. Facts come from `docs/dycom-context-inventory.md` qualifications; no unsupported totals.
- **WHO-C2** Six values listed inline as text (People, Safety, Integrity, Innovation, Customer Focus, Sustainability) — not as icon circles.
- **WHO-V1** Paper background, two columns on desktop at 5:7 (headline + photograph / copy, facts, values, button), one on mobile; the photograph fills the left column as a square crop (≈ 450–520px on desktop, no longer a 270px thumbnail). The six values sit on one line at ≥1280px viewports (16px at ≥1366px, 15px between 1100–1365px) and may wrap on smaller devices (user direction, Oct 22 2026).

### 5.4 Our companies — MAP

Concept 04's company layout and pop-out cards are the favorite (#39 #64); Concept 02's dotted map texture and hover ring are the favorite look and interaction (#13 #79 #80).

- **MAP-F1** Data: the canonical 39 companies / 31 home-office locations (`lib/dycom-network-map/src/companies.ts`, `map-geometry.json`). Offices are home offices, not service territories — keep that disclaimer.
- **MAP-F2** Rendering: SVG map of the lower 48 with Concept 02's halftone dot fill and dotted state outlines; office markers are small plain Civic Blue squares (no signal mark on the map — user rule, Oct 22 2026), grouped where companies share a city with a shared-location count. No MapLibre/basemap dependency is required for the homepage; no auto-zoom/fly-to on selection. (#65)
- **MAP-F3** Interaction model (Recommended; *open decision D6*): **hover/focus** a company row or marker → that company's office location pulses with Concept 02's expanding, fading Signal Green ring (square geometry, ~2.8 s loop while active) and the row highlights (#13 #80); the selected company's location keeps pulsing while its card is open; when nothing is engaged, a quiet staggered idle blink cycles through locations (the "blinking map", #13); all motion falls back to a static ring under `prefers-reduced-motion`. **Click** → the company card opens (name, home office, what they do, careers, "View open roles", "Official website") (#39 #64); no "Reset view" button is needed because the view never moves. (#65)
- **MAP-F4** Map is larger than Concept 04's (≥ 60% of content width on desktop) with a larger key; the key is the single explanation of the markers — remove the duplicate list item that repeats the key. (#64 #65)
- **MAP-F5** Directory panel: search by city/ZIP/company, region filter, company rows "Name — City, ST · N open roles →"; empty state "No companies match".
- **MAP-V1** Navy map on paper, dots in a lighter blue of the Civic family (not Spenser light blue), markers Civic Blue, Signal Green when hovered/selected; square panel and card; no textured/rough Concept 03 treatment. (#21)
- **MAP-C1** H2 "SCALE IS LOCAL. CAPABILITY IS NATIONAL." Intro from Concept 04. Footer button "All companies →" (site page).
- **AC** Hovering or focusing a row pulses the matching marker(s) and vice-versa; the open card's location keeps pulsing; clicking opens the card without the map moving; markers are plain squares containing neither circles nor the signal mark; the map key describes the square as a home-office location without referencing the signal; animation is disabled under reduced motion; role counts read as "N open roles" with no illustrative label.

### 5.5 What we do — WORK

Concept 04's tabbed "our work" section is "the best" (#81 #41) followed by its process component (#45); Concept 03's tab-to-mobile behaviour is reused (#17). The repetitive block above it is merged away (#82).

- **WORK-F1** Tabs: **Plan & design**, **Build & connect**, **Maintain & protect**, with room for more (component supports 3–6 tabs); tab labels carry no trailing signal mark (user rule, Oct 22 2026). Each panel: photograph, H3, 40–60 words, three check-list items, "Related services" (links to the site's service pages →), one button "Explore the trades →" (→ #careers).
- **WORK-F2** Mobile: the tabs are a **horizontal slider** — one row that scrolls sideways with snap points, each tab ~62% of the viewport so the next one peeks in; the active tab is scrolled to centre when it changes; the whole strip is a full-bleed white row on the paper band (not a white active tab on grey) (user direction, Oct 22 2026; supersedes the Concept 03 2-column grid from #17/#111). Keyboard arrow-key navigation is unchanged.
- **WORK-F3** Process component ("From survey to service.") directly after the tabs: five stages (Survey & plan, Locate & prepare, Build & connect, Test & restore, Maintain & respond) on one horizontal route with numbered square nodes centred over their labels; on mobile the route stays horizontal as the same kind of slider (five stops, ~38% viewport each, line segments between them) rather than stacking (user direction, Oct 22 2026). Each stage panel is a card with a photograph (left, 2:3 of the width), a "Stage 0n of 05" eyebrow, H3, **2–3 sentences (40–55 words)** of plain-language description, a "Services involved" row of square chips naming the Dycom services at that stage, and Previous/Next buttons on a rule at the bottom; all five panels share one height (user direction, Oct 22 2026: longer copy and more visual polish). Photographs: planning (C03 field-planning), street (C04 community), construction, worker, wireless (C04 640px source; replace with a higher-resolution tower photograph when available).
- **WORK-V1** Tab list uses a Civic Blue underline/active bar (no pills), labels 16px; check icons are square/arc glyphs, not circles.
- **WORK-C1** H2 "LOCAL EXPERTISE. EVERY STEP OF THE WAY." Copy from Concept 04 as reviewed.
- **AC** Only one capability/process block exists on the page; tabs reachable by keyboard; on mobile the tab strip and the route strip scroll horizontally without the page itself overflowing sideways.

### 5.6 How we work — HOW

Concept 04's safety section retitled; "safety and employees" is a weird title (#71), and large informational-only blocks go (#76 #70).

- **HOW-F1** One compact two-column band: H2 "SKILLED WORK. SAFE EVERY DAY." with Headway® safety and RIGHTWAY™ quality as two short items (≤ 40 words each) and two buttons: "Our approach to safety →", "Our approach to quality →" (site pages).
- **HOW-V1** One photograph from the Dycom photography library (lineworker checking the line overhead, `z9b_1574`), square. No numbered bullet discs.
- **AC** Section height ≤ 560px desktop; no standalone "box with no purpose" (#76).

### 5.7 People & careers — CAREERS

Concept 02's side drawer and role browsing are liked (#16 #29); the job-seeker-first framing is not (#14 #85). Careers becomes a utility chapter lower on the page; "Meet the people" is cut (#86).

- **CAR-F1** On mobile the trade rows show only their heading (no supporting sentence) — user direction, Oct 22 2026. Left: H2 "SKILLED PEOPLE. WORK THAT CONNECTS AMERICA." + 50 words + buttons "Browse open roles →" (opens drawer) and "Life at Dycom →" (site page). Right: trade entry — five trade tiles (Underground construction, Aerial construction, Fiber splicing, Utility locating, Engineering & project support), each opens the drawer pre-filtered.
- **CAR-F2** Drawer (right side sheet, square corners): "FIND YOUR CREW." filters Work / Where / Trade / Company, removable filter chips (square), 10 results then "Show more"; row = title, company, location, schedule, `→`; empty state; no reviewer-facing disclaimer in the drawer (client instruction, Oct 22 2026). Stats reduced to a single count line (#29).
- **CAR-F3** The drawer is also the target of "View open roles" in the company card (MAP-F3).
- **CAR-V1** Paper/white band; a row of three square trade thumbnails under the buttons (`z9b_1407` tool belt, `z9b_7549` copper splicing, `z9a_0445` warehouse cable rack, from the Dycom photography library) rather than one tall photograph, so the left column matches the trade list in height (user direction, Oct 22 2026); no stats tiles, no orbit decoration.
- **AC** Drawer opens from hero? No — only from this chapter, the company card and the header's Find a job on mobile; focus is trapped and returned; no people-portrait carousel exists.

### 5.8 Investors & resources — INV

Concept 02's investors layout is the favorite (#52); Concept 04's resources section is liked (#87); small text links become buttons (#43 #44).

- **INV-F1** Left: H2 "LOCAL EXPERTISE. NATIONAL SCALE." + 50 words (NYSE: DY) + primary button "Investors overview →" (site Investors page) and secondary "Financials & filings →".
- **INV-F2** Right: three square investor tiles — **Results & reports**, **Events & presentations**, **Investor news** — each with a two-line description and a button, no live market data.
- **INV-F3** Resource Center below: four groups (Corporate reports; Safety & employees; Suppliers; Candidates) as four square columns, each ≤ 4 links to site pages with `→`; the hazard link is labelled plainly "Hazard recognition" (no language note — user direction, Oct 22 2026); the group heading "Safety & employees" is retained only here as a resource label (#71).
- **INV-V1** Civic Blue band for investors (white type, green accents); paper band for resources.
- **AC** No inline text link performs a primary action; no link points at dycomind.com or its IR/careers hosts.

### 5.9 Closing — CLOSE

One closing next step (project rule: no competing endings). Concept 04's "What brings you here?" intent selector (#42) lives here as the contact router.

- **CLOSE-F1** H2 "LET'S GET TO WORK." + square toggle group: Customer or project · Careers · Supplier · Community; each shows a one-line prompt and one button (Contact Dycom → / Search jobs, opens the roles drawer / Read purchasing terms → / Contact Dycom →). If a company was selected on the map, the Customer prompt names it.
- **CLOSE-V1** White on Civic Blue; no orbit rings (#34 #48); no gap above/below larger than the standard section rhythm (#69).

### 5.10 Footer — FOOT

Concept 01's footer is the favorite: "clean and easy to understand" (#47).

- **FOOT-F1** Five columns mirroring the sitemap groups (§4.2): **Who we are** · **What we do** (All services + the seven services) · **Our companies** · **People & careers** · **Investors** (overview, reports, filings, governance, news, events, IR contact); ≤ 8 links per column, no anchors into homepage chapters. Logo + tagline left; bottom row © year, Privacy policy, Terms of use, motion on/off. No "Visit dycomind.com" link.
- **FOOT-V1** Civic Blue background, white/Fargo text; one casing rule (column titles all caps Fjalla One 14px; links sentence case) (#57 #24); arrows only per BR-B4; verify "TPCA" spelling in any content reused (#56).
- **AC** Every footer link is a site page; no footer link anchors into the homepage; no arrow is decorative.

### 5.11 Investors overview page — IRP (added Oct 22, 2026, user direction)

The Investors overview (`investors/`) is the first internal page built in Concept 05. It is Concept 02's Investors page — Hillary's "favorite investors layout and design" (#52) and the results module Jillian loved (#23) — rebuilt on the Concept 05 system. Pins that shaped it: buttons instead of small, buried text links (#43 #44); blue as the main colour with green as accent (#72 #37); brand shapes only — no circles, dots, rotated-square geometry or coloured drop shadows (#20 #27 #84 #48); all-caps Fjalla One H1/H2 (#24 #31 #54); readable weight on blue (#114); no job-seeker framing (#14 #85). Content figures come from `docs/dycom-investor-sources.md` (official hub as rechecked Oct 19, 2026); they are a static snapshot, never a live feed.

- **IRP-F1** Route: exact `investors/` (and `investors` normalised to it) rendered client-side alongside the homepage; every other sitemap path still renders unavailable in the preview. Header brand and footer logo return to the homepage; "Find a job" opens the roles drawer here too; the footer motion toggle works on both pages.
- **IRP-F2** Hero on Civic Blue: "Dycom home" back link, H1 "INVESTORS", the company overview paragraph, and a listing block (signal mark, "LISTED", "NYSE: DY" in Fjalla One, scale sentence) on a Signal Green rule. Below, an on-page jump row — 01 Results · 02 Reports · 03 Events · 04 News · 05 Resources — with green draw-in underlines; a single column on phones.
- **IRP-F3** 01 Results: section head with green index numeral and a dated note; three metric tiles (contract revenues $2.006 billion, net income $115.6 million, diluted EPS $3.81 GAAP) whose green top bars sweep in on load (static when motion is off); the four-document results package (release, presentation materials, outlook summary, transcript) as paper cards with a Civic left rule that turns green on hover, each opening the Quarterly reports page; a Civic "Results call replay" panel with buttons to the event and the results release.
- **IRP-F4** 02 Featured reports on paper: three typographic report cards — Q2 2027 Investor Presentation as the Civic lead card, 2026 Annual Report, 2026 Proxy Statement — each with its reporting label, a one-line description and an "Open report" button. No cover artwork is invented; official thumbnails are not hot-linked.
- **IRP-F5** 03 Events and 04 Investor news side by side: a square-node timeline of the four dated events (the most recent node green) with a "Webcast" text link where one exists, and a ruled news list with `→`; each column ends in a primary button to its listing page.
- **IRP-F6** 05 Filings, governance & shareholder resources: the Investors group of the sitemap (§4.2) rendered with the homepage Resource Center component, so every investor page is reachable once from the overview.
- **IRP-F7** Closing Civic band "STAY INFORMED." with Email alerts (primary) and Contact Investor Relations (secondary) buttons, then the global footer.
- **IRP-V1** Civic Blue leads (hero, call panel, lead report card, closing); Signal Green only as accent (index numerals, listing rule, metric bars, hover draw-ins, latest timeline node); square corners; Fjalla One all caps for H1/H2, ticker, metric values and report titles; Geist elsewhere; body on blue at Medium (BR-T8).
- **AC** No link on the page leaves the site (0 external anchors); every document, event and news item opens a sitemap page; metrics match the evidence register; the page passes the same reduced-motion and keyboard rules as the homepage (jump links, cards and buttons all focusable with the green ring; heading receives focus after client-side navigation).

## 6. Responsive and mobile requirements — RESP

- **RESP-1** Breakpoints: ≥1280 desktop, 768–1279 tablet, ≤767 mobile; the reviewers used 1440 and 390.
- **RESP-2** Mobile hero headline ≤ 40px so the video appears above the fold (#26).
- **RESP-3** The signal motif in the hero uses the angular brand version on mobile (#30).
- **RESP-4** Section headers align to one left margin on mobile; no misaligned header pairs (#75).
- **RESP-5** No component overlaps or collapses on mobile; the bug seen in Concept 01's mobile component (#28) is a regression test case.
- **RESP-6** Mobile nav sheet, drawer and dialogs cover the viewport with square edges and a visible close control.

## 7. Interaction, motion and accessibility — IXA

- **IXA-1** Motion is restrained and purposeful: section reveals, tab/panel fades, map hover ring. No auto-moving map, no parallax that shifts text. Respect `prefers-reduced-motion` and the footer motion toggle.
- **IXA-2** All interactive elements have 44×44 touch targets, visible focus (Signal Green outline), and keyboard operation (tabs with arrow keys, dialogs with focus trap and return).
- **IXA-3** Color contrast AA for all text; no information conveyed by color alone (engaged markers also gain the pulsing ring, and the matching directory row highlights).
- **IXA-4** Video is muted and never plays audio; brand film dialog is user-initiated.

## 8. Content and copy rules — COPY

- **COPY-1** Spelling: "telecommunications" (#63); verify every acronym (TPCA #56).
- **COPY-2** No eyebrows above headings (existing C04 rule); H1/H2 carry the message.
- **COPY-3** No reviewer-facing notes, disclaimers or process references appear in the visible UI (client instruction, Oct 22 2026); sample data stays sample in code and copy never implies live quotes or vacancies.
- **COPY-4** Voice: plain, confident, local-to-national; avoid recruiting-first language above the fold.

## 9. Open decisions for the client (with recommended defaults used in the mockup)

| ID | Decision | Options | Recommended default | Pins |
| --- | --- | --- | --- | --- |
| D1 | Button shape | Pill / Square | **Square** (consistent with "no rounded shapes") | #22 #35 (+ reply) |
| D2 | Arrow meaning | External only / In-page only / Both with distinct glyphs | **Both:** `→` in-page and site pages, `↗` only for operating-company websites | #57 #70 #38 |
| D3 | Secondary sections | Keep / cut "How we work" and "Meet the people" | **Keep "How we work" (compact); cut "Meet the people"** | #71 #86 #76 |
| D4 | Hero media | Video / Still / Both supported | **Video with still variant** | #50 #83 |
| D5 | Casing below H1 | All caps H2 / Sentence-case H2 | **All caps H1 + H2; sentence case H3+** | #24 #57 |
| D6 | Map interaction depth | Hover-reveal + click card / Click only | **Hover reveals offices, click opens card** | #64 #80 |
| D7 | Green proportion | Accent only / Section fills allowed | **Accent only (≤10%)** | #72 #68 |

## 10. Acceptance checklist for the Final Review build

1. Every rejected element is absent: circles, dots, pills, rounded corners, brown/faded tones, colored shadows, italics, light-blue headlines, job-seeker-first hero, duplicate capability blocks, "Meet the people" section, orbit rings, auto-zooming map.
2. Every liked element is present: C04 nav with "Who we are", C01 above-the-fold with smaller headline, merged pathways, C04 company layout with C02 dotted map and hover ring, C04 work tabs + process route, C02 careers drawer (demoted), C02 investors layout, C04 resources, C01 footer, blue + green all-caps Fjalla One headlines.
3. Brand tokens sampled from the build match §3.2; headline font is Fjalla One; smallest text ≥ 13px.
4. Desktop 1280/1440 and mobile 390 reviewed; the four mobile pins (#26 #28 #30 #75) have no equivalent.
5. Open decisions D1–D7 are shown with their defaults and listed on the review agenda.

## 11. Traceability — pins to requirements

| Pin | Requirement |
| --- | --- |
| 12 77 | PATH |
| 13 79 80 | MAP-F2 MAP-F3 |
| 14 85 | P2 WHO CAR |
| 15 19 21 58 59 60 | BR-M1 MAP-V1 BR-C2 |
| 16 29 | CAR-F2 |
| 17 | WORK-F2 |
| 18 20 84 | BR-S1 BR-S2 |
| 22 35 | BR-B1 BR-B2 D1 |
| 23 52 | INV IRP |
| 24 54 57 | BR-T1 BR-T2 FOOT-V1 |
| 26 28 30 75 | RESP-2 RESP-5 RESP-3 RESP-4 |
| 27 51 55 74 | BR-C3 BR-C4 BR-C2 HERO-V3 |
| 31 | HERO-V1 BR-T2 |
| 32 36 78 | NAV-1 NAV-4 NAV-2 |
| 33 | NAV-3 |
| 34 48 53 61 67 | BR-S1 BR-S3 HERO-V2 |
| 37 68 72 73 | BR-C1 BR-C2 D7 |
| 38 40 | BR-B4 BR-S2 |
| 39 64 65 | MAP-F3 MAP-F4 |
| 41 81 | WORK-F1 |
| 42 | PATH CLOSE-F1 |
| 43 44 | BR-B3 INV IRP |
| 45 | WORK-F3 |
| 46 49 66 | BR-T4 BR-T3 |
| 47 | FOOT |
| 50 | BR-M3 D4 |
| 56 63 | COPY-1 |
| 69 | CLOSE-V1 |
| 70 71 76 82 86 | P4 HOW CAR D3 |
| 83 | HERO-F1 BR-T5 |
| 87 | INV-F3 |

## 12. Source component map (for the build team)

| Concept 05 part | Port from | Notes |
| --- | --- | --- |
| Header / mega menus / mobile sheet | `artifacts/dycom-concept-04/src/components/site-header.tsx` | Rename About → Who we are; re-skin per §3 |
| Hero layout | `artifacts/dycom-concept-01/src/components/Hero.tsx` | Drop `.dycom-video-stamp` and `.dycom-signal-frame`; headline per HERO-V1 |
| Pathways | `artifacts/dycom-concept-01/src/components/Stats.tsx` + C04 `ClosingContact` | Merge into one four-tile band |
| Companies map | C04 `network-explorer.tsx`, `company-dialog.tsx`; C02 `home/Story.tsx` (Network) | Data: `lib/dycom-network-map/src/companies.ts`, `map-geometry.json`; SVG only |
| Work tabs + process | C04 `pages/Home.tsx` (capabilities) + `home-extras.tsx` (WorkLifecycle); C03 `home/TheWork.tsx` mobile grid | 3 tabs now, built for 6 |
| How we work | C04 `pages/Home.tsx` (safety section) | Compact to two items |
| Careers + drawer | C02 `home/RolesSheet.tsx`, `lib/jobs.ts`; C04 `home-extras.tsx` (OpportunityEntry) | Drawer opened from chapter, card and mobile nav |
| Investors + resources | C02 investors tiles; C04 `home-extras.tsx` (ResourceLinks) | Buttons, not text links |
| Closing | C04 `home-extras.tsx` (ClosingContact) | Remove orbit |
| Footer | `artifacts/dycom-concept-01/src/components/Footer.tsx` | Column titles all caps; links sentence case |
| Brand assets | `artifacts/mockup-sandbox/public/images/dycom-brand/*`, Fjalla One from `artifacts/dycom-concept-02/public/fonts/FjallaOne.woff2`, signal mark from `Dycom_Design_System` zip | — |

---

## 13. Addendum — Damion Hendricks review (October 22, 2026)

**Input:** 28 pins + 2 replies by Damion Hendricks on Concepts 01–04 (export `icreon-feedback-2026-10-22`), mapped to sections by pin position against measured section boundaries at 1440 / 390. Status is against the Concept 05 build on Oct 22, 2026.

### 13.1 Already met by Concept 05 (no change)

| Pin | Concept · section | Note | Why it is met |
| --- | --- | --- | --- |
| #90 | C01 · Our companies (desktop) | Centre the map in its space | MAP: the map is centred in its own panel; the directory is a separate column |
| #95 #107 | C01/C02 · map (mobile) | Map cut off / blinking marks without the map for reference | The whole lower 48 is visible at 390 with the markers on it |
| #94 | C01 · Pathways (mobile) | Left-align, consistent arrows | PATH tiles are left-aligned, one arrow size |
| #100 #117 | C01/C04 · small text (mobile) | Disclaimer and mobile sizes too small | BR-T4: nothing below 14px; the disclaimers are gone (§1) |
| #105 | C02 · network list (mobile) | No jump on hover | Company rows highlight with an inset edge; no size change |
| #112 | C03 · resources (mobile) | Stack the links vertically | Resource Center is one column on mobile |
| #116 | C04 · network (mobile) | Two-column list is cramped; location above the company info | Mobile directory is one column: filters stacked above the list, each row name + city |
| #111 | C03 · work (mobile) | Likes the mobile work component | WORK-F2 adopts it |
| #64 (reply) | C04 · map | Seconds hover-to-show offices | MAP-F3 |
| #108 | C03 · hero | No gradients; angular, defined shape | HERO-V2 uses the stepped mark; the only gradient is the neutral media shade |
| #102 #103 #104 | C02 · crew / status / stats slider | Remove map links from crew; fixed slider width; mobile sliding | Components not carried into Concept 05 |
| #26 (reply) | C01 · hero (mobile) | “Might change with the font” | Brand type now in place (Fjalla One + Geist) |

### 13.2 Enrichments built on Oct 22, 2026 (traceable requirements)

| Req | Pin | Requirement |
| --- | --- | --- |
| **BR-T6** | #92 #98 | H1/H2 line-height shall be ≥ 1.05 so descenders and ascenders on adjacent lines never collide (was 0.98; now 1.06). |
| **BR-T7** | #96 | Fjalla One headings carry slightly more tracking on mobile (≈ 0.01em). |
| **BR-T8** | #114 | Body copy on Civic Blue backgrounds (Pathways, Investors, Closing, Footer) is set at Geist Medium (500) so it reads clearly on colour. |
| **BR-B5** | #97 | One inline-link style everywhere: underline with a consistent 5px offset and 1px thickness. |
| **MAP-F6** | #113 | The company list scroll window shows six rows on desktop (was four). |
| **MAP-F7** | user, Oct 22 2026 | No map on phones (≤767px): the summary line ("39 local names · 31 home-office locations") stays above the directory; the SVG map, key and attribution are not rendered. |
| **WORK-F4** | #106 #103 | Tab and process panels keep a stable height when the selection changes (all panels stay mounted in one stacked grid cell; inactive panels are hidden from view, focus and assistive tech). |
| **NAV-7** | #109 | Mega-menu intro heading reduced one step (≈ 22px) so it does not compete with the page. |
| **WHO-F2** | #101 | Add a company-wide stats row to Who we are: incorporated 1969 · 20,000+ employees · ~40 operating companies · NYSE: DY (figures from dycomind.com; see `docs/dycom-source-research.md`). |

### 13.3 Needs a client decision (open decisions D8–D12)

| ID | Pin | Question | Recommended default |
| --- | --- | --- | --- |
| D8 | #91 | Should capability tiles link to a list of the operating companies doing that work? | Not possible from the published directory (no company→service data). Recommend: each work tab links to the company map; a per-capability list waits on client data. |
| D9 | #88 | Should the trade tiles also link out to explainer content (blogs) for AEO/GEO? | Add a “Learn about this trade” link per tile once destination pages exist; out of scope for the homepage build. |
| D10 | #89 | Bring back the “Networks in everyday life” block (cut under P4) as an internal-linking section? | Keep it cut from the homepage; reconsider as an internal page. |
| D11 | #115 | Resource Center copy tweaks | Keep the component; Dycom to supply the wording. |
| D12 | user direction, Oct 22–23 2026 | How should the company map behave? The open question is the interaction, not the look: the Design System tile (`docs/dycom-design-system.md`, `/dycom-concept-05/design-system/explorations/company-map/`) builds six working interaction models — still atlas + directory, pan/zoom street map, 3D relief model, "near you" by distance, scroll-driven regional tour, state-tile index — each on its own path so pins land on the exact model. Styling finishes (land, marker, layout) are a footnote switcher on the component page. | Keep today's atlas + directory (01) until the client picks; 02, 03 and 05 would revise MAP-F7 and the no-auto-movement rule, 06 would replace the map with a cartogram. |
| — | #110 | Larger sub-heads for hierarchy | Already at 26px (BR-T5); no change unless the client wants a larger step. |

## 14. Addendum — Homepage content v0.1 (November 2026)

Dycom's homepage content template v0.1 (received November 2, 2026) was applied to the Final Design Direction homepage on November 3, 2026. It is a content pass plus three new sections; layout, brand, navigation and interactions stay as reviewed. The change-by-change record is `dycom-homepage-content-v0.1-changes.md` in this folder.

### 14.1 Copy applied as supplied (status: built)

| Req | Source (content v0.1) | Requirement |
| --- | --- | --- |
| **HC-1** | Hero | Eyebrow "Digital infrastructure leader"; H1 "Scale is Local" with "Local" in Signal Green; the new description; right button "Who we are" → `#who-we-are`. The hero's film dialog and "See our people at work" link are removed because the film now has one home on the page (HC-F1). |
| **HC-2** | Pathway band | Career Seekers · Customers · Investors · Communities, in that order, with the supplied lines. |
| **HC-3** | Who we are | Supplied paragraph; values heading "Our Values"; the six values and icons are unchanged. |
| **HC-4** | Facts band | 50 states / National coverage · 20,000+ / Skilled employees · ~40 / Operating companies · NYSE: DY / New York Stock Exchange. "1969" no longer appears on the homepage (WHO-F2 superseded). |
| **HC-5** | Companies map | Supplied intro ("over 500 field offices…"); map, directory, legend and counts unchanged (D18). |
| **HC-6** | Who we build for | Segment order Telecommunications providers · Cable operators · Wireless carriers · Utilities. |
| **HC-7** | Lifecycle | Heading "Expertise for the entire lifecycle" with the supplied intro; stage 1 "Design & engineering"; stage 3 adds Fulfillment and Electrical contracting; stage 4 "Maintain & restore" with Maintenance · Emergency response (D16). |
| **HC-8** | Page title | "Home \| Dycom" (D13). |

### 14.2 New sections (status: built)

| Req | Section | Requirement |
| --- | --- | --- |
| **HC-F1** | Brand video band (`#film`) | Full-width band between the facts band and the companies chapter: a poster frame from the brand film, square Signal Green play control, eyebrow "Our people at work" and the caption as H2. Plays in place, muted until sound is turned on, with native controls; nothing autoplays; honours the motion control. 16:9 on desktop and tablet, 4:3 on phones. |
| **HC-F2** | Four-card column (`#strengths`) | After What we do, on Civic Blue, no heading: four equal 4:3 photo cards (Scale is Local → Operating strengths; Built to Deliver → Our capabilities; Where Skill Meets Scale → Careers; Shaping What's Next → Resource Center). Four across on desktop, two by two at tablet widths, stacked on phones. |
| **HC-F3** | Brand statement (`#statement`) | White band before Who we build for: the signal mark in Signal Green beside one sentence at display size; no eyebrow, no button. Placeholder sentence until Dycom supplies the statement (D14). |
| **HC-9** | Sitemap | Two future-state pages added to the footer columns and the Design System site plan: Operating strengths (`who-we-are/operating-strengths`) and Our capabilities (`what-we-do/capabilities`). The mega menu is unchanged (D17). |

### 14.3 Decisions taken without a meeting (D13–D18)

| ID | Blank / ambiguity | Default applied |
| --- | --- | --- |
| D13 | SEO block empty | Title "Home \| Dycom"; real SEO values when Dycom fills the block. |
| D14 | Brand statement copy blank | Placeholder sentence from Dycom's own Who we are text box. |
| D15 | What we do labelled "Card Display (3 Column)" while the screenshot shows tabs | Keep the tabs. |
| D16 | Stage 4 "Maintain & restore" beside stage 5 "Maintain & respond"; stage 4 description still about testing | Applied as written; flagged. |
| D17 | Operating Strengths / Capabilities pages not in the sitemap | Added as future-state pages. |
| D18 | "Over 500 field offices" against a map of home offices | Copy as written; legend and counts keep saying home offices; flagged. |
