// Future-state sitemap for the new dycomind.com (client instruction, Oct 22
// 2026): every page of the current site, organized by the Concept 05
// taxonomy. Navigation and footer link to these pages, never to homepage
// anchors. Pages outside this phase are rendered unavailable by the preview.
//
// Source inventory: dycomind.com/page-sitemap.xml (Sept 2026) plus linked
// resource pages (hazard recognition, handbook). Each current page appears
// once, under the group a visitor would look for it in.
import { STANDALONE } from '../standalone';

export type SiteLinkPair = [label: string, href: string];

// A standalone (handoff) build serves the Final Design Direction at the site root.
export const V2_BASE = STANDALONE ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}v2/`;
/** The normal review preview policy explains destinations outside this phase. */
export const page = (path: string) => `${V2_BASE}${path}/`;

export type NavColumn = { title: string; links: SiteLinkPair[] };
/** `section` is the homepage chapter this group describes; on the homepage the overview link jumps there instead of leaving the page. */
export type NavGroup = { label: string; root: string; overview: string; section: string; intro: string; description: string; columns: NavColumn[] };

export const serviceLinks: SiteLinkPair[] = [
  ['Engineering', page('what-we-do/engineering')],
  ['Project management', page('what-we-do/project-management')],
  ['Wireline construction', page('what-we-do/wireline-construction')],
  ['Wireless construction', page('what-we-do/wireless-construction')],
  ['Fulfillment', page('what-we-do/fulfillment')],
  ['Utility locating', page('what-we-do/locating')],
  ['Maintenance & restoration', page('what-we-do/maintenance-restoration')],
];

export const INVESTORS = page('investors');
export const RESOURCES = page('resources');

// The Resource Center is the one group that re-lists pages filed elsewhere:
// it is the document index the corporate requirements ask for (a primary
// navigation destination with a searchable listing), so employees, suppliers
// and candidates find their documents in one place as well as under their
// own group. The homepage chapter and this menu read the same four groups.
export const resourceColumns: NavColumn[] = [
  { title: 'Corporate reports', links: [['Safety, People and Environment', page('sustainability')], ['Reports, filings and governance', page('investors/sec-filings')], ['Company purpose and values', page('who-we-are/values')]] },
  { title: 'Safety & employees', links: [['Hazard recognition', page('how-we-work/hazard-recognition')], ['Employee handbook', page('careers/employee-handbook')], ['Benefit plan disclosures', page('careers/benefit-plan-disclosures')]] },
  { title: 'Suppliers', links: [['Inventory terms of purchase', page('suppliers/inventory-terms-of-purchase')], ['Fleet terms of purchase', page('suppliers/fleet-terms-of-purchase')]] },
  { title: 'Candidates', links: [['Our recruitment process', page('careers/recruitment-process')], ['Benefits', page('careers/benefits')]] },
];

export const navGroups: NavGroup[] = [
  {
    label: 'Who we are',
    section: 'who-we-are',
    root: page('who-we-are'),
    overview: 'Who we are overview',
    intro: 'The people connecting America.',
    description: 'Our operating companies share a commitment to people, safe work, quality and responsible business practices.',
    columns: [
      { title: 'About Dycom', links: [['Purpose & values', page('who-we-are/values')], ['Leadership', page('who-we-are/leadership')], ['Sustainability', page('sustainability')], ['News', page('news')]] },
      { title: 'How we work', links: [['Headway® safety', page('how-we-work/safety')], ['Rightway™ quality', page('how-we-work/quality')], ['Hazard recognition', page('how-we-work/hazard-recognition')], ['Contact', page('contact')]] },
    ],
  },
  {
    label: 'What we do',
    section: 'what-we-do',
    root: page('what-we-do'),
    overview: 'All services',
    intro: 'Plan. Build. Maintain.',
    description: 'Engineering and project management, wireline and wireless construction, locating, fulfillment, maintenance and restoration.',
    columns: [
      { title: 'Plan & design', links: serviceLinks.slice(0, 2) },
      { title: 'Build & connect', links: serviceLinks.slice(2, 5) },
      { title: 'Maintain & protect', links: serviceLinks.slice(5) },
    ],
  },
  {
    label: 'Our companies',
    section: 'companies',
    root: page('companies'),
    overview: 'All companies',
    intro: 'Scale is local.',
    description: 'Identifiable companies with their own names, people and websites, connected by one national group.',
    columns: [
      { title: 'Find a company', links: [['Company directory', page('companies')], ['Contact a company', page('contact')]] },
      { title: 'Suppliers', links: [['Inventory terms of purchase', page('suppliers/inventory-terms-of-purchase')], ['Fleet terms of purchase', page('suppliers/fleet-terms-of-purchase')]] },
    ],
  },
  {
    label: 'People & careers',
    section: 'careers',
    root: page('careers'),
    overview: 'Careers overview',
    intro: 'Skilled work with a local employer.',
    description: 'Get to know the trades and the questions to ask, then search current openings.',
    columns: [
      { title: 'Join us', links: [['Open roles', page('careers/opportunities')], ['Explore the trades', page('careers/trades')], ['Our recruitment process', page('careers/recruitment-process')]] },
      { title: 'Life at Dycom', links: [['Life & development', page('careers/life')], ['Benefits', page('careers/benefits')]] },
      { title: 'For employees', links: [['Employee handbook', page('careers/employee-handbook')], ['Benefit plan disclosures', page('careers/benefit-plan-disclosures')]] },
    ],
  },
  {
    // Added from review feedback on V2 (Oct 27 2026): the corporate
    // requirements list the Resource Center among the primary destinations.
    label: 'Resource Center',
    section: 'resources',
    root: RESOURCES,
    overview: 'All resources',
    intro: 'The documents people rely on.',
    description: 'Reports, safety and employee materials, purchasing terms and candidate guides, gathered in one searchable place.',
    columns: resourceColumns,
  },
  {
    label: 'Investors',
    section: 'investors',
    root: INVESTORS,
    overview: 'Investors overview',
    intro: 'Local expertise. National scale.',
    description: 'Dycom Industries, Inc. (NYSE: DY). Results, filings, governance and investor resources in one place.',
    columns: [
      { title: 'Financials & filings', links: [['Quarterly reports', page('investors/quarterly-reports')], ['Annual reports', page('investors/annual-reports')], ['SEC filings', page('investors/sec-filings')], ['Stock information', page('investors/stock-information')]] },
      { title: 'Governance', links: [['Governance overview', page('investors/governance')], ['Board of directors', page('investors/board-of-directors')], ['Board committees', page('investors/board-committees')], ['Governance documents', page('investors/governance-documents')]] },
      { title: 'News & events', links: [['Investor news', page('investors/news')], ['Events & presentations', page('investors/events-presentations')], ['Analyst coverage', page('investors/analyst-coverage')]] },
      { title: 'Shareholder resources', links: [['Shareholder services', page('investors/shareholder-services')], ['Investor FAQs', page('investors/faqs')], ['Document request', page('investors/document-request')], ['Email alerts', page('investors/email-alerts')], ['Contact Investor Relations', page('investors/contact')]] },
    ],
  },
];

// Operating strengths and Our capabilities were added from Dycom's homepage
// content v0.1 (November 2026): the four-card column links to them, so they
// are sitemap pages (footer and site plan) ahead of their content.
export const footerColumns: { title: string; links: SiteLinkPair[] }[] = [
  { title: 'Who we are', links: [['About Dycom', page('who-we-are')], ['Purpose & values', page('who-we-are/values')], ['Operating strengths', page('who-we-are/operating-strengths')], ['Leadership', page('who-we-are/leadership')], ['Headway® safety', page('how-we-work/safety')], ['Rightway™ quality', page('how-we-work/quality')], ['Sustainability', page('sustainability')], ['News', page('news')], ['Contact', page('contact')]] },
  { title: 'What we do', links: [['All services', page('what-we-do')], ['Our capabilities', page('what-we-do/capabilities')], ...serviceLinks] },
  { title: 'Our companies', links: [['Company directory', page('companies')], ['Inventory terms of purchase', page('suppliers/inventory-terms-of-purchase')], ['Fleet terms of purchase', page('suppliers/fleet-terms-of-purchase')]] },
  { title: 'People & careers', links: [['Careers overview', page('careers')], ['Open roles', page('careers/opportunities')], ['Explore the trades', page('careers/trades')], ['Life & development', page('careers/life')], ['Benefits', page('careers/benefits')], ['Our recruitment process', page('careers/recruitment-process')], ['Employee handbook', page('careers/employee-handbook')], ['Benefit plan disclosures', page('careers/benefit-plan-disclosures')]] },
  { title: 'Resource Center', links: [['All resources', RESOURCES], ['Hazard recognition', page('how-we-work/hazard-recognition')], ['Employee handbook', page('careers/employee-handbook')], ['Benefit plan disclosures', page('careers/benefit-plan-disclosures')], ['Inventory terms of purchase', page('suppliers/inventory-terms-of-purchase')], ['Fleet terms of purchase', page('suppliers/fleet-terms-of-purchase')]] },
  { title: 'Investors', links: [['Investors overview', INVESTORS], ['Quarterly reports', page('investors/quarterly-reports')], ['Annual reports', page('investors/annual-reports')], ['SEC filings', page('investors/sec-filings')], ['Governance', page('investors/governance')], ['Investor news', page('investors/news')], ['Events & presentations', page('investors/events-presentations')], ['Contact Investor Relations', page('investors/contact')]] },
];

export const utilityLinks: SiteLinkPair[] = [['Privacy policy', page('privacy-policy')], ['Terms of use', page('terms-of-use')]];
