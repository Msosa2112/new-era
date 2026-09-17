import React from 'react';

interface HexPatternProps {
  opacity?: number;
  color?: string;
  className?: string;
  variant?: 'subtle' | 'burgundy' | 'dark';
}

export const HexPattern: React.FC<HexPatternProps> = ({
  opacity = 0.06,
  color = '#721623',
  className = '',
  variant = 'subtle'
}) => {
  const strokeColor = variant === 'dark' ? 'rgba(255, 255, 255, 0.08)' : color;

  return (
    <div
      className={`hex-pattern-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        opacity
      }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="hex-brand-pattern"
            width="56"
            height="96.9948"
            patternUnits="userSpaceOnUse"
          >
            {/* Architectural Hexagonal Mesh */}
            <path
              d="M 28 0 L 56 16.1658 L 56 48.4974 L 28 64.6632 L 0 48.4974 L 0 16.1658 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.2"
            />
            <path
              d="M 28 64.6632 L 56 80.829 L 56 113.1606 L 28 129.3264 L 0 113.1606 L 0 80.829 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.2"
            />
            <path
              d="M 56 48.4974 L 84 64.6632 L 84 96.9948 L 56 113.1606 L 28 96.9948 L 28 64.6632 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-brand-pattern)" />
      </svg>
    </div>
  );
};
