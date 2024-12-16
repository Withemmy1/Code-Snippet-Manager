import { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface UserWithProfile extends User {
  profile?: Profile
}

export interface UpdateProfileData {
  full_name?: string
  avatar_url?: string
} 