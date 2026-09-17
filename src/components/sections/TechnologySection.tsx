import React from 'react';
import { Cpu, Network, ShieldCheck, LineChart, Binary, Smartphone, Sparkles } from 'lucide-react';

interface TechnologySectionProps {
  lang: 'en' | 'es';
}

export const TechnologySection: React.FC<TechnologySectionProps> = ({ lang }) => {
  const pillars = [
    {
      icon: LineChart,
      titleEn: 'Predictive Market Pricing',
      titleEs: 'Precios Predictivos de Mercado',
      descEn: 'Real-time MLS absorption rate analysis and micro-neighborhood equity velocity to pinpoint the optimal listing or offer price.',
      descEs: 'Análisis de tasa de absorción MLS en tiempo real y velocidad de plusvalía por micro-zonas para fijar el precio óptimo.'
    },
    {
      icon: Network,
      titleEn: 'MLS Data Architecture',
      titleEs: 'Arquitectura de Datos MLS',
      descEn: 'Direct integration ready for SPARK MLS and GLAR feeds, eliminating outdated third-party delays and duplicate listings.',
      descEs: 'Integración directa lista para fuentes SPARK MLS y GLAR, eliminando retrasos de portales secundarios y listados obsoletos.'
    },
    {
      icon: Binary,
      titleEn: 'Digital Blueprint Intelligence',
      titleEs: 'Inteligencia de Planos Digitales',
      descEn: 'High-resolution floor plans, spatial 3D wireframe previews, and architectural dimensioning for discerning buyers.',
      descEs: 'Planos de alta resolución, vistas 3D de distribución espacial y dimensionamiento arquitectónico para compradores exigentes.'
    },
    {
      icon: Smartphone,
      titleEn: 'Human-Centric Tech',
      titleEs: 'Tecnología con Rostro Humano',
      descEn: 'Instant client updates, mobile document workflows, and direct communication without annoying robotic chatbots.',
      descEs: 'Actualizaciones al instante, trámites digitales desde el móvil y atención directa con asesores reales sin chatbots molestos.'
    }
  ];

  return (
    <section
      className="section-padding"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '840px', marginBottom: '3.5rem' }}>
          <span className="display-subtitle">
            {lang === 'es' ? 'INTELIGENCIA Y TECNOLOGÍA' : 'INTELLIGENCE & DATA'}
          </span>
          <h2 className="display-title" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            {lang === 'es' ? (
              <>
                LA TECNOLOGÍA DEBE HACER EL INMOBILIARIO <br />
                <span style={{ color: 'var(--color-burgundy-primary)', fontStyle: 'italic' }}>
                  MÁS HUMANO, NO MENOS.
                </span>
              </>
            ) : (
              <>
                TECHNOLOGY SHOULD MAKE REAL ESTATE <br />
                <span style={{ color: 'var(--color-burgundy-primary)', fontStyle: 'italic' }}>
                  FEEL MORE HUMAN, NOT LESS.
                </span>
              </>
            )}
          </h2>
          <p className="editorial-lead">
            {lang === 'es'
              ? 'Detrás de cada transacción exitosa hay datos precisos sobre el mercado de Louisville y un equipo humano que comprende lo que tu familia realmente necesita.'
              : 'Our digital tools exist solely to empower human judgment, negotiate stronger terms, and guide your next move with clarity.'}
          </p>
        </div>

        {/* 4 Architectural Technology Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                style={{
                  padding: '2rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'rgba(114, 22, 35, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={22} color="var(--color-burgundy-primary)" />
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                  {lang === 'es' ? p.titleEs : p.titleEn}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {lang === 'es' ? p.descEs : p.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
