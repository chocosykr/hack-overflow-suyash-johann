'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { ThumbsUp, MapPin } from "lucide-react"
import { ToggleUpvote } from "../app/actions/ToggleUpvote" // Import the action above
import { useOptimistic, startTransition } from "react"


export default function IssueCard({ issue, currentUserId }) {
  // Check if the current user has already upvoted based on the data passed down
  const initialHasUpvoted = issue.upvotes.length > 0
  const initialCount = issue._count.upvotes

  // Optimistic UI state
  const [optimisticState, setOptimisticState] = useOptimistic(
    { hasUpvoted: initialHasUpvoted, count: initialCount },
    (state, newStatus) => ({
      hasUpvoted: newStatus,
      count: newStatus ? state.count + 1 : state.count - 1
    })
  )

  const handleUpvote = async () => {
    // 1. Update UI instantly (before DB responds)
    startTransition(() => {
      setOptimisticState(!optimisticState.hasUpvoted)
    })
    // 2. Call Server Action
    await ToggleUpvote(issue.id)
  }

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={issue.status === 'RESOLVED' ? "default" : "secondary"}>
              {issue.status}
            </Badge>
            <span className="text-xs text-muted-foreground">{issue.category}</span>
          </div>
          <CardTitle className="text-lg">{issue.title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{issue.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 mr-1" />
          {issue.blockName} • Room {issue.roomNumber}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3 flex justify-between">
        <span className="text-xs text-gray-400">
          {new Date(issue.createdAt).toLocaleDateString('en-IN')}
        </span>
        
        {/* The "Me Too" Button */}
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