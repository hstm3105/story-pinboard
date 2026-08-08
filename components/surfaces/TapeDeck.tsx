'use client';

import React, { useState } from 'react';
import { LockedEpisode } from '@/lib/types';
import { Disc, Play, Coins, Lock, Sparkles } from 'lucide-react';

interface TapeDeckProps {
  episodes: LockedEpisode[];
}

export const TapeDeck: React.FC<TapeDeckProps> = ({ episodes }) => {
  const [activeEpIndex, setActiveEpIndex] = useState(0);
  const activeEpisode = episodes[activeEpIndex] || episodes[0];

  return (
    <section className="w-full bg-slate border border-slate-border rounded-xl p-6 space-y-6 shadow-2xl">
      {/* Surface Header */}
      <div className="flex items-center justify-between border-b border-slate-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-charcoal border border-slate-border flex items-center justify-center text-crimson shadow-md">
            <Disc className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <span className="font-mono text-xs text-cyan uppercase tracking-widest block">
              SURFACE 06 // FINISHED SERIES BROWSER
            </span>
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-surface-text">
              Reel-to-Reel Tape Deck
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-gold bg-gold/10 px-3 py-1.5 rounded-md border border-gold/30">
          <Sparkles className="w-4 h-4 text-gold" /> {episodes.length} LOCKED EPISODES
        </div>
      </div>

      {/* Horizontal Scrollable Episode Row */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {episodes.map((ep, idx) => {
          const isSelected = activeEpIndex === idx;
          return (
            <button
              key={ep.id}
              onClick={() => setActiveEpIndex(idx)}
              className={`min-w-[240px] max-w-[240px] bg-charcoal border rounded-xl p-5 text-left transition-all duration-200 group relative ${
                isSelected
                  ? 'border-crimson shadow-[0_0_20px_rgba(196,48,43,0.3)] bg-slate-elevated'
                  : 'border-slate-border hover:border-surface-muted'
              }`}
            >
              {/* Subtle Spool Ring Motif */}
              <div className="absolute top-3 right-3 text-slate-border group-hover:text-crimson/40 transition-colors">
                <Disc className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-crimson uppercase">
                  EPISODE 0{ep.episodeNum}
                </span>
                {ep.isCoinWall && (
                  <span className="bg-crimson text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5" title="Monetization Hook">
                    <Coins className="w-3 h-3" /> COIN WALL
                  </span>
                )}
              </div>

              <h3 className="font-display font-bold text-lg uppercase tracking-wide text-white line-clamp-1 mb-1">
                {ep.title}
              </h3>

              <p className="font-sans text-xs text-surface-muted line-clamp-2 mb-4">
                {ep.previewText}
              </p>

              <div className="flex items-center justify-between font-mono text-[11px] text-cyan pt-2 border-t border-slate-border/50">
                <span>{ep.duration}</span>
                <span className="flex items-center gap-1 text-gold">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Episode Preview Scrubbing Panel */}
      {activeEpisode && (
        <div className="bg-charcoal border border-slate-border rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-crimson font-bold">
                NOW SCRUBBING // EPISODE 0{activeEpisode.episodeNum}
              </span>
              {activeEpisode.isCoinWall && (
                <span className="bg-crimson text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                  MONETIZATION COIN WALL HOOK
                </span>
              )}
            </div>
            <h3 className="font-display font-bold text-2xl uppercase text-white">
              {activeEpisode.title}
            </h3>
            <p className="font-sans text-xs text-surface-muted max-w-2xl">
              {activeEpisode.previewText}
            </p>
          </div>

          <button className="bg-crimson hover:bg-crimson-dark text-white font-display font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Play className="w-4 h-4 fill-current" /> Play Full Episode Audio
          </button>
        </div>
      )}
    </section>
  );
};
