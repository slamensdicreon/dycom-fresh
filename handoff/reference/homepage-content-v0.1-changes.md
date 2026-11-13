# Final Design Direction — every change from Dycom's homepage content v0.1

**Source:** Dycom's homepage content template v0.1 ("JC", received November 2, 2026). **Target:** the Final Design Direction homepage in the review workspace (`/dycom-concept-05/v2/`). The document's screenshots are of this page, so it is a content pass plus three new sections; the layout, brand, navigation and interactions stay as reviewed.

No meeting, so every blank or ambiguity in the document is resolved here with a stated default (section 4). Those defaults are easy to swap when Dycom replies, and they are listed for Dycom in the review note (section 7) — never on the page itself.

Page order after the change (new items in bold):
Header → Hero → Pathway band → Who we are + Our Values → Facts band → **Brand video** → Companies map → What we do → **Four-card column** → **Brand statement** → Who we build for → Lifecycle → How we work → People & careers → Investors → Resource Center → Contact form → Footer.

---

**Status (November 3, 2026):** built in the Final Design Direction, Design System (`patterns/brand-bands/`), sandbox copy and handoff package. Items marked *As built* record where the build departed from this plan.

## 1. Copy changes to existing sections (exact text)

### 1.1 Hero
| Element | Now | Change to |
| --- | --- | --- |
| Eyebrow | Dycom Industries · Since 1969 | **Digital infrastructure leader** |
| Headline (H1, set in caps by the brand rule) | Behind the work that connects America. | **Scale is Local** — "Local" takes the accent colour the way "America." does today; no full stop (as supplied); the desktop line break is no longer needed |
| Description | Engineering, construction and maintenance for the nation's networks, delivered by local operating companies working to one standard. | **Dycom combines local expertise, national capability, and the skilled people to deliver critical infrastructure America depends on.** |
| Left button | Explore our companies → companies map | unchanged |
| Right button | What we do → What we do chapter | **Who we are** → Who we are chapter (`#who-we-are`) |
| Background film / poster | looping film + poster | unchanged (the document names them `hero-loop.mp4` / `hero-poster.webp`; same assets) |
| Film caption "Built for what's next. / America's networks, in motion" | | unchanged |
| "See our people at work" link | opens the brand film in a dialog | **removed** — the film has one home in the new brand video section (2.1), which sits one chapter below the hero; the dialog and its code are gone. *(As built: the plan had the link scroll to the band; a second route to the same film 400px away was not worth the extra control.)* |

Knock-on: "1969" no longer appears anywhere on the homepage (eyebrow and facts tile both drop it). It stays in the Who we are page content and the footer legal line.

### 1.2 Pathway band (four tiles)
| Position | Now | Change to | Links to |
| --- | --- | --- | --- |
| 1 | Customers & partners — From network design to construction and maintenance. | **Career Seekers** — **Explore career opportunities across our family of companies.** | `#careers` |
| 2 | Job seekers — Explore the trades and find your local crew. | **Customers** — **Learn more about our solutions and services** | `#what-we-do` |
| 3 | Investors — Results, reports and a national perspective. | **Investors** — **Find the latest news, reports and events** | `#investors` |
| 4 | Communities & suppliers — Connect with the people behind the work. | **Communities** — **See how we're supporting locally and nationally.** | `#contact` |

Copy is used exactly as supplied, including the two lines without a full stop. Order change means Career Seekers is first on desktop and top on phones.

### 1.3 Who we are
| Element | Now | Change to |
| --- | --- | --- |
| Eyebrow | Who we are | unchanged |
| Heading | The people connecting America. | unchanged |
| Paragraph | Incorporated in 1969, Dycom provides specialty contracting services for telecommunications infrastructure and utilities. More than 20,000 employees work through operating companies with their own names and local relationships, united by a purpose: connecting America. | **Dycom delivers solutions that build, connect, power, and sustain the digital and critical infrastructure that connects America and its essential industries, for today and tomorrow. Our scale is local: we combine national reach and resources with the regional knowledge and expertise of our 40 operating companies to partner with our customers and execute complex work across the full project lifecycle.** |
| Values heading | Six values. One Dycom. | **Our Values** |
| Six values + icons | People · Safety · Integrity · Innovation · Customer Focus · Sustainability | unchanged |

Layout check: the paragraph is about twice as long; the two-column grid must still balance against the values block at 1024 and 1440 (allow the paragraph column to run longer rather than shrinking type).

### 1.4 Facts band (numbers over photo)
| Tile | Now | Change to |
| --- | --- | --- |
| 1 | 1969 / Incorporated in Florida | **50 states / National coverage** |
| 2 | 20,000+ / Employees nationwide | 20,000+ / **Skilled employees** (the document's trailing full stop is dropped to match the other three labels) |
| 3 | ~40 / Operating companies | unchanged |
| 4 | NYSE: DY / Listed on the New York Stock Exchange | NYSE: DY / **New York Stock Exchange** |

Source note: the project's source-research notes record "all 50 states" as supplied by Dycom in content v0.1 (their Who we are text box), replacing the 1969 incorporation fact.

### 1.5 Companies map
| Element | Now | Change to |
| --- | --- | --- |
| Heading | Scale is local. Capability is national. | unchanged (not in the document) |
| Intro paragraph | Dycom brings together operating companies serving telecommunications infrastructure and utility customers across the United States. Select a home office to meet a company; office locations do not define service territories or capabilities. | **Dycom's family of companies have over 500 field offices across the U.S. Select a location below to learn more about area operating companies.** |
| Map, directory, filters, company card, legend | | unchanged. The legend still says "Home offices, not service areas" and the summary still counts home-office locations, so the page stays accurate while the copy says field offices (flagged, section 7) |

### 1.6 Who we build for
| Element | Now | Change to |
| --- | --- | --- |
| Eyebrow, heading, paragraph, photo | | unchanged |
| Segment order | Telecommunications providers · Wireless carriers · Cable operators · Utilities | **Telecommunications providers · Cable operators · Wireless carriers · Utilities** (descriptions travel with their titles) |

### 1.7 Lifecycle
| Element | Now | Change to |
| --- | --- | --- |
| Heading | From survey to service. | **Expertise for the entire lifecycle** |
| Intro | A typical network project connects these stages across teams. Select a stop to follow the work; services vary by company and project. | **Dycom provides the scale to manage your entire infrastructure lifecycle and the agility to deploy specialized services at any stage. We take full ownership of our delivery, ensuring our work integrates seamlessly into your broader project goals.** |
| Stage 1 title | Survey & plan | **Design & engineering** (document: "Design & Engineering"; sentence case matches stages 2–5) |
| Stage 1 description, services (Engineering · Project management) | | unchanged |
| Stage 2 | Locate & prepare | unchanged |
| Stage 3 title, description | Build & connect | unchanged |
| Stage 3 services | Wireline construction · Wireless construction | **Wireline construction · Wireless construction · Fulfillment · Electrical contracting** |
| Stage 4 title | Test & restore | **Maintain & restore** |
| Stage 4 description | Every route is tested end to end… | unchanged (as the document has it; flagged, section 7) |
| Stage 4 services | Fulfillment · Splicing & testing | **Maintenance · Emergency response** |
| Stage 5 | Maintain & respond — Maintenance & restoration · Utility locating | unchanged |
| Mobile accordion labels, "Next:" links, stage numbers | | follow automatically |

Layout check: four service chips on stage 3 wrap to two rows at 390; the stacked panel height rule (all panels mounted, tallest wins) means desktop height may grow by one chip row.

### 1.8 Page title
Browser/page title changes from "Consolidated V2 | Dycom Industries" to **"Home | Dycom"**, following the document's "PAGE TITLE | Dycom" rule. For the build: meta description = the new hero description; OG image = the hero poster; real SEO values drop in when Dycom fills the SEO block. (The prototype sets the title only; it has no per-page head metadata.)

### 1.9 Unchanged by the document (confirmed, no edits)
What we do heading, intro, the three tabs and their copy, bullets and related links · Who we build for heading and paragraph · How we work · People & careers (heading, paragraph, bullets, both buttons, five trade tiles) · Investors chapter and three tiles · Resource Center four columns · Contact form (profiles, fields, copy) · Footer · Header and mega menu.

---

## 2. New sections

Common rules for all three: built inside the Final Design Direction's scoped styles; existing tokens, type scale (Fjalla One headings, Geist text), button and arrow styles only; square corners; no signal mark used as a bullet or arrow; no outward links; all links go through the future-state sitemap or on-page anchors; keyboard reachable; honour the page's motion toggle and reduced-motion.

### 2.1 Brand video section — between the facts band and the companies map
- **Content:** the existing brand film (same file the hero dialog played) with **its own poster — a frame from the film** (`film-poster.webp`), not the hero poster, so the two bands do not repeat one image. *(As built.)*
- **Structure:** full-width media band, 16:9 on desktop, 4:5 crop allowed on phones. Over the poster: a square play control (same style as the hero's play/pause control, larger), eyebrow **"Our people at work"**, one-line caption **"The people and work behind America's infrastructure."** (both lines already exist as the dialog's title and description — no new copy invented).
- **Behaviour:** pressing play plays in place, muted by default with native controls visible so sound can be turned on; the poster, eyebrow and caption fade out while playing and return on pause/end. With motion off or reduced motion, nothing autoplays; the poster and play control simply wait.
- **Hero link:** removed (see 1.1). The hero dialog and its code are removed.
- **Anchor:** `#film`. Not added to the menu.

### 2.2 Four-card column — after What we do, before the brand statement
- **No section heading** (the document provides none).
- **Surface:** Civic Blue band, so the page alternates light / dark through this run (What we do white → cards blue → statement white → Who we build for photo band).
- **Four equal photo cards**, same size, desktop 4-up, 1024 2×2, phone stacked. Each card: photo (4:3, square corners, from the approved library), headline in Fjalla One caps, body copy, outline button with arrow.

| Card | Headline | Body copy (verbatim) | Button | Goes to | Photo (from the library) |
| --- | --- | --- | --- | --- | --- |
| 1 | **Scale is Local** | Dycom's national strength is delivered through trusted local operating companies that bring customer knowledge, local accountability, and execution at scale. | **Operating Strengths** | new page `who-we-are/operating-strengths` | crew in the back of the truck, `z9b_0540` (local crew) |
| 2 | **Built to Deliver** | Dycom turns complex digital infrastructure demand into work that is built, connected, powered, sustained, restored, and evolved safely, reliably, and at pace. | **Our Capabilities** | new page `what-we-do/capabilities` | directional drill head emerging from soil, `z9b_0355` (heavy build) |
| 3 | **Where Skill Meets Scale** | Dycom's skilled, safety-minded people are the capability that builds, connects, powers, maintains, and advances the digital infrastructure America depends on now and into the future. | **Careers** | `careers` page | worker in hard hat at the rig, `z9b_1903` (skilled people) |
| 4 | **Shaping What's Next** | Dycom invests in the technology, capabilities, partnerships, and skilled workforce that help customers prepare for what's next. | **Resource Center** | Resource Center page | green laser lines across a data-center floor, `z9a_0525` (technology) |

- Card 2 body: the document has a stray space in "built , connected" — corrected to "built, connected".
- Photos are suggestions from the existing library; any swap stays within it.

### 2.3 Brand statement — after the four-card column, before Who we build for
- **Copy is blank in the document.** Placeholder statement, taken from Dycom's own Who we are text box (the one sentence not already used on the page): **"We work in partnership with customers across the full project lifecycle, advantaged by a highly skilled workforce operating in all 50 states."** Swapped the moment Dycom supplies the statement.
- **Structure:** white band, the signal mark in Signal Green beside one left-set statement at display size (Geist Medium up to 40px for a sentence like the placeholder; Fjalla One caps at H2 size if the final line is short), generous vertical space, no button. *(As built: no "Dycom" eyebrow — the mark is the only accent, and the eyebrow repeated the wordmark two screens above.)*
- **Anchor:** `#statement`. Not added to the menu.

### 2.4 Contact form above the footer
Already in place (the closing form is the last section before the footer). No work; recorded as met.

---

## 3. Supporting changes

| Area | Change |
| --- | --- |
| Sitemap | Add two pages: **Operating strengths** under Who we are (`who-we-are/operating-strengths`) and **Our capabilities** under What we do (`what-we-do/capabilities`). Both appear in the footer columns and the Design System site plan; the mega menu stays as agreed. In the review workspace they behave like every other future-state page (disabled with the "future page" notice). |
| Requirements record | New **§14 Addendum — Homepage content v0.1 (November 2026)** in the Concept 05 requirements doc: one row per change above with a requirement ID, the document section it came from, and status; new open decisions D13–D18 for the flagged items in section 7. |
| Source research | Add the "50 states" fact with its source (Dycom content v0.1); mark 1969 as retired from the homepage. |
| Design System site | Document the three new components (brand video band, four-card column, brand statement) on the patterns page with framed examples at real widths; update the homepage sequence described on the overview page; site plan picks up the two new pages. |
| Sandbox copy | Hand-sync the Final Design Direction mockup copy after the artifact is right; add a dated entry to its review notes. |
| Handoff package | Update requirements and prototype map, add the content document to sources, re-zip. |
| Client-facing "what changed" doc | Add a "Content v0.1" section listing the above in you-said / we-did form. |
| Review workspace | Reply on the Resource Center pin that it is now also a card destination; project note to reviewers that content v0.1 is applied, with the open items (section 7). |
| Publish | Republish; confirm the live page serves the new build before telling Dycom. |

---

## 4. Decisions taken because there was no meeting

| # | Blank / ambiguity | Decision |
| --- | --- | --- |
| D13 | SEO block empty | "Home \| Dycom" as the page title. *(As built: the review-workspace preview has no per-page meta/OG head; description and OG image are recorded for the build team in the handoff rather than set in the prototype.)* |
| D14 | Brand statement copy blank | Placeholder sentence from Dycom's own text box (2.3) |
| D15 | What we do labelled "Card Display (3 Column)" but screenshot shows tabs | Keep the tabs |
| D16 | Stage 4 "Maintain & restore" next to stage 5 "Maintain & respond", stage 4 description still about testing | Apply exactly as written; flag |
| D17 | Operating Strengths / Capabilities pages not in the sitemap | Add both as future-state pages (3) |
| D18 | "Over 500 field offices" vs. map of home offices | Copy as written; legend and counts keep saying home offices; flag |
| — | Who we are "Text box copy" (longer paragraph) | Not placed on the page beyond the one sentence used as the statement placeholder; treated as boilerplate reference |
| — | Form profile labels (Careers / Community / Supplier) | Unchanged — the document lists the form as unchanged |
| — | "Scale is Local" repeated (hero, card 1, map heading, Our companies menu line) | As written; flag |
| — | Stage 1 "Design & Engineering", stage 3 "Electrical Contracting" capitalisation | Sentence case to match the other stage titles and services |

---

## 5. Not changing (and why)
- Brand (colours, type, signal mark), header and mega menu, map interaction, What we do tab behaviour, Investors page — none are asked for.
- The original Consolidated concept and its feedback — untouched.
- Company logos, report covers, live job feed, form destination — still open items from the earlier review; placeholders stay as they are.

## 6. Verification before it is shown
Typecheck and build · parity capture (original Consolidated pixel-identical, V2 diffs only in the sections above) · Design System check at 1440 and 390 (no overflow, no outward links) · homepage-scope and preview-policy checks (new sitemap paths disabled with notice, not broken) · full-page captures at 1440 / 1024 / 390 for rhythm, hero headline over film, Who we are balance, lifecycle chips, four-card stacking, video controls · keyboard pass through the new sections · review workspace loads the tile and pins still land on the right page · live page serves the new build after republish.

## 7. Open items to tell Dycom (in the review note, not on the page)
1. SEO title, description, keywords and URL still needed — placeholders in place.
2. Brand statement copy needed — placeholder is a sentence from your Who we are text box.
3. Stage 4 is now "Maintain & restore" beside stage 5 "Maintain & respond"; stage 4's description still describes testing and restoration after construction. Rename or merge?
4. Operating Strengths and Our Capabilities are new pages added to the sitemap — confirm.
5. Map copy says 500 field offices; the map plots home offices (about 39). Send field-office locations if the map should match, or confirm the wording.
6. "Scale is Local" now appears in the hero, the first card, the map heading and the Our companies menu — intentional?
7. "Electrical contracting" is new as a service — should it also appear in the What we do tabs and the services menu?
8. The form profile labels (Careers / Community) were left as they were; say if they should follow the pathway renames (Career Seekers / Communities).
