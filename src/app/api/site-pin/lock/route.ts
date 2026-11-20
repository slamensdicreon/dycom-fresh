import { NextResponse, type NextRequest } from 'next/server';
import { PIN_COOKIE } from 'lib/site-pin';

/** Locks the site again for this browser: clears the PIN cookie. */
export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/', req.url), 303);
  res.cookies.set(PIN_COOKIE, '', { path: '/', maxAge: 0 });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
