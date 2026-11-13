import { lazy, Suspense, useEffect } from 'react';
import { HomepageOnlyPreview, ReviewAccessGate } from '@workspace/review-access-react';
import { useResolvedRoute } from '@workspace/dycom-brand';
import Home from '@/pages/Home';
import Investors from '@/pages/Investors';
import { ALLOWED_PATHS, BASE, navigate, useSiteRoute } from '@/lib/router';
import { isDesignSystemPath } from '@/design-system/router';
import { STANDALONE } from '@/standalone';

// The Design System is a separate site served from this artifact under
// design-system/ with its own access slug; it is split out so Concept 05's
// bundle stays as it was.
const DesignSystemApp = lazy(() => import('@/design-system/DesignSystemApp'));
const V2Site = lazy(() => import('@/v2/V2Site'));

function RoutedPage() {
  const route = useSiteRoute();
  useEffect(() => {
    // Unknown paths (and the un-slashed investors path) normalise rather than 404 inside the preview.
    if (route === 'unknown') navigate(BASE, { replace: true });
    else if (route === 'investors' && !window.location.pathname.endsWith('/')) navigate(`${window.location.pathname}/${window.location.hash}`, { replace: true });
  }, [route]);
  if (route === 'investors') return <Investors />;
  return <Home />;
}

function ConceptSite() {
  return (
    <ReviewAccessGate conceptSlug="concept-05">
      <HomepageOnlyPreview basePath={import.meta.env.BASE_URL} allowedPaths={ALLOWED_PATHS}>
        <RoutedPage />
      </HomepageOnlyPreview>
    </ReviewAccessGate>
  );
}

const resolveSite = (pathname: string): 'concept' | 'design-system' | 'v2' => {
  if (isDesignSystemPath(pathname)) return 'design-system';
  // The standalone (handoff) build serves the Final Design Direction at the root; the original Consolidated direction is not part of it.
  if (STANDALONE) return 'v2';
  if (pathname === `${BASE}v2` || pathname.startsWith(`${BASE}v2/`)) return 'v2';
  return 'concept';
};

function App() {
  // Outer switch only: each site captures its own link clicks.
  const site = useResolvedRoute(resolveSite, 'concept', { captureLinks: false });
  if (site === 'v2') return <Suspense fallback={null}><V2Site /></Suspense>;
  if (site === 'design-system') {
    return (
      <Suspense fallback={null}>
        <DesignSystemApp />
      </Suspense>
    );
  }
  return <ConceptSite />;
}

export default App;
