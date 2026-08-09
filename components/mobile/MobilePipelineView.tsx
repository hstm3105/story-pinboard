'use client';

import React from 'react';
import { AgentStage, StoryBible, TelemetryEvent } from '@/lib/types';
import { Clapperboard, CheckCircle2, Activity, Clock } from 'lucide-react';
import { Card, Badge, SectionHeader } from '../ui';

interface MobilePipelineViewProps {
  stages: AgentStage[];
  concept: StoryBible | null;
  telemetryEvents: TelemetryEvent[];
  onOpenDetail: (id: string) => void;
}

export const MobilePipelineView: React.FC<MobilePipelineViewProps> = ({
  stages,
  concept,
  telemetryEvents,
  onOpenDetail,
}) => {
  const latestEvent = telemetryEvents[telemetryEvents.length - 1];

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto pb-24">
      {/* Mobile Telemetry Indicator */}
      {latestEvent && (
        <Card variant="flat" depth="low" className="p-3 border-cyan/40 flex items-center gap-2 font-mono text-xs text-cyan">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan animate-pulse shrink-0" />
          <span className="truncate">{latestEvent.message}</span>
        </Card>
      )}

      {/* Hero Concept Card */}
      {concept && (
        <Card variant="elevated" depth="high" className="border-l-4 border-l-crimson p-5 space-y-2">
          <div className="flex items-center gap-2 text-crimson">
            <Clapperboard className="w-4 h-4" />
            <Badge variant="crimson" size="sm">
              {concept.genreBlend}
            </Badge>
          </div>
          <h2 className="font-display font-bold text-2xl uppercase text-white">{concept.title}</h2>
          <p className="font-sans text-xs text-surface-muted italic">"{concept.tagline}"</p>
        </Card>
      )}

      {/* Stacked Agent Stage Cards */}
      <div className="space-y-3">
        <SectionHeader label="MOBILE PIPELINE ROW" title="Production Stages" />

        {stages.map((st) => (
          <Card
            key={st.id}
            variant={st.status === 'in_progress' ? 'active' : st.status === 'complete' ? 'gold-active' : 'flat'}
            interactive
            onClick={() => onOpenDetail(st.id)}
            className="p-4 flex items-center justify-between"
          >
            <div>
              <h4 className="font-display font-bold text-base uppercase text-white">{st.name}</h4>
              <p className="font-sans text-xs text-surface-muted">{st.role}</p>
            </div>
            <div>
              {st.status === 'complete' && <CheckCircle2 className="w-5 h-5 text-gold" />}
              {st.status === 'in_progress' && <Activity className="w-5 h-5 text-crimson animate-spin" />}
              {st.status === 'queued' && <Clock className="w-5 h-5 text-surface-subtle" />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
