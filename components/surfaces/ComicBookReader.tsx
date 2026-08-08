'use client';

import React, { useState } from 'react';
import { ProductionManifest } from '@/lib/types';
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, ZoomIn, ZoomOut, Image as ImageIcon, MapPin } from 'lucide-react';

interface ComicBookReaderProps {
  manifest: ProductionManifest;
  onApprove?: () => void;
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

      {/* FULL-PAGE COMIC CANVAS DISPLAY (MARVEL/DC DESIGN LANGUAGE) */}
      {activePage && (
        <div className="bg-slate-elevated border-2 border-slate-border rounded-xl p-6 space-y-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
          {/* Page Banner Header */}
          <div className="w-full flex items-center justify-between border-b border-slate-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="font-display font-bold text-lg text-white uppercase">
                {activePage.pageTitle}
              </span>
            </div>

            {/* MARVEL/DC STYLE RED LOCATION HEADER BOX */}
            <div className="bg-crimson text-white px-3.5 py-1 rounded font-display font-black text-xs uppercase tracking-widest border border-red-400 shadow-md flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>LOCATION: {manifest.title.toUpperCase()}</span>
            </div>
          </div>

          {/* LITERAL FULL-PAGE COMIC ARTWORK IMAGE */}
          <div className="w-full flex justify-center items-center py-2 overflow-auto scrollbar-thin">
            <div
              className="relative shadow-2xl rounded-lg overflow-hidden border-4 border-slate-900 transition-all duration-300 max-w-4xl"
              style={{ width: `${zoomLevel}%` }}
            >
              {activePage.pageImageUrl ? (
                <img
                  src={activePage.pageImageUrl}
                  alt={activePage.pageTitle}
                  className="w-full h-auto object-contain block shadow-2xl"
                />
              ) : (
                <div className="bg-charcoal p-12 text-center font-mono text-xs text-surface-muted">
                  Full Page Artwork Rendering...
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC AGENT DIALOGUE & PANEL BREAKDOWN (WITH MARVEL/DC SPEECH TAILS) */}
          <div className="w-full space-y-3 pt-4 border-t border-slate-border/60">
            <span className="font-mono text-xs text-gold uppercase block font-semibold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-gold" /> PAGE #{activePage.pageNum} DIALOGUE & LETTERING OVERLAY
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePage.panels.map((panel) => (
                <div key={panel.panelNum} className="bg-charcoal p-4 rounded-xl border border-slate-border/60 space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-slate-border/40 pb-2">
                    <span className="font-mono text-xs text-crimson font-bold">PANEL #{panel.panelNum}</span>
                    {panel.visualSoundFX && (
                      <span className="font-display font-black text-xs text-yellow-300 bg-red-600 px-2.5 py-0.5 rounded uppercase tracking-wider shadow-md">
                        ⚡ {panel.visualSoundFX}
                      </span>
                    )}
                  </div>
                  <p className="text-surface-muted text-[11px] font-sans italic bg-slate/60 p-2.5 rounded border border-slate-border/30">
                    {panel.sceneDescription}
                  </p>

                  {/* ROUND SPEECH BUBBLES WITH SVG TAIL POINTERS */}
                  <div className="space-y-2 pt-1">
                    {panel.speechBubbles.map((sb) => {
                      if (sb.bubbleType === 'caption') {
                        return (
                          <div key={sb.id} className="bg-yellow-400 text-slate-950 font-mono text-xs font-bold p-2.5 rounded border border-yellow-600 shadow-md">
                            <span className="text-[9px] uppercase font-black block text-yellow-950">NARRATION:</span>
                            {sb.text}
                          </div>
                        );
                      }
                      return (
                        <div key={sb.id} className="relative bg-white text-slate-950 font-sans text-xs font-bold p-3 rounded-2xl border-2 border-slate-900 shadow-lg">
                          <span className="text-[10px] font-mono font-bold text-crimson block uppercase mb-0.5">
                            {sb.speaker}:
                          </span>
                          "{sb.text}"
                          {/* SVG Speech Bubble Pointer Tail */}
                          <svg
                            className="absolute -bottom-2.5 left-6 w-4 h-3 text-white"
                            viewBox="0 0 10 10"
                            fill="currentColor"
                          >
                            <path d="M0 0 L10 0 L5 10 Z" />
                          </svg>
                        </div>
                      );
                    })}
                  </div>
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
                {p.pageImageUrl && (
                  <img src={p.pageImageUrl} alt={p.pageTitle} className="w-full h-24 object-cover rounded border border-slate-border mb-1.5" />
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
