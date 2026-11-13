'use client';
import { Text, NextImage as ContentSdkImage, type ImageField, type TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { useParallax } from './useParallax';

/**
 * Who we are · What we build — a light chapter in two columns, then the company facts over a crew
 * photograph (brief §4.4). The facts are read from the one managed Company Facts source (NAV0006),
 * never typed into this datasource.
 *
 * Datasource template: Who We Are
 *   Eyebrow, Heading, Body                         — left column
 *   WorkEyebrow, WorkHeading, WorkBody, LinesOfWork — right column (#what-we-build); LinesOfWork: Line Of Work items
 *   FactsLabel, Facts, FactsImage                  — facts band; Facts: Company Fact items (shared/company-facts)
 * Line Of Work: Title, Description (optional; Dycom asked for titles only)
 * Company Fact: Value, Label
 */
type LineOfWork = { id?: string; fields: { Title: TextField; Description?: TextField } };
type CompanyFact = { id?: string; fields: { Value: TextField; Label: TextField } };
type WhoWeAreFields = {
  Eyebrow: TextField;
  Heading: TextField;
  Body: TextField;
  WorkEyebrow: TextField;
  WorkHeading: TextField;
  WorkBody: TextField;
  LinesOfWork: LineOfWork[];
  FactsLabel: TextField;
  Facts: CompanyFact[];
  FactsImage: ImageField;
};
type WhoWeAreProps = ComponentProps & { fields: WhoWeAreFields };

export const Default = ({ fields, params }: WhoWeAreProps) => {
  const band = useParallax<HTMLDivElement>();
  if (!fields) return null;
  return (
    <section id={params?.RenderingIdentifier || 'who-we-are'} className="dy-section dy-paper dy-who-chapter">
      <div className="dy-who-grid">
        <div className="dy-who-intro">
          <Text tag="span" field={fields.Eyebrow} />
          <Text tag="h2" field={fields.Heading} />
          <Text tag="p" field={fields.Body} />
        </div>
        <div id="what-we-build" className="dy-who-intro dy-work-block">
          <Text tag="span" field={fields.WorkEyebrow} />
          <Text tag="h2" field={fields.WorkHeading} />
          <Text tag="p" field={fields.WorkBody} />
          <ul className="dy-work-list" aria-label={(fields.WorkEyebrow?.value as string) || undefined}>
            {(fields.LinesOfWork ?? []).map((line, i) => (
              <li key={line.id ?? i}>
                <Text tag="strong" field={line.fields.Title} />
                <Text tag="span" field={line.fields.Description} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div ref={band} className="dy-who-numbers dy-dark dy-parallax">
        <ContentSdkImage field={fields.FactsImage} loading="lazy" sizes="100vw" />
        <ul className="dy-facts" aria-label={(fields.FactsLabel?.value as string) || undefined}>
          {(fields.Facts ?? []).map((fact, i) => (
            <li key={fact.id ?? i}>
              <Text tag="strong" field={fact.fields.Value} />
              <Text tag="span" field={fact.fields.Label} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
