'use client';

import React, { useState } from 'react';
import { EpisodeScript } from '@/lib/types';
import { BookOpen, RefreshCw, CheckCircle2, Layers, MessageSquare, Zap } from 'lucide-react';

interface TeleprompterViewProps {
  script: EpisodeScript;
  onApprove: () => void;
  onRegenerate: () => void;
}

export const TeleprompterView: React.FC<TeleprompterViewProps> = ({
  script,
  onApprove,
  onRegenerate,
}) => {
  const pages = script.pages || [];
  const [activePageIdx, setActivePageIdx] = useState(0);
  const activePage = pages[activePageIdx] || pages[0];

  return (
    <div className="bg-slate border border-slate-border rounded-xl p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-border pb-4">
        <div>
          <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-1">
            SURFACE 03 // SCREENWRITER COMIC SCRIPT VIEW
          </span>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-surface-text">
            Page & Panel Breakdowns, Speech Bubbles & Visual SFX
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRegenerate}
            className="font-mono text-xs text-surface-muted hover:text-surface-text px-3 py-1.5 rounded bg-charcoal border border-slate-border flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate Script
          </button>
          <button
            onClick={onApprove}
            className="font-mono text-xs font-bold text-charcoal bg-gold hover:bg-gold/90 px-4 py-1.5 rounded flex items-center gap-1.5 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" /> Approve Comic Script
          </button>
        </div>
      </div>

      {/* PAGE TAB SWITCHER */}
      {pages.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-border/50">
          <span className="font-mono text-xs text-gold flex items-center gap-1 shrink-0 font-bold mr-2">
            <Layers className="w-4 h-4 text-gold" /> COMIC PAGES:
          </span>
          {pages.map((p, idx) => {
            const isSelected = activePageIdx === idx;
            return (
              <button
                key={p.pageNum}
                onClick={() => setActivePageIdx(idx)}
                className={`px-3.5 py-1.5 rounded font-mono text-xs flex items-center gap-2 shrink-0 border transition-all ${
                  isSelected
                    ? 'bg-crimson text-white border-crimson shadow-md font-bold'
                    : 'bg-charcoal text-surface-muted border-slate-border hover:text-white'
                }`}
              >
                <span>PAGE {p.pageNum}</span>
                {p.isKeyframeSplashPage && (
                  <span className="bg-gold text-charcoal text-[9px] px-1.5 rounded font-black">SPLASH</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ACTIVE PAGE PANEL SCRIPT SHOWCASE */}
      {activePage && (
        <div className="bg-charcoal border border-slate-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-border/50 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan" />
              <span className="font-mono text-xs text-cyan uppercase font-bold">
                PAGE #{activePage.pageNum} // {activePage.pageTitle}
              </span>
            </div>
            {activePage.isKeyframeSplashPage && (
              <span className="bg-gold/15 text-gold border border-gold/40 px-3 py-0.5 rounded font-mono text-xs font-bold">
                FULL SPLASH PAGE BREAKDOWN
              </span>
            )}
          </div>

          {/* Panel Breakdown Cards */}
          <div className="space-y-4">
            {activePage.panels.map((panel) => (
              <div key={panel.panelNum} className="bg-slate p-4 rounded-xl border border-slate-border space-y-3">
                <div className="flex items-center justify-between border-b border-slate-border/50 pb-2">
                  <span className="font-mono text-xs text-gold font-bold bg-charcoal px-2.5 py-1 rounded border border-gold/30">
                    PANEL #{panel.panelNum} ({panel.panelStyle})
                  </span>
                  {panel.visualSoundFX && (
                    <span className="font-display font-black text-xs text-yellow-300 bg-red-600 px-2.5 py-0.5 rounded uppercase">
                      ⚡ SFX: {panel.visualSoundFX}
                    </span>
                  )}
                </div>

                <div className="font-sans text-xs text-surface-muted italic bg-charcoal/60 p-2.5 rounded border border-slate-border/40">
                  <strong className="text-cyan font-mono not-italic block mb-0.5">VISUAL SCENE PROMPT:</strong>
                  {panel.visualFocusPrompt || panel.sceneDescription}
                </div>

                {/* Speech Bubbles List */}
                <div className="space-y-2 font-mono text-xs pt-1">
                  <span className="text-surface-subtle text-[10px] uppercase font-bold flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-gold" /> SPEECH BUBBLES & CAPTIONS:
                  </span>
                  {panel.speechBubbles.map((bubble) => (
                    <div key={bubble.id} className="bg-charcoal p-2.5 rounded border border-slate-border/60 flex items-start gap-2">
                      <span className="text-crimson font-bold shrink-0">{bubble.speaker}:</span>
                      <span className="text-white font-sans font-semibold">"{bubble.text}"</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
