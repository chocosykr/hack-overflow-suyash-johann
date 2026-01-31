'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { submitClaim, markAsFound } from '../app/actions/lostfound'
import { MapPin, Calendar, HelpCircle, CheckCircle, Package, Search, Maximize2, Info } from 'lucide-react'
import MediaGallery from './MediaGallery'

export default function LostFoundCard({ item, currentUserId, canClaim }) {
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState("")

  const isMyUpload = item.reporterId === currentUserId
  const iHaveClaimed = item.claims && item.claims.length > 0
  const coverImage = item.imageUrls?.[0] || null

  const statusStyles = item.status === 'LOST' 
    ? { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: <Search className="w-3 h-3" /> }
    : { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: <Package className="w-3 h-3" /> };

  return (
    <Dialog>
      <Card className="flex flex-col sm:flex-row overflow-hidden border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 group cursor-pointer">
        
        {/* --- MAIN CLICKABLE AREA --- */}
        <DialogTrigger asChild>
          <div className="flex flex-col sm:flex-row flex-1">
            {/* Thumbnail */}
            <div className="sm:w-48 bg-slate-100 flex items-center justify-center shrink-0 min-h-[180px] relative overflow-hidden">
              {coverImage ? (
                <img 
                  src={coverImage} 
                  alt={item.title} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              ) : (
                <HelpCircle className="h-12 w-12 text-slate-300" />
              )}
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/90 p-2 rounded-full shadow-lg">
                  <Maximize2 className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Teaser Content */}
            <div className="flex-1 flex flex-col p-5">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="text-[10px] uppercase tracking-tighter bg-slate-100 text-slate-600 border-none">
                  {item.category}
                </Badge>
                <Badge className={`${statusStyles.bg} ${statusStyles.text} border-none`}>
                  {item.status}
                </Badge>
              </div>

              <CardTitle className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {item.title}
              </CardTitle>

              {/* Description Snippet */}
              <p className="text-sm text-slate-600 line-clamp-2 italic mb-4">
                "{item.description}"
              </p>

              <div className="mt-auto flex gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </DialogTrigger>

        {/* --- QUICK ACTIONS FOOTER --- */}
        <CardFooter className="bg-slate-50/50 border-t sm:border-t-0 sm:border-l border-slate-100 p-4 flex sm:flex-col justify-center gap-2">
          {isMyUpload ? (
             <span className="text-[10px] font-bold text-slate-400 uppercase vertical-text hidden sm:block">Owner</span>
          ) : (
             !iHaveClaimed && (
               <Button size="sm" variant="outline" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                 Claim
               </Button>
             )
          )}
        </CardFooter>
      </Card>

      {/* --- FULL DETAILS MODAL --- */}
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">{item.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Left Side: Images */}
          <div className="space-y-4">
            {item.imageUrls?.length > 0 ? (
              <MediaGallery imageUrls={item.imageUrls} />
            ) : (
              <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">No photos provided</p>
              </div>
            )}
          </div>

          {/* Right Side: Detailed Info */}
          <div className="space-y-6">
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <h4 className="text-xs font-bold uppercase text-indigo-600 mb-2 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" /> Full Description
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm border-b pb-2">
                <span className="text-slate-500">Location</span>
                <span className="font-semibold text-slate-900">{item.location}</span>
              </div>
              <div className="flex justify-between text-sm border-b pb-2">
                <span className="text-slate-500">Date Noticed</span>
                <span className="font-semibold text-slate-900">{new Date(item.date).toLocaleDateString('en-GB', { dateStyle: 'long' })}</span>
              </div>
              <div className="flex justify-between text-sm border-b pb-2">
                <span className="text-slate-500">Category</span>
                <span className="font-semibold text-slate-900">{item.category}</span>
              </div>
            </div>

            {/* Action Buttons inside Modal */}
            <div className="pt-4">
               {/* Insert claim logic here */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}