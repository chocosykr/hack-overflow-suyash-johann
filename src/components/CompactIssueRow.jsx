'use client'

import { useState } from 'react'
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog"
import { ThumbsUp, MapPin, MessageCircle, Clock, ChevronRight, AlertCircle } from "lucide-react"
import IssueCard from "./IssueCard"
import { priorityStyles, categoryIcons } from '../lib/utils'

export default function CompactIssueRow({ issue, currentUserId }) {
  const [isOpen, setIsOpen] = useState(false)

  // Enhanced Status Color Logic with gradients
  const statusColors = {
    REPORTED: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      stripe: "bg-slate-400"
    },
    ASSIGNED: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      stripe: "bg-blue-500"
    },
    IN_PROGRESS: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      stripe: "bg-purple-500"
    },
    RESOLVED: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      stripe: "bg-green-500"
    },
    CLOSED: {
      bg: "bg-gray-50",
      text: "text-gray-600",
      border: "border-gray-200",
      stripe: "bg-gray-400"
    },
  }

  const currentStatus = statusColors[issue.status] || statusColors.REPORTED
  const categoryName = typeof issue.category === 'object' ? issue.category?.name : issue.category
  const CategoryIcon = categoryIcons[categoryName] || AlertCircle

  // Priority gradient for row hover effect
  const priorityHoverColors = {
    'EMERGENCY': 'hover:bg-red-50/50',
    'HIGH': 'hover:bg-orange-50/50',
    'MEDIUM': 'hover:bg-blue-50/50',
    'LOW': 'hover:bg-slate-50/50',
  }

  const hoverColor = issue.priority ? priorityHoverColors[issue.priority] : 'hover:bg-slate-50/50'

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={`
          group relative flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl 
          transition-all duration-200 cursor-pointer mb-3
          hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5
          ${hoverColor}
        `}>
          
          {/* Left Priority Accent Stripe */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${currentStatus.stripe}`} />

          {/* Category Icon Circle */}
          <div className={`
            hidden sm:flex items-center justify-center w-10 h-10 rounded-full
            ${currentStatus.bg} ${currentStatus.border} border-2
            group-hover:scale-110 transition-transform
          `}>
            <CategoryIcon className={`w-5 h-5 ${currentStatus.text}`} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 pl-2">
            
            {/* Badges Row */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge 
                variant="outline" 
                className={`text-[10px] px-2 py-0.5 h-5 font-semibold ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
              >
                {issue.status.replace('_', ' ')}
              </Badge>

              {issue.priority && issue.priority !== 'LOW' && (
                <Badge 
                  variant="outline" 
                  className={`text-[10px] px-2 py-0.5 h-5 font-semibold ${priorityStyles[issue.priority]}`}
                >
                  {issue.priority}
                </Badge>
              )}

              <span className="text-xs text-gray-500 font-medium truncate">
                {categoryName}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="font-bold text-gray-900 truncate pr-2 text-base group-hover:text-blue-600 transition-colors">
              {issue.title}
            </h3>
            
            {/* Metadata */}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-medium">
                  {issue.hostel?.name}
                  {issue.room?.number && `, Rm ${issue.room.number}`}
                  {!issue.room?.number && issue.block?.name && `, ${issue.block.name}`}
                </span>
              </span>
              
              <span className="hidden md:flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-medium">
                  {new Date(issue.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </span>
            </div>
          </div>

          {/* Right Side Metrics */}
          <div className="flex items-center gap-3">
            
            {/* Upvote Count - More prominent */}
            {issue._count?.upvotes > 0 && (
              <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-200">
                <ThumbsUp className="w-4 h-4 text-blue-600 mb-0.5" />
                <span className="text-sm font-bold text-blue-700">{issue._count.upvotes}</span>
              </div>
            )}

            {/* Chevron indicator */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-500 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </div>

        </div>
      </DialogTrigger>

      {/* Full Detail Modal */}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only">Issue Details: {issue.title}</DialogTitle>
        
        <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
          <IssueCard issue={issue} currentUserId={currentUserId} />
        </div>
      </DialogContent>
    </Dialog>
  )
}