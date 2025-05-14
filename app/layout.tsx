import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { FloatingAssistant } from "@/components/floating-assistant"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Eazypaths - Health Check-Up Recommendations",
  description: "AI-Powered Health Check-Up Recommendation Platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-background">
              <Navbar />
              <main className="flex-1 bg-background">{children}</main>
              <footer className="border-t py-6 bg-background">
                <div className="container mx-auto text-center">
                  <p className="text-sm text-muted-foreground">© 2025 Eazypaths. All rights reserved.</p>
                </div>
              </footer>
              <FloatingAssistant />
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
