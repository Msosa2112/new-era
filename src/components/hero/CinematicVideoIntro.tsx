import React, { useState, useRef, useEffect } from 'react';

interface CinematicVideoIntroProps {
  onComplete?: () => void;
}

export const CinematicVideoIntro: React.FC<CinematicVideoIntroProps> = ({ onComplete }) => {
  const [fading, setFading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeStartedRef = useRef<boolean>(false);

  // Check screen width once on load
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const videoSrc = isMobile
    ? '/assets/videos/hero-mobile-1080p.mp4'
    : '/assets/videos/hero-desktop-1080p.mp4';

  const startFade = () => {
    if (fadeStartedRef.current) return;
    fadeStartedRef.current = true;
    setFading(true);

    setTimeout(() => {
      setDone(true);
      if (onComplete) onComplete();
    }, 1150);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const handleTimeUpdate = () => {
      // Trigger the smooth cross-dissolve 0.85 seconds before the video ends (while still in motion)
      if (video.duration && video.duration > 1.2) {
        if (video.currentTime >= video.duration - 0.85) {
          startFade();
        }
      }
    };

    const handleEnded = () => {
      startFade();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    video.play().catch((err) => {
      console.warn('Autoplay notice:', err);
      setTimeout(startFade, 1000);
    });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  if (done) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#000000',
        opacity: fading ? 0 : 1,
        transition: 'opacity 1.15s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'opacity',
        pointerEvents: fading ? 'none' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    </div>
  );
};
