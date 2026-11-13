'use client';
import { useCallback, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { Text, NextImage as ContentSdkImage, type ImageField, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { usePhone } from 'lib/site-ui';
import { SiteLink } from 'components/ui/links';

/**
 * Expertise for the entire lifecycle — five stages as a process route (brief §4.9).
 *
 * Desktop and tablet: a tablist (roving tabindex; arrow keys, Home and End) over a stack of panels
 * that all stay mounted in one grid cell, so the block never changes height when the stage changes.
 * Phones (≤767px): the same stages as an accordion, each ending with "Next: …".
 *
 * Datasource template: Lifecycle
 *   Heading, Intro, Stages (Lifecycle Stage items)
 *   StagesLabel, StageLabel, OfLabel, ServicesLabel, PreviousLabel, NextLabel — interface text
 * Lifecycle Stage: Title, Body, Image, Services (Service Link items)
 * Service Link: Link (a service page of the site)
 */
type ServiceLink = { id?: string; fields: { Link: LinkField } };
type Stage = { id?: string; fields: { Title: TextField; Body: TextField; Image: ImageField; Services: ServiceLink[] } };
type LifecycleFields = {
  Heading: TextField;
  Intro: TextField;
  Stages: Stage[];
  StagesLabel: TextField;
  StageLabel: TextField;
  OfLabel: TextField;
  ServicesLabel: TextField;
  PreviousLabel: TextField;
  NextLabel: TextField;
};
type LifecycleProps = ComponentProps & { fields: LifecycleFields };

const pad = (n: number) => String(n).padStart(2, '0');
const str = (f?: TextField) => (f?.value as string) ?? '';

function StageServices({ stage, label }: { stage: Stage; label: TextField }) {
  if (!stage.fields.Services?.length) return null;
  return (
    <div className="dy-route-services">
      <Text tag="span" field={label} />
      <ul>
        {stage.fields.Services.map((service, i) => (
          <li key={service.id ?? i}>
            <SiteLink field={service.fields.Link} arrow={false} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Default = ({ fields, params, rendering }: LifecycleProps) => {
  const phone = usePhone();
  const [active, setActive] = useState(0);
  // Phones: one stage open at a time, and all may be closed.
  const [open, setOpen] = useState<number | null>(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = `lifecycle-${rendering.uid ?? 'route'}`;
  const stages = fields?.Stages ?? [];
  const last = stages.length - 1;

  const select = useCallback((index: number, focus = false) => {
    setActive(index);
    if (focus) tabs.current[index]?.focus();
  }, []);

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (active + keys[e.key] + stages.length) % stages.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
  };

  const openStage = (index: number) => {
    setOpen(index);
    requestAnimationFrame(() => {
      const reduce = document.querySelector('[data-motion="off"]') !== null;
      document.getElementById(`${base}-item-${index}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  };

  const measure = (el: HTMLDivElement | null) => {
    // The ported accordion keyframes animate to this measured height.
    if (el) el.style.setProperty('--radix-accordion-content-height', `${el.scrollHeight}px`);
  };

  if (!fields) return null;

  return (
    <section id={params?.RenderingIdentifier || 'lifecycle'} className="dy-section dy-lifecycle">
      <div className="dy-section-heading">
        <Text tag="h2" field={fields.Heading} />
        <Text tag="p" field={fields.Intro} />
      </div>

      {phone ? (
        <div className="dy-route-accordion" aria-label={str(fields.StagesLabel) || undefined} role="group">
          {stages.map((stage, i) => {
            const isOpen = open === i;
            return (
              <div key={stage.id ?? i} id={`${base}-item-${i}`} className="dy-route-item" data-state={isOpen ? 'open' : 'closed'}>
                <h3 className="dy-accordion-head">
                  <button
                    type="button"
                    id={`${base}-head-${i}`}
                    className="dy-route-stop"
                    data-state={isOpen ? 'open' : 'closed'}
                    aria-expanded={isOpen}
                    aria-controls={`${base}-region-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{pad(i + 1)}</span>
                    <Text field={stage.fields.Title} />
                    <ChevronDown className="dy-chevron" aria-hidden="true" />
                  </button>
                </h3>
                {isOpen && (
                  <div
                    ref={measure}
                    id={`${base}-region-${i}`}
                    role="region"
                    aria-labelledby={`${base}-head-${i}`}
                    className="dy-accordion-content"
                    data-state="open"
                  >
                    <div className="dy-route-panel">
                      <ContentSdkImage field={stage.fields.Image} loading="lazy" sizes="100vw" />
                      <div className="dy-route-copy">
                        <Text tag="p" field={stage.fields.Body} />
                        <StageServices stage={stage} label={fields.ServicesLabel} />
                        {i < last && (
                          <button type="button" className="dy-text-link dy-route-next" onClick={() => openStage(i + 1)}>
                            {str(fields.NextLabel)}: {str(stages[i + 1].fields.Title)}
                            <ArrowRight size={17} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div role="tablist" aria-label={str(fields.StagesLabel) || undefined} className="dy-route-track" onKeyDown={onTabKey}>
            {stages.map((stage, i) => (
              <button
                key={stage.id ?? i}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${base}-tab-${i}`}
                aria-selected={active === i}
                aria-controls={`${base}-panel-${i}`}
                tabIndex={active === i ? 0 : -1}
                data-state={active === i ? 'active' : 'inactive'}
                className="dy-route-stop"
                onClick={() => select(i)}
              >
                <span>{pad(i + 1)}</span>
                <Text field={stage.fields.Title} />
              </button>
            ))}
          </div>
          <div className="dy-panel-stack">
            {stages.map((stage, i) => {
              const current = active === i;
              return (
                <div
                  key={stage.id ?? i}
                  role="tabpanel"
                  id={`${base}-panel-${i}`}
                  aria-labelledby={`${base}-tab-${i}`}
                  data-state={current ? 'active' : 'inactive'}
                  aria-hidden={!current || undefined}
                  inert={!current || undefined}
                  className="dy-route-panel"
                >
                  <ContentSdkImage field={stage.fields.Image} loading="lazy" sizes="(min-width: 1024px) 45vw, 100vw" />
                  <div className="dy-route-copy">
                    <span className="dy-route-eyebrow">
                      {str(fields.StageLabel)} {pad(i + 1)} {str(fields.OfLabel)} {pad(stages.length)}
                    </span>
                    <Text tag="h3" field={stage.fields.Title} />
                    <Text tag="p" field={stage.fields.Body} />
                    <StageServices stage={stage} label={fields.ServicesLabel} />
                    <div className="dy-route-nav">
                      <button type="button" className="dy-button dy-button--outline" disabled={i === 0} onClick={() => select(i - 1)}>
                        <ArrowLeft size={17} aria-hidden="true" />
                        {str(fields.PreviousLabel)}
                      </button>
                      <button type="button" className="dy-button dy-button--outline" disabled={i === last} onClick={() => select(i + 1)}>
                        {str(fields.NextLabel)}
                        <ArrowRight size={17} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};
