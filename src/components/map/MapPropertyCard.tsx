import React from 'react';
import { Property } from '../../types/property';
import { Bed, Bath, Square, MapPin, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { propertyService } from '../../services/propertyService';

interface MapPropertyCardProps {
  property: Property;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect: (property: Property) => void;
  onOpenDetail: (property: Property) => void;
  onHover?: (id: string | null) => void;
  lang: 'en' | 'es';
  compact?: boolean;
}

export const MapPropertyCard: React.FC<MapPropertyCardProps> = ({
  property,
  isSelected = false,
  isHovered = false,
  onSelect,
  onOpenDetail,
  onHover,
  lang,
  compact = false
}) => {
  const agent = propertyService.getAgentById(property.agentId);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  const formattedSqft = new Intl.NumberFormat('en-US').format(property.sqft);
  const primaryMedia = property.media.find(m => m.isPrimary) || property.media[0];
  const photoUrl = primaryMedia?.url || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=85';

  return (
    <article
      id={`map-card-${property.id}`}
      onClick={() => onSelect(property)}
      onMouseEnter={() => onHover && onHover(property.id)}
      onMouseLeave={() => onHover && onHover(null)}
      style={{
        display: 'flex',
        flexDirection: compact ? 'row' : 'column',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        overflow: 'hidden',
        border: isSelected
          ? '2px solid var(--color-burgundy-primary, #660E1A)'
          : isHovered
          ? '2px solid rgba(102, 14, 26, 0.45)'
          : '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: isSelected
          ? '0 12px 28px rgba(102, 14, 26, 0.2), 0 0 0 1px var(--color-burgundy-primary, #660E1A)'
          : isHovered
          ? '0 10px 24px rgba(18, 20, 24, 0.12)'
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        transition: 'all 240ms cubic-bezier(0.32, 0.72, 0, 1)',
        transform: isHovered || isSelected ? 'translateY(-2px)' : 'none',
        position: 'relative',
        flexShrink: 0, // CRITICAL: NEVER ALLOW FLEXBOX TO SQUISH THE CARD
        boxSizing: 'border-box'
      }}
    >
      {/* Selected Active Indicator Pill */}
      {isSelected && !compact && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            backgroundColor: 'var(--color-burgundy-primary, #660E1A)',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            padding: '4px 9px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
        >
          <CheckCircle2 size={11} color="#FFFFFF" />
          <span>{lang === 'es' ? 'SELECCIONADA' : 'ON MAP'}</span>
        </div>
      )}

      {/* House Photo Container */}
      <div
        style={{
          position: 'relative',
          width: compact ? '135px' : '100%',
          height: compact ? '115px' : '205px',
          flexShrink: 0,
          backgroundColor: '#121418',
          overflow: 'hidden'
        }}
      >
        <img
          src={photoUrl}
          alt={property.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 400ms cubic-bezier(0.32, 0.72, 0, 1)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />

        {/* Soft Vignette Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(18, 20, 24, 0.5) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />

        {/* Status Tag */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            padding: '3px 8px',
            backgroundColor: 'rgba(12, 13, 16, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}
        >
          {property.status}
        </div>

        {/* Highlight Price directly on photo for compact cards */}
        {compact && (
          <div
            style={{
              position: 'absolute',
              bottom: '6px',
              left: '8px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.85)',
              letterSpacing: '-0.02em'
            }}
          >
            {formattedPrice}
          </div>
        )}
      </div>

      {/* Property Details Content */}
      <div
        style={{
          padding: compact ? '10px 12px' : '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          minWidth: 0,
          backgroundColor: '#FFFFFF'
        }}
      >
        <div>
          {/* Large Price for standard card */}
          {!compact && (
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}
            >
              <span
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: 'var(--color-charcoal-950, #0C0D10)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1
                }}
              >
                {formattedPrice}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--color-burgundy-primary, #660E1A)',
                  letterSpacing: '0.04em'
                }}
              >
                {property.propertyType}
              </span>
            </div>
          )}

          {/* Title */}
          <h3
            style={{
              fontSize: compact ? '0.88rem' : '1.02rem',
              fontWeight: 700,
              color: 'var(--color-charcoal-900, #121418)',
              margin: '0 0 6px 0',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Location Address */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary, #5A606D)',
              marginBottom: compact ? '6px' : '12px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <MapPin size={13} color="var(--color-burgundy-primary, #660E1A)" style={{ flexShrink: 0 }} />
            <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
          </div>
        </div>

        {/* Specs & Agent / Action Bar */}
        <div>
          {/* Key Specs: Beds, Baths, SqFt */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-charcoal-700, #272C35)',
              padding: '8px 0',
              borderTop: '1px solid #F3EFE8',
              borderBottom: compact ? 'none' : '1px solid #F3EFE8',
              marginBottom: compact ? '0' : '12px'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bed size={14} color="#847C74" />
              <strong>{property.bedrooms}</strong> {lang === 'es' ? 'Hab' : 'Beds'}
            </span>
            <span>&bull;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bath size={14} color="#847C74" />
              <strong>{property.bathrooms}</strong> {lang === 'es' ? 'Baños' : 'Baths'}
            </span>
            <span>&bull;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Square size={14} color="#847C74" />
              <strong>{formattedSqft}</strong> Sq Ft
            </span>
          </div>

          {/* Action Row */}
          {!compact && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              {/* Agent info */}
              {agent ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                  <img
                    src={agent.photoNobgUrl || agent.photoUrl}
                    alt={agent.name}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#EFECE6'
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary, #5A606D)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {agent.name}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: '0.72rem', color: '#847C74' }}>MLS #{property.mls?.mlsId}</span>
              )}

              {/* View Details Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(property);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '7px 13px',
                  backgroundColor: 'var(--color-charcoal-950, #0C0D10)',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 200ms ease, transform 200ms ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-burgundy-primary, #660E1A)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-charcoal-950, #0C0D10)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <span>{lang === 'es' ? 'Ver Detalles' : 'View Details'}</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          )}

          {/* For compact mobile cards, show compact button */}
          {compact && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(property);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  backgroundColor: 'var(--color-burgundy-primary, #660E1A)',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span>{lang === 'es' ? 'Ver Detalles' : 'Details'}</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
