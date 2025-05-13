"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowser } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, RefreshCw } from "lucide-react"

interface Recommendation {
  id: number
  recommendation: string
  recommendation_type: string
  is_completed: boolean
  created_at: string
}

export function HealthRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const { user } = useAuth()
  const supabase = getSupabaseBrowser()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadRecommendations()
    }
  }, [user])

  const loadRecommendations = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("health_recommendations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setRecommendations(data || [])
    } catch (error: any) {
      console.error("Error loading recommendations:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load recommendations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateRecommendations = async () => {
    if (!user) return

    try {
      setIsGenerating(true)

      // Sample recommendations - in a real app, these would be generated based on the user's health metrics
      const sampleRecommendations = [
        {
          user_id: user.id,
          recommendation_type: "exercise",
          recommendation: "Aim for at least 30 minutes of moderate exercise 5 days a week",
          is_completed: false,
          created_at: new Date().toISOString(),
        },
        {
          user_id: user.id,
          recommendation_type: "nutrition",
          recommendation: "Increase your daily water intake to at least 8 glasses",
          is_completed: false,
          created_at: new Date().toISOString(),
        },
        {
          user_id: user.id,
          recommendation_type: "sleep",
          recommendation: "Establish a regular sleep schedule with 7-8 hours per night",
          is_completed: false,
          created_at: new Date().toISOString(),
        },
        {
          user_id: user.id,
          recommendation_type: "checkup",
          recommendation: "Schedule your annual physical examination",
          is_completed: false,
          created_at: new Date().toISOString(),
        },
      ]

      // Insert the recommendations
      const { error } = await supabase.from("health_recommendations").insert(sampleRecommendations)

      if (error) throw error

      toast({
        title: "Recommendations Generated",
        description: "New health recommendations have been generated for you.",
      })

      // Reload recommendations
      loadRecommendations()
    } catch (error: any) {
      console.error("Error generating recommendations:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleRecommendation = async (id: number, completed: boolean) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("health_recommendations")
        .update({ is_completed: completed })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      // Update local state
      setRecommendations((prev) => prev.map((rec) => (rec.id === id ? { ...rec, is_completed: completed } : rec)))

      toast({
        title: completed ? "Recommendation Completed" : "Recommendation Reopened",
        description: completed
          ? "Great job! You've completed this recommendation."
          : "You've reopened this recommendation.",
      })
    } catch (error: any) {
      console.error("Error updating recommendation:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update recommendation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getRecommendationTypeLabel = (type: string) => {
    switch (type) {
      case "exercise":
        return "Exercise"
      case "nutrition":
        return "Nutrition"
      case "sleep":
        return "Sleep"
      case "checkup":
        return "Medical Checkup"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  return (
    <Card className="border border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Health Recommendations</CardTitle>
            <CardDescription>Personalized recommendations based on your health data</CardDescription>
          </div>
          <Button
            onClick={generateRecommendations}
            variant="outline"
            size="sm"
            className="border-primary/20 hover:bg-primary/10 shadow-sm hover:shadow transition-all"
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Generate New</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-4 rounded-lg border border-primary/10 transition-colors ${
                  rec.is_completed ? "bg-muted/30" : "hover:bg-muted/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`rec-${rec.id}`}
                    checked={rec.is_completed}
                    onCheckedChange={(checked) => toggleRecommendation(rec.id, checked === true)}
                    className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor={`rec-${rec.id}`}
                        className={`font-medium cursor-pointer ${
                          rec.is_completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {rec.recommendation}
                      </label>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full mr-2">
                        {getRecommendationTypeLabel(rec.recommendation_type)}
                      </span>
                      <span>{new Date(rec.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {rec.is_completed && <CheckCircle className="h-5 w-5 text-primary shrink-0" />}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Recommendations Yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate personalized health recommendations based on your health data.
            </p>
            <Button
              onClick={generateRecommendations}
              className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-500/90 shadow-md hover:shadow-lg transition-all"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Recommendations
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
