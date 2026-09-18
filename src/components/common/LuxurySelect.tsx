import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface LuxurySelectProps {
  value: string | number | undefined;
  onChange: (value: any) => void;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'light' | 'glass';
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  'aria-label'?: string;
}

export const LuxurySelect: React.FC<LuxurySelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  variant = 'light',
  className = '',
  style,
  id,
  'aria-label': ariaLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isGlass = variant === 'glass';

  // Find currently selected option
  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : placeholder || (options[0]?.label ?? '');

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
  };

  // Styles depending on variant
  const triggerBg = isGlass ? 'rgba(0, 0, 0, 0.55)' : 'var(--bg-primary)';
  const triggerBorder = isOpen
    ? 'var(--color-burgundy-primary)'
    : isGlass
    ? 'rgba(255, 255, 255, 0.16)'
    : 'var(--border-subtle)';
  const triggerColor = isGlass ? '#FFFFFF' : 'var(--text-primary)';
  const menuBg = isGlass ? 'rgba(18, 5, 10, 0.96)' : '#FFFFFF';
  const menuBorder = isGlass ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid var(--border-subtle)';
  const menuShadow = isGlass
    ? '0 20px 48px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.1)'
    : '0 16px 36px -4px rgba(18, 20, 24, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)';

  return (
    <div
      ref={containerRef}
      className={`luxury-select-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        ...style
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: '48px',
          padding: '0.85rem 1rem',
          backgroundColor: triggerBg,
          border: `1px solid ${triggerBorder}`,
          borderRadius: 'var(--radius-xs)',
          color: triggerColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.9rem',
          fontWeight: 500,
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 3px rgba(102, 14, 26, 0.16)' : 'none',
          transition: 'border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease'
        }}
        className="luxury-select-trigger"
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left'
          }}
        >
          {displayLabel}
        </span>
        <ChevronDown
          size={16}
          color={isGlass ? 'var(--color-orange-accent)' : 'var(--color-burgundy-primary)'}
          style={{
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 220ms var(--ease-out-fluid)'
          }}
        />
      </button>

      {/* Luxury Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '100%',
            minWidth: '220px',
            backgroundColor: menuBg,
            backdropFilter: isGlass ? 'blur(24px)' : 'none',
            WebkitBackdropFilter: isGlass ? 'blur(24px)' : 'none',
            border: menuBorder,
            borderRadius: '6px',
            boxShadow: menuShadow,
            zIndex: 100,
            overflow: 'hidden',
            padding: '0.35rem',
            animation: 'luxurySelectOpen 180ms var(--ease-out-fluid) both',
            transformOrigin: 'top center'
          }}
          className="luxury-select-menu"
        >
          <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected
                      ? isGlass
                        ? '#FFFFFF'
                        : 'var(--color-burgundy-primary)'
                      : isGlass
                      ? 'rgba(255, 255, 255, 0.88)'
                      : 'var(--text-primary)',
                    backgroundColor: isSelected
                      ? isGlass
                        ? 'rgba(102, 14, 26, 0.45)'
                        : 'rgba(102, 14, 26, 0.08)'
                      : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 140ms ease, color 140ms ease',
                    marginBottom: '1px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = isGlass
                        ? 'rgba(255, 255, 255, 0.09)'
                        : 'rgba(0, 0, 0, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {opt.label}
                  </span>
                  {isSelected && (
                    <Check
                      size={14}
                      color={isGlass ? 'var(--color-orange-accent)' : 'var(--color-burgundy-primary)'}
                      style={{ flexShrink: 0 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes luxurySelectOpen {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @media (max-width: 640px) {
          .luxury-select-trigger {
            height: 38px !important;
            padding: 0.5rem 0.75rem !important;
            font-size: 0.82rem !important;
          }
        }
      `}</style>
    </div>
  );
};
