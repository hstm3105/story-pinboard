export type AgentId = 'director' | 'research' | 'screenwriter' | 'auditor' | 'localization' | 'production';

export type StageStatus = 'queued' | 'in_progress' | 'complete';

export interface AppSettings {
  apiKey: string;
  model: string;
}

export interface AgentStage {
  id: AgentId;
  name: string;
  role: string;
  status: StageStatus;
  outputSummary?: string;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  agentId: AgentId;
  stageName: string;
  message: string;
}

// 1. STORY BIBLE SCHEMA (Director Agent - Visual Comic Book Aesthetic & World Arc)
export interface CharacterVisualKeyframe {
  characterName: string;
  visualAppearance: string;
  signatureCostume: string;
  colorTheme: string;
}

export interface StoryBible {
  genreBlend: string;
  title: string;
  tagline: string;
  expandedPremise: string;
  visualAestheticStyle: 'Dark Noir Cyberpunk' | 'Manga Anime' | 'Silver Age Superhero' | 'Watercolor High Fantasy' | 'Indie Graphic Novel';
  characterVisualKeyframes: CharacterVisualKeyframe[];
  protagonistStartingEmotionalState: string;
  protagonistEndingEmotionalState: string;
  toneMoodDescriptors: string[];
  estimatedSeasonEpisodeCount: number;
}

// 2. RESEARCH BRIEF SCHEMA (Research Agent - Panel Composition & Color Psychology)
export interface TropeReference {
  name: string;
  description: string;
  subversionAngle: string;
  emotionalPayoff: string;
}

export interface PanelCompositionRule {
  panelType: string;
  recommendedAspect: string;
  visualImpact: string;
}

export interface ResearchBrief {
  genreTropesUsed: TropeReference[];
  panelCompositionRules: PanelCompositionRule[];
  colorPaletteStrategy: {
    primaryToneHex: string;
    secondaryToneHex: string;
    accentGlowHex: string;
    paletteRationale: string;
  };
  targetPanelsPerPage: number;
  targetTotalPages: number;
  visualHookStrategy: string;
}

// 3. COMIC PANEL & SCRIPT SCHEMA (Screenwriter Agent - Panel Breakdowns & Speech Bubbles)
export interface SpeechBubble {
  id: string;
  speaker: string;
  text: string;
  bubbleType: 'dialogue' | 'whisper' | 'shout' | 'caption';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export interface ComicPanelScript {
  panelNum: number;
  sceneDescription: string;
  visualFocusPrompt: string;
  speechBubbles: SpeechBubble[];
  visualSoundFX?: string; // e.g. "KRAK!", "BZZZT!", "SHHH!"
  panelStyle: 'standard' | 'wide-splash' | 'action-split' | 'close-up';
}

export interface ComicPageScript {
  pageNum: number;
  pageTitle: string;
  isKeyframeSplashPage: boolean;
  panels: ComicPanelScript[];
}

export interface EpisodeScript {
  issueNum: number;
  title: string;
  pages: ComicPageScript[];
}

// 4. AUDIT REPORT SCHEMA (Safety Auditor Agent)
export interface AuditCheckResult {
  category: 'PG-13 Visual Scan' | 'Copyright & Originality' | 'Cultural & Ethical Safety' | 'Cross-Episode Consistency';
  passed: boolean;
  reasoning: string;
  flaggedLines: string[];
}

export interface AuditReport {
  checks: AuditCheckResult[];
  overallApproved: boolean;
}

// 5. LOCALIZATION PACKAGE SCHEMA (Localization Agent - Speech Bubble & Sound FX Lettering)
export interface LocalizedSpeechBubble {
  originalText: string;
  localizedText: string;
  speaker: string;
}

export interface LocalizedLanguageProfile {
  language: string;
  flag: string;
  translatedTitle: string;
  translatedTagline: string;
  localizedSpeechBubbles: LocalizedSpeechBubble[];
  localizedSoundFXLettering: Record<string, string>; // e.g. "KRAK!" -> "¡ZAS!", "BZZZT!" -> "धमाका!"
  voiceCastingNotes: {
    characterName: string;
    vocalRange: string;
    accentDirection: string;
    emotionalToneGuidance: string;
  }[];
}

export interface LocalizationPackage {
  languages: LocalizedLanguageProfile[];
}

// 6. COMIC PRODUCTION MANIFEST SCHEMA (Production Agent - Comic Book Pages & Panels)
export interface RenderedComicPanel {
  pageNum: number;
  panelNum: number;
  sceneDescription: string;
  visualFocusPrompt: string;
  bgGradient: string;
  avatarIcon: string;
  speechBubbles: SpeechBubble[];
  visualSoundFX?: string;
  panelStyle: string;
  imageUrl?: string;
}

export interface RenderedComicPage {
  pageNum: number;
  pageTitle: string;
  isKeyframeSplashPage: boolean;
  panels: RenderedComicPanel[];
}

export interface LockedEpisode {
  id: string;
  episodeNum: number;
  title: string;
  duration: string;
  isCoinWall: boolean;
  previewText: string;
}

export interface ProductionManifest {
  issueNum: number;
  title: string;
  totalPages: number;
  visualStyle: string;
  pages: RenderedComicPage[];
}
