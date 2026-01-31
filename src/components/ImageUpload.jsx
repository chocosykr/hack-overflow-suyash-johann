'use client'

import { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Loader2, ImagePlus, X } from "lucide-react"

export default function ImageUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    // Create a local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    const formData = new FormData()
    formData.append('file', file)
    // REPLACE 'hackathon_upload' with your actual Unsigned Upload Preset Name
    formData.append('upload_preset', 'hack_overflow_hostel') 
    
    try {
      // Check if it's an image or video to use the correct endpoint
      const resourceType = file.type.startsWith('video/') ? 'video' : 'image'
      // REPLACE 'your_cloud_name' with your actual Cloudinary Cloud Name
      const cloudName = 'db9mwuj3e' 
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: formData
      })
      
      const data = await res.json()
      
      if (data.secure_url) {
        onUploadComplete(data.secure_url)
      } else {
        console.error("Upload failed", data)
        alert("Upload failed!")
        setPreview(null)
      }
    } catch (error) {
      console.error("Error uploading", error)
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {/* Hidden File Input */}
        <Input 
          type="file" 
          accept="image/*,video/*" // Allow both
          onChange={handleFileChange}
          disabled={uploading || preview} // Disable if already uploaded
          className="hidden" 
          id="file-upload"
        />
        
        {!preview ? (
          <label 
            htmlFor="file-upload" 
            className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 text-sm"
          >
            <ImagePlus className="w-4 h-4" />
            {uploading ? "Uploading..." : "Add Photo/Video"}
          </label>
        ) : (
          <div className="relative inline-block border rounded-md overflow-hidden">
            {/* Show Image or Video Preview */}
            <img src={preview} alt="Preview" className="h-20 w-20 object-cover" />
            
            <button 
              type="button"
              onClick={() => { setPreview(null); onUploadComplete(''); }}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
            
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}