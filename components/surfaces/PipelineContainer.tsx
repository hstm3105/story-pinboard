'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Load API Key & Model from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    const savedModel = localStorage.getItem('gemini_selected_model') || 'gemini-3.5-flash-lite';
    setSettings({ apiKey: savedKey, model: savedModel });
  }, []);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gemini_api_key', newSettings.apiKey);
    localStorage.setItem('gemini_selected_model', newSettings.model);
  };

  // Agent Pipeline Stage Cards
  const [stages, setStages] = useState<AgentStage[]>([
    { id: 'director', name: 'Director Agent', role: 'Visual Bible & Concept', status: 'queued' },
    { id: 'research', name: 'Research Agent', role: 'Panel Composition Strategy', status: 'queued' },
    { id: 'screenwriter', name: 'Screenwriter Agent', role: 'Script & Panel Breakdowns', status: 'queued' },
    { id: 'auditor', name: 'Safety Auditor Agent', role: 'PG-13 & Visual Compliance', status: 'queued' },
    { id: 'localization', name: 'Localization Agent', role: 'Cultural Dialogue Adaptation', status: 'queued' },
    { id: 'production', name: 'Comic Production Agent', role: 'Graphic Novel Publication', status: 'queued' },
  ]);

  // Deep Stage Output Data
  const [researchData, setResearchData] = useState<ResearchBrief | null>(null);
  const [episodeScript, setEpisodeScript] = useState<EpisodeScript | null>(null);
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [localizationPackage, setLocalizationPackage] = useState<LocalizationPackage | null>(null);
  const [productionManifest, setProductionManifest] = useState<ProductionManifest | null>(null);
  const [lockedEpisodes, setLockedEpisodes] = useState<LockedEpisode[]>([]);

  // Telemetry Log Events
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>([
    {
      id: 'init-1',
      timestamp: '00:00:00',
      agentId: 'director',
      stageName: 'System Core',
      message: 'Graphic Novel Production Suite online. Enter a premise or select a genre to launch agents.',
    },
  ]);

  // MASTER EXPAND PIPELINE HANDLER
  const handleExpandConcept = async () => {
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
      logTelemetry('auditor', 'Safety Auditor Agent', `Safety Auditor Agent: Running 4-point visual compliance audit...`);
      const { auditReport: audit, logMessage: auditLog } = await runSafetyAuditorAgent(settings.apiKey, settings.model, bible, script);
      setAuditReport(audit);
      updateStageStatus('auditor', 'complete');
      logTelemetry('auditor', 'Safety Auditor Agent', auditLog);

      // 5. LOCALIZATION AGENT
      updateStageStatus('localization', 'in_progress');
      logTelemetry('localization', 'Localization Agent', `Localization Agent: Adapting dialogue speech bubbles & sound FX lettering...`);
      const { localizationPackage: locPkg, logMessage: locLog } = await runLocalizationAgent(settings.apiKey, settings.model, bible, script);
      setLocalizationPackage(locPkg);
      updateStageStatus('localization', 'complete');
      logTelemetry('localization', 'Localization Agent', locLog);

      // 6. COMIC PRODUCTION AGENT
      updateStageStatus('production', 'in_progress');
      logTelemetry('production', 'Comic Production Agent', `Comic Production Agent: Assembling graphic novel issue with per-panel artwork & vector speech bubbles...`);
      const { manifest: prodManifest, logMessage: prodLog } = await runComicProductionAgent(script, bible.visualAestheticStyle || selectedGenre, settings.apiKey);
      setProductionManifest(prodManifest);
      updateStageStatus('production', 'complete');
      logTelemetry('production', 'Comic Production Agent', prodLog);

      // Default active detail stage to Production Reader upon completion
      setActiveDetailStageId('production');
    } catch (err: any) {
      console.error('Pipeline execution error:', err);
      setPipelineError(err.message || 'Pipeline execution failed.');
      logTelemetry('director', 'Error Core', `Pipeline Error: ${err.message}`);
    } finally {
      setIsExpanding(false);
    }
  };

  const handleOpenDetail = (stageId: string) => {
    setActiveDetailStageId(stageId);
  };

  const handleApproveStage = () => {
    if (!activeDetailStageId) return;
    const stageIndex = stages.findIndex((s) => s.id === activeDetailStageId);
    if (stageIndex < stages.length - 1) {
      setActiveDetailStageId(stages[stageIndex + 1].id);
    }
  };

  const handleRegenerateStage = () => {
    handleExpandConcept();
  };

  return (
    <div className="min-h-screen bg-charcoal text-surface-text flex flex-col justify-between">
      {/* Top Header Navigation Bar */}
      <header className="bg-charcoal border-b border-slate-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Radio className="w-6 h-6 text-crimson animate-pulse" />
          <div>
            <h1 className="font-display text-xl font-black uppercase tracking-tight text-white leading-none">
              REEL-TO-REEL // COMIC STUDIO
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

            {/* Premise Prompt Input Box */}
            <div className="space-y-2">
              <label className="font-mono text-xs text-surface-muted uppercase block">
                Series Premise Prompt:
              </label>
              <textarea
                value={customPremise}
                onChange={(e) => setCustomPremise(e.target.value)}
                rows={5}
                placeholder="Enter your comic series concept premise..."
                className="w-full bg-charcoal text-white font-sans text-sm p-4 rounded-xl border border-slate-border focus:border-crimson focus:outline-none transition-all resize-none shadow-inner"
              />
            </div>

            {/* Run Pipeline CTA */}
            <button
              onClick={handleExpandConcept}
              disabled={isExpanding || !customPremise.trim()}
              className="w-full py-4 bg-crimson hover:bg-crimson-dark disabled:opacity-50 text-white font-display font-black uppercase tracking-wider rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-98"
            >
              {isExpanding ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Agents Executing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>⚡ Run Multi-Agent Studio Pipeline</span>
                </>
              )}
            </button>
          </div>

          {/* TELEMETRY TRACE LOG (Dedicated to Left Column Bottom) */}
          <div className="flex-1 min-h-[320px] bg-slate border border-slate-border rounded-xl p-5 shadow-2xl flex flex-col">
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-3 font-bold border-b border-slate-border/50 pb-2">
              LIVE AGENT TELEMETRY TRACE LOG
            </span>
            <div className="flex-1 overflow-y-auto max-h-[360px] scrollbar-thin">
              <TelemetryTicker events={telemetryEvents} />
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN PANEL: GENRE CATEGORIES & PIPELINE MASTER DECK (~62% Width) */}
        <section className="w-[62%] space-y-6 flex flex-col">
          {/* Genre Category Cards Selector */}
          <DirectorDeck
            selectedCategory={selectedGenre}
            onSelectCategory={setSelectedGenre}
          />

          {/* Master Pipeline Deck (6 Stages Pipeline Cards) */}
          <MasterDeck
            stages={stages}
            activeDetailStageId={activeDetailStageId}
            onOpenDetail={handleOpenDetail}
          />

          {/* ACTIVE STAGE DETAIL OVERLAY / REVEAL PANELS WITH ANIMATEPRESENCE TRANSITIONS */}
          <AnimatePresence mode="wait">
            {/* Surface 1: Title Card / Director's Graphic Bible */}
            {activeDetailStageId === 'director' && storyBible && (
              <motion.div
                key="director"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <TitleCard concept={storyBible} />
              </motion.div>
            )}

            {/* Research Agent Market & Composition Panel */}
            {activeDetailStageId === 'research' && researchData && (
              <motion.div
                key="research"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <ResearchDetailPanel
                  research={researchData}
                  onApprove={handleApproveStage}
                  onRegenerate={handleRegenerateStage}
                />
              </motion.div>
            )}

            {/* Screenwriter Script & Panel Breakdown View */}
            {activeDetailStageId === 'screenwriter' && episodeScript && (
              <motion.div
                key="screenwriter"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <TeleprompterView
                  script={episodeScript}
                  onApprove={handleApproveStage}
                  onRegenerate={handleRegenerateStage}
                />
              </motion.div>
            )}

            {/* Safety Auditor Compliance Report */}
            {activeDetailStageId === 'auditor' && auditReport && (
              <motion.div
                key="auditor"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <SafetyChecklist
                  checks={auditReport.checks}
                  onApprove={handleApproveStage}
                  onRegenerate={handleRegenerateStage}
                />
              </motion.div>
            )}

            {/* Localization Agent Dubbing Deck */}
            {activeDetailStageId === 'localization' && localizationPackage && (
              <motion.div
                key="localization"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <LocalizationGrid
                  notes={localizationPackage.languages}
                  onApprove={handleApproveStage}
                  onRegenerate={handleRegenerateStage}
                />
              </motion.div>
            )}

            {/* Comic Production Agent & Graphic Novel Reader Master */}
            {activeDetailStageId === 'production' && productionManifest && (
              <motion.div
                key="production"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <ComicBookReader
                  manifest={productionManifest}
                  onApprove={handleApproveStage}
                />
              </motion.div>
            )}
          </AnimatePresence>

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
