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

// 1. STORY BIBLE SCHEMA (Director Agent - Dynamic Episode Count & Season Arc)
export interface ActBreakdown {
  actNumber: 1 | 2 | 3;
  title: string;
  turningPoint: string;
  synopsis: string;
}

export interface SeasonBeat {
  episodeNum: number;
  title: string;
  isCoinWall: boolean;
  dramaticBeatSummary: string;
}

export interface StoryBible {
  genreBlend: string;
  title: string;
  tagline: string;
  expandedPremise: string;
  protagonistStartingEmotionalState: string;
  protagonistEndingEmotionalState: string;
  toneMoodDescriptors: string[];
  actBreakdown: ActBreakdown[];
  estimatedSeasonEpisodeCount: number;  // DYNAMICALLY REASONED (8-24 episodes)
  fullSeasonOutline: SeasonBeat[];       // Complete season beat outline matching episode count
}

// 2. RESEARCH BRIEF SCHEMA (Research Agent - Independent Market Research & Strategic Positioning)
export interface TropeReference {
  name: string;
  description: string;
  subversionAngle: string;
  emotionalPayoff: string;
}

export interface MarketTrend {
  trendName: string;
  marketShareGain: string;
  description: string;
}

export interface ResearchBrief {
  genreTropesUsed: TropeReference[];
  genreMarketTrends: MarketTrend[];            // Independent market research trends
  seriesPositioningAnalysis: string;          // Strategic positioning of this series
  optimizationRecommendations: string[];     // 3 actionable optimization tips
  premiseEmotionalDrivers: string[];
  targetWPM: number;
  targetEpisodeDurationMinutes: number;
  targetWordCount: number;
  hookStrategy: string;
}

// 3. CHARACTER VOICE PROFILE (Screenwriter Sub-Schema)
export interface CharacterVoiceProfile {
  characterName: string;
  apparentAgeRange: string;
  genderPresentation: string;
  emotionalRegister: string;
  vocalToneAdjectives: string[];
  assignedTTSVoiceId: string;
}

// 4. EPISODE SCRIPT SCHEMA (Screenwriter Agent - Multi-Episode Script Snippets)
export interface ScriptLine {
  id: string;
  type: 'narrator' | 'dialogue' | 'sfx';
  character?: string;
  deliveryDirection?: string;
  text: string;
}

export interface MultiEpisodeSnippet {
  episodeNum: number;
  snippetTitle: string;
  sceneDescription: string;
  isCoinWall: boolean;
  lines: ScriptLine[];
}

export interface EpisodeScript {
  episodeNum: number;
  title: string;
  actualWordCount: number;
  lines: ScriptLine[];                        // Episode 1 script
  multiEpisodeSnippets: MultiEpisodeSnippet[]; // Snippets across Ep 1, Ep 3, Ep 5, Finale
  characterVoiceProfiles: CharacterVoiceProfile[];
  coinWallCliffhangerPositions: number[];
}

// 5. AUDIT REPORT SCHEMA (Safety Auditor Agent)
export interface AuditCheckResult {
  category: 'PG-13 Content Scan' | 'Copyright & Originality' | 'Cultural & Ethical Safety' | 'Cross-Episode Consistency';
  passed: boolean;
  reasoning: string;
  flaggedLines: string[];
}

export interface AuditReport {
  checks: AuditCheckResult[];
  overallApproved: boolean;
}

// 6. LOCALIZATION PACKAGE SCHEMA (Localization Agent - Deep Cultural Adaptation)
export interface LocalizedCharacterName {
  originalName: string;
  localizedName: string;
  culturalNuance: string;
}

export interface AdaptedCulturalIdiom {
  originalPhrase: string;
  localizedIdiom: string;
  culturalContext: string;
}

export interface LocalizedLanguageProfile {
  language: string;
  flag: string;
  translatedTitle: string;
  translatedTagline: string;
  localizedCharacterNames: LocalizedCharacterName[];  // Culturally adapted names
  adaptedCulturalIdioms: AdaptedCulturalIdiom[];      // Adapted idioms & proverbs
  culturallyAdaptedScriptText: string;               // Adapted script scene with local phrasing
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

// 7. PRODUCTION MANIFEST SCHEMA (Production Agent)
export interface AudioLineSegment {
  lineId: string;
  character: string;
  voiceId: string;
  deliveryStyle?: string;
  startTimeOffsetMs: number;
  durationMs: number;
}

export interface AppliedSFXClip {
  sfxCueId: string;
  description: string;
  matchedFile: string;
  timestampMs: number;
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
  episodeNum: number;
  audioFilePath: string;
  totalDurationSeconds: number;
  voiceMapping: Record<string, string>;
  lineSegments: AudioLineSegment[];
  appliedSFX: AppliedSFXClip[];
  missingSFXLogged: string[];
}
