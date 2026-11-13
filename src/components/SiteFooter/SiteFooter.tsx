'use client';
import { useId, useState } from 'react';
import {
  Link as ScLink,
  NextImage as ContentSdkImage,
  RichText,
  Text,
  useSitecore,
  type ImageField,
  type Item,
  type LinkField,
  type RichTextField,
  type TextField,
} from '@sitecore-content-sdk/nextjs';
import { ChevronDown } from 'lucide-react';
import type { ComponentProps } from 'lib/component-props';
import { useSiteUI } from 'lib/site-ui';
import { SiteLink } from 'components/ui/links';

/**
 * Site footer — Civic Blue: reversed logo and tagline, six sitemap columns mirroring the header
 * groups (accordions on phones), utility row with ©, legal links and the Motion control that turns
 * all non-essential motion off for the whole site (NAV0007).
 *
 * Datasource template: Site Footer — Logo, HomeLink, Tagline (rich text), Columns (Footer Column[]),
 *   UtilityLinks (Navigation Link[]), CopyrightHolder, MotionLabel
 * Footer Column — Title, Links (Navigation Link[], the same link items the header uses)
 *
 * TODO(NAV0007): add the cookie-preferences link once Dycom's consent tool is chosen (CC-4).
 */
type NavLinkItem = Item & { fields: { Link: LinkField } };
type FooterColumnItem = Item & { fields: { Title: TextField; Links: NavLinkItem[] } };

type SiteFooterProps = ComponentProps & {
  fields: {
    Logo: ImageField;
    HomeLink: LinkField;
    Tagline: RichTextField;
    Columns: FooterColumnItem[];
    UtilityLinks: NavLinkItem[];
    CopyrightHolder: TextField;
    MotionLabel: TextField;
  };
};

export const Default = ({ fields }: SiteFooterProps) => {
  const { page } = useSitecore();
  const { motionOff, setMotionOff } = useSiteUI();
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());
  const onHomepage = page.layout.sitecore.context.itemPath === '/';
  const columns = fields.Columns ?? [];
  const motionLabel = (fields.MotionLabel?.value as string) || 'Motion';

  const toggle = (i: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <footer className="dy-footer dy-dark">
      <div className="dy-footer-main">
        <div className="dy-footer-brand">
          <ScLink
            field={onHomepage ? { value: { ...fields.HomeLink.value, href: '#top' } } : fields.HomeLink}
            className="dy-footer-lockup"
            aria-label={fields.HomeLink?.value?.text || 'Dycom home'}
          >
            <ContentSdkImage field={fields.Logo} width={144} height={23} />
          </ScLink>
          <RichText tag="p" field={fields.Tagline} />
        </div>

        <nav aria-label="Footer" className="dy-footer-columns">
          {columns.map((col) => (
            <div className="dy-footer-column" key={col.id}>
              <Text tag="h3" field={col.fields.Title} />
              <div className="dy-footer-links">
                {col.fields.Links?.map((link) => (
                  <SiteLink key={link.id} field={link.fields.Link} arrow={false} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Phones: the same columns as independent disclosures (several may be open). */}
        <div className="dy-footer-accordion" role="navigation" aria-label="Footer sections">
          {columns.map((col, i) => {
            const expanded = open.has(i);
            const panelId = `${baseId}-footer-${i}`;
            return (
              <div className="dy-footer-accordion-item" key={col.id}>
                <h3>
                  <button
                    type="button"
                    className="dy-footer-accordion-trigger"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    data-state={expanded ? 'open' : 'closed'}
                    onClick={() => toggle(i)}
                  >
                    <Text field={col.fields.Title} />
                    <ChevronDown aria-hidden="true" />
                  </button>
                </h3>
                <div id={panelId} className="dy-footer-accordion-content" hidden={!expanded}>
                  {col.fields.Links?.map((link) => (
                    <SiteLink key={link.id} field={link.fields.Link} arrow={false} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dy-footer-utility">
        <span>
          © {new Date().getFullYear()} <Text field={fields.CopyrightHolder} />
        </span>
        {fields.UtilityLinks?.map((link) => (
          <SiteLink key={link.id} field={link.fields.Link} arrow={false} />
        ))}
        {/* Stable label; the state is carried by aria-pressed and the visible on/off word. */}
        <button type="button" aria-pressed={!motionOff} aria-label={motionLabel} onClick={() => setMotionOff(!motionOff)}>
          {motionLabel} <span aria-hidden="true">{motionOff ? 'off' : 'on'}</span>
        </button>
      </div>
    </footer>
  );
};
