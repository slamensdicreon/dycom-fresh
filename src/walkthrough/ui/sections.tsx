import Link from 'next/link';
import {
  componentGroups,
  components,
  statusCounts,
  STATUS_MEANING,
  sitemap,
  templates,
  type Row,
} from '../data';
import { interiorFrame, productRules } from '../strategy';

/** Sections shared by story mode and the library. No hooks, so both server and client can use them. */

export const lib = {
  home: '/walkthrough/library/',
  strategy: '/walkthrough/library/strategy/',
  templates: '/walkthrough/library/templates/',
  template: (slug: string) => `/walkthrough/library/templates/${slug}/`,
  components: '/walkthrough/library/components/',
  component: (slug: string) => `/walkthrough/library/components/${slug}/`,
  decisions: '/walkthrough/library/decisions/',
  story: '/walkthrough/',
};

export function StatusTag({ status }: { status: string }) {
  return (
    <span className="wt-status" data-status={status} title={STATUS_MEANING[status]}>
      {status}
    </span>
  );
}

export function TemplateChip({ code, linked = true }: { code: string | null; linked?: boolean }) {
  if (!code) return null;
  if (!linked) return <span className="wt-chip">{code}</span>;
  return (
    <Link href={lib.template(code.toLowerCase())} className="wt-chip">
      {code}
    </Link>
  );
}

export function ProductRules() {
  return (
    <ol className="wt-numbered">
      {productRules.map((r) => (
        <li key={r}>{r}</li>
      ))}
    </ol>
  );
}

export function SitemapColumns({ compact = false, linked = true }: { compact?: boolean; linked?: boolean }) {
  return (
    <div className={`wt-sitemap${compact ? ' wt-sitemap--compact' : ''}`}>
      {sitemap.groups.map((g) => (
        <section key={g.label}>
          <h4>{g.label}</h4>
          <p className="wt-sitemap-overview">
            <span>{g.overview.text}</span>
            <TemplateChip code={g.overview.template} linked={linked} />
          </p>
          {g.columns.map((c) => (
            <div key={c.title}>
              <h5>{c.title}</h5>
              <ul>
                {c.links.map((l) => (
                  <li key={l.href + l.text}>
                    <span>{l.text}</span>
                    <TemplateChip code={l.template} linked={linked} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

export function InteriorFrame() {
  return (
    <ol className="wt-frame">
      {interiorFrame.map((p, i) => (
        <li key={p.name} data-part={i}>
          <span className="wt-frame-n">{i + 1}</span>
          <strong>{p.name}</strong>
          <span>{p.note}</span>
        </li>
      ))}
    </ol>
  );
}

export function TemplateTable() {
  return (
    <div className="wt-table-scroll">
    <table className="wt-table wt-table--templates">
      <thead>
        <tr>
          <th scope="col">Template</th>
          <th scope="col">Pages it serves</th>
          <th scope="col">Pages</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {templates.map((t) => (
          <tr key={t.code}>
            <th scope="row">
              <Link href={lib.template(t.slug)}>
                <span className="wt-code">{t.code}</span> {t.name}
              </Link>
            </th>
            <td>{t.pagesServed}</td>
            <td className="wt-num">{t.pageCount === 'feed' ? 'Automatic' : t.pageCount}</td>
            <td>
              <span className="wt-status" data-status={t.status === 'Built' ? 'Built' : 'Designed'}>
                {t.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

/** The kit's groups with every rendering in them, keyed by status. */
export function KitGroups() {
  return (
    <div className="wt-kit-groups">
      {componentGroups.map((g) => (
        <div key={g.name}>
          <h4>{g.name}</h4>
          <ul>
            {g.components.map((c) => (
              <li key={c.slug}>
                <span className="wt-key" data-status={c.status} />
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function StatusBreakdown() {
  const total = components.length;
  return (
    <div className="wt-breakdown">
      <div className="wt-breakdown-bar" role="img" aria-label={statusCounts.map((s) => `${s.status} ${s.count}`).join(', ')}>
        {statusCounts.map((s) => (
          <span key={s.status} data-status={s.status} style={{ flexGrow: s.count }} />
        ))}
      </div>
      <dl className="wt-breakdown-key">
        {statusCounts.map((s) => (
          <div key={s.status} data-status={s.status}>
            <dt>
              <span className="wt-key" data-status={s.status} />
              {s.status}
            </dt>
            <dd>
              <strong>{s.count}</strong>
              <span>{STATUS_MEANING[s.status]}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="wt-small">{total} renderings in all, each serving one or more of the sixteen templates.</p>
    </div>
  );
}

/** Components × templates: which rendering each template uses. */
export function ComponentMatrix({ linkComponents = true }: { linkComponents?: boolean }) {
  const codes = templates.map((t) => t.code);
  return (
    <div className="wt-matrix-scroll">
      <table className="wt-matrix">
        <thead>
          <tr>
            <th scope="col" className="wt-matrix-corner">
              Rendering
            </th>
            {codes.map((c) => (
              <th key={c} scope="col" title={c}>
                {linkComponents ? <Link href={lib.template(c.toLowerCase())}>{c.slice(1)}</Link> : c.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        {componentGroups.map((g) => (
          <tbody key={g.name}>
            <tr className="wt-matrix-group">
              <th colSpan={codes.length + 1} scope="colgroup">
                {g.name}
              </th>
            </tr>
            {g.components.map((c) => (
              <tr key={c.slug}>
                <th scope="row">
                  {linkComponents ? <Link href={lib.component(c.slug)}>{c.name}</Link> : <span className="wt-matrix-name">{c.name}</span>}
                  <span className="wt-key" data-status={c.status} title={c.status} />
                </th>
                {codes.map((code) => (
                  <td key={code} data-on={c.templates.includes(code) || undefined} data-status={c.status}>
                    {c.templates.includes(code) ? <span className="visually-hidden">{`${c.name} on ${code}`}</span> : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

/** Renders inline `code` from the requirements' Markdown cells. */
export function Cell({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('`') ? (
          <code key={i}>{p.slice(1, -1)}</code>
        ) : p.startsWith('**') ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : p.startsWith('*') && p.endsWith('*') && p.length > 2 ? (
          <em key={i}>{p.slice(1, -1)}</em>
        ) : (
          p.replace(/\\\*/g, '*')
        ),
      )}
    </>
  );
}

export function RowsTable({ rows, columns, rowHeader }: { rows: Row[]; columns: string[]; rowHeader?: string }) {
  return (
    <div className="wt-table-scroll">
      <table className="wt-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) =>
                c === rowHeader ? (
                  <th key={c} scope="row">
                    <Cell text={r[c] ?? ''} />
                  </th>
                ) : (
                  <td key={c}>
                    <Cell text={r[c] ?? ''} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
