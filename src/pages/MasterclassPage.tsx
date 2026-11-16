import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Grid,
  Home,
} from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  MC_COLORS,
  MC_FONTS,
  MC_SPRINGS,
  SLIDES_CONFIG,
} from '../components/masterclass/masterclassTokens';
import {
  Slide1Hook,
  Slide2Cemetery,
  Slide3WowEmpty,
} from '../components/masterclass/SlidesPart1';
import {
  Slide4Psychology,
  Slide5HorrorMuseum,
  Slide6ZeroExcuses,
} from '../components/masterclass/SlidesPart2';
import {
  Slide7DownPayment,
  Slide8HuntingMap,
  Slide9GuerrillaPact,
} from '../components/masterclass/SlidesPart3';

interface MasterclassPageProps {
  onExit?: () => void;
}

export const MasterclassPage: React.FC<MasterclassPageProps> = ({ onExit }) => {
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [subStep, setSubStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [stageScale, setStageScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showOverview, setShowOverview] = useState<boolean>(false);

  const currentSlide = SLIDES_CONFIG[slideIndex];
  const totalSlides = SLIDES_CONFIG.length;

  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleX = vw / 1920;
      const scaleY = vh / 1080;
      setStageScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleNext = useCallback(() => {
    const maxSteps = SLIDES_CONFIG[slideIndex].maxSubSteps;
    if (subStep < maxSteps) {
      setSubStep((prev) => prev + 1);
    } else if (slideIndex < totalSlides - 1) {
      setDirection(1);
      setSlideIndex((prev) => prev + 1);
      setSubStep(1);
    }
  }, [slideIndex, subStep, totalSlides]);

  const handlePrev = useCallback(() => {
    if (subStep > 1) {
      setSubStep((prev) => prev - 1);
    } else if (slideIndex > 0) {
      const prevSlideMaxSteps = SLIDES_CONFIG[slideIndex - 1].maxSubSteps;
      setDirection(-1);
      setSlideIndex((prev) => prev - 1);
      setSubStep(prevSlideMaxSteps);
    }
  }, [slideIndex, subStep]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (showOverview) setShowOverview(false);
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (showOverview) setShowOverview(false);
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'g' || e.key === 'G' || e.key === 'Escape') {
        if (showOverview) {
          e.preventDefault();
          setShowOverview(false);
        }
      } else if (/^[1-9]$/.test(e.key)) {
        const targetIdx = parseInt(e.key, 10) - 1;
        if (targetIdx >= 0 && targetIdx < totalSlides) {
          setDirection(targetIdx > slideIndex ? 1 : -1);
          setSlideIndex(targetIdx);
          setSubStep(1);
          setShowOverview(false);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handlePrev, toggleFullscreen, showOverview, slideIndex, totalSlides]);

  const totalStepsCount = SLIDES_CONFIG.reduce((acc, s) => acc + s.maxSubSteps, 0);
  const completedStepsBeforeSlide = SLIDES_CONFIG.slice(0, slideIndex).reduce(
    (acc, s) => acc + s.maxSubSteps,
    0
  );
  const currentOverallStep = completedStepsBeforeSlide + subStep;
  const progressPercentage = (currentOverallStep / totalStepsCount) * 100;

  const renderActiveSlide = () => {
    switch (currentSlide.id) {
      case 1:
        return <Slide1Hook subStep={subStep} />;
      case 2:
        return <Slide2Cemetery subStep={subStep} />;
      case 3:
        return <Slide3WowEmpty subStep={subStep} />;
      case 4:
        return <Slide4Psychology subStep={subStep} />;
      case 5:
        return <Slide5HorrorMuseum subStep={subStep} />;
      case 6:
        return <Slide6ZeroExcuses subStep={subStep} />;
      case 7:
        return <Slide7DownPayment subStep={subStep} />;
      case 8:
        return <Slide8HuntingMap subStep={subStep} />;
      case 9:
        return <Slide9GuerrillaPact subStep={subStep} />;
      default:
        return <Slide1Hook subStep={subStep} />;
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: MC_COLORS.obsidian,
        color: MC_COLORS.white,
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* SUBTLE ARCHITECTURAL GRID OVERLAY (OPACITY 0.025) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.025,
          backgroundImage: `
            linear-gradient(to right, #FAFAFA 1px, transparent 1px),
            linear-gradient(to bottom, #FAFAFA 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* PROPORTIONAL 16:9 WIDESCREEN STAGE (1920 x 1080) */}
      <div
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${stageScale})`,
          transformOrigin: 'center center',
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* TOP MINIMALIST EXECUTIVE BAR */}
        <div
          style={{
            height: '60px',
            padding: '0 88px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${MC_COLORS.borderSubtle}`,
            backgroundColor: 'rgba(9, 9, 11, 0.8)',
            zIndex: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <BrandLogo variant="monogram-white" height={22} />
            <span
              style={{
                width: '1px',
                height: '14px',
                backgroundColor: MC_COLORS.borderDefault,
              }}
            />
            <span
              style={{
                fontFamily: MC_FONTS.mono,
                fontSize: '12px',
                fontWeight: 500,
                color: MC_COLORS.mutedGray,
                letterSpacing: '0.16em',
              }}
            >
              NEW ERA REAL ESTATE — {currentSlide.sectionTag}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Step Progress Pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginRight: '10px',
              }}
            >
              {Array.from({ length: currentSlide.maxSubSteps }).map((_, idx) => {
                const stepNum = idx + 1;
                const active = stepNum <= subStep;
                return (
                  <button
                    key={stepNum}
                    type="button"
                    onClick={() => setSubStep(stepNum)}
                    title={`Paso ${stepNum}`}
                    style={{
                      width: stepNum === subStep ? '24px' : '8px',
                      height: '6px',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: active
                        ? MC_COLORS.goldAccent
                        : 'rgba(255,255,255,0.14)',
                      cursor: 'pointer',
                      transition: 'width 200ms ease, background-color 200ms ease',
                    }}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowOverview((prev) => !prev)}
              title="Índice de Diapositivas (1-9)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${MC_COLORS.borderSubtle}`,
                color: MC_COLORS.metallicGray,
                fontFamily: MC_FONTS.mono,
                fontSize: '11px',
                letterSpacing: '0.08em',
                cursor: 'pointer',
              }}
            >
              <Grid size={13} /> ÍNDICE
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              title="Pantalla Completa (Tecla F)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${MC_COLORS.borderSubtle}`,
                color: MC_COLORS.metallicGray,
                cursor: 'pointer',
              }}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>

            {onExit && (
              <button
                type="button"
                onClick={onExit}
                title="Volver al Sitio Web"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${MC_COLORS.borderSubtle}`,
                  color: MC_COLORS.metallicGray,
                  cursor: 'pointer',
                }}
              >
                <Home size={13} />
              </button>
            )}
          </div>
        </div>

        {/* SLIDE STAGE */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction >= 0 ? 48 : -48,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: direction >= 0 ? -48 : 48,
              }}
              transition={MC_SPRINGS.slideTransition}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                inset: 0,
              }}
            >
              {renderActiveSlide()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM FOOTER INDICATOR */}
        <div
          style={{
            position: 'absolute',
            bottom: '18px',
            left: '88px',
            right: '88px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 25,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: MC_FONTS.mono,
              fontSize: '11px',
              color: MC_COLORS.darkZinc,
              letterSpacing: '0.12em',
            }}
          >
            NAVEGACIÓN: [← ANTERIOR] • [ESPACIO / → AVANZAR] • [1–9 DIAPOSITIVA]
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              pointerEvents: 'auto',
            }}
          >
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Anterior"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: MC_COLORS.surface,
                border: `1px solid ${MC_COLORS.borderDefault}`,
                color: MC_COLORS.metallicGray,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <div
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                backgroundColor: MC_COLORS.surface,
                border: `1px solid ${MC_COLORS.borderDefault}`,
                fontFamily: MC_FONTS.mono,
                fontSize: '12px',
                fontWeight: 600,
                color: MC_COLORS.metallicGray,
                letterSpacing: '0.14em',
              }}
            >
              SLIDE {currentSlide.code} / 09 — STEP {subStep}/
              {currentSlide.maxSubSteps}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Siguiente"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: MC_COLORS.surface,
                border: `1px solid ${MC_COLORS.borderBright}`,
                color: MC_COLORS.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* MINIMALIST BOTTOM PROGRESS BAR */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            zIndex: 30,
          }}
        >
          <motion.div
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            style={{
              height: '100%',
              backgroundColor: MC_COLORS.goldAccent,
            }}
          />
        </div>

        {/* SLIDE OVERVIEW MODAL */}
        <AnimatePresence>
          {showOverview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOverview(false)}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(9, 9, 11, 0.94)',
                backdropFilter: 'blur(12px)',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '88px',
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '1360px',
                }}
              >
                <div
                  style={{
                    fontFamily: MC_FONTS.mono,
                    fontSize: '12px',
                    color: MC_COLORS.goldAccent,
                    letterSpacing: '0.2em',
                    marginBottom: '24px',
                  }}
                >
                  ÍNDICE DE MÓDULOS // SELECCIONA UNA DIAPOSITIVA (1 – 9)
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '18px',
                  }}
                >
                  {SLIDES_CONFIG.map((s, idx) => {
                    const isCurrent = idx === slideIndex;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setDirection(idx > slideIndex ? 1 : -1);
                          setSlideIndex(idx);
                          setSubStep(1);
                          setShowOverview(false);
                        }}
                        style={{
                          textAlign: 'left',
                          padding: '24px',
                          borderRadius: '10px',
                          backgroundColor: isCurrent
                            ? MC_COLORS.surfaceElevated
                            : MC_COLORS.surface,
                          border: `1px solid ${
                            isCurrent
                              ? MC_COLORS.goldAccent
                              : MC_COLORS.borderDefault
                          }`,
                          color: MC_COLORS.white,
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            fontFamily: MC_FONTS.mono,
                            fontSize: '11px',
                            color: isCurrent
                              ? MC_COLORS.goldAccent
                              : MC_COLORS.mutedGray,
                            letterSpacing: '0.12em',
                            marginBottom: '8px',
                          }}
                        >
                          SLIDE {s.code} // {s.maxSubSteps} PASOS
                        </div>
                        <div
                          style={{
                            fontFamily: MC_FONTS.display,
                            fontSize: '19px',
                            fontWeight: 700,
                            lineHeight: 1.25,
                          }}
                        >
                          {s.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
