// Debug endpoint to check environment variables
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Check if the Groq API key is available
        const groqApiKey = process.env.GROQ_API_KEY || '';
        const maskedKey = groqApiKey ? 
            `${groqApiKey.substring(0, 5)}...${groqApiKey.substring(groqApiKey.length - 4)}` : 
            'Not found';
        
        // Return environment information (without exposing full keys)
        return NextResponse.json({
            groqApiKeyAvailable: !!groqApiKey,
            groqApiKeyMasked: maskedKey,
            groqApiKeyLength: groqApiKey.length,
            nodeEnv: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error in debug endpoint:", error);
        return NextResponse.json(
            { error: "Failed to get debug information" },
            { status: 500 }
        );
    }
}