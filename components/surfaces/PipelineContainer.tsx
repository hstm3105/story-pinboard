'use client';

import React, { useState, useEffect } from 'react';
import {
  AgentId,
  AgentStage,
  StoryBible,
  ResearchBrief,
  EpisodeScript,
  AuditReport,
  LocalizationPackage,
  ProductionManifest,
  LockedEpisode,
  TelemetryEvent,
  AppSettings,
} from '@/lib/types';

import { DirectorDeck } from './DirectorDeck';
import { TitleCard } from './TitleCard';
import { MasterDeck } from './MasterDeck';
import { TeleprompterView } from './TeleprompterView';
import { SafetyChecklist } from './SafetyChecklist';
import { LocalizationGrid } from './LocalizationGrid';
import { ResearchDetailPanel } from './ResearchDetailPanel';
import { ComicBookReader } from './ComicBookReader';
import { TapeDeck } from './TapeDeck';
import { SettingsModal } from './SettingsModal';
import { TelemetryTicker } from './TelemetryTicker';
import { MobilePipelineView } from '../mobile/MobilePipelineView';

import {
  runDirectorAgent,
  runResearchAgent,
  runScreenwriterAgent,
  runSafetyAuditorAgent,
  runLocalizationAgent,
} from '@/lib/geminiApi';

import { runComicProductionAgent } from '@/lib/comicProductionAgent';

import { Radio, Settings, Key, AlertCircle, Send, Palette } from 'lucide-react';

export const PipelineContainer: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>('Sci-Fi');
  const [customPremise, setCustomPremise] = useState<string>(
    'In the flooded lower sectors of New Babel, a rogue technician extracts an illegal memory drive, discovering proof that the city ruler was once a human resident of the slums.'
  );

  const [storyBible, setStoryBible] = useState<StoryBible | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [activeDetailStageId, setActiveDetailStageId] = useState<string | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  // App Settings State (Gemini API Key & Model)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    model: 'gemini-3.5-flash-lite',
  });

  // Load saved settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('antigravity_gemini_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage:', e);
    }
  }, []);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setPipelineError(null);
    try {
      localStorage.setItem('antigravity_gemini_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const [stages, setStages] = useState<AgentStage[]>([
    { id: 'director', name: 'Director Agent', role: 'Visual Aesthetic & Keyframes', status: 'queued' },
    { id: 'research', name: 'Research Agent', role: 'Panel Grid & Color Palette', status: 'queued' },
    { id: 'screenwriter', name: 'Screenwriter Agent', role: 'Page & Panel Breakdowns', status: 'queued' },
    { id: 'auditor', name: 'Safety Auditor Agent', role: 'PG-13 Scan & Originality', status: 'queued' },
    { id: 'localization', name: 'Localization Agent', role: 'Bubbles & Sound FX Translation', status: 'queued' },
    { id: 'production', name: 'Comic Production Agent', role: 'Comic Illustrator & Reader Master', status: 'queued' },
  ]);

  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>([]);
  const [researchData, setResearchData] = useState<ResearchBrief | null>(null);
  const [episodeScript, setEpisodeScript] = useState<EpisodeScript | null>(null);
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [localizationPackage, setLocalizationPackage] = useState<LocalizationPackage | null>(null);
  const [productionManifest, setProductionManifest] = useState<ProductionManifest | null>(null);
  const [lockedEpisodes, setLockedEpisodes] = useState<LockedEpisode[]>([]);

  const handleCategorySelect = (category: string, samplePremise: string) => {
    setSelectedGenre(category);
    setCustomPremise(samplePremise);
  };

  // 100% REAL DEEP MULTI-AGENT COMIC PIPELINE EXECUTION
  const handleRunPipeline = async () => {
    if (!settings.apiKey || !settings.apiKey.trim()) {
      setIsSettingsOpen(true);
      setPipelineError('Please enter your Gemini API Key in Settings to run the real AI Agents.');
      return;
    }

    if (!customPremise.trim()) return;

    setIsExpanding(true);
    setPipelineError(null);

    // Reset stages
    setStages((prev) =>
      prev.map((st) => ({
        ...st,
        status: st.id === 'director' ? 'in_progress' : 'queued',
      }))
    );

    const logTelemetry = (agentId: AgentId, stageName: string, message: string) => {
      setTelemetryEvents((prev) => [
        ...prev,
        {
          id: `evt-${Date.now()}-${Math.random()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          agentId,
          stageName,
          message,
        },
      ]);
    };

    const updateStageStatus = (agentId: AgentId, status: 'in_progress' | 'complete') => {
      setStages((prev) => prev.map((s) => (s.id === agentId ? { ...s, status } : s)));
    };

    try {
      // 1. DIRECTOR AGENT
      logTelemetry('director', 'Director Agent', `Director Agent: Calling Gemini API (${settings.model}) for "${selectedGenre}" Visual Bible...`);
      const { storyBible: bible, logMessage: directorLog } = await runDirectorAgent(settings.apiKey, settings.model, selectedGenre, customPremise);
      setStoryBible(bible);
      updateStageStatus('director', 'complete');
      logTelemetry('director', 'Director Agent', directorLog);
      setIsExpanding(false);

      // 2. RESEARCH AGENT
      updateStageStatus('research', 'in_progress');
      logTelemetry('research', 'Research Agent', `Research Agent: Analyzing panel composition rules & color palette strategy...`);
      const { researchBrief, logMessage: researchLog } = await runResearchAgent(settings.apiKey, settings.model, selectedGenre, bible);
      setResearchData(researchBrief);
      updateStageStatus('research', 'complete');
      logTelemetry('research', 'Research Agent', researchLog);

      // 3. SCREENWRITER AGENT
      updateStageStatus('screenwriter', 'in_progress');
      logTelemetry('screenwriter', 'Screenwriter Agent', `Screenwriter Agent: Drafting comic page & panel breakdowns with speech bubbles & visual SFX...`);
      const { episodeScript: script, lockedEpisodes: locked, logMessage: scriptLog } = await runScreenwriterAgent(settings.apiKey, settings.model, bible, researchBrief);
      setEpisodeScript(script);
      setLockedEpisodes(locked);
      updateStageStatus('screenwriter', 'complete');
      logTelemetry('screenwriter', 'Screenwriter Agent', scriptLog);

      // 4. SAFETY AUDITOR AGENT
      updateStageStatus('auditor', 'in_progress');
      logTelemetry('auditor', 'Safety Auditor Agent', `Safety Auditor Agent: Running 4 visual compliance scans against comic panels...`);
      const { auditReport: audit, logMessage: auditLog } = await runSafetyAuditorAgent(settings.apiKey, settings.model, bible, script);
      setAuditReport(audit);
      updateStageStatus('auditor', 'complete');
      logTelemetry('auditor', 'Safety Auditor Agent', auditLog);

      if (!audit.overallApproved) {
        logTelemetry('auditor', 'Safety Alert', `Safety Auditor flagged compliance concerns. Halting automatic comic production until approved.`);
        setActiveDetailStageId('auditor');
        return;
      }

      // 5. LOCALIZATION AGENT
      updateStageStatus('localization', 'in_progress');
      logTelemetry('localization', 'Localization Agent', `Localization Agent: Translating speech bubbles & sound FX lettering for Spanish & Hindi...`);
      const { localizationPackage: locPkg, logMessage: locLog } = await runLocalizationAgent(settings.apiKey, settings.model, bible, script);
      setLocalizationPackage(locPkg);
      updateStageStatus('localization', 'complete');
      logTelemetry('localization', 'Localization Agent', locLog);

      // 6. COMIC PRODUCTION AGENT
      updateStageStatus('production', 'in_progress');
      logTelemetry('production', 'Comic Production Agent', `Comic Production Agent: Rendering comic panel artwork, speech bubbles & visual SFX callouts...`);
      const { manifest: prodManifest, logMessage: prodLog } = await runComicProductionAgent(script, bible.visualAestheticStyle || 'Dark Noir Cyberpunk');
      setProductionManifest(prodManifest);
      updateStageStatus('production', 'complete');
      logTelemetry('production', 'Comic Production Agent', prodLog);

      setActiveDetailStageId('production');
    } catch (err: any) {
      console.error('Pipeline execution error:', err);
      const msg = err.message || 'Error communicating with Gemini API.';
      setPipelineError(msg);
      logTelemetry('director', 'System Alert', `Pipeline Error: ${msg}`);
      setIsExpanding(false);
    }
  };

  const handleOpenDetail = (id: string) => {
    setActiveDetailStageId(id);
  };

  const handleApproveStage = () => {
    const ids: AgentId[] = ['director', 'research', 'screenwriter', 'auditor', 'localization', 'production'];
    const idx = ids.indexOf(activeDetailStageId as AgentId);
    if (idx >= 0 && idx < ids.length - 1) {
      setActiveDetailStageId(ids[idx + 1]);
    } else {
      setActiveDetailStageId(null);
    }
  };

  const handleRegenerateStage = () => {
    handleRunPipeline();
  };

  return (
    <div className="min-h-screen bg-charcoal text-surface-text flex flex-col justify-between">
      {/* Top Header Navigation Bar */}
      <header className="bg-charcoal border-b border-slate-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-crimson flex items-center justify-center text-white shadow-lg">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl uppercase tracking-wider text-white">
              ANTIGRAVITY COMIC STUDIO
            </h1>
            <span className="font-mono text-[10px] text-cyan uppercase tracking-widest block">
              AGENTIC GRAPHIC NOVEL & COMIC BOOK PRODUCTION SUITE
            </span>
          </div>
        </div>

        {/* SETTINGS BUTTON ON TOP RIGHT */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-2 bg-slate hover:bg-slate-elevated px-4 py-2 rounded-lg border border-slate-border font-mono text-xs text-gold transition-all shadow-md focus-visible:ring-2 focus-visible:ring-crimson"
        >
          <Settings className="w-4 h-4 text-gold" />
          <span>Settings</span>
          {settings.apiKey ? (
            <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_#D9A441]" title="API Key Configured" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-crimson shadow-[0_0_8px_#C4302B]" title="API Key Required" />
          )}
        </button>
      </header>

      {/* API Key Missing or Error Notice Banner */}
      {(!settings.apiKey || pipelineError) && (
        <div className="bg-crimson/20 border-b border-crimson/40 px-6 py-3 flex items-center justify-between text-xs font-mono text-crimson">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-crimson shrink-0" />
            <span>
              {pipelineError || 'Gemini API Key Required: Click "Settings" to enter your API Key for real-time AI Agent execution.'}
            </span>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="bg-crimson text-white px-3.5 py-1.5 rounded font-bold hover:bg-crimson-dark flex items-center gap-1.5 shadow-md"
          >
            <Key className="w-3.5 h-3.5" /> Open Settings
          </button>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={settings}
      />

      {/* Main Studio Viewport - SPLIT-SCREEN LAYOUT (Desktop >= MD) */}
      <main className="hidden md:flex flex-1 w-full max-w-[1600px] mx-auto p-6 gap-6">
        
        {/* LEFT COLUMN PANEL: PROMPT STUDIO & TELEMETRY LOG (~38% Width) */}
        <aside className="w-[38%] space-y-6 flex flex-col justify-between">
          <div className="space-y-5 bg-slate border border-slate-border rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-1">
                  STUDIO INPUT // COMIC PROMPT CONTROL
                </span>
                <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
                  Comic Series Studio
                </h2>
              </div>
              <span className="font-mono text-xs bg-crimson/15 text-crimson border border-crimson/30 px-3 py-1 rounded font-bold">
                {selectedGenre}
              </span>
            </div>

            {/* Custom Premise Textarea Input */}
            <div className="space-y-2">
              <label className="font-mono text-xs text-surface-muted block font-semibold">
                ENTER CUSTOM COMIC STORY PREMISE:
              </label>
              <textarea
                value={customPremise}
                onChange={(e) => setCustomPremise(e.target.value)}
                placeholder="Describe your comic premise, protagonist dilemma, visual style, or graphic novel concept..."
                className="w-full h-44 bg-charcoal border border-slate-border rounded-lg p-3 font-sans text-sm text-white placeholder-surface-muted focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson resize-none leading-relaxed"
              />
            </div>

            {/* Primary Pipeline Execution CTA */}
            <button
              onClick={handleRunPipeline}
              disabled={isExpanding}
              className="w-full bg-crimson hover:bg-crimson-dark text-white font-display font-bold text-lg uppercase py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-crimson/20 transition-all disabled:opacity-50"
            >
              {isExpanding ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Illustrating Issue #1...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>⚡ Produce Comic Book Issue #1</span>
                </>
              )}
            </button>
          </div>

          {/* TELEMETRY LOG TRACE PANEL ON LEFT COLUMN */}
          <div className="flex-1 bg-slate border border-slate-border rounded-xl p-4 shadow-2xl flex flex-col justify-between">
            <span className="font-mono text-xs text-cyan uppercase tracking-widest block mb-2 font-bold">
              AGENT TELEMETRY TRACE LOG
            </span>
            <div className="flex-1 max-h-80 overflow-y-auto">
              <TelemetryTicker events={telemetryEvents} />
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN PANEL: CATEGORIES GRID & PRODUCTION DECK (~62% Width) */}
        <section className="w-[62%] space-y-6 overflow-y-auto pr-1">
          {/* Surface 1: Category Selection Grid */}
          <DirectorDeck
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedGenre}
          />

          {/* Surface 2: Studio Master Deck (6 Agents) */}
          <MasterDeck
            stages={stages}
            activeDetailStageId={activeDetailStageId}
            onOpenDetail={handleOpenDetail}
          />

          {/* Hero Title Card Reveal */}
          {storyBible && <TitleCard concept={storyBible} />}

          {/* Research Agent Detail Panel */}
          {activeDetailStageId === 'research' && researchData && (
            <ResearchDetailPanel
              research={researchData}
              onApprove={handleApproveStage}
              onRegenerate={handleRegenerateStage}
            />
          )}

          {/* Surface 3: Screenwriter Panel & Script View */}
          {activeDetailStageId === 'screenwriter' && episodeScript && (
            <TeleprompterView
              script={episodeScript}
              onApprove={handleApproveStage}
              onRegenerate={handleRegenerateStage}
            />
          )}

          {/* Safety Auditor Certification Checklist */}
          {activeDetailStageId === 'auditor' && auditReport && (
            <SafetyChecklist
              checks={auditReport.checks}
              onApprove={handleApproveStage}
              onRegenerate={handleRegenerateStage}
            />
          )}

          {/* Localization Agent Dubbing Deck */}
          {activeDetailStageId === 'localization' && localizationPackage && (
            <LocalizationGrid
              notes={localizationPackage.languages}
              onApprove={handleApproveStage}
              onRegenerate={handleRegenerateStage}
            />
          )}

          {/* NEW: Comic Production Agent & Graphic Novel Reader Master */}
          {activeDetailStageId === 'production' && productionManifest && (
            <ComicBookReader
              manifest={productionManifest}
              onApprove={handleApproveStage}
            />
          )}

          {/* Surface 4: Tape Deck / Episode Outlines */}
          {lockedEpisodes.length > 0 && <TapeDeck episodes={lockedEpisodes} />}
        </section>
      </main>

      {/* Mobile Responsive Fallback (< MD) */}
      <div className="block md:hidden flex-1 p-4">
        <MobilePipelineView
          stages={stages}
          concept={storyBible}
          telemetryEvents={telemetryEvents}
          onOpenDetail={handleOpenDetail}
        />
      </div>

      {/* Persistent Studio Footer */}
      <footer className="bg-charcoal-dark border-t border-slate-border px-6 py-3 text-center font-mono text-xs text-surface-subtle z-50">
        ANTIGRAVITY MULTI-AGENT COMIC STUDIO // POWERED BY GOOGLE GEMINI API
      </footer>
    </div>
  );
};
