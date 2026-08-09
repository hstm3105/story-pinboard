'use client';

import React, { useState } from 'react';
import { LockedEpisode } from '@/lib/types';
import { Disc, Play, Coins, Lock, Sparkles } from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from '../ui';

interface TapeDeckProps {
  episodes: LockedEpisode[];
}

export const TapeDeck: React.FC<TapeDeckProps> = ({ episodes }) => {
  const [activeEpIndex, setActiveEpIndex] = useState(0);
  const activeEpisode = episodes[activeEpIndex] || episodes[0];

  return (
    <Card variant="elevated" depth="high" className="p-6 space-y-6">
      {/* Surface Header */}
      <SectionHeader
        label="SURFACE 06 // FINISHED SERIES BROWSER"
        title="Reel-to-Reel Tape Deck"
        action={
          <Badge variant="gold" size="md" icon={<Sparkles className="w-4 h-4 text-gold" />}>
            {episodes.length} LOCKED EPISODES
          </Badge>
        }
      />

      {/* Horizontal Scrollable Episode Row */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {episodes.map((ep, idx) => {
          const isSelected = activeEpIndex === idx;
          return (
            <Card
              key={ep.id}
              variant={isSelected ? 'active' : 'flat'}
              interactive
              onClick={() => setActiveEpIndex(idx)}
              className="min-w-[240px] max-w-[240px] p-5 text-left group relative"
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
                  <Badge variant="crimson" size="sm" icon={<Coins className="w-3 h-3" />}>
                    COIN WALL
                  </Badge>
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
            </Card>
          );
        })}
      </div>

      {/* Active Episode Preview Scrubbing Panel */}
      {activeEpisode && (
        <Card variant="flat" depth="medium" className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-crimson font-bold">
                NOW SCRUBBING // EPISODE 0{activeEpisode.episodeNum}
              </span>
              {activeEpisode.isCoinWall && (
                <Badge variant="crimson" size="sm">
                  MONETIZATION COIN WALL HOOK
                </Badge>
              )}
            </div>
            <h3 className="font-display font-bold text-2xl uppercase text-white">
              {activeEpisode.title}
            </h3>
            <p className="font-sans text-xs text-surface-muted max-w-2xl">
              {activeEpisode.previewText}
            </p>
          </div>

          <Button variant="gold" size="lg" icon={<Play className="w-4 h-4 fill-current" />}>
            Play Episode Master
          </Button>
        </Card>
      )}
    </Card>
  );
};
