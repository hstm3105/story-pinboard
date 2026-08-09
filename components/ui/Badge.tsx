'use client';

import React from 'react';

export interface BadgeProps {
  variant?: 'crimson' | 'gold' | 'cyan' | 'neutral' | 'success';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
  icon,
}) => {
  let baseStyles = 'inline-flex items-center gap-1.5 font-mono font-bold uppercase rounded-full border tracking-wider transition-colors';
  let variantStyles = '';
  let sizeStyles = '';

  // Sizes
  if (size === 'sm') {
    sizeStyles = 'text-[10px] px-2.5 py-0.5';
  } else {
    sizeStyles = 'text-xs px-3 py-1';
  }

  // Color Variants
  switch (variant) {
    case 'crimson':
      variantStyles = 'bg-crimson/15 text-crimson border-crimson/30 shadow-[0_0_10px_rgba(211,47,47,0.2)]';
      break;
    case 'gold':
      variantStyles = 'bg-gold/15 text-gold border-gold/30 shadow-[0_0_10px_rgba(229,169,60,0.2)]';
      break;
    case 'cyan':
      variantStyles = 'bg-cyan/15 text-cyan border-cyan/30 shadow-[0_0_10px_rgba(95,168,176,0.2)]';
      break;
    case 'success':
      variantStyles = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      break;
    case 'neutral':
    default:
      variantStyles = 'bg-charcoal text-surface-muted border-slate-border';
      break;
  }

  return (
    <span className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
