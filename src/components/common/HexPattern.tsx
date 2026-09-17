import React from 'react';

interface HexPatternProps {
  opacity?: number;
  className?: string;
  variant?: 'subtle' | 'burgundy' | 'dark';
}

export const HexPattern: React.FC<HexPatternProps> = ({
  opacity = 0.05,
  className = '',
  variant = 'subtle'
}) => {
  return (
    <div
      className={`hex-pattern-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        opacity,
        backgroundImage: `url('/assets/pattern.svg')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '320px 320px',
        filter: variant === 'dark' ? 'invert(1)' : 'none'
      }}
      aria-hidden="true"
    />
  );
};
