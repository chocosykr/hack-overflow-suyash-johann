'use client'
import { useEffect, useState } from 'react'
import { Button } from "../../../components/ui/button"
import { claimIssue, resolveIssue } from "../../actions/staffActions"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"

export default function StaffIssueList({ fetchUrl, type }) {
  const [issues, setIssues] = useState([])

  useEffect(() => {
    fetch(fetchUrl).then(res => res.json()).then(setIssues)
  }, [fetchUrl])

  return (
    <div className="space-y-4 mt-4">
      {issues.length === 0 && <p className="text-center text-gray-500">No issues found.</p>}
      
      {issues.map(issue => (
        <Card key={issue.id}>
          <CardHeader className="flex flex-row justify-between">
            <div>
               <div className="flex gap-2 mb-1">
                 <Badge>{issue.status}</Badge>
                 <Badge variant="outline">{issue.priority}</Badge>
               </div>
               <CardTitle>{issue.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
             <p>{issue.description}</p>
             <p className="text-sm text-muted-foreground mt-2">
               📍 {issue.hostel?.name} • {issue.block?.name} • Room {issue.room?.number}
             </p>
          </CardContent>
          <CardFooter>
            {type === 'available' ? (
              <Button onClick={() => claimIssue(issue.id)} className="w-full">
                Accept Job
              </Button>
            ) : (
              <Button onClick={() => resolveIssue(issue.id)} className="w-full bg-green-600 hover:bg-green-700">
                Mark as Resolved
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}