import type { Metadata } from 'next';
import { components, inventoryNotes, retired, sharedParts } from 'src/walkthrough/data';
import { ComponentBrowser } from 'src/walkthrough/library/ComponentBrowser';
import { NoteBody } from 'src/walkthrough/ui/NoteBody';
import { ComponentMatrix, StatusBreakdown } from 'src/walkthrough/ui/sections';

export const metadata: Metadata = { title: 'Components' };

const body = (text: string) => text.split('\n\n').slice(1).join('\n\n');

export default function ComponentsPage() {
  return (
    <div className="wt-page">
      <div className="wt-page-head">
        <div>
          <p className="wt-eyebrow">Component inventory</p>
          <h1>{components.length} renderings, one kit</h1>
        </div>
        <p className="wt-lede">The consolidated list of Sitecore renderings that build all sixteen templates, with the {sharedParts.length} shared parts they are made from. A new page is built from this list.</p>
      </div>
      <StatusBreakdown />
      <section className="wt-section" aria-labelledby="all">
        <h2 id="all">All components</h2>
        <ComponentBrowser />
      </section>
      <section className="wt-section" aria-labelledby="matrix">
        <div className="wt-section-head">
          <h2 id="matrix">Which template uses what</h2>
          <p>Columns are templates T01–T16. Blue: built or extended; green: new; grey: third-party.</p>
        </div>
        <ComponentMatrix />
      </section>
      <section className="wt-section" aria-labelledby="decisions">
        <h2 id="decisions">How the kit was decided</h2>
        <div className="wt-notes">
          <div className="wt-note" data-kind="mapping">
            <p className="wt-note-label">Consolidation decisions</p>
            <NoteBody text={body(inventoryNotes.invMerge)} />
          </div>
          <div className="wt-note" data-kind="job">
            <p className="wt-note-label">Rules for the kit</p>
            <NoteBody text={body(inventoryNotes.invRules)} />
          </div>
          <div className="wt-note" data-kind="open">
            <p className="wt-note-label">Still to design</p>
            <NoteBody text={body(inventoryNotes.invNext)} />
          </div>
        </div>
      </section>
      <section className="wt-section" aria-labelledby="parts">
        <h2 id="parts">Shared parts</h2>
        <p style={{ maxWidth: '70ch' }}>Not renderings: the building blocks every rendering uses, one style each.</p>
        <table className="wt-table">
          <tbody>
            {sharedParts.map((p) => (
              <tr key={p.name}>
                <th scope="row">{p.name}</th>
                <td>{p.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="wt-section" aria-labelledby="retired">
        <h2 id="retired">Retired as the pages are built</h2>
        <p style={{ maxWidth: '70ch' }}>Renderings the site uses today that fold into the kit above.</p>
        <table className="wt-table">
          <tbody>
            {retired.map((p) => (
              <tr key={p.name}>
                <th scope="row">{p.name}</th>
                <td>{p.becomes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
