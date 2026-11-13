// A framed example: the bare page behind `design-system/example/<id>/`. It
// mounts one example at the frame's real width with its own roles drawer and
// company selection, reports its height to the stage that embeds it and
// follows the stage's Motion setting. Links to other site pages are inert, as
// they are everywhere in the system.
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { HomepageOnlyPreview, ReviewAccessGate } from '@workspace/review-access-react';
import { STANDALONE } from '../../standalone';
import { BASE } from '@workspace/dycom-brand';
import type { Company } from '@workspace/dycom-network-map/companies';
import { RolesDrawer } from '../../v2/components/RolesDrawer';
import { emptyFilters, type Filters } from '../../v2/jobs';
import { ExampleContext } from './context';
import type { ExampleId } from '../router';
import { EXAMPLES } from './registry';

// The standalone (handoff) build has no review workspace to ask, so the gate is not rendered.
const Gate = STANDALONE ? ({ children }: { children: ReactNode; conceptSlug: string }) => <>{children}</> : ReviewAccessGate;
import { FRAME_HEIGHT_MESSAGE, FRAME_MOTION_MESSAGE } from './frames';
import '../../v2/_group.css';
import '../../v2/ConsolidatedV2.css';

function FramedExample({ id, params }: { id: ExampleId; params: URLSearchParams }) {
  const [motionOff, setMotionOff] = useState(params.get('motion') === 'off');
  const [rolesOpen, setRolesOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const root = useRef<HTMLDivElement>(null);

  // The stage owns the Motion control; it tells every frame when it flips.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const data: unknown = event.data;
      if (typeof data === 'object' && data !== null && (data as { type?: unknown }).type === FRAME_MOTION_MESSAGE) setMotionOff(Boolean((data as { off?: unknown }).off));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // A frame never leaves its example: any link to another address is inert
  // (the preview policy below also marks site pages unavailable).
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) event.preventDefault();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Report the example's own height so the stage can size the frame to it.
  useEffect(() => {
    const el = root.current;
    if (!el || window.parent === window) return;
    const report = () => window.parent.postMessage({ type: FRAME_HEIGHT_MESSAGE, id, height: Math.ceil(el.getBoundingClientRect().height) }, window.location.origin);
    const observer = new ResizeObserver(report);
    observer.observe(el);
    report();
    document.fonts?.ready.then(report).catch(() => undefined);
    return () => observer.disconnect();
  }, [id]);

  const handlers = useMemo(() => ({
    openRoles: (patch: Partial<Filters> = {}) => { setFilters({ ...emptyFilters, ...patch }); setRolesOpen(true); },
    selectedCompany,
    selectCompany: setSelectedCompany,
    motionOff,
    toggleMotion: () => setMotionOff((v) => !v),
  }), [selectedCompany, motionOff]);

  return (
    <ExampleContext.Provider value={handlers}>
      {/* The V2 scope class applies the site's own overrides and tokens, exactly as on the homepage. */}
      <main className="dycom-c5 dycom-consolidated-v2 dycom-ds dycom-ds--frame" data-motion={motionOff ? 'off' : 'on'} data-example={id}>
        <div ref={root} className="dycom-ds__frame-root">{EXAMPLES[id].render(handlers, params)}</div>
        <RolesDrawer open={rolesOpen} onClose={() => setRolesOpen(false)} filters={filters} update={(patch) => setFilters((f) => ({ ...f, ...patch }))} />
      </main>
    </ExampleContext.Provider>
  );
}

export default function ExampleFrameApp({ id, params }: { id: ExampleId; params: URLSearchParams }) {
  return (
    <Gate conceptSlug="design-system">
      <HomepageOnlyPreview basePath={BASE} allowedPaths={[]}>
        <FramedExample id={id} params={params} />
      </HomepageOnlyPreview>
    </Gate>
  );
}
