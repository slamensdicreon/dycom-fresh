// Templates › Site plan: every page of the future site, the templates that
// cover them, and where their content comes from — written for Dycom. The
// full requirements with their citations live in docs/dycom-handoff/; this
// page is the client-facing summary of that document.
import { ArrowRight } from 'lucide-react';
import { V2_BASE } from '../../v2/site';
import { head } from './components';
import { PageLink, Prose, Section } from '../shell';

type Disposition = 'Built' | 'Migrate as is' | 'Restructure' | 'From a system' | 'New';

/** The built pages live on the Final Design Direction site. */
const SITE = V2_BASE;

type TemplateDef = { code: string; name: string; status: 'built' | 'planned'; stack: string; pages: string; slug?: string; href?: string };

const TEMPLATES: TemplateDef[] = [
  { code: 'T01', name: 'Homepage', status: 'built', stack: 'Hero · Pathways · Who we are + What we build · Brand video · Our companies · What we do · Four-card column · Brand statement · Who we build for · Lifecycle · How we work · People & careers · Investors · Resource Center · Closing · Footer', pages: 'Homepage', href: SITE },
  { code: 'T02', name: 'Investors overview', status: 'built', stack: 'Photographic hero with listing block · in-page index · numbered sections · results band · document list · report cards with cover slots · timeline · news · resource columns · closing band', pages: 'Investors overview', slug: 'templates/investors/' },
  { code: 'T03', name: 'Section landing', status: 'planned', stack: 'Interior hero · group intro · child-page tiles · shared promotional block · counters · featured items · call to action', pages: 'Who we are, What we do, Our companies, People & careers' },
  { code: 'T04', name: 'Corporate topic', status: 'planned', stack: 'Interior hero · optional in-page index · numbered sections with accordion, icon list, media block, quotes, gallery, video, timeline, documents and a placed form as needed', pages: '19 pages: values, operating strengths, capabilities, business segments, sustainability, safety, quality, trades, why Dycom, students & early careers, veterans, recruitment process, life, benefits and more' },
  { code: 'T05', name: 'Service detail', status: 'planned', stack: 'Interior hero · introduction · capabilities · media · operating companies providing this service · contact · related careers', pages: 'The seven services (and Building Systems when confirmed)' },
  { code: 'T06', name: 'Company directory', status: 'planned', stack: 'Interior hero · filters and place search · map · directory grid · company card · list view when the map cannot load', pages: 'Our companies' },
  { code: 'T07', name: 'Company profile', status: 'planned', stack: 'Profile header · description · services · locations · open roles at this company · companies at the same location · contact', pages: 'One per operating company (39 today)' },
  { code: 'T08', name: 'Careers landing', status: 'planned', stack: 'Interior hero with job search · where do I fit · Life at Dycom videos · benefits · why Dycom · talent network · recruitment-fraud notice', pages: 'People & careers overview' },
  { code: 'T09', name: 'Job search', status: 'planned', stack: 'Search by role and place · filters · result cards · sort · pagination · no-result recovery', pages: 'Open roles' },
  { code: 'T10', name: 'Job detail', status: 'planned', stack: 'Title · operating company · standard facts · description · apply · fraud guidance · similar roles · expired-job state', pages: 'One per open role' },
  { code: 'T11', name: 'Resource listing', status: 'planned', stack: 'Interior hero · search · filters · result cards · pagination (timeline variant for events)', pages: 'Resource Center, News, Investor news, Events & presentations' },
  { code: 'T12', name: 'Article & news detail', status: 'planned', stack: 'Interior hero with date and optional author · article body · documents · related content', pages: 'News releases, investor news, articles' },
  { code: 'T13', name: 'Document library', status: 'planned', stack: 'Interior hero · filters · document list with type, size and date', pages: 'Hazard recognition, employee handbook, benefit plan disclosures, quarterly reports, annual reports, SEC filings, governance documents' },
  { code: 'T14', name: 'Investor content', status: 'planned', stack: 'Interior hero · in-page index · sections · data table · accordion · documents · contact Investor Relations', pages: 'Stock information, governance, board committees, analyst coverage, shareholder services, FAQs' },
  { code: 'T15', name: 'Contact & forms', status: 'planned', stack: 'Interior hero · form with inquiry-type selector · placement variants · inline validation · success', pages: 'Contact, subcontractor request, talent network, document request, email alerts, contact Investor Relations' },
  { code: 'T16', name: 'Legal & long-form', status: 'planned', stack: 'Interior hero with last-updated date · index of clauses · long text', pages: 'Privacy policy, terms of use, inventory and fleet terms of purchase' },
  { code: 'T17', name: 'People grid', status: 'planned', stack: 'Interior hero · optional group tabs · people cards with a bio dialog', pages: 'Leadership, board of directors' },
  { code: 'T18', name: 'System page', status: 'planned', stack: 'Message · site search · popular links · job search entry · related content', pages: 'Page not found, search results, confirmations' },
];

type PageRow = [label: string, path: string, template: string, disposition: Disposition];

const GROUPS: { title: string; rows: PageRow[] }[] = [
  { title: 'Home', rows: [['Homepage', '/', 'T01', 'Built']] },
  {
    title: 'Who we are',
    rows: [
      ['Who we are overview', 'who-we-are/', 'T03', 'Restructure'],
      ['Purpose & values', 'who-we-are/values/', 'T04', 'Restructure'],
      ['Operating strengths', 'who-we-are/operating-strengths/', 'T04', 'New'],
      ['Leadership', 'who-we-are/leadership/', 'T17', 'Restructure'],
      ['Business segments', 'who-we-are/business-segments/', 'T04', 'New'],
      ['Sustainability', 'sustainability/', 'T04', 'Restructure'],
      ['News', 'news/', 'T11', 'From a system'],
      ['News release', 'news/…', 'T12', 'From a system'],
      ['Headway® safety', 'how-we-work/safety/', 'T04', 'Restructure'],
      ['RIGHTWAY™ quality', 'how-we-work/quality/', 'T04', 'Restructure'],
      ['Hazard recognition', 'how-we-work/hazard-recognition/', 'T13', 'Migrate as is'],
      ['Contact', 'contact/', 'T15', 'Restructure'],
    ],
  },
  {
    title: 'What we do',
    rows: [
      ['All services', 'what-we-do/', 'T03', 'Restructure'],
      ['Our capabilities', 'what-we-do/capabilities/', 'T04', 'New'],
      ['Engineering', 'what-we-do/engineering/', 'T05', 'Restructure'],
      ['Project management', 'what-we-do/project-management/', 'T05', 'Restructure'],
      ['Wireline construction', 'what-we-do/wireline-construction/', 'T05', 'Restructure'],
      ['Wireless construction', 'what-we-do/wireless-construction/', 'T05', 'Restructure'],
      ['Fulfillment', 'what-we-do/fulfillment/', 'T05', 'Restructure'],
      ['Utility locating', 'what-we-do/locating/', 'T05', 'Restructure'],
      ['Maintenance & restoration', 'what-we-do/maintenance-restoration/', 'T05', 'Restructure'],
    ],
  },
  {
    title: 'Our companies',
    rows: [
      ['Company directory', 'companies/', 'T06', 'Restructure'],
      ['Company profile (one per company)', 'companies/…', 'T07', 'New'],
      ['Inventory terms of purchase', 'suppliers/inventory-terms-of-purchase/', 'T16', 'Migrate as is'],
      ['Fleet terms of purchase', 'suppliers/fleet-terms-of-purchase/', 'T16', 'Migrate as is'],
      ['Subcontractor request', 'suppliers/subcontractor-request/', 'T15', 'New'],
    ],
  },
  {
    title: 'People & careers',
    rows: [
      ['Careers overview', 'careers/', 'T08', 'Restructure'],
      ['Open roles', 'careers/opportunities/', 'T09', 'From a system'],
      ['Job detail (one per role)', 'careers/opportunities/…', 'T10', 'From a system'],
      ['Explore the trades', 'careers/trades/', 'T04', 'New'],
      ['Why Dycom', 'careers/why-dycom/', 'T04', 'New'],
      ['Students & early careers', 'careers/students-early-careers/', 'T04', 'Restructure'],
      ['Veterans', 'careers/veterans/', 'T04', 'New'],
      ['Our recruitment process', 'careers/recruitment-process/', 'T04', 'Restructure'],
      ['Life & development', 'careers/life/', 'T04', 'Restructure'],
      ['Benefits', 'careers/benefits/', 'T04', 'Restructure'],
      ['Talent network', 'careers/talent-network/', 'T15', 'New'],
      ['Employee handbook', 'careers/employee-handbook/', 'T13', 'Migrate as is'],
      ['Benefit plan disclosures', 'careers/benefit-plan-disclosures/', 'T13', 'Migrate as is'],
    ],
  },
  {
    title: 'Resource Center',
    // One searchable index of the documents filed under the other groups; the documents themselves keep their own pages.
    rows: [['Resource Center', 'resources/', 'T11', 'New']],
  },
  {
    title: 'Investors',
    rows: [
      ['Investors overview', 'investors/', 'T02', 'Built'],
      ['Quarterly reports', 'investors/quarterly-reports/', 'T13', 'From a system'],
      ['Annual reports', 'investors/annual-reports/', 'T13', 'From a system'],
      ['SEC filings', 'investors/sec-filings/', 'T13', 'From a system'],
      ['Stock information', 'investors/stock-information/', 'T14', 'From a system'],
      ['Governance overview', 'investors/governance/', 'T14', 'Restructure'],
      ['Board of directors', 'investors/board-of-directors/', 'T17', 'Restructure'],
      ['Board committees', 'investors/board-committees/', 'T14', 'Restructure'],
      ['Governance documents', 'investors/governance-documents/', 'T13', 'Migrate as is'],
      ['Investor news', 'investors/news/', 'T11', 'From a system'],
      ['Investor news item', 'investors/news/…', 'T12', 'From a system'],
      ['Events & presentations', 'investors/events-presentations/', 'T11', 'From a system'],
      ['Analyst coverage', 'investors/analyst-coverage/', 'T14', 'Restructure'],
      ['Shareholder services', 'investors/shareholder-services/', 'T14', 'Restructure'],
      ['Investor FAQs', 'investors/faqs/', 'T14', 'Restructure'],
      ['Document request', 'investors/document-request/', 'T15', 'From a system'],
      ['Email alerts', 'investors/email-alerts/', 'T15', 'From a system'],
      ['Contact Investor Relations', 'investors/contact/', 'T15', 'Restructure'],
    ],
  },
  {
    title: 'Utility and system pages',
    rows: [
      ['Privacy policy', 'privacy-policy/', 'T16', 'Migrate as is'],
      ['Terms of use', 'terms-of-use/', 'T16', 'Migrate as is'],
      ['Page not found', '404', 'T18', 'New'],
      ['Search results', 'search/', 'T18', 'New'],
      ['Contact — thank you', 'contact/thank-you/', 'T18', 'New'],
      ['Email alerts — thank you', 'investors/email-alerts/thank-you/', 'T18', 'Restructure'],
      ['Preferences updated', 'investors/preferences-updated/', 'T18', 'Restructure'],
    ],
  },
];

const PAGE_COUNT = GROUPS.reduce((n, g) => n + g.rows.length, 0);
const countOf = (d: Disposition) => GROUPS.reduce((n, g) => n + g.rows.filter((r) => r[3] === d).length, 0);
const BUILT_TEMPLATES = TEMPLATES.filter((t) => t.status === 'built').length;

const pageHref = (path: string) => (path === '/' ? SITE : `${SITE}${path}`);

export function SitePlanPage() {
  return (
    <>
      {head('templates/site-plan/')}
      <Section id="summary" title="The whole site at a glance">
        <Prose>
          <p>The homepage and the Investors overview are built. This page lists everything else the new site needs: every page type, the template that covers it, and where its content comes from. Templates and pages that are not yet built are listed as planned; the two that exist are linked.</p>
        </Prose>
        <div className="dycom-ds__pillars">
          <div><strong>{PAGE_COUNT} page types</strong><p>Each counted once. Two of them generate many addresses: a profile for every operating company and a page for every open role.</p></div>
          <div><strong>{TEMPLATES.length} templates</strong><p>{BUILT_TEMPLATES} built, {TEMPLATES.length - BUILT_TEMPLATES} planned. Every interior page follows the frame the Investors overview sets.</p></div>
          <div><strong>Content</strong><p>{countOf('Migrate as is')} pages move as they are · {countOf('Restructure')} are rebuilt into templates · {countOf('From a system')} come from a feed or system · {countOf('New')} are new.</p></div>
          <div><strong>Still open</strong><p>How the company map behaves, the Building Systems service lines, the single source of company facts, and whether investor content is rendered here or linked.</p></div>
        </div>
      </Section>

      <Section id="templates" title="Templates">
        <Prose>
          <p>A template is a page frame with a fixed order of sections; pages switch optional sections on or off. The interior frame — site header, hero with an all-caps title, in-page index, numbered sections, closing band and footer — is shown on the <PageLink slug="templates/investors/">Interior page (Investors)</PageLink>.</p>
        </Prose>
        <table className="dycom-ds__tokens dycom-ds__plan">
          <thead><tr><th scope="col">Template</th><th scope="col">Sections</th><th scope="col">Pages</th><th scope="col">Status</th></tr></thead>
          <tbody>
            {TEMPLATES.map((t) => (
              <tr key={t.code}>
                <td data-label="Template"><code>{t.code}</code><br /><strong>{t.name}</strong></td>
                <td data-label="Sections">{t.stack}</td>
                <td data-label="Pages">{t.pages}</td>
                <td data-label="Status">{t.status !== 'built' ? 'Planned' : t.slug ? <PageLink slug={t.slug}>Built</PageLink> : <a className="dycom-c5__text-link" href={t.href}>Built<ArrowRight size={17} aria-hidden="true" /></a>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section id="pages" title="Pages">
        <Prose>
          <p>Every page of the site, in the order of the navigation. <strong>Migrate as is</strong> keeps today's content unchanged; <strong>Restructure</strong> rebuilds it into the new template with shared sources for repeated blocks and company facts; <strong>From a system</strong> means the content is read from a feed rather than written; <strong>New</strong> has no equivalent today.</p>
        </Prose>
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h3 style={{ marginTop: 32 }}>{group.title}</h3>
            <table className="dycom-ds__tokens dycom-ds__plan">
              <thead><tr><th scope="col">Page</th><th scope="col">Address</th><th scope="col">Template</th><th scope="col">Content</th></tr></thead>
              <tbody>
                {group.rows.map(([label, path, template, disposition]) => (
                  <tr key={path + label}>
                    <td data-label="Page">{disposition === 'Built' ? <a className="dycom-c5__text-link" href={pageHref(path)}>{label}</a> : label}</td>
                    <td data-label="Address"><code>{path}</code></td>
                    <td data-label="Template">{template}</td>
                    <td data-label="Content">{disposition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </Section>
    </>
  );
}
