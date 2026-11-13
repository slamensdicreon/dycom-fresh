import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Company } from '@workspace/dycom-network-map/companies';
import { Action, Signal, SiteLink } from './primitives';
import { footerColumns, utilityLinks } from '../site';
import { CompanyNetwork } from './CompanyNetwork';
import { photoProps } from '../photos';
import { INVESTORS, asset, facts, intents, investorTiles, page, pathways, resources, services, stages, trades, values, type Intent } from '../content';
import type { Filters } from '../jobs';

/** Vertical arrow keys move between stacked tabs; Radix handles the horizontal pair. */
function nextTabKey(e: KeyboardEvent<HTMLElement>, ids: string[], active: string, setActive: (id: string) => void) {
  const direction = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
  if (!direction) return;
  e.preventDefault();
  const next = ids[(ids.indexOf(active) + direction + ids.length) % ids.length];
  setActive(next);
  e.currentTarget.querySelector<HTMLButtonElement>(`[data-value="${next}"]`)?.focus();
}

/** Mobile tab strips scroll horizontally; keep the active trigger centred when it changes (no-op when the strip does not overflow). */
function useCentredTrigger<T extends HTMLElement>(active: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const list = ref.current;
    const el = list?.querySelector<HTMLElement>(`[data-value="${active}"]`);
    if (!list || !el || list.scrollWidth <= list.clientWidth) return;
    const reduce = list.closest('[data-motion="off"]') !== null;
    list.scrollTo({ left: el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
  }, [active]);
  return ref;
}

export function Pathways() {
  return (
    <section id="pathways" className="dycom-c5__pathways" aria-label="Choose your path">
      {pathways.map(([label, detail, href]) => (
        <a href={href} key={label} className="dycom-c5__pathway"><span>{label}<ArrowRight size={20} aria-hidden="true" /></span><p>{detail}</p></a>
      ))}
    </section>
  );
}

export function WhoWeAre() {
  return (
    <section id="who-we-are" className="dycom-c5__section dycom-c5__who">
      <div><h2>The people<br />connecting America.</h2><img loading="lazy" {...photoProps('z9b_2679', '(min-width: 768px) 520px, 100vw', 'Three crew members from a Dycom company sharing a laugh on site')} /></div>
      <div className="dycom-c5__who-copy">
        <Signal />
        <p>Incorporated in 1969, Dycom provides specialty contracting services for telecommunications infrastructure and utilities. More than 20,000 employees work through operating companies with their own names and local relationships, united by a purpose: connecting America.</p>
        <ul className="dycom-c5__facts" aria-label="Dycom at a glance">{facts.map(([value, label]) => <li key={label}><strong>{value}</strong><span>{label}</span></li>)}</ul>
        <div id="values"><h3>Six values. One Dycom.</h3><p className="dycom-c5__values">{values.map((v) => <span key={v}>{v}</span>)}</p></div>
        <Action outline href={page('who-we-are')}>Get to know Dycom</Action>
      </div>
    </section>
  );
}

export function Companies({ onSelect, openRoles }: { onSelect: (c: Company) => void; openRoles: (patch?: Partial<Filters>) => void }) {
  return (
    <section id="companies" className="dycom-c5__section">
      <div className="dycom-c5__section-heading">
        <h2>Scale is local.<br />Capability is national.</h2>
        <p>Dycom brings together operating companies serving telecommunications infrastructure and utility customers across the United States. Select a home office to meet a company; office locations do not define service territories or capabilities.</p>
      </div>
      <CompanyNetwork onSelect={onSelect} onRoles={(id) => openRoles({ companyId: id })} />
    </section>
  );
}

export function WhatWeDo() {
  const [service, setService] = useState('plan');
  const [stage, setStage] = useState('0');
  const serviceList = useCentredTrigger<HTMLDivElement>(service);
  const stageList = useCentredTrigger<HTMLDivElement>(stage);
  const currentStage = Number(stage);
  return (
    <section id="what-we-do" className="dycom-c5__section dycom-c5__paper">
      <div className="dycom-c5__section-heading">
        <h2>Local expertise.<br />Every step of the way.</h2>
        <p>From the first route survey to the connections people use every day, our companies bring the right skills to each stage.</p>
      </div>
      <Tabs.Root value={service} onValueChange={setService}>
        <Tabs.List ref={serviceList} aria-label="Our capabilities" className="dycom-c5__service-tabs" onKeyDown={(e) => nextTabKey(e, services.map((s) => s.id), service, setService)}>
          {services.map((s) => <Tabs.Trigger className="dycom-c5__service-tab" key={s.id} value={s.id} data-value={s.id}><span>{s.number}</span>{s.label}</Tabs.Trigger>)}
        </Tabs.List>
        {/* WORK-F4 (#106 #103): all panels stay mounted and stacked so the block keeps one height */}
        <div className="dycom-c5__panel-stack">
        {services.map((s) => (
          <Tabs.Content key={s.id} value={s.id} forceMount className="dycom-c5__service-panel">
            <img loading="lazy" {...photoProps(s.image, '(min-width: 1024px) 40vw, 100vw', s.alt)} />
            <div>
              <h3>{s.title}</h3>
              <p>{s.copy}</p>
              <ul className="dycom-c5__check-list">{s.tags.map((t) => <li key={t}><Signal />{t}</li>)}</ul>
              <div className="dycom-c5__related"><strong>Related services</strong><div>{s.related.map(([label, path]) => <SiteLink key={path} href={page(`what-we-do/${path}`)}>{label}</SiteLink>)}</div></div>
              <Action href="#careers">Explore the trades</Action>
            </div>
          </Tabs.Content>
        ))}
        </div>
      </Tabs.Root>
      <div id="lifecycle" className="dycom-c5__lifecycle">
        <div className="dycom-c5__lifecycle-head"><h3>From survey to service.</h3><p>A typical network project connects these stages across teams. Select a stop to follow the work; services vary by company and project.</p></div>
        <Tabs.Root value={stage} onValueChange={setStage}>
          <Tabs.List ref={stageList} className="dycom-c5__route-track" aria-label="Stages of a local job" onKeyDown={(e) => nextTabKey(e, stages.map((_, i) => String(i)), stage, setStage)}>
            {stages.map((s, i) => <Tabs.Trigger key={s.title} value={String(i)} data-value={String(i)} className="dycom-c5__route-stop"><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</Tabs.Trigger>)}
          </Tabs.List>
          <div className="dycom-c5__panel-stack">
          {stages.map((s, i) => (
            <Tabs.Content key={s.title} value={String(i)} forceMount className="dycom-c5__route-panel">
              <img loading="lazy" {...photoProps(s.image, '(min-width: 1024px) 45vw, 100vw', s.alt)} />
              <div className="dycom-c5__route-copy">
                <span className="dycom-c5__route-eyebrow">Stage {String(i + 1).padStart(2, '0')} of {String(stages.length).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="dycom-c5__route-services"><span>Services involved</span><ul>{s.services.map((label) => <li key={label}>{label}</li>)}</ul></div>
                <div className="dycom-c5__route-nav">
                  <button type="button" className="dycom-c5__button dycom-c5__button--outline" disabled={i === 0} onClick={() => setStage(String(currentStage - 1))}><ArrowLeft size={17} aria-hidden="true" />Previous</button>
                  <button type="button" className="dycom-c5__button dycom-c5__button--outline" disabled={i === stages.length - 1} onClick={() => setStage(String(currentStage + 1))}>Next<ArrowRight size={17} aria-hidden="true" /></button>
                </div>
              </div>
            </Tabs.Content>
          ))}
          </div>
        </Tabs.Root>
      </div>
    </section>
  );
}

export function HowWeWork() {
  return (
    <section id="how-we-work" className="dycom-c5__how">
      <div className="dycom-c5__how-copy">
        <h2>Skilled work.<br />Safe every day.</h2>
        <div><h3>Headway® safety</h3><p>Our safety management system engages people in recognizing and mitigating risks. Training starts at onboarding, with job-specific qualification training and field mentoring.</p></div>
        <div><h3>RIGHTWAY™ quality</h3><p>Our quality management system combines a structured approach and training to maintain and improve execution, understand customer needs and develop the skills to meet them.</p></div>
        <div className="dycom-c5__actions"><Action href={page('how-we-work/safety')}>Our approach to safety</Action><Action outline href={page('how-we-work/quality')}>Our approach to quality</Action></div>
      </div>
      <img loading="lazy" {...photoProps('z9b_1574', '(min-width: 1024px) 50vw, 100vw', 'Lineworker in safety glasses and a hard hat checking the line overhead')} />
    </section>
  );
}

export function Careers({ openRoles }: { openRoles: (patch?: Partial<Filters>) => void }) {
  return (
    <section id="careers" className="dycom-c5__section dycom-c5__careers dycom-c5__paper">
      <div className="dycom-c5__career-copy">
        <h2>Skilled people.<br />Work that<br />connects America.</h2>
        <p>Communications infrastructure takes skilled people. Explore opportunities across the Dycom family of companies, from planning and construction to maintenance and field work. On-the-job learning and online professional development help our people deepen their skills and prepare for future growth. Safety training includes task-specific qualifications and field mentoring.</p>
        <ul className="dycom-c5__check-list"><li><Signal />Put technical skills to work.</li><li><Signal />Build and maintain communications networks.</li><li><Signal />Connect homes, businesses, and communities.</li></ul>
        <div className="dycom-c5__actions"><Action onClick={() => openRoles()}>Browse open roles</Action><Action outline href={page('careers/life')}>Life at Dycom</Action></div>
        <ul className="dycom-c5__career-thumbs" aria-label="Kinds of work at Dycom companies">
          <li><img loading="lazy" {...photoProps('z9b_1407', '(min-width: 1024px) 15vw, 30vw', 'Lineworker’s tool belt with pliers, tape and wrenches')} /></li>
          <li><img loading="lazy" {...photoProps('z9b_7549', '(min-width: 1024px) 15vw, 30vw', 'Gloved hands splicing a bundle of copper conductors')} /></li>
          <li><img loading="lazy" {...photoProps('z9a_0445', '(min-width: 1024px) 15vw, 30vw', 'Warehouse worker checking a cable rack')} /></li>
        </ul>
      </div>
      <div id="trades" className="dycom-c5__trades">
        <h3>Find your kind of work.</h3>
        <p>Learn about communications trades and the questions to ask a hiring team.</p>
        {trades.map((t) => <button type="button" key={t.title} className="dycom-c5__trade" onClick={() => openRoles({ trade: t.trade })}><span><strong>{t.title}</strong><span>{t.body}</span></span><ArrowRight size={20} /></button>)}
      </div>
    </section>
  );
}

export function Investors() {
  return (
    <section id="investors" className="dycom-c5__section dycom-c5__investors dycom-c5__dark">
      <div className="dycom-c5__investor-copy">
        <Signal />
        <h2>Local expertise.<br />National scale.</h2>
        <p>Dycom Industries, Inc. (NYSE: DY) supplies the people, tools and equipment behind specialty contracting services. Our operating companies connect local field work to a national organization, serving customers in urban and rural America. Governance, ethical practices and transparency underpin that work.</p>
        <div className="dycom-c5__actions"><Action inverse href={INVESTORS}>Investors overview</Action><Action inverse outline href={page('investors/sec-filings')}>Financials & filings</Action></div>
      </div>
      <div className="dycom-c5__investor-tiles">
        {investorTiles.map(([title, copy, label, href]) => <article key={title}><h3>{title}</h3><p>{copy}</p><Action inverse outline href={href}>{label}</Action></article>)}
      </div>
    </section>
  );
}

export function ResourceCenter() {
  return (
    <section id="resources" className="dycom-c5__section dycom-c5__paper">
      <h2>Resource Center</h2>
      <div className="dycom-c5__resources">{resources.map((r) => <div key={r.group}><h3>{r.group}</h3>{r.items.map(([label, href]) => <SiteLink href={href} key={label}>{label}</SiteLink>)}</div>)}</div>
    </section>
  );
}

export function Closing({ selectedCompany, openRoles }: { selectedCompany: Company | null; openRoles: () => void }) {
  const [intent, setIntent] = useState<Intent>('customer');
  const selected = intents[intent];
  return (
    <section id="contact" className="dycom-c5__section dycom-c5__closing dycom-c5__dark">
      <div><h2>Let’s get<br />to work.</h2></div>
      <div>
        <h3>What brings you here?</h3>
        <ToggleGroup.Root type="single" value={intent} onValueChange={(v) => { if (v) setIntent(v as Intent); }} className="dycom-c5__intents" aria-label="Inquiry type">
          {(Object.keys(intents) as Intent[]).map((key) => <ToggleGroup.Item key={key} value={key}>{intents[key].label}</ToggleGroup.Item>)}
        </ToggleGroup.Root>
        <div className="dycom-c5__intent-panel" aria-live="polite">
          {intent === 'customer' && selectedCompany && <p><strong>Exploring {selectedCompany.name}?</strong> Include the company name with your project inquiry so the team can direct you.</p>}
          <p>{selected.route}</p>
          {selected.url ? <Action inverse href={selected.url}>{selected.action}</Action> : <Action inverse onClick={openRoles}>{selected.action}</Action>}
        </div>
      </div>
    </section>
  );
}

export function SiteFooter({ motionOff, onToggleMotion, homeHref = '#top' }: { motionOff: boolean; onToggleMotion: () => void; homeHref?: string }) {
  return (
    <footer className="dycom-c5__footer dycom-c5__dark">
      <div className="dycom-c5__footer-main">
        <div className="dycom-c5__footer-brand">
          <a href={homeHref} aria-label="Dycom home"><img src={asset('logo-white.webp')} width="150" alt="Dycom" /></a>
          <p>Behind the work<br />that connects America.</p>
        </div>
        <nav aria-label="Footer">{footerColumns.map((col) => <div key={col.title}><h3>{col.title}</h3>{col.links.map(([label, href]) => <SiteLink href={href} key={label} arrow={false}>{label}</SiteLink>)}</div>)}</nav>
      </div>
      <div className="dycom-c5__footer-utility">
        <span>© {new Date().getFullYear()} Dycom Industries, Inc.</span>
        {utilityLinks.map(([label, href]) => <SiteLink href={href} key={label} arrow={false}>{label}</SiteLink>)}
        <button type="button" aria-pressed={!motionOff} onClick={onToggleMotion}>Motion {motionOff ? 'off' : 'on'}</button>
      </div>
    </footer>
  );
}
