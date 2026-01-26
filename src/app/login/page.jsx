'use client'

import { loginAction } from "../actions/auth"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useActionState } from 'react'        // For the form state/action
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

// Submit Button Component (Shows loading state automatically)
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
      Sign In
    </Button>
  )
}

const initialState = { error: '' }

export default function LoginPage() {
  // Use useFormState to handle server errors (like "Invalid password")
  // @ts-ignore
  const [state, formAction] = useActionState(loginAction, initialState)

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      
      {/* LEFT SIDE: FORM */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                defaultValue="rahul@student.edu" // Pre-fill for demo speed!
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                defaultValue="password123" // Pre-fill for demo speed!
              />
            </div>
            
            {/* Error Message */}
            {state?.error && (
              <p className="text-sm text-red-500 text-center">{state.error}</p>
            )}

            <SubmitButton />
          </form>
          
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline">
              Contact Warden
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: HERO IMAGE */}
      <div className="hidden bg-muted lg:block h-screen sticky top-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop"
          alt="Hostel Campus"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute bottom-10 left-10 text-white z-10">
          <h2 className="text-4xl font-bold mb-2">Smart Hostel</h2>
          <p className="text-lg opacity-90">Report issues instantly. Track resolution in real-time.</p>
        </div>
      </div>
    </div>
  )
}