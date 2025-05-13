"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

type ConnectionStatus = {
  connected: boolean
  error?: string
  url?: string
  tables?: string[]
}

export function SupabaseStatus() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const checkConnection = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/verify-supabase")
      const data = await res.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        connected: false,
        error: error instanceof Error ? error.message : "Failed to check connection",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Supabase Connection Status
          {status?.connected ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
        <CardDescription>Connection to your Supabase database</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">Status:</div>
              <div className={`col-span-2 ${status?.connected ? "text-green-500" : "text-red-500"}`}>
                {status?.connected ? "Connected" : "Disconnected"}
              </div>
            </div>

            {status?.url && (
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">URL:</div>
                <div className="col-span-2 truncate">{status.url}</div>
              </div>
            )}

            {status?.error && (
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Error:</div>
                <div className="col-span-2 text-red-500">{status.error}</div>
              </div>
            )}

            {status?.tables && status.tables.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Tables:</div>
                <div className="col-span-2">{status.tables.join(", ")}</div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkConnection} disabled={loading} className="w-full">
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Refresh Connection Status"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
