import { useEffect, type ReactNode } from 'react';
import { HomepageOnlyPreview, ReviewAccessGate } from '@workspace/review-access-react';
import { useResolvedRoute } from '@workspace/dycom-brand';
import Home from './Home';
import Investors from './Investors';
import { V2_BASE } from './site';
import { STANDALONE } from '../standalone';

// The standalone (handoff) build has no review workspace to ask, so the gate is not rendered.
const Gate = STANDALONE ? ({ children }: { children: ReactNode; conceptSlug: string }) => <>{children}</> : ReviewAccessGate;

export default function V2Site() {
  const route = useResolvedRoute<'home' | 'investors'>(
    (pathname) => {
      const path = pathname.replace(/\/$/, '');
      if (path === V2_BASE.slice(0, -1)) return 'home';
      if (path === `${V2_BASE}investors`) return 'investors';
      return 'unknown';
    },
    'home',
  );
  useEffect(() => {
    if (window.location.pathname === V2_BASE.slice(0, -1)) {
      window.history.replaceState(null, '', `${V2_BASE}${window.location.search}${window.location.hash}`);
    }
  }, []);
  return (
    <Gate conceptSlug="concept-05-v2">
      <HomepageOnlyPreview basePath={V2_BASE} allowedPaths={['investors/']}>
        {route === 'investors' ? <Investors /> : <Home />}
      </HomepageOnlyPreview>
    </Gate>
  );
}
