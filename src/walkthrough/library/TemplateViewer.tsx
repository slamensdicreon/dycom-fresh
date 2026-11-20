'use client';
import { useState } from 'react';
import { boardHeight, boardSrc, type View } from '../data';
import { BoardFrame } from '../ui/BoardFrame';

type Mode = 'both' | 'desktop' | 'phone';

/** Every design for one template: a tab per board (page, states, variants), desktop and phone. */
export function TemplateViewer({ code, name, views }: { code: string; name: string; views: View[] }) {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<Mode>('both');
  const [full, setFull] = useState(false);
  const view = views[active];
  const src = view.live ?? boardSrc(view.board!);
  const showDesk = mode !== 'phone' || !view.phone;
  const showPhone = view.phone && mode !== 'desktop';
  const frameMode = full ? 'full' : 'window';

  return (
    <div className="wt-viewer">
      {views.length > 1 && (
        <div className="wt-tabs" role="tablist" aria-label={`${code} designs`}>
          {views.map((v, i) => (
            <button
              key={v.title}
              type="button"
              role="tab"
              className="wt-tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
            >
              {v.title}
            </button>
          ))}
        </div>
      )}
      <div className="wt-viewer-bar">
        <p className="wt-small">
          {view.live ? 'The live page on the site.' : 'The design board as a real page.'} Scroll inside the frame to read it.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {view.phone && (
            <div className="wt-toggle" role="group" aria-label="Width">
              {(['both', 'desktop', 'phone'] as Mode[]).map((m) => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
                  {m === 'both' ? 'Desktop + phone' : m === 'desktop' ? 'Desktop' : 'Phone'}
                </button>
              ))}
            </div>
          )}
          <div className="wt-toggle" role="group" aria-label="Frame">
            <button type="button" aria-pressed={!full} onClick={() => setFull(false)}>
              Window
            </button>
            <button type="button" aria-pressed={full} onClick={() => setFull(true)}>
              Whole page
            </button>
          </div>
          <a href={src} target="_blank" rel="noopener" className="wt-small">
            Open at full size <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div
        className={`wt-viewer-split${showDesk && showPhone ? '' : ' wt-viewer-split--single'}${!showDesk && showPhone ? ' wt-viewer-phone-only' : ''}`}
        key={`${active}-${mode}-${full}`}
      >
        {showDesk && (
          <div>
            <p className="wt-board-label">
              <span>Desktop · 1440</span>
            </p>
            <BoardFrame src={src} width={1440} height={boardHeight(view.board, 1440)} title={`${code} ${name}: ${view.title}`} mode={frameMode} windowHeight="78vh" eager />
          </div>
        )}
        {showPhone && (
          <div>
            <p className="wt-board-label">
              <span>Phone · 390</span>
            </p>
            <BoardFrame src={src} width={390} height={boardHeight(view.board, 390)} title={`${code} ${name}: ${view.title}, phone`} mode={frameMode} windowHeight="78vh" eager />
          </div>
        )}
      </div>
    </div>
  );
}
