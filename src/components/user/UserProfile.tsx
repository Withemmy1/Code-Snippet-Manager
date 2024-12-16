import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { userService } from '@/services/userService'
import { Avatar } from '@/components/user/Avatar'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  avatar_url: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const UserProfile: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return

    try {
      setIsLoading(true)
      await userService.updateProfile(user.id, data)
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              {...register('full_name')}
              placeholder="Enter your full name"
            />
            {errors.full_name && (
              <p className="text-sm text-destructive mt-1">
                {errors.full_name.message}
              </p>
            )}
          </div>
          <div>
            <Label>Profile Picture</Label>
            <AvatarUpload
              userId={user?.id}
              currentUrl={user?.user_metadata?.avatar_url}
              onUploadComplete={(url) => setValue('avatar_url', url)}
            />
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}

export default UserProfile 