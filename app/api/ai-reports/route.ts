import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Accepts either { reportImage }, { reportText }, or { reportData }
    const { reportImage, reportText, reportData } = body;

    // Prepare the prompt for OpenAI
    let userPrompt = '';
    if (reportImage) {
      userPrompt = `Analyze this medical report image: ${reportImage}`;
    } else if (reportText) {
      userPrompt = `Analyze this medical report text: ${reportText}`;
    } else if (reportData) {
      userPrompt = `Analyze this medical report data: ${JSON.stringify(reportData)}`;
    } else {
      return NextResponse.json({ error: 'No report data provided.' }, { status: 400 });
    }

    console.log("Calling OpenAI with:", userPrompt);

    // Call OpenAI API
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'You are a medical AI assistant. Provide a clear, actionable, and user-friendly analysis of the following medical report.' },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 1200,
        temperature: 0.3,
      }),
    });

    if (!openaiRes.ok) {
      const error = await openaiRes.text();
      return NextResponse.json({ error: `OpenAI error: ${error}` }, { status: 500 });
    }

    const openaiData = await openaiRes.json();
    console.log("OpenAI response:", openaiData);
    const analysis = openaiData.choices?.[0]?.message?.content || 'No analysis available.';

    return NextResponse.json({
      success: true,
      analysis,
      raw: openaiData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
} 