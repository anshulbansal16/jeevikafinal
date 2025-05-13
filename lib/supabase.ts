import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a type for the Supabase client
type SupabaseClient = ReturnType<typeof createClient<Database>>

// For client-side usage
let clientInstance: SupabaseClient | null = null

export const getSupabaseBrowser = () => {
  if (clientInstance) return clientInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")
  }

  clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return clientInstance
}

// For server-side usage
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase URL or Service Role Key is missing")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const supabase = getSupabaseBrowser()
  const { data } = await supabase.auth.getSession()
  return !!data.session
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const supabase = getSupabaseBrowser()
  const { data } = await supabase.auth.getUser()
  return data.user
}
