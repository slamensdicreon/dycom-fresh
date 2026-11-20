# dycomind.com

The new dycomind.com front end: Next.js 16 (App Router) built on the **Sitecore Content SDK** (`@sitecore-content-sdk/nextjs` 2.5), structured exactly like Sitecore's own App Router starter, and running today on local content because Dycom's SitecoreAI environment does not exist yet.

It implements the approved Final Design Direction from the handoff in this repository (`handoff/brief/`, `handoff/reference/`, `handoff/source/`): the homepage, global navigation and footer, the Investors overview (the interior-page template), the roles drawer and the company map. The other sitemap pages exist as routes with a "currently unavailable" notice.

## Repository

```
/            the Next.js app (this README)
docs/        current project documents — requirements.md is the living full-site requirements
             (page inventory, templates T01–T16, component inventory, content, open decisions)
design/      the template design canvas (boards, styles, assets, notes) and the component inventory —
             the source of the /walkthrough presentation and library
handoff/     the Icreon design handoff of Nov 6, 2026 — brief, requirements, Dycom's source documents,
             the prototype's source and build, screenshots. Deprecated, reference only: nothing in the
             app reads from it. Delete it once every sitemap page is built.
```

## Run it

Requires Node 24 (`.nvmrc`; the Content SDK declares `node >=24`).

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000. `npm run dev` compiles `content/` into Layout Service data, generates the Sitecore component map, and starts Next with watchers on both. Set `PORT` to change the port.

```bash
npm run build && npm start
```

`npm run typecheck` regenerates `.sitecore/` and runs `tsc`.

## Deploying to Vercel

There's no setup: import the repository in Vercel. The defaults are correct.

- **Framework preset:** Next.js.
- **Root directory:** the repository root.
- **Build command:** `npm run build`. It compiles `content/` in strict mode, generates the Sitecore component map and runs `next build`.
- **Node.js version:** 24 (pinned in the project settings and in `engines` in `package.json`).

**Environment variables:** only `SITE_PIN`, the 4-digit PIN that unlocks the whole deployment (see *Site PIN* below); without it production stays locked. The site itself needs nothing else while it runs on local content.

**What the build produces:** every content page is pre-rendered as static HTML (51 today). `/api/jobs`, the sitemap, robots, llms.txt and the Sitecore editing routes are functions. The Sitecore proxy chain runs as middleware.

**Excluded uploads:** `.vercelignore` keeps `handoff/` out of CLI uploads. Git-based deploys clone it but never build it.

## How it is built for Sitecore

```
src/
├── app/
│   ├── [site]/[locale]/[[...path]]/   the single catch-all page (Content SDK App Router convention)
│   ├── api/editing/                   Sitecore Pages editing endpoints (config, render, experimental)
│   └── api/{sitemap,robots,llms-txt}  sitemap.xml, robots.txt, llms.txt (RES0003)
├── proxy.ts                           Sitecore proxy chain: Preview → BotTracking → Locale → Multisite → Redirects → Personalize
├── Layout.tsx                         headless-header / headless-main / headless-footer placeholders
├── Providers.tsx                      SitecoreProvider + the site's shared UI state
├── components/<Rendering>/            one folder per Sitecore rendering (see AGENTS.md)
├── components/ui/                     shared building blocks, not renderings
└── lib/
    ├── sitecore-client.ts             the one client: SDK SitecoreClient when connected, local client until then
    ├── local-content/                 LocalSitecoreClient — same methods, same Page/Layout Service shapes
    └── site-ui.tsx                    cross-rendering state (motion, roles drawer, selected company)
content/                               the local stand-in for the Sitecore content tree
├── sites.json                         → .sitecore/sites.json (what sitecore-tools generateSites writes)
├── renderings.json                    rendering definitions (the placeholders each rendering exposes)
├── data/jobs-feed.json                sample SuccessFactors-shaped job feed (scripts/generate-jobs-feed.mjs)
├── routes/                            one file per page; the file path is the URL
├── page-designs/                      partial designs (header, footer, roles drawer)
├── items/                             datasource items
├── media/library.json                 media library: photography and film posters with alt text
└── dictionary/                        dictionary phrases per locale
scripts/build-local-content.mjs        compiles content/ into .sitecore/local-layout.json (Layout Service JSON)
scripts/generate-future-pages.mjs      writes a holding route for every unbuilt sitemap page
scripts/generate-jobs-feed.mjs         writes the sample job feed
```

**What is real Sitecore code:** the SDK packages, the proxy chain, `SitecoreProvider`, `AppPlaceholder`, the generated component map (`sitecore-tools project component generate-map`), the field components (`Text`, `RichText`, `NextImage`, `Link`), `getPageMetadata`, `JsonLdSchema`, the editing route handlers, and the `[site]/[locale]/[[...path]]` routing with next-intl. Components receive `{ rendering, params, fields }` exactly as they will from Experience Edge.

**What stands in for Sitecore:** one class, `LocalSitecoreClient`, plus the `content/` folder it reads. It answers `getPage`, `getErrorPage`, `getDictionary`, `getAppRouterStaticParams`, `getSiteMap`, `getRobots` and `getLlmsTxt` with the same shapes Experience Edge returns. Preview, editing and Design Library return nothing in local mode.

**Local content mode** is on while no Sitecore credentials are in the environment (`LOCAL_CONTENT_MODE` in `sitecore.config.ts`). The SDK will not start without either an Edge context id or a CM host and key. In local mode it is given a placeholder CM host on the reserved `.invalid` domain, which can never resolve, and redirects and personalization are switched off.

## Renderings

| Area | Renderings |
| --- | --- |
| Page design (every page) | `SiteHeader` · `SiteFooter` · `RolesDrawer` |
| Homepage | `Hero` (variants `Default`, `Still`) · `Pathways` · `WhoWeAre` · `BrandFilm` · `CompanyDirectory` · `Strengths` · `BrandStatement` · `Lifecycle` · `ContactForm` |
| Interior template (Investors, every other page) | `InteriorHero` (placeholder `interior-hero-index`) · `InPageIndex` · `ResultsHighlights` · `FeaturedReports` · `SplitSection` (placeholders `split-left`, `split-right`) · `EventsTimeline` · `NewsList` · `ResourceColumns` · `ClosingBand` · `PageNotice` |

Each component's `…Fields` type is its datasource template. The matching item under `content/items/` shows real content for it.

**Building the next page:**

1. Replace its holding route in `content/routes/` with the real renderings. Reuse the interior renderings above and add new ones as the requirements' template catalogue calls for them (`docs/requirements.md` §2 templates, §3 component inventory).
2. Drop `"sitemap": false` so the page is listed in the sitemap.

## Site PIN

While the new site is a private preview, the whole deployment sits behind one 4-digit PIN: every page, the walkthrough, the API routes, images and files.

- **Setting it:** set `SITE_PIN` (four digits) in the Vercel project for Production and Preview, then redeploy. Changing it locks everyone out again. With no PIN set, production stays locked and local development is open; run `SITE_PIN=1234 npm run start` locally to see the gate.
- **What visitors see:** any locked page shows the PIN screen at its own address, with the site blurred behind frosted glass. The screen is `src/lib/pin-screen.ts`, a self-contained HTML document rather than a Next.js page, so nothing from the site reaches a locked browser. The fourth digit submits, and the requested page opens. Files and API routes answer 401 until then.
- **How it works:** the gate is the first thing in `src/proxy.ts`, and its matcher covers everything except Next.js build output. `src/app/api/site-pin/` checks the PIN, slows wrong guesses and blocks a client for a minute after five misses; `/api/site-pin/lock/` locks the browser again. The cookie holds a hash of the PIN and lasts 30 days. Open without the PIN: the screen's own assets (`public/gate-assets/`), `robots.txt`, the icon, and the Sitecore editing routes (which carry their own secret).
- **At launch:** remove the gate block from `src/proxy.ts` (and `SITE_PIN`).

## Design walkthrough (/walkthrough)

`/walkthrough/` is the steering-committee presentation and design library: the strategy, all sixteen templates with their designs live at desktop and phone width, and the 47-component inventory. It is internal: behind the site PIN like everything else, never indexed, and outside the Sitecore routing.

- **Story mode** (`/walkthrough/`): full-screen slides. → / Space next, ← back, G chapter index, F full screen. Each slide has its own address (`/walkthrough/#/t05`).
- **Library** (`/walkthrough/library/`): strategy, templates (`/templates/t03/` with every design, what the page does and the story it tells), components with filters and the template matrix.
- **Component pages** show the component on its own: the preview loads the page it lives on (a canvas board, a first-pass design, or the live homepage for built pieces) and crops to that element, at desktop and phone width. Where each component is shown from is `src/walkthrough/component-previews.ts`. Components no template board draws yet (alert banner, homepage pop-up, consent banner, testimonials, image gallery, social feed, business segments, data table) have first designs in `design/first-pass/`, labelled for review.
- **Access:** the site PIN (below) covers it; the walkthrough layout checks the PIN cookie again. **Lock** in the library header locks the browser again.
- **Content:** everything is generated from `design/canvas/` (the template canvas, copied from the Claude design artifact), `design/component-inventory.json` and `docs/requirements.md`. After changing any of them, run `npm run walkthrough:build` and commit the results. It renders each canvas board to `public/walkthrough-assets/canvas/boards/` and writes `src/walkthrough/data/`. It needs Python 3 and Playwright with Chromium. Strategy copy is in `src/walkthrough/strategy.ts` (from the design brief); T01's notes are in `src/walkthrough/data.ts`.

## Investors page package for Notified

Notified, Dycom's investor-relations platform partner, hosts the investor pages. `npm run package:notified` builds the Investors overview as a standalone static package for them: one `index.html` with its CSS, fonts, images, film and plain JavaScript, plus an integration guide. The zip is written to `exports/`, which git ignores. Rebuild and resend it whenever the Investors page, the menus or the brand CSS change. Requirements and steps: `scripts/notified-package/README.md`.

## Connecting SitecoreAI

1. **Create the site.** Create a headless SXA site named `dycom` (or set `NEXT_PUBLIC_DEFAULT_SITE_NAME`) with English as its language.
2. **Templates.** Create one datasource template per rendering, with the fields listed in each component's `…Fields` type. The `content/items/**` JSON is the reference content. Field names are already Sitecore-style (PascalCase); page metadata uses the SDK names (`Title`, `baseMetadataDescription`, `baseOgImage`…).
3. **Renderings.** Register each folder in `src/components/` as a JSON rendering with the same name, with its datasource template and location. Variants are the extra named exports (for example `Hero` → `Still`).
4. **Page designs.** Create a partial design for the header (`SiteHeader`) and one for the footer (`SiteFooter`, `RolesDrawer`), and a page design that uses both. This mirrors `content/page-designs/default.json`.
5. **Content.** Import the items and pages. `content/routes/**` gives the tree and the renderings per page. Media goes to the Media Library, with `content/media/library.json` supplying alt text.
6. **Connect.** Fill `.env.local` from `.env.example`: `SITECORE_EDGE_CONTEXT_ID`, `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` and `SITECORE_EDITING_SECRET`. Local content mode switches off automatically; no code changes.
7. **Site list.** Add `generateSites()` (and `extractFiles()` if wanted) to `sitecore.cli.config.ts` so the site list comes from Sitecore, and drop `content:build` from the npm scripts. Then delete `content/`, `scripts/build-local-content.mjs` and `src/lib/local-content/`.
8. **Rendering host.** Point the Sitecore rendering host at this app for Pages editing (`/api/editing/render`).

**Integration seams still to build** (each marked in code):

- **Open roles:** `src/lib/jobs/`. A `JobsProvider` reads a SuccessFactors-shaped sample feed and is the place to plug the real feed.
- **Inquiry form:** `src/components/ContactForm/submit.ts`. Replace it with Sitecore Forms or Dycom's CRM (FRM0001–FRM0012).
- **Investor figures:** today a static snapshot. These come from the IR provider feed (open decision D-IR).
- **Consent:** `CdpPageView` must be gated on the consent tool Dycom chooses (CC-4).

## Rules

The brand and product rules from the brief apply to every change. They are summarised in `AGENTS.md`.
