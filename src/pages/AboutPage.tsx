import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { HexPattern } from '../components/common/HexPattern';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { AnimatedCounter } from '../components/common/AnimatedCounter';

interface AboutPageProps {
  onOpenConsultation: () => void;
  lang: 'en' | 'es';
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation, lang }) => {
  const mainRef = useScrollReveal<HTMLElement>();

  return (
    <main ref={mainRef} style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Full-Screen Team Hero (Full Viewport on Desktop, Uncropped Full-Width on Mobile) */}
      <section className="about-hero-section">
        <div className="about-hero-media-wrap">
          <img
            src="/assets/agents/newerabroker25gmail.com.jpg"
            alt="New Era Real Estate Team"
            className="about-hero-img"
          />
          <div className="about-hero-gradient" />
        </div>

        <div className="about-hero-content-wrap">
          <div className="container">
            <div className="about-hero-text-box">
              <span className="about-hero-kicker">
                {lang === 'es' ? 'NUESTRA FAMILIA, TU HOGAR' : 'OUR FAMILY, YOUR HOME'}
              </span>
              <h1 className="about-hero-title">
                {lang === 'es'
                  ? 'MÁS QUE PROPIEDADES, CONSTRUIMOS SUEÑOS.'
                  : 'MORE THAN PROPERTIES, WE BUILD DREAMS.'}
              </h1>
              <p className="about-hero-lead">
                {lang === 'es'
                  ? 'Detrás de cada puerta que abrimos hay una familia, una historia y un nuevo comienzo. Unidos por la pasión y guiados por el corazón, caminamos contigo hasta que tu sueño tenga dirección.'
                  : 'Behind every door we open is a family, a story, and a new beginning. United by passion and guided by heart, we walk beside you until your dream has an address.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & CEO Vision Section */}
      <section className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
        <HexPattern variant="subtle" opacity={0.055} maskFade="radial-top-right" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center'
            }}
          >
            {/* CEO Portrait Card */}
            <div style={{ position: 'relative', maxWidth: '460px', margin: '0 auto', width: '100%' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: '-12px',
                  border: '2px solid var(--color-burgundy-primary)',
                  borderRadius: 'var(--radius-md)',
                  transform: 'rotate(-1.5deg)',
                  zIndex: 0
                }}
              />
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1/1.18',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: 'var(--shadow-luxury)',
                  background: 'radial-gradient(circle at 50% 32%, #FFFFFF 0%, #EFE9DF 100%)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}
              >
                <img
                  src="/assets/agents/yeilen-contreras-nobg.png"
                  alt="Yeilen Contreras, Principal Broker & CEO"
                  style={{
                    width: '100%',
                    height: '96%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                    filter: 'drop-shadow(0 16px 32px rgba(0, 0, 0, 0.14))'
                  }}
                />
              </div>
            </div>

            {/* CEO Narrative */}
            <div>
              <span className="display-subtitle">
                {lang === 'es' ? 'LIDERAZGO EJECUTIVO' : 'EXECUTIVE LEADERSHIP'}
              </span>
              <h2 className="display-title" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                Yeilen Contreras
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-orange-accent)',
                  marginBottom: '1.5rem'
                }}
              >
                Principal Broker & CEO — New Era Real Estate
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                <p>
                  {lang === 'es'
                    ? 'Bajo la dirección de Yeilen Contreras, New Era se ha consolidado como una de las firmas inmobiliarias más influyentes y respetadas de la región, rompiendo barreras lingüísticas y guiando a cientos de familias hacia la adquisición de su patrimonio.'
                    : 'Under Yeilen Contreras’ leadership, New Era has emerged as a premier brokerage connecting multicultural communities with luxury property ownership and robust generational wealth across Greater Louisville and Kentucky.'}
                </p>
                <p>
                  {lang === 'es'
                    ? '“Nuestra misión no termina cuando firmamos los contratos; comienza cuando una familia abre la puerta de su nuevo hogar con la certeza de que su inversión fue respaldada con los más altos estándares éticos y técnicos del mercado.”'
                    : '"Our commitment is not confined to transactions. We build architectural and financial futures that stand the test of time."'}
                </p>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button onClick={onOpenConsultation} className="btn-primary">
                  <span>{lang === 'es' ? 'Agendar Consulta con Yeilen' : 'Connect with Leadership'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage & Numbers Strip */}
      <section
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          padding: '4rem 0',
          overflow: 'hidden',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <HexPattern variant="burgundy" opacity={0.06} maskFade="radial-center" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center'
            }}
          >
            <AnimatedCounter
              target={45}
              prefix="$"
              suffix="M+"
              duration={1800}
              label={lang === 'es' ? 'Volumen en Bienes Raíces' : 'Closed Sales Volume'}
            />
            <AnimatedCounter
              target={150}
              suffix="+"
              duration={1600}
              label={lang === 'es' ? 'Transacciones Exitosas' : 'Satisfied Clients'}
            />
            <AnimatedCounter
              target={100}
              suffix="%"
              duration={1700}
              label={lang === 'es' ? 'Asesoría Bilingüe Certificada' : 'Bilingual Advocacy'}
            />
            <AnimatedCounter
              target={24}
              suffix=""
              duration={1500}
              label={lang === 'es' ? 'Integrantes del Equipo' : 'Team Members'}
            />
          </div>
        </div>
      </section>

      {/* Built for Collaboration — Clean Video Mock Container */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
        <HexPattern variant="subtle" opacity={0.05} maskFade="radial-center" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
            <span className="display-subtitle">
              {lang === 'es' ? 'NUESTRO EQUIPO Y ESPACIO' : 'OUR CULTURE & SPACE'}
            </span>
            <h2 className="display-title" style={{ marginTop: '0.5rem' }}>
              {lang === 'es' ? 'DISEÑADO PARA LA COLABORACIÓN' : 'BUILT FOR COLLABORATION'}
            </h2>
          </div>

          {/* Empty Clean 16:9 Video Mock Container */}
          <div
            style={{
              maxWidth: '1080px',
              margin: '0 auto',
              width: '100%',
              aspectRatio: '16 / 9',
              backgroundColor: '#0F1115',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(102, 14, 26, 0.2)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
            aria-label="Video Showcase Placeholder"
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(102, 14, 26, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)'
              }}
            >
              <Play size={28} fill="#FFFFFF" style={{ marginLeft: '3px' }} />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .about-hero-section {
          position: relative;
          width: 100%;
          min-height: calc(100vh - var(--header-height));
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background-color: #0c0d10;
          overflow: hidden;
        }
        .about-hero-media-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .about-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 22%;
          display: block;
        }
        .about-hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10, 11, 14, 0.92) 0%,
            rgba(10, 11, 14, 0.58) 38%,
            rgba(10, 11, 14, 0.12) 70%,
            rgba(10, 11, 14, 0) 100%
          );
          pointer-events: none;
        }
        .about-hero-content-wrap {
          position: relative;
          z-index: 2;
          width: 100%;
          padding: 4rem 0 4.5rem 0;
        }
        .about-hero-text-box {
          max-width: 780px;
        }
        .about-hero-kicker {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #F6D8A8;
          margin-bottom: 0.65rem;
        }
        .about-hero-title {
          font-family: var(--font-serif);
          font-size: clamp(2.1rem, 4.5vw, 3.8rem);
          font-weight: 500;
          line-height: 1.1;
          color: #FFFFFF;
          margin: 0 0 1rem 0;
          letter-spacing: -0.01em;
        }
        .about-hero-lead {
          font-size: clamp(1rem, 1.4vw, 1.2rem);
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          max-width: 680px;
        }

        /* Mobile: Never crop the team photo; display full width and place emotional copy cleanly below */
        @media (max-width: 768px) {
          .about-hero-section {
            min-height: auto;
            background-color: #FAF7F2;
            border-bottom: 1px solid var(--border-subtle);
          }
          .about-hero-media-wrap {
            position: relative;
            inset: auto;
            width: 100%;
            height: auto;
            background-color: #0c0d10;
          }
          .about-hero-img {
            width: 100%;
            height: auto;
            object-fit: contain;
            object-position: center center;
          }
          .about-hero-gradient {
            display: none;
          }
          .about-hero-content-wrap {
            padding: 2.25rem 0 2.75rem 0;
            background-color: #FAF7F2;
          }
          .about-hero-kicker {
            color: #660E1A;
          }
          .about-hero-title {
            color: #121418;
            font-size: 1.85rem;
          }
          .about-hero-lead {
            color: #4B5563;
            font-size: 0.98rem;
          }
        }
      `}</style>
    </main>
  );
};
