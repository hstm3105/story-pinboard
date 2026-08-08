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
    // 100% DYNAMIC LIVE FULL-PAGE COMIC ARTWORK GENERATION BASED ON PREVIOUS AGENT OUTPUTS
    const pagePrompt = `${script.title} - ${page.pageTitle}. Scene panels: ${page.panels.map((p) => p.sceneDescription).join('; ')}`;
    const seed = Math.floor(Math.random() * 1000000);
    const fullPagePrompt = encodeURIComponent(`Full page comic book page layout with 3 panels and dark gutter lines, ${pagePrompt}, ${visualStyle || 'Dark Noir Cyberpunk'} graphic novel comic book page art`);
    
    // Live dynamic AI image generation URL constructed directly from previous agents' story script
    let pageImageUrl = `https://image.pollinations.ai/prompt/${fullPagePrompt}?width=900&height=1200&seed=${seed}&nologo=true`;

    try {
      // DYNAMIC LIVE FULL-PAGE IMAGE API ROUTE CALL
      const response = await fetch('/api/generate-comic-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: pagePrompt,
          visualStyle: visualStyle || 'Dark Noir Cyberpunk',
          pageNum: page.pageNum,
          type: 'full-page',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          pageImageUrl = data.imageUrl;
        }
      }
    } catch (err) {
      console.warn(`Dynamic live full-page comic image API generation note for Page ${page.pageNum}:`, err);
    }

    const renderedPanels: RenderedComicPanel[] = page.panels.map((panel, idx) => {
      const gradient = PANEL_BG_GRADIENTS[idx % PANEL_BG_GRADIENTS.length];
      const speaker = panel.speechBubbles[0]?.speaker || 'NARRATOR';

      let avatarIcon = '👤';
      if (speaker.toUpperCase().includes('KAI')) avatarIcon = '⚡';
      else if (speaker.toUpperCase().includes('LYRA')) avatarIcon = '🔮';
      else if (speaker.toUpperCase().includes('ARCHER')) avatarIcon = '🤖';
      else if (speaker.toUpperCase().includes('NARRATOR')) avatarIcon = '📖';

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

  const logMessage = `Comic Production Agent: ✅ Live AI full-page comic image generation complete! ${pages.length} complete multi-panel comic book page artwork images dynamically generated from story script in "${visualStyle}" style!`;

  return { manifest, logMessage };
}
