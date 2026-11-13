'use client';
import { useEffect, useMemo, useState } from 'react';
import { RichText, Text, type Item, type RichTextField, type TextField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight, ChevronDown, X } from 'lucide-react';
import type { ComponentProps } from 'lib/component-props';
import { EMPTY_FILTERS, useSiteUI } from 'lib/site-ui';
import { matchesLocation, matchesWork } from 'lib/jobs/match';
import type { HiringCompany, Job, JobsResult } from 'lib/jobs/types';
import { ActionButton, linkField, ButtonLink } from 'components/ui/links';
import { Modal } from 'components/ui/Modal';
import { Signal } from 'components/ui/Signal';

/**
 * Roles drawer — the single careers action (brief §6): every "Find a job", "View open roles" and
 * `#open-roles` link opens it. Right-hand drawer with Work / Where / Trade / Company filters,
 * removable chips, a live count, ten results at a time, a role view and an empty state.
 *
 * Roles come from `/api/jobs` (the jobs provider; SuccessFactors at integration). Trades are
 * authored items: each names the SAP `department` values it covers, so marketing owns the
 * plain-language categories the strategy asks for.
 *
 * Datasource template: Roles Drawer — Heading, CountLabel, Work/Where/Trade/Company labels and
 *   placeholders, AllTradesLabel, AllCompaniesLabel, ResetLabel, ShowMoreLabel, BackLabel,
 *   EntryLevelLabel, EmptyHeading, EmptyText, ApplyText (rich text), ApplyLabel, LoadingText,
 *   ErrorText, Trades (Trade[])
 * Trade — Name, Description, Question, Departments (pipe-separated SAP department values)
 */
type TradeItem = Item & {
  fields: { Name: TextField; Description: TextField; Question: TextField; Departments: TextField };
};

type DrawerFields = {
  Heading: TextField;
  CountLabel: TextField;
  WorkLabel: TextField;
  WorkPlaceholder: TextField;
  WhereLabel: TextField;
  WherePlaceholder: TextField;
  TradeLabel: TextField;
  AllTradesLabel: TextField;
  CompanyLabel: TextField;
  AllCompaniesLabel: TextField;
  ResetLabel: TextField;
  ShowMoreLabel: TextField;
  BackLabel: TextField;
  EntryLevelLabel: TextField;
  EmptyHeading: TextField;
  EmptyText: TextField;
  ApplyText: RichTextField;
  ApplyLabel: TextField;
  LoadingText: TextField;
  ErrorText: TextField;
  Trades: TradeItem[];
};

type RolesDrawerProps = ComponentProps & { fields: DrawerFields };

const PAGE = 10;
const str = (f?: TextField) => (f?.value as string | undefined) ?? '';

/** The feed is fetched once per visit, on first open, and shared by every later opening. */
let feedRequest: Promise<JobsResult> | null = null;
const loadFeed = () => {
  feedRequest ??= fetch('/api/jobs/').then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json() as Promise<JobsResult>;
  });
  feedRequest.catch(() => {
    feedRequest = null;
  });
  return feedRequest;
};

export const Default = ({ fields, rendering }: RolesDrawerProps) => {
  const { rolesOpen, closeRoles, roleFilters: filters, setRoleFilters: update } = useSiteUI();
  const [feed, setFeed] = useState<JobsResult | null>(null);
  const [failed, setFailed] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [job, setJob] = useState<Job | null>(null);
  const titleId = `roles-title-${rendering.uid ?? 'drawer'}`;

  useEffect(() => {
    if (!rolesOpen || feed) return;
    setFailed(false);
    loadFeed().then(setFeed, () => setFailed(true));
  }, [rolesOpen, feed]);

  useEffect(() => {
    setShown(PAGE);
    setJob(null);
  }, [filters, rolesOpen]);

  const trades = fields.Trades ?? [];
  /** SAP department → trade, from the authored Trade items. */
  const tradeOf = useMemo(() => {
    const map = new Map<string, TradeItem>();
    for (const t of trades) for (const d of str(t.fields.Departments).split('|')) if (d.trim()) map.set(d.trim(), t);
    return map;
  }, [trades]);

  const jobs = useMemo(() => {
    if (!feed) return [];
    return feed.jobs.filter((j) => {
      const trade = tradeOf.get(j.department);
      return (
        (!filters.trade || str(trade?.fields.Name) === filters.trade) &&
        (!filters.companyId || j.companyId === filters.companyId) &&
        matchesWork(j, filters.work, str(trade?.fields.Name)) &&
        matchesLocation(j, filters.location)
      );
    });
  }, [feed, filters, tradeOf]);

  const companies: HiringCompany[] = feed?.companies ?? [];
  const selectedCompany = companies.find((c) => c.id === filters.companyId);

  const chips: { label: string; clear: Partial<typeof filters> }[] = [];
  if (filters.work) chips.push({ label: filters.work, clear: { work: '' } });
  if (filters.location) chips.push({ label: filters.location, clear: { location: '' } });
  if (filters.trade) chips.push({ label: filters.trade, clear: { trade: '' } });
  if (filters.companyId) chips.push({ label: selectedCompany?.name ?? filters.companyId, clear: { companyId: '' } });

  const countLabel = str(fields.CountLabel) || 'open roles';
  const reset = str(fields.ResetLabel) || 'Reset filters';
  const jobTrade = job ? tradeOf.get(job.department) : undefined;

  return (
    <Modal open={rolesOpen} onClose={closeRoles} title={str(fields.Heading) || 'Open roles'} id={titleId} drawer>
      <p className="dy-roles-count" aria-live="polite">
        {feed
          ? `${jobs.length.toLocaleString()} of ${feed.total.toLocaleString()} ${countLabel}`
          : failed
            ? str(fields.ErrorText)
            : str(fields.LoadingText)}
      </p>

      <div className="dy-role-filters">
        <label>
          <Text field={fields.WorkLabel} />
          <input value={filters.work} onChange={(e) => update({ work: e.target.value })} placeholder={str(fields.WorkPlaceholder)} />
        </label>
        <label>
          <Text field={fields.WhereLabel} />
          <input value={filters.location} onChange={(e) => update({ location: e.target.value })} placeholder={str(fields.WherePlaceholder)} />
        </label>
        <label>
          <Text field={fields.TradeLabel} />
          <select value={filters.trade} onChange={(e) => update({ trade: e.target.value })}>
            <option value="">{str(fields.AllTradesLabel)}</option>
            {trades.map((t) => (
              <option key={t.id} value={str(t.fields.Name)}>
                {str(t.fields.Name)}
              </option>
            ))}
          </select>
          <ChevronDown className="dy-chevron" aria-hidden="true" />
        </label>
        <label>
          <Text field={fields.CompanyLabel} />
          <select value={filters.companyId} onChange={(e) => update({ companyId: e.target.value })}>
            <option value="">{str(fields.AllCompaniesLabel)}</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="dy-chevron" aria-hidden="true" />
        </label>
      </div>

      {chips.length > 0 && (
        <div className="dy-chips">
          {chips.map((c) => (
            <button type="button" key={c.label} onClick={() => update(c.clear)} aria-label={`Remove ${c.label} filter`}>
              {c.label}
              <X size={16} aria-hidden="true" />
            </button>
          ))}
          <button type="button" onClick={() => update(EMPTY_FILTERS)}>
            {reset}
          </button>
        </div>
      )}

      <div className="dy-role-results">
        {job ? (
          <article className="dy-job-detail">
            <button type="button" className="dy-button dy-button--outline" onClick={() => setJob(null)}>
              <Text field={fields.BackLabel} />
            </button>
            <h3>{job.title}</h3>
            <p>
              {job.companyName} · {job.city}, {job.state}
            </p>
            <p>
              {[job.shiftType, job.travel && `Travel ${job.travel.replace('-', '–')}`, job.entryLevel && str(fields.EntryLevelLabel)]
                .filter(Boolean)
                .join(' · ')}
            </p>
            <p>{job.summary}</p>
            {jobTrade && <Text tag="p" field={jobTrade.fields.Question} />}
            <RichText field={fields.ApplyText} />
            <ButtonLink field={linkField(job.applyUrl, str(fields.ApplyLabel) || 'Apply')} />
          </article>
        ) : jobs.length ? (
          <>
            <ul aria-label="Matching roles">
              {jobs.slice(0, shown).map((j) => (
                <li key={j.id}>
                  <button type="button" className="dy-role-row" onClick={() => setJob(j)}>
                    <span>
                      <strong>{j.title}</strong>
                      <span>{j.companyName}</span>
                      <small>
                        {j.city}, {j.state} · {j.shiftType}
                        {j.entryLevel ? ` · ${str(fields.EntryLevelLabel)}` : ''}
                      </small>
                    </span>
                    <ArrowRight size={20} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            {shown < jobs.length && (
              <div className="dy-show-more">
                <ActionButton variant="outline" onClick={() => setShown((s) => s + PAGE)}>
                  {str(fields.ShowMoreLabel) || 'Show more'} ({jobs.length - shown})
                </ActionButton>
              </div>
            )}
          </>
        ) : feed ? (
          <div className="dy-empty" role="status">
            <Signal />
            <Text tag="h3" field={fields.EmptyHeading} />
            <Text tag="p" field={fields.EmptyText} />
            <ActionButton onClick={() => update(EMPTY_FILTERS)}>{reset}</ActionButton>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
