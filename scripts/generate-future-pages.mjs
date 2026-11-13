#!/usr/bin/env node
/**
 * Generates a route for every page of the future-state sitemap that is not built yet, so every
 * header, footer and menu link lands on a real page of the site (with the site chrome and a way on)
 * instead of a 404. Each route is an interior page with two renderings:
 *
 *   InteriorHero  — the page name as H1, the group's description, a back link to the group landing
 *   PageNotice    — "This page is currently unavailable" with links to the group landing and home
 *
 * These routes are kept out of sitemap.xml and llms.txt ("sitemap": false). In Sitecore they become
 * real page items built from the templates in reference/full-site-requirements.md §2; delete each
 * generated route here as its page is built (or remove it from SITEMAP below and re-run).
 *
 * Also writes the 404 route (content/routes/404.json, "notFound": true) served by getErrorPage.
 *
 * Usage: node scripts/generate-future-pages.mjs
 * Safe to re-run: only files carrying the "generatedBy" marker are overwritten; hand-built routes
 * (home.json, investors.json, …) are never touched, and their paths are skipped.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = join(root, 'content');
const MARKER = 'scripts/generate-future-pages.mjs';

/** Navigation groups (brief §5; source: the prototype's src/v2/site.ts). */
const GROUPS = {
  'who-we-are': {
    landing: '/who-we-are/',
    label: 'Who we are',
    description: 'Our operating companies share a commitment to people, safe work, quality and responsible business practices.',
  },
  'what-we-do': {
    landing: '/what-we-do/',
    label: 'What we do',
    description: 'Engineering and project management, wireline and wireless construction, locating, fulfillment, maintenance and restoration.',
  },
  companies: {
    landing: '/companies/',
    label: 'Our companies',
    description: 'Identifiable companies with their own names, people and websites, connected by one national group.',
  },
  careers: {
    landing: '/careers/',
    label: 'People & careers',
    description: 'Get to know the trades and the questions to ask, then search current openings.',
  },
  resources: {
    landing: '/resources/',
    label: 'Resource Center',
    description: 'Reports, safety and employee materials, purchasing terms and candidate guides, gathered in one searchable place.',
  },
  investors: {
    landing: '/investors/',
    label: 'Investors',
    description: 'Dycom Industries, Inc. (NYSE: DY). Results, filings, governance and investor resources in one place.',
  },
  utility: { landing: '/', label: 'Dycom home', description: '' },
};

/** [path, page title, group]. Every page the header, phone menu and footer link to. */
const SITEMAP = [
  ['who-we-are', 'Who we are', 'who-we-are'],
  ['who-we-are/values', 'Purpose & values', 'who-we-are'],
  ['who-we-are/operating-strengths', 'Operating strengths', 'who-we-are'],
  ['who-we-are/leadership', 'Leadership', 'who-we-are'],
  ['sustainability', 'Sustainability', 'who-we-are'],
  ['news', 'News', 'who-we-are'],
  ['how-we-work/safety', 'Headway® safety', 'who-we-are'],
  ['how-we-work/quality', 'Rightway™ quality', 'who-we-are'],
  ['how-we-work/hazard-recognition', 'Hazard recognition', 'who-we-are'],
  ['contact', 'Contact', 'who-we-are'],

  ['what-we-do', 'What we do', 'what-we-do'],
  ['what-we-do/capabilities', 'Our capabilities', 'what-we-do'],
  ['what-we-do/engineering', 'Engineering', 'what-we-do'],
  ['what-we-do/project-management', 'Project management', 'what-we-do'],
  ['what-we-do/wireline-construction', 'Wireline construction', 'what-we-do'],
  ['what-we-do/wireless-construction', 'Wireless construction', 'what-we-do'],
  ['what-we-do/fulfillment', 'Fulfillment', 'what-we-do'],
  ['what-we-do/locating', 'Utility locating', 'what-we-do'],
  ['what-we-do/maintenance-restoration', 'Maintenance & restoration', 'what-we-do'],

  ['companies', 'Our companies', 'companies'],
  ['suppliers/inventory-terms-of-purchase', 'Inventory terms of purchase', 'companies'],
  ['suppliers/fleet-terms-of-purchase', 'Fleet terms of purchase', 'companies'],

  ['careers', 'People & careers', 'careers'],
  ['careers/opportunities', 'Open roles', 'careers'],
  ['careers/trades', 'Explore the trades', 'careers'],
  ['careers/recruitment-process', 'Our recruitment process', 'careers'],
  ['careers/life', 'Life & development', 'careers'],
  ['careers/benefits', 'Benefits', 'careers'],
  ['careers/employee-handbook', 'Employee handbook', 'careers'],
  ['careers/benefit-plan-disclosures', 'Benefit plan disclosures', 'careers'],

  ['resources', 'Resource Center', 'resources'],

  ['investors/quarterly-reports', 'Quarterly reports', 'investors'],
  ['investors/annual-reports', 'Annual reports', 'investors'],
  ['investors/sec-filings', 'SEC filings', 'investors'],
  ['investors/stock-information', 'Stock information', 'investors'],
  ['investors/governance', 'Governance', 'investors'],
  ['investors/board-of-directors', 'Board of directors', 'investors'],
  ['investors/board-committees', 'Board committees', 'investors'],
  ['investors/governance-documents', 'Governance documents', 'investors'],
  ['investors/news', 'Investor news', 'investors'],
  ['investors/events-presentations', 'Events & presentations', 'investors'],
  ['investors/analyst-coverage', 'Analyst coverage', 'investors'],
  ['investors/shareholder-services', 'Shareholder services', 'investors'],
  ['investors/faqs', 'Investor FAQs', 'investors'],
  ['investors/document-request', 'Document request', 'investors'],
  ['investors/email-alerts', 'Email alerts', 'investors'],
  ['investors/contact', 'Contact Investor Relations', 'investors'],

  ['privacy-policy', 'Privacy policy', 'utility'],
  ['terms-of-use', 'Terms of use', 'utility'],
];

const link = (href, text) => ({ $link: href, text });
const OPEN_ROLES = link('#open-roles', 'Browse open roles');
const HOME = link('/', 'Dycom home');

const write = (file, data) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
};

/** A file we may overwrite: absent, or written by this script. */
const ours = (file) => !existsSync(file) || JSON.parse(readFileSync(file, 'utf8')).generatedBy === MARKER;

let written = 0;
let skipped = 0;

// Notices: one per group (landing pages link home only; careers pages lead with the roles drawer).
for (const [key, group] of Object.entries(GROUPS)) {
  const isCareers = key === 'careers';
  const notice = (primary, secondary) => ({
    generatedBy: MARKER,
    templateName: 'Page Notice',
    fields: {
      Heading: 'This page is currently unavailable',
      Text: isCareers
        ? 'We are preparing this page. You can still search open roles across our family of companies now.'
        : 'We are preparing this page. Until it is ready, you can continue from the pages below.',
      PrimaryLink: primary,
      SecondaryLink: secondary ?? { value: { href: '' } },
    },
  });
  const landingLink = link(group.landing, key === 'utility' ? 'Dycom home' : `${group.label} overview`);
  write(join(content, 'items/pages/_notices', `${key}.json`), notice(isCareers ? OPEN_ROLES : landingLink, key === 'utility' ? null : isCareers ? landingLink : HOME));
  write(join(content, 'items/pages/_notices', `${key}-landing.json`), notice(isCareers ? OPEN_ROLES : HOME, isCareers ? HOME : null));
}

for (const [path, title, groupKey] of SITEMAP) {
  const group = GROUPS[groupKey];
  const routeFile = join(content, 'routes', `${path}.json`);
  if (!ours(routeFile)) {
    skipped++;
    continue;
  }
  const isLanding = `/${path}/` === group.landing;
  const back = isLanding || groupKey === 'utility' ? HOME : link(group.landing, group.label);

  write(join(content, 'items/pages', path, 'hero.json'), {
    generatedBy: MARKER,
    templateName: 'Interior Hero',
    fields: { BackLink: back, Heading: title, Overview: group.description },
  });
  write(routeFile, {
    generatedBy: MARKER,
    name: path.split('/').pop(),
    displayName: title,
    templateName: 'Future Page',
    pageDesign: 'default',
    sitemap: false,
    fields: { Title: `${title} | Dycom` },
    placeholders: {
      'headless-main': [
        { componentName: 'InteriorHero', dataSource: `pages/${path}/hero`, params: { RenderingIdentifier: 'page' } },
        {
          componentName: 'PageNotice',
          dataSource: `pages/_notices/${groupKey}${isLanding ? '-landing' : ''}`,
          params: { RenderingIdentifier: 'notice' },
        },
      ],
    },
  });
  written++;
}

// 404 — served by getErrorPage (NAV0012: search, popular links and a job search entry; search
// arrives with site search, C06).
write(join(content, 'items/pages/404/hero.json'), {
  generatedBy: MARKER,
  templateName: 'Interior Hero',
  fields: { BackLink: HOME, Heading: 'Page not found', Overview: 'The page you were looking for has moved or no longer exists.' },
});
write(join(content, 'items/pages/404/notice.json'), {
  generatedBy: MARKER,
  templateName: 'Page Notice',
  fields: {
    Heading: 'Let’s find what you need',
    Text: 'Start again from the home page, or search open roles across our family of companies.',
    PrimaryLink: HOME,
    SecondaryLink: OPEN_ROLES,
  },
});
write(join(content, 'routes/404.json'), {
  generatedBy: MARKER,
  name: '404',
  displayName: 'Page not found',
  templateName: 'Error Page',
  pageDesign: 'default',
  notFound: true,
  sitemap: false,
  fields: { Title: 'Page not found | Dycom' },
  placeholders: {
    'headless-main': [
      { componentName: 'InteriorHero', dataSource: 'pages/404/hero', params: { RenderingIdentifier: 'page' } },
      { componentName: 'PageNotice', dataSource: 'pages/404/notice', params: { RenderingIdentifier: 'notice' } },
    ],
  },
});

console.log(`[future-pages] ${written} routes written, ${skipped} skipped (built by hand), 404 route written`);
