// Consolidated V2 — Investors overview. Revised from the October 26, 2026
// review of the original Consolidated page: photography leads (hero, results
// band, report covers, closing band), the results metrics and package sit on
// rules instead of boxes, and featured reports carry a cover preview slot.
//
// Revised again from the Investors page review of November 11, 2026:
// "Latest financial results" heading with the quarter beneath it, no section
// numbers (headings or jump bar), a brand-film band after the hero, Events
// (Upcoming / Past tabs) and News above Featured reports, the call replay
// copy cut to one sentence, the resources block retitled "Investor resources"
// without its News & events column, and white space before the footer.
import { useState, type KeyboardEvent } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { ArrowRight, FileText } from 'lucide-react';
import { SiteHeader } from './components/SiteHeader';
import { RolesDrawer } from './components/RolesDrawer';
import { BrandFilm, SiteFooter } from './components/sections';
import { Action, Signal, SiteLink } from './components/primitives';
import { emptyFilters, type Filters } from './jobs';
import { useMotionPreference } from './motion';
import { company, events, featuredReports, investorGroup, investorPages, news, quarter, type EventItem } from './investors';
import { photoProps, type PhotoId } from './photos';
import { V2_BASE as BASE } from './site';
import { usePageEffects } from '@/lib/router';
import './_group.css';
import './ConsolidatedV2.css';
import './investors-v2.css';

const sections: [href: string, label: string][] = [
  ['#results', 'Results'],
  ['#events', 'Events'],
  ['#news', 'News'],
  ['#reports', 'Reports'],
  ['#resources', 'Resources'],
];

/** The page omits the News & events column of the Investors menu: Events and News have their own sections above. */
const resourceColumns = investorGroup.columns.filter((col) => col.title !== 'News & events');

/** Events split by date at render time, so a past event is never advertised as upcoming. */
function splitEvents(all: EventItem[], now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return { upcoming: all.filter((e) => e.iso >= today).sort((a, b) => a.iso.localeCompare(b.iso)), past: all.filter((e) => e.iso < today) };
}

// Cover previews: Dycom photography stands in until each report's published
// cover artwork is supplied; the slot is sized for a portrait cover.
const reportCovers: Record<string, PhotoId> = {
  'investor-presentation': 'z9a_5195',
  'annual-report': 'z9b_2139',
  'proxy-statement': 'z9b_1711',
};

function SectionHead({ id, title, sub, note }: { id: string; title: string; sub?: string; note?: string }) {
  return (
    <div className="dycom-c5__irp-head">
      <div>
        <h2 id={id}>{title}</h2>
        {sub && <span className="dycom-c5__irp-sub">{sub}</span>}
      </div>
      {note && <p>{note}</p>}
    </div>
  );
}

function EventList({ items, empty }: { items: EventItem[]; empty: string }) {
  if (!items.length) return <p className="dycom-c5__irp-empty">{empty}</p>;
  return (
    <ol className="dycom-c5__irp-timeline">
      {items.map((e) => (
        <li key={e.id}>
          <time dateTime={e.iso}>{e.date}{e.time ? ` · ${e.time}` : ''}</time>
          <strong>{e.title}</strong>
          {e.webcast && <SiteLink href={investorPages.events} className="dycom-c5__text-link">Webcast</SiteLink>}
        </li>
      ))}
    </ol>
  );
}

/** Upcoming / Past tabs (reviewer request). Both panels stay mounted (hidden when inactive) so in-page search still finds past events. */
function EventTabs() {
  const { upcoming, past } = splitEvents(events);
  const [tab, setTab] = useState<'upcoming' | 'past'>(upcoming.length ? 'upcoming' : 'past');
  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next = tab === 'upcoming' ? 'past' : 'upcoming';
    setTab(next);
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-value="${next}"]`)?.focus();
  };
  return (
    <Tabs.Root value={tab} onValueChange={(v) => setTab(v as 'upcoming' | 'past')} className="dycom-c5__irp-tabs">
      <Tabs.List aria-label="Events" className="dycom-c5__irp-tablist" onKeyDown={onKey}>
        <Tabs.Trigger value="upcoming" data-value="upcoming" className="dycom-c5__irp-tab">Upcoming</Tabs.Trigger>
        <Tabs.Trigger value="past" data-value="past" className="dycom-c5__irp-tab">Past</Tabs.Trigger>
      </Tabs.List>
      <div className="dycom-c5__irp-tabpanels">
        <Tabs.Content value="upcoming" forceMount className="dycom-c5__irp-tabpanel"><EventList items={upcoming} empty="No upcoming events are scheduled. Sign up for email alerts to hear about the next one." /></Tabs.Content>
        <Tabs.Content value="past" forceMount className="dycom-c5__irp-tabpanel"><EventList items={past} empty="No past events to show." /></Tabs.Content>
      </div>
    </Tabs.Root>
  );
}

export default function Investors() {
  const [motionOff, setMotionOff] = useMotionPreference();
  const [rolesOpen, setRolesOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  usePageEffects('investors');

  return (
    <main className="dycom-c5 dycom-consolidated-v2 dycom-c5__irp" data-motion={motionOff ? 'off' : 'on'}>
      <SiteHeader homeHref={BASE} onJobs={() => { setFilters(emptyFilters); setRolesOpen(true); }} />

      <section className="dycom-c5__irp-hero dycom-c5__dark dycom-c5__irp-photo" aria-labelledby="irp-title">
        <img {...photoProps('z9b_6665', '100vw', 'Fiber patch cables plugged into a lit network rack')} />
        <div className="dycom-c5__irp-hero-grid">
          <div className="dycom-c5__irp-hero-copy">
            <a href={BASE} className="dycom-c5__irp-back"><ArrowRight size={16} aria-hidden="true" />Dycom home</a>
            <h1 id="irp-title">Investors</h1>
            <p>{company.overview}</p>
          </div>
          <div className="dycom-c5__irp-listing">
            <Signal />
            <small>Listed</small>
            <strong>{company.listing}</strong>
            <p>{company.scale}</p>
          </div>
        </div>
        <nav className="dycom-c5__irp-jumps" aria-label="On this page">
          {sections.map(([href, label]) => (
            <a href={href} key={href}><span>{label}</span><ArrowRight size={18} aria-hidden="true" /></a>
          ))}
        </nav>
      </section>

      <section id="results" className="dycom-c5__section" aria-labelledby="irp-results">
        <SectionHead id="irp-results" title={quarter.heading} sub={quarter.short} note={quarter.note} />
        <div className="dycom-c5__irp-band dycom-c5__dark">
          <img loading="lazy" {...photoProps('z9a_0525', '100vw', 'Green laser level lines crossing a data center floor')} />
          <dl className="dycom-c5__irp-metrics">
            {quarter.metrics.map((m) => (
              <div key={m.id}>
                <dt>{m.label}</dt>
                <dd><strong>{m.value}</strong><span>{m.unit}</span></dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="dycom-c5__irp-package">
          <ul className="dycom-c5__irp-docs" aria-label={`${quarter.short} results package`}>
            {quarter.documents.map((d) => (
              <li key={d.id}>
                <SiteLink href={investorPages.quarterly} arrow={false}>
                  <FileText size={22} aria-hidden="true" />
                  <span><strong>{d.title}</strong><small>{d.kind}</small></span>
                  <ArrowRight size={18} aria-hidden="true" />
                </SiteLink>
              </li>
            ))}
          </ul>
          <div className="dycom-c5__irp-call">
            <Signal />
            <h3>Results call replay</h3>
            <p>Held {quarter.published}, {quarter.callTime}.</p>
            <div className="dycom-c5__actions">
              <Action href={investorPages.events}>Open the event</Action>
              <Action outline href={investorPages.news}>Results release</Action>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are and what we do, as film (reviewer request): the brand film band shared with the homepage, after the
          results so the page still opens on the numbers and no two dark bands sit together. */}
      <BrandFilm motionOff={motionOff} />

      <section id="events" className="dycom-c5__section dycom-c5__paper" aria-labelledby="irp-events">
        <div className="dycom-c5__irp-columns">
          <div>
            <SectionHead id="irp-events" title="Events" />
            <EventTabs />
            <Action href={investorPages.events}>All events & presentations</Action>
          </div>
          <div id="news">
            <SectionHead id="irp-news" title="Investor news" />
            <ul className="dycom-c5__irp-news">
              {news.map((n) => (
                <li key={n.id}>
                  <SiteLink href={investorPages.news} arrow={false}>
                    <span><time dateTime={n.iso}>{n.date}</time><strong>{n.title}</strong></span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </SiteLink>
                </li>
              ))}
            </ul>
            <Action href={investorPages.news}>All investor news</Action>
          </div>
        </div>
      </section>

      <section id="reports" className="dycom-c5__section" aria-labelledby="irp-reports">
        <SectionHead id="irp-reports" title="Featured reports" note="Each report can carry a cover preview. Dycom photography stands in until the published cover artwork is supplied." />
        <div className="dycom-c5__irp-reports">
          {featuredReports.map((r) => (
            <article key={r.id} className="dycom-c5__irp-report">
              <div className="dycom-c5__irp-cover" aria-hidden="true">
                <img loading="lazy" {...photoProps(reportCovers[r.id], '(max-width: 767px) 100vw, 30vw', '')} />
                <span className="dycom-c5__irp-cover-plate"><Signal /><span>{r.title}</span></span>
              </div>
              <small>{r.label}</small>
              <h3>{r.title}</h3>
              <p>{r.detail}</p>
              <Action outline href={r.href}>Open report</Action>
            </article>
          ))}
        </div>
      </section>

      <section id="resources" className="dycom-c5__section dycom-c5__paper" aria-labelledby="irp-resources">
        <SectionHead id="irp-resources" title="Investor resources" note="Filings, governance and shareholder resources, in one place." />
        <div className="dycom-c5__resources">
          {resourceColumns.map((col) => (
            <div key={col.title}>
              <h3>{col.title}</h3>
              {col.links.map(([label, href]) => <SiteLink href={href} key={label}>{label}</SiteLink>)}
            </div>
          ))}
        </div>
      </section>

      <section className="dycom-c5__section dycom-c5__irp-close dycom-c5__dark dycom-c5__irp-photo" aria-labelledby="irp-close">
        <img loading="lazy" {...photoProps('z9a_4064', '100vw', 'Braided river and snow-capped mountains under a clouded sky')} />
        <div>
          <h2 id="irp-close">Stay informed.</h2>
          <p>Sign up for email alerts on results, filings and events, or reach the Investor Relations team directly.</p>
        </div>
        <div className="dycom-c5__actions">
          <Action inverse href={investorPages.alerts}>Email alerts</Action>
          <Action inverse outline href={investorPages.contact}>Contact Investor Relations</Action>
        </div>
      </section>

      <SiteFooter homeHref={BASE} motionOff={motionOff} onToggleMotion={() => setMotionOff((v) => !v)} />
      <RolesDrawer open={rolesOpen} onClose={() => setRolesOpen(false)} filters={filters} update={(patch) => setFilters((f) => ({ ...f, ...patch }))} />
    </main>
  );
}
