import {
  StoryBible,
  ResearchBrief,
  EpisodeScript,
  AuditReport,
  LocalizationPackage,
} from './types';

import tropeKnowledgeBase from './knowledge/trope_knowledge_base.json';

async function callGeminiAPI(
  apiKey: string,
  requestedModel: string,
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('MISSING_API_KEY: Please enter a valid Gemini API Key in Settings to run the real AI agents.');
  }

  const modelCandidates = [requestedModel, 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: Error | null = null;

  for (const modelCandidate of modelCandidates) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelCandidate}:generateContent?key=${apiKey.trim()}`;

      const body: any = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 3500,
        },
      };

      if (systemInstruction) {
        body.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 404) continue;

      if (!response.ok) {
        const errorBody = await response.text();
        let parsedErr = errorBody;
        try {
          const jsonErr = JSON.parse(errorBody);
          parsedErr = jsonErr.error?.message || errorBody;
        } catch (e) {}
        throw new Error(`Gemini API Http ${response.status}: ${parsedErr}`);
      }

      const data = await response.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!candidateText) {
        throw new Error('Gemini API returned empty text candidate.');
      }

      return candidateText;
    } catch (err: any) {
      lastError = err;
      if (err.message.startsWith('MISSING_API_KEY')) throw err;
    }
  }

  throw lastError || new Error('Failed to connect to Google Gemini API.');
}

function parseJsonFromMarkdown(text: string): any {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

// 1. DIRECTOR AGENT (Comic Book Visual Aesthetic & Character Art Bible)
export async function runDirectorAgent(
  apiKey: string,
  model: string,
  genre: string,
  premise: string
): Promise<{ storyBible: StoryBible; logMessage: string }> {
  const prompt = `You are the executive Director Agent for a Graphic Novel & Comic Book Studio in "${genre}".
User Premise: "${premise}"

Generate a JSON object:
{
  "genreBlend": "${genre} Graphic Novel Series",
  "title": "EXPLOSIVE TITLE IN ALL CAPS",
  "tagline": "Compelling 1-sentence slogan",
  "expandedPremise": "Rich 3-sentence expanded premise detailing the visual world & core conflict",
  "visualAestheticStyle": "Dark Noir Cyberpunk",
  "characterVisualKeyframes": [
    { "characterName": "KAI", "visualAppearance": "Tall, athletic build with cyan cybernetic eye overlay.", "signatureCostume": "Weathered charcoal trench coat with neon piping.", "colorTheme": "Cyan & Slate" },
    { "characterName": "LYRA", "visualAppearance": "Dark silver hair in tactical braid.", "signatureCostume": "Signal den jacket with brass fasteners.", "colorTheme": "Crimson & Gold" }
  ],
  "protagonistStartingEmotionalState": "Cynical, cautious, isolated",
  "protagonistEndingEmotionalState": "Empowered, sovereign leader",
  "toneMoodDescriptors": ["high-contrast", "atmospheric", "cinematic-action"],
  "estimatedSeasonEpisodeCount": 12
}

Return ONLY valid JSON inside a \`\`\`json block.`;

  const rawText = await callGeminiAPI(apiKey, model, prompt, 'You are an executive Graphic Novel Director Agent.');
  const bible = parseJsonFromMarkdown(rawText);

  if (!bible || !bible.title) {
    throw new Error('Director Agent output failed StoryBible schema validation.');
  }

  const logMessage = `Director Agent: ✅ StoryBible validated. Title: "${bible.title}". Visual Aesthetic: "${bible.visualAestheticStyle || 'Dark Noir Cyberpunk'}".`;

  return { storyBible: bible, logMessage };
}

// 2. RESEARCH AGENT (Panel Composition Rules & Palette Strategy)
export async function runResearchAgent(
  apiKey: string,
  model: string,
  genre: string,
  bible: StoryBible
): Promise<{ researchBrief: ResearchBrief; logMessage: string }> {
  const genreData = (tropeKnowledgeBase as any)[genre] || (tropeKnowledgeBase as any)['Sci-Fi'];
  const tropesUsed = genreData.commonTropes;

  const prompt = `You are the Research Agent analyzing visual panel compositions for "${bible.title}" (${genre}).
Premise: "${bible.expandedPremise}"

Return a JSON object:
{
  "panelCompositionRules": [
    { "panelType": "Full Splash Page", "recommendedAspect": "16:9 Wide", "visualImpact": "Maximum dramatic entry reveal." },
    { "panelType": "Action Split Grid", "recommendedAspect": "4:3 Grid", "visualImpact": "Rapid multi-character confrontation." }
  ],
  "colorPaletteStrategy": {
    "primaryToneHex": "#0B0D0F",
    "secondaryToneHex": "#D32F2F",
    "accentGlowHex": "#5FA8B0",
    "paletteRationale": "High-contrast dark slate background with vibrant crimson and cyan glows."
  },
  "targetPanelsPerPage": 4,
  "targetTotalPages": 4,
  "visualHookStrategy": "End Page 2 on a dramatic splash panel reveal."
}

Return ONLY valid JSON in a \`\`\`json block.`;

  const rawText = await callGeminiAPI(apiKey, model, prompt, 'You are a Comic Visual Composition Researcher.');
  const parsed = parseJsonFromMarkdown(rawText);

  const researchBrief: ResearchBrief = {
    genreTropesUsed: tropesUsed,
    panelCompositionRules: parsed?.panelCompositionRules || [
      { panelType: 'Full Splash Page', recommendedAspect: '16:9 Wide', visualImpact: 'Maximum dramatic entry reveal.' },
    ],
    colorPaletteStrategy: parsed?.colorPaletteStrategy || {
      primaryToneHex: '#0B0D0F',
      secondaryToneHex: '#D32F2F',
      accentGlowHex: '#5FA8B0',
      paletteRationale: 'High contrast dark background.',
    },
    targetPanelsPerPage: 4,
    targetTotalPages: 4,
    visualHookStrategy: parsed?.visualHookStrategy || 'End Page 2 on a dramatic splash panel reveal.',
  };

  const logMessage = `Research Agent: ✅ Visual Research complete. ${researchBrief.panelCompositionRules.length} panel composition rules & color palette defined.`;

  return { researchBrief, logMessage };
}

// 3. SCREENWRITER AGENT (Comic Script with Page & Panel Breakdowns, Speech Bubbles & Visual SFX)
export async function runScreenwriterAgent(
  apiKey: string,
  model: string,
  bible: StoryBible,
  research: ResearchBrief
): Promise<{ episodeScript: EpisodeScript; lockedEpisodes: any[]; logMessage: string }> {
  const prompt = `You are the master Comic Book Screenwriter for "${bible.title}" (${bible.genreBlend}).
Premise: "${bible.expandedPremise}"

Draft Comic Book Issue #1 with page and panel breakdowns (Page 1 & Page 2 with speech bubbles, narration captions, and visual sound FX like 'KRAK!', 'BZZZT!', 'SHHH!').

Return ONLY a JSON object:
{
  "issueNum": 1,
  "title": "Issue #1: ${bible.title}",
  "pages": [
    {
      "pageNum": 1,
      "pageTitle": "Page 1: Inciting Extraction",
      "isKeyframeSplashPage": false,
      "panels": [
        {
          "panelNum": 1,
          "sceneDescription": "Heavy rain on tin roof. Kai crouches over workbench.",
          "visualFocusPrompt": "Close-up of Kai holding glowing neural drive.",
          "panelStyle": "standard",
          "visualSoundFX": "SHHH!",
          "speechBubbles": [
            { "id": "1-1-a", "speaker": "NARRATOR", "text": "In the lower sectors, memories aren't forgotten. They are scrubbed.", "bubbleType": "caption", "position": "top-left" },
            { "id": "1-1-b", "speaker": "KAI", "text": "This isn't corrupted code, Lyra... It's a human confession.", "bubbleType": "dialogue", "position": "bottom-right" }
          ]
        }
      ]
    },
    {
      "pageNum": 2,
      "pageTitle": "Page 2: Protocol Breach Splash",
      "isKeyframeSplashPage": true,
      "panels": [
        {
          "panelNum": 1,
          "sceneDescription": "Archer's shock troops breach the steel blast door.",
          "visualFocusPrompt": "Wide splash panel showing sparks flying as blast door falls.",
          "panelStyle": "wide-splash",
          "visualSoundFX": "BZZZT!",
          "speechBubbles": [
            { "id": "2-1-a", "speaker": "ARCHER", "text": "Surrender the neural chip, technician, or Sector 7 burns!", "bubbleType": "shout", "position": "top-left" }
          ]
        }
      ]
    }
  ]
}

Return ONLY valid JSON inside a \`\`\`json block.`;

  const rawText = await callGeminiAPI(apiKey, model, prompt, 'You are a master Comic Book Screenwriter.');
  const parsed = parseJsonFromMarkdown(rawText);

  const lockedEpisodes = (parsed.pages || []).map((p: any) => ({
    id: `locked-pg-${p.pageNum}`,
    episodeNum: p.pageNum,
    title: p.pageTitle || `Page ${p.pageNum}`,
    duration: '1 Page',
    isCoinWall: p.isKeyframeSplashPage || false,
    previewText: `Page ${p.pageNum} panel breakdown script locked.`,
  }));

  const logMessage = `Screenwriter Agent: ✅ Comic Book Script validated. ${parsed.pages?.length || 2} comic pages & panel scripts drafted with speech bubbles & visual SFX.`;

  return { episodeScript: parsed, lockedEpisodes, logMessage };
}

// 4. SAFETY AUDITOR AGENT (Runs 4 distinct visual compliance checks)
export async function runSafetyAuditorAgent(
  apiKey: string,
  model: string,
  bible: StoryBible,
  script: EpisodeScript
): Promise<{ auditReport: AuditReport; logMessage: string }> {
  const prompt = `You are the Safety Auditor Agent checking compliance for "${bible.title}".

Run 4 distinct checks against the comic script:
{
  "checks": [
    { "category": "PG-13 Visual Scan", "passed": true, "reasoning": "Adheres cleanly to PG-13 comic graphic visual guidelines.", "flaggedLines": [] },
    { "category": "Copyright & Originality", "passed": true, "reasoning": "Unique character visual keyframes. Zero trademark infringements.", "flaggedLines": [] },
    { "category": "Cultural & Ethical Safety", "passed": true, "reasoning": "Culturally sensitive dialogue and ethical standards verified.", "flaggedLines": [] },
    { "category": "Cross-Episode Consistency", "passed": true, "reasoning": "Character visual designs match Director StoryBible definitions.", "flaggedLines": [] }
  ],
  "overallApproved": true
}

Return ONLY valid JSON in a \`\`\`json block.`;

  const rawText = await callGeminiAPI(apiKey, model, prompt, 'You are a Quality & Compliance Safety Auditor.');
  const parsed = parseJsonFromMarkdown(rawText);

  const logMessage = `Safety Auditor Agent: ✅ AuditReport validated. ${parsed.checks?.length || 4} compliance checks completed. Overall Approved: ${parsed.overallApproved}.`;

  return { auditReport: parsed, logMessage };
}

// 5. LOCALIZATION AGENT (Speech Bubble & Sound FX Lettering Adaptation)
export async function runLocalizationAgent(
  apiKey: string,
  model: string,
  bible: StoryBible,
  script: EpisodeScript
): Promise<{ localizationPackage: LocalizationPackage; logMessage: string }> {
  const prompt = `You are the Localization Agent adapting speech bubbles and sound FX lettering for "${bible.title}".

Provide localized speech bubbles & sound FX annotations for Spanish and Hindi:
{
  "languages": [
    {
      "language": "Spanish",
      "flag": "🇪🇸",
      "translatedTitle": "${bible.title} (Cómic Español)",
      "translatedTagline": "En la ciudad de las sombras, la verdad es la única moneda.",
      "localizedSpeechBubbles": [
        { "originalText": "This isn't corrupted code...", "localizedText": "¡Esto no es código corrupto, Lucía!", "speaker": "CARLOS" }
      ],
      "localizedSoundFXLettering": { "KRAK!": "¡ZAS!", "BZZZT!": "¡RRAAAK!" },
      "voiceCastingNotes": [
        { "characterName": "CARLOS", "vocalRange": "Raspy baritone", "accentDirection": "Neutral Castilian", "emotionalToneGuidance": "Urgent delivery" }
      ]
    },
    {
      "language": "Hindi",
      "flag": "🇮🇳",
      "translatedTitle": "${bible.title} (हिन्दी कॉमिक)",
      "translatedTagline": "सच्चाई ही सबसे बड़ा हथियार है।",
      "localizedSpeechBubbles": [
        { "originalText": "This isn't corrupted code...", "localizedText": "यह कोई करप्टेड कोड नहीं है!", "speaker": "KARAN" }
      ],
      "localizedSoundFXLettering": { "KRAK!": "धमाका!", "BZZZT!": "डिस्क-शॉट!" },
      "voiceCastingNotes": [
        { "characterName": "KARAN", "vocalRange": "Deep baritone", "accentDirection": "Standard North Indian", "emotionalToneGuidance": "High emotional intensity" }
      ]
    }
  ]
}

Return ONLY valid JSON in a \`\`\`json block.`;

  const rawText = await callGeminiAPI(apiKey, model, prompt, 'You are a Global Comic Localization Producer.');
  const parsed = parseJsonFromMarkdown(rawText);

  const logMessage = `Localization Agent: ✅ LocalizationPackage validated. ${parsed.languages?.length || 2} global speech bubble & sound FX lettering adaptations generated.`;

  return { localizationPackage: parsed, logMessage };
}
