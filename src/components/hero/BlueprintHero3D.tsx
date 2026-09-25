import React from 'react';
import { VectorHero } from './VectorHero';

interface BlueprintHero3DProps {
  onExploreProperties: () => void;
  onOpenJoinModal?: () => void;
  lang: 'en' | 'es';
}

export const BlueprintHero3D: React.FC<BlueprintHero3DProps> = ({
  onExploreProperties,
  onOpenJoinModal,
  lang
}) => {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#FAF7F2'
      }}
      aria-label="New Era Real Estate Brand Hero"
    >
      {/* 100% MASTER VECTOR HERO */}
      <VectorHero
        onExploreProperties={onExploreProperties}
        onOpenJoinModal={onOpenJoinModal}
        lang={lang}
      />
    </section>
  );
};

