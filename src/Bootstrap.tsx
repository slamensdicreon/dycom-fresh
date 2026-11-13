'use client';
import { useEffect, JSX } from 'react';
import { initContentSdk } from '@sitecore-content-sdk/nextjs';
import { eventsPlugin } from '@sitecore-content-sdk/events';
import { analyticsBrowserAdapter, analyticsPlugin } from '@sitecore-content-sdk/analytics-core';
import config from 'sitecore.config';

/**
 * Initialises the browser Events / Analytics SDK once Sitecore is connected.
 * Without a client Edge context id (local content mode) it does nothing.
 */
const Bootstrap = ({ siteName, isPreviewMode }: { siteName: string; isPreviewMode: boolean }): JSX.Element | null => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' || isPreviewMode) return;
    if (!config.api.edge?.clientContextId) return;

    initContentSdk({
      config: {
        contextId: config.api.edge.clientContextId,
        edgeUrl: config.api.edge.edgeUrl,
        siteName: siteName || config.defaultSite,
      },
      plugins: [
        analyticsPlugin({
          options: { enableCookie: true, cookieDomain: window.location.hostname.replace(/^www\./, '') },
          adapter: analyticsBrowserAdapter(),
        }),
        eventsPlugin(),
      ],
    });
  }, [siteName, isPreviewMode]);

  return null;
};

export default Bootstrap;
