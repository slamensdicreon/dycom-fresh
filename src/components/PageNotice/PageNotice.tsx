import { Text, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { ButtonLink } from 'components/ui/links';
import { Signal } from 'components/ui/Signal';

/**
 * Page notice — a short message with up to two ways on: used for pages of the sitemap that are
 * not yet published ("This page is currently unavailable") and for the 404 page, so a visitor
 * following any menu or footer link never hits a dead end (strategy goal "never hit a dead end").
 *
 * Datasource template: Page Notice
 */
type PageNoticeProps = ComponentProps & {
  fields: { Heading: TextField; Text: TextField; PrimaryLink: LinkField; SecondaryLink: LinkField };
};

export const Default = ({ fields, params }: PageNoticeProps) => (
  <section id={params.RenderingIdentifier || 'notice'} className="dy-section dy-notice" aria-labelledby="notice-title">
    <Signal className="dy-notice-mark" />
    <div className="dy-notice-copy">
      <Text tag="h2" id="notice-title" field={fields.Heading} />
      <Text tag="p" field={fields.Text} />
      <div className="dy-actions">
        <ButtonLink field={fields.PrimaryLink} />
        <ButtonLink field={fields.SecondaryLink} variant="outline" />
      </div>
    </div>
  </section>
);
