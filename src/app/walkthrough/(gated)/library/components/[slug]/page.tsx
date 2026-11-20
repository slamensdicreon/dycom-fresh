import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { componentBySlug, components, STATUS_MEANING, templateByCode } from 'src/walkthrough/data';
import { previews } from 'src/walkthrough/component-previews';
import { ComponentViewer } from 'src/walkthrough/library/ComponentViewer';
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
          <h1>{c.name}</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p className="wt-lede">{c.what}</p>
          <p>
            <StatusTag status={c.status} /> <span className="wt-small">{STATUS_MEANING[c.status]}</span>
          </p>
        </div>
      </div>
      {previews[c.name] && (
        <section className="wt-section" aria-label={`${c.name}, shown on its own`}>
          <ComponentViewer name={c.name} preview={previews[c.name]} />
        </section>
      )}
      <dl className="wt-facts">
        <div>
          <dt>Content comes from</dt>
          <dd>{c.source}</dd>
        </div>
        <div>
          <dt>Group</dt>
          <dd>{c.group}</dd>
        </div>
        <div>
          <dt>Requirement references</dt>
          <dd>{c.refs}</dd>
        </div>
      </dl>
      <section className="wt-section" aria-labelledby="where">
        <h2 id="where">Used on {c.templates.length === 16 ? 'every template' : `${used.length} template${used.length > 1 ? 's' : ''}`}</h2>
        <ul className="wt-used">
          {used.map((t) => (
            <li key={t.code}>
              <Link href={lib.template(t.slug)}>
                <span className="wt-code">{t.code}</span>
                <span>{t.name}</span>
                <span className="wt-small">{t.pagesServed}</span>
              </Link>
            </li>
          ))}
        </ul>
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
