import { useEffect, useRef, useState, type CSSProperties } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Menu } from 'lucide-react';
import { Action, IconButton, Modal, SiteLink } from './primitives';
import { asset } from '../content';
import { navGroups } from '../site';

/** `homeHref` is `#top` on the homepage and the site root elsewhere. */
export function SiteHeader({ onJobs, homeHref = '#top' }: { onJobs: () => void; homeHref?: string }) {
  const [group, setGroup] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!header.current?.contains(e.target as Node)) setGroup(null); };
    document.addEventListener('click', close);
    const viewport = window.matchMedia('(min-width: 1100px)');
    const onResize = () => { if (viewport.matches) setMobile(false); };
    viewport.addEventListener('change', onResize);
    return () => { document.removeEventListener('click', close); viewport.removeEventListener('change', onResize); };
  }, []);
  return (
    <header
      ref={header}
      className="dycom-c5__header"
      onKeyDown={(e) => {
        if (e.key === 'Escape') { setGroup(null); header.current?.querySelector<HTMLButtonElement>('[aria-expanded="true"]')?.focus(); }
      }}
    >
      <a href={homeHref} className="dycom-c5__brand" aria-label="Dycom home"><img src={asset('logo-light.png')} alt="Dycom" width="144" /></a>
      <nav className="dycom-c5__desktop-nav" aria-label="Main navigation">
        {navGroups.map((g, i) => (
          <div className="dycom-c5__nav-group" key={g.label}>
            <button
              type="button"
              className="dycom-c5__nav-trigger"
              aria-expanded={group === i}
              aria-controls={`c5-menu-${i}`}
              onClick={() => setGroup(group === i ? null : i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setGroup(i); requestAnimationFrame(() => document.querySelector<HTMLAnchorElement>(`#c5-menu-${i} a`)?.focus()); }
              }}
            >
              {g.label}<ChevronDown className="dycom-c5__chevron" aria-hidden="true" />
            </button>
            {group === i && (
              <div id={`c5-menu-${i}`} className="dycom-c5__mega" style={{ '--c5-mega-cols': g.columns.length } as CSSProperties}>
                <div className="dycom-c5__mega-intro"><h3>{g.intro}</h3><p>{g.description}</p><SiteLink href={g.root} className="dycom-c5__text-link" onClick={() => setGroup(null)}>{g.overview}</SiteLink></div>
                {g.columns.map((col) => (
                  <div className="dycom-c5__mega-links" key={col.title}>
                    <h4>{col.title}</h4>
                    {col.links.map(([label, href]) => <SiteLink key={label} href={href} arrow={false} onClick={() => setGroup(null)}>{label}</SiteLink>)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="dycom-c5__header-job"><Action onClick={onJobs}>Find a job</Action></div>
      <IconButton className="dycom-c5__mobile-trigger" label="Open navigation" onClick={() => setMobile(true)}><Menu /></IconButton>
      <Modal open={mobile} onClose={() => setMobile(false)} title="menu" heading={<img src={asset('logo-light.png')} alt="Dycom menu" width="144" />} id="c5-mobile-nav" drawer variant="nav">
        <nav className="dycom-c5__mobile-nav" aria-label="Mobile navigation">
          <Action onClick={() => { setMobile(false); requestAnimationFrame(onJobs); }}>Find a job</Action>
          {/* Groups go straight to their link columns on mobile — no intro, description or overview link (user direction, Oct 22 2026). */}
          <Accordion.Root type="single" collapsible className="dycom-c5__accordion">
            {navGroups.map((g, i) => (
              <Accordion.Item value={String(i)} key={g.label} className="dycom-c5__accordion-item">
                <Accordion.Header className="dycom-c5__accordion-head">
                  <Accordion.Trigger className="dycom-c5__accordion-trigger">{g.label}<ChevronDown className="dycom-c5__chevron" aria-hidden="true" /></Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="dycom-c5__accordion-content">
                  {g.columns.map((col) => (
                    <div className="dycom-c5__mobile-col" key={col.title}>
                      <h4>{col.title}</h4>
                      {col.links.map(([label, href]) => <SiteLink key={label} href={href} arrow={false} onClick={() => setMobile(false)}>{label}</SiteLink>)}
                    </div>
                  ))}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </nav>
      </Modal>
    </header>
  );
}
