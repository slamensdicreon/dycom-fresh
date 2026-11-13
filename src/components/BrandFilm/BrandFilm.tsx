'use client';
import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { Text, type FileField, type ImageField, type TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { useSiteUI } from 'lib/site-ui';

/**
 * Brand film band — the 2026 brand film's one home on the page (brief §4.5). Plays in place when
 * asked, muted until the visitor turns sound on with the native controls; nothing autoplays. The
 * poster, eyebrow and caption cover the film until it plays and return whenever it is paused or
 * ends (Dycom content v0.1 §2.1). The film file is only requested after the first play.
 *
 * Datasource template: Brand Film — Eyebrow, Caption (the band's H2), PlayLabel, Video (file), Poster (image)
 */
type BrandFilmFields = {
  Eyebrow: TextField;
  Caption: TextField;
  PlayLabel: TextField;
  Video: FileField;
  Poster: ImageField;
};
type BrandFilmProps = ComponentProps & { fields: BrandFilmFields };

export const Default = ({ fields, params, rendering }: BrandFilmProps) => {
  const { motionOff } = useSiteUI();
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const titleId = `film-title-${rendering.uid ?? 'band'}`;

  // The footer Motion control stops a playing film along with everything else.
  useEffect(() => {
    if (motionOff) video.current?.pause();
  }, [motionOff]);

  if (!fields) return null;
  const src = fields.Video?.value?.src as string | undefined;
  const poster = fields.Poster?.value;

  const play = () => {
    const el = video.current;
    if (!el) return;
    setStarted(true);
    // `src` is attached on first play; wait a frame for React to commit it.
    requestAnimationFrame(() => {
      el.play()
        .then(() => el.focus({ preventScroll: true }))
        .catch(() => setPlaying(false));
    });
  };

  return (
    <section
      id={params?.RenderingIdentifier || 'film'}
      className="dy-film"
      aria-labelledby={titleId}
      data-started={started || undefined}
      data-playing={playing || undefined}
    >
      <video
        ref={video}
        src={started ? src : undefined}
        poster={poster?.src as string | undefined}
        preload="none"
        playsInline
        muted
        controls={started}
        tabIndex={started ? 0 : -1}
        aria-label={(fields.Caption?.value as string) || undefined}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <div className="dy-film-cover" hidden={playing || undefined}>
        <button type="button" className="dy-film-play" onClick={play} aria-describedby={titleId}>
          <Play aria-hidden="true" />
          <Text field={fields.PlayLabel} />
        </button>
        <div className="dy-film-copy">
          <Text tag="span" className="dy-film-eyebrow" field={fields.Eyebrow} />
          <Text tag="h2" id={titleId} field={fields.Caption} />
        </div>
      </div>
    </section>
  );
};
