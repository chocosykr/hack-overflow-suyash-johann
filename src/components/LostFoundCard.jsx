'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { submitClaim, markAsFound } from '../app/actions/lostfound'
import { MapPin, Calendar, HelpCircle, CheckCircle, Package, Search, Maximize2, Info, AlertCircle } from 'lucide-react'
import MediaGallery from './MediaGallery'

export default function LostFoundCard({ item, currentUserId, canClaim }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isClaimingInModal, setIsClaimingInModal] = useState(false)
  const [error, setError] = useState("")

  const isMyUpload = item.reporterId === currentUserId
  const iHaveClaimed = item.claims && item.claims.length > 0
  const coverImage = item.imageUrls?.[0] || null

  const statusStyles = item.status === 'LOST' 
    ? { 
        bg: "bg-orange-50", 
        text: "text-orange-700", 
        border: "border-orange-200", 
        icon: <Search className="w-3 h-3" />,
        gradient: "from-orange-500 to-red-600"
      }
    : { 
        bg: "bg-emerald-50", 
        text: "text-emerald-700", 
        border: "border-emerald-200", 
        icon: <Package className="w-3 h-3" />,
        gradient: "from-green-500 to-emerald-600"
      };

  async function handleClaim(formData) {
    setError(""); 
    const result = await submitClaim(formData);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setIsClaimingInModal(false);
      setIsDetailOpen(false);
    }
  }

  async function handleMarkFound(formData) {
    await markAsFound(formData);
    setIsDetailOpen(false);
  }

  return (
    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      {/* CARD - Main Clickable Area */}
      <Card className="flex flex-col sm:flex-row overflow-hidden border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white">
        
        <DialogTrigger asChild>
          <div className="flex flex-col sm:flex-row flex-1">
            {/* Thumbnail */}
            <div className="sm:w-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 min-h-[180px] relative overflow-hidden">
              {coverImage ? (
                <>
                  <img 
                    src={coverImage} 
                    alt={item.title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  {/* Image count badge */}
                  {item.imageUrls?.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full font-bold backdrop-blur-sm">
                      {item.imageUrls.length} photos
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-slate-200 rounded-full">
                    <HelpCircle className="h-10 w-10 text-slate-400" />
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">No Image</span>
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/95 p-3 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <Maximize2 className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="flex-1 flex flex-col p-5">
              <div className="flex justify-between items-start mb-3 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`text-xs px-2.5 py-0.5 font-bold uppercase tracking-tight bg-gradient-to-r ${statusStyles.gradient} text-white border-0 shadow-sm`}>
                    {item.status}
                  </Badge>
                  {item.category && (
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-tight bg-slate-100 text-slate-600 border-none px-2 py-0.5">
                      {item.category}
                    </Badge>
                  )}
                </div>
              </div>

              <CardTitle className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
                {item.title}
              </CardTitle>

              {/* Description Snippet */}
              <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-auto flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {item.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> 
                  {new Date(item.date).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </DialogTrigger>

        {/* Quick Actions Footer */}
        <CardFooter className="bg-gradient-to-br from-slate-50 to-white border-t sm:border-t-0 sm:border-l border-slate-200 p-4 flex sm:flex-col justify-center items-center gap-2">
          {isMyUpload ? (
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 bg-blue-100 rounded-full">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight text-center">
                Your Item
              </span>
            </div>
          ) : canClaim && !iHaveClaimed ? (
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all font-semibold"
            >
              View Details
            </Button>
          ) : iHaveClaimed ? (
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-tight text-center">
                Claimed
              </span>
            </div>
          ) : null}
        </CardFooter>
      </Card>

      {/* MODAL - Full Details */}
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 pr-8">
            {item.title}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={`text-xs px-3 py-1 font-bold bg-gradient-to-r ${statusStyles.gradient} text-white border-0`}>
              {item.status}
            </Badge>
            {item.category && (
              <Badge variant="secondary" className="text-xs px-2.5 py-0.5">
                {item.category}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              {item.imageUrls?.length > 0 ? (
                <MediaGallery imageUrls={item.imageUrls} />
              ) : (
                <div className="aspect-square bg-white rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                  <HelpCircle className="w-16 h-16 text-slate-300 mb-2" />
                  <p className="text-slate-400 text-sm font-medium">No photos provided</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details & Actions */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-200">
              <h4 className="text-xs font-bold uppercase text-indigo-700 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" /> Description
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              <div className="flex justify-between items-center p-4">
                <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </span>
                <span className="font-bold text-slate-900">{item.location}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date
                </span>
                <span className="font-bold text-slate-900">
                  {new Date(item.date).toLocaleDateString('en-GB', { dateStyle: 'long' })}
                </span>
              </div>
              {item.reporter?.name && (
                <div className="flex justify-between items-center p-4">
                  <span className="text-sm text-slate-500 font-medium">Reported by</span>
                  <span className="font-bold text-slate-900">{item.reporter.name}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {canClaim && !isMyUpload && !iHaveClaimed && !isClaimingInModal && (
                <Button 
                  onClick={() => setIsClaimingInModal(true)}
                  size="lg"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all font-bold"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Claim This Item
                </Button>
              )}

              {canClaim && !isMyUpload && iHaveClaimed && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-green-700">Claim Submitted</p>
                  <p className="text-xs text-green-600 mt-1">You've already claimed this item</p>
                </div>
              )}

              {isMyUpload && item.status === 'LOST' && (
                <form action={handleMarkFound}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all font-bold"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Mark as Found
                  </Button>
                </form>
              )}

              {/* Claim Form (shown when claiming) */}
              {isClaimingInModal && (
                <div className="bg-white border-2 border-indigo-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-indigo-700">
                      <p className="font-semibold mb-1">Prove it's yours</p>
                      <p className="text-xs">Describe unique details only the owner would know</p>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <form action={handleClaim} className="space-y-4">
                    <input type="hidden" name="itemId" value={item.id} />
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">
                        Proof of Ownership
                      </Label>
                      <Textarea 
                        name="description" 
                        placeholder="e.g., 'Small scratch on the back', 'Wallpaper is a golden retriever', 'Name written inside the cover'..."
                        className="min-h-[100px] resize-none"
                        required 
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsClaimingInModal(false);
                          setError("");
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 font-semibold"
                      >
                        Submit Claim
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}