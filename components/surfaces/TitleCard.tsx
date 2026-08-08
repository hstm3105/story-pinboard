'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StoryBible } from '@/lib/types';
import { Palette, Sparkles, UserCheck } from 'lucide-react';

interface TitleCardProps {
  concept: StoryBible;
}

export const TitleCard: React.FC<TitleCardProps> = ({ concept }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden bg-gradient-to-r from-slate-elevated via-slate to-charcoal border-l-4 border-l-crimson border border-slate-border rounded-xl p-8 shadow-2xl space-y-4"
    >
      {/* Top Header Metadata */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-crimson" />
          <span className="font-mono text-xs text-cyan uppercase tracking-widest font-bold">
            DIRECTOR COMIC REVEAL // {concept.visualAestheticStyle || 'Dark Noir Cyberpunk'}
          </span>
        </div>
        <span className="font-mono text-xs bg-gold/15 text-gold border border-gold/30 px-3 py-1 rounded-full font-bold">
          GRAPHIC BIBLE APPROVED
        </span>
      </div>

      {/* Hero Series Title */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-white leading-none"
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
        <div className="flex flex-wrap gap-4 text-xs font-mono pt-2">
          <span className="bg-charcoal px-3 py-1.5 rounded border border-slate-border text-surface-muted">
            <strong className="text-crimson font-bold">STARTING EMOTIONAL STATE:</strong> {concept.protagonistStartingEmotionalState}
          </span>
          <span className="bg-charcoal px-3 py-1.5 rounded border border-slate-border text-surface-muted">
            <strong className="text-gold font-bold">ENDING EMOTIONAL STATE:</strong> {concept.protagonistEndingEmotionalState}
          </span>
        </div>
      </motion.div>

      {/* CHARACTER VISUAL KEYFRAMES */}
      {concept.characterVisualKeyframes && concept.characterVisualKeyframes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="space-y-2 pt-3 border-t border-slate-border"
        >
          <span className="font-mono text-xs text-gold uppercase flex items-center gap-1.5 font-bold">
            <UserCheck className="w-4 h-4 text-gold" /> CHARACTER VISUAL KEYFRAME DESIGN BIBLE
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-surface-muted">
            {concept.characterVisualKeyframes.map((char) => (
              <div key={char.characterName} className="bg-charcoal/80 p-3.5 rounded-lg border border-slate-border/60 space-y-1">
                <div className="flex items-center justify-between text-crimson font-bold">
                  <span>{char.characterName}</span>
                  <span className="text-cyan text-[10px]">{char.colorTheme}</span>
                </div>
                <p className="text-white text-[11px] font-sans">{char.visualAppearance}</p>
                <div className="text-[10px] text-gold italic pt-0.5">
                  <strong>Signature Costume:</strong> {char.signatureCostume}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
