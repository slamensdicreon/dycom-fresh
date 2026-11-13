import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import client from 'lib/sitecore-client';
import scConfig from 'sitecore.config';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import FallbackNotFound from 'components/content-sdk/FallbackNotFound';

export default async function NotFound() {
  const page = await client.getErrorPage(ErrorPage.NotFound, {
    site: scConfig.defaultSite,
    locale: scConfig.defaultLanguage,
  });

  if (!page) return <FallbackNotFound />;
  // not-found.tsx cannot export generateMetadata; React 19 hoists this <title> into <head>.
  const title = (page.layout.sitecore.route?.fields?.Title as { value?: string } | undefined)?.value;

  return (
    <>
      {title && <title>{title}</title>}
      <Providers page={page}>
        <Layout page={page} />
      </Providers>
    </>
  );
}
