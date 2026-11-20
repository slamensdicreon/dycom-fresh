import type { Metadata } from 'next';
import { audiences, businessNeeds, experienceGoals, intents, templateQuestions, tension } from 'src/walkthrough/strategy';
import { InteriorFrame, ProductRules, SitemapColumns, TemplateTable } from 'src/walkthrough/ui/sections';

export const metadata: Metadata = { title: 'Purpose & experience' };

export default function StrategyPage() {
  return (
    <div className="wt-page">
      <div className="wt-page-head">
        <div>
          <h1>Scale is Local</h1>
        </div>
        <p className="wt-lede">
          {tension.statement} {tension.resolution}
        </p>
      </div>

      <section className="wt-section">
        <h2>What the site must do</h2>
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
      </section>

      <section className="wt-section">
        <h2>Who the site serves</h2>
        <p style={{ maxWidth: '72ch' }}>
          Thirteen audiences, four front doors. The homepage routes the four largest intents in one band, and the closing form asks “What brings you here?” with the same four answers.
        </p>
        <div className="wt-intents">
          {intents.map((i) => (
            <div key={i.name}>
              <strong>{i.name}</strong>
              <span>{i.line}</span>
            </div>
          ))}
        </div>
        <ul className="wt-audiences" aria-label="The thirteen audiences">
          {audiences.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      <section className="wt-section">
        <h2>Experience rules every page keeps</h2>
        <ProductRules />
      </section>

      <section className="wt-section">
        <div className="wt-section-head">
          <h2>The future-state sitemap</h2>
          <p>Six groups, every page placed once. Each page carries the template that builds it.</p>
        </div>
        <SitemapColumns />
      </section>

      <section className="wt-section">
        <h2>The interior frame</h2>
        <div className="wt-slide-grid">
          <div className="wt-slide-col">
            <p>Every interior template shares one frame, so a visitor always knows where they are and what to do next. Each template is designed to answer the same six questions:</p>
            <ul className="wt-questions">
              {templateQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
          <InteriorFrame />
        </div>
      </section>

      <section className="wt-section">
        <h2>Sixteen templates</h2>
        <TemplateTable />
      </section>
    </div>
  );
}
