'use client'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog" // Assuming you have shadcn dialog

export default function MediaGallery({ imageUrls }) {
  if (!imageUrls || imageUrls.length === 0) return null

  // Cloudinary videos usually have "/video/upload" in the URL, images have "/image/upload"
  const isVideo = (url) => url.includes('/video/') || url.endsWith('.mp4') || url.endsWith('.webm')

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mt-3">
      {imageUrls.map((url, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <div className="relative h-24 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border hover:opacity-90 transition">
              {isVideo(url) ? (
                <video src={url} className="h-full w-full object-cover" />
              ) : (
                <img src={url} alt="Evidence" className="h-full w-full object-cover" />
              )}
            </div>
          </DialogTrigger>
          <DialogTitle className="sr-only">
              Attachment Preview
            </DialogTitle>
          <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/90 border-none">
            <div className="flex items-center justify-center h-[80vh]">
              {isVideo(url) ? (
                <video src={url} controls className="max-h-full max-w-full" autoPlay />
              ) : (
                <img src={url} alt="Evidence" className="max-h-full max-w-full object-contain" />
              )}
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}