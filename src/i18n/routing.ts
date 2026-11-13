import { defineRouting } from 'next-intl/routing';
import sitecoreConfig from 'sitecore.config';

export const routing = defineRouting({
  // Languages published for the site. Add 'es' here (and in Sitecore) when Spanish content exists.
  locales: [sitecoreConfig.defaultLanguage],
  defaultLocale: sitecoreConfig.defaultLanguage,
  localePrefix: sitecoreConfig.redirects?.appLocalePrefix || 'as-needed',
});
