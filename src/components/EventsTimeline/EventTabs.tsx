'use client';
import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from 'react';
import { Text, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import { SiteLink } from 'components/ui/links';
import type { InvestorEvent } from './EventsTimeline';

type Labels = {
  tabs: string;
  upcoming?: TextField;
  past?: TextField;
  upcomingEmpty?: TextField;
  pastEmpty?: TextField;
  emptyLink?: LinkField;
};

const noop = () => () => {};
const clientDay = () => new Date().toISOString().slice(0, 10);

/** Upcoming soonest first; past most recent first. */
function split(events: InvestorEvent[], day: string) {
  const iso = (e: InvestorEvent) => String(e.fields.Date?.value ?? '').slice(0, 10);
  return {
    upcoming: events.filter((e) => iso(e) >= day).sort((a, b) => iso(a).localeCompare(iso(b))),
    past: events.filter((e) => iso(e) < day).sort((a, b) => iso(b).localeCompare(iso(a))),
  };
}

function EventList({ items, empty, emptyLink }: { items: InvestorEvent[]; empty?: TextField; emptyLink?: LinkField }) {
  if (!items.length) {
    return (
      <div className="dy-irp-empty">
        <Text tag="p" field={empty} />
        {emptyLink?.value?.href ? <SiteLink field={emptyLink} className="dy-link" /> : null}
      </div>
    );
  }
  return (
    <ol className="dy-irp-timeline">
      {items.map((e, i) => (
        <li key={e.id ?? i}>
          <time dateTime={e.fields.Date?.value}>
            <Text field={e.fields.DisplayDate} />
            {e.fields.Time?.value ? ` · ${e.fields.Time.value}` : ''}
          </time>
          <Text tag="strong" field={e.fields.Title} />
          {e.fields.WebcastLink?.value?.href && <SiteLink field={e.fields.WebcastLink} className="dy-text-link" />}
        </li>
      ))}
    </ol>
  );
}

/**
 * Upcoming / Past tabs. Hydrates with the day the page was rendered, then re-splits with the
 * visitor's day, so a past event is never shown as upcoming. Both panels stay mounted (the inactive
 * one hidden) so in-page find still reaches past events.
 */
export function EventTabs({ idBase, renderDay, events, labels }: { idBase: string; renderDay: string; events: InvestorEvent[]; labels: Labels }) {
  const day = useSyncExternalStore(noop, clientDay, () => renderDay);
  const { upcoming, past } = split(events, day);
  const [chosen, setChosen] = useState<'upcoming' | 'past' | null>(null);
  const tab = chosen ?? (upcoming.length ? 'upcoming' : 'past');
  const list = useRef<HTMLDivElement>(null);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const next = e.key === 'Home' ? 'upcoming' : e.key === 'End' ? 'past' : tab === 'upcoming' ? 'past' : 'upcoming';
    setChosen(next);
    list.current?.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus();
  };

  const tabs = [
    { key: 'upcoming' as const, label: labels.upcoming, fallback: 'Upcoming', items: upcoming, empty: labels.upcomingEmpty, link: labels.emptyLink },
    { key: 'past' as const, label: labels.past, fallback: 'Past', items: past, empty: labels.pastEmpty, link: undefined },
  ];

  return (
    <div className="dy-irp-tabs">
      <div className="dy-irp-tablist" role="tablist" aria-label={labels.tabs} ref={list} onKeyDown={onKey}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`${idBase}-tab-${t.key}`}
            aria-controls={`${idBase}-panel-${t.key}`}
            aria-selected={tab === t.key}
            tabIndex={tab === t.key ? 0 : -1}
            data-tab={t.key}
            data-state={tab === t.key ? 'active' : 'inactive'}
            className="dy-irp-tab"
            onClick={() => setChosen(t.key)}
          >
            {t.label?.value ? <Text field={t.label} /> : t.fallback}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.key}
          role="tabpanel"
          id={`${idBase}-panel-${t.key}`}
          aria-labelledby={`${idBase}-tab-${t.key}`}
          hidden={tab !== t.key}
          tabIndex={0}
          className="dy-irp-tabpanel"
        >
          <EventList items={t.items} empty={t.empty} emptyLink={t.link} />
        </div>
      ))}
    </div>
  );
}
