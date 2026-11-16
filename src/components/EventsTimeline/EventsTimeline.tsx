import { type Field, type Item, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { ButtonLink } from 'components/ui/links';
import { SectionHead } from 'components/ui/SectionHead';
import { EventTabs } from './EventTabs';

/**
 * Events timeline — dated investor events on a square-node timeline, split into Upcoming / Past tabs
 * from each event's date (Investors page review, Nov 11, 2026): a past event is never shown as
 * upcoming, and an empty Upcoming tab says so and points to email alerts. Designed to sit in a
 * SplitSection column. Events come from the IR provider feed in the build (open decision D-IR).
 *
 * The page is rendered ahead of time, so the split is made here at render with that day, then made
 * again in the browser with the visitor's day (EventTabs).
 *
 * Datasource template: Events Timeline — Heading, Events (Investor Event items: Title, Date (ISO),
 * DisplayDate, Time, WebcastLink), AllLink, TabsLabel, UpcomingLabel, PastLabel, UpcomingEmptyText,
 * PastEmptyText, EmptyLink (email alerts)
 * Params: RenderingIdentifier, SectionNumber (optional numeral)
 */
export type InvestorEvent = Item & {
  fields: { Title: TextField; Date: Field<string>; DisplayDate: TextField; Time: TextField; WebcastLink: LinkField };
};
type EventsTimelineFields = {
  Heading: TextField;
  Events: InvestorEvent[];
  AllLink: LinkField;
  TabsLabel?: TextField;
  UpcomingLabel?: TextField;
  PastLabel?: TextField;
  UpcomingEmptyText?: TextField;
  PastEmptyText?: TextField;
  EmptyLink?: LinkField;
};
type EventsTimelineProps = ComponentProps & { fields: EventsTimelineFields };

export const Default = ({ fields, params }: EventsTimelineProps) => {
  const id = params.RenderingIdentifier || 'events';
  const renderDay = new Date().toISOString().slice(0, 10);
  return (
    <div id={id} className="dy-irp-feed">
      <SectionHead id={`${id}-title`} index={params.SectionNumber} heading={fields.Heading} />
      <EventTabs
        idBase={id}
        renderDay={renderDay}
        events={fields.Events ?? []}
        labels={{
          tabs: (fields.TabsLabel?.value as string) || 'Events',
          upcoming: fields.UpcomingLabel,
          past: fields.PastLabel,
          upcomingEmpty: fields.UpcomingEmptyText,
          pastEmpty: fields.PastEmptyText,
          emptyLink: fields.EmptyLink,
        }}
      />
      <ButtonLink field={fields.AllLink} />
    </div>
  );
};
