import React from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [input, setInput] = React.useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    const trimmedInput = input.trim().toLowerCase()
    if (trimmedInput && !tags.includes(trimmedInput)) {
      onChange([...tags, trimmedInput])
    }
    setInput('')
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-primary/80"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags (press Enter or comma to add)"
        />
        <Button type="button" onClick={addTag} variant="outline">
          Add
        </Button>
      </div>
    </div>
  )
} 