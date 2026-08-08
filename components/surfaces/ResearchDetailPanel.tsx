'use client';

import React from 'react';
import { ResearchBrief } from '@/lib/types';
import { CheckCircle2, RefreshCw, Zap, Target, TrendingUp, Compass, Lightbulb } from 'lucide-react';

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
            Independent Market Intelligence & Retention Strategy
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

      {/* Target Audio Pacing & Word Count Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-charcoal p-4 rounded-xl border border-slate-border space-y-1">
          <span className="font-mono text-[10px] text-cyan uppercase font-bold">TARGET WPM</span>
          <div className="font-mono text-xl text-white font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan" /> {research.targetWPM} WPM
          </div>
        </div>

        <div className="bg-charcoal p-4 rounded-xl border border-slate-border space-y-1">
          <span className="font-mono text-[10px] text-gold uppercase font-bold">EPISODE DURATION</span>
          <div className="font-mono text-xl text-white font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-gold" /> {research.targetEpisodeDurationMinutes} Minutes
          </div>
        </div>

        <div className="bg-charcoal p-4 rounded-xl border border-slate-border space-y-1">
          <span className="font-mono text-[10px] text-crimson uppercase font-bold">TARGET WORD COUNT</span>
          <div className="font-mono text-xl text-white font-bold flex items-center gap-2">
            {research.targetWordCount} Words
          </div>
        </div>
      </div>

      {/* INDEPENDENT MARKET TRENDS */}
      {research.genreMarketTrends && research.genreMarketTrends.length > 0 && (
        <div className="space-y-3">
          <span className="font-mono text-xs text-gold uppercase flex items-center gap-2 font-semibold">
            <TrendingUp className="w-4 h-4 text-gold" /> INDEPENDENT GENRE MARKET TRENDS & PERFORMANCE
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {research.genreMarketTrends.map((t, idx) => (
              <div key={idx} className="bg-charcoal p-4 rounded-xl border border-slate-border space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="font-display text-base text-white uppercase">{t.trendName}</strong>
                  <span className="font-mono text-xs bg-gold/15 text-gold px-2.5 py-0.5 rounded border border-gold/30 font-bold">
                    {t.marketShareGain}
                  </span>
                </div>
                <p className="font-sans text-xs text-surface-muted pt-1">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STRATEGIC POSITIONING ANALYSIS */}
      {research.seriesPositioningAnalysis && (
        <div className="bg-charcoal p-5 rounded-xl border border-slate-border space-y-2">
          <span className="font-mono text-xs text-cyan uppercase flex items-center gap-2 font-semibold">
            <Compass className="w-4 h-4 text-cyan" /> SERIES COMPETITIVE POSITIONING ANALYSIS
          </span>
          <p className="font-sans text-sm text-surface-text leading-relaxed">
            {research.seriesPositioningAnalysis}
          </p>
        </div>
      )}

      {/* ACTIONABLE OPTIMIZATION RECOMMENDATIONS */}
      {research.optimizationRecommendations && research.optimizationRecommendations.length > 0 && (
        <div className="bg-charcoal p-5 rounded-xl border border-slate-border space-y-2">
          <span className="font-mono text-xs text-crimson uppercase flex items-center gap-2 font-semibold">
            <Lightbulb className="w-4 h-4 text-crimson" /> RETENTION & MONETIZATION OPTIMIZATION RECOMMENDATIONS
          </span>
          <ul className="space-y-2 font-sans text-xs text-surface-text">
            {research.optimizationRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate p-2.5 rounded border border-slate-border/50">
                <span className="font-mono font-bold text-crimson">{idx + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
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
