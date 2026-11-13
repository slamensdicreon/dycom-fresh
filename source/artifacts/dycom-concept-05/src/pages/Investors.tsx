// Investors overview (docs/dycom-concept-05-requirements.md §6, IRP-*).
// Structure follows Concept 02's Investors page — the reviewers' favourite
// investors layout (#52, #23) — rebuilt on the Concept 05 system: Civic Blue
// leads, Signal Green accents, square corners, buttons instead of small text
// links (#43 #44), no outward links, no invented cover artwork.
import { useState } from 'react';
import { SiteHeader, RolesDrawer, SiteFooter, Action, Signal, SiteLink, emptyFilters, type Filters, useMotionPreference, company, events, featuredReports, investorGroup, investorPages, news, quarter } from '@workspace/dycom-brand';
import { ArrowRight, FileText } from 'lucide-react';
import { BASE, usePageEffects } from '@/lib/router';

const sections: [href: string, label: string][] = [
  ['#results', 'Results'],
  ['#reports', 'Reports'],
  ['#events', 'Events'],
  ['#news', 'News'],
  ['#resources', 'Resources'],
];

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
    <main className="dycom-c5 dycom-c5__irp" data-motion={motionOff ? 'off' : 'on'}>
      <SiteHeader homeHref={BASE} onJobs={() => { setFilters(emptyFilters); setRolesOpen(true); }} />

      <section className="dycom-c5__irp-hero dycom-c5__dark" aria-labelledby="irp-title">
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
        <dl className="dycom-c5__irp-metrics">
          {quarter.metrics.map((m, i) => (
            <div key={m.id} style={{ ['--i' as string]: i }}>
              <dt>{m.label}</dt>
              <dd><strong>{m.value}</strong><span>{m.unit}</span></dd>
            </div>
          ))}
        </dl>
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
          <div className="dycom-c5__irp-call dycom-c5__dark">
            <Signal />
            <h3>Results call replay</h3>
            <p>Held {quarter.published}, {quarter.callTime}. The webcast replay, slides and transcript are kept with the event.</p>
            <div className="dycom-c5__actions">
              <Action inverse href={investorPages.events}>Open the event</Action>
              <Action inverse outline href={investorPages.news}>Results release</Action>
            </div>
          </div>
        </div>
      </section>

      <section id="reports" className="dycom-c5__section dycom-c5__paper" aria-labelledby="irp-reports">
        <SectionHead index="02" id="irp-reports" title="Featured reports" note="The annual report and proxy statement are labeled by reporting year; the investor presentation by the date it was given." />
        <div className="dycom-c5__irp-reports">
          {featuredReports.map((r, i) => (
            <article key={r.id} className={i === 0 ? 'dycom-c5__irp-report dycom-c5__irp-report--lead dycom-c5__dark' : 'dycom-c5__irp-report'}>
              <small>{r.label}</small>
              <h3>{r.title}</h3>
              <p>{r.detail}</p>
              <Action inverse={i === 0} outline={i !== 0} href={r.href}>Open report</Action>
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

      <section className="dycom-c5__section dycom-c5__irp-close dycom-c5__dark" aria-labelledby="irp-close">
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
