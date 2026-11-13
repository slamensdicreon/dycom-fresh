import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { Action, IconButton, Modal, Signal } from './primitives';
import { asset } from '../content';

/** Same layout serves the D4 still treatment via `?hero=still`. */
const stillHero = () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('hero') === 'still';

export function Hero({ motionOff }: { motionOff: boolean }) {
  const heroVideo = useRef<HTMLVideoElement>(null);
  const filmVideo = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [still] = useState(stillHero);
  const resumeAfterFilm = useRef(false);
  const manualPlayback = useRef<boolean | null>(null);

  useEffect(() => {
    const video = heroVideo.current;
    if (!video) return;
    if (motionOff || filmOpen || still || manualPlayback.current === false) video.pause();
    else video.play().catch(() => setPlaying(false));
  }, [motionOff, filmOpen, still]);

  const toggleVideo = () => {
    const video = heroVideo.current;
    if (!video) return;
    setMediaError(false);
    manualPlayback.current = video.paused;
    if (video.paused) video.play().catch(() => setMediaError(true));
    else video.pause();
  };
  const closeFilm = () => { filmVideo.current?.pause(); setFilmOpen(false); if (!resumeAfterFilm.current) heroVideo.current?.pause(); };

  return (
    <>
      <section id="top" className="dycom-c5__hero" aria-labelledby="c5-hero-title">
        <div className="dycom-c5__hero-copy">
          <h1 id="c5-hero-title">Behind the work<br className="dycom-c5__desktop-break" /> that connects <span>America.</span></h1>
          <p>Engineering, construction and maintenance for the nation's networks, delivered by local operating companies working to one standard.</p>
          <div className="dycom-c5__actions"><Action href="#companies">Explore our companies</Action><Action outline href="#what-we-do">What we do</Action></div>
        </div>
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
          <div className="dycom-c5__media-caption"><strong>Built for what’s next.</strong><span>America’s networks, in motion</span></div>
          <div className="dycom-c5__media-actions">
            <button type="button" className="dycom-c5__film-trigger" onClick={() => { resumeAfterFilm.current = playing; setFilmOpen(true); }}><Signal />See our people at work<ArrowRight size={18} /></button>
            {!still && <IconButton label={playing ? 'Pause background video' : 'Play background video'} pressed={playing} onClick={toggleVideo}>{playing ? <Pause /> : <Play />}</IconButton>}
          </div>
          {mediaError && <p className="dycom-c5__video-error" role="alert">Video could not play. Use the play control to retry.</p>}
        </div>
      </section>
      <Modal open={filmOpen} onClose={closeFilm} title="Our people at work" id="c5-film-title">
        <p className="dycom-c5__film-description">The people and work behind America’s infrastructure.</p>
        <video
          ref={filmVideo}
          src={filmOpen ? asset('brand-film.mp4') : undefined}
          poster={asset('hero-poster.webp')}
          autoPlay
          muted
          playsInline
          controls
          onVolumeChange={(e) => { e.currentTarget.muted = true; e.currentTarget.volume = 0; }}
        />
      </Modal>
    </>
  );
}
