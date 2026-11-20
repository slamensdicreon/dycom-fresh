import { NextResponse, type NextRequest } from 'next/server';
import { WALKTHROUGH_COOKIE } from 'src/walkthrough/auth';

/** Walkthrough sign-out: clears the access cookie. */
export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/walkthrough/login/', req.url), 303);
  res.cookies.set(WALKTHROUGH_COOKIE, '', { path: '/', maxAge: 0 });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
