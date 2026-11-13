// Names and roles of the brand tokens declared on `.dycom-c5` in styles/brand.css.
// Values are not repeated here: the design system reads them from the
// stylesheet at runtime so the two can never disagree.
export type TokenGroup = 'color' | 'type' | 'rhythm' | 'motion' | 'link';

export type BrandToken = {
  /** CSS custom property, e.g. `--c5-civic`. */
  name: string;
  group: TokenGroup;
  /** Brand name or short label. */
  label: string;
  /** Where it is used. */
  role: string;
  /** Requirement or guideline reference. */
  ref?: string;
};

export const BRAND_TOKENS: BrandToken[] = [
  { name: '--c5-civic', group: 'color', label: 'Civic Blue', role: 'Primary surface and text colour: header, footer, headings, filled buttons, map markers.', ref: 'BR-C1 · §3.2' },
  { name: '--c5-civic-deep', group: 'color', label: 'Civic Blue, deep', role: 'Darker member of the Civic family for layered dark panels and the night map.', ref: 'MAP-V1' },
  { name: '--c5-civic-soft', group: 'color', label: 'Civic Blue, soft', role: 'Lighter member of the Civic family: map dots, dark-panel rules.', ref: 'MAP-V1' },
  { name: '--c5-green', group: 'color', label: 'Signal Green', role: 'The one accent: focus rings, active tab bars, hover underlines, marker pulse. Never a fill for large areas.', ref: 'BR-C1 BR-C2 D7' },
  { name: '--c5-ink', group: 'color', label: 'San Joaquin Gray', role: 'Body copy on light surfaces.', ref: '§3.2' },
  { name: '--c5-rule', group: 'color', label: 'Fargo Gray', role: 'Rules, borders, dividers, disabled states.', ref: '§3.2' },
  { name: '--c5-paper', group: 'color', label: 'Paper', role: 'Secondary light surface: alternating sections, form fields, map panel.', ref: '§3.2' },
  { name: '--c5-white', group: 'color', label: 'White', role: 'Default page surface and text on Civic.', ref: '§3.2' },
  { name: '--c5-pathways-blue', group: 'color', label: 'Spenser Blue', role: 'Reserved for Pathways program references only; never for headlines or UI.', ref: 'BR-C4' },
  { name: '--c5-font-display', group: 'type', label: 'Display face', role: 'Fjalla One for headlines, labels and section numbers. All caps for H1 and H2; never italic.', ref: 'BR-T1 BR-T2' },
  { name: '--c5-font-body', group: 'type', label: 'Body face', role: 'Geist (variable) for everything else; Medium (500) on Civic Blue.', ref: 'BR-T3 BR-T8' },
  { name: '--c5-h1', group: 'type', label: 'H1', role: 'Hero and page titles: fluid 40–68px.', ref: 'BR-T5' },
  { name: '--c5-h2', group: 'type', label: 'H2', role: 'Section titles: fluid 32–48px.', ref: 'BR-T5' },
  { name: '--c5-h3', group: 'type', label: 'H3', role: 'Card and column titles, 26px.', ref: 'BR-T5' },
  { name: '--c5-body', group: 'type', label: 'Body', role: 'Paragraph size, 17px desktop.', ref: 'BR-T4' },
  { name: '--c5-small', group: 'type', label: 'Small', role: 'Captions, eyebrows, utility text; nothing below 13px.', ref: 'BR-T4' },
  { name: '--c5-gutter', group: 'rhythm', label: 'Gutter', role: 'Horizontal page padding; fluid between phone and desktop.' },
  { name: '--c5-section', group: 'rhythm', label: 'Section', role: 'Vertical padding between homepage chapters.' },
  { name: '--c5-control-h', group: 'rhythm', label: 'Control height', role: 'Buttons, inputs and selects share one height.', ref: 'BR-B2' },
  { name: '--c5-ease', group: 'motion', label: 'Easing', role: 'Signal Green highlights and panels draw in on this curve rather than snapping.', ref: 'BR-B5 motion (user direction, Oct 22 2026)' },
  { name: '--c5-draw', group: 'motion', label: 'Draw duration', role: 'Length of a highlight draw-in (~0.4s).', ref: 'BR-B5 motion' },
  { name: '--c5-link-thickness', group: 'link', label: 'Link underline', role: 'One inline-link underline thickness everywhere.', ref: 'BR-B5' },
  { name: '--c5-link-offset', group: 'link', label: 'Link underline offset', role: 'Distance of the underline from the baseline.', ref: 'BR-B5' },
];

/** Reads the current value of a brand token from a rendered `.dycom-c5` element. */
export function readToken(scope: Element, name: string): string {
  return getComputedStyle(scope).getPropertyValue(name).trim();
}
