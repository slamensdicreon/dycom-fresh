/**
 * "Where we need your input" — the open decisions, information and content Dycom provides, written
 * for Dycom's marketing and communications leaders rather than as requirements. Plain language: no
 * requirement IDs or template codes. The working detail behind each item stays in
 * docs/requirements.md §4–5; keep the two in step when a decision is made.
 */

export type Choice = { question: string; today: string; shapes: string };

/** The choices only Dycom can make, highest impact first. */
export const keyChoices: Choice[] = [
  {
    question: 'Should investor news, results and events live on dycomind.com, or link out to the investor-relations site?',
    today: 'Everything stays on dycomind.com, refreshed from the latest published results and releases.',
    shapes: 'The Investors section, investor news and events, and the earnings banner after each results release.',
  },
  {
    question: 'Who owns Dycom’s headline facts, and which numbers are official?',
    today: '20,000+ employees · about 40 operating companies · all 50 states — stated once and reused everywhere.',
    shapes: 'Every page that describes Dycom’s scale, so the site never contradicts itself again.',
  },
  {
    question: 'How should Building Systems be presented alongside Communications?',
    today: 'Not yet shown, until the way Dycom describes the two segments is settled.',
    shapes: 'What we do, the services section, and how Dycom explains its two businesses.',
  },
  {
    question: 'How much should visitors be able to do on the company map?',
    today: 'A national map with a searchable directory that ranks the nearest companies; four richer versions are ready to review.',
    shapes: 'Our companies, and how candidates and customers find the company near them.',
  },
  {
    question: 'Which careers pages need to be ready at launch?',
    today: 'All of them: Why Dycom, Veterans, Students & early careers and the talent network.',
    shapes: 'The order the careers pages are built and the content needed first.',
  },
];

/** Smaller choices with a working answer already in place. */
export const smallerChoices: Choice[] = [
  {
    question: 'Should each service lead straight to the operating companies that do that work?',
    today: 'Services point to the company map.',
    shapes: 'Every service page, and filtering the directory by service.',
  },
  {
    question: 'Should the two business segments have their own page, or live within Who we are?',
    today: 'Their own page.',
    shapes: 'The Who we are section.',
  },
  {
    question: 'Should each trade link to a short explainer of what the work involves?',
    today: 'Trades are listed, not yet linked.',
    shapes: 'Explore the trades, and the topics in the Resource Center.',
  },
  {
    question: 'Is “Resource Center” the right name for the documents hub?',
    today: 'Resource Center.',
    shapes: 'The menu, the homepage and the Investors page.',
  },
  {
    question: 'Should “Networks in everyday life” come back as its own story?',
    today: 'Not included.',
    shapes: 'A possible page in Who we are.',
  },
];

export type Need = { title: string; why: string };

/** Information only Dycom holds. */
export const informationNeeded: Need[] = [
  {
    title: 'What each operating company does, and where',
    why: 'Services, industries, states served, logo, website and careers links for every company — so visitors can find the right company by service and place.',
  },
  {
    title: 'Field office locations',
    why: 'The map shows 39 home offices today; Dycom describes more than 500 field offices. Addresses let the map match the story.',
  },
  {
    title: 'Fuller job details from recruiting',
    why: 'Pay, schedule, posted date and experience, so candidates can compare roles with confidence and apply from a phone.',
  },
  {
    title: 'What the investor-relations provider can supply',
    why: 'News, events, filings, documents and alerts — and whether they can appear on dycomind.com.',
  },
  {
    title: 'Who answers each kind of inquiry',
    why: 'The right person for customers, careers, suppliers, communities and investors — by company and state where it matters.',
  },
  {
    title: 'How success will be measured',
    why: 'The goals and reports marketing wants from the new site, so tracking is in place from launch.',
  },
];

/** Content: who writes it. */
export const contentFromDycom: string[] = [
  'Why Dycom and Veterans stories',
  'Students & early careers',
  'Operating strengths and Our capabilities',
  'The business segments story',
  'Employee testimonials, written and on video',
  'Company history milestones',
  'Community stories from the operating companies',
  'A new introduction for the Investors page',
  'Social channels to feature',
  'Building Systems pages, once the segments are settled',
];

export const contentDraftedForApproval: string[] = [
  'Final homepage wording',
  '“Connection with Intention”, written once for every page that uses it',
  'Explore the trades: one explainer per trade',
  'How the Resource Center groups its documents',
  'Recruitment-fraud guidance for candidates',
  'Subcontractor and talent-network forms (Dycom names who receives them)',
  'Search, error and thank-you messages',
  'Service icons',
];

/** Still open from the Investors page review. */
export const investorsReview: Choice[] = [
  {
    question: 'A new introduction for the Investors page',
    today: 'The current company description stays until the new wording arrives.',
    shapes: 'The first thing investors read.',
  },
  {
    question: 'A fuller results “snapshot”, including the share price',
    today: 'Three headline figures from the latest results release.',
    shapes: 'Depends on the investor-content choice above.',
  },
  {
    question: 'Investor resources on every investor page',
    today: 'Agreed — on the Investors page now, and on each investor page as it is built.',
    shapes: 'How investors move between pages.',
  },
];
