import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Every authored link and the future-state sitemap use trailing slashes (/investors/), as the
  // current dycomind.com does; serve them directly instead of redirecting.
  trailingSlash: true,
  images: {
    // Experience Edge media hosts, for when Sitecore is connected (same as Sitecore's starter).
    remotePatterns: [
      { protocol: 'https', hostname: 'edge*.**', port: '' },
      { protocol: 'https', hostname: 'xmc-*.**', port: '' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // sitemap.xml, robots.txt and llms.txt are served by route handlers (requirement RES0003).
  rewrites: async () => [
    { source: '/sitemap:id([\\w-]{0,}).xml', destination: '/api/sitemap', locale: false },
    { source: '/robots.txt', destination: '/api/robots', locale: false },
    { source: '/llms.txt', destination: '/api/llms-txt', locale: false },
  ],
};

export default createNextIntlPlugin()(nextConfig);
