import React from 'react';

interface BrandLogoProps {
  variant?: 'full-white' | 'full-burgundy' | 'full-orange' | 'monogram-white' | 'monogram-burgundy' | 'house-burgundy' | 'house-white' | 'icon';
  className?: string;
  height?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full-white',
  className = '',
  height = 42
}) => {
  switch (variant) {
    case 'full-burgundy':
      return (
        <img
          src="/assets/logo-burgundy.png"
          alt="New Era Real Estate"
          style={{ height: `${height}px`, width: 'auto' }}
          className={`brand-logo ${className}`}
        />
      );
    case 'full-orange':
      return (
        <img
          src="/assets/logo-orange.png"
          alt="New Era Real Estate"
          style={{ height: `${height}px`, width: 'auto' }}
          className={`brand-logo ${className}`}
        />
      );
    case 'monogram-burgundy':
      return (
        <img
          src="/assets/monogram-burgundy.png"
          alt="NE Monogram"
          style={{ height: `${height}px`, width: 'auto' }}
          className={`brand-monogram ${className}`}
        />
      );
    case 'monogram-white':
      return (
        <img
          src="/assets/monogram-white.png"
          alt="NE Monogram"
          style={{ height: `${height}px`, width: 'auto' }}
          className={`brand-monogram ${className}`}
        />
      );
    case 'house-burgundy':
      return (
        <img
          src="/assets/house-burgundy.png"
          alt="New Era House Mark"
          style={{ height: `${height}px`, width: 'auto' }}
          className={`brand-house ${className}`}
        />
      );
    case 'icon':
      return (
        <img
          src="/assets/favicon.png"
          alt="NE Emblem"
          style={{ height: `${height}px`, width: 'auto' }}
          className={`brand-icon ${className}`}
        />
      );
    case 'house-white':
      return (
        <svg
          viewBox="0 0 100 80"
          style={{ height: `${height}px`, width: 'auto' }}
          className={`brand-house-svg ${className}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 12 38 L 48 14 L 88 40" />
          <path d="M 48 14 L 48 5" />
          <path d="M 48 5 L 68 18" />
          <path d="M 22 35 L 22 75 L 42 75 L 42 35" />
          <path d="M 54 35 L 54 75 L 78 75 L 78 35" />
          <line x1="5" y1="75" x2="95" y2="75" />
        </svg>
      );
    case 'full-white':
    default:
      return (
        <img
          src="/assets/logo-white.png"
          alt="New Era Real Estate"
          style={{ height: `${height}px`, width: 'auto' }}
          className={`brand-logo ${className}`}
        />
      );
  }
};
