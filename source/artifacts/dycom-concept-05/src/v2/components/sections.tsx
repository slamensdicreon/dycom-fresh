import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as Accordion from '@radix-ui/react-accordion';
import { ArrowLeft, ArrowRight, ChevronDown, Play } from 'lucide-react';
import type { Company } from '@workspace/dycom-network-map/companies';
import { Action, Signal, SiteLink } from './primitives';
import { footerColumns, utilityLinks } from '../site';
import { CompanyNetwork } from './CompanyNetwork';
import { photoProps } from '../photos';
import { useParallax } from '../motion';
import { resolveJump } from '../presentation';
import { INVESTORS, asset, brandStatement, facts, film, intents, investorTiles, page, pathways, resources, services, stages, strengths, trades, whatWeBuild, type Intent, type IntentField } from '../content';
import { TRADES, type Filters, type Trade } from '../jobs';

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

export function Pathways({ openRoles }: { openRoles?: (patch?: Partial<Filters>) => void } = {}) {
  return (
    <section id="pathways" className="dycom-c5__pathways" aria-label="Choose your path">
      {pathways.map(([label, detail, href]) => {
        // A pathway to a chapter held back from the homepage goes to its stand-in instead (presentation.ts).
        const target = resolveJump(href);
        const toRoles = target === 'roles';
        return (
          <a href={toRoles ? '#top' : target} key={label} className="dycom-c5__pathway" onClick={toRoles ? (e) => { e.preventDefault(); openRoles?.(); } : undefined}>
            <span>{label}<ArrowRight size={20} aria-hidden="true" /></span><p>{detail}</p>
          </a>
        );
      })}
    </section>
  );
}

/** The four lines of work, shared by the Who we are chapter and the photographic band. */
function WorkList({ className }: { className: string }) {
  return (
    <ul className={className} aria-label="What we build">
      {whatWeBuild.items.map((c) => <li key={c.title}><strong>{c.title}</strong>{c.copy && <span>{c.copy}</span>}</li>)}
    </ul>
  );
}

export function WhoWeAre() {
  // Light chapter after the dark hero and pathway band. Only the number
  // call-out carries photography (client pin 140 preferred the Signal Works
  // numbers-over-image band); the chapter itself no longer repeats the hero.
  // The right column is What we build (client feedback, 5 Nov 2026: the work
  // belongs at the top of the page, not the values list).
  const numbers = useParallax<HTMLDivElement>();
  return (
    <section id="who-we-are" className="dycom-c5__section dycom-c5__paper dycom-c5__who-chapter">
      <div className="dycom-c5__who-grid">
        <div className="dycom-c5__who-intro"><span>Who we are</span><h2>The people<br />connecting America.</h2><p>Dycom delivers solutions that build, connect, power, and sustain the digital and critical infrastructure that connects America and its essential industries, for today and tomorrow. Our scale is local: we combine national reach and resources with the regional knowledge and expertise of our 40 operating companies to partner with our customers and execute complex work across the full project lifecycle.</p></div>
        <div id="what-we-build" className="dycom-c5__who-intro dycom-c5__work-block"><span>{whatWeBuild.eyebrow}</span><h2>{whatWeBuild.title}</h2><p>{whatWeBuild.copy}</p><WorkList className="dycom-c5__work-list" /></div>
      </div>
      <div ref={numbers} className="dycom-c5__who-numbers dycom-c5__dark dycom-c5__parallax">
        <img loading="lazy" {...photoProps('z9b_2679', '100vw', 'Three crew members from a Dycom company sharing a laugh on site')} />
        <ul className="dycom-c5__facts" aria-label="Dycom at a glance">{facts.map(([value, label]) => <li key={label}><strong>{value}</strong><span>{label}</span></li>)}</ul>
      </div>
    </section>
  );
}

/**
 * Brand video band (Dycom content v0.1): the packaged brand film has one home on
 * the page. It plays in place, muted until the visitor turns sound on; the poster,
 * eyebrow and caption return whenever it is paused or ends. Nothing autoplays.
 */
export function BrandFilm({ motionOff }: { motionOff: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => { if (motionOff) video.current?.pause(); }, [motionOff]);
  const play = () => {
    const el = video.current;
    if (!el) return;
    setStarted(true);
    el.play().catch(() => setPlaying(false));
  };
  return (
    <section id="film" className="dycom-c5__film" aria-labelledby="c5-film-title" data-started={started || undefined} data-playing={playing || undefined}>
      <video
        ref={video}
        src={started ? asset('brand-film.mp4') : undefined}
        poster={asset('film-poster.webp')}
        preload="none"
        playsInline
        muted
        controls={started}
        aria-label={film.caption}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <div className="dycom-c5__film-cover">
        <button type="button" className="dycom-c5__film-play" onClick={play} aria-describedby="c5-film-title"><Play aria-hidden="true" /><span>Play the film</span></button>
        <div className="dycom-c5__film-copy"><span className="dycom-c5__film-eyebrow">{film.eyebrow}</span><h2 id="c5-film-title">{film.caption}</h2></div>
      </div>
    </section>
  );
}

/** Four-card column (Dycom content v0.1): one photo card per strength, each leading to a site page. */
export function Strengths() {
  return (
    <section id="strengths" className="dycom-c5__section dycom-c5__strengths" aria-label="Operating strengths">
      <ul className="dycom-c5__strength-cards">
        {strengths.map((card) => (
          <li key={card.title} className="dycom-c5__strength-card">
            <img loading="lazy" {...photoProps(card.image, '(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw', card.alt)} />
            <div className="dycom-c5__strength-copy">
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
              <Action outline href={card.href}>{card.label}</Action>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Brand statement band (Dycom content v0.1): one sentence, set large, between the strengths and Who we build for. */
export function BrandStatement() {
  return (
    <section id="statement" className="dycom-c5__section dycom-c5__statement" aria-labelledby="c5-statement">
      <Signal />
      <p id="c5-statement">{brandStatement}</p>
    </section>
  );
}

export function Companies({ onSelect, openRoles }: { onSelect: (c: Company) => void; openRoles: (patch?: Partial<Filters>) => void }) {
  return (
    <section id="companies" className="dycom-c5__section dycom-c5__companies-section">
      <div className="dycom-c5__section-heading">
        <h2>Scale is local.<br />Capability is national.</h2>
        <p>Dycom’s family of companies have over 500 field offices across the U.S. Select a location below to learn more about area operating companies.</p>
      </div>
      <CompanyNetwork onSelect={onSelect} onRoles={(id) => openRoles({ companyId: id })} />
    </section>
  );
}

/** Phone layout flag; the capability and lifecycle tabs become in-place accordions below 768px. */
function usePhone() {
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => setPhone(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return phone;
}

const STAGE_SLUGS: Record<string, string> = { Engineering: 'engineering', 'Project management': 'project-management', 'Utility locating': 'locating', 'Wireline construction': 'wireline-construction', 'Wireless construction': 'wireless-construction', Fulfillment: 'fulfillment', Maintenance: 'maintenance-restoration', 'Emergency response': 'maintenance-restoration', 'Maintenance & restoration': 'maintenance-restoration' };

function ServiceBody({ s }: { s: (typeof services)[number] }) {
  return (
    <div>
      <h3>{s.title}</h3>
      <p>{s.copy}</p>
      <ul className="dycom-c5__check-list">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
      <div className="dycom-c5__related"><strong>Related services</strong><div>{s.related.map(([label, path]) => <SiteLink key={path} href={page(`what-we-do/${path}`)}>{label}</SiteLink>)}</div></div>
      <Action href="#careers">Explore the trades</Action>
    </div>
  );
}

function StageServices({ s }: { s: (typeof stages)[number] }) {
  return (
    <div className="dycom-c5__route-services"><span>Services involved</span><ul>{s.services.map((label) => (
      <li key={label}><SiteLink href={page(`what-we-do/${STAGE_SLUGS[label] ?? 'services'}`)} arrow={false}>{label}</SiteLink></li>
    ))}</ul></div>
  );
}

export function WhatWeDo() {
  const [service, setService] = useState('plan');
  const phone = usePhone();
  const serviceList = useCentredTrigger<HTMLDivElement>(service);
  return (
    <section id="what-we-do" className="dycom-c5__section dycom-c5__paper">
      <div className="dycom-c5__section-heading">
        <h2>Local expertise.<br />Every step of the way.</h2>
        <p>From the first route survey to the connections people use every day, our companies bring the right skills to each stage.</p>
      </div>
      {phone ? (
        <Accordion.Root type="single" collapsible value={service} onValueChange={setService} className="dycom-c5__service-accordion">
          {services.map((s) => (
            <Accordion.Item key={s.id} value={s.id} className="dycom-c5__service-item">
              <Accordion.Header className="dycom-c5__accordion-head">
                <Accordion.Trigger className="dycom-c5__service-tab"><span>{s.number}</span>{s.label}<ChevronDown className="dycom-c5__chevron" aria-hidden="true" /></Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="dycom-c5__accordion-content">
                <div className="dycom-c5__service-panel">
                  <img loading="lazy" {...photoProps(s.image, '100vw', s.alt)} />
                  <ServiceBody s={s} />
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      ) : (
        <Tabs.Root value={service || 'plan'} onValueChange={setService}>
          <Tabs.List ref={serviceList} aria-label="Our capabilities" className="dycom-c5__service-tabs" onKeyDown={(e) => nextTabKey(e, services.map((s) => s.id), service, setService)}>
            {services.map((s) => <Tabs.Trigger className="dycom-c5__service-tab" key={s.id} value={s.id} data-value={s.id}><span>{s.number}</span>{s.label}</Tabs.Trigger>)}
          </Tabs.List>
          {/* WORK-F4 (#106 #103): all panels stay mounted and stacked so the block keeps one height */}
          <div className="dycom-c5__panel-stack">
          {services.map((s) => (
            <Tabs.Content key={s.id} value={s.id} forceMount className="dycom-c5__service-panel">
              <img loading="lazy" {...photoProps(s.image, '(min-width: 1024px) 40vw, 100vw', s.alt)} />
              <ServiceBody s={s} />
            </Tabs.Content>
          ))}
          </div>
        </Tabs.Root>
      )}
    </section>
  );
}

/**
 * Photographic band carrying What we build between the brand statement and the
 * project lifecycle. Held back from the homepage (client pin 177, 5 Nov 2026;
 * confirmed by the user 6 Nov 2026): the work opens the page beside Who we are.
 * The pattern stays built and documented.
 */
export function WhoWeBuildFor() {
  const band = useParallax<HTMLElement>();
  return (
    <section ref={band} id="customers" className="dycom-c5__customers dycom-c5__parallax" aria-labelledby="c5-customers-title">
      <img loading="lazy" {...photoProps('z9b_6533', '100vw', 'Sorghum heads in front of a small-town main street')} />
      <div className="dycom-c5__customers-inner">
        <div className="dycom-c5__customers-copy">
          <span className="dycom-c5__customers-eyebrow">{whatWeBuild.eyebrow}</span>
          <h2 id="c5-customers-title">{whatWeBuild.title}</h2>
          <p>{whatWeBuild.copy}</p>
        </div>
        <WorkList className="dycom-c5__customer-list" />
      </div>
    </section>
  );
}

export function Lifecycle() {
  const [stage, setStage] = useState('0');
  const phone = usePhone();
  const stageList = useCentredTrigger<HTMLDivElement>(stage);
  const currentStage = Number(stage);
  const lastStage = stages.length - 1;
  // On phones, open the next step and bring its header into view.
  const openStage = (index: number) => {
    setStage(String(index));
    requestAnimationFrame(() => document.getElementById(`c5-stage-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  return (
    <section id="lifecycle" className="dycom-c5__section dycom-c5__lifecycle">
        <div className="dycom-c5__section-heading"><h2>Expertise for the<br />entire lifecycle</h2><p>Dycom provides the scale to manage your entire infrastructure lifecycle and the agility to deploy specialized services at any stage. We take full ownership of our delivery, ensuring our work integrates seamlessly into your broader project goals.</p></div>
        {phone ? (
          <Accordion.Root type="single" collapsible value={stage} onValueChange={setStage} className="dycom-c5__route-accordion" aria-label="Stages of a local job">
            {stages.map((s, i) => (
              <Accordion.Item key={s.title} value={String(i)} className="dycom-c5__route-item" id={`c5-stage-${i}`}>
                <Accordion.Header className="dycom-c5__accordion-head">
                  <Accordion.Trigger className="dycom-c5__route-stop"><span>{String(i + 1).padStart(2, '0')}</span>{s.title}<ChevronDown className="dycom-c5__chevron" aria-hidden="true" /></Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="dycom-c5__accordion-content">
                  <div className="dycom-c5__route-panel">
                    <img loading="lazy" {...photoProps(s.image, '100vw', s.alt)} />
                    <div className="dycom-c5__route-copy">
                      <p>{s.body}</p>
                      <StageServices s={s} />
                      {i < lastStage && <button type="button" className="dycom-c5__text-link dycom-c5__route-next" onClick={() => openStage(i + 1)}>Next: {stages[i + 1].title}<ArrowRight size={17} aria-hidden="true" /></button>}
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        ) : (
          <Tabs.Root value={stage || '0'} onValueChange={setStage}>
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
                  <StageServices s={s} />
                  <div className="dycom-c5__route-nav">
                    <button type="button" className="dycom-c5__button dycom-c5__button--outline" disabled={i === 0} onClick={() => setStage(String(currentStage - 1))}><ArrowLeft size={17} aria-hidden="true" />Previous</button>
                    <button type="button" className="dycom-c5__button dycom-c5__button--outline" disabled={i === lastStage} onClick={() => setStage(String(currentStage + 1))}>Next<ArrowRight size={17} aria-hidden="true" /></button>
                  </div>
                </div>
              </Tabs.Content>
            ))}
            </div>
          </Tabs.Root>
        )}
    </section>
  );
}

export function HowWeWork() {
  return (
    <section id="how-we-work" className="dycom-c5__how">
      <div className="dycom-c5__how-copy">
        <h2>Skilled work.<br />Safe every day.</h2>
        <div><h3>Headway® safety</h3><p>Our safety management system engages people in recognizing and mitigating risks. Training starts at onboarding, with job-specific qualification training and field mentoring.</p></div>
        <div><h3>Rightway™ quality</h3><p>Our quality management system combines a structured approach and training to maintain and improve execution, understand customer needs and develop the skills to meet them.</p></div>
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
         <ul className="dycom-c5__check-list"><li>Put technical skills to work.</li><li>Build and maintain communications networks.</li><li>Connect homes, businesses, and communities.</li></ul>
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

function IntentFieldInput({ field, defaultValue }: { field: IntentField; defaultValue?: string }) {
  const className = `dycom-c5__field${field.full ? ' dycom-c5__field--full' : ''}`;
  const common = { name: field.name, required: !field.optional, autoComplete: field.autoComplete, placeholder: field.placeholder };
  const label = <>{field.label}{field.optional && <small>Optional</small>}</>;
  if (field.type === 'select') {
    return (
      <label className={`${className} dycom-c5__select-label`}>
        <span>{label}</span>
        <select {...common} defaultValue=""><option value="" disabled>Select one</option>{field.options?.map((o) => <option key={o}>{o}</option>)}</select>
        <ChevronDown className="dycom-c5__chevron" aria-hidden="true" />
      </label>
    );
  }
  if (field.type === 'textarea') return <label className={className}><span>{label}</span><textarea {...common} rows={3} defaultValue={defaultValue} /></label>;
  return <label className={className}><span>{label}</span><input {...common} type={field.type ?? 'text'} /></label>;
}

const tradeOf = (value: FormDataEntryValue | null): Trade | '' => (TRADES.some((t) => t.name === value) ? (value as Trade) : '');

export function Closing({ selectedCompany, openRoles }: { selectedCompany: Company | null; openRoles: (patch?: Partial<Filters>) => void }) {
  const [intent, setIntent] = useState<Intent>('customer');
  const selected = intents[intent];
  const [sent, setSent] = useState<string | null>(null);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (intent === 'careers') { openRoles({ trade: tradeOf(data.get('trade')), location: String(data.get('location') ?? '') }); return; }
    setSent(String(data.get('name') ?? '').trim());
  };
  return (
    <section id="contact" className="dycom-c5__section dycom-c5__closing dycom-c5__dark">
      <div><h2>Let’s get<br />to work.</h2></div>
      <div>
        <h3>What brings you here?</h3>
        <ToggleGroup.Root type="single" value={intent} onValueChange={(v) => { if (v) { setIntent(v as Intent); setSent(null); } }} className="dycom-c5__intents" aria-label="Inquiry type">
          {(Object.keys(intents) as Intent[]).map((key) => <ToggleGroup.Item key={key} value={key}>{intents[key].label}</ToggleGroup.Item>)}
        </ToggleGroup.Root>
        <div className="dycom-c5__intent-panel" aria-live="polite">
          {sent !== null ? (
            <div className="dycom-c5__sent" role="status">
              <Signal />
              <h4>Thank you{sent ? `, ${sent}` : ''}.</h4>
              <p>Your inquiry is with the right team. We’ll follow up at the email address you provided.</p>
              <button type="button" className="dycom-c5__text-link" onClick={() => setSent(null)}>Send another inquiry</button>
            </div>
          ) : (
            <>
              {intent === 'customer' && selectedCompany && <p><strong>Exploring {selectedCompany.name}?</strong> Include the company name with your project inquiry so the team can direct you.</p>}
              <p>{selected.route}</p>
              <form key={intent} className="dycom-c5__contact-form" onSubmit={submit}>
                {intent !== 'careers' && <>
                  <label className="dycom-c5__field"><span>Your name</span><input name="name" autoComplete="name" required /></label>
                  <label className="dycom-c5__field"><span>Email address</span><input name="email" type="email" autoComplete="email" required /></label>
                </>}
                {selected.fields.map((field) => <IntentFieldInput key={field.name} field={field} defaultValue={field.name === 'message' && intent === 'customer' && selectedCompany ? `I’m interested in ${selectedCompany.name}. ` : undefined} />)}
                <button type="submit" className="dycom-c5__button dycom-c5__button--inverse">{selected.action} <ArrowRight size={17} aria-hidden="true" /></button>
              </form>
            </>
          )}
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
          {/* The approved Dycom logo, reversed for the dark footer (user direction, 6 Nov 2026: the drawn signal + DYCOM lockup was not the approved logo; logo-reverse.png is logo-light.png with the wordmark in white). */}
          <a href={homeHref} aria-label="Dycom home" className="dycom-c5__footer-lockup"><img src={asset('logo-reverse.png')} alt="Dycom" width="144" /></a>
          <p>Behind the work<br />that connects America.</p>
        </div>
        <nav aria-label="Footer" className="dycom-c5__footer-columns">
          {footerColumns.map((col) => <div className="dycom-c5__footer-column" key={col.title}>
            <h3>{col.title}</h3>
            <div className="dycom-c5__footer-links">{col.links.map(([label, href]) => <SiteLink href={href} key={label} arrow={false}>{label}</SiteLink>)}</div>
          </div>)}
        </nav>
        <Accordion.Root type="multiple" className="dycom-c5__footer-accordion" aria-label="Footer sections">
          {footerColumns.map((col, index) => <Accordion.Item value={String(index)} key={col.title} className="dycom-c5__footer-accordion-item">
            <Accordion.Header><Accordion.Trigger className="dycom-c5__footer-accordion-trigger">{col.title}<ChevronDown aria-hidden="true" /></Accordion.Trigger></Accordion.Header>
            <Accordion.Content className="dycom-c5__footer-accordion-content">{col.links.map(([label, href]) => <SiteLink href={href} key={label} arrow={false}>{label}</SiteLink>)}</Accordion.Content>
          </Accordion.Item>)}
        </Accordion.Root>
      </div>
      <div className="dycom-c5__footer-utility">
        <span>© {new Date().getFullYear()} Dycom Industries, Inc.</span>
        {utilityLinks.map(([label, href]) => <SiteLink href={href} key={label} arrow={false}>{label}</SiteLink>)}
        <button type="button" aria-pressed={!motionOff} onClick={onToggleMotion}>Motion {motionOff ? 'off' : 'on'}</button>
      </div>
    </footer>
  );
}
