import { AppPlaceholder, Text, NextImage as ContentSdkImage, type ComponentMap, type ImageField, type LinkField, type Page, type TextField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from 'lucide-react';
import type { ComponentProps } from 'lib/component-props';
import { SiteLink } from 'components/ui/links';
import { Signal } from 'components/ui/Signal';

/**
 * Interior hero — the head of every interior page (template T02 and the interior-page frame in the
 * requirements): back link, all-caps H1, overview paragraph, and an optional listing block on a
 * Signal Green rule. With a background image it is the photographic hero; without, a Civic band.
 *
 * Placeholder `interior-hero-index` sits under the copy for an InPageIndex rendering.
 *
 * Datasource template: Interior Hero
 */
type InteriorHeroFields = {
  BackLink: LinkField;
  Heading: TextField;
  Overview: TextField;
  BackgroundImage: ImageField;
  ListingLabel: TextField;
  ListingValue: TextField;
  ListingText: TextField;
};

type InteriorHeroProps = ComponentProps & { fields: InteriorHeroFields; page: Page; componentMap: ComponentMap };

export const Default = ({ fields, params, rendering, page, componentMap }: InteriorHeroProps) => {
  const titleId = `${params.RenderingIdentifier || 'page'}-title`;
  const hasImage = Boolean(fields.BackgroundImage?.value?.src);
  const hasListing = Boolean(fields.ListingValue?.value) || page.mode.isEditing;
  return (
    <section
      id={params.RenderingIdentifier || undefined}
      className={`dy-irp-hero dy-dark${hasImage ? ' dy-irp-photo' : ''}`}
      aria-labelledby={titleId}
    >
      {hasImage && <ContentSdkImage field={fields.BackgroundImage} fill priority sizes="100vw" alt="" />}
      <div className={`dy-irp-hero-grid${hasListing ? '' : ' dy-irp-hero-grid--solo'}`}>
        <div className="dy-irp-hero-copy">
          {(fields.BackLink?.value?.href || page.mode.isEditing) && (
            <SiteLink field={fields.BackLink} className="dy-irp-back" arrow={false}>
              <ArrowRight size={16} aria-hidden="true" />
              {fields.BackLink?.value?.text}
            </SiteLink>
          )}
          <Text tag="h1" id={titleId} field={fields.Heading} />
          <Text tag="p" field={fields.Overview} />
        </div>
        {hasListing && (
          <div className="dy-irp-listing">
            <Signal />
            <Text tag="small" field={fields.ListingLabel} />
            <Text tag="strong" field={fields.ListingValue} />
            <Text tag="p" field={fields.ListingText} />
          </div>
        )}
      </div>
      <AppPlaceholder name="interior-hero-index" rendering={rendering} page={page} componentMap={componentMap} />
    </section>
  );
};
