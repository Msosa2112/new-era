import React, { useEffect, useRef } from 'react';

interface LivePatternOverlayProps {
  className?: string;
  style?: React.CSSProperties;
}

interface ActiveLightSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startTime: number;
  duration: number; // total lifecycle duration in ms (e.g. 2400ms)
  peakOpacity: number;
}

export const LivePatternOverlay: React.FC<LivePatternOverlayProps> = ({
  className = '',
  style = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    let animationFrameId: number;
    let isVisible = true;
    let activeSegments: ActiveLightSegment[] = [];
    let lastSpawnTime = 0;
    let nextSpawnDelay = 1200 + Math.random() * 1600; // 1.2s - 2.8s organic interval

    // Resize canvas with pixel ratio
    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.scale(dpr, dpr);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Pause when tab is inactive or scrolled away
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const handleVisibilityChange = () => {
      if (document.hidden) isVisible = false;
      else isVisible = true;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Grid geometry matching New Era isometric cube pattern
    const unitSize = 64; // Grid step in logical pixels
    const hStep = unitSize * Math.sqrt(3); // ~110.85px
    const vStep = unitSize * 1.5; // 96px

    const generateRandomSegment = (width: number, height: number, now: number): ActiveLightSegment | null => {
      const centerX = width / 2;
      const centerY = height / 2;

      // Central exclusion zone (where the official brand logo sits undisturbed)
      const logoExclusionWidth = Math.min(width * 0.45, 500);
      const logoExclusionHeight = Math.min(height * 0.38, 280);

      // Attempt picking a segment outside the logo area
      for (let attempt = 0; attempt < 12; attempt++) {
        const col = Math.floor(Math.random() * (width / hStep + 2)) - 1;
        const row = Math.floor(Math.random() * (height / vStep + 2)) - 1;

        const x = col * hStep + ((row % 2) * hStep) / 2;
        const y = row * vStep;

        // Pick one of 3 isometric directions: 0° horizontal, 60° diagonal, 120° diagonal
        const dir = Math.floor(Math.random() * 3);
        let x2 = x;
        let y2 = y;

        if (dir === 0) {
          x2 = x + unitSize;
          y2 = y;
        } else if (dir === 1) {
          x2 = x + (unitSize * Math.sqrt(3)) / 2;
          y2 = y + unitSize * 0.5;
        } else {
          x2 = x - (unitSize * Math.sqrt(3)) / 2;
          y2 = y + unitSize * 0.5;
        }

        const midX = (x + x2) / 2;
        const midY = (y + y2) / 2;

        // Check bounds
        if (midX < 10 || midX > width - 10 || midY < 10 || midY > height - 10) {
          continue;
        }

        // Check exclusion zone around centered logo
        const inLogoZone =
          Math.abs(midX - centerX) < logoExclusionWidth / 2 &&
          Math.abs(midY - centerY) < logoExclusionHeight / 2;

        if (!inLogoZone) {
          return {
            x1: x,
            y1: y,
            x2: x2,
            y2: y2,
            startTime: now,
            duration: 2200 + Math.random() * 800, // 2.2s - 3.0s smooth breath
            peakOpacity: 0.55 + Math.random() * 0.25 // Subtle, warm satin glow
          };
        }
      }
      return null;
    };

    // Render loop
    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Spawn new subtle light line at randomized gentle intervals
      if (time - lastSpawnTime > nextSpawnDelay && activeSegments.length < 3) {
        const newSeg = generateRandomSegment(width, height, time);
        if (newSeg) {
          activeSegments.push(newSeg);
          lastSpawnTime = time;
          nextSpawnDelay = 1400 + Math.random() * 2200; // Next line after 1.4s - 3.6s
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Filter and draw active light segments
      activeSegments = activeSegments.filter((seg) => {
        const elapsed = time - seg.startTime;
        if (elapsed >= seg.duration) return false;

        const progress = elapsed / seg.duration; // 0 to 1
        let alpha = 0;

        // Organic curve: 35% fade-in, 20% hold, 45% smooth fade-out
        if (progress < 0.35) {
          alpha = (progress / 0.35) * seg.peakOpacity;
        } else if (progress < 0.55) {
          alpha = seg.peakOpacity;
        } else {
          alpha = ((1 - progress) / 0.45) * seg.peakOpacity;
        }

        if (alpha <= 0.01) return true;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);

        // Warm champagne-gold satin light stroke
        ctx.strokeStyle = `rgba(235, 218, 196, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(235, 218, 196, 0.45)';
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.restore();

        return true;
      });
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateDimensions);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        ...style
      }}
      className={`live-pattern-canvas ${className}`}
      aria-hidden="true"
    />
  );
};
