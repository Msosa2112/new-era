import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { BuyPage } from './pages/BuyPage';
import { SellPage } from './pages/SellPage';
import { AgentProfilePage } from './pages/AgentProfilePage';
import { AboutPage } from './pages/AboutPage';
import { AgentsPage } from './pages/AgentsPage';
import { ContactPage } from './pages/ContactPage';
import { MapPage } from './pages/MapPage';
import { InboxPage } from './pages/InboxPage';
import { PropertyDetailView } from './components/properties/PropertyDetailView';
import { ConsultationModal } from './components/common/ConsultationModal';
import { JoinTeamModal } from './components/common/JoinTeamModal';
import { SEOHead } from './components/common/SEOHead';
import { Property, Agent } from './types/property';
import { propertyService } from './services/propertyService';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [consultationOpen, setConsultationOpen] = useState<boolean>(false);
  const [joinModalOpen, setJoinModalOpen] = useState<boolean>(false);

  // Handle clean URL path navigation, legacy #/ hash redirects, and browser Back/Forward
  useEffect(() => {
    const syncRouteFromLocation = () => {
      let route = '';
      const rawHash = window.location.hash;

      // Legacy #/route support -> automatically redirect to clean /route
      if (rawHash.startsWith('#/')) {
        route = rawHash.replace(/^#\/+|\/+$/g, '');
        const cleanUrl = route && route !== 'home' ? `/${route}` : '/';
        window.history.replaceState(null, '', cleanUrl);
      } else {
        route = window.location.pathname.replace(/^\/+|\/+$/g, '');
      }

      if (!route || route === 'home') {
        setSelectedProperty(null);
        setActivePage('home');
      } else if (route.startsWith('properties/')) {
        const slug = route.replace('properties/', '');
        propertyService.getPropertyById(slug).then((p) => {
          if (p) setSelectedProperty(p);
        });
      } else if (route.startsWith('agents/') || route.startsWith('agent/')) {
        setSelectedProperty(null);
        const agentId = route.replace('agents/', '').replace('agent/', '');
        const found = propertyService.getAgentById(agentId);
        if (found) {
          setSelectedAgent(found);
          setActivePage('agent-profile');
        } else {
          setActivePage('agents');
        }
      } else if (route === 'agents' || route === 'team' || route === 'asesores') {
        setSelectedProperty(null);
        setActivePage('agents');
      } else if (route === 'join' || route === 'unirse') {
        setSelectedProperty(null);
        setActivePage('home');
        setJoinModalOpen(true);
      } else if (route === 'inbox' || route === 'correo' || route === 'mail' || route === 'portal') {
        setSelectedProperty(null);
        setActivePage('inbox');
      } else {
        setSelectedProperty(null);
        setActivePage(route);
      }
    };

    window.addEventListener('popstate', syncRouteFromLocation);
    window.addEventListener('hashchange', syncRouteFromLocation);
    syncRouteFromLocation();

    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
      window.removeEventListener('hashchange', syncRouteFromLocation);
    };
  }, []);

  const handleNavigate = (page: string, param?: string) => {
    setSelectedProperty(null);
    setActivePage(page);
    let targetPath = '/';
    if (param && page === 'properties') {
      targetPath = `/properties/${param}`;
    } else if (param && (page === 'agents' || page === 'agent-profile')) {
      targetPath = `/agents/${param}`;
    } else if (page && page !== 'home') {
      targetPath = `/${page}`;
    }
    window.history.pushState(null, '', targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    window.history.pushState(null, '', `/properties/${property.slug}`);
  };

  const handleCloseProperty = () => {
    setSelectedProperty(null);
    if (activePage === 'agent-profile' && selectedAgent) {
      window.history.pushState(null, '', `/agents/${selectedAgent.id}`);
    } else if (!activePage || activePage === 'home') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `/${activePage}`);
    }
  };

  const handleSelectAgent = (agent: Agent) => {
    setSelectedProperty(null);
    setSelectedAgent(agent);
    setActivePage('agent-profile');
    window.history.pushState(null, '', `/agents/${agent.id}`);
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
        activePage={activePage === 'agent-profile' ? 'home' : activePage}
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
            onOpenJoinModal={() => setJoinModalOpen(true)}
            lang={lang}
          />
        )}

        {activePage === 'properties' && (
          <PropertiesPage
            onSelectProperty={handleSelectProperty}
            onNavigateToMap={() => handleNavigate('map')}
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

        {activePage === 'map' && (
          <MapPage
            onSelectProperty={handleSelectProperty}
            onNavigateToGrid={() => handleNavigate('properties')}
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

        {activePage === 'inbox' && (
          <InboxPage lang={lang} />
        )}
      </div>

      {/* Global Footer (hidden on interactive map page to allow full viewport layout) */}
      {activePage !== 'map' && <Footer onNavigate={handleNavigate} lang={lang} />}

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

      {/* Join New Era - In-Person Office Interview Modal */}
      <JoinTeamModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};
