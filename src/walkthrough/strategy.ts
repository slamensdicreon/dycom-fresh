/**
 * Purpose and experience for the walkthrough: what the site is for, who it serves and the
 * experience rules every page keeps. Timeline, company history and brand guidelines are left out
 * on purpose — the steering committee knows them. Sources: the Final Design Direction brief
 * (handoff/brief/, November 6, 2026) §2 and §6, Dycom's Digital Experience Strategy as summarised
 * there, and docs/requirements.md. Keep wording faithful to those documents.
 */

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
