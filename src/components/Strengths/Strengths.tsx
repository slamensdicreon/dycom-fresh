import { Text, NextImage as ContentSdkImage, type ImageField, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { ButtonLink } from 'components/ui/links';

/**
 * Strengths — four equal photo cards with no heading of their own (brief §4.7, Dycom content v0.1),
 * each with an outline button to a page of the site.
 *
 * Datasource template: Strengths — Label (aria label), Cards (children: Strength Card)
 * Strength Card: Title, Body, Image, Link
 */
type StrengthCard = { id?: string; fields: { Title: TextField; Body: TextField; Image: ImageField; Link: LinkField } };
type StrengthsProps = ComponentProps & { fields: { Label: TextField; Cards: StrengthCard[] } };

export const Default = ({ fields, params }: StrengthsProps) => (
  <section
    id={params?.RenderingIdentifier || 'strengths'}
    className="dy-section dy-strengths"
    aria-label={(fields?.Label?.value as string) || undefined}
  >
    <ul className="dy-strength-cards">
      {(fields?.Cards ?? []).map((card, i) => (
        <li key={card.id ?? i} className="dy-strength-card">
          <ContentSdkImage
            field={card.fields.Image}
            loading="lazy"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className="dy-strength-copy">
            <Text tag="h3" field={card.fields.Title} />
            <Text tag="p" field={card.fields.Body} />
            <ButtonLink field={card.fields.Link} variant="outline" />
          </div>
        </li>
      ))}
    </ul>
  </section>
);
