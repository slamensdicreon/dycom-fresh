import type { ReactNode } from 'react';

/** Square 50px icon control (play/pause, close, menu). Always carries an accessible label. */
export function IconButton({ className = '', label, pressed, onClick, children, ...rest }: {
  className?: string;
  label: string;
  pressed?: boolean;
  onClick: () => void;
  children: ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'>) {
  return (
    <button type="button" className={`dy-icon-button ${className}`} aria-label={label} aria-pressed={pressed} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
