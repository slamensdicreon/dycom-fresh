import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { notFound } from 'next/navigation';
import { draftMode, headers as nextHeaders } from 'next/headers';
import { Metadata } from 'next';
import { getPageMetadata, SiteInfo } from '@sitecore-content-sdk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import sites from '.sitecore/sites.json';
import client from 'lib/sitecore-client';
import { routing } from 'src/i18n/routing';
import Layout from 'src/Layout';
import Providers from 'src/Providers';

type PageProps = {
  params: Promise<{ site: string; locale: string; path?: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { site, locale, path } = await params;

  // Make site and locale available to src/i18n/request.ts for the dictionary.
  setRequestLocale(`${site}_${locale}`);

  const draft = await draftMode();

  let page;
  if (draft.isEnabled) {
    const previewData = client.getPreviewData(await nextHeaders());
    page = isDesignLibraryPreviewData(previewData)
      ? await client.getDesignLibraryData(previewData)
      : await client.getPreview(previewData);
  } else {
    page = await client.getPage(path ?? [], { site, locale });
  }

  if (!page) notFound();

  return (
    <NextIntlClientProvider>
      <Providers page={page}>
        <Layout page={page} />
      </Providers>
    </NextIntlClientProvider>
  );
}

// Pre-render every route the content source knows about.
export const generateStaticParams = async () =>
  client.getAppRouterStaticParams(
    sites.map((s: SiteInfo) => s.name),
    routing.locales.slice()
  );

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { path, site, locale } = await params;
  const page = await client.getPage(path ?? [], { site, locale });
  return getPageMetadata(page?.layout.sitecore.route);
};
