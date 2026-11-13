import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, X } from 'lucide-react';
import { Action, Modal, Signal } from './primitives';
import { HIRING_COMPANIES as companies, JOBS, TRADES, emptyFilters, filterJobs, type Filters, type Job, type Trade } from '../jobs';

export function RolesDrawer({ open, onClose, filters, update }: { open: boolean; onClose: () => void; filters: Filters; update: (patch: Partial<Filters>) => void }) {
  const [shown, setShown] = useState(10);
  const [job, setJob] = useState<Job | null>(null);
  useEffect(() => { setShown(10); setJob(null); }, [filters, open]);
  const scope = useMemo(() => filterJobs(filters), [filters]);
  const jobs = filters.companyId ? scope.filter((j) => j.company.id === filters.companyId) : scope;
  const selectedCompany = companies.find((c) => c.id === filters.companyId);
  const chips: { label: string; clear: Partial<Filters> }[] = [];
  if (filters.work) chips.push({ label: filters.work, clear: { work: '' } });
  if (filters.location) chips.push({ label: filters.location, clear: { location: '' } });
  if (filters.trade) chips.push({ label: filters.trade, clear: { trade: '' } });
  if (selectedCompany) chips.push({ label: selectedCompany.name, clear: { companyId: '' } });
  return (
    <Modal open={open} onClose={onClose} title="Find your crew." id="c5-roles-title" drawer>
      <p className="dycom-c5__roles-count" aria-live="polite">{jobs.length.toLocaleString()} of {JOBS.length.toLocaleString()} illustrative sample roles · not current vacancies</p>
      <div className="dycom-c5__role-filters">
        <label>Work<input value={filters.work} onChange={(e) => update({ work: e.target.value })} placeholder="Splicer, driver…" /></label>
        <label>Where<input value={filters.location} onChange={(e) => update({ location: e.target.value })} placeholder="City, state or ZIP" /></label>
        <label>Trade<select value={filters.trade} onChange={(e) => update({ trade: e.target.value as Trade | '' })}><option value="">All trades</option>{TRADES.map((t) => <option key={t.name}>{t.name}</option>)}</select><ChevronDown className="dycom-c5__chevron" aria-hidden="true" /></label>
        <label>Company<select value={filters.companyId} onChange={(e) => update({ companyId: e.target.value })}><option value="">All companies</option>{companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><ChevronDown className="dycom-c5__chevron" aria-hidden="true" /></label>
      </div>
      {chips.length > 0 && (
        <div className="dycom-c5__chips">
          {chips.map((c) => <button type="button" key={c.label} onClick={() => update(c.clear)} aria-label={`Remove ${c.label} filter`}>{c.label}<X size={16} /></button>)}
          <button type="button" onClick={() => update(emptyFilters)}>Reset filters</button>
        </div>
      )}
      <div className="dycom-c5__role-results">
        {job ? (
          <article className="dycom-c5__job-detail">
            <button type="button" className="dycom-c5__button dycom-c5__button--outline" onClick={() => setJob(null)}>Back to all roles</button>
            <h3>{job.title}</h3>
            <p>{job.company.name} · {job.city}, {job.state}</p>
            <p>{job.schedule}</p>
            <p>{job.summary}</p>
            <p>{TRADES.find((t) => t.name === job.trade)?.ask}</p>
            <p>Illustrative role only. No application is submitted here. Check the company’s careers page for current openings and requirements.</p>
            <Action href={job.company.careers}>Company careers</Action>
          </article>
        ) : jobs.length ? (
          <>
            <ul aria-label="Matching roles">
              {jobs.slice(0, shown).map((j) => (
                <li key={j.id}>
                  <button type="button" className="dycom-c5__role-row" onClick={() => setJob(j)}>
                    <span><strong>{j.title}</strong><span>{j.company.name}</span><small>{j.atOffice ? `${j.city}, ${j.state}` : `Field sites near ${j.company.city}, ${j.state}`} · {j.schedule}{j.entry ? ' · Entry level' : ''}</small></span>
                    <ArrowRight size={20} />
                  </button>
                </li>
              ))}
            </ul>
            {shown < jobs.length && <div className="dycom-c5__show-more"><Action outline onClick={() => setShown((s) => s + 10)}>Show more ({jobs.length - shown})</Action></div>}
          </>
        ) : (
          <div className="dycom-c5__empty" role="status"><Signal /><h3>No roles match.</h3><p>Try a nearby state, a broader trade or another company.</p><Action onClick={() => update(emptyFilters)}>Reset filters</Action></div>
        )}
      </div>
    </Modal>
  );
}
