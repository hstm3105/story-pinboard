'use client';

import React, { useState } from 'react';
import { Sparkles, Heart, ShieldAlert, Cpu, Crown, Search, Flame, Ghost, Landmark } from 'lucide-react';

interface DirectorDeckProps {
  onSelectCategory?: (category: string, samplePremise: string) => void;
  selectedCategory?: string;
}

export interface GenreCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  samplePremise: string;
  accentColor: string;
}

export const GENRE_CATEGORIES: GenreCategory[] = [
  {
    id: 'romance',
    name: 'Romance',
    icon: Heart,
    samplePremise: 'A ruthless CEO enters a 1-year contract marriage to secure his inheritance, unaware his fake bride holds the core patent that can ruin or save his empire.',
    accentColor: 'border-crimson text-crimson',
  },
  {
    id: 'thriller',
    name: 'Psychological Thriller',
    icon: ShieldAlert,
    samplePremise: 'A late-night radio host receives a call from a man confessing to a 20-year-old cold case, only to realize the caller is recounting events that only the host could know.',
    accentColor: 'border-gold text-gold',
  },
  {
    id: 'scifi',
    name: 'Sci-Fi',
    icon: Cpu,
    samplePremise: 'In the flooded lower sectors of New Babel, a rogue technician extracts an illegal memory drive, discovering proof that the city ruler was once a human resident of the slums.',
    accentColor: 'border-cyan text-cyan',
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    icon: Crown,
    samplePremise: 'An outcast academy student unlocks an ancient void rune, discovering her dormant lineage connects directly to the lost sovereign throne.',
    accentColor: 'border-gold text-gold',
  },
  {
    id: 'mystery',
    name: 'Mystery & Crime',
    icon: Search,
    samplePremise: 'A forensic archivist decodes a renaissance cipher hidden inside a crime scene manuscript, exposing a secret royal heir living as a clockmaker.',
    accentColor: 'border-cyan text-cyan',
  },
  {
    id: 'action',
    name: 'Action & Adventure',
    icon: Flame,
    samplePremise: 'A veteran mercenary squad is hired to extract a high-value whistleblower from a fortress, only to discover the whistleblower is an autonomous AI core.',
    accentColor: 'border-crimson text-crimson',
  },
  {
    id: 'horror',
    name: 'Horror',
    icon: Ghost,
    samplePremise: 'An isolated audio engineer captures phantom frequencies on vintage magnetic tape, realizing the voices are sending warnings from 24 hours in the future.',
    accentColor: 'border-cyan text-cyan',
  },
  {
    id: 'historical',
    name: 'Historical Drama',
    icon: Landmark,
    samplePremise: 'During the 1940s blitz, a female cipher breaker discovers encoded messages being transmitted from inside her own war ministry.',
    accentColor: 'border-gold text-gold',
  },
];

export const DirectorDeck: React.FC<DirectorDeckProps> = ({
  onSelectCategory,
  selectedCategory = 'Sci-Fi',
}) => {
  return (
    <div className="bg-slate border border-slate-border rounded-xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-border pb-3">
        <div>
          <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-0.5">
            GENRE SELECTION GRID
          </span>
          <h3 className="font-display font-bold text-lg uppercase text-white">
            Core Production Categories
          </h3>
        </div>
        <span className="font-mono text-xs bg-gold/15 text-gold border border-gold/30 px-2.5 py-1 rounded font-bold">
          8 GENRES ACTIVE
        </span>
      </div>

      {/* Grid of 8 Generic Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {GENRE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.name, cat.samplePremise)}
              className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                isSelected
                  ? 'bg-slate-elevated border-crimson text-white shadow-lg ring-1 ring-crimson font-bold'
                  : 'bg-charcoal border-slate-border text-surface-muted hover:text-white hover:border-slate-border/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-crimson' : 'text-gold'}`} />
              <span className="font-display text-xs uppercase tracking-wide truncate">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
