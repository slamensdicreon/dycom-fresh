// Illustrative prototype dataset. Every count shown in the UI is computed from this list,
// so totals always equal the number of roles a visitor can actually enumerate.
// Office addresses come from the shared company directory; roles, schedules and role
// locations are deterministic samples, not a live job feed.
import type { Company } from '@workspace/dycom-network-map/companies';
import { presentedCompanies as companies } from '@workspace/dycom-network-map/presentation';
import { sampleOpenRoleCount } from '@workspace/dycom-network-map/sample-jobs';

export type Trade = 'Fiber Splicing' | 'Locating' | 'Aerial Linework' | 'Directional Drilling' | 'CDL Driving' | 'Engineering' | 'Underground' | 'Corporate';

/**
 * Dycom Industries itself: the corporate office in Palm Beach Gardens. It is not
 * an operating company, so it stays off the map and out of the directory, but
 * it hires too, so it leads the Find your crew company list (client feedback,
 * 4 Nov 2026: "Dycom is missing on the find your crew list").
 */
export const DYCOM_CORPORATE: Company = {
  id: 'dycom',
  name: 'Dycom Industries (corporate)',
  fullName: 'Dycom Industries, Inc.',
  city: 'Palm Beach Gardens',
  state: 'FL',
  address: '11780 US Highway 1, Suite 600',
  zip: '33408',
  coordinates: [-80.0749, 26.8402],
  region: 'South',
  website: 'https://www.dycomind.com/',
  careers: 'https://www.dycomind.com/careers/',
};

/** Everyone with roles in the drawer: the corporate office first, then the presented operating companies. */
export const HIRING_COMPANIES: Company[] = [DYCOM_CORPORATE, ...companies];

export const TRADES: { name: Trade; work: string; ask: string }[] = [
  { name: 'Fiber Splicing', work: 'Join and test optical fibers so a route carries signal end to end.', ask: 'Ask which splicing and test equipment is taught.' },
  { name: 'Locating', work: 'Find and mark buried utilities before anyone digs.', ask: 'Ask how new locators are paired with experienced ones.' },
  { name: 'Aerial Linework', work: 'Place and maintain cable on poles and strand.', ask: 'Ask what climbing training comes before working at height.' },
  { name: 'Directional Drilling', work: 'Bore under roads and yards to place conduit without open trenches.', ask: 'Ask how operators are trained on each rig.' },
  { name: 'CDL Driving', work: 'Move reels, equipment and materials between yards and sites.', ask: 'Ask which endorsements and overnights the role needs.' },
  { name: 'Engineering', work: 'Survey routes and produce the drawings and permits crews build from.', ask: 'Ask how field time and design time are balanced.' },
  { name: 'Underground', work: 'Place conduit and cable below grade, then restore the site.', ask: 'Ask about equipment training and physical requirements.' },
  { name: 'Corporate', work: 'Support the operating companies from the Dycom office: finance, people, safety, fleet and technology.', ask: 'Ask how the role works with the operating companies day to day.' },
];

const ROLES: { title: string; trade: Trade; summary: string; entry?: boolean }[] = [
  { title: 'Fiber Splicer', trade: 'Fiber Splicing', summary: 'Splice and test fiber in aerial and underground plant, documenting results for each run.' },
  { title: 'Fiber Splicer Trainee', trade: 'Fiber Splicing', summary: 'Learn splicing and testing alongside a lead splicer.', entry: true },
  { title: 'Underground Utility Locator', trade: 'Locating', summary: 'Locate and mark buried lines ahead of excavation using locating equipment and maps.' },
  { title: 'Aerial Lineman', trade: 'Aerial Linework', summary: 'Build and maintain aerial plant from bucket trucks to strict safety standards.' },
  { title: 'Directional Drill Operator', trade: 'Directional Drilling', summary: 'Operate HDD rigs to place conduit under roads and yards with minimal surface impact.' },
  { title: 'CDL Class A Driver', trade: 'CDL Driving', summary: 'Move crew equipment between job sites safely and on schedule.' },
  { title: 'OSP Engineer / Designer', trade: 'Engineering', summary: 'Design outside plant routes, permits and construction drawings for network builds.' },
  { title: 'Underground Laborer', trade: 'Underground', summary: 'Entry-level crew role placing conduit and restoring sites. Training on the job.', entry: true },
  { title: 'Construction Foreman', trade: 'Underground', summary: 'Lead a field crew day to day: job briefings, quality, safety and production.' },
];
/** Roles at the corporate office; sampled for Dycom Industries instead of the field roles. */
const CORPORATE_ROLES: { title: string; trade: Trade; summary: string; entry?: boolean }[] = [
  { title: 'Staff Accountant', trade: 'Corporate', summary: 'Month-end close, reconciliations and reporting across the operating companies.' },
  { title: 'HR Generalist', trade: 'Corporate', summary: 'Support hiring, onboarding and employee relations for a group of operating companies.' },
  { title: 'Safety Program Manager', trade: 'Corporate', summary: 'Develop safety programs and training that every crew in the family works to.' },
  { title: 'Fleet Coordinator', trade: 'Corporate', summary: 'Keep trucks, trailers and equipment assigned, maintained and compliant.' },
  { title: 'IT Support Analyst', trade: 'Corporate', summary: 'Keep field and office systems running, from devices to the job-management tools.' },
  { title: 'Payroll Specialist', trade: 'Corporate', summary: 'Weekly payroll for field crews on varied schedules, with accuracy at scale.' },
  { title: 'Finance Intern', trade: 'Corporate', summary: 'Learn how a national contractor plans, reports and invests, alongside the finance team.', entry: true },
];
const SCHEDULES = ['Full-time · Mon–Fri', 'Full-time · 4×10s', 'Full-time · Overtime available', 'Full-time · Travel required'];

export type Job = {
  id: string; title: string; trade: Trade; summary: string; entry: boolean; schedule: string;
  company: Company; city: string; state: string; zip: string; atOffice: boolean;
};

function hash(s: string) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

export const JOBS: Job[] = HIRING_COMPANIES.flatMap((company) => {
  const h = hash(company.id);
  const corporate = company.id === DYCOM_CORPORATE.id;
  const n = corporate ? 12 : sampleOpenRoleCount(company.id);
  const roles = corporate ? CORPORATE_ROLES : ROLES;
  return Array.from({ length: n }, (_, i) => {
    const role = roles[(h + i * 5) % roles.length];
    const atOffice = corporate || (h + i) % 3 !== 0;
    return {
      id: `${company.id}-${i}`, title: role.title, trade: role.trade, summary: role.summary, entry: !!role.entry,
      schedule: SCHEDULES[(h + i * 7) % SCHEDULES.length], company,
      city: atOffice ? company.city : 'Field sites', state: company.state, zip: company.zip, atOffice,
    };
  });
});

export type Filters = { work: string; location: string; trade: Trade | ''; companyId: string };
export const emptyFilters: Filters = { work: '', location: '', trade: '', companyId: '' };

const norm = (s: string) => s.trim().toLowerCase();

export function matchesWork(job: Job, work: string) {
  const t = norm(work);
  if (!t) return true;
  const hay = `${job.title} ${job.trade} ${job.summary} ${job.entry ? 'entry level trainee no experience' : ''}`.toLowerCase();
  return t.split(/\s+/).every((w) => hay.includes(w));
}

export function matchesLocation(c: Company, location: string) {
  const t = norm(location);
  if (!t) return true;
  return t.split(/[\s,]+/).filter(Boolean).every((w) =>
    c.city.toLowerCase().includes(w) || c.state.toLowerCase() === w || c.region.toLowerCase() === w || c.zip.startsWith(w));
}

/** Jobs matching work, location and trade — the scope used for the map and company counts. */
export function filterJobs(f: Filters) {
  return JOBS.filter((j) => (!f.trade || j.trade === f.trade) && matchesWork(j, f.work) && matchesLocation(j.company, f.location));
}

export const TOTAL_ROLES = JOBS.length;
