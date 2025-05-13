"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowser } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus } from "lucide-react"

interface AddHealthMetricProps {
  metricType: string
  metricValue: number
  onSuccess?: () => void
}

export function AddHealthMetric({ metricType, metricValue, onSuccess }: AddHealthMetricProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const supabase = getSupabaseBrowser()
  const { toast } = useToast()

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      // Insert the new metric
      const { error } = await supabase.from("health_metrics").insert({
        user_id: user.id,
        metric_type: metricType,
        metric_value: metricValue,
        recorded_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Metric Saved",
        description: "Your health metric has been saved successfully.",
      })

      if (onSuccess) {
        onSuccess()
      }
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

  return (
    <Button
      onClick={handleSave}
      className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-500/90 shadow-md hover:shadow-lg transition-all"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Save as Health Metric
        </>
      )}
    </Button>
  )
}
