import { auth } from '../../auth'
import { redirect } from 'next/navigation'
import CreateIssueForm from '../../../components/CreateIssueForm'
import { prisma } from '../../../lib/prisma' // Or use the action above
import { getHostels } from '../../actions/location'

export default async function CreateIssuePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // 1. Fetch Categories (You likely already have this)
  const categories = await prisma.issueCategory.findMany({
    where: { isActive: true }
  })

  // 2. Fetch Hostels (For Staff Override)
  const hostels = await getHostels()

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Report an Issue</h1>
      
      <CreateIssueForm 
        userRole={session.user.role} 
        categories={categories}
        hostels={hostels}
      />
    </div>
  )
}