'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { mergeIssues } from "../app/actions/staffActions"
import { GitMerge, Search, Loader2, Check } from "lucide-react"
import { useDebounce } from '../lib/utils' // Optional: if you have a debounce hook, otherwise we use standard timeout

export default function MergeIssueDialog({ duplicateIssueId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIssueId, setSelectedIssueId] = useState(null)

  // 1. Live Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        // Reuse your existing API with the ?search param
        // We filter for active issues to merge INTO
        const res = await fetch(`/api/issues?search=${searchTerm}&status=ALL`)
        const data = await res.json()
        
        // Filter out the current issue (can't merge into self)
        // and closed issues if you only want to merge into active ones
        const validCandidates = (data.issues || data).filter(i => 
             i.id !== duplicateIssueId && 
             i.status !== 'CLOSED' &&
             !i.isDuplicate
        )
        setSearchResults(validCandidates)
      } catch (error) {
        console.error("Search failed", error)
      } finally {
        setIsSearching(false)
      }
    }, 500) // 500ms delay to prevent spamming API

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, duplicateIssueId])


  // 2. Handle Merge Action
  const handleMerge = async () => {
    if (!selectedIssueId) return
    setLoading(true)
    try {
      await mergeIssues(selectedIssueId, duplicateIssueId)
      setIsOpen(false)
      window.location.reload() 
    } catch (error) {
      alert("Merge failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
          <GitMerge className="w-4 h-4 mr-2" />
          Mark as Duplicate
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Merge Duplicate Issue</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <p className="text-sm text-gray-500">
            Search for the <strong>Original Issue</strong> that this report duplicates.
          </p>

          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by title (e.g. 'Fan broken')..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* RESULTS LIST */}
          <div className="border rounded-md max-h-[200px] overflow-y-auto bg-slate-50">
             {isSearching ? (
                <div className="p-4 flex justify-center text-gray-400">
                    <Loader2 className="animate-spin w-5 h-5" />
                </div>
             ) : searchResults.length === 0 && searchTerm ? (
                <p className="p-4 text-center text-sm text-gray-400">No matching issues found.</p>
             ) : searchResults.length === 0 ? (
                <p className="p-4 text-center text-sm text-gray-400">Type to find issues...</p>
             ) : (
                <div className="divide-y">
                   {searchResults.map((issue) => (
                      <div 
                        key={issue.id}
                        onClick={() => setSelectedIssueId(issue.id)}
                        className={`p-3 cursor-pointer hover:bg-blue-50 transition flex items-start justify-between ${
                            selectedIssueId === issue.id ? "bg-blue-100 ring-1 ring-inset ring-blue-500" : ""
                        }`}
                      >
                         <div>
                            <p className="font-medium text-sm text-gray-900">{issue.title}</p>
                            <p className="text-xs text-gray-500">
                                #{issue.id.slice(-4)} • {new Date(issue.createdAt).toLocaleDateString()}
                            </p>
                         </div>
                         <div className="flex flex-col items-end gap-1">
                             <Badge variant="secondary" className="text-[10px] h-5">{issue.status}</Badge>
                             {selectedIssueId === issue.id && <Check className="w-4 h-4 text-blue-600" />}
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>

          {/* CONFIRM BUTTON */}
          <Button 
            onClick={handleMerge} 
            disabled={loading || !selectedIssueId} 
            className="w-full"
          >
            {loading ? "Merging..." : "Confirm & Close Duplicate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}