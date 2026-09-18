import React, { useState, useEffect } from 'react';
import { PropertySearchEngine } from '../components/search/PropertySearchEngine';
import { PropertyCard } from '../components/properties/PropertyCard';
import { Property, PropertyFilter } from '../types/property';
import { propertyService } from '../services/propertyService';
import { HexPattern } from '../components/common/HexPattern';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface PropertiesPageProps {
  onSelectProperty: (property: Property) => void;
  lang: 'en' | 'es';
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  onSelectProperty,
  lang
}) => {
  const mainRef = useScrollReveal<HTMLElement>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<PropertyFilter>({ transactionType: 'Buy', sortBy: 'newest' });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    propertyService.getProperties(filter).then((res) => {
      setProperties(res);
      setLoading(false);
    });
  }, [filter]);

  const handleSearch = (newFilter: PropertyFilter) => {
    setFilter(newFilter);
  };

  return (
    <main ref={mainRef} style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Page Header */}
      <section
        style={{
          backgroundColor: 'var(--color-charcoal-950)',
          color: '#FFFFFF',
          padding: '4.5rem 0 3.5rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <HexPattern variant="gradient-burgundy" opacity={0.16} maskFade="radial-top-right" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="display-subtitle" style={{ color: 'var(--color-orange-accent)' }}>
            {lang === 'es' ? 'PORTAFOLIO DE PROPIEDADES' : 'EXCLUSIVE INVENTORY'}
          </span>
          <h1 className="display-title" style={{ color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '1rem' }}>
            {lang === 'es' ? 'ENCUENTRA TU SIGUIENTE ERA' : 'FIND YOUR NEXT ERA'}
          </h1>
          <p className="editorial-lead" style={{ color: 'rgba(255, 255, 255, 0.75)', maxWidth: '680px' }}>
            {lang === 'es'
              ? 'Explora residencias unifamiliares, fincas de lujo y condominios contemporáneos en los vecindarios más cotizados de Louisville, Prospect y Southern Indiana.'
              : 'Browse architectural residences, luxury estates, and contemporary urban spaces across Greater Louisville.'}
          </p>
        </div>
      </section>

      {/* Filter Engine */}
      <section style={{ marginTop: '-2rem', position: 'relative', zIndex: 20 }}>
        <div className="container">
          <PropertySearchEngine
            initialFilter={filter}
            onSearch={handleSearch}
            lang={lang}
            compact
          />
        </div>
      </section>

      {/* Results & Sorting Bar */}
      <section className="section-padding-sm" style={{ position: 'relative', overflow: 'hidden' }}>
        <HexPattern variant="subtle" opacity={0.05} maskFade="none" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '2.5rem'
            }}
          >
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {loading ? (
                <span>{lang === 'es' ? 'Cargando listados...' : 'Filtering MLS data...'}</span>
              ) : (
                <span>
                  {properties.length} {properties.length === 1 ? 'Property Available' : 'Properties Available'}
                </span>
              )}
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={14} color="var(--color-burgundy-primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {lang === 'es' ? 'Ordenar por:' : 'Sort By:'}
              </span>
              <select
                value={filter.sortBy || 'newest'}
                onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as any })}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit'
                }}
              >
                <option value="newest">{lang === 'es' ? 'Más Recientes' : 'Newest First'}</option>
                <option value="price-asc">{lang === 'es' ? 'Precio: Menor a Mayor' : 'Price: Low to High'}</option>
                <option value="price-desc">{lang === 'es' ? 'Precio: Mayor a Menor' : 'Price: High to Low'}</option>
                <option value="sqft-desc">{lang === 'es' ? 'Espacio (Sq Ft)' : 'Largest Living Area'}</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {properties.length === 0 && !loading ? (
            <div
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {lang === 'es' ? 'No se encontraron propiedades' : 'No matching properties found'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                {lang === 'es'
                  ? 'Intenta ajustar los criterios de búsqueda o contacta a un asesor para listados off-market.'
                  : 'Try broadening your search filters or connect directly with our advisory team.'}
              </p>
              <button
                onClick={() => setFilter({ transactionType: 'Buy' })}
                className="btn-primary"
              >
                <span>{lang === 'es' ? 'Restablecer Filtros' : 'Clear All Filters'}</span>
              </button>
            </div>
          ) : (
            <div
              className="property-grid-container"
            >
              {properties.map((prop, idx) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onSelect={onSelectProperty}
                  lang={lang}
                  priority={idx < 2}
                  staggerIndex={(idx % 6) + 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
