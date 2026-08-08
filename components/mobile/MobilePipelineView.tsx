'use client';

import React from 'react';
import { AgentStage, StoryBible, TelemetryEvent } from '@/lib/types';
import { Clapperboard, CheckCircle2, Activity, Clock } from 'lucide-react';

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
        <div className="bg-charcoal border border-cyan/40 p-3 rounded-lg flex items-center gap-2 font-mono text-xs text-cyan">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan animate-pulse" />
          <span className="truncate">{latestEvent.message}</span>
        </div>
      )}

      {/* Hero Concept Card */}
      {concept && (
        <div className="bg-slate border-l-4 border-l-crimson border border-slate-border p-5 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-crimson">
            <Clapperboard className="w-4 h-4" />
            <span className="font-mono text-xs font-bold uppercase">{concept.genreBlend}</span>
          </div>
          <h2 className="font-display font-bold text-2xl uppercase text-white">{concept.title}</h2>
          <p className="font-sans text-xs text-surface-muted italic">"{concept.tagline}"</p>
        </div>
      )}

      {/* Stacked Agent Stage Cards */}
      <div className="space-y-3">
        <h3 className="font-mono text-xs text-gold uppercase tracking-widest">
          PRODUCTION STAGE ROW
        </h3>

        {stages.map((st) => (
          <div
            key={st.id}
            onClick={() => onOpenDetail(st.id)}
            className="bg-slate border border-slate-border p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-crimson"
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
          </div>
        ))}
      </div>
    </div>
  );
};
