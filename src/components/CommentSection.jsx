'use client'

import { useState, useEffect } from 'react'
import { getIssueComments, addComment } from '../app/actions/commentActions'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Loader2, MessageCircle, Reply, User } from 'lucide-react'

// Recursive component for Threaded Comments
function CommentItem({ comment, allComments, onReply }) {
  const replies = allComments.filter(c => c.parentId === comment.id)

  return (
    <div className="mb-4">
      {/* Comment Body */}
      <div className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-slate-600">
            {comment.user.name[0]}
          </span>
        </div>
        <div className="flex-1">
          <div className="bg-slate-50 p-3 rounded-lg border">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">{comment.user.name}</span>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-700">{comment.content}</p>
          </div>
          <button 
            onClick={() => onReply(comment)}
            className="text-xs text-blue-600 font-medium mt-1 ml-1 hover:underline flex items-center gap-1"
          >
            <Reply className="w-3 h-3" /> Reply
          </button>
        </div>
      </div>

      {/* Render Replies (Nested) */}
      {replies.length > 0 && (
        <div className="ml-11 mt-2 border-l-2 pl-4">
          {replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              allComments={allComments} 
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CommentSection({ issueId, currentUser }) {
  const [comments, setComments] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState(null) // The comment we are replying to

  // Load comments only when opened to save bandwidth
  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      getIssueComments(issueId)
        .then(setComments)
        .finally(() => setLoading(false))
    }
  }, [isOpen, issueId])

  const handleSubmit = async () => {
    if (!newComment.trim()) return

    // Optimistic Update
    const tempId = Date.now().toString()
    const tempComment = {
      id: tempId,
      content: newComment,
      parentId: replyTo?.id || null,
      createdAt: new Date(),
      user: { name: "You", role: "STUDENT" } // Placeholder
    }
    
    setComments([...comments, tempComment])
    setNewComment("")
    setReplyTo(null)

    await addComment(issueId, newComment, replyTo?.id)
    // Refresh real data
    const freshData = await getIssueComments(issueId)
    setComments(freshData)
  }

  return (
    <div className="mt-4">
      {/* Toggle Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-blue-600"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {isOpen ? "Hide Comments" : `Show Comments`}
      </Button>

      {isOpen && (
        <div className="mt-4 border-t pt-4 animate-in fade-in slide-in-from-top-2">
          
          {/* List */}
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {comments
                .filter(c => !c.parentId) // Start with top-level
                .map(c => (
                  <CommentItem 
                    key={c.id} 
                    comment={c} 
                    allComments={comments} 
                    onReply={setReplyTo} 
                  />
                ))}
              {comments.length === 0 && <p className="text-sm text-gray-400 text-center">No comments yet.</p>}
            </div>
          )}

          {/* Input Area */}
          <div className="mt-4 flex gap-3 items-start bg-gray-50 p-3 rounded-md">
            <div className="flex-1">
              {replyTo && (
                <div className="flex justify-between text-xs text-blue-600 mb-2 bg-blue-50 p-1 px-2 rounded">
                  <span>Replying to <b>{replyTo.user.name}</b></span>
                  <button onClick={() => setReplyTo(null)} className="hover:font-bold">✕</button>
                </div>
              )}
              <Textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-[60px] text-sm"
              />
            </div>
            <Button size="sm" onClick={handleSubmit} disabled={!newComment.trim()}>
              Post
            </Button>
          </div>

        </div>
      )}
    </div>
  )
}