// The framed stage: shows an example (or a whole site page) in a frame at a
// real viewport width, so the site's own breakpoints apply exactly, and scales
// the frame down when the page column is narrower than that width. One
// Desktop / Tablet / Phone choice applies to every framed stage on the page.
import { useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ExampleContext } from './context';
import { dsHref, examplePath, type ExampleId } from '../router';
import { FIXED_HEIGHTS, FRAME_HEIGHT_MESSAGE, FRAME_MOTION_MESSAGE, PRESETS, isPresetId, type PresetId } from './frames';

// Page-level viewport choice. `null` means "whatever fits": desktop in a wide
// column, phone in a narrow one. Remembered for the session once chosen.
const STORAGE_KEY = 'dycom-ds:preset';
let chosen: PresetId | null = (() => {
  try { const v = window.sessionStorage.getItem(STORAGE_KEY); return isPresetId(v) ? v : null; } catch { return null; }
})();
const listeners = new Set<() => void>();
const presetStore = {
  subscribe: (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; },
  get: () => chosen,
  set: (id: PresetId) => {
    chosen = id;
    try { window.sessionStorage.setItem(STORAGE_KEY, id); } catch { /* private mode */ }
    listeners.forEach((fn) => fn());
  },
};

const fits = (available: number): PresetId => (available >= 900 ? 'desktop' : available >= 600 ? 'tablet' : 'phone');

const AUTO_HEIGHT = 320; // until the frame reports

export type FramedProps = {
  label: string;
  note?: string;
  /** A registered example… */
  example?: ExampleId;
  /** …or any same-site address (the Investors template embeds the real page). */
  src?: string;
  params?: Record<string, string>;
  /** Fixed heights for a `src` frame; `example` frames read theirs from the registry. */
  fixed?: Record<PresetId, number>;
};

export function Framed({ label, note, example, src, params, fixed }: FramedProps) {
  const { motionOff } = useContext(ExampleContext);
  const preference = useSyncExternalStore(presetStore.subscribe, presetStore.get, () => null);
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [available, setAvailable] = useState(0);
  const [reported, setReported] = useState<number | null>(null);

  const preset = preference ?? fits(available || 1440);
  const width = PRESETS.find((p) => p.id === preset)!.width;
  const fixedHeights = example ? FIXED_HEIGHTS[example] : fixed;
  const height = fixedHeights ? fixedHeights[preset] : reported ?? AUTO_HEIGHT;
  const scale = available > 0 ? Math.min(1, available / width) : 1;

  // The column's width decides the scale (and the default preset).
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setAvailable(el.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-sized frames report their content height.
  useEffect(() => {
    if (fixedHeights) return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      const data: unknown = event.data;
      if (typeof data === 'object' && data !== null && (data as { type?: unknown }).type === FRAME_HEIGHT_MESSAGE) {
        const h = Number((data as { height?: unknown }).height);
        if (Number.isFinite(h) && h > 0) setReported(Math.max(40, h));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [fixedHeights]);

  // Motion follows the system's control.
  useEffect(() => {
    frame.current?.contentWindow?.postMessage({ type: FRAME_MOTION_MESSAGE, off: motionOff }, window.location.origin);
  }, [motionOff]);

  const url = (() => {
    const base = example ? dsHref(examplePath(example)) : src!;
    const search = new URLSearchParams(params);
    if (example && motionOff) search.set('motion', 'off');
    const query = search.toString();
    return query ? `${base}${base.includes('?') ? '&' : '?'}${query}` : base;
  })();
  const ready = !!fixedHeights || reported !== null;

  return (
    <figure className="dycom-ds__stage dycom-ds__stage--framed">
      <figcaption className="dycom-ds__stage-bar">
        <strong>{label}</strong>
        <span className="dycom-ds__viewports" role="group" aria-label="Example viewport">
          {PRESETS.map((p) => (
            <button key={p.id} type="button" aria-pressed={preset === p.id} onClick={() => presetStore.set(p.id)}>{p.label}<small>{p.width}</small></button>
          ))}
          <span className="dycom-ds__viewport-note">{scale < 0.995 ? `shown at ${Math.round(scale * 100)}%` : 'actual size'}</span>
        </span>
      </figcaption>
      <div ref={wrap} className="dycom-ds__frame-wrap" data-preset={preset}>
        <div className="dycom-ds__frame-box" style={{ width: Math.round(width * scale), height: Math.round(height * scale) }}>
          <iframe
            ref={frame}
            className="dycom-ds__frame"
            title={`${label} at ${width}px`}
            src={url}
            width={width}
            height={height}
            scrolling={fixedHeights ? 'yes' : 'no'}
            data-preset={preset}
            data-ready={ready ? 'true' : 'false'}
            style={{ width, height, transform: `scale(${scale})` }}
            onLoad={() => { frame.current?.contentWindow?.postMessage({ type: FRAME_MOTION_MESSAGE, off: motionOff }, window.location.origin); }}
          />
        </div>
      </div>
      {note && <div className="dycom-ds__stage-note">{note}</div>}
    </figure>
  );
}
