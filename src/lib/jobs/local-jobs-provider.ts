import 'server-only';
import feed from 'content/data/jobs-feed.json';
import facilities from 'content/data/job-facilities.json';
import { filterJobs } from './match';
import type { HiringCompany, Job, JobQuery, JobsProvider, JobsResult } from './types';

/** A record of the SuccessFactors RMK XML feed (field names as SAP publishes them). */
type FeedRecord = (typeof feed.records)[number];
type Facility = (typeof facilities)[number];

/**
 * The integration seam. SuccessFactors puts the operating company's legal name in `facility`
 * (SAP defines the field as location-oriented — validate this with Dycom's SAP team, assessment §11)
 * and a short code in `brand`. Both are matched to the company directory here.
 */
const byFacility = new Map<string, Facility>();
for (const f of facilities) {
  byFacility.set(f.facility.toLowerCase(), f);
  byFacility.set(f.brand.toLowerCase(), f);
}

const ENTRY = /\b(trainee|laborer|intern|apprentice)\b/i;
const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function normalise(r: FeedRecord): Job | null {
  const company = byFacility.get(r.facility.toLowerCase()) ?? byFacility.get(r.brand.toLowerCase());
  // A requisition whose facility is not a presented company (e.g. a held-back one) is not listed.
  if (!company) return null;
  return {
    id: r.ID,
    title: r.title,
    summary: stripHtml(r.description),
    department: r.department,
    companyId: company.companyId,
    companyName: company.name,
    city: r.city,
    state: r.state,
    zip: r.postalcode,
    region: company.region,
    shiftType: r.shifttype,
    travel: r.travel,
    created: new Date(`${r.created} UTC`).toISOString().slice(0, 10),
    applyUrl: r.url || company.careers,
    entryLevel: ENTRY.test(r.title),
  };
}

const JOBS: Job[] = feed.records.map(normalise).filter((j): j is Job => j !== null);
/** Corporate first, then operating companies A–Z (the drawer's company list). */
const COMPANIES: HiringCompany[] = facilities
  .filter((f) => JOBS.some((j) => j.companyId === f.companyId))
  .map((f) => ({ id: f.companyId, name: f.name }))
  .sort((a, b) => (a.id === 'dycom' ? -1 : b.id === 'dycom' ? 1 : a.name.localeCompare(b.name)));

export class LocalJobsProvider implements JobsProvider {
  async search(query: JobQuery = {}): Promise<JobsResult> {
    const jobs = filterJobs(JOBS, query);
    return { total: JOBS.length, jobs, companies: COMPANIES };
  }

  async countsByCompany(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    for (const j of JOBS) counts[j.companyId] = (counts[j.companyId] ?? 0) + 1;
    return counts;
  }
}
