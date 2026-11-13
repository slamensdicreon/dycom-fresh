import { getRequestConfig, GetRequestConfigParams } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import client from 'lib/sitecore-client';

export default getRequestConfig(async ({ requestLocale }: GetRequestConfigParams) => {
  // Set by the catch-all route as `{site}_{locale}` (Content SDK App Router convention).
  const requested = await requestLocale;
  const [parsedSite, parsedLocale] = requested?.split('_') || [];
  const locale = hasLocale(routing.locales, parsedLocale) ? parsedLocale : routing.defaultLocale;

  const messages: Record<string, object> = {};
  if (parsedSite) {
    messages[parsedSite] = await client.getDictionary({ locale, site: parsedSite });
  }

  return { locale, messages };
});
