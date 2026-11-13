'use client';
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, ChevronDown, LocateFixed } from 'lucide-react';
import {
  Text,
  RichText,
  NextImage as ContentSdkImage,
  type Field,
  type ImageField,
  type Item,
  type LinkField,
  type RichTextField,
  type TextField,
} from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { useSiteUI } from 'lib/site-ui';
import { ATLAS, FRAMED_NEAREST, STATES, WHOLE_COUNTRY, frameView, projectLonLat, type View } from 'lib/map/projection';
import { distanceMiles, findPlace, placeLabel } from 'lib/map/proximity';
import { ActionButton, ButtonLink, SiteLink } from 'components/ui/links';
import { Modal } from 'components/ui/Modal';
import { Signal } from 'components/ui/Signal';

/**
 * CompanyDirectory — the "Our companies" chapter: a halftone atlas of the lower 48 with a plain
 * square on each operating company's home office, a directory kept in sync with it, search by
 * company, city, state or ZIP (a place that is not an office ranks the directory by distance and
 * frames the nearest offices), "Use my location", and a company card that leads with the company's
 * own logo. On phones (≤767px) the map is not rendered; the directory carries the chapter.
 *
 * Requirements: MAP0001 (company items), MAP0002/MAP0004/MAP0005, MAP0007 (directory), brief §4.6.
 * Not yet: clustering, service-line filter (no company→service data yet), pre-filtered instance
 * for operating-company sites (MAP0009) — the rendering reads its companies from the datasource,
 * so a pre-filtered instance is a datasource whose Companies field lists one company.
 *
 * Held back: Texstar Enterprises (id 4139, Selma TX) is not in the content at Dycom's request
 * ("remove for now, legal", Nov 5 2026). Restore it by adding its Company item.
 *
 * Datasource template: Company Directory — labels below, plus `Companies` (Treelist of Company).
 * Company template: CompanyId, Name, FullName, Address, City, State, Zip, Latitude, Longitude,
 * Region, Website, Careers, Logo, Description.
 */

type CompanyFields = {
  CompanyId: TextField;
  Name: TextField;
  FullName: TextField;
  Address: TextField;
  City: TextField;
  State: TextField;
  Zip: TextField;
  Latitude: Field<number>;
  Longitude: Field<number>;
  Region: TextField;
  Website: LinkField;
  Careers: LinkField;
  Logo: ImageField;
  Description: RichTextField;
};

type DirectoryFields = {
  Heading: TextField;
  Intro: TextField;
  CompaniesCountLabel: TextField;
  OfficesCountLabel: TextField;
  SearchLabel: TextField;
  SearchPlaceholder: TextField;
  LocateLabel: TextField;
  LocatingLabel: TextField;
  LocatedLabel: TextField;
  LocateDeniedText: TextField;
  LocateUnsupportedText: TextField;
  RegionLabel: TextField;
  AllRegionsLabel: TextField;
  ResultCountLabel: TextField;
  ResultCountSingularLabel: TextField;
  NearestLabel: TextField;
  LegendTitle: TextField;
  LegendText: TextField;
  LegendFramedText: TextField;
  Attribution: TextField;
  ResetLabel: TextField;
  EmptyHeading: TextField;
  EmptyText: TextField;
  ClearLabel: TextField;
  FooterText: TextField;
  AllCompaniesLink: LinkField;
  CardIntro: TextField;
  HomeOfficeHeading: TextField;
  CareersHeading: TextField;
  CareersText: TextField;
  ViewRolesLabel: TextField;
  Companies: Item[];
};

type CompanyDirectoryProps = ComponentProps & { fields: DirectoryFields };

type Company = {
  id: string;
  name: string;
  city: string;
  state: string;
  zip: string;
  address: string;
  region: string;
  lon: number;
  lat: number;
  point: [number, number];
  fields: CompanyFields;
};
type Origin = { label: string; lon: number; lat: number; you?: boolean };

/** Census regions in reading order; any other Region value an author adds is listed after them. */
const REGION_ORDER = ['West', 'Midwest', 'Northeast', 'South'];

const str = (f?: { value?: unknown }) => (f?.value == null ? '' : String(f.value));
/** Fill `{token}` placeholders in an authored label. */
const fill = (f: TextField | undefined, vars: Record<string, string | number>) =>
  str(f).replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
const officeKey = (c: Company) => `${c.city}|${c.state}`;

function toCompanies(items: Item[] | undefined): Company[] {
  return (items ?? [])
    .map((item) => {
      const f = item.fields as unknown as CompanyFields;
      const lon = Number(f.Longitude?.value);
      const lat = Number(f.Latitude?.value);
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
      return {
        id: str(f.CompanyId) || item.id || item.name,
        name: str(f.Name) || item.displayName || item.name,
        city: str(f.City),
        state: str(f.State),
        zip: str(f.Zip),
        address: str(f.Address),
        region: str(f.Region),
        lon,
        lat,
        point: projectLonLat(lon, lat),
        fields: f,
      } satisfies Company;
    })
    .filter((c): c is Company => c !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const Default = ({ fields, params, rendering }: CompanyDirectoryProps) => {
  const id = params?.RenderingIdentifier || 'companies';
  const headingId = `${id}-heading`;
  return (
    <section id={id} className="dy-section dy-companies-section" aria-labelledby={headingId}>
      <div className="dy-section-heading">
        <Text tag="h2" id={headingId} field={fields?.Heading} />
        <Text tag="p" field={fields?.Intro} />
      </div>
      <CompanyNetwork fields={fields} uid={rendering.uid ?? id} />
    </section>
  );
};

function CompanyNetwork({ fields, uid }: { fields: DirectoryFields; uid: string }) {
  const { openRoles, setSelectedCompany } = useSiteUI();
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const patternId = `dy-land-${reactId}`;
  const searchId = `dy-company-search-${reactId}`;
  const companies = useMemo(() => toCompanies(fields?.Companies), [fields?.Companies]);
  const offices = useMemo(
    () => Array.from(companies.reduce((m, c) => m.set(officeKey(c), [...(m.get(officeKey(c)) ?? []), c]), new Map<string, Company[]>()).values()),
    [companies]
  );
  const regions = useMemo(() => {
    const present = new Set(companies.map((c) => c.region).filter(Boolean));
    return [...REGION_ORDER.filter((r) => present.has(r)), ...[...present].filter((r) => !REGION_ORDER.includes(r)).sort()];
  }, [companies]);

  const [place, setPlace] = useState('');
  const [region, setRegion] = useState('');
  const [hover, setHover] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [open, setOpen] = useState(false);
  const [located, setLocated] = useState<Origin | null>(null);
  const [locating, setLocating] = useState<'idle' | 'busy' | 'denied' | 'unsupported'>('idle');
  const listRef = useRef<HTMLDivElement>(null);
  const focusListNext = useRef(false);

  // A typed company, office city, state or ZIP narrows the list. Any other place the gazetteer
  // knows (a metro, a state, a ZIP), or the visitor's own location, becomes an origin: the
  // directory ranks every office by distance and the map frames the nearest ones.
  const { visible, origin, miles } = useMemo(() => {
    const q = place.trim().toLowerCase();
    const inRegion = companies.filter((c) => !region || c.region === region);
    const none = { visible: inRegion, origin: null as Origin | null, miles: new Map<string, number>() };
    let from: Origin | null = null;
    if (q) {
      const named = inRegion.filter(
        (c) => `${c.name} ${c.city} ${c.state} ${c.city}, ${c.state}`.toLowerCase().includes(q) || c.zip.startsWith(q)
      );
      if (named.length) return { ...none, visible: named };
      const found = findPlace(q, companies);
      if (!found) return { ...none, visible: named };
      from = { label: placeLabel(found), lon: found.lon, lat: found.lat };
    } else if (located) {
      from = located;
    }
    if (!from) return none;
    const distances = new Map(inRegion.map((c) => [c.id, distanceMiles([from!.lon, from!.lat], [c.lon, c.lat])] as const));
    return { visible: [...inRegion].sort((a, b) => distances.get(a.id)! - distances.get(b.id)!), origin: from, miles: distances };
  }, [companies, place, region, located]);

  const originPoint = origin ? projectLonLat(origin.lon, origin.lat) : null;
  const view = useMemo<View>(() => {
    if (!originPoint) return WHOLE_COUNTRY;
    return frameView(originPoint, visible.slice(0, FRAMED_NEAREST).map((c) => c.point));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originPoint?.[0], originPoint?.[1], visible]);
  const zoom = ATLAS.w / view.w;
  const zoomed = view !== WHOLE_COUNTRY;

  // After a shared-office marker narrows the directory, move focus to its first row.
  useEffect(() => {
    if (!focusListNext.current) return;
    focusListNext.current = false;
    listRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
  }, [visible]);

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setLocating('unsupported');
      return;
    }
    setLocating('busy');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating('idle');
        setPlace('');
        setLocated({ label: 'you', lon: pos.coords.longitude, lat: pos.coords.latitude, you: true });
      },
      () => setLocating('denied'),
      { timeout: 8000 }
    );
  };
  const clearOrigin = () => {
    setPlace('');
    setLocated(null);
    setLocating('idle');
  };

  const hovered = companies.find((c) => c.id === hover);
  const activeKey = hovered ? officeKey(hovered) : '';
  // The open card keeps its location pulsing so the visitor can see which office they picked.
  const selectedKey = open && company ? officeKey(company) : '';
  const engaged = (members: Company[]) => {
    const key = officeKey(members[0]);
    return key === activeKey || key === selectedKey;
  };

  const choose = (c: Company) => {
    setCompany(c);
    setSelectedCompany({ id: c.id, name: c.name, city: c.city, state: c.state });
    setOpen(true);
  };

  /**
   * A marker is a location, not a company. One company there: open its card. Several: narrow the
   * directory to that location (the search box shows the city, so the visitor sees why) and move
   * focus to the first row. Every company stays reachable from the map, and the shared office is
   * never called out with a count or a "shares this location" list (brief §6).
   */
  const chooseOffice = (members: Company[]) => {
    if (members.length === 1) {
      choose(members[0]);
      return;
    }
    focusListNext.current = true;
    setLocated(null);
    setRegion('');
    setPlace(`${members[0].city}, ${members[0].state}`);
  };

  const placeName = origin ? (origin.you ? 'you' : origin.label) : '';
  const countLabel = origin
    ? fill(fields?.NearestLabel, { count: visible.length, place: placeName })
    : fill(visible.length === 1 ? fields?.ResultCountSingularLabel : fields?.ResultCountLabel, { count: visible.length });
  const logo = company?.fields.Logo?.value?.src ? company.fields.Logo : null;
  const titleId = `dy-company-title-${uid}`;

  return (
    <>
      <div className="dy-network" data-treatment="halftone" data-marker="square" data-layout="map-left">
        <div className="dy-map">
          <div className="dy-map-summary">
            <strong>{fill(fields?.CompaniesCountLabel, { count: companies.length })}</strong>
            <span>{fill(fields?.OfficesCountLabel, { count: offices.length })}</span>
          </div>
          {/* Markers are plain location squares, never the signal mark. The idle blink pauses while a location is engaged. */}
          <svg
            viewBox={`0 0 ${ATLAS.w} ${ATLAS.h}`}
            className={`dy-map-svg${activeKey || selectedKey ? ' is-engaged' : ''}${zoomed ? ' is-zoomed' : ''}`}
            style={{ '--dy-pin-count': offices.length } as CSSProperties}
            role="group"
            aria-label={
              origin ? `Map of Dycom company home offices, framed on the offices nearest ${placeName}` : 'Map of Dycom company home offices'
            }
          >
            <defs>
              {/* The halftone keeps its on-screen density at any zoom: the pattern counter-scales with the view. */}
              <pattern id={patternId} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform={`scale(${1 / zoom})`}>
                <circle cx="4.5" cy="4.5" r="1.6" fill="var(--dy-civic-soft)" />
              </pattern>
            </defs>
            {/* One drawing at every zoom: a place moves this window (CSS transform, so it glides); markers counter-scale so a square stays a square. */}
            <g className="dy-map-view" style={{ transform: `scale(${zoom}) translate(${-view.x}px, ${-view.y}px)` }}>
              {STATES.map((s) => (
                <path key={s.id} d={s.path} fill={`url(#${patternId})`} />
              ))}
              {STATES.map((s) => (
                <path
                  key={`edge-${s.id}`}
                  d={s.path}
                  fill="none"
                  stroke="var(--dy-civic-soft)"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeDasharray={`0 ${7 / zoom}`}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {/* Engaged locations render last so their green square sits above neighbours in dense clusters. */}
              {offices
                .map((members, index) => ({ members, index }))
                .sort((a, b) => Number(engaged(a.members)) - Number(engaged(b.members)))
                .map(({ members, index }) => {
                  if (!members.some((m) => visible.includes(m))) return null;
                  const [x, y] = members[0].point;
                  const key = officeKey(members[0]);
                  const active = activeKey === key;
                  const selected = selectedKey === key;
                  const names = members.map((m) => m.name).join(', ');
                  return (
                    <g
                      key={key}
                      style={{ '--dy-pin-index': index, transform: `translate(${x}px, ${y}px) scale(${1 / zoom})` } as CSSProperties}
                      role="button"
                      tabIndex={0}
                      aria-label={`${names} home office, ${members[0].city}, ${members[0].state}`}
                      aria-haspopup={members.length === 1 ? 'dialog' : undefined}
                      className={`dy-map-pin${active ? ' is-active' : ''}${selected ? ' is-selected' : ''}`}
                      onMouseEnter={() => setHover(members[0].id)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(members[0].id)}
                      onBlur={() => setHover(null)}
                      onClick={() => chooseOffice(members)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          chooseOffice(members);
                        }
                      }}
                    >
                      <title>{`${names} · ${members[0].city}, ${members[0].state}`}</title>
                      <rect x="-22" y="-22" width="44" height="44" fill="transparent" />
                      <rect className="dy-pin-idle" x="-13" y="-13" width="26" height="26" fill="none" stroke="var(--dy-green)" strokeWidth="2" aria-hidden="true" />
                      <rect className="dy-pin-ring" x="-13" y="-13" width="26" height="26" fill="none" stroke="var(--dy-green)" strokeWidth="2" aria-hidden="true" />
                      <rect className="dy-pin-mark" x="-7" y="-7" width="14" height="14" fill="currentColor" />
                    </g>
                  );
                })}
              {originPoint && (
                <g
                  className="dy-map-origin"
                  style={{ transform: `translate(${originPoint[0]}px, ${originPoint[1]}px) scale(${1 / zoom})` }}
                  aria-hidden="true"
                >
                  {/* The origin ring is a search radius, not a brand shape; dashed so it never reads as a marker. */}
                  <circle r="18" fill="none" stroke="var(--dy-green)" strokeWidth="2" strokeDasharray="4 4" />
                  <circle r="5" fill="var(--dy-green)" />
                </g>
              )}
            </g>
          </svg>
          {zoomed && (
            <button type="button" className="dy-map-reset" onClick={clearOrigin}>
              {str(fields?.ResetLabel)}
            </button>
          )}
          <div className="dy-map-key">
            <svg className="dy-map-key-mark" viewBox="0 0 32 32" aria-hidden="true">
              <rect x="2" y="2" width="28" height="28" fill="none" stroke="var(--dy-green)" strokeWidth="2" />
              <rect x="9" y="9" width="14" height="14" fill="currentColor" />
            </svg>
            <p>
              <Text tag="strong" field={fields?.LegendTitle} />
              <br />
              {origin ? fill(fields?.LegendFramedText, { place: placeName }) : str(fields?.LegendText)}
            </p>
          </div>
          <Text tag="small" className="dy-map-attribution" field={fields?.Attribution} />
        </div>

        <div className="dy-directory">
          <div className="dy-directory-filters">
            <label htmlFor={searchId}>{str(fields?.SearchLabel)}</label>
            <input
              id={searchId}
              type="text"
              enterKeyHint="search"
              autoComplete="off"
              value={place}
              onChange={(e) => {
                setPlace(e.target.value);
                if (e.target.value) setLocated(null);
              }}
              placeholder={str(fields?.SearchPlaceholder)}
            />
            <button type="button" className="dy-locate" onClick={locate} aria-busy={locating === 'busy'}>
              <LocateFixed size={18} aria-hidden="true" />
              {locating === 'busy' ? str(fields?.LocatingLabel) : located && !place ? str(fields?.LocatedLabel) : str(fields?.LocateLabel)}
            </button>
            {locating === 'denied' && <small role="status">{str(fields?.LocateDeniedText)}</small>}
            {locating === 'unsupported' && <small role="status">{str(fields?.LocateUnsupportedText)}</small>}
            <label className="dy-select-label">
              {str(fields?.RegionLabel)}
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="">{str(fields?.AllRegionsLabel)}</option>
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <ChevronDown className="dy-chevron" aria-hidden="true" />
            </label>
            <small aria-live="polite">{countLabel}</small>
          </div>
          <div className="dy-company-list" ref={listRef} role="list" aria-label="Operating companies">
            {visible.map((c) => (
              <div role="listitem" key={c.id}>
                <button
                  type="button"
                  className={`dy-company-row${activeKey === officeKey(c) ? ' is-active' : ''}`}
                  aria-haspopup="dialog"
                  onMouseEnter={() => setHover(c.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(c.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => choose(c)}
                >
                  <span>
                    <strong>{c.name}</strong>
                    <small>
                      {c.city}, {c.state}
                      {origin ? ` · ${Math.round(miles.get(c.id) ?? 0)} mi` : ''}
                    </small>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            ))}
            {!visible.length && (
              <div className="dy-empty" role="status">
                <Signal />
                <Text tag="h3" field={fields?.EmptyHeading} />
                <Text tag="p" field={fields?.EmptyText} />
                <ActionButton
                  variant="outline"
                  onClick={() => {
                    setPlace('');
                    setRegion('');
                  }}
                >
                  {str(fields?.ClearLabel)}
                </ActionButton>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dy-network-foot">
        <Text tag="p" field={fields?.FooterText} />
        {fields?.AllCompaniesLink && <ButtonLink field={fields.AllCompaniesLink} variant="outline" />}
      </div>

      {/* The card leads with the company's own logo beside the close button; the name stays in text under it for logos that are a mark alone. */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={company?.name ?? 'Company'}
        heading={
          company && logo ? (
            <span className="dy-dialog-logo">
              <ContentSdkImage field={logo} unoptimized sizes="260px" />
            </span>
          ) : undefined
        }
        id={titleId}
      >
        {company && (
          <div className="dy-company-detail">
            {logo && <p className="dy-company-name">{company.name}</p>}
            <p>{fill(fields?.CardIntro, { name: company.name, city: company.city, state: company.state })}</p>
            {company.fields.Description?.value && <RichText field={company.fields.Description} />}
            <section>
              <Text tag="h3" field={fields?.HomeOfficeHeading} />
              <p>
                {company.address}
                <br />
                {company.city}, {company.state} {company.zip}
              </p>
            </section>
            <section>
              <Text tag="h3" field={fields?.CareersHeading} />
              <p>{fill(fields?.CareersText, { name: company.name })}</p>
              <div className="dy-actions">
                <ActionButton
                  onClick={() => {
                    const companyId = company.id;
                    setOpen(false);
                    requestAnimationFrame(() => openRoles({ companyId }));
                  }}
                >
                  {str(fields?.ViewRolesLabel)}
                </ActionButton>
                {company.fields.Website?.value?.href && <ButtonLink field={company.fields.Website} variant="outline" />}
              </div>
              {company.fields.Careers?.value?.href && <SiteLink field={company.fields.Careers} className="dy-text-link" />}
            </section>
          </div>
        )}
      </Modal>
    </>
  );
}
