import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Map as MapInstance, Marker as MapMarker } from "maplibre-gl";
import { ArrowUpRight, ArrowRight, RotateCcw, Map as MapIcon, List } from "lucide-react";
import geometry from "./map-geometry.json";
import statesData from "./us-states.json";
import { companies, type Company } from "./companies";
import { careersFor, findCompany, JOBS_PORTAL, states } from "./discovery";
import { SampleJobs } from "./SampleJobs";
import { SAMPLE_LABEL, sampleJobsFor, sampleNetworkTotal, sampleOpenRoleCount, type SampleJob } from "./sample-jobs";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";

export { companies, findCompany, careersFor, JOBS_PORTAL };
export type { Company, SampleJob };
export { SampleJobs, SAMPLE_LABEL, sampleJobsFor, sampleNetworkTotal, sampleOpenRoleCount };
const NETWORK_SAMPLE_TOTAL = sampleNetworkTotal(companies);

const THEMES = {
  signal: { bg: "#f3f6fa", land: "#dfe6ef", border: "#ffffff", pin: "#041054", pinStroke: "#ffffff", active: "#00b609", halo: "#04105422", label: "#041054", halo2: "#ffffff",
    top: "HOME OFFICES", filter: "Find a company", place: "City, ZIP or company", details: "Company profile", noun: "Home office" },
  "signal-works": { bg: "#04122e", land: "#0b2350", border: "#1d3f7a", pin: "#00eb49", pinStroke: "#04122e", active: "#ffffff", halo: "#00eb4940", label: "#e8f0ff", halo2: "#04122e",
    top: "WHERE CREWS START", filter: "Find your home base", place: "Your city or ZIP", details: "Start here", noun: "Crew home base" },
  "dirt-digital": { bg: "#1e3a5f", land: "#c9b48a", border: "#8a7350", pin: "#003d2c", pinStroke: "#e0b13a", active: "#00b609", halo: "#003d2c33", label: "#1b1408", halo2: "#efe4cb",
    top: "BOOTS ON THE GROUND", filter: "Dig in", place: "Town, ZIP or company", details: "The local company", noun: "Home office" },
} as const;
const groupKey = (company: Company) => `${company.city}|${company.state}`;
const bounds: [[number, number], [number, number]] = [[-126, 24], [-66, 50.5]];
type Props = {
  variant: "signal" | "signal-works" | "dirt-digital";
  selectedCompany?: string | null;
  onSelect?: (company: Company) => void;
  contactHref?: string;
  /** "directory" adds a compact toolbar with an explicit map/directory toggle. Defaults to the original panel layout. */
  layout?: "panel" | "directory";
};

/** Focused reuse of Concept 4's office map, independent of homepage UI/global tokens. */
export function NetworkExplorer({ variant, selectedCompany, onSelect, contactHref = "#contact", layout = "panel" }: Props) {
  const directory = layout === "directory";
  const [view, setView] = useState<"map" | "list">("map");
  const id = useId();
  const t = THEMES[variant];
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const markerRef = useRef<MapMarker[]>([]);
  const reducedRef = useRef(false);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [selected, setSelected] = useState(() => findCompany(selectedCompany) || companies[0]);
  const selectedRef = useRef(selected.id);
  selectedRef.current = selected.id;
  const [focused, setFocused] = useState(false);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [region, setRegion] = useState("All regions");
  const [state, setState] = useState("All states");
  const [place, setPlace] = useState("");

  const visible = useMemo(() => {
    const query = place.trim().toLowerCase();
    return companies.filter(company =>
      (region === "All regions" || company.region === region) &&
      (state === "All states" || company.state === state) &&
      (!query || company.city.toLowerCase().includes(query) || company.zip.startsWith(query) || company.name.toLowerCase().includes(query))
    );
  }, [region, state, place]);
  const groups = useMemo(() => {
    const result = new Map<string, Company[]>();
    companies.forEach(company => result.set(groupKey(company), [...(result.get(groupKey(company)) || []), company]));
    return [...result.values()];
  }, []);
  const shared = companies.filter(company => groupKey(company) === groupKey(selected) && company.id !== selected.id);

  function chooseCompany(company: Company, notify = true) {
    setSelected(company);
    setFocused(true);
    // A shared-office or downstream selection must never become an invisible marker.
    setRegion(current => current === "All regions" || current === company.region ? current : "All regions");
    setState(current => current === "All states" || current === company.state ? current : "All states");
    setPlace(current => {
      const query = current.trim().toLowerCase();
      return !query || company.city.toLowerCase().includes(query) || company.zip.startsWith(query) || company.name.toLowerCase().includes(query) ? current : "";
    });
    if (notify) onSelectRef.current?.(company);
    mapRef.current?.flyTo({ center: company.coordinates, zoom: 5.1, duration: reducedRef.current ? 0 : 1350, essential: false });
  }
  function fitAll() {
    mapRef.current?.fitBounds(bounds, { padding: { top: 62, bottom: 62, left: 20, right: 20 }, duration: reducedRef.current ? 0 : 1000 });
  }
  function reset() {
    setRegion("All regions"); setState("All states"); setPlace(""); setFocused(false);
    setSelected(companies[0]); onSelectRef.current?.(companies[0]); fitAll();
  }
  useEffect(() => {
    const company = findCompany(selectedCompany);
    if (company && company.id !== selectedRef.current) chooseCompany(company, false);
  }, [selectedCompany]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reducedRef.current = preference.matches; };
    update(); preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | undefined;
    async function initialize() {
      if (!container.current || cancelled || mapRef.current) return;
      try {
        const maplibregl = await import("maplibre-gl");
        if (cancelled || !container.current) return;
        const map = new maplibregl.Map({
          container: container.current,
          style: {
            version: 8,
            sources: { states: { type: "geojson", data: statesData as unknown as import("geojson").FeatureCollection,
              attribution: '<a href="https://github.com/topojson/us-atlas" target="_blank" rel="noopener">US Atlas / U.S. Census Bureau</a>' } },
            layers: [
              { id: "base", type: "background", paint: { "background-color": t.bg } },
              { id: "land", type: "fill", source: "states", paint: { "fill-color": t.land, "fill-opacity": 1 } },
              { id: "borders", type: "line", source: "states", paint: { "line-color": t.border, "line-width": variant === "dirt-digital" ? 1.1 : .8, "line-opacity": .9 } },
            ],
          },
          center: [-97, 38], zoom: 3, minZoom: 2, maxZoom: 7, attributionControl: false,
          dragRotate: false, pitchWithRotate: false, scrollZoom: false, cooperativeGestures: true,
        });
        mapRef.current = map;
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
        map.on("load", () => {
          if (cancelled) return;
          map.fitBounds(bounds, { padding: { top: 62, bottom: 62, left: 20, right: 20 }, duration: 0 });
          markerRef.current = groups.map(members => {
            const first = members[0];
            const element = document.createElement("button");
            element.type = "button";
            element.className = "dnm-pin" + (members.length > 1 ? " dnm-pin-group" : "");
            element.setAttribute("aria-label", members.length > 1 ? `Shared office location ${first.city}, ${first.state}: ${members.map(member => member.name).join(", ")}` : `${first.name} home office, ${first.city}, ${first.state}`);
            element.title = members.map(member => member.name).join(" · ") + ` · ${first.city}, ${first.state}`;
            element.dataset.group = groupKey(first);
            element.appendChild(document.createElement("span"));
            if (members.length > 1) {
              const badge = document.createElement("b");
              badge.textContent = String(members.length); badge.setAttribute("aria-hidden", "true"); element.appendChild(badge);
            }
            element.addEventListener("click", () => {
              // Prefer a member matching current filters, then the current selection.
              const candidates = visibleRef.current.filter(company => groupKey(company) === groupKey(first));
              chooseCompany(candidates.find(company => company.id === selectedRef.current) || candidates[0] || first);
            });
            return new maplibregl.Marker({ element }).setLngLat(first.coordinates).addTo(map);
          });
          setReady(true);
        });
        map.on("error", () => { if (!cancelled && !map.loaded()) setUnavailable(true); });
      } catch { if (!cancelled) setUnavailable(true); }
    }
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { void initialize(); observer?.disconnect(); }
      }, { rootMargin: "350px" });
      if (container.current) observer.observe(container.current);
    } else void initialize();
    return () => {
      cancelled = true; observer?.disconnect();
      markerRef.current.forEach(marker => marker.remove()); markerRef.current = [];
      mapRef.current?.remove(); mapRef.current = null;
    };
  }, []);
  useEffect(() => {
    if (view !== "map") return;
    const frame = requestAnimationFrame(() => mapRef.current?.resize());
    return () => cancelAnimationFrame(frame);
  }, [view]);
  const visibleRef = useRef(visible);
  visibleRef.current = visible;
  useEffect(() => {
    markerRef.current.forEach(marker => {
      const element = marker.getElement();
      const active = element.dataset.group === groupKey(selected);
      element.classList.toggle("selected", active);
      element.setAttribute("aria-pressed", String(active));
      element.style.zIndex = active ? "4" : "1";
      element.style.display = visible.some(company => groupKey(company) === element.dataset.group) ? "" : "none";
    });
  }, [selected, visible, ready]);
  // All filter types focus both renderers on the matching offices.
  useEffect(() => {
    if (!ready || focused) return;
    if (visible.length === companies.length) { fitAll(); return; }
    if (!visible.length) return;
    const longs = visible.map(company => company.coordinates[0]), lats = visible.map(company => company.coordinates[1]);
    mapRef.current?.fitBounds([[Math.min(...longs) - 2, Math.min(...lats) - 2], [Math.max(...longs) + 2, Math.max(...lats) + 2]],
      { padding: 60, duration: reducedRef.current ? 0 : 1100, maxZoom: 4.6 });
  }, [visible, ready, focused]);

  const selectedPoint = geometry.points.find(point => point.id === selected.id)?.point;
  const visiblePoints = geometry.points.filter(point => visible.some(company => company.id === point.id)).map(point => point.point).filter(Boolean) as number[][];
  let fallbackView = "0 0 900 535";
  if (focused && selectedPoint) fallbackView = `${selectedPoint[0] - 240} ${selectedPoint[1] - 150} 480 300`;
  else if (visiblePoints.length && visible.length < companies.length) {
    const xs = visiblePoints.map(point => point[0]), ys = visiblePoints.map(point => point[1]);
    const x = Math.min(...xs) - 100, y = Math.min(...ys) - 100;
    fallbackView = `${x} ${y} ${Math.max(...xs) - x + 100} ${Math.max(...ys) - y + 100}`;
  }
  const careers = careersFor(selected);
  return <div className={`dycom-network-map dnm-${variant}${directory ? ` dnm-directory is-${view}` : ""}`}>
    {directory && <div className="dnm-bar">
      <p className="dnm-bar-count" aria-live="polite"><strong>{visible.length}</strong> of {companies.length} operating companies · <strong>{NETWORK_SAMPLE_TOTAL.toLocaleString()}</strong> sample openings</p>
      <div className="dnm-toggle" role="group" aria-label="Choose view">
        <button type="button" aria-pressed={view === "map"} onClick={() => setView("map")}><MapIcon size={15} aria-hidden="true" />Map</button>
        <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={15} aria-hidden="true" />Directory</button>
      </div>
      <button type="button" className="dnm-bar-reset" onClick={reset}><RotateCcw size={14} aria-hidden="true" />Reset</button>
    </div>}
    <div className="dnm-scene" hidden={directory && view === "list"} aria-label="Map of Dycom company home offices">
      {(!ready || unavailable) && <svg className="dnm-svg" viewBox={fallbackView} aria-label="Interactive geographic map of company home offices" role="group">
        <title>Dycom company home offices across the United States</title>
        {geometry.states.map(state => <path key={state.id} d={state.path || ""} fill={t.land} stroke={t.border} strokeWidth=".8" vectorEffect="non-scaling-stroke" />)}
        {groups.map(members => {
          const matching = members.filter(company => visible.some(candidate => candidate.id === company.id));
          const company = matching.find(company => company.id === selected.id) || matching[0];
          if (!company) return null;
          const point = geometry.points.find(point => point.id === members[0].id)?.point;
          if (!point) return null;
          const active = groupKey(selected) === groupKey(company);
          return <g key={groupKey(company)} role="button" tabIndex={0} aria-label={`${matching.map(company => company.name).join(", ")} home office, ${company.city}, ${company.state}`} aria-pressed={active}
            onClick={() => chooseCompany(company)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); chooseCompany(company); } }}
            className="dnm-svg-pin" transform={`translate(${point[0]},${point[1]})`}>
            <title>{`${members.map(company => company.name).join(" · ")} · ${company.city}, ${company.state}`}</title>
            <circle r="12" fill={active ? t.halo : "transparent"} />
            {variant === "dirt-digital"
              ? <rect x={active ? -6 : -4} y={active ? -6 : -4} width={active ? 12 : 8} height={active ? 12 : 8} transform="rotate(45)" fill={active ? t.active : t.pin} stroke={t.pinStroke} strokeWidth="1.5" />
              : <circle r={active ? 6 : 3.8} fill={active ? t.active : t.pin} stroke={t.pinStroke} strokeWidth="1.5" />}
            {members.length > 1 && <text className="dnm-group-label" x="8" y="-6" style={{ fill: t.label, stroke: t.halo2 }}>{members.length}</text>}
            {active && focused && <text x="12" y="4" style={{ fill: t.label, stroke: t.halo2 }}>{company.city}, {company.state}</text>}
          </g>;
        })}
      </svg>}
      <div className={ready && !unavailable ? "dnm-mount is-ready" : "dnm-mount"} ref={container} hidden={unavailable} />
      <div className="dnm-topline"><span>{region === "All regions" ? `${t.top} · ${visible.length}` : `${region.toUpperCase()} · ${visible.length}`}</span><button type="button" onClick={reset}><RotateCcw size={12} />Reset view</button></div>
      {unavailable && <div className="dnm-blocked" role="status">Enhanced map unavailable. The geographic map and company list remain interactive.</div>}
      <div className="dnm-key"><span />Home offices. Numbered points are shared. Not service areas.</div>
      <div className="dnm-attribution">Geography: <a href="https://github.com/topojson/us-atlas">US Atlas / U.S. Census</a> · <a href="https://dycomind.com/about-us/companies/">Company data: Dycom</a></div>
    </div>
    <div className="dnm-panel">
      <p className="dnm-panel-title">{t.filter}</p>
      <div className="dnm-filters">
        <label htmlFor={`${id}-place`}>{t.place}<input id={`${id}-place`} value={place} onChange={event => { setPlace(event.target.value); setFocused(false); }} placeholder="e.g. Tampa or 30022" /></label>
        <div className="dnm-filter-row">
          <label htmlFor={`${id}-region`}>Region<select id={`${id}-region`} value={region} onChange={event => { setRegion(event.target.value); setFocused(false); }}>{["All regions", "West", "Midwest", "Northeast", "South"].map(region => <option key={region}>{region}</option>)}</select></label>
          <label htmlFor={`${id}-state`}>State<select id={`${id}-state`} value={state} onChange={event => { setState(event.target.value); setFocused(false); }}>{["All states", ...states].map(state => <option key={state}>{state}</option>)}</select></label>
        </div>
      </div>
      <p className="dnm-count" aria-live="polite">{visible.length ? `${visible.length} of ${companies.length} companies` : "No companies match"}</p>
      {visible.length ? <div className="dnm-list" aria-label="Companies">{visible.map(company => <button type="button" key={company.id} aria-pressed={selected.id === company.id} onClick={() => chooseCompany(company)}><span>{company.name}<small>{company.city}, {company.state} · {sampleOpenRoleCount(company.id)} sample roles</small></span><ArrowRight size={13} /></button>)}</div>
        : <div className="dnm-empty"><p>Try another home-office city or company name, or clear your filters.</p><button type="button" onClick={reset}>Clear filters</button></div>}
    </div>
    <div className="dnm-details" aria-live="polite">
      <div className="dnm-card-head"><span className="dnm-mark" aria-hidden="true">{selected.name.slice(0, 1)}</span><div><small>{t.details} · {t.noun}</small><h3>{selected.name}</h3></div></div>
      <p className="dnm-address">{selected.address}<br />{selected.city}, {selected.state} {selected.zip}</p>
      {shared.length > 0 && <p className="dnm-note">Shares this office location with: {shared.map((company, index) => <span key={company.id}>{index > 0 && ", "}<button type="button" onClick={() => chooseCompany(company)}>{company.name}</button></span>)}</p>}
      <SampleJobs company={selected} careersHref={careers} accent={variant === "signal" ? "#83ed92" : "var(--dnm-accent)"} limit={variant === "signal" && directory ? 2 : 3} />
      <div className="dnm-actions">
        <a href={selected.website || "https://dycomind.com/about-us/companies/"} target="_blank" rel="noopener noreferrer">{variant === "signal-works" ? "Meet the company" : "Official website"}<ArrowUpRight size={14} /><span className="dnm-sr-only"> (opens in a new tab)</span></a>
        <a href={careers} target="_blank" rel="noopener noreferrer">{variant === "signal-works" ? "See open roles" : careers === JOBS_PORTAL ? "Dycom careers portal" : "Company careers"}<ArrowUpRight size={14} /><span className="dnm-sr-only"> (opens in a new tab)</span></a>
        <a href={contactHref}>{variant === "dirt-digital" ? "Company contact options" : "Contact about this company"}<ArrowRight size={14} /></a>
      </div>
      {!visible.some(company => company.id === selected.id) && <p className="dnm-selection-note">Selected office is outside your current filters. <button type="button" onClick={() => chooseCompany(selected)}>Show selected office</button></p>}
    </div>
  </div>;
}
