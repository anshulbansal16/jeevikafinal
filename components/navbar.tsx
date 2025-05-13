"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { 
  Moon, 
  Sun, 
  Menu, 
  LogOut, 
  User, 
  Home, 
  BarChart2, 
  FileText, 
  Heart, 
  LayoutDashboard 
} from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"
import { Logo } from "./logo"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setTheme } = useTheme()
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "U"
    return user.email.charAt(0).toUpperCase()
  }

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (pathname === "/") return "home"
    if (pathname === "/bmi-analysis") return "bmi"
    if (pathname === "/ai-reports") return "reports"
    if (pathname === "/health-assistant") return "assistant"
    if (pathname === "/dashboard") return "dashboard"
    return "home"
  }

  return (
    <div className="bg-background border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-accent rounded-md"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4 flex-grow justify-center">
            <Tabs defaultValue={getActiveTab()} className="w-fit">
              <TabsList className="bg-muted/60 h-10">
                <TabsTrigger value="home" asChild className="px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Link href="/" className="flex items-center space-x-1">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </TabsTrigger>
                
                {user && (
                  <TabsTrigger value="dashboard" asChild className="px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    <Link href="/dashboard" className="flex items-center space-x-1">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </TabsTrigger>
                )}
                
                <TabsTrigger value="bmi" asChild className="px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Link href="/bmi-analysis" className="flex items-center space-x-1">
                    <BarChart2 className="h-4 w-4" />
                    <span>BMI Analysis</span>
                  </Link>
                </TabsTrigger>
                
                <TabsTrigger value="reports" asChild className="px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Link href="/ai-reports" className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>AI Reports</span>
                  </Link>
                </TabsTrigger>
                
                <TabsTrigger value="assistant" asChild className="px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Link href="/health-assistant" className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>Health Assistant</span>
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-muted/40 px-3 py-1 rounded-full">
                  <Avatar className="h-7 w-7 bg-primary/10">
                    <AvatarFallback className="text-primary text-sm">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-muted-foreground max-w-[120px] truncate">
                    {user.email}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 border-primary/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white font-medium border border-primary/20 shadow-md"
              >
                <Link href="/login" className="flex items-center space-x-1">
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link
              href="/"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md",
                pathname === "/" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            {user && (
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md",
                  pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            )}
            
            <Link
              href="/bmi-analysis"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md",
                pathname === "/bmi-analysis" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart2 className="h-5 w-5" />
              <span>BMI Analysis</span>
            </Link>
            
            <Link
              href="/ai-reports"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md",
                pathname === "/ai-reports" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="h-5 w-5" />
              <span>AI Reports</span>
            </Link>
            
            <Link
              href="/health-assistant"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md",
                pathname === "/health-assistant" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="h-5 w-5" />
              <span>Health Assistant</span>
            </Link>
            
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium">Theme</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTheme("light")
                    setIsMenuOpen(false)
                  }}
                  className="border-primary/20 bg-background text-foreground"
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTheme("dark")
                    setIsMenuOpen(false)
                  }}
                  className="border-primary/20 bg-background text-foreground"
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="px-3 pt-2">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 bg-primary/10">
                      <AvatarFallback className="text-primary">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate max-w-[150px]">{user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-primary/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium border border-primary/20 shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/login" className="flex items-center justify-center">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}