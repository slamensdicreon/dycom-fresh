import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * Site PIN — the whole deployment (every page, the walkthrough, API routes and media) sits behind
 * one 4-digit PIN while the site is a private preview. The PIN is the SITE_PIN environment
 * variable; the cookie holds a hash of it, never the PIN itself, so changing the PIN in Vercel
 * locks everyone out again. With no PIN set, production stays locked and local development is open.
 *
 * Used by src/proxy.ts (the gate), the PIN route (src/app/api/site-pin) and the walkthrough layout
 * (a second check). Remove the gate when the site launches.
 */
export const PIN_COOKIE = 'dy_site_pin';
export const PIN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export const PIN_LENGTH = 4;

const pin = () => (process.env.SITE_PIN ?? '').trim();

export function pinToken(value: string): string {
  return createHash('sha256').update(`dycom-site-pin:${value}`).digest('hex');
}

function same(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function pinMatches(attempt: string): boolean {
  const expected = pin();
  if (!/^\d{4}$/.test(expected) || !/^\d{4}$/.test(attempt)) return false;
  return same(pinToken(attempt), pinToken(expected));
}

export function isPinAuthorized(cookieValue: string | undefined): boolean {
  const expected = pin();
  if (!expected) return process.env.NODE_ENV !== 'production';
  return !!cookieValue && same(cookieValue, pinToken(expected));
}

export function isPinConfigured(): boolean {
  return /^\d{4}$/.test(pin()) || process.env.NODE_ENV !== 'production';
}

/** Only same-site paths are allowed as the post-unlock destination. */
export function safeNext(next: string | null | undefined): string {
  return next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : '/';
}
