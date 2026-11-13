// Dycom photography library. The originals (48 camera JPEGs from the October
// 2026 shoot, ~26 MB each) and the web renditions the site uses live in App
// Storage under dycom/photography/, served by the API server's public-objects
// route. Renditions are <id>-2000.webp and <id>-1000.webp; `photo()` builds the
// URL and `photoProps()` the responsive attributes for an <img>.
//
// Upload or refresh with: pnpm --filter @workspace/scripts run upload:dycom-photography

/** Set at build time for a standalone (handoff) build; see artifacts/dycom-concept-05/src/standalone.ts. Undefined in the review workspace and in Node scripts. */
const MEDIA_BASE = (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_DYCOM_MEDIA_BASE;

/** Where the web renditions are served from. Same-origin so every Dycom site and the Design System share one URL; a standalone build reads them from its own media folder. */
export const PHOTOGRAPHY_BASE = MEDIA_BASE ? `${MEDIA_BASE}photography/web/` : '/api/storage/public-objects/dycom/photography/web/';
export const PHOTO_WIDTHS = [1000, 2000] as const;

export type PhotoSubject = 'people' | 'hands' | 'materials' | 'networks' | 'places';

export type Photograph = { alt: string; subject: PhotoSubject };

/** Every photograph in the library, keyed by camera frame (lower-case). Alt text describes the frame; sections may override it with a more specific caption. */
export const PHOTOGRAPHY = {
  z9a_0445: { alt: 'Warehouse worker in a hard hat and high-visibility vest looking up at a yellow cable rack', subject: 'people' },
  z9a_0525: { alt: 'Green laser level lines crossing a data center floor', subject: 'networks' },
  z9a_0900: { alt: 'Cut ends of orange and yellow conduit bundled together', subject: 'materials' },
  z9a_0911: { alt: 'Technician in a hard hat and face shield inspecting an equipment cabinet', subject: 'people' },
  z9a_1541: { alt: 'Two technicians routing yellow and green cable along an indoor rack', subject: 'people' },
  z9a_1872: { alt: 'Work boot on red clay at a job site', subject: 'hands' },
  z9a_1943: { alt: 'Work boot pressing into wet red clay', subject: 'hands' },
  z9a_4064: { alt: 'Braided river and snow-capped mountains under a clouded sky', subject: 'places' },
  z9a_4987: { alt: 'Coil of black fiber cable laid in autumn brush', subject: 'materials' },
  z9a_5172: { alt: 'Lineworker in high-visibility gear steadying a pole beside a storage tank', subject: 'people' },
  z9a_5195: { alt: 'Technician pulling fiber strands across open grassland', subject: 'people' },
  z9a_8083: { alt: 'Spools of black cable stacked in a yard', subject: 'materials' },
  z9a_8689: { alt: 'Lineworker in a bucket truck among green leaves', subject: 'people' },
  z9a_8700: { alt: 'Coiled black conduit with printed markings, close up', subject: 'materials' },
  z9a_8848: { alt: 'Ends of blue conduit stacked in rings', subject: 'materials' },
  z9b_0133: { alt: 'Gloved hand guiding cable off a reel on a truck', subject: 'hands' },
  z9b_0192: { alt: 'Technician pulling black cable through woodland undergrowth', subject: 'people' },
  z9b_0355: { alt: 'Directional drill head emerging from wet soil', subject: 'materials' },
  z9b_0540: { alt: 'Two crew members seated and laughing in the back of a work van', subject: 'people' },
  z9b_1004: { alt: 'Gloved hands adjusting equipment on a yellow excavator arm', subject: 'hands' },
  z9b_1019: { alt: 'Technician in safety glasses and gloves working close to a hydraulic line', subject: 'people' },
  z9b_1028: { alt: 'Excavator bucket opening a trench while the crew works the line', subject: 'people' },
  z9b_1407: { alt: 'Lineworker’s tool belt with pliers, tape and wrenches', subject: 'hands' },
  z9b_1432: { alt: 'Climbing harness hardware on a high-visibility jacket', subject: 'hands' },
  z9b_1555: { alt: 'Lineworker climbing a pole, seen from below', subject: 'people' },
  z9b_1574: { alt: 'Lineworker in safety glasses and a hard hat looking up at the line', subject: 'people' },
  z9b_1698: { alt: 'Gloved hands feeding wire into a reel on a truck', subject: 'hands' },
  z9b_1711: { alt: 'Two crew members in hard hats talking at the truck', subject: 'people' },
  z9b_1903: { alt: 'Lineworker in a white hard hat against a weathered wooden wall', subject: 'people' },
  z9b_2139: { alt: 'Lineworker at the top of a utility pole among crossarms and wire', subject: 'people' },
  z9b_2154: { alt: 'Lineworker swinging a hammer against a pole', subject: 'people' },
  z9b_2236: { alt: 'Worn work boot on gravel beside a job site', subject: 'hands' },
  z9b_2257: { alt: 'Coiled rope on dark gravel', subject: 'materials' },
  z9b_2458: { alt: 'Gloved hands cinching a strap on a ladder', subject: 'hands' },
  z9b_2476: { alt: 'Shackle and rope in dry grass', subject: 'materials' },
  z9b_2679: { alt: 'Three crew members in hard hats and high-visibility shirts sharing a laugh', subject: 'people' },
  z9b_3619: { alt: 'Engineer reviewing a 3D network design on a monitor', subject: 'people' },
  z9b_4385: { alt: 'Blue-and-white striped conduit stacked in rows', subject: 'materials' },
  z9b_4412: { alt: 'Bundles of green, orange and grey cable', subject: 'materials' },
  z9b_5897: { alt: 'American flag flying against a clear sky', subject: 'places' },
  z9b_6386: { alt: 'Farmhouse beyond a green field in summer', subject: 'places' },
  z9b_6533: { alt: 'Sorghum heads in front of a small-town street', subject: 'places' },
  z9b_6665: { alt: 'Fiber patch cables plugged into a lit network rack', subject: 'networks' },
  z9b_6669: { alt: 'Blue indicator lights along a row of network equipment', subject: 'networks' },
  z9b_7048: { alt: 'Coiled spiral cable protection, close up', subject: 'materials' },
  z9b_7127: { alt: 'Technician working overhead in a cable tray', subject: 'people' },
  z9b_7549: { alt: 'Gloved hands splicing a bundle of copper conductors', subject: 'hands' },
  z9b_7597: { alt: 'Grey conduit runs along a building wall', subject: 'materials' },
} as const satisfies Record<string, Photograph>;

export type PhotoId = keyof typeof PHOTOGRAPHY;

export const PHOTO_IDS = Object.keys(PHOTOGRAPHY) as PhotoId[];

export const PHOTO_SUBJECTS: { id: PhotoSubject; label: string }[] = [
  { id: 'people', label: 'People at work' },
  { id: 'hands', label: 'Hands, boots and tools' },
  { id: 'materials', label: 'Cable, conduit and equipment' },
  { id: 'networks', label: 'Live networks' },
  { id: 'places', label: 'Places' },
];

/** URL of one rendition. Throws on an unknown id so a typo fails loudly in development. */
export function photo(id: PhotoId, width: (typeof PHOTO_WIDTHS)[number] = 2000): string {
  if (!(id in PHOTOGRAPHY)) throw new Error(`Unknown Dycom photograph: ${id}`);
  return `${PHOTOGRAPHY_BASE}${id}-${width}.webp`;
}

/** Full-size original (camera JPEG) for download or print use. */
export function photoOriginal(id: PhotoId): string {
  return `${PHOTOGRAPHY_BASE.replace(/web\/$/, 'originals/')}${id.toUpperCase()}.jpg`;
}

/**
 * Responsive <img> attributes: both renditions in srcSet and the library alt text
 * unless the caller passes a more specific one. `sizes` describes the slot's
 * rendered width so the browser picks the 1000px rendition where it is enough.
 */
export function photoProps(id: PhotoId, sizes: string, alt?: string) {
  return {
    src: photo(id, 2000),
    srcSet: PHOTO_WIDTHS.map((w) => `${photo(id, w)} ${w}w`).join(', '),
    sizes,
    alt: alt ?? PHOTOGRAPHY[id].alt,
  };
}
