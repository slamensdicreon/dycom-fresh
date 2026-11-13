import { Text, type Item, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from 'lucide-react';
import type { ComponentProps } from 'lib/component-props';
import { SiteLink } from 'components/ui/links';

/**
 * In-page index — numbered jump links to the sections of an interior page (C08 extends this into a
 * sticky variant). Numbers follow the order of the selected items.
 *
 * Datasource template: In-Page Index · field `Links` (multilist of In-Page Link items: `Label`, `Link`)
 */
type IndexLink = Item & { fields: { Label: TextField; Link: LinkField } };
type InPageIndexProps = ComponentProps & { fields: { Label: TextField; Links: IndexLink[] } };

export const Default = ({ fields }: InPageIndexProps) => {
  const links = fields.Links ?? [];
  if (!links.length) return null;
  return (
    <nav className="dy-irp-jumps" aria-label={(fields.Label?.value as string) || 'On this page'}>
      {links.map((item, i) => (
        <SiteLink field={item.fields.Link} arrow={false} key={item.id ?? i}>
          <span>
            <small>{String(i + 1).padStart(2, '0')}</small>
            <Text field={item.fields.Label} />
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </SiteLink>
      ))}
    </nav>
  );
};
