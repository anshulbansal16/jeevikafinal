"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowser } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    location: "",
    height: "",
    weight: "",
    concerns: [] as string[],
  })

  const router = useRouter()
  const { user } = useAuth()
  const supabase = getSupabaseBrowser()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        router.push("/login")
        return
      }
      
      // Check if user already has a profile
      try {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        
        // If user already completed onboarding, redirect to dashboard
        if (existingProfile && existingProfile.name) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error checking profile:", error)
      }
    }
    
    checkAuth()
  }, [user, router, supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleConcernToggle = (concern: string) => {
    setFormData((prev) => {
      const concerns = [...prev.concerns]
      if (concerns.includes(concern)) {
        return { ...prev, concerns: concerns.filter((c) => c !== concern) }
      } else {
        return { ...prev, concerns: [...concerns, concern] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to complete onboarding",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsLoading(true)

    try {
      // First check if the profile already exists
      const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      // Prepare profile data
      const profileData = {
        id: user.id,
        email: user.email || '',
        name: formData.name,
        age: formData.age ? Number.parseInt(formData.age) : null,
        gender: formData.gender,
        phone: formData.phone,
        location: formData.location,
        height: formData.height ? Number.parseFloat(formData.height) : null,
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
        updated_at: new Date().toISOString(),
        created_at: existingProfile?.created_at || new Date().toISOString(),
      }

      // If profile exists, update it, otherwise insert it
      const operation = existingProfile ? "update" : "insert"

      let query
      if (operation === "update") {
        query = supabase.from("profiles").update(profileData).eq("id", user.id)
      } else {
        query = supabase.from("profiles").insert(profileData)
      }

      const { error } = await query

      if (error) {
        console.error(`Error ${operation}ing profile:`, error)
        throw new Error(`Error saving profile: ${error.message}`)
      }

      // Save health concerns
      if (formData.concerns.length > 0) {
        // First delete existing concerns to avoid duplicates
        await supabase.from("health_concerns").delete().eq("user_id", user.id)

        const concernsToInsert = formData.concerns.map((concern) => ({
          user_id: user.id,
          concern_type: concern,
          created_at: new Date().toISOString(),
        }))

        const { error: concernsError } = await supabase.from("health_concerns").insert(concernsToInsert)

        if (concernsError) {
          console.error("Error saving health concerns:", concernsError)
          // Don't throw here, we'll still consider the profile save successful
        }
      }

      toast({
        title: "Profile saved",
        description: "Your health profile has been saved successfully.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error in onboarding:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const healthConcerns = [
    "Heart Health",
    "Diabetes",
    "Weight Management",
    "Stress & Mental Health",
    "Sleep Issues",
    "Joint Pain",
    "Digestive Health",
    "Respiratory Health",
  ]

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Complete Your Health Profile</h1>

      <Card className="max-w-2xl mx-auto border border-primary/20">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Tell us about yourself so we can provide personalized health recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-primary/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="35"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="border-primary/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                  <SelectTrigger id="gender" className="border-primary/20 focus-visible:ring-primary">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border-primary/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="New York, USA"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="border-primary/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="border-primary/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="border-primary/20 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Health Concerns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {healthConcerns.map((concern) => (
                  <div key={concern} className="flex items-center space-x-2">
                    <Checkbox
                      id={concern.toLowerCase().replace(/\s+/g, "-")}
                      checked={formData.concerns.includes(concern)}
                      onCheckedChange={() => handleConcernToggle(concern)}
                      className="border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor={concern.toLowerCase().replace(/\s+/g, "-")}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {concern}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-medium border border-primary/20 shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}