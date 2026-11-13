import { Text, type TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { Signal } from 'components/ui/Signal';

/**
 * Brand statement — one sentence set large beneath the signal mark (brief §4.8). Dycom's content
 * template left the statement blank; the authored placeholder is a sentence from Dycom's own
 * company description (open item 1).
 *
 * Datasource template: Brand Statement — Statement
 */
type BrandStatementProps = ComponentProps & { fields: { Statement: TextField } };

export const Default = ({ fields, params, rendering }: BrandStatementProps) => {
  const textId = `statement-${rendering.uid ?? 'text'}`;
  return (
    <section id={params?.RenderingIdentifier || 'statement'} className="dy-section dy-statement" aria-labelledby={textId}>
      <Signal />
      <Text tag="p" id={textId} field={fields?.Statement} />
    </section>
  );
};
