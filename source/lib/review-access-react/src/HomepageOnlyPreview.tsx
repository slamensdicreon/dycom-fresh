import { type ReactNode, useEffect } from "react";
import { isUnapprovedPreviewDestination, NO_APPROVED_PATHS } from "./preview-policy";

/**
 * Keep a navigation prototype visible without exposing unscoped destinations.
 * Homepage anchors and official external resources remain usable. This also
 * covers menus rendered into portals and links mounted after the initial load.
 * Routing must separately exclude internal page components.
 */
export function HomepageOnlyPreview({
  basePath,
  allowedPaths = NO_APPROVED_PATHS,
  children,
}: {
  basePath: string;
  allowedPaths?: readonly string[];
  children: ReactNode;
}) {
  useEffect(() => {
    const isInternalPage = (href: string) =>
      isUnapprovedPreviewDestination(href, window.location.href, basePath, allowedPaths);
    const disableDestinations = () => {
      document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;
        if (!isInternalPage(href)) {
          // A reused DOM node may now point to an approved destination.
          if (link.dataset.previewDestination) {
            delete link.dataset.previewDestination;
            link.removeAttribute("aria-disabled");
            link.removeAttribute("role");
            link.removeAttribute("tabindex");
            link.removeAttribute("title");
          }
          return;
        }
        link.dataset.previewDestination = href;
        link.removeAttribute("href");
        link.setAttribute("role", "link");
        link.setAttribute("tabindex", "0");
        link.setAttribute("aria-disabled", "true");
        link.title = "This page is currently unavailable.";
      });
    };
    const preventNavigation = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && !["Enter", " "].includes(event.key)) return;
      const link = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a")
        : null;
      if (!link || !(link.dataset.previewDestination || (link.href && isInternalPage(link.href)))) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    disableDestinations();
    const observer = new MutationObserver(disableDestinations);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
    document.addEventListener("click", preventNavigation, true);
    document.addEventListener("auxclick", preventNavigation, true);
    document.addEventListener("keydown", preventNavigation, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", preventNavigation, true);
      document.removeEventListener("auxclick", preventNavigation, true);
      document.removeEventListener("keydown", preventNavigation, true);
    };
  }, [basePath, allowedPaths]);

  return <>{children}</>;
}
