'use client';

import React, { useState } from 'react';
import { LocalizedLanguageProfile } from '@/lib/types';
import { CheckCircle2, RefreshCw, Mic, Globe, Compass, BookOpen } from 'lucide-react';

interface LocalizationGridProps {
  notes: LocalizedLanguageProfile[];
  onApprove: () => void;
  onRegenerate: () => void;
}

export const LocalizationGrid: React.FC<LocalizationGridProps> = ({ notes, onApprove, onRegenerate }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeNote = notes[selectedIndex] || notes[0];

  return (
    <div className="bg-slate border border-slate-border rounded-xl p-6 space-y-6 shadow-2xl">
      {/* Surface Header */}
      <div className="flex items-center justify-between border-b border-slate-border pb-4">
        <div>
          <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-1">
            SURFACE 05 // LOCALIZATION AGENT DETAIL VIEW
          </span>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-surface-text">
            Deep Cultural Adaptation & Global Dubbing Suite
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRegenerate}
            className="font-mono text-xs text-surface-muted hover:text-surface-text px-3 py-1.5 rounded bg-charcoal border border-slate-border flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate Cultural Notes
          </button>
          <button
            onClick={onApprove}
            className="font-mono text-xs font-bold text-charcoal bg-gold hover:bg-gold/90 px-4 py-1.5 rounded flex items-center gap-1.5 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" /> Finalize Production
          </button>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {notes.map((n, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={n.language}
              onClick={() => setSelectedIndex(idx)}
              className={`p-3 rounded-lg border text-left font-mono text-xs flex items-center gap-2 transition-all ${
                isSelected
                  ? 'bg-slate-elevated border-crimson text-white shadow-md font-bold'
                  : 'bg-charcoal border-slate-border text-surface-muted hover:text-surface-text'
              }`}
            >
              <span className="text-base">{n.flag}</span>
              <span className="truncate">{n.language}</span>
            </button>
          );
        })}
      </div>

      {/* Active Language Profile */}
      {activeNote && (
        <div className="bg-charcoal border border-slate-border rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-border/50 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeNote.flag}</span>
              <div>
                <h3 className="font-display font-bold text-xl uppercase text-white">
                  {activeNote.language} Cultural Adaptation Profile
                </h3>
                <span className="font-sans text-xs text-gold italic">{activeNote.translatedTitle}</span>
              </div>
            </div>
            <span className="font-mono text-xs text-cyan bg-cyan/10 px-3 py-1 rounded border border-cyan/30 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> DEEP LOCALIZATION READY
            </span>
          </div>

          {/* LOCALIZED CHARACTER NAMES */}
          {activeNote.localizedCharacterNames && activeNote.localizedCharacterNames.length > 0 && (
            <div className="space-y-2">
              <span className="font-mono text-xs text-gold uppercase block font-semibold flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-gold" /> CULTURALLY ADAPTED CHARACTER NAMES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeNote.localizedCharacterNames.map((cn, idx) => (
                  <div key={idx} className="bg-slate p-3 rounded-lg border border-slate-border/50 font-mono text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-surface-muted">{cn.originalName}</span>
                      <span className="text-crimson font-bold">➔ {cn.localizedName}</span>
                    </div>
                    <p className="text-surface-text text-[11px] font-sans italic">{cn.culturalNuance}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADAPTED CULTURAL IDIOMS */}
          {activeNote.adaptedCulturalIdioms && activeNote.adaptedCulturalIdioms.length > 0 && (
            <div className="space-y-2">
              <span className="font-mono text-xs text-cyan uppercase block font-semibold flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan" /> REGIONAL PROVERBS & CULTURAL IDIOM ADAPTATIONS
              </span>
              <div className="space-y-2">
                {activeNote.adaptedCulturalIdioms.map((idm, idx) => (
                  <div key={idx} className="bg-slate p-3 rounded-lg border border-slate-border/50 font-mono text-xs space-y-1">
                    <div className="text-surface-muted">Original: "{idm.originalPhrase}"</div>
                    <div className="text-white font-bold">Adapted: "{idm.localizedIdiom}"</div>
                    <p className="text-cyan text-[11px] font-sans">{idm.culturalContext}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CULTURALLY ADAPTED SCRIPT TEXT */}
          <div className="pt-2">
            <span className="font-mono text-xs text-white block mb-1 uppercase font-bold">
              CULTURALLY ADAPTED SCRIPT SCENE:
            </span>
            <div className="bg-slate p-4 rounded-lg border border-slate-border font-sans text-sm text-white leading-relaxed italic">
              {activeNote.culturallyAdaptedScriptText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
