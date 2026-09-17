import React from 'react';
import { VectorHero } from './VectorHero';

interface BlueprintHero3DProps {
  onExploreProperties: () => void;
  lang: 'en' | 'es';
}

export const BlueprintHero3D: React.FC<BlueprintHero3DProps> = ({
  onExploreProperties,
  lang
}) => {
  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '680px',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#0d0204'
      }}
      aria-label="New Era Real Estate Brand Hero"
    >
      {/* 100% REAL VECTOR HERO (Deep Burgundy, Large-scale 620px Pattern, Single Champagne-Gold Logo & Live Ambient Line Illumination) */}
      <VectorHero
        onExploreProperties={onExploreProperties}
        lang={lang}
      />
    </section>
  );
};
