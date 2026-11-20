import { NextFetchEvent, NextResponse, type NextRequest } from 'next/server';
import {
  defineProxy,
  AppRouterMultisiteProxy,
  PersonalizeProxy,
  RedirectsProxy,
  LocaleProxy,
  BotTrackingProxy,
  PreviewProxy,
} from '@sitecore-content-sdk/nextjs/proxy';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';
import { routing } from './i18n/routing';
import client from './lib/sitecore-client';
import { PIN_COOKIE, isPinAuthorized, isPinConfigured, safeNext } from './lib/site-pin';
import { pinScreenHtml } from './lib/pin-screen';

/**
 * Site PIN gate — runs before everything else. Until the PIN cookie is set, every request is
 * refused: pages get the PIN screen (src/lib/pin-screen.ts) at their own address, so the page opens
 * after unlocking; files and API routes get a 401. Only the PIN screen's assets, the PIN route,
 * robots.txt, the icon and the Sitecore editing routes (which carry their own secret) pass.
 */
const PIN_OPEN = /^\/(gate-assets\/|api\/site-pin(\/|$)|robots\.txt$|icon\.png$|favicon\.ico$|api\/editing\/|healthz)/;

/** Requests the Sitecore proxies never handled (the old matcher's exclusions): files, API, internals. */
const NOT_SITECORE = /^\/(api\/|sitemap|robots|_next\/|healthz|sitecore\/api\/|-\/|walkthrough-assets\/)|\.(svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|eot|css|js|map|webmanifest|mp4|txt|xml|json|html)$/;

function noIndex(res: NextResponse): NextResponse {
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

function pinScreen(next: string, error?: string): NextResponse {
  const html = pinScreenHtml({
    next: safeNext(next),
    error: error === 'locked' ? 'locked' : error ? 'wrong' : undefined,
    configured: isPinConfigured(),
  });
  const res = new NextResponse(html, { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  res.headers.set('Cache-Control', 'private, no-store');
  return noIndex(res);
}

function pinGate(req: NextRequest): NextResponse {
  const { pathname, search } = req.nextUrl;
  const wantsPage = req.method === 'GET' && !NOT_SITECORE.test(pathname) && (req.headers.get('accept') ?? '').includes('text/html');
  if (!wantsPage) {
    const res = new NextResponse('Locked. Enter the site PIN first.', { status: 401, headers: { 'Content-Type': 'text/plain' } });
    res.headers.set('Cache-Control', 'private, no-store');
    return noIndex(res);
  }
  return pinScreen(pathname + search);
}

// Proxy chain copied unchanged from Sitecore's App Router starter. Without Edge credentials the
// Preview, BotTracking, Redirects and Personalize proxies skip themselves; Locale and Multisite
// still run, rewriting `/investors` to `/dycom/en/investors` from `.sitecore/sites.json`.

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;
  const unlocked = isPinAuthorized(req.cookies.get(PIN_COOKIE)?.value);
  // /gate/ is the PIN screen's own address (the no-script form returns here); once unlocked it
  // forwards to where the visitor was going.
  if (/^\/gate\/?$/.test(pathname)) {
    const next = req.nextUrl.searchParams.get('next');
    if (unlocked) return NextResponse.redirect(new URL(safeNext(next), req.url));
    return pinScreen(next ?? '/', req.nextUrl.searchParams.get('error') ?? undefined);
  }
  if (PIN_OPEN.test(pathname)) return noIndex(NextResponse.next());
  if (!unlocked) return pinGate(req);

  // The walkthrough is not a Sitecore page; its files and pages skip the Sitecore proxies.
  if (pathname.startsWith('/walkthrough')) {
    const res = noIndex(NextResponse.next());
    res.headers.set('Cache-Control', 'private, no-store');
    return res;
  }
  if (NOT_SITECORE.test(pathname)) return NextResponse.next();

  // PreviewProxy authorizes preview requests
  const preview = new PreviewProxy({
    client: client,
    ...scConfig.api.edge,
  });

  // BotTrackingProxy will detect and track bots before any other proxies run
  const botTracking = new BotTrackingProxy({
    ...scConfig.api.edge,
    sites,
    fetchEvent: event,
  });

  // LocaleProxy and AppRouterMultisiteProxy must always run for App Router routing
  const locale = new LocaleProxy({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    /**
     * List of all supported locales configured in routing.ts
     */
    locales: routing.locales.slice(),
    /**
     * Default language to use if no language is identified in the request
     */
    defaultLanguage: scConfig.defaultLanguage,
    // This function determines if the proxy should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
    // This is an important performance consideration since Next.js Edge proxy runs on every request.
    // in multilanguage scenarios, we need locale proxy to always run first to ensure locale is set and used correctly by the rest of the proxies
    skip: () => false,
  });

  const multisite = new AppRouterMultisiteProxy({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    ...scConfig.multisite,
    // This function determines if the proxy should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
    // This is an important performance consideration since Next.js Edge proxy runs on every request.
    skip: () => false,
  });

  // Instantiate proxies - they will use Edge config if available, otherwise fall back to local config
  // Each proxy will skip processing if required API configuration is not available
  const redirects = new RedirectsProxy({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    ...scConfig.api.edge,
    ...scConfig.api.local,
    ...scConfig.redirects,
    // This function determines if the proxy should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
    // By default it is disabled while in development mode.
    // This is an important performance consideration since Next.js Edge proxy runs on every request.
    skip: () => false,
  });

  const personalize = new PersonalizeProxy({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    ...scConfig.api.edge,
    ...scConfig.personalize,
    // This function determines if the proxy should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
    // By default it is disabled while in development mode.
    // This is an important performance consideration since Next.js Edge proxy runs on every request.
    // NOTE: Personalize requires Edge configuration and cannot work with local containers.
    // The proxy will disable itself if Edge config is not present.
    skip: () => false,
    // This is an example of how to provide geo data for personalization.
    // The provided callback will be called on each request to extract geo data.
    // extractGeoDataCb: () => {
    //   return {
    //     city: 'Athens',
    //     country: 'Greece',
    //     region: 'Attica',
    //   };
    // },
  });

  return defineProxy(preview, botTracking, locale, multisite, redirects, personalize).exec(req);
}

export const config = {
  /*
   * Run on everything except Next.js build output (/_next/static, HMR), so the PIN gate covers
   * every page, API route, image and file. Requests the Sitecore proxies never handled (files, API
   * routes, /_next/image, sitemap, robots, /sitecore/api, /-/ media) skip them after the gate.
   */
  matcher: ['/', '/((?!_next/static|_next/webpack-hmr).*)'],
};
