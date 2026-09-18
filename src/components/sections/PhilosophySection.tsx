import React, { useState } from 'react';
import { Compass, Layers, Home, Database, Users, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { HexPattern } from '../common/HexPattern';

interface PhilosophySectionProps {
  lang: 'en' | 'es';
  onExplore: () => void;
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({ lang, onExplore }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      icon: Compass,
      titleEn: 'BLUEPRINT',
      titleEs: 'PLANO',
      subEn: 'Architectural Intention',
      subEs: 'Intención Arquitectónica',
      bodyEn: 'Every great property begins with rigorous spatial structure, structural honesty, and disciplined design.',
      bodyEs: 'Toda gran propiedad comienza con una rigurosa estructura espacial, honestidad constructiva y disciplina de diseño.'
    },
    {
      num: '02',
      icon: Layers,
      titleEn: 'ARCHITECTURE',
      titleEs: 'ARQUITECTURA',
      subEn: 'Form & Materiality',
      subEs: 'Forma y Materialidad',
      bodyEn: 'We evaluate homes not as commodities, but as built environments designed to enrich everyday human living.',
      bodyEs: 'Evaluamos las residencias no como mercancía, sino como espacios habitables creados para enriquecer la vida humana.'
    },
    {
      num: '03',
      icon: Home,
      titleEn: 'PROPERTY',
      titleEs: 'PROPIEDAD',
      subEn: 'The Physical Asset',
      subEs: 'El Activo Físico',
      bodyEn: 'Location, neighborhood context, and architectural integrity converge to create generational equity.',
      bodyEs: 'Ubicación, contexto de vecindario e integridad arquitectónica convergen para consolidar patrimonio generacional.'
    },
    {
      num: '04',
      icon: Database,
      titleEn: 'DATA',
      titleEs: 'DATOS',
      subEn: 'Market Intelligence',
      subEs: 'Inteligencia de Mercado',
      bodyEn: 'MLS predictive analytics, comparable liquidity metrics, and valuation models that eliminate guesswork.',
      bodyEs: 'Analítica predictiva MLS, métricas de liquidez de comparables y modelos de valuación que eliminan la especulación.'
    },
    {
      num: '05',
      icon: Users,
      titleEn: 'PEOPLE',
      titleEs: 'PERSONAS',
      subEn: 'Human Advocacy',
      subEs: 'Acompañamiento Humano',
      bodyEn: 'Technology is only as powerful as the dedicated advisors who champion your family’s real-world aspirations.',
      bodyEs: 'La tecnología solo es tan poderosa como los asesores dedicados que defienden las aspiraciones de tu familia.'
    },
    {
      num: '06',
      icon: CheckCircle,
      titleEn: 'DECISION',
      titleEs: 'DECISIÓN',
      subEn: 'Clarity & Execution',
      subEs: 'Claridad y Ejecución',
      bodyEn: 'Negotiation leverage, airtight contracts, and seamless closing execution with zero stress.',
      bodyEs: 'Poder de negociación, contratos blindados y un cierre impecable sin fricciones ni sorpresas.'
    },
    {
      num: '07',
      icon: Sparkles,
      titleEn: 'NEW ERA',
      titleEs: 'NUEVA ERA',
      subEn: 'The Horizon',
      subEs: 'El Horizonte',
      bodyEn: 'You step into your next chapter with confidence, pride, and generational stability.',
      bodyEs: 'Inicias tu siguiente etapa con total certidumbre, orgullo y estabilidad para el futuro.'
    }
  ];

  return (
    <section
      className="section-padding"
      style={{
        backgroundColor: 'var(--color-charcoal-950)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Official Brand Vector Pattern Background */}
      <HexPattern variant="gradient-burgundy" opacity={0.22} maskFade="none" />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ maxWidth: '800px', marginBottom: '4rem' }}>
          <span className="display-subtitle">
            {lang === 'es' ? 'LA FILOSOFÍA NEW ERA' : 'THE PHILOSOPHY'}
          </span>
          <h2
            className="display-title"
            style={{
              color: '#FFFFFF',
              marginTop: '0.75rem',
              marginBottom: '1.25rem'
            }}
          >
            {lang === 'es' ? (
              <>
                BIENES RAÍCES, <br />
                <span style={{ color: 'var(--color-orange-accent)', fontStyle: 'italic' }}>
                  REIMAGINADOS.
                </span>
              </>
            ) : (
              <>
                REAL ESTATE, <br />
                <span style={{ color: 'var(--color-orange-accent)', fontStyle: 'italic' }}>
                  REIMAGINED.
                </span>
              </>
            )}
          </h2>
          <p
            className="editorial-lead"
            style={{ color: 'rgba(255, 255, 255, 0.75)' }}
          >
            {lang === 'es'
              ? 'No vendemos metros cuadrados con discursos convencionales. Construimos una trayectoria estructurada de transformación que conecta la arquitectura y los datos con decisiones que trascienden.'
              : 'Technology should make real estate feel more human, not less. We follow an intentional progression from raw blueprint to definitive ownership.'}
          </p>
        </div>

        {/* The 7-Stage Transformation Journey */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem'
          }}
        >
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(idx)}
                style={{
                  padding: '1.25rem 1rem',
                  backgroundColor: isActive
                    ? 'rgba(114, 22, 35, 0.4)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isActive
                    ? '1px solid var(--color-orange-accent)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  textAlign: 'left',
                  transition: 'all var(--transition-normal)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isActive ? 'var(--color-orange-accent)' : 'rgba(255, 255, 255, 0.4)'
                    }}
                  >
                    {s.num}
                  </span>
                  <Icon
                    size={18}
                    color={isActive ? 'var(--color-orange-accent)' : 'rgba(255, 255, 255, 0.4)'}
                  />
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {lang === 'es' ? s.titleEs : s.titleEn}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
                      display: 'block',
                      marginTop: '0.2rem'
                    }}
                  >
                    {lang === 'es' ? s.subEs : s.subEn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Active Step Focus Card */}
        <div
          style={{
            backgroundColor: 'rgba(27, 30, 36, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-xs)',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <HexPattern variant="gradient-orange" opacity={0.14} maskFade="radial-center" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="tag-badge tag-badge-accent">
                STAGE {steps[activeStep].num} // {lang === 'es' ? 'TRANSFORMACIÓN' : 'TRANSFORMATION'}
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.25rem',
                color: '#FFFFFF',
                marginBottom: '1rem'
              }}
            >
              {lang === 'es' ? steps[activeStep].titleEs : steps[activeStep].titleEn} —{' '}
              <span style={{ color: 'var(--color-orange-accent)', fontStyle: 'italic' }}>
                {lang === 'es' ? steps[activeStep].subEs : steps[activeStep].subEn}
              </span>
            </h3>

            <p
              style={{
                fontSize: '1.15rem',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.85)',
                marginBottom: '2rem'
              }}
            >
              {lang === 'es' ? steps[activeStep].bodyEs : steps[activeStep].bodyEn}
            </p>

            <button
              onClick={onExplore}
              className="btn-primary"
              style={{ padding: '0.9rem 1.8rem', fontSize: '0.8rem' }}
            >
              <span>{lang === 'es' ? 'Comenzar Tu Proceso' : 'Begin Your Transformation'}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div
            style={{
              padding: '2rem',
              backgroundColor: 'rgba(12, 13, 16, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: 'var(--color-orange-accent)',
                letterSpacing: '0.15em',
                display: 'block',
                marginBottom: '0.75rem'
              }}
            >
              NEW ERA SYSTEM ARCHITECTURE
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Market Region</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>Greater Louisville & Southern Indiana</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Representation</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>Bespoke Buyer & Seller Advocacy</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Financing Pathways</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>Conventional, FHA, VA, Down Payment Assist & ITIN</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Executive Direction</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>Yeilen Contreras, Principal Broker</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
