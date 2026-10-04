// © Janus — yashxsanjay
// Regenerate with: supabase gen types typescript --project-id <your-project-ref> > src/core/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          type: 'builder' | 'company'
          handle: string
          display_name: string
          bio: string | null
          links: Json[]
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'builder' | 'company'
          handle: string
          display_name: string
          bio?: string | null
          links?: Json[]
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          type?: 'builder' | 'company'
          handle?: string
          display_name?: string
          bio?: string | null
          links?: Json[]
          avatar_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Profile = Tables<'profiles'>
