'use client';

import React from 'react';

export interface SectionHeaderProps {
  label: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between border-b border-slate-border pb-3 ${className}`}>
      <div>
        <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-1">
          {label}
        </span>
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-surface-text">
          {title}
        </h2>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
