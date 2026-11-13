# Final Design Direction — source

A trimmed pnpm workspace containing only the packages the Final Design Direction needs. It was cut from Icreon's review workspace on November 6, 2026; nothing here depends on that workspace.

```
source/
├── artifacts/dycom-concept-05/   the site (Vite + React 19 + TypeScript)
│   └── src/
│       ├── v2/                   the Final Design Direction: Home.tsx, Investors.tsx, content.ts, site.ts, components/
│       ├── design-system/        the Design System site (served at design-system/)
│       ├── standalone.ts         the VITE_DYCOM_STANDALONE build flag (see below)
│       ├── pages/, lib/, …       the earlier Consolidated direction; not served in the standalone build
│       └── …
├── lib/dycom-brand/              brand package: tokens and styles, fonts, films, logos, photo catalogue, router, shared sections
├── lib/dycom-network-map/        operating-company directory, map geometry, proximity gazetteer, logo catalogue, sample roles
└── lib/review-access-react/      the review-workspace access gate (not rendered in the standalone build)
```

## Run

Requires Node 20+ and pnpm 10 (`corepack enable`).

```sh
pnpm install
# make the photography and company logos available to the dev server
cp -R ../site/media artifacts/dycom-concept-05/public/media
PORT=5173 BASE_PATH=/ VITE_DYCOM_STANDALONE=1 VITE_DYCOM_MEDIA_BASE=/media/ pnpm dev
```

Then open http://localhost:5173/ (homepage), /investors/ and /design-system/.

Build the static site the same way: `PORT=1 BASE_PATH=/ NODE_ENV=production VITE_DYCOM_STANDALONE=1 VITE_DYCOM_MEDIA_BASE=/media/ pnpm build` writes to `artifacts/dycom-concept-05/dist/public/`; copy `site/media` beside its `index.html`.

Typecheck: `pnpm typecheck`.

## The two build-time variables

The review workspace served this site behind an access gate, with the Final Design Direction at `/dycom-concept-05/v2/` and media from an API server. Two variables make a self-contained build:

- `VITE_DYCOM_STANDALONE=1` — serve the Final Design Direction at the root instead of `v2/`, keep the Design System at `design-system/`, and do not render the access gate. Read in `src/standalone.ts`; applied in `src/App.tsx`, `src/v2/site.ts`, `src/v2/V2Site.tsx` and the two Design System entry points.
- `VITE_DYCOM_MEDIA_BASE=/media/` — read photography (`photography/web/<frame>-{1000,2000}.webp`) and company logos (`company-logos/<id>.{png,svg}`) from this path instead of the API. Read in `lib/dycom-brand/src/photos.ts`, `src/v2/photos.ts` and `lib/dycom-network-map/src/logos.ts`.

Fonts (Fjalla One, Geist), the hero and brand films and the Dycom logos are bundled from `lib/dycom-brand/src/`.

## Things to know before building from this code

- `vite.config.ts` requires `PORT` and `BASE_PATH` and includes the Replit dev plugins; the two optional ones only load when `REPL_ID` is set. Remove the three `@replit/*` devDependencies and the plugin lines if they are not wanted.
- `src/pages/`, `src/lib/` and `src/ConceptSite` code belong to the earlier Consolidated direction. They stay so the Design System's history pages compile; they are not part of the Final Design Direction and are not reachable in a standalone build.
- The roles in `src/v2/jobs.ts` and `lib/dycom-network-map/src/sample-jobs.ts` are sample data. The company directory in `lib/dycom-network-map/src/companies.ts` is real; `presentation.ts` beside it lists the companies held back from presentation.
- Chapters held back from the homepage are listed in `src/v2/presentation.ts` (`HIDDEN_CHAPTERS`).
- The brief in `../brief/` explains what each chapter is for and where its copy came from.
