import {
  EpisodeScript,
  ProductionManifest,
  RenderedComicPage,
  RenderedComicPanel,
} from './types';

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
  const pages: RenderedComicPage[] = script.pages.map((page) => {
    const renderedPanels: RenderedComicPanel[] = page.panels.map((panel, idx) => {
      const gradient = PANEL_BG_GRADIENTS[idx % PANEL_BG_GRADIENTS.length];
      const speaker = panel.speechBubbles[0]?.speaker?.toUpperCase()?.trim() || 'NARRATOR';

      let avatarIcon = '👤';
      if (speaker.includes('KAI')) avatarIcon = '⚡';
      else if (speaker.includes('LYRA')) avatarIcon = '🔮';
      else if (speaker.includes('ARCHER')) avatarIcon = '🤖';
      else if (speaker.includes('NARRATOR')) avatarIcon = '📖';

      return {
        pageNum: page.pageNum,
        panelNum: panel.panelNum,
        sceneDescription: panel.sceneDescription,
        visualFocusPrompt: panel.visualFocusPrompt,
        bgGradient: gradient,
        avatarIcon,
        speechBubbles: panel.speechBubbles,
        visualSoundFX: panel.visualSoundFX,
        panelStyle: panel.panelStyle,
      };
    });

    return {
      pageNum: page.pageNum,
      pageTitle: page.pageTitle,
      isKeyframeSplashPage: page.isKeyframeSplashPage,
      panels: renderedPanels,
    };
  });

  const manifest: ProductionManifest = {
    issueNum: script.issueNum || 1,
    title: script.title,
    totalPages: pages.length,
    visualStyle,
    pages,
  };

  const totalPanels = pages.reduce((acc, p) => acc + p.panels.length, 0);
  const logMessage = `Comic Production Agent: ✅ Graphic Novel Issue #${manifest.issueNum} published! ${pages.length} pages (${totalPanels} panels) rendered in clean Graphic Text format.`;

  return { manifest, logMessage };
}
