import { NextResponse } from "next/server"
import { verifySupabaseConnection } from "@/lib/verify-supabase"

export async function GET() {
  const connectionStatus = await verifySupabaseConnection()

  return NextResponse.json(connectionStatus)
}
