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

export type HexPatternMaskFade =
  | 'none'
  | 'radial'
  | 'radial-center'
  | 'radial-corner'
  | 'radial-top-right'
  | 'radial-bottom-left'
  | 'left-to-right'
  | 'right-to-left'
  | 'top-to-bottom';

export type HexPatternMode = 'cover' | 'repeat' | 'contain' | 'auto';

interface HexPatternProps {
  opacity?: number;
  className?: string;
  variant?: HexPatternVariant;
  gradient?: string;
  size?: number; // Base height scale in px (width will preserve native 1.9733 aspect ratio to prevent distorted seams)
  mode?: HexPatternMode;
  maskFade?: HexPatternMaskFade;
  blendMode?: React.CSSProperties['mixBlendMode'];
  style?: React.CSSProperties;
}

export const HexPattern: React.FC<HexPatternProps> = ({
  opacity,
  className = '',
  variant = 'subtle',
  gradient,
  size,
  mode = 'auto',
  maskFade = 'none',
  blendMode,
  style = {}
}) => {
  // Select the dedicated SVG asset file with embedded vector linear gradients / brand colors
  let patternAsset = '/assets/pattern-burgundy.svg';
  let defaultOpacity = 0.14;

  switch (variant) {
    case 'gradient-orange':
    case 'orange-gradient':
      patternAsset = '/assets/pattern-gradient-orange.svg';
      defaultOpacity = 0.24;
      break;

    case 'brand-card':
    case 'gradient-vibrant':
      patternAsset = '/assets/pattern-gradient-vibrant.svg';
      defaultOpacity = 0.32;
      break;

    case 'gradient-burgundy':
      patternAsset = '/assets/pattern-gradient-burgundy.svg';
      defaultOpacity = 0.20;
      break;

    case 'gradient-gold':
      patternAsset = '/assets/pattern-gradient-gold.svg';
      defaultOpacity = 0.25;
      break;

    case 'gradient-glow':
      patternAsset = '/assets/pattern-gradient-glow.svg';
      defaultOpacity = 0.18;
      break;

    case 'orange':
      patternAsset = '/assets/pattern-orange.svg';
      defaultOpacity = 0.20;
      break;

    case 'white':
    case 'dark':
      patternAsset = '/assets/pattern-white.svg';
      defaultOpacity = 0.14;
      break;

    case 'burgundy':
      patternAsset = '/assets/pattern-burgundy.svg';
      defaultOpacity = 0.16;
      break;

    case 'subtle':
    default:
      patternAsset = '/assets/pattern-burgundy.svg';
      defaultOpacity = 0.12;
      break;
  }

  const finalOpacity = opacity !== undefined ? opacity : defaultOpacity;

  // Mask fade style to prevent "filling for the sake of filling" and create intentional luxury vignettes
  let maskStyle: React.CSSProperties = {};
  if (maskFade === 'radial' || maskFade === 'radial-center') {
    maskStyle = {
      WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 75%)',
      maskImage: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 75%)'
    };
  } else if (maskFade === 'radial-corner' || maskFade === 'radial-top-right') {
    maskStyle = {
      WebkitMaskImage: 'radial-gradient(circle at 90% 10%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 70%)',
      maskImage: 'radial-gradient(circle at 90% 10%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 70%)'
    };
  } else if (maskFade === 'radial-bottom-left') {
    maskStyle = {
      WebkitMaskImage: 'radial-gradient(circle at 10% 90%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 70%)',
      maskImage: 'radial-gradient(circle at 10% 90%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 70%)'
    };
  } else if (maskFade === 'left-to-right') {
    maskStyle = {
      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
      maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)'
    };
  } else if (maskFade === 'right-to-left') {
    maskStyle = {
      WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
      maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)'
    };
  } else if (maskFade === 'top-to-bottom') {
    maskStyle = {
      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)',
      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)'
    };
  }

  // Exact aspect ratio of the master pattern SVG (18736.6 / 9494.85 = 1.973354)
  const patternAspect = 18736.6 / 9494.85;

  // Master Hero-matched visual scale: 960px height = 1894px width
  const UNIFIED_PATTERN_HEIGHT = 960;

  let bgSize = 'cover';
  let bgRepeat = 'no-repeat';

  if (mode === 'cover') {
    bgSize = 'cover';
    bgRepeat = 'no-repeat';
  } else if (mode === 'contain') {
    bgSize = 'contain';
    bgRepeat = 'no-repeat';
  } else {
    // Exact identical line thickness & proportion as the Hero everywhere
    const s = size || UNIFIED_PATTERN_HEIGHT;
    bgSize = `${Math.round(s * patternAspect)}px ${s}px`;
    bgRepeat = 'repeat';
  }

  // If a custom gradient string is passed
  if (gradient) {
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
          WebkitMaskRepeat: bgRepeat,
          maskRepeat: bgRepeat,
          WebkitMaskSize: bgSize,
          maskSize: bgSize,
          WebkitMaskPosition: 'center center',
          maskPosition: 'center center',
          mixBlendMode: blendMode,
          ...maskStyle,
          ...style
        }}
        aria-hidden="true"
      />
    );
  }

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
        backgroundRepeat: bgRepeat,
        backgroundSize: bgSize,
        backgroundPosition: 'center center',
        mixBlendMode: blendMode,
        ...maskStyle,
        ...style
      }}
      aria-hidden="true"
    />
  );
};
