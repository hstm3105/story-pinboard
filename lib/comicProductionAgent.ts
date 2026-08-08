import {
  EpisodeScript,
  ProductionManifest,
  RenderedComicPage,
  RenderedComicPanel,
} from './types';

import {
  generatePanelArtwork,
  mapPanelStyleToFraming,
} from './generatePanelArtwork';

const PANEL_BG_GRADIENTS = [
  'from-slate-900 via-purple-950 to-slate-900',
  'from-slate-900 via-cyan-950 to-charcoal',
  'from-charcoal via-amber-950 to-slate-900',
  'from-slate-900 via-rose-950 to-charcoal',
  'from-slate-950 via-indigo-950 to-slate-900',
];

export async function runComicProductionAgent(
  script: EpisodeScript,
  visualStyle: string,
  apiKey?: string
): Promise<{ manifest: ProductionManifest; logMessage: string }> {
  const pages: RenderedComicPage[] = [];

  // CHARACTER DESIGN SHEETS: Built once per named character and reused VERBATIM across all panels
  const characterDesignSheets: Record<string, string> = {};

  // Build character design sheets for primary speakers
  script.pages.forEach((page) => {
    page.panels.forEach((panel) => {
      panel.speechBubbles.forEach((sb) => {
        const speaker = sb.speaker.toUpperCase().trim();
        if (speaker && speaker !== 'NARRATOR' && !characterDesignSheets[speaker]) {
          let desc = `${speaker}: Superhero protagonist with athletic build, distinctive tactical outfit, expressive eyes, and heroic posture.`;
          if (speaker.includes('KAI')) {
            desc = `KAI: Male cyberpunk technician, athletic build, short dark messy hair with cyan cybernetic eye overlay, dark grey tactical jacket over black armor, glowing cyan neural wrist gauge.`;
          } else if (speaker.includes('LYRA')) {
            desc = `LYRA: Female signal strategist, silver-braided hair, dark indigo leather vest, gold brass comms ear piece, high-contrast tactical gear.`;
          } else if (speaker.includes('ARCHER')) {
            desc = `ARCHER: Cybernetic commander, heavy obsidian power armor, glowing red visor, tactical shoulders.`;
          }
          characterDesignSheets[speaker] = desc;
        }
      });
    });
  });

  // Default character design sheet if none found
  const defaultCharSheet = "KAI: Male superhero protagonist in tactical armor with cybernetic details.";

  for (const page of script.pages) {
    const renderedPanels: RenderedComicPanel[] = [];

    for (let idx = 0; idx < page.panels.length; idx++) {
      const panel = page.panels[idx];
      const gradient = PANEL_BG_GRADIENTS[idx % PANEL_BG_GRADIENTS.length];
      const speaker = panel.speechBubbles[0]?.speaker?.toUpperCase()?.trim() || 'NARRATOR';

      let avatarIcon = '👤';
      if (speaker.includes('KAI')) avatarIcon = '⚡';
      else if (speaker.includes('LYRA')) avatarIcon = '🔮';
      else if (speaker.includes('ARCHER')) avatarIcon = '🤖';
      else if (speaker.includes('NARRATOR')) avatarIcon = '📖';

      // Reused verbatim character design sheet
      const charSheet = characterDesignSheets[speaker] || defaultCharSheet;

      // Derived framing from panel.panelStyle
      const framing = mapPanelStyleToFraming(panel.panelStyle);

      // Derived action from panel.sceneDescription & panel.visualFocusPrompt
      const action = `${panel.sceneDescription}. ${panel.visualFocusPrompt}`;

      const panelSeed = page.pageNum * 100 + panel.panelNum;

      // GENERATE ARTWORK PER PANEL USING SHARED ENGINE
      const result = await generatePanelArtwork({
        apiKey,
        characterDesignSheet: charSheet,
        sceneFraming: framing,
        characterAction: action,
        visualStyle,
        seed: panelSeed,
      });

      renderedPanels.push({
        pageNum: page.pageNum,
        panelNum: panel.panelNum,
        sceneDescription: panel.sceneDescription,
        visualFocusPrompt: panel.visualFocusPrompt,
        bgGradient: gradient,
        avatarIcon,
        speechBubbles: panel.speechBubbles,
        visualSoundFX: panel.visualSoundFX,
        panelStyle: panel.panelStyle,
        imageUrl: result.imageUrl, // POPULATE PER-PANEL IMAGE URL
      });
    }

    // Optional page-level fallback
    const pageImageUrl = renderedPanels[0]?.imageUrl;

    pages.push({
      pageNum: page.pageNum,
      pageTitle: page.pageTitle,
      isKeyframeSplashPage: page.isKeyframeSplashPage,
      pageImageUrl,
      panels: renderedPanels,
    });
  }

  const manifest: ProductionManifest = {
    issueNum: script.issueNum || 1,
    title: script.title,
    totalPages: pages.length,
    visualStyle,
    pages,
  };

  const totalPanels = pages.reduce((acc, p) => acc + p.panels.length, 0);
  const logMessage = `Comic Production Agent: ✅ Per-panel artwork generation complete! ${totalPanels} panels rendered with verbatim character design sheets in "${visualStyle}" style!`;

  return { manifest, logMessage };
}
