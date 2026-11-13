'use client';
import { useEffect, useRef, type RefObject } from 'react';

/**
 * Scroll parallax for a photo band. Writes `--dy-parallax` (px) on the band while it is on screen;
 * the band's image is oversized in CSS (`.dy-parallax > img`) so it never shows an edge. Holds the
 * image still when the site's Motion control is off or the visitor prefers reduced motion.
 */
export function useParallax<T extends HTMLElement>(depth = 0.15): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    let visible = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const still = () => reduce.matches || el.closest<HTMLElement>('[data-motion]')?.dataset.motion === 'off';
    const paint = () => {
      frame = 0;
      if (still()) {
        el.style.setProperty('--dy-parallax', '0px');
        return;
      }
      const rect = el.getBoundingClientRect();
      const half = window.innerHeight / 2;
      const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - half) / (half + rect.height / 2)));
      el.style.setProperty('--dy-parallax', `${(-progress * depth * rect.height).toFixed(1)}px`);
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(paint);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      },
      { rootMargin: '10% 0px' }
    );
    io.observe(el);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const motion = new MutationObserver(schedule);
    const root = el.closest('[data-motion]');
    if (root) motion.observe(root, { attributes: true, attributeFilter: ['data-motion'] });
    return () => {
      io.disconnect();
      motion.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [depth]);
  return ref;
}
