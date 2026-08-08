'use client';

import React, { useState } from 'react';
import { Sparkles, RefreshCw, Terminal, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export const SinglePanelTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [panelData, setPanelData] = useState<{
    imageUrl: string;
    usedModel: string;
    promptLogged: string;
    errorDetail?: string;
  }>({
    imageUrl: '/images/comic/comic_p1_panel1.jpg',
    usedModel: 'imagen-3.0-generate-002',
    promptLogged: 'Dramatic low-angle medium close-up, 45-degree angle lighting. Kai holding up a glowing cyan neural drive in astonishment in a dark rainy slum workshop room. Character appearance: KAI: Male cyberpunk technician, athletic build, short dark messy hair with cyan cybernetic eye overlay, dark grey tactical jacket over black armor, glowing cyan neural wrist gauge. Style: Professional superhero comic book interior page illustration, in the style of a modern Marvel/DC single-issue comic. Hand-inked line art with confident bold outlines, cel-shaded coloring with visible shadow/highlight rendering, dynamic dramatic camera angle, comic panel composition. NOT photorealistic, NOT a 3D render, NOT a digital painting with soft photographic lighting — this must read as illustrated line art with flat/cel color fills, the way printed comic interior art looks.',
  });

  const [charSheet, setCharSheet] = useState(
    "KAI: Male cyberpunk technician, athletic build, short dark messy hair with cyan cybernetic eye overlay, dark grey tactical jacket over black armor, glowing cyan neural wrist gauge."
  );
  const [framing, setFraming] = useState("Dramatic low-angle medium close-up, 45-degree angle lighting");
  const [action, setAction] = useState("Kai holding up a glowing cyan neural drive in astonishment in a dark rainy slum workshop room");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const storedKey = localStorage.getItem('gemini_api_key') || '';
      const res = await fetch('/api/generate-imagen-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: storedKey,
          characterDesignSheet: charSheet,
          sceneFraming: framing,
          characterAction: action,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPanelData({
          imageUrl: data.imageUrl,
          usedModel: data.usedModel,
          promptLogged: data.promptLogged,
          errorDetail: data.errorDetail,
        });
      }
    } catch (err) {
      console.error('Single panel generation benchmark error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate border-2 border-crimson/60 rounded-xl p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-border pb-4 gap-3">
        <div>
          <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-1">
            STAGE 01 BENCHMARK // SINGLE PANEL ART & VECTOR LETTERING TEST
          </span>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
            Marvel/DC Single-Panel Proof-of-Concept
          </h2>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="font-mono text-xs font-bold text-slate-950 bg-gold hover:bg-gold/90 disabled:opacity-50 px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generating Imagen-3 Panel...' : '⚡ Generate Benchmark Panel'}
        </button>
      </div>

      {/* Main Single Panel Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Prompt Controls & Character Design Sheet */}
        <div className="lg:col-span-5 space-y-4 font-mono text-xs">
          <div className="bg-charcoal p-4 rounded-lg border border-slate-border space-y-3">
            <span className="text-cyan font-bold block uppercase border-b border-slate-border/50 pb-2">
              1. VERBATIM CHARACTER DESIGN SHEET
            </span>
            <textarea
              value={charSheet}
              onChange={(e) => setCharSheet(e.target.value)}
              rows={3}
              className="w-full bg-slate p-2.5 rounded border border-slate-border text-white text-xs font-mono focus:border-cyan outline-none"
            />
          </div>

          <div className="bg-charcoal p-4 rounded-lg border border-slate-border space-y-3">
            <span className="text-gold font-bold block uppercase border-b border-slate-border/50 pb-2">
              2. CAMERA FRAMING & ACTION
            </span>
            <div>
              <label className="text-surface-muted text-[11px] block mb-1">Camera Framing:</label>
              <input
                type="text"
                value={framing}
                onChange={(e) => setFraming(e.target.value)}
                className="w-full bg-slate p-2 rounded border border-slate-border text-white text-xs font-mono mb-2"
              />
            </div>
            <div>
              <label className="text-surface-muted text-[11px] block mb-1">Character Action:</label>
              <textarea
                value={action}
                onChange={(e) => setAction(e.target.value)}
                rows={2}
                className="w-full bg-slate p-2 rounded border border-slate-border text-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Model API Diagnostic Box */}
          <div className="bg-slate-elevated p-4 rounded-lg border border-slate-border/80 space-y-2">
            <div className="flex items-center justify-between text-cyan font-bold">
              <span>MODEL STATUS:</span>
              <span className="text-gold">{panelData.usedModel}</span>
            </div>
            {panelData.errorDetail && (
              <div className="bg-red-900/30 border border-red-500/50 p-2.5 rounded text-red-200 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{panelData.errorDetail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: High-Res Single Panel Canvas with Vector Lettering */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-charcoal p-6 rounded-xl border-4 border-slate-900 shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* The Single Panel Container */}
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-lg overflow-hidden border-4 border-slate-950 shadow-2xl bg-black">
              {/* Imagen 3 Illustrated Art Background */}
              <img
                src={panelData.imageUrl}
                alt="Benchmark Panel Art"
                className="w-full h-full object-cover block"
              />

              {/* OVERLAY 1: YELLOW INTEGRATED NARRATION CAPTION BOX */}
              <div className="absolute top-3 left-3 bg-yellow-400 text-slate-950 border-2 border-slate-900 font-mono text-[11px] font-bold p-2 max-w-[200px] shadow-xl rounded-none">
                <span className="text-[9px] uppercase font-black block text-yellow-950">SECTOR 9 // SLUM-736:</span>
                "The neural surge reached critical voltage at 03:00 hours."
              </div>

              {/* OVERLAY 2: ROUND OVAL SPEECH BALLOON WITH POINTED SVG TAIL */}
              <div className="absolute top-12 right-4 bg-white text-slate-950 p-3.5 rounded-[2rem] border-2 border-slate-950 shadow-2xl max-w-[220px] pointer-events-auto">
                <span className="text-[10px] font-mono font-bold text-crimson block uppercase tracking-wider mb-0.5">
                  KAI:
                </span>
                <p className="font-sans text-xs font-black uppercase tracking-tight leading-snug">
                  "JUST ONE MORE FIX... IF I SURVIVE THE NIGHT."
                </p>
                {/* Pointed SVG Speech Tail Aimed at Character Head */}
                <svg
                  className="absolute -bottom-3 left-8 w-5 h-4 text-white drop-shadow-[0_2px_0_rgba(0,0,0,1)]"
                  viewBox="0 0 10 10"
                  fill="currentColor"
                >
                  <path d="M0 0 L10 0 L2 10 Z" stroke="#000" strokeWidth="1" />
                </svg>
              </div>

              {/* OVERLAY 3: STYLIZED VECTOR SOUND EFFECT (JAGGED / ROTATED TRANSFORMS) */}
              <div className="absolute bottom-4 right-4 pointer-events-none">
                <div className="font-display font-black text-2xl text-yellow-300 bg-red-600 px-3 py-1 rounded border-2 border-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.8)] rotate-[-6deg] uppercase tracking-widest italic">
                  BZZZT!
                </div>
              </div>
            </div>

            <div className="w-full text-center pt-3 font-mono text-xs text-surface-muted">
              Single-Panel Composite Canvas (Art + Vector Balloon + SVG Tail + Caption + SFX)
            </div>
          </div>
        </div>
      </div>

      {/* PROMPT LOG DISPLAY PER SPEC REQUIREMENT */}
      <div className="bg-charcoal p-4 rounded-lg border border-slate-border space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2 text-cyan font-bold">
          <Terminal className="w-4 h-4 text-cyan" />
          <span>LOGGED IMAGEN-3 PANEL GENERATION PROMPT SENT TO API:</span>
        </div>
        <div className="bg-slate p-3 rounded text-surface-muted text-[11px] leading-relaxed break-words border border-slate-border/50">
          {panelData.promptLogged}
        </div>
      </div>
    </div>
  );
};
