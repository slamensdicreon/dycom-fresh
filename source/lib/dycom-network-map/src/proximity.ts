import { companies, type Company } from './companies';

/**
 * Proximity without a geocoding service: a small gazetteer (the larger metros
 * and every lower-48 state centre), ZIP prefixes matched to office cities, and
 * great-circle distance in statute miles. Shared by the Final Design
 * Direction's directory, Variation #2 and the design system's Near-you
 * exploration so every surface ranks offices the same way.
 */
export type Place = { name: string; state: string; lon: number; lat: number; kind: 'city' | 'state' | 'zip' };

const CITIES: [string, string, number, number][] = [
  ['New York', 'NY', -74.006, 40.7128], ['Los Angeles', 'CA', -118.2437, 34.0522], ['Chicago', 'IL', -87.6298, 41.8781], ['Houston', 'TX', -95.3698, 29.7604], ['Phoenix', 'AZ', -112.074, 33.4484],
  ['Philadelphia', 'PA', -75.1652, 39.9526], ['San Antonio', 'TX', -98.4936, 29.4241], ['San Diego', 'CA', -117.1611, 32.7157], ['Dallas', 'TX', -96.797, 32.7767], ['Austin', 'TX', -97.7431, 30.2672],
  ['Jacksonville', 'FL', -81.6557, 30.3322], ['Fort Worth', 'TX', -97.3308, 32.7555], ['Columbus', 'OH', -82.9988, 39.9612], ['Charlotte', 'NC', -80.8431, 35.2271], ['Indianapolis', 'IN', -86.1581, 39.7684],
  ['San Francisco', 'CA', -122.4194, 37.7749], ['Seattle', 'WA', -122.3321, 47.6062], ['Denver', 'CO', -104.9903, 39.7392], ['Washington', 'DC', -77.0369, 38.9072], ['Boston', 'MA', -71.0589, 42.3601],
  ['Nashville', 'TN', -86.7816, 36.1627], ['Detroit', 'MI', -83.0458, 42.3314], ['Oklahoma City', 'OK', -97.5164, 35.4676], ['Portland', 'OR', -122.6765, 45.5231], ['Las Vegas', 'NV', -115.1398, 36.1699],
  ['Memphis', 'TN', -90.049, 35.1495], ['Louisville', 'KY', -85.7585, 38.2527], ['Baltimore', 'MD', -76.6122, 39.2904], ['Milwaukee', 'WI', -87.9065, 43.0389], ['Albuquerque', 'NM', -106.6504, 35.0844],
  ['Tucson', 'AZ', -110.9747, 32.2226], ['Fresno', 'CA', -119.7871, 36.7378], ['Sacramento', 'CA', -121.4944, 38.5816], ['Kansas City', 'MO', -94.5786, 39.0997], ['Atlanta', 'GA', -84.388, 33.749],
  ['Miami', 'FL', -80.1918, 25.7617], ['Raleigh', 'NC', -78.6382, 35.7796], ['Omaha', 'NE', -95.9345, 41.2565], ['Minneapolis', 'MN', -93.265, 44.9778], ['Tampa', 'FL', -82.4572, 27.9506],
  ['Orlando', 'FL', -81.3792, 28.5383], ['New Orleans', 'LA', -90.0715, 29.9511], ['Cleveland', 'OH', -81.6944, 41.4993], ['Pittsburgh', 'PA', -79.9959, 40.4406], ['St. Louis', 'MO', -90.1994, 38.627],
  ['Cincinnati', 'OH', -84.512, 39.1031], ['Salt Lake City', 'UT', -111.891, 40.7608], ['Richmond', 'VA', -77.436, 37.5407], ['Birmingham', 'AL', -86.8025, 33.5207], ['Boise', 'ID', -116.2023, 43.615],
  ['Spokane', 'WA', -117.426, 47.6588], ['Little Rock', 'AR', -92.2896, 34.7465], ['Des Moines', 'IA', -93.6091, 41.5868], ['Buffalo', 'NY', -78.8784, 42.8864], ['Hartford', 'CT', -72.6734, 41.7658],
  ['Providence', 'RI', -71.4128, 41.824], ['Charleston', 'SC', -79.9311, 32.7765], ['Greenville', 'SC', -82.394, 34.8526], ['Knoxville', 'TN', -83.9207, 35.9606], ['Columbia', 'SC', -81.0348, 34.0007],
  ['Jackson', 'MS', -90.1848, 32.2988], ['Baton Rouge', 'LA', -91.1403, 30.4515], ['Mobile', 'AL', -88.0399, 30.6954], ['Pensacola', 'FL', -87.2169, 30.4213], ['Tallahassee', 'FL', -84.2807, 30.4383],
  ['Savannah', 'GA', -81.0912, 32.0809], ['Norfolk', 'VA', -76.2859, 36.8508], ['Albany', 'NY', -73.7562, 42.6526], ['Harrisburg', 'PA', -76.8867, 40.2732], ['Grand Rapids', 'MI', -85.6681, 42.9634],
  ['Madison', 'WI', -89.4012, 43.0731], ['Wichita', 'KS', -97.3301, 37.6872], ['Tulsa', 'OK', -95.9928, 36.154], ['El Paso', 'TX', -106.485, 31.7619], ['Reno', 'NV', -119.8138, 39.5296],
  ['Billings', 'MT', -108.5007, 45.7833], ['Fargo', 'ND', -96.7898, 46.8772], ['Sioux Falls', 'SD', -96.7311, 43.5446], ['Cheyenne', 'WY', -104.8202, 41.14], ['Lexington', 'KY', -84.5037, 38.0406],
  ['Chattanooga', 'TN', -85.3097, 35.0456], ['Augusta', 'GA', -82.0105, 33.4735], ['Lakeland', 'FL', -81.9498, 28.0395], ['Fort Myers', 'FL', -81.8723, 26.6406], ['Daytona Beach', 'FL', -81.0228, 29.2108],
];
const STATES: [string, string, number, number][] = [
  ['Alabama', 'AL', -86.79, 32.81], ['Arizona', 'AZ', -111.43, 34.17], ['Arkansas', 'AR', -92.37, 34.97], ['California', 'CA', -119.68, 36.12], ['Colorado', 'CO', -105.31, 39.06], ['Connecticut', 'CT', -72.76, 41.6],
  ['Delaware', 'DE', -75.51, 39.32], ['Florida', 'FL', -81.69, 27.77], ['Georgia', 'GA', -83.64, 33.04], ['Idaho', 'ID', -114.48, 44.24], ['Illinois', 'IL', -88.99, 40.35], ['Indiana', 'IN', -86.26, 39.85],
  ['Iowa', 'IA', -93.21, 42.01], ['Kansas', 'KS', -96.73, 38.53], ['Kentucky', 'KY', -84.67, 37.67], ['Louisiana', 'LA', -91.87, 31.17], ['Maine', 'ME', -69.38, 44.69], ['Maryland', 'MD', -76.8, 39.06],
  ['Massachusetts', 'MA', -71.53, 42.23], ['Michigan', 'MI', -84.54, 43.33], ['Minnesota', 'MN', -93.9, 45.69], ['Mississippi', 'MS', -89.68, 32.74], ['Missouri', 'MO', -92.29, 38.46], ['Montana', 'MT', -110.45, 46.92],
  ['Nebraska', 'NE', -98.27, 41.13], ['Nevada', 'NV', -117.06, 38.31], ['New Hampshire', 'NH', -71.56, 43.45], ['New Jersey', 'NJ', -74.52, 40.3], ['New Mexico', 'NM', -106.25, 34.84], ['New York', 'NY', -74.95, 42.17],
  ['North Carolina', 'NC', -79.81, 35.63], ['North Dakota', 'ND', -99.78, 47.53], ['Ohio', 'OH', -82.76, 40.39], ['Oklahoma', 'OK', -96.93, 35.57], ['Oregon', 'OR', -122.07, 44.57], ['Pennsylvania', 'PA', -77.21, 40.59],
  ['Rhode Island', 'RI', -71.51, 41.68], ['South Carolina', 'SC', -80.95, 33.86], ['South Dakota', 'SD', -99.44, 44.3], ['Tennessee', 'TN', -86.69, 35.75], ['Texas', 'TX', -97.56, 31.05], ['Utah', 'UT', -111.86, 40.15],
  ['Vermont', 'VT', -72.71, 44.05], ['Virginia', 'VA', -78.17, 37.77], ['Washington', 'WA', -121.49, 47.4], ['West Virginia', 'WV', -80.95, 38.49], ['Wisconsin', 'WI', -89.62, 44.27], ['Wyoming', 'WY', -107.3, 42.76],
];
export const PLACES: Place[] = [
  ...CITIES.map(([name, state, lon, lat]) => ({ name, state, lon, lat, kind: 'city' as const })),
  ...STATES.map(([name, state, lon, lat]) => ({ name, state, lon, lat, kind: 'state' as const })),
];
export const placeLabel = (p: Place) => (p.kind === 'state' ? p.name : `${p.name}, ${p.state}`);

/**
 * Resolve a typed place. Exact city/state names first, then a ZIP-like number
 * (matched to the office city sharing its three-digit prefix), then prefixes
 * and substrings of the gazetteer. Returns null when nothing matches.
 */
export function findPlace(query: string, directory: Company[] = companies): Place | null {
  const q = query.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!q) return null;
  const exact = PLACES.find((p) => placeLabel(p).toLowerCase() === q || p.name.toLowerCase() === q || (p.kind === 'state' && p.state.toLowerCase() === q));
  if (exact) return exact;
  if (/^\d{3,5}$/.test(q)) {
    const office = directory.find((c) => c.zip.startsWith(q.slice(0, 3)));
    if (office) return { name: office.city, state: office.state, lon: office.coordinates[0], lat: office.coordinates[1], kind: 'zip' };
    return null;
  }
  if (q.length < 3) return null;
  return PLACES.find((p) => placeLabel(p).toLowerCase().startsWith(q)) ?? PLACES.find((p) => p.name.toLowerCase().includes(q)) ?? null;
}

/** Great-circle distance in statute miles. */
export function distanceMiles(a: [number, number], b: [number, number]) {
  const rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad;
  const dLon = (b[0] - a[0]) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLon / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Albers equal-area projection (standard parallels 29.5° and 45.5°) scaled to
 * the atlas's 900×535 drawing. Calibrated against the pre-projected office
 * points; agrees with them to within 3px.
 */
export function projectLonLat(lon: number, lat: number): [number, number] {
  const rad = Math.PI / 180;
  const p0 = 29.5 * rad;
  const p1 = 45.5 * rad;
  const n = (Math.sin(p0) + Math.sin(p1)) / 2;
  const C = Math.cos(p0) ** 2 + 2 * n * Math.sin(p0);
  const lam = (lon + 96) * rad - -0.6 * rad;
  const rho = Math.sqrt(C - 2 * n * Math.sin(lat * rad)) / n;
  const rho0 = Math.sqrt(C - 2 * n * Math.sin(38.7 * rad)) / n;
  const x = rho * Math.sin(n * lam);
  const y = rho0 - rho * Math.cos(n * lam);
  return [1038.926 * x + 480.385, -1045.536 * y + 259.274];
}

