// Homepage copy and link inventory for Concept 05. Every section traces to
// docs/dycom-concept-05-requirements.md; keep copy edits there in sync.
import type { Trade } from './jobs';
import type { PhotoId } from './photos';
import { INVESTORS, RESOURCES, page, resourceColumns, type SiteLinkPair } from './site';

export type LinkPair = SiteLinkPair;
// Site pages live in src/lib/site.ts (future-state sitemap); nothing links
// out to the current dycomind.com (client instruction, Oct 22 2026).
export { INVESTORS, page };

export { asset } from './assets';


// Audience pathways in the order and wording of Dycom's homepage content
// (version 0.1, November 2026).
export const pathways: [label: string, detail: string, href: string][] = [
  ['Career Seekers', 'Explore career opportunities across our family of companies.', '#careers'],
  ['Customers', 'Learn more about our solutions and services', '#what-we-do'],
  ['Investors', 'Find the latest news, reports and events', '#investors'],
  ['Communities', 'See how we’re supporting locally and nationally.', '#contact'],
];

export const values = ['People', 'Safety', 'Integrity', 'Innovation', 'Customer Focus', 'Sustainability'];

// WHO-F2 (#101): company-wide facts; labels and the 50-states tile follow Dycom's
// homepage content v0.1 (see docs/dycom-source-research.md)
export const facts: [string, string][] = [
  ['50 states', 'National coverage'],
  ['20,000+', 'Skilled employees'],
  ['~40', 'Operating companies'],
  ['NYSE: DY', 'New York Stock Exchange'],
];

export const services: { id: string; number: string; label: string; title: string; copy: string; tags: string[]; image: PhotoId; alt: string; related: LinkPair[] }[] = [
  { id: 'plan', number: '01', label: 'Plan & design', title: 'Start with the place.', copy: 'Every route has its own terrain, streets and constraints. Local teams turn that knowledge into practical plans for the people who will build the network. Engineers walk the route, record poles, conduit and property constraints, and produce designs and permit packages.', tags: ['Survey routes and existing infrastructure', 'Develop network designs and permit packages', 'Coordinate the work before crews arrive'], image: 'z9b_3619', alt: 'Engineer reviewing a 3D network design for a route on a monitor', related: [['Engineering', 'engineering'], ['Project management', 'project-management']] as LinkPair[] },
  { id: 'build', number: '02', label: 'Build & connect', title: 'Bring the connection home.', copy: 'From cable beneath a neighborhood street to equipment on a tower, skilled crews turn plans into the connections homes and businesses rely on. Crews place aerial strand or underground conduit, pull and splice fiber, and build wireless sites around existing infrastructure.', tags: ['Place conduit and cable underground and overhead', 'Build wireless infrastructure', 'Install and activate customer connections'], image: 'z9b_2139', alt: 'Lineworker at the top of a utility pole, building out the aerial network', related: [['Wireline construction', 'wireline-construction'], ['Wireless construction', 'wireless-construction'], ['Fulfillment', 'fulfillment']] as LinkPair[] },
  { id: 'protect', number: '03', label: 'Maintain & protect', title: 'Keep daily life connected.', copy: 'The work continues after a network goes live. Teams help prevent damage, maintain infrastructure and restore connections when service is interrupted. Inspection, testing and repair keep networks connected, and teams restore service when weather, accidents or digging interrupt it. Homes. Businesses. Communities. They depend on communications infrastructure.', tags: ['Locate buried utilities before excavation', 'Inspect, maintain and repair network assets', 'Respond to outages and restore service'], image: 'z9a_0911', alt: 'Technician in protective equipment inspecting a live equipment cabinet', related: [['Utility locating', 'locating'], ['Maintenance & restoration', 'maintenance-restoration']] as LinkPair[] },
];

// What we build (client feedback, 5 Nov 2026; lines revised by the user 6 Nov
// 2026): the lines of work rather than the customer segments — wireline
// construction, wireless construction, electrical contracting, engineering.
// Descriptors stay general rather than naming customers.
export const whatWeBuild = {
  eyebrow: 'What we build',
  title: 'Our work keeps America connected.',
  copy: 'From the smallest town to the largest city, Dycom companies deliver for the telecommunications, utility industries and critical infrastructure.',
  // Titles only: the one-line descriptions under each line of work were removed
  // at the user's request (6 Nov 2026, "too much content").
  items: [
    { title: 'Wireline construction' },
    { title: 'Wireless construction' },
    { title: 'Electrical contracting' },
    { title: 'Engineering' },
  ] as { title: string; copy?: string }[],
};

export const stages: { title: string; body: string; services: string[]; image: PhotoId; alt: string }[] = [
  { title: 'Design & engineering', body: 'Before anything goes in the ground, engineers walk the route and record what is already there: poles, conduit, rights of way and property lines. That fieldwork becomes network designs, permit packages and construction drawings. Local knowledge at this stage prevents surprises later.', services: ['Engineering', 'Project management'], image: 'z9b_1711', alt: 'Two crew members in hard hats reviewing the day’s route at their truck' },
  { title: 'Locate & prepare', body: 'Buried utilities are located and marked so crews can dig safely around gas, water, power and existing communications lines. Traffic control is arranged, permits are confirmed and materials are staged at a local yard. The schedule is coordinated with the customer and the community before the first truck arrives.', services: ['Utility locating', 'Project management'], image: 'z9b_1028', alt: 'Excavator opening a marked trench while the crew prepares the line' },
  { title: 'Build & connect', body: 'Crews place aerial strand on poles or conduit beneath streets, then pull and splice fiber route by route. Wireless teams build and upgrade cell sites, from macro towers to small cells on existing structures. The work is sequenced so streets, sidewalks and driveways stay open as much as possible.', services: ['Wireline construction', 'Wireless construction', 'Fulfillment', 'Electrical contracting'], image: 'z9b_0192', alt: 'Technician pulling new cable through woodland along the route' },
  { title: 'Maintain & restore', body: 'Every route is tested end to end before it carries traffic, and technicians connect homes and businesses to the new network. Surfaces that were opened are restored and as-built records are updated for the teams who come next. The job is finished when the site looks the way it did before the work began.', services: ['Maintenance', 'Emergency response'], image: 'z9b_6665', alt: 'Fiber patch cables plugged into a lit network rack during testing' },
  { title: 'Maintain & respond', body: 'Once a network is live, inspection, testing and repair keep it performing year after year. When storms, accidents or digging interrupt service, local crews respond and restore connections. Being nearby is what makes a fast response possible.', services: ['Maintenance & restoration', 'Utility locating'], image: 'z9b_1555', alt: 'Lineworker climbing a pole to inspect and repair the line' },
];

export const trades: { title: string; trade: Trade; body: string }[] = [
  { title: 'Underground construction', trade: 'Underground', body: 'Working with conduit, cable and excavation equipment takes coordination and attention to the utilities already in the ground. Ask about equipment training and travel.' },
  { title: 'Aerial construction', trade: 'Aerial Linework', body: 'Aerial line work combines equipment operation, work at height and crew coordination. Ask about qualifications, safety training and the working environment.' },
  { title: 'Fiber splicing', trade: 'Fiber Splicing', body: 'Splicing and testing fiber calls for precise preparation, careful handling and clear records. Ask about technical training and testing equipment.' },
  { title: 'Utility locating', trade: 'Locating', body: 'Locating work involves reading records, using detection equipment and marking buried utilities. Ask about field training and daily travel.' },
  { title: 'Engineering & project support', trade: 'Engineering', body: 'Surveying, design, scheduling and documentation help field teams prepare for construction. Ask which technical skills and tools a role requires.' },
];

// Four-card column (Dycom content v0.1): photography from the approved library,
// headlines and body copy as supplied, buttons to future-state site pages.
export const strengths: { title: string; copy: string; label: string; href: string; image: PhotoId; alt: string }[] = [
  { title: 'Scale is Local', copy: 'Dycom’s national strength is delivered through trusted local operating companies that bring customer knowledge, local accountability, and execution at scale.', label: 'Operating Strengths', href: page('who-we-are/operating-strengths'), image: 'z9b_0540', alt: 'Two crew members seated and laughing in the back of a work van' },
  { title: 'Built to Deliver', copy: 'Dycom turns complex digital infrastructure demand into work that is built, connected, powered, sustained, restored, and evolved safely, reliably, and at pace.', label: 'Our Capabilities', href: page('what-we-do/capabilities'), image: 'z9b_0355', alt: 'Directional drill head emerging from wet soil' },
  { title: 'Where Skill Meets Scale', copy: 'Dycom’s skilled, safety-minded people are the capability that builds, connects, powers, maintains, and advances the digital infrastructure America depends on now and into the future.', label: 'Careers', href: page('careers'), image: 'z9b_1903', alt: 'Lineworker in a white hard hat against a weathered wooden wall' },
  { title: 'Shaping What’s Next', copy: 'Dycom invests in the technology, capabilities, partnerships, and skilled workforce that help customers prepare for what’s next.', label: 'Resource Center', href: RESOURCES, image: 'z9a_0525', alt: 'Green laser level lines crossing a data center floor' },
];

// Brand statement band. Dycom's content v0.1 leaves the statement itself blank;
// until it arrives the band carries a sentence from Dycom's own company
// description in the same document.
export const brandStatement = 'We work in partnership with customers across the full project lifecycle, advantaged by a highly skilled workforce operating in all 50 states.';

// Brand video band: the packaged brand film with the lines that introduced it.
export const film = { eyebrow: 'Our people at work', caption: 'The people and work behind America’s infrastructure.' };

export const investorTiles: [title: string, copy: string, label: string, href: string][] = [
  ['Results & reports', 'Explore financial results, annual reports and official filings.', 'View results', page('investors/quarterly-reports')],
  ['Events & presentations', 'Find investor events and perspectives from Dycom leadership.', 'View events', page('investors/events-presentations')],
  ['Investor news', 'Read the latest corporate announcements and investor releases.', 'View news', page('investors/news')],
];

// The Resource Center chapter shows the same four groups as the Resource
// Center menu (src/v2/site.ts), so the index never drifts from the navigation.
export const resources: { group: string; items: LinkPair[] }[] = resourceColumns.map((col) => ({ group: col.title, items: col.links }));

export type IntentField = { name: string; label: string; type?: 'text' | 'email' | 'tel' | 'select' | 'textarea'; options?: string[]; optional?: boolean; full?: boolean; autoComplete?: string; placeholder?: string };
export type Intent = 'customer' | 'careers' | 'supplier' | 'community';

const WORK_TYPES = ['Engineering & design', 'Utility locating', 'Wireline construction', 'Wireless construction', 'Fulfillment & installation', 'Maintenance & restoration', 'Not sure yet'];
const REGIONS_SERVED = ['Nationwide', 'West', 'Midwest', 'Northeast', 'South'];
const TRADE_OPTIONS = ['Fiber Splicing', 'Locating', 'Aerial Linework', 'Directional Drilling', 'CDL Driving', 'Engineering', 'Underground', 'Not sure yet'];

// Each profile asks for a descriptor or two beyond name and email, so the
// inquiry reaches the right team with enough context to act on.
export const intents: Record<Intent, { label: string; route: string; fields: IntentField[]; action: string }> = {
  customer: { label: 'Customer or project', route: 'Tell us where the work is and what kind of network it is, and we’ll connect you with the local team.', action: 'Send inquiry', fields: [
    { name: 'organization', label: 'Organization', autoComplete: 'organization' },
    { name: 'location', label: 'Project location', placeholder: 'City, state' },
    { name: 'work', label: 'Type of work', type: 'select', options: WORK_TYPES },
    { name: 'timing', label: 'Timing', type: 'select', options: ['Ready to start', 'Within 6 months', 'Planning ahead'] },
    { name: 'message', label: 'Tell us about the project', type: 'textarea', full: true, placeholder: 'Scope, route miles, number of sites, or anything else that helps us prepare.' },
  ] },
  careers: { label: 'Careers', route: 'Tell us the trade and the area you have in mind, and we’ll show you the matching openings.', action: 'Search jobs', fields: [
    { name: 'trade', label: 'Trade you’re interested in', type: 'select', options: TRADE_OPTIONS },
    { name: 'location', label: 'Where you’d like to work', placeholder: 'City or state', optional: true },
  ] },
  supplier: { label: 'Supplier', route: 'Tell us what you provide and where, and purchasing will review it against current needs.', action: 'Send inquiry', fields: [
    { name: 'organization', label: 'Company', autoComplete: 'organization' },
    { name: 'offering', label: 'What you supply', placeholder: 'Products or services' },
    { name: 'region', label: 'Region served', type: 'select', options: REGIONS_SERVED },
    { name: 'message', label: 'Anything else we should know?', type: 'textarea', full: true, optional: true },
  ] },
  community: { label: 'Community', route: 'Tell us where the work is and what you’re seeing, and the crew’s local office will follow up.', action: 'Send inquiry', fields: [
    { name: 'location', label: 'Location of the work', placeholder: 'Street or city, state', full: true },
    { name: 'topic', label: 'What is this about?', type: 'select', options: ['Work near my property', 'Restoration or damage', 'Safety concern', 'Schedule or traffic', 'Something else'], full: true },
    { name: 'message', label: 'Details', type: 'textarea', full: true },
  ] },
};
