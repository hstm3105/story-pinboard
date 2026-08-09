'use client';

import React, { useState } from 'react';
import { LocalizedLanguageProfile } from '@/lib/types';
import { CheckCircle2, RefreshCw, Globe, MessageSquare, Zap } from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from '../ui';

interface LocalizationGridProps {
  notes: LocalizedLanguageProfile[];
  onApprove: () => void;
  onRegenerate: () => void;
}

export const LocalizationGrid: React.FC<LocalizationGridProps> = ({ notes, onApprove, onRegenerate }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeNote = notes[selectedIndex] || notes[0];

  return (
    <Card variant="elevated" depth="high" className="p-6 space-y-6">
      {/* Surface Header */}
      <SectionHeader
        label="SURFACE 05 // LOCALIZATION AGENT DETAIL VIEW"
        title="Comic Speech Bubble & Sound FX Lettering Localization"
        action={
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRegenerate}>
              Regenerate Notes
            </Button>
            <Button variant="gold" size="sm" icon={<CheckCircle2 className="w-4 h-4" />} onClick={onApprove}>
              Finalize Publication
            </Button>
          </div>
        }
      />

      {/* Language Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {notes.map((n, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <Card
              key={n.language}
              variant={isSelected ? 'active' : 'flat'}
              interactive
              onClick={() => setSelectedIndex(idx)}
              className="p-3 font-mono text-xs flex items-center gap-2"
            >
              <span className="text-base">{n.flag}</span>
              <span className="truncate">{n.language}</span>
            </Card>
          );
        })}
      </div>

      {/* Active Language Profile */}
      {activeNote && (
        <Card variant="flat" depth="medium" className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-border/50 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeNote.flag}</span>
              <div>
                <h3 className="font-display font-bold text-xl uppercase text-white">
                  {activeNote.language} Comic Adaptation Profile
                </h3>
                <span className="font-sans text-xs text-gold italic">{activeNote.translatedTitle}</span>
              </div>
            </div>
            <Badge variant="cyan" size="md" icon={<Globe className="w-3.5 h-3.5" />}>
              COMIC LETTERING READY
            </Badge>
          </div>

          {/* LOCALIZED SPEECH BUBBLES */}
          {activeNote.localizedSpeechBubbles && activeNote.localizedSpeechBubbles.length > 0 && (
            <div className="space-y-2">
              <span className="font-mono text-xs text-gold uppercase block font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-gold" /> LOCALIZED SPEECH BUBBLES
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeNote.localizedSpeechBubbles.map((sb, idx) => (
                  <Card key={idx} variant="elevated" depth="low" className="p-3.5 font-mono text-xs space-y-1">
                    <div className="flex items-center justify-between text-crimson font-bold">
                      <span>{sb.speaker}</span>
                      <Badge variant="neutral" size="sm">
                        BUBBLE
                      </Badge>
                    </div>
                    <div className="text-surface-muted text-[11px]">Original: "{sb.originalText}"</div>
                    <div className="text-white font-bold font-sans">"{sb.localizedText}"</div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* LOCALIZED SOUND FX LETTERING */}
          {activeNote.localizedSoundFXLettering && (
            <div className="space-y-2">
              <span className="font-mono text-xs text-cyan uppercase block font-semibold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan" /> VISUAL SOUND EFFECT LETTERING ANNOTATIONS
              </span>
              <div className="flex flex-wrap gap-3">
                {Object.entries(activeNote.localizedSoundFXLettering).map(([orig, loc]) => (
                  <Card key={orig} variant="flat" depth="low" className="px-3.5 py-2 font-mono text-xs flex items-center gap-2">
                    <span className="text-surface-muted line-through">{orig}</span>
                    <span className="text-gold font-black uppercase text-sm font-display">➔ {loc}</span>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </Card>
  );
};
