// MapLibre, loaded on demand and shared by the explorations that draw a real
// basemap (street map, near you). The library and its worker are only fetched
// when one of them mounts, so the rest of the system never pays for them.
import type { RasterLayerSpecification, StyleSpecification } from 'maplibre-gl';

export type MapLibre = typeof import('maplibre-gl');

export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

let loading: Promise<MapLibre> | null = null;
/** The MapLibre module with its worker resolved under this artifact's base path (Vite bundles the `?worker&url` import). */
export function loadMapLibre(): Promise<MapLibre> {
  loading ??= Promise.all([import('maplibre-gl'), import('maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url')]).then(([maplibregl, worker]) => {
    maplibregl.setWorkerUrl(worker.default);
    return maplibregl;
  });
  return loading;
}

/** A style with one raster basemap layer; `paint` carries any desaturation or tone adjustment. */
export function rasterStyle({ tiles, attribution, paint, maxzoom = 19 }: { tiles: string | string[]; attribution: string; paint?: RasterLayerSpecification['paint']; maxzoom?: number }): StyleSpecification {
  return {
    version: 8,
    sources: { basemap: { type: 'raster', tiles: Array.isArray(tiles) ? tiles : [tiles], tileSize: 256, maxzoom, attribution } },
    layers: [{ id: 'basemap', type: 'raster', source: 'basemap', ...(paint ? { paint } : {}) }],
  };
}

/**
 * The OpenStreetMap community tiles the street map uses, desaturated in the
 * browser so the brand supplies the only colour: full desaturation, the blacks
 * lifted a little and the contrast softened so the paper tone sits with the
 * site's greys rather than the service's.
 */
export const GREYSCALE_PAINT: RasterLayerSpecification['paint'] = { 'raster-saturation': -1, 'raster-brightness-min': 0.08, 'raster-contrast': -0.12 };
