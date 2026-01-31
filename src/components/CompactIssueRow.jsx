'use client'

import { useState } from 'react'
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog"
import { ThumbsUp, MapPin, MessageCircle, Clock, ChevronRight } from "lucide-react"
import IssueCard from "./IssueCard" // Reuse your existing robust card!
import { priorityStyles } from '../lib/utils'

export default function CompactIssueRow({ issue, currentUserId }) {
  const [isOpen, setIsOpen] = useState(false)

  // Status Color Logic
  const statusColors = {
    REPORTED: "bg-slate-100 text-slate-600 border-slate-200",
    ASSIGNED: "bg-blue-50 text-blue-600 border-blue-200",
    IN_PROGRESS: "bg-purple-50 text-purple-600 border-purple-200",
    RESOLVED: "bg-green-50 text-green-600 border-green-200",
    CLOSED: "bg-gray-50 text-gray-500 border-gray-200",
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="group flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-all cursor-pointer mb-3">
          
          {/* 1. STATUS INDICATOR (Left Stripe) */}
          <div className={`w-1 self-stretch rounded-full ${statusColors[issue.status].replace("text", "bg").split(" ")[0]}`} />

          {/* 2. MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${statusColors[issue.status]}`}>
                {issue.status}
              </Badge>

              {issue.priority && issue.priority !== 'LOW' && (
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${priorityStyles[issue.priority]}`}>
                   {issue.priority}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground truncate">
                {typeof issue.category === 'object' ? issue.category?.name : issue.category}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 truncate pr-2">{issue.title}</h3>
            
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {issue.hostel?.name}, {issue.room?.number ? `Rm ${issue.room.number}` : issue.block?.name}
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(issue.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* 3. METRICS (Right Side) */}
          <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-600">
            {/* Upvote Count */}
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border">
              <ThumbsUp className="w-3 h-3" />
              <span className="text-xs font-medium text-gray-700">{issue._count?.upvotes || 0}</span>
            </div>

            {/* Visual Queue for "Click me" */}
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
          </div>

        </div>
      </DialogTrigger>

      {/* 4. THE FULL DETAIL VIEW (Modal) */}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
        {/* Accessibility Title (Hidden) */}
        <DialogTitle className="sr-only">Issue Details</DialogTitle>
        
        {/* We reuse the IssueCard exactly as is, just wrapped in a modal! */}
        <div className="bg-white rounded-lg overflow-hidden">
           <IssueCard issue={issue} currentUserId={currentUserId} />
        </div>
      </DialogContent>
    </Dialog>
  )
}