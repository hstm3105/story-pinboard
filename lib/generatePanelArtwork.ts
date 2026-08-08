export const FIXED_COMIC_STYLE_BLOCK = 
  "Professional superhero comic book interior page illustration, in the style of a modern Marvel/DC single-issue comic. Hand-inked line art with confident bold outlines, cel-shaded coloring with visible shadow/highlight rendering, dynamic dramatic camera angle, comic panel composition. NOT photorealistic, NOT a 3D render, NOT a digital painting with soft photographic lighting — this must read as illustrated line art with flat/cel color fills, the way printed comic interior art looks. Do not include any speech bubbles, dialogue text, captions, sound effect lettering, or any text of any kind in the image. Pure illustrated artwork only — all dialogue and lettering will be added separately as a distinct layer. Any text or bubble shapes rendered by you will be discarded and are not wanted.";

export function mapPanelStyleToFraming(panelStyle?: string): string {
  switch (panelStyle) {
    case 'close-up':
      return "Tight dramatic close-up, shallow depth of field, focused emotional intensity";
    case 'wide-splash':
      return "Panoramic wide establishing shot, expansive depth of field, high visual scale";
    case 'action-split':
      return "Dynamic diagonal action shot, high-tension motion angle, kinetic energy";
    case 'standard':
    default:
      return "Medium cinematic dialogue shot, balanced composition";
  }
}

export interface PanelArtworkOptions {
  apiKey?: string;
  characterDesignSheet?: string;
  sceneFraming?: string;
  characterAction?: string;
  visualStyle?: string;
  seed?: number;
}

export interface PanelArtworkResult {
  imageUrl: string;
  usedModel: string;
  promptLogged: string;
  errorDetail?: string;
}

export async function generatePanelArtwork(options: PanelArtworkOptions): Promise<PanelArtworkResult> {
  const apiKey = options.apiKey || '';
  const charSheet = options.characterDesignSheet || 'CHARACTERS: Superhero protagonist in detailed tactical armor, dark hair, athletic build.';
  const framing = options.sceneFraming || mapPanelStyleToFraming('standard');
  const action = options.characterAction || 'Character standing ready in dramatic scene';
  const style = options.visualStyle ? `${options.visualStyle}. ${FIXED_COMIC_STYLE_BLOCK}` : FIXED_COMIC_STYLE_BLOCK;

  const fullPrompt = `${framing}. ${action}. Character appearance: ${charSheet}. Style: ${style}`;

  console.log('[SHARED PANEL PROMPT LOGGED]:', fullPrompt);

  let imageUrl = '';
  let usedModel = 'imagen-3.0-generate-002';
  let errorDetail = '';

  if (apiKey && apiKey.trim()) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey.trim()}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: fullPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '4:3',
            outputMimeType: 'image/jpeg',
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
          imageUrl = `data:image/jpeg;base64,${data.predictions[0].bytesBase64Encoded}`;
        }
      } else {
        const errText = await res.text();
        errorDetail = `Imagen API Http ${res.status}: ${errText}`;
        console.warn('[IMAGEN API FALLBACK NOTE]:', errorDetail);
      }
    } catch (err: any) {
      errorDetail = err.message || 'Imagen API request failed';
      console.warn('[IMAGEN API EXCEPTION]:', errorDetail);
    }
  } else {
    errorDetail = 'No Gemini API Key provided in Settings.';
  }

  // Fallback to high-resolution FLUX endpoint with exact same no-text prompt block
  if (!imageUrl) {
    usedModel = 'Pollinations FLUX-Comic (Fallback)';
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const panelSeed = options.seed || Math.floor(Math.random() * 1000000);
    imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${panelSeed}&nologo=true`;
  }

  return {
    imageUrl,
    usedModel,
    promptLogged: fullPrompt,
    errorDetail: errorDetail ? errorDetail : undefined,
  };
}
