'use client';

import React from 'react';
import { ResearchBrief } from '@/lib/types';
import { CheckCircle2, RefreshCw, Layout, Palette, Compass, Layers } from 'lucide-react';

interface ResearchDetailPanelProps {
  research: ResearchBrief;
  onApprove: () => void;
  onRegenerate: () => void;
}

export const ResearchDetailPanel: React.FC<ResearchDetailPanelProps> = ({
  research,
  onApprove,
  onRegenerate,
}) => {
  return (
    <div className="bg-slate border border-slate-border rounded-xl p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-border pb-4">
        <div>
          <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-1">
            SURFACE 02.B // RESEARCH AGENT DETAIL VIEW
          </span>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-surface-text">
            Comic Visual Composition & Color Palette Brief
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRegenerate}
            className="font-mono text-xs text-surface-muted hover:text-surface-text px-3 py-1.5 rounded bg-charcoal border border-slate-border flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-Analyze Tropes
          </button>
          <button
            onClick={onApprove}
            className="font-mono text-xs font-bold text-charcoal bg-gold hover:bg-gold/90 px-4 py-1.5 rounded flex items-center gap-1.5 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" /> Approve & Continue
          </button>
        </div>
      </div>

      {/* Target Panel Layout & Page Count Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-charcoal p-4 rounded-xl border border-slate-border space-y-1">
          <span className="font-mono text-[10px] text-cyan uppercase font-bold">PANELS PER PAGE</span>
          <div className="font-mono text-xl text-white font-bold flex items-center gap-2">
            <Layout className="w-5 h-5 text-cyan" /> {research.targetPanelsPerPage || 4} Panels
          </div>
        </div>

        <div className="bg-charcoal p-4 rounded-xl border border-slate-border space-y-1">
          <span className="font-mono text-[10px] text-gold uppercase font-bold">ISSUE TOTAL PAGES</span>
          <div className="font-mono text-xl text-white font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold" /> {research.targetTotalPages || 4} Illustrated Pages
          </div>
        </div>

        <div className="bg-charcoal p-4 rounded-xl border border-slate-border space-y-1">
          <span className="font-mono text-[10px] text-crimson uppercase font-bold">PRIMARY COLOR PALETTE</span>
          <div className="font-mono text-xs text-white font-bold flex items-center gap-2 pt-1">
            <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: research.colorPaletteStrategy?.secondaryToneHex || '#D32F2F' }} />
            <span>{research.colorPaletteStrategy?.accentGlowHex || '#5FA8B0'}</span>
          </div>
        </div>
      </div>

      {/* PANEL COMPOSITION RULES */}
      {research.panelCompositionRules && research.panelCompositionRules.length > 0 && (
        <div className="space-y-3">
          <span className="font-mono text-xs text-gold uppercase flex items-center gap-2 font-semibold">
            <Compass className="w-4 h-4 text-gold" /> PANEL GRID COMPOSITION RULES
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {research.panelCompositionRules.map((rule, idx) => (
              <div key={idx} className="bg-charcoal p-4 rounded-xl border border-slate-border space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="font-display text-base text-white uppercase">{rule.panelType}</strong>
                  <span className="font-mono text-xs bg-cyan/15 text-cyan px-2.5 py-0.5 rounded border border-cyan/30 font-bold">
                    {rule.recommendedAspect}
                  </span>
                </div>
                <p className="font-sans text-xs text-surface-muted pt-1">{rule.visualImpact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COLOR PALETTE STRATEGY */}
      {research.colorPaletteStrategy && (
        <div className="bg-charcoal p-5 rounded-xl border border-slate-border space-y-3">
          <span className="font-mono text-xs text-cyan uppercase flex items-center gap-2 font-semibold">
            <Palette className="w-4 h-4 text-cyan" /> ATMOSPHERIC COLOR PALETTE STRATEGY
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-5 h-5 rounded border" style={{ backgroundColor: research.colorPaletteStrategy.primaryToneHex }} />
              <span className="text-surface-muted">Base: {research.colorPaletteStrategy.primaryToneHex}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-5 h-5 rounded border" style={{ backgroundColor: research.colorPaletteStrategy.secondaryToneHex }} />
              <span className="text-crimson font-bold">Primary: {research.colorPaletteStrategy.secondaryToneHex}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-5 h-5 rounded border" style={{ backgroundColor: research.colorPaletteStrategy.accentGlowHex }} />
              <span className="text-cyan font-bold">Glow: {research.colorPaletteStrategy.accentGlowHex}</span>
            </div>
          </div>
          <p className="font-sans text-xs text-surface-text italic leading-relaxed">
            {research.colorPaletteStrategy.paletteRationale}
          </p>
        </div>
      )}

      {/* Curated Tropes Grid */}
      <div className="space-y-3">
        <span className="font-mono text-xs text-surface-muted uppercase block font-semibold">
          CURATED GENRE TROPES (FROM TROPE KNOWLEDGE BASE)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {research.genreTropesUsed.map((t) => (
            <div key={t.name} className="bg-charcoal p-4 rounded-xl border border-slate-border space-y-1">
              <div className="flex items-center justify-between">
                <strong className="font-display text-base text-white uppercase">{t.name}</strong>
              </div>
              <p className="font-sans text-xs text-surface-muted">{t.description}</p>
              <div className="font-mono text-[10px] text-cyan pt-1">
                <strong>Subversion Angle:</strong> {t.subversionAngle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
