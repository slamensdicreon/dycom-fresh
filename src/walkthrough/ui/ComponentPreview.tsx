'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * One component on its own: loads the page it lives on (same origin) and crops the frame to the
 * element, scaled to the column. Boards are laid out at full height and the element is cut out;
 * live pages keep a normal viewport (their heroes are sized to it) and scroll to the element.
 */
export function ComponentPreview({
  src,
  selector,
  nth = 0,
  width,
  live = false,
  open,
  title,
}: {
  src: string;
  selector: string;
  nth?: number;
  width: 1440 | 390;
  live?: boolean;
  open?: string;
  title: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  const [docHeight, setDocHeight] = useState(live ? (width === 390 ? 844 : 900) : 6000);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBoxWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function measure() {
    const doc = frame.current?.contentDocument;
    const win = frame.current?.contentWindow;
    if (!doc || !win) return;
    if (live) {
      // The site header and results bar stick to the top; keep them out of the crop.
      if (!doc.getElementById('wt-preview-style')) {
        const style = doc.createElement('style');
        style.id = 'wt-preview-style';
        style.textContent = 'html{scroll-behavior:auto!important}.dy-header,.dy-results-bar{position:relative!important}';
        doc.head.appendChild(style);
      }
    } else {
      setDocHeight(Math.ceil(doc.documentElement.scrollHeight));
    }
    const el = doc.querySelectorAll(selector)[nth] as HTMLElement | undefined;
    if (!el) {
      setMissing(true);
      return;
    }
    const r = el.getBoundingClientRect();
    if (live && !open) {
      win.scrollTo(0, r.top + win.scrollY);
      const after = el.getBoundingClientRect();
      setRect({ top: after.top, left: after.left, width: after.width, height: Math.min(after.height, docHeight) });
    } else {
      setRect({ top: r.top + (live ? 0 : win.scrollY), left: r.left, width: r.width, height: r.height });
    }
  }

  function onLoad() {
    const doc = frame.current?.contentDocument;
    if (open && doc) {
      const trigger = doc.querySelector(open) as HTMLElement | null;
      let tries = 0;
      const tryOpen = () => {
        const t = (doc.querySelector(open) as HTMLElement | null) ?? trigger;
        if (t) t.click();
        window.setTimeout(() => {
          if (!doc.querySelector(selector) && tries++ < 10) tryOpen();
          else measure();
        }, 500);
      };
      window.setTimeout(tryOpen, 600);
      return;
    }
    // Let fonts and images settle, then measure (and once more after late layout).
    window.setTimeout(measure, 300);
    window.setTimeout(measure, 1400);
  }

  const scale = boxWidth ? Math.min(1, boxWidth / width) : 0;
  const cropH = rect ? Math.ceil(rect.height * scale) : 0;
  // Narrow components are cut out horizontally too, so only the component shows.
  const cropW = rect ? Math.ceil(Math.min(rect.width, width) * scale) : width * scale;
  const left = rect ? Math.max(0, rect.left) : 0;

  return (
    <div className={`wt-preview wt-preview--${width === 390 ? 'phone' : 'desk'}`}>
      <div ref={box} className="wt-preview-box" style={{ height: rect ? cropH : 240 }} data-ready={rect ? true : undefined}>
        {scale > 0 && (
          <div className="wt-preview-crop" style={{ width: cropW, height: rect ? cropH : 240 }}>
            <iframe
              ref={frame}
              src={src}
              title={title}
              width={width}
              height={docHeight}
              onLoad={onLoad}
              tabIndex={-1}
              style={{
                width,
                height: docHeight,
                transform: `translate(${-left * scale}px, ${rect ? -rect.top * scale : 0}px) scale(${scale})`,
                opacity: rect ? 1 : 0,
              }}
            />
            <div className="wt-board-shield" aria-hidden="true" />
          </div>
        )}
        {!rect && !missing && <p className="wt-preview-loading">Loading the component…</p>}
        {missing && <p className="wt-preview-loading">This component could not be found on its source page.</p>}
      </div>
    </div>
  );
}
