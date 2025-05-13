import { Groq } from "groq-sdk";

// Create a Groq client with API key from environment variables
export const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getGroqResponse(prompt: string) {
  try {
    // Debug information to verify API key and environment
    const apiKey = process.env.GROQ_API_KEY || '';
    console.log("Groq API Key (first 5 chars):", apiKey.substring(0, 5));
    console.log("API Key length:", apiKey.length);
    console.log("Sending request to Groq API with prompt:", prompt.substring(0, 30) + "...");
    
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined in environment variables");
    }
    
    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful health assistant. You provide information and guidance on health-related topics. You are not a doctor and cannot provide medical diagnoses, but you can offer general health information and advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-70b-8192",
    });

    console.log("Received response from Groq API");
    return chatCompletion.choices[0]?.message?.content || "No response received";
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw error;
  }
}