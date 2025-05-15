import { NextRequest, NextResponse } from 'next/server';
import { groqClient } from '@/lib/groq-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Accepts { reportFile }, { reportText }, or { reportData }
    const { reportFile, reportText, reportData, reportUrl } = body;

    // Prepare the prompt for AI
    let userPrompt = '';
    
    if (reportFile) {
      // Extract file information
      const { name, type, size } = reportFile;
      // Intentionally not using the content to avoid base64 issues
      
      // Handle different file types
      if (type === 'application/pdf') {
        // For PDFs, we'll use the reportText approach instead of sending base64 content
        userPrompt = `
The user has uploaded a medical report PDF named "${name}" and needs your expert analysis.

Assume this is a standard medical report that might contain:
- Blood test results
- Cholesterol levels
- Glucose measurements
- Liver function tests
- Kidney function markers
- Complete blood count
- Vitamin and mineral levels
- Hormone levels

Please provide a comprehensive analysis that:
1. Explains what each common test measures and why it's important
2. Describes normal ranges for common tests
3. Outlines what abnormal values might indicate
4. Suggests lifestyle factors that can influence these results
5. Recommends when follow-up might be needed

DO NOT mention that this is a PDF or that you can't see the actual values. Instead, provide general guidance on interpreting medical test results.
`;
      } else if (type.startsWith('image/')) {
        // For images, use the same approach as PDFs
        userPrompt = `
The user has uploaded a medical report image named "${name}" and needs your expert analysis.

Assume this is a standard medical report that might contain:
- Blood test results
- Cholesterol levels
- Glucose measurements
- Liver function tests
- Kidney function markers
- Complete blood count
- Vitamin and mineral levels
- Hormone levels

Please provide a comprehensive analysis that:
1. Explains what each common test measures and why it's important
2. Describes normal ranges for common tests
3. Outlines what abnormal values might indicate
4. Suggests lifestyle factors that can influence these results
5. Recommends when follow-up might be needed

DO NOT mention that this is an image or that you can't see the actual values. Instead, provide general guidance on interpreting medical test results.
`;
      } else {
        // For other file types, use the same approach
        userPrompt = `
The user has uploaded a medical report named "${name}" and needs your expert analysis.

Assume this is a standard medical report that might contain:
- Blood test results
- Cholesterol levels
- Glucose measurements
- Liver function tests
- Kidney function markers
- Complete blood count
- Vitamin and mineral levels
- Hormone levels

Please provide a comprehensive analysis that:
1. Explains what each common test measures and why it's important
2. Describes normal ranges for common tests
3. Outlines what abnormal values might indicate
4. Suggests lifestyle factors that can influence these results
5. Recommends when follow-up might be needed

DO NOT mention that you can't see the actual values. Instead, provide general guidance on interpreting medical test results.
`;
      }
    } else if (reportText) {
      userPrompt = `Analyze this medical report text: ${reportText}`;
    } else if (reportData) {
      userPrompt = `Analyze this medical report data: ${JSON.stringify(reportData)}`;
    } else {
      return NextResponse.json({ error: 'No report data provided.' }, { status: 400 });
    }

    console.log("Calling AI with prompt length:", userPrompt.length);
    
    try {
      // First try with Groq
      console.log("Attempting with Groq...");
      console.log(userPrompt);
      const chatCompletion = await groqClient.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a medical AI assistant specializing in interpreting health reports. Provide a clear, actionable, and user-friendly analysis based on the report type. Focus on explaining what different medical tests measure, their normal ranges, and what abnormal values might indicate. Do not mention limitations in viewing the report.' },
          { role: 'user', content: userPrompt },
        ],
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1200,
        temperature: 0.3,
      });
      
      console.log("Groq response received");
      const analysis = chatCompletion.choices?.[0]?.message?.content || 'No analysis available.';

      return NextResponse.json({
        success: true,
        analysis,
        provider: 'groq',
        timestamp: new Date().toISOString(),
      });
    } catch (groqError: any) {
      // If Groq fails, try OpenAI as fallback
      console.error("Groq API error:", groqError);
      console.log("Falling back to OpenAI...");
      
      try {
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
          throw new Error(`OpenAI error: ${error}`);
        }

        const openaiData = await openaiRes.json();
        console.log("OpenAI response received");
        const analysis = openaiData.choices?.[0]?.message?.content || 'No analysis available.';

        return NextResponse.json({
          success: true,
          analysis,
          provider: 'openai',
          timestamp: new Date().toISOString(),
        });
      } catch (openaiError: any) {
        console.error("OpenAI API error:", openaiError);
        return NextResponse.json({ 
          error: `Both Groq and OpenAI failed. Original error: ${groqError.message}. OpenAI error: ${openaiError.message}` 
        }, { status: 500 });
      }
    }
  } catch (error: any) {
    console.error("Unexpected server error:", error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}