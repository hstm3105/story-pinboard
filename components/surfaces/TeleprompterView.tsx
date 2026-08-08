'use client';

import React, { useState } from 'react';
import { EpisodeScript, MultiEpisodeSnippet } from '@/lib/types';
import { Radio, Coins, RefreshCw, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

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
  const snippets = script.multiEpisodeSnippets && script.multiEpisodeSnippets.length > 0
    ? script.multiEpisodeSnippets
    : [
        {
          episodeNum: script.episodeNum,
          snippetTitle: script.title,
          sceneDescription: 'Full Episode 1 script draft.',
          isCoinWall: false,
          lines: script.lines,
        },
      ];

  const [activeSnippetIdx, setActiveSnippetIdx] = useState(0);
  const activeSnippet = snippets[activeSnippetIdx] || snippets[0];

  return (
    <div className="bg-slate border border-slate-border rounded-xl p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-border pb-4">
        <div>
          <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-1">
            SURFACE 03 // SCREENWRITER TELEPROMPTER VIEW
          </span>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-surface-text">
            Multi-Episode Script Snippets & Season Outline Showcase
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRegenerate}
            className="font-mono text-xs text-surface-muted hover:text-surface-text px-3 py-1.5 rounded bg-charcoal border border-slate-border flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate Scripts
          </button>
          <button
            onClick={onApprove}
            className="font-mono text-xs font-bold text-charcoal bg-gold hover:bg-gold/90 px-4 py-1.5 rounded flex items-center gap-1.5 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" /> Approve Scripts
          </button>
        </div>
      </div>

      {/* MULTI-EPISODE SNIPPET TAB SWITCHER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-border/50">
        <span className="font-mono text-xs text-gold flex items-center gap-1 shrink-0 font-bold mr-2">
          <Layers className="w-4 h-4 text-gold" /> SAMPLE SCENES:
        </span>
        {snippets.map((snip, idx) => {
          const isSelected = activeSnippetIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveSnippetIdx(idx)}
              className={`px-3.5 py-1.5 rounded font-mono text-xs flex items-center gap-2 shrink-0 border transition-all ${
                isSelected
                  ? 'bg-crimson text-white border-crimson shadow-md font-bold'
                  : 'bg-charcoal text-surface-muted border-slate-border hover:text-white'
              }`}
            >
              <span>EP {snip.episodeNum}</span>
              {snip.isCoinWall && (
                <span className="bg-gold text-charcoal text-[9px] px-1.5 rounded font-black">COIN WALL</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Teleprompter Script Card */}
      {activeSnippet && (
        <div className="bg-charcoal border border-slate-border rounded-xl p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-border/50 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan animate-pulse" />
                <span className="font-mono text-xs text-cyan uppercase font-bold">
                  TELEPROMPTER FEED // {activeSnippet.snippetTitle}
                </span>
              </div>
              <p className="font-sans text-xs text-surface-muted pt-1">{activeSnippet.sceneDescription}</p>
            </div>
            {activeSnippet.isCoinWall && (
              <span className="bg-crimson/15 text-crimson border border-crimson/40 px-3 py-1 rounded font-mono text-xs font-bold flex items-center gap-1">
                <Coins className="w-4 h-4 text-crimson" /> COIN-WALL HOOK
              </span>
            )}
          </div>

          {/* Script Lines Showcase */}
          <div className="space-y-3 font-mono text-sm max-h-96 overflow-y-auto pr-2 scrollbar-thin">
            {activeSnippet.lines.map((line) => {
              if (line.type === 'sfx') {
                return (
                  <div key={line.id} className="text-cyan text-xs italic bg-cyan/10 p-2.5 rounded border border-cyan/20">
                    {line.text}
                  </div>
                );
              }
              if (line.type === 'narrator') {
                return (
                  <div key={line.id} className="text-gold bg-gold/10 p-3 rounded border border-gold/20 leading-relaxed">
                    {line.text}
                  </div>
                );
              }
              return (
                <div key={line.id} className="bg-slate p-3 rounded border border-slate-border space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-crimson font-bold uppercase">{line.character}</span>
                    {line.deliveryDirection && (
                      <span className="text-surface-muted italic text-[11px]">{line.deliveryDirection}</span>
                    )}
                  </div>
                  <p className="text-white font-sans text-sm">{line.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
