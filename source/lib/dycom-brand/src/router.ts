// Minimal client-side routing shared by the Dycom sites: exact path matching
// against a sitemap each site defines, history sync, same-app link capture and
// the per-page document effects (title, scroll reset, heading focus).
import { useEffect, useState } from 'react';

export const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;

const ROUTE_EVENT = 'dycom:navigate';

export function navigate(pathname: string, { replace = false }: { replace?: boolean } = {}) {
  if (replace) window.history.replaceState(null, '', pathname);
  else window.history.pushState(null, '', pathname);
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

export type PageMeta = { title: string; description: string };

/** The path of the current location relative to BASE, or null when outside the site. */
export function relativePath(pathname: string): string | null {
  return pathname.startsWith(BASE) ? pathname.slice(BASE.length) : null;
}

/**
 * Resolves the current location to a route, re-resolving on history changes
 * and on clicks of same-origin links that resolve to a known route. Links that
 * resolve to `unknown` are left to the browser (the preview policy decides
 * what to show); pass `swallowUnknown` to keep such clicks on the current page.
 * An outer switch between two routed trees passes `captureLinks: false` so
 * only the inner tree handles clicks (two handlers would navigate twice).
 */
export function useResolvedRoute<R extends string>(
  resolve: (pathname: string) => R | 'unknown',
  fallback: R,
  { swallowUnknown = false, captureLinks = true }: { swallowUnknown?: boolean; captureLinks?: boolean } = {},
) {
  const [route, setRoute] = useState<R | 'unknown'>(() => (typeof window === 'undefined' ? fallback : resolve(window.location.pathname)));
  useEffect(() => {
    const sync = () => setRoute(resolve(window.location.pathname));
    sync();
    window.addEventListener('popstate', sync);
    window.addEventListener(ROUTE_EVENT, sync);
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (resolve(url.pathname) === 'unknown') {
        if (swallowUnknown && url.pathname.startsWith(BASE)) event.preventDefault();
        return;
      }
      if (url.pathname === window.location.pathname) return; // same page: let hashes behave natively
      event.preventDefault();
      navigate(`${url.pathname}${url.hash}`);
    };
    if (captureLinks) document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(ROUTE_EVENT, sync);
      document.removeEventListener('click', onClick);
    };
  }, [resolve, swallowUnknown, captureLinks]);
  return route;
}

let initialLoad = true; // module-level: the first page a visit lands on keeps the browser's own scroll and focus

/** Document title/description, scroll position and heading focus follow the route. */
export function usePageEffects(key: string, meta: PageMeta) {
  useEffect(() => {
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
  }, [meta.title, meta.description]);
  useEffect(() => {
    const isFirst = initialLoad;
    initialLoad = false;
    const hash = window.location.hash.slice(1);
    if (hash) {
      let tries = 0;
      let timer = 0;
      const seek = () => {
        const target = document.getElementById(decodeURIComponent(hash));
        if (target) { target.scrollIntoView({ block: 'start' }); return; }
        if (tries++ < 30) timer = window.setTimeout(seek, 50);
      };
      seek();
      return () => window.clearTimeout(timer);
    }
    if (isFirst) return; // the browser already handles the initial load
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    const frame = requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('main h1');
      if (!heading) return;
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [key]);
}
