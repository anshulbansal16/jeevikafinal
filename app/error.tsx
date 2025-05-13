"use client"

import { useEffect } from "react"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="container mx-auto py-10">
      <Card className="border-red-200 shadow-lg max-w-2xl mx-auto">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-4 text-gray-600">
            We're sorry, but an error occurred while rendering this page. Please try refreshing the page or contact
            support if the problem persists.
          </p>
          <div className="bg-gray-100 p-3 rounded-md mb-4 overflow-auto">
            <p className="font-mono text-sm text-red-600">{error.message}</p>
            {error.digest && <p className="font-mono text-xs text-gray-500 mt-1">Error ID: {error.digest}</p>}
          </div>
          <div className="flex justify-center space-x-4">
            <EnhancedButton onClick={reset} variant="primary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </EnhancedButton>
            <EnhancedButton asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </EnhancedButton>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
