// Investors overview content for Concept 05 (docs/dycom-concept-05-requirements.md §6).
// Figures, titles and dates come from the evidence register in
// docs/dycom-investor-sources.md (official IR hub as rechecked October 19, 2026).
// Static snapshot, not a live feed: no quotes, prices or market data.
//
// No outward links (client instruction, Oct 22 2026): every destination is a
// page of the future-state sitemap (src/lib/site.ts). The official PDFs and
// webcasts sit behind those pages, so cards name the material but link inward.
import { navGroups, page } from './site';

export const investorPages = {
  quarterly: page('investors/quarterly-reports'),
  annual: page('investors/annual-reports'),
  filings: page('investors/sec-filings'),
  stock: page('investors/stock-information'),
  events: page('investors/events-presentations'),
  news: page('investors/news'),
  governance: page('investors/governance'),
  contact: page('investors/contact-ir'),
  alerts: page('investors/email-alerts'),
  faqs: page('investors/faqs'),
};

export const company = {
  name: 'Dycom Industries, Inc.',
  listing: 'NYSE: DY',
  overview: 'Dycom Industries, Inc. (NYSE: DY) is a leading provider of specialty contracting services throughout the United States. We supply the nation’s leading telecom service providers with the single most critical resource they need: skilled people.',
  scale: 'Serving the nation from hundreds of field offices with a workforce of more than 20,000 people, we remain unparalleled in scope and scale.',
};

export const quarter = {
  short: 'Q2 2027',
  title: 'Fiscal 2027 second quarter results',
  periodEnded: 'August 1, 2026',
  published: 'August 26, 2026',
  callTime: '9:00 AM EDT',
  note: 'Fiscal 2027 second quarter, ended August 1, 2026. Published August 26, 2026. GAAP figures from the results release.',
  metrics: [
    { id: 'revenue', label: 'Contract revenues', value: '$2.006', unit: 'billion' },
    { id: 'net-income', label: 'Net income', value: '$115.6', unit: 'million' },
    { id: 'eps', label: 'Diluted earnings per share', value: '$3.81', unit: 'GAAP' },
  ],
  // Results package, as published; each opens the Quarterly reports page.
  documents: [
    { id: 'release', title: 'Q2 2027 Results Release', kind: 'Press release' },
    { id: 'presentation', title: 'Q2 2027 Presentation Materials', kind: 'Slides' },
    { id: 'outlook', title: 'Q2 2027 Outlook Expectations Summary', kind: 'Summary · as of August 26, 2026' },
    { id: 'transcript', title: 'Q2 2027 Transcript', kind: 'Call transcript' },
  ],
};

export type Report = { id: string; title: string; label: string; detail: string; href: string };

export const featuredReports: Report[] = [
  { id: 'investor-presentation', title: 'Q2 2027 Investor Presentation', label: 'Presented September 2, 2026', detail: 'Strategy, markets and the quarter in one deck.', href: investorPages.events },
  { id: 'annual-report', title: '2026 Annual Report', label: 'Reporting year 2026', detail: 'Letter to shareholders, financial statements and Form 10-K.', href: investorPages.annual },
  { id: 'proxy-statement', title: '2026 Proxy Statement', label: 'Annual meeting May 28, 2026', detail: 'Board nominees, governance and executive compensation.', href: investorPages.filings },
];

export type EventItem = { id: string; date: string; iso: string; time?: string; title: string; webcast?: boolean };

export const events: EventItem[] = [
  { id: 'da-davidson', date: 'September 24, 2026', iso: '2026-09-24', time: '9:00 AM EDT', title: 'D.A. Davidson 25th Annual Diversified Industrials & Services Conference', webcast: true },
  { id: 'q2-presentation', date: 'September 2, 2026', iso: '2026-09-02', title: 'Dycom Q2 2027 Investor Presentation' },
  { id: 'q2-results', date: 'August 26, 2026', iso: '2026-08-26', time: '9:00 AM EDT', title: 'Dycom Q2 2027 Results', webcast: true },
  { id: 'q1-presentation', date: 'June 2, 2026', iso: '2026-06-02', title: 'Dycom Q1 2027 Investor Presentation' },
];

export type NewsItem = { id: string; date: string; iso: string; title: string };

export const news: NewsItem[] = [
  { id: 'conference-participation', date: 'September 10, 2026', iso: '2026-09-10', title: 'Dycom Industries, Inc. to Participate in Upcoming Institutional Investor Conference' },
  { id: 'repurchase', date: 'August 26, 2026', iso: '2026-08-26', title: 'Dycom Announces Authorization of a New $150 Million Stock Repurchase Program' },
  { id: 'q2-results', date: 'August 26, 2026', iso: '2026-08-26', title: 'Dycom Industries, Inc. Reports Record Fiscal 2027 Second Quarter Results' },
  { id: 'q2-call', date: 'August 14, 2026', iso: '2026-08-14', title: 'Dycom Industries, Inc. to Host Fiscal 2027 Second Quarter Results Call on August 26, 2026' },
];

/** The Investors group of the sitemap, so the overview reaches every investor page once. */
export const investorGroup = navGroups.find((g) => g.label === 'Investors')!;
