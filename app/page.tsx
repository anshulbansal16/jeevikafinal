import Link from "next/link"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Activity, Heart, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-12">
      {/* Hero Section with Gradient Background */}
      <div className="max-w-4xl mx-auto text-center mb-16 p-8 rounded-2xl gradient-bg-1">
        <h1 className="text-4xl font-bold tracking-tight mb-4 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          AI-Powered Health Check-Up Recommendations
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Get personalized health check-up recommendations based on your health profile and concerns.
        </p>
        <div className="flex flex-wrap justify-center">
          <EnhancedButton asChild variant="primary" size="xl" className="animate-pulse-slow">
            <Link href="/login">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </EnhancedButton>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 bg-secondary/50 rounded-2xl mb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center card-hover">
              <div className="bg-primary/10 p-6 rounded-full mb-6 shadow-lg">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Reports</h3>
              <p className="text-muted-foreground">Upload your medical reports and get AI-powered insights.</p>
            </div>
            <div className="flex flex-col items-center text-center card-hover">
              <div className="bg-primary/10 p-6 rounded-full mb-6 shadow-lg">
                <Activity className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground">Our AI analyzes your reports and health profile.</p>
            </div>
            <div className="flex flex-col items-center text-center card-hover">
              <div className="bg-primary/10 p-6 rounded-full mb-6 shadow-lg">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
              <p className="text-muted-foreground">Receive personalized health check-up recommendations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border border-primary/20 shadow-lg hover:shadow-xl transition-all card-hover">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
              <CardTitle className="text-primary">AI Report Analysis</CardTitle>
              <CardDescription>Understand your medical reports with AI assistance</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>Upload medical reports in various formats</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>Get explanations in simple language</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>Receive personalized health insights</span>
                </li>
              </ul>
              <EnhancedButton asChild variant="primary" className="w-full">
                <Link href="/ai-reports">
                  Try Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </EnhancedButton>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-lg hover:shadow-xl transition-all card-hover">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
              <CardTitle className="text-primary">BMI Analysis</CardTitle>
              <CardDescription>Calculate and understand your Body Mass Index</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>Calculate your BMI instantly</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>Get personalized fitness recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>Track your progress over time</span>
                </li>
              </ul>
              <EnhancedButton asChild variant="primary" className="w-full">
                <Link href="/bmi-analysis">
                  Check BMI <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </EnhancedButton>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-lg hover:shadow-xl transition-all card-hover">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
              <CardTitle className="text-primary">Health Assistant</CardTitle>
              <CardDescription>Your personal AI health companion</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>Chat with AI about health concerns</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>Get answers to health questions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>Available 24/7 for your health queries</span>
                </li>
              </ul>
              <EnhancedButton asChild variant="primary" className="w-full">
                <Link href="/health-assistant">
                  Ask Questions <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </EnhancedButton>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-secondary/50 rounded-2xl mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-lg">
              <p className="italic mb-4">
                "This platform helped me understand my blood test results in simple terms. The AI recommendations were
                spot on!"
              </p>
              <p className="font-semibold">- Sarah J.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-lg">
              <p className="italic mb-4">
                "I've been tracking my BMI and following the recommendations. Lost 10 pounds in 2 months!"
              </p>
              <p className="font-semibold">- Michael T.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-lg">
              <p className="italic mb-4">
                "The health assistant answered all my questions about my recent diagnosis. Very helpful and
                informative."
              </p>
              <p className="font-semibold">- Lisa R.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 mt-16 text-center">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          Ready to Take Control of Your Health?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who are making informed health decisions with Eazypaths.
        </p>
        <EnhancedButton asChild variant="primary" size="xl" className="animate-pulse-slow">
          <Link href="/login">
            Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </EnhancedButton>
      </div>
    </div>
  )
}
