// /app/api/analyze-health/route.ts
import { NextResponse } from "next/server";
import { analyzeBloodTest } from "@/lib/grok";

export async function POST(request: Request) {
    try {
        const { reportText, reportType } = await request.json();

        if (!reportText) {
            return NextResponse.json(
                { error: "Report text is required" },
                { status: 400 }
            );
        }

        // Use the appropriate analysis function based on report type
        let analysisResult;

        if (reportType === "blood_test" || reportType === "general") {
            analysisResult = await analyzeBloodTest(reportText);
        } else {
            // For other report types, we can add specialized analysis in the future
            analysisResult = await analyzeBloodTest(reportText);
        }

        return NextResponse.json({ analysis: analysisResult });
    } catch (error) {
        console.error("Error analyzing health report:", error);
        return NextResponse.json(
            { error: "Failed to analyze health report" },
            { status: 500 }
        );
    }
}
