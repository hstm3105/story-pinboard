'use client';

import React from 'react';
import { AgentStage } from '@/lib/types';
import { AgentStageCard } from './AgentStageCard';
import { Cpu } from 'lucide-react';
import { SectionHeader, Badge } from '../ui';

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
      {/* Standardized Section Header with Badge */}
      <SectionHeader
        label="SURFACE 02 // PRODUCTION STATUS ROW"
        title="Studio Master Deck"
        action={
          <Badge variant="gold" size="md" icon={<Cpu className="w-3.5 h-3.5 text-gold" />}>
            6-AGENT PIPELINE
          </Badge>
        }
      />

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
