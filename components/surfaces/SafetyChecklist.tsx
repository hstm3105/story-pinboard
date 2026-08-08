'use client';

import React from 'react';
import { AuditCheckResult } from '@/lib/types';
import { CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface SafetyChecklistProps {
  checks: AuditCheckResult[];
  onApprove: () => void;
  onRegenerate: () => void;
}

export const SafetyChecklist: React.FC<SafetyChecklistProps> = ({ checks, onApprove, onRegenerate }) => {
  return (
    <div className="bg-slate border border-slate-border rounded-xl p-6 space-y-6 shadow-2xl">
      {/* Surface Header */}
      <div className="flex items-center justify-between border-b border-slate-border pb-4">
        <div>
          <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-1">
            SURFACE 04 // SAFETY AUDITOR DETAIL VIEW
          </span>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-surface-text">
            Safety Auditor 4-Point Compliance Audit
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRegenerate}
            className="font-mono text-xs text-surface-muted hover:text-surface-text px-3 py-1.5 rounded bg-charcoal border border-slate-border flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-Audit Pipeline
          </button>
          <button
            onClick={onApprove}
            className="font-mono text-xs font-bold text-charcoal bg-gold hover:bg-gold/90 px-4 py-1.5 rounded flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Approve & Proceed to Voice Agent
          </button>
        </div>
      </div>

      {/* Certification Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {checks.map((chk, idx) => (
          <div
            key={idx}
            className="bg-charcoal border border-slate-border rounded-xl p-5 space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg uppercase text-surface-text">
                {chk.category}
              </span>
              {chk.passed ? (
                <span className="bg-gold/15 text-gold border border-gold/40 px-2.5 py-1 rounded font-mono text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                </span>
              ) : (
                <span className="bg-crimson/15 text-crimson border border-crimson/40 px-2.5 py-1 rounded font-mono text-[10px] font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> FLAGGED
                </span>
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
          </div>
        ))}
      </div>
    </div>
  );
};
