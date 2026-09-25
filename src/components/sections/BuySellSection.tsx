import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, TrendingUp, Sparkles, Home, CheckCircle2, DollarSign } from 'lucide-react';
import { ValuationRequest } from '../../types/property';
import { HexPattern } from '../common/HexPattern';
import { submitHomeValuation } from '../../lib/supabase';

interface BuySellSectionProps {
  lang: 'en' | 'es';
  onNavigate: (page: string) => void;
  onOpenConsultation: () => void;
}

export const BuySellSection: React.FC<BuySellSectionProps> = ({
  lang,
  onNavigate,
  onOpenConsultation
}) => {
  const [valAddress, setValAddress] = useState('');
  const [valEmail, setValEmail] = useState('');
  const [valSubmitted, setValSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValuationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitHomeValuation({
      address: valAddress,
      ownerEmail: valEmail,
      ownerName: 'Website Visitor'
    });
    setIsSubmitting(false);
    setValSubmitted(true);
  };

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
      <div className="container">
        {/* Two-Column Editorial Grid for Buy & Sell */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem'
          }}
        >
          {/* 1. BUY PATHWAY */}
          <div
            style={{
              padding: 'clamp(2rem, 4vw, 3.5rem)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <HexPattern variant="subtle" opacity={0.08} maskFade="radial-top-right" />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="display-subtitle">{lang === 'es' ? 'COMPRAR RESIDENCIA' : 'ACQUISITION & BUYING'}</span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 3vw, 2.75rem)',
                  lineHeight: 1.15,
                  marginTop: '0.75rem',
                  marginBottom: '1rem'
                }}
              >
                {lang === 'es' ? 'ENCUENTRA TU SIGUIENTE ERA.' : 'FIND YOUR NEXT ERA.'}
              </h3>
              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '1.75rem'
                }}
              >
                {lang === 'es'
                  ? 'Te brindamos acceso prioritario a inventario exclusivo en Louisville y programas de asistencia para el pago inicial (Down Payment Assistance), préstamos FHA, convencionales e ITIN sin complicaciones.'
                  : 'Navigate Greater Louisville’s finest neighborhoods with curated MLS access, off-market opportunities, and tailored financing pathways.'}
              </p>

              {/* Key Buyer Advantages */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--color-burgundy-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {lang === 'es' ? 'Asistencia para Primer Comprador' : 'Down Payment Assistance'}
                    </strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {lang === 'es' ? 'Acceso a fondos y programas de 0% de enganche según elegibilidad.' : 'Specialist guidance for state & federal homebuyer grants.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--color-burgundy-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {lang === 'es' ? 'Asesoría en Crédito e ITIN' : 'Bilingual ITIN & Credit Advisory'}
                    </strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {lang === 'es' ? 'Aceptamos ITIN, permisos de trabajo y perfiles con 640+ de score.' : 'Comprehensive financing solutions with bilingual specialists.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('buy')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', position: 'relative', zIndex: 1 }}
            >
              <span>{lang === 'es' ? 'GUÍA DEL COMPRADOR' : 'EXPLORE BUYER GUIDE'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* 2. SELL PATHWAY */}
          <div
            style={{
              padding: 'clamp(2rem, 4vw, 3.5rem)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(102, 14, 26, 0.18)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <HexPattern variant="burgundy" opacity={0.08} maskFade="radial-center" />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="display-subtitle" style={{ color: 'var(--color-burgundy-primary)' }}>
                {lang === 'es' ? 'VENTA ESTRATÉGICA' : 'MAXIMIZING VALUE & SELLING'}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 3vw, 2.75rem)',
                  lineHeight: 1.15,
                  marginTop: '0.75rem',
                  marginBottom: '1rem',
                  color: 'var(--text-primary)'
                }}
              >
                {lang === 'es' ? 'TU PROPIEDAD. TU SIGUIENTE PASO.' : 'YOUR PROPERTY. YOUR NEXT MOVE.'}
              </h3>
              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '1.75rem'
                }}
              >
                {lang === 'es'
                  ? 'Posicionamos tu residencia para capturar el valor máximo del mercado mediante fotografía arquitectónica, marketing digital de alto impacto y negociación experta.'
                  : 'Elevate your listing with cinematic staging, targeted buyer exposure across Greater Louisville & Kentucky, and precision CMA valuation.'}
              </p>

              {/* Instant Valuation Preview Form */}
              {valSubmitted ? (
                <div
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'rgba(102, 14, 26, 0.06)',
                    border: '1.5px solid var(--color-burgundy-primary)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}
                >
                  <CheckCircle2 size={28} color="var(--color-burgundy-primary)" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lang === 'es' ? 'Valuación Solicitada' : 'Valuation Request Received'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {lang === 'es'
                      ? 'Analizaremos los comparables de tu zona y te enviaremos el reporte CMA.'
                      : 'We will generate your custom CMA report within 24 hours.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleValuationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'es' ? 'Dirección de tu propiedad en Louisville...' : 'Enter your property address in Louisville...'}
                    value={valAddress}
                    onChange={(e) => setValAddress(e.target.value)}
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1.5px solid #DCD5C9',
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem'
                    }}
                  />
                  <input
                    type="email"
                    required
                    placeholder={lang === 'es' ? 'Tu correo electrónico...' : 'Your email address...'}
                    value={valEmail}
                    onChange={(e) => setValEmail(e.target.value)}
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1.5px solid #DCD5C9',
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.9rem'
                    }}
                  >
                    <span>{lang === 'es' ? 'OBTENER VALUACIÓN CMA GRATIS' : 'REQUEST INSTANT CMA VALUATION'}</span>
                  </button>
                </form>
              )}
            </div>

            <button
              onClick={() => onNavigate('sell')}
              className="btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>{lang === 'es' ? 'ESTRATEGIA PARA VENDEDORES' : 'VIEW SELLER PLAYBOOK'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
