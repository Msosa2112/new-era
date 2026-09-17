import React, { useState } from 'react';
import { AgentCard } from '../components/agents/AgentCard';
import { Agent, Property } from '../types/property';
import { propertyService } from '../services/propertyService';
import { HexPattern } from '../components/common/HexPattern';
import { BROKERAGE_DATA } from '../data/agentsData';
import { Phone, Mail, Award, Globe, Building2, X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AgentsPageProps {
  onSelectProperty: (property: Property) => void;
  lang: 'en' | 'es';
}

export const AgentsPage: React.FC<AgentsPageProps> = ({ onSelectProperty, lang }) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentProperties, setAgentProperties] = useState<Property[]>([]);
  const [filterLang, setFilterLang] = useState<string>('All');

  const allAgents = propertyService.getAgents();

  const filteredAgents = filterLang === 'All'
    ? allAgents
    : allAgents.filter(a => a.languages.includes(filterLang));

  const handleSelectAgent = async (agent: Agent) => {
    setSelectedAgent(agent);
    const props = await propertyService.getPropertiesByAgentId(agent.id);
    setAgentProperties(props);
  };

  return (
    <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Page Header */}
      <section
        style={{
          backgroundColor: 'var(--color-charcoal-950)',
          color: '#FFFFFF',
          padding: '5rem 0 4rem 0',
          position: 'relative'
        }}
      >
        <HexPattern variant="gradient-burgundy" opacity={0.26} size={280} />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '880px' }}>
          <span className="display-subtitle" style={{ color: 'var(--color-orange-accent)' }}>
            {lang === 'es' ? 'DIRECTORIO DE ASESORES' : 'ADVISORY ROSTER'}
          </span>
          <h1 className="display-title" style={{ color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            {lang === 'es' ? 'LAS PERSONAS DETRÁS DE LA PROPIEDAD' : 'THE PEOPLE BEHIND THE PROPERTY'}
          </h1>
          <p className="editorial-lead" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {lang === 'es'
              ? 'Un equipo bilingüe de líderes inmobiliarios dedicados a transformar transacciones en legados familiares en Kentucky e Indiana.'
              : 'A dedicated team of licensed real estate professionals delivering precision, local mastery, and unwavering advocacy.'}
          </p>

          {/* Language filter pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {['All', 'Spanish', 'English', 'Italian'].map((l) => (
              <button
                key={l}
                onClick={() => setFilterLang(l)}
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderRadius: 'var(--radius-xs)',
                  border: filterLang === l ? '1px solid var(--color-orange-accent)' : '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: filterLang === l ? 'var(--color-orange-accent)' : 'transparent',
                  color: '#FFFFFF',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {l === 'All' ? (lang === 'es' ? 'Todos los Asesores' : 'All Advisors') : l}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Editorial Grid */}
      <section className="section-padding">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem'
            }}
          >
            {filteredAgents.map((agent, idx) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                index={idx}
                onSelectAgent={handleSelectAgent}
                lang={lang}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Agent Detail Modal / Drawer */}
      {selectedAgent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            backgroundColor: 'rgba(12, 13, 16, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem 1rem'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '820px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xs)',
              position: 'relative',
              boxShadow: 'var(--shadow-dark)',
              padding: 'clamp(2rem, 4vw, 3rem)'
            }}
          >
            <button
              onClick={() => setSelectedAgent(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '2.5rem',
                alignItems: 'start'
              }}
            >
              <img
                src={selectedAgent.photoUrl}
                alt={selectedAgent.name}
                style={{
                  width: '100%',
                  aspectRatio: '1/1.2',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-xs)',
                  border: '2px solid var(--color-burgundy-primary)'
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <span className="display-subtitle">REALTOR® PROFILE</span>
                  <h2 style={{ fontSize: '2rem', fontWeight: 500, marginTop: '0.25rem' }}>
                    {selectedAgent.name}
                  </h2>
                  <p style={{ color: 'var(--color-orange-accent)', fontWeight: 700, fontSize: '0.85rem' }}>
                    {selectedAgent.title}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {BROKERAGE_DATA.name} • {selectedAgent.yearsExperience} Years Experience
                  </p>
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {selectedAgent.bio}
                </p>

                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Specialties
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedAgent.specialties.map((s, i) => (
                      <span key={i} className="tag-badge">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <a
                    href={`tel:${selectedAgent.phone.replace(/[^0-9]/g, '')}`}
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '0.8rem' }}
                  >
                    <Phone size={14} />
                    <span>Call Direct</span>
                  </a>

                  <a
                    href={`mailto:${selectedAgent.email}`}
                    className="btn-outline"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '0.8rem' }}
                  >
                    <Mail size={14} />
                    <span>Email Agent</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Agent active listings strip */}
            {agentProperties.length > 0 && (
              <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                  Active Listings by {selectedAgent.name}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {agentProperties.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedAgent(null);
                        onSelectProperty(p);
                      }}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        src={p.media[0]?.url}
                        alt={p.title}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-burgundy-primary)', fontWeight: 700 }}>
                          ${p.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
