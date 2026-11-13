import { useEffect, useState } from 'react';
import type { Company } from '@workspace/dycom-network-map/companies';
import { SiteHeader } from './components/SiteHeader';
import { Hero } from './components/Hero';
import { RolesDrawer } from './components/RolesDrawer';
import { BrandFilm, BrandStatement, Careers, Closing, Companies, HowWeWork, Investors, Lifecycle, Pathways, ResourceCenter, SiteFooter, Strengths, WhatWeDo, WhoWeAre, WhoWeBuildFor } from './components/sections';
import { emptyFilters, type Filters } from './jobs';
import { useMotionPreference } from './motion';
import { showChapter } from './presentation';
import './_group.css';
import './ConsolidatedV2.css';

export function ConsolidatedV2() {
  const [motionOff, setMotionOff] = useMotionPreference();
  const [rolesOpen, setRolesOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  useEffect(() => {
    // Title pattern from Dycom's content template ("Page title | Dycom"); the SEO title is still to come.
    document.title = 'Home | Dycom';
  }, []);

  const openRoles = (patch: Partial<Filters> = {}) => {
    setFilters({ ...emptyFilters, ...patch });
    setRolesOpen(true);
  };
  const updateFilters = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }));

  return (
    <main className="dycom-c5 dycom-consolidated-v2" data-motion={motionOff ? 'off' : 'on'}>
      <SiteHeader onJobs={() => openRoles()} />
      <Hero motionOff={motionOff} />
      <Pathways openRoles={openRoles} />
      <WhoWeAre />
      <BrandFilm motionOff={motionOff} />
      <Companies onSelect={setSelectedCompany} openRoles={openRoles} />
      {/* Chapters listed in presentation.ts are held back for the leadership presentation, not removed. */}
      {showChapter('what-we-do') && <WhatWeDo />}
      <Strengths />
      <BrandStatement />
      {showChapter('customers') && <WhoWeBuildFor />}
      <Lifecycle />
      {showChapter('how-we-work') && <HowWeWork />}
      {showChapter('careers') && <Careers openRoles={openRoles} />}
      {showChapter('investors') && <Investors />}
      {showChapter('resources') && <ResourceCenter />}
      <Closing selectedCompany={selectedCompany} openRoles={openRoles} />
      <SiteFooter motionOff={motionOff} onToggleMotion={() => setMotionOff((value) => !value)} />
      <RolesDrawer open={rolesOpen} onClose={() => setRolesOpen(false)} filters={filters} update={updateFilters} />
    </main>
  );
}

export default ConsolidatedV2;
