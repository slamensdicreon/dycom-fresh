import 'server-only';
import type { DictionaryPhrases, HTMLLink, LayoutServiceData, Page, SiteInfo } from '@sitecore-content-sdk/nextjs';
import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import type { SitecoreConfig } from '@sitecore-content-sdk/nextjs/config';
import localLayout from '.sitecore/local-layout.json';
import sites from '.sitecore/sites.json';

type LocalRoute = LayoutServiceData & { meta: { notFound: boolean; sitemap: boolean } };
type LocalSite = Record<string, { routes: Record<string, LocalRoute>; dictionary: DictionaryPhrases }>;
const data = localLayout as unknown as Record<string, LocalSite>;

type RouteOptions = { site?: string; locale?: string };
type StaticParams = { site: string; locale: string; path: string[] };

/**
 * Stand-in for `SitecoreNextjsClient` while the site runs on local content.
 *
 * It implements the subset of the client API this app calls, with identical signatures, and
 * returns the same `Page` / `LayoutServiceData` shapes Experience Edge returns. The data is
 * compiled from `content/` by `scripts/build-local-content.mjs`.
 *
 * When `SITECORE_EDGE_CONTEXT_ID` is set, `lib/sitecore-client` uses the real client instead and
 * this file is no longer reached.
 */
export class LocalSitecoreClient {
  constructor(private readonly config: SitecoreConfig) {}

  private locale(site: string, locale?: string) {
    const siteData = data[site] ?? data[this.config.defaultSite];
    return siteData?.[locale ?? this.config.defaultLanguage] ?? siteData?.[this.config.defaultLanguage];
  }

  /** `['investors']` / `'/investors/'` → `'/investors'`; empty → `'/'`. */
  parsePath(path: string | string[]): string {
    const joined = Array.isArray(path) ? path.join('/') : path;
    const clean = joined.split('?')[0].replace(/^\/+|\/+$/g, '');
    return clean ? `/${decodeURIComponent(clean).toLowerCase()}` : '/';
  }

  private toPage(layout: LocalRoute, site: string, locale: string): Page {
    const { meta: _meta, ...layoutData } = layout;
    return {
      layout: structuredClone(layoutData) as LayoutServiceData,
      siteName: site,
      locale,
      mode: {
        name: 'normal' as Page['mode']['name'],
        isNormal: true,
        isPreview: false,
        isEditing: false,
        isDesignLibrary: false,
        designLibrary: { isVariantGeneration: false },
      },
    };
  }

  async getPage(path: string | string[], options: RouteOptions = {}): Promise<Page | null> {
    const site = options.site || this.config.defaultSite;
    const locale = options.locale || this.config.defaultLanguage;
    const route = this.locale(site, locale)?.routes[this.parsePath(path)];
    return route && !route.meta.notFound ? this.toPage(route, site, locale) : null;
  }

  async getErrorPage(code: ErrorPage, options: RouteOptions = {}): Promise<Page | null> {
    if (code !== ErrorPage.NotFound) return null;
    const site = options.site || this.config.defaultSite;
    const locale = options.locale || this.config.defaultLanguage;
    const route = Object.values(this.locale(site, locale)?.routes ?? {}).find((r) => r.meta.notFound);
    return route ? this.toPage(route, site, locale) : null;
  }

  async getDictionary(options: RouteOptions = {}): Promise<DictionaryPhrases> {
    return this.locale(options.site || this.config.defaultSite, options.locale)?.dictionary ?? {};
  }

  async getAppRouterStaticParams(siteNames: string[], languages: string[] = [this.config.defaultLanguage]): Promise<StaticParams[]> {
    return siteNames.flatMap((site) =>
      languages.flatMap((locale) =>
        Object.entries(data[site]?.[locale]?.routes ?? {})
          .filter(([, r]) => !r.meta.notFound)
          .map(([path]) => ({ site, locale, path: path === '/' ? [] : path.slice(1).split('/') }))
      )
    );
  }

  /** Sitecore-hosted stylesheets (Pages / Design Library themes) do not exist locally. */
  getHeadLinks(_layoutData: LayoutServiceData, _options?: { enableStyles?: boolean; enableThemes?: boolean }): HTMLLink[] {
    return [];
  }

  /** Preview, editing and Design Library need a connected Sitecore instance. */
  getPreviewData(_headers: Headers): undefined {
    return undefined;
  }
  async getPreview(_previewData: unknown): Promise<Page | null> {
    return null;
  }
  async getDesignLibraryData(_previewData: unknown): Promise<Page> {
    throw new Error('Design Library preview requires a connected Sitecore instance.');
  }

  async getSiteMap({ reqHost, reqProtocol, siteName }: { reqHost: string; reqProtocol: string | string[]; siteName?: string }): Promise<string> {
    const site = siteName || this.config.defaultSite;
    const protocol = Array.isArray(reqProtocol) ? reqProtocol[0] : reqProtocol;
    const urls = Object.entries(this.locale(site)?.routes ?? {})
      .filter(([, r]) => r.meta.sitemap)
      .map(([path]) => `  <url><loc>${protocol}://${reqHost}${path === '/' ? '/' : `${path}/`}</loc></url>`);
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  }

  async getRobots(_siteName: string): Promise<string | null> {
    // Local content is a preview of the future site: keep it out of search indexes.
    return 'User-agent: *\nDisallow: /\n';
  }

  async getLlmsTxt({ siteName }: { siteName: string }): Promise<string | null> {
    const routes = this.locale(siteName || this.config.defaultSite)?.routes ?? {};
    const lines = Object.entries(routes)
      .filter(([, r]) => r.meta.sitemap)
      .map(([path, r]) => `- [${(r.sitecore.route?.fields?.Title as { value?: string } | undefined)?.value ?? path}](${path})`);
    return `# Dycom Industries\n\n> The People Connecting America®\n\n${lines.join('\n')}\n`;
  }

  get sites(): SiteInfo[] {
    return sites as SiteInfo[];
  }
}
