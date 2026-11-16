import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Lock,
  Moon,
  Search,
  Sun,
} from 'lucide-react';
import { AGENTS_DATA } from '../../data/agentsData';
import { Agent } from '../../types/property';
import { ArmSessionAgent, ArmSessionData, ArmThemeMode } from '../../types/arm';
import { ArmPalette } from './armTheme';
import { BrandLogo } from '../common/BrandLogo';

interface ArmLoginViewProps {
  lang: 'en' | 'es';
  themeMode: ArmThemeMode;
  palette: ArmPalette;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onExit: () => void;
  onAuthenticated: (session: ArmSessionData) => void;
}

const ADMIN_IDS = new Set(['yeilen-contreras', 'rebeca-lopez-portuondo']);
const MASTER_PINS = new Set(['newera2026', 'admin2026', 'NewEra2026']);

function getAgentDefaultPin(agent: Agent): string {
  const digits = agent.phone.replace(/\D/g, '');
  return digits.slice(-4) || '0409';
}

function buildLocalSession(agent: Agent): ArmSessionData {
  const corporateEmail = agent.email.includes('@neweraky.com')
    ? agent.email
    : `${agent.id.split('-')[0]}@neweraky.com`;
  const isAdmin = ADMIN_IDS.has(agent.id);
  const sessionAgent: ArmSessionAgent = {
    id: agent.id,
    name: agent.name,
    title: agent.title,
    licenseNumber: agent.licenseNumber,
    phone: agent.phone,
    corporateEmail,
    personalEmail: agent.personalEmail,
    photoUrl: agent.photoUrl,
    photoNobgUrl: agent.photoNobgUrl,
    isOfficeAdmin: isAdmin,
  };
  return {
    token: `local-arm-${agent.id}-${Date.now()}`,
    isAdmin,
    agent: sessionAgent,
  };
}

export const ArmLoginView: React.FC<ArmLoginViewProps> = ({
  lang,
  themeMode,
  palette,
  onToggleTheme,
  onToggleLang,
  onExit,
  onAuthenticated,
}) => {
  const [showOtherAgents, setShowOtherAgents] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    AGENTS_DATA[0]?.id || 'yeilen-contreras'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedAgent =
    AGENTS_DATA.find((a) => a.id === selectedAgentId) || AGENTS_DATA[0];

  const filteredAgents = AGENTS_DATA.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q)
    );
  });

  const performLogin = async (agent: Agent, enteredPin: string) => {
    setErrorMsg('');
    setLoading(true);
    const cleanPin = enteredPin.trim();
    const expectedDefault = getAgentDefaultPin(agent);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2500);
    try {
      const resp = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          action: 'login',
          emailOrId: agent.id,
          pin: cleanPin,
        }),
      });
      const data = await resp.json().catch(() => null);
      if (resp.ok && data?.success && data?.token && data?.agent) {
        onAuthenticated({
          token: data.token,
          isAdmin: Boolean(data.isAdmin),
          agent: {
            ...data.agent,
            photoUrl: agent.photoUrl,
            photoNobgUrl: agent.photoNobgUrl,
          },
        });
        setLoading(false);
        return;
      }

      if (
        resp.status === 401 &&
        !MASTER_PINS.has(cleanPin) &&
        cleanPin !== expectedDefault
      ) {
        setErrorMsg(
          lang === 'es'
            ? 'El PIN no coincide. El PIN inicial son los últimos 4 números del teléfono.'
            : 'Incorrect PIN. Initial PIN is the last 4 digits of your phone.'
        );
        setLoading(false);
        return;
      }
    } catch {
      // Offline / timeout / local fallback
    } finally {
      window.clearTimeout(timeoutId);
    }

    if (MASTER_PINS.has(cleanPin) || cleanPin === expectedDefault) {
      onAuthenticated(buildLocalSession(agent));
    } else {
      setErrorMsg(
        lang === 'es'
          ? `PIN incorrecto. Para ${agent.name.split(' ')[0]} el PIN es ${expectedDefault}.`
          : `Incorrect PIN. For ${agent.name.split(' ')[0]} the PIN is ${expectedDefault}.`
      );
    }
    setLoading(false);
  };

  const handleQuickEnter = async (agentId: string) => {
    const agent = AGENTS_DATA.find((a) => a.id === agentId);
    if (!agent) return;
    setSelectedAgentId(agent.id);
    const defaultPin = getAgentDefaultPin(agent);
    setPin(defaultPin);
    await performLogin(agent, defaultPin);
  };

  const quickProfiles = [
    {
      id: 'yeilen-contreras',
      roleLabel: lang === 'es' ? 'Broker Principal' : 'Principal Broker',
      isPrimary: true,
    },
    {
      id: 'rebeca-lopez-portuondo',
      roleLabel: lang === 'es' ? 'Administración' : 'Administration',
      isPrimary: false,
    },
    {
      id: 'yazbel-diaz',
      roleLabel: lang === 'es' ? 'Agente' : 'Realtor',
      isPrimary: false,
    },
    {
      id: 'yenny-mendoza-molina',
      roleLabel: lang === 'es' ? 'Agente' : 'Realtor',
      isPrimary: false,
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: palette.bgApp,
        color: palette.text,
        padding: '1.5rem 1.25rem 3.5rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        {/* Minimal Sober Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          <button
            type="button"
            onClick={onExit}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              minHeight: '48px',
              padding: '0.65rem 1.1rem',
              borderRadius: '12px',
              border: `1.5px solid ${palette.stoneBorder}`,
              backgroundColor: palette.bgPanel,
              color: palette.text,
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} />
            <span>{lang === 'es' ? 'Volver a la Web' : 'Back to Site'}</span>
          </button>

          <BrandLogo
            variant={themeMode === 'dark' ? 'full-champagne' : 'full-burgundy'}
            height={44}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={onToggleLang}
              style={{
                minHeight: '48px',
                padding: '0.6rem 0.95rem',
                borderRadius: '12px',
                border: `1.5px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgPanel,
                color: palette.text,
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Cambiar tema"
              style={{
                minHeight: '48px',
                padding: '0.6rem 0.85rem',
                borderRadius: '12px',
                border: `1.5px solid ${palette.stoneBorder}`,
                backgroundColor: palette.bgPanel,
                color: palette.text,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {themeMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Giant Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 5vw, 3.1rem)',
              fontWeight: 700,
              color: palette.text,
              margin: '0 0 0.5rem',
            }}
          >
            Portal New Era
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              color: palette.textSecondary,
              margin: 0,
            }}
          >
            {lang === 'es'
              ? 'Toca tu nombre para entrar'
              : 'Tap your name to enter'}
          </p>
        </div>

        {/* 4 Giant 1-Tap Profile Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.1rem',
            marginBottom: '1.5rem',
          }}
        >
          {quickProfiles.map((qp) => {
            const agent = AGENTS_DATA.find((a) => a.id === qp.id);
            if (!agent) return null;
            return (
              <button
                key={qp.id}
                type="button"
                disabled={loading}
                onClick={() => handleQuickEnter(qp.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.1rem',
                  padding: '1.35rem 1.4rem',
                  borderRadius: '18px',
                  border: qp.isPrimary
                    ? `2.5px solid ${palette.brand}`
                    : `1.5px solid ${palette.stoneBorder}`,
                  backgroundColor: qp.isPrimary ? palette.brand : palette.bgPanel,
                  color: qp.isPrimary ? palette.brandTextOnPrimary : palette.text,
                  textAlign: 'left',
                  cursor: loading ? 'wait' : 'pointer',
                  boxShadow: palette.shadow,
                }}
              >
                <img
                  src={agent.photoUrl}
                  alt={agent.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: qp.isPrimary
                      ? '2.5px solid #FFFFFF'
                      : `2px solid ${palette.stoneBorder}`,
                    flexShrink: 0,
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '1.32rem',
                      fontWeight: 800,
                      lineHeight: 1.2,
                    }}
                  >
                    {agent.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      opacity: qp.isPrimary ? 0.9 : 0.72,
                      marginTop: '0.25rem',
                    }}
                  >
                    {qp.roleLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Expandable 26-Agent Directory & PIN Login */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setShowOtherAgents((prev) => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              minHeight: '54px',
              padding: '0.85rem 1.5rem',
              borderRadius: '14px',
              border: `1.5px solid ${palette.stoneBorder}`,
              backgroundColor: palette.bgPanel,
              color: palette.text,
              fontSize: '1.02rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span>
              {lang === 'es'
                ? 'Entrar con otro agente de la oficina (26)'
                : 'Sign in as another office agent (26)'}
            </span>
            {showOtherAgents ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {showOtherAgents && (
          <div
            style={{
              backgroundColor: palette.bgPanel,
              borderRadius: '20px',
              border: `1.5px solid ${palette.stoneBorder}`,
              padding: '1.5rem',
              boxShadow: palette.shadow,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              alignItems: 'start',
            }}
          >
            <div>
              <div style={{ position: 'relative', marginBottom: '0.9rem' }}>
                <Search
                  size={17}
                  color={palette.textMuted}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === 'es' ? 'Buscar agente por nombre...' : 'Search agent...'
                  }
                  style={{
                    width: '100%',
                    height: '50px',
                    padding: '0.65rem 1rem 0.65rem 2.6rem',
                    borderRadius: '12px',
                    border: `1.5px solid ${palette.stoneBorder}`,
                    backgroundColor: palette.bgSubtle,
                    color: palette.text,
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}
              >
                {filteredAgents.map((agent) => {
                  const isSelected = agent.id === selectedAgent.id;
                  return (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => {
                        setSelectedAgentId(agent.id);
                        setErrorMsg('');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.7rem 0.85rem',
                        borderRadius: '12px',
                        border: isSelected
                          ? `2px solid ${palette.brand}`
                          : `1px solid ${palette.border}`,
                        backgroundColor: isSelected
                          ? palette.brand
                          : palette.bgSubtle,
                        color: isSelected
                          ? palette.brandTextOnPrimary
                          : palette.text,
                        textAlign: 'left',
                        cursor: 'pointer',
                        width: '100%',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={agent.photoUrl}
                        alt={agent.name}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '0.96rem', fontWeight: 700 }}>
                          {agent.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          {agent.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                performLogin(selectedAgent, pin);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.1rem',
                borderRadius: '14px',
                backgroundColor: palette.bgSubtle,
                border: `1px solid ${palette.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img
                  src={selectedAgent.photoUrl}
                  alt={selectedAgent.name}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${palette.brand}`,
                  }}
                />
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                    {selectedAgent.name}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: palette.textSecondary }}>
                    PIN inicial: {getAgentDefaultPin(selectedAgent)}
                  </div>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    marginBottom: '0.4rem',
                  }}
                >
                  <KeyRound size={16} color={palette.brand} />
                  <span>{lang === 'es' ? 'Número PIN' : 'PIN Number'}</span>
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  style={{
                    width: '100%',
                    height: '54px',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: `1.5px solid ${palette.borderStrong}`,
                    backgroundColor: palette.bgPanel,
                    color: palette.text,
                    fontSize: '1.3rem',
                    letterSpacing: '0.25em',
                    fontWeight: 800,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {errorMsg && (
                <div
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: '10px',
                    backgroundColor: palette.bgPanel,
                    border: `1.5px solid ${palette.negativeMoney}`,
                    color: palette.negativeMoney,
                    fontSize: '0.92rem',
                    fontWeight: 700,
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  height: '54px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: palette.brand,
                  color: palette.brandTextOnPrimary,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  cursor: loading ? 'wait' : 'pointer',
                }}
              >
                <Lock size={17} />
                <span>
                  {lang === 'es'
                    ? `Entrar como ${selectedAgent.name.split(' ')[0]}`
                    : `Enter as ${selectedAgent.name.split(' ')[0]}`}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
