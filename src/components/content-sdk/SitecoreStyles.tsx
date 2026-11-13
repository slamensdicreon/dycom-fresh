import type { HTMLLink, LayoutServiceData } from '@sitecore-content-sdk/nextjs';
import client from 'lib/sitecore-client';

/**
 * `<link>` elements for Sitecore-hosted styles (Pages content styles, Design Library themes).
 * A server component here — the starter marks it 'use client', which would ship the server client
 * (and the local content bundle) to the browser.
 */
const SitecoreStyles = ({ layoutData }: { layoutData: LayoutServiceData }) => {
  const headLinks = client.getHeadLinks(layoutData, {});
  if (headLinks.length === 0) return null;
  return (
    <>
      {headLinks.map(({ rel, href }: HTMLLink) => (
        <link rel={rel} key={href} href={href} />
      ))}
    </>
  );
};

export default SitecoreStyles;
