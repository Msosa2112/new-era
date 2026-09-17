import React, { useState } from 'react';
import { Phone, Mail, ArrowUpRight, Award, Globe, Building2 } from 'lucide-react';
import { Agent } from '../../types/property';

interface AgentCardProps {
  agent: Agent;
  index: number;
  onSelectAgent: (agent: Agent) => void;
  lang: 'en' | 'es';
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  index,
  onSelectAgent,
  lang
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <div
      onClick={() => onSelectAgent(agent)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xs)',
        overflow: 'hidden',
        transition: 'all var(--transition-normal)',
        transform: isHovered ? 'translateY(-6px)' : 'none',
        boxShadow: isHovered ? 'var(--shadow-luxury)' : 'var(--shadow-sm)',
        position: 'relative'
      }}
    >
      {/* Top Editorial Index Bar */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--color-burgundy-primary)'
          }}
        >
          {formattedIndex}
        </span>

        <span
          style={{
            fontSize: '0.725rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-orange-accent)'
          }}
        >
          {agent.activeListingsCount} {lang === 'es' ? 'Listados Activos' : 'Active Listings'}
        </span>
      </div>

      {/* Portrait Photo with Luxury Framing */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1/1.15',
          overflow: 'hidden',
          backgroundColor: 'var(--color-charcoal-900)'
        }}
      >
        <img
          src={agent.photoUrl}
          alt={agent.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)'
          }}
        />

        {/* Ambient Dark Gradient at bottom */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, transparent 60%, rgba(12, 13, 16, 0.75) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Bilingual / Experience Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1.25rem',
            display: 'flex',
            gap: '0.4rem'
          }}
        >
          {agent.languages.map((l) => (
            <span
              key={l}
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(18, 20, 24, 0.8)',
                color: '#FFFFFF',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-xs)',
                backdropFilter: 'blur(4px)'
              }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Content Bio & Specialties */}
      <div
        style={{
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          gap: '1.25rem'
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.45rem',
              fontWeight: 500,
              lineHeight: 1.2,
              marginBottom: '0.25rem',
              color: 'var(--text-primary)'
            }}
          >
            {agent.name}
          </h3>

          <p
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-orange-accent)',
              marginBottom: '0.75rem'
            }}
          >
            {agent.title}
          </p>

          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {agent.bio}
          </p>
        </div>

        {/* Specialties Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {agent.specialties.slice(0, 3).map((spec, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.7rem',
                padding: '0.2rem 0.55rem',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-xs)'
              }}
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Action Button Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <span
            style={{
              fontSize: '0.775rem',
              fontFamily: 'monospace',
              color: 'var(--text-muted)'
            }}
          >
            {agent.phone}
          </span>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isHovered ? 'var(--color-orange-accent)' : 'var(--color-burgundy-primary)'
            }}
          >
            <span>{lang === 'es' ? 'Ver Perfil' : 'View Profile'}</span>
            <ArrowUpRight
              size={15}
              style={{
                transform: isHovered ? 'translate(2px, -2px)' : 'none',
                transition: 'transform var(--transition-fast)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
