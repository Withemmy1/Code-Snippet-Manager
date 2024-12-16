import React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LanguageSelect } from './LanguageSelect'
import { TagInput } from './TagInput'

interface SearchBarProps {
  onSearch: (filters: {
    query: string
    language: string
    tags: string[]
  }) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = React.useState('')
  const [language, setLanguage] = React.useState('')
  const [tags, setTags] = React.useState<string[]>([])

  const handleSearch = () => {
    onSearch({ query, language, tags })
  }

  const handleClear = () => {
    setQuery('')
    setLanguage('')
    setTags([])
    onSearch({ query: '', language: '', tags: [] })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={handleClear}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-4">
        <div className="w-48">
          <LanguageSelect
            value={language}
            onValueChange={setLanguage}
            includeAny
          />
        </div>
        <div className="flex-1">
          <TagInput
            tags={tags}
            onChange={setTags}
            placeholder="Filter by tags..."
          />
        </div>
      </div>
    </div>
  )
} 