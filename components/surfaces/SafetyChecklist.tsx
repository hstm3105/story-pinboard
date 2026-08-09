'use client';

import React from 'react';
import { AuditCheckResult } from '@/lib/types';
import { CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from '../ui';

interface SafetyChecklistProps {
  checks: AuditCheckResult[];
  onApprove: () => void;
  onRegenerate: () => void;
}

export const SafetyChecklist: React.FC<SafetyChecklistProps> = ({ checks, onApprove, onRegenerate }) => {
  return (
    <Card variant="elevated" depth="high" className="p-6 space-y-6">
      {/* Surface Header */}
      <SectionHeader
        label="SURFACE 04 // SAFETY AUDITOR DETAIL VIEW"
        title="Safety Auditor 4-Point Compliance Audit"
        action={
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRegenerate}>
              Re-Audit Pipeline
            </Button>
            <Button variant="gold" size="sm" icon={<CheckCircle2 className="w-4 h-4" />} onClick={onApprove}>
              Approve & Proceed
            </Button>
          </div>
        }
      />

      {/* Certification Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {checks.map((chk, idx) => (
          <Card
            key={idx}
            variant={chk.passed ? 'gold-active' : 'active'}
            depth="medium"
            className="p-5 space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg uppercase text-surface-text">
                {chk.category}
              </span>
              {chk.passed ? (
                <Badge variant="gold" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                  PASSED
                </Badge>
              ) : (
                <Badge variant="crimson" size="sm" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                  FLAGGED
                </Badge>
              )}
            </div>

            <p className="font-sans text-xs text-surface-muted leading-relaxed">
              {chk.reasoning}
            </p>

            {chk.flaggedLines && chk.flaggedLines.length > 0 && (
              <div className="bg-crimson/10 border border-crimson/30 p-2.5 rounded font-mono text-[11px] text-crimson space-y-1">
                <strong>Flagged Lines:</strong>
                {chk.flaggedLines.map((line, lIdx) => (
                  <div key={lIdx} className="italic">"{line}"</div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
};
