import { NextRequest, NextResponse } from 'next/server';
import { generatePanelArtwork } from '@/lib/generatePanelArtwork';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, characterDesignSheet, sceneFraming, characterAction, visualStyle, seed } = body;

    const userApiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

    const result = await generatePanelArtwork({
      apiKey: userApiKey,
      characterDesignSheet,
      sceneFraming,
      characterAction,
      visualStyle,
      seed,
    });

    return NextResponse.json({
      success: true,
      usedModel: result.usedModel,
      promptLogged: result.promptLogged,
      errorDetail: result.errorDetail,
      imageUrl: result.imageUrl,
    });
  } catch (error: any) {
    console.error('Error generating benchmark panel:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate benchmark panel' },
      { status: 500 }
    );
  }
}
