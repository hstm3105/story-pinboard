'use client';

import React, { useState } from 'react';
import { ProductionManifest, RenderedComicPanel } from '@/lib/types';
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, ZoomIn, ZoomOut, Image as ImageIcon } from 'lucide-react';

interface ComicBookReaderProps {
  manifest: ProductionManifest;
  onApprove?: () => void;
}

function getBubblePositionClasses(position?: string): string {
  switch (position) {
    case 'top-left':
      return 'top-3 left-3';
    case 'top-right':
      return 'top-3 right-3';
    case 'bottom-left':
      return 'bottom-3 left-3';
    case 'bottom-right':
      return 'bottom-3 right-3';
    case 'center':
      return 'top-1/3 left-1/2 -translate-x-1/2';
    default:
      return 'top-4 right-4';
  }
}

export const ComicBookReader: React.FC<ComicBookReaderProps> = ({ manifest, onApprove }) => {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const activePage = manifest.pages[activePageIndex] || manifest.pages[0];

  const handlePrev = () => {
    if (activePageIndex > 0) setActivePageIndex(activePageIndex - 1);
  };

  const handleNext = () => {
    if (activePageIndex < manifest.pages.length - 1) setActivePageIndex(activePageIndex + 1);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 75));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  return (
    <div className="bg-slate border border-slate-border rounded-xl p-6 space-y-6 shadow-2xl">
      {/* Surface Header */}
      <div className="flex items-center justify-between border-b border-slate-border pb-4">
        <div>
          <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-1">
            SURFACE 06 // GRAPHIC NOVEL PRODUCTION READER
          </span>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-surface-text">
            {manifest.title} — Issue #{manifest.issueNum} ({manifest.visualStyle})
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs bg-gold/15 text-gold border border-gold/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" /> {manifest.totalPages} GRAPHIC PAGES READY
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

      {/* PAGE NAVIGATION & ZOOM CONTROLS BAR */}
      <div className="bg-charcoal border border-slate-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        {/* Page Switcher Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={activePageIndex === 0}
            className="flex items-center gap-1.5 bg-slate hover:bg-slate-elevated px-3.5 py-1.5 rounded border border-slate-border disabled:opacity-30 text-white font-bold transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Page
          </button>
          <button
            onClick={handleNext}
            disabled={activePageIndex === manifest.pages.length - 1}
            className="flex items-center gap-1.5 bg-crimson hover:bg-crimson-dark px-3.5 py-1.5 rounded text-white font-bold transition-all disabled:opacity-30 shadow-md"
          >
            Next Page <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Page Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-surface-muted">PAGE</span>
          <span className="text-crimson font-bold text-base">{activePageIndex + 1}</span>
          <span className="text-surface-muted">OF {manifest.pages.length}</span>
        </div>

        {/* Canvas Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 bg-slate hover:bg-slate-elevated rounded border border-slate-border text-surface-muted hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-cyan font-bold w-12 text-center">{zoomLevel}%</span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 bg-slate hover:bg-slate-elevated rounded border border-slate-border text-surface-muted hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2.5 py-1 bg-slate hover:bg-slate-elevated rounded border border-slate-border text-surface-muted hover:text-white text-[11px]"
          >
            Fit Page
          </button>
        </div>
      </div>

      {/* FULL-PAGE COMIC CANVAS WITH PER-PANEL GRID & 12PX BLACK GUTTERS */}
      {activePage && (
        <div className="bg-slate-elevated border-2 border-slate-border rounded-xl p-6 space-y-4 shadow-2xl relative overflow-hidden flex flex-col items-center">
          {/* SMALL CORNER PRINT INDICIA TEXT (UNOBTRUSIVE PRINT BRANDING) */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-surface-muted border-b border-slate-border/50 pb-2">
            <span>{manifest.title.toUpperCase()} // ISSUE #{manifest.issueNum}</span>
            <span className="text-gold font-bold">PAGE {activePage.pageNum} OF {manifest.totalPages}</span>
          </div>

          {/* LITERAL COMIC PAGE GRID CANVAS WITH 12PX GUTTERS */}
          <div className="w-full flex justify-center items-center py-2 overflow-auto scrollbar-thin">
            <div
              className="bg-black p-3 rounded-lg border-4 border-slate-950 shadow-2xl transition-all duration-300 max-w-4xl w-full"
              style={{ width: `${zoomLevel}%` }}
            >
              {/* PAGE PANEL GRID TEMPLATE WITH 12PX GUTTERS (`gap-3`) */}
              <div className={`grid gap-3 ${activePage.isKeyframeSplashPage ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                {activePage.panels.map((panel) => (
                  <div
                    key={panel.panelNum}
                    className="relative aspect-[4/3] rounded overflow-hidden border-2 border-slate-900 shadow-xl bg-charcoal group"
                  >
                    {/* Individual Panel Artwork Background */}
                    {panel.imageUrl ? (
                      <img
                        src={panel.imageUrl}
                        alt={`Page ${panel.pageNum} Panel ${panel.panelNum}`}
                        className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${panel.bgGradient} flex items-center justify-center font-mono text-xs text-surface-muted`}>
                        Panel #{panel.panelNum}
                      </div>
                    )}

                    {/* OVERLAY: INTEGRATED NARRATION CAPTION (TOP CORNER) */}
                    <div className="absolute top-2 left-2 bg-yellow-400 text-slate-950 font-mono text-[10px] font-bold p-1.5 max-w-[180px] shadow-lg rounded-none border border-slate-900 pointer-events-auto">
                      <span className="text-[8px] uppercase font-black block text-yellow-950">PANEL #{panel.panelNum}:</span>
                      {panel.sceneDescription}
                    </div>

                    {/* OVERLAY: STYLIZED VECTOR SOUND EFFECT */}
                    {panel.visualSoundFX && (
                      <div className="absolute bottom-3 right-3 pointer-events-none">
                        <div className="font-display font-black text-xl text-yellow-300 bg-red-600 px-2.5 py-0.5 rounded border-2 border-slate-950 shadow-[0_0_12px_rgba(239,68,68,0.8)] rotate-[-6deg] uppercase tracking-widest italic">
                          ⚡ {panel.visualSoundFX}
                        </div>
                      </div>
                    )}

                    {/* OVERLAY: SPEECH BUBBLES POSITIONED RELATIVE TO SpeechBubble.position */}
                    {panel.speechBubbles.map((sb) => {
                      if (sb.bubbleType === 'caption') return null;
                      const posClass = getBubblePositionClasses(sb.position);
                      return (
                        <div
                          key={sb.id}
                          className={`absolute ${posClass} bg-white text-slate-950 p-2.5 rounded-[1.5rem] border-2 border-slate-950 shadow-2xl max-w-[200px] pointer-events-auto z-10`}
                        >
                          <span className="text-[9px] font-mono font-bold text-crimson block uppercase mb-0.5">
                            {sb.speaker}:
                          </span>
                          <p className="font-sans text-[11px] font-black uppercase tracking-tight leading-tight">
                            "{sb.text}"
                          </p>
                          {/* SVG Speech Bubble Pointer Tail */}
                          <svg
                            className="absolute -bottom-2.5 left-4 w-4 h-3 text-white"
                            viewBox="0 0 10 10"
                            fill="currentColor"
                          >
                            <path d="M0 0 L10 0 L2 10 Z" stroke="#000" strokeWidth="1" />
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SCRIPT PANEL BREAKDOWN SUMMARY */}
          <div className="w-full space-y-3 pt-4 border-t border-slate-border/60 font-mono text-xs">
            <span className="text-gold uppercase block font-semibold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-gold" /> PAGE #{activePage.pageNum} SCRIPT DATA
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activePage.panels.map((panel) => (
                <div key={panel.panelNum} className="bg-charcoal p-3.5 rounded-lg border border-slate-border/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-crimson font-bold">PANEL #{panel.panelNum}</span>
                    {panel.visualSoundFX && (
                      <span className="text-yellow-300 font-bold bg-red-600 px-2 py-0.5 rounded text-[10px]">
                        ⚡ {panel.visualSoundFX}
                      </span>
                    )}
                  </div>
                  <p className="text-surface-muted text-[11px] font-sans italic">{panel.sceneDescription}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULL COMIC PAGE THUMBNAILS SELECTOR BAR */}
      <div className="space-y-2 pt-2">
        <span className="font-mono text-xs text-gold uppercase block font-semibold">
          ISSUE THUMBNAIL PAGES:
        </span>
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {manifest.pages.map((p, idx) => {
            const isSel = activePageIndex === idx;
            return (
              <button
                key={p.pageNum}
                onClick={() => setActivePageIndex(idx)}
                className={`p-3 rounded-lg border text-left font-mono text-xs shrink-0 w-44 transition-all ${
                  isSel
                    ? 'bg-slate-elevated border-crimson text-white shadow-lg ring-1 ring-crimson font-bold'
                    : 'bg-charcoal border-slate-border text-surface-muted hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-crimson font-bold">PAGE #{p.pageNum}</span>
                  <span className="text-[10px] text-cyan font-bold">{p.panels.length} PANELS</span>
                </div>
                {p.panels[0]?.imageUrl && (
                  <img src={p.panels[0].imageUrl} alt={p.pageTitle} className="w-full h-24 object-cover rounded border border-slate-border mb-1.5" />
                )}
                <div className="truncate text-white font-sans text-[11px]">{p.pageTitle}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
