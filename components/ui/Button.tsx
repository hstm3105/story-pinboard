'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled = false,
  ...motionProps
}) => {
  let baseStyles = 'inline-flex items-center justify-center gap-2 font-mono font-bold uppercase rounded-lg border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson disabled:opacity-50 disabled:cursor-not-allowed select-none';
  let variantStyles = '';
  let sizeStyles = '';

  // Sizes
  if (size === 'sm') {
    sizeStyles = 'text-xs px-3 py-1.5';
  } else if (size === 'lg') {
    sizeStyles = 'text-sm px-6 py-3.5';
  } else {
    sizeStyles = 'text-xs px-4 py-2.5';
  }

  // Variants
  switch (variant) {
    case 'secondary':
      variantStyles = 'bg-slate hover:bg-slate-elevated text-white border-slate-border shadow-md';
      break;
    case 'gold':
      variantStyles = 'bg-gold hover:bg-gold/90 text-charcoal border-gold/50 shadow-gold-glow';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent hover:bg-slate/60 text-surface-muted hover:text-white border-transparent';
      break;
    case 'primary':
    default:
      variantStyles = 'bg-crimson hover:bg-crimson-dark text-white border-crimson/50 shadow-crimson-glow';
      break;
  }

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...motionProps}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </motion.button>
  );
};
