import React, { useRef, useState, useEffect } from 'react';
import { useCountUp } from '../../hooks/useScrollReveal';

interface AnimatedCounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  prefix = '',
  suffix = '',
  duration = 1600,
  label,
  className = '',
  style
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const count = useCountUp(target, duration, isVisible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ textAlign: 'center', ...style }}>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 4vw, 3.25rem)',
          fontWeight: 600,
          lineHeight: 1.1,
          color: '#660E1A',
          letterSpacing: '-0.02em'
        }}
      >
        <span>{prefix}</span>
        <span>{count.toLocaleString()}</span>
        <span>{suffix}</span>
      </div>
      {label && (
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#5A606D',
            marginTop: '0.4rem'
          }}
        >
          {label}
        </p>
      )}
    </div>
  );
};
