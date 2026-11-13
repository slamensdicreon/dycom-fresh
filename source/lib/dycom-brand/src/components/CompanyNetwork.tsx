import { useId, useMemo, useState, type CSSProperties } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { companies, type Company } from '@workspace/dycom-network-map/companies';
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
  const visible = useMemo(() => {
    const q = place.trim().toLowerCase();
    return companies.filter((c) => (!region || c.region === region) && (!q || `${c.name} ${c.city} ${c.state}`.toLowerCase().includes(q) || c.zip.startsWith(q)));
  }, [place, region]);
  const selectedGroup = companies.find((c) => c.id === hover);
  const activeKey = selectedGroup ? officeKey(selectedGroup) : '';
  // The open card keeps its location pulsing so the user can see which office they picked (pins #13 #80).
  const selectedKey = open && company ? officeKey(company) : '';
  const choose = (c: Company) => { setCompany(c); onSelect(c); setOpen(true); };
  const shared = company
    ? companies.filter((c) => c.id !== company.id && Math.abs(c.coordinates[0] - company.coordinates[0]) < 0.001 && Math.abs(c.coordinates[1] - company.coordinates[1]) < 0.001)
    : [];
  return (
    <>
      <div className="dycom-c5__network" data-treatment={treatment} data-marker={marker} data-layout={layout}>
        <div className="dycom-c5__map">
          <div className="dycom-c5__map-summary"><strong>{companies.length} local names</strong><span>{offices.length} home-office locations</span></div>
          {/* Markers are plain location squares, never the signal mark (user rule, Oct 22 2026). The idle blink pauses while any location is hovered, focused or selected. */}
          <svg
            viewBox="0 0 900 535"
            className={`dycom-c5__map-svg${activeKey || selectedKey ? ' is-engaged' : ''}`}
            style={{ '--c5-pin-count': offices.length } as CSSProperties}
            role="group"
            aria-label="Map of Dycom company home offices"
          >
            <defs>
              {land.fill === 'halftone' && <pattern id={patternId} width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.6" fill="var(--c5-civic-soft)" /></pattern>}
              {land.fill === 'dot-grid' && <pattern id={patternId} width="9" height="9" patternUnits="userSpaceOnUse"><rect x="3.2" y="3.2" width="2.6" height="2.6" fill="var(--c5-civic-soft)" /></pattern>}
            </defs>
            {lower48.map((s) => <path key={s.id} d={s.path || ''} fill={landFill} />)}
            {lower48.map((s) => <path key={`edge-${s.id}`} d={s.path || ''} fill="none" stroke={land.stroke} strokeWidth={land.strokeWidth} strokeLinecap="round" strokeDasharray={land.dashed ? '0 7' : undefined} vectorEffect="non-scaling-stroke" />)}
            {offices.map((members, index) => {
              const pt = points.get(members[0].id);
              if (!pt || !members.some((m) => visible.includes(m))) return null;
              const key = officeKey(members[0]);
              const active = activeKey === key;
              const selected = selectedKey === key;
              return (
                <g
                  key={members[0].id}
                  transform={`translate(${pt[0]},${pt[1]})`}
                  style={{ '--c5-pin-index': index } as CSSProperties}
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
                  {members.length > 1 && <text x="10" y="-9" fontSize="14" fill="var(--c5-map-label)">{members.length}</text>}
                </g>
              );
            })}
          </svg>
          <div className="dycom-c5__map-key">
            <svg className="dycom-c5__map-key-mark" viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" fill="none" stroke="var(--c5-green)" strokeWidth="2" /><g transform="translate(16 16)"><MarkerGlyph marker={marker} /></g></svg>
            <p><strong>Home offices, not service areas.</strong><br />Each square is a home-office location; shared locations group local companies. Select a location to meet a company.</p>
          </div>
          <small className="dycom-c5__map-attribution">Map data: US Atlas / U.S. Census.</small>
        </div>
        <div className="dycom-c5__directory">
          <div className="dycom-c5__directory-filters">
            <label htmlFor={searchId}>City, ZIP or company</label>
            <input id={searchId} value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. Tampa or 30022" />
            <label className="dycom-c5__select-label">Home-office region<select value={region} onChange={(e) => setRegion(e.target.value)}><option value="">All regions</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select><ChevronDown className="dycom-c5__chevron" aria-hidden="true" /></label>
            <small aria-live="polite">{visible.length} companies</small>
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
                <span><strong>{c.name}</strong><small>{c.city}, {c.state} · {sampleOpenRoleCount(c.id)} open roles</small></span>
                <ArrowRight size={18} />
              </button>
            ))}
            {!visible.length && <div className="dycom-c5__empty" role="status"><Signal /><h3>No companies match</h3><p>Try another home-office city or company name.</p><Action outline onClick={() => { setPlace(''); setRegion(''); }}>Clear filters</Action></div>}
          </div>
        </div>
      </div>
      <div className="dycom-c5__network-foot"><p>Local companies. National capability.</p><Action outline href={page('companies')}>All companies</Action></div>
      <Modal open={open} onClose={() => setOpen(false)} title={company?.name ?? 'Company'} id={`c5-company-title-${uid}`}>
        {company && (
          <div className="dycom-c5__company-detail">
            <p>{company.name} is one of Dycom’s operating companies, with a home office in {company.city}, {company.state}. Visit its website for services and project information.</p>
            <section>
              <h3>Home office</h3>
              <p>{company.address}<br />{company.city}, {company.state} {company.zip}</p>
              {shared.length > 0 && <div className="dycom-c5__shared"><p>Shares this location with</p>{shared.map((c) => <button type="button" key={c.id} onClick={() => { setCompany(c); onSelect(c); }}>{c.name}</button>)}</div>}
            </section>
            <section>
              <h3>What they do</h3>
              <p>Explore this company’s services, expertise and projects on its own website. A home-office location does not establish capabilities or service territory.</p>
            </section>
            <section>
              <h3>Careers</h3>
              <p>{sampleOpenRoleCount(company.id)} open roles. Roles and requirements vary by company.</p>
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
