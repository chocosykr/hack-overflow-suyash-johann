'use client'
import { useEffect, useState } from 'react'
import { Button } from "../../../components/ui/button"
import { claimIssue, resolveIssue, startIssueProgress } from "../../actions/staffActions"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Loader2, Play, CheckCircle, Hand } from "lucide-react" // Optional: for better UI icons
import MergeIssueDialog from "../../../components/MergeIssueDialog"
// 1. Add currentUserId to props so we can check ownership
export default function StaffIssueList({ fetchUrl, type, currentUserId }) {
  const [issues, setIssues] = useState([])
  const [loadingId, setLoadingId] = useState(null) // Track which button is processing

useEffect(() => {
    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        // --- FIX START ---
        // Handle if API returns { issues: [...] } or just [...]
        const list = Array.isArray(data) ? data : data.issues || []
        setIssues(list)
        // --- FIX END ---
      })
      .catch(err => {
        console.error("Fetch error:", err)
        setIssues([])
      })
  }, [fetchUrl])

  // Helper to handle actions with loading state
  const handleAction = async (actionFn, id) => {
    setLoadingId(id)
    try {
        await actionFn(id)
        // Optimistic update: remove or update the local issue to feel instant
        if (type === 'available') {
            setIssues(prev => prev.filter(i => i.id !== id))
        } else {
            // Refresh data (or you could manually update the status in local state)
            window.location.reload() 
        }
    } catch (error) {
        console.error(error)
        alert("Action failed")
    } finally {
        setLoadingId(null)
    }
  }

  return (
    <div className="space-y-4 mt-4">
      {issues.length === 0 && <p className="text-center text-gray-500">No issues found.</p>}
      
      {issues.map(issue => {
        // 2. Logic Moved INSIDE the map
        const isAssignedToMe = issue.assigneeId === currentUserId;
        
        return (
            <Card key={issue.id} className="border-l-4 border-l-blue-500 shadow-sm">
              <CardHeader className="flex flex-row justify-between pb-2">
                <div>
                   <div className="flex gap-2 mb-2">
                     <Badge variant={issue.status === 'REPORTED' ? "secondary" : "default"}>
                        {issue.status}
                     </Badge>
                     <Badge variant="outline" className={
                        issue.priority === 'HIGH' || issue.priority === 'EMERGENCY' ? "text-red-500 border-red-200 bg-red-50" : ""
                     }>
                        {issue.priority}
                     </Badge>
                   </div>
                   <CardTitle className="text-lg">{issue.title}</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent>
                 <p className="text-gray-600 mb-3">{issue.description}</p>
                 <div className="text-xs text-muted-foreground bg-slate-100 p-2 rounded flex items-center gap-2">
                   <span>📍 {issue.hostel?.name || "Hostel"} • {issue.block?.name || "Block"} • Room {issue.room?.number || "N/A"}</span>
                 </div>
              </CardContent>

              <CardFooter className="pt-0">
                
                {/* CASE A: Available Tab (Reported Issues) */}
                {type === 'available' && (
                  <div className="flex gap-2 w-full">
                      {/* 1. Main Action: Accept */}
                      <Button 
                        onClick={() => handleAction(claimIssue, issue.id)} 
                        disabled={loadingId === issue.id}
                        className="flex-1" // Grows to fill space
                      >
                        {loadingId === issue.id ? <Loader2 className="animate-spin w-4 h-4" /> : "Accept Job"}
                      </Button>

                      {/* 2. Secondary Action: Merge Duplicate */}
                      <MergeIssueDialog duplicateIssueId={issue.id} />
                  </div>
                )}

                {/* CASE B: My Tasks Tab */}
                {type !== 'available' && (
                  <div className="w-full space-y-3">
                    {/* Primary Workflow Buttons */}
                    {issue.status === 'ASSIGNED' && (
                        <Button 
                            onClick={() => handleAction(startIssueProgress, issue.id)} 
                            disabled={loadingId === issue.id}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loadingId === issue.id ? <Loader2 className="animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                            Start Work
                        </Button>
                    )}

                    {issue.status === 'IN_PROGRESS' && (
                        <Button 
                            onClick={() => handleAction(resolveIssue, issue.id)} 
                            disabled={loadingId === issue.id}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                            {loadingId === issue.id ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                            Mark as Resolved
                        </Button>
                    )}

                    {/* Secondary Action: Merge (Available even if claimed) */}
                    <div className="flex justify-center pt-2 border-t border-gray-100">
                        <MergeIssueDialog duplicateIssueId={issue.id} />
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
        )
      })}
    </div>
  )
}