import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, visualStyle, pageNum, panelNum } = body;

    const basePrompt = prompt || 'Cyberpunk technician in rainy slum room holding glowing neural drive';
    const styleModifier = visualStyle || 'Dark Noir Cyberpunk comic book illustration, high contrast, vibrant neon lighting, cinematic graphic novel panel art';

    const fullImagePrompt = encodeURIComponent(`${basePrompt}, ${styleModifier}`);
    const seed = Math.floor(Math.random() * 100000);

    // Dynamic AI Image Generation REST URL (Pollinations AI Engine)
    const imageUrl = `https://image.pollinations.ai/prompt/${fullImagePrompt}?width=800&height=600&seed=${seed}&nologo=true`;

    return NextResponse.json({
      success: true,
      pageNum,
      panelNum,
      imageUrl,
    });
  } catch (error: any) {
    console.error('Error generating comic panel image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate comic panel image' },
      { status: 500 }
    );
  }
}
