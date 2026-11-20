/**
 * Strategy and narrative for the walkthrough. Sources: the Final Design Direction brief
 * (handoff/brief/, November 6, 2026) §1–§3 and §5–§6, Dycom's Digital Experience Strategy as
 * summarised there, and docs/requirements.md. Keep wording faithful to those documents.
 */

export const platform = {
  ambition:
    'Dycom is replatforming dycomind.com onto SitecoreAI as a shared digital experience platform — design system, content model, component library, integration layer, analytics and multi-brand governance — that its operating-company sites will later inherit.',
  milestones: [
    { date: 'February 1, 2027', label: 'Corporate launch', note: 'dycomind.com on SitecoreAI' },
    { date: 'May 30, 2027', label: 'First operating-company launches', note: 'Inheriting the same platform' },
  ],
};

export const company = [
  { figure: '1969', label: 'Incorporated' },
  { figure: 'NYSE: DY', label: 'One public company' },
  { figure: '~40', label: 'Operating companies' },
  { figure: '20,000+', label: 'Employees' },
  { figure: '50', label: 'States' },
];

export const tension = {
  statement:
    'Dycom is one public company with one investor story, but candidates are hired by — and customers contract with — dozens of local operating companies with their own names, logos and territories.',
  resolution:
    'The site has to make national scale a source of trust while keeping the local company visible and credited. The phrase Dycom itself chose for this, and the homepage headline, is “Scale is Local.”',
};

export const businessNeeds = [
  'Fill hundreds of open, mostly field and skilled-trade roles faster',
  'Present one brand-consistent front door through to the application hand-off',
  'Connect operating-company identity and footprint to job search',
  'Establish a platform foundation the remaining operating companies can inherit',
  'Let marketing publish and govern without IT',
  'Communicate the growth story',
  'Retire the legacy WordPress estate',
];

export const experienceGoals = [
  'Find where I fit',
  'Search like a job seeker',
  'Decide with confidence',
  'Apply from a phone',
  'Never hit a dead end',
  'Trust at a glance',
  'Consistent everywhere',
];

export const intents = [
  { name: 'Career Seekers', line: 'Explore career opportunities across our family of companies' },
  { name: 'Customers', line: 'Learn more about our solutions and services' },
  { name: 'Investors', line: 'Find the latest news, reports and events' },
  { name: 'Communities', line: 'See how we’re supporting locally and nationally' },
];

export const audiences = [
  'Entry-level field candidates',
  'Skilled-trade candidates',
  'Engineering and design candidates',
  'Project and operations professionals',
  'Corporate professionals',
  'Students and early-career candidates',
  'Veterans',
  'Current employees',
  'Customers and prospects',
  'Investors and analysts',
  'Suppliers and subcontractors',
  'Community members',
  'Content authors',
];

export const learned = [
  {
    source: 'Website Content Audit',
    finding: 'The same corporate block repeated on most pages; company facts that conflict page to page (20,000 vs 21,000 employees; “approximately 40” vs “41” companies); operating companies disconnected from careers.',
    response: 'Every current page placed once in the future-state sitemap; facts stated once from one source; the company card carries the careers action.',
  },
  {
    source: 'Corporate Website requirements',
    finding: 'A primary-navigation Resource Center, company facts from one managed source, shared blocks authored once, a company map with ZIP / city search and a list fallback.',
    response: 'Resource Center became the sixth navigation group; the map searches by place and ranks by distance; the directory stands in for the map on phones.',
  },
  {
    source: 'SuccessFactors feed assessment',
    finding: 'Which job facts the feed provides as structured fields today and which are buried in free text.',
    response: 'Job filters are limited to facts the feed can supply: work, location, trade, company.',
  },
  {
    source: 'Brand Guidelines, film and photography',
    finding: 'Colour, type, the signal mark and real Dycom crews, places and materials.',
    response: 'The whole visual system — and nothing on the site is stock.',
  },
];

export const lessons = [
  { title: 'Dycom’s facts need an owner', body: 'The audit, the site, the content template and the investor materials disagree on employee and company counts. One managed source; nothing hard-coded.' },
  { title: 'The operating companies are the product', body: 'Everything a visitor wants — a job, a crew, a contact — is delivered by an operating company. The map, directory and company card sit at the centre.' },
  { title: 'Only outward-facing copy on the page', body: 'No “sample”, “prototype” or requirement language anywhere a visitor can see it. Provenance lives in documents like this one.' },
];

export const palette = [
  { name: 'Civic Blue', hex: '#041054', role: 'Leads every page' },
  { name: 'Signal Green', hex: '#00B609', role: 'The single accent — never a fill' },
  { name: 'San Joaquin Gray', hex: '#354846', role: 'Body text' },
  { name: 'Fargo Gray', hex: '#C1C6C8', role: 'Rules and borders' },
  { name: 'Paper', hex: '#F4F5F7', role: 'Quiet backgrounds' },
];

export const brandRules = [
  { title: 'Square by rule', body: 'No circles, pills or rounded corners anywhere. The signal mark is the only curve, and it is never an arrow.' },
  { title: 'Two typefaces', body: 'Fjalla One for H1 and H2, in capitals. Geist for everything else. No italics, nothing below 13px.' },
  { title: 'Arrows mean something', body: '→ for pages on the site and jumps within a page. ↗ only when leaving the site, for an operating company’s own website.' },
  { title: 'Green is an accent', body: 'Highlight words, focus rings, active bars, the map pulse — under 10% of any screen.' },
  { title: 'Real photography only', body: 'Dycom’s own crews, places and materials; the hero film is silent.' },
  { title: 'Motion is optional', body: 'Highlights draw in over 0.4s; reduced-motion settings and the footer Motion control remove all of it.' },
];

export const productRules = [
  'No outward links except operating-company websites and careers pages',
  'Navigation is the future-state sitemap — every page placed once',
  'Every careers action opens the open-roles drawer',
  'Company facts and shared blocks come from one managed source each',
  'Tab and process panels never change height',
  'No map below 768px — the directory carries the chapter on phones',
  '44×44 touch targets, a visible green focus ring, full keyboard operation',
  'No internal commentary in visitor copy',
];

export const interiorFrame = [
  { name: 'Site header', note: 'Six groups, the language switch, Find a job' },
  { name: 'Interior hero', note: 'Breadcrumb, H1, a one-sentence answer, an optional listing block' },
  { name: 'In-page index', note: 'Optional jumps to the page’s sections' },
  { name: 'Sections', note: 'The template’s own blocks, in its narrative order' },
  { name: 'Closing band', note: 'One next step, never two' },
  { name: 'Footer', note: 'Six columns, legal links, the Motion control' },
];

export const templateQuestions = [
  'Who arrives here, and from where',
  'The one job the page must do',
  'The story, beat by beat, in Dycom’s words',
  'Which blocks are required, which optional',
  'Where each block’s content comes from',
  'What Dycom still has to supply',
];
