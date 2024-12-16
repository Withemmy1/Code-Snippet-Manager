export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      snippets: {
        Row: {
          id: string
          title: string
          description: string | null
          code: string
          language: string
          user_id: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          code: string
          language: string
          user_id: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          code?: string
          language?: string
          user_id?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      snippet_tags: {
        Row: {
          snippet_id: string
          tag_id: string
        }
        Insert: {
          snippet_id: string
          tag_id: string
        }
        Update: {
          snippet_id?: string
          tag_id?: string
        }
      }
      snippet_versions: {
        Row: {
          id: string
          snippet_id: string
          code: string
          version_number: number
          comment: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          snippet_id: string
          code: string
          version_number: number
          comment?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          snippet_id?: string
          code?: string
          version_number?: number
          comment?: string | null
          user_id?: string
          created_at?: string
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
      user_role: 'admin' | 'user'
    }
  }
} 