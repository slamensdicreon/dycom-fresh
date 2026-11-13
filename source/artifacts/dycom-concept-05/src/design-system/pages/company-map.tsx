// Component page for the company map as the Consolidated direction draws it.
// The styling options (land, marker, layout) are a footnote here, switched in
// place; the real open question — how the map should behave — lives under
// Undecided interactions.
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { DEFAULT_MAP_VARIANT, MAP_LAYOUTS, MAP_MARKERS, MAP_TREATMENTS, type MapLayout, type MapMarker, type MapTreatment, type MapVariantOption } from '../../v2/map-variants';
import { head } from './components';
import { Prose, Rules, Section, TokenTable } from '../shell';
import { Framed } from '../examples/Framed';
import { EXPLORATIONS_PAGE, dsHref } from '../router';

type Variant = { treatment: MapTreatment; marker: MapMarker; layout: MapLayout };

function Options<T extends string>({ legend, list, value, onChange }: { legend: string; list: MapVariantOption<T>[]; value: T; onChange: (id: T) => void }) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      {list.map((o) => (
        <label key={o.id} className={o.id === value ? 'is-active' : undefined}>
          <input type="radio" name={legend} value={o.id} checked={o.id === value} onChange={() => onChange(o.id)} />
          <span>{o.name}</span>
          <small>{o.summary}</small>
        </label>
      ))}
    </fieldset>
  );
}

export function CompanyMapPage() {
  const [variant, setVariant] = useState<Variant>(DEFAULT_MAP_VARIANT);
  const isDefault = variant.treatment === DEFAULT_MAP_VARIANT.treatment && variant.marker === DEFAULT_MAP_VARIANT.marker && variant.layout === DEFAULT_MAP_VARIANT.layout;
  return (
    <>
      {head('components/company-map/')}
      <Section id="live" title="Live component">
        <Framed label="Company map + directory" example="company-map" params={isDefault ? undefined : variant} note="Hover a square or a directory row to see the pulse; select a company to open its card; “View open roles” opens the roles drawer. Links to other site pages are inert here." />
      </Section>
      <Section id="behaviour" title="How it behaves today">
        <Prose>
          <ul>
            <li><strong>Home offices, not territories.</strong> Each square is where a company is based. Several companies can share one address; the map does not call that out (client direction, 5 Nov 2026) — the directory and the card do the introducing.</li>
            <li><strong>Each side drives the other.</strong> Hovering a square highlights its companies in the directory; hovering a row pulses its square. A square pulse — never a circle.</li>
            <li><strong>Search and filter.</strong> City, ZIP or company name, plus a region select. An empty result offers to clear the filters.</li>
            <li><strong>Nearest first.</strong> A place that is not itself an office — a metro, a state, a ZIP — or “Use my location” becomes an origin: the directory ranks every office by miles from it and the same drawing frames the origin and its nearest offices (client direction, 5 Nov 2026: proximity like the Near-you exploration, in this map’s own finish). Squares keep their size as the view glides in; “Whole country” returns.</li>
            <li><strong>The card leads with the company’s own logo</strong> beside the close control, then the name in text, the home office and the roles.</li>
            <li><strong>Nothing else moves on its own.</strong> No panning or free zooming; the view only changes in answer to a place.</li>
            <li><strong>On phones</strong> the map is hidden and the directory stands alone.</li>
          </ul>
          <p>Whether this is the right behaviour is the open question. Five different interaction models — including this one — are built out under <a className="dycom-c5__text-link" href={dsHref(EXPLORATIONS_PAGE)}>Undecided interactions<ArrowRight size={17} aria-hidden="true" /></a>.</p>
        </Prose>
      </Section>
      <Section id="styling" title="Styling options">
        <Prose>
          <p>Separately from how the map behaves, the drawing itself has a few interchangeable finishes. They change the look only — the data, markers, pulse and card are identical. Switch them here and the example above updates.{!isDefault && ' Showing a non-default combination.'}</p>
        </Prose>
        <div className="dycom-ds__switcher dycom-ds__switcher--radios" aria-label="Styling options">
          <Options legend="Land" list={MAP_TREATMENTS} value={variant.treatment} onChange={(treatment) => setVariant((v) => ({ ...v, treatment }))} />
          <Options legend="Marker" list={MAP_MARKERS} value={variant.marker} onChange={(marker) => setVariant((v) => ({ ...v, marker }))} />
          <Options legend="Layout" list={MAP_LAYOUTS} value={variant.layout} onChange={(layout) => setVariant((v) => ({ ...v, layout }))} />
        </div>
        {!isDefault && <p style={{ marginTop: 16 }}><button type="button" className="dycom-c5__text-link" style={{ background: 'none', border: 0, padding: 0, font: 'inherit', cursor: 'pointer', boxShadow: 'none' }} onClick={() => setVariant(DEFAULT_MAP_VARIANT)}>Back to the Final Design Direction’s finish<ArrowRight size={17} aria-hidden="true" /></button></p>}
      </Section>
      <Section id="tokens" title="Tokens and rules">
        <TokenTable names={['--c5-civic', '--c5-civic-deep', '--c5-civic-soft', '--c5-green', '--c5-paper', '--c5-rule', '--c5-white']} />
        <Rules
          dos={['Keep the map on the brand palette: the Civic family, Paper, Fargo and White, with Signal Green only for the pulse and focus.', 'Keep the pulse ring square and the matching directory row highlighted, so colour is never the only cue.', 'Keep the static ring when Motion is off.', 'Keep the map at least 60% of the chapter width on desktop.']}
          donts={['No signal mark, teardrop pin or circular dot as a marker.', 'No service-territory shading; home offices only.', 'No auto-panning, zooming or fly-to on selection — unless one of the undecided interactions is adopted and this rule is revised with it.']}
        />
      </Section>
    </>
  );
}
