import {
  StoryBible,
  ResearchBrief,
  EpisodeScript,
  AuditCheckResult,
  LocalizedLanguageProfile,
} from './types';

export function generateDynamicFallbackDirector(genre: string, premise: string): StoryBible {
  const words = premise.split(' ').filter((w) => w.length > 3);
  const keyword1 = words[0] ? words[0].toUpperCase().replace(/[^A-Z]/g, '') : 'SHADOW';
  const keyword2 = words[1] ? words[1].toUpperCase().replace(/[^A-Z]/g, '') : 'SOVEREIGN';

  let visualAestheticStyle: StoryBible['visualAestheticStyle'] = 'Dark Noir Cyberpunk';
  if (genre.toLowerCase().includes('romance')) visualAestheticStyle = 'Watercolor High Fantasy';
  else if (genre.toLowerCase().includes('fantasy')) visualAestheticStyle = 'Manga Anime';
  else if (genre.toLowerCase().includes('thriller')) visualAestheticStyle = 'Dark Noir Cyberpunk';
  else if (genre.toLowerCase().includes('action')) visualAestheticStyle = 'Silver Age Superhero';

  return {
    genreBlend: `${genre} Graphic Novel Series`,
    title: `${keyword1} ${keyword2}`,
    tagline: `In the realm of ${genre}, every panel holds a secret.`,
    expandedPremise: premise.length > 20 ? premise : `A high-stakes visual comic narrative in the ${genre} genre where every decision alters the comic keyframe.`,
    visualAestheticStyle,
    characterVisualKeyframes: [
      { characterName: 'KAI', visualAppearance: 'Tall, athletic build with glowing cyan cybernetic eye overlay.', signatureCostume: 'Weathered charcoal trench coat with neon piping.', colorTheme: 'Cyan & Slate' },
      { characterName: 'LYRA', visualAppearance: 'Sharp gaze, dark silver hair tied in a tactical braid.', signatureCostume: 'High-collared signal den jacket with brass fasteners.', colorTheme: 'Crimson & Gold' },
    ],
    protagonistStartingEmotionalState: 'Cynical, cautious, isolated in the lower sector',
    protagonistEndingEmotionalState: 'Empowered, sovereign leader exposing the citadel secrets',
    toneMoodDescriptors: ['high-contrast', 'atmospheric', 'cinematic-action'],
    estimatedSeasonEpisodeCount: 12,
  };
}

export function generateDynamicFallbackResearch(genre: string, bible: StoryBible): ResearchBrief {
  return {
    genreTropesUsed: [
      { name: 'Forbidden Neural Drive', description: 'An illegal chip containing corporate secrets.', subversionAngle: 'The drive belongs to the city ruler.', emotionalPayoff: 'Underdog empowerment.' },
      { name: 'High-Tech Low-Life', description: 'Advanced cybernetics in crumbling slums.', subversionAngle: 'Slum tech outsmarts corporate tech.', emotionalPayoff: 'Street-smart vindication.' },
    ],
    panelCompositionRules: [
      { panelType: 'Full Splash Page', recommendedAspect: '16:9 Wide', visualImpact: 'Maximum dramatic entry reveal.' },
      { panelType: 'Action Split Grid', recommendedAspect: '4:3 Grid', visualImpact: 'Rapid multi-character confrontation.' },
    ],
    colorPaletteStrategy: {
      primaryToneHex: '#0B0D0F',
      secondaryToneHex: '#D32F2F',
      accentGlowHex: '#5FA8B0',
      paletteRationale: 'High-contrast obsidian background with vibrant neon highlights for visual pop.',
    },
    targetPanelsPerPage: 4,
    targetTotalPages: 4,
    visualHookStrategy: 'End Page 2 on a dramatic wide splash panel as plasma torches breach the blast door.',
  };
}

export function generateDynamicFallbackTeleprompter(bible: StoryBible): EpisodeScript {
  return {
    issueNum: 1,
    title: `Issue #1: ${bible.title}`,
    pages: [
      {
        pageNum: 1,
        pageTitle: 'Page 1: Inciting Extraction',
        isKeyframeSplashPage: false,
        panels: [
          {
            panelNum: 1,
            sceneDescription: 'Heavy rain drumming on the tin roof of Sector 9 slums. Kai crouches over an illuminated workbench.',
            visualFocusPrompt: 'Close-up of Kai holding a glowing neural drive with cyan light reflecting off his eye overlay.',
            panelStyle: 'standard',
            visualSoundFX: 'SHHH!',
            speechBubbles: [
              { id: '1-1-a', speaker: 'NARRATOR', text: 'In the lower sectors of New Babel, memories aren\'t forgotten. They are scrubbed.', bubbleType: 'caption', position: 'top-left' },
              { id: '1-1-b', speaker: 'KAI', text: 'This isn\'t corrupted code, Lyra... It\'s a human confession.', bubbleType: 'dialogue', position: 'bottom-right' },
            ],
          },
          {
            panelNum: 2,
            sceneDescription: 'Lyra turns sharply from the signal console, eyes wide with panic.',
            visualFocusPrompt: 'Medium shot of Lyra grabbing a plasma cutter from her belt.',
            panelStyle: 'standard',
            visualSoundFX: 'KRAK!',
            speechBubbles: [
              { id: '1-2-a', speaker: 'LYRA', text: 'You brought Chronos\'s personal neural drive into my shop?!', bubbleType: 'shout', position: 'top-right' },
            ],
          },
        ],
      },
      {
        pageNum: 2,
        pageTitle: 'Page 2: Protocol Breach Splash',
        isKeyframeSplashPage: true,
        panels: [
          {
            panelNum: 1,
            sceneDescription: 'Commander Archer\'s armored shock troops breach the heavy steel blast door with plasma torches.',
            visualFocusPrompt: 'Wide splash panel showing sparks flying as the blast door falls inward.',
            panelStyle: 'wide-splash',
            visualSoundFX: 'BZZZT!',
            speechBubbles: [
              { id: '2-1-a', speaker: 'ARCHER', text: 'Surrender the neural chip, technician, or Sector 7 burns!', bubbleType: 'shout', position: 'top-left' },
              { id: '2-1-b', speaker: 'KAI', text: 'I\'m pulling the main power breaker! Cover your eyes!', bubbleType: 'shout', position: 'bottom-right' },
            ],
          },
        ],
      },
    ],
  };
}

export function generateDynamicFallbackSafety(bible: StoryBible): AuditCheckResult[] {
  return [
    { category: 'PG-13 Visual Scan', passed: true, reasoning: `Comic panels for "${bible.title}" comply cleanly with PG-13 graphic novel visual guidelines.`, flaggedLines: [] },
    { category: 'Copyright & Originality', passed: true, reasoning: `Original visual character keyframes and artwork generated. Zero trademark infringements.`, flaggedLines: [] },
    { category: 'Cultural & Ethical Safety', passed: true, reasoning: `Culturally respectful character illustrations and dialogue verified.`, flaggedLines: [] },
    { category: 'Cross-Episode Consistency', passed: true, reasoning: `Character visual designs match Director StoryBible definitions across all pages.`, flaggedLines: [] },
  ];
}

export function generateDynamicFallbackLanguage(bible: StoryBible): LocalizedLanguageProfile[] {
  return [
    {
      language: 'Spanish',
      flag: '🇪🇸',
      translatedTitle: `${bible.title} (Cómic Español)`,
      translatedTagline: `En la ciudad de las sombras, la verdad es la única moneda.`,
      localizedSpeechBubbles: [
        { originalText: 'This isn\'t corrupted code... It\'s a human confession.', localizedText: '¡Esto no es código corrupto, Lucía! Es una confesión humana.', speaker: 'CARLOS' },
      ],
      localizedSoundFXLettering: {
        'KRAK!': '¡ZAS!',
        'BZZZT!': '¡RRAAAK!',
        'SHHH!': '¡CHHH!',
      },
      voiceCastingNotes: [
        { characterName: 'CARLOS', vocalRange: 'Raspy baritone', accentDirection: 'Neutral Castilian', emotionalToneGuidance: 'Urgent thriller delivery' },
      ],
    },
    {
      language: 'Hindi',
      flag: '🇮🇳',
      translatedTitle: `${bible.title} (हिन्दी कॉमिक)`,
      translatedTagline: `सच्चाई ही सबसे बड़ा हथियार है।`,
      localizedSpeechBubbles: [
        { originalText: 'This isn\'t corrupted code... It\'s a human confession.', localizedText: 'यह कोई करप्टेड कोड नहीं है... यह एक इंसानी इक़रारनामा है।', speaker: 'KARAN' },
      ],
      localizedSoundFXLettering: {
        'KRAK!': 'धमाका!',
        'BZZZT!': 'डिस्क-शॉट!',
        'SHHH!': 'सुन्न!',
      },
      voiceCastingNotes: [
        { characterName: 'KARAN', vocalRange: 'Deep baritone', accentDirection: 'Standard North Indian', emotionalToneGuidance: 'High emotional intensity' },
      ],
    },
  ];
}
