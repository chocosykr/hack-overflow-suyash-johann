'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { ThumbsUp, MapPin, Building2, Info, CheckCircle, Clock } from "lucide-react"
import { ToggleUpvote } from "../app/actions/ToggleUpvote"
import { useOptimistic, startTransition, useState } from "react"
import { closeIssue } from "../app/actions/issueActions"
import { useRouter } from "next/navigation"
import MediaGallery from "./MediaGallery"
import CommentSection from "./CommentSection"
import { priorityStyles, categoryIcons } from "../lib/utils"

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

  const categoryName = typeof issue.category === 'object' ? issue.category?.name : issue.category;
  const CategoryIcon = categoryIcons[categoryName] || Info;

  const router = useRouter()
  const [isClosing, setIsClosing] = useState(false)

  const isMerged = issue.isDuplicate && issue.mergedWith;
  const displayStatus = isMerged ? issue.mergedWith.status : issue.status;
  const isReporter = currentUserId === issue.reporterId
  const isResolved = displayStatus === 'RESOLVED'

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

  // Priority border color mapping (matches your priorityStyles)
  const priorityBorderColors = {
    'EMERGENCY': 'border-l-red-500',
    'HIGH': 'border-l-orange-500',
    'MEDIUM': 'border-l-blue-500',
    'LOW': 'border-l-slate-400',
  }

  const priorityBorder = issue.priority ? priorityBorderColors[issue.priority] : 'border-l-gray-300'

  return (
    <Card className={`
      mb-4 transition-all duration-200 border-l-4 ${priorityBorder}
      ${isMerged ? "bg-gradient-to-br from-orange-50/50 to-white border-dashed" : "hover:shadow-lg hover:-translate-y-0.5"}
      ${isResolved ? "opacity-75" : ""}
    `}>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          
          {/* Left side: Title and metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              
              {/* Status Badge - Larger and more prominent */}
              {isMerged ? (
                <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 px-3 py-1 text-xs font-semibold shadow-sm">
                  🔗 Merged
                </Badge>
              ) : (
                <Badge 
                  className={`px-3 py-1 text-xs font-semibold shadow-sm ${
                    displayStatus === 'RESOLVED' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0' 
                      : displayStatus === 'IN_PROGRESS'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0'
                      : displayStatus === 'ASSIGNED'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0'
                  }`}
                >
                  {displayStatus.replace('_', ' ')}
                </Badge>
              )}

              {/* Priority Badge - Color coded */}
              {issue.priority && (
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium px-2.5 py-0.5 ${priorityStyles[issue.priority]}`}
                >
                  {issue.priority}
                </Badge>
              )}

              {/* Category with Icon */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-slate-100 px-2.5 py-1 rounded-full">
                <CategoryIcon className="w-3.5 h-3.5" />
                <span className="font-medium">{categoryName}</span>
              </div>
            </div>

            {/* Issue Title - More prominent */}
            <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
              {issue.title}
            </CardTitle>
          </div>

          {/* Right side: Upvote count (prominent) */}
          {optimisticState.count > 0 && (
            <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg px-3 py-2 border border-blue-100">
              <ThumbsUp className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-lg font-bold text-blue-700">{optimisticState.count}</span>
              <span className="text-[10px] text-blue-600 font-medium">affected</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        
        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed">{issue.description}</p>
        
        {/* Media Gallery */}
        <MediaGallery imageUrls={issue.imageUrls} />

        {/* Merged Notice Banner - Improved design */}
        {isMerged && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-lg">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full p-1.5 mt-0.5">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-900 text-sm mb-1">
                  Duplicate Issue - Merged with Main Report
                </p>
                <p className="text-blue-700 text-xs">
                  This issue is being tracked under a main report. Current status: <strong className="font-semibold">{displayStatus}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Location Info - Card style */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-3 rounded-lg border border-slate-200">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            
            {issue.hostel?.name && (
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 rounded-md">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Hostel</p>
                  <p className="font-semibold text-gray-900">{issue.hostel.name}</p>
                </div>
              </div>
            )}

            {(issue.block?.name || issue.room?.number) && (
              <>
                <div className="h-8 w-px bg-gray-300" />
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-1.5 rounded-md">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Location</p>
                    <p className="font-semibold text-gray-900">
                      {issue.block?.name}
                      {issue.block?.name && issue.room?.number && " • "}
                      {issue.room?.number && `Room ${issue.room.number}`}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Timestamp with icon */}
            <div className="ml-auto flex items-center gap-1.5 text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {new Date(issue.createdAt).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch border-t bg-gray-50/50 pt-4">
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center w-full mb-3">
          
          {/* Left side - Close button if applicable */}
          <div>
            {isReporter && isResolved && !isMerged && (
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all h-9 px-4 font-semibold"
                onClick={handleClose}
                disabled={isClosing}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isClosing ? "Confirming..." : "Confirm Resolved"}
              </Button>
            )}
          </div>
          
          {/* Right side - Upvote button */}
          <Button 
            variant={optimisticState.hasUpvoted ? "default" : "outline"} 
            size="sm" 
            onClick={handleUpvote}
            className={`
              flex items-center gap-2 h-9 px-4 font-semibold transition-all
              ${optimisticState.hasUpvoted 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg' 
                : 'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
              }
            `}
          >
            <ThumbsUp className="w-4 h-4" />
            {optimisticState.hasUpvoted ? "I'm facing this" : "Me too"}
            <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {optimisticState.count}
            </span>
          </Button>
        </div>

        {/* Comments Section */}
        <div className="w-full"> 
          <CommentSection issueId={issue.id} />
        </div>

      </CardFooter>
    </Card>
  )
}