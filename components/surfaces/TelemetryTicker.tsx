'use client';

import React, { useState } from 'react';
import { TelemetryEvent } from '@/lib/types';
import { Terminal, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, Badge, Button } from '../ui';
import { motion, AnimatePresence } from 'framer-motion';

interface TelemetryTickerProps {
  events: TelemetryEvent[];
}

export const TelemetryTicker: React.FC<TelemetryTickerProps> = ({ events }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const latestEvent = events[events.length - 1];

  return (
    <Card variant="flat" depth="low" className="w-full overflow-hidden">
      {/* Ticker Control Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate/90 border-b border-slate-border/50 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan">
          <Terminal className="w-4 h-4 text-cyan animate-pulse" />
          <span className="font-bold tracking-wider uppercase">LIVE AGENT TELEMETRY TRACE</span>
          <Badge variant="cyan" size="sm">
            {events.length} EVENTS
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] py-1"
        >
          {isExpanded ? 'Collapse Feed' : 'Expand Feed'}
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronUp className="w-3.5 h-3.5 ml-1" />}
        </Button>
      </div>

      {/* Ticker Content Window */}
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="p-3 max-h-48 overflow-y-auto space-y-1.5 font-mono text-xs text-cyan bg-charcoal"
          >
            {events.map((evt) => (
              <div key={evt.id} className="flex items-start gap-3 border-b border-slate-border/30 pb-1">
                <span className="text-surface-subtle text-[10px]">{evt.timestamp}</span>
                <span className="text-gold font-bold font-mono">[{evt.stageName}]</span>
                <span className="text-cyan">{evt.message}</span>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-2 font-mono text-xs text-cyan truncate bg-charcoal flex items-center gap-3"
          >
            {latestEvent ? (
              <>
                <span className="text-surface-subtle text-[10px]">{latestEvent.timestamp}</span>
                <span className="text-gold font-bold">[{latestEvent.stageName}]</span>
                <span className="text-cyan truncate">{latestEvent.message}</span>
              </>
            ) : (
              <span className="text-surface-subtle opacity-60">Awaiting Agent Telemetry Stream...</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
