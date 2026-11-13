import { ArrowRight } from 'lucide-react';
import { V2_BASE } from '../../v2/site';
import { head } from './components';
import { GROUP_LABELS, Prose, Rules, Section, TokenTable, pagesIn } from '../shell';
import { Framed } from '../examples/Framed';
import { PAGES } from '../catalog';
import { DS_BASE, EXPLORATIONS_PAGE, PAGE_SLUGS, dsHref } from '../router';

export function DirectoryMapPage() {
  return (
    <>
      {head('patterns/directory-map/')}
      <Section id="composition" title="Composition">
        <Prose>
          <p>“Our companies” is the chapter with the most moving parts, so it is documented as a pattern rather than a single component. From top to bottom:</p>
          <ul>
            <li><strong>Heading band on Civic Blue</strong> — the chapter is the dark panel between Who we are and What we do: H2 “SCALE IS LOCAL. CAPABILITY IS NATIONAL.” in white and the one-paragraph intro that states offices are not territories.</li>
            <li><strong>Map + directory</strong> — the company map (see Company map, and the undecided interactions for how it might change) beside a searchable, filterable directory, both drawn for the dark surface: white rows and rules at 20% white, the selected row carrying a green edge; hovering either side highlights the other.</li>
            <li><strong>Company card</strong> — a dialog with the company’s name, home office, services, a “View open roles” action into the roles drawer, the operating-company website (the only link that leaves the site) and the companies that share the location.</li>
            <li><strong>Chapter footer</strong> — the count line and one button to the companies page.</li>
          </ul>
        </Prose>
        <Framed label="Companies chapter, as it stands today" example="companies" note="Links to site pages inside the example are inert here." />
        <Rules
          dos={['Keep the map at least 60% of the chapter width on desktop.', 'Keep the directory searchable by city, ZIP or company with a region filter.', 'Show the directory alone on phones.', 'Keep the chapter on Civic Blue; it is the one dark panel between two paper chapters.', 'Name the selected company in the closing chapter’s Customer prompt.']}
          donts={['No service-area shading.', 'No signal mark or circular pin on the map.', 'No auto-movement.']}
        />
      </Section>
    </>
  );
}

export function InvestorsTemplatePage() {
  const src = `${V2_BASE}investors/`;
  return (
    <>
      {head('templates/investors/')}
      <Section id="template" title="Interior page template">
        <Prose>
          <p>The Investors overview is the template every interior page follows. Its parts, in order:</p>
          <ul>
            <li><strong>Site header</strong> with the brand link returning home and <strong>Find a job</strong> opening the roles drawer.</li>
            <li><strong>Photographic hero</strong> — a full-width photograph under a Civic shade, with the back link, all-caps H1, overview paragraph and a listing block (signal mark, “LISTED”, “NYSE: DY”) set over it.</li>
            <li><strong>In-page index</strong> — numbered jumps 01–05 with green draw-in underlines; a single column on phones.</li>
            <li><strong>Numbered section heads</strong> — green index numeral, H2, optional dated note.</li>
            <li><strong>Results band</strong> — the quarter’s metrics on rules over a photograph, then the results package as a document list beside the call replay.</li>
            <li><strong>Featured reports</strong> — three report cards, each with a portrait cover slot (Dycom photography stands in until the published cover artwork is supplied), label, title, detail and one outline action.</li>
            <li><strong>Timeline and news list</strong> — square timeline nodes with the most recent green; news rows with date and title.</li>
            <li><strong>Resource columns</strong> reused for the Investors group of the sitemap, then a closing photographic band with two actions and the global footer.</li>
          </ul>
        </Prose>
        <Framed label="Investors page, embedded" src={src} fixed={{ desktop: 900, tablet: 900, phone: 844 }} note="The real Investors page in a frame; scroll inside it." />
        <Rules
          dos={['Number sections and index them at the top of the page.', 'Use buttons, not small text links, for every document and listing action.', 'Keep every figure sourced; mark the reporting period.', 'Lead with photography from the Dycom library; shade it so copy stays legible.']}
          donts={['No invented cover artwork or hot-linked thumbnails; a labelled photographic placeholder until the real cover arrives.', 'No live market data widgets.', 'No outward links beyond operating companies.']}
        />
      </Section>
    </>
  );
}

export function BrandBandsPage() {
  return (
    <>
      {head('patterns/brand-bands/')}
      <Section id="video" title="Brand video band">
        <Prose>
          <p>The brand film has one home on the homepage: a full-width band between the facts band and the companies chapter. Until it is played the band shows a poster frame from the film with a Signal Green square play control, the eyebrow “Our people at work” and one caption line as the band’s H2. Pressing play starts the film in place, muted, with the browser’s own controls so sound can be turned on; the cover does not return. With motion off nothing plays on its own. 16:9 on desktop and tablet, 4:3 on phones.</p>
        </Prose>
        <Framed label="BrandFilm" example="brand-film" note="Press play to start the film inside the example; it stays muted until you turn the sound on." />
        <Rules
          dos={['One poster, one play control, one caption; the H2 is the caption.', 'Keep the film muted until the visitor asks for sound.', 'Use a frame from the film as the poster, never the hero’s frame.']}
          donts={['No autoplay, no looping film with sound, no second film elsewhere on the page.', 'No circular play button or rounded media frame.', 'No dialog: the film plays where it sits.']}
        />
      </Section>
      <Section id="cards" title="Four-card column">
        <Prose>
          <p>Four equal photo cards on a white band with no heading of its own, after Our companies. Each card is a 4:3 photograph from the library, a Fjalla One headline in Civic Blue, one paragraph and an outline button to a site page (Operating strengths, Our capabilities, Careers, Resource Center). The cards are unboxed — a 3px Signal Green rule over the photograph, copy flush with the column, no panel — and sit four across on desktop, two by two at tablet widths and stacked on phones.</p>
        </Prose>
        <Framed label="Strengths" example="strengths" note="Links to site pages inside the example are inert here." />
        <Rules
          dos={['Four cards, equal size, photographs from the library only.', 'One button per card; the label names the destination page.', 'Keep the band on Civic Blue so the page alternates light and dark through this run.']}
          donts={['No heading band above the cards.', 'No rounded photographs or card corners.', 'No more or fewer than four cards.']}
        />
      </Section>
      <Section id="statement" title="Brand statement">
        <Prose>
          <p>A paper band carrying one sentence at display size, centred under the signal mark in Signal Green, between the four-card column and the lifecycle chapter (Who we build for, which once followed it, is held back from the presentation cut). The statement is set in Geist Medium at up to 40px so a full sentence reads as a sentence; a short line of a few words may instead use Fjalla One caps at H2 size. Nothing else sits in the band: no eyebrow, no button.</p>
        </Prose>
        <Framed label="BrandStatement" example="brand-statement" />
        <TokenTable names={['--c5-civic', '--c5-green', '--c5-paper', '--c5-section', '--c5-gutter']} />
        <Rules
          dos={['One sentence, Civic Blue on white, generous vertical space.', 'The mark in Signal Green at the start of the band is the only decoration.']}
          donts={['No second sentence, quotation marks or attribution.', 'No photograph behind the statement.', 'No signal mark used as a bullet or arrow.']}
        />
      </Section>
    </>
  );
}

export function ClosingPatternPage() {
  return (
    <>
      {head('patterns/closing/')}
      <Section id="closing" title="Let’s get to work">
        <p>The homepage ends on Civic Blue with one H2, the question “What brings you here?”, a square toggle of four intents — Customer, Careers, Supplier, Community — and the inquiry form for the chosen intent: name and email, then the intent’s own fields and one inverse submit button. The careers intent asks for a trade and a location and opens the roles drawer instead. If a company was selected on the map, the Customer prompt names it and starts the message. Sending shows a confirmation led by the signal mark, with a link to send another. The footer follows at the standard rhythm — no extra gap above or below.</p>
        <Framed label="Closing + SiteFooter" example="closing-footer" note="Links to site pages inside the example are inert here." />
        <Rules
          dos={['One H2, one toggle, one form, one submit action.', 'White on Civic with the green active bar and single-rule fields.', 'Keep the footer directly beneath at the standard rhythm.']}
          donts={['No orbit rings or decorative shapes.', 'No field without a visible label; no intent longer than one screen on a phone.', 'No gap larger than the section rhythm.']}
        />
      </Section>
    </>
  );
}

export function OverviewPage() {
  return (
    <>
      {head('')}
      <Section id="what" title="What this is">
        <Prose>
          <p>This is the design system behind the Final Design Direction of the Dycom website: the foundations (colour, type, rhythm, shape, motion, the signal mark, imagery), every component on its homepage and Investors page, and the patterns they form. Every example is the live component the site itself uses — not a redrawn picture — so the system cannot drift from the site. The Final Design Direction replaced the original Consolidated homepage and Investors page as the reference in October 2026; the original stays available for comparison but is no longer documented here.</p>
          <p>Where a decision is still open, the system shows the alternatives working side by side instead of choosing. The company map is the main case: five different ways a visitor could find a company, each built and usable on its own page under <a className="dycom-c5__text-link" href={dsHref(EXPLORATIONS_PAGE)}>Undecided interactions<ArrowRight size={17} aria-hidden="true" /></a>.</p>
        </Prose>
        <div className="dycom-ds__pillars">
          <div><strong>Civic Blue leads</strong><p>Blue carries every primary surface and heading; Signal Green is the only accent and stays small.</p></div>
          <div><strong>Square by rule</strong><p>No circles, dots, pills or rounded corners anywhere; the signal mark is the only curve.</p></div>
          <div><strong>Two faces, one casing</strong><p>Fjalla One all caps for H1 and H2; Geist for everything else; no italics.</p></div>
          <div><strong>Motion that draws in</strong><p>Highlights draw in and retract on one curve; Motion off removes all of it.</p></div>
        </div>
      </Section>
      <Section id="contents" title="Contents">
        {(['foundations', 'components', 'patterns', 'templates', 'explorations'] as const).map((group) => (
          <div key={group}>
            <h3>{GROUP_LABELS[group]}</h3>
            <div className="dycom-ds__overview-grid" style={{ marginTop: 12, marginBottom: 24 }}>
              {pagesIn(group).map((slug) => (
                <a key={slug} href={dsHref(slug)}><strong>{PAGES[slug].title}</strong><p>{PAGES[slug].summary}</p><ArrowRight size={18} aria-hidden="true" /></a>
              ))}
            </div>
          </div>
        ))}
      </Section>
      <Section id="how-to-read" title="How to read a page">
        <Prose>
          <ul>
            <li><strong>Live example</strong> — the real component on the backdrop it is designed for. Interact with it; links that lead to other pages of the site are inert here.</li>
            <li><strong>Desktop · Tablet · Phone</strong> — chapters and anything with breakpoints are shown at a real viewport width (1440, 1024 or 390px), so the layout is exactly what the site does at that size. One choice applies to every example on the page; wider examples are scaled to fit the column, and <strong>Hide contents</strong> in the top bar gives them more room.</li>
            <li><strong>States</strong> — hover, focus and selected are shown live where a pointer can reach them and simulated where it cannot.</li>
            <li><strong>Tokens</strong> — the custom properties the component consumes, read from the stylesheet at render time.</li>
            <li><strong>Do / Don’t</strong> — the rules the component follows, in plain words, so feedback can point at the exact rule it questions.</li>
          </ul>
          <p>Start with <a className="dycom-c5__text-link" href={dsHref('foundations/color/')}>Color<ArrowRight size={17} aria-hidden="true" /></a> or go straight to the <a className="dycom-c5__text-link" href={dsHref('components/company-map/')}>Company map<ArrowRight size={17} aria-hidden="true" /></a>. {PAGE_SLUGS.length} pages in all; this site lives at <code>{DS_BASE}</code>.</p>
        </Prose>
      </Section>
    </>
  );
}
