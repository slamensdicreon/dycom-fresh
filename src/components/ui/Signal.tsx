/** Dycom signal mark: two stepped quarter-arcs — the brand's one permitted curve. Decorative only; never an arrow. */
export function Signal({ className = '' }: { className?: string }) {
  return (
    <svg className={`dy-signal ${className}`} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M0 0 H100 V100 H89 A89 89 0 0 0 0 11 Z" />
      <path d="M0 50 H50 V100 H39 A39 39 0 0 0 0 61 Z" />
    </svg>
  );
}
