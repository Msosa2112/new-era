import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { HexPattern } from '../common/HexPattern';

interface ArchitecturalPortalIntroProps {
  onComplete?: () => void;
}

export const ArchitecturalPortalIntro: React.FC<ArchitecturalPortalIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'finished'>('closed');

  useEffect(() => {
    // Step 1: Initial brief focus on center monogram (600ms)
    const openTimer = setTimeout(() => {
      setPhase('opening');
    }, 650);

    // Step 2: Doors fully open and remove overlay from DOM (1800ms)
    const finishTimer = setTimeout(() => {
      setPhase('finished');
      if (onComplete) onComplete();
    }, 1850);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  if (phase === 'finished') {
    return null;
  }

  const isOpening = phase === 'opening';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: isOpening ? 'none' : 'auto',
        overflow: 'hidden',
        display: 'flex'
      }}
      aria-hidden="true"
    >
      {/* LEFT ARCHITECTURAL PORTAL PANEL */}
      <div
        className="portal-panel-left"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50.5%',
          height: '100%',
          backgroundColor: '#0F0205',
          background: 'linear-gradient(135deg, #180509 0%, #0c0204 100%)',
          borderRight: '1px solid rgba(222, 192, 161, 0.35)',
          boxShadow: '10px 0 40px rgba(0, 0, 0, 0.85)',
          zIndex: 2,
          transition: 'transform 1.15s cubic-bezier(0.77, 0, 0.175, 1)',
          transform: isOpening ? 'translateX(-102%)' : 'translateX(0)',
          willChange: 'transform',
          overflow: 'hidden'
        }}
      >
        <HexPattern
          variant="gradient-burgundy"
          opacity={0.16}
          mode="cover"
          maskFade="none"
          style={{ opacity: isOpening ? 0 : 0.18, transition: 'opacity 0.6s' }}
        />
        {/* Subtle Vertical Gold Seam Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '2px',
            height: '100%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(222, 192, 161, 0.8) 50%, transparent 100%)',
            boxShadow: '0 0 15px rgba(222, 192, 161, 0.6)'
          }}
        />
      </div>

      {/* RIGHT ARCHITECTURAL PORTAL PANEL */}
      <div
        className="portal-panel-right"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50.5%',
          height: '100%',
          backgroundColor: '#0F0205',
          background: 'linear-gradient(225deg, #180509 0%, #0c0204 100%)',
          borderLeft: '1px solid rgba(222, 192, 161, 0.35)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.85)',
          zIndex: 2,
          transition: 'transform 1.15s cubic-bezier(0.77, 0, 0.175, 1)',
          transform: isOpening ? 'translateX(102%)' : 'translateX(0)',
          willChange: 'transform',
          overflow: 'hidden'
        }}
      >
        <HexPattern
          variant="gradient-burgundy"
          opacity={0.16}
          mode="cover"
          maskFade="none"
          style={{ opacity: isOpening ? 0 : 0.18, transition: 'opacity 0.6s' }}
        />
        {/* Subtle Vertical Gold Seam Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '2px',
            height: '100%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(222, 192, 161, 0.8) 50%, transparent 100%)',
            boxShadow: '0 0 15px rgba(222, 192, 161, 0.6)'
          }}
        />
      </div>

      {/* CENTER MONOGRAM EMBLEM SEAL */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: isOpening ? 'translate(-50%, -50%) scale(1.18)' : 'translate(-50%, -50%) scale(1)',
          opacity: isOpening ? 0 : 1,
          transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          pointerEvents: 'none'
        }}
      >
        {/* Ambient Radial Golden Seal Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102, 14, 26, 0.7) 0%, rgba(222, 192, 161, 0.25) 45%, transparent 70%)',
            filter: 'blur(20px)',
            animation: 'portalSealPulse 1.2s ease-in-out infinite alternate'
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '1.25rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(18, 4, 8, 0.85)',
            border: '1px solid rgba(222, 192, 161, 0.45)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.9), 0 0 30px rgba(222, 192, 161, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <BrandLogo variant="monogram-champagne" height={48} />
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            fontFamily: 'var(--font-serif)',
            fontSize: '0.85rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#EFE1CE',
            fontWeight: 600,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)'
          }}
        >
          NEW ERA
        </div>
      </div>

      <style>{`
        @keyframes portalSealPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
