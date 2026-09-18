import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { HexPattern } from '../common/HexPattern';
import { LivePatternOverlay } from './LivePatternOverlay';

interface VectorHeroProps {
  onExploreProperties: () => void;
  lang: 'en' | 'es';
  className?: string;
  style?: React.CSSProperties;
}

export const VectorHero: React.FC<VectorHeroProps> = ({
  onExploreProperties,
  lang,
  className = '',
  style = {}
}) => {
  const brandPillars = [
    {
      num: '01',
      titleEn: 'Architectural Precision',
      titleEs: 'Precisión Arquitectónica',
      descEn: 'Design-led marketing & brand excellence',
      descEs: 'Marketing de diseño y excelencia de marca'
    },
    {
      num: '02',
      titleEn: 'Curated Portfolio',
      titleEs: 'Portafolio Exclusivo',
      descEn: 'Residential & luxury properties',
      descEs: 'Propiedades residenciales y de alta gama'
    },
    {
      num: '03',
      titleEn: 'Bipartite Licensure',
      titleEs: 'Licencia Bipartita',
      descEn: 'Kentucky & Southern Indiana',
      descEs: 'Kentucky y Sur de Indiana'
    },
    {
      num: '04',
      titleEn: 'Private Advisory',
      titleEs: 'Asesoría Privada',
      descEn: 'Principal broker representation',
      descEs: 'Representación directa de Principal Broker'
    }
  ];

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
        // LAYER 1: Deep luxurious burgundy / wine background
        background: 'radial-gradient(ellipse at 50% 38%, #280c14 0%, #1a060b 55%, #0d0204 100%)',
        color: '#FFFFFF',
        ...style
      }}
      className={`vector-hero-root ${className}`}
      aria-label="New Era Real Estate Brand Hero"
    >
      {/* LAYER 2: FULL-FRAME MASTER GEOMETRIC PATTERN (100% CorelDRAW 8-quadrant vector master) */}
      <HexPattern
        variant="gradient-gold"
        opacity={0.24}
        mode="cover"
        maskFade="none"
        style={{ zIndex: 1 }}
      />

      {/* LAYER 4: SUBTLE LIVE PATTERN ILLUMINATION (Ambient isolated lines catching champagne-gold light) */}
      <LivePatternOverlay style={{ zIndex: 2 }} />

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
        {/* Official Brokerage Monogram (Zero Box / Floating Cleanly) */}
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
          <BrandLogo variant="monogram-champagne" height={21} />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.95)'
            }}
          >
            Official Brokerage
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CENTER STAGE: Commanding Champagne-Gold Brand Logo + Hero CTAs */}
      {/* ========================================================================= */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '2rem',
          paddingBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
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
            ? 'New Era Real Estate | Bienes Raíces y Asesoría Inmobiliaria en Louisville KY y Southern Indiana'
            : 'New Era Real Estate | Premier Real Estate Brokerage in Louisville KY & Southern Indiana'}
        </h1>

        {/* Large Commanding Champagne-Gold Brand Logo with Dark Backdrop */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginBottom: '2.5rem'
          }}
        >
          {/* Soft Dark Radial Vignette to soften pattern behind logo */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(880px, 96vw)',
              height: 'clamp(280px, 35vw, 420px)',
              background: 'radial-gradient(ellipse at center, rgba(8, 2, 4, 0.92) 0%, rgba(18, 4, 8, 0.72) 48%, rgba(26, 6, 12, 0) 78%)',
              pointerEvents: 'none',
              zIndex: 1,
              filter: 'blur(24px)'
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              filter: 'drop-shadow(0 18px 60px rgba(0, 0, 0, 0.98))',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <BrandLogo
              variant="full-champagne"
              height="clamp(165px, 21vw, 245px)"
              style={{
                maxWidth: '92vw'
              }}
            />
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <button
            onClick={onExploreProperties}
            className="btn-primary"
            style={{
              padding: '1rem 2rem',
              fontSize: '0.84rem',
              letterSpacing: '0.12em'
            }}
          >
            <span>{lang === 'es' ? 'EXPLORAR PROPIEDADES' : 'FIND YOUR NEXT ERA'}</span>
          </button>

          <button
            onClick={() => {
              const searchSection = document.getElementById('search-chapter');
              searchSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-outline btn-outline-white"
            style={{
              padding: '1rem 1.75rem',
              fontSize: '0.8rem',
              letterSpacing: '0.1em'
            }}
          >
            <span>{lang === 'es' ? 'BÚSQUEDA AVANZADA' : 'ADVANCED SEARCH'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM STRIP: High-Contrast Brand Pillars (2 Rows x 2 Columns Matrix) */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          backgroundColor: 'transparent',
          padding: '1rem 0 2.25rem 0'
        }}
      >
        <div className="hero-pillars-container container">
          {brandPillars.map((pillar) => (
            <div
              key={pillar.num}
              className="hero-pillar-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: 'var(--color-orange-accent)',
                    textShadow: '0 0 10px rgba(250, 47, 14, 0.4)'
                  }}
                >
                  {pillar.num}
                </span>
                <span
                  className="hero-pillar-title"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: '0.02em',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.95)'
                  }}
                >
                  {lang === 'es' ? pillar.titleEs : pillar.titleEn}
                </span>
              </div>
              <span
                className="hero-pillar-desc"
                style={{
                  fontSize: '0.72rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.35,
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.9)'
                }}
              >
                {lang === 'es' ? pillar.descEs : pillar.descEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hero-top-bar {
          justify-content: flex-end;
        }
        .hero-pillars-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          align-items: start;
        }
        .hero-pillar-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          border-left: 3px solid var(--color-orange-accent);
          padding-left: 0.85rem;
        }
        @media (max-width: 900px) {
          .hero-pillars-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem 1.5rem !important;
          }
        }
        @media (max-width: 768px) {
          .hero-top-bar {
            justify-content: center !important;
            padding-top: 5rem !important;
          }
        }
        @media (max-width: 640px) {
          .hero-pillars-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.85rem 1rem !important;
          }
          .hero-pillar-item {
            padding-left: 0.65rem !important;
            border-left: 2px solid var(--color-orange-accent) !important;
          }
          .hero-pillar-desc {
            font-size: 0.68rem !important;
            line-height: 1.3 !important;
          }
        }
      `}</style>
    </div>
  );
};
