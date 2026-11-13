import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';

/** Dycom signal mark: two stepped quarter-arcs. Square by construction (BR-S1). */
export function Signal({ className = '' }: { className?: string }) {
  return (
    <svg className={`dycom-c5__signal ${className}`} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      <path d="M0 0 H100 V100 H89 A89 89 0 0 0 0 11 Z" />
      <path d="M0 50 H50 V100 H39 A39 39 0 0 0 0 61 Z" />
    </svg>
  );
}

export const isExternal = (href: string) => href.startsWith('http');

/** Site pages (not in-page anchors) carry → ; the only external destinations left are operating-company websites, which open in a new tab with ↗ (open decision D2). */
export const isSitePage = (href: string) => !isExternal(href) && !href.startsWith('#');

/** `arrow={false}` is for navigation and footer lists, where every item is a site page and arrows would be noise (BR-B4). */
export function SiteLink({ href, children, className = '', onClick, arrow = true }: { href: string; children: ReactNode; className?: string; onClick?: () => void; arrow?: boolean }) {
  const external = isExternal(href);
  return (
    <a href={href} className={className} onClick={onClick} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
      {external && <ArrowUpRight size={17} aria-label="opens in a new tab" />}
      {arrow && isSitePage(href) && <ArrowRight size={17} aria-hidden="true" />}
    </a>
  );
}

export function Action({ href, children, inverse = false, outline = false, onClick }: { href?: string; children: ReactNode; inverse?: boolean; outline?: boolean; onClick?: () => void }) {
  const className = `dycom-c5__button${inverse ? ' dycom-c5__button--inverse' : ''}${outline ? ' dycom-c5__button--outline' : ''}`;
  if (href) {
    return (
      <SiteLink href={href} className={className} onClick={onClick}>
        {children}
        {href.startsWith('#') && <ArrowRight size={17} aria-hidden="true" />}
      </SiteLink>
    );
  }
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
      <ArrowRight size={17} aria-hidden="true" />
    </button>
  );
}

export function IconButton({ className = '', label, pressed, onClick, children }: { className?: string; label: string; pressed?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={`dycom-c5__icon-button ${className}`} aria-label={label} aria-pressed={pressed} onClick={onClick}>
      {children}
    </button>
  );
}

/** Native, in-tree modal: preserves brand inheritance, traps and restores focus. */
/**
 * `heading` replaces the visible title (e.g. the brand logo in the mobile menu); `title` still names the close control.
 * `variant="nav"` sizes the head to match the site header. Closing is deferred by one exit animation (BR-B5) unless motion is off.
 */
export function Modal({ open, onClose, title, heading, id, children, drawer = false, variant }: { open: boolean; onClose: () => void; title: string; heading?: ReactNode; id: string; children: ReactNode; drawer?: boolean; variant?: 'nav' }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const openerRef = useRef<HTMLElement | SVGElement | null>(null);
  const [phase, setPhase] = useState<'open' | 'closing' | 'closed'>(open ? 'open' : 'closed');
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      setPhase('open');
      openerRef.current = document.activeElement as HTMLElement | SVGElement | null;
      const previous = document.body.style.overflow;
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = previous; };
    }
    if (!dialog.open) return;
    setPhase('closing');
    const reduce = dialog.closest('[data-motion="off"]') !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => {
      dialog.close();
      setPhase('closed');
      const opener = openerRef.current;
      if (opener?.isConnected) opener.focus();
    };
    const timer = window.setTimeout(finish, reduce ? 0 : 280);
    return () => window.clearTimeout(timer);
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`dycom-c5__dialog${drawer ? ' dycom-c5__dialog--drawer' : ''}${variant ? ` dycom-c5__dialog--${variant}` : ''}`}
      data-phase={phase}
      aria-labelledby={id}
      onCancel={(e) => { e.preventDefault(); closeRef.current(); }}
      onClick={(e) => { if (e.target === e.currentTarget) closeRef.current(); }}
    >
      {phase !== 'closed' && (
        <>
          <div className="dycom-c5__dialog-head">
            <h2 id={id} className={heading ? 'dycom-c5__dialog-brand' : undefined}>{heading ?? title}</h2>
            <IconButton label={`Close ${title}`} onClick={onClose}><X size={22} /></IconButton>
          </div>
          {children}
        </>
      )}
    </dialog>
  );
}
