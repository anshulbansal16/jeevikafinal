import { SupabaseStatus } from "@/components/supabase-status"

export default function SupabaseStatusPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Status</h1>
      <p className="mb-6 text-gray-600">
        This page helps you verify that your Supabase connection is working correctly with your new Vercel deployment.
      </p>
      <SupabaseStatus />
    </div>
  )
}
