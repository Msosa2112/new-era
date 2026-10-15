import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { HexPattern } from '../common/HexPattern';
import { LivePatternOverlay } from './LivePatternOverlay';

interface VectorHeroProps {
  onExploreProperties: () => void;
  onOpenJoinModal?: () => void;
  lang: 'en' | 'es';
  className?: string;
  style?: React.CSSProperties;
}

export const VectorHero: React.FC<VectorHeroProps> = ({
  onExploreProperties,
  onOpenJoinModal,
  lang,
  className = '',
  style = {}
}) => {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        // LAYER 1: Rich warm luxury cream background
        background: 'radial-gradient(ellipse at 50% 42%, #FAF7F2 0%, #F5EEE2 55%, #EBE0D0 100%)',
        color: '#121418',
        ...style
      }}
      className={`vector-hero-root ${className}`}
      aria-label="New Era Real Estate Brand Hero"
    >
      {/* LAYER 2: FULL-FRAME MASTER GEOMETRIC PATTERN (Brand Red / Burgundy Vector Pattern) */}
      <div className="hero-pattern-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <HexPattern
          variant="burgundy"
          opacity={0.16}
          mode="cover"
          maskFade="none"
        />
      </div>

      {/* LAYER 4: SUBTLE LIVE PATTERN ILLUMINATION (Ambient isolated lines catching burgundy light) */}
      <div className="hero-live-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
        <LivePatternOverlay />
      </div>

      {/* ========================================================================= */}
      {/* TOP BAR: Official Brokerage Monogram (Top-Right on Desktop, Centered on Mobile) */}
      {/* ========================================================================= */}
      <div
        className="hero-top-bar container"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '5.5rem',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >
        {/* Official Brokerage Monogram (Brand Burgundy) */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            background: 'transparent',
            padding: '0.25rem 0',
            pointerEvents: 'auto'
          }}
        >
          <BrandLogo variant="monogram-burgundy" height={21} />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#660E1A'
            }}
          >
            Official Brokerage
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CENTER STAGE: Commanding Brand Burgundy Logo + Hero CTAs */}
      {/* ========================================================================= */}
      <div
        className="hero-center-stage container"
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: '1rem',
          paddingBottom: '3.5rem'
        }}
      >
        {/* Semantic H1 for SEO & Accessibility (Visually hidden, zero design impact) */}
        <h1
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0
          }}
        >
          {lang === 'es'
            ? 'New Era Real Estate | Bienes Raíces y Asesoría Inmobiliaria en Louisville y Kentucky'
            : 'New Era Real Estate | Premier Real Estate Brokerage in Louisville & Greater Kentucky'}
        </h1>

        {/* Large Commanding Brand Burgundy Logo with Warm Light Halo */}
        <div
          className="hero-logo-stage"
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginBottom: 'clamp(2rem, 3.5vh, 3.25rem)'
          }}
        >
          {/* Soft Warm Radial Vignette to soften pattern behind logo */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(1350px, 98vw)',
              height: 'clamp(320px, 54vh, 620px)',
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.96) 0%, rgba(250, 247, 242, 0.76) 50%, rgba(245, 238, 226, 0) 78%)',
              pointerEvents: 'none',
              zIndex: 1,
              filter: 'blur(24px)'
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              filter: 'drop-shadow(0 16px 44px rgba(102, 14, 26, 0.14))',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <BrandLogo
              variant="full-burgundy"
              className="hero-main-brand-logo"
              height="auto"
              style={{
                width: 'min(1080px, 78vw)',
                maxHeight: '52vh',
                height: 'auto'
              }}
            />
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div
          className="hero-actions-stage"
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.15rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <button
            onClick={onOpenJoinModal || onExploreProperties}
            className="btn-primary"
            style={{
              padding: '1.05rem 2.4rem',
              fontSize: '0.86rem',
              letterSpacing: '0.12em',
              backgroundColor: '#660E1A',
              color: '#FFFFFF',
              borderRadius: '6px',
              border: '1px solid #660E1A',
              boxShadow: '0 8px 24px rgba(102, 14, 26, 0.22)',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            <span>{lang === 'es' ? 'ÚNETE A NUESTRO EQUIPO' : 'JOIN TO OUR TEAM'}</span>
          </button>

          <button
            onClick={() => {
              const searchSection = document.getElementById('search-chapter');
              searchSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              padding: '1.05rem 2.1rem',
              fontSize: '0.84rem',
              letterSpacing: '0.1em',
              backgroundColor: '#FFFFFF',
              color: '#660E1A',
              border: 'none',
              borderRadius: '6px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
              cursor: 'pointer',
              fontWeight: 700,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5EFE6';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>{lang === 'es' ? 'BÚSQUEDA AVANZADA' : 'ADVANCED SEARCH'}</span>
          </button>
        </div>
      </div>

      <style>{`
        /* Staggered Cinematic Hero Reveal Keyframes */
        .vector-hero-root {
          animation: heroBackgroundFade 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-pattern-layer {
          animation: heroPatternFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }
        .hero-live-overlay {
          animation: heroPatternFade 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }
        .hero-top-bar {
          justify-content: flex-end;
          animation: heroTopFade 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
        }
        .hero-logo-stage {
          animation: heroLogoReveal 1.15s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
        }
        .hero-actions-stage {
          animation: heroElementSlideUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.75s both;
        }

        @keyframes heroBackgroundFade {
          0% {
            opacity: 0.65;
            filter: brightness(0.95);
          }
          100% {
            opacity: 1;
            filter: brightness(1);
          }
        }

        @keyframes heroPatternFade {
          0% {
            opacity: 0;
            transform: scale(1.025);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes heroTopFade {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroLogoReveal {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
            filter: blur(6px) drop-shadow(0 0 0 rgba(102, 14, 26, 0));
          }
          50% {
            filter: blur(0px) drop-shadow(0 8px 24px rgba(102, 14, 26, 0.18));
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px) drop-shadow(0 12px 36px rgba(102, 14, 26, 0.12));
          }
        }

        @keyframes heroElementSlideUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-top-bar {
            justify-content: center !important;
            padding-top: 5rem !important;
          }
          .hero-main-brand-logo {
            width: min(440px, 90vw) !important;
            max-height: 36vh !important;
          }
        }
      `}</style>
    </div>
  );
};
