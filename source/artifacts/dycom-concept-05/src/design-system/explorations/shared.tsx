// Pieces the map explorations share: the office data, a projection matching
// the site's atlas, the regions, the company card and the stage wrapper that
// reports each exploration's state to the capture check.
import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Action, Modal, SiteLink } from '@workspace/dycom-brand';
import { companies, type Company } from '@workspace/dycom-network-map/companies';
import { distanceMiles, projectLonLat } from '@workspace/dycom-network-map/proximity';
import { companyLogo } from '@workspace/dycom-network-map/logos';

export { distanceMiles, projectLonLat };
import { geometry } from '@workspace/dycom-network-map/geometry';
import { sampleOpenRoleCount } from '@workspace/dycom-network-map/sample-jobs';
import { ExampleContext } from '../examples/context';

export { companies, sampleOpenRoleCount };
export type { Company };

export const officeKey = (c: Company) => `${c.city}|${c.state}`;

export type Office = { key: string; city: string; state: string; region: string; coordinates: [number, number]; point: [number, number]; members: Company[] };

const projected = new Map(geometry.points.map((p) => [p.id, p.point as [number, number]]));

/** Home offices with every company that shares the address. */
export const offices: Office[] = Array.from(
  companies.reduce((m, c) => m.set(officeKey(c), [...(m.get(officeKey(c)) ?? []), c]), new Map<string, Company[]>()).values(),
).map((members) => ({
  key: officeKey(members[0]),
  city: members[0].city,
  state: members[0].state,
  region: members[0].region,
  coordinates: members[0].coordinates,
  point: projected.get(members[0].id) ?? projectLonLat(members[0].coordinates[0], members[0].coordinates[1]),
  members,
}));

export const lower48 = geometry.states.filter((s) => !['02', '15'].includes(s.id) && Number(s.id) < 60);

export const VIEWBOX = { width: 900, height: 535 };

export type Region = { id: string; name: string; lede: string; offices: Office[]; companies: Company[]; box: { x: number; y: number; w: number; h: number } };

const REGION_COPY: Record<string, { name: string; lede: string }> = {
  Northeast: { name: 'Northeast', lede: 'Dense networks in old cities: fiber through tight streets, utilities under some of the country’s busiest ground.' },
  South: { name: 'South', lede: 'The largest part of the family. Fast-growing metros, long rural routes and the storm season that tests every network.' },
  Midwest: { name: 'Midwest', lede: 'Long-haul routes between the lakes and the plains, and the locating work that keeps every other crew safe.' },
  West: { name: 'West', lede: 'Mountain and coastal terrain, wireless build-outs and the distances that make engineering matter most.' },
};

function boxAround(points: [number, number][], pad = 70) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const x0 = Math.min(...xs) - pad;
  const y0 = Math.min(...ys) - pad;
  const x1 = Math.max(...xs) + pad;
  const y1 = Math.max(...ys) + pad;
  // Keep the atlas's aspect ratio so the view never stretches.
  const ratio = VIEWBOX.width / VIEWBOX.height;
  let w = x1 - x0;
  let h = y1 - y0;
  if (w / h > ratio) h = w / ratio; else w = h * ratio;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

export const REGIONS: Region[] = ['Northeast', 'South', 'Midwest', 'West'].map((id) => {
  const regionOffices = offices.filter((o) => o.region === id);
  return {
    id,
    ...REGION_COPY[id],
    offices: regionOffices,
    companies: companies.filter((c) => c.region === id),
    box: boxAround(regionOffices.map((o) => o.point)),
  };
});

export const WHOLE_COUNTRY = { x: 0, y: 0, w: VIEWBOX.width, h: VIEWBOX.height };

const PAINT_TOKENS = { civic: '--c5-civic', deep: '--c5-civic-deep', soft: '--c5-civic-soft', green: '--c5-green', paper: '--c5-paper', rule: '--c5-rule', ink: '--c5-ink', white: '--c5-white' } as const;
type PaintKey = keyof typeof PAINT_TOKENS;
// Fallbacks mirror brand.css for the instant before the stylesheet is read.
const DEFAULT_PAINT: Record<PaintKey, string> = { civic: '#041054', deep: '#030b3a', soft: '#22307a', green: '#00b609', paper: '#f4f5f7', rule: '#c1c6c8', ink: '#354846', white: '#ffffff' };

/** The brand colours as real values, for canvases that cannot read CSS variables (WebGL, map styles). */
export function usePaint() {
  const [paint, setPaint] = useState(DEFAULT_PAINT);
  useEffect(() => {
    const scope = document.querySelector('.dycom-c5');
    if (!scope) return;
    const read = (name: string, fallback: string) => getComputedStyle(scope).getPropertyValue(name).trim() || fallback;
    setPaint(Object.fromEntries((Object.keys(DEFAULT_PAINT) as PaintKey[]).map((key) => [key, read(PAINT_TOKENS[key], DEFAULT_PAINT[key])])) as typeof DEFAULT_PAINT);
  }, []);
  return paint;
}

/** Atlas of the lower 48 in the site's halftone treatment, for explorations that draw their own map. */
export function Atlas({ viewBox, children, className, style, label = 'Map of the United States' }: { viewBox: { x: number; y: number; w: number; h: number }; children?: ReactNode; className?: string; style?: CSSProperties; label?: string }) {
  return (
    <svg viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`} className={className} style={style} role="img" aria-label={label}>
      <defs>
        <pattern id="dycom-x-halftone" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.6" fill="var(--c5-civic-soft)" /></pattern>
      </defs>
      {lower48.map((s) => <path key={s.id} d={s.path || ''} fill="url(#dycom-x-halftone)" />)}
      {lower48.map((s) => <path key={`edge-${s.id}`} d={s.path || ''} fill="none" stroke="var(--c5-civic-soft)" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0 7" vectorEffect="non-scaling-stroke" />)}
      {children}
    </svg>
  );
}

/**
 * The body of the company card: home office, what they do, careers and
 * website. Shared addresses are not called out (client direction, 5 Nov 2026).
 * The card wraps it in a dialog whose head carries the company's logo; the
 * state index shows it in place, so the name is repeated in text here when a
 * logo leads. `onRoles` opens the shared roles drawer however the host needs
 * (a dialog closes first).
 */
export function CompanyDetail({ company, onRoles }: { company: Company; onRoles: (c: Company) => void }) {
  return (
    <div className="dycom-c5__company-detail">
      {companyLogo(company.id) && <p className="dycom-c5__company-name">{company.name}</p>}
      <p>{company.name} is one of Dycom’s operating companies, with a home office in {company.city}, {company.state}. Visit its website for services and project information.</p>
      <section>
        <h3>Home office</h3>
        <p>{company.address}<br />{company.city}, {company.state} {company.zip}</p>
      </section>
      <section>
        <h3>What they do</h3>
        <p>Explore this company’s services, expertise and projects on its own website. A home-office location does not establish capabilities or service territory.</p>
      </section>
      <section>
        <h3>Careers</h3>
        <p>{sampleOpenRoleCount(company.id)} open roles. Roles and requirements vary by company.</p>
        <div className="dycom-c5__actions">
          <Action onClick={() => onRoles(company)}>View open roles</Action>
          <Action outline href={company.website}>Company website</Action>
        </div>
        <SiteLink href={company.careers} className="dycom-c5__text-link">Company careers page</SiteLink>
      </section>
    </div>
  );
}

/** The company card every exploration opens, identical in content to the site's: the company's logo leads the head beside the close control. */
export function CompanyCard({ company, onClose, id }: { company: Company | null; onClose: () => void; id: string }) {
  const { openRoles } = useContext(ExampleContext);
  const logo = company ? companyLogo(company.id) : null;
  return (
    <Modal
      open={!!company}
      onClose={onClose}
      title={company?.name ?? 'Company'}
      heading={company && logo ? <span className="dycom-c5__dialog-logo"><img src={logo} alt={company.name} /></span> : undefined}
      id={id}
    >
      {company && <CompanyDetail company={company} onRoles={(c) => { onClose(); requestAnimationFrame(() => openRoles({ companyId: c.id })); }} />}
    </Modal>
  );
}

/** Selected-company state plus the card, shared by every exploration. */
export function useCompanyCard(id: string) {
  const { selectCompany } = useContext(ExampleContext);
  const [company, setCompany] = useState<Company | null>(null);
  const open = (c: Company) => { setCompany(c); selectCompany(c); };
  const card = <CompanyCard company={company} onClose={() => setCompany(null)} id={id} />;
  return { company, open, card };
}

export type ExplorationState = 'loading' | 'ready' | 'fallback';

export const MotionContext = createContext(false);

/**
 * Root of every exploration. `data-state` tells the capture check whether the
 * live experience rendered (`ready`) or its documented fallback did
 * (`fallback`, e.g. no WebGL or no map service in the capture browser).
 */
export function ExplorationRoot({ id, state, children, className = '' }: { id: string; state: ExplorationState; children: ReactNode; className?: string }) {
  return <div className={`dycom-x dycom-x--${id} ${className}`.trim()} data-exploration={id} data-state={state}>{children}</div>;
}

/** The notice shown in place of a live experience that this browser cannot run. */
export function Fallback({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="dycom-x__fallback" role="status">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

export const rolesLine = (c: Company) => `${c.city}, ${c.state} · ${sampleOpenRoleCount(c.id)} open roles`;
export const rolesCount = (c: Company) => `${sampleOpenRoleCount(c.id)} open roles`;

/** True when the visitor has asked for less motion, by the system setting; the Motion control is read separately. */
export const prefersReducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
