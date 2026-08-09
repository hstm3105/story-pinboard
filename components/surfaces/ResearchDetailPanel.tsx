'use client';

import React from 'react';
import { ResearchBrief } from '@/lib/types';
import { CheckCircle2, RefreshCw, Layout, Palette, Compass, Layers } from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from '../ui';

interface ResearchDetailPanelProps {
  research: ResearchBrief;
  onApprove: () => void;
  onRegenerate: () => void;
}

export const ResearchDetailPanel: React.FC<ResearchDetailPanelProps> = ({
  research,
  onApprove,
  onRegenerate,
}) => {
  return (
    <Card variant="elevated" depth="high" className="p-6 space-y-6">
      {/* Header */}
      <SectionHeader
        label="SURFACE 02.B // RESEARCH AGENT DETAIL VIEW"
        title="Comic Visual Composition & Color Palette Brief"
        action={
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRegenerate}>
              Re-Analyze Tropes
            </Button>
            <Button variant="gold" size="sm" icon={<CheckCircle2 className="w-4 h-4" />} onClick={onApprove}>
              Approve & Continue
            </Button>
          </div>
        }
      />

      {/* Target Panel Layout & Page Count Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="flat" depth="low" className="p-4 space-y-1">
          <span className="font-mono text-[10px] text-cyan uppercase font-bold">PANELS PER PAGE</span>
          <div className="font-mono text-xl text-white font-bold flex items-center gap-2">
            <Layout className="w-5 h-5 text-cyan" /> {research.targetPanelsPerPage || 4} Panels
          </div>
        </Card>

        <Card variant="flat" depth="low" className="p-4 space-y-1">
          <span className="font-mono text-[10px] text-gold uppercase font-bold">ISSUE TOTAL PAGES</span>
          <div className="font-mono text-xl text-white font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold" /> {research.targetTotalPages || 4} Illustrated Pages
          </div>
        </Card>

        <Card variant="flat" depth="low" className="p-4 space-y-1">
          <span className="font-mono text-[10px] text-crimson uppercase font-bold">PRIMARY COLOR PALETTE</span>
          <div className="font-mono text-xs text-white font-bold flex items-center gap-2 pt-1">
            <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: research.colorPaletteStrategy?.secondaryToneHex || '#D32F2F' }} />
            <Badge variant="cyan" size="sm">
              {research.colorPaletteStrategy?.accentGlowHex || '#5FA8B0'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* PANEL COMPOSITION RULES */}
      {research.panelCompositionRules && research.panelCompositionRules.length > 0 && (
        <div className="space-y-3">
          <span className="font-mono text-xs text-gold uppercase flex items-center gap-2 font-semibold">
            <Compass className="w-4 h-4 text-gold" /> PANEL GRID COMPOSITION RULES
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {research.panelCompositionRules.map((rule, idx) => (
              <Card key={idx} variant="flat" depth="medium" className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="font-display text-base text-white uppercase">{rule.panelType}</strong>
                  <Badge variant="cyan" size="sm">
                    {rule.recommendedAspect}
                  </Badge>
                </div>
                <p className="font-sans text-xs text-surface-muted pt-1">{rule.visualImpact}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* COLOR PALETTE STRATEGY */}
      {research.colorPaletteStrategy && (
        <Card variant="flat" depth="medium" className="p-5 space-y-3">
          <span className="font-mono text-xs text-cyan uppercase flex items-center gap-2 font-semibold">
            <Palette className="w-4 h-4 text-cyan" /> ATMOSPHERIC COLOR PALETTE STRATEGY
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-5 h-5 rounded border" style={{ backgroundColor: research.colorPaletteStrategy.primaryToneHex }} />
              <span className="text-surface-muted">Base: {research.colorPaletteStrategy.primaryToneHex}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-5 h-5 rounded border" style={{ backgroundColor: research.colorPaletteStrategy.secondaryToneHex }} />
              <span className="text-crimson font-bold">Primary: {research.colorPaletteStrategy.secondaryToneHex}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-5 h-5 rounded border" style={{ backgroundColor: research.colorPaletteStrategy.accentGlowHex }} />
              <span className="text-cyan font-bold">Glow: {research.colorPaletteStrategy.accentGlowHex}</span>
            </div>
          </div>
          <p className="font-sans text-xs text-surface-text italic leading-relaxed">
            {research.colorPaletteStrategy.paletteRationale}
          </p>
        </Card>
      )}

      {/* Curated Tropes Grid */}
      <div className="space-y-3">
        <span className="font-mono text-xs text-surface-muted uppercase block font-semibold">
          CURATED GENRE TROPES (FROM TROPE KNOWLEDGE BASE)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {research.genreTropesUsed.map((t) => (
            <Card key={t.name} variant="flat" depth="medium" className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <strong className="font-display text-base text-white uppercase">{t.name}</strong>
              </div>
              <p className="font-sans text-xs text-surface-muted">{t.description}</p>
              <div className="font-mono text-[10px] text-cyan pt-1">
                <strong>Subversion Angle:</strong> {t.subversionAngle}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};
