import React from 'react';
import { ContactSection } from '../components/sections/ContactSection';
import { HexPattern } from '../components/common/HexPattern';
import { MapPin, Phone, Mail, Clock, HelpCircle, ShieldCheck } from 'lucide-react';
import { BROKERAGE_DATA } from '../data/agentsData';

interface ContactPageProps {
  lang: 'en' | 'es';
}

export const ContactPage: React.FC<ContactPageProps> = ({ lang }) => {
  const faqs = [
    {
      qEn: 'What down payment assistance programs are currently available?',
      qEs: '¿Qué programas de asistencia de enganche están disponibles?',
      aEn: 'We work with state-backed grants, local government initiatives, and conventional programs offering up to $10,000+ in buyer assistance based on qualification.',
      aEs: 'Trabajamos con programas estatales y locales que ofrecen hasta $10,000+ de asistencia para el pago inicial según ingresos y elegibilidad.'
    },
    {
      qEn: 'Can I purchase a home with an ITIN number?',
      qEs: '¿Puedo comprar una casa con número ITIN?',
      aEn: 'Yes. Our bilingual advisors specialize in ITIN loan structures, 1220A programs, and work authorization pathways with competitive terms.',
      aEs: 'Sí. Nuestros asesores bilingües son expertos en préstamos con ITIN, permiso de trabajo y cartas de empleo.'
    },
    {
      qEn: 'How do you determine the listing price for my property?',
      qEs: '¿Cómo determinan el precio de venta de mi propiedad?',
      aEn: 'We execute a rigorous Comparative Market Analysis (CMA) evaluating recent closed sales, pending contracts, active competition, and unique architectural upgrades.',
      aEs: 'Realizamos un Análisis Comparativo de Mercado (CMA) analizando ventas recientes, competencia activa y mejoras arquitectónicas de tu propiedad.'
    }
  ];

  return (
    <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Page Hero */}
      <section
        style={{
          backgroundColor: 'var(--color-charcoal-950)',
          color: '#FFFFFF',
          padding: '5rem 0 4rem 0',
          position: 'relative'
        }}
      >
        <HexPattern variant="gradient-orange" opacity={0.16} maskFade="radial-top-right" />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '880px' }}>
          <span className="display-subtitle" style={{ color: 'var(--color-orange-accent)' }}>
            {lang === 'es' ? 'COMUNÍCATE CON NOSOTROS' : 'CONNECT WITH US'}
          </span>
          <h1 className="display-title" style={{ color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            {lang === 'es' ? 'INICIA TU SIGUIENTE ERA.' : 'START YOUR NEXT ERA.'}
          </h1>
          <p className="editorial-lead" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {lang === 'es'
              ? 'Visítanos en nuestra oficina en Louisville o agenda una consulta privada con nuestro equipo de liderazgo.'
              : 'Our doors are open at our Louisville headquarters. Connect with us for confidential real estate advisory.'}
          </p>
        </div>
      </section>

      {/* Main Interactive Contact Section */}
      <ContactSection lang={lang} />

      {/* FAQ Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="display-subtitle">
              {lang === 'es' ? 'PREGUNTAS FRECUENTES' : 'FREQUENTLY ASKED QUESTIONS'}
            </span>
            <h2 className="display-title" style={{ marginTop: '0.5rem' }}>
              {lang === 'es' ? 'CLARIDAD Y CERTEZA' : 'EVERYTHING YOU NEED TO KNOW'}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <HelpCircle size={18} color="var(--color-burgundy-primary)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                    {lang === 'es' ? faq.qEs : faq.qEn}
                  </h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, paddingLeft: '2rem' }}>
                  {lang === 'es' ? faq.aEs : faq.aEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
