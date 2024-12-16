export interface Snippet {
  id: string
  title: string
  description: string | null
  code: string
  language: string
  user_id: string
  is_public: boolean
  created_at: string
  updated_at: string
  tags?: {
    tag: Tag
  }[]
}

export interface Tag {
  id: string
  name: string
  created_at: string
}

export interface SnippetVersion {
  id: string
  snippet_id: string
  code: string
  version_number: number
  created_at: string
  comment: string | null
  user_id: string
}

export interface CreateSnippetInput {
  title: string
  description?: string
  code: string
  language: string
  is_public: boolean
  tags?: string[]
}

export interface UpdateSnippetInput extends Partial<CreateSnippetInput> {
  id: string
} 