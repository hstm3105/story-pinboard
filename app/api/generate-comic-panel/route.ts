import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, visualStyle, pageNum } = body;

    const basePrompt = prompt || 'Full page comic book layout with panels and gutter lines';
    const styleModifier = visualStyle 
      ? `${visualStyle} graphic novel comic book page style, Marvel DC high-production comic art, Steve Epting inks, cinematic panel layout, dramatic lighting`
      : 'Dark Noir Cyberpunk graphic novel comic book page style, Marvel DC high-production comic art, Steve Epting inks, cinematic panel layout, dramatic lighting';

    const fullPagePrompt = encodeURIComponent(`Full page graphic novel comic book page, ${basePrompt}, ${styleModifier}`);
    const seed = Math.floor(Math.random() * 1000000);

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
