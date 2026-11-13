import { createContext } from 'react';
import type { Filters } from '@workspace/dycom-brand';
import type { Company } from '@workspace/dycom-network-map/companies';

/** Live examples share one roles drawer and one selected company, owned by the app (or the frame) that mounts them. */
export type ExampleHandlers = {
  openRoles: (patch?: Partial<Filters>) => void;
  selectedCompany: Company | null;
  selectCompany: (c: Company) => void;
  motionOff: boolean;
  toggleMotion: () => void;
};
export const ExampleContext = createContext<ExampleHandlers>({ openRoles: () => undefined, selectedCompany: null, selectCompany: () => undefined, motionOff: false, toggleMotion: () => undefined });
