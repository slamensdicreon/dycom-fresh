import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Action, IconButton, Signal } from './primitives';
import { asset } from '../content';

/** Same layout serves the D4 still treatment via `?hero=still`. */
const stillHero = () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('hero') === 'still';

/**
 * Copy follows Dycom's homepage content v0.1 (November 2026). The brand film
 * no longer opens from the hero: it has its own band further down the page
 * (BrandFilm), so the hero keeps only the silent loop and its pause control.
 */
export function Hero({ motionOff }: { motionOff: boolean }) {
  const heroVideo = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [still] = useState(stillHero);
  const manualPlayback = useRef<boolean | null>(null);

  useEffect(() => {
    const video = heroVideo.current;
    if (!video) return;
    if (motionOff || still || manualPlayback.current === false) video.pause();
    else video.play().catch(() => setPlaying(false));
  }, [motionOff, still]);

  const toggleVideo = () => {
    const video = heroVideo.current;
    if (!video) return;
    setMediaError(false);
    manualPlayback.current = video.paused;
    if (video.paused) video.play().catch(() => setMediaError(true));
    else video.pause();
  };

  return (
    <section id="top" className="dycom-c5__hero" aria-labelledby="c5-hero-title">
      <div className="dycom-c5__hero-media">
        {still ? (
          <img src={asset('hero-poster.webp')} alt="Dycom crews and infrastructure at work across America" />
        ) : (
          <video
            ref={heroVideo}
            src={asset('hero-loop.mp4')}
            poster={asset('hero-poster.webp')}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Dycom crews and infrastructure at work across America"
            onCanPlay={() => setMediaError(false)}
            onPlay={() => { setPlaying(true); setMediaError(false); }}
            onPause={() => setPlaying(false)}
            onError={() => setPlaying(false)}
            onVolumeChange={(e) => { e.currentTarget.muted = true; e.currentTarget.volume = 0; }}
          />
        )}
        <div className="dycom-c5__media-shade" aria-hidden="true" />
        <Signal className="dycom-c5__hero-signal" />
        <div className="dycom-c5__hero-copy">
          <span className="dycom-c5__hero-eyebrow">Digital infrastructure leader</span>
          <h1 id="c5-hero-title">Scale is <span>Local</span></h1>
          <p>Dycom combines local expertise, national capability, and the skilled people to deliver critical infrastructure America depends on.</p>
          <div className="dycom-c5__actions"><Action href="#companies">Explore our companies</Action><Action outline href="#who-we-are">Who we are</Action></div>
        </div>
        <div className="dycom-c5__media-actions">
          {!still && <IconButton label={playing ? 'Pause background video' : 'Play background video'} pressed={playing} onClick={toggleVideo}>{playing ? <Pause /> : <Play />}</IconButton>}
        </div>
        {mediaError && <p className="dycom-c5__video-error" role="alert">Video could not play. Use the play control to retry.</p>}
      </div>
    </section>
  );
}
