// Frame sizing shared by the stages (parent) and the framed examples (child).
// Kept free of component imports so the shell can read it without pulling in
// the examples themselves.
import type { ExampleId } from '../router';

/** The viewport widths a stage can show an example at: the site's desktop, tablet and phone cases. */
export const PRESETS = [
  { id: 'desktop', label: 'Desktop', width: 1440 },
  { id: 'tablet', label: 'Tablet', width: 1024 },
  { id: 'phone', label: 'Phone', width: 390 },
] as const;
export type PresetId = (typeof PRESETS)[number]['id'];
export const isPresetId = (value: string | null | undefined): value is PresetId => PRESETS.some((p) => p.id === value);

export type FrameHeights = Record<PresetId, number>;

const SCENE: FrameHeights = { desktop: 720, tablet: 720, phone: 760 };

/**
 * Examples that size themselves from the viewport (sticky maps, WebGL scenes,
 * sheets that fill the screen) get a fixed frame height and scroll inside it;
 * every other example reports its own height to the stage.
 */
export const FIXED_HEIGHTS: Partial<Record<ExampleId, FrameHeights>> = {
  header: { desktop: 600, tablet: 600, phone: 760 }, // the mega panel overlays the page; the phone sheet fills the viewport
  'brand-film': { desktop: 720, tablet: 576, phone: 293 }, // the band caps its height from the viewport (16:9 up to 720px; 4:3 on phones), which a self-sizing frame cannot report
  'exploration-street-map': SCENE,
  'exploration-relief-model': SCENE,
};

/** Messages between a stage and its frame (same origin only). */
export const FRAME_HEIGHT_MESSAGE = 'dycom-ds:height';
export const FRAME_MOTION_MESSAGE = 'dycom-ds:motion';
