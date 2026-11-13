import { JSX } from 'react';
import { Page, JsonLdSchema } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'components/content-sdk/SitecoreStyles';

/** Scripts, Sitecore-managed styles and structured data injected alongside the layout. */
const SitecoreHead = ({ page }: { page: Page }): JSX.Element => (
  <>
    <Scripts />
    <SitecoreStyles layoutData={page.layout} />
    <JsonLdSchema page={page} />
  </>
);

export default SitecoreHead;
