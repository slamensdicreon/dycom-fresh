import { useId, useMemo, useState, type CSSProperties } from 'react';
import { ArrowRight, ChevronDown, LocateFixed } from 'lucide-react';
import type { Company } from '@workspace/dycom-network-map/companies';
import { presentedCompanies as companies } from '@workspace/dycom-network-map/presentation';
import { distanceMiles, findPlace, placeLabel, projectLonLat } from '@workspace/dycom-network-map/proximity';
import { companyLogo } from '@workspace/dycom-network-map/logos';
import { geometry } from '@workspace/dycom-network-map/geometry';
import { sampleOpenRoleCount } from '@workspace/dycom-network-map/sample-jobs';
import { Action, Modal, Signal, SiteLink } from './primitives';
import { page } from '../content';
import { DEFAULT_MAP_VARIANT, type MapLayout, type MapMarker, type MapTreatment } from '../map-variants';

const REGIONS = ['West', 'Midwest', 'Northeast', 'South'];
const officeKey = (c: Company) => `${c.city}|${c.state}`;
const points = new Map(geometry.points.map((p) => [p.id, p.point]));
const lower48 = geometry.states.filter((s) => !['02', '15'].includes(s.id) && Number(s.id) < 60);
const offices = Array.from(
  companies.reduce((m, c) => m.set(officeKey(c), [...(m.get(officeKey(c)) ?? []), c]), new Map<string, Company[]>()).values(),
);

/** The atlas drawing and the window onto it. The whole country is the drawing itself; a place frames it and its nearest offices. */
const ATLAS = { w: 900, h: 535 };
type View = { x: number; y: number; w: number; h: number };
const WHOLE: View = { x: 0, y: 0, w: ATLAS.w, h: ATLAS.h };
const NEAREST_FRAMED = 5;
const MAX_ZOOM = 5;
const MIN_SPAN = 150;
type Origin = { label: string; lon: number; lat: number };

/** Frame an origin and the offices nearest to it, padded, in the atlas's aspect ratio and no closer than MAX_ZOOM. */
function frame(origin: [number, number], nearest: [number, number][]): View {
  const xs = [origin[0], ...nearest.map((p) => p[0])];
  const ys = [origin[1], ...nearest.map((p) => p[1])];
  let w = Math.max(MIN_SPAN, (Math.max(...xs) - Math.min(...xs)) * 1.5, ATLAS.w / MAX_ZOOM);
  let h = Math.max((MIN_SPAN * ATLAS.h) / ATLAS.w, (Math.max(...ys) - Math.min(...ys)) * 1.6, ATLAS.h / MAX_ZOOM);
  if (w / h > ATLAS.w / ATLAS.h) h = (w * ATLAS.h) / ATLAS.w; else w = (h * ATLAS.w) / ATLAS.h;
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

/** Land fill and outline per treatment (see map-variants.ts). `fill` names a pattern id when set. */
const LAND: Record<MapTreatment, { fill: 'halftone' | 'dot-grid' | 'civic' | 'none'; stroke: string; strokeWidth: number; dashed: boolean }> = {
  halftone: { fill: 'halftone', stroke: 'var(--c5-civic-soft)', strokeWidth: 1.6, dashed: true },
  solid: { fill: 'civic', stroke: 'var(--c5-paper)', strokeWidth: 0.9, dashed: false },
  atlas: { fill: 'none', stroke: 'var(--c5-civic)', strokeWidth: 1, dashed: false },
  'dot-grid': { fill: 'dot-grid', stroke: 'var(--c5-civic-soft)', strokeWidth: 0.9, dashed: false },
  night: { fill: 'civic', stroke: 'var(--c5-civic-soft)', strokeWidth: 0.9, dashed: false },
};

/** The marker glyph at a location (origin at the office). Plain squares only — never the signal mark (user rule, Oct 22 2026). */
function MarkerGlyph({ marker }: { marker: MapMarker }) {
  if (marker === 'outline') return <rect className="dycom-c5__pin-mark" x="-6" y="-6" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" />;
  if (marker === 'post') {
    return (
      <g className="dycom-c5__pin-mark">
        <rect x="-6" y="-19" width="12" height="12" fill="currentColor" />
        <rect x="-1" y="-7" width="2" height="6" fill="currentColor" />
        <rect x="-2.5" y="-2.5" width="5" height="5" fill="currentColor" />
      </g>
    );
  }
  return <rect className="dycom-c5__pin-mark" x="-7" y="-7" width="14" height="14" fill="currentColor" />;
}

export type CompanyNetworkProps = {
  onSelect: (c: Company) => void;
  onRoles: (id: string) => void;
  /** Land treatment; Concept 05 uses the halftone default. */
  treatment?: MapTreatment;
  marker?: MapMarker;
  layout?: MapLayout;
};

export function CompanyNetwork({ onSelect, onRoles, treatment = DEFAULT_MAP_VARIANT.treatment, marker = DEFAULT_MAP_VARIANT.marker, layout = DEFAULT_MAP_VARIANT.layout }: CompanyNetworkProps) {
  // Several maps can share one page (the design system shows variations side by side), so ids are per instance.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const patternId = `c5-land-${uid}`;
  const searchId = `c5-company-search-${uid}`;
  const land = LAND[treatment];
  const landFill = land.fill === 'none' ? 'none' : land.fill === 'civic' ? 'var(--c5-civic)' : `url(#${patternId})`;
  const [place, setPlace] = useState('');
  const [region, setRegion] = useState('');
  const [hover, setHover] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [open, setOpen] = useState(false);
  const [located, setLocated] = useState<Origin | null>(null);
  const [locating, setLocating] = useState<'idle' | 'busy' | 'denied' | 'unsupported'>('idle');
  // A typed company, office city, state or ZIP narrows the list. Any other place
  // the gazetteer knows (a metro, a state, a ZIP near an office), or the visitor's
  // own location, becomes an origin: the directory ranks every office by distance
  // and the map frames the nearest ones (client feedback, 5 Nov 2026: proximity,
  // "like the Near You map").
  const { visible, origin, miles } = useMemo(() => {
    const q = place.trim().toLowerCase();
    const inRegion = companies.filter((c) => !region || c.region === region);
    const none = { visible: inRegion, origin: null as Origin | null, miles: new Map<string, number>() };
    let from: Origin | null = null;
    if (q) {
      const named = inRegion.filter((c) => `${c.name} ${c.city} ${c.state}`.toLowerCase().includes(q) || c.zip.startsWith(q));
      if (named.length) return { ...none, visible: named };
      const found = findPlace(q, companies);
      if (!found) return { ...none, visible: named };
      from = { label: placeLabel(found), lon: found.lon, lat: found.lat };
    } else if (located) {
      from = located;
    }
    if (!from) return none;
    const miles = new Map(inRegion.map((c) => [c.id, distanceMiles([from!.lon, from!.lat], c.coordinates)] as const));
    return { visible: [...inRegion].sort((a, b) => miles.get(a.id)! - miles.get(b.id)!), origin: from, miles };
  }, [place, region, located]);
  const originPoint = origin ? projectLonLat(origin.lon, origin.lat) : null;
  const view = useMemo<View>(() => {
    if (!originPoint) return WHOLE;
    const nearest = visible.slice(0, NEAREST_FRAMED).map((c) => points.get(c.id)).filter((pt): pt is [number, number] => !!pt);
    return frame(originPoint, nearest);
  }, [originPoint?.[0], originPoint?.[1], visible]);
  const zoom = ATLAS.w / view.w;
  const zoomed = view !== WHOLE;
  const locate = () => {
    if (!('geolocation' in navigator)) { setLocating('unsupported'); return; }
    setLocating('busy');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocating('idle'); setPlace(''); setLocated({ label: 'you', lon: pos.coords.longitude, lat: pos.coords.latitude }); },
      () => setLocating('denied'),
      { timeout: 8000 },
    );
  };
  const clearOrigin = () => { setPlace(''); setLocated(null); setLocating('idle'); };
  const selectedGroup = companies.find((c) => c.id === hover);
  const activeKey = selectedGroup ? officeKey(selectedGroup) : '';
  // The open card keeps its location pulsing so the user can see which office they picked (pins #13 #80).
  const selectedKey = open && company ? officeKey(company) : '';
  const engagedOffice = (members: Company[]) => { const key = officeKey(members[0]); return key === activeKey || key === selectedKey; };
  const choose = (c: Company) => { setCompany(c); onSelect(c); setOpen(true); };
  const logo = company ? companyLogo(company.id) : null;
  return (
    <>
      <div className="dycom-c5__network" data-treatment={treatment} data-marker={marker} data-layout={layout}>
        <div className="dycom-c5__map">
          <div className="dycom-c5__map-summary"><strong>{companies.length} local names</strong><span>{offices.length} home-office locations</span></div>
          {/* Markers are plain location squares, never the signal mark (user rule, Oct 22 2026). The idle blink pauses while any location is hovered, focused or selected. */}
          <svg
            viewBox={`0 0 ${ATLAS.w} ${ATLAS.h}`}
            className={`dycom-c5__map-svg${activeKey || selectedKey ? ' is-engaged' : ''}${zoomed ? ' is-zoomed' : ''}`}
            style={{ '--c5-pin-count': offices.length } as CSSProperties}
            role="group"
            aria-label={origin ? `Map of Dycom company home offices, framed on the offices nearest ${origin.label}` : 'Map of Dycom company home offices'}
          >
            <defs>
              {/* The halftone keeps its on-screen density at any zoom: the pattern counter-scales with the view. */}
              {land.fill === 'halftone' && <pattern id={patternId} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform={`scale(${1 / zoom})`}><circle cx="4.5" cy="4.5" r="1.6" fill="var(--c5-civic-soft)" /></pattern>}
              {land.fill === 'dot-grid' && <pattern id={patternId} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform={`scale(${1 / zoom})`}><rect x="3.2" y="3.2" width="2.6" height="2.6" fill="var(--c5-civic-soft)" /></pattern>}
            </defs>
            {/* Same drawing at every zoom. A place moves this window (CSS transform, so it glides); markers counter-scale so a square stays a square. */}
            <g className="dycom-c5__map-view" style={{ transform: `scale(${zoom}) translate(${-view.x}px, ${-view.y}px)` }}>
            {lower48.map((s) => <path key={s.id} d={s.path || ''} fill={landFill} />)}
            {lower48.map((s) => <path key={`edge-${s.id}`} d={s.path || ''} fill="none" stroke={land.stroke} strokeWidth={land.strokeWidth} strokeLinecap="round" strokeDasharray={land.dashed ? `0 ${7 / zoom}` : undefined} vectorEffect="non-scaling-stroke" />)}
            {/* Engaged locations render last so their green square sits above neighbours in dense clusters (SVG paints in order). */}
            {offices.map((members, index) => ({ members, index })).sort((a, b) => Number(engagedOffice(a.members)) - Number(engagedOffice(b.members))).map(({ members, index }) => {
              const pt = points.get(members[0].id);
              if (!pt || !members.some((m) => visible.includes(m))) return null;
              const key = officeKey(members[0]);
              const active = activeKey === key;
              const selected = selectedKey === key;
              return (
                <g
                  key={members[0].id}
                  style={{ '--c5-pin-index': index, transform: `translate(${pt[0]}px, ${pt[1]}px) scale(${1 / zoom})` } as CSSProperties}
                  role="button"
                  tabIndex={0}
                  aria-label={`${members.map((m) => m.name).join(', ')} home office, ${members[0].city}, ${members[0].state}`}
                  aria-pressed={active}
                  className={`dycom-c5__map-pin${active ? ' is-active' : ''}${selected ? ' is-selected' : ''}`}
                  onMouseEnter={() => setHover(members[0].id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(members[0].id)}
                  onBlur={() => setHover(null)}
                  onClick={() => choose(members.find((m) => m.id === hover) ?? members[0])}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(members[0]); } }}
                >
                  <title>{members.map((m) => m.name).join(', ')} · {members[0].city}, {members[0].state}</title>
                  <rect x="-22" y="-22" width="44" height="44" fill="transparent" />
                  <rect className="dycom-c5__pin-idle" x="-13" y="-13" width="26" height="26" fill="none" stroke="var(--c5-green)" strokeWidth="2" aria-hidden="true" />
                  <rect className="dycom-c5__pin-ring" x="-13" y="-13" width="26" height="26" fill="none" stroke="var(--c5-green)" strokeWidth="2" aria-hidden="true" />
                  <MarkerGlyph marker={marker} />
                </g>
              );
            })}
            {/* Shared offices are not marked (user direction, 5 Nov 2026): a square is a location, however many local companies work from it. */}
            {originPoint && (
              <g className="dycom-c5__map-origin" style={{ transform: `translate(${originPoint[0]}px, ${originPoint[1]}px) scale(${1 / zoom})` }} aria-hidden="true">
                <circle r="18" fill="none" stroke="var(--c5-green)" strokeWidth="2" strokeDasharray="4 4" />
                <circle r="5" fill="var(--c5-green)" />
              </g>
            )}
            </g>
          </svg>
          {zoomed && <button type="button" className="dycom-c5__map-reset" onClick={clearOrigin}>Whole country</button>}
          <div className="dycom-c5__map-key">
            <svg className="dycom-c5__map-key-mark" viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" fill="none" stroke="var(--c5-green)" strokeWidth="2" /><g transform="translate(16 16)"><MarkerGlyph marker={marker} /></g></svg>
            <p><strong>Home offices, not service areas.</strong><br />Each square is a home-office location. {origin ? `The map is framed on the offices nearest ${origin.label}.` : 'Type a place or use your location to see the offices nearest you.'} Select a location to meet a company.</p>
          </div>
          <small className="dycom-c5__map-attribution">Map data: US Atlas / U.S. Census.</small>
        </div>
        <div className="dycom-c5__directory">
          <div className="dycom-c5__directory-filters">
            <label htmlFor={searchId}>City, ZIP or company</label>
            <input id={searchId} value={place} onChange={(e) => { setPlace(e.target.value); if (e.target.value) setLocated(null); }} placeholder="e.g. Tampa or 30022" />
            <button type="button" className="dycom-c5__locate" onClick={locate} aria-busy={locating === 'busy'}>
              <LocateFixed size={18} aria-hidden="true" />{locating === 'busy' ? 'Finding you…' : located && !place ? 'Using your location' : 'Use my location'}
            </button>
            {locating === 'denied' && <small role="status">Location wasn’t shared. Type a city, state or ZIP instead.</small>}
            {locating === 'unsupported' && <small role="status">This browser can’t share a location. Type a city, state or ZIP instead.</small>}
            <label className="dycom-c5__select-label">Home-office region<select value={region} onChange={(e) => setRegion(e.target.value)}><option value="">All regions</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select><ChevronDown className="dycom-c5__chevron" aria-hidden="true" /></label>
            <small aria-live="polite">{origin ? `${visible.length} companies, nearest ${origin.label === 'you' ? 'you' : origin.label} first` : `${visible.length} ${visible.length === 1 ? 'company' : 'companies'}`}</small>
          </div>
          <div className="dycom-c5__company-list" aria-label="Operating companies">
            {visible.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`dycom-c5__company-row${activeKey === officeKey(c) ? ' is-active' : ''}`}
                onMouseEnter={() => setHover(c.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(c.id)}
                onBlur={() => setHover(null)}
                onClick={() => choose(c)}
              >
                <span><strong>{c.name}</strong><small>{c.city}, {c.state}{origin ? ` · ${Math.round(miles.get(c.id) ?? 0)} mi` : ''} · {sampleOpenRoleCount(c.id)} sample roles</small></span>
                <ArrowRight size={18} />
              </button>
            ))}
            {!visible.length && <div className="dycom-c5__empty" role="status"><Signal /><h3>No companies match</h3><p>Try a company name, a larger city, a state or a ZIP code.</p><Action outline onClick={() => { setPlace(''); setRegion(''); }}>Clear filters</Action></div>}
          </div>
        </div>
      </div>
      <div className="dycom-c5__network-foot"><p>Local companies. National capability.</p><Action outline href={page('companies')}>All companies</Action></div>
      {/* The card leads with the company's own logo beside the close button (user direction, 5 Nov 2026); the name stays in text under it for logos that are a mark alone. */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={company?.name ?? 'Company'}
        heading={company && logo ? <span className="dycom-c5__dialog-logo"><img src={logo} alt={company.name} /></span> : undefined}
        id={`c5-company-title-${uid}`}
      >
        {company && (
          <div className="dycom-c5__company-detail">
            {logo && <p className="dycom-c5__company-name">{company.name}</p>}
            <p>{company.name} is one of Dycom’s operating companies, with a home office in {company.city}, {company.state}. The directory provides a verified office address; service territories and capabilities are not inferred from this location.</p>
            <section>
              <h3>Home office</h3>
              <p>{company.address}<br />{company.city}, {company.state} {company.zip}</p>
            </section>
            <section>
              <h3>What they do</h3>
              <p>Company websites provide the authoritative details about services, expertise and projects. This prototype does not infer capabilities or service territory from an office address.</p>
            </section>
            <section>
              <h3>Careers</h3>
              <p>{sampleOpenRoleCount(company.id)} illustrative sample roles. Roles and requirements vary by company; these are not current vacancies.</p>
              <div className="dycom-c5__actions">
                <Action onClick={() => { setOpen(false); requestAnimationFrame(() => onRoles(company.id)); }}>View open roles</Action>
                <Action outline href={company.website}>Company website</Action>
              </div>
              <SiteLink href={company.careers} className="dycom-c5__text-link">Company careers page</SiteLink>
            </section>
          </div>
        )}
      </Modal>
    </>
  );
}
