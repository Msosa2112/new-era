import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Home, DollarSign, Bed, Bath, X, ArrowRight } from 'lucide-react';
import { PropertyFilter, TransactionType, PropertyType } from '../../types/property';

interface PropertySearchEngineProps {
  initialFilter?: PropertyFilter;
  onSearch: (filter: PropertyFilter) => void;
  lang: 'en' | 'es';
  compact?: boolean;
  variant?: 'light' | 'glass';
}

export const PropertySearchEngine: React.FC<PropertySearchEngineProps> = ({
  initialFilter = {},
  onSearch,
  lang,
  compact = false,
  variant = 'light'
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

  const isGlass = variant === 'glass';

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

  const inputBg = isGlass ? 'rgba(0, 0, 0, 0.55)' : 'var(--bg-primary)';
  const inputBorder = isGlass ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid var(--border-subtle)';
  const inputColor = isGlass ? '#FFFFFF' : 'var(--text-primary)';
  const labelColor = isGlass ? '#FFFFFF' : 'var(--text-secondary)';
  const iconColor = isGlass ? 'var(--color-orange-accent)' : 'var(--color-burgundy-primary)';

  return (
    <div
      className={`search-engine-card ${compact ? 'is-compact' : ''}`}
      style={{
        backgroundColor: isGlass ? 'rgba(22, 6, 12, 0.86)' : 'var(--bg-surface)',
        backdropFilter: isGlass ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: isGlass ? 'blur(20px)' : 'none',
        border: isGlass ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: isGlass
          ? '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 30px rgba(253, 230, 138, 0.05)'
          : 'var(--shadow-md)',
        position: 'relative',
        zIndex: 20
      }}
    >
      {/* Search Header / Mode Toggles */}
      <div
        className="search-engine-header"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          borderBottom: isGlass ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {(['Buy', 'Rent'] as TransactionType[]).map((t) => (
            <button
              key={t}
              className="search-mode-btn"
              onClick={() => {
                setTransactionType(t);
                onSearch({ ...initialFilter, transactionType: t });
              }}
              style={{
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: 'var(--radius-xs)',
                backgroundColor:
                  transactionType === t
                    ? 'var(--color-burgundy-primary)'
                    : isGlass
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'transparent',
                color: transactionType === t ? '#FFFFFF' : isGlass ? 'rgba(255, 255, 255, 0.85)' : 'var(--text-secondary)',
                border: isGlass && transactionType !== t ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer'
              }}
            >
              {lang === 'es' ? (t === 'Buy' ? 'Comprar' : 'Alquilar') : t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="search-filter-toggle"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              color: showAdvanced ? 'var(--color-orange-accent)' : isGlass ? 'rgba(253, 230, 138, 0.95)' : 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <SlidersHorizontal size={13} />
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
              className="search-reset-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                color: 'var(--color-orange-accent)',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer'
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
        <div className="search-engine-grid">
          {/* Keyword / Address / MLS */}
          <div className="search-field" style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: labelColor,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Search size={12} color={iconColor} />
              {lang === 'es' ? 'Búsqueda o MLS' : 'Keyword, Street or MLS'}
            </label>
            <input
              type="text"
              className="search-input-control"
              placeholder={lang === 'es' ? 'Ej. River Road, Cherokee, 40204...' : 'e.g. River Road, Cherokee, 40204...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                border: inputBorder,
                borderRadius: 'var(--radius-xs)',
                fontFamily: 'inherit',
                backgroundColor: inputBg,
                color: inputColor
              }}
            />
          </div>

          {/* Location / Area */}
          <div className="search-field" style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: labelColor,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <MapPin size={12} color={iconColor} />
              {lang === 'es' ? 'Zona / Ciudad' : 'Market Area'}
            </label>
            <select
              value={city}
              className="search-input-control"
              onChange={(e) => setCity(e.target.value)}
              style={{
                width: '100%',
                border: inputBorder,
                borderRadius: 'var(--radius-xs)',
                fontFamily: 'inherit',
                backgroundColor: inputBg,
                color: inputColor
              }}
            >
              <option value="All" style={{ backgroundColor: '#160408', color: '#fff' }}>
                {lang === 'es' ? 'Todas las Zonas (KY / IN)' : 'All Areas (KY & IN)'}
              </option>
              <option value="Louisville" style={{ backgroundColor: '#160408', color: '#fff' }}>Louisville, KY</option>
              <option value="Prospect" style={{ backgroundColor: '#160408', color: '#fff' }}>Prospect / Harrods Creek, KY</option>
              <option value="Anchorage" style={{ backgroundColor: '#160408', color: '#fff' }}>Anchorage, KY</option>
              <option value="Jeffersonville" style={{ backgroundColor: '#160408', color: '#fff' }}>Jeffersonville, IN</option>
            </select>
          </div>

          {/* Property Type */}
          <div className="search-field" style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: labelColor,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Home size={12} color={iconColor} />
              {lang === 'es' ? 'Tipo de Residencia' : 'Property Type'}
            </label>
            <select
              value={propertyType}
              className="search-input-control"
              onChange={(e) => setPropertyType(e.target.value as PropertyType | 'All')}
              style={{
                width: '100%',
                border: inputBorder,
                borderRadius: 'var(--radius-xs)',
                fontFamily: 'inherit',
                backgroundColor: inputBg,
                color: inputColor
              }}
            >
              <option value="All" style={{ backgroundColor: '#160408', color: '#fff' }}>
                {lang === 'es' ? 'Todos los Estilos' : 'All Architectural Types'}
              </option>
              <option value="Luxury Estate" style={{ backgroundColor: '#160408', color: '#fff' }}>
                {lang === 'es' ? 'Mansión & Villa de Lujo' : 'Luxury Estate'}
              </option>
              <option value="Single Family" style={{ backgroundColor: '#160408', color: '#fff' }}>
                {lang === 'es' ? 'Unifamiliar Residencial' : 'Single Family'}
              </option>
              <option value="Modern Condo" style={{ backgroundColor: '#160408', color: '#fff' }}>
                {lang === 'es' ? 'Condominio / Penthouse' : 'Modern Condo'}
              </option>
              <option value="Townhome" style={{ backgroundColor: '#160408', color: '#fff' }}>
                {lang === 'es' ? 'Townhome' : 'Townhome'}
              </option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary search-submit-btn"
          >
            <span>{lang === 'es' ? 'BUSCAR PROPIEDADES' : 'EXPLORE PROPERTIES'}</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showAdvanced && (
          <div
            className="search-advanced-drawer"
            style={{
              borderTop: isGlass ? '1px dashed rgba(255, 255, 255, 0.14)' : '1px dashed var(--border-subtle)',
              display: 'grid',
              animation: 'fadeIn 0.25s ease-out'
            }}
          >
            {/* Min Price */}
            <div className="search-field" style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: 600, color: labelColor }}>
                {lang === 'es' ? 'Precio Mínimo' : 'Min Price'}
              </label>
              <select
                value={minPrice || ''}
                className="search-input-control"
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                style={{
                  border: inputBorder,
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: inputBg,
                  color: inputColor
                }}
              >
                <option value="" style={{ backgroundColor: '#160408', color: '#fff' }}>{lang === 'es' ? 'Sin Mínimo' : 'No Min'}</option>
                <option value="300000" style={{ backgroundColor: '#160408', color: '#fff' }}>$300,000</option>
                <option value="500000" style={{ backgroundColor: '#160408', color: '#fff' }}>$500,000</option>
                <option value="750000" style={{ backgroundColor: '#160408', color: '#fff' }}>$750,000</option>
                <option value="1000000" style={{ backgroundColor: '#160408', color: '#fff' }}>$1,000,000+</option>
              </select>
            </div>

            {/* Max Price */}
            <div className="search-field" style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: 600, color: labelColor }}>
                {lang === 'es' ? 'Precio Máximo' : 'Max Price'}
              </label>
              <select
                value={maxPrice || ''}
                className="search-input-control"
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                style={{
                  border: inputBorder,
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: inputBg,
                  color: inputColor
                }}
              >
                <option value="" style={{ backgroundColor: '#160408', color: '#fff' }}>{lang === 'es' ? 'Sin Límite' : 'Any Max'}</option>
                <option value="600000" style={{ backgroundColor: '#160408', color: '#fff' }}>$600,000</option>
                <option value="900000" style={{ backgroundColor: '#160408', color: '#fff' }}>$900,000</option>
                <option value="1500000" style={{ backgroundColor: '#160408', color: '#fff' }}>$1,500,000</option>
                <option value="3000000" style={{ backgroundColor: '#160408', color: '#fff' }}>$3,000,000+</option>
              </select>
            </div>

            {/* Min Bedrooms */}
            <div className="search-field" style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: 600, color: labelColor }}>
                {lang === 'es' ? 'Habitaciones (Min)' : 'Bedrooms (Min)'}
              </label>
              <select
                value={minBeds || ''}
                className="search-input-control"
                onChange={(e) => setMinBeds(e.target.value ? Number(e.target.value) : undefined)}
                style={{
                  border: inputBorder,
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: inputBg,
                  color: inputColor
                }}
              >
                <option value="" style={{ backgroundColor: '#160408', color: '#fff' }}>{lang === 'es' ? 'Cualquiera' : 'Any'}</option>
                <option value="2" style={{ backgroundColor: '#160408', color: '#fff' }}>2+ Beds</option>
                <option value="3" style={{ backgroundColor: '#160408', color: '#fff' }}>3+ Beds</option>
                <option value="4" style={{ backgroundColor: '#160408', color: '#fff' }}>4+ Beds</option>
                <option value="5" style={{ backgroundColor: '#160408', color: '#fff' }}>5+ Beds</option>
              </select>
            </div>

            {/* Min Bathrooms */}
            <div className="search-field" style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: 600, color: labelColor }}>
                {lang === 'es' ? 'Baños (Min)' : 'Bathrooms (Min)'}
              </label>
              <select
                value={minBaths || ''}
                className="search-input-control"
                onChange={(e) => setMinBaths(e.target.value ? Number(e.target.value) : undefined)}
                style={{
                  border: inputBorder,
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: inputBg,
                  color: inputColor
                }}
              >
                <option value="" style={{ backgroundColor: '#160408', color: '#fff' }}>{lang === 'es' ? 'Cualquiera' : 'Any'}</option>
                <option value="2" style={{ backgroundColor: '#160408', color: '#fff' }}>2+ Baths</option>
                <option value="3" style={{ backgroundColor: '#160408', color: '#fff' }}>3+ Baths</option>
                <option value="4" style={{ backgroundColor: '#160408', color: '#fff' }}>4+ Baths</option>
              </select>
            </div>
          </div>
        )}
      </form>

      <style>{`
        .search-engine-card {
          padding: 2.25rem;
        }
        .search-engine-card.is-compact {
          padding: 1.5rem;
        }
        .search-engine-header {
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .search-mode-btn {
          padding: 0.55rem 1.35rem;
          font-size: 0.8rem;
        }
        .search-filter-toggle {
          font-size: 0.8rem;
        }
        .search-engine-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          align-items: flex-end;
        }
        .search-field {
          gap: 0.4rem;
        }
        .search-field label {
          font-size: 0.75rem;
        }
        .search-input-control {
          padding: 0.85rem 1rem;
          font-size: 0.9rem;
          height: 48px;
        }
        .search-submit-btn {
          height: 48px;
          justify-content: center;
          width: 100%;
          font-size: 0.82rem;
          letter-spacing: 0.08em;
        }
        .search-advanced-drawer {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.25rem;
        }

        @media (max-width: 640px) {
          .search-engine-card,
          .search-engine-card.is-compact {
            padding: 1.15rem 1rem !important;
            border-radius: var(--radius-xs) !important;
          }
          .search-engine-header {
            padding-bottom: 0.65rem !important;
            margin-bottom: 0.85rem !important;
            gap: 0.5rem !important;
          }
          .search-mode-btn {
            padding: 0.35rem 0.85rem !important;
            font-size: 0.72rem !important;
          }
          .search-filter-toggle {
            font-size: 0.72rem !important;
          }
          .search-reset-btn {
            font-size: 0.7rem !important;
          }
          .search-engine-grid {
            gap: 0.65rem !important;
          }
          .search-field {
            gap: 0.25rem !important;
          }
          .search-field label {
            font-size: 0.68rem !important;
          }
          .search-input-control {
            padding: 0.5rem 0.75rem !important;
            font-size: 0.82rem !important;
            height: 38px !important;
          }
          .search-submit-btn {
            height: 40px !important;
            font-size: 0.75rem !important;
            padding: 0.5rem 1rem !important;
          }
          .search-advanced-drawer {
            margin-top: 0.85rem !important;
            padding-top: 0.85rem !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.65rem !important;
          }
        }
      `}</style>
    </div>
  );
};
