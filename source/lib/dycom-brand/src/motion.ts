import { useEffect, useState } from 'react';

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
