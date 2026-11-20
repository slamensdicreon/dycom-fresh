import type { Metadata } from 'next';
import Link from 'next/link';
import { componentsFor, templates, thumbSrc } from 'src/walkthrough/data';
import { lib } from 'src/walkthrough/ui/sections';

export const metadata: Metadata = { title: 'Templates' };

export default function TemplatesPage() {
  return (
    <div className="wt-page">
      <div className="wt-page-head">
        <div>
          <h1>Sixteen templates</h1>
        </div>
        <p className="wt-lede">Every page of the future-state sitemap is one of these. Each has one job, a narrative in Dycom’s words, a Sitecore mapping and a list of what Dycom still owes — and its designs, live, at desktop and phone width.</p>
      </div>
      <div className="wt-tcards">
        {templates.map((t) => {
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
                <span>{t.headline ? t.headline.charAt(0).toUpperCase() + t.headline.slice(1) : ''}</span>
                <span className="wt-tcard-meta">
                  <span>{t.pagesServed}</span>
                  <span className="wt-status" data-status={t.status === 'Built' ? 'Built' : 'Designed'}>
                    {t.status}
                  </span>
                </span>
                <span className="wt-small">
                  {t.views.length} design{t.views.length > 1 ? 's' : ''} · {componentsFor(t.code).length} components
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
