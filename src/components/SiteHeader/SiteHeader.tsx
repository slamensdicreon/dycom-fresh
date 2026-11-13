'use client';
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import {
  Link as ScLink,
  NextImage as ContentSdkImage,
  Text,
  useSitecore,
  type ImageField,
  type Item,
  type LinkField,
  type TextField,
} from '@sitecore-content-sdk/nextjs';
import { ArrowDown, ChevronDown, Globe, Menu } from 'lucide-react';
import type { ComponentProps } from 'lib/component-props';
import { useSiteUI } from 'lib/site-ui';
import { ActionButton, SiteLink } from 'components/ui/links';
import { IconButton } from 'components/ui/IconButton';
import { Modal } from 'components/ui/Modal';

/**
 * Site header — sticky white bar: logo, six mega-menu groups, language switch and Find a job
 * (NAV0001–NAV0003). The menu is the future-state sitemap: every group, column and link is a
 * Sitecore item, shared with the footer through the same Navigation Link items.
 *
 * Datasource template: Site Header — Logo, HomeLink, JobsLink, Groups (Navigation Group[])
 * Navigation Group — Label, Intro, Description, OverviewLink, ChapterLink (optional homepage
 *   anchor: on the homepage the overview link jumps to that chapter instead), Columns
 * Navigation Column — Title, Links (Navigation Link[]); Navigation Link — Link
 */
type NavLinkItem = Item & { fields: { Link: LinkField } };
type NavColumnItem = Item & { fields: { Title: TextField; Links: NavLinkItem[] } };
type NavGroupItem = Item & {
  fields: {
    Label: TextField;
    Intro: TextField;
    Description: TextField;
    OverviewLink: LinkField;
    ChapterLink?: LinkField;
    Columns: NavColumnItem[];
  };
};

type SiteHeaderProps = ComponentProps & {
  fields: {
    Logo: ImageField;
    HomeLink: LinkField;
    JobsLink: LinkField;
    Groups: NavGroupItem[];
  };
};

/** Site languages. Translation belongs to the platform: the switch records the choice only (brief §7). */
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
] as const;

function LanguageSwitch() {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]['code']>('en');
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];
  const items = () => Array.from(root.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? []);

  return (
    <div
      ref={root}
      className="dy-lang"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          setOpen(false);
          root.current?.querySelector('button')?.focus();
        }
        if (open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
          e.preventDefault();
          const list = items();
          const at = list.indexOf(document.activeElement as HTMLButtonElement);
          list[(at + (e.key === 'ArrowDown' ? 1 : list.length - 1)) % list.length]?.focus();
        }
      }}
    >
      <button
        type="button"
        className="dy-icon-button dy-lang-trigger"
        aria-label={`Language: ${current.label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          setOpen((v) => !v);
          requestAnimationFrame(() => items().find((b) => b.getAttribute('aria-checked') === 'true')?.focus());
        }}
      >
        <Globe aria-hidden="true" />
      </button>
      {open && (
        <div id={menuId} role="menu" aria-label="Site language" className="dy-lang-menu">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitemradio"
              aria-checked={l.code === language}
              lang={l.code}
              onClick={() => {
                setLanguage(l.code);
                setOpen(false);
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Overview link — or, on the homepage, the jump to the group's chapter when the group names one. */
function OverviewLink({ group, onHomepage, onNavigate }: { group: NavGroupItem; onHomepage: boolean; onNavigate: () => void }) {
  const chapter = group.fields.ChapterLink;
  if (onHomepage && chapter?.value?.href) {
    return (
      <a href={chapter.value.href} className="dy-text-link dy-jump" onClick={onNavigate}>
        <Text field={group.fields.Label} />
        <ArrowDown size={17} aria-hidden="true" />
      </a>
    );
  }
  return <SiteLink field={group.fields.OverviewLink} className="dy-text-link" onClick={onNavigate} />;
}

function ColumnLinks({ column, onNavigate, className }: { column: NavColumnItem; onNavigate: () => void; className: string }) {
  return (
    <div className={className}>
      <Text tag="h4" field={column.fields.Title} />
      {column.fields.Links?.map((link) => (
        <SiteLink key={link.id} field={link.fields.Link} arrow={false} onClick={onNavigate} />
      ))}
    </div>
  );
}

export const Default = ({ fields, rendering }: SiteHeaderProps) => {
  const { page } = useSitecore();
  const { openRoles } = useSiteUI();
  const baseId = useId();
  const onHomepage = page.layout.sitecore.context.itemPath === '/';
  const groups = fields.Groups ?? [];

  const [group, setGroup] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<number | null>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!header.current?.contains(e.target as Node)) setGroup(null);
    };
    document.addEventListener('click', close);
    const desktop = window.matchMedia('(min-width: 1100px)');
    const onResize = () => {
      if (desktop.matches) setMobile(false);
    };
    desktop.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('click', close);
      desktop.removeEventListener('change', onResize);
    };
  }, []);

  const menuId = (i: number) => `${baseId}-menu-${i}`;
  const jobsLabel = fields.JobsLink?.value?.text || 'Find a job';
  const logo = <ContentSdkImage field={fields.Logo} width={144} height={23} priority />;

  return (
    <header
      ref={header}
      className="dy-header"
      data-rendering={rendering.componentName}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && group !== null) {
          setGroup(null);
          header.current?.querySelector<HTMLButtonElement>('[aria-expanded="true"]')?.focus();
        }
      }}
    >
      <ScLink field={onHomepage ? { value: { ...fields.HomeLink.value, href: '#top' } } : fields.HomeLink} className="dy-brand" aria-label={fields.HomeLink?.value?.text || 'Dycom home'}>
        {logo}
      </ScLink>

      <nav className="dy-desktop-nav" aria-label="Main navigation">
        {groups.map((g, i) => (
          <div className="dy-nav-group" key={g.id}>
            <button
              type="button"
              className="dy-nav-trigger"
              aria-expanded={group === i}
              aria-controls={menuId(i)}
              onClick={() => setGroup(group === i ? null : i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setGroup(i);
                  requestAnimationFrame(() => document.getElementById(menuId(i))?.querySelector<HTMLAnchorElement>('a')?.focus());
                }
              }}
            >
              <Text field={g.fields.Label} />
              <ChevronDown className="dy-chevron" aria-hidden="true" />
            </button>
            {group === i && (
              <div id={menuId(i)} className="dy-mega" style={{ '--dy-mega-cols': g.fields.Columns?.length ?? 1 } as CSSProperties}>
                <div className="dy-mega-intro">
                  <Text tag="h3" field={g.fields.Intro} />
                  <Text tag="p" field={g.fields.Description} />
                  <OverviewLink group={g} onHomepage={onHomepage} onNavigate={() => setGroup(null)} />
                </div>
                {g.fields.Columns?.map((col) => (
                  <ColumnLinks key={col.id} column={col} className="dy-mega-links" onNavigate={() => setGroup(null)} />
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <LanguageSwitch />
      <div className="dy-header-job">
        <ActionButton onClick={() => openRoles()}>{jobsLabel}</ActionButton>
      </div>
      <IconButton className="dy-mobile-trigger" label="Open navigation" aria-haspopup="dialog" onClick={() => setMobile(true)}>
        <Menu />
      </IconButton>

      <Modal open={mobile} onClose={() => setMobile(false)} title="menu" heading={logo} id={`${baseId}-mobile-nav`} drawer variant="nav">
        <nav className="dy-mobile-nav" aria-label="Mobile navigation">
          <ActionButton
            onClick={() => {
              setMobile(false);
              requestAnimationFrame(() => openRoles());
            }}
          >
            {jobsLabel}
          </ActionButton>
          {/* One group open at a time; groups go straight to their link columns on phones. */}
          <div className="dy-accordion">
            {groups.map((g, i) => {
              const open = mobileGroup === i;
              const panelId = `${baseId}-mobile-${i}`;
              return (
                <div className="dy-accordion-item" key={g.id} data-state={open ? 'open' : 'closed'}>
                  <h3 className="dy-accordion-head">
                    <button
                      type="button"
                      className="dy-accordion-trigger"
                      aria-expanded={open}
                      aria-controls={panelId}
                      data-state={open ? 'open' : 'closed'}
                      onClick={() => setMobileGroup(open ? null : i)}
                    >
                      <Text field={g.fields.Label} />
                      <ChevronDown className="dy-chevron" aria-hidden="true" />
                    </button>
                  </h3>
                  {open && (
                    <div id={panelId} role="region" className="dy-accordion-content dy-accordion-content--static" data-state="open">
                      <OverviewLink group={g} onHomepage={onHomepage} onNavigate={() => setMobile(false)} />
                      {g.fields.Columns?.map((col) => (
                        <ColumnLinks key={col.id} column={col} className="dy-mobile-col" onNavigate={() => setMobile(false)} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </Modal>
    </header>
  );
};
