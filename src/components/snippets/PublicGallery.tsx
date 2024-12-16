import React from 'react'
import { snippetService } from '@/services/snippetService'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

const PublicGallery: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [publicSnippets, setPublicSnippets] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchPublicSnippets = async () => {
      try {
        setIsLoading(true)
        const snippets = await snippetService.getPublicSnippets()
        setPublicSnippets(snippets)
      } catch (error) {
        console.error('Error fetching public snippets:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch public snippets',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublicSnippets()
  }, [toast])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Public Snippets Gallery</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : publicSnippets.length === 0 ? (
        <p>No public snippets available.</p>
      ) : (
        <ul className="space-y-4">
          {publicSnippets.map((snippet) => (
            <li key={snippet.id} className="p-4 border rounded-lg">
              <h3 className="font-medium">{snippet.title}</h3>
              <p>{snippet.description}</p>
              <Button onClick={() => window.open(snippetService.getPublicSnippetUrl(snippet.id), '_blank')}>
                View Snippet
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PublicGallery 