import canvas from './data/canvas.json';
import metrics from './data/board-metrics.json';
import inventory from './data/component-inventory.json';
import sitemapData from './data/sitemap.json';

/**
 * Walkthrough data. Everything here is generated from the design canvas (design/canvas), the
 * component inventory (design/component-inventory.json) and docs/requirements.md by
 * `npm run walkthrough:build` — edit those sources, not the JSON. The one exception is T01, which
 * has no canvas board (it is built and live), so its notes are written here from the design brief.
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
  notes: [
    {
      key: 't01Job',
      kind: 'job',
      heading: 'THE JOB',
      body:
        'One continuous argument: Dycom is the people connecting America; its strength is that it is local everywhere; here is the company near you; here is how the work is done; tell us what you need.\n\n' +
        '1. State the thesis — "Scale is Local" — before anything else.\n' +
        '2. Route the four largest intents in one band: Career Seekers, Customers, Investors, Communities.\n' +
        '3. Make "local" concrete: the map, the directory and the company card are the centre of the page.\n' +
        '4. End with one next step: "What brings you here?"',
    },
    {
      key: 't01Narrative',
      kind: 'narrative',
      heading: 'NARRATIVE — HOMEPAGE',
      body:
        'Hero: silent film loop, "Scale is Local", one sentence in Dycom\'s words.\n' +
        'Pathways: four intents on Civic Blue.\n' +
        'Who we are · What we build: the people connecting America, the four lines of work, the facts band.\n' +
        'Our people at work: the brand film, played in place.\n' +
        'Our companies: the atlas, city / state / ZIP search ranked by distance, the company card led by its own logo.\n' +
        'The four strengths: Scale is Local · Built to Deliver · Where Skill Meets Scale · Shaping What\'s Next.\n' +
        'Brand statement · Expertise for the entire lifecycle (five stages, fixed height).\n' +
        'Closing: "Let\'s get to work" — four intents, one form.',
    },
    {
      key: 't01Mapping',
      kind: 'mapping',
      heading: 'SITECORE MAPPING (built in the site)',
      body:
        'Hero · Pathways · WhoWeAre · BrandFilm · CompanyDirectory (map + directory + card) · Strengths · BrandStatement · Lifecycle · ContactForm, framed by SiteHeader, SiteFooter, RolesDrawer and the ResultsBar. Each reads only its Sitecore datasource; in the component inventory the homepage composites decompose into the shared renderings.',
    },
    {
      key: 't01Open',
      kind: 'open',
      heading: 'OPEN FOR DYCOM',
      body:
        '• Brand statement copy — a sentence from Dycom\'s company description stands in.\n' +
        '• SEO fields: description, keywords and share image.\n' +
        '• Employee count wording ("20,000+" vs "20K") and the owner of all company facts.\n' +
        '• "Over 500 field offices" while the map plots 39 home offices.\n' +
        '• Lifecycle stages 4 and 5 — "Maintain & restore" beside "Maintain & respond".\n' +
        '• Which held-back chapters return with the interior pages.',
    },
  ],
};

export const templates: Template[] = [T01, ...(canvas.templates as Template[]).filter((t) => t.code !== 'T01')];
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
