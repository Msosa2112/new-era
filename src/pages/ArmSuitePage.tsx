import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  LogOut,
  Moon,
  RotateCcw,
  Sun,
} from 'lucide-react';
import { AGENTS_DATA } from '../data/agentsData';
import { Agent, Property } from '../types/property';
import { propertyService } from '../services/propertyService';
import {
  ArmSessionAgent,
  ArmSessionData,
  ArmState,
  ArmTabId,
  ArmThemeMode,
} from '../types/arm';
import { getArmPalette } from '../components/arm/armTheme';
import {
  getArmState,
  resetArmDemoState,
  subscribeArmState,
} from '../services/armStore';
import { BrandLogo } from '../components/common/BrandLogo';
import { ArmLoginView } from '../components/arm/ArmLoginView';
import { ArmBrokerDashboard } from '../components/arm/ArmBrokerDashboard';
import { ArmBrokerPropertiesView } from '../components/arm/ArmBrokerPropertiesView';
import {
  ArmBrokerFinanceView,
  CommissionDraftInput,
} from '../components/arm/ArmBrokerFinanceView';
import { ArmOmnichannelInbox } from '../components/arm/ArmOmnichannelInbox';
import { ArmDealRoomView } from '../components/arm/ArmDealRoomView';
import { ArmCreativeStudio } from '../components/arm/ArmCreativeStudio';
import { ArmCmaCalculator } from '../components/arm/ArmCmaCalculator';

interface ArmSuitePageProps {
  lang: 'en' | 'es';
  onToggleLang: () => void;
  onExit: () => void;
}

const SESSION_STORAGE_KEY = 'newera_inbox_session_v1';
const THEME_STORAGE_KEY = 'newera_arm_theme_v1';

function agentToSessionAgent(agent: Agent): ArmSessionAgent {
  const corporateEmail = agent.email.includes('@neweraky.com')
    ? agent.email
    : `${agent.id.split('-')[0]}@neweraky.com`;
  return {
    id: agent.id,
    name: agent.name,
    title: agent.title,
    licenseNumber: agent.licenseNumber,
    phone: agent.phone,
    corporateEmail,
    personalEmail: agent.personalEmail,
    photoUrl: agent.photoUrl,
    photoNobgUrl: agent.photoNobgUrl,
    isOfficeAdmin:
      agent.id === 'yeilen-contreras' || agent.id === 'rebeca-lopez-portuondo',
  };
}

export const ArmSuitePage: React.FC<ArmSuitePageProps> = ({
  lang,
  onToggleLang,
  onExit,
}) => {
  const [session, setSession] = useState<ArmSessionData | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token && parsed?.agent) {
          return {
            token: parsed.token,
            isAdmin: Boolean(parsed.isAdmin),
            agent: parsed.agent,
          };
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [themeMode, setThemeMode] = useState<ArmThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [suiteLang, setSuiteLang] = useState<'en' | 'es'>('es');
  const effectiveLang = suiteLang || lang;

  const [armState, setArmState] = useState<ArmState>(() => getArmState());
  const [properties, setProperties] = useState<Property[]>([]);
  const [allAgents] = useState<Agent[]>(() => propertyService.getAgents());

  const [activeTab, setActiveTab] = useState<ArmTabId>('home');
  const [impersonatedAgentId, setImpersonatedAgentId] = useState<string>('');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [commissionDraft, setCommissionDraft] =
    useState<CommissionDraftInput | null>(null);

  const [toastText, setToastText] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeArmState((next) => setArmState(next));
    return unsub;
  }, []);

  useEffect(() => {
    let mounted = true;
    propertyService
      .getProperties()
      .then((list) => {
        if (mounted && Array.isArray(list)) {
          setProperties(list);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const showToast = (text: string) => {
    setToastText(text);
    setTimeout(() => {
      setToastText((prev) => (prev === text ? null : prev));
    }, 3200);
  };

  const handleToggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  };

  const handleToggleSuiteLang = () => {
    setSuiteLang((prev) => (prev === 'es' ? 'en' : 'es'));
    onToggleLang();
  };

  const handleAuthenticated = (nextSession: ArmSessionData) => {
    setSession(nextSession);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    setImpersonatedAgentId('');
    setActiveTab('home');
    showToast(
      effectiveLang === 'es'
        ? `Bienvenida/o, ${nextSession.agent.name}`
        : `Welcome, ${nextSession.agent.name}`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
    setImpersonatedAgentId('');
    setActiveTab('home');
  };

  const palette = useMemo(() => getArmPalette(themeMode), [themeMode]);

  const activeAgent: ArmSessionAgent | null = useMemo(() => {
    if (!session) return null;
    if (session.isAdmin && impersonatedAgentId) {
      const found = AGENTS_DATA.find((a) => a.id === impersonatedAgentId);
      if (found) return agentToSessionAgent(found);
    }
    return session.agent;
  }, [session, impersonatedAgentId]);

  if (!session || !activeAgent) {
    return (
      <ArmLoginView
        lang={effectiveLang}
        themeMode={themeMode}
        palette={palette}
        onToggleTheme={handleToggleTheme}
        onToggleLang={handleToggleSuiteLang}
        onExit={onExit}
        onAuthenticated={handleAuthenticated}
      />
    );
  }

  const isImpersonating = Boolean(session.isAdmin && impersonatedAgentId);
  const isBrokerView = Boolean(session.isAdmin && !impersonatedAgentId);
  const isHomeScreen = activeTab === 'home' || activeTab === 'broker';

  const sectionTitleMap: Record<ArmTabId, { es: string; en: string }> = {
    home: { es: 'Menú Principal', en: 'Main Menu' },
    broker: { es: 'Menú Principal', en: 'Main Menu' },
    properties: { es: 'Propiedades', en: 'Properties' },
    finance: { es: 'Pagos y Caja', en: 'Payments & Cash' },
    messages: { es: 'Mensajes', en: 'Messages' },
    deals: { es: 'Contratos', en: 'Contracts' },
    studio: { es: 'Crear Imagen', en: 'Create Flyer' },
    cma: { es: 'Calcular Precio', en: 'Home Value' },
  };

  const handleNavigateTab = (tabId: ArmTabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: palette.bgApp,
        color: palette.text,
        fontFamily: 'var(--font-sans)',
        paddingBottom: '3.5rem',
      }}
    >
      {/* Clean Minimal Top Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          backgroundColor: palette.bgHeader,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${palette.stoneBorder}`,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.85rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              type="button"
              onClick={onExit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                height: '44px',
                padding: '0 0.9rem',
                borderRadius: '10px',
                border: `1.5px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} />
              <span>{effectiveLang === 'es' ? 'Web' : 'Site'}</span>
            </button>

            <BrandLogo
              variant={themeMode === 'dark' ? 'full-champagne' : 'full-burgundy'}
              height={36}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                height: '44px',
                padding: '0 0.85rem 0 0.35rem',
                borderRadius: '999px',
                backgroundColor: palette.bgSubtle,
                border: `1px solid ${palette.stoneBorder}`,
              }}
            >
              <img
                src={activeAgent.photoUrl}
                alt={activeAgent.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: palette.text }}>
                {activeAgent.name.split(' ')[0]}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleSuiteLang}
              style={{
                height: '44px',
                padding: '0 0.85rem',
                borderRadius: '10px',
                border: `1px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {effectiveLang === 'es' ? 'EN' : 'ES'}
            </button>

            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label="Cambiar color de pantalla"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                border: `1px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {themeMode === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              type="button"
              onClick={() => {
                resetArmDemoState();
                showToast(
                  effectiveLang === 'es'
                    ? 'Datos reiniciados al estado inicial'
                    : 'Demo data reset'
                );
              }}
              aria-label="Reiniciar datos"
              title="Reiniciar datos de prueba"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                border: `1px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgSubtle,
                color: palette.text,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={17} />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Salir"
              title={effectiveLang === 'es' ? 'Cambiar de persona' : 'Sign out'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                height: '44px',
                padding: '0 0.9rem',
                borderRadius: '10px',
                border: `1px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgPanel,
                color: palette.text,
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LogOut size={16} />
              <span>{effectiveLang === 'es' ? 'Salir' : 'Exit'}</span>
            </button>
          </div>
        </div>

        {/* Impersonation Active Banner */}
        {isImpersonating && (
          <div
            style={{
              backgroundColor: palette.brand,
              color: palette.brandTextOnPrimary,
              padding: '0.65rem 1.25rem',
              fontSize: '0.96rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <span>
              {effectiveLang === 'es'
                ? `Viendo la pantalla de ${activeAgent.name}`
                : `Viewing ${activeAgent.name}'s screen`}
            </span>
            <button
              type="button"
              onClick={() => {
                setImpersonatedAgentId('');
                setActiveTab('home');
              }}
              style={{
                height: '38px',
                padding: '0 1rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: '#FFFFFF',
                color: '#121418',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {effectiveLang === 'es'
                ? `Volver a ${session.agent.name.split(' ')[0]} (Broker)`
                : 'Return to Broker'}
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.25rem 2.5rem' }}>
        {/* Giant Unmistakable Back Button + Section Title when inside any sub-module */}
        {!isHomeScreen && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
              paddingBottom: '1.1rem',
              borderBottom: `1.5px solid ${palette.stoneBorder}`,
            }}
          >
            <button
              type="button"
              onClick={() => handleNavigateTab('home')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                minHeight: '54px',
                padding: '0.85rem 1.45rem',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: palette.brand,
                color: palette.brandTextOnPrimary,
                fontSize: '1.08rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: palette.shadow,
              }}
            >
              <ArrowLeft size={21} />
              <span>
                {effectiveLang === 'es' ? 'Volver al Menú Principal' : 'Back to Main Menu'}
              </span>
            </button>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.7rem, 3vw, 2.2rem)',
                fontWeight: 700,
                color: palette.text,
                margin: 0,
              }}
            >
              {effectiveLang === 'es'
                ? sectionTitleMap[activeTab].es
                : sectionTitleMap[activeTab].en}
            </h1>
          </div>
        )}

        {/* HOME MENU */}
        {isHomeScreen && (
          <ArmBrokerDashboard
            lang={effectiveLang}
            palette={palette}
            activeAgent={activeAgent}
            isBrokerView={isBrokerView}
            allAgents={allAgents}
            armState={armState}
            onImpersonateAgent={(agentId) => {
              setImpersonatedAgentId(agentId);
              setActiveTab('home');
              const target = AGENTS_DATA.find((a) => a.id === agentId);
              showToast(`Mostrando pantalla de ${target?.name || 'Agente'}`);
            }}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'properties' && isBrokerView && (
          <ArmBrokerPropertiesView
            lang={effectiveLang}
            palette={palette}
            allAgents={allAgents}
            properties={properties}
            armState={armState}
            onOpenDeal={(dealId) => {
              setSelectedDealId(dealId);
              setActiveTab('deals');
            }}
            onOpenCommissionForProperty={(draft) => {
              setCommissionDraft(draft);
              setActiveTab('finance');
            }}
            onImpersonateAgent={(agentId) => {
              setImpersonatedAgentId(agentId);
              setActiveTab('home');
              const target = AGENTS_DATA.find((a) => a.id === agentId);
              showToast(`Mostrando pantalla de ${target?.name || 'Agente'}`);
            }}
            onToast={showToast}
          />
        )}

        {activeTab === 'finance' && isBrokerView && (
          <ArmBrokerFinanceView
            lang={effectiveLang}
            palette={palette}
            allAgents={allAgents}
            properties={properties}
            armState={armState}
            draftProperty={commissionDraft}
            onClearDraft={() => setCommissionDraft(null)}
            onToast={showToast}
          />
        )}

        {activeTab === 'messages' && (
          <ArmOmnichannelInbox
            lang={effectiveLang}
            palette={palette}
            activeAgent={activeAgent}
            isBrokerGlobalView={isBrokerView}
            sessionToken={session.token}
            armState={armState}
            properties={properties}
            selectedConversationId={selectedConvId}
            onSelectConversation={setSelectedConvId}
            onToast={showToast}
          />
        )}

        {activeTab === 'deals' && (
          <ArmDealRoomView
            lang={effectiveLang}
            palette={palette}
            activeAgent={activeAgent}
            isBrokerGlobalView={isBrokerView}
            armState={armState}
            properties={properties}
            selectedDealId={selectedDealId}
            onSelectDeal={setSelectedDealId}
            onToast={showToast}
          />
        )}

        {activeTab === 'studio' && (
          <ArmCreativeStudio
            lang={effectiveLang}
            palette={palette}
            activeAgent={activeAgent}
            armState={armState}
            properties={properties}
            onToast={showToast}
          />
        )}

        {activeTab === 'cma' && (
          <ArmCmaCalculator
            lang={effectiveLang}
            palette={palette}
            activeAgent={activeAgent}
            properties={properties}
            onCreatedDeal={(dealId) => {
              setSelectedDealId(dealId);
              setActiveTab('deals');
            }}
            onToast={showToast}
          />
        )}
      </main>

      {/* Sober Charcoal Toast Notification */}
      {toastText && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 4000,
            maxWidth: '420px',
            padding: '1rem 1.3rem',
            borderRadius: '14px',
            backgroundColor: '#121418',
            color: '#FFFFFF',
            fontSize: '0.98rem',
            fontWeight: 700,
            boxShadow: palette.shadowLg,
          }}
        >
          {toastText}
        </div>
      )}

      <style>{`
        @media print {
          header {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
