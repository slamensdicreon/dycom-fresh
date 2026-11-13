// The Dycom Design System: a documentation site for the Consolidated V2 system
// (src/v2 — the revised homepage and Investors page that replaced the original
// Consolidated as the reference in October 2026), served from this artifact
// under `design-system/` with its own review-access slug. Examples are the live
// V2 components; the undecided company-map interactions are lazy-loaded. The
// shell itself carries the V2 scope class so token tables read V2's values.
import { lazy, Suspense, useCallback, useEffect, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { HomepageOnlyPreview, ReviewAccessGate } from '@workspace/review-access-react';
import { STANDALONE } from '../standalone';
import { navigate, usePageEffects, useResolvedRoute } from '@workspace/dycom-brand';
import type { Company } from '@workspace/dycom-network-map/companies';
import { RolesDrawer } from '../v2/components/RolesDrawer';
import { emptyFilters, type Filters } from '../v2/jobs';
import { useMotionPreference } from '../v2/motion';
import { PAGES } from './catalog';
import { DS_ALLOWED_PATHS, DS_BASE, EXPLORATIONS_PAGE, EXPLORATION_IDS, explorationPath, nearestPage, resolveDsRoute, routeKey, type DsRoute, type PageSlug } from './router';
import { DsShell } from './shell';
import { ExampleContext, ButtonsPage, CardsPage, DialogPage, FooterPage, FormsPage, HeaderPage, HeroPage, LinksPage, ProcessRoutePage, RolesDrawerPage, SectionHeadersPage, TabsPage } from './pages/components';
import { ColorPage, ImageryPage, MotionPage, ShapePage, SignalMarkPage, SpacingPage, TypographyPage } from './pages/foundations';
import { CompanyMapPage } from './pages/company-map';
import { ExplorationPage, ExplorationsIndexPage } from './explorations';
import { BrandBandsPage, ClosingPatternPage, DirectoryMapPage, InvestorsTemplatePage, OverviewPage } from './pages/patterns';
import { SitePlanPage } from './pages/site-plan';
import '../v2/_group.css';
import '../v2/ConsolidatedV2.css';
import './design-system.css';

// The standalone (handoff) build has no review workspace to ask, so the gate is not rendered.
const Gate = STANDALONE ? ({ children }: { children: ReactNode; conceptSlug: string }) => <>{children}</> : ReviewAccessGate;

// Framed examples render alone at example/<id>/ — split out so the shell does not load them twice.
const ExampleFrameApp = lazy(() => import('./examples/ExampleFrameApp'));

const PAGE_COMPONENTS: Record<PageSlug, () => ReactElement> = {
  '': OverviewPage,
  'foundations/color/': ColorPage,
  'foundations/typography/': TypographyPage,
  'foundations/spacing-layout/': SpacingPage,
  'foundations/shape/': ShapePage,
  'foundations/motion/': MotionPage,
  'foundations/signal-mark/': SignalMarkPage,
  'foundations/imagery/': ImageryPage,
  'components/buttons/': ButtonsPage,
  'components/links/': LinksPage,
  'components/header/': HeaderPage,
  'components/hero/': HeroPage,
  'components/section-headers/': SectionHeadersPage,
  'components/tabs/': TabsPage,
  'components/process-route/': ProcessRoutePage,
  'components/cards/': CardsPage,
  'components/roles-drawer/': RolesDrawerPage,
  'components/dialog/': DialogPage,
  'components/forms/': FormsPage,
  'components/footer/': FooterPage,
  'components/company-map/': CompanyMapPage,
  'patterns/directory-map/': DirectoryMapPage,
  'patterns/brand-bands/': BrandBandsPage,
  'patterns/closing/': ClosingPatternPage,
  'templates/investors/': InvestorsTemplatePage,
  'templates/site-plan/': SitePlanPage,
  [EXPLORATIONS_PAGE]: ExplorationsIndexPage,
  ...(Object.fromEntries(EXPLORATION_IDS.map((id) => [explorationPath(id), () => <ExplorationPage id={id} />])) as Record<ReturnType<typeof explorationPath>, () => ReactElement>),
};

const HOME = { kind: 'page', slug: '' } as const satisfies DsRoute;

function pageTitle(route: DsRoute) {
  if (route.kind === 'page' && route.slug !== '') return PAGES[route.slug].title;
  return 'Overview';
}

function RoutedDesignSystem() {
  // Routes are objects, so resolve to a string key for the shared hook and re-derive.
  const resolve = useCallback((pathname: string) => {
    const route = resolveDsRoute(pathname);
    return route.kind === 'unknown' ? 'unknown' : routeKey(route);
  }, []);
  const key = useResolvedRoute<string>(resolve, '', { swallowUnknown: true });
  const route = useMemo<DsRoute>(() => (key === 'unknown' ? { kind: 'unknown' } : resolveDsRoute(`${DS_BASE}${key}`)), [key]);
  const [motionOff, setMotionOff] = useMotionPreference();
  const [rolesOpen, setRolesOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const current: Extract<DsRoute, { kind: 'page' }> = route.kind === 'page' ? route : HOME;
  const meta = useMemo(() => ({
    title: `${pageTitle(current)} | Dycom Design System`,
    description: 'The Dycom digital design system: foundations, components, patterns and page templates of the Final Design Direction, and the company-map interactions still to be decided.',
  }), [current]);
  usePageEffects(routeKey(current), meta);

  // Unknown paths under design-system/ (un-slashed ones, and retired sub-pages
  // such as the old per-variation map addresses) normalise to the nearest page
  // instead of 404ing in the preview.
  useEffect(() => {
    if (route.kind !== 'unknown') return;
    const path = window.location.pathname;
    const slashed = path.endsWith('/') ? path : `${path}/`;
    navigate(resolveDsRoute(slashed).kind === 'unknown' ? `${DS_BASE}${nearestPage(slashed)}` : `${slashed}${window.location.hash}`, { replace: true });
  }, [route]);

  const handlers = useMemo(() => ({
    openRoles: (patch: Partial<Filters> = {}) => { setFilters({ ...emptyFilters, ...patch }); setRolesOpen(true); },
    selectedCompany,
    selectCompany: setSelectedCompany,
    motionOff,
    toggleMotion: () => setMotionOff((v) => !v),
  }), [selectedCompany, motionOff, setMotionOff]);

  const Page = PAGE_COMPONENTS[current.slug];

  return (
    <ExampleContext.Provider value={handlers}>
      <DsShell
        current={current.slug}
        motionOff={motionOff}
        onToggleMotion={handlers.toggleMotion}
        drawer={<RolesDrawer open={rolesOpen} onClose={() => setRolesOpen(false)} filters={filters} update={(patch) => setFilters((f) => ({ ...f, ...patch }))} />}
      >
        <Page />
      </DsShell>
    </ExampleContext.Provider>
  );
}

export default function DesignSystemApp() {
  // A frame address never navigates (the frame shows one example for its life), so it is read once.
  const [frame] = useState(() => { const route = resolveDsRoute(window.location.pathname); return route.kind === 'example' ? route : null; });
  if (frame) {
    return (
      <Suspense fallback={null}>
        <ExampleFrameApp id={frame.id} params={frame.params} />
      </Suspense>
    );
  }
  return (
    <Gate conceptSlug="design-system">
      <HomepageOnlyPreview basePath={DS_BASE} allowedPaths={DS_ALLOWED_PATHS}>
        <RoutedDesignSystem />
      </HomepageOnlyPreview>
    </Gate>
  );
}
