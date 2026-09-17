import React from 'react';
import { Award, Building2, Users, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { HexPattern } from '../components/common/HexPattern';
import { BROKERAGE_DATA } from '../data/agentsData';

interface AboutPageProps {
  onOpenConsultation: () => void;
  lang: 'en' | 'es';
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation, lang }) => {
  return (
    <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Header */}
      <section
        style={{
          backgroundColor: 'var(--color-charcoal-950)',
          color: '#FFFFFF',
          padding: '5rem 0 4rem 0',
          position: 'relative'
        }}
      >
        <HexPattern variant="gradient-orange" opacity={0.16} size={580} maskFade="radial-top-right" />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '880px' }}>
          <span className="display-subtitle" style={{ color: 'var(--color-orange-accent)' }}>
            {lang === 'es' ? 'NUESTRA HISTORIA' : 'OUR HERITAGE & VISION'}
          </span>
          <h1 className="display-title" style={{ color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            {lang === 'es' ? 'UNA NUEVA ERA DE BIENES RAÍCES' : 'A NEW ERA OF REAL ESTATE'}
          </h1>
          <p className="editorial-lead" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {lang === 'es'
              ? 'Fundada en Louisville, Kentucky, New Era Real Estate nació de la convicción de que el sector inmobiliario merecía más que transacciones frías: exigía diseño arquitectónico, inteligencia analítica y una profunda empatía humana.'
              : 'Founded on the principle that modern real estate requires architectural clarity, data intelligence, and profound human dedication.'}
          </p>
        </div>
      </section>

      {/* Leadership & CEO Vision Section */}
      <section className="section-padding">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center'
            }}
          >
            {/* CEO Portrait Card */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: '-12px',
                  border: '2px solid var(--color-burgundy-primary)',
                  borderRadius: 'var(--radius-xs)',
                  transform: 'rotate(-1.5deg)',
                  zIndex: 0
                }}
              />
              <img
                src="/assets/agents/newerabroker25gmail.com.jpg"
                alt="Yeilen Contreras, Broker CEO"
                style={{
                  width: '100%',
                  aspectRatio: '1/1.2',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-xs)',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: 'var(--shadow-luxury)'
                }}
              />
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
                    : 'Under Yeilen Contreras’ leadership, New Era has emerged as a premier brokerage connecting multicultural communities with luxury property ownership and robust generational wealth across Kentucky and Indiana.'}
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

      {/* Team Culture & Office Photo Showcase */}
      <section className="section-padding-sm" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
            <span className="display-subtitle">
              {lang === 'es' ? 'NUESTRO EQUIPO Y ESPACIO' : 'OUR CULTURE & SPACE'}
            </span>
            <h2 className="display-title" style={{ marginTop: '0.5rem' }}>
              {lang === 'es' ? 'DISEÑADO PARA LA EXCELENCIA' : 'BUILT FOR COLLABORATION'}
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <img
                src="/assets/team-hero.png"
                alt="New Era Advisory Team"
                style={{ width: '100%', height: '320px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)' }}>
                <strong style={{ fontSize: '0.9rem' }}>The Advisory Team</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Louisville Real Estate Champions</p>
              </div>
            </div>

            <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <img
                src="/assets/office-lobby.png"
                alt="New Era Louisville Office"
                style={{ width: '100%', height: '320px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)' }}>
                <strong style={{ fontSize: '0.9rem' }}>Louisville Headquarters</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>6501 Shepherdsville Rd, Suite 119</p>
              </div>
            </div>

            <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <img
                src="/assets/team-culture.png"
                alt="New Era Community"
                style={{ width: '100%', height: '320px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)' }}>
                <strong style={{ fontSize: '0.9rem' }}>Client & Community Events</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Empowering local homeowners</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
