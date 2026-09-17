import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Home, DollarSign, Bed, Bath, X, ArrowRight } from 'lucide-react';
import { PropertyFilter, TransactionType, PropertyType } from '../../types/property';

interface PropertySearchEngineProps {
  initialFilter?: PropertyFilter;
  onSearch: (filter: PropertyFilter) => void;
  lang: 'en' | 'es';
  compact?: boolean;
}

export const PropertySearchEngine: React.FC<PropertySearchEngineProps> = ({
  initialFilter = {},
  onSearch,
  lang,
  compact = false
}) => {
  const [transactionType, setTransactionType] = useState<TransactionType>(
    initialFilter.transactionType || 'Buy'
  );
  const [query, setQuery] = useState<string>(initialFilter.query || '');
  const [city, setCity] = useState<string>(initialFilter.city || 'All');
  const [propertyType, setPropertyType] = useState<PropertyType | 'All'>(
    initialFilter.propertyType || 'All'
  );
  const [minPrice, setMinPrice] = useState<number | undefined>(initialFilter.minPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialFilter.maxPrice);
  const [minBeds, setMinBeds] = useState<number | undefined>(initialFilter.minBeds);
  const [minBaths, setMinBaths] = useState<number | undefined>(initialFilter.minBaths);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch({
      query: query.trim() || undefined,
      transactionType,
      city: city === 'All' ? undefined : city,
      propertyType: propertyType === 'All' ? undefined : propertyType,
      minPrice,
      maxPrice,
      minBeds,
      minBaths
    });
  };

  const handleReset = () => {
    setQuery('');
    setCity('All');
    setPropertyType('All');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinBeds(undefined);
    setMinBaths(undefined);
    onSearch({ transactionType });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-md)',
        padding: compact ? '1.5rem' : '2.5rem',
        position: 'relative',
        zIndex: 20
      }}
    >
      {/* Search Header / Mode Toggles */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {(['Buy', 'Rent'] as TransactionType[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTransactionType(t);
                onSearch({ ...initialFilter, transactionType: t });
              }}
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: 'var(--radius-xs)',
                backgroundColor:
                  transactionType === t ? 'var(--color-burgundy-primary)' : 'transparent',
                color: transactionType === t ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {lang === 'es' ? (t === 'Buy' ? 'Comprar' : 'Alquilar') : t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: showAdvanced ? 'var(--color-orange-accent)' : 'var(--text-secondary)'
            }}
          >
            <SlidersHorizontal size={14} />
            <span>
              {lang === 'es'
                ? showAdvanced
                  ? 'Menos Filtros'
                  : 'Filtros Avanzados'
                : showAdvanced
                ? 'Fewer Filters'
                : 'Advanced Filters'}
            </span>
          </button>

          {(query ||
            city !== 'All' ||
            propertyType !== 'All' ||
            minPrice ||
            maxPrice ||
            minBeds) && (
            <button
              onClick={handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                color: 'var(--color-burgundy-primary)',
                fontWeight: 600
              }}
            >
              <X size={12} />
              <span>{lang === 'es' ? 'Limpiar' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Search Row */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            alignItems: 'flex-end'
          }}
        >
          {/* Keyword / Address / MLS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Search size={13} color="var(--color-burgundy-primary)" />
              {lang === 'es' ? 'Búsqueda o MLS' : 'Keyword, Street or MLS'}
            </label>
            <input
              type="text"
              placeholder={lang === 'es' ? 'Ej. River Road, Cherokee, 40204...' : 'e.g. River Road, Cherokee, 40204...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Location / Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <MapPin size={13} color="var(--color-burgundy-primary)" />
              {lang === 'es' ? 'Zona / Ciudad' : 'Market Area'}
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="All">{lang === 'es' ? 'Todas las Zonas (KY / IN)' : 'All Areas (KY & IN)'}</option>
              <option value="Louisville">Louisville, KY</option>
              <option value="Prospect">Prospect / Harrods Creek, KY</option>
              <option value="Anchorage">Anchorage, KY</option>
              <option value="Jeffersonville">Jeffersonville, IN</option>
            </select>
          </div>

          {/* Property Type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Home size={13} color="var(--color-burgundy-primary)" />
              {lang === 'es' ? 'Tipo de Residencia' : 'Property Type'}
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType | 'All')}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="All">{lang === 'es' ? 'Todos los Estilos' : 'All Architectural Types'}</option>
              <option value="Luxury Estate">{lang === 'es' ? 'Mansión & Villa de Lujo' : 'Luxury Estate'}</option>
              <option value="Single Family">{lang === 'es' ? 'Unifamiliar Residencial' : 'Single Family'}</option>
              <option value="Modern Condo">{lang === 'es' ? 'Condominio / Penthouse' : 'Modern Condo'}</option>
              <option value="Townhome">{lang === 'es' ? 'Townhome' : 'Townhome'}</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{
              height: '48px',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <span>{lang === 'es' ? 'BUSCAR PROPIEDADES' : 'EXPLORE PROPERTIES'}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showAdvanced && (
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px dashed var(--border-subtle)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              animation: 'fadeIn 0.25s ease-out'
            }}
          >
            {/* Min Price */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {lang === 'es' ? 'Precio Mínimo' : 'Min Price'}
              </label>
              <select
                value={minPrice || ''}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--bg-primary)'
                }}
              >
                <option value="">{lang === 'es' ? 'Sin Mínimo' : 'No Min'}</option>
                <option value="300000">$300,000</option>
                <option value="500000">$500,000</option>
                <option value="750000">$750,000</option>
                <option value="1000000">$1,000,000+</option>
              </select>
            </div>

            {/* Max Price */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {lang === 'es' ? 'Precio Máximo' : 'Max Price'}
              </label>
              <select
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--bg-primary)'
                }}
              >
                <option value="">{lang === 'es' ? 'Sin Límite' : 'Any Max'}</option>
                <option value="600000">$600,000</option>
                <option value="900000">$900,000</option>
                <option value="1500000">$1,500,000</option>
                <option value="3000000">$3,000,000+</option>
              </select>
            </div>

            {/* Min Bedrooms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {lang === 'es' ? 'Habitaciones (Min)' : 'Bedrooms (Min)'}
              </label>
              <select
                value={minBeds || ''}
                onChange={(e) => setMinBeds(e.target.value ? Number(e.target.value) : undefined)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--bg-primary)'
                }}
              >
                <option value="">{lang === 'es' ? 'Cualquiera' : 'Any'}</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
                <option value="4">4+ Beds</option>
                <option value="5">5+ Beds</option>
              </select>
            </div>

            {/* Min Bathrooms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {lang === 'es' ? 'Baños (Min)' : 'Bathrooms (Min)'}
              </label>
              <select
                value={minBaths || ''}
                onChange={(e) => setMinBaths(e.target.value ? Number(e.target.value) : undefined)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--bg-primary)'
                }}
              >
                <option value="">{lang === 'es' ? 'Cualquiera' : 'Any'}</option>
                <option value="2">2+ Baths</option>
                <option value="3">3+ Baths</option>
                <option value="4">4+ Baths</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
