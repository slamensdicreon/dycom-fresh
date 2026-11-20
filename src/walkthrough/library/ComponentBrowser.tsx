'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { componentGroups, STATUSES, templates } from '../data';
import { lib, StatusTag } from '../ui/sections';

/** The component inventory with filters: status, template and a text search. */
export function ComponentBrowser() {
  const [status, setStatus] = useState<string>('');
  const [template, setTemplate] = useState<string>('');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const groups = useMemo(
    () =>
      componentGroups
        .map((g) => ({
          ...g,
          components: g.components.filter(
            (c) =>
              (!status || c.status === status) &&
              (!template || c.templates.includes(template)) &&
              (!q || `${c.name} ${c.what} ${c.refs} ${c.source}`.toLowerCase().includes(q)),
          ),
        }))
        .filter((g) => g.components.length),
    [status, template, q],
  );
  const count = groups.reduce((n, g) => n + g.components.length, 0);

  return (
    <div className="wt-section">
      <div className="wt-filter" role="group" aria-label="Filter by status">
        <button type="button" aria-pressed={!status} onClick={() => setStatus('')}>
          All statuses
        </button>
        {STATUSES.map((s) => (
          <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(status === s ? '' : s)}>
            <span className="wt-key" data-status={s} />
            {s}
          </button>
        ))}
      </div>
      <div className="wt-filter">
        <label className="visually-hidden" htmlFor="wt-comp-template">
          Template
        </label>
        <select
          id="wt-comp-template"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          style={{ minHeight: 40, border: '1px solid var(--civic)', padding: '0 10px', font: '15px var(--body)', color: 'var(--civic)' }}
        >
          <option value="">All templates</option>
          {templates.map((t) => (
            <option key={t.code} value={t.code}>
              {t.code} {t.name}
            </option>
          ))}
        </select>
        <label className="visually-hidden" htmlFor="wt-comp-search">
          Search components
        </label>
        <input id="wt-comp-search" type="search" placeholder="Search by name, purpose or requirement" value={query} onChange={(e) => setQuery(e.target.value)} />
        <span className="wt-small" aria-live="polite">
          {count} shown
        </span>
      </div>
      {groups.map((g) => (
        <div key={g.name} className="wt-comp-group">
          <h3>{g.name}</h3>
          {g.components.map((c) => (
            <Link key={c.slug} href={lib.component(c.slug)} className="wt-comp-row">
              <span>
                <strong>{c.name}</strong>
                <span className="wt-refs">{c.refs}</span>
              </span>
              <span>{c.what}</span>
              <span className="wt-chips">
                {c.templates.length === 16 ? <span className="wt-chip">All templates</span> : c.templates.map((t) => <span key={t} className="wt-chip">{t}</span>)}
              </span>
              <span>
                <StatusTag status={c.status} />
              </span>
            </Link>
          ))}
        </div>
      ))}
      {!count && <p>No components match. Clear a filter to see more.</p>}
    </div>
  );
}
