// Test endpoint to verify Groq API connection
import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

export async function GET() {
    try {
        // Get API key from environment
        const apiKey = process.env.GROQ_API_KEY || '';
        
        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: "API key not found in environment variables"
            }, { status: 500 });
        }
        
        // Create Groq client
        const groqClient = new Groq({
            apiKey: apiKey,
        });
        
        // Make a simple test request
        const chatCompletion = await groqClient.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a test assistant. Respond with 'Groq API connection successful!'"
                },
                {
                    role: "user",
                    content: "Test connection"
                }
            ],
            model: "llama3-70b-8192",
            max_tokens: 10
        });
        
        // Return success response
        return NextResponse.json({
            success: true,
            message: "Groq API connection successful",
            response: chatCompletion.choices[0]?.message?.content
        });
    } catch (error: any) {
        console.error("Error testing Groq API connection:", error);
        
        // Return detailed error information
        return NextResponse.json({
            success: false,
            error: error.message || "Unknown error",
            details: error.toString(),
            stack: error.stack
        }, { status: 500 });
    }
}