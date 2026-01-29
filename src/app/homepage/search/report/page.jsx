'use client'

import { useState } from 'react'
import { reportLostItem } from '../../../actions/lostfound' 
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Textarea } from '../../../../components/ui/textarea'
import { Label } from '../../../../components/ui/label'
// Removed Select imports as they are no longer needed
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group"
import { Loader2, UploadCloud, Search, MapPin, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// NOTE: This is a Mock function. Replace with real upload logic for production.
async function uploadImageToCloud(file){
  await new Promise(resolve => setTimeout(resolve, 1000))
  return `https://placehold.co/600x400?text=${encodeURIComponent(file.name)}`
}

export default function ReportLostFoundPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reportType, setReportType] = useState('LOST')
  const [previewUrl, setPreviewUrl] = useState(null)
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    
    // Save reference to form to reset it later
    const formElement = event.currentTarget
    const formData = new FormData(formElement)
    
    try {
      // Handle File Upload
      const fileInput = (formElement.elements.namedItem('image'))
      if (fileInput.files && fileInput.files[0]) {
        const url = await uploadImageToCloud(fileInput.files[0])
        formData.append('imageUrl', url)
      }

      // 1. Capture the result from the server action
      const result = await reportLostItem(formData)

      // 2. Handle the success case
      if (result?.success) {
        alert("Report submitted successfully!")
        formElement.reset() // Clears the form fields
        setPreviewUrl(null) // Clears your image preview state
        // router.push('/homepage/student') // Optional: Redirect the user
        router.push('/homepage/search')
      } else {
        // Handle case where server returns { error: "..." } instead of throwing
        alert(result?.error || "Failed to submit report")
      }
      
    } catch (error) {
      console.error(error)
      alert("An unexpected error occurred.")
    } finally {
      // 3. Always turn off the loading state
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <Link href="/homepage/search" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
          &larr; Back to Lost & Found
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Report an Item</h1>
        <p className="text-gray-500">Help the community by reporting lost or found belongings.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl border shadow-sm">
        
        {/* 1. TYPE SELECTOR */}
        <div className="space-y-3">
          <Label className="text-base">What are you reporting?</Label>
          <RadioGroup 
            name="type" 
            defaultValue="LOST" 
            onValueChange={(val) => setReportType(val)}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="LOST" id="lost" className="peer sr-only" />
              <Label htmlFor="lost" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:text-red-600 cursor-pointer transition-all">
                <Search className="mb-2 h-6 w-6" />
                <span className="font-semibold">I Lost Something</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="FOUND" id="found" className="peer sr-only" />
              <Label htmlFor="found" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:text-green-600 cursor-pointer transition-all">
                <MapPin className="mb-2 h-6 w-6" />
                <span className="font-semibold">I Found Something</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* 2. BASIC DETAILS */}
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Item Name</Label>
            <Input 
              name="title" 
              id="title" 
              placeholder={reportType === 'LOST' ? "e.g. Blue Nike Wallet" : "e.g. Black Casio Watch"} 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* CATEGORY REMOVED HERE */}

            <div className="space-y-2">
              <Label htmlFor="date">Date {reportType === 'LOST' ? 'Lost' : 'Found'}</Label>
              <div className="relative">
                <Input type="date" name="date" required className="pl-10" />
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. LOCATION & DESCRIPTION */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location {reportType === 'LOST' ? 'Last Seen' : 'Found At'}</Label>
            <Input 
              name="location" 
              id="location" 
              placeholder={reportType === 'LOST' ? "e.g. Library 2nd Floor" : "e.g. Near Canteen Entrance"} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              name="description" 
              id="description" 
              placeholder="Provide details like color, brand, scratches, or unique identifiers..." 
              className="h-24"
              required 
            />
          </div>
        </div>

        {/* 4. IMAGE UPLOAD */}
        <div className="space-y-2">
          <Label>Photo (Optional)</Label>
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
              <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded shadow-sm" />
            ) : (
              <>
                <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                <span className="text-xs">Click to upload image</span>
              </>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            reportType === 'LOST' ? "Report Lost Item" : "Report Found Item"
          )}
        </Button>
      </form>
    </div>
  )
}