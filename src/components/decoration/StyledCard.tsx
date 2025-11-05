"use client";

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CardStyles {
  background: string;
  color: string;
  borderColor: string;
  boxShadow: string;
  iconColor: string;
  textColor: string;
}

interface StyledCardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'solution' | 'problem' | 'custom';
  customStyles?: Partial<CardStyles>;
  fullWidth?: boolean;
}

const StyledCard: React.FC<StyledCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  className = '',
  variant = 'solution',
  customStyles,
  fullWidth = false
}) => {
  const getVariantStyles = (): CardStyles => {
    const defaultStyles: CardStyles = {
      background: 'linear-gradient(180deg, rgba(185,215,234,0.9) 0%, rgba(214,230,242,0.9) 100%)',
      color: '#0b1220',
      borderColor: '#B9D7EA',
      boxShadow: '0 10px 30px rgba(185,215,234,0.45)',
      iconColor: '#769FCD',
      textColor: '#0b1220'
    };

    switch (variant) {
      case 'solution':
        return defaultStyles;
      case 'problem':
        return {
          background: 'linear-gradient(180deg, rgba(255,107,107,0.9) 0%, rgba(255,159,159,0.9) 100%)',
          color: '#2d1b1b',
          borderColor: '#FF6B6B',
          boxShadow: '0 10px 30px rgba(255,107,107,0.45)',
          iconColor: '#FF4757',
          textColor: '#2d1b1b'
        };
      case 'custom':
        return { ...defaultStyles, ...customStyles };
      default:
        return defaultStyles;
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`relative ${fullWidth ? 'w-full' : 'max-w-sm'} rounded-2xl px-5 py-4 shadow-lg ring-1 backdrop-blur-sm breathing-glow ${className}`}
      style={{
        background: styles.background,
        color: styles.color,
        borderColor: styles.borderColor,
        boxShadow: styles.boxShadow,
        ...customStyles
      }}
    >
      {(title || subtitle) && (
        <div className="flex items-center gap-2 mb-1">
          {icon || <CheckCircle className="w-4 h-4" style={{ color: styles.iconColor }} />}
          <span 
            className="text-sm font-bold tracking-wide" 
            style={{ color: styles.iconColor }}
          >
            {title || subtitle}
          </span>
        </div>
      )}
      
      <div className="text-md leading-relaxed" style={{ color: styles.textColor }}>
        {children}
      </div>
      {/* Breathing glow (inner, no outer halo/padding) */}
      <style jsx>{`
        .breathing-glow { overflow: hidden; }
        .breathing-glow::after {
          content: '';
          position: absolute;
          inset: 0; /* keep entirely inside the card */
          border-radius: inherit;
          pointer-events: none;
          /* inner glow only */
          box-shadow: inset 0 0 28px 8px rgba(118, 159, 205, 0.28),
                      inset 0 0 10px 2px rgba(118, 159, 205, 0.18);
          animation: card-breathe-inset 3.2s ease-in-out infinite;
        }

        @keyframes card-breathe-inset {
          0% {
            box-shadow: inset 0 0 18px 6px rgba(118, 159, 205, 0.18),
                        inset 0 0 6px 1px rgba(118, 159, 205, 0.12);
            filter: saturate(0.95);
          }
          50% {
            box-shadow: inset 0 0 34px 12px rgba(118, 159, 205, 0.45),
                        inset 0 0 14px 3px rgba(118, 159, 205, 0.30);
            filter: saturate(1.05);
          }
          100% {
            box-shadow: inset 0 0 18px 6px rgba(118, 159, 205, 0.18),
                        inset 0 0 6px 1px rgba(118, 159, 205, 0.12);
            filter: saturate(0.95);
          }
        }
      `}</style>
    </div>
  );
};

export default StyledCard;
