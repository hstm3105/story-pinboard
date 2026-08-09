'use client';

import React, { useState } from 'react';
import { EpisodeScript } from '@/lib/types';
import { BookOpen, RefreshCw, CheckCircle2, Layers, MessageSquare } from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from '../ui';

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
    <Card variant="elevated" depth="high" className="p-6 space-y-6">
      {/* Header */}
      <SectionHeader
        label="SURFACE 03 // SCREENWRITER COMIC SCRIPT VIEW"
        title="Page & Panel Breakdowns, Speech Bubbles & Visual SFX"
        action={
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRegenerate}>
              Regenerate Script
            </Button>
            <Button variant="gold" size="sm" icon={<CheckCircle2 className="w-4 h-4" />} onClick={onApprove}>
              Approve Comic Script
            </Button>
          </div>
        }
      />

      {/* PAGE TAB SWITCHER */}
      {pages.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-border/50">
          <span className="font-mono text-xs text-gold flex items-center gap-1 shrink-0 font-bold mr-2">
            <Layers className="w-4 h-4 text-gold" /> COMIC PAGES:
          </span>
          {pages.map((p, idx) => {
            const isSelected = activePageIdx === idx;
            return (
              <Button
                key={p.pageNum}
                variant={isSelected ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActivePageIdx(idx)}
                className="shrink-0"
              >
                <span>PAGE {p.pageNum}</span>
                {p.isKeyframeSplashPage && (
                  <Badge variant="gold" size="sm" className="ml-1">
                    SPLASH
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      )}

      {/* ACTIVE PAGE PANEL SCRIPT SHOWCASE */}
      {activePage && (
        <Card variant="flat" depth="medium" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-border/50 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan" />
              <span className="font-mono text-xs text-cyan uppercase font-bold">
                PAGE #{activePage.pageNum} // {activePage.pageTitle}
              </span>
            </div>
            {activePage.isKeyframeSplashPage && (
              <Badge variant="gold" size="md">
                FULL SPLASH PAGE BREAKDOWN
              </Badge>
            )}
          </div>

          {/* Panel Breakdown Cards */}
          <div className="space-y-4">
            {activePage.panels.map((panel) => (
              <Card key={panel.panelNum} variant="elevated" depth="low" className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-border/50 pb-2">
                  <Badge variant="gold" size="sm">
                    PANEL #{panel.panelNum} ({panel.panelStyle})
                  </Badge>
                  {panel.visualSoundFX && (
                    <Badge variant="crimson" size="sm">
                      ⚡ SFX: {panel.visualSoundFX}
                    </Badge>
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
              </Card>
            ))}
          </div>
        </Card>
      )}
    </Card>
  );
};
