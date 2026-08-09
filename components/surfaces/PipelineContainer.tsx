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
import { Card, Badge, Button, SectionHeader } from '../ui';

import {
  runDirectorAgent,
  runResearchAgent,
  runScreenwriterAgent,
  runSafetyAuditorAgent,
  runLocalizationAgent,
} from '@/lib/geminiApi';

import { runComicProductionAgent } from '@/lib/comicProductionAgent';

import { Radio, Settings, Key, AlertCircle, Send } from 'lucide-react';

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

  const logTelemetry = (agentId: AgentId, stageName: string, message: string) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    setTelemetryEvents((prev) => [
      ...prev,
      {
        id: `evt-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        agentId,
        stageName,
        message,
      },
    ]);
  };

  const updateStageStatus = (id: AgentId, status: 'queued' | 'in_progress' | 'complete') => {
    setStages((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const handleOpenDetail = (id: string) => {
    setActiveDetailStageId((prev) => (prev === id ? null : id));
  };

  const handleApproveStage = () => {
    if (activeDetailStageId === 'director') setActiveDetailStageId('research');
    else if (activeDetailStageId === 'research') setActiveDetailStageId('screenwriter');
    else if (activeDetailStageId === 'screenwriter') setActiveDetailStageId('auditor');
    else if (activeDetailStageId === 'auditor') setActiveDetailStageId('localization');
    else if (activeDetailStageId === 'localization') setActiveDetailStageId('production');
    else if (activeDetailStageId === 'production') setActiveDetailStageId(null);
  };

  const handleRegenerateStage = () => {
    handleExpandConcept();
  };

  const handleExpandConcept = async () => {
    if (!customPremise.trim()) return;
    setIsExpanding(true);
    setPipelineError(null);

    try {
      // 1. DIRECTOR AGENT
      updateStageStatus('director', 'in_progress');
      logTelemetry('director', 'Director Agent', `Director Agent: Analyzing premise "${customPremise.substring(0, 30)}..." for ${selectedGenre}`);
      const { storyBible: bible, logMessage: dirLog } = await runDirectorAgent(settings.apiKey, settings.model, selectedGenre, customPremise);
      setStoryBible(bible);
      updateStageStatus('director', 'complete');
      logTelemetry('director', 'Director Agent', dirLog);

      // 2. RESEARCH AGENT
      updateStageStatus('research', 'in_progress');
      logTelemetry('research', 'Research Agent', `Research Agent: Generating panel grid layout strategy & atmospheric color palette...`);
      const { researchBrief: brief, logMessage: resLog } = await runResearchAgent(settings.apiKey, settings.model, selectedGenre, bible);
      setResearchData(brief);
      updateStageStatus('research', 'complete');
      logTelemetry('research', 'Research Agent', resLog);

      // 3. SCREENWRITER AGENT
      updateStageStatus('screenwriter', 'in_progress');
      logTelemetry('screenwriter', 'Screenwriter Agent', `Screenwriter Agent: Drafting multi-page comic panel scripts & speech bubbles...`);
      const { episodeScript: script, lockedEpisodes: eps, logMessage: scrLog } = await runScreenwriterAgent(settings.apiKey, settings.model, bible, brief);
      setEpisodeScript(script);
      setLockedEpisodes(eps);
      updateStageStatus('screenwriter', 'complete');
      logTelemetry('screenwriter', 'Screenwriter Agent', scrLog);

      // 4. SAFETY AUDITOR AGENT
      updateStageStatus('auditor', 'in_progress');
      logTelemetry('auditor', 'Safety Auditor Agent', `Safety Auditor Agent: Running 4-point visual compliance audit...`);
      const { auditReport: audit, logMessage: auditLog } = await runSafetyAuditorAgent(settings.apiKey, settings.model, bible, script);
      setAuditReport(audit);
      updateStageStatus('auditor', 'complete');
      logTelemetry('auditor', 'Safety Auditor Agent', auditLog);

      // 5. LOCALIZATION AGENT
      updateStageStatus('localization', 'in_progress');
      logTelemetry('localization', 'Localization Agent', `Localization Agent: Translating speech bubbles into 5 target comic markets...`);
      const { localizationPackage: locPkg, logMessage: locLog } = await runLocalizationAgent(settings.apiKey, settings.model, bible, script);
      setLocalizationPackage(locPkg);
      updateStageStatus('localization', 'complete');
      logTelemetry('localization', 'Localization Agent', locLog);

      // 6. COMIC PRODUCTION AGENT
      updateStageStatus('production', 'in_progress');
      logTelemetry('production', 'Comic Production Agent', `Comic Production Agent: Compiling graphic text panels & lettered comic issue...`);
      const { manifest, logMessage: prodLog } = await runComicProductionAgent(script, selectedGenre, settings.apiKey);
      setProductionManifest(manifest);
      updateStageStatus('production', 'complete');
      logTelemetry('production', 'Comic Production Agent', prodLog);

      setActiveDetailStageId('director');
    } catch (err: any) {
      console.error(err);
      setPipelineError(err.message || 'Pipeline execution failed.');
      logTelemetry('director', 'System Core', `CRITICAL ERROR: ${err.message || 'Execution halted.'}`);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-surface-text flex flex-col font-sans selection:bg-crimson selection:text-white">
      {/* Studio Header Bar */}
      <header className="bg-slate border-b border-slate-border px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-crimson border border-crimson/50 flex items-center justify-center text-white shadow-crimson-glow">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl uppercase tracking-tight text-white leading-none">
              REEL-TO-REEL // COMIC STUDIO
            </h1>
            <span className="font-mono text-[10px] text-cyan uppercase tracking-widest block">
              AGENTIC GRAPHIC NOVEL & COMIC BOOK PRODUCTION SUITE
            </span>
          </div>
        </div>

        {/* SETTINGS BUTTON ON TOP RIGHT */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsSettingsOpen(true)}
          icon={<Settings className="w-4 h-4 text-gold" />}
        >
          <span>Settings</span>
          {settings.apiKey ? (
            <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_#D9A441] ml-1" title="API Key Configured" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-crimson shadow-[0_0_8px_#C4302B] ml-1" title="API Key Required" />
          )}
        </Button>
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
          <Button variant="primary" size="sm" icon={<Key className="w-3.5 h-3.5" />} onClick={() => setIsSettingsOpen(true)}>
            Open Settings
          </Button>
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
          <Card variant="elevated" depth="high" className="p-6 space-y-5">
            <SectionHeader
              label="STUDIO INPUT // COMIC PROMPT CONTROL"
              title="Comic Series Studio"
              action={
                <Badge variant="crimson" size="sm">
                  {selectedGenre}
                </Badge>
              }
            />

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
            <Button
              variant="primary"
              size="lg"
              onClick={handleExpandConcept}
              disabled={isExpanding || !customPremise.trim()}
              isLoading={isExpanding}
              icon={<Send className="w-5 h-5" />}
              className="w-full py-4 text-base shadow-xl"
            >
              ⚡ Run Multi-Agent Studio Pipeline
            </Button>
          </Card>

          {/* TELEMETRY TRACE LOG (Dedicated to Left Column Bottom) */}
          <Card variant="elevated" depth="high" className="flex-1 min-h-[320px] p-5 flex flex-col">
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-3 font-bold border-b border-slate-border/50 pb-2">
              LIVE AGENT TELEMETRY TRACE LOG
            </span>
            <div className="flex-1 overflow-y-auto max-h-[360px] scrollbar-thin">
              <TelemetryTicker events={telemetryEvents} />
            </div>
          </Card>
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
