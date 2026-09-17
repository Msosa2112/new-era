import React, { useEffect, useState } from 'react';
import { ArrowRight, Compass, Sparkles, Building2, MapPin, Users, Award, Shield } from 'lucide-react';
import { BlueprintHero3D } from '../components/hero/BlueprintHero3D';
import { PropertySearchEngine } from '../components/search/PropertySearchEngine';
import { PropertyCard } from '../components/properties/PropertyCard';
import { AgentCard } from '../components/agents/AgentCard';
import { PhilosophySection } from '../components/sections/PhilosophySection';
import { BuySellSection } from '../components/sections/BuySellSection';
import { TechnologySection } from '../components/sections/TechnologySection';
import { ContactSection } from '../components/sections/ContactSection';
import { Property, PropertyFilter, Agent } from '../types/property';
import { propertyService } from '../services/propertyService';
import { HexPattern } from '../components/common/HexPattern';

interface HomePageProps {
  onSelectProperty: (property: Property) => void;
  onSelectAgent: (agent: Agent) => void;
  onNavigate: (page: string) => void;
  onOpenConsultation: () => void;
  lang: 'en' | 'es';
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProperty,
  onSelectAgent,
  onNavigate,
  onOpenConsultation,
  lang
}) => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [featuredAgents, setFeaturedAgents] = useState<Agent[]>([]);

  useEffect(() => {
    propertyService.getFeaturedProperties(4).then(setFeaturedProperties);
    setFeaturedAgents(propertyService.getFeaturedAgents());
  }, []);

  const handleHeroSearch = (filter: PropertyFilter) => {
    onNavigate('properties');
  };

  return (
    <main style={{ position: 'relative' }}>
      {/* CHAPTER 01 & 02: THE BRAND & 3D BLUEPRINT TRANSFORMATION HERO */}
      <BlueprintHero3D
        onExploreProperties={() => {
          const searchSection = document.getElementById('search-chapter');
          searchSection?.scrollIntoView({ behavior: 'smooth' });
        }}
        lang={lang}
      />

      {/* CHAPTER 03: FIND YOUR NEXT ERA SEARCH INTERFACE */}
      <section
        id="search-chapter"
        style={{
          position: 'relative',
          marginTop: '-4rem',
          zIndex: 30,
          paddingBottom: '3rem'
        }}
      >
        <div className="container">
          <PropertySearchEngine
            onSearch={handleHeroSearch}
            lang={lang}
          />
        </div>
      </section>

      {/* CHAPTER 04: FEATURED PROPERTIES SHOWCASE */}
      <section className="section-padding" style={{ position: 'relative', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '1.5rem',
              marginBottom: '3.5rem'
            }}
          >
            <div>
              <span className="display-subtitle">
                {lang === 'es' ? 'COLECCIÓN EXCLUSIVA' : 'CURATED PROPERTIES'}
              </span>
              <h2 className="display-title" style={{ marginTop: '0.5rem' }}>
                {lang === 'es' ? 'RESIDENCIAS DESTACADAS' : 'FEATURED RESIDENCES'}
              </h2>
            </div>

            <button
              onClick={() => onNavigate('properties')}
              className="btn-outline"
            >
              <span>{lang === 'es' ? 'Ver Todas las Propiedades' : 'View All Properties'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Editorial 2x2 Large Property Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2.5rem'
            }}
          >
            {featuredProperties.map((prop, idx) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={onSelectProperty}
                lang={lang}
                priority={idx === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CHAPTER 05: THE NEW WAY (REAL ESTATE, REIMAGINED) */}
      <PhilosophySection
        lang={lang}
        onExplore={() => onNavigate('buy')}
      />

      {/* CHAPTER 06 & 07: BUY & SELL PATHWAYS */}
      <BuySellSection
        lang={lang}
        onNavigate={onNavigate}
        onOpenConsultation={onOpenConsultation}
      />

      {/* CHAPTER 08: THE PEOPLE (AGENTS BEHIND THE PROPERTY) */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-surface)', position: 'relative' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '1.5rem',
              marginBottom: '3.5rem'
            }}
          >
            <div>
              <span className="display-subtitle">
                {lang === 'es' ? 'EL EQUIPO HUMANO' : 'THE ADVISORS'}
              </span>
              <h2 className="display-title" style={{ marginTop: '0.5rem' }}>
                {lang === 'es' ? 'LAS PERSONAS DETRÁS DE CADA PROPIEDAD' : 'THE PEOPLE BEHIND THE PROPERTY'}
              </h2>
            </div>

            <button
              onClick={() => onNavigate('agents')}
              className="btn-outline"
            >
              <span>{lang === 'es' ? 'Conocer Todo el Roster' : 'View All Agents'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Agents Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {featuredAgents.slice(0, 4).map((agent, idx) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                index={idx}
                onSelectAgent={onSelectAgent}
                lang={lang}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CHAPTER 09: THE TECHNOLOGY & MLS INTEGRATION ARCHITECTURE */}
      <TechnologySection lang={lang} />

      {/* CHAPTER 10: CONTACT / START YOUR NEXT ERA */}
      <ContactSection lang={lang} />
    </main>
  );
};
