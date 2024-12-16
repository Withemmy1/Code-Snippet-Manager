import React from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast'

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

const Login: React.FC = () => {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { error } = await signIn(data.email, data.password)
      if (error) throw error
      
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      })
      navigate('/')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid email or password.",
      })
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => navigate("/register")}
          >
            Don't have an account? Register
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login 