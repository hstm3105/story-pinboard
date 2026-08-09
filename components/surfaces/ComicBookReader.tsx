'use client';

import React, { useState } from 'react';
import { ProductionManifest } from '@/lib/types';
import { ChevronLeft, ChevronRight, CheckCircle2, ZoomIn, ZoomOut, BookOpen } from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from '../ui';

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
    <Card variant="elevated" depth="high" className="p-6 space-y-6">
      {/* Surface Header */}
      <SectionHeader
        label="SURFACE 06 // GRAPHIC NOVEL PRODUCTION READER"
        title={`${manifest.title} — Issue #${manifest.issueNum} (${manifest.visualStyle})`}
        action={
          <div className="flex items-center gap-3">
            <Badge variant="gold" size="md" icon={<BookOpen className="w-3.5 h-3.5" />}>
              {manifest.totalPages} GRAPHIC PAGES
            </Badge>
            {onApprove && (
              <Button variant="gold" size="sm" icon={<CheckCircle2 className="w-4 h-4" />} onClick={onApprove}>
                Finalize Publication
              </Button>
            )}
          </div>
        }
      />

      {/* PAGE NAVIGATION & ZOOM CONTROLS BAR */}
      <Card variant="flat" depth="low" className="p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        {/* Page Switcher Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrev}
            disabled={activePageIndex === 0}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous Page
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleNext}
            disabled={activePageIndex === manifest.pages.length - 1}
          >
            Next Page <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Page Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-surface-muted">PAGE</span>
          <span className="text-crimson font-bold text-base">{activePageIndex + 1}</span>
          <span className="text-surface-muted">OF {manifest.pages.length}</span>
        </div>

        {/* Canvas Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-cyan font-bold w-12 text-center">{zoomLevel}%</span>
          <Button variant="secondary" size="sm" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleResetZoom}>
            Fit Page
          </Button>
        </div>
      </Card>

      {/* SINGLE CONSOLIDATED GRAPHIC NOVEL PAGE VIEW (NORMAL DOCUMENT FLOW, ZERO OVERLAPS) */}
      {activePage && (
        <Card variant="elevated" depth="high" className="p-6 space-y-4 flex flex-col items-center">
          {/* SMALL CORNER PRINT INDICIA TEXT */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-surface-muted border-b border-slate-border/50 pb-2">
            <span className="text-white font-bold">{manifest.title.toUpperCase()} // ISSUE #{manifest.issueNum}</span>
            <span className="text-gold font-bold">PAGE {activePage.pageNum} OF {manifest.totalPages} ({activePage.pageTitle})</span>
          </div>

          {/* LITERAL COMIC PAGE GRID CANVAS WITH 12PX GUTTERS */}
          <div className="w-full flex justify-center items-center py-2 overflow-auto scrollbar-thin">
            <div
              className="bg-black p-4 rounded-xl border-4 border-slate-950 shadow-2xl transition-all duration-300 max-w-4xl w-full"
              style={{ width: `${zoomLevel}%` }}
            >
              {/* PAGE PANEL GRID TEMPLATE WITH 12PX GUTTERS (`gap-4`) */}
              <div className={`grid gap-4 ${activePage.isKeyframeSplashPage ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                {activePage.panels.map((panel) => (
                  <div
                    key={panel.panelNum}
                    className={`bg-gradient-to-br ${panel.bgGradient} p-5 rounded-xl border-2 border-slate-900 shadow-2xl flex flex-col justify-between space-y-4 relative overflow-hidden`}
                  >
                    {/* PANEL HEADER BAR: Panel Number, Style Tag, Inline SFX Badge (In Normal Flow) */}
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="gold" size="sm">
                          PANEL #{panel.panelNum}
                        </Badge>
                        <Badge variant="cyan" size="sm">
                          {panel.panelStyle || 'STANDARD'}
                        </Badge>
                      </div>

                      {/* INLINE SFX BADGE IN NORMAL FLOW */}
                      {panel.visualSoundFX && (
                        <Badge variant="crimson" size="sm" className="rotate-[-2deg]">
                          ⚡ {panel.visualSoundFX}
                        </Badge>
                      )}
                    </div>

                    {/* SCENE DESCRIPTION (GRAPHIC NOVEL SCRIPT DIRECTION BOX) */}
                    <div className="bg-slate-950/85 backdrop-blur-md p-3.5 rounded-lg border-l-4 border-l-gold border border-white/10 shadow-lg space-y-1">
                      <span className="font-mono text-[9px] uppercase font-black text-cyan tracking-widest block">
                        SCENE DIRECTION:
                      </span>
                      <p className="font-sans text-xs italic text-slate-200 leading-relaxed">
                        "{panel.sceneDescription}"
                      </p>
                    </div>

                    {/* STACKED DIALOGUE BALLOONS & CAPTIONS IN NORMAL DOCUMENT FLOW */}
                    <div className="space-y-3 pt-1">
                      {panel.speechBubbles.map((sb) => {
                        if (sb.bubbleType === 'caption') {
                          return (
                            <div
                              key={sb.id}
                              className="bg-yellow-400 text-slate-950 font-mono text-xs font-bold p-3 rounded-md border-2 border-slate-950 shadow-md"
                            >
                              <span className="text-[9px] uppercase font-black block text-yellow-950 mb-0.5">NARRATION CAPTION:</span>
                              {sb.text}
                            </div>
                          );
                        }
                        return (
                          <div
                            key={sb.id}
                            className="relative bg-white text-slate-950 p-3.5 rounded-2xl border-2 border-slate-950 shadow-xl"
                          >
                            <span className="text-[10px] font-mono font-bold text-crimson block uppercase tracking-wider mb-0.5">
                              {sb.speaker}:
                            </span>
                            <p className="font-sans text-xs font-black uppercase tracking-tight leading-snug">
                              "{sb.text}"
                            </p>
                            {/* SVG Speech Bubble Pointer Tail */}
                            <svg
                              className="absolute -bottom-2.5 left-6 w-4 h-3 text-white"
                              viewBox="0 0 10 10"
                              fill="currentColor"
                            >
                              <path d="M0 0 L10 0 L2 10 Z" stroke="#000" strokeWidth="1" />
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
        </Card>
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
              <Card
                key={p.pageNum}
                variant={isSel ? 'active' : 'flat'}
                interactive
                onClick={() => setActivePageIndex(idx)}
                className="p-3 text-left font-mono text-xs shrink-0 w-44"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-crimson font-bold">PAGE #{p.pageNum}</span>
                  <Badge variant="cyan" size="sm">
                    {p.panels.length} PANELS
                  </Badge>
                </div>
                <div className={`w-full h-20 bg-gradient-to-br ${p.panels[0]?.bgGradient || 'from-slate-900 to-charcoal'} rounded border border-slate-border mb-1.5 flex items-center justify-center text-[10px] text-gold font-bold p-2 text-center`}>
                  GRAPHIC TEXT
                </div>
                <div className="truncate text-white font-sans text-[11px]">{p.pageTitle}</div>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
