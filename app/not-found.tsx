import Link from "next/link"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto py-10">
      <Card className="border-blue-200 shadow-lg max-w-2xl mx-auto">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center text-blue-600">
            <FileQuestion className="mr-2 h-5 w-5" />
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">404</h2>
            <p className="text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
          </div>
          <EnhancedButton asChild variant="primary">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </EnhancedButton>
        </CardContent>
      </Card>
    </div>
  )
}
