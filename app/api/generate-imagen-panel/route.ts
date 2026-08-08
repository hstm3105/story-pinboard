import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, characterDesignSheet, sceneFraming, characterAction, visualStyle } = body;

    const userApiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

    // MANDATORY FIXED STYLE BLOCK REQUIRED BY SPEC
    const FIXED_STYLE_BLOCK = "Professional superhero comic book interior page illustration, in the style of a modern Marvel/DC single-issue comic. Hand-inked line art with confident bold outlines, cel-shaded coloring with visible shadow/highlight rendering, dynamic dramatic camera angle, comic panel composition. NOT photorealistic, NOT a 3D render, NOT a digital painting with soft photographic lighting — this must read as illustrated line art with flat/cel color fills, the way printed comic interior art looks.";

    // CHARACTER DESIGN SHEET (REUSED VERBATIM PER SPEC)
    const CHAR_SHEET = characterDesignSheet || "KAI: Male cyberpunk technician, athletic build, short dark messy hair with cyan cybernetic eye overlay, dark grey tactical jacket over black armor, glowing cyan neural wrist gauge.";

    // CAMERA / FRAMING DIRECTION PER SPEC
    const FRAMING = sceneFraming || "Dramatic low-angle medium close-up, 45-degree angle lighting";

    const ACTION = characterAction || "Kai holding up a glowing cyan neural drive in astonishment in a dark rainy slum workshop room";

    const fullPrompt = `${FRAMING}. ${ACTION}. Character appearance: ${CHAR_SHEET}. Style: ${FIXED_STYLE_BLOCK}`;

    console.log('[IMAGEN-3 PANEL PROMPT LOGGED]:', fullPrompt);

    let imageUrl = '';
    let usedModel = 'imagen-3.0-generate-002';
    let errorDetail = '';

    if (userApiKey && userApiKey.trim()) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${userApiKey.trim()}`;
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

    // High-quality fallback if Imagen endpoint is unprovisioned for key
    if (!imageUrl) {
      usedModel = 'Pollinations FLUX-Comic (Fallback - Imagen API key check failed)';
      const encodedPrompt = encodeURIComponent(fullPrompt);
      const seed = Math.floor(Math.random() * 1000000);
      imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${seed}&nologo=true`;
    }

    return NextResponse.json({
      success: true,
      usedModel,
      promptLogged: fullPrompt,
      errorDetail: errorDetail ? errorDetail : undefined,
      imageUrl,
    });
  } catch (error: any) {
    console.error('Error generating single benchmark panel:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate benchmark panel' },
      { status: 500 }
    );
  }
}
