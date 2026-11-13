import { Text, NextImage as ContentSdkImage, type ImageField, type Item, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight, FileText } from 'lucide-react';
import type { ComponentProps } from 'lib/component-props';
import { ButtonLink, SiteLink } from 'components/ui/links';
import { SectionHead } from 'components/ui/SectionHead';
import { Signal } from 'components/ui/Signal';

/**
 * Results highlights — the latest quarter on the Investors overview: headline metrics as large
 * Signal Green numbers over photography, the results package as a ruled document list, and the
 * results-call block.
 *
 * Today the datasource holds a static snapshot of the fiscal 2027 Q2 release (IR hub rechecked
 * October 19, 2026). In the build these figures and documents come from the investor-relations
 * provider feed — open decision D-IR — mapped onto the same fields; no live market data here.
 *
 * Datasource template: Results Highlights
 * Params: RenderingIdentifier (anchor), SectionNumber (e.g. "01")
 */
type Metric = Item & { fields: { Label: TextField; Value: TextField; Unit: TextField } };
type ResultsDocument = Item & { fields: { Title: TextField; Kind: TextField; Link: LinkField } };

type ResultsHighlightsFields = {
  Heading: TextField;
  Note: TextField;
  BackgroundImage: ImageField;
  Metrics: Metric[];
  Documents: ResultsDocument[];
  DocumentsLabel: TextField;
  CallHeading: TextField;
  CallText: TextField;
  CallPrimaryLink: LinkField;
  CallSecondaryLink: LinkField;
};

type ResultsHighlightsProps = ComponentProps & { fields: ResultsHighlightsFields };

export const Default = ({ fields, params }: ResultsHighlightsProps) => {
  const id = params.RenderingIdentifier || 'results';
  return (
    <section id={id} className="dy-section" aria-labelledby={`${id}-title`}>
      <SectionHead id={`${id}-title`} index={params.SectionNumber} heading={fields.Heading} note={fields.Note} />
      <div className="dy-irp-band dy-dark">
        <ContentSdkImage field={fields.BackgroundImage} fill sizes="100vw" alt="" />
        <dl className="dy-irp-metrics">
          {(fields.Metrics ?? []).map((m, i) => (
            <div key={m.id ?? i} style={{ ['--i' as string]: i }}>
              <Text tag="dt" field={m.fields.Label} />
              <dd>
                <Text tag="strong" field={m.fields.Value} />
                <Text tag="span" field={m.fields.Unit} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="dy-irp-package">
        <ul className="dy-irp-docs" aria-label={(fields.DocumentsLabel?.value as string) || undefined}>
          {(fields.Documents ?? []).map((d, i) => (
            <li key={d.id ?? i}>
              <SiteLink field={d.fields.Link} arrow={false}>
                <FileText size={22} aria-hidden="true" />
                <span>
                  <Text tag="strong" field={d.fields.Title} />
                  <Text tag="small" field={d.fields.Kind} />
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </SiteLink>
            </li>
          ))}
        </ul>
        <div className="dy-irp-call">
          <Signal />
          <Text tag="h3" field={fields.CallHeading} />
          <Text tag="p" field={fields.CallText} />
          <div className="dy-actions">
            <ButtonLink field={fields.CallPrimaryLink} />
            <ButtonLink field={fields.CallSecondaryLink} variant="outline" />
          </div>
        </div>
      </div>
    </section>
  );
};
