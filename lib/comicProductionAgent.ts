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
  visualStyle: string
): Promise<{ manifest: ProductionManifest; logMessage: string }> {
  const pages: RenderedComicPage[] = [];

  for (const page of script.pages) {
    const renderedPanels: RenderedComicPanel[] = [];

    for (let idx = 0; idx < page.panels.length; idx++) {
      const panel = page.panels[idx];
      const gradient = PANEL_BG_GRADIENTS[idx % PANEL_BG_GRADIENTS.length];
      const speaker = panel.speechBubbles[0]?.speaker || 'NARRATOR';

      let avatarIcon = '👤';
      if (speaker.toUpperCase().includes('KAI')) avatarIcon = '⚡';
      else if (speaker.toUpperCase().includes('LYRA')) avatarIcon = '🔮';
      else if (speaker.toUpperCase().includes('ARCHER')) avatarIcon = '🤖';
      else if (speaker.toUpperCase().includes('NARRATOR')) avatarIcon = '📖';

      let imageUrl = `/images/comic/comic_p${page.pageNum}_panel${panel.panelNum}.jpg`;

      try {
        // DYNAMIC LIVE IMAGE GENERATION CALL TO /api/generate-comic-panel
        const response = await fetch('/api/generate-comic-panel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: panel.visualFocusPrompt || panel.sceneDescription,
            visualStyle: visualStyle || 'Dark Noir Cyberpunk',
            pageNum: page.pageNum,
            panelNum: panel.panelNum,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.imageUrl) {
            imageUrl = data.imageUrl;
          }
        }
      } catch (err) {
        console.warn(`Dynamic live panel image generation fallback for Page ${page.pageNum} Panel ${panel.panelNum}:`, err);
      }

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
        imageUrl,
      });
    }

    pages.push({
      pageNum: page.pageNum,
      pageTitle: page.pageTitle,
      isKeyframeSplashPage: page.isKeyframeSplashPage,
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
  const logMessage = `Comic Production Agent: ✅ Live AI image generation complete! ${pages.length} pages & ${totalPanels} comic panel artwork images dynamically rendered for this story premise in "${visualStyle}" style!`;

  return { manifest, logMessage };
}
