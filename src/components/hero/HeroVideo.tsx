import React, { useEffect, useRef, useState } from 'react';

interface HeroVideoProps {
  onVideoEnd?: () => void;
  className?: string;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({ onVideoEnd, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Detect responsive screen format
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle video playback & final-frame persistence
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Respect accessibility: do not play animation, remain on final frame/poster
      setIsEnded(true);
      setIsReady(true);
      return;
    }

    const handleEnded = () => {
      setIsEnded(true);
      if (onVideoEnd) onVideoEnd();
      // Ensure video stays on the exact final frame without restarting or resetting
      video.pause();
    };

    const handleCanPlay = () => {
      setIsReady(true);
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);

    // Attempt autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsReady(true);
        })
        .catch((error) => {
          // Autoplay policy prevented playback, keep final frame poster visible
          console.warn('Autoplay restricted by browser, displaying final frame poster:', error);
          setIsEnded(true);
          setIsReady(true);
        });
    }

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isMobile, onVideoEnd]);

  const desktopVideo = '/assets/videos/hero-desktop-1080p.mp4';
  const mobileVideo = '/assets/videos/hero-mobile-1080p.mp4';
  const desktopPoster = '/assets/hero-desktop-poster.webp';
  const mobilePoster = '/assets/hero-mobile-poster.webp';

  const currentVideoSrc = isMobile ? mobileVideo : desktopVideo;
  const currentPosterSrc = isMobile ? mobilePoster : desktopPoster;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        zIndex: 0
      }}
      className={`hero-video-container ${className}`}
    >
      {/* Cinematic Video Layer */}
      <video
        ref={videoRef}
        key={isMobile ? 'mobile-hero-video' : 'desktop-hero-video'}
        src={currentVideoSrc}
        poster={currentPosterSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />

      {/* Subtle Bottom Vignette Gradient to integrate seamlessly with the next section without obscuring the centered logo */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to top, rgba(16, 4, 6, 0.92) 0%, rgba(16, 4, 6, 0.4) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
    </div>
  );
};
