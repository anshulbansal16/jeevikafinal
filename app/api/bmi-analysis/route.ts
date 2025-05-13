// /app/api/bmi-analysis/route.ts
import { NextResponse } from "next/server";
import { analyzeBMI } from "@/lib/grok";

export async function POST(request: Request) {
    try {
        const { height, weight } = await request.json();

        if (!height || !weight) {
            return NextResponse.json(
                { error: "Height and weight are required" },
                { status: 400 }
            );
        }

        const analysisResult = await analyzeBMI(Number(height), Number(weight));

        return NextResponse.json({ analysis: analysisResult });
    } catch (error) {
        console.error("Error analyzing BMI:", error);
        return NextResponse.json(
            { error: "Failed to analyze BMI" },
            { status: 500 }
        );
    }
}
