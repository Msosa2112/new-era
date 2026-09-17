import React, { useState } from 'react';
import { ArrowUpRight, Bed, Bath, Square, MapPin } from 'lucide-react';
import { Property } from '../../types/property';
import { propertyService } from '../../services/propertyService';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  lang: 'en' | 'es';
  priority?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  lang,
  priority = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const agent = propertyService.getAgentById(property.agentId);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  const formattedSqft = new Intl.NumberFormat('en-US').format(property.sqft);

  return (
    <article
      onClick={() => onSelect(property)}
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
      {/* Editorial Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          overflow: 'hidden',
          backgroundColor: 'var(--color-charcoal-900)'
        }}
      >
        <img
          src={property.media[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'}
          alt={property.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
          loading={priority ? 'eager' : 'lazy'}
        />

        {/* Ambient Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, transparent 40%, rgba(12, 13, 16, 0.6) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Status Badge */}
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 2
          }}
        >
          <span
            className="tag-badge"
            style={{
              backgroundColor: 'rgba(18, 20, 24, 0.85)',
              color: '#FFFFFF',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(6px)'
            }}
          >
            {property.status}
          </span>
          <span
            className="tag-badge tag-badge-accent"
            style={{ backdropFilter: 'blur(6px)' }}
          >
            {property.propertyType}
          </span>
        </div>

        {/* Price Floating Pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.25rem',
            left: '1.25rem',
            zIndex: 2
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              letterSpacing: '-0.02em'
            }}
          >
            {formattedPrice}
          </div>
        </div>

        {/* MLS Code Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.25rem',
            right: '1.25rem',
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            color: 'rgba(255, 255, 255, 0.7)',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-xs)',
            backdropFilter: 'blur(4px)'
          }}
        >
          MLS #{property.mls.mlsId}
        </div>
      </div>

      {/* Property Details Content */}
      <div
        style={{
          padding: '1.5rem 1.75rem 1.75rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          gap: '1.25rem'
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-orange-accent)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '0.35rem'
            }}
          >
            <MapPin size={12} />
            <span>{property.location.neighborhood}, {property.location.city}</span>
          </div>

          <h3
            style={{
              fontSize: '1.35rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.25,
              marginBottom: '0.35rem'
            }}
          >
            {property.title}
          </h3>

          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}
          </p>
        </div>

        {/* Architectural Specs Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bed size={15} color="var(--color-burgundy-primary)" />
            <span>{property.bedrooms} {lang === 'es' ? 'Hab' : 'Beds'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bath size={15} color="var(--color-burgundy-primary)" />
            <span>{property.bathrooms} {lang === 'es' ? 'Baños' : 'Baths'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Square size={15} color="var(--color-burgundy-primary)" />
            <span>{formattedSqft} Sq Ft</span>
          </div>
        </div>

        {/* Footer Action & Agent Attribution */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem'
          }}
        >
          {agent ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <img
                src={agent.photoUrl}
                alt={agent.name}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--color-burgundy-primary)'
                }}
              />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {agent.name}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              New Era Signature
            </span>
          )}

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isHovered ? 'var(--color-orange-accent)' : 'var(--color-burgundy-primary)',
              transition: 'color var(--transition-fast)'
            }}
          >
            <span>{lang === 'es' ? 'Ver Propiedad' : 'View Property'}</span>
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
    </article>
  );
};
