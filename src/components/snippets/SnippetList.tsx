import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { snippetService } from '@/services/snippetService'
import type { Snippet } from '@/types/snippet'
import { Code2, Clock, Tag, Star } from 'lucide-react'
import { SearchBar } from './SearchBar'
import { cn } from '@/lib/utils'
import { searchService } from '@/services/searchService'

interface SnippetListProps {
  public?: boolean
}

const SnippetList: React.FC<SnippetListProps> = ({ public: isPublic = false }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [snippets, setSnippets] = React.useState<Snippet[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchFilters, setSearchFilters] = React.useState({
    query: '',
    language: '',
    tags: [] as string[],
  })

  React.useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setIsLoading(true)
        const data = await searchService.searchSnippets({
          ...searchFilters,
          userId: isPublic ? undefined : user!.id,
        })
        setSnippets(data)
      } catch (error) {
        console.error('Error fetching snippets:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch snippets',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSnippets()
  }, [user, isPublic, searchFilters, toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const toggleFavorite = async (snippetId: string, isFavorite: boolean) => {
    try {
      await snippetService.updateSnippet(snippetId, { is_favorite: !isFavorite })
      setSnippets(snippets.map(s => 
        s.id === snippetId ? { ...s, is_favorite: !isFavorite } : s
      ))
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update favorite status',
      })
    }
  }

  const exportAllSnippets = async () => {
    try {
      const allSnippets = await snippetService.getSnippets(user!.id)
      const blob = new Blob([JSON.stringify(allSnippets, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'all_snippets.json'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting snippets:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to export snippets',
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {isPublic ? 'Public Snippets' : 'My Snippets'}
          </h1>
          {!isPublic && (
            <Button onClick={() => navigate('/new')}>Create New Snippet</Button>
          )}
        </div>

        <SearchBar onSearch={setSearchFilters} />

        {isLoading ? (
          <div className="text-center py-8">Loading snippets...</div>
        ) : snippets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {isPublic
              ? 'No public snippets available.'
              : 'No snippets yet. Create your first one!'}
          </div>
        ) : (
          <div className="grid gap-4">
            {snippets.map((snippet) => (
              <div
                key={snippet.id}
                className="p-4 border rounded-lg hover:border-primary transition-colors relative"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-medium">{snippet.title}</h3>
                      {snippet.is_public && (
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                          Public
                        </span>
                      )}
                    </div>
                    {snippet.description && (
                      <p className="text-sm text-muted-foreground">
                        {snippet.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(snippet.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {snippet.language}
                      </span>
                    </div>
                    {snippet.tags && snippet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {snippet.tags.map((tagObj) => (
                          <span
                            key={tagObj.tag.id}
                            className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                          >
                            {tagObj.tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="ghost"
                        onClick={() => navigate(`/snippets/${snippet.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(snippet.id, snippet.is_favorite)}
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            snippet.is_favorite && "fill-yellow-400 text-yellow-400"
                          )}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button onClick={exportAllSnippets} variant="outline">
          Export All Snippets
        </Button>
      </div>
    </div>
  )
}

export default SnippetList 