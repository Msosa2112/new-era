import React from 'react';

export type HexPatternVariant =
  | 'subtle'
  | 'burgundy'
  | 'orange'
  | 'white'
  | 'dark'
  | 'gradient-orange'
  | 'orange-gradient'
  | 'gradient-burgundy'
  | 'gradient-vibrant'
  | 'brand-card'
  | 'gradient-gold'
  | 'gradient-glow';

interface HexPatternProps {
  opacity?: number;
  className?: string;
  variant?: HexPatternVariant;
  gradient?: string;
  size?: number;
  blendMode?: React.CSSProperties['mixBlendMode'];
  style?: React.CSSProperties;
}

export const HexPattern: React.FC<HexPatternProps> = ({
  opacity,
  className = '',
  variant = 'subtle',
  gradient,
  size = 280,
  blendMode,
  style = {}
}) => {
  // If a custom CSS gradient string is provided, use CSS maskImage
  if (gradient) {
    const finalOpacity = opacity !== undefined ? opacity : 0.3;
    return (
      <div
        className={`hex-pattern-container hex-pattern-custom-gradient ${className}`}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
          opacity: finalOpacity,
          background: gradient,
          WebkitMaskImage: `url('/assets/pattern-white.svg')`,
          maskImage: `url('/assets/pattern-white.svg')`,
          WebkitMaskRepeat: 'repeat',
          maskRepeat: 'repeat',
          WebkitMaskSize: `${size}px ${size}px`,
          maskSize: `${size}px ${size}px`,
          mixBlendMode: blendMode,
          ...style
        }}
        aria-hidden="true"
      />
    );
  }

  // Select the dedicated SVG asset file with embedded vector linear gradients / brand colors
  let patternAsset = '/assets/pattern-burgundy.svg';
  let defaultOpacity = 0.16;

  switch (variant) {
    case 'gradient-orange':
    case 'orange-gradient':
      patternAsset = '/assets/pattern-gradient-orange.svg';
      defaultOpacity = 0.32;
      break;

    case 'brand-card':
    case 'gradient-vibrant':
      patternAsset = '/assets/pattern-gradient-vibrant.svg';
      defaultOpacity = 0.38;
      break;

    case 'gradient-burgundy':
      patternAsset = '/assets/pattern-gradient-burgundy.svg';
      defaultOpacity = 0.28;
      break;

    case 'gradient-gold':
      patternAsset = '/assets/pattern-gradient-gold.svg';
      defaultOpacity = 0.35;
      break;

    case 'gradient-glow':
      patternAsset = '/assets/pattern-gradient-glow.svg';
      defaultOpacity = 0.30;
      break;

    case 'orange':
      patternAsset = '/assets/pattern-orange.svg';
      defaultOpacity = 0.28;
      break;

    case 'white':
    case 'dark':
      patternAsset = '/assets/pattern-white.svg';
      defaultOpacity = 0.18;
      break;

    case 'burgundy':
      patternAsset = '/assets/pattern-burgundy.svg';
      defaultOpacity = 0.20;
      break;

    case 'subtle':
    default:
      patternAsset = '/assets/pattern-burgundy.svg';
      defaultOpacity = 0.16;
      break;
  }

  const finalOpacity = opacity !== undefined ? opacity : defaultOpacity;

  return (
    <div
      className={`hex-pattern-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        opacity: finalOpacity,
        backgroundImage: `url('${patternAsset}')`,
        backgroundRepeat: 'repeat',
        backgroundSize: `${size}px ${size}px`,
        mixBlendMode: blendMode,
        ...style
      }}
      aria-hidden="true"
    />
  );
};
