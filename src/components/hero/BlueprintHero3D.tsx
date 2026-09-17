import React, { useState, useEffect } from 'react';
import { HeroVideo } from './HeroVideo';
import { VectorHero } from './VectorHero';

interface BlueprintHero3DProps {
  onExploreProperties: () => void;
  lang: 'en' | 'es';
}

export const BlueprintHero3D: React.FC<BlueprintHero3DProps> = ({
  onExploreProperties,
  lang
}) => {
  const [videoFinished, setVideoFinished] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleVideoEnd = () => {
    setVideoFinished(true);
  };

  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '680px',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#0e0305'
      }}
      aria-label="New Era Real Estate Brand Hero"
    >
      {/* BASE LAYER: REAL VECTOR HERO */}
      <VectorHero
        onExploreProperties={onExploreProperties}
        lang={lang}
        showVectorLogo={videoFinished || prefersReducedMotion}
      />

      {/* OVERLAY LAYER: CINEMATIC BRAND VIDEO (Smoothly plays on entry, then hands over to Vector Hero) */}
      {!prefersReducedMotion && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 4, // Sits over vector pattern, below top/bottom UI interactive elements
            opacity: videoFinished ? 0 : 1,
            pointerEvents: 'none',
            transition: 'opacity 0.5s ease-out'
          }}
          aria-hidden="true"
        >
          <HeroVideo onVideoEnd={handleVideoEnd} />
        </div>
      )}
    </section>
  );
};
