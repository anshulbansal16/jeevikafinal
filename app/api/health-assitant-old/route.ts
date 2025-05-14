// /app/api/health-assistant/route.ts
import { NextResponse } from "next/server";
import { getHealthAssistantResponse } from "@/lib/grok";

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json(
                { error: "Query is required" },
                { status: 400 }
            );
        }

        const response = await getHealthAssistantResponse(query);

        return NextResponse.json({ response });
    } catch (error) {
        console.error("Error getting health assistant response:", error);
        return NextResponse.json(
            { error: "Failed to get health assistant response" },
            { status: 500 }
        );
    }
}
