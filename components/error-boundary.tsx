"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught error:", error)
      setHasError(true)
      setError(error.error)
    }

    window.addEventListener("error", errorHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
    }
  }, [])

  if (hasError) {
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
            {error && (
              <div className="bg-gray-100 p-3 rounded-md mb-4 overflow-auto">
                <p className="font-mono text-sm text-red-600">{error.message}</p>
              </div>
            )}
            <div className="flex justify-center">
              <EnhancedButton onClick={() => window.location.reload()} variant="primary">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Page
              </EnhancedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
