import React, { useState } from 'react';
import { CheckCircle2, TrendingUp, Camera, Share2, DollarSign, Shield, ArrowRight, Home } from 'lucide-react';
import { HexPattern } from '../components/common/HexPattern';
import { ValuationRequest, PropertyType } from '../types/property';
import { submitHomeValuation } from '../lib/supabase';

interface SellPageProps {
  onOpenConsultation: () => void;
  lang: 'en' | 'es';
}

export const SellPage: React.FC<SellPageProps> = ({ onOpenConsultation, lang }) => {
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Single Family');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [condition, setCondition] = useState<ValuationRequest['condition']>('Good');
  const [timeline, setTimeline] = useState<ValuationRequest['timeline']>('1-3 months');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitHomeValuation({
      address,
      bedrooms,
      bathrooms,
      condition,
      timeline,
      ownerName,
      ownerEmail,
      ownerPhone,
      notes: `Property Type: ${propertyType}`
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const marketingPillars = [
    {
      icon: Camera,
      titleEn: 'Architectural Photography & 3D Tours',
      titleEs: 'Fotografía Arquitectónica y Recorrido 3D',
      descEn: 'Every property is captured with magazine-grade composition, twilight lighting, and immersive spatial floor plans.',
      descEs: 'Capturamos tu propiedad con calidad editorial, tomas al atardecer y planos interactivos que enamoran compradores.'
    },
    {
      icon: Share2,
      titleEn: 'Targeted Multi-Channel Exposure',
      titleEs: 'Exposición Digital y Red MLS',
      descEn: 'Syndicated instantly across SPARK MLS, GLAR, luxury portals, and hyper-targeted digital advertising campaigns across Greater Louisville and Kentucky.',
      descEs: 'Publicación inmediata en MLS, portales inmobiliarios y campañas dirigidas a compradores calificados en Greater Louisville y Kentucky.'
    },
    {
      icon: TrendingUp,
      titleEn: 'Precision CMA Market Pricing',
      titleEs: 'Valuación Comparativa de Precisión (CMA)',
      descEn: 'We analyze closed comparable sales, micro-market absorption rates, and buyer demand trends to maximize your net proceeds.',
      descEs: 'Analizamos ventas recientes y demanda de mercado para fijar un precio competitivo que proteja tu plusvalía.'
    },
    {
      icon: Shield,
      titleEn: 'Aggressive Negotiation & Closing Defense',
      titleEs: 'Negociación Firme y Blindaje Legal',
      descEn: 'Our experienced brokers defend your bottom line during appraisal, repair requests, and title escrow.',
      descEs: 'Defendemos tu patrimonio en la negociación de reparaciones, avalúos y contingencias notariales.'
    }
  ];

  return (
    <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Header */}
      <section
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          padding: '5rem 0 4rem 0',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <HexPattern variant="burgundy" opacity={0.08} maskFade="radial-top-right" />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '880px' }}>
          <span className="display-subtitle" style={{ color: 'var(--color-burgundy-primary)' }}>
            {lang === 'es' ? 'ESTRATEGIA PARA VENDEDORES' : 'SELLER EXPERIENCE'}
          </span>
          <h1 className="display-title" style={{ color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            {lang === 'es' ? 'TU PROPIEDAD. TU SIGUIENTE MOVIMIENTO.' : 'YOUR PROPERTY. YOUR NEXT MOVE.'}
          </h1>
          <p className="editorial-lead" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'es'
              ? 'Maximizamos el valor neto de tu casa mediante preparación arquitectónica, fijación de precios basada en datos y marketing de alto impacto en Louisville.'
              : 'Positioning your residence for maximum market leverage through architectural presentation, predictive pricing, and bespoke buyer exposure.'}
          </p>
        </div>
      </section>

      {/* Main Form & Value Proposition Grid */}
      <section className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
        <HexPattern variant="subtle" opacity={0.055} maskFade="radial-top-right" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '3.5rem',
              alignItems: 'start'
            }}
          >
            {/* Interactive Valuation Request Form */}
            <div
              style={{
                padding: 'clamp(2rem, 4vw, 3rem)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <span className="display-subtitle">
                {lang === 'es' ? 'VALUACIÓN COMPARATIVA GRATUITA' : 'FREE MARKET VALUATION'}
              </span>
              <h3 style={{ fontSize: '1.65rem', fontWeight: 500, marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                {lang === 'es' ? '¿Cuánto vale tu propiedad hoy?' : 'Discover Your True Property Equity'}
              </h3>

              {submitted ? (
                <div
                  style={{
                    padding: '2.5rem 1.5rem',
                    backgroundColor: 'rgba(114, 22, 35, 0.08)',
                    border: '1px solid var(--color-burgundy-primary)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <CheckCircle2 className="animate-success-icon" size={42} color="var(--color-burgundy-primary)" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>
                    {lang === 'es' ? 'Solicitud de Valuación Recibida' : 'CMA Request Received'}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {lang === 'es'
                      ? 'Nuestros analistas prepararán un informe de mercado detallado con ventas recientes en tu área.'
                      : 'Our valuation team will prepare your custom comparative report within 24 hours.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {lang === 'es' ? 'Dirección Completa' : 'Property Address'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1418 Cherokee Pkwy, Louisville KY"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        marginTop: '0.25rem',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Bedrooms
                      </label>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '0.85rem',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          marginTop: '0.25rem'
                        }}
                      >
                        <option value={1}>1 Bed</option>
                        <option value={2}>2 Beds</option>
                        <option value={3}>3 Beds</option>
                        <option value={4}>4 Beds</option>
                        <option value={5}>5+ Beds</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Bathrooms
                      </label>
                      <select
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '0.85rem',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          marginTop: '0.25rem'
                        }}
                      >
                        <option value={1}>1 Bath</option>
                        <option value={2}>2 Baths</option>
                        <option value={3}>3 Baths</option>
                        <option value={4}>4+ Baths</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Condition
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        marginTop: '0.25rem'
                      }}
                    >
                      <option value="Excellent">Excellent / Move-in Ready</option>
                      <option value="Fully Renovated">Fully Renovated / High Spec</option>
                      <option value="Good">Good / Well Maintained</option>
                      <option value="Needs Work">Needs Work / Fixer</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem'
                      }}
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email Address for Report"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  >
                    <span>{lang === 'es' ? 'SOLICITAR INFORME CMA' : 'RECEIVE CUSTOM CMA REPORT'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>

            {/* Marketing Playbook Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <span className="display-subtitle">
                  {lang === 'es' ? 'EL PLAYBOOK DE VENTA' : 'SELLER ADVANTAGE'}
                </span>
                <h2 className="display-title" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                  {lang === 'es' ? 'CÓMO VENDEMOS POR EL MÁXIMO VALOR' : 'HOW WE MAXIMIZE YOUR PROCEEDS'}
                </h2>
                <p className="editorial-lead">
                  {lang === 'es'
                    ? 'No colocamos un simple cartel en el jardín. Desarrollamos un plan de comercialización cinematográfico que atrae a los compradores más calificados.'
                    : 'A systematic approach combining media excellence with tough, data-backed negotiation.'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {marketingPillars.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1.25rem'
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(114, 22, 35, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Icon size={20} color="var(--color-burgundy-primary)" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {lang === 'es' ? p.titleEs : p.titleEn}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {lang === 'es' ? p.descEs : p.descEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
