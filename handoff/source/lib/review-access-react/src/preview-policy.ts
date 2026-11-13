export const NO_APPROVED_PATHS: readonly string[] = [];

/** Exact, base-relative destinations only; never a prefix allowlist. */
export function isUnapprovedPreviewDestination(
  href: string,
  currentUrl: string,
  basePath: string,
  allowedPaths: readonly string[] = NO_APPROVED_PATHS,
) {
  const current = new URL(currentUrl);
  const url = new URL(href, current);
  const root = `${basePath.replace(/\/$/, "")}/`;
  if (url.origin !== current.origin || !url.pathname.startsWith(root) || url.pathname === root) return false;
  return !allowedPaths.some((path) => {
    if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)*\/?$/.test(path)) return false;
    const destination = `${root}${path.replace(/\/$/, "")}`;
    return url.pathname === destination || url.pathname === `${destination}/`;
  });
}
