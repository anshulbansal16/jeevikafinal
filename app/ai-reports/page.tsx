"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FileText, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowser } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { AuthRequired } from "@/components/auth-required"

export default function AIReportsPage() {
  const [activeTab, setActiveTab] = useState("manual")
  const [reportText, setReportText] = useState("")
  const [reportName, setReportName] = useState("")
  const [reportType, setReportType] = useState("blood_test")
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)

  const { user } = useAuth()
  const router = useRouter()
  const supabase = getSupabaseBrowser()
  const { toast } = useToast()

  // We're now using the AuthRequired component instead of this effect

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      // Set default report name from file name
      if (!reportName) {
        setReportName(selectedFile.name.split(".")[0])
      }
    }
  }

  const uploadFile = async (): Promise<string | null> => {
    if (!file || !user) return null

    try {
      setUploadLoading(true)

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage.from("health_reports").upload(fileName, file)

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage.from("health_reports").getPublicUrl(data.path)

      return urlData.publicUrl
    } catch (error: any) {
      console.error("File upload error:", error)
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setUploadLoading(false)
    }
  }

  const saveReport = async (reportUrl: string | null) => {
    if (!user) return

    try {
      // Save report to database
      const { error } = await supabase.from("health_reports").insert({
        user_id: user.id,
        report_name: reportName || "Unnamed Report",
        report_type: reportType,
        report_url: reportUrl,
        report_data: activeTab === "manual" ? { text: reportText } : null,
        uploaded_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Report Saved",
        description: "Your health report has been saved and analyzed successfully.",
      })
    } catch (error: any) {
      console.error("Save report error:", error)
      toast({
        title: "Save Error",
        description: error.message || "Failed to save report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAnalyze = async () => {
    if (activeTab === "manual" && !reportText) return
    if (activeTab === "upload" && !file) return
    if (!reportName) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your report.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Upload file if in upload mode
      let reportUrl = null
      if (activeTab === "upload") {
        reportUrl = await uploadFile()
      }

      // Save report to database
      await saveReport(reportUrl)

      // Simulate AI analysis
      setTimeout(() => {
        setAnalysis(`
Blood Test Analysis Results

Abnormal Values:
- LDL Cholesterol: 165 mg/dL (High) - Normal range: <130 mg/dL
- HDL Cholesterol: 38 mg/dL (Low) - Normal range: >40 mg/dL
- Fasting Blood Sugar: 105 mg/dL (Slightly elevated) - Normal range: 70-99 mg/dL

Interpretation:
Your LDL cholesterol is elevated, which is often referred to as "bad cholesterol" because it can build up in your arteries. Your HDL cholesterol is slightly below the recommended level. HDL is often called "good cholesterol" as it helps remove other forms of cholesterol from your bloodstream. Your fasting blood sugar is slightly elevated, which may indicate prediabetes.

Lifestyle Advice:
1. Consider reducing saturated fats and increasing fiber in your diet
2. Regular physical activity can help improve both cholesterol levels
3. Limit added sugars and refined carbohydrates to help manage blood sugar
4. Consider incorporating more omega-3 fatty acids from sources like fish or flaxseeds

Medical Recommendation:
Based on these results, it would be advisable to consult with your healthcare provider for a more comprehensive evaluation, especially regarding your cholesterol levels and blood sugar. They may recommend lifestyle modifications or further testing.
        `)

        setLoading(false)
      }, 2000)
    } catch (error) {
      setLoading(false)
      console.error("Analysis error:", error)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Health Report Analysis</h1>

      <AuthRequired title="AI Reports Requires Login" description="Please log in to analyze your health reports.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border border-primary/20">
          <CardHeader>
            <CardTitle>Upload Your Health Report</CardTitle>
            <CardDescription>Upload your blood test or other health reports for AI analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  placeholder="Blood Test Results"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  required
                  className="border-primary/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <select
                  id="report-type"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full rounded-md border border-primary/20 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="blood_test">Blood Test</option>
                  <option value="cholesterol">Cholesterol</option>
                  <option value="glucose">Glucose</option>
                  <option value="general">General Health</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="manual">Enter Values</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Select File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="border-primary/20 focus-visible:ring-primary"
                    />
                  </div>

                  {file && (
                    <div className="text-sm">
                      Selected file: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="manual" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-values">Enter Report Values</Label>
                    <Textarea
                      id="report-values"
                      placeholder="Enter your blood test values, one per line. Example:
Hemoglobin: 14.2 g/dL
LDL Cholesterol: 110 mg/dL
HDL Cholesterol: 45 mg/dL
Fasting Blood Sugar: 92 mg/dL"
                      className="min-h-[200px] border-primary/20 focus-visible:ring-primary"
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleAnalyze}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={
                loading ||
                uploadLoading ||
                (activeTab === "manual" && !reportText) ||
                (activeTab === "upload" && !file) ||
                !reportName
              }
            >
              {loading || uploadLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadLoading ? "Uploading..." : "Analyzing..."}
                </>
              ) : (
                "Analyze Report"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-primary/20">
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
            <CardDescription>Personalized interpretation of your health report</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <p className="mt-4 text-muted-foreground">Analyzing your health report...</p>
                </div>
              </div>
            ) : analysis ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line">{analysis}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="bg-muted/50 rounded-full p-6">
                  <FileText className="h-12 w-12 text-primary/60" />
                </div>
                <p className="text-muted-foreground">
                  Upload your health report or enter values manually to get an AI-powered analysis.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </AuthRequired>
    </div>
  )
}
