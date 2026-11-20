import type { Metadata } from 'next';
import { investorsReview, keyChoices, smallerChoices } from 'src/walkthrough/input';
import { ChoiceList, ContentSplit, NeedsGrid } from 'src/walkthrough/ui/input';

export const metadata: Metadata = { title: 'Where we need your input' };

export default function InputPage() {
  return (
    <div className="wt-page">
      <div className="wt-page-head">
        <div>
          <h1>Where we need your input</h1>
        </div>
        <p className="wt-lede">
          The site has a working answer for every open question, so design and build keep moving. These are the choices, facts and stories only Dycom can provide.
        </p>
      </div>
      <section className="wt-section" aria-labelledby="key">
        <div className="wt-section-head">
          <h2 id="key">Choices only Dycom can make</h2>
          <p>Each shapes what visitors see.</p>
        </div>
        <ChoiceList items={keyChoices} />
      </section>
      <section className="wt-section" aria-labelledby="smaller">
        <div className="wt-section-head">
          <h2 id="smaller">Smaller choices, already answered for now</h2>
          <p>Quick confirmations. The site works as described until Dycom says otherwise.</p>
        </div>
        <ChoiceList items={smallerChoices} />
      </section>
      <section className="wt-section" aria-labelledby="info">
        <div className="wt-section-head">
          <h2 id="info">Information only Dycom holds</h2>
          <p>The facts that make the site specific to Dycom, and keep it accurate after launch.</p>
        </div>
        <NeedsGrid />
      </section>
      <section className="wt-section" aria-labelledby="content">
        <div className="wt-section-head">
          <h2 id="content">Content to write and approve</h2>
          <p>Some stories only Dycom can tell. For the rest, Icreon drafts in Dycom’s voice and Dycom approves.</p>
        </div>
        <ContentSplit />
      </section>
      <section className="wt-section" aria-labelledby="ir">
        <h2 id="ir">Still open from the Investors review</h2>
        <ChoiceList items={investorsReview} numbered={false} />
      </section>
    </div>
  );
}
