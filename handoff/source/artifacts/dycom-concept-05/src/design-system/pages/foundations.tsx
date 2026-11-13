import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { Action, BRAND_TOKENS, PHOTOGRAPHY, PHOTO_IDS, PHOTO_SUBJECTS, Signal, photoProps, readToken, services, stages, type PhotoId } from '@workspace/dycom-brand';
import { PageLink, Prose, Rules, Section, Stage, TokenTable } from '../shell';
import { head } from './components';

const colorTokens = BRAND_TOKENS.filter((t) => t.group === 'color').map((t) => t.name);

function Swatches() {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const scope = ref.current?.closest('.dycom-c5');
    if (scope) setValues(Object.fromEntries(colorTokens.map((n) => [n, readToken(scope, n)])));
  }, []);
  return (
    <div className="dycom-ds__swatches" ref={ref}>
      {BRAND_TOKENS.filter((t) => t.group === 'color').map((t) => (
        <div className="dycom-ds__swatch-card" key={t.name}>
          <div style={{ background: `var(${t.name})`, borderBottom: '1px solid var(--c5-rule)' }} />
          <p><strong>{t.label}</strong><span className="dycom-ds__value">{values[t.name] ?? ''}</span><code>{t.name}</code></p>
        </div>
      ))}
    </div>
  );
}

export function ColorPage() {
  return (
    <>
      {head('foundations/color/')}
      <Section id="palette" title="Palette">
        <p>Six colours from the Dycom brand guide, declared once as custom properties on the <code>.dycom-c5</code> scope. The swatches and the table read their values from the stylesheet when the page renders, so this page can never show a value the site is not using.</p>
        <Swatches />
        <TokenTable names={colorTokens} />
      </Section>
      <Section id="proportion" title="Proportion">
        <p>Blue leads, green supports. Civic Blue carries the header, footer, the Pathways, Our companies, Investors and closing chapters, every filled button and every heading; deep Civic shades the photographs the hero, facts band and Who we build for copy sit on. Signal Green appears only as an accent — the highlight word and primary action in the hero, the chapter labels, the facts numerals, focus rings, the 4px active bars, hover underlines and the marker pulse — and should stay under roughly 10% of any viewport. No section reads as green.</p>
        <Stage label="Blue leads, green supports" tone="dark">
          <h2 style={{ fontSize: 40 }}>Scale is <span>Local</span></h2>
          <div className="dycom-ds__row" style={{ marginTop: 24 }}>
            <Action inverse href="#palette">Primary on blue</Action>
            <Action inverse outline href="#palette">Secondary on blue</Action>
          </div>
        </Stage>
        <Rules
          dos={['Use Civic Blue for every primary surface, heading and filled button.', 'Use Signal Green for one highlight word, focus, active bars and the map pulse.', 'Use Paper to alternate chapters and for form fields and the map panel.', 'Keep all text at WCAG AA; white on Civic and Civic on white and Paper pass.']}
          donts={['No green section backgrounds or large green fills.', 'No off-brand greens, dulled blues, browns, tans or faded secondary tones.', 'No coloured drop shadows, glows or tinted bars.', 'No blue text on green or green text on blue.', 'Spenser Blue only when the Pathways brand itself is referenced.']}
        />
      </Section>
    </>
  );
}

const typeTokens = BRAND_TOKENS.filter((t) => t.group === 'type').map((t) => t.name);

export function TypographyPage() {
  return (
    <>
      {head('foundations/typography/')}
      <Section id="faces" title="Two faces">
        <p>Fjalla One sets H1 and H2 in all caps — it is the brand’s display voice. Geist, a variable face, sets everything else: H3 and below, body, labels, buttons and navigation. Both ship in the brand package as WOFF2 and are declared as <code>Dycom Fjalla One</code> and <code>Dycom Geist</code> so the site never falls back to a different cut of the same family.</p>
        <Stage label="Scale">
          <div className="dycom-ds__specimen"><small><b>H1 · Fjalla One</b>--c5-h1 · all caps · line-height 1.06</small><h1 style={{ margin: 0 }}>Scale is <span>Local</span></h1></div>
          <div className="dycom-ds__specimen"><small><b>H2 · Fjalla One</b>--c5-h2 · all caps</small><h2 style={{ margin: 0 }}>Scale is local.<br />Capability is national.</h2></div>
          <div className="dycom-ds__specimen"><small><b>H3 · Geist Semibold</b>--c5-h3 · sentence case</small><h3>Expertise for the entire lifecycle</h3></div>
          <div className="dycom-ds__specimen"><small><b>Body · Geist</b>--c5-body · ≤ 70 characters</small><p>Engineering, construction and maintenance for the nation’s networks, delivered by local operating companies working to one standard.</p></div>
          <div className="dycom-ds__specimen"><small><b>Body on Civic · Geist Medium</b></small><p style={{ background: 'var(--c5-civic)', color: 'var(--c5-white)', fontWeight: 500, padding: '16px 20px' }}>Dycom Industries, Inc. (NYSE: DY) supplies the people, tools and equipment behind specialty contracting services.</p></div>
          <div className="dycom-ds__specimen" style={{ borderBottom: 0 }}><small><b>Small · Geist</b>--c5-small · captions, labels</small><p style={{ fontSize: 'var(--c5-small)' }}>Home offices, not service areas. Each square is a home-office location.</p></div>
        </Stage>
        <TokenTable names={typeTokens} />
      </Section>
      <Section id="casing" title="One casing rule">
        <p>H1 and H2 are all caps in Fjalla One; H3 and below are sentence case in Geist. The same rule runs from the header to the footer: footer column titles are all caps Fjalla One at 14px, links are sentence case. Headlines carry the message. A short upper-case Signal Green label sits above the headline in three places only — the hero, Who we are and Who we build for — where a chapter changes voice; chapters that open with the heading band carry none.</p>
        <Rules
          dos={['Set H1 and H2 in Fjalla One, all caps, with the one highlight word in Signal Green where the chapter calls for it.', 'Keep body at 17px on desktop and 16px on phones; captions and labels at 14px; nothing below 13px.', 'Keep line length at or under 70 characters.', 'Give display headings a line-height of at least 1.05 so lines never collide and a touch more tracking on phones.']}
          donts={['No italics anywhere, including emphasis inside headlines.', 'No mixed casing from header to header.', 'No DM Sans, Impact or other substitutes: the fallback stack exists only for the instant before the fonts load.', 'No type smaller than 13px, even in disclaimers.']}
        />
      </Section>
    </>
  );
}

const rhythmTokens = BRAND_TOKENS.filter((t) => t.group === 'rhythm').map((t) => t.name);

export function SpacingPage() {
  return (
    <>
      {head('foundations/spacing-layout/')}
      <Section id="rhythm" title="Fluid rhythm">
        <p>Three measures do most of the work. The gutter is the horizontal page padding and scales from 24px on a phone to 88px on a wide screen; the chapter spacing is the vertical padding every homepage section shares, from 64px to 104px; the control height keeps buttons, inputs and selects at one size so rows of mixed controls always line up. The Final Design Direction sets the gutter and chapter values on its own scope, over the brand defaults, so it and the earlier Consolidated site can be told apart in one place.</p>
        <TokenTable names={rhythmTokens} />
        <div className="dycom-ds__spacing" aria-hidden="true">
          <div><span>Gutter · clamp(24px, 5.2vw, 88px)</span><i style={{ width: 'var(--c5-gutter)' }} /></div>
          <div><span>Chapter · clamp(64px, 7.2vw, 104px)</span><i style={{ width: 'var(--c5-section)' }} /></div>
          <div><span>Control height · 50px</span><i style={{ width: 'var(--c5-control-h)' }} /></div>
          <div><span>Heading-to-copy gap · 48px</span><i style={{ width: 48 }} /></div>
          <div><span>Grid gap · 24–64px</span><i style={{ width: 64 }} /></div>
        </div>
      </Section>
      <Section id="grid" title="Chapter grids">
        <Prose>
          <p>Chapters are two-column by default on desktop and one column on phones. The proportions are chosen per chapter, not from a fixed 12-column grid:</p>
          <ul>
            <li><strong>Hero</strong> — the film fills the hero; the copy column is at most 760px or 70% of the width, on the left.</li>
            <li><strong>Who we are</strong> — introduction beside the What we build list (four lines of work), then a full-width facts band over a photograph.</li>
            <li><strong>Our companies</strong> — map at least 60% of the content width, directory beside it; no map on phones.</li>
            <li><strong>Section heading band</strong> — H2 left, introduction right, aligned to the baseline; one left margin on phones.</li>
            <li><strong>Footer</strong> — brand column and a six-column sitemap; accordions below 1100px.</li>
          </ul>
          <p>Breakpoints: 1280px and above is desktop, 768–1279px tablet, 767px and below mobile; the header switches to its sheet below 1100px. The reviewers used 1440px and 390px; both are the widths this system is checked at.</p>
        </Prose>
        <Rules
          dos={['Pad every chapter with the shared gutter and chapter spacing.', 'Keep interactive targets at least 44×44px.', 'Let paragraphs stop at 70 characters even when the column is wider.']}
          donts={['No chapter with a larger gap above or below than the standard rhythm.', 'No fixed pixel gutters; the fluid gutter keeps 320px phones usable.', 'No overlapping or collapsing components on phones.']}
        />
      </Section>
    </>
  );
}

export function ShapePage() {
  return (
    <>
      {head('foundations/shape/')}
      <Section id="square" title="Square by rule">
        <p>Every container is square-cornered: cards, images, buttons, inputs, dialogs, drawers, tabs and tiles. The stylesheet enforces it with <code>border-radius: 0</code> on everything inside the brand scope, so a new component cannot opt out by accident. The only permitted curve is the signal mark, in its stepped quarter-arc form.</p>
        <div className="dycom-ds__shape-grid">
          <div><i />Filled square</div>
          <div><i className="is-ring" />Square pulse ring</div>
          <div><i style={{ background: 'transparent', border: '1px solid var(--c5-civic)' }} />Outlined container</div>
          <div><Signal className="" />Signal mark</div>
          <div><i className="is-bad" />Not this: circle</div>
          <div><i className="is-pill" />Not this: pill</div>
        </div>
      </Section>
      <Section id="shape-rules" title="Rules">
        <Rules
          dos={['Square corners on every container.', 'Square markers with a square pulse ring on the map.', 'The signal mark, at any scale, as the only decorative shape — including as a media mask.', 'Square toggles, chips and filter tags.']}
          donts={['No circles, dots, pills, ovals or rounded corners as structure or decoration.', 'No circular video stamps, orbit rings or dotted backgrounds.', 'No pill buttons; square is the rule.', 'No rounded photographs or cards.']}
        />
      </Section>
    </>
  );
}

const motionTokens = BRAND_TOKENS.filter((t) => t.group === 'motion').map((t) => t.name);

export function MotionPage() {
  const [pressed, setPressed] = useState(false);
  return (
    <>
      {head('foundations/motion/')}
      <Section id="draw-in" title="Highlights draw in">
        <p>The Signal Green bar on buttons, navigation triggers, mega-menu links, pathway cards, stage nodes, trade rows and intent tabs draws in from left to right (or top to bottom on vertical bars) over about 0.4s on a soft ease-out, and retracts the same way. It never snaps on. Arrows on pathway cards and trade rows nudge 4px on hover. On touch devices a tap leaves no bar behind.</p>
        <div className="dycom-ds__motion-demo">
          <button type="button" aria-pressed={pressed} onClick={() => setPressed((v) => !v)}>Hover or press me</button>
          <Action outline onClick={() => undefined}>A real button</Action>
        </div>
        <TokenTable names={motionTokens} />
      </Section>
      <Section id="panels" title="Panels, drawers and accordions">
        <Prose>
          <ul>
            <li><strong>Dialogs</strong> fade and rise over 0.32s; the backdrop fades; exit takes about 0.26s before the dialog actually closes.</li>
            <li><strong>Drawers</strong> slide in from the right over 0.4s and slide back out.</li>
            <li><strong>Accordions</strong> animate height and opacity open (0.38s) and closed (0.3s) with the chevron rotating on the same curve.</li>
            <li><strong>Map</strong> — an engaged location pulses with an expanding, fading square ring on a 2.8s loop; when nothing is engaged a quiet staggered idle blink cycles through the locations.</li>
            <li><strong>Hero and brand video</strong> — a silent, muted loop with a pause control in the hero; the brand film band plays only when asked for.</li>
          </ul>
        </Prose>
      </Section>
      <Section id="off" title="Motion off">
        <p>Two switches disable all of it: the visitor’s <code>prefers-reduced-motion</code> setting and the Motion control in the footer (and in this site’s top bar). Both set <code>data-motion="off"</code> on the brand scope, which removes every animation and transition, stops the hero loop and replaces the map pulse with a static ring.</p>
        <Rules
          dos={['Use the shared easing and duration tokens for any new highlight.', 'Keep motion purposeful: reveals, panel changes, the map ring.', 'Test every component with Motion off.']}
          donts={['No auto-moving map, no fly-to on selection, no parallax that shifts text.', 'No highlight that appears instantly.', 'No autoplaying audio, ever.']}
        />
      </Section>
    </>
  );
}

export function SignalMarkPage() {
  return (
    <>
      {head('foundations/signal-mark/')}
      <Section id="mark" title="The mark">
        <p>The Dycom “D” built from stepped quarter-arcs is the brand motif. It appears as a section accent (Who we are, Investors, the Investors page listing block), as the check glyph in capability lists, in the film trigger and in empty states. It is square by construction, so it obeys the shape rule, and it is drawn once as an inline SVG in the brand package so every instance is identical.</p>
        <div className="dycom-ds__signal-grid">
          <div><Signal /><span>Civic on white · 26px default</span></div>
          <div className="is-dark"><Signal /><span>White on Civic · 44px chapter accent</span></div>
          <div className="is-green"><Signal /><span>Green · Investors page listing</span></div>
          <div><span style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--c5-civic)' }}><Signal className="" />Check item</span><span>16px check glyph</span></div>
        </div>
      </Section>
      <Section id="glyphs" title="Arrows, chevrons and markers are plain">
        <p>The signal is a motif, never an arrow. Directional glyphs come from one icon set at a 17–20px size: <code>→</code> for an in-page jump or another page of this site, <code>↗</code> only when a link leaves the site (operating-company websites), a plain downward chevron for dropdowns and accordions that rotates when open. Map markers are plain squares with a square pulse ring — the signal mark never appears on the map.</p>
        <div className="dycom-ds__signal-grid">
          <div><ArrowRight size={24} color="var(--c5-civic)" /><span>→ in-page or site page</span></div>
          <div><ArrowUpRight size={24} color="var(--c5-civic)" /><span>↗ leaves the site</span></div>
          <div><ChevronDown size={24} color="var(--c5-civic)" /><span>Chevron · rotates when open</span></div>
          <div><svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" fill="none" stroke="var(--c5-green)" strokeWidth="2" /><rect x="9" y="9" width="14" height="14" fill="var(--c5-civic)" /></svg><span>Map marker · square + ring</span></div>
        </div>
        <Rules
          dos={['Use the signal mark as a section accent, check glyph and media mask in its stepped form.', 'Pair the mark with Civic, white or Signal Green only.', 'Use → on buttons, cards and body links that go somewhere on this site.']}
          donts={['Never use the signal as an arrow, caret, bullet-arrow or dropdown indicator.', 'Never put the signal on the map or inside a marker.', 'No decorative arrows; nothing carries an arrow that does nothing.', 'No arrows in navigation or footer lists.']}
        />
      </Section>
    </>
  );
}

/** Where each photograph sits on the site today, for the library captions. */
const IN_USE: Partial<Record<PhotoId, string>> = {
  z9b_2679: 'Who we are · facts band',
  z9b_6533: 'Who we build for',
  z9b_1574: 'How we work',
  z9b_6665: 'Investors page · hero',
  z9a_0525: 'Investors page · results band',
  z9a_5195: 'Investors page · report cover',
  z9b_2139: 'Investors page · report cover',
  z9b_1711: 'Investors page · report cover',
  z9a_4064: 'Investors page · closing band',
  z9b_1407: 'People & careers',
  z9b_7549: 'People & careers',
  z9a_0445: 'People & careers',
  ...Object.fromEntries(services.map((s) => [s.image, `What we do · ${s.label}`])),
  ...Object.fromEntries(stages.map((s) => [s.image, `How a job runs · ${s.title}`])),
};

export function ImageryPage() {
  return (
    <>
      {head('foundations/imagery/')}
      <Section id="library" title="Photography">
        <p>Forty-eight photographs from Dycom’s own shoot: people at work, the tools and materials in their hands, live networks and the places they serve. The library is kept in the site’s asset store in two web sizes (1,000 and 2,000 pixels wide) with the full-size originals alongside, and every photograph on the site is drawn from it by name, so a swap is one line, not a new export. Photographs are square-cornered and cropped to the layout they sit in: full-width bands under a Civic shade (the hero, the facts band, Who we build for, the Investors hero, results and closing bands), a square in How we work, square panels in the capability tabs and the process route, three square thumbnails in People &amp; careers, and portrait cover slots on the Investors report cards.</p>
        {PHOTO_SUBJECTS.map((subject) => {
          const ids = PHOTO_IDS.filter((id) => PHOTOGRAPHY[id].subject === subject.id);
          return (
            <div key={subject.id}>
              <h3 style={{ marginTop: 32 }}>{subject.label} <span className="dycom-ds__count">{ids.length}</span></h3>
              <div className="dycom-ds__imagery">
                {ids.map((id) => (
                  <figure key={id}>
                    <img {...photoProps(id, '(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw')} loading="lazy" />
                    <figcaption><b>{id.toUpperCase()}{IN_USE[id] ? ` · ${IN_USE[id]}` : ''}</b>{PHOTOGRAPHY[id].alt}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          );
        })}
      </Section>
      <Section id="video" title="Video">
        <p>The hero carries a silent, muted loop (<code>hero-loop.mp4</code>) with a poster frame (<code>hero-poster.webp</code>) and a pause control; the full brand film (<code>brand-film.mp4</code>, poster <code>film-poster.webp</code>) plays in place in its own band only when the visitor asks. The same hero layout serves a still-image variant. See <PageLink slug="components/hero/">Hero</PageLink> and <PageLink slug="patterns/brand-bands/">Brand bands</PageLink>.</p>
        <Rules
          dos={['Use photographs of real work and real places.', 'Keep images square-cornered; the only permitted mask is the signal motif.', 'Provide a poster for every video and respect Motion off.']}
          donts={['No illustration, orbs, road graphics or isometric scenes.', 'No invented cover artwork or hot-linked thumbnails on the Investors page.', 'No audio.']}
        />
      </Section>
    </>
  );
}
