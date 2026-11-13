import { useEffect, useRef, useState, type RefObject } from 'react';

/** Reduced-motion preference with a manual override from the footer toggle; drives `data-motion` on `main.dycom-c5`. */
export function useMotionPreference() {
  const [motionOff, setMotionOff] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionOff(preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);
  return [motionOff, setMotionOff] as const;
}

/**
 * Scroll parallax for a photo band. Writes `--c5-parallax` (px) on the band while it is on
 * screen; the band's image is oversized by `2 * depth` of the band height and translated by at
 * most `depth` of it, so it never shows an edge. Honours the footer motion toggle and
 * prefers-reduced-motion by holding the image still.
 */
export function useParallax<T extends HTMLElement>(depth = 0.15): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    let visible = false;
    const still = () => el.closest<HTMLElement>('[data-motion]')?.dataset.motion === 'off';
    const paint = () => {
      frame = 0;
      if (still()) { el.style.setProperty('--c5-parallax', '0px'); return; }
      const rect = el.getBoundingClientRect();
      const half = window.innerHeight / 2;
      const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - half) / (half + rect.height / 2)));
      el.style.setProperty('--c5-parallax', `${(-progress * depth * rect.height).toFixed(1)}px`);
    };
    const schedule = () => { if (visible && !frame) frame = requestAnimationFrame(paint); };
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); }, { rootMargin: '10% 0px' });
    io.observe(el);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const motion = new MutationObserver(schedule);
    const root = el.closest('[data-motion]');
    if (root) motion.observe(root, { attributes: true, attributeFilter: ['data-motion'] });
    return () => { io.disconnect(); motion.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); if (frame) cancelAnimationFrame(frame); };
  }, [depth]);
  return ref;
}
