"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowser } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, TrendingUp, Activity, Heart, BarChart2 } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"

interface HealthMetric {
  id: number
  metric_type: string
  metric_value: number
  recorded_at: string
}

export default function HealthTrendsPage() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [timeRange, setTimeRange] = useState("30")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setError(null)

        const days = Number.parseInt(timeRange)
        const { data, error } = await supabase
          .from("health_metrics")
          .select("*")
          .eq("user_id", user.id)
          .gte("recorded_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
          .order("recorded_at", { ascending: true })

        if (error) {
          throw error
        }

        setMetrics(data || [])
      } catch (error: any) {
        console.error("Error loading metrics:", error)
        setError(error.message || "Failed to load health metrics. Please try again.")
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
  }, [user, router, supabase, toast, timeRange])

  // Process data for charts
  const processData = (metricType: string) => {
    return metrics
      .filter((metric) => metric.metric_type === metricType)
      .map((metric) => ({
        date: new Date(metric.recorded_at).toLocaleDateString(),
        value: metric.metric_value,
      }))
  }

  const weightData = processData("weight")
  const bmiData = processData("bmi")
  const heartRateData = processData("heart_rate")
  const systolicData = processData("blood_pressure_systolic")
  const diastolicData = processData("blood_pressure_diastolic")

  // Combine blood pressure data
  const bloodPressureData = systolicData.map((item, index) => ({
    date: item.date,
    systolic: item.value,
    diastolic: diastolicData[index]?.value || 0,
  }))

  // Calculate averages
  const calculateAverage = (data: { value: number }[]) => {
    if (data.length === 0) return 0
    return data.reduce((sum, item) => sum + item.value, 0) / data.length
  }

  const averageWeight = calculateAverage(weightData).toFixed(1)
  const averageBMI = calculateAverage(bmiData).toFixed(1)
  const averageHeartRate = calculateAverage(heartRateData).toFixed(0)
  const averageSystolic = calculateAverage(systolicData).toFixed(0)
  const averageDiastolic = calculateAverage(diastolicData).toFixed(0)

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading your health trends...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="max-w-3xl mx-auto">
          <Card className="border border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button
                  onClick={() => router.refresh()}
                  className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-500/90 shadow-md hover:shadow-lg transition-all"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Health Trends Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] border-primary/20">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="180">Last 6 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-primary/20 shadow-md hover:shadow-lg transition-all card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageWeight} kg</div>
              <p className="text-xs text-muted-foreground">Average over the last {timeRange} days</p>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-md hover:shadow-lg transition-all card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">BMI</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageBMI}</div>
              <p className="text-xs text-muted-foreground">Average over the last {timeRange} days</p>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-md hover:shadow-lg transition-all card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageHeartRate} bpm</div>
              <p className="text-xs text-muted-foreground">Average over the last {timeRange} days</p>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-md hover:shadow-lg transition-all card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart2 className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageSystolic}/{averageDiastolic}
              </div>
              <p className="text-xs text-muted-foreground">Average over the last {timeRange} days</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="weight" className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="bmi">BMI</TabsTrigger>
            <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
            <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
          </TabsList>

          <TabsContent value="weight">
            <Card className="border border-primary/20 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
                <CardTitle>Weight Trends</CardTitle>
                <CardDescription>Track your weight changes over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {weightData.length > 0 ? (
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weightData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="value"
                          name="Weight (kg)"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorWeight)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Weight Data</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any weight data recorded for the selected time period.
                    </p>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-500/90 shadow-md hover:shadow-lg transition-all"
                    >
                      <a href="/bmi-analysis">Record Weight</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bmi">
            <Card className="border border-primary/20 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
                <CardTitle>BMI Trends</CardTitle>
                <CardDescription>Track your BMI changes over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {bmiData.length > 0 ? (
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bmiData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="BMI"
                          stroke="#3b82f6"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                        {/* Reference lines for BMI categories */}
                        <Line
                          type="monotone"
                          dataKey={() => 18.5}
                          name="Underweight Threshold"
                          stroke="#94a3b8"
                          strokeDasharray="5 5"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey={() => 25}
                          name="Overweight Threshold"
                          stroke="#94a3b8"
                          strokeDasharray="5 5"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey={() => 30}
                          name="Obesity Threshold"
                          stroke="#94a3b8"
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No BMI Data</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any BMI data recorded for the selected time period.
                    </p>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-500/90 shadow-md hover:shadow-lg transition-all"
                    >
                      <a href="/bmi-analysis">Calculate BMI</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heart-rate">
            <Card className="border border-primary/20 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
                <CardTitle>Heart Rate Trends</CardTitle>
                <CardDescription>Track your heart rate changes over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {heartRateData.length > 0 ? (
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={heartRateData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="Heart Rate (bpm)"
                          stroke="#ef4444"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Heart Rate Data</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any heart rate data recorded for the selected time period.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blood-pressure">
            <Card className="border border-primary/20 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
                <CardTitle>Blood Pressure Trends</CardTitle>
                <CardDescription>Track your blood pressure changes over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {bloodPressureData.length > 0 ? (
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bloodPressureData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="systolic"
                          name="Systolic (mmHg)"
                          stroke="#3b82f6"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="diastolic"
                          name="Diastolic (mmHg)"
                          stroke="#10b981"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <BarChart2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Blood Pressure Data</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any blood pressure data recorded for the selected time period.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border border-primary/20 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
              <CardTitle>Health Metrics Comparison</CardTitle>
              <CardDescription>Compare your different health metrics</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {metrics.length > 0 ? (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Weight",
                          value: Number.parseFloat(averageWeight),
                          fill: "#3b82f6",
                        },
                        {
                          name: "BMI",
                          value: Number.parseFloat(averageBMI),
                          fill: "#8b5cf6",
                        },
                        {
                          name: "Heart Rate",
                          value: Number.parseFloat(averageHeartRate),
                          fill: "#ef4444",
                        },
                        {
                          name: "Systolic",
                          value: Number.parseFloat(averageSystolic),
                          fill: "#10b981",
                        },
                        {
                          name: "Diastolic",
                          value: Number.parseFloat(averageDiastolic),
                          fill: "#f59e0b",
                        },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Average Value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <BarChart2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Health Data</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any health data recorded for the selected time period.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
              <CardTitle>Health Insights</CardTitle>
              <CardDescription>Personalized insights based on your health data</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {metrics.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-2 text-primary">Weight Trend</h3>
                    <p className="text-sm">
                      {weightData.length > 1 && weightData[weightData.length - 1].value < weightData[0].value
                        ? "Your weight has been decreasing over the selected period. Keep up the good work!"
                        : weightData.length > 1 && weightData[weightData.length - 1].value > weightData[0].value
                          ? "Your weight has been increasing over the selected period. Consider reviewing your diet and exercise routine."
                          : "Your weight has been stable over the selected period."}
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-2 text-primary">BMI Analysis</h3>
                    <p className="text-sm">
                      {Number.parseFloat(averageBMI) < 18.5
                        ? "Your average BMI is in the underweight range. Consider consulting with a healthcare provider about healthy weight gain strategies."
                        : Number.parseFloat(averageBMI) >= 18.5 && Number.parseFloat(averageBMI) < 25
                          ? "Your average BMI is in the healthy range. Keep maintaining your healthy lifestyle!"
                          : Number.parseFloat(averageBMI) >= 25 && Number.parseFloat(averageBMI) < 30
                            ? "Your average BMI is in the overweight range. Consider focusing on balanced nutrition and regular physical activity."
                            : "Your average BMI is in the obese range. It's recommended to consult with a healthcare provider for personalized advice."}
                    </p>
                  </div>

                  {heartRateData.length > 0 && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium mb-2 text-primary">Heart Rate</h3>
                      <p className="text-sm">
                        {Number.parseFloat(averageHeartRate) < 60
                          ? "Your average resting heart rate is below 60 bpm, which may indicate good cardiovascular fitness. However, if you experience symptoms like dizziness or fatigue, consult a healthcare provider."
                          : Number.parseFloat(averageHeartRate) >= 60 && Number.parseFloat(averageHeartRate) <= 100
                            ? "Your average resting heart rate is within the normal range of 60-100 bpm."
                            : "Your average resting heart rate is above 100 bpm. Consider consulting with a healthcare provider, especially if you experience symptoms like shortness of breath or chest pain."}
                      </p>
                    </div>
                  )}

                  {bloodPressureData.length > 0 && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium mb-2 text-primary">Blood Pressure</h3>
                      <p className="text-sm">
                        {Number.parseFloat(averageSystolic) < 120 && Number.parseFloat(averageDiastolic) < 80
                          ? "Your average blood pressure is within the normal range. Keep up the healthy lifestyle!"
                          : Number.parseFloat(averageSystolic) >= 120 &&
                              Number.parseFloat(averageSystolic) < 130 &&
                              Number.parseFloat(averageDiastolic) < 80
                            ? "Your average blood pressure is elevated. Consider lifestyle modifications like reducing sodium intake and increasing physical activity."
                            : Number.parseFloat(averageSystolic) >= 130 || Number.parseFloat(averageDiastolic) >= 80
                              ? "Your average blood pressure is in the hypertension range. It's recommended to consult with a healthcare provider for personalized advice."
                              : "Your blood pressure readings show some variability. Regular monitoring is recommended."}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Insights Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Record your health metrics to receive personalized insights.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
