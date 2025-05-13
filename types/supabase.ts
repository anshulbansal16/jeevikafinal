export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          age: number | null
          gender: string | null
          height: number | null
          weight: number | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          age?: number | null
          gender?: string | null
          height?: number | null
          weight?: number | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          age?: number | null
          gender?: string | null
          height?: number | null
          weight?: number | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      health_reports: {
        Row: {
          id: number
          user_id: string
          report_name: string
          report_type: string
          report_url: string | null
          uploaded_at: string
        }
        Insert: {
          id?: number
          user_id: string
          report_name: string
          report_type: string
          report_url?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          report_name?: string
          report_type?: string
          report_url?: string | null
          uploaded_at?: string
        }
      }
      health_concerns: {
        Row: {
          id: number
          user_id: string
          concern_type: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          concern_type: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          concern_type?: string
          created_at?: string
        }
      }
      health_metrics: {
        Row: {
          id: number
          user_id: string
          metric_type: string
          metric_value: number
          recorded_at: string
        }
        Insert: {
          id?: number
          user_id: string
          metric_type: string
          metric_value: number
          recorded_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
