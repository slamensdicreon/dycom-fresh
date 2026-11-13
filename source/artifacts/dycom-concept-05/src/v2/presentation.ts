import { INVESTORS } from './site';

/**
 * Homepage chapters held back for the leadership presentation (November
 * 2026), where the Final Design Direction is compared with Variation #2.
 *
 * The chapters stay built: the Design System still documents them and the
 * components are untouched. Remove an id from this set to show its chapter
 * on the homepage again. The four-card column takes the slot of the
 * capabilities tabs ("Plan & design / Build & connect / Maintain & protect").
 */
export const HIDDEN_CHAPTERS: ReadonlySet<string> = new Set([
  'what-we-do', // capabilities tabs
  'how-we-work', // Skilled work. Safe every day.
  'careers', // Skilled people. Work that connects America. + Find your kind of work
  'investors', // Investors band with the three boxes
  'resources', // Resource Center, four columns
  'customers', // What we build photographic band: the work opens the page beside Who we are (client pin 177; confirmed by the user 6 Nov 2026)
]);

export const showChapter = (id: string) => !HIDDEN_CHAPTERS.has(id);

/**
 * Where an in-page link to a hidden chapter goes instead. Investors has its
 * own page; customers and the What we do menu land on What we build beside
 * Who we are; the careers pathway opens the roles drawer (handled by the
 * caller when the target is `roles`).
 */
export const JUMP_FALLBACK: Record<string, string> = {
  '#what-we-do': '#what-we-build',
  '#investors': INVESTORS,
  '#careers': 'roles',
  '#how-we-work': '#lifecycle',
  '#resources': '#contact',
  '#customers': '#what-we-build',
};

/** Resolve a homepage anchor against the hidden chapters. */
export const resolveJump = (href: string) => {
  if (!href.startsWith('#')) return href;
  return showChapter(href.slice(1)) ? href : (JUMP_FALLBACK[href] ?? '#top');
};
