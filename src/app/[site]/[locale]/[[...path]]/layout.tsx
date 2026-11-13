import { setCachedPageParams } from '@sitecore-content-sdk/nextjs';

export default async function SiteLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string; locale: string }>;
}) {
  const { site, locale } = await params;
  // Lets not-found.tsx resolve the right site and locale without opting out of static rendering.
  setCachedPageParams({ locale, site });
  return <>{children}</>;
}
