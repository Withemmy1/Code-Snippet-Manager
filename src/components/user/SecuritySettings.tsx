import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Switch } from '@/components/ui/switch'

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type PasswordFormData = z.infer<typeof passwordSchema>

const SecuritySettings: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onChangePassword = async (data: PasswordFormData) => {
    if (!user) return

    try {
      setIsLoading(true)
      // Implement password change logic here using Supabase
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      })
      reset()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update password',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle2FA = async (enabled: boolean) => {
    try {
      setIsLoading(true)
      // Implement 2FA toggle logic here
      setTwoFactorEnabled(enabled)
      toast({
        title: 'Success',
        description: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update 2FA settings',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Change Password</h3>
        <form onSubmit={handleSubmit(onChangePassword)} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Add an extra layer of security to your account
            </p>
            <p className="text-sm text-muted-foreground">
              We'll ask for a code in addition to your password when you sign in.
            </p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={handleToggle2FA}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">GitHub</p>
              <p className="text-sm text-muted-foreground">
                Connect your GitHub account
              </p>
            </div>
            <Button variant="outline" disabled={isLoading}>
              Connect
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Google</p>
              <p className="text-sm text-muted-foreground">
                Connect your Google account
              </p>
            </div>
            <Button variant="outline" disabled={isLoading}>
              Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecuritySettings 