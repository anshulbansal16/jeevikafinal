"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowser } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, Activity, Heart, Scale, BarChart2 } from "lucide-react"
import { HealthRecommendations } from "@/components/health-recommendations"
import Link from "next/link"

export default function HealthRecommendationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState<any[]>([])

  const router = useRouter()
  const { user } = useAuth()
  const supabase = getSupabaseBrowser()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    async function loadMetrics() {
      try {
        setIsLoading(true)

        // Get the latest metrics of each type
        const { data, error } = await supabase
          .from("health_metrics")
          .select("*")
          .eq("user_id", user.id)
          .order("recorded_at", { ascending: false })

        if (error) throw error

        // Get the latest value for each metric type
        const latestMetrics: Record<string, any> = {}
        data?.forEach((metric) => {
          if (
            !latestMetrics[metric.metric_type] ||
            new Date(metric.recorded_at) > new Date(latestMetrics[metric.metric_type].recorded_at)
          ) {
            latestMetrics[metric.metric_type] = metric
          }
        })

        setMetrics(Object.values(latestMetrics))
      } catch (error: any) {
        console.error("Error loading metrics:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to load health metrics. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
  }, [user, router, supabase, toast])

  const getMetricIcon = (type: string) => {
    switch (type) {
      case "weight":
        return <Scale className="h-5 w-5 text-primary" />
      case "bmi":
        return <Activity className="h-5 w-5 text-primary" />
      case "heart_rate":
        return <Heart className="h-5 w-5 text-primary" />
      case "blood_pressure_systolic":
      case "blood_pressure_diastolic":
        return <BarChart2 className="h-5 w-5 text-primary" />
      default:
        return <Activity className="h-5 w-5 text-primary" />
    }
  }

  const getMetricLabel = (type: string) => {
    switch (type) {
      case "weight":
        return "Weight"
      case "bmi":
        return "BMI"
      case "heart_rate":
        return "Heart Rate"
      case "blood_pressure_systolic":
        return "Blood Pressure (Systolic)"
      case "blood_pressure_diastolic":
        return "Blood Pressure (Diastolic)"
      default:
        return type.replace(/_/g, " ")
    }
  }

  const getMetricUnit = (type: string) => {
    switch (type) {
      case "weight":
        return "kg"
      case "bmi":
        return ""
      case "heart_rate":
        return "bpm"
      case "blood_pressure_systolic":
      case "blood_pressure_diastolic":
        return "mmHg"
      default:
        return ""
    }
  }

  const getMetricStatus = (type: string, value: number) => {
    switch (type) {
      case "weight":
        return { status: "normal", message: "Your weight is being tracked." }
      case "bmi":
        if (value < 18.5) return { status: "warning", message: "Your BMI indicates you are underweight." }
        if (value >= 18.5 && value < 25) return { status: "good", message: "Your BMI is in the healthy range." }
        if (value >= 25 && value < 30) return { status: "warning", message: "Your BMI indicates you are overweight." }
        return { status: "alert", message: "Your BMI indicates obesity." }
      case "heart_rate":
        if (value < 60)
          return {
            status: "info",
            message: "Your resting heart rate is below average, which may indicate good cardiovascular fitness.",
          }
        if (value >= 60 && value <= 100)
          return { status: "good", message: "Your heart rate is within the normal range." }
        return { status: "alert", message: "Your heart rate is elevated. Consider consulting a healthcare provider." }
      case "blood_pressure_systolic":
        if (value < 120) return { status: "good", message: "Your systolic blood pressure is in the normal range." }
        if (value >= 120 && value < 130) return { status: "info", message: "Your systolic blood pressure is elevated." }
        if (value >= 130 && value < 140)
          return { status: "warning", message: "Your systolic blood pressure indicates stage 1 hypertension." }
        return {
          status: "alert",
          message:
            "Your systolic blood pressure indicates stage 2 hypertension. Consider consulting a healthcare provider.",
        }
      case "blood_pressure_diastolic":
        if (value < 80) return { status: "good", message: "Your diastolic blood pressure is in the normal range." }
        if (value >= 80 && value < 90)
          return { status: "warning", message: "Your diastolic blood pressure indicates stage 1 hypertension." }
        return {
          status: "alert",
          message:
            "Your diastolic blood pressure indicates stage 2 hypertension. Consider consulting a healthcare provider.",
        }
      default:
        return { status: "normal", message: "This metric is being tracked." }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "alert":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading your health data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Health Recommendations
          </h1>
          <Button
            asChild
            className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-500/90 shadow-md hover:shadow-lg transition-all"
          >
            <Link href="/health-metrics">
              <Activity className="mr-2 h-4 w-4" />
              Record Metrics
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
              <CardTitle>Your Health Metrics</CardTitle>
              <CardDescription>Current health metrics and their status</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {metrics.length > 0 ? (
                <div className="space-y-4">
                  {metrics.map((metric) => {
                    const { status, message } = getMetricStatus(metric.metric_type, metric.metric_value)
                    return (
                      <div
                        key={metric.id}
                        className="p-4 rounded-lg border border-primary/10 hover:bg-muted/10 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            {getMetricIcon(metric.metric_type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium">{getMetricLabel(metric.metric_type)}</h3>
                              <div className="text-lg font-semibold">
                                {metric.metric_value}
                                {getMetricUnit(metric.metric_type) && (
                                  <span className="text-sm text-muted-foreground ml-1">
                                    {getMetricUnit(metric.metric_type)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {new Date(metric.recorded_at).toLocaleString()}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(status)}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm mt-2 text-muted-foreground">{message}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Health Metrics</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't recorded any health metrics yet. Start by adding your first metric.
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-500/90 shadow-md hover:shadow-lg transition-all"
                  >
                    <Link href="/health-metrics">
                      <Activity className="mr-2 h-4 w-4" />
                      Record Health Metrics
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <HealthRecommendations />
        </div>

        <Card className="border border-primary/20 shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
            <CardTitle>Health Insights</CardTitle>
            <CardDescription>Personalized insights based on your health data</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {metrics.length > 0 ? (
                <>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-2 text-primary">Overall Health Assessment</h3>
                    <p className="text-sm">Based on your recorded metrics, here's an overview of your health status:</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {metrics.map((metric) => {
                        const { message } = getMetricStatus(metric.metric_type, metric.metric_value)
                        return (
                          <li key={metric.id} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span>{message}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-2 text-primary">Next Steps</h3>
                    <p className="text-sm">Consider these actions to improve or maintain your health:</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>Continue tracking your metrics regularly to monitor changes over time.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>Follow the personalized recommendations provided above.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>
                          Consider consulting with a healthcare provider for a comprehensive health assessment.
                        </span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Health Insights Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Record your health metrics to receive personalized insights and recommendations.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
