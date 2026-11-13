import { Text, type Field, type Item, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { ButtonLink, SiteLink } from 'components/ui/links';
import { SectionHead } from 'components/ui/SectionHead';

/**
 * Events timeline — dated investor events on a square-node timeline, the most recent node green;
 * "Webcast" where the event has one; a button to the full listing. Designed to sit in a
 * SplitSection column. Events come from the IR provider feed in the build (open decision D-IR).
 *
 * Datasource template: Events Timeline · field `Events` (Investor Event items: Title, Date (ISO), DisplayDate, Time, WebcastLink)
 * Params: RenderingIdentifier, SectionNumber
 */
type InvestorEvent = Item & {
  fields: { Title: TextField; Date: Field<string>; DisplayDate: TextField; Time: TextField; WebcastLink: LinkField };
};
type EventsTimelineProps = ComponentProps & { fields: { Heading: TextField; Events: InvestorEvent[]; AllLink: LinkField } };

export const Default = ({ fields, params }: EventsTimelineProps) => {
  const id = params.RenderingIdentifier || 'events';
  return (
    <div id={id} className="dy-irp-feed">
      <SectionHead id={`${id}-title`} index={params.SectionNumber} heading={fields.Heading} />
      <ol className="dy-irp-timeline">
        {(fields.Events ?? []).map((e, i) => (
          <li key={e.id ?? i}>
            <time dateTime={e.fields.Date?.value}>
              <Text field={e.fields.DisplayDate} />
              {e.fields.Time?.value ? ` · ${e.fields.Time.value}` : ''}
            </time>
            <Text tag="strong" field={e.fields.Title} />
            {e.fields.WebcastLink?.value?.href && <SiteLink field={e.fields.WebcastLink} className="dy-text-link" />}
          </li>
        ))}
      </ol>
      <ButtonLink field={fields.AllLink} />
    </div>
  );
};
