// Consolidated V2 — Investors overview. Revised from the October 26, 2026
// review of the original Consolidated page: photography leads (hero, results
// band, report covers, closing band), the results metrics and package sit on
// rules instead of boxes, and featured reports carry a cover preview slot.
import { useState } from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { SiteHeader } from './components/SiteHeader';
import { RolesDrawer } from './components/RolesDrawer';
import { SiteFooter } from './components/sections';
import { Action, Signal, SiteLink } from './components/primitives';
import { emptyFilters, type Filters } from './jobs';
import { useMotionPreference } from './motion';
import { company, events, featuredReports, investorGroup, investorPages, news, quarter } from './investors';
import { photoProps, type PhotoId } from './photos';
import { V2_BASE as BASE } from './site';
import { usePageEffects } from '@/lib/router';
import './_group.css';
import './ConsolidatedV2.css';
import './investors-v2.css';

const sections: [href: string, label: string][] = [
  ['#results', 'Results'],
  ['#reports', 'Reports'],
  ['#events', 'Events'],
  ['#news', 'News'],
  ['#resources', 'Resources'],
];

// Cover previews: Dycom photography stands in until each report's published
// cover artwork is supplied; the slot is sized for a portrait cover.
const reportCovers: Record<string, PhotoId> = {
  'investor-presentation': 'z9a_5195',
  'annual-report': 'z9b_2139',
  'proxy-statement': 'z9b_1711',
};

function SectionHead({ index, id, title, note }: { index: string; id: string; title: string; note?: string }) {
  return (
    <div className="dycom-c5__irp-head">
      <h2 id={id}><span className="dycom-c5__irp-index" aria-hidden="true">{index}</span>{title}</h2>
      {note && <p>{note}</p>}
    </div>
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
          {sections.map(([href, label], i) => (
            <a href={href} key={href}><span><small>0{i + 1}</small>{label}</span><ArrowRight size={18} aria-hidden="true" /></a>
          ))}
        </nav>
      </section>

      <section id="results" className="dycom-c5__section" aria-labelledby="irp-results">
        <SectionHead index="01" id="irp-results" title={`${quarter.short} results`} note={quarter.note} />
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
            <p>Held {quarter.published}, {quarter.callTime}. The webcast replay, slides and transcript are kept with the event.</p>
            <div className="dycom-c5__actions">
              <Action href={investorPages.events}>Open the event</Action>
              <Action outline href={investorPages.news}>Results release</Action>
            </div>
          </div>
        </div>
      </section>

      <section id="reports" className="dycom-c5__section dycom-c5__paper" aria-labelledby="irp-reports">
        <SectionHead index="02" id="irp-reports" title="Featured reports" note="Each report can carry a cover preview. Dycom photography stands in until the published cover artwork is supplied." />
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

      <section id="events" className="dycom-c5__section" aria-labelledby="irp-events">
        <div className="dycom-c5__irp-columns">
          <div>
            <SectionHead index="03" id="irp-events" title="Events" />
            <ol className="dycom-c5__irp-timeline">
              {events.map((e) => (
                <li key={e.id}>
                  <time dateTime={e.iso}>{e.date}{e.time ? ` · ${e.time}` : ''}</time>
                  <strong>{e.title}</strong>
                  {e.webcast && <SiteLink href={investorPages.events} className="dycom-c5__text-link">Webcast</SiteLink>}
                </li>
              ))}
            </ol>
            <Action href={investorPages.events}>All events & presentations</Action>
          </div>
          <div id="news">
            <SectionHead index="04" id="irp-news" title="Investor news" />
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

      <section id="resources" className="dycom-c5__section dycom-c5__paper" aria-labelledby="irp-resources">
        <SectionHead index="05" id="irp-resources" title="Filings, governance & shareholder resources" note="Every investor page of the site, in one place." />
        <div className="dycom-c5__resources">
          {investorGroup.columns.map((col) => (
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
