import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

// BMI analysis prompt
const BMI_PROMPT = `You are a virtual fitness and wellness expert. A user has entered their height and weight. Calculate their BMI, interpret what it means, and provide personalized suggestions for diet and exercise. Also include what the ideal BMI should be for their profile.

User Data:
- Height: {height} cm
- Weight: {weight} kg

Provide:
- BMI value
- BMI category (e.g., overweight)
- Ideal BMI range
- 2 diet tips
- 2 exercise suggestions`

// Blood test analysis prompt
const BLOOD_TEST_PROMPT = `You are a clinical-grade AI that helps users interpret their blood test reports. The user has uploaded a report. Analyze the values, highlight anything that is outside the normal range, and explain what it could mean in simple terms. Suggest if further medical attention is advisable.

Blood Report:
{bloodData}

Output:
- Any abnormal values with interpretation
- General lifestyle advice
- Recommendation to see a doctor (if needed)`

// General health assistant prompt
const HEALTH_ASSISTANT_PROMPT = `You are a helpful health assistant. You provide information and guidance on health-related topics. You are not a doctor and cannot provide medical diagnoses, but you can offer general health information and advice. 

User query: {query}

Provide:
- Relevant information about the topic
- General advice if applicable
- Suggestions for when to consult a healthcare professional`

export async function analyzeBMI(height: number, weight: number) {
  const prompt = BMI_PROMPT.replace("{height}", height.toString()).replace("{weight}", weight.toString())

  try {
    const { text } = await generateText({
      model: xai("grok-3-beta"),
      prompt: prompt,
    })

    return text
  } catch (error) {
    console.error("Error analyzing BMI:", error)
    return "Sorry, there was an error analyzing your BMI. Please try again later."
  }
}

export async function analyzeBloodTest(bloodData: string) {
  const prompt = BLOOD_TEST_PROMPT.replace("{bloodData}", bloodData)

  try {
    const { text } = await generateText({
      model: xai("grok-3-beta"),
      prompt: prompt,
    })

    return text
  } catch (error) {
    console.error("Error analyzing blood test:", error)
    return "Sorry, there was an error analyzing your blood test. Please try again later."
  }
}

export async function getHealthAssistantResponse(query: string) {
  const prompt = HEALTH_ASSISTANT_PROMPT.replace("{query}", query)

  try {
    // Log the API key (first few characters) to check if it's being loaded correctly
    const apiKey = process.env.GROQ_API_KEY || '';
    console.log("Using Groq API Key (first 5 chars):", apiKey.substring(0, 5));
    
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined in environment variables");
    }
    
    const { text } = await generateText({
      model: xai("grok-3-beta"),
      prompt: prompt,
    })

    return text
  } catch (error) {
    console.error("Error getting health assistant response:", error)
    return "Sorry, there was an error processing your query. Please try again later."
  }
}
