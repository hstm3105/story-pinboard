'use client';

import React, { useState } from 'react';
import { ProductionManifest, RenderedComicPage } from '@/lib/types';
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, Eye, Maximize2, Zap } from 'lucide-react';

interface ComicBookReaderProps {
  manifest: ProductionManifest;
  onApprove?: () => void;
}

export const ComicBookReader: React.FC<ComicBookReaderProps> = ({ manifest, onApprove }) => {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const activePage = manifest.pages[activePageIndex] || manifest.pages[0];

  const handlePrev = () => {
    if (activePageIndex > 0) setActivePageIndex(activePageIndex - 1);
  };

  const handleNext = () => {
    if (activePageIndex < manifest.pages.length - 1) setActivePageIndex(activePageIndex + 1);
  };

  return (
    <div className="bg-slate border border-slate-border rounded-xl p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-border pb-4">
        <div>
          <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-1">
            SURFACE 06 // GRAPHIC NOVEL & COMIC BOOK READER
          </span>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-surface-text">
            {manifest.title} — Issue #{manifest.issueNum} ({manifest.visualStyle})
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs bg-gold/15 text-gold border border-gold/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> {manifest.totalPages} PAGES ILLUSTRATED
          </span>
          {onApprove && (
            <button
              onClick={onApprove}
              className="font-mono text-xs font-bold text-charcoal bg-gold hover:bg-gold/90 px-4 py-1.5 rounded flex items-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" /> Finalize Publication
            </button>
          )}
        </div>
      </div>

      {/* PAGE NAVIGATION CONTROLS BAR */}
      <div className="bg-charcoal border border-slate-border rounded-xl p-4 flex items-center justify-between font-mono text-xs">
        <button
          onClick={handlePrev}
          disabled={activePageIndex === 0}
          className="flex items-center gap-1.5 bg-slate hover:bg-slate-elevated px-3.5 py-1.5 rounded border border-slate-border disabled:opacity-30 text-white font-bold transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Page
        </button>

        <div className="flex items-center gap-2">
          <span className="text-surface-muted">PAGE</span>
          <span className="text-crimson font-bold text-base">{activePageIndex + 1}</span>
          <span className="text-surface-muted">OF {manifest.pages.length}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={activePageIndex === manifest.pages.length - 1}
          className="flex items-center gap-1.5 bg-crimson hover:bg-crimson-dark px-3.5 py-1.5 rounded text-white font-bold transition-all disabled:opacity-30 shadow-md"
        >
          Next Page <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* MAIN COMIC PAGE CANVAS DISPLAY */}
      {activePage && (
        <div className="bg-slate-elevated border-2 border-slate-border rounded-xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Page Banner Header */}
          <div className="flex items-center justify-between border-b border-slate-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="font-display font-bold text-lg text-white uppercase">
                {activePage.pageTitle}
              </span>
            </div>
            {activePage.isKeyframeSplashPage && (
              <span className="font-mono text-xs bg-crimson/20 text-crimson border border-crimson/40 px-3 py-1 rounded font-bold uppercase">
                FULL SPLASH PAGE
              </span>
            )}
          </div>

          {/* COMIC PANELS GRID (Responsive 2x2 or Full Splash) */}
          <div className={`grid gap-5 ${activePage.isKeyframeSplashPage ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {activePage.panels.map((panel) => (
              <div
                key={panel.panelNum}
                className={`relative bg-gradient-to-br ${panel.bgGradient} border-2 border-slate-border rounded-xl p-5 shadow-2xl space-y-4 min-h-[220px] flex flex-col justify-between overflow-hidden group hover:border-crimson transition-all`}
              >
                {/* Panel Header & Visual Focus Prompt */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-black/60 text-gold px-2 py-0.5 rounded border border-gold/30 font-bold">
                      PANEL #{panel.panelNum}
                    </span>
                    <span className="text-xl">{panel.avatarIcon}</span>
                  </div>

                  {/* Visual Sound FX Callout Badge */}
                  {panel.visualSoundFX && (
                    <span className="font-display font-black text-sm text-yellow-300 bg-red-600/90 px-3 py-1 rounded shadow-[0_0_12px_rgba(239,68,68,0.8)] rotate-[-3deg] uppercase tracking-widest border border-yellow-300 animate-pulse">
                      ⚡ {panel.visualSoundFX}
                    </span>
                  )}
                </div>

                {/* Panel Visual Description Scene Prompt */}
                <div className="bg-black/50 p-3 rounded border border-white/10 font-sans text-xs text-slate-200 italic space-y-1">
                  <span className="font-mono text-[10px] text-cyan uppercase font-bold block">
                    SCENE VISUAL PROMPT:
                  </span>
                  <p>{panel.visualFocusPrompt || panel.sceneDescription}</p>
                </div>

                {/* SPEECH BUBBLES & NARRATION CAPTIONS */}
                <div className="space-y-2 pt-2">
                  {panel.speechBubbles.map((bubble) => {
                    if (bubble.bubbleType === 'caption') {
                      return (
                        <div key={bubble.id} className="bg-yellow-400/90 text-black border border-yellow-600 font-mono text-xs font-bold p-2.5 rounded shadow-md">
                          <span className="text-[10px] uppercase font-black block text-yellow-950 mb-0.5">NARRATION CAPTION:</span>
                          {bubble.text}
                        </div>
                      );
                    }
                    if (bubble.bubbleType === 'shout') {
                      return (
                        <div key={bubble.id} className="bg-red-600 text-white font-display text-sm font-black p-3 rounded-xl border-2 border-yellow-300 shadow-xl uppercase tracking-wide">
                          <span className="text-[10px] text-yellow-300 font-mono block mb-0.5">{bubble.speaker} (SHOUTING):</span>
                          "{bubble.text}"
                        </div>
                      );
                    }
                    return (
                      <div key={bubble.id} className="bg-white text-slate-950 font-sans text-xs font-semibold p-3 rounded-2xl border-2 border-slate-900 shadow-lg relative">
                        <span className="text-[10px] font-mono font-bold text-crimson block uppercase mb-0.5">
                          {bubble.speaker}:
                        </span>
                        "{bubble.text}"
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE THUMBNAILS SELECTOR BAR */}
      <div className="space-y-2 pt-2">
        <span className="font-mono text-xs text-gold uppercase block font-semibold">
          ISSUE ISSUE #1 THUMBNAIL PAGES:
        </span>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {manifest.pages.map((p, idx) => {
            const isSel = activePageIndex === idx;
            return (
              <button
                key={p.pageNum}
                onClick={() => setActivePageIndex(idx)}
                className={`p-3 rounded-lg border text-left font-mono text-xs shrink-0 w-36 transition-all ${
                  isSel
                    ? 'bg-slate-elevated border-crimson text-white shadow-lg ring-1 ring-crimson font-bold'
                    : 'bg-charcoal border-slate-border text-surface-muted hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-crimson font-bold">PAGE #{p.pageNum}</span>
                  <span className="text-[10px] text-surface-subtle">{p.panels.length} PNL</span>
                </div>
                <div className="truncate text-white font-sans text-[11px]">{p.pageTitle}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
