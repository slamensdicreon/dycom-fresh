import { NextResponse, type NextRequest } from 'next/server';
import { WALKTHROUGH_COOKIE, WALKTHROUGH_MAX_AGE, passwordMatches, safeNext, walkthroughToken } from 'src/walkthrough/auth';

/** Walkthrough sign-in: checks the shared password and sets the access cookie. */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const attempt = String(form.get('password') ?? '');
  const next = safeNext(String(form.get('next') ?? ''));

  if (!passwordMatches(attempt)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    const back = new URL('/walkthrough/login/', req.url);
    back.searchParams.set('error', '1');
    back.searchParams.set('next', next);
    return NextResponse.redirect(back, 303);
  }

  const res = NextResponse.redirect(new URL(next, req.url), 303);
  res.cookies.set(WALKTHROUGH_COOKIE, walkthroughToken(attempt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: WALKTHROUGH_MAX_AGE,
  });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
