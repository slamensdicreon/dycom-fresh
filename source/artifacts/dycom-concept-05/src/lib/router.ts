// Concept 05's two pages in this phase: the homepage and the Investors
// overview. Exact matching only; every other sitemap path is rendered
// unavailable by the preview policy (see App.tsx). History sync, link capture
// and page effects come from the shared brand package.
import { BASE, relativePath, usePageEffects as usePageEffectsFor, useResolvedRoute, type PageMeta } from '@workspace/dycom-brand';

export { BASE, navigate } from '@workspace/dycom-brand';
export const INVESTORS_PATH = 'investors/';
export const ALLOWED_PATHS = [INVESTORS_PATH] as const;

export type SiteRoute = 'home' | 'investors' | 'unknown';

export function resolveRoute(pathname: string): SiteRoute {
  const rest = relativePath(pathname);
  if (rest === null) return 'unknown';
  if (rest === '') return 'home';
  if (rest === INVESTORS_PATH || rest === INVESTORS_PATH.slice(0, -1)) return 'investors';
  return 'unknown';
}

/** Current route, kept in sync with history and same-app link clicks. */
export const useSiteRoute = () => useResolvedRoute<Exclude<SiteRoute, 'unknown'>>(resolveRoute, 'home');

const titles: Record<Exclude<SiteRoute, 'unknown'>, PageMeta> = {
  home: {
    title: 'Dycom — Behind the Work That Connects America',
    description: 'Engineering, construction and maintenance for the nation’s networks, delivered by local operating companies working to one standard. Explore Dycom companies, services and careers.',
  },
  investors: {
    title: 'Investors | Dycom Industries, Inc.',
    description: 'Dycom Industries, Inc. (NYSE: DY): fiscal Q2 2027 results, featured reports, investor events and news, governance and shareholder resources.',
  },
};

/** Document title/description, scroll position and heading focus follow the route. */
export const usePageEffects = (route: Exclude<SiteRoute, 'unknown'>) => usePageEffectsFor(route, titles[route]);
