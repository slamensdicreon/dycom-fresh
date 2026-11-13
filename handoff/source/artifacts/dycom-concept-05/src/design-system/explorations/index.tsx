// The undecided company-map interactions: the registry (what each one is, in
// Dycom's terms), the overview page that compares them and the frame page
// that presents one at a time with its trade-offs.
import { Suspense, lazy, useContext, type ComponentType } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PAGES } from '../catalog';
import { EXPLORATIONS_PAGE, EXPLORATION_IDS, MAP_PAGE, dsHref, explorationPath, type ExplorationId } from '../router';
import { PageHead, Prose, Section } from '../shell';
import { Framed } from '../examples/Framed';
import { ExampleContext } from '../examples/context';
import { MotionContext } from './shared';
import './explorations.css';

export type Exploration = {
  id: ExplorationId;
  name: string;
  /** What the visitor does, in one line. */
  gesture: string;
  /** The visitor it serves best. */
  bestFor: string;
  depends: string;
  howItWorks: string[];
  strengths: string[];
  tradeoffs: string[];
  phones: string;
  /** Where it departs from the rules the Final Design Direction set. */
  bends: string[];
  stageNote: string;
};

export const EXPLORATIONS: Exploration[] = [
  {
    id: 'atlas-directory',
    name: 'Atlas & directory',
    gesture: 'Scan the country, search the list.',
    bestFor: 'Visitors who want the national picture and the name in one glance.',
    depends: 'Nothing beyond the site itself. Works everywhere, instantly.',
    howItWorks: ['A still atlas of the lower 48 shows every home office as a square. Shared addresses show a count.', 'Hovering a square highlights its companies in the directory, and hovering a row pulses its square on the map.', 'The directory filters by city, ZIP or company name, and by region.', 'Selecting either side opens the company card with the home office, website, careers link and open roles.'],
    strengths: ['Nothing to learn and nothing to wait for; the whole picture is visible at once.', 'Fully on brand: square markers, halftone land, no imagery that competes with the photography.', 'Accessible by keyboard and screen reader without special handling.'],
    tradeoffs: ['The Southeast is crowded; squares overlap around Florida and Georgia at smaller sizes.', 'There is no sense of distance or place beyond the state outline.', 'Visitors cannot zoom, so “near me” is a mental exercise.'],
    phones: 'The map is hidden and the directory stands alone, as the Final Design Direction already specifies.',
    bends: [],
    stageNote: 'This is the map as the Final Design Direction draws it today, unchanged.',
  },
  {
    id: 'street-map',
    name: 'Street map',
    gesture: 'Pan and zoom until the offices separate.',
    bestFor: 'Visitors who think in places — a county, a corridor, a metro — and expect a map to behave like the ones on their phone.',
    depends: 'A mapping service for the tiles (OpenStreetMap here; a commercial provider in production) and WebGL in the browser.',
    howItWorks: ['The country loads from a street-map service, drawn in greyscale: roads, water and labels in grey on paper, so Civic Blue is the only colour on the map and the brand supplies every accent.', 'Offices close together group into one square with a count until the map is zoomed in enough to separate them.', 'The list beside the map always shows the companies in the current view, so moving the map is the filter.', 'Region buttons jump the view; typing a name and pressing Enter flies to that company.', 'Selecting a square or a row opens the same company card.'],
    strengths: ['Real geography: roads, rivers and city names give the offices context the atlas cannot.', 'The greyscale basemap keeps the brand in charge: the markers, counts and controls are the only colour, in Civic Blue, with Signal Green for hover and selection.', 'Scales to any number of companies; the clustering absorbs growth.', 'Familiar gestures, nothing to explain.'],
    tradeoffs: ['Depends on a third-party service, with its own attribution and terms; the greyscale treatment is applied in the browser, so the service still decides what is drawn.', 'A moving map needs more care for keyboard and screen-reader visitors.', 'Heavier to load than anything else on the page.'],
    phones: 'The map stays, stacked above the list, at about half the screen; the list below follows the view.',
    bends: ['Shows a third-party basemap, which the component rules currently forbid.', 'Pans and zooms on selection, which the motion rules currently forbid.'],
    stageNote: 'Hold Ctrl (⌘ on Mac) while scrolling to zoom, or use the + and − controls. In automated checks the tiles are replaced with blank paper.',
  },
  {
    id: 'relief-model',
    name: 'Relief model',
    gesture: 'Turn and tilt the country; the offices stand up.',
    bestFor: 'A memorable first impression: the “national capability” line, made physical.',
    depends: 'WebGL in the browser (three.js). Falls back to the still atlas without it.',
    howItWorks: ['The 48 states are extruded into a low relief model in Civic Blue, built from the same outlines as the atlas. The model fills the whole stage; there is no list beside it.', 'Each home office is a white post; posts are taller where several companies share an address.', 'Drag to turn, drag up or down to tilt, pinch or Ctrl-scroll to zoom. It never moves on its own.', 'Hovering a post names its companies. Selecting a post opens a small tile beside it with the city, each company there and its open roles, and the website and roles actions; selecting another post swaps the tile.', 'A “Find an office” control above the model lists the 31 home offices by region; choosing one turns the model to that post and opens its tile.'],
    strengths: ['Distinctive — no competitor’s company map looks like this.', 'Shared addresses are legible at a glance as taller posts.', 'Built entirely from the brand: Civic, white and green, square geometry, no circles.', 'Nothing leaves the model: the tile sits where the office is, so the visitor keeps their place.'],
    tradeoffs: ['Novelty wears; the third visit wants a list, not a model.', 'Needs WebGL and a reasonable device; older laptops and low-power phones will struggle.', 'Precise place-finding is harder than on a flat map; the office control exists to make up for it.'],
    phones: 'The model stays at a reduced height with touch to turn, with the office control above it. On devices without WebGL the atlas and directory take over.',
    bends: ['Moves in three dimensions under the visitor’s hand, well beyond the draw-in and retract vocabulary of the motion rules.', 'Opens a tile in place rather than the company card dialog.'],
    stageNote: 'Drag to turn. Posts turn Signal Green under the pointer; select one, or choose an office above, to open its tile.',
  },
  {
    id: 'near-you',
    name: 'Near you',
    gesture: 'Say where you are; see what is close.',
    bestFor: 'Candidates and customers with a practical question: who is near me?',
    depends: 'A mapping service for the basemap (OpenFreeMap’s Positron style here — no key or account, and allowed in production) and WebGL. Typed places use a built-in list of cities and states; “Use my location” asks the browser’s permission.',
    howItWorks: ['One compact bar asks where you are: a field that accepts a city, a state or a ZIP, a Find button, and “Use my location”.', 'A light-grey basemap shows every home office before a place is entered. Once one is, the map zooms to the visitor and the closest offices, marks the visitor with a green square, numbers the offices and draws a line to each.', 'Beneath the map the closest offices appear as a grid of tiles — rank, distance, city and the companies there — six at a time, with “Show six more”.', 'Pointing at a tile highlights its marker, and pointing at a marker highlights its tile. A tile’s company opens the same company card.'],
    strengths: ['Answers the question most visitors actually have, in one step, and shows the answer on real geography.', 'The grid reads faster than a long list; six tiles is one glance.', 'Uses a different map service than the street map, so the two can be compared on cost and look before production.'],
    tradeoffs: ['Straight-line distance is a guide, not a drive time.', 'Visitors who do not want to say where they are get the national picture only.', 'Depends on a mapping service and WebGL; without them the still atlas takes the map’s place.'],
    phones: 'The bar, then the grid in a single column; the map is hidden, in keeping with the no-map-on-phones rule.',
    bends: ['Asks for the visitor’s location (with permission), which no current chapter does.', 'Shows a third-party basemap and zooms on its own once a place is set, which the component and motion rules currently forbid.'],
    stageNote: 'Try “Tampa, FL”, “Ohio” or a ZIP such as 30022. In automated checks the basemap is replaced with blank paper.',
  },
  {
    id: 'state-index',
    name: 'State index',
    gesture: 'Pick a state tile; read its companies.',
    bestFor: 'Visitors who know the state and want the shortest path to a name, and anyone who finds maps hard to read.',
    depends: 'Nothing beyond the site itself.',
    howItWorks: ['Fifty-one square tiles are arranged in the familiar shape of the country. Tiles with a home office are Civic Blue and carry their count; the rest are quiet.', 'Hovering or selecting a tile lists that state’s companies beside the grid.', 'Selecting a company slides the tile grid aside and shows the company’s details in its place — home office, the companies sharing the address, what they do, careers and website — with “Back to the map” at the top. The state’s list stays beside it, so another company opens without going back.', 'Nothing zooms or needs a service; the only movement is the grid sliding out and back.'],
    strengths: ['The most on-brand option: it is literally made of squares.', 'Every state is the same size, so Delaware is as easy to hit as Texas, and the Southeast is no longer crowded.', 'Lightweight, accessible and identical on every device; no dialog interrupts the page.'],
    tradeoffs: ['Abstract; some visitors have to think twice about where a tile is.', 'No geography inside a state — a company in El Paso and one in Houston share a tile.', 'Less of a visual centrepiece than the map or the model.'],
    phones: 'The tile grid shrinks to fit the width and the state list follows below it; it is the only option that keeps a “map” on phones without breaking the spirit of the rule. Company details take the grid’s place in the same way.',
    bends: ['Replaces the map with a cartogram, so the chapter would no longer contain a map at all.', 'Shows company details in place rather than in the company card dialog.'],
    stageNote: 'Hover or tap a blue tile, then select a company to read about it in place. Grey tiles have no home office.',
  },
];

export const explorationById = (id: ExplorationId) => EXPLORATIONS.find((e) => e.id === id)!;

const COMPONENTS: Record<ExplorationId, ComponentType> = {
  'atlas-directory': lazy(() => import('./AtlasDirectory')),
  'street-map': lazy(() => import('./StreetMap')),
  'relief-model': lazy(() => import('./ReliefModel')),
  'near-you': lazy(() => import('./NearYou')),
  'state-index': lazy(() => import('./StateIndex')),
};

function Loading() {
  return <div className="dycom-x dycom-x__loading" data-state="loading" role="status"><p>Loading the example…</p></div>;
}

/** One exploration, mounted live. Rendered inside a framed example. */
export function LiveExploration({ id }: { id: ExplorationId }) {
  const { motionOff } = useContext(ExampleContext);
  const Component = COMPONENTS[id];
  return (
    <MotionContext.Provider value={motionOff}>
      <Suspense fallback={<Loading />}><Component /></Suspense>
    </MotionContext.Provider>
  );
}

const GROUP = 'Undecided interactions';
const number = (id: ExplorationId) => String(EXPLORATION_IDS.indexOf(id) + 1).padStart(2, '0');

export function ExplorationsIndexPage() {
  const meta = PAGES[EXPLORATIONS_PAGE];
  return (
    <>
      <PageHead group={GROUP} title={meta.title} summary={meta.summary} />
      <Section id="question" title="The open question">
        <Prose>
          <p>Everything else on the homepage has a settled shape. The company map does not. The question is not how it should look — it is <strong>what a visitor should do</strong> to find a company: scan a map, zoom a map, turn a model, say where they are, or pick a state. Each answer is a different piece of software with different strengths, so the five below are built, not sketched, with the real 39 companies and the same company card at the end of every path.</p>
          <p>Nothing here is a recommendation. Visit each one, use it, and leave a pin on the page where something felt right or wrong. The pages are numbered so they can be referred to by number.</p>
        </Prose>
        <div className="dycom-ds__pillars">
          <div><strong>Fixed in every option</strong><p>The 39 companies and 31 home offices. Home offices, not service areas. Square markers, never a signal mark or a teardrop. The same company card, roles drawer and brand palette.</p></div>
          <div><strong>Open</strong><p>Whether the map moves, zooms or tilts. Whether a mapping service is involved. Whether phones get a map. Whether the chapter is a tool or a story. Whether the visitor is asked where they are.</p></div>
          <div><strong>How to decide</strong><p>Think about who arrives at the homepage most: candidates, customers, investors, press. Each option favours one of them; the comparison at the foot of this page says which.</p></div>
        </div>
      </Section>
      <Section id="options" title="Five interaction models">
        <ol className="dycom-x__cards">
          {EXPLORATIONS.map((e) => (
            <li key={e.id}>
              <a href={dsHref(explorationPath(e.id))} className="dycom-x__card">
                <span className="dycom-x__card-number">{number(e.id)}</span>
                <strong>{e.name}</strong>
                <span className="dycom-x__card-gesture">{e.gesture}</span>
                <p>{PAGES[explorationPath(e.id)].summary}</p>
                <small>Needs: {e.depends}</small>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </Section>
      <Section id="compare" title="Side by side">
        <div className="dycom-x__compare-wrap">
          <table className="dycom-ds__tokens dycom-x__compare">
            <thead><tr><th scope="col">Option</th><th scope="col">Best for</th><th scope="col">Depends on</th><th scope="col">On phones</th><th scope="col">Departs from current rules</th></tr></thead>
            <tbody>
              {EXPLORATIONS.map((e) => (
                <tr key={e.id}>
                  <th scope="row"><a href={dsHref(explorationPath(e.id))}>{number(e.id)} {e.name}</a></th>
                  <td>{e.bestFor}</td>
                  <td>{e.depends}</td>
                  <td>{e.phones}</td>
                  <td>{e.bends.length ? <ul>{e.bends.map((b) => <li key={b}>{b}</li>)}</ul> : 'Nothing; this is the current rule set.'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="dycom-x__foot-link"><a className="dycom-c5__text-link" href={dsHref(MAP_PAGE)}>The map component as it stands today<ArrowRight size={17} aria-hidden="true" /></a></p>
      </Section>
    </>
  );
}

export function ExplorationPage({ id }: { id: ExplorationId }) {
  const e = explorationById(id);
  const meta = PAGES[explorationPath(id)];
  const index = EXPLORATION_IDS.indexOf(id);
  const prev = index > 0 ? EXPLORATION_IDS[index - 1] : null;
  const next = index < EXPLORATION_IDS.length - 1 ? EXPLORATION_IDS[index + 1] : null;
  return (
    <>
      <PageHead group={GROUP} groupHref={dsHref(EXPLORATIONS_PAGE)} title={`${number(id)} ${meta.title}`} summary={meta.summary}>
        <p className="dycom-x__gesture">{e.gesture}</p>
      </PageHead>
      <Section id="try" title="Try it">
        <Framed label={e.name} example={`exploration-${id}`} note={e.stageNote} />
      </Section>
      <Section id="how" title="How it works">
        <Prose><ol>{e.howItWorks.map((s) => <li key={s}>{s}</li>)}</ol></Prose>
      </Section>
      <Section id="weigh" title="Weighing it">
        <div className="dycom-ds__rules dycom-x__weigh">
          <div><h3>Strengths</h3><ul>{e.strengths.map((s) => <li key={s}>{s}</li>)}</ul></div>
          <div className="is-dont"><h3>Trade-offs</h3><ul>{e.tradeoffs.map((s) => <li key={s}>{s}</li>)}</ul></div>
        </div>
        <div className="dycom-ds__pillars">
          <div><strong>Best for</strong><p>{e.bestFor}</p></div>
          <div><strong>On phones</strong><p>{e.phones}</p></div>
          <div><strong>Depends on</strong><p>{e.depends}</p></div>
          <div><strong>Departs from current rules</strong>{e.bends.length ? <ul className="dycom-x__bends">{e.bends.map((b) => <li key={b}>{b}</li>)}</ul> : <p>Nothing. This option is the current rule set.</p>}</div>
        </div>
      </Section>
      <nav className="dycom-x__pager" aria-label="Other interaction models">
        {prev ? <a href={dsHref(explorationPath(prev))}><ArrowLeft size={17} aria-hidden="true" /><span><small>Previous</small>{number(prev)} {explorationById(prev).name}</span></a> : <span />}
        <a href={dsHref(EXPLORATIONS_PAGE)} className="dycom-x__pager-all">All five</a>
        {next ? <a href={dsHref(explorationPath(next))} className="is-next"><span><small>Next</small>{number(next)} {explorationById(next).name}</span><ArrowRight size={17} aria-hidden="true" /></a> : <span />}
      </nav>
    </>
  );
}
