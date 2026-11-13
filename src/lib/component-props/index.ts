import { ComponentParams, ComponentRendering, Page } from '@sitecore-content-sdk/nextjs';

/**
 * Shared props every Sitecore rendering receives from the Placeholder.
 * Identical to the Content SDK starter so components port to a connected app unchanged.
 */
export type ComponentProps = {
  rendering: ComponentRendering;
  params: ComponentParams & {
    /** The identifier for the rendering (set in the rendering parameters in Sitecore). */
    RenderingIdentifier?: string;
    /** Styles calculated by the Placeholder component. */
    styles?: string;
    /** Rendering variant chosen in Pages; selects a named export of the component module. */
    FieldNames?: string;
    EnabledPlaceholders?: string;
  };
};

/** Component props with page context (`withSitecore()` / `useSitecore()`). */
export type ComponentWithContextProps = ComponentProps & {
  page: Page;
};
