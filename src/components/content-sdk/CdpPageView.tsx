'use client';
import { CdpHelper, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useEffect, JSX } from 'react';
import { pageView } from '@sitecore-content-sdk/events';
import config from 'sitecore.config';

/**
 * Sends a CDP page-view event once Sitecore is connected.
 * TODO(consent): gate on the consent tool Dycom chooses (requirement CC-4 / NAV0007).
 */
const CdpPageView = (): JSX.Element => {
  const {
    page: { layout, siteName, mode },
  } = useSitecore();
  const { route, context } = layout.sitecore;

  useEffect(() => {
    if (!mode.isNormal || !route?.itemId) return;
    if (process.env.NODE_ENV === 'development' || !config.api.edge?.clientContextId) return;

    const language = route.itemLanguage || config.defaultLanguage;
    const pageVariantId = CdpHelper.getPageVariantId(route.itemId, language, context.variantId as string, config.personalize?.scope);
    pageView({ channel: 'WEB', currency: 'USD', page: route.name, pageVariantId, language }).catch((e) => console.debug(e));
  }, [mode, route, context.variantId, siteName]);

  return <></>;
};

export default CdpPageView;
