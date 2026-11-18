# Notified package: the Investors page as static HTML

Notified, Dycom's investor-relations platform partner, hosts the investor pages and needs the Investors overview as a standalone page. This script produces one:
- a single `index.html`, with its stylesheet, fonts, images, brand film and a small plain-JavaScript file
- no Next.js or React at runtime
- an integration guide and reference screenshots

```bash
npm run package:notified
```

Output (git-ignored):
- `exports/Dycom-Investors-Page-Notified/`
- `exports/Dycom-Investors-Page-Notified-<date>.zip`

To package the current `.next` build without rebuilding:

```bash
npm run package:notified -- --no-build
```

Rebuild the package whenever the Investors page, the header or footer menus, or the brand CSS change, and send Notified the new zip.

## Requirements

- Playwright with Chromium. `require('playwright')` must resolve: install it globally, or in a parent folder of the repo. It's deliberately not a dependency of the app, so Vercel builds stay lean.
- Python 3 with `beautifulsoup4` (`pip install beautifulsoup4`).
- `zip` and `curl`.
- Free ports `3170` and `3171`, or set `SITE_PORT` and `PKG_PORT`.

## How it works

1. **Build.** `build.sh` builds the site and starts it with `next start`.
2. **Capture** (`capture.mjs`). Opens `/investors/` in Chromium and records the rendered page. The site renders some markup only while it's open, so the script opens each of these and records it too:
   - the six mega menus
   - the language menu
   - the phone menu and each of its six groups
3. **Assemble** (`assemble.py`). Turns the capture into the package:
   - **Strips the app:** Next.js scripts and React's generated ids come out.
   - **Re-inserts the captured menus** as `hidden` markup.
   - **Swaps the job finder for a link:** "Find a job" links to job search on dycomind.com instead of opening the roles drawer, which isn't shipped.
   - **Copies files into `assets/`:**
     - the compiled CSS, with its fonts
     - the original images, instead of the Next.js image optimiser's copies
     - the poster and the film
   - **Makes site links absolute** to `https://www.dycomind.com`.
   - **Sets the results bar's attributes** from `content/items/global/results-bar.json`: `data-release-date`, `data-window-days` and `data-force-show` (the item's `ForceShow`).
   - **Adds the Events empty states** from `content/items/investors/events.json`.
   - **Labels each section** with a comment naming it and its content source.
4. **Check** (`screenshots.mjs`). Serves the package, then:
   - fails if the page throws an error or scrolls sideways on a phone
   - writes the reference screenshots
5. **Zip.** Writes the dated zip.

## Files kept here

| File | What it is |
| --- | --- |
| `investors.js` | The page's behaviour in plain JavaScript: menus, phone menu, results bar, event tabs, film, Motion control and footer menus. It mirrors the site's React components. When one of those components changes behaviour, update this file too. |
| `investors-package.css` | The two rules the package adds: `[hidden]` wins over component display rules, and closed dialogs stay hidden. |
| `PACKAGE-README.md` | The integration guide shipped to Notified as `README.md`. Update its content date and its section notes when the page changes. |

Before sending a production package, check `ForceShow` on the results bar item. It's on while Dycom reviews the bar. The guide tells Notified to switch it off.
