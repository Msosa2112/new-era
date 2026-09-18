import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { BuyPage } from './pages/BuyPage';
import { SellPage } from './pages/SellPage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentProfilePage } from './pages/AgentProfilePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PropertyDetailView } from './components/properties/PropertyDetailView';
import { ConsultationModal } from './components/common/ConsultationModal';
import { SEOHead } from './components/common/SEOHead';
import { Property, Agent } from './types/property';
import { propertyService } from './services/propertyService';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [consultationOpen, setConsultationOpen] = useState<boolean>(false);

  // Handle URL hash navigation or back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('properties/')) {
        const slug = hash.replace('properties/', '');
        propertyService.getPropertyById(slug).then((p) => {
          if (p) setSelectedProperty(p);
        });
      } else if (hash.startsWith('agents/') || hash.startsWith('agent/')) {
        const agentId = hash.replace('agents/', '').replace('agent/', '');
        const found = propertyService.getAgentById(agentId);
        if (found) {
          setSelectedAgent(found);
          setActivePage('agent-profile');
        } else {
          setActivePage('agents');
        }
      } else if (hash) {
        setActivePage(hash);
      } else {
        setActivePage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string, param?: string) => {
    setActivePage(page);
    if (param && page === 'properties') {
      window.location.hash = `#/properties/${param}`;
    } else if (param && (page === 'agents' || page === 'agent-profile')) {
      window.location.hash = `#/agents/${param}`;
    } else {
      window.location.hash = `#/${page}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    window.location.hash = `#/properties/${property.slug}`;
  };

  const handleCloseProperty = () => {
    setSelectedProperty(null);
    if (activePage === 'agent-profile' && selectedAgent) {
      window.location.hash = `#/agents/${selectedAgent.id}`;
    } else {
      window.location.hash = `#/${activePage}`;
    }
  };

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setActivePage('agent-profile');
    window.location.hash = `#/agents/${agent.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Reactive SEO Head Manager (Dynamic Titles, Meta, OpenGraph, JSON-LD) */}
      <SEOHead
        activePage={activePage}
        lang={lang}
        selectedAgent={selectedAgent}
        selectedProperty={selectedProperty}
      />

      {/* Global Navbar */}
      <Navbar
        activePage={activePage === 'agent-profile' ? 'agents' : activePage}
        onNavigate={handleNavigate}
        lang={lang}
        onToggleLang={toggleLanguage}
        onOpenConsultation={() => setConsultationOpen(true)}
      />

      {/* Main Page Rendering */}
      <div style={{ flex: 1 }}>
        {activePage === 'home' && (
          <HomePage
            onSelectProperty={handleSelectProperty}
            onSelectAgent={handleSelectAgent}
            onNavigate={handleNavigate}
            onOpenConsultation={() => setConsultationOpen(true)}
            lang={lang}
          />
        )}

        {activePage === 'properties' && (
          <PropertiesPage
            onSelectProperty={handleSelectProperty}
            lang={lang}
          />
        )}

        {activePage === 'buy' && (
          <BuyPage
            onExploreProperties={() => handleNavigate('properties')}
            onOpenConsultation={() => setConsultationOpen(true)}
            lang={lang}
          />
        )}

        {activePage === 'sell' && (
          <SellPage
            onOpenConsultation={() => setConsultationOpen(true)}
            lang={lang}
          />
        )}

        {activePage === 'agents' && (
          <AgentsPage
            onSelectProperty={handleSelectProperty}
            onSelectAgent={handleSelectAgent}
            lang={lang}
          />
        )}

        {activePage === 'agent-profile' && selectedAgent && (
          <AgentProfilePage
            agent={selectedAgent}
            onSelectProperty={handleSelectProperty}
            onSelectAgent={handleSelectAgent}
            onBack={() => handleNavigate('agents')}
            onOpenConsultation={() => setConsultationOpen(true)}
            lang={lang}
          />
        )}

        {activePage === 'about' && (
          <AboutPage
            onOpenConsultation={() => setConsultationOpen(true)}
            lang={lang}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage lang={lang} />
        )}
      </div>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} lang={lang} />

      {/* Standalone Cinematic Property Detail View Modal */}
      {selectedProperty && (
        <PropertyDetailView
          property={selectedProperty}
          onClose={handleCloseProperty}
          onSelectProperty={handleSelectProperty}
          onSelectAgent={handleSelectAgent}
          lang={lang}
        />
      )}

      {/* Global Private Advisory Consultation Modal */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        lang={lang}
      />
    </div>
  );
};
