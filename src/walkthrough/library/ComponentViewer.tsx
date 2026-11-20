'use client';
import { useState } from 'react';
import { previewSrc, type Preview } from '../component-previews';
import { ComponentPreview } from '../ui/ComponentPreview';

/** The component on its own, at desktop or phone width. */
export function ComponentViewer({ name, preview }: { name: string; preview: Preview }) {
  const [width, setWidth] = useState<1440 | 390>(1440);
  const src = previewSrc(preview);
  return (
    <div className="wt-viewer">
      <div className="wt-viewer-bar">
        <p className="wt-small">
          {preview.firstPass && <span className="wt-status" data-status="New" style={{ marginRight: 10 }}>First design, for review</span>}
          {preview.caption ?? (preview.firstPass ? 'Not yet on a template — a first design of how it would look.' : 'Shown as designed, cut from the page it lives on.')}
        </p>
        {preview.phone && (
          <div className="wt-toggle" role="group" aria-label="Width">
            <button type="button" aria-pressed={width === 1440} onClick={() => setWidth(1440)}>
              Desktop
            </button>
            <button type="button" aria-pressed={width === 390} onClick={() => setWidth(390)}>
              Phone
            </button>
          </div>
        )}
      </div>
      <div className={width === 390 ? 'wt-preview-phone-col' : undefined}>
        <ComponentPreview
          key={width}
          src={src}
          selector={preview.selector}
          nth={preview.nth}
          width={width}
          live={preview.live}
          open={preview.open}
          title={`${name}, ${width === 390 ? 'phone' : 'desktop'}`}
        />
      </div>
    </div>
  );
}
