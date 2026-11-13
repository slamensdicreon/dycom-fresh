// Chrome and page template of the Design System: top bar, contents rail (or
// drawer), page head, example stages, token tables and do/don't rules.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, List, PanelLeft } from 'lucide-react';
import { BRAND_TOKENS, Modal, asset, readToken } from '@workspace/dycom-brand';
import { PAGES } from './catalog';
import { DS_BASE, EXPLORATIONS_PAGE, PAGE_SLUGS, dsHref, type DsGroup, type PageSlug } from './router';

export const GROUP_LABELS: Record<DsGroup, string> = { foundations: 'Foundations', components: 'Components', patterns: 'Patterns', templates: 'Templates', explorations: 'Undecided interactions' };

export function pagesIn(group: DsGroup): PageSlug[] {
  return PAGE_SLUGS.filter((slug) => PAGES[slug].group === group);
}

function Contents({ current, onNavigate }: { current: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="dycom-ds__nav-group">
        <a href={DS_BASE} aria-current={current === '' ? 'page' : undefined} onClick={onNavigate}>Overview</a>
      </div>
      {(Object.keys(GROUP_LABELS) as DsGroup[]).map((group) => (
        <div className="dycom-ds__nav-group" key={group}>
          <h2>{GROUP_LABELS[group]}</h2>
          {pagesIn(group).map((slug) => {
            // Exploration pages nest under their index in the rail.
            const sub = slug.split('/').filter(Boolean).length > 2;
            return (
              <a key={slug} href={dsHref(slug)} className={sub ? 'dycom-ds__nav-sub' : undefined} aria-current={current === slug ? 'page' : undefined} onClick={onNavigate}>{slug === EXPLORATIONS_PAGE ? 'Company map' : PAGES[slug].title}</a>
            );
          })}
        </div>
      ))}
    </>
  );
}

const RAIL_KEY = 'dycom-ds:rail';

export function DsShell({ current, motionOff, onToggleMotion, drawer, children }: { current: string; motionOff: boolean; onToggleMotion: () => void; drawer?: ReactNode; children: ReactNode }) {
  const [contentsOpen, setContentsOpen] = useState(false);
  // The rail can be put away so framed examples get more of the window (desktop only; narrower windows already use the Contents drawer).
  const [railHidden, setRailHidden] = useState(() => { try { return window.sessionStorage.getItem(RAIL_KEY) === 'hidden'; } catch { return false; } });
  const toggleRail = () => setRailHidden((v) => { try { window.sessionStorage.setItem(RAIL_KEY, v ? 'shown' : 'hidden'); } catch { /* private mode */ } return !v; });
  return (
    <main className="dycom-c5 dycom-consolidated-v2 dycom-ds" data-motion={motionOff ? 'off' : 'on'} data-rail={railHidden ? 'hidden' : 'shown'}>
      <header className="dycom-ds__top">
        <a className="dycom-ds__brand" href={DS_BASE} aria-label="Dycom Design System home">
          <img src={asset('logo-white.webp')} alt="Dycom" width="112" />
          <span>Design System</span>
        </a>
        <div className="dycom-ds__top-actions">
          <button type="button" aria-pressed={!motionOff} onClick={onToggleMotion}>Motion {motionOff ? 'off' : 'on'}</button>
          <button type="button" className="dycom-ds__rail-toggle" aria-pressed={!railHidden} onClick={toggleRail}><PanelLeft size={18} aria-hidden="true" />{railHidden ? 'Show contents' : 'Hide contents'}</button>
          <button type="button" className="dycom-ds__contents" onClick={() => setContentsOpen(true)}><List size={18} aria-hidden="true" />Contents</button>
        </div>
      </header>
      <div className="dycom-ds__body">
        <nav className="dycom-ds__rail" aria-label="Design system contents"><Contents current={current} /></nav>
        <div className="dycom-ds__page">{children}</div>
      </div>
      <Modal open={contentsOpen} onClose={() => setContentsOpen(false)} title="Contents" id="ds-contents-title" drawer>
        <nav aria-label="Design system contents" style={{ padding: '8px 0 32px' }}><Contents current={current} onNavigate={() => setContentsOpen(false)} /></nav>
      </Modal>
      {drawer}
    </main>
  );
}

export function PageHead({ group, groupHref, title, summary, children }: { group: string; groupHref?: string; title: string; summary: string; children?: ReactNode }) {
  return (
    <header className="dycom-ds__page-head">
      <nav className="dycom-ds__eyebrow" aria-label="Breadcrumb"><a href={DS_BASE}>Design System</a>{group !== 'Design System' && <><span aria-hidden="true">·</span>{groupHref ? <a href={groupHref}>{group}</a> : <span>{group}</span>}</>}</nav>
      <h1>{title}</h1>
      <p>{summary}</p>
      {children}
    </header>
  );
}

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="dycom-ds__section" id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="dycom-ds__prose">{children}</div>;
}

/**
 * A live example rendered in the page column: for controls and small parts whose
 * layout does not depend on the viewport. Chapters and anything with breakpoints
 * use `Framed` (examples/Framed.tsx) so the site's own breakpoints apply.
 * `tone` sets the backdrop the component expects; `flush` removes the padding.
 */
export function Stage({ label, note, tone, flush = false, children }: { label: string; note?: string; tone?: 'dark' | 'paper'; flush?: boolean; children: ReactNode }) {
  const classes = ['dycom-ds__stage-body', flush ? '' : 'is-padded', tone === 'dark' ? 'is-dark' : '', tone === 'paper' ? 'is-paper' : ''].filter(Boolean).join(' ');
  return (
    <figure className="dycom-ds__stage" style={{ margin: '28px 0 8px' }}>
      <figcaption className="dycom-ds__stage-bar"><strong>{label}</strong><span>Live example — the real component, not a picture</span></figcaption>
      <div className={classes}>{children}</div>
      {note && <div className="dycom-ds__stage-note">{note}</div>}
    </figure>
  );
}

export function StateRow({ children }: { children: ReactNode }) {
  return <div className="dycom-ds__row">{children}</div>;
}

export function State({ label, hover = false, children }: { label: string; hover?: boolean; children: ReactNode }) {
  return (
    <div className={`dycom-ds__state${hover ? ' is-hover' : ''}`}>
      <span className="dycom-ds__state-label">{label}</span>
      {children}
    </div>
  );
}

/** Reads the listed tokens from the stylesheet at runtime, so values never drift from brand.css. */
export function TokenTable({ names }: { names: string[] }) {
  const ref = useRef<HTMLTableElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const scope = ref.current?.closest('.dycom-c5');
    if (!scope) return;
    const read = () => setValues(Object.fromEntries(names.map((name) => [name, readToken(scope, name)])));
    read();
    window.addEventListener('resize', read); // fluid sizes resolve per viewport
    return () => window.removeEventListener('resize', read);
  }, [names]);
  const rows = names.map((name) => BRAND_TOKENS.find((t) => t.name === name) ?? { name, group: 'rhythm' as const, label: name, role: '' });
  return (
    <table className="dycom-ds__tokens" ref={ref}>
      <thead><tr><th scope="col">Token</th><th scope="col">Value</th><th scope="col">Role</th></tr></thead>
      <tbody>
        {rows.map((token) => (
          <tr key={token.name}>
            <td>{token.group === 'color' && <i className="dycom-ds__swatch" style={{ background: `var(${token.name})` }} aria-hidden="true" />}<code>{token.name}</code><br /><small>{token.label}</small></td>
            <td><span className="dycom-ds__value">{values[token.name] ?? '…'}</span></td>
            <td>{token.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Rules({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="dycom-ds__rules">
      <div><h3>Do</h3><ul>{dos.map((d) => <li key={d}>{d}</li>)}</ul></div>
      <div className="is-dont"><h3>Don’t</h3><ul>{donts.map((d) => <li key={d}>{d}</li>)}</ul></div>
    </div>
  );
}

export function PageLink({ slug, children }: { slug: PageSlug | string; children: ReactNode }) {
  return <a href={dsHref(slug)} className="dycom-c5__text-link">{children}<ArrowRight size={17} aria-hidden="true" /></a>;
}
