import { auth } from '../../auth'
import { prisma } from '../../../lib/prisma'
import IssueCard from '../../../components/IssueCard'
import { redirect } from 'next/navigation'

export default async function DashboardFeed() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // 1. Fetch Issues specific to the User's Hostel
  const issues = await prisma.issue.findMany({
    where: {
      hostelName: session.user.hostelName, // THE SMART FILTER
      visibility: 'PUBLIC',
      isDuplicate: false, // Don't show merged duplicates
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { upvotes: true }
      },
      // Hack to check if current user upvoted this issue
      upvotes: {
        where: { userId: session.user.id },
        select: { userId: true }
      }
    }
  })

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Live Feed: {session.user.hostelName}
      </h1>
      
      {issues.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No issues reported yet. 🎉</p>
      ) : (
        issues.map((issue) => (
          <IssueCard 
            key={issue.id} 
            issue={issue} 
            currentUserId={session.user.id} 
          />
        ))
      )}
    </div>
  )
}