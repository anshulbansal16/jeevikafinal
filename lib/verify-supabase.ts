import { getSupabaseBrowser } from "./supabase"

export async function verifySupabaseConnection() {
  try {
    const supabase = getSupabaseBrowser()

    // Try to make a simple query to verify the connection
    const { data, error } = await supabase.from("users").select("id").limit(1)

    if (error) {
      console.error("Supabase connection error:", error)
      return {
        connected: false,
        error: error.message,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured",
      }
    }

    return {
      connected: true,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      tables: ["users", "health_metrics", "reports"], // Add your actual tables here
    }
  } catch (err) {
    console.error("Failed to verify Supabase connection:", err)
    return {
      connected: false,
      error: err instanceof Error ? err.message : "Unknown error",
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured",
    }
  }
}
