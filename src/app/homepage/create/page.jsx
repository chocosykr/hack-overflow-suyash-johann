'use client'

import { useState } from 'react'
import { createIssue } from '../../actions/CreateIssue'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Switch } from "../../../components/ui/switch"
import { Loader2, UploadCloud, Lock, Globe } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'

// Mock Upload Function - Replace this with real UploadThing logic later
async function uploadImageToCloud(file) {
  // Simulating upload delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Return a fake URL for demo purposes
  return `https://placehold.co/600x400?text=${encodeURIComponent(file.name)}`
}

export default function CreateIssueForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [previewUrl, setPreviewUrl] = useState(null)
  const router = useRouter()
  
  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(event.currentTarget)
    
    // Handle File Upload
    const fileInput = (event.currentTarget.elements.namedItem('image')  )
    if (fileInput.files && fileInput.files[0]) {
      const url = await uploadImageToCloud(fileInput.files[0])
      formData.append('mediaUrl', url)
    }

    // Handle Switch Value manually
    formData.append('visibility', isPublic ? 'PUBLIC' : 'PRIVATE')

    try {
      // 1. Call the server action
      if (result?.success) {
        // Success Logic
        alert("Issue reported successfully!")
        formElement.reset()      // Clear the text fields
        setPreviewUrl(null)      // Clear the image preview
        router.push('/homepage/student')
        // Optional: router.push('/dashboard') or similar
      } else if (result?.error) {
        // Handle custom errors returned from server (like "Profile incomplete")
        alert(result.error)
      }
    } catch (error) {
      console.error(error)
      alert("A network error occurred.")
    } finally {
      setIsSubmitting(false)
    }

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-xl shadow-sm border">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Report an Issue</h2>
        <p className="text-sm text-gray-500">We will auto-tag your room location.</p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Issue Title</Label>
        <Input name="title" id="title" placeholder="e.g. Fan not working" required />
      </div>

      {/* Category & Priority Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Plumbing">Plumbing</SelectItem>
              <SelectItem value="Internet">Internet</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="Cleanliness">Cleanliness</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select name="priority" required defaultValue="LOW">
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH" className="text-orange-500 font-medium">High</SelectItem>
              <SelectItem value="EMERGENCY" className="text-red-600 font-bold">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          name="description" 
          id="description" 
          placeholder="Describe the problem in detail..." 
          className="h-32"
          required 
        />
      </div>

      {/* Image Upload Area */}
      <div className="space-y-2">
        <Label>Attach Photo (Optional)</Label>
        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition bg-slate-50 relative">
          <input 
            type="file" 
            name="image" 
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setPreviewUrl(URL.createObjectURL(file))
            }}
          />
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded" />
          ) : (
            <>
              <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
              <span className="text-xs">Click to upload image</span>
            </>
          )}
        </div>
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2">
          {isPublic ? <Globe className="w-4 h-4 text-blue-500" /> : <Lock className="w-4 h-4 text-gray-500" />}
          <div className="flex flex-col">
            <span className="font-medium text-sm">{isPublic ? "Public Issue" : "Private Issue"}</span>
            <span className="text-xs text-gray-500">
              {isPublic ? "Visible to hostel mates" : "Only visible to Warden"}
            </span>
          </div>
        </div>
        <Switch 
          checked={isPublic} 
          onCheckedChange={setIsPublic} 
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Report"
        )}
      </Button>
    </form>
  )
}