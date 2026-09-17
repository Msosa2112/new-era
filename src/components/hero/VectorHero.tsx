import React from 'react';
import { ArrowDown, Compass, Sparkles, Building2, ShieldCheck, Award } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { LivePatternOverlay } from './LivePatternOverlay';

interface VectorHeroProps {
  onExploreProperties: () => void;
  lang: 'en' | 'es';
  showVectorLogo?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const VectorHero: React.FC<VectorHeroProps> = ({
  onExploreProperties,
  lang,
  showVectorLogo = true,
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
        height: '100vh',
        minHeight: '680px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        // LAYER 1: Deep luxurious burgundy / wine background matching Reference 1 & 2
        background: 'radial-gradient(ellipse at 50% 50%, #2a0d15 0%, #1c070c 55%, #0e0305 100%)',
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
          opacity: 0.88,
          pointerEvents: 'none',
          zIndex: 1
        }}
        aria-hidden="true"
      />

      {/* LAYER 4: SUBTLE LIVE PATTERN ILLUMINATION (Random isolated lines briefly catching light) */}
      <LivePatternOverlay style={{ zIndex: 2 }} />

      {/* LAYER 3: OFFICIAL NEW ERA REAL ESTATE LOGO (Centered, Satin Matte Champagne-Gold Finish) */}
      <div
        style={{
          position: 'absolute',
          top: '48%',
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
          opacity: showVectorLogo ? 1 : 0,
          transition: 'opacity 0.6s ease-out'
        }}
        className="hero-logo-anchor"
      >
        <div
          style={{
            filter: 'drop-shadow(0 6px 32px rgba(0, 0, 0, 0.85))'
          }}
        >
          {/* Responsive vector logo scaling matching Reference 1 (Desktop) and Reference 2 (Mobile) */}
          <div className="hidden sm:block">
            <BrandLogo variant="full-champagne" height={180} />
          </div>
          <div className="block sm:hidden">
            <BrandLogo variant="full-champagne" height={120} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HTML / UI INTERACTIVE LAYER (Frames the central logo with zero obstruction) */}
      {/* ========================================================================= */}

      {/* Top Telemetry & Official Brokerage Header Bar */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '6.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          pointerEvents: 'none'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                backgroundColor: 'var(--color-orange-accent)',
                borderRadius: '50%',
                boxShadow: '0 0 10px var(--color-orange-accent)'
              }}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.725rem',
                letterSpacing: '0.18em',
                color: 'rgba(255, 255, 255, 0.85)',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
              }}
            >
              LOUISVILLE, KY • 38.2527° N, 85.7585° W
            </span>
          </div>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.625rem',
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.55)',
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)'
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
            gap: '0.65rem',
            background: 'rgba(16, 4, 6, 0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }}
        >
          <BrandLogo variant="monogram-champagne" height={18} />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
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

      {/* Central Spatial Buffer - Keeps the central logo 100% open and visible */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          flex: '1 1 auto',
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />

      {/* Lower Editorial Baseline & Action Deck */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'linear-gradient(to top, rgba(12, 3, 5, 0.94) 0%, rgba(12, 3, 5, 0.75) 65%, transparent 100%)',
          paddingTop: '2rem',
          paddingBottom: '0.5rem'
        }}
      >
        <div className="container" style={{ paddingBottom: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '1.5rem'
            }}
          >
            {/* Left: Editorial Statement */}
            <div style={{ maxWidth: '580px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="tag-badge tag-badge-accent" style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem' }}>
                  <Sparkles size={10} style={{ marginRight: '3px' }} />
                  {lang === 'es' ? 'Experiencia Inmobiliaria' : 'Architectural Real Estate'}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  EST. 2026
                </span>
              </div>

              <p
                style={{
                  fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.55,
                  margin: 0,
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
                }}
              >
                {lang === 'es'
                  ? 'Elevando la representación residencial y de lujo a través de precisión arquitectónica y asesoría privada en Kentucky e Indiana.'
                  : 'Elevating residential and luxury property representation with architectural precision across Kentucky and Southern Indiana.'}
              </p>
            </div>

            {/* Right: Primary Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.85rem',
                alignItems: 'center'
              }}
            >
              <button
                onClick={onExploreProperties}
                className="btn-primary"
                style={{
                  padding: '0.85rem 1.65rem',
                  fontSize: '0.8rem',
                  letterSpacing: '0.12em'
                }}
              >
                <span>{lang === 'es' ? 'EXPLORAR PROPIEDADES' : 'FIND YOUR NEXT ERA'}</span>
                <Compass size={15} />
              </button>

              <button
                onClick={() => {
                  const searchSection = document.getElementById('search-chapter');
                  searchSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-outline btn-outline-white"
                style={{
                  padding: '0.85rem 1.35rem',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em'
                }}
              >
                <span>{lang === 'es' ? 'Búsqueda Avanzada' : 'Advanced Search'}</span>
                <ArrowDown size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Brand Pillars Credential Strip */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(10, 2, 4, 0.88)',
            padding: '0.75rem 0'
          }}
        >
          <div
            className="container"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            {brandPillars.map((pillar) => (
              <div
                key={pillar.num}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.15rem',
                  borderLeft: '2px solid rgba(250, 47, 14, 0.4)',
                  paddingLeft: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: 'var(--color-orange-accent)'
                    }}
                  >
                    {pillar.num}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#FFFFFF'
                    }}
                  >
                    {lang === 'es' ? pillar.titleEs : pillar.titleEn}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: 'rgba(255, 255, 255, 0.5)',
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
    </div>
  );
};
