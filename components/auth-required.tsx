"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogIn, Lock } from "lucide-react"

interface AuthRequiredProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function AuthRequired({ 
  children, 
  title = "Authentication Required", 
  description = "You need to be logged in to access this feature." 
}: AuthRequiredProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // If not loading and no user, show login prompt
  if (!loading && !user) {
    return (
      <Card className="max-w-3xl mx-auto border border-primary/20 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Lock className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground mb-6">
              {description}
            </p>
            <Button 
              variant="default" 
              className="bg-gradient-to-r from-primary to-blue-600 text-white"
              onClick={() => router.push('/login')}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login to Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If loading, you could show a loading spinner here
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If user is authenticated, render children
  return <>{children}</>
}