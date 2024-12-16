import React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { Snippet } from "@/types/snippet"

interface SnippetCardProps {
  snippet: Snippet
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet }) => {
  const navigate = useNavigate()

  return (
    <div className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{snippet.title}</h3>
        <span className="text-sm text-muted-foreground">{snippet.language}</span>
      </div>
      {snippet.description && (
        <p className="text-sm text-muted-foreground mb-4">{snippet.description}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {snippet.tags?.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/edit/${snippet.id}`)}
        >
          Edit
        </Button>
      </div>
    </div>
  )
}

export default SnippetCard 