'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Text, NextImage as ContentSdkImage, type TextField, type ImageField, type LinkField, type FileField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { useSiteUI } from 'lib/site-ui';
import { ButtonLink } from 'components/ui/links';
import { IconButton } from 'components/ui/IconButton';
import { Signal } from 'components/ui/Signal';

/**
 * Hero — full-bleed silent film loop (poster for reduced motion and slow connections), eyebrow,
 * H1 with one Signal Green highlight word, one sentence, up to two actions (NAV0004).
 *
 * Datasource template: Hero
 * Variants: Default (film) · Still (poster image only — open decision D4)
 */
type HeroFields = {
  Eyebrow: TextField;
  Heading: TextField;
  /** Word(s) set in Signal Green after the heading. */
  HeadingHighlight: TextField;
  Description: TextField;
  PrimaryLink: LinkField;
  SecondaryLink: LinkField;
  BackgroundVideo: FileField;
  Poster: ImageField;
};

type HeroProps = ComponentProps & { fields: HeroFields };

function HeroLayout({ fields, rendering, params, still }: HeroProps & { still: boolean }) {
  const { motionOff } = useSiteUI();
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const manual = useRef<boolean | null>(null);
  const titleId = `hero-title-${rendering.uid ?? 'main'}`;
  const videoSrc = fields.BackgroundVideo?.value?.src;
  const poster = fields.Poster?.value;

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (motionOff || manual.current === false) el.pause();
    else el.play().catch(() => setPlaying(false));
  }, [motionOff]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    setMediaError(false);
    manual.current = el.paused;
    if (el.paused) el.play().catch(() => setMediaError(true));
    else el.pause();
  };

  const showVideo = !still && Boolean(videoSrc);

  return (
    <section id={params?.RenderingIdentifier || 'top'} className="dy-hero" aria-labelledby={titleId}>
      <div className="dy-hero-media">
        {showVideo ? (
          <video
            ref={video}
            src={videoSrc}
            poster={poster?.src as string | undefined}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={(poster?.alt as string) || undefined}
            onCanPlay={() => setMediaError(false)}
            onPlay={() => {
              setPlaying(true);
              setMediaError(false);
            }}
            onPause={() => setPlaying(false)}
            onError={() => setPlaying(false)}
            onVolumeChange={(e) => {
              // The hero film is silent by rule.
              e.currentTarget.muted = true;
              e.currentTarget.volume = 0;
            }}
          />
        ) : (
          <ContentSdkImage field={fields.Poster} fill priority sizes="100vw" />
        )}
        <div className="dy-media-shade" aria-hidden="true" />
        <Signal className="dy-hero-signal" />
        <div className="dy-hero-copy">
          <Text tag="span" className="dy-hero-eyebrow" field={fields.Eyebrow} />
          <h1 id={titleId}>
            <Text field={fields.Heading} /> <Text tag="span" field={fields.HeadingHighlight} />
          </h1>
          <Text tag="p" field={fields.Description} />
          <div className="dy-actions">
            <ButtonLink field={fields.PrimaryLink} />
            <ButtonLink field={fields.SecondaryLink} variant="outline" />
          </div>
        </div>
        <div className="dy-media-actions">
          {showVideo && (
            <IconButton label={playing ? 'Pause background video' : 'Play background video'} pressed={playing} onClick={toggle}>
              {playing ? <Pause /> : <Play />}
            </IconButton>
          )}
        </div>
        {mediaError && (
          <p className="dy-video-error" role="alert">
            Video could not play. Use the play control to retry.
          </p>
        )}
      </div>
    </section>
  );
}

export const Default = (props: HeroProps) => <HeroLayout {...props} still={false} />;
export const Still = (props: HeroProps) => <HeroLayout {...props} still />;
