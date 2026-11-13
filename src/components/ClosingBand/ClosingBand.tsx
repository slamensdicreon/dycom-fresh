import { Text, NextImage as ContentSdkImage, type ImageField, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { ButtonLink } from 'components/ui/links';

/**
 * Closing band — the last band of an interior page: H2, one sentence and up to two inverse buttons
 * over photography (Civic wash keeps the copy AA). Without an image it is a plain Civic band.
 *
 * Datasource template: Closing Band
 */
type ClosingBandProps = ComponentProps & {
  fields: { Heading: TextField; Text: TextField; BackgroundImage: ImageField; PrimaryLink: LinkField; SecondaryLink: LinkField };
};

export const Default = ({ fields, params }: ClosingBandProps) => {
  const id = params.RenderingIdentifier || 'closing';
  const hasImage = Boolean(fields.BackgroundImage?.value?.src);
  return (
    <section id={id} className={`dy-section dy-irp-close dy-dark${hasImage ? ' dy-irp-photo' : ''}`} aria-labelledby={`${id}-title`}>
      {hasImage && <ContentSdkImage field={fields.BackgroundImage} fill sizes="100vw" alt="" />}
      <div>
        <Text tag="h2" id={`${id}-title`} field={fields.Heading} />
        <Text tag="p" field={fields.Text} />
      </div>
      <div className="dy-actions">
        <ButtonLink field={fields.PrimaryLink} variant="inverse" />
        <ButtonLink field={fields.SecondaryLink} variant="inverse" className="dy-button--outline" />
      </div>
    </section>
  );
};
