'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { ThumbsUp, MapPin, Building2 } from "lucide-react" // Added Building2 icon
import { ToggleUpvote } from "../app/actions/ToggleUpvote"
import { useOptimistic, startTransition } from "react"

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

  // Handle category display (whether it's an object or string)
  const categoryName = typeof issue.category === 'object' ? issue.category?.name : issue.category;

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={issue.status === 'RESOLVED' ? "default" : "secondary"}>
              {issue.status}
            </Badge>
            <span className="text-xs text-muted-foreground">{categoryName}</span>
          </div>
          <CardTitle className="text-lg">{issue.title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{issue.description}</p>
        
        {/* UPDATED LOCATION SECTION */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground bg-slate-50 p-2 rounded-md">
           {/* Hostel Name */}
           {issue.hostel?.name && (
            <div className="flex items-center">
              <Building2 className="w-3 h-3 mr-1" />
              <span className="font-medium">{issue.hostel.name}</span>
            </div>
           )}

           {/* Block & Room */}
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

      <CardFooter className="border-t pt-3 flex justify-between">
        <span className="text-xs text-gray-400">
          {new Date(issue.createdAt).toLocaleDateString('en-IN')}
        </span>
        
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
      </CardFooter>
    </Card>
  )
}