import { getSupabaseBrowser } from "./supabase";

export type UserProfile = {
  name?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  location?: string;
  phone?: string;
};

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = getSupabaseBrowser();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    // Get user profile from profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    
    return profile;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
}