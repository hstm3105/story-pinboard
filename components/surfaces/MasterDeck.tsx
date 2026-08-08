'use client';

import React from 'react';
import { AgentStage } from '@/lib/types';
import { AgentStageCard } from './AgentStageCard';
import { Cpu } from 'lucide-react';

interface MasterDeckProps {
  stages: AgentStage[];
  activeDetailStageId: string | null;
  onOpenDetail: (id: string) => void;
}

export const MasterDeck: React.FC<MasterDeckProps> = ({
  stages,
  activeDetailStageId,
  onOpenDetail,
}) => {
  return (
    <section className="w-full space-y-4">
      {/* Deck Header */}
      <div className="flex items-center justify-between border-b border-slate-border pb-3">
        <div>
          <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-1">
            SURFACE 02 // PRODUCTION STATUS ROW
          </span>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-surface-text">
            Studio Master Deck
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-gold bg-gold/10 px-3 py-1.5 rounded-md border border-gold/30">
          <Cpu className="w-4 h-4 text-gold" /> 6-AGENT PIPELINE
        </div>
      </div>

      {/* Horizontal Scrollable Row of 6 Agent Cards */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {stages.map((st) => (
          <AgentStageCard
            key={st.id}
            stage={st}
            isActive={activeDetailStageId === st.id}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>
    </section>
  );
};
