import React, { useState } from 'react';
import { Phone, Mail, ArrowUpRight, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { Agent } from '../../types/property';
import { NewEraIcon } from '../common/NewEraIcon';

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

  const isPrincipal = agent.id === 'yeilen-contreras' || agent.title.toLowerCase().includes('principal');
  const hasPhoto = Boolean(agent.photoNobgUrl || agent.photoUrl);
  const photoSrc = agent.photoNobgUrl || agent.photoUrl;

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <article
      onClick={() => onSelectAgent(agent)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="newera-agent-card reveal-on-scroll"
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        border: isHovered
          ? '1.5px solid var(--color-burgundy-primary, #660E1A)'
          : '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: 'var(--radius-md, 8px)',
        overflow: 'hidden',
        transition: 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'none',
        boxShadow: isHovered
          ? '0 22px 44px -12px rgba(102, 14, 26, 0.18), 0 2px 8px rgba(0, 0, 0, 0.04)'
          : '0 2px 10px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        height: '100%'
      }}
    >
      {/* 1. PORTRAIT CONTAINER WITH LIGHT LUXURY STUDIO BACKDROP */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1.15',
          overflow: 'hidden',
          backgroundColor: '#F4F5F7',
          background: 'radial-gradient(circle at 50% 30%, #FFFFFF 0%, #E8EBEF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Top Badges Ribbon */}
        <div
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            right: '0.85rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}
        >
          {/* Role Badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: isPrincipal ? 'var(--color-burgundy-primary, #660E1A)' : '#FFFFFF',
              color: isPrincipal ? '#FFFFFF' : '#111827',
              border: isPrincipal ? '1px solid #660E1A' : '1px solid rgba(0, 0, 0, 0.12)',
              backdropFilter: 'blur(8px)',
              fontSize: '0.65rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.22rem 0.55rem',
              borderRadius: '4px',
              boxShadow: isPrincipal
                ? '0 2px 8px rgba(102, 14, 26, 0.35)'
                : '0 2px 6px rgba(0, 0, 0, 0.06)'
            }}
          >
            <NewEraIcon color={isPrincipal ? "#FFFFFF" : "#660E1A"} size={11} />
            <span>{isPrincipal ? (lang === 'es' ? 'Broker Principal' : 'Principal Broker') : 'REALTOR®'}</span>
          </span>

          {/* Index Pill */}
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#4B5563',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}
          >
            #{formattedIndex}
          </span>
        </div>

        {/* Ambient Halo Glow on Hover */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '75%',
            height: '75%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102, 14, 26, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            filter: 'blur(20px)',
            opacity: isHovered ? 1 : 0.4,
            transition: 'opacity 0.4s ease'
          }}
        />

        {hasPhoto ? (
          <>
            {/* Advisor Photo */}
            <img
              src={photoSrc}
              alt={agent.name}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: agent.photoNobgUrl ? 'contain' : 'cover',
                objectPosition: agent.photoNobgUrl ? 'bottom center' : 'center top',
                display: 'block',
                transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s ease',
                transform: isHovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
                filter: isHovered
                  ? 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.16))'
                  : 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.1))',
                zIndex: 2,
                position: 'relative'
              }}
            />
            {/* Bottom Ambient Gradient (Light) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 72%, rgba(255, 255, 255, 0.95) 100%)',
                pointerEvents: 'none',
                zIndex: 3
              }}
            />
          </>
        ) : (
          /* LUXURY NO-PHOTO PLACEHOLDER (CLEAN MONOGRAM & INITIALS) */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              padding: '2rem 1rem',
              position: 'relative',
              zIndex: 2,
              userSelect: 'none'
            }}
          >
            {/* Subtle Watermark */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.05,
                pointerEvents: 'none'
              }}
            >
              <NewEraIcon color="#660E1A" size={130} />
            </div>

            {/* Initials Luxury Badge */}
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '2px solid rgba(102, 14, 26, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isHovered
                  ? '0 12px 28px rgba(102, 14, 26, 0.15)'
                  : '0 6px 18px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                marginBottom: '0.85rem'
              }}
            >
              <span
                style={{
                  fontFamily: 'serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: '#660E1A',
                  letterSpacing: '0.04em'
                }}
              >
                {getInitials(agent.name)}
              </span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '20px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(102, 14, 26, 0.15)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
              }}
            >
              <NewEraIcon color="#660E1A" size={10} />
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#660E1A'
                }}
              >
                {lang === 'es' ? 'Asesor New Era' : 'New Era Advisor'}
              </span>
            </div>
          </div>
        )}

        {/* Floating License & Language Badges at Base */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.85rem',
            right: '0.85rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 4
          }}
        >
          {agent.licenseNumber ? (
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: '#374151',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                padding: '0.2rem 0.5rem',
                borderRadius: '3px',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
              }}
            >
              KY Lic. #{agent.licenseNumber}
            </span>
          ) : <span />}

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {agent.languages.map((langCode) => (
              <span
                key={langCode}
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  backgroundColor: '#660E1A',
                  color: '#FFFFFF',
                  padding: '0.18rem 0.45rem',
                  borderRadius: '3px',
                  boxShadow: '0 2px 6px rgba(102, 14, 26, 0.25)'
                }}
              >
                {langCode === 'Spanish' || langCode === 'Español' ? 'ES' : 'EN'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ADVISOR BODY INFO */}
      <div
        style={{
          padding: '1.25rem 1.25rem 1.35rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          gap: '0.85rem'
        }}
      >
        <div>
          {/* Name */}
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '0.2rem',
              color: '#111827',
              letterSpacing: '-0.01em'
            }}
          >
            {agent.name}
          </h3>

          {/* Title */}
          <p
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--color-burgundy-primary, #660E1A)',
              marginBottom: '0.65rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={agent.title}
          >
            {agent.title}
          </p>

          {/* Bio snippet */}
          <p
            style={{
              fontSize: '0.82rem',
              color: '#4B5563',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              margin: 0
            }}
          >
            {agent.bio}
          </p>
        </div>

        {/* Specialties Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {agent.specialties.slice(0, 2).map((spec, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                padding: '0.2rem 0.5rem',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                borderRadius: '3px',
                border: '1px solid rgba(0, 0, 0, 0.04)'
              }}
            >
              {spec}
            </span>
          ))}
          {agent.yearsExperience > 0 && (
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                padding: '0.2rem 0.5rem',
                backgroundColor: 'rgba(102, 14, 26, 0.06)',
                color: 'var(--color-burgundy-primary, #660E1A)',
                borderRadius: '3px'
              }}
            >
              {agent.yearsExperience} {lang === 'es' ? 'Años Exp.' : 'Yrs Exp.'}
            </span>
          )}
        </div>

        {/* Footer Contact & Action Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid #F3F4F6',
            marginTop: '0.25rem'
          }}
        >
          <a
            href={`tel:${agent.phone.replace(/[^0-9]/g, '')}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.76rem',
              fontFamily: 'monospace',
              fontWeight: 600,
              color: '#4B5563',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-burgundy-primary, #660E1A)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
          >
            <Phone size={12} color="var(--color-burgundy-primary, #660E1A)" />
            <span>{agent.phone}</span>
          </a>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: isHovered ? '#E64A2A' : 'var(--color-burgundy-primary, #660E1A)',
              transition: 'color 0.2s ease',
              flexShrink: 0
            }}
          >
            <span>{lang === 'es' ? 'Ver Perfil' : 'Profile'}</span>
            <ArrowUpRight
              size={13}
              style={{
                transform: isHovered ? 'translate(2px, -2px)' : 'none',
                transition: 'transform 0.2s ease'
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
};
