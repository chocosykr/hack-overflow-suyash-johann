'use client'

import { useState } from 'react'
import { createIssue } from '../app/actions/CreateIssue' // Using your path
import { getBlocks } from '../app/actions/location' // Using your path
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { Loader2, UploadCloud, Lock, Globe, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CreateIssueForm({ categories, userRole, hostels }) {
  // --- 1. STATE FOR UPLOAD & FORM ---
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploadStatus, setUploadStatus] = useState("")
  const router = useRouter()

  // --- 2. STATE FOR STAFF OVERRIDE ---
  const [selectedHostel, setSelectedHostel] = useState("")
  const [blocks, setBlocks] = useState([])
  const [blocksLoading, setBlocksLoading] = useState(false)
  const isStaff = userRole === 'STAFF' || userRole === 'ADMIN'

  // --- 3. CLOUDINARY CONFIG ---
  // TODO: Replace with your actual Cloudinary values
  const CLOUD_NAME = "db9mwuj3e" 
  const UPLOAD_PRESET = "hack_overflow_hostel" 

  // --- 4. HANDLERS ---
  
  // Handler: When Hostel Changes -> Fetch Blocks
  const handleHostelChange = async (hostelId) => {
    setSelectedHostel(hostelId)
    setBlocks([]) 
    setBlocksLoading(true)
    
    try {
      const fetchedBlocks = await getBlocks(hostelId)
      setBlocks(fetchedBlocks)
    } catch (error) {
      console.error("Failed to load blocks", error)
    } finally {
      setBlocksLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setUploadStatus("")
    
    const formElement = event.currentTarget;
    const formData = new FormData(formElement)
    
    // A. HANDLE IMAGE UPLOAD
    const fileInput = formElement.querySelector('input[name="image"]')
    const file = fileInput?.files?.[0]

    if (file) {
      setUploadStatus("Uploading image...")
      try {
        const uploadData = new FormData()
        uploadData.append('file', file)
        uploadData.append('upload_preset', UPLOAD_PRESET)

        const resourceType = file.type.startsWith('video/') ? 'video' : 'image'

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
          { method: 'POST', body: uploadData }
        )

        if (!response.ok) throw new Error('Upload failed')
        const data = await response.json()
        
        formData.append('mediaUrl', data.secure_url) 
        formData.delete('image')
        
      } catch (error) {
        console.error("Cloudinary Error:", error)
        alert("Image upload failed. Please try again.")
        setIsSubmitting(false)
        return
      }
    }

    // B. APPEND MANUAL FIELDS
    formData.set('visibility', isPublic ? 'PUBLIC' : 'PRIVATE')

    // C. HANDLE STAFF LOCATION
    if (isStaff && selectedHostel) {
       formData.set('hostelId', selectedHostel)
       // The blockId is already in formData because the Select has name="blockId"
    }

    // D. SUBMIT TO SERVER
    try {
      setUploadStatus("Saving issue...")
      const result = await createIssue(formData)
      
      if (result?.success) {
        alert("Issue reported successfully!")
        formElement.reset()
        setPreviewUrl(null)
        setUploadStatus("")
        router.push('/homepage/student')
        router.refresh()
      } else if (result?.error) {
        alert(result.error)
      }
    } catch (error) {
      console.error(error)
      alert("A network error occurred.")
    } finally {
      setIsSubmitting(false)
      setUploadStatus("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold">Report an Issue</h2>
        <p className="text-sm text-gray-500">
           {isStaff ? "Staff Mode: Manual Location Selection" : "We will auto-tag your room location."}
        </p>
      </div>

      {/* TITLE */}
      <div className="space-y-2">
        <Label htmlFor="title">Issue Title</Label>
        <Input name="title" id="title" placeholder="e.g. Fan not working" required />
      </div>

      {/* CATEGORY & PRIORITY */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
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

      {/* DESCRIPTION */}
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

      {/* IMAGE UPLOAD AREA */}
      <div className="space-y-2">
        <Label>Attach Photo/Video (Optional)</Label>
        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition bg-slate-50 relative">
          <input 
            type="file" 
            name="image" 
            accept="image/*,video/*"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setPreviewUrl(URL.createObjectURL(file))
              else setPreviewUrl(null)
            }}
          />
          {previewUrl ? (
            <div className="relative z-20">
              <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded" />
              <button 
                type="button"
                onClick={(e) => {
                    e.preventDefault(); 
                    setPreviewUrl(null);
                    const input = document.querySelector('input[name="image"]');
                    if(input) input.value = "";
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
              <span className="text-xs">Click to upload image or video</span>
            </>
          )}
        </div>
      </div>

      {/* STAFF LOCATION OVERRIDE (Conditional) */}
      {isStaff && (
        <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200 space-y-4">
          <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">
            Staff Location Override
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hostel</Label>
              <Select 
                name="hostelId" 
                required 
                onValueChange={handleHostelChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Hostel" />
                </SelectTrigger>
                <SelectContent>
                  {hostels.map((hostel) => (
                    <SelectItem key={hostel.id} value={hostel.id}>
                      {hostel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Block</Label>
              <Select name="blockId" required disabled={!selectedHostel || blocksLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={blocksLoading ? "Loading..." : "Select Block"} />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map((block) => (
                    <SelectItem key={block.id} value={block.id}>
                      {block.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* VISIBILITY TOGGLE */}
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

      {/* SUBMIT BUTTON */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {uploadStatus || "Submitting..."}
          </>
        ) : (
          "Submit Report"
        )}
      </Button>
    </form>
  )
}