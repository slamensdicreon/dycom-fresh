'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

/**
 * Square modal built on the native <dialog>: showModal() gives the focus trap and inert page;
 * focus returns to the opener on close. Drawers slide in from the right; `variant="nav"` sizes the
 * head to the site header. Closing waits for the exit animation unless motion is off.
 */
export function Modal({
  open,
  onClose,
  title,
  heading,
  id,
  children,
  drawer = false,
  variant,
}: {
  open: boolean;
  onClose: () => void;
  /** Names the dialog and its close control. */
  title: string;
  /** Replaces the visible title (e.g. the logo in the phone menu). */
  heading?: ReactNode;
  id: string;
  children: ReactNode;
  drawer?: boolean;
  variant?: 'nav';
}) {
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
      return () => {
        document.body.style.overflow = previous;
      };
    }
    if (!dialog.open) return;
    setPhase('closing');
    const reduce =
      dialog.closest('[data-motion="off"]') !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      className={`dy-dialog${drawer ? ' dy-dialog--drawer' : ''}${variant ? ` dy-dialog--${variant}` : ''}`}
      data-phase={phase}
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        closeRef.current();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeRef.current();
      }}
    >
      {phase !== 'closed' && (
        <>
          <div className="dy-dialog-head">
            <h2 id={id} className={heading ? 'dy-dialog-brand' : undefined}>
              {heading ?? title}
            </h2>
            <IconButton label={`Close ${title}`} onClick={onClose}>
              <X size={22} />
            </IconButton>
          </div>
          {children}
        </>
      )}
    </dialog>
  );
}
