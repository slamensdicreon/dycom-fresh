// Exploration 01 — the map exactly as the Consolidated direction draws it.
import { useContext } from 'react';
import { CompanyNetwork } from '@workspace/dycom-brand';
import { ExampleContext } from '../examples/context';
import { ExplorationRoot } from './shared';

export default function AtlasDirectory() {
  const { selectCompany, openRoles } = useContext(ExampleContext);
  return (
    <ExplorationRoot id="atlas-directory" state="ready">
      <div className="dycom-x__pad">
        <CompanyNetwork onSelect={selectCompany} onRoles={(id) => openRoles({ companyId: id })} />
      </div>
    </ExplorationRoot>
  );
}
