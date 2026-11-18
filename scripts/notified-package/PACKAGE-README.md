# Dycom Investors page — package for Notified

**Prepared by Icreon for Dycom Industries, Inc. · November 18, 2026**

This is the approved Investors overview page for the new dycomind.com. It's a single static page with no build step, no framework and no dependencies.

- Open `index.html` in a browser, or serve the folder from any web server. It works offline and loads nothing from other hosts.
- It's a static copy of the page as it renders on the new site, with the November 16, 2026 changes from Dycom's Investors review applied.
- It is the reference for how the page must look and behave when you populate it from your feeds.

```
index.html                     the page (sections are marked with <!-- ===== … ===== --> comments)
assets/css/dycom.css           the dycomind.com stylesheet: brand tokens, layout, every component
assets/css/investors-package.css  two rules this package needs (hidden menus and dialogs)
assets/js/investors.js         page behaviour, plain JavaScript (§3)
assets/fonts/                  Fjalla One and Geist (woff2)
assets/images/                 logos, photography, film poster
assets/video/brand-film.mp4    the brand film (loaded only when a visitor presses Play)
screenshots/                   desktop and phone references
```

To check it locally:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080/. Opening `index.html` directly from disk also works.

---

## 1. The page, section by section

Each section in `index.html` starts with a comment that names it and says where its content comes from. Keep the class names and the order. The stylesheet depends on both.

| # | Section | Element | Content source | Notes |
| --- | --- | --- | --- | --- |
| 1 | Results bar | `.dy-results-bar` | IR feed, latest results release | Above the header. Shown for 14 days after each release (§4). |
| 2 | Site header | `header.dy-header` | Static: the dycomind.com menu | Six menus. The Investors menu carries a permanent **Latest results & call replay** link. |
| 3 | Hero | `section#investors` | Static | H1 "Investors", the company description and the listing block. Dycom IR will send replacement description text. |
| 4 | Latest financial results | `section#results` | IR feed | Heading, with the quarter as a green sub-line (`.dy-irp-sub`). The period line. Three GAAP figures in `dl.dy-irp-metrics`: contract revenues, net income, diluted EPS. The results package list (`ul.dy-irp-docs`: release, presentation, outlook summary, transcript). The call replay block (`.dy-irp-call`). |
| 5 | Brand film | `section#film` | Static | Muted, with native controls. Nothing autoplays. |
| 6 | Events · Investor news | `section#events-news` | IR feed | **Events:** `ol.dy-irp-timeline`, one `<li>` per event with `<time datetime="YYYY-MM-DD">`, title and an optional Webcast link. Put every event in one list; the script sorts them into Upcoming and Past (§3). **News:** `ul.dy-irp-news`, latest four press releases, newest first. |
| 7 | Featured reports | `section#reports` | IR feed / documents | Three `article.dy-irp-report` cards with a cover image, date line, title, one-line description and **Open report** link. |
| 8 | Investor resources | `section#resources` | Static | Three link columns: Financials & filings, Governance, Shareholder resources. Use the same block on every interior investor page (Dycom's direction). |
| 9 | Closing band | `section#stay-informed` | Static | Email alerts and Contact Investor Relations. |
| 10 | Site footer | `footer.dy-footer` | Static: the dycomind.com sitemap | Includes the **Motion** control (§3). |

The figures, events, news and reports are the published content as of November 16, 2026 (Q2 fiscal 2027). Replace them from your feeds on each update.

## 2. Links

- **Pages outside Investors** point to the new dycomind.com at absolute URLs (`https://www.dycomind.com/…`). Leave them as they are.
- **Investor pages** also point to `https://www.dycomind.com/investors/…`. Map each one to the page you host. Do a single find-and-replace on the prefix, or map each URL:

| Link in the package | Page |
| --- | --- |
| `/investors/` | Investors overview (this page) |
| `/investors/quarterly-reports/` | Quarterly reports (also the target of the results release and call replay links) |
| `/investors/annual-reports/` | Annual reports |
| `/investors/sec-filings/` | SEC filings |
| `/investors/stock-information/` | Stock information |
| `/investors/governance/` | Governance overview |
| `/investors/board-of-directors/` | Board of directors |
| `/investors/board-committees/` | Board committees |
| `/investors/governance-documents/` | Governance documents |
| `/investors/news/` | Investor news (each item should link to its own release page) |
| `/investors/events-presentations/` | Events & presentations (each Webcast link should go to that event) |
| `/investors/analyst-coverage/` | Analyst coverage |
| `/investors/faqs/` | Investor FAQs |
| `/investors/email-alerts/` | Email alerts sign-up |
| `/investors/contact/` | Contact Investor Relations |

Link rules from the approved design:
- **No links to third-party sites.** Investor content opens on Dycom's own pages, not on a provider's host. The only links that leave Dycom's sites are to its operating companies' own websites; they never appear on this page.
- **Arrows:** `→` means a page on the site or a jump within the page; `↗` is reserved for operating-company websites. Arrows are inline SVG icons inside the links, so keep them when you template a link.
- **Find a job** in the header links to job search on dycomind.com. On dycomind.com it opens a job-finder drawer, which is not included here.

## 3. Behaviour (`assets/js/investors.js`)

All behaviour is in one deferred script.
- The page reads fully without it. Every section's content is in the HTML.
- Each part checks that its markup exists, so a section can be removed without breaking the others.
- It stores nothing beyond the two browser-storage keys below. It sends no tracking or other network requests; the brand film loads only when a visitor presses Play.

| Part | What it does |
| --- | --- |
| Header menus | One menu open at a time. Escape or a click outside closes it; ArrowDown on a menu button opens it and focuses its first link. Menus are in the HTML with `hidden`. |
| Language menu | English / Español. It only records the choice: translation is handled by the platform. |
| Phone menu | Below 1100px the menu button opens a native `<dialog>` drawer. It traps focus, closes on Escape, a click on the backdrop or a link, and returns focus to the menu button. One group is open at a time. |
| Results bar | Visibility rules in §4. The × hides it for the browser session (`sessionStorage` key `dycom:results-bar-dismissed`). |
| Event tabs | Splits events into **Upcoming** (soonest first) and **Past** (most recent first) using the visitor's date, so a past event is never shown as upcoming. It opens on Upcoming if anything is scheduled, otherwise on Past. An empty tab shows its message: Upcoming points to email alerts. Arrow keys, Home and End move between tabs. |
| Brand film | Pressing Play loads `brand-film.mp4` and plays it in place, muted, with native controls. The poster and caption return when it's paused or ends. |
| Motion | The footer **Motion** control turns off non-essential motion and stops the film. It follows the operating system's reduced-motion setting until the visitor chooses (`localStorage` key `dycom:motion`). |
| Footer | On phones the footer columns are accordions. |

## 4. Results bar rules

These settings are attributes on `.dy-results-bar`:

| Attribute | Value in this package | Meaning |
| --- | --- | --- |
| `data-release-date` | `2026-08-26` | Date of the latest results release (from your feed) |
| `data-window-days` | `14` | Days the bar stays up after the release |
| `data-force-show` | `true` | **Review switch.** It keeps the bar visible outside its window so it can be reviewed. **Set it to `false` in production.** |

With `data-force-show="false"`, the bar shows from the release date for 14 days, then retires on its own; the Investors menu link stays. The label, the line of text and both links (**Results release**, **Call replay**) come from the same release as section 4.

## 5. Requirements from Dycom's November 11 review

1. **Call transcripts must be on-site HTML pages, not PDFs.** Use real document structure: a heading per call section, speaker labels, and paragraphs. This makes them indexable and accessible. The transcript entry in the results package should link to that page.
2. **Gated multimedia must still expose its metadata.** Webcasts, replays and presentations behind a player still need title, date, description and duration in the page, and in schema.org `Event` / `VideoObject` structured data.
3. **Governance links get analytics.** Add link-level events on the Investor resources columns, plus the Google tag, so Dycom can trim the Governance column based on usage.
4. **Never list a past event as upcoming.** The script handles this on the page. Please also hold to it in the feed.
5. **No live market widgets on the overview.** A stock-price "snapshot" is still open with Dycom. Until it's decided, the page shows only the three GAAP figures from the published results release.

## 6. Brand and accessibility rules (please keep)

- **Colour:** Civic Blue `#041054` leads. Signal Green `#00B609` is an accent only: rules, sub-lines, focus rings. It is never a section fill.
- **Shape and type:**
  - Square corners everywhere. The signal mark is the only curve.
  - Fjalla One for H1/H2, in capitals; Geist for everything else.
  - No italics, nothing smaller than 13px.
- **Accessibility:**
  - Section headings keep their `id`s: the jump row under the hero links to `#results`, `#events`, `#news`, `#reports` and `#resources`.
  - Interactive targets are at least 44×44px, with a visible green focus ring.
  - Menus, tabs and dialogs are fully keyboard-operable.
  - The skip link (`.dy-skip`) jumps to `#content`.
- **Images:** decorative photographs use `alt=""`. Photography is Dycom's own. Fjalla One and Geist are both licensed under the SIL Open Font License.
- **Layout:** the page works from 320px to wide desktop with no sideways scroll. The phone menu takes over below 1100px.

## 7. Browser support

Current Chrome, Edge, Safari and Firefox, and Safari and Chrome on phones. The phone menu uses the native `<dialog>` element, which these browsers support.

## 8. Contact

For questions about the page, contact Icreon, Dycom's digital agency. Investor content decisions sit with Dycom Investor Relations.
