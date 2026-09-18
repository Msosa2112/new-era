import React, { useEffect, useRef } from 'react';
import patternLines from './patternLinesData.json';

interface LivePatternOverlayProps {
  className?: string;
  style?: React.CSSProperties;
}

interface ActiveLightSlot {
  pathIndex: number;
  startTime: number;
  duration: number;
  peakOpacity: number;
  delayBeforeNext: number;
}

// User-calibrated optimal luxury configuration:
// poolSize: 5, duration: 2.0s, peakOpacity: 0.52, delayBetween: 2.8s, strokeWidth: 10, bloomRadius: 24, colorTone: 'champagne'
const POOL_SIZE = 5;
const BASE_DURATION = 2000; // 2.0s
const PEAK_OPACITY = 0.52;
const DELAY_BETWEEN = 2800; // 2.8s
const STROKE_WIDTH = 10;
const BLOOM_RADIUS = 24;
const HALO_WIDTH = 24;

export const LivePatternOverlay: React.FC<LivePatternOverlayProps> = ({
  className = '',
  style = {}
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const glowRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || !patternLines || patternLines.length === 0) return;

    let animationFrameId: number;
    let isVisible = true;

    const totalLines = patternLines.length;
    const usedIndices = new Set<number>();

    const getUniqueRandomIndex = (): number => {
      for (let i = 0; i < 40; i++) {
        const idx = Math.floor(Math.random() * totalLines);
        if (!usedIndices.has(idx)) {
          return idx;
        }
      }
      return Math.floor(Math.random() * totalLines);
    };

    // Staggered initialization: creates an organic cascading start
    const now = performance.now();
    const slots: ActiveLightSlot[] = Array.from({ length: POOL_SIZE }, (_, i) => {
      const idx = getUniqueRandomIndex();
      usedIndices.add(idx);
      return {
        pathIndex: idx,
        startTime: now + i * 560 + Math.random() * 200,
        duration: BASE_DURATION * (0.9 + Math.random() * 0.2),
        peakOpacity: PEAK_OPACITY * (0.95 + Math.random() * 0.1),
        delayBeforeNext: DELAY_BETWEEN * (0.8 + Math.random() * 0.4)
      };
    });

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const renderLoop = (time: number) => {
      animationFrameId = requestAnimationFrame(renderLoop);
      if (!isVisible) return;

      for (let i = 0; i < POOL_SIZE; i++) {
        const slot = slots[i];
        const coreEl = pathRefs.current[i];
        const glowEl = glowRefs.current[i];
        if (!coreEl || !glowEl) continue;

        const elapsed = time - slot.startTime;

        if (elapsed < 0) {
          coreEl.setAttribute('opacity', '0');
          glowEl.setAttribute('opacity', '0');
          continue;
        }

        if (elapsed >= slot.duration) {
          usedIndices.delete(slot.pathIndex);
          const newIdx = getUniqueRandomIndex();
          usedIndices.add(newIdx);

          slot.pathIndex = newIdx;
          slot.startTime = time + DELAY_BETWEEN * (0.8 + Math.random() * 0.4);
          slot.duration = BASE_DURATION * (0.9 + Math.random() * 0.2);
          slot.peakOpacity = PEAK_OPACITY * (0.95 + Math.random() * 0.1);

          const newD = patternLines[newIdx].d;
          coreEl.setAttribute('d', newD);
          glowEl.setAttribute('d', newD);
          coreEl.setAttribute('opacity', '0');
          glowEl.setAttribute('opacity', '0');
          continue;
        }

        // Smooth sine curve:
        // 0% -> 30%: gradual ease-in
        // 30% -> 70%: sustained holding glow with subtle ambient shimmer
        // 70% -> 100%: smooth ease-out
        const progress = elapsed / slot.duration;
        let opacity = 0;

        if (progress < 0.30) {
          const t = progress / 0.30;
          opacity = Math.sin((t * Math.PI) / 2) * slot.peakOpacity;
        } else if (progress < 0.70) {
          const shimmer = Math.sin(time * 0.004 + i * 1.5) * 0.03;
          opacity = Math.min(1, slot.peakOpacity + shimmer);
        } else {
          const t = (progress - 0.70) / 0.30;
          opacity = Math.cos((t * Math.PI) / 2) * slot.peakOpacity;
        }

        if (opacity <= 0.005) {
          coreEl.setAttribute('opacity', '0');
          glowEl.setAttribute('opacity', '0');
        } else {
          coreEl.setAttribute('opacity', opacity.toFixed(3));
          glowEl.setAttribute('opacity', (opacity * 0.75).toFixed(3));
        }
      }
    };

    // Preload initial paths into DOM
    for (let i = 0; i < POOL_SIZE; i++) {
      const coreEl = pathRefs.current[i];
      const glowEl = glowRefs.current[i];
      if (coreEl && glowEl && patternLines[slots[i].pathIndex]) {
        const d = patternLines[slots[i].pathIndex].d;
        coreEl.setAttribute('d', d);
        glowEl.setAttribute('d', d);
        coreEl.setAttribute('opacity', '0');
        glowEl.setAttribute('opacity', '0');
      }
    }

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 18737 9495"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        mixBlendMode: 'screen',
        ...style
      }}
      className={`live-pattern-overlay ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Satin Champagne-Gold Core Gradient */}
        <linearGradient id="liveGoldCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FDE68A" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#DEC0A1" stopOpacity="0.75" />
        </linearGradient>

        {/* Ambient Subtle Warm Aura Gradient */}
        <linearGradient id="liveGoldAuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>

        {/* Delicate Ambient Bloom Filter */}
        <filter id="liveAuraBloom" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={BLOOM_RADIUS} result="outerBlur" />
          <feGaussianBlur stdDeviation={Math.round(BLOOM_RADIUS * 0.4)} result="innerBlur" />
          <feMerge>
            <feMergeNode in="outerBlur" />
            <feMergeNode in="innerBlur" />
          </feMerge>
        </filter>
      </defs>

      {/* LAYER 1: Soft Ambient Halo */}
      <g filter="url(#liveAuraBloom)">
        {Array.from({ length: POOL_SIZE }).map((_, i) => (
          <path
            key={`glow-${i}`}
            ref={(el) => {
              glowRefs.current[i] = el;
            }}
            fill="none"
            stroke="url(#liveGoldAuraGrad)"
            strokeWidth={HALO_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0"
          />
        ))}
      </g>

      {/* LAYER 2: Crisp Satin Champagne Core Line */}
      <g>
        {Array.from({ length: POOL_SIZE }).map((_, i) => (
          <path
            key={`core-${i}`}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            fill="url(#liveGoldCoreGrad)"
            stroke="url(#liveGoldCoreGrad)"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            fillRule="evenodd"
            opacity="0"
          />
        ))}
      </g>
    </svg>
  );
};
