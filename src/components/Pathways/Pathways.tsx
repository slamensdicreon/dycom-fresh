import { Link, Text, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from 'lucide-react';
import type { ComponentProps } from 'lib/component-props';

/**
 * Pathways — the Civic Blue band of four audience tiles under the hero (NAV0005, brief §4.3).
 * A tile linking to `#open-roles` opens the roles drawer (Career Seekers).
 *
 * Datasource template: Pathways — Label (aria label), Tiles (children: Pathway Tile)
 * Pathway Tile: Title, Description, Link
 */
type PathwayTile = { id?: string; fields: { Title: TextField; Description: TextField; Link: LinkField } };
type PathwaysProps = ComponentProps & { fields: { Label: TextField; Tiles: PathwayTile[] } };

export const Default = ({ fields, params }: PathwaysProps) => (
  <section
    id={params?.RenderingIdentifier || 'pathways'}
    className="dy-pathways"
    aria-label={(fields?.Label?.value as string) || undefined}
  >
    {(fields?.Tiles ?? []).map((tile, i) => (
      <Link key={tile.id ?? i} field={tile.fields.Link} className="dy-pathway" showLinkTextWithChildrenPresent={false}>
        <span>
          <Text field={tile.fields.Title} />
          <ArrowRight size={20} aria-hidden="true" />
        </span>
        <Text tag="p" field={tile.fields.Description} />
      </Link>
    ))}
  </section>
);
