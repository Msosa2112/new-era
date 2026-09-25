import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Globe,
  MessageCircle,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';
import { Agent } from '../../types/property';
import { propertyService } from '../../services/propertyService';
import {
  AgentFraming,
  DEFAULT_FRAMING,
  DESKTOP_AGENT_FRAMING,
  MOBILE_AGENT_FRAMING,
  loadSavedDesktopFraming,
  loadSavedMobileFraming
} from '../../data/agentFramingConfig';
import { HexPattern } from '../common/HexPattern';

interface TeamShowcaseSectionProps {
  onSelectAgent: (agent: Agent) => void;
  onNavigate: (page: string) => void;
  lang: 'en' | 'es';
}

export const TeamShowcaseSection: React.FC<TeamShowcaseSectionProps> = ({
  onSelectAgent,
  onNavigate,
  lang
}) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [desktopFramingMap, setDesktopFramingMap] = useState<Record<string, AgentFraming>>(() => loadSavedDesktopFraming());
  const [mobileFramingMap, setMobileFramingMap] = useState<Record<string, AgentFraming>>(() => loadSavedMobileFraming());
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const loaded = propertyService.getAgents();
    setAgents(loaded);
  }, []);

  const total = agents.length;
  const activeAgent = total > 0 ? agents[activeIndex] : null;

  const desktopActiveFraming = activeAgent
    ? desktopFramingMap[activeAgent.id] || DESKTOP_AGENT_FRAMING[activeAgent.id] || DEFAULT_FRAMING
    : DEFAULT_FRAMING;

  const mobileActiveFraming = activeAgent
    ? mobileFramingMap[activeAgent.id] || MOBILE_AGENT_FRAMING[activeAgent.id] || DEFAULT_FRAMING
    : DEFAULT_FRAMING;

  const handlePrev = useCallback(() => {
    if (total === 0 || isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsAnimating(false), 600);
  }, [total, isAnimating]);

  const handleNext = useCallback(() => {
    if (total === 0 || isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsAnimating(false), 600);
  }, [total, isAnimating]);

  const handleSelectIndex = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  if (!activeAgent || total === 0) return null;

  // Calculate left and right peripheral items for desktop (3 on each side)
  const getOffsetIndex = (offset: number) => (activeIndex + offset + total) % total;

  const leftIndices = [getOffsetIndex(-3), getOffsetIndex(-2), getOffsetIndex(-1)];
  const rightIndices = [getOffsetIndex(1), getOffsetIndex(2), getOffsetIndex(3)];

  return (
    <section
      id="team-showcase-section"
      style={{
        position: 'relative',
        backgroundColor: '#FBFBFC',
        color: '#111827',
        overflow: 'hidden',
        padding: 'clamp(4.5rem, 8vw, 8rem) 0 clamp(4.5rem, 7vw, 7.5rem) 0',
        userSelect: 'none'
      }}
    >
      <HexPattern variant="subtle" opacity={0.055} maskFade="none" />

      {/* 1. SECTION HEADER (Minimalist Editorial Subtitle) */}
      <div className="container" style={{ position: 'relative', zIndex: 10, marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)', padding: '0 1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#6B7280',
                display: 'block',
                marginBottom: '0.2rem'
              }}
            >
              {lang === 'es' ? 'EQUIPO / ADVISORS' : 'TEAM MEMBERS'}
            </span>
            <h2
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: '#4B5563',
                margin: 0
              }}
            >
              {lang === 'es' ? 'Las personas detrás de cada propiedad' : 'The people behind the property'}
            </h2>
          </div>
        </div>
      </div>

      {/* 2. OVERSIZED BACKGROUND BRAND VECTOR WATERMARK (From new era solo.svg) */}
      <div
        className="team-watermark"
        style={{
          position: 'absolute',
          top: '29%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '1760px',
          padding: '0 1.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        <svg
          viewBox="0 0 443.85 68.23"
          style={{
            width: 'clamp(420px, 98vw, 1565px)',
            height: 'auto',
            fill: '#E8EAEE',
            overflow: 'visible'
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path d="M47.51 7.95c0,-1.26 -0.28,-2.22 -0.85,-2.89 -0.57,-0.66 -1.7,-1.4 -3.41,-2.22l0 -1.89 12.3 0 0 1.89c-1.7,0.82 -2.84,1.56 -3.41,2.22 -0.57,0.66 -0.85,1.62 -0.85,2.89l0 59.24 -1.42 0c-1.51,0 -2.74,-0.66 -3.69,-1.99l-35.49 -51.48c-0.82,-1.14 -1.45,-1.7 -1.89,-1.7 -0.5,0 -0.76,0.85 -0.76,2.56l0 45.62c0,1.26 0.28,2.22 0.85,2.89 0.57,0.66 1.7,1.4 3.41,2.22l0 1.89 -12.3 0 0 -1.89c1.7,-0.82 2.84,-1.56 3.41,-2.22 0.57,-0.66 0.85,-1.62 0.85,-2.89l0 -52.24c0,-1.26 -0.28,-2.22 -0.85,-2.89 -0.57,-0.66 -1.7,-1.4 -3.41,-2.22l0 -1.89 12.3 0 32.46 45.52c0.76,1.14 1.39,1.7 1.89,1.7 0.57,0 0.85,-0.88 0.85,-2.65l0 -37.57z" />
            <path d="M87.6 30.66c-3.15,0 -4.73,1.58 -4.73,4.73l0 23.28c0,3.15 1.58,4.73 4.73,4.73l11.92 0c4.42,0 8.22,-0.93 11.4,-2.79 3.19,-1.86 5.6,-4.56 7.24,-8.09l1.89 0c-0.82,1.89 -1.48,3.94 -1.99,6.15 -0.5,2.21 -0.76,4.26 -0.76,6.15 0,0.82 -0.28,1.42 -0.85,1.8 -0.57,0.38 -1.26,0.57 -2.08,0.57l-43.82 0 0 -1.89c1.7,-0.82 2.84,-1.56 3.41,-2.22 0.57,-0.66 0.85,-1.62 0.85,-2.89l0 -52.24c0,-1.26 -0.28,-2.22 -0.85,-2.89 -0.57,-0.66 -1.7,-1.4 -3.41,-2.22l0 -1.89 41.92 0c1.7,0 2.68,0.79 2.93,2.37l1.8 10.41 -1.89 0c-1.64,-3.47 -3.14,-5.84 -4.5,-7.1 -1.36,-1.26 -3.08,-1.89 -5.16,-1.89l-18.08 0c-3.15,0 -4.73,1.58 -4.73,4.73l0 12.68c0,3.15 1.58,4.73 4.73,4.73l10.6 0c1.26,0 2.13,-0.44 2.6,-1.33 0.47,-0.88 0.65,-2.49 0.52,-4.83l1.89 0 3.79 21.77 -1.89 0c-0.69,-2.46 -1.31,-4.45 -1.85,-5.96 -0.54,-1.51 -1.06,-2.71 -1.56,-3.6 -0.5,-0.88 -1.03,-1.48 -1.56,-1.8 -0.54,-0.32 -1.18,-0.47 -1.94,-0.47l-10.6 0z" />
            <path d="M163.74 19.4c-0.95,-2.65 -1.4,-5.14 -1.37,-7.48 0.03,-2.33 0.5,-4.39 1.42,-6.15 0.91,-1.77 2.22,-3.17 3.93,-4.21 1.7,-1.04 3.72,-1.56 6.06,-1.56 1.96,0 3.63,0.47 5.02,1.42 1.39,0.95 2.41,2.26 3.08,3.93 0.66,1.67 0.98,3.63 0.95,5.87 -0.03,2.24 -0.49,4.68 -1.37,7.33l-4.35 13.06 8.9 23.75c0.57,1.51 1.14,2.27 1.7,2.27 0.57,0 1.07,-0.76 1.51,-2.27l16.09 -47.41c0.95,-2.9 -0.57,-4.61 -4.54,-5.11l0 -1.89 14.57 0 0 1.89c-1.96,0.82 -3.31,1.56 -4.07,2.22 -0.76,0.66 -1.36,1.62 -1.8,2.89l-18.08 52.81c-0.44,1.26 -0.6,2.46 -0.47,3.6 0.13,1.14 0.47,2.08 1.04,2.84l-10.41 0 -8.61 -23.19 -5.58 16.66c-0.44,1.26 -0.6,2.48 -0.47,3.64 0.13,1.17 0.47,2.13 1.04,2.89l-10.41 0 -22.24 -59.24c-0.5,-1.26 -1.15,-2.24 -1.94,-2.93 -0.79,-0.69 -2.1,-1.42 -3.93,-2.18l0 -1.89 18.93 0 0 1.89c-3.97,0.95 -5.49,2.65 -4.54,5.11l18.17 47.41c0.57,1.51 1.14,2.27 1.7,2.27 0.57,0 1.07,-0.76 1.51,-2.27l4.16 -12.49c1.07,-3.03 1.04,-5.99 -0.1,-8.9l-5.49 -14.57zm11.26 6.63l2.74 -8.33c0.57,-1.83 0.93,-3.58 1.09,-5.25 0.16,-1.67 0.1,-3.14 -0.19,-4.4 -0.28,-1.26 -0.76,-2.29 -1.42,-3.08 -0.66,-0.79 -1.5,-1.18 -2.51,-1.18 -1.14,0 -2.05,0.39 -2.74,1.18 -0.69,0.79 -1.15,1.86 -1.37,3.22 -0.22,1.36 -0.21,2.93 0.05,4.73 0.25,1.8 0.76,3.68 1.51,5.63l2.84 7.48z" />
            <path d="M271.97 30.66c-3.15,0 -4.73,1.58 -4.73,4.73l0 23.28c0,3.15 1.58,4.73 4.73,4.73l11.92 0c4.42,0 8.22,-0.93 11.4,-2.79 3.19,-1.86 5.6,-4.56 7.24,-8.09l1.89 0c-0.82,1.89 -1.48,3.94 -1.99,6.15 -0.5,2.21 -0.76,4.26 -0.76,6.15 0,0.82 -0.28,1.42 -0.85,1.8 -0.57,0.38 -1.26,0.57 -2.08,0.57l-43.82 0 0 -1.89c1.7,-0.82 2.84,-1.56 3.41,-2.22 0.57,-0.66 0.85,-1.62 0.85,-2.89l0 -52.24c0,-1.26 -0.28,-2.22 -0.85,-2.89 -0.57,-0.66 -1.7,-1.4 -3.41,-2.22l0 -1.89 41.92 0c1.7,0 2.68,0.79 2.93,2.37l1.8 10.41 -1.89 0c-1.64,-3.47 -3.14,-5.84 -4.5,-7.1 -1.36,-1.26 -3.08,-1.89 -5.16,-1.89l-18.08 0c-3.15,0 -4.73,1.58 -4.73,4.73l0 12.68c0,3.15 1.58,4.73 4.73,4.73l10.6 0c1.26,0 2.13,-0.44 2.6,-1.33 0.47,-0.88 0.65,-2.49 0.52,-4.83l1.89 0 3.79 21.77 -1.89 0c-0.69,-2.46 -1.31,-4.45 -1.85,-5.96 -0.54,-1.51 -1.06,-2.71 -1.56,-3.6 -0.5,-0.88 -1.03,-1.48 -1.56,-1.8 -0.54,-0.32 -1.18,-0.47 -1.94,-0.47l-10.6 0z" />
            <path d="M365.34 60.19c0.82,1.33 2.02,2.4 3.6,3.22 1.58,0.82 3.28,1.45 5.11,1.89l0 1.89 -21.2 0 0 -1.89c0.76,0 1.4,-0.17 1.94,-0.52 0.54,-0.35 0.91,-0.79 1.14,-1.32 0.22,-0.54 0.3,-1.14 0.24,-1.8 -0.06,-0.66 -0.28,-1.31 -0.66,-1.94l-11.83 -19.59c-0.76,-1.32 -1.96,-1.89 -3.6,-1.7 -1.14,0.13 -2.27,0.24 -3.41,0.33 -1.14,0.09 -2.3,0.14 -3.5,0.14 -1.58,0 -2.37,0.79 -2.37,2.37l0 18.93c0,1.26 0.28,2.22 0.85,2.89 0.57,0.66 1.7,1.4 3.41,2.22l0 1.89 -16.56 0 0 -1.89c1.7,-0.82 2.84,-1.56 3.41,-2.22 0.57,-0.66 0.85,-1.62 0.85,-2.89l0 -52.24c0,-1.26 -0.28,-2.22 -0.85,-2.89 -0.57,-0.66 -1.7,-1.4 -3.41,-2.22l0 -1.89 18.45 0c9.72,0 17.05,1.39 22,4.16 4.95,2.78 7.43,6.94 7.43,12.49 0,3.85 -1.25,7.29 -3.74,10.32 -2.49,3.03 -5.85,5.46 -10.08,7.29 -1.45,0.69 -1.77,1.64 -0.95,2.84l13.72 22.14zm-29.81 -25.08c2.96,0 5.79,-0.44 8.47,-1.33 2.68,-0.88 5.05,-2.08 7.1,-3.6 2.05,-1.51 3.69,-3.33 4.92,-5.44 1.23,-2.11 1.85,-4.4 1.85,-6.86 0,-3.97 -1.61,-7.16 -4.83,-9.56 -3.22,-2.4 -7.51,-3.6 -12.87,-3.6l-5.11 0c-2.84,0 -4.26,1.7 -4.26,5.11l0 20.54c0,3.15 1.58,4.73 4.73,4.73z" />
            <path d="M397.67 68.23c-1.83,0 -3.34,-0.55 -4.54,-1.66 -1.2,-1.1 -2.05,-2.6 -2.56,-4.5 -0.5,-1.89 -0.63,-4.07 -0.38,-6.53 0.25,-2.46 0.95,-5.05 2.08,-7.76l16.56 -40.41c0.5,-1.26 0.68,-2.46 0.52,-3.6 -0.16,-1.14 -0.52,-2.08 -1.09,-2.84l10.32 0 19.4 59.24c0.44,1.26 1.04,2.22 1.8,2.89 0.76,0.66 2.11,1.4 4.07,2.22l0 1.89 -17.03 0 0 -1.89c1.45,-0.82 2.35,-1.56 2.7,-2.22 0.35,-0.66 0.33,-1.62 -0.05,-2.89l-4.45 -13.72c-0.76,-1.58 -1.86,-2.37 -3.31,-2.37 -0.95,0 -1.92,0.6 -2.93,1.8 -1.01,1.2 -2.05,2.68 -3.12,4.45 -1.07,1.77 -2.22,3.71 -3.45,5.82 -1.23,2.11 -2.57,4.05 -4.02,5.82 -1.45,1.77 -3.04,3.25 -4.78,4.45 -1.73,1.2 -3.64,1.8 -5.73,1.8zm1.42 -29.15c-1.39,3.22 -2.35,6.09 -2.89,8.61 -0.54,2.52 -0.71,4.68 -0.52,6.48 0.19,1.8 0.71,3.17 1.56,4.12 0.85,0.95 1.94,1.42 3.27,1.42 1.39,0 2.71,-0.47 3.97,-1.42 1.26,-0.95 2.46,-2.15 3.6,-3.6 1.14,-1.45 2.26,-3.01 3.36,-4.68 1.1,-1.67 2.21,-3.23 3.31,-4.68 1.1,-1.45 2.22,-2.65 3.36,-3.6 1.14,-0.95 2.33,-1.42 3.6,-1.42 0.38,0 0.82,0.06 1.32,0.19l-9.09 -27.73c-0.5,-1.58 -1.04,-2.37 -1.61,-2.37 -0.57,0 -1.14,0.73 -1.7,2.18l-11.55 26.5z" />
          </g>
        </svg>
      </div>

      {/* 3. PROTAGONIST PHOTO (EXACT SEPARATION DESKTOP & MOBILE VIA CSS CUSTOM PROPERTIES) */}
      <div
        key={`protagonist-${activeAgent.id}`}
        className="team-protagonist-container"
        style={{
          position: 'absolute',
          top: 'clamp(2.5rem, 5vw, 5.5rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          height: 'clamp(420px, 58vw, 700px)',
          width: 'auto',
          zIndex: 2,
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          animation: 'protagonistFade 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        <div
          className="team-protagonist-wrapper"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            transformOrigin: 'center top',
            transition: 'transform 0.05s ease-out',
            ['--d-h' as any]: `${desktopActiveFraming.heightPercent}%`,
            ['--d-x' as any]: `${desktopActiveFraming.offsetX}px`,
            ['--d-y' as any]: `${desktopActiveFraming.offsetY}px`,
            ['--d-scale' as any]: desktopActiveFraming.scale,
            ['--m-h' as any]: `${mobileActiveFraming.heightPercent}%`,
            ['--m-x' as any]: `${mobileActiveFraming.offsetX}px`,
            ['--m-y' as any]: `${mobileActiveFraming.offsetY}px`,
            ['--m-scale' as any]: mobileActiveFraming.scale
          }}
        >
          <img
            src={activeAgent.photoNobgUrl || activeAgent.photoUrl}
            alt={activeAgent.name}
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.12))',
              maskImage: 'linear-gradient(to bottom, black 72%, transparent 98%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 72%, transparent 98%)'
            }}
          />
        </div>
      </div>

      {/* 4. CINEMATIC HORIZONTAL SHOWCASE COMPOSITION */}
      <div
        className="container team-showcase-container"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 'clamp(13rem, 21vw, 24rem)',
          touchAction: 'pan-y'
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (diff > 45) handleNext();
          if (diff < -45) handlePrev();
          touchStartX.current = null;
        }}
      >
        <div
          className="team-showcase-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(0.75rem, 2vw, 2.5rem)',
            width: '100%',
            maxWidth: '1280px'
          }}
        >
          {/* LEFT SIDE INACTIVE CIRCLES */}
          <div
            className="team-side-group team-side-left"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.75rem, 1.5vw, 1.75rem)',
              flex: 1,
              justifyContent: 'flex-end'
            }}
          >
            {leftIndices.map((idx, pos) => {
              const agent = agents[idx];
              if (!agent) return null;
              const dFraming = desktopFramingMap[agent.id] || DESKTOP_AGENT_FRAMING[agent.id] || DEFAULT_FRAMING;
              const mFraming = mobileFramingMap[agent.id] || MOBILE_AGENT_FRAMING[agent.id] || DEFAULT_FRAMING;
              const isFurthest = pos === 0;
              const isMiddle = pos === 1;
              const isClosest = pos === 2;

              return (
                <button
                  key={`left-${agent.id}-${idx}`}
                  onClick={() => handleSelectIndex(idx)}
                  className={`team-circle-btn ${isFurthest ? 'team-circle-furthest' : ''} ${isMiddle ? 'team-circle-middle' : ''} ${isClosest ? 'team-circle-closest' : ''}`}
                  title={`${agent.name} - ${agent.title}`}
                  style={{
                    position: 'relative',
                    width: isClosest ? 'clamp(62px, 5.5vw, 84px)' : isMiddle ? 'clamp(54px, 4.5vw, 72px)' : 'clamp(46px, 3.8vw, 60px)',
                    height: isClosest ? 'clamp(62px, 5.5vw, 84px)' : isMiddle ? 'clamp(54px, 4.5vw, 72px)' : 'clamp(46px, 3.8vw, 60px)',
                    borderRadius: '50%',
                    padding: 0,
                    border: '2px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                    backgroundColor: '#E5E7EB',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isClosest ? 0.72 : isMiddle ? 0.5 : 0.35,
                    transform: 'scale(1)',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = String(isClosest ? 0.72 : isMiddle ? 0.5 : 0.35);
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.06)';
                  }}
                >
                  <img
                    src={agent.photoNobgUrl || agent.photoUrl}
                    alt={agent.name}
                    className="team-avatar-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'grayscale(100%) contrast(0.95)',
                      transition: 'filter 0.3s ease, transform 0.2s ease',
                      ['--d-avatar-x' as any]: `${dFraming.avatarX}%`,
                      ['--d-avatar-y' as any]: `${dFraming.avatarY}%`,
                      ['--d-avatar-zoom' as any]: dFraming.avatarZoom,
                      ['--m-avatar-x' as any]: `${mFraming.avatarX}%`,
                      ['--m-avatar-y' as any]: `${mFraming.avatarY}%`,
                      ['--m-avatar-zoom' as any]: mFraming.avatarZoom
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* CENTRAL FLOATING PROFILE CARD (MINIMALIST & EDITORIAL) */}
          <div
            key={`card-${activeAgent.id}`}
            className="team-active-card"
            style={{
              width: '100%',
              maxWidth: '410px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 24px 50px -12px rgba(17, 24, 39, 0.1), 0 4px 16px rgba(0, 0, 0, 0.03)',
              padding: 'clamp(1.75rem, 3vw, 2.25rem)',
              position: 'relative',
              zIndex: 20,
              flexShrink: 0,
              animation: 'cardEnter 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            {/* 1. NAME (BIG & BOLD) */}
            <h3
              className="team-card-name"
              onClick={() => onSelectAgent(activeAgent)}
              style={{
                fontSize: 'clamp(1.55rem, 2.4vw, 1.95rem)',
                fontWeight: 700,
                color: '#111827',
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: '-0.02em',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#660E1A')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#111827')}
              title={lang === 'es' ? 'Ver perfil completo' : 'View full profile'}
            >
              {activeAgent.name}
            </h3>

            {/* 2. TITLE: STRICTLY "Licensed REALTOR®" (or Principal Broker & Founder) */}
            <p
              className="team-card-title"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#6B7280',
                margin: '0.35rem 0 1.25rem 0'
              }}
            >
              {activeAgent.id === 'yeilen-contreras' ? 'Principal Broker & Founder' : 'Licensed REALTOR®'}
            </p>

            {/* 3. DIRECT CONTACT: PHONE & EMAIL */}
            <div
              className="team-card-contact"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                marginBottom: '1.25rem'
              }}
            >
              <a
                href={`tel:${activeAgent.phone.replace(/[^0-9]/g, '')}`}
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: '#111827',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#660E1A')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#111827')}
              >
                {activeAgent.phone}
              </a>

              <a
                href={`mailto:${activeAgent.email}`}
                style={{
                  fontSize: '0.9rem',
                  color: '#4B5563',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  display: 'inline-block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#660E1A')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
              >
                {activeAgent.email}
              </a>
            </div>

            {/* 4. PROMINENT CALL TO ACTION: VIEW PROFILE & LISTINGS */}
            <button
              onClick={() => onSelectAgent(activeAgent)}
              className="team-card-profile-btn"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                backgroundColor: '#660E1A',
                color: '#FFFFFF',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.03em',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '1rem',
                boxShadow: '0 4px 14px rgba(102, 14, 26, 0.25)',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#821221';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#660E1A';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <span className="btn-text-desktop">{lang === 'es' ? 'Ver Perfil & Propiedades' : 'View Profile & Listings'}</span>
              <span className="btn-text-mobile">{lang === 'es' ? 'Ver Perfil' : 'View Profile'}</span>
              <ArrowUpRight size={14} className="profile-btn-icon" />
            </button>

            {/* 5. SOCIAL MEDIA BUTTONS */}
            <div
              className="team-card-socials"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1.25rem'
              }}
            >
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${activeAgent.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4B5563',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#25D366';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.color = '#4B5563';
                }}
              >
                <MessageCircle size={16} />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4B5563',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E1306C';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.color = '#4B5563';
                }}
              >
                <Instagram size={16} />
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4B5563',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1877F2';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.color = '#4B5563';
                }}
              >
                <Facebook size={16} />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4B5563',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0A66C2';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.color = '#4B5563';
                }}
              >
                <Linkedin size={16} />
              </a>
            </div>

            {/* 5. CARD FOOTER: CONNECTED BRAND BURGUNDY NAV ARROW BUTTONS & COUNTER */}
            <div
              className="team-card-footer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid #F3F4F6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 700, color: '#111827' }}>
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>/</span>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#9CA3AF' }}>
                  {String(total).padStart(2, '0')}
                </span>
              </div>

              {/* Brand Burgundy Connected Nav Arrow Buttons */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#660E1A',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 14px rgba(102, 14, 26, 0.3)'
                }}
              >
                <button
                  onClick={handlePrev}
                  disabled={isAnimating}
                  aria-label="Previous team member"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '0.45rem 0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s ease',
                    borderRight: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={handleNext}
                  disabled={isAnimating}
                  aria-label="Next team member"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '0.45rem 0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE INACTIVE CIRCLES */}
          <div
            className="team-side-group team-side-right"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.75rem, 1.5vw, 1.75rem)',
              flex: 1,
              justifyContent: 'flex-start'
            }}
          >
            {rightIndices.map((idx, pos) => {
              const agent = agents[idx];
              if (!agent) return null;
              const dFraming = desktopFramingMap[agent.id] || DESKTOP_AGENT_FRAMING[agent.id] || DEFAULT_FRAMING;
              const mFraming = mobileFramingMap[agent.id] || MOBILE_AGENT_FRAMING[agent.id] || DEFAULT_FRAMING;
              const isClosest = pos === 0;
              const isMiddle = pos === 1;
              const isFurthest = pos === 2;

              return (
                <button
                  key={`right-${agent.id}-${idx}`}
                  onClick={() => handleSelectIndex(idx)}
                  className={`team-circle-btn ${isFurthest ? 'team-circle-furthest' : ''} ${isMiddle ? 'team-circle-middle' : ''} ${isClosest ? 'team-circle-closest' : ''}`}
                  title={`${agent.name} - ${agent.title}`}
                  style={{
                    position: 'relative',
                    width: isClosest ? 'clamp(62px, 5.5vw, 84px)' : isMiddle ? 'clamp(54px, 4.5vw, 72px)' : 'clamp(46px, 3.8vw, 60px)',
                    height: isClosest ? 'clamp(62px, 5.5vw, 84px)' : isMiddle ? 'clamp(54px, 4.5vw, 72px)' : 'clamp(46px, 3.8vw, 60px)',
                    borderRadius: '50%',
                    padding: 0,
                    border: '2px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                    backgroundColor: '#E5E7EB',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isClosest ? 0.72 : isMiddle ? 0.5 : 0.35,
                    transform: 'scale(1)',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = String(isClosest ? 0.72 : isMiddle ? 0.5 : 0.35);
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.06)';
                  }}
                >
                  <img
                    src={agent.photoNobgUrl || agent.photoUrl}
                    alt={agent.name}
                    className="team-avatar-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'grayscale(100%) contrast(0.95)',
                      transition: 'filter 0.3s ease, transform 0.2s ease',
                      ['--d-avatar-x' as any]: `${dFraming.avatarX}%`,
                      ['--d-avatar-y' as any]: `${dFraming.avatarY}%`,
                      ['--d-avatar-zoom' as any]: dFraming.avatarZoom,
                      ['--m-avatar-x' as any]: `${mFraming.avatarX}%`,
                      ['--m-avatar-y' as any]: `${mFraming.avatarY}%`,
                      ['--m-avatar-zoom' as any]: mFraming.avatarZoom
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. STYLES & KEYFRAMES */}
      <style>{`
        @keyframes bgFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -46%) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes protagonistFade {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }

        @keyframes cardEnter {
          from {
            opacity: 0.7;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes framerPop {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .team-protagonist-wrapper {
          height: var(--d-h, 100%);
          transform: translate(var(--d-x, 0px), var(--d-y, 0px)) scale(var(--d-scale, 1));
        }

        .team-avatar-img {
          object-position: var(--d-avatar-x, 50%) var(--d-avatar-y, 20%);
          transform: scale(var(--d-avatar-zoom, 1));
        }

        .btn-text-mobile {
          display: none;
        }

        .btn-text-desktop {
          display: inline;
        }

        @media (max-width: 1024px) {
          .team-circle-furthest {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          #team-showcase-section {
            padding: 3rem 0 3.5rem 0 !important;
          }
          .team-watermark {
            top: 28% !important;
          }
          .team-protagonist-container {
            top: clamp(1.5rem, 4vw, 3rem) !important;
            height: clamp(340px, 50vw, 480px) !important;
          }
          .team-protagonist-wrapper {
            height: var(--m-h, 100%) !important;
            transform: translate(var(--m-x, 0px), var(--m-y, 0px)) scale(var(--m-scale, 1)) !important;
          }
          .team-avatar-img {
            object-position: var(--m-avatar-x, 50%) var(--m-avatar-y, 20%) !important;
            transform: scale(var(--m-avatar-zoom, 1)) !important;
          }
          .team-showcase-container {
            margin-top: clamp(10.5rem, 18vw, 15.5rem) !important;
          }
          .team-showcase-row {
            gap: clamp(0.35rem, 1.5vw, 1rem) !important;
            padding: 0 0.5rem !important;
          }
          .team-circle-btn.team-circle-closest {
            width: clamp(38px, 5.5vw, 60px) !important;
            height: clamp(38px, 5.5vw, 60px) !important;
          }
          .team-circle-middle {
            display: none !important;
          }
          .team-circle-furthest {
            display: none !important;
          }
          .team-active-card {
            max-width: clamp(200px, 50vw, 270px) !important;
            padding: 0.85rem 0.95rem !important;
            border-radius: var(--radius-md) !important;
            box-shadow: 0 16px 36px -10px rgba(17, 24, 39, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04) !important;
          }
          .team-card-name {
            font-size: 1.12rem !important;
            line-height: 1.15 !important;
          }
          .team-card-title {
            font-size: 0.64rem !important;
            margin: 0.15rem 0 0.45rem 0 !important;
          }
          .team-card-contact {
            gap: 0.15rem !important;
            margin-bottom: 0.55rem !important;
          }
          .team-card-contact a {
            font-size: 0.82rem !important;
          }
          .team-card-contact a:last-child {
            font-size: 0.72rem !important;
          }
          .btn-text-desktop {
            display: none !important;
          }
          .btn-text-mobile {
            display: inline !important;
          }
          .team-card-profile-btn {
            padding: 0.38rem 0.6rem !important;
            font-size: 0.72rem !important;
            border-radius: var(--radius-sm) !important;
            margin-bottom: 0.55rem !important;
            box-shadow: 0 2px 8px rgba(102, 14, 26, 0.2) !important;
            gap: 0.3rem !important;
          }
          .team-card-profile-btn .profile-btn-icon {
            width: 12px !important;
            height: 12px !important;
          }
          .team-card-socials {
            gap: 0.35rem !important;
            margin-bottom: 0 !important;
          }
          .team-card-socials a,
          .team-card-socials button {
            width: 28px !important;
            height: 28px !important;
          }
          .team-card-socials svg {
            width: 14px !important;
            height: 14px !important;
          }
          .team-card-footer {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
