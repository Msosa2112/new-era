import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Property, PropertyFilter, PropertyType, TransactionType } from '../types/property';
import { propertyService } from '../services/propertyService';
import { PropertyMap } from '../components/map/PropertyMap';
import { MapPropertyCard } from '../components/map/MapPropertyCard';
import { useGooglePlacesAutocomplete } from '../hooks/useGooglePlacesAutocomplete';
import {
  Search,
  Grid,
  List as ListIcon,
  Map as MapIcon,
  X,
  RotateCcw,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  SlidersHorizontal,
  Check
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
  const [feedViewMode, setFeedViewMode] = useState<'list' | 'grid'>('list');
  const [mobileViewMode, setMobileViewMode] = useState<'map' | 'list'>('map');
  const [onlySaved, setOnlySaved] = useState<boolean>(false);

  // Popover state for floating filter pills
  const [activePopover, setActivePopover] = useState<'type' | 'price' | 'beds' | null>(null);
  const popoverContainerRef = useRef<HTMLDivElement>(null);

  // Persistent Saved Properties in localStorage
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('newera_saved_properties');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleToggleSave = useCallback((propertyId: string) => {
    setSavedPropertyIds((prev) => {
      const next = prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId];
      try {
        localStorage.setItem('newera_saved_properties', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }
      return next;
    });
  }, []);

  // Search input state and Google Places Autocomplete
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useGooglePlacesAutocomplete(searchInputRef, {
    onPlaceSelected: (place) => {
      const queryText = place.name || place.formattedAddress || '';
      setSearchQuery(queryText);
      setFilter((prev) => ({ ...prev, query: queryText }));
    }
  });

  // Close filter popovers when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (popoverContainerRef.current && !popoverContainerRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  // Fetch properties based on active filters
  useEffect(() => {
    setLoading(true);
    propertyService.getProperties(filter).then((res) => {
      setProperties(res);
      setLoading(false);
      // Keep selected property only if still present in filtered results
      setSelectedProperty((prev) => (prev && res.some((p) => p.id === prev.id) ? prev : null));
    });
  }, [filter]);

  // Handle marker selection from the map -> smooth scroll to listing card
  const handleSelectFromMap = useCallback((property: Property | null) => {
    setSelectedProperty(property);
    if (property) {
      const cardEl = document.getElementById(`map-card-${property.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, []);

  // Handle selection from listing card -> smooth pan map to property coordinates
  const handleSelectCard = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  // Mobile Bottom Carousel Navigation (Cycle between properties)
  const handlePrevPropertyMobile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProperty || properties.length === 0) return;
    const currentIndex = properties.findIndex((p) => p.id === selectedProperty.id);
    const prevIndex = currentIndex <= 0 ? properties.length - 1 : currentIndex - 1;
    setSelectedProperty(properties[prevIndex]);
  };

  const handleNextPropertyMobile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProperty || properties.length === 0) return;
    const currentIndex = properties.findIndex((p) => p.id === selectedProperty.id);
    const nextIndex = currentIndex >= properties.length - 1 ? 0 : currentIndex + 1;
    setSelectedProperty(properties[nextIndex]);
  };

  // Quick search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter((prev) => ({ ...prev, query: searchQuery.trim() }));
    setActivePopover(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActivePopover(null);
    setOnlySaved(false);
    setFilter({ transactionType: 'Buy', sortBy: 'newest' });
  };

  // Filtered properties considering the optional "only saved" toggle
  const displayedProperties = onlySaved
    ? properties.filter((p) => savedPropertyIds.includes(p.id))
    : properties;

  // Active filter indicators
  const isFilterActive =
    Boolean(filter.query) ||
    Boolean(filter.propertyType && filter.propertyType !== 'All') ||
    Boolean(filter.minPrice || filter.maxPrice) ||
    Boolean(filter.minBeds) ||
    onlySaved;

  return (
    <div
      style={{
        paddingTop: 'var(--header-height, 84px)',
        height: '100dvh',
        minHeight: '100dvh',
        maxHeight: '100dvh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#FAF8F5',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* ========================================================================= */}
      {/* 1. DISCOVERY LISTINGS PANEL (Desktop 38-42% / Mobile Full-Screen on 'list') */}
      {/* ========================================================================= */}
      <aside
        className={`map-list-sidebar ${mobileViewMode === 'list' ? 'mobile-visible' : 'mobile-hidden'}`}
        style={{
          width: '40%',
          minWidth: '420px',
          maxWidth: '580px',
          flex: '0 0 40%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '1.25rem 1.25rem 3rem 1.25rem',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          zIndex: 20,
          boxSizing: 'border-box',
          boxShadow: '4px 0 24px rgba(12, 13, 16, 0.04)'
        }}
      >
        {/* Editorial Discovery Panel Header */}
        <div
          style={{
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            flexShrink: 0
          }}
        >
          {/* Top Title & Market Label */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
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
                {lang === 'es' ? 'EXPLORACIÓN MLS · LOUISVILLE' : 'NEW ERA · MLS EXPLORER'}
              </span>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0C0D10',
                  margin: '2px 0 0 0',
                  fontFamily: 'var(--font-serif, "Cinzel", Georgia, serif)',
                  letterSpacing: '-0.02em'
                }}
              >
                {loading
                  ? (lang === 'es' ? 'Buscando...' : 'Searching market...')
                  : `${displayedProperties.length} ${
                      lang === 'es' ? 'Residencias Disponibles' : 'Properties Available'
                    }`}
              </h2>
            </div>

            {/* Switch to Full Gallery Grid View */}
            <button
              type="button"
              onClick={onNavigateToGrid}
              title={lang === 'es' ? 'Ir a vista de galería completa' : 'Open full properties gallery'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                backgroundColor: '#FAF8F5',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#3A414E',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 160ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-burgundy-primary, #660E1A)';
                e.currentTarget.style.color = 'var(--color-burgundy-primary, #660E1A)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.color = '#3A414E';
              }}
            >
              <Grid size={13} />
              <span>{lang === 'es' ? 'Galería' : 'Full Grid'}</span>
            </button>
          </div>

          {/* Subheader Controls: View Mode (List vs Grid), Sort Selector, and Favorites Filter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              flexWrap: 'wrap'
            }}
          >
            {/* View Mode Toggle (Map+List vs Map+Grid) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F3EFE8',
                padding: '3px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(0, 0, 0, 0.06)'
              }}
            >
              <button
                type="button"
                onClick={() => setFeedViewMode('list')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  border: 'none',
                  backgroundColor: feedViewMode === 'list' ? '#FFFFFF' : 'transparent',
                  color: feedViewMode === 'list' ? 'var(--color-burgundy-primary, #660E1A)' : '#6B7280',
                  boxShadow: feedViewMode === 'list' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                <ListIcon size={13} />
                <span>{lang === 'es' ? 'Lista' : 'List'}</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedViewMode('grid')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  border: 'none',
                  backgroundColor: feedViewMode === 'grid' ? '#FFFFFF' : 'transparent',
                  color: feedViewMode === 'grid' ? 'var(--color-burgundy-primary, #660E1A)' : '#6B7280',
                  boxShadow: feedViewMode === 'grid' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                <Grid size={13} />
                <span>{lang === 'es' ? 'Cuadrícula' : 'Grid'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Favorites Filter Toggle */}
              <button
                type="button"
                onClick={() => setOnlySaved((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  border: onlySaved
                    ? '1px solid var(--color-burgundy-primary, #660E1A)'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  backgroundColor: onlySaved ? 'rgba(102, 14, 26, 0.08)' : '#FFFFFF',
                  color: onlySaved ? 'var(--color-burgundy-primary, #660E1A)' : '#4B5563',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
                title={lang === 'es' ? 'Filtrar por guardadas' : 'Filter by saved favorites'}
              >
                <Heart size={13} fill={onlySaved ? 'var(--color-burgundy-primary, #660E1A)' : 'none'} />
                <span>
                  {lang === 'es' ? 'Guardadas' : 'Saved'} ({savedPropertyIds.length})
                </span>
              </button>

              {/* Sort Selector */}
              <select
                value={filter.sortBy || 'newest'}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    sortBy: e.target.value as PropertyFilter['sortBy']
                  }))
                }
                style={{
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="newest">{lang === 'es' ? 'Más recientes' : 'Newest First'}</option>
                <option value="price-asc">{lang === 'es' ? 'Precio: Menor a Mayor' : 'Price: Low to High'}</option>
                <option value="price-desc">{lang === 'es' ? 'Precio: Mayor a Menor' : 'Price: High to Low'}</option>
                <option value="sqft-desc">{lang === 'es' ? 'Mayor Superficie' : 'Largest Sq Ft'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Feed Body */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#847C74' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid #EAE5DE',
                borderTopColor: 'var(--color-burgundy-primary, #660E1A)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem auto'
              }}
            />
            <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              {lang === 'es' ? 'Cargando residencias...' : 'Loading architectural residences...'}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : displayedProperties.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              backgroundColor: '#FAF8F5',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed rgba(0, 0, 0, 0.12)',
              flexShrink: 0
            }}
          >
            <Building2 size={36} color="#847C74" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#121418', marginBottom: '0.5rem' }}>
              {onlySaved
                ? (lang === 'es' ? 'No tienes propiedades guardadas' : 'No saved properties yet')
                : (lang === 'es' ? 'No hay resultados con estos filtros' : 'No properties match this search')}
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#5A606D', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              {onlySaved
                ? (lang === 'es'
                    ? 'Haz clic en el ícono de corazón en cualquier residencia para guardarla aquí.'
                    : 'Click the heart icon on any residence to save it to your favorites.')
                : (lang === 'es'
                    ? 'Prueba ampliando tu criterio de búsqueda o restableciendo los filtros.'
                    : 'Try broadening your search query or reset the active filters.')}
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: 'var(--color-burgundy-primary, #660E1A)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={13} />
              <span>{lang === 'es' ? 'Restablecer Filtros' : 'Reset Filters'}</span>
            </button>
          </div>
        ) : (
          <div className={feedViewMode === 'grid' ? 'listings-feed-grid' : 'listings-feed-list'}>
            {displayedProperties.map((prop) => (
              <MapPropertyCard
                key={prop.id}
                property={prop}
                viewMode={feedViewMode}
                isSelected={selectedProperty?.id === prop.id}
                isHovered={hoveredPropertyId === prop.id}
                isSaved={savedPropertyIds.includes(prop.id)}
                onSelect={handleSelectCard}
                onOpenDetail={onSelectProperty}
                onToggleSave={handleToggleSave}
                onHover={setHoveredPropertyId}
                lang={lang}
              />
            ))}
          </div>
        )}
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAP VIEWPORT (Desktop 58-62% / Mobile Full-Screen on 'map') */}
      {/* ========================================================================= */}
      <main
        className={`map-viewport-container ${mobileViewMode === 'map' ? 'mobile-visible' : 'mobile-hidden'}`}
        style={{
          flex: '1 1 60%',
          minWidth: 0,
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Floating Search & Filter Pill Bar over the Map */}
        <div ref={popoverContainerRef} className="floating-map-filter-bar">
          {/* Places Search Input */}
          <form onSubmit={handleSearchSubmit} className="floating-search-form">
            <Search size={15} color="#660E1A" style={{ marginRight: '8px', flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'es'
                  ? 'Buscar vecindario, dirección o ciudad...'
                  : 'Search neighborhood, address, city...'
              }
              className="floating-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilter((prev) => ({ ...prev, query: undefined }));
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 2,
                  display: 'flex',
                  color: '#847C74'
                }}
              >
                <X size={13} />
              </button>
            )}
          </form>

          {/* Buy / Rent Compact Toggle */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#F3EFE8',
              borderRadius: '9999px',
              padding: '2px',
              border: '1px solid rgba(0, 0, 0, 0.06)'
            }}
          >
            {(['Buy', 'Rent'] as const).map((mode) => {
              const isActive = (filter.transactionType || 'Buy') === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilter((prev) => ({ ...prev, transactionType: mode }))}
                  style={{
                    padding: '5px 11px',
                    borderRadius: '9999px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: isActive ? 'var(--color-burgundy-primary, #660E1A)' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#4B5563',
                    cursor: 'pointer',
                    transition: 'all 160ms ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {mode === 'Buy' ? (lang === 'es' ? 'Comprar' : 'Buy') : (lang === 'es' ? 'Renta' : 'Rent')}
                </button>
              );
            })}
          </div>

          {/* Property Type Pill & Popover */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className={`floating-filter-pill-btn ${
                filter.propertyType && filter.propertyType !== 'All' ? 'is-active' : ''
              }`}
              onClick={() => setActivePopover((prev) => (prev === 'type' ? null : 'type'))}
            >
              <span>
                {filter.propertyType && filter.propertyType !== 'All'
                  ? filter.propertyType === 'Single Family'
                    ? lang === 'es'
                      ? 'Casas'
                      : 'Houses'
                    : filter.propertyType === 'Luxury Estate'
                    ? lang === 'es'
                      ? 'Fincas'
                      : 'Estates'
                    : filter.propertyType === 'Modern Condo'
                    ? 'Condos'
                    : filter.propertyType
                  : lang === 'es'
                  ? 'Tipo'
                  : 'Property Type'}
              </span>
              <ChevronDown size={13} />
            </button>

            {activePopover === 'type' && (
              <div className="filter-popover-menu">
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#660E1A', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {lang === 'es' ? 'Tipo de Propiedad' : 'Property Type'}
                </div>
                {(['All', 'Single Family', 'Luxury Estate', 'Modern Condo'] as const).map((t) => {
                  const isCurrent = (filter.propertyType || 'All') === t;
                  const label =
                    t === 'All'
                      ? lang === 'es'
                        ? 'Todas las Residencias'
                        : 'All Property Types'
                      : t === 'Single Family'
                      ? lang === 'es'
                        ? 'Casas Unifamiliares'
                        : 'Single Family Houses'
                      : t === 'Luxury Estate'
                      ? lang === 'es'
                        ? 'Fincas de Lujo'
                        : 'Luxury Estates'
                      : lang === 'es'
                      ? 'Condominios Modernos'
                      : 'Modern Condos';

                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setFilter((prev) => ({ ...prev, propertyType: t }));
                        setActivePopover(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: isCurrent ? 700 : 500,
                        backgroundColor: isCurrent ? 'rgba(102, 14, 26, 0.08)' : 'transparent',
                        color: isCurrent ? 'var(--color-burgundy-primary, #660E1A)' : '#1F2937',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{label}</span>
                      {isCurrent && <Check size={14} color="#660E1A" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Price Range Pill & Popover */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className={`floating-filter-pill-btn ${
                filter.minPrice || filter.maxPrice ? 'is-active' : ''
              }`}
              onClick={() => setActivePopover((prev) => (prev === 'price' ? null : 'price'))}
            >
              <span>
                {filter.minPrice && filter.maxPrice
                  ? `$${Math.round(filter.minPrice / 1000)}k - $${Math.round(filter.maxPrice / 1000)}k`
                  : filter.maxPrice
                  ? `< $${Math.round(filter.maxPrice / 1000)}k`
                  : filter.minPrice
                  ? `> $${Math.round(filter.minPrice / 1000)}k`
                  : lang === 'es'
                  ? 'Precio'
                  : 'Price'}
              </span>
              <ChevronDown size={13} />
            </button>

            {activePopover === 'price' && (
              <div className="filter-popover-menu">
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#660E1A', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {lang === 'es' ? 'Rango de Precio' : 'Price Range'}
                </div>
                {[
                  { label: lang === 'es' ? 'Cualquier Precio' : 'Any Price', min: undefined, max: undefined },
                  { label: lang === 'es' ? 'Hasta $750,000' : 'Under $750,000', min: undefined, max: 750000 },
                  { label: '$750,000 - $1,500,000', min: 750000, max: 1500000 },
                  { label: '$1,500,000 - $3,000,000', min: 1500000, max: 3000000 },
                  { label: lang === 'es' ? 'Más de $3,000,000' : '$3,000,000+', min: 3000000, max: undefined }
                ].map((range, idx) => {
                  const isCurrent = filter.minPrice === range.min && filter.maxPrice === range.max;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFilter((prev) => ({
                          ...prev,
                          minPrice: range.min,
                          maxPrice: range.max
                        }));
                        setActivePopover(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: isCurrent ? 700 : 500,
                        backgroundColor: isCurrent ? 'rgba(102, 14, 26, 0.08)' : 'transparent',
                        color: isCurrent ? 'var(--color-burgundy-primary, #660E1A)' : '#1F2937',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{range.label}</span>
                      {isCurrent && <Check size={14} color="#660E1A" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bedrooms Pill & Popover */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className={`floating-filter-pill-btn ${filter.minBeds ? 'is-active' : ''}`}
              onClick={() => setActivePopover((prev) => (prev === 'beds' ? null : 'beds'))}
            >
              <span>
                {filter.minBeds
                  ? `${filter.minBeds}+ ${lang === 'es' ? 'Hab' : 'Beds'}`
                  : lang === 'es'
                  ? 'Habitaciones'
                  : 'Beds & Baths'}
              </span>
              <ChevronDown size={13} />
            </button>

            {activePopover === 'beds' && (
              <div className="filter-popover-menu" style={{ minWidth: '190px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#660E1A', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {lang === 'es' ? 'Mínimo de Habitaciones' : 'Minimum Bedrooms'}
                </div>
                {[
                  { label: lang === 'es' ? 'Cualquiera' : 'Any', beds: undefined },
                  { label: '2+ Bedrooms', beds: 2 },
                  { label: '3+ Bedrooms', beds: 3 },
                  { label: '4+ Bedrooms', beds: 4 },
                  { label: '5+ Bedrooms', beds: 5 }
                ].map((item, idx) => {
                  const isCurrent = filter.minBeds === item.beds;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFilter((prev) => ({ ...prev, minBeds: item.beds }));
                        setActivePopover(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: isCurrent ? 700 : 500,
                        backgroundColor: isCurrent ? 'rgba(102, 14, 26, 0.08)' : 'transparent',
                        color: isCurrent ? 'var(--color-burgundy-primary, #660E1A)' : '#1F2937',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{item.label}</span>
                      {isCurrent && <Check size={14} color="#660E1A" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reset Filters (Only displayed if filters are active) */}
          {isFilterActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 11px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: '1px solid rgba(0,0,0,0.1)',
                backgroundColor: '#FAF8F5',
                color: '#6B7280',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              title={lang === 'es' ? 'Restablecer filtros' : 'Reset filters'}
            >
              <RotateCcw size={12} />
              <span>{lang === 'es' ? 'Limpiar' : 'Reset'}</span>
            </button>
          )}

          {/* Primary Action Button: Search */}
          <button type="submit" onClick={handleSearchSubmit} className="floating-search-submit-btn">
            <Search size={14} />
            <span>{lang === 'es' ? 'Buscar' : 'Search'}</span>
          </button>
        </div>

        {/* The Spatial Map Engine */}
        <PropertyMap
          properties={displayedProperties}
          selectedProperty={selectedProperty}
          hoveredPropertyId={hoveredPropertyId}
          onSelectProperty={handleSelectFromMap}
          onOpenDetail={onSelectProperty}
          onHoverProperty={setHoveredPropertyId}
          lang={lang}
        />

        {/* Mobile Interactive Bottom Carousel Card when a marker is tapped */}
        {selectedProperty && (
          <div className="mobile-bottom-carousel-container">
            {displayedProperties.length > 1 && (
              <button
                type="button"
                onClick={handlePrevPropertyMobile}
                className="mobile-carousel-nav-btn"
                aria-label={lang === 'es' ? 'Propiedad anterior' : 'Previous property'}
              >
                <ChevronLeft size={18} />
              </button>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <MapPropertyCard
                property={selectedProperty}
                isSelected={true}
                isSaved={savedPropertyIds.includes(selectedProperty.id)}
                onSelect={handleSelectCard}
                onOpenDetail={onSelectProperty}
                onToggleSave={handleToggleSave}
                onClose={() => setSelectedProperty(null)}
                lang={lang}
                compact={true}
              />
            </div>

            {displayedProperties.length > 1 && (
              <button
                type="button"
                onClick={handleNextPropertyMobile}
                className="mobile-carousel-nav-btn"
                aria-label={lang === 'es' ? 'Siguiente propiedad' : 'Next property'}
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. MOBILE VIEW TOGGLE BAR ("Show List" vs "Show Map") */}
      {/* ========================================================================= */}
      <div
        className="mobile-map-toggle-bar"
        style={{
          position: 'fixed',
          bottom: '22px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          display: 'none' // Controlled via responsive CSS media queries below
        }}
      >
        <button
          type="button"
          onClick={() => setMobileViewMode((prev) => (prev === 'map' ? 'list' : 'map'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            backgroundColor: '#660E1A',
            color: '#FFFFFF',
            borderRadius: '9999px',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 10px 28px rgba(102, 14, 26, 0.35)',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {mobileViewMode === 'map' ? (
            <>
              <ListIcon size={16} />
              <span>
                {lang === 'es'
                  ? `Ver Lista (${displayedProperties.length})`
                  : `Show List (${displayedProperties.length})`}
              </span>
            </>
          ) : (
            <>
              <MapIcon size={16} />
              <span>{lang === 'es' ? 'Ver Mapa' : 'Show Map'}</span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. RESPONSIVE MEDIA STYLES & LUXURY SCROLLBAR */}
      {/* ========================================================================= */}
      <style>{`
        .map-list-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .map-list-sidebar::-webkit-scrollbar-track {
          background: #FAF8F5;
        }
        .map-list-sidebar::-webkit-scrollbar-thumb {
          background: #D8D2C7;
          border-radius: 9999px;
        }
        .map-list-sidebar::-webkit-scrollbar-thumb:hover {
          background: var(--color-burgundy-primary, #660E1A);
        }

        @keyframes slideUpCard {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
            padding: 1rem 1rem 5rem 1rem !important;
          }
        }

        @media (min-width: 901px) {
          .mobile-bottom-carousel-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
