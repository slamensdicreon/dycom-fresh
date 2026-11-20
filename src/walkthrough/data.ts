import canvas from './data/canvas.json';
import metrics from './data/board-metrics.json';
import inventory from './data/component-inventory.json';
import sitemapData from './data/sitemap.json';
import { templateNotes } from './template-notes';

/**
 * Walkthrough data. Everything here is generated from the design canvas (design/canvas), the
 * component inventory (design/component-inventory.json) and docs/requirements.md by
 * `npm run walkthrough:build` — edit those sources, not the JSON. The one exception is T01, which
 * has no canvas board (it is built and live). Every template's notes come from template-notes.ts,
 * written for Dycom's marketing and communications leaders.
 */

export type NoteKind = 'job' | 'narrative' | 'mapping' | 'open' | 'aside';
export type Note = { key: string; kind: NoteKind | string; heading: string; body: string };
export type View = { board: string | null; live?: string; title: string; phone: boolean };
export type Template = {
  code: string;
  name: string;
  slug: string;
  headline: string;
  pagesServed: string;
  pageCount: string;
  status: string;
  notes: Note[];
  views: View[];
};
export type Component = {
  name: string;
  slug: string;
  group: string;
  refs: string;
  what: string;
  templates: string[];
  source: string;
  status: string;
};

const T01: Template = {
  code: 'T01',
  name: 'Homepage',
  slug: 't01',
  headline: 'built, approved and live',
  pagesServed: 'The front door',
  pageCount: '1',
  status: 'Built',
  views: [{ board: null, live: '/', title: 'Homepage — live on the site', phone: true }],
  notes: [],
};

/** Plain descriptions of the pages each template serves (the canvas uses working shorthand). */
const PAGES_SERVED: Record<string, string> = {
  T02: 'The Investors page, plus stock information, governance, board committees, analyst coverage, shareholder services and FAQs',
  T06: 'Our companies — the map as a full page',
  T07: 'Careers — “where do I fit?”',
  T08: 'Open roles',
  T09: 'One page for every open role',
  T11: 'Every news release and article',
  T13: 'Contact, subcontractors, talent network, investor contact',
  T16: 'Page not found, search, confirmations',
};

/** How many pages a template serves, in words: some are created automatically, one per item. */
export const pageCountLabel = (count: string) => (count === 'feed' ? 'Created automatically' : `${count} page${count === '1' ? '' : 's'}`);

/** Notes for Dycom's marketing and communications leaders replace the canvas's working notes. */
function withAudienceNotes(t: Template): Template {
  const n = templateNotes[t.code];
  if (!n) return t;
  return {
    ...t,
    pagesServed: PAGES_SERVED[t.code] ?? t.pagesServed,
    notes: [
      { key: `${t.slug}-does`, kind: 'job', heading: '', body: n.does },
      { key: `${t.slug}-story`, kind: 'narrative', heading: `Story — ${n.example}`, body: n.story },
      { key: `${t.slug}-dycom`, kind: 'open', heading: '', body: n.fromDycom.map((x) => `• ${x}`).join('\n') },
    ],
  };
}

export const templates: Template[] = [T01, ...(canvas.templates as Template[]).filter((t) => t.code !== 'T01')].map(withAudienceNotes);
export const templateByCode = (code: string) => templates.find((t) => t.code === code);

export const boardSrc = (board: string) => `/walkthrough-assets/canvas/boards/${board}.html`;
export const thumbSrc = (board: string) => `/walkthrough-assets/canvas/thumbs/${board}.jpg`;
export const boardHeight = (board: string | null, width: 1440 | 390): number | undefined =>
  board ? (metrics as unknown as Record<string, Record<string, number>>)[board]?.[String(width)] : undefined;

const slugify = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const componentGroups = inventory.groups.map((g) => ({
  name: g.name,
  components: g.components.map((c) => ({ ...c, slug: slugify(c.name), group: g.name }) as Component),
}));
export const components: Component[] = componentGroups.flatMap((g) => g.components);
export const componentBySlug = (slug: string) => components.find((c) => c.slug === slug);
export const componentsFor = (code: string) => components.filter((c) => c.templates.includes(code));
export const sharedParts = inventory.sharedParts;
export const retired = inventory.retired;
export const inventoryNotes = inventory.notes as Record<'invTitle' | 'invMerge' | 'invRules' | 'invNext', string>;

export const STATUSES = ['Built', 'Extend', 'New', 'Not designed', 'Third-party'] as const;
export const STATUS_MEANING: Record<string, string> = {
  Built: 'Exists in the site today',
  Extend: 'Grows a built rendering',
  New: 'Designed on the canvas, not built',
  'Not designed': 'Required, not yet designed',
  'Third-party': 'Placed, supplied by a vendor',
};
export const statusCounts = STATUSES.map((s) => ({ status: s, count: components.filter((c) => c.status === s).length }));

export type Row = Record<string, string>;

export type SitemapLink = { text: string; href: string; template: string | null };
export const sitemap = sitemapData as {
  groups: { label: string; intro: string; description: string; overview: SitemapLink; columns: { title: string; links: SitemapLink[] }[] }[];
  pageTemplates: Record<string, string>;
};

export const canvasVersion = canvas.canvasVersion;
