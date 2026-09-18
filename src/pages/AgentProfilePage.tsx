import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Linkedin,
  MapPin,
  Award,
  Shield,
  Building2,
  CheckCircle2,
  Calendar,
  Sparkles,
  Send,
  ArrowUpRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Agent, Property } from '../types/property';
import { propertyService } from '../services/propertyService';
import { PropertyCard } from '../components/properties/PropertyCard';
import { HexPattern } from '../components/common/HexPattern';
import { BROKERAGE_DATA } from '../data/agentsData';
import {
  ProfileAgentFraming,
  DEFAULT_PROFILE_FRAMING,
  DESKTOP_PROFILE_FRAMING,
  MOBILE_PROFILE_FRAMING,
  loadSavedProfileDesktopFraming,
  saveProfileDesktopFramingToStorage,
  loadSavedProfileMobileFraming,
  saveProfileMobileFramingToStorage
} from '../data/agentFramingConfig';

interface AgentProfilePageProps {
  agent: Agent;
  onSelectProperty: (property: Property) => void;
  onSelectAgent: (agent: Agent) => void;
  onBack: () => void;
  onOpenConsultation: () => void;
  lang: 'en' | 'es';
}

export const AgentProfilePage: React.FC<AgentProfilePageProps> = ({
  agent,
  onSelectProperty,
  onSelectAgent,
  onBack,
  onOpenConsultation,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'bio' | 'track-record'>('listings');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'buy',
    message: ''
  });

  // Profile framing and gradient fade state
  const [desktopProfileMap, setDesktopProfileMap] = useState<Record<string, ProfileAgentFraming>>(() =>
    loadSavedProfileDesktopFraming()
  );
  const [mobileProfileMap, setMobileProfileMap] = useState<Record<string, ProfileAgentFraming>>(() =>
    loadSavedProfileMobileFraming()
  );

  const activeDesktopFraming: ProfileAgentFraming =
    desktopProfileMap[agent.id] || DESKTOP_PROFILE_FRAMING[agent.id] || DEFAULT_PROFILE_FRAMING;
  const activeMobileFraming: ProfileAgentFraming =
    mobileProfileMap[agent.id] || MOBILE_PROFILE_FRAMING[agent.id] || DEFAULT_PROFILE_FRAMING;

  const handleUpdateFraming = (
    agentId: string,
    updates: Partial<ProfileAgentFraming>,
    mode: 'desktop' | 'mobile'
  ) => {
    if (mode === 'desktop') {
      setDesktopProfileMap((prev) => {
        const current = prev[agentId] || DESKTOP_PROFILE_FRAMING[agentId] || DEFAULT_PROFILE_FRAMING;
        const updated = { ...prev, [agentId]: { ...current, ...updates } };
        saveProfileDesktopFramingToStorage(updated);
        return updated;
      });
    } else {
      setMobileProfileMap((prev) => {
        const current = prev[agentId] || MOBILE_PROFILE_FRAMING[agentId] || DEFAULT_PROFILE_FRAMING;
        const updated = { ...prev, [agentId]: { ...current, ...updates } };
        saveProfileMobileFramingToStorage(updated);
        return updated;
      });
    }
  };

  const handleResetAgent = (agentId: string, mode: 'desktop' | 'mobile') => {
    if (mode === 'desktop') {
      setDesktopProfileMap((prev) => {
        const updated = { ...prev, [agentId]: { ...(DESKTOP_PROFILE_FRAMING[agentId] || DEFAULT_PROFILE_FRAMING) } };
        saveProfileDesktopFramingToStorage(updated);
        return updated;
      });
    } else {
      setMobileProfileMap((prev) => {
        const updated = { ...prev, [agentId]: { ...(MOBILE_PROFILE_FRAMING[agentId] || DEFAULT_PROFILE_FRAMING) } };
        saveProfileMobileFramingToStorage(updated);
        return updated;
      });
    }
  };

  const handleResetAll = (mode: 'desktop' | 'mobile') => {
    if (mode === 'desktop') {
      setDesktopProfileMap({ ...DESKTOP_PROFILE_FRAMING });
      saveProfileDesktopFramingToStorage({ ...DESKTOP_PROFILE_FRAMING });
    } else {
      setMobileProfileMap({ ...MOBILE_PROFILE_FRAMING });
      saveProfileMobileFramingToStorage({ ...MOBILE_PROFILE_FRAMING });
    }
  };

  const allAgents = propertyService.getAgents();
  const currentIndex = allAgents.findIndex((a) => a.id === agent.id);
  const prevAgent = allAgents[(currentIndex - 1 + allAgents.length) % allAgents.length];
  const nextAgent = allAgents[(currentIndex + 1) % allAgents.length];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoadingProps(true);
    setFormSent(false);

    propertyService.getPropertiesByAgentId(agent.id).then((props) => {
      setProperties(props);
      setLoadingProps(false);
    });
  }, [agent.id]);

  const cleanPhone = agent.phone.replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    lang === 'es'
      ? `Hola ${agent.name}, vi tu perfil en New Era Real Estate y me gustaría recibir información sobre propiedades y asesoría.`
      : `Hello ${agent.name}, I saw your profile on New Era Real Estate and would like to learn more about your real estate services.`
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', service: 'buy', message: '' });
    }, 4000);
  };

  return (
    <main
      style={{
        paddingTop: 'var(--header-height)',
        minHeight: '100vh',
        backgroundColor: '#0C0D10',
        color: '#FFFFFF'
      }}
    >
      {/* 1. BREADCRUMB & ROSTER NAVIGATION BAR (FROSTED GLASS) */}
      <div
        style={{
          backgroundColor: 'rgba(12, 13, 16, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.85rem 0'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#E64A2A',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
          >
            <ArrowLeft size={16} color="#E64A2A" />
            <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {lang === 'es' ? 'Volver a Todos los Asesores' : 'Back to All Advisors'}
            </span>
          </button>

          {/* Quick Roster Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', display: 'none' }} className="roster-counter-text">
              {currentIndex + 1} / {allAgents.length}
            </span>
            <button
              onClick={() => onSelectAgent(prevAgent)}
              title={prevAgent.name}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onSelectAgent(nextAgent)}
              title={nextAgent.name}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. LUXURY AGENT HERO HEADER */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0C0D10',
          color: '#FFFFFF',
          padding: 'clamp(3rem, 6vw, 5.5rem) 0',
          overflow: 'hidden'
        }}
      >
        <HexPattern variant="gradient-burgundy" opacity={0.18} maskFade="radial-top-right" />

        {/* Oversized Brand Watermark Vector */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '-5%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            opacity: 0.04,
            zIndex: 0
          }}
        >
          <svg width="600" height="600" viewBox="0 0 443.85 68.23" fill="#FFFFFF">
            <path d="M47.51 7.95c0,-1.26 -0.28,-2.22 -0.85,-2.89 -0.57,-0.66 -1.7,-1.4 -3.41,-2.22l0 -1.89 12.3 0 0 1.89c-1.7,0.82 -2.84,1.56 -3.41,2.22 -0.57,0.66 -0.85,1.62 -0.85,2.89l0 59.24 -1.42 0c-1.51,0 -2.74,-0.66 -3.69,-1.99l-35.49 -51.48c-0.82,-1.14 -1.45,-1.7 -1.89,-1.7 -0.5,0 -0.76,0.85 -0.76,2.56l0 45.62c0,1.26 0.28,2.22 0.85,2.89 0.57,0.66 1.7,1.4 3.41,2.22l0 1.89 -12.3 0 0 -1.89c1.7,-0.82 2.84,-1.56 3.41,-2.22 0.57,-0.66 0.85,-1.62 0.85,-2.89l0 -52.24c0,-1.26 -0.28,-2.22 -0.85,-2.89 -0.57,-0.66 -1.7,-1.4 -3.41,-2.22l0 -1.89 12.3 0 32.46 45.52c0.76,1.14 1.39,1.7 1.89,1.7 0.57,0 0.85,-0.88 0.85,-2.65l0 -37.57z" />
          </svg>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div
            className="agent-hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 380px) 1fr',
              gap: 'clamp(2rem, 5vw, 4.5rem)',
              alignItems: 'center'
            }}
          >
            {/* PORTRAIT STAGE (OPEN CUTOUT, CALIBRATED & GRADIENT FADED) */}
            <div
              className="agent-portrait-stage"
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                minHeight: '440px',
                ['--p-d-scale' as any]: activeDesktopFraming.scale,
                ['--p-d-x' as any]: `${activeDesktopFraming.offsetX}px`,
                ['--p-d-y' as any]: `${activeDesktopFraming.offsetY}px`,
                ['--p-d-fadestart' as any]: `${activeDesktopFraming.fadeStart}%`,
                ['--p-d-fadeend' as any]: `${activeDesktopFraming.fadeEnd}%`,
                ['--p-m-scale' as any]: activeMobileFraming.scale,
                ['--p-m-x' as any]: `${activeMobileFraming.offsetX}px`,
                ['--p-m-y' as any]: `${activeMobileFraming.offsetY}px`,
                ['--p-m-fadestart' as any]: `${activeMobileFraming.fadeStart}%`,
                ['--p-m-fadeend' as any]: `${activeMobileFraming.fadeEnd}%`
              }}
            >
              {/* Studio Radial Glow Backdrop */}
              <div
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  height: '90%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(102, 14, 26, 0.55) 0%, rgba(230, 74, 42, 0.16) 45%, transparent 72%)',
                  filter: 'blur(36px)',
                  pointerEvents: 'none'
                }}
              />

              <img
                className="agent-portrait-img"
                src={agent.photoNobgUrl || agent.photoUrl}
                alt={agent.name}
                style={{
                  width: 'auto',
                  maxHeight: '480px',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                  filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.6))',
                  position: 'relative',
                  zIndex: 2,
                  transform: `translate(var(--p-d-x, 0px), var(--p-d-y, 0px)) scale(var(--p-d-scale, 1))`,
                  maskImage: `linear-gradient(to bottom, black var(--p-d-fadestart, 78%), transparent var(--p-d-fadeend, 98%))`,
                  WebkitMaskImage: `linear-gradient(to bottom, black var(--p-d-fadestart, 78%), transparent var(--p-d-fadeend, 98%))`,
                  transition: 'transform 0.05s ease-out'
                }}
              />
            </div>

            {/* BIO, CREDENTIALS & DIRECT ACTIONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                {/* Brand Kicker & Jurisdiction Hierarchy */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: '#E64A2A',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E64A2A', display: 'inline-block' }} />
                      NEW ERA REAL ESTATE ADVISOR
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.75)', letterSpacing: '0.02em' }}>
                      {agent.languages.join(' & ')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                      KY & IN Licensed
                    </span>
                  </div>
                </div>

                <h1
                  style={{
                    fontSize: 'clamp(2.1rem, 5vw, 3.25rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    margin: '0 0 0.35rem 0',
                    lineHeight: 1.15
                  }}
                >
                  {agent.name}
                </h1>

                <p
                  style={{
                    fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#9CA3AF',
                    margin: '0 0 0.75rem 0'
                  }}
                >
                  {agent.id === 'yeilen-contreras' ? 'Principal Broker & Founder' : agent.title}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                  <span style={{ fontFamily: 'monospace' }}>
                    {agent.licenseNumber ? `License #${agent.licenseNumber}` : 'Licensed Brokerage Member'}
                  </span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span>{BROKERAGE_DATA.name}</span>
                </div>
              </div>

              {/* QUICK STATS (CLEAN EDITORIAL 3-COLUMN GRID, NEVER WRAPS AWKWARDLY) */}
              <div className="agent-stats-grid">
                <div className="agent-stat-col">
                  <div className="agent-stat-number">{agent.yearsExperience}+</div>
                  <div className="agent-stat-label">
                    {lang === 'es' ? 'Años Exp.' : 'Years Exp.'}
                  </div>
                </div>

                <div className="agent-stat-col">
                  <div className="agent-stat-number accent">
                    {properties.length > 0 ? properties.length : agent.activeListingsCount}
                  </div>
                  <div className="agent-stat-label">
                    {lang === 'es' ? 'Listados Activos' : 'Active Listings'}
                  </div>
                </div>

                <div className="agent-stat-col">
                  <div className="agent-stat-number">100%</div>
                  <div className="agent-stat-label">
                    {lang === 'es' ? 'Bilingüe ES/EN' : 'Bilingual ES/EN'}
                  </div>
                </div>
              </div>

              {/* DIRECT ACTION BUTTONS (OUTLINE STYLE, CRISP ON MOBILE & DESKTOP) */}
              <div className="agent-actions-container">
                <div className="agent-actions-row">
                  {/* Phone Call (Pure Outline) */}
                  <a
                    href={`tel:${cleanPhone}`}
                    className="agent-btn-outline agent-btn-call"
                  >
                    <Phone size={14} color="#E64A2A" style={{ flexShrink: 0 }} />
                    <span>{agent.phone}</span>
                  </a>

                  {/* WhatsApp Direct (Pure Outline) */}
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="agent-btn-outline agent-btn-wa"
                  >
                    <MessageCircle size={15} color="#25D366" style={{ flexShrink: 0 }} />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Secondary Contact Row & Socials */}
                <div className="agent-contact-subrow">
                  <a
                    href={`mailto:${agent.email}`}
                    className="agent-email-link"
                  >
                    <Mail size={14} color="#E64A2A" style={{ flexShrink: 0 }} />
                    <span className="agent-email-text">{agent.email}</span>
                  </a>

                  {/* Social links */}
                  <div className="agent-socials-group">
                    <a
                      href={agent.instagram || 'https://instagram.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Instagram"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255, 255, 255, 0.85)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E1306C';
                        e.currentTarget.style.borderColor = '#E1306C';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                      }}
                    >
                      <Instagram size={14} />
                    </a>

                    <a
                      href={agent.facebook || 'https://facebook.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Facebook"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255, 255, 255, 0.85)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1877F2';
                        e.currentTarget.style.borderColor = '#1877F2';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                      }}
                    >
                      <Facebook size={14} />
                    </a>

                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255, 255, 255, 0.85)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#0A66C2';
                        e.currentTarget.style.borderColor = '#0A66C2';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                      }}
                    >
                      <Linkedin size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROFILE TABS & SECTION CONTENT */}
      <section className="section-padding" style={{ backgroundColor: '#FBFBFC', color: '#111827', paddingBottom: '3rem' }}>
        <div className="container">
          {/* NAVIGATION TABS */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #E5E7EB',
              marginBottom: '2.5rem',
              gap: '1.5rem',
              overflowX: 'auto'
            }}
          >
            <button
              onClick={() => setActiveTab('listings')}
              style={{
                padding: '0.85rem 0.25rem',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'listings' ? 700 : 500,
                color: activeTab === 'listings' ? '#660E1A' : '#6B7280',
                borderBottom: activeTab === 'listings' ? '3px solid #660E1A' : '3px solid transparent',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{lang === 'es' ? 'Propiedades Listadas' : 'Exclusive Listings'}</span>
              <span
                style={{
                  backgroundColor: activeTab === 'listings' ? '#660E1A' : '#E5E7EB',
                  color: activeTab === 'listings' ? '#FFFFFF' : '#4B5563',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px'
                }}
              >
                {properties.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bio')}
              style={{
                padding: '0.85rem 0.25rem',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'bio' ? 700 : 500,
                color: activeTab === 'bio' ? '#660E1A' : '#6B7280',
                borderBottom: activeTab === 'bio' ? '3px solid #660E1A' : '3px solid transparent',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {lang === 'es' ? 'Biografía & Especialidades' : 'Biography & Specialties'}
            </button>

            <button
              onClick={() => setActiveTab('track-record')}
              style={{
                padding: '0.85rem 0.25rem',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'track-record' ? 700 : 500,
                color: activeTab === 'track-record' ? '#660E1A' : '#6B7280',
                borderBottom: activeTab === 'track-record' ? '3px solid #660E1A' : '3px solid transparent',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {lang === 'es' ? 'Trayectoria & Cierres' : 'Track Record & Closings'}
            </button>
          </div>

          {/* TAB 1: PROPERTIES / LISTINGS */}
          {activeTab === 'listings' && (
            <div>
              {loadingProps ? (
                <div style={{ padding: '3rem 0', textAlign: 'center', color: '#6B7280' }}>
                  {lang === 'es' ? 'Cargando inventario...' : 'Loading listings...'}
                </div>
              ) : properties.length > 0 ? (
                <div className="property-grid-container">
                  {properties.map((prop, idx) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      onSelect={onSelectProperty}
                      lang={lang}
                      priority={idx < 2}
                    />
                  ))}
                </div>
              ) : (
                /* VIP Off-Market / Private Inventory Box */
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E5E7EB',
                    padding: 'clamp(2rem, 5vw, 3.5rem)',
                    textAlign: 'center',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                    maxWidth: '720px',
                    margin: '0 auto'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(102, 14, 26, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem auto',
                      color: '#660E1A'
                    }}
                  >
                    <Building2 size={24} />
                  </div>

                  <h3
                    style={{
                      fontSize: '1.45rem',
                      fontWeight: 600,
                      color: '#111827',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {lang === 'es' ? 'Inventario Privado & Próximos Lanzamientos' : 'Private & Off-Market Portfolio'}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: '#4B5563',
                      lineHeight: 1.6,
                      marginBottom: '1.75rem'
                    }}
                  >
                    {lang === 'es'
                      ? `Actualmente ${agent.name} gestiona colocaciones privadas y nuevas oportunidades residenciales en Greater Louisville y Southern Indiana. Contáctale directamente para acceder al portafolio exclusivo antes de su publicación abierta.`
                      : `Currently, ${agent.name} represents bespoke private listings and off-market residential opportunities across Greater Louisville and Southern Indiana. Inquire directly for exclusive access.`}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="btn-primary"
                      style={{ fontSize: '0.82rem', padding: '0.75rem 1.5rem' }}
                    >
                      <Phone size={15} />
                      <span>{lang === 'es' ? 'Llamar a Asesor' : 'Call Advisor'}</span>
                    </a>

                    <a
                      href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#1E222B',
                        color: '#FFFFFF',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        border: '1px solid #374151',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#111827';
                        e.currentTarget.style.borderColor = '#25D366';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1E222B';
                        e.currentTarget.style.borderColor = '#374151';
                      }}
                    >
                      <MessageCircle size={15} color="#25D366" />
                      <span>{lang === 'es' ? 'Mensaje por WhatsApp' : 'WhatsApp Inquiry'}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BIO & SPECIALTIES */}
          {activeTab === 'bio' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(2rem, 5vw, 4rem)',
                padding: '1rem 0'
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#660E1A',
                    display: 'block',
                    marginBottom: '0.35rem'
                  }}
                >
                  {lang === 'es' ? 'ENFOQUE PROFESIONAL' : 'PROFESSIONAL BACKGROUND'}
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#111827', marginBottom: '1.25rem' }}>
                  {agent.name}
                </h3>
                <p style={{ fontSize: '0.98rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                  {agent.bio}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#374151' }}>
                    <CheckCircle2 size={17} color="#660E1A" />
                    <span>{lang === 'es' ? 'Asesoría bilingüe de principio a fin' : 'Bilingual negotiation & closing advisory'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#374151' }}>
                    <CheckCircle2 size={17} color="#660E1A" />
                    <span>{lang === 'es' ? 'Cobertura bilateral en Kentucky e Indiana' : 'Bilateral market mastery across KY & IN'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#374151' }}>
                    <CheckCircle2 size={17} color="#660E1A" />
                    <span>{lang === 'es' ? 'Estructuración de ofertas y contratos blindados' : 'Airtight contracts and aggressive negotiation'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111827', marginBottom: '1rem' }}>
                  {lang === 'es' ? 'Especialidades & Áreas de Dominio' : 'Specialties & Core Competencies'}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
                  {agent.specialties.map((spec, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(102, 14, 26, 0.06)',
                        color: '#660E1A',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        border: '1px solid rgba(102, 14, 26, 0.15)'
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#111827', marginBottom: '0.35rem' }}>
                    {BROKERAGE_DATA.legalName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.5 }}>
                    {BROKERAGE_DATA.address.fullFormatted}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.35rem' }}>
                    {BROKERAGE_DATA.licenseNote}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRACK RECORD & CLOSINGS */}
          {activeTab === 'track-record' && (
            <div style={{ padding: '1rem 0' }}>
              <div style={{ maxWidth: '780px', marginBottom: '2.5rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#660E1A',
                    display: 'block',
                    marginBottom: '0.35rem'
                  }}
                >
                  {lang === 'es' ? 'HISTORIAL & RESULTADOS' : 'TRACK RECORD & RECENT PERFORMANCE'}
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
                  {lang === 'es' ? `Rendimiento de Cierres con ${agent.name}` : `Closing Performance with ${agent.name}`}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#6B7280', lineHeight: 1.6 }}>
                  {lang === 'es'
                    ? 'Cada cliente representa un patrimonio familiar. Analizamos el mercado local con métricas precisas de absorción y comparables para maximizar tu plusvalía al comprar o vender.'
                    : 'Delivering disciplined advisory, maximum value retention, and smooth transaction milestones across Jefferson, Oldham, Shelby, Clark, and Floyd counties.'}
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '2rem',
                  borderTop: '1px solid #E5E7EB',
                  paddingTop: '2rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#660E1A', lineHeight: 1, marginBottom: '0.5rem' }}>
                    99.2%
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', marginBottom: '0.35rem' }}>
                    {lang === 'es' ? 'Ratio Precio de Venta / Lista' : 'List-to-Sale Price Ratio'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.5 }}>
                    {lang === 'es' ? 'Máxima retención de valor para vendedores' : 'Peak value capture for listing clients'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#E64A2A', lineHeight: 1, marginBottom: '0.5rem' }}>
                    18 {lang === 'es' ? 'Días' : 'Days'}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', marginBottom: '0.35rem' }}>
                    {lang === 'es' ? 'Promedio en Mercado' : 'Average Days on Market'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.5 }}>
                    {lang === 'es' ? 'Estrategia de posicionamiento acelerada' : 'Fast-track marketing and buyer pairing'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#111827', lineHeight: 1, marginBottom: '0.5rem' }}>
                    100%
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', marginBottom: '0.35rem' }}>
                    {lang === 'es' ? 'Acompañamiento en Cierre' : 'Seamless Closing Rate'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.5 }}>
                    {lang === 'es' ? 'Supervisión de títulos y financiamiento' : 'Zero friction title and lending escrow'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. DIRECT CONTACT FORM WITH THIS AGENT */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
          padding: 'clamp(3rem, 6vw, 5rem) 0'
        }}
      >
        <div className="container" style={{ maxWidth: '760px' }}>
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#660E1A',
                  display: 'block',
                  marginBottom: '0.35rem'
                }}
              >
                {lang === 'es' ? 'CONTACTO DIRECTO' : 'DIRECT ADVISORY INQUIRY'}
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: '#111827',
                  margin: '0 0 0.5rem 0'
                }}
              >
                {lang === 'es' ? `Trabaja con ${agent.name}` : `Work with ${agent.name}`}
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#6B7280', maxWidth: '520px', margin: '0 auto' }}>
                {lang === 'es'
                  ? `Envía un mensaje directo a ${agent.name} para coordinar visitas privadas, valuaciones de propiedad o asesoría hipotecaria.`
                  : `Connect directly with ${agent.name} for private showings, market valuations, or bespoke representation.`}
              </p>
            </div>

            {formSent ? (
              <div
                style={{
                  padding: '2.5rem',
                  backgroundColor: '#ECFDF5',
                  borderRadius: '12px',
                  border: '1px solid #A7F3D0',
                  textAlign: 'center'
                }}
              >
                <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#065F46', marginBottom: '0.35rem' }}>
                  {lang === 'es' ? '¡Mensaje Enviado con Éxito!' : 'Message Sent Successfully!'}
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#047857' }}>
                  {lang === 'es'
                    ? `${agent.name} se pondrá en contacto contigo a la brevedad posible.`
                    : `${agent.name} will reach out to you shortly.`}
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      {lang === 'es' ? 'Nombre Completo' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={lang === 'es' ? 'Ej: Carlos Ramírez' : 'e.g. John Doe'}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.9rem',
                        backgroundColor: '#FFFFFF',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      {lang === 'es' ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(502) 000-0000"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.9rem',
                        backgroundColor: '#FFFFFF',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      {lang === 'es' ? 'Correo Electrónico' : 'Email Address'} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nombre@correo.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.9rem',
                        backgroundColor: '#FFFFFF',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      {lang === 'es' ? '¿En qué te podemos ayudar?' : 'I am looking to...'}
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.9rem',
                        backgroundColor: '#FFFFFF',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="buy">{lang === 'es' ? 'Comprar Propiedad' : 'Buy a Property'}</option>
                      <option value="sell">{lang === 'es' ? 'Vender Mi Propiedad' : 'Sell My Property'}</option>
                      <option value="invest">{lang === 'es' ? 'Inversión Inmobiliaria' : 'Investment Advisory'}</option>
                      <option value="relocation">{lang === 'es' ? 'Reubicación a Kentucky/Indiana' : 'Relocation Services'}</option>
                      <option value="other">{lang === 'es' ? 'Consulta General' : 'General Inquiry'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    {lang === 'es' ? 'Mensaje o Detalles' : 'Message or Property Details'}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      lang === 'es'
                        ? `Hola ${agent.name}, me interesa información sobre...`
                        : `Hello ${agent.name}, I would like information regarding...`
                    }
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      fontSize: '0.9rem',
                      backgroundColor: '#FFFFFF',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.95rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    backgroundColor: '#660E1A'
                  }}
                >
                  <Send size={15} />
                  <span>{lang === 'es' ? `Enviar Mensaje a ${agent.name}` : `Send Message to ${agent.name}`}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 5. EXPLORE OTHER AGENTS CAROUSEL STRIP */}
      <section style={{ padding: '3.5rem 0', backgroundColor: '#F3F4F6' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B7280' }}>
                {lang === 'es' ? 'EQUIPO NEW ERA' : 'NEW ERA ROSTER'}
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                {lang === 'es' ? 'Conoce a otros Asesores' : 'Explore Other Advisors'}
              </h3>
            </div>

            <button
              onClick={onBack}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#660E1A',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span>{lang === 'es' ? 'Ver todos' : 'View all roster'}</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem'
            }}
          >
            {allAgents
              .filter((a) => a.id !== agent.id)
              .slice(0, 4)
              .map((otherAgent) => (
                <div
                  key={otherAgent.id}
                  onClick={() => onSelectAgent(otherAgent)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    padding: '0.9rem 1.1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.borderColor = '#660E1A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      minWidth: '46px',
                      maxWidth: '46px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      backgroundColor: '#1E222B',
                      border: '1.5px solid rgba(102, 14, 26, 0.2)',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={otherAgent.photoNobgUrl || otherAgent.photoUrl}
                      alt={otherAgent.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        transform: 'scale(1.3) translateY(2px)'
                      }}
                    />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {otherAgent.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {otherAgent.title}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Scoped CSS for Agent Profile */}
      <style>{`
        /* 3-Column Stats Grid */
        .agent-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          padding: 1rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin: 0.25rem 0 0.5rem 0;
        }
        .agent-stat-col {
          display: flex;
          flex-direction: column;
        }
        .agent-stat-col:not(:last-child) {
          border-right: 1px solid rgba(255, 255, 255, 0.12);
          padding-right: 0.5rem;
        }
        .agent-stat-col:not(:first-child) {
          padding-left: 0.5rem;
        }
        .agent-stat-number {
          font-size: clamp(1.4rem, 3.5vw, 1.85rem);
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1;
        }
        .agent-stat-number.accent {
          color: #E64A2A;
        }
        .agent-stat-label {
          font-size: clamp(0.58rem, 1.6vw, 0.68rem);
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.35rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Action Buttons */
        .agent-actions-container {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .agent-actions-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .agent-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.8rem 1rem;
          background-color: transparent;
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 8px;
          font-size: clamp(0.78rem, 2.2vw, 0.85rem);
          font-weight: 600;
          letter-spacing: 0.02em;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .agent-btn-outline:hover {
          transform: translateY(-2px);
        }
        .agent-btn-call:hover {
          border-color: #FFFFFF;
          background-color: rgba(255, 255, 255, 0.08);
        }
        .agent-btn-wa:hover {
          border-color: #25D366;
          background-color: rgba(37, 211, 102, 0.08);
        }

        /* Secondary Contact Subrow */
        .agent-contact-subrow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .agent-email-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          overflow: hidden;
          white-space: nowrap;
          transition: color 0.2s;
          min-width: 0;
        }
        .agent-email-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .agent-email-link:hover {
          color: #FFFFFF;
        }
        .agent-socials-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-shrink: 0;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .agent-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .agent-portrait-stage {
            min-height: 280px !important;
            max-height: 350px !important;
          }
          .agent-portrait-stage img {
            max-height: 330px !important;
          }
          .agent-portrait-img {
            transform: translate(var(--p-m-x, 0px), var(--p-m-y, 0px)) scale(var(--p-m-scale, 1)) !important;
            mask-image: linear-gradient(to bottom, black var(--p-m-fadestart, 78%), transparent var(--p-m-fadeend, 98%)) !important;
            -webkit-mask-image: linear-gradient(to bottom, black var(--p-m-fadestart, 78%), transparent var(--p-m-fadeend, 98%)) !important;
          }
          .roster-counter-text {
            display: inline !important;
          }
        }

        @media (max-width: 440px) {
          .agent-actions-row {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }
          .agent-btn-outline {
            padding: 0.75rem 0.35rem;
            font-size: 0.74rem;
            gap: 0.35rem;
          }
          .agent-contact-subrow {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .agent-socials-group {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </main>
  );
};
