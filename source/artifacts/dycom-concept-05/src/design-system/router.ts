// Routes of the Design System, which lives under the Consolidated-direction artifact at
// `design-system/` (the workspace's artifact limit left no room for a tenth
// artifact). Exact matching only, trailing-slash canonical URLs. Each map
// exploration has its own page so a review pin records exactly which
// interaction model it was left on.
import { BASE, relativePath } from '@workspace/dycom-brand';

export const DS_ROOT = 'design-system/';
export const DS_BASE = `${BASE}${DS_ROOT}`;

export type DsGroup = 'foundations' | 'components' | 'patterns' | 'templates' | 'explorations';

export type DsRoute = { kind: 'page'; slug: PageSlug } | { kind: 'example'; id: ExampleId; params: URLSearchParams } | { kind: 'unknown' };

/**
 * Framed examples: each width-sensitive example also has a bare address under
 * design-system/example/<id>/ that renders only that example, so a stage can
 * show it in a frame at a real viewport width (Desktop / Tablet / Phone) and the
 * site's own breakpoints apply exactly. These are never pages of the system —
 * they have no rail entry and pins stay on the documenting page.
 */
export const EXAMPLE_ROOT = 'example/';
export const EXAMPLE_IDS = [
  'header', 'hero', 'heading-band', 'who-we-are', 'what-we-do', 'who-we-build-for', 'lifecycle', 'how-we-work', 'closing', 'pathways', 'investors', 'careers', 'resource-center', 'footer',
  'brand-film', 'strengths', 'brand-statement',
  'companies', 'closing-footer', 'company-map',
  'exploration-atlas-directory', 'exploration-street-map', 'exploration-relief-model', 'exploration-near-you', 'exploration-state-index',
] as const;
export type ExampleId = (typeof EXAMPLE_IDS)[number];
export const isExampleId = (value: string): value is ExampleId => (EXAMPLE_IDS as readonly string[]).includes(value);
export const examplePath = (id: ExampleId) => `${EXAMPLE_ROOT}${id}/` as const;

export const MAP_PAGE = 'components/company-map/';
export const EXPLORATIONS_PAGE = 'explorations/company-map/';

/** The interaction models under exploration for the company map, in presentation order. */
export const EXPLORATION_IDS = ['atlas-directory', 'street-map', 'relief-model', 'near-you', 'state-index'] as const;
export type ExplorationId = (typeof EXPLORATION_IDS)[number];
export const explorationPath = (id: ExplorationId) => `${EXPLORATIONS_PAGE}${id}/` as const;
export const isExplorationId = (value: string): value is ExplorationId => (EXPLORATION_IDS as readonly string[]).includes(value);

/** Page slugs (relative to DS_BASE, trailing slash) in navigation order. */
export const PAGE_SLUGS = [
  '',
  'foundations/color/',
  'foundations/typography/',
  'foundations/spacing-layout/',
  'foundations/shape/',
  'foundations/motion/',
  'foundations/signal-mark/',
  'foundations/imagery/',
  'components/buttons/',
  'components/links/',
  'components/header/',
  'components/hero/',
  'components/section-headers/',
  'components/tabs/',
  'components/process-route/',
  'components/cards/',
  'components/roles-drawer/',
  'components/dialog/',
  'components/forms/',
  'components/footer/',
  MAP_PAGE,
  'patterns/directory-map/',
  'patterns/brand-bands/',
  'patterns/closing/',
  'templates/investors/',
  'templates/site-plan/',
  EXPLORATIONS_PAGE,
  'explorations/company-map/atlas-directory/',
  'explorations/company-map/street-map/',
  'explorations/company-map/relief-model/',
  'explorations/company-map/near-you/',
  'explorations/company-map/state-index/',
] as const;

export type PageSlug = (typeof PAGE_SLUGS)[number];

export const isPageSlug = (value: string): value is PageSlug => (PAGE_SLUGS as readonly string[]).includes(value);

/** Every DS destination the preview policy may show. */
export const DS_ALLOWED_PATHS: readonly string[] = PAGE_SLUGS.filter((slug) => slug !== '');

export const dsHref = (slug: string) => `${DS_BASE}${slug}`;

export function resolveDsRoute(pathname: string): DsRoute {
  const rest = relativePath(pathname);
  if (rest === null || !(rest === DS_ROOT.slice(0, -1) || rest.startsWith(DS_ROOT))) return { kind: 'unknown' };
  const inner = rest === DS_ROOT.slice(0, -1) ? '' : rest.slice(DS_ROOT.length);
  const slashed = inner === '' || inner.endsWith('/') ? inner : `${inner}/`;
  if (slashed.startsWith(EXAMPLE_ROOT)) {
    const id = slashed.slice(EXAMPLE_ROOT.length, -1);
    return isExampleId(id) ? { kind: 'example', id, params: new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search) } : { kind: 'unknown' };
  }
  return isPageSlug(slashed) ? { kind: 'page', slug: slashed } : { kind: 'unknown' };
}

/**
 * Where an unknown address under design-system/ should land: the deepest page
 * whose slug prefixes it (so retired sub-pages fall back to their section),
 * else the overview.
 */
/** Earlier addresses that pins may still carry; each resolves to the page that replaced it. */
const MOVED_PAGES: Record<string, PageSlug> = {
  'patterns/investors/': 'templates/investors/',
  // The regional tour was retired from the undecided interactions; its pins land on the index.
  'explorations/company-map/regional-tour/': EXPLORATIONS_PAGE,
};

export function nearestPage(pathname: string): PageSlug {
  const rest = relativePath(pathname);
  if (rest === null || !rest.startsWith(DS_ROOT)) return '';
  const inner = rest.slice(DS_ROOT.length);
  if (MOVED_PAGES[inner]) return MOVED_PAGES[inner];
  return [...PAGE_SLUGS].filter((slug) => slug !== '' && inner.startsWith(slug)).sort((a, b) => b.length - a.length)[0] ?? '';
}

/** Stable key for page effects (scroll reset, heading focus). */
export const routeKey = (route: DsRoute) => (route.kind === 'page' ? route.slug : route.kind === 'example' ? examplePath(route.id) : 'unknown');

export const isDesignSystemPath = (pathname: string) => {
  const rest = relativePath(pathname);
  return rest !== null && (rest === DS_ROOT.slice(0, -1) || rest.startsWith(DS_ROOT));
};
