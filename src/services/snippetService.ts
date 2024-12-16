import { supabase } from '@/lib/supabase'
import type { CreateSnippetInput, Snippet } from '@/types/snippet'

export const snippetService = {
  async createSnippet(data: CreateSnippetInput, userId: string) {
    // First create the snippet
    const { data: snippet, error: snippetError } = await supabase
      .from('snippets')
      .insert({
        title: data.title,
        description: data.description,
        code: data.code,
        language: data.language,
        is_public: data.is_public,
        user_id: userId,
      })
      .select()
      .single()

    if (snippetError) throw snippetError

    // If there are tags, create them and link them to the snippet
    if (data.tags && data.tags.length > 0) {
      // Create tags if they don't exist
      const { data: tags, error: tagsError } = await supabase
        .from('tags')
        .upsert(
          data.tags.map((name) => ({ name })),
          { onConflict: 'name' }
        )
        .select()

      if (tagsError) throw tagsError

      // Link tags to snippet
      const { error: linkError } = await supabase
        .from('snippet_tags')
        .insert(
          tags.map((tag) => ({
            snippet_id: snippet.id,
            tag_id: tag.id,
          }))
        )

      if (linkError) throw linkError
    }

    return snippet
  },

  async getSnippets(userId: string) {
    const { data, error } = await supabase
      .from('snippets')
      .select(`
        *,
        tags:snippet_tags(
          tag:tags(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Snippet[]
  },

  async getPublicSnippets() {
    const { data, error } = await supabase
      .from('snippets')
      .select(`
        *,
        tags:snippet_tags(
          tag:tags(*)
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Snippet[]
  },

  async getSnippetById(id: string) {
    const { data, error } = await supabase
      .from('snippets')
      .select(`
        *,
        tags:snippet_tags(
          tag:tags(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Snippet
  },

  async updateSnippet(id: string, data: Partial<CreateSnippetInput>) {
    // First update the snippet
    const { data: snippet, error: snippetError } = await supabase
      .from('snippets')
      .update({
        title: data.title,
        description: data.description,
        code: data.code,
        language: data.language,
        is_public: data.is_public,
      })
      .eq('id', id)
      .select()
      .single()

    if (snippetError) throw snippetError

    // If there are tags, update them
    if (data.tags) {
      // Delete existing tags
      const { error: deleteError } = await supabase
        .from('snippet_tags')
        .delete()
        .eq('snippet_id', id)

      if (deleteError) throw deleteError

      if (data.tags.length > 0) {
        // Create new tags
        const { data: tags, error: tagsError } = await supabase
          .from('tags')
          .upsert(
            data.tags.map((name) => ({ name })),
            { onConflict: 'name' }
          )
          .select()

        if (tagsError) throw tagsError

        // Link new tags
        const { error: linkError } = await supabase
          .from('snippet_tags')
          .insert(
            tags.map((tag) => ({
              snippet_id: id,
              tag_id: tag.id,
            }))
          )

        if (linkError) throw linkError
      }
    }

    return snippet
  },

  async deleteSnippet(id: string) {
    const { error } = await supabase
      .from('snippets')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async createVersion(snippetId: string, code: string, userId: string, comment?: string) {
    try {
      // Get the latest version number
      const { data: versions } = await supabase
        .from('snippet_versions')
        .select('version_number')
        .eq('snippet_id', snippetId)
        .order('version_number', { ascending: false })
        .limit(1)

      const nextVersion = (versions?.[0]?.version_number || 0) + 1

      // Create new version
      const { data, error } = await supabase
        .from('snippet_versions')
        .insert({
          snippet_id: snippetId,
          code,
          version_number: nextVersion,
          comment,
          user_id: userId,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating version:', error)
      throw error
    }
  },

  async getVersions(snippetId: string) {
    const { data, error } = await supabase
      .from('snippet_versions')
      .select('*')
      .eq('snippet_id', snippetId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async restoreVersion(snippetId: string, versionId: string) {
    const { data: version, error: versionError } = await supabase
      .from('snippet_versions')
      .select('code')
      .eq('id', versionId)
      .single()

    if (versionError) throw versionError

    const { error: updateError } = await supabase
      .from('snippets')
      .update({ code: version.code })
      .eq('id', snippetId)

    if (updateError) throw updateError
  },

  async getRecentChangedSnippets(userId: string) {
    const { data, error } = await supabase
      .from('snippet_versions')
      .select('*, snippets(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error
    return data
  },

  getPublicSnippetUrl(snippetId: string) {
    return `${window.location.origin}/snippets/${snippetId}`;
  },
} 