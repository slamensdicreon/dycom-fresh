/**
 * A job opening as the site uses it, normalised from a SuccessFactors RMK feed record.
 * Only facts the feed supplies as structured fields are here (brief §3: the drawer filters are
 * limited to what a feed can provide).
 */
export type Job = {
  /** Requisition id from the feed (`ID`). */
  id: string;
  title: string;
  /** Plain-text summary taken from the feed `description`. */
  summary: string;
  /** Internal SAP category (`department`); mapped to a plain-language trade by authored Trade items. */
  department: string;
  /** Operating company id (directory id), resolved from the feed `facility`. */
  companyId: string;
  companyName: string;
  city: string;
  state: string;
  zip: string;
  /** Census region of the company's home office, for "South", "Midwest"… searches. */
  region: string;
  /** Feed `shifttype` (Hourly / Salaried). */
  shiftType: string;
  /** Feed `travel` band, e.g. "25%-49%". */
  travel: string;
  /** Feed `created` date (ISO). */
  created: string;
  /** Where the visitor applies: the operating company's careers page. */
  applyUrl: string;
  /** Derived: trainee, laborer and intern roles. The feed has no experience field yet. */
  entryLevel: boolean;
};

export type HiringCompany = { id: string; name: string };

export type JobQuery = {
  work?: string;
  location?: string;
  companyId?: string;
  department?: string;
};

export type JobsResult = { total: number; jobs: Job[]; companies: HiringCompany[] };

/**
 * Source of open roles. Today: `LocalJobsProvider` over a static feed file. At integration: a
 * provider over the SuccessFactors RMK XML feed (or the JobRequisition OData API) — same interface.
 */
export interface JobsProvider {
  search(query?: JobQuery): Promise<JobsResult>;
  /** Open-role count per operating company id (for the company directory / card). */
  countsByCompany(): Promise<Record<string, number>>;
}
