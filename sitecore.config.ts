import { defineConfig } from '@sitecore-content-sdk/nextjs/config';

/**
 * Local content mode: true until Sitecore credentials are present in the environment.
 *
 * The Content SDK refuses to start without either an Experience Edge context id or a CM API host
 * and key. While Dycom's SitecoreAI environment does not exist yet, the app runs on the content in
 * `content/` (see `src/lib/sitecore-client.ts`); to satisfy the SDK it is given a placeholder CM
 * host on the reserved `.invalid` domain, which can never resolve, and the two proxy features that
 * would call it — redirects and personalization — are switched off.
 *
 * Connecting Sitecore = setting the variables in `.env.example`. Nothing here needs to change.
 */
export const LOCAL_CONTENT_MODE = !(
  process.env.SITECORE_EDGE_CONTEXT_ID ||
  ((process.env.SITECORE_API_HOST || process.env.NEXT_PUBLIC_SITECORE_API_HOST) &&
    (process.env.SITECORE_API_KEY || process.env.NEXT_PUBLIC_SITECORE_API_KEY))
);

/**
 * Sitecore Content SDK configuration — every value comes from the environment, as in Sitecore's
 * own starter. https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 */
export default defineConfig({
  defaultSite: process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || 'dycom',
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  redirects: {
    appLocalePrefix: 'as-needed',
    ...(LOCAL_CONTENT_MODE ? { enabled: false } : {}),
  },
  ...(LOCAL_CONTENT_MODE
    ? {
        api: { local: { apiHost: 'https://local-content.invalid', apiKey: 'local-content-mode' } },
        personalize: { enabled: false },
      }
    : {}),
});
