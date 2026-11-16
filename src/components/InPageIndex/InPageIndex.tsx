import { Text, type Item, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from 'lucide-react';
import type { ComponentProps } from 'lib/component-props';
import { SiteLink } from 'components/ui/links';

/**
 * In-page index — jump links to the sections of an interior page (C08 extends this into a sticky
 * variant). With the `ShowNumbers` param ("1") each link carries its number in order; the Investors
 * page runs without numbers (review of Nov 11, 2026).
 *
 * Datasource template: In-Page Index · field `Links` (multilist of In-Page Link items: `Label`, `Link`)
 * Params: ShowNumbers ("1" to number the links)
 */
type IndexLink = Item & { fields: { Label: TextField; Link: LinkField } };
type InPageIndexProps = ComponentProps & { fields: { Label: TextField; Links: IndexLink[] } };

export const Default = ({ fields, params }: InPageIndexProps) => {
  const links = fields.Links ?? [];
  const numbered = params?.ShowNumbers === '1' || params?.ShowNumbers === 'true';
  if (!links.length) return null;
  return (
    <nav className="dy-irp-jumps" aria-label={(fields.Label?.value as string) || 'On this page'}>
      {links.map((item, i) => (
        <SiteLink field={item.fields.Link} arrow={false} key={item.id ?? i}>
          <span>
            {numbered && <small>{String(i + 1).padStart(2, '0')}</small>}
            <Text field={item.fields.Label} />
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </SiteLink>
      ))}
    </nav>
  );
};
