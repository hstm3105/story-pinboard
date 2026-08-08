'use client';

import React from 'react';
import { AgentStage } from '@/lib/types';
import { CheckCircle2, Clock, Activity, ArrowRight } from 'lucide-react';

interface AgentStageCardProps {
  stage: AgentStage;
  isActive: boolean;
  onOpenDetail: (id: string) => void;
}

export const AgentStageCard: React.FC<AgentStageCardProps> = ({ stage, isActive, onOpenDetail }) => {
  const getStatusBadge = () => {
    switch (stage.status) {
      case 'queued':
        return (
          <span className="font-mono text-[10px] uppercase text-surface-subtle bg-slate-border px-2 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" /> Queued
          </span>
        );
      case 'in_progress':
        return (
          <span className="font-mono text-[10px] uppercase text-crimson bg-crimson/15 border border-crimson/40 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
            <Activity className="w-3 h-3 animate-spin" /> In Progress
          </span>
        );
      case 'complete':
        return (
          <span className="font-mono text-[10px] uppercase text-gold bg-gold/15 border border-gold/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-gold" /> Complete
          </span>
        );
    }
  };

  return (
    <button
      type="button"
      onClick={() => onOpenDetail(stage.id)}
      tabIndex={0}
      aria-label={`${stage.name}: ${stage.status}`}
      className={`min-w-[220px] flex-1 bg-slate border rounded-xl p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-crimson group ${
        stage.status === 'in_progress'
          ? 'border-crimson animate-pulse-glow shadow-[0_0_20px_rgba(196,48,43,0.3)] bg-slate-elevated'
          : stage.status === 'complete'
          ? 'border-gold/50 bg-slate hover:border-gold'
          : 'border-slate-border opacity-60 hover:opacity-100'
      } ${isActive ? 'ring-2 ring-crimson' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] text-cyan font-bold uppercase tracking-wider">
          AGENT STAGE
        </span>
        {getStatusBadge()}
      </div>

      <h3 className="font-display font-bold text-lg uppercase tracking-wide text-surface-text group-hover:text-white mb-1">
        {stage.name}
      </h3>

      <p className="font-sans text-xs text-surface-muted line-clamp-2 mb-3">
        {stage.role}
      </p>

      {stage.status === 'complete' && (
        <div className="flex items-center justify-between text-[11px] font-mono text-gold pt-2 border-t border-slate-border/50">
          <span>View Output</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </button>
  );
};
