import React, { useState, useEffect, useRef } from 'react';
import { Property, PropertyFilter } from '../types/property';
import { propertyService } from '../services/propertyService';
import { PropertyMap } from '../components/map/PropertyMap';
import { MapPropertyCard } from '../components/map/MapPropertyCard';
import { HexPattern } from '../components/common/HexPattern';
import { useGooglePlacesAutocomplete } from '../hooks/useGooglePlacesAutocomplete';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  Map as MapIcon,
  X,
  RotateCcw,
  Building2,
  ChevronDown
} from 'lucide-react';

interface MapPageProps {
  onSelectProperty: (property: Property) => void;
  onNavigateToGrid: () => void;
  lang: 'en' | 'es';
}

export const MapPage: React.FC<MapPageProps> = ({
  onSelectProperty,
  onNavigateToGrid,
  lang
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<PropertyFilter>({
    transactionType: 'Buy',
    sortBy: 'newest'
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [mobileViewMode, setMobileViewMode] = useState<'map' | 'list'>('map');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  // Search input state and Google Places Autocomplete
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useGooglePlacesAutocomplete(searchInputRef, {
    onPlaceSelected: (place) => {
      const queryText = place.name || place.formattedAddress;
      setSearchQuery(queryText);
      setFilter(prev => ({ ...prev, query: queryText }));
    }
  });

  // Fetch properties based on active filters
  useEffect(() => {
    setLoading(true);
    propertyService.getProperties(filter).then((res) => {
      setProperties(res);
      setLoading(false);
      // If we don't have a selected property or the current one is filtered out, pick the first one
      if (res.length > 0) {
        setSelectedProperty((prev) => (prev && res.some(p => p.id === prev.id) ? prev : res[0]));
      } else {
        setSelectedProperty(null);
      }
    });
  }, [filter]);

  // Handle marker click: center property and scroll card into view
  const handleSelectFromMap = (property: Property) => {
    setSelectedProperty(property);
    const cardEl = document.getElementById(`map-card-${property.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Quick search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter(prev => ({ ...prev, query: searchQuery.trim() }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilter({ transactionType: 'Buy', sortBy: 'newest' });
  };

  return (
    <div
      style={{
        paddingTop: 'var(--header-height, 84px)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8F6F2',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top Filter & Control Bar */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '0.75rem 1.25rem',
          zIndex: 100,
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}
      >
        <div
          style={{
            maxWidth: '1600px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          {/* Left: Search input & Quick Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 420px' }}>
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F3EFE8',
                borderRadius: '8px',
                padding: '6px 12px',
                width: '100%',
                maxWidth: '360px',
                border: '1px solid rgba(0, 0, 0, 0.06)'
              }}
            >
              <Search size={15} color="#847C74" style={{ marginRight: '8px', flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'es' ? 'Buscar vecindario, dirección o ciudad...' : 'Search neighborhood, address, city...'}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.85rem',
                  color: '#121418',
                  width: '100%'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilter(prev => ({ ...prev, query: undefined }));
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}
                >
                  <X size={14} color="#847C74" />
                </button>
              )}
            </form>

            {/* Quick Property Type Selector */}
            <div className="hidden-mobile" style={{ display: 'flex', gap: '6px' }}>
              {(['All', 'Luxury Estate', 'Single Family', 'Modern Condo'] as const).map((type) => {
                const isActive = (filter.propertyType || 'All') === type;
                const label =
                  type === 'All'
                    ? (lang === 'es' ? 'Todas' : 'All Types')
                    : type === 'Luxury Estate'
                    ? (lang === 'es' ? 'Fincas' : 'Estates')
                    : type === 'Single Family'
                    ? (lang === 'es' ? 'Casas' : 'Houses')
                    : (lang === 'es' ? 'Condos' : 'Condos');

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilter(prev => ({ ...prev, propertyType: type }))}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: isActive
                        ? '1px solid var(--color-burgundy-primary, #660E1A)'
                        : '1px solid rgba(0, 0, 0, 0.08)',
                      backgroundColor: isActive ? 'var(--color-burgundy-primary, #660E1A)' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#3A414E',
                      cursor: 'pointer',
                      transition: 'all 160ms ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Results Count & View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#5A606D' }}>
              {loading ? (
                <span>{lang === 'es' ? 'Filtrando...' : 'Searching...'}</span>
              ) : (
                <span>
                  <strong>{properties.length}</strong> {lang === 'es' ? 'Propiedades en Louisville' : 'Homes on Map'}
                </span>
              )}
            </span>

            {/* Switch to Classic Grid Button */}
            <button
              type="button"
              onClick={onNavigateToGrid}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#121418',
                cursor: 'pointer',
                transition: 'all 160ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-burgundy-primary, #660E1A)';
                e.currentTarget.style.color = 'var(--color-burgundy-primary, #660E1A)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.color = '#121418';
              }}
            >
              <Grid size={14} />
              <span>{lang === 'es' ? 'Vista Cuadrícula' : 'Grid View'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0
        }}
      >
        {/* Left Side: Scrollable Listing Panel (Desktop & Tablet) */}
        <aside
          className={`map-list-sidebar ${mobileViewMode === 'list' ? 'mobile-visible' : 'mobile-hidden'}`}
          style={{
            width: '460px',
            minWidth: '400px',
            maxWidth: '500px',
            flex: '0 0 460px',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '1.25rem 1.25rem 2.5rem 1.25rem',
            backgroundColor: '#FAF8F5',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            zIndex: 10,
            boxSizing: 'border-box'
          }}
        >
          {/* Sidebar Top Status */}
          <div
            style={{
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-burgundy-primary, #660E1A)'
                }}
              >
                {lang === 'es' ? 'EXPLORACIÓN GEOGRÁFICA' : 'MLS MAP EXPLORER'}
              </span>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#121418', margin: '2px 0 0 0' }}>
                {properties.length} {lang === 'es' ? 'Residencias en Louisville' : 'Homes in Louisville Area'}
              </h2>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#847C74' }}>
              <div style={{ marginBottom: '1rem' }}>{lang === 'es' ? 'Cargando residencias...' : 'Loading architectural residences...'}</div>
            </div>
          ) : properties.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                flexShrink: 0
              }}
            >
              <Building2 size={36} color="#847C74" style={{ margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {lang === 'es' ? 'No hay resultados' : 'No properties in this view'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#5A606D', marginBottom: '1.25rem' }}>
                {lang === 'es'
                  ? 'Intenta restablecer los filtros para ver todas las residencias.'
                  : 'Try broadening your search query or reset the filters.'}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                <span>{lang === 'es' ? 'Restablecer Filtros' : 'Reset Filters'}</span>
              </button>
            </div>
          ) : (
            properties.map((prop) => (
              <MapPropertyCard
                key={prop.id}
                property={prop}
                isSelected={selectedProperty?.id === prop.id}
                isHovered={hoveredPropertyId === prop.id}
                onSelect={(p) => {
                  setSelectedProperty(p);
                  const cardEl = document.getElementById(`map-card-${p.id}`);
                  if (cardEl) {
                    cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }
                }}
                onOpenDetail={onSelectProperty}
                onHover={setHoveredPropertyId}
                lang={lang}
              />
            ))
          )}
        </aside>

        {/* Right Side: Interactive Leaflet Map */}
        <main
          className={`map-viewport-container ${mobileViewMode === 'map' ? 'mobile-visible' : 'mobile-hidden'}`}
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            position: 'relative'
          }}
        >
          <PropertyMap
            properties={properties}
            selectedProperty={selectedProperty}
            hoveredPropertyId={hoveredPropertyId}
            onSelectProperty={handleSelectFromMap}
            onOpenDetail={onSelectProperty}
            onHoverProperty={setHoveredPropertyId}
            lang={lang}
          />

          {/* Floating Selected Property Card on Mobile Map Mode */}
          {selectedProperty && (
            <div
              className="mobile-floating-property-card"
              style={{
                position: 'absolute',
                bottom: '76px',
                left: '12px',
                right: '12px',
                zIndex: 800
              }}
            >
              <MapPropertyCard
                property={selectedProperty}
                isSelected={true}
                onSelect={(p) => {
                  setSelectedProperty(p);
                }}
                onOpenDetail={onSelectProperty}
                lang={lang}
                compact={true}
              />
            </div>
          )}
        </main>
      </div>

      {/* Floating Bottom Navigation Pill on Mobile Screens */}
      <div
        className="mobile-map-toggle-bar"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          display: 'none' // Enabled via responsive CSS
        }}
      >
        <button
          type="button"
          onClick={() => setMobileViewMode(prev => (prev === 'map' ? 'list' : 'map'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            backgroundColor: '#121418',
            color: '#FFFFFF',
            borderRadius: '9999px',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {mobileViewMode === 'map' ? (
            <>
              <Grid size={16} />
              <span>{lang === 'es' ? `Ver Lista (${properties.length})` : `Show List (${properties.length})`}</span>
            </>
          ) : (
            <>
              <MapIcon size={16} />
              <span>{lang === 'es' ? 'Ver Mapa' : 'Show Map'}</span>
            </>
          )}
        </button>
      </div>

      {/* Responsive Media Styles & Custom Luxury Scrollbar */}
      <style>{`
        .map-list-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .map-list-sidebar::-webkit-scrollbar-track {
          background: #F3EFE8;
        }
        .map-list-sidebar::-webkit-scrollbar-thumb {
          background: #D1C9BE;
          border-radius: 9999px;
        }
        .map-list-sidebar::-webkit-scrollbar-thumb:hover {
          background: var(--color-burgundy-primary, #660E1A);
        }

        @media (max-width: 900px) {
          .mobile-map-toggle-bar {
            display: flex !important;
          }
          .map-list-sidebar.mobile-hidden {
            display: none !important;
          }
          .map-viewport-container.mobile-hidden {
            display: none !important;
          }
          .map-list-sidebar.mobile-visible {
            width: 100% !important;
            max-width: 100% !important;
            flex: 1 1 100% !important;
            border-right: none !important;
          }
          .hidden-mobile {
            display: none !important;
          }
        }
        @media (min-width: 901px) {
          .mobile-floating-property-card {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
