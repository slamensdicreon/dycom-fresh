import type { Metadata } from 'next';
import { decisions } from 'src/walkthrough/data';
import { RowsTable } from 'src/walkthrough/ui/sections';

export const metadata: Metadata = { title: 'Decisions & what’s owed' };

export default function DecisionsPage() {
  return (
    <div className="wt-page">
      <div className="wt-page-head">
        <div>
          <h1>What we need from Dycom</h1>
        </div>
        <p className="wt-lede">
          Every open decision has a working default, so design and build continue; none is settled. These tables come from the living requirements (<code>docs/requirements.md</code> §4–5) and change as decisions are made.
        </p>
      </div>
      <section className="wt-section" aria-labelledby="open">
        <h2 id="open">Open decisions and the pages they block</h2>
        <RowsTable rows={decisions.openDecisions} columns={['ID', 'Decision', 'Default in the prototype', 'Blocks']} rowHeader="ID" />
      </section>
      <section className="wt-section" aria-labelledby="ir">
        <h2 id="ir">Open from the Investors review (November 11, 2026)</h2>
        <RowsTable rows={decisions.investorsReview} columns={['Item', 'Why it is open', 'What the site does meanwhile']} rowHeader="Item" />
      </section>
      <section className="wt-section" aria-labelledby="data">
        <h2 id="data">Data the build needs that does not exist yet</h2>
        <RowsTable rows={decisions.dataDependencies} columns={['Dependency', 'What is missing', 'Pages blocked']} rowHeader="Dependency" />
      </section>
      <section className="wt-section" aria-labelledby="new">
        <h2 id="new">New content and who supplies it</h2>
        <RowsTable rows={decisions.netNewContent} columns={['Item', 'Supplier']} rowHeader="Item" />
      </section>
      <section className="wt-section" aria-labelledby="items">
        <h2 id="items">Content that is not a page</h2>
        <RowsTable rows={decisions.contentItems} columns={['Item', 'Status', 'Supplier']} rowHeader="Item" />
      </section>
    </div>
  );
}
