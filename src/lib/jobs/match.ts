import type { Job, JobQuery } from './types';

const norm = (s: string) => s.trim().toLowerCase();

/** Every word must appear in the title, category or summary. "entry" / "trainee" find entry-level roles. */
export function matchesWork(job: Job, work = '', tradeName = '') {
  const t = norm(work);
  if (!t) return true;
  const hay = `${job.title} ${job.department} ${tradeName} ${job.summary} ${job.entryLevel ? 'entry level trainee no experience' : ''}`.toLowerCase();
  return t.split(/\s+/).every((w) => hay.includes(w));
}

/** City, state abbreviation, region or ZIP prefix — each word must match one of them. */
export function matchesLocation(job: Job, location = '') {
  const t = norm(location);
  if (!t) return true;
  return t
    .split(/[\s,]+/)
    .filter(Boolean)
    .every((w) => job.city.toLowerCase().includes(w) || job.state.toLowerCase() === w || job.region.toLowerCase() === w || job.zip.startsWith(w));
}

export function filterJobs(jobs: Job[], q: JobQuery = {}) {
  return jobs.filter(
    (j) =>
      (!q.companyId || j.companyId === q.companyId) &&
      (!q.department || j.department === q.department) &&
      matchesWork(j, q.work) &&
      matchesLocation(j, q.location)
  );
}
