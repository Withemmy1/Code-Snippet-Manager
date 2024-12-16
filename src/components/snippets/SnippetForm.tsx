import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Editor } from '@monaco-editor/react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { TagInput } from '@/components/snippets/TagInput'
import { LanguageSelect } from '@/components/snippets/LanguageSelect'
import { snippetService } from '@/services/snippetService'
import type { Snippet } from '@/types/snippet'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { VersionHistory } from './VersionHistory'
import html2canvas from 'html2canvas'
import Modal from '@/components/ui/Modal'

const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  code: z.string().min(1, 'Code is required'),
  is_public: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
})

type SnippetFormData = z.infer<typeof snippetSchema>

const SnippetForm: React.FC = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [currentSnippet, setCurrentSnippet] = React.useState<Snippet | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(!id)
  const [code, setCode] = React.useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SnippetFormData>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      language: 'javascript',
      is_public: false,
      tags: [],
    },
  })

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || ''
    setCode(newCode)
    setValue('code', newCode, { shouldValidate: true })
  }

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags)
    setValue('tags', tags)
  }

  const fetchSnippet = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      const data = await snippetService.getSnippetById(id)
      setCurrentSnippet(data)
      setCode(data.code)
      if (!isEditing) {
        setValue('title', data.title)
        setValue('description', data.description || '')
        setValue('language', data.language)
        setValue('code', data.code)
        setValue('is_public', data.is_public)
        if (data.tags) {
          const tags = data.tags.map(t => t.tag.name)
          setSelectedTags(tags)
          setValue('tags', tags)
        }
      }
    } catch (error) {
      console.error('Error fetching snippet:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch snippet',
      })
      navigate('/snippets')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (id) {
      fetchSnippet()
    }
  }, [id])

  const onSubmit = async (data: SnippetFormData) => {
    if (!user) return

    try {
      setIsLoading(true)
      if (id) {
        const currentSnippetData = await snippetService.getSnippetById(id)
        await snippetService.createVersion(
          id, 
          currentSnippetData.code, 
          user.id, 
          'Previous version'
        )

        await snippetService.updateSnippet(id, {
          ...data,
          code: code,
        })

        await snippetService.createVersion(
          id,
          code,
          user.id,
          'Updated snippet'
        )

        toast({
          title: 'Success',
          description: 'Snippet updated successfully',
        })
      } else {
        const newSnippet = await snippetService.createSnippet({
          ...data,
          code: code,
        }, user.id)

        await snippetService.createVersion(
          newSnippet.id,
          code,
          user.id,
          'Initial version'
        )

        toast({
          title: 'Success',
          description: 'Snippet created successfully',
        })
      }
      navigate('/snippets')
    } catch (error) {
      console.error('Error saving snippet:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'create'} snippet`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      await snippetService.deleteSnippet(id)
      toast({
        title: 'Success',
        description: 'Snippet deleted successfully',
      })
      navigate('/snippets')
    } catch (error) {
      console.error('Error deleting snippet:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete snippet',
      })
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const exportSnippet = () => {
    const snippetData = {
      title: watch('title'),
      description: watch('description'),
      code: code,
      language: watch('language'),
      is_public: watch('is_public'),
      tags: selectedTags,
    }

    const blob = new Blob([JSON.stringify(snippetData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${snippetData.title}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importSnippets = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        const snippets = JSON.parse(content)

        // Assuming snippets is an array of snippet objects
        for (const snippet of snippets) {
          await snippetService.createSnippet(snippet, user!.id)
        }

        toast({
          title: 'Success',
          description: 'Snippets imported successfully',
        })
      } catch (error) {
        console.error('Error importing snippets:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to import snippets',
        })
      }
    }
    reader.readAsText(file)
  }

  const shareSnippet = async () => {
    const snippetElement = document.getElementById('snippet-to-share')
    if (!snippetElement) return

    const canvas = await html2canvas(snippetElement)
    const imageData = canvas.toDataURL('image/png')
    setImagePreview(imageData)
    setIsModalOpen(true)
  }

  const handleShare = async () => {
    if (!imagePreview) return

    const blob = await (await fetch(imagePreview)).blob()
    const file = new File([blob], `${watch('title')}.png`, { type: 'image/png' })

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: watch('title'),
          text: 'Check out this code snippet!',
          files: [file],
        })
      } catch (error) {
        console.error('Error sharing snippet:', error)
      }
    } else {
      alert("Your browser doesn't support sharing files. Please download the image and share it manually.")
    }
  }

  const handleSave = () => {
    if (!imagePreview) return

    const link = document.createElement('a')
    link.href = imagePreview
    link.download = `${watch('title')}.png`
    link.click()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {!id ? 'Create New Snippet' : isEditing ? 'Edit Snippet' : 'View Snippet'}
          </h1>
          {id && (
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              )}
              <Button type="button" onClick={shareSnippet}>
                Share Snippet
              </Button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter snippet title"
                  disabled={!isEditing}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter snippet description"
                  disabled={!isEditing}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <LanguageSelect
                  value={watch('language')}
                  onValueChange={(value) => setValue('language', value)}
                  disabled={!isEditing}
                />
                {errors.language && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.language.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Tags</Label>
                <TagInput tags={selectedTags} onChange={handleTagsChange} disabled={!isEditing} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this snippet visible to everyone
                  </p>
                </div>
                <Switch
                  checked={watch('is_public')}
                  onCheckedChange={(checked) => setValue('is_public', checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Code</Label>
              <div className="border rounded-md overflow-hidden">
                <Editor
                  height="400px"
                  language={watch('language')}
                  value={code}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    readOnly: !isEditing || watch('is_public'),
                  }}
                />
              </div>
              {errors.code && (
                <p className="text-sm text-destructive mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-between items-center">
              <Button type="button" onClick={exportSnippet} className="hidden md:block">
                Export Snippet
              </Button>
              <div className="flex items-center gap-4">
                <input type="file" accept=".json" onChange={importSnippets} className="mr-4" />
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? id
                      ? 'Updating...'
                      : 'Creating...'
                    : id
                    ? 'Update Snippet'
                    : 'Create Snippet'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              snippet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {id && (
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Version History</h2>
          </div>
          <VersionHistory
            snippetId={id}
            currentCode={code}
            userId={user!.id}
            onRestore={() => {
              fetchSnippet()
            }}
          />
        </div>
      )}

      <div id="snippet-to-share" style={{ display: 'none' }}>
        <pre style={{ fontSize: '16px', whiteSpace: 'pre-wrap' }}>
          <code>{code}</code>
        </pre>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold">Image Preview</h2>
        {imagePreview && (
          <img src={imagePreview} alt="Snippet Preview" className="border rounded-md" />
        )}
        <div className="flex gap-2 mt-2">
          <Button type="button" onClick={handleShare}>
            Share on Social Media
          </Button>
          <Button type="button" onClick={handleSave}>
            Save to Device
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default SnippetForm 