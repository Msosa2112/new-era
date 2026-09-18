import React from 'react';
import { ArrowUpRight, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { HexPattern } from '../common/HexPattern';
import { BROKERAGE_DATA } from '../../data/agentsData';

interface FooterProps {
  onNavigate: (page: string) => void;
  lang: 'en' | 'es';
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, lang }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-charcoal-950)',
        color: '#FFFFFF',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <HexPattern variant="gradient-burgundy" opacity={0.12} maskFade="top-to-bottom" />

      {/* Huge Background Architectural Monogram Return */}
      <div
        style={{
          position: 'absolute',
          bottom: '-40px',
          right: '-20px',
          opacity: 0.03,
          pointerEvents: 'none',
          zIndex: 0
        }}
        aria-hidden="true"
      >
        <BrandLogo variant="monogram-white" height={420} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '5rem', paddingBottom: '3rem' }}>
        {/* Top Brand Statement Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            paddingBottom: '4rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Brand Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}>
            <BrandLogo variant="full-white" height={52} />
            <p
              style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: 1.6,
                maxWidth: '320px'
              }}
            >
              {lang === 'es'
                ? 'Una Nueva Era de Bienes Raíces. Elevando la representación residencial y comercial en Greater Louisville y Southern Indiana.'
                : 'A New Era of Real Estate. Elevating residential and luxury property representation with architectural precision across Kentucky and Indiana.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="tag-badge tag-badge-dark">EQUAL HOUSING OPPORTUNITY</span>
              <span className="tag-badge tag-badge-dark">REALTOR®</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: 'var(--color-orange-accent)',
                textTransform: 'uppercase'
              }}
            >
              {lang === 'es' ? 'EXPLORAR' : 'NAVIGATION'}
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { id: 'properties', labelEn: 'Curated Properties', labelEs: 'Propiedades Exclusivas' },
                { id: 'map', labelEn: 'Interactive Map Search', labelEs: 'Búsqueda en Mapa' },
                { id: 'buy', labelEn: 'Buyer Journey & Grants', labelEs: 'Guía del Comprador' },
                { id: 'sell', labelEn: 'Sell & CMA Valuation', labelEs: 'Vender & Valuación CMA' },
                { id: 'agents', labelEn: 'Agent Directory', labelEs: 'Directorio de Agentes' },
                { id: 'about', labelEn: 'About New Era', labelEs: 'Sobre Nosotros' },
                { id: 'contact', labelEn: 'Schedule Consultation', labelEs: 'Contacto & Citas' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      onNavigate(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      color: 'rgba(255, 255, 255, 0.75)',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)')}
                  >
                    <span>{lang === 'es' ? link.labelEs : link.labelEn}</span>
                    <ArrowUpRight size={12} color="var(--color-orange-accent)" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Neighborhoods Covered */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: 'var(--color-orange-accent)',
                textTransform: 'uppercase'
              }}
            >
              {lang === 'es' ? 'MERCADOS CLAVE' : 'KEY MARKETS'}
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)' }}>
              <li>Prospect & Harrods Creek</li>
              <li>Cherokee Triangle & The Highlands</li>
              <li>St. Matthews & Crescent Hill</li>
              <li>Anchorage & Lake Forest</li>
              <li>Norton Commons & Springhurst</li>
              <li>Jeffersonville & New Albany, IN</li>
            </ul>
          </div>

          {/* Contact & Headquarters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: 'var(--color-orange-accent)',
                textTransform: 'uppercase'
              }}
            >
              {lang === 'es' ? 'SEDE' : 'HEADQUARTERS'}
            </span>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
              {BROKERAGE_DATA.address.fullFormatted}
            </p>
            <a
              href="tel:5025000409"
              style={{
                fontSize: '1.1rem',
                color: 'var(--color-orange-accent)',
                fontFamily: 'var(--font-serif)',
                fontWeight: 600
              }}
            >
              {BROKERAGE_DATA.phone}
            </a>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)' }}>
              {BROKERAGE_DATA.brokerCeo}, Principal Broker
            </p>
          </div>
        </div>

        {/* Bottom Disclaimers & Compliance */}
        <div
          style={{
            paddingTop: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.45)'
          }}
        >
          <div>
            © {currentYear} {BROKERAGE_DATA.legalName}. All rights reserved. | {BROKERAGE_DATA.licenseNote}
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Fair Housing Notice</span>
            <span>MLS Consumer Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
