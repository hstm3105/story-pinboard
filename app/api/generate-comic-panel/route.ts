import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, visualStyle, pageNum, type } = body;

    const basePrompt = prompt || 'Full page comic book layout with panels and gutter lines';
    const styleModifier = visualStyle || 'Dark Noir Cyberpunk comic book illustration, high contrast, vibrant neon lighting, professional graphic novel page art';

    const fullPagePrompt = encodeURIComponent(`Full page comic book page layout with panels and dark gutter lines, ${basePrompt}, ${styleModifier}`);
    const seed = Math.floor(Math.random() * 100000);

    // Dynamic AI Full-Page Comic Image Generation REST URL
    const imageUrl = `https://image.pollinations.ai/prompt/${fullPagePrompt}?width=900&height=1200&seed=${seed}&nologo=true`;

    return NextResponse.json({
      success: true,
      pageNum,
      imageUrl,
    });
  } catch (error: any) {
    console.error('Error generating full comic page image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate full comic page image' },
      { status: 500 }
    );
  }
}
