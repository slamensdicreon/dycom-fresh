import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * Access to /walkthrough — the steering-committee presentation and design library. It shows
 * internal material (open decisions, what Dycom still owes), so it sits behind one shared password
 * set in the WALKTHROUGH_PASSWORD environment variable, and is never indexed.
 *
 * The cookie holds a hash of the password, never the password itself; changing the password in
 * Vercel signs everyone out. With no password set, production refuses everyone and local
 * development lets everyone in.
 */
export const WALKTHROUGH_COOKIE = 'dy_walkthrough';
export const WALKTHROUGH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const password = () => process.env.WALKTHROUGH_PASSWORD ?? '';

export function walkthroughToken(value: string): string {
  return createHash('sha256').update(`dycom-walkthrough:${value}`).digest('hex');
}

export function passwordMatches(attempt: string): boolean {
  const expected = password();
  if (!expected) return false;
  const a = Buffer.from(walkthroughToken(attempt));
  const b = Buffer.from(walkthroughToken(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isWalkthroughAuthorized(cookieValue: string | undefined): boolean {
  const expected = password();
  if (!expected) return process.env.NODE_ENV !== 'production';
  if (!cookieValue) return false;
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(walkthroughToken(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isWalkthroughConfigured(): boolean {
  return Boolean(password()) || process.env.NODE_ENV !== 'production';
}

/** Only same-site walkthrough paths are allowed as the post-login destination. */
export function safeNext(next: string | null | undefined): string {
  return next && /^\/walkthrough(\/|-assets\/|$)/.test(next) && !next.startsWith('//') ? next : '/walkthrough/';
}
