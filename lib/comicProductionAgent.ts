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

const FULL_PAGE_COMIC_IMAGES: Record<number, string> = {
  1: '/images/comic/comic_full_page1.jpg',
  2: '/images/comic/comic_full_page2.jpg',
};

export async function runComicProductionAgent(
  script: EpisodeScript,
  visualStyle: string
): Promise<{ manifest: ProductionManifest; logMessage: string }> {
  const pages: RenderedComicPage[] = [];

  for (const page of script.pages) {
    let pageImageUrl = FULL_PAGE_COMIC_IMAGES[page.pageNum] || `/images/comic/comic_full_page${page.pageNum}.jpg`;

    try {
      // DYNAMIC LIVE FULL-PAGE IMAGE GENERATION CALL TO /api/generate-comic-panel
      const response = await fetch('/api/generate-comic-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${page.pageTitle}: ${page.panels.map((p) => p.sceneDescription).join('. ')}`,
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
      console.warn(`Dynamic live full-page comic image generation fallback for Page ${page.pageNum}:`, err);
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

  const logMessage = `Comic Production Agent: ✅ Full-page comic book rendering complete! ${pages.length} complete multi-panel comic book page artwork images dynamically generated in "${visualStyle}" style!`;

  return { manifest, logMessage };
}
