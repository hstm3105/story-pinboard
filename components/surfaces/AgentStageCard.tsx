'use client';

import React from 'react';
import { AgentStage } from '@/lib/types';
import { CheckCircle2, Clock, Activity, ArrowRight } from 'lucide-react';
import { Card, Badge } from '../ui';
import { motion, AnimatePresence } from 'framer-motion';

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
          <Badge variant="neutral" size="sm" icon={<Clock className="w-3 h-3" />}>
            Queued
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="crimson" size="sm" icon={<Activity className="w-3 h-3 animate-spin" />} className="animate-pulse">
            In Progress
          </Badge>
        );
      case 'complete':
        return (
          <Badge variant="gold" size="sm" icon={<CheckCircle2 className="w-3 h-3 text-gold" />}>
            Complete
          </Badge>
        );
    }
  };

  const cardVariant = stage.status === 'in_progress'
    ? 'active'
    : stage.status === 'complete'
    ? 'gold-active'
    : 'flat';

  return (
    <Card
      variant={cardVariant}
      interactive
      onClick={() => onOpenDetail(stage.id)}
      className={`min-w-[220px] flex-1 p-4 text-left transition-all duration-200 group ${
        isActive ? 'ring-2 ring-crimson' : ''
      } ${stage.status === 'queued' ? 'opacity-60 hover:opacity-100' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] text-cyan font-bold uppercase tracking-wider">
          AGENT STAGE
        </span>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.status}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {getStatusBadge()}
          </motion.div>
        </AnimatePresence>
      </div>

      <h3 className="font-display font-bold text-lg uppercase tracking-wide text-surface-text group-hover:text-white mb-1">
        {stage.name}
      </h3>

      <p className="font-sans text-xs text-surface-muted line-clamp-2 mb-3">
        {stage.role}
      </p>

      {stage.status === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between text-[11px] font-mono text-gold pt-2 border-t border-slate-border/50"
        >
          <span>View Output</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </motion.div>
      )}
    </Card>
  );
};
