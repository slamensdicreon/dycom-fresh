import { NextResponse, type NextRequest } from 'next/server';
import { PIN_COOKIE, PIN_MAX_AGE, pinMatches, pinToken, safeNext } from 'lib/site-pin';

/**
 * Unlocks the site: checks the 4-digit PIN and sets the PIN cookie.
 * JSON ({ pin }) from the PIN screen's script answers JSON; a plain form post (d0–d3, next) from
 * the no-script fallback redirects. Wrong guesses are slowed, and five misses in a row lock that
 * client out for a minute (per server instance — a deterrent, not a guarantee).
 */
const misses = new Map<string, { count: number; until: number }>();
const MAX_MISSES = 5;
const LOCKOUT_MS = 60_000;

function clientKey(req: NextRequest): string {
  return (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  const isJson = (req.headers.get('content-type') ?? '').includes('application/json');
  let attempt = '';
  let next = '/';
  if (isJson) {
    const body = (await req.json().catch(() => ({}))) as { pin?: unknown };
    attempt = String(body.pin ?? '');
  } else {
    const form = await req.formData();
    attempt = ['d0', 'd1', 'd2', 'd3'].map((k) => String(form.get(k) ?? '')).join('') || String(form.get('pin') ?? '');
    next = safeNext(String(form.get('next') ?? '/'));
  }

  const key = clientKey(req);
  const now = Date.now();
  const record = misses.get(key);
  if (record && record.until > now) {
    return isJson
      ? NextResponse.json({ ok: false, error: 'locked', retryAfter: Math.ceil((record.until - now) / 1000) }, { status: 429 })
      : NextResponse.redirect(new URL(`/gate/?error=locked&next=${encodeURIComponent(next)}`, req.url), 303);
  }

  if (!pinMatches(attempt)) {
    const count = (record && record.until <= now && record.count >= MAX_MISSES ? 0 : record?.count ?? 0) + 1;
    misses.set(key, { count, until: count >= MAX_MISSES ? now + LOCKOUT_MS : 0 });
    await new Promise((r) => setTimeout(r, 500));
    return isJson
      ? NextResponse.json({ ok: false, error: count >= MAX_MISSES ? 'locked' : 'wrong', retryAfter: count >= MAX_MISSES ? LOCKOUT_MS / 1000 : 0 }, { status: count >= MAX_MISSES ? 429 : 401 })
      : NextResponse.redirect(new URL(`/gate/?error=1&next=${encodeURIComponent(next)}`, req.url), 303);
  }

  misses.delete(key);
  const res = isJson ? NextResponse.json({ ok: true }) : NextResponse.redirect(new URL(next, req.url), 303);
  res.cookies.set(PIN_COOKIE, pinToken(attempt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: PIN_MAX_AGE,
  });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
