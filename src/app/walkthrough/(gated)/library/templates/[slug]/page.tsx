import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { componentsFor, templates } from 'src/walkthrough/data';
import { TemplateViewer } from 'src/walkthrough/library/TemplateViewer';
import { NOTE_LABEL, NoteBody } from 'src/walkthrough/ui/NoteBody';
import { lib, StatusTag } from 'src/walkthrough/ui/sections';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const t = templates.find((x) => x.slug === slug);
  return { title: t ? `${t.code} ${t.name}` : 'Template' };
}

const ORDER = ['job', 'narrative', 'mapping', 'open', 'aside'];

export default async function TemplatePage({ params }: Params) {
  const { slug } = await params;
  const i = templates.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const t = templates[i];
  const prev = templates[i - 1];
  const next = templates[i + 1];
  const used = componentsFor(t.code);
  const notes = [...t.notes].sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind));
  return (
    <div className="wt-page">
      <div className="wt-page-head">
        <div>
          <p className="wt-crumbs">
            <Link href={lib.templates}>Templates</Link>
            <span aria-hidden="true">/</span>
            <span>{t.code}</span>
          </p>
          <h1>
            <span className="wt-code">{t.code}</span> {t.name}
          </h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p>
            <StatusTag status={t.status === 'Built' ? 'Built' : 'Designed'} />
          </p>
          {t.headline && <p className="wt-lede">{t.headline.charAt(0).toUpperCase() + t.headline.slice(1)}.</p>}
          <p>
            <strong style={{ color: 'var(--civic)' }}>Pages it serves:</strong> {t.pagesServed}
            {t.pageCount !== 'feed' ? ` (${t.pageCount})` : ' (one per feed item)'}
          </p>
          <p>
            <Link href={`${lib.story}#/${t.slug}`}>See it in story mode →</Link>
          </p>
        </div>
      </div>

      <section className="wt-section" aria-labelledby="designs">
        <h2 id="designs">Designs</h2>
        <TemplateViewer code={t.code} name={t.name} views={t.views} />
      </section>

      <section className="wt-section" aria-labelledby="story">
        <h2 id="story">The job and the story</h2>
        <div className="wt-notes">
          {notes.map((n) => (
            <div key={n.key} className="wt-note" data-kind={n.kind}>
              <p className="wt-note-label">
                {n.heading && n.heading.includes(' — ') ? (
                  <>
                    {NOTE_LABEL[n.kind] ?? 'Note'} <span>· {n.heading.split(' — ').slice(1).join(' — ')}</span>
                  </>
                ) : (
                  n.heading || NOTE_LABEL[n.kind] || 'Note'
                )}
              </p>
              <NoteBody text={n.body} />
            </div>
          ))}
        </div>
        {notes.some((n) => n.kind === 'mapping') && t.code !== 'T01' && (
          <p className="wt-small">
            The Sitecore mapping notes were written as each template was designed; the final rendering names are the consolidated kit below.
          </p>
        )}
      </section>

      <section className="wt-section" aria-labelledby="kit">
        <div className="wt-section-head">
          <h2 id="kit">Components ({used.length})</h2>
          <p>The renderings from the final inventory that build this template.</p>
        </div>
        <div className="wt-comp-group">
          {used.map((c) => (
            <Link key={c.slug} href={lib.component(c.slug)} className="wt-comp-row">
              <span>
                <strong>{c.name}</strong>
                <span className="wt-refs">{c.group}</span>
              </span>
              <span>{c.what}</span>
              <span className="wt-small">{c.source}</span>
              <span>
                <StatusTag status={c.status} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <nav className="wt-section-head" aria-label="Other templates" style={{ borderTop: '2px solid var(--civic)', paddingTop: 20 }}>
        {prev ? <Link href={lib.template(prev.slug)}>← {prev.code} {prev.name}</Link> : <span />}
        {next ? <Link href={lib.template(next.slug)}>{next.code} {next.name} →</Link> : <span />}
      </nav>
    </div>
  );
}
