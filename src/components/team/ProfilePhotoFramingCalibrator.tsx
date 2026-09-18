import React, { useState, useEffect } from 'react';
import { Agent } from '../../types/property';
import {
  ProfileAgentFraming,
  DEFAULT_PROFILE_FRAMING,
  DESKTOP_PROFILE_FRAMING,
  MOBILE_PROFILE_FRAMING
} from '../../data/agentFramingConfig';
import {
  Sliders,
  X,
  RotateCcw,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Monitor,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface ProfilePhotoFramingCalibratorProps {
  agents: Agent[];
  currentAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
  desktopFramingMap: Record<string, ProfileAgentFraming>;
  mobileFramingMap: Record<string, ProfileAgentFraming>;
  onUpdateFraming: (agentId: string, updates: Partial<ProfileAgentFraming>, mode: 'desktop' | 'mobile') => void;
  onResetAgent: (agentId: string, mode: 'desktop' | 'mobile') => void;
  onResetAll: (mode: 'desktop' | 'mobile') => void;
}

export const ProfilePhotoFramingCalibrator: React.FC<ProfilePhotoFramingCalibratorProps> = ({
  agents,
  currentAgent,
  onSelectAgent,
  desktopFramingMap,
  mobileFramingMap,
  onUpdateFraming,
  onResetAgent,
  onResetAll
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  // Auto-detect mobile viewport on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 768) {
        setDeviceMode('mobile');
      } else {
        setDeviceMode('desktop');
      }
    }
  }, []);

  const currentIndex = agents.findIndex((a) => a.id === currentAgent.id);
  const isMobileMode = deviceMode === 'mobile';
  const currentMap = isMobileMode ? mobileFramingMap : desktopFramingMap;
  const currentDefaults = isMobileMode ? MOBILE_PROFILE_FRAMING : DESKTOP_PROFILE_FRAMING;
  const resolved: ProfileAgentFraming =
    currentMap[currentAgent.id] || currentDefaults[currentAgent.id] || DEFAULT_PROFILE_FRAMING;

  const updateProp = (key: keyof ProfileAgentFraming, value: number) => {
    onUpdateFraming(currentAgent.id, { [key]: value }, deviceMode);
  };

  const handleCopyJSON = () => {
    const dataToExport = isMobileMode ? mobileFramingMap : desktopFramingMap;
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 1rem',
            backgroundColor: '#660E1A',
            color: '#FFFFFF',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(102, 14, 26, 0.35)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(102, 14, 26, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 14, 26, 0.35)';
          }}
        >
          <Sliders size={14} />
          <span>Ajustar Foto & Degradado</span>
        </button>
      )}

      {/* FLOATING CALIBRATION DOCK */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '0.75rem',
            right: '0.75rem',
            width: 'clamp(280px, 90vw, 340px)',
            maxHeight: isCollapsed ? 'auto' : 'calc(100vh - 1.5rem)',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(203, 213, 225, 0.85)',
            borderRadius: '0.85rem',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'inherit',
            fontSize: '0.75rem',
            animation: 'framerPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: '0.5rem 0.75rem',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Sliders size={14} color="#660E1A" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                Calibrar Foto ({deviceMode.toUpperCase()})
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  cursor: 'pointer'
                }}
                title={isCollapsed ? 'Expandir' : 'Minimizar'}
              >
                {isCollapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  cursor: 'pointer'
                }}
                title="Cerrar"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {!isCollapsed && (
            <>
              {/* DEVICE MODE SWITCH (DESKTOP vs MOBILE) */}
              <div
                style={{
                  display: 'flex',
                  padding: '0.4rem 0.75rem',
                  backgroundColor: '#F1F5F9',
                  borderBottom: '1px solid #E2E8F0',
                  gap: '0.35rem'
                }}
              >
                <button
                  onClick={() => setDeviceMode('desktop')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    padding: '0.35rem',
                    borderRadius: '5px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: !isMobileMode ? '#660E1A' : '#FFFFFF',
                    color: !isMobileMode ? '#FFFFFF' : '#64748B',
                    boxShadow: !isMobileMode ? '0 2px 6px rgba(102, 14, 26, 0.2)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <Monitor size={12} />
                  <span>Desktop</span>
                </button>

                <button
                  onClick={() => setDeviceMode('mobile')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    padding: '0.35rem',
                    borderRadius: '5px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: isMobileMode ? '#660E1A' : '#FFFFFF',
                    color: isMobileMode ? '#FFFFFF' : '#64748B',
                    boxShadow: isMobileMode ? '0 2px 6px rgba(102, 14, 26, 0.2)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <Smartphone size={12} />
                  <span>Mobile</span>
                </button>
              </div>

              {/* AGENT SELECTOR BAR */}
              <div
                style={{
                  padding: '0.4rem 0.75rem',
                  backgroundColor: '#FFFFFF',
                  borderBottom: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.35rem'
                }}
              >
                <button
                  onClick={() =>
                    onSelectAgent(agents[(currentIndex - 1 + agents.length) % agents.length])
                  }
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#475569'
                  }}
                  title="Anterior"
                >
                  <ChevronLeft size={13} />
                </button>

                <select
                  value={currentAgent.id}
                  onChange={(e) => {
                    const found = agents.find((a) => a.id === e.target.value);
                    if (found) onSelectAgent(found);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.3rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#1E293B',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {agents.map((ag, i) => (
                    <option key={ag.id} value={ag.id}>
                      {i + 1}. {ag.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => onSelectAgent(agents[(currentIndex + 1) % agents.length])}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#475569'
                  }}
                  title="Siguiente"
                >
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* SLIDERS BODY */}
              <div
                style={{
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  overflowY: 'auto',
                  maxHeight: '380px'
                }}
              >
                {/* Scale */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.2rem',
                      color: '#334155'
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>🔍 Escala (Zoom)</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#660E1A' }}>
                      {resolved.scale.toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.2"
                    step="0.01"
                    value={resolved.scale}
                    onChange={(e) => updateProp('scale', parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#660E1A', cursor: 'pointer' }}
                  />
                </div>

                {/* Offset Y */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.2rem',
                      color: '#334155'
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>↕️ Posición Vertical (Y)</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#660E1A' }}>
                      {resolved.offsetY}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={resolved.offsetY}
                    onChange={(e) => updateProp('offsetY', parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#660E1A', cursor: 'pointer' }}
                  />
                </div>

                {/* Offset X */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.2rem',
                      color: '#334155'
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>↔️ Posición Horizontal (X)</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#660E1A' }}>
                      {resolved.offsetX}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-120"
                    max="120"
                    step="1"
                    value={resolved.offsetX}
                    onChange={(e) => updateProp('offsetX', parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#660E1A', cursor: 'pointer' }}
                  />
                </div>

                {/* DEGRADADO INFERIOR / GRADIENT FADE CONTROLS */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.55rem',
                    marginTop: '0.15rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0F172A', fontWeight: 700 }}>
                    <Sparkles size={12} color="#E64A2A" />
                    <span>Control de Degradado Inferior</span>
                  </div>

                  {/* Fade Start % */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.15rem',
                        color: '#475569'
                      }}
                    >
                      <span>🌫️ Inicio Difuminado (Fade Start)</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#E64A2A' }}>
                        {resolved.fadeStart}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="95"
                      step="1"
                      value={resolved.fadeStart}
                      onChange={(e) => updateProp('fadeStart', parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#E64A2A', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Fade End % */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.15rem',
                        color: '#475569'
                      }}
                    >
                      <span>🏁 Fin Difuminado (Transparente)</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#E64A2A' }}>
                        {resolved.fadeEnd}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="100"
                      step="1"
                      value={resolved.fadeEnd}
                      onChange={(e) => updateProp('fadeEnd', parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#E64A2A', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div
                style={{
                  padding: '0.5rem 0.75rem',
                  borderTop: '1px solid #F1F5F9',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.35rem'
                }}
              >
                <button
                  onClick={() => onResetAgent(currentAgent.id, deviceMode)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.35rem 0.55rem',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Restablecer este asesor"
                >
                  <RotateCcw size={11} />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleCopyJSON}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.65rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: copied ? '#10B981' : '#660E1A',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? '¡Copiado!' : `Copiar JSON (${deviceMode})`}</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
