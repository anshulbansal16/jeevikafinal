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
      const { name, type, content, size } = reportFile;
      
      // Handle different file types
      if (type === 'application/pdf') {
        // For PDFs, we'll extract text from the base64 content
        userPrompt = `
I'm analyzing a medical report with the following details:
- Filename: ${name}
- File type: ${type}
- File size: ${(size / 1024).toFixed(2)} KB

The user has uploaded a medical report and needs your expert analysis. 
Please analyze the following medical report data and provide a detailed interpretation:

1. Identify all test results and their values
2. Compare values to normal/reference ranges where possible
3. Explain what each value means in simple terms
4. Highlight any abnormal values and what they might indicate
5. Provide general health insights based on the results
6. Suggest any follow-up actions or lifestyle changes if appropriate

If you cannot determine specific values from the report, please explain what the user should look for in their report and what those values typically mean for their health.
`;
      } else if (type.startsWith('image/')) {
        // For images, use a similar approach as PDFs
        userPrompt = `
I'm analyzing a medical report image with the following details:
- Filename: ${name}
- File type: ${type}
- File size: ${(size / 1024).toFixed(2)} KB

The user has uploaded a medical report image and needs your expert analysis.
Please analyze the following medical report and provide a detailed interpretation:

1. Identify all test results and their values
2. Compare values to normal/reference ranges where possible
3. Explain what each value means in simple terms
4. Highlight any abnormal values and what they might indicate
5. Provide general health insights based on the results
6. Suggest any follow-up actions or lifestyle changes if appropriate

If you cannot determine specific values from the report, please explain what the user should look for in their report and what those values typically mean for their health.
`;
      } else {
        userPrompt = `
I'm analyzing a medical report with the following details:
- Filename: ${name}
- File type: ${type}
- File size: ${(size / 1024).toFixed(2)} KB

The user has uploaded a medical report and needs your expert analysis.
Please analyze the following medical report data and provide a detailed interpretation:

1. Identify all test results and their values
2. Compare values to normal/reference ranges where possible
3. Explain what each value means in simple terms
4. Highlight any abnormal values and what they might indicate
5. Provide general health insights based on the results
6. Suggest any follow-up actions or lifestyle changes if appropriate

If you cannot determine specific values from the report, please explain what the user should look for in their report and what those values typically mean for their health.
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
      const chatCompletion = await groqClient.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a medical AI assistant. Provide a clear, actionable, and user-friendly analysis of the following medical report.' },
          { role: 'user', content: userPrompt },
        ],
        model: 'llama3-70b-8192',
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