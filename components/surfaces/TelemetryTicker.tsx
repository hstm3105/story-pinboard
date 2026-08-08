'use client';

import React, { useState } from 'react';
import { TelemetryEvent } from '@/lib/types';
import { Terminal, ChevronUp, ChevronDown } from 'lucide-react';

interface TelemetryTickerProps {
  events: TelemetryEvent[];
}

export const TelemetryTicker: React.FC<TelemetryTickerProps> = ({ events }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const latestEvent = events[events.length - 1];

  return (
    <div className="w-full bg-charcoal-dark border border-slate-border rounded-lg overflow-hidden transition-all shadow-inner">
      {/* Ticker Control Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate/80 border-b border-slate-border/50 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan">
          <Terminal className="w-4 h-4 text-cyan animate-pulse" />
          <span className="font-bold tracking-wider uppercase">LIVE AGENT TELEMETRY TRACE</span>
          <span className="text-[10px] bg-cyan/15 text-cyan px-2 py-0.5 rounded font-mono">
            {events.length} EVENTS
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-surface-muted hover:text-cyan flex items-center gap-1 font-mono text-[11px] focus-visible:ring-1 focus-visible:ring-cyan rounded px-2"
        >
          {isExpanded ? 'Collapse Feed' : 'Expand Feed'}
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Ticker Content Window */}
      {isExpanded ? (
        <div className="p-3 max-h-48 overflow-y-auto space-y-1.5 font-mono text-xs text-cyan bg-charcoal">
          {events.map((evt) => (
            <div key={evt.id} className="flex items-start gap-3 border-b border-slate-border/30 pb-1">
              <span className="text-surface-subtle text-[10px]">{evt.timestamp}</span>
              <span className="text-gold font-bold font-mono">[{evt.stageName}]</span>
              <span className="text-cyan">{evt.message}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-2 font-mono text-xs text-cyan truncate bg-charcoal flex items-center gap-3">
          {latestEvent ? (
            <>
              <span className="text-surface-subtle text-[10px]">{latestEvent.timestamp}</span>
              <span className="text-gold font-bold">[{latestEvent.stageName}]</span>
              <span className="text-cyan truncate">{latestEvent.message}</span>
            </>
          ) : (
            <span className="text-surface-subtle opacity-60">Awaiting Agent Telemetry Stream...</span>
          )}
        </div>
      )}
    </div>
  );
};
