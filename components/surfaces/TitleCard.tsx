'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StoryBible } from '@/lib/types';
import { Palette, UserCheck } from 'lucide-react';
import { Card, Badge, SectionHeader } from '../ui';

interface TitleCardProps {
  concept: StoryBible;
}

export const TitleCard: React.FC<TitleCardProps> = ({ concept }) => {
  return (
    <Card
      variant="elevated"
      depth="high"
      className="border-l-4 border-l-crimson p-8 space-y-4"
    >
      {/* Top Header Metadata */}
      <SectionHeader
        label={`DIRECTOR COMIC REVEAL // ${concept.visualAestheticStyle || 'Dark Noir Cyberpunk'}`}
        title=""
        action={
          <Badge variant="gold" size="md">
            GRAPHIC BIBLE APPROVED
          </Badge>
        }
      />

      {/* Hero Series Title */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-white leading-none pt-2"
      >
        {concept.title}
      </motion.h1>

      {/* Series Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="font-sans text-lg font-semibold text-crimson italic"
      >
        "{concept.tagline}"
      </motion.p>

      {/* Expanded Premise & Emotional Arc */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-y-3"
      >
        <p className="font-sans text-sm text-surface-text leading-relaxed max-w-4xl">
          {concept.expandedPremise}
        </p>

        {/* PROTAGONIST EMOTIONAL ARC FIELDS */}
        <div className="flex flex-wrap gap-3 text-xs font-mono pt-2">
          <Badge variant="crimson" size="md">
            STARTING: {concept.protagonistStartingEmotionalState}
          </Badge>
          <Badge variant="gold" size="md">
            ENDING: {concept.protagonistEndingEmotionalState}
          </Badge>
        </div>
      </motion.div>

      {/* CHARACTER VISUAL KEYFRAMES */}
      {concept.characterVisualKeyframes && concept.characterVisualKeyframes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="space-y-3 pt-4 border-t border-slate-border"
        >
          <span className="font-mono text-xs text-gold uppercase flex items-center gap-1.5 font-bold">
            <UserCheck className="w-4 h-4 text-gold" /> CHARACTER VISUAL KEYFRAME DESIGN BIBLE
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-surface-muted">
            {concept.characterVisualKeyframes.map((char) => (
              <Card key={char.characterName} variant="flat" depth="low" className="p-3.5 space-y-1">
                <div className="flex items-center justify-between text-crimson font-bold">
                  <span>{char.characterName}</span>
                  <Badge variant="cyan" size="sm">
                    {char.colorTheme}
                  </Badge>
                </div>
                <p className="text-white text-[11px] font-sans pt-1">{char.visualAppearance}</p>
                <div className="text-[10px] text-gold italic pt-0.5">
                  <strong>Signature Costume:</strong> {char.signatureCostume}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </Card>
  );
};
