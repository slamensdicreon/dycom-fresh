// The framed examples: what each bare `example/<id>/` address renders. Every
// entry is the real component of the Consolidated V2 site (src/v2), mounted
// alone so a stage can show it at a true viewport width. Frame heights live in
// frames.ts. The system documents V2, which replaced the original Consolidated
// homepage and Investors page as the reference in October 2026.
import type { ReactNode } from 'react';
import { DEFAULT_MAP_VARIANT, MAP_LAYOUTS, MAP_MARKERS, MAP_TREATMENTS, type MapLayout, type MapMarker, type MapTreatment } from '../../v2/map-variants';
import { SiteHeader } from '../../v2/components/SiteHeader';
import { Hero } from '../../v2/components/Hero';
import { CompanyNetwork } from '../../v2/components/CompanyNetwork';
import { BrandFilm, BrandStatement, Careers, Closing, Companies, HowWeWork, Investors, Lifecycle, Pathways, ResourceCenter, SiteFooter, Strengths, WhatWeDo, WhoWeAre, WhoWeBuildFor } from '../../v2/components/sections';
import type { ExampleHandlers } from './context';
import { LiveExploration } from '../explorations';
import type { ExampleId } from '../router';

export type Example = { render: (ctx: ExampleHandlers, params: URLSearchParams) => ReactNode };

const pick = <T extends string>(options: { id: T }[], value: string | null, fallback: T): T => (options.some((o) => o.id === value) ? (value as T) : fallback);

export const EXAMPLES: Record<ExampleId, Example> = {
  header: { render: (ctx) => <SiteHeader onJobs={() => ctx.openRoles()} /> },
  hero: { render: (ctx) => <Hero motionOff={ctx.motionOff} /> }, // `?hero=still` on the frame address selects the still variant
  'heading-band': { render: () => <div className="dycom-ds__only-heading"><WhatWeDo /></div> },
  'who-we-are': { render: () => <WhoWeAre /> },
  'what-we-do': { render: () => <WhatWeDo /> },
  lifecycle: { render: () => <Lifecycle /> },
  'who-we-build-for': { render: () => <WhoWeBuildFor /> },
  'how-we-work': { render: () => <HowWeWork /> },
  closing: { render: (ctx) => <Closing selectedCompany={ctx.selectedCompany} openRoles={() => ctx.openRoles()} /> },
  pathways: { render: () => <Pathways /> },
  investors: { render: () => <Investors /> },
  careers: { render: (ctx) => <Careers openRoles={ctx.openRoles} /> },
  'resource-center': { render: () => <ResourceCenter /> },
  'brand-film': { render: (ctx) => <BrandFilm motionOff={ctx.motionOff} /> },
  strengths: { render: () => <Strengths /> },
  'brand-statement': { render: () => <BrandStatement /> },
  footer: { render: (ctx) => <SiteFooter motionOff={ctx.motionOff} onToggleMotion={ctx.toggleMotion} homeHref="#top" /> },
  companies: { render: (ctx) => <Companies onSelect={ctx.selectCompany} openRoles={ctx.openRoles} /> },
  'closing-footer': {
    render: (ctx) => (
      <>
        <Closing selectedCompany={ctx.selectedCompany} openRoles={() => ctx.openRoles()} />
        <SiteFooter motionOff={ctx.motionOff} onToggleMotion={ctx.toggleMotion} homeHref="#top" />
      </>
    ),
  },
  'company-map': {
    render: (ctx, params) => (
      <div style={{ padding: 'clamp(16px, 3vw, 40px)' }}>
        <CompanyNetwork
          treatment={pick<MapTreatment>(MAP_TREATMENTS, params.get('treatment'), DEFAULT_MAP_VARIANT.treatment)}
          marker={pick<MapMarker>(MAP_MARKERS, params.get('marker'), DEFAULT_MAP_VARIANT.marker)}
          layout={pick<MapLayout>(MAP_LAYOUTS, params.get('layout'), DEFAULT_MAP_VARIANT.layout)}
          onSelect={ctx.selectCompany}
          onRoles={(id) => ctx.openRoles({ companyId: id })}
        />
      </div>
    ),
  },
  'exploration-atlas-directory': { render: () => <LiveExploration id="atlas-directory" /> },
  'exploration-street-map': { render: () => <LiveExploration id="street-map" /> },
  'exploration-relief-model': { render: () => <LiveExploration id="relief-model" /> },
  'exploration-near-you': { render: () => <LiveExploration id="near-you" /> },
  'exploration-state-index': { render: () => <LiveExploration id="state-index" /> },
};
