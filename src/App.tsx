import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { BuyPage } from './pages/BuyPage';
import { SellPage } from './pages/SellPage';
import { AgentsPage } from './pages/AgentsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PropertyDetailView } from './components/properties/PropertyDetailView';
import { ConsultationModal } from './components/common/ConsultationModal';
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
    window.location.hash = `#/${activePage}`;
  };

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setActivePage('agents');
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navbar */}
      <Navbar
        activePage={activePage}
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
