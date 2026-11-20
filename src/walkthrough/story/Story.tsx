'use client';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { slides } from './slides';
import { lib } from '../ui/sections';

/**
 * Story mode: the steering-committee presentation. Full screen, one slide at a time.
 * Keys: → / Space / PageDown next · ← / PageUp previous · Home / End · G chapter index · F full screen.
 * The address carries the slide (#/t05), so a slide can be linked to or reloaded.
 */
export function Story() {
  const [index, setIndex] = useState(0);
  const [showIndex, setShowIndex] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const total = slides.length;

  const goIndex = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(total - 1, i));
      setIndex(next);
      const id = slides[next].id;
      if (window.location.hash !== `#/${id}`) window.history.replaceState(null, '', `#/${id}`);
    },
    [total],
  );
  const goTo = useCallback((id: string) => {
    const i = slides.findIndex((s) => s.id === id);
    if (i >= 0) goIndex(i);
    setShowIndex(false);
  }, [goIndex]);

  // Start from the address, and follow back/forward hash changes.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace(/^#\/?/, '');
      const i = slides.findIndex((s) => s.id === id);
      if (i >= 0) setIndex(i);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select')) return;
      if (showIndex && e.key === 'Escape') {
        setShowIndex(false);
        return;
      }
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          goIndex(index + 1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          goIndex(index - 1);
          break;
        case 'Home':
          if (target.closest('.wt-board-window, .wt-matrix-scroll')) return;
          e.preventDefault();
          goIndex(0);
          break;
        case 'End':
          if (target.closest('.wt-board-window, .wt-matrix-scroll')) return;
          e.preventDefault();
          goIndex(total - 1);
          break;
        case 'g':
        case 'G':
          setShowIndex((v) => !v);
          break;
        case 'f':
        case 'F':
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen?.().catch(() => {});
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, total, goIndex, showIndex]);

  // Move focus to the new slide so screen readers and keyboard scrolling follow.
  useEffect(() => {
    stage.current?.querySelector<HTMLElement>(`[data-slide="${index}"]`)?.focus({ preventScroll: true });
  }, [index]);

  const chapters = useMemo(() => {
    const out: { name: string; items: { i: number; title: string }[] }[] = [];
    slides.forEach((s, i) => {
      const last = out[out.length - 1];
      if (!last || last.name !== s.chapter) out.push({ name: s.chapter, items: [{ i, title: s.title }] });
      else last.items.push({ i, title: s.title });
    });
    return out;
  }, []);

  const slide = slides[index];
  const ctx = { goTo };

  return (
    <div className="wt-story">
      <header className="wt-story-top">
        <svg className="wt-signal" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M0 0 H100 V100 H89 A89 89 0 0 0 0 11 Z" />
          <path d="M0 50 H50 V100 H39 A39 39 0 0 0 0 61 Z" />
        </svg>
        <span className="wt-story-chapter">{slide.chapter}</span>
        <div className="wt-story-top-actions">
          <button type="button" className="wt-icon-btn" onClick={() => setShowIndex(true)} aria-haspopup="dialog" title="Chapter index (G)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
            Index
          </button>
          <button
            type="button"
            className="wt-icon-btn"
            onClick={() => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.().catch(() => {}))}
            title="Full screen (F)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
            <span className="visually-hidden">Full screen</span>
          </button>
          <Link href={lib.home} className="wt-icon-btn">
            Library
          </Link>
        </div>
      </header>
      <div className="wt-story-progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <main className="wt-story-stage" ref={stage}>
        {slides.map((s, i) => {
          const near = Math.abs(i - index) <= 1;
          return (
            <section
              key={s.id}
              data-slide={i}
              className={`wt-slide${s.className ? ` ${s.className}` : ''}`}
              style={s.photo ? ({ '--photo': `url('${s.photo}')` } as React.CSSProperties) : undefined}
              hidden={i !== index}
              aria-label={`${i + 1} of ${total}: ${s.title}`}
              aria-roledescription="slide"
              tabIndex={-1}
            >
              {near ? s.render(ctx) : null}
            </section>
          );
        })}

        <div className="wt-index" role="dialog" aria-modal="true" aria-label="Chapter index" hidden={!showIndex}>
          <div className="wt-index-head">
            <h2>Index</h2>
            <button type="button" className="wt-icon-btn" onClick={() => setShowIndex(false)}>
              Close
            </button>
          </div>
          <div className="wt-index-grid">
            {chapters.map((c) => (
              <div key={c.name}>
                <h3>{c.name}</h3>
                <ol>
                  {c.items.map((item) => (
                    <li key={item.i}>
                      <button type="button" onClick={() => goTo(slides[item.i].id)} aria-current={item.i === index || undefined}>
                        <span>{item.i + 1}</span>
                        <span>{item.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="wt-story-foot">
        <span className="wt-story-count" aria-live="polite">
          {index + 1} / {total}
        </span>
        <span className="wt-story-hint">← → to move · G for the index · F for full screen · scroll inside a design to read it</span>
        <div className="wt-story-nav">
          <button type="button" onClick={() => goIndex(index - 1)} disabled={index === 0}>
            <span aria-hidden="true">←</span> Back
          </button>
          <button type="button" onClick={() => goIndex(index + 1)} disabled={index === total - 1}>
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
