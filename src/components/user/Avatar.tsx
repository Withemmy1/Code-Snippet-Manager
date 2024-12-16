import React from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { userService } from '@/services/userService'

interface AvatarUploadProps {
  userId?: string
  currentUrl?: string
  onUploadComplete: (url: string) => void
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  userId,
  currentUrl,
  onUploadComplete,
}) => {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = React.useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !userId) return

    try {
      setIsUploading(true)
      const publicUrl = await userService.uploadAvatar(userId, file)
      onUploadComplete(publicUrl)
      toast({
        title: 'Success',
        description: 'Avatar uploaded successfully',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to upload avatar',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20">
        {currentUrl ? (
          <img
            src={currentUrl}
            alt="Avatar"
            className="rounded-full object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl text-muted-foreground">?</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="avatar-upload"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label htmlFor="avatar-upload">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="cursor-pointer"
            asChild
          >
            <span>
              {isUploading ? 'Uploading...' : 'Change Avatar'}
            </span>
          </Button>
        </label>
      </div>
    </div>
  )
} 