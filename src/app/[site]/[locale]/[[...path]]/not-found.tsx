import { ErrorPage, getCachedPageParams } from '@sitecore-content-sdk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import client from 'lib/sitecore-client';
import scConfig from 'sitecore.config';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import FallbackNotFound from 'components/content-sdk/FallbackNotFound';

export default async function NotFound() {
  const { site, locale } = getCachedPageParams();
  const page = await client.getErrorPage(ErrorPage.NotFound, {
    site: site || scConfig.defaultSite,
    locale: locale || scConfig.defaultLanguage,
  });

  if (!page) return <FallbackNotFound />;
  // not-found.tsx cannot export generateMetadata; React 19 hoists this <title> into <head>.
  const title = (page.layout.sitecore.route?.fields?.Title as { value?: string } | undefined)?.value;

  return (
    <NextIntlClientProvider>
      <>
      {title && <title>{title}</title>}
      <Providers page={page}>
        <Layout page={page} />
      </Providers>
      </>
    </NextIntlClientProvider>
  );
}
