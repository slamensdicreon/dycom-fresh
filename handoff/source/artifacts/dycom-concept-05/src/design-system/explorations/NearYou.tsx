// Exploration 04 — location first. One compact question (where are you?), a
// real basemap that zooms to the visitor and the closest home offices, and a
// grid of office tiles ranked by distance.
import { useContext, useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import type { GeoJSONSource, LngLatBoundsLike, Map as MapInstance, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowRight, LocateFixed } from 'lucide-react';
import { Atlas, ExplorationRoot, MotionContext, WHOLE_COUNTRY, distanceMiles, offices, prefersReducedMotion, projectLonLat, rolesCount, useCompanyCard, type Company, type ExplorationState, type Office } from './shared';
import { hasWebGL, loadMapLibre } from './maplibre';
import { PLACES, findPlace as findSharedPlace, placeLabel, type Place } from '@workspace/dycom-network-map/proximity';

const findPlace = (query: string): Place | null => findSharedPlace(query, offices.flatMap((o) => o.members));

// OpenFreeMap's Positron style: a light-grey vector basemap from a different
// service than the street map, so the two can be compared. No key, no account,
// no usage cap, and allowed in production; attribution is the only condition.
// (CARTO's Positron raster tiles, used first, now answer every request with an
// "API key required" image.)
const STYLE = 'https://tiles.openfreemap.org/styles/positron';
const ATTRIBUTION = '© OpenFreeMap · © OpenMapTiles · Data from OpenStreetMap contributors';
const COUNTRY: LngLatBoundsLike = [[-125, 24.5], [-66.5, 49.5]];
const PAGE = 6;

// The gazetteer, ZIP matching and distance maths live in the shared map library (proximity.ts).

type Origin = { label: string; lon: number; lat: number };
type Ranked = { office: Office; miles: number };

const rank = (i: number) => String(i + 1).padStart(2, '0');

export default function NearYou() {
  const listId = useId();
  const motionOff = useContext(MotionContext);
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const markers = useRef<Map<string, Marker>>(new Map());
  const visitor = useRef<Marker | null>(null);
  const [state, setState] = useState<ExplorationState>('loading');
  const [mapReady, setMapReady] = useState(false);
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE);
  const [locating, setLocating] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const { open, card } = useCompanyCard('dycom-x-near-card');
  const openRef = useRef(open);
  openRef.current = open;

  const ranked = useMemo<Ranked[]>(() => {
    if (!origin) return [];
    return offices.map((o) => ({ office: o, miles: distanceMiles([origin.lon, origin.lat], o.coordinates) })).sort((a, b) => a.miles - b.miles);
  }, [origin]);
  const shown = useMemo(() => ranked.slice(0, limit), [ranked, limit]);
  // Only the still-atlas fallback needs the visitor in atlas space.
  const originPoint = origin ? projectLonLat(origin.lon, origin.lat) : null;

  const setHovered = (key: string | null) => {
    setHover(key);
    markers.current.forEach((m, k) => m.getElement().classList.toggle('is-active', k === key));
  };
  const place = (o: Origin) => { setMessage(null); setLimit(PAGE); setOrigin(o); };

  // The map: created when its box is visible (it is hidden on phones, where the grid is the whole answer).
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    let cancelled = false;
    let started = false;
    const timers: number[] = [];
    async function start() {
      if (started || cancelled || !el) return;
      started = true;
      if (!hasWebGL()) { fail(); return; }
      try {
        const maplibregl = await loadMapLibre();
        if (cancelled) return;
        const map = new maplibregl.Map({
          container: el,
          style: STYLE,
          bounds: COUNTRY,
          fitBoundsOptions: { padding: 24 },
          minZoom: 2,
          maxZoom: 14,
          attributionControl: false,
          dragRotate: false,
          pitchWithRotate: false,
          cooperativeGestures: true,
        });
        mapRef.current = map;
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        // A map that has not loaded within 15 seconds (no service, blocked worker) gives way to the fallback.
        const timer = window.setTimeout(() => { if (!map.loaded()) fail('did not load in time'); }, 15000);
        timers.push(timer);
        map.on('load', () => {
          if (cancelled) return;
          window.clearTimeout(timer);
          map.addSource('links', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
          map.addLayer({ id: 'links', type: 'line', source: 'links', paint: { 'line-color': '#00b609', 'line-width': 1.5 } });
          for (const office of offices) {
            const pin = document.createElement('button');
            pin.type = 'button';
            pin.className = 'dycom-x__pin';
            pin.setAttribute('aria-label', `${office.members.map((m) => m.name).join(', ')} — ${office.city}, ${office.state}`);
            pin.addEventListener('mouseenter', () => setHovered(office.key));
            pin.addEventListener('mouseleave', () => setHovered(null));
            pin.addEventListener('focus', () => setHovered(office.key));
            pin.addEventListener('blur', () => setHovered(null));
            pin.addEventListener('click', () => openRef.current(office.members[0]));
            markers.current.set(office.key, new maplibregl.Marker({ element: pin }).setLngLat(office.coordinates).addTo(map));
          }
          const you = document.createElement('div');
          you.className = 'dycom-x__near-you';
          you.setAttribute('aria-label', 'You');
          visitor.current = new maplibregl.Marker({ element: you }).setLngLat([0, 0]);
          setMapReady(true);
          setState('ready');
        });
        // Individual tile failures are tolerated (the map still works); anything else before load is fatal.
        map.on('error', (e) => { if (!map.loaded() && !('tile' in e && e.tile)) fail(e.error?.message); });
      } catch (error) {
        fail(error instanceof Error ? error.message : String(error));
      }
    }
    const visible = () => el.clientWidth > 0 && el.clientHeight > 0;
    const fail = (reason?: string) => { if (cancelled) return; if (reason) console.warn('Near-you map unavailable', reason); mapRef.current?.remove(); mapRef.current = null; setState('fallback'); };
    if (visible()) void start(); else setState('ready');
    const observer = new ResizeObserver(() => { if (visible()) void start(); });
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      markers.current.forEach((m) => m.remove());
      markers.current.clear();
      visitor.current?.remove();
      visitor.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // The visitor, the numbered offices, the connecting lines and the view follow the answer.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const instant = motionOff || prefersReducedMotion();
    const shownKeys = new Map(shown.map((r, i) => [r.office.key, i]));
    markers.current.forEach((m, key) => {
      const el = m.getElement();
      const i = shownKeys.get(key);
      el.classList.toggle('is-ranked', i !== undefined);
      el.classList.toggle('is-dim', !!origin && i === undefined);
      el.querySelector('b')?.remove();
      if (i !== undefined) { const b = document.createElement('b'); b.textContent = rank(i); el.appendChild(b); }
    });
    const links = map.getSource('links') as GeoJSONSource | undefined;
    if (!origin) {
      visitor.current?.remove();
      links?.setData({ type: 'FeatureCollection', features: [] });
      map.fitBounds(COUNTRY, { padding: 24, duration: instant ? 0 : 800 });
      return;
    }
    visitor.current?.setLngLat([origin.lon, origin.lat]).addTo(map);
    links?.setData({ type: 'FeatureCollection', features: shown.map((r) => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[origin.lon, origin.lat], r.office.coordinates] } })) });
    const lons = [origin.lon, ...shown.map((r) => r.office.coordinates[0])];
    const lats = [origin.lat, ...shown.map((r) => r.office.coordinates[1])];
    map.fitBounds([[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]], { padding: { top: 56, right: 72, bottom: 48, left: 56 }, maxZoom: 9, duration: instant ? 0 : 900 });
  }, [origin, shown, mapReady, motionOff]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = findPlace(query);
    if (!found) { setMessage(`We couldn’t place “${query}”. Try a larger city nearby, a state, or a ZIP.`); return; }
    place({ label: placeLabel(found), lon: found.lon, lat: found.lat });
  };
  const locate = () => {
    if (!('geolocation' in navigator)) { setMessage('This browser can’t share a location. Type a city or state instead.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocating(false); setQuery(''); place({ label: 'your location', lon: pos.coords.longitude, lat: pos.coords.latitude }); },
      () => { setLocating(false); setMessage('Location wasn’t shared. Type a city or state instead.'); },
      { timeout: 8000 },
    );
  };
  const example = (ex: string) => { const p = findPlace(ex)!; setQuery(ex); place({ label: placeLabel(p), lon: p.lon, lat: p.lat }); };

  return (
    <ExplorationRoot id="near-you" state={state}>
      <div className="dycom-x__near">
        <form className="dycom-x__near-bar" onSubmit={submit}>
          <label htmlFor={`${listId}-q`}>Where are you?</label>
          <input id={`${listId}-q`} list={`${listId}-places`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="City, state or ZIP" autoComplete="off" />
          <datalist id={`${listId}-places`}>{PLACES.map((p) => <option key={placeLabel(p)} value={placeLabel(p)} />)}</datalist>
          <button type="submit" className="dycom-c5__button">Find<ArrowRight size={17} aria-hidden="true" /></button>
          <button type="button" className="dycom-x__near-locate" onClick={locate} aria-busy={locating}><LocateFixed size={18} aria-hidden="true" />{locating ? 'Finding you…' : 'Use my location'}</button>
        </form>
        {message && <p className="dycom-x__near-message" role="status">{message}</p>}
        <div className="dycom-x__near-map">
          <div ref={container} className="dycom-x__near-canvas dycom-x__map" role="application" aria-label={origin ? `Map of you and the ${shown.length} closest home offices` : 'Map of Dycom home offices'} />
          {state === 'fallback' && (
            <div className="dycom-x__near-still">
              <Atlas viewBox={WHOLE_COUNTRY} label="Where the home offices are">
                {originPoint && shown.map(({ office }) => <line key={office.key} x1={originPoint[0]} y1={originPoint[1]} x2={office.point[0]} y2={office.point[1]} stroke="var(--c5-green)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />)}
                {offices.map((o) => { const near = shown.some((r) => r.office.key === o.key); return <rect key={o.key} x={o.point[0] - (near ? 7 : 4)} y={o.point[1] - (near ? 7 : 4)} width={near ? 14 : 8} height={near ? 14 : 8} fill={near ? 'var(--c5-civic)' : 'var(--c5-civic-soft)'} opacity={origin && !near ? 0.45 : 1} />; })}
                {originPoint && <rect x={originPoint[0] - 11} y={originPoint[1] - 11} width="22" height="22" fill="none" stroke="var(--c5-green)" strokeWidth="3" />}
              </Atlas>
              <p className="dycom-x__near-caption">The basemap needs a mapping service and WebGL; this browser has neither, so the still atlas stands in.</p>
            </div>
          )}
          {state === 'loading' && <p className="dycom-x__map-loading" role="status">Loading the map…</p>}
          <small className="dycom-x__map-attribution">{ATTRIBUTION}</small>
        </div>
        <div className="dycom-x__near-results" aria-live="polite">
          {!origin ? (
            <div className="dycom-x__near-empty">
              <p><strong>{offices.length} home offices</strong> across the country. Tell us where you are to see which are closest — by straight-line distance, so it’s a guide, not directions.</p>
              <div className="dycom-x__near-examples">{['Tampa, FL', 'Ohio', 'Denver, CO', 'Philadelphia, PA'].map((ex) => <button type="button" key={ex} onClick={() => example(ex)}>{ex}</button>)}</div>
            </div>
          ) : (
            <>
              <h3>Closest to {origin.label}</h3>
              <ol className="dycom-x__near-grid">
                {shown.map(({ office, miles }, i) => <OfficeTile key={office.key} office={office} miles={miles} index={i} active={hover === office.key} onHover={setHovered} onOpen={open} />)}
              </ol>
              {ranked.length > shown.length && <button type="button" className="dycom-c5__text-link dycom-x__near-more" onClick={() => setLimit((n) => n + PAGE)}>Show {ranked.length - shown.length >= PAGE ? 'six' : ranked.length - shown.length} more<ArrowRight size={17} aria-hidden="true" /></button>}
            </>
          )}
        </div>
      </div>
      {card}
    </ExplorationRoot>
  );
}

function OfficeTile({ office, miles, index, active, onHover, onOpen }: { office: Office; miles: number; index: number; active: boolean; onHover: (key: string | null) => void; onOpen: (c: Company) => void }) {
  return (
    <li className={`dycom-x__near-tile${active ? ' is-active' : ''}`} onMouseEnter={() => onHover(office.key)} onMouseLeave={() => onHover(null)}>
      <div className="dycom-x__near-tile-head"><b>{rank(index)}</b><span>{Math.round(miles).toLocaleString()} mi</span></div>
      <p className="dycom-x__near-tile-place">{office.city}, {office.state}</p>
      <ul className="dycom-x__near-tile-companies">
        {office.members.map((c) => (
          <li key={c.id}>
            <button type="button" onClick={() => onOpen(c)} onFocus={() => onHover(office.key)} onBlur={() => onHover(null)}>
              <span>{c.name}<small>{rolesCount(c)}</small></span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </li>
  );
}
