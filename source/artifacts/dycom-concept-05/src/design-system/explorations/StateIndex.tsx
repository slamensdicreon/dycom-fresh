// Exploration 05 — no map. A grid of square state tiles in the rough shape of
// the country; each tile carries its company count and opens the state's list.
// Choosing a company slides the tile grid out and shows its details in that
// space; the state's list stays beside it, so another company is one click.
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ExampleContext } from '../examples/context';
import { CompanyDetail, ExplorationRoot, companies, rolesLine, type Company } from './shared';

// Tile positions: the familiar square-tile cartogram, 12 columns by 8 rows.
const TILES: Record<string, [number, number]> = {
  AK: [0, 0], ME: [11, 0],
  VT: [10, 1], NH: [11, 1],
  WA: [1, 2], ID: [2, 2], MT: [3, 2], ND: [4, 2], MN: [5, 2], IL: [6, 2], WI: [7, 2], MI: [8, 2], NY: [9, 2], RI: [10, 2], MA: [11, 2],
  OR: [1, 3], NV: [2, 3], WY: [3, 3], SD: [4, 3], IA: [5, 3], IN: [6, 3], OH: [7, 3], PA: [8, 3], NJ: [9, 3], CT: [10, 3],
  CA: [1, 4], UT: [2, 4], CO: [3, 4], NE: [4, 4], MO: [5, 4], KY: [6, 4], WV: [7, 4], VA: [8, 4], MD: [9, 4], DE: [10, 4],
  AZ: [2, 5], NM: [3, 5], KS: [4, 5], AR: [5, 5], TN: [6, 5], NC: [7, 5], SC: [8, 5], DC: [9, 5],
  OK: [4, 6], LA: [5, 6], MS: [6, 6], AL: [7, 6], GA: [8, 6],
  HI: [0, 7], TX: [4, 7], FL: [8, 7],
};

const STATE_NAMES: Record<string, string> = {
  AK: 'Alaska', AL: 'Alabama', AR: 'Arkansas', AZ: 'Arizona', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DC: 'District of Columbia', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', IA: 'Iowa', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', MA: 'Massachusetts', MD: 'Maryland', ME: 'Maine', MI: 'Michigan', MN: 'Minnesota', MO: 'Missouri', MS: 'Mississippi', MT: 'Montana', NC: 'North Carolina', ND: 'North Dakota', NE: 'Nebraska', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NV: 'Nevada', NY: 'New York', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VA: 'Virginia', VT: 'Vermont', WA: 'Washington', WI: 'Wisconsin', WV: 'West Virginia', WY: 'Wyoming',
};

export default function StateIndex() {
  const byState = useMemo(() => {
    const m = new Map<string, typeof companies>();
    for (const c of companies) m.set(c.state, [...(m.get(c.state) ?? []), c]);
    return m;
  }, []);
  const withOffices = [...byState.keys()].sort();
  const [state, setState] = useState<string>(withOffices.includes('FL') ? 'FL' : withOffices[0]);
  const [company, setCompany] = useState<Company | null>(null);
  const { openRoles, selectCompany } = useContext(ExampleContext);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const list = byState.get(state) ?? [];
  const statesCovered = withOffices.length;

  const show = (c: Company) => { setCompany(c); setState(c.state); selectCompany(c); };
  const close = () => {
    setCompany(null);
    // Focus goes back to the state's tile once the grid is interactive again.
    requestAnimationFrame(() => document.getElementById(`dycom-x-tile-${state}`)?.focus({ preventScroll: true }));
  };
  // Escape returns to the map; focus moves to the detail's heading on open so keyboard and screen-reader visitors land in it.
  useEffect(() => {
    if (!company) return;
    detailHeading.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [company]);

  return (
    <ExplorationRoot id="state-index" state="ready">
      <div className={`dycom-x__state${company ? ' is-detail' : ''}`}>
        <div className="dycom-x__state-stage">
          <div className="dycom-x__state-grid-wrap" aria-hidden={company ? true : undefined} inert={company ? true : undefined}>
            <div className="dycom-c5__map-summary"><strong>{companies.length} local names</strong><span>home offices in {statesCovered} states</span></div>
            <div className="dycom-x__state-grid" role="listbox" aria-label="States, as tiles" aria-activedescendant={`dycom-x-tile-${state}`}>
              {Object.entries(TILES).map(([abbr, [col, row]]) => {
                const count = byState.get(abbr)?.length ?? 0;
                const active = abbr === state;
                return (
                  <button
                    key={abbr}
                    id={`dycom-x-tile-${abbr}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    disabled={count === 0}
                    className={`dycom-x__tile${count ? ' has-offices' : ''}${active ? ' is-active' : ''}`}
                    style={{ gridColumn: col + 1, gridRow: row + 1 }}
                    onClick={() => setState(abbr)}
                    onMouseEnter={() => count && setState(abbr)}
                    onFocus={() => count && setState(abbr)}
                    aria-label={`${STATE_NAMES[abbr]}${count ? `, ${count} ${count === 1 ? 'company' : 'companies'}` : ', no home office'}`}
                  >
                    <span>{abbr}</span>
                    {count > 0 && <b>{count}</b>}
                  </button>
                );
              })}
            </div>
            <p className="dycom-x__state-key"><i className="has-offices" aria-hidden="true" />Home office in this state<i aria-hidden="true" />No home office</p>
          </div>
          {company && (
            <section className="dycom-x__state-detail" aria-label={company.name}>
              <button type="button" className="dycom-x__state-back" onClick={close}><ArrowLeft size={18} aria-hidden="true" />Back to the map</button>
              <h3 ref={detailHeading} tabIndex={-1}>{company.name}</h3>
              <CompanyDetail company={company} onRoles={(c) => openRoles({ companyId: c.id })} />
            </section>
          )}
        </div>
        <div className="dycom-x__state-panel" aria-live="polite">
          <h3>{STATE_NAMES[state]}</h3>
          <p>{list.length} {list.length === 1 ? 'company' : 'companies'} with a home office here. Offices are home bases, not service areas.</p>
          <div className="dycom-c5__company-list" style={{ height: 'auto' }}>
            {list.map((c) => (
              <button type="button" key={c.id} className={`dycom-c5__company-row${company?.id === c.id ? ' is-active' : ''}`} aria-current={company?.id === c.id ? true : undefined} onClick={() => show(c)}>
                <span><strong>{c.name}</strong><small>{rolesLine(c)}</small></span>
                <ArrowRight size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </ExplorationRoot>
  );
}
