import type { Metadata } from 'next';
import { isWalkthroughConfigured, safeNext } from 'src/walkthrough/auth';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const configured = isWalkthroughConfigured();
  return (
    <main className="wt-login">
      <div className="wt-login-panel">
        <svg className="wt-signal" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M0 0 H100 V100 H89 A89 89 0 0 0 0 11 Z" />
          <path d="M0 50 H50 V100 H39 A39 39 0 0 0 0 61 Z" />
        </svg>
        <p className="wt-eyebrow">dycomind.com · Design walkthrough</p>
        <h1>Steering committee</h1>
        <p className="wt-login-lede">The strategy, templates, components and open decisions behind the new dycomind.com. For Dycom and Icreon only.</p>
        {configured ? (
          <form method="post" action="/api/walkthrough/login/" className="wt-login-form">
            <input type="hidden" name="next" value={safeNext(next)} />
            <label htmlFor="wt-password">Password</label>
            <input id="wt-password" name="password" type="password" autoComplete="current-password" required autoFocus aria-invalid={error ? true : undefined} aria-describedby={error ? 'wt-password-error' : undefined} />
            {error && (
              <p id="wt-password-error" className="wt-login-error" role="alert">
                That password didn’t match. Try again.
              </p>
            )}
            <button type="submit" className="wt-button">
              Enter <span aria-hidden="true">→</span>
            </button>
          </form>
        ) : (
          <p className="wt-login-error" role="alert">
            The walkthrough password is not set. Add WALKTHROUGH_PASSWORD to the project’s environment variables.
          </p>
        )}
      </div>
    </main>
  );
}
