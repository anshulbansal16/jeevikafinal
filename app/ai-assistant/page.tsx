"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function AIAssistantPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      // Sample responses based on common health questions
      let response = ""
      const userInput = input.toLowerCase()

      if (userInput.includes("headache")) {
        response =
          "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If you experience severe or persistent headaches, it's advisable to consult with a healthcare professional."
      } else if (userInput.includes("cold") || userInput.includes("flu")) {
        response =
          "Common cold symptoms include runny nose, sore throat, and mild fatigue, while flu typically involves more severe symptoms like high fever, body aches, and extreme fatigue. Rest, hydration, and over-the-counter medications can help manage symptoms. If symptoms are severe or persistent, consider consulting a healthcare provider."
      } else if (userInput.includes("diet") || userInput.includes("nutrition")) {
        response =
          "A balanced diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's important to limit processed foods, added sugars, and excessive salt. Remember that individual nutritional needs can vary based on factors like age, activity level, and health conditions."
      } else if (userInput.includes("exercise") || userInput.includes("workout")) {
        response =
          "Regular physical activity is important for overall health. Adults should aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week, plus muscle-strengthening activities on 2 or more days per week. Always start gradually and consider consulting with a healthcare provider before beginning a new exercise program."
      } else if (userInput.includes("sleep")) {
        response =
          "Most adults need 7-9 hours of quality sleep per night. To improve sleep, maintain a consistent sleep schedule, create a restful environment, limit exposure to screens before bedtime, avoid caffeine and large meals before sleeping, and engage in regular physical activity. If you have persistent sleep problems, consider consulting a healthcare provider."
      } else {
        response =
          "Thank you for your question. While I can provide general health information, it's important to consult with a qualified healthcare professional for personalized advice. Is there a specific aspect of this topic you'd like to know more about?"
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Health Assistant</h1>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Chat with Your Health Assistant</CardTitle>
          <CardDescription>Ask any health-related questions and get AI-powered answers</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg bg-muted px-3 py-2 text-sm">
                  <div className="flex space-x-1">
                    <div className="animate-bounce">.</div>
                    <div className="animate-bounce animation-delay-200">.</div>
                    <div className="animate-bounce animation-delay-400">.</div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              placeholder="Type your health question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
