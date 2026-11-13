import { AppPlaceholder, type ComponentMap, type Page } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';

/**
 * Split section — a layout rendering with two equal columns, each its own placeholder
 * (`split-left`, `split-right`), so content renderings such as EventsTimeline and NewsList sit side
 * by side on wide screens and stack on phones. No datasource.
 *
 * Params: RenderingIdentifier (anchor), Surface ("paper" for the grey band)
 */
type SplitSectionProps = ComponentProps & { page: Page; componentMap: ComponentMap };

export const Default = ({ rendering, params, page, componentMap }: SplitSectionProps) => (
  <section id={params.RenderingIdentifier || undefined} className={`dy-section${params.Surface === 'paper' ? ' dy-paper' : ''}`}>
    <div className="dy-irp-columns">
      <div>
        <AppPlaceholder name="split-left" rendering={rendering} page={page} componentMap={componentMap} />
      </div>
      <div>
        <AppPlaceholder name="split-right" rendering={rendering} page={page} componentMap={componentMap} />
      </div>
    </div>
  </section>
);
