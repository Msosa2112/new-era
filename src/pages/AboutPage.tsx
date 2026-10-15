import React from 'react';
import { Play } from 'lucide-react';
import { HexPattern } from '../components/common/HexPattern';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface AboutPageProps {
  onOpenConsultation: () => void;
  lang: 'en' | 'es';
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang }) => {
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
