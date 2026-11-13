import { Text, type Item, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { SiteLink } from 'components/ui/links';
import { SectionHead } from 'components/ui/SectionHead';

/**
 * Resource columns — titled groups of links to site pages (the Investors group of the sitemap on the
 * Investors overview; the Resource Center columns elsewhere). Point the datasource at the same
 * navigation items the header uses so menus and pages cannot disagree.
 *
 * Datasource template: Resource Columns · field `Columns` (Link Group items: Title, Links → Link items with `Link`)
 * Params: RenderingIdentifier, SectionNumber, Surface ("paper")
 */
type LinkItem = Item & { fields: { Link: LinkField } };
type LinkGroup = Item & { fields: { Title: TextField; Links: LinkItem[] } };
type ResourceColumnsProps = ComponentProps & { fields: { Heading: TextField; Note: TextField; Columns: LinkGroup[] } };

export const Default = ({ fields, params }: ResourceColumnsProps) => {
  const id = params.RenderingIdentifier || 'resources';
  return (
    <section id={id} className={`dy-section${params.Surface === 'paper' ? ' dy-paper' : ''}`} aria-labelledby={`${id}-title`}>
      <SectionHead id={`${id}-title`} index={params.SectionNumber} heading={fields.Heading} note={fields.Note} />
      <div className="dy-resources dy-resources--flush">
        {(fields.Columns ?? []).map((col, i) => (
          <div key={col.id ?? i}>
            <Text tag="h3" field={col.fields.Title} />
            {(col.fields.Links ?? []).map((l, j) => (
              <SiteLink field={l.fields.Link} key={l.id ?? j} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
