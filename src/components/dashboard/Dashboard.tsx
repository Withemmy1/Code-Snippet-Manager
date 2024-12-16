import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import {
  Code2,
  Settings,
  PlusCircle,
  Library,
  Search,
} from 'lucide-react'
import { snippetService } from '@/services/snippetService'
import { useToast } from '@/hooks/use-toast'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [recentSnippets, setRecentSnippets] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchRecentSnippets = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const snippets = await snippetService.getRecentChangedSnippets(user.id)
        setRecentSnippets(snippets)
      } catch (error) {
        console.error('Error fetching recent snippets:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch recent snippets',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentSnippets()
  }, [user, toast])

  const menuItems = [
    {
      title: 'My Snippets',
      icon: <Library className="w-4 h-4 mr-2" />,
      path: '/snippets',
    },
    {
      title: 'New Snippet',
      icon: <PlusCircle className="w-4 h-4 mr-2" />,
      path: '/new',
    },
    {
      title: 'Browse Public',
      icon: <Search className="w-4 h-4 mr-2" />,
      path: '/browse',
    },
    {
      title: 'Settings',
      icon: <Settings className="w-4 h-4 mr-2" />,
      path: '/settings',
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.title}</span>
          </Button>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recent Modified Snippets</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : recentSnippets.length === 0 ? (
          <p>No recent snippets found.</p>
        ) : (
          <ul className="space-y-4">
            {recentSnippets.map((snippet) => (
              <li key={snippet.id} className="p-4 border rounded-lg">
                <h3 className="font-medium">{snippet.snippets.title}</h3>
                <p>{snippet.snippets.description}</p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(snippet.created_at).toLocaleString()}
                </p>
                <Button onClick={() => navigate(`/snippets/${snippet.snippets.id}`)}>
                  View Snippet
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <Button onClick={() => navigate('/gallery')} variant="outline">
          View Public Gallery
        </Button>
      </div>
    </div>
  )
}

export default Dashboard 