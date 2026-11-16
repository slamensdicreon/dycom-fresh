# What changed — Investors page, November 16, 2026

Dycom's marketing lead and investor-relations reviewer reviewed the Investors overview of the Final Design Direction on November 11, 2026 and left twenty-one comments. Everything that could be built without new content from Dycom is built; the rest is listed under *Open with Dycom* at the end. The homepage and the Design System are untouched except where noted.

The page is at `/investors/` in `site/` (this package carries the Investors page only). Section order is now: hero → Latest financial results → brand film → Events and Investor news → Featured reports → Investor resources → closing band → footer.

## 1. The review comments and what was done

### Header (every page)

| Comment | What changed |
| --- | --- |
| "Move the quarterly results and the call replay into the header after earnings; keep them there for two weeks" | A **results bar** now sits above the site header on every page: the signal mark, "Q2 2027 results", one line naming the release, and two links — *Results release* and *Call replay* — flush with the right gutter, plus a close control. It is meant to appear on the day of an earnings release and retire fourteen days later, after which the Investors page carries the results again. Dismissing it lasts for the browser session. **In this build it is forced on** so it can be reviewed (`src/v2/presentation.ts`, `ALWAYS_SHOW_RESULTS_BAR`); set that to `false` to follow the date window. The window and the copy live in `src/v2/investors.ts` (`resultsBar`). |
| "The replay should stay available permanently" | The Investors mega-menu (desktop and phone) carries a standing link under the overview link: **Latest results & call replay**. |

### Hero and results

| Comment | What changed |
| --- | --- |
| "New boilerplate" for the hero paragraph | **Open** — no replacement text was supplied; the current company description stays until Dycom provides the new paragraph. See *Open with Dycom*. |
| "Are these the numbers? More?" / "whole snapshot approach, stock price etc." | **Open in part.** The three GAAP figures from the results release (contract revenues, net income, diluted EPS) stay; nothing has been added that is not in the published release. A live stock price is market data from the IR provider and conflicts with the no-outward-links rule — see *Open with Dycom*. |
| Heading should read "Latest Financial Results" with the quarter underneath | The section head is **Latest financial results** with **Q2 2027** as a green sub-line beneath it. |
| Remove the section numbers | Numerals are gone from every section head and from the in-page jump bar (Results · Events · News · Reports · Resources). |
| Add a video component — who we are and what we do — near the top | The homepage's **brand film band** (poster frame, Signal Green play control, "Our people at work", caption) now follows the results section. It was placed after the results rather than before so the page still opens on the numbers and two dark bands do not sit together. |
| Remove the second sentence of the Results call replay copy | The replay block now reads only "Held August 26, 2026, 9:00 AM EDT." with its two actions. |
| Transcripts should be HTML pages with correct markup, not PDFs ("for Notified") | **Build-team note** (section 2). The transcript still links inward to the Quarterly reports page in the prototype. |

### Events, news and reports

| Comment | What changed |
| --- | --- |
| Move Events above Reports | **Events** and **Investor news** now come before **Featured reports**. |
| Tabs for upcoming and past events | Events have **Upcoming / Past** tabs. The split is made from each event's date when the page renders, so a past event is never shown as upcoming. If nothing is scheduled, the Upcoming tab says so and points to email alerts. Events and news were refreshed from Dycom's investor-relations site on November 16, 2026: the Upcoming tab shows the Q3 2027 results call (November 24, 2026, 9:00 AM EST, webcast); the news list gained the November 13, 2026 call announcement and dropped the oldest item to stay at four. |
| Metadata for gated multimedia | **Build-team note** (section 2). |

### Investor resources (bottom of the page)

| Comment | What changed |
| --- | --- |
| Retitle the section | Now **Investor resources**, with the note "Filings, governance and shareholder resources, in one place." |
| Remove the News & events column | Removed from the page (Events and News have their own sections above). The Investors **menu** keeps the column so every investor page stays reachable. |
| Move Analyst coverage to Shareholder resources | Done. |
| SEC filings first; Stock information to Shareholder resources | *Financials & filings* now reads SEC filings · Quarterly reports · Annual reports. *Shareholder resources* reads Stock information · Analyst coverage · Investor FAQs · Email alerts · Contact Investor Relations. |
| Remove Document request and Shareholder services | Removed from the page and from the Investors menu. The two pages remain in the site inventory for now. |
| Governance column — "get data to prioritize; add Google pixel" | **Build-team note** (section 2). All four governance links stay until there is usage data. |
| "Consistent across all pages?" | Confirmed as the direction: the same resources block is intended for every interior investor page. It will be applied as those templates are built (none exist yet). |
| Breathing room between the closing band and the footer | The blue closing band now has a full section of white space before the blue footer. |

These changes are reflected in the Design System's *Templates › Investors page* description and *Site plan* page.

## 2. Notes for the build team

1. **Results bar.** Show on every page from the earnings release date for fourteen days, driven by the IR feed's release date; retire automatically; remember a dismissal for the session only. The copy and both links come from the same source as the Investors page's results section. The Investors menu's "Latest results & call replay" link is permanent and independent of the bar.
2. **Call transcripts as HTML pages.** Transcripts are published today as PDFs. They must become on-site HTML pages with proper document structure — headings, speaker labels, paragraphs — so they are indexable and accessible. Dycom named Notified as the provider that should supply or structure them. A `…/transcript/` page has been added to the site inventory under Events & presentations.
3. **Metadata for gated multimedia.** Webcasts, replays and presentations that sit behind the provider's player must still expose title, date, description and duration in the page and in structured data (schema.org `VideoObject` / `Event`) so they are discoverable even when the asset itself is gated.
4. **Governance links and analytics.** Instrument the resource columns with link-level events and add the Google tag so the first months of traffic can show which governance links are used; Dycom will trim the column from that data.
5. **Events.** Split Upcoming and Past from event dates at render time; never list a past event as upcoming; show the empty state rather than hiding the tab.
6. **Resources block on interior investor pages.** Reuse the Investors group of the sitemap, filtered as on the overview, on every interior investor page.

## 3. Open with Dycom

| Item | Why it is open | What the prototype does meanwhile |
| --- | --- | --- |
| New hero boilerplate | The reviewer marked the paragraph for replacement but no text was supplied. | Keeps the current company description. |
| "Whole snapshot" with stock price | A live quote is market data from the IR provider and would be the only live feed on the page; the standing rule is no outward links and no market widgets on the overview. Needs a decision on the provider feed and on-site rendering. | Three GAAP figures from the results release. |
| Resources block on all interior investor pages | Confirmed as the direction; the interior templates are not built yet. | Applied on the overview only. |

## 4. Files changed (relative to the November 6 package's `source/`)

| File | Change |
| --- | --- |
| `artifacts/dycom-concept-05/src/v2/Investors.tsx` | New section order, "Latest financial results" head with sub-line, unnumbered heads and jump bar, brand film band, Upcoming / Past event tabs with empty state, one-sentence replay copy, filtered resource columns. |
| `artifacts/dycom-concept-05/src/v2/investors.ts` | Results-bar data, heading text, refreshed events and news (November 16, 2026 recheck). |
| `artifacts/dycom-concept-05/src/v2/investors-v2.css` | Styles for the sub-line, tabs, empty state, film band height and the white space before the footer. |
| `artifacts/dycom-concept-05/src/v2/site.ts` | Investors sitemap group re-ordered and trimmed; `spotlight` link on a navigation group. |
| `artifacts/dycom-concept-05/src/v2/components/SiteHeader.tsx` | The results bar and the menu's spotlight link. |
| `artifacts/dycom-concept-05/src/v2/_group.css` | Results-bar styles (desktop and phone). |
| `artifacts/dycom-concept-05/src/v2/presentation.ts` | `ALWAYS_SHOW_RESULTS_BAR` review flag. |
| `artifacts/dycom-concept-05/src/design-system/pages/patterns.tsx` | Investors template description updated. |
| `artifacts/dycom-concept-05/src/design-system/pages/site-plan.tsx` | Call transcript page added to the inventory. |
