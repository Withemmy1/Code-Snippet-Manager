import { supabase } from '@/lib/supabase'
import { Profile, UpdateProfileData } from '@/types/user'

export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data as Profile
  },

  async updateProfile(userId: string, profile: UpdateProfileData) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data as Profile
  },

  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return publicUrl
  }
} 