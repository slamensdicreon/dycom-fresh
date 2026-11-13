import { useContext, useId, useState, type ReactNode } from 'react';
import { ArrowUpRight, ChevronDown, Search } from 'lucide-react';
import { Action, BRAND_TOKENS, IconButton, Modal, SiteLink, page } from '@workspace/dycom-brand';
import { companies } from '@workspace/dycom-network-map/companies';
import { GROUP_LABELS, PageHead, PageLink, Prose, Rules, Section, Stage, State, StateRow, TokenTable } from '../shell';
import { Framed } from '../examples/Framed';
import { PAGES } from '../catalog';

import { ExampleContext } from '../examples/context';

export { ExampleContext, type ExampleHandlers } from '../examples/context';

export const head = (slug: keyof typeof PAGES) => {
  const meta = PAGES[slug];
  return <PageHead group={meta.group === 'overview' ? 'Design System' : GROUP_LABELS[meta.group]} title={meta.title} summary={meta.summary} />;
};

const EXAMPLE_NOTE = 'Links inside examples that lead to other site pages are inert here; they work on the site itself.';

export function ButtonsPage() {
  return (
    <>
      {head('components/buttons/')}
      <Section id="variants" title="Variants">
        <p>One component, <code>Action</code>, renders every call to action. It is a 50px square-cornered control in Geist Medium with a trailing <code>→</code>. On white and paper it is filled Civic (primary) or outlined Civic (secondary); on Civic it inverts to white. Hovering draws a Signal Green bar along the bottom edge; focus adds the green outline.</p>
        <Stage label="On white and paper" note={EXAMPLE_NOTE}>
          <StateRow>
            <State label="Primary"><Action href={page('what-we-do')}>Explore our companies</Action></State>
            <State label="Secondary"><Action outline href={page('who-we-are')}>Get to know Dycom</Action></State>
            <State label="Button (no href)"><Action onClick={() => undefined}>Browse open roles</Action></State>
            <State label="In-page jump"><Action href="#variants">What we do</Action></State>
          </StateRow>
          <StateRow>
            <State label="Hover (simulated)" hover><Action outline href={page('who-we-are')}>Get to know Dycom</Action></State>
            <State label="Focus (simulated)"><span className="dycom-ds__state-focus" style={{ display: 'inline-flex' }}><Action href={page('what-we-do')}>Explore our companies</Action></span></State>
          </StateRow>
        </Stage>
        <Stage label="On Civic Blue" tone="dark" note={EXAMPLE_NOTE}>
          <StateRow>
            <State label="Inverse primary"><Action inverse href={page('investors')}>Investors overview</Action></State>
            <State label="Inverse secondary"><Action inverse outline href={page('investors/sec-filings')}>Financials & filings</Action></State>
          </StateRow>
        </Stage>
      </Section>
      <Section id="icon-button" title="Icon button">
        <p>A 50px square outlined control for one-glyph actions: the hero’s pause/play, the mobile menu trigger and every dialog’s close. It always carries an accessible label and, where it toggles, <code>aria-pressed</code>.</p>
        <Stage label="IconButton">
          <StateRow>
            <State label="Default"><IconButton label="Search" onClick={() => undefined}><Search /></IconButton></State>
            <State label="Pressed"><IconButton label="Open" pressed onClick={() => undefined}><ChevronDown /></IconButton></State>
          </StateRow>
        </Stage>
        <TokenTable names={['--c5-control-h', '--c5-civic', '--c5-white', '--c5-green', '--c5-draw', '--c5-ease']} />
        <Rules
          dos={['Use a button for every primary action; it is the only call-to-action style.', 'Keep one primary and at most one secondary action per block.', 'Write labels as verbs in sentence case; the arrow is added by the component.', 'Place buttons at full width on phones inside narrow columns.']}
          donts={['No pills, no rounded corners, no shadows, no gradients.', 'No small text links where a button belongs.', 'No arrow typed into the label; no double arrows.', 'No disabled buttons in marketing pages — remove the action instead.']}
        />
      </Section>
    </>
  );
}

export function LinksPage() {
  return (
    <>
      {head('components/links/')}
      <Section id="inline" title="Inline and text links">
        <p><code>SiteLink</code> decides the glyph from the destination: another page of this site gets <code>→</code>; an in-page anchor gets nothing (the enclosing button adds its own arrow); an address that leaves the site gets <code>↗</code>, opens in a new tab and announces it. The text-link style adds a Civic underline at the shared thickness and offset with a Signal Green hover.</p>
        <Stage label="SiteLink" note={`${EXAMPLE_NOTE} The ↗ example does not link anywhere: this site has no outward links; on the homepage only operating-company websites use it.`}>
          <StateRow>
            <State label="Site page →"><SiteLink className="dycom-c5__text-link" href={page('what-we-do/engineering')}>Engineering</SiteLink></State>
            <State label="Body link, no class"><p>Read about <SiteLink href={page('who-we-are/values')}>our values</SiteLink> before you apply.</p></State>
            <State label="Leaves the site ↗ (rendering only)"><span className="dycom-c5__text-link" aria-label="Company website, opens in a new tab (example only)">Company website<ArrowUpRight size={17} aria-hidden="true" /></span></State>
            <State label="List item (arrow off)"><SiteLink href={page('investors/news')} arrow={false}>Investor news</SiteLink></State>
          </StateRow>
        </Stage>
        <TokenTable names={BRAND_TOKENS.filter((t) => t.group === 'link').map((t) => t.name)} />
      </Section>
      <Section id="glyph-rules" title="Glyph rules">
        <Rules
          dos={['→ on buttons, cards, related-service links and the overview link of each menu group.', '↗ only when a link truly leaves dycom — today only operating-company websites.', 'One underline style for inline links everywhere.', 'Keep every link’s hit area at least 44px tall.']}
          donts={['No arrows in header, menu-column or footer lists.', 'No decorative arrows that lead nowhere.', 'No underlines on navigation; no colour-only link styling in body copy.', 'No outward links to the current dycomind.com or third-party sites from marketing copy.']}
        />
      </Section>
    </>
  );
}

export function HeaderPage() {
  return (
    <>
      {head('components/header/')}
      <Section id="desktop" title="Desktop header">
        <p>Sticky, white, 88px tall: logo left (144px), the six sitemap groups centre-right — Who we are, What we do, Our companies, People &amp; careers, Resource Center, Investors — then the <strong>language switch</strong> (a bare globe icon with no box, underlined in Signal Green on hover like the group triggers) and the <strong>Find a job</strong> primary action. The globe opens a short square menu listing English and Español; the menu marks the current language with a Signal Green bar and square, and the choice is visual only in this prototype — translation belongs to the build. Each group is a button that opens a mega panel — an intro heading, a sentence and the group’s overview link on the left, two to four titled link columns on the right. On the homepage the overview link doubles as the jump to that group’s chapter (a down arrow marks it); on every other page it leads to the group’s overview page. Below 1280px the intro becomes a full-width top row; between 1100 and 1219px the lockup, type and gaps tighten so six labels stay on one line. Escape closes the panel and returns focus to its trigger; the down arrow opens a panel and moves into it.</p>
        <Framed label="SiteHeader" example="header" note="Open a group to see its mega panel. Switch the example to Tablet or Phone to see the menu button and the sheet it opens." />
      </Section>
      <Section id="mobile" title="Mobile sheet">
        <Prose>
          <p>Below 1100px the groups collapse into a menu icon button, with the globe language switch kept in the bar to its left. It opens a full-height sheet whose top bar is the header’s exact size and layout, with the close control exactly where the menu button was so nothing jumps. <strong>Find a job</strong> sits at the top of the sheet at full width. The six groups become accordions holding the chapter jump (homepage only) and the titled link columns; the open group is marked by its rotated chevron and the revealed columns. Switch the example above to Tablet or Phone to see it.</p>
          <ul>
            <li>Mega-menu intro heading one step smaller (about 22px) so it does not compete with the page.</li>
            <li>Navigation is the future-state sitemap; link lists never anchor into homepage chapters. The one in-page jump per group lives in its overview link.</li>
            <li>The Resource Center re-lists documents filed under other groups — reports, safety and employee materials, purchasing terms, candidate guides — because it is the index people look for by name.</li>
            <li>Dropdown indicator is a plain chevron that rotates when open; no pill search field.</li>
          </ul>
        </Prose>
        <Rules
          dos={['Keep the order: Who we are · What we do · Our companies · People & careers · Resource Center · Investors.', 'Keep every trigger and link at least 44px tall.', 'Return focus to the trigger when a panel closes.']}
          donts={['No arrows in menu lists.', 'No anchors into homepage chapters from any link list; only the overview link jumps, and only on the homepage.', 'No extra row of jump links in a panel.', 'No search field in this phase.']}
        />
      </Section>
    </>
  );
}

export function HeroPage() {
  const [variant, setVariant] = useState<'film' | 'still'>('film');
  return (
    <>
      {head('components/hero/')}
      <Section id="film" title="Full-bleed film hero">
        <p>The film fills the whole hero (up to 690px tall, never more than the viewport less the header) with the copy set over it on the left: a Signal Green eyebrow (“Digital infrastructure leader”), the H1 in Fjalla One, all caps, white with one Signal Green word (“SCALE IS LOCAL”), a one-paragraph introduction and two actions — a Signal Green primary jumping to the companies chapter and a white outline to Who we are. A left-to-right shade keeps the copy legible over any frame. The loop is silent with a poster and a pause/play control at the bottom right; the large signal mark sits at the top right as the media accent — never a circular stamp. On phones the headline drops to 48px and the actions stack.</p>
        <div className="dycom-ds__switcher dycom-ds__switcher--buttons" role="group" aria-label="Hero variant">
          {(['film', 'still'] as const).map((v) => (
            <button key={v} type="button" aria-pressed={variant === v} onClick={() => setVariant(v)}>{v === 'film' ? 'Film loop' : 'Still image'}</button>
          ))}
        </div>
        <Framed key={variant} label={variant === 'film' ? 'Hero · film' : 'Hero · still image'} example="hero" params={variant === 'still' ? { hero: 'still' } : undefined} note="The still variant is the same layout with the poster frame in place of the loop; the homepage can be set to open with either." />
        <TokenTable names={['--c5-h1', '--c5-font-display', '--c5-civic-deep', '--c5-green', '--c5-white', '--c5-body']} />
        <Rules
          dos={['One highlight word in Signal Green; the rest of the headline white.', 'Keep the loop muted with a poster and a visible pause control.', 'Keep the shade on the copy side so the photograph stays open on the right.']}
          donts={['No circular video stamp or nested rounded frame.', 'No non-brand coloured bar beneath the hero.', 'No second eyebrow or kicker; the one green label is the only line above the H1.']}
        />
      </Section>
    </>
  );
}

export function SectionHeadersPage() {
  return (
    <>
      {head('components/section-headers/')}
      <Section id="band" title="Heading band">
        <p>Chapters open with <code>.dycom-c5__section-heading</code>: a two-column grid aligned to the baseline, the all-caps H2 on the left (two lines, the second completing the thought) and a one-paragraph introduction on the right at up to 55 characters per line. On phones the two stack on one left margin. The band works on paper (What we do, From survey to service) and on Civic Blue (Our companies, where the introduction turns white).</p>
        <Framed label="WhatWeDo · heading band" example="heading-band" note={`${EXAMPLE_NOTE} Only the heading band of the chapter is shown here.`} />
      </Section>
      <Section id="labelled" title="Labelled chapters">
        <p>Two chapters carry a small Signal Green label above the H2 instead of the two-column band, because they open a new voice rather than a list: <strong>Who we are</strong> (label “Who we are”, H2 and introduction on the left; label “What we build”, H2 and the four lines of work on the right; then the facts band set over a photograph) and <strong>What we build</strong> (a full-width photograph with the label, the H2 and the four lines of work set over it; held back from the presentation cut since 5 Nov 2026, when its copy moved up into Who we are at the client’s request). The label is 14–15px, letter-spaced, upper case and Signal Green. The dark Investors chapter leads with a 44px signal mark above its H2.</p>
        <Framed label="WhoWeAre · labelled chapter and facts band" example="who-we-are" note={EXAMPLE_NOTE} />
        <Framed label="WhoWeBuildFor · photographic band" example="who-we-build-for" note={EXAMPLE_NOTE} />
        <Rules
          dos={['Two lines per H2, the message in the heading.', 'Align the H2 and the intro on one baseline on desktop and one left margin on phones.', 'Use the green label only where a chapter changes voice: the hero, Who we are, Who we build for.', 'Lead dark chapters with the signal mark in white.']}
          donts={['No labels on chapters that use the heading band.', 'No centred headings.', 'No intro longer than one paragraph.']}
        />
      </Section>
    </>
  );
}

export function TabsPage() {
  return (
    <>
      {head('components/tabs/')}
      <Section id="capability" title="Capability tabs">
        <p>A Radix tab list styled as a row of equal, stacked triggers: a numeral in Fjalla One, the label in Geist, a 4px Civic bar that becomes Signal Green and draws in on the active tab. Arrow keys move between tabs (up/down as well as left/right). Every panel stays mounted in one stacked grid cell so the chapter never changes height when the selection changes. Below 768px the same content becomes an accordion: each trigger keeps its numeral and gains a green chevron, and the open panel — photograph, copy, capability list, related services and the action — unfolds in place beneath it.</p>
        <Framed label="WhatWeDo" example="what-we-do" note={EXAMPLE_NOTE} />
      </Section>
      <Section id="intents" title="Intent toggle">
        <p>The closing chapter uses a Radix toggle group on Civic Blue: square items, white type, a Signal Green active bar; one item is always selected and the inquiry form beneath it changes with the choice and announces the change politely. On phones the four intents sit two by two.</p>
        <Framed label="Closing · intents" example="closing" />
        <Rules
          dos={['Support three to six tabs; keep labels to two words.', 'Keep all panels mounted so the block keeps one height on desktop.', 'Turn tab sets into in-place accordions on phones; never a horizontal strip.', 'Use the Civic underline/active bar, labels at 16px.']}
          donts={['No pill tabs, no filled chips.', 'No trailing signal mark on tab labels.', 'No white active tab on a grey strip.']}
        />
      </Section>
    </>
  );
}

export function ProcessRoutePage() {
  return (
    <>
      {head('components/process-route/')}
      <Section id="route" title="Expertise for the entire lifecycle">
        <p>Its own chapter, opened by the heading band. Five stages on one horizontal route: numbered square nodes centred over their labels, joined by a rule; the stop in view carries the green bar. Each stop is a tab whose panel shows the stage photograph beside a “Stage 01 of 05” count, an H3, copy, the services involved as links and a previous/next pair of outline buttons. Below 768px the route becomes an accordion: numbered stops stack, the open stop fills with the photograph and copy, and a <strong>Next</strong> link opens the following stop and brings it into view.</p>
        <Framed label="Lifecycle" example="lifecycle" note={EXAMPLE_NOTE} />
        <Rules
          dos={['Number the stops 01–05 in Fjalla One.', 'Keep the route horizontal on desktop and tablet; stack it as an accordion on phones.', 'Keep all stage panels mounted on desktop.', 'Link the services involved to their service pages.']}
          donts={['No circular nodes or dotted connectors.', 'No horizontal slider on phones.', 'No auto-advancing stages.']}
        />
      </Section>
    </>
  );
}

export function CardsPage() {
  return (
    <>
      {head('components/cards/')}
      <Section id="pathways" title="Pathway cards">
        <p>Four square tiles on a Civic band directly under the hero: a Fjalla One all-caps label with <code>→</code>, a one-line detail, a Signal Green edge that draws in on hover and a 4px nudge of the arrow. Each is one in-page jump to the chapter for that audience.</p>
        <Framed label="Pathways" example="pathways" />
      </Section>
      <Section id="investor-tiles" title="Investor tiles">
        <p>Three square tiles on Civic beside the chapter copy: H3, a two-line description and one inverse outline button pinned to the bottom. The button wraps rather than truncates. No live market data.</p>
        <Framed label="Investors" example="investors" note={EXAMPLE_NOTE} />
      </Section>
      <Section id="trade-rows" title="Trade rows and resource columns">
        <p>Trade rows are full-width buttons with a title, a supporting sentence and <code>→</code>; each opens the roles drawer pre-filtered to its trade. Three square photograph thumbnails sit under the chapter’s actions. Resource columns are four paper columns — Corporate reports, Safety &amp; employees, Suppliers, Candidates — each a heading and up to three site-page links with arrows; the same four groups form the Resource Center menu in the header. Two by two on phones.</p>
        <Framed label="Careers" example="careers" note={EXAMPLE_NOTE} />
        <Framed label="ResourceCenter" example="resource-center" note={EXAMPLE_NOTE} />
        <Rules
          dos={['One action per card; the card title carries the subject.', 'Square tiles, square thumbnails, a rule rather than a shadow.', 'Signal Green only on hover/active edges.', 'Keep the Resource Center columns and the Resource Center menu reading from one list.']}
          donts={['No light-blue tiles.', 'No stats tiles or orbit decoration in Careers.', 'No drop shadows, no rounded corners.']}
        />
      </Section>
    </>
  );
}

export function RolesDrawerPage() {
  const { openRoles } = useContext(ExampleContext);
  return (
    <>
      {head('components/roles-drawer/')}
      <Section id="drawer" title="Find your crew">
        <p>A right-hand sheet with square corners, opened by <strong>Find a job</strong> in the header, <strong>Browse open roles</strong> in Careers, every trade row (pre-filtered to its trade), <strong>View open roles</strong> in a company card (pre-filtered to the company) and the Careers intent in the closing chapter. Filters: Work, Where, Trade and Company, shown as removable square chips; ten results then <strong>Show more</strong>; a count line; an empty state led by the signal mark. The drawer traps focus, closes on Escape and returns focus to the control that opened it.</p>
        <Stage label="RolesDrawer">
          <StateRow>
            <State label="Open unfiltered"><Action onClick={() => openRoles()}>Browse open roles</Action></State>
            <State label="Pre-filtered to a trade"><Action outline onClick={() => openRoles({ trade: 'Fiber Splicing' })}>Fiber splicing roles</Action></State>
            <State label="Pre-filtered to a company"><Action outline onClick={() => openRoles({ companyId: companies[0].id })}>{companies[0].name} roles</Action></State>
          </StateRow>
        </Stage>
        <Rules
          dos={['Open the same drawer from every careers action.', 'Keep filter chips square and removable.', 'Keep sample data clearly sample in code; copy never implies live vacancies.']}
          donts={['No disclaimer inside the drawer; the sample-data note lives on this page, not in the component.', 'No stats tiles; one count line only.', 'No rounded sheet corners or floating card.']}
        />
      </Section>
    </>
  );
}

export function DialogPage() {
  const [open, setOpen] = useState<'dialog' | 'drawer' | null>(null);
  const id = useId();
  return (
    <>
      {head('components/dialog/')}
      <Section id="modal" title="Native, in-tree modal">
        <p><code>Modal</code> wraps a native <code>&lt;dialog&gt;</code> rendered inside the brand scope rather than in a portal, so it inherits every token and the motion setting. It has a sticky head with the title and a close icon button, square corners, a focus trap with focus return, a fade-and-rise entry and a shorter exit. The same component serves the company cards, the mobile navigation sheet (<code>variant="nav"</code>) and the roles drawer (<code>drawer</code>).</p>
        <Stage label="Modal">
          <StateRow>
            <State label="Dialog"><Action onClick={() => setOpen('dialog')}>Open a dialog</Action></State>
            <State label="Drawer"><Action outline onClick={() => setOpen('drawer')}>Open a drawer</Action></State>
          </StateRow>
        </Stage>
        <Modal open={open === 'dialog'} onClose={() => setOpen(null)} title="A square-cornered dialog" id={`${id}-dialog`}>
          <div style={{ padding: '0 0 32px', maxWidth: 560 }}>
            <p>Dialogs rise from 12px below their resting place while fading in, over 0.32s on the brand curve. With Motion off they appear in place. Press Escape or the close control to leave; focus returns to the button that opened this.</p>
            <div className="dycom-c5__actions" style={{ marginTop: 24 }}><Action onClick={() => setOpen(null)}>Close</Action></div>
          </div>
        </Modal>
        <Modal open={open === 'drawer'} onClose={() => setOpen(null)} title="A drawer" id={`${id}-drawer`} drawer>
          <div style={{ padding: '0 0 32px' }}>
            <p>Drawers slide in from the right over 0.4s and host the roles finder. They keep the same head, close control and focus behaviour as dialogs.</p>
          </div>
        </Modal>
        <Rules
          dos={['Render dialogs inside the brand scope so tokens and Motion off apply.', 'Give every dialog a visible title and a close icon button; cover the viewport with square edges on phones.', 'Return focus to the opener on close.']}
          donts={['No portals that escape the brand scope.', 'No rounded corners or drop shadows; the backdrop carries the depth.', 'No dialogs that open on load.']}
        />
      </Section>
    </>
  );
}

export function FormsPage() {
  return (
    <>
      {head('components/forms/')}
      <Section id="controls" title="Inputs and selects">
        <p>Text inputs and selects share the 50px control height, a 1px Fargo Gray rule, a white or paper field, Civic text and the Signal Green focus outline. Labels sit above the field in Geist Medium at 14px. Selects use a plain chevron drawn by the component; there is no native arrow and no pill. These are the controls the map directory and the roles drawer use.</p>
        <Stage label="Form controls (drawer filter styles)" tone="paper">
          <div className="dycom-c5__role-filters" style={{ padding: 0, borderBottom: 0 }}>
            <label>Work<input placeholder="Splicer, driver…" /></label>
            <label>Where<input placeholder="City, state or ZIP" /></label>
            <label className="dycom-c5__select-label" style={{ marginTop: 0 }}>Trade<select defaultValue=""><option value="">All trades</option><option>Fiber Splicing</option><option>Locating</option></select><ChevronDown className="dycom-c5__chevron" aria-hidden="true" /></label>
            <label className="dycom-c5__select-label" style={{ marginTop: 0 }}>Home-office region<select defaultValue=""><option value="">All regions</option><option>Southeast</option><option>West</option></select><ChevronDown className="dycom-c5__chevron" aria-hidden="true" /></label>
          </div>
        </Stage>
        <TokenTable names={['--c5-control-h', '--c5-rule', '--c5-paper', '--c5-civic', '--c5-green', '--c5-small']} />
      </Section>
      <Section id="inquiry" title="Inquiry form on Civic Blue">
        <p>The closing chapter’s form uses the dark variant: white labels in Geist Medium, fields drawn as a single white rule on Civic Blue that turns Signal Green on focus, selects with a white chevron, optional fields marked “Optional” after the label and one inverse submit button. Fields sit in a two-column grid with full-width rows for the message; one column on phones. The careers intent swaps the form for trade and location fields that open the roles drawer.</p>
        <Framed label="Closing · inquiry form" example="closing" note="Choose an intent to see its fields; submitting shows the confirmation state in place." />
        <Rules
          dos={['Keep every control at the shared height so mixed rows align.', 'Label every field visibly; placeholders are hints, not labels.', 'Use the plain chevron for selects.', 'On Civic Blue, use the single-rule field; on light surfaces, the boxed field.']}
          donts={['No rounded or pill fields.', 'No inner shadows or coloured borders.', 'No search icon inside the field where a label does the job.']}
        />
      </Section>
    </>
  );
}

export function FooterPage() {
  return (
    <>
      {head('components/footer/')}
      <Section id="footer" title="Site footer">
        <p>Civic Blue, white type in Geist Medium. Left: the approved Dycom logo reversed for the dark ground (the green mark with the wordmark in white, 144px wide — the same logo as the header, never a redrawn lockup) and the tagline. Right: six columns mirroring the sitemap groups in header order, titles in Fjalla One all caps at 14px, up to eight sentence-case links each with no arrows. Below 1100px the columns become accordions, one per group. The utility row carries the © year, Privacy policy, Terms of use and the Motion control, which flips <code>data-motion</code> for the whole site.</p>
        <Framed label="SiteFooter" example="footer" note={`${EXAMPLE_NOTE} The Motion control in the example flips the example only.`} />
        <Rules
          dos={['Mirror the six sitemap groups in header order.', 'Keep the Motion control in the utility row on every page.', 'Link only to site pages; the brand link returns home.', 'Collapse the columns into accordions below 1100px.']}
          donts={['No arrows in footer lists.', 'No “Visit dycom” or outward links.', 'No anchors into homepage chapters.']}
        />
      </Section>
    </>
  );
}

export function LinkToMap({ children }: { children: ReactNode }) {
  return <PageLink slug="components/company-map/">{children}</PageLink>;
}
