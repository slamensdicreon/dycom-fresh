import atlas from './us-atlas.json';

/**
 * The lower-48 atlas the company map draws: pre-projected state outlines (US Atlas / U.S. Census)
 * in a 900×535 drawing, plus the projection that places any longitude/latitude on it. Office
 * markers are projected from each Company item's Latitude/Longitude, so a company added in
 * Sitecore appears on the map without touching the geometry.
 */
export const ATLAS = { w: atlas.width, h: atlas.height } as const;
export const STATES: { id: string; name: string; path: string }[] = atlas.states;

export type View = { x: number; y: number; w: number; h: number };
export const WHOLE_COUNTRY: View = { x: 0, y: 0, w: ATLAS.w, h: ATLAS.h };

/**
 * Albers equal-area (standard parallels 29.5° and 45.5°) scaled to the atlas drawing. Calibrated
 * against the prototype's pre-projected office points; agrees with them to within 3px.
 */
export function projectLonLat(lon: number, lat: number): [number, number] {
  const rad = Math.PI / 180;
  const p0 = 29.5 * rad;
  const p1 = 45.5 * rad;
  const n = (Math.sin(p0) + Math.sin(p1)) / 2;
  const C = Math.cos(p0) ** 2 + 2 * n * Math.sin(p0);
  const lambda = (lon + 96.6) * rad; // central meridian 96°W, calibrated 0.6° east
  const rho = Math.sqrt(C - 2 * n * Math.sin(lat * rad)) / n;
  const rho0 = Math.sqrt(C - 2 * n * Math.sin(38.7 * rad)) / n;
  const x = rho * Math.sin(n * lambda);
  const y = rho0 - rho * Math.cos(n * lambda);
  return [1038.926 * x + 480.385, -1045.536 * y + 259.274];
}

const NEAREST_FRAMED = 5;
const MAX_ZOOM = 5;
const MIN_SPAN = 150;
export const FRAMED_NEAREST = NEAREST_FRAMED;

/** Frame an origin and the offices nearest to it, padded, in the atlas aspect ratio, no closer than MAX_ZOOM. */
export function frameView(origin: [number, number], nearest: [number, number][]): View {
  const xs = [origin[0], ...nearest.map((p) => p[0])];
  const ys = [origin[1], ...nearest.map((p) => p[1])];
  let w = Math.max(MIN_SPAN, (Math.max(...xs) - Math.min(...xs)) * 1.5, ATLAS.w / MAX_ZOOM);
  let h = Math.max((MIN_SPAN * ATLAS.h) / ATLAS.w, (Math.max(...ys) - Math.min(...ys)) * 1.6, ATLAS.h / MAX_ZOOM);
  if (w / h > ATLAS.w / ATLAS.h) h = (w * ATLAS.h) / ATLAS.w;
  else w = (h * ATLAS.w) / ATLAS.h;
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}
