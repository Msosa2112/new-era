import React, { useState } from 'react';
import { ArrowDown, Compass, Building2, Sparkles, MapPin, ShieldCheck, Layers } from 'lucide-react';
import { HeroVideo } from './HeroVideo';
import { BrandLogo } from '../common/BrandLogo';

interface BlueprintHero3DProps {
  onExploreProperties: () => void;
  lang: 'en' | 'es';
}

export const BlueprintHero3D: React.FC<BlueprintHero3DProps> = ({
  onExploreProperties,
  lang
}) => {
  const [videoFinished, setVideoFinished] = useState<boolean>(false);

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
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        backgroundColor: '#100406',
        color: '#FFFFFF'
      }}
      aria-label="New Era Real Estate Cinematic Hero"
    >
      {/* Cinematic Brand Video Layer with Persistent Final Frame */}
      <HeroVideo onVideoEnd={() => setVideoFinished(true)} />

      {/* Top Floating Telemetry / Metadata Bar */}
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

        {/* Brand Monogram Glass Pill */}
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
          <BrandLogo variant="monogram-white" height={20} />
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

      {/* Central Spatial Buffer - Keeps the central animated champagne-gold logo completely unobstructed */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          flex: '1 1 auto',
          minHeight: '22vh',
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />

      {/* Lower Hero Content & Editorial Framing */}
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
            background: 'linear-gradient(135deg, rgba(16, 4, 6, 0.78) 0%, rgba(16, 4, 6, 0.55) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-sm)',
            padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              alignItems: 'center'
            }}
          >
            {/* Left Column: Headlines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
                  fontSize: 'clamp(2rem, 4.2vw, 3.25rem)',
                  color: '#FFFFFF',
                  lineHeight: 1.1,
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
                  fontSize: 'clamp(0.9rem, 1.15vw, 1.05rem)',
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

      {/* Bottom Brand Pillars Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(16, 4, 6, 0.82)',
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
    </section>
  );
};
