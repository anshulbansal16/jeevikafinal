"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Activity,
  FileText,
  User,
  BarChart3,
  Calendar,
  Loader2,
  LogOut,
  Plus,
  ChevronRight,
  LineChart,
  CheckCircle,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowser } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface Profile {
  id: string
  email: string
  name: string | null
  age: number | null
  gender: string | null
  height: number | null
  weight: number | null
  location: string | null
}

interface HealthReport {
  id: number
  report_name: string
  report_type: string
  report_url: string | null
  uploaded_at: string
}

interface HealthConcern {
  id: number
  concern_type: string
  created_at: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [reports, setReports] = useState<HealthReport[]>([])
  const [concerns, setConcerns] = useState<HealthConcern[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { user, signOut } = useAuth()
  const supabase = getSupabaseBrowser()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is loaded and authentication state is determined
    if (user === null) {
      console.log("No user found, redirecting to login")
      // If no user is found, redirect to login
      router.push("/login")
      return
    }

    async function loadUserData() {
      try {
        setIsLoading(true)

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError
        }

        if (profileData) {
          setProfile(profileData)
        } else {
          // If profile doesn't exist, redirect to onboarding
          router.push("/onboarding")
          return
        }

        // Fetch health reports
        const { data: reportsData, error: reportsError } = await supabase
          .from("health_reports")
          .select("*")
          .eq("user_id", user.id)
          .order("uploaded_at", { ascending: false })

        if (reportsError) {
          console.error("Error fetching reports:", reportsError)
          // Continue execution instead of throwing
        } else {
          setReports(reportsData || [])
        }

        // Fetch health concerns
        const { data: concernsData, error: concernsError } = await supabase
          .from("health_concerns")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (concernsError) {
          console.error("Error fetching concerns:", concernsError)
          // Continue execution instead of throwing
        } else {
          setConcerns(concernsData || [])
        }
      } catch (error: any) {
        console.error("Error loading user data:", error)
        setError(error.message || "Failed to load user data. Please try again.")
        toast({
          title: "Error",
          description: error.message || "Failed to load user data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [user, router, supabase, toast])

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error: any) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Calculate BMI if height and weight are available
  const bmi =
    profile?.height && profile?.weight
      ? (profile.weight / ((profile.height / 100) * (profile.height / 100))).toFixed(1)
      : null

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
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
                <EnhancedButton onClick={() => router.refresh()} variant="primary">
                  Try Again
                </EnhancedButton>
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
            Dashboard
          </h1>
          <EnhancedButton variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </EnhancedButton>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-primary/20 shadow-md hover:shadow-xl transition-all card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Profile</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.name || "Not set"}</div>
              <p className="text-xs text-muted-foreground">
                {profile?.age ? `${profile.age} years old` : "Age not set"} • {profile?.gender || "Gender not set"}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-md hover:shadow-xl transition-all card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">BMI</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bmi || "Not available"}</div>
              <p className="text-xs text-muted-foreground">
                {profile?.height ? `Height: ${profile.height} cm` : "Height not set"} •
                {profile?.weight ? `Weight: ${profile.weight} kg` : "Weight not set"}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-md hover:shadow-xl transition-all card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Reports</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground">
                {reports.length > 0
                  ? `Last upload: ${new Date(reports[0].uploaded_at).toLocaleDateString()}`
                  : "No reports uploaded"}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-md hover:shadow-xl transition-all card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Concerns</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{concerns.length}</div>
              <p className="text-xs text-muted-foreground">
                {concerns.length > 0
                  ? concerns
                      .map((c) => c.concern_type)
                      .slice(0, 2)
                      .join(", ") + (concerns.length > 2 ? "..." : "")
                  : "No concerns recorded"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Health Reports</TabsTrigger>
            <TabsTrigger value="concerns">Health Concerns</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border border-primary/20 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
                <CardTitle>Your Health Journey</CardTitle>
                <CardDescription>A summary of your health profile and recommendations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium mb-2">Profile Information</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span>{profile?.name || "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{profile?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age:</span>
                        <span>{profile?.age || "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gender:</span>
                        <span>{profile?.gender || "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{profile?.location || "Not set"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Quick Actions</h3>
                    <div className="space-y-2">
                      <EnhancedButton asChild variant="secondary" className="w-full justify-start">
                        <Link href="/bmi-analysis">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          BMI Analysis
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </Link>
                      </EnhancedButton>
                      <EnhancedButton asChild variant="secondary" className="w-full justify-start">
                        <Link href="/ai-reports">
                          <FileText className="mr-2 h-4 w-4" />
                          Analyze Health Reports
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </Link>
                      </EnhancedButton>
                      <EnhancedButton asChild variant="secondary" className="w-full justify-start">
                        <Link href="/health-assistant">
                          <User className="mr-2 h-4 w-4" />
                          Health Assistant
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </Link>
                      </EnhancedButton>
                      <EnhancedButton asChild variant="secondary" className="w-full justify-start">
                        <Link href="/health-trends">
                          <LineChart className="mr-2 h-4 w-4" />
                          Health Trends Dashboard
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </Link>
                      </EnhancedButton>
                      <EnhancedButton asChild variant="secondary" className="w-full justify-start">
                        <Link href="/health-metrics">
                          <Activity className="mr-2 h-4 w-4" />
                          Record Health Metrics
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </Link>
                      </EnhancedButton>
                      <EnhancedButton asChild variant="secondary" className="w-full justify-start">
                        <Link href="/health-recommendations">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Health Recommendations
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </Link>
                      </EnhancedButton>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border border-primary/20 shadow-md">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
                  <CardTitle>Recent Health Reports</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {reports.length > 0 ? (
                    <div className="space-y-3">
                      {reports.slice(0, 3).map((report) => (
                        <div
                          key={report.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{report.report_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(report.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <EnhancedButton size="sm" variant="ghost">
                            View
                          </EnhancedButton>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-muted-foreground mb-3">No health reports uploaded yet.</p>
                      <EnhancedButton asChild variant="primary">
                        <Link href="/ai-reports">
                          <Plus className="mr-2 h-4 w-4" /> Upload Report
                        </Link>
                      </EnhancedButton>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-primary/20 shadow-md">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
                  <CardTitle>Health Concerns</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {concerns.length > 0 ? (
                    <div className="space-y-3">
                      {concerns.map((concern) => (
                        <div
                          key={concern.id}
                          className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{concern.concern_type}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(concern.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-muted-foreground mb-3">No health concerns recorded yet.</p>
                      <EnhancedButton asChild variant="primary">
                        <Link href="/onboarding">
                          <Plus className="mr-2 h-4 w-4" /> Update Profile
                        </Link>
                      </EnhancedButton>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="border border-primary/20 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
                <CardTitle>Your Health Reports</CardTitle>
                <CardDescription>View and manage your uploaded health reports.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{report.report_name}</p>
                            <div className="flex items-center text-xs text-muted-foreground space-x-2">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(report.uploaded_at).toLocaleDateString()}
                              </span>
                              <span className="capitalize">{report.report_type.replace("_", " ")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <EnhancedButton size="sm" variant="outline">
                            View
                          </EnhancedButton>
                          <EnhancedButton size="sm" variant="outline" asChild>
                            <Link href={`/ai-reports?report=${report.id}`}>Analyze</Link>
                          </EnhancedButton>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Health Reports</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't uploaded any health reports yet. Upload a report to get AI-powered insights.
                    </p>
                    <EnhancedButton asChild variant="primary">
                      <Link href="/ai-reports">
                        <Plus className="mr-2 h-4 w-4" /> Upload Health Report
                      </Link>
                    </EnhancedButton>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="concerns">
            <Card className="border border-primary/20 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
                <CardTitle>Your Health Concerns</CardTitle>
                <CardDescription>View and manage your recorded health concerns.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {concerns.length > 0 ? (
                  <div className="space-y-4">
                    {concerns.map((concern) => (
                      <div
                        key={concern.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Activity className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{concern.concern_type}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{new Date(concern.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <EnhancedButton size="sm" variant="outline" asChild>
                          <Link href={`/health-assistant?query=Tell me about ${concern.concern_type}`}>Get Advice</Link>
                        </EnhancedButton>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Health Concerns</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't recorded any health concerns yet. Update your profile to add health concerns.
                    </p>
                    <EnhancedButton asChild variant="primary">
                      <Link href="/onboarding">
                        <Plus className="mr-2 h-4 w-4" /> Update Profile
                      </Link>
                    </EnhancedButton>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
