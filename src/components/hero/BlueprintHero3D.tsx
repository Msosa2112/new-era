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
    // Transition seamlessly into Vector Hero live state
    setVideoFinished(true);
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#0f0305'
      }}
      aria-label="New Era Real Estate Brand Hero"
    >
      {/* BASE LAYER: REAL VECTOR HERO (Deep Burgundy, Full-Frame Pattern, Centered Champagne-Gold Logo & Live Illumination) */}
      <VectorHero onExploreProperties={onExploreProperties} lang={lang} />

      {/* OVERLAY LAYER: CINEMATIC BRAND VIDEO (Plays on entry, then smoothly hands over to Vector Hero) */}
      {!prefersReducedMotion && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 4, // Sits over the vector background, under the interactive UI layer
            opacity: videoFinished ? 0 : 1,
            pointerEvents: 'none',
            transition: 'opacity 0.6s ease-out'
          }}
          aria-hidden="true"
        >
          <HeroVideo onVideoEnd={handleVideoEnd} />
        </div>
      )}
    </section>
  );
};
