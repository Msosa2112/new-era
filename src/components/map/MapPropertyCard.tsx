import React from 'react';
import { Property } from '../../types/property';
import { Bed, Bath, Square, MapPin, ArrowUpRight } from 'lucide-react';
import { propertyService } from '../../services/propertyService';

interface MapPropertyCardProps {
  property: Property;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect: (property: Property) => void;
  onHover?: (id: string | null) => void;
  lang: 'en' | 'es';
  compact?: boolean;
}

export const MapPropertyCard: React.FC<MapPropertyCardProps> = ({
  property,
  isSelected = false,
  isHovered = false,
  onSelect,
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
  const photoUrl = primaryMedia?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

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
        borderRadius: '10px',
        overflow: 'hidden',
        border: isSelected
          ? '2px solid var(--color-burgundy-primary, #660E1A)'
          : isHovered
          ? '2px solid rgba(102, 14, 26, 0.4)'
          : '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: isSelected
          ? '0 12px 30px rgba(102, 14, 26, 0.18)'
          : isHovered
          ? '0 8px 24px rgba(0, 0, 0, 0.12)'
          : '0 2px 6px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        transition: 'all 240ms cubic-bezier(0.32, 0.72, 0, 1)',
        transform: isHovered || isSelected ? 'translateY(-2px)' : 'none',
        position: 'relative'
      }}
    >
      {/* Photo Container */}
      <div
        style={{
          position: 'relative',
          width: compact ? '140px' : '100%',
          height: compact ? '120px' : '180px',
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
            transition: 'transform 360ms ease',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)'
          }}
        />

        {/* Status Pill */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            padding: '2px 8px',
            backgroundColor: 'rgba(10, 11, 14, 0.8)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.16)'
          }}
        >
          {property.status}
        </div>

        {/* Highlight Price on Thumbnail for compact view */}
        {compact && (
          <div
            style={{
              position: 'absolute',
              bottom: '6px',
              left: '6px',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)'
            }}
          >
            {formattedPrice}
          </div>
        )}
      </div>

      {/* Content Info */}
      <div
        style={{
          padding: compact ? '10px 12px' : '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          minWidth: 0
        }}
      >
        <div>
          {!compact && (
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--color-charcoal-950, #0C0D10)',
                letterSpacing: '-0.02em',
                marginBottom: '4px'
              }}
            >
              {formattedPrice}
            </div>
          )}

          <h3
            style={{
              fontSize: compact ? '0.85rem' : '0.95rem',
              fontWeight: 700,
              color: 'var(--color-charcoal-900, #121418)',
              margin: '0 0 4px 0',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {property.title}
          </h3>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary, #5A606D)',
              marginBottom: compact ? '6px' : '10px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <MapPin size={12} color="var(--color-burgundy-primary, #660E1A)" style={{ flexShrink: 0 }} />
            <span>{property.location.address}, {property.location.city}</span>
          </div>
        </div>

        {/* Specs & Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: compact ? '4px' : '8px',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            fontSize: '0.75rem',
            color: 'var(--color-charcoal-700, #272C35)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Bed size={13} color="#847C74" />
              <strong>{property.bedrooms}</strong> {lang === 'es' ? 'hab' : 'bd'}
            </span>
            <span>&bull;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Bath size={13} color="#847C74" />
              <strong>{property.bathrooms}</strong> {lang === 'es' ? 'ba' : 'ba'}
            </span>
            <span>&bull;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Square size={13} color="#847C74" />
              <strong>{formattedSqft}</strong> sqft
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              color: 'var(--color-burgundy-primary, #660E1A)',
              fontWeight: 700,
              fontSize: '0.75rem'
            }}
          >
            <span>{lang === 'es' ? 'Ver' : 'Details'}</span>
            <ArrowUpRight size={13} />
          </div>
        </div>
      </div>
    </article>
  );
};
