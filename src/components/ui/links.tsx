'use client';
import type { ReactNode } from 'react';
import { Link as ScLink, type LinkField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

/**
 * Link rules (brief §6): `→` for in-page jumps and pages of this site, `↗` only when leaving the
 * site (operating-company websites), no arrows in navigation or footer lists.
 */
export const isExternalLink = (field?: LinkField) =>
  field?.value?.linktype === 'external' || /^https?:/.test(field?.value?.href ?? '');

type LinkProps = {
  field: LinkField;
  className?: string;
  /** Show `→` for site pages and anchors. Off for navigation and footer lists. */
  arrow?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  children?: ReactNode;
};

/**
 * Sitecore General Link rendered with the brand's arrow semantics. Uses the SDK `Link`, so the
 * field stays editable in Sitecore Pages; children replace the field text when given.
 */
export function SiteLink({ field, className, arrow = true, onClick, children }: LinkProps) {
  const { page } = useSitecore();
  const external = isExternalLink(field);
  const editing = page.mode.isEditing;
  if (!field?.value?.href && !editing) return null;
  return (
    <ScLink
      field={external ? { ...field, value: { ...field.value, target: '_blank' } } : field}
      className={className}
      onClick={onClick}
      showLinkTextWithChildrenPresent={!children}
      {...(external ? { rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external && <ArrowUpRight size={17} aria-label="opens in a new tab" />}
      {!external && arrow && <ArrowRight size={17} aria-hidden="true" />}
    </ScLink>
  );
}

type Variant = 'filled' | 'outline' | 'inverse';
const buttonClass = (variant: Variant, extra = '') =>
  `dy-button${variant === 'outline' ? ' dy-button--outline' : variant === 'inverse' ? ' dy-button--inverse' : ''}${extra ? ` ${extra}` : ''}`;

/** The one square button, as a link (Civic fill, outline or inverse; 48–52px tall). */
export function ButtonLink({ field, variant = 'filled', className, onClick, children }: Omit<LinkProps, 'arrow'> & { variant?: Variant }) {
  return (
    <SiteLink field={field} className={buttonClass(variant, className)} onClick={onClick}>
      {children}
    </SiteLink>
  );
}

/** The one square button, as an action that stays on the page (opens the roles drawer, sends a form…). */
export function ActionButton({
  children,
  variant = 'filled',
  onClick,
  type = 'button',
  className,
  arrow = true,
}: {
  children: ReactNode;
  variant?: Variant;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  arrow?: boolean;
}) {
  return (
    <button type={type} className={buttonClass(variant, className)} onClick={onClick}>
      {children}
      {arrow && <ArrowRight size={17} aria-hidden="true" />}
    </button>
  );
}

/** Rendering-variant / datasource-free href helper for code-owned links (e.g. route of a sitemap page). */
export const linkField = (href: string, text = ''): LinkField => ({
  value: {
    href,
    text,
    linktype: href.startsWith('#') ? 'anchor' : /^https?:/.test(href) ? 'external' : 'internal',
  },
});
