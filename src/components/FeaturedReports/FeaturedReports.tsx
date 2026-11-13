import { Text, NextImage as ContentSdkImage, type ImageField, type Item, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { ButtonLink } from 'components/ui/links';
import { SectionHead } from 'components/ui/SectionHead';
import { Signal } from 'components/ui/Signal';

/**
 * Featured reports — report cards with a cover image (CC-23 asks for "a more elegant version" of the
 * annual-reports list). The cover is an Image field: Dycom photography today, the published cover
 * artwork once Dycom supplies it. The title is set on the cover so the card reads either way.
 *
 * Datasource template: Featured Reports · field `Reports` (Report items: Label, Title, Description, Cover, Link)
 * Params: RenderingIdentifier, SectionNumber, Surface ("paper" for the grey band)
 */
type Report = Item & { fields: { Label: TextField; Title: TextField; Description: TextField; Cover: ImageField; Link: LinkField } };
type FeaturedReportsProps = ComponentProps & { fields: { Heading: TextField; Note: TextField; Reports: Report[] } };

export const Default = ({ fields, params }: FeaturedReportsProps) => {
  const id = params.RenderingIdentifier || 'reports';
  return (
    <section id={id} className={`dy-section${params.Surface === 'paper' ? ' dy-paper' : ''}`} aria-labelledby={`${id}-title`}>
      <SectionHead id={`${id}-title`} index={params.SectionNumber} heading={fields.Heading} note={fields.Note} />
      <div className="dy-irp-reports">
        {(fields.Reports ?? []).map((r, i) => (
          <article key={r.id ?? i} className="dy-irp-report">
            <div className="dy-irp-cover" aria-hidden="true">
              <ContentSdkImage field={r.fields.Cover} fill sizes="(max-width: 767px) 100vw, 30vw" alt="" />
              <span className="dy-irp-cover-plate">
                <Signal />
                <span>{r.fields.Title?.value as string}</span>
              </span>
            </div>
            <Text tag="small" field={r.fields.Label} />
            <Text tag="h3" field={r.fields.Title} />
            <Text tag="p" field={r.fields.Description} />
            <ButtonLink field={r.fields.Link} variant="outline" />
          </article>
        ))}
      </div>
    </section>
  );
};
