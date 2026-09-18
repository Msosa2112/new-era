import React, { useState, useEffect } from 'react';
import { Agent } from '../../types/property';
import { AgentFraming, DEFAULT_FRAMING, DESKTOP_AGENT_FRAMING, MOBILE_AGENT_FRAMING } from '../../data/agentFramingConfig';
import { Sliders, X, RotateCcw, Copy, Check, ChevronLeft, ChevronRight, Smartphone, Monitor, ZoomIn, Move, ChevronDown, ChevronUp } from 'lucide-react';

interface PhotoFramingCalibratorProps {
  agents: Agent[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  desktopFramingMap: Record<string, AgentFraming>;
  mobileFramingMap: Record<string, AgentFraming>;
  onUpdateFraming: (agentId: string, updates: Partial<AgentFraming>, mode: 'desktop' | 'mobile') => void;
  onResetAgent: (agentId: string, mode: 'desktop' | 'mobile') => void;
  onResetAll: (mode: 'desktop' | 'mobile') => void;
}

export const PhotoFramingCalibrator: React.FC<PhotoFramingCalibratorProps> = ({
  agents,
  activeIndex,
  onSelectIndex,
  desktopFramingMap,
  mobileFramingMap,
  onUpdateFraming,
  onResetAgent,
  onResetAll
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'protagonist' | 'avatar'>('protagonist');
  const [copied, setCopied] = useState(false);

  // Auto-detect mobile on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 768) {
        setDeviceMode('mobile');
      } else {
        setDeviceMode('desktop');
      }
    }
  }, []);

  const currentAgent = agents[activeIndex];
  if (!currentAgent) return null;

  const isMobileMode = deviceMode === 'mobile';
  const currentMap = isMobileMode ? mobileFramingMap : desktopFramingMap;
  const currentDefaults = isMobileMode ? MOBILE_AGENT_FRAMING : DESKTOP_AGENT_FRAMING;
  const resolved: AgentFraming = currentMap[currentAgent.id] || currentDefaults[currentAgent.id] || DEFAULT_FRAMING;

  // Helper to update based on current mode
  const updateProp = (key: keyof AgentFraming, value: number) => {
    onUpdateFraming(currentAgent.id, { [key]: value }, deviceMode);
  };

  const handleCopyJSON = () => {
    const dataToExport = isMobileMode ? mobileFramingMap : desktopFramingMap;
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJSON = () => {
    const dataToExport = isMobileMode ? mobileFramingMap : desktopFramingMap;
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentFraming_${deviceMode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (COMPACT) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '0.85rem',
            right: '0.85rem',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.85rem',
            backgroundColor: '#660E1A',
            color: '#FFFFFF',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '9999px',
            fontSize: '0.74rem',
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
          <Sliders size={13} />
          <span>Ajustar Encuadre</span>
        </button>
      )}

      {/* FLOATING CALIBRATION DOCK (ULTRA COMPACT) */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '0.75rem',
            right: '0.75rem',
            width: 'clamp(260px, 86vw, 315px)',
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
              padding: '0.45rem 0.65rem',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={13} color="#660E1A" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                Calibrador ({deviceMode.toUpperCase()})
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
                  padding: '0.35rem 0.65rem',
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
                    gap: '0.25rem',
                    padding: '0.28rem',
                    borderRadius: '5px',
                    fontSize: '0.72rem',
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
                  <span>Desktop (1)</span>
                </button>

                <button
                  onClick={() => setDeviceMode('mobile')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    padding: '0.28rem',
                    borderRadius: '5px',
                    fontSize: '0.72rem',
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
                  <span>Mobile (2)</span>
                </button>
              </div>

              {/* AGENT SELECTOR BAR */}
              <div
                style={{
                  padding: '0.35rem 0.65rem',
                  backgroundColor: '#FFFFFF',
                  borderBottom: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.35rem'
                }}
              >
                <button
                  onClick={() => onSelectIndex((activeIndex - 1 + agents.length) % agents.length)}
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
                  value={activeIndex}
                  onChange={(e) => onSelectIndex(Number(e.target.value))}
                  style={{
                    flex: 1,
                    padding: '0.25rem 0.4rem',
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
                    <option key={ag.id} value={i}>
                      {i + 1}. {ag.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => onSelectIndex((activeIndex + 1) % agents.length)}
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

              {/* TABS (PROTAGONISTA / AVATAR CIRCULAR) */}
              <div
                style={{
                  display: 'flex',
                  padding: '0.25rem 0.65rem 0',
                  backgroundColor: '#FFFFFF',
                  gap: '0.35rem'
                }}
              >
                <button
                  onClick={() => setActiveTab('protagonist')}
                  style={{
                    flex: 1,
                    padding: '0.3rem 0',
                    fontSize: '0.74rem',
                    fontWeight: activeTab === 'protagonist' ? 700 : 500,
                    color: activeTab === 'protagonist' ? '#660E1A' : '#64748B',
                    borderBottom: activeTab === 'protagonist' ? '2px solid #660E1A' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Foto Principal
                </button>
                <button
                  onClick={() => setActiveTab('avatar')}
                  style={{
                    flex: 1,
                    padding: '0.3rem 0',
                    fontSize: '0.74rem',
                    fontWeight: activeTab === 'avatar' ? 700 : 500,
                    color: activeTab === 'avatar' ? '#660E1A' : '#64748B',
                    borderBottom: activeTab === 'avatar' ? '2px solid #660E1A' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Círculos
                </button>
              </div>

              {/* SLIDERS BODY */}
              <div
                style={{
                  padding: '0.65rem 0.65rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                {activeTab === 'protagonist' ? (
                  <>
                    {/* PROTAGONIST: SCALE */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ZoomIn size={12} color="#660E1A" /> Zoom ({deviceMode})
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#660E1A', fontFamily: 'monospace' }}>
                          {Math.round(resolved.scale * 100)}%
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <button
                          onClick={() => updateProp('scale', Math.max(0.5, Number((resolved.scale - 0.02).toFixed(2))))}
                          style={{ padding: '0.12rem 0.3rem', fontSize: '0.65rem', borderRadius: '3px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                        >
                          -2%
                        </button>
                        <input
                          type="range"
                          min="0.5"
                          max="2.0"
                          step="0.01"
                          value={resolved.scale}
                          onChange={(e) => updateProp('scale', parseFloat(e.target.value))}
                          style={{ flex: 1, accentColor: '#660E1A', cursor: 'pointer', height: '4px' }}
                        />
                        <button
                          onClick={() => updateProp('scale', Math.min(2.0, Number((resolved.scale + 0.02).toFixed(2))))}
                          style={{ padding: '0.12rem 0.3rem', fontSize: '0.65rem', borderRadius: '3px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                        >
                          +2%
                        </button>
                      </div>
                    </div>

                    {/* PROTAGONIST: OFFSET X */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Move size={12} color="#660E1A" /> Posición X
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#660E1A', fontFamily: 'monospace' }}>
                          {resolved.offsetX > 0 ? `+${resolved.offsetX}` : resolved.offsetX} px
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <button
                          onClick={() => updateProp('offsetX', resolved.offsetX - 10)}
                          style={{ padding: '0.12rem 0.25rem', fontSize: '0.65rem', borderRadius: '3px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                          title="Mover -10px"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => updateProp('offsetX', resolved.offsetX - 1)}
                          style={{ padding: '0.12rem 0.25rem', fontSize: '0.65rem', borderRadius: '3px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                          title="Mover -1px"
                        >
                          -1
                        </button>
                        <input
                          type="range"
                          min="-250"
                          max="250"
                          step="1"
                          value={resolved.offsetX}
                          onChange={(e) => updateProp('offsetX', parseInt(e.target.value, 10))}
                          style={{ flex: 1, accentColor: '#660E1A', cursor: 'pointer', height: '4px' }}
                        />
                        <button
                          onClick={() => updateProp('offsetX', resolved.offsetX + 1)}
                          style={{ padding: '0.12rem 0.25rem', fontSize: '0.65rem', borderRadius: '3px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                          title="Mover +1px"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => updateProp('offsetX', resolved.offsetX + 10)}
                          style={{ padding: '0.12rem 0.25rem', fontSize: '0.65rem', borderRadius: '3px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                          title="Mover +10px"
                        >
                          +10
                        </button>
                      </div>
                    </div>

                    {/* PROTAGONIST: OFFSET Y */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Move size={12} color="#660E1A" /> Posición Y
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#660E1A', fontFamily: 'monospace' }}>
                          {resolved.offsetY > 0 ? `+${resolved.offsetY}` : resolved.offsetY} px
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <button
                          onClick={() => updateProp('offsetY', resolved.offsetY - 10)}
                          style={{ padding: '0.12rem 0.25rem', fontSize: '0.65rem', borderRadius: '3px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                          title="Subir -10px"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => updateProp('offsetY', resolved.offsetY - 1)}
                          style={{ padding: '0.12rem 0.25rem', fontSize: '0.65rem', borderRadius: '3px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                          title="Subir -1px"
                        >
                          -1
                        </button>
                        <input
                          type="range"
                          min="-250"
                          max="250"
                          step="1"
                          value={resolved.offsetY}
                          onChange={(e) => updateProp('offsetY', parseInt(e.target.value, 10))}
                          style={{ flex: 1, accentColor: '#660E1A', cursor: 'pointer', height: '4px' }}
                        />
                        <button
                          onClick={() => updateProp('offsetY', resolved.offsetY + 1)}
                          style={{ padding: '0.12rem 0.25rem', fontSize: '0.65rem', borderRadius: '3px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                          title="Bajar +1px"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => updateProp('offsetY', resolved.offsetY + 10)}
                          style={{ padding: '0.12rem 0.25rem', fontSize: '0.65rem', borderRadius: '3px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                          title="Bajar +10px"
                        >
                          +10
                        </button>
                      </div>
                    </div>

                    {/* PROTAGONIST: HEIGHT PERCENT */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155' }}>
                          Altura %
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#660E1A', fontFamily: 'monospace' }}>
                          {resolved.heightPercent}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="70"
                        max="140"
                        step="1"
                        value={resolved.heightPercent}
                        onChange={(e) => updateProp('heightPercent', parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: '#660E1A', cursor: 'pointer', height: '4px' }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* AVATAR: ZOOM */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ZoomIn size={12} color="#660E1A" /> Zoom Avatar ({deviceMode})
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#660E1A', fontFamily: 'monospace' }}>
                          {Math.round(resolved.avatarZoom * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="2.5"
                        step="0.05"
                        value={resolved.avatarZoom}
                        onChange={(e) => updateProp('avatarZoom', parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: '#660E1A', cursor: 'pointer', height: '4px' }}
                      />
                    </div>

                    {/* AVATAR: OBJECT POSITION X */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155' }}>
                          Encuadre X (%)
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#660E1A', fontFamily: 'monospace' }}>
                          {resolved.avatarX}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={resolved.avatarX}
                        onChange={(e) => updateProp('avatarX', parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: '#660E1A', cursor: 'pointer', height: '4px' }}
                      />
                    </div>

                    {/* AVATAR: OBJECT POSITION Y */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155' }}>
                          Rostro / Y (%)
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#660E1A', fontFamily: 'monospace' }}>
                          {resolved.avatarY}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={resolved.avatarY}
                        onChange={(e) => updateProp('avatarY', parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: '#660E1A', cursor: 'pointer', height: '4px' }}
                      />
                    </div>
                  </>
                )}

                {/* RESET BUTTONS */}
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <button
                    onClick={() => onResetAgent(currentAgent.id, deviceMode)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem',
                      padding: '0.3rem',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: '#64748B',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCcw size={10} />
                    Reset {deviceMode}
                  </button>

                  <button
                    onClick={() => onResetAll(deviceMode)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem',
                      padding: '0.3rem 0.5rem',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: '#EF4444',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FEE2E2',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    title="Restablecer todos a valores por defecto"
                  >
                    Todos
                  </button>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div
                style={{
                  padding: '0.45rem 0.65rem',
                  backgroundColor: '#F8FAFC',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  gap: '0.35rem'
                }}
              >
                <button
                  onClick={handleCopyJSON}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    padding: '0.38rem 0.5rem',
                    backgroundColor: copied ? '#10B981' : '#660E1A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? '¡Copiado!' : `Copiar JSON (${deviceMode})`}</span>
                </button>

                <button
                  onClick={handleDownloadJSON}
                  style={{
                    padding: '0.38rem 0.55rem',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Descargar archivo JSON"
                >
                  Descargar
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
