import { useState } from 'react';
import { SiteHeader, Hero, RolesDrawer, Careers, Closing, Companies, HowWeWork, Investors, Pathways, ResourceCenter, SiteFooter, WhatWeDo, WhoWeAre, emptyFilters, type Filters, useMotionPreference } from '@workspace/dycom-brand';
import type { Company } from '@workspace/dycom-network-map/companies';
import { usePageEffects } from '@/lib/router';

export default function Home() {
  const [motionOff, setMotionOff] = useMotionPreference();
  const [rolesOpen, setRolesOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  usePageEffects('home');

  const openRoles = (patch: Partial<Filters> = {}) => { setFilters({ ...emptyFilters, ...patch }); setRolesOpen(true); };
  const updateFilters = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <main className="dycom-c5" data-motion={motionOff ? 'off' : 'on'}>
      <SiteHeader onJobs={() => openRoles()} />
      <Hero motionOff={motionOff} />
      <Pathways />
      <WhoWeAre />
      <Companies onSelect={setSelectedCompany} openRoles={openRoles} />
      <WhatWeDo />
      <HowWeWork />
      <Careers openRoles={openRoles} />
      <Investors />
      <ResourceCenter />
      <Closing selectedCompany={selectedCompany} openRoles={() => openRoles()} />
      <SiteFooter motionOff={motionOff} onToggleMotion={() => setMotionOff((v) => !v)} />
      <RolesDrawer open={rolesOpen} onClose={() => setRolesOpen(false)} filters={filters} update={updateFilters} />
    </main>
  );
}
