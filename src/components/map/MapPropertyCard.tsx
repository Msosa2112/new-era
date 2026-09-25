import React, { useState } from 'react';
import { Property } from '../../types/property';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowUpRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { propertyService } from '../../services/propertyService';

export interface MapPropertyCardProps {
  property: Property;
  isSelected?: boolean;
  isHovered?: boolean;
  isSaved?: boolean;
  onSelect: (property: Property) => void;
  onOpenDetail: (property: Property) => void;
  onToggleSave?: (propertyId: string) => void;
  onHover?: (id: string | null) => void;
  onClose?: () => void;
  lang: 'en' | 'es';
  viewMode?: 'list' | 'grid';
  compact?: boolean;
}

export const MapPropertyCard: React.FC<MapPropertyCardProps> = ({
  property,
  isSelected = false,
  isHovered = false,
  isSaved = false,
  onSelect,
  onOpenDetail,
  onToggleSave,
  onHover,
  onClose,
  lang,
  viewMode = 'list',
  compact = false
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const agent = propertyService.getAgentById(property.agentId);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  const formattedSqft = new Intl.NumberFormat('en-US').format(property.sqft);
  const photos =
    property.media && property.media.length > 0
      ? property.media.map((m) => m.url)
      : ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=85'];

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) onToggleSave(property.id);
  };

  // Compact Mobile Floating Card Layout
  if (compact) {
    return (
      <article
        id={`map-card-${property.id}`}
        onClick={() => onSelect(property)}
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: isSelected
            ? '2px solid var(--color-burgundy-primary, #660E1A)'
            : '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 16px 36px rgba(10, 11, 14, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          cursor: 'pointer',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Dismiss Button */}
        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              zIndex: 40,
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 17, 21, 0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label={lang === 'es' ? 'Cerrar' : 'Close'}
          >
            <X size={13} />
          </button>
        )}

        {/* Thumbnail with carousel indicator */}
        <div
          style={{
            position: 'relative',
            width: '130px',
            minWidth: '130px',
            height: '118px',
            backgroundColor: '#121418',
            overflow: 'hidden'
          }}
        >
          <img
            src={photos[currentPhotoIndex]}
            alt={property.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              top: '6px',
              left: '6px',
              padding: '2px 6px',
              backgroundColor: 'rgba(10, 11, 14, 0.78)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              fontSize: '8px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              borderRadius: '3px'
            }}
          >
            {property.status}
          </div>
        </div>

        {/* Info */}
        <div
          style={{
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            minWidth: 0
          }}
        >
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0C0D10', lineHeight: 1.15 }}>
              {formattedPrice}
            </div>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#121418',
                margin: '3px 0 2px 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {property.title}
            </h4>
            <div
              style={{
                fontSize: '0.74rem',
                color: '#5A606D',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {property.location.city}, {property.location.state}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '6px',
              borderTop: '1px solid #F3EFE8',
              marginTop: '4px'
            }}
          >
            <span style={{ fontSize: '0.73rem', fontWeight: 600, color: '#3A414E' }}>
              {property.bedrooms} {lang === 'es' ? 'hab' : 'bd'} · {property.bathrooms} {lang === 'es' ? 'ba' : 'ba'} · {formattedSqft} sf
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(property);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '4px 8px',
                backgroundColor: 'var(--color-burgundy-primary, #660E1A)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span>{lang === 'es' ? 'Ver' : 'View'}</span>
              <ArrowUpRight size={11} />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Standard Feed Card (List or Grid)
  const isGrid = viewMode === 'grid';

  return (
    <article
      id={`map-card-${property.id}`}
      className="newera-map-property-card"
      onClick={() => onSelect(property)}
      onMouseEnter={() => onHover && onHover(property.id)}
      onMouseLeave={() => onHover && onHover(null)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: isSelected
          ? '2px solid var(--color-burgundy-primary, #660E1A)'
          : isHovered
          ? '2px solid rgba(102, 14, 26, 0.4)'
          : '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: isSelected
          ? '0 12px 28px rgba(102, 14, 26, 0.18), 0 0 0 1px var(--color-burgundy-primary, #660E1A)'
          : isHovered
          ? '0 12px 26px rgba(18, 20, 24, 0.1)'
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        transition: 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1), box-shadow 200ms ease, border-color 200ms ease',
        transform: isHovered || isSelected ? 'translateY(-2px)' : 'none',
        position: 'relative',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Selected Indicator Pill */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '48px', // Positioned left of the favorite heart button
            zIndex: 25,
            backgroundColor: 'var(--color-burgundy-primary, #660E1A)',
            color: '#FFFFFF',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            padding: '4px 8px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35)'
          }}
        >
          <CheckCircle2 size={10} color="#FFFFFF" />
          <span>{lang === 'es' ? 'EN MAPA' : 'ON MAP'}</span>
        </div>
      )}

      {/* Image Area with In-Card Carousel */}
      <div
        className="card-media-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          height: isGrid ? '160px' : '190px',
          backgroundColor: '#121418',
          overflow: 'hidden'
        }}
      >
        <img
          src={photos[currentPhotoIndex]}
          alt={`${property.title} - Photo ${currentPhotoIndex + 1}`}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 360ms cubic-bezier(0.32, 0.72, 0, 1)',
            transform: isHovered ? 'scale(1.02)' : 'scale(1)'
          }}
        />

        {/* Soft Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(18, 20, 24, 0.45) 0%, transparent 40%, rgba(18, 20, 24, 0.25) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Status Badge */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 20,
            padding: '3px 8px',
            backgroundColor: 'rgba(12, 13, 16, 0.82)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {property.status}
        </div>

        {/* Heart / Save Favorite Button */}
        <button
          type="button"
          onClick={handleSaveClick}
          className={`card-heart-btn ${isSaved ? 'is-saved' : ''}`}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 30,
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: isSaved ? '#FFFFFF' : 'rgba(12, 13, 16, 0.65)',
            backdropFilter: 'blur(8px)',
            border: isSaved ? '1px solid var(--color-burgundy-primary, #660E1A)' : '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isSaved ? 'var(--color-burgundy-primary, #660E1A)' : '#FFFFFF',
            cursor: 'pointer',
            padding: 0,
            transition: 'transform 180ms ease, background-color 180ms ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
          }}
          aria-label={isSaved ? (lang === 'es' ? 'Guardada en favoritos' : 'Saved to favorites') : (lang === 'es' ? 'Guardar propiedad' : 'Save property')}
          title={isSaved ? (lang === 'es' ? 'Guardada en favoritos' : 'Saved to favorites') : (lang === 'es' ? 'Guardar propiedad' : 'Save property')}
        >
          <Heart
            size={14}
            fill={isSaved ? 'var(--color-burgundy-primary, #660E1A)' : 'none'}
            strokeWidth={2.2}
          />
        </button>

        {/* Carousel Navigation Chevrons (Shown when property has multiple photos) */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevPhoto}
              className="carousel-chevron-btn chevron-left"
              style={{
                position: 'absolute',
                top: '50%',
                left: '8px',
                transform: 'translateY(-50%)',
                zIndex: 25,
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                border: 'none',
                color: '#121418',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                padding: 0
              }}
              aria-label={lang === 'es' ? 'Foto anterior' : 'Previous photo'}
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={handleNextPhoto}
              className="carousel-chevron-btn chevron-right"
              style={{
                position: 'absolute',
                top: '50%',
                right: '8px',
                transform: 'translateY(-50%)',
                zIndex: 25,
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                border: 'none',
                color: '#121418',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                padding: 0
              }}
              aria-label={lang === 'es' ? 'Foto siguiente' : 'Next photo'}
            >
              <ChevronRight size={15} />
            </button>

            {/* Carousel Dot Indicators */}
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                backgroundColor: 'rgba(10, 11, 14, 0.55)',
                backdropFilter: 'blur(4px)',
                padding: '3px 6px',
                borderRadius: '9999px'
              }}
            >
              {photos.map((_, idx) => (
                <span
                  key={idx}
                  style={{
                    width: idx === currentPhotoIndex ? '12px' : '4px',
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: idx === currentPhotoIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 200ms ease'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Property Details Content */}
      <div
        style={{
          padding: isGrid ? '11px 12px 13px 12px' : '13px 15px 15px 15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          backgroundColor: '#FFFFFF'
        }}
      >
        {/* Row 1: Bold Price & Property Type */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <span
            style={{
              fontSize: isGrid ? '1.24rem' : '1.38rem',
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
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: '#F8F5F0',
              color: 'var(--color-burgundy-primary, #660E1A)',
              border: '1px solid rgba(102, 14, 26, 0.1)',
              flexShrink: 0
            }}
          >
            {property.propertyType}
          </span>
        </div>

        {/* Row 2: Editorial Title */}
        <h3
          style={{
            fontSize: isGrid ? '0.88rem' : '0.96rem',
            fontWeight: 700,
            fontFamily: 'var(--font-serif, Georgia, serif)',
            color: 'var(--color-charcoal-900, #121418)',
            margin: 0,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          title={property.title}
        >
          {property.title}
        </h3>

        {/* Row 3: Location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.78rem',
            color: 'var(--text-secondary, #5A606D)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <MapPin size={12} color="var(--color-burgundy-primary, #660E1A)" style={{ flexShrink: 0 }} />
          <span>{property.location.neighborhood || property.location.city}, {property.location.state}</span>
        </div>

        {/* Row 4: Clean Facts Row (Beds · Baths · SqFt) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--color-charcoal-800, #1F242D)',
            paddingTop: '6px',
            borderTop: '1px solid #F3EFE8',
            marginTop: '2px'
          }}
        >
          <span><strong>{property.bedrooms}</strong> {lang === 'es' ? 'hab' : 'beds'}</span>
          <span style={{ color: '#D1C9BE' }}>&bull;</span>
          <span><strong>{property.bathrooms}</strong> {lang === 'es' ? 'baños' : 'baths'}</span>
          <span style={{ color: '#D1C9BE' }}>&bull;</span>
          <span><strong>{formattedSqft}</strong> sq ft</span>
        </div>

        {/* Row 5: Subtle Advisor / Details Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '6px',
            marginTop: '1px'
          }}
        >
          {agent ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
              <img
                src={agent.photoNobgUrl || agent.photoUrl}
                alt={agent.name}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  backgroundColor: '#F3EFE8'
                }}
              />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#6E7480',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {agent.name.split(' ')[0]} {agent.name.split(' ')[1]?.[0]}.
              </span>
            </div>
          ) : (
            <span style={{ fontSize: '0.7rem', color: '#8E877E' }}>MLS #{property.mls?.mlsId}</span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(property);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              padding: '4px 9px',
              backgroundColor: 'transparent',
              color: 'var(--color-burgundy-primary, #660E1A)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.74rem',
              fontWeight: 700,
              border: '1px solid rgba(102, 14, 26, 0.2)',
              cursor: 'pointer',
              transition: 'all 160ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-burgundy-primary, #660E1A)';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = 'var(--color-burgundy-primary, #660E1A)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-burgundy-primary, #660E1A)';
              e.currentTarget.style.borderColor = 'rgba(102, 14, 26, 0.2)';
            }}
          >
            <span>{lang === 'es' ? 'Ver Detalles' : 'View Details'}</span>
            <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </article>
  );
};
