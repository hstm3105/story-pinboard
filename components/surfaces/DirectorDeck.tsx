'use client';

import React from 'react';
import { Heart, ShieldAlert, Cpu, Crown, Search, Flame, Ghost, Landmark } from 'lucide-react';
import { Card, Badge, SectionHeader } from '../ui';

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
    <Card variant="elevated" depth="high" className="p-5 space-y-4">
      {/* Standardized Section Header with Badge */}
      <SectionHeader
        label="GENRE SELECTION GRID"
        title="Core Production Categories"
        action={
          <Badge variant="gold" size="sm">
            8 GENRES ACTIVE
          </Badge>
        }
      />

      {/* Grid of 8 Generic Categories using Card primitives */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {GENRE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <Card
              key={cat.id}
              variant={isSelected ? 'active' : 'flat'}
              interactive
              onClick={() => onSelectCategory && onSelectCategory(cat.name, cat.samplePremise)}
              className="p-3 flex items-center gap-2.5 transition-all"
            >
              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-crimson' : 'text-gold'}`} />
              <span className="font-display text-xs uppercase tracking-wide truncate">{cat.name}</span>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};
