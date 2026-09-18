import React from 'react';
import { CheckCircle2, DollarSign, ShieldCheck, FileText, ArrowRight, UserCheck, Key, Home } from 'lucide-react';
import { HexPattern } from '../components/common/HexPattern';

interface BuyPageProps {
  onExploreProperties: () => void;
  onOpenConsultation: () => void;
  lang: 'en' | 'es';
}

export const BuyPage: React.FC<BuyPageProps> = ({
  onExploreProperties,
  onOpenConsultation,
  lang
}) => {
  const steps = [
    {
      num: '01',
      titleEn: 'Discovery & Financing Assessment',
      titleEs: 'Descubrimiento y Pre-Aprobación',
      descEn: 'We analyze your purchasing power, verify down payment assistance grant eligibility, and connect you with trusted local lenders (Conventional, FHA, VA, ITIN).',
      descEs: 'Evaluamos tu capacidad de compra, verificamos tu elegibilidad para subsidios de enganche y conectamos con prestamistas locales confiables.'
    },
    {
      num: '02',
      titleEn: 'Curated Architectural Search',
      titleEs: 'Búsqueda Residencial Personalizada',
      descEn: 'Access live MLS inventory and private off-market opportunities tailored to your neighborhood and lifestyle criteria.',
      descEs: 'Acceso a inventario MLS actualizado y propiedades privadas exclusivas adaptadas a tus necesidades familiares.'
    },
    {
      num: '03',
      titleEn: 'Private Tours & Valuation Due Diligence',
      titleEs: 'Visitas Privadas y Análisis de Valuación',
      descEn: 'We accompany every showing, inspecting mechanical systems, structural integrity, and comparable market pricing.',
      descEs: 'Acompañamos cada visita técnica revisando la condición estructural y el verdadero valor de mercado.'
    },
    {
      num: '04',
      titleEn: 'Strategic Offer & Contract Defense',
      titleEs: 'Oferta Estratégica y Protección Legal',
      descEn: 'Crafting airtight purchase agreements with strict inspection contingencies and aggressive negotiation leverage.',
      descEs: 'Redactamos ofertas blindadas con contingencias de inspección y sólido poder de negociación.'
    },
    {
      num: '05',
      titleEn: 'Closing & Generational Keys',
      titleEs: 'Cierre Notarial y Entrega de Llaves',
      descEn: 'Guiding you through title review, final walk-through, and closing coordination. Welcome to your New Era.',
      descEs: 'Acompañamiento hasta la firma notarial y entrega oficial de tus llaves.'
    }
  ];

  return (
    <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Header */}
      <section
        style={{
          backgroundColor: 'var(--color-charcoal-950)',
          color: '#FFFFFF',
          padding: '5rem 0 4rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <HexPattern variant="gradient-burgundy" opacity={0.16} maskFade="radial-top-right" />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '880px' }}>
          <span className="display-subtitle" style={{ color: 'var(--color-orange-accent)' }}>
            {lang === 'es' ? 'GUÍA DE COMPRA INMOBILIARIA' : 'BUYER EXPERIENCE'}
          </span>
          <h1 className="display-title" style={{ color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            {lang === 'es' ? 'ENCUENTRA TU SIGUIENTE ERA.' : 'FIND YOUR NEXT ERA.'}
          </h1>
          <p className="editorial-lead" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {lang === 'es'
              ? 'Comprar una casa es más fácil de lo que imaginas. En New Era Real Estate combinamos asesoría de financiamiento integral, programas de asistencia de enganche y representación técnica en Louisville.'
              : 'Acquiring a residence in Kentucky and Southern Indiana requires architectural clarity, market foresight, and uncompromising client advocacy.'}
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <button onClick={onExploreProperties} className="btn-primary">
              <span>{lang === 'es' ? 'Ver Propiedades Disponibles' : 'Search Properties'}</span>
              <ArrowRight size={16} />
            </button>

            <button onClick={onOpenConsultation} className="btn-outline btn-outline-white">
              <span>{lang === 'es' ? 'Consultar con un Asesor' : 'Book Buyer Advisory'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Down Payment Assistance & Loan Programs Banner */}
      <section className="section-padding-sm" style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
        <HexPattern variant="subtle" opacity={0.045} maskFade="none" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              padding: 'clamp(2rem, 4vw, 3rem)',
              backgroundColor: 'var(--color-burgundy-900)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-xs)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <HexPattern variant="gradient-gold" opacity={0.18} maskFade="radial-top-right" />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="display-subtitle" style={{ color: 'var(--color-orange-accent)' }}>
                {lang === 'es' ? 'PROGRAMAS ESPECIALES' : 'SPECIAL FINANCING'}
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                {lang === 'es' ? '¿Sabías que puedes comprar con $0 de enganche?' : 'Down Payment Assistance Programs'}
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {lang === 'es'
                  ? 'Te ayudamos a calificar para fondos estatales de asistencia, programas de primer comprador y opciones de financiamiento con ITIN, 1220A o permiso de trabajo.'
                  : 'Take advantage of state and federal grants, FHA zero-down assistance, and specialized loan structures.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="var(--color-orange-accent)" />
                <span style={{ fontSize: '0.9rem', color: '#FFFFFF' }}>
                  {lang === 'es' ? 'Puntaje de crédito desde 640+' : 'Credit scores from 640+ accepted'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="var(--color-orange-accent)" />
                <span style={{ fontSize: '0.9rem', color: '#FFFFFF' }}>
                  {lang === 'es' ? '1 año de historial de taxes comprobable' : '1-2 years tax history evaluation'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="var(--color-orange-accent)" />
                <span style={{ fontSize: '0.9rem', color: '#FFFFFF' }}>
                  {lang === 'es' ? 'Opciones con ITIN y Permiso de Trabajo' : 'ITIN and Work Authorization solutions'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Acquisition Roadmap */}
      <section className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
        <HexPattern variant="subtle" opacity={0.055} maskFade="radial-top-right" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '720px', marginBottom: '3.5rem' }}>
            <span className="display-subtitle">
              {lang === 'es' ? 'EL PROCESO PASO A PASO' : 'THE BUYER ROADMAP'}
            </span>
            <h2 className="display-title" style={{ marginTop: '0.5rem' }}>
              {lang === 'es' ? 'CÓMO COMPRAMOS TU CASA' : 'HOW WE GUIDE YOUR PURCHASE'}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {steps.map((s, idx) => (
              <div
                key={s.num}
                style={{
                  padding: '2rem clamp(1.5rem, 3vw, 2.5rem)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}
              >
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--color-burgundy-primary)'
                  }}
                >
                  {s.num}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    {lang === 'es' ? s.titleEs : s.titleEn}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {lang === 'es' ? s.descEs : s.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
