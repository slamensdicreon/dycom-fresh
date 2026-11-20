'use client';
import Link from 'next/link';
import {
  boardHeight,
  pageCountLabel,
  boardSrc,
  components,
  inventoryNotes,
  templates,
  type Template,
} from '../data';
import {
  audiences,
  businessNeeds,
  experienceGoals,
  intents,
  templateQuestions,
  tension,
} from '../strategy';
import { BoardFrame } from '../ui/BoardFrame';
import { NoteBody } from '../ui/NoteBody';
import {
  ComponentMatrix,
  InteriorFrame,
  KitGroups,
  lib,
  ProductRules,
  SitemapColumns,
  StatusBreakdown,
  StatusTag,
  TemplateTable,
} from '../ui/sections';

export type SlideCtx = { goTo: (id: string) => void };
export type Slide = {
  id: string;
  chapter: string;
  title: string;
  className?: string;
  photo?: string;
  render: (ctx: SlideCtx) => React.ReactNode;
};

const photo = (name: string) => `/media/photography/web/${name}-2000.webp`;
const CH = {
  open: 'Opening',
  strategy: '1 · Purpose & experience',
  templates: '2 · Templates',
  components: '3 · Components',
  close: 'Close',
};

function Head({ title, lede }: { title: React.ReactNode; lede?: React.ReactNode }) {
  return (
    <div className="wt-slide-head">
      <h2>{title}</h2>
      {lede && <p className="wt-lede">{lede}</p>}
    </div>
  );
}

function Divider({ n, title, points }: { n: string; title: string; points: string[] }) {
  return (
    <>
      <span className="wt-divider-n">{n}</span>
      <h1>{title}</h1>
      <ul>
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </>
  );
}

function TemplateSlide({ t }: { t: Template }) {
  const view = t.views[0];
  const src = view.live ?? boardSrc(view.board!);
  const job = t.notes.find((n) => n.kind === 'job');
  const extra = t.views.length - 1;
  return (
    <div className="wt-tslide">
      <div className="wt-tslide-copy">
        <span className="wt-tslide-code">{t.code}</span>
        <h2>{t.name}</h2>
        {t.headline && <p className="wt-tslide-headline">{t.headline.charAt(0).toUpperCase() + t.headline.slice(1)}.</p>}
        <div className="wt-tslide-meta">
          <StatusTag status={t.status === 'Built' ? 'Built' : 'New'} />
          <span>
            <strong style={{ color: 'var(--civic)' }}>{pageCountLabel(t.pageCount)}</strong> · {t.pagesServed}
          </span>
        </div>
        {job && (
          <div className="wt-note" data-kind="job">
            <p className="wt-note-label">What the page does</p>
            <NoteBody text={job.body} />
          </div>
        )}
        <p className="wt-small">
          {extra > 0 ? `${extra} more design${extra > 1 ? 's' : ''} — other pages and states — in the library.` : 'The full story is in the library.'}
        </p>
        <div className="wt-tslide-more">
          <Link href={lib.template(t.slug)} className="wt-button wt-button--outline" target="_blank">
            Open in the library <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <div className={`wt-tslide-boards${view.phone ? '' : ' wt-tslide-boards--single'}`}>
        <div>
          <p className="wt-board-label">
            <span>{view.title}</span>
            <span>Desktop · 1440</span>
          </p>
          <BoardFrame src={src} width={1440} height={boardHeight(view.board, 1440)} title={`${t.code} ${t.name}: ${view.title}`} eager />
        </div>
        {view.phone && (
          <div>
            <p className="wt-board-label">
              <span>Phone · 390</span>
            </p>
            <BoardFrame src={src} width={390} height={boardHeight(view.board, 390)} title={`${t.code} ${t.name}: ${view.title}, phone`} eager />
          </div>
        )}
      </div>
    </div>
  );
}

const statusCount = (s: string) => components.filter((c) => c.status === s).length;

export const slides: Slide[] = [
  // ---------------------------------------------------------------- opening
  {
    id: 'cover',
    chapter: CH.open,
    title: 'The design system, walked through',
    className: 'wt-dark wt-cover',
    photo: photo('z9a_4064'),
    render: () => (
      <>
        <h1>The design system, walked through</h1>
        <p className="wt-lede">The purpose behind the new dycomind.com, the sixteen templates that build every page, and the components they share.</p>
        <div className="wt-cover-meta">
          <div>
            <strong>For</strong>Dycom steering committee and leadership
          </div>
          <div>
            <strong>From</strong>Icreon
          </div>
          <div>
            <strong>Design status</strong>
            {templates.length} templates · {components.length} components
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'agenda',
    chapter: CH.open,
    title: 'Today',
    render: ({ goTo }) => (
      <>
        <Head title="Three parts, one system" lede="The direction leadership approved — homepage, navigation, Investors — has been extended into a complete page system. We walk it in the order it was built: why, what and how." />
        <ol className="wt-agenda">
          {[
            ['strategy', 'Purpose & experience', 'What the site is for, who it serves, and the experience every page keeps.'],
            ['templates', 'Templates', 'Sixteen templates, each with one job and its story — live, desktop and phone.'],
            ['components', 'Components', `${components.length} renderings that build every template, and how they were consolidated.`],
          ].map(([id, name, line], i) => (
            <li key={id}>
              <button type="button" onClick={() => goTo(id)}>
                <span className="wt-agenda-n">{i + 1}</span>
                <strong>{name}</strong>
                <span>{line}</span>
              </button>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  // ---------------------------------------------------------------- strategy
  {
    id: 'strategy',
    chapter: CH.strategy,
    title: 'Chapter 1 · Purpose & experience',
    className: 'wt-dark wt-divider',
    photo: photo('z9b_1711'),
    render: () => <Divider n="01" title="Purpose & experience" points={['What the site is for', 'Who it serves', 'Experience rules', 'The sitemap and the frame']} />,
  },
  {
    id: 'scale-is-local',
    chapter: CH.strategy,
    title: 'Scale is Local',
    className: 'wt-dark wt-divider',
    photo: photo('z9a_0525'),
    render: () => (
      <>
        <p className="wt-lede" style={{ maxWidth: '58ch' }}>{tension.statement}</p>
        <p className="wt-quote">
          Scale is <em>Local</em>
        </p>
        <p className="wt-lede" style={{ maxWidth: '58ch' }}>{tension.resolution}</p>
      </>
    ),
  },
  {
    id: 'needs-goals',
    chapter: CH.strategy,
    title: 'What the site must do',
    render: () => (
      <>
        <Head title="What the site must do" />
        <div className="wt-twolists">
          <div>
            <h3>Business needs</h3>
            <ol>
              {businessNeeds.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ol>
          </div>
          <div>
            <h3>Experience goals</h3>
            <ol>
              {experienceGoals.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ol>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'audiences',
    chapter: CH.strategy,
    title: 'Who the site serves',
    render: () => (
      <>
        <Head title="Thirteen audiences, four front doors" lede="The strategy defines thirteen user types. The homepage routes the four largest intents in one band, and the closing form asks “What brings you here?” with the same four answers." />
        <div className="wt-intents">
          {intents.map((i) => (
            <div key={i.name}>
              <strong>{i.name}</strong>
              <span>{i.line}</span>
            </div>
          ))}
        </div>
        <ul className="wt-audiences" aria-label="The thirteen user types">
          {audiences.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'product-rules',
    chapter: CH.strategy,
    title: 'Experience rules',
    render: () => (
      <>
        <Head title="Experience rules every page keeps" lede="What every visitor can rely on, on every template." />
        <ProductRules />
      </>
    ),
  },
  {
    id: 'sitemap',
    chapter: CH.strategy,
    title: 'The future-state sitemap',
    render: () => (
      <>
        <Head title="Six groups. Every page placed once." lede="The menu is the future-state sitemap: every current page placed once, under the group a visitor would look for it in. Each page is tagged with the template that builds it." />
        <SitemapColumns compact linked={false} />
      </>
    ),
  },
  {
    id: 'frame',
    chapter: CH.strategy,
    title: 'The interior frame',
    render: () => (
      <div className="wt-slide-grid">
        <div className="wt-slide-col">
          <Head title="Every interior page shares one frame" lede="The Investors page proved it. Every interior template inherits these six parts, so a visitor always knows where they are and what to do next." />
          <h3 className="wt-slide-subhead">Every template answers six questions</h3>
          <ul className="wt-questions">
            {templateQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
        <div className="wt-slide-col">
          <InteriorFrame />
        </div>
      </div>
    ),
  },
  {
    id: 'sixteen',
    chapter: CH.strategy,
    title: 'Sixteen templates',
    render: () => (
      <>
        <Head title="Sixteen templates build the whole site" lede="Two are built and live. Fourteen are designed, desktop and phone, with their narrative and content sources — ready to build." />
        <TemplateTable />
      </>
    ),
  },
  // ---------------------------------------------------------------- templates
  {
    id: 'templates',
    chapter: CH.templates,
    title: 'Chapter 2 · Templates',
    className: 'wt-dark wt-divider',
    photo: photo('z9b_2139'),
    render: () => <Divider n="02" title="The templates" points={['One job each', 'The story, beat by beat', 'Live designs — desktop and phone', 'Scroll each design to read it']} />,
  },
  ...templates.map(
    (t): Slide => ({
      id: t.slug,
      chapter: CH.templates,
      title: `${t.code} ${t.name}`,
      render: () => <TemplateSlide t={t} />,
    }),
  ),
  // ---------------------------------------------------------------- components
  {
    id: 'components',
    chapter: CH.components,
    title: 'Chapter 3 · Components',
    className: 'wt-dark wt-divider',
    photo: photo('z9b_6665'),
    render: () => <Divider n="03" title="The components" points={[`${components.length} renderings`, 'One component per job', 'Which template uses what', 'What is left to design']} />,
  },
  {
    id: 'kit',
    chapter: CH.components,
    title: 'The kit',
    render: () => (
      <>
        <Head
          title={`${components.length} renderings build every page`}
          lede={`Reviewing all sixteen templates together, we consolidated everything they need into one kit. ${statusCount('Built') + statusCount('Extend')} renderings already exist in the site or grow from one that does; ${statusCount('New')} are designed and new; ${statusCount('Not designed')} are required by Dycom’s lists but not yet designed.`}
        />
        <StatusBreakdown />
        <KitGroups />
      </>
    ),
  },
  {
    id: 'consolidation',
    chapter: CH.components,
    title: 'Consolidation decisions',
    render: () => (
      <div className="wt-slide-grid wt-slide-grid--even">
        <div className="wt-slide-col">
          <Head title="Where templates solved the same problem, one component" />
          <div className="wt-note" data-kind="mapping">
            <NoteBody text={inventoryNotes.invMerge.split('\n\n').slice(1).join('\n\n')} />
          </div>
        </div>
        <div className="wt-slide-col">
          <div className="wt-note" data-kind="job">
            <p className="wt-note-label">Rules for the kit</p>
            <NoteBody text={inventoryNotes.invRules.split('\n\n').slice(1).join('\n\n')} />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'matrix',
    chapter: CH.components,
    title: 'Which template uses what',
    render: () => (
      <>
        <Head title="Which template uses what" lede="Columns are templates T01–T16. Blue: built or extended; green: new; grey: third-party." />
        <ComponentMatrix linkComponents={false} />
      </>
    ),
  },
  {
    id: 'still-to-design',
    chapter: CH.components,
    title: 'Still to design',
    render: () => (
      <div className="wt-slide-grid wt-slide-grid--even">
        <div className="wt-slide-col">
          <Head title="Required, not yet designed" lede="Each sits in Dycom’s requirements or Custom Components list but has no template that needs it yet." />
        </div>
        <div className="wt-slide-col">
          <div className="wt-note" data-kind="open">
            <NoteBody text={inventoryNotes.invNext.split('\n\n').slice(1).join('\n\n')} />
          </div>
        </div>
      </div>
    ),
  },
  // ---------------------------------------------------------------- close
  {
    id: 'close',
    chapter: CH.close,
    title: 'Next',
    className: 'wt-dark wt-cover',
    photo: photo('z9b_1711'),
    render: () => (
      <>
        <h1>Everything stays here</h1>
        <p className="wt-lede">The library keeps every template, design and component in one place for the teams building and governing the site. Use it to review and to onboard.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href={lib.home} className="wt-button wt-button--inverse">
            Open the library <span aria-hidden="true">→</span>
          </Link>
        </div>
      </>
    ),
  },
];
