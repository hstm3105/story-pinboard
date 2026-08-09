'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'flat' | 'elevated' | 'active' | 'gold-active';
  interactive?: boolean;
  depth?: 'low' | 'medium' | 'high';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'flat',
  interactive = false,
  depth = 'medium',
  children,
  className = '',
  ...motionProps
}) => {
  let baseStyles = 'rounded-xl border transition-all duration-200 relative overflow-hidden';
  let variantStyles = '';
  let shadowStyles = '';

  // Depth Shadows
  if (depth === 'low') {
    shadowStyles = 'shadow-md';
  } else if (depth === 'high') {
    shadowStyles = 'shadow-2xl';
  } else {
    shadowStyles = 'shadow-xl';
  }

  // Variants
  switch (variant) {
    case 'elevated':
      variantStyles = 'bg-gradient-to-br from-slate-elevated via-slate to-charcoal border-slate-border text-surface-text';
      break;
    case 'active':
      variantStyles = 'bg-gradient-to-r from-slate-elevated via-slate to-charcoal border-crimson text-white animate-pulse-glow shadow-crimson-glow';
      break;
    case 'gold-active':
      variantStyles = 'bg-gradient-to-r from-slate-elevated via-slate to-charcoal border-gold text-white shadow-gold-glow';
      break;
    case 'flat':
    default:
      variantStyles = 'bg-slate border-slate-border text-surface-text';
      break;
  }

  return (
    <motion.div
      whileHover={interactive ? { y: -3 } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      transition={{ duration: 0.2 }}
      className={`${baseStyles} ${variantStyles} ${shadowStyles} ${interactive ? 'cursor-pointer' : ''} ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
