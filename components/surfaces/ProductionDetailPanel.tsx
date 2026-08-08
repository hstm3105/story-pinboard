'use client';

import React, { useState } from 'react';
import { ProductionManifest, ScriptLine } from '@/lib/types';
import { WebSpeechSynthesizer } from '@/lib/webSpeechEngine';
import { Volume2, Mic, Play, Pause, CheckCircle2, Music, AlertCircle, Sparkles, Radio } from 'lucide-react';

interface ProductionDetailPanelProps {
  manifest: ProductionManifest;
  scriptLines?: ScriptLine[];
  onApprove: () => void;
}

export const ProductionDetailPanel: React.FC<ProductionDetailPanelProps> = ({
  manifest,
  scriptLines = [],
  onApprove,
}) => {
  const [isLiveSpeaking, setIsLiveSpeaking] = useState(false);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [speechEngine] = useState(() => new WebSpeechSynthesizer());

  const handleToggleLiveSpeech = () => {
    if (isLiveSpeaking) {
      speechEngine.stop();
      setIsLiveSpeaking(false);
      setActiveLineId(null);
    } else {
      setIsLiveSpeaking(true);
      speechEngine.speakScript(
        scriptLines,
        (lineId) => setActiveLineId(lineId),
        () => {
          setIsLiveSpeaking(false);
          setActiveLineId(null);
        }
      );
    }
  };

  return (
    <div className="bg-slate border border-slate-border rounded-xl p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-border pb-4">
        <div>
          <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-1">
            SURFACE 06 // PRODUCTION / VOICE AGENT DETAIL VIEW
          </span>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-surface-text">
            Episode 1 Audio Synthesis & Voice Master Deck
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {scriptLines.length > 0 && (
            <button
              onClick={handleToggleLiveSpeech}
              className={`font-mono text-xs font-bold px-3.5 py-1.5 rounded border flex items-center gap-1.5 shadow-md transition-all ${
                isLiveSpeaking
                  ? 'bg-crimson text-white border-crimson shadow-[0_0_12px_rgba(211,47,47,0.5)]'
                  : 'bg-slate-elevated text-gold border-gold/40 hover:border-gold'
              }`}
            >
              {isLiveSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-gold" />}
              {isLiveSpeaking ? 'Stop Live Acting' : '⚡ Perform Live Voice Script'}
            </button>
          )}
          <button
            onClick={onApprove}
            className="font-mono text-xs font-bold text-charcoal bg-gold hover:bg-gold/90 px-4 py-1.5 rounded flex items-center gap-1.5 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" /> Send to Reel Deck
          </button>
        </div>
      </div>

      {/* Main Playable Master Audio Card */}
      <div className="bg-charcoal border border-slate-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 font-mono text-xs text-crimson font-bold">
            <Radio className="w-4 h-4 text-crimson animate-pulse" />
            <span>PRODUCED MASTER AUDIO // EPISODE 01</span>
          </div>
          <h3 className="font-display font-bold text-3xl text-white uppercase tracking-tight">
            Episode 1 Master Audio Track ({manifest.totalDurationSeconds}s)
          </h3>
          <p className="font-mono text-xs text-surface-muted">
            Format: MP3 / Stereo 44.1kHz // Voices Mapped: {Object.keys(manifest.voiceMapping).length} // SFX Mixed: {manifest.appliedSFX.length}
          </p>

          {/* Animated Audio Equalizer Waveform Visualization */}
          <div className="flex items-end gap-1 h-8 pt-2">
            {[40, 75, 30, 90, 60, 100, 45, 80, 50, 95, 35, 70, 85, 40, 65, 90, 30, 75].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-crimson via-gold to-cyan rounded-t animate-pulse"
                style={{ height: `${h}%`, animationDuration: `${0.4 + (i % 5) * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* HTML5 Audio Player */}
        <div className="w-full md:w-auto z-10">
          <audio controls src={manifest.audioFilePath} className="w-full md:w-80 shadow-lg rounded-lg border border-slate-border" />
        </div>
      </div>

      {/* Active Spoken Line Indicator (During Live Acting) */}
      {isLiveSpeaking && activeLineId && (
        <div className="bg-crimson/15 border border-crimson/40 p-4 rounded-xl font-mono text-xs text-surface-text animate-pulse">
          <span className="text-crimson font-bold uppercase block mb-1">LIVE VOICE ACTING IN PROGRESS:</span>
          {scriptLines.find((l) => l.id === activeLineId)?.text}
        </div>
      )}

      {/* Voice Casting & SFX Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voice Casting Mapping Matrix */}
        <div className="bg-charcoal border border-slate-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-gold font-mono text-xs font-bold uppercase">
            <Mic className="w-4 h-4 text-gold" /> Voice Casting Matrix (TTS Provider Mapping)
          </div>
          <div className="space-y-2">
            {Object.entries(manifest.voiceMapping).map(([char, voice]) => (
              <div key={char} className="flex items-center justify-between bg-slate p-2.5 rounded font-mono text-xs border border-slate-border/50">
                <span className="text-white font-bold">{char}</span>
                <span className="text-cyan bg-cyan/10 px-2.5 py-1 rounded border border-cyan/30">
                  Voice ID: {voice}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Applied SFX Clips & Logged SFX */}
        <div className="bg-charcoal border border-slate-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan font-mono text-xs font-bold uppercase">
            <Music className="w-4 h-4 text-cyan" /> SFX Keyword Insertion & Volume Mixing
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {manifest.appliedSFX.map((sfx) => (
              <div key={sfx.sfxCueId} className="flex items-center justify-between bg-slate p-2.5 rounded font-mono text-xs border border-slate-border/50">
                <span className="text-surface-text truncate">{sfx.description}</span>
                <span className="text-gold text-[10px] shrink-0 font-bold">{sfx.matchedFile}</span>
              </div>
            ))}
            {manifest.missingSFXLogged.map((msg, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-crimson/10 border border-crimson/30 p-2 rounded font-mono text-[10px] text-crimson">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span className="truncate">{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
