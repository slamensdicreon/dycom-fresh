// Styling finishes of the company map. Every finish is the same component with
// the same data, markers, hover pulse and card; only the treatment of the land,
// the marker glyph and the arrangement differ. The Consolidated direction ships
// the first of each. Summaries are client-facing (rendered in the design system);
// rationales are internal notes.

export type MapTreatment = 'halftone' | 'solid' | 'atlas' | 'dot-grid' | 'night';
export type MapMarker = 'square' | 'outline' | 'post';
export type MapLayout = 'split' | 'full-bleed' | 'directory-first';

export type MapVariantOption<T extends string> = { id: T; name: string; summary: string; rationale: string };

export const MAP_TREATMENTS: MapVariantOption<MapTreatment>[] = [
  {
    id: 'halftone',
    name: 'Halftone',
    summary: 'Dotted land with dotted state lines on paper; the finish the site ships with.',
    rationale: 'The dotted map texture and hover ring were the favourite look in the concept review, so this is the recommended default.',
  },
  {
    id: 'solid',
    name: 'Solid Civic',
    summary: 'States filled solid Civic Blue, separated by paper hairlines; white markers.',
    rationale: 'A bolder, more graphic map that reads at a glance from across a screen; keeps blue leading with no texture at all.',
  },
  {
    id: 'atlas',
    name: 'Atlas outline',
    summary: 'Open paper with fine Civic Blue state outlines and no fill; the quietest option.',
    rationale: 'Lets the markers and directory carry the page; closest to a printed atlas, useful if the dotted field reads as busy next to photography.',
  },
  {
    id: 'dot-grid',
    name: 'Square dot grid',
    summary: 'The halftone idea rebuilt from small squares on a strict grid, with solid soft-Civic hairlines.',
    rationale: 'Keeps the liked texture while honouring the no-circles rule literally; the grid echoes the square markers.',
  },
  {
    id: 'night',
    name: 'Night panel',
    summary: 'Inverted: deep Civic panel, Civic states with soft-Civic hairlines, white markers and key.',
    rationale: 'Gives the chapter a dark anchor between two light sections, in the same way the Pathways and Closing chapters do; green pulses read strongest here.',
  },
];

export const MAP_MARKERS: MapVariantOption<MapMarker>[] = [
  { id: 'square', name: 'Filled square', summary: 'A 14px filled square; the default.', rationale: 'Plain location squares, never the signal mark.' },
  { id: 'outline', name: 'Hollow square', summary: 'A 2.5px outlined square that lets the land show through.', rationale: 'Lighter on dense regions such as the Southeast, where filled squares cluster.' },
  { id: 'post', name: 'Square post', summary: 'A small square head on a short stem, planted on the location.', rationale: 'Reads as a “place” without borrowing the teardrop map-pin cliché; still square.' },
];

export const MAP_LAYOUTS: MapVariantOption<MapLayout>[] = [
  { id: 'split', name: 'Map left', summary: 'Map at ≥60% of the width, directory on the right; the default.', rationale: 'The favourite arrangement from the concept review, with the larger map the requirements ask for.' },
  { id: 'full-bleed', name: 'Full-bleed map', summary: 'The map spans the full chapter width; the directory floats as a panel over its right edge.', rationale: 'Maximises the map on wide screens; the directory stays reachable without scrolling past the map.' },
  { id: 'directory-first', name: 'Directory first', summary: 'Directory on the left for people who search by name, map on the right.', rationale: 'Puts search first for returning visitors who already know the company they want.' },
];

export const DEFAULT_MAP_VARIANT = { treatment: 'halftone', marker: 'square', layout: 'split' } as const;

export const isMapTreatment = (value: string): value is MapTreatment => MAP_TREATMENTS.some((o) => o.id === value);
export const isMapMarker = (value: string): value is MapMarker => MAP_MARKERS.some((o) => o.id === value);
export const isMapLayout = (value: string): value is MapLayout => MAP_LAYOUTS.some((o) => o.id === value);
