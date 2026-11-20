import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { componentBySlug, components, STATUS_MEANING, templateByCode, thumbSrc } from 'src/walkthrough/data';
import { lib, StatusTag } from 'src/walkthrough/ui/sections';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = componentBySlug((await params).slug);
  return { title: c ? c.name : 'Component' };
}

export default async function ComponentPage({ params }: Params) {
  const c = componentBySlug((await params).slug);
  if (!c) notFound();
  const used = c.templates.map((code) => templateByCode(code)).filter((t) => !!t);
  const siblings = components.filter((x) => x.group === c.group && x.slug !== c.slug);
  return (
    <div className="wt-page">
      <div className="wt-page-head">
        <div>
          <p className="wt-crumbs">
            <Link href={lib.components}>Components</Link>
            <span aria-hidden="true">/</span>
            <span>{c.group}</span>
          </p>
          <p className="wt-eyebrow">Rendering</p>
          <h1>{c.name}</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p className="wt-lede">{c.what}</p>
          <p>
            <StatusTag status={c.status} /> <span className="wt-small">{STATUS_MEANING[c.status]}</span>
          </p>
        </div>
      </div>
      <dl className="wt-facts">
        <div>
          <dt>Requirements and handoff refs</dt>
          <dd>{c.refs}</dd>
        </div>
        <div>
          <dt>Content source</dt>
          <dd>{c.source}</dd>
        </div>
        <div>
          <dt>Group</dt>
          <dd>{c.group}</dd>
        </div>
        <div>
          <dt>Used by</dt>
          <dd>{c.templates.length === 16 ? 'Every template' : `${c.templates.length} template${c.templates.length > 1 ? 's' : ''}`}</dd>
        </div>
      </dl>
      <section className="wt-section" aria-labelledby="where">
        <h2 id="where">Where it is used</h2>
        <div className="wt-tcards">
          {used.map((t) => {
            const board = t.views[0]?.board;
            return (
              <Link key={t.code} href={lib.template(t.slug)} className="wt-tcard">
                {board ? (
                  <span className="wt-tcard-thumb" style={{ backgroundImage: `url('${thumbSrc(board)}')` }} aria-hidden="true" />
                ) : (
                  <span className="wt-tcard-thumb wt-tcard-thumb--live" aria-hidden="true">
                    Live on the site
                  </span>
                )}
                <span className="wt-tcard-body">
                  <span className="wt-code">{t.code}</span>
                  <h3>{t.name}</h3>
                  <span className="wt-small">{t.pagesServed}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      {siblings.length > 0 && (
        <section className="wt-section" aria-labelledby="related">
          <h2 id="related">Also in {c.group}</h2>
          <div className="wt-chips">
            {siblings.map((s) => (
              <Link key={s.slug} href={lib.component(s.slug)} className="wt-chip" style={{ height: 32, fontSize: 14, padding: '0 12px' }}>
                {s.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
