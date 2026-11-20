import type { Metadata } from 'next';
import Link from 'next/link';
import { components, templates } from 'src/walkthrough/data';
import { lib, StatusBreakdown } from 'src/walkthrough/ui/sections';

export const metadata: Metadata = { title: 'Library' };

export default function LibraryHome() {
  return (
    <div className="wt-page">
      <div className="wt-page-head">
        <div>
          <h1>Everything behind the new dycomind.com</h1>
        </div>
        <p className="wt-lede">
          The purpose of the site, the sixteen templates with their live designs, and the component kit that builds them — in one place, for the teams who will build, govern and grow the site.
        </p>
      </div>
      <div className="wt-cards">
        <Link href={lib.story} className="wt-card wt-card--dark">
          <h3>Story mode</h3>
          <p>The steering-committee walkthrough, full screen, one slide at a time. Arrow keys to move; G for the index.</p>
          <span className="wt-card-go">Start the walkthrough →</span>
        </Link>
        <Link href={lib.strategy} className="wt-card">
          <h3>Purpose & experience</h3>
          <p>What the site is for, who it serves, the experience rules every page keeps, the sitemap and the shared frame.</p>
          <span className="wt-card-go">Read it →</span>
        </Link>
        <Link href={lib.templates} className="wt-card">
          <h3>{templates.length} templates</h3>
          <p>Each with its job, its narrative, its Sitecore mapping and what Dycom still owes — and its designs, live, at desktop and phone width.</p>
          <span className="wt-card-go">Browse templates →</span>
        </Link>
        <Link href={lib.components} className="wt-card">
          <h3>{components.length} components</h3>
          <p>The consolidated kit: what each rendering does, its variants, its data source, its status and which templates use it.</p>
          <span className="wt-card-go">Browse components →</span>
        </Link>
      </div>
      <section className="wt-section">
        <div className="wt-section-head">
          <h2>The kit at a glance</h2>
        </div>
        <StatusBreakdown />
      </section>
    </div>
  );
}
