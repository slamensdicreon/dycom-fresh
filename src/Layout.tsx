import { JSX } from 'react';
import { AppPlaceholder, DesignLibraryApp, Field, PageMetadataFields, Page } from '@sitecore-content-sdk/nextjs';
import SitecoreHead from 'src/SitecoreHead';
import componentMap from '.sitecore/component-map';

interface LayoutProps {
  page: Page;
}

export interface RouteFields extends PageMetadataFields {
  [key: string]: unknown;
  Title?: Field;
}

/**
 * Page shell. The three placeholders match Sitecore's headless SXA convention:
 * `headless-header` and `headless-footer` are filled by partial designs (site header, footer,
 * roles drawer); `headless-main` holds the page's own renderings.
 */
const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;

  if (mode.isDesignLibrary) {
    return (
      <>
        <SitecoreHead page={page} />
        {route && (
          <DesignLibraryApp
            page={page}
            rendering={route}
            componentMap={componentMap}
            loadServerImportMap={() => import('.sitecore/import-map.server')}
          />
        )}
      </>
    );
  }

  return (
    <>
      <SitecoreHead page={page} />
      <a className="dy-skip" href="#content">Skip to content</a>
      <div className={`dy-page ${mode.isEditing ? 'editing-mode' : 'prod-mode'}`}>
        {route && (
          <>
            <AppPlaceholder page={page} componentMap={componentMap} name="headless-header" rendering={route} />
            <main id="content" tabIndex={-1}>
              <AppPlaceholder page={page} componentMap={componentMap} name="headless-main" rendering={route} />
            </main>
            <AppPlaceholder page={page} componentMap={componentMap} name="headless-footer" rendering={route} />
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
