import { Text, type Field, type Item, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from 'lucide-react';
import type { ComponentProps } from 'lib/component-props';
import { ButtonLink, SiteLink } from 'components/ui/links';
import { SectionHead } from 'components/ui/SectionHead';

/**
 * News list — a ruled, dated list of releases with a button to the full listing. Designed to sit in
 * a SplitSection column. Releases come from the IR provider feed (Notified) in the build — open
 * decision D-IR; each item links to an on-site news page, never to the IR host.
 *
 * Datasource template: News List · field `Items` (News Item: Title, Date (ISO), DisplayDate, Link)
 * Params: RenderingIdentifier, SectionNumber
 */
type NewsItem = Item & { fields: { Title: TextField; Date: Field<string>; DisplayDate: TextField; Link: LinkField } };
type NewsListProps = ComponentProps & { fields: { Heading: TextField; Items: NewsItem[]; AllLink: LinkField } };

export const Default = ({ fields, params }: NewsListProps) => {
  const id = params.RenderingIdentifier || 'news';
  return (
    <div id={id} className="dy-irp-feed">
      <SectionHead id={`${id}-title`} index={params.SectionNumber} heading={fields.Heading} />
      <ul className="dy-irp-news">
        {(fields.Items ?? []).map((n, i) => (
          <li key={n.id ?? i}>
            <SiteLink field={n.fields.Link} arrow={false}>
              <span>
                <time dateTime={n.fields.Date?.value}>
                  <Text field={n.fields.DisplayDate} />
                </time>
                <Text tag="strong" field={n.fields.Title} />
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </SiteLink>
          </li>
        ))}
      </ul>
      <ButtonLink field={fields.AllLink} />
    </div>
  );
};
