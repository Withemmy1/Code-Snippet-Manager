import React from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, RotateCcw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { snippetService } from '@/services/snippetService'
import { DiffEditor } from '@monaco-editor/react'

interface Version {
  id: string
  snippet_id: string
  code: string
  version_number: number
  comment: string | null
  user_id: string
  created_at: string
}

interface VersionHistoryProps {
  snippetId: string
  currentCode: string
  userId: string
  onRestore: () => void
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  snippetId,
  currentCode,
  userId,
  onRestore,
}) => {
  const { toast } = useToast()
  const [versions, setVersions] = React.useState<Version[]>([])
  const [selectedVersion, setSelectedVersion] = React.useState<Version | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [refreshKey, setRefreshKey] = React.useState(0)

  React.useEffect(() => {
    const fetchVersions = async () => {
      try {
        setIsLoading(true)
        const data = await snippetService.getVersions(snippetId)
        setVersions(data)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch version history',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchVersions()
  }, [snippetId, refreshKey])

  const handleRestore = async (version: Version) => {
    try {
      setIsLoading(true)
      await snippetService.restoreVersion(snippetId, version.id)
      
      await snippetService.createVersion(
        snippetId,
        version.code,
        userId,
        `Restored from version ${version.version_number}`
      )
      
      setRefreshKey(prev => prev + 1)
      toast({
        title: 'Success',
        description: 'Version restored successfully',
      })
      onRestore()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to restore version',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="grid grid-cols-[300px,1fr] gap-4 h-[500px] border rounded-lg bg-background">
      <div className="border-r">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Version History</h3>
        </div>
        <ScrollArea className="h-[calc(500px-57px)]">
          <div className="p-4 space-y-2">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedVersion?.id === version.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedVersion(version)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Version {version.version_number}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRestore(version)
                    }}
                    disabled={isLoading}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Clock className="h-3 w-3" />
                  <span className="opacity-90">{formatDate(version.created_at)}</span>
                </div>
                {version.comment && (
                  <p className="text-sm mt-2 opacity-90">{version.comment}</p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <div className="p-4 border-b">
          <h3 className="font-semibold">Changes</h3>
        </div>
        <div className="h-[calc(500px-57px)]">
          {selectedVersion ? (
            <DiffEditor
              height="100%"
              original={selectedVersion.code}
              modified={currentCode}
              language="javascript"
              theme="vs-dark"
              options={{
                readOnly: true,
                renderSideBySide: true,
                minimap: { enabled: false },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a version to compare
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 