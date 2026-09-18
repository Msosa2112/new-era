import React, { useEffect, useState } from 'react';
import { ArrowRight, Compass, Sparkles, Building2, MapPin, Users, Award, Shield } from 'lucide-react';
import { BlueprintHero3D } from '../components/hero/BlueprintHero3D';
import { PropertySearchEngine } from '../components/search/PropertySearchEngine';
import { PropertyCard } from '../components/properties/PropertyCard';
import { AgentCard } from '../components/agents/AgentCard';
import { PhilosophySection } from '../components/sections/PhilosophySection';
import { BuySellSection } from '../components/sections/BuySellSection';
import { TeamShowcaseSection } from '../components/sections/TeamShowcaseSection';
import { TechnologySection } from '../components/sections/TechnologySection';
import { ContactSection } from '../components/sections/ContactSection';
import { Property, PropertyFilter, Agent } from '../types/property';
import { propertyService } from '../services/propertyService';
import { CinematicVideoIntro } from '../components/hero/CinematicVideoIntro';
import { HexPattern } from '../components/common/HexPattern';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { AnimatedCounter } from '../components/common/AnimatedCounter';

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
  const mainRef = useScrollReveal<HTMLElement>();
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
    <main ref={mainRef} style={{ position: 'relative' }}>
      {/* FULLSCREEN CINEMATIC VIDEO INTRO (Smooth dissolve to Hero on end) */}
      <CinematicVideoIntro />

      {/* CHAPTER 01 & 02: BRAND HERO */}
      <BlueprintHero3D
        onExploreProperties={() => {
          const searchSection = document.getElementById('search-chapter');
          searchSection?.scrollIntoView({ behavior: 'smooth' });
        }}
        lang={lang}
      />

      {/* TEAM MEMBERS / ADVISORS SHOWCASE */}
      <TeamShowcaseSection
        onSelectAgent={onSelectAgent}
        onNavigate={onNavigate}
        lang={lang}
      />

      {/* CHAPTER 03: FIND YOUR NEXT ERA SEARCH INTERFACE */}
      <section
        id="search-chapter"
        style={{
          position: 'relative',
          zIndex: 30,
          backgroundColor: 'var(--bg-primary)',
          padding: '4.5rem 0 3.5rem 0',
          overflow: 'visible'
        }}
      >
        <HexPattern variant="subtle" opacity={0.06} maskFade="radial-center" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <PropertySearchEngine
            onSearch={handleHeroSearch}
            lang={lang}
          />
        </div>
      </section>

      {/* CHAPTER 04: FEATURED PROPERTIES SHOWCASE */}
      <section className="section-padding" style={{ position: 'relative', backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
        <HexPattern variant="subtle" opacity={0.06} maskFade="radial-top-right" />
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
            className="property-grid-container"
          >
            {featuredProperties.map((prop, idx) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={onSelectProperty}
                lang={lang}
                priority={idx === 0}
                staggerIndex={(idx % 6) + 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CHAPTER 04.5: PERFORMANCE & TRACK RECORD STATS */}
      <section
        style={{
          position: 'relative',
          backgroundColor: 'var(--color-charcoal-950)',
          color: '#FFFFFF',
          padding: '4.5rem 0',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <HexPattern variant="gradient-burgundy" opacity={0.16} maskFade="radial-center" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center'
            }}
          >
            <AnimatedCounter
              target={45}
              prefix="$"
              suffix="M+"
              duration={1800}
              label={lang === 'es' ? 'Volumen Transaccionado' : 'Career Real Estate Volume'}
            />
            <AnimatedCounter
              target={150}
              suffix="+"
              duration={1600}
              label={lang === 'es' ? 'Familias Asesoradas' : 'Families Represented'}
            />
            <AnimatedCounter
              target={98}
              suffix="%"
              duration={1700}
              label={lang === 'es' ? 'Satisfacción de Clientes' : 'Client Satisfaction Rate'}
            />
            <AnimatedCounter
              target={15}
              suffix="+"
              duration={1500}
              label={lang === 'es' ? 'Años de Liderazgo Colectivo' : 'Years Market Leadership'}
            />
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

      {/* CHAPTER 09: THE TECHNOLOGY & MLS INTEGRATION ARCHITECTURE */}
      <TechnologySection lang={lang} />

      {/* CHAPTER 10: CONTACT / START YOUR NEXT ERA */}
      <ContactSection lang={lang} />
    </main>
  );
};
