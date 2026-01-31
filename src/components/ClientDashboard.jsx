"use client"
import CompactIssueRow from "./CompactIssueRow"
import { useState, useEffect } from 'react'
import { Loader2, ClipboardList } from 'lucide-react'

export default function ClientDashboard({ userId, fetchUrl, emptyMessage }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Re-fetch whenever the URL changes (e.g., switching tabs)
  useEffect(() => {
    setLoading(true)
    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        const issueList = data.issues || data; 
        if (Array.isArray(issueList)) {
          setIssues(issueList);
        } else {
          setIssues([]); 
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setIssues([]); 
      })
      .finally(() => setLoading(false))
  }, [fetchUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Loading updates...</p>
      </div>
    )
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
          <ClipboardList className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">{emptyMessage || "No issues found."}</p>
        <p className="text-sm text-gray-400 mt-1">Check back later or report a new issue.</p>
      </div>
    )
  }

  return (
   <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {issues.map((issue) => (
        <CompactIssueRow 
          key={issue.id} 
          issue={issue} 
          currentUserId={userId} 
        />
      ))}
    </div>
  )
}