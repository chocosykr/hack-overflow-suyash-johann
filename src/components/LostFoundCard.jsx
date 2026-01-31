'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { submitClaim, markAsFound } from '../app/actions/lostfound'
import { MapPin, Calendar, HelpCircle, CheckCircle } from 'lucide-react'
import MediaGallery from './MediaGallery' // Import the gallery component

export default function LostFoundCard({ item, currentUserId, canClaim }) {
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState("")

  const isMyUpload = item.reporterId === currentUserId
  const iHaveClaimed = item.claims && item.claims.length > 0
  
  // FIX: Handle the array from Prisma (imageUrls) instead of singular (imageUrl)
  const coverImage = item.imageUrls?.[0] || null

  async function handleClaim(formData) {
    setError(""); 
    const result = await submitClaim(formData);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setIsClaiming(false); 
    }
  }

  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden hover:shadow-md transition-shadow">
      
      {/* 1. THUMBNAIL SECTION (Left Side) */}
      {/* Only show this sidebar if there is an image, otherwise the card looks cleaner without the grey box */}
      <div className="sm:w-32 bg-gray-100 flex items-center justify-center shrink-0 min-h-[120px]">
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={item.title} 
            className="h-full w-full object-cover" 
          />
        ) : (
          <HelpCircle className="h-10 w-10 text-gray-300" />
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <span className="text-xs text-muted-foreground">{item.category}</span>
            </div>
            <Badge variant={item.status === 'LOST' ? "destructive" : "default"}>
              {item.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="text-sm pb-2 flex-1">
          <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
          
          {/* 2. FULL GALLERY (Inside Content) */}
          {/* This allows users to see all images and zoom in */}
          {item.imageUrls?.length > 0 && (
            <div className="mb-3">
              <MediaGallery imageUrls={item.imageUrls} />
            </div>
          )}

          <div className="flex gap-4 text-xs text-gray-500 mt-auto">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {item.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {new Date(item.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short', 
                year: 'numeric'
              })}
            </span>
          </div>
        </CardContent>

        <CardFooter className="pt-2 bg-gray-50/50 border-t">
        {canClaim && !isMyUpload && (
          iHaveClaimed ? (
            <Button size="sm" variant="secondary" disabled className="w-full sm:w-auto">
              Claim Submitted
            </Button>
          ) : (
            <Dialog open={isClaiming} onOpenChange={(open) => {
              setIsClaiming(open);
              if (!open) setError(""); 
            }}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto">
                  This is mine (Claim)
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Claim Item: {item.title}</DialogTitle>
                </DialogHeader>
                
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                    {error}
                  </div>
                )}

                <form action={handleClaim}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Proof of Ownership</Label>
                      <Textarea 
                        name="description" 
                        placeholder="Describe unique details (e.g. 'scratch on the back', 'wallpaper is a dog')..."
                        required 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Submit Claim</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )
        )}
          
          {/* My Items Logic */}
          {isMyUpload && (
             item.status === 'LOST' ? (
               <form action={markAsFound}>
                 <input type="hidden" name="itemId" value={item.id} />
                 <Button 
                   size="sm" 
                   variant="outline" 
                   className="w-full sm:w-auto text-green-600 border-green-200 hover:bg-green-50 gap-2"
                 >
                   <CheckCircle className="w-4 h-4" />
                   I Found It (Close)
                 </Button>
               </form>
             ) : (
               <span className="text-xs text-gray-400 italic">Reported by you</span>
             )
          )}

        </CardFooter>
      </div>
    </Card>
  )
}