import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Globe, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { HexPattern } from '../common/HexPattern';
import { BROKERAGE_DATA } from '../../data/agentsData';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string, param?: string) => void;
  lang: 'en' | 'es';
  onToggleLang: () => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  lang,
  onToggleLang,
  onOpenConsultation
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'properties', labelEn: 'Properties', labelEs: 'Propiedades' },
    { id: 'buy', labelEn: 'Buy', labelEs: 'Comprar' },
    { id: 'sell', labelEn: 'Sell', labelEs: 'Vender' },
    { id: 'agents', labelEn: 'Agents', labelEs: 'Agentes' },
    { id: 'about', labelEn: 'About', labelEs: 'Nosotros' },
    { id: 'contact', labelEn: 'Contact', labelEs: 'Contacto' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDarkHero = activePage === 'home' && !scrolled;

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: scrolled
            ? 'rgba(10, 11, 14, 0.98)'
            : 'rgba(10, 11, 14, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: scrolled
            ? '0 12px 32px rgba(0, 0, 0, 0.5)'
            : '0 4px 20px rgba(0, 0, 0, 0.35)',
          padding: scrolled ? '0.7rem 0' : '0.95rem 0'
        }}
      >
        <div className="container flex items-center justify-between">
          {/* Brand Identity / Home Link */}
          <button
            onClick={() => handleLinkClick('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer'
            }}
            aria-label="New Era Real Estate Home"
          >
            <BrandLogo variant="full-white" height={scrolled ? 34 : 38} />
          </button>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              gap: '2.25rem',
              alignItems: 'center'
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--color-orange-accent)' : 'rgba(255, 255, 255, 0.9)',
                    position: 'relative',
                    padding: '0.4rem 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = isActive
                      ? 'var(--color-orange-accent)'
                      : 'rgba(255, 255, 255, 0.9)')
                  }
                >
                  {lang === 'es' ? link.labelEs : link.labelEn}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '2px',
                        backgroundColor: 'var(--color-orange-accent)',
                        borderRadius: '2px'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1.25rem'
            }}
            className="desktop-actions"
          >
            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
              }}
              aria-label="Toggle language"
            >
              <Globe size={13} color="var(--color-orange-accent)" />
              <span>{lang === 'en' ? 'ES' : 'EN'}</span>
            </button>

            {/* Direct Phone */}
            <a
              href={`tel:${BROKERAGE_DATA.phone.replace(/[^0-9]/g, '')}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                textDecoration: 'none',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Phone size={14} color="var(--color-orange-accent)" />
              <span>(502) 500-0409</span>
            </a>

            {/* Advisory CTA */}
            <button
              onClick={onOpenConsultation}
              className="btn-primary"
              style={{
                padding: '0.65rem 1.35rem',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                backgroundColor: '#660E1A',
                color: '#FFFFFF',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <span>{lang === 'es' ? 'Agendar Cita' : 'Book Advisory'}</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
            className="mobile-actions"
          >
            <button
              onClick={onToggleLang}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {lang === 'en' ? 'ES' : 'EN'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                color: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Luxury Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'var(--color-charcoal-950)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '7rem 2rem 3rem 2rem',
            animation: 'fadeIn 0.3s ease-out',
            overflow: 'hidden'
          }}
        >
          <HexPattern variant="gradient-vibrant" opacity={0.16} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative', zIndex: 1 }}>
            <span className="display-subtitle">
              {lang === 'es' ? 'Menú Principal' : 'Navigation'}
            </span>

            {navLinks.map((link, idx) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 400,
                  color: activePage === link.id ? 'var(--color-orange-accent)' : '#FFFFFF',
                  textAlign: 'left',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '0.75rem'
                }}
              >
                <span>{lang === 'es' ? link.labelEs : link.labelEn}</span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-sans)',
                    color: 'rgba(255, 255, 255, 0.3)'
                  }}
                >
                  0{idx + 1}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
            <a
              href="tel:5025000409"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#FFFFFF',
                fontSize: '1.1rem',
                fontFamily: 'var(--font-serif)'
              }}
            >
              <Phone size={18} color="var(--color-orange-accent)" />
              (502) 500-0409
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>{lang === 'es' ? 'Agendar Consulta' : 'Schedule Advisory'}</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 960px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-actions {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
