'use client'
import { useEffect, useState } from 'react'
import { Button } from "../../../components/ui/button"
import { claimIssue, resolveIssue, startIssueProgress } from "../../actions/staffActions"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Loader2, Play, CheckCircle, Hand, MapPin, Building2, AlertCircle, Clock, Layers } from "lucide-react"
import MergeIssueDialog from "../../../components/MergeIssueDialog"

export default function StaffIssueList({ fetchUrl, type, currentUserId }) {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.issues || []
        setIssues(list)
        setLoading(false)
      })
      .catch(err => {
        console.error("Fetch error:", err)
        setIssues([])
        setLoading(false)
      })
  }, [fetchUrl])

  const handleAction = async (actionFn, id) => {
    setLoadingId(id)
    try {
        await actionFn(id)
        if (type === 'available') {
            setIssues(prev => prev.filter(i => i.id !== id))
        } else {
            window.location.reload() 
        }
    } catch (error) {
        console.error(error)
        alert("Action failed")
    } finally {
        setLoadingId(null)
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <Layers className="w-8 h-8 text-blue-600" />
          </div>
          <Loader2 className="w-20 h-20 text-blue-500 animate-spin absolute -inset-2" />
        </div>
        <p className="text-gray-600 font-medium">Loading issues...</p>
      </div>
    )
  }

  // Empty State
  if (issues.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 m-4">
        <div className="inline-block mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <Layers className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {type === 'available' ? 'No Available Jobs' : 'No Active Tasks'}
        </h3>
        <p className="text-gray-500">
          {type === 'available' 
            ? 'All issues in your specialization are assigned' 
            : 'You have no active tasks at the moment'}
        </p>
      </div>
    )
  }

  // Priority border colors
  const priorityBorderColors = {
    'EMERGENCY': 'border-l-red-500',
    'HIGH': 'border-l-orange-500',
    'MEDIUM': 'border-l-blue-500',
    'LOW': 'border-l-green-500',
  }

  // Status colors
  const statusConfig = {
    'REPORTED': {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200'
    },
    'ASSIGNED': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    'IN_PROGRESS': {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200'
    },
    'RESOLVED': {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200'
    },
  }

  const priorityConfig = {
    'EMERGENCY': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: '🚨'
    },
    'HIGH': {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-300',
      icon: '⚠️'
    },
    'MEDIUM': {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
      icon: '📌'
    },
    'LOW': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      icon: '✓'
    },
  }

  return (
    <div className="space-y-4 p-4">
      {issues.map((issue, index) => {
        const isAssignedToMe = issue.assigneeId === currentUserId
        const borderColor = priorityBorderColors[issue.priority] || 'border-l-gray-400'
        const statusStyle = statusConfig[issue.status] || statusConfig.REPORTED
        const priorityStyle = priorityConfig[issue.priority] || priorityConfig.MEDIUM
        
        return (
          <Card 
            key={issue.id} 
            className={`
              border-l-4 ${borderColor}
              hover:shadow-lg hover:-translate-y-0.5
              transition-all duration-200
              bg-white
            `}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge 
                      className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border font-semibold px-3 py-1 text-xs`}
                    >
                      {issue.status.replace('_', ' ')}
                    </Badge>
                    
                    <Badge 
                      className={`${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border} border font-bold px-3 py-1 text-xs ${issue.priority === 'EMERGENCY' ? 'animate-pulse' : ''}`}
                    >
                      {priorityStyle.icon} {issue.priority}
                    </Badge>
                  </div>
                  
                  {/* Title */}
                  <CardTitle className="text-xl font-bold text-gray-900 leading-tight mb-2">
                    {issue.title}
                  </CardTitle>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Reported {new Date(issue.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Upvote Count (if applicable) */}
                {issue._count?.upvotes > 0 && (
                  <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg px-3 py-2 border border-blue-200">
                    <AlertCircle className="w-4 h-4 text-blue-600 mb-0.5" />
                    <span className="text-lg font-bold text-blue-700">{issue._count.upvotes}</span>
                    <span className="text-[10px] text-blue-600 font-medium">affected</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-gray-700 leading-relaxed">
                {issue.description}
              </p>
              
              {/* Location Card */}
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
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0 bg-gray-50/50 border-t">
              {/* AVAILABLE TAB */}
              {type === 'available' && (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button 
                    onClick={() => handleAction(claimIssue, issue.id)} 
                    disabled={loadingId === issue.id}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all h-11"
                  >
                    {loadingId === issue.id ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Accepting...
                      </>
                    ) : (
                      <>
                        <Hand className="w-4 h-4 mr-2" />
                        Accept Job
                      </>
                    )}
                  </Button>

                  <MergeIssueDialog duplicateIssueId={issue.id} />
                </div>
              )}

              {/* ACTIVE TAB */}
              {type !== 'available' && (
                <div className="w-full space-y-3">
                  {issue.status === 'ASSIGNED' && (
                    <Button 
                      onClick={() => handleAction(startIssueProgress, issue.id)} 
                      disabled={loadingId === issue.id}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all h-11"
                    >
                      {loadingId === issue.id ? (
                        <>
                          <Loader2 className="animate-spin mr-2 w-4 h-4" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Work
                        </>
                      )}
                    </Button>
                  )}

                  {issue.status === 'IN_PROGRESS' && (
                    <Button 
                      onClick={() => handleAction(resolveIssue, issue.id)} 
                      disabled={loadingId === issue.id}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all h-11"
                    >
                      {loadingId === issue.id ? (
                        <>
                          <Loader2 className="animate-spin mr-2 w-4 h-4" />
                          Resolving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Resolved
                        </>
                      )}
                    </Button>
                  )}

                  <div className="flex justify-center pt-2 border-t border-gray-200">
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