// Homepage copy and link inventory for Concept 05. Every section traces to
// docs/dycom-concept-05-requirements.md; keep copy edits there in sync.
import type { Trade } from './jobs';
import type { PhotoId } from './photos';
import { INVESTORS, page, type SiteLinkPair } from './site';

export type LinkPair = SiteLinkPair;
// Site pages live in src/lib/site.ts (future-state sitemap); nothing links
// out to the current dycomind.com (client instruction, Oct 22 2026).
export { INVESTORS, page };

export { asset } from './assets';


export const pathways: [label: string, detail: string, href: string][] = [
  ['Customers & partners', 'From network design to construction and maintenance.', '#what-we-do'],
  ['Job seekers', 'Explore the trades and find your local crew.', '#careers'],
  ['Investors', 'Results, reports and a national perspective.', '#investors'],
  ['Communities & suppliers', 'Connect with the people behind the work.', '#contact'],
];

export const values = ['People', 'Safety', 'Integrity', 'Innovation', 'Customer Focus', 'Sustainability'];

// WHO-F2 (#101): company-wide facts as published on dycomind.com (see docs/dycom-source-research.md)
export const facts: [string, string][] = [
  ['1969', 'Incorporated in Florida'],
  ['20,000+', 'Employees nationwide'],
  ['~40', 'Operating companies'],
  ['NYSE: DY', 'Listed on the New York Stock Exchange'],
];

export const services: { id: string; number: string; label: string; title: string; copy: string; tags: string[]; image: PhotoId; alt: string; related: LinkPair[] }[] = [
  { id: 'plan', number: '01', label: 'Plan & design', title: 'Start with the place.', copy: 'Every route has its own terrain, streets and constraints. Local teams turn that knowledge into practical plans for the people who will build the network. Engineers walk the route, record poles, conduit and property constraints, and produce designs and permit packages.', tags: ['Survey routes and existing infrastructure', 'Develop network designs and permit packages', 'Coordinate the work before crews arrive'], image: 'z9b_3619', alt: 'Engineer reviewing a 3D network design for a route on a monitor', related: [['Engineering', 'engineering'], ['Project management', 'project-management']] as LinkPair[] },
  { id: 'build', number: '02', label: 'Build & connect', title: 'Bring the connection home.', copy: 'From cable beneath a neighborhood street to equipment on a tower, skilled crews turn plans into the connections homes and businesses rely on. Crews place aerial strand or underground conduit, pull and splice fiber, and build wireless sites around existing infrastructure.', tags: ['Place conduit and cable underground and overhead', 'Build wireless infrastructure', 'Install and activate customer connections'], image: 'z9b_2139', alt: 'Lineworker at the top of a utility pole, building out the aerial network', related: [['Wireline construction', 'wireline-construction'], ['Wireless construction', 'wireless-construction'], ['Fulfillment', 'fulfillment']] as LinkPair[] },
  { id: 'protect', number: '03', label: 'Maintain & protect', title: 'Keep daily life connected.', copy: 'The work continues after a network goes live. Teams help prevent damage, maintain infrastructure and restore connections when service is interrupted. Inspection, testing and repair keep networks connected, and teams restore service when weather, accidents or digging interrupt it. Homes. Businesses. Communities. They depend on communications infrastructure.', tags: ['Locate buried utilities before excavation', 'Inspect, maintain and repair network assets', 'Respond to outages and restore service'], image: 'z9a_0911', alt: 'Technician in protective equipment inspecting a live equipment cabinet', related: [['Utility locating', 'locating'], ['Maintenance & restoration', 'maintenance-restoration']] as LinkPair[] },
];

export const stages: { title: string; body: string; services: string[]; image: PhotoId; alt: string }[] = [
  { title: 'Survey & plan', body: 'Before anything goes in the ground, engineers walk the route and record what is already there: poles, conduit, rights of way and property lines. That fieldwork becomes network designs, permit packages and construction drawings. Local knowledge at this stage prevents surprises later.', services: ['Engineering', 'Project management'], image: 'z9b_1711', alt: 'Two crew members in hard hats reviewing the day’s route at their truck' },
  { title: 'Locate & prepare', body: 'Buried utilities are located and marked so crews can dig safely around gas, water, power and existing communications lines. Traffic control is arranged, permits are confirmed and materials are staged at a local yard. The schedule is coordinated with the customer and the community before the first truck arrives.', services: ['Utility locating', 'Project management'], image: 'z9b_1028', alt: 'Excavator opening a marked trench while the crew prepares the line' },
  { title: 'Build & connect', body: 'Crews place aerial strand on poles or conduit beneath streets, then pull and splice fiber route by route. Wireless teams build and upgrade cell sites, from macro towers to small cells on existing structures. The work is sequenced so streets, sidewalks and driveways stay open as much as possible.', services: ['Wireline construction', 'Wireless construction'], image: 'z9b_0192', alt: 'Technician pulling new cable through woodland along the route' },
  { title: 'Test & restore', body: 'Every route is tested end to end before it carries traffic, and technicians connect homes and businesses to the new network. Surfaces that were opened are restored and as-built records are updated for the teams who come next. The job is finished when the site looks the way it did before the work began.', services: ['Fulfillment', 'Splicing & testing'], image: 'z9b_6665', alt: 'Fiber patch cables plugged into a lit network rack during testing' },
  { title: 'Maintain & respond', body: 'Once a network is live, inspection, testing and repair keep it performing year after year. When storms, accidents or digging interrupt service, local crews respond and restore connections. Being nearby is what makes a fast response possible.', services: ['Maintenance & restoration', 'Utility locating'], image: 'z9b_1555', alt: 'Lineworker climbing a pole to inspect and repair the line' },
];

export const trades: { title: string; trade: Trade; body: string }[] = [
  { title: 'Underground construction', trade: 'Underground', body: 'Working with conduit, cable and excavation equipment takes coordination and attention to the utilities already in the ground. Ask about equipment training and travel.' },
  { title: 'Aerial construction', trade: 'Aerial Linework', body: 'Aerial line work combines equipment operation, work at height and crew coordination. Ask about qualifications, safety training and the working environment.' },
  { title: 'Fiber splicing', trade: 'Fiber Splicing', body: 'Splicing and testing fiber calls for precise preparation, careful handling and clear records. Ask about technical training and testing equipment.' },
  { title: 'Utility locating', trade: 'Locating', body: 'Locating work involves reading records, using detection equipment and marking buried utilities. Ask about field training and daily travel.' },
  { title: 'Engineering & project support', trade: 'Engineering', body: 'Surveying, design, scheduling and documentation help field teams prepare for construction. Ask which technical skills and tools a role requires.' },
];

export const investorTiles: [title: string, copy: string, label: string, href: string][] = [
  ['Results & reports', 'Explore financial results, annual reports and official filings.', 'View results', page('investors/quarterly-reports')],
  ['Events & presentations', 'Find investor events and perspectives from Dycom leadership.', 'View events', page('investors/events-presentations')],
  ['Investor news', 'Read the latest corporate announcements and investor releases.', 'View news', page('investors/news')],
];

export const resources: { group: string; items: LinkPair[] }[] = [
  { group: 'Corporate reports', items: [['Safety, People and Environment', page('sustainability')], ['Reports, filings and governance', page('investors/sec-filings')], ['Company purpose and values', page('who-we-are/values')]] },
  { group: 'Safety & employees', items: [['Hazard recognition', page('how-we-work/hazard-recognition')], ['Employee handbook', page('careers/employee-handbook')], ['Benefit plan disclosures', page('careers/benefit-plan-disclosures')]] },
  { group: 'Suppliers', items: [['Inventory terms of purchase', page('suppliers/inventory-terms-of-purchase')], ['Fleet terms of purchase', page('suppliers/fleet-terms-of-purchase')]] },
  { group: 'Candidates', items: [['Our recruitment process', page('careers/recruitment-process')], ['Benefits', page('careers/benefits')]] },
];

export const intents = {
  customer: { label: 'Customer or project', route: 'Have a project in mind? Include the location, type of work and timing when you contact the team.', url: page('contact'), action: 'Contact Dycom' },
  careers: { label: 'Careers', route: 'Search current openings and follow the application instructions for the role that interests you.', url: null, action: 'Search jobs' },
  supplier: { label: 'Supplier', route: 'Review purchasing terms before discussing products or services with a company.', url: page('suppliers/inventory-terms-of-purchase'), action: 'Read purchasing terms' },
  community: { label: 'Community', route: 'For questions about work in your area, include the location and details of your concern when contacting Dycom.', url: page('contact'), action: 'Contact Dycom' },
} as const;
export type Intent = keyof typeof intents;
