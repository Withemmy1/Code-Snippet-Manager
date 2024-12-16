import { supabase } from '@/lib/supabase'
import type { Snippet } from '@/types/snippet'

export interface SearchFilters {
  query?: string
  language?: string
  tags?: string[]
  isFavorite?: boolean
  userId?: string
}

export const searchService = {
  async searchSnippets(filters: SearchFilters) {
    let query = supabase
      .from('snippets')
      .select(`
        *,
        tags:snippet_tags(
          tag:tags(*)
        ),
        versions:snippet_versions(*)
      `)

    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }

    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
    }

    if (filters.language) {
      query = query.eq('language', filters.language)
    }

    if (filters.isFavorite) {
      query = query.eq('is_favorite', true)
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data as Snippet[]
  }
} 