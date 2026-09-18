import React, { useState } from 'react';
import { ArrowUpRight, Bed, Bath, Square, MapPin } from 'lucide-react';
import { Property } from '../../types/property';
import { propertyService } from '../../services/propertyService';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  lang: 'en' | 'es';
  priority?: boolean;
  staggerIndex?: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  lang,
  priority = false,
  staggerIndex
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const agent = propertyService.getAgentById(property.agentId);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  const formattedSqft = new Intl.NumberFormat('en-US').format(property.sqft);

  // Clean short address for compact mobile cards
  const shortAddress = `${property.location.address}, ${property.location.city}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // Only on fine-pointer devices (desktop mouse)
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;
    
    setTilt({
      x: -normY * 3.5,
      y: normX * 3.5,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const staggerClass = staggerIndex ? `stagger-${Math.min(staggerIndex, 6)}` : '';

  return (
    <article
      onClick={() => onSelect(property)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`property-card reveal-on-scroll ${staggerClass}`}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'transform 320ms var(--ease-out-fluid), box-shadow 320ms var(--ease-out-fluid), border-color 260ms ease, opacity 600ms var(--ease-out-fluid)',
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
        boxShadow: isHovered ? '0 20px 40px -10px rgba(17, 24, 39, 0.16)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        willChange: 'transform, opacity'
      }}
    >
      {/* Specular lighting glare overlay on luxury hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.16) 0%, transparent 65%)`,
            zIndex: 10,
            borderRadius: '12px'
          }}
        />
      )}
      {/* 1. MEDIA CONTAINER */}
      <div
        className="property-card-image-wrap"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          overflow: 'hidden',
          backgroundColor: '#111827'
        }}
      >
        <img
          src={property.media[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'}
          alt={property.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)'
          }}
          loading={priority ? 'eager' : 'lazy'}
        />

        {/* Cinematic Bottom Gradient Overlay for Legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, transparent 45%, rgba(0, 0, 0, 0.7) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Status Badge (Top-Left) */}
        <div
          className="property-card-badges"
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            zIndex: 2
          }}
        >
          <span
            className="property-card-badge-status"
            style={{
              backgroundColor: 'rgba(17, 24, 39, 0.82)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.22rem 0.55rem',
              borderRadius: '4px'
            }}
          >
            {property.status}
          </span>
        </div>

        {/* Price Floating (Bottom-Left) */}
        <div
          className="property-card-price-wrap"
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.85rem',
            zIndex: 2
          }}
        >
          <div
            className="property-card-price"
            style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#FFFFFF',
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}
          >
            {formattedPrice}
          </div>
        </div>

        {/* MLS Code Indicator (Desktop only) */}
        <div
          className="property-card-mls"
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.85rem',
            fontFamily: 'monospace',
            fontSize: '0.65rem',
            color: 'rgba(255, 255, 255, 0.8)',
            background: 'rgba(0, 0, 0, 0.45)',
            padding: '0.15rem 0.45rem',
            borderRadius: '4px',
            backdropFilter: 'blur(4px)'
          }}
        >
          MLS #{property.mls.mlsId}
        </div>
      </div>

      {/* 2. CARD CONTENT HIERARCHY */}
      <div
        className="property-card-body"
        style={{
          padding: '1.15rem 1.25rem 1.25rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          gap: '0.85rem'
        }}
      >
        <div>
          {/* Neighborhood Subtitle */}
          <div
            className="property-card-location"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#660E1A',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.25rem'
            }}
          >
            <MapPin size={11} color="#660E1A" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {property.location.neighborhood || property.location.city}, {property.location.state}
            </span>
          </div>

          {/* Property Title (Bold & Editorial) */}
          <h3
            className="property-card-title"
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#111827',
              lineHeight: 1.25,
              margin: '0 0 0.25rem 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Clean Address */}
          <p
            className="property-card-address"
            style={{
              fontSize: '0.78rem',
              color: '#6B7280',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={shortAddress}
          >
            {shortAddress}
          </p>
        </div>

        {/* 3. SPECS METADATA STRIP */}
        <div
          className="property-card-specs"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid #F3F4F6',
            fontSize: '0.78rem',
            color: '#4B5563',
            fontWeight: 500
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Bed size={13} color="#660E1A" />
            <span>{property.bedrooms} {lang === 'es' ? 'Hab' : 'Beds'}</span>
          </div>

          <span className="property-card-spec-dot" style={{ color: '#D1D5DB' }}>•</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Bath size={13} color="#660E1A" />
            <span>{property.bathrooms} {lang === 'es' ? 'Baños' : 'Baths'}</span>
          </div>

          <span className="property-card-spec-dot" style={{ color: '#D1D5DB' }}>•</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Square size={13} color="#660E1A" />
            <span>{formattedSqft} sqft</span>
          </div>
        </div>

        {/* 4. FOOTER: AGENT & ACTION */}
        <div
          className="property-card-footer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.65rem',
            borderTop: '1px solid #F9FAFB'
          }}
        >
          {agent ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
              <img
                src={agent.photoUrl}
                alt={agent.name}
                className="property-card-agent-avatar"
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid rgba(102, 14, 26, 0.4)',
                  flexShrink: 0
                }}
              />
              <span
                className="property-card-agent-name"
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#374151',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {agent.name.split(' ')[0]} {agent.name.split(' ')[1]?.[0] ? `${agent.name.split(' ')[1][0]}.` : ''}
              </span>
            </div>
          ) : (
            <span
              className="property-card-agent-name"
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#6B7280',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              New Era
            </span>
          )}

          <div
            className="property-card-action-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: isHovered ? '#E64A2A' : '#660E1A',
              transition: 'color 0.2s ease',
              flexShrink: 0
            }}
          >
            <span>{lang === 'es' ? 'Ver' : 'View'}</span>
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
