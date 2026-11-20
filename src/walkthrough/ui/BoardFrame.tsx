'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * A design board — a canvas board rendered as a real page, or a live site page — shown at its
 * true width (1440 desktop, 390 phone) and scaled to fit the column. In "window" mode the board
 * scrolls inside a fixed-height frame (for slides); in "full" mode the frame grows to the whole
 * page. A transparent shield over the iframe keeps scrolling with the frame and stops clicks.
 */
export function BoardFrame({
  src,
  width,
  height,
  title,
  mode = 'window',
  windowHeight,
  eager = false,
}: {
  src: string;
  width: 1440 | 390;
  height?: number;
  title: string;
  mode?: 'window' | 'full';
  windowHeight?: string;
  eager?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  const [measured, setMeasured] = useState<number | undefined>(height);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBoxWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Live site pages have no precomputed height: measure once loaded (same origin).
  const onLoad = () => {
    setLoaded(true);
    if (height) return;
    try {
      const doc = frame.current?.contentDocument;
      if (doc) setMeasured(Math.ceil(doc.documentElement.scrollHeight));
      window.setTimeout(() => {
        const d = frame.current?.contentDocument;
        if (d) setMeasured(Math.ceil(d.documentElement.scrollHeight));
      }, 1200);
    } catch {
      /* cross-origin: keep the fallback height */
    }
  };

  const h = measured ?? 6000;
  const scale = boxWidth ? Math.min(1, boxWidth / width) : 0;
  const scaledW = width * scale;
  const scaledH = h * scale;

  return (
    <div className={`wt-board wt-board--${width === 390 ? 'phone' : 'desk'}`} data-loaded={loaded || undefined}>
      <div
        ref={box}
        className="wt-board-window"
        style={{ height: mode === 'window' ? windowHeight ?? '60vh' : scaledH || undefined }}
        tabIndex={0}
        aria-label={`${title}, ${width === 390 ? 'phone' : 'desktop'} view. Scroll to see the whole page.`}
      >
        {scale > 0 && (
          <div className="wt-board-stage" style={{ width: scaledW, height: scaledH }}>
            <iframe
              ref={frame}
              src={src}
              title={title}
              width={width}
              height={h}
              loading={eager ? 'eager' : 'lazy'}
              onLoad={onLoad}
              style={{ width, height: h, transform: `scale(${scale})` }}
              tabIndex={-1}
            />
            <div className="wt-board-shield" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
