'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { ThumbsUp, MapPin, Building2, Info, CheckCircle } from "lucide-react" // Added Info icon
import { ToggleUpvote } from "../app/actions/ToggleUpvote"
import { useOptimistic, startTransition, useState } from "react"
import { closeIssue } from "../app/actions/issueActions"
import { useRouter } from "next/navigation"
import MediaGallery from "./MediaGallery"
import CommentSection from "./CommentSection"
import {priorityStyles} from "../lib/utils"

export default function IssueCard({ issue, currentUserId }) {
  const initialHasUpvoted = (issue.upvotes?.length || 0) > 0;
  const initialCount = issue._count?.upvotes || 0;

  const [optimisticState, setOptimisticState] = useOptimistic(
    { hasUpvoted: initialHasUpvoted, count: initialCount },
    (state, newStatus) => ({
      hasUpvoted: newStatus,
      count: newStatus ? state.count + 1 : state.count - 1
    })
  )

  const handleUpvote = async () => {
    startTransition(() => {
      setOptimisticState(!optimisticState.hasUpvoted)
    })
    await ToggleUpvote(issue.id)
  }

  // Handle category display
  const categoryName = typeof issue.category === 'object' ? issue.category?.name : issue.category;

  const router = useRouter()
  const [isClosing, setIsClosing] = useState(false)

  // --- LOGIC START: Duplicate & Status Handling ---
  
  // 1. Check if this is a duplicate
  const isMerged = issue.isDuplicate && issue.mergedWith;

  // 2. Determine Display Status
  // If merged, the "Effective Status" is the parent's status. Otherwise, it's the issue's own status.
  const displayStatus = isMerged ? issue.mergedWith.status : issue.status;

  // 3. Helper variables
  const isReporter = currentUserId === issue.reporterId
  // The issue is "Resolved" if it is explicitly RESOLVED or if it's Merged and the parent is RESOLVED
  const isResolved = displayStatus === 'RESOLVED'
  // --- LOGIC END ---

  const handleClose = async () => {
    try {
      setIsClosing(true)
      await closeIssue(issue.id)
      router.refresh() 
      window.location.reload() 
    } catch (error) {
      alert("Failed to close issue")
      setIsClosing(false)
    }
  }

  return (
    <Card className={`mb-4 transition-shadow ${isMerged ? "bg-gray-50 border-dashed border-gray-300" : "hover:shadow-md"}`}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            
            {/* BADGE LOGIC: Show 'Merged' if duplicate, otherwise show Status */}
            {isMerged ? (
               <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                 Merged
               </Badge>
            ) : (
               <Badge variant={displayStatus === 'RESOLVED' ? "default" : "secondary"}>
                 {displayStatus}
               </Badge>
            )}

            {/* 2. NEW PRIORITY BADGE (Insert Here) */}
            {issue.priority && (
              <Badge variant="outline" className={`text-[10px] h-5 ${priorityStyles[issue.priority]}`}>
                {issue.priority}
              </Badge>
            )}

            <span className="text-xs text-muted-foreground">{categoryName}</span>
          </div>
          <CardTitle className="text-lg">{issue.title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{issue.description}</p>
        
        <MediaGallery imageUrls={issue.imageUrls} />

        {/* --- DUPLICATE NOTICE BANNER --- */}
        {isMerged && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-md border border-blue-100 flex items-start gap-2">
             <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
             <div>
               <p className="font-semibold">This issue was marked as a duplicate.</p>
               <p>It is linked to a main issue which is currently: <strong>{displayStatus}</strong>.</p>
             </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground bg-slate-50 p-2 rounded-md mt-2">
           {issue.hostel?.name && (
            <div className="flex items-center">
              <Building2 className="w-3 h-3 mr-1" />
              <span className="font-medium">{issue.hostel.name}</span>
            </div>
           )}

           {(issue.block?.name || issue.room?.number) && (
            <div className="flex items-center border-l pl-3 border-gray-200">
              <MapPin className="w-3 h-3 mr-1" />
              {issue.block?.name} 
              {issue.block?.name && issue.room?.number && " • "}
              {issue.room?.number && `Room ${issue.room.number}`}
            </div>
           )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch border-t pt-3">
        
        <div className="flex justify-between items-center w-full">
          <span className="text-xs text-gray-400">
            {new Date(issue.createdAt).toLocaleDateString('en-IN')}
          </span>

          <div className="flex gap-2 items-center">
            {/* 1. Close Button (Restored) */}
            {isReporter && isResolved && !isMerged && (
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs"
                onClick={handleClose}
                disabled={isClosing}
              >
                <CheckCircle className="w-3 h-3 mr-1.5" />
                {isClosing ? "Closing..." : "Confirm Fix"}
              </Button>
            )}
            
            {/* 2. Upvote Button */}
            <Button 
              variant={optimisticState.hasUpvoted ? "default" : "outline"} 
              size="sm" 
              onClick={handleUpvote}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              {optimisticState.hasUpvoted ? "I'm facing this" : "Me too"}
              <span className="ml-1 font-mono">({optimisticState.count})</span>
            </Button>
          </div>
        </div>

        <div className="w-full mt-2"> 
          <CommentSection issueId={issue.id} />
        </div>

      </CardFooter>
    </Card>
  )
}