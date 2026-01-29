'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { submitClaim,markAsFound } from '../app/actions/lostfound'
import { MapPin, Calendar, HelpCircle,CheckCircle } from 'lucide-react'


export default function LostFoundCard({ item, currentUserId, canClaim }) {
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState(""); // Add this state

  // Prevent users from claiming their own uploads
  const isMyUpload = item.reporterId === currentUserId
  const iHaveClaimed = item.claims && item.claims.length > 0


  // Handler for the form
  async function handleClaim(formData) {
    setError(""); // Clear previous errors
    const result = await submitClaim(formData);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setIsClaiming(false); // Close dialog on success
    }
  }
  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden">
      {/* Image Section */}
      <div className="sm:w-32 bg-gray-100 flex items-center justify-center shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="h-32 w-full object-cover" />
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
          <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
          <div className="flex gap-4 text-xs text-gray-500">
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
              if (!open) setError(""); // Reset error when closing
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
                
                {/* Error Message Display */}
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
                        placeholder="Describe unique details..."
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
          
          {/* SCENARIO B & C: My Items */}
          {isMyUpload && (
             item.status === 'LOST' ? (
               // I lost this, but now I found it -> Show "Mark as Found" button
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
               // I found this, waiting for owner -> Show Status
               <span className="text-xs text-gray-400 italic">Reported by you</span>
             )
          )}

        </CardFooter>
      </div>
    </Card>
  )
}