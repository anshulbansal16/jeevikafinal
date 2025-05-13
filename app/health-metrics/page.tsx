"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowser } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, LineChart, Heart, Activity, BarChart2, Scale, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HealthMetricsPage() {
  const [metricType, setMetricType] = useState("weight")
  const [metricValue, setMetricValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recentMetrics, setRecentMetrics] = useState<any[]>([])
  const [showRecent, setShowRecent] = useState(false)

  const router = useRouter()
  const { user } = useAuth()
  const supabase = getSupabaseBrowser()
  const { toast } = useToast()

  // Load recent metrics when the component mounts
  const loadRecentMetrics = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("health_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: false })
        .limit(5)

      if (error) throw error

      setRecentMetrics(data || [])
      setShowRecent(true)
    } catch (error: any) {
      console.error("Error loading recent metrics:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load recent metrics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !metricType || !metricValue) return

    setIsLoading(true)

    try {
      // Insert the new metric
      const { error } = await supabase.from("health_metrics").insert({
        user_id: user.id,
        metric_type: metricType,
        metric_value: Number.parseFloat(metricValue),
        recorded_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Metric Saved",
        description: "Your health metric has been saved successfully.",
      })

      // Clear the form
      setMetricValue("")

      // Reload recent metrics
      loadRecentMetrics()
    } catch (error: any) {
      console.error("Error saving metric:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save metric. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
        return "Weight (kg)"
      case "bmi":
        return "BMI"
      case "heart_rate":
        return "Heart Rate (bpm)"
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

  const getPlaceholder = (type: string) => {
    switch (type) {
      case "weight":
        return "70.5"
      case "bmi":
        return "24.5"
      case "heart_rate":
        return "72"
      case "blood_pressure_systolic":
        return "120"
      case "blood_pressure_diastolic":
        return "80"
      default:
        return ""
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Record Health Metrics
          </h1>
          <Button
            asChild
            className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-500/90 shadow-md hover:shadow-lg transition-all"
          >
            <Link href="/health-trends">
              <LineChart className="mr-2 h-4 w-4" />
              View Trends
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  {getMetricIcon(metricType)}
                </div>
                <div>
                  <CardTitle>Add New Metric</CardTitle>
                  <CardDescription>Record your health metrics to track your progress</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metric-type">Metric Type</Label>
                  <Select value={metricType} onValueChange={setMetricType}>
                    <SelectTrigger id="metric-type" className="border-primary/20 focus-visible:ring-primary">
                      <SelectValue placeholder="Select metric type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight">Weight (kg)</SelectItem>
                      <SelectItem value="bmi">BMI</SelectItem>
                      <SelectItem value="heart_rate">Heart Rate (bpm)</SelectItem>
                      <SelectItem value="blood_pressure_systolic">Blood Pressure (Systolic)</SelectItem>
                      <SelectItem value="blood_pressure_diastolic">Blood Pressure (Diastolic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metric-value">Value</Label>
                  <div className="relative">
                    <Input
                      id="metric-value"
                      type="number"
                      step="0.01"
                      placeholder={getPlaceholder(metricType)}
                      value={metricValue}
                      onChange={(e) => setMetricValue(e.target.value)}
                      required
                      className="border-primary/20 focus-visible:ring-primary pr-12"
                    />
                    {getMetricUnit(metricType) && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                        {getMetricUnit(metricType)}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-500/90 shadow-md hover:shadow-lg transition-all"
                  disabled={isLoading || !metricValue}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Save Metric
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-primary/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Quick Tips</h3>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Record your weight at the same time each day for consistency</p>
                  <p>• Blood pressure is best measured after sitting quietly for 5 minutes</p>
                  <p>• Measure your resting heart rate in the morning before getting out of bed</p>
                  <p>• Track your metrics regularly to identify trends and patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
              <CardTitle>Recent Metrics</CardTitle>
              <CardDescription>Your most recently recorded health metrics</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {!showRecent ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <LineChart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">View Recent Metrics</h3>
                  <p className="text-muted-foreground mb-4">Click the button below to load your recent metrics.</p>
                  <Button
                    onClick={loadRecentMetrics}
                    className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-500/90 shadow-md hover:shadow-lg transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <LineChart className="mr-2 h-4 w-4" />
                        Load Recent Metrics
                      </>
                    )}
                  </Button>
                </div>
              ) : recentMetrics.length > 0 ? (
                <div className="space-y-4">
                  {recentMetrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-primary/10"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          {getMetricIcon(metric.metric_type)}
                        </div>
                        <div>
                          <p className="font-medium">{getMetricLabel(metric.metric_type)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(metric.recorded_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-lg font-semibold">
                        {metric.metric_value}
                        {getMetricUnit(metric.metric_type) && (
                          <span className="text-sm text-muted-foreground ml-1">
                            {getMetricUnit(metric.metric_type)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 text-center">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-500/90 shadow-md hover:shadow-lg transition-all"
                    >
                      <Link href="/health-trends">
                        View All Metrics <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Metrics Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't recorded any health metrics yet. Start by adding your first metric.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border border-primary/20 shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
            <CardTitle>Understanding Your Health Metrics</CardTitle>
            <CardDescription>Learn about the importance of tracking different health metrics</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Scale className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium">Weight</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Regular weight tracking helps monitor your overall health and can indicate changes in your body
                  composition. Aim for consistency by weighing yourself at the same time each day.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium">BMI</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Body Mass Index (BMI) is a measure of body fat based on height and weight. A healthy BMI range is
                  typically between 18.5 and 24.9, though it doesn't account for factors like muscle mass.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium">Heart Rate</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your resting heart rate is an indicator of cardiovascular health. For most adults, a normal resting
                  heart rate is between 60-100 beats per minute, with lower rates often indicating better fitness.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart2 className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium">Blood Pressure</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Blood pressure is measured as systolic/diastolic. Normal blood pressure is typically around 120/80
                  mmHg. Regular monitoring can help detect hypertension early.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <LineChart className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium">Tracking Trends</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  The real value in recording health metrics comes from tracking changes over time. Regular monitoring
                  helps you identify patterns and make informed decisions about your health.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium">When to Consult a Doctor</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Consult a healthcare professional if you notice significant changes in your metrics, especially if
                  they fall outside normal ranges or are accompanied by symptoms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
