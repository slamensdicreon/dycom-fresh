'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/** Filters for the roles drawer — limited to facts the SuccessFactors feed supplies (brief §3). */
export type RoleFilters = { work: string; location: string; trade: string; companyId: string };
export const EMPTY_FILTERS: RoleFilters = { work: '', location: '', trade: '', companyId: '' };

/** The operating company a visitor selected on the map; the closing form names it. */
export type SelectedCompany = { id: string; name: string; city: string; state: string } | null;

type SiteUI = {
  motionOff: boolean;
  setMotionOff: (off: boolean) => void;
  rolesOpen: boolean;
  roleFilters: RoleFilters;
  openRoles: (filters?: Partial<RoleFilters>) => void;
  closeRoles: () => void;
  setRoleFilters: (update: Partial<RoleFilters>) => void;
  selectedCompany: SelectedCompany;
  setSelectedCompany: (company: SelectedCompany) => void;
};

const SiteUIContext = createContext<SiteUI | null>(null);
const MOTION_KEY = 'dycom:motion';

/**
 * Page-level state shared by independent renderings. In Sitecore each rendering is placed and
 * authored on its own, so cross-component behaviour (any careers action opens the one roles
 * drawer; the map selection feeds the closing form; the footer Motion control) lives here rather
 * than in props passed between components.
 *
 * Also renders the `.dy.dy-site` root that carries `data-motion` for the ported brand CSS.
 */
export function SiteUIProvider({ children }: { children: ReactNode }) {
  const [motionOff, setMotionOffState] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [roleFilters, setFilters] = useState<RoleFilters>(EMPTY_FILTERS);
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany>(null);

  // Motion: the visitor's footer choice wins; otherwise follow prefers-reduced-motion.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(MOTION_KEY);
    } catch {
      /* storage blocked */
    }
    const sync = () => setMotionOffState(stored ? stored === 'off' : query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const setMotionOff = useCallback((off: boolean) => {
    setMotionOffState(off);
    try {
      window.localStorage.setItem(MOTION_KEY, off ? 'off' : 'on');
    } catch {
      /* storage blocked */
    }
  }, []);

  const openRoles = useCallback((filters?: Partial<RoleFilters>) => {
    if (filters) setFilters({ ...EMPTY_FILTERS, ...filters });
    setRolesOpen(true);
  }, []);
  const closeRoles = useCallback(() => setRolesOpen(false), []);
  const setRoleFilters = useCallback((update: Partial<RoleFilters>) => setFilters((f) => ({ ...f, ...update })), []);

  // Any authored link to `#open-roles` opens the roles drawer (brief §6: every careers action opens
  // the drawer). Optional filters ride in the hash: `#open-roles?trade=Fiber%20splicing&company=3655`.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href^="#open-roles"]');
      if (!anchor) return;
      event.preventDefault();
      const query = new URLSearchParams(anchor.getAttribute('href')!.split('?')[1] ?? '');
      openRoles({
        trade: query.get('trade') ?? '',
        companyId: query.get('company') ?? '',
        location: query.get('location') ?? '',
        work: query.get('work') ?? '',
      });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [openRoles]);

  const value = useMemo(
    () => ({ motionOff, setMotionOff, rolesOpen, roleFilters, openRoles, closeRoles, setRoleFilters, selectedCompany, setSelectedCompany }),
    [motionOff, setMotionOff, rolesOpen, roleFilters, openRoles, closeRoles, setRoleFilters, selectedCompany]
  );

  return (
    <SiteUIContext.Provider value={value}>
      <div className="dy dy-site" data-motion={motionOff ? 'off' : 'on'}>
        {children}
      </div>
    </SiteUIContext.Provider>
  );
}

export function useSiteUI(): SiteUI {
  const ctx = useContext(SiteUIContext);
  if (!ctx) throw new Error('useSiteUI must be used inside <SiteUIProvider>');
  return ctx;
}

/** Matches the CSS phone breakpoint (≤767px). */
export function usePhone(): boolean {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const sync = () => setPhone(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  return phone;
}
