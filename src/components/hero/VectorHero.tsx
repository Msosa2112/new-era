import React from 'react';
import { ArrowDown, Compass, Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
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
        // LAYER 1: Deep luxurious burgundy / wine background with cinematic radial vignette
        background: 'radial-gradient(ellipse at 50% 48%, #280d14 0%, #1c070c 50%, #0f0305 100%)',
        color: '#FFFFFF',
        ...style
      }}
      className={`vector-hero-root ${className}`}
      aria-label="New Era Real Estate Vector Hero"
    >
      {/* LAYER 2: FULL-FRAME OFFICIAL GEOMETRIC PATTERN (Edge to Edge, Infinite Field) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/assets/pattern-hero.svg)',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center center',
          backgroundSize: '240px 240px',
          opacity: 0.92,
          pointerEvents: 'none',
          zIndex: 1
        }}
        aria-hidden="true"
      />

      {/* LAYER 4: SUBTLE LIVE PATTERN ILLUMINATION (Isolated line segments briefly catching light) */}
      <LivePatternOverlay style={{ zIndex: 2 }} />

      {/* LAYER 3: OFFICIAL NEW ERA REAL ESTATE LOGO (Centered, Satin Matte Champagne-Gold Finish) */}
      <div
        style={{
          position: 'absolute',
          top: '44%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '0 1.5rem',
          maxWidth: '820px'
        }}
      >
        <div
          style={{
            filter: 'drop-shadow(0 6px 28px rgba(0, 0, 0, 0.75))',
            transform: 'scale(1)',
            transition: 'transform 0.4s ease-out'
          }}
          className="hero-central-logo"
        >
          {/* Responsive vector scaling: matches Reference 1 (Desktop) and Reference 2 (Mobile) */}
          <div className="hidden sm:block">
            <BrandLogo variant="full-champagne" height={190} />
          </div>
          <div className="block sm:hidden">
            <BrandLogo variant="full-champagne" height={120} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HTML / UI INTERACTIVE LAYER (Sits cleanly above the visual brand layer) */}
      {/* ========================================================================= */}

      {/* Top Telemetry & Brokerage Badge Bar */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '6.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          pointerEvents: 'none'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--color-orange-accent)',
                borderRadius: '50%',
                boxShadow: '0 0 12px var(--color-orange-accent)'
              }}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                color: 'rgba(255, 255, 255, 0.85)',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)'
              }}
            >
              LOUISVILLE, KY • 38.2527° N, 85.7585° W
            </span>
          </div>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.55)',
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.7)'
            }}
          >
            GLAR MLS DIRECT NETWORK // GREATER LOUISVILLE & SOUTHERN INDIANA
          </span>
        </div>

        {/* Official Brokerage Monogram Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(16, 4, 6, 0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }}
        >
          <BrandLogo variant="monogram-champagne" height={20} />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#FFFFFF'
            }}
          >
            Official Brokerage
          </span>
        </div>
      </div>

      {/* Central Spatial Buffer - Keeps the central champagne-gold logo completely unobstructed */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          flex: '1 1 auto',
          minHeight: '26vh',
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />

      {/* Lower Editorial Glass Dock & CTA Area */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          paddingBottom: '2.5rem'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(18, 5, 8, 0.82) 0%, rgba(18, 5, 8, 0.6) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-sm)',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '2rem',
              alignItems: 'center'
            }}
          >
            {/* Left Column: Display Headline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="tag-badge tag-badge-accent">
                  <Sparkles size={11} style={{ marginRight: '4px' }} />
                  {lang === 'es' ? 'Experiencia Inmobiliaria' : 'Architectural Real Estate'}
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}
                >
                  EST. 2026
                </span>
              </div>

              <h1
                className="display-hero"
                style={{
                  fontSize: 'clamp(1.85rem, 3.8vw, 3rem)',
                  color: '#FFFFFF',
                  lineHeight: 1.12,
                  margin: 0
                }}
              >
                {lang === 'es' ? (
                  <>
                    UNA NUEVA ERA DE <br />
                    <span
                      style={{
                        color: 'var(--color-orange-accent)',
                        fontStyle: 'italic',
                        fontFamily: 'var(--font-serif)'
                      }}
                    >
                      BIENES RAÍCES.
                    </span>
                  </>
                ) : (
                  <>
                    A NEW ERA OF <br />
                    <span
                      style={{
                        color: 'var(--color-orange-accent)',
                        fontStyle: 'italic',
                        fontFamily: 'var(--font-serif)'
                      }}
                    >
                      REAL ESTATE.
                    </span>
                  </>
                )}
              </h1>
            </div>

            {/* Right Column: Narrative Copy & Primary Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.82)',
                  fontSize: 'clamp(0.875rem, 1.1vw, 1rem)',
                  lineHeight: 1.6,
                  margin: 0
                }}
              >
                {lang === 'es'
                  ? 'Elevamos la representación inmobiliaria a través de precisión arquitectónica, análisis de mercado avanzado y una dedicación humana integral en Kentucky e Indiana.'
                  : 'Evolving real estate representation through architectural clarity, deep market intelligence, and dedicated human guidance across Kentucky and Indiana.'}
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                <button
                  onClick={onExploreProperties}
                  className="btn-primary"
                  style={{
                    padding: '0.95rem 1.85rem',
                    fontSize: '0.85rem',
                    letterSpacing: '0.12em'
                  }}
                >
                  <span>{lang === 'es' ? 'EXPLORAR PROPIEDADES' : 'FIND YOUR NEXT ERA'}</span>
                  <Compass size={16} />
                </button>

                <button
                  onClick={() => {
                    const searchSection = document.getElementById('search-chapter');
                    searchSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-outline btn-outline-white"
                  style={{
                    padding: '0.95rem 1.6rem',
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em'
                  }}
                >
                  <span>{lang === 'es' ? 'Búsqueda Avanzada' : 'Advanced Search'}</span>
                  <ArrowDown size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Brand Pillars Credential Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(14, 4, 6, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '1rem 0'
        }}
      >
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            alignItems: 'center'
          }}
        >
          {brandPillars.map((pillar) => (
            <div
              key={pillar.num}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                borderLeft: '2px solid rgba(250, 47, 14, 0.4)',
                paddingLeft: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--color-orange-accent)'
                  }}
                >
                  {pillar.num}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}
                >
                  {lang === 'es' ? pillar.titleEs : pillar.titleEn}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.55)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {lang === 'es' ? pillar.descEs : pillar.descEn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
