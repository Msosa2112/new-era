import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../common/BrandLogo';

interface CinematicVeilIntroProps {
  onComplete?: () => void;
}

export const CinematicVeilIntro: React.FC<CinematicVeilIntroProps> = ({ onComplete }) => {
  const [active, setActive] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start the silky dissolve after a brief 250ms breathing moment
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 280);

    // Completely unmount after transition completes (1450ms)
    const cleanupTimer = setTimeout(() => {
      setActive(false);
      if (onComplete) onComplete();
    }, 1550);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(cleanupTimer);
    };
  }, [onComplete]);

  if (!active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: fading ? 'rgba(7, 2, 4, 0)' : 'rgba(8, 2, 3, 0.96)',
        backdropFilter: fading ? 'blur(0px)' : 'blur(16px)',
        WebkitBackdropFilter: fading ? 'blur(0px)' : 'blur(16px)',
        transition: 'background-color 1.25s cubic-bezier(0.25, 1, 0.35, 1), backdrop-filter 1.25s cubic-bezier(0.25, 1, 0.35, 1)',
        willChange: 'background-color, backdrop-filter, opacity'
      }}
      aria-hidden="true"
    >
      {/* Ambient center luxury vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 20%, rgba(5, 1, 2, 0.8) 100%)',
          opacity: fading ? 0 : 1,
          transition: 'opacity 1.1s cubic-bezier(0.25, 1, 0.35, 1)'
        }}
      />

      {/* Central Minimalist Gold Monogram & Hairline */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          opacity: fading ? 0 : 1,
          transform: fading ? 'scale(1.08) translateY(-12px)' : 'scale(1) translateY(0)',
          transition: 'opacity 0.95s cubic-bezier(0.25, 1, 0.35, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div
          style={{
            filter: 'drop-shadow(0 0 25px rgba(222, 192, 161, 0.4))'
          }}
        >
          <BrandLogo variant="monogram-champagne" height={52} />
        </div>

        {/* Expanding Gold Hairline Accent */}
        <div
          style={{
            width: fading ? '240px' : '90px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(222, 192, 161, 0.9) 50%, transparent 100%)',
            boxShadow: '0 0 12px rgba(222, 192, 161, 0.7)',
            transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.8rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#EFE1CE',
            fontWeight: 500,
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)'
          }}
        >
          NEW ERA
        </div>
      </div>
    </div>
  );
};
