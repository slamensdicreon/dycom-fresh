import Link from 'next/link';
import { LibraryNav } from 'src/walkthrough/library/LibraryNav';
import { lib } from 'src/walkthrough/ui/sections';

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#wt-main" className="visually-hidden">
        Skip to content
      </a>
      <header className="wt-lib-header">
        <div className="wt-lib-header-inner">
          <Link href={lib.home} className="wt-lib-brand">
            <svg className="wt-signal" viewBox="0 0 100 100" aria-hidden="true">
              <path d="M0 0 H100 V100 H89 A89 89 0 0 0 0 11 Z" />
              <path d="M0 50 H50 V100 H39 A39 39 0 0 0 0 61 Z" />
            </svg>
            Design library <small>dycomind.com</small>
          </Link>
          <LibraryNav />
          <div className="wt-lib-actions">
            <Link href={lib.story} className="wt-present">
              Present <span aria-hidden="true">→</span>
            </Link>
            <form method="post" action="/api/site-pin/lock/">
              <button type="submit" className="wt-link-button">
                Lock
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="wt-main" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
