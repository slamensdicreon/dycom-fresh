# Working in this repository

Conventions for anyone (human or agent) adding to this app. The README explains what the app is and how to run it.

Never build from `handoff/`: it is the deprecated design handoff, kept for reference.

## The one rule

**Write every rendering exactly as it will run against SitecoreAI.** Components receive `{ rendering, params, fields }` from a Placeholder and read content only through `fields`. Nothing a content author would change lives in TSX. When Sitecore is connected, `content/` is replaced by Sitecore items and no component changes.

## Renderings

- One folder per rendering: `src/components/<RenderingName>/<RenderingName>.tsx`. The folder name is the Sitecore rendering name and the key in the generated component map. Run `npm run prepare-local` (or keep `npm run dev` running) after adding one.
- Export `Default`. Extra rendering variants are extra named exports (for example `Hero` exports `Still`); Sitecore Pages picks one with the `FieldNames` param.
- Type props as `ComponentProps & { fields: { … } }` from `lib/component-props`, with the SDK field types (`TextField`, `RichTextField`, `ImageField`, `LinkField`, `FileField`, `Field<T>`, `Item`, `Item[]`).
- Render fields with the SDK components so they stay editable in Pages: `Text`, `RichText`, `NextImage` (imported `as ContentSdkImage`), and `Link` through `components/ui/links` (`SiteLink`, `ButtonLink`). Never print `field.value` into markup when an SDK component exists for it.
- Anchor ids come from `params.RenderingIdentifier`, with the default from the brief as a fallback.
- Add `'use client'` only when the rendering needs state, effects or browser APIs.
- Shared, non-rendering UI lives in `src/components/ui/` (excluded from the component map): `Signal`, `IconButton`, `Modal`, `links`.
- Cross-rendering behaviour goes through `useSiteUI()` (`lib/site-ui`): motion preference, the roles drawer (`openRoles(filters)`), and the company selected on the map. Any authored link to `#open-roles` (optionally `#open-roles?trade=…&company=<id>&location=…`) opens the drawer.

## Content (local stand-in for Sitecore)

- `content/items/<path>.json` holds datasource items: `{ "templateName": "…", "sortOrder"?: n, "fields": { … } }`. The path is the item key.
- `content/routes/<path>.json` holds pages: the file path is the URL (`home.json` is `/`). Each page lists renderings per placeholder (`headless-main`) with `componentName`, `dataSource` (an item key) and `params`.
- `content/page-designs/default.json` holds the partial designs (header, footer, roles drawer) merged into every page that names that design.
- Field shorthands are expanded by `scripts/build-local-content.mjs` (documented at the top of that file): plain values, `$ref`, `$refs`, `$children`, `$image` (media library key from `content/media/library.json`), `$file`, `$link`.
- Field names are PascalCase, as Sitecore template fields usually are. Page-metadata fields use the SDK names (`Title`, `baseMetadataDescription`, `baseOgImage`…).

## Brand and product rules (enforced in review)

From `handoff/brief/` §6. In short:
- Civic Blue leads; Signal Green is the only accent and never a section fill.
- Square corners only; the signal mark is the only curve and never an arrow.
- Fjalla One for H1/H2 in caps, Geist elsewhere, no italics, nothing under 13px.
- `→` for site pages and in-page jumps, `↗` only for operating-company websites, no arrows in nav or footer lists.
- No outward links except operating-company sites and careers pages.
- **No visitor-facing "sample", "prototype", "illustrative" or requirement language.** Roles are "open roles".
- Tab and process panels never change height.
- No map below 768px.
- 44×44 targets, a visible green focus ring, and keyboard operation with focus trap and return for dialogs and drawers.

## Styles

- The brand CSS is ported from the prototype into the `dy-` namespace: `src/styles/brand.css`, `site.css`, `legibility.css` and `investors-proto.css`. Reuse its classes before writing new ones.
- New rules go in the area file: `chrome.css` (header, footer, drawer), `home.css`, `companies.css`, `investors-app.css`, `app.css`.

## Checks

- `npm run typecheck` (it also regenerates `.sitecore/`).
- `npm run build` must pass before committing.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
