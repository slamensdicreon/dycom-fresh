// Exploration 02 — a real map from a mapping service, drawn in greyscale so
// the brand supplies the only colour. Pan and zoom; nearby offices group into
// counts until the map is close enough to separate them; the list beside the
// map always shows what is in view.
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type { Map as MapInstance, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowRight } from 'lucide-react';
import { Atlas, ExplorationRoot, Fallback, REGIONS, WHOLE_COUNTRY, companies, offices, rolesLine, useCompanyCard, type Company, type ExplorationState, type Office } from './shared';
import { GREYSCALE_PAINT, hasWebGL, loadMapLibre, rasterStyle } from './maplibre';

// The community OpenStreetMap tiles, as the Dirt & Digital direction used: no
// account, visible attribution, normal browser caching. A production build
// would move to a provider with a service agreement. The tiles are desaturated
// in the browser (GREYSCALE_PAINT), so the service's colours never reach the page.
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const COUNTRY: [[number, number], [number, number]] = [[-125, 24.5], [-66.5, 49.5]];
const CLUSTER_PX = 44;

type Cluster = { key: string; lngLat: [number, number]; offices: Office[] };

function clustersFor(map: MapInstance): Cluster[] {
  const placed: { x: number; y: number; cluster: Cluster }[] = [];
  for (const office of offices) {
    const p = map.project(office.coordinates);
    const near = placed.find((c) => Math.hypot(c.x - p.x, c.y - p.y) < CLUSTER_PX);
    if (near) near.cluster.offices.push(office);
    else placed.push({ x: p.x, y: p.y, cluster: { key: office.key, lngLat: office.coordinates, offices: [office] } });
  }
  return placed.map((c) => c.cluster);
}

function regionBounds(id: string): [[number, number], [number, number]] {
  const region = REGIONS.find((r) => r.id === id)!;
  const lons = region.offices.map((o) => o.coordinates[0]);
  const lats = region.offices.map((o) => o.coordinates[1]);
  return [[Math.min(...lons) - 1.5, Math.min(...lats) - 1], [Math.max(...lons) + 1.5, Math.max(...lats) + 1]];
}

export default function StreetMap() {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const markers = useRef<Marker[]>([]);
  const [state, setState] = useState<ExplorationState>('loading');
  const [inView, setInView] = useState<Company[]>(companies);
  const [hover, setHover] = useState<string | null>(null);
  const hoverRef = useRef<string | null>(null);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('all');
  const { open, card } = useCompanyCard('dycom-x-street-card');
  const openRef = useRef(open);
  openRef.current = open;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? companies.filter((c) => `${c.name} ${c.city} ${c.state} ${c.zip}`.toLowerCase().includes(q)) : inView;
  }, [query, inView]);

  const setHovered = (key: string | null) => {
    hoverRef.current = key;
    setHover(key);
    markers.current.forEach((m) => m.getElement().classList.toggle('is-active', key !== null && m.getElement().dataset.offices?.split(' ').includes(key) === true));
  };

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    async function start() {
      if (!container.current) return;
      if (!hasWebGL()) { setState('fallback'); return; }
      try {
        const maplibregl = await loadMapLibre();
        if (cancelled || !container.current) return;
        const map = new maplibregl.Map({
          container: container.current,
          style: rasterStyle({ tiles: TILES, attribution: '© OpenStreetMap contributors', paint: GREYSCALE_PAINT }),
          bounds: COUNTRY,
          fitBoundsOptions: { padding: 24 },
          minZoom: 2,
          maxZoom: 15,
          attributionControl: false,
          dragRotate: false,
          pitchWithRotate: false,
          cooperativeGestures: true,
        });
        mapRef.current = map;
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        const draw = () => {
          markers.current.forEach((m) => m.remove());
          markers.current = clustersFor(map).map((cluster) => {
            const el = document.createElement('button');
            el.type = 'button';
            const count = cluster.offices.reduce((n, o) => n + o.members.length, 0);
            const single = cluster.offices.length === 1;
            el.className = `dycom-x__pin${single ? '' : ' is-cluster'}`;
            el.dataset.offices = cluster.offices.map((o) => o.key).join(' ');
            el.setAttribute('aria-label', single ? `${cluster.offices[0].members.map((m) => m.name).join(', ')} — ${cluster.offices[0].city}, ${cluster.offices[0].state}` : `${count} companies around ${cluster.offices[0].city}, ${cluster.offices[0].state}; zoom in`);
            if (!single || count > 1) { const b = document.createElement('b'); b.textContent = String(count); el.appendChild(b); }
            el.addEventListener('mouseenter', () => setHovered(cluster.offices[0].key));
            el.addEventListener('mouseleave', () => setHovered(null));
            el.addEventListener('click', () => {
              if (single) openRef.current(cluster.offices[0].members[0]);
              else map.easeTo({ center: cluster.lngLat, zoom: Math.min(map.getZoom() + 2.5, 11), duration: 600 });
            });
            return new maplibregl.Marker({ element: el }).setLngLat(cluster.lngLat).addTo(map);
          });
          const bounds = map.getBounds();
          setInView(companies.filter((c) => bounds.contains(c.coordinates)));
        };
        // A map that has not loaded within 15 seconds (no service, blocked worker) gives way to the fallback.
        const timer = window.setTimeout(() => { if (!cancelled && !map.loaded()) { console.warn('Street map did not load in time'); setState('fallback'); } }, 15000);
        timers.push(timer);
        map.on('load', () => { if (cancelled) return; window.clearTimeout(timer); draw(); setState('ready'); });
        map.on('moveend', draw);
        // Individual tile failures are tolerated (the map still works); anything else before load is fatal.
        map.on('error', (e) => { if (!cancelled && !map.loaded() && !('tile' in e && e.tile)) { console.warn('Street map unavailable', e.error?.message); setState('fallback'); } });
      } catch {
        if (!cancelled) setState('fallback');
      }
    }
    void start();
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      markers.current.forEach((m) => m.remove());
      markers.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const goTo = (id: string) => {
    setRegion(id);
    const map = mapRef.current;
    if (!map) return;
    map.fitBounds(id === 'all' ? COUNTRY : regionBounds(id), { padding: 40, duration: 800 });
  };
  const flyTo = (c: Company) => {
    mapRef.current?.easeTo({ center: c.coordinates, zoom: 10, duration: 800 });
  };
  const submit = (e: FormEvent) => { e.preventDefault(); if (matches[0]) flyTo(matches[0]); };

  if (state === 'fallback') {
    return (
      <ExplorationRoot id="street-map" state="fallback">
        <div className="dycom-x__pad">
          <Fallback title="The street map needs a mapping service and WebGL">
            <p>This browser couldn’t load the map tiles or has no WebGL, so here is the still atlas in its place. On a visitor’s device the street map loads from the mapping service and behaves as described below.</p>
            <Atlas viewBox={WHOLE_COUNTRY} style={{ maxWidth: 720, marginTop: 24 }}>
              {offices.map((o) => <rect key={o.key} x={o.point[0] - 6} y={o.point[1] - 6} width="12" height="12" fill="var(--c5-civic)" />)}
            </Atlas>
          </Fallback>
        </div>
      </ExplorationRoot>
    );
  }

  return (
    <ExplorationRoot id="street-map" state={state}>
      <div className="dycom-x__street">
        <div className="dycom-x__street-map">
          <div className="dycom-x__street-regions" role="group" aria-label="Jump to a region">
            {[{ id: 'all', name: 'Whole country' }, ...REGIONS].map((r) => <button type="button" key={r.id} aria-pressed={region === r.id} onClick={() => goTo(r.id)}>{r.name}</button>)}
          </div>
          <div ref={container} className="dycom-x__street-canvas dycom-x__map" aria-label="Street map of Dycom home offices" role="application" />
          <small className="dycom-x__map-attribution">Map © OpenStreetMap contributors, shown in greyscale · Ctrl + scroll to zoom, drag to move</small>
          {state === 'loading' && <p className="dycom-x__map-loading" role="status">Loading the map…</p>}
        </div>
        <div className="dycom-x__street-list">
          <form className="dycom-c5__directory-filters" onSubmit={submit}>
            <label htmlFor="dycom-x-street-q">Company, city or ZIP</label>
            <input id="dycom-x-street-q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type, then Enter to go there" />
            <small aria-live="polite">{query ? `${matches.length} matching` : `${inView.length} ${inView.length === 1 ? 'company' : 'companies'} in view`}</small>
          </form>
          <div className="dycom-c5__company-list" aria-label={query ? 'Matching companies' : 'Companies in view'}>
            {matches.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`dycom-c5__company-row${hover === `${c.city}|${c.state}` ? ' is-active' : ''}`}
                onMouseEnter={() => setHovered(`${c.city}|${c.state}`)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(`${c.city}|${c.state}`)}
                onBlur={() => setHovered(null)}
                onClick={() => { flyTo(c); open(c); }}
              >
                <span><strong>{c.name}</strong><small>{rolesLine(c)}</small></span>
                <ArrowRight size={18} />
              </button>
            ))}
            {!matches.length && <div className="dycom-c5__empty" role="status"><h3>Nothing here yet</h3><p>Zoom out, pick a region above, or search by name.</p></div>}
          </div>
        </div>
      </div>
      {card}
    </ExplorationRoot>
  );
}
