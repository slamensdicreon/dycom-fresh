import type { Metadata } from 'next';
import {
  audiences,
  businessNeeds,
  company,
  experienceGoals,
  intents,
  learned,
  lessons,
  platform,
  templateQuestions,
  tension,
} from 'src/walkthrough/strategy';
import { BrandRules, InteriorFrame, Palette, ProductRules, SitemapColumns, TemplateTable } from 'src/walkthrough/ui/sections';

export const metadata: Metadata = { title: 'Strategy & narrative' };

export default function StrategyPage() {
  return (
    <div className="wt-page">
      <div className="wt-page-head">
        <div>
          <p className="wt-eyebrow">Strategy & narrative</p>
          <h1>Scale is Local</h1>
        </div>
        <p className="wt-lede">{tension.statement} {tension.resolution}</p>
      </div>

      <section className="wt-section">
        <h2>The platform</h2>
        <p className="wt-lede" style={{ maxWidth: '72ch' }}>{platform.ambition}</p>
        <div className="wt-milestones">
          {platform.milestones.map((m) => (
            <div key={m.date}>
              <strong style={{ color: 'var(--civic)' }}>{m.date}</strong>
              {m.label} — {m.note}
            </div>
          ))}
        </div>
        <dl className="wt-facts">
          {company.map((c) => (
            <div key={c.label}>
              <dt>{c.label}</dt>
              <dd>{c.figure}</dd>
            </div>
          ))}
        </dl>
      </section>

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
        <p style={{ maxWidth: '72ch' }}>The strategy defines thirteen user types. The homepage routes the four largest intents in one band, and the closing form asks “What brings you here?” with the same four answers.</p>
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
      </section>

      <section className="wt-section">
        <h2>What Dycom’s documents taught us</h2>
        <div className="wt-learned">
          {learned.map((l) => (
            <div key={l.source}>
              <h4>{l.source}</h4>
              <p>{l.finding}</p>
              <p>{l.response}</p>
            </div>
          ))}
        </div>
        <div className="wt-lessons">
          {lessons.map((l) => (
            <div key={l.title}>
              <h4>{l.title}</h4>
              <p>{l.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wt-section">
        <h2>Brand rules in force</h2>
        <Palette />
        <BrandRules />
      </section>

      <section className="wt-section">
        <h2>Product rules</h2>
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
            <p>Every interior template inherits the frame the Investors page proved. Each template is designed to answer the same six questions:</p>
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
