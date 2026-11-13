import 'server-only';
import { SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
import scConfig, { LOCAL_CONTENT_MODE } from 'sitecore.config';
import { LocalSitecoreClient } from './local-content/local-sitecore-client';

/**
 * The one Sitecore client for the app (Content SDK convention: never instantiate another).
 *
 * - Connected (Edge context id or CM host + key in the environment): the SDK's own
 *   `SitecoreClient`, exactly as in Sitecore's starter.
 * - Local content mode (today): `LocalSitecoreClient` serves the same `Page` shapes from `content/`.
 *
 * Pages and components call the same methods either way and cannot tell which one is running.
 */
const client = (LOCAL_CONTENT_MODE ? new LocalSitecoreClient(scConfig) : new SitecoreClient({ ...scConfig })) as SitecoreClient;

export default client;
