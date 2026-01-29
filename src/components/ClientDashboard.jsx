"use client"
import IssueCard from './IssueCard'
import { useState,useEffect } from 'react'

export default function ClientDashboard({ userId }) {
 
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetch('/api/issues')
    .then(res => res.json())
    .then(data => {
      // Check if data.issues exists (from your paginated API)
      // otherwise fallback to data (if it's a plain array)
      const issueList = data.issues || data; 
      
      if (Array.isArray(issueList)) {
        setIssues(issueList);
      } else {
        setIssues([]); // Fallback to empty array to prevent crash
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Fetch error:", err);
      setIssues([]); 
      setLoading(false);
    });
}, []);

  if (loading) return <p>Loading hostel issues...</p>;

  return (
    <div className="space-y-4">
      {issues?.map((issue) => (
        <IssueCard 
          key={issue.id} 
          issue={issue} 
          currentUserId={userId} 
        />
      ))}
    </div>
  )
}