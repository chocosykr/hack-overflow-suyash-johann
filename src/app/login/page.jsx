'use client'

import { loginAction } from "../actions/auth"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2, Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Submit Button Component with gradient
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all h-11" 
      type="submit" 
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Signing in...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </>
      )}
    </Button>
  )
}

const initialState = { error: '' }

export default function LoginPage() {
  // @ts-ignore
  const [state, formAction] = useActionState(loginAction, initialState)

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:grid-cols-5">
      
      {/* LEFT SIDE: FORM */}
      <div className="flex items-center justify-center py-12 px-4 lg:col-span-1 xl:col-span-2 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
        <div className="mx-auto w-full max-w-md space-y-8">
          
          {/* Logo/Brand */}
          <div className="text-center">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">H</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2 font-medium">
              Sign in to access your hostel dashboard
            </p>
          </div>
          
          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 space-y-6">
            <form action={formAction} className="space-y-5">
              
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    defaultValue="student@demo.com"
                    className="h-11 pl-4 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Password
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    defaultValue="password123"
                    placeholder="Enter your password"
                    className="h-11 pl-4 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              
              {/* Error Message */}
              {state?.error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">Authentication Failed</p>
                    <p className="text-sm text-red-700 mt-0.5">{state.error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <SubmitButton />
            </form>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 font-semibold">
                  Need help?
                </span>
              </div>
            </div>
            
            {/* Footer Links */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                  Contact Warden
                
              </p>
              <p className="text-xs text-gray-500">
                For students and staff of campus hostels
              </p>
            </div>
          </div>

          {/* Demo Credentials Notice */}
<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
  <p className="text-xs font-bold text-blue-900 flex items-center justify-center gap-1">
    🎯 Student Demo Access
  </p>
  <p className="text-[11px] text-blue-700 mt-1 leading-relaxed">
    Credentials pre-filled. Click <strong>"Sign In"</strong> to continue.<br />
    For Staff/Admin roles, please refer to the GitHub README.
  </p>
</div>
        </div>
      </div>

      {/* RIGHT SIDE: HERO IMAGE */}
      <div className="hidden lg:block lg:col-span-1 xl:col-span-3 h-screen sticky top-0 overflow-hidden relative">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop"
          alt="Hostel Campus"
          className="h-full w-full object-cover brightness-[0.85]"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/40 to-purple-900/60"></div>
        
        {/* Decorative Blur Circles */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          
          {/* Top: Brand */}
          <div>
            <h2 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              HostelMate
            </h2>
            <p className="text-xl text-blue-100 font-medium">
              Smart Issue Tracking System
            </p>
          </div>
          
          {/* Bottom: Features */}
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-4xl font-bold mb-4 leading-tight">
                Report issues instantly.<br />
                Track resolution in real-time.
              </h3>
              <p className="text-lg text-blue-100 font-medium leading-relaxed">
                No more lost complaints in WhatsApp groups. Get complete transparency and accountability.
              </p>
            </div>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-sm font-semibold">⚡ Lightning Fast</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-sm font-semibold">🔒 Secure</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-sm font-semibold">📊 Analytics</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-3xl font-bold">3x</p>
                <p className="text-sm text-blue-200 mt-1">Faster Resolution</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-3xl font-bold">95%</p>
                <p className="text-sm text-blue-200 mt-1">Issue Tracking</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-blue-200 mt-1">Availability</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}