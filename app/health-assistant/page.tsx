"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, User, Send, Loader2, MessageSquare } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { AuthRequired } from "@/components/auth-required"
import ReactMarkdown from "react-markdown"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function HealthAssistantPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI health assistant. How can I help you with your health questions today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage = { role: "user" as const, content: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Store the input for fallback responses
    const userInput = input.toLowerCase()

    try {
      // Call the health assistant API
      console.log("Calling health assistant API...")
      const response = await fetch('/api/health-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage.content }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
      } else {
        throw new Error("API request failed")
      }
    } catch (error) {
      console.error("Error calling health assistant API:", error)
      
      // Fallback to simulated responses if API fails
      console.log("Using fallback responses...")
      let fallbackResponse = ""

      // Sample responses based on common health questions
      if (userInput.includes("headache")) {
        fallbackResponse =
          "**Headaches** can be caused by various factors including stress, dehydration, lack of sleep, or eye strain.\n\n" +
          "For occasional headaches, consider these remedies:\n" +
          "1. **Rest** in a quiet, dark room\n" +
          "2. **Stay hydrated** by drinking plenty of water\n" +
          "3. Try **over-the-counter pain relievers** like acetaminophen or ibuprofen\n" +
          "4. Apply a **cold or warm compress** to your head\n\n" +
          "If you experience severe or persistent headaches, it's advisable to consult with a healthcare professional."
      } else if (userInput.includes("cold") || userInput.includes("flu")) {
        fallbackResponse =
          "## Common Cold vs. Flu\n\n" +
          "**Common cold symptoms** include:\n" +
          "- Runny or stuffy nose\n" +
          "- Sore throat\n" +
          "- Mild fatigue\n" +
          "- Mild cough\n\n" +
          "**Flu symptoms** are typically more severe:\n" +
          "- High fever\n" +
          "- Body aches\n" +
          "- Extreme fatigue\n" +
          "- Headaches\n\n" +
          "**Treatment recommendations:**\n" +
          "1. Rest and stay hydrated\n" +
          "2. Over-the-counter medications can help manage symptoms\n" +
          "3. Wash hands frequently to prevent spread\n\n" +
          "If symptoms are severe or persistent, consider consulting a healthcare provider."
      } else if (userInput.includes("diet") || userInput.includes("nutrition")) {
        fallbackResponse =
          "# A Balanced Diet for Health\n\n" +
          "A balanced diet typically includes a variety of nutrient-dense foods from all food groups in appropriate amounts. Here are key components:\n\n" +
          "1. **Vegetables:** Aim for 5-7 servings per day, focusing on colorful, fiber-rich options\n" +
          "2. **Fruits:** Aim for 2-3 servings per day, choosing whole fruits over juices\n" +
          "3. **Whole Grains:** Choose brown rice, whole wheat, quinoa, and oats\n" +
          "4. **Lean Proteins:** Include poultry, fish, beans, lentils, and low-fat dairy\n" +
          "5. **Healthy Fats:** Incorporate avocados, nuts, seeds, and olive oil\n\n" +
          "**Tips for healthy eating:**\n" +
          "- Limit processed foods, added sugars, and excessive salt\n" +
          "- Stay hydrated by drinking plenty of water\n" +
          "- Practice portion control\n\n" +
          "Remember that individual nutritional needs can vary based on factors like age, activity level, and health conditions."
      } else if (userInput.includes("exercise") || userInput.includes("workout")) {
        fallbackResponse =
          "## Exercise Recommendations\n\n" +
          "Regular physical activity is important for overall health. According to health guidelines:\n\n" +
          "**Adults should aim for:**\n" +
          "- At least 150 minutes of moderate aerobic activity per week\n" +
          "- OR 75 minutes of vigorous activity per week\n" +
          "- PLUS muscle-strengthening activities on 2 or more days per week\n\n" +
          "**Types of exercise to consider:**\n" +
          "1. **Aerobic activities:** Walking, swimming, cycling\n" +
          "2. **Strength training:** Weight lifting, resistance bands, bodyweight exercises\n" +
          "3. **Flexibility work:** Yoga, stretching\n" +
          "4. **Balance exercises:** Tai chi, standing on one foot\n\n" +
          "Always start gradually and consider consulting with a healthcare provider before beginning a new exercise program, especially if you have existing health conditions."
      } else if (userInput.includes("sleep")) {
        fallbackResponse =
          "# Healthy Sleep Habits\n\n" +
          "Most adults need **7-9 hours** of quality sleep per night. To improve sleep quality:\n\n" +
          "**Create a sleep-friendly environment:**\n" +
          "- Keep your bedroom dark, quiet, and cool\n" +
          "- Use comfortable bedding\n" +
          "- Remove electronic devices\n\n" +
          "**Establish a regular routine:**\n" +
          "1. Maintain a consistent sleep schedule\n" +
          "2. Create a relaxing bedtime ritual\n" +
          "3. Limit exposure to screens before bedtime\n" +
          "4. Avoid caffeine and large meals before sleeping\n" +
          "5. Engage in regular physical activity (but not right before bed)\n\n" +
          "If you have persistent sleep problems, consider consulting a healthcare provider as it could indicate an underlying condition."
      } else {
        fallbackResponse =
          "Thank you for your question. While I can provide general health information, it's important to consult with a qualified healthcare professional for personalized advice.\n\n" +
          "**Some health topics I can help with include:**\n" +
          "- Diet and nutrition\n" +
          "- Exercise recommendations\n" +
          "- Sleep hygiene\n" +
          "- Common illnesses\n" +
          "- Stress management\n\n" +
          "Is there a specific aspect of health you'd like to know more about?"
      }

      setMessages((prev) => [...prev, { role: "assistant", content: fallbackResponse }])
    } finally {
      setIsLoading(false)
    }
  }

  // Function to check API status
  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/health-assistant/test')
      const data = await response.json()
      console.log('Health Assistant API Status:', data)
      return data.success
    } catch (error) {
      console.error('Error checking API status:', error)
      return false
    }
  }

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus()
      .then(isAvailable => {
        if (isAvailable) {
          console.log('Health Assistant API is available')
        } else {
          console.log('Health Assistant API is not available, using fallback responses')
        }
      })
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
        AI Health Assistant
      </h1>

      <AuthRequired title="Health Assistant Requires Login" description="Please log in to chat with the Health Assistant.">
        <Card className="max-w-3xl mx-auto border border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Chat with Your Health Assistant</CardTitle>
                <CardDescription>Ask any health-related questions and get AI-powered answers</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="h-[500px] overflow-y-auto p-6 bg-gradient-to-b from-background to-muted/30">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start gap-3 max-w-[80%]">
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-md">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-4 py-3 text-sm shadow-md ${
                        message.role === "user" ? "bg-gradient-to-r from-primary to-blue-600 text-white" : "bg-muted"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-2 mb-1" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-base font-bold mt-2 mb-1" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc pl-4 my-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-1" {...props} />,
                              li: ({node, ...props}) => <li className="my-0.5" {...props} />,
                              p: ({node, ...props}) => <p className="my-1" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                              em: ({node, ...props}) => <em className="italic" {...props} />,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                    {message.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-md">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-md">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-lg px-4 py-3 text-sm bg-muted shadow-md">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t border-primary/10">
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input
                placeholder="Type your health question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border-primary/20 focus-visible:ring-primary"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-md"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </CardFooter>
        </Card>

        <div className="max-w-3xl mx-auto mt-8 p-6 bg-muted/50 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-primary">Popular Health Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setInput("What causes headaches and how can I prevent them?")
                document.querySelector("form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
              }}
              className="border-primary/20 hover:bg-primary/10 shadow-sm hover:shadow transition-all justify-start"
            >
              Headaches
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setInput("How can I improve my sleep quality?")
                document.querySelector("form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
              }}
              className="border-primary/20 hover:bg-primary/10 shadow-sm hover:shadow transition-all justify-start"
            >
              Sleep Quality
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setInput("What's a balanced diet for weight management?")
                document.querySelector("form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
              }}
              className="border-primary/20 hover:bg-primary/10 shadow-sm hover:shadow transition-all justify-start"
            >
              Nutrition
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setInput("How much exercise do I need each week?")
                document.querySelector("form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
              }}
              className="border-primary/20 hover:bg-primary/10 shadow-sm hover:shadow transition-all justify-start"
            >
              Exercise
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setInput("How can I manage stress and anxiety?")
                document.querySelector("form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
              }}
              className="border-primary/20 hover:bg-primary/10 shadow-sm hover:shadow transition-all justify-start"
            >
              Stress Management
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setInput("What are the symptoms of common cold vs flu?")
                document.querySelector("form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
              }}
              className="border-primary/20 hover:bg-primary/10 shadow-sm hover:shadow transition-all justify-start"
            >
              Cold & Flu
            </Button>
          </div>
        </div>
      </AuthRequired>
    </div>
  )
}